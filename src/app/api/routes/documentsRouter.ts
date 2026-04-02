import {
  ApiRouteDefinition,
  ApiRouteRequest,
  ApiRouteResponse,
  ApiRouter,
  createApiRouter,
  jsonResponse,
} from './router';
import { extractTenantContext, AuthError } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { providerRegistry } from '../../lib/providers/providerRegistry';
import { supabaseServer as supabase } from '../../../lib/supabaseServer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function withTenantContext<T>(
  request: ApiRouteRequest,
  run: (ctx: Awaited<ReturnType<typeof extractTenantContext>>) => Promise<T>
): Promise<T> {
  const ctx = await extractTenantContext(request.headers);
  return run(ctx);
}

function toErrorResponse(error: unknown): ApiRouteResponse {
  const statusCode =
    typeof (error as { statusCode?: unknown })?.statusCode === 'number'
      ? (error as { statusCode: number }).statusCode
      : error instanceof AuthError
      ? 401
      : 500;

  const message =
    error instanceof Error ? error.message : 'Internal server error';

  return jsonResponse(statusCode, { error: message });
}

// ── Route implementations ─────────────────────────────────────────────────────

/**
 * POST /api/documents/upload-url
 * Get a pre-signed S3 upload URL for a new document.
 * Body: { filename, contentType, caseId?, clientId?, documentType? }
 */
async function getUploadUrlHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:write');

      const body = (request.body ?? {}) as {
        filename?: string;
        contentType?: string;
        caseId?: string;
        clientId?: string;
        documentType?: string;
      };

      if (!body.filename) {
        return jsonResponse(400, { error: 'filename is required' });
      }
      if (!body.contentType) {
        return jsonResponse(400, { error: 'contentType is required' });
      }

      const documentId = crypto.randomUUID();
      const key = `${ctx.organizationId}/${body.caseId ?? 'general'}/${documentId}/${body.filename}`;

      const storageObject = await providerRegistry.storage.createUploadTarget({
        organizationId: ctx.organizationId,
        clientId: body.clientId ?? 'unknown',
        runId: documentId,
        evidenceId: documentId,
        filename: body.filename,
        contentType: body.contentType,
      });

      const now = new Date().toISOString();

      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          id: documentId,
          organization_id: ctx.organizationId,
          case_id: body.caseId ?? null,
          client_id: body.clientId ?? null,
          document_type: body.documentType ?? null,
          filename: body.filename,
          content_type: body.contentType,
          s3_key: key,
          s3_bucket: storageObject.bucket,
          status: 'pending_upload',
          notes: null,
          verified_at: null,
          uploaded_at: null,
          created_at: now,
          updated_at: now,
        });

      if (dbError) {
        return jsonResponse(500, { error: dbError.message });
      }

      // Generate a signed upload URL via Supabase storage
      const { data: signedData, error: signedError } = await supabase.storage
        .from(storageObject.bucket)
        .createSignedUploadUrl(key);

      if (signedError || !signedData?.signedUrl) {
        return jsonResponse(500, {
          error: signedError?.message ?? 'Failed to generate upload URL',
        });
      }

      return jsonResponse(200, {
        uploadUrl: signedData.signedUrl,
        documentId,
        key,
      });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * GET /api/documents
 * List documents for the caller's organization.
 * Query params: caseId, clientId
 */
async function listDocumentsHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:read');

      const { caseId, clientId } = request.query ?? {};

      let query = supabase
        .from('documents')
        .select('*')
        .eq('organization_id', ctx.organizationId)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });

      if (caseId) {
        query = query.eq('case_id', caseId);
      }
      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;
      if (error) {
        return jsonResponse(500, { error: error.message });
      }

      return jsonResponse(200, { documents: data ?? [] });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * GET /api/documents/:id
 * Get document metadata by ID.
 */
async function getDocumentByIdHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:read');

      const id = request.params?.id;
      if (!id) {
        return jsonResponse(400, { error: 'Document ID is required' });
      }

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .eq('organization_id', ctx.organizationId)
        .neq('status', 'deleted')
        .single();

      if (error || !data) {
        return jsonResponse(404, { error: 'Document not found' });
      }

      return jsonResponse(200, { document: data });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * GET /api/documents/:id/download-url
 * Get a pre-signed download URL for the document.
 */
async function getDownloadUrlHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:read');

      const id = request.params?.id;
      if (!id) {
        return jsonResponse(400, { error: 'Document ID is required' });
      }

      const { data: doc, error: dbError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .eq('organization_id', ctx.organizationId)
        .neq('status', 'deleted')
        .single();

      if (dbError || !doc) {
        return jsonResponse(404, { error: 'Document not found' });
      }

      const downloadRef = await providerRegistry.storage.createDownloadUrl({
        bucket: doc.s3_bucket,
        key: doc.s3_key,
        expiresInSeconds: 900,
        organizationId: ctx.organizationId,
      });

      return jsonResponse(200, {
        url: downloadRef.url,
        expiresAt: downloadRef.expiresAt,
      });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * PATCH /api/documents/:id
 * Update document metadata (verify, add notes, change status).
 * Body: { status?, verifiedAt?, notes? }
 */
async function updateDocumentHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:write');

      const id = request.params?.id;
      if (!id) {
        return jsonResponse(400, { error: 'Document ID is required' });
      }

      const body = (request.body ?? {}) as {
        status?: string;
        verifiedAt?: string;
        notes?: string;
      };

      const patch: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (body.status !== undefined) patch.status = body.status;
      if (body.verifiedAt !== undefined) patch.verified_at = body.verifiedAt;
      if (body.notes !== undefined) patch.notes = body.notes;

      const { data, error } = await supabase
        .from('documents')
        .update(patch)
        .eq('id', id)
        .eq('organization_id', ctx.organizationId)
        .neq('status', 'deleted')
        .select()
        .single();

      if (error || !data) {
        return jsonResponse(404, { error: 'Document not found or update failed' });
      }

      return jsonResponse(200, { document: data });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * DELETE /api/documents/:id
 * Soft-delete a document by setting status = 'deleted'.
 */
async function deleteDocumentHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:write');

      const id = request.params?.id;
      if (!id) {
        return jsonResponse(400, { error: 'Document ID is required' });
      }

      const { data, error } = await supabase
        .from('documents')
        .update({
          status: 'deleted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('organization_id', ctx.organizationId)
        .neq('status', 'deleted')
        .select()
        .single();

      if (error || !data) {
        return jsonResponse(404, { error: 'Document not found' });
      }

      return jsonResponse(200, { success: true });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

// ── Route table ───────────────────────────────────────────────────────────────

const routes: ApiRouteDefinition[] = [
  {
    method: 'POST',
    path: '/api/documents/upload-url',
    handler: getUploadUrlHandler,
  },
  {
    method: 'GET',
    path: '/api/documents',
    handler: listDocumentsHandler,
  },
  {
    method: 'GET',
    path: '/api/documents/:id',
    handler: getDocumentByIdHandler,
  },
  {
    method: 'GET',
    path: '/api/documents/:id/download-url',
    handler: getDownloadUrlHandler,
  },
  {
    method: 'PATCH',
    path: '/api/documents/:id',
    handler: updateDocumentHandler,
  },
  {
    method: 'DELETE',
    path: '/api/documents/:id',
    handler: deleteDocumentHandler,
  },
];

// ── Direct S3 upload handler (receives base64 buffer from multer middleware) ───

/**
 * POST /api/documents/upload
 * Accepts a base64-encoded file buffer forwarded from the multer middleware in
 * server/src/index.ts. Uploads the file directly to S3 and saves document
 * metadata to the `documents` table.
 * Body: { buffer (base64), originalname, mimetype, size, caseId?, clientId?, documentType? }
 */
async function directUploadHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:write');

      const body = (request.body ?? {}) as {
        buffer?: string;
        originalname?: string;
        mimetype?: string;
        size?: number;
        caseId?: string;
        clientId?: string;
        documentType?: string;
      };

      if (!body.buffer) {
        return jsonResponse(400, { error: 'file buffer is required' });
      }
      if (!body.originalname) {
        return jsonResponse(400, { error: 'originalname is required' });
      }

      const fileBuffer = Buffer.from(body.buffer, 'base64');
      const documentId = crypto.randomUUID();
      const s3Bucket =
        process.env.S3_BUCKET ??
        process.env.VITE_S3_BUCKET ??
        'growkyc-documents';
      const s3Key = `${ctx.organizationId}/${body.caseId ?? 'general'}/${documentId}/${body.originalname}`;
      const region =
        process.env.AWS_REGION ??
        process.env.SES_REGION ??
        'ap-southeast-2';

      // Upload to S3
      const s3 = new S3Client({ region });
      await s3.send(
        new PutObjectCommand({
          Bucket: s3Bucket,
          Key: s3Key,
          Body: fileBuffer,
          ContentType: body.mimetype ?? 'application/octet-stream',
          ContentLength: fileBuffer.byteLength,
          Metadata: {
            organization_id: ctx.organizationId,
            document_id: documentId,
            uploaded_by: ctx.userId,
          },
        })
      );

      const now = new Date().toISOString();

      const { data, error: dbError } = await supabase
        .from('documents')
        .insert({
          id: documentId,
          organization_id: ctx.organizationId,
          case_id: body.caseId ?? null,
          client_id: body.clientId ?? null,
          document_type: body.documentType ?? null,
          filename: body.originalname,
          content_type: body.mimetype ?? 'application/octet-stream',
          s3_key: s3Key,
          s3_bucket: s3Bucket,
          status: 'uploaded',
          notes: null,
          verified_at: null,
          uploaded_at: now,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (dbError) {
        return jsonResponse(500, { error: dbError.message });
      }

      return jsonResponse(201, {
        documentId,
        filename: body.originalname,
        s3Key,
        status: 'uploaded',
        document: data,
      });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

routes.push({
  method: 'POST',
  path: '/api/documents/upload',
  handler: directUploadHandler,
});

export const documentsRouter: ApiRouter = createApiRouter(routes);
export const documentRoutes: ApiRouteDefinition[] = routes;
// Aliased export to match the name expected by server/src/index.ts
export const documentsRoutes: ApiRouteDefinition[] = routes;

import {
  ApiRouteDefinition,
  ApiRouter,
  createApiRouter,
  jsonResponse,
  ApiRouteRequest,
  ApiRouteResponse,
} from './router';
import { extractTenantContext, AuthError } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { supabaseServer as supabase } from '../../../lib/supabaseServer';

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
  return jsonResponse(statusCode, {
    error: error instanceof Error ? error.message : 'Internal server error',
  });
}

const routes: ApiRouteDefinition[] = [
  // GET /api/austrac/reports — list all AUSTRAC reports
  {
    method: 'GET',
    path: '/api/austrac/reports',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          requirePermission(ctx, 'cases:read');

          const q = request.query ?? {};
          const limit = q.limit ? Number(q.limit) : 50;
          const offset = q.offset ? Number(q.offset) : 0;

          let query = supabase
            .from('austrac_reports')
            .select('*')
            .eq('organization_id', ctx.organizationId)
            .range(offset, offset + limit - 1);

          if (q.type) query = query.eq('report_type', q.type);
          if (q.status) query = query.eq('status', q.status);

          const { data, error } = await query;
          if (error) throw new Error(error.message);

          return jsonResponse(200, { reports: data ?? [] });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // POST /api/austrac/reports/smr — Submit Suspicious Matter Report
  {
    method: 'POST',
    path: '/api/austrac/reports/smr',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          requirePermission(ctx, 'cases:write');

          const body = (request.body ?? {}) as Record<string, unknown>;
          const {
            caseId,
            subjectName,
            subjectType,
            matterId,
            description,
            transactionDate,
            amount,
            currency,
            reportingEntityName,
          } = body;

          if (!caseId || !subjectName || !description) {
            return jsonResponse(400, {
              error: 'caseId, subjectName, and description are required',
            });
          }

          const now = new Date().toISOString();
          const record = {
            id: crypto.randomUUID(),
            organization_id: ctx.organizationId,
            case_id: caseId,
            report_type: 'SMR',
            subject_name: subjectName,
            description,
            amount: amount ?? null,
            currency: currency ?? null,
            status: 'draft',
            created_at: now,
            submitted_at: null,
            reference_number: null,
            metadata: {
              subjectType: subjectType ?? null,
              matterId: matterId ?? null,
              transactionDate: transactionDate ?? null,
              reportingEntityName: reportingEntityName ?? null,
            },
          };

          const { data, error } = await supabase
            .from('austrac_reports')
            .insert(record)
            .select()
            .single();

          if (error) throw new Error(error.message);

          return jsonResponse(201, { report: data });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // POST /api/austrac/reports/ttr — Submit Threshold Transaction Report
  {
    method: 'POST',
    path: '/api/austrac/reports/ttr',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          requirePermission(ctx, 'cases:write');

          const body = (request.body ?? {}) as Record<string, unknown>;
          const {
            caseId,
            subjectName,
            transactionAmount,
            currency,
            transactionDate,
            transactionType,
            reportingEntityName,
          } = body;

          if (!caseId || !subjectName || transactionAmount === undefined || !currency || !transactionDate || !transactionType) {
            return jsonResponse(400, {
              error: 'caseId, subjectName, transactionAmount, currency, transactionDate, and transactionType are required',
            });
          }

          const amount = Number(transactionAmount);
          if (isNaN(amount) || amount < 10000) {
            return jsonResponse(400, {
              error: 'TTR threshold requires transactionAmount >= AUD $10,000',
            });
          }

          const now = new Date().toISOString();
          const record = {
            id: crypto.randomUUID(),
            organization_id: ctx.organizationId,
            case_id: caseId,
            report_type: 'TTR',
            subject_name: subjectName,
            description: `Threshold Transaction Report: ${transactionType}`,
            amount,
            currency,
            status: 'draft',
            created_at: now,
            submitted_at: null,
            reference_number: null,
            metadata: {
              transactionDate,
              transactionType,
              reportingEntityName: reportingEntityName ?? null,
            },
          };

          const { data, error } = await supabase
            .from('austrac_reports')
            .insert(record)
            .select()
            .single();

          if (error) throw new Error(error.message);

          return jsonResponse(201, { report: data });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // POST /api/austrac/reports/ifti — International Funds Transfer Instruction
  {
    method: 'POST',
    path: '/api/austrac/reports/ifti',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          requirePermission(ctx, 'cases:write');

          const body = (request.body ?? {}) as Record<string, unknown>;
          const {
            caseId,
            senderName,
            receiverName,
            amount,
            currency,
            transferDate,
            fromCountry,
            toCountry,
            swift,
          } = body;

          if (!caseId || !senderName || !receiverName || amount === undefined || !currency || !transferDate || !fromCountry || !toCountry) {
            return jsonResponse(400, {
              error: 'caseId, senderName, receiverName, amount, currency, transferDate, fromCountry, and toCountry are required',
            });
          }

          const now = new Date().toISOString();
          const record = {
            id: crypto.randomUUID(),
            organization_id: ctx.organizationId,
            case_id: caseId,
            report_type: 'IFTI',
            subject_name: senderName as string,
            description: `International Funds Transfer: ${senderName} -> ${receiverName} (${fromCountry} -> ${toCountry})`,
            amount: Number(amount),
            currency,
            status: 'draft',
            created_at: now,
            submitted_at: null,
            reference_number: null,
            metadata: {
              senderName,
              receiverName,
              transferDate,
              fromCountry,
              toCountry,
              swift: swift ?? null,
            },
          };

          const { data, error } = await supabase
            .from('austrac_reports')
            .insert(record)
            .select()
            .single();

          if (error) throw new Error(error.message);

          return jsonResponse(201, { report: data });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // GET /api/austrac/reports/:id — Get report by ID
  {
    method: 'GET',
    path: '/api/austrac/reports/:id',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          requirePermission(ctx, 'cases:read');

          const id = request.params?.id;
          if (!id) return jsonResponse(400, { error: 'Report ID is required' });

          const { data, error } = await supabase
            .from('austrac_reports')
            .select('*')
            .eq('id', id)
            .eq('organization_id', ctx.organizationId)
            .single();

          if (error || !data) {
            return jsonResponse(404, { error: 'Report not found' });
          }

          return jsonResponse(200, { report: data });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // PATCH /api/austrac/reports/:id/submit — Mark report as submitted
  {
    method: 'PATCH',
    path: '/api/austrac/reports/:id/submit',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          requirePermission(ctx, 'cases:status_update');

          const id = request.params?.id;
          if (!id) return jsonResponse(400, { error: 'Report ID is required' });

          // Verify ownership first
          const { data: existing, error: fetchError } = await supabase
            .from('austrac_reports')
            .select('id, organization_id, status')
            .eq('id', id)
            .eq('organization_id', ctx.organizationId)
            .single();

          if (fetchError || !existing) {
            return jsonResponse(404, { error: 'Report not found' });
          }

          if (existing.status === 'submitted') {
            return jsonResponse(409, { error: 'Report has already been submitted' });
          }

          const now = new Date().toISOString();
          const referenceNumber = `AUSTRAC-${Date.now()}`;

          const { data, error } = await supabase
            .from('austrac_reports')
            .update({
              status: 'submitted',
              submitted_at: now,
              reference_number: referenceNumber,
            })
            .eq('id', id)
            .eq('organization_id', ctx.organizationId)
            .select()
            .single();

          if (error) throw new Error(error.message);

          return jsonResponse(200, { report: data });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // GET /api/austrac/reports/:id/status — Get submission status
  {
    method: 'GET',
    path: '/api/austrac/reports/:id/status',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          requirePermission(ctx, 'cases:read');

          const id = request.params?.id;
          if (!id) return jsonResponse(400, { error: 'Report ID is required' });

          const { data, error } = await supabase
            .from('austrac_reports')
            .select('id, report_type, status, submitted_at, reference_number, created_at, organization_id')
            .eq('id', id)
            .eq('organization_id', ctx.organizationId)
            .single();

          if (error || !data) {
            return jsonResponse(404, { error: 'Report not found' });
          }

          return jsonResponse(200, {
            id: data.id,
            reportType: data.report_type,
            status: data.status,
            submittedAt: data.submitted_at,
            referenceNumber: data.reference_number,
            createdAt: data.created_at,
          });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },
];

export const austracRouter: ApiRouter = createApiRouter(routes);
export const austracRoutes: ApiRouteDefinition[] = routes;

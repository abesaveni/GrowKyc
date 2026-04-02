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
import {
  buildBotAuditEvent,
  botAuditEventWriter,
} from '../lib/audit/botAuditEventWriter';
import { CaseRecord, CaseStatus } from '../../services/BotTypes';

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
 * GET /api/cases
 * List cases for the caller's organization.
 * Query params: status, clientId, limit (default 50), offset (default 0)
 */
async function listCasesHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:read');

      const { status, clientId, limit: limitStr, offset: offsetStr } =
        request.query ?? {};
      const limit = limitStr ? Math.min(parseInt(limitStr, 10), 200) : 50;
      const offset = offsetStr ? parseInt(offsetStr, 10) : 0;

      let query = supabase
        .from('cases')
        .select('*')
        .eq('organization_id', ctx.organizationId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }
      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;
      if (error) {
        return jsonResponse(500, { error: error.message });
      }

      return jsonResponse(200, { cases: data ?? [], total: (data ?? []).length });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * POST /api/cases
 * Create a new case.
 * Body: { clientId, clientName, assignedToUserId?, metadata? }
 */
async function createCaseHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:write');

      const body = (request.body ?? {}) as {
        clientId?: string;
        clientName?: string;
        assignedToUserId?: string;
        metadata?: Record<string, unknown>;
      };

      if (!body.clientId) {
        return jsonResponse(400, { error: 'clientId is required' });
      }
      if (!body.clientName) {
        return jsonResponse(400, { error: 'clientName is required' });
      }

      const caseData: Omit<CaseRecord, 'id' | 'createdAt' | 'updatedAt'> = {
        organizationId: ctx.organizationId,
        clientId: body.clientId,
        assignedToUserId: body.assignedToUserId,
        status: 'open' as CaseStatus,
        legalHold: false,
        metadata: body.metadata,
      };

      const created = await providerRegistry.database.createCase(caseData);

      await botAuditEventWriter.write(
        buildBotAuditEvent({
          eventType: 'case_status_changed',
          ctx,
          target: { objectType: 'case', objectId: created.id },
          metadata: {
            action: 'case_created',
            clientId: body.clientId,
            clientName: body.clientName,
            status: 'open',
          },
        })
      );

      return jsonResponse(201, { case: created });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * GET /api/cases/:id
 * Get a single case by ID.
 */
async function getCaseByIdHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:read');

      const caseId = request.params?.id;
      if (!caseId) {
        return jsonResponse(400, { error: 'Case ID is required' });
      }

      const caseRecord = await providerRegistry.database.getCaseById(
        caseId,
        ctx.organizationId
      );

      if (!caseRecord) {
        return jsonResponse(404, { error: 'Case not found' });
      }

      return jsonResponse(200, { case: caseRecord });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * PATCH /api/cases/:id
 * Update a case's mutable fields.
 * Body: { status?, riskScore?, overallDecision?, metadata? }
 */
async function updateCaseHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:write');

      const caseId = request.params?.id;
      if (!caseId) {
        return jsonResponse(400, { error: 'Case ID is required' });
      }

      const body = (request.body ?? {}) as {
        status?: CaseStatus;
        riskScore?: number;
        overallDecision?: CaseRecord['overallDecision'];
        metadata?: Record<string, unknown>;
      };

      const patch: Partial<
        Pick<CaseRecord, 'status' | 'riskScore' | 'overallDecision' | 'metadata'>
      > = {};
      if (body.status !== undefined) patch.status = body.status;
      if (body.riskScore !== undefined) patch.riskScore = body.riskScore;
      if (body.overallDecision !== undefined) patch.overallDecision = body.overallDecision;
      if (body.metadata !== undefined) patch.metadata = body.metadata;

      await providerRegistry.database.updateCase(caseId, ctx.organizationId, patch);

      await botAuditEventWriter.write(
        buildBotAuditEvent({
          eventType: 'case_status_changed',
          ctx,
          target: { objectType: 'case', objectId: caseId },
          metadata: {
            action: 'case_updated',
            patch,
          },
        })
      );

      return jsonResponse(200, { success: true });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * POST /api/cases/:id/legal-hold
 * Set or unset legal hold on a case.
 * Body: { hold: boolean, reason?, holdUntil? }
 */
async function legalHoldHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:legal_hold');

      const caseId = request.params?.id;
      if (!caseId) {
        return jsonResponse(400, { error: 'Case ID is required' });
      }

      const body = (request.body ?? {}) as {
        hold?: boolean;
        reason?: string;
        holdUntil?: string;
      };

      if (typeof body.hold !== 'boolean') {
        return jsonResponse(400, { error: '"hold" (boolean) is required' });
      }

      await providerRegistry.database.setLegalHold(
        caseId,
        ctx.organizationId,
        body.hold,
        {
          reason: body.reason,
          holdUntil: body.holdUntil,
          setByUserId: ctx.userId,
        }
      );

      await botAuditEventWriter.write(
        buildBotAuditEvent({
          eventType: 'case_status_changed',
          ctx,
          target: { objectType: 'case', objectId: caseId },
          metadata: {
            action: body.hold ? 'legal_hold_set' : 'legal_hold_removed',
            reason: body.reason,
            holdUntil: body.holdUntil,
          },
        })
      );

      return jsonResponse(200, { success: true });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * GET /api/cases/:id/findings
 * Get all findings for a case.
 */
async function getCaseFindingsHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'findings:read');

      const caseId = request.params?.id;
      if (!caseId) {
        return jsonResponse(400, { error: 'Case ID is required' });
      }

      const findings = await providerRegistry.database.getFindingsByCaseId(
        caseId,
        ctx.organizationId
      );

      return jsonResponse(200, { findings });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

// ── Route definitions ─────────────────────────────────────────────────────────

const routes: ApiRouteDefinition[] = [
  {
    method: 'GET',
    path: '/api/cases',
    handler: listCasesHandler,
  },
  {
    method: 'POST',
    path: '/api/cases',
    handler: createCaseHandler,
  },
  {
    method: 'GET',
    path: '/api/cases/:id',
    handler: getCaseByIdHandler,
  },
  {
    method: 'PATCH',
    path: '/api/cases/:id',
    handler: updateCaseHandler,
  },
  {
    method: 'POST',
    path: '/api/cases/:id/legal-hold',
    handler: legalHoldHandler,
  },
  {
    method: 'GET',
    path: '/api/cases/:id/findings',
    handler: getCaseFindingsHandler,
  },
];

export const casesRouter: ApiRouter = createApiRouter(routes);
export const casesRoutes: ApiRouteDefinition[] = routes;

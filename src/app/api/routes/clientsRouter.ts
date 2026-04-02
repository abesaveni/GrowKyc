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
import { supabaseServer as supabase } from '../../../lib/supabaseServer';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ClientType = 'individual' | 'entity';
export type ClientStatus = 'active' | 'inactive' | 'suspended' | 'archived';
export type RiskTier = 'low' | 'medium' | 'high' | 'critical';

export interface ClientRecord {
  id: string;
  organization_id: string;
  name: string;
  email?: string;
  phone?: string;
  type: ClientType;
  entity_type?: string;
  country_code?: string;
  risk_tier?: RiskTier;
  status: ClientStatus;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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
 * GET /api/clients
 * List clients for the caller's organization.
 * Query params: search, status, limit (default 50), offset (default 0)
 */
async function listClientsHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:read');

      const { search, status, limit: limitStr, offset: offsetStr } =
        request.query ?? {};
      const limit = limitStr ? Math.min(parseInt(limitStr, 10), 200) : 50;
      const offset = offsetStr ? parseInt(offsetStr, 10) : 0;

      let query = supabase
        .from('clients')
        .select('*')
        .eq('organization_id', ctx.organizationId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;
      if (error) {
        return jsonResponse(500, { error: error.message });
      }

      return jsonResponse(200, { clients: data ?? [], total: (data ?? []).length });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * POST /api/clients
 * Create a new client.
 * Body: { name, email?, phone?, type, entityType?, countryCode?, riskTier?, metadata? }
 */
async function createClientHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:write');

      const body = (request.body ?? {}) as {
        name?: string;
        email?: string;
        phone?: string;
        type?: ClientType;
        entityType?: string;
        countryCode?: string;
        riskTier?: RiskTier;
        metadata?: Record<string, unknown>;
      };

      if (!body.name || body.name.trim() === '') {
        return jsonResponse(400, { error: 'name is required' });
      }
      if (!body.type || !['individual', 'entity'].includes(body.type)) {
        return jsonResponse(400, {
          error: 'type is required and must be "individual" or "entity"',
        });
      }

      const now = new Date().toISOString();
      const newClient: ClientRecord = {
        id: crypto.randomUUID(),
        organization_id: ctx.organizationId,
        name: body.name.trim(),
        email: body.email,
        phone: body.phone,
        type: body.type,
        entity_type: body.entityType,
        country_code: body.countryCode,
        risk_tier: body.riskTier,
        status: 'active',
        metadata: body.metadata,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(newClient)
        .select()
        .single();

      if (error) {
        return jsonResponse(500, { error: error.message });
      }

      return jsonResponse(201, { client: data });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * GET /api/clients/:id
 * Get a single client by ID.
 */
async function getClientByIdHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:read');

      const clientId = request.params?.id;
      if (!clientId) {
        return jsonResponse(400, { error: 'Client ID is required' });
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .eq('organization_id', ctx.organizationId)
        .single();

      if (error || !data) {
        return jsonResponse(404, { error: 'Client not found' });
      }

      return jsonResponse(200, { client: data });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * PATCH /api/clients/:id
 * Update a client's fields.
 * Body: any subset of updatable client fields.
 */
async function updateClientHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:write');

      const clientId = request.params?.id;
      if (!clientId) {
        return jsonResponse(400, { error: 'Client ID is required' });
      }

      const body = (request.body ?? {}) as Partial<{
        name: string;
        email: string;
        phone: string;
        type: ClientType;
        entity_type: string;
        country_code: string;
        risk_tier: RiskTier;
        status: ClientStatus;
        metadata: Record<string, unknown>;
      }>;

      // Build patch, only picking known updatable columns
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      const updatableFields = [
        'name',
        'email',
        'phone',
        'type',
        'entity_type',
        'country_code',
        'risk_tier',
        'status',
        'metadata',
      ] as const;
      for (const field of updatableFields) {
        if (body[field] !== undefined) {
          patch[field] = body[field];
        }
      }

      const { error } = await supabase
        .from('clients')
        .update(patch)
        .eq('id', clientId)
        .eq('organization_id', ctx.organizationId);

      if (error) {
        return jsonResponse(500, { error: error.message });
      }

      return jsonResponse(200, { success: true });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * GET /api/clients/:id/cases
 * Get all cases associated with a client.
 */
async function getClientCasesHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:read');

      const clientId = request.params?.id;
      if (!clientId) {
        return jsonResponse(400, { error: 'Client ID is required' });
      }

      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('client_id', clientId)
        .eq('organization_id', ctx.organizationId)
        .order('created_at', { ascending: false });

      if (error) {
        return jsonResponse(500, { error: error.message });
      }

      return jsonResponse(200, { cases: data ?? [] });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * GET /api/clients/:id/risk-profile
 * Get a computed risk profile summary for a client based on their cases.
 */
async function getClientRiskProfileHandler(
  request: ApiRouteRequest
): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:read');

      const clientId = request.params?.id;
      if (!clientId) {
        return jsonResponse(400, { error: 'Client ID is required' });
      }

      // Verify the client exists and belongs to this org
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('id, name, risk_tier, status')
        .eq('id', clientId)
        .eq('organization_id', ctx.organizationId)
        .single();

      if (clientError || !client) {
        return jsonResponse(404, { error: 'Client not found' });
      }

      // Fetch all cases to compute summary stats
      const { data: cases, error: casesError } = await supabase
        .from('cases')
        .select('id, status, risk_score, overall_decision, created_at, updated_at')
        .eq('client_id', clientId)
        .eq('organization_id', ctx.organizationId)
        .order('created_at', { ascending: false });

      if (casesError) {
        return jsonResponse(500, { error: casesError.message });
      }

      const caseList = cases ?? [];

      // Compute aggregate risk metrics
      const scores = caseList
        .map((c: Record<string, unknown>) => c.risk_score as number)
        .filter((s: unknown): s is number => typeof s === 'number');
      const averageRiskScore =
        scores.length > 0
          ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
          : null;
      const maxRiskScore = scores.length > 0 ? Math.max(...scores) : null;

      const statusCounts = caseList.reduce(
        (acc: Record<string, number>, c: Record<string, unknown>) => {
          const st = String(c.status ?? 'unknown');
          acc[st] = (acc[st] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const decisionCounts = caseList.reduce(
        (acc: Record<string, number>, c: Record<string, unknown>) => {
          if (c.overall_decision) {
            const od = String(c.overall_decision);
            acc[od] = (acc[od] ?? 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>
      );

      const openCases = caseList.filter(
        (c: Record<string, unknown>) =>
          c.status === 'open' || c.status === 'in_review' || c.status === 'escalated'
      ).length;

      const legalHoldCases = caseList.filter(
        (c: Record<string, unknown>) => c.status === 'legal_hold'
      ).length;

      const mostRecentCase = caseList[0] ?? null;

      return jsonResponse(200, {
        riskProfile: {
          clientId,
          clientName: (client as Record<string, unknown>).name,
          currentRiskTier: (client as Record<string, unknown>).risk_tier ?? null,
          clientStatus: (client as Record<string, unknown>).status,
          caseStats: {
            totalCases: caseList.length,
            openCases,
            legalHoldCases,
            statusBreakdown: statusCounts,
            decisionBreakdown: decisionCounts,
          },
          riskScoreStats: {
            averageRiskScore,
            maxRiskScore,
            sampleCount: scores.length,
          },
          mostRecentCaseId: mostRecentCase
            ? (mostRecentCase as Record<string, unknown>).id
            : null,
          mostRecentCaseUpdatedAt: mostRecentCase
            ? (mostRecentCase as Record<string, unknown>).updated_at
            : null,
          computedAt: new Date().toISOString(),
        },
      });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

// ── Route definitions ─────────────────────────────────────────────────────────

const routes: ApiRouteDefinition[] = [
  {
    method: 'GET',
    path: '/api/clients',
    handler: listClientsHandler,
  },
  {
    method: 'POST',
    path: '/api/clients',
    handler: createClientHandler,
  },
  {
    method: 'GET',
    path: '/api/clients/:id',
    handler: getClientByIdHandler,
  },
  {
    method: 'PATCH',
    path: '/api/clients/:id',
    handler: updateClientHandler,
  },
  {
    method: 'GET',
    path: '/api/clients/:id/cases',
    handler: getClientCasesHandler,
  },
  {
    method: 'GET',
    path: '/api/clients/:id/risk-profile',
    handler: getClientRiskProfileHandler,
  },
];

export const clientsRouter: ApiRouter = createApiRouter(routes);
export const clientRoutes: ApiRouteDefinition[] = routes;
// Aliased export to match the name expected by server/src/index.ts
export const clientsRoutes: ApiRouteDefinition[] = routes;

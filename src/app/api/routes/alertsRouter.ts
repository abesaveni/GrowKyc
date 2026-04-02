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
import { providerRegistry } from '../../lib/providers/providerRegistry';
import type { AlertType, FindingSeverity } from '../../services/BotTypes';

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
  // GET /api/alerts/summary — alert summary counts (must be before /:id)
  {
    method: 'GET',
    path: '/api/alerts/summary',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          requirePermission(ctx, 'alerts:read');

          const { data, error } = await supabase
            .from('alerts')
            .select('status, severity')
            .eq('organization_id', ctx.organizationId);

          if (error) throw new Error(error.message);

          const records = data ?? [];
          const summary = {
            total: records.length,
            open: records.filter((r) => r.status === 'open').length,
            acknowledged: records.filter((r) => r.status === 'acknowledged').length,
            resolved: records.filter((r) => r.status === 'resolved').length,
            by_severity: {
              low: records.filter((r) => r.severity === 'low').length,
              medium: records.filter((r) => r.severity === 'medium').length,
              high: records.filter((r) => r.severity === 'high').length,
              critical: records.filter((r) => r.severity === 'critical').length,
            },
          };

          return jsonResponse(200, summary);
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // GET /api/alerts — list alerts
  {
    method: 'GET',
    path: '/api/alerts',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          requirePermission(ctx, 'alerts:read');

          const q = request.query ?? {};
          const limit = q.limit ? Number(q.limit) : 50;

          let query = supabase
            .from('alerts')
            .select('*')
            .eq('organization_id', ctx.organizationId)
            .limit(limit);

          if (q.status) query = query.eq('status', q.status);
          if (q.severity) query = query.eq('severity', q.severity);
          if (q.type) query = query.eq('alert_type', q.type);
          if (q.caseId) query = query.eq('case_id', q.caseId);

          const { data, error } = await query;
          if (error) throw new Error(error.message);

          return jsonResponse(200, { alerts: data ?? [] });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // POST /api/alerts — create alert manually
  {
    method: 'POST',
    path: '/api/alerts',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          requirePermission(ctx, 'cases:write');

          const body = (request.body ?? {}) as Record<string, unknown>;
          const { caseId, clientId, type, severity, title, description } = body;

          if (!type || !severity || !title) {
            return jsonResponse(400, { error: 'type, severity, and title are required' });
          }

          const alert = await providerRegistry.database.createAlert({
            organizationId: ctx.organizationId,
            caseId: caseId as string | undefined,
            alertType: type as AlertType,
            title: title as string,
            description: description as string | undefined,
            isResolved: false,
            metadata: clientId ? { clientId } : undefined,
          });

          return jsonResponse(201, { alert });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // GET /api/alerts/:id — get alert by ID
  {
    method: 'GET',
    path: '/api/alerts/:id',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          requirePermission(ctx, 'alerts:read');

          const id = request.params?.id;
          if (!id) return jsonResponse(400, { error: 'Alert ID is required' });

          const { data, error } = await supabase
            .from('alerts')
            .select('*')
            .eq('id', id)
            .eq('organization_id', ctx.organizationId)
            .single();

          if (error || !data) {
            return jsonResponse(404, { error: 'Alert not found' });
          }

          return jsonResponse(200, { alert: data });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // POST /api/alerts/:id/acknowledge — acknowledge alert
  {
    method: 'POST',
    path: '/api/alerts/:id/acknowledge',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          requirePermission(ctx, 'alerts:read');

          const id = request.params?.id;
          if (!id) return jsonResponse(400, { error: 'Alert ID is required' });

          // Verify ownership
          const { data: existing, error: fetchError } = await supabase
            .from('alerts')
            .select('id, organization_id, status')
            .eq('id', id)
            .eq('organization_id', ctx.organizationId)
            .single();

          if (fetchError || !existing) {
            return jsonResponse(404, { error: 'Alert not found' });
          }

          const { data, error } = await supabase
            .from('alerts')
            .update({
              status: 'acknowledged',
              updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .eq('organization_id', ctx.organizationId)
            .select()
            .single();

          if (error) throw new Error(error.message);

          return jsonResponse(200, { alert: data });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // POST /api/alerts/:id/resolve — resolve alert
  {
    method: 'POST',
    path: '/api/alerts/:id/resolve',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          requirePermission(ctx, 'alerts:resolve');

          const id = request.params?.id;
          if (!id) return jsonResponse(400, { error: 'Alert ID is required' });

          const body = (request.body ?? {}) as Record<string, unknown>;
          const { resolutionNote } = body;

          // Verify ownership
          const { data: existing, error: fetchError } = await supabase
            .from('alerts')
            .select('id, organization_id')
            .eq('id', id)
            .eq('organization_id', ctx.organizationId)
            .single();

          if (fetchError || !existing) {
            return jsonResponse(404, { error: 'Alert not found' });
          }

          await providerRegistry.database.resolveAlert(id, ctx.organizationId, {
            resolvedByUserId: ctx.userId,
            resolutionNote: resolutionNote as string | undefined,
          });

          return jsonResponse(200, { success: true, id });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },
];

export const alertsRouter: ApiRouter = createApiRouter(routes);
export const alertRoutes: ApiRouteDefinition[] = routes;
// Aliased export to match the name expected by server/src/index.ts
export const alertsRoutes: ApiRouteDefinition[] = routes;

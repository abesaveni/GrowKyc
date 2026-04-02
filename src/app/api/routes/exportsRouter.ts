import {
  ApiRouteDefinition,
  ApiRouteRequest,
  ApiRouteResponse,
  ApiRouter,
  createApiRouter,
  jsonResponse,
} from './router';
import { extractTenantContext, AuthError } from '../middleware/auth';
import {
  requestAuditPackExportHandler,
  requestEvidenceBundleExportHandler,
  requestReportExportHandler,
} from '../handlers/exports/requestExportHandler';

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
      ? ((error as { statusCode: number }).statusCode)
      : error instanceof AuthError
      ? 401
      : 500;

  const message = error instanceof Error ? error.message : 'Internal server error';

  return jsonResponse(statusCode, {
    error: message,
  });
}

const routes: ApiRouteDefinition[] = [
  {
    method: 'POST',
    path: '/api/exports/report',
    handler: async (request) => {
      try {
        const result = await withTenantContext(request, async (ctx) => {
          return requestReportExportHandler(request.body, ctx);
        });

        return jsonResponse(202, result);
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },
  {
    method: 'POST',
    path: '/api/exports/audit-pack',
    handler: async (request) => {
      try {
        const result = await withTenantContext(request, async (ctx) => {
          return requestAuditPackExportHandler(request.body, ctx);
        });

        return jsonResponse(202, result);
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },
  {
    method: 'POST',
    path: '/api/exports/evidence-bundle',
    handler: async (request) => {
      try {
        const result = await withTenantContext(request, async (ctx) => {
          return requestEvidenceBundleExportHandler(request.body, ctx);
        });

        return jsonResponse(202, result);
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },
];

export const exportsRouter: ApiRouter = createApiRouter(routes);
export const exportRoutes: ApiRouteDefinition[] = routes;

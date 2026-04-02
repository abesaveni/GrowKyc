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
  runOneBotHandler,
  RunOneBotRequest,
} from '../handlers/bots/runOneBotHandler';
import {
  runAllBotsHandler,
  RunAllBotsRequest,
} from '../handlers/bots/runAllBotsHandler';
import {
  auditEventsHandler,
  AuditEventsRequest,
} from '../handlers/bots/auditEventsHandler';

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

function toRunOneBotRequest(body: unknown): RunOneBotRequest {
  return (body ?? {}) as RunOneBotRequest;
}

function toRunAllBotsRequest(body: unknown): RunAllBotsRequest {
  return (body ?? {}) as RunAllBotsRequest;
}

function toAuditEventsRequest(query: Record<string, string | undefined> | undefined): AuditEventsRequest {
  if (!query) {
    return {};
  }

  return {
    actorUserId: query.actorUserId,
    eventType: query.eventType,
    action: query.action,
    resourceType: query.resourceType,
    resourceId: query.resourceId,
    severity: query.severity as AuditEventsRequest['severity'],
    fromDate: query.fromDate,
    toDate: query.toDate,
    limit: query.limit ? Number(query.limit) : undefined,
    cursor: query.cursor,
  };
}

const routes: ApiRouteDefinition[] = [
  {
    method: 'POST',
    path: '/api/bots/run-one',
    handler: async (request) => {
      try {
        const result = await withTenantContext(request, async (ctx) => {
          return runOneBotHandler(toRunOneBotRequest(request.body), ctx);
        });

        return jsonResponse(200, result);
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },
  {
    method: 'POST',
    path: '/api/bots/run-all',
    handler: async (request) => {
      try {
        const result = await withTenantContext(request, async (ctx) => {
          return runAllBotsHandler(toRunAllBotsRequest(request.body), ctx);
        });

        return jsonResponse(200, result);
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },
  {
    method: 'GET',
    path: '/api/bots/audit-events',
    handler: async (request) => {
      try {
        const result = await withTenantContext(request, async (ctx) => {
          return auditEventsHandler(toAuditEventsRequest(request.query), ctx);
        });

        return jsonResponse(200, result);
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },
];

export const botsRouter: ApiRouter = createApiRouter(routes);
export const botRoutes: ApiRouteDefinition[] = routes;

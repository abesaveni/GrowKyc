export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRouteRequest {
  method: ApiMethod;
  path: string;
  headers: Record<string, string | undefined>;
  body?: unknown;
  query?: Record<string, string | undefined>;
}

export interface ApiRouteResponse {
  statusCode: number;
  body: unknown;
}

export type ApiRouteHandler = (request: ApiRouteRequest) => Promise<ApiRouteResponse>;

export interface ApiRouteDefinition {
  method: ApiMethod;
  path: string;
  handler: ApiRouteHandler;
}

export interface ApiRouter {
  handle(request: ApiRouteRequest): Promise<ApiRouteResponse>;
  routes: ApiRouteDefinition[];
}

export function createApiRouter(routes: ApiRouteDefinition[]): ApiRouter {
  return {
    routes,
    async handle(request: ApiRouteRequest): Promise<ApiRouteResponse> {
      const route = routes.find(
        (r) => r.method === request.method && r.path === request.path
      );

      if (!route) {
        return {
          statusCode: 404,
          body: { error: 'Route not found' },
        };
      }

      return route.handler(request);
    },
  };
}

export function jsonResponse(statusCode: number, body: unknown): ApiRouteResponse {
  return { statusCode, body };
}

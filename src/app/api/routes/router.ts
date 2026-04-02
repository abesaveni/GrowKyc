export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRouteRequest {
  method: ApiMethod;
  path: string;
  headers: Record<string, string | undefined>;
  body?: unknown;
  query?: Record<string, string | undefined>;
  /** Path parameters extracted from dynamic route segments, e.g. :id */
  params?: Record<string, string>;
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

/**
 * Match a route pattern against an actual path.
 * Segments prefixed with `:` are treated as named parameters.
 * Returns a map of param names to captured values, or null if no match.
 */
function matchPath(pattern: string, actual: string): Record<string, string> | null {
  const patternParts = pattern.split('/');
  const actualParts = actual.split('/');
  if (patternParts.length !== actualParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = actualParts[i];
    } else if (patternParts[i] !== actualParts[i]) {
      return null;
    }
  }
  return params;
}

export function createApiRouter(routes: ApiRouteDefinition[]): ApiRouter {
  return {
    routes,
    async handle(request: ApiRouteRequest): Promise<ApiRouteResponse> {
      for (const route of routes) {
        if (route.method !== request.method) continue;
        const params = matchPath(route.path, request.path);
        if (params !== null) {
          return route.handler({ ...request, params });
        }
      }

      return {
        statusCode: 404,
        body: { error: 'Route not found' },
      };
    },
  };
}

export function jsonResponse(statusCode: number, body: unknown): ApiRouteResponse {
  return { statusCode, body };
}

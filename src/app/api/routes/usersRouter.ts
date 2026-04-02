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
 * GET /api/users
 * List all users in the caller's organization.
 */
async function listUsersHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:read');

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('organization_id', ctx.organizationId)
        .order('created_at', { ascending: false });

      if (error) {
        return jsonResponse(500, { error: error.message });
      }

      return jsonResponse(200, { users: data ?? [] });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * GET /api/users/me
 * Get the current authenticated user's profile.
 */
async function getCurrentUserHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', ctx.userId)
        .single();

      if (error || !data) {
        return jsonResponse(404, { error: 'User not found' });
      }

      return jsonResponse(200, { user: data });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * PATCH /api/users/me
 * Update the current user's profile.
 * Body: { name?, phone?, preferences? }
 */
async function updateCurrentUserHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      const body = (request.body ?? {}) as {
        name?: string;
        phone?: string;
        preferences?: Record<string, unknown>;
      };

      const patch: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (body.name !== undefined) patch.name = body.name;
      if (body.phone !== undefined) patch.phone = body.phone;
      if (body.preferences !== undefined) patch.preferences = body.preferences;

      const { data, error } = await supabase
        .from('users')
        .update(patch)
        .eq('id', ctx.userId)
        .select()
        .single();

      if (error || !data) {
        return jsonResponse(500, { error: error?.message ?? 'Update failed' });
      }

      return jsonResponse(200, { user: data });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * GET /api/users/:id
 * Get a specific user by ID (must belong to the same organization).
 */
async function getUserByIdHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:read');

      const id = request.params?.id;
      if (!id) {
        return jsonResponse(400, { error: 'User ID is required' });
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .eq('organization_id', ctx.organizationId)
        .single();

      if (error || !data) {
        return jsonResponse(404, { error: 'User not found' });
      }

      return jsonResponse(200, { user: data });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * PATCH /api/users/:id/role
 * Change a user's role within the organization.
 * Body: { role }
 * Requires audit:write (admin only).
 */
async function updateUserRoleHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'audit:write');

      const id = request.params?.id;
      if (!id) {
        return jsonResponse(400, { error: 'User ID is required' });
      }

      const body = (request.body ?? {}) as { role?: string };
      if (!body.role) {
        return jsonResponse(400, { error: 'role is required' });
      }

      // Confirm target user exists in the same org before updating
      const { data: existing, error: lookupError } = await supabase
        .from('users')
        .select('id')
        .eq('id', id)
        .eq('organization_id', ctx.organizationId)
        .single();

      if (lookupError || !existing) {
        return jsonResponse(404, { error: 'User not found' });
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          role: body.role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('organization_id', ctx.organizationId)
        .select()
        .single();

      if (error || !data) {
        return jsonResponse(500, { error: error?.message ?? 'Role update failed' });
      }

      return jsonResponse(200, { user: data });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * POST /api/users/invite
 * Invite a user to the organization.
 * Body: { email, role, name? }
 * Requires audit:write (admin only).
 */
async function inviteUserHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'audit:write');

      const body = (request.body ?? {}) as {
        email?: string;
        role?: string;
        name?: string;
      };

      if (!body.email) {
        return jsonResponse(400, { error: 'email is required' });
      }
      if (!body.role) {
        return jsonResponse(400, { error: 'role is required' });
      }

      const invitationId = crypto.randomUUID();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const { error: insertError } = await supabase
        .from('user_invitations')
        .insert({
          id: invitationId,
          organization_id: ctx.organizationId,
          email: body.email,
          role: body.role,
          name: body.name ?? null,
          invited_by: ctx.userId,
          invited_at: now.toISOString(),
          expires_at: expiresAt,
          status: 'pending',
        });

      if (insertError) {
        return jsonResponse(500, { error: insertError.message });
      }

      return jsonResponse(201, {
        invitationId,
        email: body.email,
        role: body.role,
      });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

// ── Route table ───────────────────────────────────────────────────────────────

// NOTE: Static routes (/api/users/me, /api/users/invite) must be registered
// before dynamic routes (/api/users/:id) so the router matches them first.
const routes: ApiRouteDefinition[] = [
  {
    method: 'GET',
    path: '/api/users',
    handler: listUsersHandler,
  },
  {
    method: 'GET',
    path: '/api/users/me',
    handler: getCurrentUserHandler,
  },
  {
    method: 'PATCH',
    path: '/api/users/me',
    handler: updateCurrentUserHandler,
  },
  {
    method: 'POST',
    path: '/api/users/invite',
    handler: inviteUserHandler,
  },
  {
    method: 'GET',
    path: '/api/users/:id',
    handler: getUserByIdHandler,
  },
  {
    method: 'PATCH',
    path: '/api/users/:id/role',
    handler: updateUserRoleHandler,
  },
];

export const usersRouter: ApiRouter = createApiRouter(routes);
export const userRoutes: ApiRouteDefinition[] = routes;
// Aliased export to match the name expected by server/src/index.ts
export const usersRoutes: ApiRouteDefinition[] = routes;

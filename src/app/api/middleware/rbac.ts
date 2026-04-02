/**
 * rbac.ts — Role-based access control checks.
 *
 * All endpoints call requirePermission() before executing any logic.
 * The TenantContext is the single source of truth for what a caller
 * is allowed to do. Permission names are defined in auth.ts.
 */

import { AuthError, Permission, TenantContext } from './auth';
import { UserRole } from '../../../lib/security/rbacTypes';

/**
 * Assert that the caller holds the required permission.
 * Throws AuthError with code INSUFFICIENT_PERMISSIONS if not.
 */
export function requirePermission(
  ctx: TenantContext,
  permission: Permission
): void {
  if (!ctx.permissions.includes(permission)) {
    throw new AuthError(
      `Permission '${permission}' required; caller role is '${ctx.role}'`,
      'INSUFFICIENT_PERMISSIONS'
    );
  }
}

/**
 * Assert that the caller holds ALL of the required permissions.
 */
export function requireAllPermissions(
  ctx: TenantContext,
  permissions: Permission[]
): void {
  for (const p of permissions) {
    requirePermission(ctx, p);
  }
}

/**
 * Assert that the caller holds AT LEAST ONE of the given permissions.
 */
export function requireAnyPermission(
  ctx: TenantContext,
  permissions: Permission[]
): void {
  const has = permissions.some((p) => ctx.permissions.includes(p));
  if (!has) {
    throw new AuthError(
      `One of [${permissions.join(', ')}] required; caller role is '${ctx.role}'`,
      'INSUFFICIENT_PERMISSIONS'
    );
  }
}

/**
 * Assert that the caller is exactly one of the allowed roles.
 */
export function requireRole(
  ctx: TenantContext,
  role: UserRole
): void {
  if (ctx.role !== role) {
    throw new AuthError(
      `Role '${role}' required; caller role is '${ctx.role}'`,
      'INSUFFICIENT_PERMISSIONS'
    );
  }
}

/**
 * Assert that the caller has at least one allowed role.
 */
export function requireAnyRole(
  ctx: TenantContext,
  roles: UserRole[]
): void {
  if (!roles.includes(ctx.role)) {
    throw new AuthError(
      `One of roles [${roles.join(', ')}] required; caller role is '${ctx.role}'`,
      'INSUFFICIENT_PERMISSIONS'
    );
  }
}

/**
 * Enforce that a resource's organizationId matches the caller's tenant.
 * Prevents cross-tenant data access at the handler level even if the
 * database layer also enforces it.
 */
export function assertSameTenant(
  ctx: TenantContext,
  resourceOrganizationId: string,
  resourceDescription: string
): void {
  if (resourceOrganizationId !== ctx.organizationId) {
    throw new AuthError(
      `${resourceDescription} does not belong to the caller's organization`,
      'INSUFFICIENT_PERMISSIONS'
    );
  }
}

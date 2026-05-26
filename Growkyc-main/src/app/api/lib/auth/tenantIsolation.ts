import { TenantContext, extractTenantContext } from '../../middleware/auth';
import { TenantPrincipal, TenantResourceType } from '../../../../lib/tenant/tenantSafeInterfaces';

export class TenantIsolationError extends Error {
  readonly statusCode = 403;

  constructor(message: string) {
    super(message);
    this.name = 'TenantIsolationError';
  }
}

export function resolveTenantPrincipal(ctx: TenantContext): TenantPrincipal {
  if (!ctx.organizationId) {
    throw new TenantIsolationError('Missing tenant context organizationId');
  }

  return {
    tenantId: ctx.organizationId,
    actorUserId: ctx.userId,
    email: ctx.email,
    role: ctx.role,
  };
}

export async function resolveTenantPrincipalFromHeaders(
  headers: Record<string, string | undefined>
): Promise<TenantPrincipal> {
  const ctx = await extractTenantContext(headers);
  return resolveTenantPrincipal(ctx);
}

export function assertTenantOwnership(params: {
  resource: TenantResourceType;
  tenantId: string;
  resourceOrganizationId?: string;
}): void {
  if (!params.resourceOrganizationId) {
    throw new TenantIsolationError(
      `Tenant ownership missing for ${params.resource}; refusing unscoped access`
    );
  }

  if (params.resourceOrganizationId !== params.tenantId) {
    throw new TenantIsolationError(
      `Cross-tenant access denied for ${params.resource}`
    );
  }
}
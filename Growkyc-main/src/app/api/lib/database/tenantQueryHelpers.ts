import { AuditQueryFilter } from '../../../lib/providers/types';

export interface TenantScopedQueryFilter {
  organizationId: string;
  caseId?: string;
  runId?: string;
}

export function withTenantFilter<T extends Record<string, unknown>>(
  tenantId: string,
  filter?: T
): T & { organizationId: string } {
  return {
    ...(filter || ({} as T)),
    organizationId: tenantId,
  };
}

export function buildTenantAwareAuditQuery(
  tenantId: string,
  filter: Omit<AuditQueryFilter, 'organizationId'>
): AuditQueryFilter {
  return withTenantFilter(tenantId, filter);
}

export function buildTenantScopedResourceQuery(
  tenantId: string,
  input: Omit<TenantScopedQueryFilter, 'organizationId'>
): TenantScopedQueryFilter {
  return {
    organizationId: tenantId,
    caseId: input.caseId,
    runId: input.runId,
  };
}
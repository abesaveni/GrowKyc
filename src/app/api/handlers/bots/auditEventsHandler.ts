import { TenantContext } from '../../middleware/auth';
import { requireAnyRole, requirePermission } from '../../middleware/rbac';
import { providerRegistry } from '../../../lib/providers/providerRegistry';
import { AuditEvent, AuditQueryFilter } from '../../../lib/providers/types';
import { buildTenantAwareAuditQuery } from '../../lib/database/tenantQueryHelpers';

export interface AuditEventsRequest {
  actorUserId?: string;
  eventType?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  severity?: AuditQueryFilter['severity'];
  fromDate?: string;
  toDate?: string;
  limit?: number;
  cursor?: string;
}

export interface AuditEventsResponse {
  events: AuditEvent[];
  total: number;
  nextCursor?: string;
}

class AuditEventsValidationError extends Error {
  readonly statusCode = 400;
}

function parseIsoDate(value: string | undefined, fieldName: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new AuditEventsValidationError(`${fieldName} must be a valid ISO date string`);
  }

  return parsed;
}

function toFilter(req: AuditEventsRequest, ctx: TenantContext): AuditQueryFilter {
  const limit = req.limit ?? 50;

  if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
    throw new AuditEventsValidationError('limit must be an integer between 1 and 200');
  }

  return buildTenantAwareAuditQuery(ctx.organizationId, {
    actorUserId: req.actorUserId,
    eventType: req.eventType,
    action: req.action,
    resourceType: req.resourceType,
    resourceId: req.resourceId,
    severity: req.severity,
    fromDate: parseIsoDate(req.fromDate, 'fromDate'),
    toDate: parseIsoDate(req.toDate, 'toDate'),
    limit,
    cursor: req.cursor,
  });
}

export async function auditEventsHandler(
  req: AuditEventsRequest,
  ctx: TenantContext
): Promise<AuditEventsResponse> {
  requireAnyRole(ctx, [
    'reviewer',
    'approver',
    'compliance_manager',
    'admin',
    'read_only_auditor',
  ]);
  requirePermission(ctx, 'audit:read');

  try {
    const result = await providerRegistry.audit.queryAuditEvents(toFilter(req, ctx));

    return {
      events: result.events,
      total: result.total,
      nextCursor: result.nextCursor,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected audit events handler error';
    throw Object.assign(new Error(message), {
      statusCode: (error as { statusCode?: number })?.statusCode ?? 500,
    });
  }
}

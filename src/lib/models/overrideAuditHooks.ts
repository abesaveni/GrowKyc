import type { OverrideReasonCategory, OverrideReasonTarget } from './overrideReasonModel';
import type { PeriodicReviewAuditWriter } from './periodicReviewAuditHooks';

export type OverrideAuditAction =
  | 'override_created'
  | 'override_applied'
  | 'override_rejected';

export interface OverrideAuditEvent {
  action: OverrideAuditAction;
  occurredAt: string;
  tenant_id: string;
  case_id: string;
  override_id: string;
  actor_id: string;
  category: OverrideReasonCategory;
  target_type: OverrideReasonTarget;
  target_id: string;
  metadata?: Record<string, unknown>;
}

export interface OverrideAuditContext {
  tenantId: string;
  caseId: string;
  overrideId: string;
  actorId: string;
  category: OverrideReasonCategory;
  targetType: OverrideReasonTarget;
  targetId: string;
  occurredAt?: string | Date;
}

/**
 * Centralized audit hooks for override lifecycle actions.
 */
export class OverrideAuditHooks {
  constructor(private readonly auditWriter: PeriodicReviewAuditWriter) {}

  async onOverrideCreated(
    context: OverrideAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('override_created', context, metadata);
  }

  async onOverrideApplied(
    context: OverrideAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('override_applied', context, metadata);
  }

  async onOverrideRejected(
    context: OverrideAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('override_rejected', context, metadata);
  }

  private async writeAuditEvent(
    action: OverrideAuditAction,
    context: OverrideAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const event: OverrideAuditEvent = {
      action,
      occurredAt: normalizeDate(context.occurredAt ?? new Date(), 'occurredAt').toISOString(),
      tenant_id: context.tenantId,
      case_id: context.caseId,
      override_id: context.overrideId,
      actor_id: context.actorId,
      category: context.category,
      target_type: context.targetType,
      target_id: context.targetId,
      metadata,
    };

    await this.auditWriter.write(event as never);
  }
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}
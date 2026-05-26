import type {
  EscalationLevelType,
  EscalationStateType,
  EscalationTargetType,
} from './escalationModel';
import type { PeriodicReviewAuditWriter } from './periodicReviewAuditHooks';

export type EscalationAuditAction =
  | 'escalation_created'
  | 'escalation_triggered'
  | 'escalation_resolved'
  | 'escalation_closed';

export interface EscalationAuditEvent {
  action: EscalationAuditAction;
  occurredAt: string;
  tenant_id: string;
  case_id: string;
  escalation_id: string;
  actor_id: string;
  level: EscalationLevelType;
  state: EscalationStateType;
  target_type: EscalationTargetType;
  target_id: string;
  metadata?: Record<string, unknown>;
}

export interface EscalationAuditContext {
  tenantId: string;
  caseId: string;
  escalationId: string;
  actorId: string;
  level: EscalationLevelType;
  state: EscalationStateType;
  targetType: EscalationTargetType;
  targetId: string;
  occurredAt?: string | Date;
}

/**
 * Centralized audit hooks for escalation lifecycle actions.
 */
export class EscalationAuditHooks {
  constructor(private readonly auditWriter: PeriodicReviewAuditWriter) {}

  async onEscalationCreated(
    context: EscalationAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('escalation_created', context, metadata);
  }

  async onEscalationTriggered(
    context: EscalationAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('escalation_triggered', context, metadata);
  }

  async onEscalationResolved(
    context: EscalationAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('escalation_resolved', context, metadata);
  }

  async onEscalationClosed(
    context: EscalationAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('escalation_closed', context, metadata);
  }

  private async writeAuditEvent(
    action: EscalationAuditAction,
    context: EscalationAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const event: EscalationAuditEvent = {
      action,
      occurredAt: normalizeDate(context.occurredAt ?? new Date(), 'occurredAt').toISOString(),
      tenant_id: context.tenantId,
      case_id: context.caseId,
      escalation_id: context.escalationId,
      actor_id: context.actorId,
      level: context.level,
      state: context.state,
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
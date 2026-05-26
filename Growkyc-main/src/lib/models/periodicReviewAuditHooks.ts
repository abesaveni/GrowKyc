export type PeriodicReviewAuditAction =
  | 'periodic_review_created'
  | 'periodic_review_due'
  | 'periodic_review_overdue'
  | 'rescreening_triggered'
  | 'periodic_review_completed';

export interface PeriodicReviewAuditEvent {
  action: PeriodicReviewAuditAction;
  occurredAt: string;
  tenant_id: string;
  case_id: string;
  periodic_review_id: string;
  subject_id?: string;
  metadata?: Record<string, unknown>;
}

export interface PeriodicReviewAuditWriter {
  write(event: PeriodicReviewAuditEvent): Promise<void>;
}

export interface PeriodicReviewAuditContext {
  tenantId: string;
  caseId: string;
  periodicReviewId: string;
  subjectId?: string;
  occurredAt?: string | Date;
}

/**
 * Centralized audit hooks for periodic review and rescreening lifecycle actions.
 */
export class PeriodicReviewAuditHooks {
  constructor(private readonly auditWriter: PeriodicReviewAuditWriter) {}

  async onPeriodicReviewCreated(
    context: PeriodicReviewAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('periodic_review_created', context, metadata);
  }

  async onPeriodicReviewDue(
    context: PeriodicReviewAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('periodic_review_due', context, metadata);
  }

  async onPeriodicReviewOverdue(
    context: PeriodicReviewAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('periodic_review_overdue', context, metadata);
  }

  async onRescreeningTriggered(
    context: PeriodicReviewAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('rescreening_triggered', context, metadata);
  }

  async onPeriodicReviewCompleted(
    context: PeriodicReviewAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('periodic_review_completed', context, metadata);
  }

  private async writeAuditEvent(
    action: PeriodicReviewAuditAction,
    context: PeriodicReviewAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const event: PeriodicReviewAuditEvent = {
      action,
      occurredAt: normalizeDate(context.occurredAt ?? new Date(), 'occurredAt').toISOString(),
      tenant_id: context.tenantId,
      case_id: context.caseId,
      periodic_review_id: context.periodicReviewId,
      subject_id: context.subjectId,
      metadata,
    };

    await this.auditWriter.write(event);
  }
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}

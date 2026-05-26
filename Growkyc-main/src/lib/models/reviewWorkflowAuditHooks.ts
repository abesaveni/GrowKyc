import type { PeriodicReviewAuditWriter } from './periodicReviewAuditHooks';

export type ReviewWorkflowAuditAction =
  | 'review_created'
  | 'review_submitted'
  | 'review_started'
  | 'changes_requested'
  | 'review_submitted_for_approval'
  | 'review_approved'
  | 'review_rejected'
  | 'review_escalated';

export interface ReviewWorkflowAuditEvent {
  action: ReviewWorkflowAuditAction;
  occurredAt: string;
  tenant_id: string;
  case_id: string;
  review_id: string;
  actor_id?: string;
  metadata?: Record<string, unknown>;
}

export interface ReviewWorkflowAuditContext {
  tenantId: string;
  caseId: string;
  reviewId: string;
  actorId?: string;
  occurredAt?: string | Date;
}

/**
 * Centralized audit hooks for review workflow lifecycle actions.
 */
export class ReviewWorkflowAuditHooks {
  constructor(private readonly auditWriter: PeriodicReviewAuditWriter) {}

  async onReviewCreated(
    context: ReviewWorkflowAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('review_created', context, metadata);
  }

  async onReviewSubmitted(
    context: ReviewWorkflowAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('review_submitted', context, metadata);
  }

  async onReviewStarted(
    context: ReviewWorkflowAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('review_started', context, metadata);
  }

  async onChangesRequested(
    context: ReviewWorkflowAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('changes_requested', context, metadata);
  }

  async onReviewSubmittedForApproval(
    context: ReviewWorkflowAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('review_submitted_for_approval', context, metadata);
  }

  async onReviewApproved(
    context: ReviewWorkflowAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('review_approved', context, metadata);
  }

  async onReviewRejected(
    context: ReviewWorkflowAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('review_rejected', context, metadata);
  }

  async onReviewEscalated(
    context: ReviewWorkflowAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.writeAuditEvent('review_escalated', context, metadata);
  }

  private async writeAuditEvent(
    action: ReviewWorkflowAuditAction,
    context: ReviewWorkflowAuditContext,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const event: ReviewWorkflowAuditEvent = {
      action,
      occurredAt: normalizeDate(context.occurredAt ?? new Date(), 'occurredAt').toISOString(),
      tenant_id: context.tenantId,
      case_id: context.caseId,
      review_id: context.reviewId,
      actor_id: context.actorId,
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

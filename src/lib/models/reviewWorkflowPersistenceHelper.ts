import type { ReviewDecisionState } from './reviewDecisionStateModel';
import type { ReviewIssueSeverity } from './reviewIssueSeverityModel';
import type { ReviewTransitionReasonCode } from './reviewWorkflowTransitionHelper';
import type { ReviewWorkflowState } from './reviewWorkflowStateModel';

export interface ReviewWorkflowSeveritySummary {
  low: number;
  medium: number;
  high: number;
  critical: number;
  total_issues: number;
  highest_severity?: ReviewIssueSeverity;
}

export interface ReviewWorkflowPersistenceRecord {
  id: string;
  tenant_id: string;
  case_id: string;
  actor_id: string;
  workflow_state: ReviewWorkflowState;
  reviewer_id?: string;
  approver_id?: string;
  decision_state?: ReviewDecisionState;
  reason_code?: ReviewTransitionReasonCode;
  severity_summary?: ReviewWorkflowSeveritySummary;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewWorkflowRecordInput {
  id: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  workflowState: ReviewWorkflowState;
  reviewerId?: string;
  approverId?: string;
  decisionState?: ReviewDecisionState;
  reasonCode?: ReviewTransitionReasonCode;
  severitySummary?: ReviewWorkflowSeveritySummary;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface UpdateReviewWorkflowStateInput {
  id: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  workflowState: ReviewWorkflowState;
  reasonCode?: ReviewTransitionReasonCode;
  updatedAt?: string | Date;
}

export interface AssignReviewWorkflowReviewerInput {
  id: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  reviewerId: string;
  updatedAt?: string | Date;
}

export interface AssignReviewWorkflowApproverInput {
  id: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  approverId: string;
  updatedAt?: string | Date;
}

export interface PersistReviewWorkflowDecisionStateInput {
  id: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  decisionState: ReviewDecisionState;
  reasonCode?: ReviewTransitionReasonCode;
  updatedAt?: string | Date;
}

export interface PersistReviewWorkflowSeveritySummaryInput {
  id: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  severitySummary: ReviewWorkflowSeveritySummary;
  updatedAt?: string | Date;
}

export interface ReviewWorkflowPersistencePort {
  createReviewWorkflowRecord(
    record: ReviewWorkflowPersistenceRecord,
  ): Promise<ReviewWorkflowPersistenceRecord>;
  updateReviewWorkflowRecord(
    input: {
      id: string;
      tenant_id: string;
      case_id: string;
      changes: Partial<ReviewWorkflowPersistenceRecord>;
    },
  ): Promise<ReviewWorkflowPersistenceRecord>;
}

/**
 * Creates and persists a review workflow record with normalized timestamps.
 */
export async function createReviewWorkflowRecord(
  input: CreateReviewWorkflowRecordInput,
  persistence: ReviewWorkflowPersistencePort,
): Promise<ReviewWorkflowPersistenceRecord> {
  const now = new Date();
  const createdAt = normalizeDate(input.createdAt ?? now, 'createdAt');
  const updatedAt = normalizeDate(input.updatedAt ?? createdAt, 'updatedAt');

  const record: ReviewWorkflowPersistenceRecord = {
    id: input.id,
    tenant_id: input.tenantId,
    case_id: input.caseId,
    actor_id: input.actorId,
    workflow_state: input.workflowState,
    reviewer_id: input.reviewerId,
    approver_id: input.approverId,
    decision_state: input.decisionState,
    reason_code: input.reasonCode,
    severity_summary: input.severitySummary
      ? normalizeSeveritySummary(input.severitySummary)
      : undefined,
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
  };

  return persistence.createReviewWorkflowRecord(record);
}

/**
 * Persists workflow state updates for an existing review workflow record.
 */
export async function updateReviewWorkflowState(
  input: UpdateReviewWorkflowStateInput,
  persistence: ReviewWorkflowPersistencePort,
): Promise<ReviewWorkflowPersistenceRecord> {
  const changes: Partial<ReviewWorkflowPersistenceRecord> = {
    actor_id: input.actorId,
    workflow_state: input.workflowState,
    updated_at: normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString(),
  };

  if (input.reasonCode) {
    changes.reason_code = input.reasonCode;
  }

  return updateReviewWorkflowRecord(input, changes, persistence);
}

/**
 * Persists reviewer assignment for an existing review workflow record.
 */
export async function assignReviewWorkflowReviewer(
  input: AssignReviewWorkflowReviewerInput,
  persistence: ReviewWorkflowPersistencePort,
): Promise<ReviewWorkflowPersistenceRecord> {
  const changes: Partial<ReviewWorkflowPersistenceRecord> = {
    actor_id: input.actorId,
    reviewer_id: input.reviewerId,
    updated_at: normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString(),
  };

  return updateReviewWorkflowRecord(input, changes, persistence);
}

/**
 * Persists approver assignment for an existing review workflow record.
 */
export async function assignReviewWorkflowApprover(
  input: AssignReviewWorkflowApproverInput,
  persistence: ReviewWorkflowPersistencePort,
): Promise<ReviewWorkflowPersistenceRecord> {
  const changes: Partial<ReviewWorkflowPersistenceRecord> = {
    actor_id: input.actorId,
    approver_id: input.approverId,
    updated_at: normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString(),
  };

  return updateReviewWorkflowRecord(input, changes, persistence);
}

/**
 * Persists decision state and optional reason code on the workflow record.
 */
export async function persistReviewWorkflowDecisionState(
  input: PersistReviewWorkflowDecisionStateInput,
  persistence: ReviewWorkflowPersistencePort,
): Promise<ReviewWorkflowPersistenceRecord> {
  const changes: Partial<ReviewWorkflowPersistenceRecord> = {
    actor_id: input.actorId,
    decision_state: input.decisionState,
    updated_at: normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString(),
  };

  if (input.reasonCode) {
    changes.reason_code = input.reasonCode;
  }

  return updateReviewWorkflowRecord(input, changes, persistence);
}

/**
 * Persists issue severity summary when review issues exist.
 */
export async function persistReviewWorkflowSeveritySummary(
  input: PersistReviewWorkflowSeveritySummaryInput,
  persistence: ReviewWorkflowPersistencePort,
): Promise<ReviewWorkflowPersistenceRecord> {
  const changes: Partial<ReviewWorkflowPersistenceRecord> = {
    actor_id: input.actorId,
    severity_summary: normalizeSeveritySummary(input.severitySummary),
    updated_at: normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString(),
  };

  return updateReviewWorkflowRecord(input, changes, persistence);
}

function updateReviewWorkflowRecord(
  input: { id: string; tenantId: string; caseId: string },
  changes: Partial<ReviewWorkflowPersistenceRecord>,
  persistence: ReviewWorkflowPersistencePort,
): Promise<ReviewWorkflowPersistenceRecord> {
  return persistence.updateReviewWorkflowRecord({
    id: input.id,
    tenant_id: input.tenantId,
    case_id: input.caseId,
    changes,
  });
}

function normalizeSeveritySummary(
  input: ReviewWorkflowSeveritySummary,
): ReviewWorkflowSeveritySummary {
  const summary: ReviewWorkflowSeveritySummary = {
    low: normalizeCount(input.low, 'severitySummary.low'),
    medium: normalizeCount(input.medium, 'severitySummary.medium'),
    high: normalizeCount(input.high, 'severitySummary.high'),
    critical: normalizeCount(input.critical, 'severitySummary.critical'),
    total_issues: normalizeCount(input.total_issues, 'severitySummary.total_issues'),
    highest_severity: input.highest_severity,
  };

  const computedTotal =
    summary.low + summary.medium + summary.high + summary.critical;

  if (summary.total_issues !== computedTotal) {
    throw new Error('severitySummary.total_issues must match severity counts total');
  }

  return summary;
}

function normalizeCount(value: number, fieldName: string): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${fieldName} must be a non-negative integer`);
  }

  return value;
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}

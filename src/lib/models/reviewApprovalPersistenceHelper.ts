import type {
  ReviewApprovalDecisionStatus,
  ReviewApprovalRequirementModel,
} from './reviewApprovalChainModel';

export interface ReviewApprovalPersistenceRecord {
  id: string;
  review_id: string;
  tenant_id: string;
  case_id: string;
  actor_id: string;
  approver_id?: string;
  approval_state: ReviewApprovalDecisionStatus;
  approval_requirement?: ReviewApprovalRequirementModel;
  approved_at?: string;
  rejected_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewApprovalRecordInput {
  id: string;
  reviewId: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  approvalState?: ReviewApprovalDecisionStatus;
  approverId?: string;
  approvalRequirement?: ReviewApprovalRequirementModel;
  approvedAt?: string | Date;
  rejectedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface UpdateReviewApprovalStateInput {
  id: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  approvalState: ReviewApprovalDecisionStatus;
  approvedAt?: string | Date;
  rejectedAt?: string | Date;
  updatedAt?: string | Date;
}

export interface PersistReviewApproverIdInput {
  id: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  approverId: string;
  updatedAt?: string | Date;
}

export interface PersistReviewApprovalRequirementInput {
  id: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  approvalRequirement: ReviewApprovalRequirementModel;
  updatedAt?: string | Date;
}

export interface ReviewApprovalPersistencePort {
  createReviewApprovalRecord(
    record: ReviewApprovalPersistenceRecord,
  ): Promise<ReviewApprovalPersistenceRecord>;
  updateReviewApprovalRecord(
    input: {
      id: string;
      tenant_id: string;
      case_id: string;
      changes: Partial<ReviewApprovalPersistenceRecord>;
    },
  ): Promise<ReviewApprovalPersistenceRecord>;
}

/**
 * Creates and persists an approval record with normalized date fields.
 */
export async function createReviewApprovalRecord(
  input: CreateReviewApprovalRecordInput,
  persistence: ReviewApprovalPersistencePort,
): Promise<ReviewApprovalPersistenceRecord> {
  const now = new Date();
  const createdAt = normalizeDate(input.createdAt ?? now, 'createdAt');
  const updatedAt = normalizeDate(input.updatedAt ?? createdAt, 'updatedAt');

  const record: ReviewApprovalPersistenceRecord = {
    id: input.id,
    review_id: input.reviewId,
    tenant_id: input.tenantId,
    case_id: input.caseId,
    actor_id: input.actorId,
    approver_id: input.approverId,
    approval_state: input.approvalState ?? 'pending',
    approval_requirement: input.approvalRequirement,
    approved_at: input.approvedAt
      ? normalizeDate(input.approvedAt, 'approvedAt').toISOString()
      : undefined,
    rejected_at: input.rejectedAt
      ? normalizeDate(input.rejectedAt, 'rejectedAt').toISOString()
      : undefined,
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
  };

  assertApprovalTimestampConsistency(record.approval_state, record.approved_at, record.rejected_at);

  return persistence.createReviewApprovalRecord(record);
}

/**
 * Persists approval state updates and approved/rejected timestamps.
 */
export async function updateReviewApprovalState(
  input: UpdateReviewApprovalStateInput,
  persistence: ReviewApprovalPersistencePort,
): Promise<ReviewApprovalPersistenceRecord> {
  const changes: Partial<ReviewApprovalPersistenceRecord> = {
    actor_id: input.actorId,
    approval_state: input.approvalState,
    updated_at: normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString(),
  };

  if (input.approvedAt) {
    changes.approved_at = normalizeDate(input.approvedAt, 'approvedAt').toISOString();
  }

  if (input.rejectedAt) {
    changes.rejected_at = normalizeDate(input.rejectedAt, 'rejectedAt').toISOString();
  }

  if (input.approvalState === 'approved' && !changes.approved_at) {
    changes.approved_at = normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString();
    changes.rejected_at = undefined;
  }

  if (input.approvalState === 'rejected' && !changes.rejected_at) {
    changes.rejected_at = normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString();
    changes.approved_at = undefined;
  }

  if (input.approvalState === 'pending') {
    changes.approved_at = undefined;
    changes.rejected_at = undefined;
  }

  assertApprovalTimestampConsistency(
    input.approvalState,
    changes.approved_at,
    changes.rejected_at,
  );

  return updateReviewApprovalRecord(input, changes, persistence);
}

/**
 * Persists approver_id assignment for an approval record.
 */
export async function persistReviewApproverId(
  input: PersistReviewApproverIdInput,
  persistence: ReviewApprovalPersistencePort,
): Promise<ReviewApprovalPersistenceRecord> {
  const changes: Partial<ReviewApprovalPersistenceRecord> = {
    actor_id: input.actorId,
    approver_id: input.approverId,
    updated_at: normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString(),
  };

  return updateReviewApprovalRecord(input, changes, persistence);
}

/**
 * Persists approval requirement metadata for an approval record.
 */
export async function persistReviewApprovalRequirement(
  input: PersistReviewApprovalRequirementInput,
  persistence: ReviewApprovalPersistencePort,
): Promise<ReviewApprovalPersistenceRecord> {
  const changes: Partial<ReviewApprovalPersistenceRecord> = {
    actor_id: input.actorId,
    approval_requirement: input.approvalRequirement,
    updated_at: normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString(),
  };

  return updateReviewApprovalRecord(input, changes, persistence);
}

function updateReviewApprovalRecord(
  input: { id: string; tenantId: string; caseId: string },
  changes: Partial<ReviewApprovalPersistenceRecord>,
  persistence: ReviewApprovalPersistencePort,
): Promise<ReviewApprovalPersistenceRecord> {
  return persistence.updateReviewApprovalRecord({
    id: input.id,
    tenant_id: input.tenantId,
    case_id: input.caseId,
    changes,
  });
}

function assertApprovalTimestampConsistency(
  state: ReviewApprovalDecisionStatus,
  approvedAt?: string,
  rejectedAt?: string,
): void {
  if (state === 'approved' && !approvedAt) {
    throw new Error('approved_at is required when approval_state is approved');
  }

  if (state === 'rejected' && !rejectedAt) {
    throw new Error('rejected_at is required when approval_state is rejected');
  }

  if (state === 'pending' && (approvedAt || rejectedAt)) {
    throw new Error('approved_at and rejected_at must be empty when approval_state is pending');
  }

  if (approvedAt && rejectedAt) {
    throw new Error('approved_at and rejected_at cannot both be set');
  }
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}

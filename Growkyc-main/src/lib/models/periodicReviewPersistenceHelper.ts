import { ReviewFrequency, ReviewStatus } from './periodicReviewModel';

export interface PeriodicReviewReasonMetadata {
  reasonCode: string;
  notes?: string;
  context?: Record<string, unknown>;
}

export interface PeriodicReviewPersistenceRecord {
  id: string;
  tenant_id: string;
  case_id: string;
  subject_id: string;
  review_frequency: ReviewFrequency;
  review_status: ReviewStatus;
  next_review_date: string;
  last_review_date?: string;
  review_reason_metadata?: PeriodicReviewReasonMetadata;
  created_at: string;
  updated_at: string;
}

export interface CreatePeriodicReviewRecordInput {
  id: string;
  tenantId: string;
  caseId: string;
  subjectId: string;
  reviewFrequency: ReviewFrequency;
  nextReviewDate: string | Date;
  lastReviewDate?: string | Date;
  reviewStatus?: ReviewStatus;
  reviewReasonMetadata?: PeriodicReviewReasonMetadata;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface UpdatePeriodicReviewStatusInput {
  id: string;
  tenantId: string;
  caseId: string;
  reviewStatus: ReviewStatus;
  nextReviewDate?: string | Date;
  lastReviewDate?: string | Date;
  reviewFrequency?: ReviewFrequency;
  reviewReasonMetadata?: PeriodicReviewReasonMetadata;
  updatedAt?: string | Date;
}

export interface PeriodicReviewPersistencePort {
  createPeriodicReviewRecord(
    record: PeriodicReviewPersistenceRecord,
  ): Promise<PeriodicReviewPersistenceRecord>;
  updatePeriodicReviewStatus(
    input: {
      id: string;
      tenant_id: string;
      case_id: string;
      changes: Partial<PeriodicReviewPersistenceRecord>;
    },
  ): Promise<PeriodicReviewPersistenceRecord>;
}

/**
 * Creates and persists a periodic review record with normalized date fields.
 */
export async function createPeriodicReviewRecord(
  input: CreatePeriodicReviewRecordInput,
  persistence: PeriodicReviewPersistencePort,
): Promise<PeriodicReviewPersistenceRecord> {
  const now = new Date();
  const createdAt = normalizeDate(input.createdAt ?? now, 'createdAt');
  const updatedAt = normalizeDate(input.updatedAt ?? createdAt, 'updatedAt');

  const record: PeriodicReviewPersistenceRecord = {
    id: input.id,
    tenant_id: input.tenantId,
    case_id: input.caseId,
    subject_id: input.subjectId,
    review_frequency: input.reviewFrequency,
    review_status: input.reviewStatus ?? 'scheduled',
    next_review_date: normalizeDate(input.nextReviewDate, 'nextReviewDate').toISOString(),
    last_review_date: input.lastReviewDate
      ? normalizeDate(input.lastReviewDate, 'lastReviewDate').toISOString()
      : undefined,
    review_reason_metadata: input.reviewReasonMetadata,
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
  };

  return persistence.createPeriodicReviewRecord(record);
}

/**
 * Updates periodic review status and optional review fields in persistence.
 */
export async function updatePeriodicReviewStatus(
  input: UpdatePeriodicReviewStatusInput,
  persistence: PeriodicReviewPersistencePort,
): Promise<PeriodicReviewPersistenceRecord> {
  const changes: Partial<PeriodicReviewPersistenceRecord> = {
    review_status: input.reviewStatus,
    updated_at: normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString(),
  };

  if (input.nextReviewDate) {
    changes.next_review_date = normalizeDate(input.nextReviewDate, 'nextReviewDate').toISOString();
  }

  if (input.lastReviewDate) {
    changes.last_review_date = normalizeDate(input.lastReviewDate, 'lastReviewDate').toISOString();
  }

  if (input.reviewFrequency) {
    changes.review_frequency = input.reviewFrequency;
  }

  if (input.reviewReasonMetadata) {
    changes.review_reason_metadata = input.reviewReasonMetadata;
  }

  return persistence.updatePeriodicReviewStatus({
    id: input.id,
    tenant_id: input.tenantId,
    case_id: input.caseId,
    changes,
  });
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}

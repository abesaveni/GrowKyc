import type {
  PeriodicReviewModel,
  ReviewFrequency,
  ReviewStatus,
} from './periodicReviewModel';
import {
  calculateNextReviewDateFromFrequency,
  scheduleInitialPeriodicReview,
} from './periodicReviewFrequencyHelper';
import {
  evaluatePeriodicReviewState,
  type PeriodicReviewStateResult,
} from './periodicReviewEvaluationHelper';
import {
  determinePeriodicReviewRescreeningTrigger,
  type DetermineRescreeningTriggerInput,
  type RescreeningTriggerResult,
} from './periodicReviewRescreeningTriggerHelper';
import {
  createPeriodicReviewRecord,
  updatePeriodicReviewStatus,
  type PeriodicReviewPersistencePort,
  type PeriodicReviewPersistenceRecord,
  type PeriodicReviewReasonMetadata,
} from './periodicReviewPersistenceHelper';
import {
  PeriodicReviewAuditHooks,
  type PeriodicReviewAuditWriter,
} from './periodicReviewAuditHooks';

export interface PeriodicRescreeningServiceDependencies {
  persistence: PeriodicReviewPersistencePort;
  auditWriter: PeriodicReviewAuditWriter;
}

export interface CreatePeriodicReviewServiceInput {
  id: string;
  tenantId: string;
  caseId: string;
  subjectId: string;
  frequency: ReviewFrequency;
  startedAt: string | Date;
  lastReviewDate?: string | Date;
  reviewReasonMetadata?: PeriodicReviewReasonMetadata;
  highRiskAcceleratedReviewDays?: number;
}

export interface EvaluatePeriodicReviewServiceInput {
  review: PeriodicReviewModel;
  caseId: string;
  evaluatedAt: string | Date;
  overdueGracePeriodDays?: number;
  upcomingWindowDays?: number;
  rescreeningSignals?: Omit<DetermineRescreeningTriggerInput, 'evaluatedAt' | 'periodicReviewDue'>;
}

export interface EvaluatePeriodicReviewServiceResult {
  review: PeriodicReviewModel;
  reviewState: PeriodicReviewStateResult;
  rescreening: RescreeningTriggerResult;
}

export interface CompletePeriodicReviewServiceInput {
  review: PeriodicReviewModel;
  caseId: string;
  completedAt: string | Date;
  nextFrequency?: ReviewFrequency;
  reviewReasonMetadata?: PeriodicReviewReasonMetadata;
  highRiskAcceleratedReviewDays?: number;
}

/**
 * Centralized server-side service wiring periodic review and rescreening helpers.
 * Intentionally provider-agnostic and scheduler-agnostic for API integration later.
 */
export class PeriodicRescreeningService {
  private readonly persistence: PeriodicReviewPersistencePort;
  private readonly auditHooks: PeriodicReviewAuditHooks;

  constructor(dependencies: PeriodicRescreeningServiceDependencies) {
    this.persistence = dependencies.persistence;
    this.auditHooks = new PeriodicReviewAuditHooks(dependencies.auditWriter);
  }

  async createPeriodicReview(
    input: CreatePeriodicReviewServiceInput,
  ): Promise<PeriodicReviewModel> {
    const scheduled = scheduleInitialPeriodicReview({
      frequency: input.frequency,
      startedAt: input.startedAt,
      highRiskAcceleratedReviewDays: input.highRiskAcceleratedReviewDays,
    });

    const persisted = await createPeriodicReviewRecord(
      {
        id: input.id,
        tenantId: input.tenantId,
        caseId: input.caseId,
        subjectId: input.subjectId,
        reviewFrequency: input.frequency,
        reviewStatus: 'scheduled',
        nextReviewDate: scheduled.nextReviewDate,
        lastReviewDate: input.lastReviewDate,
        reviewReasonMetadata: input.reviewReasonMetadata,
        createdAt: scheduled.scheduledAt,
        updatedAt: scheduled.scheduledAt,
      },
      this.persistence,
    );

    await this.auditHooks.onPeriodicReviewCreated(
      {
        tenantId: persisted.tenant_id,
        caseId: persisted.case_id,
        periodicReviewId: persisted.id,
        subjectId: persisted.subject_id,
        occurredAt: persisted.created_at,
      },
      {
        frequency: persisted.review_frequency,
        nextReviewDate: persisted.next_review_date,
      },
    );

    return mapPersistenceRecordToModel(persisted);
  }

  async evaluatePeriodicReview(
    input: EvaluatePeriodicReviewServiceInput,
  ): Promise<EvaluatePeriodicReviewServiceResult> {
    const reviewState = evaluatePeriodicReviewState({
      nextReviewDate: input.review.nextReviewDate,
      evaluatedAt: input.evaluatedAt,
      overdueGracePeriodDays: input.overdueGracePeriodDays,
      upcomingWindowDays: input.upcomingWindowDays,
    });

    const targetStatus = mapStateToStatus(reviewState.state, input.review.status);
    const statusChanged = targetStatus !== input.review.status;

    let updatedRecord: PeriodicReviewPersistenceRecord | undefined;

    if (statusChanged) {
      updatedRecord = await updatePeriodicReviewStatus(
        {
          id: input.review.id,
          tenantId: input.review.organizationId,
          caseId: input.caseId,
          reviewStatus: targetStatus,
          reviewReasonMetadata: {
            reasonCode:
              reviewState.state === 'overdue'
                ? 'periodic_review_overdue'
                : reviewState.state === 'due'
                  ? 'periodic_review_due'
                  : 'periodic_review_status_evaluated',
            context: {
              evaluatedAt: reviewState.evaluatedAt,
              daysUntilDue: reviewState.daysUntilDue,
              daysUntilOverdue: reviewState.daysUntilOverdue,
            },
          },
        },
        this.persistence,
      );

      if (reviewState.state === 'due') {
        await this.auditHooks.onPeriodicReviewDue(
          {
            tenantId: input.review.organizationId,
            caseId: input.caseId,
            periodicReviewId: input.review.id,
            occurredAt: reviewState.evaluatedAt,
          },
          {
            nextReviewDate: reviewState.nextReviewDate,
          },
        );
      }

      if (reviewState.state === 'overdue') {
        await this.auditHooks.onPeriodicReviewOverdue(
          {
            tenantId: input.review.organizationId,
            caseId: input.caseId,
            periodicReviewId: input.review.id,
            occurredAt: reviewState.evaluatedAt,
          },
          {
            nextReviewDate: reviewState.nextReviewDate,
            overdueAt: reviewState.overdueAt,
          },
        );
      }
    }

    const rescreening = determinePeriodicReviewRescreeningTrigger({
      evaluatedAt: input.evaluatedAt,
      periodicReviewDue: reviewState.isDue || reviewState.isOverdue,
      lastScreenedAt: input.rescreeningSignals?.lastScreenedAt,
      forceRescreening: input.rescreeningSignals?.forceRescreening,
      riskLevelIncreased: input.rescreeningSignals?.riskLevelIncreased,
      profileChanged: input.rescreeningSignals?.profileChanged,
      hookSignals: input.rescreeningSignals?.hookSignals,
    });

    if (rescreening.shouldTrigger) {
      await this.auditHooks.onRescreeningTriggered(
        {
          tenantId: input.review.organizationId,
          caseId: input.caseId,
          periodicReviewId: input.review.id,
          occurredAt: rescreening.evaluatedAt,
        },
        {
          reasonCodes: rescreening.reasonCodes,
          hookDecisions: rescreening.hookDecisions,
        },
      );
    }

    const review = updatedRecord
      ? mapPersistenceRecordToModel(updatedRecord)
      : {
          ...input.review,
          status: targetStatus,
        };

    return {
      review,
      reviewState,
      rescreening,
    };
  }

  async completePeriodicReview(
    input: CompletePeriodicReviewServiceInput,
  ): Promise<PeriodicReviewModel> {
    const completedAtDate = normalizeDate(input.completedAt, 'completedAt');
    const nextFrequency = input.nextFrequency ?? input.review.frequency;

    const next = calculateNextReviewDateFromFrequency({
      frequency: nextFrequency,
      fromDate: completedAtDate,
      highRiskAcceleratedReviewDays: input.highRiskAcceleratedReviewDays,
    });

    const persisted = await updatePeriodicReviewStatus(
      {
        id: input.review.id,
        tenantId: input.review.organizationId,
        caseId: input.caseId,
        reviewStatus: 'completed',
        nextReviewDate: next.nextReviewDate,
        lastReviewDate: completedAtDate,
        reviewFrequency: nextFrequency,
        reviewReasonMetadata: input.reviewReasonMetadata,
        updatedAt: completedAtDate,
      },
      this.persistence,
    );

    await this.auditHooks.onPeriodicReviewCompleted(
      {
        tenantId: persisted.tenant_id,
        caseId: persisted.case_id,
        periodicReviewId: persisted.id,
        subjectId: persisted.subject_id,
        occurredAt: completedAtDate,
      },
      {
        nextReviewDate: persisted.next_review_date,
        frequency: persisted.review_frequency,
      },
    );

    return mapPersistenceRecordToModel(persisted);
  }
}

let periodicRescreeningServiceInstance: PeriodicRescreeningService | null = null;

export function getPeriodicRescreeningService(
  dependencies: PeriodicRescreeningServiceDependencies,
): PeriodicRescreeningService {
  if (!periodicRescreeningServiceInstance) {
    periodicRescreeningServiceInstance = new PeriodicRescreeningService(dependencies);
  }

  return periodicRescreeningServiceInstance;
}

function mapPersistenceRecordToModel(
  record: PeriodicReviewPersistenceRecord,
): PeriodicReviewModel {
  return {
    id: record.id,
    organizationId: record.tenant_id,
    subjectId: record.subject_id,
    frequency: record.review_frequency,
    status: record.review_status,
    nextReviewDate: record.next_review_date,
    lastReviewDate: record.last_review_date,
    isHighRiskAcceleratedReview:
      record.review_frequency === 'high_risk_accelerated_review',
    highRiskAccelerationReason: record.review_reason_metadata?.reasonCode,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function mapStateToStatus(
  state: PeriodicReviewStateResult['state'],
  currentStatus: ReviewStatus,
): ReviewStatus {
  switch (state) {
    case 'overdue':
      return 'overdue';
    case 'due':
      return 'due';
    case 'upcoming':
      return currentStatus === 'in_review' || currentStatus === 'completed'
        ? currentStatus
        : 'scheduled';
    default:
      return assertNever(state);
  }
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled state: ${String(value)}`);
}

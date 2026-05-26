import type { ReviewDecisionState } from './reviewDecisionStateModel';
import {
  aggregateBotFindingsToReviewIssues,
  markReviewIssueAcceptedWithReason,
  markReviewIssueOpen,
  markReviewIssueResolved,
  type AggregateBotFindingsToReviewIssuesInput,
  type MarkReviewIssueAcceptedWithReasonInput,
  type MarkReviewIssueOpenInput,
  type MarkReviewIssueResolvedInput,
} from './reviewIssueReviewHelper';
import type {
  BotFindingForReviewIssue,
  ReviewIssueModel,
} from './reviewIssueModel';
import {
  ReviewWorkflowAuditHooks,
  type ReviewWorkflowAuditContext,
} from './reviewWorkflowAuditHooks';
import {
  assignReviewWorkflowApprover,
  assignReviewWorkflowReviewer,
  createReviewWorkflowRecord,
  persistReviewWorkflowDecisionState,
  persistReviewWorkflowSeveritySummary,
  updateReviewWorkflowState,
  type AssignReviewWorkflowApproverInput,
  type AssignReviewWorkflowReviewerInput,
  type CreateReviewWorkflowRecordInput,
  type ReviewWorkflowPersistencePort,
  type ReviewWorkflowPersistenceRecord,
  type ReviewWorkflowSeveritySummary,
} from './reviewWorkflowPersistenceHelper';
import {
  transitionReviewWorkflowState,
  type ReviewTransitionReasonCode,
} from './reviewWorkflowTransitionHelper';
import type { ReviewWorkflowRole } from './reviewWorkflowRoleModel';
import type { ReviewWorkflowState } from './reviewWorkflowStateModel';
import type { PeriodicReviewAuditWriter } from './periodicReviewAuditHooks';

export interface ReviewWorkflowServiceDependencies {
  persistence: ReviewWorkflowPersistencePort;
  auditWriter: PeriodicReviewAuditWriter;
}

export interface ReviewWorkflowModel {
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewWorkflowServiceInput {
  id: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  actorRole: ReviewWorkflowRole;
  initialState?: ReviewWorkflowState;
  findings?: readonly BotFindingForReviewIssue[];
  createdAt?: string | Date;
}

export interface TransitionReviewWorkflowServiceInput {
  review: ReviewWorkflowModel;
  actorId: string;
  actorRole: ReviewWorkflowRole;
  toState: ReviewWorkflowState;
  reasonCode?: ReviewTransitionReasonCode;
  transitionedAt?: string | Date;
}

export interface AssignReviewWorkflowReviewerServiceInput {
  review: ReviewWorkflowModel;
  actorId: string;
  reviewerId: string;
  updatedAt?: string | Date;
}

export interface AssignReviewWorkflowApproverServiceInput {
  review: ReviewWorkflowModel;
  actorId: string;
  approverId: string;
  updatedAt?: string | Date;
}

export interface AggregateReviewIssuesFromFindingsServiceInput
  extends AggregateBotFindingsToReviewIssuesInput {
  review: ReviewWorkflowModel;
  actorId: string;
}

export interface MarkReviewIssueOpenServiceInput extends MarkReviewIssueOpenInput {
  review: ReviewWorkflowModel;
  actorId: string;
}

export interface MarkReviewIssueResolvedServiceInput
  extends MarkReviewIssueResolvedInput {
  review: ReviewWorkflowModel;
  actorId: string;
}

export interface MarkReviewIssueAcceptedWithReasonServiceInput
  extends MarkReviewIssueAcceptedWithReasonInput {
  review: ReviewWorkflowModel;
  actorId: string;
}

export interface ReviewWorkflowIssuesResult {
  review: ReviewWorkflowModel;
  issues: ReviewIssueModel[];
}

/**
 * Centralized server-side service wiring review models, transitions, persistence, issues, and audit hooks.
 * Intentionally API-ready and free of UI concerns.
 */
export class ReviewWorkflowService {
  private readonly persistence: ReviewWorkflowPersistencePort;
  private readonly auditHooks: ReviewWorkflowAuditHooks;

  constructor(dependencies: ReviewWorkflowServiceDependencies) {
    this.persistence = dependencies.persistence;
    this.auditHooks = new ReviewWorkflowAuditHooks(dependencies.auditWriter);
  }

  async createReviewWorkflow(
    input: CreateReviewWorkflowServiceInput,
  ): Promise<ReviewWorkflowIssuesResult> {
    const createdAt = input.createdAt ?? new Date();
    const initialState = input.initialState ?? 'draft';
    const issues = input.findings
      ? aggregateBotFindingsToReviewIssues({
          findings: input.findings,
          aggregatedAt: createdAt,
        })
      : [];

    const severitySummary = buildSeveritySummary(issues);

    const persisted = await createReviewWorkflowRecord(
      {
        id: input.id,
        tenantId: input.tenantId,
        caseId: input.caseId,
        actorId: input.actorId,
        workflowState: initialState,
        severitySummary,
        createdAt,
        updatedAt: createdAt,
      },
      this.persistence,
    );

    const review = mapPersistenceRecordToModel(persisted);

    await this.auditHooks.onReviewCreated(this.buildAuditContext(review, createdAt), {
      actorRole: input.actorRole,
      workflowState: review.workflowState,
      issueCount: issues.length,
    });

    return {
      review,
      issues,
    };
  }

  async transitionReviewWorkflowState(
    input: TransitionReviewWorkflowServiceInput,
  ): Promise<ReviewWorkflowModel> {
    const transitionedAt = input.transitionedAt ?? new Date();

    const transition = transitionReviewWorkflowState({
      fromState: input.review.workflowState,
      toState: input.toState,
      actorRole: input.actorRole,
      reasonCode: input.reasonCode,
    });

    const persistedState = await updateReviewWorkflowState(
      {
        id: input.review.id,
        tenantId: input.review.tenantId,
        caseId: input.review.caseId,
        actorId: input.actorId,
        workflowState: transition.nextState,
        reasonCode: transition.reasonCode,
        updatedAt: transitionedAt,
      },
      this.persistence,
    );

    const decisionState = toDecisionState(transition.nextState);

    if (decisionState) {
      await persistReviewWorkflowDecisionState(
        {
          id: input.review.id,
          tenantId: input.review.tenantId,
          caseId: input.review.caseId,
          actorId: input.actorId,
          decisionState,
          reasonCode: transition.reasonCode,
          updatedAt: transitionedAt,
        },
        this.persistence,
      );
    }

    const review = {
      ...mapPersistenceRecordToModel(persistedState),
      decisionState: decisionState ?? persistedState.decision_state,
    };

    await this.auditByStateTransition(review, input.actorId, transitionedAt, {
      previousState: input.review.workflowState,
      actorRole: input.actorRole,
      reasonCode: transition.reasonCode,
    });

    return review;
  }

  async assignReviewer(
    input: AssignReviewWorkflowReviewerServiceInput,
  ): Promise<ReviewWorkflowModel> {
    const persisted = await assignReviewWorkflowReviewer(
      {
        id: input.review.id,
        tenantId: input.review.tenantId,
        caseId: input.review.caseId,
        actorId: input.actorId,
        reviewerId: input.reviewerId,
        updatedAt: input.updatedAt,
      } satisfies AssignReviewWorkflowReviewerInput,
      this.persistence,
    );

    return mapPersistenceRecordToModel(persisted);
  }

  async assignApprover(
    input: AssignReviewWorkflowApproverServiceInput,
  ): Promise<ReviewWorkflowModel> {
    const persisted = await assignReviewWorkflowApprover(
      {
        id: input.review.id,
        tenantId: input.review.tenantId,
        caseId: input.review.caseId,
        actorId: input.actorId,
        approverId: input.approverId,
        updatedAt: input.updatedAt,
      } satisfies AssignReviewWorkflowApproverInput,
      this.persistence,
    );

    return mapPersistenceRecordToModel(persisted);
  }

  async aggregateIssuesFromFindings(
    input: AggregateReviewIssuesFromFindingsServiceInput,
  ): Promise<ReviewWorkflowIssuesResult> {
    const issues = aggregateBotFindingsToReviewIssues({
      findings: input.findings,
      defaultStatus: input.defaultStatus,
      aggregatedAt: input.aggregatedAt,
    });

    const severitySummary = buildSeveritySummary(issues);

    const persisted = await persistReviewWorkflowSeveritySummary(
      {
        id: input.review.id,
        tenantId: input.review.tenantId,
        caseId: input.review.caseId,
        actorId: input.actorId,
        severitySummary,
        updatedAt: input.aggregatedAt,
      },
      this.persistence,
    );

    return {
      review: mapPersistenceRecordToModel(persisted),
      issues,
    };
  }

  async markIssueOpen(input: MarkReviewIssueOpenServiceInput): Promise<ReviewIssueModel> {
    return markReviewIssueOpen(input);
  }

  async markIssueResolved(
    input: MarkReviewIssueResolvedServiceInput,
  ): Promise<ReviewIssueModel> {
    return markReviewIssueResolved(input);
  }

  async markIssueAcceptedWithReason(
    input: MarkReviewIssueAcceptedWithReasonServiceInput,
  ): Promise<ReviewIssueModel> {
    return markReviewIssueAcceptedWithReason(input);
  }

  private async auditByStateTransition(
    review: ReviewWorkflowModel,
    actorId: string,
    occurredAt: string | Date,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const context = this.buildAuditContext(review, occurredAt, actorId);

    switch (review.workflowState) {
      case 'submitted_for_review':
        await this.auditHooks.onReviewSubmitted(context, metadata);
        return;
      case 'in_review':
        await this.auditHooks.onReviewStarted(context, metadata);
        return;
      case 'changes_requested':
        await this.auditHooks.onChangesRequested(context, metadata);
        return;
      case 'submitted_for_approval':
        await this.auditHooks.onReviewSubmittedForApproval(context, metadata);
        return;
      case 'approved':
        await this.auditHooks.onReviewApproved(context, metadata);
        return;
      case 'rejected':
        await this.auditHooks.onReviewRejected(context, metadata);
        return;
      case 'escalated':
        await this.auditHooks.onReviewEscalated(context, metadata);
        return;
      case 'draft':
      default:
        return;
    }
  }

  private buildAuditContext(
    review: ReviewWorkflowModel,
    occurredAt?: string | Date,
    actorId?: string,
  ): ReviewWorkflowAuditContext {
    return {
      tenantId: review.tenantId,
      caseId: review.caseId,
      reviewId: review.id,
      actorId,
      occurredAt,
    };
  }
}

let reviewWorkflowServiceInstance: ReviewWorkflowService | null = null;

export function getReviewWorkflowService(
  dependencies: ReviewWorkflowServiceDependencies,
): ReviewWorkflowService {
  if (!reviewWorkflowServiceInstance) {
    reviewWorkflowServiceInstance = new ReviewWorkflowService(dependencies);
  }

  return reviewWorkflowServiceInstance;
}

function mapPersistenceRecordToModel(
  record: ReviewWorkflowPersistenceRecord,
): ReviewWorkflowModel {
  return {
    id: record.id,
    tenantId: record.tenant_id,
    caseId: record.case_id,
    actorId: record.actor_id,
    workflowState: record.workflow_state,
    reviewerId: record.reviewer_id,
    approverId: record.approver_id,
    decisionState: record.decision_state,
    reasonCode: record.reason_code,
    severitySummary: record.severity_summary,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function toDecisionState(
  state: ReviewWorkflowState,
): ReviewDecisionState | undefined {
  switch (state) {
    case 'changes_requested':
    case 'approved':
    case 'rejected':
    case 'escalated':
      return state;
    default:
      return undefined;
  }
}

function buildSeveritySummary(
  issues: readonly ReviewIssueModel[],
): ReviewWorkflowSeveritySummary {
  const summary: ReviewWorkflowSeveritySummary = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
    total_issues: issues.length,
    highest_severity: undefined,
  };

  for (const issue of issues) {
    summary[issue.severity] += 1;
  }

  summary.highest_severity = findHighestSeverity(summary);
  return summary;
}

function findHighestSeverity(
  summary: ReviewWorkflowSeveritySummary,
): ReviewWorkflowSeveritySummary['highest_severity'] {
  if (summary.critical > 0) {
    return 'critical';
  }

  if (summary.high > 0) {
    return 'high';
  }

  if (summary.medium > 0) {
    return 'medium';
  }

  if (summary.low > 0) {
    return 'low';
  }

  return undefined;
}

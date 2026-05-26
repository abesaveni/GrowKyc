import type {
  MandatoryReviewApproverRole,
  ReviewApprovalChainModel,
  ReviewApprovalChainStepModel,
  ReviewApprovalDecisionActor,
  ReviewApprovalRequirementModel,
} from './reviewApprovalChainModel';
import {
  determineReviewApprovalRequirement,
  type DetermineReviewApprovalRequirementInput,
  type DetermineReviewApprovalRequirementResult,
} from './reviewApprovalRulesHelper';
import {
  createReviewApprovalRecord,
  persistReviewApprovalRequirement,
  persistReviewApproverId,
  updateReviewApprovalState,
  type CreateReviewApprovalRecordInput,
  type PersistReviewApprovalRequirementInput,
  type PersistReviewApproverIdInput,
  type ReviewApprovalPersistencePort,
  type ReviewApprovalPersistenceRecord,
  type UpdateReviewApprovalStateInput,
} from './reviewApprovalPersistenceHelper';

export interface ReviewApprovalServiceDependencies {
  persistence: ReviewApprovalPersistencePort;
}

export interface CreateReviewApprovalServiceInput {
  id: string;
  reviewId: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  approverId?: string;
  ruleInput?: DetermineReviewApprovalRequirementInput;
  createdAt?: string | Date;
}

export interface RefreshReviewApprovalRequirementServiceInput {
  id: string;
  reviewId: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  ruleInput: DetermineReviewApprovalRequirementInput;
  updatedAt?: string | Date;
}

export interface AssignReviewApprovalApproverServiceInput {
  id: string;
  reviewId: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  approverId: string;
  updatedAt?: string | Date;
}

export interface ApproveReviewServiceInput {
  id: string;
  reviewId: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  actorRole: MandatoryReviewApproverRole;
  approvalRequirement: ReviewApprovalRequirementModel;
  approvalCount?: number;
  approvedAt?: string | Date;
  updatedAt?: string | Date;
}

export interface RejectReviewServiceInput {
  id: string;
  reviewId: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  actorRole: MandatoryReviewApproverRole;
  approvalRequirement: ReviewApprovalRequirementModel;
  rejectedAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ReviewApprovalServiceResult {
  approvalChain: ReviewApprovalChainModel;
  requirementResult?: DetermineReviewApprovalRequirementResult;
}

/**
 * Centralized server-side approval service wiring approval model, rules helper, and persistence.
 * Intentionally modular for API integration later.
 */
export class ReviewApprovalService {
  private readonly persistence: ReviewApprovalPersistencePort;

  constructor(dependencies: ReviewApprovalServiceDependencies) {
    this.persistence = dependencies.persistence;
  }

  async createReviewApproval(
    input: CreateReviewApprovalServiceInput,
  ): Promise<ReviewApprovalServiceResult> {
    const requirementResult = determineReviewApprovalRequirement(input.ruleInput ?? {});

    const persisted = await createReviewApprovalRecord(
      {
        id: input.id,
        reviewId: input.reviewId,
        tenantId: input.tenantId,
        caseId: input.caseId,
        actorId: input.actorId,
        approverId: input.approverId,
        approvalState: 'pending',
        approvalRequirement: requirementResult.requirement,
        createdAt: input.createdAt,
        updatedAt: input.createdAt,
      } satisfies CreateReviewApprovalRecordInput,
      this.persistence,
    );

    return {
      approvalChain: mapPersistenceRecordToApprovalChainModel(persisted),
      requirementResult,
    };
  }

  async refreshApprovalRequirement(
    input: RefreshReviewApprovalRequirementServiceInput,
  ): Promise<ReviewApprovalServiceResult> {
    const requirementResult = determineReviewApprovalRequirement(input.ruleInput);

    const persisted = await persistReviewApprovalRequirement(
      {
        id: input.id,
        tenantId: input.tenantId,
        caseId: input.caseId,
        actorId: input.actorId,
        approvalRequirement: requirementResult.requirement,
        updatedAt: input.updatedAt,
      } satisfies PersistReviewApprovalRequirementInput,
      this.persistence,
    );

    return {
      approvalChain: mapPersistenceRecordToApprovalChainModel(persisted, input.reviewId),
      requirementResult,
    };
  }

  async assignApprover(
    input: AssignReviewApprovalApproverServiceInput,
  ): Promise<ReviewApprovalChainModel> {
    const persisted = await persistReviewApproverId(
      {
        id: input.id,
        tenantId: input.tenantId,
        caseId: input.caseId,
        actorId: input.actorId,
        approverId: input.approverId,
        updatedAt: input.updatedAt,
      } satisfies PersistReviewApproverIdInput,
      this.persistence,
    );

    return mapPersistenceRecordToApprovalChainModel(persisted, input.reviewId);
  }

  async approveReview(input: ApproveReviewServiceInput): Promise<ReviewApprovalChainModel> {
    assertApprovalDecisionAllowed({
      actorRole: input.actorRole,
      approvalRequirement: input.approvalRequirement,
      approvalCount: input.approvalCount,
    });

    const persisted = await updateReviewApprovalState(
      {
        id: input.id,
        tenantId: input.tenantId,
        caseId: input.caseId,
        actorId: input.actorId,
        approvalState: 'approved',
        approvedAt: input.approvedAt,
        updatedAt: input.updatedAt,
      } satisfies UpdateReviewApprovalStateInput,
      this.persistence,
    );

    return mapPersistenceRecordToApprovalChainModel(persisted, input.reviewId);
  }

  async rejectReview(input: RejectReviewServiceInput): Promise<ReviewApprovalChainModel> {
    assertApprovalDecisionAllowed({
      actorRole: input.actorRole,
      approvalRequirement: input.approvalRequirement,
    });

    const persisted = await updateReviewApprovalState(
      {
        id: input.id,
        tenantId: input.tenantId,
        caseId: input.caseId,
        actorId: input.actorId,
        approvalState: 'rejected',
        rejectedAt: input.rejectedAt,
        updatedAt: input.updatedAt,
      } satisfies UpdateReviewApprovalStateInput,
      this.persistence,
    );

    return mapPersistenceRecordToApprovalChainModel(persisted, input.reviewId);
  }
}

let reviewApprovalServiceInstance: ReviewApprovalService | null = null;

export function getReviewApprovalService(
  dependencies: ReviewApprovalServiceDependencies,
): ReviewApprovalService {
  if (!reviewApprovalServiceInstance) {
    reviewApprovalServiceInstance = new ReviewApprovalService(dependencies);
  }

  return reviewApprovalServiceInstance;
}

interface ReviewApprovalDecisionGuardInput {
  actorRole: MandatoryReviewApproverRole;
  approvalRequirement: ReviewApprovalRequirementModel;
  approvalCount?: number;
}

function assertApprovalDecisionAllowed(
  input: ReviewApprovalDecisionGuardInput,
): void {
  if (
    input.actorRole !== 'admin' &&
    input.actorRole !== input.approvalRequirement.mandatoryApproverRole
  ) {
    throw new Error(
      `Approval decision requires ${input.approvalRequirement.mandatoryApproverRole} role`,
    );
  }

  if (input.approvalRequirement.requiresHighRiskApprovalPath) {
    if (input.approvalRequirement.path !== 'high_risk') {
      throw new Error('High-risk case cannot bypass required path');
    }

    if (
      input.approvalRequirement.mandatoryApproverRole !== 'compliance_manager' ||
      (input.actorRole !== 'admin' && input.actorRole !== 'compliance_manager')
    ) {
      throw new Error('High-risk case cannot bypass required path');
    }
  }

  if (
    input.approvalRequirement.requiresElevatedApproval &&
    normalizeApprovalCount(input.approvalCount) <
      input.approvalRequirement.minimumApprovalsRequired
  ) {
    throw new Error(
      `Approval decision requires ${input.approvalRequirement.minimumApprovalsRequired} approvals before completion`,
    );
  }
}

function normalizeApprovalCount(value?: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 1;
  }

  return Math.max(0, Math.floor(value));
}

function mapPersistenceRecordToApprovalChainModel(
  record: ReviewApprovalPersistenceRecord,
  reviewIdOverride?: string,
): ReviewApprovalChainModel {
  const step = mapPersistenceRecordToStep(record);

  return {
    reviewId: reviewIdOverride ?? record.review_id,
    tenantId: record.tenant_id,
    caseId: record.case_id,
    steps: [step],
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function mapPersistenceRecordToStep(
  record: ReviewApprovalPersistenceRecord,
): ReviewApprovalChainStepModel {
  const decisionActor = mapDecisionActor(record);

  return {
    stepId: `approval_step:${record.id}:1`,
    level: record.approval_requirement?.level ?? 'level_1',
    requirement: record.approval_requirement ?? {
      level: 'level_1',
      path: 'standard',
      mandatoryApproverRole: 'approver',
      minimumApprovalsRequired: 1,
      requiresElevatedApproval: false,
      requiresHighRiskApprovalPath: false,
    },
    decisionStatus: record.approval_state,
    decisionActor,
  };
}

function mapDecisionActor(
  record: ReviewApprovalPersistenceRecord,
): ReviewApprovalDecisionActor | undefined {
  if (record.approval_state === 'pending') {
    return undefined;
  }

  const decidedAt =
    record.approval_state === 'approved'
      ? record.approved_at
      : record.rejected_at;

  if (!decidedAt) {
    return undefined;
  }

  const actorRole = record.approval_requirement?.mandatoryApproverRole ?? 'approver';

  return {
    actorId: record.approver_id ?? record.actor_id,
    actorRole,
    decidedAt,
  };
}

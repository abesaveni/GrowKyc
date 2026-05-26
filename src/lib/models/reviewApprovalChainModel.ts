import type { ReviewWorkflowRole } from './reviewWorkflowRoleModel';

/**
 * Typed approval levels used by the review approval chain.
 */
export type ReviewApprovalLevel =
  | 'level_1'
  | 'level_2'
  | 'elevated'
  | 'high_risk';

/**
 * Canonical approval level values for runtime guards.
 */
export const REVIEW_APPROVAL_LEVELS: readonly ReviewApprovalLevel[] = [
  'level_1',
  'level_2',
  'elevated',
  'high_risk',
] as const;

/**
 * Typed approval path routing.
 */
export type ReviewApprovalPath = 'standard' | 'elevated' | 'high_risk';

/**
 * Roles that can be mandatory approvers in the approval chain.
 */
export type MandatoryReviewApproverRole = Extract<
  ReviewWorkflowRole,
  'approver' | 'compliance_manager' | 'admin'
>;

/**
 * Typed requirement model per approval level.
 */
export interface ReviewApprovalRequirementModel {
  level: ReviewApprovalLevel;
  path: ReviewApprovalPath;
  mandatoryApproverRole: MandatoryReviewApproverRole;
  minimumApprovalsRequired: number;
  requiresElevatedApproval: boolean;
  requiresHighRiskApprovalPath: boolean;
}

/**
 * Decision status for an approval chain step.
 */
export type ReviewApprovalDecisionStatus = 'pending' | 'approved' | 'rejected';

/**
 * Approval decision actor/timestamp model.
 */
export interface ReviewApprovalDecisionActor {
  actorId: string;
  actorRole: MandatoryReviewApproverRole;
  decidedAt: string;
}

/**
 * Typed approval chain step model.
 */
export interface ReviewApprovalChainStepModel {
  stepId: string;
  level: ReviewApprovalLevel;
  requirement: ReviewApprovalRequirementModel;
  decisionStatus: ReviewApprovalDecisionStatus;
  decisionActor?: ReviewApprovalDecisionActor;
}

/**
 * Canonical review approval chain model.
 */
export interface ReviewApprovalChainModel {
  reviewId: string;
  tenantId: string;
  caseId: string;
  steps: ReviewApprovalChainStepModel[];
  createdAt: string;
  updatedAt: string;
}

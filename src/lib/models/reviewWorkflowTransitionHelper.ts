import type { ReviewDecisionState } from './reviewDecisionStateModel';
import type { ReviewWorkflowRole } from './reviewWorkflowRoleModel';
import type { ReviewWorkflowState } from './reviewWorkflowStateModel';

/**
 * Reason codes for transitions ending in changes requested.
 */
export type ReviewChangesRequestedReasonCode =
  | 'missing_information'
  | 'insufficient_documentation'
  | 'policy_gap'
  | 'clarification_required'
  | 'other';

/**
 * Reason codes for transitions ending in rejected.
 */
export type ReviewRejectedReasonCode =
  | 'policy_violation'
  | 'risk_unacceptable'
  | 'fraud_concern'
  | 'invalid_submission'
  | 'other';

/**
 * Reason codes for transitions ending in escalated.
 */
export type ReviewEscalatedReasonCode =
  | 'high_risk_pattern'
  | 'sanctions_hit'
  | 'pep_match'
  | 'regulatory_obligation'
  | 'other';

/**
 * State subset that requires reason code support.
 */
export type ReviewStateRequiringReasonCode = Extract<
  ReviewDecisionState,
  'changes_requested' | 'rejected' | 'escalated'
>;

/**
 * Typed reason code by target state.
 */
export type ReviewTransitionReasonCodeByState = {
  changes_requested: ReviewChangesRequestedReasonCode;
  rejected: ReviewRejectedReasonCode;
  escalated: ReviewEscalatedReasonCode;
};

/**
 * Any allowed reason code across reason-required states.
 */
export type ReviewTransitionReasonCode =
  | ReviewChangesRequestedReasonCode
  | ReviewRejectedReasonCode
  | ReviewEscalatedReasonCode;

/**
 * Canonical valid transition map.
 */
export const REVIEW_WORKFLOW_VALID_TRANSITIONS: Readonly<
  Record<ReviewWorkflowState, readonly ReviewWorkflowState[]>
> = {
  draft: ['submitted_for_review'],
  submitted_for_review: ['in_review'],
  in_review: ['changes_requested', 'submitted_for_approval', 'rejected', 'escalated'],
  changes_requested: ['draft', 'submitted_for_review'],
  submitted_for_approval: ['approved', 'changes_requested', 'rejected', 'escalated'],
  approved: [],
  rejected: [],
  escalated: ['in_review', 'submitted_for_approval', 'rejected'],
} as const;

/**
 * Role-aware target state permissions.
 */
export const REVIEW_WORKFLOW_ROLE_TRANSITION_TARGETS: Readonly<
  Record<ReviewWorkflowRole, readonly ReviewWorkflowState[]>
> = {
  preparer: ['draft', 'submitted_for_review'],
  reviewer: ['in_review', 'changes_requested', 'submitted_for_approval', 'rejected', 'escalated'],
  approver: ['approved', 'changes_requested', 'rejected', 'escalated'],
  compliance_manager: [
    'draft',
    'submitted_for_review',
    'in_review',
    'changes_requested',
    'submitted_for_approval',
    'approved',
    'rejected',
    'escalated',
  ],
  admin: [
    'draft',
    'submitted_for_review',
    'in_review',
    'changes_requested',
    'submitted_for_approval',
    'approved',
    'rejected',
    'escalated',
  ],
  read_only_auditor: [],
} as const;

/**
 * Hook payload for role-aware transition points.
 */
export interface ReviewWorkflowTransitionContext {
  fromState: ReviewWorkflowState;
  toState: ReviewWorkflowState;
  actorRole: ReviewWorkflowRole;
  reasonCode?: ReviewTransitionReasonCode;
}

/**
 * Hook points for orchestration layers without coupling persistence.
 */
export interface ReviewWorkflowTransitionHooks {
  beforeValidate?: (context: ReviewWorkflowTransitionContext) => void;
  beforeTransition?: (context: ReviewWorkflowTransitionContext) => void;
  afterTransition?: (context: ReviewWorkflowTransitionContext) => void;
}

/**
 * Transition request payload.
 */
export interface TransitionReviewWorkflowStateInput {
  fromState: ReviewWorkflowState;
  toState: ReviewWorkflowState;
  actorRole: ReviewWorkflowRole;
  reasonCode?: ReviewTransitionReasonCode;
  hooks?: ReviewWorkflowTransitionHooks;
}

/**
 * Transition result payload.
 */
export interface TransitionReviewWorkflowStateResult {
  nextState: ReviewWorkflowState;
  isChanged: boolean;
  actorRole: ReviewWorkflowRole;
  reasonCode?: ReviewTransitionReasonCode;
}

/**
 * Centralized role-aware transition helper.
 */
export function transitionReviewWorkflowState(
  input: TransitionReviewWorkflowStateInput,
): TransitionReviewWorkflowStateResult {
  const context: ReviewWorkflowTransitionContext = {
    fromState: input.fromState,
    toState: input.toState,
    actorRole: input.actorRole,
    reasonCode: input.reasonCode,
  };

  input.hooks?.beforeValidate?.(context);

  assertRoleCanTargetState(context.actorRole, context.toState);
  assertValidReviewWorkflowTransition(context.fromState, context.toState);
  assertReasonCodeRules(context.toState, context.reasonCode);

  input.hooks?.beforeTransition?.(context);

  const result: TransitionReviewWorkflowStateResult = {
    nextState: context.toState,
    isChanged: context.fromState !== context.toState,
    actorRole: context.actorRole,
    reasonCode: context.reasonCode,
  };

  input.hooks?.afterTransition?.(context);

  return result;
}

/**
 * Invalid transition guard.
 */
export function assertValidReviewWorkflowTransition(
  fromState: ReviewWorkflowState,
  toState: ReviewWorkflowState,
): void {
  const validTargets = REVIEW_WORKFLOW_VALID_TRANSITIONS[fromState] ?? [];

  if (!validTargets.includes(toState)) {
    throw new Error(
      `Invalid review workflow transition from ${fromState} to ${toState}`,
    );
  }
}

function assertRoleCanTargetState(
  actorRole: ReviewWorkflowRole,
  toState: ReviewWorkflowState,
): void {
  const allowedTargets = REVIEW_WORKFLOW_ROLE_TRANSITION_TARGETS[actorRole] ?? [];

  if (!allowedTargets.includes(toState)) {
    throw new Error(
      `Role ${actorRole} cannot transition review workflow to ${toState}`,
    );
  }
}

function assertReasonCodeRules(
  toState: ReviewWorkflowState,
  reasonCode?: ReviewTransitionReasonCode,
): void {
  if (isReasonCodeRequiredState(toState) && !reasonCode) {
    throw new Error(`reasonCode is required when transitioning to ${toState}`);
  }

  if (!isReasonCodeRequiredState(toState) && reasonCode) {
    throw new Error(
      `reasonCode is only allowed for changes_requested, rejected, or escalated`,
    );
  }

  if (isReasonCodeRequiredState(toState) && reasonCode) {
    assertReasonCodeMatchesTargetState(toState, reasonCode);
  }
}

function isReasonCodeRequiredState(
  state: ReviewWorkflowState,
): state is ReviewStateRequiringReasonCode {
  return (
    state === 'changes_requested' || state === 'rejected' || state === 'escalated'
  );
}

function assertReasonCodeMatchesTargetState(
  toState: ReviewStateRequiringReasonCode,
  reasonCode: ReviewTransitionReasonCode,
): void {
  const validReasonCodes = REVIEW_REASON_CODES_BY_STATE[toState];

  if (!validReasonCodes.includes(reasonCode as never)) {
    throw new Error(
      `reasonCode ${reasonCode} is invalid for transition target state ${toState}`,
    );
  }
}

const REVIEW_REASON_CODES_BY_STATE: Readonly<{
  [K in ReviewStateRequiringReasonCode]: readonly ReviewTransitionReasonCodeByState[K][];
}> = {
  changes_requested: [
    'missing_information',
    'insufficient_documentation',
    'policy_gap',
    'clarification_required',
    'other',
  ],
  rejected: [
    'policy_violation',
    'risk_unacceptable',
    'fraud_concern',
    'invalid_submission',
    'other',
  ],
  escalated: [
    'high_risk_pattern',
    'sanctions_hit',
    'pep_match',
    'regulatory_obligation',
    'other',
  ],
} as const;

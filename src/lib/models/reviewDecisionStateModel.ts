/**
 * Server-side review decision state model.
 */

/**
 * Final or intermediate decision states in review handling.
 */
export type ReviewDecisionState =
  | 'changes_requested'
  | 'approved'
  | 'rejected'
  | 'escalated';

/**
 * Canonical decision values for runtime validation and guards.
 */
export const REVIEW_DECISION_STATES: readonly ReviewDecisionState[] = [
  'changes_requested',
  'approved',
  'rejected',
  'escalated',
] as const;

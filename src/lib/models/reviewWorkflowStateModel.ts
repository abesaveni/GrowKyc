/**
 * Server-side review workflow state model.
 */

/**
 * Lifecycle states for review workflow progression.
 */
export type ReviewWorkflowState =
  | 'draft'
  | 'submitted_for_review'
  | 'in_review'
  | 'changes_requested'
  | 'submitted_for_approval'
  | 'approved'
  | 'rejected'
  | 'escalated';

/**
 * Canonical state values for runtime validation and guards.
 */
export const REVIEW_WORKFLOW_STATES: readonly ReviewWorkflowState[] = [
  'draft',
  'submitted_for_review',
  'in_review',
  'changes_requested',
  'submitted_for_approval',
  'approved',
  'rejected',
  'escalated',
] as const;

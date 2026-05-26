/**
 * Server-side review workflow role model.
 */

/**
 * Supported roles in the review workflow.
 */
export type ReviewWorkflowRole =
  | 'preparer'
  | 'reviewer'
  | 'approver'
  | 'compliance_manager'
  | 'admin'
  | 'read_only_auditor';

/**
 * Canonical role values for runtime validation and guards.
 */
export const REVIEW_WORKFLOW_ROLES: readonly ReviewWorkflowRole[] = [
  'preparer',
  'reviewer',
  'approver',
  'compliance_manager',
  'admin',
  'read_only_auditor',
] as const;

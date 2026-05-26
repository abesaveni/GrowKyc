/**
 * Server-side review issue severity model.
 */

/**
 * Severity levels for issues identified during review.
 */
export type ReviewIssueSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Canonical severity values for runtime validation and guards.
 */
export const REVIEW_ISSUE_SEVERITIES: readonly ReviewIssueSeverity[] = [
  'low',
  'medium',
  'high',
  'critical',
] as const;

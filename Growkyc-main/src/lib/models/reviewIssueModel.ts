/**
 * Server-side review issue domain model.
 */

import type { ReviewIssueSeverity } from './reviewIssueSeverityModel';

/**
 * Lifecycle status for a review issue.
 */
export type ReviewIssueStatus = 'open' | 'resolved' | 'accepted_with_reason';

/**
 * Canonical issue status values for runtime guards.
 */
export const REVIEW_ISSUE_STATUSES: readonly ReviewIssueStatus[] = [
  'open',
  'resolved',
  'accepted_with_reason',
] as const;

/**
 * Structured reason payload for issue decisions.
 */
export interface ReviewIssueReason {
  code: string;
  details?: string;
}

/**
 * Source finding shape used to create review issues.
 */
export interface BotFindingForReviewIssue {
  id: string;
  source: string;
  tenantId: string;
  caseId?: string;
  title: string;
  description?: string;
  severity: string;
  metadata?: Record<string, unknown>;
  detectedAt?: string | Date;
}

/**
 * Canonical review issue model.
 */
export interface ReviewIssueModel {
  id: string;
  tenantId: string;
  caseId?: string;
  findingId: string;
  findingSource: string;
  title: string;
  description?: string;
  severity: ReviewIssueSeverity;
  status: ReviewIssueStatus;
  reason?: ReviewIssueReason;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

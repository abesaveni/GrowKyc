import type { ReviewIssueSeverity } from './reviewIssueSeverityModel';
import type {
  BotFindingForReviewIssue,
  ReviewIssueModel,
  ReviewIssueReason,
  ReviewIssueStatus,
} from './reviewIssueModel';

export interface AggregateBotFindingsToReviewIssuesInput {
  findings: readonly BotFindingForReviewIssue[];
  defaultStatus?: ReviewIssueStatus;
  aggregatedAt?: string | Date;
}

export interface MarkReviewIssueOpenInput {
  issue: ReviewIssueModel;
  updatedAt?: string | Date;
}

export interface MarkReviewIssueResolvedInput {
  issue: ReviewIssueModel;
  reason?: ReviewIssueReason;
  updatedAt?: string | Date;
}

export interface MarkReviewIssueAcceptedWithReasonInput {
  issue: ReviewIssueModel;
  reason: ReviewIssueReason;
  updatedAt?: string | Date;
}

/**
 * Centralized helper that converts bot findings into typed review issues.
 */
export function aggregateBotFindingsToReviewIssues(
  input: AggregateBotFindingsToReviewIssuesInput,
): ReviewIssueModel[] {
  const aggregatedAt = normalizeDate(input.aggregatedAt ?? new Date(), 'aggregatedAt');
  const defaultStatus = input.defaultStatus ?? 'open';

  if (defaultStatus === 'accepted_with_reason') {
    throw new Error('defaultStatus cannot be accepted_with_reason without a reason');
  }

  return input.findings.map((finding) => {
    const createdAt = normalizeDate(
      finding.detectedAt ?? aggregatedAt,
      'finding.detectedAt',
    ).toISOString();

    return {
      id: buildReviewIssueId(finding),
      tenantId: finding.tenantId,
      caseId: finding.caseId,
      findingId: finding.id,
      findingSource: finding.source,
      title: finding.title,
      description: finding.description,
      severity: mapBotFindingSeverityToReviewIssueSeverity(finding.severity),
      status: defaultStatus,
      metadata: finding.metadata,
      createdAt,
      updatedAt: aggregatedAt.toISOString(),
    };
  });
}

/**
 * Maps bot finding severity labels into typed review issue severity.
 */
export function mapBotFindingSeverityToReviewIssueSeverity(
  findingSeverity: string,
): ReviewIssueSeverity {
  const normalized = findingSeverity.trim().toLowerCase();

  switch (normalized) {
    case 'info':
      return 'low';
    case 'low':
      return 'low';
    case 'medium':
      return 'medium';
    case 'high':
      return 'high';
    case 'critical':
      return 'critical';
    default:
      return 'medium';
  }
}

/**
 * Marks an issue as open and clears reason metadata.
 */
export function markReviewIssueOpen(input: MarkReviewIssueOpenInput): ReviewIssueModel {
  return applyIssueStatusTransition({
    issue: input.issue,
    status: 'open',
    updatedAt: input.updatedAt,
  });
}

/**
 * Marks an issue as resolved with optional reason metadata.
 */
export function markReviewIssueResolved(
  input: MarkReviewIssueResolvedInput,
): ReviewIssueModel {
  return applyIssueStatusTransition({
    issue: input.issue,
    status: 'resolved',
    reason: input.reason,
    updatedAt: input.updatedAt,
  });
}

/**
 * Marks an issue as accepted_with_reason and enforces reason support.
 */
export function markReviewIssueAcceptedWithReason(
  input: MarkReviewIssueAcceptedWithReasonInput,
): ReviewIssueModel {
  return applyIssueStatusTransition({
    issue: input.issue,
    status: 'accepted_with_reason',
    reason: input.reason,
    updatedAt: input.updatedAt,
  });
}

interface ApplyIssueStatusTransitionInput {
  issue: ReviewIssueModel;
  status: ReviewIssueStatus;
  reason?: ReviewIssueReason;
  updatedAt?: string | Date;
}

function applyIssueStatusTransition(
  input: ApplyIssueStatusTransitionInput,
): ReviewIssueModel {
  const updatedAt = normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString();

  if (input.status === 'accepted_with_reason' && !input.reason) {
    throw new Error('reason is required when status is accepted_with_reason');
  }

  return {
    ...input.issue,
    status: input.status,
    reason:
      input.status === 'open'
        ? undefined
        : input.reason ?? input.issue.reason,
    updatedAt,
  };
}

function buildReviewIssueId(finding: BotFindingForReviewIssue): string {
  const source = finding.source.trim().toLowerCase().replace(/\s+/g, '_');
  return `review_issue:${source}:${finding.id}`;
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}

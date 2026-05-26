import type {
  ReviewerExceptionEntry,
  ReviewerExceptionItem,
  ReviewerExceptionReasonCode,
  ReviewerExceptionReportInput,
  ReviewerExceptionResult,
} from '../models/reviewerExceptionResult';

const OPEN_REVIEW_STATUSES = new Set(['open', 'pending_review', 'in_review', 'needs_review']);
const UNRESOLVED_FINDING_STATUSES = new Set(['open', 'pending', 'unresolved', 'in_progress']);
const REJECTED_STATES = new Set(['rejected', 'declined']);
const ESCALATED_STATES = new Set(['escalated', 'escalation_required']);

const defaultTenantItemGuard = (item: ReviewerExceptionItem, tenant_id: string): boolean => {
  return item.tenant_id === tenant_id;
};

const normalize = (value?: string): string => {
  return (value ?? '').trim().toLowerCase();
};

export const isOpenReviewIssue = (item: ReviewerExceptionItem): boolean => {
  if (item.is_resolved === true) {
    return false;
  }

  return OPEN_REVIEW_STATUSES.has(normalize(item.review_status));
};

export const isUnresolvedSevereFinding = (item: ReviewerExceptionItem): boolean => {
  if (item.is_resolved === true) {
    return false;
  }

  const isSevere = normalize(item.severity) === 'severe';
  const findingStatus = normalize(item.finding_status);

  return isSevere && (findingStatus === '' || UNRESOLVED_FINDING_STATUSES.has(findingStatus));
};

export const isRejectedOrEscalatedItem = (item: ReviewerExceptionItem): boolean => {
  const decision = normalize(item.decision);
  const outcome = normalize(item.outcome);

  if (item.is_rejected === true || REJECTED_STATES.has(decision) || REJECTED_STATES.has(outcome)) {
    return true;
  }

  if (item.is_escalated === true || ESCALATED_STATES.has(decision) || ESCALATED_STATES.has(outcome)) {
    return true;
  }

  return false;
};

const resolveReasonCodes = (item: ReviewerExceptionItem): ReviewerExceptionReasonCode[] => {
  const reasonCodes: ReviewerExceptionReasonCode[] = [];

  if (isOpenReviewIssue(item)) {
    reasonCodes.push('open_review_issue');
  }

  if (isUnresolvedSevereFinding(item)) {
    reasonCodes.push('unresolved_severe_finding');
  }

  const decision = normalize(item.decision);
  const outcome = normalize(item.outcome);

  if (item.is_rejected === true || REJECTED_STATES.has(decision) || REJECTED_STATES.has(outcome)) {
    reasonCodes.push('rejected_item');
  }

  if (item.is_escalated === true || ESCALATED_STATES.has(decision) || ESCALATED_STATES.has(outcome)) {
    reasonCodes.push('escalated_item');
  }

  return reasonCodes;
};

const toReasonDetail = (reasonCode: ReviewerExceptionReasonCode): string => {
  switch (reasonCode) {
    case 'open_review_issue':
      return 'Item remains open in the review queue.';
    case 'unresolved_severe_finding':
      return 'Severe finding is unresolved.';
    case 'rejected_item':
      return 'Item has been rejected and requires exception tracking.';
    case 'escalated_item':
      return 'Item has been escalated and requires exception tracking.';
    default:
      return 'Reviewer exception detected.';
  }
};

export const buildReviewerExceptionReport = (input: ReviewerExceptionReportInput): ReviewerExceptionResult => {
  const tenantGuard = input.is_tenant_item ?? defaultTenantItemGuard;
  const scopedItems = input.review_items.filter((item) => tenantGuard(item, input.tenant_id));
  const exceptions: ReviewerExceptionEntry[] = [];

  const reason_counts: Record<ReviewerExceptionReasonCode, number> = {
    open_review_issue: 0,
    unresolved_severe_finding: 0,
    rejected_item: 0,
    escalated_item: 0,
  };

  for (const item of scopedItems) {
    const reasonCodes = resolveReasonCodes(item);

    for (const reasonCode of reasonCodes) {
      reason_counts[reasonCode] += 1;

      exceptions.push({
        item_id: item.item_id,
        tenant_id: item.tenant_id,
        case_id: item.case_id,
        reason_code: reasonCode,
        reason_detail: toReasonDetail(reasonCode),
        severity: item.severity,
        source_type: item.source_type,
      });
    }
  }

  return {
    tenant_id: input.tenant_id,
    generated_at: new Date().toISOString(),
    total_exceptions: exceptions.length,
    reason_counts,
    exceptions,
  };
};
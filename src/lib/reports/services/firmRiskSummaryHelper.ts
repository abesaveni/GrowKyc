import type {
  FirmCaseRiskSummary,
  FirmRiskRecord,
  FirmRiskSummaryInput,
  FirmRiskSummaryResult,
} from '../models/firmRiskSummaryResult';

const HIGH_RISK_LEVELS = new Set(['high', 'critical', 'severe']);
const REVIEW_CLOSED_STATUSES = new Set(['completed', 'closed', 'resolved', 'approved']);
const DOCUMENT_INACTIVE_STATUSES = new Set(['inactive', 'archived', 'deleted']);

const defaultTenantRecordGuard = (record: FirmRiskRecord, tenant_id: string): boolean => {
  return record.tenant_id === tenant_id;
};

const normalize = (value?: string): string => {
  return (value ?? '').trim().toLowerCase();
};

const parseDate = (value?: string): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Date.parse(value);

  if (Number.isNaN(parsed)) {
    return undefined;
  }

  return parsed;
};

export const isHighRiskRecord = (record: FirmRiskRecord): boolean => {
  return HIGH_RISK_LEVELS.has(normalize(record.risk_level));
};

export const isOverdueReviewRecord = (record: FirmRiskRecord, nowTimestamp: number): boolean => {
  const reviewDueAt = parseDate(record.review_due_at);

  if (!reviewDueAt) {
    return false;
  }

  const reviewStatus = normalize(record.review_status);

  if (REVIEW_CLOSED_STATUSES.has(reviewStatus)) {
    return false;
  }

  return reviewDueAt < nowTimestamp;
};

export const isExpiringDocumentRecord = (
  record: FirmRiskRecord,
  nowTimestamp: number,
  expiringWithinDays: number,
): boolean => {
  const expiryAt = parseDate(record.document_expiry_at);

  if (!expiryAt) {
    return false;
  }

  if (DOCUMENT_INACTIVE_STATUSES.has(normalize(record.document_status))) {
    return false;
  }

  const thresholdTimestamp = nowTimestamp + expiringWithinDays * 24 * 60 * 60 * 1000;

  return expiryAt <= thresholdTimestamp;
};

export const aggregateHighRiskCounts = (records: FirmRiskRecord[]): number => {
  return records.reduce((count, record) => {
    return count + (isHighRiskRecord(record) ? 1 : 0);
  }, 0);
};

export const aggregateOverdueReviews = (records: FirmRiskRecord[], nowTimestamp: number): number => {
  return records.reduce((count, record) => {
    return count + (isOverdueReviewRecord(record, nowTimestamp) ? 1 : 0);
  }, 0);
};

export const aggregateExpiringDocumentCounts = (
  records: FirmRiskRecord[],
  nowTimestamp: number,
  expiringWithinDays: number,
): number => {
  return records.reduce((count, record) => {
    return count + (isExpiringDocumentRecord(record, nowTimestamp, expiringWithinDays) ? 1 : 0);
  }, 0);
};

export const aggregateRiskByCase = (
  records: FirmRiskRecord[],
  nowTimestamp: number,
  expiringWithinDays: number,
): FirmCaseRiskSummary[] => {
  const grouped: Record<string, FirmRiskRecord[]> = {};

  for (const record of records) {
    const caseId = record.case_id;

    if (!caseId) {
      continue;
    }

    if (!grouped[caseId]) {
      grouped[caseId] = [];
    }

    grouped[caseId].push(record);
  }

  return Object.entries(grouped).map(([case_id, caseRecords]) => {
    return {
      case_id,
      total_items: caseRecords.length,
      high_risk_count: aggregateHighRiskCounts(caseRecords),
      overdue_review_count: aggregateOverdueReviews(caseRecords, nowTimestamp),
      expiring_document_count: aggregateExpiringDocumentCounts(caseRecords, nowTimestamp, expiringWithinDays),
    };
  });
};

export const buildFirmRiskSummary = (input: FirmRiskSummaryInput): FirmRiskSummaryResult => {
  const tenantGuard = input.is_tenant_record ?? defaultTenantRecordGuard;
  const nowTimestamp = parseDate(input.now) ?? Date.now();
  const expiringWithinDays = input.expiring_within_days ?? 30;
  const scopedRecords = input.risk_records.filter((record) => tenantGuard(record, input.tenant_id));

  const case_summaries = aggregateRiskByCase(scopedRecords, nowTimestamp, expiringWithinDays);

  return {
    tenant_id: input.tenant_id,
    generated_at: new Date(nowTimestamp).toISOString(),
    total_cases: case_summaries.length,
    total_records: scopedRecords.length,
    high_risk_count: aggregateHighRiskCounts(scopedRecords),
    overdue_review_count: aggregateOverdueReviews(scopedRecords, nowTimestamp),
    expiring_document_count: aggregateExpiringDocumentCounts(scopedRecords, nowTimestamp, expiringWithinDays),
    case_summaries,
  };
};
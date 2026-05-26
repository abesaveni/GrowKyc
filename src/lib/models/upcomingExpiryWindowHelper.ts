import { DocumentExpiryStatus } from './documentExpiryModel';

export interface UpcomingExpiryDocument {
  documentId: string;
  tenantId: string;
  caseId?: string;
  expiryDate?: string | Date;
  status?: DocumentExpiryStatus;
  metadata?: Record<string, unknown>;
}

export interface UpcomingExpiryWindowQuery {
  evaluatedAt: string | Date;
  windowDays: number;
  tenantId?: string;
  documents: UpcomingExpiryDocument[];
  tenantFilterHook?: (document: UpcomingExpiryDocument) => boolean;
  caseGroupingHook?: (document: UpcomingExpiryDocument) => string;
}

export interface UpcomingExpiryMatch {
  documentId: string;
  tenantId: string;
  caseId?: string;
  expiryDate: string;
  daysUntilExpiry: number;
  metadata?: Record<string, unknown>;
}

export interface UpcomingExpiryWindowResult {
  evaluatedAt: string;
  windowDays: number;
  totalMatched: number;
  matches: UpcomingExpiryMatch[];
  groupedByCase: Record<string, UpcomingExpiryMatch[]>;
}

export const DEFAULT_CASE_GROUP_KEY = 'unassigned_case';

/**
 * Identifies documents expiring within a configured upcoming window.
 */
export function findDocumentsInUpcomingExpiryWindow(
  query: UpcomingExpiryWindowQuery,
): UpcomingExpiryWindowResult {
  const evaluatedAt = normalizeDate(query.evaluatedAt, 'evaluatedAt');

  if (!Number.isInteger(query.windowDays) || query.windowDays < 0) {
    throw new Error('windowDays must be a non-negative integer');
  }

  const matches: UpcomingExpiryMatch[] = [];

  for (const document of query.documents) {
    if (query.tenantId && document.tenantId !== query.tenantId) {
      continue;
    }

    if (query.tenantFilterHook && !query.tenantFilterHook(document)) {
      continue;
    }

    if (document.status === 'no_expiry' || document.status === 'replaced') {
      continue;
    }

    if (!document.expiryDate) {
      continue;
    }

    const expiryDate = normalizeDate(document.expiryDate, 'document.expiryDate');
    const daysUntilExpiry = calculateDayDelta(evaluatedAt, expiryDate);

    if (daysUntilExpiry < 0 || daysUntilExpiry > query.windowDays) {
      continue;
    }

    matches.push({
      documentId: document.documentId,
      tenantId: document.tenantId,
      caseId: document.caseId,
      expiryDate: expiryDate.toISOString(),
      daysUntilExpiry,
      metadata: document.metadata,
    });
  }

  const groupedByCase = groupMatchesByCase(matches, query.caseGroupingHook);

  return {
    evaluatedAt: evaluatedAt.toISOString(),
    windowDays: query.windowDays,
    totalMatched: matches.length,
    matches,
    groupedByCase,
  };
}

function groupMatchesByCase(
  matches: UpcomingExpiryMatch[],
  caseGroupingHook?: (document: UpcomingExpiryDocument) => string,
): Record<string, UpcomingExpiryMatch[]> {
  return matches.reduce<Record<string, UpcomingExpiryMatch[]>>((accumulator, match) => {
    const groupKey = caseGroupingHook
      ? caseGroupingHook({
          documentId: match.documentId,
          tenantId: match.tenantId,
          caseId: match.caseId,
          expiryDate: match.expiryDate,
          metadata: match.metadata,
        })
      : match.caseId ?? DEFAULT_CASE_GROUP_KEY;

    if (!accumulator[groupKey]) {
      accumulator[groupKey] = [];
    }

    accumulator[groupKey].push(match);
    return accumulator;
  }, {});
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}

function calculateDayDelta(fromDate: Date, toDate: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil((toDate.getTime() - fromDate.getTime()) / millisecondsPerDay);
}

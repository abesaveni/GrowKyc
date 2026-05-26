import { DocumentExpiryStatus } from './documentExpiryModel';

export interface DocumentExpiryEvaluationInput {
  evaluatedAt: string | Date;
  expiryDate?: string | Date;
  hasNoExpiry?: boolean;
  replacedAt?: string | Date;
  replacedBy?: string;
  expiringSoonWindowDays?: number;
}

export interface DocumentExpiryEvaluationResult {
  status: DocumentExpiryStatus;
  evaluatedAt: string;
  expiryDate?: string;
  replacedAt?: string;
  replacedBy?: string;
  hasNoExpiry: boolean;
  expiringSoonWindowDays: number;
  isActive: boolean;
  isExpiringSoon: boolean;
  isExpired: boolean;
  isReplaced: boolean;
  daysUntilExpiry?: number;
}

export const DEFAULT_EXPIRING_SOON_WINDOW_DAYS = 30;

/**
 * Evaluates the canonical document expiry status.
 */
export function evaluateDocumentExpiryStatus(
  input: DocumentExpiryEvaluationInput,
): DocumentExpiryEvaluationResult {
  const evaluatedAt = normalizeDate(input.evaluatedAt, 'evaluatedAt');
  const expiringSoonWindowDays =
    input.expiringSoonWindowDays ?? DEFAULT_EXPIRING_SOON_WINDOW_DAYS;

  if (!Number.isInteger(expiringSoonWindowDays) || expiringSoonWindowDays < 0) {
    throw new Error('expiringSoonWindowDays must be a non-negative integer');
  }

  const replacedAt = input.replacedAt
    ? normalizeDate(input.replacedAt, 'replacedAt')
    : undefined;
  const expiryDate = input.expiryDate
    ? normalizeDate(input.expiryDate, 'expiryDate')
    : undefined;

  const isReplaced = !!replacedAt || !!input.replacedBy;
  const hasNoExpiry = !!input.hasNoExpiry;

  let status: DocumentExpiryStatus;
  let isExpired = false;
  let isExpiringSoon = false;
  let isActive = false;
  let daysUntilExpiry: number | undefined;

  if (isReplaced) {
    status = 'replaced';
  } else if (hasNoExpiry) {
    status = 'no_expiry';
  } else if (!expiryDate) {
    status = 'active';
    isActive = true;
  } else {
    daysUntilExpiry = calculateDayDelta(evaluatedAt, expiryDate);

    if (daysUntilExpiry < 0) {
      status = 'expired';
      isExpired = true;
    } else if (daysUntilExpiry <= expiringSoonWindowDays) {
      status = 'expiring_soon';
      isExpiringSoon = true;
    } else {
      status = 'active';
      isActive = true;
    }
  }

  return {
    status,
    evaluatedAt: evaluatedAt.toISOString(),
    expiryDate: expiryDate?.toISOString(),
    replacedAt: replacedAt?.toISOString(),
    replacedBy: input.replacedBy,
    hasNoExpiry,
    expiringSoonWindowDays,
    isActive,
    isExpiringSoon,
    isExpired,
    isReplaced,
    daysUntilExpiry,
  };
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

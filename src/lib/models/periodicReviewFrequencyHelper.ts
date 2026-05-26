import { ReviewFrequency } from './periodicReviewModel';

/**
 * Default timing for high-risk accelerated reviews.
 * This can be overridden per call without introducing scheduler/provider coupling.
 */
export const DEFAULT_HIGH_RISK_ACCELERATED_REVIEW_DAYS = 90;

export interface PeriodicReviewFrequencyCalculationInput {
  frequency: ReviewFrequency;
  fromDate: string | Date;
  highRiskAcceleratedReviewDays?: number;
}

export interface PeriodicReviewFrequencyCalculationOutput {
  frequency: ReviewFrequency;
  fromDate: string;
  nextReviewDate: string;
  intervalMonths?: number;
  intervalDays?: number;
}

export interface HighRiskAcceleratedReviewTimingInput {
  fromDate: string | Date;
  reviewDays?: number;
}

export interface HighRiskAcceleratedReviewTimingOutput {
  frequency: 'high_risk_accelerated_review';
  fromDate: string;
  nextReviewDate: string;
  intervalDays: number;
}

export interface InitialReviewSchedulingInput {
  frequency: ReviewFrequency;
  startedAt: string | Date;
  highRiskAcceleratedReviewDays?: number;
}

export interface InitialReviewSchedulingOutput {
  frequency: ReviewFrequency;
  scheduledAt: string;
  nextReviewDate: string;
}

/**
 * Calculates the next review date from frequency using UTC-safe date math.
 */
export function calculateNextReviewDateFromFrequency(
  input: PeriodicReviewFrequencyCalculationInput,
): PeriodicReviewFrequencyCalculationOutput {
  const baseDate = normalizeDate(input.fromDate, 'fromDate');

  if (input.frequency === 'high_risk_accelerated_review') {
    const accelerated = calculateHighRiskAcceleratedReviewTiming({
      fromDate: baseDate,
      reviewDays: input.highRiskAcceleratedReviewDays,
    });

    return {
      frequency: accelerated.frequency,
      fromDate: accelerated.fromDate,
      nextReviewDate: accelerated.nextReviewDate,
      intervalDays: accelerated.intervalDays,
    };
  }

  const intervalMonths = getReviewIntervalMonths(input.frequency);
  const nextDate = addUtcMonthsClamped(baseDate, intervalMonths);

  return {
    frequency: input.frequency,
    fromDate: baseDate.toISOString(),
    nextReviewDate: nextDate.toISOString(),
    intervalMonths,
  };
}

/**
 * Calculates accelerated timing for high-risk reviews.
 */
export function calculateHighRiskAcceleratedReviewTiming(
  input: HighRiskAcceleratedReviewTimingInput,
): HighRiskAcceleratedReviewTimingOutput {
  const baseDate = normalizeDate(input.fromDate, 'fromDate');
  const intervalDays =
    input.reviewDays ?? DEFAULT_HIGH_RISK_ACCELERATED_REVIEW_DAYS;

  if (!Number.isInteger(intervalDays) || intervalDays <= 0) {
    throw new Error('reviewDays must be a positive integer');
  }

  const nextDate = addUtcDays(baseDate, intervalDays);

  return {
    frequency: 'high_risk_accelerated_review',
    fromDate: baseDate.toISOString(),
    nextReviewDate: nextDate.toISOString(),
    intervalDays,
  };
}

/**
 * Creates initial periodic review scheduling from a starting timestamp.
 */
export function scheduleInitialPeriodicReview(
  input: InitialReviewSchedulingInput,
): InitialReviewSchedulingOutput {
  const scheduledAt = normalizeDate(input.startedAt, 'startedAt');
  const next = calculateNextReviewDateFromFrequency({
    frequency: input.frequency,
    fromDate: scheduledAt,
    highRiskAcceleratedReviewDays: input.highRiskAcceleratedReviewDays,
  });

  return {
    frequency: input.frequency,
    scheduledAt: scheduledAt.toISOString(),
    nextReviewDate: next.nextReviewDate,
  };
}

function getReviewIntervalMonths(frequency: Exclude<ReviewFrequency, 'high_risk_accelerated_review'>): number {
  switch (frequency) {
    case 'annual':
      return 12;
    case '24_months':
      return 24;
    case '36_months':
      return 36;
    default:
      return assertNever(frequency);
  }
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}

function addUtcDays(baseDate: Date, days: number): Date {
  const result = new Date(baseDate.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function addUtcMonthsClamped(baseDate: Date, monthsToAdd: number): Date {
  const year = baseDate.getUTCFullYear();
  const month = baseDate.getUTCMonth();
  const day = baseDate.getUTCDate();

  const targetMonthIndex = month + monthsToAdd;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12;

  const maxDayInTargetMonth = getUtcDaysInMonth(targetYear, targetMonth);
  const clampedDay = Math.min(day, maxDayInTargetMonth);

  return new Date(
    Date.UTC(
      targetYear,
      targetMonth,
      clampedDay,
      baseDate.getUTCHours(),
      baseDate.getUTCMinutes(),
      baseDate.getUTCSeconds(),
      baseDate.getUTCMilliseconds(),
    ),
  );
}

function getUtcDaysInMonth(year: number, monthZeroIndexed: number): number {
  return new Date(Date.UTC(year, monthZeroIndexed + 1, 0)).getUTCDate();
}

function assertNever(value: never): never {
  throw new Error(`Unhandled review frequency: ${String(value)}`);
}

export interface DueReviewEvaluationInput {
  nextReviewDate: string | Date;
  evaluatedAt: string | Date;
  overdueGracePeriodDays?: number;
}

export interface OverdueReviewEvaluationInput {
  nextReviewDate: string | Date;
  evaluatedAt: string | Date;
  overdueGracePeriodDays?: number;
}

export interface UpcomingReviewWindowInput {
  nextReviewDate: string | Date;
  evaluatedAt: string | Date;
  windowDays: number;
}

export type PeriodicReviewState = 'upcoming' | 'due' | 'overdue';

export interface PeriodicReviewStateResult {
  state: PeriodicReviewState;
  isDue: boolean;
  isOverdue: boolean;
  isWithinUpcomingWindow: boolean;
  nextReviewDate: string;
  evaluatedAt: string;
  dueAt: string;
  overdueAt: string;
  daysUntilDue: number;
  daysUntilOverdue: number;
}

/**
 * Returns true only when a review is due but not yet overdue.
 */
export function isPeriodicReviewDue(input: DueReviewEvaluationInput): boolean {
  const nextReviewDate = normalizeDate(input.nextReviewDate, 'nextReviewDate');
  const evaluatedAt = normalizeDate(input.evaluatedAt, 'evaluatedAt');
  const overdueAt = buildOverdueAt(nextReviewDate, input.overdueGracePeriodDays);

  return evaluatedAt >= nextReviewDate && evaluatedAt < overdueAt;
}

/**
 * Returns true when a review has crossed the overdue threshold.
 */
export function isPeriodicReviewOverdue(input: OverdueReviewEvaluationInput): boolean {
  const nextReviewDate = normalizeDate(input.nextReviewDate, 'nextReviewDate');
  const evaluatedAt = normalizeDate(input.evaluatedAt, 'evaluatedAt');
  const overdueAt = buildOverdueAt(nextReviewDate, input.overdueGracePeriodDays);

  return evaluatedAt >= overdueAt;
}

/**
 * Evaluates whether a review is inside the configured upcoming window.
 */
export function isWithinUpcomingReviewWindow(input: UpcomingReviewWindowInput): boolean {
  if (!Number.isInteger(input.windowDays) || input.windowDays < 0) {
    throw new Error('windowDays must be a non-negative integer');
  }

  const nextReviewDate = normalizeDate(input.nextReviewDate, 'nextReviewDate');
  const evaluatedAt = normalizeDate(input.evaluatedAt, 'evaluatedAt');

  if (evaluatedAt >= nextReviewDate) {
    return false;
  }

  const daysUntilDue = calculateDayDelta(evaluatedAt, nextReviewDate);
  return daysUntilDue <= input.windowDays;
}

/**
 * Centralized typed state evaluation for periodic reviews.
 */
export function evaluatePeriodicReviewState(
  input: DueReviewEvaluationInput & { upcomingWindowDays?: number },
): PeriodicReviewStateResult {
  const nextReviewDate = normalizeDate(input.nextReviewDate, 'nextReviewDate');
  const evaluatedAt = normalizeDate(input.evaluatedAt, 'evaluatedAt');
  const dueAt = nextReviewDate;
  const overdueAt = buildOverdueAt(nextReviewDate, input.overdueGracePeriodDays);
  const isOverdue = evaluatedAt >= overdueAt;
  const isDue = !isOverdue && evaluatedAt >= dueAt;

  const upcomingWindowDays = input.upcomingWindowDays ?? 0;
  const isWithinUpcomingWindow = isWithinUpcomingReviewWindow({
    nextReviewDate,
    evaluatedAt,
    windowDays: upcomingWindowDays,
  });

  const state: PeriodicReviewState = isOverdue
    ? 'overdue'
    : isDue
      ? 'due'
      : 'upcoming';

  return {
    state,
    isDue,
    isOverdue,
    isWithinUpcomingWindow,
    nextReviewDate: nextReviewDate.toISOString(),
    evaluatedAt: evaluatedAt.toISOString(),
    dueAt: dueAt.toISOString(),
    overdueAt: overdueAt.toISOString(),
    daysUntilDue: calculateDayDelta(evaluatedAt, dueAt),
    daysUntilOverdue: calculateDayDelta(evaluatedAt, overdueAt),
  };
}

function buildOverdueAt(nextReviewDate: Date, overdueGracePeriodDays = 0): Date {
  if (!Number.isInteger(overdueGracePeriodDays) || overdueGracePeriodDays < 0) {
    throw new Error('overdueGracePeriodDays must be a non-negative integer');
  }

  return addUtcDays(nextReviewDate, overdueGracePeriodDays);
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

function calculateDayDelta(fromDate: Date, toDate: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil((toDate.getTime() - fromDate.getTime()) / millisecondsPerDay);
}

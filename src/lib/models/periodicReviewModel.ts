/**
 * Server-side periodic review domain model.
 * This model is intentionally scheduler/provider agnostic.
 */

/**
 * Supported periodic review frequencies.
 */
export type ReviewFrequency =
  | 'annual'
  | '24_months'
  | '36_months'
  | 'high_risk_accelerated_review';

/**
 * Lifecycle status for a periodic review record.
 */
export type ReviewStatus =
  | 'scheduled'
  | 'due'
  | 'in_review'
  | 'completed'
  | 'overdue';

/**
 * Canonical periodic review model.
 */
export interface PeriodicReviewModel {
  /**
   * Review record id.
   */
  id: string;

  /**
   * Tenant/organization id.
   */
  organizationId: string;

  /**
   * Subject id being periodically reviewed (customer/account/entity).
   */
  subjectId: string;

  /**
   * Current review cadence.
   */
  frequency: ReviewFrequency;

  /**
   * Current review status.
   */
  status: ReviewStatus;

  /**
   * Next review due date (ISO 8601 timestamp).
   */
  nextReviewDate: string;

  /**
   * Last completed review date (ISO 8601 timestamp).
   */
  lastReviewDate?: string;

  /**
   * True when the record is under accelerated high-risk cadence.
   */
  isHighRiskAcceleratedReview: boolean;

  /**
   * Optional reason for high-risk acceleration.
   */
  highRiskAccelerationReason?: string;

  /**
   * Audit timestamps (ISO 8601).
   */
  createdAt: string;
  updatedAt: string;
}

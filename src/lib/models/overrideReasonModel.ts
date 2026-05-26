/**
 * Server-side override reason domain model.
 */

/**
 * Typed override categories.
 */
export type OverrideReasonCategory =
  | 'review'
  | 'approval'
  | 'compliance'
  | 'finding';

/**
 * Canonical override category values for runtime guards.
 */
export const OVERRIDE_REASON_CATEGORIES: readonly OverrideReasonCategory[] = [
  'review',
  'approval',
  'compliance',
  'finding',
] as const;

/**
 * Resource types an override reason can target.
 */
export type OverrideReasonTarget = 'case' | 'review' | 'approval' | 'finding';

/**
 * Canonical override target values for runtime guards.
 */
export const OVERRIDE_REASON_TARGETS: readonly OverrideReasonTarget[] = [
  'case',
  'review',
  'approval',
  'finding',
] as const;

/**
 * Linkage metadata for connecting an override reason to related entities.
 */
export interface OverrideReasonLinkage {
  caseId?: string;
  reviewId?: string;
  approvalId?: string;
  findingId?: string;
}

/**
 * Audit actor payload for override events.
 */
export interface OverrideReasonActor {
  actor_id: string;
  timestamp: string;
}

/**
 * Canonical override reason model.
 */
export interface OverrideReasonModel {
  id: string;
  tenantId: string;
  category: OverrideReasonCategory;
  target: OverrideReasonTarget;
  reasonText: string;
  actor: OverrideReasonActor;
  linkage: OverrideReasonLinkage;
  metadata?: Record<string, unknown>;
}
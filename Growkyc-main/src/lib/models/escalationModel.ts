/**
 * Server-side escalation domain model.
 */

/**
 * Typed escalation reasons.
 */
export type EscalationReasonType =
  | 'high_risk_pattern'
  | 'sanctions_hit'
  | 'pep_match'
  | 'regulatory_obligation'
  | 'policy_exception'
  | 'manual_escalation'
  | 'other';

/**
 * Canonical escalation reason values for runtime guards.
 */
export const ESCALATION_REASON_TYPES: readonly EscalationReasonType[] = [
  'high_risk_pattern',
  'sanctions_hit',
  'pep_match',
  'regulatory_obligation',
  'policy_exception',
  'manual_escalation',
  'other',
] as const;

/**
 * Typed escalation levels.
 */
export type EscalationLevelType = 'level_1' | 'level_2' | 'elevated' | 'critical';

/**
 * Canonical escalation level values for runtime guards.
 */
export const ESCALATION_LEVEL_TYPES: readonly EscalationLevelType[] = [
  'level_1',
  'level_2',
  'elevated',
  'critical',
] as const;

/**
 * Resource types an escalation can target.
 */
export type EscalationTargetType = 'case' | 'review' | 'approval' | 'finding';

/**
 * Canonical escalation target values for runtime guards.
 */
export const ESCALATION_TARGET_TYPES: readonly EscalationTargetType[] = [
  'case',
  'review',
  'approval',
  'finding',
] as const;

/**
 * Lifecycle states for escalations.
 */
export type EscalationStateType =
  | 'open'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'resolved';

/**
 * Canonical escalation state values for runtime guards.
 */
export const ESCALATION_STATE_TYPES: readonly EscalationStateType[] = [
  'open',
  'in_review',
  'approved',
  'rejected',
  'resolved',
] as const;

/**
 * Linkage metadata for connecting an escalation to related entities.
 */
export interface EscalationLinkage {
  caseId?: string;
  reviewId?: string;
  approvalId?: string;
  findingId?: string;
}

/**
 * Audit actor payload for escalation lifecycle events.
 */
export interface EscalationActor {
  actor_id: string;
  timestamp: string;
}

/**
 * Canonical escalation model.
 */
export interface EscalationModel {
  id: string;
  tenantId: string;
  level: EscalationLevelType;
  target: EscalationTargetType;
  state: EscalationStateType;
  reasonType: EscalationReasonType;
  reasonText?: string;
  actor: EscalationActor;
  linkage: EscalationLinkage;
  metadata?: Record<string, unknown>;
}
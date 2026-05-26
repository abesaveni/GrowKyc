import type { EscalationLevelType } from './escalationModel';
import type { ReviewIssueSeverity } from './reviewIssueSeverityModel';

/**
 * Inputs for centralized escalation requirement determination.
 */
export interface DetermineEscalationRequirementInput {
  isHighRiskCase?: boolean;
  unresolvedSevereFindingsCount?: number;
  highestUnresolvedFindingSeverity?: ReviewIssueSeverity;
  failedProviderRunsCount?: number;
  hasApprovalBlockage?: boolean;
  evaluatedAt?: string | Date;
}

/**
 * Reason codes describing why escalation was selected.
 */
export type EscalationRequirementReasonCode =
  | 'high_risk_case'
  | 'unresolved_severe_findings'
  | 'critical_unresolved_finding'
  | 'provider_runs_failed'
  | 'approval_blocked'
  | 'no_escalation_required';

/**
 * Typed escalation decision result.
 */
export interface DetermineEscalationRequirementResult {
  isEscalationRequired: boolean;
  level: EscalationLevelType;
  reasonCodes: EscalationRequirementReasonCode[];
  evaluatedAt: string;
}

/**
 * Centralized helper to determine whether escalation is required.
 */
export function determineEscalationRequirement(
  input: DetermineEscalationRequirementInput,
): DetermineEscalationRequirementResult {
  const evaluatedAt = normalizeDate(input.evaluatedAt ?? new Date(), 'evaluatedAt').toISOString();
  const reasonCodes: EscalationRequirementReasonCode[] = [];

  const unresolvedSevereFindingsCount = normalizeCount(
    input.unresolvedSevereFindingsCount ?? 0,
    'unresolvedSevereFindingsCount',
  );
  const failedProviderRunsCount = normalizeCount(
    input.failedProviderRunsCount ?? 0,
    'failedProviderRunsCount',
  );

  if (input.isHighRiskCase) {
    reasonCodes.push('high_risk_case');
    return {
      isEscalationRequired: true,
      level: 'critical',
      reasonCodes,
      evaluatedAt,
    };
  }

  if (input.highestUnresolvedFindingSeverity === 'critical') {
    reasonCodes.push('critical_unresolved_finding');
    return {
      isEscalationRequired: true,
      level: 'critical',
      reasonCodes,
      evaluatedAt,
    };
  }

  if (
    unresolvedSevereFindingsCount > 0 ||
    input.highestUnresolvedFindingSeverity === 'high'
  ) {
    reasonCodes.push('unresolved_severe_findings');
    return {
      isEscalationRequired: true,
      level: 'elevated',
      reasonCodes,
      evaluatedAt,
    };
  }

  if (failedProviderRunsCount > 0) {
    reasonCodes.push('provider_runs_failed');
    return {
      isEscalationRequired: true,
      level: failedProviderRunsCount >= 3 ? 'critical' : 'level_2',
      reasonCodes,
      evaluatedAt,
    };
  }

  if (input.hasApprovalBlockage) {
    reasonCodes.push('approval_blocked');
    return {
      isEscalationRequired: true,
      level: 'elevated',
      reasonCodes,
      evaluatedAt,
    };
  }

  reasonCodes.push('no_escalation_required');
  return {
    isEscalationRequired: false,
    level: 'level_1',
    reasonCodes,
    evaluatedAt,
  };
}

function normalizeCount(value: number, fieldName: string): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${fieldName} must be a non-negative integer`);
  }

  return value;
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}
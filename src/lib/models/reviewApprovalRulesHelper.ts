import type {
  MandatoryReviewApproverRole,
  ReviewApprovalLevel,
  ReviewApprovalRequirementModel,
} from './reviewApprovalChainModel';
import type { ReviewIssueSeverity } from './reviewIssueSeverityModel';
import type { ReviewWorkflowState } from './reviewWorkflowStateModel';

/**
 * Optional issue severity summary input for approval requirement evaluation.
 */
export interface ReviewApprovalIssueSeveritySummary {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

/**
 * Inputs for centralized approval requirement determination.
 */
export interface DetermineReviewApprovalRequirementInput {
  workflowState?: ReviewWorkflowState;
  isHighRiskCase?: boolean;
  isEscalatedCase?: boolean;
  highestIssueSeverity?: ReviewIssueSeverity;
  issueSeveritySummary?: ReviewApprovalIssueSeveritySummary;
  evaluatedAt?: string | Date;
}

/**
 * Reason codes describing why an approval requirement was selected.
 */
export type ReviewApprovalRequirementReasonCode =
  | 'standard_path'
  | 'issue_severity_medium'
  | 'issue_severity_high'
  | 'issue_severity_critical'
  | 'escalated_case'
  | 'high_risk_case';

/**
 * Typed result payload for approval requirement determination.
 */
export interface DetermineReviewApprovalRequirementResult {
  requirement: ReviewApprovalRequirementModel;
  reasonCodes: ReviewApprovalRequirementReasonCode[];
  evaluatedAt: string;
}

/**
 * Centralized helper to determine required review approval level and requirement.
 */
export function determineReviewApprovalRequirement(
  input: DetermineReviewApprovalRequirementInput,
): DetermineReviewApprovalRequirementResult {
  const evaluatedAt = normalizeDate(input.evaluatedAt ?? new Date(), 'evaluatedAt').toISOString();
  const reasonCodes: ReviewApprovalRequirementReasonCode[] = [];

  const highestSeverity =
    input.highestIssueSeverity ?? inferHighestSeverity(input.issueSeveritySummary);

  if (input.isHighRiskCase) {
    reasonCodes.push('high_risk_case');
    return {
      requirement: buildRequirement('high_risk', 'compliance_manager', 2),
      reasonCodes,
      evaluatedAt,
    };
  }

  if (input.isEscalatedCase || input.workflowState === 'escalated') {
    reasonCodes.push('escalated_case');
    return {
      requirement: buildRequirement('elevated', 'compliance_manager', 2),
      reasonCodes,
      evaluatedAt,
    };
  }

  if (highestSeverity === 'critical') {
    reasonCodes.push('issue_severity_critical');
    return {
      requirement: buildRequirement('high_risk', 'compliance_manager', 2),
      reasonCodes,
      evaluatedAt,
    };
  }

  if (highestSeverity === 'high') {
    reasonCodes.push('issue_severity_high');
    return {
      requirement: buildRequirement('elevated', 'approver', 2),
      reasonCodes,
      evaluatedAt,
    };
  }

  if (highestSeverity === 'medium') {
    reasonCodes.push('issue_severity_medium');
    return {
      requirement: buildRequirement('level_2', 'approver', 1),
      reasonCodes,
      evaluatedAt,
    };
  }

  reasonCodes.push('standard_path');
  return {
    requirement: buildRequirement('level_1', 'approver', 1),
    reasonCodes,
    evaluatedAt,
  };
}

function buildRequirement(
  level: ReviewApprovalLevel,
  mandatoryApproverRole: MandatoryReviewApproverRole,
  minimumApprovalsRequired: number,
): ReviewApprovalRequirementModel {
  return {
    level,
    path: level === 'high_risk' ? 'high_risk' : level === 'elevated' ? 'elevated' : 'standard',
    mandatoryApproverRole,
    minimumApprovalsRequired,
    requiresElevatedApproval: level === 'elevated' || level === 'high_risk',
    requiresHighRiskApprovalPath: level === 'high_risk',
  };
}

function inferHighestSeverity(
  summary?: ReviewApprovalIssueSeveritySummary,
): ReviewIssueSeverity | undefined {
  if (!summary) {
    return undefined;
  }

  if (summary.critical > 0) {
    return 'critical';
  }

  if (summary.high > 0) {
    return 'high';
  }

  if (summary.medium > 0) {
    return 'medium';
  }

  if (summary.low > 0) {
    return 'low';
  }

  return undefined;
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}

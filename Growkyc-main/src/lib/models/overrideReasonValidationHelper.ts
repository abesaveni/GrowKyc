import {
  OVERRIDE_REASON_CATEGORIES,
  OVERRIDE_REASON_TARGETS,
  type OverrideReasonCategory,
  type OverrideReasonTarget,
} from './overrideReasonModel';

/**
 * Typed reason codes for override actions.
 */
export type OverrideReasonCode =
  | 'policy_exception'
  | 'manual_risk_acceptance'
  | 'false_positive'
  | 'documentary_evidence'
  | 'regulatory_clearance'
  | 'other';

/**
 * Canonical override reason code values for runtime guards.
 */
export const OVERRIDE_REASON_CODES: readonly OverrideReasonCode[] = [
  'policy_exception',
  'manual_risk_acceptance',
  'false_positive',
  'documentary_evidence',
  'regulatory_clearance',
  'other',
] as const;

/**
 * Typed validation failure codes for override reason validation.
 */
export type OverrideValidationErrorCode =
  | 'invalid_category'
  | 'invalid_target'
  | 'reason_required'
  | 'reason_below_minimum'
  | 'reason_code_required'
  | 'invalid_reason_code'
  | 'reason_code_not_allowed_for_category';

/**
 * Input payload for centralized override reason validation.
 */
export interface ValidateOverrideReasonInput {
  category: string;
  target: string;
  reasonText?: string;
  reasonCode?: string;
  minimumReasonLength?: number;
  requireReasonCode?: boolean;
}

/**
 * Typed normalized validation values.
 */
export interface OverrideValidationNormalizedValues {
  category?: OverrideReasonCategory;
  target?: OverrideReasonTarget;
  reasonText: string;
  reasonCode?: OverrideReasonCode;
}

/**
 * Typed validation result payload.
 */
export interface OverrideValidationResult {
  isValid: boolean;
  errors: OverrideValidationErrorCode[];
  normalized: OverrideValidationNormalizedValues;
}

/**
 * Centralized helper to validate required override reason payloads.
 */
export function validateOverrideReason(
  input: ValidateOverrideReasonInput,
): OverrideValidationResult {
  const minimumReasonLength = Math.max(1, input.minimumReasonLength ?? 12);
  const normalizedReasonText = normalizeReasonText(input.reasonText);
  const errors: OverrideValidationErrorCode[] = [];

  const normalizedCategory = normalizeCategory(input.category);
  if (!normalizedCategory) {
    errors.push('invalid_category');
  }

  const normalizedTarget = normalizeTarget(input.target);
  if (!normalizedTarget) {
    errors.push('invalid_target');
  }

  if (!normalizedReasonText) {
    errors.push('reason_required');
  } else if (normalizedReasonText.length < minimumReasonLength) {
    errors.push('reason_below_minimum');
  }

  const normalizedReasonCode = normalizeReasonCode(input.reasonCode);

  if (input.requireReasonCode && !normalizedReasonCode) {
    errors.push('reason_code_required');
  }

  if (input.reasonCode && !normalizedReasonCode) {
    errors.push('invalid_reason_code');
  }

  if (normalizedCategory && normalizedReasonCode) {
    const allowedCodes = OVERRIDE_REASON_CODES_BY_CATEGORY[normalizedCategory];

    if (!allowedCodes.includes(normalizedReasonCode)) {
      errors.push('reason_code_not_allowed_for_category');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    normalized: {
      category: normalizedCategory,
      target: normalizedTarget,
      reasonText: normalizedReasonText,
      reasonCode: normalizedReasonCode,
    },
  };
}

function normalizeCategory(value: string): OverrideReasonCategory | undefined {
  if (OVERRIDE_REASON_CATEGORIES.includes(value as OverrideReasonCategory)) {
    return value as OverrideReasonCategory;
  }

  return undefined;
}

function normalizeTarget(value: string): OverrideReasonTarget | undefined {
  if (OVERRIDE_REASON_TARGETS.includes(value as OverrideReasonTarget)) {
    return value as OverrideReasonTarget;
  }

  return undefined;
}

function normalizeReasonText(reasonText?: string): string {
  return reasonText?.trim() ?? '';
}

function normalizeReasonCode(value?: string): OverrideReasonCode | undefined {
  if (!value) {
    return undefined;
  }

  if (OVERRIDE_REASON_CODES.includes(value as OverrideReasonCode)) {
    return value as OverrideReasonCode;
  }

  return undefined;
}

const OVERRIDE_REASON_CODES_BY_CATEGORY: Readonly<
  Record<OverrideReasonCategory, readonly OverrideReasonCode[]>
> = {
  review: ['false_positive', 'manual_risk_acceptance', 'other'],
  approval: ['policy_exception', 'documentary_evidence', 'other'],
  compliance: ['regulatory_clearance', 'policy_exception', 'other'],
  finding: ['false_positive', 'documentary_evidence', 'other'],
} as const;
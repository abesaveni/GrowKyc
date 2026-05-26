import {
  evaluateCaseExpiryImpact,
  type CaseExpiryImpactResult,
  type EvaluateCaseExpiryImpactInput,
} from './caseExpiryImpactHelper';

export function useCaseExpiry(
  input: EvaluateCaseExpiryImpactInput,
): CaseExpiryImpactResult {
  return evaluateCaseExpiryImpact(input);
}

export type RescreeningHookPoint = 'sanctions' | 'pep' | 'adverse_media';

export type RescreeningReasonCode =
  | 'force_rescreening'
  | 'periodic_review_due'
  | 'risk_level_increased'
  | 'profile_changed'
  | 'manual_request'
  | 'sanctions_new_match'
  | 'sanctions_data_updated'
  | 'pep_new_match'
  | 'pep_data_updated'
  | 'adverse_media_new_match'
  | 'adverse_media_data_updated'
  | 'no_trigger_signals';

export interface RescreeningHookSignal {
  enabled?: boolean;
  hasNewMatch?: boolean;
  dataUpdated?: boolean;
  manualRequest?: boolean;
}

export interface DetermineRescreeningTriggerInput {
  evaluatedAt: string | Date;
  lastScreenedAt?: string | Date;
  forceRescreening?: boolean;
  periodicReviewDue?: boolean;
  riskLevelIncreased?: boolean;
  profileChanged?: boolean;
  hookSignals?: Partial<Record<RescreeningHookPoint, RescreeningHookSignal>>;
}

export interface RescreeningHookDecision {
  hook: RescreeningHookPoint;
  shouldTrigger: boolean;
  reasonCodes: RescreeningReasonCode[];
}

export interface RescreeningTriggerResult {
  shouldTrigger: boolean;
  reasonCodes: RescreeningReasonCode[];
  evaluatedAt: string;
  lastScreenedAt?: string;
  hookDecisions: RescreeningHookDecision[];
}

/**
 * Centralized helper to determine whether periodic-review rescreening should trigger.
 * This function only evaluates signals and returns typed decisions.
 */
export function determinePeriodicReviewRescreeningTrigger(
  input: DetermineRescreeningTriggerInput,
): RescreeningTriggerResult {
  const evaluatedAt = normalizeDate(input.evaluatedAt, 'evaluatedAt');
  const lastScreenedAt = input.lastScreenedAt
    ? normalizeDate(input.lastScreenedAt, 'lastScreenedAt')
    : undefined;

  const reasonCodes = new Set<RescreeningReasonCode>();

  if (input.forceRescreening) {
    reasonCodes.add('force_rescreening');
  }

  if (input.periodicReviewDue) {
    reasonCodes.add('periodic_review_due');
  }

  if (input.riskLevelIncreased) {
    reasonCodes.add('risk_level_increased');
  }

  if (input.profileChanged) {
    reasonCodes.add('profile_changed');
  }

  const hookDecisions: RescreeningHookDecision[] = [
    evaluateHook('sanctions', input.hookSignals?.sanctions),
    evaluateHook('pep', input.hookSignals?.pep),
    evaluateHook('adverse_media', input.hookSignals?.adverse_media),
  ];

  for (const hookDecision of hookDecisions) {
    for (const reason of hookDecision.reasonCodes) {
      reasonCodes.add(reason);
    }
  }

  const shouldTrigger = reasonCodes.size > 0;

  if (!shouldTrigger) {
    reasonCodes.add('no_trigger_signals');
  }

  return {
    shouldTrigger,
    reasonCodes: Array.from(reasonCodes),
    evaluatedAt: evaluatedAt.toISOString(),
    lastScreenedAt: lastScreenedAt?.toISOString(),
    hookDecisions,
  };
}

function evaluateHook(
  hook: RescreeningHookPoint,
  signal: RescreeningHookSignal | undefined,
): RescreeningHookDecision {
  if (!signal?.enabled) {
    return {
      hook,
      shouldTrigger: false,
      reasonCodes: [],
    };
  }

  const reasonCodes = new Set<RescreeningReasonCode>();

  if (signal.manualRequest) {
    reasonCodes.add('manual_request');
  }

  if (signal.hasNewMatch) {
    reasonCodes.add(getNewMatchReasonCode(hook));
  }

  if (signal.dataUpdated) {
    reasonCodes.add(getDataUpdatedReasonCode(hook));
  }

  return {
    hook,
    shouldTrigger: reasonCodes.size > 0,
    reasonCodes: Array.from(reasonCodes),
  };
}

function getNewMatchReasonCode(hook: RescreeningHookPoint): RescreeningReasonCode {
  switch (hook) {
    case 'sanctions':
      return 'sanctions_new_match';
    case 'pep':
      return 'pep_new_match';
    case 'adverse_media':
      return 'adverse_media_new_match';
    default:
      return assertNever(hook);
  }
}

function getDataUpdatedReasonCode(hook: RescreeningHookPoint): RescreeningReasonCode {
  switch (hook) {
    case 'sanctions':
      return 'sanctions_data_updated';
    case 'pep':
      return 'pep_data_updated';
    case 'adverse_media':
      return 'adverse_media_data_updated';
    default:
      return assertNever(hook);
  }
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled hook point: ${String(value)}`);
}

export type RetentionEntityType = 'evidence_pack' | 'document' | 'audit_event' | 'provider_log';

export type RetentionClassification =
  | 'compliance_record'
  | 'audit_record'
  | 'provider_record'
  | 'document_record';

export type RetentionStatus = 'retained' | 'archive_eligible' | 'delete_eligible';

export interface RetentionMetadata {
  retentionPolicyId: string;
  retentionClassification: RetentionClassification;
  retentionUntil: string;
  archiveEligible: boolean;
  deleteEligible: boolean;
}

export interface LegalHoldMetadata {
  legalHold: boolean;
  legalHoldReason?: string;
  legalHoldSetBy?: string;
  legalHoldSetAt?: string;
}

export interface RetentionStatusEvaluation {
  status: RetentionStatus;
  archiveEligible: boolean;
  deleteEligible: boolean;
}

export interface LegalHoldDispositionGuard {
  archiveEligible: boolean;
  deleteEligible: boolean;
  blockedByLegalHold: boolean;
}

const DEFAULT_RETENTION_POLICY_ID = 'compliance_record_7y_v1';
const DEFAULT_RETENTION_YEARS = 7;
const DEFAULT_DELETE_GRACE_DAYS = 90;

const CLASSIFICATION_BY_ENTITY: Record<RetentionEntityType, RetentionClassification> = {
  evidence_pack: 'compliance_record',
  document: 'document_record',
  audit_event: 'audit_record',
  provider_log: 'provider_record',
};

function addYearsIso(baseIso: string, years: number): string {
  const date = new Date(baseIso);
  date.setUTCFullYear(date.getUTCFullYear() + years);
  return date.toISOString();
}

function addDaysIso(baseIso: string, days: number): string {
  const date = new Date(baseIso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

export function buildDefaultRetentionMetadata(params: {
  entityType: RetentionEntityType;
  occurredAt?: string;
  retentionPolicyId?: string;
  retentionUntil?: string;
  retentionClassification?: RetentionClassification;
}): RetentionMetadata {
  const occurredAt = params.occurredAt || new Date().toISOString();
  const retentionUntil = params.retentionUntil || addYearsIso(occurredAt, DEFAULT_RETENTION_YEARS);

  return {
    retentionPolicyId: params.retentionPolicyId || DEFAULT_RETENTION_POLICY_ID,
    retentionClassification:
      params.retentionClassification || CLASSIFICATION_BY_ENTITY[params.entityType],
    retentionUntil,
    archiveEligible: false,
    deleteEligible: false,
  };
}

export function evaluateRetentionStatus(params: {
  retentionUntil?: string;
  now?: string;
  legalHold?: boolean;
  deleteGraceDays?: number;
}): RetentionStatusEvaluation {
  if (!params.retentionUntil || params.legalHold) {
    return {
      status: 'retained',
      archiveEligible: false,
      deleteEligible: false,
    };
  }

  const nowIso = params.now || new Date().toISOString();
  const nowDate = new Date(nowIso);
  const retentionUntilDate = new Date(params.retentionUntil);

  if (nowDate < retentionUntilDate) {
    return {
      status: 'retained',
      archiveEligible: false,
      deleteEligible: false,
    };
  }

  const graceDays = params.deleteGraceDays ?? DEFAULT_DELETE_GRACE_DAYS;
  const deleteEligibleAt = new Date(addDaysIso(params.retentionUntil, graceDays));
  const deleteEligible = nowDate >= deleteEligibleAt;

  return {
    status: deleteEligible ? 'delete_eligible' : 'archive_eligible',
    archiveEligible: true,
    deleteEligible,
  };
}

export function blockDispositionWhenLegalHoldActive(params: {
  legalHold?: boolean;
  archiveEligible?: boolean;
  deleteEligible?: boolean;
}): LegalHoldDispositionGuard {
  if (!params.legalHold) {
    return {
      archiveEligible: Boolean(params.archiveEligible),
      deleteEligible: Boolean(params.deleteEligible),
      blockedByLegalHold: false,
    };
  }

  return {
    archiveEligible: false,
    deleteEligible: false,
    blockedByLegalHold: true,
  };
}

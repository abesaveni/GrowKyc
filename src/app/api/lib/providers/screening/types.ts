export type ScreeningCheckType =
  | 'sanctions_screening'
  | 'pep_screening'
  | 'adverse_media'
  | 'id_verification'
  | 'registry_check';

export type ScreeningSubjectType = 'individual' | 'entity';

export type ProviderStatus =
  | 'completed'
  | 'partial_match'
  | 'no_match'
  | 'failed'
  | 'unavailable'
  | 'timeout';

export type ProviderErrorCode =
  | 'provider_unavailable'
  | 'provider_timeout'
  | 'provider_rate_limited'
  | 'provider_auth_error'
  | 'provider_bad_request'
  | 'provider_internal_error'
  | 'provider_not_configured'
  | 'normalization_error';

export interface ScreeningSubject {
  type: ScreeningSubjectType;
  fullName?: string;
  entityName?: string;
  dateOfBirth?: string;
  countryCode?: string;
  registrationNumber?: string;
  aliases?: string[];
}

export interface ScreeningRequestBase {
  organizationId: string;
  caseId?: string;
  runId?: string;
  correlationId: string;
  requestedByUserId?: string;
  requestedAt: string;
  subject: ScreeningSubject;
  metadata?: Record<string, unknown>;
}

export interface SanctionsScreeningRequest extends ScreeningRequestBase {
  checkType: 'sanctions_screening';
  watchlists?: string[];
}

export interface PepScreeningRequest extends ScreeningRequestBase {
  checkType: 'pep_screening';
  jurisdictions?: string[];
}

export interface AdverseMediaRequest extends ScreeningRequestBase {
  checkType: 'adverse_media';
  languages?: string[];
  lookbackDays?: number;
}

export interface IdVerificationRequest extends ScreeningRequestBase {
  checkType: 'id_verification';
  documentType?: 'passport' | 'drivers_license' | 'national_id' | 'other';
  documentNumber?: string;
}

export interface RegistryCheckRequest extends ScreeningRequestBase {
  checkType: 'registry_check';
  registryType?: 'abn' | 'asic' | 'international';
}

export type ScreeningRequest =
  | SanctionsScreeningRequest
  | PepScreeningRequest
  | AdverseMediaRequest
  | IdVerificationRequest
  | RegistryCheckRequest;

export interface ProviderMetadata {
  providerName: string;
  providerVersion?: string;
  providerRequestId?: string;
  providerReferenceId?: string;
  latencyMs?: number;
  requestTimestamp: string;
  responseTimestamp: string;
  requestRegion?: string;
  sourceEnvironment?: string;
  additional?: Record<string, unknown>;
}

export interface ProviderMatchRecord {
  matchId: string;
  category: ScreeningCheckType;
  confidence: number;
  name: string;
  reason?: string;
  source?: string;
  occurredAt?: string;
  details?: Record<string, unknown>;
}

export interface ProviderScreeningRawResult {
  checkType: ScreeningCheckType;
  status: ProviderStatus;
  summary: string;
  matches: ProviderMatchRecord[];
  riskScore?: number;
  metadata: ProviderMetadata;
  rawPayload?: Record<string, unknown>;
}

export interface NormalizedScreeningResult {
  checkType: ScreeningCheckType;
  status: ProviderStatus;
  reviewerSummary: string;
  hasMatches: boolean;
  matchCount: number;
  highestConfidence: number;
  riskScore?: number;
  matches: ProviderMatchRecord[];
  metadata: ProviderMetadata;
}

export interface ScreeningExecutionBundle {
  request: ScreeningRequest;
  result: NormalizedScreeningResult;
}

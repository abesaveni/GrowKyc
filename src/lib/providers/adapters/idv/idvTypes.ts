export type IDVDocumentType =
  | 'passport'
  | 'national_id'
  | 'drivers_license'
  | 'visa'
  | 'residency_permit';

export interface IDVScreeningRequestPayload {
  fullName: string;
  dateOfBirth: string;
  documentType: IDVDocumentType;
  documentNumber: string;
  countryCode: string;
  expiryDate?: string;
}

export interface IDVProviderRequest {
  referenceId: string;
  name: string;
  dateOfBirth: string;
  documentType: IDVDocumentType;
  documentNumber: string;
  countryCode: string;
  expiryDate?: string;
  traceId?: string;
}

export type IDVScreeningStatus = 'verified' | 'failed' | 'manual_review' | 'error';

export interface IDVProviderRawMatch {
  matchField: string;
  providedValue: string;
  verifiedValue: string;
  confidence: number;
}

export interface IDVProviderRawResponse {
  referenceId: string;
  screeningStatus: IDVScreeningStatus;
  documentValid: boolean;
  expiryValidated: boolean;
  matchedFields: IDVProviderRawMatch[];
  overallConfidence: number;
  failureReason?: string;
  providerMetadata?: Record<string, unknown>;
}

export interface IDVNormalizedMatch {
  matchField: string;
  providedValue: string;
  verifiedValue: string;
  confidence: number;
}

export interface IDVNormalizedData {
  referenceId: string;
  screeningStatus: IDVScreeningStatus;
  isVerified: boolean;
  documentValid: boolean;
  expiryValidated: boolean;
  confidence: number;
  matchedFieldCount: number;
  matches: IDVNormalizedMatch[];
  failureReason?: string;
}

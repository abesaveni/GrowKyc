export type SanctionsEntityType = 'individual' | 'organization';

export interface SanctionsScreeningRequestPayload {
  entityType: SanctionsEntityType;
  fullName: string;
  aliases?: string[];
  dateOfBirth?: string;
  countryCode?: string;
  registrationNumber?: string;
}

export interface SanctionsProviderRequest {
  referenceId: string;
  name: string;
  entityType: SanctionsEntityType;
  aliases: string[];
  dateOfBirth?: string;
  countryCode?: string;
  registrationNumber?: string;
  traceId?: string;
}

export type SanctionsProviderScreeningStatus = 'clear' | 'possible_match' | 'match' | 'error';

export interface SanctionsProviderRawMatch {
  listName: string;
  matchedName: string;
  score: number;
  program?: string;
  countryCode?: string;
}

export interface SanctionsProviderRawResponse {
  referenceId: string;
  screeningStatus: SanctionsProviderScreeningStatus;
  matches: SanctionsProviderRawMatch[];
  providerMetadata?: Record<string, unknown>;
}

export interface SanctionsNormalizedMatch {
  listName: string;
  matchedName: string;
  score: number;
  program?: string;
  countryCode?: string;
}

export interface SanctionsNormalizedData {
  referenceId: string;
  screeningStatus: SanctionsProviderScreeningStatus;
  requiresReview: boolean;
  matchCount: number;
  matches: SanctionsNormalizedMatch[];
}

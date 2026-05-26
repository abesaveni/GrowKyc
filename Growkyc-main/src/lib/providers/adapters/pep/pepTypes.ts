export interface PEPScreeningRequestPayload {
  fullName: string;
  aliases?: string[];
  dateOfBirth?: string;
  nationality?: string;
  countryOfResidence?: string;
}

export interface PEPProviderRequest {
  referenceId: string;
  name: string;
  aliases: string[];
  dateOfBirth?: string;
  nationality?: string;
  countryOfResidence?: string;
  traceId?: string;
}

export type PEPScreeningStatus = 'clear' | 'possible_pep' | 'confirmed_pep' | 'error';

export interface PEPProviderRawPEPMatch {
  pepListName: string;
  pepName: string;
  pepScore: number;
  position?: string;
  countryCode?: string;
  sourceUrl?: string;
}

export interface PEPProviderRawResponse {
  referenceId: string;
  screeningStatus: PEPScreeningStatus;
  pepMatches: PEPProviderRawPEPMatch[];
  riskLevel?: 'low' | 'medium' | 'high';
  providerMetadata?: Record<string, unknown>;
}

export interface PEPNormalizedMatch {
  listName: string;
  pepName: string;
  score: number;
  position?: string;
  countryCode?: string;
}

export interface PEPNormalizedData {
  referenceId: string;
  screeningStatus: PEPScreeningStatus;
  isPEP: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'unknown';
  matchCount: number;
  matches: PEPNormalizedMatch[];
}

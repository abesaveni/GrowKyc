export type RegistryEntityType = 'company' | 'business' | 'partnership' | 'sole_trader';

export interface RegistryScreeningRequestPayload {
  entityType: RegistryEntityType;
  entityName: string;
  registrationNumber?: string;
  countryCode: string;
  registryType?: string;
}

export interface RegistryProviderRequest {
  referenceId: string;
  entityType: RegistryEntityType;
  entityName: string;
  registrationNumber?: string;
  countryCode: string;
  registryType?: string;
  traceId?: string;
}

export type RegistryScreeningStatus = 'found' | 'not_found' | 'inactive' | 'error';

export interface RegistryProviderRawMatch {
  registryName: string;
  matchedName: string;
  registrationNumber: string;
  status: string;
  registrationDate?: string;
  jurisdiction?: string;
}

export interface RegistryProviderRawResponse {
  referenceId: string;
  screeningStatus: RegistryScreeningStatus;
  matchFound: boolean;
  matches: RegistryProviderRawMatch[];
  statusIndicator?: string;
  providerMetadata?: Record<string, unknown>;
}

export interface RegistryNormalizedMatch {
  registryName: string;
  matchedName: string;
  registrationNumber: string;
  status: string;
  registrationDate?: string;
  jurisdiction?: string;
}

export interface RegistryNormalizedData {
  referenceId: string;
  screeningStatus: RegistryScreeningStatus;
  matchFound: boolean;
  isActive: boolean;
  matchCount: number;
  matches: RegistryNormalizedMatch[];
}

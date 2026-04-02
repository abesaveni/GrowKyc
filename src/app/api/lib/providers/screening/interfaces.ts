import {
  AdverseMediaRequest,
  IdVerificationRequest,
  PepScreeningRequest,
  ProviderScreeningRawResult,
  RegistryCheckRequest,
  SanctionsScreeningRequest,
  ScreeningCheckType,
  ScreeningRequest,
} from './types';

export interface ScreeningProviderAdapter {
  readonly providerName: string;
  readonly supportedChecks: ScreeningCheckType[];

  screenSanctions(request: SanctionsScreeningRequest): Promise<ProviderScreeningRawResult>;
  screenPep(request: PepScreeningRequest): Promise<ProviderScreeningRawResult>;
  screenAdverseMedia(request: AdverseMediaRequest): Promise<ProviderScreeningRawResult>;
  verifyIdentity(request: IdVerificationRequest): Promise<ProviderScreeningRawResult>;
  checkRegistry(request: RegistryCheckRequest): Promise<ProviderScreeningRawResult>;
}

export function getAdapterMethodName(checkType: ScreeningRequest['checkType']): keyof ScreeningProviderAdapter {
  switch (checkType) {
    case 'sanctions_screening':
      return 'screenSanctions';
    case 'pep_screening':
      return 'screenPep';
    case 'adverse_media':
      return 'screenAdverseMedia';
    case 'id_verification':
      return 'verifyIdentity';
    case 'registry_check':
      return 'checkRegistry';
    default:
      return 'screenSanctions';
  }
}

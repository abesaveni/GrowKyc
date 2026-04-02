import { ScreeningProviderAdapter } from '../interfaces';
import {
  AdverseMediaRequest,
  IdVerificationRequest,
  PepScreeningRequest,
  ProviderScreeningRawResult,
  RegistryCheckRequest,
  SanctionsScreeningRequest,
  ScreeningCheckType,
} from '../types';
import { ProviderAdapterError } from '../errors';

function notConfiguredError(providerName: string, checkType: ScreeningCheckType): never {
  throw new ProviderAdapterError(
    `${providerName} is not configured for ${checkType}`,
    'provider_not_configured',
    providerName,
    false,
    503,
    { checkType }
  );
}

export class PlaceholderScreeningAdapter implements ScreeningProviderAdapter {
  readonly providerName: string;
  readonly supportedChecks: ScreeningCheckType[];

  constructor(providerName: string, supportedChecks: ScreeningCheckType[]) {
    this.providerName = providerName;
    this.supportedChecks = supportedChecks;
  }

  async screenSanctions(_request: SanctionsScreeningRequest): Promise<ProviderScreeningRawResult> {
    return notConfiguredError(this.providerName, 'sanctions_screening');
  }

  async screenPep(_request: PepScreeningRequest): Promise<ProviderScreeningRawResult> {
    return notConfiguredError(this.providerName, 'pep_screening');
  }

  async screenAdverseMedia(_request: AdverseMediaRequest): Promise<ProviderScreeningRawResult> {
    return notConfiguredError(this.providerName, 'adverse_media');
  }

  async verifyIdentity(_request: IdVerificationRequest): Promise<ProviderScreeningRawResult> {
    return notConfiguredError(this.providerName, 'id_verification');
  }

  async checkRegistry(_request: RegistryCheckRequest): Promise<ProviderScreeningRawResult> {
    return notConfiguredError(this.providerName, 'registry_check');
  }
}

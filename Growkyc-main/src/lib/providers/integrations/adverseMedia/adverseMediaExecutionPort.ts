import type { ProviderStatus } from '../../models/providerStatus';
import type { AdverseMediaProviderRawResponse, AdverseMediaProviderRequest } from '../../adapters/adverseMedia/adverseMediaTypes';

export interface IAdverseMediaExecutionPort {
  getStatus(): Promise<ProviderStatus>;
  executeScreening(request: AdverseMediaProviderRequest): Promise<AdverseMediaProviderRawResponse>;
}

export class NotConfiguredAdverseMediaExecutionPort implements IAdverseMediaExecutionPort {
  async getStatus(): Promise<ProviderStatus> {
    return 'unavailable';
  }

  async executeScreening(_request: AdverseMediaProviderRequest): Promise<AdverseMediaProviderRawResponse> {
    throw new Error('Adverse media execution port is not configured.');
  }
}

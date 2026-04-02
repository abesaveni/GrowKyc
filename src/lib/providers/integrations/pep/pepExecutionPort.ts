import type { ProviderStatus } from '../../../models/providerStatus';
import type { PEPProviderRawResponse, PEPProviderRequest } from '../adapters/pep/pepTypes';

export interface IPEPExecutionPort {
  getStatus(): Promise<ProviderStatus>;
  executeScreening(request: PEPProviderRequest): Promise<PEPProviderRawResponse>;
}

export class NotConfiguredPEPExecutionPort implements IPEPExecutionPort {
  async getStatus(): Promise<ProviderStatus> {
    return 'unavailable';
  }

  async executeScreening(_request: PEPProviderRequest): Promise<PEPProviderRawResponse> {
    throw new Error('PEP execution port is not configured.');
  }
}

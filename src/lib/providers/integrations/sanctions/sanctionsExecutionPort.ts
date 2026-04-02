import type { ProviderStatus } from '../../../models/providerStatus';
import type { SanctionsProviderRawResponse, SanctionsProviderRequest } from '../../../adapters/sanctions/sanctionsTypes';

export interface ISanctionsExecutionPort {
  getStatus(): Promise<ProviderStatus>;
  executeScreening(request: SanctionsProviderRequest): Promise<SanctionsProviderRawResponse>;
}

export class NotConfiguredSanctionsExecutionPort implements ISanctionsExecutionPort {
  async getStatus(): Promise<ProviderStatus> {
    return 'unavailable';
  }

  async executeScreening(_request: SanctionsProviderRequest): Promise<SanctionsProviderRawResponse> {
    throw new Error('Sanctions execution port is not configured.');
  }
}

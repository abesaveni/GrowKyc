import type { ProviderStatus } from '../../models/providerStatus';
import type { IDVProviderRawResponse, IDVProviderRequest } from '../../adapters/idv/idvTypes';

export interface IIDVExecutionPort {
  getStatus(): Promise<ProviderStatus>;
  executeScreening(request: IDVProviderRequest): Promise<IDVProviderRawResponse>;
}

export class NotConfiguredIDVExecutionPort implements IIDVExecutionPort {
  async getStatus(): Promise<ProviderStatus> {
    return 'unavailable';
  }

  async executeScreening(_request: IDVProviderRequest): Promise<IDVProviderRawResponse> {
    throw new Error('IDV execution port is not configured.');
  }
}

import type { ProviderStatus } from '../../../models/providerStatus';
import type { RegistryProviderRawResponse, RegistryProviderRequest } from '../adapters/registry/registryTypes';

export interface IRegistryExecutionPort {
  getStatus(): Promise<ProviderStatus>;
  executeScreening(request: RegistryProviderRequest): Promise<RegistryProviderRawResponse>;
}

export class NotConfiguredRegistryExecutionPort implements IRegistryExecutionPort {
  async getStatus(): Promise<ProviderStatus> {
    return 'unavailable';
  }

  async executeScreening(_request: RegistryProviderRequest): Promise<RegistryProviderRawResponse> {
    throw new Error('Registry execution port is not configured.');
  }
}

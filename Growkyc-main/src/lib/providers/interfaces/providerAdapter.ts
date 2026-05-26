import type { ProviderRequest } from '../contracts/providerRequest';
import type { NormalizedProviderResult } from '../models/normalizedProviderResult';
import type { ProviderMetadata } from '../models/providerMetadata';
import type { ProviderStatus } from '../models/providerStatus';

export interface IProviderAdapter<TRequestPayload = unknown, TData = unknown, TRaw = unknown> {
  readonly metadata: ProviderMetadata;
  getStatus(): Promise<ProviderStatus>;
  execute(request: ProviderRequest<TRequestPayload>): Promise<NormalizedProviderResult<TData, TRaw>>;
}

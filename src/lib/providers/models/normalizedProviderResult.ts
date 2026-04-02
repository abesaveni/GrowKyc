import type { ProviderResponse } from '../contracts/providerResponse';
import type { ProviderError } from './providerError';
import type { ProviderMetadata } from './providerMetadata';
import type { ProviderStatus } from './providerStatus';

export interface NormalizedProviderResult<TData = unknown, TRaw = unknown> {
  ok: boolean;
  provider: ProviderMetadata;
  status: ProviderStatus;
  response?: ProviderResponse<TRaw>;
  data?: TData;
  error?: ProviderError;
}

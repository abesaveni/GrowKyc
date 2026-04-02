import type { ProviderStatus } from './providerStatus';

export type ProviderErrorCode =
  | 'VALIDATION_FAILED'
  | 'AUTH_FAILED'
  | 'REQUEST_TIMEOUT'
  | 'RATE_LIMITED'
  | 'PROVIDER_UNAVAILABLE'
  | 'UNKNOWN_ERROR';

export interface ProviderError {
  code: ProviderErrorCode;
  message: string;
  providerId: string;
  retryable: boolean;
  status: ProviderStatus;
  cause?: unknown;
  details?: Record<string, unknown>;
}

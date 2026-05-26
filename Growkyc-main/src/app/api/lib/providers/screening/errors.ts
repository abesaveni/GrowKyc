import { ProviderErrorCode } from './types';

export class ProviderAdapterError extends Error {
  readonly name = 'ProviderAdapterError';

  constructor(
    message: string,
    public readonly code: ProviderErrorCode,
    public readonly providerName: string,
    public readonly retryable: boolean,
    public readonly httpStatus?: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
  }
}

export function isProviderAdapterError(error: unknown): error is ProviderAdapterError {
  return error instanceof ProviderAdapterError;
}

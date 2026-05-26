import type { StorageError } from './storageError';

export interface StorageResult<TData = unknown> {
  ok: boolean;
  data?: TData;
  error?: StorageError;
}

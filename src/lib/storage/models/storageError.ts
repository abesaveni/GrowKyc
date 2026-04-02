export type StorageErrorCode =
  | 'UPLOAD_FAILED'
  | 'DOWNLOAD_FAILED'
  | 'KEY_INVALID'
  | 'BUCKET_UNAVAILABLE'
  | 'ACCESS_DENIED'
  | 'OBJECT_NOT_FOUND'
  | 'QUOTA_EXCEEDED'
  | 'UNKNOWN_ERROR';

export interface StorageError {
  code: StorageErrorCode;
  message: string;
  retryable: boolean;
  cause?: unknown;
  details?: Record<string, unknown>;
}

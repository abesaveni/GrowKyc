/**
 * S3 Upload Error Handling
 * Utilities for handling and classifying S3 upload errors
 */

import type { StorageError } from '../models/storageError';

type S3ErrorLike =
  | {
      Code?: string;
      name?: string;
      message?: string;
    }
  | string
  | null
  | undefined;

type S3LoggingContext = Record<string, unknown>;

/**
 * AWS error codes that should trigger retries
 */
const RETRYABLE_S3_ERROR_CODES = new Set([
  'NetworkingError',
  'TimeoutError',
  'ThrottlingException',
  'RequestLimitExceeded',
  'SlowDownException',
  'ServiceUnavailable',
  'InternalError',
  'GatewayTimeout',
]);

/**
 * AWS error codes that indicate access issues
 */
const ACCESS_DENIED_S3_ERROR_CODES = new Set([
  'AccessDenied',
  'Forbidden',
  'NotAuthorized',
  'InvalidAccessKeyId',
  'SignatureDoesNotMatch',
]);

function getS3ErrorCode(error: S3ErrorLike, fallback: string): string {
  if (error && typeof error === 'object') {
    return error.Code || error.name || fallback;
  }

  return fallback;
}

function getS3ErrorMessage(error: S3ErrorLike): string {
  if (error && typeof error === 'object' && typeof error.message === 'string') {
    return error.message;
  }

  return String(error);
}

/**
 * Classify AWS S3 error and return appropriate StorageError
 */
export function classifyS3Error(error: S3ErrorLike): StorageError {
  const errorCode = getS3ErrorCode(error, 'UnknownError');
  const errorMessage = getS3ErrorMessage(error);

  if (ACCESS_DENIED_S3_ERROR_CODES.has(errorCode)) {
    return {
      code: 'ACCESS_DENIED',
      message: `S3 access denied: ${errorMessage}`,
      retryable: false,
    };
  }

  if (errorCode === 'NoSuchBucket' || errorMessage.includes('not found')) {
    return {
      code: 'BUCKET_UNAVAILABLE',
      message: `S3 bucket not available: ${errorMessage}`,
      retryable: false,
    };
  }

  if (errorCode === 'InvalidKey' || errorMessage.includes('invalid key')) {
    return {
      code: 'KEY_INVALID',
      message: `Invalid S3 object key: ${errorMessage}`,
      retryable: false,
    };
  }

  if (errorCode === 'QuotaExceeded' || errorMessage.includes('quota')) {
    return {
      code: 'QUOTA_EXCEEDED',
      message: `S3 quota exceeded: ${errorMessage}`,
      retryable: false,
    };
  }

  if (RETRYABLE_S3_ERROR_CODES.has(errorCode)) {
    return {
      code: 'UPLOAD_FAILED',
      message: `S3 upload failed (retryable): ${errorMessage}`,
      retryable: true,
    };
  }

  return {
    code: 'UPLOAD_FAILED',
    message: `S3 upload error: ${errorMessage}`,
    retryable: true,
  };
}

/**
 * Check if error is a network-related retryable error
 */
export function isNetworkError(error: S3ErrorLike): boolean {
  const errorCode = getS3ErrorCode(error, '');
  const errorMessage = getS3ErrorMessage(error);

  return (
    RETRYABLE_S3_ERROR_CODES.has(errorCode) ||
    errorMessage.includes('ECONNREFUSED') ||
    errorMessage.includes('ECONNRESET') ||
    errorMessage.includes('ETIMEDOUT') ||
    errorMessage.includes('network')
  );
}

/**
 * Get retry delay in milliseconds based on error type
 */
export function getRetryDelay(error: S3ErrorLike, attemptNumber: number = 1): number {
  const errorCode = getS3ErrorCode(error, '');

  if (errorCode === 'ThrottlingException' || errorCode === 'SlowDownException') {
    return Math.min(1000 * Math.pow(2, attemptNumber), 32000);
  }

  return Math.min(100 * Math.pow(2, attemptNumber), 10000);
}

/**
 * Format S3 upload error for logging
 */
export function formatS3ErrorForLogging(error: S3ErrorLike, context?: S3LoggingContext): string {
  const errorCode = getS3ErrorCode(error, 'UnknownError');
  const errorMessage = getS3ErrorMessage(error);

  let formatted = `S3 Upload Error [${errorCode}]: ${errorMessage}`;

  if (context) {
    formatted += ` | Context: ${JSON.stringify(context)}`;
  }

  return formatted;
}

/**
 * Validate error object before classification
 */
export function validateS3Error(error: S3ErrorLike): boolean {
  return Boolean(error) && (typeof error === 'object' || typeof error === 'string');
}

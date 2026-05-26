/**
 * S3 Upload Error Handling
 * Utilities for handling and classifying S3 upload errors
 */

import type { StorageError } from '../models/storageError.ts';

/**
 * AWS error codes that should trigger retries
 */
const RETRYABLE_AWS_ERRORS = [
  'NetworkingError',
  'TimeoutError',
  'ThrottlingException',
  'RequestLimitExceeded',
  'SlowDownException',
  'ServiceUnavailable',
  'InternalError',
  'GatewayTimeout',
];

/**
 * AWS error codes that indicate access issues
 */
const ACCESS_DENIED_ERRORS = [
  'AccessDenied',
  'Forbidden',
  'NotAuthorized',
  'InvalidAccessKeyId',
  'SignatureDoesNotMatch',
];

/**
 * Classify AWS S3 error and return appropriate StorageError
 */
export function classifyS3Error(error: any): StorageError {
  const errorCode = error?.Code || error?.name || 'UnknownError';
  const errorMessage = error?.message || String(error);

  // Access denied errors
  if (ACCESS_DENIED_ERRORS.includes(errorCode)) {
    return {
      code: 'ACCESS_DENIED',
      message: `S3 access denied: ${errorMessage}`,
      retryable: false,
    };
  }

  // Bucket not found
  if (errorCode === 'NoSuchBucket' || errorMessage.includes('not found')) {
    return {
      code: 'BUCKET_UNAVAILABLE',
      message: `S3 bucket not available: ${errorMessage}`,
      retryable: false,
    };
  }

  // Invalid key
  if (errorCode === 'InvalidKey' || errorMessage.includes('invalid key')) {
    return {
      code: 'KEY_INVALID',
      message: `Invalid S3 object key: ${errorMessage}`,
      retryable: false,
    };
  }

  // Quota exceeded
  if (errorCode === 'QuotaExceeded' || errorMessage.includes('quota')) {
    return {
      code: 'QUOTA_EXCEEDED',
      message: `S3 quota exceeded: ${errorMessage}`,
      retryable: false,
    };
  }

  // Retryable errors
  if (RETRYABLE_AWS_ERRORS.includes(errorCode)) {
    return {
      code: 'UPLOAD_FAILED',
      message: `S3 upload failed (retryable): ${errorMessage}`,
      retryable: true,
    };
  }

  // Unknown errors are retryable by default (transient issues)
  return {
    code: 'UPLOAD_FAILED',
    message: `S3 upload error: ${errorMessage}`,
    retryable: true,
  };
}

/**
 * Check if error is a network-related retryable error
 */
export function isNetworkError(error: any): boolean {
  const errorCode = error?.Code || error?.name || '';
  const errorMessage = error?.message || '';

  return (
    RETRYABLE_AWS_ERRORS.includes(errorCode) ||
    errorMessage.includes('ECONNREFUSED') ||
    errorMessage.includes('ECONNRESET') ||
    errorMessage.includes('ETIMEDOUT') ||
    errorMessage.includes('network')
  );
}

/**
 * Get retry delay in milliseconds based on error type
 */
export function getRetryDelay(error: any, attemptNumber: number = 1): number {
  const errorCode = error?.Code || error?.name || '';

  // Throttling errors get longer backoff
  if (errorCode === 'ThrottlingException' || errorCode === 'SlowDownException') {
    return Math.min(1000 * Math.pow(2, attemptNumber), 32000); // Exponential backoff, max 32s
  }

  // Standard backoff for other retryable errors
  return Math.min(100 * Math.pow(2, attemptNumber), 10000); // Exponential backoff, max 10s
}

/**
 * Format S3 upload error for logging
 */
export function formatS3ErrorForLogging(error: any, context?: Record<string, any>): string {
  const errorCode = error?.Code || error?.name || 'UnknownError';
  const errorMessage = error?.message || String(error);

  let formatted = `S3 Upload Error [${errorCode}]: ${errorMessage}`;

  if (context) {
    formatted += ` | Context: ${JSON.stringify(context)}`;
  }

  return formatted;
}

/**
 * Validate error object before classification
 */
export function validateS3Error(error: any): boolean {
  return error && (typeof error === 'object' || typeof error === 'string');
}

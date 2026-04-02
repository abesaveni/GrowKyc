import type { S3StorageConfig } from './s3Config';

export class S3ConfigValidationError extends Error {
  constructor(message: string) {
    super(`S3 config validation failed: ${message}`);
    this.name = 'S3ConfigValidationError';
  }
}

export function validateS3Config(config: S3StorageConfig): void {
  const errors: string[] = [];

  if (!config.region) {
    errors.push('region is required');
  }

  if (!config.accessKeyId || config.accessKeyId.trim().length === 0) {
    errors.push('accessKeyId is required (check AWS_ACCESS_KEY_ID env var)');
  }

  if (!config.secretAccessKey || config.secretAccessKey.trim().length === 0) {
    errors.push('secretAccessKey is required (check AWS_SECRET_ACCESS_KEY env var)');
  }

  if (!config.bucketName || config.bucketName.trim().length === 0) {
    errors.push('bucketName is required (check AWS_S3_BUCKET_NAME env var)');
  }

  if (!/^ap-southeast-2$/.test(config.region)) {
    errors.push(`region must be ap-southeast-2 (Sydney), got: ${config.region}`);
  }

  if (config.bucketName && !/^[a-z0-9.-]+$/.test(config.bucketName)) {
    errors.push(`bucketName must contain only lowercase letters, numbers, dots, and hyphens`);
  }

  if (errors.length > 0) {
    throw new S3ConfigValidationError(errors.join('; '));
  }
}

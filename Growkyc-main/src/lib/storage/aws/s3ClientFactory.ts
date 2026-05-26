import type { S3StorageConfig } from './s3Config';
import type { S3ClientConfig } from '@aws-sdk/client-s3';

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('S3 client initialization is server-side only.');
  }
}

/**
 * Creates AWS SDK S3 client configuration object.
 * Caller is responsible for initializing the actual S3Client.
 * This factory provides consistent configuration across the application.
 */
export function createS3ClientConfig(config: S3StorageConfig): S3ClientConfig {
  assertServerRuntime();

  const s3Config: S3ClientConfig = {
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  };

  if (config.endpoint) {
    s3Config.endpoint = config.endpoint;
  }

  return s3Config;
}

/**
 * Returns bucket name for evidence storage.
 * Validates it exists and is non-empty.
 */
export function getEvidenceBucketName(config: S3StorageConfig): string {
  if (!config.bucketName || config.bucketName.length === 0) {
    throw new Error('Evidence bucket name is not configured.');
  }
  return config.bucketName;
}

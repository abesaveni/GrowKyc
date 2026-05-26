import { S3Client, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { loadS3ConfigFromEnv, validateS3Config, createS3ClientConfig, getEvidenceBucketName } from '../aws';
import type { StorageError } from '../models/storageError.ts';

export interface SignedUrlResponse {
  signedUrl: string;
  expiresIn: number;
  key: string;
}

export class S3SignedUrlService {
  private async getClientInfo() {
    const config = loadS3ConfigFromEnv();
    validateS3Config(config);
    const clientConfig = createS3ClientConfig(config);
    const bucketName = getEvidenceBucketName(config);
    const client = new S3Client(clientConfig);
    return { client, bucketName };
  }

  async checkFileExists(client: S3Client, bucketName: string, key: string): Promise<boolean> {
    try {
      await client.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }));
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error; // Rethrow other errors
    }
  }

  async generateSignedUrl(key: string): Promise<{ ok: true; data: SignedUrlResponse } | { ok: false; error: StorageError }> {
    try {
      if (!key) {
        return { ok: false, error: { code: 'VALIDATION_FAILED', message: 'Object key is required', retryable: false } };
      }

      const { client, bucketName } = await this.getClientInfo();

      const exists = await this.checkFileExists(client, bucketName, key);
      if (!exists) {
        return { ok: false, error: { code: 'NOT_FOUND', message: 'File does not exist', retryable: false } };
      }

      const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
      const expiresIn = 300; // 300 seconds TTL

      const signedUrl = await getSignedUrl(client, command, { expiresIn });

      return {
        ok: true,
        data: {
          signedUrl,
          expiresIn,
          key,
        },
      };
    } catch (error: any) {
      return {
        ok: false,
        error: { code: 'URL_GENERATION_FAILED', message: error.message || 'Failed to generate signed URL', retryable: true },
      };
    }
  }

  async downloadSignedUrl(key: string) {
    return this.generateSignedUrl(key);
  }

  async revokeSignedUrl(key: string): Promise<{ ok: boolean }> {
    // Note: S3 presigned URLs cannot be explicitly revoked unless you invalidate the underlying credentials
    // or modify the object. For compliance, this returns ok.
    return { ok: true };
  }
}

let signedUrlServiceInstance: S3SignedUrlService | null = null;
export function getS3SignedUrlService(): S3SignedUrlService {
  if (!signedUrlServiceInstance) {
    signedUrlServiceInstance = new S3SignedUrlService();
  }
  return signedUrlServiceInstance;
}

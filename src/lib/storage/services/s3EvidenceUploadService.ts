/**
 * S3 Evidence Upload Service
 * Handles uploading evidence files to S3 with metadata attachment
 * Server-side only, no client-side upload flow
 */

import type { EvidenceRecord } from '../models/evidenceRecord';
import type { StorageResult } from '../models/storageResult.ts';
import type { StorageError } from '../models/storageError.ts';
import type { StoredObjectMetadata } from '../models/storedObjectMetadata.ts';
import { EvidenceObjectKeyBuilder } from '../builders/evidenceObjectKeyBuilder';
import {
  mapEvidenceToS3Metadata,
  mapToS3UserMetadata,
  mapToS3MetadataTags,
} from '../mappers/evidenceMetadataMapper';
import {
  applyAllMetadataHooks,
  validateMetadataForHooks,
  type MetadataHookContext,
} from '../hooks/metadataHooks';
import {
  loadS3ConfigFromEnv,
  validateS3Config,
  createS3ClientConfig,
  getEvidenceBucketName,
} from '../aws';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

/**
 * S3 Evidence Upload Service
 * Provides centralized evidence upload to S3 with metadata and retention support
 */
export class S3EvidenceUploadService {
  private keyBuilder: EvidenceObjectKeyBuilder;

  constructor() {
    this.keyBuilder = new EvidenceObjectKeyBuilder();
  }

  /**
   * Upload evidence file to S3 with full metadata support
   * @param evidence Evidence record with metadata
   * @param fileBuffer File content as Buffer
   * @param uploadedBy User ID performing upload
   * @returns StorageResult with upload metadata or StorageError
   */
  async uploadEvidence(
    evidence: EvidenceRecord,
    fileBuffer: Uint8Array,
    uploadedBy: string
  ): Promise<StorageResult<StoredObjectMetadata>> {
    try {
      // Validate input
      if (!fileBuffer || fileBuffer.length === 0) {
        return {
          ok: false,
          error: {
            code: 'UPLOAD_FAILED',
            message: 'File buffer is empty',
            retryable: false,
          },
        };
      }

      if (fileBuffer.length > 5_368_709_120) {
        // 5GB limit
        return {
          ok: false,
          error: {
            code: 'QUOTA_EXCEEDED',
            message: 'File size exceeds 5GB limit',
            retryable: false,
          },
        };
      }

      // Load and validate S3 configuration
      const config = loadS3ConfigFromEnv();
      try {
        validateS3Config(config);
      } catch (error) {
        return {
          ok: false,
          error: {
            code: 'BUCKET_UNAVAILABLE',
            message: `S3 configuration invalid: ${error instanceof Error ? error.message : 'Unknown error'}`,
            retryable: false,
          },
        };
      }

      // Build S3 object key
      const objectKey = this.keyBuilder.buildUploadKey({
        organizationId: evidence.organizationId,
        caseId: evidence.caseId,
        evidenceId: evidence.id,
        filename: evidence.filename,
      });

      // Map evidence to S3 metadata
      const s3Metadata = mapEvidenceToS3Metadata(evidence, {
        nowDate: new Date(),
      });

      // Validate metadata for hooks
      try {
        validateMetadataForHooks(s3Metadata);
      } catch (error) {
        return {
          ok: false,
          error: {
            code: 'UPLOAD_FAILED',
            message: `Metadata validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            retryable: false,
          },
        };
      }

      // Apply metadata hooks (retention, legal hold, version)
      const hookContext: MetadataHookContext = {
        now: new Date(),
        requestedBy: uploadedBy,
        organizationId: evidence.organizationId,
        operation: 'upload',
      };

      let processedMetadata = s3Metadata;
      try {
        processedMetadata = applyAllMetadataHooks(s3Metadata, hookContext);
      } catch (error) {
        return {
          ok: false,
          error: {
            code: 'UPLOAD_FAILED',
            message: `Metadata hook failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            retryable: false,
          },
        };
      }

      // Get S3 client config and bucket name
      const clientConfig = createS3ClientConfig(config);
      const bucketName = getEvidenceBucketName(config);

      // Build S3 metadata headers
      const userMetadata = mapToS3UserMetadata(processedMetadata);
      const objectTags = mapToS3MetadataTags(processedMetadata);

      // Prepare S3 put object parameters
      const uploadParams = {
        Bucket: bucketName,
        Key: objectKey,
        Body: fileBuffer,
        ContentType: evidence.mimeType,
        ContentLength: fileBuffer.length,
        Metadata: userMetadata,
        Tags: objectTags,
        // Enable versioning if supported by bucket
        ServerSideEncryption: config.kmsKeyId ? 'aws:kms' : undefined,
        SSEKMSKeyId: config.kmsKeyId,
      };

      // Filter out undefined values
      const cleanParams = Object.fromEntries(
        Object.entries(uploadParams).filter(([, v]) => v !== undefined)
      );

      // Perform S3 upload
      // Note: Actual S3 client instantiation deferred to runtime
      // This requires '@aws-sdk/client-s3' dependency and S3Client setup
      const uploadResult = await this.performS3Upload(cleanParams, config);

      if (!uploadResult.ok) {
        return uploadResult;
      }

      // Build and return success result with stored metadata
      const storedMetadata: StoredObjectMetadata = {
        bucket: bucketName,
        objectKey,
        etag: uploadResult.etag,
        versionId: uploadResult.versionId,
        contentType: evidence.mimeType,
        contentLength: fileBuffer.length,
        uploadedAtUtc: new Date().toISOString(),
        storageClass: 'STANDARD',
        serverSideEncryption: !!config.kmsKeyId,
        metadata: userMetadata,
        tags: objectTags,
      };

      return {
        ok: true,
        data: storedMetadata,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during upload';

      return {
        ok: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: `Evidence upload failed: ${errorMessage}`,
          retryable: true,
        },
      };
    }
  }

  /**
   * Perform actual S3 upload
   * Abstracted for dependency injection and testing
   * @private
   */
  private async performS3Upload(
    params: any,
    config: any
  ): Promise<
    | { ok: true; etag?: string; versionId?: string }
    | { ok: false; error: StorageError }
  > {
    try {
      const clientConfig = createS3ClientConfig(config);
      const client = new S3Client(clientConfig);
      const command = new PutObjectCommand(params);
      const response = await client.send(command);

      return {
        ok: true,
        etag: response.ETag,
        versionId: response.VersionId,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown S3 error';

      // Determine if error is retryable
      const isRetryable =
        errorMessage.includes('NetworkingError') ||
        errorMessage.includes('TimeoutError') ||
        errorMessage.includes('ThrottlingException') ||
        errorMessage.includes('RequestLimitExceeded');

      return {
        ok: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: `S3 upload error: ${errorMessage}`,
          retryable: isRetryable,
        },
      };
    }
  }

  /**
   * Get the object key that would be used for upload
   * Useful for preview/testing before actual upload
   */
  getUploadKey(organizationId: string, caseId: string, evidenceId: string, filename: string): string {
    return this.keyBuilder.buildUploadKey({
      organizationId,
      caseId,
      evidenceId,
      filename,
    });
  }
}

/**
 * Singleton instance of S3 evidence upload service
 */
let uploadServiceInstance: S3EvidenceUploadService | null = null;

/**
 * Get or create singleton upload service instance
 */
export function getS3EvidenceUploadService(): S3EvidenceUploadService {
  if (!uploadServiceInstance) {
    uploadServiceInstance = new S3EvidenceUploadService();
  }
  return uploadServiceInstance;
}

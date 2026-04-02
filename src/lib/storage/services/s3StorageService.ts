/**
 * S3 Storage Service
 * Unified storage service orchestrating upload, download, and key management
 * Server-side only, no UI or public routes
 */

import type { EvidenceRecord } from '../models/evidenceRecord';
import type { StorageResult } from '../models/storageResult';
import type { StoredObjectMetadata } from '../models/storedObjectMetadata';
import type { DownloadReference, DownloadReferenceBuilderOptions } from '../models/downloadReference';
import type { InternalObjectReference } from '../models/objectReference';
import { EvidenceObjectKeyBuilder } from '../builders/evidenceObjectKeyBuilder';
import { DownloadReferenceBuilder } from '../builders/downloadReferenceBuilder';
import {
  S3EvidenceUploadService,
  getS3EvidenceUploadService,
} from '../services/s3EvidenceUploadService';
import {
  S3BatchEvidenceUploadService,
  getS3BatchEvidenceUploadService,
  type EvidenceUploadItem,
  type BatchUploadResult,
  type BatchUploadOptions,
} from '../services/s3BatchEvidenceUploadService';
import {
  DownloadReferenceLookup,
  getDownloadReferenceLookup,
  type DownloadReferenceLookupResult,
} from '../lookup/downloadReferenceLookup';

/**
 * S3 Storage Service
 * Orchestrates all storage operations: uploads, downloads, references management
 */
export class S3StorageService {
  private keyBuilder: EvidenceObjectKeyBuilder;
  private downloadReferenceBuilder: DownloadReferenceBuilder;
  private uploadService: S3EvidenceUploadService;
  private batchUploadService: S3BatchEvidenceUploadService;
  private downloadLookup: DownloadReferenceLookup;

  /**
   * In-memory repository for download references
   * In production, this would be persisted to database
   */
  private downloadReferences: Map<string, DownloadReference> = new Map();

  constructor(
    keyBuilder?: EvidenceObjectKeyBuilder,
    downloadReferenceBuilder?: DownloadReferenceBuilder,
    uploadService?: S3EvidenceUploadService,
    batchUploadService?: S3BatchEvidenceUploadService,
    downloadLookup?: DownloadReferenceLookup
  ) {
    this.keyBuilder = keyBuilder || new EvidenceObjectKeyBuilder();
    this.downloadReferenceBuilder =
      downloadReferenceBuilder || new DownloadReferenceBuilder();
    this.uploadService = uploadService || getS3EvidenceUploadService();
    this.batchUploadService = batchUploadService || getS3BatchEvidenceUploadService(this.uploadService);
    this.downloadLookup = downloadLookup || getDownloadReferenceLookup();
  }

  /**
   * Upload a single evidence file
   */
  async uploadEvidence(
    evidence: EvidenceRecord,
    fileBuffer: Uint8Array,
    uploadedBy: string
  ): Promise<StorageResult<StoredObjectMetadata>> {
    try {
      return await this.uploadService.uploadEvidence(evidence, fileBuffer, uploadedBy);
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: error instanceof Error ? error.message : 'Storage service error',
          retryable: true,
        },
      };
    }
  }

  /**
   * Upload multiple evidence files in parallel
   */
  async uploadEvidenceBatch(
    items: EvidenceUploadItem[],
    options: BatchUploadOptions
  ): Promise<StorageResult<BatchUploadResult>> {
    try {
      const result = await this.batchUploadService.uploadBatch(items, options);
      return {
        ok: result.failureCount === 0,
        data: result,
        error:
          result.failureCount > 0
            ? {
                code: 'UPLOAD_FAILED',
                message: `Batch upload completed with ${result.failureCount} failures`,
                retryable: true,
              }
            : undefined,
      };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: error instanceof Error ? error.message : 'Batch upload error',
          retryable: true,
        },
      };
    }
  }

  /**
   * Create a download reference for an evidence object
   * Does not generate signed URL yet - that comes at request time
   */
  createDownloadReference(
    objectRef: InternalObjectReference,
    requestedBy: string,
    tenantId: string,
    caseIds: string[],
    filename: string,
    accessScope: 'case' | 'organization' | 'global',
    options?: DownloadReferenceBuilderOptions
  ): StorageResult<DownloadReference> {
    try {
      const reference = this.downloadReferenceBuilder.buildDownloadReferenceWithAccessControl(
        objectRef,
        requestedBy,
        tenantId,
        caseIds,
        filename,
        accessScope,
        options
      );

      // Store reference for later retrieval
      this.downloadReferences.set(reference.id, reference);

      return {
        ok: true,
        data: reference,
      };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: error instanceof Error ? error.message : 'Reference creation error',
          retryable: false,
        },
      };
    }
  }

  /**
   * Retrieve a download reference with validation
   * Checks expiration and access control
   */
  getDownloadReference(
    referenceId: string,
    currentTenantId: string,
    userCaseIds: string[]
  ): DownloadReferenceLookupResult {
    try {
      return this.downloadLookup.byReferenceIdWithAccessControl(
        referenceId,
        this.downloadReferences,
        currentTenantId,
        userCaseIds
      );
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: error instanceof Error ? error.message : 'Lookup error',
        },
      };
    }
  }

  /**
   * Verify a download reference is still valid
   */
  isDownloadReferenceValid(referenceId: string): boolean {
    const result = this.downloadLookup.byReferenceId(referenceId, this.downloadReferences);
    if (!result.ok) {
      return false;
    }

    const reference = result.reference!;
    return this.downloadReferenceBuilder.isReferenceValid(reference);
  }

  /**
   * Find all download references for an evidence
   */
  findDownloadReferencesForEvidence(evidenceId: string): DownloadReference[] {
    return this.downloadLookup.byEvidenceIdAndValidate(evidenceId, this.downloadReferences);
  }

  /**
   * Find all download references for a case
   */
  findDownloadReferencesForCase(caseId: string): DownloadReference[] {
    return this.downloadLookup.byCaseId(caseId, this.downloadReferences);
  }

  /**
   * Cleanup expired references
   * Should be called periodically (e.g., via scheduled task)
   */
  cleanupExpiredReferences(): number {
    return this.downloadLookup.removeExpired(this.downloadReferences);
  }

  /**
   * Get count of active download references
   */
  getActiveReferenceCount(): number {
    return this.downloadLookup.countActive(this.downloadReferences);
  }

  /**
   * Build an S3 object key for evidence
   * Useful for preview/testing before upload
   */
  buildObjectKey(
    organizationId: string,
    caseId: string,
    evidenceId: string,
    filename: string
  ): string {
    return this.keyBuilder.buildUploadKey({
      organizationId,
      caseId,
      evidenceId,
      filename,
    });
  }

  /**
   * Build a key prefix for querying evidence
   */
  buildKeyPrefix(organizationId: string, caseId?: string): string {
    return this.keyBuilder.buildPrefixKey({
      organizationId,
      caseId,
    });
  }
}

/**
 * Singleton instance of storage service
 */
let storageServiceInstance: S3StorageService | null = null;

/**
 * Get or create singleton storage service instance
 */
export function getS3StorageService(): S3StorageService {
  if (!storageServiceInstance) {
    storageServiceInstance = new S3StorageService();
  }
  return storageServiceInstance;
}

/**
 * S3 Batch Evidence Upload Service
 * Handles uploading multiple evidence files in parallel with progress tracking
 */

import type { EvidenceRecord } from '../models/evidenceRecord';
import type { StorageError } from '../models/storageError.ts';
import type { StoredObjectMetadata } from '../models/storedObjectMetadata.ts';
import { S3EvidenceUploadService } from './s3EvidenceUploadService';
import pLimit from 'p-limit';

/**
 * Single evidence upload item with file buffer
 */
export interface EvidenceUploadItem {
  evidence: EvidenceRecord;
  fileBuffer: Uint8Array;
}

/**
 * Batch upload result for a single evidence item
 */
export interface BatchUploadItemResult {
  evidenceId: string;
  success: boolean;
  metadata?: StoredObjectMetadata;
  error?: StorageError;
  duration: number; // milliseconds
}

/**
 * Overall batch upload result
 */
export interface BatchUploadResult {
  totalCount: number;
  successCount: number;
  failureCount: number;
  results: BatchUploadItemResult[];
  totalDuration: number; // milliseconds
  failedEvidenceIds: string[];
}

/**
 * Batch upload options
 */
export interface BatchUploadOptions {
  /**
   * Number of parallel uploads (default: 3)
   */
  parallelism?: number;

  /**
   * User ID performing batch upload
   */
  uploadedBy: string;

  /**
   * Stop on first error (default: false)
   */
  stopOnFirstError?: boolean;

  /**
   * Progress callback for monitoring
   */
  onProgress?: (completed: number, total: number) => void;
}

/**
 * S3 Batch Evidence Upload Service
 * Manages parallel uploads with error handling and progress tracking
 */
export class S3BatchEvidenceUploadService {
  private uploadService: S3EvidenceUploadService;
  private parallelism: number = 5;

  constructor(uploadService?: S3EvidenceUploadService) {
    this.uploadService = uploadService || new S3EvidenceUploadService();
  }

  /**
   * Upload multiple evidence files
   */
  async uploadBatch(
    items: EvidenceUploadItem[],
    options: BatchUploadOptions
  ): Promise<BatchUploadResult> {
    const startTime = Date.now();
    const parallelism = options.parallelism || this.parallelism;
    const results: BatchUploadItemResult[] = [];
    let completed = 0;

    try {
      const limit = pLimit(parallelism);

      // Create limited promises for all items
      const uploadPromises = items.map((item) => 
        limit(async () => {
          // Stop processing if stopOnFirstError is triggered by a previous failure
          if (options.stopOnFirstError && results.some(r => !r.success)) {
            return {
              evidenceId: item.evidence.id,
              success: false,
              error: {
                code: 'UPLOAD_CANCELLED',
                message: 'Upload cancelled due to previous error',
                retryable: false,
              },
              duration: 0,
            } as BatchUploadItemResult;
          }

          const result = await this.uploadSingleItem(item, options.uploadedBy);
          
          results.push(result);
          completed++;
          options.onProgress?.(completed, items.length);
          
          return result;
        })
      );

      // Await all items using Promise.allSettled to ensure failure isolation
      const allResults = await Promise.allSettled(uploadPromises);

      // Catch any unexpected promise rejections that bypassed our wrapper
      allResults.forEach((result) => {
        if (result.status === 'rejected') {
          results.push({
            evidenceId: 'unknown',
            success: false,
            error: {
              code: 'UPLOAD_FAILED',
              message: `Promise rejection: ${result.reason}`,
              retryable: true,
            },
            duration: 0,
          });
        }
      });
    } catch (error) {
      // Unexpected error during batch processing
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.push({
        evidenceId: 'batch',
        success: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: `Batch processing error: ${errorMessage}`,
          retryable: true,
        },
        duration: Date.now() - startTime,
      });
    }

    // Calculate summary
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;
    const failedEvidenceIds = results.filter((r) => !r.success).map((r) => r.evidenceId);

    return {
      totalCount: items.length,
      successCount,
      failureCount,
      results,
      totalDuration: Date.now() - startTime,
      failedEvidenceIds,
    };
  }

  /**
   * Upload single item with timing
   * @private
   */
  private async uploadSingleItem(
    item: EvidenceUploadItem,
    uploadedBy: string
  ): Promise<BatchUploadItemResult> {
    const startTime = Date.now();

    try {
      const result = await this.uploadService.uploadEvidence(item.evidence, item.fileBuffer, uploadedBy);

      const duration = Date.now() - startTime;

      if (result.ok && result.data) {
        return {
          evidenceId: item.evidence.id,
          success: true,
          metadata: result.data,
          duration,
        };
      } else {
        return {
          evidenceId: item.evidence.id,
          success: false,
          error: result.error,
          duration,
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        evidenceId: item.evidence.id,
        success: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          retryable: true,
        },
        duration,
      };
    }
  }

  /**
   * Retry failed uploads from batch result
   */
  async retryFailed(
    originalItems: EvidenceUploadItem[],
    batchResult: BatchUploadResult,
    options: BatchUploadOptions
  ): Promise<BatchUploadResult> {
    const failedItems = originalItems.filter((item) =>
      batchResult.failedEvidenceIds.includes(item.evidence.id)
    );

    if (failedItems.length === 0) {
      return {
        totalCount: 0,
        successCount: 0,
        failureCount: 0,
        results: [],
        totalDuration: 0,
        failedEvidenceIds: [],
      };
    }

    return this.uploadBatch(failedItems, options);
  }
}

/**
 * Singleton instance of batch upload service
 */
let batchUploadServiceInstance: S3BatchEvidenceUploadService | null = null;

/**
 * Get or create singleton batch upload service instance
 */
export function getS3BatchEvidenceUploadService(
  uploadService?: S3EvidenceUploadService
): S3BatchEvidenceUploadService {
  if (!batchUploadServiceInstance) {
    batchUploadServiceInstance = new S3BatchEvidenceUploadService(uploadService);
  }
  return batchUploadServiceInstance;
}

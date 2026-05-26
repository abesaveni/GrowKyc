import type { StorageUploadInput } from '../contracts/storageUploadInput';
import type { StoredObjectMetadata } from '../models/storedObjectMetadata';
import type { StorageDownloadReference } from '../models/storageDownloadReference';
import type { StorageResult } from '../models/storageResult';

export interface IStorageProvider {
  /**
   * Upload an object to S3.
   * Returns metadata on success or storage error on failure.
   */
  upload(input: StorageUploadInput): Promise<StorageResult<StoredObjectMetadata>>;

  /**
   * Generate a presigned download URL for an S3 object.
   * Returns download reference on success or storage error on failure.
   */
  getDownloadUrl(params: {
    bucket: string;
    objectKey: string;
    expiresInSeconds?: number;
  }): Promise<StorageResult<StorageDownloadReference>>;

  /**
   * Check if an object exists in S3.
   */
  objectExists(params: {
    bucket: string;
    objectKey: string;
  }): Promise<boolean>;

  /**
   * Delete an object from S3.
   */
  deleteObject(params: {
    bucket: string;
    objectKey: string;
  }): Promise<StorageResult<void>>;

  /**
   * List objects with a given prefix in S3.
   */
  listObjects(params: {
    bucket: string;
    prefix: string;
    maxKeys?: number;
  }): Promise<StorageResult<string[]>>;
}

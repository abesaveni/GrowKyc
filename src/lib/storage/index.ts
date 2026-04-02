export type { StorageUploadInput } from './contracts/storageUploadInput';
export type { StoredObjectMetadata } from './models/storedObjectMetadata';
export type { StorageDownloadReference } from './models/storageDownloadReference';
export type { StorageResult } from './models/storageResult';
export type { StorageError, StorageErrorCode } from './models/storageError';
export type { EvidenceRecord } from './models/evidenceRecord';
export type { IStorageProvider } from './interfaces/storageProvider';
export type { IObjectKeyBuilder } from './interfaces/objectKeyBuilder';
export { EvidenceObjectKeyBuilder, type EvidenceObjectKeyBuilderOptions } from './builders/evidenceObjectKeyBuilder';
export { sanitizeFilename } from './utils/sanitizeFilename';
export { formatDateForKey, generateVersionToken } from './utils/keyHelpers';
export {
  getContentTypeInfo,
  normalizeMimeType,
  isValidEvidenceContentType,
  type ContentTypeInfo,
} from './utils/contentTypeHelper';
export {
  buildS3MetadataTags,
  type FileHashMetadata,
  type RetentionMetadata,
  type LegalHoldMetadata,
  type VersionMetadata,
  type S3EvidenceMetadata,
  type S3MetadataTags,
} from './metadata/metadataModels';
export {
  mapEvidenceToS3Metadata,
  mapToS3MetadataTags,
  mapToS3UserMetadata,
  serializeMetadata,
  type EvidenceMetadataMapperOptions,
} from './mappers/evidenceMetadataMapper';
export {
  applyRetentionMetadataHook,
  applyLegalHoldCompatibilityHook,
  applyVersionMetadataHook,
  applyAllMetadataHooks,
  validateMetadataForHooks,
  RetentionPolicyError,
  LegalHoldError,
  MetadataHookError,
  type MetadataHookContext,
} from './hooks/metadataHooks';
export {
  loadS3ConfigFromEnv,
  validateS3Config,
  createS3ClientConfig,
  getEvidenceBucketName,
  type S3StorageConfig,
} from './aws';
export { S3ConfigValidationError } from './aws/s3ConfigValidation';
export {
  S3EvidenceUploadService,
  getS3EvidenceUploadService,
} from './services/s3EvidenceUploadService';
export {
  classifyS3Error,
  isNetworkError,
  getRetryDelay,
  formatS3ErrorForLogging,
  validateS3Error,
} from './services/s3UploadErrorHandler';
export {
  S3BatchEvidenceUploadService,
  getS3BatchEvidenceUploadService,
  type EvidenceUploadItem,
  type BatchUploadItemResult,
  type BatchUploadResult,
  type BatchUploadOptions,
} from './services/s3BatchEvidenceUploadService';
export type {
  InternalObjectReference,
  ValidatedObjectReference,
} from './models/objectReference';
export type {
  DownloadReference,
  DownloadAccessControl,
  DownloadReferenceBuilderOptions,
} from './models/downloadReference';
export {
  DownloadReferenceBuilder,
  getDownloadReferenceBuilder,
} from './builders/downloadReferenceBuilder';
export {
  DownloadReferenceLookup,
  DownloadReferenceLookupException,
  getDownloadReferenceLookup,
  type DownloadReferenceLookupResult,
  type DownloadReferenceLookupError,
} from './lookup/downloadReferenceLookup';
export {
  NotConfiguredSignedUrlGenerationHook,
  AuditLoggingSignedUrlHook,
  ValidationSignedUrlHook,
  applyPreSignedUrlGenerationHooks,
  applyPostSignedUrlGenerationHooks,
  type ISignedUrlGenerationHook,
  type SignedUrlData,
  type SignedUrlGenerationContext,
  type IPreSignedUrlGenerationHook,
  type IPostSignedUrlGenerationHook,
} from './hooks/signedUrlGenerationHooks';
export {
  S3StorageService,
  getS3StorageService,
} from './services/s3StorageService';

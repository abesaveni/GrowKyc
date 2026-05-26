/**
 * Evidence Metadata Mapper
 * Converts EvidenceRecord to S3 metadata with retention, legal hold, and version support
 */

import { EvidenceRecord } from '../models/evidenceRecord';
import {
  S3EvidenceMetadata,
  FileHashMetadata,
  RetentionMetadata,
  LegalHoldMetadata,
  VersionMetadata,
  buildS3MetadataTags,
  type S3MetadataTags,
} from '../metadata/metadataModels';

/**
 * Mapper configuration options
 */
export interface EvidenceMetadataMapperOptions {
  /**
   * Override the current timestamp (for testing)
   */
  nowDate?: Date;

  /**
   * Override version metadata
   */
  versionToken?: string;

  /**
   * Custom lifecycle policy
   */
  lifecyclePolicy?: string;

  /**
   * Additional custom metadata
   */
  customMetadata?: Record<string, any>;
}

/**
 * Build file hash metadata from evidence record
 */
function buildFileHashMetadata(evidence: EvidenceRecord): FileHashMetadata | undefined {
  if (!evidence.fileHash) {
    return undefined;
  }

  return {
    value: evidence.fileHash,
    algorithm: evidence.hashAlgorithm || 'sha256',
    calculatedAt: evidence.uploadedAt.toISOString(),
    calculatedBy: evidence.uploadedBy,
  };
}

/**
 * Build retention metadata from evidence record
 */
function buildRetentionMetadata(evidence: EvidenceRecord, nowDate: Date): RetentionMetadata | undefined {
  if (!evidence.retentionDays) {
    return undefined;
  }

  const expiresAt = new Date(nowDate);
  expiresAt.setDate(expiresAt.getDate() + evidence.retentionDays);

  return {
    retentionDays: evidence.retentionDays,
    expiresAt: expiresAt.toISOString(),
    deleteBlocked: evidence.legalHold !== 'none' && evidence.legalHold !== undefined,
    setBy: evidence.uploadedBy,
    setAt: evidence.uploadedAt.toISOString(),
  };
}

/**
 * Build legal hold metadata from evidence record
 */
function buildLegalHoldMetadata(evidence: EvidenceRecord, nowDate: Date): LegalHoldMetadata | undefined {
  const status = evidence.legalHold || 'none';

  if (status === 'none') {
    return undefined;
  }

  return {
    status,
    appliedAt: status === 'active' ? nowDate.toISOString() : undefined,
    appliedBy: status === 'active' ? evidence.uploadedBy : undefined,
    properties: evidence.metadata?.legalHoldProperties,
  };
}

/**
 * Build version metadata from evidence record
 */
function buildVersionMetadata(
  evidence: EvidenceRecord,
  versionToken: string,
  previousToken?: string
): VersionMetadata | undefined {
  const version = evidence.version ?? 1;

  if (version === 0) {
    return undefined;
  }

  return {
    version,
    token: versionToken,
    previousToken,
    createdAt: evidence.uploadedAt.toISOString(),
    createdBy: evidence.uploadedBy,
    reason: evidence.metadata?.versionReason,
    isCurrent: true,
    fileHash: buildFileHashMetadata(evidence),
  };
}

/**
 * Map EvidenceRecord to S3 metadata
 * Centralizes all metadata extraction and building
 */
export function mapEvidenceToS3Metadata(
  evidence: EvidenceRecord,
  options?: EvidenceMetadataMapperOptions
): S3EvidenceMetadata {
  const nowDate = options?.nowDate || new Date();
  const versionToken = options?.versionToken || generateDefaultVersionToken();

  return {
    // Core identifiers
    organizationId: evidence.organizationId,
    caseId: evidence.caseId,
    evidenceId: evidence.id,

    // Source information
    sourceFilename: evidence.filename,
    uploadedAt: evidence.uploadedAt.toISOString(),
    uploadedBy: evidence.uploadedBy,
    description: evidence.description,

    // Hash verification
    hash: buildFileHashMetadata(evidence),

    // Retention & lifecycle
    retention: buildRetentionMetadata(evidence, nowDate),

    // Legal compliance
    legalHold: buildLegalHoldMetadata(evidence, nowDate),

    // Versioning
    version: buildVersionMetadata(evidence, versionToken),

    // Additional tags
    tags: evidence.tags,

    // Lifecycle policy
    lifecyclePolicy: options?.lifecyclePolicy,

    // Immutability flag
    isImmutable: evidence.isImmutable,

    // Custom metadata
    custom: options?.customMetadata || evidence.metadata,
  };
}

/**
 * Convert S3 metadata to S3 object metadata format (tags)
 * Used when uploading to S3
 */
export function mapToS3MetadataTags(metadata: S3EvidenceMetadata): S3MetadataTags {
  return buildS3MetadataTags(metadata);
}

/**
 * Convert S3 metadata to string-serializable format for S3 metadata headers
 * S3 UserMetadata field requires string values
 */
export function mapToS3UserMetadata(metadata: S3EvidenceMetadata): Record<string, string> {
  const userMetadata: Record<string, string> = {
    organizationId: metadata.organizationId,
    caseId: metadata.caseId,
    evidenceId: metadata.evidenceId,
    sourceFilename: metadata.sourceFilename,
    uploadedAtUtc: metadata.uploadedAt,
    uploadedBy: metadata.uploadedBy,
  };

  if (metadata.description) {
    userMetadata.description = metadata.description;
  }

  if (metadata.hash) {
    userMetadata['hash-algorithm'] = metadata.hash.algorithm;
    userMetadata['hash-value'] = metadata.hash.value;
  }

  if (metadata.retention) {
    userMetadata['retention-days'] = metadata.retention.retentionDays.toString();
    userMetadata['expires-at'] = metadata.retention.expiresAt;
  }

  if (metadata.legalHold && metadata.legalHold.status !== 'none') {
    userMetadata['legal-hold-status'] = metadata.legalHold.status;
  }

  if (metadata.version) {
    userMetadata['version-number'] = metadata.version.version.toString();
    userMetadata['version-token'] = metadata.version.token;
  }

  if (metadata.isImmutable) {
    userMetadata['immutable'] = 'true';
  }

  return userMetadata;
}

/**
 * Generate default version token based on current timestamp
 * Format: v{unix-timestamp-hex}
 */
function generateDefaultVersionToken(): string {
  const now = Date.now();
  const hex = now.toString(16);
  return `v${hex}`;
}

/**
 * Serialize S3 metadata to JSON for debugging/logging
 */
export function serializeMetadata(metadata: S3EvidenceMetadata): string {
  return JSON.stringify(metadata, null, 2);
}

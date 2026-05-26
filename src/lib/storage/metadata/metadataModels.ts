/**
 * Metadata Models for Evidence Storage
 * Defines metadata structures for file hash, retention, legal hold, and versioning
 */

/**
 * File Hash Metadata
 * Stores hash values for integrity verification
 */
export interface FileHashMetadata {
  /**
   * Hash value (hex string)
   */
  value: string;

  /**
   * Algorithm used (sha256, md5, sha1)
   */
  algorithm: 'sha256' | 'md5' | 'sha1';

  /**
   * When hash was calculated
   */
  calculatedAt: string; // ISO 8601 timestamp

  /**
   * Component that calculated it
   */
  calculatedBy: string;
}

/**
 * Retention Metadata
 * Controls how long evidence is retained before expiration
 */
export interface RetentionMetadata {
  /**
   * Number of days to retain
   */
  retentionDays?: number;

  /**
   * Date evidence should be deleted (ISO 8601)
   */
  expiresAt?: string;

  /**
   * AUSTRAC specific retention date (uploadDate + 7 years)
   */
  retentionUntil?: string;

  /**
   * Specific retention policy applied
   */
  retentionPolicy?: string;

  /**
   * Reason for retention period
   */
  reason?: string;

  /**
   * Whether automated deletion is blocked
   */
  deleteBlocked?: boolean;

  /**
   * Who set the retention policy
   */
  setBy?: string;

  /**
   * When retention was set (ISO 8601)
   */
  setAt?: string;
}

/**
 * Legal Hold Metadata
 * Prevents deletion and enables special handling during legal proceedings
 */
export interface LegalHoldMetadata {
  /**
   * Current legal hold status
   */
  status: 'none' | 'active' | 'pending_release' | 'released';

  /**
   * Whether the legal hold is currently active (boolean flag for compatibility)
   */
  legal_hold?: boolean;

  /**
   * Case/matter reference for legal hold
   */
  caseReference?: string;

  /**
   * Reason for legal hold
   */
  reason?: string;

  /**
   * When hold was applied (ISO 8601)
   */
  appliedAt?: string;

  /**
   * Who applied the hold
   */
  appliedBy?: string;

  /**
   * When hold was released (ISO 8601)
   */
  releasedAt?: string;

  /**
   * Who released the hold
   */
  releasedBy?: string;

  /**
   * Additional hold metadata
   */
  properties?: Record<string, any>;
}

/**
 * Version Metadata
 * Tracks versioning information for evidence
 */
export interface VersionMetadata {
  /**
   * Current version number
   */
  version: number;

  /**
   * Version token (unique identifier for this version)
   */
  token: string;

  /**
   * Previous version token (if not first version)
   */
  previousToken?: string;

  /**
   * When this version was created (ISO 8601)
   */
  createdAt: string;

  /**
   * User who created this version
   */
  createdBy: string;

  /**
   * Reason for new version
   */
  reason?: string;

  /**
   * Whether this version is current
   */
  isCurrent: boolean;

  /**
   * File hash of this version
   */
  fileHash?: FileHashMetadata;
}

/**
 * Unified S3 Metadata Object
 * Complete metadata to attach to S3 object
 */
export interface S3EvidenceMetadata {
  // Core identifiers
  organizationId: string;
  caseId: string;
  evidenceId: string;

  // Source information
  sourceFilename: string;
  uploadedAt: string; // ISO 8601
  uploadedBy: string;
  description?: string;

  // Hash verification
  hash?: FileHashMetadata;

  // Retention & lifecycle
  retention?: RetentionMetadata;

  // Legal compliance
  legalHold?: LegalHoldMetadata;

  // Versioning
  version?: VersionMetadata;

  // Additional tags
  tags?: string[];

  // Lifecycle policy tag
  lifecyclePolicy?: string;

  // Immutability flag
  isImmutable?: boolean;

  // Custom application metadata
  custom?: Record<string, any>;
}

/**
 * S3 Metadata Tag Mapping
 * Maps metadata to S3 object tags (max 10 for cost tracking)
 */
export interface S3MetadataTags {
  [key: string]: string;
}

/**
 * Build S3 metadata tags from evidence metadata
 * Prioritizes organizational, compliance, and lifecycle tags
 */
export function buildS3MetadataTags(metadata: S3EvidenceMetadata): S3MetadataTags {
  const tags: S3MetadataTags = {
    organization: metadata.organizationId,
    case: metadata.caseId,
    evidence: metadata.evidenceId,
  };

  if (metadata.legalHold?.status === 'active') {
    tags.legalHold = 'true';
  }

  if (metadata.retention) {
    tags.retention = `${metadata.retention.retentionDays}d`;
  }

  if (metadata.version) {
    tags.version = `v${metadata.version.version}`;
  }

  if (metadata.isImmutable) {
    tags.immutable = 'true';
  }

  if (metadata.lifecyclePolicy) {
    tags.lifecycle = metadata.lifecyclePolicy;
  }

  // S3 allows max 10 tags, so truncate if needed
  const entries = Object.entries(tags).slice(0, 10);
  return Object.fromEntries(entries);
}

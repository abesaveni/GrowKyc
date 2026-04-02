/**
 * Evidence Record Model
 * Represents evidence data before upload to S3
 */

export type HashAlgorithm = 'sha256' | 'md5' | 'sha1';
export type LegalHoldStatus = 'none' | 'active' | 'pending_release';
export type EvidenceStatus = 'pending' | 'uploaded' | 'archived' | 'expired';

export interface EvidenceRecord {
  /**
   * Unique identifier for this evidence
   */
  id: string;

  /**
   * Associated case ID
   */
  caseId: string;

  /**
   * Organization ID (tenant)
   */
  organizationId: string;

  /**
   * Original filename
   */
  filename: string;

  /**
   * MIME type (e.g., application/pdf)
   */
  mimeType: string;

  /**
   * File size in bytes
   */
  fileSize: number;

  /**
   * Human-readable description
   */
  description?: string;

  /**
   * When evidence was uploaded/received
   */
  uploadedAt: Date;

  /**
   * User ID who uploaded evidence
   */
  uploadedBy: string;

  /**
   * File hash for integrity verification
   */
  fileHash?: string;

  /**
   * Hash algorithm used (defaults to sha256)
   */
  hashAlgorithm?: HashAlgorithm;

  /**
   * Data retention period in days
   */
  retentionDays?: number;

  /**
   * Legal hold status
   */
  legalHold?: LegalHoldStatus;

  /**
   * Evidence version number
   */
  version?: number;

  /**
   * Current status
   */
  status?: EvidenceStatus;

  /**
   * Additional metadata
   */
  metadata?: Record<string, any>;

  /**
   * Tags for categorization
   */
  tags?: string[];

  /**
   * Whether immutable (cannot be deleted)
   */
  isImmutable?: boolean;
}

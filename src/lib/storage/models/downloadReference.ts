/**
 * Download Reference Models
 * Represents a safe, access-controlled reference to a downloadable evidence object
 */

/**
 * Access control information attached to download reference
 */
export interface DownloadAccessControl {
  /**
   * User or principal requesting download
   */
  requestedBy: string;

  /**
   * Organization/tenant ID
   */
  tenantId: string;

  /**
   * User's roles (for future role-based access)
   */
  userRoles?: string[];

  /**
   * Case access permissions
   */
  caseIds?: string[];

  /**
   * Whether user can access all cases (admin)
   */
  hasGlobalAccess?: boolean;

  /**
   * Access scope ('case' | 'organization' | 'global')
   */
  accessScope: 'case' | 'organization' | 'global';

  /**
   * When access verification was performed
   */
  verifiedAt: string;
}

/**
 * Download reference ready for URL generation
 * Contains all information needed to generate a signed URL
 */
export interface DownloadReference {
  /**
   * Unique reference ID
   */
  id: string;

  /**
   * S3 bucket name
   */
  bucket: string;

  /**
   * S3 object key
   */
  objectKey: string;

  /**
   * S3 version ID (optional)
   */
  versionId?: string;

  /**
   * Evidence identifiers
   */
  evidenceId: string;
  caseId: string;
  organizationId: string;

  /**
   * Original filename for download
   */
  filename: string;

  /**
   * Content type
   */
  contentType: string;

  /**
   * Content length in bytes
   */
  contentLength: number;

  /**
   * When reference was created
   */
  createdAt: string;

  /**
   * Access control information
   */
  accessControl: DownloadAccessControl;

  /**
   * Expiration time for reference validity (not URL)
   */
  expiresAt: string;

  /**
   * Time-to-live in seconds for signed URL
   */
  urlTtlSeconds: number;

  /**
   * Download use case ('preview' | 'export' | 'archive' | 'legal-hold')
   */
  downloadReason: 'preview' | 'export' | 'archive' | 'legal-hold' | 'compliance';

  /**
   * Metadata for audit trail
   */
  auditMetadata?: {
    requestId?: string;
    sourceIp?: string;
    userAgent?: string;
  };
}

/**
 * Options for download reference builder
 */
export interface DownloadReferenceBuilderOptions {
  /**
   * URL TTL in seconds (default: 3600 = 1 hour)
   */
  urlTtlSeconds?: number;

  /**
   * Reference expiration time in seconds from now (default: 86400 = 24 hours)
   */
  referenceExpirySeconds?: number;

  /**
   * Download reason
   */
  downloadReason?: 'preview' | 'export' | 'archive' | 'legal-hold' | 'compliance';

  /**
   * Audit metadata
   */
  auditMetadata?: {
    requestId?: string;
    sourceIp?: string;
    userAgent?: string;
  };

  /**
   * Override creation timestamp (for testing)
   */
  nowDate?: Date;
}

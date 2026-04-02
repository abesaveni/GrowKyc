/**
 * Object Reference Model
 * Internal representation of evidence stored in S3
 */

export interface InternalObjectReference {
  /**
   * S3 bucket name
   */
  bucket: string;

  /**
   * S3 object key (full path)
   */
  objectKey: string;

  /**
   * S3 version ID (if bucket has versioning enabled)
   */
  versionId?: string;

  /**
   * Object ETag (entity tag for integrity)
   */
  etag?: string;

  /**
   * Evidence metadata from S3 object tags
   */
  organizationId: string;
  caseId: string;
  evidenceId: string;

  /**
   * Content metadata
   */
  contentType: string;
  contentLength: number;
  uploadedAtUtc: string;

  /**
   * Access control metadata
   */
  ownerId: string;
  tenantId: string;

  /**
   * Storage metadata
   */
  storageClass?: string;
  serverSideEncryption?: boolean;

  /**
   * Compliance metadata
   */
  isImmutable?: boolean;
  legalHoldActive?: boolean;

  /**
   * User metadata from S3 object
   */
  userMetadata?: Record<string, string>;

  /**
   * Object tags from S3
   */
  tags?: Record<string, string>;
}

/**
 * Validated object reference ready for download
 */
export interface ValidatedObjectReference extends InternalObjectReference {
  /**
   * Validation timestamp
   */
  validatedAt: string;

  /**
   * User who validated the reference
   */
  validatedBy: string;

  /**
   * Reason validation passed
   */
  validationReason?: string;
}

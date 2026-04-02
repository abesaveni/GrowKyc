/**
 * Download Reference Builder
 * Constructs access-controlled download references for evidence
 */

import { InternalObjectReference, ValidatedObjectReference } from '../models/objectReference';
import {
  DownloadReference,
  DownloadAccessControl,
  DownloadReferenceBuilderOptions,
} from '../models/downloadReference';

/**
 * Default values for download reference builder
 */
const DEFAULTS = {
  URL_TTL_SECONDS: 3600, // 1 hour
  REFERENCE_EXPIRY_SECONDS: 86400, // 24 hours
  DOWNLOAD_REASON: 'export' as const,
};

/**
 * Download Reference Builder
 * Creates typed, access-controlled download references for S3 objects
 */
export class DownloadReferenceBuilder {
  /**
   * Build a download reference from an object reference and access control
   */
  buildDownloadReference(
    objectRef: InternalObjectReference | ValidatedObjectReference,
    accessControl: DownloadAccessControl,
    filename: string,
    options?: DownloadReferenceBuilderOptions
  ): DownloadReference {
    const nowDate = options?.nowDate || new Date();
    const urlTtlSeconds = options?.urlTtlSeconds ?? DEFAULTS.URL_TTL_SECONDS;
    const referenceExpirySeconds =
      options?.referenceExpirySeconds ?? DEFAULTS.REFERENCE_EXPIRY_SECONDS;
    const downloadReason = options?.downloadReason ?? DEFAULTS.DOWNLOAD_REASON;

    // Calculate expiration time
    const expiresAt = new Date(nowDate);
    expiresAt.setSeconds(expiresAt.getSeconds() + referenceExpirySeconds);

    return {
      id: this.generateReferenceId(objectRef),
      bucket: objectRef.bucket,
      objectKey: objectRef.objectKey,
      versionId: objectRef.versionId,
      evidenceId: objectRef.evidenceId,
      caseId: objectRef.caseId,
      organizationId: objectRef.organizationId,
      filename,
      contentType: objectRef.contentType,
      contentLength: objectRef.contentLength,
      createdAt: nowDate.toISOString(),
      accessControl,
      expiresAt: expiresAt.toISOString(),
      urlTtlSeconds,
      downloadReason,
      auditMetadata: options?.auditMetadata,
    };
  }

  /**
   * Build download reference with automatic access control validation
   * Verifies user can access the case/evidence before building reference
   */
  buildDownloadReferenceWithAccessControl(
    objectRef: InternalObjectReference,
    requestedBy: string,
    tenantId: string,
    caseIds: string[],
    filename: string,
    accessScope: 'case' | 'organization' | 'global',
    options?: DownloadReferenceBuilderOptions
  ): DownloadReference {
    const nowDate = options?.nowDate || new Date();

    // Build access control info
    const accessControl: DownloadAccessControl = {
      requestedBy,
      tenantId,
      caseIds,
      accessScope,
      verifiedAt: nowDate.toISOString(),
    };

    return this.buildDownloadReference(objectRef, accessControl, filename, options);
  }

  /**
   * Generate unique reference ID based on object and request details
   * Creates a deterministic ID from object key and timestamp
   */
  private generateReferenceId(objectRef: InternalObjectReference): string {
    const timestamp = Date.now().toString(16);
    const keyHash = this.hashObjectKey(objectRef.objectKey);
    return `ref_${keyHash}_${timestamp}`;
  }

  /**
   * Generate simple hash of object key
   * Used for reference ID generation
   */
  private hashObjectKey(objectKey: string): string {
    // Simple hash: character code sum in hex
    let hash = 0;
    for (let i = 0; i < objectKey.length; i++) {
      hash = ((hash << 5) - hash) + objectKey.charCodeAt(i);
      hash = hash & 0xffffffff; // Keep it as 32-bit
    }
    return Math.abs(hash).toString(16).substring(0, 8);
  }

  /**
   * Check if download reference is still valid
   */
  isReferenceValid(reference: DownloadReference): boolean {
    const now = new Date();
    const expiresAt = new Date(reference.expiresAt);
    return now < expiresAt;
  }

  /**
   * Check if reference is expired
   */
  isReferenceExpired(reference: DownloadReference): boolean {
    return !this.isReferenceValid(reference);
  }

  /**
   * Get time remaining until reference expires (in seconds)
   */
  getTimeToExpiry(reference: DownloadReference): number {
    const now = new Date();
    const expiresAt = new Date(reference.expiresAt);
    const diffMs = expiresAt.getTime() - now.getTime();
    return Math.max(0, Math.floor(diffMs / 1000));
  }

  /**
   * Check if access is still valid for reference
   * Verifies tenant match and case access
   */
  isAccessValid(reference: DownloadReference, currentTenantId: string, userCaseIds: string[]): boolean {
    // Tenant mismatch = access denied
    if (reference.accessControl.tenantId !== currentTenantId) {
      return false;
    }

    // Global access bypasses case check
    if (reference.accessControl.accessScope === 'global') {
      return true;
    }

    // Case scope: verify user has access to this case
    if (reference.accessControl.accessScope === 'case') {
      return (reference.accessControl.caseIds || []).some((caseId) =>
        userCaseIds.includes(caseId)
      );
    }

    // Organization scope: verify tenant match
    if (reference.accessControl.accessScope === 'organization') {
      return true;
    }

    return false;
  }

  /**
   * Serialize download reference to JSON
   */
  serialize(reference: DownloadReference): string {
    return JSON.stringify(reference, null, 2);
  }

  /**
   * Deserialize download reference from JSON
   */
  deserialize(json: string): DownloadReference {
    return JSON.parse(json);
  }
}

/**
 * Singleton instance of download reference builder
 */
let builderInstance: DownloadReferenceBuilder | null = null;

/**
 * Get or create singleton builder instance
 */
export function getDownloadReferenceBuilder(): DownloadReferenceBuilder {
  if (!builderInstance) {
    builderInstance = new DownloadReferenceBuilder();
  }
  return builderInstance;
}

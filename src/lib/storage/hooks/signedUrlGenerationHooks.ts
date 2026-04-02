/**
 * Signed URL Generation Hooks
 * Lifecycle hooks for generating signed URLs from download references
 * Implementation deferred to when AWS SDK is integrated
 */

import { DownloadReference } from '../models/downloadReference';
import type { StorageResult } from '../models/storageResult';

/**
 * Signed URL result
 */
export interface SignedUrlData {
  /**
   * The signed URL ready for download
   */
  url: string;

  /**
   * URL expiration time (ISO 8601)
   */
  expiresAt: string;

  /**
   * Time until URL expires (seconds)
   */
  expiresInSeconds: number;

  /**
   * HTTP method (GET for downloads)
   */
  httpMethod: 'GET';

  /**
   * Generated at timestamp
   */
  generatedAt: string;
}

/**
 * Signed URL Generation Hook
 * Interface for generating signed URLs (implemented by S3 adapter)
 */
export interface ISignedUrlGenerationHook {
  /**
   * Generate signed URL for a download reference
   * Called before actual download to create time-limited access URL
   */
  generateSignedUrl(reference: DownloadReference): Promise<StorageResult<SignedUrlData>>;

  /**
   * Validate signed URL is still valid
   */
  validateSignedUrl(url: string, reference: DownloadReference): Promise<boolean>;

  /**
   * Revoke signed URL (if supported by storage provider)
   */
  revokeSignedUrl?(url: string): Promise<StorageResult<void>>;
}

/**
 * Not Configured Signed URL Hook
 * Placeholder implementation - throws when called
 */
export class NotConfiguredSignedUrlGenerationHook implements ISignedUrlGenerationHook {
  async generateSignedUrl(reference: DownloadReference): Promise<StorageResult<SignedUrlData>> {
    return {
      ok: false,
      error: {
        code: 'UPLOAD_FAILED',
        message: 'Signed URL generation not configured. AWS SDK integration required.',
        retryable: false,
      },
    };
  }

  async validateSignedUrl(url: string, reference: DownloadReference): Promise<boolean> {
    throw new Error('Signed URL validation not configured');
  }

  async revokeSignedUrl(url: string): Promise<StorageResult<void>> {
    return {
      ok: false,
      error: {
        code: 'UPLOAD_FAILED',
        message: 'Signed URL revocation not configured',
        retryable: false,
      },
    };
  }
}

/**
 * Hook context for signed URL generation
 */
export interface SignedUrlGenerationContext {
  /**
   * Current timestamp
   */
  now: Date;

  /**
   * User requesting the signed URL
   */
  requestedBy: string;

  /**
   * Request context (IP, user agent, etc.)
   */
  auditContext?: {
    sourceIp?: string;
    userAgent?: string;
  };

  /**
   * Override default TTL
   */
  ttlOverride?: number;
}

/**
 * Pre-generation hook
 * Called before signed URL generation
 */
export interface IPreSignedUrlGenerationHook {
  execute(reference: DownloadReference, context: SignedUrlGenerationContext): Promise<void>;
}

/**
 * Post-generation hook
 * Called after successful signed URL generation
 */
export interface IPostSignedUrlGenerationHook {
  execute(
    reference: DownloadReference,
    signedUrl: SignedUrlData,
    context: SignedUrlGenerationContext
  ): Promise<void>;
}

/**
 * Apply pre-generation hooks in sequence
 * Used for validation, logging, etc.
 */
export async function applyPreSignedUrlGenerationHooks(
  reference: DownloadReference,
  context: SignedUrlGenerationContext,
  hooks: IPreSignedUrlGenerationHook[] = []
): Promise<void> {
  for (const hook of hooks) {
    await hook.execute(reference, context);
  }
}

/**
 * Apply post-generation hooks in sequence
 * Used for audit logging, analytics, etc.
 */
export async function applyPostSignedUrlGenerationHooks(
  reference: DownloadReference,
  signedUrl: SignedUrlData,
  context: SignedUrlGenerationContext,
  hooks: IPostSignedUrlGenerationHook[] = []
): Promise<void> {
  for (const hook of hooks) {
    await hook.execute(reference, signedUrl, context);
  }
}

/**
 * Audit logging hook implementation
 * Logs signed URL generation for compliance
 */
export class AuditLoggingSignedUrlHook implements IPostSignedUrlGenerationHook {
  constructor(private readonly logger?: (message: string) => void) {}

  async execute(
    reference: DownloadReference,
    signedUrl: SignedUrlData,
    context: SignedUrlGenerationContext
  ): Promise<void> {
    const logMessage = `Signed URL generated: evidence=${reference.evidenceId}, case=${reference.caseId}, user=${context.requestedBy}, reason=${reference.downloadReason}, ip=${context.auditContext?.sourceIp || 'unknown'}`;

    if (this.logger) {
      this.logger(logMessage);
    }
    // In real implementation, would log to audit database
  }
}

/**
 * Validation hook implementation
 * Validates reference state before URL generation
 */
export class ValidationSignedUrlHook implements IPreSignedUrlGenerationHook {
  async execute(
    reference: DownloadReference,
    context: SignedUrlGenerationContext
  ): Promise<void> {
    // Verify reference is not expired
    const now = context.now || new Date();
    const expiresAt = new Date(reference.expiresAt);
    if (now >= expiresAt) {
      throw new Error('Cannot generate signed URL for expired reference');
    }

    // Verify access control
    if (!reference.accessControl) {
      throw new Error('Reference missing access control information');
    }

    // Verify tenant match
    if (!reference.accessControl.tenantId) {
      throw new Error('Reference missing tenant ID');
    }
  }
}

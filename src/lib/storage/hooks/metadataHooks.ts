/**
 * Metadata Hooks
 * Lifecycle hooks for processing metadata during evidence storage operations
 */

import { S3EvidenceMetadata, RetentionMetadata, LegalHoldMetadata, VersionMetadata } from '../metadata/metadataModels';

/**
 * Hook context passed to all metadata hooks
 */
export interface MetadataHookContext {
  /**
   * Current timestamp
   */
  now: Date;

  /**
   * Requestor user ID
   */
  requestedBy: string;

  /**
   * Organization ID (tenant)
   */
  organizationId: string;

  /**
   * Operation being performed
   */
  operation: 'upload' | 'update' | 'delete' | 'restore';
}

/**
 * Retention Metadata Hook
 * Enforces retention policies and prevents deletion of retained evidence
 */
export function applyRetentionMetadataHook(
  metadata: S3EvidenceMetadata,
  context: MetadataHookContext
): RetentionMetadata | undefined {
  // If no retention set, no hook action needed
  if (!metadata.retention) {
    return undefined;
  }

  const retention = metadata.retention;
  const expiresAtDate = new Date(retention.expiresAt);
  const isExpired = context.now >= expiresAtDate;

  // Prevent deletion operations on non-expired evidence
  if (context.operation === 'delete' && !isExpired) {
    throw new RetentionPolicyError(
      `Evidence cannot be deleted. Retention period active until ${retention.expiresAt}`
    );
  }

  // Update expiration if reaching end of retention period
  if (isExpired && context.operation === 'delete') {
    return {
      ...retention,
      deleteBlocked: false, // Allow deletion after expiration
    };
  }

  return retention;
}

/**
 * Legal Hold Compatibility Hook
 * Prevents deletion of evidence under legal hold and ensures compliance
 */
export function applyLegalHoldCompatibilityHook(
  metadata: S3EvidenceMetadata,
  context: MetadataHookContext
): LegalHoldMetadata | undefined {
  // If no legal hold or not active, no hook action needed
  if (!metadata.legalHold || metadata.legalHold.status === 'none') {
    return undefined;
  }

  const legalHold = metadata.legalHold;

  // Block deletion if legal hold is active
  if (legalHold.status === 'active' && context.operation === 'delete') {
    throw new LegalHoldError(
      `Evidence is under legal hold. Reason: ${legalHold.reason || 'Not specified'}. ` +
        `Contact: ${legalHold.appliedBy || 'System Administrator'}`
    );
  }

  // Block updates to legal hold status without proper authorization
  if (context.operation === 'update') {
    // In a real system, would check user permissions/roles
    // This is a placeholder for the compliance check
    if (legalHold.status === 'released') {
      return {
        ...legalHold,
        releasedAt: context.now.toISOString(),
        releasedBy: context.requestedBy,
      };
    }
  }

  // Ensure immutability indicator is set if legal hold is active
  if (legalHold.status === 'active' && !metadata.isImmutable) {
    metadata.isImmutable = true;
  }

  return legalHold;
}

/**
 * Version Metadata Hook
 * Manages version tracking and ensures version consistency
 */
export function applyVersionMetadataHook(
  metadata: S3EvidenceMetadata,
  context: MetadataHookContext,
  previousVersionToken?: string
): VersionMetadata | undefined {
  // If no version metadata, create default
  if (!metadata.version) {
    return {
      version: 1,
      token: generateVersionToken(),
      createdAt: context.now.toISOString(),
      createdBy: context.requestedBy,
      isCurrent: true,
    };
  }

  const version = metadata.version;

  // On update operation, increment version
  if (context.operation === 'update') {
    return {
      version: version.version + 1,
      token: generateVersionToken(),
      previousToken: version.token,
      createdAt: context.now.toISOString(),
      createdBy: context.requestedBy,
      reason: `Updated by ${context.requestedBy}`,
      isCurrent: true,
      fileHash: version.fileHash,
    };
  }

  // Ensure version token consistency
  if (!version.token) {
    version.token = generateVersionToken();
  }

  return version;
}

/**
 * Apply all metadata hooks in sequence
 * Returns modified metadata after all hooks are applied
 */
export function applyAllMetadataHooks(
  metadata: S3EvidenceMetadata,
  context: MetadataHookContext
): S3EvidenceMetadata {
  const processed = { ...metadata };

  try {
    // Apply retention hook
    const retention = applyRetentionMetadataHook(processed, context);
    if (retention) {
      processed.retention = retention;
    }

    // Apply legal hold hook
    const legalHold = applyLegalHoldCompatibilityHook(processed, context);
    if (legalHold) {
      processed.legalHold = legalHold;
    }

    // Apply version hook
    const version = applyVersionMetadataHook(processed, context);
    if (version) {
      processed.version = version;
    }

    return processed;
  } catch (error) {
    // Re-throw compliance errors
    if (error instanceof RetentionPolicyError || error instanceof LegalHoldError) {
      throw error;
    }

    // Wrap unexpected errors
    throw new MetadataHookError('Failed to apply metadata hooks', error);
  }
}

/**
 * Retention Policy Error
 * Thrown when retention policy prevents an operation
 */
export class RetentionPolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RetentionPolicyError';
  }
}

/**
 * Legal Hold Error
 * Thrown when legal hold prevents an operation
 */
export class LegalHoldError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LegalHoldError';
  }
}

/**
 * Metadata Hook Error
 * Thrown when hook processing fails
 */
export class MetadataHookError extends Error {
  constructor(message: string, public readonly cause?: any) {
    super(message);
    this.name = 'MetadataHookError';
  }
}

/**
 * Generate a unique version token
 * Used to track evidence versions in S3
 */
function generateVersionToken(): string {
  const now = Date.now();
  const hex = now.toString(16);
  return `v${hex}`;
}

/**
 * Validate metadata before hook application
 */
export function validateMetadataForHooks(metadata: S3EvidenceMetadata): void {
  if (!metadata.organizationId) {
    throw new Error('organizationId is required for metadata hook validation');
  }

  if (!metadata.caseId) {
    throw new Error('caseId is required for metadata hook validation');
  }

  if (!metadata.evidenceId) {
    throw new Error('evidenceId is required for metadata hook validation');
  }

  if (metadata.retention && metadata.retention.retentionDays <= 0) {
    throw new Error('retentionDays must be positive');
  }

  if (metadata.version && metadata.version.version < 1) {
    throw new Error('version number must be >= 1');
  }
}

/**
 * Download Reference Lookup Helper
 * Safe retrieval and validation of download references
 */

import { DownloadReference } from '../models/downloadReference';

/**
 * Lookup result for download reference
 */
export interface DownloadReferenceLookupResult<T = DownloadReference> {
  ok: boolean;
  reference?: T;
  error?: DownloadReferenceLookupError;
}

/**
 * Download reference lookup error
 */
export interface DownloadReferenceLookupError {
  code:
    | 'NOT_FOUND'
    | 'EXPIRED'
    | 'ACCESS_DENIED'
    | 'INVALID_FORMAT'
    | 'VALIDATION_FAILED';
  message: string;
  details?: Record<string, any>;
}

/**
 * Download Reference Lookup Helper
 * Provides safe lookup and validation of download references
 */
export class DownloadReferenceLookup {
  /**
   * Safe lookup by reference ID
   * Returns result object with ok flag or error
   */
  byReferenceId(
    referenceId: string,
    repository: Map<string, DownloadReference>
  ): DownloadReferenceLookupResult {
    if (!referenceId) {
      return {
        ok: false,
        error: {
          code: 'INVALID_FORMAT',
          message: 'Reference ID is required',
        },
      };
    }

    const reference = repository.get(referenceId);
    if (!reference) {
      return {
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: `Download reference not found: ${referenceId}`,
        },
      };
    }

    return {
      ok: true,
      reference,
    };
  }

  /**
   * Safe lookup with expiration check
   */
  byReferenceIdAndValidate(
    referenceId: string,
    repository: Map<string, DownloadReference>
  ): DownloadReferenceLookupResult {
    // First check existence
    const lookupResult = this.byReferenceId(referenceId, repository);
    if (!lookupResult.ok) {
      return lookupResult;
    }

    const reference = lookupResult.reference!;

    // Check expiration
    const now = new Date();
    const expiresAt = new Date(reference.expiresAt);
    if (now >= expiresAt) {
      return {
        ok: false,
        error: {
          code: 'EXPIRED',
          message: `Download reference expired at ${reference.expiresAt}`,
          details: {
            expiresAt: reference.expiresAt,
            now: now.toISOString(),
          },
        },
      };
    }

    return {
      ok: true,
      reference,
    };
  }

  /**
   * Lookup with access control verification
   */
  byReferenceIdWithAccessControl(
    referenceId: string,
    repository: Map<string, DownloadReference>,
    currentTenantId: string,
    userCaseIds: string[]
  ): DownloadReferenceLookupResult {
    // First validate and check expiration
    const validationResult = this.byReferenceIdAndValidate(referenceId, repository);
    if (!validationResult.ok) {
      return validationResult;
    }

    const reference = validationResult.reference!;

    // Verify tenant match
    if (reference.accessControl.tenantId !== currentTenantId) {
      return {
        ok: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'Access denied: tenant mismatch',
          details: {
            expectedTenant: currentTenantId,
            referenceTenant: reference.accessControl.tenantId,
          },
        },
      };
    }

    // Check case access based on scope
    if (reference.accessControl.accessScope === 'case') {
      const hasAccess = (reference.accessControl.caseIds || []).some((caseId) =>
        userCaseIds.includes(caseId)
      );

      if (!hasAccess) {
        return {
          ok: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'Access denied: no case access',
            details: {
              referenceCases: reference.accessControl.caseIds,
              userCases: userCaseIds,
            },
          },
        };
      }
    }

    // Global and organization scopes are allowed at this point

    return {
      ok: true,
      reference,
    };
  }

  /**
   * Lookup with strict error throwing
   * Throws on any error (strict mode)
   */
  requireByReferenceId(
    referenceId: string,
    repository: Map<string, DownloadReference>
  ): DownloadReference {
    const result = this.byReferenceIdAndValidate(referenceId, repository);
    if (!result.ok) {
      throw new DownloadReferenceLookupException(result.error!);
    }
    return result.reference!;
  }

  /**
   * Lookup with strict error throwing and access control
   */
  requireByReferenceIdWithAccessControl(
    referenceId: string,
    repository: Map<string, DownloadReference>,
    currentTenantId: string,
    userCaseIds: string[]
  ): DownloadReference {
    const result = this.byReferenceIdWithAccessControl(
      referenceId,
      repository,
      currentTenantId,
      userCaseIds
    );
    if (!result.ok) {
      throw new DownloadReferenceLookupException(result.error!);
    }
    return result.reference!;
  }

  /**
   * Find all references for an evidence ID
   */
  byEvidenceId(
    evidenceId: string,
    repository: Map<string, DownloadReference>
  ): DownloadReference[] {
    const results: DownloadReference[] = [];
    for (const [, reference] of repository) {
      if (reference.evidenceId === evidenceId) {
        results.push(reference);
      }
    }
    return results;
  }

  /**
   * Find all non-expired references for an evidence ID
   */
  byEvidenceIdAndValidate(
    evidenceId: string,
    repository: Map<string, DownloadReference>
  ): DownloadReference[] {
    const now = new Date();
    return this.byEvidenceId(evidenceId, repository).filter((ref) => {
      const expiresAt = new Date(ref.expiresAt);
      return now < expiresAt;
    });
  }

  /**
   * Find references by case ID
   */
  byCaseId(
    caseId: string,
    repository: Map<string, DownloadReference>
  ): DownloadReference[] {
    const results: DownloadReference[] = [];
    for (const [, reference] of repository) {
      if (reference.caseId === caseId) {
        results.push(reference);
      }
    }
    return results;
  }

  /**
   * Count active (non-expired) references
   */
  countActive(repository: Map<string, DownloadReference>): number {
    const now = new Date();
    let count = 0;
    for (const [, reference] of repository) {
      const expiresAt = new Date(reference.expiresAt);
      if (now < expiresAt) {
        count++;
      }
    }
    return count;
  }

  /**
   * Cleanup expired references
   */
  removeExpired(repository: Map<string, DownloadReference>): number {
    const now = new Date();
    let removed = 0;
    for (const [key, reference] of repository) {
      const expiresAt = new Date(reference.expiresAt);
      if (now >= expiresAt) {
        repository.delete(key);
        removed++;
      }
    }
    return removed;
  }
}

/**
 * Download Reference Lookup Exception
 * Thrown in strict mode when lookup fails
 */
export class DownloadReferenceLookupException extends Error {
  constructor(public readonly error: DownloadReferenceLookupError) {
    super(error.message);
    this.name = 'DownloadReferenceLookupException';
  }
}

/**
 * Singleton instance
 */
let lookupInstance: DownloadReferenceLookup | null = null;

/**
 * Get or create singleton lookup instance
 */
export function getDownloadReferenceLookup(): DownloadReferenceLookup {
  if (!lookupInstance) {
    lookupInstance = new DownloadReferenceLookup();
  }
  return lookupInstance;
}

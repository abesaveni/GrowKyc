import type { IObjectKeyBuilder } from '../interfaces/objectKeyBuilder';
import { sanitizeFilename } from '../utils/sanitizeFilename';
import { formatDateForKey, generateVersionToken } from '../utils/keyHelpers';

export interface EvidenceObjectKeyBuilderOptions {
  dateOverride?: Date;
  versionTokenOverride?: string;
}

/**
 * Builds S3 object keys for evidence storage using organization, case, date, and evidence type context.
 * Key pattern: org/{orgId}/cases/{caseId}/evidence/{evidenceType}/{date}/{version}-{filename}
 * or: org/{orgId}/evidence/{evidenceType}/{date}/{version}-{filename} (for org-level evidence)
 *
 * Keys are designed to be:
 * - Audit-friendly (sortable by date, organized by case)
 * - S3-compatible (no unsafe characters)
 * - Deterministic (same inputs produce same key prefixes)
 */
export class EvidenceObjectKeyBuilder implements IObjectKeyBuilder {
  constructor(private readonly options: EvidenceObjectKeyBuilderOptions = {}) {}

  buildUploadKey(params: {
    organizationId: string;
    caseId?: string;
    evidenceId: string;
    filename: string;
  }): string {
    const date = formatDateForKey(this.options.dateOverride);
    const version = this.options.versionTokenOverride ?? generateVersionToken();
    const safeFilename = sanitizeFilename(params.filename);

    const prefix = this.buildPrefixKey({
      organizationId: params.organizationId,
      caseId: params.caseId,
    });

    // Full key: prefix/evidenceId/{date}/{version}-{filename}
    return `${prefix}/${params.evidenceId}/${date}/${version}-${safeFilename}`;
  }

  buildPrefixKey(params: {
    organizationId: string;
    caseId?: string;
  }): string {
    const orgPrefix = `org/${params.organizationId}`;

    if (params.caseId) {
      return `${orgPrefix}/cases/${params.caseId}/evidence`;
    }

    return `${orgPrefix}/evidence`;
  }
}

import { supabase } from '../../../../../lib/auth';
import { IStorageProvider } from '../../interfaces';
import { StorageDownloadUrl, StorageObject, StorageUploadOptions } from '../../types';
import {
  blockDispositionWhenLegalHoldActive,
  buildDefaultRetentionMetadata,
  evaluateRetentionStatus,
} from '../../../../../lib/retention/retentionPolicy';

const SUPABASE_DOCS_BUCKET = 'make-b186a255-documents';

export class SupabaseStorageAdapter implements IStorageProvider {
  async createUploadTarget(options: StorageUploadOptions): Promise<StorageObject> {
    const key = [
      options.organizationId,
      options.clientId,
      options.runId,
      options.evidenceId,
      `${Date.now()}_${options.filename}`,
    ].join('/');

    const retentionMetadata = buildDefaultRetentionMetadata({
      entityType: 'document',
      retentionUntil: options.retentionUntil,
      retentionPolicyId: options.retentionPolicyId,
      retentionClassification: options.retentionClassification,
    });
    const retentionStatus = evaluateRetentionStatus({
      retentionUntil: retentionMetadata.retentionUntil,
      legalHold: options.legalHold,
    });
    const dispositionGuard = blockDispositionWhenLegalHoldActive({
      legalHold: options.legalHold,
      archiveEligible: options.archiveEligible ?? retentionStatus.archiveEligible,
      deleteEligible: options.deleteEligible ?? retentionStatus.deleteEligible,
    });

    return {
      key,
      bucket: SUPABASE_DOCS_BUCKET,
      uploadedAt: new Date().toISOString(),
      retentionUntil: retentionMetadata.retentionUntil,
      retentionPolicyId: retentionMetadata.retentionPolicyId,
      retentionClassification: retentionMetadata.retentionClassification,
      archiveEligible: dispositionGuard.archiveEligible,
      deleteEligible: dispositionGuard.deleteEligible,
      legalHold: Boolean(options.legalHold),
      legalHoldReason: options.legalHoldReason,
      legalHoldSetBy: options.legalHoldSetBy,
      legalHoldSetAt: options.legalHoldSetAt,
    };
  }

  async createDownloadUrl(params: {
    bucket?: string;
    key: string;
    expiresInSeconds?: number;
    organizationId?: string;
  }): Promise<StorageDownloadUrl> {
    if (params.organizationId && !params.key.startsWith(`${params.organizationId}/`)) {
      throw new Error('Cross-tenant evidence key access denied');
    }

    const expiresIn = params.expiresInSeconds || 900;
    const bucket = params.bucket || SUPABASE_DOCS_BUCKET;

    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(params.key, expiresIn);

    if (error || !data?.signedUrl) {
      throw error || new Error('Failed to create signed URL');
    }

    return {
      url: data.signedUrl,
      expiresAt: Date.now() + expiresIn * 1000,
    };
  }
}

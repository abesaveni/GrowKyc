import { IStorageProvider } from '../../interfaces';
import { StorageDownloadUrl, StorageObject, StorageUploadOptions } from '../../types';
import { AwsApiClient } from './awsApiClient';

interface UploadTargetResponse {
  key: string;
  bucket: string;
  versionId?: string;
  etag?: string;
  uploadedAt: string;
  retentionUntil?: string;
  retentionPolicyId?: string;
  retentionClassification?: 'compliance_record' | 'audit_record' | 'provider_record' | 'document_record';
  archiveEligible?: boolean;
  deleteEligible?: boolean;
  legalHold?: boolean;
  legalHoldReason?: string;
  legalHoldSetBy?: string;
  legalHoldSetAt?: string;
}

interface DownloadUrlResponse {
  url: string;
  expiresAt: number;
}

export class S3EvidenceAdapter implements IStorageProvider {
  constructor(private readonly client: AwsApiClient) {}

  async createUploadTarget(options: StorageUploadOptions): Promise<StorageObject> {
    const result = await this.client.post<UploadTargetResponse>('/api/evidence/upload-target', options);

    return {
      key: result.key,
      bucket: result.bucket,
      versionId: result.versionId,
      etag: result.etag,
      uploadedAt: result.uploadedAt,
      retentionUntil: result.retentionUntil,
      retentionPolicyId: result.retentionPolicyId,
      retentionClassification: result.retentionClassification,
      archiveEligible: result.archiveEligible,
      deleteEligible: result.deleteEligible,
      legalHold: result.legalHold,
      legalHoldReason: result.legalHoldReason,
      legalHoldSetBy: result.legalHoldSetBy,
      legalHoldSetAt: result.legalHoldSetAt,
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

    return this.client.post<DownloadUrlResponse>('/api/evidence/download-url', params);
  }
}

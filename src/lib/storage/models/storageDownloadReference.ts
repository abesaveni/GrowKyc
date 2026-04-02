export interface StorageDownloadReference {
  bucket: string;
  objectKey: string;
  presignedUrl: string;
  expiresAtUtc: string;
  versionId?: string;
}

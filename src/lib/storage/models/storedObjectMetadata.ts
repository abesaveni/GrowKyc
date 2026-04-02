export interface StoredObjectMetadata {
  bucket: string;
  objectKey: string;
  etag?: string;
  versionId?: string;
  contentType: string;
  contentLength: number;
  uploadedAtUtc: string;
  storageClass?: string;
  serverSideEncryption?: boolean;
  metadata?: Record<string, string>;
  tags?: Record<string, string>;
}

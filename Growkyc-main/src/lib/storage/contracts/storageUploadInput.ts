export interface StorageUploadInput {
  bucket: string;
  objectKey: string;
  contentType: string;
  contentLength: number;
  body: Buffer;
  organizationId?: string;
  metadata?: Record<string, string>;
  tags?: Record<string, string>;
  isImmutable?: boolean;
}

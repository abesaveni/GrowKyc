export interface S3StorageConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  kmsKeyId?: string;
  endpoint?: string;
}

export function loadS3ConfigFromEnv(): S3StorageConfig {
  const region = process.env.AWS_REGION ?? 'ap-southeast-2';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const kmsKeyId = process.env.AWS_KMS_KEY_ID;
  const endpoint = process.env.AWS_S3_ENDPOINT;

  return {
    region,
    accessKeyId: accessKeyId ?? '',
    secretAccessKey: secretAccessKey ?? '',
    bucketName: bucketName ?? '',
    kmsKeyId,
    endpoint,
  };
}

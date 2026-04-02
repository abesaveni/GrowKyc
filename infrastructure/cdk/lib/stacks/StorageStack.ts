import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { APP_NAME, ENV, EVIDENCE_RETENTION_YEARS } from '../config';

interface StorageStackProps extends cdk.StackProps {
  storageKmsKey: kms.Key;
}

export class StorageStack extends cdk.Stack {
  /** Primary evidence bucket — WORM, KMS-encrypted, versioned */
  public readonly evidenceBucket: s3.Bucket;

  /** S3 access log bucket (must not have Object Lock) */
  public readonly accessLogBucket: s3.Bucket;

  /** Staging bucket for pre-upload virus scanning (Phase 5) */
  public readonly stagingBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: StorageStackProps) {
    super(scope, id, props);

    const { storageKmsKey } = props;

    // -------------------------------------------------------
    // Access log bucket — stores S3 server access logs
    // No Object Lock on this bucket (it would break log delivery)
    // -------------------------------------------------------
    this.accessLogBucket = new s3.Bucket(this, 'AccessLogBucket', {
      bucketName: `growkyc-${ENV}-access-logs-${this.account}`,
      encryption: s3.BucketEncryption.S3_MANAGED, // AES-256, no CMK required for log bucket
      versioned: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      lifecycleRules: [
        {
          id: 'expire-old-access-logs',
          expiration: cdk.Duration.days(90),
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // -------------------------------------------------------
    // Staging bucket — virus scan quarantine area (pre-evidence)
    // Files move to evidence bucket only after scan passes
    // -------------------------------------------------------
    this.stagingBucket = new s3.Bucket(this, 'StagingBucket', {
      bucketName: `growkyc-${ENV}-staging-${this.account}`,
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: storageKmsKey,
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      serverAccessLogsBucket: this.accessLogBucket,
      serverAccessLogsPrefix: 'staging/',
      lifecycleRules: [
        {
          // Auto-delete staging objects after 24h (virus scan should complete)
          id: 'expire-staging-objects',
          expiration: cdk.Duration.days(1),
          noncurrentVersionExpiration: cdk.Duration.days(1),
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // -------------------------------------------------------
    // Evidence bucket — S3 Object Lock WORM (Compliance mode)
    // AUSTRAC AML/CTF Act 2006 s.114: 7-year retention minimum
    //
    // Key design:
    //   Key structure: {orgId}/{clientId}/{runId}/{evidenceId}/{filename}
    //   Encryption:    SSE-KMS with CMK
    //   Versioning:    Required by Object Lock
    //   Object Lock:   Compliance mode (even admins cannot delete)
    //   Retention:     7 years (EVIDENCE_RETENTION_YEARS)
    // -------------------------------------------------------
    this.evidenceBucket = new s3.Bucket(this, 'EvidenceBucket', {
      bucketName: `growkyc-${ENV}-evidence-${this.account}`,
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: storageKmsKey,
      bucketKeyEnabled: true, // Reduces KMS API calls cost
      versioned: true, // Required for Object Lock
      objectLockEnabled: true,
      objectLockDefaultRetention: {
        mode: s3.ObjectLockMode.COMPLIANCE,
        duration: cdk.Duration.days(EVIDENCE_RETENTION_YEARS * 365),
      },
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      serverAccessLogsBucket: this.accessLogBucket,
      serverAccessLogsPrefix: 'evidence/',
      cors: [
        {
          // CORS only for presigned URL uploads from the SPA
          allowedMethods: [s3.HttpMethods.PUT],
          allowedOrigins: [
            `https://*.growkyc.com.au`,
            `https://app.growkyc.com.au`,
          ],
          allowedHeaders: ['*'],
          maxAge: 3600,
        },
      ],
      lifecycleRules: [
        {
          id: 'transition-to-glacier-after-90-days',
          transitions: [
            {
              storageClass: s3.StorageClass.GLACIER_INSTANT_RETRIEVAL,
              transitionAfter: cdk.Duration.days(90),
            },
            {
              storageClass: s3.StorageClass.DEEP_ARCHIVE,
              transitionAfter: cdk.Duration.days(365),
            },
          ],
        },
        {
          id: 'expire-temp-upload-markers',
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(1),
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // -------------------------------------------------------
    // Bucket Policy — deny non-TLS, deny non-KMS uploads
    // -------------------------------------------------------
    this.evidenceBucket.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'DenyNonSecureTransport',
      effect: iam.Effect.DENY,
      principals: [new iam.AnyPrincipal()],
      actions: ['s3:*'],
      resources: [
        this.evidenceBucket.bucketArn,
        `${this.evidenceBucket.bucketArn}/*`,
      ],
      conditions: {
        Bool: { 'aws:SecureTransport': 'false' },
      },
    }));

    this.evidenceBucket.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'DenyUnencryptedObjectUploads',
      effect: iam.Effect.DENY,
      principals: [new iam.AnyPrincipal()],
      actions: ['s3:PutObject'],
      resources: [`${this.evidenceBucket.bucketArn}/*`],
      conditions: {
        StringNotEquals: {
          's3:x-amz-server-side-encryption': 'aws:kms',
        },
      },
    }));

    this.evidenceBucket.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'DenyWrongKmsKey',
      effect: iam.Effect.DENY,
      principals: [new iam.AnyPrincipal()],
      actions: ['s3:PutObject'],
      resources: [`${this.evidenceBucket.bucketArn}/*`],
      conditions: {
        StringNotEquals: {
          's3:x-amz-server-side-encryption-aws-kms-key-id': storageKmsKey.keyArn,
        },
      },
    }));

    // -------------------------------------------------------
    // Outputs
    // -------------------------------------------------------
    new cdk.CfnOutput(this, 'EvidenceBucketName', {
      value: this.evidenceBucket.bucketName,
      exportName: `${id}-EvidenceBucketName`,
    });
    new cdk.CfnOutput(this, 'EvidenceBucketArn', {
      value: this.evidenceBucket.bucketArn,
      exportName: `${id}-EvidenceBucketArn`,
    });
    new cdk.CfnOutput(this, 'StagingBucketName', {
      value: this.stagingBucket.bucketName,
      exportName: `${id}-StagingBucketName`,
    });
    new cdk.CfnOutput(this, 'StorageKeyId', {
      value: storageKmsKey.keyId,
      exportName: `${id}-StorageKeyId`,
    });
  }
}

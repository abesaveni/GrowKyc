import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { APP_NAME, ENV } from '../config';

export class KmsStack extends cdk.Stack {
  /** CMK for Aurora PostgreSQL storage encryption */
  public readonly databaseKey: kms.Key;

  /** CMK for S3 evidence bucket */
  public readonly storageKey: kms.Key;

  /** CMK for CloudTrail log file encryption */
  public readonly cloudTrailKey: kms.Key;

  /** CMK for Secrets Manager secrets */
  public readonly secretsKey: kms.Key;

  /** CMK for Cognito User Pool token signing */
  public readonly authKey: kms.Key;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // -------------------------------------------------------
    // Database key — Aurora PostgreSQL storage
    // -------------------------------------------------------
    this.databaseKey = new kms.Key(this, 'DatabaseKey', {
      alias: `alias/${APP_NAME}-${ENV}-database`,
      description: `GrowKYC ${ENV} — Aurora PostgreSQL storage encryption`,
      enableKeyRotation: true, // Annual automatic rotation
      keySpec: kms.KeySpec.SYMMETRIC_DEFAULT,
      keyUsage: kms.KeyUsage.ENCRYPT_DECRYPT,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pendingWindow: cdk.Duration.days(30),
    });

    // RDS service principal needs Encrypt/Decrypt/GenerateDataKey/Describe
    this.databaseKey.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'AllowRdsService',
      principals: [new iam.ServicePrincipal(`rds.${this.region}.amazonaws.com`)],
      actions: [
        'kms:Encrypt',
        'kms:Decrypt',
        'kms:ReEncrypt*',
        'kms:GenerateDataKey*',
        'kms:CreateGrant',
        'kms:DescribeKey',
      ],
      resources: ['*'],
      conditions: {
        StringEquals: {
          'kms:CallerAccount': this.account,
          'aws:SourceAccount': this.account,
        },
      },
    }));

    // -------------------------------------------------------
    // Storage key — S3 evidence bucket (WORM)
    // -------------------------------------------------------
    this.storageKey = new kms.Key(this, 'StorageKey', {
      alias: `alias/${APP_NAME}-${ENV}-storage`,
      description: `GrowKYC ${ENV} — S3 evidence bucket encryption`,
      enableKeyRotation: true,
      keySpec: kms.KeySpec.SYMMETRIC_DEFAULT,
      keyUsage: kms.KeyUsage.ENCRYPT_DECRYPT,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pendingWindow: cdk.Duration.days(30),
    });

    this.storageKey.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'AllowS3Service',
      principals: [new iam.ServicePrincipal('s3.amazonaws.com')],
      actions: ['kms:GenerateDataKey*', 'kms:Decrypt'],
      resources: ['*'],
      conditions: {
        StringEquals: { 'kms:CallerAccount': this.account },
      },
    }));

    // -------------------------------------------------------
    // CloudTrail key — trail log file encryption
    // -------------------------------------------------------
    this.cloudTrailKey = new kms.Key(this, 'CloudTrailKey', {
      alias: `alias/${APP_NAME}-${ENV}-cloudtrail`,
      description: `GrowKYC ${ENV} — CloudTrail log encryption`,
      enableKeyRotation: true,
      keySpec: kms.KeySpec.SYMMETRIC_DEFAULT,
      keyUsage: kms.KeyUsage.ENCRYPT_DECRYPT,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pendingWindow: cdk.Duration.days(30),
    });

    // CloudTrail requires specific key policy for log delivery
    this.cloudTrailKey.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'AllowCloudTrailEncrypt',
      principals: [new iam.ServicePrincipal('cloudtrail.amazonaws.com')],
      actions: ['kms:GenerateDataKey*'],
      resources: ['*'],
      conditions: {
        StringLike: {
          'kms:EncryptionContext:aws:cloudtrail:arn': `arn:aws:cloudtrail:*:${this.account}:trail/*`,
        },
      },
    }));

    this.cloudTrailKey.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'AllowCloudTrailDescribeKey',
      principals: [new iam.ServicePrincipal('cloudtrail.amazonaws.com')],
      actions: ['kms:DescribeKey'],
      resources: ['*'],
    }));

    // -------------------------------------------------------
    // Secrets key — Secrets Manager
    // -------------------------------------------------------
    this.secretsKey = new kms.Key(this, 'SecretsKey', {
      alias: `alias/${APP_NAME}-${ENV}-secrets`,
      description: `GrowKYC ${ENV} — Secrets Manager encryption`,
      enableKeyRotation: true,
      keySpec: kms.KeySpec.SYMMETRIC_DEFAULT,
      keyUsage: kms.KeyUsage.ENCRYPT_DECRYPT,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pendingWindow: cdk.Duration.days(30),
    });

    this.secretsKey.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'AllowSecretsManagerService',
      principals: [new iam.ServicePrincipal('secretsmanager.amazonaws.com')],
      actions: [
        'kms:Encrypt',
        'kms:Decrypt',
        'kms:ReEncrypt*',
        'kms:GenerateDataKey*',
        'kms:CreateGrant',
        'kms:DescribeKey',
      ],
      resources: ['*'],
      conditions: {
        StringEquals: { 'kms:CallerAccount': this.account },
      },
    }));

    // -------------------------------------------------------
    // Auth key — Cognito custom signing key placeholder
    // (Cognito manages its own signing; this key is for
    //  any app-level token signing or Cognito triggers)
    // -------------------------------------------------------
    this.authKey = new kms.Key(this, 'AuthKey', {
      alias: `alias/${APP_NAME}-${ENV}-auth`,
      description: `GrowKYC ${ENV} — Cognito / auth token encryption`,
      enableKeyRotation: true,
      keySpec: kms.KeySpec.SYMMETRIC_DEFAULT,
      keyUsage: kms.KeyUsage.ENCRYPT_DECRYPT,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pendingWindow: cdk.Duration.days(30),
    });

    // -------------------------------------------------------
    // Outputs
    // -------------------------------------------------------
    new cdk.CfnOutput(this, 'DatabaseKeyArn', { value: this.databaseKey.keyArn, exportName: `${id}-DatabaseKeyArn` });
    new cdk.CfnOutput(this, 'StorageKeyArn', { value: this.storageKey.keyArn, exportName: `${id}-StorageKeyArn` });
    new cdk.CfnOutput(this, 'CloudTrailKeyArn', { value: this.cloudTrailKey.keyArn, exportName: `${id}-CloudTrailKeyArn` });
    new cdk.CfnOutput(this, 'SecretsKeyArn', { value: this.secretsKey.keyArn, exportName: `${id}-SecretsKeyArn` });
  }
}

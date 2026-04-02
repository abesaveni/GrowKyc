import * as cdk from 'aws-cdk-lib';
import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as guardduty from 'aws-cdk-lib/aws-guardduty';
import * as securityhub from 'aws-cdk-lib/aws-securityhub';
import * as config from 'aws-cdk-lib/aws-config';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Construct } from 'constructs';
import { APP_NAME, ENV, AUDIT_LOG_RETENTION_DAYS } from '../config';

interface SecurityStackProps extends cdk.StackProps {
  trailKmsKey: kms.Key;
  /** Optional: if provided, CloudTrail logs land here. Stack creates one if undefined. */
  logBucket?: s3.Bucket;
}

export class SecurityStack extends cdk.Stack {
  public readonly trailBucket: s3.Bucket;
  public readonly securityAlertTopic: sns.Topic;

  constructor(scope: Construct, id: string, props: SecurityStackProps) {
    super(scope, id, props);

    const { trailKmsKey } = props;

    // -------------------------------------------------------
    // Security Alert SNS Topic
    // -------------------------------------------------------
    this.securityAlertTopic = new sns.Topic(this, 'SecurityAlerts', {
      topicName: `growkyc-${ENV}-security-alerts`,
      displayName: 'GrowKYC Security Alerts',
      masterKey: trailKmsKey,
    });

    // Add security team email (update in production)
    const alertEmail = process.env.SECURITY_ALERT_EMAIL;
    if (alertEmail) {
      this.securityAlertTopic.addSubscription(
        new subscriptions.EmailSubscription(alertEmail),
      );
    }

    // -------------------------------------------------------
    // CloudTrail bucket — stores all trail log files
    // -------------------------------------------------------
    this.trailBucket = props.logBucket ?? new s3.Bucket(this, 'TrailBucket', {
      bucketName: `growkyc-${ENV}-cloudtrail-${this.account}`,
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: trailKmsKey,
      bucketKeyEnabled: true,
      versioned: true,
      objectLockEnabled: true,
      objectLockDefaultRetention: {
        mode: s3.ObjectLockMode.COMPLIANCE,
        duration: cdk.Duration.days(365 * 7),
      },
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      lifecycleRules: [
        {
          id: 'transition-trail-to-glacier',
          transitions: [
            {
              storageClass: s3.StorageClass.GLACIER_INSTANT_RETRIEVAL,
              transitionAfter: cdk.Duration.days(90),
            },
          ],
          // Retain trail logs for 7 years minimum
          expiration: cdk.Duration.days(365 * 7),
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // CloudTrail service needs to write to the bucket
    this.trailBucket.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'AWSCloudTrailAclCheck',
      principals: [new iam.ServicePrincipal('cloudtrail.amazonaws.com')],
      actions: ['s3:GetBucketAcl'],
      resources: [this.trailBucket.bucketArn],
    }));

    this.trailBucket.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'AWSCloudTrailWrite',
      principals: [new iam.ServicePrincipal('cloudtrail.amazonaws.com')],
      actions: ['s3:PutObject'],
      resources: [`${this.trailBucket.bucketArn}/AWSLogs/${this.account}/*`],
      conditions: {
        StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' },
      },
    }));

    // -------------------------------------------------------
    // CloudWatch Log Group for CloudTrail
    // -------------------------------------------------------
    const trailLogGroup = new logs.LogGroup(this, 'TrailLogGroup', {
      logGroupName: `/growkyc/${ENV}/cloudtrail`,
      retention: AUDIT_LOG_RETENTION_DAYS,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const trailLogRole = new iam.Role(this, 'TrailLogRole', {
      roleName: `growkyc-${ENV}-cloudtrail-cw-role`,
      assumedBy: new iam.ServicePrincipal('cloudtrail.amazonaws.com'),
    });

    trailLogRole.addToPolicy(new iam.PolicyStatement({
      actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: [`${trailLogGroup.logGroupArn}:*`],
    }));

    // -------------------------------------------------------
    // CloudTrail — ap-southeast-2 region trail
    // Records all management + S3 data events for evidence bucket
    // -------------------------------------------------------
    const trail = new cloudtrail.Trail(this, 'Trail', {
      trailName: `growkyc-${ENV}-trail`,
      bucket: this.trailBucket,
      encryptionKey: trailKmsKey,
      includeGlobalServiceEvents: true,
      isMultiRegionTrail: false, // Sydney-only (ap-southeast-2 data sovereignty)
      enableFileValidation: true, // Log file integrity validation (tamper detection)
      cloudWatchLogGroup: trailLogGroup,
      cloudWatchLogsRetention: AUDIT_LOG_RETENTION_DAYS,
      sendToCloudWatchLogs: true,
      managementEvents: cloudtrail.ReadWriteType.ALL,
    });

    // Also record S3 data events on the evidence bucket (Phase 4 activates this)
    // trail.addS3EventSelector([{ bucket: evidenceBucket }], { readWriteType: cloudtrail.ReadWriteType.ALL });

    // -------------------------------------------------------
    // GuardDuty — ML-based threat detection
    // -------------------------------------------------------
    new guardduty.CfnDetector(this, 'GuardDutyDetector', {
      enable: true,
      findingPublishingFrequency: 'FIFTEEN_MINUTES',
      dataSources: {
        s3Logs: { enable: true },
        malwareProtection: {
          scanEc2InstanceWithFindings: { ebsVolumes: true },
        },
        kubernetesAuditLogs: { enable: false }, // No K8s in this architecture
        rdsLoginEvents: { enable: true }, // Critical: detect RDS brute-force
      },
    });

    // -------------------------------------------------------
    // Security Hub — aggregates findings from GuardDuty + Config
    // -------------------------------------------------------
    new securityhub.CfnHub(this, 'SecurityHub', {
      autoEnableControls: true,
      enableDefaultStandards: true, // Enables CIS AWS Foundations + FSBP
    });

    // -------------------------------------------------------
    // AWS Config — compliance rules
    // -------------------------------------------------------
    const configRole = new iam.Role(this, 'ConfigRole', {
      roleName: `growkyc-${ENV}-config-role`,
      assumedBy: new iam.ServicePrincipal('config.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWS_ConfigRole'),
      ],
    });

    const configBucket = new s3.Bucket(this, 'ConfigBucket', {
      bucketName: `growkyc-${ENV}-config-${this.account}`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      lifecycleRules: [{ expiration: cdk.Duration.days(365 * 2) }],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    new config.CfnConfigurationRecorder(this, 'ConfigRecorder', {
      roleArn: configRole.roleArn,
      recordingGroup: {
        allSupported: true,
        includeGlobalResourceTypes: true,
      },
    });

    new config.CfnDeliveryChannel(this, 'ConfigDeliveryChannel', {
      s3BucketName: configBucket.bucketName,
      configSnapshotDeliveryProperties: {
        deliveryFrequency: 'TwentyFour_Hours',
      },
    });

    // Managed Config rules aligned to AUSTRAC / ISO 27001
    const managedRules: Array<{ name: string; id: string; inputParams?: Record<string, string> }> = [
      { name: 'RdsStorageEncrypted', id: 'rds-storage-encrypted' },
      { name: 'S3BucketSslRequestsOnly', id: 's3-bucket-ssl-requests-only' },
      { name: 'S3BucketServerSideEncryptionEnabled', id: 's3-bucket-server-side-encryption-enabled' },
      { name: 'CloudtrailEnabled', id: 'cloud-trail-enabled' },
      { name: 'CloudtrailLogFileValidationEnabled', id: 'cloud-trail-log-file-validation-enabled' },
      { name: 'CloudtrailEncryptionEnabled', id: 'cloudtrail-kms-key-arn-provided' },
      { name: 'KmsKeyRotationEnabled', id: 'cmk-backing-key-rotation-enabled' },
      { name: 'IamRootAccessKeyCheck', id: 'iam-root-access-key-check' },
      { name: 'MfaEnabledForIamConsoleAccess', id: 'mfa-enabled-for-iam-console-access' },
      { name: 'RdsMultiAzSupport', id: 'rds-multi-az-support' },
      { name: 'GuarddutyNonArchivedFindings', id: 'guardduty-non-archived-findings',
        inputParams: { daysHighSev: '1', daysMediumSev: '7', daysLowSev: '30' } },
      { name: 'SecurityHubEnabled', id: 'securityhub-enabled' },
      { name: 'VpcFlowLogsEnabled', id: 'vpc-flow-logs-enabled' },
    ];

    for (const rule of managedRules) {
      new config.ManagedRule(this, `ConfigRule${rule.name}`, {
        identifier: rule.id,
        inputParameters: rule.inputParams,
        configRuleName: `growkyc-${ENV}-${rule.id}`,
      });
    }

    // -------------------------------------------------------
    // CloudWatch metric filters + alarms for CloudTrail events
    // -------------------------------------------------------
    const rootLoginFilter = new logs.MetricFilter(this, 'RootLoginFilter', {
      logGroup: trailLogGroup,
      filterPattern: logs.FilterPattern.literal('{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }'),
      metricNamespace: `GrowKYC/${ENV}/Security`,
      metricName: 'RootAccountUsage',
      metricValue: '1',
    });

    const rootLoginAlarm = new cloudwatch.Alarm(this, 'RootLoginAlarm', {
      alarmName: `growkyc-${ENV}-root-account-usage`,
      alarmDescription: 'Root account activity detected — investigate immediately',
      metric: rootLoginFilter.metric({ period: cdk.Duration.minutes(5) }),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    rootLoginAlarm.addAlarmAction(new actions.SnsAction(this.securityAlertTopic));

    const failedLoginFilter = new logs.MetricFilter(this, 'FailedLoginFilter', {
      logGroup: trailLogGroup,
      filterPattern: logs.FilterPattern.literal('{ ($.eventName = ConsoleLogin) && ($.errorMessage = "Failed authentication") }'),
      metricNamespace: `GrowKYC/${ENV}/Security`,
      metricName: 'ConsoleLoginFailures',
      metricValue: '1',
    });

    const failedLoginAlarm = new cloudwatch.Alarm(this, 'FailedLoginAlarm', {
      alarmName: `growkyc-${ENV}-console-login-failures`,
      alarmDescription: 'Multiple console login failures — possible brute force',
      metric: failedLoginFilter.metric({ period: cdk.Duration.minutes(5) }),
      threshold: 3,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    failedLoginAlarm.addAlarmAction(new actions.SnsAction(this.securityAlertTopic));

    // -------------------------------------------------------
    // Outputs
    // -------------------------------------------------------
    new cdk.CfnOutput(this, 'TrailBucketName', { value: this.trailBucket.bucketName });
    new cdk.CfnOutput(this, 'SecurityAlertTopicArn', { value: this.securityAlertTopic.topicArn, exportName: `${id}-SecurityAlertTopicArn` });
  }
}

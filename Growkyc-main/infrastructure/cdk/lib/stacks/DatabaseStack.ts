import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { APP_NAME, AURORA_CAPACITY, ENV, AUDIT_LOG_RETENTION_DAYS } from '../config';

interface DatabaseStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  dbSecurityGroup: ec2.SecurityGroup;
  dbKmsKey: kms.Key;
}

export class DatabaseStack extends cdk.Stack {
  public readonly cluster: rds.DatabaseCluster;
  public readonly credentialSecretArn: string;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    const { vpc, dbSecurityGroup, dbKmsKey } = props;
    const capacity = AURORA_CAPACITY[ENV];

    // -------------------------------------------------------
    // Parameter group — enforce SSL, audit logging
    // -------------------------------------------------------
    const paramGroup = new rds.ParameterGroup(this, 'ParamGroup', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_15_4,
      }),
      description: `GrowKYC ${ENV} Aurora PostgreSQL parameter group`,
      parameters: {
        // Enforce SSL connections
        'rds.force_ssl': '1',
        // Log all connections and disconnections for audit
        'log_connections': '1',
        'log_disconnections': '1',
        // Log duration of statements taking longer than 1000ms
        'log_min_duration_statement': '1000',
        // Log all DDL statements
        'log_statement': 'ddl',
        // Enable pgaudit for comprehensive audit logging
        'shared_preload_libraries': 'pgaudit,pg_stat_statements',
        'pgaudit.log': 'all',
        'pgaudit.log_catalog': '1',
        'pgaudit.log_parameter': '1',
        // Connection pooling guidance
        'max_connections': '200',
        // Timezone: Sydney (AEST/AEDT)
        'timezone': 'Australia/Sydney',
      },
    });

    // -------------------------------------------------------
    // Aurora Serverless v2 — PostgreSQL 15
    // Writer (ap-southeast-2a) + Reader (ap-southeast-2b)
    // Automatic failover within 30 seconds
    // -------------------------------------------------------
    this.cluster = new rds.DatabaseCluster(this, 'AuroraCluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_15_4,
      }),
      writer: rds.ClusterInstance.serverlessV2('writer', {
        scaleWithWriter: true,
        autoMinorVersionUpgrade: true,
        enablePerformanceInsights: true,
        performanceInsightRetention: rds.PerformanceInsightRetention.DEFAULT, // 7 days
        parameterGroup: paramGroup,
      }),
      readers: [
        rds.ClusterInstance.serverlessV2('reader-1', {
          scaleWithWriter: true,
          autoMinorVersionUpgrade: true,
          enablePerformanceInsights: true,
          performanceInsightRetention: rds.PerformanceInsightRetention.DEFAULT,
          parameterGroup: paramGroup,
        }),
      ],
      serverlessV2MinCapacity: capacity.min,
      serverlessV2MaxCapacity: capacity.max,
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [dbSecurityGroup],
      credentials: rds.Credentials.fromGeneratedSecret('growkyc_admin', {
        secretName: `/growkyc/${ENV}/db-credentials`,
        excludeCharacters: '"@/\\ \'',
      }),
      storageEncrypted: true,
      storageEncryptionKey: dbKmsKey,
      backup: {
        // 35-day backup window is maximum (AUSTRAC-aligned)
        retention: cdk.Duration.days(35),
        preferredWindow: '17:00-18:00', // 03:00-04:00 AEST
      },
      preferredMaintenanceWindow: 'Sun:18:00-Sun:19:00', // 04:00-05:00 AEST Sunday
      deletionProtection: true,
      clusterIdentifier: `growkyc-${ENV}`,
      defaultDatabaseName: 'growkyc',
      iamAuthentication: true, // Lambda can use IAM auth (no password in code)
      monitoringInterval: cdk.Duration.seconds(60), // Enhanced Monitoring
      cloudwatchLogsExports: ['postgresql'],
      cloudwatchLogsRetention: AUDIT_LOG_RETENTION_DAYS,
      copyTagsToSnapshot: true,
    });

    this.credentialSecretArn = this.cluster.secret?.secretArn ?? '';

    // -------------------------------------------------------
    // CloudWatch log group for PostgreSQL logs
    // -------------------------------------------------------
    new logs.LogGroup(this, 'AuroraLogGroup', {
      logGroupName: `/aws/rds/cluster/growkyc-${ENV}/postgresql`,
      retention: AUDIT_LOG_RETENTION_DAYS,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // -------------------------------------------------------
    // Outputs
    // -------------------------------------------------------
    new cdk.CfnOutput(this, 'ClusterEndpoint', {
      value: this.cluster.clusterEndpoint.socketAddress,
      exportName: `${id}-ClusterEndpoint`,
    });
    new cdk.CfnOutput(this, 'ClusterReaderEndpoint', {
      value: this.cluster.clusterReadEndpoint.socketAddress,
      exportName: `${id}-ClusterReaderEndpoint`,
    });
    new cdk.CfnOutput(this, 'ClusterIdentifier', {
      value: this.cluster.clusterIdentifier,
      exportName: `${id}-ClusterIdentifier`,
    });
    if (this.credentialSecretArn) {
      new cdk.CfnOutput(this, 'CredentialSecretArn', {
        value: this.credentialSecretArn,
        exportName: `${id}-CredentialSecretArn`,
      });
    }
  }
}

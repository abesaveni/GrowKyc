import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';
import { APP_NAME, AUDIT_LOG_RETENTION_DAYS, ENV } from '../config';

interface MonitoringStackProps extends cdk.StackProps {
  auroraCluster: rds.DatabaseCluster;
  evidenceBucket: s3.Bucket;
  userPoolId: string;
}

export class MonitoringStack extends cdk.Stack {
  public readonly alertTopic: sns.Topic;

  constructor(scope: Construct, id: string, props: MonitoringStackProps) {
    super(scope, id, props);

    const { auroraCluster, evidenceBucket, userPoolId } = props;

    // -------------------------------------------------------
    // Operations Alert Topic
    // -------------------------------------------------------
    this.alertTopic = new sns.Topic(this, 'OpsAlerts', {
      topicName: `growkyc-${ENV}-ops-alerts`,
      displayName: 'GrowKYC Operations Alerts',
    });

    const opsEmail = process.env.OPS_ALERT_EMAIL;
    if (opsEmail) {
      this.alertTopic.addSubscription(new subscriptions.EmailSubscription(opsEmail));
    }

    // -------------------------------------------------------
    // CloudWatch Log Groups (application-level)
    // -------------------------------------------------------
    const appLogGroup = new logs.LogGroup(this, 'AppLogGroup', {
      logGroupName: `/growkyc/${ENV}/app`,
      retention: AUDIT_LOG_RETENTION_DAYS,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const apiLogGroup = new logs.LogGroup(this, 'ApiLogGroup', {
      logGroupName: `/growkyc/${ENV}/api-gateway`,
      retention: 90,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const auditLogGroup = new logs.LogGroup(this, 'AuditLogGroup', {
      logGroupName: `/growkyc/${ENV}/audit`,
      retention: AUDIT_LOG_RETENTION_DAYS,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const lambdaLogGroup = new logs.LogGroup(this, 'LambdaLogGroup', {
      logGroupName: `/growkyc/${ENV}/lambda`,
      retention: 90,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // -------------------------------------------------------
    // Aurora PostgreSQL Alarms
    // -------------------------------------------------------
    const dbConnectionsAlarm = new cloudwatch.Alarm(this, 'DbConnectionsAlarm', {
      alarmName: `growkyc-${ENV}-db-connections-high`,
      alarmDescription: 'Aurora connection count approaching limit',
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: 'DatabaseConnections',
        dimensionsMap: { DBClusterIdentifier: auroraCluster.clusterIdentifier },
        period: cdk.Duration.minutes(5),
        statistic: 'Average',
      }),
      threshold: 150, // Alert at 75% of max_connections=200
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    dbConnectionsAlarm.addAlarmAction(new actions.SnsAction(this.alertTopic));

    const dbCpuAlarm = new cloudwatch.Alarm(this, 'DbCpuAlarm', {
      alarmName: `growkyc-${ENV}-db-cpu-high`,
      alarmDescription: 'Aurora CPU utilisation is high',
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: 'CPUUtilization',
        dimensionsMap: { DBClusterIdentifier: auroraCluster.clusterIdentifier },
        period: cdk.Duration.minutes(5),
        statistic: 'Average',
      }),
      threshold: 80,
      evaluationPeriods: 3,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    dbCpuAlarm.addAlarmAction(new actions.SnsAction(this.alertTopic));

    const dbAcuAlarm = new cloudwatch.Alarm(this, 'DbAcuAlarm', {
      alarmName: `growkyc-${ENV}-db-acu-high`,
      alarmDescription: 'Aurora Serverless v2 approaching max ACU capacity',
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: 'ServerlessDatabaseCapacity',
        dimensionsMap: { DBClusterIdentifier: auroraCluster.clusterIdentifier },
        period: cdk.Duration.minutes(5),
        statistic: 'Average',
      }),
      threshold: 55, // Alert at 85% of default max=64
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    dbAcuAlarm.addAlarmAction(new actions.SnsAction(this.alertTopic));

    // -------------------------------------------------------
    // Application metric filters — suspicious activity
    // -------------------------------------------------------
    const failedAuthFilter = new logs.MetricFilter(this, 'FailedAuthFilter', {
      logGroup: appLogGroup,
      filterPattern: logs.FilterPattern.literal('[timestamp, requestId, level="ERROR", message="AUTH_FAILURE*"]'),
      metricNamespace: `GrowKYC/${ENV}/Auth`,
      metricName: 'AuthFailures',
      metricValue: '1',
    });

    new cloudwatch.Alarm(this, 'FailedAuthAlarm', {
      alarmName: `growkyc-${ENV}-auth-failures`,
      alarmDescription: 'Elevated authentication failures — possible credential stuffing',
      metric: failedAuthFilter.metric({ period: cdk.Duration.minutes(5) }),
      threshold: 10,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    }).addAlarmAction(new actions.SnsAction(this.alertTopic));

    const botRunErrorFilter = new logs.MetricFilter(this, 'BotRunErrorFilter', {
      logGroup: appLogGroup,
      filterPattern: logs.FilterPattern.literal('[timestamp, requestId, level="ERROR", message="BOT_RUN_FAILED*"]'),
      metricNamespace: `GrowKYC/${ENV}/Bots`,
      metricName: 'BotRunErrors',
      metricValue: '1',
    });

    new cloudwatch.Alarm(this, 'BotRunErrorAlarm', {
      alarmName: `growkyc-${ENV}-bot-run-errors`,
      alarmDescription: 'KYC/AML bot runs are failing at elevated rate',
      metric: botRunErrorFilter.metric({ period: cdk.Duration.minutes(15) }),
      threshold: 5,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    }).addAlarmAction(new actions.SnsAction(this.alertTopic));

    // -------------------------------------------------------
    // CloudWatch Dashboard
    // -------------------------------------------------------
    const dashboard = new cloudwatch.Dashboard(this, 'Dashboard', {
      dashboardName: `GrowKYC-${ENV}`,
    });

    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'Aurora — Connections & CPU',
        width: 12,
        left: [
          new cloudwatch.Metric({
            namespace: 'AWS/RDS',
            metricName: 'DatabaseConnections',
            dimensionsMap: { DBClusterIdentifier: auroraCluster.clusterIdentifier },
            period: cdk.Duration.minutes(5),
            statistic: 'Average',
            label: 'Connections',
          }),
        ],
        right: [
          new cloudwatch.Metric({
            namespace: 'AWS/RDS',
            metricName: 'CPUUtilization',
            dimensionsMap: { DBClusterIdentifier: auroraCluster.clusterIdentifier },
            period: cdk.Duration.minutes(5),
            statistic: 'Average',
            label: 'CPU %',
          }),
        ],
      }),
      new cloudwatch.GraphWidget({
        title: 'Auth Failures & Bot Errors',
        width: 12,
        left: [
          failedAuthFilter.metric({ period: cdk.Duration.minutes(5), label: 'Auth Failures' }),
          botRunErrorFilter.metric({ period: cdk.Duration.minutes(5), label: 'Bot Errors' }),
        ],
      }),
    );

    // -------------------------------------------------------
    // Outputs
    // -------------------------------------------------------
    new cdk.CfnOutput(this, 'AuditLogGroupName', {
      value: auditLogGroup.logGroupName,
      exportName: `${id}-AuditLogGroupName`,
    });
    new cdk.CfnOutput(this, 'AppLogGroupName', {
      value: appLogGroup.logGroupName,
      exportName: `${id}-AppLogGroupName`,
    });
    new cdk.CfnOutput(this, 'OpsAlertTopicArn', {
      value: this.alertTopic.topicArn,
      exportName: `${id}-OpsAlertTopicArn`,
    });
  }
}

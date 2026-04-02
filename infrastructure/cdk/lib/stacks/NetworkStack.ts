import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { VPC_CIDR, ENV, AUDIT_LOG_RETENTION_DAYS } from '../config';

export class NetworkStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly dbSecurityGroup: ec2.SecurityGroup;
  public readonly appSecurityGroup: ec2.SecurityGroup;
  public readonly lambdaSecurityGroup: ec2.SecurityGroup;
  public readonly vpcEndpointSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // -------------------------------------------------------
    // VPC — 3 AZs (ap-southeast-2a/b/c), private + isolated
    // -------------------------------------------------------
    this.vpc = new ec2.Vpc(this, 'Vpc', {
      vpcName: `growkyc-${ENV}-vpc`,
      ipAddresses: ec2.IpAddresses.cidr(VPC_CIDR[ENV]),
      maxAzs: 3,
      natGateways: 2, // Two NAT GWs for HA (one fails, traffic routes via the other)
      enableDnsHostnames: true,
      enableDnsSupport: true,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
          mapPublicIpOnLaunch: false, // No auto-assign; keep clean
        },
        {
          // Lambda functions, ECS tasks — outbound via NAT
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          // Aurora PostgreSQL, ElastiCache — no outbound at all
          name: 'Isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 28,
        },
      ],
    });

    // -------------------------------------------------------
    // VPC Flow Logs → CloudWatch (detect anomalies)
    // -------------------------------------------------------
    const flowLogGroup = new logs.LogGroup(this, 'VpcFlowLogGroup', {
      logGroupName: `/growkyc/${ENV}/vpc-flow-logs`,
      retention: AUDIT_LOG_RETENTION_DAYS,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    this.vpc.addFlowLog('FlowLog', {
      destination: ec2.FlowLogDestination.toCloudWatchLogs(flowLogGroup),
      trafficType: ec2.FlowLogTrafficType.ALL,
    });

    // -------------------------------------------------------
    // VPC Endpoints — keep traffic inside AWS backbone
    // -------------------------------------------------------
    // S3 Gateway endpoint (free, high-throughput for evidence uploads)
    this.vpc.addGatewayEndpoint('S3Endpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });

    // DynamoDB Gateway endpoint (free, for potential DynamoDB usage)
    this.vpc.addGatewayEndpoint('DynamoEndpoint', {
      service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
    });

    this.vpcEndpointSecurityGroup = new ec2.SecurityGroup(this, 'VpcEndpointSg', {
      vpc: this.vpc,
      securityGroupName: `growkyc-${ENV}-vpce-sg`,
      description: 'Interface endpoint SG — HTTPS inbound from Lambda/App only',
    });

    // Secrets Manager — Lambda reads credentials without leaving VPC
    this.vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      privateDnsEnabled: true,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [this.vpcEndpointSecurityGroup],
    });

    // KMS — envelope key operations without leaving VPC
    this.vpc.addInterfaceEndpoint('KmsEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.KMS,
      privateDnsEnabled: true,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [this.vpcEndpointSecurityGroup],
    });

    // CloudWatch Logs — Lambda log streams without NAT cost
    this.vpc.addInterfaceEndpoint('CloudWatchLogsEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
      privateDnsEnabled: true,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [this.vpcEndpointSecurityGroup],
    });

    // -------------------------------------------------------
    // Security Groups
    // -------------------------------------------------------
    this.appSecurityGroup = new ec2.SecurityGroup(this, 'AppSg', {
      vpc: this.vpc,
      securityGroupName: `growkyc-${ENV}-app-sg`,
      description: 'Application / API tier — allows outbound to DB and S3 endpoint',
      allowAllOutbound: false,
    });

    this.lambdaSecurityGroup = new ec2.SecurityGroup(this, 'LambdaSg', {
      vpc: this.vpc,
      securityGroupName: `growkyc-${ENV}-lambda-sg`,
      description: 'Lambda functions — outbound to DB, Secrets Manager, KMS, S3',
      allowAllOutbound: false,
    });

    this.dbSecurityGroup = new ec2.SecurityGroup(this, 'DbSg', {
      vpc: this.vpc,
      securityGroupName: `growkyc-${ENV}-db-sg`,
      description: 'Aurora PostgreSQL — no inbound from public internet',
      allowAllOutbound: false,
    });

    // DB accepts PostgreSQL ONLY from app and Lambda tiers
    this.dbSecurityGroup.addIngressRule(
      this.appSecurityGroup,
      ec2.Port.tcp(5432),
      'PostgreSQL from app tier',
    );
    this.dbSecurityGroup.addIngressRule(
      this.lambdaSecurityGroup,
      ec2.Port.tcp(5432),
      'PostgreSQL from Lambda',
    );

    // Lambda outbound: 5432 for DB and 443 only to interface VPC endpoints
    this.lambdaSecurityGroup.addEgressRule(
      this.dbSecurityGroup,
      ec2.Port.tcp(5432),
      'Lambda → Aurora',
    );
    this.lambdaSecurityGroup.addEgressRule(
      this.vpcEndpointSecurityGroup,
      ec2.Port.tcp(443),
      'Lambda → VPC interface endpoints (HTTPS)',
    );

    // VPC endpoint SG: accept HTTPS from Lambda
    this.vpcEndpointSecurityGroup.addIngressRule(
      this.lambdaSecurityGroup,
      ec2.Port.tcp(443),
      'Lambda → VPC interface endpoints',
    );

    // -------------------------------------------------------
    // CloudFormation Outputs
    // -------------------------------------------------------
    new cdk.CfnOutput(this, 'VpcId', { value: this.vpc.vpcId, exportName: `${id}-VpcId` });
    new cdk.CfnOutput(this, 'PrivateSubnetIds', {
      value: this.vpc.privateSubnets.map(s => s.subnetId).join(','),
      exportName: `${id}-PrivateSubnetIds`,
    });
    new cdk.CfnOutput(this, 'IsolatedSubnetIds', {
      value: this.vpc.isolatedSubnets.map(s => s.subnetId).join(','),
      exportName: `${id}-IsolatedSubnetIds`,
    });
  }
}

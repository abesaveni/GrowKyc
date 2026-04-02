#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/stacks/NetworkStack';
import { KmsStack } from '../lib/stacks/KmsStack';
import { DatabaseStack } from '../lib/stacks/DatabaseStack';
import { StorageStack } from '../lib/stacks/StorageStack';
import { AuthStack } from '../lib/stacks/AuthStack';
import { SecurityStack } from '../lib/stacks/SecurityStack';
import { MonitoringStack } from '../lib/stacks/MonitoringStack';
import { SecretsStack } from '../lib/stacks/SecretsStack';
import { COMMON_TAGS, STACK_PREFIX, stackEnv } from '../lib/config';

const app = new cdk.App();

// Apply common tags to all stacks
cdk.Tags.of(app).add('Application', COMMON_TAGS.Application);
cdk.Tags.of(app).add('Environment', COMMON_TAGS.Environment);
cdk.Tags.of(app).add('Compliance', COMMON_TAGS.Compliance);
cdk.Tags.of(app).add('DataClassification', COMMON_TAGS.DataClassification);
cdk.Tags.of(app).add('ManagedBy', COMMON_TAGS.ManagedBy);

// ===========================================================
// 1. Network — must deploy first (other stacks depend on VPC)
// ===========================================================
const networkStack = new NetworkStack(app, `${STACK_PREFIX}-network`, {
  env: stackEnv,
  description: 'GrowKYC VPC, subnets, NAT gateways, VPC endpoints, security groups',
  terminationProtection: true,
});

// ===========================================================
// 2. KMS — encryption keys for all services
// ===========================================================
const kmsStack = new KmsStack(app, `${STACK_PREFIX}-kms`, {
  env: stackEnv,
  description: 'GrowKYC KMS CMKs: database, storage, secrets, cloudtrail',
  terminationProtection: true,
});

// ===========================================================
// 3. Security — CloudTrail, GuardDuty, SecurityHub, Config
// ===========================================================
const securityStack = new SecurityStack(app, `${STACK_PREFIX}-security`, {
  env: stackEnv,
  description: 'GrowKYC CloudTrail, GuardDuty, SecurityHub, AWS Config rules',
  terminationProtection: true,
  trailKmsKey: kmsStack.cloudTrailKey,
  logBucket: undefined, // SecurityStack creates its own log bucket
});
securityStack.addDependency(kmsStack);

// ===========================================================
// 4. Database — Aurora PostgreSQL, multi-AZ
// ===========================================================
const databaseStack = new DatabaseStack(app, `${STACK_PREFIX}-database`, {
  env: stackEnv,
  description: 'GrowKYC Aurora PostgreSQL Serverless v2, multi-AZ, KMS-encrypted',
  terminationProtection: true,
  vpc: networkStack.vpc,
  dbSecurityGroup: networkStack.dbSecurityGroup,
  dbKmsKey: kmsStack.databaseKey,
});
databaseStack.addDependency(networkStack);
databaseStack.addDependency(kmsStack);

// ===========================================================
// 5. Storage — S3 evidence bucket with Object Lock
// ===========================================================
const storageStack = new StorageStack(app, `${STACK_PREFIX}-storage`, {
  env: stackEnv,
  description: 'GrowKYC S3 evidence bucket (Object Lock WORM), access logs bucket',
  terminationProtection: true,
  storageKmsKey: kmsStack.storageKey,
});
storageStack.addDependency(kmsStack);

// ===========================================================
// 6. Secrets — application/integration secrets in Secrets Manager
// ===========================================================
const secretsStack = new SecretsStack(app, `${STACK_PREFIX}-secrets`, {
  env: stackEnv,
  description: 'GrowKYC Secrets Manager secrets for app and integrations',
  terminationProtection: true,
  secretsKmsKey: kmsStack.secretsKey,
});
secretsStack.addDependency(kmsStack);

// ===========================================================
// 7. Auth — Cognito User Pool with mandatory MFA
// ===========================================================
const authStack = new AuthStack(app, `${STACK_PREFIX}-auth`, {
  env: stackEnv,
  description: 'GrowKYC Cognito User Pool, Identity Pool, TOTP MFA required',
  terminationProtection: true,
});

// ===========================================================
// 8. Monitoring — CloudWatch dashboards, alarms, log groups
// ===========================================================
const monitoringStack = new MonitoringStack(app, `${STACK_PREFIX}-monitoring`, {
  env: stackEnv,
  description: 'GrowKYC CloudWatch log groups, metric alarms, SNS alert topics',
  terminationProtection: true,
  auroraCluster: databaseStack.cluster,
  evidenceBucket: storageStack.evidenceBucket,
  userPoolId: authStack.userPool.userPoolId,
});
monitoringStack.addDependency(databaseStack);
monitoringStack.addDependency(storageStack);
monitoringStack.addDependency(authStack);

app.synth();

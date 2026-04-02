// =====================================================
// CDK shared configuration — GrowKYC AWS Sydney
// =====================================================

export const REGION = 'ap-southeast-2';
export const ACCOUNT = process.env.CDK_DEFAULT_ACCOUNT ?? process.env.AWS_ACCOUNT_ID ?? '';

/** Logical environment prefix (e.g. "prod", "staging") driven by CDK_ENV */
export const ENV = (() => {
  const e = process.env.CDK_ENV ?? 'prod';
  if (!['prod', 'staging', 'dev'].includes(e)) {
    throw new Error(`CDK_ENV must be prod | staging | dev, got: ${e}`);
  }
  return e as 'prod' | 'staging' | 'dev';
})();

export const APP_NAME = 'growkyc';
export const STACK_PREFIX = `${APP_NAME}-${ENV}`;

/** CIDR blocks per environment */
export const VPC_CIDR: Record<string, string> = {
  prod: '10.0.0.0/16',
  staging: '10.1.0.0/16',
  dev: '10.2.0.0/16',
};

/** 3 AZs in Sydney */
export const AVAILABILITY_ZONES = [
  `${REGION}a`,
  `${REGION}b`,
  `${REGION}c`,
];

/** Aurora Serverless v2 capacity (ACU) */
export const AURORA_CAPACITY: Record<string, { min: number; max: number }> = {
  prod: { min: 0.5, max: 64 },
  staging: { min: 0.5, max: 8 },
  dev: { min: 0.5, max: 4 },
};

/** Evidence S3 retention — AUSTRAC AML/CTF: 7-year minimum */
export const EVIDENCE_RETENTION_YEARS = 7;

/** Audit log retention in CloudWatch */
export const AUDIT_LOG_RETENTION_DAYS = 365 * 2; // 2 years

/** Secrets Manager path prefix */
export const SECRETS_PREFIX = `/${APP_NAME}/${ENV}`;

/** Tags applied to every resource */
export const COMMON_TAGS: Record<string, string> = {
  Application: 'GrowKYC',
  Environment: ENV,
  Region: REGION,
  Compliance: 'AUSTRAC-AML-CTF',
  DataClassification: 'Confidential',
  ManagedBy: 'CDK',
};

export const stackEnv = {
  account: ACCOUNT,
  region: REGION,
};

// Supported AWS region for GrowKYC deployment.
// Only ap-southeast-2 (Sydney) is permitted for AUSTRAC AML/CTF data residency.
export type AwsRegion = 'ap-southeast-2';

export type AwsDeploymentEnvironment = 'prod' | 'staging' | 'dev';

// ---------------------------------------------------------------------------
// Sub-config models
// ---------------------------------------------------------------------------

export interface AwsDatabaseConfig {
  /** Aurora cluster writer endpoint hostname */
  host: string;
  /** Aurora cluster reader endpoint hostname (optional for read-path) */
  reader_host?: string;
  port: number;
  database_name: string;
  /** ARN of the Secrets Manager secret holding db credentials */
  credentials_secret_arn: string;
  /** ARN of the KMS CMK used for Aurora storage encryption */
  kms_key_arn: string;
  ssl_required: boolean;
}

export interface AwsS3Config {
  /** Primary evidence bucket name */
  evidence_bucket_name: string;
  /** Staging (pre-scan) bucket name */
  staging_bucket_name: string;
  /** Server-access-log bucket name */
  access_log_bucket_name: string;
  /** AWS region the buckets reside in — must equal the deployment region */
  region: AwsRegion;
  /** ARN of the KMS CMK used for evidence bucket encryption */
  kms_key_arn: string;
}

export interface AwsKmsConfig {
  /** CMK ARN for Aurora storage encryption */
  database_key_arn: string;
  /** CMK ARN for S3 evidence bucket encryption */
  storage_key_arn: string;
  /** CMK ARN for Secrets Manager encryption */
  secrets_key_arn: string;
  /** CMK ARN for CloudTrail log file encryption */
  cloud_trail_key_arn: string;
  /** CMK ARN for auth token signing material */
  auth_key_arn?: string;
}

export interface AwsSecretsManagerConfig {
  /** ARN of the app JWT signing key secret */
  app_jwt_secret_arn: string;
  /** ARN of the integration credentials secret */
  integration_secrets_arn: string;
  /** Path prefix used when constructing secret names, e.g. /growkyc/prod */
  secrets_prefix: string;
  /** AWS region — must equal the deployment region */
  region: AwsRegion;
}

export interface AwsAuditLoggingConfig {
  /** CloudWatch log group for application logs */
  app_log_group: string;
  /** CloudWatch log group for API gateway logs */
  api_log_group: string;
  /** CloudWatch log group for structured audit events */
  audit_log_group: string;
  /** Retention in days for audit log group (AUSTRAC: 2-year minimum) */
  audit_log_retention_days: number;
  /** ARN of the SNS ops-alert topic */
  ops_alert_topic_arn?: string;
}

export interface AwsAppBaseUrlConfig {
  /** Public-facing base URL of the application, e.g. https://app.growkyc.com.au */
  app_url: string;
  /** Base URL for the API layer, e.g. https://api.growkyc.com.au */
  api_url: string;
}

// ---------------------------------------------------------------------------
// Root environment config model
// ---------------------------------------------------------------------------

export interface AwsDeploymentEnvironmentConfig {
  environment: AwsDeploymentEnvironment;
  region: AwsRegion;
  account_id: string;
  app_name: string;
  database: AwsDatabaseConfig;
  s3: AwsS3Config;
  kms: AwsKmsConfig;
  secrets_manager: AwsSecretsManagerConfig;
  audit_logging: AwsAuditLoggingConfig;
  app_base_url: AwsAppBaseUrlConfig;
}

// ---------------------------------------------------------------------------
// Sydney-only region validation hook
// ---------------------------------------------------------------------------

export interface AwsRegionValidationResult {
  valid: boolean;
  region: string;
  reason?: string;
}

/**
 * Validates that the supplied region is ap-southeast-2 (Sydney).
 * This is the only permitted region for GrowKYC under AUSTRAC AML/CTF
 * data residency requirements.
 */
export const validateSydneyRegion = (region: string): AwsRegionValidationResult => {
  if (region === 'ap-southeast-2') {
    return { valid: true, region };
  }

  return {
    valid: false,
    region,
    reason: `Region "${region}" is not permitted. GrowKYC requires ap-southeast-2 (Sydney) for AUSTRAC AML/CTF data residency compliance.`,
  };
};

/**
 * Asserts that the supplied region is ap-southeast-2.
 * Throws if the region is invalid — intended for use during app bootstrap only.
 */
export const assertSydneyRegion = (region: string): asserts region is AwsRegion => {
  const result = validateSydneyRegion(region);

  if (!result.valid) {
    throw new Error(result.reason);
  }
};

// ---------------------------------------------------------------------------
// Config validation hook
// ---------------------------------------------------------------------------

export interface AwsDeploymentEnvironmentValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates the shape and constraints of a resolved environment config.
 * Does not make network calls — purely structural.
 */
export const validateAwsDeploymentEnvironmentConfig = (
  config: AwsDeploymentEnvironmentConfig
): AwsDeploymentEnvironmentValidationResult => {
  const errors: string[] = [];

  const regionResult = validateSydneyRegion(config.region);
  if (!regionResult.valid && regionResult.reason) {
    errors.push(regionResult.reason);
  }

  if (!config.account_id) {
    errors.push('account_id must not be empty.');
  }

  if (!config.database.host) {
    errors.push('database.host must not be empty.');
  }

  if (!config.database.credentials_secret_arn) {
    errors.push('database.credentials_secret_arn must not be empty.');
  }

  if (!config.database.kms_key_arn) {
    errors.push('database.kms_key_arn must not be empty.');
  }

  if (!config.s3.evidence_bucket_name) {
    errors.push('s3.evidence_bucket_name must not be empty.');
  }

  const s3RegionResult = validateSydneyRegion(config.s3.region);
  if (!s3RegionResult.valid && s3RegionResult.reason) {
    errors.push(`s3.region: ${s3RegionResult.reason}`);
  }

  if (!config.kms.database_key_arn) {
    errors.push('kms.database_key_arn must not be empty.');
  }

  if (!config.kms.storage_key_arn) {
    errors.push('kms.storage_key_arn must not be empty.');
  }

  if (!config.kms.secrets_key_arn) {
    errors.push('kms.secrets_key_arn must not be empty.');
  }

  if (!config.secrets_manager.app_jwt_secret_arn) {
    errors.push('secrets_manager.app_jwt_secret_arn must not be empty.');
  }

  if (!config.secrets_manager.secrets_prefix) {
    errors.push('secrets_manager.secrets_prefix must not be empty.');
  }

  if (config.audit_logging.audit_log_retention_days < 730) {
    errors.push(
      `audit_logging.audit_log_retention_days is ${config.audit_logging.audit_log_retention_days}. AUSTRAC AML/CTF requires a minimum of 730 days (2 years).`
    );
  }

  if (!config.app_base_url.app_url) {
    errors.push('app_base_url.app_url must not be empty.');
  }

  if (!config.app_base_url.api_url) {
    errors.push('app_base_url.api_url must not be empty.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

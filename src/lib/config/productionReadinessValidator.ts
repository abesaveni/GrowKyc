import type { AwsDeploymentEnvironmentConfig } from './awsEnvironment';
import { validateSydneyRegion } from './awsEnvironment';

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Production readiness validator is server-side only.');
  }
}

// ---------------------------------------------------------------------------
// Reason codes
// ---------------------------------------------------------------------------

export type ReadinessReasonCode =
  | 'missing_env_var'
  | 'invalid_region'
  | 'invalid_arn_region'
  | 'missing_db_config'
  | 'missing_storage_config'
  | 'missing_kms_config'
  | 'missing_secrets_config'
  | 'audit_retention_below_minimum'
  | 'missing_audit_config'
  | 'missing_app_url_config'
  | 'invalid_env_var_value'
  | 'invalid_runtime_mode';

export type ReadinessCheckReasonCode = ReadinessReasonCode;

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

export interface ReadinessCheckFailure {
  reason_code: ReadinessReasonCode;
  field: string;
  message: string;
}

export interface ProductionReadinessResult {
  ready: boolean;
  failures: ReadinessCheckFailure[];
  checked_at: string;
}

// ---------------------------------------------------------------------------
// Required env var manifest
// ---------------------------------------------------------------------------

type EnvMap = Record<string, string | undefined>;
type ProcessEnvCarrier = typeof globalThis & {
  process?: {
    env?: EnvMap;
  };
};

interface EnvVarSpec {
  key: string;
  reasonCode: ReadinessReasonCode;
  description: string;
}

interface RequiredConfigCheck {
  value: string;
  reasonCode: ReadinessReasonCode;
  field: string;
  message: string;
}

const REQUIRED_ENV_VARS: EnvVarSpec[] = [
  { key: 'AWS_REGION',                    reasonCode: 'missing_env_var',     description: 'AWS deployment region' },
  { key: 'AWS_ACCOUNT_ID',                reasonCode: 'missing_env_var',     description: 'AWS account ID' },
  { key: 'DB_HOST',                       reasonCode: 'missing_db_config',   description: 'Aurora writer endpoint' },
  { key: 'DB_PORT',                       reasonCode: 'missing_db_config',   description: 'Aurora port' },
  { key: 'DB_NAME',                       reasonCode: 'missing_db_config',   description: 'Database name' },
  { key: 'DB_CREDENTIALS_SECRET_ARN',     reasonCode: 'missing_db_config',   description: 'Aurora credentials secret ARN' },
  { key: 'DB_KMS_KEY_ARN',                reasonCode: 'missing_kms_config',  description: 'Aurora storage KMS CMK ARN' },
  { key: 'S3_EVIDENCE_BUCKET',            reasonCode: 'missing_storage_config', description: 'Evidence S3 bucket name' },
  { key: 'S3_STAGING_BUCKET',             reasonCode: 'missing_storage_config', description: 'Staging S3 bucket name' },
  { key: 'S3_ACCESS_LOG_BUCKET',          reasonCode: 'missing_storage_config', description: 'Access-log S3 bucket name' },
  { key: 'S3_KMS_KEY_ARN',                reasonCode: 'missing_kms_config',  description: 'S3 evidence bucket KMS CMK ARN' },
  { key: 'KMS_DATABASE_KEY_ARN',          reasonCode: 'missing_kms_config',  description: 'Aurora storage CMK ARN' },
  { key: 'KMS_STORAGE_KEY_ARN',           reasonCode: 'missing_kms_config',  description: 'S3 storage CMK ARN' },
  { key: 'KMS_SECRETS_KEY_ARN',           reasonCode: 'missing_kms_config',  description: 'Secrets Manager CMK ARN' },
  { key: 'KMS_CLOUDTRAIL_KEY_ARN',        reasonCode: 'missing_kms_config',  description: 'CloudTrail CMK ARN' },
  { key: 'SECRETS_APP_JWT_ARN',           reasonCode: 'missing_secrets_config', description: 'App JWT signing key secret ARN' },
  { key: 'SECRETS_INTEGRATION_ARN',       reasonCode: 'missing_secrets_config', description: 'Integration credentials secret ARN' },
  { key: 'SECRETS_PREFIX',                reasonCode: 'missing_secrets_config', description: 'Secrets Manager path prefix' },
  { key: 'APP_URL',                       reasonCode: 'missing_app_url_config', description: 'Public-facing app base URL' },
  { key: 'API_URL',                       reasonCode: 'missing_app_url_config', description: 'API base URL' },
];

const MINIMUM_AUDIT_RETENTION_DAYS = 730;
const ARN_PREFIX = 'arn:';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const createFailure = (
  reasonCode: ReadinessReasonCode,
  field: string,
  message: string
): ReadinessCheckFailure => ({ reason_code: reasonCode, field, message });

function addFailure(
  failures: ReadinessCheckFailure[],
  reasonCode: ReadinessReasonCode,
  field: string,
  message: string
): void {
  failures.push(createFailure(reasonCode, field, message));
}

function buildReadinessResult(
  failures: ReadinessCheckFailure[],
  now: () => string
): ProductionReadinessResult {
  return {
    ready: failures.length === 0,
    failures,
    checked_at: now(),
  };
}

function getRuntimeEnv(): EnvMap {
  return ((globalThis as ProcessEnvCarrier).process?.env ?? {}) as EnvMap;
}

function addMissingValueFailure(
  failures: ReadinessCheckFailure[],
  value: string | undefined,
  reasonCode: ReadinessReasonCode,
  field: string,
  message: string
): void {
  if (!value) {
    addFailure(failures, reasonCode, field, message);
  }
}

function validateRegionField(
  failures: ReadinessCheckFailure[],
  field: string,
  region: string,
  fallbackMessage: string
): void {
  const result = validateSydneyRegion(region);

  if (!result.valid) {
    addFailure(failures, 'invalid_region', field, result.reason ?? fallbackMessage);
  }
}

function tryExtractArnRegion(value: string): string | null {
  if (!value.startsWith(ARN_PREFIX)) {
    return null;
  }

  const parts = value.split(':');
  if (parts.length < 4) {
    return null;
  }

  return parts[3] || null;
}

function validateArnRegionField(
  failures: ReadinessCheckFailure[],
  field: string,
  arn: string,
  fallbackMessage: string
): void {
  const arnRegion = tryExtractArnRegion(arn);

  if (!arnRegion) {
    return;
  }

  const regionResult = validateSydneyRegion(arnRegion);
  if (!regionResult.valid) {
    addFailure(
      failures,
      'invalid_arn_region',
      field,
      regionResult.reason ?? fallbackMessage
    );
  }
}

function addRequiredConfigFailures(
  failures: ReadinessCheckFailure[],
  checks: readonly RequiredConfigCheck[]
): void {
  for (const check of checks) {
    addMissingValueFailure(
      failures,
      check.value,
      check.reasonCode,
      check.field,
      check.message
    );
  }
}

function checkEnvVarPresence(
  env: EnvMap,
  failures: ReadinessCheckFailure[]
): void {
  for (const spec of REQUIRED_ENV_VARS) {
    const value = env[spec.key];

    if (!value || value.trim() === '') {
      addFailure(
        failures,
        spec.reasonCode,
        spec.key,
        `Required env var "${spec.key}" (${spec.description}) is missing or empty.`
      );
    }
  }
}

function checkRegion(
  env: EnvMap,
  failures: ReadinessCheckFailure[]
): void {
  const region = env['AWS_REGION'];

  if (!region) {
    return;
  }

  validateRegionField(
    failures,
    'AWS_REGION',
    region,
    `AWS_REGION "${region}" is not ap-southeast-2 (Sydney).`
  );
}

function checkAuditRetention(
  env: EnvMap,
  failures: ReadinessCheckFailure[]
): void {
  const raw = env['AUDIT_LOG_RETENTION_DAYS'];

  if (!raw) {
    return;
  }

  const days = parseInt(raw, 10);

  if (Number.isNaN(days)) {
    addFailure(
      failures,
      'invalid_env_var_value',
      'AUDIT_LOG_RETENTION_DAYS',
      `AUDIT_LOG_RETENTION_DAYS value "${raw}" is not a valid integer.`
    );
    return;
  }

  if (days < MINIMUM_AUDIT_RETENTION_DAYS) {
    addFailure(
      failures,
      'audit_retention_below_minimum',
      'AUDIT_LOG_RETENTION_DAYS',
      `AUDIT_LOG_RETENTION_DAYS is ${days}. AUSTRAC AML/CTF requires a minimum of ${MINIMUM_AUDIT_RETENTION_DAYS} days (2 years).`
    );
  }
}

function checkStorageSettings(
  env: EnvMap,
  failures: ReadinessCheckFailure[]
): void {
  const s3Region = env['S3_REGION'] ?? env['AWS_REGION'];

  if (s3Region) {
    validateRegionField(
      failures,
      'S3_REGION',
      s3Region,
      `S3_REGION "${s3Region}" must be ap-southeast-2 (Sydney).`
    );
  }
}

function checkArnRegions(
  env: EnvMap,
  failures: ReadinessCheckFailure[]
): void {
  const arnEnvVars = [
    'DB_CREDENTIALS_SECRET_ARN',
    'DB_KMS_KEY_ARN',
    'S3_KMS_KEY_ARN',
    'KMS_DATABASE_KEY_ARN',
    'KMS_STORAGE_KEY_ARN',
    'KMS_SECRETS_KEY_ARN',
    'KMS_CLOUDTRAIL_KEY_ARN',
    'SECRETS_APP_JWT_ARN',
    'SECRETS_INTEGRATION_ARN',
  ] as const;

  for (const key of arnEnvVars) {
    const value = env[key];
    if (!value) {
      continue;
    }

    validateArnRegionField(
      failures,
      key,
      value,
      `${key} must resolve to ap-southeast-2 (Sydney).`
    );
  }
}

function checkRuntimeMode(
  env: EnvMap,
  failures: ReadinessCheckFailure[]
): void {
  const nodeEnv = env['NODE_ENV'];
  if (nodeEnv && nodeEnv !== 'production') {
    addFailure(
      failures,
      'invalid_runtime_mode',
      'NODE_ENV',
      `NODE_ENV must be "production" for production readiness checks. Received "${nodeEnv}".`
    );
  }

  const appEnv = env['APP_ENV'];
  if (appEnv && appEnv !== 'production') {
    addFailure(
      failures,
      'invalid_runtime_mode',
      'APP_ENV',
      `APP_ENV must be "production" for production readiness checks. Received "${appEnv}".`
    );
  }

  if (env['LOCAL_DEV'] === 'true') {
    addFailure(
      failures,
      'invalid_runtime_mode',
      'LOCAL_DEV',
      'LOCAL_DEV must be disabled in production.'
    );
  }

  if (env['ALLOW_PLACEHOLDER_SCREENING_ADAPTERS'] === 'true') {
    addFailure(
      failures,
      'invalid_runtime_mode',
      'ALLOW_PLACEHOLDER_SCREENING_ADAPTERS',
      'ALLOW_PLACEHOLDER_SCREENING_ADAPTERS must be false in production.'
    );
  }

  const providerKeys = [
    'DEFAULT_SCREENING_PROVIDER',
    'SCREENING_PROVIDER_SANCTIONS',
    'SCREENING_PROVIDER_PEP',
    'SCREENING_PROVIDER_ADVERSE_MEDIA',
    'SCREENING_PROVIDER_IDV',
    'SCREENING_PROVIDER_REGISTRY',
  ] as const;

  for (const key of providerKeys) {
    const value = env[key];
    if (!value) {
      continue;
    }

    if (value.trim().toLowerCase().includes('stub')) {
      addFailure(
        failures,
        'invalid_runtime_mode',
        key,
        `${key} must not reference stub providers in production.`
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Env-var-based readiness check (bootstrap-time)
// ---------------------------------------------------------------------------

export interface ValidateProductionReadinessFromEnvOptions {
  /** Env var map to validate — defaults to process.env */
  env?: EnvMap;
  /** Override the timestamp used in the result */
  now?: () => string;
}

/**
 * Validates production readiness from raw environment variables.
 * Safe to call before any config assembly — does not throw.
 */
export const validateProductionReadinessFromEnv = (
  options: ValidateProductionReadinessFromEnvOptions = {}
): ProductionReadinessResult => {
  assertServerRuntime();

  const env = options.env ?? getRuntimeEnv();
  const now = options.now ?? (() => new Date().toISOString());
  const failures: ReadinessCheckFailure[] = [];

  checkEnvVarPresence(env, failures);
  checkRegion(env, failures);
  checkStorageSettings(env, failures);
  checkArnRegions(env, failures);
  checkRuntimeMode(env, failures);
  checkAuditRetention(env, failures);

  return buildReadinessResult(failures, now);
};

// ---------------------------------------------------------------------------
// Config-struct-based readiness check (post-assembly)
// ---------------------------------------------------------------------------

/**
 * Validates production readiness from an already-assembled
 * AwsDeploymentEnvironmentConfig.  Returns typed reason codes for each
 * failure instead of plain error strings.
 * Does not make network calls — purely structural.
 */
export const validateProductionReadinessFromConfig = (
  config: AwsDeploymentEnvironmentConfig,
  options: { now?: () => string } = {}
): ProductionReadinessResult => {
  assertServerRuntime();

  const now = options.now ?? (() => new Date().toISOString());
  const failures: ReadinessCheckFailure[] = [];

  validateRegionField(failures, 'region', config.region, 'Invalid region.');

  addRequiredConfigFailures(failures, [
    { value: config.account_id, reasonCode: 'missing_env_var', field: 'account_id', message: 'account_id must not be empty.' },
    { value: config.database.host, reasonCode: 'missing_db_config', field: 'database.host', message: 'database.host must not be empty.' },
    { value: config.database.credentials_secret_arn, reasonCode: 'missing_db_config', field: 'database.credentials_secret_arn', message: 'database.credentials_secret_arn must not be empty.' },
    { value: config.database.kms_key_arn, reasonCode: 'missing_kms_config', field: 'database.kms_key_arn', message: 'database.kms_key_arn must not be empty.' },
    { value: config.database.database_name, reasonCode: 'missing_db_config', field: 'database.database_name', message: 'database.database_name must not be empty.' },
    { value: config.s3.evidence_bucket_name, reasonCode: 'missing_storage_config', field: 's3.evidence_bucket_name', message: 's3.evidence_bucket_name must not be empty.' },
    { value: config.s3.staging_bucket_name, reasonCode: 'missing_storage_config', field: 's3.staging_bucket_name', message: 's3.staging_bucket_name must not be empty.' },
    { value: config.s3.kms_key_arn, reasonCode: 'missing_kms_config', field: 's3.kms_key_arn', message: 's3.kms_key_arn must not be empty.' },
    { value: config.kms.database_key_arn, reasonCode: 'missing_kms_config', field: 'kms.database_key_arn', message: 'kms.database_key_arn must not be empty.' },
    { value: config.kms.storage_key_arn, reasonCode: 'missing_kms_config', field: 'kms.storage_key_arn', message: 'kms.storage_key_arn must not be empty.' },
    { value: config.kms.secrets_key_arn, reasonCode: 'missing_kms_config', field: 'kms.secrets_key_arn', message: 'kms.secrets_key_arn must not be empty.' },
    { value: config.kms.cloud_trail_key_arn, reasonCode: 'missing_kms_config', field: 'kms.cloud_trail_key_arn', message: 'kms.cloud_trail_key_arn must not be empty.' },
    { value: config.secrets_manager.app_jwt_secret_arn, reasonCode: 'missing_secrets_config', field: 'secrets_manager.app_jwt_secret_arn', message: 'secrets_manager.app_jwt_secret_arn must not be empty.' },
    { value: config.secrets_manager.integration_secrets_arn, reasonCode: 'missing_secrets_config', field: 'secrets_manager.integration_secrets_arn', message: 'secrets_manager.integration_secrets_arn must not be empty.' },
    { value: config.secrets_manager.secrets_prefix, reasonCode: 'missing_secrets_config', field: 'secrets_manager.secrets_prefix', message: 'secrets_manager.secrets_prefix must not be empty.' },
    { value: config.audit_logging.audit_log_group, reasonCode: 'missing_audit_config', field: 'audit_logging.audit_log_group', message: 'audit_logging.audit_log_group must not be empty.' },
    { value: config.audit_logging.app_log_group, reasonCode: 'missing_audit_config', field: 'audit_logging.app_log_group', message: 'audit_logging.app_log_group must not be empty.' },
    { value: config.app_base_url.app_url, reasonCode: 'missing_app_url_config', field: 'app_base_url.app_url', message: 'app_base_url.app_url must not be empty.' },
    { value: config.app_base_url.api_url, reasonCode: 'missing_app_url_config', field: 'app_base_url.api_url', message: 'app_base_url.api_url must not be empty.' },
  ]);

  validateRegionField(failures, 's3.region', config.s3.region, 'Invalid S3 region.');
  validateRegionField(
    failures,
    'secrets_manager.region',
    config.secrets_manager.region,
    'Invalid Secrets Manager region.'
  );

  validateArnRegionField(
    failures,
    'database.credentials_secret_arn',
    config.database.credentials_secret_arn,
    'database.credentials_secret_arn must resolve to ap-southeast-2 (Sydney).'
  );
  validateArnRegionField(
    failures,
    'database.kms_key_arn',
    config.database.kms_key_arn,
    'database.kms_key_arn must resolve to ap-southeast-2 (Sydney).'
  );
  validateArnRegionField(
    failures,
    's3.kms_key_arn',
    config.s3.kms_key_arn,
    's3.kms_key_arn must resolve to ap-southeast-2 (Sydney).'
  );
  validateArnRegionField(
    failures,
    'kms.database_key_arn',
    config.kms.database_key_arn,
    'kms.database_key_arn must resolve to ap-southeast-2 (Sydney).'
  );
  validateArnRegionField(
    failures,
    'kms.storage_key_arn',
    config.kms.storage_key_arn,
    'kms.storage_key_arn must resolve to ap-southeast-2 (Sydney).'
  );
  validateArnRegionField(
    failures,
    'kms.secrets_key_arn',
    config.kms.secrets_key_arn,
    'kms.secrets_key_arn must resolve to ap-southeast-2 (Sydney).'
  );
  validateArnRegionField(
    failures,
    'kms.cloud_trail_key_arn',
    config.kms.cloud_trail_key_arn,
    'kms.cloud_trail_key_arn must resolve to ap-southeast-2 (Sydney).'
  );
  validateArnRegionField(
    failures,
    'secrets_manager.app_jwt_secret_arn',
    config.secrets_manager.app_jwt_secret_arn,
    'secrets_manager.app_jwt_secret_arn must resolve to ap-southeast-2 (Sydney).'
  );
  validateArnRegionField(
    failures,
    'secrets_manager.integration_secrets_arn',
    config.secrets_manager.integration_secrets_arn,
    'secrets_manager.integration_secrets_arn must resolve to ap-southeast-2 (Sydney).'
  );

  if (config.audit_logging.audit_log_retention_days < MINIMUM_AUDIT_RETENTION_DAYS) {
    addFailure(
      failures,
      'audit_retention_below_minimum',
      'audit_logging.audit_log_retention_days',
      `audit_logging.audit_log_retention_days is ${config.audit_logging.audit_log_retention_days}. AUSTRAC AML/CTF requires a minimum of ${MINIMUM_AUDIT_RETENTION_DAYS} days (2 years).`
    );
  }

  return buildReadinessResult(failures, now);
};

// ---------------------------------------------------------------------------
// Bootstrap assertion helper
// ---------------------------------------------------------------------------

/**
 * Calls validateProductionReadinessFromEnv and throws a single consolidated
 * error if any failures are found.  Call once at app startup — before any
 * request handling begins.
 */
export const assertProductionReadiness = (
  options: ValidateProductionReadinessFromEnvOptions = {}
): void => {
  const result = validateProductionReadinessFromEnv(options);

  if (!result.ready) {
    const lines = result.failures.map(
      (failure) => `  [${failure.reason_code}] ${failure.field}: ${failure.message}`
    );
    throw new Error(
      `Production readiness check failed at ${result.checked_at}:\n${lines.join('\n')}`
    );
  }
};
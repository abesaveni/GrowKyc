import { IProviderAdapterRegistry } from './interfaces';
import { AwsApiClient } from './adapters/aws/awsApiClient';
import { AwsDatabaseAdapter } from './adapters/aws/awsDatabaseAdapter';
import { AwsAuditAdapter } from './adapters/aws/awsAuditAdapter';
import { S3EvidenceAdapter } from './adapters/aws/s3EvidenceAdapter';
import { CognitoAuthAdapter } from './adapters/aws/cognitoAuthAdapter';
import { SupabaseDatabaseAdapter } from './adapters/supabase/supabaseDatabaseAdapter';
import { SupabaseAuditAdapter } from './adapters/supabase/supabaseAuditAdapter';
import { SupabaseStorageAdapter } from './adapters/supabase/supabaseStorageAdapter';
import { SupabaseAuthAdapter } from './adapters/supabase/supabaseAuthAdapter';

function getRuntimeEnv(): Record<string, string> {
  const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
  const processEnv = ((globalThis as any)?.process?.env || {}) as Record<string, string>;
  return { ...processEnv, ...viteEnv };
}

export function buildProviderRegistry(): IProviderAdapterRegistry {
  const env = getRuntimeEnv();
  const backend = env.VITE_BACKEND_PROVIDER || 'supabase-bridge';

  if (backend === 'aws') {
    const baseUrl = env.VITE_API_URL || '';
    const client = new AwsApiClient({ baseUrl });

    return {
      auth: new CognitoAuthAdapter(client),
      storage: new S3EvidenceAdapter(client),
      database: new AwsDatabaseAdapter(client),
      audit: new AwsAuditAdapter(client),
    };
  }

  return {
    auth: new SupabaseAuthAdapter(),
    storage: new SupabaseStorageAdapter(),
    database: new SupabaseDatabaseAdapter(),
    audit: new SupabaseAuditAdapter(),
  };
}

export const providerRegistry = buildProviderRegistry();

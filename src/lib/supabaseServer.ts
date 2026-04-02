/**
 * supabaseServer.ts — Server-side Supabase client using the service role key.
 *
 * This client bypasses Row Level Security and should ONLY be used in
 * server-side handlers where tenant isolation is already enforced by
 * the application layer (JWT auth + RBAC middleware).
 *
 * Never import this in frontend components.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getEnv(key: string): string {
  const processEnv = ((globalThis as any)?.process?.env ?? {}) as Record<string, string>;
  return processEnv[key] ?? '';
}

function buildServerSupabaseClient(): SupabaseClient {
  const url =
    getEnv('SUPABASE_URL') ||
    getEnv('VITE_SUPABASE_URL') ||
    'https://placeholder.supabase.co';

  // Prefer service role key on server; fall back to anon key for local dev
  const key =
    getEnv('SUPABASE_SERVICE_ROLE_KEY') ||
    getEnv('SUPABASE_ANON_KEY') ||
    getEnv('VITE_SUPABASE_ANON_KEY') ||
    'public-anon-key-placeholder';

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const supabaseServer: SupabaseClient = buildServerSupabaseClient();

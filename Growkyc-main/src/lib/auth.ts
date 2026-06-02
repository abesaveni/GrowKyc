import { createClient } from '@supabase/supabase-js';

function getRuntimeEnv(): Record<string, string | undefined> {
  const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) as Record<string, string | undefined>;
  const processEnv = ((globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env || {});
  return { ...processEnv, ...viteEnv };
}

const runtimeEnv = getRuntimeEnv();
const supabaseUrl =
  runtimeEnv.VITE_SUPABASE_URL ||
  runtimeEnv.NEXT_PUBLIC_SUPABASE_URL ||
  'https://placeholder.supabase.co';
const supabaseAnonKey =
  runtimeEnv.VITE_SUPABASE_ANON_KEY ||
  runtimeEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'public-anon-key-placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MFA_VERIFIED_PREFIX = 'growkyc:mfa_verified:';
const PRIVILEGED_ROLES = new Set([
  'reviewer',
  'approver',
  'compliance_manager',
  'admin',
  'super_admin',
]);

// Auth types
export interface User {
  id: string;
  email: string;
  organizationId: string;
  role: string;
  permissions: string[];
  metadata: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

export interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

async function writeAuthAuditEvent(input: {
  eventType: 'login' | 'login_failed';
  userId?: string;
  organizationId?: string;
  email?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await supabase.from('audit_logs').insert({
      organization_id: input.organizationId || null,
      user_id: input.userId || null,
      action: input.eventType,
      resource_type: 'auth_session',
      resource_id: input.userId || null,
      module: 'auth',
      severity: input.eventType === 'login' ? 'info' : 'warning',
      metadata: {
        eventType: input.eventType,
        email: input.email,
        ...(input.metadata || {}),
      },
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('[auth] failed to write audit event', error);
  }
}

// Sign up new user
export async function signUp(
  email: string,
  password: string,
  metadata: {
    firstName: string;
    lastName: string;
    organizationName?: string;
  }
) {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: metadata.firstName,
          last_name: metadata.lastName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    return {
      success: true,
      user: authData.user,
      message: 'Account created! Please check your email to verify your account.',
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error: error.message,
    };
  }
}

// Sign in
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.session) throw new Error('No session created');

    await writeAuthAuditEvent({
      eventType: 'login',
      userId: data.user?.id,
      organizationId: data.user?.user_metadata?.organization_id,
      email: data.user?.email || email,
      metadata: {
        provider: 'password',
      },
    });

    return {
      success: true,
      session: data.session,
      user: data.user,
    };
  } catch (err: unknown) {
    const error = err as Error;
    await writeAuthAuditEvent({
      eventType: 'login_failed',
      email,
      metadata: {
        reason: error?.message || 'unknown',
        provider: 'password',
      },
    });

    return {
      success: false,
      error: error.message,
    };
  }
}

// Sign in with OAuth
export async function signInWithOAuth(provider: 'google' | 'microsoft') {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error: error.message,
    };
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error: error.message,
    };
  }
}

// Get current session
export async function getSession(): Promise<Session | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    if (!session) return null;

    // Fetch user profile with organization and role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*, organizations(*)')
      .eq('id', session.user.id)
      .single();

    if (!profile) return null;

    return {
      user: {
        id: session.user.id,
        email: session.user.email!,
        organizationId: profile.organization_id,
        role: profile.role,
        permissions: profile.permissions || [],
        metadata: {
          firstName: profile.first_name,
          lastName: profile.last_name,
          phone: profile.phone,
        },
      },
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: new Date(session.expires_at!).getTime(),
    };
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

// Refresh session
export async function refreshSession() {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    
    return {
      success: true,
      session,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error: error.message,
    };
  }
}

// Reset password request
export async function resetPasswordRequest(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password reset email sent. Please check your inbox.',
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error: error.message,
    };
  }
}

// Update password
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password updated successfully.',
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error: error.message,
    };
  }
}

// Verify email
export async function verifyEmail(token: string) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error: error.message,
    };
  }
}

// Setup MFA
export async function setupMFA() {
  try {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
    });

    if (error) throw error;

    return {
      success: true,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
      factorId: data.id,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error: error.message,
    };
  }
}

// Verify MFA
export async function verifyMFA(factorId: string, code: string) {
  try {
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId,
    });
    if (challengeError) throw challengeError;
    if (!challengeData) throw new Error('Failed to create MFA challenge');

    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code,
    });

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error: error.message,
    };
  }
}

export function isPrivilegedRole(role: string | undefined | null): boolean {
  if (!role) {
    return false;
  }

  return PRIVILEGED_ROLES.has(role.trim().toLowerCase());
}

export function setMfaVerification(userId: string, verified: boolean): void {
  if (typeof window === 'undefined' || !userId) {
    return;
  }

  window.sessionStorage.setItem(`${MFA_VERIFIED_PREFIX}${userId}`, verified ? 'true' : 'false');
}

export function isMfaVerified(userId: string | undefined | null): boolean {
  if (typeof window === 'undefined' || !userId) {
    return false;
  }

  return window.sessionStorage.getItem(`${MFA_VERIFIED_PREFIX}${userId}`) === 'true';
}

export function clearMfaVerification(userId?: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (userId) {
    window.sessionStorage.removeItem(`${MFA_VERIFIED_PREFIX}${userId}`);
    return;
  }

  const keysToRemove: string[] = [];
  for (let i = 0; i < window.sessionStorage.length; i += 1) {
    const key = window.sessionStorage.key(i);
    if (key && key.startsWith(MFA_VERIFIED_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  for (const key of keysToRemove) {
    window.sessionStorage.removeItem(key);
  }
}

// Check if user has permission
export function hasPermission(user: User, permission: string): boolean {
  return user.permissions.includes(permission) || user.permissions.includes('*');
}

// Check if user has any of the permissions
export function hasAnyPermission(user: User, permissions: string[]): boolean {
  return permissions.some(p => hasPermission(user, p));
}

// Check if user has all permissions
export function hasAllPermissions(user: User, permissions: string[]): boolean {
  return permissions.every(p => hasPermission(user, p));
}

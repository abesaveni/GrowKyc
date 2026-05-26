import { IAuthProvider } from '../../interfaces';
import {
  AuthSession,
  AuthStateChange,
  AuthStateChangeCallback,
  AuthUser,
} from '../../types';
import { supabase } from '../../../../../lib/auth';

function mapSupabaseUser(user: any): AuthUser {
  return {
    id: user.id,
    email: user.email || '',
    organizationId: user.user_metadata?.organization_id || '',
    role: user.user_metadata?.role || 'user',
    permissions: user.user_metadata?.permissions || [],
    metadata: {
      firstName: user.user_metadata?.first_name || '',
      lastName: user.user_metadata?.last_name || '',
      phone: user.user_metadata?.phone,
    },
  };
}

function mapSupabaseSession(session: any): AuthSession {
  return {
    user: mapSupabaseUser(session.user),
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: (session.expires_at || 0) * 1000,
    idToken: session.provider_token,
  };
}

function mapEvent(event: string): AuthStateChange['event'] {
  if (event === 'SIGNED_OUT') return 'SIGNED_OUT';
  if (event === 'TOKEN_REFRESHED') return 'TOKEN_REFRESHED';
  return 'SIGNED_IN';
}

export class SupabaseAuthAdapter implements IAuthProvider {
  async getCurrentSession(): Promise<AuthSession | null> {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return null;
    return mapSupabaseSession(data.session);
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    return mapSupabaseUser(data.user);
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      return { success: false, error: error?.message || 'Sign in failed' };
    }

    return { success: true, session: mapSupabaseSession(data.session) };
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  onAuthStateChange(callback: AuthStateChangeCallback): () => void {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback({
        event: mapEvent(event),
        session: session ? mapSupabaseSession(session) : null,
      });
    });

    return () => data.subscription.unsubscribe();
  }
}

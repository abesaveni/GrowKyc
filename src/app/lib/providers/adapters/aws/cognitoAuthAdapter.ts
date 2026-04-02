import { IAuthProvider } from '../../interfaces';
import { AuthSession, AuthStateChange, AuthStateChangeCallback, AuthUser } from '../../types';
import { AwsApiClient } from './awsApiClient';

export class CognitoAuthAdapter implements IAuthProvider {
  private callbacks = new Set<AuthStateChangeCallback>();
  private currentSession: AuthSession | null = null;

  constructor(private readonly client: AwsApiClient) {}

  async getCurrentSession(): Promise<AuthSession | null> {
    return this.currentSession;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return this.currentSession?.user || null;
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    try {
      const session = await this.client.post<AuthSession>('/api/auth/sign-in', { email, password });
      this.currentSession = session;
      this.emit({ event: 'SIGNED_IN', session });
      return { success: true, session };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Sign in failed' };
    }
  }

  async signOut(): Promise<void> {
    await this.client.post('/api/auth/sign-out', {});
    this.currentSession = null;
    this.emit({ event: 'SIGNED_OUT', session: null });
  }

  onAuthStateChange(callback: AuthStateChangeCallback): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  private emit(change: AuthStateChange): void {
    for (const callback of this.callbacks) {
      callback(change);
    }
  }
}

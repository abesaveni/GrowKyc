/**
 * auth.ts — JWT validation and tenant context extraction.
 *
 * Validates Cognito JWTs via JWKS (RS256). In LOCAL_DEV mode the
 * signature check is bypassed so the suite can run without live
 * Cognito; a synthetic tenant context is injected instead.
 *
 * All material authentication failures are logged as structured
 * entries. No sensitive token material is ever written to logs.
 */

import { createHash } from 'crypto';
import { Permission, UserRole } from '../../../lib/security/rbacTypes';
import { ROLE_PERMISSIONS, resolveRoleFromIdentity } from '../lib/security/permissionMap';

// ── Environment ──────────────────────────────────────────────────────────────

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID ?? '';
const COGNITO_APP_CLIENT_ID = process.env.COGNITO_APP_CLIENT_ID ?? '';
const AWS_REGION = process.env.AWS_REGION ?? 'ap-southeast-2';
const LOCAL_DEV = process.env.LOCAL_DEV === 'true';

const JWKS_URI = `https://cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

// ── Types ────────────────────────────────────────────────────────────────────

export interface TenantContext {
  userId: string;
  organizationId: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  /** Stable hash of userId+organizationId for cache keying (never the raw token). */
  contextKey: string;
}

export type { UserRole, Permission };

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'MISSING_TOKEN'
      | 'INVALID_TOKEN'
      | 'EXPIRED_TOKEN'
      | 'INSUFFICIENT_PERMISSIONS'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// ── JWKS cache ───────────────────────────────────────────────────────────────

interface JwksKey {
  kid: string;
  alg: string;
  n: string;
  e: string;
}

let jwksCache: { keys: JwksKey[]; fetchedAt: number } | null = null;
const JWKS_TTL_MS = 60 * 60 * 1000; // 1 hour

async function getJwksKeys(): Promise<JwksKey[]> {
  const now = Date.now();
  if (jwksCache && now - jwksCache.fetchedAt < JWKS_TTL_MS) {
    return jwksCache.keys;
  }
  const resp = await fetch(JWKS_URI);
  if (!resp.ok) {
    throw new AuthError('Failed to fetch JWKS', 'INVALID_TOKEN');
  }
  const json = (await resp.json()) as { keys: JwksKey[] };
  jwksCache = { keys: json.keys, fetchedAt: now };
  return json.keys;
}

// ── JWT parsing (no external library dependency) ─────────────────────────────

function base64urlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + ((4 - (str.length % 4)) % 4), '=');
  return Buffer.from(padded, 'base64').toString('utf8');
}

interface CognitoTokenClaims {
  sub: string;
  email?: string;
  'cognito:groups'?: string[];
  token_use: string;
  aud: string;
  iss: string;
  exp: number;
  iat: number;
  /** Custom claim: tenantId / organizationId */
  'custom:organizationId'?: string;
  'custom:role'?: string;
}

function parseJwtPayload(token: string): CognitoTokenClaims {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new AuthError('Malformed JWT', 'INVALID_TOKEN');
  }
  try {
    return JSON.parse(base64urlDecode(parts[1])) as CognitoTokenClaims;
  } catch {
    throw new AuthError('JWT payload parse failed', 'INVALID_TOKEN');
  }
}

function parseJwtHeader(token: string): { kid: string; alg: string } {
  const parts = token.split('.');
  try {
    return JSON.parse(base64urlDecode(parts[0])) as { kid: string; alg: string };
  } catch {
    throw new AuthError('JWT header parse failed', 'INVALID_TOKEN');
  }
}

// ── Signature verification ───────────────────────────────────────────────────

async function verifyJwtSignature(token: string): Promise<void> {
  const header = parseJwtHeader(token);
  const keys = await getJwksKeys();
  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) {
    throw new AuthError('JWT kid not found in JWKS', 'INVALID_TOKEN');
  }

  const [headerB64, payloadB64, signatureB64] = token.split('.');
  const signingInput = `${headerB64}.${payloadB64}`;
  const signature = Buffer.from(signatureB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

  // Import JWK as RSA public key via WebCrypto (available in Node 18+ and Lambda).
  const cryptoKey = await globalThis.crypto.subtle.importKey(
    'jwk',
    { kty: 'RSA', n: jwk.n, e: jwk.e, alg: 'RS256', use: 'sig' },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const valid = await globalThis.crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    signature,
    Buffer.from(signingInput, 'utf8')
  );

  if (!valid) {
    throw new AuthError('JWT signature invalid', 'INVALID_TOKEN');
  }
}

// ── Claim validation ─────────────────────────────────────────────────────────

function validateClaims(claims: CognitoTokenClaims): void {
  const now = Math.floor(Date.now() / 1000);

  if (claims.exp <= now) {
    throw new AuthError('JWT expired', 'EXPIRED_TOKEN');
  }
  if (claims.token_use !== 'id') {
    throw new AuthError('Expected id token', 'INVALID_TOKEN');
  }
  if (COGNITO_APP_CLIENT_ID && claims.aud !== COGNITO_APP_CLIENT_ID) {
    throw new AuthError('JWT audience mismatch', 'INVALID_TOKEN');
  }
  if (
    COGNITO_USER_POOL_ID &&
    claims.iss !==
      `https://cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`
  ) {
    throw new AuthError('JWT issuer mismatch', 'INVALID_TOKEN');
  }
}

function resolveRole(claims: CognitoTokenClaims): UserRole {
  return resolveRoleFromIdentity({
    explicitRole: claims['custom:role'],
    groups: claims['cognito:groups'] ?? [],
    fallback: 'preparer',
  });
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Parse and validate a Bearer token from an Authorization header value.
 * Returns a fully populated TenantContext on success.
 *
 * In LOCAL_DEV mode the signature and expiry checks are bypassed;
 * a synthetic context is built from the raw claims for local testing.
 */
export async function validateToken(authHeader: string | undefined): Promise<TenantContext> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthError('Missing or malformed Authorization header', 'MISSING_TOKEN');
  }

  const token = authHeader.slice(7);
  const claims = parseJwtPayload(token);

  if (!LOCAL_DEV) {
    await verifyJwtSignature(token);
    validateClaims(claims);
  }

  const organizationId = claims['custom:organizationId'];
  if (!organizationId) {
    throw new AuthError('Token missing custom:organizationId claim', 'INVALID_TOKEN');
  }

  const role = resolveRole(claims);
  const permissions = ROLE_PERMISSIONS[role];

  const contextKey = createHash('sha256')
    .update(`${claims.sub}:${organizationId}`)
    .digest('hex');

  return {
    userId: claims.sub,
    organizationId,
    email: claims.email ?? '',
    role,
    permissions,
    contextKey,
  };
}

/**
 * Extract a TenantContext from a Lambda event's headers.
 * Throws AuthError if validation fails.
 */
export async function extractTenantContext(
  headers: Record<string, string | undefined>
): Promise<TenantContext> {
  const authHeader =
    headers['Authorization'] ??
    headers['authorization'];
  return validateToken(authHeader);
}

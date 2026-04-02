// =====================================================

import { RetentionClassification } from '../../../lib/retention/retentionPolicy';
// Shared domain types for the provider-agnostic layer
// These mirror the existing BotTypes.ts + auth.ts types
// but are decoupled from any specific backend provider.
// =====================================================

// ------ Auth Domain ------

export interface AuthUser {
  /** Internal UUID (maps to Cognito sub or Supabase auth.users.id) */
  id: string;
  email: string;
  organizationId: string;
  role: UserRole;
  permissions: string[];
  metadata: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'user' | 'client';

export interface AuthSession {
  user: AuthUser;
  /** JWT access token (short-lived — 60 min) */
  accessToken: string;
  /** Refresh token (long-lived — 30 days) */
  refreshToken: string;
  /** Unix timestamp (ms) when access token expires */
  expiresAt: number;
  /** Optional: Cognito id_token or Supabase session id */
  idToken?: string;
}

export interface AuthStateChange {
  event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'MFA_REQUIRED';
  session: AuthSession | null;
}

export type AuthStateChangeCallback = (change: AuthStateChange) => void;

export interface MfaSetupResult {
  /** TOTP secret URI (for QR code generation) */
  secretCode: string;
  qrCodeUrl: string;
  /** Session token needed to call verifyMfa after setup */
  session?: string;
}

// ------ Storage Domain ------

export interface StorageUploadOptions {
  /** Content-Type MIME type */
  contentType: string;
  /** Tenant organisation ID — used for key namespacing */
  organizationId: string;
  /** Client / entity being verified */
  clientId: string;
  /** Bot run that produced this evidence */
  runId: string;
  /** Friendly identifier for the evidence item */
  evidenceId: string;
  /** Original filename */
  filename: string;
  /** Additional metadata tags */
  tags?: Record<string, string>;
  /** If true, mark for WORM retention (compliance evidence) */
  immutable?: boolean;
  retentionUntil?: string;
  retentionPolicyId?: string;
  retentionClassification?: RetentionClassification;
  archiveEligible?: boolean;
  deleteEligible?: boolean;
  legalHold?: boolean;
  legalHoldReason?: string;
  legalHoldSetBy?: string;
  legalHoldSetAt?: string;
}

export interface StorageObject {
  /** Provider key / path */
  key: string;
  /** S3 bucket name or Supabase bucket id */
  bucket: string;
  /** S3 version ID (for WORM/versioned buckets) */
  versionId?: string;
  /** ETag from the upload response */
  etag?: string;
  /** Object size in bytes */
  size?: number;
  /** Upload timestamp */
  uploadedAt: string;
  retentionUntil?: string;
  retentionPolicyId?: string;
  retentionClassification?: RetentionClassification;
  archiveEligible?: boolean;
  deleteEligible?: boolean;
  legalHold?: boolean;
  legalHoldReason?: string;
  legalHoldSetBy?: string;
  legalHoldSetAt?: string;
}

export interface StorageDownloadUrl {
  /** Pre-signed or authorised URL */
  url: string;
  /** Expiry timestamp (Unix ms) */
  expiresAt: number;
}

// ------ Audit Domain ------

export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AuditEventInput {
  organizationId?: string;
  actorUserId?: string;
  eventType: string;
  severity: AuditSeverity;
  action: string;
  resourceType: string;
  resourceId?: string;
  module?: string;
  data?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  requestUrl?: string;
  retentionUntil?: string;
  retentionPolicyId?: string;
  retentionClassification?: RetentionClassification;
  archiveEligible?: boolean;
  deleteEligible?: boolean;
  legalHold?: boolean;
  legalHoldReason?: string;
  legalHoldSetBy?: string;
  legalHoldSetAt?: string;
}

export interface AuditEvent extends AuditEventInput {
  /** Immutable UUID */
  id: string;
  /** Monotonically increasing; gaps indicate tampering */
  sequenceNumber?: number;
  /** ISO-8601 timestamp */
  occurredAt: string;
}

export interface AuditQueryFilter {
  organizationId?: string;
  actorUserId?: string;
  eventType?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  severity?: AuditSeverity;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  cursor?: string;
}

export interface AuditQueryResult {
  events: AuditEvent[];
  total: number;
  nextCursor?: string;
}

// ------ Database Domain (KYC/AML entities) ------

export interface OrganizationProfile {
  id: string;
  name: string;
  slug: string;
  subscriptionTier: 'trial' | 'starter' | 'professional' | 'enterprise';
  subscriptionStatus: 'active' | 'trial' | 'past_due' | 'cancelled' | 'suspended';
  enabledModules: string[];
  maxUsers: number;
  maxStorageGb: number;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  organizationId: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  moduleRoles: Record<string, string>;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended' | 'invited';
  mfaEnabled: boolean;
  lastLoginAt?: string;
  lastLoginIp?: string;
}

// Re-export from existing BotTypes for convenience
export type {
  BotRunRecord,
  BotRunStatus,
  BotRunTrigger,
  BotResult,
  BotEvidenceItem,
  BotOutcomeStatus,
  PersistedBotResult,
  AuditEvent as BotAuditEvent,
  EvidencePack,
  EvidencePackItem,
} from '../../services/BotTypes';

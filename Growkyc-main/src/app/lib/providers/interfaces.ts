import {
  AuditEvent,
  AuditEventInput,
  AuditQueryFilter,
  AuditQueryResult,
  AuthSession,
  AuthStateChangeCallback,
  AuthUser,
  BotResult,
  BotRunRecord,
  EvidencePack,
  PersistedBotResult,
  StorageDownloadUrl,
  StorageObject,
  StorageUploadOptions,
} from './types';
import {
  AlertRecord,
  BotFinding,
  CaseRecord,
  CaseStatus,
  CaseStatusHistoryEntry,
  EscalationLevel,
  PeriodicReview,
  ProviderLog,
} from '../../services/BotTypes';
import { RetentionClassification } from '../../../lib/retention/retentionPolicy';

export interface IAuthProvider {
  getCurrentSession(): Promise<AuthSession | null>;
  getCurrentUser(): Promise<AuthUser | null>;
  signIn(email: string, password: string): Promise<{ success: boolean; session?: AuthSession; error?: string }>;
  signOut(): Promise<void>;
  onAuthStateChange(callback: AuthStateChangeCallback): () => void;
}

export interface IStorageProvider {
  createUploadTarget(options: StorageUploadOptions): Promise<StorageObject>;
  createDownloadUrl(params: {
    bucket?: string;
    key: string;
    expiresInSeconds?: number;
    organizationId?: string;
  }): Promise<StorageDownloadUrl>;
}

export interface IDatabaseProvider {
  // ── Bot runs ──────────────────────────────────────────────────────────────
  createBotRun(run: BotRunRecord): Promise<void>;
  updateBotRun(runId: string, patch: Partial<BotRunRecord>): Promise<void>;
  createBotResult(result: PersistedBotResult): Promise<void>;
  createBotResultEvidence(params: {
    runId: string;
    botId: string;
    result: BotResult;
    organizationId?: string;
    retentionUntil?: string;
    retentionPolicyId?: string;
    retentionClassification?: RetentionClassification;
    archiveEligible?: boolean;
    deleteEligible?: boolean;
    legalHold?: boolean;
    legalHoldReason?: string;
    legalHoldSetBy?: string;
    legalHoldSetAt?: string;
  }): Promise<void>;
  createEvidencePack(pack: EvidencePack): Promise<void>;

  // ── Cases ─────────────────────────────────────────────────────────────────
  createCase(caseRecord: Omit<CaseRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<CaseRecord>;
  updateCase(
    caseId: string,
    organizationId: string,
    patch: Partial<Pick<CaseRecord, 'status' | 'riskScore' | 'overallDecision' | 'closedAt' | 'metadata'>>
  ): Promise<void>;
  getCaseById(caseId: string, organizationId: string): Promise<CaseRecord | null>;
  setLegalHold(
    caseId: string,
    organizationId: string,
    hold: boolean,
    params: { reason?: string; holdUntil?: string; setByUserId: string }
  ): Promise<void>;

  // ── Case status history ───────────────────────────────────────────────────
  createCaseStatusHistory(
    entry: Omit<CaseStatusHistoryEntry, 'id' | 'changedAt' | 'sequenceNumber'>
  ): Promise<CaseStatusHistoryEntry>;

  // ── Findings ──────────────────────────────────────────────────────────────
  createFinding(finding: Omit<BotFinding, 'id' | 'createdAt'>): Promise<BotFinding>;
  getFindingsByCaseId(caseId: string, organizationId: string): Promise<BotFinding[]>;

  // ── Alerts ────────────────────────────────────────────────────────────────
  createAlert(alert: Omit<AlertRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AlertRecord>;
  resolveAlert(
    alertId: string,
    organizationId: string,
    params: { resolvedByUserId: string; resolutionNote?: string }
  ): Promise<void>;

  // ── Periodic reviews ──────────────────────────────────────────────────────
  createPeriodicReview(
    review: Omit<PeriodicReview, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PeriodicReview>;
  updatePeriodicReview(
    reviewId: string,
    organizationId: string,
    patch: Partial<Pick<PeriodicReview, 'completedAt' | 'outcome' | 'notes'>>
  ): Promise<void>;

  // ── Provider logs ─────────────────────────────────────────────────────────
  createProviderLog(log: Omit<ProviderLog, 'id' | 'calledAt'>): Promise<ProviderLog>;
}

export interface IAuditProvider {
  createAuditEvent(input: AuditEventInput): Promise<AuditEvent>;
  queryAuditEvents(filter: AuditQueryFilter): Promise<AuditQueryResult>;
}

export interface IProviderAdapterRegistry {
  auth: IAuthProvider;
  storage: IStorageProvider;
  database: IDatabaseProvider;
  audit: IAuditProvider;
}

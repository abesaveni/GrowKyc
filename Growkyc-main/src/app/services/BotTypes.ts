import { RetentionClassification } from '../../lib/retention/retentionPolicy';

export type BotCategory =
  | 'identity'
  | 'aml'
  | 'credit'
  | 'property'
  | 'affordability'
  | 'entity'
  | 'comprehensive';

export type BotOutcomeStatus = 'passed' | 'failed' | 'alert';

export type BotRunStatus =
  | 'pending'
  | 'running'
  | 'passed'
  | 'failed'
  | 'alert'
  | 'error';

export type BotRunTrigger = 'manual' | 'scheduled' | 'event' | 'orchestration';

export interface BotEvidenceItem {
  id: string;
  title: string;
  source: string;
  evidenceType: 'document' | 'screening' | 'api-response' | 'note';
  confidence: number;
  capturedAt: string;
  s3Bucket?: string;
  s3Key?: string;
  s3VersionId?: string;
  s3Etag?: string;
  metadata?: Record<string, unknown>;
}

export interface BotResult {
  status: BotOutcomeStatus;
  score: number;
  summary: string;
  findings: string[];
  evidence: BotEvidenceItem[];
  metadata?: Record<string, unknown>;
}

export interface BotRunContext {
  clientId: string;
  clientName: string;
  caseId?: string;
  organizationId?: string;
  actorUserId?: string;
  trigger?: BotRunTrigger;
}

export interface BotDescriptor {
  id: string;
  name: string;
  description: string;
  category: BotCategory;
  provider: string;
  cost: number;
  version: string;
  enabled: boolean;
}

export interface ComplianceBot extends BotDescriptor {
  run(context: BotRunContext): Promise<BotResult>;
}

export interface BotRunRecord {
  id: string;
  clientId: string;
  clientName: string;
  caseId?: string;
  organizationId?: string;
  botId: string;
  botVersion: string;
  provider: string;
  status: BotRunStatus;
  trigger: BotRunTrigger;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  errorMessage?: string;
}

export interface PersistedBotResult {
  id: string;
  runId: string;
  botId: string;
  status: BotOutcomeStatus;
  score: number;
  summary: string;
  findings: string[];
  rawResult: BotResult;
  persistedAt: string;
}

export interface AuditEvent {
  id: string;
  sequenceNumber?: number;
  organizationId?: string;
  actorUserId?: string;
  eventType: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  targetType: string;
  targetId?: string;
  data?: Record<string, unknown>;
  occurredAt: string;
  retentionUntil?: string;
  retentionPolicyId?: string;
  retentionClassification?: RetentionClassification;
  archiveEligible?: boolean;
  deleteEligible?: boolean;
}

export interface EvidencePackItem {
  id: string;
  runId: string;
  botId: string;
  title: string;
  source: string;
  evidenceType: BotEvidenceItem['evidenceType'];
  confidence: number;
  capturedAt: string;
  s3Bucket?: string;
  s3Key?: string;
  s3VersionId?: string;
  s3Etag?: string;
  metadata?: Record<string, unknown>;
  retentionUntil?: string;
  retentionPolicyId?: string;
  retentionClassification?: RetentionClassification;
  archiveEligible?: boolean;
  deleteEligible?: boolean;
}

export interface EvidencePack {
  id: string;
  organizationId?: string;
  clientId: string;
  clientName: string;
  caseId?: string;
  runIds: string[];
  generatedAt: string;
  retentionUntil?: string;
  retentionPolicyId?: string;
  retentionClassification?: RetentionClassification;
  legalHold?: boolean;
  archiveEligible?: boolean;
  deleteEligible?: boolean;
  summary: {
    passed: number;
    alert: number;
    failed: number;
    averageScore: number;
  };
  items: EvidencePackItem[];
}

// ─── Phase 2: Case management types ─────────────────────────────────────────

export type CaseStatus =
  | 'open'
  | 'in_review'
  | 'escalated'
  | 'closed'
  | 'legal_hold';

export type FindingDecision =
  | 'pass'
  | 'fail'
  | 'manual_review'
  | 'insufficient_data';

export type FindingSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AlertType =
  | 'review_required'
  | 'escalation'
  | 'legal_hold_triggered'
  | 'retention_expiring'
  | 'provider_failure'
  | 'compliance_breach';

export type EscalationLevel = 'level_1' | 'level_2' | 'level_3' | 'regulatory';

export interface CaseRecord {
  id: string;
  organizationId: string;
  clientId: string;
  assignedToUserId?: string;
  status: CaseStatus;
  riskScore?: number;
  overallDecision?: FindingDecision;
  legalHold: boolean;
  legalHoldReason?: string;
  legalHoldUntil?: string;
  legalHoldSetBy?: string;
  legalHoldSetAt?: string;
  retentionUntil?: string;
  retentionPolicyId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface CaseStatusHistoryEntry {
  id: string;
  caseId: string;
  organizationId: string;
  fromStatus?: CaseStatus;
  toStatus: CaseStatus;
  reason?: string;
  changedByUserId?: string;
  changedAt: string;
  sequenceNumber?: number;
}

export interface BotFinding {
  id: string;
  organizationId: string;
  caseId: string;
  runId?: string;
  botId: string;
  findingType: string;
  severity: FindingSeverity;
  decision: FindingDecision;
  confidence?: number;
  score?: number;
  description?: string;
  details?: Record<string, unknown>;
  evidenceRefs?: string[];
  retentionUntil?: string;
  legalHold: boolean;
  createdAt: string;
}

export interface AlertRecord {
  id: string;
  organizationId: string;
  caseId?: string;
  runId?: string;
  alertType: AlertType;
  escalationLevel?: EscalationLevel;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  isResolved: boolean;
  resolvedByUserId?: string;
  resolvedAt?: string;
  resolutionNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PeriodicReview {
  id: string;
  organizationId: string;
  caseId: string;
  dueAt: string;
  completedAt?: string;
  assignedToUserId?: string;
  outcome?: FindingDecision;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderLog {
  id: string;
  organizationId: string;
  runId?: string;
  caseId?: string;
  botId: string;
  providerName: string;
  requestHash?: string;
  responseCode?: number;
  durationMs?: number;
  retryCount: number;
  errorCode?: string;
  errorMessage?: string;
  succeeded: boolean;
  calledAt: string;
  retentionUntil?: string;
  retentionPolicyId?: string;
  retentionClassification?: RetentionClassification;
  archiveEligible?: boolean;
  deleteEligible?: boolean;
}

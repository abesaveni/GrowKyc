import {
  AuditEvent,
  BotFinding,
  BotResult,
  BotRunRecord,
  CaseStatus,
  CaseStatusHistoryEntry,
  EvidencePack,
  FindingDecision,
  FindingSeverity,
  PersistedBotResult,
} from './BotTypes';
import { providerRegistry } from '../lib/providers/providerRegistry';
import {
  buildDefaultRetentionMetadata,
  evaluateRetentionStatus,
} from '../../lib/retention/retentionPolicy';

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createStableId(prefix: string, keyParts: string[]): string {
  const source = keyParts.join('|');
  let hash = 2166136261;

  for (let i = 0; i < source.length; i += 1) {
    hash ^= source.charCodeAt(i);
    hash +=
      (hash << 1) +
      (hash << 4) +
      (hash << 7) +
      (hash << 8) +
      (hash << 24);
  }

  return `${prefix}-${(hash >>> 0).toString(36)}`;
}

function hasLegacyFallbackConfig(): boolean {
  const viteEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
  const processEnv = ((globalThis as any)?.process?.env || {}) as Record<string, string>;

  return Boolean(
    viteEnv.VITE_SUPABASE_URL ||
      viteEnv.VITE_SUPABASE_ANON_KEY ||
      processEnv.NEXT_PUBLIC_SUPABASE_URL ||
      processEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      viteEnv.VITE_API_URL
  );
}

export class BotPersistenceRepository {
  private localRuns = new Map<string, BotRunRecord>();
  private localResults = new Map<string, PersistedBotResult>();
  private localAuditEvents = new Map<string, AuditEvent>();
  private localEvidencePacks = new Map<string, EvidencePack>();
  private findingWriteGuards = new Set<string>();
  private caseStatusWriteGuards = new Set<string>();

  async createRun(run: BotRunRecord): Promise<BotRunRecord> {
    const existing = this.localRuns.get(run.id);
    if (existing) {
      return existing;
    }

    this.localRuns.set(run.id, run);

    if (!hasLegacyFallbackConfig()) {
      return run;
    }

    try {
      await providerRegistry.database.createBotRun(run);
    } catch (error) {
      console.warn('[BotPersistence] createRun failed, using local fallback:', error);
    }

    return run;
  }

  async completeRun(runId: string, patch: Partial<BotRunRecord>): Promise<BotRunRecord | undefined> {
    const current = this.localRuns.get(runId);
    if (!current) return undefined;

    const merged: BotRunRecord = {
      ...current,
      ...patch,
    };

    this.localRuns.set(runId, merged);

    if (!hasLegacyFallbackConfig()) {
      return merged;
    }

    try {
      await providerRegistry.database.updateBotRun(runId, patch);
    } catch (error) {
      console.warn('[BotPersistence] completeRun failed, using local fallback:', error);
    }

    return merged;
  }

  async persistResult(
    runId: string,
    botId: string,
    result: BotResult,
    options?: {
      organizationId?: string;
      caseId?: string;
      retentionUntil?: string;
      retentionPolicyId?: string;
      retentionClassification?: 'compliance_record' | 'audit_record' | 'provider_record' | 'document_record';
      archiveEligible?: boolean;
      deleteEligible?: boolean;
      legalHold?: boolean;
    }
  ): Promise<PersistedBotResult> {
    const idempotencyKey = `${runId}:${botId}`;
    const existing = this.localResults.get(idempotencyKey);
    if (existing) {
      return existing;
    }

    const persisted: PersistedBotResult = {
      id: createStableId('bot-result', [runId, botId]),
      runId,
      botId,
      status: result.status,
      score: result.score,
      summary: result.summary,
      findings: result.findings,
      rawResult: result,
      persistedAt: new Date().toISOString(),
    };

    this.localResults.set(idempotencyKey, persisted);

    const documentRetentionMetadata = buildDefaultRetentionMetadata({
      entityType: 'document',
      occurredAt: persisted.persistedAt,
      retentionUntil: options?.retentionUntil,
      retentionPolicyId: options?.retentionPolicyId,
      retentionClassification: options?.retentionClassification,
    });
    const documentRetentionStatus = evaluateRetentionStatus({
      retentionUntil: documentRetentionMetadata.retentionUntil,
      legalHold: options?.legalHold,
    });

    if (!hasLegacyFallbackConfig()) {
      if (options?.caseId && options.organizationId) {
        await this.persistFindingsForCase({
          organizationId: options.organizationId,
          caseId: options.caseId,
          runId,
          botId,
          result,
          retentionUntil: documentRetentionMetadata.retentionUntil,
          legalHold: options.legalHold,
        });
      }

      return persisted;
    }

    try {
      await providerRegistry.database.createBotResult(persisted);

      if (result.evidence.length > 0) {
        await providerRegistry.database.createBotResultEvidence({
          runId,
          botId,
          result,
          organizationId: options?.organizationId,
          retentionUntil: documentRetentionMetadata.retentionUntil,
          retentionPolicyId: documentRetentionMetadata.retentionPolicyId,
          retentionClassification: documentRetentionMetadata.retentionClassification,
          archiveEligible: options?.archiveEligible ?? documentRetentionStatus.archiveEligible,
          deleteEligible: options?.deleteEligible ?? documentRetentionStatus.deleteEligible,
          legalHold: options?.legalHold,
        });
      }

      if (options?.caseId && options.organizationId) {
        await this.persistFindingsForCase({
          organizationId: options.organizationId,
          caseId: options.caseId,
          runId,
          botId,
          result,
          retentionUntil: documentRetentionMetadata.retentionUntil,
          legalHold: options.legalHold,
        });
      }
    } catch (error) {
      console.warn('[BotPersistence] persistResult failed, using local fallback:', error);
    }

    return persisted;
  }

  async persistAuditEvent(event: AuditEvent): Promise<AuditEvent> {
    const existing = this.localAuditEvents.get(event.id);
    if (existing) {
      return existing;
    }

    this.localAuditEvents.set(event.id, event);

    const auditRetentionMetadata = buildDefaultRetentionMetadata({
      entityType: 'audit_event',
      occurredAt: event.occurredAt,
      retentionUntil: event.retentionUntil,
      retentionPolicyId: event.retentionPolicyId,
      retentionClassification: event.retentionClassification,
    });
    const auditRetentionStatus = evaluateRetentionStatus({
      retentionUntil: auditRetentionMetadata.retentionUntil,
    });

    event.retentionUntil = auditRetentionMetadata.retentionUntil;
    event.retentionPolicyId = auditRetentionMetadata.retentionPolicyId;
    event.retentionClassification = auditRetentionMetadata.retentionClassification;
    event.archiveEligible = event.archiveEligible ?? auditRetentionStatus.archiveEligible;
    event.deleteEligible = event.deleteEligible ?? auditRetentionStatus.deleteEligible;

    if (!hasLegacyFallbackConfig()) {
      return event;
    }

    try {
      const persisted = await providerRegistry.audit.createAuditEvent({
        organizationId: event.organizationId,
        actorUserId: event.actorUserId,
        eventType: event.eventType,
        severity: event.severity,
        action: event.eventType,
        resourceType: event.targetType,
        resourceId: event.targetId,
        module: 'grow_kyc',
        data: event.data || {},
        retentionUntil: event.retentionUntil,
        retentionPolicyId: event.retentionPolicyId,
        retentionClassification: event.retentionClassification,
        archiveEligible: event.archiveEligible,
        deleteEligible: event.deleteEligible,
      });

      event.sequenceNumber = persisted.sequenceNumber;
    } catch (error) {
      console.warn('[BotPersistence] persistAuditEvent failed, using local fallback:', error);
    }

    return event;
  }

  async persistEvidencePack(pack: EvidencePack): Promise<EvidencePack> {
    const evidencePackRetentionMetadata = buildDefaultRetentionMetadata({
      entityType: 'evidence_pack',
      occurredAt: pack.generatedAt,
      retentionUntil: pack.retentionUntil,
      retentionPolicyId: pack.retentionPolicyId,
      retentionClassification: pack.retentionClassification,
    });
    const evidencePackRetentionStatus = evaluateRetentionStatus({
      retentionUntil: evidencePackRetentionMetadata.retentionUntil,
      legalHold: pack.legalHold,
    });

    pack.retentionUntil = evidencePackRetentionMetadata.retentionUntil;
    pack.retentionPolicyId = evidencePackRetentionMetadata.retentionPolicyId;
    pack.retentionClassification = evidencePackRetentionMetadata.retentionClassification;
    pack.archiveEligible = pack.archiveEligible ?? evidencePackRetentionStatus.archiveEligible;
    pack.deleteEligible = pack.deleteEligible ?? evidencePackRetentionStatus.deleteEligible;
    pack.items = pack.items.map((item) => ({
      ...item,
      retentionUntil: item.retentionUntil || pack.retentionUntil,
      retentionPolicyId: item.retentionPolicyId || pack.retentionPolicyId,
      retentionClassification: item.retentionClassification || 'document_record',
      archiveEligible: item.archiveEligible ?? pack.archiveEligible,
      deleteEligible: item.deleteEligible ?? pack.deleteEligible,
    }));

    const existing = this.localEvidencePacks.get(pack.id);
    if (existing) {
      return existing;
    }

    this.localEvidencePacks.set(pack.id, pack);

    if (!hasLegacyFallbackConfig()) {
      return pack;
    }

    try {
      await providerRegistry.database.createEvidencePack(pack);
    } catch (error) {
      console.warn('[BotPersistence] persistEvidencePack failed, using local fallback:', error);
    }

    return pack;
  }

  async appendCaseStatusHistory(
    entry: Omit<CaseStatusHistoryEntry, 'id' | 'changedAt' | 'sequenceNumber'> & {
      idempotencyKey?: string;
    }
  ): Promise<CaseStatusHistoryEntry | undefined> {
    const writeKey =
      entry.idempotencyKey ||
      `${entry.caseId}:${entry.toStatus}:${entry.reason || ''}:${entry.changedByUserId || ''}`;

    if (this.caseStatusWriteGuards.has(writeKey)) {
      return undefined;
    }

    const localEntry: CaseStatusHistoryEntry = {
      id: createStableId('case-status', [writeKey]),
      caseId: entry.caseId,
      organizationId: entry.organizationId,
      fromStatus: entry.fromStatus,
      toStatus: entry.toStatus,
      reason: entry.reason,
      changedByUserId: entry.changedByUserId,
      changedAt: new Date().toISOString(),
    };

    this.caseStatusWriteGuards.add(writeKey);

    if (!hasLegacyFallbackConfig()) {
      return localEntry;
    }

    try {
      const persisted = await providerRegistry.database.createCaseStatusHistory({
        ...entry,
        id: localEntry.id,
      } as Omit<CaseStatusHistoryEntry, 'id' | 'changedAt' | 'sequenceNumber'>);

      return persisted;
    } catch (error) {
      console.warn('[BotPersistence] appendCaseStatusHistory failed, using local fallback:', error);
      return localEntry;
    }
  }

  async updateCaseAfterAssessment(
    caseId: string,
    organizationId: string,
    patch: {
      riskScore?: number;
      overallDecision?: FindingDecision;
    }
  ): Promise<void> {
    if (!hasLegacyFallbackConfig()) {
      return;
    }

    const status = this.mapDecisionToCaseStatus(patch.overallDecision);

    try {
      await providerRegistry.database.updateCase(caseId, organizationId, {
        riskScore: patch.riskScore,
        overallDecision: patch.overallDecision,
        status,
      });
    } catch (error) {
      console.warn('[BotPersistence] updateCaseAfterAssessment failed, using local fallback:', error);
    }
  }

  async logProviderCall(input: {
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
    retentionUntil?: string;
    retentionPolicyId?: string;
    retentionClassification?: 'compliance_record' | 'audit_record' | 'provider_record' | 'document_record';
    archiveEligible?: boolean;
    deleteEligible?: boolean;
  }): Promise<void> {
    if (!hasLegacyFallbackConfig()) {
      return;
    }

    try {
      const providerRetentionMetadata = buildDefaultRetentionMetadata({
        entityType: 'provider_log',
        retentionUntil: input.retentionUntil,
        retentionPolicyId: input.retentionPolicyId,
        retentionClassification: input.retentionClassification,
      });
      const providerRetentionStatus = evaluateRetentionStatus({
        retentionUntil: providerRetentionMetadata.retentionUntil,
      });

      await providerRegistry.database.createProviderLog({
        ...input,
        retentionUntil: providerRetentionMetadata.retentionUntil,
        retentionPolicyId: providerRetentionMetadata.retentionPolicyId,
        retentionClassification: providerRetentionMetadata.retentionClassification,
        archiveEligible: input.archiveEligible ?? providerRetentionStatus.archiveEligible,
        deleteEligible: input.deleteEligible ?? providerRetentionStatus.deleteEligible,
      });
    } catch (error) {
      console.warn('[BotPersistence] logProviderCall failed, using local fallback:', error);
    }
  }

  async escalateCase(
    caseId: string,
    organizationId: string,
    params: { reason?: string; changedByUserId?: string }
  ): Promise<void> {
    await this.updateCaseAfterAssessment(caseId, organizationId, {
      overallDecision: 'fail',
    });

    await this.appendCaseStatusHistory({
      caseId,
      organizationId,
      fromStatus: 'in_review',
      toStatus: 'escalated',
      reason: params.reason || 'Escalated after bot execution retries exhausted',
      changedByUserId: params.changedByUserId,
      idempotencyKey: `escalate:${caseId}:${params.reason || ''}`,
    });
  }

  private async persistFindingsForCase(params: {
    organizationId: string;
    caseId: string;
    runId: string;
    botId: string;
    result: BotResult;
    retentionUntil?: string;
    legalHold?: boolean;
  }): Promise<void> {
    const writeKey = `${params.caseId}:${params.runId}:${params.botId}`;
    if (this.findingWriteGuards.has(writeKey)) {
      return;
    }

    const decision = this.mapResultStatusToDecision(params.result.status);
    const severity = this.mapResultToSeverity(params.result.status, params.result.score);

    const findingsToPersist = params.result.findings.map((finding, index) => ({
      id: createStableId('finding', [params.caseId, params.runId, params.botId, String(index), finding]),
      organizationId: params.organizationId,
      caseId: params.caseId,
      runId: params.runId,
      botId: params.botId,
      findingType: 'bot_result_finding',
      severity,
      decision,
      confidence: Math.max(0, Math.min(1, params.result.score / 100)),
      score: params.result.score,
      description: finding,
      details: {
        summary: params.result.summary,
        outcome: params.result.status,
        findingIndex: index,
      },
      evidenceRefs: params.result.evidence.map((evidence) => evidence.id),
      retentionUntil: params.retentionUntil,
      legalHold: Boolean(params.legalHold),
    }));

    if (findingsToPersist.length === 0) {
      this.findingWriteGuards.add(writeKey);
      return;
    }

    for (const finding of findingsToPersist) {
      try {
        await providerRegistry.database.createFinding(finding as Omit<BotFinding, 'id' | 'createdAt'>);
      } catch (error) {
        console.warn('[BotPersistence] persistFindingsForCase failed, using local fallback:', error);
        return;
      }
    }

    this.findingWriteGuards.add(writeKey);
  }

  private mapResultStatusToDecision(status: BotResult['status']): FindingDecision {
    if (status === 'passed') {
      return 'pass';
    }

    if (status === 'failed') {
      return 'fail';
    }

    return 'manual_review';
  }

  private mapDecisionToCaseStatus(decision: FindingDecision | undefined): CaseStatus {
    if (decision === 'pass') {
      return 'open';
    }

    if (decision === 'fail') {
      return 'escalated';
    }

    return 'in_review';
  }

  private mapResultToSeverity(status: BotResult['status'], score: number): FindingSeverity {
    if (status === 'failed') {
      return score < 40 ? 'critical' : 'high';
    }

    if (status === 'alert') {
      return 'medium';
    }

    return 'low';
  }
}

export const botPersistenceRepository = new BotPersistenceRepository();

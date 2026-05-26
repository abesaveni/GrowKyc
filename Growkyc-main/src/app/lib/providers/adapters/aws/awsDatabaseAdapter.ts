import { IDatabaseProvider } from '../../interfaces';
import { BotResult, BotRunRecord, EvidencePack, PersistedBotResult } from '../../types';
import {
  AlertRecord,
  BotFinding,
  CaseRecord,
  CaseStatusHistoryEntry,
  PeriodicReview,
  ProviderLog,
} from '../../../../services/BotTypes';
import { AwsApiClient } from './awsApiClient';

export class AwsDatabaseAdapter implements IDatabaseProvider {
  constructor(private readonly client: AwsApiClient) {}

  async createBotRun(run: BotRunRecord): Promise<void> {
    await this.client.post('/api/bot-runs', { run });
  }

  async updateBotRun(runId: string, patch: Partial<BotRunRecord>): Promise<void> {
    await this.client.post(`/api/bot-runs/${runId}`, { patch });
  }

  async createBotResult(result: PersistedBotResult): Promise<void> {
    await this.client.post('/api/bot-results', { result });
  }

  async createBotResultEvidence(params: {
    runId: string;
    botId: string;
    result: BotResult;
    organizationId?: string;
    retentionUntil?: string;
    retentionPolicyId?: string;
    retentionClassification?: 'compliance_record' | 'audit_record' | 'provider_record' | 'document_record';
    archiveEligible?: boolean;
    deleteEligible?: boolean;
    legalHold?: boolean;
    legalHoldReason?: string;
    legalHoldSetBy?: string;
    legalHoldSetAt?: string;
  }): Promise<void> {
    await this.client.post('/api/bot-results/evidence', params);
  }

  async createEvidencePack(pack: EvidencePack): Promise<void> {
    await this.client.post('/api/evidence-packs', { pack });
  }

  async createCase(caseRecord: Omit<CaseRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<CaseRecord> {
    return this.client.post('/api/cases', { caseRecord });
  }

  async updateCase(
    caseId: string,
    organizationId: string,
    patch: Partial<Pick<CaseRecord, 'status' | 'riskScore' | 'overallDecision' | 'closedAt' | 'metadata'>>
  ): Promise<void> {
    await this.client.post(`/api/cases/${caseId}`, { organizationId, patch });
  }

  async getCaseById(caseId: string, organizationId: string): Promise<CaseRecord | null> {
    return this.client.get(`/api/cases/${caseId}?organizationId=${encodeURIComponent(organizationId)}`);
  }

  async setLegalHold(
    caseId: string,
    organizationId: string,
    hold: boolean,
    params: { reason?: string; holdUntil?: string; setByUserId: string }
  ): Promise<void> {
    await this.client.post(`/api/cases/${caseId}/legal-hold`, { organizationId, hold, params });
  }

  async createCaseStatusHistory(
    entry: Omit<CaseStatusHistoryEntry, 'id' | 'changedAt' | 'sequenceNumber'>
  ): Promise<CaseStatusHistoryEntry> {
    return this.client.post('/api/cases/status-history', { entry });
  }

  async createFinding(finding: Omit<BotFinding, 'id' | 'createdAt'>): Promise<BotFinding> {
    return this.client.post('/api/findings', { finding });
  }

  async getFindingsByCaseId(caseId: string, organizationId: string): Promise<BotFinding[]> {
    return this.client.get(
      `/api/findings?caseId=${encodeURIComponent(caseId)}&organizationId=${encodeURIComponent(organizationId)}`
    );
  }

  async createAlert(alert: Omit<AlertRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AlertRecord> {
    return this.client.post('/api/alerts', { alert });
  }

  async resolveAlert(
    alertId: string,
    organizationId: string,
    params: { resolvedByUserId: string; resolutionNote?: string }
  ): Promise<void> {
    await this.client.post(`/api/alerts/${alertId}/resolve`, { organizationId, params });
  }

  async createPeriodicReview(
    review: Omit<PeriodicReview, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PeriodicReview> {
    return this.client.post('/api/periodic-reviews', { review });
  }

  async updatePeriodicReview(
    reviewId: string,
    organizationId: string,
    patch: Partial<Pick<PeriodicReview, 'completedAt' | 'outcome' | 'notes'>>
  ): Promise<void> {
    await this.client.post(`/api/periodic-reviews/${reviewId}`, { organizationId, patch });
  }

  async createProviderLog(log: Omit<ProviderLog, 'id' | 'calledAt'>): Promise<ProviderLog> {
    return this.client.post('/api/provider-logs', { log });
  }
}

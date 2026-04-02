import { AuditQueryFilter } from '../../app/lib/providers/types';
import {
  AlertRecord,
  BotFinding,
  BotRunRecord,
  CaseRecord,
  CaseStatusHistoryEntry,
  EvidencePack,
  PeriodicReview,
} from '../../app/services/BotTypes';

export type TenantResourceType =
  | 'bot_runs'
  | 'findings'
  | 'evidence_packs'
  | 'audit_events'
  | 'alerts'
  | 'periodic_reviews'
  | 'case_status_history';

export interface TenantPrincipal {
  tenantId: string;
  actorUserId: string;
  email: string;
  role: string;
}

export interface TenantAwareQuery<TFilter extends Record<string, unknown>> {
  tenantId: string;
  filter: TFilter;
}

export interface TenantSafeAuditService {
  buildScopedAuditQuery(query: TenantAwareQuery<AuditQueryFilter>): AuditQueryFilter;
}

export interface TenantSafeDatabaseService {
  assertCaseOwnership(tenantId: string, caseId: string): Promise<CaseRecord>;
  assertExecutionScopeGuards(tenantId: string, organizationId?: string): void;
  appendCaseStatusHistoryForTenant(
    tenantId: string,
    entry: Omit<CaseStatusHistoryEntry, 'id' | 'changedAt' | 'sequenceNumber'> & {
      idempotencyKey?: string;
    }
  ): Promise<CaseStatusHistoryEntry | undefined>;
  assertTenantWrite(resource: TenantResourceType, tenantId: string, payloadOrganizationId?: string): void;
}

export interface TenantGuardedPayloads {
  botRun: BotRunRecord;
  finding: Omit<BotFinding, 'id' | 'createdAt'>;
  evidencePack: EvidencePack;
  alert: Omit<AlertRecord, 'id' | 'createdAt' | 'updatedAt'>;
  periodicReview: Omit<PeriodicReview, 'id' | 'createdAt' | 'updatedAt'>;
  caseStatusHistory: Omit<CaseStatusHistoryEntry, 'id' | 'changedAt' | 'sequenceNumber'>;
}
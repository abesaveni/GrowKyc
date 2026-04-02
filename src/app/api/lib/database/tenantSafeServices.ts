import { providerRegistry } from '../../../lib/providers/providerRegistry';
import { botPersistenceRepository } from '../../../services/BotPersistence';
import { CaseRecord, CaseStatusHistoryEntry } from '../../../services/BotTypes';
import {
  TenantResourceType,
  TenantSafeDatabaseService,
} from '../../../../lib/tenant/tenantSafeInterfaces';
import { assertTenantOwnership, TenantIsolationError } from '../auth/tenantIsolation';

class ApiTenantSafeDatabaseService implements TenantSafeDatabaseService {
  async assertCaseOwnership(tenantId: string, caseId: string): Promise<CaseRecord> {
    const existingCase = await providerRegistry.database.getCaseById(caseId, tenantId);

    if (!existingCase) {
      throw new TenantIsolationError('Case not found for tenant');
    }

    this.assertTenantWrite('case_status_history', tenantId, existingCase.organizationId);
    return existingCase;
  }

  assertExecutionScopeGuards(tenantId: string, organizationId?: string): void {
    const resourceTypes: TenantResourceType[] = [
      'bot_runs',
      'findings',
      'evidence_packs',
      'audit_events',
      'alerts',
      'periodic_reviews',
      'case_status_history',
    ];

    for (const resourceType of resourceTypes) {
      this.assertTenantWrite(resourceType, tenantId, organizationId);
    }
  }

  async appendCaseStatusHistoryForTenant(
    tenantId: string,
    entry: Omit<CaseStatusHistoryEntry, 'id' | 'changedAt' | 'sequenceNumber'> & {
      idempotencyKey?: string;
    }
  ): Promise<CaseStatusHistoryEntry | undefined> {
    this.assertTenantWrite('case_status_history', tenantId, entry.organizationId);
    return botPersistenceRepository.appendCaseStatusHistory(entry);
  }

  assertTenantWrite(resource: TenantResourceType, tenantId: string, payloadOrganizationId?: string): void {
    assertTenantOwnership({
      resource,
      tenantId,
      resourceOrganizationId: payloadOrganizationId,
    });
  }
}

export const tenantSafeDatabaseService: TenantSafeDatabaseService = new ApiTenantSafeDatabaseService();
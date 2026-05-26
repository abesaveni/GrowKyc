import {
  assembleAuditPackFromPersistedSources,
  type AssembleAuditPackInput,
  type AssembleAuditPackResult,
  type AuditPackPersistedDataSources,
} from './auditPackAssemblerHelper';
import {
  createAuditPackRecord,
  updateAuditPackExportStatus,
  type AuditPackPersistencePort,
  type AuditPackPersistenceRecord,
  type CreateAuditPackRecordInput,
  type UpdateAuditPackExportStatusInput,
} from './auditPackPersistenceHelper';
import {
  AuditPackAuditHooks,
  type AuditPackAuditContext,
} from './auditPackAuditHooks';
import type { AuditPackExportStatus, AuditPackModel } from './auditPackModel';
import type { PeriodicReviewAuditWriter } from './periodicReviewAuditHooks';

export interface AuditPackServiceDependencies {
  persistence: AuditPackPersistencePort;
  auditWriter: PeriodicReviewAuditWriter;
}

export interface CreateAuditPackServiceInput {
  id: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  generatedBy: string;
  generatedAt?: string | Date;
  includeMissingSections?: boolean;
  dataSources: AuditPackPersistedDataSources;
  metadata?: Record<string, unknown>;
}

export interface UpdateAuditPackExportStatusServiceInput {
  id: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  exportStatus: AuditPackExportStatus;
  updatedAt?: string | Date;
}

export interface AuditPackServiceResult {
  auditPack: AuditPackModel;
  assembly: AssembleAuditPackResult;
}

/**
 * Centralized server-side service wiring audit pack model, assembler, persistence, and audit hooks.
 * Intentionally modular for API integration later.
 */
export class AuditPackService {
  private readonly persistence: AuditPackPersistencePort;
  private readonly auditHooks: AuditPackAuditHooks;

  constructor(dependencies: AuditPackServiceDependencies) {
    this.persistence = dependencies.persistence;
    this.auditHooks = new AuditPackAuditHooks(dependencies.auditWriter);
  }

  async createAuditPack(
    input: CreateAuditPackServiceInput,
  ): Promise<AuditPackServiceResult> {
    const assembly = assembleAuditPackFromPersistedSources({
      id: input.id,
      tenantId: input.tenantId,
      caseId: input.caseId,
      generatedBy: input.generatedBy,
      generatedAt: input.generatedAt,
      exportStatus: 'pending',
      includeMissingSections: input.includeMissingSections,
      dataSources: input.dataSources,
      metadata: input.metadata,
    } satisfies AssembleAuditPackInput);

    const persisted = await createAuditPackRecord(
      {
        id: assembly.auditPack.id,
        tenantId: assembly.auditPack.linkage.tenant_id,
        caseId: assembly.auditPack.linkage.case_id,
        exportStatus: assembly.auditPack.exportStatus,
        generatedAt: assembly.auditPack.generated_at,
        generatedBy: assembly.auditPack.generated_by,
        createdAt: assembly.auditPack.createdAt,
        updatedAt: assembly.auditPack.updatedAt,
      } satisfies CreateAuditPackRecordInput,
      this.persistence,
    );

    const auditPack = mapToAuditPackModel(persisted, assembly.auditPack.sections, input.metadata);

    await this.auditHooks.onAuditPackCreated(
      this.buildAuditContext(auditPack, input.actorId, input.generatedAt),
      {
        section_count: assembly.auditPack.sections.length,
      },
    );

    await this.auditHooks.onAuditPackAssembled(
      this.buildAuditContext(auditPack, input.actorId, input.generatedAt),
      {
        included_sections: assembly.includedSections,
        missing_sections: assembly.missingSections,
        evidence_linkage_count: assembly.evidenceLinkage.length,
      },
    );

    return {
      auditPack,
      assembly,
    };
  }

  async updateExportStatus(
    input: UpdateAuditPackExportStatusServiceInput,
  ): Promise<AuditPackPersistenceRecord> {
    const persisted = await updateAuditPackExportStatus(
      {
        id: input.id,
        tenantId: input.tenantId,
        caseId: input.caseId,
        exportStatus: input.exportStatus,
        updatedAt: input.updatedAt,
      } satisfies UpdateAuditPackExportStatusInput,
      this.persistence,
    );

    const context: AuditPackAuditContext = {
      tenantId: persisted.tenant_id,
      caseId: persisted.case_id,
      auditPackId: persisted.id,
      actorId: input.actorId,
      exportStatus: persisted.export_status,
      occurredAt: input.updatedAt,
    };

    if (persisted.export_status === 'completed') {
      await this.auditHooks.onAuditPackExported(context);
    }

    if (persisted.export_status === 'failed') {
      await this.auditHooks.onAuditPackFailed(context);
    }

    return persisted;
  }

  private buildAuditContext(
    auditPack: AuditPackModel,
    actorId: string,
    occurredAt?: string | Date,
  ): AuditPackAuditContext {
    return {
      tenantId: auditPack.linkage.tenant_id,
      caseId: auditPack.linkage.case_id,
      auditPackId: auditPack.id,
      actorId,
      exportStatus: auditPack.exportStatus,
      occurredAt,
    };
  }
}

let auditPackServiceInstance: AuditPackService | null = null;

export function getAuditPackService(
  dependencies: AuditPackServiceDependencies,
): AuditPackService {
  if (!auditPackServiceInstance) {
    auditPackServiceInstance = new AuditPackService(dependencies);
  }

  return auditPackServiceInstance;
}

function mapToAuditPackModel(
  record: AuditPackPersistenceRecord,
  sections: AuditPackModel['sections'],
  metadata?: Record<string, unknown>,
): AuditPackModel {
  return {
    id: record.id,
    exportStatus: record.export_status,
    linkage: {
      tenant_id: record.tenant_id,
      case_id: record.case_id,
    },
    sections,
    generated_at: record.generated_at,
    generated_by: record.generated_by,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    metadata,
  };
}
import type { AuditPackExportStatus } from './auditPackModel';

export interface AuditPackPersistenceRecord {
  id: string;
  tenant_id: string;
  case_id: string;
  export_status: AuditPackExportStatus;
  generated_at: string;
  generated_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAuditPackRecordInput {
  id: string;
  tenantId: string;
  caseId: string;
  exportStatus?: AuditPackExportStatus;
  generatedAt?: string | Date;
  generatedBy: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface UpdateAuditPackExportStatusInput {
  id: string;
  tenantId: string;
  caseId: string;
  exportStatus: AuditPackExportStatus;
  updatedAt?: string | Date;
}

export interface AuditPackPersistencePort {
  createAuditPackRecord(
    record: AuditPackPersistenceRecord,
  ): Promise<AuditPackPersistenceRecord>;
  updateAuditPackRecord(input: {
    id: string;
    tenant_id: string;
    case_id: string;
    changes: Partial<AuditPackPersistenceRecord>;
  }): Promise<AuditPackPersistenceRecord>;
}

/**
 * Creates and persists an audit pack record with normalized timestamps.
 */
export async function createAuditPackRecord(
  input: CreateAuditPackRecordInput,
  persistence: AuditPackPersistencePort,
): Promise<AuditPackPersistenceRecord> {
  const now = new Date();
  const createdAt = normalizeDate(input.createdAt ?? now, 'createdAt');
  const updatedAt = normalizeDate(input.updatedAt ?? createdAt, 'updatedAt');
  const generatedAt = normalizeDate(input.generatedAt ?? createdAt, 'generatedAt');

  const record: AuditPackPersistenceRecord = {
    id: input.id,
    tenant_id: input.tenantId,
    case_id: input.caseId,
    export_status: input.exportStatus ?? 'pending',
    generated_at: generatedAt.toISOString(),
    generated_by: normalizeRequiredText(input.generatedBy, 'generatedBy'),
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
  };

  return persistence.createAuditPackRecord(record);
}

/**
 * Persists export status updates for an existing audit pack record.
 */
export async function updateAuditPackExportStatus(
  input: UpdateAuditPackExportStatusInput,
  persistence: AuditPackPersistencePort,
): Promise<AuditPackPersistenceRecord> {
  return persistence.updateAuditPackRecord({
    id: input.id,
    tenant_id: input.tenantId,
    case_id: input.caseId,
    changes: {
      export_status: input.exportStatus,
      updated_at: normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString(),
    },
  });
}

function normalizeRequiredText(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}
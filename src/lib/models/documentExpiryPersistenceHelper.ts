import { DocumentExpiryStatus } from './documentExpiryModel';

export interface DocumentExpiryPersistenceRecord {
  document_id: string;
  tenant_id: string;
  case_id?: string;
  expiry_status?: DocumentExpiryStatus;
  expiry_date?: string;
  replaced_at?: string;
  replaced_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentExpiryRecordInput {
  documentId: string;
  tenantId: string;
  caseId?: string;
  expiryStatus?: DocumentExpiryStatus;
  expiryDate?: string | Date;
  replacedAt?: string | Date;
  replacedBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface UpdateDocumentExpiryDateInput {
  documentId: string;
  tenantId: string;
  caseId?: string;
  expiryDate?: string | Date;
  expiryStatus?: DocumentExpiryStatus;
  updatedAt?: string | Date;
}

export interface UpdateDocumentReplacementInput {
  documentId: string;
  tenantId: string;
  caseId?: string;
  replacedAt?: string | Date;
  replacedBy?: string;
  expiryStatus?: DocumentExpiryStatus;
  updatedAt?: string | Date;
}

export interface UpdateDocumentExpiryStatusInput {
  documentId: string;
  tenantId: string;
  caseId?: string;
  expiryStatus: DocumentExpiryStatus;
  updatedAt?: string | Date;
}

export interface DocumentExpiryPersistencePort {
  createDocumentExpiryRecord(
    record: DocumentExpiryPersistenceRecord,
  ): Promise<DocumentExpiryPersistenceRecord>;
  updateDocumentExpiryRecord(
    input: {
      document_id: string;
      tenant_id: string;
      case_id?: string;
      changes: Partial<DocumentExpiryPersistenceRecord>;
    },
  ): Promise<DocumentExpiryPersistenceRecord>;
}

/**
 * Creates a document expiry persistence record with normalized metadata fields.
 */
export async function createDocumentExpiryRecord(
  input: CreateDocumentExpiryRecordInput,
  persistence: DocumentExpiryPersistencePort,
): Promise<DocumentExpiryPersistenceRecord> {
  const now = new Date();
  const createdAt = normalizeDate(input.createdAt ?? now, 'createdAt');
  const updatedAt = normalizeDate(input.updatedAt ?? createdAt, 'updatedAt');

  const record: DocumentExpiryPersistenceRecord = {
    document_id: input.documentId,
    tenant_id: input.tenantId,
    case_id: input.caseId,
    expiry_status: input.expiryStatus,
    expiry_date: input.expiryDate
      ? normalizeDate(input.expiryDate, 'expiryDate').toISOString()
      : undefined,
    replaced_at: input.replacedAt
      ? normalizeDate(input.replacedAt, 'replacedAt').toISOString()
      : undefined,
    replaced_by: input.replacedBy,
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
  };

  return persistence.createDocumentExpiryRecord(record);
}

/**
 * Updates persisted expiry date metadata with tenant/case-safe keys.
 */
export async function updateDocumentExpiryDate(
  input: UpdateDocumentExpiryDateInput,
  persistence: DocumentExpiryPersistencePort,
): Promise<DocumentExpiryPersistenceRecord> {
  const changes: Partial<DocumentExpiryPersistenceRecord> = {
    updated_at: normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString(),
    expiry_date: input.expiryDate
      ? normalizeDate(input.expiryDate, 'expiryDate').toISOString()
      : undefined,
  };

  if (input.expiryStatus) {
    changes.expiry_status = input.expiryStatus;
  }

  return persistence.updateDocumentExpiryRecord({
    document_id: input.documentId,
    tenant_id: input.tenantId,
    case_id: input.caseId,
    changes,
  });
}

/**
 * Updates persisted replacement metadata (replaced_at/replaced_by).
 */
export async function updateDocumentReplacementMetadata(
  input: UpdateDocumentReplacementInput,
  persistence: DocumentExpiryPersistencePort,
): Promise<DocumentExpiryPersistenceRecord> {
  const changes: Partial<DocumentExpiryPersistenceRecord> = {
    updated_at: normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString(),
    replaced_at: input.replacedAt
      ? normalizeDate(input.replacedAt, 'replacedAt').toISOString()
      : undefined,
    replaced_by: input.replacedBy,
  };

  if (input.expiryStatus) {
    changes.expiry_status = input.expiryStatus;
  }

  return persistence.updateDocumentExpiryRecord({
    document_id: input.documentId,
    tenant_id: input.tenantId,
    case_id: input.caseId,
    changes,
  });
}

/**
 * Updates persisted expiry status when status storage is supported.
 */
export async function updateDocumentExpiryStatus(
  input: UpdateDocumentExpiryStatusInput,
  persistence: DocumentExpiryPersistencePort,
): Promise<DocumentExpiryPersistenceRecord> {
  const changes: Partial<DocumentExpiryPersistenceRecord> = {
    expiry_status: input.expiryStatus,
    updated_at: normalizeDate(input.updatedAt ?? new Date(), 'updatedAt').toISOString(),
  };

  return persistence.updateDocumentExpiryRecord({
    document_id: input.documentId,
    tenant_id: input.tenantId,
    case_id: input.caseId,
    changes,
  });
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}

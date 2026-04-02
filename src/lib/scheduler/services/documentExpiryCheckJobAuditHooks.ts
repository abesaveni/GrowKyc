export type DocumentExpiryCheckJobAuditAction =
  | 'document_expiry_check_job_started'
  | 'document_expiry_check_job_noop'
  | 'document_expiry_check_job_completed'
  | 'document_expiry_check_job_failed';

export interface DocumentExpiryCheckJobAuditEvent {
  action: DocumentExpiryCheckJobAuditAction;
  job_id: string;
  tenant_id: string;
  job_type: 'document_expiry_check';
  occurred_at: string;
  due_document_count?: number;
  evaluated_document_count?: number;
  expired_document_count?: number;
  reason_code?: string;
  metadata?: Record<string, unknown>;
}

export interface IDocumentExpiryCheckJobAuditWriter {
  writeDocumentExpiryCheckJobAuditEvent(event: DocumentExpiryCheckJobAuditEvent): Promise<void>;
}

export interface EmitDocumentExpiryCheckJobAuditEventInput {
  action: DocumentExpiryCheckJobAuditAction;
  job_id: string;
  tenant_id: string;
  occurred_at: string;
  due_document_count?: number;
  evaluated_document_count?: number;
  expired_document_count?: number;
  reason_code?: string;
  metadata?: Record<string, unknown>;
}

const toEvent = (input: EmitDocumentExpiryCheckJobAuditEventInput): DocumentExpiryCheckJobAuditEvent => {
  return {
    action: input.action,
    job_id: input.job_id,
    tenant_id: input.tenant_id,
    job_type: 'document_expiry_check',
    occurred_at: input.occurred_at,
    due_document_count: input.due_document_count,
    evaluated_document_count: input.evaluated_document_count,
    expired_document_count: input.expired_document_count,
    reason_code: input.reason_code,
    metadata: input.metadata,
  };
};

export const emitDocumentExpiryCheckJobAuditEvent = async (
  writer: IDocumentExpiryCheckJobAuditWriter | undefined,
  input: EmitDocumentExpiryCheckJobAuditEventInput
): Promise<void> => {
  if (!writer) {
    return;
  }

  await writer.writeDocumentExpiryCheckJobAuditEvent(toEvent(input));
};

export const emitDocumentExpiryCheckJobStartedAuditEvent = async (
  writer: IDocumentExpiryCheckJobAuditWriter | undefined,
  input: Omit<EmitDocumentExpiryCheckJobAuditEventInput, 'action'>
): Promise<void> => {
  return emitDocumentExpiryCheckJobAuditEvent(writer, {
    ...input,
    action: 'document_expiry_check_job_started',
  });
};

export const emitDocumentExpiryCheckJobNoopAuditEvent = async (
  writer: IDocumentExpiryCheckJobAuditWriter | undefined,
  input: Omit<EmitDocumentExpiryCheckJobAuditEventInput, 'action'>
): Promise<void> => {
  return emitDocumentExpiryCheckJobAuditEvent(writer, {
    ...input,
    action: 'document_expiry_check_job_noop',
  });
};

export const emitDocumentExpiryCheckJobCompletedAuditEvent = async (
  writer: IDocumentExpiryCheckJobAuditWriter | undefined,
  input: Omit<EmitDocumentExpiryCheckJobAuditEventInput, 'action'>
): Promise<void> => {
  return emitDocumentExpiryCheckJobAuditEvent(writer, {
    ...input,
    action: 'document_expiry_check_job_completed',
  });
};

export const emitDocumentExpiryCheckJobFailedAuditEvent = async (
  writer: IDocumentExpiryCheckJobAuditWriter | undefined,
  input: Omit<EmitDocumentExpiryCheckJobAuditEventInput, 'action'>
): Promise<void> => {
  return emitDocumentExpiryCheckJobAuditEvent(writer, {
    ...input,
    action: 'document_expiry_check_job_failed',
  });
};

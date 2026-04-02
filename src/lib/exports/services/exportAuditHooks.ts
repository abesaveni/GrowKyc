import type { ExportAuditAction, ExportAuditEvent } from '../models/exportAuditEvent';
import type { ExportRequest } from '../models/exportRequest';

export interface IExportAuditWriter {
  writeExportAuditEvent(event: ExportAuditEvent): Promise<void>;
}

export interface EmitExportAuditEventInput {
  action: ExportAuditAction;
  occurred_at: string;
  request: ExportRequest;
  actor_user_id?: string;
  export_id?: string;
  reason_code?: string;
  metadata?: Record<string, unknown>;
}

const toEvent = (input: EmitExportAuditEventInput): ExportAuditEvent => {
  return {
    action: input.action,
    tenant_id: input.request.tenant_id,
    case_id: input.request.case_id,
    actor_user_id: input.actor_user_id,
    target_type: input.request.target_type,
    target_id: input.request.target_id,
    format: input.request.format,
    export_id: input.export_id,
    occurred_at: input.occurred_at,
    reason_code: input.reason_code,
    metadata: input.metadata,
  };
};

export const emitExportAuditEvent = async (
  writer: IExportAuditWriter | undefined,
  input: EmitExportAuditEventInput,
): Promise<void> => {
  if (!writer) {
    return;
  }

  await writer.writeExportAuditEvent(toEvent(input));
};

export const emitExportRequestedAuditEvent = async (
  writer: IExportAuditWriter | undefined,
  input: Omit<EmitExportAuditEventInput, 'action'>,
): Promise<void> => {
  return emitExportAuditEvent(writer, {
    ...input,
    action: 'export_requested',
  });
};

export const emitExportGeneratedAuditEvent = async (
  writer: IExportAuditWriter | undefined,
  input: Omit<EmitExportAuditEventInput, 'action'>,
): Promise<void> => {
  return emitExportAuditEvent(writer, {
    ...input,
    action: 'export_generated',
  });
};

export const emitExportFailedAuditEvent = async (
  writer: IExportAuditWriter | undefined,
  input: Omit<EmitExportAuditEventInput, 'action'>,
): Promise<void> => {
  return emitExportAuditEvent(writer, {
    ...input,
    action: 'export_failed',
  });
};

export const emitExportDownloadedAuditEvent = async (
  writer: IExportAuditWriter | undefined,
  input: Omit<EmitExportAuditEventInput, 'action'>,
): Promise<void> => {
  return emitExportAuditEvent(writer, {
    ...input,
    action: 'export_downloaded',
  });
};

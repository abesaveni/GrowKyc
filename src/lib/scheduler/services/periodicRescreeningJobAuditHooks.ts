export type PeriodicRescreeningJobAuditAction =
  | 'periodic_rescreening_job_started'
  | 'periodic_rescreening_job_noop'
  | 'periodic_rescreening_job_completed'
  | 'periodic_rescreening_job_failed';

export interface PeriodicRescreeningJobAuditEvent {
  action: PeriodicRescreeningJobAuditAction;
  job_id: string;
  tenant_id: string;
  job_type: 'periodic_rescreening';
  occurred_at: string;
  due_review_count?: number;
  processed_review_count?: number;
  reason_code?: string;
  metadata?: Record<string, unknown>;
}

export interface IPeriodicRescreeningJobAuditWriter {
  writePeriodicRescreeningJobAuditEvent(event: PeriodicRescreeningJobAuditEvent): Promise<void>;
}

export interface EmitPeriodicRescreeningJobAuditEventInput {
  action: PeriodicRescreeningJobAuditAction;
  job_id: string;
  tenant_id: string;
  occurred_at: string;
  due_review_count?: number;
  processed_review_count?: number;
  reason_code?: string;
  metadata?: Record<string, unknown>;
}

const toEvent = (input: EmitPeriodicRescreeningJobAuditEventInput): PeriodicRescreeningJobAuditEvent => {
  return {
    action: input.action,
    job_id: input.job_id,
    tenant_id: input.tenant_id,
    job_type: 'periodic_rescreening',
    occurred_at: input.occurred_at,
    due_review_count: input.due_review_count,
    processed_review_count: input.processed_review_count,
    reason_code: input.reason_code,
    metadata: input.metadata,
  };
};

export const emitPeriodicRescreeningJobAuditEvent = async (
  writer: IPeriodicRescreeningJobAuditWriter | undefined,
  input: EmitPeriodicRescreeningJobAuditEventInput
): Promise<void> => {
  if (!writer) {
    return;
  }

  await writer.writePeriodicRescreeningJobAuditEvent(toEvent(input));
};

export const emitPeriodicRescreeningJobStartedAuditEvent = async (
  writer: IPeriodicRescreeningJobAuditWriter | undefined,
  input: Omit<EmitPeriodicRescreeningJobAuditEventInput, 'action'>
): Promise<void> => {
  return emitPeriodicRescreeningJobAuditEvent(writer, {
    ...input,
    action: 'periodic_rescreening_job_started',
  });
};

export const emitPeriodicRescreeningJobNoopAuditEvent = async (
  writer: IPeriodicRescreeningJobAuditWriter | undefined,
  input: Omit<EmitPeriodicRescreeningJobAuditEventInput, 'action'>
): Promise<void> => {
  return emitPeriodicRescreeningJobAuditEvent(writer, {
    ...input,
    action: 'periodic_rescreening_job_noop',
  });
};

export const emitPeriodicRescreeningJobCompletedAuditEvent = async (
  writer: IPeriodicRescreeningJobAuditWriter | undefined,
  input: Omit<EmitPeriodicRescreeningJobAuditEventInput, 'action'>
): Promise<void> => {
  return emitPeriodicRescreeningJobAuditEvent(writer, {
    ...input,
    action: 'periodic_rescreening_job_completed',
  });
};

export const emitPeriodicRescreeningJobFailedAuditEvent = async (
  writer: IPeriodicRescreeningJobAuditWriter | undefined,
  input: Omit<EmitPeriodicRescreeningJobAuditEventInput, 'action'>
): Promise<void> => {
  return emitPeriodicRescreeningJobAuditEvent(writer, {
    ...input,
    action: 'periodic_rescreening_job_failed',
  });
};

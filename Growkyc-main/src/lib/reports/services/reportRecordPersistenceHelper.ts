import type {
  CreateReportRecordInput,
  IReportRecordPersistenceAdapter,
  ReportRecord,
  UpdateReportStatusInput,
} from '../models/reportRecordPersistence';

const toIsoNow = (): string => {
  return new Date().toISOString();
};

const normalizeCreateInput = (input: CreateReportRecordInput): ReportRecord => {
  const now = toIsoNow();

  return {
    report_id: input.report_id,
    tenant_id: input.tenant_id,
    case_id: input.case_id,
    report_type: input.report_type,
    status: input.status,
    generated_at: input.generated_at,
    generated_by: input.generated_by,
    metadata: input.metadata,
    created_at: input.created_at ?? now,
    updated_at: input.updated_at ?? now,
  };
};

const normalizeUpdateStatusInput = (input: UpdateReportStatusInput): UpdateReportStatusInput => {
  return {
    report_id: input.report_id,
    tenant_id: input.tenant_id,
    status: input.status,
    generated_at: input.generated_at,
    generated_by: input.generated_by,
    metadata: input.metadata,
    updated_at: input.updated_at ?? toIsoNow(),
  };
};

export const createReportRecord = async (
  adapter: IReportRecordPersistenceAdapter,
  input: CreateReportRecordInput,
): Promise<ReportRecord> => {
  const record = normalizeCreateInput(input);
  return adapter.createReportRecord(record);
};

export const updateReportStatus = async (
  adapter: IReportRecordPersistenceAdapter,
  input: UpdateReportStatusInput,
): Promise<ReportRecord | null> => {
  const updateInput = normalizeUpdateStatusInput(input);
  return adapter.updateReportStatus(updateInput);
};
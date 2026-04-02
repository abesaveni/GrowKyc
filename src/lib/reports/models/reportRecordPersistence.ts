import type { ReportStatus } from './reportStatus';
import type { ReportType } from './reportType';

export interface ReportRecord {
  report_id: string;
  tenant_id: string;
  case_id?: string;
  report_type: ReportType;
  status: ReportStatus;
  generated_at?: string;
  generated_by?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CreateReportRecordInput {
  report_id: string;
  tenant_id: string;
  case_id?: string;
  report_type: ReportType;
  status: ReportStatus;
  generated_at?: string;
  generated_by?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateReportStatusInput {
  report_id: string;
  tenant_id: string;
  status: ReportStatus;
  generated_at?: string;
  generated_by?: string;
  metadata?: Record<string, unknown>;
  updated_at?: string;
}

export interface IReportRecordPersistenceAdapter {
  createReportRecord(input: ReportRecord): Promise<ReportRecord>;
  updateReportStatus(input: UpdateReportStatusInput): Promise<ReportRecord | null>;
}
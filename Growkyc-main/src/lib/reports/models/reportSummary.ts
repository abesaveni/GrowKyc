import type { ReportStatus } from './reportStatus';
import type { ReportType } from './reportType';

export interface ReportSummary {
  report_id: string;
  tenant_id: string;
  case_id?: string;
  report_type: ReportType;
  status: ReportStatus;
  generated_at?: string;
  created_at: string;
  updated_at: string;
  generated_by?: string;
  record_count?: number;
  metadata?: Record<string, unknown>;
}
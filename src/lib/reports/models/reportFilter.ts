import type { ReportStatus } from './reportStatus';
import type { ReportType } from './reportType';

export interface ReportFilter {
  tenant_id: string;
  case_id?: string;
  report_type?: ReportType | ReportType[];
  status?: ReportStatus | ReportStatus[];
  created_from?: string;
  created_to?: string;
  limit?: number;
  offset?: number;
}
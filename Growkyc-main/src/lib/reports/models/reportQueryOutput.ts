import type { ReportFilter } from './reportFilter';
import type { PersistedReportRecord } from './reportQueryInput';

export interface ReportQueryOutput {
  tenant_id: string;
  applied_filter?: Omit<ReportFilter, 'tenant_id'>;
  records: PersistedReportRecord[];
  total_records: number;
  case_level_groups: Record<string, PersistedReportRecord[]>;
  firm_level_groups: Record<string, PersistedReportRecord[]>;
}
import type { ReportFilter } from './reportFilter';
import type { ReportSummary } from './reportSummary';

export interface PersistedReportRecord extends ReportSummary {
  payload?: Record<string, unknown>;
}

export interface ReportQueryInput {
  tenant_id: string;
  persisted_reports: PersistedReportRecord[];
  filter?: Omit<ReportFilter, 'tenant_id'>;
  is_tenant_record?: (record: PersistedReportRecord, tenant_id: string) => boolean;
  case_group_key?: (record: PersistedReportRecord) => string | undefined;
  firm_group_key?: (record: PersistedReportRecord) => string;
}
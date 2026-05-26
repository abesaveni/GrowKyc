import type { PersistedReportRecord, ReportQueryInput } from '../models/reportQueryInput';
import type { ReportQueryOutput } from '../models/reportQueryOutput';

const defaultTenantRecordGuard = (record: PersistedReportRecord, tenant_id: string): boolean => {
  return record.tenant_id === tenant_id;
};

const defaultCaseGroupKey = (record: PersistedReportRecord): string | undefined => {
  return record.case_id;
};

const defaultFirmGroupKey = (record: PersistedReportRecord): string => {
  return record.tenant_id;
};

const asArray = <T>(value?: T | T[]): T[] | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return Array.isArray(value) ? value : [value];
};

const withinDateRange = (value: string, from?: string, to?: string): boolean => {
  const createdAt = Date.parse(value);

  if (Number.isNaN(createdAt)) {
    return false;
  }

  if (from) {
    const fromTime = Date.parse(from);

    if (Number.isNaN(fromTime) || createdAt < fromTime) {
      return false;
    }
  }

  if (to) {
    const toTime = Date.parse(to);

    if (Number.isNaN(toTime) || createdAt > toTime) {
      return false;
    }
  }

  return true;
};

const groupRecords = (
  records: PersistedReportRecord[],
  keyResolver: (record: PersistedReportRecord) => string | undefined,
): Record<string, PersistedReportRecord[]> => {
  const grouped: Record<string, PersistedReportRecord[]> = {};

  for (const record of records) {
    const key = keyResolver(record);

    if (!key) {
      continue;
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(record);
  }

  return grouped;
};

export const assembleReportQuery = (input: ReportQueryInput): ReportQueryOutput => {
  const tenantGuard = input.is_tenant_record ?? defaultTenantRecordGuard;
  const caseGroupKey = input.case_group_key ?? defaultCaseGroupKey;
  const firmGroupKey = input.firm_group_key ?? defaultFirmGroupKey;
  const filter = input.filter;
  const reportTypes = asArray(filter?.report_type);
  const statuses = asArray(filter?.status);

  const tenantScoped = input.persisted_reports.filter((record) => tenantGuard(record, input.tenant_id));

  const filtered = tenantScoped.filter((record) => {
    if (filter?.case_id && record.case_id !== filter.case_id) {
      return false;
    }

    if (reportTypes && !reportTypes.includes(record.report_type)) {
      return false;
    }

    if (statuses && !statuses.includes(record.status)) {
      return false;
    }

    if ((filter?.created_from || filter?.created_to) && !withinDateRange(record.created_at, filter.created_from, filter.created_to)) {
      return false;
    }

    return true;
  });

  const offset = filter?.offset ?? 0;
  const limit = filter?.limit;
  const records = limit === undefined ? filtered.slice(offset) : filtered.slice(offset, offset + limit);

  return {
    tenant_id: input.tenant_id,
    applied_filter: filter,
    records,
    total_records: filtered.length,
    case_level_groups: groupRecords(records, caseGroupKey),
    firm_level_groups: groupRecords(records, firmGroupKey),
  };
};
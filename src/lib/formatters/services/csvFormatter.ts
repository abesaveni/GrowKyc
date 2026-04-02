import type { FormatterResult } from '../models/formatterResult';
import type { CsvColumnMapping, CsvFormatterInput, CsvRow } from '../models/csvFormatterInput';
import type { CsvFormatterOutput } from '../models/csvFormatterOutput';

export interface CsvFormatterDependencies {
  now?: () => string;
  generate_formatter_id?: () => string;
}

const defaultNow = (): string => {
  return new Date().toISOString();
};

const defaultFormatterId = (): string => {
  return `fmt_${Date.now()}`;
};

const unsafeColumnKeys = new Set(['__proto__', 'constructor', 'prototype']);

function sanitizeColumnKey(key: string): string | undefined {
  const trimmed = key.trim();

  if (!trimmed || unsafeColumnKeys.has(trimmed)) {
    return undefined;
  }

  return trimmed;
}

function sanitizeHeader(header: string, key: string): string {
  const normalized = header.replace(/[\r\n]+/g, ' ').trim();

  return normalized || key;
}

function escapeCsvCell(raw: string): string {
  const startsWithFormula = /^[=+\-@]/.test(raw);
  const safe = startsWithFormula ? `'${raw}` : raw;

  if (/[",\r\n]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }

  return safe;
}

function formatCellValue(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? String(value) : fallback;
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (Array.isArray(value) || typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return fallback;
    }
  }

  return fallback;
}

function inferColumnsFromRows(rows: CsvRow[]): CsvColumnMapping[] {
  const keys = new Set<string>();

  for (const row of rows) {
    for (const key of Object.keys(row)) {
      const safeKey = sanitizeColumnKey(key);

      if (safeKey) {
        keys.add(safeKey);
      }
    }
  }

  return Array.from(keys).map((key) => ({
    key,
    header: key,
  }));
}

export function buildSafeCsvColumnMappings(input: Pick<CsvFormatterInput, 'rows' | 'columns'>): CsvColumnMapping[] {
  const candidateColumns = input.columns && input.columns.length > 0 ? input.columns : inferColumnsFromRows(input.rows);

  const normalizedColumns: CsvColumnMapping[] = [];

  for (const candidate of candidateColumns) {
    const safeKey = sanitizeColumnKey(candidate.key);

    if (!safeKey) {
      continue;
    }

    normalizedColumns.push({
      key: safeKey,
      header: sanitizeHeader(candidate.header, safeKey),
      fallback: candidate.fallback,
    });
  }

  return normalizedColumns;
}

function buildFormatterResult(input: CsvFormatterInput, now: string, formatter_id: string): FormatterResult {
  return {
    formatter_id,
    tenant_id: input.request.tenant_id,
    case_id: input.request.case_id,
    target_type: input.request.target_type,
    target_id: input.request.target_id,
    format: input.request.format,
    status: 'accepted',
    requested_at: now,
    requested_by: input.request.requested_by,
  };
}

function buildFileName(input: CsvFormatterInput): string {
  return `${input.request.target_type}_${input.request.target_id}.csv`;
}

function serializeCsv(rows: CsvRow[], columns: CsvColumnMapping[]): { header_row: string[]; serialized_content: string } {
  const header_row = columns.map((column) => column.header);
  const lines: string[] = [];

  lines.push(header_row.map(escapeCsvCell).join(','));

  for (const row of rows) {
    const line = columns
      .map((column) => formatCellValue(row[column.key], column.fallback))
      .map(escapeCsvCell)
      .join(',');

    lines.push(line);
  }

  return {
    header_row,
    serialized_content: lines.join('\n'),
  };
}

function getUtf8ByteLength(input: string): number {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(input).length;
  }

  return input.length;
}

export class CsvFormatterService {
  private readonly now: () => string;
  private readonly generateFormatterId: () => string;

  constructor(dependencies: CsvFormatterDependencies = {}) {
    this.now = dependencies.now ?? defaultNow;
    this.generateFormatterId = dependencies.generate_formatter_id ?? defaultFormatterId;
  }

  format(input: CsvFormatterInput): CsvFormatterOutput {
    const columns = buildSafeCsvColumnMappings({
      rows: input.rows,
      columns: input.columns,
    });
    const now = this.now();
    const formatter_id = this.generateFormatterId();
    const { header_row, serialized_content } = serializeCsv(input.rows, columns);
    const result = buildFormatterResult(input, now, formatter_id);

    return {
      result: {
        ...result,
        format: 'csv',
        target_type: 'report',
      },
      content_type: 'text/csv',
      file_extension: 'csv',
      file_name: buildFileName(input),
      header_row,
      row_count: input.rows.length,
      serialized_content,
      byte_length: getUtf8ByteLength(serialized_content),
    };
  }
}

export function formatAsCsv(input: CsvFormatterInput, dependencies: CsvFormatterDependencies = {}): CsvFormatterOutput {
  return new CsvFormatterService(dependencies).format(input);
}

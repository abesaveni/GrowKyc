import type { FormatterRequest } from './formatterRequest';

export type CsvCellValue = string | number | boolean | null | undefined | Date | Record<string, unknown> | unknown[];

export interface CsvRow {
  [column: string]: CsvCellValue;
}

export interface CsvColumnMapping {
  key: string;
  header: string;
  fallback?: string;
}

export interface CsvFormatterInput {
  request: FormatterRequest & {
    format: 'csv';
    target_type: 'report';
  };
  rows: CsvRow[];
  columns?: CsvColumnMapping[];
  metadata?: Record<string, unknown>;
}

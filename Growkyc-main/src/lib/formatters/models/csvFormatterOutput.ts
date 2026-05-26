import type { FormatterResult } from './formatterResult';

export interface CsvFormatterOutput {
  result: FormatterResult & {
    format: 'csv';
    target_type: 'report';
  };
  content_type: 'text/csv';
  file_extension: 'csv';
  file_name: string;
  header_row: string[];
  row_count: number;
  serialized_content: string;
  byte_length: number;
}

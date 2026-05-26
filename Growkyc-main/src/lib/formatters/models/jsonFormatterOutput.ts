import type { FormatterResult } from './formatterResult';
import type { JsonSerializable } from './jsonFormatterInput';

export interface JsonFormatterDocument {
  formatter: {
    format: 'json';
    target_type: FormatterResult['target_type'];
    generated_at: string;
  };
  request: {
    tenant_id: string;
    case_id?: string;
    target_id: string;
    requested_by: string;
  };
  target: {
    payload: JsonSerializable;
  };
  metadata?: { [key: string]: JsonSerializable };
}

export interface JsonFormatterOutput {
  result: FormatterResult;
  content_type: 'application/json';
  file_extension: 'json';
  file_name: string;
  document: JsonFormatterDocument;
  serialized_content: string;
  byte_length: number;
}

import type { FormatterRequest } from './formatterRequest';

export type JsonSerializable =
  | string
  | number
  | boolean
  | null
  | JsonSerializable[]
  | { [key: string]: JsonSerializable };

export interface JsonFormatterInputBase {
  request: FormatterRequest & { format: 'json' };
  metadata?: Record<string, unknown>;
}

export interface JsonAuditPackFormatterInput extends JsonFormatterInputBase {
  request: JsonFormatterInputBase['request'] & { target_type: 'audit_pack' };
  target_payload: Record<string, unknown>;
}

export interface JsonReportFormatterInput extends JsonFormatterInputBase {
  request: JsonFormatterInputBase['request'] & { target_type: 'report' };
  target_payload: Record<string, unknown>;
}

export interface JsonEvidenceBundleFormatterInput extends JsonFormatterInputBase {
  request: JsonFormatterInputBase['request'] & { target_type: 'evidence_bundle' };
  target_payload: Record<string, unknown>;
}

export type JsonFormatterInput =
  | JsonAuditPackFormatterInput
  | JsonReportFormatterInput
  | JsonEvidenceBundleFormatterInput;

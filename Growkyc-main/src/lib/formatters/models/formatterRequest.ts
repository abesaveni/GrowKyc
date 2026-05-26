import type { FormatterFormat } from './formatterFormat';
import type { FormatterTarget } from './formatterTarget';

export interface FormatterRequest {
  tenant_id: string;
  case_id?: string;
  target_type: FormatterTarget;
  target_id: string;
  format: FormatterFormat;
  requested_by: string;
  metadata?: Record<string, unknown>;
}

import type { FormatterFormat } from './formatterFormat';
import type { FormatterTarget } from './formatterTarget';

export type FormatterResultStatus = 'accepted';

export interface FormatterResult {
  formatter_id: string;
  tenant_id: string;
  case_id?: string;
  target_type: FormatterTarget;
  target_id: string;
  format: FormatterFormat;
  status: FormatterResultStatus;
  requested_at: string;
  requested_by: string;
}

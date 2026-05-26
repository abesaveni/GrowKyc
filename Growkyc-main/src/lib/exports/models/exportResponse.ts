import type { ExportFormat } from './exportFormat';
import type { ExportTargetType } from './exportTargetType';

export type ExportResponseStatus = 'accepted';

export interface ExportResponse {
  export_id: string;
  tenant_id: string;
  case_id?: string;
  target_type: ExportTargetType;
  target_id: string;
  format: ExportFormat;
  status: ExportResponseStatus;
  requested_at: string;
  requested_by: string;
}
import type { ExportFormat } from './exportFormat';
import type { ExportTargetType } from './exportTargetType';

export interface ExportRequest {
  tenant_id: string;
  case_id?: string;
  target_type: ExportTargetType;
  target_id: string;
  format: ExportFormat;
  requested_by: string;
  metadata?: Record<string, unknown>;
}
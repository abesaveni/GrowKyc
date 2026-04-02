import type { ExportFormat } from './exportFormat';
import type { ExportRequest } from './exportRequest';

export type ExportAuditAction =
  | 'export_requested'
  | 'export_generated'
  | 'export_failed'
  | 'export_downloaded';

export interface ExportAuditEvent {
  action: ExportAuditAction;
  tenant_id: string;
  case_id?: string;
  actor_user_id?: string;
  target_type: ExportRequest['target_type'];
  target_id: string;
  format: ExportFormat;
  export_id?: string;
  occurred_at: string;
  reason_code?: string;
  metadata?: Record<string, unknown>;
}

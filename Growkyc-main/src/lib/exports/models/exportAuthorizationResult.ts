import type { ExportRequest } from './exportRequest';

export type ExportAuthorizationReasonCode =
  | 'authorized'
  | 'missing_actor'
  | 'tenant_mismatch'
  | 'insufficient_role'
  | 'insufficient_permission';

export interface ExportAuthorizationActor {
  user_id: string;
  tenant_id: string;
  role: string;
  permissions?: string[];
}

export interface ExportAuthorizationInput {
  request: ExportRequest;
  actor?: ExportAuthorizationActor;
  has_tenant_access?: (actor: ExportAuthorizationActor, tenant_id: string) => boolean;
  can_export_target_by_role?: (role: string, target_type: ExportRequest['target_type']) => boolean;
}

export interface ExportAuthorizationResult {
  allowed: boolean;
  reason_code: ExportAuthorizationReasonCode;
  reason_detail: string;
}
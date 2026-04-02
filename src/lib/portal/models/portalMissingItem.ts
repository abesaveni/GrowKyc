import type { PortalStatus } from './portalStatus';

export interface PortalMissingItem {
  item_id: string;
  tenant_id: string;
  case_id?: string;
  step_id?: string;
  label: string;
  reason?: string;
  status: PortalStatus;
  requested_at?: string;
  received_at?: string;
}

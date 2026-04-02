import type { PortalStatus } from './portalStatus';

export interface PortalStep {
  step_id: string;
  title: string;
  description?: string;
  status: PortalStatus;
  due_at?: string;
  completed_at?: string;
  updated_at: string;
}

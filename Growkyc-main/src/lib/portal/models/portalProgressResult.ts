import type { PortalMissingItem } from './portalMissingItem';
import type { PortalStep } from './portalStep';

export interface PortalProgressInput {
  steps: PortalStep[];
  missing_items: PortalMissingItem[];
}

export interface PortalProgressResult {
  total_steps: number;
  completed_steps: number;
  blocked_steps_count: number;
  completion_percent: number;
  missing_required_items: PortalMissingItem[];
  blocked_steps: PortalStep[];
}

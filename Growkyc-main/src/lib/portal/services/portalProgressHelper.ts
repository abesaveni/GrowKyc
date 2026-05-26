import type { PortalMissingItem } from '../models/portalMissingItem';
import type { PortalProgressInput, PortalProgressResult } from '../models/portalProgressResult';
import type { PortalStep } from '../models/portalStep';

const BLOCKED_STEP_STATUSES = new Set(['awaiting_documents', 'changes_requested']);

const normalize = (value?: string): string => {
  return (value ?? '').trim().toLowerCase();
};

const roundPercent = (value: number): number => {
  return Math.round(value * 100) / 100;
};

const isMissingItemResolved = (item: PortalMissingItem): boolean => {
  if (item.received_at) {
    return true;
  }

  return normalize(item.status) === 'completed';
};

export const identifyMissingRequiredItems = (
  missing_items: PortalMissingItem[],
): PortalMissingItem[] => {
  return missing_items.filter((item) => !isMissingItemResolved(item));
};

export const identifyBlockedSteps = (
  steps: PortalStep[],
  missing_required_items: PortalMissingItem[],
): PortalStep[] => {
  const stepIdsWithMissingItems = new Set(
    missing_required_items
      .map((item) => item.step_id)
      .filter((step_id): step_id is string => Boolean(step_id)),
  );

  return steps.filter((step) => {
    if (stepIdsWithMissingItems.has(step.step_id)) {
      return true;
    }

    return BLOCKED_STEP_STATUSES.has(normalize(step.status));
  });
};

export const calculateCompletionProgress = (
  steps: PortalStep[],
): {
  total_steps: number;
  completed_steps: number;
  completion_percent: number;
} => {
  const total_steps = steps.length;
  const completed_steps = steps.filter((step) => normalize(step.status) === 'completed').length;
  const completion_percent = total_steps === 0 ? 0 : roundPercent((completed_steps / total_steps) * 100);

  return {
    total_steps,
    completed_steps,
    completion_percent,
  };
};

export const buildPortalProgress = (input: PortalProgressInput): PortalProgressResult => {
  const missing_required_items = identifyMissingRequiredItems(input.missing_items);
  const blocked_steps = identifyBlockedSteps(input.steps, missing_required_items);
  const progress = calculateCompletionProgress(input.steps);

  return {
    total_steps: progress.total_steps,
    completed_steps: progress.completed_steps,
    blocked_steps_count: blocked_steps.length,
    completion_percent: progress.completion_percent,
    missing_required_items,
    blocked_steps,
  };
};

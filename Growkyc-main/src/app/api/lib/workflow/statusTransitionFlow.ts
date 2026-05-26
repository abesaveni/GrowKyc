import { CaseStatus } from '../../../services/BotTypes';

export type WorkflowStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'escalated';

const VALID_TRANSITIONS: Record<WorkflowStatus, WorkflowStatus[]> = {
  pending: ['running', 'failed'],
  running: ['completed', 'failed', 'escalated'],
  completed: [],
  failed: ['escalated'],
  escalated: [],
};

export class InvalidWorkflowTransitionError extends Error {
  readonly statusCode = 400;

  constructor(from: WorkflowStatus, to: WorkflowStatus) {
    super(`Invalid workflow transition: ${from} -> ${to}`);
    this.name = 'InvalidWorkflowTransitionError';
  }
}

export interface WorkflowTransition {
  from: WorkflowStatus;
  to: WorkflowStatus;
}

export interface CaseHistoryTransitionInput {
  caseId: string;
  organizationId: string;
  changedByUserId?: string;
  scope: 'run_one' | 'run_all';
  transition: WorkflowTransition;
}

export function assertValidWorkflowTransition(transition: WorkflowTransition): void {
  if (!VALID_TRANSITIONS[transition.from].includes(transition.to)) {
    throw new InvalidWorkflowTransitionError(transition.from, transition.to);
  }
}

export function mapWorkflowStatusToCaseStatus(status: WorkflowStatus): CaseStatus {
  if (status === 'escalated') {
    return 'escalated';
  }

  if (status === 'completed') {
    return 'open';
  }

  return 'in_review';
}

export function toCaseStatusHistoryPatch(input: CaseHistoryTransitionInput): {
  caseId: string;
  organizationId: string;
  fromStatus: CaseStatus;
  toStatus: CaseStatus;
  reason: string;
  changedByUserId?: string;
  idempotencyKey: string;
} {
  assertValidWorkflowTransition(input.transition);

  const fromStatus = mapWorkflowStatusToCaseStatus(input.transition.from);
  const toStatus = mapWorkflowStatusToCaseStatus(input.transition.to);
  const reason = `Workflow transition: ${input.transition.from} -> ${input.transition.to}`;

  return {
    caseId: input.caseId,
    organizationId: input.organizationId,
    fromStatus,
    toStatus,
    reason,
    changedByUserId: input.changedByUserId,
    idempotencyKey: `${input.scope}:${input.caseId}:${input.transition.from}:${input.transition.to}`,
  };
}
import {
  determineEscalationRequirement,
  type DetermineEscalationRequirementInput,
  type DetermineEscalationRequirementResult,
} from './escalationRulesHelper';
import {
  EscalationAuditHooks,
  type EscalationAuditContext,
} from './escalationAuditHooks';
import type {
  EscalationLevelType,
  EscalationModel,
  EscalationReasonType,
  EscalationStateType,
  EscalationTargetType,
} from './escalationModel';
import type { PeriodicReviewAuditWriter } from './periodicReviewAuditHooks';

export interface EscalationPersistenceRecord {
  id: string;
  tenant_id: string;
  case_id: string;
  actor_id: string;
  level: EscalationLevelType;
  target_type: EscalationTargetType;
  target_id: string;
  state: EscalationStateType;
  reason_type: EscalationReasonType;
  reason_text?: string;
  created_at: string;
  updated_at: string;
}

export interface EscalationPersistencePort {
  createEscalationRecord(
    record: EscalationPersistenceRecord,
  ): Promise<EscalationPersistenceRecord>;
  updateEscalationRecord(input: {
    id: string;
    tenant_id: string;
    case_id: string;
    changes: Partial<EscalationPersistenceRecord>;
  }): Promise<EscalationPersistenceRecord>;
}

export interface EscalationServiceDependencies {
  persistence: EscalationPersistencePort;
  auditWriter: PeriodicReviewAuditWriter;
}

export interface CreateEscalationServiceInput {
  id: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  level: EscalationLevelType;
  targetType: EscalationTargetType;
  targetId: string;
  reasonType: EscalationReasonType;
  reasonText?: string;
  state?: EscalationStateType;
  createdAt?: string | Date;
}

export interface TriggerEscalationServiceInput {
  escalation: EscalationModel;
  actorId: string;
  ruleInput: DetermineEscalationRequirementInput;
  triggeredAt?: string | Date;
}

export interface ResolveEscalationServiceInput {
  escalation: EscalationModel;
  actorId: string;
  resolvedAt?: string | Date;
}

export interface CloseEscalationServiceInput {
  escalation: EscalationModel;
  actorId: string;
  closedAt?: string | Date;
  closeState?: Extract<EscalationStateType, 'resolved' | 'rejected'>;
}

export interface EscalationServiceDecisionResult {
  escalation: EscalationModel;
  decision: DetermineEscalationRequirementResult;
}

/**
 * Centralized server-side service wiring escalation model, rules helper, persistence, and audit hooks.
 * Intentionally modular for API integration later.
 */
export class EscalationService {
  private readonly persistence: EscalationPersistencePort;
  private readonly auditHooks: EscalationAuditHooks;

  constructor(dependencies: EscalationServiceDependencies) {
    this.persistence = dependencies.persistence;
    this.auditHooks = new EscalationAuditHooks(dependencies.auditWriter);
  }

  async createEscalation(input: CreateEscalationServiceInput): Promise<EscalationModel> {
    const createdAt = normalizeDate(input.createdAt ?? new Date(), 'createdAt');

    const persisted = await this.persistence.createEscalationRecord({
      id: input.id,
      tenant_id: input.tenantId,
      case_id: input.caseId,
      actor_id: input.actorId,
      level: input.level,
      target_type: input.targetType,
      target_id: normalizeRequiredText(input.targetId, 'targetId'),
      state: input.state ?? 'open',
      reason_type: input.reasonType,
      reason_text: normalizeOptionalText(input.reasonText),
      created_at: createdAt.toISOString(),
      updated_at: createdAt.toISOString(),
    });

    const escalation = mapPersistenceRecordToModel(persisted);

    await this.auditHooks.onEscalationCreated(
      this.buildAuditContext(escalation, persisted.target_id, input.actorId, createdAt),
      {
        reason_type: escalation.reasonType,
        reason_text: escalation.reasonText,
      },
    );

    return escalation;
  }

  async triggerEscalation(
    input: TriggerEscalationServiceInput,
  ): Promise<EscalationServiceDecisionResult> {
    const decision = determineEscalationRequirement(input.ruleInput);

    if (!decision.isEscalationRequired) {
      return {
        escalation: input.escalation,
        decision,
      };
    }

    const triggeredAt = normalizeDate(input.triggeredAt ?? new Date(), 'triggeredAt');

    const persisted = await this.persistence.updateEscalationRecord({
      id: input.escalation.id,
      tenant_id: input.escalation.tenantId,
      case_id: requireCaseId(input.escalation),
      changes: {
        actor_id: input.actorId,
        level: decision.level,
        state: 'in_review',
        updated_at: triggeredAt.toISOString(),
      },
    });

    const escalation = mapPersistenceRecordToModel(persisted);

    await this.auditHooks.onEscalationTriggered(
      this.buildAuditContext(escalation, persisted.target_id, input.actorId, triggeredAt),
      {
        decision_reason_codes: decision.reasonCodes,
      },
    );

    return {
      escalation,
      decision,
    };
  }

  async resolveEscalation(
    input: ResolveEscalationServiceInput,
  ): Promise<EscalationModel> {
    const resolvedAt = normalizeDate(input.resolvedAt ?? new Date(), 'resolvedAt');

    const persisted = await this.persistence.updateEscalationRecord({
      id: input.escalation.id,
      tenant_id: input.escalation.tenantId,
      case_id: requireCaseId(input.escalation),
      changes: {
        actor_id: input.actorId,
        state: 'resolved',
        updated_at: resolvedAt.toISOString(),
      },
    });

    const escalation = mapPersistenceRecordToModel(persisted);

    await this.auditHooks.onEscalationResolved(
      this.buildAuditContext(escalation, persisted.target_id, input.actorId, resolvedAt),
    );

    return escalation;
  }

  async closeEscalation(input: CloseEscalationServiceInput): Promise<EscalationModel> {
    const closedAt = normalizeDate(input.closedAt ?? new Date(), 'closedAt');
    const closeState = input.closeState ?? 'rejected';

    const persisted = await this.persistence.updateEscalationRecord({
      id: input.escalation.id,
      tenant_id: input.escalation.tenantId,
      case_id: requireCaseId(input.escalation),
      changes: {
        actor_id: input.actorId,
        state: closeState,
        updated_at: closedAt.toISOString(),
      },
    });

    const escalation = mapPersistenceRecordToModel(persisted);

    await this.auditHooks.onEscalationClosed(
      this.buildAuditContext(escalation, persisted.target_id, input.actorId, closedAt),
      {
        close_state: closeState,
      },
    );

    return escalation;
  }

  private buildAuditContext(
    escalation: EscalationModel,
    targetId: string,
    actorId: string,
    occurredAt?: string | Date,
  ): EscalationAuditContext {
    return {
      tenantId: escalation.tenantId,
      caseId: requireCaseId(escalation),
      escalationId: escalation.id,
      actorId,
      level: escalation.level,
      state: escalation.state,
      targetType: escalation.target,
      targetId,
      occurredAt,
    };
  }
}

let escalationServiceInstance: EscalationService | null = null;

export function getEscalationService(
  dependencies: EscalationServiceDependencies,
): EscalationService {
  if (!escalationServiceInstance) {
    escalationServiceInstance = new EscalationService(dependencies);
  }

  return escalationServiceInstance;
}

function mapPersistenceRecordToModel(
  record: EscalationPersistenceRecord,
): EscalationModel {
  return {
    id: record.id,
    tenantId: record.tenant_id,
    level: record.level,
    target: record.target_type,
    state: record.state,
    reasonType: record.reason_type,
    reasonText: record.reason_text,
    actor: {
      actor_id: record.actor_id,
      timestamp: record.updated_at,
    },
    linkage: {
      caseId: record.case_id,
      reviewId: record.target_type === 'review' ? record.target_id : undefined,
      approvalId: record.target_type === 'approval' ? record.target_id : undefined,
      findingId: record.target_type === 'finding' ? record.target_id : undefined,
    },
  };
}

function requireCaseId(escalation: EscalationModel): string {
  const caseId = escalation.linkage.caseId;

  if (!caseId) {
    throw new Error('escalation linkage.caseId is required');
  }

  return caseId;
}

function normalizeRequiredText(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
}

function normalizeOptionalText(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}
import {
  validateOverrideReason,
  type OverrideValidationResult,
} from './overrideReasonValidationHelper';
import {
  createOverrideReasonRecord,
  type CreateOverrideReasonRecordInput,
  type OverrideReasonPersistencePort,
  type OverrideReasonPersistenceRecord,
} from './overrideReasonPersistenceHelper';
import {
  OverrideAuditHooks,
  type OverrideAuditContext,
} from './overrideAuditHooks';
import type {
  OverrideReasonCategory,
  OverrideReasonModel,
  OverrideReasonTarget,
} from './overrideReasonModel';
import type { PeriodicReviewAuditWriter } from './periodicReviewAuditHooks';

export interface OverrideServiceDependencies {
  persistence: OverrideReasonPersistencePort;
  auditWriter: PeriodicReviewAuditWriter;
  minimumReasonLength?: number;
  requireReasonCode?: boolean;
}

export interface CreateOverrideServiceInput {
  id: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  category: OverrideReasonCategory;
  targetType: OverrideReasonTarget;
  targetId: string;
  reasonText: string;
  reasonCode?: string;
  createdAt?: string | Date;
}

export interface ApplyOverrideServiceInput {
  override: OverrideReasonModel;
  targetId: string;
  actorId: string;
  reasonText?: string;
  reasonCode?: string;
  occurredAt?: string | Date;
}

export interface RejectOverrideServiceInput {
  override: OverrideReasonModel;
  targetId: string;
  actorId: string;
  reasonText?: string;
  reasonCode?: string;
  occurredAt?: string | Date;
}

/**
 * Centralized server-side override service wiring model, validation, persistence, and audit hooks.
 * Intentionally modular for API integration later.
 */
export class OverrideService {
  private readonly persistence: OverrideReasonPersistencePort;
  private readonly auditHooks: OverrideAuditHooks;
  private readonly minimumReasonLength: number;
  private readonly requireReasonCode: boolean;

  constructor(dependencies: OverrideServiceDependencies) {
    this.persistence = dependencies.persistence;
    this.auditHooks = new OverrideAuditHooks(dependencies.auditWriter);
    this.minimumReasonLength = dependencies.minimumReasonLength ?? 12;
    this.requireReasonCode = dependencies.requireReasonCode ?? false;
  }

  async createOverride(input: CreateOverrideServiceInput): Promise<OverrideReasonModel> {
    const validation = this.validateOverridePayload({
      category: input.category,
      target: input.targetType,
      reasonText: input.reasonText,
      reasonCode: input.reasonCode,
    });

    const persisted = await createOverrideReasonRecord(
      {
        id: input.id,
        tenantId: input.tenantId,
        caseId: input.caseId,
        actorId: input.actorId,
        category: validation.normalized.category as OverrideReasonCategory,
        targetType: validation.normalized.target as OverrideReasonTarget,
        targetId: input.targetId,
        reasonText: validation.normalized.reasonText,
        createdAt: input.createdAt,
        updatedAt: input.createdAt,
      } satisfies CreateOverrideReasonRecordInput,
      this.persistence,
    );

    const model = mapPersistenceRecordToOverrideModel(persisted);

    await this.auditHooks.onOverrideCreated(
      this.buildAuditContext(model, persisted.target_id, input.actorId, input.createdAt),
      buildReasonCodeMetadata(validation.normalized.reasonCode),
    );

    return model;
  }

  async applyOverride(input: ApplyOverrideServiceInput): Promise<void> {
    const reasonText = input.reasonText ?? input.override.reasonText;

    const validation = this.validateOverridePayload({
      category: input.override.category,
      target: input.override.target,
      reasonText,
      reasonCode: input.reasonCode,
    });

    await this.auditHooks.onOverrideApplied(
      this.buildAuditContext(input.override, input.targetId, input.actorId, input.occurredAt),
      {
        ...buildReasonCodeMetadata(validation.normalized.reasonCode),
        applied_by: input.actorId,
      },
    );
  }

  async rejectOverride(input: RejectOverrideServiceInput): Promise<void> {
    const reasonText = input.reasonText ?? input.override.reasonText;

    const validation = this.validateOverridePayload({
      category: input.override.category,
      target: input.override.target,
      reasonText,
      reasonCode: input.reasonCode,
    });

    await this.auditHooks.onOverrideRejected(
      this.buildAuditContext(input.override, input.targetId, input.actorId, input.occurredAt),
      {
        ...buildReasonCodeMetadata(validation.normalized.reasonCode),
        rejected_by: input.actorId,
      },
    );
  }

  private validateOverridePayload(input: {
    category: string;
    target: string;
    reasonText?: string;
    reasonCode?: string;
  }): OverrideValidationResult {
    const validation = validateOverrideReason({
      category: input.category,
      target: input.target,
      reasonText: input.reasonText,
      reasonCode: input.reasonCode,
      minimumReasonLength: this.minimumReasonLength,
      requireReasonCode: this.requireReasonCode,
    });

    if (!validation.isValid) {
      throw new Error(`Invalid override reason payload: ${validation.errors.join(', ')}`);
    }

    return validation;
  }

  private buildAuditContext(
    override: OverrideReasonModel,
    targetId: string,
    actorId: string,
    occurredAt?: string | Date,
  ): OverrideAuditContext {
    const caseId = override.linkage.caseId;

    if (!caseId) {
      throw new Error('override linkage.caseId is required for audit events');
    }

    return {
      tenantId: override.tenantId,
      caseId,
      overrideId: override.id,
      actorId,
      category: override.category,
      targetType: override.target,
      targetId,
      occurredAt,
    };
  }
}

let overrideServiceInstance: OverrideService | null = null;

export function getOverrideService(
  dependencies: OverrideServiceDependencies,
): OverrideService {
  if (!overrideServiceInstance) {
    overrideServiceInstance = new OverrideService(dependencies);
  }

  return overrideServiceInstance;
}

function mapPersistenceRecordToOverrideModel(
  record: OverrideReasonPersistenceRecord,
): OverrideReasonModel {
  return {
    id: record.id,
    tenantId: record.tenant_id,
    category: record.category,
    target: record.target_type,
    reasonText: record.reason_text,
    actor: {
      actor_id: record.actor_id,
      timestamp: record.created_at,
    },
    linkage: buildLinkage(record.case_id, record.target_type, record.target_id),
  };
}

function buildLinkage(
  caseId: string,
  targetType: OverrideReasonTarget,
  targetId: string,
): OverrideReasonModel['linkage'] {
  return {
    caseId,
    reviewId: targetType === 'review' ? targetId : undefined,
    approvalId: targetType === 'approval' ? targetId : undefined,
    findingId: targetType === 'finding' ? targetId : undefined,
  };
}

function buildReasonCodeMetadata(reasonCode?: string): Record<string, unknown> | undefined {
  if (!reasonCode) {
    return undefined;
  }

  return { reason_code: reasonCode };
}
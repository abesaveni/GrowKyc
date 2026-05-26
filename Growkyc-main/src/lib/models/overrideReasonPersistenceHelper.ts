import type {
  OverrideReasonCategory,
  OverrideReasonTarget,
} from './overrideReasonModel';

export interface OverrideReasonPersistenceRecord {
  id: string;
  tenant_id: string;
  case_id: string;
  actor_id: string;
  category: OverrideReasonCategory;
  target_type: OverrideReasonTarget;
  target_id: string;
  reason_text: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOverrideReasonRecordInput {
  id: string;
  tenantId: string;
  caseId: string;
  actorId: string;
  category: OverrideReasonCategory;
  targetType: OverrideReasonTarget;
  targetId: string;
  reasonText: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface OverrideReasonPersistencePort {
  createOverrideReasonRecord(
    record: OverrideReasonPersistenceRecord,
  ): Promise<OverrideReasonPersistenceRecord>;
}

/**
 * Creates and persists an override reason record with normalized timestamps.
 */
export async function createOverrideReasonRecord(
  input: CreateOverrideReasonRecordInput,
  persistence: OverrideReasonPersistencePort,
): Promise<OverrideReasonPersistenceRecord> {
  const now = new Date();
  const createdAt = normalizeDate(input.createdAt ?? now, 'createdAt');
  const updatedAt = normalizeDate(input.updatedAt ?? createdAt, 'updatedAt');

  const record: OverrideReasonPersistenceRecord = {
    id: input.id,
    tenant_id: input.tenantId,
    case_id: input.caseId,
    actor_id: input.actorId,
    category: input.category,
    target_type: input.targetType,
    target_id: normalizeRequiredText(input.targetId, 'targetId'),
    reason_text: normalizeRequiredText(input.reasonText, 'reasonText'),
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
  };

  return persistence.createOverrideReasonRecord(record);
}

function normalizeRequiredText(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}
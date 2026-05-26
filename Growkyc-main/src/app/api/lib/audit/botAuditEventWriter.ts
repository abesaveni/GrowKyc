import { TenantContext } from '../../middleware/auth';
import { providerRegistry } from '../../../lib/providers/providerRegistry';
import { assertTenantOwnership } from '../auth/tenantIsolation';

export type BotAuditEventType =
  | 'bot_run_started'
  | 'bot_run_completed'
  | 'bot_run_failed'
  | 'evidence_pack_created'
  | 'case_status_changed';

export interface BotAuditTarget {
  objectType: string;
  objectId?: string;
}

export interface BotAuditEventShape {
  eventType: BotAuditEventType;
  tenantId: string;
  actor: {
    userId: string;
    email?: string;
    role: string;
  };
  target: BotAuditTarget;
  occurredAt: string;
  metadata: Record<string, unknown>;
}

export class BotAuditWriteError extends Error {
  readonly statusCode = 500;

  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'BotAuditWriteError';
  }
}

export function buildBotAuditEvent(input: {
  eventType: BotAuditEventType;
  ctx: TenantContext;
  target: BotAuditTarget;
  metadata?: Record<string, unknown>;
  occurredAt?: string;
}): BotAuditEventShape {
  return Object.freeze({
    eventType: input.eventType,
    tenantId: input.ctx.organizationId,
    actor: {
      userId: input.ctx.userId,
      email: input.ctx.email,
      role: input.ctx.role,
    },
    target: input.target,
    occurredAt: input.occurredAt ?? new Date().toISOString(),
    metadata: Object.freeze({ ...(input.metadata ?? {}) }),
  });
}

function toSeverity(eventType: BotAuditEventType): 'info' | 'warning' | 'error' {
  if (eventType === 'bot_run_failed') {
    return 'error';
  }

  if (eventType === 'case_status_changed') {
    return 'warning';
  }

  return 'info';
}

export class BotAuditEventWriter {
  async write(event: BotAuditEventShape): Promise<void> {
    try {
      assertTenantOwnership({
        resource: 'audit_events',
        tenantId: event.tenantId,
        resourceOrganizationId: event.tenantId,
      });

      await providerRegistry.audit.createAuditEvent({
        organizationId: event.tenantId,
        actorUserId: event.actor.userId,
        eventType: event.eventType,
        severity: toSeverity(event.eventType),
        action: event.eventType,
        resourceType: event.target.objectType,
        resourceId: event.target.objectId,
        module: 'grow_kyc',
        data: {
          tenant_id: event.tenantId,
          actor: {
            user_id: event.actor.userId,
            email: event.actor.email,
            role: event.actor.role,
          },
          target: {
            object_type: event.target.objectType,
            object_id: event.target.objectId,
          },
          timestamp: event.occurredAt,
          metadata: event.metadata,
        },
      });
    } catch (error) {
      throw new BotAuditWriteError(`Failed to persist audit event: ${event.eventType}`, error);
    }
  }
}

export const botAuditEventWriter = new BotAuditEventWriter();
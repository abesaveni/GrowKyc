import { AuditEvent } from './BotTypes';
import { botPersistenceRepository } from './BotPersistence';

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

interface LogEventInput {
  organizationId?: string;
  actorUserId?: string;
  eventType: string;
  severity?: AuditEvent['severity'];
  targetType: string;
  targetId?: string;
  data?: Record<string, unknown>;
}

export class BotAuditService {
  async logEvent(input: LogEventInput): Promise<AuditEvent> {
    const event: AuditEvent = {
      id: createId('audit'),
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      eventType: input.eventType,
      severity: input.severity || 'info',
      targetType: input.targetType,
      targetId: input.targetId,
      data: input.data,
      occurredAt: new Date().toISOString(),
    };

    return botPersistenceRepository.persistAuditEvent(event);
  }
}

export const botAuditService = new BotAuditService();

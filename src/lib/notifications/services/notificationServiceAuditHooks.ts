import type { NotificationChannel } from '../models/notificationChannel';
import type { NotificationResult } from '../models/notificationResult';
import type { NotificationType } from '../models/notificationType';

export type NotificationServiceAuditAction =
  | 'notification_send_started'
  | 'notification_send_completed'
  | 'notification_send_failed'
  | 'notification_template_resolved'
  | 'notification_template_resolution_failed';

export interface NotificationServiceAuditEvent {
  action: NotificationServiceAuditAction;
  notification_id: string;
  tenant_id: string;
  notification_type: NotificationType;
  channel: NotificationChannel;
  occurred_at: string;
  status?: NotificationResult['status'];
  reason_code?: string;
  metadata?: Record<string, unknown>;
}

export interface INotificationServiceAuditWriter {
  writeNotificationServiceAuditEvent(event: NotificationServiceAuditEvent): Promise<void>;
}

export interface EmitNotificationServiceAuditEventInput {
  action: NotificationServiceAuditAction;
  notification_id: string;
  tenant_id: string;
  notification_type: NotificationType;
  channel: NotificationChannel;
  occurred_at: string;
  status?: NotificationResult['status'];
  reason_code?: string;
  metadata?: Record<string, unknown>;
}

const toEvent = (input: EmitNotificationServiceAuditEventInput): NotificationServiceAuditEvent => {
  return {
    action: input.action,
    notification_id: input.notification_id,
    tenant_id: input.tenant_id,
    notification_type: input.notification_type,
    channel: input.channel,
    occurred_at: input.occurred_at,
    status: input.status,
    reason_code: input.reason_code,
    metadata: input.metadata,
  };
};

export const emitNotificationServiceAuditEvent = async (
  writer: INotificationServiceAuditWriter | undefined,
  input: EmitNotificationServiceAuditEventInput
): Promise<void> => {
  if (!writer) {
    return;
  }

  await writer.writeNotificationServiceAuditEvent(toEvent(input));
};

export const emitNotificationSendStartedAuditEvent = async (
  writer: INotificationServiceAuditWriter | undefined,
  input: Omit<EmitNotificationServiceAuditEventInput, 'action'>
): Promise<void> => {
  return emitNotificationServiceAuditEvent(writer, {
    ...input,
    action: 'notification_send_started',
  });
};

export const emitNotificationSendCompletedAuditEvent = async (
  writer: INotificationServiceAuditWriter | undefined,
  input: Omit<EmitNotificationServiceAuditEventInput, 'action'>
): Promise<void> => {
  return emitNotificationServiceAuditEvent(writer, {
    ...input,
    action: 'notification_send_completed',
  });
};

export const emitNotificationSendFailedAuditEvent = async (
  writer: INotificationServiceAuditWriter | undefined,
  input: Omit<EmitNotificationServiceAuditEventInput, 'action'>
): Promise<void> => {
  return emitNotificationServiceAuditEvent(writer, {
    ...input,
    action: 'notification_send_failed',
  });
};

export const emitNotificationTemplateResolvedAuditEvent = async (
  writer: INotificationServiceAuditWriter | undefined,
  input: Omit<EmitNotificationServiceAuditEventInput, 'action'>
): Promise<void> => {
  return emitNotificationServiceAuditEvent(writer, {
    ...input,
    action: 'notification_template_resolved',
  });
};

export const emitNotificationTemplateResolutionFailedAuditEvent = async (
  writer: INotificationServiceAuditWriter | undefined,
  input: Omit<EmitNotificationServiceAuditEventInput, 'action'>
): Promise<void> => {
  return emitNotificationServiceAuditEvent(writer, {
    ...input,
    action: 'notification_template_resolution_failed',
  });
};

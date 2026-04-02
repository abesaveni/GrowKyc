import type { NotificationChannel } from './notificationChannel';
import type { NotificationType } from './notificationType';
import type { NotificationTemplateVariableMap } from './notificationTemplateVariable';

export interface NotificationRequest {
  tenant_id: string;
  notification_type: NotificationType;
  channel: NotificationChannel;
  recipient_email?: string;
  variables?: NotificationTemplateVariableMap;
  metadata?: Record<string, unknown>;
}

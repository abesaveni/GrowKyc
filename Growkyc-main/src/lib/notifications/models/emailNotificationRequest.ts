import type { NotificationType } from './notificationType';

export interface EmailNotificationRequest {
  tenant_id: string;
  notification_type: NotificationType;
  recipient_email: string;
  subject: string;
  body: string;
  metadata?: Record<string, unknown>;
}

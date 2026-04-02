import type { NotificationStatus } from './notificationStatus';
import type { NotificationType } from './notificationType';
import type { EmailNotificationError } from './emailNotificationError';

export interface EmailNotificationResult {
  notification_id: string;
  tenant_id: string;
  notification_type: NotificationType;
  channel: 'email';
  status: NotificationStatus;
  sent_at?: string;
  provider_message_id?: string;
  error?: EmailNotificationError;
}

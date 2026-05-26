import type { EmailNotificationError } from './emailNotificationError';
import type { NotificationChannel } from './notificationChannel';
import type { NotificationStatus } from './notificationStatus';
import type { NotificationType } from './notificationType';

export interface NotificationResult {
  notification_id: string;
  tenant_id: string;
  notification_type: NotificationType;
  channel: NotificationChannel;
  status: NotificationStatus;
  sent_at?: string;
  provider_message_id?: string;
  error?: EmailNotificationError;
}

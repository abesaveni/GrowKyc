import type { IEmailNotificationAdapter } from '../adapters/email/emailNotificationAdapter';
import type { NotificationChannel } from '../models/notificationChannel';
import type { NotificationResult } from '../models/notificationResult';
import type { NotificationRequest } from '../models/notificationRequest';
import type { NotificationTemplateContent } from '../models/notificationTemplate';

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Notification channel dispatcher is server-side only.');
  }
}

export type NotificationChannelDispatchStatus = 'dispatched' | 'unsupported_channel' | 'dispatch_failed';

export interface NotificationChannelDispatchResult {
  status: NotificationChannelDispatchStatus;
  notification_result?: NotificationResult;
  reason_code?: string;
}

export interface NotificationChannelDispatcherAdapters {
  email?: IEmailNotificationAdapter;
}

export interface NotificationChannelDispatcherDependencies {
  adapters?: NotificationChannelDispatcherAdapters;
}

export class NotificationChannelDispatcher {
  private readonly adapters: NotificationChannelDispatcherAdapters;

  constructor(dependencies: NotificationChannelDispatcherDependencies = {}) {
    this.adapters = dependencies.adapters ?? {};
  }

  async dispatch(
    request: NotificationRequest,
    content: NotificationTemplateContent,
    notification_id: string
  ): Promise<NotificationChannelDispatchResult> {
    assertServerRuntime();

    const channel: NotificationChannel = request.channel;

    if (channel === 'email') {
      return this.dispatchEmail(request, content, notification_id);
    }

    // sms and in_app are not yet implemented
    return {
      status: 'unsupported_channel',
      reason_code: `channel_not_implemented_${channel}`,
    };
  }

  private async dispatchEmail(
    request: NotificationRequest,
    content: NotificationTemplateContent,
    notification_id: string
  ): Promise<NotificationChannelDispatchResult> {
    const adapter = this.adapters.email;

    if (!adapter) {
      return {
        status: 'unsupported_channel',
        reason_code: 'email_adapter_not_configured',
      };
    }

    if (!request.recipient_email) {
      return {
        status: 'dispatch_failed',
        reason_code: 'missing_recipient_email',
      };
    }

    try {
      const emailResult = await adapter.send({
        tenant_id: request.tenant_id,
        notification_type: request.notification_type,
        recipient_email: request.recipient_email,
        subject: content.subject,
        body: content.body,
        metadata: request.metadata,
      });

      // Map the email-specific result to the generic notification result shape
      const notificationResult: NotificationResult = {
        notification_id,
        tenant_id: emailResult.tenant_id,
        notification_type: emailResult.notification_type,
        channel: 'email',
        status: emailResult.status,
        sent_at: emailResult.sent_at,
        provider_message_id: emailResult.provider_message_id,
        error: emailResult.error,
      };

      if (emailResult.status === 'failed') {
        return {
          status: 'dispatch_failed',
          notification_result: notificationResult,
          reason_code: emailResult.error?.code ?? 'send_failed',
        };
      }

      return {
        status: 'dispatched',
        notification_result: notificationResult,
      };
    } catch (error) {
      return {
        status: 'dispatch_failed',
        reason_code: 'adapter_threw',
        notification_result: {
          notification_id,
          tenant_id: request.tenant_id,
          notification_type: request.notification_type,
          channel: 'email',
          status: 'failed',
          error: {
            code: 'provider_unavailable',
            message: error instanceof Error ? error.message : 'Dispatcher caught unexpected error.',
            retryable: true,
            cause: error,
          },
        },
      };
    }
  }

  supportsChannel(channel: NotificationChannel): boolean {
    if (channel === 'email') {
      return this.adapters.email !== undefined;
    }

    return false;
  }
}

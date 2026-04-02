import type { NotificationRequest } from '../models/notificationRequest';
import type { NotificationResult } from '../models/notificationResult';
import type {
  INotificationServiceAuditWriter,
} from './notificationServiceAuditHooks';
import {
  emitNotificationSendCompletedAuditEvent,
  emitNotificationSendFailedAuditEvent,
  emitNotificationSendStartedAuditEvent,
  emitNotificationTemplateResolutionFailedAuditEvent,
  emitNotificationTemplateResolvedAuditEvent,
} from './notificationServiceAuditHooks';
import {
  NotificationChannelDispatcher,
  type NotificationChannelDispatcherDependencies,
} from './notificationChannelDispatcher';
import {
  NotificationTemplateResolver,
  type NotificationTemplateResolverDependencies,
} from './notificationTemplateResolver';

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Notification service is server-side only.');
  }
}

export type NotificationServiceSendStatus = 'sent' | 'failed' | 'unsupported_channel' | 'template_not_found' | 'template_resolution_failed';

export interface NotificationServiceSendResult {
  status: NotificationServiceSendStatus;
  notification_result?: NotificationResult;
  reason_code?: string;
}

export interface INotificationService {
  send(request: NotificationRequest): Promise<NotificationServiceSendResult>;
}

const unsafeMetadataKeys = new Set(['__proto__', 'constructor', 'prototype']);

function sanitizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!metadata) {
    return undefined;
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (unsafeMetadataKeys.has(key)) {
      continue;
    }

    sanitized[key] = value;
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

const defaultNotificationId = (): string => {
  return `ntf_${Date.now()}`;
};

const defaultNow = (): string => {
  return new Date().toISOString();
};

export interface NotificationServiceDependencies {
  template_resolver?: NotificationTemplateResolverDependencies;
  channel_dispatcher?: NotificationChannelDispatcherDependencies;
  audit_writer?: INotificationServiceAuditWriter;
  generate_notification_id?: () => string;
  now?: () => string;
}

export class NotificationService implements INotificationService {
  private readonly templateResolver: NotificationTemplateResolver;
  private readonly channelDispatcher: NotificationChannelDispatcher;
  private readonly auditWriter: INotificationServiceAuditWriter | undefined;
  private readonly generateNotificationId: () => string;
  private readonly now: () => string;

  constructor(dependencies: NotificationServiceDependencies = {}) {
    this.templateResolver = new NotificationTemplateResolver(dependencies.template_resolver);
    this.channelDispatcher = new NotificationChannelDispatcher(dependencies.channel_dispatcher);
    this.auditWriter = dependencies.audit_writer;
    this.generateNotificationId = dependencies.generate_notification_id ?? defaultNotificationId;
    this.now = dependencies.now ?? defaultNow;
  }

  async send(request: NotificationRequest): Promise<NotificationServiceSendResult> {
    assertServerRuntime();

    const notification_id = this.generateNotificationId();
    const occurred_at = this.now();

    const sanitizedRequest: NotificationRequest = {
      ...request,
      metadata: sanitizeMetadata(request.metadata),
    };

    await emitNotificationSendStartedAuditEvent(this.auditWriter, {
      notification_id,
      tenant_id: sanitizedRequest.tenant_id,
      notification_type: sanitizedRequest.notification_type,
      channel: sanitizedRequest.channel,
      occurred_at,
    });

    // Resolve template
    const templateResolveResult = await this.templateResolver.resolve(
      sanitizedRequest.notification_type,
      sanitizedRequest.channel,
      sanitizedRequest.tenant_id,
      sanitizedRequest.variables
    );

    if (templateResolveResult.status === 'not_found') {
      await emitNotificationTemplateResolutionFailedAuditEvent(this.auditWriter, {
        notification_id,
        tenant_id: sanitizedRequest.tenant_id,
        notification_type: sanitizedRequest.notification_type,
        channel: sanitizedRequest.channel,
        occurred_at: this.now(),
        reason_code: templateResolveResult.reason_code,
      });

      await emitNotificationSendFailedAuditEvent(this.auditWriter, {
        notification_id,
        tenant_id: sanitizedRequest.tenant_id,
        notification_type: sanitizedRequest.notification_type,
        channel: sanitizedRequest.channel,
        occurred_at: this.now(),
        status: 'failed',
        reason_code: templateResolveResult.reason_code,
      });

      return {
        status: 'template_not_found',
        reason_code: templateResolveResult.reason_code,
      };
    }

    if (templateResolveResult.status === 'resolution_failed' || !templateResolveResult.content) {
      await emitNotificationTemplateResolutionFailedAuditEvent(this.auditWriter, {
        notification_id,
        tenant_id: sanitizedRequest.tenant_id,
        notification_type: sanitizedRequest.notification_type,
        channel: sanitizedRequest.channel,
        occurred_at: this.now(),
        reason_code: templateResolveResult.reason_code,
      });

      await emitNotificationSendFailedAuditEvent(this.auditWriter, {
        notification_id,
        tenant_id: sanitizedRequest.tenant_id,
        notification_type: sanitizedRequest.notification_type,
        channel: sanitizedRequest.channel,
        occurred_at: this.now(),
        status: 'failed',
        reason_code: templateResolveResult.reason_code,
      });

      return {
        status: 'template_resolution_failed',
        reason_code: templateResolveResult.reason_code,
      };
    }

    await emitNotificationTemplateResolvedAuditEvent(this.auditWriter, {
      notification_id,
      tenant_id: sanitizedRequest.tenant_id,
      notification_type: sanitizedRequest.notification_type,
      channel: sanitizedRequest.channel,
      occurred_at: this.now(),
    });

    // Dispatch via channel
    const dispatchResult = await this.channelDispatcher.dispatch(
      sanitizedRequest,
      templateResolveResult.content,
      notification_id
    );

    if (dispatchResult.status === 'unsupported_channel') {
      await emitNotificationSendFailedAuditEvent(this.auditWriter, {
        notification_id,
        tenant_id: sanitizedRequest.tenant_id,
        notification_type: sanitizedRequest.notification_type,
        channel: sanitizedRequest.channel,
        occurred_at: this.now(),
        status: 'failed',
        reason_code: dispatchResult.reason_code,
      });

      return {
        status: 'unsupported_channel',
        reason_code: dispatchResult.reason_code,
      };
    }

    if (dispatchResult.status === 'dispatch_failed') {
      await emitNotificationSendFailedAuditEvent(this.auditWriter, {
        notification_id,
        tenant_id: sanitizedRequest.tenant_id,
        notification_type: sanitizedRequest.notification_type,
        channel: sanitizedRequest.channel,
        occurred_at: this.now(),
        status: 'failed',
        reason_code: dispatchResult.reason_code,
        metadata: dispatchResult.notification_result?.error
          ? { error_code: dispatchResult.notification_result.error.code }
          : undefined,
      });

      return {
        status: 'failed',
        reason_code: dispatchResult.reason_code,
        notification_result: dispatchResult.notification_result,
      };
    }

    await emitNotificationSendCompletedAuditEvent(this.auditWriter, {
      notification_id,
      tenant_id: sanitizedRequest.tenant_id,
      notification_type: sanitizedRequest.notification_type,
      channel: sanitizedRequest.channel,
      occurred_at: this.now(),
      status: 'sent',
    });

    return {
      status: 'sent',
      notification_result: dispatchResult.notification_result,
    };
  }
}

export const sendNotification = async (
  request: NotificationRequest,
  dependencies: NotificationServiceDependencies = {}
): Promise<NotificationServiceSendResult> => {
  const service = new NotificationService(dependencies);

  return service.send(request);
};

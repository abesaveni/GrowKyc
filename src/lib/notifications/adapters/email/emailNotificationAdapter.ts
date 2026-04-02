import type { EmailNotificationError } from '../../models/emailNotificationError';
import type { EmailNotificationRequest } from '../../models/emailNotificationRequest';
import type { EmailNotificationResult } from '../../models/emailNotificationResult';

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Email notification adapter is server-side only.');
  }
}

export interface EmailNotificationExecutionInput {
  notification_id: string;
  request: EmailNotificationRequest;
}

export interface EmailNotificationExecutionResult {
  ok: boolean;
  provider_message_id?: string;
  error?: EmailNotificationError;
}

export interface IEmailNotificationExecutionPort {
  sendEmail(input: EmailNotificationExecutionInput): Promise<EmailNotificationExecutionResult>;
}

export class NotConfiguredEmailNotificationExecutionPort implements IEmailNotificationExecutionPort {
  async sendEmail(): Promise<EmailNotificationExecutionResult> {
    return {
      ok: false,
      error: {
        code: 'not_configured',
        message: 'Email notification execution port is not configured.',
        retryable: false,
      },
    };
  }
}

export interface IEmailNotificationAdapter {
  send(request: EmailNotificationRequest): Promise<EmailNotificationResult>;
}

export interface EmailNotificationAdapterDependencies {
  execution_port?: IEmailNotificationExecutionPort;
  now?: () => string;
  generate_notification_id?: () => string;
}

const defaultNow = (): string => {
  return new Date().toISOString();
};

const defaultNotificationId = (): string => {
  return `ntf_${Date.now()}`;
};

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

function toFailedResult(params: {
  notification_id: string;
  request: EmailNotificationRequest;
  error: EmailNotificationError;
}): EmailNotificationResult {
  return {
    notification_id: params.notification_id,
    tenant_id: params.request.tenant_id,
    notification_type: params.request.notification_type,
    channel: 'email',
    status: 'failed',
    error: params.error,
  };
}

export class EmailNotificationAdapter implements IEmailNotificationAdapter {
  private readonly executionPort: IEmailNotificationExecutionPort;
  private readonly now: () => string;
  private readonly generateNotificationId: () => string;

  constructor(dependencies: EmailNotificationAdapterDependencies = {}) {
    this.executionPort = dependencies.execution_port ?? new NotConfiguredEmailNotificationExecutionPort();
    this.now = dependencies.now ?? defaultNow;
    this.generateNotificationId = dependencies.generate_notification_id ?? defaultNotificationId;
  }

  async send(request: EmailNotificationRequest): Promise<EmailNotificationResult> {
    assertServerRuntime();

    const notification_id = this.generateNotificationId();
    const executionRequest: EmailNotificationRequest = {
      ...request,
      metadata: sanitizeMetadata(request.metadata),
    };

    try {
      const executionResult = await this.executionPort.sendEmail({
        notification_id,
        request: executionRequest,
      });

      if (!executionResult.ok) {
        return toFailedResult({
          notification_id,
          request: executionRequest,
          error: executionResult.error ?? {
            code: 'send_failed',
            message: 'Email notification sending failed.',
            retryable: true,
          },
        });
      }

      return {
        notification_id,
        tenant_id: executionRequest.tenant_id,
        notification_type: executionRequest.notification_type,
        channel: 'email',
        status: 'sent',
        sent_at: this.now(),
        provider_message_id: executionResult.provider_message_id,
      };
    } catch (error) {
      return toFailedResult({
        notification_id,
        request: executionRequest,
        error: {
          code: 'provider_unavailable',
          message: error instanceof Error ? error.message : 'Email provider unavailable.',
          retryable: true,
          cause: error,
        },
      });
    }
  }
}

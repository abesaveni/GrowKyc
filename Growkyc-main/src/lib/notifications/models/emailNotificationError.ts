export type EmailNotificationErrorCode =
  | 'not_configured'
  | 'invalid_request'
  | 'provider_unavailable'
  | 'send_failed';

export interface EmailNotificationError {
  code: EmailNotificationErrorCode;
  message: string;
  retryable: boolean;
  cause?: unknown;
}

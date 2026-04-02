import type {
  IEmailNotificationExecutionPort,
  EmailNotificationExecutionInput,
  EmailNotificationExecutionResult,
} from './emailNotificationAdapter';

// AWS SES implementation using the @aws-sdk/client-ses package (dynamically
// imported so that this module does not hard-fail if the SDK is absent).
//
// Graceful degradation: if SES credentials are not configured the send is
// logged and a mock success result is returned so the rest of the system
// continues to function normally during local development.
//
// For production: ensure AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY (or an IAM
// instance-role), SES_REGION, and SES_FROM_EMAIL are set in the environment.

export class SesEmailExecutionPort implements IEmailNotificationExecutionPort {
  private readonly region: string;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor() {
    this.region =
      process.env.SES_REGION ?? process.env.AWS_REGION ?? 'ap-southeast-2';
    this.fromEmail = process.env.SES_FROM_EMAIL ?? '';
    this.fromName = process.env.SES_FROM_NAME ?? 'GrowKYC';
  }

  async sendEmail(
    input: EmailNotificationExecutionInput
  ): Promise<EmailNotificationExecutionResult> {
    // Graceful degradation — if SES is not configured, log but do not fail.
    if (!this.fromEmail || !process.env.AWS_ACCESS_KEY_ID) {
      console.warn('[SES] Email not configured. Would have sent:', {
        to: input.request.recipient_email,
        subject: input.request.subject,
        type: input.request.notification_type,
      });
      return {
        ok: true,
        provider_message_id: `mock-${input.notification_id}`,
      };
    }

    try {
      const { SESClient, SendEmailCommand } = await import('@aws-sdk/client-ses');
      const client = new SESClient({ region: this.region });

      const command = new SendEmailCommand({
        Source: `${this.fromName} <${this.fromEmail}>`,
        Destination: {
          ToAddresses: [input.request.recipient_email],
        },
        Message: {
          Subject: {
            Data: input.request.subject,
            Charset: 'UTF-8',
          },
          Body: {
            // The EmailNotificationRequest uses a single `body` field.
            // Treat it as HTML if it starts with "<", otherwise plain text.
            ...(input.request.body.trimStart().startsWith('<')
              ? {
                  Html: {
                    Data: input.request.body,
                    Charset: 'UTF-8',
                  },
                }
              : {
                  Text: {
                    Data: input.request.body,
                    Charset: 'UTF-8',
                  },
                }),
          },
        },
      });

      const result = await client.send(command);
      return { ok: true, provider_message_id: result.MessageId };
    } catch (err) {
      return {
        ok: false,
        error: {
          code: 'provider_unavailable',
          message:
            err instanceof Error ? err.message : 'SES send failed',
          retryable: true,
        },
      };
    }
  }
}

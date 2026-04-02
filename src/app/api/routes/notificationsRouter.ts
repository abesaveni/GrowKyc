import {
  ApiRouteDefinition,
  ApiRouteRequest,
  ApiRouteResponse,
  ApiRouter,
  createApiRouter,
  jsonResponse,
} from './router';
import { extractTenantContext, AuthError } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { emailNotificationService } from '../../../lib/notifications/index';
import type { NotificationType } from '../../../lib/notifications/models/notificationType';

// ── Helpers ───────────────────────────────────────────────────────────────────

async function withTenantContext<T>(
  request: ApiRouteRequest,
  run: (ctx: Awaited<ReturnType<typeof extractTenantContext>>) => Promise<T>
): Promise<T> {
  const ctx = await extractTenantContext(request.headers);
  return run(ctx);
}

function toErrorResponse(error: unknown): ApiRouteResponse {
  const statusCode =
    typeof (error as { statusCode?: unknown })?.statusCode === 'number'
      ? (error as { statusCode: number }).statusCode
      : error instanceof AuthError
      ? 401
      : 500;
  return jsonResponse(statusCode, {
    error: error instanceof Error ? error.message : 'Internal server error',
  });
}

// ── Route implementations ─────────────────────────────────────────────────────

/**
 * POST /api/notifications/email/send
 * Send a single email notification.
 * Body: { to_address, subject, notification_type, body?, metadata? }
 * Requires audit:write (admin / compliance_manager only).
 */
async function sendEmailHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'audit:write');

      const body = (request.body ?? {}) as {
        to_address?: string;
        subject?: string;
        notification_type?: NotificationType;
        body?: string;
        metadata?: Record<string, unknown>;
      };

      if (!body.to_address || body.to_address.trim() === '') {
        return jsonResponse(400, { error: 'to_address is required' });
      }
      if (!body.subject || body.subject.trim() === '') {
        return jsonResponse(400, { error: 'subject is required' });
      }
      if (!body.notification_type) {
        return jsonResponse(400, { error: 'notification_type is required' });
      }

      const result = await emailNotificationService.send({
        tenant_id: ctx.organizationId,
        notification_type: body.notification_type,
        recipient_email: body.to_address.trim(),
        subject: body.subject.trim(),
        body: body.body ?? '',
        metadata: body.metadata,
      });

      const statusCode = result.status === 'sent' ? 200 : 500;
      return jsonResponse(statusCode, { notification: result });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * POST /api/notifications/email/test
 * Send a test email to the currently authenticated user.
 * Requires audit:write.
 */
async function testEmailHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'audit:write');

      if (!ctx.email) {
        return jsonResponse(400, {
          error: 'No email address associated with the current user',
        });
      }

      const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>GrowKYC Test Email</title></head>
<body style="font-family:Arial,sans-serif;font-size:14px;color:#222;padding:24px">
  <h2 style="color:#0066cc">GrowKYC — Test Email</h2>
  <p>This is a test email sent from the GrowKYC platform.</p>
  <table style="border-collapse:collapse;width:100%;max-width:500px">
    <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold">Sent to</td>
        <td style="padding:6px;border:1px solid #ddd">${ctx.email}</td></tr>
    <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold">User ID</td>
        <td style="padding:6px;border:1px solid #ddd">${ctx.userId}</td></tr>
    <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold">Organisation</td>
        <td style="padding:6px;border:1px solid #ddd">${ctx.organizationId}</td></tr>
    <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold">Sent at</td>
        <td style="padding:6px;border:1px solid #ddd">${new Date().toISOString()}</td></tr>
  </table>
  <p style="color:#888;font-size:12px;margin-top:24px">
    If you did not request this test email please disregard it.
  </p>
</body>
</html>`;

      const result = await emailNotificationService.send({
        tenant_id: ctx.organizationId,
        notification_type: 'review_completed',
        recipient_email: ctx.email,
        subject: '[GrowKYC] Test Email',
        body: html,
        metadata: {
          triggered_by: ctx.userId,
          is_test: true,
        },
      });

      const statusCode = result.status === 'sent' ? 200 : 500;
      return jsonResponse(statusCode, { notification: result });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

// ── Route definitions ─────────────────────────────────────────────────────────

const routes: ApiRouteDefinition[] = [
  {
    method: 'POST',
    path: '/api/notifications/email/send',
    handler: sendEmailHandler,
  },
  {
    method: 'POST',
    path: '/api/notifications/email/test',
    handler: testEmailHandler,
  },
];

export const notificationsRouter: ApiRouter = createApiRouter(routes);
export const notificationsRoutes: ApiRouteDefinition[] = routes;

import type { NotificationChannel } from '../models/notificationChannel';
import type { NotificationType } from '../models/notificationType';
import type {
  NotificationTemplate,
  NotificationTemplateChannelHooks,
  NotificationTemplateContent,
  NotificationTemplateTenantOverrideHooks,
} from '../models/notificationTemplate';
import type { NotificationTemplateVariableMap } from '../models/notificationTemplateVariable';

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Notification template resolver is server-side only.');
  }
}

export interface INotificationTemplateStore {
  resolveTemplate(
    notification_type: NotificationType,
    tenant_id: string
  ): NotificationTemplate | undefined | Promise<NotificationTemplate | undefined>;
}

export interface NotificationTemplateResolverDependencies {
  template_store?: INotificationTemplateStore;
  channel_hooks?: NotificationTemplateChannelHooks;
  tenant_override_hooks?: NotificationTemplateTenantOverrideHooks;
}

export type NotificationTemplateResolveStatus = 'resolved' | 'not_found' | 'resolution_failed';

export interface NotificationTemplateResolveResult {
  status: NotificationTemplateResolveStatus;
  content?: NotificationTemplateContent;
  reason_code?: string;
}

function interpolateVariables(
  text: string,
  variables: NotificationTemplateVariableMap
): string {
  return text.replace(/\{\{(\s*[\w.]+\s*)\}\}/g, (_match, key: string) => {
    const trimmed = key.trim();
    const value = variables[trimmed];

    if (value === undefined || value === null) {
      return '';
    }

    return String(value);
  });
}

function applyVariablesToContent(
  content: NotificationTemplateContent,
  variables?: NotificationTemplateVariableMap
): NotificationTemplateContent {
  if (!variables) {
    return content;
  }

  return {
    subject: interpolateVariables(content.subject, variables),
    body: interpolateVariables(content.body, variables),
  };
}

export class NotificationTemplateResolver {
  private readonly templateStore: INotificationTemplateStore | undefined;
  private readonly channelHooks: NotificationTemplateChannelHooks;
  private readonly tenantOverrideHooks: NotificationTemplateTenantOverrideHooks;

  constructor(dependencies: NotificationTemplateResolverDependencies = {}) {
    this.templateStore = dependencies.template_store;
    this.channelHooks = dependencies.channel_hooks ?? {};
    this.tenantOverrideHooks = dependencies.tenant_override_hooks ?? {};
  }

  async resolve(
    notification_type: NotificationType,
    channel: NotificationChannel,
    tenant_id: string,
    variables?: NotificationTemplateVariableMap
  ): Promise<NotificationTemplateResolveResult> {
    assertServerRuntime();

    let template: NotificationTemplate | undefined;

    if (this.templateStore) {
      try {
        template = await this.templateStore.resolveTemplate(notification_type, tenant_id);
      } catch {
        return {
          status: 'resolution_failed',
          reason_code: 'template_store_error',
        };
      }
    }

    if (!template) {
      return {
        status: 'not_found',
        reason_code: 'template_not_found',
      };
    }

    // Apply tenant override if configured
    let tenantOverrideVariables: NotificationTemplateVariableMap | undefined;

    if (this.tenantOverrideHooks.resolve_tenant_override) {
      try {
        const override = await this.tenantOverrideHooks.resolve_tenant_override({
          template,
          tenant_id,
          channel,
        });

        if (override) {
          if (override.subject !== undefined) {
            template = { ...template, subject: override.subject };
          }

          if (override.body !== undefined) {
            template = { ...template, body: override.body };
          }

          if (override.variables) {
            tenantOverrideVariables = override.variables;
          }
        }
      } catch {
        // Tenant override failures are non-fatal; proceed with base template
      }
    }

    const mergedVariables: NotificationTemplateVariableMap | undefined =
      tenantOverrideVariables || variables
        ? { ...(tenantOverrideVariables ?? {}), ...(variables ?? {}) }
        : undefined;

    // Check for a channel-level hook override
    const channelHook = this.channelHooks[channel];

    if (channelHook) {
      try {
        const hookContent = await channelHook({
          template,
          channel,
          tenant_id,
          variables: mergedVariables,
        });

        return {
          status: 'resolved',
          content: applyVariablesToContent(hookContent, mergedVariables),
        };
      } catch {
        return {
          status: 'resolution_failed',
          reason_code: 'channel_hook_error',
        };
      }
    }

    // Apply channel_overrides from the template model itself
    const channelOverride = template.channel_overrides?.[channel];

    const baseContent: NotificationTemplateContent = {
      subject: channelOverride?.subject ?? template.subject,
      body: channelOverride?.body ?? template.body,
    };

    return {
      status: 'resolved',
      content: applyVariablesToContent(baseContent, mergedVariables),
    };
  }
}

import type { NotificationChannel } from './notificationChannel';
import type { NotificationType } from './notificationType';
import type {
  NotificationTemplateVariable,
  NotificationTemplateVariableMap,
} from './notificationTemplateVariable';

export interface NotificationTemplateContent {
  subject: string;
  body: string;
}

export interface NotificationTemplateChannelOverride {
  subject?: string;
  body?: string;
}

export interface NotificationTemplate {
  template_id: string;
  tenant_id?: string;
  notification_type: NotificationType;
  subject: string;
  body: string;
  variables?: NotificationTemplateVariable[];
  channel_overrides?: Partial<Record<NotificationChannel, NotificationTemplateChannelOverride>>;
  metadata?: Record<string, unknown>;
}

export interface NotificationTemplateChannelHookInput {
  template: NotificationTemplate;
  channel: NotificationChannel;
  tenant_id: string;
  variables?: NotificationTemplateVariableMap;
}

export type NotificationTemplateChannelHook = (
  input: NotificationTemplateChannelHookInput
) => NotificationTemplateContent | Promise<NotificationTemplateContent>;

export interface NotificationTemplateChannelHooks {
  email?: NotificationTemplateChannelHook;
  sms?: NotificationTemplateChannelHook;
  in_app?: NotificationTemplateChannelHook;
}

export interface NotificationTemplateTenantOverride {
  subject?: string;
  body?: string;
  variables?: NotificationTemplateVariableMap;
}

export interface NotificationTemplateTenantOverrideHookInput {
  template: NotificationTemplate;
  tenant_id: string;
  channel: NotificationChannel;
}

export type NotificationTemplateTenantOverrideHook = (
  input: NotificationTemplateTenantOverrideHookInput
) => NotificationTemplateTenantOverride | undefined | Promise<NotificationTemplateTenantOverride | undefined>;

export interface NotificationTemplateTenantOverrideHooks {
  resolve_tenant_override?: NotificationTemplateTenantOverrideHook;
}

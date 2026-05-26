export type { NotificationType } from './models/notificationType';
export type { NotificationChannel } from './models/notificationChannel';
export type { NotificationStatus } from './models/notificationStatus';
export type { EmailNotificationError, EmailNotificationErrorCode } from './models/emailNotificationError';
export type { EmailNotificationRequest } from './models/emailNotificationRequest';
export type { EmailNotificationResult } from './models/emailNotificationResult';
export type {
	NotificationTemplate,
	NotificationTemplateChannelHook,
	NotificationTemplateChannelHookInput,
	NotificationTemplateChannelHooks,
	NotificationTemplateChannelOverride,
	NotificationTemplateContent,
	NotificationTemplateTenantOverride,
	NotificationTemplateTenantOverrideHook,
	NotificationTemplateTenantOverrideHookInput,
	NotificationTemplateTenantOverrideHooks,
} from './models/notificationTemplate';
export type {
	NotificationTemplateVariable,
	NotificationTemplateVariableMap,
	NotificationTemplateVariableValue,
} from './models/notificationTemplateVariable';
export type {
  EmailNotificationAdapterDependencies,
  EmailNotificationExecutionInput,
  EmailNotificationExecutionResult,
  IEmailNotificationAdapter,
  IEmailNotificationExecutionPort,
} from './adapters/email/emailNotificationAdapter';
export {
  EmailNotificationAdapter,
  NotConfiguredEmailNotificationExecutionPort,
} from './adapters/email/emailNotificationAdapter';
export type { NotificationRequest } from './models/notificationRequest';
export type { NotificationResult } from './models/notificationResult';
export type {
  EmitNotificationServiceAuditEventInput,
  INotificationServiceAuditWriter,
  NotificationServiceAuditAction,
  NotificationServiceAuditEvent,
} from './services/notificationServiceAuditHooks';
export {
  emitNotificationSendCompletedAuditEvent,
  emitNotificationSendFailedAuditEvent,
  emitNotificationSendStartedAuditEvent,
  emitNotificationServiceAuditEvent,
  emitNotificationTemplateResolutionFailedAuditEvent,
  emitNotificationTemplateResolvedAuditEvent,
} from './services/notificationServiceAuditHooks';
export type {
  INotificationTemplateStore,
  NotificationTemplateResolverDependencies,
  NotificationTemplateResolveResult,
  NotificationTemplateResolveStatus,
} from './services/notificationTemplateResolver';
export { NotificationTemplateResolver } from './services/notificationTemplateResolver';
export type {
  NotificationChannelDispatcherAdapters,
  NotificationChannelDispatcherDependencies,
  NotificationChannelDispatchResult,
  NotificationChannelDispatchStatus,
} from './services/notificationChannelDispatcher';
export { NotificationChannelDispatcher } from './services/notificationChannelDispatcher';
export type {
  INotificationService,
  NotificationServiceDependencies,
  NotificationServiceSendResult,
  NotificationServiceSendStatus,
} from './services/notificationService';
export {
  NotificationService,
  sendNotification,
} from './services/notificationService';

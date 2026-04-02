export type NotificationTemplateVariableValue = string | number | boolean | null;

export interface NotificationTemplateVariable {
  key: string;
  required: boolean;
  description?: string;
  default_value?: NotificationTemplateVariableValue;
}

export type NotificationTemplateVariableMap = Record<string, NotificationTemplateVariableValue>;

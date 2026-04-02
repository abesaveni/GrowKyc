export type DefectSeverity = 'blocker' | 'high' | 'medium' | 'low';

export type DefectKind =
  | 'cross_tenant_access'
  | 'auth_bypass'
  | 'missing_audit_events_on_key_actions'
  | 'failed_approval_controls'
  | 'evidence_not_stored_correctly'
  | 'provider_failures_crashing_workflow'
  | 'wrong_status_transitions'
  | 'export_permission_gap'
  | 'missing_override_reason_enforcement'
  | 'broken_rescreening_logic'
  | 'broken_expiry_logic'
  | 'bad_summaries'
  | 'incomplete_dashboards'
  | 'notification_template_issues'
  | 'weak_error_messages'
  | 'minor_ui_issues'
  | 'wording'
  | 'non_critical_docs_mismatch';

export interface DefectSeverityRule {
  kind: DefectKind;
  severity: DefectSeverity;
}

export const DEFECT_SEVERITY_RULES: readonly DefectSeverityRule[] = [
  { kind: 'cross_tenant_access', severity: 'blocker' },
  { kind: 'auth_bypass', severity: 'blocker' },
  { kind: 'missing_audit_events_on_key_actions', severity: 'blocker' },
  { kind: 'failed_approval_controls', severity: 'blocker' },
  { kind: 'evidence_not_stored_correctly', severity: 'blocker' },
  { kind: 'provider_failures_crashing_workflow', severity: 'blocker' },
  { kind: 'wrong_status_transitions', severity: 'high' },
  { kind: 'export_permission_gap', severity: 'high' },
  { kind: 'missing_override_reason_enforcement', severity: 'high' },
  { kind: 'broken_rescreening_logic', severity: 'high' },
  { kind: 'broken_expiry_logic', severity: 'high' },
  { kind: 'bad_summaries', severity: 'medium' },
  { kind: 'incomplete_dashboards', severity: 'medium' },
  { kind: 'notification_template_issues', severity: 'medium' },
  { kind: 'weak_error_messages', severity: 'medium' },
  { kind: 'minor_ui_issues', severity: 'low' },
  { kind: 'wording', severity: 'low' },
  { kind: 'non_critical_docs_mismatch', severity: 'low' },
] as const;

const SEVERITY_BY_KIND: Readonly<Record<DefectKind, DefectSeverity>> =
  DEFECT_SEVERITY_RULES.reduce(
    (acc, rule) => {
      acc[rule.kind] = rule.severity;
      return acc;
    },
    {} as Record<DefectKind, DefectSeverity>,
  );

const KIND_ALIASES: Readonly<Record<string, DefectKind>> = {
  'cross-tenant access': 'cross_tenant_access',
  'cross tenant access': 'cross_tenant_access',
  cross_tenant_access: 'cross_tenant_access',
  'auth bypass': 'auth_bypass',
  auth_bypass: 'auth_bypass',
  'missing audit events on key actions': 'missing_audit_events_on_key_actions',
  missing_audit_events_on_key_actions: 'missing_audit_events_on_key_actions',
  'failed approval controls': 'failed_approval_controls',
  failed_approval_controls: 'failed_approval_controls',
  'evidence not stored correctly': 'evidence_not_stored_correctly',
  evidence_not_stored_correctly: 'evidence_not_stored_correctly',
  'provider failures crashing workflow': 'provider_failures_crashing_workflow',
  provider_failures_crashing_workflow: 'provider_failures_crashing_workflow',
  'wrong status transitions': 'wrong_status_transitions',
  wrong_status_transitions: 'wrong_status_transitions',
  'export permission gap': 'export_permission_gap',
  export_permission_gap: 'export_permission_gap',
  'missing override reason enforcement': 'missing_override_reason_enforcement',
  missing_override_reason_enforcement: 'missing_override_reason_enforcement',
  'broken rescreening logic': 'broken_rescreening_logic',
  broken_rescreening_logic: 'broken_rescreening_logic',
  'broken expiry logic': 'broken_expiry_logic',
  broken_expiry_logic: 'broken_expiry_logic',
  'bad summaries': 'bad_summaries',
  bad_summaries: 'bad_summaries',
  'incomplete dashboards': 'incomplete_dashboards',
  incomplete_dashboards: 'incomplete_dashboards',
  'notification template issues': 'notification_template_issues',
  notification_template_issues: 'notification_template_issues',
  'weak error messages': 'weak_error_messages',
  weak_error_messages: 'weak_error_messages',
  'minor ui issues': 'minor_ui_issues',
  minor_ui_issues: 'minor_ui_issues',
  wording: 'wording',
  'non-critical docs mismatch': 'non_critical_docs_mismatch',
  'non critical docs mismatch': 'non_critical_docs_mismatch',
  non_critical_docs_mismatch: 'non_critical_docs_mismatch',
};

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function toDefectKind(value: string): DefectKind | undefined {
  const normalized = normalizeLabel(value);
  const aliased = KIND_ALIASES[normalized];
  if (aliased) {
    return aliased;
  }

  const underscored = normalized.replace(/[- ]/g, '_') as DefectKind;
  if (underscored in SEVERITY_BY_KIND) {
    return underscored;
  }

  return undefined;
}

export function getDefectSeverity(kindOrLabel: DefectKind | string): DefectSeverity | undefined {
  const kind = typeof kindOrLabel === 'string' ? toDefectKind(kindOrLabel) : kindOrLabel;
  if (!kind) {
    return undefined;
  }

  return SEVERITY_BY_KIND[kind];
}

export function groupDefectKindsBySeverity(): Readonly<Record<DefectSeverity, readonly DefectKind[]>> {
  return {
    blocker: DEFECT_SEVERITY_RULES.filter((rule) => rule.severity === 'blocker').map((rule) => rule.kind),
    high: DEFECT_SEVERITY_RULES.filter((rule) => rule.severity === 'high').map((rule) => rule.kind),
    medium: DEFECT_SEVERITY_RULES.filter((rule) => rule.severity === 'medium').map((rule) => rule.kind),
    low: DEFECT_SEVERITY_RULES.filter((rule) => rule.severity === 'low').map((rule) => rule.kind),
  };
}

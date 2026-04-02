export type UserRole =
  | 'preparer'
  | 'reviewer'
  | 'approver'
  | 'compliance_manager'
  | 'admin'
  | 'read_only_auditor';

export type Permission =
  | 'bots:run'
  | 'bots:run_all'
  | 'cases:read'
  | 'cases:write'
  | 'cases:status_update'
  | 'cases:legal_hold'
  | 'findings:read'
  | 'alerts:read'
  | 'alerts:resolve'
  | 'audit:read'
  | 'audit:write'
  | 'reviews:manage'
  | 'evidence_packs:read';
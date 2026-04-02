import { Permission, UserRole } from '../../../../lib/security/rbacTypes';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  preparer: [
    'bots:run',
    'cases:read',
    'cases:write',
    'findings:read',
    'alerts:read',
    'audit:read',
    'evidence_packs:read',
  ],
  reviewer: [
    'bots:run',
    'bots:run_all',
    'cases:read',
    'cases:write',
    'findings:read',
    'alerts:read',
    'audit:read',
    'reviews:manage',
    'evidence_packs:read',
  ],
  approver: [
    'cases:read',
    'cases:status_update',
    'cases:legal_hold',
    'findings:read',
    'alerts:read',
    'alerts:resolve',
    'audit:read',
    'evidence_packs:read',
  ],
  compliance_manager: [
    'bots:run',
    'bots:run_all',
    'cases:read',
    'cases:write',
    'cases:status_update',
    'cases:legal_hold',
    'findings:read',
    'alerts:read',
    'alerts:resolve',
    'audit:read',
    'audit:write',
    'reviews:manage',
    'evidence_packs:read',
  ],
  admin: [
    'bots:run',
    'bots:run_all',
    'cases:read',
    'cases:write',
    'cases:status_update',
    'cases:legal_hold',
    'findings:read',
    'alerts:read',
    'alerts:resolve',
    'audit:read',
    'audit:write',
    'reviews:manage',
    'evidence_packs:read',
  ],
  read_only_auditor: [
    'cases:read',
    'findings:read',
    'alerts:read',
    'audit:read',
    'evidence_packs:read',
  ],
};

function normalizeRoleValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_');
}

const LEGACY_ROLE_ALIASES: Record<string, UserRole> = {
  preparer: 'preparer',
  reviewer: 'reviewer',
  approver: 'approver',
  compliance_manager: 'compliance_manager',
  compliancemanager: 'compliance_manager',
  admin: 'admin',
  read_only_auditor: 'read_only_auditor',
  readonly_auditor: 'read_only_auditor',
  org_admin: 'admin',
  compliance_officer: 'compliance_manager',
  analyst: 'preparer',
  auditor: 'read_only_auditor',
  api_client: 'admin',
};

export function resolveRoleFromIdentity(input: {
  explicitRole?: string;
  groups?: string[];
  fallback?: UserRole;
}): UserRole {
  const fallback = input.fallback ?? 'preparer';

  if (input.explicitRole) {
    const normalized = normalizeRoleValue(input.explicitRole);
    const mapped = LEGACY_ROLE_ALIASES[normalized];
    if (mapped) {
      return mapped;
    }
  }

  for (const group of input.groups ?? []) {
    const normalized = normalizeRoleValue(group);
    const mapped = LEGACY_ROLE_ALIASES[normalized];
    if (mapped) {
      return mapped;
    }
  }

  return fallback;
}
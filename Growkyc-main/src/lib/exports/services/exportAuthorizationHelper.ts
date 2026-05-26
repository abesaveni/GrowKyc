import type {
  ExportAuthorizationActor,
  ExportAuthorizationInput,
  ExportAuthorizationResult,
} from '../models/exportAuthorizationResult';
import type { ExportTargetType } from '../models/exportTargetType';

const ROLE_TARGET_ACCESS: Record<string, ExportTargetType[]> = {
  admin: ['audit_pack', 'report', 'evidence_bundle'],
  compliance_admin: ['audit_pack', 'report', 'evidence_bundle'],
  compliance_manager: ['audit_pack', 'report', 'evidence_bundle'],
  reviewer: ['report'],
  analyst: ['report'],
};

const normalize = (value: string): string => {
  return value.trim().toLowerCase();
};

const defaultTenantAccessCheck = (actor: ExportAuthorizationActor, tenant_id: string): boolean => {
  return actor.tenant_id === tenant_id;
};

const defaultRoleAccessCheck = (role: string, targetType: ExportTargetType): boolean => {
  const allowedTargets = ROLE_TARGET_ACCESS[normalize(role)];

  if (!allowedTargets) {
    return false;
  }

  return allowedTargets.includes(targetType);
};

const hasExportPermission = (permissions: string[] | undefined): boolean => {
  if (!permissions || permissions.length === 0) {
    return false;
  }

  return permissions.includes('*') || permissions.includes('exports:write') || permissions.includes('export:write');
};

export const validateExportPermissions = (input: ExportAuthorizationInput): ExportAuthorizationResult => {
  if (!input.actor) {
    return {
      allowed: false,
      reason_code: 'missing_actor',
      reason_detail: 'Export request cannot be authorized without an actor context.',
    };
  }

  const tenantAccessCheck = input.has_tenant_access ?? defaultTenantAccessCheck;

  if (!tenantAccessCheck(input.actor, input.request.tenant_id)) {
    return {
      allowed: false,
      reason_code: 'tenant_mismatch',
      reason_detail: 'Actor does not have access to the requested tenant scope.',
    };
  }

  const roleAccessCheck = input.can_export_target_by_role ?? defaultRoleAccessCheck;

  if (!roleAccessCheck(input.actor.role, input.request.target_type)) {
    return {
      allowed: false,
      reason_code: 'insufficient_role',
      reason_detail: 'Actor role is not permitted to export this target type.',
    };
  }

  if (!hasExportPermission(input.actor.permissions)) {
    return {
      allowed: false,
      reason_code: 'insufficient_permission',
      reason_detail: 'Actor is missing required export permission.',
    };
  }

  return {
    allowed: true,
    reason_code: 'authorized',
    reason_detail: 'Export authorization checks passed.',
  };
};

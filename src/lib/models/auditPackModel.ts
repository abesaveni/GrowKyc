/**
 * Server-side audit pack domain model.
 */

/**
 * Export lifecycle status for audit packs.
 */
export type AuditPackExportStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled';

/**
 * Canonical export status values for runtime guards.
 */
export const AUDIT_PACK_EXPORT_STATUSES: readonly AuditPackExportStatus[] = [
  'pending',
  'in_progress',
  'completed',
  'failed',
  'cancelled',
] as const;

/**
 * Supported section types for audit pack composition.
 */
export type AuditPackSectionType =
  | 'client_profile'
  | 'documents'
  | 'screenings'
  | 'risk_rationale'
  | 'approval_chain'
  | 'audit_history'
  | 'review_notes'
  | 'compliance_status';

/**
 * Canonical section types for runtime guards.
 */
export const AUDIT_PACK_SECTION_TYPES: readonly AuditPackSectionType[] = [
  'client_profile',
  'documents',
  'screenings',
  'risk_rationale',
  'approval_chain',
  'audit_history',
  'review_notes',
  'compliance_status',
] as const;

/**
 * Evidence references included in audit pack sections.
 */
export interface AuditPackEvidenceReferenceModel {
  evidenceId: string;
  evidenceType: string;
  source: string;
  uri?: string;
  hash?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Typed section model for audit pack content.
 */
export interface AuditPackSectionModel {
  sectionType: AuditPackSectionType;
  title: string;
  summary?: string;
  payload?: Record<string, unknown>;
  evidenceReferences?: AuditPackEvidenceReferenceModel[];
}

/**
 * Tenant/case linkage metadata for an audit pack.
 */
export interface AuditPackLinkage {
  tenant_id: string;
  case_id: string;
}

/**
 * Canonical audit pack model.
 */
export interface AuditPackModel {
  id: string;
  exportStatus: AuditPackExportStatus;
  linkage: AuditPackLinkage;
  sections: AuditPackSectionModel[];
  generated_at: string;
  generated_by: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}
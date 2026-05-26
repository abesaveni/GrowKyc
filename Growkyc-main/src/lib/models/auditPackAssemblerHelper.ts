import {
  AUDIT_PACK_SECTION_TYPES,
  type AuditPackEvidenceReferenceModel,
  type AuditPackExportStatus,
  type AuditPackModel,
  type AuditPackSectionModel,
  type AuditPackSectionType,
} from './auditPackModel';

/**
 * Persisted section source payload used during audit pack assembly.
 */
export interface AuditPackPersistedSectionSource {
  title?: string;
  summary?: string;
  payload?: Record<string, unknown>;
  evidenceReferences?: AuditPackEvidenceReferenceModel[];
}

/**
 * Typed persisted data source map used by the assembler.
 */
export type AuditPackPersistedDataSources = Partial<
  Record<AuditPackSectionType, AuditPackPersistedSectionSource>
>;

/**
 * Section-level evidence linkage output.
 */
export interface AuditPackSectionEvidenceLinkage {
  sectionType: AuditPackSectionType;
  evidenceReferences: AuditPackEvidenceReferenceModel[];
}

/**
 * Typed assembler input.
 */
export interface AssembleAuditPackInput {
  id: string;
  tenantId: string;
  caseId: string;
  generatedBy: string;
  generatedAt?: string | Date;
  exportStatus?: AuditPackExportStatus;
  includeMissingSections?: boolean;
  dataSources: AuditPackPersistedDataSources;
  metadata?: Record<string, unknown>;
}

/**
 * Typed assembler result.
 */
export interface AssembleAuditPackResult {
  auditPack: AuditPackModel;
  sectionOrder: AuditPackSectionType[];
  includedSections: AuditPackSectionType[];
  missingSections: AuditPackSectionType[];
  evidenceLinkage: AuditPackSectionEvidenceLinkage[];
}

/**
 * Centralized helper to assemble audit pack sections from persisted data sources.
 */
export function assembleAuditPackFromPersistedSources(
  input: AssembleAuditPackInput,
): AssembleAuditPackResult {
  const generatedAt = normalizeDate(input.generatedAt ?? new Date(), 'generatedAt').toISOString();
  const includeMissingSections = input.includeMissingSections ?? true;

  const assembledSections: AuditPackSectionModel[] = [];
  const includedSections: AuditPackSectionType[] = [];
  const missingSections: AuditPackSectionType[] = [];

  for (const sectionType of AUDIT_PACK_SECTION_TYPES) {
    const source = input.dataSources[sectionType];

    if (!source) {
      missingSections.push(sectionType);

      if (includeMissingSections) {
        assembledSections.push(createMissingSection(sectionType));
      }

      continue;
    }

    assembledSections.push(buildSectionFromSource(sectionType, source));
    includedSections.push(sectionType);
  }

  const orderedSections = orderAuditPackSections(assembledSections);
  const evidenceLinkage = buildEvidenceLinkage(orderedSections);

  return {
    auditPack: {
      id: input.id,
      exportStatus: input.exportStatus ?? 'completed',
      linkage: {
        tenant_id: input.tenantId,
        case_id: input.caseId,
      },
      sections: orderedSections,
      generated_at: generatedAt,
      generated_by: input.generatedBy,
      createdAt: generatedAt,
      updatedAt: generatedAt,
      metadata: input.metadata,
    },
    sectionOrder: AUDIT_PACK_SECTION_TYPES.slice(),
    includedSections,
    missingSections,
    evidenceLinkage,
  };
}

/**
 * Deterministic helper for ordering sections by canonical type order.
 */
export function orderAuditPackSections(
  sections: readonly AuditPackSectionModel[],
): AuditPackSectionModel[] {
  const weightBySectionType = new Map<AuditPackSectionType, number>(
    AUDIT_PACK_SECTION_TYPES.map((sectionType, index) => [sectionType, index]),
  );

  return [...sections].sort((left, right) => {
    const leftWeight = weightBySectionType.get(left.sectionType) ?? Number.MAX_SAFE_INTEGER;
    const rightWeight = weightBySectionType.get(right.sectionType) ?? Number.MAX_SAFE_INTEGER;

    return leftWeight - rightWeight;
  });
}

function buildSectionFromSource(
  sectionType: AuditPackSectionType,
  source: AuditPackPersistedSectionSource,
): AuditPackSectionModel {
  const evidenceReferences = source.evidenceReferences?.length
    ? source.evidenceReferences.map((reference) => ({ ...reference }))
    : undefined;

  return {
    sectionType,
    title: source.title ?? toDefaultSectionTitle(sectionType),
    summary: source.summary,
    payload: source.payload ? { ...source.payload } : undefined,
    evidenceReferences,
  };
}

function createMissingSection(sectionType: AuditPackSectionType): AuditPackSectionModel {
  return {
    sectionType,
    title: toDefaultSectionTitle(sectionType),
    summary: 'No persisted data available for this section at assembly time.',
    payload: {
      missing: true,
    },
    evidenceReferences: [],
  };
}

function buildEvidenceLinkage(
  sections: readonly AuditPackSectionModel[],
): AuditPackSectionEvidenceLinkage[] {
  const linkage: AuditPackSectionEvidenceLinkage[] = [];

  for (const section of sections) {
    if (!section.evidenceReferences?.length) {
      continue;
    }

    linkage.push({
      sectionType: section.sectionType,
      evidenceReferences: section.evidenceReferences.map((reference) => ({
        ...reference,
      })),
    });
  }

  return linkage;
}

function toDefaultSectionTitle(sectionType: AuditPackSectionType): string {
  return sectionType
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}
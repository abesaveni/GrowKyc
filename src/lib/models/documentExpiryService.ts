import type { DocumentExpiryModel, DocumentExpiryStatus } from './documentExpiryModel';
import {
  evaluateDocumentExpiryStatus,
  type DocumentExpiryEvaluationResult,
  type DocumentExpiryEvaluationInput,
} from './documentExpiryEvaluationHelper';
import {
  evaluateCaseExpiryImpact,
  type CaseExpiryImpactResult,
  type CaseDocumentExpiryState,
} from './caseExpiryImpactHelper';
import {
  findDocumentsInUpcomingExpiryWindow,
  type UpcomingExpiryWindowQuery,
  type UpcomingExpiryWindowResult,
} from './upcomingExpiryWindowHelper';
import {
  createDocumentExpiryRecord,
  updateDocumentExpiryDate,
  updateDocumentReplacementMetadata,
  updateDocumentExpiryStatus,
  type CreateDocumentExpiryRecordInput,
  type DocumentExpiryPersistencePort,
  type DocumentExpiryPersistenceRecord,
  type UpdateDocumentExpiryDateInput,
} from './documentExpiryPersistenceHelper';
import {
  DocumentExpiryAuditHooks,
  type DocumentExpiryAuditContext,
} from './documentExpiryAuditHooks';
import type { PeriodicReviewAuditWriter } from './periodicReviewAuditHooks';

export interface DocumentExpiryServiceDependencies {
  persistence: DocumentExpiryPersistencePort;
  auditWriter: PeriodicReviewAuditWriter;
}

export interface CreateDocumentExpiryServiceInput {
  documentId: string;
  tenantId: string;
  caseId?: string;
  expiryDate?: string | Date;
  hasNoExpiry?: boolean;
  expiringSoonWindowDays?: number;
  createdAt?: string | Date;
}

export interface UpdateDocumentExpiryServiceInput {
  documentId: string;
  tenantId: string;
  caseId?: string;
  expiryDate?: string | Date;
  hasNoExpiry?: boolean;
  expiringSoonWindowDays?: number;
  updatedAt?: string | Date;
}

export interface ReplaceDocumentExpiryServiceInput {
  documentId: string;
  tenantId: string;
  caseId?: string;
  replacedBy: string;
  replacedAt?: string | Date;
  updatedAt?: string | Date;
}

export interface EvaluateDocumentExpiryServiceInput extends DocumentExpiryEvaluationInput {
  documentId: string;
  tenantId: string;
  caseId?: string;
}

export interface EvaluateDocumentExpiryServiceResult {
  document: DocumentExpiryModel;
  evaluation: DocumentExpiryEvaluationResult;
}

export interface EvaluateCaseDocumentExpiryImpactInput {
  caseId: string;
  documents: Array<{
    document: DocumentExpiryModel;
    requiredForCase?: boolean;
  }>;
  blockOnRequiredExpiredOnly?: boolean;
}

/**
 * Centralized server-side service wiring document expiry model, helpers, persistence, and audit hooks.
 */
export class DocumentExpiryService {
  private readonly persistence: DocumentExpiryPersistencePort;
  private readonly auditHooks: DocumentExpiryAuditHooks;

  constructor(dependencies: DocumentExpiryServiceDependencies) {
    this.persistence = dependencies.persistence;
    this.auditHooks = new DocumentExpiryAuditHooks(dependencies.auditWriter);
  }

  async createDocumentExpiry(
    input: CreateDocumentExpiryServiceInput,
  ): Promise<DocumentExpiryModel> {
    const createdAt = input.createdAt ?? new Date();
    const evaluation = evaluateDocumentExpiryStatus({
      evaluatedAt: createdAt,
      expiryDate: input.expiryDate,
      hasNoExpiry: input.hasNoExpiry,
      expiringSoonWindowDays: input.expiringSoonWindowDays,
    });

    const persisted = await createDocumentExpiryRecord(
      {
        documentId: input.documentId,
        tenantId: input.tenantId,
        caseId: input.caseId,
        expiryStatus: evaluation.status,
        expiryDate: evaluation.expiryDate,
        createdAt,
        updatedAt: createdAt,
      },
      this.persistence,
    );

    await this.auditHooks.onDocumentExpirySet(
      this.buildAuditContext(persisted),
      {
        expiryStatus: persisted.expiry_status,
        expiryDate: persisted.expiry_date,
        hasNoExpiry: input.hasNoExpiry ?? false,
      },
    );

    await this.auditByEvaluation(persisted, evaluation);

    return mapPersistenceRecordToModel(persisted, input.hasNoExpiry ?? false);
  }

  async updateDocumentExpiry(
    input: UpdateDocumentExpiryServiceInput,
  ): Promise<DocumentExpiryModel> {
    const updatedAt = input.updatedAt ?? new Date();
    const evaluation = evaluateDocumentExpiryStatus({
      evaluatedAt: updatedAt,
      expiryDate: input.expiryDate,
      hasNoExpiry: input.hasNoExpiry,
      expiringSoonWindowDays: input.expiringSoonWindowDays,
    });

    const persisted = await updateDocumentExpiryDate(
      {
        documentId: input.documentId,
        tenantId: input.tenantId,
        caseId: input.caseId,
        expiryDate: evaluation.expiryDate,
        expiryStatus: evaluation.status,
        updatedAt,
      },
      this.persistence,
    );

    await this.auditHooks.onDocumentExpiryUpdated(
      this.buildAuditContext(persisted, updatedAt),
      {
        expiryStatus: persisted.expiry_status,
        expiryDate: persisted.expiry_date,
        hasNoExpiry: input.hasNoExpiry ?? false,
      },
    );

    await this.auditByEvaluation(persisted, evaluation);

    return mapPersistenceRecordToModel(persisted, input.hasNoExpiry ?? false);
  }

  async replaceDocument(
    input: ReplaceDocumentExpiryServiceInput,
  ): Promise<DocumentExpiryModel> {
    const replacedAt = input.replacedAt ?? new Date();

    const replacementUpdated = await updateDocumentReplacementMetadata(
      {
        documentId: input.documentId,
        tenantId: input.tenantId,
        caseId: input.caseId,
        replacedAt,
        replacedBy: input.replacedBy,
        expiryStatus: 'replaced',
        updatedAt: input.updatedAt ?? replacedAt,
      },
      this.persistence,
    );

    const persisted = await updateDocumentExpiryStatus(
      {
        documentId: input.documentId,
        tenantId: input.tenantId,
        caseId: input.caseId,
        expiryStatus: 'replaced',
        updatedAt: input.updatedAt ?? replacedAt,
      },
      this.persistence,
    );

    await this.auditHooks.onDocumentReplaced(
      this.buildAuditContext(replacementUpdated, replacedAt),
      {
        replacedBy: input.replacedBy,
        replacedAt: normalizeDate(replacedAt, 'replacedAt').toISOString(),
      },
    );

    return mapPersistenceRecordToModel(persisted, false);
  }

  evaluateDocumentExpiry(
    input: EvaluateDocumentExpiryServiceInput,
  ): EvaluateDocumentExpiryServiceResult {
    const evaluation = evaluateDocumentExpiryStatus({
      evaluatedAt: input.evaluatedAt,
      expiryDate: input.expiryDate,
      hasNoExpiry: input.hasNoExpiry,
      replacedAt: input.replacedAt,
      replacedBy: input.replacedBy,
      expiringSoonWindowDays: input.expiringSoonWindowDays,
    });

    const model: DocumentExpiryModel = {
      id: input.documentId,
      organizationId: input.tenantId,
      caseId: input.caseId,
      status: evaluation.status,
      expiryDate: evaluation.expiryDate,
      hasNoExpiry: evaluation.hasNoExpiry,
      replacedAt: evaluation.replacedAt,
      replacedBy: evaluation.replacedBy,
      createdAt: evaluation.evaluatedAt,
      updatedAt: evaluation.evaluatedAt,
    };

    return {
      document: model,
      evaluation,
    };
  }

  evaluateCaseImpact(input: EvaluateCaseDocumentExpiryImpactInput): CaseExpiryImpactResult {
    const states: CaseDocumentExpiryState[] = input.documents.map((entry) => ({
      documentId: entry.document.id,
      status: entry.document.status,
      requiredForCase: entry.requiredForCase,
    }));

    return evaluateCaseExpiryImpact({
      caseId: input.caseId,
      documents: states,
      blockOnRequiredExpiredOnly: input.blockOnRequiredExpiredOnly,
    });
  }

  findUpcomingExpiries(query: UpcomingExpiryWindowQuery): UpcomingExpiryWindowResult {
    return findDocumentsInUpcomingExpiryWindow(query);
  }

  private async auditByEvaluation(
    persisted: DocumentExpiryPersistenceRecord,
    evaluation: DocumentExpiryEvaluationResult,
  ): Promise<void> {
    if (evaluation.status === 'expired') {
      await this.auditHooks.onDocumentExpired(this.buildAuditContext(persisted, evaluation.evaluatedAt), {
        expiryDate: persisted.expiry_date,
      });
      return;
    }

    if (evaluation.status === 'expiring_soon') {
      await this.auditHooks.onDocumentExpiringSoon(
        this.buildAuditContext(persisted, evaluation.evaluatedAt),
        {
          expiryDate: persisted.expiry_date,
          daysUntilExpiry: evaluation.daysUntilExpiry,
        },
      );
    }
  }

  private buildAuditContext(
    persisted: DocumentExpiryPersistenceRecord,
    occurredAt?: string | Date,
  ): DocumentExpiryAuditContext {
    return {
      tenantId: persisted.tenant_id,
      caseId: persisted.case_id,
      documentId: persisted.document_id,
      occurredAt,
    };
  }
}

let documentExpiryServiceInstance: DocumentExpiryService | null = null;

export function getDocumentExpiryService(
  dependencies: DocumentExpiryServiceDependencies,
): DocumentExpiryService {
  if (!documentExpiryServiceInstance) {
    documentExpiryServiceInstance = new DocumentExpiryService(dependencies);
  }

  return documentExpiryServiceInstance;
}

function mapPersistenceRecordToModel(
  record: DocumentExpiryPersistenceRecord,
  hasNoExpiry: boolean,
): DocumentExpiryModel {
  return {
    id: record.document_id,
    organizationId: record.tenant_id,
    caseId: record.case_id,
    status: (record.expiry_status ?? inferStatusFromRecord(record, hasNoExpiry)) as DocumentExpiryStatus,
    expiryDate: record.expiry_date,
    hasNoExpiry,
    replacedAt: record.replaced_at,
    replacedBy: record.replaced_by,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function inferStatusFromRecord(
  record: DocumentExpiryPersistenceRecord,
  hasNoExpiry: boolean,
): DocumentExpiryStatus {
  if (record.replaced_at || record.replaced_by) {
    return 'replaced';
  }

  if (hasNoExpiry) {
    return 'no_expiry';
  }

  if (!record.expiry_date) {
    return 'active';
  }

  const now = new Date();
  const expiryDate = new Date(record.expiry_date);
  if (Number.isNaN(expiryDate.getTime())) {
    return 'active';
  }

  return expiryDate.getTime() < now.getTime() ? 'expired' : 'active';
}

function normalizeDate(value: string | Date, fieldName: string): Date {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} must be a valid date`);
  }

  return date;
}

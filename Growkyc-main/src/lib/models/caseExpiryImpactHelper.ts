import { DocumentExpiryStatus } from './documentExpiryModel';

export type CaseExpiryImpactOutcome = 'blocking' | 'warning' | 'informational';

export type CaseExpiryImpactReasonCode =
  | 'documents_expired'
  | 'documents_expiring_soon'
  | 'all_documents_active'
  | 'documents_no_expiry'
  | 'documents_replaced'
  | 'no_documents';

export interface CaseDocumentExpiryState {
  documentId: string;
  status: DocumentExpiryStatus;
  requiredForCase?: boolean;
}

export interface EvaluateCaseExpiryImpactInput {
  caseId: string;
  documents: CaseDocumentExpiryState[];
  blockOnRequiredExpiredOnly?: boolean;
}

export interface CaseExpiryImpactResult {
  caseId: string;
  outcome: CaseExpiryImpactOutcome;
  reasonCodes: CaseExpiryImpactReasonCode[];
  hasBlockingImpact: boolean;
  hasWarningImpact: boolean;
  hasInformationalImpact: boolean;
  expiredDocumentIds: string[];
  expiringSoonDocumentIds: string[];
  replacedDocumentIds: string[];
}

/**
 * Evaluates how document expiry states impact case progression.
 */
export function evaluateCaseExpiryImpact(
  input: EvaluateCaseExpiryImpactInput,
): CaseExpiryImpactResult {
  const documents = input.documents ?? [];

  if (documents.length === 0) {
    return {
      caseId: input.caseId,
      outcome: 'informational',
      reasonCodes: ['no_documents'],
      hasBlockingImpact: false,
      hasWarningImpact: false,
      hasInformationalImpact: true,
      expiredDocumentIds: [],
      expiringSoonDocumentIds: [],
      replacedDocumentIds: [],
    };
  }

  const blockOnRequiredExpiredOnly = input.blockOnRequiredExpiredOnly ?? true;

  const expiredDocuments = documents.filter((document) => document.status === 'expired');
  const expiringSoonDocuments = documents.filter(
    (document) => document.status === 'expiring_soon',
  );
  const replacedDocuments = documents.filter((document) => document.status === 'replaced');
  const noExpiryCount = documents.filter((document) => document.status === 'no_expiry').length;

  const blockingExpiredDocuments = blockOnRequiredExpiredOnly
    ? expiredDocuments.filter((document) => document.requiredForCase)
    : expiredDocuments;

  const reasonCodes = new Set<CaseExpiryImpactReasonCode>();

  if (blockingExpiredDocuments.length > 0) {
    reasonCodes.add('documents_expired');

    return {
      caseId: input.caseId,
      outcome: 'blocking',
      reasonCodes: Array.from(reasonCodes),
      hasBlockingImpact: true,
      hasWarningImpact: false,
      hasInformationalImpact: false,
      expiredDocumentIds: blockingExpiredDocuments.map((document) => document.documentId),
      expiringSoonDocumentIds: expiringSoonDocuments.map((document) => document.documentId),
      replacedDocumentIds: replacedDocuments.map((document) => document.documentId),
    };
  }

  if (expiringSoonDocuments.length > 0) {
    reasonCodes.add('documents_expiring_soon');

    return {
      caseId: input.caseId,
      outcome: 'warning',
      reasonCodes: Array.from(reasonCodes),
      hasBlockingImpact: false,
      hasWarningImpact: true,
      hasInformationalImpact: false,
      expiredDocumentIds: expiredDocuments.map((document) => document.documentId),
      expiringSoonDocumentIds: expiringSoonDocuments.map((document) => document.documentId),
      replacedDocumentIds: replacedDocuments.map((document) => document.documentId),
    };
  }

  if (noExpiryCount === documents.length) {
    reasonCodes.add('documents_no_expiry');
  } else if (replacedDocuments.length > 0) {
    reasonCodes.add('documents_replaced');
  } else {
    reasonCodes.add('all_documents_active');
  }

  return {
    caseId: input.caseId,
    outcome: 'informational',
    reasonCodes: Array.from(reasonCodes),
    hasBlockingImpact: false,
    hasWarningImpact: false,
    hasInformationalImpact: true,
    expiredDocumentIds: expiredDocuments.map((document) => document.documentId),
    expiringSoonDocumentIds: expiringSoonDocuments.map((document) => document.documentId),
    replacedDocumentIds: replacedDocuments.map((document) => document.documentId),
  };
}

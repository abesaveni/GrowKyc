import type { PortalMissingItem } from '../models/portalMissingItem';
import type {
  PortalUploadPrompt,
  PortalUploadPromptDocumentType,
  PortalUploadPromptInput,
  PortalUploadPromptUrgency,
} from '../models/portalUploadPrompt';

const normalize = (value?: string): string => {
  return (value ?? '').trim().toLowerCase();
};

const DOCUMENT_PROMPT_TEXT: Record<PortalUploadPromptDocumentType, string> = {
  identity_document: 'Please upload a valid government-issued photo ID (for example: passport or driver licence).',
  proof_of_address: 'Please upload a recent proof of address document (for example: utility bill or bank statement).',
  company_document: 'Please upload the requested company registration documents (for example: ASIC extract or incorporation certificate).',
  ownership_document: 'Please upload ownership or beneficial ownership evidence (for example: shareholder register or trust schedule).',
  engagement_document: 'Please upload the signed engagement document so we can continue your onboarding review.',
  financial_document: 'Please upload the requested financial document (for example: statement, tax summary, or financial report).',
  supporting_document: 'Please upload the requested supporting document to complete this onboarding step.',
};

export const inferDocumentTypeFromMissingItem = (
  item: PortalMissingItem,
): PortalUploadPromptDocumentType => {
  const text = `${item.label} ${item.reason ?? ''}`.toLowerCase();

  if (/(passport|driver|licen[cs]e|identity|id\b|medicare)/.test(text)) {
    return 'identity_document';
  }

  if (/(address|utility|rates|bank statement|proof of address)/.test(text)) {
    return 'proof_of_address';
  }

  if (/(asic|abn|acn|incorporation|company)/.test(text)) {
    return 'company_document';
  }

  if (/(owner|ownership|shareholder|ubo|beneficial)/.test(text)) {
    return 'ownership_document';
  }

  if (/(engagement|agreement|consent|declaration)/.test(text)) {
    return 'engagement_document';
  }

  if (/(financial|tax|income|statement|invoice|payslip)/.test(text)) {
    return 'financial_document';
  }

  return 'supporting_document';
};

export const getUploadPromptUrgency = (
  item: PortalMissingItem,
  blocks_progress: boolean,
): PortalUploadPromptUrgency => {
  if (!blocks_progress) {
    return 'normal';
  }

  const itemStatus = normalize(item.status);

  if (itemStatus === 'changes_requested') {
    return 'critical';
  }

  return 'high';
};

export const buildUploadPromptFromMissingItem = (
  item: PortalMissingItem,
  options?: {
    blocks_progress?: boolean;
    resolve_document_type?: (item: PortalMissingItem) => PortalUploadPromptDocumentType;
  },
): PortalUploadPrompt => {
  const document_type = options?.resolve_document_type?.(item) ?? inferDocumentTypeFromMissingItem(item);
  const blocks_progress = options?.blocks_progress ?? false;
  const urgency = getUploadPromptUrgency(item, blocks_progress);
  const prompt_text = DOCUMENT_PROMPT_TEXT[document_type];

  return {
    item_id: item.item_id,
    tenant_id: item.tenant_id,
    case_id: item.case_id,
    step_id: item.step_id,
    document_type,
    urgency,
    blocks_progress,
    title: item.label,
    prompt_text,
  };
};

export const generateUploadPromptsFromMissingItems = (
  input: PortalUploadPromptInput,
): PortalUploadPrompt[] => {
  const blockedStepIds = new Set(input.blocked_step_ids ?? []);

  return input.missing_items.map((item) => {
    const blocks_progress = item.step_id ? blockedStepIds.has(item.step_id) : false;

    return buildUploadPromptFromMissingItem(item, {
      blocks_progress,
      resolve_document_type: input.resolve_document_type,
    });
  });
};

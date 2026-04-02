import type { PortalMissingItem } from './portalMissingItem';

export type PortalUploadPromptDocumentType =
  | 'identity_document'
  | 'proof_of_address'
  | 'company_document'
  | 'ownership_document'
  | 'engagement_document'
  | 'financial_document'
  | 'supporting_document';

export type PortalUploadPromptUrgency = 'normal' | 'high' | 'critical';

export interface PortalUploadPrompt {
  item_id: string;
  tenant_id: string;
  case_id?: string;
  step_id?: string;
  document_type: PortalUploadPromptDocumentType;
  urgency: PortalUploadPromptUrgency;
  blocks_progress: boolean;
  title: string;
  prompt_text: string;
}

export interface PortalUploadPromptInput {
  missing_items: PortalMissingItem[];
  blocked_step_ids?: string[];
  resolve_document_type?: (item: PortalMissingItem) => PortalUploadPromptDocumentType;
}

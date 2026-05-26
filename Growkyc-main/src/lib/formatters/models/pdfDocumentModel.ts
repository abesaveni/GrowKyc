export interface PdfDocumentHeader {
  title: string;
  subtitle?: string;
  generated_at: string;
}

export interface PdfDocumentFooter {
  text: string;
}

export interface PdfDocumentSection {
  key: string;
  title: string;
  body: string;
  order: number;
  metadata?: Record<string, unknown>;
}

export interface PdfDocumentEvidenceAppendixItem {
  evidence_id: string;
  filename: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface PdfDocumentEvidenceAppendix {
  title: string;
  items: PdfDocumentEvidenceAppendixItem[];
}

export interface PdfDocumentModel {
  tenant_id: string;
  case_id?: string;
  target_type: 'audit_pack' | 'report' | 'evidence_bundle';
  target_id: string;
  header: PdfDocumentHeader;
  sections: PdfDocumentSection[];
  evidence_appendix?: PdfDocumentEvidenceAppendix;
  footer: PdfDocumentFooter;
  metadata?: Record<string, unknown>;
}

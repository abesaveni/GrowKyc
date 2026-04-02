import type { FormatterRequest } from './formatterRequest';

export interface PdfFormatterSectionInput {
  key: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
}

export interface PdfFormatterEvidenceAppendixItemInput {
  evidence_id: string;
  filename: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface PdfFormatterInput {
  request: FormatterRequest & { format: 'pdf' };
  title: string;
  subtitle?: string;
  sections: PdfFormatterSectionInput[];
  evidence_appendix?: PdfFormatterEvidenceAppendixItemInput[];
  metadata?: Record<string, unknown>;
}

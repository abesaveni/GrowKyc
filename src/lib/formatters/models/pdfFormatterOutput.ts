import type { FormatterResult } from './formatterResult';
import type { PdfDocumentModel } from './pdfDocumentModel';

export type PdfFormatterStatus = 'scaffold_only' | 'rendered';

export interface PdfFormatterOutput {
  result: FormatterResult & { format: 'pdf' };
  document: PdfDocumentModel;
  status: PdfFormatterStatus;
  file_name: string;
  rendered_bytes?: Uint8Array;
}

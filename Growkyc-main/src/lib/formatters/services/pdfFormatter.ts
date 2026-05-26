import type { FormatterResult } from '../models/formatterResult';
import type {
  PdfDocumentEvidenceAppendix,
  PdfDocumentFooter,
  PdfDocumentHeader,
  PdfDocumentModel,
  PdfDocumentSection,
} from '../models/pdfDocumentModel';
import type { PdfFormatterInput } from '../models/pdfFormatterInput';
import type { PdfFormatterOutput } from '../models/pdfFormatterOutput';

export interface PdfHeaderHookInput {
  input: PdfFormatterInput;
  generated_at: string;
}

export interface PdfSectionHookInput {
  input: PdfFormatterInput;
  section: PdfFormatterInput['sections'][number];
  index: number;
}

export interface PdfEvidenceAppendixHookInput {
  input: PdfFormatterInput;
}

export interface PdfFooterHookInput {
  input: PdfFormatterInput;
}

export type PdfHeaderHook = (input: PdfHeaderHookInput) => PdfDocumentHeader;
export type PdfSectionHook = (input: PdfSectionHookInput) => PdfDocumentSection;
export type PdfEvidenceAppendixHook = (input: PdfEvidenceAppendixHookInput) => PdfDocumentEvidenceAppendix | undefined;
export type PdfFooterHook = (input: PdfFooterHookInput) => PdfDocumentFooter;

export interface PdfRenderEngine {
  render(document: PdfDocumentModel): Promise<Uint8Array>;
}

export interface PdfFormatterDependencies {
  now?: () => string;
  generate_formatter_id?: () => string;
  render_engine?: PdfRenderEngine;
  render_header?: PdfHeaderHook;
  render_section?: PdfSectionHook;
  render_evidence_appendix?: PdfEvidenceAppendixHook;
  render_footer?: PdfFooterHook;
}

const defaultNow = (): string => {
  return new Date().toISOString();
};

const defaultFormatterId = (): string => {
  return `fmt_${Date.now()}`;
};

function defaultHeader(input: PdfHeaderHookInput): PdfDocumentHeader {
  return {
    title: input.input.title,
    subtitle: input.input.subtitle,
    generated_at: input.generated_at,
  };
}

function defaultSection(input: PdfSectionHookInput): PdfDocumentSection {
  return {
    key: input.section.key,
    title: input.section.title,
    body: input.section.body,
    order: input.index,
    metadata: input.section.metadata,
  };
}

function defaultEvidenceAppendix(input: PdfEvidenceAppendixHookInput): PdfDocumentEvidenceAppendix | undefined {
  if (!input.input.evidence_appendix || input.input.evidence_appendix.length === 0) {
    return undefined;
  }

  return {
    title: 'Evidence Appendix',
    items: input.input.evidence_appendix.map((item) => ({
      evidence_id: item.evidence_id,
      filename: item.filename,
      description: item.description,
      metadata: item.metadata,
    })),
  };
}

function defaultFooter(input: PdfFooterHookInput): PdfDocumentFooter {
  return {
    text: `${input.input.request.tenant_id} • ${input.input.request.target_type} • ${input.input.request.target_id}`,
  };
}

function buildFormatterResult(input: PdfFormatterInput, now: string, formatter_id: string): FormatterResult {
  return {
    formatter_id,
    tenant_id: input.request.tenant_id,
    case_id: input.request.case_id,
    target_type: input.request.target_type,
    target_id: input.request.target_id,
    format: input.request.format,
    status: 'accepted',
    requested_at: now,
    requested_by: input.request.requested_by,
  };
}

function buildFileName(input: PdfFormatterInput): string {
  return `${input.request.target_type}_${input.request.target_id}.pdf`;
}

export class PdfFormattingNotImplementedError extends Error {
  constructor() {
    super('PDF rendering engine is not configured. This is scaffold-only output.');
    this.name = 'PdfFormattingNotImplementedError';
  }
}

export class PdfFormatterService {
  private readonly now: () => string;
  private readonly generateFormatterId: () => string;
  private readonly renderEngine?: PdfRenderEngine;
  private readonly renderHeader: PdfHeaderHook;
  private readonly renderSection: PdfSectionHook;
  private readonly renderEvidenceAppendix: PdfEvidenceAppendixHook;
  private readonly renderFooter: PdfFooterHook;

  constructor(dependencies: PdfFormatterDependencies = {}) {
    this.now = dependencies.now ?? defaultNow;
    this.generateFormatterId = dependencies.generate_formatter_id ?? defaultFormatterId;
    this.renderEngine = dependencies.render_engine;
    this.renderHeader = dependencies.render_header ?? defaultHeader;
    this.renderSection = dependencies.render_section ?? defaultSection;
    this.renderEvidenceAppendix = dependencies.render_evidence_appendix ?? defaultEvidenceAppendix;
    this.renderFooter = dependencies.render_footer ?? defaultFooter;
  }

  buildDocument(input: PdfFormatterInput): PdfDocumentModel {
    const generated_at = this.now();

    return {
      tenant_id: input.request.tenant_id,
      case_id: input.request.case_id,
      target_type: input.request.target_type,
      target_id: input.request.target_id,
      header: this.renderHeader({
        input,
        generated_at,
      }),
      sections: input.sections.map((section, index) =>
        this.renderSection({
          input,
          section,
          index,
        })
      ),
      evidence_appendix: this.renderEvidenceAppendix({ input }),
      footer: this.renderFooter({ input }),
      metadata: input.metadata ?? input.request.metadata,
    };
  }

  async format(input: PdfFormatterInput): Promise<PdfFormatterOutput> {
    const now = this.now();
    const formatter_id = this.generateFormatterId();
    const document = this.buildDocument(input);
    const baseResult = buildFormatterResult(input, now, formatter_id);

    if (!this.renderEngine) {
      return {
        result: {
          ...baseResult,
          format: 'pdf',
        },
        document,
        status: 'scaffold_only',
        file_name: buildFileName(input),
      };
    }

    const rendered_bytes = await this.renderEngine.render(document);

    return {
      result: {
        ...baseResult,
        format: 'pdf',
      },
      document,
      status: 'rendered',
      file_name: buildFileName(input),
      rendered_bytes,
    };
  }

  async requireRenderedPdf(input: PdfFormatterInput): Promise<PdfFormatterOutput> {
    if (!this.renderEngine) {
      throw new PdfFormattingNotImplementedError();
    }

    return this.format(input);
  }
}

export async function formatAsPdf(
  input: PdfFormatterInput,
  dependencies: PdfFormatterDependencies = {}
): Promise<PdfFormatterOutput> {
  return new PdfFormatterService(dependencies).format(input);
}

import type { FormatterFormat } from '../models/formatterFormat';
import type { FormatterTarget } from '../models/formatterTarget';
import type { CsvFormatterInput } from '../models/csvFormatterInput';
import type { CsvFormatterOutput } from '../models/csvFormatterOutput';
import type { JsonFormatterInput } from '../models/jsonFormatterInput';
import type { JsonFormatterOutput } from '../models/jsonFormatterOutput';
import type { PdfFormatterInput } from '../models/pdfFormatterInput';
import type { PdfFormatterOutput } from '../models/pdfFormatterOutput';
import { formatAsCsv } from './csvFormatter';
import { formatAsJson } from './jsonFormatter';
import { formatAsPdf } from './pdfFormatter';

export type FormatterInputByFormat = {
  json: JsonFormatterInput;
  csv: CsvFormatterInput;
  pdf: PdfFormatterInput;
};

export type FormatterOutputByFormat = {
  json: JsonFormatterOutput;
  csv: CsvFormatterOutput;
  pdf: PdfFormatterOutput;
};

export type FormatterRunner<F extends FormatterFormat> = (
  input: FormatterInputByFormat[F]
) => Promise<FormatterOutputByFormat[F]> | FormatterOutputByFormat[F];

export type FormatterImplementationMap = {
  [F in FormatterFormat]?: FormatterRunner<F>;
};

export const FORMATTER_TARGET_COMPATIBILITY: Readonly<Record<FormatterFormat, readonly FormatterTarget[]>> = {
  json: ['audit_pack', 'report', 'evidence_bundle'],
  csv: ['report'],
  pdf: ['audit_pack', 'report', 'evidence_bundle'],
};

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Formatter registry is server-side only.');
  }
}

export class UnsupportedFormatterError extends Error {
  constructor(public readonly format: FormatterFormat) {
    super(`Formatter '${format}' is not registered.`);
    this.name = 'UnsupportedFormatterError';
  }
}

export class UnsupportedTargetFormatError extends Error {
  constructor(
    public readonly format: FormatterFormat,
    public readonly target_type: FormatterTarget
  ) {
    super(`Formatter '${format}' is not compatible with target '${target_type}'.`);
    this.name = 'UnsupportedTargetFormatError';
  }
}

export function isTargetFormatCompatible(format: FormatterFormat, target_type: FormatterTarget): boolean {
  return FORMATTER_TARGET_COMPATIBILITY[format].includes(target_type);
}

export function assertTargetFormatCompatibility(format: FormatterFormat, target_type: FormatterTarget): void {
  if (!isTargetFormatCompatible(format, target_type)) {
    throw new UnsupportedTargetFormatError(format, target_type);
  }
}

export class FormatterRegistry {
  private readonly implementations: Partial<Record<FormatterFormat, FormatterRunner<FormatterFormat>>> = {};

  constructor(initialImplementations: FormatterImplementationMap = {}) {
    assertServerRuntime();

    for (const format of Object.keys(initialImplementations) as FormatterFormat[]) {
      const implementation = initialImplementations[format];

      if (implementation) {
        this.register(format, implementation as FormatterRunner<typeof format>);
      }
    }
  }

  register<F extends FormatterFormat>(format: F, implementation: FormatterRunner<F>): void {
    this.implementations[format] = implementation as FormatterRunner<FormatterFormat>;
  }

  unregister(format: FormatterFormat): void {
    delete this.implementations[format];
  }

  has(format: FormatterFormat): boolean {
    return typeof this.implementations[format] === 'function';
  }

  lookup<F extends FormatterFormat>(format: F): FormatterRunner<F> {
    const implementation = this.implementations[format];

    if (!implementation) {
      throw new UnsupportedFormatterError(format);
    }

    return implementation as FormatterRunner<F>;
  }

  list(): FormatterFormat[] {
    return (Object.keys(this.implementations) as FormatterFormat[]).filter((format) => this.has(format));
  }

  async run<F extends FormatterFormat>(format: F, input: FormatterInputByFormat[F]): Promise<FormatterOutputByFormat[F]> {
    assertTargetFormatCompatibility(format, input.request.target_type);

    const implementation = this.lookup(format);
    const output = implementation(input);

    return Promise.resolve(output);
  }
}

export function lookupFormatter<F extends FormatterFormat>(
  registry: FormatterRegistry,
  format: F
): FormatterRunner<F> {
  return registry.lookup(format);
}

export function buildFormatterRegistry(overrides: FormatterImplementationMap = {}): FormatterRegistry {
  const registry = new FormatterRegistry({
    json: (input) => formatAsJson(input),
    csv: (input) => formatAsCsv(input),
    pdf: (input) => formatAsPdf(input),
  });

  for (const format of Object.keys(overrides) as FormatterFormat[]) {
    const implementation = overrides[format];

    if (implementation) {
      registry.register(format, implementation as FormatterRunner<typeof format>);
    }
  }

  return registry;
}

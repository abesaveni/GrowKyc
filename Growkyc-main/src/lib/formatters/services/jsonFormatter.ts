import type { FormatterResult } from '../models/formatterResult';
import type { JsonFormatterInput, JsonSerializable } from '../models/jsonFormatterInput';
import type { JsonFormatterDocument, JsonFormatterOutput } from '../models/jsonFormatterOutput';

export interface JsonFormatterDependencies {
  now?: () => string;
  generate_formatter_id?: () => string;
}

const defaultNow = (): string => {
  return new Date().toISOString();
};

const defaultFormatterId = (): string => {
  return `fmt_${Date.now()}`;
};

const unsafeMetadataKeys = new Set(['__proto__', 'constructor', 'prototype']);

function sanitizeJsonValue(value: unknown, depth = 0): JsonSerializable | undefined {
  if (depth > 6) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'string' || typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  if (Array.isArray(value)) {
    const normalizedArray: JsonSerializable[] = [];

    for (const item of value) {
      const normalizedItem = sanitizeJsonValue(item, depth + 1);

      if (normalizedItem !== undefined) {
        normalizedArray.push(normalizedItem);
      }
    }

    return normalizedArray;
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const normalizedObject: Record<string, JsonSerializable> = {};

    for (const [key, item] of Object.entries(record)) {
      if (unsafeMetadataKeys.has(key)) {
        continue;
      }

      const normalizedItem = sanitizeJsonValue(item, depth + 1);

      if (normalizedItem !== undefined) {
        normalizedObject[key] = normalizedItem;
      }
    }

    return normalizedObject;
  }

  return undefined;
}

function sanitizeMetadata(metadata?: Record<string, unknown>): { [key: string]: JsonSerializable } | undefined {
  if (!metadata) {
    return undefined;
  }

  const sanitized: Record<string, JsonSerializable> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (unsafeMetadataKeys.has(key)) {
      continue;
    }

    const normalizedValue = sanitizeJsonValue(value);

    if (normalizedValue !== undefined) {
      sanitized[key] = normalizedValue;
    }
  }

  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

function buildFileName(input: JsonFormatterInput): string {
  return `${input.request.target_type}_${input.request.target_id}.json`;
}

function buildFormatterResult(input: JsonFormatterInput, now: string, formatter_id: string): FormatterResult {
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

function buildDocument(input: JsonFormatterInput, now: string): JsonFormatterDocument {
  const payload = sanitizeJsonValue(input.target_payload) ?? {};
  const metadata = sanitizeMetadata(input.metadata ?? input.request.metadata);

  return {
    formatter: {
      format: 'json',
      target_type: input.request.target_type,
      generated_at: now,
    },
    request: {
      tenant_id: input.request.tenant_id,
      case_id: input.request.case_id,
      target_id: input.request.target_id,
      requested_by: input.request.requested_by,
    },
    target: {
      payload,
    },
    metadata,
  };
}

function getUtf8ByteLength(input: string): number {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(input).length;
  }

  return input.length;
}

export class JsonFormatterService {
  private readonly now: () => string;
  private readonly generateFormatterId: () => string;

  constructor(dependencies: JsonFormatterDependencies = {}) {
    this.now = dependencies.now ?? defaultNow;
    this.generateFormatterId = dependencies.generate_formatter_id ?? defaultFormatterId;
  }

  format(input: JsonFormatterInput): JsonFormatterOutput {
    const now = this.now();
    const formatter_id = this.generateFormatterId();
    const document = buildDocument(input, now);
    const serialized_content = JSON.stringify(document, null, 2);

    return {
      result: buildFormatterResult(input, now, formatter_id),
      content_type: 'application/json',
      file_extension: 'json',
      file_name: buildFileName(input),
      document,
      serialized_content,
      byte_length: getUtf8ByteLength(serialized_content),
    };
  }
}

export function formatAsJson(
  input: JsonFormatterInput,
  dependencies: JsonFormatterDependencies = {}
): JsonFormatterOutput {
  return new JsonFormatterService(dependencies).format(input);
}

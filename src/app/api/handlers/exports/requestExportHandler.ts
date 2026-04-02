import type { TenantContext } from '../../middleware/auth';
import type { ExportResponse } from '../../../../lib/exports/models/exportResponse';
import type { ExportAuditEvent } from '../../../../lib/exports/models/exportAuditEvent';
import type { ExportFormatterHookInput } from '../../../../lib/exports/services/exportEndpointService';
import { providerRegistry } from '../../../lib/providers/providerRegistry';
import {
  ExportService,
  type ExportServiceRequest,
  type ExportServiceRequestBody,
} from '../../../../lib/exports/services/exportService';
import { createClient } from '@supabase/supabase-js';

// ── Supabase admin client for export data fetching ────────────────────────────

function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  return createClient(url, key);
}

// ── Data fetching helpers ─────────────────────────────────────────────────────

async function fetchExportData(input: ExportFormatterHookInput): Promise<Record<string, unknown>[]> {
  const { request } = input;
  const db = getSupabaseAdminClient();

  if (request.target_type === 'report') {
    // Fetch case + bot results for the target case
    const { data: caseData } = await db
      .from('cases')
      .select('*')
      .eq('id', request.target_id)
      .eq('organization_id', request.tenant_id)
      .single();

    const { data: botResults } = await db
      .from('bot_results')
      .select('*')
      .eq('case_id', request.target_id)
      .order('created_at', { ascending: false });

    return [
      { type: 'case', data: caseData ?? {} },
      ...((botResults ?? []) as Record<string, unknown>[]).map((r) => ({ type: 'bot_result', data: r })),
    ];
  }

  if (request.target_type === 'audit_pack') {
    const { data: auditEvents } = await db
      .from('audit_events')
      .select('*')
      .eq('organization_id', request.tenant_id)
      .order('created_at', { ascending: false })
      .limit(500);

    return ((auditEvents ?? []) as Record<string, unknown>[]).map((e) => ({ type: 'audit_event', data: e }));
  }

  if (request.target_type === 'evidence_bundle') {
    const { data: caseData } = await db
      .from('cases')
      .select('*')
      .eq('id', request.target_id)
      .eq('organization_id', request.tenant_id)
      .single();

    const { data: findings } = await db
      .from('findings')
      .select('*')
      .eq('case_id', request.target_id)
      .order('created_at', { ascending: false });

    const { data: auditEvents } = await db
      .from('audit_events')
      .select('*')
      .eq('resource_id', request.target_id)
      .order('created_at', { ascending: false })
      .limit(200);

    return [
      { type: 'case', data: caseData ?? {} },
      ...((findings ?? []) as Record<string, unknown>[]).map((f) => ({ type: 'finding', data: f })),
      ...((auditEvents ?? []) as Record<string, unknown>[]).map((e) => ({ type: 'audit_event', data: e })),
    ];
  }

  return [];
}

// ── CSV helpers ───────────────────────────────────────────────────────────────

function flattenRecord(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenRecord(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = value === null || value === undefined ? '' : String(value);
    }
  }
  return result;
}

function buildCsvString(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';

  // Flatten each row to a simple key-value map
  const flatRows = rows.map((row) => flattenRecord(row as Record<string, unknown>));

  // Collect all headers across all rows
  const headerSet = new Set<string>();
  for (const row of flatRows) {
    for (const key of Object.keys(row)) {
      headerSet.add(key);
    }
  }
  const headers = Array.from(headerSet);

  const escape = (val: string): string => {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const lines: string[] = [headers.map(escape).join(',')];
  for (const row of flatRows) {
    lines.push(headers.map((h) => escape(row[h] ?? '')).join(','));
  }

  return lines.join('\n');
}

// ── PDF (HTML) helper ─────────────────────────────────────────────────────────
// NOTE: For production PDF generation, replace this with pdfkit or puppeteer.
// pdfkit can render to a buffer server-side; puppeteer can print headless Chrome
// pages to PDF. Both require adding the package to server/package.json.

function buildPdfHtml(input: ExportFormatterHookInput, rows: Record<string, unknown>[]): string {
  const { request, export_id } = input;
  const generatedAt = new Date().toISOString();

  const tableRows = rows
    .map((row) => {
      const flat = flattenRecord(row as Record<string, unknown>);
      return Object.entries(flat)
        .map(([k, v]) => `<tr><td style="font-weight:bold;padding:4px 8px;border:1px solid #ddd">${k}</td><td style="padding:4px 8px;border:1px solid #ddd">${v}</td></tr>`)
        .join('');
    })
    .join('<tr><td colspan="2" style="background:#eee;padding:4px 8px">&nbsp;</td></tr>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>GrowKYC Export — ${request.target_type}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; color: #222; margin: 24px; }
    h1 { font-size: 18px; margin-bottom: 4px; }
    .meta { color: #666; font-size: 11px; margin-bottom: 16px; }
    table { border-collapse: collapse; width: 100%; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <h1>GrowKYC Export — ${request.target_type.replace(/_/g, ' ')}</h1>
  <div class="meta">
    Export ID: ${export_id} &nbsp;|&nbsp;
    Tenant: ${request.tenant_id} &nbsp;|&nbsp;
    Target: ${request.target_id} &nbsp;|&nbsp;
    Format: PDF &nbsp;|&nbsp;
    Generated: ${generatedAt}
  </div>
  <button onclick="window.print()">Print / Save as PDF</button>
  <br/><br/>
  <table>
    <tbody>${tableRows}</tbody>
  </table>
</body>
</html>`;
}

// ── Audit severity helper ─────────────────────────────────────────────────────

function toAuditSeverity(action: ExportAuditEvent['action']): 'info' | 'warning' | 'error' {
  if (action === 'export_failed') {
    return 'error';
  }

  if (action === 'export_downloaded') {
    return 'warning';
  }

  return 'info';
}

const exportService = new ExportService({
  formatter_hooks: {
    pdf: async (input) => {
      const rows = await fetchExportData(input);
      const html = buildPdfHtml(input, rows);
      // Store the HTML in the input so the caller can retrieve it if needed.
      // In production, write this to S3 or convert with puppeteer/pdfkit.
      (input as Record<string, unknown>)._result = { html, content_type: 'text/html' };
      return;
    },
    csv: async (input) => {
      const rows = await fetchExportData(input);
      const csv = buildCsvString(rows);
      (input as Record<string, unknown>)._result = { csv, content_type: 'text/csv' };
      return;
    },
    json: async (input) => {
      const rows = await fetchExportData(input);
      const json = JSON.stringify(
        {
          export_id: input.export_id,
          tenant_id: input.request.tenant_id,
          target_type: input.request.target_type,
          target_id: input.request.target_id,
          case_id: input.request.case_id ?? null,
          format: input.request.format,
          requested_by: input.request.requested_by,
          generated_at: new Date().toISOString(),
          records: rows,
        },
        null,
        2
      );
      (input as Record<string, unknown>)._result = { json, content_type: 'application/json' };
      return;
    },
  },
  on_audit_event: async (event) => {
    await providerRegistry.audit.createAuditEvent({
      organizationId: event.tenant_id,
      actorUserId: event.actor_user_id,
      eventType: `export_${event.action}`,
      severity: toAuditSeverity(event.action),
      action: event.action,
      resourceType: event.target_type,
      resourceId: event.target_id,
      module: 'exports',
      data: {
        export_id: event.export_id,
        case_id: event.case_id,
        format: event.format,
        reason_code: event.reason_code,
        metadata: event.metadata,
        occurred_at: event.occurred_at,
      },
    });
  },
});

const assertBody = (body: unknown): ExportServiceRequestBody => {
  return (body ?? {}) as ExportServiceRequestBody;
};

const toServiceRequest = (
  body: ExportServiceRequestBody,
  ctx: TenantContext,
): ExportServiceRequest => {
  return {
    body,
    context: {
      actor: {
        user_id: ctx.userId,
        tenant_id: ctx.organizationId,
        role: ctx.role,
        permissions: [...ctx.permissions],
      },
    },
  };
};

export async function requestReportExportHandler(
  body: unknown,
  ctx: TenantContext,
): Promise<ExportResponse> {
  return exportService.requestReportExport(toServiceRequest(assertBody(body), ctx));
}

export async function requestAuditPackExportHandler(
  body: unknown,
  ctx: TenantContext,
): Promise<ExportResponse> {
  return exportService.requestAuditPackExport(toServiceRequest(assertBody(body), ctx));
}

export async function requestEvidenceBundleExportHandler(
  body: unknown,
  ctx: TenantContext,
): Promise<ExportResponse> {
  return exportService.requestEvidenceBundleExport(toServiceRequest(assertBody(body), ctx));
}

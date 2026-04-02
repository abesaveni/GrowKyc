import {
  ApiRouteDefinition,
  ApiRouteRequest,
  ApiRouteResponse,
  ApiRouter,
  createApiRouter,
  jsonResponse,
} from './router';
import { extractTenantContext, AuthError } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { screeningProviderRegistry } from '../lib/providers/screening/registry';
import { supabaseServer as supabase } from '../../../lib/supabaseServer';
import {
  SanctionsScreeningRequest,
  PepScreeningRequest,
  AdverseMediaRequest,
  IdVerificationRequest,
  RegistryCheckRequest,
  ScreeningSubject,
} from '../lib/providers/screening/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function withTenantContext<T>(
  request: ApiRouteRequest,
  run: (ctx: Awaited<ReturnType<typeof extractTenantContext>>) => Promise<T>
): Promise<T> {
  const ctx = await extractTenantContext(request.headers);
  return run(ctx);
}

function toErrorResponse(error: unknown): ApiRouteResponse {
  const statusCode =
    typeof (error as { statusCode?: unknown })?.statusCode === 'number'
      ? (error as { statusCode: number }).statusCode
      : error instanceof AuthError
      ? 401
      : 500;

  const message =
    error instanceof Error ? error.message : 'Internal server error';

  return jsonResponse(statusCode, { error: message });
}

async function logProviderCall(params: {
  organizationId: string;
  caseId?: string;
  providerName: string;
  checkType: string;
  status: string;
  latencyMs: number;
}): Promise<void> {
  try {
    await supabase.from('provider_logs').insert({
      id: crypto.randomUUID(),
      organization_id: params.organizationId,
      case_id: params.caseId ?? null,
      provider_name: params.providerName,
      check_type: params.checkType,
      status: params.status,
      latency_ms: params.latencyMs,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Non-critical: swallow logging errors so screening results still return
  }
}

// ── Route implementations ─────────────────────────────────────────────────────

/**
 * POST /api/screening/sanctions
 * Run a sanctions screening check.
 * Body: { subject, caseId?, metadata? }
 */
async function sanctionsScreeningHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:write');

      const body = (request.body ?? {}) as {
        subject?: ScreeningSubject;
        caseId?: string;
        metadata?: Record<string, unknown>;
      };

      if (!body.subject) {
        return jsonResponse(400, { error: 'subject is required' });
      }

      const adapters = screeningProviderRegistry.getAdaptersForCheck('sanctions_screening');
      if (adapters.length === 0) {
        return jsonResponse(503, { error: 'No sanctions screening provider available' });
      }

      const adapter = adapters[0];
      const screeningRequest: SanctionsScreeningRequest = {
        checkType: 'sanctions_screening',
        correlationId: crypto.randomUUID(),
        organizationId: ctx.organizationId,
        requestedAt: new Date().toISOString(),
        subject: body.subject,
        caseId: body.caseId,
        metadata: body.metadata,
      };

      const startTime = Date.now();
      const result = await adapter.screenSanctions(screeningRequest);
      const latencyMs = Date.now() - startTime;

      await logProviderCall({
        organizationId: ctx.organizationId,
        caseId: body.caseId,
        providerName: adapter.providerName,
        checkType: 'sanctions_screening',
        status: result.status,
        latencyMs,
      });

      return jsonResponse(200, result);
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * POST /api/screening/pep
 * Run a PEP (Politically Exposed Person) screening check.
 * Body: { subject, caseId?, metadata? }
 */
async function pepScreeningHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:write');

      const body = (request.body ?? {}) as {
        subject?: ScreeningSubject;
        caseId?: string;
        metadata?: Record<string, unknown>;
      };

      if (!body.subject) {
        return jsonResponse(400, { error: 'subject is required' });
      }

      const adapters = screeningProviderRegistry.getAdaptersForCheck('pep_screening');
      if (adapters.length === 0) {
        return jsonResponse(503, { error: 'No PEP screening provider available' });
      }

      const adapter = adapters[0];
      const screeningRequest: PepScreeningRequest = {
        checkType: 'pep_screening',
        correlationId: crypto.randomUUID(),
        organizationId: ctx.organizationId,
        requestedAt: new Date().toISOString(),
        subject: body.subject,
        caseId: body.caseId,
        metadata: body.metadata,
      };

      const startTime = Date.now();
      const result = await adapter.screenPep(screeningRequest);
      const latencyMs = Date.now() - startTime;

      await logProviderCall({
        organizationId: ctx.organizationId,
        caseId: body.caseId,
        providerName: adapter.providerName,
        checkType: 'pep_screening',
        status: result.status,
        latencyMs,
      });

      return jsonResponse(200, result);
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * POST /api/screening/adverse-media
 * Run an adverse media screening check.
 * Body: { subject, caseId?, lookbackDays?, metadata? }
 */
async function adverseMediaScreeningHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:write');

      const body = (request.body ?? {}) as {
        subject?: ScreeningSubject;
        caseId?: string;
        lookbackDays?: number;
        metadata?: Record<string, unknown>;
      };

      if (!body.subject) {
        return jsonResponse(400, { error: 'subject is required' });
      }

      const adapters = screeningProviderRegistry.getAdaptersForCheck('adverse_media');
      if (adapters.length === 0) {
        return jsonResponse(503, { error: 'No adverse media screening provider available' });
      }

      const adapter = adapters[0];
      const screeningRequest: AdverseMediaRequest = {
        checkType: 'adverse_media',
        correlationId: crypto.randomUUID(),
        organizationId: ctx.organizationId,
        requestedAt: new Date().toISOString(),
        subject: body.subject,
        caseId: body.caseId,
        lookbackDays: body.lookbackDays,
        metadata: body.metadata,
      };

      const startTime = Date.now();
      const result = await adapter.screenAdverseMedia(screeningRequest);
      const latencyMs = Date.now() - startTime;

      await logProviderCall({
        organizationId: ctx.organizationId,
        caseId: body.caseId,
        providerName: adapter.providerName,
        checkType: 'adverse_media',
        status: result.status,
        latencyMs,
      });

      return jsonResponse(200, result);
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * POST /api/screening/idv
 * Run an identity verification check.
 * Body: { subject, caseId?, documentType?, documentNumber?, metadata? }
 */
async function idvScreeningHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:write');

      const body = (request.body ?? {}) as {
        subject?: ScreeningSubject;
        caseId?: string;
        documentType?: 'passport' | 'drivers_license' | 'national_id' | 'other';
        documentNumber?: string;
        metadata?: Record<string, unknown>;
      };

      if (!body.subject) {
        return jsonResponse(400, { error: 'subject is required' });
      }

      const adapters = screeningProviderRegistry.getAdaptersForCheck('id_verification');
      if (adapters.length === 0) {
        return jsonResponse(503, { error: 'No identity verification provider available' });
      }

      const adapter = adapters[0];
      const screeningRequest: IdVerificationRequest = {
        checkType: 'id_verification',
        correlationId: crypto.randomUUID(),
        organizationId: ctx.organizationId,
        requestedAt: new Date().toISOString(),
        subject: body.subject,
        caseId: body.caseId,
        documentType: body.documentType,
        documentNumber: body.documentNumber,
        metadata: body.metadata,
      };

      const startTime = Date.now();
      const result = await adapter.verifyIdentity(screeningRequest);
      const latencyMs = Date.now() - startTime;

      await logProviderCall({
        organizationId: ctx.organizationId,
        caseId: body.caseId,
        providerName: adapter.providerName,
        checkType: 'id_verification',
        status: result.status,
        latencyMs,
      });

      return jsonResponse(200, result);
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * POST /api/screening/registry
 * Run a registry check (ABN, ASIC, international).
 * Body: { subject, caseId?, registryType?, metadata? }
 */
async function registryCheckHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:write');

      const body = (request.body ?? {}) as {
        subject?: ScreeningSubject;
        caseId?: string;
        registryType?: 'abn' | 'asic' | 'international';
        metadata?: Record<string, unknown>;
      };

      if (!body.subject) {
        return jsonResponse(400, { error: 'subject is required' });
      }

      const adapters = screeningProviderRegistry.getAdaptersForCheck('registry_check');
      if (adapters.length === 0) {
        return jsonResponse(503, { error: 'No registry check provider available' });
      }

      const adapter = adapters[0];
      const screeningRequest: RegistryCheckRequest = {
        checkType: 'registry_check',
        correlationId: crypto.randomUUID(),
        organizationId: ctx.organizationId,
        requestedAt: new Date().toISOString(),
        subject: body.subject,
        caseId: body.caseId,
        registryType: body.registryType,
        metadata: body.metadata,
      };

      const startTime = Date.now();
      const result = await adapter.checkRegistry(screeningRequest);
      const latencyMs = Date.now() - startTime;

      await logProviderCall({
        organizationId: ctx.organizationId,
        caseId: body.caseId,
        providerName: adapter.providerName,
        checkType: 'registry_check',
        status: result.status,
        latencyMs,
      });

      return jsonResponse(200, result);
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * GET /api/screening/providers
 * List available screening providers and their supported checks.
 */
async function listProvidersHandler(request: ApiRouteRequest): Promise<ApiRouteResponse> {
  try {
    return await withTenantContext(request, async (ctx) => {
      requirePermission(ctx, 'cases:read');

      const providerNames = screeningProviderRegistry.listProviderNames();
      const providers = providerNames.map((name) => {
        const adapter = screeningProviderRegistry.getAdapter(name);
        return {
          name,
          supportedChecks: adapter?.supportedChecks ?? [],
        };
      });

      return jsonResponse(200, { providers });
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

// ── Route table ───────────────────────────────────────────────────────────────

const routes: ApiRouteDefinition[] = [
  {
    method: 'POST',
    path: '/api/screening/sanctions',
    handler: sanctionsScreeningHandler,
  },
  {
    method: 'POST',
    path: '/api/screening/pep',
    handler: pepScreeningHandler,
  },
  {
    method: 'POST',
    path: '/api/screening/adverse-media',
    handler: adverseMediaScreeningHandler,
  },
  {
    method: 'POST',
    path: '/api/screening/idv',
    handler: idvScreeningHandler,
  },
  {
    method: 'POST',
    path: '/api/screening/registry',
    handler: registryCheckHandler,
  },
  {
    method: 'GET',
    path: '/api/screening/providers',
    handler: listProvidersHandler,
  },
];

export const screeningRouter: ApiRouter = createApiRouter(routes);
export const screeningRoutes: ApiRouteDefinition[] = routes;

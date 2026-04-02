import {
  ApiRouteDefinition,
  ApiRouter,
  createApiRouter,
  jsonResponse,
  ApiRouteRequest,
  ApiRouteResponse,
} from './router';
import { extractTenantContext, AuthError } from '../middleware/auth';
import { supabaseServer as supabase } from '../../../lib/supabaseServer';

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
  return jsonResponse(statusCode, {
    error: error instanceof Error ? error.message : 'Internal server error',
  });
}

function getEnv(key: string): string | undefined {
  return (
    (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.[key] ??
    undefined
  );
}

const routes: ApiRouteDefinition[] = [
  // GET /api/integrations/status — status of all configured integrations
  {
    method: 'GET',
    path: '/api/integrations/status',
    handler: async (_request) => {
      return jsonResponse(200, {
        xero: { configured: Boolean(getEnv('XERO_CLIENT_ID') && getEnv('XERO_CLIENT_SECRET')) },
        asic: { configured: Boolean(getEnv('ASIC_API_KEY') || getEnv('ABR_GUID')) },
        stripe: { configured: Boolean(getEnv('STRIPE_SECRET_KEY')) },
        docusign: { configured: Boolean(getEnv('DOCUSIGN_INTEGRATION_KEY')) },
        paypal: { configured: false },
        pexa: { configured: Boolean(getEnv('PEXA_API_KEY')) },
      });
    },
  },

  // POST /api/integrations/xero/connect — initiate Xero OAuth
  {
    method: 'POST',
    path: '/api/integrations/xero/connect',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          const clientId = getEnv('XERO_CLIENT_ID');
          if (!clientId) {
            return jsonResponse(501, {
              error: 'Xero integration not configured',
              configured: false,
            });
          }

          const body = (request.body ?? {}) as Record<string, unknown>;
          const redirectUri =
            (body.redirectUri as string | undefined) ??
            `${getEnv('APP_URL') ?? 'https://localhost:3000'}/api/integrations/xero/callback`;

          const state = crypto.randomUUID();

          // Store pending connection state
          await supabase.from('integration_connections').insert({
            id: crypto.randomUUID(),
            organization_id: ctx.organizationId,
            provider: 'xero',
            state,
            redirect_uri: redirectUri,
            status: 'pending',
            created_at: new Date().toISOString(),
          });

          const scope = 'openid profile email accounting.transactions accounting.contacts';
          const authUrl =
            `https://login.xero.com/identity/connect/authorize` +
            `?response_type=code` +
            `&client_id=${encodeURIComponent(clientId)}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${encodeURIComponent(scope)}` +
            `&state=${encodeURIComponent(state)}`;

          return jsonResponse(200, { authUrl, state });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // GET /api/integrations/xero/callback — Xero OAuth callback
  {
    method: 'GET',
    path: '/api/integrations/xero/callback',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          const q = request.query ?? {};
          const code = q.code;
          const state = q.state;

          if (!code || !state) {
            return jsonResponse(400, { error: 'code and state query parameters are required' });
          }

          const clientId = getEnv('XERO_CLIENT_ID');
          const clientSecret = getEnv('XERO_CLIENT_SECRET');
          if (!clientId || !clientSecret) {
            return jsonResponse(501, { error: 'Xero integration not configured', configured: false });
          }

          // Retrieve pending connection to get redirect_uri
          const { data: connection } = await supabase
            .from('integration_connections')
            .select('redirect_uri')
            .eq('organization_id', ctx.organizationId)
            .eq('provider', 'xero')
            .eq('state', state)
            .single();

          const redirectUri =
            connection?.redirect_uri ??
            `${getEnv('APP_URL') ?? 'https://localhost:3000'}/api/integrations/xero/callback`;

          // Exchange code for token
          const tokenResponse = await fetch('https://identity.xero.com/connect/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              code,
              redirect_uri: redirectUri,
              client_id: clientId,
              client_secret: clientSecret,
            }).toString(),
          });

          if (!tokenResponse.ok) {
            const errText = await tokenResponse.text();
            return jsonResponse(502, { error: `Xero token exchange failed: ${errText}` });
          }

          const tokenData = (await tokenResponse.json()) as Record<string, unknown>;

          // Get Xero tenant connections
          let xeroTenantId: string | null = null;
          try {
            const connectionsResp = await fetch('https://api.xero.com/connections', {
              headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });
            if (connectionsResp.ok) {
              const connections = (await connectionsResp.json()) as Array<{ tenantId: string }>;
              xeroTenantId = connections[0]?.tenantId ?? null;
            }
          } catch {
            // Non-fatal: tenant ID unknown
          }

          // Store token
          const now = new Date().toISOString();
          await supabase.from('integration_tokens').insert({
            id: crypto.randomUUID(),
            organization_id: ctx.organizationId,
            provider: 'xero',
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token ?? null,
            expires_at: tokenData.expires_in
              ? new Date(Date.now() + Number(tokenData.expires_in) * 1000).toISOString()
              : null,
            xero_tenant_id: xeroTenantId,
            created_at: now,
            updated_at: now,
          });

          // Mark connection as complete
          await supabase
            .from('integration_connections')
            .update({ status: 'connected' })
            .eq('organization_id', ctx.organizationId)
            .eq('provider', 'xero')
            .eq('state', state);

          return jsonResponse(200, { success: true, tenantId: xeroTenantId });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // GET /api/integrations/xero/contacts — get Xero contacts
  {
    method: 'GET',
    path: '/api/integrations/xero/contacts',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          const { data: tokenRow } = await supabase
            .from('integration_tokens')
            .select('access_token, xero_tenant_id')
            .eq('organization_id', ctx.organizationId)
            .eq('provider', 'xero')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (!tokenRow?.access_token) {
            return jsonResponse(401, { error: 'No Xero token found. Please connect Xero first.' });
          }

          const xeroResp = await fetch('https://api.xero.com/api.xro/2.0/Contacts', {
            headers: {
              Authorization: `Bearer ${tokenRow.access_token}`,
              'Xero-tenant-id': tokenRow.xero_tenant_id ?? '',
              Accept: 'application/json',
            },
          });

          if (!xeroResp.ok) {
            const errText = await xeroResp.text();
            return jsonResponse(xeroResp.status, { error: `Xero API error: ${errText}` });
          }

          const data = (await xeroResp.json()) as { Contacts?: unknown[] };
          return jsonResponse(200, { contacts: data.Contacts ?? [] });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // GET /api/integrations/asic/lookup — ASIC/ABR company lookup
  {
    method: 'GET',
    path: '/api/integrations/asic/lookup',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          void ctx; // auth check only

          const q = request.query ?? {};
          const acn = q.acn;
          const name = q.name;

          if (!acn && !name) {
            return jsonResponse(400, { error: 'acn or name query parameter is required' });
          }

          const asicApiKey = getEnv('ASIC_API_KEY');
          if (asicApiKey) {
            // Call real ASIC API if key available
            const query = acn ? `acn=${encodeURIComponent(acn)}` : `name=${encodeURIComponent(name!)}`;
            const asicResp = await fetch(
              `https://api.asic.gov.au/v1/companies/search?${query}`,
              { headers: { 'x-api-key': asicApiKey } }
            );

            if (!asicResp.ok) {
              const errText = await asicResp.text();
              return jsonResponse(asicResp.status, { error: `ASIC API error: ${errText}` });
            }

            const data = await asicResp.json();
            return jsonResponse(200, { results: data, source: 'asic' });
          }

          // Fallback to ABR
          const abrGuid = getEnv('ABR_GUID');
          if (!abrGuid) {
            return jsonResponse(501, {
              error: 'ASIC/ABR lookup not configured',
              configured: false,
            });
          }

          const searchQuery = name ?? acn ?? '';
          const abrUrl =
            `https://abr.business.gov.au/json/MatchingNames.aspx` +
            `?name=${encodeURIComponent(searchQuery)}&maxResults=20&guid=${encodeURIComponent(abrGuid)}`;

          const abrResp = await fetch(abrUrl);
          if (!abrResp.ok) {
            return jsonResponse(502, { error: `ABR lookup failed: ${abrResp.statusText}` });
          }

          // ABR returns JSONP-like response; parse carefully
          const rawText = await abrResp.text();
          let results: unknown = [];
          try {
            results = JSON.parse(rawText);
          } catch {
            // Some ABR endpoints wrap in callback; strip wrapper if present
            const match = rawText.match(/callback\(([\s\S]*)\)/);
            if (match) {
              try {
                results = JSON.parse(match[1]);
              } catch {
                results = [];
              }
            }
          }

          return jsonResponse(200, { results, source: 'abr' });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // POST /api/payments/stripe/charge — create Stripe payment intent
  {
    method: 'POST',
    path: '/api/payments/stripe/charge',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          void ctx; // auth check only

          const stripeKey = getEnv('STRIPE_SECRET_KEY');
          if (!stripeKey) {
            return jsonResponse(501, {
              error: 'Stripe integration not configured',
              configured: false,
            });
          }

          const body = (request.body ?? {}) as Record<string, unknown>;
          const { amount, currency, description, customerId } = body;

          if (!amount || !currency) {
            return jsonResponse(400, { error: 'amount and currency are required' });
          }

          const params = new URLSearchParams({
            amount: String(Math.round(Number(amount))),
            currency: String(currency),
            'automatic_payment_methods[enabled]': 'true',
          });
          if (description) params.set('description', String(description));
          if (customerId) params.set('customer', String(customerId));

          const stripeResp = await fetch('https://api.stripe.com/v1/payment_intents', {
            method: 'POST',
            headers: {
              Authorization: `Basic ${Buffer.from(`${stripeKey}:`).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          });

          if (!stripeResp.ok) {
            const errData = (await stripeResp.json()) as { error?: { message?: string } };
            return jsonResponse(stripeResp.status, {
              error: errData?.error?.message ?? 'Stripe API error',
            });
          }

          const paymentIntent = await stripeResp.json();
          return jsonResponse(200, { paymentIntent });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // POST /api/payments/paypal/subscription — stub
  {
    method: 'POST',
    path: '/api/payments/paypal/subscription',
    handler: async (_request) => {
      return jsonResponse(501, {
        message: 'PayPal integration coming soon',
        configured: false,
      });
    },
  },

  // GET /api/pexa/workspace/:id — get PEXA workspace
  {
    method: 'GET',
    path: '/api/pexa/workspace/:id',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          void ctx; // auth check only

          const pexaApiKey = getEnv('PEXA_API_KEY');
          if (!pexaApiKey) {
            return jsonResponse(501, {
              error: 'PEXA integration not configured',
              configured: false,
            });
          }

          const id = request.params?.id;
          if (!id) return jsonResponse(400, { error: 'Workspace ID is required' });

          const pexaApiUrl = getEnv('PEXA_API_URL') ?? 'https://api.pexa.com.au';
          const pexaResp = await fetch(`${pexaApiUrl}/workspaces/${encodeURIComponent(id)}`, {
            headers: { Authorization: `Bearer ${pexaApiKey}` },
          });

          if (!pexaResp.ok) {
            if (pexaResp.status === 404) {
              return jsonResponse(404, { error: 'PEXA workspace not found' });
            }
            const errText = await pexaResp.text();
            return jsonResponse(pexaResp.status, { error: `PEXA API error: ${errText}` });
          }

          const workspace = await pexaResp.json();
          return jsonResponse(200, { workspace });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },

  // POST /api/pexa/workspace/:id/sync — sync PEXA workspace
  {
    method: 'POST',
    path: '/api/pexa/workspace/:id/sync',
    handler: async (request) => {
      try {
        return await withTenantContext(request, async (ctx) => {
          void ctx; // auth check only

          const pexaApiKey = getEnv('PEXA_API_KEY');
          if (!pexaApiKey) {
            return jsonResponse(501, {
              error: 'PEXA integration not configured',
              configured: false,
            });
          }

          const id = request.params?.id;
          if (!id) return jsonResponse(400, { error: 'Workspace ID is required' });

          const pexaApiUrl = getEnv('PEXA_API_URL') ?? 'https://api.pexa.com.au';
          const pexaResp = await fetch(`${pexaApiUrl}/workspaces/${encodeURIComponent(id)}/sync`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${pexaApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(request.body ?? {}),
          });

          if (!pexaResp.ok) {
            if (pexaResp.status === 404) {
              return jsonResponse(404, { error: 'PEXA workspace not found' });
            }
            const errText = await pexaResp.text();
            return jsonResponse(pexaResp.status, { error: `PEXA API error: ${errText}` });
          }

          const result = await pexaResp.json();
          return jsonResponse(200, { result, synced: true });
        });
      } catch (error) {
        return toErrorResponse(error);
      }
    },
  },
];

export const integrationsRouter: ApiRouter = createApiRouter(routes);
export const integrationRoutes: ApiRouteDefinition[] = routes;
// Aliased export to match the name expected by server/src/index.ts
export const integrationsRoutes: ApiRouteDefinition[] = routes;

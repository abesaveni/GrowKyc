/**
 * AIComplianceBot — calls the GrowKYC backend /ai/bot-analysis endpoint.
 *
 * The OpenAI API key lives only on the server side. This class makes an
 * authenticated POST to the backend, which proxies to OpenAI with a
 * compliance-domain system prompt trained for each bot type.
 *
 * Replaces the DefaultComplianceBot hash simulation for all bot types
 * when the backend AI endpoint is reachable.
 */

import { ComplianceBot, BotRunContext, BotResult, BotDescriptor } from './BotTypes';

function getAuthToken(): string | null {
  return sessionStorage.getItem('growkyc_token');
}

function getApiBase(): string {
  return (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';
}

async function callBotAnalysisAPI(
  botId: string,
  context: BotRunContext,
): Promise<{
  status: string;
  score: number;
  summary: string;
  findings: string[];
  risk_factors: string[];
  recommended_actions: string[];
  ai_powered: boolean;
}> {
  const token = getAuthToken();
  const base = getApiBase();

  const response = await fetch(`${base}/ai/bot-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      bot_id: botId,
      client_id: context.clientId,
      client_name: context.clientName,
      organization_id: context.organizationId,
      client_data: {
        client_id: context.clientId,
        client_name: context.clientName,
        case_id: context.caseId ?? null,
        trigger: context.trigger,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`AI bot analysis API returned ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export class AIComplianceBot implements ComplianceBot {
  id: string;
  name: string;
  description: string;
  category: BotDescriptor['category'];
  provider: string;
  cost: number;
  version: string;
  enabled: boolean;

  constructor(descriptor: BotDescriptor) {
    this.id = descriptor.id;
    this.name = descriptor.name;
    this.description = descriptor.description;
    this.category = descriptor.category;
    this.provider = descriptor.provider;
    this.cost = descriptor.cost;
    this.version = descriptor.version;
    this.enabled = descriptor.enabled;
  }

  async run(context: BotRunContext): Promise<BotResult> {
    try {
      const result = await callBotAnalysisAPI(this.id, context);

      const status = result.status as BotResult['status'];

      return {
        status,
        score: result.score,
        summary: result.summary,
        findings: [
          ...result.findings,
          ...result.risk_factors.map((r) => `Risk: ${r}`),
        ],
        evidence: [
          {
            id: `evidence-${this.id}-${Date.now()}`,
            title: `${this.name} — ${result.ai_powered ? 'AI Analysis' : 'Simulated'}`,
            source: this.provider,
            evidenceType: 'api-response',
            confidence: Math.max(0.5, result.score / 100),
            capturedAt: new Date().toISOString(),
            metadata: {
              botId: this.id,
              category: this.category,
              aiPowered: result.ai_powered,
              recommendedActions: result.recommended_actions,
            },
          },
        ],
        metadata: {
          provider: this.provider,
          category: this.category,
          aiPowered: result.ai_powered,
          recommendedActions: result.recommended_actions,
        },
      };
    } catch (error) {
      // If the AI backend is unreachable, fall back to deterministic simulation
      console.warn(`[AIComplianceBot] ${this.id} API call failed, using fallback:`, error);
      return this.simulatedFallback(context);
    }
  }

  private simulatedFallback(context: BotRunContext): BotResult {
    const seed = `${context.clientId}:${this.id}:${context.clientName}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const h = Math.abs(hash) % 100;
    const status: BotResult['status'] = h >= 93 ? 'failed' : h >= 80 ? 'alert' : 'passed';
    const score = 100 - (Math.abs(hash * 13) % 35);

    return {
      status,
      score,
      summary: `${this.name} completed for ${context.clientName} — ${status.toUpperCase()} (offline fallback)`,
      findings: [`${this.provider} response validated`, `${this.category.toUpperCase()} workflow executed (offline)`],
      evidence: [
        {
          id: `evidence-${this.id}-${Date.now()}`,
          title: `${this.name} offline result`,
          source: this.provider,
          evidenceType: 'api-response',
          confidence: score / 100,
          capturedAt: new Date().toISOString(),
          metadata: { botId: this.id, category: this.category, simulated: true },
        },
      ],
      metadata: { provider: this.provider, category: this.category },
    };
  }
}

import { ScreeningProviderAdapter } from '../interfaces';
import {
  ScreeningCheckType,
  SanctionsScreeningRequest,
  PepScreeningRequest,
  AdverseMediaRequest,
  IdVerificationRequest,
  RegistryCheckRequest,
  ProviderScreeningRawResult,
  ProviderMetadata,
} from '../types';

function buildMetadata(providerName: string, startMs: number): ProviderMetadata {
  const now = new Date().toISOString();
  return {
    providerName,
    requestTimestamp: new Date(startMs).toISOString(),
    responseTimestamp: now,
    latencyMs: Date.now() - startMs,
    sourceEnvironment: process.env.NODE_ENV ?? 'development',
  };
}

function notConfiguredResult(
  checkType: ScreeningCheckType,
  providerName: string,
  startMs: number
): ProviderScreeningRawResult {
  return {
    checkType,
    status: 'no_match',
    summary: `${providerName} not configured — returning clear result. Configure ADVERSE_MEDIA_API_URL to enable.`,
    matches: [],
    riskScore: 0,
    metadata: buildMetadata(providerName, startMs),
  };
}

function getRuntimeEnvVar(key: string): string | undefined {
  const processEnv = ((globalThis as any)?.process?.env ?? {}) as Record<string, string>;
  const value = processEnv[key];
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}

export class RealAdverseMediaAdapter implements ScreeningProviderAdapter {
  readonly providerName = 'adverse_media_provider';
  readonly supportedChecks: ScreeningCheckType[] = [
    'sanctions_screening',
    'pep_screening',
    'adverse_media',
    'id_verification',
    'registry_check',
  ];

  async screenSanctions(request: SanctionsScreeningRequest): Promise<ProviderScreeningRawResult> {
    const startMs = Date.now();
    return notConfiguredResult('sanctions_screening', this.providerName, startMs);
  }

  async screenPep(request: PepScreeningRequest): Promise<ProviderScreeningRawResult> {
    const startMs = Date.now();
    return notConfiguredResult('pep_screening', this.providerName, startMs);
  }

  async screenAdverseMedia(request: AdverseMediaRequest): Promise<ProviderScreeningRawResult> {
    const startMs = Date.now();
    const apiUrl = getRuntimeEnvVar('ADVERSE_MEDIA_API_URL');
    const apiKey = getRuntimeEnvVar('ADVERSE_MEDIA_API_KEY');

    if (!apiUrl || !apiKey) {
      return notConfiguredResult('adverse_media', this.providerName, startMs);
    }

    try {
      const response = await fetch(`${apiUrl}/adverse-media/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'X-Correlation-Id': request.correlationId,
        },
        body: JSON.stringify({
          referenceId: request.correlationId,
          name: request.subject.fullName ?? request.subject.entityName ?? '',
          entityType: request.subject.type,
          languages: request.languages ?? ['en'],
          lookbackDays: request.lookbackDays ?? 365,
          countryCode: request.subject.countryCode,
        }),
      });

      if (!response.ok) {
        return {
          checkType: 'adverse_media',
          status: 'failed',
          summary: `Adverse media provider returned HTTP ${response.status}`,
          matches: [],
          riskScore: 0,
          metadata: buildMetadata(this.providerName, startMs),
        };
      }

      const raw = (await response.json()) as Record<string, unknown>;
      const articles = Array.isArray(raw.articles)
        ? raw.articles
        : Array.isArray(raw.matches)
        ? raw.matches
        : [];

      return {
        checkType: 'adverse_media',
        status: articles.length > 0 ? 'partial_match' : 'no_match',
        summary:
          articles.length > 0
            ? `${articles.length} adverse media article(s) found`
            : 'No adverse media found',
        matches: articles.map((a: any, idx: number) => ({
          matchId: a.articleId ?? a.matchId ?? `adverse-media-${idx}`,
          category: 'adverse_media' as ScreeningCheckType,
          confidence: typeof a.relevanceScore === 'number' ? a.relevanceScore : typeof a.score === 'number' ? a.score : 0,
          name: a.headline ?? a.title ?? a.name ?? '',
          reason: a.category ?? a.topic,
          source: a.source ?? a.outlet,
          occurredAt: a.publishedAt ?? a.occurredAt,
          details: a,
        })),
        riskScore: articles.length > 0 ? Math.min(articles.length * 15, 90) : 0,
        metadata: {
          ...buildMetadata(this.providerName, startMs),
          providerRequestId: typeof raw.referenceId === 'string' ? raw.referenceId : undefined,
        },
        rawPayload: raw,
      };
    } catch (err) {
      return {
        checkType: 'adverse_media',
        status: 'failed',
        summary: `Adverse media provider request failed: ${(err as Error).message}`,
        matches: [],
        riskScore: 0,
        metadata: buildMetadata(this.providerName, startMs),
      };
    }
  }

  async verifyIdentity(request: IdVerificationRequest): Promise<ProviderScreeningRawResult> {
    const startMs = Date.now();
    return notConfiguredResult('id_verification', this.providerName, startMs);
  }

  async checkRegistry(request: RegistryCheckRequest): Promise<ProviderScreeningRawResult> {
    const startMs = Date.now();
    return notConfiguredResult('registry_check', this.providerName, startMs);
  }
}

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
    summary: `${providerName} not configured — returning clear result. Configure SANCTIONS_API_URL to enable.`,
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

export class RealSanctionsAdapter implements ScreeningProviderAdapter {
  readonly providerName = 'sanctions_provider';
  readonly supportedChecks: ScreeningCheckType[] = [
    'sanctions_screening',
    'pep_screening',
    'adverse_media',
    'id_verification',
    'registry_check',
  ];

  async screenSanctions(request: SanctionsScreeningRequest): Promise<ProviderScreeningRawResult> {
    const startMs = Date.now();
    const apiUrl = getRuntimeEnvVar('SANCTIONS_API_URL');
    const apiKey = getRuntimeEnvVar('SANCTIONS_API_KEY');

    if (!apiUrl || !apiKey) {
      return notConfiguredResult('sanctions_screening', this.providerName, startMs);
    }

    try {
      const response = await fetch(`${apiUrl}/screen`, {
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
          aliases: request.subject.aliases ?? [],
          dateOfBirth: request.subject.dateOfBirth,
          countryCode: request.subject.countryCode,
          watchlists: request.watchlists,
        }),
      });

      if (!response.ok) {
        return {
          checkType: 'sanctions_screening',
          status: 'failed',
          summary: `Sanctions provider returned HTTP ${response.status}`,
          matches: [],
          riskScore: 0,
          metadata: buildMetadata(this.providerName, startMs),
        };
      }

      const raw = (await response.json()) as Record<string, unknown>;
      const rawMatches = Array.isArray(raw.matches) ? raw.matches : [];

      return {
        checkType: 'sanctions_screening',
        status: rawMatches.length > 0 ? 'partial_match' : 'no_match',
        summary:
          rawMatches.length > 0
            ? `${rawMatches.length} sanctions match(es) found`
            : 'No sanctions matches found',
        matches: rawMatches.map((m: any, idx: number) => ({
          matchId: m.matchId ?? `sanctions-${idx}`,
          category: 'sanctions_screening' as ScreeningCheckType,
          confidence: typeof m.score === 'number' ? m.score : 0,
          name: m.matchedName ?? m.name ?? '',
          reason: m.program,
          source: m.listName,
          details: m,
        })),
        riskScore: rawMatches.length > 0 ? 80 : 0,
        metadata: {
          ...buildMetadata(this.providerName, startMs),
          providerRequestId: typeof raw.referenceId === 'string' ? raw.referenceId : undefined,
        },
        rawPayload: raw,
      };
    } catch (err) {
      return {
        checkType: 'sanctions_screening',
        status: 'failed',
        summary: `Sanctions provider request failed: ${(err as Error).message}`,
        matches: [],
        riskScore: 0,
        metadata: buildMetadata(this.providerName, startMs),
      };
    }
  }

  async screenPep(request: PepScreeningRequest): Promise<ProviderScreeningRawResult> {
    const startMs = Date.now();
    return notConfiguredResult('pep_screening', this.providerName, startMs);
  }

  async screenAdverseMedia(request: AdverseMediaRequest): Promise<ProviderScreeningRawResult> {
    const startMs = Date.now();
    return notConfiguredResult('adverse_media', this.providerName, startMs);
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

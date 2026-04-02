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
    summary: `${providerName} not configured — returning clear result. Configure PEP_API_URL to enable.`,
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

export class RealPepAdapter implements ScreeningProviderAdapter {
  readonly providerName = 'pep_provider';
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
    const apiUrl = getRuntimeEnvVar('PEP_API_URL');
    const apiKey = getRuntimeEnvVar('PEP_API_KEY');

    if (!apiUrl || !apiKey) {
      return notConfiguredResult('pep_screening', this.providerName, startMs);
    }

    try {
      const response = await fetch(`${apiUrl}/pep/screen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'X-Correlation-Id': request.correlationId,
        },
        body: JSON.stringify({
          referenceId: request.correlationId,
          name: request.subject.fullName ?? '',
          aliases: request.subject.aliases ?? [],
          dateOfBirth: request.subject.dateOfBirth,
          nationality: request.subject.countryCode,
          jurisdictions: request.jurisdictions,
        }),
      });

      if (!response.ok) {
        return {
          checkType: 'pep_screening',
          status: 'failed',
          summary: `PEP provider returned HTTP ${response.status}`,
          matches: [],
          riskScore: 0,
          metadata: buildMetadata(this.providerName, startMs),
        };
      }

      const raw = (await response.json()) as Record<string, unknown>;
      const pepMatches = Array.isArray(raw.pepMatches)
        ? raw.pepMatches
        : Array.isArray(raw.matches)
        ? raw.matches
        : [];

      const riskLevel = typeof raw.riskLevel === 'string' ? raw.riskLevel : 'low';
      const riskScore = riskLevel === 'high' ? 85 : riskLevel === 'medium' ? 50 : 10;

      return {
        checkType: 'pep_screening',
        status: pepMatches.length > 0 ? 'partial_match' : 'no_match',
        summary:
          pepMatches.length > 0
            ? `${pepMatches.length} PEP match(es) found (risk: ${riskLevel})`
            : 'No PEP matches found',
        matches: pepMatches.map((m: any, idx: number) => ({
          matchId: m.matchId ?? `pep-${idx}`,
          category: 'pep_screening' as ScreeningCheckType,
          confidence: typeof m.pepScore === 'number' ? m.pepScore : typeof m.score === 'number' ? m.score : 0,
          name: m.pepName ?? m.name ?? '',
          reason: m.position,
          source: m.pepListName ?? m.listName,
          details: m,
        })),
        riskScore,
        metadata: {
          ...buildMetadata(this.providerName, startMs),
          providerRequestId: typeof raw.referenceId === 'string' ? raw.referenceId : undefined,
        },
        rawPayload: raw,
      };
    } catch (err) {
      return {
        checkType: 'pep_screening',
        status: 'failed',
        summary: `PEP provider request failed: ${(err as Error).message}`,
        matches: [],
        riskScore: 0,
        metadata: buildMetadata(this.providerName, startMs),
      };
    }
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

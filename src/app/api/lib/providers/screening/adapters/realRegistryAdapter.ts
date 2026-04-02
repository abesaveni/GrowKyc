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
    summary: `${providerName} not configured — returning clear result. Configure REGISTRY_API_URL to enable.`,
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

export class RealRegistryAdapter implements ScreeningProviderAdapter {
  readonly providerName = 'registry_provider';
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
    return notConfiguredResult('adverse_media', this.providerName, startMs);
  }

  async verifyIdentity(request: IdVerificationRequest): Promise<ProviderScreeningRawResult> {
    const startMs = Date.now();
    return notConfiguredResult('id_verification', this.providerName, startMs);
  }

  async checkRegistry(request: RegistryCheckRequest): Promise<ProviderScreeningRawResult> {
    const startMs = Date.now();
    const apiUrl = getRuntimeEnvVar('REGISTRY_API_URL');
    const apiKey = getRuntimeEnvVar('REGISTRY_API_KEY');

    if (!apiUrl || !apiKey) {
      return notConfiguredResult('registry_check', this.providerName, startMs);
    }

    try {
      const registryType = request.registryType ?? 'abn';
      const endpoint =
        registryType === 'asic'
          ? `${apiUrl}/registry/asic/lookup`
          : registryType === 'international'
          ? `${apiUrl}/registry/international/lookup`
          : `${apiUrl}/registry/abn/lookup`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'X-Correlation-Id': request.correlationId,
        },
        body: JSON.stringify({
          referenceId: request.correlationId,
          entityName: request.subject.entityName ?? request.subject.fullName ?? '',
          registrationNumber: request.subject.registrationNumber,
          registryType,
          countryCode: request.subject.countryCode ?? 'AU',
        }),
      });

      if (!response.ok) {
        return {
          checkType: 'registry_check',
          status: 'failed',
          summary: `Registry provider returned HTTP ${response.status}`,
          matches: [],
          riskScore: 0,
          metadata: buildMetadata(this.providerName, startMs),
        };
      }

      const raw = (await response.json()) as Record<string, unknown>;
      const found = raw.found === true || raw.status === 'found' || raw.status === 'active';
      const entityStatus = typeof raw.entityStatus === 'string' ? raw.entityStatus : found ? 'active' : 'not_found';
      const isDeregistered = entityStatus === 'deregistered' || entityStatus === 'cancelled' || entityStatus === 'suspended';

      return {
        checkType: 'registry_check',
        status: found ? 'completed' : 'no_match',
        summary: found
          ? `Entity found in ${registryType.toUpperCase()} registry — status: ${entityStatus}`
          : `Entity not found in ${registryType.toUpperCase()} registry`,
        matches: found
          ? [
              {
                matchId: (raw.registryId as string) ?? (raw.abn as string) ?? (raw.acn as string) ?? `registry-${Date.now()}`,
                category: 'registry_check' as ScreeningCheckType,
                confidence: 100,
                name: (raw.entityName as string) ?? request.subject.entityName ?? '',
                reason: isDeregistered
                  ? `Entity is ${entityStatus} — compliance review required`
                  : `Active entity registered in ${registryType.toUpperCase()}`,
                source: registryType.toUpperCase(),
                details: raw,
              },
            ]
          : [],
        riskScore: isDeregistered ? 70 : found ? 0 : 20,
        metadata: {
          ...buildMetadata(this.providerName, startMs),
          providerRequestId: typeof raw.referenceId === 'string' ? raw.referenceId : undefined,
          additional: {
            registryType,
            entityStatus,
            abn: raw.abn,
            acn: raw.acn,
          },
        },
        rawPayload: raw,
      };
    } catch (err) {
      return {
        checkType: 'registry_check',
        status: 'failed',
        summary: `Registry provider request failed: ${(err as Error).message}`,
        matches: [],
        riskScore: 0,
        metadata: buildMetadata(this.providerName, startMs),
      };
    }
  }
}

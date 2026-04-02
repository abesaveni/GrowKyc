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
    summary: `${providerName} not configured — returning clear result. Configure IDV_API_URL to enable.`,
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

export class RealIdvAdapter implements ScreeningProviderAdapter {
  readonly providerName = 'idv_provider';
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
    const apiUrl = getRuntimeEnvVar('IDV_API_URL');
    const apiKey = getRuntimeEnvVar('IDV_API_KEY');

    if (!apiUrl || !apiKey) {
      return notConfiguredResult('id_verification', this.providerName, startMs);
    }

    try {
      const response = await fetch(`${apiUrl}/identity/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'X-Correlation-Id': request.correlationId,
        },
        body: JSON.stringify({
          referenceId: request.correlationId,
          fullName: request.subject.fullName ?? '',
          dateOfBirth: request.subject.dateOfBirth,
          countryCode: request.subject.countryCode,
          documentType: request.documentType,
          documentNumber: request.documentNumber,
        }),
      });

      if (!response.ok) {
        return {
          checkType: 'id_verification',
          status: 'failed',
          summary: `IDV provider returned HTTP ${response.status}`,
          matches: [],
          riskScore: 0,
          metadata: buildMetadata(this.providerName, startMs),
        };
      }

      const raw = (await response.json()) as Record<string, unknown>;
      const verified = raw.verified === true || raw.status === 'verified';
      const confidence = typeof raw.confidence === 'number' ? raw.confidence : verified ? 95 : 0;

      return {
        checkType: 'id_verification',
        status: verified ? 'completed' : 'partial_match',
        summary: verified
          ? 'Identity successfully verified'
          : 'Identity verification inconclusive — manual review required',
        matches: verified
          ? [
              {
                matchId: (raw.verificationId as string) ?? `idv-${Date.now()}`,
                category: 'id_verification' as ScreeningCheckType,
                confidence,
                name: request.subject.fullName ?? '',
                reason: 'Identity document verified',
                source: this.providerName,
                details: raw,
              },
            ]
          : [],
        riskScore: verified ? 0 : 40,
        metadata: {
          ...buildMetadata(this.providerName, startMs),
          providerRequestId: typeof raw.referenceId === 'string' ? raw.referenceId : undefined,
          providerReferenceId: typeof raw.verificationId === 'string' ? raw.verificationId : undefined,
        },
        rawPayload: raw,
      };
    } catch (err) {
      return {
        checkType: 'id_verification',
        status: 'failed',
        summary: `IDV provider request failed: ${(err as Error).message}`,
        matches: [],
        riskScore: 0,
        metadata: buildMetadata(this.providerName, startMs),
      };
    }
  }

  async checkRegistry(request: RegistryCheckRequest): Promise<ProviderScreeningRawResult> {
    const startMs = Date.now();
    return notConfiguredResult('registry_check', this.providerName, startMs);
  }
}

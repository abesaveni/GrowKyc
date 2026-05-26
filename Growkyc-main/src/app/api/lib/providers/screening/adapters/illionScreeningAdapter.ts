import { ScreeningProviderAdapter } from '../interfaces';
import {
  AdverseMediaRequest,
  IdVerificationRequest,
  PepScreeningRequest,
  ProviderScreeningRawResult,
  RegistryCheckRequest,
  SanctionsScreeningRequest,
  ScreeningCheckType,
  ProviderStatus,
} from '../types';
import { ProviderAdapterError } from '../errors';

export class IllionScreeningAdapter implements ScreeningProviderAdapter {
  readonly providerName = 'illion';
  readonly supportedChecks: ScreeningCheckType[] = [
    'id_verification',
    'registry_check',
  ];

  private async makeApiRequest(endpoint: string, payload: unknown, checkType: ScreeningCheckType): Promise<ProviderScreeningRawResult> {
    const apiKey = process.env.ILLION_API_KEY;
    const baseUrl = process.env.ILLION_BASE_URL;

    if (!apiKey || !baseUrl) {
      throw new ProviderAdapterError(
        'Illion credentials not configured',
        'provider_not_configured',
        this.providerName,
        false,
        503
      );
    }

    const requestTime = new Date().toISOString();
    let responseTime = requestTime;
    let status: ProviderStatus = 'failed';
    let data: any = null;
    let latencyMs = 0;

    const startTime = Date.now();
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(payload),
      });

      responseTime = new Date().toISOString();
      latencyMs = Date.now() - startTime;

      if (!response.ok) {
        if (response.status === 429) {
          throw new ProviderAdapterError('Rate limited by Illion', 'provider_rate_limited', this.providerName, true, 429);
        }
        throw new ProviderAdapterError(`API Error: ${response.statusText}`, 'provider_bad_request', this.providerName, false, response.status);
      }

      data = await response.json();
      
      if (checkType === 'id_verification') {
        status = data.verified ? 'completed' : 'no_match';
      } else if (checkType === 'registry_check') {
        status = data.registered ? 'completed' : 'no_match';
      } else {
        status = data.matches && data.matches.length > 0 ? 'partial_match' : 'no_match';
      }

      return {
        checkType,
        status,
        summary: data.summary || `Illion ${checkType} completed`,
        matches: data.matches || [],
        metadata: {
          providerName: this.providerName,
          requestTimestamp: requestTime,
          responseTimestamp: responseTime,
          latencyMs,
          providerRequestId: data.referenceId,
        },
        rawPayload: data,
      };
    } catch (error) {
      if (error instanceof ProviderAdapterError) {
        throw error;
      }
      
      throw new ProviderAdapterError(
        `Failed to execute ${checkType} via Illion`,
        'provider_internal_error',
        this.providerName,
        true,
        500,
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  async screenSanctions(_request: SanctionsScreeningRequest): Promise<ProviderScreeningRawResult> {
    throw new ProviderAdapterError(
      `${this.providerName} is not configured for sanctions_screening`,
      'provider_not_configured',
      this.providerName,
      false,
      503
    );
  }

  async screenPep(_request: PepScreeningRequest): Promise<ProviderScreeningRawResult> {
    throw new ProviderAdapterError(
      `${this.providerName} is not configured for pep_screening`,
      'provider_not_configured',
      this.providerName,
      false,
      503
    );
  }

  async screenAdverseMedia(_request: AdverseMediaRequest): Promise<ProviderScreeningRawResult> {
    throw new ProviderAdapterError(
      `${this.providerName} is not configured for adverse_media`,
      'provider_not_configured',
      this.providerName,
      false,
      503
    );
  }

  async verifyIdentity(request: IdVerificationRequest): Promise<ProviderScreeningRawResult> {
    return this.makeApiRequest('/api/v2/identity/verify', request, 'id_verification');
  }

  async checkRegistry(request: RegistryCheckRequest): Promise<ProviderScreeningRawResult> {
    return this.makeApiRequest('/api/v2/registry/check', request, 'registry_check');
  }
}

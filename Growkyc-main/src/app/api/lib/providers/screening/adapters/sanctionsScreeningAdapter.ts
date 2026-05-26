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

export class SanctionsScreeningAdapter implements ScreeningProviderAdapter {
  readonly providerName = 'sanctions_dfat_un';
  readonly supportedChecks: ScreeningCheckType[] = [
    'sanctions_screening',
  ];

  private normalizeName(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  }

  private isMatch(targetName: string, watchlistName: string): boolean {
    const normalizedTarget = this.normalizeName(targetName);
    const normalizedWatchlist = this.normalizeName(watchlistName);
    // Exact match or contains
    return normalizedWatchlist.includes(normalizedTarget) || normalizedTarget.includes(normalizedWatchlist);
  }

  async screenSanctions(request: SanctionsScreeningRequest): Promise<ProviderScreeningRawResult> {
    const baseUrl = process.env.SANCTIONS_API_BASE_URL;

    if (!baseUrl) {
      throw new ProviderAdapterError(
        'Sanctions API base URL not configured',
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
      const response = await fetch(`${baseUrl}/v1/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.SANCTIONS_API_KEY && { 'Authorization': `Bearer ${process.env.SANCTIONS_API_KEY}` })
        },
        body: JSON.stringify({
          name: request.subject.fullName || request.subject.entityName,
          type: request.subject.type,
          country: request.subject.countryCode,
          watchlists: request.watchlists || ['dfat', 'un']
        }),
      });

      responseTime = new Date().toISOString();
      latencyMs = Date.now() - startTime;

      if (!response.ok) {
        if (response.status === 429) {
          throw new ProviderAdapterError('Rate limited by Sanctions API', 'provider_rate_limited', this.providerName, true, 429);
        }
        throw new ProviderAdapterError(`API Error: ${response.statusText}`, 'provider_bad_request', this.providerName, false, response.status);
      }

      data = await response.json();
      
      const matches = data.results || [];
      const isExactMatch = matches.some((match: any) => 
        this.normalizeName(match.name) === this.normalizeName(request.subject.fullName || request.subject.entityName || '')
      );

      if (matches.length > 0) {
        status = isExactMatch ? 'completed' : 'partial_match';
      } else {
        status = 'no_match';
      }

      return {
        checkType: 'sanctions_screening',
        status,
        summary: data.summary || `Sanctions check returned ${matches.length} matches`,
        matches: matches.map((m: any) => ({
          matchId: m.id || Math.random().toString(36).substring(7),
          category: 'sanctions_screening',
          confidence: m.score || (isExactMatch ? 1.0 : 0.8),
          name: m.name,
          reason: m.reason || 'Found on watchlist',
          source: m.list || 'dfat/un',
        })),
        metadata: {
          providerName: this.providerName,
          requestTimestamp: requestTime,
          responseTimestamp: responseTime,
          latencyMs,
          providerRequestId: data.searchId,
        },
        rawPayload: data,
      };
    } catch (error) {
      if (error instanceof ProviderAdapterError) {
        throw error;
      }
      
      throw new ProviderAdapterError(
        `Failed to execute sanctions screening`,
        'provider_internal_error',
        this.providerName,
        true,
        500,
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
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

  async verifyIdentity(_request: IdVerificationRequest): Promise<ProviderScreeningRawResult> {
    throw new ProviderAdapterError(
      `${this.providerName} is not configured for id_verification`,
      'provider_not_configured',
      this.providerName,
      false,
      503
    );
  }

  async checkRegistry(_request: RegistryCheckRequest): Promise<ProviderScreeningRawResult> {
    throw new ProviderAdapterError(
      `${this.providerName} is not configured for registry_check`,
      'provider_not_configured',
      this.providerName,
      false,
      503
    );
  }
}

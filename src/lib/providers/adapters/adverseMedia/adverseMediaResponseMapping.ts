import type { ProviderRequest } from '../../contracts/providerRequest';
import type { ProviderResponse } from '../../contracts/providerResponse';
import type { NormalizedProviderResult } from '../../models/normalizedProviderResult';
import type { ProviderMetadata } from '../../models/providerMetadata';
import type {
  AdverseMediaNormalizedData,
  AdverseMediaProviderRawResponse,
  AdverseMediaScreeningRequestPayload,
} from './adverseMediaTypes';

export interface MapAdverseMediaResponseInput {
  request: ProviderRequest<AdverseMediaScreeningRequestPayload>;
  rawResponse: AdverseMediaProviderRawResponse;
  providerMetadata: ProviderMetadata;
  startedAtMs: number;
}

export function mapAdverseMediaResponse(
  input: MapAdverseMediaResponseInput
): NormalizedProviderResult<AdverseMediaNormalizedData, AdverseMediaProviderRawResponse> {
  const durationMs = Math.max(Date.now() - input.startedAtMs, 0);

  const response: ProviderResponse<AdverseMediaProviderRawResponse> = {
    requestId: input.request.requestId,
    operation: input.request.operation,
    receivedAt: new Date().toISOString(),
    durationMs,
    raw: input.rawResponse,
  };

  const data: AdverseMediaNormalizedData = {
    referenceId: input.rawResponse.referenceId,
    screeningStatus: input.rawResponse.screeningStatus,
    articlesFound: input.rawResponse.articlesFound,
    hasNegativeContent:
      input.rawResponse.screeningStatus === 'found' ||
      input.rawResponse.screeningStatus === 'requires_review',
    riskAssessment: input.rawResponse.riskAssessment ?? 'unknown',
    articles: input.rawResponse.articles.map((article) => ({
      sourceUrl: article.sourceUrl,
      sourceTitle: article.sourceTitle,
      headline: article.headline,
      publishDate: article.publishDate,
      relevanceScore: article.relevanceScore,
      category: article.category,
    })),
  };

  const hasErrorStatus = input.rawResponse.screeningStatus === 'error';

  return {
    ok: !hasErrorStatus,
    provider: input.providerMetadata,
    status: hasErrorStatus ? 'degraded' : input.providerMetadata.status,
    response,
    data,
  };
}

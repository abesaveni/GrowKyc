export interface AdverseMediaScreeningRequestPayload {
  fullName: string;
  aliases?: string[];
  companyName?: string;
  countryCode?: string;
}

export interface AdverseMediaProviderRequest {
  referenceId: string;
  name: string;
  aliases: string[];
  companyName?: string;
  countryCode?: string;
  traceId?: string;
}

export type AdverseMediaScreeningStatus = 'clear' | 'found' | 'requires_review' | 'error';

export interface AdverseMediaProviderRawArticle {
  sourceUrl: string;
  sourceTitle: string;
  headline: string;
  publishDate: string;
  relevanceScore: number;
  category?: string;
}

export interface AdverseMediaProviderRawResponse {
  referenceId: string;
  screeningStatus: AdverseMediaScreeningStatus;
  articlesFound: number;
  articles: AdverseMediaProviderRawArticle[];
  riskAssessment?: string;
  providerMetadata?: Record<string, unknown>;
}

export interface AdverseMediaNormalizedArticle {
  sourceUrl: string;
  sourceTitle: string;
  headline: string;
  publishDate: string;
  relevanceScore: number;
  category?: string;
}

export interface AdverseMediaNormalizedData {
  referenceId: string;
  screeningStatus: AdverseMediaScreeningStatus;
  articlesFound: number;
  hasNegativeContent: boolean;
  riskAssessment: string;
  articles: AdverseMediaNormalizedArticle[];
}

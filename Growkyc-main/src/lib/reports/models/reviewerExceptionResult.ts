export type ReviewerExceptionReasonCode =
  | 'open_review_issue'
  | 'unresolved_severe_finding'
  | 'rejected_item'
  | 'escalated_item';

export interface ReviewerExceptionItem {
  item_id: string;
  tenant_id: string;
  case_id?: string;
  review_status?: string;
  finding_status?: string;
  severity?: string;
  decision?: string;
  outcome?: string;
  is_resolved?: boolean;
  is_escalated?: boolean;
  is_rejected?: boolean;
  source_type?: string;
  metadata?: Record<string, unknown>;
}

export interface ReviewerExceptionEntry {
  item_id: string;
  tenant_id: string;
  case_id?: string;
  reason_code: ReviewerExceptionReasonCode;
  reason_detail: string;
  severity?: string;
  source_type?: string;
}

export interface ReviewerExceptionReportInput {
  tenant_id: string;
  review_items: ReviewerExceptionItem[];
  is_tenant_item?: (item: ReviewerExceptionItem, tenant_id: string) => boolean;
}

export interface ReviewerExceptionResult {
  tenant_id: string;
  generated_at: string;
  total_exceptions: number;
  reason_counts: Record<ReviewerExceptionReasonCode, number>;
  exceptions: ReviewerExceptionEntry[];
}
export interface FirmRiskRecord {
  item_id: string;
  tenant_id: string;
  case_id?: string;
  risk_level?: string;
  review_status?: string;
  review_due_at?: string;
  document_status?: string;
  document_expiry_at?: string;
  metadata?: Record<string, unknown>;
}

export interface FirmCaseRiskSummary {
  case_id: string;
  total_items: number;
  high_risk_count: number;
  overdue_review_count: number;
  expiring_document_count: number;
}

export interface FirmRiskSummaryInput {
  tenant_id: string;
  risk_records: FirmRiskRecord[];
  now?: string;
  expiring_within_days?: number;
  is_tenant_record?: (record: FirmRiskRecord, tenant_id: string) => boolean;
}

export interface FirmRiskSummaryResult {
  tenant_id: string;
  generated_at: string;
  total_cases: number;
  total_records: number;
  high_risk_count: number;
  overdue_review_count: number;
  expiring_document_count: number;
  case_summaries: FirmCaseRiskSummary[];
}
// Comprehensive Workpaper Architecture Type Definitions

export type WorkpaperType = 
  | 'grid'
  | 'lead_schedule'
  | 'structured_form'
  | 'checklist'
  | 'journal_register'
  | 'evidence'
  | 'narrative';

export type WorkpaperStatus = 
  | 'draft'
  | 'in_progress'
  | 'in_review'
  | 'approved'
  | 'sealed';

export type RiskLevel = 'high' | 'medium' | 'low';
export type MaterialityLevel = 'material' | 'normal' | 'immaterial';

export type EntityType = 
  | 'company'
  | 'trust'
  | 'smsf'
  | 'individual'
  | 'audit';

export type JournalType = 'adjusted' | 'unadjusted' | 'reclassification';
export type JournalStatus = 'draft' | 'approved' | 'posted';

// Base Workpaper Interface
export interface BaseWorkpaper {
  workpaper_id: string;
  binder_id: string;
  type: WorkpaperType;
  section: string;
  name: string;
  preparer: string;
  reviewer?: string;
  status: WorkpaperStatus;
  risk_score: number;
  materiality: MaterialityLevel;
  ai_flags: string[];
  last_updated: string;
  version: number;
  sealed: boolean;
  
  // Roll Forward Logic
  carry_forward_structure: boolean;
  carry_forward_balances: boolean;
  carry_forward_open_items: boolean;
  carry_forward_unadjusted: boolean;
  
  // AI Metadata Layer
  ai_confidence_score: number;
  ai_reviewed: boolean;
  ai_override_reason?: string;
  anomaly_flags: string[];
  compliance_flags: string[];
}

// 1. Grid Workpaper (Spreadsheet)
export interface GridWorkpaper extends BaseWorkpaper {
  type: 'grid';
  sheet_id: string;
  named_ranges: NamedRange[];
  tb_links: TBLink[];
  formula_cells: FormulaCell[];
  evidence_links: string[];
  review_notes: ReviewNote[];
  locked_ranges: CellRange[];
  materiality_override?: number;
}

export interface NamedRange {
  name: string;
  range: string;
  description?: string;
}

export interface TBLink {
  cell: string;
  account_id: string;
  account_name: string;
  balance_type: 'debit' | 'credit' | 'balance';
  auto_update: boolean;
}

export interface FormulaCell {
  cell: string;
  formula: string;
  dependencies: string[];
}

export interface CellRange {
  start: string;
  end: string;
  locked_by?: string;
  locked_at?: string;
}

// 2. Lead Schedule (TB-Controlled)
export interface LeadScheduleWorkpaper extends BaseWorkpaper {
  type: 'lead_schedule';
  account_ids: string[];
  tb_balance: number;
  adjusted_balance: number;
  variance_prior_year: number;
  materiality_flag: boolean;
  risk_rating: RiskLevel;
  sheet_id: string;
  tb_links: TBLink[];
  supporting_schedules: string[]; // IDs of linked schedules
  reconciliation_items: ReconciliationItem[];
}

export interface ReconciliationItem {
  id: string;
  description: string;
  amount: number;
  type: 'adjustment' | 'timing' | 'permanent';
  status: 'open' | 'resolved';
  evidence_id?: string;
}

// 3. Structured Form Workpaper
export interface StructuredFormWorkpaper extends BaseWorkpaper {
  type: 'structured_form';
  form_schema: FormSchema;
  calculated_fields: CalculatedField[];
  required_fields: string[];
  validation_rules: ValidationRule[];
  auto_calc_functions: AutoCalcFunction[];
  export_map: ExportMapping[];
  form_data: Record<string, any>;
}

export interface FormSchema {
  title: string;
  form_type: 'division_7a' | 'trust_distribution' | 'cgt' | 'fbt' | 'depreciation' | 'bas' | 'tax_reconciliation' | 'custom';
  sections: FormSection[];
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'date' | 'select' | 'checkbox' | 'calculated';
  required: boolean;
  validation?: string;
  help_text?: string;
  default_value?: any;
}

export interface CalculatedField {
  field_id: string;
  formula: string;
  dependencies: string[];
}

export interface ValidationRule {
  field_id: string;
  rule: string;
  message: string;
}

export interface AutoCalcFunction {
  field_id: string;
  function_name: string;
  parameters: Record<string, any>;
}

export interface ExportMapping {
  field_id: string;
  tax_return_field: string;
  transform?: string;
}

// 4. Checklist / Program Workpaper
export interface ChecklistWorkpaper extends BaseWorkpaper {
  type: 'checklist';
  checklist_items: ChecklistItem[];
  signoff_required: boolean;
  manager_approval_gate: boolean;
}

export interface ChecklistItem {
  id: string;
  description: string;
  required: boolean;
  status: 'not_started' | 'in_progress' | 'complete' | 'n/a';
  completed_by?: string;
  completed_at?: string;
  linked_evidence: string[];
  signoff_required: boolean;
  conditional_logic?: ConditionalLogic;
  escalation_rule?: EscalationRule;
  review_notes?: string;
}

export interface ConditionalLogic {
  depends_on: string; // ID of another checklist item
  condition: 'complete' | 'not_complete' | 'n/a';
  action: 'show' | 'hide' | 'require';
}

export interface EscalationRule {
  days_overdue: number;
  escalate_to: string;
  notification_type: 'email' | 'in_app' | 'both';
}

// 5. Journal Register Workpaper
export interface JournalRegisterWorkpaper extends BaseWorkpaper {
  type: 'journal_register';
  journals: Journal[];
  auto_generate_summary: boolean;
}

export interface Journal {
  journal_id: string;
  type: JournalType;
  status: JournalStatus;
  description: string;
  lines: JournalLine[];
  impact_accounts: string[];
  posted_to_ledger: boolean;
  created_by: string;
  created_at: string;
  approved_by?: string;
  approved_at?: string;
  posted_at?: string;
  evidence_ids: string[];
  review_notes?: string;
}

export interface JournalLine {
  line_id: string;
  account_id: string;
  account_name: string;
  debit: number;
  credit: number;
  tax_code?: string;
  description?: string;
}

// 6. Evidence Workpaper
export interface EvidenceWorkpaper extends BaseWorkpaper {
  type: 'evidence';
  files: EvidenceFile[];
}

export interface EvidenceFile {
  file_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  extracted_text?: string;
  linked_cells: CellReference[];
  linked_checklist_items: string[];
  risk_tags: string[];
  uploaded_by: string;
  uploaded_at: string;
  version: number;
  ai_classification?: string;
  ocr_processed: boolean;
  auto_link_suggestions: AutoLinkSuggestion[];
}

export interface CellReference {
  workpaper_id: string;
  cell: string;
  description?: string;
}

export interface AutoLinkSuggestion {
  target_type: 'workpaper' | 'checklist' | 'account';
  target_id: string;
  confidence: number;
  reason: string;
}

// 7. Narrative / Memo Workpaper
export interface NarrativeWorkpaper extends BaseWorkpaper {
  type: 'narrative';
  narrative_type: 'policy_memo' | 'impairment' | 'going_concern' | 'tax_position' | 'advisory' | 'custom';
  rich_text_body: string;
  ai_draft_version?: string;
  citations: Citation[];
  linked_accounts: string[];
  reviewer_comments: ReviewerComment[];
  version_history: NarrativeVersion[];
  locked_on_signoff: boolean;
}

export interface Citation {
  id: string;
  reference: string;
  source: string;
  url?: string;
  page?: string;
}

export interface ReviewerComment {
  id: string;
  commenter: string;
  comment: string;
  timestamp: string;
  resolved: boolean;
  position?: number; // character position in text
}

export interface NarrativeVersion {
  version: number;
  content: string;
  modified_by: string;
  modified_at: string;
  change_summary?: string;
}

export interface ReviewNote {
  id: string;
  cell?: string;
  note: string;
  author: string;
  created_at: string;
  resolved: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Binder Structure
export interface Binder {
  binder_id: string;
  client_id: string;
  client_name: string;
  entity_type: EntityType;
  year: string;
  status: WorkpaperStatus;
  sections: BinderSection[];
  created_by: string;
  created_at: string;
  last_updated: string;
  locked: boolean;
  rolled_forward_from?: string; // Previous binder ID
}

export interface BinderSection {
  section_id: string;
  name: string;
  order: number;
  workpapers: BaseWorkpaper[];
  auto_generated: boolean;
}

// Industry-Specific Binder Templates
export interface BinderTemplate {
  template_id: string;
  name: string;
  entity_type: EntityType;
  sections: BinderSectionTemplate[];
}

export interface BinderSectionTemplate {
  name: string;
  order: number;
  workpaper_templates: WorkpaperTemplate[];
}

export interface WorkpaperTemplate {
  name: string;
  type: WorkpaperType;
  required: boolean;
  auto_generate: boolean;
  template_config: Record<string, any>;
}

// Company Pack Templates
export const COMPANY_PACK_SECTIONS = [
  'Trial Balance & Lead Schedules',
  'Revenue',
  'Cost of Goods Sold',
  'Payroll & Superannuation',
  'Division 7A',
  'Loan Accounts',
  'Capital Gains Tax',
  'BAS Reconciliation',
  'Tax Reconciliation',
  'Financial Statements',
  'Tax Return'
];

// Trust Pack Templates
export const TRUST_PACK_SECTIONS = [
  'Trial Balance & Lead Schedules',
  'Trust Income Reconciliation',
  'Distribution Minutes',
  'Present Entitlement',
  'UPE Tracking',
  'Division 7A Overlay',
  'Beneficiary Schedule',
  'Financial Statements',
  'Tax Return'
];

// SMSF Pack Templates
export const SMSF_PACK_SECTIONS = [
  'Trial Balance & Lead Schedules',
  'Member Balances',
  'Contribution Caps',
  'Investment Valuation',
  'Related Party Loans',
  'ECPI Calculation',
  'Compliance Tests',
  'Financial Statements',
  'Tax Return',
  'SMSF Annual Return'
];

// Individual Pack Templates
export const INDIVIDUAL_PACK_SECTIONS = [
  'ITR Prefill Data',
  'Income Schedule',
  'Deduction Schedule',
  'Capital Gains Tax',
  'Rental Property',
  'Business Schedule',
  'PSI Review',
  'Tax Return'
];

// Audit Pack Templates
export const AUDIT_PACK_SECTIONS = [
  'Risk Assessment',
  'Materiality Calculation',
  'Control Testing',
  'Substantive Testing',
  'Analytical Procedures',
  'Subsequent Events',
  'Going Concern',
  'Completion Memo',
  'Audit Opinion'
];

// Union Type for All Workpapers
export type AnyWorkpaper = 
  | GridWorkpaper
  | LeadScheduleWorkpaper
  | StructuredFormWorkpaper
  | ChecklistWorkpaper
  | JournalRegisterWorkpaper
  | EvidenceWorkpaper
  | NarrativeWorkpaper;

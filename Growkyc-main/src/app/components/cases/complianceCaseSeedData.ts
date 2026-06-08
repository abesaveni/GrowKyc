/**
 * Compliance Officer — ARCHIVED seed / demo data (NOT used at runtime)
 * --------------------------------------------------------------------
 * Dummy case lists and workbench fallbacks are kept here for reference only.
 * To restore demo data, re-import exports from this file into complianceCaseUtils.ts
 * or CaseControlCentre.tsx — see git history.
 *
 * Still used at runtime (templates/config only):
 * - COMPLIANCE_USER_DISPLAY, COMPLIANCE_ASSIGNEE_OPTIONS
 * - INFO_REQUEST_TEMPLATES, EDD_CHECKLIST_ITEMS
 * - buildRequiredActionsFromCase, personaIdFromDisplayName, daysSinceDate
 */

type CaseWorkbenchStatus =
  | 'new'
  | 'triage'
  | 'investigating'
  | 'escalated'
  | 'awaiting_decision'
  | 'monitoring'
  | 'closed';

/** Minimal case shape for required-actions builder (avoids circular import with complianceCaseUtils). */
export interface SeedCaseRecord {
  id: string;
  clientId?: string;
  clientName: string;
  clientType: 'individual' | 'company' | 'trust';
  caseType: string;
  triggerSource: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: CaseWorkbenchStatus;
  assignedTo: string;
  created: string;
  lastUpdated: string;
  slaHours: number;
  slaRemaining: number;
  client?: {
    documentsData?: { verified?: number };
    ownershipData?: { ownershipStructureComplete?: boolean };
    financialData?: { sourceOfFunds?: string };
    quickStatus?: { identity?: string };
  };
}

export const COMPLIANCE_USER_DISPLAY: Record<string, string> = {
  sarah_chen: 'Sarah Chen',
  emma_williams: 'Emma Williams',
  jessica_lee: 'Jessica Lee',
  michael_roberts: 'Michael Roberts',
  alex_rivera: 'Alex Rivera',
  david_thompson: 'David Thompson',
};

export const COMPLIANCE_ASSIGNEE_OPTIONS = [
  'Sarah Chen',
  'Emma Williams',
  'Jessica Lee',
  'Michael Chen',
  'Lisa Martinez',
  'Michael Roberts',
  'David Thompson',
];

export const INFO_REQUEST_TEMPLATES: Record<string, { label: string; message: string }> = {
  missing_id: {
    label: 'Missing ID',
    message: 'Please provide certified primary photographic identification (passport or national ID).',
  },
  expired_id: {
    label: 'Expired ID',
    message: 'Your identification document has expired. Please upload a current certified copy.',
  },
  source_of_funds: {
    label: 'Source Of Funds',
    message: 'Please provide bank statements or audited accounts confirming the source of funds for recent transactions.',
  },
  source_of_wealth: {
    label: 'Source Of Wealth',
    message: 'Please provide documentation evidencing source of wealth (tax returns, asset statements, or sale contracts).',
  },
  trust_deed: {
    label: 'Trust Deed',
    message: 'Please provide the executed trust deed and schedule of beneficiaries.',
  },
  bank_statement: {
    label: 'Bank Statement',
    message: 'Please provide the last 3 months of bank statements for all operating accounts.',
  },
  asic_clarification: {
    label: 'ASIC Clarification',
    message: 'Please clarify recent ASIC registry changes including director appointments or share issues.',
  },
  beneficial_ownership: {
    label: 'Beneficial Ownership Clarification',
    message: 'Please provide an ownership chart identifying all ultimate beneficial owners holding 25% or more.',
  },
};

export const EDD_CHECKLIST_ITEMS = [
  'Source Of Funds',
  'Source Of Wealth',
  'Beneficial Ownership',
  'Business Activity',
  'Transaction Purpose',
  'Adverse Media Review',
  'PEP Review',
  'Sanctions Review',
  'Senior Reviewer Notes',
  'Final Decision',
] as const;

/** Demo cases — use canonical caseType labels that map to control-centre filters. */
export interface StaticComplianceCaseSeed {
  id: string;
  clientId?: string;
  clientName: string;
  clientType: 'individual' | 'company' | 'trust';
  caseType: string;
  triggerSource: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: CaseWorkbenchStatus;
  assignedTo: string;
  created: string;
  lastUpdated: string;
  slaHours: number;
  slaRemaining: number;
}

export const STATIC_COMPLIANCE_CASE_SEEDS: StaticComplianceCaseSeed[] = [
  {
    id: 'CASE-2026-001',
    clientId: '8',
    clientName: 'Pacific Trading Co Pty Ltd',
    clientType: 'company',
    caseType: 'Sanctions Match',
    triggerSource: 'Sanctions Screening Bot',
    riskLevel: 'critical',
    status: 'investigating',
    assignedTo: 'Sarah Chen',
    created: '2026-03-20',
    lastUpdated: '2026-03-21 10:30',
    slaHours: 24,
    slaRemaining: 8,
  },
  {
    id: 'CASE-2026-002',
    clientId: '5',
    clientName: 'Sarah Williams',
    clientType: 'individual',
    caseType: 'PEP Match',
    triggerSource: 'PEP Screening Bot',
    riskLevel: 'high',
    status: 'escalated',
    assignedTo: 'Emma Williams',
    created: '2026-03-19',
    lastUpdated: '2026-03-21 09:15',
    slaHours: 48,
    slaRemaining: 32,
  },
  {
    id: 'CASE-2026-003',
    clientId: '5',
    clientName: 'Sarah Williams',
    clientType: 'individual',
    caseType: 'Adverse Media',
    triggerSource: 'Adverse Media Bot',
    riskLevel: 'medium',
    status: 'triage',
    assignedTo: 'Jessica Lee',
    created: '2026-03-21',
    lastUpdated: '2026-03-21 08:00',
    slaHours: 72,
    slaRemaining: 68,
  },
  {
    id: 'CASE-2026-004',
    clientId: '11',
    clientName: 'David Robertson',
    clientType: 'individual',
    caseType: 'EDD / Source of Funds',
    triggerSource: 'Source of Funds Bot',
    riskLevel: 'high',
    status: 'awaiting_decision',
    assignedTo: 'Sarah Chen',
    created: '2026-03-18',
    lastUpdated: '2026-03-20 16:45',
    slaHours: 48,
    slaRemaining: 18,
  },
  {
    id: 'CASE-2026-005',
    clientId: '7',
    clientName: 'Sunrise Development Trust',
    clientType: 'trust',
    caseType: 'Ownership Issue',
    triggerSource: 'Ownership Structure Bot',
    riskLevel: 'medium',
    status: 'investigating',
    assignedTo: 'Emma Williams',
    created: '2026-03-17',
    lastUpdated: '2026-03-20 14:20',
    slaHours: 72,
    slaRemaining: 56,
  },
  {
    id: 'CASE-2026-006',
    clientId: '8',
    clientName: 'Pacific Trading Co Pty Ltd',
    clientType: 'company',
    caseType: 'AML Alert',
    triggerSource: 'AML Monitoring',
    riskLevel: 'critical',
    status: 'new',
    assignedTo: 'Unassigned',
    created: '2026-03-21',
    lastUpdated: '2026-03-21 11:00',
    slaHours: 24,
    slaRemaining: 24,
  },
  {
    id: 'CASE-2026-007',
    clientId: '11',
    clientName: 'David Robertson',
    clientType: 'individual',
    caseType: 'Fraud / Identity',
    triggerSource: 'Identity Verification Bot',
    riskLevel: 'high',
    status: 'investigating',
    assignedTo: 'Jessica Lee',
    created: '2026-03-19',
    lastUpdated: '2026-03-20 11:30',
    slaHours: 48,
    slaRemaining: 2,
  },
  {
    id: 'CASE-2026-008',
    clientId: '4',
    clientName: 'Global Investments Pty Ltd',
    clientType: 'company',
    caseType: 'Legal / Court',
    triggerSource: 'Court & Litigation Bot',
    riskLevel: 'medium',
    status: 'monitoring',
    assignedTo: 'Sarah Chen',
    created: '2026-03-15',
    lastUpdated: '2026-03-19 15:00',
    slaHours: 72,
    slaRemaining: 42,
  },
];

/** Non–compliance-officer Case Control Centre row format (legacy demo path). */
export const STATIC_CASE_CONTROL_CENTRE_CASES = [
  { id: 'CASE-2026-001', clientName: 'Pacific Trading Co Pty Ltd', clientType: 'company' as const, caseType: 'sanctions' as const, triggerSource: 'Sanctions Screening Bot', riskLevel: 'critical' as const, status: 'investigating' as const, assignedTo: 'Sarah Chen', lastUpdated: '2026-03-21 10:30', slaHours: 24, slaRemaining: 8 },
  { id: 'CASE-2026-002', clientName: 'Sarah Williams', clientType: 'individual' as const, caseType: 'pep' as const, triggerSource: 'PEP Screening Bot', riskLevel: 'high' as const, status: 'escalated' as const, assignedTo: 'Emma Williams', lastUpdated: '2026-03-21 09:15', slaHours: 48, slaRemaining: 32 },
  { id: 'CASE-2026-003', clientName: 'Sarah Williams', clientType: 'individual' as const, caseType: 'adverse_media' as const, triggerSource: 'Adverse Media Bot', riskLevel: 'medium' as const, status: 'triage' as const, assignedTo: 'Jessica Lee', lastUpdated: '2026-03-21 08:00', slaHours: 72, slaRemaining: 68 },
  { id: 'CASE-2026-004', clientName: 'David Robertson', clientType: 'individual' as const, caseType: 'sof' as const, triggerSource: 'Source of Funds Bot', riskLevel: 'high' as const, status: 'awaiting_decision' as const, assignedTo: 'Sarah Chen', lastUpdated: '2026-03-20 16:45', slaHours: 48, slaRemaining: 18 },
  { id: 'CASE-2026-005', clientName: 'Sunrise Development Trust', clientType: 'trust' as const, caseType: 'ownership' as const, triggerSource: 'Ownership Structure Bot', riskLevel: 'medium' as const, status: 'investigating' as const, assignedTo: 'Emma Williams', lastUpdated: '2026-03-20 14:20', slaHours: 72, slaRemaining: 56 },
  { id: 'CASE-2026-006', clientName: 'Pacific Trading Co Pty Ltd', clientType: 'company' as const, caseType: 'aml_alert' as const, triggerSource: 'AML Monitoring', riskLevel: 'critical' as const, status: 'new' as const, assignedTo: 'Unassigned', lastUpdated: '2026-03-21 11:00', slaHours: 24, slaRemaining: 24 },
  { id: 'CASE-2026-007', clientName: 'David Robertson', clientType: 'individual' as const, caseType: 'fraud' as const, triggerSource: 'Identity Verification Bot', riskLevel: 'high' as const, status: 'investigating' as const, assignedTo: 'Jessica Lee', lastUpdated: '2026-03-20 11:30', slaHours: 48, slaRemaining: 2 },
  { id: 'CASE-2026-008', clientName: 'Global Investments Pty Ltd', clientType: 'company' as const, caseType: 'legal' as const, triggerSource: 'Court & Litigation Bot', riskLevel: 'medium' as const, status: 'monitoring' as const, assignedTo: 'Sarah Chen', lastUpdated: '2026-03-19 15:00', slaHours: 72, slaRemaining: 42 },
];

export const WORKBENCH_STATIC_FALLBACK_CASE = {
  id: 'CASE-2026-001',
  clientName: 'Pacific Trading Co Pty Ltd',
  clientType: 'Company',
  caseType: 'Sanctions Match',
  riskLevel: 'Critical',
  status: 'Investigating',
  assignedTo: 'Sarah Chen',
  created: '2026-03-20 14:30',
  slaRemaining: '8 hours',
  triggerSource: 'Sanctions Screening Bot',
};

export const WORKBENCH_DEFAULT_TRIGGERS = [
  { id: 'T1', source: 'Sanctions Screening Bot', reason: 'Director matched to DFAT consolidated list', severity: 'critical', confidence: 94, timestamp: '2026-03-20 14:31' },
  { id: 'T2', source: 'Adverse Media Bot', reason: 'Severe adverse media — money laundering investigation', severity: 'high', confidence: 82, timestamp: '2026-03-20 14:35' },
  { id: 'T3', source: 'Source of Funds Bot', reason: 'Unexplained capital injection flagged', severity: 'medium', confidence: 67, timestamp: '2026-03-19 10:15' },
];

export const WORKBENCH_DEFAULT_EVIDENCE = [
  { type: 'Sanctions Match', title: 'DFAT List — Director Match', provider: 'ComplyAdvantage', confidence: 94 },
  { type: 'Adverse Media', title: 'Regulatory Action Article', provider: 'ComplyAdvantage', confidence: 82 },
  { type: 'Source of Funds', title: 'Unexplained Funds Analysis', provider: 'Internal SOF Bot', confidence: 67 },
  { type: 'Document', title: 'Bank Statement — Feb 2026', provider: 'Client Upload', confidence: 100 },
];

export const WORKBENCH_DEFAULT_TIMELINE_EVENTS = [
  { time: '2026-03-20 14:30', user: 'System', action: 'Case created', iconKey: 'target', color: 'blue' },
  { time: '2026-03-20 14:31', user: 'Sanctions Bot', action: 'Sanctions match detected (94% confidence)', iconKey: 'shield', color: 'red' },
  { time: '2026-03-20 15:00', user: 'Sarah Chen', action: 'Case assigned', iconKey: 'user', color: 'blue' },
  { time: '2026-03-21 10:30', user: 'Sarah Chen', action: 'Status updated to Investigating', iconKey: 'activity', color: 'amber' },
];

export const WORKBENCH_MOCK_AUDIT_EVENTS = [
  { actor: 'System', action: 'Case created', timestamp: '2026-03-20T14:30:00Z', type: 'case_created', metadata: { caseType: 'Sanctions Match', riskLevel: 'Critical' } },
  { actor: 'Sanctions Screening Bot', action: 'Sanctions match detected', timestamp: '2026-03-20T14:31:12Z', type: 'screening_alert', metadata: { list: 'DFAT Consolidated List', confidence: '94%' } },
  { actor: 'Sarah Chen', action: 'Opened case and began investigation', timestamp: '2026-03-20T15:05:22Z', type: 'status_change', metadata: { newStatus: 'Investigating' } },
  { actor: 'System', action: 'SLA warning — 75% elapsed', timestamp: '2026-03-21T08:30:00Z', type: 'sla_warning', metadata: { timeRemaining: '8 hours' } },
];

export const WORKBENCH_DEFAULT_NOTES = [
  { id: 'n1', text: 'Reviewed initial sanctions match. Cross-referencing with DFAT records.', author: 'Sarah Chen', timestamp: '2026-03-20T15:15:30Z', isOwnNote: true },
  { id: 'n2', text: 'Awaiting certified passport copy from client.', author: 'Jessica Lee', timestamp: '2026-03-20T16:00:00Z', isOwnNote: false },
];

export const WORKBENCH_DEFAULT_APPROVAL_CHAIN = {
  caseId: 'CASE-2026-001',
  status: 'pending_level_2',
  steps: [
    { step: 1, role: 'L1 Analyst', actor: 'Sarah Chen', status: 'approved', timestamp: '2026-03-21T10:30:00Z', comments: 'Initial checks complete.' },
    { step: 2, role: 'L2 Senior Analyst', actor: 'Jessica Lee', status: 'pending', timestamp: null, comments: null },
    { step: 3, role: 'MLRO', actor: null, status: 'pending', timestamp: null, comments: null },
  ],
};

export const WORKBENCH_DEFAULT_ESCALATIONS = [
  { id: 'esc1', priority: 'High', reason: 'Critical sanctions match requires senior review.', escalatedBy: 'Sarah Chen', escalatedTo: 'Jessica Lee (Senior Analyst)', status: 'Open', timestamp: '2026-03-21T10:30:00Z' },
];

/** Quick stats shown when not in compliance-officer dynamic mode. */
export const CASE_CONTROL_QUICK_STATS_DEMO = {
  avgResolutionDays: '3.2 days',
  closed30Days: 142,
  autoCreatedPct: '89%',
  slaCompliancePct: '96%',
};

export function buildRequiredActionsFromCase(record: SeedCaseRecord) {
  const c = record.client;
  const docsOk = (c?.documentsData?.verified ?? 0) > 0;
  const ownershipOk = c?.ownershipData?.ownershipStructureComplete ?? false;
  const sofNeeded = record.caseType === 'EDD / Source of Funds' || record.caseType === 'sof';
  const escalateNeeded = record.riskLevel === 'high' || record.riskLevel === 'critical';
  const holdNeeded = record.status === 'investigating' || record.status === 'escalated';

  return [
    { id: 1, text: 'Verify identity documents', completed: docsOk || c?.quickStatus?.identity === 'Verified' },
    { id: 2, text: 'Confirm ultimate beneficial ownership', completed: ownershipOk },
    { id: 3, text: 'Request source of funds documentation', completed: !sofNeeded || (c?.financialData?.sourceOfFunds !== 'Under review' && !!c?.financialData?.sourceOfFunds) },
    { id: 4, text: 'Escalate to compliance manager', completed: !escalateNeeded || record.status === 'escalated' },
    { id: 5, text: 'Apply service hold pending review', completed: holdNeeded },
  ];
}

export function personaIdFromDisplayName(displayName: string): string {
  const entry = Object.entries(COMPLIANCE_USER_DISPLAY).find(([, name]) => name === displayName);
  return entry?.[0] || 'sarah_chen';
}

export function daysSinceDate(dateStr: string): number {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return 1;
  return Math.max(1, Math.round((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)));
}

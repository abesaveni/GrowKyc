import { ClientsDB, type TestClient } from '../kyc/ClientsDatabase';
import {
  COMPLIANCE_USER_DISPLAY,
  INFO_REQUEST_TEMPLATES,
  EDD_CHECKLIST_ITEMS,
  personaIdFromDisplayName,
} from './complianceCaseSeedData';

export { INFO_REQUEST_TEMPLATES, EDD_CHECKLIST_ITEMS, personaIdFromDisplayName };

export type CaseWorkbenchStatus =
  | 'new'
  | 'triage'
  | 'investigating'
  | 'escalated'
  | 'awaiting_decision'
  | 'monitoring'
  | 'closed';

export interface ComplianceCaseRecord {
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
  client?: TestClient;
}

export interface ComplianceDashboardMetrics {
  totalClients: number;
  assignedCases: number;
  lowRiskApprovals: number;
  mediumRiskApprovals: number;
  pendingInformationCases: number;
  monitoringAlerts: number;
  escalations: number;
  dueReviews: number;
  slaBreaches: number;
  investigationCases: number;
  eddCases: number;
}

export interface ApprovalBlocker {
  code: string;
  message: string;
}

const CASE_OVERRIDES_KEY = 'growkyc_case_overrides';

export function getActivePersonaId(): string {
  return localStorage.getItem('growkyc_selected_user') || 'sarah_chen';
}

export function getActivePersonaName(): string {
  return COMPLIANCE_USER_DISPLAY[getActivePersonaId()] || 'Compliance Officer';
}

function loadCaseOverrides(): Record<string, Partial<ComplianceCaseRecord>> {
  try {
    const raw = localStorage.getItem(CASE_OVERRIDES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
}

export function saveCaseOverride(caseId: string, patch: Partial<ComplianceCaseRecord>): void {
  const all = loadCaseOverrides();
  all[caseId] = { ...(all[caseId] || {}), ...patch };
  localStorage.setItem(CASE_OVERRIDES_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent('growkyc:cases_updated', { detail: { caseId, patch } }));
}

function riskFromClient(c: TestClient): ComplianceCaseRecord['riskLevel'] {
  const r = (c.amlData?.riskRating || 'Medium').toLowerCase();
  if (r === 'critical' || r === 'high' || r === 'medium' || r === 'low') return r;
  return 'medium';
}

function caseTypeFromClient(c: TestClient): string {
  if (c.amlData?.sanctionsMatches > 0) return 'Sanctions Match';
  if (c.amlData?.pepStatus && c.amlData.pepStatus !== 'Not PEP') return 'PEP Match';
  if (c.amlData?.adverseMediaHits > 0) return 'Adverse Media';
  if (c.riskScores?.overall >= 75) return 'EDD / Source of Funds';
  return 'AML Alert';
}

function clientTypeFromEntity(c: TestClient): ComplianceCaseRecord['clientType'] {
  const t = c.entityType?.toLowerCase() || '';
  if (t === 'individual') return 'individual';
  if (t === 'trust') return 'trust';
  return 'company';
}

export function buildCaseFromClient(c: TestClient, index = 0): ComplianceCaseRecord {
  const id = `CASE-2026-CL${c.id}`;
  const status: CaseWorkbenchStatus =
    c.status === 'Suspended' ? 'investigating' : c.status === 'Under Review' ? 'escalated' : 'triage';
  return {
    id,
    clientId: c.id,
    clientName: c.name,
    clientType: clientTypeFromEntity(c),
    caseType: caseTypeFromClient(c),
    triggerSource:
      c.amlData?.sanctionsMatches > 0
        ? 'Sanctions Screening Bot'
        : c.amlData?.pepStatus !== 'Not PEP'
          ? 'PEP Screening Bot'
          : 'AML Monitoring',
    riskLevel: riskFromClient(c),
    status,
    assignedTo: c.amlData?.riskRating === 'Critical' ? 'Sarah Chen' : getActivePersonaName(),
    created: c.lastReview || new Date().toISOString().slice(0, 10),
    lastUpdated: c.lastReview || new Date().toISOString().slice(0, 16).replace('T', ' '),
    slaHours: 48,
    slaRemaining: c.status === 'Suspended' ? 4 : 28,
    client: c,
  };
}

/** Maps a compliance case record to Case Control Centre row shape (compliance officer only). */
export function mapRecordToControlCentreCase(record: ComplianceCaseRecord): {
  id: string;
  clientName: string;
  clientType: 'individual' | 'company' | 'trust';
  caseType: string;
  triggerSource: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: CaseWorkbenchStatus;
  assignedTo: string;
  lastUpdated: string;
  slaHours: number;
  slaRemaining: number;
} {
  const typeMap: Record<string, string> = {
    'Sanctions Match': 'sanctions',
    'PEP Match': 'pep',
    'Adverse Media': 'adverse_media',
    'EDD / Source of Funds': 'sof',
    'AML Alert': 'aml_alert',
    'Ownership Issue': 'ownership',
    'Fraud / Identity': 'fraud',
    'Legal / Court': 'legal',
    'Manual Referral': 'manual',
  };
  const caseType =
    typeMap[record.caseType] ||
    (record.caseType.includes('sanction')
      ? 'sanctions'
      : record.caseType.includes('PEP')
        ? 'pep'
        : record.caseType.includes('Fraud')
          ? 'fraud'
          : record.caseType.includes('Legal')
            ? 'legal'
            : record.caseType.includes('Manual')
              ? 'manual'
              : record.caseType.includes('Ownership')
                ? 'ownership'
                : 'aml_alert');

  return {
    id: record.id,
    clientName: record.clientName,
    clientType: record.clientType,
    caseType,
    triggerSource: record.triggerSource,
    riskLevel: record.riskLevel,
    status: record.status,
    assignedTo: record.assignedTo,
    lastUpdated: record.lastUpdated,
    slaHours: record.slaHours,
    slaRemaining: record.slaRemaining,
  };
}

export function getComplianceOfficerControlCases(): ReturnType<typeof mapRecordToControlCentreCase>[] {
  return getAllComplianceCases().map(mapRecordToControlCentreCase);
}

export function getAllComplianceCases(): ComplianceCaseRecord[] {
  const clients = ClientsDB.getClients();
  const overrides = loadCaseOverrides();

  const dynamic = clients
    .filter((c) => c.status === 'Under Review' || c.status === 'Suspended')
    .map((c, idx) => buildCaseFromClient(c, idx));

  // Manual cases created by compliance officers
  const manualCases: ComplianceCaseRecord[] = loadManualCases().map((m) => ({
    id: m.id,
    clientId: m.clientId,
    clientName: m.clientName,
    clientType: m.clientType as ComplianceCaseRecord['clientType'],
    caseType: m.caseType,
    triggerSource: m.triggerSource,
    riskLevel: m.riskLevel,
    status: m.status,
    assignedTo: m.assignedTo,
    created: m.created,
    lastUpdated: m.lastUpdated,
    slaHours: m.slaHours,
    slaRemaining: m.slaRemaining,
    client: m.clientId ? clients.find((c) => c.id === m.clientId) : undefined,
  }));

  const merged = [...manualCases, ...dynamic].map((c) => ({
    ...c,
    ...(overrides[c.id] || {}),
  }));

  const seen = new Set<string>();
  return merged.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

export function resolveCaseById(caseId?: string): (ComplianceCaseRecord & { reason?: string; attachmentNames?: string[] }) | null {
  if (!caseId) return null;

  const all = getAllComplianceCases();

  const manual = findManualCase(caseId);
  if (manual) {
    const client = manual.clientId ? ClientsDB.getClients().find((c) => c.id === manual.clientId) : undefined;
    const overrides = loadCaseOverrides();
    return {
      id: manual.id,
      clientId: manual.clientId,
      clientName: manual.clientName,
      clientType: manual.clientType as ComplianceCaseRecord['clientType'],
      caseType: manual.caseType,
      triggerSource: manual.triggerSource,
      riskLevel: manual.riskLevel,
      status: (overrides[manual.id]?.status as CaseWorkbenchStatus) ?? manual.status,
      assignedTo: manual.assignedTo,
      created: manual.created,
      lastUpdated: manual.lastUpdated,
      slaHours: manual.slaHours,
      slaRemaining: manual.slaRemaining,
      client,
      reason: manual.reason,
      attachmentNames: manual.attachmentNames,
    };
  }

  const found = all.find((c) => c.id === caseId);
  if (found) {
    if (!found.client && found.clientId) {
      const client = ClientsDB.getClients().find((c) => c.id === found.clientId);
      if (client) return { ...found, client };
    }
    return found;
  }

  const clientMatch = caseId.match(/CL(.+)$/);
  if (clientMatch) {
    const client = ClientsDB.getClients().find((c) => c.id === clientMatch[1]);
    if (client) return buildCaseFromClient(client);
  }

  return null;
}

export function getComplianceDashboardMetrics(personaId?: string): ComplianceDashboardMetrics {
  const pid = personaId || getActivePersonaId();
  const personaName = COMPLIANCE_USER_DISPLAY[pid] || 'Sarah Chen';
  const clients = ClientsDB.getClients();
  const cases = getAllComplianceCases();
  const today = new Date().toISOString().slice(0, 10);

  return {
    totalClients: clients.length,
    assignedCases: cases.filter(
      (c) => c.status !== 'closed' && (c.assignedTo === personaName || c.assignedTo.includes(personaName.split(' ')[0]))
    ).length,
    lowRiskApprovals: clients.filter((c) => c.amlData?.riskRating === 'Low' && c.status === 'Under Review').length,
    mediumRiskApprovals: clients.filter((c) => c.amlData?.riskRating === 'Medium' && c.status === 'Under Review').length,
    pendingInformationCases: clients.filter(
      (c) =>
        c.quickStatus?.identity === 'Info Requested' ||
        c.quickStatus?.identity === 'Pending Information' ||
        c.status === 'Under Review'
    ).length,
    monitoringAlerts: clients.reduce((sum, c) => sum + (c.monitoringData?.activeAlerts || 0), 0),
    escalations: cases.filter((c) => c.status === 'escalated').length + clients.filter((c) => c.status === 'Suspended').length,
    dueReviews: clients.filter((c) => c.nextReview && c.nextReview <= today).length,
    slaBreaches: cases.filter((c) => c.slaRemaining <= 0 && c.status !== 'closed').length,
    investigationCases: cases.filter((c) => c.status === 'investigating').length,
    eddCases: clients.filter((c) => (c.riskScores?.overall || 0) >= 75 || c.amlData?.riskRating === 'High' || c.amlData?.riskRating === 'Critical').length,
  };
}

export function getApprovalBlockers(
  record: ComplianceCaseRecord,
  opts: {
    documentsVerified: boolean;
    screeningComplete: boolean;
    openInvestigation: boolean;
    openEdd: boolean;
    pendingInformation: boolean;
    unresolvedWarnings: number;
  },
  personaId?: string
): ApprovalBlocker[] {
  const blockers: ApprovalBlocker[] = [];
  const pid = personaId || getActivePersonaId();
  const client = record.client;
  const risk = record.riskLevel;

  if (!opts.documentsVerified) {
    blockers.push({ code: 'docs', message: 'Mandatory documents must be uploaded and verified.' });
  }
  if (!opts.screeningComplete) {
    blockers.push({ code: 'screening', message: 'Screening (PEP, sanctions, adverse media) must be completed.' });
  }
  if (opts.unresolvedWarnings > 0) {
    blockers.push({ code: 'warnings', message: `${opts.unresolvedWarnings} unresolved screening warning(s) remain.` });
  }
  if (opts.openInvestigation) {
    blockers.push({ code: 'investigation', message: 'An open investigation must be resolved before approval.' });
  }
  if (opts.openEdd) {
    blockers.push({ code: 'edd', message: 'EDD checklist must be completed before approval.' });
  }
  if (opts.pendingInformation) {
    blockers.push({ code: 'pending_info', message: 'Outstanding information requests must be fulfilled.' });
  }

  if (risk === 'high' || risk === 'critical') {
    if (pid === 'emma_williams') {
      blockers.push({
        code: 'risk_escalate',
        message: 'High/Critical risk cases must be escalated — Compliance Officer cannot approve.',
      });
    }
  }

  if (client?.amlData?.pepStatus && client.amlData.pepStatus !== 'Not PEP' && pid === 'emma_williams') {
    blockers.push({ code: 'pep', message: 'PEP relationships require Senior Compliance Officer or Head of Compliance approval.' });
  }

  return blockers;
}

export function buildClientProfileSections(client?: TestClient) {
  if (!client) return null;
  return {
    profile: {
      name: client.name,
      email: `${client.name.toLowerCase().replace(/\s+/g, '.')}@client.example.com`,
      mobile: '+61 4XX XXX XXX',
      address: `${client.country} — registered address on file`,
      dob: client.entityType === 'Individual' ? 'On file (verified)' : 'N/A',
      clientType: client.entityType,
      riskRating: client.amlData?.riskRating || 'Medium',
      status: client.status,
    },
    entity: {
      legalName: client.name,
      abn: client.abn || '—',
      acn: client.acn || '—',
      registeredOffice: client.country,
      directors: client.entityData?.directors?.map((d) => d.name) || [],
      shareholders: client.entityData?.shareholders?.map((s) => `${s.name} (${s.percentage}%)`) || [],
      beneficialOwners: client.ownershipData?.ubos?.map((u) => `${u.name} (${u.ownership}%)`) || [],
      trustControllers: client.entityData?.trustees?.map((t) => t.name) || [],
      industry: client.industry,
    },
    equifax: {
      identityResult: client.quickStatus?.identity || 'Pending',
      pepResult: client.amlData?.pepStatus || 'Not PEP',
      sanctionsResult: client.amlData?.sanctionsMatches > 0 ? 'Match' : 'Clear',
      watchlistResult: client.amlData?.worldCheckStatus || 'Clear',
      adverseMediaResult: client.amlData?.adverseMediaHits > 0 ? `${client.amlData.adverseMediaHits} hit(s)` : 'Clear',
      asicResult: client.entityData?.asicStatus || '—',
      fraudIndicators: client.identityData?.fraudFlags?.length || 0,
      riskScore: client.riskScores?.overall ?? 0,
    },
    documents: {
      uploaded: client.documentsData?.verified || 0,
      missing: client.documentsData?.pending || 0,
      rejected: client.documentsData?.rejected || 0,
      total: client.documentsData?.total || 0,
    },
    risk: {
      score: client.riskScores?.overall ?? 0,
      rating: client.amlData?.riskRating || 'Medium',
      factors: [
        client.amlData?.sanctionsMatches > 0 && 'Sanctions match',
        client.amlData?.pepStatus !== 'Not PEP' && 'PEP exposure',
        client.amlData?.adverseMediaHits > 0 && 'Adverse media',
        client.ownershipData?.complexStructure && 'Complex ownership',
      ].filter(Boolean) as string[],
    },
  };
}

// ─── Manual Case Storage ───────────────────────────────────────────────────

const MANUAL_CASES_KEY = 'growkyc_manual_cases';

function nextClientId(): string {
  const clients = ClientsDB.getClients();
  const numericIds = clients
    .map((c) => parseInt(c.id, 10))
    .filter((n) => !Number.isNaN(n));
  const next = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
  return String(next);
}

function riskRatingFromLevel(level: string): 'Low' | 'Medium' | 'High' | 'Critical' {
  if (level === 'critical') return 'Critical';
  if (level === 'high') return 'High';
  if (level === 'medium') return 'Medium';
  return 'Low';
}

/** Create a minimal client record when opening a manual case for a new entity. */
export function createClientFromManualCase(
  name: string,
  clientType: 'individual' | 'company' | 'trust',
  riskLevel: string
): TestClient {
  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
  const entityType =
    clientType === 'individual' ? 'Individual' : clientType === 'trust' ? 'Trust' : 'Company';
  const riskRating = riskRatingFromLevel(riskLevel);
  const riskScore =
    riskLevel === 'critical' ? 88 : riskLevel === 'high' ? 72 : riskLevel === 'medium' ? 48 : 22;

  return {
    id: nextClientId(),
    name: name.trim(),
    entityType,
    status: 'Under Review',
    country: 'Australia',
    industry: 'To be confirmed',
    serviceType: 'Compliance Review',
    clientGroup: 'Manual Case Referral',
    riskScores: { overall: riskScore, aml: riskScore, financial: 30, business: 25, ownership: 20 },
    quickStatus: {
      identity: 'Pending',
      aml: 'Under Review',
      entity: entityType === 'Individual' ? 'N/A' : 'Pending',
      monitoring: 'Active',
    },
    lastReview: today,
    nextReview: nextYear,
    identityData: {
      primaryID: { type: 'Pending', number: '—', expiry: nextYear, verified: false },
      biometricStatus: 'Pending',
      livenessCheck: false,
      addressVerified: false,
      fraudFlags: [],
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Pending',
      transactionMonitoring: 'Active',
      riskRating,
      lastScreeningDate: today,
    },
    entityData: { registrationDate: today, companyStatus: 'Pending', directors: [], shareholders: [] },
    ownershipData: {
      ubos: [{ name: name.trim(), ownership: 100, verified: false, country: 'Australia' }],
      ownershipStructureComplete: false,
      complexStructure: false,
    },
    financialData: {
      bankAccounts: 0,
      sourceOfFunds: 'Under review',
      sourceOfWealth: 'Under review',
      estimatedWealth: 'Not disclosed',
      transactionVolume: 'Under assessment',
      highRiskTransactions: 0,
    },
    legalData: {
      serviceAgreementSigned: false,
      termsAccepted: true,
      privacyConsentGiven: true,
      kycConsentDate: today,
    },
    documentsData: { total: 0, verified: 0, pending: 1, rejected: 0 },
    monitoringData: { alertsLast30Days: 0, activeAlerts: 1, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Pending',
      onboardingDate: today,
      approver: getActivePersonaName(),
      riskAssessments: 1,
      escalations: 0,
    },
  };
}

export interface ManualCasePayload {
  id: string;
  clientId: string;
  clientName: string;
  clientType: string;
  caseType: string;
  triggerSource: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: CaseWorkbenchStatus;
  assignedTo: string;
  created: string;
  lastUpdated: string;
  slaHours: number;
  slaRemaining: number;
  reason: string;
  attachmentNames: string[];
}

export function saveManualCase(payload: ManualCasePayload): void {
  try {
    const existing = loadManualCases();
    const idx = existing.findIndex((c) => c.id === payload.id);
    if (idx >= 0) existing[idx] = payload;
    else existing.unshift(payload);
    localStorage.setItem(MANUAL_CASES_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('growkyc:cases_updated'));
  } catch {/* ignore */}
}

export function loadManualCases(): ManualCasePayload[] {
  try {
    const raw = localStorage.getItem(MANUAL_CASES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function findManualCase(caseId: string): ManualCasePayload | undefined {
  return loadManualCases().find((c) => c.id === caseId);
}

// ─── Dynamic Tab Data Generators ─────────────────────────────────────────────

function riskScore(riskLevel: string): number {
  return riskLevel === 'critical' ? 90 : riskLevel === 'high' ? 72 : riskLevel === 'medium' ? 48 : 22;
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/** Generate triggers for any case (manual or client-based). */
export function buildCaseTriggers(record: ComplianceCaseRecord & { reason?: string }) {
  const triggers: { id: string; source: string; reason: string; severity: string; confidence: number; timestamp: string }[] = [];
  const now = record.created || new Date().toISOString().slice(0, 16);

  const typeSourceMap: Record<string, string> = {
    'Sanctions Match': 'Sanctions Screening Bot',
    sanctions: 'Sanctions Screening Bot',
    'PEP Match': 'PEP Screening Bot',
    pep: 'PEP Screening Bot',
    'Adverse Media': 'Adverse Media Bot',
    adverse_media: 'Adverse Media Bot',
    'EDD / Source of Funds': 'Source of Funds Bot',
    sof: 'Source of Funds Bot',
    'AML Alert': 'AML Monitoring Engine',
    aml_alert: 'AML Monitoring Engine',
    fraud: 'Identity Verification Bot',
    legal: 'Court & Litigation Bot',
    ownership: 'Ownership Structure Bot',
    manual: 'Manual Referral',
    'Manual Referral': 'Manual Referral',
  };
  const src = typeSourceMap[record.caseType] || record.triggerSource || 'Compliance Monitoring';

  // Primary trigger from case type
  triggers.push({
    id: 'T1',
    source: src,
    reason: record.reason || `${record.caseType} detected for ${record.clientName}`,
    severity: record.riskLevel === 'critical' ? 'critical' : record.riskLevel === 'high' ? 'high' : 'medium',
    confidence: riskScore(record.riskLevel),
    timestamp: now,
  });

  // Secondary trigger from client AML data (if available)
  const c = record.client;
  if (c) {
    if (c.amlData?.sanctionsMatches > 0 && record.caseType !== 'sanctions') {
      triggers.push({ id: 'T2', source: 'Sanctions Screening Bot', reason: `${c.amlData.sanctionsMatches} sanctions list match(es) found`, severity: 'critical', confidence: 91, timestamp: now });
    }
    if (c.amlData?.pepStatus && c.amlData.pepStatus !== 'Not PEP' && record.caseType !== 'pep') {
      triggers.push({ id: 'T3', source: 'PEP Screening Bot', reason: `PEP status: ${c.amlData.pepStatus}`, severity: 'high', confidence: 87, timestamp: now });
    }
    if (c.amlData?.adverseMediaHits > 0 && record.caseType !== 'adverse_media') {
      triggers.push({ id: 'T4', source: 'Adverse Media Bot', reason: `${c.amlData.adverseMediaHits} adverse media article(s) detected`, severity: 'high', confidence: 78, timestamp: now });
    }
    if ((c.riskScores?.overall || 0) >= 75 && record.caseType !== 'sof') {
      triggers.push({ id: 'T5', source: 'Source of Funds Bot', reason: `Elevated risk score (${c.riskScores.overall}/100) requires source of funds verification`, severity: 'medium', confidence: 65, timestamp: now });
    }
  }
  return triggers;
}

/** Generate evidence items. */
export function buildCaseEvidence(record: ComplianceCaseRecord & { reason?: string; attachmentNames?: string[] }) {
  const items: { type: string; title: string; provider: string; confidence: number; downloadable?: boolean }[] = [];
  const c = record.client;

  if (record.caseType === 'Sanctions Match' || record.caseType === 'sanctions') {
    items.push({ type: 'Sanctions Match', title: `DFAT Consolidated List — ${record.clientName}`, provider: 'ComplyAdvantage', confidence: 91 });
  }
  if (record.caseType === 'PEP Match' || record.caseType === 'pep') {
    items.push({ type: 'PEP Profile', title: `PEP Relationship — ${record.clientName}`, provider: 'Dow Jones Risk & Compliance', confidence: 88 });
  }
  if (record.caseType === 'Adverse Media' || record.caseType === 'adverse_media') {
    items.push({ type: 'Adverse Media', title: `Adverse Media Screening — ${record.clientName}`, provider: 'ComplyAdvantage', confidence: 82 });
  }
  if (record.caseType === 'EDD / Source of Funds' || record.caseType === 'sof') {
    items.push({ type: 'Source of Funds', title: `Unexplained Funds Analysis — ${record.clientName}`, provider: 'Internal SOF Bot', confidence: 67 });
  }
  if (record.caseType === 'AML Alert' || record.caseType === 'aml_alert') {
    items.push({ type: 'AML Alert', title: `Transaction Monitoring Alert — ${record.clientName}`, provider: 'AML Monitoring Engine', confidence: 80 });
  }
  if (record.caseType === 'Manual Referral' || record.caseType === 'manual') {
    items.push({ type: 'Manual Referral', title: `Compliance Officer Referral — ${record.clientName}`, provider: 'Internal Compliance Team', confidence: 100 });
  }
  if (record.caseType === 'fraud') {
    items.push({ type: 'Identity Fraud', title: `Identity Fraud Indicators — ${record.clientName}`, provider: 'Identity Verification Bot', confidence: 76 });
  }
  if (record.caseType === 'legal') {
    items.push({ type: 'Legal Matter', title: `Court / Litigation Records — ${record.clientName}`, provider: 'Court & Litigation Bot', confidence: 95 });
  }
  if (record.caseType === 'ownership') {
    items.push({ type: 'Ownership Issue', title: `Ownership Structure Anomaly — ${record.clientName}`, provider: 'Ownership Structure Bot', confidence: 73 });
  }

  if (c) {
    if (c.documentsData?.verified > 0) {
      items.push({ type: 'Document', title: `Verified KYC Documents (${c.documentsData.verified})`, provider: 'Client Portal', confidence: 100, downloadable: true });
    }
    if (c.amlData?.lastScreeningDate) {
      items.push({ type: 'Screening Report', title: `AML Screening Report — ${c.amlData.lastScreeningDate}`, provider: 'ComplyAdvantage', confidence: 100, downloadable: true });
    }
  }

  // Attachments uploaded when creating manual case
  if (record.attachmentNames) {
    record.attachmentNames.forEach((name, i) => {
      items.push({ type: 'Attachment', title: name, provider: 'Manual Upload', confidence: 100, downloadable: true });
    });
  }

  if (items.length === 0) {
    items.push({ type: 'Case File', title: `Case File — ${record.clientName}`, provider: 'GrowKYC System', confidence: 100 });
  }
  return items;
}

/** Generate screening results. */
export function buildCaseScreening(record: ComplianceCaseRecord) {
  const c = record.client;
  const now = new Date().toLocaleString('en-AU');
  return {
    sanctions: {
      result: (c?.amlData?.sanctionsMatches || 0) > 0 || record.caseType === 'sanctions' || record.caseType === 'Sanctions Match' ? 'MATCH FOUND' : 'CLEAR',
      matches: c?.amlData?.sanctionsMatches || (record.caseType === 'sanctions' || record.caseType === 'Sanctions Match' ? 1 : 0),
      provider: 'ComplyAdvantage',
      lastScreened: c?.amlData?.lastScreeningDate || now,
    },
    pep: {
      result: (c?.amlData?.pepStatus && c.amlData.pepStatus !== 'Not PEP') || record.caseType === 'pep' || record.caseType === 'PEP Match' ? 'PEP DETECTED' : 'CLEAR',
      pepType: c?.amlData?.pepStatus || 'Not PEP',
      provider: 'Dow Jones Risk & Compliance',
      lastScreened: now,
    },
    adverseMedia: {
      result: (c?.amlData?.adverseMediaHits || 0) > 0 || record.caseType === 'adverse_media' || record.caseType === 'Adverse Media' ? `${Math.max(c?.amlData?.adverseMediaHits || 1, 1)} ALERT(S)` : 'CLEAR',
      hits: c?.amlData?.adverseMediaHits || (record.caseType === 'adverse_media' || record.caseType === 'Adverse Media' ? 1 : 0),
      provider: 'ComplyAdvantage Media Monitoring',
      lastScreened: now,
    },
    watchlist: {
      result: c?.amlData?.worldCheckStatus === 'Match' ? 'MATCH FOUND' : 'CLEAR',
      provider: 'World-Check (Refinitiv)',
      lastScreened: now,
    },
    identity: {
      result: c?.quickStatus?.identity || (record.caseType === 'fraud' ? 'REVIEW REQUIRED' : 'PENDING'),
      provider: 'InfoTrack / GreenID',
      lastScreened: now,
    },
    overallRisk: capitalize(record.riskLevel),
    riskScore: riskScore(record.riskLevel),
    totalAlerts:
      (c?.amlData?.sanctionsMatches || 0) +
      (c?.amlData?.adverseMediaHits || 0) +
      ((c?.amlData?.pepStatus && c.amlData.pepStatus !== 'Not PEP') ? 1 : 0) +
      ((c?.identityData?.fraudFlags?.length || 0)),
  };
}

/** Generate financial tab data. */
export function buildCaseFinancial(record: ComplianceCaseRecord) {
  const c = record.client;
  return {
    bankAccounts: c?.financialData?.bankAccounts ?? 1,
    sourceOfFunds: c?.financialData?.sourceOfFunds || 'Under review',
    sourceOfWealth: c?.financialData?.sourceOfWealth || 'Under review',
    estimatedWealth: c?.financialData?.estimatedWealth || 'Not disclosed',
    transactionVolume: c?.financialData?.transactionVolume || 'Under assessment',
    highRiskTransactions: c?.financialData?.highRiskTransactions ?? 0,
    caseType: record.caseType,
    riskLevel: record.riskLevel,
    notes: record.caseType === 'sof' || record.caseType === 'EDD / Source of Funds'
      ? 'Source of funds verification required as part of this case.'
      : 'Financial profile reviewed as part of case investigation.',
  };
}

/** Generate ownership tab data. */
export function buildCaseOwnership(record: ComplianceCaseRecord) {
  const c = record.client;
  return {
    ubos: c?.ownershipData?.ubos || [],
    complexStructure: c?.ownershipData?.complexStructure || false,
    ownershipComplete: c?.ownershipData?.ownershipStructureComplete || false,
    directors: c?.entityData?.directors || [],
    shareholders: c?.entityData?.shareholders || [],
    trustees: c?.entityData?.trustees || [],
    beneficiaries: c?.entityData?.beneficiaries || [],
    clientType: record.clientType,
    caseNote: record.caseType === 'ownership' ? 'Ownership structure anomaly is the primary case trigger.' : 'Ownership review performed as standard case procedure.',
  };
}

/** Generate related parties tab data. */
export function buildCaseRelatedParties(record: ComplianceCaseRecord) {
  const c = record.client;
  const parties: { name: string; relationship: string; riskFlag: string; action: string }[] = [];

  (c?.entityData?.directors || []).forEach((d) => {
    parties.push({ name: d.name, relationship: 'Director', riskFlag: d.kycStatus || 'Pending KYC', action: 'Review required' });
  });
  (c?.ownershipData?.ubos || []).forEach((u) => {
    parties.push({ name: u.name, relationship: `UBO (${u.ownership}% — ${u.country})`, riskFlag: u.verified ? 'Verified' : 'Unverified', action: u.verified ? 'Monitoring' : 'Verification required' });
  });
  (c?.entityData?.shareholders || []).forEach((s) => {
    parties.push({ name: s.name, relationship: `Shareholder (${s.percentage}%)`, riskFlag: 'No flags', action: 'Routine monitoring' });
  });

  if (parties.length === 0) {
    parties.push({ name: record.clientName, relationship: 'Primary Subject', riskFlag: capitalize(record.riskLevel) + ' risk', action: 'Under investigation' });
  }
  return parties;
}

/** Generate timeline events for a case. */
export function buildCaseTimeline(record: ComplianceCaseRecord & { reason?: string; attachmentNames?: string[] }) {
  const events: { time: string; user: string; action: string; type: string }[] = [];
  const created = record.created || new Date().toISOString().slice(0, 16).replace('T', ' ');
  const assignedTo = record.assignedTo || getActivePersonaName();

  events.push({ time: created, user: 'System', action: `Case ${record.id} created`, type: 'case_created' });
  events.push({ time: created, user: 'System', action: `Auto-assigned to ${assignedTo}`, type: 'assignment' });

  if (record.caseType === 'Sanctions Match' || record.caseType === 'sanctions') {
    events.push({ time: created, user: 'Sanctions Screening Bot', action: 'Sanctions match detected — DFAT Consolidated List', type: 'screening_alert' });
  }
  if (record.caseType === 'PEP Match' || record.caseType === 'pep') {
    events.push({ time: created, user: 'PEP Screening Bot', action: 'PEP relationship identified', type: 'screening_alert' });
  }
  if (record.caseType === 'Adverse Media' || record.caseType === 'adverse_media') {
    events.push({ time: created, user: 'Adverse Media Bot', action: 'Adverse media alerts generated', type: 'screening_alert' });
  }
  if (record.caseType === 'EDD / Source of Funds' || record.caseType === 'sof') {
    events.push({ time: created, user: 'Source of Funds Bot', action: 'Source of funds anomaly flagged', type: 'screening_alert' });
  }
  if (record.caseType === 'Manual Referral' || record.caseType === 'manual') {
    events.push({ time: created, user: assignedTo, action: `Manual case referral created: "${record.reason || ''}"`, type: 'note_added' });
  }
  if (record.reason) {
    events.push({ time: created, user: assignedTo, action: `Case reason recorded: ${record.reason.slice(0, 80)}${record.reason.length > 80 ? '…' : ''}`, type: 'note_added' });
  }
  if (record.attachmentNames && record.attachmentNames.length > 0) {
    record.attachmentNames.forEach((name) => {
      events.push({ time: created, user: assignedTo, action: `Document uploaded: ${name}`, type: 'document_uploaded' });
    });
  }
  if (record.riskLevel === 'critical' || record.riskLevel === 'high') {
    events.push({ time: created, user: 'System', action: 'SLA timer started — high priority queue', type: 'sla_warning' });
  }

  return events.map((e, idx) => ({
    ...e,
    timestamp: new Date(record.created || Date.now()).toISOString(),
    metadata: { caseId: record.id, step: idx + 1 },
  }));
}

/** Generate audit trail events for the Timeline tab (detailed). */
export function buildCaseAuditEvents(record: ComplianceCaseRecord & { reason?: string; attachmentNames?: string[] }) {
  const events = buildCaseTimeline(record);
  return events.map((e) => ({
    actor: e.user,
    action: e.action,
    timestamp: e.timestamp,
    type: e.type,
    metadata: e.metadata,
  }));
}

/** Generate approval chain from risk level. */
export function buildCaseApprovalChain(record: ComplianceCaseRecord) {
  const assignedTo = record.assignedTo || getActivePersonaName();
  const isHighRisk = record.riskLevel === 'high' || record.riskLevel === 'critical';

  const steps = [
    {
      step: 1,
      role: 'Compliance Analyst (L1)',
      actor: assignedTo,
      status: 'pending' as const,
      timestamp: null as string | null,
      comments: null as string | null,
    },
    {
      step: 2,
      role: 'Senior Compliance Officer (L2)',
      actor: isHighRisk ? 'Jessica Lee' : null,
      status: 'pending' as const,
      timestamp: null as string | null,
      comments: null as string | null,
    },
  ];

  if (isHighRisk) {
    steps.push({
      step: 3,
      role: 'Head of Compliance / MLRO',
      actor: null,
      status: 'pending' as const,
      timestamp: null,
      comments: null,
    });
  }

  return {
    caseId: record.id,
    status: 'pending_level_1',
    steps,
  };
}

/** Generate escalation records. */
export function buildCaseEscalations(record: ComplianceCaseRecord) {
  const escalations: { id: string; priority: string; reason: string; escalatedBy: string; escalatedTo: string; status: string; timestamp: string }[] = [];
  const now = new Date().toISOString();

  if (record.riskLevel === 'critical') {
    escalations.push({
      id: 'esc1',
      priority: 'Critical',
      reason: `Critical risk case requires immediate Head of Compliance review — ${record.caseType}`,
      escalatedBy: 'System (Auto-escalation)',
      escalatedTo: 'Sarah Chen — Head of Compliance',
      status: 'Open',
      timestamp: now,
    });
  }
  if (record.riskLevel === 'high') {
    escalations.push({
      id: 'esc2',
      priority: 'High',
      reason: `High risk case escalated for Senior Compliance Officer review — ${record.caseType}`,
      escalatedBy: record.assignedTo || getActivePersonaName(),
      escalatedTo: 'Jessica Lee — Senior Compliance Officer',
      status: 'Open',
      timestamp: now,
    });
  }
  if (record.status === 'escalated') {
    escalations.push({
      id: 'esc3',
      priority: 'Medium',
      reason: 'Case manually escalated by compliance officer',
      escalatedBy: getActivePersonaName(),
      escalatedTo: 'Compliance Review Queue',
      status: 'Open',
      timestamp: now,
    });
  }
  if (escalations.length === 0) {
    escalations.push({
      id: 'esc0',
      priority: 'Low',
      reason: 'Routine case review — no escalation triggers active',
      escalatedBy: 'System',
      escalatedTo: 'Assigned Analyst',
      status: 'Monitoring',
      timestamp: now,
    });
  }
  return escalations;
}

/** Generate documents for a case. */
export function buildCaseDocuments(record: ComplianceCaseRecord & { attachmentNames?: string[] }) {
  const docs: { id: string; type: string; filename: string; uploadedBy: string; timestamp: string; expiryDate?: string; status: string }[] = [];
  const now = new Date().toISOString();
  const farFuture = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const c = record.client;

  if (c) {
    if (c.identityData?.primaryID) {
      docs.push({ id: 'doc-id', type: c.identityData.primaryID.type || 'Primary ID', filename: `${record.clientName.replace(/ /g, '_')}_PrimaryID.pdf`, uploadedBy: 'Client Portal', timestamp: now, expiryDate: c.identityData.primaryID.expiry ? new Date(c.identityData.primaryID.expiry).toISOString() : farFuture, status: c.identityData.primaryID.verified ? 'Verified' : 'Pending Verification' });
    }
    if (c.identityData?.secondaryID) {
      docs.push({ id: 'doc-id2', type: c.identityData.secondaryID.type || 'Secondary ID', filename: `${record.clientName.replace(/ /g, '_')}_SecondaryID.pdf`, uploadedBy: 'Client Portal', timestamp: now, expiryDate: farFuture, status: c.identityData.secondaryID.verified ? 'Verified' : 'Pending Verification' });
    }
    if (c.financialData?.sourceOfFunds && c.financialData.sourceOfFunds !== 'Under review') {
      docs.push({ id: 'doc-sof', type: 'Source of Funds', filename: `${record.clientName.replace(/ /g, '_')}_SOF.pdf`, uploadedBy: 'Client Portal', timestamp: now, status: 'Pending Verification' });
    }
  }

  (record.attachmentNames || []).forEach((name, i) => {
    docs.push({ id: `doc-att-${i}`, type: 'Attachment', filename: name, uploadedBy: getActivePersonaName(), timestamp: now, status: 'Uploaded' });
  });

  if (docs.length === 0) {
    docs.push({ id: 'doc-placeholder', type: 'Case Initiation Document', filename: `Case_${record.id}_Initiation.pdf`, uploadedBy: getActivePersonaName(), timestamp: now, status: 'Internal Only' });
  }
  return docs;
}

export function logComplianceActivity(action: string, iconName = 'Activity', color = 'text-blue-600'): void {
  try {
    const saved = localStorage.getItem('growkyc_logged_activities');
    let activities: unknown[] = [];
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) activities = parsed;
    }
    activities = [
      {
        type: 'review',
        user: getActivePersonaName(),
        action,
        time: 'Just now',
        iconName,
        color,
      },
      ...activities,
    ].slice(0, 50);
    localStorage.setItem('growkyc_logged_activities', JSON.stringify(activities));
    window.dispatchEvent(new CustomEvent('growkyc:activity_logged'));
  } catch {
    /* ignore */
  }
}

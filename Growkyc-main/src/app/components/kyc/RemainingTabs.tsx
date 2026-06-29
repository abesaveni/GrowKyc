import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { EntityNetworkChart } from './EntityNetworkChart';
import { motion, AnimatePresence } from 'framer-motion';
import { HighRiskTransactionsDisplay } from './HighRiskTransactionsDisplay';
import { HIGH_RISK_TRANSACTIONS_DATABASE } from './HighRiskTransactionsData';
import { LegalMattersDisplay } from './LegalMattersDisplay';
import { LEGAL_MATTERS_DATABASE } from './LegalMattersData';
import { IntegrationDocumentsDisplay } from './IntegrationDocumentsDisplay';
import { INTEGRATION_DOCUMENTS_DATABASE, ClientDocumentRepository, IntegrationDocument } from './IntegrationDocumentsData';
import { EnhancedMonitoringTab } from './EnhancedMonitoringTab';
import { EnhancedDecisionTab } from './EnhancedDecisionTab';
import { DecisionsTab } from './DecisionsTab';
import { DECISION_DATABASE } from './DecisionData';
import { EnhancedAustracTab } from './EnhancedAustracTab';
import { AUSTRAC_REPORTS_DATABASE } from './AustracReportingData';
import { AuditTab } from './AuditTab';
import { TestClient } from './ClientsDatabase';
import {
  Building,
  Users,
  DollarSign,
  Scale,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  Calendar,
  Upload,
  Clock,
  Shield,
  User,
  Globe,
  AlertCircle,
  RefreshCw,
  CreditCard,
  Search,
  Network,
  ShieldCheck,
  History
} from 'lucide-react';
import { toast } from 'sonner';
import { EquifaxCreditScoreCard } from './EquifaxCreditScoreCard';
import { EQUIFAX_MOCK_DATA } from './EquifaxData';
import { IllionBusinessCard } from './IllionBusinessCard';
import { ILLION_MOCK_DATA } from './IllionData';
import { SOFAssessmentPanel } from './SOFAssessmentPanel';
import { SOF_MOCK_DATA } from './SOFData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

type RegistrationHistoryRow = { date: string; event: string; source?: string };
type KeyDateRow = { label: string; date: string; detail?: string };



type TabType = 'entity' | 'ownership' | 'financial' | 'fraud' | 'legal' | 'run-checks' | 'compliance' | 'documents' | 'monitoring' | 'decisions' | 'austrac' | 'audit';

interface RemainingTabsProps {
  activeTab: TabType;
  client: TestClient;
}

function parseSortableDate(value: string): number {
  const t = Date.parse(value);
  return Number.isNaN(t) ? 0 : t;
}

function formatRegistrySync(iso?: string | null): string | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso;
  return new Date(t).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });
}

function defaultOfficeholderRole(entityType: TestClient['entityType']): string {
  if (entityType === 'Partnership') return 'Partner';
  if (entityType === 'Trust') return 'Trustee';
  if (entityType === 'Foreign Entity') return 'Director';
  return 'Director';
}

function kycStatusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('verified') || s.includes('complete') || s.includes('passed')) {
    return 'bg-green-100 text-green-900 border-green-300';
  }
  if (s.includes('pending') || s.includes('review') || s.includes('enhanced')) {
    return 'bg-amber-100 text-amber-900 border-amber-300';
  }
  if (s.includes('fail') || s.includes('reject') || s.includes('critical')) {
    return 'bg-red-100 text-red-900 border-red-300';
  }
  if (s.includes('closed') || s.includes('archive')) {
    return 'bg-slate-100 text-slate-700 border-slate-300';
  }
  return 'bg-gray-100 text-gray-800 border-gray-300';
}

const getNormalizedId = (id: string) => {
  if (id.startsWith('client-')) return id;
  const num = parseInt(id, 10);
  if (!isNaN(num)) {
    return `client-${num.toString().padStart(3, '0')}`;
  }
  return id;
};

const getEquifaxData = (client: TestClient) => {
  const normId = getNormalizedId(client.id);
  if (EQUIFAX_MOCK_DATA[normId]) {
    return EQUIFAX_MOCK_DATA[normId];
  }
  const score = client.riskScores?.overall ? Math.round(1200 - (client.riskScores.overall * 8.5)) : 820;
  let riskBand: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent' = 'Good';
  if (score > 900) riskBand = 'Excellent';
  else if (score > 740) riskBand = 'Very Good';
  else if (score > 620) riskBand = 'Good';
  else if (score > 500) riskBand = 'Fair';
  else riskBand = 'Poor';

  return {
    currentScore: score,
    maxScore: 1200,
    riskBand,
    scoreHistory: [
      { date: '2026-01', score: Math.round(score * 0.95) },
      { date: '2026-02', score: Math.round(score * 0.98) },
      { date: '2026-03', score }
    ],
    lastUpdated: client.lastReview || new Date().toISOString().split('T')[0],
    provider: 'Equifax' as const
  };
};

const getIllionData = (client: TestClient) => {
  const normId = getNormalizedId(client.id);
  if (ILLION_MOCK_DATA[normId]) {
    return ILLION_MOCK_DATA[normId];
  }
  const score = client.riskScores?.overall ? Math.round(100 - client.riskScores.overall) : 80;
  return {
    businessFailureScore: score,
    latePaymentScore: Math.round(score * 0.9),
    tradeReferenceCount: 0,
    totalTradeLimit: 0,
    avgDaysBeyondTerms: score > 70 ? 2 : score > 40 ? 12 : 35,
    paymentHistory: {
      promptPercentage: score,
      late30Percentage: Math.round((100 - score) * 0.7),
      late60Percentage: Math.round((100 - score) * 0.2),
      late90PlusPercentage: Math.round((100 - score) * 0.1),
    },
    tradeReferences: [],
    lastUpdated: client.lastReview || new Date().toISOString().split('T')[0],
    provider: 'Illion' as const
  };
};

const getSOFData = (client: TestClient) => {
  const normId = getNormalizedId(client.id);
  if (SOF_MOCK_DATA[normId]) {
    return SOF_MOCK_DATA[normId];
  }
  const rating = client.amlData?.riskRating || 'Low';
  const riskVal: 'Low' | 'Medium' | 'High' | 'Critical' = rating === 'Critical' ? 'Critical' : rating === 'High' ? 'High' : rating === 'Medium' ? 'Medium' : 'Low';
  const status: 'Verified' | 'In Progress' | 'Action Required' = client.status === 'Active' ? 'Verified' : 'In Progress';
  
  return {
    sof: {
      type: client.financialData?.sourceOfFunds || 'Personal Savings',
      description: `Wealth accumulated from ${client.financialData?.sourceOfFunds || 'personal savings'} as declared during onboarding.`,
      verificationMethod: 'Bank Statements & Transaction Audit Trail',
      riskRating: riskVal,
      status: status,
      assessedBy: 'Sarah Chen',
      assessmentDate: client.lastReview || new Date().toISOString().split('T')[0],
      evidenceDocuments: []
    },
    sow: {
      type: client.financialData?.sourceOfWealth || 'Salary / Professional Income',
      description: `Primary wealth accumulation via ${client.financialData?.sourceOfWealth || 'professional income'}.`,
      verificationMethod: 'Tax Assessment Notice & Payslips',
      riskRating: riskVal,
      status: status,
      assessedBy: 'Sarah Chen',
      assessmentDate: client.lastReview || new Date().toISOString().split('T')[0],
      evidenceDocuments: []
    }
  };
};

const getIntegrationDocumentsData = (client: TestClient): ClientDocumentRepository => {
  const normId = getNormalizedId(client.id);
  if (INTEGRATION_DOCUMENTS_DATABASE[normId]) {
    return INTEGRATION_DOCUMENTS_DATABASE[normId];
  }
  if (INTEGRATION_DOCUMENTS_DATABASE[client.id]) {
    return INTEGRATION_DOCUMENTS_DATABASE[client.id];
  }
  
  const idData = client.identityData;
  if (!idData) {
    return {
      clientId: client.id,
      totalDocuments: 0,
      documentsAnalyzed: 0,
      lastDocumentReceived: client.lastReview || new Date().toISOString().split('T')[0],
      integrationSources: [],
      aiAnalysisEnabled: true,
      totalStorageUsed: '0.0 MB',
      categories: []
    };
  }
  
  const documentsList: IntegrationDocument[] = [];
  
  if (idData.primaryID) {
    documentsList.push({
      id: `DOC-IV-${client.id}-1`,
      documentName: `${idData.primaryID.type} - ${client.name}`,
      documentType: idData.primaryID.type,
      category: 'Identity Verification',
      source: 'Onboarding Document Upload',
      integrationProvider: 'InfoTrack',
      receivedDate: client.lastReview || new Date().toISOString().split('T')[0],
      documentDate: client.lastReview || new Date().toISOString().split('T')[0],
      fileType: 'PDF',
      fileSize: '1.5 MB',
      downloadedBy: 'kyc.team@grow.com',
      verificationStatus: idData.primaryID.verified ? 'Verified' : 'Pending Review',
      verifiedBy: idData.primaryID.verified ? 'kyc.team@grow.com' : undefined,
      verifiedDate: idData.primaryID.verified ? (client.lastReview || new Date().toISOString().split('T')[0]) : undefined,
      aiAnalysisStatus: 'Analyzed',
      aiSummary: `${idData.primaryID.type} uploaded and verified via database lookup.`,
      keyFindings: [`Document Number: ${idData.primaryID.number}`, 'No signs of alteration', 'Expiry Date valid'],
      searchable: true,
      tags: ['identity', 'uploaded', idData.primaryID.type.toLowerCase().replace(' ', '-')]
    });
  }
  
  if (idData.secondaryID) {
    documentsList.push({
      id: `DOC-IV-${client.id}-2`,
      documentName: `${idData.secondaryID.type} - ${client.name}`,
      documentType: idData.secondaryID.type,
      category: 'Identity Verification',
      source: 'Onboarding Document Upload',
      integrationProvider: 'InfoTrack',
      receivedDate: client.lastReview || new Date().toISOString().split('T')[0],
      documentDate: client.lastReview || new Date().toISOString().split('T')[0],
      fileType: 'PDF',
      fileSize: '1.2 MB',
      downloadedBy: 'kyc.team@grow.com',
      verificationStatus: idData.secondaryID.verified ? 'Verified' : 'Pending Review',
      verifiedBy: idData.secondaryID.verified ? 'kyc.team@grow.com' : undefined,
      verifiedDate: idData.secondaryID.verified ? (client.lastReview || new Date().toISOString().split('T')[0]) : undefined,
      aiAnalysisStatus: 'Analyzed',
      aiSummary: `${idData.secondaryID.type} uploaded and verified.`,
      keyFindings: [`Document Number: ${idData.secondaryID.number}`, 'Validation complete'],
      searchable: true,
      tags: ['identity', 'uploaded', idData.secondaryID.type.toLowerCase().replace(' ', '-')]
    });
  }

  if (idData.additionalDocuments) {
    idData.additionalDocuments.forEach((doc, idx) => {
      documentsList.push({
        id: `DOC-AD-${client.id}-${idx}`,
        documentName: `${doc.type} - ${client.name}`,
        documentType: doc.type,
        category: 'Identity Verification',
        source: 'Onboarding Document Upload',
        integrationProvider: 'InfoTrack',
        receivedDate: client.lastReview || new Date().toISOString().split('T')[0],
        documentDate: client.lastReview || new Date().toISOString().split('T')[0],
        fileType: 'PDF',
        fileSize: '0.8 MB',
        downloadedBy: 'kyc.team@grow.com',
        verificationStatus: doc.verified ? 'Verified' : 'Pending Review',
        verifiedBy: doc.verified ? 'kyc.team@grow.com' : undefined,
        verifiedDate: doc.verified ? (client.lastReview || new Date().toISOString().split('T')[0]) : undefined,
        aiAnalysisStatus: 'Analyzed',
        aiSummary: `${doc.type} uploaded.`,
        keyFindings: [`Document Number: ${doc.number || 'N/A'}`],
        searchable: true,
        tags: ['additional', 'uploaded']
      });
    });
  }

  const categories = documentsList.length > 0 ? [
    {
      category: 'Identity Verification',
      count: documentsList.length,
      lastUpdated: client.lastReview || new Date().toISOString().split('T')[0],
      documents: documentsList
    }
  ] : [];

  return {
    clientId: client.id,
    totalDocuments: documentsList.length,
    documentsAnalyzed: documentsList.length,
    lastDocumentReceived: client.lastReview || new Date().toISOString().split('T')[0],
    integrationSources: documentsList.length > 0 ? ['InfoTrack'] : [],
    aiAnalysisEnabled: true,
    totalStorageUsed: `${(documentsList.length * 1.2).toFixed(1)} MB`,
    categories
  };
};

type NormalizedDirectorRow = {
  name: string;
  dateOfBirth: string;
  role: string;
  kycStatus: string;
  screeningBatches: string[];
  appointed: string;
  resigned?: string;
};

function normalizeDirectorRows(
  directors: NonNullable<TestClient['entityData']['directors']>,
  entityType: TestClient['entityType']
): NormalizedDirectorRow[] {
  const fallbackRole = defaultOfficeholderRole(entityType);
  return directors.map((d) => ({
    name: d.name,
    appointed: d.appointed,
    resigned: d.resigned,
    dateOfBirth: d.dateOfBirth?.trim() || '—',
    role: d.role?.trim() || fallbackRole,
    kycStatus: d.kycStatus?.trim() || 'Not recorded',
    screeningBatches: Array.isArray(d.screeningBatches) ? d.screeningBatches.filter(Boolean) : [],
  }));
}

function companyStatusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('deregister') || s.includes('struck')) return 'bg-red-600 hover:bg-red-600';
  if (s.includes('administration') || s.includes('liquidat')) return 'bg-orange-600 hover:bg-orange-600';
  if (s.includes('suspend')) return 'bg-amber-600 hover:bg-amber-600';
  if (s.includes('active') || s.includes('registered') || s.includes('current') || s.includes('foreign company')) {
    return 'bg-green-600 hover:bg-green-600';
  }
  return 'bg-slate-600 hover:bg-slate-600';
}

function resolveRegistrationViewModel(client: TestClient): {
  companyStatus: string;
  history: RegistrationHistoryRow[];
  keyDates: KeyDateRow[];
  lastSyncedLabel: string | null;
  asicSupplementary: string | null;
} {
  const ed = client.entityData;
  let companyStatus = ed.companyStatus?.trim();
  if (!companyStatus) {
    const asic = (ed.asicStatus || '').toLowerCase();
    if (asic.includes('deregister') || asic.includes('struck')) companyStatus = 'Deregistered';
    else if (asic.includes('administration') || asic.includes('liquidat')) companyStatus = 'Under external administration';
    else if (asic.includes('foreign')) companyStatus = ed.asicStatus || 'Foreign registration';
    else if (asic.includes('register')) companyStatus = 'Active';
    else if (client.entityType === 'Company' && client.quickStatus?.entity) companyStatus = client.quickStatus.entity;
    else if (ed.registrationDate) companyStatus = client.status === 'Suspended' ? 'Suspended' : 'Active';
    else companyStatus = client.status || 'Unknown';
  }

  let history: RegistrationHistoryRow[] = [...(ed.registrationHistory || [])];
  if (history.length === 0 && ed.registrationDate) {
    history.push({
      date: ed.registrationDate,
      event:
        client.entityType === 'Trust'
          ? 'Trust establishment date on file'
          : client.entityType === 'Partnership'
            ? 'Partnership commencement / registration on file'
            : 'Incorporation / registration date on file',
      source: 'KYC record',
    });
    (ed.directors || []).forEach((d) => {
      history.push({
        date: d.appointed,
        event: d.resigned
          ? `Officeholder: ${d.name} (appointed; resigned ${d.resigned})`
          : `Officeholder appointed: ${d.name}`,
        source: 'KYC / registry extract',
      });
    });
  }
  history.sort((a, b) => parseSortableDate(b.date) - parseSortableDate(a.date));

  let keyDates: KeyDateRow[] = [...(ed.keyDates || [])];
  if (keyDates.length === 0) {
    if (ed.registrationDate) {
      keyDates.push({ label: 'Registration / establishment', date: ed.registrationDate });
    }
    if (client.lastReview) {
      keyDates.push({ label: 'Last periodic KYC review', date: client.lastReview });
    }
    if (client.nextReview) {
      keyDates.push({ label: 'Next KYC review due', date: client.nextReview });
    }
  }
  keyDates.sort((a, b) => parseSortableDate(a.date) - parseSortableDate(b.date));

  return {
    companyStatus,
    history,
    keyDates,
    lastSyncedLabel: formatRegistrySync(ed.lastRegistrySync),
    asicSupplementary: ed.asicStatus?.trim() || null,
  };
}

export function RemainingTabs({ activeTab, client }: RemainingTabsProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [lastRefreshed, setLastRefreshed] = React.useState(new Date().toLocaleTimeString());
  const [registrationDetailsOpen, setRegistrationDetailsOpen] = React.useState(false);
  const [showAgreementModal, setShowAgreementModal] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(new Date().toLocaleTimeString());
    }, 1500);
  };

  return (
    <>
      {/* ENTITY TAB */}
      {activeTab === 'entity' && (
        <>
          {/* Entity Network Chart */}
          <div className="mb-6">
            <EntityNetworkChart clientId={client.id} clientName={client.name} />
          </div>

          {/* Entity Information Card */}
          <Card className="border-2 border-blue-300 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Building className="w-6 h-6 text-blue-600" />
                Entity Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {client.entityData.registrationDate && (() => {
                const regVm = resolveRegistrationViewModel(client);
                const latestEvent = regVm.history[0];
                const nextKeyDate = [...regVm.keyDates].sort(
                  (a, b) => parseSortableDate(a.date) - parseSortableDate(b.date)
                ).find((k) => parseSortableDate(k.date) >= Date.now() - 86400000) ?? regVm.keyDates[regVm.keyDates.length - 1];

                return (
                  <div className="mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <h3 className="font-bold text-lg">Registration details</h3>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border-blue-300 text-blue-800 hover:bg-blue-50"
                        onClick={() => setRegistrationDetailsOpen(true)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>

                    <Dialog open={registrationDetailsOpen} onOpenChange={setRegistrationDetailsOpen}>
                      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex flex-wrap items-center gap-2">
                              Registry profile — {client.name}
                              <Badge className={`${companyStatusBadgeClass(regVm.companyStatus)} text-white`}>
                                {regVm.companyStatus}
                              </Badge>
                            </DialogTitle>
                            <DialogDescription>
                              Company status, registry history, and key dates are loaded from the client&apos;s entity
                              record (integrations would replace mock data per client).
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6 pt-2">
                            <div className="grid sm:grid-cols-2 gap-3 text-sm">
                              <div className="rounded-lg border bg-slate-50 p-3">
                                <p className="text-xs text-gray-600 mb-1">Entity type</p>
                                <p className="font-semibold text-gray-900">{client.entityType}</p>
                              </div>
                              {regVm.asicSupplementary && (
                                <div className="rounded-lg border bg-slate-50 p-3">
                                  <p className="text-xs text-gray-600 mb-1">Registry / ASIC summary</p>
                                  <p className="font-semibold text-gray-900">{regVm.asicSupplementary}</p>
                                </div>
                              )}
                              {regVm.lastSyncedLabel && (
                                <div className="rounded-lg border bg-emerald-50 p-3 sm:col-span-2">
                                  <p className="text-xs text-gray-600 mb-1">Last registry sync</p>
                                  <p className="font-semibold text-emerald-900">{regVm.lastSyncedLabel}</p>
                                </div>
                              )}
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <History className="w-4 h-4" />
                                History
                              </h4>
                              {regVm.history.length === 0 ? (
                                <p className="text-sm text-gray-600">No registry events on file.</p>
                              ) : (
                                <ul className="space-y-2 border rounded-lg divide-y bg-white">
                                  {regVm.history.map((row, idx) => (
                                    <li key={`${row.date}-${idx}`} className="p-3 text-sm">
                                      <div className="flex flex-wrap justify-between gap-2">
                                        <span className="font-medium text-gray-900">{row.event}</span>
                                        <span className="text-gray-600 whitespace-nowrap">{row.date}</span>
                                      </div>
                                      {row.source && (
                                        <p className="text-xs text-gray-500 mt-1">Source: {row.source}</p>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Key dates
                              </h4>
                              {regVm.keyDates.length === 0 ? (
                                <p className="text-sm text-gray-600">No key dates on file.</p>
                              ) : (
                                <div className="overflow-x-auto border rounded-lg">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-slate-100 text-left">
                                        <th className="p-2 font-medium">Label</th>
                                        <th className="p-2 font-medium">Date</th>
                                        <th className="p-2 font-medium">Detail</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {regVm.keyDates.map((row, idx) => (
                                        <tr key={`${row.label}-${idx}`} className="border-t">
                                          <td className="p-2 font-medium text-gray-900">{row.label}</td>
                                          <td className="p-2 text-gray-800 whitespace-nowrap">{row.date}</td>
                                          <td className="p-2 text-gray-600">{row.detail ?? '—'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                      </DialogContent>
                    </Dialog>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-4 border-2 border-slate-200 shadow-sm">
                        <p className="text-xs text-gray-600 mb-2">Company status</p>
                        <Badge className={`${companyStatusBadgeClass(regVm.companyStatus)} text-white text-sm px-3 py-1`}>
                          {regVm.companyStatus}
                        </Badge>
                        {regVm.lastSyncedLabel && (
                          <p className="text-xs text-gray-500 mt-2">Synced {regVm.lastSyncedLabel}</p>
                        )}
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-xs text-gray-600 mb-1">Entity type</p>
                        <p className="font-bold text-lg text-gray-900">{client.entityType}</p>
                        {regVm.asicSupplementary && (
                          <p className="text-xs text-gray-600 mt-2 line-clamp-2" title={regVm.asicSupplementary}>
                            {regVm.asicSupplementary}
                          </p>
                        )}
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <History className="w-3.5 h-3.5" />
                          Latest registry event
                        </p>
                        {latestEvent ? (
                          <>
                            <p className="font-semibold text-gray-900 text-sm leading-snug">{latestEvent.event}</p>
                            <p className="text-xs text-gray-600 mt-1">{latestEvent.date}</p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-600">No events</p>
                        )}
                      </div>
                      <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Next key date
                        </p>
                        {nextKeyDate ? (
                          <>
                            <p className="font-semibold text-gray-900">{nextKeyDate.label}</p>
                            <p className="text-sm text-gray-700 mt-1">{nextKeyDate.date}</p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-600">—</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {client.entityData.directors && client.entityData.directors.length > 0 && (() => {
                const directorRows = normalizeDirectorRows(client.entityData.directors, client.entityType);
                return (
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-4">Directors / Partners</h3>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                      <table className="w-full min-w-[720px] text-sm text-left">
                        <thead>
                          <tr className="bg-slate-100 border-b border-gray-200">
                            <th className="px-4 py-3 font-semibold text-gray-900">Name</th>
                            <th className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">Date of birth</th>
                            <th className="px-4 py-3 font-semibold text-gray-900">Role</th>
                            <th className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">KYC status</th>
                            <th className="px-4 py-3 font-semibold text-gray-900 min-w-[200px]">Screening batches</th>
                          </tr>
                        </thead>
                        <tbody>
                          {directorRows.map((row, idx) => (
                            <tr key={`${row.name}-${idx}`} className="border-b border-gray-100 last:border-0 hover:bg-slate-50/80">
                              <td className="px-4 py-3 align-top">
                                <div className="font-semibold text-gray-900">{row.name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Appointed {row.appointed}
                                  {row.resigned && (
                                    <span className="text-red-600 font-medium"> · Resigned {row.resigned}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 align-top text-gray-800 whitespace-nowrap">{row.dateOfBirth}</td>
                              <td className="px-4 py-3 align-top text-gray-800">{row.role}</td>
                              <td className="px-4 py-3 align-top">
                                <Badge variant="outline" className={`text-xs font-medium ${kycStatusBadgeClass(row.kycStatus)}`}>
                                  {row.kycStatus}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 align-top">
                                {row.screeningBatches.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {row.screeningBatches.map((batch) => (
                                      <Badge
                                        key={batch}
                                        variant="outline"
                                        className="text-xs font-mono bg-blue-50 text-blue-900 border-blue-200"
                                      >
                                        {batch}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-500">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {client.entityData.shareholders && client.entityData.shareholders.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Shareholders</h3>
                  <div className="space-y-2">
                    {client.entityData.shareholders.map((shareholder, idx) => (
                      <div key={idx} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold">{shareholder.name}</p>
                            <p className="text-sm text-gray-600">{shareholder.shares.toLocaleString()} shares</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">{shareholder.percentage}%</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${shareholder.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {client.entityData.trustType && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Trust Details</h3>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Trust Type</p>
                    <p className="font-bold text-lg">{client.entityData.trustType}</p>
                  </div>

                  {client.entityData.trustees && (
                    <div className="mb-4">
                      <p className="font-semibold mb-2">Trustees</p>
                      <div className="space-y-2">
                        {client.entityData.trustees.map((trustee, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="font-bold">{trustee.name}</p>
                            <p className="text-sm text-gray-600">{trustee.type}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {client.entityData.beneficiaries && (
                    <div>
                      <p className="font-semibold mb-2">Beneficiaries</p>
                      <div className="space-y-2">
                        {client.entityData.beneficiaries.map((beneficiary, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="font-bold">{beneficiary.name}</p>
                            <p className="text-sm text-gray-600">{beneficiary.entitlement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {client.entityType === 'Individual' && !client.entityData.registrationDate && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <p className="text-blue-800 font-semibold">Individual Entity</p>
                  <p className="text-sm text-blue-700 mt-1">
                    No corporate structure applicable. See Identity and Ownership tabs for details.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'ownership' && (() => {
        const ownershipData = client?.ownershipData || {
          ubos: [],
          ownershipStructureComplete: false,
          complexStructure: false
        };
        const ubos = ownershipData.ubos || [];
        const totalVerified = ubos.filter(u => u.verified).reduce((sum, u) => sum + (u.ownership || 0), 0);
        const totalUnverified = ubos.filter(u => !u.verified).reduce((sum, u) => sum + (u.ownership || 0), 0);
        const totalAccounted = totalVerified + totalUnverified;

        return (
          <div className="space-y-6">
            <Card className="border-2 border-blue-300 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b flex flex-row items-center justify-between py-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  Beneficial Ownership Analysis
                </CardTitle>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Last Sync: {lastRefreshed}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 border-blue-200 text-blue-600 hover:bg-blue-50 gap-2"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Syncing...' : 'Refresh Structure'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg text-gray-900">Ultimate Beneficial Owners ({ubos.length})</h3>
                      <Badge variant="outline" className="text-blue-600 border-blue-100 bg-blue-50 px-3">
                        {ubos.filter(u => u.verified).length} / {ubos.length} Verified
                      </Badge>
                    </div>
                    
                    {ubos.length === 0 ? (
                      <div className="p-8 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 text-center text-gray-500">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        No UBO data currently available for this entity type.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ubos.map((ubo, idx) => {
                          const statusVal = ubo.verified as unknown as string | boolean;
                          let displayStatus = 'Pending';
                          let isVerified = false;
                          let isFailed = false;

                          if (typeof statusVal === 'string') {
                            const lowerStatus = statusVal.toLowerCase();
                            if (lowerStatus === 'verified') { isVerified = true; displayStatus = 'Verified'; }
                            else if (lowerStatus === 'failed') { isFailed = true; displayStatus = 'Failed'; }
                            else { displayStatus = 'Pending'; }
                          } else if (typeof statusVal === 'boolean') {
                            isVerified = statusVal;
                            displayStatus = statusVal ? 'Verified' : 'Pending';
                          }

                          return (
                            <div key={idx} className={`rounded-xl p-5 border-2 transition-all hover:shadow-md ${isVerified ? 'bg-white border-green-100' : isFailed ? 'bg-red-50 border-red-200' : 'bg-white border-orange-100'}`}>
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isVerified ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                    <User className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900">{ubo.name || 'Unknown Person'}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <Globe className="w-3 h-3 text-gray-400" />
                                      <span className="text-xs text-gray-500 font-medium">{ubo.country || 'Not specified'}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-black text-blue-600 leading-none">{ubo.ownership || 0}%</p>
                                  <Badge 
                                    variant="outline" 
                                    className={`mt-2 border-none px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                                      isVerified ? 'bg-green-100 text-green-700' : 
                                      isFailed ? 'bg-red-100 text-red-700' : 
                                      'bg-orange-100 text-orange-700'
                                    }`}
                                  >
                                    {displayStatus}
                                  </Badge>
                                </div>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(ubo.ownership || 0, 100)}%` }}
                                  className={`h-full rounded-full ${isVerified ? 'bg-green-500' : isFailed ? 'bg-red-500' : 'bg-orange-400'}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}


                  </div>

                  {/* Complex Ownership Structure Diagram */}
                  <div className="mt-8 border-t border-gray-100 pt-8">
                    <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-3">
                      <Network className="w-6 h-6 text-indigo-600" />
                      Visual Ownership Hierarchy
                    </h3>
                    {ubos.length === 0 ? (
                      <div className="p-8 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-500 text-sm">
                        Insufficient data to render the ownership map.
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-10 rounded-2xl border border-slate-200 overflow-x-auto shadow-inner">
                        <div className="flex flex-col items-center pb-4" style={{ minWidth: `${Math.max(400, ubos.length * 280)}px` }}>
                          {/* Root node */}
                          <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white border-2 border-blue-600 text-blue-600 rounded-2xl px-10 py-6 shadow-xl min-w-[280px] text-center z-10"
                          >
                            <Building className="w-10 h-10 mx-auto mb-3 text-blue-600" />
                            <span className="font-black text-xl tracking-tight uppercase">{client?.name || 'Primary Entity'}</span>
                            <div className="mt-2 flex items-center justify-center gap-2">
                              <Badge className="bg-blue-600 text-white border-none text-[10px] uppercase font-bold">Target Client</Badge>
                              <Badge variant="outline" className="text-blue-600 border-blue-200 text-[10px] uppercase font-bold">{client?.entityType}</Badge>
                            </div>
                          </motion.div>

                          {/* Vertical line down to Intermediate */}
                          <div className="w-0.5 bg-slate-300 h-10"></div>

                          {/* Intermediate Holding Company Level (Level 2) */}
                          <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-indigo-600 text-white rounded-xl px-8 py-4 shadow-lg border-2 border-indigo-700 min-w-[240px] text-center z-10 transition-transform hover:scale-105"
                          >
                            <Building className="w-7 h-7 mx-auto mb-2 text-indigo-200" />
                            <span className="font-bold text-lg">{client?.entityType === 'Trust' ? 'Corporate Trustee' : 'Holding Company / Intermediary'}</span>
                            <p className="text-[10px] text-indigo-200 uppercase font-black tracking-widest mt-1">Level 1 Ownership Layer</p>
                          </motion.div>

                          {/* Vertical line down to UBO Connector */}
                          <div className="w-0.5 bg-slate-300 h-10"></div>

                          {/* Horizontal connector to UBOs */}
                          {ubos.length > 1 && (
                            <div className="h-0.5 bg-slate-300" style={{ width: `${(ubos.length - 1) * 260}px` }}></div>
                          )}

                          {/* Children (UBOs) */}
                          <div className="flex justify-center gap-10 mt-0">
                            {ubos.map((ubo, idx) => {
                              const statusVal = ubo.verified as unknown as string | boolean;
                              let isVerified = false;
                              if (typeof statusVal === 'string') isVerified = statusVal.toLowerCase() === 'verified';
                              else if (typeof statusVal === 'boolean') isVerified = statusVal;

                              return (
                                <div key={idx} className="flex flex-col items-center w-[220px]">
                                  <div className="w-0.5 bg-slate-300 h-10"></div>

                                  <motion.div 
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + (idx * 0.1) }}
                                    className={`p-5 rounded-2xl shadow-xl border-2 w-full transition-all hover:-translate-y-2 hover:shadow-2xl ${isVerified ? 'bg-white border-green-400' : 'bg-white border-orange-400'}`}
                                  >
                                    <div className="text-center mb-4">
                                      <div className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center ${isVerified ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'}`}>
                                        <User className="w-8 h-8" />
                                      </div>
                                      <p className="font-black text-gray-900 leading-tight text-lg">{ubo.name || 'Unknown'}</p>
                                      <p className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-widest">{ubo.country || 'N/A'}</p>
                                    </div>

                                    <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                                      <span className="font-bold text-slate-400 uppercase tracking-tighter text-[10px]">Beneficial Int:</span>
                                      <span className="font-black text-blue-600 text-base">{ubo.ownership || 0}%</span>
                                    </div>

                                    <div className="text-center">
                                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isVerified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${isVerified ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`} />
                                        {isVerified ? 'Verified' : 'Pending'}
                                      </div>
                                    </div>
                                  </motion.div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })()}

      {/* FINANCIAL TAB */}
      {activeTab === 'financial' && (
        <>
          <Card className="border-2 border-blue-300 shadow-lg mb-6">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-blue-600" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Bank Accounts</p>
                  <p className="text-3xl font-bold text-green-600">{client.financialData.bankAccounts}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Estimated Wealth</p>
                  <p className="text-xl font-bold text-blue-600">{client.financialData.estimatedWealth}</p>
                </div>
                <div className={`rounded-lg p-4 border ${client.financialData.highRiskTransactions > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <p className="text-sm text-gray-600 mb-1">High Risk Transactions</p>
                  <p className={`text-3xl font-bold ${client.financialData.highRiskTransactions > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {client.financialData.highRiskTransactions}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">Transaction Activity</h3>
                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                  <p className="text-sm text-gray-600 mb-1">Monthly Transaction Volume</p>
                  <p className="text-2xl font-bold text-cyan-600">{client.financialData.transactionVolume}</p>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Equifax Credit Score Section */}
          <div className="mb-6">
            <EquifaxCreditScoreCard data={getEquifaxData(client)} />
          </div>

          {/* Illion Business Credit Section */}
          <div className="mb-6">
            <IllionBusinessCard data={getIllionData(client)} />
          </div>

          {/* SOF / SOW Assessment Panel */}
          <div className="mb-6">
            <h3 className="font-bold text-2xl mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
              Financial Intelligence Assessment
            </h3>
            <SOFAssessmentPanel data={getSOFData(client)} />
          </div>

          {/* High Risk Transactions and Source of Funds Proof */}

          <HighRiskTransactionsDisplay
            transactions={HIGH_RISK_TRANSACTIONS_DATABASE[client.id]?.highRiskTransactions || []}
            sourceOfFundsProof={HIGH_RISK_TRANSACTIONS_DATABASE[client.id]?.sourceOfFundsProof || []}
          />

        </>
      )}

      {/* FRAUD DETECTION TAB */}
      {activeTab === 'fraud' && (
        <Card className="border-2 border-red-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
              Fraud Detection & Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Fraud Risk Score */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-semibold">Fraud Score</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">Low</p>
                  <p className="text-sm text-gray-600 mt-1">2/100 risk</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <p className="font-semibold">Identity Checks</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">Passed</p>
                  <p className="text-sm text-gray-600 mt-1">All verified</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <p className="font-semibold">Behavioral</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">Normal</p>
                  <p className="text-sm text-gray-600 mt-1">No anomalies</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-semibold">Device Trust</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">Trusted</p>
                  <p className="text-sm text-gray-600 mt-1">Verified device</p>
                </div>
              </div>

              {/* Fraud Indicators */}
              <div>
                <h3 className="font-bold text-lg mb-4">Fraud Indicators Assessment</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold">Document Authenticity</p>
                        <p className="text-sm text-gray-600">All documents verified as genuine</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">Clear</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold">Synthetic Identity Detection</p>
                        <p className="text-sm text-gray-600">No synthetic identity patterns detected</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">Clear</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold">Velocity Checks</p>
                        <p className="text-sm text-gray-600">No duplicate or rapid-fire applications</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">Clear</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold">Geolocation Analysis</p>
                        <p className="text-sm text-gray-600">Location data consistent with profile</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">Clear</Badge>
                  </div>
                </div>
              </div>

              {/* AI Analysis Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="font-bold text-lg">AI Fraud Analysis Summary</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Comprehensive fraud detection analysis completed using 14 automated rules and 4 AI models.
                  No fraud indicators detected. All documents authentic, identity consistent, and behavioral patterns normal.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Confidence Score</p>
                    <p className="text-2xl font-bold text-blue-600">98%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                    <p className="text-2xl font-bold text-green-600">Low</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RUN CHECKS TAB */}
      {activeTab === 'run-checks' && (
        <Card className="border-2 border-blue-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-blue-600" />
              Manual Verification System
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  className="h-auto py-4 flex-col gap-2 bg-[#13B5EA] hover:bg-[#0E7C9E]"
                  onClick={() => {
                    toast.info(`Initiating Equifax Identity Check for ${client.name}...`);
                    handleRefresh();
                  }}
                  disabled={isRefreshing}
                >
                  <Shield className={`w-6 h-6 ${isRefreshing && activeTab === 'run-checks' ? 'animate-pulse' : ''}`} />
                  <span className="font-semibold">Run Identity Check</span>
                  <span className="text-xs opacity-80">Verify via Equifax/GreenID</span>
                </Button>
                <Button 
                  className="h-auto py-4 flex-col gap-2 bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    toast.info(`Running global AML Screening for ${client.name}...`);
                    handleRefresh();
                  }}
                  disabled={isRefreshing}
                >
                  <Search className={`w-6 h-6 ${isRefreshing && activeTab === 'run-checks' ? 'animate-pulse' : ''}`} />
                  <span className="font-semibold">Run AML Screening</span>
                  <span className="text-xs opacity-80">PEP, Sanctions, Watchlists</span>
                </Button>
                <Button 
                  className="h-auto py-4 flex-col gap-2 bg-orange-600 hover:bg-orange-700"
                  onClick={() => {
                    toast.info(`Requesting Credit Bureau Report for ${client.name}...`);
                    handleRefresh();
                  }}
                  disabled={isRefreshing}
                >
                  <CreditCard className={`w-6 h-6 ${isRefreshing && activeTab === 'run-checks' ? 'animate-pulse' : ''}`} />
                  <span className="font-semibold">Run Credit Check</span>
                  <span className="text-xs opacity-80">Credit score and history</span>
                </Button>
                <Button 
                  className="h-auto py-4 flex-col gap-2 bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    toast.info(`Performing AI Fraud Signature Analysis...`);
                    handleRefresh();
                  }}
                  disabled={isRefreshing}
                >
                  <AlertCircle className={`w-6 h-6 ${isRefreshing && activeTab === 'run-checks' ? 'animate-pulse' : ''}`} />
                  <span className="font-semibold">Run Fraud Scan</span>
                  <span className="text-xs opacity-80">Multi-factor fraud analysis</span>
                </Button>
              </div>

              {/* Recent Checks */}
              <div>
                <h3 className="font-bold text-lg mb-4">Recent Checks</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">Identity Verification (Equifax)</p>
                        <p className="text-sm text-gray-600">Run on {new Date().toLocaleDateString()} by compliance@growkyc.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">Passed</Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-semibold">AML Screening</p>
                        <p className="text-sm text-gray-600">Run on {new Date().toLocaleDateString()} by compliance@growkyc.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">Clear</Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-semibold">Fraud Detection Scan</p>
                        <p className="text-sm text-gray-600">Run on {new Date().toLocaleDateString()} by fraud@growkyc.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">No Issues</Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Bulk Verification</h3>
                    <p className="text-sm text-gray-600">Run all verification checks at once</p>
                  </div>
                  <Button className="bg-[#13B5EA] hover:bg-[#0E7C9E]">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Run All Checks
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  This will run: Identity verification, AML screening, Credit check, Fraud scan, and generate a comprehensive compliance report.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LEGAL TAB */}
      {activeTab === 'legal' && (
        <>
          {/* Legal Matters Display */}
          <LegalMattersDisplay
            legalData={LEGAL_MATTERS_DATABASE[client.id] || {
              clientId: client.id,
              hasLegalIssues: false,
              legalMatters: [],
              regulatoryActions: [],
              companyStrikeOffs: [],
              legalConcerns: [],
              overallLegalRisk: 'Low'
            }}
          />
        </>
      )}

      {/* COMPLIANCE TAB */}
      {activeTab === 'compliance' && (
        <Card className="border-2 border-blue-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Compliance Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className={`rounded-lg p-4 border ${client.legalData.serviceAgreementSigned ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {client.legalData.serviceAgreementSigned ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className="font-semibold">Service Agreement</p>
                </div>
                <p className="text-lg">{client.legalData.serviceAgreementSigned ? 'Signed' : 'Pending'}</p>
              </div>
              <div className={`rounded-lg p-4 border ${client.legalData.termsAccepted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {client.legalData.termsAccepted ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className="font-semibold">Terms Accepted</p>
                </div>
                <p className="text-lg">{client.legalData.termsAccepted ? 'Yes' : 'No'}</p>
              </div>
              <div className={`rounded-lg p-4 border ${client.legalData.privacyConsentGiven ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {client.legalData.privacyConsentGiven ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className="font-semibold">Privacy Consent</p>
                </div>
                <p className="text-lg">{client.legalData.privacyConsentGiven ? 'Given' : 'Not Given'}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4">Engagement Documents</h3>
              <div className="space-y-3">
                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                  <p className="text-sm text-gray-600">Engagement Letter Date</p>
                  <p className="text-lg font-bold">{client.legalData.engagementLetterDate}</p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                  <p className="text-sm text-gray-600">KYC Consent Date</p>
                  <p className="text-lg font-bold">{client.legalData.kycConsentDate}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAgreementModal(true)}>
                <Eye className="w-4 h-4 mr-2" />
                View Service Agreement
              </Button>
              <Button variant="outline" onClick={() => {
                toast.success('All compliance and legal documents downloaded successfully as a signed ZIP archive.', {
                  description: `Archive contains: Service Agreement, Engagement Letter, and KYC Consent for ${client.name}.`
                });
              }}>
                <Download className="w-4 h-4 mr-2" />
                Download All Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DOCUMENTS TAB */}
      {activeTab === 'documents' && (
        <>
          {/* Integration Documents Display */}
          <IntegrationDocumentsDisplay
            documentRepo={getIntegrationDocumentsData(client)}
          />
        </>
      )}

      {/* MONITORING TAB */}
      {activeTab === 'monitoring' && (
        <EnhancedMonitoringTab
          clientId={client.id}
          clientName={client.name}
          monitoringData={client.monitoringData}
        />
      )}

      {/* DECISIONS TAB */}
      {activeTab === 'decisions' && (
        <div className="space-y-6">
          <EnhancedDecisionTab
            decision={DECISION_DATABASE[client.id] || {
              clientId: client.id,
              clientName: client.name,
              decision: client.decisionsData?.onboardingDecision || 'Pending',
              decisionDate: client.decisionsData?.onboardingDate || 'Unknown',
              decisionMaker: client.decisionsData?.approver || 'Unknown',
              decisionMakerRole: 'Compliance Manager',
              executiveSummary: 'No detailed decision record available.',
              issuesIdentified: [],
              riskAssessments: [],
              approvalReasoning: { keyStrengths: [], concernsAddressed: [], conditionsApplied: [], ongoingMonitoring: [] },
              decisionComments: 'Standard onboarding decision.',
              escalations: [],
              reviewHistory: []
            }}
          />
          <DecisionsTab clientId={client.id} />
        </div>
      )}

      {/* AUSTRAC TAB */}
      {activeTab === 'austrac' && (
        <EnhancedAustracTab
          clientName={client.name}
          smrs={AUSTRAC_REPORTS_DATABASE[client.id]?.smrs || []}
          summary={AUSTRAC_REPORTS_DATABASE[client.id]?.summary || {
            totalSMRs: client.austracData?.smrsFiled || 0,
            totalTTRs: client.austracData?.ttrsFiled || 0,
            lastReportDate: client.austracData?.lastReportDate || '',
            activeConcerns: client.austracData?.suspiciousActivity || false
          }}
        />
      )}

      {/* AUDIT TAB */}
      {activeTab === 'audit' && (
        <AuditTab clientId={client.id} />
      )}

      {/* Service Agreement Modal */}
      <Dialog open={showAgreementModal} onOpenChange={setShowAgreementModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white border border-slate-100 rounded-2xl shadow-2xl">
          <DialogHeader className="bg-slate-900 p-6 text-white border-b border-slate-800">
            <DialogTitle className="flex items-center gap-3 text-lg font-bold text-white">
              <Shield className="w-6 h-6 text-indigo-400" />
              <div>
                <span className="block text-xs text-slate-400 uppercase tracking-widest font-bold">Standard Client Document</span>
                Master Service Agreement & Consent
              </div>
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs mt-1">
              Document reference: MSA-2024-{client.id} | Generated: {client.legalData?.engagementLetterDate || '2024-01-15'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 space-y-4 overflow-y-auto text-sm text-slate-600 leading-relaxed font-normal">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between text-xs mb-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contracting Client</span>
                <span className="font-bold text-slate-800">{client.name}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Agreement Status</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${client.legalData.serviceAgreementSigned ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {client.legalData.serviceAgreementSigned ? 'Signed & Executed' : 'Pending Execution'}
                </span>
              </div>
            </div>

            <h4 className="font-bold text-slate-800 text-base border-b pb-1">1. Scope of Services & AML/CTF Compliance</h4>
            <p>
              Grow KYC Pty Ltd (referred to as the "Service Provider") will perform identity verification, owner screening, and comprehensive AML/CTF reporting services for <strong>{client.name}</strong> (referred to as the "Client") in strict compliance with the Anti-Money Laundering and Counter-Terrorism Financing Act 2006 (Cth) and associated AUSTRAC regulations.
            </p>

            <h4 className="font-bold text-slate-800 text-base border-b pb-1">2. Client Consent & Privacy Policy</h4>
            <p>
              By agreeing to this Service Agreement, the Client explicitly consents to the verification of their identity and corporate structure against independent sources, credit reporting bureaus, government registers (including ASIC and ABR), and sanctions databases. Personal data is managed in strict alignment with the Privacy Act 1988 (Cth).
            </p>

            <h4 className="font-bold text-slate-800 text-base border-b pb-1">3. Record Retention Obligations</h4>
            <p>
              The Service Provider is legally mandated to maintain all audit logs, risk assessment records, evidence packages, and onboarding data for a minimum period of <strong>seven (7) years</strong> following the termination of the business relationship, in accordance with AUSTRAC CDD guidelines.
            </p>

            <h4 className="font-bold text-slate-800 text-base border-b pb-1">4. Cryptographic Validation & Sign-off</h4>
            <p>
              This document is cryptographically signed and stored in our secure compliance ledger. Any modifications to this document post-execution will invalidate the verification hash.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-400 font-mono">
              Hash: SHA256-42d8f99e...a28e
            </div>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold" onClick={() => setShowAgreementModal(false)}>
              Close Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
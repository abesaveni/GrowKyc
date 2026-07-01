import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from '../../lib/toast';
import { downloadRecordPdf } from '../../lib/exportPdf';
import { InternalReferral } from './InternalReferral';
import { ReportableMatterTriage } from './ReportableMatterTriage';
import { SubmissionTracking } from './SubmissionTracking';
import { ReportingRulesAndTriggers } from './ReportingRulesTriggers';
import { ReportDraftBuilder } from './ReportDraftBuilder';
import { CaseInvestigationWorkbench } from './CaseInvestigationWorkbench';
import { ComplianceManagerDecision } from './ComplianceManagerDecision';
import { AuditEvidencePack } from './AuditEvidencePack';
import { ClientsDB } from '../kyc/ClientsDatabase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Shield,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Plus,
  Download,
  Filter,
  Search,
  TrendingUp,
  AlertCircle,
  Activity,
  Users,
  Building,
  Settings,
  ArrowLeft
} from 'lucide-react';

type CaseStatus = 'new' | 'in_triage' | 'under_investigation' | 'draft_in_progress' | 'awaiting_manager' | 'approved' | 'submitted' | 'acknowledged' | 'monitoring_only' | 'not_reportable' | 'closed';
type TriggerSource = 'sanctions' | 'pep' | 'adverse_media' | 'identity' | 'kyb' | 'ownership' | 'sof' | 'sow' | 'court' | 'monitoring' | 'manual';
type RiskBand = 'low' | 'medium' | 'high' | 'critical';

interface AUSTRACCase {
  caseId: string;
  subject: string;
  subjectType: 'individual' | 'company' | 'trust' | 'partnership';
  triggerSource: TriggerSource;
  riskBand: RiskBand;
  assignedReviewer: string;
  status: CaseStatus;
  createdDate: string;
  slaHours: number;
  slaRemaining: number;
}

interface DraftReport {
  caseId: string;
  subject: string;
  draftType: 'smr' | 'escalation' | 'partner_summary' | 'case_pack';
  preparedBy: string;
  awaiting: string;
  lastUpdated: string;
}

interface RecentSubmission {
  caseId: string;
  subject: string;
  outcome: 'submitted' | 'not_submitted' | 'monitoring_only';
  decisionOwner: string;
  closedDate: string;
}

interface AUSTRACControlCentreProps {
  navigateTo?: (page: string, caseId?: string, label?: string) => void;
  goBack?: () => void;
  defaultSelectedCaseId?: string | null;
}

type AustracSubPanel =
  | 'dashboard'
  | 'triage'
  | 'draft_builder'
  | 'tracking'
  | 'rules'
  | 'investigation'
  | 'manager_decision'
  | 'evidence_pack';

const STATIC_AUSTRAC_CASES: AUSTRACCase[] = [
  {
    caseId: 'AUS-2026-001',
    subject: 'Innovation Partners Trust',
    subjectType: 'trust',
    triggerSource: 'adverse_media',
    riskBand: 'high',
    assignedReviewer: 'Sarah Johnson',
    status: 'under_investigation',
    createdDate: '2026-03-18',
    slaHours: 72,
    slaRemaining: 24,
  },
  {
    caseId: 'AUS-2026-002',
    subject: 'ABC Enterprises Pty Ltd',
    subjectType: 'company',
    triggerSource: 'sanctions',
    riskBand: 'critical',
    assignedReviewer: 'Michael Chen',
    status: 'draft_in_progress',
    createdDate: '2026-03-20',
    slaHours: 24,
    slaRemaining: 8,
  },
  {
    caseId: 'AUS-2026-003',
    subject: 'David Chen',
    subjectType: 'individual',
    triggerSource: 'pep',
    riskBand: 'medium',
    assignedReviewer: 'Lisa Martinez',
    status: 'awaiting_manager',
    createdDate: '2026-03-19',
    slaHours: 72,
    slaRemaining: 48,
  },
  {
    caseId: 'AUS-2026-004',
    subject: 'TechCorp Pty Ltd',
    subjectType: 'company',
    triggerSource: 'sof',
    riskBand: 'high',
    assignedReviewer: 'Sarah Johnson',
    status: 'in_triage',
    createdDate: '2026-03-21',
    slaHours: 48,
    slaRemaining: 46,
  },
  {
    caseId: 'AUS-2026-005',
    subject: 'Melbourne Family Trust',
    subjectType: 'trust',
    triggerSource: 'ownership',
    riskBand: 'medium',
    assignedReviewer: 'Michael Chen',
    status: 'new',
    createdDate: '2026-03-21',
    slaHours: 48,
    slaRemaining: 48,
  },
];

function buildClientAustracCases(clients: any[]): AUSTRACCase[] {
  return clients
    .filter(
      (c) =>
        c.status === 'Under Review' ||
        c.status === 'Suspended' ||
        c.amlData?.riskRating === 'Critical' ||
        c.amlData?.riskRating === 'High'
    )
    .map((c) => {
      let triggerSource: TriggerSource = 'monitoring';
      if (c.amlData?.sanctionsMatches > 0) triggerSource = 'sanctions';
      else if (c.amlData?.pepStatus && c.amlData.pepStatus !== 'Not PEP') triggerSource = 'pep';
      else if (c.amlData?.adverseMediaHits > 0) triggerSource = 'adverse_media';
      else if (c.riskScores?.overall >= 75) triggerSource = 'sof';

      const riskBand = (c.amlData?.riskRating || 'medium').toLowerCase() as RiskBand;
      const subjectType =
        c.entityType?.toLowerCase() === 'individual'
          ? 'individual'
          : c.entityType?.toLowerCase() === 'trust'
            ? 'trust'
            : 'company';

      return {
        caseId: `AUS-CL-${c.id}`,
        subject: c.name,
        subjectType,
        triggerSource,
        riskBand,
        assignedReviewer: c.amlData?.riskRating === 'Critical' ? 'Sarah Chen' : 'Emma Williams',
        status: c.status === 'Suspended' ? 'under_investigation' : 'in_triage',
        createdDate: (c.lastReview || new Date().toISOString().split('T')[0]).slice(0, 10),
        slaHours: 48,
        slaRemaining: c.status === 'Suspended' ? 6 : 28,
      };
    });
}

export function AUSTRACControlCentre({ navigateTo, goBack, defaultSelectedCaseId }: AUSTRACControlCentreProps) {
  const navigate = useNavigate();
  const [activeSubPanel, setActiveSubPanel] = useState<AustracSubPanel>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(defaultSelectedCaseId ?? null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReferralModal, setShowReferralModal] = useState(false);

  const handleExportRegister = () => {
    // Generate CSV content of all current AUSTRAC cases in active register
    const headers = ['Case ID', 'Subject', 'Subject Type', 'Trigger Source', 'Risk Band', 'Assigned Reviewer', 'Status', 'Created Date', 'SLA Hours', 'SLA Remaining'];
    const rows = cases.map(c => [
      c.caseId,
      c.subject,
      c.subjectType,
      c.triggerSource,
      c.riskBand,
      c.assignedReviewer,
      c.status,
      c.createdDate,
      c.slaHours,
      c.slaRemaining
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `austrac_compliance_register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('AUSTRAC Active Matters Register successfully exported as CSV!');
  };

  const handleDownloadReceipt = (caseId: string) => {
    downloadRecordPdf(
      `austrac_filing_receipt_${caseId}.pdf`,
      'AUSTRAC Submission Filing Receipt',
      [
        ['Submission ID', `SUB-${Math.floor(100000 + Math.random() * 900000)}`],
        ['Date Filed', new Date().toISOString().split('T')[0]],
        ['Filing Authority', 'AUSTRAC Gateway Production'],
        ['Subject Case ID', caseId],
        ['Status', 'ACKNOWLEDGED / ARCHIVED'],
        ['Signature (MD5)', Math.random().toString(36).substring(7)],
      ],
      'CONFIDENTIAL SECURE SYSTEM RECORD — generated from the GrowKYC AUSTRAC module.',
    );
    toast.success(`Filing receipt for ${caseId} downloaded as PDF`);
  };


  const [clients, setClients] = useState<any[]>([]);
  const [manualCases, setManualCases] = useState<AUSTRACCase[]>([]);
  const [caseRefreshKey, setCaseRefreshKey] = useState(0);

  const loadManualCases = useCallback(() => {
    try {
      const stored = localStorage.getItem('austrac_custom_cases');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setManualCases(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Error loading custom AUSTRAC cases', e);
    }
    setManualCases([]);
  }, []);

  useEffect(() => {
    setClients(ClientsDB.getClients());
    return ClientsDB.subscribe(setClients);
  }, []);

  useEffect(() => {
    loadManualCases();
    const onCasesUpdated = () => {
      loadManualCases();
      setCaseRefreshKey((k) => k + 1);
    };
    window.addEventListener('growkyc:cases_updated', onCasesUpdated);
    window.addEventListener('growkyc:clients_updated', onCasesUpdated);
    return () => {
      window.removeEventListener('growkyc:cases_updated', onCasesUpdated);
      window.removeEventListener('growkyc:clients_updated', onCasesUpdated);
    };
  }, [loadManualCases]);



  const returnToDashboard = () => {
    const lastRole = localStorage.getItem('growkyc_last_role') || 'compliance';
    navigate(`/${lastRole}/dashboard`);
  };

  // Unified state handling for draft reports, submissions, and cases
  interface Submission {
    caseId: string;
    reportType: 'smr' | 'ttr' | 'ifti';
    subject: string;
    decisionDate: string;
    submissionMethod: 'online' | 'email' | 'manual';
    status: string;
    submittedBy: string;
    acknowledgementStatus: string;
    lastUpdated: string;
    submissionRef?: string;
    retryCount?: number;
  }

  // Dynamic cases state loaded from localStorage & static mock data
  const [cases, setCases] = useState<AUSTRACCase[]>([]);
  const [draftReports, setDraftReports] = useState<DraftReport[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const staticCases: AUSTRACCase[] = [
      {
        caseId: 'AUS-2026-001',
        subject: 'Innovation Partners Trust',
        subjectType: 'trust',
        triggerSource: 'adverse_media',
        riskBand: 'high',
        assignedReviewer: 'Sarah Johnson',
        status: 'under_investigation',
        createdDate: '2026-03-18',
        slaHours: 72,
        slaRemaining: 24
      },
      {
        caseId: 'AUS-2026-002',
        subject: 'ABC Enterprises Pty Ltd',
        subjectType: 'company',
        triggerSource: 'sanctions',
        riskBand: 'critical',
        assignedReviewer: 'Michael Chen',
        status: 'draft_in_progress',
        createdDate: '2026-03-20',
        slaHours: 24,
        slaRemaining: 8
      },
      {
        caseId: 'AUS-2026-003',
        subject: 'David Chen',
        subjectType: 'individual',
        triggerSource: 'pep',
        riskBand: 'medium',
        assignedReviewer: 'Lisa Martinez',
        status: 'awaiting_manager',
        createdDate: '2026-03-19',
        slaHours: 72,
        slaRemaining: 48
      },
      {
        caseId: 'AUS-2026-004',
        subject: 'TechCorp Pty Ltd',
        subjectType: 'company',
        triggerSource: 'sof',
        riskBand: 'high',
        assignedReviewer: 'Sarah Johnson',
        status: 'in_triage',
        createdDate: '2026-03-21',
        slaHours: 48,
        slaRemaining: 46
      },
      {
        caseId: 'AUS-2026-005',
        subject: 'Melbourne Family Trust',
        subjectType: 'trust',
        triggerSource: 'ownership',
        riskBand: 'medium',
        assignedReviewer: 'Michael Chen',
        status: 'new',
        createdDate: '2026-03-21',
        slaHours: 48,
        slaRemaining: 48
      }
    ];

    const defaultDrafts: DraftReport[] = [
      {
        caseId: 'AUS-2026-002',
        subject: 'ABC Enterprises Pty Ltd',
        draftType: 'smr',
        preparedBy: 'Michael Chen',
        awaiting: 'MLRO Approval',
        lastUpdated: '2026-03-21 10:30'
      },
      {
        caseId: 'AUS-2026-003',
        subject: 'David Chen',
        draftType: 'escalation',
        preparedBy: 'Lisa Martinez',
        awaiting: 'Manager Review',
        lastUpdated: '2026-03-21 09:15'
      }
    ];

    const defaultSubmissions: Submission[] = [
      {
        caseId: 'AUS-2026-002',
        reportType: 'smr',
        subject: 'ABC Enterprises Pty Ltd',
        decisionDate: '2026-03-21',
        submissionMethod: 'online',
        status: 'submitted',
        submittedBy: 'Lisa Martinez (MLRO)',
        acknowledgementStatus: 'Pending',
        lastUpdated: '2026-03-21 15:30',
        submissionRef: 'SMR-2026-AUS-00215',
        retryCount: 0
      },
      {
        caseId: 'AUS-2026-001',
        reportType: 'smr',
        subject: 'Innovation Partners Trust',
        decisionDate: '2026-03-20',
        submissionMethod: 'online',
        status: 'acknowledged',
        submittedBy: 'Lisa Martinez (MLRO)',
        acknowledgementStatus: 'Received - AUSTRAC-ACK-789456',
        lastUpdated: '2026-03-20 14:00',
        submissionRef: 'SMR-2026-AUS-00214'
      },
      {
        caseId: 'AUS-2026-000',
        reportType: 'smr',
        subject: 'Green Valley SMSF',
        decisionDate: '2026-03-19',
        submissionMethod: 'online',
        status: 'not_submitted',
        submittedBy: 'Sarah Johnson',
        acknowledgementStatus: 'N/A - Not submitted',
        lastUpdated: '2026-03-19 10:00'
      },
      {
        caseId: 'AUS-2025-099',
        reportType: 'smr',
        subject: 'Jennifer Williams',
        decisionDate: '2026-03-18',
        submissionMethod: 'online',
        status: 'closed',
        submittedBy: 'MLRO',
        acknowledgementStatus: 'Case closed - No submission',
        lastUpdated: '2026-03-18 16:45'
      },
      {
        caseId: 'AUS-2025-098',
        reportType: 'smr',
        subject: 'Coastal Ventures Partnership',
        decisionDate: '2026-03-17',
        submissionMethod: 'online',
        status: 'acknowledged',
        submittedBy: 'MLRO',
        acknowledgementStatus: 'Received - AUSTRAC-ACK-789321',
        lastUpdated: '2026-03-17 09:30',
        submissionRef: 'SMR-2026-AUS-00213'
      },
      {
        caseId: 'AUS-2025-097',
        reportType: 'smr',
        subject: 'Tech Solutions Pty Ltd',
        decisionDate: '2026-03-15',
        submissionMethod: 'online',
        status: 'failed',
        submittedBy: 'Michael Chen',
        acknowledgementStatus: 'Submission failed - Retry required',
        lastUpdated: '2026-03-15 11:20',
        submissionRef: 'SMR-2026-AUS-00212',
        retryCount: 2
      },
      {
        caseId: 'AUS-2025-096',
        reportType: 'smr',
        subject: 'Property Holdings Trust',
        decisionDate: '2026-03-14',
        submissionMethod: 'email',
        status: 'approved',
        submittedBy: 'MLRO',
        acknowledgementStatus: 'Awaiting submission',
        lastUpdated: '2026-03-14 14:00'
      }
    ];

    try {
      const storedAll = localStorage.getItem('austrac_cases');
      if (storedAll) {
        setCases(JSON.parse(storedAll));
      } else {
        const storedCustom = localStorage.getItem('austrac_custom_cases');
        const customCases = storedCustom ? JSON.parse(storedCustom) : [];
        const merged = [...customCases, ...staticCases];
        localStorage.setItem('austrac_cases', JSON.stringify(merged));
        setCases(merged);
      }
    } catch (e) {
      setCases(staticCases);
    }

    try {
      const storedDrafts = localStorage.getItem('austrac_draft_reports');
      if (storedDrafts) {
        setDraftReports(JSON.parse(storedDrafts));
      } else {
        localStorage.setItem('austrac_draft_reports', JSON.stringify(defaultDrafts));
        setDraftReports(defaultDrafts);
      }
    } catch (e) {
      setDraftReports(defaultDrafts);
    }

    try {
      const storedSubmissions = localStorage.getItem('austrac_submissions');
      if (storedSubmissions) {
        setSubmissions(JSON.parse(storedSubmissions));
      } else {
        localStorage.setItem('austrac_submissions', JSON.stringify(defaultSubmissions));
        setSubmissions(defaultSubmissions);
      }
    } catch (e) {
      setSubmissions(defaultSubmissions);
    }
  }, []);

  // Reload everything from localStorage when returning to dashboard to keep it in sync
  useEffect(() => {
    if (activeSubPanel === 'dashboard') {
      try {
        const storedCases = localStorage.getItem('austrac_cases');
        if (storedCases) setCases(JSON.parse(storedCases));

        const storedDrafts = localStorage.getItem('austrac_draft_reports');
        if (storedDrafts) setDraftReports(JSON.parse(storedDrafts));

        const storedSubmissions = localStorage.getItem('austrac_submissions');
        if (storedSubmissions) setSubmissions(JSON.parse(storedSubmissions));
      } catch (e) {
        console.error('Failed to reload AUSTRAC data', e);
      }
    }
  }, [activeSubPanel]);


  // Dynamic KPIs derived from active cases
  const kpis = {
    openMatters: cases.filter(c => c.status !== 'closed' && c.status !== 'not_reportable').length,
    draftsPending: cases.filter(c => c.status === 'draft_in_progress').length,
    escalatedCases: cases.filter(c => c.status === 'awaiting_manager').length,
    submittedReports: 28 + submissions.filter(s => s.status === 'submitted' || s.status === 'acknowledged').length,
    notReported: 15 + submissions.filter(s => s.status === 'not_submitted' || s.status === 'closed').length,
    overdueReviews: cases.filter(c => c.slaRemaining <= 0 && c.status !== 'closed' && c.status !== 'not_reportable').length,
    monitoringAlerts: 7,
    qaIssues: 1
  };

  // Derived recent submissions
  const recentSubmissions: RecentSubmission[] = submissions.map(s => {
    let outcome: 'submitted' | 'not_submitted' | 'monitoring_only' = 'submitted';
    if (s.status === 'closed') outcome = 'not_submitted';
    else if (s.status === 'not_submitted') outcome = 'monitoring_only';
    
    return {
      caseId: s.caseId,
      subject: s.subject,
      outcome,
      decisionOwner: s.submittedBy.split(' ')[0],
      closedDate: s.decisionDate
    };
  });

  const getStatusBadge = (status: CaseStatus) => {
    const config = {
      new: { label: 'New', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: AlertCircle },
      in_triage: { label: 'In Triage', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: Activity },
      under_investigation: { label: 'Under Investigation', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Eye },
      draft_in_progress: { label: 'Draft in Progress', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: FileText },
      awaiting_manager: { label: 'Awaiting Manager', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
      approved: { label: 'Approved', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
      submitted: { label: 'Submitted', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
      acknowledged: { label: 'Acknowledged', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
      monitoring_only: { label: 'Monitoring Only', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: Activity },
      not_reportable: { label: 'Not Reportable', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: XCircle },
      closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: CheckCircle }
    };

    const { label, color, icon: Icon } = config[status];
    return (
      <Badge className={`${color} text-xs px-2 py-1`}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getTriggerBadge = (source: TriggerSource) => {
    const labels = {
      sanctions: 'Sanctions',
      pep: 'PEP',
      adverse_media: 'Adverse Media',
      identity: 'Identity',
      kyb: 'KYB',
      ownership: 'Ownership',
      sof: 'Source of Funds',
      sow: 'Source of Wealth',
      court: 'Court/Litigation',
      monitoring: 'Monitoring',
      manual: 'Manual Referral'
    };
    return (
      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
        {labels[source]}
      </Badge>
    );
  };

  const getRiskBadge = (risk: RiskBand) => {
    const config = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-amber-100 text-amber-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700'
    };
    return (
      <Badge className={`${config[risk]} text-xs px-2 py-1`}>
        {risk.toUpperCase()}
      </Badge>
    );
  };

  const getSLAColor = (hoursRemaining: number) => {
    if (hoursRemaining <= 0) return 'text-red-600 font-bold';
    if (hoursRemaining <= 12) return 'text-orange-600 font-bold';
    if (hoursRemaining <= 24) return 'text-amber-600';
    return 'text-gray-700';
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.assignedReviewer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesRisk = filterRisk === 'all' || c.riskBand === filterRisk;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  if (activeSubPanel === 'triage') {
    return <ReportableMatterTriage caseId={selectedCaseId || undefined} onBack={() => setActiveSubPanel('dashboard')} />;
  }
  if (activeSubPanel === 'tracking') {
    return <SubmissionTracking onBack={() => setActiveSubPanel('dashboard')} />;
  }
  if (activeSubPanel === 'rules') {
    return <ReportingRulesAndTriggers onBack={() => setActiveSubPanel('dashboard')} />;
  }
  if (activeSubPanel === 'draft_builder') {
    return <ReportDraftBuilder caseId={selectedCaseId || undefined} onBack={() => setActiveSubPanel('dashboard')} />;
  }
  if (activeSubPanel === 'investigation') {
    return (
      <CaseInvestigationWorkbench
        caseId={selectedCaseId || undefined}
        onBack={() => setActiveSubPanel('dashboard')}
      />
    );
  }
  if (activeSubPanel === 'manager_decision') {
    return (
      <ComplianceManagerDecision
        caseId={selectedCaseId || undefined}
        onBack={() => setActiveSubPanel('dashboard')}
      />
    );
  }
  if (activeSubPanel === 'evidence_pack') {
    return <AuditEvidencePack onBack={() => setActiveSubPanel('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 md:p-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={returnToDashboard}
                className="bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 p-2 rounded-lg flex items-center justify-center flex-shrink-0"
                title="Return to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20 flex-shrink-0">
                  <Shield className="w-8 h-8 md:w-9 md:h-9" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">AUSTRAC Reporting</h1>
                  <p className="text-lg md:text-xl text-white/90">Control Centre</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 md:gap-2 w-full lg:w-auto lg:justify-end">
              <Button onClick={() => setActiveSubPanel('tracking')} className="bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 px-2.5 md:px-3 py-1.5 text-xs md:text-sm whitespace-nowrap flex-shrink-0 justify-center">
                <Activity className="w-4 h-4 mr-1.5 md:mr-2" />
                Submission Tracking
              </Button>
              <Button onClick={() => setActiveSubPanel('rules')} className="bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 px-2.5 md:px-3 py-1.5 text-xs md:text-sm whitespace-nowrap flex-shrink-0 justify-center">
                <Settings className="w-4 h-4 mr-1.5 md:mr-2" />
                Rules & Triggers
              </Button>
              <Button onClick={() => setActiveSubPanel('evidence_pack')} className="bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 px-2.5 md:px-3 py-1.5 text-xs md:text-sm whitespace-nowrap flex-shrink-0 justify-center">
                <FileText className="w-4 h-4 mr-1.5 md:mr-2" />
                Evidence Packs
              </Button>
              <Button
                onClick={() => {
                  const awaiting = cases.find((c) => c.status === 'awaiting_manager');
                  if (awaiting) setSelectedCaseId(awaiting.caseId);
                  setActiveSubPanel('manager_decision');
                }}
                className="bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 px-2.5 md:px-3 py-1.5 text-xs md:text-sm whitespace-nowrap flex-shrink-0 justify-center"
              >
                <Users className="w-4 h-4 mr-1.5 md:mr-2" />
                Manager Decisions
              </Button>
              <Button onClick={() => setShowReferralModal(true)} className="bg-white text-slate-800 hover:bg-slate-100 px-2.5 md:px-3 py-1.5 text-xs md:text-sm whitespace-nowrap flex-shrink-0 justify-center">
                <Plus className="w-4 h-4 mr-1.5 md:mr-2" />
                Create Manual Case
              </Button>
              <Button onClick={handleExportRegister} className="bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 px-2.5 md:px-3 py-1.5 text-xs md:text-sm whitespace-nowrap flex-shrink-0 justify-center">
                <Download className="w-4 h-4 mr-1.5 md:mr-2" />
                Export Register
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                <p className="text-xs text-gray-600 font-semibold">Open Matters</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{kpis.openMatters}</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <p className="text-xs text-gray-600 font-semibold">Drafts Pending</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{kpis.draftsPending}</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-xs text-gray-600 font-semibold">Escalated</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{kpis.escalatedCases}</p>
            </CardContent>
          </Card>

          <Card onClick={() => setActiveSubPanel('tracking')} className="border border-gray-200 bg-white cursor-pointer transition-all hover:bg-gray-50 hover:scale-105 duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-xs text-gray-600 font-semibold">Submitted</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{kpis.submittedReports}</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-gray-600" />
                <p className="text-xs text-gray-600 font-semibold">Not Reported</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{kpis.notReported}</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-red-600" />
                <p className="text-xs text-gray-600 font-semibold">Overdue</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{kpis.overdueReviews}</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <p className="text-xs text-gray-600 font-semibold">Mon. Alerts</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{kpis.monitoringAlerts}</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-purple-600" />
                <p className="text-xs text-gray-600 font-semibold">QA Issues</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{kpis.qaIssues}</p>
            </CardContent>
          </Card>
        </div>

        {/* Table A - Active Reportable Matters */}
        <Card className="border-2 border-blue-300 shadow-lg">
          <CardHeader className="bg-gray-50 border-b p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
                Active Reportable Matters
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full lg:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 w-full"
                  />
                </div>

                {/* Status Dropdown */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-semibold w-full sm:w-auto"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="in_triage">In Triage</option>
                  <option value="under_investigation">Under Investigation</option>
                  <option value="draft_in_progress">Draft in Progress</option>
                  <option value="awaiting_manager">Awaiting Manager</option>
                  <option value="approved">Approved</option>
                  <option value="submitted">Submitted</option>
                </select>

                {/* Risk Dropdown */}
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-semibold w-full sm:w-auto"
                >
                  <option value="all">All Risks</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-300">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Case ID</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Subject</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Trigger Source</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Risk</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Reviewer</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Created</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">SLA</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map((matter) => (
                    <tr key={matter.caseId} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-blue-900">{matter.caseId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {matter.subjectType === 'individual' ? <Users className="w-4 h-4 text-gray-600" /> : <Building className="w-4 h-4 text-gray-600" />}
                          <span className="font-semibold text-gray-900">{matter.subject}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700 capitalize">{matter.subjectType}</span>
                      </td>
                      <td className="py-3 px-4">{getTriggerBadge(matter.triggerSource)}</td>
                      <td className="py-3 px-4">{getRiskBadge(matter.riskBand)}</td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">{matter.assignedReviewer}</span>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(matter.status)}</td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">{matter.createdDate}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <span className={`text-sm ${getSLAColor(matter.slaRemaining)}`}>
                            {matter.slaRemaining > 0 ? `${matter.slaRemaining}h left` : 'OVERDUE'}
                          </span>
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div
                              className={`h-1 rounded-full ${matter.slaRemaining <= 0 ? 'bg-red-600' :
                                  matter.slaRemaining <= 12 ? 'bg-orange-600' :
                                    matter.slaRemaining <= 24 ? 'bg-amber-600' : 'bg-green-600'
                                }`}
                              style={{ width: `${Math.min(100, (matter.slaRemaining / matter.slaHours) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setSelectedCaseId(matter.caseId);
                              setActiveSubPanel('triage');
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Triage
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCaseId(matter.caseId);
                              setActiveSubPanel('investigation');
                            }}
                          >
                            <Activity className="w-4 h-4 mr-1" />
                            Investigate
                          </Button>
                          {matter.status === 'awaiting_manager' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-pink-300 text-pink-800"
                              onClick={() => {
                                setSelectedCaseId(matter.caseId);
                                setActiveSubPanel('manager_decision');
                              }}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Decide
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Table B - Draft Reports */}
        <Card className="border-2 border-orange-300 shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="w-7 h-7 text-orange-600" />
              Draft Reports Awaiting Decision
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-300">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Case ID</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Subject</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Draft Type</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Prepared By</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Awaiting</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Last Updated</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {draftReports.map((draft) => (
                    <tr key={draft.caseId} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-orange-900">{draft.caseId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">{draft.subject}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          {draft.draftType.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">{draft.preparedBy}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-semibold text-orange-700">{draft.awaiting}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">{draft.lastUpdated}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-orange-600 text-white border-orange-600 hover:bg-orange-700"
                          onClick={() => {
                            setSelectedCaseId(draft.caseId);
                            setActiveSubPanel('draft_builder');
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Table C - Recent Submissions */}
        <Card className="border-2 border-gray-300 shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-2xl flex items-center gap-2">
              <CheckCircle className="w-7 h-7 text-gray-600" />
              Recent Submissions and Closures
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-300">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Case ID</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Subject</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Outcome</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Decision Owner</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Closed Date</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((submission) => (
                    <tr key={submission.caseId} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-gray-900">{submission.caseId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">{submission.subject}</span>
                      </td>
                      <td className="py-3 px-4">
                        {submission.outcome === 'submitted' && (
                          <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Submitted
                          </Badge>
                        )}
                        {submission.outcome === 'not_submitted' && (
                          <Badge className="bg-gray-100 text-gray-700 border-gray-300 text-xs">
                            <XCircle className="w-3 h-3 mr-1" />
                            Not Submitted
                          </Badge>
                        )}
                        {submission.outcome === 'monitoring_only' && (
                          <Badge className="bg-indigo-100 text-indigo-700 border-indigo-300 text-xs">
                            <Activity className="w-3 h-3 mr-1" />
                            Monitoring Only
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">{submission.decisionOwner}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700">{submission.closedDate}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedCaseId(submission.caseId);
                              setActiveSubPanel('triage');
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              handleDownloadReceipt(submission.caseId);
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Create Manual Case Referral Dialog */}
        <Dialog open={showReferralModal} onOpenChange={setShowReferralModal}>
          <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 bg-white rounded-xl shadow-2xl">
            <DialogHeader className="border-b pb-4 mb-4">
              <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                <AlertTriangle className="w-5 h-5 text-slate-600" />
                Create Manual Case
              </DialogTitle>
              <DialogDescription className="text-gray-500 text-sm">
                Log a suspicious matter manually. A compliance officer will review it within target SLAs.
              </DialogDescription>
            </DialogHeader>
            <InternalReferral
              isEmbed={true}
              onSuccess={(newCase) => {
                if (newCase) {
                  // Ensure newCase conforms to AUSTRACCase interface
                  const fullCase = {
                    caseId: newCase.caseId,
                    subject: newCase.subject,
                    subjectType: newCase.subjectType,
                    triggerSource: newCase.triggerSource,
                    riskBand: newCase.riskBand,
                    assignedReviewer: newCase.assignedReviewer,
                    status: newCase.status,
                    createdDate: newCase.createdDate,
                    slaHours: newCase.slaHours,
                    slaRemaining: newCase.slaRemaining,
                  } as any;

                  // Update manual cases state and persist
                  setManualCases((prev) => {
                    const updated = [fullCase, ...prev.filter((c) => c.caseId !== fullCase.caseId)];
                    try {
                      localStorage.setItem('austrac_custom_cases', JSON.stringify(updated));
                    } catch (e) {
                      console.error('Failed to save manual cases', e);
                    }
                    return updated;
                  });

                  // Also update cases state and persist
                  setCases((prev) => {
                    const updated = [fullCase, ...prev];
                    try {
                      localStorage.setItem('austrac_cases', JSON.stringify(updated));
                    } catch (e) {
                      console.error('Failed to save cases', e);
                    }
                    return updated;
                  });

                  window.dispatchEvent(new CustomEvent('austrac_cases_updated'));
                  toast.success(`Manual Case ${fullCase.caseId} successfully added dynamically to the active matters register!`);
                }
                setShowReferralModal(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

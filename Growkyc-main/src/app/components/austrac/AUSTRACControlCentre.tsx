import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { InternalReferral } from './InternalReferral';
import { ReportableMatterTriage } from './ReportableMatterTriage';
import { SubmissionTracking } from './SubmissionTracking';
import { ReportingRulesAndTriggers } from './ReportingRulesTriggers';
import { ReportDraftBuilder } from './ReportDraftBuilder';
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

export function AUSTRACControlCentre({ navigateTo, goBack, defaultSelectedCaseId }: AUSTRACControlCentreProps) {
  const [activeSubPanel, setActiveSubPanel] = useState<'dashboard' | 'triage' | 'draft_builder' | 'tracking' | 'rules'>('dashboard');
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
    const text = `AUSTRAC SUBMISSION FILING RECEIPT\n=================================\nSubmission ID: SUB-${Math.floor(100000 + Math.random() * 900000)}\nDate filed: ${new Date().toISOString().split('T')[0]}\nFiling Authority: AUSTRAC Gateway Production\nSubject Case ID: ${caseId}\nStatus: ACKNOWLEDGED / ARCHIVED\nCompliance Officer Signature MD5: ${Math.random().toString(36).substring(7)}\n=================================\nCONFIDENTIAL SECURE SYSTEM RECORD`;
    const file = new Blob([text], {type: 'text/plain'});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = `austrac_filing_receipt_${caseId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Filing compliance receipt for ${caseId} downloaded successfully!`);
  };

  // Dynamic cases state loaded from localStorage & static mock data
  const [cases, setCases] = useState<AUSTRACCase[]>([]);

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

    try {
      const stored = localStorage.getItem('austrac_custom_cases');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCases([...parsed, ...staticCases]);
          return;
        }
      }
    } catch (e) {
      console.error('Error loading custom cases', e);
    }
    setCases(staticCases);
  }, []);

  // Dynamic KPIs derived from active cases
  const kpis = {
    openMatters: cases.filter(c => c.status !== 'closed' && c.status !== 'not_reportable').length,
    draftsPending: cases.filter(c => c.status === 'draft_in_progress').length,
    escalatedCases: cases.filter(c => c.status === 'awaiting_manager').length,
    submittedReports: 28 + cases.filter(c => c.status === 'submitted').length,
    notReported: 15 + cases.filter(c => c.status === 'not_reportable').length,
    overdueReviews: cases.filter(c => c.slaRemaining <= 0 && c.status !== 'closed' && c.status !== 'not_reportable').length,
    monitoringAlerts: 7,
    qaIssues: 1
  };

  // Mock draft reports
  const draftReports: DraftReport[] = [
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

  // Mock recent submissions
  const recentSubmissions: RecentSubmission[] = [
    {
      caseId: 'AUS-2026-000',
      subject: 'Green Valley SMSF',
      outcome: 'monitoring_only',
      decisionOwner: 'Sarah Johnson',
      closedDate: '2026-03-20'
    },
    {
      caseId: 'AUS-2025-099',
      subject: 'Jennifer Williams',
      outcome: 'not_submitted',
      decisionOwner: 'MLRO',
      closedDate: '2026-03-19'
    },
    {
      caseId: 'AUS-2025-098',
      subject: 'Coastal Ventures Partnership',
      outcome: 'submitted',
      decisionOwner: 'MLRO',
      closedDate: '2026-03-18'
    }
  ];

  const getStatusBadge = (status: CaseStatus) => {
    const config = {
      new: { label: 'New', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: AlertCircle },
      in_triage: { label: 'In Triage', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: Activity },
      under_investigation: { label: 'Under Investigation', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: Eye },
      draft_in_progress: { label: 'Draft in Progress', color: 'bg-orange-100 text-orange-700 border-orange-300', icon: FileText },
      awaiting_manager: { label: 'Awaiting Manager', color: 'bg-pink-100 text-pink-700 border-pink-300', icon: Clock },
      approved: { label: 'Approved', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle },
      submitted: { label: 'Submitted', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle },
      acknowledged: { label: 'Acknowledged', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle },
      monitoring_only: { label: 'Monitoring Only', color: 'bg-indigo-100 text-indigo-700 border-indigo-300', icon: Activity },
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-orange-900 rounded-lg p-6 md:p-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => {
                  const lastRole = localStorage.getItem('growkyc_last_role') || 'aml-analyst';
                  window.location.href = `/${lastRole}/dashboard`;
                }}
                className="bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto justify-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Return to Dashboard
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
            <div className="flex flex-wrap gap-2 md:gap-3 w-full lg:w-auto">
              <Button onClick={() => setActiveSubPanel('tracking')} className="bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 flex-1 sm:flex-initial justify-center text-xs md:text-sm">
                <Activity className="w-4 h-4 mr-2" />
                Submission Tracking
              </Button>
              <Button onClick={() => setActiveSubPanel('rules')} className="bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 flex-1 sm:flex-initial justify-center text-xs md:text-sm">
                <Settings className="w-4 h-4 mr-2" />
                Rules & Triggers
              </Button>
              <Button onClick={() => setShowReferralModal(true)} className="bg-white text-red-900 hover:bg-red-50 flex-1 sm:flex-initial justify-center text-xs md:text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Manual Case
              </Button>
              <Button onClick={handleExportRegister} className="bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 flex-1 sm:flex-initial justify-center text-xs md:text-sm">
                <Download className="w-4 h-4 mr-2" />
                Export Register
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card className="border-2 border-blue-300 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                <p className="text-xs text-blue-700 font-semibold">Open Matters</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-blue-900">{kpis.openMatters}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-300 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-orange-600" />
                <p className="text-xs text-orange-700 font-semibold">Drafts Pending</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-orange-900">{kpis.draftsPending}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-300 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-xs text-red-700 font-semibold">Escalated</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-red-900">{kpis.escalatedCases}</p>
            </CardContent>
          </Card>

          <Card onClick={() => setActiveSubPanel('tracking')} className="border-2 border-green-300 bg-green-50 cursor-pointer transition-all hover:bg-green-100 hover:scale-105 duration-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-xs text-green-700 font-semibold">Submitted</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-green-900">{kpis.submittedReports}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-300 bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-gray-600" />
                <p className="text-xs text-gray-700 font-semibold">Not Reported</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{kpis.notReported}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-300 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-red-600" />
                <p className="text-xs text-red-700 font-semibold">Overdue</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-red-900">{kpis.overdueReviews}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-indigo-300 bg-indigo-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <p className="text-xs text-indigo-700 font-semibold">Mon. Alerts</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-indigo-900">{kpis.monitoringAlerts}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-300 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-purple-600" />
                <p className="text-xs text-purple-700 font-semibold">QA Issues</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-purple-900">{kpis.qaIssues}</p>
            </CardContent>
          </Card>
        </div>

        {/* Table A - Active Reportable Matters */}
        <Card className="border-2 border-blue-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-4 md:p-6">
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
                    <tr key={matter.caseId} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
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
                            Open
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

        {/* Table B - Draft Reports */}
        <Card className="border-2 border-orange-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
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
                    <tr key={draft.caseId} className="border-b border-gray-200 hover:bg-orange-50 transition-colors">
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
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b">
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
          <DialogContent className="max-w-[95vw] w-[1500px] xl:max-w-[85vw] max-h-[95vh] overflow-y-auto p-6 bg-white rounded-xl shadow-2xl">
            <DialogHeader className="border-b pb-4 mb-4">
              <DialogTitle className="text-3xl font-bold flex items-center gap-2 text-red-900">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                Manual Case Referral
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-sm">
                Fill in the details below to log a suspicious activity manually. The compliance officer will review it within target SLAs.
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
                  // Add the new case to state and persist only manual cases
                  setCases(prev => {
                    const updated = [fullCase, ...prev];
                    const manualOnly = updated.filter(c => c.caseId.startsWith('AUS-2026-') && c.triggerSource === 'manual');
                    try {
                      localStorage.setItem('austrac_custom_cases', JSON.stringify(manualOnly));
                    } catch (e) {
                      console.error('Failed to save manual case', e);
                    }
                    return updated;
                  });
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

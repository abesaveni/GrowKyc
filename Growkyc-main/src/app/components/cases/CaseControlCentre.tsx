import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Users,
  Building,
  TrendingUp,
  FileText,
  Filter,
  Plus,
  Search,
  Download,
  Target,
  Activity,
  Zap
} from 'lucide-react';
import { CaseCreationModal } from './CaseCreationModal';
import { CaseWorkbench } from './CaseWorkbench';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../lib/toast';
import { ClientsDB } from '../kyc/ClientsDatabase';
import {
  saveCaseOverride,
  getActivePersonaName,
  getComplianceOfficerControlCases,
} from './complianceCaseUtils';
import { COMPLIANCE_ASSIGNEE_OPTIONS } from './complianceCaseSeedData';

type CaseStatus = 'new' | 'triage' | 'investigating' | 'escalated' | 'awaiting_decision' | 'monitoring' | 'closed';
type CaseType = 'aml_alert' | 'pep' | 'adverse_media' | 'sanctions' | 'ownership' | 'sof' | 'fraud' | 'legal' | 'manual';
type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface Case {
  id: string;
  clientName: string;
  clientType: 'individual' | 'company' | 'trust';
  caseType: CaseType;
  triggerSource: string;
  riskLevel: RiskLevel;
  status: CaseStatus;
  assignedTo: string;
  lastUpdated: string;
  slaHours: number;
  slaRemaining: number;
}

interface CaseControlCentreProps {
  onOpenCase?: (caseId: string) => void;
  /** When true, cases/KPIs/filters use live client data (Compliance Officer only). */
  complianceOfficerMode?: boolean;
}

export function CaseControlCentre({ onOpenCase, complianceOfficerMode = false }: CaseControlCentreProps = {}) {
  const { user } = useAuth();
  const isReadOnly = user?.role === 'auditor' || user?.role === 'partner' || user?.role === 'read_only_auditor' as any;
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [filterKPI, setFilterKPI] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [caseTypeFilter, setCaseTypeFilter] = useState<'all' | CaseType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | CaseStatus>('all');
  const [advancedFilter, setAdvancedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'risk' | 'sla'>('sla');
  const [page, setPage] = useState(1);
  const [assignModalCase, setAssignModalCase] = useState<Case | null>(null);
  const [assignTarget, setAssignTarget] = useState('');
  const pageSize = 8;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [clients, setClients] = useState<any[]>([]);
  const [customCases, setCustomCases] = useState<Case[]>([]);
  const [caseRefreshKey, setCaseRefreshKey] = useState(0);

  // Refresh case list when a manual case is saved
  useEffect(() => {
    const handler = () => setCaseRefreshKey((k) => k + 1);
    window.addEventListener('growkyc:cases_updated', handler);
    return () => window.removeEventListener('growkyc:cases_updated', handler);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cases_custom_cases');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCustomCases(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading custom cases', e);
    }

    setClients(ClientsDB.getClients());
    return ClientsDB.subscribe(setClients);
  }, []);

  const cases = useMemo(() => {
    if (complianceOfficerMode) {
      return getComplianceOfficerControlCases() as Case[];
    }
    return customCases;
  }, [complianceOfficerMode, clients, customCases, caseRefreshKey]);

  if (selectedCase) {
    return (
      <CaseWorkbench
        caseId={selectedCase.id}
        complianceOfficerMode={complianceOfficerMode}
        onBack={() => setSelectedCase(null)}
      />
    );
  }

  // KPI data dynamically calculated
  const kpis = {
    open: cases.filter(c => c.status !== 'closed').length,
    highRisk: cases.filter(c => c.status !== 'closed' && (c.riskLevel === 'high' || c.riskLevel === 'critical')).length,
    escalated: cases.filter(c => c.status === 'escalated').length,
    awaitingDecision: cases.filter(c => c.status === 'awaiting_decision').length,
    overdue: cases.filter(c => c.status !== 'closed' && c.slaRemaining <= 0).length,
    recentlyClosed: complianceOfficerMode
      ? cases.filter((c) => c.status === 'closed').length
      : cases.filter((c) => c.status === 'closed').length + 12,
  };

  const getCaseTypeBadge = (type: CaseType) => {
    const configs = {
      aml_alert: { label: 'AML Alert', color: 'bg-red-500/15 text-red-300', icon: Shield },
      pep: { label: 'PEP', color: 'bg-purple-500/15 text-purple-300', icon: Users },
      adverse_media: { label: 'Adverse Media', color: 'bg-orange-500/15 text-orange-300', icon: FileText },
      sanctions: { label: 'Sanctions', color: 'bg-red-500/15 text-red-300', icon: Shield },
      ownership: { label: 'Ownership', color: 'bg-indigo-500/15 text-indigo-300', icon: Users },
      sof: { label: 'Source of Funds', color: 'bg-amber-500/15 text-amber-300', icon: TrendingUp },
      fraud: { label: 'Fraud/Identity', color: 'bg-pink-500/15 text-pink-300', icon: AlertTriangle },
      legal: { label: 'Legal/Court', color: 'bg-white/5 text-slate-300', icon: FileText },
      manual: { label: 'Manual Referral', color: 'bg-blue-500/15 text-blue-300', icon: Eye }
    };
    const config = configs[type];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-xs px-2 py-1`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: CaseStatus) => {
    const configs = {
      new: { label: 'New', color: 'bg-blue-500/15 text-blue-300', icon: Zap },
      triage: { label: 'Triage', color: 'bg-purple-500/15 text-purple-300', icon: Activity },
      investigating: { label: 'Investigating', color: 'bg-amber-500/15 text-amber-300', icon: Eye },
      escalated: { label: 'Escalated', color: 'bg-red-500/15 text-red-300', icon: AlertTriangle },
      awaiting_decision: { label: 'Awaiting Decision', color: 'bg-orange-500/15 text-orange-300', icon: Clock },
      monitoring: { label: 'Monitoring', color: 'bg-indigo-500/15 text-indigo-300', icon: Activity },
      closed: { label: 'Closed', color: 'bg-white/5 text-slate-300', icon: CheckCircle }
    };
    const config = configs[status];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-xs px-2 py-1`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getRiskBadge = (risk: RiskLevel) => {
    const configs = {
      low: 'bg-green-500/15 text-green-300',
      medium: 'bg-amber-500/15 text-amber-300',
      high: 'bg-orange-500/15 text-orange-300',
      critical: 'bg-red-500/15 text-red-300'
    };
    return (
      <Badge className={`${configs[risk]} text-xs px-2 py-1 font-bold`}>
        {risk.toUpperCase()}
      </Badge>
    );
  };

  const getSLAColor = (hoursRemaining: number) => {
    if (hoursRemaining <= 0) return 'text-red-400 font-bold';
    if (hoursRemaining <= 8) return 'text-orange-400 font-bold';
    if (hoursRemaining <= 24) return 'text-amber-400';
    return 'text-green-300';
  };

  const personaName = getActivePersonaName();

  const filteredCases = useMemo(() => {
    const list = cases.filter((c) => {
      if (filterKPI === 'high_risk' && c.riskLevel !== 'high' && c.riskLevel !== 'critical') return false;
      if (filterKPI === 'escalated' && c.status !== 'escalated') return false;
      if (filterKPI === 'awaiting' && c.status !== 'awaiting_decision') return false;
      if (filterKPI === 'overdue' && c.slaRemaining > 0) return false;
      if (filterKPI === 'closed' && c.status !== 'closed') return false;
      if (filterKPI === 'open' && c.status === 'closed') return false;
      if (caseTypeFilter !== 'all' && c.caseType !== caseTypeFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;

      if (complianceOfficerMode) {
        if (advancedFilter === 'assigned_me' && !c.assignedTo.includes(personaName.split(' ')[0])) return false;
        if (advancedFilter === 'unassigned' && c.assignedTo !== 'Unassigned') return false;
        if (advancedFilter === 'due_today' && c.slaRemaining > 24) return false;
        if (advancedFilter === 'overdue_adv' && c.slaRemaining > 0) return false;
        if (advancedFilter === 'high_risk_adv' && c.riskLevel !== 'high') return false;
        if (advancedFilter === 'critical_risk' && c.riskLevel !== 'critical') return false;
        if (advancedFilter === 'edd' && c.caseType !== 'sof') return false;
        if (advancedFilter === 'investigation' && c.status !== 'investigating') return false;
        if (advancedFilter === 'pending_info' && c.status !== 'awaiting_decision') return false;
        if (advancedFilter === 'pep' && c.caseType !== 'pep') return false;
        if (advancedFilter === 'sanctions' && c.caseType !== 'sanctions') return false;
        if (advancedFilter === 'adverse_media' && c.caseType !== 'adverse_media') return false;
        if (advancedFilter === 'entity' && c.clientType === 'individual') return false;
        if (advancedFilter === 'individual' && c.clientType !== 'individual') return false;
      }

      if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        return (
          c.id.toLowerCase().includes(lower) ||
          c.clientName.toLowerCase().includes(lower) ||
          c.caseType.toLowerCase().includes(lower) ||
          c.status.toLowerCase().includes(lower)
        );
      }
      return true;
    });

    const sorted = complianceOfficerMode
      ? [...list].sort((a, b) => {
          if (sortBy === 'risk') {
            const order = { critical: 0, high: 1, medium: 2, low: 3 };
            return order[a.riskLevel] - order[b.riskLevel];
          }
          if (sortBy === 'sla') return a.slaRemaining - b.slaRemaining;
          return b.lastUpdated.localeCompare(a.lastUpdated);
        })
      : list;
    return sorted;
  }, [cases, filterKPI, caseTypeFilter, statusFilter, searchTerm, advancedFilter, sortBy, personaName, complianceOfficerMode]);

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / pageSize));
  const paginatedCases = complianceOfficerMode
    ? filteredCases.slice((page - 1) * pageSize, page * pageSize)
    : filteredCases;

  useEffect(() => {
    setPage(1);
  }, [filterKPI, caseTypeFilter, statusFilter, searchTerm, advancedFilter, complianceOfficerMode]);

  const handleAssignSubmit = () => {
    if (!assignModalCase || !assignTarget.trim()) {
      toast.error('Select an assignee');
      return;
    }
    saveCaseOverride(assignModalCase.id, { assignedTo: assignTarget });
    setCaseRefreshKey((k) => k + 1);
    setAssignModalCase(null);
    setAssignTarget('');
    toast.success('Case assigned');
  };

  const handleEscalateCase = (caseItem: Case, e: React.MouseEvent) => {
    e.stopPropagation();
    saveCaseOverride(caseItem.id, { status: 'escalated' });
    setCaseRefreshKey((k) => k + 1);
    toast.success(`Case ${caseItem.id} escalated`);
  };

  const quickStats = useMemo(() => {
    const open = cases.filter((c) => c.status !== 'closed');
    const closed = cases.filter((c) => c.status === 'closed');
    const elapsedHours = open.reduce((sum, c) => sum + Math.max(0, c.slaHours - c.slaRemaining), 0);
    const avgDays = open.length > 0 ? (elapsedHours / open.length / 24).toFixed(1) : '0';
    const slaOk = open.length > 0 ? Math.round((open.filter((c) => c.slaRemaining > 0).length / open.length) * 100) : 100;
    const autoPct = cases.length > 0
      ? Math.round((cases.filter((c) => !c.triggerSource.toLowerCase().includes('manual')).length / cases.length) * 100)
      : 0;
    return {
      avgResolutionDays: `${avgDays} days`,
      closed30Days: closed.length,
      autoCreatedPct: `${autoPct}%`,
      slaCompliancePct: `${slaOk}%`,
    };
  }, [cases]);

  const handleExportCases = () => {
    if (filteredCases.length === 0) {
      toast.info('No cases available for export');
      return;
    }

    const headers = ['Case ID', 'Client', 'Case Type', 'Status', 'Risk', 'Assigned To', 'Last Updated', 'SLA Remaining'];
    const rows = filteredCases.map((item) => [
      item.id,
      item.clientName,
      item.caseType,
      item.status,
      item.riskLevel,
      item.assignedTo,
      item.lastUpdated,
      String(item.slaRemaining)
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-cases-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredCases.length} case(s)`);
  };

  const openCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    onOpenCase?.(caseItem.id);
  };

  return (
    <div className="min-h-screen bg-white/5 p-4 sm:p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-orange-900 rounded-lg p-6 md:p-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20 flex-shrink-0">
                <Target className="w-8 h-8 md:w-9 md:h-9" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Case Control Centre</h1>
                <p className="text-base md:text-xl text-white/90">Risk & Compliance Case Management</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 w-full lg:w-auto">
              {!isReadOnly && (
                <Button className="bg-white text-red-300 hover:bg-red-500/10 flex-1 sm:flex-initial justify-center text-xs md:text-sm whitespace-nowrap" onClick={() => setIsModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-1.5 md:mr-2" />
                  Create Manual Case
                </Button>
              )}
              <Button 
                className="bg-white/20 border-2 border-white/30 text-white hover:bg-white/30 flex-1 sm:flex-initial justify-center text-xs md:text-sm whitespace-nowrap"
                onClick={handleExportCases}
              >
                <Download className="w-4 h-4 mr-1.5 md:mr-2" />
                Export Cases
              </Button>
            </div>
          </div>
        </div>

        {/* KPI STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
          <Card
            onClick={() => setFilterKPI('all')}
            className={`cursor-pointer transition-all border-2 ${
              filterKPI === 'all' ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-200' : 'border-blue-300 hover:border-blue-400'
            }`}
          >
            <CardContent className="p-4 md:p-6 text-center">
              <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-blue-400 flex-shrink-0" />
                <p className="text-xs md:text-sm font-bold text-blue-300">Open Cases</p>
              </div>
              <p className="text-2xl md:text-4xl font-bold text-blue-300">{kpis.open}</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setFilterKPI('high_risk')}
            className={`cursor-pointer transition-all border-2 ${
              filterKPI === 'high_risk' ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-200' : 'border-orange-300 hover:border-orange-400'
            }`}
          >
            <CardContent className="p-4 md:p-6 text-center">
              <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-orange-400 flex-shrink-0" />
                <p className="text-xs md:text-sm font-bold text-orange-300">High-Risk</p>
              </div>
              <p className="text-2xl md:text-4xl font-bold text-orange-300">{kpis.highRisk}</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setFilterKPI('escalated')}
            className={`cursor-pointer transition-all border-2 ${
              filterKPI === 'escalated' ? 'border-red-500 bg-red-500/10 ring-2 ring-red-200' : 'border-red-300 hover:border-red-400'
            }`}
          >
            <CardContent className="p-4 md:p-6 text-center">
              <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-red-400 flex-shrink-0" />
                <p className="text-xs md:text-sm font-bold text-red-300">Escalated</p>
              </div>
              <p className="text-2xl md:text-4xl font-bold text-red-300">{kpis.escalated}</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setFilterKPI('awaiting')}
            className={`cursor-pointer transition-all border-2 ${
              filterKPI === 'awaiting' ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-200' : 'border-amber-300 hover:border-amber-400'
            }`}
          >
            <CardContent className="p-4 md:p-6 text-center">
              <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-400 flex-shrink-0" />
                <p className="text-xs md:text-sm font-bold text-amber-300">Awaiting Decision</p>
              </div>
              <p className="text-2xl md:text-4xl font-bold text-amber-300">{kpis.awaitingDecision}</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setFilterKPI('overdue')}
            className={`cursor-pointer transition-all border-2 ${
              filterKPI === 'overdue' ? 'border-red-500 bg-red-500/10 ring-2 ring-red-200' : 'border-red-300 hover:border-red-400'
            }`}
          >
            <CardContent className="p-4 md:p-6 text-center">
              <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-400 flex-shrink-0" />
                <p className="text-xs md:text-sm font-bold text-red-300">Overdue</p>
              </div>
              <p className="text-2xl md:text-4xl font-bold text-red-300">{kpis.overdue}</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setFilterKPI('closed')}
            className={`cursor-pointer transition-all border-2 ${
              filterKPI === 'closed' ? 'border-gray-500 bg-white/5 ring-2 ring-gray-200' : 'border-white/10 hover:border-gray-400'
            }`}
          >
            <CardContent className="p-4 md:p-6 text-center">
              <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-slate-300 flex-shrink-0" />
                <p className="text-xs md:text-sm font-bold text-slate-300">Recently Closed</p>
              </div>
              <p className="text-2xl md:text-4xl font-bold text-slate-100">{kpis.recentlyClosed}</p>
            </CardContent>
          </Card>
        </div>

        {/* CASE TABLE */}
        <Card className="border-2 border-blue-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                <Shield className="w-6 h-6 md:w-7 md:h-7 text-blue-400" />
                Active Cases
              </CardTitle>
              <div className="flex flex-col xs:flex-row gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cases, clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-1.5 border-2 border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 text-sm"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 text-xs md:text-sm py-1.5 h-auto justify-center"
                  onClick={() => setShowFilters((v) => !v)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Filters'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {showFilters && (
              <div className="px-4 py-3 border-b bg-white flex flex-col sm:flex-row flex-wrap gap-3">
                <select
                  value={caseTypeFilter}
                  onChange={(e) => setCaseTypeFilter(e.target.value as 'all' | CaseType)}
                  className="px-3 py-2 border-2 border-white/10 rounded-lg text-sm"
                >
                  <option value="all">All case types</option>
                  <option value="aml_alert">AML Alert</option>
                  <option value="pep">PEP</option>
                  <option value="adverse_media">Adverse Media</option>
                  <option value="sanctions">Sanctions</option>
                  <option value="ownership">Ownership</option>
                  <option value="sof">Source of Funds</option>
                  <option value="fraud">Fraud</option>
                  <option value="legal">Legal</option>
                  <option value="manual">Manual Referral</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | CaseStatus)}
                  className="px-3 py-2 border-2 border-white/10 rounded-lg text-sm"
                >
                  <option value="all">All statuses</option>
                  <option value="new">New</option>
                  <option value="triage">Triage</option>
                  <option value="investigating">Investigating</option>
                  <option value="escalated">Escalated</option>
                  <option value="awaiting_decision">Awaiting Decision</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="closed">Closed</option>
                </select>
                {complianceOfficerMode && (
                  <>
                    <select
                      value={advancedFilter}
                      onChange={(e) => setAdvancedFilter(e.target.value)}
                      className="px-3 py-2 border-2 border-white/10 rounded-lg text-sm min-w-[180px]"
                    >
                      <option value="all">All cases</option>
                      <option value="assigned_me">Assigned To Me</option>
                      <option value="unassigned">Unassigned</option>
                      <option value="due_today">Due Today</option>
                      <option value="overdue_adv">Overdue</option>
                      <option value="high_risk_adv">High Risk</option>
                      <option value="critical_risk">Critical Risk</option>
                      <option value="edd">EDD Cases</option>
                      <option value="investigation">Investigation Cases</option>
                      <option value="pending_info">Pending Information</option>
                      <option value="pep">PEP Matches</option>
                      <option value="sanctions">Sanctions Matches</option>
                      <option value="adverse_media">Adverse Media Matches</option>
                      <option value="entity">Entity Clients</option>
                      <option value="individual">Individual Clients</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'updated' | 'risk' | 'sla')}
                      className="px-3 py-2 border-2 border-white/10 rounded-lg text-sm"
                    >
                      <option value="sla">Sort: SLA</option>
                      <option value="risk">Sort: Risk</option>
                      <option value="updated">Sort: Last Updated</option>
                    </select>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCaseTypeFilter('all');
                    setStatusFilter('all');
                    setSearchTerm('');
                    setFilterKPI('all');
                    if (complianceOfficerMode) setAdvancedFilter('all');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b-2 border-white/10">
                  <tr>
                    <th className="text-left py-4 px-4 text-sm font-bold text-slate-300">Case ID</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-slate-300">Client / Entity</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-slate-300">Case Type</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-slate-300">Trigger Source</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-slate-300">Risk Level</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-slate-300">Status</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-slate-300">Assigned To</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-slate-300">Last Updated</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-slate-300">SLA Timer</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCases.map((caseItem) => (
                    <tr
                      key={caseItem.id}
                      onClick={() => openCase(caseItem)}
                      className={`border-b border-white/10 hover:bg-blue-500/10 cursor-pointer transition-colors ${
                        caseItem.riskLevel === 'critical' ? 'bg-red-500/10/30' :
                        caseItem.slaRemaining <= 0 ? 'bg-orange-500/10/30' :
                        ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-blue-300">{caseItem.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {caseItem.clientType === 'individual' ? (
                            <Users className="w-5 h-5 text-slate-300" />
                          ) : (
                            <Building className="w-5 h-5 text-slate-300" />
                          )}
                          <div>
                            <p className="font-semibold text-slate-100">{caseItem.clientName}</p>
                            <p className="text-xs text-slate-300 capitalize">{caseItem.clientType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">{getCaseTypeBadge(caseItem.caseType)}</td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-300 border-blue-300">
                          {caseItem.triggerSource}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">{getRiskBadge(caseItem.riskLevel)}</td>
                      <td className="py-4 px-4">{getStatusBadge(caseItem.status)}</td>
                      <td className="py-4 px-4">
                        <span className={`text-sm ${caseItem.assignedTo === 'Unassigned' ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                          {caseItem.assignedTo}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-300">{caseItem.lastUpdated}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <span className={`text-sm font-semibold ${getSLAColor(caseItem.slaRemaining)}`}>
                            {caseItem.slaRemaining > 0 ? `${caseItem.slaRemaining}h left` : 'OVERDUE'}
                          </span>
                          <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                caseItem.slaRemaining <= 0 ? 'bg-red-600' :
                                caseItem.slaRemaining <= 8 ? 'bg-orange-600' :
                                caseItem.slaRemaining <= 24 ? 'bg-amber-600' : 'bg-green-600'
                              }`}
                              style={{ width: `${Math.min(100, (caseItem.slaRemaining / caseItem.slaHours) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-wrap gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-2 border-blue-500 text-blue-300 hover:bg-blue-500/10"
                            onClick={() => openCase(caseItem)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Open
                          </Button>
                          {complianceOfficerMode && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => { setAssignModalCase(caseItem); setAssignTarget(caseItem.assignedTo); }}>
                                Assign
                              </Button>
                              <Button variant="outline" size="sm" onClick={(e) => handleEscalateCase(caseItem, e)}>
                                Escalate
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCases.length === 0 && (
                <div className="p-8 text-center text-slate-400 font-medium">
                  No cases found matching the current filters.
                </div>
              )}
              {complianceOfficerMode && filteredCases.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 border-t bg-white/5">
                  <span className="text-sm text-slate-300">
                    Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredCases.length)} of {filteredCases.length}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {complianceOfficerMode && assignModalCase && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-2">
              <CardHeader><CardTitle>Assign Case {assignModalCase.id}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <select className="w-full border-2 rounded-lg px-3 py-2" value={assignTarget} onChange={(e) => setAssignTarget(e.target.value)}>
                  <option value="">Select assignee</option>
                  {COMPLIANCE_ASSIGNEE_OPTIONS.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setAssignModalCase(null)}>Cancel</Button>
                  <Button onClick={handleAssignSubmit}>Assign</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-purple-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300 mb-1">Avg Resolution Time</p>
                  <p className="text-3xl font-bold text-purple-300">{quickStats.avgResolutionDays}</p>
                </div>
                <Clock className="w-12 h-12 text-purple-400 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-300 mb-1">Cases Closed (30 days)</p>
                  <p className="text-3xl font-bold text-green-300">{quickStats.closed30Days}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-400 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300 mb-1">Auto-Created</p>
                  <p className="text-3xl font-bold text-blue-300">{quickStats.autoCreatedPct}</p>
                </div>
                <Zap className="w-12 h-12 text-blue-400 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-300 mb-1">SLA Compliance</p>
                  <p className="text-3xl font-bold text-amber-300">{quickStats.slaCompliancePct}</p>
                </div>
                <Target className="w-12 h-12 text-amber-400 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <CaseCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setCaseRefreshKey((k) => k + 1);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
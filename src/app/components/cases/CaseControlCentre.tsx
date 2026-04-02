import React, { useState } from 'react';
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

export function CaseControlCentre() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [filterKPI, setFilterKPI] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // If a case is selected, show the workbench
  if (selectedCase) {
    return <CaseWorkbench onBack={() => setSelectedCase(null)} />;
  }

  // KPI data
  const kpis = {
    open: 24,
    highRisk: 8,
    escalated: 3,
    awaitingDecision: 5,
    overdue: 2,
    recentlyClosed: 12
  };

  // Sample cases
  const cases: Case[] = [
    {
      id: 'CASE-2026-001',
      clientName: 'ABC Enterprises Pty Ltd',
      clientType: 'company',
      caseType: 'sanctions',
      triggerSource: 'Sanctions Screening Bot',
      riskLevel: 'critical',
      status: 'investigating',
      assignedTo: 'Michael Chen',
      lastUpdated: '2026-03-21 10:30',
      slaHours: 24,
      slaRemaining: 8
    },
    {
      id: 'CASE-2026-002',
      clientName: 'Innovation Partners Trust',
      clientType: 'trust',
      caseType: 'pep',
      triggerSource: 'PEP Screening Bot',
      riskLevel: 'high',
      status: 'escalated',
      assignedTo: 'Sarah Johnson',
      lastUpdated: '2026-03-21 09:15',
      slaHours: 48,
      slaRemaining: 32
    },
    {
      id: 'CASE-2026-003',
      clientName: 'David Williams',
      clientType: 'individual',
      caseType: 'adverse_media',
      triggerSource: 'Adverse Media Bot',
      riskLevel: 'medium',
      status: 'triage',
      assignedTo: 'Lisa Martinez',
      lastUpdated: '2026-03-21 08:00',
      slaHours: 72,
      slaRemaining: 68
    },
    {
      id: 'CASE-2026-004',
      clientName: 'TechCorp Pty Ltd',
      clientType: 'company',
      caseType: 'sof',
      triggerSource: 'Source of Funds Bot',
      riskLevel: 'high',
      status: 'awaiting_decision',
      assignedTo: 'Michael Chen',
      lastUpdated: '2026-03-20 16:45',
      slaHours: 48,
      slaRemaining: 18
    },
    {
      id: 'CASE-2026-005',
      clientName: 'Melbourne Family Trust',
      clientType: 'trust',
      caseType: 'ownership',
      triggerSource: 'Ownership Bot',
      riskLevel: 'medium',
      status: 'investigating',
      assignedTo: 'Sarah Johnson',
      lastUpdated: '2026-03-20 14:20',
      slaHours: 72,
      slaRemaining: 56
    },
    {
      id: 'CASE-2026-006',
      clientName: 'Global Trade Partners',
      clientType: 'company',
      caseType: 'aml_alert',
      triggerSource: 'AML Monitoring',
      riskLevel: 'critical',
      status: 'new',
      assignedTo: 'Unassigned',
      lastUpdated: '2026-03-21 11:00',
      slaHours: 24,
      slaRemaining: 24
    },
    {
      id: 'CASE-2026-007',
      clientName: 'Jennifer Smith',
      clientType: 'individual',
      caseType: 'fraud',
      triggerSource: 'Identity Verification Bot',
      riskLevel: 'high',
      status: 'investigating',
      assignedTo: 'Lisa Martinez',
      lastUpdated: '2026-03-20 11:30',
      slaHours: 48,
      slaRemaining: 2
    },
    {
      id: 'CASE-2026-008',
      clientName: 'Coastal Ventures',
      clientType: 'company',
      caseType: 'legal',
      triggerSource: 'Court & Litigation Bot',
      riskLevel: 'medium',
      status: 'monitoring',
      assignedTo: 'Michael Chen',
      lastUpdated: '2026-03-19 15:00',
      slaHours: 72,
      slaRemaining: 42
    }
  ];

  const getCaseTypeBadge = (type: CaseType) => {
    const configs = {
      aml_alert: { label: 'AML Alert', color: 'bg-red-100 text-red-700', icon: Shield },
      pep: { label: 'PEP', color: 'bg-purple-100 text-purple-700', icon: Users },
      adverse_media: { label: 'Adverse Media', color: 'bg-orange-100 text-orange-700', icon: FileText },
      sanctions: { label: 'Sanctions', color: 'bg-red-100 text-red-700', icon: Shield },
      ownership: { label: 'Ownership', color: 'bg-indigo-100 text-indigo-700', icon: Users },
      sof: { label: 'Source of Funds', color: 'bg-amber-100 text-amber-700', icon: TrendingUp },
      fraud: { label: 'Fraud/Identity', color: 'bg-pink-100 text-pink-700', icon: AlertTriangle },
      legal: { label: 'Legal/Court', color: 'bg-gray-100 text-gray-700', icon: FileText },
      manual: { label: 'Manual Referral', color: 'bg-blue-100 text-blue-700', icon: Eye }
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
      new: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: Zap },
      triage: { label: 'Triage', color: 'bg-purple-100 text-purple-700', icon: Activity },
      investigating: { label: 'Investigating', color: 'bg-amber-100 text-amber-700', icon: Eye },
      escalated: { label: 'Escalated', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
      awaiting_decision: { label: 'Awaiting Decision', color: 'bg-orange-100 text-orange-700', icon: Clock },
      monitoring: { label: 'Monitoring', color: 'bg-indigo-100 text-indigo-700', icon: Activity },
      closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700', icon: CheckCircle }
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
      low: 'bg-green-100 text-green-700',
      medium: 'bg-amber-100 text-amber-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700'
    };
    return (
      <Badge className={`${configs[risk]} text-xs px-2 py-1 font-bold`}>
        {risk.toUpperCase()}
      </Badge>
    );
  };

  const getSLAColor = (hoursRemaining: number) => {
    if (hoursRemaining <= 0) return 'text-red-600 font-bold';
    if (hoursRemaining <= 8) return 'text-orange-600 font-bold';
    if (hoursRemaining <= 24) return 'text-amber-600';
    return 'text-green-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-orange-900 rounded-lg p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
                <Target className="w-9 h-9" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Case Control Centre</h1>
                <p className="text-xl text-white/90">Risk & Compliance Case Management</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-red-900 hover:bg-red-50" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Manual Case
              </Button>
              <Button className="bg-white/20 border-2 border-white/30 text-white hover:bg-white/30">
                <Download className="w-5 h-5 mr-2" />
                Export Cases
              </Button>
            </div>
          </div>
        </div>

        {/* KPI STRIP */}
        <div className="grid grid-cols-6 gap-4">
          <Card
            onClick={() => setFilterKPI('all')}
            className={`cursor-pointer transition-all border-2 ${
              filterKPI === 'all' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-blue-300 hover:border-blue-400'
            }`}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="w-6 h-6 text-blue-600" />
                <p className="text-sm font-bold text-blue-700">Open Cases</p>
              </div>
              <p className="text-4xl font-bold text-blue-900">{kpis.open}</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setFilterKPI('high_risk')}
            className={`cursor-pointer transition-all border-2 ${
              filterKPI === 'high_risk' ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' : 'border-orange-300 hover:border-orange-400'
            }`}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
                <p className="text-sm font-bold text-orange-700">High-Risk</p>
              </div>
              <p className="text-4xl font-bold text-orange-900">{kpis.highRisk}</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setFilterKPI('escalated')}
            className={`cursor-pointer transition-all border-2 ${
              filterKPI === 'escalated' ? 'border-red-500 bg-red-50 ring-2 ring-red-200' : 'border-red-300 hover:border-red-400'
            }`}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-6 h-6 text-red-600" />
                <p className="text-sm font-bold text-red-700">Escalated</p>
              </div>
              <p className="text-4xl font-bold text-red-900">{kpis.escalated}</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setFilterKPI('awaiting')}
            className={`cursor-pointer transition-all border-2 ${
              filterKPI === 'awaiting' ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'border-amber-300 hover:border-amber-400'
            }`}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-6 h-6 text-amber-600" />
                <p className="text-sm font-bold text-amber-700">Awaiting Decision</p>
              </div>
              <p className="text-4xl font-bold text-amber-900">{kpis.awaitingDecision}</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setFilterKPI('overdue')}
            className={`cursor-pointer transition-all border-2 ${
              filterKPI === 'overdue' ? 'border-red-500 bg-red-50 ring-2 ring-red-200' : 'border-red-300 hover:border-red-400'
            }`}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <XCircle className="w-6 h-6 text-red-600" />
                <p className="text-sm font-bold text-red-700">Overdue</p>
              </div>
              <p className="text-4xl font-bold text-red-900">{kpis.overdue}</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => setFilterKPI('closed')}
            className={`cursor-pointer transition-all border-2 ${
              filterKPI === 'closed' ? 'border-gray-500 bg-gray-50 ring-2 ring-gray-200' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-6 h-6 text-gray-600" />
                <p className="text-sm font-bold text-gray-700">Recently Closed</p>
              </div>
              <p className="text-4xl font-bold text-gray-900">{kpis.recentlyClosed}</p>
            </CardContent>
          </Card>
        </div>

        {/* CASE TABLE */}
        <Card className="border-2 border-blue-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="w-7 h-7 text-blue-600" />
                Active Cases
              </CardTitle>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cases, clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                  />
                </div>
                <Button variant="outline" size="sm" className="border-2">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Case ID</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Client / Entity</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Case Type</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Trigger Source</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Risk Level</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Assigned To</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Last Updated</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">SLA Timer</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((caseItem) => (
                    <tr
                      key={caseItem.id}
                      onClick={() => setSelectedCase(caseItem)}
                      className={`border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors ${
                        caseItem.riskLevel === 'critical' ? 'bg-red-50/30' :
                        caseItem.slaRemaining <= 0 ? 'bg-orange-50/30' :
                        ''
                      }`}
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-blue-900">{caseItem.id}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {caseItem.clientType === 'individual' ? (
                            <Users className="w-5 h-5 text-gray-600" />
                          ) : (
                            <Building className="w-5 h-5 text-gray-600" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{caseItem.clientName}</p>
                            <p className="text-xs text-gray-600 capitalize">{caseItem.clientType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">{getCaseTypeBadge(caseItem.caseType)}</td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                          {caseItem.triggerSource}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">{getRiskBadge(caseItem.riskLevel)}</td>
                      <td className="py-4 px-4">{getStatusBadge(caseItem.status)}</td>
                      <td className="py-4 px-4">
                        <span className={`text-sm ${caseItem.assignedTo === 'Unassigned' ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                          {caseItem.assignedTo}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{caseItem.lastUpdated}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <span className={`text-sm font-semibold ${getSLAColor(caseItem.slaRemaining)}`}>
                            {caseItem.slaRemaining > 0 ? `${caseItem.slaRemaining}h left` : 'OVERDUE'}
                          </span>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
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
                      <td className="py-4 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-2 border-blue-500 text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Open
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-2 border-purple-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 mb-1">Avg Resolution Time</p>
                  <p className="text-3xl font-bold text-purple-900">3.2 days</p>
                </div>
                <Clock className="w-12 h-12 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 mb-1">Cases Closed (30 days)</p>
                  <p className="text-3xl font-bold text-green-900">142</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 mb-1">Auto-Created</p>
                  <p className="text-3xl font-bold text-blue-900">89%</p>
                </div>
                <Zap className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700 mb-1">SLA Compliance</p>
                  <p className="text-3xl font-bold text-amber-900">96%</p>
                </div>
                <Target className="w-12 h-12 text-amber-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <CaseCreationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
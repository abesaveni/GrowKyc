import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Users,
  FileText,
  Download,
  Eye,
  Lock,
  Unlock,
  Activity,
  Clock,
  Target,
  Search,
  Filter,
  RefreshCw,
  Bell,
  Zap,
  GitBranch,
  DollarSign,
  MapPin,
  Calendar,
  Hash,
  ExternalLink,
  Upload,
  Info,
  AlertCircle,
  TrendingDown,
  Ban,
  Edit
} from 'lucide-react';

type RiskTier = 'low' | 'medium' | 'high' | 'critical';
type EventType = 'insolvency' | 'court-action' | 'default' | 'director-disqualification' | 'adverse-credit';
type MonitoringStatus = 'active' | 'paused' | 'expired';

interface EquifaxReport {
  id: string;
  clientId: string;
  clientName: string;
  reportType: 'business-credit' | 'director-check' | 'insolvency' | 'ongoing-monitoring';
  orderedDate: Date;
  receivedDate?: Date;
  providerReference: string;
  status: 'processing' | 'complete' | 'failed';
  
  // Business Profile
  legalName: string;
  abn: string;
  acn?: string;
  entityStatus: 'active' | 'cancelled' | 'deregistered';
  registeredAddress: string;
  industry: string;
  
  // Risk Scoring
  creditRiskScore: number; // 0-1000
  previousScore?: number;
  riskTier: RiskTier;
  previousRiskTier?: RiskTier;
  
  // Key Indicators
  insolvencyIndicator: boolean;
  courtActionIndicator: boolean;
  directorNetworkRisk: boolean;
  
  // Evidence
  pdfUrl?: string;
  jsonMetadata?: any;
  sha256Hash: string;
  
  // Audit
  orderedBy: string;
  reviewedBy?: string;
  reviewDate?: Date;
  linkedCaseId?: string;
}

interface AdverseEvent {
  id: string;
  clientId: string;
  clientName: string;
  eventType: EventType;
  date: Date;
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  riskDelta: number;
  status: 'new' | 'under-review' | 'reviewed' | 'escalated' | 'closed';
  assignedTo?: string;
  description: string;
  recommendedAction: string;
}

interface DirectorNode {
  id: string;
  name: string;
  type: 'client' | 'director' | 'entity' | 'insolvent-entity';
  status: 'active' | 'historical' | 'external-admin' | 'insolvent';
  yearsActive?: number;
  riskIndicator: RiskTier;
}

interface MonitoringRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: {
    insolvencyDetected?: boolean;
    directorChange?: boolean;
    creditScoreThreshold?: number;
    adverseEvent?: boolean;
  };
  actions: {
    increaseRiskTier?: boolean;
    createCase?: boolean;
    notifyComplianceOfficer?: boolean;
    restrictEngagement?: boolean;
    requestDocuments?: boolean;
  };
  autoRestrict: boolean;
  manualReview: boolean;
}

export function EquifaxRiskModule() {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'director-network' | 'adverse-events' | 'monitoring' | 'evidence' | 'audit'>('overview');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Mock Data
  const [reports] = useState<EquifaxReport[]>([
    {
      id: 'EQ-2024-001',
      clientId: 'C001',
      clientName: 'TechCorp Pty Ltd',
      reportType: 'business-credit',
      orderedDate: new Date('2024-02-15T10:00:00'),
      receivedDate: new Date('2024-02-15T10:15:00'),
      providerReference: 'VED-BC-789456123',
      status: 'complete',
      legalName: 'TechCorp Pty Ltd',
      abn: '12 345 678 901',
      acn: '123 456 789',
      entityStatus: 'active',
      registeredAddress: '123 Collins St, Melbourne VIC 3000',
      industry: 'Information Technology',
      creditRiskScore: 720,
      previousScore: 650,
      riskTier: 'medium',
      previousRiskTier: 'high',
      insolvencyIndicator: false,
      courtActionIndicator: false,
      directorNetworkRisk: true,
      sha256Hash: 'a3f5b9c2d8e1f4a7b6c9d2e5f8a1b4c7d0e3f6a9b2c5d8e1f4a7b0c3d6e9f2a5',
      orderedBy: 'Emma Wilson',
      reviewedBy: 'Michael Chen',
      reviewDate: new Date('2024-02-15T11:30:00'),
      linkedCaseId: 'CASE-2024-089'
    },
    {
      id: 'EQ-2024-002',
      clientId: 'C002',
      clientName: 'ABC Enterprises',
      reportType: 'insolvency',
      orderedDate: new Date('2024-02-18T14:20:00'),
      receivedDate: new Date('2024-02-18T14:35:00'),
      providerReference: 'VED-IS-456789012',
      status: 'complete',
      legalName: 'ABC Enterprises Pty Ltd',
      abn: '98 765 432 109',
      acn: '987 654 321',
      entityStatus: 'active',
      registeredAddress: '456 King St, Sydney NSW 2000',
      industry: 'Construction',
      creditRiskScore: 320,
      previousScore: 580,
      riskTier: 'critical',
      previousRiskTier: 'medium',
      insolvencyIndicator: true,
      courtActionIndicator: true,
      directorNetworkRisk: true,
      sha256Hash: 'b4g6c0d3e9f2a5b8c1d4e7f0a3b6c9d2e5f8a1b4c7d0e3f6a9b2c5d8e1f4a7b0',
      orderedBy: 'Emma Wilson',
      linkedCaseId: 'CASE-2024-090'
    }
  ]);

  const [adverseEvents] = useState<AdverseEvent[]>([
    {
      id: 'AE-001',
      clientId: 'C002',
      clientName: 'ABC Enterprises',
      eventType: 'insolvency',
      date: new Date('2024-02-18'),
      source: 'Equifax Business Credit Report',
      severity: 'critical',
      riskDelta: -260,
      status: 'escalated',
      assignedTo: 'Michael Chen',
      description: 'External administrator appointed (Voluntary Administration). Administrator: Jones & Partners.',
      recommendedAction: 'Immediate engagement restriction. Initiate Enhanced CDD review. Request administrator contact details.'
    },
    {
      id: 'AE-002',
      clientId: 'C001',
      clientName: 'TechCorp Pty Ltd',
      eventType: 'court-action',
      date: new Date('2024-02-10'),
      source: 'Equifax Court Records',
      severity: 'medium',
      riskDelta: -70,
      status: 'under-review',
      assignedTo: 'Emma Wilson',
      description: 'County Court judgment - $45,000 unpaid creditor claim.',
      recommendedAction: 'Request source of funds verification. Document explanation.'
    },
    {
      id: 'AE-003',
      clientId: 'C003',
      clientName: 'XYZ Trading Co',
      eventType: 'director-disqualification',
      date: new Date('2024-01-25'),
      source: 'ASIC Disqualified Persons Register',
      severity: 'high',
      riskDelta: -150,
      status: 'new',
      description: 'Director John Smith disqualified by ASIC for 5 years (breach of directors\' duties).',
      recommendedAction: 'Escalate to Enhanced CDD. Verify current director structure. Consider engagement restriction.'
    }
  ]);

  const [monitoringRules] = useState<MonitoringRule[]>([
    {
      id: 'MR-001',
      name: 'Insolvency Auto-Restriction',
      enabled: true,
      conditions: {
        insolvencyDetected: true
      },
      actions: {
        restrictEngagement: true,
        createCase: true,
        notifyComplianceOfficer: true,
        increaseRiskTier: true
      },
      autoRestrict: true,
      manualReview: false
    },
    {
      id: 'MR-002',
      name: 'Credit Score Threshold Alert',
      enabled: true,
      conditions: {
        creditScoreThreshold: 400
      },
      actions: {
        createCase: true,
        notifyComplianceOfficer: true,
        requestDocuments: true
      },
      autoRestrict: false,
      manualReview: true
    },
    {
      id: 'MR-003',
      name: 'Director Change Escalation',
      enabled: true,
      conditions: {
        directorChange: true
      },
      actions: {
        createCase: true,
        notifyComplianceOfficer: true,
        requestDocuments: true
      },
      autoRestrict: false,
      manualReview: true
    },
    {
      id: 'MR-004',
      name: 'Court Action Review',
      enabled: true,
      conditions: {
        adverseEvent: true
      },
      actions: {
        createCase: true,
        notifyComplianceOfficer: true,
        increaseRiskTier: true
      },
      autoRestrict: false,
      manualReview: true
    }
  ]);

  const stats = {
    totalReports: reports.length,
    activeMonitoring: 15,
    highRiskAlerts: adverseEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length,
    insolvencyFlags: reports.filter(r => r.insolvencyIndicator).length,
    directorNetworkAlerts: reports.filter(r => r.directorNetworkRisk).length,
    avgRiskDelta: -45.3
  };

  const getRiskColor = (tier: RiskTier) => {
    switch (tier) {
      case 'low': return darkMode ? 'green-400' : 'green-600';
      case 'medium': return darkMode ? 'yellow-400' : 'yellow-600';
      case 'high': return darkMode ? 'orange-400' : 'orange-600';
      case 'critical': return darkMode ? 'red-400' : 'red-600';
    }
  };

  const getRiskBgColor = (tier: RiskTier) => {
    switch (tier) {
      case 'low': return darkMode ? 'green-900' : 'green-50';
      case 'medium': return darkMode ? 'yellow-900' : 'yellow-50';
      case 'high': return darkMode ? 'orange-900' : 'orange-50';
      case 'critical': return darkMode ? 'red-900' : 'red-50';
    }
  };

  const getRiskBorderColor = (tier: RiskTier) => {
    switch (tier) {
      case 'low': return darkMode ? 'green-700' : 'green-200';
      case 'medium': return darkMode ? 'yellow-700' : 'yellow-200';
      case 'high': return darkMode ? 'orange-700' : 'orange-200';
      case 'critical': return darkMode ? 'red-700' : 'red-200';
    }
  };

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const mutedTextClass = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Shield className="w-16 h-16" />
              <div>
                <h1 className="text-4xl font-bold mb-2">Risk Intelligence</h1>
                <p className="text-xl text-indigo-100">Equifax (Veda) Risk & Monitoring Module</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                {darkMode ? '☀️' : '🌙'} {darkMode ? 'Light' : 'Dark'} Mode
              </button>
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
                <Upload className="w-5 h-5 mr-2" />
                Order Report
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-6 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Total Reports</h3>
                <FileText className="w-5 h-5 text-white/80" />
              </div>
              <p className="text-3xl font-bold">{stats.totalReports}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Active Monitoring</h3>
                <Activity className="w-5 h-5 text-white/80" />
              </div>
              <p className="text-3xl font-bold">{stats.activeMonitoring}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">High Risk Alerts</h3>
                <AlertTriangle className="w-5 h-5 text-white/80" />
              </div>
              <p className="text-3xl font-bold text-red-300">{stats.highRiskAlerts}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Insolvency Flags</h3>
                <XCircle className="w-5 h-5 text-white/80" />
              </div>
              <p className="text-3xl font-bold text-red-300">{stats.insolvencyFlags}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Director Alerts</h3>
                <Users className="w-5 h-5 text-white/80" />
              </div>
              <p className="text-3xl font-bold text-yellow-300">{stats.directorNetworkAlerts}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Avg Risk Delta</h3>
                <TrendingDown className="w-5 h-5 text-white/80" />
              </div>
              <p className="text-3xl font-bold text-red-300">{stats.avgRiskDelta}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'reports', label: 'Equifax Reports', icon: FileText },
              { id: 'director-network', label: 'Director Network', icon: GitBranch },
              { id: 'adverse-events', label: 'Adverse Events', icon: AlertTriangle },
              { id: 'monitoring', label: 'Monitoring Rules', icon: Activity },
              { id: 'evidence', label: 'Evidence', icon: Lock },
              { id: 'audit', label: 'Audit Log', icon: Eye }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-semibold flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? `border-b-2 border-indigo-600 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
                      : `${mutedTextClass} hover:${textClass}`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Risk Distribution Heat Map */}
            <div className={`${cardClass} rounded-lg border p-6`}>
              <h3 className={`text-xl font-bold ${textClass} mb-4`}>Client Risk Distribution</h3>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { tier: 'low', count: 42, percentage: 56, color: 'green' },
                  { tier: 'medium', count: 23, percentage: 31, color: 'yellow' },
                  { tier: 'high', count: 8, percentage: 11, color: 'orange' },
                  { tier: 'critical', count: 2, percentage: 2, color: 'red' }
                ].map((item) => (
                  <div key={item.tier} className={`p-4 rounded-lg border-2 border-${item.color}-${darkMode ? '700' : '200'} bg-${item.color}-${darkMode ? '900' : '50'}`}>
                    <p className={`text-sm font-semibold text-${item.color}-${darkMode ? '400' : '700'} mb-2`}>
                      {item.tier.toUpperCase()} RISK
                    </p>
                    <p className={`text-3xl font-bold text-${item.color}-${darkMode ? '400' : '600'}`}>{item.count}</p>
                    <p className={`text-sm text-${item.color}-${darkMode ? '500' : '700'} mt-1`}>{item.percentage}% of portfolio</p>
                  </div>
                ))}
              </div>

              <div className="w-full h-12 flex rounded-lg overflow-hidden">
                <div className="bg-green-500" style={{ width: '56%' }} />
                <div className="bg-yellow-500" style={{ width: '31%' }} />
                <div className="bg-orange-500" style={{ width: '11%' }} />
                <div className="bg-red-500" style={{ width: '2%' }} />
              </div>
            </div>

            {/* Recent Alerts Feed */}
            <div className={`${cardClass} rounded-lg border p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${textClass}`}>Recent Alerts (Last 30 Days)</h3>
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>

              <div className="space-y-3">
                {adverseEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className={`p-4 rounded-lg border-l-4 ${
                    event.severity === 'critical' ? `border-red-${darkMode ? '600' : '500'} bg-red-${darkMode ? '900/20' : '50'}` :
                    event.severity === 'high' ? `border-orange-${darkMode ? '600' : '500'} bg-orange-${darkMode ? '900/20' : '50'}` :
                    event.severity === 'medium' ? `border-yellow-${darkMode ? '600' : '500'} bg-yellow-${darkMode ? '900/20' : '50'}` :
                    `border-blue-${darkMode ? '600' : '500'} bg-blue-${darkMode ? '900/20' : '50'}`
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            event.severity === 'critical' ? 'bg-red-500 text-white' :
                            event.severity === 'high' ? 'bg-orange-500 text-white' :
                            event.severity === 'medium' ? 'bg-yellow-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}>
                            {event.severity.toUpperCase()}
                          </span>
                          <span className={`text-sm font-semibold ${textClass}`}>{event.clientName}</span>
                          <span className={`text-sm ${mutedTextClass}`}>•</span>
                          <span className={`text-sm ${mutedTextClass}`}>{event.eventType.replace(/-/g, ' ').toUpperCase()}</span>
                        </div>
                        <p className={`text-sm ${mutedTextClass} mb-2`}>{event.description}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className={mutedTextClass}>{event.date.toLocaleDateString()}</span>
                          <span className={mutedTextClass}>•</span>
                          <span className={mutedTextClass}>Source: {event.source}</span>
                          <span className={mutedTextClass}>•</span>
                          <span className={`font-semibold ${event.riskDelta < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            Risk Delta: {event.riskDelta}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Equifax Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className={`${cardClass} rounded-lg border p-4`}>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${mutedTextClass}`} />
                  <input
                    type="text"
                    placeholder="Search by client name, ABN, or report ID..."
                    className={`w-full pl-10 pr-4 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Order New Report
                </Button>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className={`${cardClass} rounded-lg border-2 ${
                  report.riskTier === 'critical' ? `border-red-${darkMode ? '700' : '200'}` :
                  report.riskTier === 'high' ? `border-orange-${darkMode ? '700' : '200'}` :
                  report.riskTier === 'medium' ? `border-yellow-${darkMode ? '700' : '200'}` :
                  `border-green-${darkMode ? '700' : '200'}`
                } p-6`}>
                  {/* Report Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-xl font-bold ${textClass}`}>{report.clientName}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold bg-${getRiskColor(report.riskTier)}/20 text-${getRiskColor(report.riskTier)}`}>
                          {report.riskTier.toUpperCase()} RISK
                        </span>
                        {report.status === 'complete' && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-sm font-semibold rounded-full flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Verified via Equifax
                          </span>
                        )}
                        {report.insolvencyIndicator && (
                          <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            INSOLVENCY
                          </span>
                        )}
                      </div>
                      <div className={`flex items-center gap-4 text-sm ${mutedTextClass}`}>
                        <span>Report ID: {report.id}</span>
                        <span>•</span>
                        <span>ABN: {report.abn}</span>
                        {report.acn && (
                          <>
                            <span>•</span>
                            <span>ACN: {report.acn}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>Ordered: {report.orderedDate.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Full Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Business Profile */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-xs ${mutedTextClass} mb-1`}>Legal Name</p>
                      <p className={`font-semibold ${textClass}`}>{report.legalName}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-xs ${mutedTextClass} mb-1`}>Status</p>
                      <p className={`font-semibold ${report.entityStatus === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {report.entityStatus.toUpperCase()}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-xs ${mutedTextClass} mb-1`}>Industry</p>
                      <p className={`font-semibold ${textClass}`}>{report.industry}</p>
                    </div>
                  </div>

                  {/* Risk Scoring */}
                  <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} mb-4`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className={`text-sm ${mutedTextClass} mb-1`}>Credit Risk Score</p>
                        <div className="flex items-center gap-3">
                          <p className={`text-3xl font-bold text-${getRiskColor(report.riskTier)}`}>
                            {report.creditRiskScore}
                          </p>
                          {report.previousScore && (
                            <div className="flex items-center gap-1">
                              {report.creditRiskScore > report.previousScore ? (
                                <TrendingUp className="w-5 h-5 text-green-600" />
                              ) : (
                                <TrendingDown className="w-5 h-5 text-red-600" />
                              )}
                              <span className={`text-sm font-semibold ${
                                report.creditRiskScore > report.previousScore ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {Math.abs(report.creditRiskScore - report.previousScore)} pts
                              </span>
                              <span className={`text-xs ${mutedTextClass}`}>
                                (was {report.previousScore})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="w-48">
                        <div className={`h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
                          <div
                            className={`h-full bg-${getRiskColor(report.riskTier)}`}
                            style={{ width: `${(report.creditRiskScore / 1000) * 100}%` }}
                          />
                        </div>
                        <p className={`text-xs ${mutedTextClass} text-right mt-1`}>0 - 1000 scale</p>
                      </div>
                    </div>

                    {report.previousRiskTier && report.previousRiskTier !== report.riskTier && (
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                          <p className="font-semibold text-orange-900 dark:text-orange-300">
                            Risk Tier Changed: {report.previousRiskTier.toUpperCase()} → {report.riskTier.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Key Indicators */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`p-3 rounded-lg border-2 ${
                      report.insolvencyIndicator 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${report.insolvencyIndicator ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                          Insolvency Indicator
                        </span>
                        {report.insolvencyIndicator ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border-2 ${
                      report.courtActionIndicator 
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                        : 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${report.courtActionIndicator ? 'text-orange-700 dark:text-orange-300' : 'text-green-700 dark:text-green-300'}`}>
                          Court Action Indicator
                        </span>
                        {report.courtActionIndicator ? (
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border-2 ${
                      report.directorNetworkRisk 
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                        : 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${report.directorNetworkRisk ? 'text-yellow-700 dark:text-yellow-300' : 'text-green-700 dark:text-green-300'}`}>
                          Director Network Risk
                        </span>
                        {report.directorNetworkRisk ? (
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Evidence & Audit */}
                  <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-indigo-600" />
                          <span className={mutedTextClass}>Provider Ref: {report.providerReference}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-indigo-600" />
                          <span className={mutedTextClass}>SHA256: {report.sha256Hash.substring(0, 16)}...</span>
                        </div>
                        {report.linkedCaseId && (
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-indigo-600" />
                            <span className={mutedTextClass}>Case: {report.linkedCaseId}</span>
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 ${mutedTextClass}`}>
                        <Users className="w-4 h-4" />
                        <span>Ordered by {report.orderedBy}</span>
                        {report.reviewedBy && (
                          <>
                            <span>•</span>
                            <span>Reviewed by {report.reviewedBy}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Director Network Tab */}
        {activeTab === 'director-network' && (
          <div className="space-y-6">
            <div className={`${cardClass} rounded-lg border p-6`}>
              <h3 className={`text-xl font-bold ${textClass} mb-4`}>Director Network Visualization</h3>
              
              {/* Network Graph Placeholder */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-12 mb-6 relative`}>
                <div className="text-center">
                  <GitBranch className="w-24 h-24 mx-auto mb-4 text-indigo-600" />
                  <p className={`text-lg font-semibold ${textClass} mb-2`}>Director Network Graph</p>
                  <p className={mutedTextClass}>
                    Interactive visualization showing entity relationships, director connections, and risk indicators
                  </p>
                </div>

                {/* Sample Network Nodes */}
                <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    Client
                  </div>
                </div>

                <div className="absolute top-1/4 right-1/3 transform translate-x-1/2">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    Active
                  </div>
                </div>

                <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2">
                  <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    Insolvent
                  </div>
                </div>

                <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    Historical
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full" />
                  <span className={textClass}>Active Clean</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full" />
                  <span className={textClass}>Under External Admin</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full" />
                  <span className={textClass}>Insolvent</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-400 rounded-full" />
                  <span className={textClass}>Historical</span>
                </div>
              </div>
            </div>

            {/* Network Risk Panel */}
            <div className={`${cardClass} rounded-lg border p-6`}>
              <h3 className={`text-xl font-bold ${textClass} mb-4`}>Network Risk Analysis</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/20' : 'bg-red-50'} border-2 border-red-${darkMode ? '700' : '200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold text-red-${darkMode ? '400' : '700'}`}>Network Risk Score</span>
                    <AlertTriangle className={`w-5 h-5 text-red-${darkMode ? '400' : '600'}`} />
                  </div>
                  <p className={`text-3xl font-bold text-red-${darkMode ? '400' : '600'}`}>7.2/10</p>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-orange-900/20' : 'bg-orange-50'} border-2 border-orange-${darkMode ? '700' : '200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold text-orange-${darkMode ? '400' : '700'}`}>Undisclosed Entities</span>
                    <AlertCircle className={`w-5 h-5 text-orange-${darkMode ? '400' : '600'}`} />
                  </div>
                  <p className={`text-3xl font-bold text-orange-${darkMode ? '400' : '600'}`}>2</p>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/20' : 'bg-red-50'} border-2 border-red-${darkMode ? '700' : '200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold text-red-${darkMode ? '400' : '700'}`}>Phoenix Pattern</span>
                    <Zap className={`w-5 h-5 text-red-${darkMode ? '400' : '600'}`} />
                  </div>
                  <p className={`text-lg font-bold text-red-${darkMode ? '400' : '600'}`}>DETECTED</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Adverse Events Tab */}
        {activeTab === 'adverse-events' && (
          <div className="space-y-6">
            <div className={`${cardClass} rounded-lg border p-6`}>
              <h3 className={`text-xl font-bold ${textClass} mb-4`}>Adverse Events Register</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b-2 ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                      <th className={`text-left p-3 font-semibold ${textClass}`}>Client</th>
                      <th className={`text-left p-3 font-semibold ${textClass}`}>Event Type</th>
                      <th className={`text-left p-3 font-semibold ${textClass}`}>Date</th>
                      <th className={`text-left p-3 font-semibold ${textClass}`}>Source</th>
                      <th className={`text-center p-3 font-semibold ${textClass}`}>Severity</th>
                      <th className={`text-center p-3 font-semibold ${textClass}`}>Risk Delta</th>
                      <th className={`text-center p-3 font-semibold ${textClass}`}>Status</th>
                      <th className={`text-center p-3 font-semibold ${textClass}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adverseEvents.map((event) => (
                      <tr key={event.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <td className="p-3">
                          <p className={`font-semibold ${textClass}`}>{event.clientName}</p>
                          <p className={`text-xs ${mutedTextClass}`}>{event.clientId}</p>
                        </td>
                        <td className="p-3">
                          <span className={`text-sm ${textClass}`}>
                            {event.eventType.replace(/-/g, ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className={`p-3 text-sm ${mutedTextClass}`}>
                          {event.date.toLocaleDateString()}
                        </td>
                        <td className={`p-3 text-sm ${mutedTextClass}`}>
                          {event.source}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            event.severity === 'critical' ? 'bg-red-500 text-white' :
                            event.severity === 'high' ? 'bg-orange-500 text-white' :
                            event.severity === 'medium' ? 'bg-yellow-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}>
                            {event.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`font-bold ${event.riskDelta < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {event.riskDelta}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            event.status === 'escalated' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                            event.status === 'under-review' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                            event.status === 'reviewed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {event.status.replace(/-/g, ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Monitoring Rules Tab */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className={`bg-blue-${darkMode ? '900/20' : '50'} border border-blue-${darkMode ? '700' : '200'} rounded-lg p-4`}>
              <p className={`text-sm text-blue-${darkMode ? '300' : '900'}`}>
                <strong>Admin Only:</strong> Configure automated monitoring rules that trigger actions based on Equifax data changes.
              </p>
            </div>

            {monitoringRules.map((rule) => (
              <div key={rule.id} className={`${cardClass} rounded-lg border-2 p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      rule.enabled ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {rule.enabled ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${textClass}`}>{rule.name}</h3>
                      <p className={`text-sm ${mutedTextClass}`}>Rule ID: {rule.id}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <button
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        rule.enabled
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {rule.enabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className={`font-semibold ${textClass} mb-3`}>IF (Conditions)</h4>
                    <div className="space-y-2">
                      {Object.entries(rule.conditions).map(([key, value]) => {
                        if (value === undefined) return null;
                        return (
                          <div key={key} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${textClass}`}>
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            {typeof value === 'number' && (
                              <p className={`text-xs ${mutedTextClass} mt-1`}>Threshold: {value}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-semibold ${textClass} mb-3`}>THEN (Actions)</h4>
                    <div className="space-y-2">
                      {Object.entries(rule.actions).map(([key, value]) => {
                        if (!value) return null;
                        return (
                          <div key={key} className={`p-3 rounded-lg ${
                            key === 'restrictEngagement' 
                              ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800' 
                              : darkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${
                                key === 'restrictEngagement' ? 'text-red-700 dark:text-red-300 font-semibold' : textClass
                              }`}>
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                              {key === 'restrictEngagement' ? (
                                <Lock className="w-4 h-4 text-red-600" />
                              ) : (
                                <CheckCircle className="w-4 h-4 text-indigo-600" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        {rule.autoRestrict ? (
                          <Lock className="w-5 h-5 text-red-600" />
                        ) : (
                          <Unlock className="w-5 h-5 text-green-600" />
                        )}
                        <span className={`text-sm ${textClass}`}>
                          {rule.autoRestrict ? 'Auto-Restriction Enabled' : 'Manual Review Required'}
                        </span>
                      </div>
                      {rule.manualReview && (
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-indigo-600" />
                          <span className={`text-sm ${textClass}`}>Manual Review Required</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  X,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  Upload,
  ShieldCheck,
  Eye,
  Download,
  Calendar,
  TrendingUp,
  User,
  Building,
  DollarSign,
  Activity,
  Brain,
  Scan,
  Globe,
  Ban,
  Sparkles,
  ArrowRight,
  Info,
  ExternalLink,
  RefreshCw,
  Bell,
  Settings,
  ChevronRight,
  Zap,
  Target,
  Database
} from 'lucide-react';

type ClientView = 'overview' | 'documents' | 'transactions' | 'compliance';
type ComplianceStatus = 'passed' | 'pending' | 'in-review' | 'failed';

interface ClientDetailViewProps {
  client: {
    id: string;
    name: string;
    clientType: string;
    status: string;
    riskTier: string;
    email: string;
    phone?: string;
    address: string;
    complianceScore: number;
    tier1Status: ComplianceStatus;
    tier2Status: ComplianceStatus;
    tier3Status: ComplianceStatus;
    tier4Status: ComplianceStatus;
    tier5Status: ComplianceStatus;
    lastSanctionsCheck: Date;
    transactionMonitoring: 'active' | 'inactive';
    identityWallet: boolean;
    botsActive: number;
  };
  onClose: () => void;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'verified' | 'pending' | 'expired' | 'rejected';
  expiryDate?: string;
  verifiedBy: string;
  dataSource: string;
}

interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  status: 'cleared' | 'pending' | 'flagged';
  riskScore?: number;
  monitoredBy: string;
}

interface ComplianceCheck {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4 | 5;
  status: 'passed' | 'pending' | 'failed' | 'in-review';
  lastChecked: string;
  nextReview?: string;
  bot: string;
  dataSource: string;
  details?: string;
}

export function ClientDetailView({ client, onClose }: ClientDetailViewProps) {
  const [currentView, setCurrentView] = useState<ClientView>('overview');

  // Mock data for documents
  const documents: Document[] = [
    {
      id: 'D1',
      name: 'Certificate of Incorporation',
      type: 'Entity Document',
      uploadDate: '2026-01-15',
      status: 'verified',
      verifiedBy: 'KYB Bot - Tier 1',
      dataSource: 'ASIC Direct'
    },
    {
      id: 'D2',
      name: 'Director ID - Primary',
      type: 'Identity Document',
      uploadDate: '2026-02-10',
      status: 'verified',
      expiryDate: '2030-02-10',
      verifiedBy: 'Identity Verification Bot - Tier 1',
      dataSource: 'Equifax'
    },
    {
      id: 'D3',
      name: 'Proof of Address',
      type: 'Verification Document',
      uploadDate: '2026-03-12',
      status: 'pending',
      verifiedBy: 'Pending manual review',
      dataSource: 'Manual Upload'
    },
    {
      id: 'D4',
      name: 'Source of Funds Statement',
      type: 'Financial Document',
      uploadDate: '2026-03-14',
      status: 'verified',
      verifiedBy: 'Source of Funds Bot - Tier 2',
      dataSource: 'Illion'
    },
    {
      id: 'D5',
      name: 'Beneficial Ownership Declaration',
      type: 'Compliance Document',
      uploadDate: '2026-03-15',
      status: 'verified',
      verifiedBy: 'Beneficial Ownership Bot - Tier 2',
      dataSource: 'ASIC Direct'
    },
    {
      id: 'D6',
      name: 'AML Screening Report',
      type: 'Compliance Document',
      uploadDate: '2026-03-20',
      status: 'verified',
      verifiedBy: 'Global Sanctions Bot - Tier 1',
      dataSource: 'ComplyAdvantage'
    }
  ];

  // Mock data for transactions
  const transactions: Transaction[] = [
    {
      id: 'T1',
      date: '2026-03-20',
      type: 'Wire Transfer In',
      amount: 150000,
      status: 'cleared',
      riskScore: 12,
      monitoredBy: 'ComplyAdvantage'
    },
    {
      id: 'T2',
      date: '2026-03-18',
      type: 'ACH Payment',
      amount: 25000,
      status: 'cleared',
      riskScore: 8,
      monitoredBy: 'Internal Monitoring'
    },
    {
      id: 'T3',
      date: '2026-03-15',
      type: 'Wire Transfer Out',
      amount: 75000,
      status: 'pending',
      riskScore: 45,
      monitoredBy: 'ComplyAdvantage'
    },
    {
      id: 'T4',
      date: '2026-03-10',
      type: 'International Transfer',
      amount: 200000,
      status: 'flagged',
      riskScore: 78,
      monitoredBy: 'ComplyAdvantage + Manual Review'
    }
  ];

  // Mock data for compliance checks
  const complianceChecks: ComplianceCheck[] = [
    {
      id: 'C1',
      name: 'Identity Verification (100-Point)',
      tier: 1,
      status: 'passed',
      lastChecked: '2026-03-10',
      bot: 'AI Identity Verification Bot',
      dataSource: 'Equifax',
      details: 'All directors verified via 100-point check. Identity signals confirmed.'
    },
    {
      id: 'C2',
      name: 'PEP Screening',
      tier: 1,
      status: 'passed',
      lastChecked: '2026-03-20',
      nextReview: '2026-04-20',
      bot: 'Global PEP Screening Bot',
      dataSource: 'ComplyAdvantage',
      details: 'No PEP matches found. Continuous monitoring active.'
    },
    {
      id: 'C3',
      name: 'Sanctions Screening (DFAT)',
      tier: 1,
      status: 'passed',
      lastChecked: '2026-03-20',
      nextReview: '2026-04-20',
      bot: 'Global Sanctions Bot',
      dataSource: 'ComplyAdvantage',
      details: 'No sanctions matches. 2,847 entities screened against DFAT, UN, OFAC, EU lists.'
    },
    {
      id: 'C4',
      name: 'Adverse Media Check',
      tier: 1,
      status: 'passed',
      lastChecked: '2026-03-19',
      nextReview: '2026-04-19',
      bot: 'Global Adverse Media Bot',
      dataSource: 'ComplyAdvantage',
      details: 'No adverse news found. 15 global sources monitored.'
    },
    {
      id: 'C5',
      name: 'Entity Verification (KYB)',
      tier: 1,
      status: 'passed',
      lastChecked: '2026-01-15',
      bot: 'KYB Entity Verification Bot',
      dataSource: 'ASIC Direct',
      details: 'ABN verified, ASIC records current, company active and compliant.'
    },
    {
      id: 'C6',
      name: 'Beneficial Ownership Mapping',
      tier: 2,
      status: 'passed',
      lastChecked: '2026-03-15',
      bot: 'Beneficial Ownership Bot',
      dataSource: 'ASIC Direct',
      details: '3 Ultimate Beneficial Owners identified and verified. 25%+ ownership threshold met.'
    },
    {
      id: 'C7',
      name: 'Source of Funds Verification',
      tier: 2,
      status: 'passed',
      lastChecked: '2026-03-14',
      bot: 'Source of Funds Bot',
      dataSource: 'Illion',
      details: 'Business operations verified. Income sources documented and legitimate.'
    },
    {
      id: 'C8',
      name: 'Court & Litigation Check',
      tier: 2,
      status: 'passed',
      lastChecked: '2026-03-16',
      bot: 'Court & Litigation Bot',
      dataSource: 'Illion',
      details: 'No active litigation. No bankruptcy or insolvency records.'
    },
    {
      id: 'C9',
      name: 'Source of Wealth Analysis',
      tier: 2,
      status: 'passed',
      lastChecked: '2026-03-14',
      bot: 'Source of Wealth Bot',
      dataSource: 'Illion',
      details: 'Wealth accumulation verified through business revenue and asset holdings.'
    },
    {
      id: 'C10',
      name: 'AI Compliance Decision',
      tier: 3,
      status: 'passed',
      lastChecked: '2026-03-20',
      bot: 'Compliance Decision Bot (AI)',
      dataSource: 'Internal AI Engine',
      details: 'Auto-approved with Medium Risk rating. All checks passed. Monitoring active.'
    },
    {
      id: 'C11',
      name: 'Live Transaction Monitoring',
      tier: 3,
      status: 'in-review',
      lastChecked: '2026-03-20',
      bot: 'Monitoring Trigger Bot',
      dataSource: 'ComplyAdvantage',
      details: '1 transaction flagged for manual review (T4). AUSTRAC-compliant monitoring active.'
    },
    {
      id: 'C12',
      name: 'Risk & Profitability Analysis',
      tier: 4,
      status: 'passed',
      lastChecked: '2026-03-20',
      bot: 'Client Risk & Profitability Bot',
      dataSource: 'Internal Analytics',
      details: `Risk Score: 35/100. Profitability: High. CLV: $${client.complianceScore * 1000}. Recommended for growth.`
    },
    {
      id: 'C13',
      name: 'Portfolio Risk Dashboard',
      tier: 5,
      status: 'passed',
      lastChecked: '2026-03-20',
      bot: 'Portfolio Risk Bot',
      dataSource: 'Internal Analytics',
      details: 'Client within acceptable portfolio concentration limits. Diversification optimal.'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Status Banner */}
      <Card className={`border-4 shadow-xl ${
        client.complianceScore >= 90 ? 'border-green-400 bg-gray-50' :
        client.complianceScore >= 70 ? 'border-blue-400 bg-gray-50' :
        client.complianceScore >= 50 ? 'border-amber-400 bg-gray-50' :
        'border-red-400 bg-gray-50'
      }`}>
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl ${
                client.complianceScore >= 90 ? 'bg-green-600' :
                client.complianceScore >= 70 ? 'bg-blue-600' :
                client.complianceScore >= 50 ? 'bg-amber-600' : 'bg-red-600'
              }`}>
                {client.complianceScore >= 70 ? (
                  <CheckCircle className="w-12 h-12 text-white" />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Compliance Status: {client.complianceScore >= 70 ? 'Active' : 'Review Required'}
                </h2>
                <p className="text-gray-700 text-lg">
                  {client.botsActive} AI-powered bots monitoring across {client.identityWallet ? '5' : '4'} tiers
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <Badge className={client.complianceScore >= 70 ? 'bg-green-600 text-white text-sm px-3 py-1' : 'bg-amber-600 text-white text-sm px-3 py-1'}>
                    <Shield className="w-4 h-4 mr-1" />
                    {client.complianceScore >= 90 ? 'Fully Verified' : client.complianceScore >= 70 ? 'Verified' : 'Pending'}
                  </Badge>
                  {client.transactionMonitoring === 'active' && (
                    <Badge className="bg-blue-600 text-white text-sm px-3 py-1">
                      <Activity className="w-4 h-4 mr-1" />
                      Live Monitoring Active
                    </Badge>
                  )}
                  <Badge className="bg-purple-600 text-white text-sm px-3 py-1">
                    Risk: {client.riskTier}
                  </Badge>
                  {client.identityWallet && (
                    <Badge className="bg-indigo-600 text-white text-sm px-3 py-1">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Identity Wallet
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-6xl font-bold text-green-600">{client.complianceScore}%</p>
              <p className="text-gray-600 text-sm">Compliance Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
                <p className="text-sm text-gray-600">Documents</p>
              </div>
            </div>
            <Progress value={(documents.filter(d => d.status === 'verified').length / documents.length) * 100} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">
              {documents.filter(d => d.status === 'verified').length} verified, {documents.filter(d => d.status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{complianceChecks.filter(c => c.status === 'passed').length}/{complianceChecks.length}</p>
                <p className="text-sm text-gray-600">Checks Passed</p>
              </div>
            </div>
            <Progress value={(complianceChecks.filter(c => c.status === 'passed').length / complianceChecks.length) * 100} className="h-2 bg-green-200" />
            <p className="text-xs text-gray-500 mt-2">All tiers monitored</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{transactions.length}</p>
                <p className="text-sm text-gray-600">Transactions</p>
              </div>
            </div>
            <Progress value={75} className="h-2 bg-amber-200" />
            <p className="text-xs text-gray-500 mt-2">
              {transactions.filter(t => t.status === 'flagged').length} flagged for review
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Database className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">6</p>
                <p className="text-sm text-gray-600">Data Sources</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">ASIC, Equifax, Illion, ComplyAdvantage +2</p>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Verification Journey */}
      <Card className="border-2 border-purple-300 shadow-lg">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Brain className="w-7 h-7 text-purple-600" />
            AI-Powered Verification Journey
          </CardTitle>
          <CardDescription className="text-base">
            {client.botsActive} AI bots across {client.identityWallet ? '5' : '4'} tiers protecting compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Tier 1 */}
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-300">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Scan className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-blue-900 text-lg">Tier 1: Core Verification (5 Bots)</h3>
                  <Badge className={client.tier1Status === 'passed' ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'}>
                    {client.tier1Status === 'passed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                    {client.tier1Status.charAt(0).toUpperCase() + client.tier1Status.slice(1)}
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-900 mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-blue-300">Equifax</Badge>
                    <span>Identity Verification ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-blue-300">ComplyAdvantage</Badge>
                    <span>PEP Screening ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-blue-300">ComplyAdvantage</Badge>
                    <span>Sanctions Check ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-blue-300">ComplyAdvantage</Badge>
                    <span>Adverse Media ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-blue-300">ASIC Direct</Badge>
                    <span>KYB Entity Check ✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-300">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-indigo-900 text-lg">Tier 2: Enhanced Due Diligence (4 Bots)</h3>
                  <Badge className={client.tier2Status === 'passed' ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'}>
                    {client.tier2Status === 'passed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                    {client.tier2Status.charAt(0).toUpperCase() + client.tier2Status.slice(1)}
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-indigo-900">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-indigo-300">ASIC Direct</Badge>
                    <span>Beneficial Ownership ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-indigo-300">Illion</Badge>
                    <span>Source of Funds ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-indigo-300">Illion</Badge>
                    <span>Source of Wealth ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-indigo-300">Illion</Badge>
                    <span>Court & Litigation ✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border-2 border-green-300">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-green-900 text-lg">Tier 3: AI Decision Engine (3 Bots)</h3>
                  <Badge className={client.tier3Status === 'passed' || client.tier3Status === 'in-review' ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'}>
                    {client.tier3Status === 'passed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Activity className="w-3 h-3 mr-1 animate-pulse" />}
                    {client.tier3Status === 'in-review' ? 'Active' : client.tier3Status.charAt(0).toUpperCase() + client.tier3Status.slice(1)}
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-green-900">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-green-300">Internal AI</Badge>
                    <span>Compliance Decision ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-green-300">ComplyAdvantage</Badge>
                    <span>Live Monitoring {client.transactionMonitoring === 'active' ? '🟢' : '⚪'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-green-300">Internal</Badge>
                    <span>File QA Complete ✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier 4 */}
            <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border-2 border-amber-300">
              <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-amber-900 text-lg">Tier 4: Commercial Intelligence (4 Bots)</h3>
                  <Badge className={client.tier4Status === 'passed' ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'}>
                    {client.tier4Status === 'passed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                    {client.tier4Status.charAt(0).toUpperCase() + client.tier4Status.slice(1)}
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-amber-900">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-amber-300">Internal</Badge>
                    <span>Risk & Profitability ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-amber-300">Internal</Badge>
                    <span>Pricing Optimized ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-amber-300">Internal</Badge>
                    <span>Portfolio Risk ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-white border-amber-300">Internal</Badge>
                    <span>Revenue Tracking ✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier 5 */}
            {client.identityWallet && (
              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-300">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-purple-900 text-lg">Tier 5: Enterprise OS (6 Bots)</h3>
                    <Badge className={client.tier5Status === 'passed' ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'}>
                      {client.tier5Status === 'passed' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                      {client.tier5Status.charAt(0).toUpperCase() + client.tier5Status.slice(1)}
                    </Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-purple-900">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-white border-purple-300">Internal</Badge>
                      <span>AI Copilot Memos ✓</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-white border-purple-300">Internal</Badge>
                      <span>Workflow Routing ✓</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-white border-purple-300">Internal</Badge>
                      <span>Capacity Planning ✓</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-white border-purple-300">Multi-source</Badge>
                      <span>Identity Wallet 🎯</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Sources Used */}
      <Card className="border-2 border-blue-300">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            Data Sources & Evidence
          </CardTitle>
          <CardDescription>All external providers feeding this client profile</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            {['ASIC Direct', 'Equifax', 'Illion', 'ComplyAdvantage', 'Internal AI', 'Internal Analytics'].map((source, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {source.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{source}</p>
                  <p className="text-xs text-gray-600">
                    {complianceChecks.filter(c => c.dataSource === source).length} checks
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Document Library</CardTitle>
              <CardDescription className="text-base">All documents verified by AI bots + data sources</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Verify All Documents
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Upload New Document
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{doc.name}</p>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                        {doc.dataSource}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {doc.type} • Uploaded {doc.uploadDate}
                      {doc.expiryDate && ` • Expires ${doc.expiryDate}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">✓ {doc.verifiedBy}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      doc.status === 'verified'
                        ? 'bg-green-100 text-green-700'
                        : doc.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : doc.status === 'expired'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }
                  >
                    {doc.status === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {doc.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                    {doc.status === 'expired' && <XCircle className="w-3 h-3 mr-1" />}
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </Badge>
                  {doc.status !== 'verified' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      <ShieldCheck className="w-4 h-4 mr-1" />
                      Verify
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Transaction Monitoring</CardTitle>
              <CardDescription className="text-base">
                Live monitoring by ComplyAdvantage • AUSTRAC-compliant
              </CardDescription>
            </div>
            {client.transactionMonitoring === 'active' && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-semibold">Live Monitoring Active</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  txn.status === 'flagged'
                    ? 'bg-red-50 border-red-300'
                    : txn.status === 'pending'
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      txn.status === 'flagged'
                        ? 'bg-red-600'
                        : txn.status === 'pending'
                        ? 'bg-amber-600'
                        : 'bg-green-600'
                    }`}
                  >
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{txn.type}</p>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                        {txn.monitoredBy}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{txn.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-lg">
                      ${txn.amount.toLocaleString()}
                    </p>
                    {txn.riskScore !== undefined && (
                      <p className="text-xs text-gray-600">
                        Risk:{' '}
                        <span
                          className={
                            txn.riskScore > 50
                              ? 'text-red-600 font-bold'
                              : txn.riskScore > 30
                              ? 'text-amber-600 font-bold'
                              : 'text-green-600 font-bold'
                          }
                        >
                          {txn.riskScore}
                        </span>
                      </p>
                    )}
                  </div>
                  <Badge
                    className={
                      txn.status === 'cleared'
                        ? 'bg-green-100 text-green-700'
                        : txn.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }
                  >
                    {txn.status === 'cleared' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {txn.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                    {txn.status === 'flagged' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                  </Badge>
                  {txn.status === 'flagged' && (
                    <Button size="sm" variant="outline" className="border-red-400 text-red-700">
                      Review
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-2xl">5-Tier Compliance System</CardTitle>
          <CardDescription className="text-base">
            {complianceChecks.length} checks across 6 data sources
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {complianceChecks.map((check) => (
              <div
                key={check.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      check.tier === 1
                        ? 'bg-blue-600'
                        : check.tier === 2
                        ? 'bg-indigo-600'
                        : check.tier === 3
                        ? 'bg-green-600'
                        : check.tier === 4
                        ? 'bg-amber-600'
                        : 'bg-purple-600'
                    }`}
                  >
                    <span className="text-white font-bold text-lg">T{check.tier}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{check.name}</p>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                        {check.dataSource}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">Bot: {check.bot}</p>
                    {check.details && <p className="text-xs text-gray-500 mt-1">{check.details}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      Last checked: {check.lastChecked}
                      {check.nextReview && ` • Next: ${check.nextReview}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      check.status === 'passed'
                        ? 'bg-green-100 text-green-700'
                        : check.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : check.status === 'in-review'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                    }
                  >
                    {check.status === 'passed' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {check.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                    {check.status === 'in-review' && <RefreshCw className="w-3 h-3 mr-1" />}
                    {check.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                    {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-8 py-6 flex items-center justify-between border-b">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
              <Building className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{client.name}</h2>
              <p className="text-white/80 text-sm">
                {client.clientType} • {client.riskTier} Risk • ID: {client.id}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-3 flex items-center gap-2 border-b border-white/10">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'transactions', label: 'Transactions', icon: DollarSign },
            { id: 'compliance', label: 'Compliance', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setCurrentView(tab.id as ClientView)}
                size="sm"
                className={
                  currentView === tab.id
                    ? 'bg-white text-purple-900 hover:bg-white/90'
                    : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                }
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {currentView === 'overview' && renderOverview()}
          {currentView === 'documents' && renderDocuments()}
          {currentView === 'transactions' && renderTransactions()}
          {currentView === 'compliance' && renderCompliance()}
        </div>
      </div>
    </div>
  );
}

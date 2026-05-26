import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  Upload,
  Eye,
  MessageSquare,
  ChevronRight,
  Download,
  Calendar,
  TrendingUp,
  User,
  Building,
  DollarSign,
  Lock,
  Scan,
  Globe,
  Ban,
  Newspaper,
  Activity,
  Brain,
  Target,
  Zap,
  ArrowRight,
  Info,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';

type ClientView = 'overview' | 'documents' | 'transactions' | 'compliance';

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'verified' | 'pending' | 'expired' | 'rejected';
  expiryDate?: string;
  verifiedBy?: string;
}

interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  status: 'cleared' | 'pending' | 'flagged';
  riskScore?: number;
}

interface ComplianceCheck {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4 | 5;
  status: 'passed' | 'pending' | 'failed' | 'in-review';
  lastChecked: string;
  nextReview?: string;
  bot: string;
  details?: string;
}

export function EnhancedClientPortal() {
  const [currentView, setCurrentView] = useState<ClientView>('overview');
  const [clientName] = useState('Acme Consulting Pty Ltd');
  const [clientType] = useState('Trust');
  const [riskRating] = useState('Medium Risk');
  const [onboardingProgress] = useState(85);
  const [complianceScore] = useState(92);

  // Mock data
  const documents: Document[] = [
    {
      id: 'D1',
      name: 'Trust Deed',
      type: 'Trust Document',
      uploadDate: '2026-02-15',
      status: 'verified',
      verifiedBy: 'KYB Bot - Tier 1'
    },
    {
      id: 'D2',
      name: 'Director ID - John Smith',
      type: 'Identity Document',
      uploadDate: '2026-03-10',
      status: 'verified',
      expiryDate: '2030-03-10',
      verifiedBy: 'Identity Verification Bot - Tier 1'
    },
    {
      id: 'D3',
      name: 'Proof of Address',
      type: 'Verification Document',
      uploadDate: '2026-03-12',
      status: 'pending',
      verifiedBy: 'Pending review'
    },
    {
      id: 'D4',
      name: 'Source of Funds Statement',
      type: 'Financial Document',
      uploadDate: '2026-03-14',
      status: 'verified',
      verifiedBy: 'Source of Funds Bot - Tier 2'
    },
    {
      id: 'D5',
      name: 'Beneficial Ownership Declaration',
      type: 'Compliance Document',
      uploadDate: '2026-03-15',
      status: 'verified',
      verifiedBy: 'Beneficial Ownership Bot - Tier 2'
    }
  ];

  const transactions: Transaction[] = [
    {
      id: 'T1',
      date: '2026-03-20',
      type: 'Wire Transfer In',
      amount: 150000,
      status: 'cleared',
      riskScore: 12
    },
    {
      id: 'T2',
      date: '2026-03-18',
      type: 'ACH Payment',
      amount: 25000,
      status: 'cleared',
      riskScore: 8
    },
    {
      id: 'T3',
      date: '2026-03-15',
      type: 'Wire Transfer Out',
      amount: 75000,
      status: 'pending',
      riskScore: 45
    },
    {
      id: 'T4',
      date: '2026-03-10',
      type: 'International Transfer',
      amount: 200000,
      status: 'flagged',
      riskScore: 78
    }
  ];

  const complianceChecks: ComplianceCheck[] = [
    {
      id: 'C1',
      name: 'Identity Verification',
      tier: 1,
      status: 'passed',
      lastChecked: '2026-03-10',
      bot: 'AI Identity Verification Bot',
      details: '100-point check complete. All directors verified.'
    },
    {
      id: 'C2',
      name: 'PEP Screening',
      tier: 1,
      status: 'passed',
      lastChecked: '2026-03-20',
      nextReview: '2026-04-20',
      bot: 'Global PEP Screening Bot',
      details: 'No PEP matches found. Continuous monitoring active.'
    },
    {
      id: 'C3',
      name: 'Sanctions Screening',
      tier: 1,
      status: 'passed',
      lastChecked: '2026-03-20',
      nextReview: '2026-04-20',
      bot: 'Global Sanctions Bot (DFAT)',
      details: 'No sanctions matches. 2,847 entities screened.'
    },
    {
      id: 'C4',
      name: 'Adverse Media Check',
      tier: 1,
      status: 'passed',
      lastChecked: '2026-03-19',
      nextReview: '2026-04-19',
      bot: 'Global Adverse Media Bot',
      details: 'No adverse news found. 15 sources monitored.'
    },
    {
      id: 'C5',
      name: 'Entity Verification (KYB)',
      tier: 1,
      status: 'passed',
      lastChecked: '2026-02-15',
      bot: 'KYB Entity Verification Bot',
      details: 'ABN verified, ASIC records current, company active.'
    },
    {
      id: 'C6',
      name: 'Beneficial Ownership Mapping',
      tier: 2,
      status: 'passed',
      lastChecked: '2026-03-15',
      bot: 'Beneficial Ownership Bot (AUSTRAC Tranche 2)',
      details: '3 UBOs identified and verified. 25%+ ownership threshold met.'
    },
    {
      id: 'C7',
      name: 'Source of Funds',
      tier: 2,
      status: 'passed',
      lastChecked: '2026-03-14',
      bot: 'Source of Funds Verification Bot',
      details: 'Business operations verified. Income sources documented.'
    },
    {
      id: 'C8',
      name: 'Court & Litigation Check',
      tier: 2,
      status: 'passed',
      lastChecked: '2026-03-16',
      bot: 'Court & Litigation Bot',
      details: 'No active litigation. No bankruptcy records.'
    },
    {
      id: 'C9',
      name: 'Compliance Decision',
      tier: 3,
      status: 'passed',
      lastChecked: '2026-03-20',
      bot: 'Compliance Decision Bot (AI)',
      details: 'Auto-approved with Medium Risk rating. Monitoring active.'
    },
    {
      id: 'C10',
      name: 'Live Monitoring',
      tier: 3,
      status: 'in-review',
      lastChecked: '2026-03-20',
      bot: 'Monitoring Trigger Bot',
      details: '1 transaction flagged for manual review (T4).'
    },
    {
      id: 'C11',
      name: 'Risk & Profitability Analysis',
      tier: 4,
      status: 'passed',
      lastChecked: '2026-03-20',
      bot: 'Client Risk & Profitability Bot',
      details: 'Risk Score: 35/100. Profitability: High. Recommended for growth.'
    },
    {
      id: 'C12',
      name: 'Portfolio Monitoring',
      tier: 5,
      status: 'passed',
      lastChecked: '2026-03-20',
      bot: 'Portfolio Risk Dashboard Bot',
      details: 'Client within acceptable portfolio concentration limits.'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Status Banner */}
      <Card className="border-4 border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center shadow-xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Compliance Status: Active</h2>
                <p className="text-gray-700 text-lg">All 22 AI-powered bots have verified your profile across 5 tiers</p>
                <div className="flex items-center gap-3 mt-3">
                  <Badge className="bg-green-600 text-white text-sm px-3 py-1">
                    <Shield className="w-4 h-4 mr-1" />
                    Fully Verified
                  </Badge>
                  <Badge className="bg-blue-600 text-white text-sm px-3 py-1">
                    <Activity className="w-4 h-4 mr-1" />
                    Live Monitoring Active
                  </Badge>
                  <Badge className="bg-purple-600 text-white text-sm px-3 py-1">
                    Risk: {riskRating}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-6xl font-bold text-green-600">{complianceScore}%</p>
              <p className="text-gray-600 text-sm">Compliance Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-2 border-blue-300 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-900">{documents.length}</p>
                <p className="text-sm text-blue-700">Documents</p>
              </div>
            </div>
            <Progress value={80} className="h-2" />
            <p className="text-xs text-blue-600 mt-2">4 verified, 1 pending</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-300 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-900">12/12</p>
                <p className="text-sm text-green-700">Checks Passed</p>
              </div>
            </div>
            <Progress value={100} className="h-2 bg-green-200" />
            <p className="text-xs text-green-600 mt-2">All tiers complete</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-300 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-amber-900">{transactions.length}</p>
                <p className="text-sm text-amber-700">Transactions</p>
              </div>
            </div>
            <Progress value={75} className="h-2 bg-amber-200" />
            <p className="text-xs text-amber-600 mt-2">1 flagged for review</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-300 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-900">Live</p>
                <p className="text-sm text-purple-700">Monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-purple-600">24/7 Active</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Verification Journey */}
      <Card className="border-2 border-purple-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Brain className="w-7 h-7 text-purple-600" />
            Your AI-Powered Verification Journey
          </CardTitle>
          <CardDescription className="text-base">22 AI bots across 5 tiers protecting your compliance</CardDescription>
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
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Complete
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Identity Verification ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>PEP Screening ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Sanctions Check ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Adverse Media ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
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
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Complete
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-indigo-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Beneficial Ownership ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Source of Funds ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Source of Wealth ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
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
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-green-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Compliance Decision (Auto-approved) ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600 animate-pulse" />
                    <span>Live Monitoring Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
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
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Analyzed
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-amber-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Risk & Profitability: High Value ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Pricing Optimized ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Portfolio Risk: Low ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Revenue Tracking ✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier 5 */}
            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-300">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-purple-900 text-lg">Tier 5: Enterprise OS (6 Bots)</h3>
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Optimized
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-purple-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>AI Copilot Memos Generated ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Workflow Auto-routed ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Capacity Planning Updated ✓</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Identity Wallet Created ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Required */}
      <Card className="border-2 border-amber-300 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            Action Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-200">
            <div>
              <p className="font-semibold text-gray-900">1 Transaction Pending Review</p>
              <p className="text-sm text-gray-600">International transfer flagged by Monitoring Bot - manual review required</p>
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Review Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Document Library</CardTitle>
              <CardDescription className="text-base">All uploaded documents verified by AI bots</CardDescription>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Upload className="w-4 h-4 mr-2" />
              Upload New Document
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-600">
                      {doc.type} • Uploaded {doc.uploadDate}
                      {doc.expiryDate && ` • Expires ${doc.expiryDate}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Verified by: {doc.verifiedBy}</p>
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

      {/* Document Requirements */}
      <Card className="border-2 border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Info className="w-6 h-6 text-blue-600" />
            Document Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-900">
            <p>• All identity documents must be current and not expired</p>
            <p>• Trust documents must include complete trust deed</p>
            <p>• Source of funds documentation must cover all large transactions</p>
            <p>• Beneficial ownership declarations must be updated annually</p>
            <p>• Documents are automatically re-verified when changes are detected</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Transaction Monitoring</CardTitle>
              <CardDescription className="text-base">
                Live monitoring by Tier 3 AI bots • AUSTRAC-compliant
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-semibold">Live Monitoring Active</span>
            </div>
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
                <div className="flex items-center gap-4">
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
                  <div>
                    <p className="font-semibold text-gray-900">{txn.type}</p>
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
                        Risk Score:{' '}
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
                      Provide Details
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Info */}
      <Card className="border-2 border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="w-6 h-6 text-blue-600" />
            Tier 3: Live Transaction Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-blue-900">
            <p className="font-semibold">Monitoring Trigger Bot is actively watching:</p>
            <div className="grid md:grid-cols-2 gap-2 ml-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Transaction patterns and anomalies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Cross-border payments (>$10K AUD)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Structuring behavior detection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>High-risk jurisdiction transfers</span>
              </div>
            </div>
            <p className="mt-3">
              <strong>AUSTRAC Compliance:</strong> All transactions are monitored in real-time and reported as
              required by AML/CTF regulations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
          <CardTitle className="text-2xl">5-Tier Compliance System</CardTitle>
          <CardDescription className="text-base">
            22 AI-powered bots protecting your compliance across all tiers
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {complianceChecks.map((check) => (
              <div
                key={check.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center gap-4">
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
                    <p className="font-semibold text-gray-900">{check.name}</p>
                    <p className="text-xs text-gray-600">Bot: {check.bot}</p>
                    {check.details && <p className="text-xs text-gray-500 mt-1">{check.details}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      Last checked: {check.lastChecked}
                      {check.nextReview && ` • Next review: ${check.nextReview}`}
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

      {/* Compliance Summary */}
      <Card className="border-2 border-green-300 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-6 h-6 text-green-600" />
            Compliance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                <p className="text-3xl font-bold text-blue-600">5</p>
                <p className="text-xs text-gray-600">Tier 1 Checks</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                <p className="text-3xl font-bold text-indigo-600">4</p>
                <p className="text-xs text-gray-600">Tier 2 Checks</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                <p className="text-3xl font-bold text-green-600">3</p>
                <p className="text-xs text-gray-600">Tier 3 Bots</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                <p className="text-3xl font-bold text-amber-600">4</p>
                <p className="text-xs text-gray-600">Tier 4 Analysis</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                <p className="text-3xl font-bold text-purple-600">6</p>
                <p className="text-xs text-gray-600">Tier 5 Systems</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-bold text-green-900 mb-2">What This Means:</h4>
              <ul className="text-sm text-green-900 space-y-1">
                <li>✓ You have been verified across all 5 compliance tiers</li>
                <li>✓ 22 AI-powered bots continuously monitor your profile</li>
                <li>✓ Live transaction monitoring is active 24/7</li>
                <li>✓ Your data is stored in a reusable identity wallet (Tier 5)</li>
                <li>✓ All AUSTRAC AML/CTF requirements are met</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
                <Building className="w-9 h-9 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{clientName}</h1>
                <p className="text-white/80 text-lg">{clientType} • {riskRating}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {currentView === 'overview' && renderOverview()}
        {currentView === 'documents' && renderDocuments()}
        {currentView === 'transactions' && renderTransactions()}
        {currentView === 'compliance' && renderCompliance()}
      </div>
    </div>
  );
}

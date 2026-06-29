import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  FileText,
  Globe,
  Eye,
  ArrowRight,
  ArrowLeft,
  Calendar,
  RefreshCw,
  Bell,
  Download,
  Sparkles,
  Building2,
  Ban,
  Info,
  XCircle,
  ChevronRight,
  ExternalLink,
  Newspaper,
  Scale,
  Gavel,
  AlertOctagon,
  TrendingDown,
  Users,
  Target,
  Filter,
  Upload,
  Database,
  BookOpen,
  Zap
} from 'lucide-react';

type ViewMode = 'dashboard' | 'new-check' | 'monthly-queue' | 'review-workbench' | 'subject-profile' | 'escalation' | 'rules' | 'reporting' | 'sources' | 'bulk-monitor';

interface AdverseMediaBotProps {
  onBack?: () => void;
}

export function AdverseMediaBot({ onBack }: AdverseMediaBotProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  // Dashboard view
  if (currentView === 'dashboard') {
    return <AdverseMediaControlCentre onNavigate={setCurrentView} onBack={onBack} />;
  }

  // New check wizard
  if (currentView === 'new-check') {
    return <NewAdverseMediaWizard onBack={() => setCurrentView('dashboard')} />;
  }

  // Monthly queue
  if (currentView === 'monthly-queue') {
    return <MonthlyMediaQueue onBack={() => setCurrentView('dashboard')} />;
  }

  // Bulk monitor
  if (currentView === 'bulk-monitor') {
    return <BulkPortfolioMonitor onBack={() => setCurrentView('dashboard')} />;
  }

  return <AdverseMediaControlCentre onNavigate={setCurrentView} onBack={onBack} />;
}

// Screen 1: Adverse Media Control Centre
function AdverseMediaControlCentre({ onNavigate, onBack }: { onNavigate: (view: ViewMode) => void; onBack?: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="bg-[#1e293b] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {onBack && (
            <Button onClick={onBack} variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Grow Compliance OS
            </Button>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Newspaper className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Global Adverse Media Screening Bot</h1>
                  <p className="text-slate-300">AI-Powered Adverse Media Monitoring & Risk Detection</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={() => onNavigate('new-check')} className="bg-[#13B5EA] hover:bg-[#0E7C9E]">
                <Search className="w-4 h-4 mr-2" />
                Run New Screen
              </Button>
              <Button variant="outline" onClick={() => onNavigate('bulk-monitor')}>
                <Upload className="w-4 h-4 mr-2" />
                Bulk Screen
              </Button>
              <Button variant="outline" onClick={() => onNavigate('reporting')}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          <Card className="border-2 hover:border-blue-400 transition-colors cursor-pointer" onClick={() => onNavigate('new-check')}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <Badge className="bg-blue-500/15 text-blue-300 text-xs">31</Badge>
              </div>
              <p className="text-xs font-medium text-white">Awaiting Screening</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-400 transition-colors cursor-pointer" onClick={() => onNavigate('monthly-queue')}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <RefreshCw className="w-4 h-4 text-purple-400" />
                <Badge className="bg-purple-500/15 text-purple-300 text-xs">284</Badge>
              </div>
              <p className="text-xs font-medium text-white">Monthly Reviews Due</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-amber-400 transition-colors cursor-pointer">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <Badge className="bg-amber-500/15 text-amber-300 text-xs">17</Badge>
              </div>
              <p className="text-xs font-medium text-white">Possible Matches</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-red-400 transition-colors cursor-pointer">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <Badge className="bg-red-500/15 text-red-300 text-xs">6</Badge>
              </div>
              <p className="text-xs font-medium text-white">Severe Alerts</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-400 transition-colors cursor-pointer">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-4 h-4 text-orange-400" />
                <Badge className="bg-orange-500/15 text-orange-300 text-xs">9</Badge>
              </div>
              <p className="text-xs font-medium text-white">Escalated Cases</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-red-400 transition-colors cursor-pointer">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <Badge className="bg-red-500/15 text-red-300 text-xs">18</Badge>
              </div>
              <p className="text-xs font-medium text-white">Overdue Reviews</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-gray-400 transition-colors cursor-pointer">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Ban className="w-4 h-4 text-slate-300" />
                <Badge className="bg-[#0f172a] text-slate-300 text-xs">3</Badge>
              </div>
              <p className="text-xs font-medium text-white">Failed Jobs</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-red-400 transition-colors cursor-pointer">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Gavel className="w-4 h-4 text-red-400" />
                <Badge className="bg-red-500/15 text-red-300 text-xs">4</Badge>
              </div>
              <p className="text-xs font-medium text-white">New Court Alerts</p>
            </CardContent>
          </Card>
        </div>

        {/* Queue Tables */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* New Checks Queue */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-400" />
                New Screening Queue
              </CardTitle>
              <CardDescription>Subjects awaiting initial adverse media screening</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0f172a] border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Role</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: 'Michael Thompson', type: 'Person', role: 'Director', country: 'Australia', status: 'Queued', priority: 'Normal' },
                      { name: 'Westfield Holdings Pty Ltd', type: 'Entity', role: 'Client', country: 'Australia', status: 'Searching', priority: 'Normal' },
                      { name: 'David Kim', type: 'Person', role: 'Beneficial Owner', country: 'South Korea', status: 'Review Required', priority: 'High' },
                      { name: 'Alexandra Martinez', type: 'Person', role: 'Guarantor', country: 'Spain', status: 'Queued', priority: 'Normal' },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 cursor-pointer">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-white">{item.name}</p>
                            <p className="text-xs text-slate-400">{item.country}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-300">{item.type}</td>
                        <td className="px-4 py-3 text-xs text-slate-300">{item.role}</td>
                        <td className="px-4 py-3">
                          <Badge className={
                            item.status === 'Queued' ? 'bg-[#0f172a] text-slate-300' :
                            item.status === 'Searching' ? 'bg-blue-500/15 text-blue-300' :
                            'bg-amber-500/15 text-amber-300'
                          }>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t bg-[#0f172a]">
                <Button variant="ghost" className="w-full text-blue-300 hover:bg-blue-500/10" onClick={() => onNavigate('new-check')}>
                  View All New Screens <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Rescreens Queue */}
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-purple-400" />
                Monthly Rescreening Queue
              </CardTitle>
              <CardDescription>Active subjects requiring periodic review</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0f172a] border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Last Review</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-300">Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: 'Robert Wilson', lastReview: '29 days ago', currentStatus: 'Clear', delta: 'No change' },
                      { name: 'Pacific Investments Ltd', lastReview: '31 days ago', currentStatus: 'Low Relevance', delta: 'No change' },
                      { name: 'Jennifer Brown', lastReview: '30 days ago', currentStatus: 'Clear', delta: 'NEW ALERT' },
                      { name: 'Global Trading Corp', lastReview: '28 days ago', currentStatus: 'Confirmed Issues', delta: 'Severity ↑' },
                    ].map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 cursor-pointer">
                        <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                        <td className="px-4 py-3 text-xs text-slate-300">{item.lastReview}</td>
                        <td className="px-4 py-3">
                          <Badge className={
                            item.currentStatus === 'Clear' ? 'bg-green-500/15 text-green-300' :
                            item.currentStatus === 'Low Relevance' ? 'bg-blue-500/15 text-blue-300' :
                            'bg-amber-500/15 text-amber-300'
                          }>
                            {item.currentStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {item.delta === 'No change' ? (
                            <span className="text-xs text-slate-400">{item.delta}</span>
                          ) : (
                            <Badge className="bg-red-500/15 text-red-300">{item.delta}</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t bg-[#0f172a]">
                <Button variant="ghost" className="w-full text-purple-300 hover:bg-purple-500/10" onClick={() => onNavigate('monthly-queue')}>
                  View All Monthly Reviews <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts Feed */}
        <Card className="border-2 mb-8">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-400" />
              Recent Alerts & Critical Events
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border-2 border-red-300 rounded-lg">
                <AlertOctagon className="w-5 h-5 text-red-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-300 text-sm">SEVERE: Court Judgment - Fraud Conviction</p>
                  <p className="text-xs text-red-300 mt-1">
                    <strong>David Kim</strong> - Supreme Court NSW judgment for conspiracy to defraud investors. $2.4M damages awarded. Director disqualification pending.
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className="bg-red-600 text-white text-xs">Level 4 Severity</Badge>
                    <Badge className="bg-[#0f172a] text-slate-300 text-xs">Official Court Source</Badge>
                    <span className="text-xs text-red-400">Action Required: Escalate & Block Relationship</span>
                  </div>
                </div>
                <Badge className="bg-red-600 text-white">NEW</Badge>
              </div>

              <div className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <TrendingDown className="w-5 h-5 text-orange-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-orange-300 text-sm">NEW: Insolvency Notice</p>
                  <p className="text-xs text-orange-300 mt-1">
                    <strong>Jennifer Brown</strong> - ASIC Gazette: Personal insolvency notice filed. Previously clear on last monthly review.
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className="bg-orange-600 text-white text-xs">Level 3 Severity</Badge>
                    <Badge className="bg-blue-500/15 text-blue-300 text-xs">ASIC Official</Badge>
                    <span className="text-xs text-orange-400">Monthly review detected status change</span>
                  </div>
                </div>
                <Badge className="bg-orange-600 text-white">2h ago</Badge>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <Scale className="w-5 h-5 text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-300 text-sm">Regulatory Action Notice</p>
                  <p className="text-xs text-amber-300 mt-1">
                    <strong>Global Trading Corp</strong> - ASIC enforcement notice: civil penalty proceedings commenced. Breach of continuous disclosure obligations.
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className="bg-amber-600 text-white text-xs">Level 3 Severity</Badge>
                    <Badge className="bg-blue-500/15 text-blue-300 text-xs">ASIC Media Release</Badge>
                  </div>
                </div>
                <Badge className="bg-amber-600 text-white">5h ago</Badge>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-blue-300 text-sm">Monthly Screening Complete</p>
                  <p className="text-xs text-blue-300 mt-1">267 of 284 monthly reviews completed - 17 flagged for analyst review</p>
                </div>
                <Badge className="bg-blue-600 text-white">1d ago</Badge>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xs font-medium text-slate-300">Sources Online</p>
                  </div>
                  <p className="text-2xl font-bold text-green-400">24/24</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-xs font-medium text-slate-300">Search Queue</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-400">31</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <p className="text-xs font-medium text-slate-300">Severe Alerts</p>
                  </div>
                  <p className="text-2xl font-bold text-red-400">6</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <p className="text-xs font-medium text-slate-300">High-Risk Jurisdictions</p>
                  </div>
                  <p className="text-2xl font-bold text-amber-400">12</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('bulk-monitor')}>
            <CardContent className="p-6">
              <Upload className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Bulk Portfolio Monitor</h3>
              <p className="text-sm text-slate-300 mb-4">Screen entire client base or upload subject list</p>
              <Button variant="outline" className="w-full">
                Launch Monitor <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('sources')}>
            <CardContent className="p-6">
              <Database className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Source Management</h3>
              <p className="text-sm text-slate-300 mb-4">Configure global sources and reliability scoring</p>
              <Button variant="outline" className="w-full">
                Manage Sources <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('rules')}>
            <CardContent className="p-6">
              <Target className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Rules Engine</h3>
              <p className="text-sm text-slate-300 mb-4">Configure severity thresholds and escalation logic</p>
              <Button variant="outline" className="w-full">
                Configure Rules <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Screen 2: New Adverse Media Check Wizard
function NewAdverseMediaWizard({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    subjectType: 'person',
    fullName: '',
    entityName: '',
    aliases: '',
    tradingNames: '',
    dob: '',
    countryOfResidence: '',
    nationality: '',
    roleInMatter: 'client',
    linkedEntity: '',
    directorOrBO: false,
    knownHighRiskIndustry: '',
    knownLitigation: false,
    knownInsolvency: false
  });

  const [searchScope, setSearchScope] = useState({
    standard: true,
    expandedGlobal: false,
    highRiskEnhanced: false,
    includeLegalDatabases: true,
    includeRegulatoryNotices: true,
    includeInsolvency: true,
    includeRelatedParties: false,
    includeHistoric: false,
    includeTranslated: false
  });

  const [searchResults, setSearchResults] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  const runSearch = () => {
    setSearching(true);
    // Simulate AI search
    setTimeout(() => {
      setSearchResults({
        noAdverseMedia: { confidence: 78, severity: 0, matches: 0 },
        possibleMatch: { confidence: 0, severity: 0, matches: 0 },
        legalIssue: { confidence: 0, severity: 0, matches: 0 },
        insolvencyIssue: { confidence: 0, severity: 0, matches: 0 },
        regulatoryAction: { confidence: 0, severity: 0, matches: 0 },
        crimeOrFraud: { confidence: 0, severity: 0, matches: 0 },
        reputational: { confidence: 0, severity: 0, matches: 0 }
      });
      setSearching(false);
      setStep(4);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="bg-[#1e293b] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Newspaper className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">New Adverse Media Check</h1>
              <p className="text-slate-300">AI-powered global adverse media screening wizard</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mt-6 flex items-center justify-between max-w-2xl">
            {[
              { num: 1, label: 'Subject Details' },
              { num: 2, label: 'Search Scope' },
              { num: 3, label: 'AI Search Plan' },
              { num: 4, label: 'Results' },
              { num: 5, label: 'Decision' },
              { num: 6, label: 'Outcome' }
            ].map((s) => (
              <div key={s.num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s.num ? 'bg-red-600 text-white' : 'bg-white/10 text-slate-300'
                }`}>
                  {s.num}
                </div>
                <div className="ml-2">
                  <p className={`text-xs font-medium ${step >= s.num ? 'text-red-400' : 'text-slate-400'}`}>
                    {s.label}
                  </p>
                </div>
                {s.num < 6 && <div className={`mx-2 w-8 h-0.5 ${step > s.num ? 'bg-red-600' : 'bg-gray-300'}`}></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Step 1: Subject Details */}
        {step === 1 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Step 1: Subject Details</CardTitle>
              <CardDescription>Enter details of the person or entity to be screened</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Subject Type *</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="subjectType"
                      value="person"
                      checked={formData.subjectType === 'person'}
                      onChange={(e) => setFormData({ ...formData, subjectType: e.target.value })}
                      className="w-4 h-4 text-red-400"
                    />
                    <span className="text-sm text-slate-300">Person</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="subjectType"
                      value="entity"
                      checked={formData.subjectType === 'entity'}
                      onChange={(e) => setFormData({ ...formData, subjectType: e.target.value })}
                      className="w-4 h-4 text-red-400"
                    />
                    <span className="text-sm text-slate-300">Entity</span>
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {formData.subjectType === 'person' ? (
                  <>
                    <div>
                      <Label>Full Legal Name *</Label>
                      <Input 
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Michael James Thompson"
                      />
                    </div>
                    <div>
                      <Label>Known Aliases</Label>
                      <Input 
                        value={formData.aliases}
                        onChange={(e) => setFormData({ ...formData, aliases: e.target.value })}
                        placeholder="e.g. Mike Thompson, M.J. Thompson"
                      />
                    </div>
                    <div>
                      <Label>Date of Birth *</Label>
                      <Input 
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label>Entity Legal Name *</Label>
                      <Input 
                        value={formData.entityName}
                        onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                        placeholder="e.g. Westfield Holdings Pty Ltd"
                      />
                    </div>
                    <div>
                      <Label>Trading Names</Label>
                      <Input 
                        value={formData.tradingNames}
                        onChange={(e) => setFormData({ ...formData, tradingNames: e.target.value })}
                        placeholder="e.g. Westfield, WH Group"
                      />
                    </div>
                  </>
                )}
                <div>
                  <Label>Country of Residence / Registration *</Label>
                  <Input 
                    value={formData.countryOfResidence}
                    onChange={(e) => setFormData({ ...formData, countryOfResidence: e.target.value })}
                    placeholder="e.g. Australia"
                  />
                </div>
                {formData.subjectType === 'person' && (
                  <div>
                    <Label>Nationality</Label>
                    <Input 
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      placeholder="e.g. Australian"
                    />
                  </div>
                )}
                <div>
                  <Label>Role in Matter *</Label>
                  <select
                    value={formData.roleInMatter}
                    onChange={(e) => setFormData({ ...formData, roleInMatter: e.target.value })}
                    className="w-full px-3 py-2 border border-white/10 rounded-md"
                  >
                    <option value="client">Client</option>
                    <option value="director">Director</option>
                    <option value="beneficial-owner">Beneficial Owner</option>
                    <option value="guarantor">Guarantor</option>
                    <option value="borrower">Borrower</option>
                    <option value="investor">Investor</option>
                    <option value="trustee">Trustee</option>
                    <option value="shareholder">Shareholder</option>
                  </select>
                </div>
                <div>
                  <Label>High-Risk Industry (if known)</Label>
                  <Input 
                    value={formData.knownHighRiskIndustry}
                    onChange={(e) => setFormData({ ...formData, knownHighRiskIndustry: e.target.value })}
                    placeholder="e.g. Cryptocurrency, Gaming"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.knownLitigation}
                      onChange={(e) => setFormData({ ...formData, knownLitigation: e.target.checked })}
                      className="w-4 h-4 text-red-400 rounded"
                    />
                    <span className="text-sm text-slate-300">Known litigation disclosure</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.knownInsolvency}
                      onChange={(e) => setFormData({ ...formData, knownInsolvency: e.target.checked })}
                      className="w-4 h-4 text-red-400 rounded"
                    />
                    <span className="text-sm text-slate-300">Known insolvency disclosure</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={onBack}>Cancel</Button>
                <Button 
                  onClick={() => setStep(2)}
                  disabled={
                    formData.subjectType === 'person' 
                      ? (!formData.fullName || !formData.dob || !formData.countryOfResidence)
                      : (!formData.entityName || !formData.countryOfResidence)
                  }
                  className="bg-red-600 hover:bg-red-700"
                >
                  Next: Search Scope <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Search Scope */}
        {step === 2 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Step 2: Search Scope</CardTitle>
              <CardDescription>Configure the depth and coverage of adverse media search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border-2 border-red-400 bg-red-500/10 rounded-lg">
                  <input
                    type="radio"
                    name="searchType"
                    checked={searchScope.standard}
                    onChange={() => setSearchScope({ ...searchScope, standard: true, expandedGlobal: false, highRiskEnhanced: false })}
                    className="w-5 h-5 text-red-400 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white">Standard Search (Recommended)</p>
                    <p className="text-sm text-slate-300 mt-1">Official regulators, courts, insolvency registers, major credible news sources</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-white/10 rounded-lg hover:border-gray-400 cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    checked={searchScope.expandedGlobal}
                    onChange={() => setSearchScope({ ...searchScope, standard: false, expandedGlobal: true, highRiskEnhanced: false })}
                    className="w-5 h-5 text-red-400 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white">Expanded Global Search</p>
                    <p className="text-sm text-slate-300 mt-1">Includes international sources, translated searches, archived pages</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border-2 border-white/10 rounded-lg hover:border-gray-400 cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    checked={searchScope.highRiskEnhanced}
                    onChange={() => setSearchScope({ ...searchScope, standard: false, expandedGlobal: false, highRiskEnhanced: true })}
                    className="w-5 h-5 text-red-400 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white">High-Risk Enhanced Search</p>
                    <p className="text-sm text-slate-300 mt-1">Maximum coverage for high-risk jurisdictions and industries</p>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t space-y-3">
                <p className="font-semibold text-white">Additional Coverage Options</p>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={searchScope.includeLegalDatabases}
                    onChange={(e) => setSearchScope({ ...searchScope, includeLegalDatabases: e.target.checked })}
                    className="w-4 h-4 text-red-400 rounded"
                  />
                  <span className="text-sm text-slate-300">Include legal databases and court references</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={searchScope.includeRegulatoryNotices}
                    onChange={(e) => setSearchScope({ ...searchScope, includeRegulatoryNotices: e.target.checked })}
                    className="w-4 h-4 text-red-400 rounded"
                  />
                  <span className="text-sm text-slate-300">Include regulatory notices and enforcement actions</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={searchScope.includeInsolvency}
                    onChange={(e) => setSearchScope({ ...searchScope, includeInsolvency: e.target.checked })}
                    className="w-4 h-4 text-red-400 rounded"
                  />
                  <span className="text-sm text-slate-300">Include insolvency and bankruptcy searches</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={searchScope.includeRelatedParties}
                    onChange={(e) => setSearchScope({ ...searchScope, includeRelatedParties: e.target.checked })}
                    className="w-4 h-4 text-red-400 rounded"
                  />
                  <span className="text-sm text-slate-300">Include related parties and associated entities</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={searchScope.includeHistoric}
                    onChange={(e) => setSearchScope({ ...searchScope, includeHistoric: e.target.checked })}
                    className="w-4 h-4 text-red-400 rounded"
                  />
                  <span className="text-sm text-slate-300">Include historic records (10+ years)</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={searchScope.includeTranslated}
                    onChange={(e) => setSearchScope({ ...searchScope, includeTranslated: e.target.checked })}
                    className="w-4 h-4 text-red-400 rounded"
                  />
                  <span className="text-sm text-slate-300">Include translated and transliterated terms</span>
                </label>
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={() => setStep(3)} className="bg-red-600 hover:bg-red-700">
                  Next: Review Search Plan <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: AI Search Plan */}
        {step === 3 && (
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Step 3: AI Search Plan
              </CardTitle>
              <CardDescription>Review the automated adverse media search strategy</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="font-semibold text-red-300 mb-2">Search Target</p>
                <p className="text-sm text-red-300">
                  <strong>{formData.fullName || formData.entityName}</strong> • {formData.subjectType === 'person' ? formData.nationality : 'Entity'} • {formData.roleInMatter}
                </p>
              </div>

              <div>
                <p className="font-semibold text-white mb-3">Sources to be Searched (24)</p>
                <div className="grid md:grid-cols-2 gap-2">
                  {[
                    'ASIC Enforcement Notices',
                    'Australian Court Judgments (AustLII)',
                    'ASIC Insolvency Notices',
                    'Australian Government Gazette',
                    'AFCA Decisions Database',
                    'NSW Supreme Court',
                    'Federal Court of Australia',
                    'ACCC Enforcement Actions',
                    'ATO Public Rulings',
                    'State Court Registries (8)',
                    'Corporate Registry Notices',
                    'Director Disqualification Register',
                    'ABC News Archive',
                    'Sydney Morning Herald Archive',
                    'Australian Financial Review',
                    'Reuters',
                    'Bloomberg',
                    'Financial Times',
                    'Associated Press',
                    'Official Receiver Notices',
                    'Personal Property Securities Register',
                    'Foreign Court Databases',
                    'International Regulator Notices',
                    'Web Archive (Wayback Machine)'
                  ].map((source, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-[#0f172a] rounded text-xs">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-slate-300">{source}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-white mb-3">Keyword Families by Risk Category</p>
                <div className="space-y-2">
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-xs font-semibold text-red-300 mb-2">Financial Crime</p>
                    <div className="flex flex-wrap gap-1">
                      {['fraud', 'money laundering', 'bribery', 'corruption', 'tax evasion', 'sanctions evasion'].map((term, idx) => (
                        <Badge key={idx} className="bg-red-500/15 text-red-300 text-xs">{term}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <p className="text-xs font-semibold text-orange-300 mb-2">Legal & Court</p>
                    <div className="flex flex-wrap gap-1">
                      {['judgment', 'litigation', 'court action', 'criminal charges', 'civil penalty'].map((term, idx) => (
                        <Badge key={idx} className="bg-orange-500/15 text-orange-300 text-xs">{term}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <p className="text-xs font-semibold text-amber-300 mb-2">Insolvency</p>
                    <div className="flex flex-wrap gap-1">
                      {['bankruptcy', 'insolvency', 'liquidation', 'administration', 'phoenix activity'].map((term, idx) => (
                        <Badge key={idx} className="bg-amber-500/15 text-amber-300 text-xs">{term}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-xs font-semibold text-blue-300 mb-2">Regulatory</p>
                    <div className="flex flex-wrap gap-1">
                      {['ASIC action', 'enforcement', 'licence cancellation', 'director ban', 'disqualification'].map((term, idx) => (
                        <Badge key={idx} className="bg-blue-500/15 text-blue-300 text-xs">{term}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-300 mb-1">Entity Resolution & Severity Rules</p>
                    <ul className="text-sm text-amber-300 space-y-1">
                      <li>• Official court/regulator source = High confidence + Minimum Level 3 severity</li>
                      <li>• Name + DOB + official source = Very high identity confidence</li>
                      <li>• Single weak news article = Low confidence, requires review</li>
                      <li>• Multiple credible sources = Uplift severity</li>
                      <li>• Fraud conviction or director ban = Level 4+ severity (severe)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0f172a] rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-300">Expected Runtime</p>
                  <p className="text-xs text-slate-300">Based on search scope and source coverage</p>
                </div>
                <p className="text-2xl font-bold text-red-400">~90 seconds</p>
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={runSearch} className="bg-green-600 hover:bg-green-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Execute AI Search
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Results Summary */}
        {step === 4 && (
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Step 4: Search Results Summary
              </CardTitle>
              <CardDescription>AI-powered adverse media classification results</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-6 bg-green-500/10 border-2 border-green-400 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-300">No Relevant Adverse Media Found</p>
                      <p className="text-sm text-green-300">Medium-high confidence - 78% match certainty</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-green-400">0</p>
                    <p className="text-xs text-green-300">Matches</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-3 mt-4">
                  <div className="bg-[#1e293b] p-3 rounded">
                    <p className="text-xs text-slate-300">Sources Searched</p>
                    <p className="text-xl font-bold text-white">24</p>
                  </div>
                  <div className="bg-[#1e293b] p-3 rounded">
                    <p className="text-xs text-slate-300">Search Duration</p>
                    <p className="text-xl font-bold text-white">87s</p>
                  </div>
                  <div className="bg-[#1e293b] p-3 rounded">
                    <p className="text-xs text-slate-300">Identity Confidence</p>
                    <p className="text-xl font-bold text-green-400">High</p>
                  </div>
                  <div className="bg-[#1e293b] p-3 rounded">
                    <p className="text-xs text-slate-300">Severity Level</p>
                    <p className="text-xl font-bold text-green-400">0</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { type: 'Possible Match', confidence: 0, severity: 0, matches: 0, color: 'gray' },
                  { type: 'Legal Issue', confidence: 0, severity: 0, matches: 0, color: 'gray' },
                  { type: 'Insolvency Issue', confidence: 0, severity: 0, matches: 0, color: 'gray' },
                  { type: 'Regulatory Action', confidence: 0, severity: 0, matches: 0, color: 'gray' },
                  { type: 'Crime / Fraud Risk', confidence: 0, severity: 0, matches: 0, color: 'gray' },
                  { type: 'Reputational Concern', confidence: 0, severity: 0, matches: 0, color: 'gray' },
                ].map((result, idx) => (
                  <div key={idx} className={`p-4 border-2 rounded-lg bg-[#0f172a] border-white/10`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-white">{result.type}</p>
                      <Badge className="bg-[#0f172a] text-slate-300">
                        {result.matches} matches
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-300">Confidence</span>
                          <span className="text-xs text-slate-300">{result.confidence}%</span>
                        </div>
                        <Progress value={result.confidence} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-300">Severity</span>
                          <span className="text-xs text-slate-300">Level {result.severity}</span>
                        </div>
                        <Progress value={result.severity * 20} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Start New Search
                </Button>
                <Button onClick={() => setStep(5)} className="bg-red-600 hover:bg-red-700">
                  Next: Analyst Decision <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Analyst Decision */}
        {step === 5 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Step 5: Analyst Decision</CardTitle>
              <CardDescription>Review and confirm the adverse media classification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="font-semibold text-blue-300 mb-2">AI Recommendation</p>
                <p className="text-sm text-blue-300">
                  Based on the search results, the AI bot recommends classifying <strong>{formData.fullName || formData.entityName}</strong> as <strong>NO ADVERSE MEDIA</strong> with medium-high confidence.
                </p>
              </div>

              <div>
                <Label className="mb-3 block">Final Classification *</Label>
                <div className="space-y-2">
                  {[
                    { value: 'clear', label: 'Clear - No adverse media', color: 'green', recommended: true },
                    { value: 'low-relevance', label: 'Record low relevance only', color: 'blue' },
                    { value: 'confirm', label: 'Confirm adverse media found', color: 'amber' },
                    { value: 'escalate', label: 'Escalate for enhanced review', color: 'red' },
                    { value: 'more-info', label: 'Request more information', color: 'gray' },
                    { value: 'link', label: 'Link to related subject', color: 'purple' },
                    { value: 'false-positive', label: 'Mark as false positive', color: 'gray' },
                  ].map((option) => (
                    <label key={option.value} className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-white/5 ${
                      option.recommended ? 'border-green-400 bg-green-500/10' : 'border-white/10'
                    }`}>
                      <input
                        type="radio"
                        name="classification"
                        value={option.value}
                        defaultChecked={option.recommended}
                        className="w-4 h-4 text-red-400 mt-0.5"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-white">{option.label}</p>
                        {option.recommended && (
                          <Badge className="mt-1 bg-green-600 text-white text-xs">AI Recommended</Badge>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Analyst Notes</Label>
                <textarea
                  className="w-full px-3 py-2 border border-white/10 rounded-md"
                  rows={3}
                  placeholder="Optional notes about this decision..."
                ></textarea>
              </div>

              <div className="flex justify-between gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setStep(4)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={() => setStep(6)} className="bg-green-600 hover:bg-green-700">
                  Confirm Decision <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Outcome */}
        {step === 6 && (
          <Card className="border-2 border-green-400">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Adverse Media Check Complete</h2>
              <p className="text-slate-300 mb-8">{formData.fullName || formData.entityName} has been classified as CLEAR - No adverse media</p>

              <div className="max-w-2xl mx-auto space-y-4 mb-8">
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Final Result</p>
                    <p className="font-semibold text-white">Clear - No adverse media</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Severity Level</p>
                    <p className="font-semibold text-green-400">Level 0 (Clear)</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Search Date</p>
                    <p className="font-semibold text-white">{new Date().toLocaleDateString('en-AU')}</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Sources Searched</p>
                    <p className="font-semibold text-white">24 official & credible sources</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Reviewer</p>
                    <p className="font-semibold text-white">Current User</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Risk Impact</p>
                    <p className="font-semibold text-green-400">Low Risk - Proceed</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Next Review Date</p>
                    <p className="font-semibold text-white">{new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-AU')}</p>
                  </div>
                  <div className="p-4 bg-[#0f172a] rounded-lg">
                    <p className="text-xs text-slate-300">Issue Categories</p>
                    <p className="font-semibold text-white">None detected</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg text-left">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-purple-300">Automated Monthly Monitoring Enabled</p>
                      <p className="text-sm text-purple-300 mt-1">
                        This subject will be automatically rescreened monthly to detect any new adverse media that emerges during the relationship.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button onClick={onBack} className="bg-red-600 hover:bg-red-700">
                  Return to Dashboard
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Evidence Pack
                </Button>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Screen Another Subject
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Screen 3: Monthly Media Queue
function MonthlyMediaQueue({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-2xl font-bold text-white">Monthly Adverse Media Rescreening</h1>
          <p className="text-slate-300">Automated ongoing monitoring for all active subjects</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6 mb-6">
          {[
            { title: 'Due Today', count: 42, color: 'red' },
            { title: 'Due This Week', count: 284, color: 'amber' },
            { title: 'Overdue', count: 18, color: 'red' },
            { title: 'Failed Searches', count: 3, color: 'gray' }
          ].map((section, idx) => (
            <Card key={idx} className="border-2">
              <CardHeader className={`bg-${section.color}-50`}>
                <CardTitle className="flex items-center justify-between">
                  <span>{section.title}</span>
                  <Badge className={`bg-${section.color}-600 text-white`}>{section.count}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-slate-300">Click to review and process</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Scheduler Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Default Frequency</Label>
                <select className="w-full px-3 py-2 border border-white/10 rounded-md">
                  <option>Monthly (30 days)</option>
                  <option>Quarterly (90 days)</option>
                  <option>Annually (365 days)</option>
                </select>
              </div>
              <div>
                <Label>High-Risk Subjects</Label>
                <select className="w-full px-3 py-2 border border-white/10 rounded-md">
                  <option>Weekly (7 days)</option>
                  <option>Daily</option>
                  <option>Real-time alerts</option>
                </select>
              </div>
              <div>
                <Label>Escalated Severe Cases</Label>
                <select className="w-full px-3 py-2 border border-white/10 rounded-md">
                  <option>Daily monitoring</option>
                  <option>Real-time alerts</option>
                  <option>Weekly</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <p className="font-semibold text-white">Automated Triggers</p>
              {[
                'Trigger rescan on entity ownership change',
                'Trigger rescan on country exposure change',
                'Trigger rescan on sanctions hit',
                'Trigger rescan on PEP confirmation',
                'Trigger rescan on new court event notification',
                'Trigger rescan on insolvency notice',
                'Generate delta summary for all changes',
                'Keep archived articles visible'
              ].map((trigger, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-red-400 rounded" />
                  <span className="text-sm text-slate-300">{trigger}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Screen 10: Bulk Portfolio Monitor
function BulkPortfolioMonitor({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Bulk Portfolio Monitor</h1>
              <p className="text-slate-300">Screen entire client base or upload subject list</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button className="bg-[#13B5EA] hover:bg-[#0E7C9E]">
                <Upload className="w-4 h-4 mr-2" />
                Upload List
              </Button>
              <Button variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                Screen All Active
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Summary
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Portfolio Screening Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col">
                <Upload className="w-6 h-6 mb-2" />
                <span>Upload CSV/Excel List</span>
              </Button>
              <Button className="h-20 flex-col" variant="outline">
                <Users className="w-6 h-6 mb-2" />
                <span>Screen All Active Clients</span>
              </Button>
              <Button className="h-20 flex-col" variant="outline">
                <AlertTriangle className="w-6 h-6 mb-2" />
                <span>Screen High-Risk Only</span>
              </Button>
              <Button className="h-20 flex-col" variant="outline">
                <RefreshCw className="w-6 h-6 mb-2" />
                <span>Rerun Failed Jobs</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 mt-6">
          <CardHeader>
            <CardTitle>Portfolio Summary</CardTitle>
            <CardDescription>Overview of all subjects in monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4 mb-6">
              <div className="p-4 bg-[#0f172a] rounded-lg text-center">
                <p className="text-xs text-slate-300 mb-1">Total Subjects</p>
                <p className="text-3xl font-bold text-white">1,847</p>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg text-center">
                <p className="text-xs text-slate-300 mb-1">Clear</p>
                <p className="text-3xl font-bold text-green-400">1,623</p>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg text-center">
                <p className="text-xs text-slate-300 mb-1">Low Relevance</p>
                <p className="text-3xl font-bold text-blue-400">187</p>
              </div>
              <div className="p-4 bg-amber-500/10 rounded-lg text-center">
                <p className="text-xs text-slate-300 mb-1">Under Review</p>
                <p className="text-3xl font-bold text-amber-400">31</p>
              </div>
              <div className="p-4 bg-red-500/10 rounded-lg text-center">
                <p className="text-xs text-slate-300 mb-1">Severe/Escalated</p>
                <p className="text-3xl font-bold text-red-400">6</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-300 text-center">
              Use bulk actions to assign reviewers, change monitoring frequency, or export cases
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

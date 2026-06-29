import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  RefreshCw,
  Clock,
  FileText,
  User,
  Users,
  Flag,
  Globe,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  TrendingUp,
  Activity,
  Database,
  ExternalLink,
  UserCheck,
  Ban,
  Gavel,
  Info
} from 'lucide-react';

interface AMLScreeningResult {
  id: string;
  clientId: string;
  clientName: string;
  screeningDate: Date;
  nextScreeningDue: Date;
  source: 'Equifax AML Screening';
  pulledBy: string;
  
  // Overall Status
  overallStatus: 'clear' | 'potential-match' | 'confirmed-match' | 'under-review';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // PEP (Politically Exposed Person) Screening
  pepStatus: 'clear' | 'match' | 'potential-match';
  pepMatches: PEPMatch[];
  
  // Sanctions Screening
  sanctionsStatus: 'clear' | 'match' | 'potential-match';
  sanctionsMatches: SanctionMatch[];
  
  // Watchlist Screening
  watchlistStatus: 'clear' | 'match' | 'potential-match';
  watchlistHits: WatchlistHit[];
  
  // Adverse Media
  adverseMediaStatus: 'clear' | 'flagged';
  adverseMediaCount: number;
  
  // Match Confidence
  highestMatchConfidence: number; // 0-100
  
  // Evidence
  evidencePdfUrl: string;
  rawResponse: any;
  reportHash: string;
}

interface PEPMatch {
  id: string;
  name: string;
  matchConfidence: number; // 0-100
  position: string;
  country: string;
  category: 'current-pep' | 'former-pep' | 'family-member' | 'close-associate';
  sources: string[];
  riskRating: 'low' | 'medium' | 'high';
  status: 'new' | 'false-positive' | 'confirmed' | 'under-review';
  assignedTo?: string;
  notes?: string;
}

interface SanctionMatch {
  id: string;
  name: string;
  matchConfidence: number;
  sanctioningBody: string;
  listName: string;
  country: string;
  dateAdded: Date;
  category: 'individual' | 'entity' | 'vessel';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'false-positive' | 'confirmed' | 'under-review';
  assignedTo?: string;
  notes?: string;
}

interface WatchlistHit {
  id: string;
  name: string;
  matchConfidence: number;
  listType: 'financial-crime' | 'terrorism' | 'narcotics' | 'human-trafficking' | 'corruption';
  source: string;
  country: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'false-positive' | 'confirmed' | 'under-review';
  assignedTo?: string;
  notes?: string;
}

interface ScreeningHistory {
  date: Date;
  type: 'initial' | 're-screen' | 'alert' | 'manual';
  result: string;
  user: string;
  changes: string[];
}

export function EquifaxAMLScreeningModule() {
  const [selectedClient, setSelectedClient] = useState<string | null>('CLI-001');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pep' | 'sanctions' | 'watchlist' | 'timeline' | 'raw'>('dashboard');
  const [showHistory, setShowHistory] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock Data
  const [screeningResult] = useState<AMLScreeningResult>({
    id: 'EQ-AML-2024-001',
    clientId: 'CLI-001',
    clientName: 'Sarah Mitchell',
    screeningDate: new Date('2024-03-20T10:30:00'),
    nextScreeningDue: new Date('2024-06-20T10:30:00'),
    source: 'Equifax AML Screening',
    pulledBy: 'compliance@growkyc.com',
    
    overallStatus: 'clear',
    riskLevel: 'low',
    
    pepStatus: 'clear',
    pepMatches: [],
    
    sanctionsStatus: 'clear',
    sanctionsMatches: [],
    
    watchlistStatus: 'clear',
    watchlistHits: [],
    
    adverseMediaStatus: 'clear',
    adverseMediaCount: 0,
    
    highestMatchConfidence: 0,
    
    evidencePdfUrl: '/evidence/eq-aml-2024-001.pdf',
    rawResponse: { status: 'clear', timestamp: '2024-03-20T10:30:00Z' },
    reportHash: 'sha256:9g4c3d2e0f5b...'
  });

  const screeningHistory: ScreeningHistory[] = [
    {
      date: new Date('2024-03-20T10:30:00'),
      type: 'initial',
      result: 'Clear - No Matches',
      user: 'compliance@growkyc.com',
      changes: ['Initial AML screening completed', 'No adverse findings']
    },
    {
      date: new Date('2024-02-20T14:15:00'),
      type: 're-screen',
      result: 'Clear - No Changes',
      user: 'system@growkyc.com',
      changes: ['Automated monthly re-screen']
    },
    {
      date: new Date('2024-01-20T09:00:00'),
      type: 'initial',
      result: 'Clear - No Matches',
      user: 'onboarding@growkyc.com',
      changes: ['Client onboarding AML check']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clear': return 'bg-green-500/15 text-green-300 dark:bg-green-900 dark:text-green-300';
      case 'potential-match': return 'bg-yellow-500/15 text-yellow-300 dark:bg-yellow-900 dark:text-yellow-300';
      case 'confirmed-match': return 'bg-red-500/15 text-red-300 dark:bg-red-900 dark:text-red-300';
      case 'under-review': return 'bg-blue-500/15 text-blue-300 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-[#0f172a] text-slate-300 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-slate-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <Ban className="w-5 h-5 text-red-400" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'medium': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'pep', label: 'PEP Screening', icon: Users },
    { id: 'sanctions', label: 'Sanctions', icon: Ban },
    { id: 'watchlist', label: 'Watchlists', icon: Flag },
    { id: 'timeline', label: 'Timeline', icon: Activity },
    { id: 'raw', label: 'Raw Data', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0E7C9E] to-[#13B5EA] text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-10 h-10" />
                <h1 className="text-4xl font-bold">AML/CTF Screening</h1>
              </div>
              <p className="text-xl text-cyan-100">Equifax Sanctions, PEP & Watchlist Monitoring</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-cyan-100">Last Screened</div>
              <div className="text-lg font-semibold">{screeningResult.screeningDate.toLocaleString()}</div>
              <div className="text-sm text-cyan-100 mt-1">Next Due: {screeningResult.nextScreeningDue.toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Summary Dashboard */}
        <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-[#13B5EA]">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-semibold text-slate-300 dark:text-slate-400">Client</span>
              </div>
              <div className="text-xl font-bold text-white dark:text-white">{screeningResult.clientName}</div>
              <div className="text-xs text-slate-400">{screeningResult.clientId}</div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-semibold text-slate-300 dark:text-slate-400">Overall Status</span>
              </div>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(screeningResult.overallStatus)}`}>
                {screeningResult.overallStatus === 'clear' && <CheckCircle className="w-4 h-4" />}
                {screeningResult.overallStatus === 'confirmed-match' && <XCircle className="w-4 h-4" />}
                {screeningResult.overallStatus.replace('-', ' ').toUpperCase()}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-semibold text-slate-300 dark:text-slate-400">Risk Level</span>
              </div>
              <div className={`text-2xl font-bold capitalize ${getRiskColor(screeningResult.riskLevel)}`}>
                {screeningResult.riskLevel}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-semibold text-slate-300 dark:text-slate-400">Match Confidence</span>
              </div>
              <div className="text-2xl font-bold text-white dark:text-white">
                {screeningResult.highestMatchConfidence}%
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-semibold text-slate-300 dark:text-slate-400">Next Review</span>
              </div>
              <div className="text-lg font-semibold text-white dark:text-white">
                {Math.ceil((screeningResult.nextScreeningDue.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-300 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Database className="w-4 h-4" />
                <span>Source: {screeningResult.source}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Pulled by: {screeningResult.pulledBy}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => window.open(screeningResult.evidencePdfUrl)}>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button size="sm" variant="outline" onClick={() => alert('Refresh requested')}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-Screen
              </Button>
            </div>
          </div>
        </div>

        {/* Screening Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-400" />
                <h3 className="font-bold text-white dark:text-white">PEP</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(screeningResult.pepStatus)}`}>
                {screeningResult.pepStatus.toUpperCase()}
              </span>
            </div>
            <div className="text-3xl font-bold text-white dark:text-white">
              {screeningResult.pepMatches.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Matches Found</div>
          </div>

          <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Ban className="w-6 h-6 text-red-400" />
                <h3 className="font-bold text-white dark:text-white">Sanctions</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(screeningResult.sanctionsStatus)}`}>
                {screeningResult.sanctionsStatus.toUpperCase()}
              </span>
            </div>
            <div className="text-3xl font-bold text-white dark:text-white">
              {screeningResult.sanctionsMatches.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Matches Found</div>
          </div>

          <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flag className="w-6 h-6 text-orange-400" />
                <h3 className="font-bold text-white dark:text-white">Watchlists</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(screeningResult.watchlistStatus)}`}>
                {screeningResult.watchlistStatus.toUpperCase()}
              </span>
            </div>
            <div className="text-3xl font-bold text-white dark:text-white">
              {screeningResult.watchlistHits.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Hits Found</div>
          </div>

          <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-yellow-400" />
                <h3 className="font-bold text-white dark:text-white">Adverse Media</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(screeningResult.adverseMediaStatus)}`}>
                {screeningResult.adverseMediaStatus.toUpperCase()}
              </span>
            </div>
            <div className="text-3xl font-bold text-white dark:text-white">
              {screeningResult.adverseMediaCount}
            </div>
            <div className="text-xs text-slate-400 mt-1">Articles Found</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-white/10 dark:border-gray-700 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#13B5EA] text-white'
                    : 'text-slate-300 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="p-6 bg-green-500/10 dark:bg-green-900/20 rounded-lg border border-green-500/30 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    <h3 className="text-xl font-bold text-green-300 dark:text-green-100">All Clear</h3>
                  </div>
                  <p className="text-green-300 dark:text-green-200">
                    No adverse findings across PEP, Sanctions, or Watchlist screenings. Client is clear for onboarding.
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-green-300 dark:text-green-300">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">PEP Clear</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-300 dark:text-green-300">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Sanctions Clear</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-300 dark:text-green-300">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Watchlist Clear</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f172a] dark:bg-gray-900 rounded-lg p-6">
                  <h3 className="font-bold text-white dark:text-white mb-4">Screening Coverage</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300 dark:text-slate-400">International Sanctions Lists</span>
                        <span className="text-sm font-semibold text-green-400">✓ Screened</span>
                      </div>
                      <div className="text-xs text-slate-400">OFAC, UN, EU, DFAT, HMT</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300 dark:text-slate-400">PEP Databases</span>
                        <span className="text-sm font-semibold text-green-400">✓ Screened</span>
                      </div>
                      <div className="text-xs text-slate-400">Global PEP registry, Domestic & International</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300 dark:text-slate-400">Law Enforcement Watchlists</span>
                        <span className="text-sm font-semibold text-green-400">✓ Screened</span>
                      </div>
                      <div className="text-xs text-slate-400">INTERPOL, EUROPOL, National Databases</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300 dark:text-slate-400">Adverse Media</span>
                        <span className="text-sm font-semibold text-green-400">✓ Screened</span>
                      </div>
                      <div className="text-xs text-slate-400">Global news sources, financial crime databases</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PEP Tab */}
            {activeTab === 'pep' && (
              <div className="space-y-4">
                {screeningResult.pepMatches.length === 0 ? (
                  <div className="p-6 bg-green-500/10 dark:bg-green-900/20 rounded-lg border border-green-500/30 dark:border-green-800 text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-green-300 dark:text-green-100 mb-2">No PEP Matches Found</h3>
                    <p className="text-green-300 dark:text-green-200">
                      Client has been screened against all PEP databases with no matches detected.
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* PEP matches would be listed here */}
                  </div>
                )}
              </div>
            )}

            {/* Sanctions Tab */}
            {activeTab === 'sanctions' && (
              <div className="space-y-4">
                {screeningResult.sanctionsMatches.length === 0 ? (
                  <div className="p-6 bg-green-500/10 dark:bg-green-900/20 rounded-lg border border-green-500/30 dark:border-green-800 text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-green-300 dark:text-green-100 mb-2">No Sanctions Matches Found</h3>
                    <p className="text-green-300 dark:text-green-200">
                      Client has been screened against all international sanctions lists with no matches detected.
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Sanctions matches would be listed here */}
                  </div>
                )}
              </div>
            )}

            {/* Watchlist Tab */}
            {activeTab === 'watchlist' && (
              <div className="space-y-4">
                {screeningResult.watchlistHits.length === 0 ? (
                  <div className="p-6 bg-green-500/10 dark:bg-green-900/20 rounded-lg border border-green-500/30 dark:border-green-800 text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-green-300 dark:text-green-100 mb-2">No Watchlist Hits Found</h3>
                    <p className="text-green-300 dark:text-green-200">
                      Client has been screened against all law enforcement and financial crime watchlists with no hits detected.
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Watchlist hits would be listed here */}
                  </div>
                )}
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                {screeningHistory.map((record, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-[#0f172a] dark:bg-gray-900 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#13B5EA] flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white dark:text-white capitalize">{record.type} Screening</span>
                        <span className="text-xs text-slate-400">{record.date.toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-slate-300 dark:text-slate-400 mb-2">
                        Result: {record.result}
                      </div>
                      <div className="text-xs text-slate-400 mb-2">
                        By: {record.user}
                      </div>
                      {record.changes.length > 0 && (
                        <div className="mt-2 text-xs text-slate-400">
                          {record.changes.map((change, i) => (
                            <div key={i}>• {change}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Raw Data Tab */}
            {activeTab === 'raw' && (
              <div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-xs">
                  {JSON.stringify(screeningResult.rawResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-white dark:text-white mb-4">Actions</h3>
          <div className="flex gap-3">
            <Button onClick={() => alert('Re-screening...')}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-Screen Now
            </Button>
            <Button variant="outline" onClick={() => alert('Escalating...')}>
              <AlertCircle className="w-4 h-4 mr-2" />
              Escalate to Compliance
            </Button>
            <Button variant="outline" onClick={() => alert('Add note dialog...')}>
              <FileText className="w-4 h-4 mr-2" />
              Add Note
            </Button>
            <Button variant="outline" onClick={() => window.open(screeningResult.evidencePdfUrl)}>
              <Download className="w-4 h-4 mr-2" />
              Download Evidence
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  Globe,
  FileText,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Download,
  RefreshCw,
  Eye,
  Filter,
  Calendar
} from 'lucide-react';

type ScreeningStatus = 'clear' | 'match' | 'potential-match' | 'pending' | 'error';
type ScreeningType = 'sanctions' | 'pep' | 'adverse-media' | 'watchlist';

interface ScreeningResult {
  id: string;
  clientName: string;
  clientId: string;
  screeningType: ScreeningType;
  status: ScreeningStatus;
  matchScore: number;
  details: string;
  date: Date;
  reviewer?: string;
  resolution?: string;
}

export function ScreeningVerification() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sanctions' | 'pep' | 'adverse-media' | 'batch' | 'history'>('overview');
  const [screeningResults] = useState<ScreeningResult[]>([
    {
      id: 'SCR-2024-001',
      clientName: 'John Smith',
      clientId: 'C-2024-001',
      screeningType: 'pep',
      status: 'match',
      matchScore: 95,
      details: 'Former Australian State Government Official - Minister for Finance (2015-2019)',
      date: new Date('2024-02-19'),
      reviewer: 'Emma Wilson'
    },
    {
      id: 'SCR-2024-002',
      clientName: 'Global Traders Pty Ltd',
      clientId: 'C-2024-002',
      screeningType: 'sanctions',
      status: 'potential-match',
      matchScore: 72,
      details: 'Similar name to entity on DFAT sanctions list - requires manual review',
      date: new Date('2024-02-19')
    },
    {
      id: 'SCR-2024-003',
      clientName: 'Melbourne Trust Co',
      clientId: 'C-2024-003',
      screeningType: 'adverse-media',
      status: 'match',
      matchScore: 88,
      details: 'Negative media coverage - litigation involving financial dispute',
      date: new Date('2024-02-18'),
      reviewer: 'Michael Chen',
      resolution: 'Reviewed - dispute resolved, no ongoing concern'
    },
    {
      id: 'SCR-2024-004',
      clientName: 'Sarah Williams',
      clientId: 'C-2024-004',
      screeningType: 'sanctions',
      status: 'clear',
      matchScore: 0,
      details: 'No matches found on any sanctions lists',
      date: new Date('2024-02-18')
    },
    {
      id: 'SCR-2024-005',
      clientName: 'Tech Innovations Ltd',
      clientId: 'C-2024-005',
      screeningType: 'watchlist',
      status: 'pending',
      matchScore: 0,
      details: 'Screening in progress...',
      date: new Date('2024-02-19')
    }
  ]);

  const getStatusColor = (status: ScreeningStatus) => {
    switch (status) {
      case 'clear': return 'green';
      case 'match': return 'red';
      case 'potential-match': return 'orange';
      case 'pending': return 'blue';
      case 'error': return 'gray';
    }
  };

  const screeningTypeLabels: Record<ScreeningType, string> = {
    'sanctions': 'Sanctions List',
    'pep': 'Politically Exposed Person',
    'adverse-media': 'Adverse Media',
    'watchlist': 'Watchlist'
  };

  const stats = {
    totalScreened: 247,
    matches: 12,
    potentialMatches: 8,
    cleared: 227,
    pendingReview: 5,
    avgResolutionTime: 2.5
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Screening & Verification</h1>
              <p className="text-xl text-red-100">Sanctions, PEP & Adverse Media Screening</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-red-600 hover:bg-red-50">
              <Search className="w-5 h-5 mr-2" />
              New Screening
            </Button>
            <Button className="bg-white text-red-600 hover:bg-red-50">
              <RefreshCw className="w-5 h-5 mr-2" />
              Batch Re-screen
            </Button>
            <Button className="bg-white text-red-600 hover:bg-red-50">
              <Download className="w-5 h-5 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-6 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Total Screened</h3>
              <Search className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.totalScreened}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Matches</h3>
              <XCircle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-red-300">{stats.matches}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Potential</h3>
              <AlertTriangle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-orange-300">{stats.potentialMatches}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Cleared</h3>
              <CheckCircle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-green-300">{stats.cleared}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Review</h3>
              <Clock className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-yellow-300">{stats.pendingReview}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Avg Days</h3>
              <TrendingUp className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.avgResolutionTime}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'sanctions', label: 'Sanctions Screening', icon: Shield },
            { id: 'pep', label: 'PEP Screening', icon: User },
            { id: 'adverse-media', label: 'Adverse Media', icon: Globe },
            { id: 'batch', label: 'Batch Screening', icon: Zap },
            { id: 'history', label: 'Screening History', icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-red-600 text-red-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Screening Lists Info */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border-2 border-red-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Sanctions Lists</h3>
              <p className="text-sm text-gray-600">DFAT, UN, OFAC, EU</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Real-time screening against Australian DFAT, UN Security Council, US OFAC, and EU sanctions lists.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Updated: Daily</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">ACTIVE</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-purple-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">PEP Database</h3>
              <p className="text-sm text-gray-600">Domestic & Foreign</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Politically Exposed Persons screening including government officials, diplomats, and close associates.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Updated: Weekly</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">ACTIVE</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Adverse Media</h3>
              <p className="text-sm text-gray-600">Global News Sources</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Automated screening of 50,000+ global news sources for financial crime, fraud, corruption, and regulatory issues.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Updated: Real-time</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">ACTIVE</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-orange-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Watchlists</h3>
              <p className="text-sm text-gray-600">Custom & Industry</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Custom internal watchlists plus industry enforcement lists from ASIC, APRA, and international regulators.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Updated: On-demand</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Screening Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Recent Screening Results</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </div>

        {screeningResults.map((result) => (
          <div key={result.id} className={`bg-white rounded-lg border-2 p-6 ${
            result.status === 'match' ? 'border-red-300 bg-red-50' :
            result.status === 'potential-match' ? 'border-orange-300 bg-orange-50' :
            result.status === 'clear' ? 'border-green-200' :
            'border-gray-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-xl font-bold text-gray-900">{result.clientName}</h4>
                  <span className={`px-3 py-1 bg-${getStatusColor(result.status)}-100 text-${getStatusColor(result.status)}-700 text-sm font-bold rounded-full`}>
                    {result.status.toUpperCase().replace('-', ' ')}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                    {screeningTypeLabels[result.screeningType]}
                  </span>
                  {result.matchScore > 0 && (
                    <span className={`px-3 py-1 ${
                      result.matchScore >= 90 ? 'bg-red-500' :
                      result.matchScore >= 70 ? 'bg-orange-500' :
                      'bg-yellow-500'
                    } text-white text-sm font-bold rounded-full`}>
                      {result.matchScore}% Match
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>ID: {result.id}</span>
                  <span>•</span>
                  <span>Client: {result.clientId}</span>
                  <span>•</span>
                  <span>{result.date.toLocaleDateString()}</span>
                  {result.reviewer && (
                    <>
                      <span>•</span>
                      <span>Reviewed by {result.reviewer}</span>
                    </>
                  )}
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Screening Details:</p>
                  <p className="text-sm text-gray-700">{result.details}</p>
                </div>

                {result.resolution && (
                  <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-900 mb-1">Resolution:</p>
                    <p className="text-sm text-green-800">{result.resolution}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-6">
                <Button className="bg-red-600 hover:bg-red-700">
                  <Eye className="w-4 h-4 mr-2" />
                  Review
                </Button>
                {result.status === 'match' || result.status === 'potential-match' ? (
                  <>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Document
                    </Button>
                  </>
                ) : null}
                <Button variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Screening Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Screening Configuration</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Automated Screening</h4>
            <div className="space-y-3">
              {[
                { label: 'New client onboarding', enabled: true },
                { label: 'Annual re-screening', enabled: true },
                { label: 'Triggered re-screening (name/ownership change)', enabled: true },
                { label: 'Ongoing monitoring (daily)', enabled: true }
              ].map((config, index) => (
                <label key={index} className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={config.enabled} 
                    className="w-5 h-5 text-red-600"
                    readOnly
                  />
                  <span className="text-sm text-gray-700">{config.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Match Threshold Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-700 block mb-1">Exact Match</label>
                <input type="range" min="80" max="100" value="95" className="w-full" readOnly />
                <span className="text-xs text-gray-600">95% - Automatic flag</span>
              </div>
              <div>
                <label className="text-sm text-gray-700 block mb-1">Potential Match</label>
                <input type="range" min="50" max="79" value="70" className="w-full" readOnly />
                <span className="text-xs text-gray-600">70% - Manual review</span>
              </div>
              <div>
                <label className="text-sm text-gray-700 block mb-1">Low Confidence</label>
                <input type="range" min="0" max="49" value="50" className="w-full" readOnly />
                <span className="text-xs text-gray-600">&lt;50% - Cleared with note</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

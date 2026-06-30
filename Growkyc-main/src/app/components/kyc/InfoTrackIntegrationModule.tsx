import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Building,
  FileText,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Briefcase,
  Scale,
  DollarSign,
  Activity,
  Target,
  Shield,
  TrendingUp
} from 'lucide-react';

interface SearchRecord {
  id: string;
  searchType: 'asic' | 'ppsr' | 'litigation' | 'credit' | 'bankruptcy';
  entityName: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  results: string;
  cost: number;
  findings?: string[];
}

export function InfoTrackIntegrationModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'asic' | 'ppsr' | 'litigation'>('recent');

  const [searches] = useState<SearchRecord[]>([
    {
      id: 'IT-2024-001',
      searchType: 'asic',
      entityName: 'TechCorp Pty Ltd',
      status: 'completed',
      timestamp: '2024-02-19 14:30',
      results: 'Company Active - ACN 123 456 789',
      cost: 45.00,
      findings: [
        'Company Status: Active',
        'ABN: 12 345 678 901',
        'ACN: 123 456 789',
        'Directors: 2 Current Directors Listed',
        'Registered Office: Melbourne VIC 3000',
        'No Current Enforcement Actions'
      ]
    },
    {
      id: 'IT-2024-002',
      searchType: 'ppsr',
      entityName: 'ABC Manufacturing Ltd',
      status: 'completed',
      timestamp: '2024-02-19 13:15',
      results: '2 Security Interests Found',
      cost: 35.00,
      findings: [
        'Security Interest 1: Motor Vehicle Registration 202301234',
        'Security Interest 2: Commercial Equipment Lease',
        'Secured Party: National Bank Australia',
        'Registration Date: 2023-06-15',
        'Status: Current'
      ]
    },
    {
      id: 'IT-2024-003',
      searchType: 'litigation',
      entityName: 'Global Trading Pty Ltd',
      status: 'completed',
      timestamp: '2024-02-19 11:45',
      results: '1 Court Matter Found',
      cost: 65.00,
      findings: [
        'Case: Federal Court VID 1234/2023',
        'Type: Commercial Dispute',
        'Status: Active',
        'Filed: 2023-08-20',
        'Nature: Contract Dispute',
        'Amount: $250,000'
      ]
    },
    {
      id: 'IT-2024-004',
      searchType: 'bankruptcy',
      entityName: 'John Smith',
      status: 'completed',
      timestamp: '2024-02-18 16:20',
      results: 'No Bankruptcy Records Found',
      cost: 25.00,
      findings: ['No bankruptcy records', 'No Part X agreements', 'No debt agreements']
    },
    {
      id: 'IT-2024-005',
      searchType: 'asic',
      entityName: 'Melbourne Property Trust',
      status: 'completed',
      timestamp: '2024-02-18 15:10',
      results: 'Company Active - Historical Records Available',
      cost: 55.00,
      findings: [
        'Company Status: Active',
        'ABN: 98 765 432 109',
        'Previous Names: 1',
        'Directors: 3 Current, 2 Former',
        'Officeholders: All Current',
        'Annual Review: Up to Date'
      ]
    },
    {
      id: 'IT-2024-006',
      searchType: 'ppsr',
      entityName: 'Sarah Williams',
      status: 'completed',
      timestamp: '2024-02-18 14:05',
      results: 'No Security Interests Found',
      cost: 35.00,
      findings: ['No current security interests', 'No historical registrations']
    }
  ]);

  const stats = {
    totalSearches: 342,
    thisMonth: 48,
    asicSearches: 156,
    ppsrSearches: 98,
    litigationSearches: 64,
    totalCost: 12450,
    avgCost: 36.40
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'blue';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getSearchTypeIcon = (type: string) => {
    switch (type) {
      case 'asic': return <Building className="w-6 h-6 text-blue-600" />;
      case 'ppsr': return <Shield className="w-6 h-6 text-purple-600" />;
      case 'litigation': return <Scale className="w-6 h-6 text-orange-600" />;
      case 'bankruptcy': return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'credit': return <DollarSign className="w-6 h-6 text-green-600" />;
    }
  };

  const filteredSearches = activeTab === 'recent' 
    ? searches 
    : searches.filter(s => s.searchType === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Building className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">InfoTrack Integration</h1>
              <p className="text-xl text-blue-100">ASIC, PPSR & Litigation Searches</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              <Search className="w-5 h-5 mr-2" />
              New Search
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              <Download className="w-5 h-5 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-6 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Total Searches</h3>
              <Activity className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.totalSearches}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">This Month</h3>
              <TrendingUp className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-green-300">{stats.thisMonth}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">ASIC</h3>
              <Building className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.asicSearches}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">PPSR</h3>
              <Shield className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.ppsrSearches}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Litigation</h3>
              <Scale className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.litigationSearches}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Total Cost</h3>
              <DollarSign className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-2xl font-bold">${(stats.totalCost / 1000).toFixed(1)}k</p>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">InfoTrack Integration Active</h3>
            <p className="text-sm text-blue-800 mb-3">
              Connected to InfoTrack API for instant company, security interest, and litigation searches.
            </p>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 bg-white border border-blue-200 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold mb-1">API Status</p>
                <p className="font-bold text-blue-900">✓ Connected</p>
              </div>
              <div className="p-3 bg-white border border-blue-200 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold mb-1">Avg Response</p>
                <p className="font-bold text-blue-900">2.3 seconds</p>
              </div>
              <div className="p-3 bg-white border border-blue-200 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold mb-1">Success Rate</p>
                <p className="font-bold text-blue-900">99.2%</p>
              </div>
              <div className="p-3 bg-white border border-blue-200 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold mb-1">Last Sync</p>
                <p className="font-bold text-blue-900">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Types */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Available Search Types</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { 
              type: 'ASIC Company Search', 
              icon: Building, 
              desc: 'Company extracts, director searches, shareholder info',
              cost: '$35 - $85',
              color: 'blue'
            },
            { 
              type: 'PPSR Search', 
              icon: Shield, 
              desc: 'Security interests, equipment financing, encumbrances',
              cost: '$25 - $45',
              color: 'purple'
            },
            { 
              type: 'Litigation Search', 
              icon: Scale, 
              desc: 'Court records, judgments, ongoing legal matters',
              cost: '$55 - $95',
              color: 'orange'
            },
            { 
              type: 'Bankruptcy Search', 
              icon: AlertTriangle, 
              desc: 'Personal insolvency, bankruptcy records, Part X',
              cost: '$25 - $35',
              color: 'red'
            },
            { 
              type: 'Credit Report', 
              icon: DollarSign, 
              desc: 'Commercial credit history, payment defaults',
              cost: '$45 - $75',
              color: 'green'
            },
            { 
              type: 'Title Search', 
              icon: FileText, 
              desc: 'Property title, ownership, encumbrances',
              cost: '$35 - $65',
              color: 'indigo'
            }
          ].map((searchType, index) => {
            const Icon = searchType.icon;
            return (
              <div key={index} className={`p-4 border-2 border-${searchType.color}-200 bg-${searchType.color}-50 rounded-lg hover:shadow-lg transition-all`}>
                <Icon className={`w-8 h-8 text-${searchType.color}-600 mb-3`} />
                <h4 className="font-bold text-gray-900 mb-2">{searchType.type}</h4>
                <p className="text-sm text-gray-700 mb-2">{searchType.desc}</p>
                <p className="text-xs text-gray-600 font-semibold">{searchType.cost}</p>
                <Button size="sm" className={`w-full mt-3 bg-${searchType.color}-600 hover:bg-${searchType.color}-700`}>
                  <Search className="w-4 h-4 mr-2" />
                  Search Now
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          {[
            { id: 'recent', label: 'Recent Searches', icon: Clock },
            { id: 'asic', label: 'ASIC', icon: Building },
            { id: 'ppsr', label: 'PPSR', icon: Shield },
            { id: 'litigation', label: 'Litigation', icon: Scale }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
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

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by entity name or search ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-3">
        {filteredSearches.map((search) => {
          const statusColor = getStatusColor(search.status);
          return (
            <div key={search.id} className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getSearchTypeIcon(search.searchType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-gray-800 text-white text-xs font-mono font-bold rounded">
                        {search.id}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase">
                        {search.searchType}
                      </span>
                      <span className="text-sm text-gray-600">{search.timestamp}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{search.entityName}</h4>
                    <p className="text-gray-700">{search.results}</p>
                  </div>
                </div>

                <div className="ml-6 flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(search.status)}
                    <span className={`px-3 py-1 bg-${statusColor}-100 text-${statusColor}-700 text-xs font-bold rounded-full uppercase`}>
                      {search.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Cost</p>
                    <p className="text-xl font-bold text-gray-900">${search.cost.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {search.findings && search.findings.length > 0 && (
                <div className="p-4 bg-white border border-gray-200 rounded-lg mt-4">
                  <p className="font-bold text-blue-900 mb-2">Key Findings:</p>
                  <ul className="space-y-1">
                    {search.findings.map((finding, index) => (
                      <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Full Report
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button size="sm" variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  Add to Client File
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">InfoTrack Benefits</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { title: 'Instant Results', desc: 'Receive searches in seconds, not days' },
            { title: 'Official Sources', desc: 'Direct access to ASIC, PPSR, court records' },
            { title: 'Cost Effective', desc: 'Competitive pricing with volume discounts' },
            { title: 'Enhanced CDD', desc: 'Support enhanced due diligence requirements' },
            { title: 'Audit Trail', desc: 'Complete documentation for compliance' },
            { title: 'API Integration', desc: 'Seamless integration with workflow' }
          ].map((benefit, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-1">{benefit.title}</h4>
              <p className="text-sm text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

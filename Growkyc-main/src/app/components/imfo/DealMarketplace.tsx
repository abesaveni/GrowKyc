import React, { useState } from 'react';
import { DealAllocationPanel } from './DealAllocationPanel';
import { Button } from '../ui/button';
import {
  Briefcase,
  Building2,
  DollarSign,
  TrendingUp,
  Calendar,
  Target,
  Shield,
  Lock,
  Unlock,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  FileText,
  BarChart3,
  Award,
  MapPin,
  Percent,
  ArrowRight,
  Info,
  Star,
  Flag,
  ThumbsUp,
  MessageSquare,
  X,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Package
} from 'lucide-react';

interface DealMarketplaceProps {
  onNavigate: (page: string) => void;
  role: string;
  investorProfile?: any;
}

type DealStatus = 'draft' | 'open' | 'closing-soon' | 'closed' | 'funded' | 'archived';
type DealStructure = 'pooled' | 'participation' | 'hybrid' | 'direct';
type ViewMode = 'list' | 'detail';

export function DealMarketplace({ onNavigate, role, investorProfile }: DealMarketplaceProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [filters, setFilters] = useState({
    strategy: 'all',
    status: 'all',
    structure: 'all',
    minInvestment: 'all',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mock current investor profile (from investor registry)
  const mockInvestorProfile = investorProfile || {
    id: 'INV-001',
    name: 'Meridian Capital Pty Ltd',
    tier: 'tier-a',
    strategyFlags: ['Mortgage', 'SME', 'High Yield', 'Structured'],
    concentrationLimits: { perSPV: 15, perSector: 25, total: 50 },
    availableCapital: 3000000
  };

  // Mock deal data
  const mockDeals = [
    {
      id: 'DEAL-2024-001',
      spvId: 'SPV-2024-028',
      name: 'Sydney CBD Commercial Property Pool',
      strategy: 'Mortgage',
      sector: 'Commercial Real Estate',
      structure: 'pooled',
      status: 'open',
      visibility: ['tier-a', 'tier-b', 'tier-c'],
      targetRaise: 25000000,
      raisedToDate: 18500000,
      minInvestment: 500000,
      maxInvestment: 5000000,
      expectedReturn: 11.5,
      term: 36,
      lvr: 65,
      location: 'Sydney, NSW',
      closeDate: '2024-03-15',
      fundingDate: '2024-03-25',
      features: ['First Ranking Security', 'Independent Valuation', 'Pre-leased 85%'],
      riskGrade: 'B+',
      allocation: 'First-come allocation',
      documents: ['IM', 'Valuation Report', 'Loan Agreement', 'Security Documents'],
      eoisReceived: 12,
      hasAccess: true,
      teaserOnly: false,
      description: 'Secured first mortgage over a prime CBD commercial office building with strong tenant covenants and defensive LVR.',
      keyTerms: {
        security: 'First ranking registered mortgage',
        borrower: 'Established property developer',
        purpose: 'Acquisition and minor refurbishment',
        exitStrategy: 'Sale or refinance',
        coupon: '10.5% p.a. paid quarterly'
      }
    },
    {
      id: 'DEAL-2024-002',
      spvId: 'SPV-2024-029',
      name: 'Tech SME Growth Capital Fund',
      strategy: 'SME',
      sector: 'Technology',
      structure: 'pooled',
      status: 'closing-soon',
      visibility: ['tier-a', 'tier-b'],
      targetRaise: 15000000,
      raisedToDate: 14200000,
      minInvestment: 250000,
      maxInvestment: 2000000,
      expectedReturn: 14.0,
      term: 24,
      lvr: null,
      location: 'Melbourne, VIC',
      closeDate: '2024-02-28',
      fundingDate: '2024-03-05',
      features: ['Revenue-based lending', 'Personal guarantees', 'Monthly interest'],
      riskGrade: 'BB+',
      allocation: 'Pro-rata with Tier A priority',
      documents: ['IM', 'Financial Projections', 'Loan Agreement'],
      eoisReceived: 8,
      hasAccess: true,
      teaserOnly: false,
      description: 'Growth capital for established tech SMEs with proven revenue models and strong management teams.',
      keyTerms: {
        security: 'General Security Agreement + Personal Guarantees',
        borrower: 'Portfolio of 5 SaaS companies',
        purpose: 'Working capital and growth initiatives',
        exitStrategy: 'Cash flow from operations',
        coupon: '13.0% p.a. paid monthly'
      }
    },
    {
      id: 'DEAL-2024-003',
      spvId: 'SPV-2024-030',
      name: 'Brisbane Residential Development',
      strategy: 'Mortgage',
      sector: 'Residential Development',
      structure: 'participation',
      status: 'open',
      visibility: ['tier-a'],
      targetRaise: 40000000,
      raisedToDate: 12000000,
      minInvestment: 2000000,
      maxInvestment: 10000000,
      expectedReturn: 15.5,
      term: 18,
      lvr: 70,
      location: 'Brisbane, QLD',
      closeDate: '2024-04-30',
      fundingDate: '2024-05-15',
      features: ['Profit share', 'Development exit', 'Staged drawdown'],
      riskGrade: 'BB',
      allocation: 'Institutional investors only',
      documents: ['IM', 'Development Approval', 'Feasibility Study', 'QS Report'],
      eoisReceived: 4,
      hasAccess: true,
      teaserOnly: false,
      description: 'Senior debt facility for a 120-unit residential development in inner Brisbane with pre-sales and DA approval.',
      keyTerms: {
        security: 'First ranking mortgage + profit participation',
        borrower: 'Tier 1 property developer',
        purpose: 'Construction finance',
        exitStrategy: 'Settlement of pre-sales',
        coupon: '12.0% p.a. + 20% profit share'
      }
    },
    {
      id: 'DEAL-2024-004',
      spvId: 'SPV-2024-031',
      name: 'Healthcare Equipment Finance Pool',
      strategy: 'Asset Finance',
      sector: 'Healthcare',
      structure: 'pooled',
      status: 'open',
      visibility: ['tier-a', 'tier-b', 'tier-c'],
      targetRaise: 8000000,
      raisedToDate: 5500000,
      minInvestment: 100000,
      maxInvestment: 1000000,
      expectedReturn: 10.5,
      term: 48,
      lvr: 60,
      location: 'National',
      closeDate: '2024-03-31',
      fundingDate: '2024-04-10',
      features: ['Asset security', 'Diversified portfolio', 'Monthly income'],
      riskGrade: 'A-',
      allocation: 'First-come allocation',
      documents: ['IM', 'Portfolio Summary'],
      eoisReceived: 15,
      hasAccess: true,
      teaserOnly: false,
      description: 'Portfolio of equipment finance leases to established healthcare providers across Australia.',
      keyTerms: {
        security: 'PPSR registered security over equipment',
        borrower: 'Portfolio of medical practices',
        purpose: 'Medical equipment acquisition',
        exitStrategy: 'Lease payments over term',
        coupon: '9.5% p.a. paid monthly'
      }
    },
    {
      id: 'DEAL-2024-005',
      spvId: 'SPV-2024-032',
      name: 'High Yield Corporate Bond',
      strategy: 'High Yield',
      sector: 'Corporate',
      structure: 'direct',
      status: 'closed',
      visibility: ['tier-a'],
      targetRaise: 50000000,
      raisedToDate: 50000000,
      minInvestment: 5000000,
      maxInvestment: 15000000,
      expectedReturn: 16.0,
      term: 36,
      lvr: null,
      location: 'Sydney, NSW',
      closeDate: '2024-02-15',
      fundingDate: '2024-02-28',
      features: ['Unsecured', 'Listed entity', 'Quarterly interest'],
      riskGrade: 'BB-',
      allocation: 'Closed - Fully subscribed',
      documents: ['IM', 'Financial Statements', 'Bond Terms'],
      eoisReceived: 6,
      hasAccess: false,
      teaserOnly: true,
      description: 'Unsecured corporate bond from an ASX-listed industrial company seeking expansion capital.',
      keyTerms: {
        security: 'Unsecured',
        borrower: 'ASX-listed industrial group',
        purpose: 'Business expansion',
        exitStrategy: 'Refinance or asset sale',
        coupon: '15.0% p.a. paid quarterly'
      }
    },
    {
      id: 'DEAL-2024-006',
      spvId: 'SPV-2024-033',
      name: 'Agricultural Land Portfolio',
      strategy: 'Mortgage',
      sector: 'Agriculture',
      structure: 'hybrid',
      status: 'draft',
      visibility: ['tier-a', 'tier-b'],
      targetRaise: 35000000,
      raisedToDate: 0,
      minInvestment: 1000000,
      maxInvestment: 8000000,
      expectedReturn: 12.5,
      term: 60,
      lvr: 55,
      location: 'Regional NSW',
      closeDate: '2024-05-31',
      fundingDate: '2024-06-15',
      features: ['Agricultural land', 'Long term', 'Inflation hedge'],
      riskGrade: 'BBB',
      allocation: 'Coming soon',
      documents: ['Teaser'],
      eoisReceived: 0,
      hasAccess: false,
      teaserOnly: true,
      description: 'First mortgage facility secured by prime agricultural land with water rights and established cropping operations.',
      keyTerms: {
        security: 'First ranking mortgage over agricultural land',
        borrower: 'Institutional agricultural fund',
        purpose: 'Land acquisition',
        exitStrategy: 'Sale or long-term hold',
        coupon: '11.5% p.a. paid quarterly'
      }
    }
  ];

  // Filter deals based on investor's strategy flags and tier
  const filteredDeals = mockDeals.filter(deal => {
    // Strategy filter
    if (filters.strategy !== 'all' && deal.strategy !== filters.strategy) return false;
    
    // Status filter
    if (filters.status !== 'all' && deal.status !== filters.status) return false;
    
    // Structure filter
    if (filters.structure !== 'all' && deal.structure !== filters.structure) return false;
    
    // Min investment filter
    if (filters.minInvestment === 'under-500k' && deal.minInvestment >= 500000) return false;
    if (filters.minInvestment === '500k-1m' && (deal.minInvestment < 500000 || deal.minInvestment >= 1000000)) return false;
    if (filters.minInvestment === 'over-1m' && deal.minInvestment < 1000000) return false;
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        deal.name.toLowerCase().includes(searchLower) ||
        deal.id.toLowerCase().includes(searchLower) ||
        deal.sector.toLowerCase().includes(searchLower)
      );
    }
    
    // Tier visibility check
    if (!deal.visibility.includes(mockInvestorProfile.tier)) return false;
    
    // Strategy flag check (only show deals matching investor's strategy access)
    if (!mockInvestorProfile.strategyFlags.includes(deal.strategy)) return false;
    
    return true;
  });

  const getStatusBadge = (status: DealStatus) => {
    const config = {
      draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800', icon: Clock },
      open: { label: 'Open for Investment', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      'closing-soon': { label: 'Closing Soon', className: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
      closed: { label: 'Closed', className: 'bg-red-100 text-red-800', icon: Lock },
      funded: { label: 'Funded', className: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      archived: { label: 'Archived', className: 'bg-gray-100 text-gray-600', icon: X }
    };

    const statusConfig = config[status];
    const Icon = statusConfig.icon;

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
        <Icon className="w-3.5 h-3.5" />
        {statusConfig.label}
      </div>
    );
  };

  const getStructureBadge = (structure: DealStructure) => {
    const config = {
      pooled: { label: 'Pooled', className: 'bg-blue-100 text-blue-800' },
      participation: { label: 'Participation', className: 'bg-purple-100 text-purple-800' },
      hybrid: { label: 'Hybrid', className: 'bg-indigo-100 text-indigo-800' },
      direct: { label: 'Direct', className: 'bg-green-100 text-green-800' }
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config[structure].className}`}>
        {config[structure].label}
      </span>
    );
  };

  const getRiskGradeBadge = (grade: string) => {
    const gradeUpper = grade.charAt(0);
    const colorMap: { [key: string]: string } = {
      A: 'bg-green-100 text-green-800 border-green-200',
      B: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      C: 'bg-orange-100 text-orange-800 border-orange-200',
      D: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-semibold ${colorMap[gradeUpper] || colorMap.B}`}>
        <Shield className="w-3 h-3" />
        {grade}
      </div>
    );
  };

  if (viewMode === 'detail' && selectedDeal) {
    return (
      <DealDetailView
        deal={selectedDeal}
        investorProfile={mockInvestorProfile}
        onBack={() => {
          setSelectedDeal(null);
          setViewMode('list');
        }}
        role={role}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deal Marketplace</h1>
          <p className="text-gray-600 mt-1">
            Tier-filtered investment opportunities • Showing {filteredDeals.length} deals for {mockInvestorProfile.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Deals
          </Button>
        </div>
      </div>

      {/* Investor Profile Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-indigo-600 font-medium">Your Investor Profile</p>
              <p className="text-lg font-bold text-indigo-900">
                Tier {mockInvestorProfile.tier.split('-')[1].toUpperCase()} • Available Capital: ${(mockInvestorProfile.availableCapital / 1000000).toFixed(1)}M
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-indigo-700">Access to strategies:</p>
                {mockInvestorProfile.strategyFlags.map((flag: string) => (
                  <span key={flag} className="px-2 py-0.5 bg-indigo-600 text-white rounded text-xs font-medium">
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Button variant="outline" className="border-indigo-300 text-indigo-700" onClick={() => onNavigate('investor-registry')}>
            View Profile
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <p className="text-sm text-gray-600">Available Deals</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{filteredDeals.length}</p>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Open for Investment</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {filteredDeals.filter(d => d.status === 'open').length}
          </p>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-gray-600">Closing Soon</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {filteredDeals.filter(d => d.status === 'closing-soon').length}
          </p>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Total Target</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${(filteredDeals.reduce((sum, d) => sum + d.targetRaise, 0) / 1000000).toFixed(0)}M
          </p>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Avg. Return</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {(filteredDeals.reduce((sum, d) => sum + d.expectedReturn, 0) / filteredDeals.length).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search deals by name, ID, or sector..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-indigo-50 border-indigo-300' : ''}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {showFilters ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Strategy</label>
              <select
                value={filters.strategy}
                onChange={(e) => setFilters({ ...filters, strategy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Strategies</option>
                {mockInvestorProfile.strategyFlags.map((flag: string) => (
                  <option key={flag} value={flag}>{flag}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closing-soon">Closing Soon</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Structure</label>
              <select
                value={filters.structure}
                onChange={(e) => setFilters({ ...filters, structure: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Structures</option>
                <option value="pooled">Pooled</option>
                <option value="participation">Participation</option>
                <option value="hybrid">Hybrid</option>
                <option value="direct">Direct</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Investment</label>
              <select
                value={filters.minInvestment}
                onChange={(e) => setFilters({ ...filters, minInvestment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Any Amount</option>
                <option value="under-500k">Under $500K</option>
                <option value="500k-1m">$500K - $1M</option>
                <option value="over-1m">Over $1M</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Deal Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredDeals.map((deal) => (
          <div
            key={deal.id}
            className="bg-white border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedDeal(deal);
              setViewMode('detail');
            }}
          >
            <div className="p-6">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{deal.name}</h3>
                    {deal.teaserOnly && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Teaser Only
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-600">{deal.id} • {deal.spvId}</p>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                      {deal.strategy}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                      {deal.sector}
                    </span>
                    {getStructureBadge(deal.structure)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(deal.status as DealStatus)}
                  {getRiskGradeBadge(deal.riskGrade)}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4">{deal.description}</p>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-6 gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">Target Raise</p>
                  <p className="text-lg font-bold text-blue-900">${(deal.targetRaise / 1000000).toFixed(1)}M</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 mb-1">Expected Return</p>
                  <p className="text-lg font-bold text-green-900">{deal.expectedReturn}% p.a.</p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600 mb-1">Term</p>
                  <p className="text-lg font-bold text-purple-900">{deal.term} months</p>
                </div>
                
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-orange-600 mb-1">Min Investment</p>
                  <p className="text-lg font-bold text-orange-900">${(deal.minInvestment / 1000).toFixed(0)}K</p>
                </div>
                
                {deal.lvr && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-yellow-600 mb-1">LVR</p>
                    <p className="text-lg font-bold text-yellow-900">{deal.lvr}%</p>
                  </div>
                )}
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{deal.location}</p>
                </div>
              </div>

              {/* Progress Bar (if open or closing soon) */}
              {(deal.status === 'open' || deal.status === 'closing-soon') && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Fundraising Progress</p>
                    <p className="text-sm font-semibold text-gray-900">
                      ${(deal.raisedToDate / 1000000).toFixed(1)}M / ${(deal.targetRaise / 1000000).toFixed(1)}M
                      <span className="text-gray-600 ml-2">
                        ({((deal.raisedToDate / deal.targetRaise) * 100).toFixed(0)}%)
                      </span>
                    </p>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-green-600 rounded-full"
                      style={{ width: `${(deal.raisedToDate / deal.targetRaise) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {deal.features.map((feature: string) => (
                  <span key={feature} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {feature}
                  </span>
                ))}
              </div>

              {/* Footer Row */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Close: {deal.closeDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{deal.eoisReceived} EOIs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{deal.documents.length} documents</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {deal.status === 'open' || deal.status === 'closing-soon' ? (
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Express Interest
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDeals.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-300 rounded-lg">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No deals match your current filters</p>
          <p className="text-sm text-gray-500 mb-4">
            Try adjusting your filters or check back soon for new opportunities
          </p>
          <Button
            variant="outline"
            onClick={() => setFilters({ strategy: 'all', status: 'all', structure: 'all', minInvestment: 'all', search: '' })}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

// Deal Detail View Component
function DealDetailView({ deal, investorProfile, onBack, role }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'terms' | 'documents' | 'qa' | 'eoi' | 'allocation'>('overview');
  const allocationLocked = deal.allocation?.toLowerCase().includes('coming soon');
  const showAllocation =
    !allocationLocked &&
    (deal.status === 'open' ||
      deal.status === 'draft' ||
      role === 'cfo' ||
      role === 'fund-accountant' ||
      role === 'tenant-admin');
  const [showEOIModal, setShowEOIModal] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{deal.name}</h1>
              {deal.teaserOnly && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  Limited Access
                </span>
              )}
            </div>
            <p className="text-gray-600">{deal.id} • {deal.spvId} • {deal.strategy} • {deal.sector}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download IM
          </Button>
          {(deal.status === 'open' || deal.status === 'closing-soon') && (
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setShowEOIModal(true)}>
              <ThumbsUp className="w-4 h-4 mr-2" />
              Submit EOI
            </Button>
          )}
        </div>
      </div>

      {/* Status Banner */}
      {deal.status === 'closing-soon' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-orange-900">Deal Closing Soon</p>
              <p className="text-sm text-orange-700 mt-1">
                This opportunity closes on {deal.closeDate}. Submit your expression of interest before the deadline.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <p className="text-xs text-gray-600">Target Raise</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">${(deal.targetRaise / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-600 mt-1">${(deal.raisedToDate / 1000000).toFixed(1)}M raised</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-xs text-gray-600">Expected Return</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{deal.expectedReturn}%</p>
          <p className="text-xs text-gray-600 mt-1">per annum</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <p className="text-xs text-gray-600">Term</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{deal.term}</p>
          <p className="text-xs text-gray-600 mt-1">months</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-orange-600" />
            <p className="text-xs text-gray-600">Min / Max</p>
          </div>
          <p className="text-lg font-bold text-gray-900">${(deal.minInvestment / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-600 mt-1">to ${(deal.maxInvestment / 1000).toFixed(0)}K</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <p className="text-xs text-gray-600">Risk Grade</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{deal.riskGrade}</p>
          <p className="text-xs text-gray-600 mt-1">{deal.allocation}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="border-b border-gray-300">
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: Briefcase },
              { id: 'terms', label: 'Key Terms', icon: FileText },
              ...(showAllocation ? [{ id: 'allocation', label: 'Allocation', icon: Target }] : []),
              { id: 'documents', label: 'Documents', icon: Upload },
              { id: 'qa', label: 'Q&A', icon: MessageSquare },
              { id: 'eoi', label: 'Submit EOI', icon: ThumbsUp }
            ].map((tab: { id: string; label: string; icon: typeof Briefcase }) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'terms' | 'documents' | 'qa' | 'eoi' | 'allocation')}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <DealOverviewTab deal={deal} />}
          {activeTab === 'terms' && <DealTermsTab deal={deal} />}
          {activeTab === 'allocation' && (
            <DealAllocationPanel dealId={deal.id} targetRaise={deal.targetRaise} role={role} />
          )}
          {activeTab === 'documents' && <DealDocumentsTab deal={deal} />}
          {activeTab === 'qa' && <DealQATab deal={deal} />}
          {activeTab === 'eoi' && <DealEOITab deal={deal} investorProfile={investorProfile} />}
        </div>
      </div>

      {/* EOI Modal */}
      {showEOIModal && (
        <EOIModal
          deal={deal}
          investorProfile={investorProfile}
          onClose={() => setShowEOIModal(false)}
        />
      )}
    </div>
  );
}

// Tab Components
function DealOverviewTab({ deal }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Investment Summary</h3>
        <p className="text-gray-700 leading-relaxed">{deal.description}</p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
        <div className="grid grid-cols-2 gap-3">
          {deal.features.map((feature: string) => (
            <div key={feature} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-gray-900">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Investment Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Structure</span>
              <span className="text-sm font-medium text-gray-900 capitalize">{deal.structure}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Sector</span>
              <span className="text-sm font-medium text-gray-900">{deal.sector}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Location</span>
              <span className="text-sm font-medium text-gray-900">{deal.location}</span>
            </div>
            {deal.lvr && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">LVR</span>
                <span className="text-sm font-medium text-gray-900">{deal.lvr}%</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Close Date</span>
              <span className="text-sm font-medium text-gray-900">{deal.closeDate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Funding Date</span>
              <span className="text-sm font-medium text-gray-900">{deal.fundingDate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Term</span>
              <span className="text-sm font-medium text-gray-900">{deal.term} months</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Maturity</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(new Date(deal.fundingDate).setMonth(new Date(deal.fundingDate).getMonth() + deal.term)).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DealTermsTab({ deal }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-4">Key Commercial Terms</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(deal.keyTerms).map(([key, value]) => (
            <div key={key} className="p-3 bg-white rounded-lg">
              <p className="text-xs text-indigo-600 uppercase tracking-wide mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-sm font-semibold text-gray-900">{value as string}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Investment Parameters</h3>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-900">Minimum Investment</td>
                <td className="px-4 py-3 text-sm text-gray-900">${(deal.minInvestment / 1000).toFixed(0)}K</td>
              </tr>
              <tr>
                <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-900">Maximum Investment</td>
                <td className="px-4 py-3 text-sm text-gray-900">${(deal.maxInvestment / 1000).toFixed(0)}K</td>
              </tr>
              <tr>
                <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-900">Expected Return</td>
                <td className="px-4 py-3 text-sm text-gray-900">{deal.expectedReturn}% per annum</td>
              </tr>
              <tr>
                <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-900">Interest Payment</td>
                <td className="px-4 py-3 text-sm text-gray-900">Quarterly in arrears</td>
              </tr>
              <tr>
                <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-900">Allocation Method</td>
                <td className="px-4 py-3 text-sm text-gray-900">{deal.allocation}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DealDocumentsTab({ deal }: any) {
  const documents = deal.documents.map((name: string) => ({
    name,
    type: name.includes('IM') ? 'Information Memorandum' :
          name.includes('Valuation') ? 'Valuation' :
          name.includes('Financial') ? 'Financial' :
          name.includes('Agreement') ? 'Legal' : 'Other',
    size: '2.4 MB',
    uploadDate: '2024-02-10'
  }));

  return (
    <div className="space-y-4">
      {deal.teaserOnly ? (
        <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Lock className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <p className="font-semibold text-yellow-900 mb-2">Limited Document Access</p>
          <p className="text-sm text-yellow-700">
            Full documentation is only available to investors who have submitted an EOI
          </p>
        </div>
      ) : (
        <>
          {documents.map((doc: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-600">{doc.type} • {doc.size} • Uploaded {doc.uploadDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function DealQATab({ deal }: any) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 mb-1">Q&A Forum</p>
            <p className="text-sm text-blue-700">
              Submit questions about this deal and view responses from the fund manager. All Q&A is visible to investors with access.
            </p>
          </div>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-4">
        <textarea
          placeholder="Type your question here..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex justify-end mt-2">
          <Button size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Submit Question
          </Button>
        </div>
      </div>

      {/* Mock Q&A */}
      <div className="space-y-3">
        {[
          {
            question: 'What is the expected settlement date for pre-sales?',
            answer: 'Current pre-sales are contracted for settlement Q3 2025, with 65% pre-sold at an average price of $780K.',
            askedBy: 'Investor (Tier A)',
            date: '2024-02-08'
          },
          {
            question: 'Is there a cost overrun contingency?',
            answer: 'Yes, the facility includes a 10% contingency ($4M) for cost overruns. The developer also has additional equity available.',
            askedBy: 'Investor (Tier A)',
            date: '2024-02-05'
          }
        ].map((qa, idx) => (
          <div key={idx} className="border border-gray-300 rounded-lg p-4">
            <div className="mb-3">
              <p className="font-medium text-gray-900 mb-1">{qa.question}</p>
              <p className="text-xs text-gray-500">{qa.askedBy} • {qa.date}</p>
            </div>
            <div className="pl-4 border-l-2 border-indigo-300">
              <p className="text-sm text-gray-700">{qa.answer}</p>
              <p className="text-xs text-indigo-600 mt-2">— Fund Manager</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DealEOITab({ deal, investorProfile }: any) {
  const [eoiAmount, setEoiAmount] = useState(deal.minInvestment);

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-3">Expression of Interest</h3>
        <p className="text-sm text-indigo-700 mb-4">
          Submit your non-binding expression of interest for this deal. Your EOI will be reviewed by the fund manager
          and you'll receive allocation confirmation before the funding date.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-white rounded-lg">
            <p className="text-xs text-indigo-600 mb-1">Available Capital</p>
            <p className="text-lg font-bold text-indigo-900">${(investorProfile.availableCapital / 1000000).toFixed(1)}M</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-xs text-indigo-600 mb-1">Concentration Limit</p>
            <p className="text-lg font-bold text-indigo-900">{investorProfile.concentrationLimits.perSPV}% per SPV</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Investment Amount</label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={eoiAmount}
            onChange={(e) => setEoiAmount(Number(e.target.value))}
            min={deal.minInvestment}
            max={deal.maxInvestment}
            step={50000}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="text-sm text-gray-600">
            <p>Min: ${(deal.minInvestment / 1000).toFixed(0)}K</p>
            <p>Max: ${(deal.maxInvestment / 1000).toFixed(0)}K</p>
          </div>
        </div>
        
        {/* Validation */}
        {eoiAmount > investorProfile.availableCapital && (
          <p className="text-sm text-red-600 mt-2">⚠️ Amount exceeds available capital</p>
        )}
        {eoiAmount > deal.maxInvestment && (
          <p className="text-sm text-red-600 mt-2">⚠️ Amount exceeds maximum investment</p>
        )}
        {eoiAmount < deal.minInvestment && (
          <p className="text-sm text-orange-600 mt-2">⚠️ Amount below minimum investment</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Additional Comments (Optional)</label>
        <textarea
          rows={4}
          placeholder="Any specific requirements or questions..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div className="text-sm text-yellow-700">
          <p className="font-medium mb-1">Non-Binding EOI</p>
          <p>This expression of interest is non-binding. Final allocation will be confirmed by the fund manager based on available capacity and allocation rules.</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-300">
        <div>
          <p className="text-sm text-gray-600">Your EOI Amount</p>
          <p className="text-2xl font-bold text-gray-900">${(eoiAmount / 1000000).toFixed(2)}M</p>
        </div>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={eoiAmount < deal.minInvestment || eoiAmount > deal.maxInvestment || eoiAmount > investorProfile.availableCapital}
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
          Submit EOI
        </Button>
      </div>
    </div>
  );
}

// EOI Modal Component
function EOIModal({ deal, investorProfile, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Submit Expression of Interest</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <DealEOITab deal={deal} investorProfile={investorProfile} />
        </div>
      </div>
    </div>
  );
}

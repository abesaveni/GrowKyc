import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Target,
  DollarSign,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Briefcase,
  Award,
  Lock,
  Unlock,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  Percent,
  ArrowRight,
  ArrowUpDown,
  Info,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Calculator,
  ChevronRight,
  ChevronDown,
  X,
  Settings,
  Zap,
  Activity
} from 'lucide-react';

interface AllocationEngineProps {
  onNavigate: (page: string) => void;
  role: string;
}

type AllocationMode = 'pooled' | 'participation' | 'hybrid';
type AllocationMethod = 'first-come' | 'pro-rata' | 'tier-priority' | 'custom';
type EOIStatus = 'pending' | 'approved' | 'rejected' | 'allocated' | 'waitlist';
type ViewMode = 'deals' | 'eoi-queue' | 'allocations' | 'concentration';

export function AllocationEngine({ onNavigate, role }: AllocationEngineProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('deals');
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    strategy: 'all',
    search: ''
  });

  // Mock deals ready for allocation
  const mockDeals = [
    {
      id: 'DEAL-2024-001',
      spvId: 'SPV-2024-028',
      name: 'Sydney CBD Commercial Property Pool',
      strategy: 'Mortgage',
      structure: 'pooled',
      allocationMethod: 'first-come',
      targetRaise: 25000000,
      currentEOIs: 32500000,
      approvedEOIs: 28000000,
      allocatedAmount: 0,
      status: 'ready-to-allocate',
      closeDate: '2024-03-15',
      eoiCount: 12,
      oversubscribed: true,
      oversubscriptionRatio: 1.3,
      tierBreakdown: {
        'tier-a': { eois: 5, amount: 15000000 },
        'tier-b': { eois: 4, amount: 8000000 },
        'tier-c': { eois: 3, amount: 5000000 }
      },
      concentrationIssues: 0,
      allocationRules: {
        tierPriority: ['tier-a', 'tier-b', 'tier-c'],
        maxPerInvestor: 5000000,
        minPerInvestor: 500000,
        roundingRule: 'down-10k'
      }
    },
    {
      id: 'DEAL-2024-002',
      spvId: 'SPV-2024-029',
      name: 'Tech SME Growth Capital Fund',
      strategy: 'SME',
      structure: 'pooled',
      allocationMethod: 'pro-rata',
      targetRaise: 15000000,
      currentEOIs: 14200000,
      approvedEOIs: 14200000,
      allocatedAmount: 14200000,
      status: 'allocated',
      closeDate: '2024-02-28',
      eoiCount: 8,
      oversubscribed: false,
      oversubscriptionRatio: 0.95,
      tierBreakdown: {
        'tier-a': { eois: 4, amount: 8000000 },
        'tier-b': { eois: 4, amount: 6200000 }
      },
      concentrationIssues: 0,
      allocationRules: {
        tierPriority: ['tier-a', 'tier-b'],
        maxPerInvestor: 2000000,
        minPerInvestor: 250000,
        roundingRule: 'down-10k'
      }
    },
    {
      id: 'DEAL-2024-003',
      spvId: 'SPV-2024-030',
      name: 'Brisbane Residential Development',
      strategy: 'Mortgage',
      structure: 'participation',
      allocationMethod: 'tier-priority',
      targetRaise: 40000000,
      currentEOIs: 18000000,
      approvedEOIs: 16000000,
      allocatedAmount: 0,
      status: 'collecting-eois',
      closeDate: '2024-04-30',
      eoiCount: 4,
      oversubscribed: false,
      oversubscriptionRatio: 0.45,
      tierBreakdown: {
        'tier-a': { eois: 4, amount: 16000000 }
      },
      concentrationIssues: 2,
      allocationRules: {
        tierPriority: ['tier-a'],
        maxPerInvestor: 10000000,
        minPerInvestor: 2000000,
        roundingRule: 'down-100k'
      }
    }
  ];

  // Mock EOI queue
  const mockEOIs = [
    {
      id: 'EOI-2024-156',
      dealId: 'DEAL-2024-001',
      dealName: 'Sydney CBD Commercial Property Pool',
      investorId: 'INV-001',
      investorName: 'Meridian Capital Pty Ltd',
      investorTier: 'tier-a',
      requestedAmount: 3000000,
      submittedDate: '2024-02-10',
      status: 'approved',
      approvedBy: 'CFO',
      approvedDate: '2024-02-11',
      concentrationCheck: {
        perSPV: { current: 8, limit: 15, afterAllocation: 14.5, status: 'ok' },
        perSector: { current: 12, limit: 25, afterAllocation: 18, status: 'ok' },
        total: { current: 28, limit: 50, afterAllocation: 35, status: 'ok' }
      },
      capitalCheck: {
        available: 3500000,
        requested: 3000000,
        afterAllocation: 500000,
        status: 'ok'
      },
      allocationEligible: true,
      priority: 1
    },
    {
      id: 'EOI-2024-157',
      dealId: 'DEAL-2024-001',
      investorId: 'INV-004',
      investorName: 'Apex Investment Fund',
      investorTier: 'tier-a',
      requestedAmount: 8000000,
      submittedDate: '2024-02-10',
      status: 'approved',
      approvedBy: 'CFO',
      approvedDate: '2024-02-11',
      concentrationCheck: {
        perSPV: { current: 10, limit: 15, afterAllocation: 14, status: 'ok' },
        perSector: { current: 18, limit: 25, afterAllocation: 22, status: 'ok' },
        total: { current: 40, limit: 50, afterAllocation: 46, status: 'ok' }
      },
      capitalCheck: {
        available: 25000000,
        requested: 8000000,
        afterAllocation: 17000000,
        status: 'ok'
      },
      allocationEligible: true,
      priority: 1
    },
    {
      id: 'EOI-2024-158',
      dealId: 'DEAL-2024-001',
      investorId: 'INV-005',
      investorName: 'Quantum Capital Partners',
      investorTier: 'tier-b',
      requestedAmount: 5000000,
      submittedDate: '2024-02-11',
      status: 'approved',
      approvedBy: 'CFO',
      approvedDate: '2024-02-12',
      concentrationCheck: {
        perSPV: { current: 6, limit: 10, afterAllocation: 13, status: 'warning' },
        perSector: { current: 14, limit: 20, afterAllocation: 20, status: 'warning' },
        total: { current: 25, limit: 35, afterAllocation: 32, status: 'ok' }
      },
      capitalCheck: {
        available: 7000000,
        requested: 5000000,
        afterAllocation: 2000000,
        status: 'ok'
      },
      allocationEligible: true,
      priority: 2
    },
    {
      id: 'EOI-2024-159',
      dealId: 'DEAL-2024-001',
      investorId: 'INV-002',
      investorName: 'Smith Family Trust',
      investorTier: 'tier-c',
      requestedAmount: 1500000,
      submittedDate: '2024-02-12',
      status: 'pending',
      concentrationCheck: {
        perSPV: { current: 3, limit: 5, afterAllocation: 4.8, status: 'ok' },
        perSector: { current: 8, limit: 15, afterAllocation: 12, status: 'ok' },
        total: { current: 15, limit: 20, afterAllocation: 18.5, status: 'ok' }
      },
      capitalCheck: {
        available: 800000,
        requested: 1500000,
        afterAllocation: -700000,
        status: 'insufficient-capital'
      },
      allocationEligible: false,
      priority: 3,
      blockers: ['Insufficient available capital']
    },
    {
      id: 'EOI-2024-160',
      dealId: 'DEAL-2024-003',
      investorId: 'INV-001',
      investorName: 'Meridian Capital Pty Ltd',
      investorTier: 'tier-a',
      requestedAmount: 6000000,
      submittedDate: '2024-02-13',
      status: 'approved',
      approvedBy: 'CFO',
      approvedDate: '2024-02-13',
      concentrationCheck: {
        perSPV: { current: 8, limit: 15, afterAllocation: 21, status: 'breach' },
        perSector: { current: 12, limit: 25, afterAllocation: 24, status: 'warning' },
        total: { current: 28, limit: 50, afterAllocation: 41, status: 'ok' }
      },
      capitalCheck: {
        available: 3500000,
        requested: 6000000,
        afterAllocation: -2500000,
        status: 'insufficient-capital'
      },
      allocationEligible: false,
      priority: 1,
      blockers: ['Per-SPV concentration limit breach', 'Insufficient available capital']
    }
  ];

  const filteredDeals = mockDeals.filter(deal => {
    if (filters.status !== 'all' && deal.status !== filters.status) return false;
    if (filters.strategy !== 'all' && deal.strategy !== filters.strategy) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return deal.name.toLowerCase().includes(searchLower) || deal.id.toLowerCase().includes(searchLower);
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const config: any = {
      'collecting-eois': { label: 'Collecting EOIs', className: 'bg-blue-100 text-blue-800', icon: Clock },
      'ready-to-allocate': { label: 'Ready to Allocate', className: 'bg-green-100 text-green-800', icon: Target },
      'allocated': { label: 'Allocated', className: 'bg-purple-100 text-purple-800', icon: CheckCircle },
      'funding': { label: 'Funding', className: 'bg-indigo-100 text-indigo-800', icon: DollarSign }
    };

    const statusConfig = config[status] || config['collecting-eois'];
    const Icon = statusConfig.icon;

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
        <Icon className="w-3.5 h-3.5" />
        {statusConfig.label}
      </div>
    );
  };

  const getEOIStatusBadge = (status: EOIStatus) => {
    const config = {
      pending: { label: 'Pending Review', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { label: 'Approved', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800', icon: XCircle },
      allocated: { label: 'Allocated', className: 'bg-purple-100 text-purple-800', icon: Target },
      waitlist: { label: 'Waitlist', className: 'bg-orange-100 text-orange-800', icon: Clock }
    };

    const statusConfig = config[status];
    const Icon = statusConfig.icon;

    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
        <Icon className="w-3 h-3" />
        {statusConfig.label}
      </div>
    );
  };

  if (selectedDeal && viewMode === 'deals') {
    return (
      <DealAllocationDetail
        deal={selectedDeal}
        eois={mockEOIs.filter(e => e.dealId === selectedDeal.id)}
        onBack={() => setSelectedDeal(null)}
        role={role}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Allocation Engine</h1>
          <p className="text-gray-600 mt-1">Process EOIs and manage capital allocation with concentration enforcement</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Allocations
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Allocation Rules
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-300">
          {[
            { id: 'deals', label: 'Deals', icon: Briefcase },
            { id: 'eoi-queue', label: 'EOI Queue', icon: Clock },
            { id: 'allocations', label: 'Allocations', icon: Target },
            { id: 'concentration', label: 'Concentration Monitor', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as ViewMode)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  viewMode === tab.id
                    ? 'border-indigo-600 text-indigo-600 font-medium bg-indigo-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Deals View */}
      {viewMode === 'deals' && (
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-gray-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-600">Ready to Allocate</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {mockDeals.filter(d => d.status === 'ready-to-allocate').length}
              </p>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600">Collecting EOIs</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {mockDeals.filter(d => d.status === 'collecting-eois').length}
              </p>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-gray-600">Oversubscribed</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {mockDeals.filter(d => d.oversubscribed).length}
              </p>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-gray-600">Concentration Issues</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {mockDeals.reduce((sum, d) => sum + d.concentrationIssues, 0)}
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
                  placeholder="Search deals..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="collecting-eois">Collecting EOIs</option>
                <option value="ready-to-allocate">Ready to Allocate</option>
                <option value="allocated">Allocated</option>
              </select>

              <select
                value={filters.strategy}
                onChange={(e) => setFilters({ ...filters, strategy: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Strategies</option>
                <option value="Mortgage">Mortgage</option>
                <option value="SME">SME</option>
                <option value="Asset Finance">Asset Finance</option>
              </select>
            </div>
          </div>

          {/* Deal Cards */}
          <div className="space-y-4">
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedDeal(deal)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{deal.name}</h3>
                      {deal.oversubscribed && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                          {deal.oversubscriptionRatio.toFixed(1)}x Oversubscribed
                        </span>
                      )}
                      {deal.concentrationIssues > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {deal.concentrationIssues} Issues
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{deal.id} • {deal.spvId} • {deal.strategy}</p>
                  </div>
                  {getStatusBadge(deal.status)}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1">Target Raise</p>
                    <p className="text-lg font-bold text-blue-900">${(deal.targetRaise / 1000000).toFixed(1)}M</p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 mb-1">Approved EOIs</p>
                    <p className="text-lg font-bold text-green-900">${(deal.approvedEOIs / 1000000).toFixed(1)}M</p>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600 mb-1">Total EOIs</p>
                    <p className="text-lg font-bold text-purple-900">{deal.eoiCount}</p>
                  </div>

                  <div className={`p-3 rounded-lg ${
                    deal.allocatedAmount > 0 ? 'bg-indigo-50' : 'bg-gray-50'
                  }`}>
                    <p className={`text-xs mb-1 ${
                      deal.allocatedAmount > 0 ? 'text-indigo-600' : 'text-gray-600'
                    }`}>Allocated</p>
                    <p className={`text-lg font-bold ${
                      deal.allocatedAmount > 0 ? 'text-indigo-900' : 'text-gray-900'
                    }`}>${(deal.allocatedAmount / 1000000).toFixed(1)}M</p>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-orange-600 mb-1">Method</p>
                    <p className="text-xs font-semibold text-orange-900 capitalize">
                      {deal.allocationMethod.replace('-', ' ')}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">EOI Collection Progress</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {((deal.approvedEOIs / deal.targetRaise) * 100).toFixed(0)}% of target
                    </p>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full ${
                        deal.oversubscribed ? 'bg-orange-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min((deal.approvedEOIs / deal.targetRaise) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Tier Breakdown */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {Object.entries(deal.tierBreakdown).map(([tier, data]: [string, any]) => (
                    <div key={tier} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-3.5 h-3.5 text-gray-600" />
                        <p className="text-xs text-gray-600 capitalize">{tier.replace('-', ' ')}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{data.eois} EOIs</p>
                      <p className="text-xs text-gray-600">${(data.amount / 1000000).toFixed(1)}M</p>
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Close: {deal.closeDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowUpDown className="w-4 h-4" />
                      <span className="capitalize">{deal.structure}</span>
                    </div>
                  </div>

                  {deal.status === 'ready-to-allocate' && (
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Calculator className="w-4 h-4 mr-2" />
                      Run Allocation
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                  {deal.status === 'allocated' && (
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Allocation
                    </Button>
                  )}
                  {deal.status === 'collecting-eois' && (
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View EOIs
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EOI Queue View */}
      {viewMode === 'eoi-queue' && (
        <EOIQueueView eois={mockEOIs} role={role} />
      )}

      {/* Allocations View */}
      {viewMode === 'allocations' && (
        <AllocationsView deals={mockDeals} role={role} />
      )}

      {/* Concentration Monitor View */}
      {viewMode === 'concentration' && (
        <ConcentrationMonitorView eois={mockEOIs} role={role} />
      )}
    </div>
  );
}

// Deal Allocation Detail Component
function DealAllocationDetail({ deal, eois, onBack, role }: any) {
  const [allocationPreview, setAllocationPreview] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const runAllocationCalculation = () => {
    // Calculate allocation based on method
    const approvedEOIs = eois.filter((e: any) => e.status === 'approved' && e.allocationEligible);
    
    let allocations: any[] = [];
    
    if (deal.allocationMethod === 'first-come') {
      // First-come: Allocate in submission order until capacity reached
      let remaining = deal.targetRaise;
      approvedEOIs.sort((a: any, b: any) => new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime());
      
      allocations = approvedEOIs.map((eoi: any) => {
        const allocated = Math.min(eoi.requestedAmount, remaining);
        remaining -= allocated;
        return {
          ...eoi,
          allocatedAmount: allocated,
          allocationPercentage: (allocated / eoi.requestedAmount) * 100,
          status: allocated > 0 ? (allocated === eoi.requestedAmount ? 'full' : 'partial') : 'waitlist'
        };
      });
    } else if (deal.allocationMethod === 'pro-rata') {
      // Pro-rata: Distribute proportionally to requested amounts
      const totalRequested = approvedEOIs.reduce((sum: number, e: any) => sum + e.requestedAmount, 0);
      const allocationRatio = deal.targetRaise / totalRequested;
      
      allocations = approvedEOIs.map((eoi: any) => {
        const allocated = Math.floor(eoi.requestedAmount * allocationRatio / 10000) * 10000; // Round down to 10k
        return {
          ...eoi,
          allocatedAmount: allocated,
          allocationPercentage: (allocated / eoi.requestedAmount) * 100,
          status: allocated === eoi.requestedAmount ? 'full' : 'partial'
        };
      });
    } else if (deal.allocationMethod === 'tier-priority') {
      // Tier priority: Allocate to higher tiers first
      let remaining = deal.targetRaise;
      const tierOrder = deal.allocationRules.tierPriority;
      
      allocations = [];
      tierOrder.forEach((tier: string) => {
        const tierEOIs = approvedEOIs.filter((e: any) => e.investorTier === tier);
        tierEOIs.forEach((eoi: any) => {
          const allocated = Math.min(eoi.requestedAmount, remaining);
          remaining -= allocated;
          allocations.push({
            ...eoi,
            allocatedAmount: allocated,
            allocationPercentage: (allocated / eoi.requestedAmount) * 100,
            status: allocated > 0 ? (allocated === eoi.requestedAmount ? 'full' : 'partial') : 'waitlist'
          });
        });
      });
    }

    setAllocationPreview({
      allocations,
      summary: {
        totalAllocated: allocations.reduce((sum, a) => sum + a.allocatedAmount, 0),
        investorsAllocated: allocations.filter(a => a.allocatedAmount > 0).length,
        fullAllocations: allocations.filter(a => a.status === 'full').length,
        partialAllocations: allocations.filter(a => a.status === 'partial').length,
        waitlist: allocations.filter(a => a.status === 'waitlist').length
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{deal.name}</h1>
            <p className="text-gray-600">{deal.id} • {deal.spvId}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!allocationPreview && deal.status === 'ready-to-allocate' && (
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={runAllocationCalculation}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Allocation
            </Button>
          )}
          {allocationPreview && (
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setShowConfirmModal(true)}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Allocation
            </Button>
          )}
        </div>
      </div>

      {/* Deal Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Target Raise</p>
          <p className="text-2xl font-bold text-gray-900">${(deal.targetRaise / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Approved EOIs</p>
          <p className="text-2xl font-bold text-gray-900">${(deal.approvedEOIs / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Allocation Method</p>
          <p className="text-lg font-bold text-gray-900 capitalize">{deal.allocationMethod.replace('-', ' ')}</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Oversubscription</p>
          <p className="text-2xl font-bold text-gray-900">{deal.oversubscriptionRatio.toFixed(1)}x</p>
        </div>
      </div>

      {/* Allocation Rules */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-4">Allocation Rules</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-3 bg-white rounded-lg">
            <p className="text-xs text-indigo-600 mb-1">Tier Priority</p>
            <div className="flex gap-1">
              {deal.allocationRules.tierPriority.map((tier: string) => (
                <span key={tier} className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                  {tier.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-xs text-indigo-600 mb-1">Max Per Investor</p>
            <p className="text-sm font-semibold text-indigo-900">${(deal.allocationRules.maxPerInvestor / 1000000).toFixed(1)}M</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-xs text-indigo-600 mb-1">Min Per Investor</p>
            <p className="text-sm font-semibold text-indigo-900">${(deal.allocationRules.minPerInvestor / 1000).toFixed(0)}K</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-xs text-indigo-600 mb-1">Rounding</p>
            <p className="text-sm font-semibold text-indigo-900 capitalize">{deal.allocationRules.roundingRule}</p>
          </div>
        </div>
      </div>

      {/* Allocation Preview or EOI List */}
      {allocationPreview ? (
        <AllocationPreview preview={allocationPreview} deal={deal} />
      ) : (
        <EOIListForDeal eois={eois} deal={deal} />
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <AllocationConfirmModal
          preview={allocationPreview}
          deal={deal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            // Handle allocation confirmation
            alert('Allocation confirmed! Capital calls will be generated.');
            setShowConfirmModal(false);
          }}
        />
      )}
    </div>
  );
}

// EOI List for Deal
function EOIListForDeal({ eois, deal }: any) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-300 bg-gray-50">
        <h3 className="font-semibold text-gray-900">EOI Queue ({eois.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Investor</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tier</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Requested</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Concentration</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Eligible</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {eois.map((eoi: any) => (
              <tr key={eoi.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{eoi.investorName}</p>
                  <p className="text-xs text-gray-500">{eoi.id}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                    {eoi.investorTier.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-900">${(eoi.requestedAmount / 1000000).toFixed(2)}M</p>
                </td>
                <td className="px-4 py-3">
                  {/* Status badge component call */}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    eoi.status === 'approved' ? 'bg-green-100 text-green-800' :
                    eoi.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {eoi.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {['perSPV', 'perSector', 'total'].map((check) => {
                      const status = eoi.concentrationCheck[check].status;
                      return (
                        <div
                          key={check}
                          className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                            status === 'ok' ? 'bg-green-100 text-green-700' :
                            status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}
                          title={`${check}: ${eoi.concentrationCheck[check].afterAllocation}%`}
                        >
                          {status === 'ok' ? '✓' : status === 'warning' ? '!' : '✗'}
                        </div>
                      );
                    })}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {eoi.allocationEligible ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">Yes</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <XCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">Blocked</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Allocation Preview Component
function AllocationPreview({ preview, deal }: any) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-xs text-green-600 mb-1">Total Allocated</p>
          <p className="text-2xl font-bold text-green-900">${(preview.summary.totalAllocated / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-600 mb-1">Investors</p>
          <p className="text-2xl font-bold text-blue-900">{preview.summary.investorsAllocated}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-xs text-purple-600 mb-1">Full Allocation</p>
          <p className="text-2xl font-bold text-purple-900">{preview.summary.fullAllocations}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-xs text-orange-600 mb-1">Partial</p>
          <p className="text-2xl font-bold text-orange-900">{preview.summary.partialAllocations}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Waitlist</p>
          <p className="text-2xl font-bold text-gray-900">{preview.summary.waitlist}</p>
        </div>
      </div>

      {/* Allocation Table */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-300 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Allocation Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Investor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Requested</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Allocated</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fill Rate</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {preview.allocations.map((allocation: any) => (
                <tr key={allocation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{allocation.investorName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                      {allocation.investorTier.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">${(allocation.requestedAmount / 1000000).toFixed(2)}M</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-green-600">${(allocation.allocatedAmount / 1000000).toFixed(2)}M</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${allocation.allocationPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-900">{allocation.allocationPercentage.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      allocation.status === 'full' ? 'bg-green-100 text-green-800' :
                      allocation.status === 'partial' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {allocation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// EOI Queue View
function EOIQueueView({ eois, role }: any) {
  const pendingEOIs = eois.filter((e: any) => e.status === 'pending');
  const approvedEOIs = eois.filter((e: any) => e.status === 'approved');
  const blockedEOIs = eois.filter((e: any) => !e.allocationEligible && e.status !== 'rejected');

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Pending Review</p>
          <p className="text-2xl font-bold text-gray-900">{pendingEOIs.length}</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Approved</p>
          <p className="text-2xl font-bold text-gray-900">{approvedEOIs.length}</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Blocked</p>
          <p className="text-2xl font-bold text-gray-900">{blockedEOIs.length}</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total EOIs</p>
          <p className="text-2xl font-bold text-gray-900">{eois.length}</p>
        </div>
      </div>

      {/* Pending Review */}
      {pendingEOIs.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-300 bg-yellow-50">
            <h3 className="font-semibold text-yellow-900">Pending Review ({pendingEOIs.length})</h3>
          </div>
          {/* EOI table implementation */}
          <div className="p-4">
            <p className="text-sm text-gray-600">Review and approve pending EOIs...</p>
          </div>
        </div>
      )}

      {/* Blocked EOIs */}
      {blockedEOIs.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-300 bg-red-50">
            <h3 className="font-semibold text-red-900">Blocked EOIs ({blockedEOIs.length})</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {blockedEOIs.map((eoi: any) => (
              <div key={eoi.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{eoi.investorName}</p>
                    <p className="text-sm text-gray-600">{eoi.dealName}</p>
                  </div>
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                    Blocked
                  </span>
                </div>
                <div className="space-y-1">
                  {eoi.blockers && eoi.blockers.map((blocker: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-red-700">
                      <AlertCircle className="w-4 h-4" />
                      <span>{blocker}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Allocations View
function AllocationsView({ deals, role }: any) {
  const allocatedDeals = deals.filter((d: any) => d.allocatedAmount > 0);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Completed Allocations</h3>
        {allocatedDeals.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No completed allocations yet</p>
        ) : (
          <div className="space-y-4">
            {allocatedDeals.map((deal: any) => (
              <div key={deal.id} className="p-4 border border-gray-300 rounded-lg">
                <p className="font-medium text-gray-900">{deal.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  ${(deal.allocatedAmount / 1000000).toFixed(1)}M allocated to {deal.eoiCount} investors
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Concentration Monitor View
function ConcentrationMonitorView({ eois, role }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Real-Time Concentration Monitoring</h3>
        <p className="text-gray-600">Monitor concentration limits across all investors and deals...</p>
      </div>
    </div>
  );
}

// Allocation Confirm Modal
function AllocationConfirmModal({ preview, deal, onClose, onConfirm }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Confirm Allocation</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 mb-1">Confirm Final Allocation</p>
                <p className="text-sm text-yellow-700">
                  This will finalize the allocation and trigger capital calls to {preview.summary.investorsAllocated} investors.
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Allocated</p>
              <p className="text-xl font-bold text-gray-900">${(preview.summary.totalAllocated / 1000000).toFixed(1)}M</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Investors</p>
              <p className="text-xl font-bold text-gray-900">{preview.summary.investorsAllocated}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-300 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={onConfirm}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm & Issue Capital Calls
          </Button>
        </div>
      </div>
    </div>
  );
}

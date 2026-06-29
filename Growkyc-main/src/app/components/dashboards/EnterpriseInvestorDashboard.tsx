import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  DollarSign,
  Gavel,
  CheckCircle,
  Clock,
  Shield,
  PieChart,
  AlertTriangle,
  Eye,
  Download,
  Filter,
  Plus,
  Target,
  Award,
  Activity,
  Briefcase,
  Home,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Bell
} from 'lucide-react';
import { mockCases } from '../../data/mockData';
import { StatusBadge } from '../StatusBadge';
import { format } from 'date-fns';
import { EnterpriseDataTable } from '../common/EnterpriseDataTable';
import { EnterpriseAlert } from '../common/EnterpriseComponents';
import { toast } from 'sonner';

interface EnterpriseInvestorDashboardProps {
  onNavigate?: (page: string, caseId?: string) => void;
}

export function EnterpriseInvestorDashboard({ onNavigate }: EnterpriseInvestorDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const availableDeals = mockCases.filter(c => c.status === 'active' || c.status === 'in_auction');
  const myInvestments = mockCases.slice(0, 6);
  const watchlist = mockCases.slice(2, 5);

  // Enterprise investment metrics
  const metrics = {
    totalInvested: 8750000,
    portfolioValue: 9450000,
    totalReturn: 700000,
    returnRate: 8.2,
    activeInvestments: 12,
    completedDeals: 8,
    avgROI: 12.4,
    avgHoldingPeriod: 147,
    riskScore: 4.2,
    diversification: 8.7
  };

  // Portfolio breakdown
  const portfolioBreakdown = [
    { category: 'Residential', value: 5200000, percentage: 55, color: 'bg-blue-500' },
    { category: 'Commercial', value: 2800000, percentage: 30, color: 'bg-green-500' },
    { category: 'Industrial', value: 1450000, percentage: 15, color: 'bg-purple-500' }
  ];

  // Performance over time
  const performanceData = [
    { month: 'Jan', value: 8200000 },
    { month: 'Feb', value: 8450000 },
    { month: 'Mar', value: 8600000 },
    { month: 'Apr', value: 8950000 },
    { month: 'May', value: 9200000 },
    { month: 'Jun', value: 9450000 }
  ];

  const tableColumns = [
    { 
      key: 'caseNumber', 
      label: 'Case #', 
      sortable: true,
      width: '150px',
      render: (val: string) => <span className="font-mono font-semibold text-primary">{val}</span>
    },
    { 
      key: 'property', 
      label: 'Property', 
      sortable: true,
      render: (_: any, row: any) => (
        <div>
          <p className="font-semibold text-gray-900">{row.property?.address}</p>
          <p className="text-xs text-gray-600">{row.property?.suburb}, {row.property?.state}</p>
        </div>
      )
    },
    { 
      key: 'currentBid', 
      label: 'My Bid', 
      sortable: true,
      render: (val: number) => (
        <span className="font-semibold text-gray-900">
          A${val?.toLocaleString() || 'No bid'}
        </span>
      )
    },
    { 
      key: 'expectedReturn', 
      label: 'Est. Return', 
      sortable: true,
      render: (_: any, row: any) => {
        const returnVal = row.currentBid ? ((row.property?.estimatedValue - row.currentBid) / row.currentBid * 100).toFixed(1) : 0;
        return (
          <span className="font-semibold text-green-600">
            +{returnVal}%
          </span>
        );
      }
    },
    { 
      key: 'lvr', 
      label: 'LVR', 
      sortable: true,
      render: (val: number) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${val > 70 ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{ width: `${val}%` }}
            />
          </div>
          <span className="text-sm font-semibold">{val}%</span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val: string) => <StatusBadge status={val as any} />
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.('auction');
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toast.success('Bid placed successfully');
            }}
          >
            <Gavel className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Investor Header */}
      <Card className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900 text-white border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/5" />
        <CardContent className="p-8 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Investment Portfolio</h1>
                  <p className="text-emerald-200 text-sm mt-1">
                    Enterprise Investment Management Platform
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-200 text-xs">Total Invested</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xl font-bold">A${(metrics.totalInvested / 1000000).toFixed(2)}M</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-200 text-xs">Portfolio Value</span>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-xl font-bold">A${(metrics.portfolioValue / 1000000).toFixed(2)}M</p>
                  <p className="text-xs text-green-400 mt-1">↑ {metrics.returnRate}%</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-200 text-xs">Total Returns</span>
                    <Award className="w-4 h-4 text-yellow-400" />
                  </div>
                  <p className="text-xl font-bold">A${(metrics.totalReturn / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-yellow-400 mt-1">{metrics.avgROI}% avg ROI</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-200 text-xs">Active Deals</span>
                    <Briefcase className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-xl font-bold">{metrics.activeInvestments}</p>
                  <p className="text-xs text-blue-400 mt-1">{metrics.completedDeals} completed</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-200 text-xs">Risk Score</span>
                    <Shield className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-xl font-bold">{metrics.riskScore}/10</p>
                  <p className="text-xs text-purple-400 mt-1">Low-Moderate</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                size="lg"
                className="bg-white text-emerald-900 hover:bg-gray-100 gap-2"
                onClick={() => onNavigate?.('deals')}
              >
                <Gavel className="w-5 h-5" />
                Browse Deals
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 gap-2"
                onClick={() => onNavigate?.('reports')}
              >
                <Download className="w-5 h-5" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm font-semibold">{metrics.returnRate}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Return</p>
            <p className="text-2xl font-bold text-gray-900">A${(metrics.totalReturn / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-600 mt-2">Since inception</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-blue-600 font-semibold">TOP 10%</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Avg ROI</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.avgROI}%</p>
            <p className="text-xs text-gray-600 mt-2">Above market average</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-purple-600 font-semibold">AVG</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Holding Period</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.avgHoldingPeriod}d</p>
            <p className="text-xs text-gray-600 mt-2">~5 months average</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <PieChart className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs text-green-600 font-semibold">STRONG</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Diversification</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.diversification}/10</p>
            <p className="text-xs text-gray-600 mt-2">Well balanced</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-2 gap-4">
        <EnterpriseAlert
          type="success"
          title="New Investment Opportunities"
          message="3 new high-yield properties matching your criteria are now available"
          actions={
            <Button size="sm" variant="outline" onClick={() => onNavigate?.('deals')}>
              View Opportunities
            </Button>
          }
        />
        <EnterpriseAlert
          type="info"
          title="Upcoming Settlement"
          message="MIP-2026-003 settlement scheduled in 5 days - Expected return: A$142,000"
          actions={
            <Button size="sm" variant="outline" onClick={() => onNavigate?.('case_detail', 'case-003')}>
              View Details
            </Button>
          }
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Investment Portfolio Table */}
        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader className="border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Active Investments</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Your current investment portfolio</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                  </select>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <EnterpriseDataTable
                data={myInvestments}
                columns={tableColumns}
                searchable={true}
                searchPlaceholder="Search investments..."
                exportable={true}
                onRowClick={(row) => {
                  // Navigate to the specific case detail
                  onNavigate?.('case_detail', row.id);
                }}
                actions={[
                  {
                    label: 'Add to Watchlist',
                    icon: Eye,
                    onClick: (rows) => toast.success(`${rows.length} investment(s) added to watchlist`)
                  },
                  {
                    label: 'Generate Report',
                    icon: FileText,
                    onClick: (rows) => toast.success(`Report generated for ${rows.length} investment(s)`)
                  }
                ]}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Portfolio Breakdown */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="w-5 h-5 text-primary" />
                Portfolio Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {portfolioBreakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">{item.category}</span>
                      <span className="text-sm text-gray-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      A${(item.value / 1000000).toFixed(2)}M
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="w-5 h-5 text-primary" />
                6-Month Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {performanceData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 w-8">{item.month}</span>
                    <div className="flex-1 mx-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${(item.value / 9450000) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-900 w-16 text-right">
                      ${(item.value / 1000000).toFixed(2)}M
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Growth</span>
                  <span className="text-sm font-bold text-green-600">+15.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => onNavigate?.('deals')}
                >
                  <Plus className="w-4 h-4" />
                  Find New Deals
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => onNavigate?.('reports')}
                >
                  <FileText className="w-4 h-4" />
                  View Performance Report
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => onNavigate?.('settings')}
                >
                  <Filter className="w-4 h-4" />
                  Update Preferences
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => toast.info('Opening tax summary...')}
                >
                  <Download className="w-4 h-4" />
                  Download Tax Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
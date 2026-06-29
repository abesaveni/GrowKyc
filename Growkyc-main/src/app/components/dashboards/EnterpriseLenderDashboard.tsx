import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  Briefcase, 
  Gavel, 
  DollarSign,
  Home,
  CheckCircle,
  Eye,
  Activity,
  FileText,
  Plus,
  AlertCircle,
  Filter,
  Download,
  Bell,
  Settings,
  BarChart3,
  Calendar,
  Users,
  Shield,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { mockCases } from '../../data/mockData';
import { StatusBadge } from '../StatusBadge';
import { format } from 'date-fns';
import { EnterpriseDataTable } from '../common/EnterpriseDataTable';
import { EnterpriseAlert, LoadingState, StatusBadge as EnterpriseStatusBadge } from '../common/EnterpriseComponents';
import { toast } from 'sonner';

interface EnterpriseLenderDashboardProps {
  onNavigate?: (page: string) => void;
}

export function EnterpriseLenderDashboard({ onNavigate }: EnterpriseLenderDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const availableDeals = mockCases.filter(c => c.status === 'active' || c.status === 'in_auction');
  const myBids = mockCases.filter(c => c.currentBid && c.currentBid > 0);
  const myCases = mockCases.slice(0, 5);

  // Enterprise metrics
  const metrics = {
    totalPortfolio: 45600000,
    activeLoans: 23,
    defaultRate: 2.3,
    avgLVR: 68.5,
    portfolioChange: 12.4,
    recoveryRate: 94.2,
    avgDaysToSettle: 45,
    totalInterestEarned: 1250000
  };

  // Recent activities
  const recentActivities = [
    { id: 1, type: 'bid', message: 'New bid placed on MIP-2024-003', time: '2 hours ago', icon: Gavel, color: 'text-blue-600' },
    { id: 2, type: 'case', message: 'Case MIP-2024-001 moved to auction', time: '5 hours ago', icon: Home, color: 'text-green-600' },
    { id: 3, type: 'settlement', message: 'Settlement completed: $2.4M recovered', time: '1 day ago', icon: CheckCircle, color: 'text-green-600' },
    { id: 4, type: 'alert', message: 'Compliance review required for 2 cases', time: '1 day ago', icon: AlertCircle, color: 'text-amber-600' },
    { id: 5, type: 'document', message: 'New valuation report available', time: '2 days ago', icon: FileText, color: 'text-gray-600' }
  ];

  const tableColumns = [
    { 
      key: 'caseNumber', 
      label: 'Case Number', 
      sortable: true,
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
      key: 'loanAmount', 
      label: 'Loan Amount', 
      sortable: true,
      render: (val: number) => (
        <span className="font-semibold text-gray-900">
          A${val?.toLocaleString() || '0'}
        </span>
      )
    },
    { 
      key: 'lvr', 
      label: 'LVR', 
      sortable: true,
      render: (val: number) => (
        <span className={`font-semibold ${val > 70 ? 'text-amber-600' : 'text-green-600'}`}>
          {val}%
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (val: string) => <StatusBadge status={val as any} />
    },
    { 
      key: 'auctionEnd', 
      label: 'Auction End', 
      sortable: true,
      render: (val: Date) => val ? format(val, 'dd MMM yyyy HH:mm') : '-'
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (_: any, row: any) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.('auctions');
          }}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      )
    }
  ];

  const handleBulkAction = (action: string, rows: any[]) => {
    toast.success(`${action} applied to ${rows.length} case(s)`);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner - Enterprise Edition */}
      <Card className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/5" />
        <CardContent className="p-8 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Lender Command Center</h1>
                  <p className="text-blue-200 text-sm mt-1">
                    Enterprise Lending Management Platform
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-6 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-200 text-sm">Portfolio Value</span>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold">A${(metrics.totalPortfolio / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-green-400 mt-1">↑ {metrics.portfolioChange}% this month</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-200 text-sm">Active Loans</span>
                    <Home className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold">{metrics.activeLoans}</p>
                  <p className="text-xs text-blue-400 mt-1">{myCases.length} in MIP process</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-200 text-sm">Recovery Rate</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold">{metrics.recoveryRate}%</p>
                  <p className="text-xs text-green-400 mt-1">Industry avg: 89%</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-200 text-sm">Avg Days to Settle</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-bold">{metrics.avgDaysToSettle}</p>
                  <p className="text-xs text-amber-400 mt-1">Target: 42 days</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                size="lg"
                className="bg-white text-blue-900 hover:bg-gray-100 gap-2"
                onClick={() => onNavigate?.('case')}
              >
                <Plus className="w-5 h-5" />
                New MIP Case
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 gap-2"
                onClick={() => onNavigate?.('deals')}
              >
                <Gavel className="w-5 h-5" />
                Browse Auctions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts & Notifications */}
      <div className="grid grid-cols-2 gap-4">
        <EnterpriseAlert
          type="warning"
          title="Compliance Review Required"
          message="2 cases require quarterly compliance review before auction listing"
          actions={
            <Button size="sm" variant="outline" onClick={() => onNavigate?.('cases')}>
              Review Cases
            </Button>
          }
        />
        <EnterpriseAlert
          type="info"
          title="Market Update"
          message="Property market showing 3.2% increase in target suburbs this quarter"
          actions={
            <Button size="sm" variant="outline" onClick={() => onNavigate?.('reports')}>
              View Details
            </Button>
          }
        />
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm font-semibold">12.4%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Interest Earned</p>
            <p className="text-2xl font-bold text-gray-900">A${(metrics.totalInterestEarned / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-gray-600 mt-2">This quarter</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowDownRight className="w-4 h-4" />
                <span className="text-sm font-semibold">0.5%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Default Rate</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.defaultRate}%</p>
            <p className="text-xs text-gray-600 mt-2">Below industry avg</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Gavel className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-purple-600 font-semibold">ACTIVE</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Bids</p>
            <p className="text-2xl font-bold text-gray-900">{myBids.length}</p>
            <p className="text-xs text-gray-600 mt-2">{availableDeals.length} available deals</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Activity className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs text-amber-600 font-semibold">AVG</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Portfolio LVR</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.avgLVR}%</p>
            <p className="text-xs text-gray-600 mt-2">Conservative risk profile</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* My MIP Cases - Full Width Enterprise Table */}
        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader className="border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Home className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">My MIP Portfolio</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Manage your mortgage in possession cases</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast.info('Generating report...')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <EnterpriseDataTable
                data={myCases}
                columns={tableColumns}
                searchable={true}
                searchPlaceholder="Search by case number, address..."
                exportable={true}
                filterable={true}
                onRowClick={(row) => {
                  onNavigate?.('case_detail');
                }}
                actions={[
                  {
                    label: 'Move to Auction',
                    icon: Gavel,
                    onClick: (rows) => handleBulkAction('Move to Auction', rows),
                    variant: 'primary'
                  },
                  {
                    label: 'Generate Reports',
                    icon: FileText,
                    onClick: (rows) => handleBulkAction('Generate Reports', rows),
                    variant: 'secondary'
                  }
                ]}
              />
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-[500px] overflow-y-auto">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-full bg-gray-100 h-fit`}>
                          <Icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                          <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                  onClick={() => onNavigate?.('case')}
                >
                  <Plus className="w-4 h-4" />
                  Create New MIP Case
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => onNavigate?.('reports')}
                >
                  <FileText className="w-4 h-4" />
                  Generate Portfolio Report
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => onNavigate?.('settings')}
                >
                  <Shield className="w-4 h-4" />
                  Compliance Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => onNavigate?.('analytics')}
                >
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
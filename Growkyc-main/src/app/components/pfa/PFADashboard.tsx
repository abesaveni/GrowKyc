import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Home,
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  Target,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  Building2,
  CreditCard,
  PieChart
} from 'lucide-react';

interface PFADashboardProps {
  onNavigate?: (page: string) => void;
}

export function PFADashboard({ onNavigate }: PFADashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Dashboard stats
  const stats = {
    activeEnquiries: 24,
    activeApplications: 18,
    pendingSettlements: 7,
    activeLoans: 156,
    totalLoanBook: 42500000,
    thisMonthSettlements: 8,
    thisMonthValue: 3200000,
    conversionRate: 68,
    averageProcessingDays: 21,
    complianceScore: 98
  };

  const recentEnquiries = [
    { id: 'ENQ-2024-156', client: 'Sarah Mitchell', type: 'Home Loan', amount: 650000, status: 'new', date: '2024-02-14', time: '09:30' },
    { id: 'ENQ-2024-155', client: 'James Chen', type: 'Refinance', amount: 420000, status: 'contacted', date: '2024-02-14', time: '08:15' },
    { id: 'ENQ-2024-154', client: 'Emma Thompson', type: 'Investment', amount: 580000, status: 'qualified', date: '2024-02-13', time: '16:45' },
    { id: 'ENQ-2024-153', client: 'Michael Brown', type: 'Home Loan', amount: 750000, status: 'new', date: '2024-02-13', time: '14:20' }
  ];

  const upcomingSettlements = [
    { id: 'APP-2024-089', client: 'David Wilson', lender: 'NAB', amount: 580000, settlementDate: '2024-02-16', daysUntil: 2, status: 'ready' },
    { id: 'APP-2024-087', client: 'Lisa Anderson', lender: 'CBA', amount: 420000, settlementDate: '2024-02-19', daysUntil: 5, status: 'pending_docs' },
    { id: 'APP-2024-092', client: 'Robert Taylor', lender: 'Westpac', amount: 695000, settlementDate: '2024-02-21', daysUntil: 7, status: 'ready' }
  ];

  const recentActivity = [
    { type: 'approval', message: 'Loan approved for Emma Thompson - $580k NAB', time: '2 hours ago', icon: CheckCircle, color: 'text-green-600' },
    { type: 'document', message: 'Documents received for James Chen application', time: '4 hours ago', icon: FileText, color: 'text-blue-600' },
    { type: 'settlement', message: 'Settlement completed - Michael Jones $425k', time: '5 hours ago', icon: Building2, color: 'text-purple-600' },
    { type: 'enquiry', message: 'New enquiry from Sarah Mitchell', time: '6 hours ago', icon: Phone, color: 'text-amber-600' }
  ];

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: JSX.Element } = {
      'new': <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">NEW</span>,
      'contacted': <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">CONTACTED</span>,
      'qualified': <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">QUALIFIED</span>,
      'ready': <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">READY</span>,
      'pending_docs': <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">PENDING DOCS</span>
    };
    return badges[status] || <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">{status}</span>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PFA Loan Management</h1>
            <p className="text-sm text-gray-600">Complete loan lifecycle from enquiry to payout</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Phone className="w-4 h-4 mr-2" />
              New Enquiry
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <button
            onClick={() => onNavigate?.('pfa-enquiries')}
            className="bg-white border border-gray-300 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <Phone className="w-5 h-5 text-blue-600" />
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.activeEnquiries}</div>
            <div className="text-xs text-gray-600">Active Enquiries</div>
            <div className="text-xs text-green-600 font-semibold mt-1">+5 this week</div>
          </button>

          <button
            onClick={() => onNavigate?.('pfa-pipeline')}
            className="bg-white border border-gray-300 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.activeApplications}</div>
            <div className="text-xs text-gray-600">Active Applications</div>
            <div className="text-xs text-purple-600 font-semibold mt-1">{stats.conversionRate}% conversion</div>
          </button>

          <button
            onClick={() => onNavigate?.('pfa-settlements')}
            className="bg-white border border-gray-300 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <Building2 className="w-5 h-5 text-green-600" />
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pendingSettlements}</div>
            <div className="text-xs text-gray-600">Pending Settlements</div>
            <div className="text-xs text-green-600 font-semibold mt-1">{stats.thisMonthSettlements} this month</div>
          </button>

          <button
            onClick={() => onNavigate?.('pfa-loan-book')}
            className="bg-white border border-gray-300 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.activeLoans}</div>
            <div className="text-xs text-gray-600">Active Loans</div>
            <div className="text-xs text-indigo-600 font-semibold mt-1">{formatCurrency(stats.totalLoanBook)}</div>
          </button>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5" />
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">{formatCurrency(stats.thisMonthValue)}</div>
            <div className="text-xs opacity-90">Settlements This Month</div>
            <div className="text-xs font-semibold mt-1">+18% vs last month</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Average Processing Time</h3>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.averageProcessingDays} days</div>
            <div className="text-xs text-gray-600">From application to settlement</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <span className="text-xs text-green-600 font-semibold">-3 days</span>
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Compliance Score</h3>
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.complianceScore}%</div>
            <div className="text-xs text-gray-600">All documents & checks complete</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
              <span className="text-xs text-green-600 font-semibold">Excellent</span>
            </div>
          </div>

          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Conversion Rate</h3>
              <PieChart className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{stats.conversionRate}%</div>
            <div className="text-xs text-gray-600">Enquiry to settlement</div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <span className="text-xs text-green-600 font-semibold">+4%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Enquiries */}
          <div className="border border-gray-300 rounded bg-white">
            <div className="bg-gray-50 border-b border-gray-300 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Recent Enquiries</h3>
              <Button variant="outline" size="sm" onClick={() => onNavigate?.('pfa-enquiries')}>
                View All
              </Button>
            </div>
            <div className="p-4 space-y-3">
              {recentEnquiries.map((enquiry) => (
                <div 
                  key={enquiry.id} 
                  onClick={() => onNavigate?.('pfa-enquiries')}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-blue-50 cursor-pointer border border-gray-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{enquiry.client}</span>
                      {getStatusBadge(enquiry.status)}
                    </div>
                    <div className="text-xs text-gray-600">{enquiry.type} • {formatCurrency(enquiry.amount)}</div>
                    <div className="text-xs text-gray-500 mt-1">{enquiry.id} • {enquiry.date} {enquiry.time}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Settlements */}
          <div className="border border-gray-300 rounded bg-white">
            <div className="bg-gray-50 border-b border-gray-300 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Upcoming Settlements</h3>
              <Button variant="outline" size="sm" onClick={() => onNavigate?.('pfa-settlements')}>
                View All
              </Button>
            </div>
            <div className="p-4 space-y-3">
              {upcomingSettlements.map((settlement) => (
                <div key={settlement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-green-50 cursor-pointer border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{settlement.client}</span>
                      {getStatusBadge(settlement.status)}
                    </div>
                    <div className="text-xs text-gray-600">{settlement.lender} • {formatCurrency(settlement.amount)}</div>
                    <div className="text-xs text-gray-500 mt-1">Settlement: {settlement.settlementDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">{settlement.daysUntil} days</div>
                    <div className="text-xs text-gray-500">until settlement</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="border border-gray-300 rounded bg-white">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-3">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-4 space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                <div className="flex-1">
                  <div className="text-sm text-gray-900">{activity.message}</div>
                  <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate?.('pfa-calculator')}
            className="bg-white border border-gray-300 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <DollarSign className="w-8 h-8 text-blue-600 mb-2" />
            <div className="font-semibold text-gray-900 text-sm">Loan Calculator</div>
            <div className="text-xs text-gray-600 mt-1">Calculate repayments</div>
          </button>

          <button
            onClick={() => onNavigate?.('pfa-documents')}
            className="bg-white border border-gray-300 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <FileText className="w-8 h-8 text-purple-600 mb-2" />
            <div className="font-semibold text-gray-900 text-sm">Documents</div>
            <div className="text-xs text-gray-600 mt-1">Manage documents</div>
          </button>

          <button
            onClick={() => onNavigate?.('pfa-reports')}
            className="bg-white border border-gray-300 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
            <div className="font-semibold text-gray-900 text-sm">Reports</div>
            <div className="text-xs text-gray-600 mt-1">Analytics & insights</div>
          </button>

          <button
            onClick={() => onNavigate?.('pfa-clients')}
            className="bg-white border border-gray-300 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <Users className="w-8 h-8 text-indigo-600 mb-2" />
            <div className="font-semibold text-gray-900 text-sm">Clients</div>
            <div className="text-xs text-gray-600 mt-1">Manage clients</div>
          </button>
        </div>
      </div>
    </div>
  );
}
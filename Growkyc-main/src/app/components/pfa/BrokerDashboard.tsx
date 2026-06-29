import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  TrendingUp,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Users,
  Building2,
  Briefcase,
  Target
} from 'lucide-react';

interface BrokerDashboardProps {
  onNavigate?: (page: string) => void;
}

export function BrokerDashboard({ onNavigate }: BrokerDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const stats = {
    activePipeline: 24,
    submittedApplications: 18,
    conditionalApprovals: 12,
    settledThisMonth: 8,
    pipelineValue: 12400000,
    upfrontCommission: 84500,
    trailCommission: 12800,
    conversionRate: 67
  };

  const pipelineDeals = [
    { id: 'APP-2024-156', borrower: 'Tech Solutions Pty Ltd', type: 'SME Term Loan', amount: 850000, status: 'submitted', daysInStage: 3, lvr: 65, bdm: 'John Smith' },
    { id: 'APP-2024-155', borrower: 'Property Investors Group', type: 'Commercial Mortgage', amount: 2400000, status: 'conditional', daysInStage: 7, lvr: 70, bdm: 'Sarah Johnson' },
    { id: 'APP-2024-154', borrower: 'Manufacturing Co Ltd', type: 'Asset Finance', amount: 450000, status: 'credit_review', daysInStage: 5, lvr: 75, bdm: 'John Smith' },
    { id: 'APP-2024-153', borrower: 'Retail Holdings Trust', type: 'Private Lending', amount: 1800000, status: 'documentation', daysInStage: 2, lvr: 68, bdm: 'Sarah Johnson' }
  ];

  const commissionDue = [
    { dealId: 'APP-2024-089', borrower: 'ABC Enterprises', upfront: 12500, trail: 450, status: 'due', settleDate: '2024-02-16' },
    { dealId: 'APP-2024-087', borrower: 'XYZ Properties', upfront: 18700, trail: 680, status: 'due', settleDate: '2024-02-19' },
    { dealId: 'APP-2024-092', borrower: 'Tech Ventures', upfront: 9800, trail: 320, status: 'paid', settleDate: '2024-02-10' }
  ];

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: JSX.Element } = {
      'submitted': <span className="px-2 py-0.5 bg-blue-500/15 text-blue-300 text-xs font-semibold rounded">SUBMITTED</span>,
      'credit_review': <span className="px-2 py-0.5 bg-purple-500/15 text-purple-300 text-xs font-semibold rounded">CREDIT REVIEW</span>,
      'conditional': <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 text-xs font-semibold rounded">CONDITIONAL</span>,
      'documentation': <span className="px-2 py-0.5 bg-green-500/15 text-green-300 text-xs font-semibold rounded">DOCUMENTATION</span>,
      'approved': <span className="px-2 py-0.5 bg-indigo-500/15 text-indigo-300 text-xs font-semibold rounded">APPROVED</span>,
      'due': <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 text-xs font-semibold rounded">DUE</span>,
      'paid': <span className="px-2 py-0.5 bg-green-500/15 text-green-300 text-xs font-semibold rounded">PAID</span>
    };
    return badges[status] || <span className="px-2 py-0.5 bg-white/5 text-slate-300 text-xs font-semibold rounded">{status}</span>;
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
    <div className="min-h-screen bg-white/5">
      {/* Header */}
      <div className="bg-white border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Broker Portal</h1>
            <p className="text-sm text-slate-300">Business lending platform - Multi-tenant origination & servicing</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-white/10 rounded text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => onNavigate?.('broker-new-application')}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Application
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate?.('broker-pipeline')}
            className="bg-white border border-white/10 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100">{stats.activePipeline}</div>
            <div className="text-xs text-slate-300">Active Pipeline</div>
            <div className="text-xs text-blue-400 font-semibold mt-1">{formatCurrency(stats.pipelineValue)}</div>
          </button>

          <button
            onClick={() => onNavigate?.('broker-pipeline')}
            className="bg-white border border-white/10 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100">{stats.submittedApplications}</div>
            <div className="text-xs text-slate-300">Submitted</div>
            <div className="text-xs text-purple-400 font-semibold mt-1">{stats.conditionalApprovals} conditional</div>
          </button>

          <button
            onClick={() => onNavigate?.('broker-commission')}
            className="bg-white border border-white/10 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100">{formatCurrency(stats.upfrontCommission)}</div>
            <div className="text-xs text-slate-300">Upfront Commission</div>
            <div className="text-xs text-green-400 font-semibold mt-1">+{formatCurrency(stats.trailCommission)} trail</div>
          </button>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5" />
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold">{stats.settledThisMonth}</div>
            <div className="text-xs opacity-90">Settled This Month</div>
            <div className="text-xs font-semibold mt-1">{stats.conversionRate}% conversion</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-white/10 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-100">Average Deal Size</h3>
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-1">{formatCurrency(stats.pipelineValue / stats.activePipeline)}</div>
            <div className="text-xs text-slate-300">Across {stats.activePipeline} active deals</div>
          </div>

          <div className="bg-white border border-white/10 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-100">Avg Processing Time</h3>
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-1">18 days</div>
            <div className="text-xs text-slate-300">From submission to settlement</div>
          </div>

          <div className="bg-white border border-white/10 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-100">Approval Rate</h3>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">87%</div>
            <div className="text-xs text-slate-300">Last 90 days</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Pipeline */}
          <div className="border border-white/10 rounded bg-white">
            <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-slate-100">Active Pipeline</h3>
              <Button variant="outline" size="sm" onClick={() => onNavigate?.('broker-pipeline')}>
                View All
              </Button>
            </div>
            <div className="p-4 space-y-3">
              {pipelineDeals.map((deal) => (
                <div 
                  key={deal.id}
                  onClick={() => onNavigate?.('broker-deal-view')}
                  className="flex items-center justify-between p-3 bg-white/5 rounded hover:bg-blue-500/10 cursor-pointer border border-white/10"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-100">{deal.borrower}</span>
                      {getStatusBadge(deal.status)}
                    </div>
                    <div className="text-xs text-slate-300">{deal.type} • {formatCurrency(deal.amount)} • LVR {deal.lvr}%</div>
                    <div className="text-xs text-slate-400 mt-1">{deal.id} • {deal.daysInStage} days in stage • {deal.bdm}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Commission Summary */}
          <div className="border border-white/10 rounded bg-white">
            <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-slate-100">Commission Due</h3>
              <Button variant="outline" size="sm" onClick={() => onNavigate?.('broker-commission')}>
                View Report
              </Button>
            </div>
            <div className="p-4 space-y-3">
              {commissionDue.map((comm) => (
                <div key={comm.dealId} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-100">{comm.borrower}</span>
                      {getStatusBadge(comm.status)}
                    </div>
                    <div className="text-xs text-slate-300">Upfront: {formatCurrency(comm.upfront)} • Trail: {formatCurrency(comm.trail)}/mo</div>
                    <div className="text-xs text-slate-400 mt-1">{comm.dealId} • Settled: {comm.settleDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-400">{formatCurrency(comm.upfront + comm.trail)}</div>
                    <div className="text-xs text-slate-400">total</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate?.('broker-new-application')}
            className="bg-white border border-white/10 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <Plus className="w-8 h-8 text-blue-400 mb-2" />
            <div className="font-semibold text-slate-100 text-sm">New Application</div>
            <div className="text-xs text-slate-300 mt-1">Start new deal</div>
          </button>

          <button
            onClick={() => onNavigate?.('broker-calculator')}
            className="bg-white border border-white/10 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <DollarSign className="w-8 h-8 text-purple-400 mb-2" />
            <div className="font-semibold text-slate-100 text-sm">Serviceability</div>
            <div className="text-xs text-slate-300 mt-1">Calculate capacity</div>
          </button>

          <button
            onClick={() => onNavigate?.('broker-documents')}
            className="bg-white border border-white/10 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <FileText className="w-8 h-8 text-green-400 mb-2" />
            <div className="font-semibold text-slate-100 text-sm">Documents</div>
            <div className="text-xs text-slate-300 mt-1">Upload & manage</div>
          </button>

          <button
            onClick={() => onNavigate?.('broker-status-tracker')}
            className="bg-white border border-white/10 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <Clock className="w-8 h-8 text-indigo-400 mb-2" />
            <div className="font-semibold text-slate-100 text-sm">Status Tracker</div>
            <div className="text-xs text-slate-300 mt-1">Track applications</div>
          </button>
        </div>
      </div>
    </div>
  );
}

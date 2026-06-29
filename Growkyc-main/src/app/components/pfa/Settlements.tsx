import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  Calendar,
  FileText,
  DollarSign,
  AlertTriangle,
  Download,
  ExternalLink,
  Building2,
  ArrowRight
} from 'lucide-react';

interface SettlementsProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
  onSwitchModule?: (module: string) => void;
}

interface Settlement {
  id: string;
  borrower: string;
  loanType: string;
  amount: number;
  settlementDate: string;
  status: 'pending' | 'scheduled' | 'completed' | 'failed';
  solicitor: string;
  broker: string;
  drawdownAccount: string;
}

export function Settlements({ onNavigate, onBack, onSwitchModule }: SettlementsProps) {
  const settlements: Settlement[] = [
    {
      id: 'LN-2024-089',
      borrower: 'Tech Solutions Pty Ltd',
      loanType: 'SME Term Loan',
      amount: 850000,
      settlementDate: '2024-02-20',
      status: 'scheduled',
      solicitor: 'Smith & Partners Legal',
      broker: 'John Smith',
      drawdownAccount: 'BSB 123-456 Acc 98765432'
    },
    {
      id: 'LN-2024-088',
      borrower: 'Retail Holdings Trust',
      loanType: 'Private Lending',
      amount: 1800000,
      settlementDate: '2024-02-18',
      status: 'scheduled',
      solicitor: 'Legal Corp Pty Ltd',
      broker: 'Sarah Johnson',
      drawdownAccount: 'BSB 234-567 Acc 11223344'
    },
    {
      id: 'LN-2024-087',
      borrower: 'Property Investors Group',
      loanType: 'Commercial Mortgage',
      amount: 2400000,
      settlementDate: '2024-02-14',
      status: 'completed',
      solicitor: 'Commercial Law Associates',
      broker: 'Sarah Johnson',
      drawdownAccount: 'BSB 345-678 Acc 55667788'
    },
    {
      id: 'LN-2024-086',
      borrower: 'Manufacturing Co',
      loanType: 'Asset Finance',
      amount: 450000,
      settlementDate: '2024-02-25',
      status: 'pending',
      solicitor: 'Business Legal Services',
      broker: 'John Smith',
      drawdownAccount: 'BSB 456-789 Acc 99887766'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: JSX.Element } = {
      'pending': <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">PENDING</span>,
      'scheduled': <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">SCHEDULED</span>,
      'completed': <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">COMPLETED</span>,
      'failed': <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">FAILED</span>
    };
    return badges[status];
  };

  const stats = {
    pendingValue: settlements.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.amount, 0),
    scheduledValue: settlements.filter(s => s.status === 'scheduled').reduce((sum, s) => sum + s.amount, 0),
    completedThisMonth: settlements.filter(s => s.status === 'completed').length,
    totalValue: settlements.reduce((sum, s) => sum + s.amount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Settlements</h1>
              <p className="text-xs text-gray-600">Manage loan settlements and drawdowns</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Settlement
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-amber-50 rounded p-3 border border-amber-200">
            <div className="text-xs text-amber-700">Pending</div>
            <div className="text-lg font-bold text-amber-700">{formatCurrency(stats.pendingValue)}</div>
          </div>
          <div className="bg-blue-50 rounded p-3 border border-blue-200">
            <div className="text-xs text-blue-700">Scheduled</div>
            <div className="text-lg font-bold text-blue-700">{formatCurrency(stats.scheduledValue)}</div>
          </div>
          <div className="bg-green-50 rounded p-3 border border-green-200">
            <div className="text-xs text-green-700">Completed This Month</div>
            <div className="text-lg font-bold text-green-700">{stats.completedThisMonth}</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded p-3">
            <div className="text-xs opacity-90">Total Pipeline</div>
            <div className="text-lg font-bold">{formatCurrency(stats.totalValue)}</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Full Settlement Portal Banner */}
        {onSwitchModule && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Full Settlement Portal Available</h3>
                  <p className="text-purple-100 mb-2">
                    Access the complete settlement management system with PEXA integration, matter management, conditions tracking, and legal workflows
                  </p>
                  <ul className="text-sm text-purple-100 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Matter & task management
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      PEXA workspace integration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Conditions checklist & tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Document management & reports
                    </li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => onSwitchModule('grow_settlement')}
                className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-bold text-lg whitespace-nowrap"
              >
                Launch Settlement Portal
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search settlements..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded text-sm">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Settlements Table */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Loan ID</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Borrower</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Loan Type</th>
                <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Amount</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Settlement Date</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Solicitor</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Status</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((settlement) => (
                <tr key={settlement.id} className="hover:bg-green-50">
                  <td className="border border-gray-300 px-3 py-2 text-gray-900 font-mono font-semibold">
                    {settlement.id}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <div className="font-semibold text-gray-900">{settlement.borrower}</div>
                    <div className="text-xs text-gray-600">Broker: {settlement.broker}</div>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-700">
                    {settlement.loanType}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900 font-semibold">
                    {formatCurrency(settlement.amount)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-900">
                    {settlement.settlementDate}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    <div className="text-gray-900">{settlement.solicitor}</div>
                    <div className="text-xs text-gray-600 font-mono">{settlement.drawdownAccount}</div>
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    {getStatusBadge(settlement.status)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded font-semibold">
                        <FileText className="w-3 h-3 inline mr-1" />
                        Docs
                      </button>
                      {settlement.status === 'scheduled' && (
                        <button className="px-2 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded font-semibold">
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Settlement Checklist */}
        <div className="bg-white border border-gray-300 rounded p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Settlement Checklist</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Credit approval obtained</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Loan documents executed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Security registered</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Insurance confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Valuation completed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Drawdown instructions confirmed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
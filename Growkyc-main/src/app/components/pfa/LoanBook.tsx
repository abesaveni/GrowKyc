import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Search,
  Filter,
  Building2,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download
} from 'lucide-react';

interface LoanBookProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

interface Loan {
  id: string;
  borrower: string;
  product: string;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  nextPayment: string;
  nextPaymentAmount: number;
  status: 'current' | 'arrears' | 'default';
  daysOverdue: number;
}

export function LoanBook({ onNavigate, onBack }: LoanBookProps) {
  const loans: Loan[] = [
    {
      id: 'LN-2024-089',
      borrower: 'Tech Solutions Pty Ltd',
      product: 'SME Term Loan',
      originalAmount: 850000,
      currentBalance: 782450,
      interestRate: 8.5,
      nextPayment: '2024-03-01',
      nextPaymentAmount: 28450,
      status: 'current',
      daysOverdue: 0
    },
    {
      id: 'LN-2024-088',
      borrower: 'Retail Holdings Trust',
      product: 'Private Lending',
      originalAmount: 1800000,
      currentBalance: 1750000,
      interestRate: 12.5,
      nextPayment: '2024-03-05',
      nextPaymentAmount: 18000,
      status: 'current',
      daysOverdue: 0
    },
    {
      id: 'LN-2024-075',
      borrower: 'Property Investors Group',
      product: 'Commercial Mortgage',
      originalAmount: 2400000,
      currentBalance: 2350000,
      interestRate: 7.8,
      nextPayment: '2024-02-15',
      nextPaymentAmount: 15300,
      status: 'arrears',
      daysOverdue: 15
    },
    {
      id: 'LN-2024-063',
      borrower: 'Manufacturing Co Ltd',
      product: 'Asset Finance',
      originalAmount: 450000,
      currentBalance: 395000,
      interestRate: 9.2,
      nextPayment: '2024-01-20',
      nextPaymentAmount: 3800,
      status: 'arrears',
      daysOverdue: 42
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
      'current': <span className="px-2 py-0.5 bg-green-500/15 text-green-300 text-xs font-semibold rounded">CURRENT</span>,
      'arrears': <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 text-xs font-semibold rounded">ARREARS</span>,
      'default': <span className="px-2 py-0.5 bg-red-500/15 text-red-300 text-xs font-semibold rounded">DEFAULT</span>
    };
    return badges[status];
  };

  const stats = {
    totalLoans: loans.length,
    totalBalance: loans.reduce((sum, l) => sum + l.currentBalance, 0),
    currentLoans: loans.filter(l => l.status === 'current').length,
    arrearsLoans: loans.filter(l => l.status === 'arrears' || l.status === 'default').length,
    weightedAvgRate: 
      loans.reduce((sum, l) => sum + (l.interestRate * l.currentBalance), 0) / 
      loans.reduce((sum, l) => sum + l.currentBalance, 0)
  };

  return (
    <div className="min-h-screen bg-white/5">
      {/* Header */}
      <div className="bg-white border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Building2 className="w-6 h-6 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-slate-100">Loan Book</h1>
              <p className="text-xs text-slate-300">Active loan portfolio and performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-5 gap-3">
          <div className="bg-blue-500/10 rounded p-3 border border-blue-500/30">
            <div className="text-xs text-blue-300">Active Loans</div>
            <div className="text-2xl font-bold text-blue-300">{stats.totalLoans}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded p-3">
            <div className="text-xs opacity-90">Total Balance</div>
            <div className="text-lg font-bold">{formatCurrency(stats.totalBalance)}</div>
          </div>
          <div className="bg-green-500/10 rounded p-3 border border-green-500/30">
            <div className="text-xs text-green-300">Current Loans</div>
            <div className="text-2xl font-bold text-green-300">{stats.currentLoans}</div>
          </div>
          <div className="bg-amber-500/10 rounded p-3 border border-amber-500/30">
            <div className="text-xs text-amber-300">In Arrears</div>
            <div className="text-2xl font-bold text-amber-300">{stats.arrearsLoans}</div>
          </div>
          <div className="bg-purple-500/10 rounded p-3 border border-purple-500/30">
            <div className="text-xs text-purple-300">Avg Rate</div>
            <div className="text-2xl font-bold text-purple-300">{stats.weightedAvgRate.toFixed(2)}%</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by borrower, loan ID..."
              className="w-full pl-10 pr-4 py-2 border border-white/10 rounded text-sm"
            />
          </div>
          <select className="px-3 py-2 border border-white/10 rounded text-sm">
            <option value="all">All Status</option>
            <option value="current">Current</option>
            <option value="arrears">Arrears</option>
            <option value="default">Default</option>
          </select>
          <select className="px-3 py-2 border border-white/10 rounded text-sm">
            <option value="all">All Products</option>
            <option value="mortgage">Commercial Mortgage</option>
            <option value="private">Private Lending</option>
            <option value="sme">SME Term Loan</option>
            <option value="asset">Asset Finance</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Loan Book Table */}
        <div className="border border-white/10 rounded bg-white overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Loan ID</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Borrower</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Product</th>
                <th className="border border-white/10 px-3 py-2 text-right font-semibold text-slate-300">Original</th>
                <th className="border border-white/10 px-3 py-2 text-right font-semibold text-slate-300">Current Balance</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Rate</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Next Payment</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Status</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-blue-500/10">
                  <td className="border border-white/10 px-3 py-2 text-slate-100 font-mono font-semibold">
                    {loan.id}
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <div className="font-semibold text-slate-100">{loan.borrower}</div>
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300">
                    {loan.product}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-300">
                    {formatCurrency(loan.originalAmount)}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-100 font-semibold">
                    {formatCurrency(loan.currentBalance)}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center font-semibold text-purple-300">
                    {loan.interestRate}%
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <div className="text-slate-100">{loan.nextPayment}</div>
                    <div className="text-xs text-slate-300 font-mono">{formatCurrency(loan.nextPaymentAmount)}</div>
                    {loan.daysOverdue > 0 && (
                      <div className="text-xs text-red-400 font-semibold mt-1">
                        {loan.daysOverdue} days overdue
                      </div>
                    )}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    {getStatusBadge(loan.status)}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <button 
                        onClick={() => onNavigate?.('lender-loan-ledger')}
                        className="px-2 py-1 text-xs bg-blue-500/15 text-blue-300 hover:bg-blue-500/20 rounded font-semibold"
                      >
                        <Eye className="w-3 h-3 inline mr-1" />
                        View
                      </button>
                      {loan.status === 'arrears' && (
                        <button 
                          onClick={() => onNavigate?.('lender-arrears')}
                          className="px-2 py-1 text-xs bg-red-500/15 text-red-300 hover:bg-red-500/20 rounded font-semibold"
                        >
                          <AlertTriangle className="w-3 h-3 inline mr-1" />
                          Arrears
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Portfolio Quality Indicators */}
        <div className="bg-white border border-white/10 rounded p-4">
          <h3 className="font-semibold text-slate-100 mb-3">Portfolio Quality Indicators</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
              <div className="text-xs text-green-300 mb-1">Current Rate</div>
              <div className="text-2xl font-bold text-green-300">
                {((stats.currentLoans / stats.totalLoans) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded p-3">
              <div className="text-xs text-amber-300 mb-1">Arrears Rate</div>
              <div className="text-2xl font-bold text-amber-300">
                {((stats.arrearsLoans / stats.totalLoans) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3">
              <div className="text-xs text-blue-300 mb-1">Avg LVR</div>
              <div className="text-2xl font-bold text-blue-300">65.2%</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded p-3">
              <div className="text-xs text-purple-300 mb-1">Avg DSCR</div>
              <div className="text-2xl font-bold text-purple-300">1.42x</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

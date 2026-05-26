import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  DollarSign,
  FileText,
  Clock,
  Calculator,
  Download,
  Send,
  Eye,
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';

interface LoanLedgerProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

interface Transaction {
  date: string;
  type: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  status: string;
}

export function LoanLedger({ onNavigate, onBack }: LoanLedgerProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'transactions' | 'schedule' | 'fees'>('overview');

  const loanDetails = {
    loanId: 'LN-2024-089',
    borrower: 'Tech Solutions Pty Ltd',
    product: 'SME Term Loan',
    originalAmount: 850000,
    currentBalance: 782450,
    interestRate: 8.5,
    term: 36,
    remainingMonths: 28,
    repaymentType: 'Principal & Interest',
    frequency: 'Monthly',
    nextPaymentDate: '2024-03-01',
    nextPaymentAmount: 28450,
    settlementDate: '2024-01-15',
    maturityDate: '2027-01-15',
    status: 'current',
    daysOverdue: 0
  };

  const transactions: Transaction[] = [
    { date: '2024-02-01', type: 'Repayment', description: 'Monthly repayment - Direct Debit', debit: 0, credit: 28450, balance: 782450, status: 'cleared' },
    { date: '2024-02-01', type: 'Interest', description: 'Interest accrued for February', debit: 5520, credit: 0, balance: 810900, status: 'posted' },
    { date: '2024-01-25', type: 'Fee', description: 'Valuation report fee', debit: 850, credit: 0, balance: 805380, status: 'posted' },
    { date: '2024-01-15', type: 'Disbursement', description: 'Loan settlement disbursement', debit: 850000, credit: 0, balance: 850000, status: 'cleared' },
    { date: '2024-01-15', type: 'Fee', description: 'Establishment fee', debit: 4250, credit: 0, balance: 0, status: 'cleared' }
  ];

  const repaymentSchedule = [
    { period: 1, date: '2024-02-01', principal: 22930, interest: 5520, total: 28450, balance: 827070, status: 'paid' },
    { period: 2, date: '2024-03-01', principal: 23092, interest: 5358, total: 28450, balance: 803978, status: 'due' },
    { period: 3, date: '2024-04-01', principal: 23255, interest: 5195, total: 28450, balance: 780723, status: 'scheduled' },
    { period: 4, date: '2024-05-01', principal: 23419, interest: 5031, total: 28450, balance: 757304, status: 'scheduled' },
    { period: 5, date: '2024-06-01', principal: 23585, interest: 4865, total: 28450, balance: 733719, status: 'scheduled' }
  ];

  const feeSchedule = [
    { name: 'Establishment Fee', amount: 4250, type: 'One-off', status: 'Paid', date: '2024-01-15' },
    { name: 'Monthly Service Fee', amount: 95, type: 'Recurring', status: 'Active', date: 'Monthly' },
    { name: 'Valuation Fee', amount: 850, type: 'One-off', status: 'Paid', date: '2024-01-25' },
    { name: 'Annual Review Fee', amount: 500, type: 'Annual', status: 'Scheduled', date: '2025-01-15' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: JSX.Element } = {
      'current': <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">CURRENT</span>,
      'paid': <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">PAID</span>,
      'due': <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">DUE</span>,
      'overdue': <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">OVERDUE</span>,
      'scheduled': <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">SCHEDULED</span>,
      'cleared': <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">CLEARED</span>,
      'posted': <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">POSTED</span>
    };
    return badges[status] || <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">{status.toUpperCase()}</span>;
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
            <DollarSign className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Loan Ledger - {loanDetails.loanId}</h1>
              <p className="text-xs text-gray-600">{loanDetails.borrower} • {loanDetails.product}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calculator className="w-4 h-4 mr-2" />
              Payout Quote
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Statement
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Loan Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="bg-gray-50 rounded p-3 border border-gray-200">
            <div className="text-xs text-gray-600">Current Balance</div>
            <div className="text-lg font-bold text-gray-900">{formatCurrency(loanDetails.currentBalance)}</div>
          </div>
          <div className="bg-blue-50 rounded p-3 border border-blue-200">
            <div className="text-xs text-blue-700">Interest Rate</div>
            <div className="text-lg font-bold text-blue-700">{formatPercent(loanDetails.interestRate)}</div>
          </div>
          <div className="bg-green-50 rounded p-3 border border-green-200">
            <div className="text-xs text-green-700">Next Payment</div>
            <div className="text-lg font-bold text-green-700">{formatCurrency(loanDetails.nextPaymentAmount)}</div>
            <div className="text-xs text-green-600 mt-0.5">{loanDetails.nextPaymentDate}</div>
          </div>
          <div className="bg-purple-50 rounded p-3 border border-purple-200">
            <div className="text-xs text-purple-700">Remaining Term</div>
            <div className="text-lg font-bold text-purple-700">{loanDetails.remainingMonths} months</div>
          </div>
          <div className="bg-amber-50 rounded p-3 border border-amber-200">
            <div className="text-xs text-amber-700">Maturity Date</div>
            <div className="text-lg font-bold text-amber-700">{loanDetails.maturityDate}</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded p-3">
            <div className="text-xs opacity-90">Status</div>
            <div className="text-lg font-bold">CURRENT</div>
            <div className="text-xs opacity-90">{loanDetails.daysOverdue} days overdue</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white border border-gray-300 rounded">
          <div className="flex border-b border-gray-300">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`px-6 py-3 text-sm font-semibold transition-colors ${
                selectedTab === 'overview'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab('transactions')}
              className={`px-6 py-3 text-sm font-semibold transition-colors ${
                selectedTab === 'transactions'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setSelectedTab('schedule')}
              className={`px-6 py-3 text-sm font-semibold transition-colors ${
                selectedTab === 'schedule'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Repayment Schedule
            </button>
            <button
              onClick={() => setSelectedTab('fees')}
              className={`px-6 py-3 text-sm font-semibold transition-colors ${
                selectedTab === 'fees'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Fees
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Loan Details */}
                  <div className="bg-gray-50 border border-gray-200 rounded p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Loan Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Original Amount:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(loanDetails.originalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Balance:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(loanDetails.currentBalance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="font-semibold text-gray-900">{formatPercent(loanDetails.interestRate)} p.a.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Repayment Type:</span>
                        <span className="font-semibold text-gray-900">{loanDetails.repaymentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frequency:</span>
                        <span className="font-semibold text-gray-900">{loanDetails.frequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Settlement Date:</span>
                        <span className="font-semibold text-gray-900">{loanDetails.settlementDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Maturity Date:</span>
                        <span className="font-semibold text-gray-900">{loanDetails.maturityDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-gray-50 border border-gray-200 rounded p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Payment Due:</span>
                        <span className="font-semibold text-gray-900">{loanDetails.nextPaymentDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Payment Amount:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(loanDetails.nextPaymentAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining Payments:</span>
                        <span className="font-semibold text-gray-900">{loanDetails.remainingMonths}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                        <span className="text-gray-600">Total Interest (Est):</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(175000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Fees (Est):</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(8950)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                        <span className="text-gray-600">Total Payable:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(1033950)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">Loan Progress</span>
                    <span className="text-sm text-gray-600">{((loanDetails.originalAmount - loanDetails.currentBalance) / loanDetails.originalAmount * 100).toFixed(1)}% paid down</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-600 h-4 rounded-full transition-all"
                      style={{ width: `${((loanDetails.originalAmount - loanDetails.currentBalance) / loanDetails.originalAmount * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <span>Paid: {formatCurrency(loanDetails.originalAmount - loanDetails.currentBalance)}</span>
                    <span>Remaining: {formatCurrency(loanDetails.currentBalance)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {selectedTab === 'transactions' && (
              <div className="border border-gray-300 rounded overflow-hidden">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Date</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Type</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Description</th>
                      <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Debit</th>
                      <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Credit</th>
                      <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Balance</th>
                      <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn, idx) => (
                      <tr key={idx} className="hover:bg-blue-50">
                        <td className="border border-gray-300 px-3 py-2 text-gray-900">{txn.date}</td>
                        <td className="border border-gray-300 px-3 py-2 text-gray-900 font-medium">{txn.type}</td>
                        <td className="border border-gray-300 px-3 py-2 text-gray-700">{txn.description}</td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-red-600 font-mono">
                          {txn.debit > 0 ? formatCurrency(txn.debit) : '—'}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right text-green-600 font-mono">
                          {txn.credit > 0 ? formatCurrency(txn.credit) : '—'}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right font-mono font-semibold text-gray-900">
                          {formatCurrency(txn.balance)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center">
                          {getStatusBadge(txn.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Repayment Schedule Tab */}
            {selectedTab === 'schedule' && (
              <div className="border border-gray-300 rounded overflow-hidden">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">#</th>
                      <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Date</th>
                      <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Principal</th>
                      <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Interest</th>
                      <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Total Payment</th>
                      <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Balance</th>
                      <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repaymentSchedule.map((payment) => (
                      <tr key={payment.period} className="hover:bg-blue-50">
                        <td className="border border-gray-300 px-3 py-2 text-center text-gray-900 font-medium">{payment.period}</td>
                        <td className="border border-gray-300 px-3 py-2 text-gray-900">{payment.date}</td>
                        <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                          {formatCurrency(payment.principal)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                          {formatCurrency(payment.interest)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right font-mono font-semibold text-gray-900">
                          {formatCurrency(payment.total)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                          {formatCurrency(payment.balance)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center">
                          {getStatusBadge(payment.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Fees Tab */}
            {selectedTab === 'fees' && (
              <div className="space-y-4">
                <div className="border border-gray-300 rounded overflow-hidden">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Fee Name</th>
                        <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Amount</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Type</th>
                        <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Status</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeSchedule.map((fee, idx) => (
                        <tr key={idx} className="hover:bg-blue-50">
                          <td className="border border-gray-300 px-3 py-2 text-gray-900 font-medium">{fee.name}</td>
                          <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                            {formatCurrency(fee.amount)}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700">{fee.type}</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              fee.status === 'Paid' ? 'bg-green-100 text-green-700' :
                              fee.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {fee.status}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-gray-700">{fee.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Manual Fee
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white border border-gray-300 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all text-left">
            <Calculator className="w-6 h-6 text-blue-600 mb-2" />
            <div className="font-semibold text-gray-900 text-sm">Payout Quote</div>
            <div className="text-xs text-gray-600 mt-1">Calculate early payout</div>
          </button>

          <button className="bg-white border border-gray-300 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all text-left">
            <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
            <div className="font-semibold text-gray-900 text-sm">Rate Change</div>
            <div className="text-xs text-gray-600 mt-1">Update interest rate</div>
          </button>

          <button className="bg-white border border-gray-300 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all text-left">
            <Calendar className="w-6 h-6 text-green-600 mb-2" />
            <div className="font-semibold text-gray-900 text-sm">Payment Hold</div>
            <div className="text-xs text-gray-600 mt-1">Pause repayments</div>
          </button>

          <button className="bg-white border border-gray-300 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all text-left">
            <Send className="w-6 h-6 text-indigo-600 mb-2" />
            <div className="font-semibold text-gray-900 text-sm">Send Statement</div>
            <div className="text-xs text-gray-600 mt-1">Email to borrower</div>
          </button>
        </div>
      </div>
    </div>
  );
}

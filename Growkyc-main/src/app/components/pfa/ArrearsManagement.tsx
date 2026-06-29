import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  AlertTriangle,
  DollarSign,
  Clock,
  Phone,
  Mail,
  FileText,
  Scale,
  User,
  TrendingDown,
  AlertCircle,
  Eye,
  Send,
  Plus
} from 'lucide-react';

interface ArrearsManagementProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

interface ArrearsLoan {
  loanId: string;
  borrower: string;
  product: string;
  balance: number;
  overdueAmount: number;
  daysOverdue: number;
  arrearsBucket: '1-30' | '31-60' | '61-90' | '90+';
  nextAction: string;
  nextActionDate: string;
  assignedTo: string;
  riskScore: number;
  lastContact: string;
  promiseToPay?: string;
  status: 'contact' | 'followup' | 'demand' | 'legal' | 'workout';
}

export function ArrearsManagement({ onNavigate, onBack }: ArrearsManagementProps) {
  const [selectedBucket, setSelectedBucket] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const arrearsLoans: ArrearsLoan[] = [
    {
      loanId: 'LN-2024-075',
      borrower: 'Retail Co Pty Ltd',
      product: 'Commercial Mortgage',
      balance: 1250000,
      overdueAmount: 32500,
      daysOverdue: 15,
      arrearsBucket: '1-30',
      nextAction: 'Phone call reminder',
      nextActionDate: '2024-02-15',
      assignedTo: 'Sarah Johnson',
      riskScore: 45,
      lastContact: '2024-02-12',
      status: 'contact'
    },
    {
      loanId: 'LN-2024-063',
      borrower: 'Manufacturing Ltd',
      product: 'SME Term Loan',
      balance: 680000,
      overdueAmount: 54200,
      daysOverdue: 42,
      arrearsBucket: '31-60',
      nextAction: 'Formal demand letter',
      nextActionDate: '2024-02-16',
      assignedTo: 'John Smith',
      riskScore: 68,
      lastContact: '2024-02-10',
      promiseToPay: '2024-02-20',
      status: 'followup'
    },
    {
      loanId: 'LN-2024-058',
      borrower: 'Property Ventures Pty Ltd',
      product: 'Private Lending',
      balance: 2100000,
      overdueAmount: 156000,
      daysOverdue: 78,
      arrearsBucket: '61-90',
      nextAction: 'Default notice',
      nextActionDate: '2024-02-17',
      assignedTo: 'Sarah Johnson',
      riskScore: 85,
      lastContact: '2024-02-08',
      status: 'demand'
    },
    {
      loanId: 'LN-2024-042',
      borrower: 'Construction Group Ltd',
      product: 'Asset Finance',
      balance: 950000,
      overdueAmount: 285000,
      daysOverdue: 125,
      arrearsBucket: '90+',
      nextAction: 'Legal referral',
      nextActionDate: '2024-02-18',
      assignedTo: 'John Smith',
      riskScore: 95,
      lastContact: '2024-01-28',
      status: 'legal'
    }
  ];

  const stats = {
    totalArrears: arrearsLoans.length,
    totalOverdueAmount: arrearsLoans.reduce((sum, loan) => sum + loan.overdueAmount, 0),
    bucket1_30: arrearsLoans.filter(l => l.arrearsBucket === '1-30').length,
    bucket31_60: arrearsLoans.filter(l => l.arrearsBucket === '31-60').length,
    bucket61_90: arrearsLoans.filter(l => l.arrearsBucket === '61-90').length,
    bucket90plus: arrearsLoans.filter(l => l.arrearsBucket === '90+').length,
    averageRiskScore: Math.round(arrearsLoans.reduce((sum, loan) => sum + loan.riskScore, 0) / arrearsLoans.length)
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getBucketBadge = (bucket: string) => {
    const badges: { [key: string]: JSX.Element } = {
      '1-30': <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 text-xs font-semibold rounded">1-30 DAYS</span>,
      '31-60': <span className="px-2 py-0.5 bg-orange-500/15 text-orange-300 text-xs font-semibold rounded">31-60 DAYS</span>,
      '61-90': <span className="px-2 py-0.5 bg-red-500/15 text-red-300 text-xs font-semibold rounded">61-90 DAYS</span>,
      '90+': <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-semibold rounded">90+ DAYS</span>
    };
    return badges[bucket];
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: JSX.Element } = {
      'contact': <span className="px-2 py-0.5 bg-blue-500/15 text-blue-300 text-xs font-semibold rounded">CONTACT</span>,
      'followup': <span className="px-2 py-0.5 bg-purple-500/15 text-purple-300 text-xs font-semibold rounded">FOLLOW-UP</span>,
      'demand': <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 text-xs font-semibold rounded">DEMAND</span>,
      'legal': <span className="px-2 py-0.5 bg-red-500/15 text-red-300 text-xs font-semibold rounded">LEGAL</span>,
      'workout': <span className="px-2 py-0.5 bg-green-500/15 text-green-300 text-xs font-semibold rounded">WORKOUT</span>
    };
    return badges[status];
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-orange-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-green-400';
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
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <h1 className="text-xl font-bold text-slate-100">Arrears & Enforcement</h1>
              <p className="text-xs text-slate-300">Automated escalation workflows & collection management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4 mr-2" />
              Batch SMS
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="bg-white/5 rounded p-3 border border-white/10">
            <div className="text-xs text-slate-300">Total Arrears</div>
            <div className="text-2xl font-bold text-slate-100">{stats.totalArrears}</div>
          </div>
          <div className="bg-amber-500/10 rounded p-3 border border-amber-500/30">
            <div className="text-xs text-amber-300">1-30 Days</div>
            <div className="text-2xl font-bold text-amber-300">{stats.bucket1_30}</div>
          </div>
          <div className="bg-orange-500/10 rounded p-3 border border-orange-500/30">
            <div className="text-xs text-orange-300">31-60 Days</div>
            <div className="text-2xl font-bold text-orange-300">{stats.bucket31_60}</div>
          </div>
          <div className="bg-red-500/10 rounded p-3 border border-red-500/30">
            <div className="text-xs text-red-300">61-90 Days</div>
            <div className="text-2xl font-bold text-red-300">{stats.bucket61_90}</div>
          </div>
          <div className="bg-red-600 text-white rounded p-3">
            <div className="text-xs opacity-90">90+ Days</div>
            <div className="text-2xl font-bold">{stats.bucket90plus}</div>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded p-3">
            <div className="text-xs opacity-90">Total Overdue</div>
            <div className="text-lg font-bold">{formatCurrency(stats.totalOverdueAmount)}</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={selectedBucket}
            onChange={(e) => setSelectedBucket(e.target.value)}
            className="px-3 py-2 border border-white/10 rounded text-sm"
          >
            <option value="all">All Buckets</option>
            <option value="1-30">1-30 Days</option>
            <option value="31-60">31-60 Days</option>
            <option value="61-90">61-90 Days</option>
            <option value="90+">90+ Days</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-white/10 rounded text-sm"
          >
            <option value="all">All Status</option>
            <option value="contact">Contact</option>
            <option value="followup">Follow-up</option>
            <option value="demand">Demand</option>
            <option value="legal">Legal</option>
            <option value="workout">Workout</option>
          </select>
          <select className="px-3 py-2 border border-white/10 rounded text-sm">
            <option value="all">All Assigned</option>
            <option value="sarah">Sarah Johnson</option>
            <option value="john">John Smith</option>
          </select>
        </div>

        {/* Arrears Table */}
        <div className="border border-white/10 rounded bg-white overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Loan ID</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Borrower</th>
                <th className="border border-white/10 px-3 py-2 text-right font-semibold text-slate-300">Overdue</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Days</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Bucket</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Risk</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Status</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Next Action</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {arrearsLoans.map((loan) => (
                <tr key={loan.loanId} className="hover:bg-red-500/10">
                  <td className="border border-white/10 px-3 py-2 text-slate-100 font-mono font-semibold">
                    {loan.loanId}
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <div className="font-semibold text-slate-100">{loan.borrower}</div>
                    <div className="text-xs text-slate-300">{loan.product}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Balance: {formatCurrency(loan.balance)}
                    </div>
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-right font-mono text-red-400 font-semibold">
                    {formatCurrency(loan.overdueAmount)}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    <span className="text-lg font-bold text-red-400">{loan.daysOverdue}</span>
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    {getBucketBadge(loan.arrearsBucket)}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    <div className={`text-2xl font-bold ${getRiskColor(loan.riskScore)}`}>
                      {loan.riskScore}
                    </div>
                    <div className="text-xs text-slate-400">risk score</div>
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    {getStatusBadge(loan.status)}
                  </td>
                  <td className="border border-white/10 px-3 py-2">
                    <div className="text-slate-100 font-medium">{loan.nextAction}</div>
                    <div className="text-xs text-slate-300">Due: {loan.nextActionDate}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Assigned: {loan.assignedTo}
                    </div>
                    {loan.promiseToPay && (
                      <div className="text-xs text-green-400 mt-1 font-semibold">
                        PTP: {loan.promiseToPay}
                      </div>
                    )}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    <div className="flex items-center gap-1 justify-center flex-wrap">
                      <button 
                        onClick={() => onNavigate?.('lender-loan-ledger')}
                        className="px-2 py-1 text-xs bg-blue-500/15 text-blue-300 hover:bg-blue-500/20 rounded font-semibold"
                      >
                        <Eye className="w-3 h-3 inline mr-1" />
                        View
                      </button>
                      <button className="px-2 py-1 text-xs bg-purple-500/15 text-purple-300 hover:bg-purple-500/20 rounded font-semibold">
                        <Phone className="w-3 h-3 inline mr-1" />
                        Call
                      </button>
                      <button className="px-2 py-1 text-xs bg-green-500/15 text-green-300 hover:bg-green-500/20 rounded font-semibold">
                        <Mail className="w-3 h-3 inline mr-1" />
                        Email
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Escalation Matrix */}
        <div className="bg-white border border-white/10 rounded p-4">
          <h3 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-400" />
            Automated Escalation Matrix
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-amber-500/10 rounded p-3 border border-amber-500/30">
              <div className="font-semibold text-amber-300 mb-2">1-30 Days</div>
              <ul className="space-y-1 text-xs text-amber-300">
                <li>• Day 5: SMS reminder</li>
                <li>• Day 10: Phone call</li>
                <li>• Day 15: Email notice</li>
                <li>• Day 25: Final reminder</li>
              </ul>
            </div>
            <div className="bg-orange-500/10 rounded p-3 border border-orange-500/30">
              <div className="font-semibold text-orange-300 mb-2">31-60 Days</div>
              <ul className="space-y-1 text-xs text-orange-300">
                <li>• Day 31: Formal letter</li>
                <li>• Day 40: Senior call</li>
                <li>• Day 50: Demand letter</li>
                <li>• Day 60: Pre-default</li>
              </ul>
            </div>
            <div className="bg-red-500/10 rounded p-3 border border-red-500/30">
              <div className="font-semibold text-red-300 mb-2">61-90 Days</div>
              <ul className="space-y-1 text-xs text-red-300">
                <li>• Day 61: Default notice</li>
                <li>• Day 70: Legal review</li>
                <li>• Day 80: Enforcement prep</li>
                <li>• Day 90: Legal referral</li>
              </ul>
            </div>
            <div className="bg-red-600 text-white rounded p-3">
              <div className="font-semibold mb-2">90+ Days</div>
              <ul className="space-y-1 text-xs opacity-90">
                <li>• Legal proceedings</li>
                <li>• Asset repossession</li>
                <li>• Settlement negotiation</li>
                <li>• Write-off consideration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white border border-white/10 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all text-left">
            <Phone className="w-6 h-6 text-blue-400 mb-2" />
            <div className="font-semibold text-slate-100 text-sm">Call Campaign</div>
            <div className="text-xs text-slate-300 mt-1">Batch call list</div>
          </button>

          <button className="bg-white border border-white/10 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all text-left">
            <Mail className="w-6 h-6 text-purple-400 mb-2" />
            <div className="font-semibold text-slate-100 text-sm">Email Notices</div>
            <div className="text-xs text-slate-300 mt-1">Send batch emails</div>
          </button>

          <button className="bg-white border border-white/10 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all text-left">
            <Scale className="w-6 h-6 text-red-400 mb-2" />
            <div className="font-semibold text-slate-100 text-sm">Legal Referral</div>
            <div className="text-xs text-slate-300 mt-1">Refer to lawyers</div>
          </button>

          <button className="bg-white border border-white/10 rounded p-4 hover:border-blue-400 hover:shadow-md transition-all text-left">
            <TrendingDown className="w-6 h-6 text-green-400 mb-2" />
            <div className="font-semibold text-slate-100 text-sm">Workout Plan</div>
            <div className="text-xs text-slate-300 mt-1">Create repayment plan</div>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-white/10 rounded">
          <div className="bg-white/5 border-b border-white/10 px-4 py-3">
            <h3 className="font-semibold text-slate-100">Recent Activity</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded">
              <Phone className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-slate-100">
                  <span className="font-semibold">Sarah Johnson</span> called Retail Co Pty Ltd
                </div>
                <div className="text-xs text-slate-300 mt-1">Promise to pay by Feb 20 • 2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded">
              <Mail className="w-5 h-5 text-purple-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-slate-100">
                  Formal demand letter sent to <span className="font-semibold">Manufacturing Ltd</span>
                </div>
                <div className="text-xs text-slate-300 mt-1">Via email and registered post • 5 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm text-slate-100">
                  Default notice issued to <span className="font-semibold">Property Ventures Pty Ltd</span>
                </div>
                <div className="text-xs text-slate-300 mt-1">21-day cure period commenced • 1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

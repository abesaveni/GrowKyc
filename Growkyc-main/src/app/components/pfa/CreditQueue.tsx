import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  DollarSign,
  TrendingUp,
  User,
  Building2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle
} from 'lucide-react';

interface CreditQueueProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

interface CreditApplication {
  id: string;
  borrower: string;
  broker: string;
  loanType: string;
  amount: number;
  lvr: number;
  dscr: number;
  creditScore: number;
  riskRating: 'low' | 'medium' | 'high';
  status: 'new' | 'under_review' | 'conditional' | 'approved' | 'declined';
  submittedDate: string;
  daysInQueue: number;
  sla: number;
  autoFlags: string[];
}

export function CreditQueue({ onNavigate, onBack }: CreditQueueProps) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  const applications: CreditApplication[] = [
    {
      id: 'APP-2024-156',
      borrower: 'Tech Solutions Pty Ltd',
      broker: 'John Smith - Premier Finance',
      loanType: 'SME Term Loan',
      amount: 850000,
      lvr: 65,
      dscr: 1.45,
      creditScore: 750,
      riskRating: 'low',
      status: 'new',
      submittedDate: '2024-02-14',
      daysInQueue: 1,
      sla: 3,
      autoFlags: []
    },
    {
      id: 'APP-2024-155',
      borrower: 'Property Investors Group',
      broker: 'Sarah Johnson - Capital Partners',
      loanType: 'Commercial Mortgage',
      amount: 2400000,
      lvr: 72,
      dscr: 1.28,
      creditScore: 680,
      riskRating: 'medium',
      status: 'under_review',
      submittedDate: '2024-02-12',
      daysInQueue: 3,
      sla: 5,
      autoFlags: ['High LVR', 'Low DSCR']
    },
    {
      id: 'APP-2024-154',
      borrower: 'Manufacturing Co Ltd',
      broker: 'John Smith - Premier Finance',
      loanType: 'Asset Finance',
      amount: 450000,
      lvr: 75,
      dscr: 1.15,
      creditScore: 620,
      riskRating: 'high',
      status: 'new',
      submittedDate: '2024-02-13',
      daysInQueue: 2,
      sla: 3,
      autoFlags: ['Low Credit Score', 'Weak DSCR']
    },
    {
      id: 'APP-2024-153',
      borrower: 'Retail Holdings Trust',
      broker: 'Sarah Johnson - Capital Partners',
      loanType: 'Private Lending',
      amount: 1800000,
      lvr: 68,
      dscr: 1.52,
      creditScore: 720,
      riskRating: 'low',
      status: 'conditional',
      submittedDate: '2024-02-10',
      daysInQueue: 5,
      sla: 7,
      autoFlags: []
    }
  ];

  const stats = {
    newApplications: applications.filter(a => a.status === 'new').length,
    underReview: applications.filter(a => a.status === 'under_review').length,
    conditional: applications.filter(a => a.status === 'conditional').length,
    breachingSLA: applications.filter(a => a.daysInQueue > a.sla).length,
    totalPipelineValue: applications.reduce((sum, app) => sum + app.amount, 0)
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: JSX.Element } = {
      'new': <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">NEW</span>,
      'under_review': <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">UNDER REVIEW</span>,
      'conditional': <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">CONDITIONAL</span>,
      'approved': <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">APPROVED</span>,
      'declined': <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">DECLINED</span>
    };
    return badges[status];
  };

  const getRiskBadge = (risk: string) => {
    const badges: { [key: string]: JSX.Element } = {
      'low': <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">LOW RISK</span>,
      'medium': <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">MEDIUM RISK</span>,
      'high': <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">HIGH RISK</span>
    };
    return badges[risk];
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-300 rounded px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Credit Assessment Queue</h2>
              <p className="text-xs text-gray-600">Review applications with automated risk scoring & policy checks</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Credit Memo
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Batch Process
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-blue-50 rounded p-3 border border-blue-200">
            <div className="text-xs text-blue-700">New Applications</div>
            <div className="text-2xl font-bold text-blue-700">{stats.newApplications}</div>
          </div>
          <div className="bg-purple-50 rounded p-3 border border-purple-200">
            <div className="text-xs text-purple-700">Under Review</div>
            <div className="text-2xl font-bold text-purple-700">{stats.underReview}</div>
          </div>
          <div className="bg-amber-50 rounded p-3 border border-amber-200">
            <div className="text-xs text-amber-700">Conditional</div>
            <div className="text-2xl font-bold text-amber-700">{stats.conditional}</div>
          </div>
          <div className="bg-red-50 rounded p-3 border border-red-200">
            <div className="text-xs text-red-700">Breaching SLA</div>
            <div className="text-2xl font-bold text-red-700">{stats.breachingSLA}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded p-3">
            <div className="text-xs opacity-90">Total Pipeline</div>
            <div className="text-lg font-bold">{formatCurrency(stats.totalPipelineValue)}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by borrower, broker, application ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="under_review">Under Review</option>
          <option value="conditional">Conditional</option>
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
        </select>
        <select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm"
        >
          <option value="all">All Risk</option>
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
        </select>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Credit Queue Table */}
      <div className="border border-gray-300 rounded bg-white overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">App ID</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Borrower</th>
              <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Loan Type</th>
              <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Amount</th>
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">LVR</th>
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">DSCR</th>
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Risk</th>
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Status</th>
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">SLA</th>
              <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-blue-50">
                <td className="border border-gray-300 px-3 py-2 text-gray-900 font-mono font-semibold">
                  {app.id}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <div className="font-semibold text-gray-900">{app.borrower}</div>
                  <div className="text-xs text-gray-600">{app.broker}</div>
                  {app.autoFlags.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      {app.autoFlags.map((flag, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                          {flag}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-gray-700">
                  {app.loanType}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                  {formatCurrency(app.amount)}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <span className={`font-semibold ${app.lvr > 70 ? 'text-red-600' : 'text-green-600'}`}>
                    {app.lvr}%
                  </span>
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <span className={`font-semibold ${app.dscr < 1.25 ? 'text-red-600' : 'text-green-600'}`}>
                    {app.dscr.toFixed(2)}x
                  </span>
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  {getRiskBadge(app.riskRating)}
                  <div className="text-xs text-gray-600 mt-1">Score: {app.creditScore}</div>
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  {getStatusBadge(app.status)}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <div className={`text-sm font-semibold ${app.daysInQueue > app.sla ? 'text-red-600' : 'text-gray-900'}`}>
                    {app.daysInQueue}/{app.sla}d
                  </div>
                  {app.daysInQueue > app.sla && (
                    <div className="text-xs text-red-600">BREACH</div>
                  )}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <button 
                      onClick={() => onNavigate?.('lender-deal-view')}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded font-semibold"
                    >
                      <Eye className="w-3 h-3 inline mr-1" />
                      View
                    </button>
                    <button className="px-2 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded font-semibold">
                      <ThumbsUp className="w-3 h-3 inline mr-1" />
                      Approve
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Policy Rules Panel */}
      <div className="bg-white border border-gray-300 rounded p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Active Credit Policy Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 rounded p-3 border border-gray-200">
            <div className="font-semibold text-gray-900 mb-1">LVR Limits</div>
            <div className="text-gray-700">
              Commercial Mortgage: ≤75%<br />
              Private Lending: ≤70%<br />
              Asset Finance: ≤80%
            </div>
          </div>
          <div className="bg-gray-50 rounded p-3 border border-gray-200">
            <div className="font-semibold text-gray-900 mb-1">DSCR Requirements</div>
            <div className="text-gray-700">
              Minimum: 1.25x<br />
              Preferred: 1.35x<br />
              Strong: 1.50x+
            </div>
          </div>
          <div className="bg-gray-50 rounded p-3 border border-gray-200">
            <div className="font-semibold text-gray-900 mb-1">Credit Score</div>
            <div className="text-gray-700">
              Minimum: 620<br />
              Preferred: 680+<br />
              Excellent: 720+
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
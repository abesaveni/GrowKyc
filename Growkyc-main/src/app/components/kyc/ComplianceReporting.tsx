import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  AlertTriangle,
  FileText,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Download,
  Plus,
  Search,
  Filter,
  DollarSign,
  User,
  Building,
  Calendar,
  Shield,
  TrendingUp
} from 'lucide-react';

type ReportType = 'smr' | 'ttr' | 'ifti';
type ReportStatus = 'draft' | 'pending-review' | 'approved' | 'submitted' | 'rejected';

interface ComplianceReport {
  id: string;
  type: ReportType;
  clientName: string;
  clientId: string;
  suspicionReason?: string;
  transactionAmount?: number;
  transactionDate?: Date;
  status: ReportStatus;
  createdDate: Date;
  submittedDate?: Date;
  createdBy: string;
  reviewer?: string;
}

export function ComplianceReporting() {
  const [activeTab, setActiveTab] = useState<'overview' | 'smr' | 'ttr' | 'ifti' | 'history'>('overview');
  const [reports] = useState<ComplianceReport[]>([
    {
      id: 'SMR-2024-001',
      type: 'smr',
      clientName: 'Global Trading Ltd',
      clientId: 'C-2024-045',
      suspicionReason: 'Structuring transactions to avoid $10,000 threshold',
      transactionAmount: 98500,
      transactionDate: new Date('2024-02-15'),
      status: 'pending-review',
      createdDate: new Date('2024-02-18'),
      createdBy: 'Emma Wilson'
    },
    {
      id: 'TTR-2024-012',
      type: 'ttr',
      clientName: 'Melbourne Property Trust',
      clientId: 'C-2024-023',
      transactionAmount: 25000,
      transactionDate: new Date('2024-02-17'),
      status: 'submitted',
      createdDate: new Date('2024-02-17'),
      submittedDate: new Date('2024-02-17'),
      createdBy: 'Michael Chen'
    },
    {
      id: 'SMR-2024-002',
      type: 'smr',
      clientName: 'John Smith',
      clientId: 'C-2024-067',
      suspicionReason: 'Unusual cash deposit patterns inconsistent with business profile',
      transactionAmount: 75000,
      transactionDate: new Date('2024-02-10'),
      status: 'draft',
      createdDate: new Date('2024-02-19'),
      createdBy: 'Lisa Martinez'
    },
    {
      id: 'TTR-2024-013',
      type: 'ttr',
      clientName: 'Tech Innovations Pty Ltd',
      clientId: 'C-2024-089',
      transactionAmount: 15000,
      transactionDate: new Date('2024-02-19'),
      status: 'approved',
      createdDate: new Date('2024-02-19'),
      createdBy: 'Emma Wilson',
      reviewer: 'Michael Chen'
    }
  ]);

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'draft': return 'gray';
      case 'pending-review': return 'yellow';
      case 'approved': return 'green';
      case 'submitted': return 'blue';
      case 'rejected': return 'red';
    }
  };

  const reportTypeLabels: Record<ReportType, string> = {
    'smr': 'Suspicious Matter Report',
    'ttr': 'Threshold Transaction Report',
    'ifti': 'International Funds Transfer Instruction'
  };

  const stats = {
    totalReports: 47,
    smrSubmitted: 8,
    ttrSubmitted: 35,
    pendingReview: 4,
    avgResponseTime: 2.5,
    complianceRate: 100
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Compliance Reporting</h1>
              <p className="text-xl text-orange-100">SMR, TTR & IFTI Reporting to AUSTRAC</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-orange-600 hover:bg-orange-50">
              <Plus className="w-5 h-5 mr-2" />
              New Report
            </Button>
            <Button className="bg-white text-orange-600 hover:bg-orange-50">
              <Download className="w-5 h-5 mr-2" />
              Export Register
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-6 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Total Reports</h3>
              <FileText className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.totalReports}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">SMRs</h3>
              <AlertTriangle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-red-300">{stats.smrSubmitted}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">TTRs</h3>
              <DollarSign className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-blue-300">{stats.ttrSubmitted}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Review</h3>
              <Clock className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-yellow-300">{stats.pendingReview}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Avg Days</h3>
              <TrendingUp className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.avgResponseTime}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">On-time %</h3>
              <CheckCircle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-green-300">{stats.complianceRate}%</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'smr', label: 'SMR Queue', icon: AlertTriangle, badge: 2 },
            { id: 'ttr', label: 'TTR Queue', icon: DollarSign },
            { id: 'ifti', label: 'IFTI Reports', icon: Send },
            { id: 'history', label: 'Submission History', icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 transition-colors relative ${
                  activeTab === tab.id
                    ? 'border-b-2 border-orange-600 text-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Type Info Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border-2 border-red-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">SMR</h3>
              <p className="text-sm text-gray-600">Suspicious Matter Report</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Report suspicious transactions or activities that may indicate money laundering or terrorism financing.
          </p>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-900">Key Triggers:</p>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Structuring to avoid thresholds</li>
              <li>• Unusual transaction patterns</li>
              <li>• Inconsistent with client profile</li>
              <li>• Source of funds unclear</li>
            </ul>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600">Deadline: <strong>3 business days</strong> from suspicion</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">TTR</h3>
              <p className="text-sm text-gray-600">Threshold Transaction Report</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Report cash transactions of $10,000 or more (or foreign currency equivalent).
          </p>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-900">Reportable Transactions:</p>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Cash deposits ≥ $10,000</li>
              <li>• Cash withdrawals ≥ $10,000</li>
              <li>• Cash transfers ≥ $10,000</li>
              <li>• Foreign currency exchange</li>
            </ul>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600">Deadline: <strong>10 business days</strong> from transaction</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-purple-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">IFTI</h3>
              <p className="text-sm text-gray-600">International Funds Transfer</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            Report international funds transfer instructions of any amount.
          </p>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-900">Requirements:</p>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• All outgoing transfers</li>
              <li>• All incoming transfers</li>
              <li>• Complete sender/receiver details</li>
              <li>• Purpose of transfer</li>
            </ul>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600">Deadline: <strong>10 business days</strong> from instruction</p>
          </div>
        </div>
      </div>

      {/* Reports Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Active Reports</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {reports.map((report) => (
          <div key={report.id} className={`bg-white rounded-lg border-2 p-6 ${
            report.type === 'smr' ? 'border-red-200 bg-red-50' :
            report.type === 'ttr' ? 'border-blue-200' :
            'border-purple-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-xl font-bold text-gray-900">{report.id}</h4>
                  <span className={`px-3 py-1 bg-${getStatusColor(report.status)}-100 text-${getStatusColor(report.status)}-700 text-sm font-bold rounded-full`}>
                    {report.status.toUpperCase().replace('-', ' ')}
                  </span>
                  <span className={`px-3 py-1 ${
                    report.type === 'smr' ? 'bg-red-500' :
                    report.type === 'ttr' ? 'bg-blue-500' :
                    'bg-purple-500'
                  } text-white text-sm font-bold rounded-full`}>
                    {reportTypeLabels[report.type]}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Client Details</p>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-600" />
                      <span className="font-semibold text-gray-900">{report.clientName}</span>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">{report.clientId}</p>
                  </div>

                  {report.transactionAmount && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Transaction Amount</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-600" />
                        <span className="font-bold text-gray-900">
                          ${report.transactionAmount.toLocaleString()}
                        </span>
                      </div>
                      {report.transactionDate && (
                        <p className="text-xs text-gray-600 ml-6">
                          {report.transactionDate.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {report.suspicionReason && (
                  <div className="p-4 bg-white rounded-lg border border-red-200 mb-3">
                    <p className="text-sm font-semibold text-red-900 mb-1">Suspicion Reason:</p>
                    <p className="text-sm text-gray-700">{report.suspicionReason}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Created by {report.createdBy}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {report.createdDate.toLocaleDateString()}
                  </span>
                  {report.submittedDate && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        Submitted {report.submittedDate.toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-6">
                <Button className={`${
                  report.type === 'smr' ? 'bg-red-600 hover:bg-red-700' :
                  report.type === 'ttr' ? 'bg-blue-600 hover:bg-blue-700' :
                  'bg-purple-600 hover:bg-purple-700'
                }`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Review
                </Button>
                {report.status === 'draft' && (
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
                {report.status === 'approved' && (
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                  </Button>
                )}
                <Button variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Safety Notice */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-yellow-900 mb-2">AI Safety Principle: "AI Suggests, Humans Decide"</h3>
            <p className="text-sm text-yellow-800 mb-3">
              The AI Compliance Copilot can draft reports and identify potential suspicious activities, but:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 border border-yellow-200">
                <p className="text-xs font-bold text-yellow-900 mb-2">✓ AI CAN:</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Flag potential suspicious activity</li>
                  <li>• Draft report narratives</li>
                  <li>• Pre-fill transaction details</li>
                  <li>• Suggest suspicion reasons</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-3 border border-yellow-200">
                <p className="text-xs font-bold text-red-900 mb-2">✗ AI CANNOT:</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Decide "suspicious" alone</li>
                  <li>• Submit SMR/TTR without human approval</li>
                  <li>• Override compliance officer judgment</li>
                  <li>• Make final reporting decisions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

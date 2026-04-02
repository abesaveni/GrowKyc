import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  Download,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  MoreVertical
} from 'lucide-react';

interface CommissionsProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function Commissions({ onNavigate, onBack }: CommissionsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current');
  const [searchTerm, setSearchTerm] = useState('');

  const commissionStats = [
    {
      label: 'Total Earned (YTD)',
      value: '$127,450',
      change: '+18.2%',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Pending Commissions',
      value: '$34,200',
      change: '8 deals',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      label: 'Paid This Month',
      value: '$18,750',
      change: '+22.5%',
      icon: CheckCircle,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Average Commission',
      value: '$4,250',
      change: '+5.3%',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const commissionData = [
    {
      id: 'COM-2024-001',
      deal: 'ABC Enterprises - Commercial Mortgage',
      client: 'ABC Enterprises Pty Ltd',
      loanAmount: '$850,000',
      commissionRate: '0.8%',
      commissionAmount: '$6,800',
      status: 'paid',
      paidDate: '2024-01-15',
      settlementDate: '2024-01-10',
      type: 'Origination'
    },
    {
      id: 'COM-2024-002',
      deal: 'Tech Innovations - SME Term Loan',
      client: 'Tech Innovations Ltd',
      loanAmount: '$450,000',
      commissionRate: '1.0%',
      commissionAmount: '$4,500',
      status: 'pending',
      settlementDate: '2024-01-20',
      expectedPayment: '2024-02-05',
      type: 'Origination'
    },
    {
      id: 'COM-2024-003',
      deal: 'Green Energy - Asset Finance',
      client: 'Green Energy Solutions',
      loanAmount: '$320,000',
      commissionRate: '1.2%',
      commissionAmount: '$3,840',
      status: 'approved',
      settlementDate: '2024-01-25',
      expectedPayment: '2024-02-10',
      type: 'Origination'
    },
    {
      id: 'COM-2024-004',
      deal: 'Retail Group - Private Lending',
      client: 'Retail Group Pty Ltd',
      loanAmount: '$1,200,000',
      commissionRate: '0.9%',
      commissionAmount: '$10,800',
      status: 'processing',
      settlementDate: '2024-01-28',
      expectedPayment: '2024-02-15',
      type: 'Origination'
    },
    {
      id: 'COM-2023-089',
      deal: 'Construction Co - Commercial Mortgage (Trail)',
      client: 'Construction Co',
      loanAmount: '$2,500,000',
      commissionRate: '0.15%',
      commissionAmount: '$3,750',
      status: 'paid',
      paidDate: '2024-01-01',
      type: 'Trail Commission',
      period: 'Q4 2023'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'approved':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'processing':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return CheckCircle;
      case 'pending':
      case 'processing':
        return Clock;
      case 'approved':
        return CheckCircle;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Commission Management</h1>
            <p className="text-gray-600 mt-1">Track and manage your commission earnings</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <FileText className="w-4 h-4 mr-2" />
            View Statement
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {commissionStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by deal, client, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="current">Current Month</option>
              <option value="last-month">Last Month</option>
              <option value="quarter">This Quarter</option>
              <option value="ytd">Year to Date</option>
              <option value="all">All Time</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="processing">Processing</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Commission Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Commission History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal / Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {commissionData.map((commission) => {
                  const StatusIcon = getStatusIcon(commission.status);
                  return (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{commission.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{commission.deal}</div>
                        <div className="text-sm text-gray-500">{commission.client}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{commission.type}</div>
                        {commission.period && (
                          <div className="text-xs text-gray-500">{commission.period}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{commission.loanAmount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{commission.commissionRate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{commission.commissionAmount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(commission.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {commission.paidDate ? `Paid: ${commission.paidDate}` : 
                           commission.expectedPayment ? `Expected: ${commission.expectedPayment}` :
                           `Settlement: ${commission.settlementDate}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Commission Structure Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Commission Structure</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">Commercial Mortgage</p>
                  <p className="text-sm text-gray-500">Standard rate</p>
                </div>
                <p className="text-lg font-bold text-indigo-600">0.8%</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">SME Term Loan</p>
                  <p className="text-sm text-gray-500">Standard rate</p>
                </div>
                <p className="text-lg font-bold text-indigo-600">1.0%</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">Asset Finance</p>
                  <p className="text-sm text-gray-500">Standard rate</p>
                </div>
                <p className="text-lg font-bold text-indigo-600">1.2%</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Trail Commission</p>
                  <p className="text-sm text-gray-500">Quarterly payments</p>
                </div>
                <p className="text-lg font-bold text-indigo-600">0.15%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Payment Schedule</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Origination Commissions</p>
                  <p className="text-sm text-gray-600">Paid within 14 days of settlement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Trail Commissions</p>
                  <p className="text-sm text-gray-600">Paid quarterly in arrears</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Payment Method</p>
                  <p className="text-sm text-gray-600">Direct bank transfer to registered account</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Tax Statements</p>
                  <p className="text-sm text-gray-600">Annual summary provided by July 14</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

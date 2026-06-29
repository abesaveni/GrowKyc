import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  Eye,
  CreditCard
} from 'lucide-react';

interface CommissionProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function Commission({ onNavigate, onBack }: CommissionProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [searchTerm, setSearchTerm] = useState('');

  const commissionSummary = {
    thisMonth: {
      total: 45780,
      paid: 32450,
      pending: 13330,
      deals: 12
    },
    lastMonth: {
      total: 38920,
      paid: 38920,
      pending: 0,
      deals: 10
    },
    ytd: {
      total: 234560,
      paid: 198340,
      pending: 36220,
      deals: 58
    }
  };

  const commissions = [
    {
      id: 'COM-2024-045',
      dealId: 'APP-2024-003',
      client: 'Green Energy Solutions',
      loanAmount: 320000,
      commissionRate: 2.5,
      commissionAmount: 8000,
      status: 'paid',
      settledDate: '2024-02-10',
      paidDate: '2024-02-15',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'COM-2024-046',
      dealId: 'APP-2024-001',
      client: 'ABC Enterprises Pty Ltd',
      loanAmount: 850000,
      commissionRate: 2.0,
      commissionAmount: 17000,
      status: 'pending',
      settledDate: '2024-02-12',
      expectedDate: '2024-02-28',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'COM-2024-044',
      dealId: 'APP-2024-002',
      client: 'Tech Innovations Ltd',
      loanAmount: 450000,
      commissionRate: 2.25,
      commissionAmount: 10125,
      status: 'pending',
      settledDate: '2024-02-08',
      expectedDate: '2024-02-25',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'COM-2024-043',
      dealId: 'APP-2024-005',
      client: 'Construction Co',
      loanAmount: 2500000,
      commissionRate: 1.8,
      commissionAmount: 45000,
      status: 'paid',
      settledDate: '2024-01-28',
      paidDate: '2024-02-05',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'COM-2024-042',
      dealId: 'APP-2023-089',
      client: 'Property Developers Ltd',
      loanAmount: 1200000,
      commissionRate: 2.0,
      commissionAmount: 24000,
      status: 'paid',
      settledDate: '2024-01-15',
      paidDate: '2024-01-22',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'COM-2024-041',
      dealId: 'APP-2023-087',
      client: 'Retail Group Pty Ltd',
      loanAmount: 680000,
      commissionRate: 2.1,
      commissionAmount: 14280,
      status: 'processing',
      settledDate: '2024-02-14',
      expectedDate: '2024-02-20',
      paymentMethod: 'Bank Transfer'
    }
  ];

  const filteredCommissions = commissions.filter(comm =>
    comm.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comm.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comm.dealId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Commission Management</h1>
            <p className="text-gray-600 mt-1">Track and manage your commission earnings</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <FileText className="w-4 h-4 mr-2" />
            Generate Statement
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                This Month
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Earned</p>
            <p className="text-2xl font-bold text-gray-900">
              ${commissionSummary.thisMonth.total.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              From {commissionSummary.thisMonth.deals} deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Paid</p>
            <p className="text-2xl font-bold text-blue-900">
              ${commissionSummary.thisMonth.paid.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              71% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">
              ${commissionSummary.thisMonth.pending.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Expected in 7-14 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Year to Date</p>
            <p className="text-2xl font-bold text-purple-900">
              ${commissionSummary.ytd.total.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              From {commissionSummary.ytd.deals} deals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by client, deal ID, or commission ID..."
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
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-quarter">This Quarter</option>
              <option value="ytd">Year to Date</option>
              <option value="all">All Time</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Commission List */}
      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCommissions.map((commission) => (
              <div
                key={commission.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{commission.client}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(commission.status)}`}>
                        {getStatusIcon(commission.status)}
                        {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Commission ID</p>
                        <p className="font-medium text-gray-900">{commission.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Deal ID</p>
                        <p className="font-medium text-gray-900">{commission.dealId}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Loan Amount</p>
                        <p className="font-medium text-gray-900">${commission.loanAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Commission Rate</p>
                        <p className="font-medium text-gray-900">{commission.commissionRate}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-indigo-600">
                      ${commission.commissionAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {commission.status === 'paid' ? (
                        <span className="text-green-600">Paid {commission.paidDate}</span>
                      ) : (
                        <span className="text-yellow-600">Expected {commission.expectedDate}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Settled: {commission.settledDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-4 h-4" />
                      {commission.paymentMethod}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Invoice
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCommissions.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No commissions found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

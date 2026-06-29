import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  CreditCard,
  Activity,
  Shield,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  X,
  FileText,
  Building2,
  Zap,
  Target,
  Percent,
  BarChart3,
  PlayCircle,
  PauseCircle,
  XCircle,
  RefreshCw,
  Lock,
  Key,
  Globe,
  Code,
  Webhook,
  Terminal,
  BookOpen,
  Scale,
  AlertTriangle,
  UserCheck,
  FileWarning,
  Package,
  Receipt,
  Send,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../../lib/toast';

// ===== PLATFORM DASHBOARD =====
export const renderPlatformDashboard = () => (
  <div className="space-y-6">
    {/* Key Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
              <TrendingUp className="w-4 h-4" />
              +12.4%
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Payment Volume Today</p>
          <p className="text-3xl font-bold text-gray-900">$1.2M</p>
          <p className="text-xs text-gray-500 mt-2">2,847 transactions</p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-blue-600">
              <TrendingUp className="w-4 h-4" />
              +3.2%
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Approval Rate</p>
          <p className="text-3xl font-bold text-gray-900">96.8%</p>
          <p className="text-xs text-gray-500 mt-2">Across all rails</p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-amber-600">
              <AlertCircle className="w-4 h-4" />
              12 Open
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Fraud Alerts</p>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500 mt-2">Requires review</p>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
              <TrendingDown className="w-4 h-4" />
              -0.3%
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Chargeback Ratio</p>
          <p className="text-3xl font-bold text-gray-900">0.4%</p>
          <p className="text-xs text-gray-500 mt-2">Below threshold</p>
        </CardContent>
      </Card>
    </div>

    {/* Payment Volume Chart */}
    <Card>
      <CardHeader>
        <CardTitle>Payment Volume by Rail (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { rail: 'Card (Stripe)', volume: '$8.2M', count: 12400, share: 68, color: 'bg-blue-500' },
            { rail: 'BECS Direct Debit', volume: '$2.1M', count: 3200, share: 17, color: 'bg-green-500' },
            { rail: 'PayTo', volume: '$1.2M', count: 890, share: 10, color: 'bg-purple-500' },
            { rail: 'Bank Transfer', volume: '$600K', count: 450, share: 5, color: 'bg-amber-500' }
          ].map((item) => (
            <div key={item.rail}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.rail}</span>
                <span className="text-sm font-semibold text-gray-900">{item.volume}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div className={`${item.color} h-3 rounded-full`} style={{ width: `${item.share}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-12">{item.share}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{item.count} transactions</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* System Health & Reconciliation */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Reconciliation Exceptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'Unmatched Deposit', count: 3, risk: 'low', aging: '2 days' },
              { type: 'Fee Mismatch', count: 5, risk: 'medium', aging: '1 day' },
              { type: 'Missing Payout', count: 1, risk: 'high', aging: '5 days' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.type}</p>
                  <p className="text-xs text-gray-500">Aging: {item.aging}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">{item.count}</span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      item.risk === 'high'
                        ? 'bg-red-100 text-red-700'
                        : item.risk === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {item.risk.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Merchants by Risk Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'TechCo Solutions', score: 78, volume: '$245K', status: 'monitor' },
              { name: 'Retail Plus', score: 65, volume: '$189K', status: 'normal' },
              { name: 'Services Group', score: 82, volume: '$312K', status: 'review' }
            ].map((merchant, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{merchant.name}</p>
                  <p className="text-xs text-gray-500">Volume: {merchant.volume}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{merchant.score}</p>
                    <p className="text-xs text-gray-500">Risk Score</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// ===== MERCHANT DASHBOARD =====
export const renderMerchantDashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Daily Sales</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$42.5K</p>
          <p className="text-xs text-green-600 mt-1">↑ 18.2% vs yesterday</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending Settlement</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$156K</p>
          <p className="text-xs text-gray-500 mt-1">Expected tomorrow</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Failed Payments</span>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-xs text-gray-500 mt-1">Auto-retry scheduled</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Plans</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">847</p>
          <p className="text-xs text-green-600 mt-1">+12 this week</p>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Revenue by Plan Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { plan: 'Premium Monthly', mrr: '$24,500', customers: 245, churn: '2.1%' },
            { plan: 'Standard Monthly', mrr: '$18,200', customers: 364, churn: '3.4%' },
            { plan: 'Annual Prepay', mrr: '$42,100', customers: 89, churn: '0.8%' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.plan}</p>
                <p className="text-sm text-gray-600">{item.customers} customers</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{item.mrr}</p>
                <p className="text-xs text-gray-500">Churn: {item.churn}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== LENDER DASHBOARD =====
export const renderLenderDashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Loan Book Balance</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$8.2M</p>
          <p className="text-xs text-gray-500 mt-1">427 active loans</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Arrears 30+ Days</span>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$124K</p>
          <p className="text-xs text-amber-600 mt-1">1.5% of portfolio</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Collections Tasks</span>
            <Target className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">23</p>
          <p className="text-xs text-gray-500 mt-1">Due today</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Portfolio Yield</span>
            <Percent className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">8.4%</p>
          <p className="text-xs text-green-600 mt-1">↑ 0.2% this month</p>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Arrears Buckets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { bucket: 'Current', count: 387, amount: '$7.9M', percent: 96.3 },
              { bucket: '1-30 Days', count: 18, amount: '$45K', percent: 0.5 },
              { bucket: '31-60 Days', count: 12, amount: '$78K', percent: 0.9 },
              { bucket: '60+ Days', count: 10, amount: '$124K', percent: 1.5 }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.bucket}</p>
                  <p className="text-xs text-gray-500">{item.count} loans</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{item.amount}</p>
                  <p className="text-xs text-gray-500">{item.percent}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected Cash Flow (Next 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Expected Repayments</p>
              <p className="text-2xl font-bold text-green-700">$842K</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">New Loans to Fund</p>
              <p className="text-2xl font-bold text-blue-700">$215K</p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Net Cash Position</p>
              <p className="text-2xl font-bold text-gray-900">+$627K</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// ===== CUSTOMERS PAGE =====
export const renderCustomers = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button size="sm" variant="outline">
          <Filter className="w-4 h-4 mr-1" />
          Filter
        </Button>
        <Button size="sm" variant="outline">
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
      </div>
      <Button onClick={() => toast.success('Create customer')}>
        <Plus className="w-4 h-4 mr-2" />
        Add Customer
      </Button>
    </div>

    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment Method</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Active Plans</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Payment</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                {
                  name: 'Sarah Johnson',
                  email: 'sarah.j@email.com',
                  status: 'active',
                  method: 'Card •••• 4242',
                  plans: 2,
                  risk: 45,
                  lastPayment: '2024-02-14'
                },
                {
                  name: 'Michael Chen',
                  email: 'mchen@company.com',
                  status: 'active',
                  method: 'BECS Direct Debit',
                  plans: 1,
                  risk: 28,
                  lastPayment: '2024-02-13'
                },
                {
                  name: 'Emma Wilson',
                  email: 'emma.w@email.com',
                  status: 'past_due',
                  method: 'Card •••• 5555',
                  plans: 1,
                  risk: 72,
                  lastPayment: '2024-01-28'
                },
                {
                  name: 'David Martinez',
                  email: 'dmartinez@email.com',
                  status: 'active',
                  method: 'PayTo Mandate',
                  plans: 3,
                  risk: 35,
                  lastPayment: '2024-02-15'
                },
                {
                  name: 'Lisa Anderson',
                  email: 'l.anderson@email.com',
                  status: 'active',
                  method: 'Card •••• 9876',
                  plans: 1,
                  risk: 52,
                  lastPayment: '2024-02-12'
                }
              ].map((customer, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        customer.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {customer.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.method}</td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">{customer.plans}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        customer.risk < 40
                          ? 'bg-green-100 text-green-700'
                          : customer.risk < 60
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {customer.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.lastPayment}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => toast.info('View customer')}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.info('Edit customer')}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== PAYMENTS PAGE =====
export const renderPayments = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search payments..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Rails</option>
          <option>Card</option>
          <option>BECS</option>
          <option>PayTo</option>
          <option>Bank Transfer</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Failed</option>
          <option>Refunded</option>
        </select>
      </div>
      <Button onClick={() => toast.success('Create payment')}>
        <Plus className="w-4 h-4 mr-2" />
        Create Payment
      </Button>
    </div>

    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rail</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Fee</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                {
                  id: 'PAY-2024-5847',
                  customer: 'Sarah Johnson',
                  rail: 'Card',
                  status: 'completed',
                  amount: 249.0,
                  fee: 7.47,
                  created: '2024-02-14 10:23'
                },
                {
                  id: 'PAY-2024-5846',
                  customer: 'Michael Chen',
                  rail: 'BECS',
                  status: 'pending',
                  amount: 89.0,
                  fee: 0.89,
                  created: '2024-02-14 09:15'
                },
                {
                  id: 'PAY-2024-5845',
                  customer: 'Emma Wilson',
                  rail: 'Card',
                  status: 'failed',
                  amount: 149.0,
                  fee: 0.0,
                  created: '2024-02-14 08:42'
                },
                {
                  id: 'PAY-2024-5844',
                  customer: 'David Martinez',
                  rail: 'PayTo',
                  status: 'completed',
                  amount: 199.0,
                  fee: 0.60,
                  created: '2024-02-13 16:20'
                },
                {
                  id: 'PAY-2024-5843',
                  customer: 'Lisa Anderson',
                  rail: 'Card',
                  status: 'refunded',
                  amount: 89.0,
                  fee: 2.67,
                  created: '2024-02-13 14:10'
                }
              ].map((payment, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-900">{payment.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.customer}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                      {payment.rail}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        payment.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : payment.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : payment.status === 'refunded'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {payment.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-600">${payment.fee.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.created}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => toast.info('View payment')}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {payment.status === 'completed' && (
                        <Button size="sm" variant="ghost" onClick={() => toast.warning('Refund initiated')}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== BILLING PAGE =====
export const renderBilling = () => (
  <div className="space-y-6">
    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Monthly Recurring Revenue</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$84.8K</p>
          <p className="text-xs text-green-600 mt-1">↑ 12.4% MoM</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Subscriptions</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">847</p>
          <p className="text-xs text-gray-500 mt-1">698 active plans</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Churn Rate</span>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">2.8%</p>
          <p className="text-xs text-green-600 mt-1">↓ 0.4% improvement</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Unpaid Invoices</span>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">23</p>
          <p className="text-xs text-gray-500 mt-1">$12.4K total</p>
        </CardContent>
      </Card>
    </div>

    {/* Products & Plans */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Products</CardTitle>
            <Button size="sm" onClick={() => toast.success('Create product')}>
              <Plus className="w-4 h-4 mr-1" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Premium Plan', price: '$99/mo', subscribers: 245, active: true },
              { name: 'Standard Plan', price: '$49/mo', subscribers: 364, active: true },
              { name: 'Basic Plan', price: '$29/mo', subscribers: 189, active: true },
              { name: 'Enterprise (Annual)', price: '$999/yr', subscribers: 49, active: true }
            ].map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.subscribers} subscribers</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{product.price}</p>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                    ACTIVE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <Button size="sm" variant="outline" onClick={() => toast.info('View all invoices')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 'INV-2024-1247', customer: 'Sarah Johnson', amount: 99, status: 'paid', date: '2024-02-14' },
              { id: 'INV-2024-1246', customer: 'Michael Chen', amount: 49, status: 'paid', date: '2024-02-14' },
              { id: 'INV-2024-1245', customer: 'Emma Wilson', amount: 99, status: 'open', date: '2024-02-13' },
              { id: 'INV-2024-1244', customer: 'David Martinez', amount: 999, status: 'paid', date: '2024-02-12' }
            ].map((invoice, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-mono text-sm font-semibold text-gray-900">{invoice.id}</p>
                  <p className="text-xs text-gray-500">{invoice.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${invoice.amount}</p>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {invoice.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// ===== LOANS PAGE =====
export const renderLoans = () => (
  <div className="space-y-6">
    {/* Loan Pipeline Stats */}
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {[
        { status: 'Draft', count: 12, amount: '$340K', color: 'bg-gray-100 text-gray-700' },
        { status: 'Under Review', count: 8, amount: '$280K', color: 'bg-blue-100 text-blue-700' },
        { status: 'Approved', count: 15, amount: '$520K', color: 'bg-green-100 text-green-700' },
        { status: 'Active', count: 427, amount: '$8.2M', color: 'bg-purple-100 text-purple-700' },
        { status: 'Arrears', count: 23, amount: '$340K', color: 'bg-red-100 text-red-700' }
      ].map((stage, idx) => (
        <Card key={idx}>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-2">{stage.status}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stage.count}</p>
            <p className="text-xs text-gray-500">{stage.amount}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Loans Table */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Active Loans</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
            <Button size="sm" onClick={() => toast.success('Create loan')}>
              <Plus className="w-4 h-4 mr-1" />
              New Loan
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Loan ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Borrower</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Next Payment</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { id: 'LOAN-2024-1247', borrower: 'John Smith', amount: 25000, status: 'active', balance: 18400, nextPayment: '2024-02-28' },
                { id: 'LOAN-2024-1246', borrower: 'Jane Doe', amount: 35000, status: 'active', balance: 31200, nextPayment: '2024-02-25' },
                { id: 'LOAN-2024-1245', borrower: 'Bob Wilson', amount: 15000, status: 'arrears', balance: 12800, nextPayment: '2024-01-28' },
                { id: 'LOAN-2024-1244', borrower: 'Alice Brown', amount: 50000, status: 'active', balance: 42000, nextPayment: '2024-03-01' },
                { id: 'LOAN-2024-1243', borrower: 'Charlie Davis', amount: 20000, status: 'active', balance: 16500, nextPayment: '2024-02-20' }
              ].map((loan, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-900">{loan.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{loan.borrower}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">${loan.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        loan.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {loan.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">${loan.balance.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{loan.nextPayment}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => toast.info('View loan')}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.info('Edit loan')}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== SETTLEMENTS PAGE =====
export const renderSettlements = () => (
  <div className="space-y-6">
    {/* Settlement Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending Settlement</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$284K</p>
          <p className="text-xs text-gray-500 mt-1">12 batches</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Settled Today</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$847K</p>
          <p className="text-xs text-gray-500 mt-1">24 batches</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Failed Settlements</span>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <p className="text-xs text-gray-500 mt-1">$4.2K total</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Reserve Held</span>
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$124K</p>
          <p className="text-xs text-gray-500 mt-1">Rolling reserve</p>
        </CardContent>
      </Card>
    </div>

    {/* Settlement Batches */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Settlement Batches</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast.info('Download report')}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Batch ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rail</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Gross</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Fees</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Net</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Count</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { id: 'SETT-2024-0214', date: '2024-02-14', rail: 'Card', gross: 42450, fees: 1273, net: 41177, count: 187, status: 'paid' },
                { id: 'SETT-2024-0213', date: '2024-02-13', rail: 'BECS', gross: 28900, fees: 289, net: 28611, count: 92, status: 'paid' },
                { id: 'SETT-2024-0213', date: '2024-02-13', rail: 'PayTo', gross: 15200, fees: 46, net: 15154, count: 48, status: 'pending' },
                { id: 'SETT-2024-0212', date: '2024-02-12', rail: 'Card', gross: 38700, fees: 1161, net: 37539, count: 165, status: 'paid' }
              ].map((batch, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-900">{batch.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{batch.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                      {batch.rail}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">${batch.gross.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-sm text-red-600">${batch.fees.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-green-700">${batch.net.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{batch.count}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        batch.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {batch.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== RECONCILIATION PAGE =====
export const renderReconciliation = () => (
  <div className="space-y-6">
    {/* Recon Status */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Gateway vs Sponsor</p>
              <p className="text-2xl font-bold text-gray-900">98.2%</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Match rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sponsor vs Bank</p>
              <p className="text-2xl font-bold text-gray-900">99.1%</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Match rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Exceptions</p>
              <p className="text-2xl font-bold text-gray-900">9</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Requires action</p>
        </CardContent>
      </Card>
    </div>

    {/* Exception Queue */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Exception Queue</CardTitle>
          <Button size="sm" onClick={() => toast.success('Run reconciliation')}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Run Recon
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Exception ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Risk</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aging</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Owner</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { id: 'EXC-2024-0089', type: 'Unmatched Deposit', amount: 450, risk: 'low', aging: '2 days', owner: 'John Recon' },
                { id: 'EXC-2024-0088', type: 'Fee Mismatch', amount: 12.5, risk: 'medium', aging: '1 day', owner: 'Sarah Ops' },
                { id: 'EXC-2024-0087', type: 'Missing Payout', amount: 2840, risk: 'high', aging: '5 days', owner: 'Mike Finance' },
                { id: 'EXC-2024-0086', type: 'Duplicate Entry', amount: 180, risk: 'low', aging: '3 days', owner: 'Unassigned' }
              ].map((exception, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-900">{exception.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{exception.type}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">${exception.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        exception.risk === 'high'
                          ? 'bg-red-100 text-red-700'
                          : exception.risk === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {exception.risk.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{exception.aging}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{exception.owner}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.success('Exception resolved')}>
                        Resolve
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== LEDGER PAGE =====
export const renderLedger = () => (
  <div className="space-y-6">
    {/* Ledger Summary */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Journals</p>
          <p className="text-3xl font-bold text-gray-900">1,247</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-2">System Generated</p>
          <p className="text-3xl font-bold text-gray-900">1,189</p>
          <p className="text-xs text-gray-500 mt-1">95.3%</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-2">Manual Entries</p>
          <p className="text-3xl font-bold text-gray-900">58</p>
          <p className="text-xs text-gray-500 mt-1">4.7%</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-2">Period Status</p>
          <p className="text-3xl font-bold text-green-600">Open</p>
          <p className="text-xs text-gray-500 mt-1">Feb 2024</p>
        </CardContent>
      </Card>
    </div>

    {/* Recent Journals */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Journal Entries</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => toast.info('Close period')}>
              <Lock className="w-4 h-4 mr-1" />
              Close Period
            </Button>
            <Button size="sm" onClick={() => toast.success('Create journal')}>
              <Plus className="w-4 h-4 mr-1" />
              Post Journal
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Journal ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Debit</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Credit</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { id: 'JE-2024-5847', date: '2024-02-14', type: 'System', description: 'Payment settlement', debit: 42450, credit: 42450 },
                { id: 'JE-2024-5846', date: '2024-02-14', type: 'System', description: 'Fee revenue', debit: 1273, credit: 1273 },
                { id: 'JE-2024-5845', date: '2024-02-13', type: 'Manual', description: 'Reserve adjustment', debit: 5000, credit: 5000 },
                { id: 'JE-2024-5844', date: '2024-02-13', type: 'System', description: 'Chargeback', debit: 249, credit: 249 }
              ].map((journal, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-900">{journal.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{journal.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        journal.type === 'System' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {journal.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{journal.description}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">${journal.debit.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">${journal.credit.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" variant="ghost" onClick={() => toast.info('View journal')}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== RISK & FRAUD PAGE =====
export const renderRiskFraud = () => (
  <div className="space-y-6">
    {/* Risk Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Open Alerts</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500 mt-1">5 high priority</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Fraud Rate</span>
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">0.08%</p>
          <p className="text-xs text-green-600 mt-1">Below target</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Blocked Transactions</span>
            <XCircle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">47</p>
          <p className="text-xs text-gray-500 mt-1">Last 24h</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Rules</span>
            <CheckCircle className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">24</p>
          <p className="text-xs text-gray-500 mt-1">8 custom</p>
        </CardContent>
      </Card>
    </div>

    {/* Fraud Alerts */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Fraud Alerts</CardTitle>
          <Button size="sm" onClick={() => toast.success('Create rule')}>
            <Plus className="w-4 h-4 mr-1" />
            New Rule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { id: 'ALERT-5847', merchant: 'TechCo Solutions', type: 'Velocity spike', severity: 'high', amount: '$12.4K', triggered: '2 min ago' },
            { id: 'ALERT-5846', merchant: 'Retail Plus', type: 'BIN mismatch', severity: 'medium', amount: '$450', triggered: '15 min ago' },
            { id: 'ALERT-5845', merchant: 'Services Group', type: 'Geo anomaly', severity: 'high', amount: '$8.2K', triggered: '1 hour ago' },
            { id: 'ALERT-5844', merchant: 'Online Store', type: 'Multiple failures', severity: 'low', amount: '$240', triggered: '3 hours ago' }
          ].map((alert, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-mono text-sm font-semibold text-gray-900">{alert.id}</p>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      alert.severity === 'high'
                        ? 'bg-red-100 text-red-700'
                        : alert.severity === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-900">{alert.merchant}</p>
                <p className="text-xs text-gray-500">{alert.type} • {alert.amount} • {alert.triggered}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => toast.info('Review alert')}>
                  Review
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toast.success('Alert dismissed')}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== DISPUTES PAGE =====
export const renderDisputes = () => (
  <div className="space-y-6">
    {/* Dispute Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-2">Open Disputes</p>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-xs text-gray-500 mt-1">$4.2K total</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-2">Win Rate</p>
          <p className="text-3xl font-bold text-green-600">68%</p>
          <p className="text-xs text-gray-500 mt-1">Last 90 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-2">Response Pending</p>
          <p className="text-3xl font-bold text-amber-600">3</p>
          <p className="text-xs text-gray-500 mt-1">Deadline approaching</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-2">Chargeback Ratio</p>
          <p className="text-3xl font-bold text-gray-900">0.4%</p>
          <p className="text-xs text-green-600 mt-1">Below threshold</p>
        </CardContent>
      </Card>
    </div>

    {/* Disputes Table */}
    <Card>
      <CardHeader>
        <CardTitle>Chargebacks & Disputes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Dispute ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Merchant</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Reason</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Deadline</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { id: 'DISP-2024-0089', paymentId: 'PAY-2024-5234', merchant: 'TechCo', amount: 450, reason: 'Fraud', status: 'received', deadline: '2024-02-20' },
                { id: 'DISP-2024-0088', paymentId: 'PAY-2024-5189', merchant: 'Retail Plus', amount: 890, reason: 'Not received', status: 'responded', deadline: '2024-02-18' },
                { id: 'DISP-2024-0087', paymentId: 'PAY-2024-5124', merchant: 'Services', amount: 249, reason: 'Duplicate', status: 'won', deadline: '2024-02-15' }
              ].map((dispute, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-900">{dispute.id}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{dispute.paymentId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{dispute.merchant}</td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">${dispute.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{dispute.reason}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        dispute.status === 'won'
                          ? 'bg-green-100 text-green-700'
                          : dispute.status === 'responded'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {dispute.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{dispute.deadline}</td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" variant="outline" onClick={() => toast.info('Manage dispute')}>
                      Respond
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== COMPLIANCE PAGE =====
export const renderCompliance = () => (
  <div className="space-y-6">
    {/* Compliance Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">KYC Pending</span>
            <UserCheck className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">15</p>
          <p className="text-xs text-gray-500 mt-1">Merchants</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">AML Alerts</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <p className="text-xs text-gray-500 mt-1">High priority</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Hardship Cases</span>
            <FileWarning className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-xs text-gray-500 mt-1">Open cases</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Complaints</span>
            <AlertCircle className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">2</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </CardContent>
      </Card>
    </div>

    {/* KYC Queue */}
    <Card>
      <CardHeader>
        <CardTitle>KYC Verification Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { merchant: 'NewTech Solutions Ltd', submitted: '2024-02-10', type: 'Business', status: 'pending', priority: 'high' },
            { merchant: 'Global Retail Inc', submitted: '2024-02-12', type: 'Business', status: 'documents_required', priority: 'medium' },
            { merchant: 'Digital Services Co', submitted: '2024-02-13', type: 'Business', status: 'under_review', priority: 'low' },
            { merchant: 'Online Marketplace', submitted: '2024-02-14', type: 'Business', status: 'pending', priority: 'medium' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900">{item.merchant}</p>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      item.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : item.priority === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{item.type} verification • Submitted {item.submitted}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    item.status === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : item.status === 'under_review'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {item.status.replace('_', ' ').toUpperCase()}
                </span>
                <Button size="sm" variant="outline" onClick={() => toast.info('Review KYC')}>
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== REPORTS PAGE =====
export const renderReports = () => (
  <div className="space-y-6">
    {/* Report Categories */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { title: 'Financial Reports', desc: 'Revenue, fees, settlements', icon: DollarSign, color: 'green' },
        { title: 'Operational Reports', desc: 'Volume, approvals, failures', icon: Activity, color: 'blue' },
        { title: 'Compliance Reports', desc: 'KYC, AML, audit logs', icon: Lock, color: 'purple' }
      ].map((category, idx) => {
        const Icon = category.icon;
        return (
          <Card key={idx} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toast.info(`Opening ${category.title}`)}>
            <CardContent className="p-6">
              <div className={`p-3 bg-${category.color}-100 rounded-lg inline-block mb-4`}>
                <Icon className={`w-6 h-6 text-${category.color}-600`} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{category.title}</h3>
              <p className="text-sm text-gray-600">{category.desc}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>

    {/* Quick Reports */}
    <Card>
      <CardHeader>
        <CardTitle>Quick Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Revenue by Rail (MTD)',
            'Top Merchants by Volume',
            'Failed Payment Analysis',
            'Settlement Summary',
            'Fraud Detection Report',
            'KYC Status Report'
          ].map((report, idx) => (
            <Button key={idx} variant="outline" className="justify-start h-auto py-3" onClick={() => toast.success(`Generating ${report}...`)}>
              <FileText className="w-5 h-5 mr-3" />
              <span className="font-medium">{report}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Custom Report Builder */}
    <Card>
      <CardHeader>
        <CardTitle>Custom Report Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Transaction Analysis</option>
                <option>Revenue Analysis</option>
                <option>Customer Analysis</option>
                <option>Merchant Analysis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Month</option>
                <option>Last Month</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
          <Button className="w-full" onClick={() => toast.success('Report generated!')}>
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== DEVELOPER PAGE =====
export const renderDeveloper = () => (
  <div className="space-y-6">
    {/* API Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">API Uptime</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">99.98%</p>
          <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">API Calls (24h)</span>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">124K</p>
          <p className="text-xs text-gray-500 mt-1">Avg 86/min</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Webhook Success</span>
            <Webhook className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">98.2%</p>
          <p className="text-xs text-gray-500 mt-1">Delivery rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Keys</span>
            <Key className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-xs text-gray-500 mt-1">3 production</p>
        </CardContent>
      </Card>
    </div>

    {/* API Keys */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>API Keys</CardTitle>
          <Button size="sm" onClick={() => toast.success('API key created')}>
            <Plus className="w-4 h-4 mr-1" />
            Create Key
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { name: 'Production - Web App', key: 'pk_live_51K...', created: '2024-01-15', lastUsed: '2 min ago', env: 'live' },
            { name: 'Production - Mobile', key: 'pk_live_51M...', created: '2024-01-20', lastUsed: '5 min ago', env: 'live' },
            { name: 'Test Environment', key: 'pk_test_51K...', created: '2024-02-01', lastUsed: '1 hour ago', env: 'test' }
          ].map((apiKey, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900">{apiKey.name}</p>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      apiKey.env === 'live' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {apiKey.env.toUpperCase()}
                  </span>
                </div>
                <p className="font-mono text-xs text-gray-600">{apiKey.key}</p>
                <p className="text-xs text-gray-500 mt-1">Created {apiKey.created} • Last used {apiKey.lastUsed}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => toast.info('Rotate key')}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-red-600" onClick={() => toast.warning('Key deleted')}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Webhooks */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Webhooks</CardTitle>
          <Button size="sm" onClick={() => toast.success('Webhook created')}>
            <Plus className="w-4 h-4 mr-1" />
            Add Endpoint
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { url: 'https://api.myapp.com/webhooks/payments', events: ['payment.success', 'payment.failed'], status: 'active', lastDelivery: '2 min ago' },
            { url: 'https://api.myapp.com/webhooks/subscriptions', events: ['subscription.created', 'subscription.updated'], status: 'active', lastDelivery: '10 min ago' }
          ].map((webhook, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <p className="font-mono text-sm text-gray-900 mb-1">{webhook.url}</p>
                <p className="text-xs text-gray-500">{webhook.events.join(', ')}</p>
                <p className="text-xs text-gray-500 mt-1">Last delivery: {webhook.lastDelivery}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                  {webhook.status.toUpperCase()}
                </span>
                <Button size="sm" variant="ghost" onClick={() => toast.info('Test webhook')}>
                  <Send className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toast.info('Edit webhook')}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== SETTINGS PAGE =====
export const renderSettingsPage = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Platform Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">General</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  defaultValue="PaymentOS Platform"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                <input
                  type="email"
                  defaultValue="support@paymentos.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Auto-retry failed payments</p>
                  <p className="text-sm text-gray-500">Automatically retry failed payment attempts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email receipts</p>
                  <p className="text-sm text-gray-500">Send email receipts to customers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <Button onClick={() => toast.success('Settings saved')}>
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

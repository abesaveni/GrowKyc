import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface GrowDashboardProps {
  onNavigate?: (page: string) => void;
}

const financialData = {
  revenue: { current: 245680, previous: 198420, trend: 23.8 },
  expenses: { current: 187320, previous: 165890, trend: 12.9 },
  profit: { current: 58360, previous: 32530, trend: 79.4 },
  cashBalance: { current: 342580, previous: 298650, trend: 14.7 },
  outstandingInvoices: 89420,
  overdueInvoices: 12360,
  unpaidBills: 34780,
  clients: 48
};

const recentTransactions = [
  { id: 'TXN-001', date: '2024-02-13', description: 'Client Payment - ABC Corp', amount: 15000, type: 'income', category: 'Revenue' },
  { id: 'TXN-002', date: '2024-02-13', description: 'Office Rent - February', amount: -4500, type: 'expense', category: 'Rent' },
  { id: 'TXN-003', date: '2024-02-12', description: 'Consulting Services - XYZ Ltd', amount: 8200, type: 'income', category: 'Services' },
  { id: 'TXN-004', date: '2024-02-12', description: 'Software Subscriptions', amount: -890, type: 'expense', category: 'Technology' },
  { id: 'TXN-005', date: '2024-02-11', description: 'Client Payment - DEF Inc', amount: 12500, type: 'income', category: 'Revenue' },
];

const monthlyData = [
  { month: 'Aug', revenue: 198000, expenses: 152000, profit: 46000 },
  { month: 'Sep', revenue: 215000, expenses: 165000, profit: 50000 },
  { month: 'Oct', revenue: 232000, expenses: 171000, profit: 61000 },
  { month: 'Nov', revenue: 218000, expenses: 168000, profit: 50000 },
  { month: 'Dec', revenue: 245000, expenses: 178000, profit: 67000 },
  { month: 'Jan', revenue: 238000, expenses: 182000, profit: 56000 },
  { month: 'Feb', revenue: 246000, expenses: 187000, profit: 59000 },
];

const overdueInvoices = [
  { id: 'INV-2024-042', client: 'ABC Corporation', amount: 5200, dueDate: '2024-01-28', daysOverdue: 16 },
  { id: 'INV-2024-038', client: 'XYZ Limited', amount: 3850, dueDate: '2024-02-05', daysOverdue: 8 },
  { id: 'INV-2024-045', client: 'DEF Enterprises', amount: 3310, dueDate: '2024-02-10', daysOverdue: 3 },
];

export function GrowDashboard({ onNavigate }: GrowDashboardProps) {
  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.revenue, d.expenses)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Financial Dashboard</h1>
          <p className="text-slate-300">Overview of your financial performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-400">
                <ArrowUpRight className="w-4 h-4" />
                {financialData.revenue.trend}%
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-100">
              ${financialData.revenue.current.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              vs ${financialData.revenue.previous.toLocaleString()} last month
            </p>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-red-400">
                <ArrowUpRight className="w-4 h-4" />
                {financialData.expenses.trend}%
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-slate-100">
              ${financialData.expenses.current.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              vs ${financialData.expenses.previous.toLocaleString()} last month
            </p>
          </CardContent>
        </Card>

        {/* Net Profit */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-400">
                <ArrowUpRight className="w-4 h-4" />
                {financialData.profit.trend}%
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-1">Net Profit</p>
            <p className="text-2xl font-bold text-slate-100">
              ${financialData.profit.current.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Margin: {((financialData.profit.current / financialData.revenue.current) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        {/* Cash Balance */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-400">
                <ArrowUpRight className="w-4 h-4" />
                {financialData.cashBalance.trend}%
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-1">Cash Balance</p>
            <p className="text-2xl font-bold text-slate-100">
              ${financialData.cashBalance.current.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Available funds
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Legend */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span className="text-sm text-slate-300">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded" />
                  <span className="text-sm text-slate-300">Expenses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded" />
                  <span className="text-sm text-slate-300">Profit</span>
                </div>
              </div>

              {/* Chart */}
              <div className="flex items-end justify-between gap-3 h-64">
                {monthlyData.map((data) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      <div
                        className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer relative group"
                        style={{ height: `${(data.revenue / maxValue) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${(data.revenue / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div
                        className="w-full bg-red-500 rounded-t hover:bg-red-600 transition-colors cursor-pointer relative group"
                        style={{ height: `${(data.expenses / maxValue) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${(data.expenses / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Outstanding Invoices</span>
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-slate-100">
                  ${financialData.outstandingInvoices.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">Awaiting payment</p>
              </div>

              <div className="p-4 bg-red-500/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Overdue Invoices</span>
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-2xl font-bold text-slate-100">
                  ${financialData.overdueInvoices.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">{overdueInvoices.length} invoices</p>
              </div>

              <div className="p-4 bg-amber-500/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Unpaid Bills</span>
                  <CreditCard className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-slate-100">
                  ${financialData.unpaidBills.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">Due this month</p>
              </div>

              <div className="p-4 bg-green-500/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Active Clients</span>
                  <Users className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-slate-100">{financialData.clients}</p>
                <p className="text-xs text-slate-400 mt-1">Total clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate?.('transactions')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${txn.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      {txn.type === 'income' ? (
                        <ArrowDownRight className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-100">{txn.description}</p>
                      <p className="text-xs text-slate-400">{txn.date} • {txn.category}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${txn.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {txn.type === 'income' ? '+' : ''} ${Math.abs(txn.amount).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overdue Invoices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Overdue Invoices</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate?.('invoices')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueInvoices.map((invoice) => (
                <div key={invoice.id} className="p-4 border border-red-500/30 bg-red-500/10 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono text-slate-300">{invoice.id}</span>
                        <span className="px-2 py-0.5 bg-red-500/15 text-red-300 text-xs font-semibold rounded">
                          {invoice.daysOverdue}d overdue
                        </span>
                      </div>
                      <p className="font-semibold text-slate-100">{invoice.client}</p>
                      <p className="text-xs text-slate-300 mt-1">Due: {invoice.dueDate}</p>
                    </div>
                    <p className="text-lg font-bold text-slate-100">${invoice.amount.toLocaleString()}</p>
                  </div>
                  <Button size="sm" className="w-full mt-2 bg-[#2855a6] hover:bg-[#1e4089]">
                    Send Reminder
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

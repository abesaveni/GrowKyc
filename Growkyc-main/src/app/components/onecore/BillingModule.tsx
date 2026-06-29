import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  FileText,
  Calendar,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Percent,
  User,
  Building2,
  Mail,
  MoreVertical,
  X,
  Receipt,
  Repeat
} from 'lucide-react';

interface BillingModuleProps {
  role: string;
}

export function BillingModule({ role }: BillingModuleProps) {
  const [activeTab, setActiveTab] = useState<'invoices' | 'subscriptions' | 'payments'>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const mockInvoices = [
    {
      id: 'INV-2024-001',
      client: 'TechCorp Solutions',
      amount: 4500,
      status: 'paid',
      dueDate: '2024-02-15',
      issueDate: '2024-02-01',
      paidDate: '2024-02-10',
      items: [
        { description: 'Website Redesign - Phase 1', quantity: 1, rate: 3500, amount: 3500 },
        { description: 'SEO Optimization', quantity: 1, rate: 1000, amount: 1000 }
      ]
    },
    {
      id: 'INV-2024-002',
      client: 'Innovate Labs',
      amount: 7250,
      status: 'pending',
      dueDate: '2024-03-01',
      issueDate: '2024-02-14',
      paidDate: null,
      items: [
        { description: 'Mobile App Development', quantity: 50, rate: 125, amount: 6250 },
        { description: 'Cloud Infrastructure Setup', quantity: 1, rate: 1000, amount: 1000 }
      ]
    },
    {
      id: 'INV-2024-003',
      client: 'Global Tech Inc',
      amount: 2800,
      status: 'overdue',
      dueDate: '2024-02-05',
      issueDate: '2024-01-20',
      paidDate: null,
      items: [
        { description: 'Marketing Campaign Services', quantity: 1, rate: 2800, amount: 2800 }
      ]
    },
    {
      id: 'INV-2024-004',
      client: 'StartUp Co',
      amount: 1500,
      status: 'draft',
      dueDate: '2024-03-10',
      issueDate: null,
      paidDate: null,
      items: [
        { description: 'Consulting Services', quantity: 10, rate: 150, amount: 1500 }
      ]
    }
  ];

  const mockSubscriptions: Array<{
    id: string;
    client: string;
    plan: string;
    amount: number;
    frequency: string;
    status: string;
    nextBilling: string | null;
    startDate: string;
    endDate?: string;
  }> = [
    {
      id: 'SUB-001',
      client: 'TechCorp Solutions',
      plan: 'Enterprise Plan',
      amount: 299,
      frequency: 'monthly',
      status: 'active',
      nextBilling: '2024-03-01',
      startDate: '2023-06-01'
    },
    {
      id: 'SUB-002',
      client: 'Innovate Labs',
      plan: 'Professional Plan',
      amount: 149,
      frequency: 'monthly',
      status: 'active',
      nextBilling: '2024-02-28',
      startDate: '2024-01-15'
    },
    {
      id: 'SUB-003',
      client: 'Global Tech Inc',
      plan: 'Basic Plan',
      amount: 49,
      frequency: 'monthly',
      status: 'cancelled',
      nextBilling: null,
      startDate: '2023-12-01',
      endDate: '2024-02-01'
    }
  ];

  const mockPayments = [
    {
      id: 'PAY-001',
      invoice: 'INV-2024-001',
      client: 'TechCorp Solutions',
      amount: 4500,
      method: 'Credit Card',
      date: '2024-02-10',
      status: 'completed'
    },
    {
      id: 'PAY-002',
      invoice: 'SUB-001',
      client: 'TechCorp Solutions',
      amount: 299,
      method: 'Auto-debit',
      date: '2024-02-01',
      status: 'completed'
    },
    {
      id: 'PAY-003',
      invoice: 'SUB-002',
      client: 'Innovate Labs',
      amount: 149,
      method: 'Credit Card',
      date: '2024-01-28',
      status: 'completed'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Billing & Invoicing</h1>
          <p className="text-slate-300 mt-1">Manage invoices, subscriptions, and payment processing</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-300">Total Revenue</p>
            <DollarSign className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">
            ${mockInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
          </p>
          <p className="text-xs text-green-400 mt-1">+15.2% from last month</p>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-300">Outstanding</p>
            <Clock className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">
            ${mockInvoices.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">{mockInvoices.filter(i => i.status === 'pending' || i.status === 'overdue').length} invoices</p>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-300">MRR</p>
            <RefreshCw className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">
            ${mockSubscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
          </p>
          <p className="text-xs text-blue-400 mt-1">Monthly recurring</p>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-300">Active Subscriptions</p>
            <Repeat className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">
            {mockSubscriptions.filter(s => s.status === 'active').length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Recurring revenue</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-white/10 rounded-lg overflow-hidden">
        <div className="border-b border-white/10 flex">
          {[
            { id: 'invoices', label: 'Invoices', icon: FileText },
            { id: 'subscriptions', label: 'Subscriptions', icon: Repeat },
            { id: 'payments', label: 'Payment History', icon: CreditCard }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-400 font-medium bg-indigo-500/10'
                    : 'border-transparent text-slate-300 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search invoices..."
                    className="pl-10 pr-4 py-2 w-full border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Invoices Table */}
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Invoice</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Due Date</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {mockInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-white/5">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-slate-100">{invoice.id}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-100">{invoice.client}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-slate-100">${invoice.amount.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'paid' ? 'bg-green-500/15 text-green-300' :
                            invoice.status === 'pending' ? 'bg-blue-500/15 text-blue-300' :
                            invoice.status === 'overdue' ? 'bg-red-500/15 text-red-300' :
                            'bg-white/5 text-slate-100'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-100">{invoice.dueDate}</p>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedInvoice(invoice)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Send className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="space-y-4">
              {/* Subscriptions List */}
              <div className="space-y-3">
                {mockSubscriptions.map((sub) => (
                  <div key={sub.id} className="border border-white/10 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                          <Repeat className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-100">{sub.plan}</p>
                          <p className="text-sm text-slate-300">{sub.client}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-100">${sub.amount}</p>
                        <p className="text-xs text-slate-400">per {sub.frequency}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/10">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Status</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          sub.status === 'active' ? 'bg-green-500/15 text-green-300' :
                          'bg-white/5 text-slate-100'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Start Date</p>
                        <p className="text-sm font-medium text-slate-100">{sub.startDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Next Billing</p>
                        <p className="text-sm font-medium text-slate-100">{sub.nextBilling || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      {sub.status === 'active' && (
                        <Button variant="outline" size="sm">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              {/* Payments Table */}
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Payment ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Invoice</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Method</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {mockPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-white/5">
                        <td className="px-4 py-4">
                          <span className="font-medium text-slate-100">{payment.id}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-100">{payment.invoice}</span>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-100">{payment.client}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-slate-100">${payment.amount.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-slate-100">{payment.method}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-100">{payment.date}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-300">
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}

// Invoice Detail Modal
function InvoiceDetailModal({ invoice, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">Invoice Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Invoice Content */}
        <div className="p-8 space-y-8">
          {/* Invoice Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-3xl font-bold text-slate-100 mb-2">{invoice.id}</h3>
              <p className="text-sm text-slate-300">Issue Date: {invoice.issueDate}</p>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              invoice.status === 'paid' ? 'bg-green-500/15 text-green-300' :
              invoice.status === 'pending' ? 'bg-blue-500/15 text-blue-300' :
              invoice.status === 'overdue' ? 'bg-red-500/15 text-red-300' :
              'bg-white/5 text-slate-100'
            }`}>
              {invoice.status.toUpperCase()}
            </span>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-2">BILL TO</p>
              <p className="font-semibold text-slate-100">{invoice.client}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-2">DUE DATE</p>
              <p className="font-semibold text-slate-100">{invoice.dueDate}</p>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <table className="w-full">
              <thead className="border-b-2 border-white/10">
                <tr>
                  <th className="py-3 text-left text-sm font-semibold text-slate-300">DESCRIPTION</th>
                  <th className="py-3 text-right text-sm font-semibold text-slate-300">QTY</th>
                  <th className="py-3 text-right text-sm font-semibold text-slate-300">RATE</th>
                  <th className="py-3 text-right text-sm font-semibold text-slate-300">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {invoice.items.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-4 text-sm text-slate-100">{item.description}</td>
                    <td className="py-4 text-right text-sm text-slate-100">{item.quantity}</td>
                    <td className="py-4 text-right text-sm text-slate-100">${item.rate}</td>
                    <td className="py-4 text-right text-sm font-semibold text-slate-100">${item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between py-2 border-t border-white/10">
                <span className="text-sm text-slate-300">Subtotal</span>
                <span className="text-sm font-medium text-slate-100">${invoice.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-white/10">
                <span className="font-semibold text-slate-100">Total</span>
                <span className="text-xl font-bold text-slate-100">${invoice.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white/5 border-t border-white/10 p-6 flex items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Send className="w-4 h-4 mr-2" />
              Send to Client
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EmptyState } from '../ui/empty-state';
import { SearchBar, FiltersBar, SortBar } from '../ui/filters';
import { 
  Plus, 
  FileText, 
  Send, 
  Eye, 
  Download, 
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { toast } from '../../lib/toast';

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
}

interface InvoicesPageProps {
  onNavigate?: (page: string) => void;
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    invoiceNumber: 'INV-2024-001',
    client: 'ABC Corporation',
    date: '2024-02-01',
    dueDate: '2024-02-15',
    amount: 15000,
    status: 'paid',
    items: [
      { description: 'Consulting Services - February', quantity: 1, rate: 15000, amount: 15000 }
    ]
  },
  {
    id: 'INV-002',
    invoiceNumber: 'INV-2024-002',
    client: 'XYZ Limited',
    date: '2024-02-05',
    dueDate: '2024-02-19',
    amount: 8500,
    status: 'sent',
    items: [
      { description: 'Web Development Services', quantity: 1, rate: 8500, amount: 8500 }
    ]
  },
  {
    id: 'INV-003',
    invoiceNumber: 'INV-2024-003',
    client: 'DEF Enterprises',
    date: '2024-01-28',
    dueDate: '2024-02-11',
    amount: 5200,
    status: 'overdue',
    items: [
      { description: 'Monthly Retainer - January', quantity: 1, rate: 5200, amount: 5200 }
    ]
  },
  {
    id: 'INV-004',
    invoiceNumber: 'INV-2024-004',
    client: 'GHI Holdings',
    date: '2024-02-10',
    dueDate: '2024-02-24',
    amount: 12800,
    status: 'sent',
    items: [
      { description: 'Software License', quantity: 4, rate: 3200, amount: 12800 }
    ]
  },
  {
    id: 'INV-005',
    invoiceNumber: 'INV-2024-005',
    client: 'JKL Solutions',
    date: '2024-02-13',
    dueDate: '2024-02-27',
    amount: 3450,
    status: 'draft',
    items: [
      { description: 'Consulting - Phase 1', quantity: 1, rate: 3450, amount: 3450 }
    ]
  }
];

export function InvoicesPage({ onNavigate }: InvoicesPageProps) {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    if (searchQuery && !invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.status && invoice.status !== filters.status) {
      return false;
    }
    return true;
  });

  // Sort invoices
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    let aVal, bVal;
    if (sortBy === 'date') {
      aVal = new Date(a.date).getTime();
      bVal = new Date(b.date).getTime();
    } else if (sortBy === 'amount') {
      aVal = a.amount;
      bVal = b.amount;
    } else {
      aVal = a.client;
      bVal = b.client;
    }
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const getStatusBadge = (status: Invoice['status']) => {
    const config = {
      draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
      sent: { label: 'Sent', className: 'bg-blue-100 text-blue-700' },
      paid: { label: 'Paid', className: 'bg-green-100 text-green-700' },
      overdue: { label: 'Overdue', className: 'bg-red-100 text-red-700' },
      cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-500' }
    };
    
    const { label, className } = config[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
        {label}
      </span>
    );
  };

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'sent':
        return <Send className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleSendInvoice = (invoiceId: string) => {
    toast.success('Invoice sent successfully!', {
      description: 'Email notification has been sent to the client'
    });
  };

  const handleDownload = (invoiceId: string) => {
    toast.success('Invoice downloaded');
  };

  const stats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
    paidAmount: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
    outstandingAmount: invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600">Manage and track your invoices</p>
        </div>
        <Button 
          className="bg-[#2855a6] hover:bg-[#1e4089]"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Invoices</span>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Outstanding</span>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">${stats.outstandingAmount.toLocaleString()}</p>
            <p className="text-xs text-blue-600 mt-1">{stats.sent + stats.overdue} invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Paid</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">${stats.paidAmount.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">{stats.paid} invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Overdue</span>
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
            <p className="text-xs text-red-600 mt-1">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search invoices by client or number..."
          />
        </div>
        <SortBar
          options={[
            { label: 'Date', value: 'date' },
            { label: 'Amount', value: 'amount' },
            { label: 'Client', value: 'client' }
          ]}
          value={sortBy}
          onChange={setSortBy}
          direction={sortDirection}
          onDirectionChange={setSortDirection}
        />
      </div>

      <FiltersBar
        filters={[
          {
            id: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { label: 'Draft', value: 'draft' },
              { label: 'Sent', value: 'sent' },
              { label: 'Paid', value: 'paid' },
              { label: 'Overdue', value: 'overdue' },
              { label: 'Cancelled', value: 'cancelled' }
            ]
          }
        ]}
        onFilterChange={(id, value) => setFilters({ ...filters, [id]: value })}
        onClearAll={() => setFilters({})}
        activeFilters={filters}
      />

      {/* Invoices List */}
      {sortedInvoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices found"
          description={searchQuery || Object.keys(filters).length > 0 
            ? "No invoices match your search criteria. Try adjusting your filters."
            : "You haven't created any invoices yet. Click 'Create Invoice' to get started."
          }
          actionLabel="Create Invoice"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Client</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Due Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(invoice.status)}
                          <span className="font-mono text-sm font-semibold text-gray-900">
                            {invoice.invoiceNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{invoice.client}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{invoice.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{invoice.dueDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          ${invoice.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.info('Opening invoice preview...')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {invoice.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendInvoice(invoice.id)}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(invoice.id)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
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
      )}

      {/* Create Invoice Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Create New Invoice</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Client</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Select a client</option>
                    <option>ABC Corporation</option>
                    <option>XYZ Limited</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Invoice Date</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Due Date</label>
                    <Input type="date" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Items</label>
                  <div className="border rounded-lg p-4 space-y-3">
                    <Input placeholder="Description" />
                    <div className="grid grid-cols-3 gap-3">
                      <Input type="number" placeholder="Quantity" />
                      <Input type="number" placeholder="Rate" />
                      <Input type="number" placeholder="Amount" disabled />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {
                      toast.success('Invoice saved as draft');
                      setShowCreateModal(false);
                    }}>
                      Save as Draft
                    </Button>
                    <Button className="bg-[#2855a6]" onClick={() => {
                      toast.success('Invoice created and sent!');
                      setShowCreateModal(false);
                    }}>
                      Create & Send
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

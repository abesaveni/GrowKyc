import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { EmptyState } from '../ui/empty-state';
import { SearchBar, FiltersBar, SortBar } from '../ui/filters';
import { 
  Plus, 
  Receipt, 
  CreditCard, 
  Eye, 
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { toast } from '../../lib/toast';

interface Bill {
  id: string;
  billNumber: string;
  vendor: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'unpaid' | 'scheduled' | 'paid' | 'overdue';
  category: string;
}

const mockBills: Bill[] = [
  {
    id: 'BILL-001',
    billNumber: 'BILL-2024-001',
    vendor: 'Office Supplies Co',
    date: '2024-02-01',
    dueDate: '2024-02-15',
    amount: 1250,
    status: 'paid',
    category: 'Office Supplies'
  },
  {
    id: 'BILL-002',
    billNumber: 'BILL-2024-002',
    vendor: 'Tech Solutions Ltd',
    date: '2024-02-05',
    dueDate: '2024-02-19',
    amount: 4500,
    status: 'scheduled',
    category: 'Software'
  },
  {
    id: 'BILL-003',
    billNumber: 'BILL-2024-003',
    vendor: 'Utilities Provider',
    date: '2024-01-28',
    dueDate: '2024-02-11',
    amount: 890,
    status: 'overdue',
    category: 'Utilities'
  },
  {
    id: 'BILL-004',
    billNumber: 'BILL-2024-004',
    vendor: 'Rent Management',
    date: '2024-02-01',
    dueDate: '2024-02-28',
    amount: 4500,
    status: 'unpaid',
    category: 'Rent'
  },
  {
    id: 'BILL-005',
    billNumber: 'BILL-2024-005',
    vendor: 'Marketing Agency',
    date: '2024-02-10',
    dueDate: '2024-02-24',
    amount: 3200,
    status: 'unpaid',
    category: 'Marketing'
  }
];

export function BillsPage() {
  const [bills, setBills] = useState(mockBills);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredBills = bills.filter(bill => {
    if (searchQuery && !bill.vendor.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.status && bill.status !== filters.status) {
      return false;
    }
    if (filters.category && bill.category !== filters.category) {
      return false;
    }
    return true;
  });

  const sortedBills = [...filteredBills].sort((a, b) => {
    let aVal, bVal;
    if (sortBy === 'dueDate') {
      aVal = new Date(a.dueDate).getTime();
      bVal = new Date(b.dueDate).getTime();
    } else if (sortBy === 'amount') {
      aVal = a.amount;
      bVal = b.amount;
    } else {
      aVal = a.vendor;
      bVal = b.vendor;
    }
    
    return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  const getStatusBadge = (status: Bill['status']) => {
    const config = {
      unpaid: { label: 'Unpaid', className: 'bg-white/5 text-slate-300' },
      scheduled: { label: 'Scheduled', className: 'bg-blue-500/15 text-blue-300' },
      paid: { label: 'Paid', className: 'bg-green-500/15 text-green-300' },
      overdue: { label: 'Overdue', className: 'bg-red-500/15 text-red-300' }
    };
    
    const { label, className } = config[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
        {label}
      </span>
    );
  };

  const handlePayNow = (billId: string) => {
    toast.success('Payment initiated', 'Payment is being processed');
  };

  const handleSchedulePayment = (billId: string) => {
    toast.success('Payment scheduled', 'Payment will be processed on the due date');
  };

  const stats = {
    total: bills.length,
    unpaid: bills.filter(b => b.status === 'unpaid').length,
    scheduled: bills.filter(b => b.status === 'scheduled').length,
    paid: bills.filter(b => b.status === 'paid').length,
    overdue: bills.filter(b => b.status === 'overdue').length,
    totalAmount: bills.reduce((sum, b) => sum + b.amount, 0),
    unpaidAmount: bills.filter(b => b.status === 'unpaid' || b.status === 'overdue').reduce((sum, b) => sum + b.amount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Bills</h1>
          <p className="text-slate-300">Manage and pay your bills</p>
        </div>
        <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
          <Plus className="w-4 h-4 mr-2" />
          Add Bill
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Total Bills</span>
              <Receipt className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">{stats.total}</p>
            <p className="text-xs text-slate-400 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Unpaid</span>
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">${stats.unpaidAmount.toLocaleString()}</p>
            <p className="text-xs text-amber-400 mt-1">{stats.unpaid + stats.overdue} bills</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Scheduled</span>
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">{stats.scheduled}</p>
            <p className="text-xs text-blue-400 mt-1">Auto-pay enabled</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Overdue</span>
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">{stats.overdue}</p>
            <p className="text-xs text-red-400 mt-1">Requires immediate action</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search bills by vendor or number..."
          />
        </div>
        <SortBar
          options={[
            { label: 'Due Date', value: 'dueDate' },
            { label: 'Amount', value: 'amount' },
            { label: 'Vendor', value: 'vendor' }
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
              { label: 'Unpaid', value: 'unpaid' },
              { label: 'Scheduled', value: 'scheduled' },
              { label: 'Paid', value: 'paid' },
              { label: 'Overdue', value: 'overdue' }
            ]
          },
          {
            id: 'category',
            label: 'Category',
            type: 'select',
            options: [
              { label: 'Office Supplies', value: 'Office Supplies' },
              { label: 'Software', value: 'Software' },
              { label: 'Utilities', value: 'Utilities' },
              { label: 'Rent', value: 'Rent' },
              { label: 'Marketing', value: 'Marketing' }
            ]
          }
        ]}
        onFilterChange={(id, value) => setFilters({ ...filters, [id]: value })}
        onClearAll={() => setFilters({})}
        activeFilters={filters}
      />

      {/* Bills List */}
      {sortedBills.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No bills found"
          description={searchQuery || Object.keys(filters).length > 0 
            ? "No bills match your search criteria. Try adjusting your filters."
            : "You haven't added any bills yet. Click 'Add Bill' to get started."
          }
          actionLabel="Add Bill"
          onAction={() => toast.info('Opening add bill form...')}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Bill</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Vendor</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Category</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Due Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {sortedBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-slate-100">
                          {bill.billNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-100">{bill.vendor}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-1 bg-white/5 text-slate-300 rounded-full">
                          {bill.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-300">{bill.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-300">{bill.dueDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-100">
                          ${bill.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(bill.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {(bill.status === 'unpaid' || bill.status === 'overdue') && (
                            <>
                              <Button
                                size="sm"
                                className="bg-[#2855a6] hover:bg-[#1e4089]"
                                onClick={() => handlePayNow(bill.id)}
                              >
                                <CreditCard className="w-4 h-4 mr-1" />
                                Pay Now
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSchedulePayment(bill.id)}
                              >
                                <Clock className="w-4 h-4 mr-1" />
                                Schedule
                              </Button>
                            </>
                          )}
                          {bill.status === 'paid' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.success('Receipt downloaded')}
                            >
                              <Download className="w-4 h-4" />
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
      )}
    </div>
  );
}

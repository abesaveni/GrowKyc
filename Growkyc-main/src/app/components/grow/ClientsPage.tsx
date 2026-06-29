import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { EmptyState } from '../ui/empty-state';
import { SearchBar, FiltersBar, SortBar } from '../ui/filters';
import { 
  Plus, 
  Users, 
  Mail, 
  Phone, 
  MapPin,
  DollarSign,
  FileText,
  Eye,
  Edit,
  MoreVertical,
  TrendingUp
} from 'lucide-react';
import { toast } from '../../lib/toast';

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  totalInvoiced: number;
  totalPaid: number;
  outstandingBalance: number;
  invoiceCount: number;
  status: 'active' | 'inactive';
  lastInvoice: string;
}

const mockClients: Client[] = [
  {
    id: 'CLI-001',
    name: 'John Smith',
    company: 'ABC Corporation',
    email: 'john@abc corp.com',
    phone: '+61 2 1234 5678',
    address: 'Sydney, NSW',
    totalInvoiced: 45000,
    totalPaid: 40000,
    outstandingBalance: 5000,
    invoiceCount: 8,
    status: 'active',
    lastInvoice: '2024-02-01'
  },
  {
    id: 'CLI-002',
    name: 'Sarah Johnson',
    company: 'XYZ Limited',
    email: 'sarah@xyzltd.com',
    phone: '+61 3 2345 6789',
    address: 'Melbourne, VIC',
    totalInvoiced: 32000,
    totalPaid: 32000,
    outstandingBalance: 0,
    invoiceCount: 6,
    status: 'active',
    lastInvoice: '2024-02-05'
  },
  {
    id: 'CLI-003',
    name: 'Michael Brown',
    company: 'DEF Enterprises',
    email: 'michael@defent.com',
    phone: '+61 7 3456 7890',
    address: 'Brisbane, QLD',
    totalInvoiced: 28500,
    totalPaid: 23300,
    outstandingBalance: 5200,
    invoiceCount: 5,
    status: 'active',
    lastInvoice: '2024-01-28'
  },
  {
    id: 'CLI-004',
    name: 'Emily Davis',
    company: 'GHI Holdings',
    email: 'emily@ghihold.com',
    phone: '+61 8 4567 8901',
    address: 'Perth, WA',
    totalInvoiced: 51000,
    totalPaid: 51000,
    outstandingBalance: 0,
    invoiceCount: 12,
    status: 'active',
    lastInvoice: '2024-02-10'
  },
  {
    id: 'CLI-005',
    name: 'David Wilson',
    company: 'JKL Solutions',
    email: 'david@jklsol.com',
    phone: '+61 2 5678 9012',
    address: 'Adelaide, SA',
    totalInvoiced: 18500,
    totalPaid: 15050,
    outstandingBalance: 3450,
    invoiceCount: 3,
    status: 'active',
    lastInvoice: '2024-02-13'
  }
];

export function ClientsPage() {
  const [clients, setClients] = useState(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredClients = clients.filter(client => {
    if (searchQuery && 
        !client.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !client.company.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !client.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.status && client.status !== filters.status) {
      return false;
    }
    return true;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    let aVal, bVal;
    if (sortBy === 'name') {
      aVal = a.name;
      bVal = b.name;
    } else if (sortBy === 'totalInvoiced') {
      aVal = a.totalInvoiced;
      bVal = b.totalInvoiced;
    } else {
      aVal = a.outstandingBalance;
      bVal = b.outstandingBalance;
    }
    
    return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalPaid, 0),
    totalOutstanding: clients.reduce((sum, c) => sum + c.outstandingBalance, 0),
    avgInvoiceValue: clients.reduce((sum, c) => sum + c.totalInvoiced, 0) / clients.reduce((sum, c) => sum + c.invoiceCount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Clients</h1>
          <p className="text-slate-300">Manage your client relationships</p>
        </div>
        <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Total Clients</span>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">{stats.total}</p>
            <p className="text-xs text-green-400 mt-1">{stats.active} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">${stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Outstanding</span>
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">${stats.totalOutstanding.toLocaleString()}</p>
            <p className="text-xs text-amber-400 mt-1">To be collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Avg Invoice</span>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">${stats.avgInvoiceValue.toLocaleString()}</p>
            <p className="text-xs text-blue-400 mt-1">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search clients by name, company, or email..."
          />
        </div>
        <SortBar
          options={[
            { label: 'Name', value: 'name' },
            { label: 'Total Invoiced', value: 'totalInvoiced' },
            { label: 'Outstanding', value: 'outstandingBalance' }
          ]}
          value={sortBy}
          onChange={setSortBy}
          direction={sortDirection}
          onDirectionChange={setSortDirection}
        />
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            Cards
          </Button>
        </div>
      </div>

      <FiltersBar
        filters={[
          {
            id: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ]
          }
        ]}
        onFilterChange={(id, value) => setFilters({ ...filters, [id]: value })}
        onClearAll={() => setFilters({})}
        activeFilters={filters}
      />

      {/* Clients Display */}
      {sortedClients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clients found"
          description={searchQuery || Object.keys(filters).length > 0 
            ? "No clients match your search criteria. Try adjusting your filters."
            : "You haven't added any clients yet. Click 'Add Client' to get started."
          }
          actionLabel="Add Client"
          onAction={() => toast.info('Opening add client form...')}
        />
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-100">{client.name}</h3>
                    <p className="text-sm text-slate-300">{client.company}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Phone className="w-4 h-4" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <MapPin className="w-4 h-4" />
                    <span>{client.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-slate-400">Total Invoiced</p>
                    <p className="font-semibold text-slate-100">${client.totalInvoiced.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Outstanding</p>
                    <p className="font-semibold text-slate-100">${client.outstandingBalance.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="w-4 h-4 mr-1" />
                    Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Client</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Company</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Contact</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Location</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Invoices</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Total</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Outstanding</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {sortedClients.map((client) => (
                    <tr key={client.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-100">{client.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-300">{client.company}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-slate-300">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{client.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-300">
                            <Phone className="w-3 h-3" />
                            <span>{client.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-300">{client.address}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-slate-100">{client.invoiceCount}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-slate-100">
                          ${client.totalInvoiced.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-semibold ${client.outstandingBalance > 0 ? 'text-amber-400' : 'text-green-400'}`}>
                          ${client.outstandingBalance.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
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
    </div>
  );
}

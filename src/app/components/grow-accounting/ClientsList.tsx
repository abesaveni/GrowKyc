import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Building2,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  User,
  FileText,
  DollarSign
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface Client {
  id: string;
  name: string;
  abn: string;
  entityType: 'Individual' | 'Company' | 'Trust' | 'Partnership' | 'SMSF';
  status: 'active' | 'inactive' | 'onboarding';
  performanceScore: number;
  contactEmail: string;
  contactPhone: string;
  assignedManager: string;
  lastActivity: string;
  revenue: number;
  activeJobs: number;
  completedJobs: number;
  nextDeadline: string;
}

interface ClientsListProps {
  onNavigate?: (page: string, clientId?: string, clientName?: string) => void;
}

const mockClients: Client[] = [
  {
    id: 'CLI-001',
    name: 'ABC Pty Ltd',
    abn: '12 345 678 901',
    entityType: 'Company',
    status: 'active',
    performanceScore: 92,
    contactEmail: 'director@abcptyltd.com.au',
    contactPhone: '02 9876 5432',
    assignedManager: 'John Smith',
    lastActivity: '2 hours ago',
    revenue: 125000,
    activeJobs: 3,
    completedJobs: 12,
    nextDeadline: '2024-03-15'
  },
  {
    id: 'CLI-002',
    name: 'XYZ Family Trust',
    abn: '98 765 432 109',
    entityType: 'Trust',
    status: 'active',
    performanceScore: 88,
    contactEmail: 'trustee@xyzfamily.com.au',
    contactPhone: '03 1234 5678',
    assignedManager: 'Sarah Johnson',
    lastActivity: '1 day ago',
    revenue: 85000,
    activeJobs: 2,
    completedJobs: 8,
    nextDeadline: '2024-03-20'
  },
  {
    id: 'CLI-003',
    name: 'Smith Superannuation Fund',
    abn: '45 678 901 234',
    entityType: 'SMSF',
    status: 'active',
    performanceScore: 95,
    contactEmail: 'contact@smithsuper.com.au',
    contactPhone: '07 8765 4321',
    assignedManager: 'Mike Brown',
    lastActivity: '3 hours ago',
    revenue: 156000,
    activeJobs: 4,
    completedJobs: 15,
    nextDeadline: '2024-03-18'
  },
  {
    id: 'CLI-004',
    name: 'Johnson & Partners',
    abn: '23 456 789 012',
    entityType: 'Partnership',
    status: 'active',
    performanceScore: 78,
    contactEmail: 'partners@johnsonco.com.au',
    contactPhone: '08 2345 6789',
    assignedManager: 'Tom Wilson',
    lastActivity: '2 days ago',
    revenue: 92000,
    activeJobs: 1,
    completedJobs: 6,
    nextDeadline: '2024-03-25'
  },
  {
    id: 'CLI-005',
    name: 'Michael Brown',
    abn: '67 890 123 456',
    entityType: 'Individual',
    status: 'active',
    performanceScore: 100,
    contactEmail: 'michael.brown@email.com',
    contactPhone: '02 3456 7890',
    assignedManager: 'Sarah Johnson',
    lastActivity: '4 hours ago',
    revenue: 45000,
    activeJobs: 1,
    completedJobs: 5,
    nextDeadline: '2024-03-22'
  },
  {
    id: 'CLI-006',
    name: 'DEF Enterprises Pty Ltd',
    abn: '34 567 890 123',
    entityType: 'Company',
    status: 'active',
    performanceScore: 85,
    contactEmail: 'admin@defenterprises.com.au',
    contactPhone: '03 4567 8901',
    assignedManager: 'John Smith',
    lastActivity: '1 hour ago',
    revenue: 210000,
    activeJobs: 5,
    completedJobs: 18,
    nextDeadline: '2024-03-12'
  },
  {
    id: 'CLI-007',
    name: 'GHI Investment Trust',
    abn: '56 789 012 345',
    entityType: 'Trust',
    status: 'onboarding',
    performanceScore: 0,
    contactEmail: 'info@ghitrust.com.au',
    contactPhone: '07 5678 9012',
    assignedManager: 'Emily Davis',
    lastActivity: '5 days ago',
    revenue: 0,
    activeJobs: 0,
    completedJobs: 0,
    nextDeadline: '2024-04-01'
  },
  {
    id: 'CLI-008',
    name: 'Wilson Retirement Fund',
    abn: '78 901 234 567',
    entityType: 'SMSF',
    status: 'active',
    performanceScore: 91,
    contactEmail: 'trustees@wilsonsfund.com.au',
    contactPhone: '08 6789 0123',
    assignedManager: 'Mike Brown',
    lastActivity: '6 hours ago',
    revenue: 142000,
    activeJobs: 3,
    completedJobs: 11,
    nextDeadline: '2024-03-28'
  },
  {
    id: 'CLI-009',
    name: 'LMN Holdings Pty Ltd',
    abn: '89 012 345 678',
    entityType: 'Company',
    status: 'inactive',
    performanceScore: 65,
    contactEmail: 'contact@lmnholdings.com.au',
    contactPhone: '02 7890 1234',
    assignedManager: 'Tom Wilson',
    lastActivity: '45 days ago',
    revenue: 78000,
    activeJobs: 0,
    completedJobs: 4,
    nextDeadline: 'N/A'
  }
];

export function ClientsList({ onNavigate }: ClientsListProps) {
  const [clients, setClients] = useState(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.abn.includes(searchQuery) ||
                         client.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEntity = filterEntity === 'all' || client.entityType === filterEntity;
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesEntity && matchesStatus;
  });

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'Company': return '🏢';
      case 'Trust': return '🤝';
      case 'Partnership': return '👥';
      case 'SMSF': return '💼';
      case 'Individual': return '👤';
      default: return '📄';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
            Inactive
          </span>
        );
      case 'onboarding':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            Onboarding
          </span>
        );
      default:
        return null;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <WorkpaperLayout currentPage="clients" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900">Clients</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your client portfolio</p>
          </div>
          <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </div>

        {/* Filters */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clients by name, ABN, email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                  />
                </div>
              </div>

              {/* Entity Filter */}
              <select
                value={filterEntity}
                onChange={(e) => setFilterEntity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
              >
                <option value="all">All Entity Types</option>
                <option value="Company">Company</option>
                <option value="Trust">Trust</option>
                <option value="Partnership">Partnership</option>
                <option value="SMSF">SMSF</option>
                <option value="Individual">Individual</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="onboarding">Onboarding</option>
              </select>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredClients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredClients.filter(c => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredClients.reduce((sum, c) => sum + c.activeJobs, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(filteredClients.reduce((sum, c) => sum + c.revenue, 0) / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              className="cursor-pointer hover:shadow-lg transition-all shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
              onClick={() => onNavigate?.('client-detail', client.id)}
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getEntityIcon(client.entityType)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      <p className="text-xs text-gray-500 font-mono">{client.abn}</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Status & Score */}
                <div className="flex items-center justify-between mb-4">
                  {getStatusBadge(client.status)}
                  {client.performanceScore > 0 && (
                    <div className={`text-sm font-semibold ${getPerformanceColor(client.performanceScore)}`}>
                      {client.performanceScore}% Score
                    </div>
                  )}
                </div>

                {/* Entity Type */}
                <div className="mb-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    {client.entityType}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{client.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Phone className="w-3 h-3" />
                    <span>{client.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <User className="w-3 h-3" />
                    <span>Managed by {client.assignedManager}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Active</p>
                    <p className="text-lg font-bold text-blue-600">{client.activeJobs}</p>
                  </div>
                  <div className="text-center border-l border-r border-gray-100">
                    <p className="text-xs text-gray-600">Complete</p>
                    <p className="text-lg font-bold text-green-600">{client.completedJobs}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Revenue</p>
                    <p className="text-lg font-bold text-purple-600">${(client.revenue / 1000).toFixed(0)}K</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate?.('documents', client.id, client.name);
                    }}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Documents
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-[#2855a6] hover:bg-[#1e4089]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate?.('client-detail', client.id);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No clients found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
              <Button variant="outline">Clear Filters</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </WorkpaperLayout>
  );
}
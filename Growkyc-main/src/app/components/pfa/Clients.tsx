import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  FileText,
  Calendar,
  TrendingUp,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ClientsProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function Clients({ onNavigate, onBack }: ClientsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const clients = [
    {
      id: 'CLT-001',
      name: 'ABC Enterprises Pty Ltd',
      contactPerson: 'John Smith',
      email: 'john.smith@abcenterprises.com.au',
      phone: '+61 2 9876 5432',
      address: '123 Business St, Sydney NSW 2000',
      industry: 'Construction',
      abn: '12 345 678 901',
      activeDeals: 2,
      totalLoans: 3,
      totalValue: 2450000,
      status: 'active',
      rating: 5,
      lastContact: '2024-02-14',
      joinDate: '2023-08-15'
    },
    {
      id: 'CLT-002',
      name: 'Tech Innovations Ltd',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@techinnovations.com.au',
      phone: '+61 3 8765 4321',
      address: '456 Tech Park, Melbourne VIC 3000',
      industry: 'Technology',
      abn: '98 765 432 109',
      activeDeals: 1,
      totalLoans: 2,
      totalValue: 900000,
      status: 'active',
      rating: 4,
      lastContact: '2024-02-12',
      joinDate: '2023-11-20'
    },
    {
      id: 'CLT-003',
      name: 'Green Energy Solutions',
      contactPerson: 'Michael Chen',
      email: 'michael@greenenergy.com.au',
      phone: '+61 7 7654 3210',
      address: '789 Solar Ave, Brisbane QLD 4000',
      industry: 'Renewable Energy',
      abn: '23 456 789 012',
      activeDeals: 1,
      totalLoans: 2,
      totalValue: 640000,
      status: 'active',
      rating: 5,
      lastContact: '2024-02-10',
      joinDate: '2024-01-05'
    },
    {
      id: 'CLT-004',
      name: 'Retail Group Pty Ltd',
      contactPerson: 'Emma Wilson',
      email: 'emma@retailgroup.com.au',
      phone: '+61 8 6543 2109',
      address: '321 Shopping Mall, Perth WA 6000',
      industry: 'Retail',
      abn: '34 567 890 123',
      activeDeals: 0,
      totalLoans: 1,
      totalValue: 1200000,
      status: 'inactive',
      rating: 3,
      lastContact: '2024-01-20',
      joinDate: '2023-09-10'
    },
    {
      id: 'CLT-005',
      name: 'Construction Co',
      contactPerson: 'David Brown',
      email: 'david@constructionco.com.au',
      phone: '+61 2 5432 1098',
      address: '654 Builder Rd, Sydney NSW 2000',
      industry: 'Construction',
      abn: '45 678 901 234',
      activeDeals: 1,
      totalLoans: 4,
      totalValue: 4200000,
      status: 'active',
      rating: 5,
      lastContact: '2024-02-15',
      joinDate: '2023-06-01'
    },
    {
      id: 'CLT-006',
      name: 'Property Developers Ltd',
      contactPerson: 'Lisa Anderson',
      email: 'lisa@propertydev.com.au',
      phone: '+61 3 4321 0987',
      address: '987 Development St, Melbourne VIC 3000',
      industry: 'Real Estate',
      abn: '56 789 012 345',
      activeDeals: 0,
      totalLoans: 2,
      totalValue: 3500000,
      status: 'prospective',
      rating: 4,
      lastContact: '2024-02-08',
      joinDate: '2024-02-01'
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const prospectiveClients = clients.filter(c => c.status === 'prospective').length;
  const totalValue = clients.reduce((sum, c) => sum + c.totalValue, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'prospective':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
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
            <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-600 mt-1">Manage your client relationships and portfolio</p>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Client
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Clients</p>
            <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
            <p className="text-xs text-gray-500 mt-2">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Clients</p>
            <p className="text-2xl font-bold text-green-900">{activeClients}</p>
            <p className="text-xs text-gray-500 mt-2">With active deals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Prospective</p>
            <p className="text-2xl font-bold text-blue-900">{prospectiveClients}</p>
            <p className="text-xs text-gray-500 mt-2">In pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Portfolio</p>
            <p className="text-2xl font-bold text-purple-900">
              ${(totalValue / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-gray-500 mt-2">Loan value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clients by name, contact, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospective">Prospective</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Client List */}
      <Card>
        <CardHeader>
          <CardTitle>Clients ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(client.status)}`}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(client.rating)}
                        <span className="text-sm text-gray-500">Client ID: {client.id}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Contact:</span> {client.contactPerson}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-start gap-2">
                          <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-gray-600 break-all">{client.email}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-gray-600">{client.phone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-gray-600">{client.industry}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-gray-600">ABN: {client.abn}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-4 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Active Deals</p>
                      <p className="text-lg font-bold text-indigo-600">{client.activeDeals}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Loans</p>
                      <p className="text-lg font-bold text-gray-900">{client.totalLoans}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Portfolio Value</p>
                      <p className="text-lg font-bold text-purple-600">
                        ${(client.totalValue / 1000000).toFixed(2)}M
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Last Contact</p>
                      <p className="text-sm font-medium text-gray-900">{client.lastContact}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No clients found matching your criteria.</p>
              <Button variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

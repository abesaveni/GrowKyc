import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Users,
  Building2,
  Shield,
  AlertTriangle,
  ArrowRight,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Calendar,
  FileText,
  Activity
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  type: 'individual' | 'company' | 'trust' | 'partnership';
  status: 'verified' | 'pending' | 'review_required' | 'expired';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  completionPercentage: number;
  lastReviewed: string;
  nextReview: string;
  actionRequired: boolean;
  actionDays: number; // Days until action required
  verificationScore: number;
  documentsComplete: number;
  documentsTotal: number;
  flags: number;
  onboardedDate: string;
  assignedOfficer: string;
}

interface KYCDashboardOverviewProps {
  onViewClient: (clientId: string) => void;
  onBack?: () => void;
}

export function KYCDashboardOverview({ onViewClient, onBack }: KYCDashboardOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for all KYC clients
  const allClients: Client[] = [
    {
      id: '1',
      name: 'Acme Property Holdings Pty Ltd',
      type: 'company',
      status: 'verified',
      riskLevel: 'low',
      completionPercentage: 100,
      lastReviewed: '2024-03-15',
      nextReview: '2025-03-15',
      actionRequired: false,
      actionDays: 358,
      verificationScore: 98,
      documentsComplete: 12,
      documentsTotal: 12,
      flags: 0,
      onboardedDate: '2023-01-15',
      assignedOfficer: 'Sarah Chen'
    },
    {
      id: '2',
      name: 'Chen Family Trust',
      type: 'trust',
      status: 'review_required',
      riskLevel: 'medium',
      completionPercentage: 85,
      lastReviewed: '2024-01-10',
      nextReview: '2024-03-25',
      actionRequired: true,
      actionDays: 3,
      verificationScore: 82,
      documentsComplete: 10,
      documentsTotal: 12,
      flags: 2,
      onboardedDate: '2022-06-20',
      assignedOfficer: 'Jessica Lee'
    },
    {
      id: '3',
      name: 'John Michael Smith',
      type: 'individual',
      status: 'pending',
      riskLevel: 'low',
      completionPercentage: 65,
      lastReviewed: '2024-03-20',
      nextReview: '2024-04-20',
      actionRequired: true,
      actionDays: 7,
      verificationScore: 65,
      documentsComplete: 7,
      documentsTotal: 10,
      flags: 1,
      onboardedDate: '2024-03-18',
      assignedOfficer: 'Sarah Chen'
    },
    {
      id: '4',
      name: 'Global Investments Pty Ltd',
      type: 'company',
      status: 'verified',
      riskLevel: 'medium',
      completionPercentage: 100,
      lastReviewed: '2024-02-28',
      nextReview: '2025-02-28',
      actionRequired: false,
      actionDays: 343,
      verificationScore: 94,
      documentsComplete: 15,
      documentsTotal: 15,
      flags: 0,
      onboardedDate: '2021-11-10',
      assignedOfficer: 'Jessica Lee'
    },
    {
      id: '5',
      name: 'Sarah Williams',
      type: 'individual',
      status: 'expired',
      riskLevel: 'high',
      completionPercentage: 100,
      lastReviewed: '2023-03-10',
      nextReview: '2024-03-10',
      actionRequired: true,
      actionDays: -12,
      verificationScore: 88,
      documentsComplete: 10,
      documentsTotal: 10,
      flags: 3,
      onboardedDate: '2020-03-10',
      assignedOfficer: 'Sarah Chen'
    },
    {
      id: '6',
      name: 'Thompson & Associates Partnership',
      type: 'partnership',
      status: 'verified',
      riskLevel: 'low',
      completionPercentage: 100,
      lastReviewed: '2024-03-01',
      nextReview: '2025-03-01',
      actionRequired: false,
      actionDays: 344,
      verificationScore: 96,
      documentsComplete: 14,
      documentsTotal: 14,
      flags: 0,
      onboardedDate: '2022-08-15',
      assignedOfficer: 'Jessica Lee'
    },
    {
      id: '7',
      name: 'Sunrise Development Trust',
      type: 'trust',
      status: 'pending',
      riskLevel: 'medium',
      completionPercentage: 72,
      lastReviewed: '2024-03-18',
      nextReview: '2024-04-18',
      actionRequired: true,
      actionDays: 5,
      verificationScore: 72,
      documentsComplete: 9,
      documentsTotal: 12,
      flags: 1,
      onboardedDate: '2024-03-10',
      assignedOfficer: 'Sarah Chen'
    },
    {
      id: '8',
      name: 'Pacific Trading Co Pty Ltd',
      type: 'company',
      status: 'review_required',
      riskLevel: 'critical',
      completionPercentage: 90,
      lastReviewed: '2024-03-05',
      nextReview: '2024-03-23',
      actionRequired: true,
      actionDays: 1,
      verificationScore: 76,
      documentsComplete: 13,
      documentsTotal: 15,
      flags: 5,
      onboardedDate: '2023-09-20',
      assignedOfficer: 'Jessica Lee'
    },
    {
      id: '9',
      name: 'Emily Zhang',
      type: 'individual',
      status: 'verified',
      riskLevel: 'low',
      completionPercentage: 100,
      lastReviewed: '2024-03-12',
      nextReview: '2025-03-12',
      actionRequired: false,
      actionDays: 355,
      verificationScore: 99,
      documentsComplete: 10,
      documentsTotal: 10,
      flags: 0,
      onboardedDate: '2023-12-05',
      assignedOfficer: 'Sarah Chen'
    },
    {
      id: '10',
      name: 'Coastal Properties Trust',
      type: 'trust',
      status: 'verified',
      riskLevel: 'low',
      completionPercentage: 100,
      lastReviewed: '2024-02-20',
      nextReview: '2025-02-20',
      actionRequired: false,
      actionDays: 335,
      verificationScore: 97,
      documentsComplete: 12,
      documentsTotal: 12,
      flags: 0,
      onboardedDate: '2022-02-20',
      assignedOfficer: 'Jessica Lee'
    },
    {
      id: '11',
      name: 'David Robertson',
      type: 'individual',
      status: 'pending',
      riskLevel: 'medium',
      completionPercentage: 55,
      lastReviewed: '2024-03-21',
      nextReview: '2024-04-21',
      actionRequired: true,
      actionDays: 8,
      verificationScore: 55,
      documentsComplete: 6,
      documentsTotal: 10,
      flags: 2,
      onboardedDate: '2024-03-19',
      assignedOfficer: 'Sarah Chen'
    },
    {
      id: '12',
      name: 'Metro Development Pty Ltd',
      type: 'company',
      status: 'verified',
      riskLevel: 'low',
      completionPercentage: 100,
      lastReviewed: '2024-03-10',
      nextReview: '2025-03-10',
      actionRequired: false,
      actionDays: 353,
      verificationScore: 95,
      documentsComplete: 14,
      documentsTotal: 14,
      flags: 0,
      onboardedDate: '2023-05-22',
      assignedOfficer: 'Jessica Lee'
    }
  ];

  // Filter clients based on search and filters
  const filteredClients = allClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesRisk = filterRisk === 'all' || client.riskLevel === filterRisk;
    const matchesType = filterType === 'all' || client.type === filterType;
    
    return matchesSearch && matchesStatus && matchesRisk && matchesType;
  });

  // Calculate summary statistics
  const stats = {
    total: allClients.length,
    verified: allClients.filter(c => c.status === 'verified').length,
    pending: allClients.filter(c => c.status === 'pending').length,
    reviewRequired: allClients.filter(c => c.status === 'review_required').length,
    expired: allClients.filter(c => c.status === 'expired').length,
    actionRequired: allClients.filter(c => c.actionRequired).length,
    criticalRisk: allClients.filter(c => c.riskLevel === 'critical').length,
    highRisk: allClients.filter(c => c.riskLevel === 'high').length,
    averageScore: Math.round(allClients.reduce((acc, c) => acc + c.verificationScore, 0) / allClients.length)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-[#3DD598] text-white';
      case 'pending': return 'bg-[#FFA300] text-white';
      case 'review_required': return 'bg-yellow-500 text-white';
      case 'expired': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-[#3DD598]';
      case 'medium': return 'text-[#FFA300]';
      case 'high': return 'text-red-500';
      case 'critical': return 'text-red-700';
      default: return 'text-gray-500';
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-[#3DD598]/10 text-[#3DD598] border-[#3DD598]';
      case 'medium': return 'bg-[#FFA300]/10 text-[#FFA300] border-[#FFA300]';
      case 'high': return 'bg-red-100 text-red-600 border-red-600';
      case 'critical': return 'bg-red-200 text-red-800 border-red-800';
      default: return 'bg-gray-100 text-gray-600 border-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return <Users className="w-4 h-4" />;
      case 'company': return <Building2 className="w-4 h-4" />;
      case 'trust': return <Shield className="w-4 h-4" />;
      case 'partnership': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatActionDays = (days: number) => {
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `${days} days`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">KYC Dashboard</h1>
            <p className="text-gray-600 mt-1">Complete overview of all clients and entities</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-[#13B5EA]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Verified</p>
                  <p className="text-2xl font-bold text-[#3DD598]">{stats.verified}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-[#3DD598]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-[#FFA300]">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-[#FFA300]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Review Req.</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.reviewRequired}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Expired</p>
                  <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Actions Due</p>
                  <p className="text-2xl font-bold text-red-600">{stats.actionRequired}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">High Risk</p>
                  <p className="text-2xl font-bold text-red-500">{stats.criticalRisk + stats.highRisk}</p>
                </div>
                <Shield className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Avg. Score</p>
                  <p className="text-2xl font-bold text-[#13B5EA]">{stats.averageScore}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#13B5EA]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B5EA] focus:border-transparent"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-[#13B5EA] text-white' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B5EA]"
                >
                  <option value="all">All Statuses</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="review_required">Review Required</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B5EA]"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Entity Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B5EA]"
                >
                  <option value="all">All Types</option>
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                  <option value="trust">Trust</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Clients ({filteredClients.length})</span>
            <span className="text-sm font-normal text-gray-600">
              Click on any client to view detailed KYC dashboard
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Client / Entity</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Risk Level</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Health Score</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Documents</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Next Action</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Assigned Officer</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr 
                    key={client.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onViewClient(client.id)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${getStatusColor(client.status)} flex items-center justify-center`}>
                          {getTypeIcon(client.type)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{client.name}</div>
                          <div className="text-xs text-gray-500">ID: {client.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm capitalize text-gray-700">{client.type}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                        {client.status === 'verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {client.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {client.status === 'review_required' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {client.status === 'expired' && <XCircle className="w-3 h-3 mr-1" />}
                        {client.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRiskBadgeColor(client.riskLevel)}`}>
                        {client.riskLevel.toUpperCase()}
                      </span>
                      {client.flags > 0 && (
                        <span className="ml-2 text-xs text-red-600">
                          {client.flags} flag{client.flags > 1 ? 's' : ''}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              client.verificationScore >= 90 ? 'bg-[#3DD598]' :
                              client.verificationScore >= 70 ? 'bg-[#FFA300]' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${client.verificationScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{client.verificationScore}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-sm">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-medium">{client.documentsComplete}</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-600">{client.documentsTotal}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {client.actionRequired ? (
                        <div className="flex items-center gap-2">
                          <AlertCircle className={`w-4 h-4 ${client.actionDays < 0 ? 'text-red-600' : client.actionDays <= 3 ? 'text-[#FFA300]' : 'text-yellow-600'}`} />
                          <span className={`text-sm font-medium ${client.actionDays < 0 ? 'text-red-600' : client.actionDays <= 3 ? 'text-[#FFA300]' : 'text-yellow-600'}`}>
                            {formatActionDays(client.actionDays)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{formatActionDays(client.actionDays)}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{client.assignedOfficer}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[#13B5EA] hover:bg-[#13B5EA]/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewClient(client.id);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No clients found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  FileText,
  Calendar,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface PipelineProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function Pipeline({ onNavigate, onBack }: PipelineProps) {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const pipelineStages = [
    { id: 'all', name: 'All Deals', count: 24, color: 'bg-gray-500' },
    { id: 'enquiry', name: 'Enquiry', count: 8, color: 'bg-blue-500' },
    { id: 'submitted', name: 'Submitted', count: 6, color: 'bg-purple-500' },
    { id: 'assessment', name: 'Assessment', count: 5, color: 'bg-orange-500' },
    { id: 'approved', name: 'Approved', count: 3, color: 'bg-green-500' },
    { id: 'settlement', name: 'Settlement', count: 2, color: 'bg-teal-500' }
  ];

  const deals = [
    {
      id: 'APP-2024-001',
      client: 'ABC Enterprises Pty Ltd',
      broker: 'Sarah Johnson',
      loanType: 'Commercial Mortgage',
      amount: '$850,000',
      stage: 'assessment',
      priority: 'high',
      daysInStage: 3,
      lastUpdate: '2 hours ago',
      nextAction: 'Credit assessment review',
      progress: 65
    },
    {
      id: 'APP-2024-002',
      client: 'Tech Innovations Ltd',
      broker: 'Michael Chen',
      loanType: 'SME Term Loan',
      amount: '$450,000',
      stage: 'submitted',
      priority: 'medium',
      daysInStage: 5,
      lastUpdate: '1 day ago',
      nextAction: 'Document verification',
      progress: 40
    },
    {
      id: 'APP-2024-003',
      client: 'Green Energy Solutions',
      broker: 'Sarah Johnson',
      loanType: 'Asset Finance',
      amount: '$320,000',
      stage: 'approved',
      priority: 'high',
      daysInStage: 2,
      lastUpdate: '3 hours ago',
      nextAction: 'Prepare settlement',
      progress: 85
    },
    {
      id: 'APP-2024-004',
      client: 'Retail Group Pty Ltd',
      broker: 'David Williams',
      loanType: 'Private Lending',
      amount: '$1,200,000',
      stage: 'enquiry',
      priority: 'low',
      daysInStage: 1,
      lastUpdate: '5 hours ago',
      nextAction: 'Initial consultation',
      progress: 15
    },
    {
      id: 'APP-2024-005',
      client: 'Construction Co',
      broker: 'Emma Davis',
      loanType: 'Commercial Mortgage',
      amount: '$2,500,000',
      stage: 'settlement',
      priority: 'high',
      daysInStage: 7,
      lastUpdate: '1 hour ago',
      nextAction: 'Final settlement docs',
      progress: 95
    }
  ];

  const filteredDeals = deals.filter(deal => {
    const matchesStage = selectedStage === 'all' || deal.stage === selectedStage;
    const matchesSearch = deal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.broker.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const stats = [
    { label: 'Total Pipeline Value', value: '$5.32M', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Deals', value: '24', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Avg. Days in Pipeline', value: '12', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Conversion Rate', value: '68%', icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-orange-100 text-orange-700',
      low: 'bg-gray-100 text-gray-700'
    };
    return colors[priority as keyof typeof colors];
  };

  const getStageBadge = (stage: string) => {
    const stages = {
      enquiry: 'bg-blue-100 text-blue-700',
      submitted: 'bg-purple-100 text-purple-700',
      assessment: 'bg-orange-100 text-orange-700',
      approved: 'bg-green-100 text-green-700',
      settlement: 'bg-teal-100 text-teal-700'
    };
    return stages[stage as keyof typeof stages];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">Deal Pipeline</h1>
              <p className="text-xs text-gray-600">Track and manage deals through the lending pipeline</p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => onNavigate?.('new-application')}>
            + New Deal
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white border border-gray-300 rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline Stages */}
        <div className="bg-white border border-gray-300 rounded p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Pipeline Stages</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {pipelineStages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`p-3 border-2 rounded-lg text-left transition-all ${
                  selectedStage === stage.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                  <span className="text-xs font-medium text-gray-900">{stage.name}</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{stage.count}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border border-gray-300 rounded p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by client, application ID, or broker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Deals List */}
        <div className="space-y-4">
          {filteredDeals.map((deal) => (
            <div key={deal.id} className="bg-white border border-gray-300 rounded p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{deal.client}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityBadge(deal.priority)}`}>
                      {deal.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStageBadge(deal.stage)}`}>
                      {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Application ID: {deal.id}</p>
                </div>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Broker</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <p className="text-sm font-medium text-gray-900">{deal.broker}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Loan Type</p>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <p className="text-sm font-medium text-gray-900">{deal.loanType}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Amount</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <p className="text-sm font-bold text-gray-900">{deal.amount}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Days in Stage</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <p className="text-sm font-medium text-gray-900">{deal.daysInStage} days</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Last Update</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-sm font-medium text-gray-900">{deal.lastUpdate}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-600">Progress</p>
                  <p className="text-xs font-medium text-gray-900">{deal.progress}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${deal.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Next Action */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Next Action:</span> {deal.nextAction}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Update
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDeals.length === 0 && (
          <div className="bg-white border border-gray-300 rounded p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals found</h3>
            <p className="text-sm text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'No deals in this stage'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

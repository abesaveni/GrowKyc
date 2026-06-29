import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  RefreshCw,
  ArrowRight,
  Calendar,
  User,
  Building2,
  Shield,
  FileText,
  AlertTriangle,
  TrendingUp,
  Eye,
  CheckSquare,
  Users,
  Search,
  Bell,
  Flag
} from 'lucide-react';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  clientType: 'individual' | 'company' | 'trust' | 'partnership';
  category: 'kyc_review' | 'document_upload' | 'verification' | 'edd_required' | 'pep_screening' | 'sanctions_check' | 'renewal' | 'risk_assessment' | 'compliance_check';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'overdue' | 'due_today' | 'due_soon' | 'scheduled';
  dueDate: string;
  daysUntilDue: number;
  assignedTo: string;
  createdDate: string;
  relatedEntity?: string;
  actionRequired: string;
}

interface ActionItemsCenterProps {
  onViewClient: (clientId: string) => void;
  onBack?: () => void;
}

export function ActionItemsCenter({ onViewClient, onBack }: ActionItemsCenterProps) {
  const navigate = useNavigate();
  const { role } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Dynamic action items state
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load action items from localStorage (or future API) on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        let stored = localStorage.getItem('growkyc_action_items');
        if (!stored || JSON.parse(stored).length === 0) {
          const defaultItems: ActionItem[] = [
            {
              id: 'act-001',
              title: 'KYC Review Overdue',
              description: 'Annual KYC review is 12 days overdue',
              clientId: '5',
              clientName: 'Sarah Williams',
              clientType: 'individual',
              category: 'kyc_review',
              priority: 'critical',
              status: 'overdue',
              dueDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              daysUntilDue: -12,
              assignedTo: 'Sarah Chen',
              createdDate: '2025-06-01',
              actionRequired: 'Complete annual KYC review and update client file'
            },
            {
              id: 'act-002',
              title: 'Enhanced Due Diligence Required',
              description: 'Critical risk flags detected - immediate EDD needed',
              clientId: '8',
              clientName: 'Pacific Trading Co Pty Ltd',
              clientType: 'company',
              category: 'edd_required',
              priority: 'critical',
              status: 'due_today',
              dueDate: new Date().toISOString().split('T')[0],
              daysUntilDue: 0,
              assignedTo: 'Jessica Lee',
              createdDate: '2025-06-03',
              relatedEntity: '5 flags detected',
              actionRequired: 'Conduct enhanced due diligence and risk assessment'
            }
          ];
          localStorage.setItem('growkyc_action_items', JSON.stringify(defaultItems));
          stored = JSON.stringify(defaultItems);
        }
        setActionItems(JSON.parse(stored));
      } catch (e) {
        setError('Failed to load action items');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Filter action items based on search and filters
  const filteredItems = actionItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    
    return matchesSearch && matchesPriority && matchesStatus && matchesCategory;
  });

  // Calculate summary stats
  const stats = {
    total: actionItems.length,
    overdue: actionItems.filter(i => i.status === 'overdue').length,
    dueToday: actionItems.filter(i => i.status === 'due_today').length,
    dueSoon: actionItems.filter(i => i.status === 'due_soon').length,
    critical: actionItems.filter(i => i.priority === 'critical').length,
    high: actionItems.filter(i => i.priority === 'high').length,
    completed: 0 // For future use
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-[#FFA300] text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'due_today': return 'text-[#FFA300] bg-orange-50 border-orange-200';
      case 'due_soon': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'scheduled': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'due_today': return <Clock className="w-4 h-4" />;
      case 'due_soon': return <Calendar className="w-4 h-4" />;
      case 'scheduled': return <CheckSquare className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'kyc_review': return <Eye className="w-4 h-4" />;
      case 'document_upload': return <FileText className="w-4 h-4" />;
      case 'verification': return <CheckCircle className="w-4 h-4" />;
      case 'edd_required': return <AlertTriangle className="w-4 h-4" />;
      case 'pep_screening': return <Shield className="w-4 h-4" />;
      case 'sanctions_check': return <Flag className="w-4 h-4" />;
      case 'renewal': return <RefreshCw className="w-4 h-4" />;
      case 'risk_assessment': return <TrendingUp className="w-4 h-4" />;
      case 'compliance_check': return <CheckSquare className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return <User className="w-4 h-4" />;
      case 'company': return <Building2 className="w-4 h-4" />;
      case 'trust': return <Shield className="w-4 h-4" />;
      case 'partnership': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDueDate = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)} days overdue`;
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    return `Due in ${daysUntilDue} days`;
  };

  const getCategoryLabel = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Sort items by urgency
  const sortedItems = [...filteredItems].sort((a, b) => {
    // Priority order for status
    const statusOrder = { overdue: 0, due_today: 1, due_soon: 2, scheduled: 3 };
    const statusDiff = statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
    if (statusDiff !== 0) return statusDiff;
    
    // Then by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by days until due
    return a.daysUntilDue - b.daysUntilDue;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Action Items Center</h1>
            <p className="text-gray-600 mt-1">All pending actions requiring attention</p>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="border-l-4 border-l-gray-400">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Actions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#FFA300]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Due Today</p>
                  <p className="text-2xl font-bold text-[#FFA300]">{stats.dueToday}</p>
                </div>
                <Clock className="w-8 h-8 text-[#FFA300]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Due Soon</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.dueSoon}</p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Critical Priority</p>
                  <p className="text-2xl font-bold text-red-700">{stats.critical}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#FFA300]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">High Priority</p>
                  <p className="text-2xl font-bold text-[#FFA300]">{stats.high}</p>
                </div>
                <Flag className="w-8 h-8 text-[#FFA300]" />
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
                placeholder="Search action items, clients, or descriptions..."
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B5EA]"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B5EA]"
                >
                  <option value="all">All Statuses</option>
                  <option value="overdue">Overdue</option>
                  <option value="due_today">Due Today</option>
                  <option value="due_soon">Due Soon</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#13B5EA]"
                >
                  <option value="all">All Categories</option>
                  <option value="kyc_review">KYC Review</option>
                  <option value="document_upload">Document Upload</option>
                  <option value="verification">Verification</option>
                  <option value="edd_required">EDD Required</option>
                  <option value="pep_screening">PEP Screening</option>
                  <option value="sanctions_check">Sanctions Check</option>
                  <option value="renewal">Renewal</option>
                  <option value="risk_assessment">Risk Assessment</option>
                  <option value="compliance_check">Compliance Check</option>
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Items List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading action items...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          sortedItems.map((item) => (
            <Card
              key={item.id}
              className={`hover:shadow-lg transition-all cursor-pointer border-l-4 ${
                item.status === 'overdue' ? 'border-l-red-600' :
                item.status === 'due_today' ? 'border-l-[#FFA300]' :
                item.status === 'due_soon' ? 'border-l-yellow-500' :
                'border-l-blue-500'
              }`}
              onClick={() => navigate(`/${role}/review/${item.clientId}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Priority Badge */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-lg ${getPriorityColor(item.priority)} flex items-center justify-center`}>
                      {getCategoryIcon(item.category)}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        
                        {/* Client Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            {getTypeIcon(item.clientType)}
                            <span className="font-medium text-gray-700">{item.clientName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(item.category)}
                            <span>{getCategoryLabel(item.category)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{item.assignedTo}</span>
                          </div>
                          {item.relatedEntity && (
                            <div className="flex items-center gap-1 text-[#FFA300]">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="font-medium">{item.relatedEntity}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status and Due Date */}
                      <div className="flex-shrink-0 text-right ml-4">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border mb-2 ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          <span>{formatDueDate(item.daysUntilDue)}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Due: {new Date(item.dueDate).toLocaleDateString('en-AU', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Action Required */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <CheckSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-blue-900 mb-1">Action Required</p>
                            <p className="text-sm text-blue-700">{item.actionRequired}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-[#13B5EA] hover:bg-[#0E7C9E] text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/${role}/review/${item.clientId}`);
                          }}
                        >
                          View Client
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {sortedItems.length === 0 && (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-[#3DD598] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Action Items Found</h3>
              <p className="text-gray-500">
                {searchQuery || filterPriority !== 'all' || filterStatus !== 'all' || filterCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'All actions are up to date!'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from '../../lib/toast';
import { EmptyState } from '../ui/empty-state';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { 
  Activity,
  Search,
  Filter,
  User,
  FileText,
  DollarSign,
  Gavel,
  Shield,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Download
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'user' | 'case' | 'bid' | 'payment' | 'contract' | 'message' | 'kyc' | 'system';
  action: string;
  description: string;
  user: string;
  timestamp: Date;
  metadata?: {
    caseNumber?: string;
    amount?: number;
    status?: string;
  };
}

const mockActivities: ActivityItem[] = [
  {
    id: 'act-001',
    type: 'bid',
    action: 'New Bid Placed',
    description: 'Platinum Capital Partners placed a bid of A$1,100,000',
    user: 'Michael Chen',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    metadata: { caseNumber: 'MIP-2024-001', amount: 1100000 }
  },
  {
    id: 'act-002',
    type: 'user',
    action: 'User Registered',
    description: 'New investor account created',
    user: 'Sarah Mitchell',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    metadata: { status: 'pending_kyc' }
  },
  {
    id: 'act-003',
    type: 'payment',
    action: 'Payment Processed',
    description: 'Payment of A$1,050,000 successfully processed',
    user: 'David Wilson',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    metadata: { caseNumber: 'MIP-2024-003', amount: 1050000 }
  },
  {
    id: 'act-004',
    type: 'contract',
    action: 'Contract Signed',
    description: 'Investment contract digitally signed',
    user: 'Emma Thompson',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    metadata: { caseNumber: 'MIP-2024-005' }
  },
  {
    id: 'act-005',
    type: 'kyc',
    action: 'KYC Approved',
    description: 'Identity verification completed and approved',
    user: 'James Anderson',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    metadata: { status: 'approved' }
  },
  {
    id: 'act-006',
    type: 'case',
    action: 'Case Created',
    description: 'New mortgage resolution case opened',
    user: 'Rachel Green',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    metadata: { caseNumber: 'MIP-2024-012' }
  },
  {
    id: 'act-007',
    type: 'message',
    action: 'Message Sent',
    description: 'New message in case discussion',
    user: 'Michael Chen',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    metadata: { caseNumber: 'MIP-2024-001' }
  },
  {
    id: 'act-008',
    type: 'bid',
    action: 'Bid Won',
    description: 'Winning bid accepted for A$980,000',
    user: 'Sarah Mitchell',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    metadata: { caseNumber: 'MIP-2024-007', amount: 980000 }
  },
  {
    id: 'act-009',
    type: 'kyc',
    action: 'KYC Submitted',
    description: 'Identity documents submitted for review',
    user: 'David Wilson',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    metadata: { status: 'pending' }
  },
  {
    id: 'act-010',
    type: 'system',
    action: 'System Update',
    description: 'Platform maintenance completed successfully',
    user: 'System',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    metadata: { status: 'completed' }
  }
];

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const searchMatch = searchQuery === '' || 
      activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.metadata?.caseNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const typeMatch = typeFilter === 'all' || activity.type === typeFilter;
    
    let timeMatch = true;
    if (timeFilter !== 'all') {
      const now = Date.now();
      const activityTime = activity.timestamp.getTime();
      switch (timeFilter) {
        case '1h':
          timeMatch = now - activityTime < 60 * 60 * 1000;
          break;
        case '24h':
          timeMatch = now - activityTime < 24 * 60 * 60 * 1000;
          break;
        case '7d':
          timeMatch = now - activityTime < 7 * 24 * 60 * 60 * 1000;
          break;
        case '30d':
          timeMatch = now - activityTime < 30 * 24 * 60 * 60 * 1000;
          break;
      }
    }
    
    return searchMatch && typeMatch && timeMatch;
  });

  const getActivityIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'user':
        return <User className={`${iconClass} text-blue-600`} />;
      case 'case':
        return <FileText className={`${iconClass} text-green-600`} />;
      case 'bid':
        return <Gavel className={`${iconClass} text-purple-600`} />;
      case 'payment':
        return <DollarSign className={`${iconClass} text-emerald-600`} />;
      case 'contract':
        return <FileText className={`${iconClass} text-indigo-600`} />;
      case 'message':
        return <MessageSquare className={`${iconClass} text-amber-600`} />;
      case 'kyc':
        return <Shield className={`${iconClass} text-red-600`} />;
      case 'system':
        return <Activity className={`${iconClass} text-gray-600`} />;
      default:
        return <Activity className={`${iconClass} text-gray-600`} />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      user: 'bg-blue-100 text-blue-800',
      case: 'bg-green-100 text-green-800',
      bid: 'bg-purple-100 text-purple-800',
      payment: 'bg-emerald-100 text-emerald-800',
      contract: 'bg-indigo-100 text-indigo-800',
      message: 'bg-amber-100 text-amber-800',
      kyc: 'bg-red-100 text-red-800',
      system: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${colors[type as keyof typeof colors]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const handleRefresh = () => {
    toast.success('Activity feed refreshed');
  };

  const handleExport = () => {
    toast.info('Preparing export...');
    setTimeout(() => {
      toast.success('Activity log exported', {
        description: `${filteredActivities.length} activities exported`
      });
    }, 1000);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setTimeFilter('all');
    toast.info('Filters cleared');
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Activity Feed' }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Activities</p>
                <p className="text-3xl font-semibold text-gray-900">{activities.length}</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Hour</p>
                <p className="text-3xl font-semibold text-gray-900">
                  {activities.filter(a => Date.now() - a.timestamp.getTime() < 60 * 60 * 1000).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Recent activity</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today</p>
                <p className="text-3xl font-semibold text-gray-900">
                  {activities.filter(a => Date.now() - a.timestamp.getTime() < 24 * 60 * 60 * 1000).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Week</p>
                <p className="text-3xl font-semibold text-gray-900">
                  {activities.filter(a => Date.now() - a.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Activity className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Activity Timeline ({filteredActivities.length})</CardTitle>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search activities..."
                  className="pl-9 w-64"
                />
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Types</option>
                <option value="user">User</option>
                <option value="case">Case</option>
                <option value="bid">Bid</option>
                <option value="payment">Payment</option>
                <option value="contract">Contract</option>
                <option value="message">Message</option>
                <option value="kyc">KYC</option>
                <option value="system">System</option>
              </select>

              {/* Time Filter */}
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Time</option>
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>

              {/* Actions */}
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear
              </Button>

              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No activities found"
              description={
                searchQuery || typeFilter !== 'all' || timeFilter !== 'all'
                  ? "No activities match your filters"
                  : "No activities recorded yet"
              }
              action={{
                label: 'Clear Filters',
                onClick: handleClearFilters
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{activity.action}</h4>
                        {getTypeBadge(activity.type)}
                        {activity.metadata?.caseNumber && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {activity.metadata.caseNumber}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {activity.user}
                      </span>
                      <span>•</span>
                      <span>{format(activity.timestamp, 'dd MMM yyyy, HH:mm')}</span>
                      {activity.metadata?.amount && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-green-600">
                            A${activity.metadata.amount.toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

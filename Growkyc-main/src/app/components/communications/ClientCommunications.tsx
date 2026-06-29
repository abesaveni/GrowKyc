import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Mail,
  Send,
  Users,
  FileText,
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Copy,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowLeft,
  Folder,
  Tag,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { toast } from '../../lib/toast';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface ClientCommunicationsProps {
  onBack?: () => void;
}

export function ClientCommunications({ onBack }: ClientCommunicationsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'campaigns' | 'segments' | 'analytics'>('overview');
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [showNewSegmentModal, setShowNewSegmentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [analyticsSummary, setAnalyticsSummary] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    setAnalyticsError(null);
    try {
      const token = localStorage.getItem('growkyc_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/v1/communications/analytics?period=30d', {
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAnalyticsData(data.analyticsData || []);
      setAnalyticsSummary(data.summary || null);
    } catch (err: any) {
      console.error('Error fetching communications analytics:', err);
      setAnalyticsError(err.message || 'An error occurred while loading analytics.');
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  // Mock data for email templates
  const emailTemplates = [
    {
      id: 1,
      name: 'Welcome Email',
      category: 'Onboarding',
      subject: 'Welcome to Grow MIP!',
      lastModified: '2 days ago',
      usageCount: 247,
      status: 'active'
    },
    {
      id: 2,
      name: 'Monthly Newsletter',
      category: 'Marketing',
      subject: 'Your Monthly Market Update',
      lastModified: '1 week ago',
      usageCount: 1523,
      status: 'active'
    },
    {
      id: 3,
      name: 'Case Update Notification',
      category: 'Transactional',
      subject: 'Update on Your Case #{case_id}',
      lastModified: '3 days ago',
      usageCount: 892,
      status: 'active'
    },
    {
      id: 4,
      name: 'Payment Reminder',
      category: 'Billing',
      subject: 'Payment Due Reminder',
      lastModified: '5 days ago',
      usageCount: 456,
      status: 'active'
    },
    {
      id: 5,
      name: 'Document Request',
      category: 'Operations',
      subject: 'Action Required: Document Submission',
      lastModified: '1 day ago',
      usageCount: 678,
      status: 'active'
    }
  ];

  // Mock data for campaigns
  const campaigns = [
    {
      id: 1,
      name: 'Q1 2026 Investor Update',
      status: 'sent',
      recipients: 247,
      openRate: 78,
      clickRate: 34,
      sentDate: '2024-01-15',
      template: 'Monthly Newsletter'
    },
    {
      id: 2,
      name: 'New Property Listings Alert',
      status: 'scheduled',
      recipients: 156,
      scheduledDate: '2024-02-28',
      template: 'Case Update Notification'
    },
    {
      id: 3,
      name: 'Payment Reminder Batch',
      status: 'draft',
      recipients: 89,
      template: 'Payment Reminder'
    },
    {
      id: 4,
      name: 'Document Collection Drive',
      status: 'sending',
      recipients: 345,
      sent: 123,
      template: 'Document Request'
    }
  ];

  // Mock data for segments
  const segments = [
    {
      id: 1,
      name: 'Active Investors',
      description: 'Investors with active bids or purchases',
      count: 247,
      criteria: 'Role: Investor, Status: Active, Last Activity: 30 days',
      color: 'blue'
    },
    {
      id: 2,
      name: 'High-Value Lenders',
      description: 'Lenders with 5+ cases valued over $1M',
      count: 34,
      criteria: 'Role: Lender, Case Value: >$1M, Case Count: >=5',
      color: 'green'
    },
    {
      id: 3,
      name: 'Pending KYC Users',
      description: 'Users who haven\'t completed KYC verification',
      count: 89,
      criteria: 'KYC Status: Pending, Registration: <14 days',
      color: 'orange'
    },
    {
      id: 4,
      name: 'Lawyers - Active Cases',
      description: 'Lawyers with assigned cases requiring review',
      count: 23,
      criteria: 'Role: Lawyer, Pending Reviews: >0',
      color: 'purple'
    },
    {
      id: 5,
      name: 'Dormant Users',
      description: 'Users with no activity in 90+ days',
      count: 156,
      criteria: 'Last Activity: >90 days, Status: Active',
      color: 'gray'
    }
  ];

  const handleNewTemplate = () => {
    setShowNewTemplateModal(true);
  };

  const handleNewCampaign = () => {
    setShowNewCampaignModal(true);
  };

  const handleNewSegment = () => {
    setShowNewSegmentModal(true);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Total Templates</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">{emailTemplates.length}</p>
                <p className="text-xs text-slate-400 mt-1">5 active</p>
              </div>
              <FileText className="w-12 h-12 text-blue-400 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Active Campaigns</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">4</p>
                <p className="text-xs text-green-400 mt-1">2 scheduled</p>
              </div>
              <Send className="w-12 h-12 text-green-400 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">User Segments</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">{segments.length}</p>
                <p className="text-xs text-slate-400 mt-1">837 total contacts</p>
              </div>
              <Users className="w-12 h-12 text-purple-400 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Avg Open Rate</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">78%</p>
                <p className="text-xs text-green-400 mt-1">â†‘ 12% vs last month</p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-400 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>Your latest email campaigns and their performance</CardDescription>
            </div>
            <Button onClick={handleNewCampaign}>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.slice(0, 3).map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/5">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-slate-100">{campaign.name}</h3>
                    <Badge variant={
                      campaign.status === 'sent' ? 'default' :
                      campaign.status === 'scheduled' ? 'secondary' :
                      campaign.status === 'sending' ? 'default' :
                      'outline'
                    }>
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">
                    {campaign.recipients} recipients â€¢ {campaign.template}
                  </p>
                  {campaign.status === 'sent' && (
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-slate-300">
                        Open Rate: <span className="font-semibold text-green-400">{campaign.openRate}%</span>
                      </span>
                      <span className="text-xs text-slate-300">
                        Click Rate: <span className="font-semibold text-blue-400">{campaign.clickRate}%</span>
                      </span>
                    </div>
                  )}
                  {campaign.status === 'scheduled' && (
                    <p className="text-xs text-orange-400 mt-2">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Scheduled for {campaign.scheduledDate}
                    </p>
                  )}
                  {campaign.status === 'sending' && (
                    <p className="text-xs text-blue-400 mt-2">
                      <Send className="w-3 h-3 inline mr-1" />
                      Sending: {campaign.sent}/{campaign.recipients}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleNewCampaign} className="h-auto py-4 flex-col">
              <Send className="w-6 h-6 mb-2" />
              <span>Send Bulk Email</span>
            </Button>
            <Button onClick={handleNewTemplate} variant="outline" className="h-auto py-4 flex-col">
              <FileText className="w-6 h-6 mb-2" />
              <span>Create Template</span>
            </Button>
            <Button onClick={handleNewSegment} variant="outline" className="h-auto py-4 flex-col">
              <Users className="w-6 h-6 mb-2" />
              <span>New Segment</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Manage your email templates and branding</CardDescription>
            </div>
            <Button onClick={handleNewTemplate}>
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Templates List */}
          <div className="space-y-3">
            {emailTemplates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/5">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="font-semibold text-slate-100">{template.name}</h3>
                      <p className="text-sm text-slate-300 mt-1">
                        {template.subject}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <Badge variant="outline">{template.category}</Badge>
                        <span className="text-xs text-slate-400">
                          Used {template.usageCount} times
                        </span>
                        <span className="text-xs text-slate-400">
                          Modified {template.lastModified}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => toast.success('Opening template preview...')}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toast.success('Opening template editor...')}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toast.success('Template duplicated')}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toast.success('Template deleted')}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email Campaigns</CardTitle>
              <CardDescription>Manage your bulk email campaigns and track performance</CardDescription>
            </div>
            <Button onClick={handleNewCampaign}>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Campaign Status Tabs */}
          <div className="flex gap-2 mb-6 border-b border-white/10">
            {['all', 'sent', 'scheduled', 'draft', 'sending'].map((status) => (
              <button
                key={status}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 border-b-2 border-transparent hover:border-white/10"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 text-xs text-gray-400">
                  ({campaigns.filter(c => status === 'all' || c.status === status).length})
                </span>
              </button>
            ))}
          </div>

          {/* Campaigns List */}
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-6 border border-white/10 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-slate-100">{campaign.name}</h3>
                      <Badge variant={
                        campaign.status === 'sent' ? 'default' :
                        campaign.status === 'scheduled' ? 'secondary' :
                        campaign.status === 'sending' ? 'default' :
                        'outline'
                      }>
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-6 text-sm text-slate-300 mb-4">
                      <span>
                        <Users className="w-4 h-4 inline mr-1" />
                        {campaign.recipients} recipients
                      </span>
                      <span>
                        <FileText className="w-4 h-4 inline mr-1" />
                        {campaign.template}
                      </span>
                      {campaign.sentDate && (
                        <span>
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Sent {campaign.sentDate}
                        </span>
                      )}
                      {campaign.scheduledDate && (
                        <span>
                          <Clock className="w-4 h-4 inline mr-1" />
                          Scheduled {campaign.scheduledDate}
                        </span>
                      )}
                    </div>

                    {campaign.status === 'sent' && (
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-white/10 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${campaign.openRate}%` }} />
                          </div>
                          <span className="text-sm font-semibold text-green-400">{campaign.openRate}% opened</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-white/10 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${campaign.clickRate}%` }} />
                          </div>
                          <span className="text-sm font-semibold text-blue-400">{campaign.clickRate}% clicked</span>
                        </div>
                      </div>
                    )}

                    {campaign.status === 'sending' && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(campaign.sent! / campaign.recipients) * 100}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-blue-400">
                          {campaign.sent}/{campaign.recipients} sent
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {campaign.status === 'sent' && (
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    )}
                    {campaign.status === 'draft' && (
                      <>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm">
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      </>
                    )}
                    {campaign.status === 'scheduled' && (
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Reschedule
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSegments = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Segments</CardTitle>
              <CardDescription>Create and manage user segments for targeted communications</CardDescription>
            </div>
            <Button onClick={handleNewSegment}>
              <Plus className="w-4 h-4 mr-2" />
              New Segment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {segments.map((segment) => (
              <Card key={segment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-${segment.color}-100 flex items-center justify-center`}>
                        <Users className={`w-6 h-6 text-${segment.color}-600`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-100">{segment.name}</h3>
                        <p className="text-sm text-slate-300">{segment.count} contacts</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-4">{segment.description}</p>
                  
                  <div className="p-3 bg-white/5 rounded-lg mb-4">
                    <p className="text-xs text-slate-400 font-medium mb-1">Criteria:</p>
                    <p className="text-xs text-slate-300">{segment.criteria}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Contacts
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => {
                      toast.success(`Creating campaign for ${segment.name}...`);
                      setShowNewCampaignModal(true);
                    }}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Analytics</CardTitle>
          <CardDescription>Track performance metrics across all your campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-300">Total Emails Sent</p>
                <p className="text-3xl font-bold text-slate-100 mt-2">
                  {loadingAnalytics ? '...' : analyticsSummary ? analyticsSummary.totalSent.toLocaleString() : '3,796'}
                </p>
                <p className="text-sm text-green-400 mt-1">↑ 24% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-300">Average Open Rate</p>
                <p className="text-3xl font-bold text-slate-100 mt-2">
                  {loadingAnalytics ? '...' : analyticsSummary ? `${analyticsSummary.avgEmailOpenRate}%` : '78%'}
                </p>
                <p className="text-sm text-green-400 mt-1">↑ 12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-slate-300">Average Click Rate</p>
                <p className="text-3xl font-bold text-slate-100 mt-2">
                  {loadingAnalytics ? '...' : analyticsSummary ? `${analyticsSummary.avgEmailClickRate}%` : '34%'}
                </p>
                <p className="text-sm text-green-400 mt-1">↑ 8% from last month</p>
              </CardContent>
            </Card>
          </div>

          {loadingAnalytics ? (
            <div className="flex justify-center items-center h-80">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#13B5EA]"></div>
            </div>
          ) : analyticsError ? (
            <div className="bg-red-500/10 text-red-400 p-6 rounded-lg text-center border border-red-500/30">
              <p className="font-semibold">Error Loading Analytics</p>
              <p className="text-sm mt-1">{analyticsError}</p>
              <Button size="sm" variant="outline" className="mt-4 border-red-300 text-red-300 hover:bg-red-500/15" onClick={fetchAnalytics}>
                Retry
              </Button>
            </div>
          ) : (
            <div className="h-96 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} />
                  <YAxis
                    yAxisId="left"
                    stroke="#13B5EA"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    unit="%"
                    label={{ value: 'Rates (%)', angle: -90, position: 'insideLeft', offset: 10, style: { fill: '#6B7280', textAnchor: 'middle' } }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    unit=""
                    label={{ value: 'Volume', angle: 90, position: 'insideRight', offset: 10, style: { fill: '#6B7280', textAnchor: 'middle' } }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '13px' }} />
                  <Bar
                    yAxisId="left"
                    dataKey="emailOpenRate"
                    name="Email Open Rate"
                    fill="#13B5EA"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="smsDeliveryRate"
                    name="SMS Delivery Rate"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="count"
                    name="Sent Volume"
                    fill="#9CA3AF"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-white/5">
      {/* Header */}
      <div className="bg-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-100">Client Communications</h1>
                <p className="text-sm text-slate-300 mt-1">Bulk email, segmented campaigns, and templates</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Send Now
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 border-b border-white/10">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'templates', label: 'Templates', icon: FileText },
              { id: 'campaigns', label: 'Campaigns', icon: Send },
              { id: 'segments', label: 'Segments', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-400'
                      : 'border-transparent text-slate-300 hover:text-slate-100 hover:border-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'campaigns' && renderCampaigns()}
        {activeTab === 'segments' && renderSegments()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>

      {/* New Template Modal */}
      <Dialog open={showNewTemplateModal} onOpenChange={setShowNewTemplateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Email Template</DialogTitle>
            <DialogDescription>
              Design a new email template for your communications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Template Name</Label>
              <Input placeholder="e.g., Welcome Email" />
            </div>
            <div>
              <Label>Category</Label>
              <select className="w-full px-3 py-2 border border-white/10 rounded-lg">
                <option>Onboarding</option>
                <option>Marketing</option>
                <option>Transactional</option>
                <option>Billing</option>
                <option>Operations</option>
              </select>
            </div>
            <div>
              <Label>Subject Line</Label>
              <Input placeholder="Email subject..." />
            </div>
            <div>
              <Label>Email Body</Label>
              <Textarea rows={8} placeholder="Email content..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTemplateModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success('Template created successfully!');
              setShowNewTemplateModal(false);
            }}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Campaign Modal */}
      <Dialog open={showNewCampaignModal} onOpenChange={setShowNewCampaignModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Set up a new bulk email campaign
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Campaign Name</Label>
              <Input placeholder="e.g., Q1 2026 Investor Update" />
            </div>
            <div>
              <Label>Select Template</Label>
              <select className="w-full px-3 py-2 border border-white/10 rounded-lg">
                {emailTemplates.map(t => (
                  <option key={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Select Segment</Label>
              <select className="w-full px-3 py-2 border border-white/10 rounded-lg">
                {segments.map(s => (
                  <option key={s.id}>{s.name} ({s.count} contacts)</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Schedule</Label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input type="radio" id="send-now" name="schedule" defaultChecked />
                  <label htmlFor="send-now" className="text-sm">Send Now</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" id="schedule-later" name="schedule" />
                  <label htmlFor="schedule-later" className="text-sm">Schedule for Later</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCampaignModal(false)}>
              Save as Draft
            </Button>
            <Button onClick={() => {
              toast.success('Campaign created and scheduled!');
              setShowNewCampaignModal(false);
            }}>
              <Send className="w-4 h-4 mr-2" />
              Create & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Segment Modal */}
      <Dialog open={showNewSegmentModal} onOpenChange={setShowNewSegmentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Segment</DialogTitle>
            <DialogDescription>
              Define criteria to create a targeted user segment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Segment Name</Label>
              <Input placeholder="e.g., High-Value Investors" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={3} placeholder="Describe this segment..." />
            </div>
            <div>
              <Label>Criteria</Label>
              <div className="space-y-3 border border-white/10 rounded-lg p-4">
                <div className="flex gap-3">
                  <select className="flex-1 px-3 py-2 border border-white/10 rounded-lg">
                    <option>User Role</option>
                    <option>Account Status</option>
                    <option>Last Activity</option>
                    <option>Case Count</option>
                    <option>Total Value</option>
                  </select>
                  <select className="px-3 py-2 border border-white/10 rounded-lg">
                    <option>equals</option>
                    <option>contains</option>
                    <option>greater than</option>
                    <option>less than</option>
                  </select>
                  <Input placeholder="value" className="flex-1" />
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Condition
                </Button>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                <strong>Estimated contacts:</strong> This segment will include approximately 247 contacts
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewSegmentModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success('Segment created successfully!');
              setShowNewSegmentModal(false);
            }}>
              Create Segment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


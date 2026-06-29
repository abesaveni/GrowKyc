import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Mail,
  MessageSquare,
  Target,
  BarChart3,
  Users,
  Calendar,
  Send,
  Play,
  Pause,
  Eye,
  Edit,
  Copy,
  Trash2,
  Plus,
  Download,
  Filter,
  Search,
  TrendingUp,
  MousePointer,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Globe,
  FileText,
  Settings,
  Sparkles,
  MoreVertical,
  X,
  ArrowRight,
  GripVertical
} from 'lucide-react';
import { CampaignBuilderModal } from './CampaignBuilderModal';

export function MarketingModule({ role }: any) {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'workflows' | 'forms' | 'analytics'>('campaigns');
  const [notification, setNotification] = useState<string>('');
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [buildingCampaign, setBuildingCampaign] = useState<any>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleExportData = () => {
    showNotification('Exporting marketing data...');
  };

  const handleNewCampaign = () => {
    setShowNewCampaignModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top">
          {notification}
        </div>
      )}

      {/* New Campaign Modal */}
      {showNewCampaignModal && (
        <NewCampaignModal 
          onClose={() => setShowNewCampaignModal(false)}
          onContinue={(campaignData) => {
            setShowNewCampaignModal(false);
            setBuildingCampaign(campaignData);
          }}
        />
      )}

      {/* Campaign Builder Modal */}
      {buildingCampaign && (
        <CampaignBuilderModal
          campaign={buildingCampaign}
          onClose={() => setBuildingCampaign(null)}
          onSave={(campaignName) => {
            setBuildingCampaign(null);
            showNotification(`Campaign "${campaignName}" created successfully!`);
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing Automation</h1>
          <p className="text-gray-600 mt-1">Email campaigns, workflows, lead capture, and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" type="button" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button type="button" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleNewCampaign}>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Campaigns</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">24</p>
          <p className="text-xs text-gray-500 mt-1">12 active</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Send className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Emails Sent</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">45.2K</p>
          <p className="text-xs text-green-600 mt-1">+18% this month</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-gray-600">Open Rate</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">28.5%</p>
          <p className="text-xs text-green-600 mt-1">+2.3% vs avg</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MousePointer className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Click Rate</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">4.2%</p>
          <p className="text-xs text-gray-500 mt-1">Above industry avg</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <p className="text-sm text-gray-600">Conversions</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">1,247</p>
          <p className="text-xs text-green-600 mt-1">+24% this month</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-300">
          {[
            { id: 'campaigns', label: 'Campaigns', icon: Mail },
            { id: 'workflows', label: 'Workflows', icon: Zap },
            { id: 'forms', label: 'Forms & Pages', icon: Globe },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600 font-medium bg-purple-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'campaigns' && <CampaignsTab />}
          {activeTab === 'workflows' && <WorkflowsTab />}
          {activeTab === 'forms' && <FormsTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </div>
      </div>
    </div>
  );
}

// Campaigns Tab
function CampaignsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string>('');
  const [viewingCampaign, setViewingCampaign] = useState<any>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const mockCampaigns = [
    {
      id: 'CAMP-001',
      name: 'Product Launch Email Series',
      type: 'Email',
      status: 'active',
      sent: 12500,
      opens: 3560,
      clicks: 425,
      conversions: 89,
      lastSent: '2024-02-28',
      subject: 'Introducing Our Revolutionary New Product',
      from: 'marketing@company.com',
      audience: 'All Active Customers',
      createdDate: '2024-02-15',
      bounces: 125,
      unsubscribes: 23
    },
    {
      id: 'CAMP-002',
      name: 'Spring Promotion',
      type: 'SMS',
      status: 'scheduled',
      sent: 0,
      scheduledFor: '2024-03-01',
      recipients: 8400,
      message: 'Spring Sale! Get 30% off all items. Use code SPRING30',
      audience: 'Newsletter Subscribers',
      createdDate: '2024-02-20'
    },
    {
      id: 'CAMP-003',
      name: 'Webinar Follow-up Drip',
      type: 'Email',
      status: 'active',
      sent: 4200,
      opens: 1260,
      clicks: 185,
      conversions: 42,
      lastSent: '2024-02-27',
      subject: 'Thanks for attending our webinar!',
      from: 'events@company.com',
      audience: 'Webinar Attendees',
      createdDate: '2024-02-25',
      bounces: 45,
      unsubscribes: 8
    }
  ];

  const handleViewCampaign = (campaignId: string) => {
    const campaign = mockCampaigns.find(c => c.id === campaignId);
    if (campaign) {
      setViewingCampaign(campaign);
    }
  };

  const handleEditCampaign = (campaignId: string) => {
    showNotification(`Opening editor for: ${campaignId}`);
  };

  const handleCampaignMenu = (campaignId: string) => {
    showNotification(`More options for: ${campaignId}`);
  };

  const handleFilter = () => {
    showNotification('Opening filter options...');
  };

  return (
    <div className="space-y-4">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Campaign View Modal */}
      {viewingCampaign && (
        <CampaignViewModal
          campaign={viewingCampaign}
          onClose={() => setViewingCampaign(null)}
        />
      )}

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <Button variant="outline" type="button" onClick={handleFilter}>
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Campaigns List */}
      <div className="space-y-3">
        {mockCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                    {campaign.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{campaign.id}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => handleViewCampaign(campaign.id)}>
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => handleEditCampaign(campaign.id)}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => handleCampaignMenu(campaign.id)}>
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {campaign.status === 'active' && (
              <div className="grid grid-cols-5 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">Sent</p>
                  <p className="text-lg font-bold text-blue-900">{campaign.sent.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 mb-1">Opens</p>
                  <p className="text-lg font-bold text-green-900">{campaign.opens?.toLocaleString()}</p>
                  <p className="text-xs text-green-700">{((campaign.opens! / campaign.sent) * 100).toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-indigo-600 mb-1">Clicks</p>
                  <p className="text-lg font-bold text-indigo-900">{campaign.clicks?.toLocaleString()}</p>
                  <p className="text-xs text-indigo-700">{((campaign.clicks! / campaign.sent) * 100).toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600 mb-1">Conversions</p>
                  <p className="text-lg font-bold text-purple-900">{campaign.conversions}</p>
                  <p className="text-xs text-purple-700">{((campaign.conversions! / campaign.sent) * 100).toFixed(2)}%</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Last Sent</p>
                  <p className="text-sm font-medium text-gray-900">{campaign.lastSent}</p>
                </div>
              </div>
            )}

            {campaign.status === 'scheduled' && (
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Scheduled for {campaign.scheduledFor}</p>
                  <p className="text-xs text-blue-700">{campaign.recipients} recipients</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Workflows Tab
function WorkflowsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Marketing Automation Workflows</h3>
        </div>
        <p className="text-sm text-purple-800 mb-4">
          Build visual workflows with email sequences, SMS, conditional logic, and lead scoring
        </p>
        
        {/* Workflow Examples */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'Welcome Series', status: 'active', enrolled: 1250, completed: 890 },
            { name: 'Re-engagement Campaign', status: 'active', enrolled: 450, completed: 180 },
            { name: 'Abandoned Cart Recovery', status: 'draft', enrolled: 0, completed: 0 }
          ].map((workflow, idx) => (
            <div key={idx} className="bg-white border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">{workflow.name}</p>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {workflow.status}
                </span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Enrolled: {workflow.enrolled}</p>
                <p>Completed: {workflow.completed}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-12">
        <Zap className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <p className="text-gray-600">Visual workflow builder coming soon</p>
      </div>
    </div>
  );
}

// Forms Tab
function FormsTab() {
  const [notification, setNotification] = useState<string>('');
  const [viewingForm, setViewingForm] = useState<any>(null);
  const [editingForm, setEditingForm] = useState<any>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const mockForms = [
    { 
      id: 'FORM-001',
      name: 'Contact Us Form', 
      submissions: 324, 
      conversionRate: 12.5,
      status: 'active',
      createdDate: '2024-01-15',
      fields: [
        { id: '1', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
        { id: '2', label: 'Email Address', type: 'email', required: true, placeholder: 'you@example.com' },
        { id: '3', label: 'Phone Number', type: 'tel', required: false, placeholder: '(555) 123-4567' },
        { id: '4', label: 'Message', type: 'textarea', required: true, placeholder: 'Tell us how we can help...' },
        { id: '5', label: 'Subscribe to newsletter', type: 'checkbox', required: false }
      ]
    },
    { 
      id: 'FORM-002',
      name: 'Product Demo Request', 
      submissions: 156, 
      conversionRate: 8.2,
      status: 'active',
      createdDate: '2024-01-20',
      fields: [
        { id: '1', label: 'Company Name', type: 'text', required: true, placeholder: 'Your company' },
        { id: '2', label: 'Your Name', type: 'text', required: true, placeholder: 'Full name' },
        { id: '3', label: 'Work Email', type: 'email', required: true, placeholder: 'you@company.com' },
        { id: '4', label: 'Company Size', type: 'select', required: true, options: ['1-10', '11-50', '51-200', '200+'] },
        { id: '5', label: 'Preferred Demo Date', type: 'date', required: false }
      ]
    },
    { 
      id: 'FORM-003',
      name: 'Newsletter Signup', 
      submissions: 1847, 
      conversionRate: 45.3,
      status: 'active',
      createdDate: '2024-01-10',
      fields: [
        { id: '1', label: 'Email Address', type: 'email', required: true, placeholder: 'Enter your email' },
        { id: '2', label: 'First Name', type: 'text', required: false, placeholder: 'Optional' },
        { id: '3', label: 'Interests', type: 'checkbox-group', required: false, options: ['Product Updates', 'Industry News', 'Special Offers'] }
      ]
    }
  ];

  const handleViewForm = (formName: string) => {
    const form = mockForms.find(f => f.name === formName);
    if (form) {
      setViewingForm(form);
    }
  };

  const handleEditForm = (formName: string) => {
    const form = mockForms.find(f => f.name === formName);
    if (form) {
      setEditingForm(form);
    }
  };

  return (
    <div className="space-y-4">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

      {/* Form View Modal */}
      {viewingForm && (
        <FormViewModal
          form={viewingForm}
          onClose={() => setViewingForm(null)}
        />
      )}

      {/* Form Edit Modal */}
      {editingForm && (
        <FormEditModal
          form={editingForm}
          onClose={() => setEditingForm(null)}
          onSave={(formName) => {
            setEditingForm(null);
            showNotification(`Form "${formName}" saved successfully!`);
          }}
        />
      )}

      <div className="grid grid-cols-3 gap-4">
        {mockForms.map((form, idx) => (
          <div key={idx} className="bg-white border border-gray-300 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">{form.name}</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{form.submissions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-xl font-bold text-green-600">{form.conversionRate}%</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button type="button" size="sm" variant="outline" className="flex-1" onClick={() => handleViewForm(form.name)}>
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button type="button" size="sm" variant="outline" className="flex-1" onClick={() => handleEditForm(form.name)}>
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Analytics Tab
function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Email Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Avg Open Rate</span>
              <span className="text-sm font-semibold text-gray-900">28.5%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Avg Click Rate</span>
              <span className="text-sm font-semibold text-gray-900">4.2%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Bounce Rate</span>
              <span className="text-sm font-semibold text-gray-900">1.8%</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">Unsubscribe Rate</span>
              <span className="text-sm font-semibold text-gray-900">0.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Lead Generation</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">New Leads</span>
              <span className="text-sm font-semibold text-gray-900">1,847</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Qualified Leads</span>
              <span className="text-sm font-semibold text-gray-900">685</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-sm font-semibold text-green-600">37.1%</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">Cost Per Lead</span>
              <span className="text-sm font-semibold text-gray-900">$24.50</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">ROI Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Marketing Spend</span>
              <span className="text-sm font-semibold text-gray-900">$45,200</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Revenue Generated</span>
              <span className="text-sm font-semibold text-green-600">$284,500</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">ROI</span>
              <span className="text-sm font-semibold text-green-600">529%</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-600">CAC</span>
              <span className="text-sm font-semibold text-gray-900">$65.90</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// New Campaign Modal
function NewCampaignModal({ onClose, onContinue }: { onClose: () => void, onContinue: (campaignData: any) => void }) {
  const [campaignName, setCampaignName] = useState('');
  const [campaignType, setCampaignType] = useState('Email');
  const [subject, setSubject] = useState('');
  const [audience, setAudience] = useState('All Contacts');
  const [scheduleType, setScheduleType] = useState('Send Now');
  const [scheduledDate, setScheduledDate] = useState('');

  const handleCreateCampaign = () => {
    if (campaignName.trim()) {
      const campaignData = {
        name: campaignName,
        type: campaignType,
        subject,
        audience,
        scheduleType,
        scheduledDate
      };
      onContinue(campaignData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Campaign</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Summer Product Launch 2024"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Campaign Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Type *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Email', 'SMS', 'Social'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCampaignType(type)}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    campaignType === type
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {type === 'Email' && <Mail className="w-4 h-4 inline mr-2" />}
                  {type === 'SMS' && <MessageSquare className="w-4 h-4 inline mr-2" />}
                  {type === 'Social' && <Globe className="w-4 h-4 inline mr-2" />}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Line (Email only) */}
          {campaignType === 'Email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Line *
              </label>
              <input
                type="text"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience *
            </label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>All Contacts</option>
              <option>Active Customers</option>
              <option>New Leads</option>
              <option>Hot Prospects</option>
              <option>Newsletter Subscribers</option>
              <option>Custom Segment...</option>
            </select>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Send Now', 'Schedule Later'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setScheduleType(type)}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    scheduleType === type
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {type === 'Send Now' && <Send className="w-4 h-4 inline mr-2" />}
                  {type === 'Schedule Later' && <Calendar className="w-4 h-4 inline mr-2" />}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {scheduleType === 'Schedule Later' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule Date & Time
              </label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            You'll be able to design the content in the next step
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="button" 
              className="bg-purple-600 hover:bg-purple-700 text-white" 
              onClick={handleCreateCampaign}
              disabled={!campaignName.trim()}
            >
              Continue to Design
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Campaign View Modal
function CampaignViewModal({ campaign, onClose }: { campaign: any, onClose: () => void }) {
  const [activeViewTab, setActiveViewTab] = useState<'overview' | 'performance' | 'content'>('overview');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{campaign.name}</h2>
              <p className="text-sm text-gray-600">{campaign.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {campaign.status}
              </span>
              <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {campaign.type}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              Created: {campaign.createdDate}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              {campaign.audience}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'performance', label: 'Performance', icon: TrendingUp },
              { id: 'content', label: 'Content', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveViewTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeViewTab === tab.id
                      ? 'border-purple-600 text-purple-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeViewTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Send className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-medium text-blue-700">Sent</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{campaign.sent?.toLocaleString() || 0}</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-green-700">Opens</p>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{campaign.opens?.toLocaleString() || 0}</p>
                  <p className="text-xs text-green-700">{campaign.sent > 0 ? ((campaign.opens! / campaign.sent) * 100).toFixed(1) : 0}%</p>
                </div>

                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MousePointer className="w-5 h-5 text-indigo-600" />
                    <p className="text-sm font-medium text-indigo-700">Clicks</p>
                  </div>
                  <p className="text-2xl font-bold text-indigo-900">{campaign.clicks?.toLocaleString() || 0}</p>
                  <p className="text-xs text-indigo-700">{campaign.sent > 0 ? ((campaign.clicks! / campaign.sent) * 100).toFixed(1) : 0}%</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <p className="text-sm font-medium text-purple-700">Conversions</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{campaign.conversions || 0}</p>
                  <p className="text-xs text-purple-700">{campaign.sent > 0 ? ((campaign.conversions! / campaign.sent) * 100).toFixed(2) : 0}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Campaign Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Created Date</span>
                      <span className="text-sm font-medium text-gray-900">{campaign.createdDate}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Last Sent</span>
                      <span className="text-sm font-medium text-gray-900">{campaign.lastSent || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">From</span>
                      <span className="text-sm font-medium text-gray-900">{campaign.from || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600">Target Audience</span>
                      <span className="text-sm font-medium text-gray-900">{campaign.audience}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Delivery Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Bounces</span>
                      <span className="text-sm font-medium text-red-600">{campaign.bounces || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Unsubscribes</span>
                      <span className="text-sm font-medium text-red-600">{campaign.unsubscribes || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Bounce Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {campaign.sent > 0 ? ((campaign.bounces! / campaign.sent) * 100).toFixed(2) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-gray-600">Unsubscribe Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {campaign.sent > 0 ? ((campaign.unsubscribes! / campaign.sent) * 100).toFixed(2) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeViewTab === 'performance' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-semibold text-purple-900 mb-4">Performance Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-purple-700 mb-1">Engagement Rate</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {campaign.sent > 0 ? (((campaign.opens! + campaign.clicks!) / campaign.sent) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-700 mb-1">Click-to-Open Rate</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {campaign.opens > 0 ? ((campaign.clicks! / campaign.opens!) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-700 mb-1">Conversion Rate</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {campaign.sent > 0 ? ((campaign.conversions! / campaign.sent) * 100).toFixed(2) : 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Detailed performance charts coming soon</p>
              </div>
            </div>
          )}

          {activeViewTab === 'content' && (
            <div className="space-y-6">
              {campaign.subject && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Subject Line</h3>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{campaign.subject}</p>
                  </div>
                </div>
              )}

              {campaign.message && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Message Content</h3>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{campaign.message}</p>
                  </div>
                </div>
              )}

              {!campaign.subject && !campaign.message && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Content preview coming soon</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => alert('Edit functionality')}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Campaign
            </Button>
            <Button type="button" variant="outline" onClick={() => alert('Duplicate functionality')}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
          </div>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// Form View Modal
function FormViewModal({ form, onClose }: { form: any, onClose: () => void }) {
  const [activeViewTab, setActiveViewTab] = useState<'overview' | 'fields' | 'preview'>('overview');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{form.name}</h2>
              <p className="text-sm text-gray-600">{form.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                form.status === 'active' ? 'bg-green-100 text-green-800' :
                form.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {form.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              Created: {form.createdDate}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              {form.fields.length} fields
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'fields', label: 'Form Fields', icon: FileText },
              { id: 'preview', label: 'Preview', icon: Eye }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveViewTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeViewTab === tab.id
                      ? 'border-purple-600 text-purple-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeViewTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-medium text-blue-700">Submissions</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{form.submissions?.toLocaleString() || 0}</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-green-700">Conversion Rate</p>
                  </div>
                  <p className="text-2xl font-bold text-green-900">{form.conversionRate?.toLocaleString() || 0}%</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <p className="text-sm font-medium text-purple-700">Views</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{form.views?.toLocaleString() || 0}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Form Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Form ID</span>
                    <span className="text-sm font-medium text-gray-900">{form.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Created Date</span>
                    <span className="text-sm font-medium text-gray-900">{form.createdDate}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Number of Fields</span>
                    <span className="text-sm font-medium text-gray-900">{form.fields.length}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="text-sm font-medium text-green-600">{form.status}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeViewTab === 'fields' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">Form Fields Configuration</h3>
              <div className="space-y-3">
                {form.fields.map((field: any, idx: number) => (
                  <div key={field.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-gray-500">#{idx + 1}</span>
                          <h4 className="text-base font-semibold text-gray-900">{field.label}</h4>
                          {field.required && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                              Required
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-600">Field Type</p>
                            <p className="text-sm font-medium text-gray-900">{field.type}</p>
                          </div>
                          {field.placeholder && (
                            <div>
                              <p className="text-xs text-gray-600">Placeholder</p>
                              <p className="text-sm font-medium text-gray-900">{field.placeholder}</p>
                            </div>
                          )}
                          {field.options && (
                            <div className="col-span-2">
                              <p className="text-xs text-gray-600 mb-1">Options</p>
                              <div className="flex gap-2 flex-wrap">
                                {field.options.map((option: string, i: number) => (
                                  <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                    {option}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeViewTab === 'preview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-semibold text-purple-900 mb-4">Form Preview</h3>
                <div className="bg-white rounded-lg p-6 space-y-4">
                  {form.fields.map((field: any) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label} {field.required && <span className="text-red-600">*</span>}
                      </label>
                      {field.type === 'text' || field.type === 'email' || field.type === 'tel' ? (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                          disabled
                        />
                      ) : field.type === 'textarea' ? (
                        <textarea
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                          disabled
                        />
                      ) : field.type === 'select' ? (
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" disabled>
                          <option>Select an option</option>
                          {field.options?.map((option: string, i: number) => (
                            <option key={i}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'date' ? (
                        <input
                          type="date"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                          disabled
                        />
                      ) : field.type === 'checkbox-group' ? (
                        <div className="space-y-2">
                          {field.options?.map((option: string, i: number) => (
                            <label key={i} className="flex items-center gap-2">
                              <input type="checkbox" disabled className="rounded" />
                              <span className="text-sm text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium" disabled>
                    Submit Form
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => alert('Edit functionality')}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Form
            </Button>
            <Button type="button" variant="outline" onClick={() => alert('Duplicate functionality')}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
          </div>
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// Form Edit Modal
function FormEditModal({ form, onClose, onSave }: { form: any, onClose: () => void, onSave: (formName: string) => void }) {
  const [formName, setFormName] = useState(form.name);
  const [formFields, setFormFields] = useState(form.fields);
  const [activeEditTab, setActiveEditTab] = useState<'settings' | 'fields' | 'design'>('fields');

  const handleSaveForm = () => {
    onSave(formName);
  };

  const handleAddField = () => {
    const newField = {
      id: String(formFields.length + 1),
      label: 'New Field',
      type: 'text',
      required: false,
      placeholder: 'Enter value'
    };
    setFormFields([...formFields, newField]);
  };

  const handleRemoveField = (fieldId: string) => {
    setFormFields(formFields.filter((f: any) => f.id !== fieldId));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Form</h2>
              <p className="text-sm text-gray-600">{form.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            {[
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'fields', label: 'Form Builder', icon: FileText },
              { id: 'design', label: 'Design', icon: Sparkles }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveEditTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeEditTab === tab.id
                      ? 'border-purple-600 text-purple-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeEditTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Form Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Contact Us Form"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Form Status
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Success Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Thank you for your submission!"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submit Button Text
                </label>
                <input
                  type="text"
                  placeholder="Submit"
                  defaultValue="Submit"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {activeEditTab === 'fields' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Form Fields</h3>
                <Button type="button" size="sm" onClick={handleAddField}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </div>

              <div className="space-y-3">
                {formFields.map((field: any, idx: number) => (
                  <div key={field.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Field Label
                            </label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => {
                                const updated = [...formFields];
                                updated[idx].label = e.target.value;
                                setFormFields(updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Field Type
                            </label>
                            <select
                              value={field.type}
                              onChange={(e) => {
                                const updated = [...formFields];
                                updated[idx].type = e.target.value;
                                setFormFields(updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            >
                              <option value="text">Text</option>
                              <option value="email">Email</option>
                              <option value="tel">Phone</option>
                              <option value="textarea">Textarea</option>
                              <option value="select">Dropdown</option>
                              <option value="date">Date</option>
                              <option value="checkbox-group">Checkboxes</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => {
                                const updated = [...formFields];
                                updated[idx].required = e.target.checked;
                                setFormFields(updated);
                              }}
                              className="rounded"
                            />
                            <span className="text-xs text-gray-700">Required field</span>
                          </label>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveField(field.id)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {formFields.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">No fields added yet</p>
                  <Button type="button" onClick={handleAddField}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Field
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeEditTab === 'design' && (
            <div className="space-y-6">
              {/* AI-Powered Design Assistant */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6" />
                  <h3 className="font-semibold text-lg">AI Design Assistant</h3>
                </div>
                <p className="text-indigo-100 mb-6">
                  Let AI optimize your form design for maximum conversions using advanced analytics and design patterns
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-left transition-all"
                  >
                    <Target className="w-5 h-5 mb-2" />
                    <p className="text-sm font-medium">Optimize for Conversions</p>
                    <p className="text-xs text-indigo-100 mt-1">AI analyzes and improves layout</p>
                  </button>
                  <button
                    type="button"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-left transition-all"
                  >
                    <Sparkles className="w-5 h-5 mb-2" />
                    <p className="text-sm font-medium">Auto-Style</p>
                    <p className="text-xs text-indigo-100 mt-1">Apply AI-recommended design</p>
                  </button>
                  <button
                    type="button"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg p-3 text-left transition-all"
                  >
                    <TrendingUp className="w-5 h-5 mb-2" />
                    <p className="text-sm font-medium">A/B Test Ideas</p>
                    <p className="text-xs text-indigo-100 mt-1">Generate test variations</p>
                  </button>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-2">AI Recommendations</h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Reduce form fields from {formFields.length} to {Math.max(3, Math.floor(formFields.length * 0.6))} for 34% higher conversion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Add progress indicator for multi-step forms - increases completion by 28%</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Use action-oriented button text like "Get Started" instead of "Submit"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Add trust indicators (SSL badge, privacy policy link) for 23% boost</span>
                      </li>
                    </ul>
                    <button className="mt-4 text-sm font-medium text-blue-700 hover:text-blue-800 flex items-center gap-2">
                      Apply All Recommendations
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Manual Styling Options */}
              <div className="bg-white border border-gray-300 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Manual Styling</h3>
                <div className="space-y-6">
                  {/* Color Scheme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Color Scheme
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { name: 'Purple', primary: '#9333ea', secondary: '#a855f7' },
                        { name: 'Blue', primary: '#2563eb', secondary: '#3b82f6' },
                        { name: 'Green', primary: '#059669', secondary: '#10b981' },
                        { name: 'Orange', primary: '#ea580c', secondary: '#f97316' }
                      ].map((scheme) => (
                        <button
                          key={scheme.name}
                          type="button"
                          className="p-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                        >
                          <div className="flex gap-2 mb-2">
                            <div className="w-8 h-8 rounded" style={{ backgroundColor: scheme.primary }} />
                            <div className="w-8 h-8 rounded" style={{ backgroundColor: scheme.secondary }} />
                          </div>
                          <p className="text-xs font-medium text-gray-700">{scheme.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Typography */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Family
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Inter (Recommended)</option>
                      <option>Roboto</option>
                      <option>Open Sans</option>
                      <option>Lato</option>
                      <option>Montserrat</option>
                      <option>Poppins</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Size
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
                        <option>Small (14px)</option>
                        <option>Medium (16px)</option>
                        <option>Large (18px)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Label Position
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
                        <option>Above Field</option>
                        <option>Left of Field</option>
                        <option>Inside Field (Floating)</option>
                      </select>
                    </div>
                  </div>

                  {/* Layout */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Form Layout
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: 'Single Column', icon: '║' },
                        { name: 'Two Columns', icon: '╬' },
                        { name: 'Multi-Step', icon: '→' }
                      ].map((layout) => (
                        <button
                          key={layout.name}
                          type="button"
                          className="p-4 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition-colors text-center"
                        >
                          <div className="text-3xl mb-2 text-gray-400">{layout.icon}</div>
                          <p className="text-xs font-medium text-gray-700">{layout.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Field Style */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field Border Style
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { name: 'Rounded', value: '8px' },
                        { name: 'Square', value: '0px' },
                        { name: 'Pill', value: '50px' },
                        { name: 'Soft', value: '4px' }
                      ].map((style) => (
                        <button
                          key={style.name}
                          type="button"
                          className="p-3 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition-colors"
                        >
                          <div 
                            className="w-full h-8 bg-gray-100 border-2 border-gray-400 mb-2" 
                            style={{ borderRadius: style.value }}
                          />
                          <p className="text-xs font-medium text-gray-700">{style.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Button Style */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Submit Button Style
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: 'Solid', class: 'bg-purple-600 text-white' },
                        { name: 'Outline', class: 'bg-white border-2 border-purple-600 text-purple-600' },
                        { name: 'Gradient', class: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' }
                      ].map((style) => (
                        <button
                          key={style.name}
                          type="button"
                          className="p-3 border-2 border-gray-300 rounded-lg hover:border-purple-500 transition-colors"
                        >
                          <div className={`w-full py-2 rounded font-medium text-sm mb-2 ${style.class}`}>
                            Submit
                          </div>
                          <p className="text-xs font-medium text-gray-700">{style.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spacing */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field Spacing: <span className="font-normal text-gray-500">16px</span>
                    </label>
                    <input
                      type="range"
                      min="8"
                      max="32"
                      defaultValue="16"
                      className="w-full"
                    />
                  </div>

                  {/* Form Width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Form Width
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Narrow (400px)</option>
                      <option>Medium (600px)</option>
                      <option>Wide (800px)</option>
                      <option>Full Width</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Design History */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">AI Design History</h3>
                <div className="space-y-3">
                  {[
                    { action: 'Optimized button placement', time: '2 hours ago', impact: '+12% conversion' },
                    { action: 'Reduced form fields', time: '1 day ago', impact: '+18% completion' },
                    { action: 'Applied color scheme', time: '3 days ago', impact: '+8% engagement' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.action}</p>
                        <p className="text-xs text-gray-500">{item.time}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        {item.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="button" 
              className="bg-purple-600 hover:bg-purple-700 text-white" 
              onClick={handleSaveForm}
              disabled={!formName.trim()}
            >
              Save Changes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
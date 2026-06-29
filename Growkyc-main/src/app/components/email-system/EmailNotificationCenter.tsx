import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Mail,
  Send,
  Clock,
  Users,
  FileText,
  Settings,
  Eye,
  Edit,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Filter,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  Search,
  X,
  Save,
  Code,
  Monitor,
  Smartphone
} from 'lucide-react';
import { toast } from '../../lib/toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { EmailModals } from './EmailModals';

interface EmailNotificationCenterProps {
  onNavigate: (page: string) => void;
}

export function EmailNotificationCenter({ onNavigate }: EmailNotificationCenterProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'schedule' | 'analytics'>('overview');
  
  // Modal state management
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSendTestModal, setShowSendTestModal] = useState(false);
  const [showTemplatePreviewModal, setShowTemplatePreviewModal] = useState(false);
  const [showTemplateEditorModal, setShowTemplateEditorModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  
  // Additional modal states
  const [showSendNowModal, setShowSendNowModal] = useState(false);
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [showNewScheduleModal, setShowNewScheduleModal] = useState(false);
  const [showScheduleEditorModal, setShowScheduleEditorModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Mock data for email types
  const emailTypes = [
    {
      id: 'investor-daily',
      name: 'Investor Daily Digest',
      recipients: 247,
      frequency: 'Daily at 8:00 AM',
      lastSent: '2 hours ago',
      openRate: '78%',
      status: 'active',
      icon: TrendingUp,
      color: 'blue',
      description: 'Daily market updates, new deals, and portfolio performance'
    },
    {
      id: 'lender-daily',
      name: 'Lender Daily Report',
      recipients: 89,
      frequency: 'Daily at 7:00 AM',
      lastSent: '3 hours ago',
      openRate: '85%',
      status: 'active',
      icon: BarChart3,
      color: 'green',
      description: 'Loan performance, new applications, and risk alerts'
    },
    {
      id: 'lawyer-daily',
      name: 'Lawyer Daily Briefing',
      recipients: 34,
      frequency: 'Daily at 9:00 AM',
      lastSent: '1 hour ago',
      openRate: '92%',
      status: 'active',
      icon: FileText,
      color: 'purple',
      description: 'Case updates, pending reviews, and legal deadlines'
    },
    {
      id: 'case-updates',
      name: 'Case Status Updates',
      recipients: 156,
      frequency: 'Daily at 10:00 AM',
      lastSent: '30 minutes ago',
      openRate: '88%',
      status: 'active',
      icon: AlertCircle,
      color: 'orange',
      description: 'Updates for all parties involved in active cases'
    }
  ];

  const upcomingEmails = [
    {
      id: 1,
      type: 'Investor Daily Digest',
      scheduledFor: 'Tomorrow 8:00 AM',
      recipients: 247,
      status: 'scheduled'
    },
    {
      id: 2,
      type: 'Lender Daily Report',
      scheduledFor: 'Tomorrow 7:00 AM',
      recipients: 89,
      status: 'scheduled'
    },
    {
      id: 3,
      type: 'Lawyer Daily Briefing',
      scheduledFor: 'Tomorrow 9:00 AM',
      recipients: 34,
      status: 'scheduled'
    },
    {
      id: 4,
      type: 'Case Status Updates',
      scheduledFor: 'Tomorrow 10:00 AM',
      recipients: 156,
      status: 'scheduled'
    }
  ];

  const recentlySent = [
    {
      id: 1,
      type: 'Investor Daily Digest',
      sentAt: 'Today 8:00 AM',
      recipients: 247,
      delivered: 245,
      opened: 192,
      clicked: 87,
      bounced: 2
    },
    {
      id: 2,
      type: 'Lender Daily Report',
      sentAt: 'Today 7:00 AM',
      recipients: 89,
      delivered: 89,
      opened: 76,
      clicked: 52,
      bounced: 0
    },
    {
      id: 3,
      type: 'Lawyer Daily Briefing',
      sentAt: 'Today 9:00 AM',
      recipients: 34,
      delivered: 34,
      opened: 31,
      clicked: 28,
      bounced: 0
    }
  ];

  const stats = {
    totalRecipients: 526,
    emailsSentToday: 370,
    averageOpenRate: 85.7,
    averageClickRate: 42.3
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Email Notification Center</h2>
          <p className="text-slate-300">Manage daily emails and case update notifications</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowSettingsModal(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Email Settings
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowSendTestModal(true)}>
            <Send className="w-4 h-4 mr-2" />
            Send Test Email
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Total Recipients</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{stats.totalRecipients}</div>
          <div className="text-xs text-green-400 mt-1">↑ 12% from last week</div>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Sent Today</span>
            <Send className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{stats.emailsSentToday}</div>
          <div className="text-xs text-slate-400 mt-1">4 types</div>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Avg Open Rate</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{stats.averageOpenRate}%</div>
          <div className="text-xs text-green-400 mt-1">↑ 5% from yesterday</div>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Avg Click Rate</span>
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{stats.averageClickRate}%</div>
          <div className="text-xs text-green-400 mt-1">↑ 3% from yesterday</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'overview'
              ? 'text-blue-400 border-b-2 border-blue-600'
              : 'text-slate-300 hover:text-slate-100'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'templates'
              ? 'text-blue-400 border-b-2 border-blue-600'
              : 'text-slate-300 hover:text-slate-100'
          }`}
        >
          Email Templates
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'schedule'
              ? 'text-blue-400 border-b-2 border-blue-600'
              : 'text-slate-300 hover:text-slate-100'
          }`}
        >
          Schedule
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'text-blue-400 border-b-2 border-blue-600'
              : 'text-slate-300 hover:text-slate-100'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Email Types */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Email Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emailTypes.map((email) => {
                const Icon = email.icon;
                return (
                  <div key={email.id} className="bg-white rounded-lg border-2 border-white/10 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-${email.color}-100 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 text-${email.color}-600`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-100">{email.name}</h4>
                          <p className="text-sm text-slate-300">{email.description}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        email.status === 'active' ? 'bg-green-500/15 text-green-300' : 'bg-white/5 text-slate-300'
                      }`}>
                        {email.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-400">Recipients</p>
                        <p className="text-lg font-semibold text-slate-100">{email.recipients}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Open Rate</p>
                        <p className="text-lg font-semibold text-slate-100">{email.openRate}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-300 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {email.frequency}
                      </div>
                      <div className="text-xs">Last sent: {email.lastSent}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1" 
                        onClick={() => {
                          setSelectedTemplate(email);
                          setShowTemplatePreviewModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1" 
                        onClick={() => {
                          setSelectedTemplate(email);
                          setShowTemplateEditorModal(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1" 
                        onClick={() => {
                          setSelectedTemplate(email);
                          setShowSendNowModal(true);
                        }}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Send Now
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Emails */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Upcoming Scheduled Emails</h3>
            <div className="bg-white rounded-lg border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Email Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Scheduled For</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Recipients</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {upcomingEmails.map((email) => (
                    <tr key={email.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-sm font-medium text-slate-100">{email.type}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {email.scheduledFor}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">{email.recipients} users</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/15 text-blue-300">
                          Scheduled
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => toast.warning(`Cancelled scheduled email: ${email.type}`)}>
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recently Sent */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Recently Sent</h3>
            <div className="bg-white rounded-lg border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Email Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Sent At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Recipients</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Delivered</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Opened</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Clicked</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {recentlySent.map((email) => (
                    <tr key={email.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-sm font-medium text-slate-100">{email.type}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{email.sentAt}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{email.recipients}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                          <span className="text-slate-100">{email.delivered}</span>
                          <span className="text-slate-400 ml-1">
                            ({((email.delivered / email.recipients) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm">
                          <Eye className="w-4 h-4 text-blue-400 mr-1" />
                          <span className="text-slate-100">{email.opened}</span>
                          <span className="text-slate-400 ml-1">
                            ({((email.opened / email.delivered) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm">
                          <TrendingUp className="w-4 h-4 text-purple-400 mr-1" />
                          <span className="text-slate-100">{email.clicked}</span>
                          <span className="text-slate-400 ml-1">
                            ({((email.clicked / email.opened) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => toast.info(`Opening detailed report for ${email.type}...`)}>
                          View Report
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Template Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Email Templates</h3>
              <p className="text-sm text-slate-300">Manage and customize email templates for all notification types</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => toast.info('Importing template...')}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => toast.success('Creating new template...')}>
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </div>
          </div>

          {/* Template Library */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                id: 1,
                name: 'Investor Daily Digest',
                category: 'Daily Reports',
                lastModified: '2 days ago',
                status: 'active',
                usage: 247,
                preview: 'Market updates, new deals, and portfolio performance summary'
              },
              {
                id: 2,
                name: 'Lender Daily Report',
                category: 'Daily Reports',
                lastModified: '5 days ago',
                status: 'active',
                usage: 89,
                preview: 'Loan performance metrics and risk alerts'
              },
              {
                id: 3,
                name: 'Lawyer Daily Briefing',
                category: 'Daily Reports',
                lastModified: '1 week ago',
                status: 'active',
                usage: 34,
                preview: 'Case updates and pending legal reviews'
              },
              {
                id: 4,
                name: 'Case Status Update',
                category: 'Notifications',
                lastModified: '3 days ago',
                status: 'active',
                usage: 156,
                preview: 'Real-time case status changes for all parties'
              },
              {
                id: 5,
                name: 'Welcome Email',
                category: 'Onboarding',
                lastModified: '2 weeks ago',
                status: 'active',
                usage: 42,
                preview: 'Welcome new users to the platform'
              },
              {
                id: 6,
                name: 'Password Reset',
                category: 'Security',
                lastModified: '1 month ago',
                status: 'active',
                usage: 18,
                preview: 'Secure password reset instructions'
              }
            ].map((template) => (
              <div key={template.id} className="bg-white rounded-lg border-2 border-white/10 p-5 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-100 mb-1">{template.name}</h4>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-500/15 text-blue-300 rounded">
                      {template.category}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    template.status === 'active' ? 'bg-green-500/15 text-green-300' : 'bg-white/5 text-slate-300'
                  }`}>
                    {template.status}
                  </span>
                </div>

                <p className="text-sm text-slate-300 mb-4 line-clamp-2">{template.preview}</p>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span>Used by {template.usage} users</span>
                  <span>Modified {template.lastModified}</span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowTemplatePreviewModal(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowTemplateEditorModal(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.success(`Duplicated template: ${template.name}`)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Template Variables Reference */}
          <div className="bg-blue-500/10 rounded-lg border border-blue-500/30 p-5">
            <h4 className="font-semibold text-slate-100 mb-3 flex items-center">
              <FileText className="w-5 h-5 text-blue-400 mr-2" />
              Available Template Variables
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <code className="bg-white px-2 py-1 rounded text-blue-400 font-mono text-xs">{'{{user.name}}'}</code>
                <p className="text-slate-300 mt-1">User's full name</p>
              </div>
              <div>
                <code className="bg-white px-2 py-1 rounded text-blue-400 font-mono text-xs">{'{{user.email}}'}</code>
                <p className="text-slate-300 mt-1">User's email</p>
              </div>
              <div>
                <code className="bg-white px-2 py-1 rounded text-blue-400 font-mono text-xs">{'{{case.id}}'}</code>
                <p className="text-slate-300 mt-1">Case number</p>
              </div>
              <div>
                <code className="bg-white px-2 py-1 rounded text-blue-400 font-mono text-xs">{'{{date.today}}'}</code>
                <p className="text-slate-300 mt-1">Current date</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Schedule Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Email Schedule Manager</h3>
              <p className="text-sm text-slate-300">Configure delivery schedules and recurring email automation</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => toast.success('Creating new schedule...')}>
              <Plus className="w-4 h-4 mr-2" />
              New Schedule
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Active Schedules</span>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100">12</div>
              <div className="text-xs text-slate-400 mt-1">Running daily</div>
            </div>
            <div className="bg-white rounded-lg border border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Upcoming Today</span>
                <Calendar className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100">8</div>
              <div className="text-xs text-slate-400 mt-1">Next in 35 mins</div>
            </div>
            <div className="bg-white rounded-lg border border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Paused</span>
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100">3</div>
              <div className="text-xs text-slate-400 mt-1">Review required</div>
            </div>
            <div className="bg-white rounded-lg border border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">Failed Today</span>
                <X className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100">0</div>
              <div className="text-xs text-green-400 mt-1">All successful</div>
            </div>
          </div>

          {/* Schedule List */}
          <div className="bg-white rounded-lg border border-white/10 overflow-hidden">
            <div className="px-6 py-4 bg-white/5 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-100">Scheduled Emails</h4>
                <div className="flex gap-2">
                  <select className="px-3 py-1.5 border border-white/10 rounded-lg text-sm">
                    <option>All Schedules</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                  <select className="px-3 py-1.5 border border-white/10 rounded-lg text-sm">
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Paused</option>
                    <option>Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Email Template</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Next Send</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Recipients</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  {
                    id: 1,
                    template: 'Investor Daily Digest',
                    frequency: 'Daily at 8:00 AM',
                    nextSend: 'Tomorrow 8:00 AM',
                    recipients: 247,
                    status: 'active',
                    lastRun: '2 hours ago'
                  },
                  {
                    id: 2,
                    template: 'Lender Daily Report',
                    frequency: 'Daily at 7:00 AM',
                    nextSend: 'Tomorrow 7:00 AM',
                    recipients: 89,
                    status: 'active',
                    lastRun: '3 hours ago'
                  },
                  {
                    id: 3,
                    template: 'Lawyer Daily Briefing',
                    frequency: 'Daily at 9:00 AM',
                    nextSend: 'Tomorrow 9:00 AM',
                    recipients: 34,
                    status: 'active',
                    lastRun: '1 hour ago'
                  },
                  {
                    id: 4,
                    template: 'Weekly Summary',
                    frequency: 'Weekly on Monday at 9:00 AM',
                    nextSend: 'Monday 9:00 AM',
                    recipients: 526,
                    status: 'active',
                    lastRun: '6 days ago'
                  },
                  {
                    id: 5,
                    template: 'Monthly Report',
                    frequency: 'Monthly on 1st at 10:00 AM',
                    nextSend: 'March 1st 10:00 AM',
                    recipients: 526,
                    status: 'active',
                    lastRun: '21 days ago'
                  },
                  {
                    id: 6,
                    template: 'Compliance Reminder',
                    frequency: 'Weekly on Friday at 4:00 PM',
                    nextSend: 'Friday 4:00 PM',
                    recipients: 124,
                    status: 'paused',
                    lastRun: '2 weeks ago'
                  }
                ].map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-100">{schedule.template}</div>
                      <div className="text-xs text-slate-400">Last run: {schedule.lastRun}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {schedule.frequency}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {schedule.nextSend}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{schedule.recipients} users</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          schedule.status === 'active'
                            ? 'bg-green-500/15 text-green-300'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`Editing schedule: ${schedule.template}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toast.success(
                              schedule.status === 'active'
                                ? `Paused schedule: ${schedule.template}`
                                : `Activated schedule: ${schedule.template}`
                            )
                          }
                        >
                          {schedule.status === 'active' ? (
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Schedule Configuration Info */}
          <div className="bg-blue-500/10 rounded-lg border border-blue-500/30 p-5">
            <h4 className="font-semibold text-slate-100 mb-3 flex items-center">
              <Clock className="w-5 h-5 text-blue-400 mr-2" />
              Schedule Configuration Tips
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>All times are in AEST (Australian Eastern Standard Time)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Schedules can be paused without losing configuration</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Recipients are calculated dynamically based on role filters at send time</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Failed sends are automatically retried up to 3 times with exponential backoff</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">Email Analytics Dashboard</h3>
              <p className="text-sm text-slate-300">Comprehensive performance metrics and insights</p>
            </div>
            <div className="flex gap-2">
              <select className="px-3 py-1.5 border border-white/10 rounded-lg text-sm">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>This Year</option>
              </select>
              <Button variant="outline" onClick={() => toast.success('Exporting analytics report...')}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Sent', value: '2,847', change: '+12%', icon: Send, color: 'blue', trend: 'up' },
              { label: 'Delivery Rate', value: '99.2%', change: '+0.3%', icon: CheckCircle, color: 'green', trend: 'up' },
              { label: 'Open Rate', value: '85.7%', change: '+5.2%', icon: Eye, color: 'purple', trend: 'up' },
              { label: 'Click Rate', value: '42.3%', change: '+3.1%', icon: TrendingUp, color: 'orange', trend: 'up' }
            ].map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={idx} className="bg-white rounded-lg border border-white/10 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 bg-${metric.color}-100 rounded-lg`}>
                      <Icon className={`w-5 h-5 text-${metric.color}-600`} />
                    </div>
                    <span className={`text-xs font-semibold ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {metric.change}
                    </span>
                  </div>
                  <div className="text-sm text-slate-300 mb-1">{metric.label}</div>
                  <div className="text-2xl font-bold text-slate-100">{metric.value}</div>
                </div>
              );
            })}
          </div>

          {/* Performance by Email Type */}
          <div className="bg-white rounded-lg border border-white/10 p-6">
            <h4 className="font-semibold text-slate-100 mb-4">Performance by Email Type</h4>
            <div className="space-y-4">
              {[
                {
                  name: 'Investor Daily Digest',
                  sent: 247,
                  openRate: 78,
                  clickRate: 35,
                  bounceRate: 0.8
                },
                {
                  name: 'Lender Daily Report',
                  sent: 89,
                  openRate: 85,
                  clickRate: 58,
                  bounceRate: 0
                },
                {
                  name: 'Lawyer Daily Briefing',
                  sent: 34,
                  openRate: 92,
                  clickRate: 82,
                  bounceRate: 0
                },
                {
                  name: 'Case Status Updates',
                  sent: 156,
                  openRate: 88,
                  clickRate: 41,
                  bounceRate: 1.3
                }
              ].map((email, idx) => (
                <div key={idx} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-slate-100">{email.name}</div>
                    <div className="text-sm text-slate-400">{email.sent} sent</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-slate-300 mb-1">Open Rate</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${email.openRate}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-100 w-12 text-right">{email.openRate}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-300 mb-1">Click Rate</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${email.clickRate}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-100 w-12 text-right">{email.clickRate}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-300 mb-1">Bounce Rate</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 rounded-full h-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${email.bounceRate * 10}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-100 w-12 text-right">{email.bounceRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 7-Day Trend */}
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <h4 className="font-semibold text-slate-100 mb-4">7-Day Engagement Trend</h4>
              <div className="space-y-3">
                {[
                  { day: 'Monday', sent: 428, opened: 362, clicked: 178 },
                  { day: 'Tuesday', sent: 412, opened: 355, clicked: 164 },
                  { day: 'Wednesday', sent: 438, opened: 381, clicked: 192 },
                  { day: 'Thursday', sent: 425, opened: 364, clicked: 175 },
                  { day: 'Friday', sent: 408, opened: 342, clicked: 158 },
                  { day: 'Saturday', sent: 95, opened: 78, clicked: 32 },
                  { day: 'Sunday', sent: 78, opened: 62, clicked: 24 }
                ].map((day, idx) => {
                  const maxSent = 438;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-24 text-sm text-slate-300">{day.day}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/5 rounded-full h-6 relative overflow-hidden">
                            <div
                              className="bg-blue-500 h-full"
                              style={{ width: `${(day.sent / maxSent) * 100}%` }}
                            />
                            <div
                              className="bg-purple-500 h-full absolute top-0"
                              style={{ width: `${(day.opened / maxSent) * 100}%` }}
                            />
                            <div
                              className="bg-green-500 h-full absolute top-0"
                              style={{ width: `${(day.clicked / maxSent) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-100 w-12 text-right">
                            {day.sent}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center gap-4 pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-blue-500 rounded" />
                    <span className="text-slate-300">Sent</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-purple-500 rounded" />
                    <span className="text-slate-300">Opened</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span className="text-slate-300">Clicked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Content */}
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <h4 className="font-semibold text-slate-100 mb-4">Top Performing Content</h4>
              <div className="space-y-4">
                {[
                  {
                    title: 'New Property Listings',
                    clicks: 342,
                    ctr: '24.8%',
                    category: 'Investment'
                  },
                  {
                    title: 'Market Analysis Report',
                    clicks: 287,
                    ctr: '21.2%',
                    category: 'Insights'
                  },
                  {
                    title: 'Case Status Updates',
                    clicks: 264,
                    ctr: '19.5%',
                    category: 'Operations'
                  },
                  {
                    title: 'Legal Review Required',
                    clicks: 198,
                    ctr: '14.6%',
                    category: 'Compliance'
                  },
                  {
                    title: 'Portfolio Performance',
                    clicks: 156,
                    ctr: '11.5%',
                    category: 'Finance'
                  }
                ].map((content, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-slate-100 text-sm">{content.title}</div>
                      <div className="text-xs text-slate-400">{content.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-100">{content.clicks} clicks</div>
                      <div className="text-xs text-green-400">{content.ctr} CTR</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recipient Insights */}
          <div className="bg-white rounded-lg border border-white/10 p-6">
            <h4 className="font-semibold text-slate-100 mb-4">Recipient Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-slate-300 mb-3">By User Role</div>
                <div className="space-y-2">
                  {[
                    { role: 'Investors', count: 247, percentage: 47 },
                    { role: 'Lenders', count: 89, percentage: 17 },
                    { role: 'Lawyers', count: 34, percentage: 6 },
                    { role: 'Admin', count: 156, percentage: 30 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.role}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-white/10 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="font-medium text-slate-100 w-10 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-300 mb-3">Peak Engagement Times</div>
                <div className="space-y-2">
                  {[
                    { time: '8:00 AM - 10:00 AM', rate: 89 },
                    { time: '12:00 PM - 2:00 PM', rate: 76 },
                    { time: '4:00 PM - 6:00 PM', rate: 62 },
                    { time: 'Other times', rate: 45 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.time}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-white/10 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${item.rate}%` }}
                          />
                        </div>
                        <span className="font-medium text-slate-100 w-10 text-right">{item.rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-300 mb-3">Device Type</div>
                <div className="space-y-2">
                  {[
                    { device: 'Desktop', percentage: 58 },
                    { device: 'Mobile', percentage: 35 },
                    { device: 'Tablet', percentage: 7 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.device}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-white/10 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="font-medium text-slate-100 w-10 text-right">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-amber-500/10 rounded-lg border border-amber-500/30 p-5">
            <h4 className="font-semibold text-slate-100 mb-3 flex items-center">
              <AlertCircle className="w-5 h-5 text-amber-400 mr-2" />
              Recommendations
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start">
                <TrendingUp className="w-4 h-4 text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Open rates peaked 8-10 AM:</strong> Consider scheduling more emails during this time window
                </span>
              </li>
              <li className="flex items-start">
                <TrendingUp className="w-4 h-4 text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Mobile opens at 35%:</strong> Ensure templates are fully mobile-responsive
                </span>
              </li>
              <li className="flex items-start">
                <TrendingUp className="w-4 h-4 text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Lawyer emails have 92% open rate:</strong> Use similar subject line patterns for other segments
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Email Modals */}
      <EmailModals
        showSettingsModal={showSettingsModal}
        setShowSettingsModal={setShowSettingsModal}
        showSendTestModal={showSendTestModal}
        setShowSendTestModal={setShowSendTestModal}
        showTemplatePreviewModal={showTemplatePreviewModal}
        setShowTemplatePreviewModal={setShowTemplatePreviewModal}
        showTemplateEditorModal={showTemplateEditorModal}
        setShowTemplateEditorModal={setShowTemplateEditorModal}
        selectedTemplate={selectedTemplate}
        previewDevice={previewDevice}
        setPreviewDevice={setPreviewDevice}
      />
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Globe,
  Eye,
  EyeOff,
  Settings,
  Copy,
  ExternalLink,
  Mail,
  MessageSquare,
  Upload,
  Download,
  FileText,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  User,
  Palette,
  Code,
  Smartphone,
  Monitor,
  Share2
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';
import {
  buildPortalProgress,
  generateUploadPromptsFromMissingItems,
  type PortalMissingItem,
  type PortalStatus,
  type PortalStep,
} from '../../../lib/portal';

interface ClientPortalProps {
  onNavigate?: (page: string) => void;
}

export function ClientPortal({ onNavigate }: ClientPortalProps) {
  const [portalEnabled, setPortalEnabled] = useState(true);
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const portalSettings = {
    url: 'https://portal.growaccounting.com.au',
    customDomain: 'portal.yourfirm.com.au',
    enabledFeatures: [
      'Document Upload',
      'Document Download',
      'Job Status Tracking',
      'Message Center',
      'Invoice Payment',
      'Engagement Letters'
    ],
    branding: {
      logo: 'Your firm logo',
      primaryColor: '#2855a6',
      companyName: 'Your Accounting Firm'
    }
  };

  const clientStats = {
    totalClients: 135,
    activePortalUsers: 98,
    pendingInvites: 12,
    documentsShared: 1432,
    messagesExchanged: 876
  };

  const recentActivity = [
    { id: '1', client: 'Smith SMSF', action: 'Uploaded Bank_Statement.pdf', time: '10 minutes ago', type: 'upload' },
    { id: '2', client: 'ABC Pty Ltd', action: 'Downloaded Tax Return', time: '1 hour ago', type: 'download' },
    { id: '3', client: 'XYZ Trust', action: 'Signed Engagement Letter', time: '2 hours ago', type: 'sign' },
    { id: '4', client: 'Wilson SMSF', action: 'Sent message about BAS', time: '3 hours ago', type: 'message' },
    { id: '5', client: 'Brown Individual', action: 'Viewed invoice', time: '5 hours ago', type: 'view' }
  ];

  const portalSteps: Array<PortalStep & { required: boolean }> = [
    {
      step_id: 'profile',
      title: 'Client profile setup',
      required: true,
      status: 'completed',
      updated_at: '2026-03-29T09:00:00.000Z',
      completed_at: '2026-03-29T09:00:00.000Z'
    },
    {
      step_id: 'identity',
      title: 'Identity verification',
      required: true,
      status: 'under_review',
      updated_at: '2026-03-29T09:10:00.000Z'
    },
    {
      step_id: 'engagement',
      title: 'Engagement letter',
      required: true,
      status: 'changes_requested',
      updated_at: '2026-03-29T09:20:00.000Z'
    },
    {
      step_id: 'documents',
      title: 'Required documents',
      required: true,
      status: 'awaiting_documents',
      updated_at: '2026-03-29T09:30:00.000Z'
    },
    {
      step_id: 'billing',
      title: 'Billing preferences',
      required: false,
      status: 'in_progress',
      updated_at: '2026-03-29T09:40:00.000Z'
    },
    {
      step_id: 'portal-access',
      title: 'Portal access enabled',
      required: true,
      status: (portalEnabled ? 'completed' : 'not_started') as PortalStatus,
      updated_at: '2026-03-29T09:50:00.000Z'
    }
  ];

  const missingItems: PortalMissingItem[] = [
    {
      item_id: 'missing-engagement-signature',
      tenant_id: 'client-portal',
      step_id: 'engagement',
      label: 'Signed engagement letter',
      reason: 'Please update and re-sign the engagement letter section.',
      status: 'changes_requested',
      requested_at: '2026-03-29T09:25:00.000Z'
    },
    {
      item_id: 'missing-address-proof',
      tenant_id: 'client-portal',
      step_id: 'documents',
      label: 'Proof of address document',
      reason: 'Upload a recent utility bill or bank statement.',
      status: 'awaiting_documents',
      requested_at: '2026-03-29T09:35:00.000Z'
    }
  ];

  const requiredSteps = portalSteps.filter((step) => step.required);
  const portalProgress = buildPortalProgress({
    steps: portalSteps,
    missing_items: missingItems,
  });
  const blockedStepIds = portalProgress.blocked_steps.map((step) => step.step_id);
  const uploadPrompts = generateUploadPromptsFromMissingItems({
    missing_items: portalProgress.missing_required_items,
    blocked_step_ids: blockedStepIds,
  });

  const completedRequiredSteps = requiredSteps.filter((step) => step.status === 'completed').length;
  const completionProgress = Math.round(portalProgress.completion_percent);
  const reviewSummary = {
    underReview: portalSteps.filter((step) => step.status === 'under_review').length,
    changesRequested: portalSteps.filter((step) => step.status === 'changes_requested').length,
    completed: portalSteps.filter((step) => step.status === 'completed').length
  };

  const getStepStatusBadgeClasses = (status: PortalStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/15 text-green-300 border border-green-500/30';
      case 'under_review':
        return 'bg-blue-500/15 text-blue-300 border border-blue-500/30';
      case 'changes_requested':
        return 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
      case 'awaiting_documents':
        return 'bg-orange-500/15 text-orange-300 border border-orange-500/30';
      case 'in_progress':
        return 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30';
      case 'not_started':
      default:
        return 'bg-white/5 text-slate-300 border border-white/10';
    }
  };

  const formatStepStatus = (status: PortalStatus) => {
    return status.split('_').map((segment) => segment[0].toUpperCase() + segment.slice(1)).join(' ');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload className="w-4 h-4 text-blue-400" />;
      case 'download': return <Download className="w-4 h-4 text-green-400" />;
      case 'sign': return <CheckCircle className="w-4 h-4 text-purple-400" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-orange-400" />;
      case 'view': return <Eye className="w-4 h-4 text-slate-300" />;
      default: return <FileText className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <WorkpaperLayout currentPage="portal" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-slate-100">Client Portal</h1>
            <p className="text-sm text-slate-300 mt-1">Secure white-labeled portal for client collaboration</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Total Clients</p>
                  <p className="text-2xl font-bold text-slate-100">{clientStats.totalClients}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Active Users</p>
                  <p className="text-2xl font-bold text-slate-100">{clientStats.activePortalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Pending</p>
                  <p className="text-2xl font-bold text-slate-100">{clientStats.pendingInvites}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Documents</p>
                  <p className="text-2xl font-bold text-slate-100">{clientStats.documentsShared}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-pink-500/10 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Messages</p>
                  <p className="text-2xl font-bold text-slate-100">{clientStats.messagesExchanged}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Configuration */}
          <div className="col-span-5 space-y-6">
            {/* Portal Status */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Portal Status</h3>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg mb-4">
                  <div className="flex items-center gap-3">
                    {portalEnabled ? (
                      <>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="font-medium text-slate-100">Portal is Live</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                        <span className="font-medium text-slate-100">Portal is Disabled</span>
                      </>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant={portalEnabled ? 'outline' : 'default'}
                    onClick={() => setPortalEnabled(!portalEnabled)}
                  >
                    {portalEnabled ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {portalEnabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {portalSteps.slice(0, 4).map((step) => (
                    <span
                      key={step.step_id}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStepStatusBadgeClasses(step.status)}`}
                    >
                      {formatStepStatus(step.status)}
                    </span>
                  ))}
                </div>

                <div className="mb-4 rounded-lg border border-white/10 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-100">Onboarding Progress</p>
                    <p className="text-sm font-semibold text-slate-300">{completionProgress}%</p>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-[#2855a6] rounded-full transition-all"
                      style={{ width: `${completionProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-300">
                    {completedRequiredSteps} of {requiredSteps.length} required steps completed
                  </p>
                </div>

                <div className="mb-4 rounded-lg border border-white/10 p-4">
                  <p className="text-sm font-semibold text-slate-100 mb-2">Missing Required Items</p>
                  {uploadPrompts.length === 0 ? (
                    <p className="text-xs text-green-300">No missing required items.</p>
                  ) : (
                    <ul className="space-y-1">
                      {uploadPrompts.slice(0, 3).map((prompt) => (
                        <li key={prompt.item_id} className="flex items-center justify-between text-xs">
                          <span className="text-slate-300">{prompt.title}</span>
                          <span className={`px-2 py-0.5 rounded-full font-medium ${getStepStatusBadgeClasses(prompt.urgency === 'critical' ? 'changes_requested' : prompt.urgency === 'high' ? 'awaiting_documents' : 'in_progress')}`}>
                            {prompt.urgency === 'critical' ? 'Urgent' : prompt.urgency === 'high' ? 'High' : 'Normal'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mb-4 rounded-lg border border-white/10 p-4">
                  <p className="text-sm font-semibold text-slate-100 mb-2">Review Status</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-500/10 rounded-lg p-2">
                      <p className="text-lg font-bold text-blue-300">{reviewSummary.underReview}</p>
                      <p className="text-[11px] text-blue-300">Under Review</p>
                    </div>
                    <div className="bg-amber-500/10 rounded-lg p-2">
                      <p className="text-lg font-bold text-amber-300">{reviewSummary.changesRequested}</p>
                      <p className="text-[11px] text-amber-300">Changes Requested</p>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-2">
                      <p className="text-lg font-bold text-green-300">{reviewSummary.completed}</p>
                      <p className="text-[11px] text-green-300">Completed</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-2">Blocked steps: {portalProgress.blocked_steps_count}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Portal URL</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={portalSettings.url}
                        readOnly
                        className="flex-1 px-3 py-2 border border-white/10 rounded-lg text-sm bg-white/5"
                      />
                      <Button size="sm" variant="outline">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 mb-1 block">Custom Domain</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={portalSettings.customDomain}
                        onChange={() => {}}
                        className="flex-1 px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                      />
                      <Button size="sm">Save</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Branding */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-100">Branding</h3>
                  <Button size="sm" variant="outline">
                    <Palette className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-300 mb-2 block">Company Name</label>
                    <input
                      type="text"
                      value={portalSettings.branding.companyName}
                      onChange={() => {}}
                      className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 mb-2 block">Logo</label>
                    <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-300 mb-2">Upload your logo</p>
                      <Button size="sm" variant="outline">Choose File</Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 mb-2 block">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={portalSettings.branding.primaryColor}
                        onChange={() => {}}
                        className="w-12 h-10 border border-white/10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={portalSettings.branding.primaryColor}
                        onChange={() => {}}
                        className="flex-1 px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enabled Features */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Enabled Features</h3>
                <div className="space-y-2">
                  {portalSettings.enabledFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-slate-100">{feature}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#2855a6] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2855a6]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview & Activity */}
          <div className="col-span-7 space-y-6">
            {/* Portal Preview */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-100">Portal Preview</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-2 rounded ${previewDevice === 'desktop' ? 'bg-[#2855a6] text-white' : 'bg-white/5 text-slate-300'}`}
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-[#2855a6] text-white' : 'bg-white/5 text-slate-300'}`}
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Preview Frame */}
                <div className={`border-2 border-white/10 rounded-lg overflow-hidden ${
                  previewDevice === 'mobile' ? 'max-w-sm mx-auto' : ''
                }`}>
                  <div className="bg-[#2855a6] p-4 text-white">
                    <h2 className="font-bold text-lg">Your Accounting Firm</h2>
                    <p className="text-sm opacity-90">Client Portal</p>
                  </div>

                  <div className="bg-white p-6 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-sm text-slate-300">Welcome, John Smith</span>
                      <User className="w-4 h-4 text-slate-300" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 border border-white/10 rounded-lg text-center hover:border-[#2855a6] cursor-pointer">
                        <Upload className="w-6 h-6 text-[#2855a6] mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-100">Upload</p>
                      </div>
                      <div className="p-4 border border-white/10 rounded-lg text-center hover:border-[#2855a6] cursor-pointer">
                        <FileText className="w-6 h-6 text-[#2855a6] mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-100">Documents</p>
                      </div>
                      <div className="p-4 border border-white/10 rounded-lg text-center hover:border-[#2855a6] cursor-pointer">
                        <MessageSquare className="w-6 h-6 text-[#2855a6] mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-100">Messages</p>
                      </div>
                      <div className="p-4 border border-white/10 rounded-lg text-center hover:border-[#2855a6] cursor-pointer">
                        <Clock className="w-6 h-6 text-[#2855a6] mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-100">Jobs</p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <p className="text-sm font-medium text-blue-300 mb-1">BAS Due Soon</p>
                      <p className="text-xs text-blue-300">Q4 2024 BAS due on March 18, 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="p-2 bg-white rounded-lg border border-white/10">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-100">
                          <strong>{activity.client}</strong>
                        </p>
                        <p className="text-sm text-slate-300">{activity.action}</p>
                        <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions & Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Share2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Invite Clients</h3>
                  <p className="text-xs text-slate-300">Send portal access invites</p>
                </div>
              </div>
              <Button className="w-full bg-[#2855a6] hover:bg-[#1e4089]">
                <Mail className="w-4 h-4 mr-2" />
                Send Invitations
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Lock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Security Settings</h3>
                  <p className="text-xs text-slate-300">2FA, password policies</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Configure Security
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Code className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Embed Code</h3>
                  <p className="text-xs text-slate-300">Add to your website</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Copy className="w-4 h-4 mr-2" />
                Get Embed Code
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </WorkpaperLayout>
  );
}
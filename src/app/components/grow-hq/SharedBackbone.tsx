import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  Target,
  FileText,
  CheckSquare,
  DollarSign,
  BarChart3,
  Shield,
  Clock,
  Upload,
  MessageSquare,
  Settings,
  Zap,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Lock,
  Eye
} from 'lucide-react';
import { PrimaryButton, SecondaryButton, StatusBadge } from '../onboarding/DesignSystem';
import { toast } from 'sonner';

type Module = 'universal' | 'workflow' | 'portal' | 'reporting' | 'compliance';

interface UniversalObject {
  type: string;
  count: number;
  icon: any;
  description: string;
}

export function SharedBackbone() {
  const [activeModule, setActiveModule] = useState<Module>('universal');

  // Universal Objects across all verticals
  const universalObjects: UniversalObject[] = [
    {
      type: 'People',
      count: 1247,
      icon: Users,
      description: 'Staff, clients, contacts, related parties'
    },
    {
      type: 'Entities',
      count: 856,
      icon: Briefcase,
      description: 'Companies, trusts, partnerships, individuals'
    },
    {
      type: 'Groups',
      count: 234,
      icon: Target,
      description: 'Client groups, family structures, corporate groups'
    },
    {
      type: 'Jobs/Matters/Deals',
      count: 3421,
      icon: FileText,
      description: 'Work items specific to your vertical'
    },
    {
      type: 'Tasks & Approvals',
      count: 8765,
      icon: CheckSquare,
      description: 'Task workflows with approval chains'
    },
    {
      type: 'Documents',
      count: 45678,
      icon: FileText,
      description: 'Templates, versions, signatures'
    },
    {
      type: 'Invoices & Payments',
      count: 12345,
      icon: DollarSign,
      description: 'Billing, payments, aged debtors'
    }
  ];

  const renderUniversalObjects = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Universal Data Model</h2>
        <p className="text-blue-100">
          One data model, many workflows. These objects work across Accounting, Legal, and Finance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {universalObjects.map((obj, idx) => {
          const Icon = obj.icon;
          return (
            <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300">
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-blue-600" />
                <span className="text-3xl font-bold text-gray-900">{obj.count.toLocaleString()}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{obj.type}</h3>
              <p className="text-sm text-gray-600">{obj.description}</p>
            </div>
          );
        })}
      </div>

      {/* Relationship Mapping */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4">Relationship Mapping</h3>
        <div className="grid grid-cols-3 gap-6">
          {[
            { from: 'Person', to: 'Entity', type: 'Director, Shareholder, Trustee, Beneficiary' },
            { from: 'Entity', to: 'Entity', type: 'Parent company, Subsidiary, Related party' },
            { from: 'Person', to: 'Job', type: 'Client, Contact, Counterparty, Fee earner' }
          ].map((rel, idx) => (
            <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">{rel.from}</span>
                <span className="text-gray-400">→</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">{rel.to}</span>
              </div>
              <p className="text-xs text-gray-600">{rel.type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Fields */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Custom Fields</h3>
          <p className="text-sm text-gray-600 mb-4">
            Add unlimited custom fields to any object. Visible across all modules.
          </p>
          <div className="space-y-2">
            {['Text', 'Number', 'Date', 'Dropdown', 'Checkbox', 'Multi-select'].map((type) => (
              <div key={type} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-sm text-gray-700">{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Tags & Labels</h3>
          <p className="text-sm text-gray-600 mb-4">
            Organize records with tags. Filter and report by tag across all objects.
          </p>
          <div className="flex flex-wrap gap-2">
            {['High Value', 'Active', 'VIP', 'At Risk', 'New', 'Archive'].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkflowStudio = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Workflow Studio</h2>
        <p className="text-purple-100">
          No-code workflow builder with triggers, conditions, and actions
        </p>
      </div>

      {/* Workflow Builder Preview */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4">Visual Workflow Builder</h3>
        <div className="flex items-center justify-center gap-4 py-12">
          <div className="p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center">
            <Zap className="w-6 h-6 text-green-700 mx-auto mb-2" />
            <p className="text-sm font-bold text-green-900">TRIGGER</p>
            <p className="text-xs text-green-700">Job created</p>
          </div>
          <div className="w-12 h-0.5 bg-gray-300" />
          <div className="p-4 bg-blue-100 border-2 border-blue-500 rounded-lg text-center">
            <AlertTriangle className="w-6 h-6 text-blue-700 mx-auto mb-2" />
            <p className="text-sm font-bold text-blue-900">CONDITION</p>
            <p className="text-xs text-blue-700">If value &gt; $10K</p>
          </div>
          <div className="w-12 h-0.5 bg-gray-300" />
          <div className="p-4 bg-purple-100 border-2 border-purple-500 rounded-lg text-center">
            <CheckSquare className="w-6 h-6 text-purple-700 mx-auto mb-2" />
            <p className="text-sm font-bold text-purple-900">ACTION</p>
            <p className="text-xs text-purple-700">Send for approval</p>
          </div>
        </div>
      </div>

      {/* Workflow Features */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Triggers</h3>
          <div className="space-y-3">
            {[
              { trigger: 'Time-based', desc: 'Daily, weekly, monthly, or custom schedule' },
              { trigger: 'Event-based', desc: 'Record created, updated, or status changed' },
              { trigger: 'Webhook', desc: 'External system triggers workflow' },
              { trigger: 'Manual', desc: 'User clicks a button to start' }
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded">
                <p className="text-sm font-semibold text-gray-900">{item.trigger}</p>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
          <div className="space-y-3">
            {[
              { action: 'Create task', desc: 'Assign to person or team with due date' },
              { action: 'Send email/SMS', desc: 'From template with merge fields' },
              { action: 'Update record', desc: 'Change status, fields, or tags' },
              { action: 'Create document', desc: 'From template with auto-merge' }
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded">
                <p className="text-sm font-semibold text-gray-900">{item.action}</p>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SLA & Escalation */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4">SLA Timers & Escalation</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { stage: 'Warning', time: '24 hours', action: 'Email reminder to owner' },
            { stage: 'Overdue', time: '48 hours', action: 'Escalate to manager' },
            { stage: 'Critical', time: '72 hours', action: 'Escalate to partner' }
          ].map((sla, idx) => (
            <div key={idx} className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">
                  {sla.stage}
                </span>
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{sla.time}</p>
              <p className="text-xs text-gray-600">{sla.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderClientPortal = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Client Portal</h2>
        <p className="text-green-100">
          Secure portals for clients, third parties, and collaborators
        </p>
      </div>

      {/* Portal Features */}
      <div className="grid grid-cols-3 gap-6">
        {[
          {
            title: 'Secure Login',
            desc: 'Per client organization with SSO support',
            icon: Lock,
            features: ['Email/password', 'SSO integration', '2FA optional', 'Session timeout']
          },
          {
            title: 'Status Tracking',
            desc: 'Real-time job/matter/deal progress',
            icon: Eye,
            features: ['Milestone view', 'Task checklist', 'Timeline', 'Notifications']
          },
          {
            title: 'Upload & E-Sign',
            desc: 'Document requests and signatures',
            icon: Upload,
            features: ['Drag & drop', 'Request specific docs', 'E-signature', 'Version history']
          }
        ].map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <Icon className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{feature.desc}</p>
              <div className="space-y-2">
                {feature.features.map((f, fidx) => (
                  <div key={fidx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    <span className="text-xs text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Portal Mockup */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 text-white p-4 rounded-t-lg flex items-center justify-between">
            <h3 className="font-bold">Client Portal - Acme Pty Ltd</h3>
            <button className="px-3 py-1 bg-white bg-opacity-20 rounded text-sm">Logout</button>
          </div>
          <div className="border-2 border-gray-300 rounded-b-lg p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">FY2024 Tax Return</p>
                <p className="text-sm text-gray-600">In Progress • 3 of 7 tasks complete</p>
              </div>
              <StatusBadge status="medium-risk" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300">
                <Upload className="w-6 h-6 text-gray-600 mb-2" />
                <p className="text-sm font-semibold">Upload Documents</p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300">
                <MessageSquare className="w-6 h-6 text-gray-600 mb-2" />
                <p className="text-sm font-semibold">Send Message</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReporting = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Reporting & Analytics</h2>
        <p className="text-orange-100">
          Pre-built reports and custom dashboards for every vertical
        </p>
      </div>

      {/* Standard Reports */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { report: 'Revenue', metric: '$2.4M', change: '+18%', icon: DollarSign, color: 'green' },
          { report: 'Utilization', metric: '87%', change: '+3%', icon: Clock, color: 'blue' },
          { report: 'Margin', metric: '42%', change: '+5%', icon: TrendingUp, color: 'purple' },
          { report: 'Pipeline', metric: '$5.6M', change: '+12%', icon: Target, color: 'orange' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`bg-${stat.color}-50 border-2 border-${stat.color}-200 rounded-lg p-4`}>
              <Icon className={`w-6 h-6 text-${stat.color}-600 mb-3`} />
              <p className={`text-2xl font-bold text-${stat.color}-900 mb-1`}>{stat.metric}</p>
              <p className="text-sm text-gray-700 mb-2">{stat.report}</p>
              <span className={`text-xs font-bold text-${stat.color}-600`}>{stat.change}</span>
            </div>
          );
        })}
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Financial Reports</h3>
          <div className="space-y-2">
            {[
              'Revenue by client and service line',
              'Aged WIP and debtors',
              'Margin by job/matter/deal',
              'Payment collection rates',
              'Write-offs and recoverability'
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{report}</span>
                <button className="text-blue-600 text-xs hover:underline">View</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Operational Reports</h3>
          <div className="space-y-2">
            {[
              'Utilization by staff',
              'Workload and capacity',
              'SLA compliance by team',
              'Pipeline forecast',
              'Job/Matter/Deal aging'
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{report}</span>
                <button className="text-blue-600 text-xs hover:underline">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Risk & Compliance Layer</h2>
        <p className="text-red-100">
          Enterprise-grade security, audit trails, and governance
        </p>
      </div>

      {/* Compliance Features */}
      <div className="grid grid-cols-3 gap-6">
        {[
          {
            title: 'Audit Trail',
            desc: 'Every change logged with who, what, when',
            icon: Eye,
            features: ['Full change history', 'User attribution', 'Timestamp', 'IP address']
          },
          {
            title: 'File Completeness',
            desc: 'Score and alerts for missing docs',
            icon: CheckSquare,
            features: ['Completeness score', 'Missing doc alerts', 'Quality checks', 'Review workflows']
          },
          {
            title: 'Permissions',
            desc: 'Role-based access by sensitivity',
            icon: Lock,
            features: ['Role-based', 'Matter sensitivity', 'Field-level', 'Time-based access']
          }
        ].map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <Icon className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{feature.desc}</p>
              <div className="space-y-2">
                {feature.features.map((f, fidx) => (
                  <div key={fidx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    <span className="text-xs text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Retention */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4">Document Retention Policies</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { category: 'Tax Returns', retention: '7 years', action: 'Archive then delete' },
            { category: 'Matter Files', retention: '10 years', action: 'Archive indefinitely' },
            { category: 'Loan Files', retention: '7 years after discharge', action: 'Archive then delete' }
          ].map((policy, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-900 mb-2">{policy.category}</p>
              <p className="text-sm text-gray-600 mb-1">Retain: {policy.retention}</p>
              <p className="text-xs text-gray-500">{policy.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'universal', label: 'Universal Objects', icon: Briefcase },
            { id: 'workflow', label: 'Workflow Studio', icon: Zap },
            { id: 'portal', label: 'Client Portal', icon: Users },
            { id: 'reporting', label: 'Reporting', icon: BarChart3 },
            { id: 'compliance', label: 'Risk & Compliance', icon: Shield }
          ].map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id as Module)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeModule === module.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {module.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeModule === 'universal' && renderUniversalObjects()}
      {activeModule === 'workflow' && renderWorkflowStudio()}
      {activeModule === 'portal' && renderClientPortal()}
      {activeModule === 'reporting' && renderReporting()}
      {activeModule === 'compliance' && renderCompliance()}
    </div>
  );
}

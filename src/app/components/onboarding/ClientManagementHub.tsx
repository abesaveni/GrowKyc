import React, { useState } from 'react';
import {
  Users,
  FileText,
  Workflow,
  DollarSign,
  BarChart3,
  Mail,
  FolderOpen,
  Search,
  FileSignature,
  CreditCard,
  Download,
  Upload,
  Filter,
  Plus,
  CheckSquare,
  Calendar,
  Network,
  MessageSquare,
  Brain,
  RefreshCw,
  Send,
  Eye,
  Edit,
  Trash2,
  Copy,
  ArrowRight
} from 'lucide-react';
import { PrimaryButton, SecondaryButton, StatusBadge } from './DesignSystem';
import { SecureAICopilot, TrainingCenter, DocumentCollaboration } from './SecureAICopilot';
import { ClientOnboarding } from './ClientOnboarding';
import { PracticePlanning } from './PracticePlanning';
import { ReportingVisuals } from './ReportingVisuals';
import { FuseSign } from '../client-hub/FuseSign';
import { ManagerApproval } from './ManagerApproval';
import { toast } from 'sonner';

type ClientManagementView = 
  | 'dashboard'
  | 'clients'
  | 'documents'
  | 'workflows'
  | 'planning'
  | 'reporting'
  | 'communications'
  | 'collaboration'
  | 'ai-assistant'
  | 'signatures'
  | 'payments'
  | 'client-portal'
  | 'client-onboarding'
  | 'manager-approval';

interface Client {
  id: string;
  name: string;
  entityType: string;
  status: 'active' | 'inactive' | 'prospect';
  segment: string;
  lastContact: string;
  value: number;
  services: string[];
}

interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  type: 'letter' | 'email' | 'report' | 'proposal' | 'agreement';
  variables: string[];
  lastUsed: string;
}

interface Workflow {
  id: string;
  name: string;
  type: string;
  steps: number;
  status: 'active' | 'draft';
  triggers: string[];
}

export function ClientManagementHub() {
  const [currentView, setCurrentView] = useState<ClientManagementView>('dashboard');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientDetailModal, setShowClientDetailModal] = useState(false);

  const renderNavigation = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {[
        { id: 'clients', icon: Users, label: 'Client Management', color: 'blue' },
        { id: 'documents', icon: FileText, label: 'Document Generation', color: 'green' },
        { id: 'workflows', icon: Workflow, label: 'Workflows & Automation', color: 'purple' },
        { id: 'planning', icon: DollarSign, label: 'Practice Planning', color: 'orange' },
        { id: 'reporting', icon: BarChart3, label: 'Reporting & Visuals', color: 'indigo' },
        { id: 'communications', icon: Mail, label: 'Communications', color: 'pink' },
        { id: 'collaboration', icon: FolderOpen, label: 'Collaboration', color: 'teal' },
        { id: 'ai-assistant', icon: Brain, label: 'AI Assistant', color: 'violet' },
        { id: 'signatures', icon: FileSignature, label: 'E-Signatures', color: 'cyan' },
        { id: 'payments', icon: CreditCard, label: 'Payments', color: 'emerald' },
        { id: 'client-portal', icon: Network, label: 'Client Portal', color: 'blue' },
        { id: 'client-onboarding', icon: Plus, label: 'Client Onboarding', color: 'green' },
        { id: 'manager-approval', icon: CheckSquare, label: 'Manager Approval', color: 'purple' }
      ].map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as ClientManagementView)}
            className={`p-6 rounded-lg border-2 transition-all ${
              isActive
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <Icon className={`w-8 h-8 mx-auto mb-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
            <p className={`text-sm font-semibold text-center ${isActive ? 'text-blue-900' : 'text-gray-700'}`}>
              {item.label}
            </p>
          </button>
        );
      })}
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Clients', value: '1,247', change: '+12%', icon: Users, color: 'blue' },
          { label: 'Active Workflows', value: '34', change: '+5', icon: Workflow, color: 'purple' },
          { label: 'Documents Generated', value: '892', change: '+18%', icon: FileText, color: 'green' },
          { label: 'Revenue Pipeline', value: '$2.4M', change: '+23%', icon: DollarSign, color: 'orange' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-blue-600" />
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-purple-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { action: 'New client onboarded', client: 'Acme Pty Ltd', time: '5 mins ago', type: 'success' },
              { action: 'Engagement letter signed', client: 'Smith & Co', time: '1 hour ago', type: 'success' },
              { action: 'Workflow completed', client: 'Jones Trust', time: '2 hours ago', type: 'info' },
              { action: 'Document generated', client: 'Brown Holdings', time: '3 hours ago', type: 'info' },
              { action: 'Payment received', client: 'Green Enterprises', time: '4 hours ago', type: 'success' }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-600' : 'bg-blue-600'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.client} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Upcoming Tasks
          </h3>
          <div className="space-y-3">
            {[
              { task: 'Review client onboarding documents', due: 'Today, 2:00 PM', priority: 'high' },
              { task: 'Send quarterly reports to clients', due: 'Tomorrow, 10:00 AM', priority: 'medium' },
              { task: 'Follow up with prospect leads', due: 'Tomorrow, 3:00 PM', priority: 'medium' },
              { task: 'Prepare tax planning meeting pack', due: 'Friday, 9:00 AM', priority: 'low' },
              { task: 'Update client service agreements', due: 'Next Monday', priority: 'low' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                <input type="checkbox" className="mt-1 w-4 h-4" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{item.task}</p>
                  <p className="text-xs text-gray-600">{item.due}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  item.priority === 'high' ? 'bg-red-100 text-red-700' :
                  item.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderClientManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
          <p className="text-gray-600">Import, sync, and manage your client database</p>
        </div>
        <div className="flex gap-3">
          <SecondaryButton onClick={() => toast.info('Import clients from Xero')}>
            <Upload className="w-4 h-4 mr-2" />
            Import from Xero
          </SecondaryButton>
          <SecondaryButton onClick={() => toast.info('Sync with practice system')}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync All
          </SecondaryButton>
          <PrimaryButton onClick={() => setShowAddClientModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </PrimaryButton>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search clients by name, ABN, or contact..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>All Segments</option>
            <option>High Value</option>
            <option>Medium Value</option>
            <option>Low Value</option>
            <option>Prospects</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>All Entity Types</option>
            <option>Companies</option>
            <option>Trusts</option>
            <option>SMSFs</option>
            <option>Individuals</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Client Segmentation Overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { segment: 'High Value', count: 234, color: 'green', revenue: '$1.8M' },
          { segment: 'Medium Value', count: 456, color: 'blue', revenue: '$850K' },
          { segment: 'Low Value', count: 389, color: 'gray', revenue: '$120K' },
          { segment: 'Prospects', count: 168, color: 'purple', revenue: '$2.1M potential' }
        ].map((seg, idx) => (
          <div key={idx} className="bg-white border-2 border-green-200 rounded-lg p-4">
            <p className="text-xs font-bold text-green-600 uppercase mb-2">{seg.segment}</p>
            <p className="text-2xl font-bold text-gray-900">{seg.count}</p>
            <p className="text-xs text-gray-600 mt-1">{seg.revenue}</p>
          </div>
        ))}
      </div>

      {/* Client List */}
      <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input type="checkbox" className="w-4 h-4" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Client Name</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Entity Type</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Segment</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Services</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Last Contact</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Value</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { name: 'Acme Pty Ltd', type: 'Company', segment: 'High Value', services: ['Tax', 'Audit', 'Advisory'], lastContact: '2 days ago', value: '$45,000' },
              { name: 'Smith Family Trust', type: 'Trust', segment: 'Medium Value', services: ['Tax', 'Compliance'], lastContact: '1 week ago', value: '$18,500' },
              { name: 'Jones Superannuation Fund', type: 'SMSF', segment: 'High Value', services: ['SMSF Admin', 'Tax'], lastContact: '3 days ago', value: '$32,000' },
              { name: 'Brown Holdings Pty Ltd', type: 'Company', segment: 'High Value', services: ['Tax', 'CFO Services'], lastContact: '5 days ago', value: '$78,000' },
              { name: 'Green Enterprises', type: 'Partnership', segment: 'Medium Value', services: ['Tax', 'Bookkeeping'], lastContact: '1 day ago', value: '$22,000' }
            ].map((client, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input type="checkbox" className="w-4 h-4" />
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-900">{client.name}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-700">{client.type}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge 
                    status={client.segment === 'High Value' ? 'approved' : 'medium-risk'} 
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {client.services.map((service, sidx) => (
                      <span key={sidx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{client.lastContact}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-gray-900">{client.value}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button 
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={() => {
                        setSelectedClient(client);
                        setShowClientDetailModal(true);
                      }}
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Mail className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk Actions */}
      {selectedClients.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4">
          <span className="font-semibold">{selectedClients.length} clients selected</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100">
              Send Email
            </button>
            <button className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100">
              Export
            </button>
            <button className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100">
              Tag
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderDocumentGeneration = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Generation</h2>
          <p className="text-gray-600">Templates, merge documents, and branded reports</p>
        </div>
        <PrimaryButton onClick={() => toast.info('Create new template')}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </PrimaryButton>
      </div>

      {/* Template Categories */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Engagement Letters', count: 12, icon: FileText, color: 'blue' },
          { label: 'Client Reports', count: 24, icon: BarChart3, color: 'green' },
          { label: 'Email Templates', count: 45, icon: Mail, color: 'purple' },
          { label: 'Proposals', count: 8, icon: FileSignature, color: 'orange' },
          { label: 'Agreements', count: 15, icon: CheckSquare, color: 'red' }
        ].map((category, idx) => {
          const Icon = category.icon;
          return (
            <button
              key={idx}
              onClick={() => toast.info(`Viewing ${category.label}`)}
              className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 text-left transition-colors"
            >
              <Icon className="w-8 h-8 text-blue-600 mb-3" />
              <p className="font-semibold text-gray-900">{category.label}</p>
              <p className="text-sm text-gray-600">{category.count} templates</p>
            </button>
          );
        })}
      </div>

      {/* Template Library */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4">Template Library</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Annual Tax Engagement Letter', type: 'Letter', variables: ['client_name', 'service_list', 'fee'], lastUsed: '2 days ago' },
            { name: 'SMSF Annual Report', type: 'Report', variables: ['fund_name', 'balance', 'members'], lastUsed: '1 week ago' },
            { name: 'Quarterly Business Review', type: 'Report', variables: ['client_name', 'metrics', 'recommendations'], lastUsed: '3 days ago' },
            { name: 'Onboarding Welcome Email', type: 'Email', variables: ['client_name', 'manager_name', 'next_steps'], lastUsed: '1 day ago' },
            { name: 'Tax Planning Proposal', type: 'Proposal', variables: ['client_name', 'strategies', 'pricing'], lastUsed: '5 days ago' },
            { name: 'Advisory Services Agreement', type: 'Agreement', variables: ['client_name', 'scope', 'terms'], lastUsed: '1 week ago' }
          ].map((template, idx) => (
            <div key={idx} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300">
              <div className="flex items-start justify-between mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded">
                  {template.type}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
              <p className="text-xs text-gray-600 mb-3">
                Variables: {template.variables.join(', ')}
              </p>
              <p className="text-xs text-gray-500 mb-3">Last used: {template.lastUsed}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowTemplateEditor(true);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Use Template
                </button>
                <button 
                  onClick={() => toast.info(`Editing template: ${template.name}`)}
                  className="px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => toast.info(`Copying template: ${template.name}`)}
                  className="px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Generate */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6">
        <h3 className="font-bold text-xl mb-2">Quick Document Generation</h3>
        <p className="mb-4 opacity-90">Select a client and template to generate a document instantly</p>
        <div className="flex gap-4">
          <select className="flex-1 px-4 py-3 bg-white text-gray-900 rounded-lg">
            <option>Select Client...</option>
            <option>Acme Pty Ltd</option>
            <option>Smith Family Trust</option>
            <option>Jones Superannuation Fund</option>
          </select>
          <select className="flex-1 px-4 py-3 bg-white text-gray-900 rounded-lg">
            <option>Select Template...</option>
            <option>Annual Tax Engagement Letter</option>
            <option>SMSF Annual Report</option>
            <option>Quarterly Business Review</option>
          </select>
          <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100">
            Generate <ArrowRight className="w-4 h-4 inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderWorkflows = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Workflows & Automation</h2>
          <p className="text-gray-600">Task lists, checklists, and automated processes</p>
        </div>
        <PrimaryButton onClick={() => toast.info('Create new workflow')}>
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </PrimaryButton>
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Workflows', value: '34', icon: Workflow, color: 'purple' },
          { label: 'Tasks Automated', value: '892', icon: CheckSquare, color: 'green' },
          { label: 'Time Saved', value: '156h', icon: Calendar, color: 'blue' },
          { label: 'Completion Rate', value: '94%', icon: BarChart3, color: 'orange' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <Icon className={`w-6 h-6 text-${stat.color}-600 mb-3`} />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Workflow Library */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            name: 'Client Onboarding Process',
            description: 'Complete client setup from engagement to first service delivery',
            steps: ['Engagement letter', 'KYC verification', 'System setup', 'Welcome call', 'First service'],
            triggers: ['New client created'],
            status: 'active' as const
          },
          {
            name: 'Annual Tax Return Workflow',
            description: 'Standardized process for individual tax returns',
            steps: ['Document request', 'Data entry', 'Review', 'Client approval', 'Lodgment'],
            triggers: ['Tax season start', 'Client request'],
            status: 'active' as const
          },
          {
            name: 'SMSF Annual Compliance',
            description: 'End-to-end SMSF compliance and audit process',
            steps: ['Financial statements', 'Tax return', 'Audit', 'Member statements', 'ATO lodgment'],
            triggers: ['Financial year end'],
            status: 'active' as const
          },
          {
            name: 'Client Review Meeting',
            description: 'Structured quarterly client review process',
            steps: ['Prepare reports', 'Meeting agenda', 'Conduct meeting', 'Action items', 'Follow-up'],
            triggers: ['Quarterly schedule'],
            status: 'active' as const
          },
          {
            name: 'Payment Collection',
            description: 'Automated invoice and payment follow-up',
            steps: ['Invoice sent', 'Payment reminder', 'Overdue notice', 'Collection call', 'Account hold'],
            triggers: ['Invoice created', 'Payment overdue'],
            status: 'active' as const
          },
          {
            name: 'Document Expiry Alert',
            description: 'Monitor and alert for expiring documents',
            steps: ['30-day alert', '14-day alert', '7-day alert', 'Expired notice', 'Renewal process'],
            triggers: ['Document expiry approaching'],
            status: 'draft' as const
          }
        ].map((workflow, idx) => (
          <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-gray-900">{workflow.name}</h3>
                  <StatusBadge status={workflow.status === 'active' ? 'approved' : 'draft'} />
                </div>
                <p className="text-sm text-gray-600">{workflow.description}</p>
              </div>
              <Workflow className="w-6 h-6 text-purple-600" />
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase mb-2">Steps ({workflow.steps.length})</p>
                <div className="flex flex-wrap gap-2">
                  {workflow.steps.map((step, sidx) => (
                    <span key={sidx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      {sidx + 1}. {step}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-700 uppercase mb-2">Triggers</p>
                <div className="flex flex-wrap gap-2">
                  {workflow.triggers.map((trigger, tidx) => (
                    <span key={tidx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
                View Workflow
              </button>
              <button className="px-4 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50">
                <Edit className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClientPortal = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Client Portal</h2>
          <p className="text-gray-600">Secure access for clients to view documents and communicate</p>
        </div>
        <PrimaryButton onClick={() => toast.info('Configure client portal')}>
          <Plus className="w-4 h-4 mr-2" />
          Configure Portal
        </PrimaryButton>
      </div>

      {/* Portal Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Clients', value: '120', icon: Users, color: 'blue' },
          { label: 'Documents Viewed', value: '456', icon: FileText, color: 'green' },
          { label: 'Messages Sent', value: '234', icon: MessageSquare, color: 'purple' },
          { label: 'Portal Usage', value: '94%', icon: BarChart3, color: 'orange' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <Icon className={`w-6 h-6 text-${stat.color}-600 mb-3`} />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Portal Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            name: 'Document Access',
            description: 'Allow clients to view and download documents securely',
            status: 'active' as const
          },
          {
            name: 'Communication Hub',
            description: 'Enable clients to send and receive messages',
            status: 'active' as const
          },
          {
            name: 'Task Management',
            description: 'Assign and track tasks for clients',
            status: 'active' as const
          },
          {
            name: 'Notifications',
            description: 'Send alerts and reminders to clients',
            status: 'active' as const
          },
          {
            name: 'Feedback Collection',
            description: 'Gather client feedback and ratings',
            status: 'active' as const
          },
          {
            name: 'Custom Branding',
            description: 'Apply your branding to the portal',
            status: 'active' as const
          }
        ].map((feature, idx) => (
          <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-gray-900">{feature.name}</h3>
                  <StatusBadge status={feature.status === 'active' ? 'approved' : 'draft'} />
                </div>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
              <Network className="w-6 h-6 text-blue-600" />
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setSelectedFeature(feature);
                  setShowFeatureModal(true);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                View Feature
              </button>
              <button 
                onClick={() => toast.info(`Editing ${feature.name}`)}
                className="px-4 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => toast.info(`Copying ${feature.name}`)}
                className="px-4 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'clients':
        return renderClientManagement();
      case 'documents':
        return renderDocumentGeneration();
      case 'workflows':
        return renderWorkflows();
      case 'planning':
        return <PracticePlanning />;
      case 'reporting':
        return <ReportingVisuals />;
      case 'communications':
        return <PlaceholderView title="Client Communications" description="Bulk email, segmented campaigns, and templates" icon={Mail} />;
      case 'collaboration':
        return <DocumentCollaboration />;
      case 'ai-assistant':
        return <SecureAICopilot />;
      case 'signatures':
        return <FuseSign />;
      case 'payments':
        return <PlaceholderView title="Payments" description="GoCardless integration for payment collection" icon={CreditCard} />;
      case 'client-portal':
        return renderClientPortal();
      case 'client-onboarding':
        return <ClientOnboarding onComplete={() => setCurrentView('dashboard')} />;
      case 'manager-approval':
        return <ManagerApproval />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Management Hub</h1>
          <p className="text-gray-600">Comprehensive client lifecycle management with automation and AI</p>
        </div>

        {/* Navigation */}
        {renderNavigation()}

        {/* Content */}
        <div className="mt-8">
          {renderContent()}
        </div>
      </div>

      {/* Template Editor Modal */}
      {showTemplateEditor && selectedTemplate && (
        <TemplateEditorModal
          template={selectedTemplate}
          onClose={() => {
            setShowTemplateEditor(false);
            setSelectedTemplate(null);
          }}
          onGenerate={(data: any) => {
            toast.success(`Document generated: ${selectedTemplate.name}`);
            setShowTemplateEditor(false);
            setSelectedTemplate(null);
          }}
        />
      )}

      {/* Add Client Modal */}
      {showAddClientModal && (
        <AddClientModal
          onClose={() => setShowAddClientModal(false)}
          onAdd={(client: Client) => {
            toast.success(`Client added: ${client.name}`);
            setShowAddClientModal(false);
          }}
        />
      )}

      {/* Feature Modal */}
      {showFeatureModal && selectedFeature && (
        <FeatureModal
          feature={selectedFeature}
          onClose={() => {
            setShowFeatureModal(false);
            setSelectedFeature(null);
          }}
        />
      )}

      {/* Client Detail Modal */}
      {showClientDetailModal && selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          onClose={() => {
            setShowClientDetailModal(false);
            setSelectedClient(null);
          }}
        />
      )}
    </div>
  );
}

function PlaceholderView({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
      <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <PrimaryButton onClick={() => toast.info(`${title} module coming soon`)}>
        Explore {title}
      </PrimaryButton>
    </div>
  );
}

function TemplateEditorModal({ template, onClose, onGenerate }: { template: any; onClose: () => void; onGenerate: (data: any) => void }) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{template.name}</h2>
            <p className="text-sm text-gray-600 mt-1">Fill in the template variables to generate your document</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Form */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 mb-4">Template Variables</h3>
              {template.variables.map((variable: string) => (
                <div key={variable}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {variable.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </label>
                  <input
                    type="text"
                    value={formData[variable] || ''}
                    onChange={(e) => setFormData({ ...formData, [variable]: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter ${variable.split('_').join(' ')}`}
                  />
                </div>
              ))}
            </div>

            {/* Right: Preview */}
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Document Preview</h3>
              <div className="bg-white p-6 rounded-lg border border-gray-200 min-h-[400px]">
                <div className="space-y-4 text-sm text-gray-700">
                  <p className="font-semibold">Dear {formData.client_name || '[Client Name]'},</p>
                  
                  <p>
                    We are pleased to present this {template.type.toLowerCase()} regarding{' '}
                    {formData.service_list || formData.scope || '[services]'}.
                  </p>

                  {template.type === 'Letter' && (
                    <p>
                      The fee for these services will be {formData.fee || '[fee]'}, payable as outlined in our terms.
                    </p>
                  )}

                  {template.type === 'Report' && (
                    <div>
                      <p className="font-semibold mt-4">Executive Summary:</p>
                      <p>{formData.metrics || formData.recommendations || '[Report content will appear here]'}</p>
                    </div>
                  )}

                  {template.type === 'Proposal' && (
                    <div>
                      <p className="font-semibold mt-4">Proposed Strategy:</p>
                      <p>{formData.strategies || '[Strategies will appear here]'}</p>
                      <p className="font-semibold mt-4">Investment:</p>
                      <p>{formData.pricing || '[Pricing will appear here]'}</p>
                    </div>
                  )}

                  <p className="mt-6">
                    Please feel free to contact us if you have any questions.
                  </p>

                  <p className="mt-4">
                    Sincerely,<br />
                    {formData.manager_name || '[Your Name]'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            <span>Template: {template.type}</span>
          </div>
          <div className="flex gap-3">
            <SecondaryButton onClick={onClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={() => onGenerate(formData)}>
              <Send className="w-4 h-4 mr-2" />
              Generate Document
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddClientModal({ onClose, onAdd }: { onClose: () => void; onAdd: (client: Client) => void }) {
  const [formData, setFormData] = useState<Partial<Client>>({});

  const handleAddClient = () => {
    if (formData.name && formData.entityType && formData.status && formData.segment && formData.lastContact && formData.value && formData.services) {
      const newClient: Client = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        entityType: formData.entityType,
        status: formData.status,
        segment: formData.segment,
        lastContact: formData.lastContact,
        value: formData.value,
        services: formData.services
      };
      onAdd(newClient);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Client</h2>
            <p className="text-sm text-gray-600 mt-1">Enter client details to add to your database</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Form */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 mb-4">Client Details</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Entity Type
                </label>
                <select
                  value={formData.entityType || ''}
                  onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select entity type</option>
                  <option value="Company">Company</option>
                  <option value="Trust">Trust</option>
                  <option value="SMSF">SMSF</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || ''}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="prospect">Prospect</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Segment
                </label>
                <select
                  value={formData.segment || ''}
                  onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select segment</option>
                  <option value="High Value">High Value</option>
                  <option value="Medium Value">Medium Value</option>
                  <option value="Low Value">Low Value</option>
                  <option value="Prospects">Prospects</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Contact
                </label>
                <input
                  type="text"
                  value={formData.lastContact || ''}
                  onChange={(e) => setFormData({ ...formData, lastContact: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter last contact date"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Value
                </label>
                <input
                  type="number"
                  value={formData.value || ''}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter client value"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Services
                </label>
                <input
                  type="text"
                  value={formData.services ? formData.services.join(', ') : ''}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter services (comma-separated)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Add Client</span>
          </div>
          <div className="flex gap-3">
            <SecondaryButton onClick={onClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleAddClient}>
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureModal({ feature, onClose }: { feature: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{feature.name}</h2>
            <p className="text-sm text-gray-600 mt-1">View and manage the {feature.name} feature</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Form */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 mb-4">Feature Details</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Network className="w-4 h-4" />
            <span>Feature: {feature.name}</span>
          </div>
          <div className="flex gap-3">
            <SecondaryButton onClick={onClose}>
              Close
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientDetailModal({ client, onClose }: { client: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Client Details</h2>
            <p className="text-sm text-gray-600 mt-1">View and manage client information</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Form */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 mb-4">Client Information</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Client Name
                </label>
                <p className="text-sm text-gray-600">{client.name}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Entity Type
                </label>
                <p className="text-sm text-gray-600">{client.entityType}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <StatusBadge status={client.status === 'active' ? 'approved' : 'medium-risk'} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Segment
                </label>
                <StatusBadge status={client.segment === 'High Value' ? 'approved' : 'medium-risk'} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Contact
                </label>
                <p className="text-sm text-gray-600">{client.lastContact}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Value
                </label>
                <p className="text-sm text-gray-600">{client.value}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Services
                </label>
                <div className="flex flex-wrap gap-1">
                  {client.services.map((service: string) => (
                    <span key={service} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Client: {client.name}</span>
          </div>
          <div className="flex gap-3">
            <SecondaryButton onClick={onClose}>
              Close
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
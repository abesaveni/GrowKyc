import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  FileText,
  CheckSquare,
  Calendar,
  DollarSign,
  Package,
  Shield,
  BarChart3,
  Settings,
  Zap,
  Brain,
  Globe,
  Building2,
  Target,
  TrendingUp,
  Clock,
  AlertCircle,
  UserCheck,
  Database,
  Layers,
  GitBranch,
  Activity,
  Workflow as WorkflowIcon,
  ShoppingCart,
  Truck,
  HardHat,
  GraduationCap,
  Laptop,
  FileCheck,
  LogIn,
  Bot
} from 'lucide-react';
import { PrimaryButton, SecondaryButton, StatusBadge } from '../onboarding/DesignSystem';
import { toast } from 'sonner';

type OSModule = 
  | 'dashboard'
  | 'crm'
  | 'work'
  | 'documents'
  | 'finance'
  | 'inventory'
  | 'hr'
  | 'it'
  | 'compliance'
  | 'portals'
  | 'automation'
  | 'ai'
  | 'analytics'
  | 'integrations'
  | 'admin';

interface DataObject {
  type: string;
  count: number;
  icon: any;
  color: string;
}

export function UltimateOS() {
  const [activeModule, setActiveModule] = useState<OSModule>('dashboard');

  const coreDataModel: DataObject[] = [
    { type: 'People', count: 247, icon: Users, color: 'blue' },
    { type: 'Customers', count: 1834, icon: Building2, color: 'green' },
    { type: 'Projects', count: 156, icon: Target, color: 'purple' },
    { type: 'Documents', count: 12453, icon: FileText, color: 'orange' },
    { type: 'Tasks', count: 892, icon: CheckSquare, color: 'red' },
    { type: 'Invoices', count: 3421, icon: DollarSign, color: 'emerald' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Revenue', value: '$4.2M', change: '+23%', trend: 'up', color: 'green' },
          { label: 'Margin', value: '42%', change: '+5%', trend: 'up', color: 'blue' },
          { label: 'Active Projects', value: '156', change: '+12', trend: 'up', color: 'purple' },
          { label: 'Team Utilisation', value: '87%', change: '-3%', trend: 'down', color: 'orange' }
        ].map((metric, idx) => (
          <div key={idx} className="bg-white border-2 border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className={`w-8 h-8 text-${metric.color}-600`} />
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                metric.trend === 'up' ? 'bg-green-500/15 text-green-300' : 'bg-red-500/15 text-red-300'
              }`}>
                {metric.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-100 mb-1">{metric.value}</p>
            <p className="text-sm text-slate-300">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Core Data Model Overview */}
      <div className="bg-white border-2 border-white/10 rounded-lg p-6">
        <h3 className="font-bold text-slate-100 text-lg mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-400" />
          Universal Data Model
        </h3>
        <div className="grid grid-cols-6 gap-4">
          {coreDataModel.map((obj, idx) => {
            const Icon = obj.icon;
            return (
              <div key={idx} className={`p-4 bg-${obj.color}-50 border-2 border-${obj.color}-200 rounded-lg text-center`}>
                <Icon className={`w-8 h-8 text-${obj.color}-600 mx-auto mb-2`} />
                <p className={`text-2xl font-bold text-${obj.color}-600 mb-1`}>{obj.count.toLocaleString()}</p>
                <p className={`text-xs font-semibold text-${obj.color}-900`}>{obj.type}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Modules */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { module: 'CRM & Sales', status: 'Active', records: '1,834 customers', color: 'green' },
          { module: 'Work Management', status: 'Active', records: '892 tasks', color: 'blue' },
          { module: 'Finance & Billing', status: 'Active', records: '3,421 invoices', color: 'purple' },
          { module: 'Document Engine', status: 'Active', records: '12,453 documents', color: 'orange' },
          { module: 'Automation Studio', status: 'Active', records: '67 workflows', color: 'indigo' },
          { module: 'AI Layer', status: 'Active', records: 'Full access', color: 'violet' }
        ].map((mod, idx) => (
          <div key={idx} className="bg-white border-2 border-white/10 rounded-lg p-6 hover:border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-100">{mod.module}</h4>
              <StatusBadge status="activated" />
            </div>
            <p className="text-sm text-slate-300 mb-2">{mod.records}</p>
            <button className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-100 rounded-lg text-sm font-semibold">
              Open Module
            </button>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border-2 border-white/10 rounded-lg p-6">
          <h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { action: 'New customer onboarded', entity: 'Acme Corp', time: '5 mins ago', type: 'crm' },
              { action: 'Invoice generated', entity: 'INV-2024-0342', time: '12 mins ago', type: 'finance' },
              { action: 'Project milestone completed', entity: 'Q4 Implementation', time: '1 hour ago', type: 'work' },
              { action: 'Document approved', entity: 'Master Services Agreement', time: '2 hours ago', type: 'documents' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  item.type === 'crm' ? 'bg-green-600' : 
                  item.type === 'finance' ? 'bg-purple-600' :
                  item.type === 'work' ? 'bg-blue-600' : 'bg-orange-600'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-100">{item.action}</p>
                  <p className="text-xs text-slate-300">{item.entity} • {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-white/10 rounded-lg p-6">
          <h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-400" />
            Attention Required
          </h3>
          <div className="space-y-3">
            {[
              { item: '12 invoices overdue', priority: 'high', action: 'Review Now' },
              { item: '5 approvals pending', priority: 'medium', action: 'Review' },
              { item: '3 SLA deadlines today', priority: 'high', action: 'Check Status' },
              { item: '8 tasks due this week', priority: 'medium', action: 'View Tasks' }
            ].map((alert, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-100">{alert.item}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                    alert.priority === 'high' ? 'bg-red-500/15 text-red-300' : 'bg-amber-500/15 text-amber-300'
                  }`}>
                    {alert.priority}
                  </span>
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                    {alert.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCRM = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">CRM & Sales</h2>
          <p className="text-slate-300">Lead capture, pipeline management, and customer relationships</p>
        </div>
        <PrimaryButton onClick={() => toast.info('Create new lead')}>
          <Users className="w-4 h-4 mr-2" />
          New Lead
        </PrimaryButton>
      </div>

      {/* Pipeline Stages */}
      <div className="bg-white border-2 border-white/10 rounded-lg p-6">
        <h3 className="font-bold text-slate-100 mb-4">Sales Pipeline</h3>
        <div className="grid grid-cols-5 gap-4">
          {[
            { stage: 'Leads', count: 45, value: '$450K', probability: 10, color: 'gray' },
            { stage: 'Qualified', count: 32, value: '$640K', probability: 25, color: 'blue' },
            { stage: 'Proposal', count: 18, value: '$540K', probability: 50, color: 'purple' },
            { stage: 'Negotiation', count: 12, value: '$360K', probability: 75, color: 'orange' },
            { stage: 'Closed Won', count: 8, value: '$240K', probability: 100, color: 'green' }
          ].map((stage, idx) => (
            <div key={idx} className={`p-4 bg-${stage.color}-50 border-2 border-${stage.color}-200 rounded-lg`}>
              <p className={`text-xs font-bold text-${stage.color}-600 uppercase mb-2`}>{stage.stage}</p>
              <p className={`text-2xl font-bold text-${stage.color}-900 mb-1`}>{stage.count}</p>
              <p className="text-sm text-slate-100 font-semibold mb-1">{stage.value}</p>
              <p className="text-xs text-slate-300">{stage.probability}% probability</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { title: 'Lead Capture', desc: 'Forms, imports, API integration', icon: Target },
          { title: 'Pipeline Forecasting', desc: 'Probability-weighted revenue', icon: TrendingUp },
          { title: 'Quotes & Proposals', desc: 'Scope builder, pricing tools', icon: FileText },
          { title: 'Contract Lifecycle', desc: 'Renewals, reminders, alerts', icon: FileCheck },
          { title: 'Account Plans', desc: 'Relationship maps, org charts', icon: Building2 },
          { title: 'Customer Health', desc: 'Scores, churn risk, engagement', icon: Activity }
        ].map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="bg-white border-2 border-white/10 rounded-lg p-6 hover:border-blue-300">
              <Icon className="w-8 h-8 text-blue-400 mb-3" />
              <h4 className="font-bold text-slate-100 mb-2">{feature.title}</h4>
              <p className="text-sm text-slate-300">{feature.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderWorkManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Work Management</h2>
          <p className="text-slate-300">Tasks, projects, time tracking, and capacity planning</p>
        </div>
        <PrimaryButton onClick={() => toast.info('Create new task')}>
          <CheckSquare className="w-4 h-4 mr-2" />
          New Task
        </PrimaryButton>
      </div>

      {/* Work Views */}
      <div className="flex gap-2">
        {['Kanban', 'Gantt', 'Calendar', 'List'].map((view) => (
          <button
            key={view}
            className="px-4 py-2 bg-white border-2 border-white/10 rounded-lg hover:border-blue-300 font-semibold"
          >
            {view}
          </button>
        ))}
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Tasks', value: '892', icon: CheckSquare, color: 'blue' },
          { label: 'Team Utilisation', value: '87%', icon: Users, color: 'green' },
          { label: 'On Track', value: '234', icon: Target, color: 'purple' },
          { label: 'At Risk', value: '12', icon: AlertCircle, color: 'red' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border-2 border-white/10 rounded-lg p-4">
              <Icon className={`w-6 h-6 text-${stat.color}-600 mb-2`} />
              <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
              <p className="text-sm text-slate-300">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { title: 'Task Management', desc: 'Owners, due dates, SLA tracking', icon: CheckSquare },
          { title: 'Recurring Jobs', desc: 'Seasonal schedules, templates', icon: Calendar },
          { title: 'Dependencies', desc: 'Gantt, critical path, blockers', icon: GitBranch },
          { title: 'Time Tracking', desc: 'Budgets, actuals, utilisation', icon: Clock },
          { title: 'Capacity Planning', desc: 'Workload, heatmaps, forecasting', icon: BarChart3 },
          { title: 'Automation', desc: 'Follow-ups, escalations, alerts', icon: Zap }
        ].map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="bg-white border-2 border-white/10 rounded-lg p-6">
              <Icon className="w-8 h-8 text-purple-400 mb-3" />
              <h4 className="font-bold text-slate-100 mb-2">{feature.title}</h4>
              <p className="text-sm text-slate-300">{feature.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAutomation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Automation & Workflow Studio</h2>
          <p className="text-slate-300">No-code builder for processes and automations</p>
        </div>
        <PrimaryButton onClick={() => toast.info('Create new workflow')}>
          <WorkflowIcon className="w-4 h-4 mr-2" />
          New Workflow
        </PrimaryButton>
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Workflows', value: '67', color: 'blue' },
          { label: 'Executions Today', value: '1,234', color: 'green' },
          { label: 'Time Saved', value: '456h', color: 'purple' },
          { label: 'Success Rate', value: '99.2%', color: 'emerald' }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-${stat.color}-50 border-2 border-${stat.color}-200 rounded-lg p-4`}>
            <p className={`text-3xl font-bold text-${stat.color}-600 mb-1`}>{stat.value}</p>
            <p className={`text-sm font-semibold text-${stat.color}-900`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Workflow Builder */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6">
        <h3 className="font-bold text-xl mb-2">Visual Workflow Builder</h3>
        <p className="mb-4 opacity-90">Drag-and-drop automation with triggers, conditions, and actions</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-indigo-400 rounded-lg hover:bg-white/5">
            Open Builder
          </button>
          <button className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800">
            View Templates
          </button>
        </div>
      </div>

      {/* Automation Features */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { title: 'Triggers', desc: 'Time, events, webhooks, emails', items: ['Schedule', 'Record created', 'Field updated', 'API call'] },
          { title: 'Conditions', desc: 'Logic, rules, and branching', items: ['If/Then', 'Switch', 'Loop', 'Wait'] },
          { title: 'Actions', desc: 'Tasks, emails, updates, integrations', items: ['Create record', 'Send email', 'Update field', 'Call API'] }
        ].map((section, idx) => (
          <div key={idx} className="bg-white border-2 border-white/10 rounded-lg p-6">
            <Zap className="w-8 h-8 text-indigo-400 mb-3" />
            <h4 className="font-bold text-slate-100 mb-2">{section.title}</h4>
            <p className="text-sm text-slate-300 mb-3">{section.desc}</p>
            <div className="space-y-1">
              {section.items.map((item, iidx) => (
                <div key={iidx} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-indigo-600" />
                  <span className="text-xs text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">AI Layer</h2>
          <p className="text-slate-300">Practical, controlled AI with guardrails and source citations</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-500/15 text-green-300 text-sm font-bold rounded-full">
            AI ACTIVE
          </span>
        </div>
      </div>

      {/* AI Capabilities */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { capability: 'Universal Search', desc: 'Search across all data and documents', icon: Brain, color: 'purple' },
          { capability: 'Explain & Suggest', desc: 'Context-aware recommendations', icon: Bot, color: 'blue' },
          { capability: 'Auto-Draft', desc: 'Emails, reports, SOPs from templates', icon: FileText, color: 'green' },
          { capability: 'Meeting Summary', desc: 'Extract tasks and decisions', icon: CheckSquare, color: 'orange' },
          { capability: 'Risk Flags', desc: 'Anomalies, missing docs, delays', icon: AlertCircle, color: 'red' },
          { capability: 'Smart Routing', desc: 'Assign, prioritize, escalate', icon: GitBranch, color: 'indigo' }
        ].map((ai, idx) => {
          const Icon = ai.icon;
          return (
            <div key={idx} className={`bg-${ai.color}-50 border-2 border-${ai.color}-200 rounded-lg p-6`}>
              <Icon className={`w-8 h-8 text-${ai.color}-600 mb-3`} />
              <h4 className={`font-bold text-${ai.color}-900 mb-2`}>{ai.capability}</h4>
              <p className="text-sm text-slate-300">{ai.desc}</p>
            </div>
          );
        })}
      </div>

      {/* AI Guardrails */}
      <div className="bg-white border-2 border-white/10 rounded-lg p-6">
        <h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          AI Guardrails & Controls
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { control: 'Source Citations', status: 'Enabled', desc: 'Every AI answer includes sources' },
            { control: 'Permission-Aware', status: 'Enabled', desc: 'Respects user access controls' },
            { control: 'PII Redaction', status: 'Enabled', desc: 'Automatically redacts sensitive data' },
            { control: 'Human Review', status: 'Required', desc: 'AI suggests, humans decide' }
          ].map((guard, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <Shield className="w-5 h-5 text-green-400 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-slate-100">{guard.control}</p>
                  <span className="px-2 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded">
                    {guard.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{guard.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return renderDashboard();
      case 'crm':
        return renderCRM();
      case 'work':
        return renderWorkManagement();
      case 'automation':
        return renderAutomation();
      case 'ai':
        return renderAI();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-white/5">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Ultimate Operating System</h1>
            <p className="text-sm opacity-90">One data model, many workflows</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white text-indigo-400 rounded-lg hover:bg-white/5 font-semibold">
              <Brain className="w-4 h-4 inline mr-2" />
              Ask AI
            </button>
            <button className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 font-semibold">
              <Settings className="w-4 h-4 inline mr-2" />
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Module Navigation */}
      <div className="bg-white border-b-2 border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto py-4">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'crm', label: 'CRM & Sales', icon: Users },
              { id: 'work', label: 'Work Management', icon: CheckSquare },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'finance', label: 'Finance', icon: DollarSign },
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'hr', label: 'HR', icon: GraduationCap },
              { id: 'it', label: 'IT', icon: Laptop },
              { id: 'compliance', label: 'Compliance', icon: Shield },
              { id: 'portals', label: 'Portals', icon: LogIn },
              { id: 'automation', label: 'Automation', icon: Zap },
              { id: 'ai', label: 'AI Layer', icon: Brain },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'integrations', label: 'Integrations', icon: Globe },
              { id: 'admin', label: 'Admin', icon: Settings }
            ].map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id as OSModule)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {module.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
      </div>
    </div>
  );
}

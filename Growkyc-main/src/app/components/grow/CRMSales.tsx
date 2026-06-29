import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Upload,
  Download,
  Filter,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  BarChart3,
  PieChart
} from 'lucide-react';
import { PrimaryButton, SecondaryButton, StatusBadge } from '../onboarding/DesignSystem';
import { toast } from 'sonner';

interface Lead {
  id: string;
  name: string;
  organisation: string;
  value: number;
  probability: number;
  stage: string;
  source: string;
  owner: string;
  createdDate: Date;
  expectedCloseDate?: Date;
  lastContactDate?: Date;
  healthScore: number;
  status: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
}

export function CRMSales() {
  const [selectedView, setSelectedView] = useState<'pipeline' | 'leads' | 'accounts' | 'activities'>('pipeline');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const pipelineStages = [
    { id: 'lead', name: 'Lead', count: 45, value: 234500, color: 'gray', probability: 10 },
    { id: 'qualified', name: 'Qualified', count: 28, value: 456000, color: 'blue', probability: 25 },
    { id: 'proposal', name: 'Proposal', count: 18, value: 623000, color: 'purple', probability: 50 },
    { id: 'negotiation', name: 'Negotiation', count: 12, value: 478000, color: 'orange', probability: 75 },
    { id: 'won', name: 'Won', count: 34, value: 1245000, color: 'green', probability: 100 },
    { id: 'lost', name: 'Lost', count: 23, value: 567000, color: 'red', probability: 0 }
  ];

  const leads: Lead[] = [
    {
      id: '1',
      name: 'John Smith',
      organisation: 'Tech Innovations Pty Ltd',
      value: 45000,
      probability: 75,
      stage: 'negotiation',
      source: 'referral',
      owner: 'Sarah Johnson',
      createdDate: new Date('2024-01-15'),
      expectedCloseDate: new Date('2024-03-01'),
      lastContactDate: new Date('2024-02-18'),
      healthScore: 85,
      status: 'negotiation'
    },
    {
      id: '2',
      name: 'Emma Wilson',
      organisation: 'Green Energy Solutions',
      value: 32000,
      probability: 50,
      stage: 'proposal',
      source: 'website',
      owner: 'Michael Chen',
      createdDate: new Date('2024-02-01'),
      expectedCloseDate: new Date('2024-03-15'),
      lastContactDate: new Date('2024-02-16'),
      healthScore: 70,
      status: 'proposal'
    },
    {
      id: '3',
      name: 'David Brown',
      organisation: 'Construction Masters Ltd',
      value: 67000,
      probability: 25,
      stage: 'qualified',
      source: 'cold-call',
      owner: 'Sarah Johnson',
      createdDate: new Date('2024-02-10'),
      expectedCloseDate: new Date('2024-04-01'),
      lastContactDate: new Date('2024-02-17'),
      healthScore: 60,
      status: 'qualified'
    }
  ];

  const renderPipeline = () => (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pipeline', value: '$3.6M', change: '+18%', icon: DollarSign, color: 'blue' },
          { label: 'Active Leads', value: '103', change: '+12', icon: Users, color: 'purple' },
          { label: 'Avg Deal Size', value: '$35K', change: '+5%', icon: Target, color: 'green' },
          { label: 'Win Rate', value: '34%', change: '+3%', icon: Award, color: 'orange' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Pipeline Stages */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Sales Pipeline</h3>
          <div className="flex gap-2">
            <SecondaryButton onClick={() => toast.info('Forecast report')}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Forecast
            </SecondaryButton>
            <PrimaryButton onClick={() => toast.info('Add opportunity')}>
              <Plus className="w-4 h-4 mr-2" />
              New Opportunity
            </PrimaryButton>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4">
          {pipelineStages.map((stage) => (
            <div
              key={stage.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedStage === stage.id
                  ? `border-${stage.color}-500 bg-${stage.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedStage(stage.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 bg-${stage.color}-100 text-${stage.color}-700 text-xs font-bold rounded`}>
                  {stage.probability}%
                </span>
                <span className="text-2xl font-bold text-gray-900">{stage.count}</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{stage.name}</h4>
              <p className="text-sm font-semibold text-gray-700">
                ${(stage.value / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Weighted: ${Math.round((stage.value * stage.probability) / 100000)}K
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Monthly Forecast</h3>
          <div className="space-y-3">
            {[
              { month: 'March 2024', expected: 245000, optimistic: 312000, probability: 75 },
              { month: 'April 2024', expected: 178000, optimistic: 234000, probability: 60 },
              { month: 'May 2024', expected: 156000, optimistic: 198000, probability: 45 }
            ].map((forecast, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{forecast.month}</span>
                  <span className="text-sm text-gray-600">{forecast.probability}% confidence</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Expected</p>
                    <p className="text-lg font-bold text-gray-900">${(forecast.expected / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Optimistic</p>
                    <p className="text-lg font-bold text-green-600">${(forecast.optimistic / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-4">Win/Loss Analysis</h3>
          <div className="space-y-4">
            {[
              { reason: 'Price too high', count: 8, percentage: 35 },
              { reason: 'Lost to competitor', count: 6, percentage: 26 },
              { reason: 'No budget', count: 5, percentage: 22 },
              { reason: 'Timeline mismatch', count: 4, percentage: 17 }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900">{item.reason}</span>
                  <span className="text-sm text-gray-600">{item.count} deals ({item.percentage}%)</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeads = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
          <p className="text-gray-600">Capture, qualify, and convert leads</p>
        </div>
        <div className="flex gap-3">
          <SecondaryButton onClick={() => toast.info('Import leads')}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </SecondaryButton>
          <SecondaryButton onClick={() => toast.info('Export leads')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </SecondaryButton>
          <PrimaryButton onClick={() => toast.info('Capture new lead')}>
            <Plus className="w-4 h-4 mr-2" />
            New Lead
          </PrimaryButton>
        </div>
      </div>

      {/* Lead Sources */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { source: 'Website', count: 45, conversion: 28 },
          { source: 'Referral', count: 32, conversion: 45 },
          { source: 'Cold Call', count: 23, conversion: 15 },
          { source: 'Event', count: 18, conversion: 35 },
          { source: 'Partner', count: 12, conversion: 52 }
        ].map((source, idx) => (
          <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-4">
            <p className="text-sm font-bold text-gray-700 uppercase mb-2">{source.source}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{source.count}</p>
            <p className="text-xs text-gray-600">
              {source.conversion}% conversion
            </p>
          </div>
        ))}
      </div>

      {/* Leads Table */}
      <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Lead</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Organisation</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Value</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Stage</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Health</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Owner</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Close Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-900">{lead.name}</p>
                  <p className="text-xs text-gray-600">{lead.source}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-900">{lead.organisation}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-900">${(lead.value / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-gray-600">{lead.probability}% prob</p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={
                      lead.stage === 'negotiation' ? 'approved' :
                      lead.stage === 'proposal' ? 'medium-risk' :
                      'draft'
                    }
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          lead.healthScore >= 80 ? 'bg-green-500' :
                          lead.healthScore >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${lead.healthScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{lead.healthScore}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-900">{lead.owner}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-900">
                    {lead.expectedCloseDate?.toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-600">
                    {lead.lastContactDate && `Last: ${lead.lastContactDate.toLocaleDateString()}`}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded" onClick={() => toast.info('View lead')}>
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" onClick={() => toast.info('Edit lead')}>
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" onClick={() => toast.info('Email lead')}>
                      <Mail className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAccounts = () => (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Management</h2>
      <p className="text-gray-600 mb-6">Account plans, relationship maps, and health scores</p>
      <PrimaryButton onClick={() => toast.info('Account management coming soon')}>
        View Accounts
      </PrimaryButton>
    </div>
  );

  const renderActivities = () => (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-12 text-center">
      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Sales Activities</h2>
      <p className="text-gray-600 mb-6">Email sync, call notes, meeting tracking</p>
      <PrimaryButton onClick={() => toast.info('Activities coming soon')}>
        View Activities
      </PrimaryButton>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-10 h-10" />
          <div>
            <h1 className="text-3xl font-bold">CRM & Sales</h1>
            <p className="text-blue-100">Lead capture, pipeline management, and forecasting</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2">
          {[
            { id: 'pipeline', label: 'Pipeline', icon: BarChart3 },
            { id: 'leads', label: 'Leads', icon: Users },
            { id: 'accounts', label: 'Accounts', icon: Briefcase },
            { id: 'activities', label: 'Activities', icon: Calendar }
          ].map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id as any)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  selectedView === view.id
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-700 text-white hover:bg-blue-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {view.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {selectedView === 'pipeline' && renderPipeline()}
      {selectedView === 'leads' && renderLeads()}
      {selectedView === 'accounts' && renderAccounts()}
      {selectedView === 'activities' && renderActivities()}
    </div>
  );
}

// Fix missing import
import { Briefcase } from 'lucide-react';

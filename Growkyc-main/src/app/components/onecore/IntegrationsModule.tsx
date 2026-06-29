import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Plug,
  Mail,
  Calendar,
  DollarSign,
  MessageSquare,
  Zap,
  CheckCircle,
  Settings,
  Globe,
  ExternalLink,
  Plus,
  Search,
  Filter,
  BarChart3,
  Users,
  FileText,
  CreditCard
} from 'lucide-react';

interface IntegrationsModuleProps {
  role: string;
}

export function IntegrationsModule({ role }: IntegrationsModuleProps) {
  const [activeTab, setActiveTab] = useState<'connected' | 'available'>('connected');

  const connectedIntegrations = [
    {
      name: 'Gmail',
      category: 'Email',
      icon: Mail,
      status: 'active',
      color: 'bg-red-500/15 text-red-400',
      lastSync: '2 minutes ago',
      synced: 1247,
      description: 'Email sync and tracking'
    },
    {
      name: 'Google Calendar',
      category: 'Calendar',
      icon: Calendar,
      status: 'active',
      color: 'bg-blue-500/15 text-blue-400',
      lastSync: '5 minutes ago',
      synced: 342,
      description: 'Meeting scheduling and sync'
    },
    {
      name: 'Stripe',
      category: 'Payments',
      icon: CreditCard,
      status: 'active',
      color: 'bg-purple-500/15 text-purple-400',
      lastSync: '1 hour ago',
      synced: 89,
      description: 'Payment processing'
    },
    {
      name: 'Xero',
      category: 'Accounting',
      icon: DollarSign,
      status: 'active',
      color: 'bg-green-500/15 text-green-400',
      lastSync: '3 hours ago',
      synced: 234,
      description: 'Accounting and invoicing'
    },
    {
      name: 'Slack',
      category: 'Communication',
      icon: MessageSquare,
      status: 'active',
      color: 'bg-pink-500/15 text-pink-400',
      lastSync: 'Just now',
      synced: 456,
      description: 'Team notifications'
    },
    {
      name: 'Zapier',
      category: 'Automation',
      icon: Zap,
      status: 'active',
      color: 'bg-orange-500/15 text-orange-400',
      lastSync: '10 minutes ago',
      synced: 78,
      description: 'Workflow automation'
    }
  ];

  const availableIntegrations = [
    {
      name: 'Microsoft Outlook',
      category: 'Email',
      icon: Mail,
      color: 'bg-blue-500/15 text-blue-400',
      description: 'Email sync and calendar integration',
      popular: true
    },
    {
      name: 'QuickBooks',
      category: 'Accounting',
      icon: DollarSign,
      color: 'bg-green-500/15 text-green-400',
      description: 'Accounting and financial management',
      popular: true
    },
    {
      name: 'LinkedIn',
      category: 'Social',
      icon: Users,
      color: 'bg-blue-500/15 text-blue-400',
      description: 'Lead generation and enrichment',
      popular: true
    },
    {
      name: 'Mailchimp',
      category: 'Marketing',
      icon: Mail,
      color: 'bg-yellow-500/15 text-yellow-400',
      description: 'Email marketing campaigns',
      popular: false
    },
    {
      name: 'Zoom',
      category: 'Video',
      icon: Globe,
      color: 'bg-blue-500/15 text-blue-400',
      description: 'Video conferencing',
      popular: false
    },
    {
      name: 'HubSpot',
      category: 'CRM',
      icon: BarChart3,
      color: 'bg-orange-500/15 text-orange-400',
      description: 'Marketing and sales platform',
      popular: false
    },
    {
      name: 'DocuSign',
      category: 'Documents',
      icon: FileText,
      color: 'bg-indigo-500/15 text-indigo-400',
      description: 'Electronic signature',
      popular: false
    },
    {
      name: 'Intercom',
      category: 'Support',
      icon: MessageSquare,
      color: 'bg-blue-500/15 text-blue-400',
      description: 'Customer messaging',
      popular: false
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Integrations</h1>
          <p className="text-slate-300 mt-1">Connect to your favorite tools and services</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Globe className="w-4 h-4 mr-2" />
            Browse All
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Request Integration
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-300">Connected</p>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{connectedIntegrations.length}</p>
          <p className="text-xs text-slate-400 mt-1">Active integrations</p>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-300">Data Synced</p>
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">
            {connectedIntegrations.reduce((sum, i) => sum + i.synced, 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Records this month</p>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-300">Available</p>
            <Plug className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{availableIntegrations.length}+</p>
          <p className="text-xs text-slate-400 mt-1">More to connect</p>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-300">Last Sync</p>
            <Zap className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">Live</p>
          <p className="text-xs text-green-400 mt-1">All systems operational</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-white/10 rounded-lg overflow-hidden">
        <div className="border-b border-white/10 flex">
          {[
            { id: 'connected', label: `Connected (${connectedIntegrations.length})` },
            { id: 'available', label: `Available (${availableIntegrations.length}+)` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-400 font-medium bg-indigo-500/10'
                  : 'border-transparent text-slate-300 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'connected' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search connected integrations..."
                    className="pl-10 pr-4 py-2 w-full border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {connectedIntegrations.map((integration, idx) => {
                  const Icon = integration.icon;
                  return (
                    <div key={idx} className="border border-white/10 rounded-lg p-5 hover:border-indigo-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg ${integration.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-100">{integration.name}</h3>
                            <p className="text-xs text-slate-400">{integration.category}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-green-500/15 text-green-300 rounded-full text-xs font-medium flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          Active
                        </span>
                      </div>

                      <p className="text-sm text-slate-300 mb-4">{integration.description}</p>

                      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-white/10">
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Last Sync</p>
                          <p className="text-sm font-medium text-slate-100">{integration.lastSync}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Records Synced</p>
                          <p className="text-sm font-medium text-slate-100">{integration.synced.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Zap className="w-4 h-4 mr-2" />
                          Sync Now
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'available' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search available integrations..."
                    className="pl-10 pr-4 py-2 w-full border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {availableIntegrations.map((integration, idx) => {
                  const Icon = integration.icon;
                  return (
                    <div key={idx} className="border border-white/10 rounded-lg p-5 hover:border-indigo-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg ${integration.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-100">{integration.name}</h3>
                            <p className="text-xs text-slate-400">{integration.category}</p>
                          </div>
                        </div>
                        {integration.popular && (
                          <span className="px-2 py-1 bg-indigo-500/15 text-indigo-300 rounded-full text-xs font-medium">
                            Popular
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-300 mb-4">{integration.description}</p>

                      <div className="flex items-center gap-2">
                        <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-500/30 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 mb-1">Build Custom Integrations</h3>
              <p className="text-sm text-slate-300">Use our REST API and webhooks to build custom integrations</p>
            </div>
          </div>
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            View API Docs
          </Button>
        </div>
      </div>
    </div>
  );
}

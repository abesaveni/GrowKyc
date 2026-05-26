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
      color: 'bg-red-100 text-red-600',
      lastSync: '2 minutes ago',
      synced: 1247,
      description: 'Email sync and tracking'
    },
    {
      name: 'Google Calendar',
      category: 'Calendar',
      icon: Calendar,
      status: 'active',
      color: 'bg-blue-100 text-blue-600',
      lastSync: '5 minutes ago',
      synced: 342,
      description: 'Meeting scheduling and sync'
    },
    {
      name: 'Stripe',
      category: 'Payments',
      icon: CreditCard,
      status: 'active',
      color: 'bg-purple-100 text-purple-600',
      lastSync: '1 hour ago',
      synced: 89,
      description: 'Payment processing'
    },
    {
      name: 'Xero',
      category: 'Accounting',
      icon: DollarSign,
      status: 'active',
      color: 'bg-green-100 text-green-600',
      lastSync: '3 hours ago',
      synced: 234,
      description: 'Accounting and invoicing'
    },
    {
      name: 'Slack',
      category: 'Communication',
      icon: MessageSquare,
      status: 'active',
      color: 'bg-pink-100 text-pink-600',
      lastSync: 'Just now',
      synced: 456,
      description: 'Team notifications'
    },
    {
      name: 'Zapier',
      category: 'Automation',
      icon: Zap,
      status: 'active',
      color: 'bg-orange-100 text-orange-600',
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
      color: 'bg-blue-100 text-blue-600',
      description: 'Email sync and calendar integration',
      popular: true
    },
    {
      name: 'QuickBooks',
      category: 'Accounting',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      description: 'Accounting and financial management',
      popular: true
    },
    {
      name: 'LinkedIn',
      category: 'Social',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      description: 'Lead generation and enrichment',
      popular: true
    },
    {
      name: 'Mailchimp',
      category: 'Marketing',
      icon: Mail,
      color: 'bg-yellow-100 text-yellow-600',
      description: 'Email marketing campaigns',
      popular: false
    },
    {
      name: 'Zoom',
      category: 'Video',
      icon: Globe,
      color: 'bg-blue-100 text-blue-600',
      description: 'Video conferencing',
      popular: false
    },
    {
      name: 'HubSpot',
      category: 'CRM',
      icon: BarChart3,
      color: 'bg-orange-100 text-orange-600',
      description: 'Marketing and sales platform',
      popular: false
    },
    {
      name: 'DocuSign',
      category: 'Documents',
      icon: FileText,
      color: 'bg-indigo-100 text-indigo-600',
      description: 'Electronic signature',
      popular: false
    },
    {
      name: 'Intercom',
      category: 'Support',
      icon: MessageSquare,
      color: 'bg-blue-100 text-blue-600',
      description: 'Customer messaging',
      popular: false
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-1">Connect to your favorite tools and services</p>
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
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Connected</p>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{connectedIntegrations.length}</p>
          <p className="text-xs text-gray-500 mt-1">Active integrations</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Data Synced</p>
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {connectedIntegrations.reduce((sum, i) => sum + i.synced, 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Records this month</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Available</p>
            <Plug className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{availableIntegrations.length}+</p>
          <p className="text-xs text-gray-500 mt-1">More to connect</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Last Sync</p>
            <Zap className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">Live</p>
          <p className="text-xs text-green-600 mt-1">All systems operational</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="border-b border-gray-300 flex">
          {[
            { id: 'connected', label: `Connected (${connectedIntegrations.length})` },
            { id: 'available', label: `Available (${availableIntegrations.length}+)` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 font-medium bg-indigo-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {connectedIntegrations.map((integration, idx) => {
                  const Icon = integration.icon;
                  return (
                    <div key={idx} className="border border-gray-300 rounded-lg p-5 hover:border-indigo-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg ${integration.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                            <p className="text-xs text-gray-500">{integration.category}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          Active
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

                      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Last Sync</p>
                          <p className="text-sm font-medium text-gray-900">{integration.lastSync}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Records Synced</p>
                          <p className="text-sm font-medium text-gray-900">{integration.synced.toLocaleString()}</p>
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
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    <div key={idx} className="border border-gray-300 rounded-lg p-5 hover:border-indigo-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg ${integration.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                            <p className="text-xs text-gray-500">{integration.category}</p>
                          </div>
                        </div>
                        {integration.popular && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                            Popular
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

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
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Build Custom Integrations</h3>
              <p className="text-sm text-gray-600">Use our REST API and webhooks to build custom integrations</p>
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

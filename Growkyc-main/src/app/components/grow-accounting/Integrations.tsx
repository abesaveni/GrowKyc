import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Plug,
  CheckCircle,
  Circle,
  Settings,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Key,
  Shield,
  Zap,
  TrendingUp,
  Clock
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface IntegrationsProps {
  onNavigate?: (page: string) => void;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  status: 'connected' | 'available' | 'error';
  lastSync?: string;
  syncStatus?: 'syncing' | 'idle' | 'error';
  features: string[];
  usageCount?: number;
  connectionDate?: string;
  apiKey?: boolean;
  oauth?: boolean;
}

export function Integrations({ onNavigate }: IntegrationsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const integrations: Integration[] = [
    {
      id: 'xero',
      name: 'Xero',
      description: 'Cloud accounting software for small and medium businesses',
      category: 'Accounting',
      logo: '🔷',
      status: 'connected',
      lastSync: '2024-02-14T10:30:00',
      syncStatus: 'idle',
      features: ['Automatic data sync', 'Chart of accounts mapping', 'Real-time updates'],
      usageCount: 1247,
      connectionDate: '2024-01-15',
      oauth: true
    },
    {
      id: 'myob',
      name: 'MYOB',
      description: 'Business management platform - sync accounts and transactions',
      category: 'Accounting',
      logo: '🟢',
      status: 'connected',
      lastSync: '1 hour ago',
      syncStatus: 'idle',
      features: ['Client sync', 'Transaction import', 'Payroll data'],
      usageCount: 892,
      connectionDate: '2023-08-20',
      oauth: true
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks Online',
      description: 'Accounting software for small businesses',
      category: 'Accounting',
      logo: '🟦',
      status: 'available',
      features: ['Client sync', 'Invoice sync', 'Expense tracking'],
      oauth: true
    },
    {
      id: 'office365',
      name: 'Microsoft 365',
      description: 'Email, calendar, and document management integration',
      category: 'Productivity',
      logo: '📧',
      status: 'connected',
      lastSync: '10 minutes ago',
      syncStatus: 'idle',
      features: ['Email integration', 'Calendar sync', 'OneDrive', 'Teams'],
      usageCount: 2341,
      connectionDate: '2023-05-10',
      oauth: true
    },
    {
      id: 'gmail',
      name: 'Google Workspace',
      description: 'Gmail, Calendar, and Drive integration',
      category: 'Productivity',
      logo: '📮',
      status: 'available',
      features: ['Gmail', 'Google Calendar', 'Google Drive', 'Meet'],
      oauth: true
    },
    {
      id: 'ato',
      name: 'ATO Portal',
      description: 'Australian Taxation Office - lodge BAS and tax returns',
      category: 'Compliance',
      logo: '🏛️',
      status: 'connected',
      lastSync: '1 day ago',
      syncStatus: 'idle',
      features: ['BAS lodgement', 'Tax returns', 'Activity statements'],
      usageCount: 456,
      connectionDate: '2023-07-01',
      apiKey: true
    },
    {
      id: 'supermate',
      name: 'SuperMate',
      description: 'SMSF administration and compliance software',
      category: 'SMSF',
      logo: '💼',
      status: 'connected',
      lastSync: '3 hours ago',
      syncStatus: 'idle',
      features: ['SMSF data sync', 'Compliance checks', 'Member statements'],
      usageCount: 234,
      connectionDate: '2023-09-15',
      oauth: true
    },
    {
      id: 'class',
      name: 'Class Super',
      description: 'SMSF administration platform',
      category: 'SMSF',
      logo: '🏦',
      status: 'available',
      features: ['SMSF administration', 'Compliance', 'Reporting'],
      oauth: true
    },
    {
      id: 'dext',
      name: 'Dext',
      description: 'Document capture and data extraction',
      category: 'Documents',
      logo: '📄',
      status: 'connected',
      lastSync: '30 minutes ago',
      syncStatus: 'syncing',
      features: ['Receipt capture', 'Invoice extraction', 'Bank feeds'],
      usageCount: 1876,
      connectionDate: '2023-06-20',
      oauth: true
    },
    {
      id: 'hubdoc',
      name: 'HubDoc',
      description: 'Document management and data extraction',
      category: 'Documents',
      logo: '🗂️',
      status: 'available',
      features: ['Document storage', 'Data extraction', 'Automation'],
      oauth: true
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing and invoicing',
      category: 'Payments',
      logo: '💳',
      status: 'available',
      features: ['Payment processing', 'Invoicing', 'Subscriptions'],
      apiKey: true
    },
    {
      id: 'bpoint',
      name: 'BPOINT',
      description: 'Australian payment gateway',
      category: 'Payments',
      logo: '💰',
      status: 'available',
      features: ['Payment processing', 'Invoicing'],
      apiKey: true
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and notifications',
      category: 'Communication',
      logo: '💬',
      status: 'connected',
      lastSync: '5 minutes ago',
      syncStatus: 'idle',
      features: ['Notifications', 'Task alerts', 'Team chat'],
      usageCount: 3421,
      connectionDate: '2023-05-01',
      oauth: true
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automation and workflow integration',
      category: 'Automation',
      logo: '⚡',
      status: 'available',
      features: ['Workflow automation', '5000+ app integrations'],
      apiKey: true
    },
    {
      id: 'make',
      name: 'Make (Integromat)',
      description: 'Advanced automation platform',
      category: 'Automation',
      logo: '🔧',
      status: 'available',
      features: ['Complex workflows', 'Data transformation'],
      apiKey: true
    }
  ];

  const categories = [
    'all',
    'Accounting',
    'Productivity',
    'Compliance',
    'SMSF',
    'Documents',
    'Payments',
    'Communication',
    'Automation'
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || integration.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || integration.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const totalSyncs = integrations
    .filter(i => i.usageCount)
    .reduce((sum, i) => sum + (i.usageCount || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <span className="px-2 py-1 bg-green-500/10 text-green-300 text-xs font-semibold rounded border border-green-300">Connected</span>;
      case 'error':
        return <span className="px-2 py-1 bg-red-500/10 text-red-300 text-xs font-semibold rounded border border-red-300">Error</span>;
      case 'available':
        return <span className="px-2 py-1 bg-white/5 text-slate-300 text-xs font-semibold rounded border border-white/10">Available</span>;
      default:
        return null;
    }
  };

  const getSyncStatusIcon = (status?: string) => {
    switch (status) {
      case 'syncing':
        return <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />;
      case 'idle':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <WorkpaperLayout currentPage="integrations" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-slate-100">Integrations</h1>
            <p className="text-sm text-slate-300 mt-1">Connect your favorite tools and automate workflows</p>
          </div>
          <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
            <Plus className="w-4 h-4 mr-2" />
            Request Integration
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Connected</p>
                  <p className="text-2xl font-bold text-slate-100">{connectedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Plug className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Available</p>
                  <p className="text-2xl font-bold text-slate-100">{integrations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Total Syncs</p>
                  <p className="text-2xl font-bold text-slate-100">{(totalSyncs / 1000).toFixed(1)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Zap className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Active Now</p>
                  <p className="text-2xl font-bold text-slate-100">
                    {integrations.filter(i => i.syncStatus === 'syncing').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search integrations..."
                    className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                  />
                </div>
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
              >
                <option value="all">All Status</option>
                <option value="connected">Connected</option>
                <option value="available">Available</option>
                <option value="error">Error</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.map((integration) => (
            <Card
              key={integration.id}
              className="cursor-pointer hover:shadow-lg transition-all shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
              onClick={() => setSelectedIntegration(integration)}
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{integration.logo}</div>
                    <div>
                      <h3 className="font-semibold text-slate-100">{integration.name}</h3>
                      <p className="text-xs text-slate-400">{integration.category}</p>
                    </div>
                  </div>
                  {getStatusBadge(integration.status)}
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 mb-4 line-clamp-2">{integration.description}</p>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {integration.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded">
                      {feature}
                    </span>
                  ))}
                  {integration.features.length > 3 && (
                    <span className="px-2 py-1 bg-white/5 text-slate-300 text-xs rounded">
                      +{integration.features.length - 3} more
                    </span>
                  )}
                </div>

                {/* Status Info */}
                {integration.status === 'connected' && (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-1">
                        {getSyncStatusIcon(integration.syncStatus)}
                        <span>Last sync: {integration.lastSync}</span>
                      </div>
                    </div>
                    {integration.usageCount && (
                      <div className="text-xs text-slate-300">
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                        {integration.usageCount} operations
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <Button
                  size="sm"
                  variant={integration.status === 'connected' ? 'outline' : 'default'}
                  className={integration.status === 'connected' ? '' : 'w-full bg-[#2855a6] hover:bg-[#1e4089]'}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (integration.id === 'xero' && integration.status === 'connected') {
                      onNavigate?.('xero-integration');
                    } else {
                      setSelectedIntegration(integration);
                    }
                  }}
                >
                  {integration.status === 'connected' ? (
                    <>
                      <Settings className="w-3 h-3 mr-2" />
                      Configure
                    </>
                  ) : (
                    <>
                      <Plug className="w-3 h-3 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredIntegrations.length === 0 && (
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-12 text-center">
              <Plug className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">No integrations found</h3>
              <p className="text-slate-300 mb-6">Try adjusting your search or filter criteria</p>
              <Button variant="outline">Clear Filters</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Integration Detail Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedIntegration.logo}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">{selectedIntegration.name}</h2>
                    <p className="text-sm text-slate-300">{selectedIntegration.category}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedIntegration(null)}>
                  <Plus className="w-6 h-6 text-slate-300 rotate-45" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Status */}
                <div>
                  <h3 className="font-semibold text-slate-100 mb-2">Status</h3>
                  {getStatusBadge(selectedIntegration.status)}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-slate-100 mb-2">About</h3>
                  <p className="text-sm text-slate-300">{selectedIntegration.description}</p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold text-slate-100 mb-3">Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedIntegration.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connection Info */}
                {selectedIntegration.status === 'connected' && (
                  <div>
                    <h3 className="font-semibold text-slate-100 mb-3">Connection Details</h3>
                    <div className="space-y-3 p-4 bg-white/5 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Connected Since:</span>
                        <span className="font-medium text-slate-100">{selectedIntegration.connectionDate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Last Sync:</span>
                        <span className="font-medium text-slate-100">{selectedIntegration.lastSync}</span>
                      </div>
                      {selectedIntegration.usageCount && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Total Operations:</span>
                          <span className="font-medium text-slate-100">{selectedIntegration.usageCount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Sync Status:</span>
                        <div className="flex items-center gap-2">
                          {getSyncStatusIcon(selectedIntegration.syncStatus)}
                          <span className="font-medium text-slate-100 capitalize">
                            {selectedIntegration.syncStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Authentication Method */}
                <div>
                  <h3 className="font-semibold text-slate-100 mb-3">Authentication</h3>
                  <div className="flex gap-2">
                    {selectedIntegration.oauth && (
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-300 text-sm rounded border border-blue-500/30">
                        <Shield className="w-3 h-3 inline mr-1" />
                        OAuth 2.0
                      </span>
                    )}
                    {selectedIntegration.apiKey && (
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-300 text-sm rounded border border-purple-500/30">
                        <Key className="w-3 h-3 inline mr-1" />
                        API Key
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  {selectedIntegration.status === 'connected' ? (
                    <>
                      <Button className="flex-1 bg-[#2855a6] hover:bg-[#1e4089]">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync Now
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                      <Button variant="outline">
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="flex-1 bg-[#2855a6] hover:bg-[#1e4089]">
                        <Plug className="w-4 h-4 mr-2" />
                        Connect Now
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Learn More
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </WorkpaperLayout>
  );
}
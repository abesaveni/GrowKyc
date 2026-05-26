import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Zap,
  CheckCircle,
  AlertCircle,
  Settings,
  RefreshCw,
  Link2,
  FileText,
  Users,
  Briefcase,
  FolderOpen,
  Calendar,
  Mail,
  Cloud,
  Code,
  TrendingUp,
  Lock,
  Eye,
  Download,
  Upload,
  PlayCircle
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  provider: string;
  logo: string;
  category: 'practice-management' | 'document-management' | 'accounting' | 'communication' | 'other';
  status: 'connected' | 'disconnected' | 'error';
  features: string[];
  lastSync?: string;
  syncStatus?: 'syncing' | 'idle' | 'error';
  clientsSynced?: number;
  jobsCreated?: number;
  documentsSynced?: number;
}

interface PracticeIntegrationsProps {
  onBack: () => void;
}

export function PracticeIntegrations({ onBack }: PracticeIntegrationsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const integrations: Integration[] = [
    {
      id: 'xpm',
      name: 'Xero Practice Manager',
      provider: 'Xero',
      logo: '🔵',
      category: 'practice-management',
      status: 'connected',
      features: [
        'Create clients automatically',
        'Create jobs from accepted proposals',
        'Sync contact details',
        'Write back compliance status',
        'Lock job start until KYC approved',
        'Update job progress',
        'Sync staff assignments'
      ],
      lastSync: '2026-03-20 14:30',
      syncStatus: 'idle',
      clientsSynced: 145,
      jobsCreated: 87
    },
    {
      id: 'fyi',
      name: 'FYI Docs',
      provider: 'FYI',
      logo: '📁',
      category: 'document-management',
      status: 'connected',
      features: [
        'Auto-file documents to client folders',
        'Write back compliance pack PDFs',
        'Link documents to client records',
        'Create folder structure automatically',
        'Sync document metadata',
        'Archive old documents'
      ],
      lastSync: '2026-03-20 15:00',
      syncStatus: 'idle',
      documentsSynced: 1243
    },
    {
      id: 'xero-ledger',
      name: 'Xero Accounting',
      provider: 'Xero',
      logo: '🔵',
      category: 'accounting',
      status: 'connected',
      features: [
        'Create invoices from proposals',
        'Record payments automatically',
        'Sync client accounting data',
        'Create contacts',
        'Track receivables',
        'Generate financial reports'
      ],
      lastSync: '2026-03-20 14:45',
      syncStatus: 'idle',
      clientsSynced: 132
    },
    {
      id: 'myob',
      name: 'MYOB Practice',
      provider: 'MYOB',
      logo: '🟢',
      category: 'practice-management',
      status: 'disconnected',
      features: [
        'Client record creation',
        'Job creation',
        'Document writeback',
        'Time tracking sync',
        'Billing integration'
      ]
    },
    {
      id: 'lodgeit',
      name: 'LodgeiT',
      provider: 'LodgeiT',
      logo: '🟣',
      category: 'other',
      status: 'disconnected',
      features: [
        'Tax lodgement integration',
        'Client verification status',
        'Lodgement readiness checks',
        'ATO compliance sync'
      ]
    },
    {
      id: 'office365',
      name: 'Microsoft 365',
      provider: 'Microsoft',
      logo: '🔷',
      category: 'communication',
      status: 'connected',
      features: [
        'Email notifications',
        'Calendar reminders for reviews',
        'Teams integration for alerts',
        'Outlook contact sync',
        'OneDrive document storage'
      ],
      lastSync: '2026-03-20 15:15',
      syncStatus: 'idle'
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks Online',
      provider: 'Intuit',
      logo: '🟩',
      category: 'accounting',
      status: 'disconnected',
      features: [
        'Client creation',
        'Invoice generation',
        'Payment tracking',
        'Financial data sync'
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Integrations', count: integrations.length },
    { id: 'practice-management', name: 'Practice Management', count: integrations.filter(i => i.category === 'practice-management').length },
    { id: 'document-management', name: 'Document Management', count: integrations.filter(i => i.category === 'document-management').length },
    { id: 'accounting', name: 'Accounting', count: integrations.filter(i => i.category === 'accounting').length },
    { id: 'communication', name: 'Communication', count: integrations.filter(i => i.category === 'communication').length }
  ];

  const filteredIntegrations = selectedCategory === 'all'
    ? integrations
    : integrations.filter(i => i.category === selectedCategory);

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-600 text-white';
      case 'disconnected': return 'bg-gray-600 text-white';
      case 'error': return 'bg-red-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getSyncStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'syncing': return 'text-blue-600';
      case 'idle': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-8 py-12">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">Practice Integrations</h1>
            <p className="text-white/90 text-xl">Connect your practice tools • Automate workflows • Sync data</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Active Integrations</div>
            </div>
            <div className="text-4xl font-bold mb-1">{connectedCount}</div>
            <div className="text-xs text-white/70">Out of {integrations.length} available</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Clients Synced</div>
            </div>
            <div className="text-4xl font-bold mb-1">
              {integrations.reduce((sum, i) => sum + (i.clientsSynced || 0), 0)}
            </div>
            <div className="text-xs text-white/70">Across all platforms</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Jobs Created</div>
            </div>
            <div className="text-4xl font-bold mb-1">
              {integrations.reduce((sum, i) => sum + (i.jobsCreated || 0), 0)}
            </div>
            <div className="text-xs text-white/70">Via automation</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Documents Synced</div>
            </div>
            <div className="text-4xl font-bold mb-1">
              {integrations.reduce((sum, i) => sum + (i.documentsSynced || 0), 0)}
            </div>
            <div className="text-xs text-white/70">To document systems</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Category Filter */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 gap-6 mb-12">
          {filteredIntegrations.map((integration) => (
            <Card
              key={integration.id}
              className={`border-2 ${
                integration.status === 'connected'
                  ? 'border-green-200 bg-green-50'
                  : integration.status === 'error'
                  ? 'border-red-200 bg-red-50'
                  : 'border-gray-200'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Logo */}
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-4xl border-2 border-gray-200">
                      {integration.logo}
                    </div>

                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{integration.name}</h3>
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                        {integration.status === 'connected' && integration.syncStatus && (
                          <div className={`flex items-center gap-2 text-sm ${getSyncStatusColor(integration.syncStatus)}`}>
                            {integration.syncStatus === 'syncing' ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Syncing...</span>
                              </>
                            ) : integration.syncStatus === 'idle' ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Synced</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4" />
                                <span>Error</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 mb-4">
                        {integration.provider}
                        {integration.lastSync && (
                          <>
                            {' • '}Last synced: {integration.lastSync}
                          </>
                        )}
                      </div>

                      {/* Sync Stats */}
                      {integration.status === 'connected' && (
                        <div className="flex items-center gap-6 mb-4">
                          {integration.clientsSynced !== undefined && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-gray-900">{integration.clientsSynced}</span>
                              <span className="text-gray-600">clients</span>
                            </div>
                          )}
                          {integration.jobsCreated !== undefined && (
                            <div className="flex items-center gap-2 text-sm">
                              <Briefcase className="w-4 h-4 text-purple-600" />
                              <span className="font-semibold text-gray-900">{integration.jobsCreated}</span>
                              <span className="text-gray-600">jobs</span>
                            </div>
                          )}
                          {integration.documentsSynced !== undefined && (
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="w-4 h-4 text-green-600" />
                              <span className="font-semibold text-gray-900">{integration.documentsSynced}</span>
                              <span className="text-gray-600">documents</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Features */}
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-gray-700 mb-2">Features:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {integration.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-6">
                    {integration.status === 'connected' ? (
                      <>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sync Now
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Logs
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button size="sm">
                        <Link2 className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workflow Automation */}
        <Card className="mb-12 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              Automated Workflows
            </CardTitle>
            <CardDescription>Pre-configured automation rules using integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Proposal-to-Job Pipeline',
                  description: 'When proposal accepted → Create client in XPM → Create job → Trigger KYC → On KYC approval → Unlock job',
                  integrations: ['XPM', 'Grow KYC'],
                  status: 'active',
                  runs: 87
                },
                {
                  name: 'Document Auto-Filing',
                  description: 'When document uploaded → Extract client name → Auto-file to FYI → Update metadata → Notify team',
                  integrations: ['FYI Docs', 'Office 365'],
                  status: 'active',
                  runs: 1243
                },
                {
                  name: 'Payment-to-Invoice',
                  description: 'When payment received → Create invoice in Xero → Mark proposal as paid → Send receipt to client',
                  integrations: ['Xero Accounting', 'Office 365'],
                  status: 'active',
                  runs: 145
                },
                {
                  name: 'Annual Re-engagement',
                  description: 'On engagement expiry date → Send renewal reminder → Rerun KYC screening → Update risk score → Notify partner',
                  integrations: ['XPM', 'Grow KYC', 'Office 365'],
                  status: 'active',
                  runs: 32
                }
              ].map((workflow, idx) => (
                <div key={idx} className="p-5 bg-white rounded-xl border-2 border-indigo-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-gray-900 text-lg">{workflow.name}</h4>
                        <Badge className={workflow.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}>
                          {workflow.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{workflow.description}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Link2 className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm text-gray-600">
                            {workflow.integrations.join(' → ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PlayCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600">
                            {workflow.runs} successful runs
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Logs
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Access */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-600" />
              API Platform
            </CardTitle>
            <CardDescription>RESTful API for custom integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-gray-900">API Keys</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">Manage your API access</p>
                <Button size="sm" variant="outline" className="w-full">
                  View Keys
                </Button>
              </div>

              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-gray-900">Documentation</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">Complete API reference</p>
                <Button size="sm" variant="outline" className="w-full">
                  View Docs
                </Button>
              </div>

              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-gray-900">Webhooks</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">Real-time event notifications</p>
                <Button size="sm" variant="outline" className="w-full">
                  Configure
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

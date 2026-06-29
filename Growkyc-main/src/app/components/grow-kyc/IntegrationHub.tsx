import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Globe,
  Database,
  Eye,
  Settings,
  Zap,
  RefreshCw,
  Download,
  ExternalLink,
  Play,
  BarChart3,
  Building,
  Network,
  Bell,
  Key,
  DollarSign,
  Mail,
  MessageSquare,
  CreditCard,
  TrendingUp,
  Search,
  FileText,
  Briefcase
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { toast } from '../../lib/toast';

interface IntegrationHubProps {
  onBack: () => void;
}

interface Integration {
  id: string;
  name: string;
  category: 'verification' | 'banking' | 'credit' | 'platform' | 'regulatory' | 'payments';
  status: 'active' | 'configured' | 'architected' | 'available';
  icon: any;
  description: string;
  capabilities: string[];
  uptime?: number;
  lastSync?: string;
  monthlyUsage?: number;
  costPerCheck?: string;
}

export function IntegrationHub({ onBack }: IntegrationHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const integrations: Integration[] = [
    // Verification Providers - Active
    {
      id: 'trulioo',
      name: 'Trulioo GlobalGateway',
      category: 'verification',
      status: 'active',
      icon: Globe,
      description: 'Global identity verification covering 195+ countries',
      capabilities: [
        'Individual verification (195 countries)',
        'Business verification (50+ countries)',
        'Document authentication',
        'Biometric facial recognition',
        'Ongoing monitoring'
      ],
      uptime: 99.8,
      lastSync: '2024-03-01 10:45',
      monthlyUsage: 847,
      costPerCheck: '$1.50 - $3.00'
    },
    {
      id: 'greenid',
      name: 'GreenID',
      category: 'verification',
      status: 'active',
      icon: Shield,
      description: 'Australian identity verification specialist',
      capabilities: [
        'DVS (Document Verification Service)',
        'Credit bureau verification',
        'Visa verification',
        'AML name matching',
        'Real-time Australia-focused checks'
      ],
      uptime: 99.9,
      lastSync: '2024-03-01 10:42',
      monthlyUsage: 1243,
      costPerCheck: '$1.20 - $2.50'
    },
    {
      id: 'worldcheck',
      name: 'Refinitiv WorldCheck',
      category: 'verification',
      status: 'active',
      icon: Search,
      description: 'PEP, sanctions, and adverse media screening',
      capabilities: [
        'PEP screening (220+ countries)',
        'Sanctions list checking (all major lists)',
        'Adverse media monitoring',
        'Ongoing monitoring alerts',
        'Risk intelligence reports'
      ],
      uptime: 99.7,
      lastSync: '2024-03-01 10:40',
      monthlyUsage: 2156,
      costPerCheck: '$0.50 - $2.00'
    },
    {
      id: 'infotrack',
      name: 'InfoTrack',
      category: 'verification',
      status: 'active',
      icon: Building,
      description: 'Australian company and property searches',
      capabilities: [
        'ASIC company searches',
        'Director and shareholder details',
        'PPSR searches',
        'Property title searches',
        'Insolvency checks'
      ],
      uptime: 99.6,
      lastSync: '2024-03-01 10:38',
      monthlyUsage: 567,
      costPerCheck: '$5.00 - $25.00'
    },

    // Banking & Transaction Monitoring - Architected
    {
      id: 'basiq',
      name: 'Basiq Open Banking',
      category: 'banking',
      status: 'architected',
      icon: Database,
      description: 'Open Banking (CDR) data aggregation for Australia',
      capabilities: [
        'Real-time bank account verification',
        'Transaction history (12 months)',
        'Balance and income verification',
        'Source of funds validation',
        'Transaction categorization'
      ]
    },
    {
      id: 'plaid',
      name: 'Plaid',
      category: 'banking',
      status: 'architected',
      icon: Database,
      description: 'Open Banking for US and international markets',
      capabilities: [
        'Bank account verification',
        'Transaction monitoring',
        'Income verification',
        'Identity verification',
        'Asset verification'
      ]
    },

    // Credit Bureau - Architected
    {
      id: 'illion',
      name: 'Illion Credit Bureau',
      category: 'credit',
      status: 'architected',
      icon: TrendingUp,
      description: 'Australian credit reporting and risk assessment',
      capabilities: [
        'Credit score and history',
        'Default and court judgment checks',
        'Comprehensive credit file',
        'Affordability assessment',
        'Identity verification'
      ]
    },
    {
      id: 'equifax',
      name: 'Equifax',
      category: 'credit',
      status: 'architected',
      icon: TrendingUp,
      description: 'Global credit bureau and risk intelligence',
      capabilities: [
        'Credit score (VantageScore)',
        'Credit monitoring',
        'Fraud detection',
        'Identity verification',
        'Business credit reports'
      ]
    },

    // Regulatory Intelligence - Architected
    {
      id: 'austrac-intel',
      name: 'AUSTRAC Intelligence Feed',
      category: 'regulatory',
      status: 'architected',
      icon: Bell,
      description: 'Real-time regulatory updates from AUSTRAC',
      capabilities: [
        'Rule changes and updates',
        'Industry guidance releases',
        'Enforcement action notifications',
        'Sanctions list updates',
        'Typologies and trends'
      ]
    },
    {
      id: 'asic-intel',
      name: 'ASIC Regulatory Feed',
      category: 'regulatory',
      status: 'architected',
      icon: Bell,
      description: 'ASIC regulatory updates and company changes',
      capabilities: [
        'Regulatory guide updates',
        'Legislative instrument releases',
        'Enforcement actions',
        'Company registry changes',
        'Reportable situations guidance'
      ]
    },

    // Platform Integrations - Active & Configured
    {
      id: 'stripe',
      name: 'Stripe',
      category: 'payments',
      status: 'active',
      icon: CreditCard,
      description: 'Payment processing and subscription management',
      capabilities: [
        'Subscription billing',
        'Payment processing',
        'Invoice generation',
        'Customer portal',
        'Usage-based billing'
      ],
      uptime: 99.99,
      lastSync: '2024-03-01 10:50',
      monthlyUsage: 342
    },
    {
      id: 'xero',
      name: 'Xero',
      category: 'platform',
      status: 'configured',
      icon: BarChart3,
      description: 'Accounting software integration',
      capabilities: [
        'Invoice sync',
        'Client import',
        'Expense tracking',
        'Financial reporting',
        'GST calculation'
      ]
    },
    {
      id: 'xpm',
      name: 'Xero Practice Manager',
      category: 'platform',
      status: 'active',
      icon: Briefcase,
      description: 'Practice management and workflow automation',
      capabilities: [
        'Client sync',
        'Job tracking',
        'Time tracking',
        'Staff allocation',
        'Workflow automation'
      ],
      uptime: 99.5,
      lastSync: '2024-03-01 10:30',
      monthlyUsage: 1543
    },
    {
      id: 'microsoft365',
      name: 'Microsoft 365',
      category: 'platform',
      status: 'configured',
      icon: Mail,
      description: 'Email, calendar, and document management',
      capabilities: [
        'Email integration',
        'Calendar sync',
        'OneDrive storage',
        'Teams integration',
        'SharePoint documents'
      ]
    },
    {
      id: 'email-sms',
      name: 'Email & SMS Gateway',
      category: 'platform',
      status: 'active',
      icon: MessageSquare,
      description: 'Communication delivery infrastructure',
      capabilities: [
        'Transactional emails',
        'SMS notifications',
        'Template management',
        'Delivery tracking',
        'Bounce handling'
      ],
      uptime: 99.9,
      lastSync: '2024-03-01 10:48',
      monthlyUsage: 8234
    }
  ];

  const categories = [
    { id: 'all', label: 'All Integrations', count: integrations.length },
    { id: 'verification', label: 'Identity Verification', count: integrations.filter(i => i.category === 'verification').length },
    { id: 'banking', label: 'Banking & Transactions', count: integrations.filter(i => i.category === 'banking').length },
    { id: 'credit', label: 'Credit Bureau', count: integrations.filter(i => i.category === 'credit').length },
    { id: 'regulatory', label: 'Regulatory Intelligence', count: integrations.filter(i => i.category === 'regulatory').length },
    { id: 'payments', label: 'Payments', count: integrations.filter(i => i.category === 'payments').length },
    { id: 'platform', label: 'Platform', count: integrations.filter(i => i.category === 'platform').length }
  ];

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === selectedCategory);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'configured':
        return <Badge className="bg-blue-500"><Settings className="w-3 h-3 mr-1" />Configured</Badge>;
      case 'architected':
        return <Badge className="bg-amber-500"><Clock className="w-3 h-3 mr-1" />Architected</Badge>;
      case 'available':
        return <Badge className="bg-gray-500">Available</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const summaryStats = {
    active: integrations.filter(i => i.status === 'active').length,
    configured: integrations.filter(i => i.status === 'configured').length,
    architected: integrations.filter(i => i.status === 'architected').length,
    totalChecks: integrations.reduce((sum, i) => sum + (i.monthlyUsage || 0), 0)
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-white/30" />
              <Network className="w-6 h-6 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Integration Hub</h1>
                <p className="text-sm text-white/90">Connected Services & API Integrations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-[#1e293b] text-blue-600 text-sm px-3 py-1">
                <Zap className="w-4 h-4 mr-1" />
                {summaryStats.active} Active
              </Badge>
              <Badge className="bg-white/20 text-white text-sm px-3 py-1">
                {summaryStats.totalChecks.toLocaleString()} checks/month
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-green-300 bg-green-50">
            <CardContent className="p-6">
              <div className="text-sm text-green-700">Active Integrations</div>
              <div className="text-3xl font-bold text-green-900">{summaryStats.active}</div>
              <div className="text-xs text-green-600 mt-1">Live and operational</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-300 bg-blue-50">
            <CardContent className="p-6">
              <div className="text-sm text-blue-700">Configured</div>
              <div className="text-3xl font-bold text-blue-900">{summaryStats.configured}</div>
              <div className="text-xs text-blue-600 mt-1">Ready to activate</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-300 bg-amber-50">
            <CardContent className="p-6">
              <div className="text-sm text-amber-700">Architected</div>
              <div className="text-3xl font-bold text-amber-900">{summaryStats.architected}</div>
              <div className="text-xs text-amber-600 mt-1">Framework ready</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-purple-300 bg-purple-50">
            <CardContent className="p-6">
              <div className="text-sm text-purple-700">Monthly Usage</div>
              <div className="text-3xl font-bold text-purple-900">{summaryStats.totalChecks.toLocaleString()}</div>
              <div className="text-xs text-purple-600 mt-1">API calls</div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
              className="gap-2"
            >
              {cat.label}
              <Badge variant="secondary" className="ml-1">{cat.count}</Badge>
            </Button>
          ))}
        </div>

        {/* Integration Cards */}
        <div className="space-y-4">
          {filteredIntegrations.map(integration => {
            const Icon = integration.icon;
            return (
              <Card 
                key={integration.id}
                className={`border-2 ${
                  integration.status === 'active' ? 'border-green-300 bg-gradient-to-r from-green-50 to-blue-50' :
                  integration.status === 'configured' ? 'border-blue-300 bg-blue-50' :
                  integration.status === 'architected' ? 'border-amber-300 bg-amber-50' :
                  'border-gray-300 bg-[#0f172a]'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        integration.status === 'active' ? 'bg-green-100' :
                        integration.status === 'configured' ? 'bg-blue-100' :
                        integration.status === 'architected' ? 'bg-amber-100' :
                        'bg-[#0f172a]'
                      }`}>
                        <Icon className={`w-8 h-8 ${
                          integration.status === 'active' ? 'text-green-600' :
                          integration.status === 'configured' ? 'text-blue-600' :
                          integration.status === 'architected' ? 'text-amber-600' :
                          'text-slate-300'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">{integration.name}</h3>
                          {getStatusBadge(integration.status)}
                          {integration.uptime && (
                            <Badge variant="outline" className="text-xs">
                              {integration.uptime}% uptime
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-slate-300 mb-3">{integration.description}</p>

                        <div className="mb-3">
                          <div className="text-xs font-semibold text-slate-300 mb-1">Capabilities:</div>
                          <div className="flex flex-wrap gap-1">
                            {integration.capabilities.slice(0, 3).map((cap, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {cap}
                              </Badge>
                            ))}
                            {integration.capabilities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{integration.capabilities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {integration.status === 'active' && (
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            {integration.lastSync && (
                              <div>
                                <div className="text-slate-300">Last Sync</div>
                                <div className="font-semibold">{integration.lastSync}</div>
                              </div>
                            )}
                            {integration.monthlyUsage !== undefined && (
                              <div>
                                <div className="text-slate-300">This Month</div>
                                <div className="font-semibold text-blue-600">
                                  {integration.monthlyUsage.toLocaleString()} calls
                                </div>
                              </div>
                            )}
                            {integration.costPerCheck && (
                              <div>
                                <div className="text-slate-300">Cost Range</div>
                                <div className="font-semibold text-green-600">{integration.costPerCheck}</div>
                              </div>
                            )}
                          </div>
                        )}

                        {integration.status === 'architected' && (
                          <div className="p-3 bg-amber-100 rounded border border-amber-300 flex items-start gap-2">
                            <Clock className="w-4 h-4 text-amber-600 mt-0.5" />
                            <div className="text-xs text-amber-900">
                              <div className="font-semibold mb-1">Integration Architected</div>
                              <div>API endpoints defined, data models ready. Configuration required to activate.</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      {integration.status === 'active' && (
                        <>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View Activity
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Configure
                          </Button>
                          <Button size="sm" variant="outline">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sync Now
                          </Button>
                        </>
                      )}
                      {integration.status === 'configured' && (
                        <>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Play className="w-4 h-4 mr-2" />
                            Activate
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Configure
                          </Button>
                        </>
                      )}
                      {integration.status === 'architected' && (
                        <>
                          <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                            <Settings className="w-4 h-4 mr-2" />
                            Setup Now
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            View Docs
                          </Button>
                        </>
                      )}
                      {integration.status === 'available' && (
                        <Button size="sm" className="bg-gray-600 hover:bg-gray-700">
                          <Download className="w-4 h-4 mr-2" />
                          Install
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Legend */}
        <Card className="mt-8 border-2 border-gray-300">
          <CardHeader>
            <CardTitle className="text-sm">Integration Status Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Active</div>
                  <div className="text-xs text-slate-300">Live, processing requests, fully operational</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Settings className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Configured</div>
                  <div className="text-xs text-slate-300">API keys set, ready to activate</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Architected</div>
                  <div className="text-xs text-slate-300">Framework ready, needs configuration</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Download className="w-5 h-5 text-slate-300 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-white">Available</div>
                  <div className="text-xs text-slate-300">Can be installed on request</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

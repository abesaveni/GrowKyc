import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Activity,
  Clock,
  DollarSign,
  PlayCircle,
  RefreshCw,
  FileText,
  Zap,
  TrendingUp,
  Database,
  Lock,
  Unlock,
  Eye,
  ChevronRight,
  Wifi,
  WifiOff,
  BarChart3,
  Building,
  Users,
  Globe,
  Sparkles
} from 'lucide-react';

type ProviderStatus = 'connected' | 'disconnected' | 'error' | 'pending';
type Environment = 'sandbox' | 'live';

interface Provider {
  id: string;
  name: string;
  description: string;
  status: ProviderStatus;
  lastSync: Date | null;
  apiHealth: 'healthy' | 'degraded' | 'down';
  usageThisMonth: number;
  costPerCheck: number;
  optional: boolean;
  category: 'identity' | 'aml' | 'business' | 'credit' | 'crypto' | 'legal';
  logo: string;
  capabilities: string[];
}

export function IntegrationsHub() {
  const [activeView, setActiveView] = useState<'dashboard' | 'config'>('dashboard');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showCosts, setShowCosts] = useState(false);

  const providers: Provider[] = [
    {
      id: 'asic',
      name: 'ASIC (Direct)',
      description: 'Company & director verification direct from ASIC registry',
      status: 'connected',
      lastSync: new Date('2026-03-21T08:30:00'),
      apiHealth: 'healthy',
      usageThisMonth: 342,
      costPerCheck: 2.5,
      optional: false,
      category: 'business',
      logo: '🏛️',
      capabilities: ['Company Extract', 'Director Extract', 'Real-time Verification', 'ACN/ABN Lookup']
    },
    {
      id: 'equifax',
      name: 'Equifax',
      description: 'Consumer credit, identity signals & fraud detection',
      status: 'connected',
      lastSync: new Date('2026-03-21T10:15:00'),
      apiHealth: 'healthy',
      usageThisMonth: 567,
      costPerCheck: 8.5,
      optional: false,
      category: 'credit',
      logo: '📊',
      capabilities: ['Consumer Credit', 'Identity Signals', 'Fraud Detection', 'Credit Alerts']
    },
    {
      id: 'illion',
      name: 'Illion',
      description: 'Business credit, insolvency, court data & director risk',
      status: 'connected',
      lastSync: new Date('2026-03-21T09:45:00'),
      apiHealth: 'healthy',
      usageThisMonth: 289,
      costPerCheck: 12.0,
      optional: false,
      category: 'business',
      logo: '🏢',
      capabilities: ['Business Credit', 'Insolvency Check', 'Court Data', 'Director Risk']
    },
    {
      id: 'complyadvantage',
      name: 'ComplyAdvantage',
      description: 'Global AML screening: PEP, Sanctions, Adverse Media',
      status: 'connected',
      lastSync: new Date('2026-03-21T11:00:00'),
      apiHealth: 'healthy',
      usageThisMonth: 892,
      costPerCheck: 3.0,
      optional: false,
      category: 'aml',
      logo: '🛡️',
      capabilities: ['PEP Screening', 'Sanctions Check', 'Adverse Media', 'Live Monitoring']
    },
    {
      id: 'lexisnexis',
      name: 'LexisNexis',
      description: 'Advanced legal & regulatory intelligence (escalations only)',
      status: 'disconnected',
      lastSync: null,
      apiHealth: 'down',
      usageThisMonth: 0,
      costPerCheck: 45.0,
      optional: true,
      category: 'legal',
      logo: '⚖️',
      capabilities: ['Legal Intelligence', 'Regulatory Data', 'Public Records', 'Litigation Search']
    },
    {
      id: 'chainalysis',
      name: 'Chainalysis',
      description: 'Crypto wallet risk & blockchain intelligence (crypto only)',
      status: 'connected',
      lastSync: new Date('2026-03-20T16:20:00'),
      apiHealth: 'degraded',
      usageThisMonth: 12,
      costPerCheck: 25.0,
      optional: true,
      category: 'crypto',
      logo: '₿',
      capabilities: ['Wallet Risk Score', 'Flagged Activity', 'Transaction Tracing', 'Sanctions Match']
    }
  ];

  const getStatusBadge = (status: ProviderStatus) => {
    switch (status) {
      case 'connected':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-300">
            <WifiOff className="w-3 h-3 mr-1" />
            Disconnected
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-300">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getHealthIndicator = (health: 'healthy' | 'degraded' | 'down') => {
    switch (health) {
      case 'healthy':
        return (
          <div className="flex items-center gap-1 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold">Healthy</span>
          </div>
        );
      case 'degraded':
        return (
          <div className="flex items-center gap-1 text-amber-600">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-xs font-semibold">Degraded</span>
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center gap-1 text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs font-semibold">Down</span>
          </div>
        );
    }
  };

  const totalCost = providers.reduce((sum, p) => sum + (p.usageThisMonth * p.costPerCheck), 0);
  const totalUsage = providers.reduce((sum, p) => sum + p.usageThisMonth, 0);
  const connectedCount = providers.filter(p => p.status === 'connected').length;

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-2 border-blue-300 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-blue-700 font-semibold">Total Providers</p>
                <p className="text-4xl font-bold text-blue-900">{providers.length}</p>
              </div>
              <Database className="w-12 h-12 text-blue-600" />
            </div>
            <p className="text-xs text-blue-600">
              {providers.filter(p => !p.optional).length} core + {providers.filter(p => p.optional).length} optional
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-300 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-green-700 font-semibold">Connected</p>
                <p className="text-4xl font-bold text-green-900">{connectedCount}</p>
              </div>
              <Wifi className="w-12 h-12 text-green-600" />
            </div>
            <p className="text-xs text-green-600">
              {((connectedCount / providers.length) * 100).toFixed(0)}% uptime
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-300 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-purple-700 font-semibold">Usage (30d)</p>
                <p className="text-4xl font-bold text-purple-900">{totalUsage.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-purple-600" />
            </div>
            <p className="text-xs text-purple-600">API calls this month</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-300 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-amber-700 font-semibold">Est. Cost</p>
                <p className="text-4xl font-bold text-amber-900">${totalCost.toFixed(0)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-amber-600" />
            </div>
            <p className="text-xs text-amber-600">
              <button
                onClick={() => setShowCosts(!showCosts)}
                className="text-amber-700 underline hover:text-amber-800"
              >
                {showCosts ? 'Hide' : 'Show'} breakdown
              </button>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Core Providers */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-7 h-7 text-blue-600" />
          Core Providers
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {providers.filter(p => !p.optional).map((provider) => (
            <Card key={provider.id} className="border-2 border-gray-200 hover:border-blue-400 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                      {provider.logo}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      <CardDescription className="text-sm">{provider.description}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(provider.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status Row */}
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">API Health</p>
                    {getHealthIndicator(provider.apiHealth)}
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Last Sync</p>
                    <p className="text-gray-900 font-semibold text-xs">
                      {provider.lastSync
                        ? new Date(provider.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Never'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Usage (30d)</p>
                    <p className="text-gray-900 font-semibold text-xs">{provider.usageThisMonth} calls</p>
                  </div>
                </div>

                {/* Cost (if enabled) */}
                {showCosts && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-amber-900 font-semibold">Monthly Cost:</span>
                      <span className="text-lg font-bold text-amber-900">
                        ${(provider.usageThisMonth * provider.costPerCheck).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-amber-700 mt-1">
                      ${provider.costPerCheck.toFixed(2)} per check × {provider.usageThisMonth} calls
                    </p>
                  </div>
                )}

                {/* Capabilities */}
                <div>
                  <p className="text-xs text-gray-600 mb-2 font-semibold">Capabilities:</p>
                  <div className="flex flex-wrap gap-1">
                    {provider.capabilities.map((cap, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                        {cap}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedProvider(provider);
                      setActiveView('config');
                    }}
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-1" />
                    Logs
                  </Button>
                  <Button size="sm" variant="outline">
                    <PlayCircle className="w-4 h-4 mr-1" />
                    Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Optional Providers */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-purple-600" />
          Optional Providers
          <Badge className="bg-purple-100 text-purple-700 border-purple-300">
            Trigger-based
          </Badge>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {providers.filter(p => p.optional).map((provider) => (
            <Card
              key={provider.id}
              className={`border-2 ${
                provider.status === 'connected'
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                      {provider.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <Badge className="bg-purple-100 text-purple-700 text-xs">Optional</Badge>
                      </div>
                      <CardDescription className="text-sm">{provider.description}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(provider.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Trigger Info */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-semibold text-blue-900 mb-2">🎯 Trigger Conditions:</p>
                  {provider.id === 'lexisnexis' && (
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Illion shows legal risk</li>
                      <li>• Adverse media severity high</li>
                      <li>• Deal value exceeds threshold</li>
                      <li>• Manual escalation required</li>
                    </ul>
                  )}
                  {provider.id === 'chainalysis' && (
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Cryptocurrency detected in SOF</li>
                      <li>• Wallet address provided</li>
                      <li>• Digital asset transaction flagged</li>
                    </ul>
                  )}
                </div>

                {/* Status Row */}
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">API Health</p>
                    {getHealthIndicator(provider.apiHealth)}
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Last Used</p>
                    <p className="text-gray-900 font-semibold text-xs">
                      {provider.lastSync
                        ? new Date(provider.lastSync).toLocaleDateString()
                        : 'Never'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Usage (30d)</p>
                    <p className="text-gray-900 font-semibold text-xs">{provider.usageThisMonth} calls</p>
                  </div>
                </div>

                {/* Cost (if enabled) */}
                {showCosts && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-amber-900 font-semibold">Monthly Cost:</span>
                      <span className="text-lg font-bold text-amber-900">
                        ${(provider.usageThisMonth * provider.costPerCheck).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-amber-700 mt-1">
                      ${provider.costPerCheck.toFixed(2)} per check × {provider.usageThisMonth} calls
                    </p>
                  </div>
                )}

                {/* Capabilities */}
                <div>
                  <p className="text-xs text-gray-600 mb-2 font-semibold">Capabilities:</p>
                  <div className="flex flex-wrap gap-1">
                    {provider.capabilities.map((cap, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                        {cap}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  {provider.status === 'disconnected' ? (
                    <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                      <Wifi className="w-4 h-4 mr-1" />
                      Connect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedProvider(provider);
                        setActiveView('config');
                      }}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Configure
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-1" />
                    Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Integration Health Monitor */}
      <Card className="border-2 border-blue-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            System Health Monitor
          </CardTitle>
          <CardDescription>Real-time status of all integration endpoints</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {providers.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{provider.logo}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{provider.name}</p>
                    <p className="text-xs text-gray-600">{provider.category.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {getHealthIndicator(provider.apiHealth)}
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Response Time</p>
                    <p className="text-sm font-bold text-gray-900">
                      {provider.status === 'connected' ? `${Math.floor(Math.random() * 500) + 100}ms` : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Success Rate</p>
                    <p className="text-sm font-bold text-green-600">
                      {provider.status === 'connected' ? `${Math.floor(Math.random() * 5) + 95}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConfig = () => {
    if (!selectedProvider) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setActiveView('dashboard')}>
            ← Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-4xl shadow-lg">
              {selectedProvider.logo}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{selectedProvider.name}</h2>
              <p className="text-gray-600">{selectedProvider.description}</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Configure API credentials and settings</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* API Credentials */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                API Credentials
              </h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">API Key</label>
                  <input
                    type="password"
                    placeholder="••••••••••••••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="sk_live_xxxxxxxxxxxxxxxx"
                  />
                </div>
                {selectedProvider.id !== 'asic' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Base URL</label>
                    <input
                      type="text"
                      placeholder="https://api.provider.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={`https://api.${selectedProvider.id}.com`}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Environment</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="live">Live / Production</option>
                    <option value="sandbox">Sandbox / Testing</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Provider-Specific Options */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Options & Features
              </h3>

              {selectedProvider.id === 'complyadvantage' && (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-gray-900">Enable Sanctions Screening</p>
                      <p className="text-xs text-gray-600">DFAT, UN, OFAC, EU sanctions lists</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-gray-900">Enable PEP Screening</p>
                      <p className="text-xs text-gray-600">Politically Exposed Persons detection</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-gray-900">Enable Adverse Media</p>
                      <p className="text-xs text-gray-600">Negative news and media monitoring</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-gray-900">Enable Live Monitoring</p>
                      <p className="text-xs text-gray-600">Continuous screening for changes</p>
                    </div>
                  </label>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Match Threshold</label>
                    <input type="range" min="50" max="100" defaultValue="85" className="w-full" />
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>Low (50%)</span>
                      <span className="font-bold text-blue-600">85% - Recommended</span>
                      <span>Exact (100%)</span>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-blue-900">Enable Fuzzy Matching</p>
                      <p className="text-xs text-blue-700">Match similar names and aliases</p>
                    </div>
                  </label>
                </div>
              )}

              {selectedProvider.id === 'equifax' && (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-gray-900">Consumer Credit Reports</p>
                      <p className="text-xs text-gray-600">Full credit history and scoring</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-gray-900">Identity Signals</p>
                      <p className="text-xs text-gray-600">Real-time identity verification</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-gray-900">Fraud Detection</p>
                      <p className="text-xs text-gray-600">Real-time fraud alerts</p>
                    </div>
                  </label>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Region</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option value="au">Australia</option>
                      <option value="nz">New Zealand</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedProvider.id === 'illion' && (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-gray-900">Business Credit Reports</p>
                      <p className="text-xs text-gray-600">Commercial credit scoring</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-gray-900">Insolvency Check</p>
                      <p className="text-xs text-gray-600">Bankruptcy and liquidation data</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-gray-900">Court Data</p>
                      <p className="text-xs text-gray-600">Legal judgments and proceedings</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-gray-900">Director Risk Analysis</p>
                      <p className="text-xs text-gray-600">Individual director risk profiling</p>
                    </div>
                  </label>
                </div>
              )}

              {selectedProvider.id === 'asic' && (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-gray-900">Company Extract</p>
                      <p className="text-xs text-gray-600">Full company details from ASIC</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-gray-900">Director Extract</p>
                      <p className="text-xs text-gray-600">Director details and history</p>
                    </div>
                  </label>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Refresh Frequency</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="manual">Manual Only</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedProvider.id === 'lexisnexis' && (
                <div className="space-y-3">
                  <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
                    <p className="font-bold text-purple-900 mb-2">⚡ Trigger-Based Activation</p>
                    <p className="text-sm text-purple-800">
                      This provider only activates when escalation conditions are met
                    </p>
                  </div>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-gray-900">Enable for High-Risk Cases Only</p>
                      <p className="text-xs text-gray-600">Trigger when risk tier = High or Critical</p>
                    </div>
                  </label>
                </div>
              )}

              {selectedProvider.id === 'chainalysis' && (
                <div className="space-y-3">
                  <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
                    <p className="font-bold text-purple-900 mb-2">₿ Crypto Detection Only</p>
                    <p className="text-sm text-purple-800">
                      This provider only activates when cryptocurrency is detected in Source of Funds
                    </p>
                  </div>
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <div>
                      <p className="font-semibold text-gray-900">Auto-trigger on Crypto SOF</p>
                      <p className="text-xs text-gray-600">Run check when wallet address detected</p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Configuration
              </Button>
              <Button variant="outline" className="flex-1">
                <PlayCircle className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Database className="w-8 h-8 text-white" />
                </div>
                Integrations Hub
              </h1>
              <p className="text-lg text-gray-600">
                Six different data providers — one intelligent system
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync All
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                View Audit Log
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'config' && renderConfig()}
      </div>
    </div>
  );
}

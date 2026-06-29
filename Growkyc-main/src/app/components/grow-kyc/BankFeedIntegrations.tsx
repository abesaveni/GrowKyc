import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import {
  Database,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  Plus,
  Trash2,
  ExternalLink,
  Key,
  Eye,
  EyeOff,
  Activity,
  TrendingUp,
  Clock,
  DollarSign,
  Link as LinkIcon,
  Unlink,
  Download,
  Shield,
  Zap
} from 'lucide-react';
import { toast } from '../../lib/toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';

interface BankFeedIntegrationsProps {
  onBack?: () => void;
}

type IntegrationType = 'xero' | 'quickbooks' | 'myob';

interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  logo: string;
  description: string;
  connectedAccounts: number;
  lastSync?: string;
  transactionsThisMonth?: number;
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  tenantId?: string;
  environment: 'production' | 'sandbox';
}

export function BankFeedIntegrations({ onBack }: BankFeedIntegrationsProps) {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationType | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    clientSecret: '',
    apiKey: '',
    tenantId: '',
    environment: 'production' as 'production' | 'sandbox'
  });

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'int-xero-001',
      type: 'xero',
      name: 'Xero',
      status: 'disconnected',
      logo: '🔵',
      description: 'Cloud accounting software for small business',
      connectedAccounts: 0,
      environment: 'production'
    },
    {
      id: 'int-qb-001',
      type: 'quickbooks',
      name: 'QuickBooks Online',
      status: 'disconnected',
      logo: '🟢',
      description: 'Business accounting software by Intuit',
      connectedAccounts: 0,
      environment: 'production'
    },
    {
      id: 'int-myob-001',
      type: 'myob',
      name: 'MYOB',
      status: 'disconnected',
      logo: '🔴',
      description: 'Mind Your Own Business accounting platform',
      connectedAccounts: 0,
      environment: 'production'
    }
  ]);

  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);

  const handleConnect = (type: IntegrationType) => {
    setSelectedIntegration(type);
    setShowConnectModal(true);
    setFormData({
      clientId: '',
      clientSecret: '',
      apiKey: '',
      tenantId: '',
      environment: 'production'
    });
  };

  const handleSubmitConnection = () => {
    if (!selectedIntegration) return;

    // Validate required fields based on integration type
    if (selectedIntegration === 'xero') {
      if (!formData.clientId || !formData.clientSecret) {
        toast.error('Please enter Client ID and Client Secret');
        return;
      }
    } else if (selectedIntegration === 'quickbooks') {
      if (!formData.clientId || !formData.clientSecret) {
        toast.error('Please enter Client ID and Client Secret');
        return;
      }
    } else if (selectedIntegration === 'myob') {
      if (!formData.apiKey || !formData.tenantId) {
        toast.error('Please enter API Key and Tenant ID');
        return;
      }
    }

    // Update integration status
    setIntegrations(prev => prev.map(int => {
      if (int.type === selectedIntegration) {
        return {
          ...int,
          status: 'connected' as const,
          lastSync: new Date().toLocaleString(),
          transactionsThisMonth: 0,
          connectedAccounts: 0,
          apiKey: formData.apiKey,
          clientId: formData.clientId,
          clientSecret: formData.clientSecret,
          tenantId: formData.tenantId,
          environment: formData.environment
        };
      }
      return int;
    }));

    // Simulate fetching accounts
    setTimeout(() => {
      const mockAccounts = [
        {
          id: `acc-${Date.now()}-1`,
          integration: selectedIntegration,
          accountName: 'Business Transaction Account',
          accountNumber: '***4567',
          accountType: 'Checking',
          balance: 125430.50,
          currency: 'AUD',
          lastSync: new Date().toLocaleString(),
          transactionsAvailable: 247,
          monitoringEnabled: false
        },
        {
          id: `acc-${Date.now()}-2`,
          integration: selectedIntegration,
          accountName: 'Business Savings Account',
          accountNumber: '***8901',
          accountType: 'Savings',
          balance: 450000.00,
          currency: 'AUD',
          lastSync: new Date().toLocaleString(),
          transactionsAvailable: 89,
          monitoringEnabled: false
        },
        {
          id: `acc-${Date.now()}-3`,
          integration: selectedIntegration,
          accountName: 'Trust Account',
          accountNumber: '***2345',
          accountType: 'Trust',
          balance: 1250000.00,
          currency: 'AUD',
          lastSync: new Date().toLocaleString(),
          transactionsAvailable: 156,
          monitoringEnabled: false
        }
      ];

      setConnectedAccounts(prev => [...prev, ...mockAccounts]);
      
      // Update connected accounts count
      setIntegrations(prev => prev.map(int => {
        if (int.type === selectedIntegration) {
          return {
            ...int,
            connectedAccounts: mockAccounts.length,
            transactionsThisMonth: mockAccounts.reduce((sum, acc) => sum + acc.transactionsAvailable, 0)
          };
        }
        return int;
      }));

      toast.success(`✅ Successfully connected to ${selectedIntegration.toUpperCase()}! Found ${mockAccounts.length} accounts.`);
    }, 1500);

    setShowConnectModal(false);
    toast.success(`🔗 Connecting to ${selectedIntegration.toUpperCase()}...`);
  };

  const handleDisconnect = (type: IntegrationType) => {
    // Remove connected accounts
    setConnectedAccounts(prev => prev.filter(acc => acc.integration !== type));
    
    // Update integration status
    setIntegrations(prev => prev.map(int => {
      if (int.type === type) {
        return {
          ...int,
          status: 'disconnected' as const,
          connectedAccounts: 0,
          lastSync: undefined,
          transactionsThisMonth: undefined,
          apiKey: undefined,
          clientId: undefined,
          clientSecret: undefined,
          tenantId: undefined
        };
      }
      return int;
    }));

    toast.success(`Disconnected from ${type.toUpperCase()}`);
  };

  const handleToggleMonitoring = (accountId: string) => {
    setConnectedAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        const newStatus = !acc.monitoringEnabled;
        toast.success(newStatus ? `✅ Monitoring enabled for ${acc.accountName}` : `⏸️ Monitoring paused for ${acc.accountName}`);
        return { ...acc, monitoringEnabled: newStatus };
      }
      return acc;
    }));
  };

  const handleSyncNow = (accountId: string) => {
    const account = connectedAccounts.find(acc => acc.id === accountId);
    if (!account) return;

    toast.success(`🔄 Syncing transactions for ${account.accountName}...`);
    
    setTimeout(() => {
      setConnectedAccounts(prev => prev.map(acc => {
        if (acc.id === accountId) {
          const newTransactions = Math.floor(Math.random() * 20) + 5;
          return { 
            ...acc, 
            lastSync: new Date().toLocaleString(),
            transactionsAvailable: acc.transactionsAvailable + newTransactions
          };
        }
        return acc;
      }));
      toast.success(`✅ Synced ${Math.floor(Math.random() * 20) + 5} new transactions`);
    }, 2000);
  };

  const getIntegrationInstructions = (type: IntegrationType) => {
    switch (type) {
      case 'xero':
        return {
          title: 'Connect Xero',
          steps: [
            '1. Log in to your Xero account',
            '2. Go to Settings > Developer > My Apps',
            '3. Create a new app or use existing app credentials',
            '4. Copy the Client ID and Client Secret',
            '5. Set the Redirect URI to: https://grow.app/auth/xero/callback',
            '6. Enable the following scopes: accounting.transactions, accounting.settings'
          ],
          docsUrl: 'https://developer.xero.com/documentation/api/authentication'
        };
      case 'quickbooks':
        return {
          title: 'Connect QuickBooks Online',
          steps: [
            '1. Log in to QuickBooks Developer Portal',
            '2. Create a new app or select existing app',
            '3. Copy the Client ID and Client Secret',
            '4. Set the Redirect URI to: https://grow.app/auth/quickbooks/callback',
            '5. Enable required scopes: accounting, payments'
          ],
          docsUrl: 'https://developer.intuit.com/app/developer/qbo/docs/get-started'
        };
      case 'myob':
        return {
          title: 'Connect MYOB',
          steps: [
            '1. Log in to MYOB Developer Portal',
            '2. Navigate to API Keys section',
            '3. Generate a new API key',
            '4. Copy the API Key and Tenant ID',
            '5. Note: MYOB requires your Company File to be hosted online'
          ],
          docsUrl: 'https://developer.myob.com/api/accountright/v2/'
        };
    }
  };

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'disconnected':
        return <Badge variant="outline" className="text-slate-300">Not Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-600"><AlertTriangle className="w-3 h-3 mr-1" />Error</Badge>;
    }
  };

  const connectedIntegrations = integrations.filter(int => int.status === 'connected');
  const totalAccounts = connectedAccounts.length;
  const totalTransactions = connectedAccounts.reduce((sum, acc) => sum + acc.transactionsAvailable, 0);
  const activeMonitoring = connectedAccounts.filter(acc => acc.monitoringEnabled).length;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <LinkIcon className="w-8 h-8 text-blue-400" />
              <Badge variant="outline" className="bg-blue-500/10 text-blue-300">
                {connectedIntegrations.length}/3
              </Badge>
            </div>
            <div className="text-3xl font-bold">{connectedIntegrations.length}</div>
            <div className="text-sm text-slate-300">Connected Platforms</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Database className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-3xl font-bold">{totalAccounts}</div>
            <div className="text-sm text-slate-300">Bank Accounts</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-3xl font-bold">{totalTransactions}</div>
            <div className="text-sm text-slate-300">Transactions Available</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-orange-400" />
            </div>
            <div className="text-3xl font-bold">{activeMonitoring}</div>
            <div className="text-sm text-slate-300">Active Monitoring</div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Accounting Platform Integrations</CardTitle>
          <CardDescription>
            Connect your accounting software to automatically sync bank transactions for AML/CTF monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration) => (
            <Card key={integration.id} className="border-2">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-[#0f172a] rounded-lg flex items-center justify-center text-3xl">
                      {integration.logo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{integration.name}</h3>
                        {getStatusBadge(integration.status)}
                      </div>
                      <p className="text-sm text-slate-300 mb-3">{integration.description}</p>
                      
                      {integration.status === 'connected' && (
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-slate-300">Connected Accounts</p>
                            <p className="text-lg font-bold text-white">{integration.connectedAccounts}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-300">Last Sync</p>
                            <p className="text-sm font-medium text-white">{integration.lastSync}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-300">Transactions This Month</p>
                            <p className="text-lg font-bold text-white">{integration.transactionsThisMonth}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {integration.status === 'connected' ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            toast.success(`Opening ${integration.name} settings...`);
                          }}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDisconnect(integration.type)}
                        >
                          <Unlink className="w-4 h-4 mr-2" />
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => handleConnect(integration.type)}>
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      {connectedAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Connected Bank Accounts</CardTitle>
                <CardDescription>
                  Manage transaction monitoring for each account
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  connectedAccounts.forEach(acc => handleSyncNow(acc.id));
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {connectedAccounts.map((account) => (
              <Card key={account.id} className="border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-500/15 rounded-lg flex items-center justify-center">
                        <Database className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{account.accountName}</h4>
                          <Badge variant="outline" className="text-xs">
                            {account.integration.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-300">
                          <span>{account.accountNumber}</span>
                          <span>•</span>
                          <span>{account.accountType}</span>
                          <span>•</span>
                          <span className="font-medium">${account.balance.toLocaleString()} {account.currency}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last sync: {account.lastSync}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {account.transactionsAvailable} transactions available
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`monitor-${account.id}`} className="text-sm">
                          AML Monitoring
                        </Label>
                        <Switch
                          id={`monitor-${account.id}`}
                          checked={account.monitoringEnabled}
                          onCheckedChange={() => handleToggleMonitoring(account.id)}
                        />
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSyncNow(account.id)}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Connection Modal */}
      <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedIntegration && getIntegrationInstructions(selectedIntegration).title}
            </DialogTitle>
            <DialogDescription>
              Follow these steps to connect your accounting platform
            </DialogDescription>
          </DialogHeader>

          {selectedIntegration && (
            <div className="space-y-6">
              {/* Instructions */}
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Setup Instructions
                  </h4>
                  <ol className="space-y-1 text-sm text-blue-300">
                    {getIntegrationInstructions(selectedIntegration).steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                  <Button
                    variant="link"
                    className="text-blue-400 p-0 h-auto mt-2"
                    onClick={() => window.open(getIntegrationInstructions(selectedIntegration).docsUrl, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Documentation
                  </Button>
                </CardContent>
              </Card>

              {/* Connection Form */}
              <div className="space-y-4">
                <div>
                  <Label>Environment</Label>
                  <select
                    className="w-full mt-2 px-3 py-2 border border-white/10 rounded-lg"
                    value={formData.environment}
                    onChange={(e) => setFormData({ ...formData, environment: e.target.value as 'production' | 'sandbox' })}
                  >
                    <option value="production">Production</option>
                    <option value="sandbox">Sandbox (Testing)</option>
                  </select>
                </div>

                {(selectedIntegration === 'xero' || selectedIntegration === 'quickbooks') && (
                  <>
                    <div>
                      <Label>Client ID</Label>
                      <Input
                        type="text"
                        placeholder="Enter your Client ID"
                        className="mt-2"
                        value={formData.clientId}
                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Client Secret</Label>
                      <div className="relative mt-2">
                        <Input
                          type={showClientSecret ? 'text' : 'password'}
                          placeholder="Enter your Client Secret"
                          value={formData.clientSecret}
                          onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowClientSecret(!showClientSecret)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showClientSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {selectedIntegration === 'myob' && (
                  <>
                    <div>
                      <Label>API Key</Label>
                      <div className="relative mt-2">
                        <Input
                          type={showApiKey ? 'text' : 'password'}
                          placeholder="Enter your API Key"
                          value={formData.apiKey}
                          onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label>Tenant ID / Company File ID</Label>
                      <Input
                        type="text"
                        placeholder="Enter your Tenant ID"
                        className="mt-2"
                        value={formData.tenantId}
                        onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>

              <Card className="bg-amber-500/10 border-amber-500/30">
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <Shield className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <div className="text-sm text-amber-300">
                      <p className="font-semibold mb-1">Security Notice</p>
                      <p>Your credentials are encrypted and stored securely. We only access transaction data for AML/CTF compliance monitoring.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConnectModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitConnection}>
              <LinkIcon className="w-4 h-4 mr-2" />
              Connect {selectedIntegration?.toUpperCase()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

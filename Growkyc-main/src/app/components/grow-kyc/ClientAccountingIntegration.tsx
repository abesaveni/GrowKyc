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
  Link as LinkIcon,
  X,
  Shield,
  Eye,
  EyeOff,
  Loader
} from 'lucide-react';
import { toast } from '../../lib/toast';

interface ClientAccountingIntegrationProps {
  clientId: string;
  clientName: string;
  onClose: () => void;
  onConnected: (connection: any) => void;
}

export function ClientAccountingIntegration({ 
  clientId, 
  clientName, 
  onClose, 
  onConnected 
}: ClientAccountingIntegrationProps) {
  const [step, setStep] = useState<'select' | 'connect' | 'accounts'>('select');
  const [selectedPlatform, setSelectedPlatform] = useState<'xero' | 'quickbooks' | 'myob' | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    clientId: '',
    clientSecret: '',
    apiKey: ''
  });
  const [availableAccounts, setAvailableAccounts] = useState<any[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  const platforms = [
    {
      id: 'xero' as const,
      name: 'Xero',
      icon: '🔵',
      description: 'Cloud accounting software',
      requiresOAuth: true
    },
    {
      id: 'quickbooks' as const,
      name: 'QuickBooks Online',
      icon: '🟢',
      description: 'Intuit business accounting',
      requiresOAuth: true
    },
    {
      id: 'myob' as const,
      name: 'MYOB',
      icon: '🔴',
      description: 'Australian accounting platform',
      requiresOAuth: false
    }
  ];

  const handleSelectPlatform = (platform: 'xero' | 'quickbooks' | 'myob') => {
    setSelectedPlatform(platform);
    setStep('connect');
  };

  const handleConnect = () => {
    if (!selectedPlatform) return;

    // Validate required fields
    if (selectedPlatform === 'myob') {
      if (!credentials.username || !credentials.password || !credentials.apiKey) {
        toast.error('Please fill in all required fields');
        return;
      }
    } else {
      if (!credentials.clientId || !credentials.clientSecret) {
        toast.error('Please fill in all required fields');
        return;
      }
    }

    setIsConnecting(true);
    toast.success(`🔗 Connecting to ${selectedPlatform.toUpperCase()}...`);

    // Simulate API connection
    setTimeout(() => {
      // Mock bank accounts returned from accounting software
      const mockAccounts = [
        {
          id: `acc-${Date.now()}-1`,
          accountName: 'Operating Account',
          accountNumber: '***4567',
          accountType: 'Bank',
          bankName: 'Commonwealth Bank',
          balance: 452300.50,
          currency: 'AUD',
          lastTransaction: '2026-03-03',
          transactionCount: 847,
          suspicious: 12
        },
        {
          id: `acc-${Date.now()}-2`,
          accountName: 'Payroll Account',
          accountNumber: '***8901',
          accountType: 'Bank',
          bankName: 'Westpac',
          balance: 125000.00,
          currency: 'AUD',
          lastTransaction: '2026-03-02',
          transactionCount: 234,
          suspicious: 0
        },
        {
          id: `acc-${Date.now()}-3`,
          accountName: 'Trust Account',
          accountNumber: '***2345',
          accountType: 'Trust',
          bankName: 'ANZ',
          balance: 2850000.00,
          currency: 'AUD',
          lastTransaction: '2026-03-03',
          transactionCount: 1567,
          suspicious: 45
        },
        {
          id: `acc-${Date.now()}-4`,
          accountName: 'Investment Account',
          accountNumber: '***6789',
          accountType: 'Investment',
          bankName: 'NAB',
          balance: 890500.00,
          currency: 'AUD',
          lastTransaction: '2026-02-28',
          transactionCount: 156,
          suspicious: 3
        }
      ];

      setAvailableAccounts(mockAccounts);
      setIsConnecting(false);
      setStep('accounts');
      toast.success(`✅ Successfully connected! Found ${mockAccounts.length} accounts.`);
    }, 2000);
  };

  const handleToggleAccount = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleStartMonitoring = () => {
    if (selectedAccounts.length === 0) {
      toast.error('Please select at least one account to monitor');
      return;
    }

    const selectedAccountsData = availableAccounts.filter(acc => 
      selectedAccounts.includes(acc.id)
    );

    const totalSuspicious = selectedAccountsData.reduce((sum, acc) => sum + acc.suspicious, 0);

    const connection = {
      platform: selectedPlatform,
      clientId,
      clientName,
      connectedAt: new Date().toLocaleString(),
      accounts: selectedAccountsData,
      monitoring: true
    };

    onConnected(connection);
    toast.success(
      `✅ Monitoring enabled for ${selectedAccounts.length} account(s). ` +
      `${totalSuspicious} flagged transactions will be saved for investigation.`,
      { duration: 5000 }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Connect Client Accounting Software
              </CardTitle>
              <CardDescription className="mt-1">
                For client: <span className="font-semibold">{clientName}</span>
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6">
          {/* STEP 1: SELECT PLATFORM */}
          {step === 'select' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Client-Specific Integration</p>
                    <p>Connect to this client's accounting software to monitor their bank transactions. Only flagged transactions will be saved for investigation.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-4">Select Accounting Platform</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <Card 
                      key={platform.id} 
                      className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-400"
                      onClick={() => handleSelectPlatform(platform.id)}
                    >
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-[#0f172a] rounded-lg flex items-center justify-center text-4xl mx-auto mb-3">
                            {platform.icon}
                          </div>
                          <h3 className="font-bold text-white mb-1">{platform.name}</h3>
                          <p className="text-sm text-slate-300 mb-3">{platform.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {platform.requiresOAuth ? 'OAuth 2.0' : 'API Key'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CONNECT */}
          {step === 'connect' && selectedPlatform && (
            <div className="space-y-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStep('select')}
                className="mb-2"
              >
                ← Back to platform selection
              </Button>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Connect to {platforms.find(p => p.id === selectedPlatform)?.name}
                </h3>
                <p className="text-sm text-slate-300">
                  Enter the client's accounting software credentials
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <Shield className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">Security & Privacy</p>
                    <p>Credentials are encrypted and stored securely. We only access transaction data for AML/CTF monitoring. Only transactions flagged as suspicious will be saved.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {selectedPlatform === 'myob' ? (
                  <>
                    <div>
                      <Label>Username / Email</Label>
                      <Input
                        type="text"
                        placeholder="Enter MYOB username"
                        className="mt-2"
                        value={credentials.username}
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <div className="relative mt-2">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter password"
                          value={credentials.password}
                          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label>API Key</Label>
                      <Input
                        type="text"
                        placeholder="Enter API Key"
                        className="mt-2"
                        value={credentials.apiKey}
                        onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label>Client ID</Label>
                      <Input
                        type="text"
                        placeholder="Enter Client ID from developer portal"
                        className="mt-2"
                        value={credentials.clientId}
                        onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Client Secret</Label>
                      <div className="relative mt-2">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter Client Secret"
                          value={credentials.clientSecret}
                          onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Connecting to {selectedPlatform.toUpperCase()}...
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Connect & Fetch Accounts
                  </>
                )}
              </Button>
            </div>
          )}

          {/* STEP 3: SELECT ACCOUNTS */}
          {step === 'accounts' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Select Bank Accounts to Monitor
                </h3>
                <p className="text-sm text-slate-300">
                  Found {availableAccounts.length} accounts. Select which accounts to monitor for suspicious transactions.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="text-sm text-green-800">
                    <p className="font-semibold">Connection Successful!</p>
                    <p>Select accounts below to enable AML transaction monitoring.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {availableAccounts.map((account) => {
                  const isSelected = selectedAccounts.includes(account.id);
                  
                  return (
                    <Card 
                      key={account.id} 
                      className={`border-2 transition-all ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-white/10'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Database className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-white">{account.accountName}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {account.accountType}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-300 mb-2">
                                <div>
                                  <span className="text-xs">Bank:</span> {account.bankName}
                                </div>
                                <div>
                                  <span className="text-xs">Number:</span> {account.accountNumber}
                                </div>
                                <div>
                                  <span className="text-xs">Balance:</span> ${account.balance.toLocaleString()} {account.currency}
                                </div>
                                <div>
                                  <span className="text-xs">Last Transaction:</span> {account.lastTransaction}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Database className="w-3 h-3 text-slate-400" />
                                  <span className="text-slate-300">{account.transactionCount} transactions</span>
                                </div>
                                {account.suspicious > 0 && (
                                  <div className="flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3 text-red-500" />
                                    <span className="text-red-600 font-semibold">{account.suspicious} flagged</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 ml-4">
                            <div className="text-right">
                              <Label htmlFor={`account-${account.id}`} className="text-sm cursor-pointer">
                                Monitor
                              </Label>
                              <Switch
                                id={`account-${account.id}`}
                                checked={isSelected}
                                onCheckedChange={() => handleToggleAccount(account.id)}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {selectedAccounts.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-blue-900">
                          {selectedAccounts.length} account(s) selected for monitoring
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Total flagged transactions: {availableAccounts
                            .filter(acc => selectedAccounts.includes(acc.id))
                            .reduce((sum, acc) => sum + acc.suspicious, 0)}
                        </p>
                        <p className="text-xs text-blue-600 mt-2">
                          Only transactions flagged as suspicious will be saved to the system for investigation.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>

        <div className="border-t p-4 bg-[#0f172a] flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {step === 'accounts' && (
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleStartMonitoring}
              disabled={selectedAccounts.length === 0}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Start Monitoring ({selectedAccounts.length} accounts)
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

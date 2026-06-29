import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
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
  Search,
  Filter,
  AlertCircle,
  FileText,
  TrendingUp,
  Settings,
  Zap,
  Lock,
  RefreshCw,
  Download,
  ExternalLink,
  Play,
  Pause,
  BarChart3,
  Users,
  Building,
  FileCheck,
  Network,
  Bell,
  GitBranch,
  CheckSquare,
  XOctagon,
  Timer,
  Upload,
  Key,
  Webhook,
  Code,
  Terminal,
  Layers
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import { toast } from '../../lib/toast';

type IntegrationView = 
  | 'overview'
  | 'trulioo'
  | 'trulioo_config'
  | 'trulioo_verify'
  | 'trulioo_business'
  | 'trulioo_screening'
  | 'trulioo_monitoring'
  | 'infotrack'
  | 'infotrack_config'
  | 'infotrack_order'
  | 'infotrack_report'
  | 'infotrack_director_graph'
  | 'api_activity'
  | 'monitoring_feeds'
  | 'error_management'
  | 'data_normalization'
  | 'evidence_vault'
  | 'provider_sla';

type UserRole = 'super_admin' | 'compliance_officer' | 'senior_manager' | 'client_staff' | 'internal_auditor' | 'tenant_admin';

interface IntegrationsModuleProps {
  onBack: () => void;
  userRole?: UserRole;
}

interface ProviderStatus {
  provider: string;
  status: 'live' | 'degraded' | 'down';
  uptime: number;
  avgResponseTime: number;
  errorRate: number;
  lastCheck: string;
}

interface VerificationResult {
  id: string;
  type: 'individual' | 'business';
  status: 'verified' | 'failed' | 'pending' | 'escalated';
  confidence: number;
  matchResults: {
    document: boolean;
    address: boolean;
    watchlist: boolean;
    pep: boolean;
    adverseMedia: boolean;
  };
  details: any;
  timestamp: string;
  client: string;
}

interface MonitoringAlert {
  id: string;
  source: 'trulioo' | 'infotrack';
  eventType: string;
  riskImpact: 'low' | 'medium' | 'high' | 'critical';
  linkedClient: string;
  status: 'new' | 'reviewing' | 'escalated' | 'resolved';
  slaTimer: number;
  assignedTo: string;
  autoRestrict: boolean;
  timestamp: string;
}

export function IntegrationsModule({ onBack, userRole = 'compliance_officer' }: IntegrationsModuleProps) {
  const [currentView, setCurrentView] = useState<IntegrationView>('overview');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<MonitoringAlert | null>(null);

  // Mock data
  const providerStatus: ProviderStatus[] = [
    {
      provider: 'Trulioo',
      status: 'live',
      uptime: 99.8,
      avgResponseTime: 1.2,
      errorRate: 0.2,
      lastCheck: '2 minutes ago'
    },
    {
      provider: 'InfoTrack',
      status: 'live',
      uptime: 99.5,
      avgResponseTime: 2.8,
      errorRate: 0.5,
      lastCheck: '1 minute ago'
    }
  ];

  const stats = {
    verificationsLast30Days: 2847,
    screeningsLast30Days: 1523,
    registrySearches: 892,
    activeMonitoring: 456,
    errorRate: 0.3,
    avgResponseTime: 1.8,
    failedRequests: 12
  };

  // ============================================================================
  // OVERVIEW DASHBOARD
  // ============================================================================
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Integrations Overview</h1>
        <p className="text-slate-300 mt-1">Real-time compliance data orchestration system</p>
      </div>

      {/* Provider Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providerStatus.map((provider) => (
          <Card key={provider.provider} className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {provider.provider}
                  {provider.status === 'live' && <Badge className="bg-green-500">Live</Badge>}
                  {provider.status === 'degraded' && <Badge className="bg-amber-500">Degraded</Badge>}
                  {provider.status === 'down' && <Badge className="bg-red-500">Down</Badge>}
                </CardTitle>
                <Activity className={`w-5 h-5 ${
                  provider.status === 'live' ? 'text-green-500' :
                  provider.status === 'degraded' ? 'text-amber-500' : 'text-red-500'
                }`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-300">Uptime</div>
                  <div className="text-2xl font-bold text-white">{provider.uptime}%</div>
                </div>
                <div>
                  <div className="text-sm text-slate-300">Avg Response</div>
                  <div className="text-2xl font-bold text-white">{provider.avgResponseTime}s</div>
                </div>
                <div>
                  <div className="text-sm text-slate-300">Error Rate</div>
                  <div className="text-2xl font-bold text-white">{provider.errorRate}%</div>
                </div>
                <div>
                  <div className="text-sm text-slate-300">Last Check</div>
                  <div className="text-sm font-medium text-white">{provider.lastCheck}</div>
                </div>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setCurrentView(provider.provider === 'Trulioo' ? 'trulioo' : 'infotrack')}
              >
                Configure {provider.provider}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-300">Verifications (30d)</div>
            <div className="text-3xl font-bold text-white mt-2">{stats.verificationsLast30Days.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
              <TrendingUp className="w-4 h-4" />
              <span>+12%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-300">Screenings (30d)</div>
            <div className="text-3xl font-bold text-white mt-2">{stats.screeningsLast30Days.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
              <TrendingUp className="w-4 h-4" />
              <span>+8%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-300">Registry Searches</div>
            <div className="text-3xl font-bold text-white mt-2">{stats.registrySearches.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-slate-300">Active Monitoring</div>
            <div className="text-3xl font-bold text-white mt-2">{stats.activeMonitoring.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => setCurrentView('trulioo_verify')} className="h-auto py-4 flex flex-col gap-2">
              <Users className="w-6 h-6" />
              <span>Verify Individual</span>
            </Button>
            <Button onClick={() => setCurrentView('trulioo_business')} className="h-auto py-4 flex flex-col gap-2" variant="outline">
              <Building className="w-6 h-6" />
              <span>Verify Business</span>
            </Button>
            <Button onClick={() => setCurrentView('infotrack_order')} className="h-auto py-4 flex flex-col gap-2" variant="outline">
              <FileCheck className="w-6 h-6" />
              <span>Order ASIC Search</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {stats.failedRequests > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Failed Requests Requiring Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">
              {stats.failedRequests} requests failed and require manual review
            </p>
            <Button onClick={() => setCurrentView('error_management')} variant="destructive">
              Review Failed Requests
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('api_activity')}>
          <CardContent className="p-6 flex items-center gap-4">
            <Terminal className="w-8 h-8 text-blue-600" />
            <div>
              <div className="font-semibold text-white">API Activity</div>
              <div className="text-sm text-slate-300">View all API interactions</div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('monitoring_feeds')}>
          <CardContent className="p-6 flex items-center gap-4">
            <Bell className="w-8 h-8 text-amber-600" />
            <div>
              <div className="font-semibold text-white">Monitoring Feeds</div>
              <div className="text-sm text-slate-300">Real-time alerts pipeline</div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('provider_sla')}>
          <CardContent className="p-6 flex items-center gap-4">
            <BarChart3 className="w-8 h-8 text-green-600" />
            <div>
              <div className="font-semibold text-white">Provider SLA</div>
              <div className="text-sm text-slate-300">Performance metrics</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // ============================================================================
  // TRULIOO MODULE
  // ============================================================================
  const renderTrulioo = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentView('overview')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white">Trulioo Integration</h1>
        <p className="text-slate-300 mt-1">Global identity verification, screening & monitoring</p>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="verify">Verify Individual</TabsTrigger>
          <TabsTrigger value="business">Verify Business</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="p-4 flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <strong>Security Notice:</strong> API keys are encrypted using AWS KMS. Keys are only visible to super administrators with MFA enabled.
              </div>
            </CardContent>
          </Card>

          {userRole === 'super_admin' ? (
            <Card>
              <CardHeader>
                <CardTitle>Connection Configuration</CardTitle>
                <CardDescription>Trulioo API credentials and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input id="apiKey" type="password" placeholder="••••••••••••••••" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Select defaultValue="production">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input id="webhookUrl" placeholder="https://your-domain.com/api/webhooks/trulioo" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookSecret">Webhook Secret</Label>
                  <Input id="webhookSecret" type="password" placeholder="••••••••••••••••" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="retryAttempts">Retry Attempts</Label>
                    <Input id="retryAttempts" type="number" defaultValue="3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Timeout Threshold (seconds)</Label>
                    <Input id="timeout" type="number" defaultValue="30" />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium">Tenant-Level Override</div>
                    <div className="text-sm text-slate-300">Allow tenants to use their own API keys</div>
                  </div>
                  <Switch />
                </div>

                <div className="pt-4">
                  <Button onClick={() => toast.success('Trulioo configuration saved')}>
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300">API configuration is restricted to super administrators</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Products Configuration</CardTitle>
              <CardDescription>Enable and configure Trulioo verification products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  id: 'individual_idv',
                  name: 'Individual Identity Verification',
                  cost: '$2.50 per check',
                  enabled: true
                },
                {
                  id: 'business_verification',
                  name: 'Business Verification',
                  cost: '$5.00 per check',
                  enabled: true
                },
                {
                  id: 'sanctions',
                  name: 'Sanctions Screening',
                  cost: '$1.00 per check',
                  enabled: true
                },
                {
                  id: 'pep',
                  name: 'PEP Screening',
                  cost: '$1.00 per check',
                  enabled: true
                },
                {
                  id: 'adverse_media',
                  name: 'Adverse Media',
                  cost: '$2.00 per check',
                  enabled: true
                },
                {
                  id: 'monitoring',
                  name: 'Ongoing Monitoring',
                  cost: '$10.00 per month',
                  enabled: true
                }
              ].map((product) => (
                <Card key={product.id} className={product.enabled ? 'border-green-300 bg-green-50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Switch defaultChecked={product.enabled} />
                          <div>
                            <div className="font-semibold text-white">{product.name}</div>
                            <div className="text-sm text-slate-300">{product.cost}</div>
                          </div>
                        </div>
                        {product.enabled && (
                          <div className="ml-12 mt-4 space-y-4">
                            <div>
                              <Label className="text-sm">Enabled Jurisdictions</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline">Australia</Badge>
                                <Badge variant="outline">New Zealand</Badge>
                                <Badge variant="outline">United States</Badge>
                                <Badge variant="outline">United Kingdom</Badge>
                                <Badge variant="outline">+15 more</Badge>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm">Confidence Threshold: 85%</Label>
                              <Slider defaultValue={[85]} max={100} step={5} className="mt-2" />
                            </div>
                            <div>
                              <Label className="text-sm">Fuzzy Match Tolerance: 70%</Label>
                              <Slider defaultValue={[70]} max={100} step={5} className="mt-2" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Auto-escalate on match</Label>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Auto-restrict on positive hit</Label>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verify Individual Tab */}
        <TabsContent value="verify" className="space-y-6">
          {renderIndividualVerification()}
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-6">
          {renderBusinessVerification()}
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          {renderMonitoringPanel()}
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderIndividualVerification = () => {
    const [step, setStep] = useState(1);
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = () => {
      setIsProcessing(true);
      setStep(3);
      
      // Simulate API call
      setTimeout(() => {
        setVerificationResult({
          id: 'VER-2024-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          type: 'individual',
          status: 'verified',
          confidence: 96,
          matchResults: {
            document: true,
            address: true,
            watchlist: false,
            pep: false,
            adverseMedia: false
          },
          details: {
            name: 'Sarah Johnson',
            dob: '1985-03-15',
            address: '123 Collins Street, Melbourne VIC 3000',
            documentType: 'Australian Driver License',
            documentNumber: 'VIC1234567'
          },
          timestamp: new Date().toISOString(),
          client: 'Sarah Johnson'
        });
        setIsProcessing(false);
        setStep(4);
      }, 3000);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Individual Identity Verification</CardTitle>
          <CardDescription>Verify individual identity using Trulioo GlobalGateway</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-slate-300'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Data Capture */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Step 1: Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="Sarah" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Johnson" />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input type="date" defaultValue="1985-03-15" />
                </div>
                <div className="space-y-2">
                  <Label>Nationality</Label>
                  <Select defaultValue="AU">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="NZ">New Zealand</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input placeholder="123 Collins Street" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input placeholder="Melbourne" />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input placeholder="VIC" />
                </div>
                <div className="space-y-2">
                  <Label>Postcode</Label>
                  <Input placeholder="3000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select defaultValue="drivers_license">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drivers_license">Driver License</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="national_id">National ID Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Document Number</Label>
                <Input placeholder="VIC1234567" />
              </div>

              <Button onClick={() => setStep(2)} className="w-full mt-6">
                Continue to Review
              </Button>
            </div>
          )}

          {/* Step 2: Submit */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Step 2: Review & Submit</h3>
              
              <Card className="bg-[#0a0e17]">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Request Payload Preview</h4>
                  <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-64">
{`{
  "AcceptTruliooTermsAndConditions": true,
  "DemoResult": "OfflineMode",
  "CountryCode": "AU",
  "DataFields": {
    "PersonInfo": {
      "FirstGivenName": "Sarah",
      "FirstSurName": "Johnson",
      "DayOfBirth": 15,
      "MonthOfBirth": 3,
      "YearOfBirth": 1985
    },
    "Location": {
      "BuildingNumber": "123",
      "StreetName": "Collins Street",
      "City": "Melbourne",
      "StateProvinceCode": "VIC",
      "PostalCode": "3000"
    },
    "NationalIds": [
      {
        "Type": "DriversLicence",
        "Number": "VIC1234567"
      }
    ]
  }
}`}
                  </pre>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  Submit Verification
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 3 && (
            <div className="text-center py-12">
              <RefreshCw className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold mb-2">Verification in Progress</h3>
              <p className="text-slate-300">Connecting to Trulioo GlobalGateway...</p>
              <Progress value={66} className="mt-6 max-w-md mx-auto" />
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && verificationResult && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white">Verification Complete</h3>
                <p className="text-slate-300">Identity verified successfully</p>
              </div>

              <Card className="border-green-300 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-slate-300">Verification ID</div>
                      <div className="font-mono font-semibold">{verificationResult.id}</div>
                    </div>
                    <Badge className="bg-green-600 text-lg px-4 py-2">
                      {verificationResult.confidence}% Confidence
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center gap-2">
                      {verificationResult.matchResults.document ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span>Document Validation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {verificationResult.matchResults.address ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span>Address Match</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!verificationResult.matchResults.watchlist ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                      <span>Watchlist Clear</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!verificationResult.matchResults.pep ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      )}
                      <span>PEP Clear</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!verificationResult.matchResults.adverseMedia ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                      )}
                      <span>Adverse Media Clear</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Evidence Package</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#0a0e17] rounded">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Verification Report</div>
                        <div className="text-sm text-slate-300">PDF • 234 KB</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#0a0e17] rounded">
                    <div className="flex items-center gap-3">
                      <Code className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">API Response (JSON)</div>
                        <div className="text-sm text-slate-300">JSON • 12 KB</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button variant="outline" className="flex-1">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Escalate
                </Button>
                <Button className="flex-1" onClick={() => toast.success('Verification accepted and added to client file')}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept
                </Button>
              </div>

              <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                Start New Verification
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderBusinessVerification = () => (
    <Card>
      <CardHeader>
        <CardTitle>Business Verification</CardTitle>
        <CardDescription>Verify business entity and ownership structure</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Company Name</Label>
          <Input placeholder="Example Pty Ltd" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>ACN / Company Number</Label>
            <Input placeholder="123 456 789" />
          </div>
          <div className="space-y-2">
            <Label>Jurisdiction</Label>
            <Select defaultValue="AU">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AU">Australia</SelectItem>
                <SelectItem value="NZ">New Zealand</SelectItem>
                <SelectItem value="US">United States</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="w-full">
          <Search className="w-4 h-4 mr-2" />
          Verify Business
        </Button>

        {/* Mock Results */}
        <Card className="border-green-300 bg-green-50 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Business Verified
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-slate-300">Company Name</div>
              <div className="font-semibold">EXAMPLE PTY LTD</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-300">ACN</div>
                <div className="font-semibold">123 456 789</div>
              </div>
              <div>
                <div className="text-sm text-slate-300">Status</div>
                <Badge className="bg-green-600">Registered</Badge>
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-300 mb-2">Directors</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-[#0d121d] rounded">
                  <div>
                    <div className="font-medium">John Smith</div>
                    <div className="text-sm text-slate-300">Appointed: 2020-01-15</div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-2 bg-[#0d121d] rounded">
                  <div>
                    <div className="font-medium">Jane Doe</div>
                    <div className="text-sm text-slate-300">Appointed: 2020-01-15</div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-[#0d121d] rounded">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>No watchlist hits detected</span>
            </div>

            <Button className="w-full" variant="outline">
              <Network className="w-4 h-4 mr-2" />
              Create Ownership Graph from Registry Data
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );

  const renderMonitoringPanel = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ongoing Monitoring</CardTitle>
          <CardDescription>Continuous screening for enrolled entities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-slate-300">Entities Enrolled</div>
                <div className="text-2xl font-bold text-white">456</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-slate-300">New Alerts (7d)</div>
                <div className="text-2xl font-bold text-amber-600">23</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-slate-300">Active Subscriptions</div>
                <div className="text-2xl font-bold text-white">456</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            {[
              {
                entity: 'Sarah Johnson',
                type: 'Individual',
                enrolled: '2023-06-15',
                lastScreen: '2024-03-01',
                frequency: 'Weekly',
                status: 'active',
                alerts: 0
              },
              {
                entity: 'Example Pty Ltd',
                type: 'Business',
                enrolled: '2023-08-22',
                lastScreen: '2024-02-28',
                frequency: 'Daily',
                status: 'active',
                alerts: 2
              }
            ].map((item, idx) => (
              <Card key={idx}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {item.type === 'Individual' ? (
                        <Users className="w-8 h-8 text-blue-600" />
                      ) : (
                        <Building className="w-8 h-8 text-purple-600" />
                      )}
                      <div>
                        <div className="font-semibold">{item.entity}</div>
                        <div className="text-sm text-slate-300">
                          {item.type} • Enrolled {item.enrolled} • {item.frequency}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {item.alerts > 0 && (
                        <Badge className="bg-amber-500">
                          {item.alerts} Alert{item.alerts > 1 ? 's' : ''}
                        </Badge>
                      )}
                      <Badge className="bg-green-500">{item.status}</Badge>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================================
  // INFOTRACK MODULE
  // ============================================================================
  const renderInfoTrack = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentView('overview')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white">InfoTrack Integration</h1>
        <p className="text-slate-300 mt-1">ASIC, Title, PPSR & Court Registry Searches</p>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Product Catalogue</TabsTrigger>
          <TabsTrigger value="order">Place Order</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        {/* Products Catalogue */}
        <TabsContent value="products" className="space-y-4">
          {[
            {
              id: 'asic_company',
              name: 'ASIC Company Extract',
              description: 'Current & historical company information',
              cost: '$15.00',
              turnaround: 'Instant',
              monitoring: true
            },
            {
              id: 'director_search',
              name: 'Director Search',
              description: 'Current and historical directorships',
              cost: '$25.00',
              turnaround: '1-2 hours',
              monitoring: true
            },
            {
              id: 'title_search',
              name: 'Title Search',
              description: 'Land title and ownership details',
              cost: '$35.00',
              turnaround: '2-4 hours',
              monitoring: false
            },
            {
              id: 'ppsr',
              name: 'PPSR Search',
              description: 'Personal Property Securities Register',
              cost: '$12.00',
              turnaround: 'Instant',
              monitoring: false
            },
            {
              id: 'court',
              name: 'Court / Insolvency Search',
              description: 'Court judgments and insolvency records',
              cost: '$45.00',
              turnaround: '24-48 hours',
              monitoring: true
            }
          ].map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-white mb-1">{product.name}</h3>
                    <p className="text-slate-300 text-sm mb-4">{product.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{product.turnaround}</span>
                      </div>
                      <div className="font-semibold text-blue-600">{product.cost}</div>
                      {product.monitoring && (
                        <Badge variant="outline" className="bg-blue-50">
                          <Bell className="w-3 h-3 mr-1" />
                          Monitoring Available
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button onClick={() => setCurrentView('infotrack_order')}>
                    Order Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Order Flow */}
        <TabsContent value="order">
          {renderInfoTrackOrder()}
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports">
          {renderInfoTrackReports()}
        </TabsContent>

        {/* Configuration */}
        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>InfoTrack Configuration</CardTitle>
              <CardDescription>API connection settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Card className="border-amber-300 bg-amber-50">
                <CardContent className="p-4 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <strong>Encryption Notice:</strong> All API credentials are encrypted at rest using AES-256 encryption.
                  </div>
                </CardContent>
              </Card>

              {userRole === 'super_admin' && (
                <>
                  <div className="space-y-2">
                    <Label>API Endpoint</Label>
                    <Input defaultValue="https://api.infotrack.com.au/v2" />
                  </div>

                  <div className="space-y-2">
                    <Label>Account ID</Label>
                    <Input placeholder="IT-123456" />
                  </div>

                  <div className="space-y-2">
                    <Label>Authentication Method</Label>
                    <Select defaultValue="oauth">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oauth">OAuth 2.0</SelectItem>
                        <SelectItem value="apikey">API Key</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Rate Limit (requests/minute)</Label>
                    <Input type="number" defaultValue="100" />
                  </div>

                  <div className="space-y-2">
                    <Label>Callback URL</Label>
                    <Input placeholder="https://your-domain.com/api/callbacks/infotrack" />
                  </div>

                  <Button>Save Configuration</Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderInfoTrackOrder = () => {
    const [orderStep, setOrderStep] = useState(1);

    return (
      <Card>
        <CardHeader>
          <CardTitle>Place InfoTrack Order</CardTitle>
          <CardDescription>Order registry searches and reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            {['Select Product', 'Entity Details', 'Consent', 'Submit', 'Complete'].map((label, idx) => (
              <div key={idx} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                  orderStep > idx ? 'bg-blue-600 text-white' : 'bg-gray-200 text-slate-300'
                }`}>
                  {idx + 1}
                </div>
                {idx < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${orderStep > idx + 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {orderStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Select Product</h3>
              <Select defaultValue="asic_company">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asic_company">ASIC Company Extract - $15.00</SelectItem>
                  <SelectItem value="director_search">Director Search - $25.00</SelectItem>
                  <SelectItem value="title_search">Title Search - $35.00</SelectItem>
                  <SelectItem value="ppsr">PPSR Search - $12.00</SelectItem>
                  <SelectItem value="court">Court / Insolvency Search - $45.00</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setOrderStep(2)} className="w-full">Continue</Button>
            </div>
          )}

          {orderStep === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Entity Details</h3>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input placeholder="Example Pty Ltd" />
              </div>
              <div className="space-y-2">
                <Label>ACN</Label>
                <Input placeholder="123 456 789" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setOrderStep(1)}>Back</Button>
                <Button onClick={() => setOrderStep(3)} className="flex-1">Continue</Button>
              </div>
            </div>
          )}

          {orderStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Consent Confirmation</h3>
              <Card className="border-blue-300 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold mb-2">Client Consent Verified</p>
                      <p className="text-slate-300">
                        The client has provided informed consent for this registry search as documented in the engagement letter dated 2024-02-15.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setOrderStep(2)}>Back</Button>
                <Button onClick={() => setOrderStep(4)} className="flex-1">Submit Order</Button>
              </div>
            </div>
          )}

          {orderStep === 4 && (
            <div className="text-center py-8">
              <RefreshCw className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold mb-2">Processing Order</h3>
              <p className="text-slate-300">Submitting to InfoTrack...</p>
              <Button onClick={() => setOrderStep(5)} className="mt-6">
                Simulate Completion
              </Button>
            </div>
          )}

          {orderStep === 5 && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold">Order Complete</h3>
                <p className="text-slate-300">Report is ready for review</p>
              </div>
              <Button onClick={() => setCurrentView('infotrack_report')} className="w-full">
                View Report
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderInfoTrackReports = () => (
    <div className="space-y-4">
      {[
        {
          id: 'RPT-2024-001',
          type: 'ASIC Company Extract',
          entity: 'Example Pty Ltd',
          acn: '123 456 789',
          status: 'complete',
          ordered: '2024-03-01 10:30',
          completed: '2024-03-01 10:31',
          cost: '$15.00'
        },
        {
          id: 'RPT-2024-002',
          type: 'Director Search',
          entity: 'John Smith',
          acn: null,
          status: 'complete',
          ordered: '2024-02-28 14:15',
          completed: '2024-02-28 16:22',
          cost: '$25.00'
        },
        {
          id: 'RPT-2024-003',
          type: 'Court Search',
          entity: 'Example Pty Ltd',
          acn: '123 456 789',
          status: 'pending',
          ordered: '2024-03-01 09:00',
          completed: null,
          cost: '$45.00'
        }
      ].map((report) => (
        <Card key={report.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileCheck className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="font-semibold">{report.type}</div>
                  <div className="text-sm text-slate-300">
                    {report.entity} {report.acn && `• ACN ${report.acn}`}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Ordered: {report.ordered} {report.completed && `• Completed: ${report.completed}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right mr-4">
                  <div className="font-semibold">{report.cost}</div>
                  {report.status === 'complete' ? (
                    <Badge className="bg-green-500">Complete</Badge>
                  ) : (
                    <Badge className="bg-amber-500">Pending</Badge>
                  )}
                </div>
                {report.status === 'complete' && (
                  <Button size="sm" onClick={() => setCurrentView('infotrack_report')}>
                    View Report
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // ============================================================================
  // API ACTIVITY LOG
  // ============================================================================
  const renderAPIActivity = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">API Activity Log</h1>
          <p className="text-slate-300 mt-1">Complete audit trail of all API interactions</p>
        </div>
        <Button variant="outline" onClick={() => setCurrentView('overview')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-5 gap-4">
            <Input placeholder="Search request ID..." />
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="trulioo">Trulioo</SelectItem>
                <SelectItem value="infotrack">InfoTrack</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="timeout">Timeout</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" defaultValue="2024-03-01" />
            <Button>
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0a0e17] border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-white">Timestamp</th>
                  <th className="text-left p-4 text-sm font-semibold text-white">Provider</th>
                  <th className="text-left p-4 text-sm font-semibold text-white">Product</th>
                  <th className="text-left p-4 text-sm font-semibold text-white">Request ID</th>
                  <th className="text-left p-4 text-sm font-semibold text-white">Client</th>
                  <th className="text-left p-4 text-sm font-semibold text-white">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-white">Duration</th>
                  <th className="text-left p-4 text-sm font-semibold text-white">User</th>
                  <th className="text-left p-4 text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  {
                    timestamp: '2024-03-01 10:30:45',
                    provider: 'Trulioo',
                    product: 'Individual IDV',
                    requestId: 'TRU-2024-ABC123',
                    client: 'Sarah Johnson',
                    status: 'success',
                    duration: '1.2s',
                    user: 'john.smith@company.com',
                    retries: 0
                  },
                  {
                    timestamp: '2024-03-01 10:28:12',
                    provider: 'InfoTrack',
                    product: 'ASIC Extract',
                    requestId: 'IT-2024-XYZ789',
                    client: 'Example Pty Ltd',
                    status: 'success',
                    duration: '0.8s',
                    user: 'jane.doe@company.com',
                    retries: 0
                  },
                  {
                    timestamp: '2024-03-01 10:25:33',
                    provider: 'Trulioo',
                    product: 'Sanctions Screen',
                    requestId: 'TRU-2024-DEF456',
                    client: 'Michael Brown',
                    status: 'error',
                    duration: '30.0s',
                    user: 'john.smith@company.com',
                    retries: 3
                  }
                ].map((log, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="p-4 text-sm text-white">{log.timestamp}</td>
                    <td className="p-4">
                      <Badge variant="outline">{log.provider}</Badge>
                    </td>
                    <td className="p-4 text-sm text-white">{log.product}</td>
                    <td className="p-4 text-sm font-mono text-slate-300">{log.requestId}</td>
                    <td className="p-4 text-sm text-white">{log.client}</td>
                    <td className="p-4">
                      {log.status === 'success' ? (
                        <Badge className="bg-green-500">Success</Badge>
                      ) : (
                        <Badge className="bg-red-500">Error</Badge>
                      )}
                    </td>
                    <td className="p-4 text-sm text-white">{log.duration}</td>
                    <td className="p-4 text-sm text-slate-300">{log.user}</td>
                    <td className="p-4">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============================================================================
  // MONITORING FEEDS
  // ============================================================================
  const renderMonitoringFeeds = () => {
    const mockAlerts: MonitoringAlert[] = [
      {
        id: 'ALT-2024-001',
        source: 'trulioo',
        eventType: 'Adverse Media Hit - High Severity',
        riskImpact: 'critical',
        linkedClient: 'Michael Brown',
        status: 'new',
        slaTimer: 4,
        assignedTo: 'Compliance Team',
        autoRestrict: true,
        timestamp: '2024-03-01 10:45'
      },
      {
        id: 'ALT-2024-002',
        source: 'infotrack',
        eventType: 'Director Change Detected',
        riskImpact: 'medium',
        linkedClient: 'Example Pty Ltd',
        status: 'reviewing',
        slaTimer: 12,
        assignedTo: 'Sarah Johnson',
        autoRestrict: false,
        timestamp: '2024-03-01 09:30'
      },
      {
        id: 'ALT-2024-003',
        source: 'trulioo',
        eventType: 'PEP Status Change',
        riskImpact: 'high',
        linkedClient: 'Jennifer Williams',
        status: 'escalated',
        slaTimer: 2,
        assignedTo: 'Senior Management',
        autoRestrict: true,
        timestamp: '2024-03-01 08:15'
      }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Monitoring Feeds</h1>
            <p className="text-slate-300 mt-1">Real-time alert pipeline from all providers</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView('overview')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-slate-300">New Alerts</div>
              <div className="text-3xl font-bold text-red-600">8</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-slate-300">Under Review</div>
              <div className="text-3xl font-bold text-amber-600">15</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-slate-300">Escalated</div>
              <div className="text-3xl font-bold text-red-600">3</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-slate-300">SLA Breaches</div>
              <div className="text-3xl font-bold text-red-600">1</div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <div className="space-y-3">
          {mockAlerts.map((alert) => (
            <Card key={alert.id} className={`
              ${alert.riskImpact === 'critical' ? 'border-red-500 border-2' : ''}
              ${alert.riskImpact === 'high' ? 'border-amber-500 border-2' : ''}
              ${alert.autoRestrict ? 'bg-red-50' : ''}
            `}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {alert.source === 'trulioo' ? (
                      <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    ) : (
                      <FileCheck className="w-8 h-8 text-purple-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white">{alert.eventType}</span>
                        {alert.autoRestrict && (
                          <Badge className="bg-red-600">
                            <Lock className="w-3 h-3 mr-1" />
                            Auto-Restrict
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-slate-300">Source</div>
                          <div className="font-medium capitalize">{alert.source}</div>
                        </div>
                        <div>
                          <div className="text-slate-300">Client</div>
                          <div className="font-medium">{alert.linkedClient}</div>
                        </div>
                        <div>
                          <div className="text-slate-300">Assigned To</div>
                          <div className="font-medium">{alert.assignedTo}</div>
                        </div>
                        <div>
                          <div className="text-slate-300">Status</div>
                          <Badge className={
                            alert.status === 'new' ? 'bg-blue-500' :
                            alert.status === 'reviewing' ? 'bg-amber-500' :
                            alert.status === 'escalated' ? 'bg-red-500' : 'bg-green-500'
                          }>
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className={`text-center ${
                      alert.slaTimer <= 4 ? 'text-red-600' :
                      alert.slaTimer <= 8 ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      <Timer className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-xs font-semibold">{alert.slaTimer}h</div>
                    </div>
                    <Button size="sm" onClick={() => {
                      setSelectedAlert(alert);
                      setShowOverrideModal(true);
                    }}>
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ============================================================================
  // ERROR MANAGEMENT
  // ============================================================================
  const renderErrorManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Error Management</h1>
          <p className="text-slate-300 mt-1">Failed requests and system issues</p>
        </div>
        <Button variant="outline" onClick={() => setCurrentView('overview')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Error Categories */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Failed Verifications', count: 3, color: 'red' },
          { label: 'API Timeouts', count: 5, color: 'amber' },
          { label: 'Invalid Responses', count: 2, color: 'red' },
          { label: 'Schema Mismatches', count: 1, color: 'amber' },
          { label: 'Rate Limit Hits', count: 1, color: 'amber' }
        ].map((cat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4 text-center">
              <div className={`text-3xl font-bold text-${cat.color}-600 mb-1`}>{cat.count}</div>
              <div className="text-sm text-slate-300">{cat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Error List */}
      <div className="space-y-3">
        {[
          {
            id: 'ERR-2024-001',
            type: 'API Timeout',
            provider: 'Trulioo',
            product: 'Sanctions Screen',
            error: 'Request timeout after 30 seconds',
            client: 'Michael Brown',
            timestamp: '2024-03-01 10:25:33',
            retries: 3,
            severity: 'high'
          },
          {
            id: 'ERR-2024-002',
            type: 'Invalid Response',
            provider: 'InfoTrack',
            product: 'Director Search',
            error: 'Response missing required field: directors[].dateAppointed',
            client: 'Example Pty Ltd',
            timestamp: '2024-03-01 09:12:15',
            retries: 0,
            severity: 'medium'
          }
        ].map((error) => (
          <Card key={error.id} className="border-red-300 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-white">{error.type}</span>
                      <Badge variant="outline">{error.provider}</Badge>
                      <Badge className="bg-red-600">{error.severity}</Badge>
                    </div>
                    <div className="text-sm text-slate-300 mb-3 font-mono bg-red-100 p-2 rounded">
                      {error.error}
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-slate-300">Error ID</div>
                        <div className="font-mono text-xs">{error.id}</div>
                      </div>
                      <div>
                        <div className="text-slate-300">Product</div>
                        <div className="font-medium">{error.product}</div>
                      </div>
                      <div>
                        <div className="text-slate-300">Client</div>
                        <div className="font-medium">{error.client}</div>
                      </div>
                      <div>
                        <div className="text-slate-300">Retry Attempts</div>
                        <div className="font-medium">{error.retries}/3</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                  <Button size="sm" variant="outline">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Escalate to DevOps
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Log to Incident Register
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ============================================================================
  // NAVIGATION
  // ============================================================================
  return (
    <div className="min-h-screen bg-[#0a0e17]">
      {/* Top Navigation Bar */}
      <div className="bg-[#0d121d] border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Grow KYC
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <Database className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-lg">Integrations</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Role: {userRole.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="bg-[#0d121d] border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'trulioo', label: 'Trulioo', icon: Shield },
              { id: 'infotrack', label: 'InfoTrack', icon: FileCheck },
              { id: 'api_activity', label: 'API Activity', icon: Terminal },
              { id: 'monitoring_feeds', label: 'Monitoring', icon: Bell },
              { id: 'error_management', label: 'Errors', icon: AlertTriangle },
              { id: 'provider_sla', label: 'SLA', icon: BarChart3 }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as IntegrationView)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    currentView === item.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-300 hover:text-white hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'overview' && renderOverview()}
        {currentView === 'trulioo' && renderTrulioo()}
        {currentView === 'infotrack' && renderInfoTrack()}
        {currentView === 'api_activity' && renderAPIActivity()}
        {currentView === 'monitoring_feeds' && renderMonitoringFeeds()}
        {currentView === 'error_management' && renderErrorManagement()}
        {currentView === 'provider_sla' && renderProviderSLA()}
      </div>

      {/* Override Modal */}
      {showOverrideModal && selectedAlert && (
        <Dialog open={showOverrideModal} onOpenChange={setShowOverrideModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Compliance Override Required
              </DialogTitle>
              <DialogDescription>
                This alert requires senior approval before proceeding
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Card className="border-red-300 bg-red-50">
                <CardContent className="p-4">
                  <div className="font-semibold text-red-900 mb-2">{selectedAlert.eventType}</div>
                  <div className="text-sm text-red-800">
                    Client: {selectedAlert.linkedClient} • Risk: {selectedAlert.riskImpact.toUpperCase()}
                  </div>
                </CardContent>
              </Card>

              {userRole !== 'compliance_officer' && userRole !== 'super_admin' && (
                <Card className="border-amber-300 bg-amber-50">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900">
                      <strong>Access Denied:</strong> Override requires Compliance Officer or Senior Manager authorization with documented rationale and audit log entry.
                    </div>
                  </CardContent>
                </Card>
              )}

              {(userRole === 'compliance_officer' || userRole === 'super_admin') && (
                <>
                  <div className="space-y-2">
                    <Label>Override Reason (Required)</Label>
                    <Textarea 
                      placeholder="Provide detailed rationale for overriding this alert..." 
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <Card className="bg-[#0a0e17]">
                    <CardContent className="p-3 text-sm">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                        <div className="text-slate-300">
                          <strong>Audit Notice:</strong> This override will be logged with your user ID, timestamp, and rationale. The entry is immutable and will be included in regulatory reports.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOverrideModal(false)}>
                Cancel
              </Button>
              {(userRole === 'compliance_officer' || userRole === 'super_admin') && (
                <Button onClick={() => {
                  toast.success('Override approved and logged to audit trail');
                  setShowOverrideModal(false);
                }}>
                  Approve Override
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );

  // ============================================================================
  // PROVIDER SLA
  // ============================================================================
  function renderProviderSLA() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Provider SLA & Performance</h1>
            <p className="text-slate-300 mt-1">Service level metrics and compliance</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView('overview')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Provider Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providerStatus.map((provider) => (
            <Card key={provider.provider}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {provider.provider}
                  <Badge className="bg-green-500">SLA: Met</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">Uptime (30d)</span>
                    <span className="font-semibold">{provider.uptime}%</span>
                  </div>
                  <Progress value={provider.uptime} className="h-2" />
                  <div className="text-xs text-slate-400 mt-1">Target: 99.5%</div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">Avg Response Time</span>
                    <span className="font-semibold">{provider.avgResponseTime}s</span>
                  </div>
                  <Progress value={(5 - provider.avgResponseTime) * 20} className="h-2" />
                  <div className="text-xs text-slate-400 mt-1">Target: &lt;3s</div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-300">Error Rate</span>
                    <span className="font-semibold">{provider.errorRate}%</span>
                  </div>
                  <Progress value={100 - (provider.errorRate * 100)} className="h-2" />
                  <div className="text-xs text-slate-400 mt-1">Target: &lt;1%</div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-xs text-slate-300">Last 24h</div>
                    <div className="text-2xl font-bold text-green-600">100%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-300">Last 7d</div>
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Historical Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Historical Performance (90 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const height = 85 + Math.random() * 15;
                return (
                  <div
                    key={i}
                    className="flex-1 bg-green-500 rounded-t hover:bg-green-600 transition-colors cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`Day ${i + 1}: ${height.toFixed(1)}%`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>60 days ago</span>
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

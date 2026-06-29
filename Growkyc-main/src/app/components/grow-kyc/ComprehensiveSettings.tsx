import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Settings,
  Shield,
  Zap,
  Activity,
  CreditCard,
  Building2,
  ArrowLeft,
  Save,
  Check,
  AlertTriangle,
  DollarSign,
  Search,
  Info,
  Eye,
  Database,
  FileText,
  CheckCircle,
  BarChart3,
  Globe,
  Lock,
  Users,
  Bell,
  Sliders,
  Palette,
  Upload,
  Download,
  Percent,
  TrendingUp,
  Target,
  Workflow,
  Bot,
  Sparkles,
  Crown,
  Play,
  AlertCircle
} from 'lucide-react';
import { IntegrationsSettings } from './IntegrationsSettings';
import { FraudDetectionSettings } from './FraudDetectionSettings';

interface AutoCaseCreationRule {
  trigger: string;
  severity: string;
  enabled: boolean;
}

interface ComprehensiveSettingsProps {
  role?: string;
  userId?: string;
  onBack: () => void;
}

export function ComprehensiveSettings({ role, userId, onBack }: ComprehensiveSettingsProps) {
  const [activeTab, setActiveTab] = useState('kyc-config');

  const getPersonaConfig = (uid: string) => {
    const configs: Record<string, { name: string; title: string; role: string }> = {
      sarah_chen: { name: 'Sarah Chen', title: 'Head of Compliance', role: 'compliance_officer' },
      emma_williams: { name: 'Emma Williams', title: 'Compliance Officer', role: 'compliance_officer' },
      jessica_lee: { name: 'Jessica Lee', title: 'Senior Compliance Officer', role: 'compliance_officer' },
      alex_rivera: { name: 'Alex Rivera', title: 'AML Analyst', role: 'analyst' },
      david_thompson: { name: 'David Thompson', title: 'Internal Auditor', role: 'auditor' },
      michael_roberts: { name: 'Michael Roberts', title: 'Managing Partner', role: 'partner' },
      robert_kim: { name: 'Robert Kim', title: 'Risk Partner', role: 'partner' }
    };
    return configs[uid] || configs.sarah_chen;
  };

  const persona = getPersonaConfig(userId || localStorage.getItem('growkyc_selected_user') || 'sarah_chen');
  const userRole = role || persona.role;
  const isReadOnly = userRole === 'auditor' || userRole === 'analyst';

  // Unified Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Helper to load localStorage with fallback
  const getStored = (key: string, fallback: any) => {
    try {
      const val = localStorage.getItem(`grow_settings_${key}`);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  };

  // Helper to save settings to localStorage and trigger a Toast
  const saveTabSettings = (tabName: string, keysAndValues: { [key: string]: any }) => {
    if (isReadOnly) {
      showToast(`Access Denied: Cannot save settings in read-only mode.`, 'error');
      return;
    }
    try {
      Object.entries(keysAndValues).forEach(([key, val]) => {
        localStorage.setItem(`grow_settings_${key}`, JSON.stringify(val));
      });
      showToast(`${tabName} settings saved and active in rule engine.`, 'success');
    } catch (e) {
      showToast(`Failed to save settings.`, 'error');
    }
  };

  // KYC Config states
  const [ownershipThreshold, setOwnershipThreshold] = useState(() => getStored('ownership_threshold', 24));
  const [controlThreshold, setControlThreshold] = useState(() => getStored('control_threshold', 50));
  const [highRiskThreshold, setHighRiskThreshold] = useState(() => getStored('high_risk_threshold', 10));

  const [autoDiscover, setAutoDiscover] = useState(() => getStored('auto_discover', true));
  const [recursiveExpansion, setRecursiveExpansion] = useState(() => getStored('recursive_expansion', true));
  const [autoScreenDirectors, setAutoScreenDirectors] = useState(() => getStored('auto_screen_directors', true));
  const [autoScreenShareholders, setAutoScreenShareholders] = useState(() => getStored('auto_screen_shareholders', true));
  const [maxExpansionDepth, setMaxExpansionDepth] = useState(() => getStored('max_expansion_depth', 5));

  const [botSettings, setBotSettings] = useState<Record<string, boolean>>(() => getStored('bot_settings', {
    'Identity Verification Bot': true,
    'Sanctions Screening Bot': true,
    'PEP Screening Bot': true,
    'Adverse Media Screening Bot': true,
    'KYB Entity Verification Bot': true,
    'Beneficial Ownership Bot': true,
    'Source of Funds Bot': false,
    'Source of Wealth Bot': false,
    'Court & Litigation Bot': true,
    'Compliance Decision Bot': true,
    'Monitoring Trigger Bot': true,
    'Compliance File QA Bot': true
  }));

  const [retentionIdDocs, setRetentionIdDocs] = useState(() => getStored('retention_id_docs', 7));
  const [retentionScreening, setRetentionScreening] = useState(() => getStored('retention_screening', 10));
  const [retentionCase, setRetentionCase] = useState(() => getStored('retention_case', 10));
  const [retentionAudit, setRetentionAudit] = useState(() => getStored('retention_audit', 7));

  // Risk Scoring states
  const [riskWeights, setRiskWeights] = useState<Record<string, number>>(() => getStored('risk_weights', {
    'Sanctions Match': 100,
    'PEP Status': 80,
    'Adverse Media (High)': 70,
    'Insolvency Flag': 60,
    'Court Actions': 50,
    'Identity Issues': 40,
    'Ownership Gaps': 30,
    'Credit Issues': 20
  }));

  const [riskLowMin, setRiskLowMin] = useState(() => getStored('risk_low_min', 0));
  const [riskLowMax, setRiskLowMax] = useState(() => getStored('risk_low_max', 30));
  const [riskMedMin, setRiskMedMin] = useState(() => getStored('risk_med_min', 31));
  const [riskMedMax, setRiskMedMax] = useState(() => getStored('risk_med_max', 70));
  const [riskHighMin, setRiskHighMin] = useState(() => getStored('risk_high_min', 71));
  const [riskHighMax, setRiskHighMax] = useState(() => getStored('risk_high_max', 100));

  const [autoCaseCreationRules, setAutoCaseCreationRules] = useState<AutoCaseCreationRule[]>(() => getStored('auto_case_creation_rules', [
    { trigger: 'Sanctions match detected', severity: 'Critical', enabled: true },
    { trigger: 'PEP identified', severity: 'High', enabled: true },
    { trigger: 'High-severity adverse media', severity: 'High', enabled: true },
    { trigger: 'Identity verification failed', severity: 'Medium', enabled: true },
    { trigger: 'Ownership structure unclear', severity: 'Medium', enabled: true },
    { trigger: 'Credit score below threshold', severity: 'Low', enabled: false },
    { trigger: 'Court action detected', severity: 'Medium', enabled: true },
    { trigger: 'Insolvency flag raised', severity: 'High', enabled: true }
  ]));

  const [standardReviewMonths, setStandardReviewMonths] = useState(() => getStored('standard_review_months', 12));
  const [mediumReviewMonths, setMediumReviewMonths] = useState(() => getStored('medium_review_months', 6));
  const [highReviewMonths, setHighReviewMonths] = useState(() => getStored('high_review_months', 3));

  const [monitoringAlerts, setMonitoringAlerts] = useState<Record<string, boolean>>(() => getStored('monitoring_alerts', {
    'Real-time sanctions monitoring': true,
    'PEP status monitoring': true,
    'Adverse media monitoring': true,
    'Credit monitoring alerts': true
  }));

  // Pricing states
  const [verificationFee, setVerificationFee] = useState(() => getStored('verification_fee', 49.00));
  const [monitoringFee, setMonitoringFee] = useState(() => getStored('monitoring_fee', 15.00));
  const [individualSearchCosts, setIndividualSearchCosts] = useState<Record<string, number>>(() => getStored('individual_search_costs', {
    'Equifax Identity Check': 8.50,
    'Illion Business Check': 12.00,
    'ComplyAdvantage AML': 6.50,
    'ASIC Company Extract': 15.00,
    'InfoTrack ID Verification': 4.50,
    'LexisNexis Legal Check': 18.00
  }));

  // Organization states
  const [orgProfile, setOrgProfile] = useState<Record<string, string>>(() => getStored('org_profile', {
    name: 'Grow Financial Services',
    tradingName: 'Grow',
    abn: '12 345 678 901',
    acn: '123 456 789',
    address: 'Level 10, 123 Collins Street, Melbourne VIC 3000',
    email: 'admin@grow.com',
    phone: '+61 3 9xxx xxxx'
  }));
  const [brandColor, setBrandColor] = useState(() => getStored('brand_color', '#13B5EA'));

  // Advanced states
  const [primaryRegion, setPrimaryRegion] = useState(() => getStored('primary_region', 'Australia (Sydney)'));
  const [jurisdictionSwitches, setJurisdictionSwitches] = useState<Record<string, boolean>>(() => getStored('jurisdiction_switches', {
    Australia: true,
    EU: false,
    US: false,
    UK: false,
    Canada: false,
    Singapore: false,
    NZ: false,
    HK: false
  }));
  const [requireMfa, setRequireMfa] = useState(() => getStored('require_mfa', true));
  const [ssoIntegration, setSSOIntegration] = useState(() => getStored('sso_integration', false));
  const [ipWhitelisting, setIpWhitelisting] = useState(() => getStored('ip_whitelisting', false));
  const [sessionTimeout, setSessionTimeout] = useState(() => getStored('session_timeout', 30));



  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 border-l-4 border-purple-600 shadow-2xl rounded-lg p-4 flex items-center gap-3 max-w-sm transition-all duration-300 transform translate-y-0 scale-100">
          <div className={`p-2 rounded-full ${
            toast.type === 'success' ? 'bg-green-100 text-green-600' :
            toast.type === 'info' ? 'bg-blue-100 text-blue-600' :
            'bg-red-100 text-red-600'
          }`}>
            {toast.type === 'success' ? <Check className="w-5 h-5" /> : toast.type === 'info' ? <Info className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{toast.type === 'success' ? 'Success' : toast.type === 'info' ? 'Info' : 'Error'}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{toast.message}</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="flex-shrink-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-gray-300 hidden sm:block" />
            <Settings className="w-6 h-6 md:w-8 md:h-8 text-purple-600 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">System Settings & Configuration</h1>
              <p className="text-xs md:text-sm text-gray-600 truncate">Complete control center for your KYC platform</p>
            </div>
          </div>
          <Badge variant="default" className={`${isReadOnly ? 'bg-amber-600' : 'bg-purple-600'} self-start sm:self-auto flex-shrink-0`}>
            {isReadOnly ? <AlertCircle className="w-3 h-3 mr-1" /> : <Crown className="w-3 h-3 mr-1" />}
            {persona.title}
          </Badge>
        </div>
      </div>

      {isReadOnly && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mx-4 md:mx-6 mt-4 rounded-r-lg flex items-center gap-3 shadow-md">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-900">Read-Only Mode</p>
            <p className="text-xs text-amber-700">
              As an {persona.title}, you have view-only access to system settings. Saving or changing configurations is disabled.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex lg:grid lg:grid-cols-7 w-full overflow-x-auto mb-6 p-1 bg-gray-100 rounded-lg whitespace-nowrap overflow-y-hidden max-w-full gap-1 lg:gap-0 scrollbar-thin">
            <TabsTrigger value="kyc-config" className="flex items-center gap-2 flex-shrink-0 px-3 py-1.5 text-xs lg:text-sm">
              <Shield className="w-4 h-4" />
              KYC Config
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2 flex-shrink-0 px-3 py-1.5 text-xs lg:text-sm">
              <Zap className="w-4 h-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="fraud-detection" className="flex items-center gap-2 flex-shrink-0 px-3 py-1.5 text-xs lg:text-sm">
              <AlertCircle className="w-4 h-4" />
              Fraud Detection
            </TabsTrigger>
            <TabsTrigger value="risk-rules" className="flex items-center gap-2 flex-shrink-0 px-3 py-1.5 text-xs lg:text-sm">
              <Activity className="w-4 h-4" />
              Risk & Rules
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2 flex-shrink-0 px-3 py-1.5 text-xs lg:text-sm">
              <CreditCard className="w-4 h-4" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="organization" className="flex items-center gap-2 flex-shrink-0 px-3 py-1.5 text-xs lg:text-sm">
              <Building2 className="w-4 h-4" />
              Organization
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2 flex-shrink-0 px-3 py-1.5 text-xs lg:text-sm">
              <Settings className="w-4 h-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <div className={isReadOnly ? 'pointer-events-none opacity-85' : ''}>
            {/* KYC CONFIGURATION TAB */}
            <TabsContent value="kyc-config" className="space-y-6">
            {/* Ownership Threshold */}
            <Card className="border-2 border-cyan-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-cyan-600" />
                  Ownership & Control Thresholds
                </CardTitle>
                <CardDescription>
                  Configure when associated parties require screening (critical for compliance)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-cyan-50 rounded-lg p-6 border-2 border-cyan-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="ownership-threshold" className="text-sm font-semibold mb-3 block">
                        Beneficial Ownership Threshold
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="ownership-threshold"
                          type="number"
                          value={ownershipThreshold}
                          onChange={e => setOwnershipThreshold(Number(e.target.value))}
                          className="text-2xl font-bold border-2 border-cyan-300 focus:border-cyan-500 w-32"
                        />
                        <span className="text-3xl font-bold text-cyan-600">%</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Default: 24% (anyone with 24%+ ownership is automatically screened)
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-cyan-200">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Auto-screening triggers:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Directors (always screened)</li>
                        <li>• Shareholders ≥ threshold %</li>
                        <li>• Beneficial owners ≥ threshold %</li>
                        <li>• Ultimate controllers</li>
                        <li>• Trustees of controlling trusts</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-600" />
                      Control Threshold
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={controlThreshold}
                        onChange={e => setControlThreshold(Number(e.target.value))}
                        className="border-2 border-purple-200 bg-white"
                      />
                      <span className="font-semibold text-purple-600">%</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Flagged as controlling interest</p>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      High Risk Threshold
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={highRiskThreshold}
                        onChange={e => setHighRiskThreshold(Number(e.target.value))}
                        className="border-2 border-amber-200 bg-white"
                      />
                      <span className="font-semibold text-amber-600">%</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Trigger enhanced due diligence</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entity Expansion Rules */}
            <Card className="border-2 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-indigo-600" />
                  Entity Expansion & Discovery Rules
                </CardTitle>
                <CardDescription>
                  Control how the system discovers and screens associated entities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div>
                      <p className="font-semibold text-gray-900">Auto-discover entities</p>
                      <p className="text-xs text-gray-600">Automatically find linked companies</p>
                    </div>
                    <Switch checked={autoDiscover} onCheckedChange={setAutoDiscover} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div>
                      <p className="font-semibold text-gray-900">Recursive expansion</p>
                      <p className="text-xs text-gray-600">Expand through entity chains</p>
                    </div>
                    <Switch checked={recursiveExpansion} onCheckedChange={setRecursiveExpansion} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div>
                      <p className="font-semibold text-gray-900">Auto-screen directors</p>
                      <p className="text-xs text-gray-600">Always run AML on directors</p>
                    </div>
                    <Switch checked={autoScreenDirectors} onCheckedChange={setAutoScreenDirectors} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div>
                      <p className="font-semibold text-gray-900">Auto-screen shareholders</p>
                      <p className="text-xs text-gray-600">Based on threshold %</p>
                    </div>
                    <Switch checked={autoScreenShareholders} onCheckedChange={setAutoScreenShareholders} />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-2 border-indigo-300">
                  <Label className="text-sm font-semibold mb-3 block">Maximum Expansion Depth</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={maxExpansionDepth}
                      onChange={e => setMaxExpansionDepth(Number(e.target.value))}
                      className="w-24 border-2"
                    />
                    <span className="text-sm text-gray-600">levels deep (prevents infinite loops)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bot Configuration */}
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  AI Bot Execution Settings
                </CardTitle>
                <CardDescription>
                  Configure when and how compliance bots run automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { name: 'Identity Verification Bot', enabled: true },
                    { name: 'Sanctions Screening Bot', enabled: true },
                    { name: 'PEP Screening Bot', enabled: true },
                    { name: 'Adverse Media Screening Bot', enabled: true },
                    { name: 'KYB Entity Verification Bot', enabled: true },
                    { name: 'Beneficial Ownership Bot', enabled: true },
                    { name: 'Source of Funds Bot', enabled: false },
                    { name: 'Source of Wealth Bot', enabled: false },
                    { name: 'Court & Litigation Bot', enabled: true },
                    { name: 'Compliance Decision Bot', enabled: true },
                    { name: 'Monitoring Trigger Bot', enabled: true },
                    { name: 'Compliance File QA Bot', enabled: true }
                  ].map((bot, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold text-gray-900">{bot.name}</span>
                      </div>
                      <Switch
                        checked={botSettings[bot.name as keyof typeof botSettings] ?? bot.enabled}
                        onCheckedChange={checked => {
                          setBotSettings(prev => ({
                            ...prev,
                            [bot.name]: checked
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-900">Bot Execution Mode</p>
                      <p className="text-xs text-green-700 mt-1">
                        All enabled bots run automatically after external checks complete. Disable individual bots to run them manually only.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Retention */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Document & Data Retention
                </CardTitle>
                <CardDescription>
                  Configure how long documents and records are stored
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <Label className="text-sm font-semibold mb-3 block">ID Documents Retention</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={retentionIdDocs}
                        onChange={e => setRetentionIdDocs(Number(e.target.value))}
                        className="w-24 border-2 bg-white"
                      />
                      <span className="text-sm text-gray-600">years</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">AUSTRAC compliance: minimum 7 years</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <Label className="text-sm font-semibold mb-3 block">Screening Results Retention</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={retentionScreening}
                        onChange={e => setRetentionScreening(Number(e.target.value))}
                        className="w-24 border-2 bg-white"
                      />
                      <span className="text-sm text-gray-600">years</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">AML/CTF audit trail</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <Label className="text-sm font-semibold mb-3 block">Case Records Retention</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={retentionCase}
                        onChange={e => setRetentionCase(Number(e.target.value))}
                        className="w-24 border-2 bg-white"
                      />
                      <span className="text-sm text-gray-600">years</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Compliance investigation history</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <Label className="text-sm font-semibold mb-3 block">Audit Logs Retention</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={retentionAudit}
                        onChange={e => setRetentionAudit(Number(e.target.value))}
                        className="w-24 border-2 bg-white"
                      />
                      <span className="text-sm text-gray-600">years</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">System activity records</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
              <Button
                disabled={isReadOnly}
                onClick={() => saveTabSettings('KYC Configuration', {
                  ownership_threshold: ownershipThreshold,
                  control_threshold: controlThreshold,
                  high_risk_threshold: highRiskThreshold,
                  auto_discover: autoDiscover,
                  recursive_expansion: recursiveExpansion,
                  auto_screen_directors: autoScreenDirectors,
                  auto_screen_shareholders: autoScreenShareholders,
                  max_expansion_depth: maxExpansionDepth,
                  bot_settings: botSettings,
                  retention_id_docs: retentionIdDocs,
                  retention_screening: retentionScreening,
                  retention_case: retentionCase,
                  retention_audit: retentionAudit
                })}
                className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-md flex items-center gap-2 px-6 py-2"
              >
                <Save className="w-4 h-4" />
                Save KYC Configuration
              </Button>
            </div>
          </TabsContent>

          {/* INTEGRATIONS TAB */}
          <TabsContent value="integrations" className="space-y-6">
            <IntegrationsSettings role={userRole} />
          </TabsContent>

          {/* FRAUD DETECTION TAB */}
          <TabsContent value="fraud-detection" className="space-y-6">
            <FraudDetectionSettings role={userRole} />
          </TabsContent>

          {/* OLD INTEGRATIONS CONTENT - KEEPING FOR REFERENCE BUT HIDDEN */}
          <div className="hidden">
            <Card className="border-2 border-green-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-600" />
                      External Integration Credentials
                    </CardTitle>
                    <CardDescription>Manage API keys and credentials for external providers</CardDescription>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save All Credentials
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Equifax */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Equifax</h3>
                        <p className="text-xs text-gray-600">Identity verification & credit checks</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600">Connected</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">API Key</Label>
                      <Input type="password" defaultValue="eq_live_xxxxxxxxxx" className="border-2" />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">API Secret</Label>
                      <Input type="password" defaultValue="xxxxxxxxxxxxxxxx" className="border-2" />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">Environment</Label>
                      <select className="w-full px-3 py-2 border-2 rounded-lg">
                        <option>Production</option>
                        <option>Sandbox</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">Rate Limit</Label>
                      <div className="flex items-center gap-2">
                        <Input type="number" defaultValue="100" className="border-2" />
                        <span className="text-xs text-gray-600">req/min</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Illion */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-8 h-8 text-purple-600" />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Illion</h3>
                        <p className="text-xs text-gray-600">Business credit & insolvency</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600">Connected</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">Client ID</Label>
                      <Input type="text" defaultValue="il_xxxxxxxxxx" className="border-2" />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">Client Secret</Label>
                      <Input type="password" defaultValue="xxxxxxxxxxxxxxxx" className="border-2" />
                    </div>
                  </div>
                </div>

                {/* ComplyAdvantage */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border-2 border-red-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">ComplyAdvantage</h3>
                        <p className="text-xs text-gray-600">AML screening - Sanctions, PEP, Adverse Media</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600">Connected</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">API Key</Label>
                      <Input type="password" defaultValue="ca_live_xxxxxxxxxx" className="border-2" />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">Webhook Secret</Label>
                      <Input type="password" defaultValue="whsec_xxxxxxxxxx" className="border-2" />
                    </div>
                  </div>
                </div>

                {/* ASIC */}
                <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg p-6 border-2 border-cyan-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-cyan-600" />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">ASIC Connect</h3>
                        <p className="text-xs text-gray-600">Company extracts & entity records</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600">Connected</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">Access Token</Label>
                      <Input type="password" defaultValue="asic_xxxxxxxxxx" className="border-2" />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">Subscriber ID</Label>
                      <Input type="text" defaultValue="SUB-12345" className="border-2" />
                    </div>
                  </div>
                </div>

                {/* InfoTrack */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Eye className="w-8 h-8 text-green-600" />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">InfoTrack</h3>
                        <p className="text-xs text-gray-600">ID verification & KYC checks</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600">Connected</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">Username</Label>
                      <Input type="text" defaultValue="grow_api_user" className="border-2" />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">API Password</Label>
                      <Input type="password" defaultValue="xxxxxxxxxxxxxxxx" className="border-2" />
                    </div>
                  </div>
                </div>

                {/* LexisNexis (Optional) */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border-2 border-gray-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Database className="w-8 h-8 text-gray-600" />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">LexisNexis</h3>
                        <p className="text-xs text-gray-600">Legal research & court records (optional)</p>
                      </div>
                    </div>
                    <Badge className="bg-gray-400">Not Configured</Badge>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">API Key</Label>
                      <Input type="password" placeholder="Enter API key" className="border-2" />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold mb-2 block">Account ID</Label>
                      <Input type="text" placeholder="Enter account ID" className="border-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Webhook Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Webhook Endpoints</CardTitle>
                <CardDescription>Receive real-time updates from external providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">ComplyAdvantage Monitoring Alerts</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <p className="text-xs text-gray-600 font-mono">https://api.grow.com/webhooks/ca-monitoring</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Illion Credit Updates</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <p className="text-xs text-gray-600 font-mono">https://api.grow.com/webhooks/illion-updates</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RISK & RULES TAB */}
          <TabsContent value="risk-rules" className="space-y-6">
            <Card className="border-2 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-600" />
                  Risk Scoring Configuration
                </CardTitle>
                <CardDescription>
                  Define how risk scores are calculated and weighted
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                  <h3 className="font-bold text-lg mb-4">Risk Factor Weights</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Sanctions Match', weight: 100, color: 'red' },
                      { name: 'PEP Status', weight: 80, color: 'orange' },
                      { name: 'Adverse Media (High)', weight: 70, color: 'amber' },
                      { name: 'Insolvency Flag', weight: 60, color: 'yellow' },
                      { name: 'Court Actions', weight: 50, color: 'lime' },
                      { name: 'Identity Issues', weight: 40, color: 'green' },
                      { name: 'Ownership Gaps', weight: 30, color: 'cyan' },
                      { name: 'Credit Issues', weight: 20, color: 'blue' }
                    ].map((factor, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-gray-900 w-48">{factor.name}</span>
                        <Input
                          type="number"
                          value={riskWeights[factor.name as keyof typeof riskWeights] ?? factor.weight}
                          onChange={e => {
                            const newWeight = Math.max(0, Math.min(100, Number(e.target.value)));
                            setRiskWeights(prev => ({
                              ...prev,
                              [factor.name]: newWeight
                            }));
                          }}
                          className="w-24 border-2 bg-white"
                        />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-${factor.color === 'red' ? 'red' : factor.color === 'orange' ? 'orange' : factor.color === 'amber' ? 'amber' : factor.color === 'yellow' ? 'yellow' : factor.color === 'lime' ? 'lime' : factor.color === 'green' ? 'green' : factor.color === 'cyan' ? 'cyan' : 'blue'}-600 h-2 rounded-full`}
                            style={{ width: `${riskWeights[factor.name as keyof typeof riskWeights] ?? factor.weight}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                    <Label className="text-sm font-semibold mb-3 block text-green-900">Low Risk Threshold</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={riskLowMin}
                        onChange={e => setRiskLowMin(Number(e.target.value))}
                        className="border-2 bg-white"
                      />
                      <span className="text-sm">-</span>
                      <Input
                        type="number"
                        value={riskLowMax}
                        onChange={e => setRiskLowMax(Number(e.target.value))}
                        className="border-2 bg-white"
                      />
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-300">
                    <Label className="text-sm font-semibold mb-3 block text-amber-900">Medium Risk Threshold</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={riskMedMin}
                        onChange={e => setRiskMedMin(Number(e.target.value))}
                        className="border-2 bg-white"
                      />
                      <span className="text-sm">-</span>
                      <Input
                        type="number"
                        value={riskMedMax}
                        onChange={e => setRiskMedMax(Number(e.target.value))}
                        className="border-2 bg-white"
                      />
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                    <Label className="text-sm font-semibold mb-3 block text-red-900">High Risk Threshold</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={riskHighMin}
                        onChange={e => setRiskHighMin(Number(e.target.value))}
                        className="border-2 bg-white"
                      />
                      <span className="text-sm">-</span>
                      <Input
                        type="number"
                        value={riskHighMax}
                        onChange={e => setRiskHighMax(Number(e.target.value))}
                        className="border-2 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auto Case Creation Rules */}
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Automated Case Creation Rules
                </CardTitle>
                <CardDescription>
                  Define when cases are automatically created for review
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {autoCaseCreationRules.map((rule, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-4 flex-1">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={checked => {
                          setAutoCaseCreationRules(prev => prev.map((r, i) => i === idx ? { ...r, enabled: checked } : r));
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{rule.trigger}</p>
                        <p className="text-xs text-gray-600">Auto-create case for manual review</p>
                      </div>
                    </div>
                    <Badge className={
                      rule.severity === 'Critical' ? 'bg-red-600' :
                      rule.severity === 'High' ? 'bg-orange-600' :
                      rule.severity === 'Medium' ? 'bg-amber-600' :
                      'bg-blue-600'
                    }>
                      {rule.severity}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Monitoring Configuration */}
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-green-600" />
                  Ongoing Monitoring Configuration
                </CardTitle>
                <CardDescription>
                  Configure review cycles and alert thresholds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <Label className="text-sm font-semibold mb-3 block">Standard Risk Review</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={standardReviewMonths}
                        onChange={e => setStandardReviewMonths(Number(e.target.value))}
                        className="w-24 border-2 bg-white"
                      />
                      <span className="text-sm text-gray-600">months</span>
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <Label className="text-sm font-semibold mb-3 block">Medium Risk Review</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={mediumReviewMonths}
                        onChange={e => setMediumReviewMonths(Number(e.target.value))}
                        className="w-24 border-2 bg-white"
                      />
                      <span className="text-sm text-gray-600">months</span>
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <Label className="text-sm font-semibold mb-3 block">High Risk Review</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={highReviewMonths}
                        onChange={e => setHighReviewMonths(Number(e.target.value))}
                        className="w-24 border-2 bg-white"
                      />
                      <span className="text-sm text-gray-600">months</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-semibold text-gray-900">Real-time sanctions monitoring</p>
                      <p className="text-xs text-gray-600">Continuous screening via ComplyAdvantage</p>
                    </div>
                    <Switch
                      checked={monitoringAlerts['Real-time sanctions monitoring']}
                      onCheckedChange={c => setMonitoringAlerts(prev => ({ ...prev, 'Real-time sanctions monitoring': c }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-semibold text-gray-900">PEP status monitoring</p>
                      <p className="text-xs text-gray-600">Daily PEP list updates</p>
                    </div>
                    <Switch
                      checked={monitoringAlerts['PEP status monitoring']}
                      onCheckedChange={c => setMonitoringAlerts(prev => ({ ...prev, 'PEP status monitoring': c }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-semibold text-gray-900">Adverse media monitoring</p>
                      <p className="text-xs text-gray-600">Weekly media scans</p>
                    </div>
                    <Switch
                      checked={monitoringAlerts['Adverse media monitoring']}
                      onCheckedChange={c => setMonitoringAlerts(prev => ({ ...prev, 'Adverse media monitoring': c }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-semibold text-gray-900">Credit monitoring alerts</p>
                      <p className="text-xs text-gray-600">Credit score changes</p>
                    </div>
                    <Switch
                      checked={monitoringAlerts['Credit monitoring alerts']}
                      onCheckedChange={c => setMonitoringAlerts(prev => ({ ...prev, 'Credit monitoring alerts': c }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
              <Button
                disabled={isReadOnly}
                onClick={() => saveTabSettings('Risk & Rules', {
                  risk_weights: riskWeights,
                  risk_low_min: riskLowMin,
                  risk_low_max: riskLowMax,
                  risk_med_min: riskMedMin,
                  risk_med_max: riskMedMax,
                  risk_high_min: riskHighMin,
                  risk_high_max: riskHighMax,
                  auto_case_creation_rules: autoCaseCreationRules,
                  standard_review_months: standardReviewMonths,
                  medium_review_months: mediumReviewMonths,
                  high_review_months: highReviewMonths,
                  monitoring_alerts: monitoringAlerts
                })}
                className="bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center gap-2 px-6 py-2"
              >
                <Save className="w-4 h-4" />
                Save Risk & Rules Configuration
              </Button>
            </div>
          </TabsContent>

          {/* PRICING TAB (Existing) */}
          <TabsContent value="pricing" className="space-y-6">
            {/* Pricing Configuration */}
            <Card className="border-2 border-cyan-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-cyan-600" />
                      KYC Verification Pricing
                    </CardTitle>
                    <CardDescription className="mt-1">Configure client-facing fees for verification services</CardDescription>
                  </div>
                  <Button
                    disabled={isReadOnly}
                    onClick={() => saveTabSettings('Pricing', {
                      verification_fee: verificationFee,
                      monitoring_fee: monitoringFee,
                      individual_search_costs: individualSearchCosts
                    })}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Pricing
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* One-Time Verification Fee */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-6 border-2 border-cyan-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-cyan-600" />
                    One-Time Verification Fee
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Client-facing fee for initial KYC verification (includes all base checks)
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="verification-fee" className="text-sm font-semibold mb-2 block">
                        Verification Fee Amount
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-600">$</span>
                        <Input
                          id="verification-fee"
                          type="number"
                          value={verificationFee}
                          onChange={e => setVerificationFee(Number(e.target.value))}
                          className="text-lg font-semibold border-2 border-cyan-300 focus:border-cyan-500 bg-white"
                        />
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-cyan-200">
                      <p className="text-xs text-gray-600 mb-2">This fee includes:</p>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Identity verification (Equifax)
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          AML screening (ComplyAdvantage)
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Business risk assessment (Illion)
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Entity and ownership analysis
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Individual Search Costs */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5 text-purple-600" />
                    Individual Search Costs
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Internal costs for each external integration check (for tracking purposes)
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Equifax */}
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">Equifax Identity Check</p>
                          <p className="text-xs text-gray-600">Identity, fraud, credit signals</p>
                        </div>
                        <Shield className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-600">$</span>
                        <Input
                          type="number"
                          value={individualSearchCosts['Equifax Identity Check']}
                          onChange={e => setIndividualSearchCosts(prev => ({ ...prev, 'Equifax Identity Check': Number(e.target.value) }))}
                          className="border-2 border-purple-200 focus:border-purple-400 bg-white"
                        />
                      </div>
                    </div>

                    {/* Illion */}
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">Illion Business Check</p>
                          <p className="text-xs text-gray-600">Credit, insolvency, court data</p>
                        </div>
                        <Building2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-600">$</span>
                        <Input
                          type="number"
                          value={individualSearchCosts['Illion Business Check']}
                          onChange={e => setIndividualSearchCosts(prev => ({ ...prev, 'Illion Business Check': Number(e.target.value) }))}
                          className="border-2 border-purple-200 focus:border-purple-400 bg-white"
                        />
                      </div>
                    </div>

                    {/* ComplyAdvantage */}
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">ComplyAdvantage AML</p>
                          <p className="text-xs text-gray-600">Sanctions, PEP, adverse media</p>
                        </div>
                        <AlertTriangle className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-600">$</span>
                        <Input
                          type="number"
                          value={individualSearchCosts['ComplyAdvantage AML']}
                          onChange={e => setIndividualSearchCosts(prev => ({ ...prev, 'ComplyAdvantage AML': Number(e.target.value) }))}
                          className="border-2 border-purple-200 focus:border-purple-400 bg-white"
                        />
                      </div>
                    </div>

                    {/* ASIC */}
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">ASIC Company Extract</p>
                          <p className="text-xs text-gray-600">Entity records, directors, shares</p>
                        </div>
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-600">$</span>
                        <Input
                          type="number"
                          value={individualSearchCosts['ASIC Company Extract']}
                          onChange={e => setIndividualSearchCosts(prev => ({ ...prev, 'ASIC Company Extract': Number(e.target.value) }))}
                          className="border-2 border-purple-200 focus:border-purple-400 bg-white"
                        />
                      </div>
                    </div>

                    {/* InfoTrack KYC */}
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">InfoTrack ID Verification</p>
                          <p className="text-xs text-gray-600">Document verification</p>
                        </div>
                        <Eye className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-600">$</span>
                        <Input
                          type="number"
                          value={individualSearchCosts['InfoTrack ID Verification']}
                          onChange={e => setIndividualSearchCosts(prev => ({ ...prev, 'InfoTrack ID Verification': Number(e.target.value) }))}
                          className="border-2 border-purple-200 focus:border-purple-400 bg-white"
                        />
                      </div>
                    </div>

                    {/* LexisNexis (Optional) */}
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">LexisNexis Legal Check</p>
                          <p className="text-xs text-gray-600">Court records, litigation</p>
                        </div>
                        <Database className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-600">$</span>
                        <Input
                          type="number"
                          value={individualSearchCosts['LexisNexis Legal Check']}
                          onChange={e => setIndividualSearchCosts(prev => ({ ...prev, 'LexisNexis Legal Check': Number(e.target.value) }))}
                          className="border-2 border-purple-200 focus:border-purple-400 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-white rounded-lg p-4 border border-purple-300">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-purple-900">Cost Tracking</p>
                        <p className="text-xs text-purple-700 mt-1">
                          These costs are for internal tracking and margin analysis. The client is charged the one-time verification fee regardless of how many individual checks are performed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ongoing Monitoring Fee */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    Ongoing Monitoring Subscription
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Monthly fee for continuous AML monitoring of client and associated parties
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="monitoring-fee" className="text-sm font-semibold mb-2 block">
                        Monthly Monitoring Fee
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-600">$</span>
                        <Input
                          id="monitoring-fee"
                          type="number"
                          value={monitoringFee}
                          onChange={e => setMonitoringFee(Number(e.target.value))}
                          className="text-lg font-semibold border-2 border-green-300 focus:border-green-500 bg-white"
                        />
                        <span className="text-sm text-gray-600 whitespace-nowrap">/ month</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Billed monthly per client entity
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-xs text-gray-600 mb-2">Monthly monitoring includes:</p>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Real-time sanctions screening
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          PEP status monitoring
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Adverse media alerts
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Credit and business risk updates
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Associated party monitoring
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />
                          Automated case creation on alerts
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Monitoring Tiers */}
                  <div className="mt-4 grid md:grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-600">Standard</Badge>
                        <span className="font-bold text-lg">$15</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Monthly checks, standard alerts
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-2 border-amber-400">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-amber-600">Enhanced</Badge>
                        <span className="font-bold text-lg">$35</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Weekly checks, priority alerts
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-2 border-purple-400">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-purple-600">Premium</Badge>
                        <span className="font-bold text-lg">$75</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Real-time monitoring, instant alerts
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border-2 border-indigo-200">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    Pricing Summary
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">Revenue Model</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-200">
                          <span className="text-sm text-gray-700">Initial Verification</span>
                          <span className="font-bold text-indigo-600">$49.00</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-200">
                          <span className="text-sm text-gray-700">Monthly Monitoring (Standard)</span>
                          <span className="font-bold text-indigo-600">$15.00</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-indigo-100 rounded-lg border-2 border-indigo-300">
                          <span className="text-sm font-semibold text-indigo-900">12-Month Client Value</span>
                          <span className="font-bold text-xl text-indigo-600">$229</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">Cost Structure</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-200">
                          <span className="text-sm text-gray-700">Total External Checks</span>
                          <span className="font-bold text-gray-900">~$46.50</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-200">
                          <span className="text-sm text-gray-700">Monitoring Cost (est.)</span>
                          <span className="font-bold text-gray-900">~$5.00/mo</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg border-2 border-green-300">
                          <span className="text-sm font-semibold text-green-900">12-Month Margin</span>
                          <span className="font-bold text-xl text-green-600">$122.50</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ORGANIZATION TAB (SaaS Ready) */}
          <TabsContent value="organization" className="space-y-6">
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      Organization Profile
                    </CardTitle>
                    <CardDescription>
                      Configure your organization details (ready for multi-tenant SaaS)
                    </CardDescription>
                  </div>
                  <Button
                    disabled={isReadOnly}
                    onClick={() => saveTabSettings('Organization', {
                      org_profile: orgProfile,
                      brand_color: brandColor
                    })}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Organization Name</Label>
                    <Input
                      value={orgProfile.name}
                      onChange={e => setOrgProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="border-2 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Trading Name</Label>
                    <Input
                      value={orgProfile.tradingName}
                      onChange={e => setOrgProfile(prev => ({ ...prev, tradingName: e.target.value }))}
                      className="border-2 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">ABN</Label>
                    <Input
                      value={orgProfile.abn}
                      onChange={e => setOrgProfile(prev => ({ ...prev, abn: e.target.value }))}
                      className="border-2 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">ACN</Label>
                    <Input
                      value={orgProfile.acn}
                      onChange={e => setOrgProfile(prev => ({ ...prev, acn: e.target.value }))}
                      className="border-2 bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-semibold mb-2 block">Registered Address</Label>
                    <Input
                      value={orgProfile.address}
                      onChange={e => setOrgProfile(prev => ({ ...prev, address: e.target.value }))}
                      className="border-2 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Primary Contact Email</Label>
                    <Input
                      type="email"
                      value={orgProfile.email}
                      onChange={e => setOrgProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="border-2 bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Primary Contact Phone</Label>
                    <Input
                      type="tel"
                      value={orgProfile.phone}
                      onChange={e => setOrgProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="border-2 bg-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* White-labeling (SaaS Ready) */}
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Branding & White-labeling
                </CardTitle>
                <CardDescription>
                  Customize the platform appearance (Stage 2 SaaS feature)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <Label className="text-sm font-semibold mb-3 block">Logo Upload</Label>
                    <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-white">
                      <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload your organization logo</p>
                      <Button size="sm" variant="outline" onClick={() => showToast('Logo upload is locked in demo mode.', 'info')}>Choose File</Button>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <Label className="text-sm font-semibold mb-3 block">Primary Brand Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={brandColor}
                        onChange={e => setBrandColor(e.target.value)}
                        className="w-20 h-12 border-2 bg-white cursor-pointer"
                      />
                      <Input
                        value={brandColor}
                        onChange={e => setBrandColor(e.target.value)}
                        className="border-2 bg-white"
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Used for buttons, links, and accents</p>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-300">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">Stage 2 SaaS Feature</p>
                      <p className="text-xs text-amber-700 mt-1">
                        Full white-labeling, custom domains, and multi-tenant branding will be available in Stage 2.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card className="border-2 border-green-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      User Management
                    </CardTitle>
                    <CardDescription>Manage team members and access levels</CardDescription>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Users className="w-4 h-4 mr-2" />
                    Invite User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'Sarah Chen', email: 'sarah@grow.com', role: 'Admin', status: 'Active' },
                    { name: 'Michael Roberts', email: 'michael@grow.com', role: 'Partner', status: 'Active' },
                    { name: 'Emma Williams', email: 'emma@grow.com', role: 'Analyst', status: 'Active' },
                    { name: 'David Thompson', email: 'david@grow.com', role: 'Auditor', status: 'Active' }
                  ].map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-600">{user.role}</Badge>
                        <Badge className="bg-green-600">{user.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ADVANCED TAB */}
          <TabsContent value="advanced" className="space-y-6">
            {/* Data Residency */}
            <Card className="border-2 border-indigo-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-indigo-600" />
                      Data Residency & Compliance
                    </CardTitle>
                    <CardDescription>
                      Configure where data is stored and processed
                    </CardDescription>
                  </div>
                  <Button
                    disabled={isReadOnly}
                    onClick={() => saveTabSettings('Advanced Settings', {
                      primary_region: primaryRegion,
                      jurisdiction_switches: jurisdictionSwitches,
                      require_mfa: requireMfa,
                      sso_integration: ssoIntegration,
                      ip_whitelisting: ipWhitelisting,
                      session_timeout: sessionTimeout
                    })}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Advanced Settings
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <Label className="text-sm font-semibold mb-3 block">Primary Data Region</Label>
                  <select
                    value={primaryRegion}
                    onChange={e => setPrimaryRegion(e.target.value)}
                    className="w-full px-4 py-2 border-2 rounded-lg bg-white"
                  >
                    <option>Australia (Sydney)</option>
                    <option>New Zealand (Auckland)</option>
                    <option>Singapore</option>
                    <option>United Kingdom (London)</option>
                    <option>United States (Virginia)</option>
                    <option>United States (California)</option>
                    <option>Canada (Toronto)</option>
                    <option>Hong Kong</option>
                    <option>European Union (Frankfurt)</option>
                  </select>
                  <p className="text-xs text-gray-600 mt-2">All client data will be stored in this region</p>
                </div>

                <div className="bg-white rounded-lg p-4 border-2 border-indigo-300">
                  <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    Multi-Jurisdictional Compliance Modes
                  </h3>
                  <p className="text-xs text-gray-600 mb-4">
                    Enable compliance frameworks for the jurisdictions where you operate
                  </p>

                  <div className="grid md:grid-cols-2 gap-3">
                    {/* Australia */}
                    <div className="flex items-start justify-between p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">🇦🇺</span>
                          <p className="font-semibold text-gray-900">Australia</p>
                        </div>
                        <p className="text-xs text-gray-600">Privacy Act 1988 (APPs)</p>
                        <p className="text-xs text-gray-500 mt-1">13 Australian Privacy Principles</p>
                      </div>
                      <Switch
                        checked={jurisdictionSwitches.Australia}
                        onCheckedChange={checked => setJurisdictionSwitches(prev => ({ ...prev, Australia: checked }))}
                      />
                    </div>

                    {/* European Union - GDPR */}
                    <div className="flex items-start justify-between p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">🇪🇺</span>
                          <p className="font-semibold text-gray-900">European Union</p>
                        </div>
                        <p className="text-xs text-gray-600">GDPR (General Data Protection Regulation)</p>
                        <p className="text-xs text-gray-500 mt-1">EU data protection rules</p>
                      </div>
                      <Switch
                        checked={jurisdictionSwitches.EU}
                        onCheckedChange={checked => setJurisdictionSwitches(prev => ({ ...prev, EU: checked }))}
                      />
                    </div>

                    {/* United States - CCPA */}
                    <div className="flex items-start justify-between p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">🇺🇸</span>
                          <p className="font-semibold text-gray-900">United States (California)</p>
                        </div>
                        <p className="text-xs text-gray-600">CCPA (California Consumer Privacy Act)</p>
                        <p className="text-xs text-gray-500 mt-1">California privacy rules</p>
                      </div>
                      <Switch
                        checked={jurisdictionSwitches.US}
                        onCheckedChange={checked => setJurisdictionSwitches(prev => ({ ...prev, US: checked }))}
                      />
                    </div>

                    {/* United Kingdom */}
                    <div className="flex items-start justify-between p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">🇬🇧</span>
                          <p className="font-semibold text-gray-900">United Kingdom</p>
                        </div>
                        <p className="text-xs text-gray-600">UK GDPR & Data Protection Act 2018</p>
                        <p className="text-xs text-gray-500 mt-1">Post-Brexit UK data protection</p>
                      </div>
                      <Switch
                        checked={jurisdictionSwitches.UK}
                        onCheckedChange={checked => setJurisdictionSwitches(prev => ({ ...prev, UK: checked }))}
                      />
                    </div>

                    {/* Canada */}
                    <div className="flex items-start justify-between p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">🇨🇦</span>
                          <p className="font-semibold text-gray-900">Canada</p>
                        </div>
                        <p className="text-xs text-gray-600">PIPEDA</p>
                        <p className="text-xs text-gray-500 mt-1">Personal Information Protection Act</p>
                      </div>
                      <Switch
                        checked={jurisdictionSwitches.Canada}
                        onCheckedChange={checked => setJurisdictionSwitches(prev => ({ ...prev, Canada: checked }))}
                      />
                    </div>

                    {/* Singapore */}
                    <div className="flex items-start justify-between p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">🇸🇬</span>
                          <p className="font-semibold text-gray-900">Singapore</p>
                        </div>
                        <p className="text-xs text-gray-600">PDPA (Personal Data Protection Act)</p>
                        <p className="text-xs text-gray-500 mt-1">Singapore data protection rules</p>
                      </div>
                      <Switch
                        checked={jurisdictionSwitches.Singapore}
                        onCheckedChange={checked => setJurisdictionSwitches(prev => ({ ...prev, Singapore: checked }))}
                      />
                    </div>

                    {/* New Zealand */}
                    <div className="flex items-start justify-between p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">🇳🇿</span>
                          <p className="font-semibold text-gray-900">New Zealand</p>
                        </div>
                        <p className="text-xs text-gray-600">Privacy Act 2020</p>
                        <p className="text-xs text-gray-500 mt-1">13 NZ Privacy Principles</p>
                      </div>
                      <Switch
                        checked={jurisdictionSwitches.NZ}
                        onCheckedChange={checked => setJurisdictionSwitches(prev => ({ ...prev, NZ: checked }))}
                      />
                    </div>

                    {/* Hong Kong */}
                    <div className="flex items-start justify-between p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">🇭🇰</span>
                          <p className="font-semibold text-gray-900">Hong Kong</p>
                        </div>
                        <p className="text-xs text-gray-600">PDPO (Personal Data Privacy Ordinance)</p>
                        <p className="text-xs text-gray-500 mt-1">Hong Kong privacy protection</p>
                      </div>
                      <Switch
                        checked={jurisdictionSwitches.HK}
                        onCheckedChange={checked => setJurisdictionSwitches(prev => ({ ...prev, HK: checked }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Compliance Impact Notice */}
                <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-300">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">Compliance Impact</p>
                      <p className="text-xs text-amber-700 mt-1">
                        Enabling compliance modes will activate additional data protection controls, consent requirements, 
                        right-to-access workflows, and data retention policies specific to each jurisdiction. This may affect 
                        how client data is collected, stored, and processed.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-2 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-600" />
                  Security & Authentication
                </CardTitle>
                <CardDescription>
                  Advanced security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-semibold text-gray-900">Require MFA for all users</p>
                      <p className="text-xs text-gray-600">Multi-factor authentication</p>
                    </div>
                    <Switch
                      checked={requireMfa}
                      onCheckedChange={setRequireMfa}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-semibold text-gray-900">SSO / SAML Integration</p>
                      <p className="text-xs text-gray-600">Single sign-on</p>
                    </div>
                    <Switch
                      checked={ssoIntegration}
                      onCheckedChange={setSSOIntegration}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-semibold text-gray-900">IP Whitelisting</p>
                      <p className="text-xs text-gray-600">Restrict access by IP</p>
                    </div>
                    <Switch
                      checked={ipWhitelisting}
                      onCheckedChange={setIpWhitelisting}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-semibold text-gray-900">Session timeout</p>
                      <p className="text-xs text-gray-600">Auto-logout after inactivity</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={sessionTimeout}
                        onChange={e => setSessionTimeout(Number(e.target.value))}
                        className="w-20 border-2 bg-white"
                      />
                      <span className="text-xs">min</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audit & Export */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  Audit Log & Data Export
                </CardTitle>
                <CardDescription>
                  Export data and audit trails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline" onClick={() => showToast('Exporting complete audit log...', 'success')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Complete Audit Log
                </Button>
                <Button className="w-full" variant="outline" onClick={() => showToast('Exporting all client data...', 'success')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export All Client Data
                </Button>
                <Button className="w-full" variant="outline" onClick={() => showToast('Exporting risk & compliance reports...', 'success')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Risk & Compliance Reports
                </Button>
                <Button className="w-full" variant="outline" onClick={() => showToast('Exporting case management data...', 'success')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Case Management Data
                </Button>
              </CardContent>
            </Card>

            {/* SaaS Migration Notice */}
            <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Crown className="w-8 h-8 text-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg text-purple-900 mb-2">Stage 2: SaaS Transformation Ready</h3>
                    <p className="text-sm text-purple-800 mb-3">
                      This platform is architected for multi-tenant SaaS deployment. Stage 2 will include:
                    </p>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Full white-labeling per tenant</li>
                      <li>• Custom domain mapping</li>
                      <li>• Tenant isolation & data segregation</li>
                      <li>• Usage-based billing automation</li>
                      <li>• Tenant admin portals</li>
                      <li>• API key management per tenant</li>
                      <li>• Centralized platform admin dashboard</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

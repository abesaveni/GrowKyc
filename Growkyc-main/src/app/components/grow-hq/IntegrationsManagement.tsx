import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Key,
  Link as LinkIcon,
  DollarSign,
  Mail,
  MessageSquare,
  FileText,
  Cloud,
  Shield,
  CreditCard,
  Building2,
  Phone,
  Search,
  Calendar,
  Users,
  Clock,
  Zap,
  Database,
  Lock,
  Globe,
  Webhook,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  CheckCheck,
  ExternalLink,
  Package
} from 'lucide-react';

interface IntegrationsManagementProps {
  onBack?: () => void;
}

type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending';
type IntegrationType = 'payment' | 'accounting' | 'banking' | 'communication' | 'document' | 'storage' | 'identity' | 'credit' | 'property' | 'registry' | 'auth' | 'notification' | 'analytics' | 'support';

interface Integration {
  id: string;
  name: string;
  description: string;
  type: IntegrationType;
  icon: any;
  status: IntegrationStatus;
  required: boolean;
  modules: string[];
  features: string[];
  setupRequired: string[];
  cost?: string;
  documentation?: string;
}

const integrations: Integration[] = [
  // Payment Processing
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and subscription billing',
    type: 'payment',
    icon: CreditCard,
    status: 'connected',
    required: true,
    modules: ['grow_payments', 'grow_time', 'grow_crm'],
    features: ['Credit card processing', 'ACH/Bank transfers', 'Subscription billing', 'Invoicing', 'Refunds'],
    setupRequired: ['API Keys', 'Webhook endpoint', 'Payment methods'],
    cost: '2.9% + 30Â¢ per transaction',
    documentation: 'https://stripe.com/docs'
  },
  {
    id: 'square',
    name: 'Square',
    description: 'Alternative payment processor',
    type: 'payment',
    icon: CreditCard,
    status: 'disconnected',
    required: false,
    modules: ['grow_payments'],
    features: ['Card payments', 'In-person payments', 'Invoicing'],
    setupRequired: ['Application ID', 'Access token'],
    cost: '2.6% + 10Â¢ per transaction'
  },

  // Accounting Software
  {
    id: 'xero',
    name: 'Xero',
    description: 'Cloud accounting software integration',
    type: 'accounting',
    icon: Building2,
    status: 'connected',
    required: false,
    modules: ['grow_accounting', 'grow_time', 'grow_trust'],
    features: ['Invoice sync', 'Trial balance import', 'Bank reconciliation', 'Contact sync', 'Chart of accounts'],
    setupRequired: ['OAuth connection', 'Organization mapping', 'Chart of accounts mapping'],
    documentation: 'https://developer.xero.com'
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks Online',
    description: 'Intuit accounting platform',
    type: 'accounting',
    icon: Building2,
    status: 'disconnected',
    required: false,
    modules: ['grow_accounting', 'grow_time'],
    features: ['Invoice sync', 'Expense tracking', 'Bank feeds', 'Payroll integration'],
    setupRequired: ['OAuth connection', 'Company selection']
  },
  {
    id: 'myob',
    name: 'MYOB AccountRight',
    description: 'Australian accounting software',
    type: 'accounting',
    icon: Building2,
    status: 'disconnected',
    required: false,
    modules: ['grow_accounting', 'grow_time'],
    features: ['Invoice sync', 'Bank feeds', 'GST reporting', 'Payroll'],
    setupRequired: ['API Key', 'Company file selection']
  },

  // Banking
  {
    id: 'plaid',
    name: 'Plaid',
    description: 'Bank account aggregation and verification',
    type: 'banking',
    icon: Building2,
    status: 'connected',
    required: false,
    modules: ['grow_trust', 'grow_accounting', 'grow_lending'],
    features: ['Bank account verification', 'Transaction feeds', 'Balance checks', 'Identity verification'],
    setupRequired: ['Client ID', 'Secret key', 'Environment selection'],
    cost: '$0.10-0.30 per verification'
  },
  {
    id: 'yodlee',
    name: 'Yodlee',
    description: 'Bank data aggregation (Australia)',
    type: 'banking',
    icon: Building2,
    status: 'disconnected',
    required: false,
    modules: ['grow_trust', 'grow_accounting'],
    features: ['Bank feeds', 'Transaction categorization', 'Multi-bank support'],
    setupRequired: ['Cobrand credentials', 'API credentials']
  },

  // Email Services
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Transactional and marketing emails',
    type: 'communication',
    icon: Mail,
    status: 'connected',
    required: true,
    modules: ['All modules'],
    features: ['Transactional emails', 'Email templates', 'Delivery tracking', 'Bounce management'],
    setupRequired: ['API Key', 'Sender authentication', 'Domain verification'],
    cost: 'Free tier: 100 emails/day, Paid: from $19.95/mo'
  },
  {
    id: 'gmail',
    name: 'Gmail/Google Workspace',
    description: 'Email integration and sync',
    type: 'communication',
    icon: Mail,
    status: 'connected',
    required: false,
    modules: ['grow_crm', 'grow_accounting', 'grow_lending'],
    features: ['Email sync', '2-way sync', 'Contact sync', 'Calendar integration'],
    setupRequired: ['OAuth connection', 'Mailbox selection']
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook/365',
    description: 'Microsoft email integration',
    type: 'communication',
    icon: Mail,
    status: 'disconnected',
    required: false,
    modules: ['grow_crm', 'grow_accounting', 'grow_lending'],
    features: ['Email sync', 'Calendar sync', 'Contact sync', 'Teams integration'],
    setupRequired: ['OAuth connection', 'Tenant configuration']
  },

  // SMS/Communications
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'SMS, voice, and 2FA services',
    type: 'communication',
    icon: MessageSquare,
    status: 'connected',
    required: true,
    modules: ['All modules'],
    features: ['SMS notifications', 'SMS 2FA', 'Voice calls', 'WhatsApp integration'],
    setupRequired: ['Account SID', 'Auth token', 'Phone number'],
    cost: 'Pay as you go, ~$0.0075 per SMS'
  },
  {
    id: 'messagemedia',
    name: 'MessageMedia',
    description: 'Australian SMS provider',
    type: 'communication',
    icon: MessageSquare,
    status: 'disconnected',
    required: false,
    modules: ['All modules'],
    features: ['SMS notifications', 'Delivery reports', 'Australian numbers'],
    setupRequired: ['API Key', 'API Secret']
  },

  // Document Signing
  {
    id: 'docusign',
    name: 'DocuSign',
    description: 'Electronic signature platform',
    type: 'document',
    icon: FileText,
    status: 'connected',
    required: false,
    modules: ['grow_documents', 'grow_lending', 'grow_settlement', 'Grow MIP'],
    features: ['E-signatures', 'Document templates', 'Signing workflows', 'Audit trails'],
    setupRequired: ['Integration key', 'Account ID', 'OAuth configuration'],
    cost: 'From $10/user/month'
  },
  {
    id: 'adobe_sign',
    name: 'Adobe Sign',
    description: 'Adobe e-signature solution',
    type: 'document',
    icon: FileText,
    status: 'disconnected',
    required: false,
    modules: ['grow_documents', 'grow_lending', 'grow_settlement'],
    features: ['E-signatures', 'Form filling', 'Mobile signing', 'Integrations'],
    setupRequired: ['Integration key', 'Webhook setup']
  },

  // Cloud Storage
  {
    id: 'aws_s3',
    name: 'Amazon S3',
    description: 'Primary document storage',
    type: 'storage',
    icon: Cloud,
    status: 'connected',
    required: true,
    modules: ['grow_documents', 'All modules'],
    features: ['Document storage', 'Backup', 'CDN delivery', 'Versioning'],
    setupRequired: ['Access Key ID', 'Secret Access Key', 'Bucket name', 'Region'],
    cost: '$0.023 per GB/month'
  },
  {
    id: 'google_drive',
    name: 'Google Drive',
    description: 'Google cloud storage integration',
    type: 'storage',
    icon: Cloud,
    status: 'connected',
    required: false,
    modules: ['grow_documents'],
    features: ['Document sync', 'Real-time collaboration', 'File sharing'],
    setupRequired: ['OAuth connection', 'Folder mapping']
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Cloud file storage and sharing',
    type: 'storage',
    icon: Cloud,
    status: 'disconnected',
    required: false,
    modules: ['grow_documents'],
    features: ['File sync', 'Team folders', 'File requests'],
    setupRequired: ['OAuth connection', 'Folder structure']
  },

  // Identity Verification
  {
    id: 'greenid',
    name: 'GreenID',
    description: 'Australian identity verification (AML/CTF)',
    type: 'identity',
    icon: Shield,
    status: 'connected',
    required: true,
    modules: ['Grow MIP', 'grow_lending', 'grow_trust', 'grow_investments'],
    features: ['ID document verification', 'AML/CTF checks', 'DVS checks', 'Biometric verification'],
    setupRequired: ['Account ID', 'API password', 'Environment'],
    cost: '$2-5 per verification'
  },
  {
    id: 'onfido',
    name: 'Onfido',
    description: 'Global identity verification',
    type: 'identity',
    icon: Shield,
    status: 'disconnected',
    required: false,
    modules: ['Grow MIP', 'grow_lending'],
    features: ['Document verification', 'Facial recognition', 'AML checks'],
    setupRequired: ['API token', 'Webhook configuration']
  },
  {
    id: 'ocr_space',
    name: 'OCR.space',
    description: 'Document OCR and data extraction',
    type: 'identity',
    icon: FileText,
    status: 'connected',
    required: false,
    modules: ['grow_documents', 'grow_accounting'],
    features: ['Text extraction', 'ID parsing', 'Invoice parsing'],
    setupRequired: ['API Key'],
    cost: 'Free tier available, paid from $60/mo'
  },

  // Credit Reporting
  {
    id: 'equifax',
    name: 'Equifax',
    description: 'Credit reporting and risk assessment',
    type: 'credit',
    icon: CreditCard,
    status: 'connected',
    required: false,
    modules: ['grow_lending', 'Grow MIP'],
    features: ['Credit checks', 'Credit scores', 'Bankruptcy searches', 'Company searches'],
    setupRequired: ['Customer code', 'Username', 'Password', 'Security certificate'],
    cost: '$5-30 per check'
  },
  {
    id: 'illion',
    name: 'illion (Dun & Bradstreet)',
    description: 'Business and consumer credit',
    type: 'credit',
    icon: CreditCard,
    status: 'disconnected',
    required: false,
    modules: ['grow_lending'],
    features: ['Credit reports', 'Business checks', 'Trade references'],
    setupRequired: ['API credentials', 'Product selection']
  },

  // Property Data
  {
    id: 'corelogic',
    name: 'CoreLogic',
    description: 'Property data and valuations',
    type: 'property',
    icon: Building2,
    status: 'connected',
    required: false,
    modules: ['grow_lending', 'Grow MIP', 'grow_settlement'],
    features: ['Property valuations', 'Title searches', 'Sales history', 'Market data'],
    setupRequired: ['API credentials', 'Product selection'],
    cost: 'Per report pricing'
  },
  {
    id: 'domain',
    name: 'Domain.com.au',
    description: 'Property listings and data',
    type: 'property',
    icon: Building2,
    status: 'disconnected',
    required: false,
    modules: ['grow_lending', 'Grow MIP'],
    features: ['Property listings', 'Suburb data', 'Price estimates'],
    setupRequired: ['API Key']
  },

  // Registry Services
  {
    id: 'abr',
    name: 'ABR (ABN Lookup)',
    description: 'Australian Business Register',
    type: 'registry',
    icon: Search,
    status: 'connected',
    required: false,
    modules: ['grow_crm', 'grow_accounting', 'grow_lending'],
    features: ['ABN validation', 'Business name lookup', 'GST status', 'Entity details'],
    setupRequired: ['GUID (free registration)'],
    cost: 'Free'
  },
  {
    id: 'asic',
    name: 'ASIC Connect',
    description: 'Company and director searches',
    type: 'registry',
    icon: Search,
    status: 'connected',
    required: false,
    modules: ['grow_lending', 'grow_receivership', 'grow_investments'],
    features: ['Company extracts', 'Director searches', 'Historical documents', 'Shareholder info'],
    setupRequired: ['ASIC Connect account', 'Credit card on file'],
    cost: 'Per search fees'
  },
  {
    id: 'ppsr',
    name: 'PPSR',
    description: 'Personal Property Securities Register',
    type: 'registry',
    icon: Shield,
    status: 'disconnected',
    required: false,
    modules: ['grow_lending', 'grow_receivership'],
    features: ['Security registrations', 'Priority searches', 'Financing statements'],
    setupRequired: ['PPSR account', 'Access seeker ID']
  },

  // Authentication
  {
    id: 'azure_ad',
    name: 'Azure Active Directory',
    description: 'Microsoft SSO and user management',
    type: 'auth',
    icon: Lock,
    status: 'disconnected',
    required: false,
    modules: ['grow_hq'],
    features: ['Single Sign-On', 'SAML 2.0', 'User provisioning', 'MFA'],
    setupRequired: ['Tenant ID', 'Application ID', 'Client secret', 'SAML configuration']
  },
  {
    id: 'google_workspace',
    name: 'Google Workspace SSO',
    description: 'Google single sign-on',
    type: 'auth',
    icon: Lock,
    status: 'disconnected',
    required: false,
    modules: ['grow_hq'],
    features: ['Single Sign-On', 'User provisioning', 'Google MFA'],
    setupRequired: ['OAuth connection', 'Domain verification']
  },
  {
    id: 'auth0',
    name: 'Auth0',
    description: 'Universal authentication platform',
    type: 'auth',
    icon: Lock,
    status: 'connected',
    required: true,
    modules: ['grow_hq', 'All modules'],
    features: ['Authentication', 'MFA', 'Social login', 'Passwordless', 'User management'],
    setupRequired: ['Domain', 'Client ID', 'Client secret', 'Callback URLs'],
    cost: 'Free tier: 7,000 active users, Paid from $23/mo'
  },

  // Notifications
  {
    id: 'pusher',
    name: 'Pusher',
    description: 'Real-time notifications and websockets',
    type: 'notification',
    icon: Zap,
    status: 'connected',
    required: false,
    modules: ['All modules'],
    features: ['Real-time updates', 'Push notifications', 'Presence channels', 'Broadcasting'],
    setupRequired: ['App ID', 'Key', 'Secret', 'Cluster'],
    cost: 'Free tier: 200k messages/day, Paid from $49/mo'
  },

  // Analytics
  {
    id: 'google_analytics',
    name: 'Google Analytics 4',
    description: 'Web analytics and tracking',
    type: 'analytics',
    icon: Database,
    status: 'connected',
    required: false,
    modules: ['All modules'],
    features: ['Usage tracking', 'User behavior', 'Conversion tracking', 'Custom events'],
    setupRequired: ['Measurement ID', 'Property configuration'],
    cost: 'Free'
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    description: 'Product analytics',
    type: 'analytics',
    icon: Database,
    status: 'disconnected',
    required: false,
    modules: ['All modules'],
    features: ['Event tracking', 'Funnel analysis', 'Cohort analysis', 'A/B testing'],
    setupRequired: ['Project token']
  },

  // Customer Support
  {
    id: 'intercom',
    name: 'Intercom',
    description: 'Customer messaging platform',
    type: 'support',
    icon: MessageSquare,
    status: 'connected',
    required: false,
    modules: ['All modules'],
    features: ['Live chat', 'Help center', 'Product tours', 'Email support'],
    setupRequired: ['App ID', 'Identity verification'],
    cost: 'From $39/seat/month'
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    description: 'Customer support ticketing',
    type: 'support',
    icon: MessageSquare,
    status: 'disconnected',
    required: false,
    modules: ['All modules'],
    features: ['Ticketing', 'Knowledge base', 'Live chat', 'Call center'],
    setupRequired: ['Subdomain', 'API token']
  },

  // Webhooks & API
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Workflow automation platform',
    type: 'notification',
    icon: Zap,
    status: 'connected',
    required: false,
    modules: ['All modules'],
    features: ['No-code automation', '5,000+ app integrations', 'Multi-step workflows'],
    setupRequired: ['API key', 'Webhook configuration'],
    cost: 'Free tier: 100 tasks/month, Paid from $19.99/mo'
  }
];

const typeColors = {
  payment: 'bg-green-500/15 text-green-300 border-green-300',
  accounting: 'bg-blue-500/15 text-blue-300 border-blue-300',
  banking: 'bg-purple-500/15 text-purple-300 border-purple-300',
  communication: 'bg-orange-500/15 text-orange-300 border-orange-300',
  document: 'bg-pink-500/15 text-pink-300 border-pink-300',
  storage: 'bg-indigo-500/15 text-indigo-300 border-indigo-300',
  identity: 'bg-red-500/15 text-red-300 border-red-300',
  credit: 'bg-yellow-500/15 text-yellow-300 border-yellow-300',
  property: 'bg-teal-500/15 text-teal-300 border-teal-300',
  registry: 'bg-cyan-500/15 text-cyan-300 border-cyan-300',
  auth: 'bg-white/5 text-slate-300 border-white/10',
  notification: 'bg-amber-500/15 text-amber-300 border-amber-300',
  analytics: 'bg-violet-500/15 text-violet-300 border-violet-300',
  support: 'bg-rose-500/15 text-rose-300 border-rose-300'
};

export function IntegrationsManagement({ onBack }: IntegrationsManagementProps) {
  const [selectedType, setSelectedType] = useState<IntegrationType | 'all'>('all');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  const filteredIntegrations = selectedType === 'all' 
    ? integrations 
    : integrations.filter(i => i.type === selectedType);

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const requiredCount = integrations.filter(i => i.required).length;
  const requiredConnected = integrations.filter(i => i.required && i.status === 'connected').length;

  const integrationTypes = [
    { id: 'all', label: 'All Integrations', count: integrations.length },
    { id: 'payment', label: 'Payments', count: integrations.filter(i => i.type === 'payment').length },
    { id: 'accounting', label: 'Accounting', count: integrations.filter(i => i.type === 'accounting').length },
    { id: 'banking', label: 'Banking', count: integrations.filter(i => i.type === 'banking').length },
    { id: 'communication', label: 'Communications', count: integrations.filter(i => i.type === 'communication').length },
    { id: 'document', label: 'Documents', count: integrations.filter(i => i.type === 'document').length },
    { id: 'storage', label: 'Storage', count: integrations.filter(i => i.type === 'storage').length },
    { id: 'identity', label: 'Identity/KYC', count: integrations.filter(i => i.type === 'identity').length },
    { id: 'credit', label: 'Credit', count: integrations.filter(i => i.type === 'credit').length },
    { id: 'property', label: 'Property', count: integrations.filter(i => i.type === 'property').length },
    { id: 'registry', label: 'Registries', count: integrations.filter(i => i.type === 'registry').length },
    { id: 'auth', label: 'Authentication', count: integrations.filter(i => i.type === 'auth').length },
    { id: 'notification', label: 'Notifications', count: integrations.filter(i => i.type === 'notification').length },
    { id: 'analytics', label: 'Analytics', count: integrations.filter(i => i.type === 'analytics').length },
    { id: 'support', label: 'Support', count: integrations.filter(i => i.type === 'support').length }
  ];

  return (
    <div className="min-h-screen bg-white/5 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Grow HQ
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Platform Integrations</h1>
              <p className="text-slate-300 mt-2">
                Manage all third-party integrations and API connections
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Integration
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Total Integrations</p>
                  <p className="text-3xl font-bold text-slate-100 mt-1">{integrations.length}</p>
                </div>
                <LinkIcon className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Connected</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">{connectedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Required</p>
                  <p className="text-3xl font-bold text-orange-400 mt-1">{requiredConnected}/{requiredCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Platform Health</p>
                  <p className="text-3xl font-bold text-green-400 mt-1">
                    {Math.round((connectedCount / integrations.length) * 100)}%
                  </p>
                </div>
                <Zap className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Required Setup Alert */}
        {requiredConnected < requiredCount && (
          <Card className="border-2 border-orange-300 bg-orange-500/10">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-orange-300 mb-2">Action Required: Critical Integrations Missing</h3>
                  <p className="text-sm text-orange-300 mb-3">
                    {requiredCount - requiredConnected} required integration{requiredCount - requiredConnected !== 1 ? 's' : ''} must be configured before the platform can operate properly.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {integrations
                      .filter(i => i.required && i.status !== 'connected')
                      .map(integration => (
                        <Button
                          key={integration.id}
                          size="sm"
                          variant="outline"
                          className="border-orange-600 text-orange-300 hover:bg-orange-500/15"
                          onClick={() => setSelectedIntegration(integration)}
                        >
                          Configure {integration.name}
                        </Button>
                      ))
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter Tabs */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {integrationTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as IntegrationType | 'all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedType === type.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {type.label}
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                    {type.count}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => {
            const Icon = integration.icon;
            const statusConfig = {
              connected: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-300', label: 'Connected' },
              disconnected: { icon: XCircle, color: 'text-slate-300', bg: 'bg-white/5', border: 'border-white/10', label: 'Not Connected' },
              error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-300', label: 'Error' },
              pending: { icon: RefreshCw, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-300', label: 'Pending' }
            };
            const status = statusConfig[integration.status];
            const StatusIcon = status.icon;

            return (
              <Card
                key={integration.id}
                className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                  integration.required && integration.status !== 'connected'
                    ? 'border-orange-300'
                    : integration.status === 'connected'
                    ? 'border-green-300'
                    : 'border-white/10'
                }`}
                onClick={() => setSelectedIntegration(integration)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${status.bg}`}>
                      <Icon className={`w-6 h-6 ${status.color}`} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${status.bg} ${status.border} border`}>
                        <StatusIcon className={`w-3 h-3 ${status.color}`} />
                        <span className={`text-xs font-semibold ${status.color}`}>{status.label}</span>
                      </div>
                      {integration.required && (
                        <span className="px-2 py-1 bg-orange-500/15 text-orange-300 text-xs font-semibold rounded border border-orange-300">
                          Required
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-100 mb-2">{integration.name}</h3>
                  <p className="text-sm text-slate-300 mb-4 line-clamp-2">{integration.description}</p>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-300 mb-1">Type</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${typeColors[integration.type]}`}>
                        {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-300 mb-1">Used By</p>
                      <div className="flex flex-wrap gap-1">
                        {integration.modules.slice(0, 3).map((module, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-500/10 text-blue-300 text-xs rounded border border-blue-500/30">
                            {module === 'All modules' ? 'All' : module.replace('grow_', '').replace('_', ' ')}
                          </span>
                        ))}
                        {integration.modules.length > 3 && (
                          <span className="px-2 py-0.5 bg-white/5 text-slate-300 text-xs rounded">
                            +{integration.modules.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {integration.cost && (
                      <div>
                        <p className="text-xs font-semibold text-slate-300 mb-1">Cost</p>
                        <p className="text-xs text-slate-300">{integration.cost}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Button
                      size="sm"
                      className="w-full"
                      variant={integration.status === 'connected' ? 'outline' : 'default'}
                    >
                      {integration.status === 'connected' ? (
                        <>
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Integration Detail Modal */}
        {selectedIntegration && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="border-b bg-white/5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      selectedIntegration.status === 'connected' ? 'bg-green-500/15' : 'bg-white/5'
                    }`}>
                      <selectedIntegration.icon className={`w-8 h-8 ${
                        selectedIntegration.status === 'connected' ? 'text-green-400' : 'text-slate-300'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{selectedIntegration.name}</CardTitle>
                      <p className="text-sm text-slate-300 mt-1">{selectedIntegration.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedIntegration.status === 'connected'
                            ? 'bg-green-500/15 text-green-300 border border-green-300'
                            : 'bg-white/5 text-slate-300 border border-white/10'
                        }`}>
                          {selectedIntegration.status === 'connected' ? 'Connected' : 'Not Connected'}
                        </span>
                        {selectedIntegration.required && (
                          <span className="px-3 py-1 bg-orange-500/15 text-orange-300 text-xs font-semibold rounded border border-orange-300">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedIntegration(null)}
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Features */}
                <div>
                  <h3 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedIntegration.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-white/5 rounded">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Setup Requirements */}
                <div>
                  <h3 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-orange-400" />
                    Setup Requirements
                  </h3>
                  <div className="space-y-2">
                    {selectedIntegration.setupRequired.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-orange-500/10 rounded border border-orange-500/30">
                        <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-orange-300 font-medium">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modules */}
                <div>
                  <h3 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-400" />
                    Used By Modules
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIntegration.modules.map((module, idx) => (
                      <span key={idx} className="px-3 py-2 bg-blue-500/10 text-blue-300 text-sm font-medium rounded border border-blue-500/30">
                        {module === 'All modules' ? 'All Modules' : module.replace('grow_', 'Grow ').replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Configuration Form */}
                {selectedIntegration.status === 'connected' ? (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-100 flex items-center gap-2">
                      <Key className="w-5 h-5 text-slate-300" />
                      Configuration
                    </h3>
                    
                    <div className="p-4 bg-green-500/10 border border-green-300 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-300">Integration Active</p>
                          <p className="text-sm text-green-300 mt-1">
                            Last verified: 2 hours ago
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          API Key
                        </label>
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <input
                              type={showApiKeys[selectedIntegration.id] ? 'text' : 'password'}
                              value="sk_live_â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                              readOnly
                              className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 font-mono text-sm"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowApiKeys({
                              ...showApiKeys,
                              [selectedIntegration.id]: !showApiKeys[selectedIntegration.id]
                            })}
                          >
                            {showApiKeys[selectedIntegration.id] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Webhook URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={`https://api.growplatform.com/webhooks/${selectedIntegration.id}`}
                            readOnly
                            className="flex-1 px-3 py-2 border border-white/10 rounded-lg bg-white/5 font-mono text-sm"
                          />
                          <Button variant="outline" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Environment
                        </label>
                        <select className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white">
                          <option>Production</option>
                          <option>Sandbox/Test</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                      <Button className="flex-1" variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Test Connection
                      </Button>
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <CheckCheck className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" className="text-red-400 border-red-300 hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-100 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-blue-400" />
                      Connect Integration
                    </h3>

                    <div className="p-4 bg-blue-500/10 border border-blue-300 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-blue-300">Setup Instructions</p>
                          <ol className="text-sm text-blue-300 mt-2 space-y-1 list-decimal list-inside">
                            <li>Create an account with {selectedIntegration.name}</li>
                            <li>Obtain your API credentials from their dashboard</li>
                            <li>Enter the credentials below</li>
                            <li>Test the connection to verify</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedIntegration.setupRequired.map((field, idx) => (
                        <div key={idx}>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            {field}
                          </label>
                          <input
                            type="text"
                            placeholder={`Enter ${field.toLowerCase()}`}
                            className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>

                    {selectedIntegration.documentation && (
                      <a
                        href={selectedIntegration.documentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View {selectedIntegration.name} Documentation
                      </a>
                    )}

                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => setSelectedIntegration(null)}
                      >
                        Cancel
                      </Button>
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Zap className="w-4 h-4 mr-2" />
                        Connect {selectedIntegration.name}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Cost Information */}
                {selectedIntegration.cost && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-300 rounded-lg">
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-yellow-300 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-300">Pricing</p>
                        <p className="text-sm text-yellow-300 mt-1">{selectedIntegration.cost}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

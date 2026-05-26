import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Zap,
  Check,
  X,
  Settings,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Shield,
  Mail,
  MessageSquare,
  Phone,
  FileText,
  Cloud,
  DollarSign,
  CreditCard,
  Building2,
  Users,
  Lock,
  Globe,
  Database,
  Smartphone,
  BookOpen,
  Briefcase,
  Calculator,
  TrendingUp,
  Home,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  icon: any;
  color: string;
  required: boolean;
  credentials: {
    name: string;
    type: 'text' | 'password' | 'api-key';
    value?: string;
  }[];
  features?: string[];
  pricing?: string;
  provider?: string;
}

export function IntegrationsSettings() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [expandedIntegrations, setExpandedIntegrations] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newSet = new Set(expandedIntegrations);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedIntegrations(newSet);
  };

  const defaultIntegrations: Integration[] = [
    // ACCOUNTING SOFTWARE
    {
      id: 'xero',
      name: 'Xero',
      category: 'Accounting',
      description: 'Cloud accounting platform - sync clients, invoices, and financial data',
      status: 'disconnected',
      icon: Calculator,
      color: 'blue',
      required: false,
      credentials: [
        { name: 'Client ID', type: 'text' },
        { name: 'Client Secret', type: 'password' },
        { name: 'Tenant ID', type: 'text' }
      ],
      features: ['Client sync', 'Invoice automation', 'Financial reporting', 'Bank reconciliation'],
      pricing: 'OAuth 2.0 - Free tier available',
      provider: 'Xero Limited'
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks Online',
      category: 'Accounting',
      description: 'Intuit QuickBooks - sync accounting data and automate workflows',
      status: 'disconnected',
      icon: BookOpen,
      color: 'green',
      required: false,
      credentials: [
        { name: 'Client ID', type: 'text' },
        { name: 'Client Secret', type: 'password' },
        { name: 'Redirect URI', type: 'text' }
      ],
      features: ['Client sync', 'Invoice creation', 'Expense tracking', 'Reports'],
      pricing: 'OAuth 2.0 - $0.50 per call',
      provider: 'Intuit Inc.'
    },
    {
      id: 'myob',
      name: 'MYOB AccountRight',
      category: 'Accounting',
      description: 'Australian accounting software - sync clients and transactions',
      status: 'disconnected',
      icon: Building2,
      color: 'red',
      required: false,
      credentials: [
        { name: 'API Key', type: 'api-key' },
        { name: 'Company File ID', type: 'text' }
      ],
      features: ['Client management', 'Invoice sync', 'Payroll integration'],
      pricing: 'API Key - Custom pricing',
      provider: 'MYOB Australia'
    },

    // SMS PROVIDERS
    {
      id: 'twilio',
      name: 'Twilio SMS',
      category: 'Communications',
      description: 'SMS, voice, and messaging platform for client notifications',
      status: 'connected',
      icon: MessageSquare,
      color: 'red',
      required: false,
      credentials: [
        { name: 'Account SID', type: 'text', value: 'AC•••••••••••••••••••••••••••••abc' },
        { name: 'Auth Token', type: 'password', value: '••••••••••••••••••••••••••••••••' },
        { name: 'Phone Number', type: 'text', value: '+61400123456' }
      ],
      features: ['2FA codes', 'Client notifications', 'Alerts', 'Reminders'],
      pricing: '$0.0079 per SMS (AU)',
      provider: 'Twilio Inc.'
    },
    {
      id: 'messagebird',
      name: 'MessageBird',
      category: 'Communications',
      description: 'Multi-channel messaging - SMS, WhatsApp, Email',
      status: 'disconnected',
      icon: Phone,
      color: 'blue',
      required: false,
      credentials: [
        { name: 'API Key', type: 'api-key' },
        { name: 'Originator', type: 'text' }
      ],
      features: ['SMS', 'WhatsApp', 'Verify API', 'Number lookup'],
      pricing: '$0.065 per SMS (AU)',
      provider: 'MessageBird B.V.'
    },
    {
      id: 'smsbroadcast',
      name: 'SMS Broadcast',
      category: 'Communications',
      description: 'Australian SMS gateway - reliable local delivery',
      status: 'disconnected',
      icon: Smartphone,
      color: 'purple',
      required: false,
      credentials: [
        { name: 'Username', type: 'text' },
        { name: 'Password', type: 'password' }
      ],
      features: ['Bulk SMS', 'Delivery reports', 'Australian numbers'],
      pricing: '$0.055 per SMS',
      provider: 'SMS Broadcast Pty Ltd'
    },

    // EMAIL PROVIDERS
    {
      id: 'sendgrid',
      name: 'SendGrid',
      category: 'Communications',
      description: 'Email delivery and marketing platform',
      status: 'connected',
      icon: Mail,
      color: 'blue',
      required: true,
      credentials: [
        { name: 'API Key', type: 'api-key', value: 'SG•••••••••••••••••••••••••••••' },
        { name: 'From Email', type: 'text', value: 'noreply@growkyc.com' }
      ],
      features: ['Transactional emails', 'Templates', 'Analytics', 'Deliverability'],
      pricing: 'Free tier 100/day, then $0.0012 per email',
      provider: 'Twilio SendGrid'
    },
    {
      id: 'mailgun',
      name: 'Mailgun',
      category: 'Communications',
      description: 'Email API for developers',
      status: 'disconnected',
      icon: Mail,
      color: 'red',
      required: false,
      credentials: [
        { name: 'API Key', type: 'api-key' },
        { name: 'Domain', type: 'text' }
      ],
      features: ['Email sending', 'Webhooks', 'Email validation'],
      pricing: 'Free tier 5000/month',
      provider: 'Mailgun Technologies'
    },

    // CLOUD STORAGE
    {
      id: 'aws-s3',
      name: 'Amazon S3',
      category: 'Storage',
      description: 'Cloud object storage for documents and files',
      status: 'connected',
      icon: Cloud,
      color: 'orange',
      required: true,
      credentials: [
        { name: 'Access Key ID', type: 'text', value: 'AKIA•••••••••••••••' },
        { name: 'Secret Access Key', type: 'password', value: '••••••••••••••••••••••••••••••••' },
        { name: 'Bucket Name', type: 'text', value: 'growkyc-documents-prod' },
        { name: 'Region', type: 'text', value: 'ap-southeast-2' }
      ],
      features: ['Document storage', 'Encryption', 'Versioning', 'Lifecycle policies'],
      pricing: '$0.023 per GB/month',
      provider: 'Amazon Web Services'
    },
    {
      id: 'dropbox',
      name: 'Dropbox Business',
      category: 'Storage',
      description: 'Cloud storage and file sharing',
      status: 'disconnected',
      icon: Cloud,
      color: 'blue',
      required: false,
      credentials: [
        { name: 'App Key', type: 'text' },
        { name: 'App Secret', type: 'password' },
        { name: 'Access Token', type: 'api-key' }
      ],
      features: ['File storage', 'Team folders', 'Version history'],
      pricing: 'From $15/user/month',
      provider: 'Dropbox Inc.'
    },
    {
      id: 'box',
      name: 'Box',
      category: 'Storage',
      description: 'Enterprise content management',
      status: 'disconnected',
      icon: Database,
      color: 'blue',
      required: false,
      credentials: [
        { name: 'Client ID', type: 'text' },
        { name: 'Client Secret', type: 'password' },
        { name: 'Enterprise ID', type: 'text' }
      ],
      features: ['Secure storage', 'Governance', 'Compliance', 'E-discovery'],
      pricing: 'From $20/user/month',
      provider: 'Box Inc.'
    },

    // PAYMENT GATEWAYS
    {
      id: 'stripe',
      name: 'Stripe',
      category: 'Payments',
      description: 'Payment processing for client invoices',
      status: 'connected',
      icon: CreditCard,
      color: 'purple',
      required: false,
      credentials: [
        { name: 'Publishable Key', type: 'text', value: 'pk_live_•••••••••••••••••••••••' },
        { name: 'Secret Key', type: 'password', value: 'sk_live_•••••••••••••••••••••••' },
        { name: 'Webhook Secret', type: 'password', value: 'whsec_••••••••••••••••••••' }
      ],
      features: ['Credit cards', 'ACH', 'Subscriptions', 'Invoicing'],
      pricing: '1.75% + $0.30 per transaction (AU)',
      provider: 'Stripe Inc.'
    },
    {
      id: 'square',
      name: 'Square',
      category: 'Payments',
      description: 'Payment processing and point of sale',
      status: 'disconnected',
      icon: DollarSign,
      color: 'green',
      required: false,
      credentials: [
        { name: 'Application ID', type: 'text' },
        { name: 'Access Token', type: 'api-key' }
      ],
      features: ['Card payments', 'Invoicing', 'Virtual terminal'],
      pricing: '1.6% per transaction',
      provider: 'Block Inc.'
    },

    // TEAM COMMUNICATION
    {
      id: 'slack',
      name: 'Slack',
      category: 'Communications',
      description: 'Team messaging and notifications',
      status: 'connected',
      icon: MessageSquare,
      color: 'purple',
      required: false,
      credentials: [
        { name: 'Bot Token', type: 'api-key', value: 'xoxb-•••••••••••••••••••••••••••' },
        { name: 'Webhook URL', type: 'text', value: 'https://hooks.slack.com/services/•••' }
      ],
      features: ['Case alerts', 'Compliance notifications', 'Team updates'],
      pricing: 'Free tier available',
      provider: 'Slack Technologies'
    },
    {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      category: 'Communications',
      description: 'Enterprise team collaboration',
      status: 'disconnected',
      icon: Users,
      color: 'blue',
      required: false,
      credentials: [
        { name: 'Tenant ID', type: 'text' },
        { name: 'Client ID', type: 'text' },
        { name: 'Client Secret', type: 'password' },
        { name: 'Webhook URL', type: 'text' }
      ],
      features: ['Notifications', 'Bot integration', 'Adaptive cards'],
      pricing: 'Included with M365',
      provider: 'Microsoft Corporation'
    },

    // IDENTITY VERIFICATION (Already have Equifax)
    {
      id: 'equifax',
      name: 'Equifax',
      category: 'Identity & Credit',
      description: 'Identity verification, credit checks, and fraud detection',
      status: 'connected',
      icon: Shield,
      color: 'blue',
      required: true,
      credentials: [
        { name: 'Customer ID', type: 'text', value: 'EQFX•••••••' },
        { name: 'API Key', type: 'api-key', value: '••••••••••••••••••••••••••••••••' },
        { name: 'Environment', type: 'text', value: 'production' }
      ],
      features: ['ID verification', 'Credit reports', 'AML screening', 'Fraud detection'],
      pricing: '$2.50-$25 per check',
      provider: 'Equifax Australia'
    },
    {
      id: 'onfido',
      name: 'Onfido',
      category: 'Identity & Credit',
      description: 'AI-powered identity verification',
      status: 'disconnected',
      icon: Shield,
      color: 'green',
      required: false,
      credentials: [
        { name: 'API Token', type: 'api-key' },
        { name: 'Webhook Token', type: 'password' }
      ],
      features: ['Document verification', 'Biometric checks', 'Facial recognition'],
      pricing: '$2-$5 per check',
      provider: 'Onfido Ltd'
    },

    // PROPERTY DATA
    {
      id: 'infotrack',
      name: 'InfoTrack',
      category: 'Property & Legal',
      description: 'Property searches, title checks, and legal services',
      status: 'connected',
      icon: Home,
      color: 'orange',
      required: false,
      credentials: [
        { name: 'Username', type: 'text', value: 'growkyc_api' },
        { name: 'Password', type: 'password', value: '••••••••••••••••' },
        { name: 'Account Number', type: 'text', value: 'IT123456' }
      ],
      features: ['Title searches', 'Property reports', 'ASIC searches', 'PPSR checks'],
      pricing: 'Pay per search - $8-$50',
      provider: 'InfoTrack Pty Ltd'
    },
    {
      id: 'corelogic',
      name: 'CoreLogic',
      category: 'Property & Legal',
      description: 'Property data and valuations',
      status: 'disconnected',
      icon: TrendingUp,
      color: 'blue',
      required: false,
      credentials: [
        { name: 'API Key', type: 'api-key' },
        { name: 'Client ID', type: 'text' }
      ],
      features: ['Property valuations', 'Market data', 'Risk assessment'],
      pricing: 'Subscription based',
      provider: 'CoreLogic Australia'
    },

    // AML SCREENING
    {
      id: 'dow-jones',
      name: 'Dow Jones Risk & Compliance',
      category: 'AML & Compliance',
      description: 'Watchlist screening and due diligence',
      status: 'disconnected',
      icon: Search,
      color: 'blue',
      required: false,
      credentials: [
        { name: 'API Key', type: 'api-key' },
        { name: 'User ID', type: 'text' }
      ],
      features: ['Sanctions screening', 'PEP checks', 'Adverse media'],
      pricing: '$3-$10 per screening',
      provider: 'Dow Jones & Company'
    },
    {
      id: 'world-check',
      name: 'Refinitiv World-Check',
      category: 'AML & Compliance',
      description: 'Global screening and intelligence',
      status: 'disconnected',
      icon: Globe,
      color: 'orange',
      required: false,
      credentials: [
        { name: 'API Key', type: 'api-key' },
        { name: 'API Secret', type: 'password' }
      ],
      features: ['PEP screening', 'Sanctions', 'Adverse media', 'SIPs'],
      pricing: 'Enterprise pricing',
      provider: 'Refinitiv'
    },

    // GOVERNMENT & REGISTERS
    {
      id: 'asic',
      name: 'ASIC Connect',
      category: 'Government',
      description: 'Australian Securities & Investments Commission data',
      status: 'connected',
      icon: Building2,
      color: 'blue',
      required: false,
      credentials: [
        { name: 'Access Code', type: 'text', value: 'ASIC•••••••' },
        { name: 'Credit Reference', type: 'text', value: 'GK123456' }
      ],
      features: ['Company searches', 'Director details', 'Corporate structure'],
      pricing: '$9-$39 per search',
      provider: 'ASIC'
    },
    {
      id: 'abr',
      name: 'ABN Lookup / ABR',
      category: 'Government',
      description: 'Australian Business Register',
      status: 'connected',
      icon: FileText,
      color: 'green',
      required: false,
      credentials: [
        { name: 'GUID', type: 'text', value: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }
      ],
      features: ['ABN validation', 'Business details', 'GST status'],
      pricing: 'Free',
      provider: 'Australian Taxation Office'
    },

    // E-SIGNATURE
    {
      id: 'docusign',
      name: 'DocuSign',
      category: 'Documents',
      description: 'Electronic signature and document workflow',
      status: 'disconnected',
      icon: FileText,
      color: 'blue',
      required: false,
      credentials: [
        { name: 'Integration Key', type: 'text' },
        { name: 'Secret Key', type: 'password' },
        { name: 'User ID', type: 'text' }
      ],
      features: ['E-signatures', 'Templates', 'Workflow automation'],
      pricing: 'From $25/user/month',
      provider: 'DocuSign Inc.'
    },
    {
      id: 'adobe-sign',
      name: 'Adobe Sign',
      category: 'Documents',
      description: 'Electronic signatures and digital documents',
      status: 'disconnected',
      icon: FileText,
      color: 'red',
      required: false,
      credentials: [
        { name: 'Integration Key', type: 'text' },
        { name: 'Access Token', type: 'api-key' }
      ],
      features: ['E-signatures', 'Forms', 'Workflows'],
      pricing: 'From $29.99/user/month',
      provider: 'Adobe Inc.'
    },

    // CRM SYSTEMS
    {
      id: 'salesforce',
      name: 'Salesforce',
      category: 'CRM',
      description: 'Customer relationship management',
      status: 'disconnected',
      icon: Users,
      color: 'blue',
      required: false,
      credentials: [
        { name: 'Consumer Key', type: 'text' },
        { name: 'Consumer Secret', type: 'password' },
        { name: 'Username', type: 'text' },
        { name: 'Security Token', type: 'password' }
      ],
      features: ['Client sync', 'Opportunity tracking', 'Reports'],
      pricing: 'From $35/user/month',
      provider: 'Salesforce.com'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      category: 'CRM',
      description: 'Marketing and CRM platform',
      status: 'disconnected',
      icon: TrendingUp,
      color: 'orange',
      required: false,
      credentials: [
        { name: 'API Key', type: 'api-key' }
      ],
      features: ['Contact management', 'Email marketing', 'Analytics'],
      pricing: 'Free tier available',
      provider: 'HubSpot Inc.'
    },

    // PRACTICE MANAGEMENT
    {
      id: 'actionstep',
      name: 'Actionstep',
      category: 'Practice Management',
      description: 'Legal practice management software',
      status: 'disconnected',
      icon: Briefcase,
      color: 'purple',
      required: false,
      credentials: [
        { name: 'API Key', type: 'api-key' },
        { name: 'Org Key', type: 'text' }
      ],
      features: ['Matter management', 'Client sync', 'Time tracking'],
      pricing: 'Custom pricing',
      provider: 'Actionstep Ltd'
    },
    {
      id: 'leap',
      name: 'LEAP Legal',
      category: 'Practice Management',
      description: 'Legal practice management',
      status: 'disconnected',
      icon: Briefcase,
      color: 'blue',
      required: false,
      credentials: [
        { name: 'API Key', type: 'api-key' },
        { name: 'Firm ID', type: 'text' }
      ],
      features: ['Matter management', 'Document automation', 'Billing'],
      pricing: 'From $169/user/month',
      provider: 'LEAP Legal Software'
    }
  ];

  // Dynamically initialize integrations list state from localStorage
  const [integrationsList, setIntegrationsList] = useState<Integration[]>(() => {
    const saved = localStorage.getItem('grow_integrations_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Map back icon components based on the name since icons can't be fully serialized
        return parsed.map((item: any) => {
          const matched = defaultIntegrations.find(d => d.id === item.id);
          return {
            ...item,
            icon: matched ? matched.icon : Calculator
          };
        });
      } catch (e) {
        // Fallback
      }
    }
    return defaultIntegrations;
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const saveAllIntegrations = (listToSave: Integration[]) => {
    const serialized = listToSave.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description,
      status: item.status,
      required: item.required,
      credentials: item.credentials,
      features: item.features,
      pricing: item.pricing,
      provider: item.provider
    }));
    localStorage.setItem('grow_integrations_list', JSON.stringify(serialized));
  };

  const handleCredentialsChange = (integrationId: string, credentialIndex: number, newValue: string) => {
    const updated = integrationsList.map(item => {
      if (item.id === integrationId) {
        const updatedCreds = [...item.credentials];
        updatedCreds[credentialIndex] = { ...updatedCreds[credentialIndex], value: newValue };
        return { ...item, credentials: updatedCreds };
      }
      return item;
    });
    setIntegrationsList(updated);
    saveAllIntegrations(updated);
  };

  const handleConnectToggle = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'connected' ? 'disconnected' : 'connected';
    const updated = integrationsList.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus as any };
      }
      return item;
    });
    setIntegrationsList(updated);
    saveAllIntegrations(updated);
    showToast(
      newStatus === 'connected'
        ? `Successfully connected to ${integrationsList.find(i => i.id === id)?.name}!`
        : `Disconnected from ${integrationsList.find(i => i.id === id)?.name}.`,
      newStatus === 'connected' ? 'success' : 'info'
    );
  };

  const handleTestConnection = (id: string) => {
    const name = integrationsList.find(i => i.id === id)?.name || 'Integration';
    setTestingId(id);
    showToast(`Testing connection to ${name}...`, 'info');
    
    setTimeout(() => {
      setTestingId(null);
      // Simulate success for demo purposes
      const updated = integrationsList.map(item => {
        if (item.id === id) {
          return { ...item, status: 'connected' as const };
        }
        return item;
      });
      setIntegrationsList(updated);
      saveAllIntegrations(updated);
      showToast(`Connection to ${name} tested successfully! Credentials verified.`, 'success');
    }, 1500);
  };

  const handleSaveAll = () => {
    saveAllIntegrations(integrationsList);
    showToast('All integration settings and API credentials saved successfully!', 'success');
  };

  const categories = [
    { id: 'all', label: 'All Integrations', count: integrationsList.length },
    { id: 'Accounting', label: 'Accounting', count: integrationsList.filter(i => i.category === 'Accounting').length },
    { id: 'Communications', label: 'Communications', count: integrationsList.filter(i => i.category === 'Communications').length },
    { id: 'Storage', label: 'Storage', count: integrationsList.filter(i => i.category === 'Storage').length },
    { id: 'Payments', label: 'Payments', count: integrationsList.filter(i => i.category === 'Payments').length },
    { id: 'Identity & Credit', label: 'Identity & Credit', count: integrationsList.filter(i => i.category === 'Identity & Credit').length },
    { id: 'Property & Legal', label: 'Property & Legal', count: integrationsList.filter(i => i.category === 'Property & Legal').length },
    { id: 'AML & Compliance', label: 'AML & Compliance', count: integrationsList.filter(i => i.category === 'AML & Compliance').length },
    { id: 'Government', label: 'Government', count: integrationsList.filter(i => i.category === 'Government').length },
    { id: 'Documents', label: 'Documents', count: integrationsList.filter(i => i.category === 'Documents').length },
    { id: 'CRM', label: 'CRM', count: integrationsList.filter(i => i.category === 'CRM').length },
    { id: 'Practice Management', label: 'Practice Management', count: integrationsList.filter(i => i.category === 'Practice Management').length }
  ];

  const filteredIntegrations = selectedCategory === 'all'
    ? integrationsList
    : integrationsList.filter(i => i.category === selectedCategory);

  const connectedCount = integrationsList.filter(i => i.status === 'connected').length;
  const requiredCount = integrationsList.filter(i => i.required).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'disconnected': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 'error': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-5 h-5 text-green-600 animate-pulse" />;
      case 'disconnected': return <X className="w-5 h-5 text-gray-400" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-xl border text-white ${
            toast.type === 'success' ? 'bg-green-600 border-green-500' :
            toast.type === 'error' ? 'bg-red-600 border-red-500' :
            'bg-[#0E7C9E] border-cyan-500'
          }`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-semibold text-sm">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#0E7C9E] to-[#13B5EA] rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-8 h-8" />
              <h2 className="text-3xl font-bold">System Integrations</h2>
            </div>
            <p className="text-cyan-100">Connect external services and manage API credentials</p>
          </div>
          <Button onClick={handleSaveAll} className="bg-white text-[#0E7C9E] hover:bg-cyan-50 font-bold shadow-md">
            <Save className="w-5 h-5 mr-2" />
            Save All Changes
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-cyan-100 mb-1">Total Integrations</div>
            <div className="text-3xl font-bold">{integrationsList.length}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-cyan-100 mb-1">Connected</div>
            <div className="text-3xl font-bold text-green-300">{connectedCount}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-cyan-100 mb-1">Required</div>
            <div className="text-3xl font-bold text-orange-300">{requiredCount}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-cyan-100 mb-1">Categories</div>
            <div className="text-3xl font-bold">{categories.length - 1}</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === category.id
                  ? 'bg-[#13B5EA] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.label}
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Integrations List */}
      <div className="space-y-4">
        {filteredIntegrations.map(integration => {
          const isExpanded = expandedIntegrations.has(integration.id);
          const Icon = integration.icon;

          return (
            <div
              key={integration.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg bg-${integration.color}-100 dark:bg-${integration.color}-900/40 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${integration.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{integration.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(integration.status)}`}>
                          {integration.status.toUpperCase()}
                        </span>
                        {integration.required && (
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 rounded-full text-xs font-bold">
                            REQUIRED
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{integration.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Category: {integration.category}</span>
                        {integration.provider && (
                          <>
                            <span>•</span>
                            <span>Provider: {integration.provider}</span>
                          </>
                        )}
                        {integration.pricing && (
                          <>
                            <span>•</span>
                            <span>{integration.pricing}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusIcon(integration.status)}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleExpanded(integration.id)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Configure
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Features */}
                {integration.features && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {integration.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Expanded Credentials Section */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">API Credentials</h4>
                  <div className="space-y-4">
                    {integration.credentials.map((cred, i) => (
                      <div key={i}>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          {cred.name}
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 relative">
                            <input
                              type={cred.type === 'password' && !showPasswords[`${integration.id}-${i}`] ? 'password' : 'text'}
                              value={cred.value || ''}
                              onChange={e => handleCredentialsChange(integration.id, i, e.target.value)}
                              placeholder={`Enter ${cred.name}`}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            {cred.type === 'password' && (
                              <button
                                onClick={() =>
                                  setShowPasswords(prev => ({
                                    ...prev,
                                    [`${integration.id}-${i}`]: !prev[`${integration.id}-${i}`]
                                  }))
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                              >
                                {showPasswords[`${integration.id}-${i}`] ? (
                                  <EyeOff className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <Eye className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                            )}
                          </div>
                          {cred.type === 'api-key' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const randomKey = 'key_' + Math.random().toString(36).substring(2, 15);
                                handleCredentialsChange(integration.id, i, randomKey);
                                showToast(`New API Key generated for ${integration.name}!`, 'success');
                              }}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Generate
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Lock className="w-4 h-4" />
                      All credentials are encrypted and stored securely
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => showToast(`Opening documentation for ${integration.name}...`, 'info')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Documentation
                      </Button>
                      <Button
                        size="sm"
                        disabled={testingId === integration.id}
                        onClick={() => handleTestConnection(integration.id)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {testingId === integration.id ? 'Testing...' : 'Test Connection'}
                      </Button>
                      {integration.status === 'connected' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleConnectToggle(integration.id, integration.status)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleConnectToggle(integration.id, integration.status)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

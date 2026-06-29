import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Link, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Plus,
  Settings,
  Database,
  FileText,
  Shield,
  Key,
  Zap,
  Globe,
  DollarSign,
  Mail,
  MessageSquare,
  Video,
  Cloud,
  Users,
  TrendingUp,
  BarChart3,
  Briefcase,
  Phone,
  Send,
  Calendar,
  Folder,
  Workflow,
  ClipboardList,
  Building2,
  PiggyBank
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  icon: any;
  fields: {
    id: string;
    label: string;
    placeholder: string;
    type: 'text' | 'password' | 'url';
    value: string;
  }[];
  lastTested?: Date;
  testResult?: 'success' | 'failed';
}

export function IntegrationsSettings() {
  const [showApiKeys, setShowApiKeys] = useState<{ [key: string]: boolean }>({});
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'infotrack',
      name: 'InfoTrack',
      description: 'Identity verification, KYC checks, title searches, and property verification',
      status: 'connected',
      icon: Shield,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter InfoTrack API Key', type: 'password', value: 'it_live_xxxxxxxxxxxx' },
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter Client ID', type: 'text', value: 'BRICK001' },
        { id: 'environment', label: 'Environment', placeholder: 'production or sandbox', type: 'text', value: 'production' }
      ],
      lastTested: new Date(Date.now() - 2 * 60 * 60 * 1000),
      testResult: 'success'
    },
    {
      id: 'rpdata',
      name: 'RP Data / CoreLogic',
      description: 'Property valuations, sales history, market insights, and property reports',
      status: 'connected',
      icon: Database,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter RP Data API Key', type: 'password', value: 'rpd_live_xxxxxxxxxxxx' },
        { id: 'subscriberId', label: 'Subscriber ID', placeholder: 'Enter Subscriber ID', type: 'text', value: 'SUB12345' },
        { id: 'endpoint', label: 'API Endpoint', placeholder: 'https://api.corelogic.asia', type: 'url', value: 'https://api.corelogic.asia' }
      ],
      lastTested: new Date(Date.now() - 24 * 60 * 60 * 1000),
      testResult: 'success'
    },
    {
      id: 'equifax',
      name: 'Equifax',
      description: 'Credit checks, credit reports, and borrower financial assessment',
      status: 'connected',
      icon: FileText,
      fields: [
        { id: 'username', label: 'Username', placeholder: 'Enter Equifax Username', type: 'text', value: 'Grow MIP_api' },
        { id: 'password', label: 'Password', placeholder: 'Enter Equifax Password', type: 'password', value: 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢' },
        { id: 'customerId', label: 'Customer ID', placeholder: 'Enter Customer ID', type: 'text', value: 'CUST789456' }
      ],
      lastTested: new Date(Date.now() - 12 * 60 * 60 * 1000),
      testResult: 'success'
    },
    {
      id: 'austrac',
      name: 'AUSTRAC Reporting',
      description: 'AML/CTF compliance reporting and suspicious matter reporting',
      status: 'connected',
      icon: Shield,
      fields: [
        { id: 'reportingEntityId', label: 'Reporting Entity ID', placeholder: 'Enter AUSTRAC Entity ID', type: 'text', value: 'RE987654321' },
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter AUSTRAC API Key', type: 'password', value: 'austrac_live_xxxxxxxxxxxx' },
        { id: 'environment', label: 'Environment', placeholder: 'production or test', type: 'text', value: 'production' }
      ],
      lastTested: new Date(Date.now() - 6 * 60 * 60 * 1000),
      testResult: 'success'
    },
    {
      id: 'docusign',
      name: 'DocuSign',
      description: 'Digital signatures and document execution for contracts and agreements',
      status: 'disconnected',
      icon: FileText,
      fields: [
        { id: 'integrationKey', label: 'Integration Key', placeholder: 'Enter DocuSign Integration Key', type: 'password', value: '' },
        { id: 'accountId', label: 'Account ID', placeholder: 'Enter Account ID', type: 'text', value: '' },
        { id: 'userId', label: 'User ID', placeholder: 'Enter User ID', type: 'text', value: '' }
      ]
    },
    {
      id: 'xero',
      name: 'Xero',
      description: 'Accounting integration for invoicing, payments, and financial reporting',
      status: 'disconnected',
      icon: Database,
      fields: [
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter Xero Client ID', type: 'text', value: '' },
        { id: 'clientSecret', label: 'Client Secret', placeholder: 'Enter Client Secret', type: 'password', value: '' },
        { id: 'tenantId', label: 'Tenant ID', placeholder: 'Enter Tenant ID', type: 'text', value: '' }
      ]
    },
    {
      id: 'pexa',
      name: 'PEXA',
      description: 'Property Exchange Australia - electronic property settlements',
      status: 'disconnected',
      icon: Globe,
      fields: [
        { id: 'subscriberId', label: 'Subscriber ID', placeholder: 'Enter PEXA Subscriber ID', type: 'text', value: '' },
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter PEXA API Key', type: 'password', value: '' },
        { id: 'environment', label: 'Environment', placeholder: 'production or test', type: 'text', value: '' }
      ]
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing for deposits, fees, and investor transactions',
      status: 'error',
      icon: Zap,
      fields: [
        { id: 'publishableKey', label: 'Publishable Key', placeholder: 'pk_live_...', type: 'text', value: 'pk_test_xxxxxxxxxxxx' },
        { id: 'secretKey', label: 'Secret Key', placeholder: 'sk_live_...', type: 'password', value: 'sk_test_xxxxxxxxxxxx' },
        { id: 'webhookSecret', label: 'Webhook Secret', placeholder: 'whsec_...', type: 'password', value: '' }
      ],
      lastTested: new Date(Date.now() - 1 * 60 * 60 * 1000),
      testResult: 'failed'
    },
    // FINANCE SOFTWARE
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      description: 'Cloud accounting software for invoicing, expense tracking, and financial reporting',
      status: 'disconnected',
      icon: DollarSign,
      fields: [
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter QuickBooks Client ID', type: 'text', value: '' },
        { id: 'clientSecret', label: 'Client Secret', placeholder: 'Enter Client Secret', type: 'password', value: '' },
        { id: 'realmId', label: 'Realm ID', placeholder: 'Enter Company/Realm ID', type: 'text', value: '' }
      ]
    },
    {
      id: 'myob',
      name: 'MYOB',
      description: 'Australian accounting software for business management and financial compliance',
      status: 'disconnected',
      icon: DollarSign,
      fields: [
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter MYOB Client ID', type: 'text', value: '' },
        { id: 'clientSecret', label: 'Client Secret', placeholder: 'Enter Client Secret', type: 'password', value: '' },
        { id: 'companyFileId', label: 'Company File ID', placeholder: 'Enter Company File ID', type: 'text', value: '' }
      ]
    },
    {
      id: 'freshbooks',
      name: 'FreshBooks',
      description: 'Cloud-based accounting for invoicing, time tracking, and expense management',
      status: 'disconnected',
      icon: DollarSign,
      fields: [
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter FreshBooks Client ID', type: 'text', value: '' },
        { id: 'clientSecret', label: 'Client Secret', placeholder: 'Enter Client Secret', type: 'password', value: '' },
        { id: 'accountId', label: 'Account ID', placeholder: 'Enter Account ID', type: 'text', value: '' }
      ]
    },
    {
      id: 'sage',
      name: 'Sage Accounting',
      description: 'Comprehensive accounting and business management software',
      status: 'disconnected',
      icon: DollarSign,
      fields: [
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter Sage Client ID', type: 'text', value: '' },
        { id: 'clientSecret', label: 'Client Secret', placeholder: 'Enter Client Secret', type: 'password', value: '' },
        { id: 'subscriptionKey', label: 'Subscription Key', placeholder: 'Enter Subscription Key', type: 'password', value: '' }
      ]
    },
    // FUND MANAGEMENT SOFTWARE
    {
      id: 'juniper',
      name: 'Juniper Square',
      description: 'Fund management platform for private equity, real estate, and venture capital',
      status: 'disconnected',
      icon: Briefcase,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter Juniper Square API Key', type: 'password', value: '' },
        { id: 'organizationId', label: 'Organization ID', placeholder: 'Enter Organization ID', type: 'text', value: '' },
        { id: 'environment', label: 'Environment', placeholder: 'production or sandbox', type: 'text', value: '' }
      ]
    },
    {
      id: 'investran',
      name: 'Investran',
      description: 'Investment management software for alternative assets and fund accounting',
      status: 'disconnected',
      icon: TrendingUp,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter Investran API Key', type: 'password', value: '' },
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter Client ID', type: 'text', value: '' },
        { id: 'endpoint', label: 'API Endpoint', placeholder: 'https://api.investran.com', type: 'url', value: '' }
      ]
    },
    {
      id: 'efront',
      name: 'eFront',
      description: 'End-to-end investment management software for alternative investments',
      status: 'disconnected',
      icon: BarChart3,
      fields: [
        { id: 'username', label: 'Username', placeholder: 'Enter eFront Username', type: 'text', value: '' },
        { id: 'password', label: 'Password', placeholder: 'Enter Password', type: 'password', value: '' },
        { id: 'companyCode', label: 'Company Code', placeholder: 'Enter Company Code', type: 'text', value: '' }
      ]
    },
    {
      id: 'allvue',
      name: 'Allvue Systems',
      description: 'Investment management platform for hedge funds and private capital',
      status: 'disconnected',
      icon: Briefcase,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter Allvue API Key', type: 'password', value: '' },
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter Client ID', type: 'text', value: '' },
        { id: 'environment', label: 'Environment', placeholder: 'production or test', type: 'text', value: '' }
      ]
    },
    // MICROSOFT INTEGRATIONS
    {
      id: 'microsoft365',
      name: 'Microsoft 365',
      description: 'Office 365 suite integration for email, documents, and collaboration',
      status: 'disconnected',
      icon: Mail,
      fields: [
        { id: 'tenantId', label: 'Tenant ID', placeholder: 'Enter Microsoft Tenant ID', type: 'text', value: '' },
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter Application (Client) ID', type: 'text', value: '' },
        { id: 'clientSecret', label: 'Client Secret', placeholder: 'Enter Client Secret', type: 'password', value: '' }
      ]
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      description: 'Email integration for automated communications and calendar management',
      status: 'disconnected',
      icon: Mail,
      fields: [
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter Outlook Client ID', type: 'text', value: '' },
        { id: 'clientSecret', label: 'Client Secret', placeholder: 'Enter Client Secret', type: 'password', value: '' },
        { id: 'redirectUri', label: 'Redirect URI', placeholder: 'https://yourapp.com/auth/callback', type: 'url', value: '' }
      ]
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Team collaboration and messaging integration for notifications',
      status: 'disconnected',
      icon: MessageSquare,
      fields: [
        { id: 'webhookUrl', label: 'Webhook URL', placeholder: 'Enter Teams Webhook URL', type: 'url', value: '' },
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter Client ID (optional)', type: 'text', value: '' },
        { id: 'clientSecret', label: 'Client Secret', placeholder: 'Enter Client Secret (optional)', type: 'password', value: '' }
      ]
    },
    {
      id: 'onedrive',
      name: 'Microsoft OneDrive',
      description: 'Cloud storage integration for document management and sharing',
      status: 'disconnected',
      icon: Cloud,
      fields: [
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter OneDrive Client ID', type: 'text', value: '' },
        { id: 'clientSecret', label: 'Client Secret', placeholder: 'Enter Client Secret', type: 'password', value: '' },
        { id: 'tenantId', label: 'Tenant ID', placeholder: 'Enter Tenant ID', type: 'text', value: '' }
      ]
    },
    // GOOGLE INTEGRATIONS
    {
      id: 'google-workspace',
      name: 'Google Workspace',
      description: 'Gmail, Drive, Calendar integration for complete productivity suite',
      status: 'disconnected',
      icon: Mail,
      fields: [
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter Google Client ID', type: 'text', value: '' },
        { id: 'clientSecret', label: 'Client Secret', placeholder: 'Enter Client Secret', type: 'password', value: '' },
        { id: 'projectId', label: 'Project ID', placeholder: 'Enter GCP Project ID', type: 'text', value: '' }
      ]
    },
    {
      id: 'gmail',
      name: 'Gmail API',
      description: 'Email integration for automated client communications',
      status: 'disconnected',
      icon: Mail,
      fields: [
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter Gmail API Client ID', type: 'text', value: '' },
        { id: 'clientSecret', label: 'Client Secret', placeholder: 'Enter Client Secret', type: 'password', value: '' },
        { id: 'refreshToken', label: 'Refresh Token', placeholder: 'Enter Refresh Token', type: 'password', value: '' }
      ]
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Cloud storage for document management and file sharing',
      status: 'disconnected',
      icon: Folder,
      fields: [
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter Drive Client ID', type: 'text', value: '' },
        { id: 'clientSecret', label: 'Client Secret', placeholder: 'Enter Client Secret', type: 'password', value: '' },
        { id: 'serviceAccountKey', label: 'Service Account Key', placeholder: 'Paste JSON key', type: 'password', value: '' }
      ]
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Calendar integration for scheduling and appointment management',
      status: 'disconnected',
      icon: Calendar,
      fields: [
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter Calendar Client ID', type: 'text', value: '' },
        { id: 'clientSecret', label: 'Client Secret', placeholder: 'Enter Client Secret', type: 'password', value: '' },
        { id: 'calendarId', label: 'Calendar ID', placeholder: 'primary or calendar ID', type: 'text', value: '' }
      ]
    },
    // SMS SOFTWARE
    {
      id: 'twilio',
      name: 'Twilio SMS',
      description: 'SMS and voice messaging for client notifications and 2FA',
      status: 'disconnected',
      icon: Phone,
      fields: [
        { id: 'accountSid', label: 'Account SID', placeholder: 'Enter Twilio Account SID', type: 'text', value: '' },
        { id: 'authToken', label: 'Auth Token', placeholder: 'Enter Auth Token', type: 'password', value: '' },
        { id: 'phoneNumber', label: 'Phone Number', placeholder: '+61XXXXXXXXX', type: 'text', value: '' }
      ]
    },
    {
      id: 'messagemedia',
      name: 'MessageMedia',
      description: 'Australian SMS gateway for bulk messaging and notifications',
      status: 'disconnected',
      icon: Send,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter MessageMedia API Key', type: 'password', value: '' },
        { id: 'apiSecret', label: 'API Secret', placeholder: 'Enter API Secret', type: 'password', value: '' },
        { id: 'sourceNumber', label: 'Source Number', placeholder: 'Sender ID or number', type: 'text', value: '' }
      ]
    },
    {
      id: 'clickatell',
      name: 'Clickatell',
      description: 'Global SMS platform for transactional and marketing messages',
      status: 'disconnected',
      icon: MessageSquare,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter Clickatell API Key', type: 'password', value: '' },
        { id: 'fromNumber', label: 'From Number', placeholder: 'Sender number', type: 'text', value: '' }
      ]
    },
    {
      id: 'aws-sns',
      name: 'AWS SNS',
      description: 'Amazon Simple Notification Service for SMS and push notifications',
      status: 'disconnected',
      icon: Send,
      fields: [
        { id: 'accessKeyId', label: 'Access Key ID', placeholder: 'Enter AWS Access Key', type: 'text', value: '' },
        { id: 'secretAccessKey', label: 'Secret Access Key', placeholder: 'Enter Secret Key', type: 'password', value: '' },
        { id: 'region', label: 'Region', placeholder: 'ap-southeast-2', type: 'text', value: '' }
      ]
    },
    // CRM & COMMUNICATION
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'CRM integration for client relationship management and sales pipeline',
      status: 'disconnected',
      icon: Users,
      fields: [
        { id: 'clientId', label: 'Consumer Key', placeholder: 'Enter Salesforce Consumer Key', type: 'text', value: '' },
        { id: 'clientSecret', label: 'Consumer Secret', placeholder: 'Enter Consumer Secret', type: 'password', value: '' },
        { id: 'instanceUrl', label: 'Instance URL', placeholder: 'https://yourinstance.salesforce.com', type: 'url', value: '' }
      ]
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Marketing automation and CRM for lead management and analytics',
      status: 'disconnected',
      icon: Users,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter HubSpot API Key', type: 'password', value: '' },
        { id: 'portalId', label: 'Portal ID', placeholder: 'Enter HubSpot Portal ID', type: 'text', value: '' }
      ]
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team messaging for notifications and collaboration',
      status: 'disconnected',
      icon: MessageSquare,
      fields: [
        { id: 'webhookUrl', label: 'Webhook URL', placeholder: 'Enter Slack Webhook URL', type: 'url', value: '' },
        { id: 'botToken', label: 'Bot Token', placeholder: 'xoxb-...', type: 'password', value: '' },
        { id: 'channel', label: 'Default Channel', placeholder: '#general', type: 'text', value: '' }
      ]
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Video conferencing integration for virtual meetings and KYC interviews',
      status: 'disconnected',
      icon: Video,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter Zoom API Key', type: 'password', value: '' },
        { id: 'apiSecret', label: 'API Secret', placeholder: 'Enter API Secret', type: 'password', value: '' },
        { id: 'accountId', label: 'Account ID', placeholder: 'Enter Account ID', type: 'text', value: '' }
      ]
    },
    // ACCOUNTING PRACTICE MANAGEMENT SOFTWARE
    {
      id: 'fyi',
      name: 'FYI',
      description: 'Cloud practice management for accountants - document management and workflow automation',
      status: 'disconnected',
      icon: Workflow,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter FYI API Key', type: 'password', value: '' },
        { id: 'organizationId', label: 'Organization ID', placeholder: 'Enter Organization ID', type: 'text', value: '' },
        { id: 'region', label: 'Region', placeholder: 'au or nz', type: 'text', value: 'au' }
      ]
    },
    {
      id: 'karbon',
      name: 'Karbon',
      description: 'Practice management and workflow platform for accounting firms',
      status: 'disconnected',
      icon: ClipboardList,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter Karbon API Key', type: 'password', value: '' },
        { id: 'accessKey', label: 'Access Key', placeholder: 'Enter Access Key', type: 'text', value: '' },
        { id: 'organizationKey', label: 'Organization Key', placeholder: 'Enter Organization Key', type: 'text', value: '' }
      ]
    },
    {
      id: 'xpm',
      name: 'Xero Practice Manager',
      description: 'Practice management solution for accounting and bookkeeping firms',
      status: 'disconnected',
      icon: Building2,
      fields: [
        { id: 'clientId', label: 'Client ID', placeholder: 'Enter XPM Client ID', type: 'text', value: '' },
        { id: 'clientSecret', label: 'Client Secret', placeholder: 'Enter Client Secret', type: 'password', value: '' },
        { id: 'tenantId', label: 'Tenant ID', placeholder: 'Enter Tenant ID', type: 'text', value: '' }
      ]
    },
    {
      id: 'workflowmax',
      name: 'WorkflowMax',
      description: 'Job management and workflow software for professional services',
      status: 'disconnected',
      icon: Workflow,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter WorkflowMax API Key', type: 'password', value: '' },
        { id: 'accountKey', label: 'Account Key', placeholder: 'Enter Account Key', type: 'text', value: '' },
        { id: 'endpoint', label: 'API Endpoint', placeholder: 'https://api.workflowmax2.com', type: 'url', value: '' }
      ]
    },
    {
      id: 'practice-ignition',
      name: 'Practice Ignition',
      description: 'Client engagement and proposal software for accounting firms',
      status: 'disconnected',
      icon: FileText,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter Practice Ignition API Key', type: 'password', value: '' },
        { id: 'businessId', label: 'Business ID', placeholder: 'Enter Business ID', type: 'text', value: '' }
      ]
    },
    {
      id: 'class-super',
      name: 'Class Super',
      description: 'SMSF administration and compliance software for accountants',
      status: 'disconnected',
      icon: PiggyBank,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter Class API Key', type: 'password', value: '' },
        { id: 'practiceId', label: 'Practice ID', placeholder: 'Enter Practice ID', type: 'text', value: '' },
        { id: 'environment', label: 'Environment', placeholder: 'production or sandbox', type: 'text', value: '' }
      ]
    },
    {
      id: 'bgl-360',
      name: 'BGL Simple Fund 360',
      description: 'SMSF administration and compliance platform',
      status: 'disconnected',
      icon: PiggyBank,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter BGL API Key', type: 'password', value: '' },
        { id: 'firmId', label: 'Firm ID', placeholder: 'Enter Firm ID', type: 'text', value: '' },
        { id: 'endpoint', label: 'API Endpoint', placeholder: 'https://api.bglcorp.com', type: 'url', value: '' }
      ]
    },
    {
      id: 'aps',
      name: 'Australian Practice Software',
      description: 'Practice management software for Australian accounting firms',
      status: 'disconnected',
      icon: Building2,
      fields: [
        { id: 'username', label: 'Username', placeholder: 'Enter APS Username', type: 'text', value: '' },
        { id: 'password', label: 'Password', placeholder: 'Enter Password', type: 'password', value: '' },
        { id: 'practiceCode', label: 'Practice Code', placeholder: 'Enter Practice Code', type: 'text', value: '' }
      ]
    },
    {
      id: 'cch-ifirm',
      name: 'CCH iFirm',
      description: 'Cloud-based practice management for accounting professionals',
      status: 'disconnected',
      icon: ClipboardList,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter CCH API Key', type: 'password', value: '' },
        { id: 'firmId', label: 'Firm ID', placeholder: 'Enter Firm ID', type: 'text', value: '' },
        { id: 'region', label: 'Region', placeholder: 'au, nz, uk, us', type: 'text', value: '' }
      ]
    },
    {
      id: 'financial-edge',
      name: 'Financial Edge NXT',
      description: 'Fund accounting and financial management for nonprofits and funds',
      status: 'disconnected',
      icon: BarChart3,
      fields: [
        { id: 'apiKey', label: 'API Key', placeholder: 'Enter Blackbaud API Key', type: 'password', value: '' },
        { id: 'subscriptionKey', label: 'Subscription Key', placeholder: 'Enter Subscription Key', type: 'password', value: '' },
        { id: 'environmentId', label: 'Environment ID', placeholder: 'Enter Environment ID', type: 'text', value: '' }
      ]
    }
  ]);

  const handleTestConnection = async (integrationId: string) => {
    setTestingConnection(integrationId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIntegrations(integrations.map(int => {
      if (int.id === integrationId) {
        const hasAllFields = int.fields.every(f => f.value.trim() !== '');
        return {
          ...int,
          lastTested: new Date(),
          testResult: hasAllFields ? 'success' : 'failed',
          status: hasAllFields ? 'connected' : 'error'
        };
      }
      return int;
    }));
    
    setTestingConnection(null);
  };

  const handleFieldUpdate = (integrationId: string, fieldId: string, value: string) => {
    setIntegrations(integrations.map(int => {
      if (int.id === integrationId) {
        return {
          ...int,
          fields: int.fields.map(f => f.id === fieldId ? { ...f, value } : f)
        };
      }
      return int;
    }));
  };

  const toggleShowApiKey = (key: string) => {
    setShowApiKeys({ ...showApiKeys, [key]: !showApiKeys[key] });
  };

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/15 text-green-300 rounded-full text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Connected
          </div>
        );
      case 'disconnected':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 text-slate-300 rounded-full text-sm font-semibold">
            <XCircle className="w-4 h-4" />
            Disconnected
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/15 text-red-300 rounded-full text-sm font-semibold">
            <AlertCircle className="w-4 h-4" />
            Error
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">API Integrations</h2>
        <p className="text-slate-300 mt-1">
          Manage third-party API connections for KYC, property data, payments, and compliance
        </p>
      </div>

      {/* Integration Cards */}
      <div className="space-y-4">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card key={integration.id}>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{integration.name}</CardTitle>
                      <p className="text-sm text-slate-300 mt-1">{integration.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(integration.status)}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* API Fields */}
                  <div className="grid grid-cols-1 gap-4">
                    {integration.fields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          {field.label}
                        </label>
                        <div className="relative">
                          <Input
                            type={field.type === 'password' && !showApiKeys[`${integration.id}-${field.id}`] ? 'password' : 'text'}
                            placeholder={field.placeholder}
                            value={field.value}
                            onChange={(e) => handleFieldUpdate(integration.id, field.id, e.target.value)}
                            className="pr-10"
                          />
                          {field.type === 'password' && (
                            <button
                              onClick={() => toggleShowApiKey(`${integration.id}-${field.id}`)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-300"
                            >
                              {showApiKeys[`${integration.id}-${field.id}`] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Test Connection & Last Tested */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      {integration.lastTested && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-slate-300">Last tested:</span>
                          <span className="font-semibold text-slate-100">
                            {integration.lastTested.toLocaleString()}
                          </span>
                          {integration.testResult === 'success' && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                          {integration.testResult === 'failed' && (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleTestConnection(integration.id)}
                      disabled={testingConnection === integration.id}
                      variant="outline"
                      className="gap-2"
                    >
                      {testingConnection === integration.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Test Connection
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add New Integration */}
      <Card className="border-2 border-dashed border-white/10 bg-white/5">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-white/10 rounded-full">
              <Plus className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Need Another Integration?</h3>
              <p className="text-sm text-slate-300 mt-1">
                Contact support to add custom API integrations
              </p>
            </div>
            <Button variant="outline" className="mt-2">
              Request Integration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

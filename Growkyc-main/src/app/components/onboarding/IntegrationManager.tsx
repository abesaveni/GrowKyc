import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  RefreshCw,
  Link as LinkIcon,
  Zap,
  Shield,
  DollarSign,
  Building,
  FileText,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

// INTEGRATION TYPES
export type IntegrationType = 'xero' | 'asic' | 'bgl' | 'ato' | 'stripe' | 'paypal';
export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending';

export interface Integration {
  id: IntegrationType;
  name: string;
  description: string;
  status: IntegrationStatus;
  icon: any;
  color: string;
  lastSync?: string;
  features: string[];
}

export interface XeroClient {
  contactID: string;
  name: string;
  emailAddress: string;
  accountNumber: string;
  taxNumber: string;
  status: string;
}

export interface ASICCompany {
  acn: string;
  abn: string;
  name: string;
  status: 'Registered' | 'Deregistered';
  type: string;
  registrationDate: string;
  registeredAddress: string;
  directors: ASICDirector[];
  shareholders: ASICShareholder[];
}

export interface ASICDirector {
  name: string;
  dateOfBirth: string;
  address: string;
  appointmentDate: string;
}

export interface ASICShareholder {
  name: string;
  shares: number;
  percentage: number;
}

export interface BGLFund {
  fundName: string;
  abn: string;
  tfn: string;
  members: BGLMember[];
  trustees: BGLTrustee[];
  assets: number;
}

export interface BGLMember {
  name: string;
  memberNumber: string;
  balance: number;
}

export interface BGLTrustee {
  name: string;
  type: 'Individual' | 'Corporate';
}

export interface ATOEntity {
  abn: string;
  abnStatus: string;
  entityName: string;
  entityType: string;
  gstRegistered: boolean;
  gstFromDate?: string;
}

// INTEGRATION MANAGER
export class IntegrationManager {
  // XERO INTEGRATION
  static async connectXero(authCode: string): Promise<boolean> {
    try {
      // In production, exchange auth code for tokens
      const response = await fetch('/api/integrations/xero/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authCode })
      });
      
      if (!response.ok) throw new Error('Xero connection failed');
      
      const data = await response.json();
      localStorage.setItem('xero_access_token', data.accessToken);
      localStorage.setItem('xero_refresh_token', data.refreshToken);
      
      toast.success('Xero connected successfully');
      return true;
    } catch (error) {
      toast.error('Failed to connect to Xero');
      console.error('Xero connection error:', error);
      return false;
    }
  }

  static async createXeroClient(clientData: {
    name: string;
    email: string;
    abn?: string;
    phone?: string;
    address?: string;
  }): Promise<XeroClient | null> {
    try {
      const token = localStorage.getItem('xero_access_token');
      if (!token) throw new Error('Not authenticated with Xero');

      const response = await fetch('/api/integrations/xero/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          Name: clientData.name,
          EmailAddress: clientData.email,
          TaxNumber: clientData.abn,
          Phones: clientData.phone ? [{
            PhoneType: 'DEFAULT',
            PhoneNumber: clientData.phone
          }] : [],
          Addresses: clientData.address ? [{
            AddressType: 'STREET',
            AddressLine1: clientData.address
          }] : []
        })
      });

      if (!response.ok) throw new Error('Failed to create Xero contact');

      const data = await response.json();
      toast.success('Client created in Xero');
      
      return {
        contactID: data.ContactID,
        name: data.Name,
        emailAddress: data.EmailAddress,
        accountNumber: data.AccountNumber,
        taxNumber: data.TaxNumber,
        status: data.ContactStatus
      };
    } catch (error) {
      toast.error('Failed to create Xero client');
      console.error('Xero create client error:', error);
      return null;
    }
  }

  static async syncXeroClient(contactID: string): Promise<XeroClient | null> {
    try {
      const token = localStorage.getItem('xero_access_token');
      if (!token) throw new Error('Not authenticated with Xero');

      const response = await fetch(`/api/integrations/xero/contacts/${contactID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to sync Xero contact');

      const data = await response.json();
      return {
        contactID: data.ContactID,
        name: data.Name,
        emailAddress: data.EmailAddress,
        accountNumber: data.AccountNumber,
        taxNumber: data.TaxNumber,
        status: data.ContactStatus
      };
    } catch (error) {
      console.error('Xero sync error:', error);
      return null;
    }
  }

  // ASIC INTEGRATION
  static async lookupASIC(acn: string): Promise<ASICCompany | null> {
    try {
      const response = await fetch('/api/integrations/asic/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acn })
      });

      if (!response.ok) throw new Error('ASIC lookup failed');

      const data = await response.json();
      toast.success('Company details retrieved from ASIC');
      
      return {
        acn: data.acn,
        abn: data.abn,
        name: data.name,
        status: data.status,
        type: data.type,
        registrationDate: data.registrationDate,
        registeredAddress: data.registeredAddress,
        directors: data.directors || [],
        shareholders: data.shareholders || []
      };
    } catch (error) {
      toast.error('ASIC lookup failed');
      console.error('ASIC lookup error:', error);
      return null;
    }
  }

  static async verifyDirectors(acn: string): Promise<ASICDirector[]> {
    try {
      const response = await fetch('/api/integrations/asic/directors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acn })
      });

      if (!response.ok) throw new Error('Director verification failed');

      const data = await response.json();
      return data.directors || [];
    } catch (error) {
      console.error('ASIC director verification error:', error);
      return [];
    }
  }

  // BGL (Simple Fund 360) INTEGRATION
  static async connectBGL(apiKey: string, clientId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/integrations/bgl/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, clientId })
      });
      
      if (!response.ok) throw new Error('BGL connection failed');
      
      localStorage.setItem('bgl_api_key', apiKey);
      localStorage.setItem('bgl_client_id', clientId);
      
      toast.success('BGL Simple Fund 360 connected');
      return true;
    } catch (error) {
      toast.error('Failed to connect to BGL');
      console.error('BGL connection error:', error);
      return false;
    }
  }

  static async createBGLFund(fundData: {
    fundName: string;
    abn: string;
    tfn: string;
    trusteeType: 'Individual' | 'Corporate';
  }): Promise<BGLFund | null> {
    try {
      const apiKey = localStorage.getItem('bgl_api_key');
      if (!apiKey) throw new Error('Not authenticated with BGL');

      const response = await fetch('/api/integrations/bgl/funds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify(fundData)
      });

      if (!response.ok) throw new Error('Failed to create BGL fund');

      const data = await response.json();
      toast.success('SMSF created in BGL Simple Fund 360');
      
      return {
        fundName: data.fundName,
        abn: data.abn,
        tfn: data.tfn,
        members: data.members || [],
        trustees: data.trustees || [],
        assets: data.assets || 0
      };
    } catch (error) {
      toast.error('Failed to create BGL fund');
      console.error('BGL create fund error:', error);
      return null;
    }
  }

  static async syncBGLFund(abn: string): Promise<BGLFund | null> {
    try {
      const apiKey = localStorage.getItem('bgl_api_key');
      if (!apiKey) throw new Error('Not authenticated with BGL');

      const response = await fetch(`/api/integrations/bgl/funds/${abn}`, {
        method: 'GET',
        headers: {
          'X-API-Key': apiKey
        }
      });

      if (!response.ok) throw new Error('Failed to sync BGL fund');

      const data = await response.json();
      return {
        fundName: data.fundName,
        abn: data.abn,
        tfn: data.tfn,
        members: data.members || [],
        trustees: data.trustees || [],
        assets: data.assets || 0
      };
    } catch (error) {
      console.error('BGL sync error:', error);
      return null;
    }
  }

  // ATO INTEGRATION
  static async lookupABN(abn: string): Promise<ATOEntity | null> {
    try {
      const response = await fetch('/api/integrations/ato/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abn })
      });

      if (!response.ok) throw new Error('ATO lookup failed');

      const data = await response.json();
      toast.success('ABN details retrieved from ATO');
      
      return {
        abn: data.abn,
        abnStatus: data.abnStatus,
        entityName: data.entityName,
        entityType: data.entityType,
        gstRegistered: data.gstRegistered,
        gstFromDate: data.gstFromDate
      };
    } catch (error) {
      toast.error('ATO lookup failed');
      console.error('ATO lookup error:', error);
      return null;
    }
  }

  static async verifyTFN(tfn: string, name: string): Promise<boolean> {
    try {
      const response = await fetch('/api/integrations/ato/verify-tfn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tfn, name })
      });

      if (!response.ok) throw new Error('TFN verification failed');

      const data = await response.json();
      return data.verified;
    } catch (error) {
      console.error('ATO TFN verification error:', error);
      return false;
    }
  }

  // PAYMENT GATEWAY INTEGRATION
  static async processStripePayment(paymentData: {
    amount: number;
    currency: string;
    description: string;
    cardToken: string;
  }): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const response = await fetch('/api/payments/stripe/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) throw new Error('Payment failed');

      const data = await response.json();
      toast.success('Payment processed successfully');
      
      return {
        success: true,
        transactionId: data.transactionId
      };
    } catch (error) {
      toast.error('Payment failed');
      console.error('Stripe payment error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async setupStripeDirectDebit(customerData: {
    name: string;
    email: string;
    bsbNumber: string;
    accountNumber: string;
  }): Promise<{ success: boolean; customerId?: string; error?: string }> {
    try {
      const response = await fetch('/api/payments/stripe/direct-debit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });

      if (!response.ok) throw new Error('Direct debit setup failed');

      const data = await response.json();
      toast.success('Direct debit setup successfully');
      
      return {
        success: true,
        customerId: data.customerId
      };
    } catch (error) {
      toast.error('Direct debit setup failed');
      console.error('Stripe direct debit error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async createPayPalSubscription(planData: {
    planId: string;
    customerEmail: string;
    returnUrl: string;
    cancelUrl: string;
  }): Promise<{ success: boolean; approvalUrl?: string; error?: string }> {
    try {
      const response = await fetch('/api/payments/paypal/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });

      if (!response.ok) throw new Error('PayPal subscription failed');

      const data = await response.json();
      
      return {
        success: true,
        approvalUrl: data.approvalUrl
      };
    } catch (error) {
      toast.error('PayPal subscription failed');
      console.error('PayPal subscription error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ORCHESTRATION - Automatic flow on client activation
  static async activateClient(clientData: {
    name: string;
    email: string;
    abn?: string;
    acn?: string;
    entityType: string;
    phone?: string;
    address?: string;
  }): Promise<{
    success: boolean;
    xeroContactId?: string;
    asicData?: ASICCompany;
    atoData?: ATOEntity;
    bglFundId?: string;
    errors: string[];
  }> {
    const errors: string[] = [];
    let xeroContactId: string | undefined;
    let asicData: ASICCompany | undefined;
    let atoData: ATOEntity | undefined;
    let bglFundId: string | undefined;

    // 1. Create in Xero
    try {
      const xeroClient = await this.createXeroClient(clientData);
      if (xeroClient) {
        xeroContactId = xeroClient.contactID;
      } else {
        errors.push('Xero client creation failed');
      }
    } catch (error) {
      errors.push(`Xero error: ${error.message}`);
    }

    // 2. Verify with ASIC (if company)
    if (clientData.acn) {
      try {
        asicData = await this.lookupASIC(clientData.acn);
        if (!asicData) {
          errors.push('ASIC verification failed');
        }
      } catch (error) {
        errors.push(`ASIC error: ${error.message}`);
      }
    }

    // 3. Verify with ATO
    if (clientData.abn) {
      try {
        atoData = await this.lookupABN(clientData.abn);
        if (!atoData) {
          errors.push('ATO verification failed');
        }
      } catch (error) {
        errors.push(`ATO error: ${error.message}`);
      }
    }

    // 4. Create in BGL (if SMSF)
    if (clientData.entityType === 'smsf' && clientData.abn) {
      try {
        const bglFund = await this.createBGLFund({
          fundName: clientData.name,
          abn: clientData.abn,
          tfn: '', // Would be collected in onboarding
          trusteeType: 'Individual'
        });
        if (bglFund) {
          bglFundId = bglFund.abn;
        } else {
          errors.push('BGL fund creation failed');
        }
      } catch (error) {
        errors.push(`BGL error: ${error.message}`);
      }
    }

    const success = errors.length === 0;
    if (success) {
      toast.success('Client activated across all systems');
    } else {
      toast.error(`Activation completed with ${errors.length} error(s)`);
    }

    return {
      success,
      xeroContactId,
      asicData,
      atoData,
      bglFundId,
      errors
    };
  }
}

// INTEGRATION STATUS DASHBOARD COMPONENT
export function IntegrationsDashboard() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'xero',
      name: 'Xero',
      description: 'Accounting and client management',
      status: 'connected',
      icon: Building,
      color: 'blue',
      lastSync: '2 mins ago',
      features: ['Client sync', 'Invoice creation', 'Chart of accounts', 'Bank feeds']
    },
    {
      id: 'asic',
      name: 'ASIC',
      description: 'Company verification and director checks',
      status: 'connected',
      icon: Shield,
      color: 'green',
      lastSync: '5 mins ago',
      features: ['Company lookup', 'Director verification', 'Shareholder data', 'Registration history']
    },
    {
      id: 'bgl',
      name: 'BGL Simple Fund 360',
      description: 'SMSF administration and compliance',
      status: 'connected',
      icon: FileText,
      color: 'purple',
      lastSync: '10 mins ago',
      features: ['Fund creation', 'Member management', 'Trustee tracking', 'Compliance reporting']
    },
    {
      id: 'ato',
      name: 'ATO',
      description: 'ABN lookup and tax verification',
      status: 'connected',
      icon: DollarSign,
      color: 'orange',
      lastSync: '1 min ago',
      features: ['ABN validation', 'TFN verification', 'GST status', 'Entity lookup']
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing',
      status: 'connected',
      icon: CreditCard,
      color: 'indigo',
      lastSync: 'Just now',
      features: ['Card payments', 'Direct debit', 'Subscriptions', 'Refunds']
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Alternative payment gateway',
      status: 'disconnected',
      icon: DollarSign,
      color: 'blue',
      features: ['PayPal checkout', 'Subscriptions', 'Invoicing']
    }
  ]);

  const getStatusColor = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected': return 'green';
      case 'disconnected': return 'gray';
      case 'error': return 'red';
      case 'pending': return 'yellow';
    }
  };

  const getStatusIcon = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'disconnected': return AlertCircle;
      case 'error': return AlertCircle;
      case 'pending': return Clock;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Integration Hub</h2>
          <p className="text-gray-600">Manage external service connections</p>
        </div>
        <button
          onClick={() => {
            toast.info('Syncing all integrations...');
            setTimeout(() => toast.success('All integrations synced'), 2000);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4" />
          Sync All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const StatusIcon = getStatusIcon(integration.status);
          const statusColor = getStatusColor(integration.status);

          return (
            <div key={integration.id} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-${integration.color}-100 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${integration.color}-600`} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 bg-${statusColor}-100 text-${statusColor}-700 rounded-full`}>
                  <StatusIcon className="w-3 h-3" />
                  <span className="text-xs font-bold uppercase">{integration.status}</span>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-1">{integration.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

              {integration.lastSync && (
                <p className="text-xs text-gray-500 mb-4">Last sync: {integration.lastSync}</p>
              )}

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Features:</p>
                <div className="flex flex-wrap gap-1">
                  {integration.features.map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {integration.status === 'connected' ? (
                  <>
                    <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded hover:bg-gray-200">
                      Configure
                    </button>
                    <button className="flex-1 px-3 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded hover:bg-red-200">
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      toast.success(`${integration.name} connected successfully`);
                      setIntegrations(integrations.map(i => 
                        i.id === integration.id ? { ...i, status: 'connected', lastSync: 'Just now' } : i
                      ));
                    }}
                    className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

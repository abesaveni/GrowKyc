// PEXA API Service - Australian Property Exchange Network Integration
// Handles all PEXA workspace operations for digital property settlements

interface PEXAConfig {
  apiKey: string;
  apiSecret: string;
  subscriberId: string;
  environment: 'sandbox' | 'production';
  baseUrl: string;
}

interface PEXAWorkspace {
  workspaceId: string;
  status: 'created' | 'in_progress' | 'settlement_booked' | 'settled' | 'completed' | 'cancelled' | 'failed';
  jurisdiction: 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'ACT' | 'NT';
  roleAllocations: PEXARole[];
  settlementDateTime: string;
  parties: PEXAParty[];
  landTitles: PEXALandTitle[];
  financialSettlement: PEXAFinancialSettlement;
  documents: PEXADocument[];
  tasks: PEXATask[];
  lodgementInstructions: PEXALodgementInstruction[];
  createdDate: string;
  lastModifiedDate: string;
}

interface PEXARole {
  roleId: string;
  roleType: 'incoming_mortgagee' | 'outgoing_mortgagee' | 'vendor' | 'purchaser' | 'proprietor' | 'transferee' | 'transferor';
  participantId: string;
  capacity: string;
  organisationName?: string;
  representativeDetails?: {
    name: string;
    email: string;
    phone: string;
    reference: string;
  };
}

interface PEXAParty {
  partyId: string;
  partyType: 'individual' | 'company' | 'trust';
  fullName: string;
  email?: string;
  phone?: string;
  address?: {
    streetAddress: string;
    suburb: string;
    state: string;
    postcode: string;
    country: string;
  };
  identityVerified: boolean;
  role: string;
}

interface PEXALandTitle {
  titleReference: string;
  lotPlanNumber: string;
  jurisdiction: string;
  address: {
    streetAddress: string;
    suburb: string;
    state: string;
    postcode: string;
  };
  titleType: 'torrens' | 'old_system' | 'crown';
  dealingNumbers: string[];
  caveats: PEXACaveat[];
  mortgages: PEXAMortgage[];
}

interface PEXACaveat {
  caveatNumber: string;
  caveatType: string;
  lodgedBy: string;
  lodgementDate: string;
  action: 'remove' | 'retain' | 'none';
}

interface PEXAMortgage {
  mortgageNumber: string;
  mortgagee: string;
  mortgageAmount: number;
  action: 'discharge' | 'retain' | 'transfer';
  accountNumber?: string;
  reference?: string;
}

interface PEXAFinancialSettlement {
  settlementStatementId: string;
  totalSettlementAmount: number;
  sourceItems: PEXAFinancialItem[];
  destinationItems: PEXAFinancialItem[];
  adjustments: PEXAAdjustment[];
  pexaFees: number;
  lodgementFees: number;
  stampDuty: number;
  trustAccountDetails?: {
    bsb: string;
    accountNumber: string;
    accountName: string;
  };
  disbursementStatus: 'pending' | 'funds_required' | 'funds_held' | 'disbursed' | 'completed';
  settlementCompletionDateTime?: string;
}

interface PEXAFinancialItem {
  itemId: string;
  description: string;
  amount: number;
  direction: 'source' | 'destination';
  category: 'purchase_price' | 'deposit' | 'loan' | 'adjustment' | 'fee' | 'duty' | 'other';
  party: string;
  bankDetails?: {
    bsb: string;
    accountNumber: string;
    accountName: string;
  };
}

interface PEXAAdjustment {
  adjustmentId: string;
  description: string;
  amount: number;
  type: 'rates' | 'water' | 'strata' | 'rent' | 'other';
  adjustedTo: string; // Date
  paidBy: 'vendor' | 'purchaser';
}

interface PEXADocument {
  documentId: string;
  documentType: 'contract' | 'mortgage' | 'discharge' | 'transfer' | 'caveat' | 'identity' | 'supporting';
  fileName: string;
  uploadedDate: string;
  uploadedBy: string;
  signatureRequired: boolean;
  signatureStatus?: 'unsigned' | 'partially_signed' | 'fully_signed';
  signatories?: string[];
}

interface PEXATask {
  taskId: string;
  taskType: string;
  description: string;
  status: 'outstanding' | 'in_progress' | 'completed';
  assignedTo: string;
  dueDate?: string;
  completedDate?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface PEXALodgementInstruction {
  instructionId: string;
  documentType: 'transfer' | 'mortgage' | 'discharge' | 'caveat';
  dealingNumber?: string;
  lodgementDateTime?: string;
  lodgementStatus: 'pending' | 'lodged' | 'registered' | 'rejected';
  requisitions?: PEXARequisition[];
}

interface PEXARequisition {
  requisitionId: string;
  issuedDate: string;
  description: string;
  status: 'open' | 'responded' | 'resolved';
  response?: string;
}

interface PEXAWebhookEvent {
  eventType: 'workspace.created' | 'workspace.updated' | 'settlement.booked' | 'settlement.completed' | 'settlement.failed' | 'lodgement.completed' | 'requisition.issued' | 'document.signed' | 'funds.received';
  workspaceId: string;
  timestamp: string;
  data: any;
}

export class PEXAService {
  private config: PEXAConfig;

  constructor(environment: 'sandbox' | 'production' = 'sandbox') {
    this.config = {
      apiKey: Deno.env.get('PEXA_API_KEY') || '',
      apiSecret: Deno.env.get('PEXA_API_SECRET') || '',
      subscriberId: Deno.env.get('PEXA_SUBSCRIBER_ID') || '',
      environment,
      baseUrl: environment === 'production' 
        ? 'https://api.pexa.net.au/v1' 
        : 'https://api.test.pexa.net.au/v1'
    };
  }

  private async makeRequest(method: string, endpoint: string, body?: any): Promise<any> {
    // When PEXA credentials are available, this will make actual API calls
    if (!this.config.apiKey) {
      throw new Error('PEXA API credentials not configured. Please set PEXA_API_KEY, PEXA_API_SECRET, and PEXA_SUBSCRIBER_ID');
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    const timestamp = new Date().toISOString();
    
    // PEXA uses HMAC authentication
    const signature = await this.generateSignature(method, endpoint, timestamp, body);

    const headers = {
      'Content-Type': 'application/json',
      'X-PEXA-Subscriber-Id': this.config.subscriberId,
      'X-PEXA-API-Key': this.config.apiKey,
      'X-PEXA-Timestamp': timestamp,
      'X-PEXA-Signature': signature,
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`PEXA API Error: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  private async generateSignature(method: string, endpoint: string, timestamp: string, body?: any): Promise<string> {
    // HMAC-SHA256 signature generation for PEXA API
    const message = `${method}${endpoint}${timestamp}${body ? JSON.stringify(body) : ''}`;
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(this.config.apiSecret);
    const messageData = encoder.encode(message);
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', key, messageData);
    const hashArray = Array.from(new Uint8Array(signature));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ============================================
  // PULL OPERATIONS - Retrieve PEXA Data
  // ============================================

  async getWorkspace(workspaceId: string): Promise<PEXAWorkspace> {
    return this.makeRequest('GET', `/workspaces/${workspaceId}`);
  }

  async getWorkspaceParties(workspaceId: string): Promise<PEXAParty[]> {
    const response = await this.makeRequest('GET', `/workspaces/${workspaceId}/parties`);
    return response.parties;
  }

  async getWorkspaceLandTitles(workspaceId: string): Promise<PEXALandTitle[]> {
    const response = await this.makeRequest('GET', `/workspaces/${workspaceId}/land-titles`);
    return response.landTitles;
  }

  async getFinancialSettlement(workspaceId: string): Promise<PEXAFinancialSettlement> {
    return this.makeRequest('GET', `/workspaces/${workspaceId}/financial-settlement`);
  }

  async getSettlementStatement(workspaceId: string): Promise<any> {
    return this.makeRequest('GET', `/workspaces/${workspaceId}/settlement-statement`);
  }

  async getWorkspaceTasks(workspaceId: string): Promise<PEXATask[]> {
    const response = await this.makeRequest('GET', `/workspaces/${workspaceId}/tasks`);
    return response.tasks;
  }

  async getOutstandingTasks(workspaceId: string): Promise<PEXATask[]> {
    const tasks = await this.getWorkspaceTasks(workspaceId);
    return tasks.filter(t => t.status === 'outstanding' || t.status === 'in_progress');
  }

  async getLodgementInstructions(workspaceId: string): Promise<PEXALodgementInstruction[]> {
    const response = await this.makeRequest('GET', `/workspaces/${workspaceId}/lodgement-instructions`);
    return response.instructions;
  }

  async getWorkspaceDocuments(workspaceId: string): Promise<PEXADocument[]> {
    const response = await this.makeRequest('GET', `/workspaces/${workspaceId}/documents`);
    return response.documents;
  }

  // ============================================
  // PUSH OPERATIONS - Create/Update PEXA Data
  // ============================================

  async createWorkspace(workspaceData: Partial<PEXAWorkspace>): Promise<PEXAWorkspace> {
    return this.makeRequest('POST', '/workspaces', workspaceData);
  }

  async updateWorkspace(workspaceId: string, updates: Partial<PEXAWorkspace>): Promise<PEXAWorkspace> {
    return this.makeRequest('PATCH', `/workspaces/${workspaceId}`, updates);
  }

  async addParty(workspaceId: string, party: PEXAParty): Promise<PEXAParty> {
    return this.makeRequest('POST', `/workspaces/${workspaceId}/parties`, party);
  }

  async updateParty(workspaceId: string, partyId: string, updates: Partial<PEXAParty>): Promise<PEXAParty> {
    return this.makeRequest('PATCH', `/workspaces/${workspaceId}/parties/${partyId}`, updates);
  }

  async createFinancialItem(workspaceId: string, item: PEXAFinancialItem): Promise<PEXAFinancialItem> {
    return this.makeRequest('POST', `/workspaces/${workspaceId}/financial-settlement/items`, item);
  }

  async updateFinancialItem(workspaceId: string, itemId: string, updates: Partial<PEXAFinancialItem>): Promise<PEXAFinancialItem> {
    return this.makeRequest('PATCH', `/workspaces/${workspaceId}/financial-settlement/items/${itemId}`, updates);
  }

  async addAdjustment(workspaceId: string, adjustment: PEXAAdjustment): Promise<PEXAAdjustment> {
    return this.makeRequest('POST', `/workspaces/${workspaceId}/financial-settlement/adjustments`, adjustment);
  }

  async updateSettlementDateTime(workspaceId: string, dateTime: string): Promise<PEXAWorkspace> {
    return this.makeRequest('PATCH', `/workspaces/${workspaceId}/settlement-date-time`, { settlementDateTime: dateTime });
  }

  async uploadDocument(workspaceId: string, document: { documentType: string; fileName: string; content: string }): Promise<PEXADocument> {
    return this.makeRequest('POST', `/workspaces/${workspaceId}/documents`, document);
  }

  async triggerDigitalSigning(workspaceId: string, documentId: string, signatories: string[]): Promise<any> {
    return this.makeRequest('POST', `/workspaces/${workspaceId}/documents/${documentId}/sign`, { signatories });
  }

  async submitForSettlement(workspaceId: string): Promise<any> {
    return this.makeRequest('POST', `/workspaces/${workspaceId}/submit-settlement`, {});
  }

  async submitForFinancialSettlement(workspaceId: string): Promise<any> {
    return this.makeRequest('POST', `/workspaces/${workspaceId}/financial-settlement/submit`, {});
  }

  // ============================================
  // WEBHOOK HANDLER
  // ============================================

  async handleWebhook(event: PEXAWebhookEvent): Promise<void> {
    console.log(`PEXA Webhook received: ${event.eventType} for workspace ${event.workspaceId}`);
    
    // Store webhook event for processing
    // In production, you would:
    // 1. Validate webhook signature
    // 2. Store event in database
    // 3. Trigger appropriate workflows
    // 4. Send notifications to relevant parties
    
    switch (event.eventType) {
      case 'settlement.booked':
        console.log('Settlement has been booked:', event.data);
        break;
      case 'settlement.completed':
        console.log('Settlement completed successfully:', event.data);
        break;
      case 'settlement.failed':
        console.log('Settlement failed:', event.data);
        break;
      case 'lodgement.completed':
        console.log('Lodgement completed:', event.data);
        break;
      case 'requisition.issued':
        console.log('Requisition issued:', event.data);
        break;
      case 'document.signed':
        console.log('Document signed:', event.data);
        break;
      case 'funds.received':
        console.log('Funds received:', event.data);
        break;
      default:
        console.log('Unknown event type:', event.eventType);
    }
  }

  // ============================================
  // CASE DATA TO PEXA MAPPING
  // ============================================

  mapCaseDataToPEXAWorkspace(caseData: any): Partial<PEXAWorkspace> {
    const propertyData = caseData.propertyData;
    const financialData = caseData.financialData;
    const parties = caseData.parties || [];

    return {
      jurisdiction: this.mapStateToJurisdiction(propertyData?.address?.state || 'NSW'),
      parties: this.mapParties(parties),
      landTitles: [{
        titleReference: propertyData?.titleReference || '',
        lotPlanNumber: propertyData?.lotPlan || '',
        jurisdiction: this.mapStateToJurisdiction(propertyData?.address?.state || 'NSW'),
        address: {
          streetAddress: propertyData?.address?.street || '',
          suburb: propertyData?.address?.suburb || '',
          state: propertyData?.address?.state || '',
          postcode: propertyData?.address?.postcode || '',
        },
        titleType: 'torrens',
        dealingNumbers: [],
        caveats: [],
        mortgages: this.mapMortgages(financialData),
      }],
      financialSettlement: {
        settlementStatementId: `STMT-${caseData.caseId}`,
        totalSettlementAmount: financialData?.totalLoanAmount || 0,
        sourceItems: this.mapSourceItems(financialData),
        destinationItems: this.mapDestinationItems(financialData, parties),
        adjustments: [],
        pexaFees: 0,
        lodgementFees: 0,
        stampDuty: financialData?.stampDuty || 0,
        disbursementStatus: 'pending',
      },
      documents: [],
      tasks: [],
      lodgementInstructions: [],
    };
  }

  private mapStateToJurisdiction(state: string): any {
    const mapping: any = {
      'NSW': 'NSW',
      'VIC': 'VIC',
      'QLD': 'QLD',
      'SA': 'SA',
      'WA': 'WA',
      'TAS': 'TAS',
      'ACT': 'ACT',
      'NT': 'NT',
    };
    return mapping[state] || 'NSW';
  }

  private mapParties(parties: any[]): PEXAParty[] {
    return parties.map((party, index) => ({
      partyId: `PARTY-${index + 1}`,
      partyType: party.type || 'individual',
      fullName: party.name || '',
      email: party.email || '',
      phone: party.phone || '',
      identityVerified: false,
      role: party.role || 'purchaser',
    }));
  }

  private mapMortgages(financialData: any): PEXAMortgage[] {
    if (!financialData?.existingMortgages) return [];
    
    return financialData.existingMortgages.map((mortgage: any, index: number) => ({
      mortgageNumber: `MTG-${index + 1}`,
      mortgagee: mortgage.lender || '',
      mortgageAmount: mortgage.amount || 0,
      action: 'discharge',
      accountNumber: mortgage.accountNumber,
      reference: mortgage.reference,
    }));
  }

  private mapSourceItems(financialData: any): PEXAFinancialItem[] {
    const items: PEXAFinancialItem[] = [];
    
    if (financialData?.totalLoanAmount) {
      items.push({
        itemId: 'SOURCE-1',
        description: 'New Mortgage Loan',
        amount: financialData.totalLoanAmount,
        direction: 'source',
        category: 'loan',
        party: 'Incoming Mortgagee',
      });
    }

    return items;
  }

  private mapDestinationItems(financialData: any, parties: any[]): PEXAFinancialItem[] {
    const items: PEXAFinancialItem[] = [];
    
    if (financialData?.existingMortgages) {
      financialData.existingMortgages.forEach((mortgage: any, index: number) => {
        items.push({
          itemId: `DEST-${index + 1}`,
          description: `Discharge ${mortgage.lender}`,
          amount: mortgage.payoutAmount || mortgage.amount || 0,
          direction: 'destination',
          category: 'other',
          party: mortgage.lender,
        });
      });
    }

    return items;
  }
}

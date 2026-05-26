
export interface IllionTradeReference {
  supplierCategory: string;
  creditLimit: number;
  currentBalance: number;
  paymentStatus: 'Prompt' | '1-30 Days Late' | '31-60 Days Late' | '61+ Days Late' | 'Default';
  lastActivity: string;
}

export interface IllionData {
  businessFailureScore: number; // 0-100
  latePaymentScore: number;    // 0-100
  tradeReferenceCount: number;
  totalTradeLimit: number;
  avgDaysBeyondTerms: number;
  paymentHistory: {
    promptPercentage: number;
    late30Percentage: number;
    late60Percentage: number;
    late90PlusPercentage: number;
  };
  tradeReferences: IllionTradeReference[];
  lastUpdated: string;
  provider: 'Illion';
}

export const ILLION_MOCK_DATA: Record<string, IllionData> = {
  'client-001': {
    businessFailureScore: 82,
    latePaymentScore: 75,
    tradeReferenceCount: 14,
    totalTradeLimit: 250000,
    avgDaysBeyondTerms: 4,
    paymentHistory: {
      promptPercentage: 85,
      late30Percentage: 10,
      late60Percentage: 4,
      late90PlusPercentage: 1,
    },
    tradeReferences: [
      { supplierCategory: 'Technology Wholesaler', creditLimit: 50000, currentBalance: 12000, paymentStatus: 'Prompt', lastActivity: '2026-03-15' },
      { supplierCategory: 'Office Supplies', creditLimit: 5000, currentBalance: 450, paymentStatus: 'Prompt', lastActivity: '2026-03-10' },
      { supplierCategory: 'Cloud Services', creditLimit: 25000, currentBalance: 8000, paymentStatus: 'Prompt', lastActivity: '2026-03-20' },
      { supplierCategory: 'Logistics Partner', creditLimit: 15000, currentBalance: 2300, paymentStatus: '1-30 Days Late', lastActivity: '2026-03-05' },
    ],
    lastUpdated: '2026-03-22',
    provider: 'Illion',
  },
  'client-002': {
    businessFailureScore: 94,
    latePaymentScore: 92,
    tradeReferenceCount: 22,
    totalTradeLimit: 1200000,
    avgDaysBeyondTerms: 1,
    paymentHistory: {
      promptPercentage: 98,
      late30Percentage: 2,
      late60Percentage: 0,
      late90PlusPercentage: 0,
    },
    tradeReferences: [
      { supplierCategory: 'Financial Services', creditLimit: 500000, currentBalance: 0, paymentStatus: 'Prompt', lastActivity: '2026-03-18' },
      { supplierCategory: 'Legal Services', creditLimit: 100000, currentBalance: 15000, paymentStatus: 'Prompt', lastActivity: '2026-03-12' },
    ],
    lastUpdated: '2026-03-20',
    provider: 'Illion',
  },
  'client-004': {
    businessFailureScore: 35,
    latePaymentScore: 28,
    tradeReferenceCount: 8,
    totalTradeLimit: 75000,
    avgDaysBeyondTerms: 42,
    paymentHistory: {
      promptPercentage: 40,
      late30Percentage: 25,
      late60Percentage: 20,
      late90PlusPercentage: 15,
    },
    tradeReferences: [
      { supplierCategory: 'Shipping & Freight', creditLimit: 30000, currentBalance: 28000, paymentStatus: '61+ Days Late', lastActivity: '2026-03-10' },
      { supplierCategory: 'Warehouse Leasing', creditLimit: 25000, currentBalance: 25000, paymentStatus: '31-60 Days Late', lastActivity: '2026-03-01' },
      { supplierCategory: 'Customs Broker', creditLimit: 10000, currentBalance: 9500, paymentStatus: 'Default', lastActivity: '2026-02-15' },
    ],
    lastUpdated: '2026-03-21',
    provider: 'Illion',
  },
};

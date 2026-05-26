// Mock data for Grow MIP Virtual MIP Platform

export interface Property {
  id: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  landSize: number;
  imageUrl: string;
  // Extended property details
  lotNumber?: string;
  planNumber?: string;
  titleReference?: string;
  volumeFolio?: string;
  localGovernmentArea?: string;
  zoning?: string;
  zoningDescription?: string;
  yearBuilt?: string;
  floorArea?: string;
  storeys?: string;
  construction?: string;
  condition?: string;
  councilRates?: string;
  waterRates?: string;
  strataFees?: string;
  landTax?: string;
  floodRisk?: 'unknown' | 'low' | 'medium' | 'high';
  bushfireRisk?: 'unknown' | 'low' | 'medium' | 'high';
}

export interface Valuation {
  id: string;
  amount: number;
  date: Date;
  valuerId: string;
  valuerName: string;
  status: string;
  // RP Data AVM Details
  rpDataAvmMid?: number;
  rpDataAvmLow?: number;
  rpDataAvmHigh?: number;
  rpDataConfidence?: string;
  rpDataLastSaleDate?: string;
  rpDataLastSalePrice?: number;
}

export interface BorrowerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob?: string;
  residentialAddress?: string;
  postalAddress?: string;
  employment?: string;
  employer?: string;
  occupation?: string;
  income?: string;
  // KYC Details
  idType?: string;
  idNumber?: string;
  idState?: string;
  idExpiry?: string;
  kycStatus?: 'pending' | 'verified' | 'failed';
  kycVerifiedDate?: Date;
  sourceOfFunds?: string;
  sourceOfWealth?: string;
  // Risk Flags
  cashInvolvement?: boolean;
  cryptoInvolvement?: boolean;
  pepStatus?: boolean;
  relatedPartyPep?: boolean;
}

export interface EntityStructure {
  type: 'personal' | 'company' | 'trust';
  // Company details
  companyName?: string;
  companyACN?: string;
  companyABN?: string;
  companyRegistrationDate?: string;
  companyType?: string;
  directors?: Array<{name: string; position: string; dob: string; email: string; phone: string}>;
  shareholders?: Array<{name: string; percentage: number; dob: string; email: string; phone: string}>;
  // Trust details
  trustName?: string;
  trustType?: string;
  trustABN?: string;
  trustEstablishmentDate?: string;
  trustees?: Array<{type: 'individual' | 'company'; name: string; abn?: string}>;
  // Guarantors
  guarantors?: Array<{type: 'individual' | 'company'; name: string; dob?: string; email?: string; phone?: string}>;
}

export interface LoanDetails {
  outstandingDebt: number;
  originalLoanAmount?: number;
  loanStartDate?: string;
  interestRate?: string;
  repaymentType?: string;
  missedPayments?: number;
  arrears?: number;
  defaultDate?: string;
  defaultReason?: string;
  hardshipCircumstances?: string;
}

export interface LenderDetails {
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
  accountNumber?: string;
  // Australian Credit Licence
  aclNumber?: string;
  aclHolderName?: string;
  licenceType?: string;
  authorisedRepNumber?: string;
}

export interface AllParties {
  borrowerLawyer?: {name: string; firm: string; email: string; phone: string};
  lenderLawyer?: {name: string; firm: string; email: string; phone: string};
  receiver?: {appointed: boolean; name?: string; company?: string; email?: string; phone?: string};
  realEstateAgent?: {name: string; agency: string; email: string; phone: string; license: string};
  accountant?: {name: string; firm: string; email: string; phone: string};
  valuer?: {name: string; company: string; email: string; phone: string};
  auctioneer?: {name: string; company: string; email: string; phone: string};
  conveyancer?: {name: string; firm: string; email: string; phone: string};
  propertyManager?: {name: string; agency: string; email: string; phone: string};
  trustee?: {appointed: boolean; name?: string; company?: string; email?: string};
  insuranceBroker?: {name: string; company: string; email: string; phone: string};
}

export interface NCCPCompliance {
  subjectToNCCP: boolean;
  loanPurpose?: string;
  consumerOrBusinessPurpose?: string;
  preContractualDisclosureProvided?: boolean;
  borrowerCooperation?: string;
  possessionStatus?: string;
  tenancyDetails?: string;
}

export interface DocumentsTracking {
  // InfoTrack documents
  titleSearchCompleted?: boolean;
  identityVerificationCompleted?: boolean;
  encumbranceCheckCompleted?: boolean;
  zoningCheckCompleted?: boolean;
  environmentalCheckCompleted?: boolean;
  // Lender documents
  originalLoanAgreementUploaded?: boolean;
  loanVariationsUploaded?: boolean;
  bankStatementsUploaded?: boolean;
  payoutLetterUploaded?: boolean;
  formalApprovalUploaded?: boolean;
  // Borrower documents
  borrowerIDUploaded?: boolean;
  proofOfIncomeUploaded?: boolean;
  financialStatementsUploaded?: boolean;
}

export interface Case {
  id: string;
  caseNumber: string;
  borrowerName: string;
  lenderName: string;
  property: Property;
  valuation: Valuation;
  outstandingDebt: number;
  status: 'active' | 'pending' | 'in_auction' | 'under_contract' | 'completed' | 'cancelled';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
  
  // Extended case details from form
  borrowerDetails?: BorrowerDetails;
  entityStructure?: EntityStructure;
  loanDetails?: LoanDetails;
  lenderDetails?: LenderDetails;
  allParties?: AllParties;
  nccpCompliance?: NCCPCompliance;
  documentsTracking?: DocumentsTracking;
  
  // Auction details
  auctionEndTime?: Date;
  minimumBid?: number;
  currentBid?: number;
  bidCount?: number;
  
  // Additional tracking
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  infoTrackChecksCompleted?: boolean;
  automatedChecksCompleted?: boolean;
  creditCheckCompleted?: boolean;
  paymentVerified?: boolean;
}

export interface Bid {
  id: string;
  caseId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: Date;
  status: 'active' | 'outbid' | 'winning' | 'accepted' | 'rejected';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'borrower' | 'lender' | 'investor' | 'admin' | 'lawyer' | 'receiver';
  organization?: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  proofOfFundsVerified: boolean;
}

// Mock Cases
export const mockCases: Case[] = [
  {
    id: 'case-001',
    caseNumber: 'MIP-2026-001',
    borrowerName: 'Sarah Mitchell',
    lenderName: 'Commonwealth Bank',
    property: {
      id: 'prop-001',
      address: '45 Victoria Street',
      suburb: 'Potts Point',
      state: 'NSW',
      postcode: '2011',
      propertyType: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      landSize: 0,
      imageUrl: 'https://images.unsplash.com/photo-1559329146-807aff9ff1fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MDg3Mzc5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      // Extended property details
      lotNumber: '12',
      planNumber: 'SP87654',
      titleReference: 'Vol 9876 Fol 234',
      volumeFolio: '9876/234',
      localGovernmentArea: 'City of Sydney',
      zoning: 'R4',
      zoningDescription: 'High Density Residential',
      yearBuilt: '2018',
      floorArea: '95',
      storeys: '2',
      construction: 'Concrete and Steel',
      condition: 'Excellent',
      councilRates: '2850',
      waterRates: '680',
      strataFees: '3200',
      landTax: '1200',
      floodRisk: 'low',
      bushfireRisk: 'low',
    },
    valuation: {
      id: 'val-001',
      amount: 1250000,
      date: new Date('2026-01-15'),
      valuerId: 'valuer-001',
      valuerName: 'Preston Rowe Paterson',
      status: 'completed',
      // RP Data AVM Details
      rpDataAvmMid: 1250000,
      rpDataAvmLow: 1180000,
      rpDataAvmHigh: 1320000,
      rpDataConfidence: 'High (85%)',
      rpDataLastSaleDate: '2023-03-15',
      rpDataLastSalePrice: 1100000,
    },
    outstandingDebt: 980000,
    status: 'in_auction',
    riskLevel: 'medium',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-02-10'),
    auctionEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    minimumBid: 1000000,
    currentBid: 1100000,
    bidCount: 7,
    urgency: 'high',
    
    // Extended case details
    borrowerDetails: {
      firstName: 'Sarah',
      lastName: 'Mitchell',
      email: 'sarah.mitchell@email.com',
      phone: '+61 412 345 678',
      dob: '1985-06-15',
      residentialAddress: '45 Victoria Street, Potts Point NSW 2011',
      postalAddress: '45 Victoria Street, Potts Point NSW 2011',
      employment: 'full_time',
      employer: 'Macquarie Group',
      occupation: 'Financial Analyst',
      income: '145000',
      idType: 'drivers_licence',
      idNumber: '12345678',
      idState: 'NSW',
      idExpiry: '2028-06-15',
      kycStatus: 'verified',
      kycVerifiedDate: new Date('2026-01-08'),
      sourceOfFunds: 'Salary income and investment returns',
      sourceOfWealth: 'Employment income accumulated over 15 years',
      cashInvolvement: false,
      cryptoInvolvement: false,
      pepStatus: false,
      relatedPartyPep: false,
    },
    
    entityStructure: {
      type: 'personal',
    },
    
    loanDetails: {
      outstandingDebt: 980000,
      originalLoanAmount: 950000,
      loanStartDate: '2019-03-01',
      interestRate: '5.85',
      repaymentType: 'principal_and_interest',
      missedPayments: 4,
      arrears: 18500,
      defaultDate: '2025-09-15',
      defaultReason: 'Loss of employment followed by extended job search period',
      hardshipCircumstances: 'Borrower experienced redundancy in July 2025. Has since secured new employment but accumulated arrears during unemployment period.',
    },
    
    lenderDetails: {
      name: 'Commonwealth Bank',
      contact: 'Michael Stevens',
      email: 'michael.stevens@cba.com.au',
      phone: '+61 2 9378 2000',
      accountNumber: 'CBA-ML-2019-5678',
      aclNumber: '123456',
      aclHolderName: 'Commonwealth Bank of Australia',
      licenceType: 'Australian Credit Licence',
      authorisedRepNumber: 'AR-456789',
    },
    
    allParties: {
      borrowerLawyer: {
        name: 'Jennifer Wong',
        firm: 'Wong & Associates Legal',
        email: 'j.wong@wonglaw.com.au',
        phone: '+61 2 9876 5432',
      },
      lenderLawyer: {
        name: 'David Richardson',
        firm: 'Clayton Utz',
        email: 'd.richardson@claytonutz.com',
        phone: '+61 2 9353 4000',
      },
      realEstateAgent: {
        name: 'Rebecca Taylor',
        agency: 'Ray White Potts Point',
        email: 'rebecca@raywhite.com',
        phone: '+61 2 9358 6999',
        license: 'NSW-RE-45678',
      },
      accountant: {
        name: 'Thomas Chen',
        firm: 'Chen & Partners Chartered Accountants',
        email: 't.chen@chenpartners.com.au',
        phone: '+61 2 9264 8888',
      },
      valuer: {
        name: 'Andrew Morrison',
        company: 'Preston Rowe Paterson',
        email: 'a.morrison@prp.com.au',
        phone: '+61 2 9292 7400',
      },
      conveyancer: {
        name: 'Patricia Davies',
        firm: 'Davies Conveyancing Services',
        email: 'p.davies@daviesconvey.com.au',
        phone: '+61 2 9555 1234',
      },
      auctioneer: {
        name: 'James Morrison',
        company: 'Acumentis Auctioneers',
        email: 'j.morrison@acumentis.com.au',
        phone: '+61 2 8823 8000',
      },
      propertyManager: {
        name: 'Lisa Anderson',
        agency: 'McGrath Estate Agents',
        email: 'l.anderson@mcgrath.com.au',
        phone: '+61 2 9380 8200',
      },
    },
    
    nccpCompliance: {
      subjectToNCCP: true,
      loanPurpose: 'Owner-occupied residential property purchase',
      consumerOrBusinessPurpose: 'Consumer - personal use',
      preContractualDisclosureProvided: true,
      borrowerCooperation: 'cooperative',
      possessionStatus: 'owner_occupied',
      tenancyDetails: 'Owner-occupied, no tenants',
    },
    
    documentsTracking: {
      titleSearchCompleted: true,
      identityVerificationCompleted: true,
      encumbranceCheckCompleted: true,
      zoningCheckCompleted: true,
      environmentalCheckCompleted: true,
      originalLoanAgreementUploaded: true,
      loanVariationsUploaded: true,
      bankStatementsUploaded: true,
      payoutLetterUploaded: true,
      formalApprovalUploaded: true,
      borrowerIDUploaded: true,
      proofOfIncomeUploaded: true,
      financialStatementsUploaded: true,
    },
    
    infoTrackChecksCompleted: true,
    automatedChecksCompleted: true,
    creditCheckCompleted: true,
    paymentVerified: true,
    notes: 'High priority case due to upcoming auction deadline. Borrower has secured new employment and is cooperative. LVR is favorable at 78.4%. Strong equity position provides good security for investors.',
  },
  {
    id: 'case-002',
    caseNumber: 'MIP-2026-002',
    borrowerName: 'James Chen',
    lenderName: 'Westpac',
    property: {
      id: 'prop-002',
      address: '128 Brighton Boulevard',
      suburb: 'North Bondi',
      state: 'NSW',
      postcode: '2026',
      propertyType: 'House',
      bedrooms: 4,
      bathrooms: 3,
      parking: 2,
      landSize: 450,
      imageUrl: 'https://images.unsplash.com/photo-1760129745103-91c4022ed5fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3VzZSUyMGV4dGVyaW9yJTIwc3lkbmV5fGVufDF8fHx8MTc3MDk2NTI3MXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    valuation: {
      id: 'val-002',
      amount: 3200000,
      date: new Date('2026-01-20'),
      valuerId: 'valuer-002',
      valuerName: 'Herron Todd White',
      status: 'completed'
    },
    outstandingDebt: 2100000,
    status: 'active',
    riskLevel: 'low',
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-02-08'),
    minimumBid: 2500000
  },
  {
    id: 'case-003',
    caseNumber: 'MIP-2026-003',
    borrowerName: 'Emma Rodriguez',
    lenderName: 'ANZ',
    property: {
      id: 'prop-003',
      address: '7 Park Lane',
      suburb: 'South Yarra',
      state: 'VIC',
      postcode: '3141',
      propertyType: 'Townhouse',
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      landSize: 180,
      imageUrl: 'https://images.unsplash.com/photo-1672730359547-8adf786d0b6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3duaG91c2UlMjBleHRlcmlvciUyMG1lbGJvdXJuZXxlbnwxfHx8fDE3NzA5NjUyNzF8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    valuation: {
      id: 'val-003',
      amount: 1850000,
      date: new Date('2026-02-01'),
      valuerId: 'valuer-001',
      valuerName: 'Preston Rowe Paterson',
      status: 'completed'
    },
    outstandingDebt: 1600000,
    status: 'under_contract',
    riskLevel: 'low',
    createdAt: new Date('2026-01-25'),
    updatedAt: new Date('2026-02-11'),
    currentBid: 1750000,
    bidCount: 12
  },
  {
    id: 'case-004',
    caseNumber: 'MIP-2026-004',
    borrowerName: 'Michael Thompson',
    lenderName: 'NAB',
    property: {
      id: 'prop-004',
      address: '92 George Street',
      suburb: 'Brisbane CBD',
      state: 'QLD',
      postcode: '4000',
      propertyType: 'Apartment',
      bedrooms: 1,
      bathrooms: 1,
      parking: 0,
      landSize: 0,
      imageUrl: '/images/property-placeholder.jpg'
    },
    valuation: {
      id: 'val-004',
      amount: 520000,
      date: new Date('2026-02-05'),
      valuerId: 'valuer-003',
      valuerName: 'Knight Frank',
      status: 'completed'
    },
    outstandingDebt: 480000,
    status: 'pending',
    riskLevel: 'high',
    createdAt: new Date('2026-02-02'),
    updatedAt: new Date('2026-02-09'),
    minimumBid: 450000
  },
  {
    id: 'case-005',
    caseNumber: 'MIP-2026-005',
    borrowerName: 'Lisa Anderson',
    lenderName: 'Macquarie Bank',
    property: {
      id: 'prop-005',
      address: '156 Stirling Highway',
      suburb: 'Nedlands',
      state: 'WA',
      postcode: '6009',
      propertyType: 'House',
      bedrooms: 5,
      bathrooms: 3,
      parking: 3,
      landSize: 680,
      imageUrl: 'https://images.unsplash.com/photo-1763333869665-a9ce6b0b3465?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmZyb250JTIwaG91c2UlMjBwcm9wZXJ0eXxlbnwxfHx8fDE3NzA5NjUyNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    valuation: {
      id: 'val-005',
      amount: 2800000,
      date: new Date('2026-01-28'),
      valuerId: 'valuer-002',
      valuerName: 'Herron Todd White',
      status: 'completed'
    },
    outstandingDebt: 1950000,
    status: 'completed',
    riskLevel: 'low',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-02-07'),
    currentBid: 2650000,
    bidCount: 15
  }
];

// Mock Bids
export const mockBids: Bid[] = [
  {
    id: 'bid-001',
    caseId: 'case-001',
    bidderId: 'inv-001',
    bidderName: 'Platinum Capital Partners',
    amount: 1100000,
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    status: 'winning'
  },
  {
    id: 'bid-002',
    caseId: 'case-001',
    bidderId: 'inv-002',
    bidderName: 'Strategic Property Group',
    amount: 1050000,
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    status: 'outbid'
  },
  {
    id: 'bid-003',
    caseId: 'case-001',
    bidderId: 'inv-003',
    bidderName: 'Zenith Investments',
    amount: 1025000,
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    status: 'outbid'
  }
];

// Mock Current User
export const mockCurrentUser: User = {
  id: 'user-001',
  name: 'David Williams',
  email: 'david.williams@example.com',
  role: 'investor',
  organization: 'Williams Property Investments',
  kycStatus: 'approved',
  proofOfFundsVerified: true
};

// Mock Messages
export const mockMessages = [
  {
    id: 'msg-001',
    sender: { name: 'Sarah Mitchell', role: 'Borrower' },
    content: 'I have uploaded the additional property documentation as requested.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isCurrentUser: false
  },
  {
    id: 'msg-002',
    sender: { name: 'David Williams', role: 'Investor' },
    content: 'Thank you. Could you also provide the strata report?',
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    isCurrentUser: true
  },
  {
    id: 'msg-003',
    sender: { name: 'Sarah Mitchell', role: 'Borrower' },
    content: 'Yes, I will upload it within the next hour.',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    isCurrentUser: false
  }
];

// Dashboard Statistics
export const borrowerStats = {
  activeCases: 1,
  pendingDocuments: 3,
  nextDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  messagesUnread: 2
};

export const lenderStats = {
  totalCases: 12,
  activeAuctions: 3,
  completedThisMonth: 5,
  totalRecovered: 8750000
};

export const investorStats = {
  activeBids: 2,
  watchlist: 8,
  wonAuctions: 3,
  totalInvested: 4200000
};

export const adminStats = {
  pendingKYC: 7,
  activeDisputes: 2,
  platformUsers: 146,
  monthlyVolume: 12500000
};

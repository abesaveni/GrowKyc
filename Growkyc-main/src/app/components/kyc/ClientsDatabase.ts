export interface TestClient {
  id: string;
  name: string;
  entityType: 'Individual' | 'Company' | 'Trust' | 'Partnership' | 'Foreign Entity';
  status: 'Active' | 'Inactive' | 'Suspended' | 'Under Review';
  abn?: string;
  acn?: string;
  tfn?: string;
  country: string;
  industry: string;
  serviceType: string;
  clientGroup: string;
  riskScores: {
    overall: number;
    aml: number;
    financial: number;
    business: number;
    ownership: number;
  };
  quickStatus: {
    identity: string;
    aml: string;
    entity: string;
    monitoring: string;
  };
  lastReview: string;
  nextReview: string;
  identityData: {
    primaryID: { type: string; number: string; expiry: string; verified: boolean };
    secondaryID?: { type: string; number: string; expiry: string; verified: boolean };
    additionalDocuments?: Array<{ type: string; number: string; expiry?: string; verified: boolean }>;
    biometricStatus: 'Passed' | 'Failed' | 'Pending' | 'Not Required';
    livenessCheck: boolean;
    addressVerified: boolean;
    greenIDScore?: number;
    infoTrackStatus?: string;
    fraudFlags?: Array<{ id: number; type: string; message: string }>;
  };
  amlData: {
    sanctionsMatches: number;
    pepStatus: 'Not PEP' | 'Domestic PEP' | 'Foreign PEP' | 'International Org PEP';
    adverseMediaHits: number;
    worldCheckStatus: string;
    transactionMonitoring: 'Active' | 'Inactive';
    riskRating: 'Low' | 'Medium' | 'High' | 'Critical';
    lastScreeningDate: string;
  };
  entityData: {
    registrationDate?: string;
    asicStatus?: string;
    companyStatus?: string;
    lastRegistrySync?: string;
    registrationHistory?: Array<{ date: string; event: string; source?: string }>;
    keyDates?: Array<{ label: string; date: string; detail?: string }>;
    directors?: Array<{
      name: string;
      appointed: string;
      resigned?: string;
      dateOfBirth?: string;
      role?: string;
      kycStatus?: string;
      screeningBatches?: string[];
    }>;
    shareholders?: Array<{ name: string; shares: number; percentage: number }>;
    trustType?: string;
    trustees?: Array<{ name: string; type: string }>;
    beneficiaries?: Array<{ name: string; entitlement: string }>;
  };
  ownershipData: {
    ubos: Array<{ name: string; ownership: number; verified: boolean; country: string }>;
    ownershipStructureComplete: boolean;
    complexStructure: boolean;
  };
  financialData: {
    bankAccounts: number;
    sourceOfFunds: string;
    sourceOfWealth: string;
    estimatedWealth: string;
    transactionVolume: string;
    highRiskTransactions: number;
  };
  legalData: {
    serviceAgreementSigned: boolean;
    termsAccepted: boolean;
    privacyConsentGiven: boolean;
    engagementLetterDate?: string;
    kycConsentDate: string;
  };
  documentsData: {
    total: number;
    verified: number;
    pending: number;
    rejected: number;
  };
  monitoringData: {
    alertsLast30Days: number;
    activeAlerts: number;
    nameChanges: number;
    addressChanges: number;
    ownershipChanges: number;
  };
  decisionsData?: {
    onboardingDecision: 'Approved' | 'Pending' | 'Rejected';
    onboardingDate: string;
    approver: string;
    riskAssessments: number;
    escalations: number;
  };
  austracData?: {
    smrsFiled: number;
    ttrsFiled: number;
    lastReportDate: string;
    suspiciousActivity: boolean;
  };
  auditData?: {
    totalEvents: number;
    lastActivity: string;
    lastUser: string;
  };
}

export const TEST_CLIENTS: TestClient[] = [
  {
    id: '1',
    name: 'Acme Property Holdings Pty Ltd',
    entityType: 'Company',
    status: 'Active',
    abn: '12 345 678 901',
    acn: '123 456 789',
    country: 'Australia',
    industry: 'Real Estate & Investment',
    serviceType: 'Trust Administration',
    clientGroup: 'Property Sector',
    riskScores: { overall: 28, aml: 25, financial: 30, business: 35, ownership: 20 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'Active', monitoring: 'Active' },
    lastReview: '2024-03-15',
    nextReview: '2025-03-15',
    identityData: {
      primaryID: { type: 'Passport', number: 'N1234567', expiry: '2028-06-15', verified: true },
      secondaryID: { type: 'Driver License', number: '12345678', expiry: '2027-03-20', verified: true },
      additionalDocuments: [
        { type: 'Medicare Card', number: '1234 56789 0', expiry: '2026-12-31', verified: true }
      ],
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 920,
      infoTrackStatus: 'Verified - High Confidence',
      fraudFlags: []
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Low',
      lastScreeningDate: '2024-03-15'
    },
    entityData: {
      registrationDate: '2018-03-15',
      asicStatus: 'Registered',
      companyStatus: 'Active',
      lastRegistrySync: '2024-03-15T09:15:00Z',
      registrationHistory: [
        { date: '2018-03-15', event: 'Company registered — ACN issued', source: 'ASIC' }
      ],
      keyDates: [
        { label: 'ACN issued', date: '2018-03-15', detail: '123 456 789' }
      ],
      directors: [
        { name: 'Michael Chen', appointed: '2018-03-15', dateOfBirth: '1978-04-22', role: 'Director', kycStatus: 'Verified' }
      ],
      shareholders: [
        { name: 'Michael Chen', shares: 100, percentage: 100 }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Michael Chen', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 3,
      sourceOfFunds: 'Business revenue and property rent',
      sourceOfWealth: 'Real estate development',
      estimatedWealth: '$2.5M - $5M',
      transactionVolume: '$100K - $250K monthly',
      highRiskTransactions: 0
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2024-01-15',
      kycConsentDate: '2024-01-15'
    },
    documentsData: { total: 12, verified: 12, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2024-01-20',
      approver: 'Jane Smith - Compliance Manager',
      riskAssessments: 2,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 12, lastReportDate: '2024-03-15', suspiciousActivity: false },
    auditData: { totalEvents: 54, lastActivity: '2024-03-15 14:35:22', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '2',
    name: 'Chen Family Trust',
    entityType: 'Trust',
    status: 'Active',
    abn: '98 765 432 109',
    country: 'Australia',
    industry: 'Investment & Wealth Management',
    serviceType: 'Trust Administration',
    clientGroup: 'High Net Worth',
    riskScores: { overall: 45, aml: 35, financial: 50, business: 40, ownership: 60 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'Active', monitoring: 'Active' },
    lastReview: '2024-01-10',
    nextReview: '2024-03-25',
    identityData: {
      primaryID: { type: 'Driver License', number: 'NSW98765432', expiry: '2029-12-31', verified: true },
      secondaryID: { type: 'Medicare Card', number: '2234 56789 0', expiry: '2027-01-01', verified: true },
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 885,
      infoTrackStatus: 'Verified - Medium Confidence'
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Medium',
      lastScreeningDate: '2024-01-10'
    },
    entityData: {
      registrationDate: '2010-06-22',
      asicStatus: 'Scheme — trust not ASIC-registered',
      companyStatus: 'Active',
      lastRegistrySync: '2024-01-10T14:02:00Z',
      trustType: 'Discretionary Family Trust',
      trustees: [
        { name: 'Robert Smith', type: 'Individual' },
        { name: 'Margaret Smith', type: 'Individual' }
      ],
      beneficiaries: [
        { name: 'Chen Family Members', entitlement: 'Discretionary' }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Robert Smith', ownership: 50, verified: true, country: 'Australia' },
        { name: 'Margaret Smith', ownership: 50, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: true
    },
    financialData: {
      bankAccounts: 5,
      sourceOfFunds: 'Investment returns, dividends',
      sourceOfWealth: 'Accumulated wealth from property investments',
      estimatedWealth: '$5M - $10M',
      transactionVolume: '$250K - $500K monthly',
      highRiskTransactions: 2
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2023-11-10',
      kycConsentDate: '2023-11-10'
    },
    documentsData: { total: 10, verified: 10, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 2, activeAlerts: 1, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2023-11-18',
      approver: 'David Lee - Senior Compliance Officer',
      riskAssessments: 3,
      escalations: 1
    },
    austracData: { smrsFiled: 0, ttrsFiled: 15, lastReportDate: '2024-01-10', suspiciousActivity: false },
    auditData: { totalEvents: 120, lastActivity: '2024-01-10 16:22:11', lastUser: 'trust.admin@grow.com' }
  },
  {
    id: '3',
    name: 'John Michael Smith',
    entityType: 'Individual',
    status: 'Active',
    country: 'Australia',
    industry: 'Engineering & Construction',
    serviceType: 'Wealth Management',
    clientGroup: 'Professional Individual',
    riskScores: { overall: 22, aml: 15, financial: 25, business: 20, ownership: 0 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'N/A', monitoring: 'Active' },
    lastReview: '2024-03-20',
    nextReview: '2024-04-20',
    identityData: {
      primaryID: { type: 'Passport', number: 'PA9876543', expiry: '2030-09-15', verified: true },
      secondaryID: { type: 'Driver License', number: 'VIC87654321', expiry: '2028-11-30', verified: true },
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 945,
      infoTrackStatus: 'Verified - High Confidence',
      fraudFlags: []
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Low',
      lastScreeningDate: '2024-03-20'
    },
    entityData: {},
    ownershipData: {
      ubos: [
        { name: 'John Michael Smith', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 2,
      sourceOfFunds: 'Salary, consulting fees',
      sourceOfWealth: 'Professional career over 15 years',
      estimatedWealth: '$1M - $2M',
      transactionVolume: '$20K - $50K monthly',
      highRiskTransactions: 0
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2024-03-18',
      kycConsentDate: '2024-03-18'
    },
    documentsData: { total: 7, verified: 7, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2024-03-20',
      approver: 'Sarah Chen',
      riskAssessments: 1,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 4, lastReportDate: '2024-03-20', suspiciousActivity: false },
    auditData: { totalEvents: 18, lastActivity: '2024-03-20 11:18:45', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '4',
    name: 'Global Investments Pty Ltd',
    entityType: 'Company',
    status: 'Active',
    abn: '44 654 321 098',
    acn: '456 789 123',
    country: 'Australia',
    industry: 'Financial Investments',
    serviceType: 'Corporate Portfolio',
    clientGroup: 'Corporate Client',
    riskScores: { overall: 42, aml: 38, financial: 55, business: 45, ownership: 35 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'Active', monitoring: 'Active' },
    lastReview: '2024-02-28',
    nextReview: '2025-02-28',
    identityData: {
      primaryID: { type: 'Company Extract', number: 'ASIC-456789123', expiry: 'N/A', verified: true },
      biometricStatus: 'Not Required',
      livenessCheck: false,
      addressVerified: true,
      infoTrackStatus: 'Verified - Company Confirmed',
      fraudFlags: []
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Medium',
      lastScreeningDate: '2024-02-28'
    },
    entityData: {
      registrationDate: '2021-11-10',
      asicStatus: 'Registered',
      companyStatus: 'Active',
      lastRegistrySync: '2024-02-28T08:40:00Z',
      directors: [
        { name: 'Chen Wei', appointed: '2021-11-10', dateOfBirth: '1990-01-08', role: 'Director', kycStatus: 'Verified' }
      ],
      shareholders: [
        { name: 'Chen Wei', shares: 100, percentage: 100 }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Chen Wei', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 4,
      sourceOfFunds: 'Investment dividends and trading surplus',
      sourceOfWealth: 'Financial consulting operations',
      estimatedWealth: '$5M - $10M',
      transactionVolume: '$500K - $1M monthly',
      highRiskTransactions: 1
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2021-11-10',
      kycConsentDate: '2021-11-10'
    },
    documentsData: { total: 15, verified: 15, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 1, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2021-11-15',
      approver: 'Jessica Lee',
      riskAssessments: 4,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 24, lastReportDate: '2024-02-28', suspiciousActivity: false },
    auditData: { totalEvents: 184, lastActivity: '2024-02-28 15:42:33', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '5',
    name: 'Sarah Williams',
    entityType: 'Individual',
    status: 'Under Review',
    country: 'Australia',
    industry: 'Executive Management',
    serviceType: 'Wealth Management',
    clientGroup: 'High Net Worth',
    riskScores: { overall: 72, aml: 85, financial: 45, business: 55, ownership: 0 },
    quickStatus: { identity: 'Verified', aml: 'PEP Match', entity: 'N/A', monitoring: 'Enhanced' },
    lastReview: '2023-03-10',
    nextReview: '2024-03-10',
    identityData: {
      primaryID: { type: 'Passport', number: 'PA9876543', expiry: '2030-09-15', verified: true },
      secondaryID: { type: 'Driver License', number: 'VIC87654321', expiry: '2028-11-30', verified: true },
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 945,
      infoTrackStatus: 'Verified - High Confidence',
      fraudFlags: []
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Domestic PEP',
      adverseMediaHits: 5,
      worldCheckStatus: 'PEP Confirmed - Enhanced Due Diligence Required',
      transactionMonitoring: 'Active',
      riskRating: 'High',
      lastScreeningDate: '2023-03-10'
    },
    entityData: {},
    ownershipData: {
      ubos: [
        { name: 'Sarah Williams', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 4,
      sourceOfFunds: 'Corporate salary and stock options',
      sourceOfWealth: 'Executive career in public companies',
      estimatedWealth: '$5M - $10M',
      transactionVolume: '$200K - $500K monthly',
      highRiskTransactions: 1
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2020-03-10',
      kycConsentDate: '2020-03-10'
    },
    documentsData: { total: 10, verified: 10, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 8, activeAlerts: 2, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Pending',
      onboardingDate: '2020-03-12',
      approver: 'Compliance',
      riskAssessments: 8,
      escalations: 3
    },
    austracData: { smrsFiled: 0, ttrsFiled: 15, lastReportDate: '2023-03-10', suspiciousActivity: true },
    auditData: { totalEvents: 412, lastActivity: '2023-03-10 11:18:45', lastUser: 'edd.specialist@grow.com' }
  },
  {
    id: '6',
    name: 'Thompson & Associates Partnership',
    entityType: 'Partnership',
    status: 'Active',
    abn: '87 654 321 098',
    country: 'Australia',
    industry: 'Legal Services',
    serviceType: 'Trust Account Management',
    clientGroup: 'Professional Services',
    riskScores: { overall: 35, aml: 28, financial: 42, business: 38, ownership: 30 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'Active', monitoring: 'Standard' },
    lastReview: '2024-03-01',
    nextReview: '2025-03-01',
    identityData: {
      primaryID: { type: 'Partnership Agreement', number: 'PA-2015-001', expiry: 'N/A', verified: true },
      biometricStatus: 'Not Required',
      livenessCheck: false,
      addressVerified: true,
      infoTrackStatus: 'Verified - Partnership Confirmed'
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Low',
      lastScreeningDate: '2024-03-01'
    },
    entityData: {
      registrationDate: '2015-04-12',
      asicStatus: 'ABN active — partnership',
      companyStatus: 'Active',
      lastRegistrySync: '2024-03-01T11:00:00Z',
      registrationHistory: [
        { date: '2015-04-12', event: 'Partnership commenced', source: 'ABR' }
      ],
      keyDates: [
        { label: 'ABN effective', date: '2015-04-12' }
      ],
      directors: [
        { name: 'Jennifer Anderson', appointed: '2015-04-12', dateOfBirth: '1972-06-18', role: 'Partner', kycStatus: 'Verified' }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Jennifer Anderson', ownership: 50, verified: true, country: 'Australia' },
        { name: 'Michael Thompson', ownership: 50, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 3,
      sourceOfFunds: 'Professional services fees',
      sourceOfWealth: 'Law firm partnership equity',
      estimatedWealth: '$2.5M - $5M',
      transactionVolume: '$100K - $250K monthly',
      highRiskTransactions: 0
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2015-04-12',
      kycConsentDate: '2015-04-12'
    },
    documentsData: { total: 14, verified: 14, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2015-04-15',
      approver: 'Compliance',
      riskAssessments: 1,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 8, lastReportDate: '2024-03-01', suspiciousActivity: false },
    auditData: { totalEvents: 84, lastActivity: '2024-03-01 10:00:00', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '7',
    name: 'Sunrise Development Trust',
    entityType: 'Trust',
    status: 'Active',
    abn: '77 654 321 999',
    country: 'Australia',
    industry: 'Real Estate & Investment',
    serviceType: 'Trust Administration',
    clientGroup: 'High Net Worth',
    riskScores: { overall: 48, aml: 38, financial: 52, business: 42, ownership: 65 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'Active', monitoring: 'Active' },
    lastReview: '2024-03-18',
    nextReview: '2024-04-18',
    identityData: {
      primaryID: { type: 'Driver License', number: 'VIC77665544', expiry: '2028-10-31', verified: true },
      secondaryID: { type: 'Medicare Card', number: '3234 56789 0', expiry: '2027-02-02', verified: true },
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 890,
      infoTrackStatus: 'Verified - Medium Confidence'
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Medium',
      lastScreeningDate: '2024-03-18'
    },
    entityData: {
      registrationDate: '2012-08-15',
      asicStatus: 'Scheme — trust not ASIC-registered',
      companyStatus: 'Active',
      lastRegistrySync: '2024-03-18T14:02:00Z',
      trustType: 'Discretionary Family Trust',
      trustees: [
        { name: 'Marcus Sunrise', type: 'Individual' }
      ],
      beneficiaries: [
        { name: 'Sunrise Family Members', entitlement: 'Discretionary' }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Marcus Sunrise', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: true
    },
    financialData: {
      bankAccounts: 4,
      sourceOfFunds: 'Property rentals, investment dividends',
      sourceOfWealth: 'Real estate development surplus capital',
      estimatedWealth: '$5M - $10M',
      transactionVolume: '$250K - $500K monthly',
      highRiskTransactions: 1
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2012-08-15',
      kycConsentDate: '2012-08-15'
    },
    documentsData: { total: 12, verified: 9, pending: 3, rejected: 0 },
    monitoringData: { alertsLast30Days: 1, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2012-08-20',
      approver: 'Sarah Chen',
      riskAssessments: 3,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 10, lastReportDate: '2024-03-18', suspiciousActivity: false },
    auditData: { totalEvents: 92, lastActivity: '2024-03-18 16:22:11', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '8',
    name: 'Pacific Trading Co Pty Ltd',
    entityType: 'Company',
    status: 'Suspended',
    abn: '45 678 912 345',
    acn: '456 789 123',
    country: 'Australia',
    industry: 'Import/Export',
    serviceType: 'Corporate Banking',
    clientGroup: 'International Trade',
    riskScores: { overall: 88, aml: 92, financial: 78, business: 85, ownership: 95 },
    quickStatus: { identity: 'Verified', aml: 'SANCTIONS', entity: 'Active', monitoring: 'Enhanced' },
    lastReview: '2024-03-05',
    nextReview: '2024-03-23',
    identityData: {
      primaryID: { type: 'Company Extract', number: 'ASIC-456789123', expiry: 'N/A', verified: true },
      biometricStatus: 'Not Required',
      livenessCheck: false,
      addressVerified: true,
      infoTrackStatus: 'Verified - Company Confirmed',
      fraudFlags: [
        { id: 1, type: 'warning', message: 'IP Mismatch: Request originates from a different jurisdiction than the registered residential address.' },
        { id: 2, type: 'warning', message: 'Device Anomaly: Associated hardware fingerprint detected across multiple flagged accounts.' },
        { id: 3, type: 'warning', message: 'Multiple Failed Attempts: Intercepted 3 consecutive liveness detection failures.' }
      ]
    },
    amlData: {
      sanctionsMatches: 3,
      pepStatus: 'Foreign PEP',
      adverseMediaHits: 12,
      worldCheckStatus: 'CRITICAL - Sanctions Match on UBO',
      transactionMonitoring: 'Active',
      riskRating: 'Critical',
      lastScreeningDate: '2024-03-05'
    },
    entityData: {
      registrationDate: '2022-11-08',
      asicStatus: 'Registered',
      companyStatus: 'Active',
      lastRegistrySync: '2024-03-05T08:40:00Z',
      directors: [
        { name: 'Viktor Petrov', appointed: '2022-11-08', dateOfBirth: '1975-02-14', role: 'Director', kycStatus: 'Enhanced review', screeningBatches: ['AML-2026-CRIT-9910'] },
        { name: 'Chen Wei', appointed: '2024-01-10', dateOfBirth: '1990-01-08', role: 'Director', kycStatus: 'Verified', screeningBatches: ['AML-2026-Q1-9013'] }
      ],
      shareholders: [
        { name: 'Offshore Holdings BVI', shares: 80, percentage: 80 },
        { name: 'Chen Wei', shares: 20, percentage: 20 }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Viktor Petrov', ownership: 45, verified: true, country: 'Russia' },
        { name: 'Unknown Beneficial Owner(s)', ownership: 35, verified: false, country: 'British Virgin Islands' },
        { name: 'Chen Wei', ownership: 20, verified: true, country: 'China' }
      ],
      ownershipStructureComplete: false,
      complexStructure: true
    },
    financialData: {
      bankAccounts: 8,
      sourceOfFunds: 'International trade receipts, export revenues',
      sourceOfWealth: 'Trading operations - partial verification',
      estimatedWealth: '$25M - $50M',
      transactionVolume: '$5M - $10M monthly',
      highRiskTransactions: 18
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2022-11-08',
      kycConsentDate: '2022-11-08'
    },
    documentsData: { total: 15, verified: 13, pending: 2, rejected: 0 },
    monitoringData: { alertsLast30Days: 24, activeAlerts: 12, nameChanges: 2, addressChanges: 3, ownershipChanges: 4 },
    decisionsData: {
      onboardingDecision: 'Rejected',
      onboardingDate: '2024-03-05',
      approver: 'Tom Anderson - Chief Compliance Officer',
      riskAssessments: 15,
      escalations: 8
    },
    austracData: { smrsFiled: 4, ttrsFiled: 87, lastReportDate: '2024-03-05', suspiciousActivity: true },
    auditData: { totalEvents: 1247, lastActivity: '2024-03-05 15:42:33', lastUser: 'sanctions.team@grow.com' }
  },
  {
    id: '9',
    name: 'Emily Zhang',
    entityType: 'Individual',
    status: 'Active',
    country: 'Australia',
    industry: 'Information Technology',
    serviceType: 'Wealth Management',
    clientGroup: 'Professional Individual',
    riskScores: { overall: 15, aml: 10, financial: 18, business: 12, ownership: 0 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'N/A', monitoring: 'Active' },
    lastReview: '2024-03-12',
    nextReview: '2025-03-12',
    identityData: {
      primaryID: { type: 'Passport', number: 'PA1122334', expiry: '2031-01-15', verified: true },
      secondaryID: { type: 'Driver License', number: 'NSW9988776', expiry: '2029-05-20', verified: true },
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 955,
      infoTrackStatus: 'Verified - High Confidence',
      fraudFlags: []
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Low',
      lastScreeningDate: '2024-03-12'
    },
    entityData: {},
    ownershipData: {
      ubos: [
        { name: 'Emily Zhang', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 2,
      sourceOfFunds: 'Salary and equity vesting',
      sourceOfWealth: 'Software engineering career at global tech company',
      estimatedWealth: '$1.5M - $3M',
      transactionVolume: '$30K - $80K monthly',
      highRiskTransactions: 0
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2023-12-05',
      kycConsentDate: '2023-12-05'
    },
    documentsData: { total: 10, verified: 10, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2023-12-10',
      approver: 'Sarah Chen',
      riskAssessments: 1,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 2, lastReportDate: '2024-03-12', suspiciousActivity: false },
    auditData: { totalEvents: 12, lastActivity: '2024-03-12 09:30:00', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '10',
    name: 'Coastal Properties Trust',
    entityType: 'Trust',
    status: 'Active',
    abn: '33 444 555 666',
    country: 'Australia',
    industry: 'Real Estate & Property',
    serviceType: 'Trust Administration',
    clientGroup: 'Professional Services',
    riskScores: { overall: 25, aml: 20, financial: 30, business: 25, ownership: 30 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'Active', monitoring: 'Active' },
    lastReview: '2024-02-20',
    nextReview: '2025-02-20',
    identityData: {
      primaryID: { type: 'Driver License', number: 'QLD88776655', expiry: '2028-12-31', verified: true },
      secondaryID: { type: 'Medicare Card', number: '4234 56789 0', expiry: '2026-11-11', verified: true },
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 910,
      infoTrackStatus: 'Verified - High Confidence'
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Low',
      lastScreeningDate: '2024-02-20'
    },
    entityData: {
      registrationDate: '2018-02-20',
      asicStatus: 'Scheme — trust not ASIC-registered',
      companyStatus: 'Active',
      lastRegistrySync: '2024-02-20T10:15:00Z',
      trustType: 'Discretionary Family Trust',
      trustees: [
        { name: 'Sarah Mitchell', type: 'Individual' }
      ],
      beneficiaries: [
        { name: 'Coastal Family Members', entitlement: 'Discretionary' }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Sarah Mitchell', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 3,
      sourceOfFunds: 'Property rentals, dividends',
      sourceOfWealth: 'Real estate investment',
      estimatedWealth: '$2M - $5M',
      transactionVolume: '$50K - $150K monthly',
      highRiskTransactions: 0
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2018-02-20',
      kycConsentDate: '2018-02-20'
    },
    documentsData: { total: 12, verified: 12, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2018-02-22',
      approver: 'Jessica Lee',
      riskAssessments: 2,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 12, lastReportDate: '2024-02-20', suspiciousActivity: false },
    auditData: { totalEvents: 48, lastActivity: '2024-02-20 14:00:00', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '11',
    name: 'David Robertson',
    entityType: 'Individual',
    status: 'Active',
    country: 'Australia',
    industry: 'Healthcare - Surgeon',
    serviceType: 'Wealth Management',
    clientGroup: 'Professional Individual',
    riskScores: { overall: 48, aml: 40, financial: 55, business: 45, ownership: 0 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'N/A', monitoring: 'Active' },
    lastReview: '2024-03-21',
    nextReview: '2024-04-21',
    identityData: {
      primaryID: { type: 'Passport', number: 'PA4455667', expiry: '2032-04-12', verified: true },
      secondaryID: { type: 'Driver License', number: 'VIC1122334', expiry: '2029-08-18', verified: true },
      biometricStatus: 'Passed',
      livenessCheck: true,
      addressVerified: true,
      greenIDScore: 935,
      infoTrackStatus: 'Verified - High Confidence'
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Medium',
      lastScreeningDate: '2024-03-21'
    },
    entityData: {},
    ownershipData: {
      ubos: [
        { name: 'David Robertson', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 3,
      sourceOfFunds: 'Surgical practice revenue',
      sourceOfWealth: 'Surgical and consulting practice over 20 years',
      estimatedWealth: '$4M - $8M',
      transactionVolume: '$150K - $300K monthly',
      highRiskTransactions: 1
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2024-03-19',
      kycConsentDate: '2024-03-19'
    },
    documentsData: { total: 10, verified: 6, pending: 4, rejected: 0 },
    monitoringData: { alertsLast30Days: 2, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2024-03-21',
      approver: 'Sarah Chen',
      riskAssessments: 3,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 14, lastReportDate: '2024-03-21', suspiciousActivity: false },
    auditData: { totalEvents: 34, lastActivity: '2024-03-21 11:00:00', lastUser: 'compliance.officer@grow.com' }
  },
  {
    id: '12',
    name: 'Metro Development Pty Ltd',
    entityType: 'Company',
    status: 'Active',
    abn: '22 333 444 555',
    acn: '223 333 444',
    country: 'Australia',
    industry: 'Commercial Construction',
    serviceType: 'Corporate Portfolio',
    clientGroup: 'Corporate Client',
    riskScores: { overall: 26, aml: 22, financial: 30, business: 28, ownership: 25 },
    quickStatus: { identity: 'Verified', aml: 'Clear', entity: 'Active', monitoring: 'Active' },
    lastReview: '2024-03-10',
    nextReview: '2025-03-10',
    identityData: {
      primaryID: { type: 'Company Extract', number: 'ASIC-223333444', expiry: 'N/A', verified: true },
      biometricStatus: 'Not Required',
      livenessCheck: false,
      addressVerified: true,
      infoTrackStatus: 'Verified - Company Confirmed',
      fraudFlags: []
    },
    amlData: {
      sanctionsMatches: 0,
      pepStatus: 'Not PEP',
      adverseMediaHits: 0,
      worldCheckStatus: 'Clear',
      transactionMonitoring: 'Active',
      riskRating: 'Low',
      lastScreeningDate: '2024-03-10'
    },
    entityData: {
      registrationDate: '2023-05-22',
      asicStatus: 'Registered',
      companyStatus: 'Active',
      lastRegistrySync: '2024-03-10T09:00:00Z',
      directors: [
        { name: 'Sarah Mitchell', appointed: '2023-05-22', dateOfBirth: '1990-11-08', role: 'Director', kycStatus: 'Verified' }
      ],
      shareholders: [
        { name: 'Sarah Mitchell', shares: 100, percentage: 100 }
      ]
    },
    ownershipData: {
      ubos: [
        { name: 'Sarah Mitchell', ownership: 100, verified: true, country: 'Australia' }
      ],
      ownershipStructureComplete: true,
      complexStructure: false
    },
    financialData: {
      bankAccounts: 3,
      sourceOfFunds: 'Property sale revenue, capital investment',
      sourceOfWealth: 'Commercial property development consulting',
      estimatedWealth: '$3M - $6M',
      transactionVolume: '$300K - $600K monthly',
      highRiskTransactions: 0
    },
    legalData: {
      serviceAgreementSigned: true,
      termsAccepted: true,
      privacyConsentGiven: true,
      engagementLetterDate: '2023-05-22',
      kycConsentDate: '2023-05-22'
    },
    documentsData: { total: 14, verified: 14, pending: 0, rejected: 0 },
    monitoringData: { alertsLast30Days: 0, activeAlerts: 0, nameChanges: 0, addressChanges: 0, ownershipChanges: 0 },
    decisionsData: {
      onboardingDecision: 'Approved',
      onboardingDate: '2023-05-25',
      approver: 'Jessica Lee',
      riskAssessments: 2,
      escalations: 0
    },
    austracData: { smrsFiled: 0, ttrsFiled: 18, lastReportDate: '2024-03-10', suspiciousActivity: false },
    auditData: { totalEvents: 28, lastActivity: '2024-03-10 10:15:00', lastUser: 'compliance.officer@grow.com' }
  }
];

// Only keep TWO illustrative demo records; everything else comes from the live
// backend (merged in by the screens that read this store). Bumped storage key
// forces old browsers (which cached all 13 demo clients) to reset to 2.
const STORAGE_KEY = 'growkyc_clients_v2';
const DEMO_CLIENTS: TestClient[] = TEST_CLIENTS.slice(0, 2);

let listeners: Array<(clients: TestClient[]) => void> = [];
let currentClients: TestClient[] = (() => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('growkyc_clients'); // clear the old 13-client cache
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  return DEMO_CLIENTS;
})();

export const ClientsDB = {
  getClients: (): TestClient[] => currentClients,
  addClient: (client: TestClient) => {
    currentClients = [...currentClients, client];
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentClients));
    }
    listeners.forEach(l => l(currentClients));
  },
  updateClient: (id: string, updated: Partial<TestClient>) => {
    currentClients = currentClients.map(c => c.id === id ? { ...c, ...updated } : c);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentClients));
    }
    listeners.forEach(l => l(currentClients));
  },
  subscribe: (listener: (clients: TestClient[]) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }
};

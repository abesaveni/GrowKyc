// Associate Legal Risk Data - Directors, Shareholders, UBOs, Related Entities

export interface AssociateLegalRecord {
  associateId: string;
  associateName: string;
  associateType: 'Director' | 'Shareholder' | 'UBO' | 'Related Entity' | 'Trustee' | 'Beneficiary';
  relationship: string;
  hasLegalIssues: boolean;
  legalRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  criminalRecord: CriminalRecord[];
  civilLitigation: CivilCase[];
  regulatoryActions: AssociateRegulatoryAction[];
  disqualifications: Disqualification[];
  bankruptcies: Bankruptcy[];
  adverseMedia: AdverseMediaItem[];
}

export interface CriminalRecord {
  id: string;
  offense: string;
  jurisdiction: string;
  date: string;
  status: 'Convicted' | 'Charges Pending' | 'Under Investigation' | 'Acquitted';
  sentence?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  details: string;
}

export interface CivilCase {
  id: string;
  caseType: 'Default Judgement' | 'Commercial Dispute' | 'Contract Breach' | 'Fraud' | 'Personal Injury';
  plaintiff: string;
  defendant: string;
  amount?: string;
  status: 'Open' | 'Settled' | 'Judgement Entered' | 'Dismissed';
  date: string;
  outcome?: string;
}

export interface AssociateRegulatoryAction {
  id: string;
  regulator: string;
  actionType: 'Fine' | 'Warning' | 'License Revocation' | 'Enforcement Action';
  date: string;
  amount?: string;
  details: string;
  status: 'Active' | 'Resolved' | 'Under Appeal';
}

export interface Disqualification {
  id: string;
  type: 'Director Disqualification' | 'Professional Disqualification' | 'Trustee Ban';
  jurisdiction: string;
  startDate: string;
  endDate?: string;
  reason: string;
  issuingAuthority: string;
  status: 'Active' | 'Expired' | 'Appealed';
}

export interface Bankruptcy {
  id: string;
  type: 'Personal Bankruptcy' | 'Corporate Insolvency' | 'Voluntary Administration';
  filingDate: string;
  dischargeDate?: string;
  status: 'Active' | 'Discharged' | 'Annulled';
  jurisdiction: string;
  liabilities?: string;
  creditorCount?: number;
}

export interface AdverseMediaItem {
  id: string;
  headline: string;
  source: string;
  date: string;
  category: 'Criminal' | 'Fraud' | 'Corruption' | 'Sanctions' | 'Financial Crime' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  verified: boolean;
}

export interface NetworkLegalRisk {
  clientId: string;
  overallNetworkRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  totalAssociatesChecked: number;
  associatesWithIssues: number;
  criticalAssociates: number;
  highRiskAssociates: number;
  associateLegalRecords: AssociateLegalRecord[];
}

export const ASSOCIATE_LEGAL_DATABASE: Record<string, NetworkLegalRisk> = {
  // Sarah Chen - All associates clean
  'client-001': {
    clientId: 'client-001',
    overallNetworkRisk: 'Low',
    totalAssociatesChecked: 3,
    associatesWithIssues: 0,
    criticalAssociates: 0,
    highRiskAssociates: 0,
    associateLegalRecords: [
      {
        associateId: 'sarah-chen',
        associateName: 'Sarah Chen',
        associateType: 'Director',
        relationship: 'Primary Entity',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      },
      {
        associateId: 'john-chen',
        associateName: 'John Chen',
        associateType: 'Shareholder',
        relationship: 'Spouse - 30% shareholder',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      },
      {
        associateId: 'chen-family-trust',
        associateName: 'Chen Family Trust',
        associateType: 'Related Entity',
        relationship: 'Related trust - 20% shareholder',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      }
    ]
  },

  // Global Trade Solutions - SEVERE NETWORK RISK
  'client-004': {
    clientId: 'client-004',
    overallNetworkRisk: 'Critical',
    totalAssociatesChecked: 6,
    associatesWithIssues: 5,
    criticalAssociates: 2,
    highRiskAssociates: 3,
    associateLegalRecords: [
      // Viktor Petrov - CRITICAL RISK
      {
        associateId: 'viktor-petrov',
        associateName: 'Viktor Petrov',
        associateType: 'Director',
        relationship: 'CEO & Director - 45% UBO',
        hasLegalIssues: true,
        legalRisk: 'Critical',
        criminalRecord: [
          {
            id: 'CR-2024-001',
            offense: 'Money Laundering and Sanctions Evasion',
            jurisdiction: 'Australia',
            date: '2024-02-15',
            status: 'Under Investigation',
            severity: 'Critical',
            details: 'Subject of active AUSTRAC investigation for alleged money laundering through shell companies and sanctions evasion schemes. Investigation involves transactions exceeding $10M through high-risk jurisdictions.'
          },
          {
            id: 'CR-2019-002',
            offense: 'Tax Fraud',
            jurisdiction: 'Cyprus',
            date: '2019-06-12',
            status: 'Convicted',
            sentence: '2 years suspended, €500,000 fine',
            severity: 'High',
            details: 'Convicted of tax fraud in Cyprus involving false declarations and offshore account concealment. Received suspended sentence and substantial fine.'
          }
        ],
        civilLitigation: [
          {
            id: 'CL-2023-001',
            caseType: 'Fraud',
            plaintiff: 'Multiple Investors',
            defendant: 'Viktor Petrov',
            amount: '$12M AUD',
            status: 'Open',
            date: '2023-08-20',
            details: 'Class action by investors alleging fraudulent misrepresentation in investment scheme'
          }
        ],
        regulatoryActions: [
          {
            id: 'RA-2024-VP-001',
            regulator: 'ASIC',
            actionType: 'Enforcement Action',
            date: '2024-01-10',
            details: 'ASIC show cause notice issued regarding fitness and propriety to act as director. Investigation into false statements in annual returns.',
            status: 'Active'
          }
        ],
        disqualifications: [
          {
            id: 'DQ-2020-001',
            type: 'Director Disqualification',
            jurisdiction: 'Cyprus',
            startDate: '2020-03-15',
            endDate: '2025-03-15',
            reason: 'Disqualified following tax fraud conviction. Failed to properly maintain company records.',
            issuingAuthority: 'Cyprus Companies Registrar',
            status: 'Active'
          }
        ],
        bankruptcies: [],
        adverseMedia: [
          {
            id: 'AM-2024-001',
            headline: 'Australian Executive Linked to Russian Oligarch Sanctions Evasion Network',
            source: 'Reuters',
            date: '2024-02-20',
            category: 'Sanctions',
            severity: 'Critical',
            summary: 'Investigation reveals Viktor Petrov used network of shell companies in BVI and Cyprus to help sanctioned Russian oligarchs move funds and assets.',
            verified: true
          },
          {
            id: 'AM-2024-002',
            headline: 'Trading Company CEO Under AUSTRAC Investigation',
            source: 'Financial Times',
            date: '2024-03-01',
            category: 'Financial Crime',
            severity: 'Critical',
            summary: 'Financial Times reports Viktor Petrov faces criminal investigation for alleged money laundering and AML compliance failures.',
            verified: true
          }
        ]
      },

      // Anna Kowalski - HIGH RISK
      {
        associateId: 'anna-kowalski',
        associateName: 'Anna Kowalski',
        associateType: 'Shareholder',
        relationship: 'Shareholder - 30% ownership',
        hasLegalIssues: true,
        legalRisk: 'High',
        criminalRecord: [],
        civilLitigation: [
          {
            id: 'CL-2022-005',
            caseType: 'Default Judgement',
            plaintiff: 'Commonwealth Bank',
            defendant: 'Anna Kowalski',
            amount: '$485,000 AUD',
            status: 'Judgement Entered',
            date: '2022-11-15',
            outcome: 'Default judgement entered - no repayment to date'
          }
        ],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [
          {
            id: 'BK-2021-001',
            type: 'Personal Bankruptcy',
            filingDate: '2021-08-20',
            dischargeDate: '2024-08-20',
            status: 'Discharged',
            jurisdiction: 'Australia',
            liabilities: '$1.2M AUD',
            creditorCount: 8
          }
        ],
        adverseMedia: [
          {
            id: 'AM-2022-003',
            headline: 'Former Property Developer Declares Bankruptcy',
            source: 'The Age',
            date: '2021-09-05',
            category: 'Other',
            severity: 'Medium',
            summary: 'Anna Kowalski files for bankruptcy following property development collapse, owing $1.2M to creditors.',
            verified: true
          }
        ]
      },

      // Horizon Investments Ltd - CRITICAL RISK
      {
        associateId: 'horizon-investments',
        associateName: 'Horizon Investments Ltd',
        associateType: 'Related Entity',
        relationship: 'Related entity - source of $2.45M transfer',
        hasLegalIssues: true,
        legalRisk: 'Critical',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [
          {
            id: 'RA-2023-HI-001',
            regulator: 'FinCEN (US)',
            actionType: 'Enforcement Action',
            date: '2023-05-10',
            details: 'Entity flagged by FinCEN for suspicious transactions linked to sanctioned individuals. Subject to enhanced monitoring.',
            status: 'Active'
          }
        ],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: [
          {
            id: 'AM-2023-004',
            headline: 'BVI Shell Company Linked to Sanctions Evasion',
            source: 'ICIJ - Panama Papers',
            date: '2023-03-15',
            category: 'Sanctions',
            severity: 'Critical',
            summary: 'Horizon Investments Ltd identified as shell company with nominee directors used in complex ownership structures to obscure sanctioned individuals.',
            verified: true
          }
        ]
      },

      // Mediterranean Trading Corp - HIGH RISK
      {
        associateId: 'med-trading',
        associateName: 'Mediterranean Trading Corp',
        associateType: 'Related Entity',
        relationship: 'Related entity - recipient of $890K transfer',
        hasLegalIssues: true,
        legalRisk: 'High',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [
          {
            id: 'RA-2023-MT-001',
            regulator: 'Cyprus Securities and Exchange Commission',
            actionType: 'Warning',
            date: '2023-11-20',
            details: 'Warning issued for failure to disclose beneficial ownership and related party transactions.',
            status: 'Active'
          }
        ],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      },

      // Eastern Pacific Holdings - HIGH RISK
      {
        associateId: 'eastern-pacific',
        associateName: 'Eastern Pacific Holdings',
        associateType: 'Related Entity',
        relationship: 'Related entity - source of $3.2M transfer',
        hasLegalIssues: true,
        legalRisk: 'High',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: [
          {
            id: 'AM-2023-005',
            headline: 'Hong Kong Entity Linked to PEP Network',
            source: 'South China Morning Post',
            date: '2023-07-08',
            category: 'Corruption',
            severity: 'High',
            summary: 'Eastern Pacific Holdings connected to individuals on PEP watchlists with potential corruption proceeds.',
            verified: true
          }
        ]
      },

      // Michael Roberts (minority shareholder) - CLEAN
      {
        associateId: 'michael-roberts',
        associateName: 'Michael Roberts',
        associateType: 'Shareholder',
        relationship: 'Shareholder - 10% ownership',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      }
    ]
  },

  // Melbourne Property Trust - All clean
  'client-002': {
    clientId: 'client-002',
    overallNetworkRisk: 'Low',
    totalAssociatesChecked: 4,
    associatesWithIssues: 0,
    criticalAssociates: 0,
    highRiskAssociates: 0,
    associateLegalRecords: [
      {
        associateId: 'david-thompson',
        associateName: 'David Thompson',
        associateType: 'Trustee',
        relationship: 'Primary Trustee',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      },
      {
        associateId: 'sarah-thompson',
        associateName: 'Sarah Thompson',
        associateType: 'Beneficiary',
        relationship: 'Beneficiary - 50%',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      },
      {
        associateId: 'thompson-children',
        associateName: 'Thompson Children',
        associateType: 'Beneficiary',
        relationship: 'Beneficiaries - 50% collective',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      },
      {
        associateId: 'melbourne-holdings',
        associateName: 'Melbourne Holdings Pty Ltd',
        associateType: 'Related Entity',
        relationship: 'Corporate trustee',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      }
    ]
  },

  // TechStart Innovations - All clean
  'client-003': {
    clientId: 'client-003',
    overallNetworkRisk: 'Low',
    totalAssociatesChecked: 5,
    associatesWithIssues: 0,
    criticalAssociates: 0,
    highRiskAssociates: 0,
    associateLegalRecords: [
      {
        associateId: 'emma-rodriguez',
        associateName: 'Emma Rodriguez',
        associateType: 'Director',
        relationship: 'Founder & CEO - 60% UBO',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      },
      {
        associateId: 'james-wong',
        associateName: 'James Wong',
        associateType: 'Director',
        relationship: 'CTO - 25% UBO',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      },
      {
        associateId: 'venture-capital-partners',
        associateName: 'Venture Capital Partners LLC',
        associateType: 'Shareholder',
        relationship: 'VC Investor - 15% ownership',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      }
    ]
  },

  // Green Earth Foundation - All clean
  'client-005': {
    clientId: 'client-005',
    overallNetworkRisk: 'Low',
    totalAssociatesChecked: 3,
    associatesWithIssues: 0,
    criticalAssociates: 0,
    highRiskAssociates: 0,
    associateLegalRecords: [
      {
        associateId: 'patricia-williams',
        associateName: 'Dr. Patricia Williams',
        associateType: 'Director',
        relationship: 'Founder & Director',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      },
      {
        associateId: 'robert-johnson',
        associateName: 'Robert Johnson',
        associateType: 'Director',
        relationship: 'Board Member',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      },
      {
        associateId: 'earth-trust',
        associateName: 'Green Earth Trust',
        associateType: 'Related Entity',
        relationship: 'Associated charitable trust',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      }
    ]
  },

  // Phoenix Consulting Group - All clean
  'client-006': {
    clientId: 'client-006',
    overallNetworkRisk: 'Low',
    totalAssociatesChecked: 3,
    associatesWithIssues: 0,
    criticalAssociates: 0,
    highRiskAssociates: 0,
    associateLegalRecords: [
      {
        associateId: 'michael-chang',
        associateName: 'Michael Chang',
        associateType: 'Director',
        relationship: 'Managing Partner - 70% UBO',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      },
      {
        associateId: 'lisa-nguyen',
        associateName: 'Lisa Nguyen',
        associateType: 'Director',
        relationship: 'Partner - 30% UBO',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      },
      {
        associateId: 'phoenix-holdings',
        associateName: 'Phoenix Holdings Trust',
        associateType: 'Related Entity',
        relationship: 'Associated family trust',
        hasLegalIssues: false,
        legalRisk: 'Low',
        criminalRecord: [],
        civilLitigation: [],
        regulatoryActions: [],
        disqualifications: [],
        bankruptcies: [],
        adverseMedia: []
      }
    ]
  }
};
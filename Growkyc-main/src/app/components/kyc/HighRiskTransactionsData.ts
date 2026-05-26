// High Risk Transactions Data

export interface HighRiskTransaction {
  id: string;
  date: string;
  amount: string;
  type: 'Wire Transfer' | 'Cash Deposit' | 'International Transfer' | 'Cryptocurrency' | 'Third Party Payment';
  counterparty: string;
  counterpartyLocation: string;
  direction: 'Inbound' | 'Outbound';
  riskFlags: string[];
  riskLevel: 'Medium' | 'High' | 'Critical';
  amlConcerns: string[];
  investigationStatus: 'Under Review' | 'Cleared' | 'Escalated' | 'Reported to AUSTRAC';
  investigationNotes?: string;
}

export interface SourceOfFundsProof {
  type: 'LinkedIn Profile' | 'Company Website' | 'Business Registration' | 'News Article' | 'Annual Report';
  title: string;
  url: string;
  description: string;
  verified: boolean;
  lastChecked: string;
}

export interface EnhancedFinancialData {
  clientId: string;
  highRiskTransactions: HighRiskTransaction[];
  sourceOfFundsProof: SourceOfFundsProof[];
}

export const HIGH_RISK_TRANSACTIONS_DATABASE: Record<string, EnhancedFinancialData> = {
  // Sarah Chen - Clean record
  'client-001': {
    clientId: 'client-001',
    highRiskTransactions: [],
    sourceOfFundsProof: [
      {
        type: 'LinkedIn Profile',
        title: 'Sarah Chen - Partner at Chen & Associates Law',
        url: 'https://linkedin.com/in/sarahchen-lawyer',
        description: 'Partner at Chen & Associates Law with 15+ years experience in corporate law. Verified professional profile with 500+ connections.',
        verified: true,
        lastChecked: '2024-03-15'
      },
      {
        type: 'Company Website',
        title: 'Chen & Associates - About Our Team',
        url: 'https://chenassociates.com.au/team',
        description: 'Official law firm website listing Sarah Chen as founding partner. Established 2015.',
        verified: true,
        lastChecked: '2024-03-15'
      }
    ]
  },

  // Global Trade Solutions - HIGH RISK TRANSACTIONS
  'client-004': {
    clientId: 'client-004',
    highRiskTransactions: [
      {
        id: 'HRT-2024-001',
        date: '2024-03-10',
        amount: '$2,450,000 USD',
        type: 'International Transfer',
        counterparty: 'Horizon Investments Ltd',
        counterpartyLocation: 'British Virgin Islands',
        direction: 'Inbound',
        riskFlags: [
          'High-risk jurisdiction (BVI)',
          'Shell company with nominee directors',
          'No clear business purpose',
          'Inconsistent with stated business activity',
          'Counterparty linked to sanctioned individual (Viktor Petrov)'
        ],
        riskLevel: 'Critical',
        amlConcerns: [
          'Possible sanctions evasion',
          'Layering of illicit funds',
          'Use of complex corporate structures to obscure beneficial ownership'
        ],
        investigationStatus: 'Reported to AUSTRAC',
        investigationNotes: 'SMR filed on 2024-03-12. Counterparty shares director with entity on OFAC sanctions list.'
      },
      {
        id: 'HRT-2024-002',
        date: '2024-03-05',
        amount: '$890,000 USD',
        type: 'International Transfer',
        counterparty: 'Mediterranean Trading Corp',
        counterpartyLocation: 'Cyprus',
        direction: 'Outbound',
        riskFlags: [
          'High-risk jurisdiction (Cyprus)',
          'Payment to entity with no established business relationship',
          'Rapid movement of funds (same-day transfer)',
          'Invoices provided appear fraudulent'
        ],
        riskLevel: 'High',
        amlConcerns: [
          'Possible trade-based money laundering',
          'Over/under invoicing schemes',
          'Structuring to avoid reporting thresholds'
        ],
        investigationStatus: 'Under Review',
        investigationNotes: 'Requested additional documentation. Client unable to provide legitimate business contracts.'
      },
      {
        id: 'HRT-2024-003',
        date: '2024-02-28',
        amount: '$3,200,000 USD',
        type: 'Wire Transfer',
        counterparty: 'Eastern Pacific Holdings',
        counterpartyLocation: 'Hong Kong',
        direction: 'Inbound',
        riskFlags: [
          'Bearer share company',
          'Multiple intermediary banks in high-risk jurisdictions',
          'Source of funds unclear',
          'Connected to individuals on PEP watchlist'
        ],
        riskLevel: 'Critical',
        amlConcerns: [
          'Politically exposed persons involved',
          'Complex layering structure',
          'Potential corruption proceeds'
        ],
        investigationStatus: 'Escalated',
        investigationNotes: 'Enhanced due diligence triggered. Payment chain involves 4 intermediary entities across 3 jurisdictions.'
      },
      {
        id: 'HRT-2024-004',
        date: '2024-02-20',
        amount: '$1,750,000 USD',
        type: 'Cash Deposit',
        counterparty: 'N/A (Cash)',
        counterpartyLocation: 'Australia',
        direction: 'Inbound',
        riskFlags: [
          'Large structured cash deposits over 5 days',
          'Just below reporting threshold ($10k)',
          'No legitimate business reason for cash',
          'Deposits made at multiple branch locations'
        ],
        riskLevel: 'Critical',
        amlConcerns: [
          'Deliberate structuring to avoid reporting',
          'Possible proceeds of crime',
          'Smurfing activity detected'
        ],
        investigationStatus: 'Reported to AUSTRAC',
        investigationNotes: 'TTRs filed for each deposit. Pattern indicates deliberate avoidance of AML reporting. SMR filed on 2024-02-22.'
      },
      {
        id: 'HRT-2024-005',
        date: '2024-02-15',
        amount: '$620,000 USD',
        type: 'Cryptocurrency',
        counterparty: 'Unknown Wallet Address',
        counterpartyLocation: 'Unknown',
        direction: 'Inbound',
        riskFlags: [
          'Cryptocurrency conversion to fiat',
          'Wallet linked to darknet marketplaces',
          'No explanation for crypto source',
          'Privacy coins used (Monero)'
        ],
        riskLevel: 'Critical',
        amlConcerns: [
          'Possible proceeds from illegal online activities',
          'Money laundering through crypto mixing',
          'Darknet marketplace connections'
        ],
        investigationStatus: 'Reported to AUSTRAC',
        investigationNotes: 'Blockchain analysis shows mixing service used. Wallet flagged by Chainalysis as high-risk.'
      }
    ],
    sourceOfFundsProof: [
      {
        type: 'Company Website',
        title: 'Global Trade Solutions - Corporate Overview',
        url: 'https://globaltradesolutions.biz',
        description: 'Basic corporate website with minimal information. No team photos, no physical address listed, generic stock photos used.',
        verified: false,
        lastChecked: '2024-03-15'
      },
      {
        type: 'LinkedIn Profile',
        title: 'Viktor Petrov - CEO Global Trade Solutions',
        url: 'https://linkedin.com/in/viktorpetrov-gts',
        description: 'Limited profile with only 12 connections. No work history prior to 2023. Profile photo appears AI-generated.',
        verified: false,
        lastChecked: '2024-03-15'
      }
    ]
  },

  // Melbourne Property Trust - Clean
  'client-002': {
    clientId: 'client-002',
    highRiskTransactions: [],
    sourceOfFundsProof: [
      {
        type: 'LinkedIn Profile',
        title: 'David Thompson - Property Investment Professional',
        url: 'https://linkedin.com/in/davidthompson-property',
        description: 'Experienced property investor with verified credentials. 800+ connections in real estate industry.',
        verified: true,
        lastChecked: '2024-03-14'
      },
      {
        type: 'News Article',
        title: 'Melbourne Property Trust Completes $50M Portfolio Acquisition',
        url: 'https://afr.com.au/property/melbourne-trust-acquisition',
        description: 'Australian Financial Review article covering recent property portfolio acquisition. Legitimate business activity.',
        verified: true,
        lastChecked: '2024-03-14'
      },
      {
        type: 'Annual Report',
        title: 'Melbourne Property Trust - 2023 Annual Report',
        url: 'https://melbournepropertytrust.com.au/reports/2023',
        description: 'Audited financial statements showing $120M in assets under management. Clean audit opinion.',
        verified: true,
        lastChecked: '2024-03-14'
      }
    ]
  },

  // TechStart Innovations - Some medium risk
  'client-003': {
    clientId: 'client-003',
    highRiskTransactions: [
      {
        id: 'HRT-2024-006',
        date: '2024-03-01',
        amount: '$450,000 USD',
        type: 'International Transfer',
        counterparty: 'Venture Capital Partners LLC',
        counterpartyLocation: 'Cayman Islands',
        direction: 'Inbound',
        riskFlags: [
          'Offshore jurisdiction',
          'Venture capital funding from unverified source'
        ],
        riskLevel: 'Medium',
        amlConcerns: [
          'Need to verify legitimacy of VC funding'
        ],
        investigationStatus: 'Cleared',
        investigationNotes: 'Verified as legitimate Series A funding round. Investment agreement and term sheet provided. VC firm has established track record.'
      }
    ],
    sourceOfFundsProof: [
      {
        type: 'LinkedIn Profile',
        title: 'Emma Rodriguez - Founder & CEO TechStart',
        url: 'https://linkedin.com/in/emmarodriguez-tech',
        description: 'Serial entrepreneur with verified background at Google and Atlassian. Featured in Forbes 30 Under 30.',
        verified: true,
        lastChecked: '2024-03-13'
      },
      {
        type: 'Company Website',
        title: 'TechStart Innovations - About Us',
        url: 'https://techstartinnovations.com',
        description: 'Professional startup website with full team bios, product information, and investor details.',
        verified: true,
        lastChecked: '2024-03-13'
      },
      {
        type: 'News Article',
        title: 'TechStart Raises $5M Series A from Top VCs',
        url: 'https://techcrunch.com/techstart-series-a',
        description: 'TechCrunch coverage of Series A funding round from reputable venture capital firms.',
        verified: true,
        lastChecked: '2024-03-13'
      }
    ]
  },

  // Green Earth Foundation - Clean
  'client-005': {
    clientId: 'client-005',
    highRiskTransactions: [],
    sourceOfFundsProof: [
      {
        type: 'Company Website',
        title: 'Green Earth Foundation - Our Mission',
        url: 'https://greenearthfoundation.org',
        description: 'Registered charity website with full financial transparency. Annual reports published. ACNC registered.',
        verified: true,
        lastChecked: '2024-03-12'
      },
      {
        type: 'LinkedIn Profile',
        title: 'Dr. Patricia Williams - Director Green Earth Foundation',
        url: 'https://linkedin.com/in/drpatriciawilliams',
        description: 'Environmental scientist with PhD from ANU. 20+ years in conservation sector. Verified credentials.',
        verified: true,
        lastChecked: '2024-03-12'
      },
      {
        type: 'Business Registration',
        title: 'ACNC Charity Register - Green Earth Foundation',
        url: 'https://acnc.gov.au/charity/greenearthfoundation',
        description: 'Official ACNC registration showing charity status, annual revenue, and governance structure.',
        verified: true,
        lastChecked: '2024-03-12'
      }
    ]
  },

  // Phoenix Consulting Group - Clean
  'client-006': {
    clientId: 'client-006',
    highRiskTransactions: [],
    sourceOfFundsProof: [
      {
        type: 'LinkedIn Profile',
        title: 'Michael Chang - Managing Partner Phoenix Consulting',
        url: 'https://linkedin.com/in/michaelchang-consulting',
        description: 'Former McKinsey consultant with MBA from Melbourne Business School. 1,200+ connections.',
        verified: true,
        lastChecked: '2024-03-11'
      },
      {
        type: 'Company Website',
        title: 'Phoenix Consulting Group - Leadership Team',
        url: 'https://phoenixconsulting.com.au/leadership',
        description: 'Professional services firm with detailed team profiles, case studies, and client testimonials.',
        verified: true,
        lastChecked: '2024-03-11'
      },
      {
        type: 'News Article',
        title: 'Phoenix Consulting Wins Major Government Contract',
        url: 'https://smh.com.au/business/phoenix-govt-contract',
        description: 'Sydney Morning Herald article on $2M government consulting contract award.',
        verified: true,
        lastChecked: '2024-03-11'
      }
    ]
  }
};
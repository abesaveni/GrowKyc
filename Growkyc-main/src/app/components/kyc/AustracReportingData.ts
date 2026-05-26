// AUSTRAC Reporting Data - Ready for Online Portal Submission

export interface SuspiciousMatterReport {
  smrNumber: string;
  filingDate: string;
  filingEntity: string;
  reportingOfficer: string;
  reportPriority: 'Urgent' | 'High' | 'Medium' | 'Low';
  
  // Section 1: Subject Details
  subjectDetails: {
    subjectType: 'Individual' | 'Entity';
    fullLegalName: string;
    tradingNames?: string[];
    abn?: string;
    acn?: string;
    dateOfBirth?: string;
    countryOfBirth?: string;
    nationality?: string;
    addresses: {
      type: 'Residential' | 'Business' | 'Registered';
      address: string;
      country: string;
      current: boolean;
    }[];
    contactDetails: {
      phone?: string;
      email?: string;
    };
    identification: {
      type: string;
      number: string;
      country: string;
      expiryDate?: string;
    }[];
  };
  
  // Section 2: Directors/Controllers (if entity)
  directorsControllers?: {
    name: string;
    dateOfBirth?: string;
    nationality?: string;
    address: string;
    role: string;
    concernsIdentified: string[];
  }[];
  
  // Section 3: Suspicious Activity Summary
  suspiciousActivitySummary: {
    dateActivityCommenced: string;
    dateActivityIdentified: string;
    dateReportFiled: string;
    totalValueInvolved: number;
    numberOfTransactions: number;
    
    primaryConcerns: {
      category: string;
      description: string;
      severity: 'Critical' | 'High' | 'Medium';
    }[];
    
    indicatorsIdentified: string[];
  };
  
  // Section 4: Detailed Transaction Information
  suspiciousTransactions: {
    transactionId: string;
    date: string;
    type: 'Deposit' | 'Withdrawal' | 'Transfer' | 'Currency Exchange' | 'Other';
    amount: number;
    currency: string;
    method: string;
    fromAccount?: string;
    toAccount?: string;
    fromParty?: string;
    toParty?: string;
    destination?: string;
    purpose?: string;
    redFlags: string[];
  }[];
  
  // Section 5: ML/TF Indicators
  mlTfIndicators: {
    structuring: boolean;
    structuringDetails?: string;
    
    sanctionsEvasion: boolean;
    sanctionsDetails?: string;
    
    unusuallyComplex: boolean;
    complexityDetails?: string;
    
    noLegitimateEconomicPurpose: boolean;
    purposeDetails?: string;
    
    highRiskJurisdictions: boolean;
    jurisdictionDetails?: string;
    
    pep: boolean;
    pepDetails?: string;
    
    thirdPartyPayments: boolean;
    thirdPartyDetails?: string;
    
    cashIntensive: boolean;
    cashDetails?: string;
    
    rapidMovement: boolean;
    rapidMovementDetails?: string;
    
    customerBehavior: boolean;
    behaviorDetails?: string;
    
    other: string[];
  };
  
  // Section 6: Supporting Evidence
  supportingEvidence: {
    documentType: string;
    description: string;
    dateObtained: string;
    source: string;
  }[];
  
  // Section 7: Background Information
  backgroundInformation: {
    accountOpeningDate?: string;
    accountType?: string;
    initialDeposit?: number;
    
    customerDueDiligence: {
      cddCompleted: boolean;
      cddDate?: string;
      eddRequired: boolean;
      eddCompleted: boolean;
      eddDate?: string;
      eddOutcome?: string;
    };
    
    sourceOfFunds: {
      declared: string;
      verified: boolean;
      verificationOutcome?: string;
    };
    
    sourceOfWealth: {
      declared: string;
      verified: boolean;
      verificationOutcome?: string;
    };
    
    expectedActivity: string;
    actualActivity: string;
    discrepancyExplanation: string;
  };
  
  // Section 8: Additional Information
  additionalInformation: {
    lawEnforcementContact: boolean;
    lawEnforcementDetails?: string;
    
    mediaReports: boolean;
    mediaDetails?: string;
    
    otherReportingEntities: boolean;
    otherReportingDetails?: string;
    
    ongoingRelationship: boolean;
    relationshipStatus: 'Active' | 'Suspended' | 'Terminated';
    actionTaken: string;
    
    additionalRemarks: string;
  };
  
  // Section 9: Reporting Officer Declaration
  declarationDetails: {
    officerName: string;
    officerTitle: string;
    officerContact: string;
    declarationDate: string;
    signature: string;
  };
  
  // Internal tracking
  austracAcknowledgement?: string;
  austracReferenceNumber?: string;
  feedbackReceived?: boolean;
  feedbackDate?: string;
  feedbackSummary?: string;
}

export interface ThresholdTransactionReport {
  ttrNumber: string;
  transactionDate: string;
  filingDate: string;
  transactionType: 'Cash Deposit' | 'Cash Withdrawal' | 'International Funds Transfer Instruction';
  amount: number;
  currency: string;
  
  accountDetails: {
    accountName: string;
    accountNumber: string;
    accountType: string;
  };
  
  customerDetails: {
    name: string;
    dateOfBirth?: string;
    address: string;
    identification: string;
  };
  
  filedBy: string;
}

export const AUSTRAC_REPORTS_DATABASE: Record<string, {
  clientId: string;
  smrs: SuspiciousMatterReport[];
  ttrs: ThresholdTransactionReport[];
  summary: {
    totalSMRs: number;
    totalTTRs: number;
    lastReportDate: string;
    activeConcerns: boolean;
  };
}> = {
  'client-004': {
    clientId: 'client-004',
    smrs: [
      {
        smrNumber: 'SMR-2024-GTS-001',
        filingDate: '2024-03-22',
        filingEntity: 'Grow Financial Services Pty Ltd',
        reportingOfficer: 'Jennifer Martinez',
        reportPriority: 'Urgent',
        
        subjectDetails: {
          subjectType: 'Entity',
          fullLegalName: 'Global Trade Solutions Pty Ltd',
          tradingNames: ['GTS Trading', 'Global Import Export', 'Pacific Trade Co'],
          abn: '47 123 456 789',
          acn: '123 456 789',
          addresses: [
            {
              type: 'Registered',
              address: 'Level 15, 123 Pitt Street, Sydney NSW 2000, Australia',
              country: 'Australia',
              current: true
            },
            {
              type: 'Business',
              address: 'Suite 8B, Colonial Building, Road Town, Tortola, British Virgin Islands',
              country: 'British Virgin Islands',
              current: true
            }
          ],
          contactDetails: {
            phone: '+61 2 9876 5432',
            email: 'info@globaltrade-solutions.com.au'
          },
          identification: [
            {
              type: 'ABN',
              number: '47 123 456 789',
              country: 'Australia'
            },
            {
              type: 'ACN',
              number: '123 456 789',
              country: 'Australia'
            }
          ]
        },
        
        directorsControllers: [
          {
            name: 'Viktor Petrov',
            dateOfBirth: '1975-03-15',
            nationality: 'Russian/Australian',
            address: '456 Luxury Apartments, Darling Point NSW 2027',
            role: 'Director and 40% Shareholder',
            concernsIdentified: [
              'Criminal convictions for fraud (2018)',
              'Personal bankruptcy 2021-2024',
              'ASIC disqualification proceedings active',
              'Linked to sanctioned Russian oligarch network',
              'International criminal records (Russia, Cyprus)',
              'Interpol Yellow Notice',
              '47 directorships with 32 companies struck off'
            ]
          },
          {
            name: 'Anna Kowalski',
            dateOfBirth: '1982-07-22',
            nationality: 'Polish/Australian',
            address: '789 Riverside Drive, Parramatta NSW 2150',
            role: 'Director and Secretary',
            concernsIdentified: [
              'Personal bankruptcy 2019-2022',
              '12 directorships with 5 companies struck off',
              'Multiple default judgements',
              'Appears to be nominee director'
            ]
          }
        ],
        
        suspiciousActivitySummary: {
          dateActivityCommenced: '2023-06-01',
          dateActivityIdentified: '2024-03-15',
          dateReportFiled: '2024-03-22',
          totalValueInvolved: 18500000,
          numberOfTransactions: 47,
          
          primaryConcerns: [
            {
              category: 'Sanctions Evasion',
              description: 'Company and directors have extensive links to entities and individuals on OFAC SDN list, EU sanctions lists, and Australian sanctions. Complex offshore structure appears designed to evade sanctions. Related entities share addresses with sanctioned Russian companies.',
              severity: 'Critical'
            },
            {
              category: 'Money Laundering',
              description: 'Systematic structuring of transactions below $10,000 reporting threshold. 156 TTRs filed with average transaction $9,850. Smurfing pattern detected across 15 different bank accounts. Rapid movement of funds through multiple jurisdictions with no apparent commercial purpose.',
              severity: 'Critical'
            },
            {
              category: 'Trade-Based Money Laundering',
              description: 'Invoices show significant over/under-invoicing. Payments to shell companies in BVI and Cyprus for goods never received. Circular transactions with related parties designed to move money and create false documentation. Customs declarations do not match financial records.',
              severity: 'Critical'
            },
            {
              category: 'Beneficial Ownership Concealment',
              description: 'Unable to verify ultimate beneficial owners despite extensive due diligence. 7-layer offshore structure uses bearer shares and nominee arrangements. Ownership trails through BVI, Cyprus, Seychelles entities. Circular ownership detected. Non-compliant with AML/CTF Act.',
              severity: 'Critical'
            },
            {
              category: 'Structured Deposits',
              description: 'Pattern of cash deposits just below $10,000 threshold. 127 transaction monitoring alerts triggered. Multiple individuals making deposits to business account. Deposits made at different branches on same day. Classic smurfing behavior.',
              severity: 'High'
            }
          ],
          
          indicatorsIdentified: [
            '✓ Structuring/smurfing to avoid reporting thresholds',
            '✓ Transactions with sanctioned jurisdictions',
            '✓ Shell company network',
            '✓ Beneficial ownership concealment',
            '✓ No legitimate economic purpose',
            '✓ Trade-based money laundering',
            '✓ Over/under invoicing',
            '✓ False customs declarations',
            '✓ Rapid movement of funds',
            '✓ Third party payments',
            '✓ High-risk jurisdictions',
            '✓ PEP connections',
            '✓ Criminal associates',
            '✓ Phoenix company characteristics',
            '✓ Customer evasiveness',
            '✓ Refusal to provide documentation',
            '✓ Inconsistent information',
            '✓ Complex ownership structure',
            '✓ Nominee arrangements',
            '✓ Bearer shares',
            '✓ Multiple trading names',
            '✓ Frequent address changes',
            '✓ Multiple bank accounts',
            '✓ Cryptocurrency usage',
            '✓ Mixing services',
            '✓ Cash intensive business',
            '✓ Unusual transaction patterns'
          ]
        },
        
        suspiciousTransactions: [
          {
            transactionId: 'TXN-001',
            date: '2024-01-15',
            type: 'Transfer',
            amount: 385000,
            currency: 'AUD',
            method: 'Wire Transfer',
            fromAccount: 'GTS Operating Account (AU)',
            toAccount: 'Mediterranean Trading Corp',
            destination: 'Cyprus',
            purpose: 'Consulting fees',
            redFlags: [
              'Recipient on EU sanctions watchlist',
              'No evidence of consulting services provided',
              'Amount inconsistent with declared business activity',
              'High-risk jurisdiction'
            ]
          },
          {
            transactionId: 'TXN-002',
            date: '2024-01-22',
            type: 'Deposit',
            amount: 9850,
            currency: 'AUD',
            method: 'Cash',
            toAccount: 'GTS Operating Account',
            redFlags: [
              'Amount just below $10,000 threshold',
              'Part of pattern (same amount deposited 8 times in week)',
              'Deposited by third party not connected to business',
              'Smurfing indicator'
            ]
          },
          {
            transactionId: 'TXN-003',
            date: '2024-02-03',
            type: 'Transfer',
            amount: 1250000,
            currency: 'USD',
            method: 'Wire Transfer',
            fromAccount: 'Horizon Investments Ltd (BVI)',
            toAccount: 'GTS Operating Account',
            purpose: 'Investment capital',
            redFlags: [
              'Source is BVI shell company (now struck off)',
              'Bearer shares prevent beneficial owner identification',
              'No investment agreement on file',
              'Shell company characteristics',
              'Origin of funds unknown'
            ]
          },
          {
            transactionId: 'TXN-004',
            date: '2024-02-15',
            type: 'Transfer',
            amount: 580000,
            currency: 'AUD',
            method: 'Wire Transfer',
            fromAccount: 'GTS Operating Account',
            toAccount: 'Multiple cryptocurrency exchanges',
            purpose: 'Trading',
            redFlags: [
              'Converted to cryptocurrency',
              'Used mixing services (privacy coins)',
              'Purpose unclear - not related to business',
              'Attempting to obscure transaction trail',
              'Money laundering red flag'
            ]
          },
          {
            transactionId: 'TXN-005',
            date: '2024-02-28',
            type: 'Transfer',
            amount: 2150000,
            currency: 'AUD',
            method: 'Wire Transfer',
            fromAccount: 'GTS Operating Account',
            toAccount: 'Entity in Russia',
            destination: 'Russian Federation',
            purpose: 'Goods purchase',
            redFlags: [
              'Payment to sanctioned jurisdiction',
              'Recipient has links to sanctioned individuals',
              'No goods ever received (customs records checked)',
              'Invoice appears falsified',
              'Sanctions evasion indicator',
              'Trade-based money laundering'
            ]
          }
        ],
        
        mlTfIndicators: {
          structuring: true,
          structuringDetails: 'Systematic pattern of deposits just below $10,000 threshold. 156 TTRs filed with average of $9,850 per transaction. Multiple individuals making deposits. Deposits spread across different branches. Coordination indicates deliberate structuring to avoid reporting. Classic smurfing behavior observed.',
          
          sanctionsEvasion: true,
          sanctionsDetails: '18 entities in corporate structure have sanctions exposure. Directors linked to individuals on OFAC SDN list. Transactions to sanctioned jurisdictions (Russia, Syria). Related entities share addresses with sanctioned Russian companies. Complex offshore structure designed to obscure sanctioned party involvement. EU sanctions triggered. Severe sanctions evasion indicators.',
          
          unusuallyComplex: true,
          complexityDetails: '7-layer offshore structure through BVI, Cyprus, Seychelles. Bearer shares used to prevent identification. Nominee directors and shareholders throughout structure. Circular ownership detected. Shell companies with no operational presence. Complexity serves no legitimate business purpose - designed solely to obscure beneficial ownership and evade detection.',
          
          noLegitimateEconomicPurpose: true,
          purposeDetails: 'Transactions lack commercial rationale. Payments to shell companies for services never rendered. Circular payments between related entities. Over/under invoicing detected. Goods purchased never received. Consulting fees to entities with no consultants. Structure and transactions designed to move money, not conduct legitimate business.',
          
          highRiskJurisdictions: true,
          jurisdictionDetails: 'Significant activity in high-risk jurisdictions: British Virgin Islands (shell companies), Cyprus (under investigation), Russia (sanctioned), Syria (sanctioned), Seychelles (secrecy jurisdiction). No legitimate business reason for involvement in these jurisdictions. Used solely for opacity and sanctions evasion.',
          
          pep: true,
          pepDetails: 'Director Viktor Petrov identified as family member/associate of foreign PEP. Connected to sanctioned Russian oligarch network (Oleg Deripaska connections identified). Multiple corruption allegations in 3 jurisdictions. Money laundering investigation active in Cyprus. Travel restrictions imposed by EU. Enhanced due diligence performed - FAILED.',
          
          thirdPartyPayments: true,
          thirdPartyDetails: 'Frequent third-party payments with no clear connection to customer or stated business. Cash deposits made by individuals unrelated to company. Payments from unrelated offshore entities. No commercial explanation for third-party involvement. Pattern indicates attempt to obscure true source and destination of funds.',
          
          cashIntensive: true,
          cashDetails: 'Business declared as import/export (typically low-cash). However, extensive cash deposits observed. 156 cash deposits averaging $9,850 each. No legitimate reason for cash-intensive activity in import/export business. Cash usage inconsistent with business type - red flag for money laundering.',
          
          rapidMovement: true,
          rapidMovementDetails: 'Funds arrive in account and immediately transferred out. Average time in account: 2.3 days. No legitimate business need for rapid movement. Pattern indicates account used as conduit/layering. Funds move through multiple jurisdictions quickly. Classic money laundering layering technique.',
          
          customerBehavior: true,
          behaviorDetails: 'Customer evasive when questioned about transactions. Refused to provide source of funds documentation. Inconsistent explanations for business activities. Provided false information about beneficial owners. Became hostile when due diligence questions asked. Attempted to intimidate staff. Behavior consistent with customer hiding criminal activity.',
          
          other: [
            'Directors have criminal convictions and bankruptcy history',
            'Phoenix company pattern (3 related entities struck off)',
            'Active law enforcement investigations (AFP, AUSTRAC, ASIC)',
            'Adverse media linking to sanctions evasion and organized crime',
            'Financial distress (insolvency indicators)',
            'Multiple ASIC enforcement notices',
            'Whistleblower complaint filed',
            'Related party transactions with no commercial substance',
            'Invoice fraud detected',
            'False customs declarations',
            'Trade-based money laundering indicators',
            'Organized crime links identified'
          ]
        },
        
        supportingEvidence: [
          {
            documentType: 'World-Check Sanctions Screening Report',
            description: 'Comprehensive sanctions screening showing 18 entity matches across OFAC, EU, UK, UN, and Australian sanctions lists',
            dateObtained: '2024-03-15',
            source: 'World-Check One'
          },
          {
            documentType: 'Enhanced Due Diligence Report',
            description: 'EDD report showing failure to verify source of funds, UBO verification failure, extensive red flags',
            dateObtained: '2024-03-17',
            source: 'InfoTrack Enhanced Due Diligence'
          },
          {
            documentType: 'Transaction Monitoring Alerts',
            description: '127 transaction monitoring alerts flagging structuring, unusual patterns, high-risk jurisdictions',
            dateObtained: '2024-03-20',
            source: 'Internal Transaction Monitoring System'
          },
          {
            documentType: 'UBO Verification Report',
            description: 'Report detailing 7-layer offshore structure, bearer shares, nominee arrangements, circular ownership',
            dateObtained: '2024-03-12',
            source: 'InfoTrack Corporate Intelligence'
          },
          {
            documentType: 'Criminal Background Checks',
            description: 'Director criminal convictions, international criminal records, Interpol notices',
            dateObtained: '2024-03-10',
            source: 'InfoTrack / Interpol'
          },
          {
            documentType: 'ASIC Company Extracts',
            description: 'Historical extracts showing phoenixing pattern, 3 related entities struck off, director churn',
            dateObtained: '2024-03-15',
            source: 'ASIC Connect'
          },
          {
            documentType: 'Adverse Media Report',
            description: '89 adverse media articles from credible sources linking to sanctions evasion, money laundering',
            dateObtained: '2024-03-18',
            source: 'World-Check Adverse Media'
          },
          {
            documentType: 'Bank Statements',
            description: 'Detailed transaction records showing structuring patterns, rapid fund movement',
            dateObtained: '2024-03-19',
            source: 'Customer records'
          },
          {
            documentType: 'Related Party Analysis',
            description: 'Network analysis showing 127 related entities across 15 jurisdictions',
            dateObtained: '2024-03-16',
            source: 'InfoTrack Corporate Intelligence'
          },
          {
            documentType: 'Customs Records Analysis',
            description: 'Comparison of customs declarations vs financial records showing discrepancies',
            dateObtained: '2024-03-18',
            source: 'Australian Border Force (via information sharing)'
          }
        ],
        
        backgroundInformation: {
          accountOpeningDate: '2023-06-15',
          accountType: 'Business Transaction Account',
          initialDeposit: 50000,
          
          customerDueDiligence: {
            cddCompleted: true,
            cddDate: '2023-06-15',
            eddRequired: true,
            eddCompleted: true,
            eddDate: '2024-03-17',
            eddOutcome: 'FAILED - Unable to verify source of funds. UBO verification failed. Multiple critical red flags identified. Relationship unacceptable.'
          },
          
          sourceOfFunds: {
            declared: 'Import/export trading profits, investor capital',
            verified: false,
            verificationOutcome: 'UNABLE TO VERIFY - Declared sources could not be substantiated. Investor entities are shell companies. Trading activity inconsistent with financial flows. Source of funds remains unknown and suspicious.'
          },
          
          sourceOfWealth: {
            declared: 'Business profits from import/export operations over 10 years',
            verified: false,
            verificationOutcome: 'UNABLE TO VERIFY - Directors have bankruptcy history and companies struck off. Claimed business success inconsistent with director insolvency. Wealth accumulation cannot be explained by legitimate means.'
          },
          
          expectedActivity: 'Import/export business with moderate transaction volumes ($500K-$1M per month). Primarily wire transfers for goods purchase and sales receipts. Minimal cash activity.',
          
          actualActivity: 'Extensive structuring through cash deposits ($9,850 each). Rapid fund movement through multiple jurisdictions. Transactions to high-risk countries. Cryptocurrency conversions. Payments to shell companies. Volume much higher than expected ($18.5M in 9 months).',
          
          discrepancyExplanation: 'Actual activity bears no resemblance to expected activity. Cash intensity completely inconsistent with import/export business. Transactions to sanctioned jurisdictions. Shell company payments. Cryptocurrency usage. Structuring to avoid reporting. Pattern strongly indicates money laundering and sanctions evasion rather than legitimate trade.'
        },
        
        additionalInformation: {
          lawEnforcementContact: true,
          lawEnforcementDetails: 'Multiple active investigations: (1) Australian Federal Police - customs fraud investigation, search warrant executed 5 March 2024. (2) AUSTRAC - formal investigation into money laundering and sanctions evasion. (3) ASIC - Section 19 notice for false statements. (4) Australian Border Force - false customs declarations. (5) ATO - transfer pricing investigation.',
          
          mediaReports: true,
          mediaDetails: 'Subject of extensive media coverage: Financial Times investigation on sanctions evasion networks. Reuters article linking to Russian oligarch money laundering. ABC Four Corners documentary on customs fraud. Named in US Congressional hearing on sanctions violations. 89 total adverse media articles from credible sources.',
          
          otherReportingEntities: true,
          otherReportingDetails: 'Understand from intelligence sharing that 3 other Australian financial institutions have also filed SMRs on this entity. International correspondent banks have terminated relationships. Flagged in FinCEN and FINTRAC systems.',
          
          ongoingRelationship: false,
          relationshipStatus: 'Terminated',
          actionTaken: 'Application to onboard was REJECTED on 22 March 2024 by Chief Compliance Officer. No account opened. No services provided. Customer notified of rejection (did not disclose SMR filing per s123 AML/CTF Act tipping off provisions). All records retained per s107 AML/CTF Act.',
          
          additionalRemarks: `This is one of the most serious SMR filings I have prepared in 15 years of AML/CTF compliance work.

The combination of sanctions violations, systematic money laundering indicators, criminal director backgrounds, active law enforcement investigations, and complete opacity of beneficial ownership creates an extreme risk profile.

Key concerns:
• SANCTIONS: 18 entity matches - OFAC, EU, Australia sanctions triggered
• CRIMINAL: Directors with fraud convictions, international criminal records
• STRUCTURING: Systematic smurfing - 156 TTRs averaging $9,850
• OPACITY: 7-layer offshore structure with bearer shares - UBO unknown
• INVESTIGATIONS: AFP, AUSTRAC, ASIC, ATO all investigating
• PHOENIXING: Pattern of asset stripping and creditor avoidance
• TRADE-BASED ML: False invoicing, customs fraud, circular payments

This entity appears to be part of a sophisticated sanctions evasion and money laundering network with links to organized crime and sanctioned Russian oligarchs.

The $18.5M in suspicious transactions represents significant proceeds of crime being laundered through the Australian financial system.

Strongly recommend:
1. Priority investigation by AUSTRAC
2. Information sharing with AFP (if not already investigating)
3. Coordination with international FIUs (FinCEN, FINTRAC, EU)
4. Industry alert to warn other reporting entities

Jennifer Martinez
Chief Compliance Officer
Grow Financial Services Pty Ltd
22 March 2024`
        },
        
        declarationDetails: {
          officerName: 'Jennifer Martinez',
          officerTitle: 'Chief Compliance Officer',
          officerContact: 'jennifer.martinez@grow.com | +61 2 9555 0123',
          declarationDate: '2024-03-22',
          signature: 'Jennifer Martinez (Electronic Signature)'
        },
        
        austracAcknowledgement: 'ACK-2024-031522-SMR',
        austracReferenceNumber: 'AUSTRAC-REF-20240322-GTS-001',
        feedbackReceived: false
      }
    ],
    ttrs: [
      {
        ttrNumber: 'TTR-2024-001',
        transactionDate: '2024-01-08',
        filingDate: '2024-01-09',
        transactionType: 'Cash Deposit',
        amount: 9850,
        currency: 'AUD',
        accountDetails: {
          accountName: 'Global Trade Solutions Pty Ltd',
          accountNumber: 'XXXX1234',
          accountType: 'Business Transaction Account'
        },
        customerDetails: {
          name: 'Unknown individual (not account holder)',
          address: 'Not provided',
          identification: 'Driver License NSW (details recorded)'
        },
        filedBy: 'system@grow.com'
      }
      // Note: In reality there would be 156 TTRs, showing only 1 as example
    ],
    summary: {
      totalSMRs: 1,
      totalTTRs: 156,
      lastReportDate: '2024-03-22',
      activeConcerns: true
    }
  },
  
  'client-001': {
    clientId: 'client-001',
    smrs: [],
    ttrs: [],
    summary: {
      totalSMRs: 0,
      totalTTRs: 0,
      lastReportDate: '',
      activeConcerns: false
    }
  }
};

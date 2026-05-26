// Decision History and Approval Reasoning Data

export interface Issue {
  id: string;
  category: 'Identity' | 'Ownership' | 'Financial' | 'AML' | 'Legal' | 'Documentation' | 'Compliance';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  issue: string;
  identified: string;
  resolution: string;
  resolvedBy: string;
  resolvedDate: string;
  status: 'Resolved' | 'Mitigated' | 'Accepted Risk' | 'Waived';
  evidence?: string[];
}

export interface RiskAssessment {
  id: string;
  assessmentDate: string;
  assessedBy: string;
  overallRisk: 'Low' | 'Medium' | 'High' | 'Extreme';
  riskScore: number; // 0-100
  categories: {
    category: string;
    risk: 'Low' | 'Medium' | 'High' | 'Extreme';
    score: number;
    factors: string[];
  }[];
  mitigation: string[];
  recommendation: 'Approve' | 'Approve with Conditions' | 'Reject' | 'Escalate';
}

export interface DecisionRecord {
  clientId: string;
  clientName: string;
  decision: 'Approved' | 'Approved with Conditions' | 'Rejected' | 'Pending';
  decisionDate: string;
  decisionMaker: string;
  decisionMakerRole: string;
  
  // Summary
  executiveSummary: string;
  
  // Issues identified and how they were addressed
  issuesIdentified: Issue[];
  
  // Risk assessments performed
  riskAssessments: RiskAssessment[];
  
  // Approval reasoning
  approvalReasoning: {
    keyStrengths: string[];
    concernsAddressed: string[];
    conditionsApplied: string[];
    ongoingMonitoring: string[];
  };
  
  // Decision comments
  decisionComments: string;
  
  // Conditions (if approved with conditions)
  conditions?: {
    id: string;
    condition: string;
    dueDate?: string;
    status: 'Pending' | 'Met' | 'Overdue';
    completedDate?: string;
  }[];
  
  // Escalations
  escalations: {
    id: string;
    date: string;
    escalatedBy: string;
    escalatedTo: string;
    reason: string;
    resolution: string;
    resolvedDate: string;
  }[];
  
  // Review history
  reviewHistory: {
    date: string;
    reviewer: string;
    action: string;
    comments: string;
  }[];
}

export const DECISION_DATABASE: Record<string, DecisionRecord> = {
  'client-001': {
    clientId: 'client-001',
    clientName: 'Sarah Chen',
    decision: 'Approved',
    decisionDate: '2025-08-15',
    decisionMaker: 'Michael Thompson',
    decisionMakerRole: 'Senior Compliance Manager',
    
    executiveSummary: 'Sarah Chen presents as a low-risk client with excellent credentials as a legal practitioner. All KYC requirements have been met to a high standard. Identity verification, AML screening, and background checks all returned clean results. Financial profile is consistent with occupation and fully verified. Source of funds and source of wealth are clearly documented and reasonable. Client operates a legitimate legal practice with strong reputation. No adverse findings identified. Recommend approval for onboarding with standard monitoring.',
    
    issuesIdentified: [
      {
        id: 'ISS-001',
        category: 'Documentation',
        severity: 'Low',
        issue: 'Initial passport copy provided was slightly blurry',
        identified: '2025-08-10',
        resolution: 'Requested and received high-quality scan of passport. Document verification team confirmed authenticity and quality. Biometric verification passed.',
        resolvedBy: 'kyc.team@grow.com',
        resolvedDate: '2025-08-10',
        status: 'Resolved',
        evidence: ['Passport_High_Quality_Scan.pdf', 'Document_Verification_Report.pdf']
      },
      {
        id: 'ISS-002',
        category: 'Ownership',
        severity: 'Medium',
        issue: 'Company ownership structure required clarification - 40% owned by "Chen Family Trust"',
        identified: '2025-08-11',
        resolution: 'Obtained trust deed and verified trustees and beneficiaries. Sarah Chen confirmed as primary beneficiary (75%). Trust is discretionary family trust established for estate planning. Structure is common and reasonable for professional practice. Beneficial ownership clearly identified.',
        resolvedBy: 'compliance@grow.com',
        resolvedDate: '2025-08-12',
        status: 'Resolved',
        evidence: ['Trust_Deed.pdf', 'Trustee_Declarations.pdf', 'Beneficiary_Schedule.pdf']
      },
      {
        id: 'ISS-003',
        category: 'Financial',
        severity: 'Low',
        issue: 'Source of funds for initial deposit ($250,000) required verification',
        identified: '2025-08-11',
        resolution: 'Client provided 3 years of tax returns, law firm financial statements, and sale of investment property settlement statement. All sources verified and consistent with professional income and documented asset sales. No red flags.',
        resolvedBy: 'financial.compliance@grow.com',
        resolvedDate: '2025-08-13',
        status: 'Resolved',
        evidence: ['Tax_Returns_3_Years.pdf', 'Financial_Statements.pdf', 'Property_Settlement.pdf']
      }
    ],
    
    riskAssessments: [
      {
        id: 'RA-001',
        assessmentDate: '2025-08-14',
        assessedBy: 'compliance@grow.com',
        overallRisk: 'Low',
        riskScore: 15,
        categories: [
          {
            category: 'Identity Risk',
            risk: 'Low',
            score: 5,
            factors: [
              'Identity verified via GreenID with 98% confidence',
              'Government-issued documents authenticated',
              'Biometric verification passed',
              'No identity fraud indicators'
            ]
          },
          {
            category: 'AML/Sanctions Risk',
            risk: 'Low',
            score: 3,
            factors: [
              'World-Check screening: No matches',
              'Not identified as PEP',
              'No sanctions exposure',
              'No adverse media'
            ]
          },
          {
            category: 'Financial Crime Risk',
            risk: 'Low',
            score: 8,
            factors: [
              'Source of funds verified and legitimate',
              'No unusual transaction patterns',
              'Professional income well-documented',
              'No red flags in financial history'
            ]
          },
          {
            category: 'Jurisdictional Risk',
            risk: 'Low',
            score: 5,
            factors: [
              'Australian resident and citizen',
              'No high-risk jurisdiction exposure',
              'Business operates in Australia only',
              'No offshore structures'
            ]
          },
          {
            category: 'Reputational Risk',
            risk: 'Low',
            score: 2,
            factors: [
              'Established legal practitioner',
              'No adverse media',
              'No complaints or disciplinary actions',
              'Strong professional reputation'
            ]
          },
          {
            category: 'Legal/Regulatory Risk',
            risk: 'Low',
            score: 3,
            factors: [
              'No litigation history',
              'No regulatory actions',
              'Compliant with professional obligations',
              'Clean background check'
            ]
          }
        ],
        mitigation: [
          'Standard transaction monitoring',
          'Annual KYC refresh',
          'Ongoing adverse media monitoring',
          'Periodic source of funds verification for large transactions'
        ],
        recommendation: 'Approve'
      }
    ],
    
    approvalReasoning: {
      keyStrengths: [
        'Established legal professional with 15 years experience',
        'Clean identity verification and background checks',
        'No AML/sanctions issues - all screenings clear',
        'Well-documented source of funds and wealth',
        'Transparent ownership structure',
        'Strong financial position with legitimate income sources',
        'Excellent credit history',
        'No adverse legal, regulatory, or reputational issues'
      ],
      concernsAddressed: [
        'Initial passport quality issue resolved with high-quality re-scan',
        'Trust ownership structure clarified with supporting documentation',
        'Source of funds verified through tax returns and asset sale documentation',
        'All beneficial owners identified and verified',
        'All KYC documents now complete and verified'
      ],
      conditionsApplied: [],
      ongoingMonitoring: [
        'Standard transaction monitoring for unusual patterns',
        'Annual KYC refresh and document update',
        'Quarterly AML screening (World-Check)',
        'Ongoing adverse media monitoring',
        'Source of funds verification for transactions >$50,000'
      ]
    },
    
    decisionComments: `APPROVAL DECISION - Sarah Chen

After comprehensive review of all KYC documentation, background checks, and risk assessments, I am pleased to APPROVE the onboarding of Sarah Chen as a client.

DECISION RATIONALE:

1. IDENTITY & VERIFICATION (LOW RISK)
   - All identity documents verified and authenticated
   - GreenID verification passed with 98% confidence score
   - Biometric checks successful
   - No fraud indicators detected

2. AML/SANCTIONS COMPLIANCE (LOW RISK)
   - World-Check screening: No matches found
   - OFAC, EU, UN sanctions: No matches
   - Not identified as Politically Exposed Person (PEP)
   - No adverse media identified
   - Clean background check

3. SOURCE OF FUNDS & WEALTH (VERIFIED)
   - Primary source: Legal practice income - verified via tax returns
   - 3 years of financial statements reviewed
   - Property sale proceeds documented and verified
   - All sources legitimate and consistent with occupation
   - No unexplained wealth

4. OWNERSHIP & STRUCTURE (TRANSPARENT)
   - 60% individual ownership
   - 40% Chen Family Trust - trust deed reviewed
   - All beneficial owners identified and verified
   - Structure appropriate for professional practice

5. ISSUES RESOLUTION
   All three issues identified during onboarding were successfully resolved:
   - Passport documentation quality improved
   - Trust structure clarified and documented
   - Source of funds comprehensively verified

6. RISK ASSESSMENT
   Overall Risk Score: 15/100 (Low Risk)
   - Identity Risk: 5 (Low)
   - AML Risk: 3 (Low)
   - Financial Crime Risk: 8 (Low)
   - Jurisdictional Risk: 5 (Low)
   - Reputational Risk: 2 (Low)

CONCLUSION:
Sarah Chen presents as an excellent low-risk client. All regulatory requirements met. Recommend approval with standard monitoring protocols.

No conditions applied. Standard annual review cycle.

Approved by: Michael Thompson, Senior Compliance Manager
Date: 15 August 2025`,
    
    escalations: [],
    
    reviewHistory: [
      {
        date: '2025-08-10',
        reviewer: 'kyc.team@grow.com',
        action: 'Initial KYC Review',
        comments: 'Commenced KYC verification process. Documents uploaded and initial checks underway.'
      },
      {
        date: '2025-08-11',
        reviewer: 'compliance@grow.com',
        action: 'AML Screening',
        comments: 'World-Check and sanctions screening completed. No adverse findings.'
      },
      {
        date: '2025-08-12',
        reviewer: 'compliance@grow.com',
        action: 'Ownership Verification',
        comments: 'Trust structure clarified and documented. Beneficial owners verified.'
      },
      {
        date: '2025-08-13',
        reviewer: 'financial.compliance@grow.com',
        action: 'Source of Funds Verification',
        comments: 'All source of funds documentation reviewed and verified. No concerns.'
      },
      {
        date: '2025-08-14',
        reviewer: 'compliance@grow.com',
        action: 'Risk Assessment',
        comments: 'Comprehensive risk assessment completed. Overall risk: Low (15/100)'
      },
      {
        date: '2025-08-15',
        reviewer: 'Michael Thompson',
        action: 'Onboarding Decision',
        comments: 'APPROVED - All requirements met. Low risk profile. Standard monitoring.'
      }
    ]
  },

  'client-004': {
    clientId: 'client-004',
    clientName: 'Global Trade Solutions Pty Ltd',
    decision: 'Rejected',
    decisionDate: '2024-03-22',
    decisionMaker: 'Jennifer Martinez',
    decisionMakerRole: 'Chief Compliance Officer',
    
    executiveSummary: '🚨 CRITICAL REJECTION: Global Trade Solutions Pty Ltd presents an unacceptable risk profile with multiple severe red flags across all risk categories. The company exhibits characteristics consistent with shell company operations, money laundering networks, and sanctions evasion schemes. Extensive due diligence has uncovered connections to sanctioned entities, criminal activity, phoenixing patterns, and systematic regulatory violations. The client has active law enforcement investigations by AFP, AUSTRAC, ASIC, and ATO. Onboarding this entity would expose the firm to severe legal, regulatory, and reputational risks. STRONG RECOMMENDATION: REJECT and file Suspicious Matter Report with AUSTRAC.',
    
    issuesIdentified: [
      {
        id: 'ISS-GTS-001',
        category: 'AML',
        severity: 'Critical',
        issue: 'Multiple sanctions matches detected - 18 entities in corporate structure have sanctions exposure (OFAC, EU, UK, Australia)',
        identified: '2024-03-16',
        resolution: 'UNRESOLVED - Cannot proceed with relationship. Sanctions violations confirmed. Directors and related entities on multiple sanctions lists.',
        resolvedBy: 'N/A',
        resolvedDate: 'N/A',
        status: 'Accepted Risk',
        evidence: ['World_Check_Report.pdf', 'Sanctions_Screening_Full.pdf', 'Network_Analysis.pdf']
      },
      {
        id: 'ISS-GTS-002',
        category: 'Ownership',
        severity: 'Critical',
        issue: 'Unable to verify ultimate beneficial ownership - 7-layer offshore structure with bearer shares and nominee arrangements',
        identified: '2024-03-12',
        resolution: 'UNRESOLVED - UBO verification failed. Complex offshore structure designed to obscure ownership. Non-compliant with AML/CTF Act.',
        resolvedBy: 'N/A',
        resolvedDate: 'N/A',
        status: 'Accepted Risk',
        evidence: ['UBO_Report.pdf', 'Offshore_Structure_Analysis.pdf']
      },
      {
        id: 'ISS-GTS-003',
        category: 'Legal',
        severity: 'Critical',
        issue: 'Director Viktor Petrov has criminal convictions for fraud (2018) and is subject to ASIC disqualification proceedings',
        identified: '2024-03-10',
        resolution: 'UNRESOLVED - Director is unsuitable. Criminal history and pending disqualification make relationship unacceptable.',
        resolvedBy: 'N/A',
        resolvedDate: 'N/A',
        status: 'Accepted Risk',
        evidence: ['Criminal_Record_Check.pdf', 'ASIC_Disqualification_Notice.pdf']
      },
      {
        id: 'ISS-GTS-004',
        category: 'Financial',
        severity: 'Critical',
        issue: 'Enhanced Due Diligence FAILED - Unable to verify source of funds. Suspicious transaction patterns detected.',
        identified: '2024-03-17',
        resolution: 'UNRESOLVED - EDD failure. Source of funds unverifiable. 127 transaction monitoring alerts. Structured transactions to avoid reporting thresholds.',
        resolvedBy: 'N/A',
        resolvedDate: 'N/A',
        status: 'Accepted Risk',
        evidence: ['EDD_Report.pdf', 'Transaction_Monitoring_Alerts.pdf', 'Structuring_Analysis.pdf']
      },
      {
        id: 'ISS-GTS-005',
        category: 'Compliance',
        severity: 'Critical',
        issue: 'Active regulatory investigations - AUSTRAC (money laundering), AFP (customs fraud), ASIC (false statements)',
        identified: '2024-03-15',
        resolution: 'UNRESOLVED - Multiple active investigations. AFP search warrant executed. Criminal charges likely.',
        resolvedBy: 'N/A',
        resolvedDate: 'N/A',
        status: 'Accepted Risk',
        evidence: ['AUSTRAC_Investigation_Notice.pdf', 'AFP_Search_Warrant.pdf', 'ASIC_Section19_Notice.pdf']
      },
      {
        id: 'ISS-GTS-006',
        category: 'Legal',
        severity: 'High',
        issue: 'Phoenixing pattern detected - 3 related entities struck off with unpaid debts totaling $4.2M',
        identified: '2024-03-15',
        resolution: 'UNRESOLVED - Pattern of phoenixing confirmed. Asset stripping and creditor avoidance. Unacceptable business practices.',
        resolvedBy: 'N/A',
        resolvedDate: 'N/A',
        status: 'Accepted Risk',
        evidence: ['ASIC_Historical_Extract.pdf', 'Phoenix_Analysis.pdf', 'Related_Entities_Report.pdf']
      },
      {
        id: 'ISS-GTS-007',
        category: 'AML',
        severity: 'Critical',
        issue: 'Director Viktor Petrov identified as associate of sanctioned Russian oligarch - PEP concerns',
        identified: '2024-03-15',
        resolution: 'UNRESOLVED - PEP and sanctions evasion network confirmed. Money laundering investigation active in Cyprus.',
        resolvedBy: 'N/A',
        resolvedDate: 'N/A',
        status: 'Accepted Risk',
        evidence: ['PEP_Screening.pdf', 'Network_Analysis_Oligarch.pdf', 'Cyprus_Investigation.pdf']
      },
      {
        id: 'ISS-GTS-008',
        category: 'Financial',
        severity: 'High',
        issue: 'Company in severe financial distress - $3.8M in court judgements, credit rating 1R4 (High Risk)',
        identified: '2024-03-14',
        resolution: 'UNRESOLVED - Insolvency imminent. 94% probability of failure within 12 months. Phoenix activity likely.',
        resolvedBy: 'N/A',
        resolvedDate: 'N/A',
        status: 'Accepted Risk',
        evidence: ['Credit_Report.pdf', 'Court_Judgements.pdf', 'Financial_Distress_Analysis.pdf']
      }
    ],
    
    riskAssessments: [
      {
        id: 'RA-GTS-001',
        assessmentDate: '2024-03-20',
        assessedBy: 'edd.specialist@grow.com',
        overallRisk: 'Extreme',
        riskScore: 98,
        categories: [
          {
            category: 'AML/Sanctions Risk',
            risk: 'Extreme',
            score: 100,
            factors: [
              '🚨 18 entities with sanctions exposure',
              '🚨 OFAC SDN list matches',
              '🚨 EU sanctions violations',
              '🚨 Director linked to sanctioned oligarch',
              '🚨 Active AUSTRAC investigation',
              '🚨 Money laundering red flags - 27 indicators'
            ]
          },
          {
            category: 'Financial Crime Risk',
            risk: 'Extreme',
            score: 98,
            factors: [
              '🚨 EDD FAILED - source of funds unverifiable',
              '🚨 127 transaction monitoring alerts',
              '🚨 Structured transactions (smurfing detected)',
              '🚨 Trade-based money laundering indicators',
              '🚨 Payments to sanctions countries',
              '🚨 Cryptocurrency mixing services used'
            ]
          },
          {
            category: 'Ownership Risk',
            risk: 'Extreme',
            score: 100,
            factors: [
              '🚨 UBO verification FAILED',
              '🚨 7-layer offshore structure',
              '🚨 Bearer shares prevent identification',
              '🚨 Nominee directors and shareholders',
              '🚨 Shell company network',
              '🚨 Circular ownership detected'
            ]
          },
          {
            category: 'Legal/Regulatory Risk',
            risk: 'Extreme',
            score: 95,
            factors: [
              '🚨 AFP criminal investigation active',
              '🚨 AUSTRAC investigation - money laundering',
              '🚨 ASIC enforcement proceedings',
              '🚨 ATO amended assessment $10.6M',
              '🚨 Director criminal convictions',
              '🚨 Disqualification proceedings active'
            ]
          },
          {
            category: 'Reputational Risk',
            risk: 'Extreme',
            score: 98,
            factors: [
              '🚨 Featured in Financial Times investigation',
              '🚨 Reuters: Sanctions evasion allegations',
              '🚨 ABC Four Corners documentary',
              '🚨 US Congressional hearing mentioned',
              '🚨 89 adverse media articles',
              '🚨 47 countries issued warnings'
            ]
          },
          {
            category: 'Jurisdictional Risk',
            risk: 'Extreme',
            score: 92,
            factors: [
              '⚠️ Operations in high-risk jurisdictions',
              '⚠️ BVI and Cyprus entities',
              '⚠️ Transactions with sanctioned countries',
              '⚠️ Secrecy jurisdiction usage',
              '⚠️ No legitimate business presence'
            ]
          }
        ],
        mitigation: [
          'MITIGATION NOT POSSIBLE - Risks are inherent and unmanageable',
          'No amount of monitoring can address sanctions violations',
          'Criminal activity cannot be mitigated through controls',
          'Regulatory breaches expose firm to severe penalties',
          'Reputational damage to firm would be catastrophic'
        ],
        recommendation: 'Reject'
      }
    ],
    
    approvalReasoning: {
      keyStrengths: [],
      concernsAddressed: [],
      conditionsApplied: [],
      ongoingMonitoring: []
    },
    
    decisionComments: `REJECTION DECISION - Global Trade Solutions Pty Ltd

After extensive due diligence and comprehensive risk assessment, I must REJECT the application to onboard Global Trade Solutions Pty Ltd as a client.

This is one of the most severe risk profiles I have encountered in my 15 years in compliance.

DECISION RATIONALE:

1. SANCTIONS VIOLATIONS (CRITICAL - UNACCEPTABLE)
   🚨 18 entities in corporate structure have sanctions exposure
   🚨 OFAC SDN list matches confirmed
   🚨 EU, UK, and Australian sanctions triggered
   🚨 Director Viktor Petrov linked to sanctioned Russian oligarch network
   
   **ASSESSMENT**: Onboarding would constitute sanctions violations. Criminal prosecution risk for firm and officers. Civil penalties could exceed $21 million per violation.

2. MONEY LAUNDERING RED FLAGS (CRITICAL - UNACCEPTABLE)
   🚨 Enhanced Due Diligence FAILED
   🚨 Source of funds unverifiable
   🚨 127 transaction monitoring alerts in 90 days
   🚨 Structured transactions to avoid reporting thresholds
   🚨 Payments to high-risk jurisdictions
   🚨 Cryptocurrency mixing services used
   🚨 Trade-based money laundering indicators
   
   **ASSESSMENT**: Client exhibits textbook money laundering characteristics. Active AUSTRAC investigation confirms suspicions. SMR filing mandatory.

3. BENEFICIAL OWNERSHIP (CRITICAL - NON-COMPLIANT)
   🚨 Unable to verify ultimate beneficial owners
   🚨 7-layer offshore structure with bearer shares
   🚨 BVI, Cyprus, Seychelles entities
   🚨 Nominee directors and shareholders throughout
   🚨 Circular ownership preventing identification
   
   **ASSESSMENT**: Complete failure to meet AML/CTF Act requirements for UBO verification. Onboarding would breach s36(1) of AML/CTF Act.

4. DIRECTOR SUITABILITY (CRITICAL - UNACCEPTABLE)
   🚨 Viktor Petrov: Fraud convictions (2018)
   🚨 Personal bankruptcy (2021-2024)
   🚨 ASIC disqualification proceedings active
   🚨 47 directorships, 32 struck off (phoenixing pattern)
   🚨 International criminal records (Russia, Cyprus)
   🚨 Interpol Yellow Notice issued
   
   **ASSESSMENT**: Director criminally unsuitable. Fitness and propriety test failed comprehensively.

5. ACTIVE LAW ENFORCEMENT INVESTIGATIONS (CRITICAL)
   🚨 AFP: Search warrant executed for customs fraud ($15M+ alleged)
   🚨 AUSTRAC: Formal investigation - money laundering and sanctions evasion
   🚨 ASIC: Section 19 notice - false statements investigation
   🚨 ATO: Amended assessment $10.6M - transfer pricing violations
   🚨 ACCC: Cartel investigation - price fixing allegations
   🚨 ABF: False customs declarations - criminal prosecution referred
   
   **ASSESSMENT**: Multiple serious criminal investigations. Directors face imprisonment. Company likely to be wound up.

6. PHOENIXING & INSOLVENCY (HIGH RISK)
   ⚠️ 3 related entities struck off with $4.2M unpaid debts
   ⚠️ Asset stripping pattern detected
   ⚠️ Current financial distress - $3.8M court judgements
   ⚠️ 94% probability of insolvency within 12 months
   ⚠️ Creditor avoidance behavior systematic
   
   **ASSESSMENT**: Phoenix operator. Company unlikely to survive. Bad debt risk extreme.

7. REPUTATIONAL DAMAGE (EXTREME)
   🚨 Financial Times investigation: Sanctions evasion
   🚨 Reuters: Russian oligarch money laundering
   🚨 ABC Four Corners: Customs fraud documentary
   🚨 US Congress: Named in sanctions violation testimony
   🚨 89 adverse media articles from credible sources
   
   **ASSESSMENT**: Association with this client would cause severe reputational damage to firm.

8. RISK ASSESSMENT SUMMARY
   Overall Risk Score: 98/100 (EXTREME)
   - AML/Sanctions Risk: 100 (EXTREME)
   - Financial Crime Risk: 98 (EXTREME)
   - Ownership Risk: 100 (EXTREME)
   - Legal/Regulatory Risk: 95 (EXTREME)
   - Reputational Risk: 98 (EXTREME)
   - Jurisdictional Risk: 92 (EXTREME)

LEGAL & REGULATORY EXPOSURE:
- Sanctions violations: Criminal prosecution + $21M per violation
- AML/CTF breaches: $22.2M+ penalties
- Reputational damage: Immeasurable
- AUSTRAC enforcement: License suspension/cancellation
- Director liability: Personal criminal prosecution

CONCLUSION:
This client presents an unacceptable risk profile across all dimensions. The combination of:
• Confirmed sanctions violations
• Active criminal investigations
• Money laundering indicators
• UBO verification failure
• Criminal director history
• Phoenix activity

...makes onboarding impossible and illegal.

MANDATORY ACTIONS:
1. ✅ Reject application immediately
2. ✅ File Suspicious Matter Report with AUSTRAC
3. ✅ Document all findings comprehensively
4. ✅ Notify AUSTRAC of sanctions concerns
5. ✅ Do not disclose SMR filing to client (tipping off offense)

DECISION: REJECTED

This decision is final and non-appealable.

Rejected by: Jennifer Martinez, Chief Compliance Officer
Date: 22 March 2024

cc: Legal, Risk Committee, Executive Management`,
    
    escalations: [
      {
        id: 'ESC-001',
        date: '2024-03-18',
        escalatedBy: 'compliance@grow.com',
        escalatedTo: 'Jennifer Martinez (CCO)',
        reason: 'Multiple critical red flags identified. Sanctions matches detected. Requires CCO decision.',
        resolution: 'CCO reviewed all evidence. Decision: REJECT and file SMR with AUSTRAC.',
        resolvedDate: '2024-03-22'
      },
      {
        id: 'ESC-002',
        date: '2024-03-19',
        escalatedBy: 'edd.specialist@grow.com',
        escalatedTo: 'Risk Committee',
        reason: 'EDD failure. Unable to verify source of funds or UBOs. Extreme risk profile.',
        resolution: 'Risk Committee unanimous: Reject immediately. Legal exposure unacceptable.',
        resolvedDate: '2024-03-20'
      }
    ],
    
    reviewHistory: [
      {
        date: '2024-02-15',
        reviewer: 'kyc.team@grow.com',
        action: 'Initial Application Received',
        comments: 'Application received. Commenced preliminary checks.'
      },
      {
        date: '2024-03-10',
        reviewer: 'compliance@grow.com',
        action: 'Background Checks',
        comments: '⚠️ RED FLAGS: Director criminal convictions found. Bankruptcy history.'
      },
      {
        date: '2024-03-12',
        reviewer: 'edd.specialist@grow.com',
        action: 'UBO Verification',
        comments: '🚨 CRITICAL: Unable to verify UBOs. Complex offshore structure. Bearer shares.'
      },
      {
        date: '2024-03-15',
        reviewer: 'compliance@grow.com',
        action: 'AML Screening',
        comments: '🚨 CRITICAL: Multiple sanctions matches. OFAC, EU sanctions triggered.'
      },
      {
        date: '2024-03-16',
        reviewer: 'edd.specialist@grow.com',
        action: 'Enhanced Due Diligence',
        comments: '🚨 CRITICAL: EDD FAILED. Source of funds unverifiable. Transaction monitoring alerts.'
      },
      {
        date: '2024-03-17',
        reviewer: 'financial.compliance@grow.com',
        action: 'Financial Analysis',
        comments: '⚠️ HIGH RISK: Financial distress. $3.8M judgements. Insolvency imminent.'
      },
      {
        date: '2024-03-18',
        reviewer: 'compliance@grow.com',
        action: 'Escalation to CCO',
        comments: 'Escalated to CCO due to extreme risk profile and sanctions violations.'
      },
      {
        date: '2024-03-20',
        reviewer: 'Risk Committee',
        action: 'Risk Committee Review',
        comments: 'Unanimous decision: REJECT. Legal and regulatory exposure unacceptable.'
      },
      {
        date: '2024-03-22',
        reviewer: 'Jennifer Martinez (CCO)',
        action: 'Final Decision',
        comments: '🚨 REJECTED. SMR filing with AUSTRAC mandatory. Do not onboard under any circumstances.'
      }
    ]
  }
};

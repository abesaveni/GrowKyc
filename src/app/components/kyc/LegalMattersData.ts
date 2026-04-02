// Legal Matters Data - Litigation, Strike-offs, Regulatory Actions

export interface LegalMatter {
  id: string;
  type: 'Litigation' | 'Regulatory Action' | 'Company Strike-off' | 'Insolvency' | 'Director Ban' | 'Tax Dispute' | 'Compliance Breach' | 'Criminal Investigation';
  title: string;
  status: 'Open' | 'Closed' | 'Settled' | 'Pending Appeal' | 'Under Investigation';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  dateOpened: string;
  dateClosed?: string;
  jurisdiction: string;
  court?: string;
  caseNumber?: string;
  parties: string[];
  description: string;
  outcome?: string;
  financialImpact?: string;
  reputationalRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  documents?: string[];
  relatedEntities?: string[];
}

export interface RegulatoryAction {
  id: string;
  regulator: string;
  actionType: 'Fine' | 'Licence Suspension' | 'Warning' | 'Enforcement Notice' | 'Investigation';
  date: string;
  status: 'Active' | 'Resolved' | 'Under Appeal';
  amount?: string;
  details: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface CompanyStrikeOff {
  id: string;
  entityName: string;
  jurisdiction: string;
  strikeOffDate: string;
  reason: string;
  status: 'Struck Off' | 'Pending Strike-off' | 'Reinstated' | 'Dissolved';
  directorInvolved: string;
  assetsStatus: string;
  creditorsClaims: boolean;
}

export interface LegalConcern {
  id: string;
  concernType: 'Adverse Media' | 'Legal Judgement' | 'Default Judgement' | 'Bankruptcy' | 'Director Disqualification' | 'Fraud Allegation';
  date: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  source: string;
  verified: boolean;
  impact: string;
}

export interface ClientLegalData {
  clientId: string;
  hasLegalIssues: boolean;
  legalMatters: LegalMatter[];
  regulatoryActions: RegulatoryAction[];
  companyStrikeOffs: CompanyStrikeOff[];
  legalConcerns: LegalConcern[];
  overallLegalRisk: 'Low' | 'Medium' | 'High' | 'Critical';
}

export const LEGAL_MATTERS_DATABASE: Record<string, ClientLegalData> = {
  // Sarah Chen - Clean
  'client-001': {
    clientId: 'client-001',
    hasLegalIssues: false,
    legalMatters: [],
    regulatoryActions: [],
    companyStrikeOffs: [],
    legalConcerns: [],
    overallLegalRisk: 'Low'
  },

  // Global Trade Solutions - SERIOUS LEGAL ISSUES
  'client-004': {
    clientId: 'client-004',
    hasLegalIssues: true,
    legalMatters: [
      {
        id: 'LM-2024-001',
        type: 'Criminal Investigation',
        title: 'AUSTRAC Investigation - Money Laundering',
        status: 'Open',
        severity: 'Critical',
        dateOpened: '2024-02-15',
        jurisdiction: 'Australia',
        court: 'Federal Court of Australia',
        caseNumber: 'FCA-2024-0215',
        parties: ['AUSTRAC', 'Global Trade Solutions Pty Ltd', 'Viktor Petrov'],
        description: 'AUSTRAC has initiated a formal investigation into alleged money laundering activities and sanctions evasion. Investigation focuses on transactions with BVI and Cyprus entities linked to sanctioned individuals.',
        financialImpact: 'Potential fines up to $21 million per violation',
        reputationalRisk: 'Critical',
        documents: ['AUSTRAC Notice', 'Subpoena', 'Transaction Records'],
        relatedEntities: ['Horizon Investments Ltd', 'Mediterranean Trading Corp']
      },
      {
        id: 'LM-2024-002',
        type: 'Litigation',
        title: 'Commercial Dispute - Contract Breach',
        status: 'Open',
        severity: 'High',
        dateOpened: '2024-01-10',
        jurisdiction: 'New South Wales',
        court: 'NSW Supreme Court',
        caseNumber: 'SC-2024-00145',
        parties: ['Australian Trading Partners Ltd', 'Global Trade Solutions Pty Ltd'],
        description: 'Plaintiff alleges breach of contract and fraudulent misrepresentation regarding shipment of goods. Claim amount $4.5 million plus interest and costs.',
        financialImpact: '$4.5M claim plus legal costs',
        reputationalRisk: 'High',
        documents: ['Statement of Claim', 'Defence', 'Discovery Documents']
      },
      {
        id: 'LM-2023-003',
        type: 'Regulatory Action',
        title: 'ASIC Investigation - False Statements',
        status: 'Under Investigation',
        severity: 'Critical',
        dateOpened: '2023-11-20',
        jurisdiction: 'Australia',
        parties: ['ASIC', 'Global Trade Solutions Pty Ltd', 'Viktor Petrov'],
        description: 'ASIC investigating alleged false statements in annual returns and beneficial ownership disclosures. Concerns about nominee director arrangements and undisclosed related party transactions.',
        financialImpact: 'Potential director bans and fines',
        reputationalRisk: 'Critical',
        documents: ['ASIC Notice', 'Section 19 Notice'],
        relatedEntities: ['Viktor Petrov', 'Anna Kowalski']
      },
      {
        id: 'LM-2022-004',
        type: 'Tax Dispute',
        title: 'ATO Audit - Transfer Pricing',
        status: 'Pending Appeal',
        severity: 'High',
        dateOpened: '2022-08-15',
        dateClosed: '2023-10-30',
        jurisdiction: 'Australia',
        parties: ['Australian Taxation Office', 'Global Trade Solutions Pty Ltd'],
        description: 'ATO audit identified transfer pricing arrangements with related offshore entities resulting in profit shifting. Assessment issued for $8.2M in additional tax plus penalties.',
        outcome: 'Assessment issued - under objection',
        financialImpact: '$8.2M tax + $2.4M penalties',
        reputationalRisk: 'High',
        documents: ['ATO Assessment', 'Objection', 'Transfer Pricing Documentation']
      },
      {
        id: 'LM-2024-005',
        type: 'Criminal Investigation',
        title: 'AFP Investigation - Import/Export Fraud',
        status: 'Open',
        severity: 'Critical',
        dateOpened: '2024-03-05',
        jurisdiction: 'Australia',
        court: 'Australian Federal Police',
        parties: ['Australian Federal Police', 'Global Trade Solutions Pty Ltd', 'Viktor Petrov', 'Anna Kowalski'],
        description: 'AFP investigating alleged import/export fraud scheme involving false customs declarations, under-invoicing, and duty evasion. Estimated revenue loss to Commonwealth exceeds $15M.',
        financialImpact: 'Potential criminal charges, $15M+ restitution, prison terms',
        reputationalRisk: 'Critical',
        documents: ['AFP Search Warrant', 'Customs Records Seizure', 'Forensic Accounting Report']
      },
      {
        id: 'LM-2023-006',
        type: 'Litigation',
        title: 'Shareholder Oppression Claim',
        status: 'Open',
        severity: 'High',
        dateOpened: '2023-09-12',
        jurisdiction: 'Victoria',
        court: 'Supreme Court of Victoria',
        caseNumber: 'SCV-2023-09876',
        parties: ['Michael Roberts', 'Global Trade Solutions Pty Ltd', 'Viktor Petrov'],
        description: 'Minority shareholder alleges oppression, exclusion from management, dividend stripping, and asset diversion to related entities. Seeking orders for buyout at fair value or winding up.',
        financialImpact: '$3.5M estimated buyout claim',
        reputationalRisk: 'High',
        documents: ['Oppression Application', 'Valuation Reports', 'Financial Records']
      },
      {
        id: 'LM-2024-007',
        type: 'Compliance Breach',
        title: 'Workplace Safety Prosecution',
        status: 'Open',
        severity: 'Medium',
        dateOpened: '2024-01-20',
        jurisdiction: 'New South Wales',
        court: 'NSW Industrial Relations Commission',
        caseNumber: 'IRC-2024-0089',
        parties: ['SafeWork NSW', 'Global Trade Solutions Pty Ltd'],
        description: 'Prosecution for workplace safety breaches following serious injury at warehouse facility. Alleged failure to maintain safe systems of work and inadequate training.',
        financialImpact: 'Potential fines up to $500,000',
        reputationalRisk: 'Medium',
        documents: ['SafeWork Notice', 'Incident Report', 'Expert Safety Audit']
      },
      {
        id: 'LM-2023-008',
        type: 'Litigation',
        title: 'Trade Mark Infringement',
        status: 'Settled',
        severity: 'Low',
        dateOpened: '2023-03-15',
        dateClosed: '2023-11-30',
        jurisdiction: 'Federal Court',
        court: 'Federal Court of Australia',
        caseNumber: 'FCA-2023-1456',
        parties: ['GlobalTrade International Inc', 'Global Trade Solutions Pty Ltd'],
        description: 'Trade mark infringement claim regarding similar business name and logo. Settled with agreement to rebrand and pay damages.',
        outcome: 'Settled - $125,000 damages paid, rebranding required',
        financialImpact: '$125,000 settlement + rebranding costs',
        reputationalRisk: 'Low',
        documents: ['Settlement Deed', 'Trademark Assignment']
      },
      {
        id: 'LM-2024-009',
        type: 'Regulatory Action',
        title: 'ACCC Cartel Investigation',
        status: 'Under Investigation',
        severity: 'Critical',
        dateOpened: '2024-02-01',
        jurisdiction: 'Australia',
        parties: ['Australian Competition and Consumer Commission', 'Global Trade Solutions Pty Ltd', '5 Other Importers'],
        description: 'ACCC investigating alleged cartel conduct involving price fixing and market allocation among major importers. Wiretap evidence suggests coordinated pricing arrangements.',
        financialImpact: 'Potential criminal charges, unlimited fines, prison terms for directors',
        reputationalRisk: 'Critical',
        documents: ['ACCC Section 155 Notice', 'Leniency Application (Competitor)', 'Wire Tap Transcripts'],
        relatedEntities: ['Viktor Petrov']
      },
      {
        id: 'LM-2023-010',
        type: 'Litigation',
        title: 'Unfair Dismissal - Former CFO',
        status: 'Open',
        severity: 'Medium',
        dateOpened: '2023-12-10',
        jurisdiction: 'Fair Work Commission',
        court: 'Fair Work Commission',
        caseNumber: 'FWC-2023-8901',
        parties: ['Robert Zhang (Former CFO)', 'Global Trade Solutions Pty Ltd'],
        description: 'Former CFO claims unfair dismissal after raising concerns about financial irregularities and potential fraud. Seeking reinstatement or $850,000 compensation. Alleges whistleblower victimization.',
        financialImpact: '$850,000 claim plus adverse publicity',
        reputationalRisk: 'High',
        documents: ['Unfair Dismissal Application', 'Whistleblower Complaint', 'Email Correspondence']
      },
      {
        id: 'LM-2024-011',
        type: 'Insolvency',
        title: 'Creditor Statutory Demand',
        status: 'Open',
        severity: 'High',
        dateOpened: '2024-03-18',
        jurisdiction: 'New South Wales',
        court: 'NSW Supreme Court',
        caseNumber: 'SC-2024-03421',
        parties: ['Eastern Logistics Pty Ltd', 'Global Trade Solutions Pty Ltd'],
        description: 'Creditor has issued statutory demand for $680,000 in unpaid invoices. Company has 21 days to pay or face winding up application. Disputes portion of claim.',
        financialImpact: '$680,000 debt claim, risk of insolvency proceedings',
        reputationalRisk: 'High',
        documents: ['Statutory Demand', 'Affidavit in Opposition']
      },
      {
        id: 'LM-2023-012',
        type: 'Compliance Breach',
        title: 'Environmental Protection Order',
        status: 'Settled',
        severity: 'Medium',
        dateOpened: '2023-06-05',
        dateClosed: '2023-10-20',
        jurisdiction: 'New South Wales',
        parties: ['NSW Environment Protection Authority', 'Global Trade Solutions Pty Ltd'],
        description: 'EPA issued clean-up order and penalty for unlawful waste disposal at warehouse facility. Chemical contamination detected in soil samples.',
        outcome: 'Settled - $95,000 penalty paid, remediation completed',
        financialImpact: '$95,000 penalty + $240,000 remediation costs',
        reputationalRisk: 'Medium',
        documents: ['EPA Order', 'Remediation Report', 'Settlement Agreement']
      }
    ],
    regulatoryActions: [
      {
        id: 'RA-2024-001',
        regulator: 'AUSTRAC',
        actionType: 'Investigation',
        date: '2024-02-15',
        status: 'Active',
        details: 'Formal investigation into AML/CTF compliance failures and suspicious transaction reporting deficiencies',
        severity: 'Critical'
      },
      {
        id: 'RA-2023-002',
        regulator: 'ASIC',
        actionType: 'Enforcement Notice',
        date: '2023-12-05',
        status: 'Active',
        details: 'Notice to produce documents and records relating to beneficial ownership and related party transactions',
        severity: 'High'
      },
      {
        id: 'RA-2024-003',
        regulator: 'Australian Federal Police',
        actionType: 'Investigation',
        date: '2024-03-05',
        status: 'Active',
        details: 'Criminal investigation into import/export fraud and customs duty evasion',
        severity: 'Critical'
      },
      {
        id: 'RA-2024-004',
        regulator: 'Australian Competition and Consumer Commission',
        actionType: 'Investigation',
        date: '2024-02-01',
        status: 'Active',
        details: 'Cartel investigation - alleged price fixing and market allocation conduct',
        severity: 'Critical'
      },
      {
        id: 'RA-2024-005',
        regulator: 'Australian Taxation Office',
        actionType: 'Enforcement Notice',
        date: '2024-01-15',
        status: 'Active',
        amount: '$10.6M',
        details: 'Amended assessment issued for transfer pricing adjustments, profit shifting, and GST underpayment. Objection filed but payment required pending resolution.',
        severity: 'Critical'
      },
      {
        id: 'RA-2023-006',
        regulator: 'SafeWork NSW',
        actionType: 'Enforcement Notice',
        date: '2023-11-20',
        status: 'Active',
        details: 'Improvement notices issued for multiple workplace safety breaches. Prohibition order on certain warehouse operations.',
        severity: 'Medium'
      },
      {
        id: 'RA-2023-007',
        regulator: 'NSW Environment Protection Authority',
        actionType: 'Fine',
        date: '2023-10-20',
        status: 'Resolved',
        amount: '$95,000',
        details: 'Penalty for unlawful waste disposal and environmental contamination. Remediation completed.',
        severity: 'Medium'
      },
      {
        id: 'RA-2024-008',
        regulator: 'Department of Home Affairs - ABF',
        actionType: 'Investigation',
        date: '2024-02-28',
        status: 'Active',
        details: 'Australian Border Force investigating false customs declarations and undervaluation of imports to evade duties.',
        severity: 'High'
      }
    ],
    companyStrikeOffs: [
      {
        id: 'CSO-2023-001',
        entityName: 'Horizon Investments Ltd',
        jurisdiction: 'British Virgin Islands',
        strikeOffDate: '2023-09-15',
        reason: 'Failure to file annual returns, no known business activity',
        status: 'Struck Off',
        directorInvolved: 'Viktor Petrov',
        assetsStatus: 'Unknown - no liquidation process',
        creditorsClaims: true
      },
      {
        id: 'CSO-2022-002',
        entityName: 'Pacific Holdings International',
        jurisdiction: 'British Virgin Islands',
        strikeOffDate: '2022-06-20',
        reason: 'Dissolved for non-compliance',
        status: 'Struck Off',
        directorInvolved: 'Viktor Petrov',
        assetsStatus: 'Assets transferred prior to dissolution',
        creditorsClaims: false
      },
      {
        id: 'CSO-2021-003',
        entityName: 'Global Commodities Trading Ltd',
        jurisdiction: 'Seychelles',
        strikeOffDate: '2021-12-10',
        reason: 'Failure to renew registration, inactive',
        status: 'Struck Off',
        directorInvolved: 'Viktor Petrov',
        assetsStatus: 'Bank accounts closed, funds moved offshore',
        creditorsClaims: true
      },
      {
        id: 'CSO-2023-004',
        entityName: 'East-West Logistics Pty Ltd',
        jurisdiction: 'Australia',
        strikeOffDate: '2023-07-25',
        reason: 'Voluntary deregistration - no assets, substantial debts',
        status: 'Struck Off',
        directorInvolved: 'Anna Kowalski',
        assetsStatus: 'No assets - creditors unpaid',
        creditorsClaims: true
      },
      {
        id: 'CSO-2020-005',
        entityName: 'Atlas Import Export Corp',
        jurisdiction: 'Hong Kong',
        strikeOffDate: '2020-03-30',
        reason: 'Deregistered - failure to file returns for 3 years',
        status: 'Struck Off',
        directorInvolved: 'Viktor Petrov',
        assetsStatus: 'Unknown',
        creditorsClaims: false
      }
    ],
    legalConcerns: [
      {
        id: 'LC-2024-001',
        concernType: 'Fraud Allegation',
        date: '2024-03-01',
        description: 'Media reports alleging involvement in sanctions evasion scheme using shell companies',
        severity: 'Critical',
        source: 'Financial Times Investigation',
        verified: true,
        impact: 'Severe reputational damage, potential criminal charges'
      },
      {
        id: 'LC-2024-002',
        concernType: 'Adverse Media',
        date: '2024-02-20',
        description: 'Reuters article linking company to Russian oligarch sanctions evasion network',
        severity: 'Critical',
        source: 'Reuters News',
        verified: true,
        impact: 'Banking relationships at risk, potential account closures'
      },
      {
        id: 'LC-2023-003',
        concernType: 'Director Disqualification',
        date: '2023-08-10',
        description: 'Director Viktor Petrov subject to disqualification proceedings in Cyprus',
        severity: 'High',
        source: 'Cyprus Companies Register',
        verified: true,
        impact: 'Questions about director fitness and propriety'
      },
      {
        id: 'LC-2024-004',
        concernType: 'Adverse Media',
        date: '2024-03-10',
        description: 'ABC News Four Corners investigation into alleged customs fraud and corruption',
        severity: 'Critical',
        source: 'ABC Four Corners',
        verified: true,
        impact: 'Major public scrutiny, regulatory attention, customer concerns'
      },
      {
        id: 'LC-2023-005',
        concernType: 'Fraud Allegation',
        date: '2023-12-15',
        description: 'Former CFO alleges systematic financial fraud, false accounting, and tax evasion in whistleblower complaint',
        severity: 'Critical',
        source: 'Whistleblower Complaint to ASIC',
        verified: true,
        impact: 'Regulatory investigation triggered, criminal referral likely'
      },
      {
        id: 'LC-2024-005',
        concernType: 'Default Judgement',
        date: '2024-02-05',
        description: 'Multiple default judgements entered against company for unpaid supplier invoices totaling $1.2M',
        severity: 'High',
        source: 'NSW Supreme Court Records',
        verified: true,
        impact: 'Solvency concerns, potential creditor action'
      },
      {
        id: 'LC-2023-006',
        concernType: 'Adverse Media',
        date: '2023-10-20',
        description: 'Industry publication reports widespread complaints from customers about non-delivery of goods and poor business practices',
        severity: 'Medium',
        source: 'Trade Journal',
        verified: true,
        impact: 'Reputational damage, loss of customer confidence'
      },
      {
        id: 'LC-2024-007',
        concernType: 'Legal Judgement',
        date: '2024-01-30',
        description: 'Judgement entered in favor of landlord for $280,000 in unpaid rent and property damage at former warehouse',
        severity: 'Medium',
        source: 'County Court Records',
        verified: true,
        impact: 'Financial pressure, difficulty securing new premises'
      }
    ],
    overallLegalRisk: 'Critical'
  },

  // Melbourne Property Trust - Minor closed matter
  'client-002': {
    clientId: 'client-002',
    hasLegalIssues: true,
    legalMatters: [
      {
        id: 'LM-2022-005',
        type: 'Litigation',
        title: 'Tenant Dispute - Lease Agreement',
        status: 'Closed',
        severity: 'Low',
        dateOpened: '2022-03-15',
        dateClosed: '2022-08-20',
        jurisdiction: 'Victoria',
        court: 'Victorian Civil and Administrative Tribunal',
        caseNumber: 'VCAT-2022-03456',
        parties: ['XYZ Retail Pty Ltd', 'Melbourne Property Trust'],
        description: 'Minor commercial tenancy dispute regarding lease terms interpretation',
        outcome: 'Settled - mediation successful',
        financialImpact: '$15,000 settlement payment',
        reputationalRisk: 'Low',
        documents: ['Settlement Agreement']
      }
    ],
    regulatoryActions: [],
    companyStrikeOffs: [],
    legalConcerns: [],
    overallLegalRisk: 'Low'
  },

  // TechStart Innovations - Clean
  'client-003': {
    clientId: 'client-003',
    hasLegalIssues: false,
    legalMatters: [],
    regulatoryActions: [],
    companyStrikeOffs: [],
    legalConcerns: [],
    overallLegalRisk: 'Low'
  },

  // Green Earth Foundation - Clean
  'client-005': {
    clientId: 'client-005',
    hasLegalIssues: false,
    legalMatters: [],
    regulatoryActions: [],
    companyStrikeOffs: [],
    legalConcerns: [],
    overallLegalRisk: 'Low'
  },

  // Phoenix Consulting Group - Medium risk
  'client-006': {
    clientId: 'client-006',
    hasLegalIssues: true,
    legalMatters: [
      {
        id: 'LM-2023-006',
        type: 'Litigation',
        title: 'Employment Dispute - Unfair Dismissal',
        status: 'Settled',
        severity: 'Medium',
        dateOpened: '2023-05-10',
        dateClosed: '2023-11-15',
        jurisdiction: 'New South Wales',
        court: 'Fair Work Commission',
        caseNumber: 'FWC-2023-5678',
        parties: ['Former Employee', 'Phoenix Consulting Group Pty Ltd'],
        description: 'Former senior consultant claimed unfair dismissal and sought reinstatement or compensation',
        outcome: 'Settled - confidential settlement reached',
        financialImpact: '$85,000 settlement (confidential)',
        reputationalRisk: 'Medium',
        documents: ['Settlement Deed (Confidential)']
      }
    ],
    regulatoryActions: [],
    companyStrikeOffs: [],
    legalConcerns: [
      {
        id: 'LC-2023-004',
        concernType: 'Adverse Media',
        date: '2023-06-05',
        description: 'LinkedIn post by former employee alleging workplace misconduct - later retracted',
        severity: 'Low',
        source: 'Social Media',
        verified: false,
        impact: 'Minimal - post removed and apology issued'
      }
    ],
    overallLegalRisk: 'Low'
  }
};
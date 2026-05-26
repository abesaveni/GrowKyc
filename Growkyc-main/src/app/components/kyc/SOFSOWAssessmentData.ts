// SOF/SOW Assessment Data

export interface EvidenceDocument {
  name: string;
  type: string;
  date: string;
  status: 'Verified' | 'Pending' | 'Rejected';
}

export interface SOFSOWAssessment {
  clientId: string;
  sofType: string;
  sowType: string;
  verificationMethod: string;
  riskRating: 'Low' | 'Medium' | 'High' | 'Critical';
  evidenceDocuments: EvidenceDocument[];
  assessmentDate: string;
  assessor: string;
  comments: string;
}

export const SOF_SOW_ASSESSMENTS: Record<string, SOFSOWAssessment> = {
  // ABC Enterprises (Sarah Chen)
  'client-001': {
    clientId: 'client-001',
    sofType: 'Professional Salary / Partner Distributions',
    sowType: 'Accumulated Professional Earnings & Investments',
    verificationMethod: 'Review of Tax Returns (last 3 years), Pay slips, and Bank Statements',
    riskRating: 'Low',
    evidenceDocuments: [
      { name: 'FY23_Tax_Return.pdf', type: 'Tax Return', date: '2023-10-15', status: 'Verified' },
      { name: 'March_2024_Distribution_Statement.pdf', type: 'Pay Slip', date: '2024-03-31', status: 'Verified' },
      { name: 'Asset_Registry_2024.xlsx', type: 'Statement', date: '2024-01-10', status: 'Verified' }
    ],
    assessmentDate: '2024-04-05',
    assessor: 'Marcus Aurelius',
    comments: 'Client is a long-standing partner at a reputable law firm. Income is consistent with professional standing and verified through official tax documentation.'
  },

  // Dr. James Patterson
  'client-003': {
    clientId: 'client-003',
    sofType: 'Medical Practice Income & Consulting Fees',
    sowType: 'Real Estate Portfolio & Retirement Savings',
    verificationMethod: 'Bank Statement Analysis & Property Title Search',
    riskRating: 'Medium',
    evidenceDocuments: [
      { name: 'Practice_Revenue_Q1_2024.pdf', type: 'Financial Statement', date: '2024-04-01', status: 'Verified' },
      { name: 'Property_Portfolio_Summary.pdf', type: 'Title Deed', date: '2023-12-15', status: 'Verified' },
      { name: 'SMSF_Statement_2023.pdf', type: 'Superannuation', date: '2023-07-20', status: 'Pending' }
    ],
    assessmentDate: '2024-04-12',
    assessor: 'Flavia Julia',
    comments: 'PEP status (Board Member) requires enhanced due diligence. Source of wealth is primarily property and professional earnings, which appear legitimate but require periodic re-verification of SMSF holdings.'
  },

  // Global Trade Solutions
  'client-004': {
    clientId: 'client-004',
    sofType: 'International Trade Revenue & Shareholder Loans',
    sowType: 'Offshore Investment Portfolios & Corporate Profits',
    verificationMethod: 'Third-party Forensic Audit & Beneficial Ownership Verification',
    riskRating: 'Critical',
    evidenceDocuments: [
      { name: 'BVI_Investment_Agreement.pdf', type: 'Legal Contract', date: '2022-11-20', status: 'Rejected' },
      { name: 'Cyprus_Bank_Transfer_Logs.txt', type: 'Bank Record', date: '2024-02-15', status: 'Pending' },
      { name: 'GTS_Audit_Report_2023_Redacted.pdf', type: 'Audit Report', date: '2023-12-05', status: 'Verified' }
    ],
    assessmentDate: '2024-03-20',
    assessor: 'Septimius Severus',
    comments: 'Source of funds is highly opaque, involving multiple shell companies in high-risk jurisdictions. Investment agreement from BVI was rejected due to inconsistencies in beneficial ownership signatures. Risk remains critical due to potential sanctions evasion.'
  },

  // TechStart Innovations
  'client-003-extra': { // Placeholder for demo if needed
    clientId: 'client-003-extra',
    sofType: 'Venture Capital Funding & R&D Grants',
    sowType: 'Founder Equity & Stock Options',
    verificationMethod: 'Investment Agreements & Government Grant Confirmation',
    riskRating: 'Medium',
    evidenceDocuments: [
      { name: 'Series_A_Term_Sheet.pdf', type: 'Investment Agreement', date: '2023-11-02', status: 'Verified' },
      { name: 'AusIndustry_Grant_Approval.pdf', type: 'Grant Confirmation', date: '2024-01-15', status: 'Verified' }
    ],
    assessmentDate: '2024-02-28',
    assessor: 'Marcus Aurelius',
    comments: 'Funding sources are verified VCs and Australian government grants. Standard risk for a high-growth tech startup.'
  }
};

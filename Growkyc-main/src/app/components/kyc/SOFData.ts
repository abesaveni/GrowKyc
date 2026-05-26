
export interface SOFDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  fileSize: string;
}

export interface SOFAssessment {
  type: string;
  description: string;
  verificationMethod: string;
  riskRating: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Verified' | 'In Progress' | 'Action Required';
  evidenceDocuments: SOFDocument[];
  assessedBy: string;
  assessmentDate: string;
}

export interface ClientFinancialAssessment {
  sof: SOFAssessment;
  sow: SOFAssessment;
}

export const SOF_MOCK_DATA: Record<string, ClientFinancialAssessment> = {
  'client-001': {
    sof: {
      type: 'Business Revenue',
      description: 'Accumulated profits from technology consulting services over the last 2 financial years.',
      verificationMethod: 'Certified Management Accounts & Bank Statements',
      riskRating: 'Low',
      status: 'Verified',
      assessedBy: 'Sarah Chen',
      assessmentDate: '2026-03-15',
      evidenceDocuments: [
        { id: 'doc-1', name: 'FY25_Profit_Loss.pdf', type: 'Financial Statement', uploadDate: '2026-03-10', status: 'Verified', fileSize: '2.4 MB' },
        { id: 'doc-2', name: 'NAB_Business_Oct_Mar.pdf', type: 'Bank Statement', uploadDate: '2026-03-12', status: 'Verified', fileSize: '5.1 MB' }
      ]
    },
    sow: {
      type: 'Equity Sale & Reinvestment',
      description: 'Founder equity liquidations from previous successful technology exits in 2022.',
      verificationMethod: 'Share Sale Agreement & Bank Transfer Records',
      riskRating: 'Low',
      status: 'Verified',
      assessedBy: 'Sarah Chen',
      assessmentDate: '2026-03-15',
      evidenceDocuments: [
        { id: 'doc-3', name: 'Sale_Agreement_2022.pdf', type: 'Legal Document', uploadDate: '2026-01-15', status: 'Verified', fileSize: '1.8 MB' }
      ]
    }
  },
  'client-002': {
    sof: {
      type: 'Investment Returns',
      description: 'Quarterly distributions from a diverse portfolio of Australian equities and commercial property.',
      verificationMethod: 'Dividend Statements & Portfolio Summary',
      riskRating: 'Medium',
      status: 'In Progress',
      assessedBy: 'David Lee',
      assessmentDate: '2026-03-20',
      evidenceDocuments: [
        { id: 'doc-4', name: 'Portfolio_Summary_2026.pdf', type: 'Investment Report', uploadDate: '2026-03-18', status: 'Pending', fileSize: '3.2 MB' }
      ]
    },
    sow: {
      type: 'Inheritance & Real Estate Appreciation',
      description: 'Inherited family estate in 2015, significantly appreciated over the decade.',
      verificationMethod: 'Probate Documents & Property Valuation Reports',
      riskRating: 'Low',
      status: 'Verified',
      assessedBy: 'David Lee',
      assessmentDate: '2026-03-20',
      evidenceDocuments: [
        { id: 'doc-5', name: 'Probate_Cert_2015.pdf', type: 'Legal Document', uploadDate: '2026-02-10', status: 'Verified', fileSize: '4.5 MB' }
      ]
    }
  },
  'client-004': {
    sof: {
      type: 'International Trade Receipts',
      description: 'Incoming transfers from multiple overseas jurisdictions associated with import/export.',
      verificationMethod: 'SWIFT Advices & Commercial Invoices',
      riskRating: 'Critical',
      status: 'Action Required',
      assessedBy: 'Compliance Team',
      assessmentDate: '2026-03-21',
      evidenceDocuments: [
        { id: 'doc-6', name: 'SWIFT_Transfer_List.xlsx', type: 'Transaction Record', uploadDate: '2026-03-20', status: 'Rejected', fileSize: '0.8 MB' }
      ]
    },
    sow: {
      type: 'Complex Corporate Holdings',
      description: 'Wealth distributed across multiple offshore entities with complex ownership layers.',
      verificationMethod: 'Trust Deeds & Entity Registration Documents',
      riskRating: 'Critical',
      status: 'Action Required',
      assessedBy: 'Compliance Team',
      assessmentDate: '2026-03-21',
      evidenceDocuments: []
    }
  }
};

// This file contains lender and fund manager specific AML/CTF checklist detail data
// Import this into ChecklistDetailModal to extend functionality

import { Shield, Building, Activity, Users, FileText } from 'lucide-react';

export function getLenderFundManagerDetails(itemName: string, clientName: string, clientType: string) {
  switch (itemName) {
    // LENDER-SPECIFIC REQUIREMENTS
    case 'Source of Funds & Source of Wealth':
      return {
        title: 'Source of Funds & Source of Wealth Verification',
        status: 'Complete',
        icon: Shield,
        color: 'green',
        sections: [
          {
            heading: 'Deposit Source Verification',
            items: [
              { label: 'Deposit Amount', value: '$150,000 verified', verified: true },
              { label: 'Source of Deposit', value: 'Personal savings - Employment income', verified: true },
              { label: 'Bank Account Verified', value: 'Commonwealth Bank - Account confirmed', verified: true },
              { label: 'Transaction History', value: '6 months statements reviewed', verified: true }
            ]
          },
          {
            heading: 'Equity Contribution Source',
            items: [
              { label: 'Equity Amount', value: '$50,000', verified: true },
              { label: 'Source', value: 'Property sale proceeds', verified: true },
              { label: 'Verification', value: 'Settlement statement provided', verified: true },
              { label: 'Third-Party Funding', value: 'None identified', verified: true }
            ]
          },
          {
            heading: 'Repayment Source',
            items: [
              { label: 'Expected Repayment Source', value: 'Rental income + employment', verified: true },
              { label: 'Income Verification', value: 'Employment contract + tax returns', verified: true },
              { label: 'Capacity Assessment', value: 'Sufficient - Debt service ratio 28%', verified: true },
              { label: 'Repayment Monitoring', value: 'Active - Monthly review', verified: true }
            ]
          },
          {
            heading: 'Source of Wealth Assessment',
            items: [
              { label: 'Wealth Accumulation', value: 'Employment income over 15 years', verified: true },
              { label: 'Asset Holdings', value: 'Primary residence + investment property', verified: true },
              { label: 'Unexplained Wealth', value: 'None - All wealth sources documented', verified: true },
              { label: 'Red Flags', value: 'None identified', verified: true }
            ]
          }
        ],
        documents: [
          { name: 'Bank-Statements-6-Months.pdf', size: '3.2 MB', uploadDate: '2024-02-16', status: 'Verified' },
          { name: 'Property-Settlement-Statement.pdf', size: '456 KB', uploadDate: '2024-02-16', status: 'Verified' },
          { name: 'Employment-Contract.pdf', size: '234 KB', uploadDate: '2024-02-16', status: 'Verified' },
          { name: 'Tax-Returns-2-Years.pdf', size: '890 KB', uploadDate: '2024-02-16', status: 'Verified' }
        ],
        auditTrail: [
          { timestamp: '2024-02-16 11:00', action: 'Source of funds verification initiated', user: 'Lending Officer' },
          { timestamp: '2024-02-16 11:15', action: 'Bank statements analyzed', user: 'Lending Officer' },
          { timestamp: '2024-02-16 11:30', action: 'Employment income verified', user: 'Lending Officer' },
          { timestamp: '2024-02-16 11:45', action: 'Source of wealth documented', user: 'Lending Officer' },
          { timestamp: '2024-02-16 12:00', action: 'All funding sources verified - No red flags', user: 'Compliance Officer' }
        ],
        riskAssessment: {
          level: 'Low',
          factors: [
            'All funding sources clearly documented',
            'No circular payments identified',
            'No offshore funding without explanation',
            'Employment and income verified',
            'Wealth accumulation consistent with profile',
            'No third-party funding anomalies'
          ]
        }
      };

    case 'Security & Asset Verification':
      return {
        title: 'Security & Asset Verification',
        status: 'Complete',
        icon: Building,
        color: 'green',
        sections: [
          {
            heading: 'Property Security Details',
            items: [
              { label: 'Property Address', value: '123 Collins Street, Melbourne VIC 3000', verified: true },
              { label: 'Property Type', value: 'Residential - Apartment', verified: true },
              { label: 'Loan-to-Value Ratio', value: '70% - Within policy', verified: true },
              { label: 'Valuation', value: '$850,000 (Independent valuer)', verified: true }
            ]
          },
          {
            heading: 'Title Search Results',
            items: [
              { label: 'Title Reference', value: 'Vol 12345 Fol 678', verified: true },
              { label: 'Registered Owner', value: clientName + ' - Matches borrower', verified: true },
              { label: 'Title Type', value: 'Torrens Title - Clear', verified: true },
              { label: 'Title Search Date', value: '2024-02-17', verified: true }
            ]
          },
          {
            heading: 'Encumbrances Check',
            items: [
              { label: 'Existing Mortgages', value: 'None - Unencumbered', verified: true },
              { label: 'Caveats', value: 'None registered', verified: true },
              { label: 'Easements', value: 'Standard utility easements only', verified: true },
              { label: 'Restrictions', value: 'None affecting security', verified: true }
            ]
          },
          {
            heading: 'PPSR Search',
            items: [
              { label: 'PPSR Search Date', value: '2024-02-17', verified: true },
              { label: 'Security Interests', value: 'None registered', verified: true },
              { label: 'Borrower Name Search', value: 'Clear - No registrations', verified: true },
              { label: 'Serial Number Search', value: 'N/A - Property security', verified: true }
            ]
          }
        ],
        documents: [
          { name: 'Title-Search.pdf', size: '234 KB', uploadDate: '2024-02-17', status: 'Verified' },
          { name: 'Property-Valuation.pdf', size: '1.5 MB', uploadDate: '2024-02-17', status: 'Verified' },
          { name: 'PPSR-Certificate.pdf', size: '156 KB', uploadDate: '2024-02-17', status: 'System Generated' },
          { name: 'Insurance-Certificate.pdf', size: '345 KB', uploadDate: '2024-02-17', status: 'Verified' }
        ],
        auditTrail: [
          { timestamp: '2024-02-17 09:00', action: 'Security verification process initiated', user: 'Lending Officer' },
          { timestamp: '2024-02-17 09:15', action: 'Title search conducted', user: 'Lending Officer' },
          { timestamp: '2024-02-17 09:30', action: 'Ownership confirmed - Matches borrower', user: 'Lending Officer' },
          { timestamp: '2024-02-17 09:45', action: 'PPSR search completed - Clear', user: 'Lending Officer' },
          { timestamp: '2024-02-17 10:00', action: 'Property valuation reviewed', user: 'Credit Officer' },
          { timestamp: '2024-02-17 10:15', action: 'Security verification complete - Approved', user: 'Credit Manager' }
        ],
        riskAssessment: {
          level: 'Low',
          factors: [
            'Property ownership confirmed',
            'Title is clear and unencumbered',
            'No PPSR security interests',
            'Valuation supports loan amount',
            'LVR within acceptable limits',
            'Insurance in place'
          ]
        }
      };

    case 'Transaction Monitoring (Lenders)':
      return {
        title: 'Transaction Monitoring - Lending Activity',
        status: 'Active',
        icon: Activity,
        color: 'blue',
        sections: [
          {
            heading: 'Loan Disbursement Monitoring',
            items: [
              { label: 'Disbursement Date', value: '2024-02-18', verified: true },
              { label: 'Disbursement Amount', value: '$595,000', verified: true },
              { label: 'Recipient Account', value: 'Verified - Borrower account', verified: true },
              { label: 'Disbursement Pattern', value: 'Standard - Single payment', verified: true }
            ]
          },
          {
            heading: 'Repayment Monitoring (Active)',
            items: [
              { label: 'Payment Frequency', value: 'Monthly - Expected pattern', verified: true },
              { label: 'Payment Source', value: 'Same account - Consistent', verified: true },
              { label: 'Payment Amounts', value: 'Consistent with schedule', verified: true },
              { label: 'Third-Party Payments', value: 'None detected', verified: true }
            ]
          },
          {
            heading: 'Red Flag Monitoring',
            items: [
              { label: 'Early Repayment', value: 'None - Normal course', verified: true },
              { label: 'Rapid Refinancing', value: 'Not applicable', verified: true },
              { label: 'Round-Sum Transactions', value: 'None outside normal', verified: true },
              { label: 'Offshore Payments', value: 'None detected', verified: true }
            ]
          },
          {
            heading: 'Alerts & Triggers',
            items: [
              { label: 'Large Transaction Alert', value: 'Threshold: $50,000+', verified: true },
              { label: 'Pattern Change Alert', value: 'Active - Any deviation', verified: true },
              { label: 'Third-Party Payment Alert', value: 'Active - Immediate escalation', verified: true },
              { label: 'Current Alerts', value: 'None - All transactions normal', verified: true }
            ]
          }
        ],
        documents: [
          { name: 'Transaction-Log.pdf', size: '567 KB', uploadDate: '2024-02-19', status: 'System Generated' }
        ],
        auditTrail: [
          { timestamp: '2024-02-18 10:00', action: 'Loan disbursed - $595,000', user: 'System' },
          { timestamp: '2024-02-18 10:00', action: 'Transaction monitoring activated', user: 'System' },
          { timestamp: '2024-02-19 02:00', action: 'Daily transaction review - No alerts', user: 'System' }
        ],
        riskAssessment: {
          level: 'Low',
          factors: [
            'Transaction monitoring active',
            'No suspicious patterns detected',
            'Repayment source consistent',
            'No third-party payments',
            'No early discharge attempts',
            'Alert system functioning properly'
          ]
        }
      };

    // FUND MANAGER-SPECIFIC REQUIREMENTS
    case 'Investor Onboarding':
      return {
        title: 'Investor Onboarding & Due Diligence',
        status: 'Complete',
        icon: Users,
        color: 'green',
        sections: [
          {
            heading: 'Investor Identification',
            items: [
              { label: 'Investor Name', value: clientName, verified: true },
              { label: 'Investor Type', value: clientType, verified: true },
              { label: 'Identity Verification', value: 'Verified via GreenID', verified: true },
              { label: 'Beneficial Ownership', value: 'Verified - All 25%+ owners identified', verified: true }
            ]
          },
          {
            heading: 'Investor Screening',
            items: [
              { label: 'Sanctions Screening', value: 'Clear - No matches', verified: true },
              { label: 'PEP Screening', value: 'Not a PEP', verified: true },
              { label: 'Adverse Media', value: 'No adverse findings', verified: true },
              { label: 'Screening Date', value: '2024-02-16', verified: true }
            ]
          },
          {
            heading: 'Subscription Details',
            items: [
              { label: 'Subscription Amount', value: '$500,000', verified: true },
              { label: 'Investment Structure', value: 'Direct investment - Simple', verified: true },
              { label: 'Expected Returns', value: '8-10% p.a. - Documented', verified: true },
              { label: 'Investment Horizon', value: '5 years - Long term', verified: true }
            ]
          },
          {
            heading: 'Source of Subscription Capital',
            items: [
              { label: 'Capital Source', value: 'Business sale proceeds', verified: true },
              { label: 'Origin Verification', value: 'Sale contract + settlement docs', verified: true },
              { label: 'Bank Account Ownership', value: 'Verified - Investor owned', verified: true },
              { label: 'Offshore Capital', value: 'No - Domestic Australian funds', verified: true }
            ]
          }
        ],
        documents: [
          { name: 'Investor-Application.pdf', size: '678 KB', uploadDate: '2024-02-16', status: 'Approved' },
          { name: 'Source-of-Funds-Evidence.pdf', size: '1.2 MB', uploadDate: '2024-02-16', status: 'Verified' },
          { name: 'Investor-Screening-Report.pdf', size: '345 KB', uploadDate: '2024-02-16', status: 'System Generated' },
          { name: 'Subscription-Agreement.pdf', size: '890 KB', uploadDate: '2024-02-17', status: 'Signed' }
        ],
        auditTrail: [
          { timestamp: '2024-02-16 09:00', action: 'Investor application received', user: 'Fund Administrator' },
          { timestamp: '2024-02-16 10:00', action: 'Identity verification completed', user: 'Compliance Team' },
          { timestamp: '2024-02-16 11:00', action: 'Screening completed - All clear', user: 'Compliance System' },
          { timestamp: '2024-02-16 14:00', action: 'Source of funds verified', user: 'Compliance Officer' },
          { timestamp: '2024-02-17 15:00', action: 'Subscription agreement signed', user: clientName },
          { timestamp: '2024-02-17 16:00', action: 'Investor onboarding complete - Approved', user: 'Fund Manager' }
        ],
        riskAssessment: {
          level: 'Low',
          factors: [
            'Domestic Australian investor',
            'Simple investment structure',
            'Source of funds clearly documented',
            'No PEP or sanctions exposure',
            'Long-term investment horizon',
            'No offshore capital involved'
          ]
        }
      };

    case 'Capital Call Monitoring':
      return {
        title: 'Capital Call & Funding Monitoring',
        status: 'Active',
        icon: Activity,
        color: 'blue',
        sections: [
          {
            heading: 'Capital Call Schedule',
            items: [
              { label: 'Initial Capital Call', value: '$500,000 - Received on time', verified: true },
              { label: 'Payment Method', value: 'Direct bank transfer', verified: true },
              { label: 'Paying Account', value: 'Verified investor account', verified: true },
              { label: 'Settlement Date', value: '2024-02-18', verified: true }
            ]
          },
          {
            heading: 'Irregular Activity Monitoring',
            items: [
              { label: 'Late Payments', value: 'None - All on time', verified: true },
              { label: 'Structured Deposits', value: 'None detected', verified: true },
              { label: 'Multiple Feeder Accounts', value: 'Not applicable - Single account', verified: true },
              { label: 'Third-Party Transfers', value: 'None detected', verified: true }
            ]
          },
          {
            heading: 'Payment Pattern Analysis',
            items: [
              { label: 'Payment Consistency', value: 'Consistent with investor profile', verified: true },
              { label: 'Unexpected Transfers', value: 'None identified', verified: true },
              { label: 'Funding Source Changes', value: 'None - Same account', verified: true },
              { label: 'Red Flags', value: 'None detected', verified: true }
            ]
          }
        ],
        documents: [
          { name: 'Capital-Call-Notice.pdf', size: '234 KB', uploadDate: '2024-02-10', status: 'Sent' },
          { name: 'Payment-Receipt.pdf', size: '156 KB', uploadDate: '2024-02-18', status: 'Verified' }
        ],
        auditTrail: [
          { timestamp: '2024-02-10 10:00', action: 'Capital call notice issued', user: 'Fund Administrator' },
          { timestamp: '2024-02-18 09:00', action: 'Capital received - $500,000', user: 'System' },
          { timestamp: '2024-02-18 09:15', action: 'Payment source verified', user: 'Compliance Officer' },
          { timestamp: '2024-02-18 10:00', action: 'Capital call complete - No irregularities', user: 'Fund Administrator' }
        ],
        riskAssessment: {
          level: 'Low',
          factors: [
            'Capital received on time',
            'Payment from verified account',
            'No structuring detected',
            'No third-party payments',
            'Consistent with investor profile',
            'Monitoring active for future calls'
          ]
        }
      };

    case 'Distribution Monitoring':
      return {
        title: 'Distribution & Redemption Monitoring',
        status: 'Active',
        icon: Activity,
        color: 'blue',
        sections: [
          {
            heading: 'Distribution Details',
            items: [
              { label: 'Distribution Frequency', value: 'Quarterly', verified: true },
              { label: 'Last Distribution', value: '$12,500 (Q4 2023)', verified: true },
              { label: 'Distribution Account', value: 'Same account as subscription', verified: true },
              { label: 'Distribution Pattern', value: 'Consistent with fund performance', verified: true }
            ]
          },
          {
            heading: 'Account Change Monitoring',
            items: [
              { label: 'Account Changes', value: 'None - Original account maintained', verified: true },
              { label: 'New Account Requests', value: 'None received', verified: true },
              { label: 'Third-Party Distribution Requests', value: 'None - Policy prohibits', verified: true },
              { label: 'Offshore Account Requests', value: 'None', verified: true }
            ]
          },
          {
            heading: 'Red Flag Monitoring',
            items: [
              { label: 'Large Distribution Requests', value: 'None outside normal', verified: true },
              { label: 'Rapid Redemptions', value: 'Not applicable', verified: true },
              { label: 'Unusual Patterns', value: 'None detected', verified: true },
              { label: 'Current Alerts', value: 'None', verified: true }
            ]
          }
        ],
        documents: [],
        auditTrail: [
          { timestamp: '2024-01-15 10:00', action: 'Q4 2023 distribution processed', user: 'Fund Administrator' },
          { timestamp: '2024-01-15 10:15', action: 'Distribution account verified', user: 'System' }
        ],
        riskAssessment: {
          level: 'Low',
          factors: [
            'Distributions to verified account only',
            'No account change requests',
            'No third-party distribution attempts',
            'Pattern consistent with fund terms',
            'No offshore distribution requests',
            'Monitoring active'
          ]
        }
      };

    case 'Underlying Asset/Borrower Checks':
      return {
        title: 'Underlying Asset & Borrower Due Diligence',
        status: 'Complete',
        icon: Shield,
        color: 'green',
        sections: [
          {
            heading: 'Borrower/Investee Identification',
            items: [
              { label: 'Entity Name', value: 'Property Development Co Pty Ltd', verified: true },
              { label: 'ACN/ABN', value: '987 654 321 / 98 765 432 109', verified: true },
              { label: 'Directors Identified', value: '2 directors verified', verified: true },
              { label: 'Beneficial Owners', value: 'All 25%+ owners identified', verified: true }
            ]
          },
          {
            heading: 'Borrower Screening',
            items: [
              { label: 'Sanctions Screening', value: 'Clear - All parties', verified: true },
              { label: 'PEP Screening', value: 'No PEP exposure', verified: true },
              { label: 'Adverse Media', value: 'No adverse findings', verified: true },
              { label: 'Credit History', value: 'Reviewed - Acceptable', verified: true }
            ]
          },
          {
            heading: 'Asset/Project Details',
            items: [
              { label: 'Project Type', value: 'Residential development - 12 townhouses', verified: true },
              { label: 'Location', value: 'Box Hill, Victoria', verified: true },
              { label: 'Loan Amount', value: '$2.5 million', verified: true },
              { label: 'Security', value: 'First mortgage over development site', verified: true }
            ]
          },
          {
            heading: 'Dual Risk Assessment',
            items: [
              { label: 'Investor Risk', value: 'LOW - Domestic, verified', verified: true },
              { label: 'Borrower Risk', value: 'MEDIUM - Development project', verified: true },
              { label: 'Overall Fund Risk', value: 'MEDIUM - Enhanced monitoring', verified: true },
              { label: 'Approved By', value: 'Investment Committee', verified: true }
            ]
          }
        ],
        documents: [
          { name: 'Borrower-CDD-Report.pdf', size: '2.1 MB', uploadDate: '2024-02-15', status: 'Verified' },
          { name: 'Project-Due-Diligence.pdf', size: '3.4 MB', uploadDate: '2024-02-15', status: 'Approved' },
          { name: 'Security-Valuation.pdf', size: '1.8 MB', uploadDate: '2024-02-16', status: 'Verified' }
        ],
        auditTrail: [
          { timestamp: '2024-02-15 09:00', action: 'Borrower CDD initiated', user: 'Compliance Team' },
          { timestamp: '2024-02-15 14:00', action: 'All parties screened - Clear', user: 'Compliance System' },
          { timestamp: '2024-02-16 10:00', action: 'Project due diligence completed', user: 'Investment Team' },
          { timestamp: '2024-02-16 15:00', action: 'Dual risk assessment complete', user: 'Risk Officer' },
          { timestamp: '2024-02-17 11:00', action: 'Investment approved by committee', user: 'Investment Committee' }
        ],
        riskAssessment: {
          level: 'Medium',
          factors: [
            'Borrower fully verified and screened',
            'Development project - Elevated risk',
            'Strong security position',
            'Enhanced monitoring required',
            'Monthly progress reporting',
            'Dual exposure (investor + borrower) managed'
          ]
        }
      };

    default:
      return null;
  }
}

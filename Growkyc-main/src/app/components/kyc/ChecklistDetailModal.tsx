import React from 'react';
import { Button } from '../ui/button';
import {
  XCircle,
  CheckCircle,
  Clock,
  Shield,
  FileText,
  Download,
  Eye,
  AlertTriangle,
  User,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building
} from 'lucide-react';
import { getLenderFundManagerDetails } from './LenderFundManagerChecklists';

interface ChecklistDetailModalProps {
  itemName: string;
  clientName: string;
  clientType: string;
  onClose: () => void;
}

export function ChecklistDetailModal({ itemName, clientName, clientType, onClose }: ChecklistDetailModalProps) {
  const getDetailedInfo = () => {
    // Check if this is a lender/fund manager specific item
    const lenderFundManagerData = getLenderFundManagerDetails(itemName, clientName, clientType);
    if (lenderFundManagerData) {
      return lenderFundManagerData;
    }

    // Otherwise, use standard accounting checklist items
    switch (itemName) {
      case 'Contact Details':
        return {
          title: 'Contact Details Verification',
          status: 'Complete',
          icon: Phone,
          color: 'green',
          sections: [
            {
              heading: 'Personal Information',
              items: [
                { label: 'Full Name', value: clientName, verified: true },
                { label: 'Email Address', value: 'sarah.mitchell@email.com', verified: true },
                { label: 'Phone Number', value: '+61 412 345 678', verified: true },
                { label: 'Date of Birth', value: '15 March 1985', verified: true }
              ]
            },
            {
              heading: 'Residential Address',
              items: [
                { label: 'Street Address', value: '123 Collins Street', verified: true },
                { label: 'Suburb/City', value: 'Melbourne', verified: true },
                { label: 'State', value: 'Victoria', verified: true },
                { label: 'Postcode', value: '3000', verified: true },
                { label: 'Country', value: 'Australia', verified: true }
              ]
            },
            {
              heading: 'Verification Status',
              items: [
                { label: 'Email Verification', value: 'Verified via email link click', verified: true },
                { label: 'Phone Verification', value: 'Verified via SMS OTP', verified: true },
                { label: 'Address Verification', value: 'Verified via utility bill', verified: true }
              ]
            }
          ],
          documents: [],
          auditTrail: [
            { timestamp: '2024-02-16 10:00', action: 'Client started contact details form', user: clientName },
            { timestamp: '2024-02-16 10:08', action: 'Email verification link sent', user: 'System' },
            { timestamp: '2024-02-16 10:10', action: 'Email verified successfully', user: clientName },
            { timestamp: '2024-02-16 10:12', action: 'SMS verification code sent', user: 'System' },
            { timestamp: '2024-02-16 10:13', action: 'Phone number verified', user: clientName },
            { timestamp: '2024-02-16 10:15', action: 'Contact details section completed', user: clientName }
          ],
          riskAssessment: {
            level: 'Low',
            factors: [
              'Valid Australian email address',
              'Australian mobile number verified',
              'Residential address in metropolitan area',
              'No adverse indicators found'
            ]
          }
        };

      case 'Entity Details':
        return {
          title: clientType === 'Company' ? 'Company Details Verification' : 'Entity Details Verification',
          status: 'Complete',
          icon: Building,
          color: 'green',
          sections: clientType === 'Company' ? [
            {
              heading: 'Company Information',
              items: [
                { label: 'Company Name', value: clientName, verified: true },
                { label: 'ABN', value: '12 345 678 901', verified: true },
                { label: 'ACN', value: '123 456 789', verified: true },
                { label: 'Company Type', value: 'Proprietary Company', verified: true },
                { label: 'Registration Date', value: '15 January 2018', verified: true }
              ]
            },
            {
              heading: 'Registered Office',
              items: [
                { label: 'Street Address', value: '456 Business Avenue', verified: true },
                { label: 'Suburb/City', value: 'Melbourne', verified: true },
                { label: 'State', value: 'Victoria', verified: true },
                { label: 'Postcode', value: '3001', verified: true }
              ]
            },
            {
              heading: 'ASIC Verification',
              items: [
                { label: 'ASIC Status', value: 'Registered', verified: true },
                { label: 'Last ASIC Check', value: '2024-02-16 10:45', verified: true },
                { label: 'Directors', value: '3 directors registered', verified: true },
                { label: 'Share Structure', value: 'Verified via ASIC extract', verified: true }
              ]
            }
          ] : [
            {
              heading: 'Personal Details',
              items: [
                { label: 'Full Name', value: clientName, verified: true },
                { label: 'Date of Birth', value: '15 March 1985', verified: true },
                { label: 'Place of Birth', value: 'Melbourne, Australia', verified: true },
                { label: 'Nationality', value: 'Australian', verified: true },
                { label: 'Occupation', value: 'Software Engineer', verified: true }
              ]
            },
            {
              heading: 'Tax Information',
              items: [
                { label: 'TFN Provided', value: 'Yes (redacted)', verified: true },
                { label: 'Tax Residency', value: 'Australian Resident', verified: true }
              ]
            }
          ],
          documents: clientType === 'Company' ? [
            { name: 'ASIC Extract.pdf', size: '245 KB', uploadDate: '2024-02-16 10:45', status: 'Verified' }
          ] : [],
          auditTrail: [
            { timestamp: '2024-02-16 10:20', action: 'Entity details form opened', user: clientName },
            { timestamp: '2024-02-16 10:35', action: clientType === 'Company' ? 'ABN/ACN entered and verified via ABR lookup' : 'Personal details entered', user: clientName },
            { timestamp: '2024-02-16 10:40', action: clientType === 'Company' ? 'ASIC extract uploaded' : 'TFN declaration completed', user: clientName },
            { timestamp: '2024-02-16 10:45', action: 'Entity details section completed', user: clientName }
          ],
          riskAssessment: {
            level: 'Low',
            factors: clientType === 'Company' ? [
              'ASIC registered company in good standing',
              'ABN/ACN verified against official registers',
              'Directors information matches ASIC records',
              'No adverse ASIC notices'
            ] : [
              'Australian citizen with verified identity',
              'Tax residency confirmed',
              'No adverse indicators',
              'Occupation matches expected profile'
            ]
          }
        };

      case 'Identity Verification':
        return {
          title: 'Identity Verification (GreenID)',
          status: 'Complete',
          icon: Shield,
          color: 'green',
          sections: [
            {
              heading: 'Verification Method',
              items: [
                { label: 'Provider', value: 'InfoTrack - GreenID', verified: true },
                { label: 'Verification Type', value: 'Electronic Identity Verification (EIV)', verified: true },
                { label: 'Verification Date', value: '2024-02-16 14:20', verified: true },
                { label: 'Overall Result', value: 'VERIFIED - High Confidence', verified: true }
              ]
            },
            {
              heading: 'Documents Verified',
              items: [
                { label: 'Passport', value: 'Australian Passport N1234567', verified: true },
                { label: 'Passport Status', value: 'Valid - Expires 2028', verified: true },
                { label: 'Driver License', value: 'VIC License 12345678', verified: true },
                { label: 'License Status', value: 'Valid - Expires 2027', verified: true }
              ]
            },
            {
              heading: 'Biometric Checks',
              items: [
                { label: 'Document Face Match', value: 'Passed (98.5% confidence)', verified: true },
                { label: 'Live Selfie Check', value: 'Passed - Genuine person detected', verified: true },
                { label: 'Document Authenticity', value: 'Passed - No tampering detected', verified: true }
              ]
            },
            {
              heading: 'Database Verifications',
              items: [
                { label: 'DVS (Document Verification Service)', value: 'Passed', verified: true },
                { label: 'Electoral Roll', value: 'Match Found', verified: true },
                { label: 'Credit Bureau', value: 'Match Confirmed', verified: true },
                { label: 'Watchlist Screening', value: 'No Matches', verified: true }
              ]
            }
          ],
          documents: [
            { name: 'Passport.pdf', size: '1.2 MB', uploadDate: '2024-02-16 14:15', status: 'Verified' },
            { name: 'Drivers-License.pdf', size: '856 KB', uploadDate: '2024-02-16 14:17', status: 'Verified' },
            { name: 'GreenID-Report.pdf', size: '342 KB', uploadDate: '2024-02-16 14:20', status: 'System Generated' }
          ],
          auditTrail: [
            { timestamp: '2024-02-16 14:10', action: 'Identity verification initiated', user: clientName },
            { timestamp: '2024-02-16 14:15', action: 'Passport document uploaded', user: clientName },
            { timestamp: '2024-02-16 14:16', action: 'Live selfie captured', user: clientName },
            { timestamp: '2024-02-16 14:17', action: 'Driver license uploaded', user: clientName },
            { timestamp: '2024-02-16 14:18', action: 'Submitted to GreenID for verification', user: 'System' },
            { timestamp: '2024-02-16 14:20', action: 'GreenID verification PASSED', user: 'InfoTrack' },
            { timestamp: '2024-02-16 14:20', action: 'Identity verification completed', user: 'System' }
          ],
          riskAssessment: {
            level: 'Low',
            factors: [
              'High confidence identity verification (98.5%)',
              'Multiple official documents verified',
              'DVS check passed against government databases',
              'No PEP or sanctions matches',
              'No adverse media findings',
              'Biometric checks passed'
            ]
          }
        };

      case 'Documents':
        return {
          title: 'Supporting Documents',
          status: 'Complete',
          icon: FileText,
          color: 'green',
          sections: [
            {
              heading: 'Required Documents',
              items: [
                { label: 'Proof of Address', value: 'Utility Bill - Verified', verified: true },
                { label: 'Bank Statement', value: '3 months - Verified', verified: true },
                { label: 'Source of Wealth', value: 'Employment Letter - Verified', verified: true }
              ]
            },
            {
              heading: 'Document Quality Check',
              items: [
                { label: 'Legibility', value: 'All documents clear and readable', verified: true },
                { label: 'Authenticity', value: 'No signs of tampering', verified: true },
                { label: 'Currency', value: 'All documents within 3 months', verified: true },
                { label: 'Completeness', value: 'All required information visible', verified: true }
              ]
            }
          ],
          documents: [
            { name: 'Bank-Statement.pdf', size: '2.1 MB', uploadDate: '2024-02-17 11:15', status: 'Verified' },
            { name: 'Proof-of-Address.pdf', size: '1.5 MB', uploadDate: '2024-02-17 11:18', status: 'Verified' },
            { name: 'Employment-Letter.pdf', size: '456 KB', uploadDate: '2024-02-17 11:20', status: 'Verified' }
          ],
          auditTrail: [
            { timestamp: '2024-02-17 11:10', action: 'Document upload section opened', user: clientName },
            { timestamp: '2024-02-17 11:15', action: 'Bank statement uploaded', user: clientName },
            { timestamp: '2024-02-17 11:16', action: 'Bank statement reviewed', user: 'Emma Wilson' },
            { timestamp: '2024-02-17 11:18', action: 'Proof of address uploaded', user: clientName },
            { timestamp: '2024-02-17 11:19', action: 'Address document verified', user: 'Emma Wilson' },
            { timestamp: '2024-02-17 11:20', action: 'Employment letter uploaded', user: clientName },
            { timestamp: '2024-02-17 11:22', action: 'All documents approved', user: 'Emma Wilson' }
          ],
          riskAssessment: {
            level: 'Low',
            factors: [
              'All required documents provided',
              'Documents are current and valid',
              'Address matches verification records',
              'Employment and income source verified',
              'No inconsistencies detected'
            ]
          }
        };

      case 'Beneficial Ownership':
        return {
          title: clientType === 'Company' ? 'Ultimate Beneficial Ownership' : 'Beneficial Ownership',
          status: clientType === 'Company' ? 'Complete' : 'Not Applicable',
          icon: Users,
          color: clientType === 'Company' ? 'green' : 'gray',
          sections: clientType === 'Company' ? [
            {
              heading: 'Ownership Structure',
              items: [
                { label: 'UBO 1', value: 'John Smith - 60% ownership', verified: true },
                { label: 'UBO 2', value: 'Mary Johnson - 40% ownership', verified: true },
                { label: 'Control Threshold', value: '25%+ ownership verified', verified: true }
              ]
            },
            {
              heading: 'UBO Verification',
              items: [
                { label: 'John Smith ID', value: 'Verified via Passport', verified: true },
                { label: 'Mary Johnson ID', value: 'Verified via Driver License', verified: true },
                { label: 'PEP Screening', value: 'No matches found', verified: true },
                { label: 'Sanctions Screening', value: 'Clear - No matches', verified: true }
              ]
            }
          ] : [
            {
              heading: 'Individual Client',
              items: [
                { label: 'Status', value: 'Not applicable - Individual client', verified: false },
                { label: 'Beneficial Owner', value: clientName, verified: true }
              ]
            }
          ],
          documents: clientType === 'Company' ? [
            { name: 'Ownership-Structure.pdf', size: '1.8 MB', uploadDate: '2024-02-17 15:25', status: 'Verified' },
            { name: 'UBO-Declaration-Form.pdf', size: '234 KB', uploadDate: '2024-02-17 15:28', status: 'Signed' },
            { name: 'John-Smith-Passport.pdf', size: '1.1 MB', uploadDate: '2024-02-17 15:30', status: 'Verified' }
          ] : [],
          auditTrail: clientType === 'Company' ? [
            { timestamp: '2024-02-17 15:00', action: 'UBO section initiated', user: clientName },
            { timestamp: '2024-02-17 15:20', action: 'Ownership structure diagram uploaded', user: clientName },
            { timestamp: '2024-02-17 15:25', action: 'UBO declarations signed', user: clientName },
            { timestamp: '2024-02-17 15:28', action: 'UBO 1 documents uploaded', user: clientName },
            { timestamp: '2024-02-17 15:30', action: 'All UBOs verified and screened', user: 'Emma Wilson' }
          ] : [
            { timestamp: '2024-02-17 15:00', action: 'Individual client - UBO section skipped', user: 'System' }
          ],
          riskAssessment: {
            level: clientType === 'Company' ? 'Low' : 'N/A',
            factors: clientType === 'Company' ? [
              'Clear ownership structure identified',
              'All UBOs holding 25%+ verified',
              'No PEP or sanctions matches',
              'No complex corporate structures',
              'Australian residents'
            ] : [
              'Individual client - beneficial ownership is self'
            ]
          }
        };

      case 'Declarations':
        return {
          title: 'Legal Declarations & Attestations',
          status: 'Complete',
          icon: CheckCircle,
          color: 'green',
          sections: [
            {
              heading: 'Signed Declarations',
              items: [
                { label: 'Terms & Conditions', value: 'Accepted and signed', verified: true },
                { label: 'Privacy Policy', value: 'Acknowledged and agreed', verified: true },
                { label: 'AML/CTF Agreement', value: 'Signed and dated', verified: true },
                { label: 'Accuracy Declaration', value: 'Confirmed all information true and correct', verified: true }
              ]
            },
            {
              heading: 'Specific Declarations',
              items: [
                { label: 'PEP Declaration', value: 'Not a Politically Exposed Person', verified: true },
                { label: 'Source of Funds', value: 'Declared as employment income', verified: true },
                { label: 'Purpose of Service', value: 'Personal accounting services', verified: true },
                { label: 'Tax Residency', value: 'Australian tax resident', verified: true }
              ]
            },
            {
              heading: 'Consent & Authorization',
              items: [
                { label: 'Data Processing', value: 'Consent provided', verified: true },
                { label: 'Credit Checks', value: 'Authorized', verified: true },
                { label: 'Information Sharing', value: 'Consent for AUSTRAC reporting', verified: true },
                { label: 'Digital Signature', value: 'Valid electronic signature', verified: true }
              ]
            }
          ],
          documents: [
            { name: 'Signed-Declaration.pdf', size: '567 KB', uploadDate: '2024-02-17 16:00', status: 'Signed & Certified' },
            { name: 'Terms-and-Conditions.pdf', size: '234 KB', uploadDate: '2024-02-17 16:00', status: 'Accepted' }
          ],
          auditTrail: [
            { timestamp: '2024-02-17 15:45', action: 'Declarations section opened', user: clientName },
            { timestamp: '2024-02-17 15:50', action: 'Terms & Conditions reviewed', user: clientName },
            { timestamp: '2024-02-17 15:55', action: 'All declarations read and acknowledged', user: clientName },
            { timestamp: '2024-02-17 15:58', action: 'Electronic signature applied', user: clientName },
            { timestamp: '2024-02-17 16:00', action: 'Final declarations signed', user: clientName },
            { timestamp: '2024-02-17 16:00', action: 'KYC onboarding completed', user: 'System' }
          ],
          riskAssessment: {
            level: 'Low',
            factors: [
              'All required declarations signed',
              'No PEP status declared',
              'Source of funds clearly stated',
              'Full consent and authorization provided',
              'Legal capacity to contract confirmed'
            ]
          }
        };

      case 'Sanctions, PEP & Adverse Media Screening':
        return {
          title: 'Sanctions, PEP & Adverse Media Screening',
          status: 'Complete',
          icon: Shield,
          color: 'green',
          sections: [
            {
              heading: 'Sanctions Screening (DFAT)',
              items: [
                { label: 'Client Name', value: 'No matches found', verified: true },
                { label: 'Directors (if applicable)', value: 'All clear - No matches', verified: true },
                { label: 'Beneficial Owners', value: 'All clear - No matches', verified: true },
                { label: 'DFAT Consolidated List', value: 'Screened successfully', verified: true }
              ]
            },
            {
              heading: 'PEP Screening',
              items: [
                { label: 'Domestic PEP Check', value: 'No matches', verified: true },
                { label: 'Foreign PEP Check', value: 'No matches', verified: true },
                { label: 'RCA (Relative/Close Associate)', value: 'No associations found', verified: true },
                { label: 'PEP Database', value: 'WorldCheck screened', verified: true }
              ]
            },
            {
              heading: 'Adverse Media',
              items: [
                { label: 'Financial Crime', value: 'No adverse findings', verified: true },
                { label: 'Money Laundering', value: 'No adverse findings', verified: true },
                { label: 'Terrorism Financing', value: 'No adverse findings', verified: true },
                { label: 'Media Scan Date', value: '2024-02-16', verified: true }
              ]
            }
          ],
          documents: [
            { name: 'Screening-Report.pdf', size: '456 KB', uploadDate: '2024-02-16 14:25', status: 'System Generated' },
            { name: 'DFAT-Check.pdf', size: '234 KB', uploadDate: '2024-02-16 14:25', status: 'Verified' }
          ],
          auditTrail: [
            { timestamp: '2024-02-16 14:21', action: 'Screening initiated automatically', user: 'Compliance System' },
            { timestamp: '2024-02-16 14:22', action: 'DFAT sanctions list screened', user: 'Compliance System' },
            { timestamp: '2024-02-16 14:23', action: 'PEP database screened', user: 'Compliance System' },
            { timestamp: '2024-02-16 14:24', action: 'Adverse media scan completed', user: 'Compliance System' },
            { timestamp: '2024-02-16 14:25', action: 'All screenings PASSED - No matches', user: 'Compliance System' }
          ],
          riskAssessment: {
            level: 'Low',
            factors: [
              'No sanctions matches found',
              'No PEP or RCA status identified',
              'No adverse media findings',
              'All parties screened successfully',
              'Mandatory screening requirements met'
            ]
          }
        };

      case 'ML/TF Risk Assessment':
        return {
          title: 'Money Laundering & Terrorism Financing Risk Assessment',
          status: 'Complete',
          icon: Shield,
          color: 'green',
          sections: [
            {
              heading: 'Client Risk Factors',
              items: [
                { label: 'Client Type', value: clientType + ' - Low risk', verified: true },
                { label: 'Ownership Structure', value: 'Simple structure - Low complexity', verified: true },
                { label: 'Countries Involved', value: 'Australia only - Low risk', verified: true },
                { label: 'Delivery Channel', value: 'Face-to-face onboarding - Low risk', verified: true }
              ]
            },
            {
              heading: 'Service Risk Factors',
              items: [
                { label: 'Nature of Service', value: 'Standard accounting - Low risk', verified: true },
                { label: 'Transaction Profile', value: 'Predictable, routine transactions', verified: true },
                { label: 'Expected Activity', value: 'Aligns with business profile', verified: true },
                { label: 'Service Complexity', value: 'Standard CDD required', verified: true }
              ]
            },
            {
              heading: 'Risk Indicators',
              items: [
                { label: 'PEP Status', value: 'Not a PEP - Low risk', verified: true },
                { label: 'Sanctions Match', value: 'No matches - Low risk', verified: true },
                { label: 'Adverse Media', value: 'No findings - Low risk', verified: true },
                { label: 'Geographic Risk', value: 'Australian resident - Low risk', verified: true }
              ]
            },
            {
              heading: 'Final Risk Rating',
              items: [
                { label: 'Overall ML/TF Risk', value: 'LOW', verified: true },
                { label: 'CDD Level Required', value: 'Standard CDD', verified: true },
                { label: 'Enhanced CDD Required', value: 'No', verified: true },
                { label: 'Assessed By', value: 'Emma Wilson', verified: true }
              ]
            }
          ],
          documents: [
            { name: 'Risk-Assessment.pdf', size: '789 KB', uploadDate: '2024-02-16 14:30', status: 'Approved' }
          ],
          auditTrail: [
            { timestamp: '2024-02-16 14:26', action: 'Risk assessment initiated', user: 'Emma Wilson' },
            { timestamp: '2024-02-16 14:27', action: 'Client factors evaluated', user: 'Emma Wilson' },
            { timestamp: '2024-02-16 14:28', action: 'Service factors assessed', user: 'Emma Wilson' },
            { timestamp: '2024-02-16 14:29', action: 'Risk indicators reviewed', user: 'Emma Wilson' },
            { timestamp: '2024-02-16 14:30', action: 'Final rating: LOW - Standard CDD approved', user: 'Emma Wilson' }
          ],
          riskAssessment: {
            level: 'Low',
            factors: [
              'All risk factors evaluated as low',
              'No high-risk indicators present',
              'Standard CDD appropriate',
              'No enhanced measures required',
              'Within firm risk appetite'
            ]
          }
        };

      case 'Enhanced CDD':
        return {
          title: 'Enhanced Customer Due Diligence',
          status: 'Not Required',
          icon: Shield,
          color: 'gray',
          sections: [
            {
              heading: 'ECDD Trigger Assessment',
              items: [
                { label: 'Foreign PEP', value: 'No', verified: true },
                { label: 'High-Risk Jurisdiction', value: 'No', verified: true },
                { label: 'Complex Structure', value: 'No', verified: true },
                { label: 'Suspicious Indicators', value: 'None identified', verified: true }
              ]
            },
            {
              heading: 'Risk Appetite Check',
              items: [
                { label: 'Within Risk Appetite', value: 'Yes - Standard CDD sufficient', verified: true },
                { label: 'Senior Manager Approval', value: 'Not required for low risk', verified: true }
              ]
            }
          ],
          documents: [],
          auditTrail: [
            { timestamp: '2024-02-16 14:30', action: 'ECDD assessment completed', user: 'Emma Wilson' },
            { timestamp: '2024-02-16 14:30', action: 'Client assessed as LOW risk - ECDD not required', user: 'Emma Wilson' }
          ],
          riskAssessment: {
            level: 'Low',
            factors: [
              'No ECDD triggers identified',
              'Standard CDD is appropriate',
              'Client within normal risk appetite',
              'No additional measures required'
            ]
          }
        };

      case 'Ongoing Monitoring (OCDD)':
        return {
          title: 'Ongoing Customer Due Diligence (OCDD)',
          status: 'Active',
          icon: Shield,
          color: 'blue',
          sections: [
            {
              heading: 'Re-Screening Schedule',
              items: [
                { label: 'Sanctions Re-Screening', value: 'Quarterly (Next: May 2024)', verified: true },
                { label: 'PEP Re-Screening', value: 'Quarterly (Next: May 2024)', verified: true },
                { label: 'Adverse Media Monitoring', value: 'Quarterly (Next: May 2024)', verified: true },
                { label: 'Last Screening Date', value: '2024-02-16', verified: true }
              ]
            },
            {
              heading: 'Change Monitoring',
              items: [
                { label: 'Ownership Changes', value: 'Monitoring active', verified: true },
                { label: 'Director Changes', value: 'Monitoring active (if applicable)', verified: true },
                { label: 'Address Changes', value: 'Monitoring active', verified: true },
                { label: 'Behavioural Monitoring', value: 'Unusual activity alerts enabled', verified: true }
              ]
            },
            {
              heading: 'Review Cycle',
              items: [
                { label: 'Risk Level', value: 'LOW', verified: true },
                { label: 'Review Frequency', value: 'Annual CDD refresh', verified: true },
                { label: 'Next Full Review', value: 'February 2025', verified: true },
                { label: 'Interim Triggers', value: 'Material change, suspicion, new service', verified: true }
              ]
            }
          ],
          documents: [],
          auditTrail: [
            { timestamp: '2024-02-17 16:05', action: 'OCDD monitoring activated', user: 'Compliance System' },
            { timestamp: '2024-02-17 16:05', action: 'Quarterly screening schedule set', user: 'Compliance System' },
            { timestamp: '2024-02-17 16:05', action: 'Change monitoring enabled', user: 'Compliance System' }
          ],
          riskAssessment: {
            level: 'Low',
            factors: [
              'Ongoing monitoring in place',
              'Automated re-screening enabled',
              'Change detection active',
              'Review cycle appropriate for risk level',
              'Alert system functioning'
            ]
          }
        };

      case 'Record Keeping (7 Years)':
        return {
          title: 'Record Keeping & Retention (7 Years)',
          status: 'Compliant',
          icon: FileText,
          color: 'green',
          sections: [
            {
              heading: 'Records Archived',
              items: [
                { label: 'CDD Records', value: 'All verification documents stored', verified: true },
                { label: 'Verification Evidence', value: 'Identity & address proofs retained', verified: true },
                { label: 'Screening Logs', value: 'All screening reports archived', verified: true },
                { label: 'Risk Assessments', value: 'ML/TF assessment retained', verified: true }
              ]
            },
            {
              heading: 'Retention Compliance',
              items: [
                { label: 'Retention Period', value: '7 years from end of relationship', verified: true },
                { label: 'Retention Until', value: '2031 (minimum)', verified: true },
                { label: 'Storage Location', value: 'Secure encrypted database', verified: true },
                { label: 'Quick Retrieval', value: 'Enabled - AUSTRAC compliant', verified: true }
              ]
            },
            {
              heading: 'Audit Capability',
              items: [
                { label: 'Audit Trail', value: 'Complete timeline maintained', verified: true },
                { label: 'Version Control', value: 'All document versions retained', verified: true },
                { label: 'Access Logs', value: 'All access recorded', verified: true },
                { label: 'Integrity Checks', value: 'Regular validation performed', verified: true }
              ]
            }
          ],
          documents: [],
          auditTrail: [
            { timestamp: '2024-02-17 16:10', action: 'All CDD records archived', user: 'System' },
            { timestamp: '2024-02-17 16:10', action: 'Retention period set: 7 years', user: 'System' },
            { timestamp: '2024-02-17 16:10', action: 'Record keeping compliance confirmed', user: 'System' }
          ],
          riskAssessment: {
            level: 'Low',
            factors: [
              'All required records retained',
              '7-year retention period set',
              'Quick retrieval capability confirmed',
              'AUSTRAC requirements met',
              'Secure storage ensured'
            ]
          }
        };

      default:
        return {
          title: 'Details Not Available',
          status: 'Unknown',
          icon: FileText,
          color: 'gray',
          sections: [],
          documents: [],
          auditTrail: [],
          riskAssessment: { level: 'Unknown', factors: [] }
        };
    }
  };

  const data = getDetailedInfo();
  const Icon = data.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`p-6 border-b border-white/10 bg-gradient-to-r from-${data.color}-600 to-${data.color}-500 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center`}>
                <Icon className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{data.title}</h2>
                <p className="text-lg opacity-90">{clientName} • {itemName}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <XCircle className="w-7 h-7" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mt-4">
            <span className={`px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full uppercase inline-flex items-center gap-2`}>
              {data.status === 'Complete' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              {data.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Data Sections */}
          {data.sections.map((section, idx) => (
            <div key={idx} className="bg-white border border-white/10 rounded-lg p-5">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-${data.color}-600`} />
                {section.heading}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <p className="text-xs text-slate-300 mb-1">{item.label}</p>
                      <p className="font-semibold text-slate-100">{item.value}</p>
                    </div>
                    {item.verified && (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 ml-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Documents */}
          {data.documents.length > 0 && (
            <div className="bg-white border border-white/10 rounded-lg p-5">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Attached Documents
              </h3>
              <div className="space-y-3">
                {data.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-400" />
                      <div>
                        <p className="font-bold text-slate-100">{doc.name}</p>
                        <p className="text-sm text-slate-300">{doc.size} • Uploaded {doc.uploadDate}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          doc.status === 'Verified' ? 'bg-green-500/15 text-green-300' :
                          doc.status === 'Signed' || doc.status === 'Signed & Certified' ? 'bg-purple-500/15 text-purple-300' :
                          'bg-white/10 text-slate-300'
                        } font-semibold mt-1 inline-block`}>
                          {doc.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          <div className={`border-2 border-${data.riskAssessment.level === 'Low' ? 'green' : data.riskAssessment.level === 'Medium' ? 'yellow' : 'gray'}-200 rounded-lg p-5 bg-${data.riskAssessment.level === 'Low' ? 'green' : data.riskAssessment.level === 'Medium' ? 'yellow' : 'gray'}-50`}>
            <div className="flex items-center gap-3 mb-4">
              <Shield className={`w-6 h-6 text-${data.riskAssessment.level === 'Low' ? 'green' : data.riskAssessment.level === 'Medium' ? 'yellow' : 'gray'}-600`} />
              <h3 className="text-lg font-bold text-slate-100">Risk Assessment</h3>
              <span className={`px-3 py-1 bg-${data.riskAssessment.level === 'Low' ? 'green' : data.riskAssessment.level === 'Medium' ? 'yellow' : 'gray'}-600 text-white text-sm font-bold rounded-full uppercase ml-auto`}>
                {data.riskAssessment.level} Risk
              </span>
            </div>
            <ul className="space-y-2">
              {data.riskAssessment.factors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-100">{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Audit Trail */}
          {data.auditTrail.length > 0 && (
            <div className="bg-white border border-white/10 rounded-lg p-5">
              <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Audit Trail
              </h3>
              <div className="space-y-3">
                {data.auditTrail.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-100">{event.action}</p>
                      <p className="text-sm text-slate-300">{event.user} • {event.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5 flex gap-3">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Download className="w-5 h-5 mr-2" />
            Export Full Report
          </Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
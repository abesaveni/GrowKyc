import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  FileSearch, 
  Building2, 
  Briefcase,
  Database,
  FileText
} from 'lucide-react';

interface CreditPackSectionProps {
  infoTrackChecksRun: {
    titleSearch: boolean;
    ownership: boolean;
    encumbrances: boolean;
    zoning: boolean;
    valuation: boolean;
    identity: boolean;
    sanctions: boolean;
    pep: boolean;
  };
  propertySearchStatus: string;
  kycStatus: string;
  formData: any;
}

export function CreditPackSection({ 
  infoTrackChecksRun, 
  propertySearchStatus, 
  kycStatus, 
  formData 
}: CreditPackSectionProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            Complete Credit Pack Assembly
          </CardTitle>
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/15 border border-purple-300 rounded-lg">
            <FileText className="w-4 h-4 text-purple-300" />
            <span className="text-xs font-bold text-purple-300">COMPREHENSIVE</span>
          </div>
        </div>
        <p className="text-sm text-purple-300 mt-2">
          All InfoTrack documents and third-party documents assembled with data redaction as per Privacy Act 1988 and OAIC guidelines
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Privacy & Redaction Notice */}
        <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-yellow-300 text-sm mb-2">🔒 Data Redaction & Privacy Compliance</p>
              <p className="text-xs text-yellow-300 mb-2">
                All documents in this credit pack will be automatically redacted to comply with:
              </p>
              <div className="grid md:grid-cols-3 gap-2 text-xs">
                <div className="bg-white/60 p-2 rounded border border-yellow-300">
                  <strong className="text-yellow-300">Privacy Act 1988</strong>
                  <p className="text-yellow-300">Australian Privacy Principles (APPs) - minimum necessary disclosure</p>
                </div>
                <div className="bg-white/60 p-2 rounded border border-yellow-300">
                  <strong className="text-yellow-300">OAIC Guidelines</strong>
                  <p className="text-yellow-300">Office of Australian Information Commissioner data handling standards</p>
                </div>
                <div className="bg-white/60 p-2 rounded border border-yellow-300">
                  <strong className="text-yellow-300">AML/CTF Act</strong>
                  <p className="text-yellow-300">Record keeping obligations with appropriate redaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: InfoTrack Generated Documents */}
        <div>
          <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-indigo-400" />
            InfoTrack Generated Documents (Auto-Attached)
          </h4>
          <div className="space-y-2">
            {[
              { 
                name: 'Title Search Report', 
                status: infoTrackChecksRun.titleSearch,
                redaction: 'None required',
                description: 'Complete title particulars, lot/plan, registered proprietor'
              },
              { 
                name: 'Ownership Verification Report', 
                status: infoTrackChecksRun.ownership,
                redaction: 'None required',
                description: 'Registered owner details, ownership type, tenure'
              },
              { 
                name: 'Encumbrances & Caveats Report', 
                status: infoTrackChecksRun.encumbrances,
                redaction: 'Third-party personal details',
                description: 'Mortgages, caveats, easements, covenants'
              },
              { 
                name: 'Zoning & Planning Certificate', 
                status: infoTrackChecksRun.zoning,
                redaction: 'None required',
                description: 'Zoning classification, planning controls, overlays'
              },
              { 
                name: 'Environmental Risk Assessment', 
                status: propertySearchStatus === 'found',
                redaction: 'None required',
                description: 'Flood risk, bushfire risk, contamination status'
              },
              { 
                name: 'RP Data AVM Valuation Report', 
                status: infoTrackChecksRun.valuation,
                redaction: 'None required',
                description: `Automated valuation: ${formData.rpDataAvmMid ? '$' + parseInt(formData.rpDataAvmMid).toLocaleString() : 'Pending'} (Low: ${formData.rpDataAvmLow ? '$' + parseInt(formData.rpDataAvmLow).toLocaleString() : 'N/A'}, High: ${formData.rpDataAvmHigh ? '$' + parseInt(formData.rpDataAvmHigh).toLocaleString() : 'N/A'})`
              },
              { 
                name: 'Identity Verification Report (GreenID)', 
                status: infoTrackChecksRun.identity,
                redaction: 'ID numbers, DOB partially masked',
                description: 'Electronic identity verification results'
              },
              { 
                name: 'Sanctions Screening Report', 
                status: infoTrackChecksRun.sanctions,
                redaction: 'None (results only)',
                description: 'DFAT, UN, OFAC sanctions list screening'
              },
              { 
                name: 'PEP & RCA Screening Report', 
                status: infoTrackChecksRun.pep,
                redaction: 'None (results only)',
                description: 'Politically Exposed Persons & relatives check'
              },
              { 
                name: 'AML/CTF Compliance Summary', 
                status: kycStatus === 'clear',
                redaction: 'Source of funds details',
                description: 'AUSTRAC compliance verification summary'
              }
            ].map((doc, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-lg border-2 ${
                  doc.status 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {doc.status ? (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                      <p className={`text-sm font-semibold ${
                        doc.status ? 'text-green-300' : 'text-slate-300'
                      }`}>
                        {doc.name}
                      </p>
                    </div>
                    <p className="text-xs text-slate-300 ml-6">{doc.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xs px-2 py-1 rounded ${
                      doc.status 
                        ? 'bg-green-500/15 text-green-300 font-medium' 
                        : 'bg-white/5 text-slate-300'
                    }`}>
                      {doc.status ? '✓ Attached' : 'Pending'}
                    </div>
                    <div className="text-xs text-purple-300 mt-1 font-medium">
                      🔒 {doc.redaction}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Lender Provided Documents */}
        <div>
          <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            Lender Provided Documents (From Step 4)
          </h4>
          <div className="space-y-2">
            {[
              { 
                name: 'Original Loan Agreement', 
                status: formData.originalLoanAgreementUploaded,
                redaction: 'None required',
                required: true
              },
              { 
                name: 'Loan Variations & Amendments', 
                status: formData.loanVariationsUploaded,
                redaction: 'None required',
                required: true
              },
              { 
                name: 'Bank Statements (Last 12 months)', 
                status: formData.bankStatementsUploaded,
                redaction: 'Non-loan transactions',
                required: true
              },
              { 
                name: 'Payout Letter/Statement', 
                status: formData.payoutLetterUploaded,
                redaction: 'None required',
                required: true
              },
              { 
                name: 'Formal Approval Documentation', 
                status: formData.formalApprovalUploaded,
                redaction: 'None required',
                required: true
              },
              { 
                name: 'Registered Mortgage Documents', 
                status: formData.mortgageDocumentsUploaded,
                redaction: 'None required',
                required: true
              },
              { 
                name: 'Security Documents', 
                status: formData.securityDocumentsUploaded,
                redaction: 'Third-party guarantor details',
                required: true
              },
              { 
                name: 'Insurance Certificate', 
                status: formData.insuranceCertificateUploaded,
                redaction: 'Policy holder personal details',
                required: false
              },
              { 
                name: 'Loan Account History', 
                status: formData.loanAccountHistoryUploaded,
                redaction: 'None required',
                required: true
              },
              { 
                name: 'Arrears Summary & Default Notices', 
                status: formData.arrearsSummaryUploaded,
                redaction: 'None required',
                required: true
              },
              { 
                name: 'Legal Advice (Signed)', 
                status: formData.legalAdviceSignedUploaded,
                redaction: 'Legal privilege claims',
                required: true
              },
              { 
                name: 'Privacy Consent (Signed)', 
                status: formData.privacyConsentSignedUploaded,
                redaction: 'None required',
                required: true
              }
            ].map((doc, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-lg border-2 ${
                  doc.status 
                    ? 'bg-blue-500/10 border-blue-500/30' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {doc.status ? (
                        <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                      <p className={`text-sm font-semibold ${
                        doc.status ? 'text-blue-300' : 'text-slate-300'
                      }`}>
                        {doc.name} {doc.required && <span className="text-red-400">*</span>}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xs px-2 py-1 rounded ${
                      doc.status 
                        ? 'bg-blue-500/15 text-blue-300 font-medium' 
                        : 'bg-white/5 text-slate-300'
                    }`}>
                      {doc.status ? '✓ Uploaded' : doc.required ? 'Required' : 'Optional'}
                    </div>
                    <div className="text-xs text-purple-300 mt-1 font-medium">
                      🔒 {doc.redaction}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Third-Party Documents */}
        <div>
          <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-teal-400" />
            Third-Party Professional Documents
          </h4>
          <div className="space-y-2">
            {[
              { 
                name: 'Independent Valuation Report', 
                provider: 'Licensed Valuer',
                redaction: 'Valuer personal details',
                status: formData.valuerName ? true : false
              },
              { 
                name: 'Legal Opinion/Advice', 
                provider: 'Borrower\'s Solicitor',
                redaction: 'Legal privilege claims',
                status: formData.borrowerLawyerName ? true : false
              },
              { 
                name: 'Lender\'s Legal Documentation', 
                provider: 'Lender\'s Solicitor',
                redaction: 'Legal privilege claims',
                status: formData.lenderLawyerName ? true : false
              },
              { 
                name: 'Real Estate Agent\'s Appraisal', 
                provider: 'Real Estate Agent',
                redaction: 'Agent personal details',
                status: formData.agentName ? true : false
              },
              { 
                name: 'Accounting/Financial Assessment', 
                provider: 'Accountant',
                redaction: 'Client confidential data',
                status: formData.accountantName ? true : false
              },
              { 
                name: 'Receiver\'s Report (if applicable)', 
                provider: 'Appointed Receiver',
                redaction: 'Third-party creditor details',
                status: formData.receiverAppointed === 'yes'
              },
              { 
                name: 'Trustee\'s Report (if applicable)', 
                provider: 'Bankruptcy Trustee',
                redaction: 'Creditor personal details',
                status: formData.trusteeAppointed === 'yes'
              }
            ].map((doc, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-lg border-2 ${
                  doc.status 
                    ? 'bg-teal-500/10 border-teal-500/30' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {doc.status ? (
                        <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                      <p className={`text-sm font-semibold ${
                        doc.status ? 'text-teal-300' : 'text-slate-300'
                      }`}>
                        {doc.name}
                      </p>
                    </div>
                    <p className="text-xs text-slate-300 ml-6">Provider: {doc.provider}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xs px-2 py-1 rounded ${
                      doc.status 
                        ? 'bg-teal-500/15 text-teal-300 font-medium' 
                        : 'bg-white/5 text-slate-300'
                    }`}>
                      {doc.status ? '✓ Available' : 'Pending'}
                    </div>
                    <div className="text-xs text-purple-300 mt-1 font-medium">
                      🔒 {doc.redaction}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Pack Generation Summary */}
        <div className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 border-2 border-purple-300 rounded-lg">
          <div className="flex items-start gap-3">
            <Database className="w-6 h-6 text-purple-300 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-purple-300 mb-2">📦 Complete Credit Pack Ready for Generation</p>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-semibold text-purple-300 mb-1">Included in Credit Pack:</p>
                  <ul className="space-y-1 text-purple-300">
                    <li>✓ All InfoTrack verification documents</li>
                    <li>✓ Complete lender documentation</li>
                    <li>✓ Third-party professional reports</li>
                    <li>✓ Compliance certification summary</li>
                    <li>✓ Document index with timestamps</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-purple-300 mb-1">Automatic Redactions Applied:</p>
                  <ul className="space-y-1 text-purple-300">
                    <li>🔒 Personal ID numbers (partial masking)</li>
                    <li>🔒 Date of birth (year only shown)</li>
                    <li>🔒 Bank account details (last 4 digits)</li>
                    <li>🔒 Third-party personal information</li>
                    <li>🔒 Legal privilege protected content</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 p-3 bg-white rounded border border-purple-300">
                <p className="text-xs text-purple-300">
                  <strong>Compliance Note:</strong> This credit pack meets all requirements under the Privacy Act 1988, 
                  OAIC guidelines, AML/CTF Act record-keeping obligations, ASIC lending standards, and AFSL documentation requirements. 
                  All redactions follow the principle of "minimum necessary disclosure" while maintaining audit trail integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

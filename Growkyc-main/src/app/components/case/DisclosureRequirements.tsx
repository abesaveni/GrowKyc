import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { 
  AlertCircle, 
  CheckCircle, 
  Shield,
  FileText,
  Download,
  Clock
} from 'lucide-react';

interface DisclosureRequirementsProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

export function DisclosureRequirements({ 
  formData, 
  onInputChange 
}: DisclosureRequirementsProps) {
  
  // Check completeness
  const allDisclosuresProvided = 
    formData.creditGuideProvided &&
    formData.quoteProvidedDisclosure &&
    formData.creditContractProvided &&
    formData.keyFactsSheetProvided &&
    formData.feesDisclosed;
  
  return (
    <div className="space-y-6">
      {/* Lender Licence Status */}
      <Card className="border-2 border-purple-300">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Step 1: Confirm Lender Licence Status (NCCP s29)
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            For regulated consumer credit, the lender must hold an Australian Credit Licence or be an authorised credit representative
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="lenderLicenceType">Lender Licence Type *</Label>
            <select
              id="lenderLicenceType"
              value={formData.lenderLicenceType || ''}
              onChange={(e) => onInputChange('lenderLicenceType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select...</option>
              <option value="acl_holder">Australian Credit Licence (ACL) Holder</option>
              <option value="acr">Authorised Credit Representative</option>
              <option value="adI">ADI (Authorised Deposit-taking Institution)</option>
              <option value="exempt">Exempt under NCCP</option>
              <option value="commercial">Commercial lending (outside NCCP)</option>
            </select>
          </div>

          {(formData.lenderLicenceType === 'acl_holder' || formData.lenderLicenceType === 'acr') && (
            <>
              <div>
                <Label htmlFor="aclNumber">Australian Credit Licence Number *</Label>
                <Input
                  id="aclNumber"
                  value={formData.aclNumber || ''}
                  onChange={(e) => onInputChange('aclNumber', e.target.value)}
                  placeholder="123456"
                />
              </div>
              <div>
                <Label htmlFor="aclHolderName">ACL Holder Name *</Label>
                <Input
                  id="aclHolderName"
                  value={formData.aclHolderName || ''}
                  onChange={(e) => onInputChange('aclHolderName', e.target.value)}
                  placeholder="ABC Lending Pty Ltd"
                />
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs text-purple-900">
                  <strong>✓ Verification:</strong> Check ASIC's Australian Credit Licence Register at 
                  <a href="https://connectonline.asic.gov.au" className="text-purple-700 underline ml-1" target="_blank" rel="noopener noreferrer">
                    connectonline.asic.gov.au
                  </a>
                </p>
              </div>
            </>
          )}

          {formData.lenderLicenceType === 'commercial' && (
            <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-700 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-yellow-900 mb-1">Commercial Lending (Outside NCCP)</p>
                  <p className="text-xs text-yellow-800">
                    While outside NCCP responsible lending obligations, misleading conduct laws still apply 
                    under ASIC Act 2001 s12DA and ACCC regulations. Ensure all representations are accurate.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disclosure Requirements */}
      <Card className="border-2 border-blue-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Step 5: Disclosure Requirements (NCCP Part 3-2)
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                All required disclosures must be provided before the borrower signs the credit contract
              </p>
            </div>
            {allDisclosuresProvided && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 border border-green-300 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-700" />
                <span className="text-xs font-bold text-green-900">All Provided</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Disclosure Checklist */}
          <div className="space-y-3">
            {[
              {
                id: 'creditGuideProvided',
                label: 'Credit Guide (NCCP s126)',
                description: 'Mandatory for ACL holders - must outline services, fees, complaints process',
                required: true
              },
              {
                id: 'quoteProvidedDisclosure',
                label: 'Quote / Fee Disclosure (NCCP s17)',
                description: 'All fees, charges, and credit costs must be clearly disclosed upfront',
                required: true
              },
              {
                id: 'creditProposalProvided',
                label: 'Credit Proposal Disclosure (if broker involved)',
                description: 'Required if a credit assistance provider (broker) is involved',
                required: false
              },
              {
                id: 'creditContractProvided',
                label: 'Credit Contract with Full Terms (NCCP s17)',
                description: 'Complete contract including interest rate, repayment schedule, all terms',
                required: true
              },
              {
                id: 'keyFactsSheetProvided',
                label: 'Key Facts Sheet (for home loans)',
                description: 'Required for residential mortgages - RG 209 Key Facts Sheet',
                required: true
              },
              {
                id: 'feesDisclosed',
                label: 'All Fees, Interest & Comparison Rate Disclosed',
                description: 'Includes application fee, ongoing fees, comparison rate, early exit fees',
                required: true
              }
            ].map((item) => (
              <div 
                key={item.id}
                className={`p-4 rounded-lg border-2 ${
                  formData[item.id] 
                    ? 'bg-green-50 border-green-200' 
                    : item.required 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="pt-1">
                    {formData[item.id] ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : item.required ? (
                      <Clock className="w-5 h-5 text-red-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData[item.id] || false}
                        onChange={(e) => onInputChange(item.id, e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className={`font-semibold text-sm ${
                        formData[item.id] ? 'text-green-900' : 'text-gray-900'
                      }`}>
                        {item.label}
                        {item.required && <span className="text-red-600 ml-1">*</span>}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 ml-6">{item.description}</p>
                    
                    {formData[item.id] && (
                      <div className="mt-2 ml-6 flex items-center gap-2">
                        <Label htmlFor={`${item.id}Date`} className="text-xs text-gray-600">
                          Date provided:
                        </Label>
                        <Input
                          id={`${item.id}Date`}
                          type="date"
                          value={formData[`${item.id}Date`] || ''}
                          onChange={(e) => onInputChange(`${item.id}Date`, e.target.value)}
                          className="w-40 text-xs"
                        />
                      </div>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>

          {/* Comparison Rate */}
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <Label htmlFor="disclosedInterestRate">Disclosed Interest Rate (% p.a.) *</Label>
              <Input
                id="disclosedInterestRate"
                type="number"
                step="0.01"
                value={formData.disclosedInterestRate || ''}
                onChange={(e) => onInputChange('disclosedInterestRate', e.target.value)}
                placeholder="6.50"
              />
            </div>
            <div>
              <Label htmlFor="comparisonRate">Comparison Rate (% p.a.) *</Label>
              <Input
                id="comparisonRate"
                type="number"
                step="0.01"
                value={formData.comparisonRate || ''}
                onChange={(e) => onInputChange('comparisonRate', e.target.value)}
                placeholder="6.75"
              />
              <p className="text-xs text-gray-600 mt-1">Must include all fees and charges</p>
            </div>
          </div>

          {/* Warning */}
          {!allDisclosuresProvided && (
            <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-700 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-900 mb-1">⚠️ Incomplete Disclosures</p>
                  <p className="text-xs text-red-800">
                    All required disclosures must be provided before the credit contract is signed. 
                    Failure to provide disclosures may result in ASIC enforcement action and the contract may be voidable.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hardship & Complaints */}
      <Card className="border-2 border-teal-300">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            Step 8: Hardship & Complaint Handling (NCCP Part 3-2A)
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Lender must have processes in place for hardship and complaints
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.idrProcessConfirmed || false}
                onChange={(e) => onInputChange('idrProcessConfirmed', e.target.checked)}
                className="w-4 h-4 mt-1"
              />
              <div>
                <span className="font-semibold text-sm text-gray-900">
                  Internal Dispute Resolution (IDR) Process *
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Lender has documented IDR process compliant with RG 165
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.afcaMemberConfirmed || false}
                onChange={(e) => onInputChange('afcaMemberConfirmed', e.target.checked)}
                className="w-4 h-4 mt-1"
              />
              <div>
                <span className="font-semibold text-sm text-gray-900">
                  AFCA Membership *
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Lender is a member of Australian Financial Complaints Authority (AFCA)
                </p>
                {formData.afcaMemberConfirmed && (
                  <div className="mt-2">
                    <Label htmlFor="afcaMemberNumber" className="text-xs">AFCA Member Number:</Label>
                    <Input
                      id="afcaMemberNumber"
                      value={formData.afcaMemberNumber || ''}
                      onChange={(e) => onInputChange('afcaMemberNumber', e.target.value)}
                      placeholder="12345"
                      className="w-40 mt-1"
                    />
                  </div>
                )}
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.hardshipPolicyConfirmed || false}
                onChange={(e) => onInputChange('hardshipPolicyConfirmed', e.target.checked)}
                className="w-4 h-4 mt-1"
              />
              <div>
                <span className="font-semibold text-sm text-gray-900">
                  Hardship Variation Rights (NCCP s72)
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Borrower informed of right to request hardship variation if circumstances change
                </p>
              </div>
            </label>
          </div>

          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-xs text-teal-900">
              <strong>📋 Note:</strong> Under NCCP s72-74, if a borrower experiences financial hardship, 
              they may request a variation to their credit contract. The lender must have a process 
              to consider and respond to hardship requests within 21 days.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

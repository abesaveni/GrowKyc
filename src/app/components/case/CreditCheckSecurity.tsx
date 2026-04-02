import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { 
  AlertCircle, 
  CheckCircle, 
  Shield,
  FileSearch,
  Clock,
  Home,
  AlertTriangle
} from 'lucide-react';

interface CreditCheckSecurityProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  onRunCreditCheck: () => void;
  creditCheckStatus: 'idle' | 'running' | 'complete' | 'flagged';
}

export function CreditCheckSecurity({ 
  formData, 
  onInputChange,
  onRunCreditCheck,
  creditCheckStatus
}: CreditCheckSecurityProps) {
  
  return (
    <div className="space-y-6">
      {/* Credit Check Requirements */}
      <Card className="border-2 border-indigo-300">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-indigo-600" />
            Step 4: Credit Check Requirements (NCCP & Privacy Act)
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Obtain credit report and review repayment history. Privacy Act 1988 applies to credit information collection.
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Privacy Consent */}
          <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-yellow-900 mb-1">Privacy Act 1988 Compliance</p>
                <p className="text-xs text-yellow-800 mb-2">
                  Before accessing credit information, the borrower must consent under the Privacy Act.
                  Credit reporting bodies (CRBs) can only provide data with valid consent.
                </p>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.creditCheckConsentObtained || false}
                    onChange={(e) => onInputChange('creditCheckConsentObtained', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-yellow-900">
                    Borrower consent obtained to access credit report *
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Credit Bureau Selection */}
          <div>
            <Label htmlFor="creditBureau">Credit Reporting Body (CRB) *</Label>
            <select
              id="creditBureau"
              value={formData.creditBureau || ''}
              onChange={(e) => onInputChange('creditBureau', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select...</option>
              <option value="equifax">Equifax</option>
              <option value="experian">Experian</option>
              <option value="illion">illion</option>
              <option value="multiple">Multiple bureaus</option>
            </select>
          </div>

          {/* Run Credit Check */}
          {creditCheckStatus === 'idle' && (
            <Button
              onClick={onRunCreditCheck}
              disabled={!formData.creditCheckConsentObtained}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              size="lg"
            >
              <FileSearch className="w-5 h-5 mr-2" />
              Run Credit Check
            </Button>
          )}

          {creditCheckStatus === 'running' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                <div>
                  <p className="font-semibold text-blue-900">Running Credit Check...</p>
                  <p className="text-sm text-blue-700">Accessing credit bureau data</p>
                </div>
              </div>
            </div>
          )}

          {creditCheckStatus === 'complete' && (
            <>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">✅ Credit Check Complete</p>
                    <p className="text-sm text-green-700">Credit report obtained and reviewed</p>
                  </div>
                </div>
              </div>

              {/* Credit Report Findings */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900">Credit Report Findings:</h4>
                
                <div>
                  <Label htmlFor="creditScore">Credit Score</Label>
                  <Input
                    id="creditScore"
                    type="number"
                    value={formData.creditScore || ''}
                    onChange={(e) => onInputChange('creditScore', e.target.value)}
                    placeholder="650"
                  />
                  <p className="text-xs text-gray-500 mt-1">Typical range: 300-850 (higher is better)</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numberOfDefaults">Number of Defaults</Label>
                    <Input
                      id="numberOfDefaults"
                      type="number"
                      value={formData.numberOfDefaults || '0'}
                      onChange={(e) => onInputChange('numberOfDefaults', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalDefaultAmount">Total Default Amount ($)</Label>
                    <Input
                      id="totalDefaultAmount"
                      type="number"
                      value={formData.totalDefaultAmount || '0'}
                      onChange={(e) => onInputChange('totalDefaultAmount', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="creditEnquiries">Credit Enquiries (last 12 months)</Label>
                    <Input
                      id="creditEnquiries"
                      type="number"
                      value={formData.creditEnquiries || '0'}
                      onChange={(e) => onInputChange('creditEnquiries', e.target.value)}
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="courtJudgements">Court Judgements</Label>
                    <Input
                      id="courtJudgements"
                      type="number"
                      value={formData.courtJudgements || '0'}
                      onChange={(e) => onInputChange('courtJudgements', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="adverseListings">Adverse Listings Details</Label>
                  <textarea
                    id="adverseListings"
                    value={formData.adverseListings || ''}
                    onChange={(e) => onInputChange('adverseListings', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    rows={3}
                    placeholder="List any defaults, judgements, or adverse information..."
                  />
                </div>

                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={formData.repaymentHistoryReviewed || false}
                    onChange={(e) => onInputChange('repaymentHistoryReviewed', e.target.checked)}
                    className="w-4 h-4 mt-1"
                  />
                  <div>
                    <span className="font-semibold text-sm text-gray-900">Repayment History Reviewed *</span>
                    <p className="text-xs text-gray-600">Comprehensive Consumer Credit (CCC) repayment history information reviewed</p>
                  </div>
                </label>
              </div>
            </>
          )}

          {creditCheckStatus === 'flagged' && (
            <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">⚠️ Adverse Credit Information Identified</p>
                  <p className="text-sm text-red-800 mt-1">
                    The credit report contains adverse information that requires enhanced assessment. 
                    Consider impact on responsible lending obligations.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mortgage / Security Requirements */}
      <Card className="border-2 border-rose-300">
        <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Home className="w-5 h-5 text-rose-600" />
            Step 7: Mortgage / Security Requirements (PPSA)
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            For secured lending, properly document security and register on appropriate registers
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="securityType">Security Type *</Label>
            <select
              id="securityType"
              value={formData.securityType || ''}
              onChange={(e) => onInputChange('securityType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select...</option>
              <option value="residential_property">Residential Property (First Mortgage)</option>
              <option value="residential_second">Residential Property (Second Mortgage)</option>
              <option value="commercial_property">Commercial Property</option>
              <option value="land">Land Only</option>
              <option value="mixed_use">Mixed Use Property</option>
              <option value="ppsr_goods">Personal Property (PPSR)</option>
              <option value="unsecured">Unsecured Loan</option>
            </select>
          </div>

          {(formData.securityType && formData.securityType !== 'unsecured') && (
            <>
              {/* Valuation */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Valuation Requirements</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="valuationObtained">Valuation Obtained *</Label>
                    <select
                      id="valuationObtained"
                      value={formData.valuationObtained || ''}
                      onChange={(e) => onInputChange('valuationObtained', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Select...</option>
                      <option value="full_valuation">Full Valuation (Licensed Valuer)</option>
                      <option value="desktop_valuation">Desktop Valuation</option>
                      <option value="avm">AVM (Automated Valuation Model)</option>
                      <option value="cma">CMA (Comparative Market Analysis)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="valuationDate">Valuation Date *</Label>
                    <Input
                      id="valuationDate"
                      type="date"
                      value={formData.valuationDate || ''}
                      onChange={(e) => onInputChange('valuationDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <Label htmlFor="valuationAmount">Current Valuation Amount *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <Input
                      id="valuationAmount"
                      type="number"
                      value={formData.valuationAmount || ''}
                      onChange={(e) => onInputChange('valuationAmount', e.target.value)}
                      className="pl-7"
                      placeholder="650000"
                    />
                  </div>
                </div>
              </div>

              {/* LVR Calculation */}
              {formData.valuationAmount && formData.originalLoanAmount && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-bold text-sm text-blue-900 mb-2">Loan-to-Value Ratio (LVR):</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {((parseFloat(formData.originalLoanAmount) / parseFloat(formData.valuationAmount)) * 100).toFixed(2)}%
                  </p>
                  <p className="text-xs text-blue-800 mt-1">
                    Loan: ${parseFloat(formData.originalLoanAmount).toLocaleString()} / 
                    Valuation: ${parseFloat(formData.valuationAmount).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Registration Requirements */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Registration Requirements</h4>
                <div className="space-y-3">
                  {(formData.securityType?.includes('property') || formData.securityType === 'land') && (
                    <>
                      <label className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={formData.mortgageDocumented || false}
                          onChange={(e) => onInputChange('mortgageDocumented', e.target.checked)}
                          className="w-4 h-4 mt-1"
                        />
                        <div>
                          <span className="font-semibold text-sm text-gray-900">
                            Mortgage Properly Documented *
                          </span>
                          <p className="text-xs text-gray-600">Mortgage deed prepared by solicitor</p>
                        </div>
                      </label>

                      <label className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={formData.mortgageRegisteredOnTitle || false}
                          onChange={(e) => onInputChange('mortgageRegisteredOnTitle', e.target.checked)}
                          className="w-4 h-4 mt-1"
                        />
                        <div>
                          <span className="font-semibold text-sm text-gray-900">
                            Mortgage Registered on Title *
                          </span>
                          <p className="text-xs text-gray-600">
                            Registered with state land titles office (e.g., NSW Land Registry Services)
                          </p>
                        </div>
                      </label>

                      <div className="grid md:grid-cols-2 gap-4 ml-6">
                        <div>
                          <Label htmlFor="mortgagePriority">Mortgage Priority</Label>
                          <select
                            id="mortgagePriority"
                            value={formData.mortgagePriority || ''}
                            onChange={(e) => onInputChange('mortgagePriority', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          >
                            <option value="">Select...</option>
                            <option value="first">First Mortgage</option>
                            <option value="second">Second Mortgage</option>
                            <option value="third_plus">Third+ Mortgage</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="dealingNumber">Dealing Number (once registered)</Label>
                          <Input
                            id="dealingNumber"
                            value={formData.dealingNumber || ''}
                            onChange={(e) => onInputChange('dealingNumber', e.target.value)}
                            placeholder="AB123456"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {formData.securityType === 'ppsr_goods' && (
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={formData.ppsrRegistered || false}
                        onChange={(e) => onInputChange('ppsrRegistered', e.target.checked)}
                        className="w-4 h-4 mt-1"
                      />
                      <div>
                        <span className="font-semibold text-sm text-gray-900">
                          PPSR Registration Complete *
                        </span>
                        <p className="text-xs text-gray-600">
                          Security interest registered on Personal Property Securities Register (PPSR)
                        </p>
                        {formData.ppsrRegistered && (
                          <div className="mt-2">
                            <Label htmlFor="ppsrNumber" className="text-xs">PPSR Registration Number:</Label>
                            <Input
                              id="ppsrNumber"
                              value={formData.ppsrNumber || ''}
                              onChange={(e) => onInputChange('ppsrNumber', e.target.value)}
                              placeholder="201234567890123"
                              className="w-48 mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </label>
                  )}

                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={formData.priorityPositionConfirmed || false}
                      onChange={(e) => onInputChange('priorityPositionConfirmed', e.target.checked)}
                      className="w-4 h-4 mt-1"
                    />
                    <div>
                      <span className="font-semibold text-sm text-gray-900">
                        Priority Position Confirmed *
                      </span>
                      <p className="text-xs text-gray-600">
                        Title search confirms security has appropriate priority
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Insurance */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Insurance Requirements</h4>
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={formData.buildingInsuranceRequired || false}
                    onChange={(e) => onInputChange('buildingInsuranceRequired', e.target.checked)}
                    className="w-4 h-4 mt-1"
                  />
                  <div>
                    <span className="font-semibold text-sm text-gray-900">
                      Building Insurance Required *
                    </span>
                    <p className="text-xs text-gray-600">
                      Property must be insured with lender noted as interested party
                    </p>
                  </div>
                </label>
              </div>

              {/* Warning */}
              <div className="p-4 bg-rose-50 border border-rose-300 rounded-lg">
                <p className="text-xs text-rose-900">
                  <strong>⚠️ Security Perfection:</strong> Failure to properly register security may result in loss 
                  of priority or the security being unenforceable. Always confirm registration completion and priority position.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Shield,
  FileText,
  Calculator
} from 'lucide-react';

interface ResponsibleLendingAssessmentProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

export function ResponsibleLendingAssessment({ 
  formData, 
  onInputChange 
}: ResponsibleLendingAssessmentProps) {
  
  // Calculate key metrics
  const monthlyIncome = parseFloat(formData.verifiedMonthlyIncome || '0');
  const monthlyExpenses = parseFloat(formData.verifiedMonthlyExpenses || '0');
  const existingDebts = parseFloat(formData.verifiedExistingDebts || '0');
  const proposedLoanAmount = parseFloat(formData.originalLoanAmount || '0');
  const interestRate = parseFloat(formData.interestRate || '6.5');
  const loanTerm = parseFloat(formData.loanTermYears || '30');
  
  // Calculate monthly repayment
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;
  const monthlyRepayment = proposedLoanAmount > 0 
    ? (proposedLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    : 0;
  
  // Calculate surplus/deficit
  const totalMonthlyObligations = monthlyExpenses + existingDebts + monthlyRepayment;
  const monthlySurplus = monthlyIncome - totalMonthlyObligations;
  const surplusPercentage = monthlyIncome > 0 ? (monthlySurplus / monthlyIncome) * 100 : 0;
  
  // Debt-to-income ratio
  const debtToIncome = monthlyIncome > 0 
    ? ((existingDebts + monthlyRepayment) / monthlyIncome) * 100 
    : 0;
  
  // Determine suitability
  const isUnsuitable = monthlySurplus < 0 || debtToIncome > 50 || surplusPercentage < 20;
  const requiresEnhancedAssessment = debtToIncome > 40 || surplusPercentage < 30;
  
  return (
    <div className="space-y-6">
      {/* NCCP Warning Banner */}
      <div className="p-5 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-400 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-red-700 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-red-900 text-base mb-2">⚖️ National Consumer Credit Protection Act 2009</h4>
            <p className="text-sm text-red-800 mb-3">
              This is regulated consumer credit. All NCCP responsible lending obligations apply.
            </p>
            <div className="grid md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white/60 p-3 rounded border border-red-300">
                <p className="font-bold text-red-900 mb-1">✓ Lender Must Hold:</p>
                <ul className="space-y-1 text-red-800">
                  <li>• Australian Credit Licence (ACL), OR</li>
                  <li>• Authorised Credit Representative status</li>
                </ul>
              </div>
              <div className="bg-white/60 p-3 rounded border border-red-300">
                <p className="font-bold text-red-900 mb-1">✓ ASIC Compliance:</p>
                <ul className="space-y-1 text-red-800">
                  <li>• RG 209: Credit licensing guide</li>
                  <li>• RG 209: Responsible lending conduct</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step A: Make Reasonable Inquiries */}
      <Card className="border-2 border-blue-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Step A: Make Reasonable Inquiries (NCCP s117)
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Before approving the loan, inquire about the borrower's financial situation
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Income Details */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">1. Income Verification</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type *
                </label>
                <select
                  value={formData.employmentType || ''}
                  onChange={(e) => onInputChange('employmentType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select...</option>
                  <option value="payg">PAYG Employee</option>
                  <option value="self_employed">Self Employed</option>
                  <option value="business_owner">Business Owner</option>
                  <option value="casual">Casual</option>
                  <option value="contractor">Contractor</option>
                  <option value="retired">Retired</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verified Gross Monthly Income * 
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.verifiedMonthlyIncome || ''}
                    onChange={(e) => onInputChange('verifiedMonthlyIncome', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="8500"
                  />
                </div>
              </div>
            </div>
            
            {/* Verification Documents Checklist */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-bold text-blue-900 mb-2">Required Verification Documents:</p>
              <div className="grid md:grid-cols-2 gap-2 text-xs">
                {formData.employmentType === 'payg' && (
                  <>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={formData.payslipsVerified || false}
                        onChange={(e) => onInputChange('payslipsVerified', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-blue-900">Recent payslips (3 months)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={formData.employmentLetterVerified || false}
                        onChange={(e) => onInputChange('employmentLetterVerified', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-blue-900">Employment letter</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={formData.bankStatementsIncomeVerified || false}
                        onChange={(e) => onInputChange('bankStatementsIncomeVerified', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-blue-900">Bank statements (3 months)</span>
                    </label>
                  </>
                )}
                {(formData.employmentType === 'self_employed' || formData.employmentType === 'business_owner') && (
                  <>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={formData.taxReturnsVerified || false}
                        onChange={(e) => onInputChange('taxReturnsVerified', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-blue-900">Tax returns (2 years)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={formData.noaVerified || false}
                        onChange={(e) => onInputChange('noaVerified', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-blue-900">Notices of Assessment (2 years)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={formData.financialStatementsVerified || false}
                        onChange={(e) => onInputChange('financialStatementsVerified', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-blue-900">Financial statements</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={formData.basVerified || false}
                        onChange={(e) => onInputChange('basVerified', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-blue-900">BAS statements</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={formData.accountantLetterVerified || false}
                        onChange={(e) => onInputChange('accountantLetterVerified', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-blue-900">Accountant letter</span>
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">2. Living Expenses Verification</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verified Monthly Living Expenses *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.verifiedMonthlyExpenses || ''}
                    onChange={(e) => onInputChange('verifiedMonthlyExpenses', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="4200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dependents
                </label>
                <input
                  type="number"
                  value={formData.numberOfDependents || '0'}
                  onChange={(e) => onInputChange('numberOfDependents', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="2"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Verification Method *
              </label>
              <select
                value={formData.expenseVerificationMethod || ''}
                onChange={(e) => onInputChange('expenseVerificationMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select...</option>
                <option value="bank_statements">Bank statement analysis (90 days)</option>
                <option value="hems">HEM (Household Expenditure Measure)</option>
                <option value="declared_verified">Declared + verified sample</option>
              </select>
            </div>
          </div>

          {/* Existing Debts */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">3. Existing Liabilities</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Monthly Debt Obligations *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={formData.verifiedExistingDebts || ''}
                    onChange={(e) => onInputChange('verifiedExistingDebts', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="1500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Include: mortgages, car loans, credit cards, personal loans</p>
              </div>
              <div>
                <label className="flex items-center gap-2 mt-8">
                  <input 
                    type="checkbox"
                    checked={formData.creditReportObtained || false}
                    onChange={(e) => onInputChange('creditReportObtained', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Credit report obtained & reviewed</span>
                </label>
              </div>
            </div>
          </div>

          {/* Loan Purpose */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">4. Loan Purpose & Objectives</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose of Loan *
                </label>
                <select
                  value={formData.loanPurpose || ''}
                  onChange={(e) => onInputChange('loanPurpose', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select...</option>
                  <option value="purchase_ppor">Purchase - Principal Place of Residence</option>
                  <option value="purchase_investment">Purchase - Investment Property</option>
                  <option value="refinance">Refinance Existing Loan</option>
                  <option value="debt_consolidation">Debt Consolidation</option>
                  <option value="renovation">Renovation/Construction</option>
                  <option value="business_purpose">Business Purpose</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Borrower's Requirements & Objectives *
                </label>
                <textarea
                  value={formData.borrowerObjectives || ''}
                  onChange={(e) => onInputChange('borrowerObjectives', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows={3}
                  placeholder="Describe what the borrower wants to achieve and why..."
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step B: Unsuitability Assessment */}
      <Card className={`border-2 ${isUnsuitable ? 'border-red-400' : requiresEnhancedAssessment ? 'border-orange-400' : 'border-green-400'}`}>
        <CardHeader className={`bg-gradient-to-r ${isUnsuitable ? 'from-red-50 to-rose-50' : requiresEnhancedAssessment ? 'from-orange-50 to-yellow-50' : 'from-green-50 to-emerald-50'}`}>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5 text-gray-800" />
            Step B: Unsuitability Assessment (NCCP s131)
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            A loan is unsuitable if the borrower cannot repay without substantial hardship, or it doesn't meet their objectives
          </p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Assessment Results */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Monthly Surplus */}
            <div className={`p-4 rounded-lg border-2 ${monthlySurplus >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
              <div className="flex items-center gap-2 mb-2">
                {monthlySurplus >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <span className="font-bold text-sm text-gray-900">Monthly Surplus/Deficit</span>
              </div>
              <p className={`text-2xl font-bold ${monthlySurplus >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                ${monthlySurplus.toFixed(2)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                ({surplusPercentage.toFixed(1)}% of income)
              </p>
            </div>

            {/* Debt-to-Income */}
            <div className={`p-4 rounded-lg border-2 ${debtToIncome <= 40 ? 'bg-green-50 border-green-300' : debtToIncome <= 50 ? 'bg-orange-50 border-orange-300' : 'bg-red-50 border-red-300'}`}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-gray-700" />
                <span className="font-bold text-sm text-gray-900">Debt-to-Income Ratio</span>
              </div>
              <p className={`text-2xl font-bold ${debtToIncome <= 40 ? 'text-green-700' : debtToIncome <= 50 ? 'text-orange-700' : 'text-red-700'}`}>
                {debtToIncome.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {debtToIncome <= 40 ? 'Acceptable' : debtToIncome <= 50 ? 'High risk' : 'Excessive'}
              </p>
            </div>

            {/* Monthly Repayment */}
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-700" />
                <span className="font-bold text-sm text-gray-900">Monthly Repayment</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                ${monthlyRepayment.toFixed(2)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                @ {interestRate}% over {loanTerm} years
              </p>
            </div>
          </div>

          {/* Calculation Breakdown */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
            <p className="font-bold text-sm text-gray-900 mb-3">Serviceability Calculation:</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Verified Monthly Income:</span>
                <span className="font-semibold text-green-700">+${monthlyIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Living Expenses:</span>
                <span className="font-semibold text-red-700">-${monthlyExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Existing Debt Obligations:</span>
                <span className="font-semibold text-red-700">-${existingDebts.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Proposed Loan Repayment:</span>
                <span className="font-semibold text-red-700">-${monthlyRepayment.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t-2 border-gray-300 flex justify-between">
                <span className="font-bold text-gray-900">Net Monthly Position:</span>
                <span className={`font-bold text-lg ${monthlySurplus >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ${monthlySurplus.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Suitability Determination */}
          <div className={`p-5 rounded-lg border-2 ${isUnsuitable ? 'bg-red-50 border-red-400' : requiresEnhancedAssessment ? 'bg-orange-50 border-orange-400' : 'bg-green-50 border-green-400'}`}>
            <div className="flex items-start gap-3">
              {isUnsuitable ? (
                <XCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
              ) : requiresEnhancedAssessment ? (
                <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className={`font-bold text-base mb-2 ${isUnsuitable ? 'text-red-900' : requiresEnhancedAssessment ? 'text-orange-900' : 'text-green-900'}`}>
                  {isUnsuitable ? '❌ LOAN APPEARS UNSUITABLE' : requiresEnhancedAssessment ? '⚠️ ENHANCED ASSESSMENT REQUIRED' : '✅ LOAN APPEARS SUITABLE'}
                </p>
                <p className={`text-sm mb-3 ${isUnsuitable ? 'text-red-800' : requiresEnhancedAssessment ? 'text-orange-800' : 'text-green-800'}`}>
                  {isUnsuitable 
                    ? 'This loan would likely cause substantial hardship to the borrower. Lending is not recommended under NCCP s131.'
                    : requiresEnhancedAssessment
                    ? 'Debt-to-income ratio or surplus is borderline. Enhanced assessment and additional scrutiny required before approval.'
                    : 'Borrower appears able to meet repayments without substantial hardship based on verified information.'}
                </p>
                {isUnsuitable && (
                  <div className="bg-white/60 p-3 rounded border border-red-300 text-xs text-red-900">
                    <p className="font-bold mb-1">⚖️ NCCP Breach Risk:</p>
                    <p>Approving this loan may breach responsible lending obligations under s117-133 of the NCCP Act 2009. 
                    ASIC may take enforcement action. Borrower may have grounds for hardship variation or complaint to AFCA.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documented Assessment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documented Suitability Assessment * (Required by NCCP s133)
            </label>
            <textarea
              value={formData.suitabilityAssessmentNotes || ''}
              onChange={(e) => onInputChange('suitabilityAssessmentNotes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows={4}
              placeholder="Document your assessment of suitability, including consideration of hardship risk, debt servicing capacity, and whether the loan meets the borrower's objectives..."
            />
            <p className="text-xs text-gray-500 mt-1">
              This assessment must be retained for 7 years and may be requested by ASIC or in a dispute.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

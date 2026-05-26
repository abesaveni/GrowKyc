import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  FileEdit,
  Save,
  Download,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Brain,
  Info,
  Lock,
  Unlock
} from 'lucide-react';

interface Division7AFormProps {
  onBack?: () => void;
}

export function Division7AForm({ onBack }: Division7AFormProps) {
  const [formData, setFormData] = useState({
    // Loan Details
    loan_id: 'DIV7A-001',
    shareholder_name: 'John Smith',
    shareholder_abn: '12 345 678 901',
    loan_date: '2021-07-01',
    loan_amount: 250000,
    
    // Current Year
    opening_balance: 250000,
    payments_principal: 15000,
    payments_interest: 7500,
    closing_balance: 235000,
    
    // Minimum Interest
    benchmark_rate: 8.27,
    calculated_min_interest: 20675,
    actual_interest: 7500,
    interest_shortfall: 13175,
    
    // Minimum Repayment
    max_term_years: 7,
    annual_principal_required: 35714,
    actual_principal: 15000,
    principal_shortfall: 20714,
    
    // Deemed Dividend
    deemed_dividend: 33889,
    
    // Status
    compliant: false
  });

  const [isLocked, setIsLocked] = useState(false);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPercent = (value: number) => {
    return value.toFixed(2) + '%';
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <FileEdit className="w-6 h-6 text-purple-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Division 7A Loan Calculation</h1>
              <p className="text-xs text-gray-600">Structured Form Workpaper • Auto-calc enabled • FY2024</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLocked(!isLocked)}
            >
              {isLocked ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Unlock
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  Lock
                </>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save & Close
            </Button>
          </div>
        </div>

        {/* Metadata Bar */}
        <div className="grid grid-cols-6 gap-4 text-sm">
          <div>
            <span className="text-gray-600 text-xs">Status:</span>
            <div className="font-semibold text-amber-700">DRAFT</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Risk:</span>
            <div className="font-semibold text-red-700">HIGH</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Material:</span>
            <div className="font-semibold text-blue-700">YES</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Preparer:</span>
            <div className="font-semibold text-gray-900">Emma Wilson</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Reviewer:</span>
            <div className="font-semibold text-gray-900">Sarah Chen</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Last Updated:</span>
            <div className="font-semibold text-gray-900">2024-02-14</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Compliance Alert */}
        {!formData.compliant && (
          <div className="bg-red-50 border border-red-300 rounded px-4 py-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">Non-Compliant Loan Arrangement</h3>
                <p className="text-sm text-red-800">
                  This loan does not meet Division 7A minimum requirements. A deemed dividend of ${formatCurrency(formData.deemed_dividend)} will be assessable to the shareholder.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div className="bg-purple-50 border border-purple-300 rounded px-4 py-3">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 mb-2">AI Commentary</h3>
              <div className="space-y-2 text-sm text-purple-800">
                <p>⚠️ <strong>Benchmark rate verification:</strong> Confirm RBA indicator lending rate of {formatPercent(formData.benchmark_rate)} applies for FY2024.</p>
                <p>⚠️ <strong>Interest shortfall:</strong> Actual interest paid (${formatCurrency(formData.actual_interest)}) is below minimum (${formatCurrency(formData.calculated_min_interest)}) by ${formatCurrency(formData.interest_shortfall)}.</p>
                <p>⚠️ <strong>Principal shortfall:</strong> Required annual principal repayment (${formatCurrency(formData.annual_principal_required)}) not met. Shortfall: ${formatCurrency(formData.principal_shortfall)}.</p>
                <p>📋 <strong>Action required:</strong> Lodge dividend statement and consider franking implications.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Loan Details */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
            <h3 className="font-semibold text-gray-900">1. Loan Details</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Loan ID *
                </label>
                <input
                  type="text"
                  value={formData.loan_id}
                  onChange={(e) => handleInputChange('loan_id', e.target.value)}
                  disabled={isLocked}
                  className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Loan Date *
                </label>
                <input
                  type="date"
                  value={formData.loan_date}
                  onChange={(e) => handleInputChange('loan_date', e.target.value)}
                  disabled={isLocked}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Shareholder Name *
                </label>
                <input
                  type="text"
                  value={formData.shareholder_name}
                  onChange={(e) => handleInputChange('shareholder_name', e.target.value)}
                  disabled={isLocked}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Shareholder ABN
                </label>
                <input
                  type="text"
                  value={formData.shareholder_abn}
                  onChange={(e) => handleInputChange('shareholder_abn', e.target.value)}
                  disabled={isLocked}
                  className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Original Loan Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
                  <input
                    type="number"
                    value={formData.loan_amount}
                    onChange={(e) => handleInputChange('loan_amount', parseFloat(e.target.value))}
                    disabled={isLocked}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Maximum Term (Years) *
                </label>
                <input
                  type="number"
                  value={formData.max_term_years}
                  onChange={(e) => handleInputChange('max_term_years', parseInt(e.target.value))}
                  disabled={isLocked}
                  className="w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm"
                />
                <p className="text-xs text-gray-600 mt-1">7 years for secured, 25 years for property</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Current Year Activity */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
            <h3 className="font-semibold text-gray-900">2. Current Year Activity (FY2024)</h3>
          </div>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2 text-gray-900 font-semibold">
                  Opening Balance (01/07/2023)
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  <div className="relative inline-block">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
                    <input
                      type="number"
                      value={formData.opening_balance}
                      onChange={(e) => handleInputChange('opening_balance', parseFloat(e.target.value))}
                      disabled={isLocked}
                      className="w-48 pl-6 pr-3 py-1 border border-gray-300 rounded font-mono text-right"
                    />
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2 text-gray-900">
                  Principal Payments
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  <div className="relative inline-block">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
                    <input
                      type="number"
                      value={formData.payments_principal}
                      onChange={(e) => handleInputChange('payments_principal', parseFloat(e.target.value))}
                      disabled={isLocked}
                      className="w-48 pl-6 pr-3 py-1 border border-gray-300 rounded font-mono text-right"
                    />
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2 text-gray-900">
                  Interest Payments
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  <div className="relative inline-block">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
                    <input
                      type="number"
                      value={formData.payments_interest}
                      onChange={(e) => handleInputChange('payments_interest', parseFloat(e.target.value))}
                      disabled={isLocked}
                      className="w-48 pl-6 pr-3 py-1 border border-gray-300 rounded font-mono text-right"
                    />
                  </div>
                </td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border border-gray-300 px-4 py-2 text-gray-900 font-bold">
                  Closing Balance (30/06/2024)
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right text-gray-900 font-mono font-bold">
                  ${formatCurrency(formData.closing_balance)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 3: Minimum Interest Calculation */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">3. Minimum Interest Calculation</h3>
            <Button size="sm" variant="outline">
              <Calculator className="w-4 h-4 mr-2" />
              Recalculate
            </Button>
          </div>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2 text-gray-900">
                  RBA Benchmark Rate (FY2024)
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  <div className="relative inline-block">
                    <input
                      type="number"
                      step="0.01"
                      value={formData.benchmark_rate}
                      onChange={(e) => handleInputChange('benchmark_rate', parseFloat(e.target.value))}
                      disabled={isLocked}
                      className="w-32 pr-8 py-1 border border-gray-300 rounded font-mono text-right"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">%</span>
                  </div>
                </td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border border-gray-300 px-4 py-2 text-gray-900 font-semibold">
                  Minimum Interest Required
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right text-blue-700 font-mono font-bold">
                  ${formatCurrency(formData.calculated_min_interest)}
                </td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2 text-gray-900">
                  Actual Interest Paid
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right text-gray-900 font-mono">
                  ${formatCurrency(formData.actual_interest)}
                </td>
              </tr>
              <tr className="bg-red-50">
                <td className="border border-gray-300 px-4 py-2 text-red-900 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Interest Shortfall
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right text-red-700 font-mono font-bold">
                  ${formatCurrency(formData.interest_shortfall)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4: Minimum Principal Repayment */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
            <h3 className="font-semibold text-gray-900">4. Minimum Principal Repayment</h3>
          </div>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="bg-blue-50">
                <td className="border border-gray-300 px-4 py-2 text-gray-900 font-semibold">
                  Annual Principal Required (Opening Balance ÷ {formData.max_term_years} years)
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right text-blue-700 font-mono font-bold">
                  ${formatCurrency(formData.annual_principal_required)}
                </td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2 text-gray-900">
                  Actual Principal Paid
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right text-gray-900 font-mono">
                  ${formatCurrency(formData.actual_principal)}
                </td>
              </tr>
              <tr className="bg-red-50">
                <td className="border border-gray-300 px-4 py-2 text-red-900 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Principal Shortfall
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right text-red-700 font-mono font-bold">
                  ${formatCurrency(formData.principal_shortfall)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 5: Deemed Dividend */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
            <h3 className="font-semibold text-gray-900">5. Deemed Dividend Calculation</h3>
          </div>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2 text-gray-900">
                  Interest Shortfall (from Section 3)
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right text-gray-900 font-mono">
                  ${formatCurrency(formData.interest_shortfall)}
                </td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2 text-gray-900">
                  Principal Shortfall (from Section 4)
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right text-gray-900 font-mono">
                  ${formatCurrency(formData.principal_shortfall)}
                </td>
              </tr>
              <tr className="bg-red-100 border-2 border-red-400">
                <td className="border border-gray-300 px-4 py-3 text-red-900 font-bold text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  DEEMED DIVIDEND (Assessable to Shareholder)
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right text-red-700 font-mono font-bold text-lg">
                  ${formatCurrency(formData.deemed_dividend)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Export Mapping Info */}
        <div className="bg-blue-50 border border-blue-300 rounded px-4 py-3">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Auto-Export Configuration</h3>
              <p className="text-sm text-blue-800">
                Deemed dividend of ${formatCurrency(formData.deemed_dividend)} will automatically populate Item 11H of the Company Tax Return and create franking account entry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

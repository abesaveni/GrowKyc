import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Calculator,
  Save,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  DollarSign,
  FileText,
  Brain,
  Target,
  TrendingUp,
  TrendingDown,
  Plus
} from 'lucide-react';

interface TaxWorksheetProps {
  onBack?: () => void;
}

interface TaxItem {
  code: string;
  description: string;
  accountingProfit?: number;
  addBack?: number;
  deductible?: number;
  taxableIncome?: number;
  reference: string;
  notes?: string;
}

export function TaxWorksheet({ onBack }: TaxWorksheetProps) {
  const [selectedYear, setSelectedYear] = useState('FY2024');

  // Tax Reconciliation Data
  const accountingProfit = 98100;
  const taxRate = 0.25; // 25% for base rate entities

  const taxAdjustments: TaxItem[] = [
    {
      code: 'START',
      description: 'Net Profit Before Tax (Accounting)',
      accountingProfit: 98100,
      reference: 'P&L',
      notes: 'From financial statements'
    },
    // Add-backs (Non-deductible items)
    {
      code: 'ADD-001',
      description: 'Depreciation (Accounting)',
      addBack: 56800,
      reference: 'LS-04',
      notes: 'Add back accounting depreciation'
    },
    {
      code: 'ADD-002',
      description: 'Entertainment - Non-deductible',
      addBack: 3800,
      reference: 'WP-ENT',
      notes: '50% of entertainment expenses non-deductible'
    },
    {
      code: 'ADD-003',
      description: 'Fines & Penalties',
      addBack: 450,
      reference: 'Ledger',
      notes: 'ATO penalties non-deductible'
    },
    {
      code: 'ADD-004',
      description: 'Donations - Non-deductible portion',
      addBack: 1200,
      reference: 'WP-DON',
      notes: 'Donations without DGR status'
    },
    {
      code: 'ADD-005',
      description: 'Superannuation - Late payment',
      addBack: 2400,
      reference: 'LS-07',
      notes: 'Super paid after lodgement due date - not deductible'
    },
    {
      code: 'ADD-006',
      description: 'Provision for Annual Leave - Movement',
      addBack: 4200,
      reference: 'LS-07',
      notes: 'Provision increase not deductible until paid'
    },
    // Deductions (Tax depreciation & other deductions)
    {
      code: 'DED-001',
      description: 'Tax Depreciation (ATO Rates)',
      deductible: -62400,
      reference: 'Tax Depr Schedule',
      notes: 'Diminishing value method per ATO'
    },
    {
      code: 'DED-002',
      description: 'Temporary Full Expensing',
      deductible: -15000,
      reference: 'FA Register',
      notes: 'Machinery eligible for TFE'
    },
    {
      code: 'DED-003',
      description: 'Small Business CGT Concessions',
      deductible: 0,
      reference: 'N/A',
      notes: 'No disposals this year'
    },
    {
      code: 'DED-004',
      description: 'R&D Tax Offset',
      deductible: 0,
      reference: 'N/A',
      notes: 'No R&D activities'
    },
    // Division 7A adjustments
    {
      code: 'DIV7A-001',
      description: 'Division 7A Deemed Dividend',
      addBack: 47500,
      reference: 'Div 7A WP',
      notes: 'Director loan not compliant - deemed dividend'
    },
    // Subtotal calculations
    {
      code: 'SUBTOTAL',
      description: 'Taxable Income Before Losses',
      taxableIncome: 135150,
      reference: 'Calculated',
      notes: 'Accounting profit + addbacks - deductions'
    },
    // Tax losses
    {
      code: 'LOSS-001',
      description: 'Prior Year Tax Losses Applied',
      deductible: 0,
      reference: 'Prior Year Return',
      notes: 'No tax losses available'
    },
    // Final taxable income
    {
      code: 'FINAL',
      description: 'Taxable Income',
      taxableIncome: 135150,
      reference: 'Label A',
      notes: 'Amount to report in company tax return'
    }
  ];

  // Calculate totals
  const totalAddBacks = taxAdjustments
    .filter(item => item.addBack)
    .reduce((sum, item) => sum + (item.addBack || 0), 0);
  
  const totalDeductions = taxAdjustments
    .filter(item => item.deductible)
    .reduce((sum, item) => sum + (item.deductible || 0), 0);
  
  const taxableIncome = 135150;
  const taxPayable = Math.round(taxableIncome * taxRate);
  const frankingCredits = 0;
  const netTaxPayable = taxPayable - frankingCredits;

  // Tax payment details
  const taxPayments = [
    { date: '2023-10-21', description: 'Q1 PAYGI - October', amount: 8000, reference: 'BAS Q1' },
    { date: '2024-01-21', description: 'Q2 PAYGI - January', amount: 8500, reference: 'BAS Q2' },
    { date: '2024-04-21', description: 'Q3 PAYGI - April', amount: 9200, reference: 'BAS Q3' },
    { date: '2024-07-21', description: 'Q4 PAYGI - July', amount: 8100, reference: 'BAS Q4' }
  ];

  const totalPayments = taxPayments.reduce((sum, pmt) => sum + pmt.amount, 0);
  const balanceDue = netTaxPayable - totalPayments;

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    return (value < 0 ? '-' : '') + '$' + absValue.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
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
            <Calculator className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Income Tax Reconciliation Worksheet</h1>
              <p className="text-xs text-gray-600">Company Tax Return • FY2024 • Base Rate Entity 25%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Metadata Bar */}
        <div className="grid grid-cols-6 gap-4 text-sm">
          <div>
            <span className="text-gray-600 text-xs">Client:</span>
            <div className="font-semibold text-gray-900">ABC Manufacturing Pty Ltd</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">ABN:</span>
            <div className="font-semibold text-gray-900">12 345 678 901</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Year End:</span>
            <div className="font-semibold text-gray-900">30 June 2024</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Tax Rate:</span>
            <div className="font-semibold text-blue-700">25%</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Preparer:</span>
            <div className="font-semibold text-gray-900">Sarah Chen</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Reviewer:</span>
            <div className="font-semibold text-gray-900">Michael Ross</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Tax Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="text-xs text-gray-600 mb-1">Accounting Profit</div>
            <div className="text-2xl font-bold text-gray-900 font-mono">{formatCurrency(accountingProfit)}</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="text-xs text-gray-600 mb-1">Taxable Income</div>
            <div className="text-2xl font-bold text-blue-600 font-mono">{formatCurrency(taxableIncome)}</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="text-xs text-gray-600 mb-1">Tax Payable @ 25%</div>
            <div className="text-2xl font-bold text-red-600 font-mono">{formatCurrency(taxPayable)}</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="text-xs text-gray-600 mb-1">Balance Due</div>
            <div className="text-2xl font-bold text-amber-600 font-mono">{formatCurrency(balanceDue)}</div>
          </div>
        </div>

        {/* AI Tax Review Alert */}
        <div className="bg-purple-50 border border-purple-300 rounded px-4 py-3">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 mb-2">AI Tax Review</h3>
              <div className="space-y-2 text-sm text-purple-800">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <strong>Division 7A Issue:</strong> Director loan $47,500 deemed dividend added to taxable income. Consider complying loan agreement for future years.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div>
                    <strong>Late Super Payment:</strong> $2,400 super paid after due date - not deductible this year. Review payment timing for FY2025.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <strong>TFE Opportunity:</strong> Machinery purchase $15k claimed under Temporary Full Expensing. Verify eligibility documentation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Reconciliation Table */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
            <h3 className="font-semibold text-gray-900">Tax Reconciliation - Accounting to Taxable Income</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-32">Item</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Description</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-40">Amount</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-32">Reference</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {/* Starting Profit */}
                <tr className="bg-blue-50">
                  <td className="border border-gray-300 px-3 py-2 font-mono font-semibold text-blue-900">
                    START
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-900 font-semibold">
                    Net Profit Before Tax (Accounting)
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono font-bold text-blue-900">
                    {formatCurrency(accountingProfit)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-700 font-mono text-xs">
                    P&L
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-700 text-xs">
                    From financial statements
                  </td>
                </tr>

                {/* Add-backs Header */}
                <tr className="bg-red-50">
                  <td colSpan={5} className="border border-gray-300 px-3 py-2 font-semibold text-red-900">
                    ADD-BACKS (Non-deductible items)
                  </td>
                </tr>

                {/* Add-back items */}
                {taxAdjustments
                  .filter(item => item.addBack)
                  .map((item) => (
                    <tr key={item.code} className="hover:bg-red-50">
                      <td className="border border-gray-300 px-3 py-2 font-mono text-gray-700">
                        {item.code}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-900">
                        {item.description}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-right font-mono text-red-700 font-semibold">
                        {formatCurrency(item.addBack!)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-700 font-mono text-xs">
                        {item.reference}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-700 text-xs">
                        {item.notes}
                      </td>
                    </tr>
                  ))}

                {/* Add-backs Subtotal */}
                <tr className="bg-red-100">
                  <td colSpan={2} className="border border-gray-300 px-3 py-2 text-right font-semibold text-red-900">
                    Total Add-backs:
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono font-bold text-red-900">
                    {formatCurrency(totalAddBacks)}
                  </td>
                  <td colSpan={2} className="border border-gray-300"></td>
                </tr>

                {/* Deductions Header */}
                <tr className="bg-green-50">
                  <td colSpan={5} className="border border-gray-300 px-3 py-2 font-semibold text-green-900">
                    DEDUCTIONS (Tax-specific deductions)
                  </td>
                </tr>

                {/* Deduction items */}
                {taxAdjustments
                  .filter(item => item.deductible)
                  .map((item) => (
                    <tr key={item.code} className="hover:bg-green-50">
                      <td className="border border-gray-300 px-3 py-2 font-mono text-gray-700">
                        {item.code}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-900">
                        {item.description}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-right font-mono text-green-700 font-semibold">
                        {formatCurrency(item.deductible!)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-700 font-mono text-xs">
                        {item.reference}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-700 text-xs">
                        {item.notes}
                      </td>
                    </tr>
                  ))}

                {/* Deductions Subtotal */}
                <tr className="bg-green-100">
                  <td colSpan={2} className="border border-gray-300 px-3 py-2 text-right font-semibold text-green-900">
                    Total Deductions:
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono font-bold text-green-900">
                    {formatCurrency(totalDeductions)}
                  </td>
                  <td colSpan={2} className="border border-gray-300"></td>
                </tr>

                {/* Final Taxable Income */}
                <tr className="bg-blue-100">
                  <td className="border border-gray-300 px-3 py-2 font-mono font-bold text-blue-900">
                    FINAL
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-900 font-bold">
                    Taxable Income (Label A)
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono font-bold text-blue-900 text-lg">
                    {formatCurrency(taxableIncome)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-700 font-mono text-xs">
                    Tax Return
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-700 text-xs">
                    Amount to report in company tax return
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tax Calculation Summary */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
            <h3 className="font-semibold text-gray-900">Tax Calculation & Payment Summary</h3>
          </div>
          <div className="p-4 space-y-4">
            {/* Tax Calculation */}
            <div className="border border-gray-300 rounded">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2 text-gray-900 font-semibold">
                      Taxable Income
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                      {formatCurrency(taxableIncome)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 text-gray-900">
                      Tax Rate (Base Rate Entity)
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                      25%
                    </td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-gray-300 px-3 py-2 text-blue-900 font-semibold">
                      Tax Payable
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-mono font-bold text-blue-900">
                      {formatCurrency(taxPayable)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 text-gray-900">
                      Less: Franking Credits
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                      {formatCurrency(frankingCredits)}
                    </td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="border border-gray-300 px-3 py-2 text-green-900 font-semibold">
                      Net Tax Payable
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-mono font-bold text-green-900">
                      {formatCurrency(netTaxPayable)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* PAYG Instalments */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">PAYG Instalments Paid</h4>
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Date</th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Description</th>
                    <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Amount</th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {taxPayments.map((payment, idx) => (
                    <tr key={idx} className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-3 py-2 text-gray-700 font-mono text-xs">
                        {payment.date}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-900">
                        {payment.description}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-700 font-mono text-xs">
                        {payment.reference}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-blue-100">
                    <td colSpan={2} className="border border-gray-300 px-3 py-2 text-right font-semibold text-blue-900">
                      Total PAYG Paid:
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-mono font-bold text-blue-900">
                      {formatCurrency(totalPayments)}
                    </td>
                    <td className="border border-gray-300"></td>
                  </tr>
                  <tr className="bg-amber-100">
                    <td colSpan={2} className="border border-gray-300 px-3 py-2 text-right font-semibold text-amber-900">
                      Balance Due / (Refund):
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-mono font-bold text-amber-900 text-lg">
                      {formatCurrency(balanceDue)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-xs text-amber-700">
                      Due: 15 Feb 2025
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Franking Account */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
            <h3 className="font-semibold text-gray-900">Franking Account Movement</h3>
          </div>
          <div className="p-4">
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Description</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-40">Debit</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-40">Credit</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-40">Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 text-gray-900">
                    Opening Balance 1 July 2023
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-700">
                    -
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-700">
                    -
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                    $12,400
                  </td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="border border-gray-300 px-3 py-2 text-gray-900">
                    Tax Paid FY2023 (credited 15 Feb 2024)
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-700">
                    -
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono text-green-700">
                    $22,100
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                    $34,500
                  </td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="border border-gray-300 px-3 py-2 text-gray-900">
                    Franked Dividends Paid (no dividends this year)
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-700">
                    -
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-700">
                    -
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                    $34,500
                  </td>
                </tr>
                <tr className="bg-blue-100">
                  <td className="border border-gray-300 px-3 py-2 text-blue-900 font-semibold">
                    Closing Balance 30 June 2024
                  </td>
                  <td colSpan={2} className="border border-gray-300 px-3 py-2 text-right font-mono text-blue-700">
                    -
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono font-bold text-blue-900">
                    $34,500
                  </td>
                </tr>
                <tr className="bg-green-50">
                  <td className="border border-gray-300 px-3 py-2 text-green-900 font-semibold">
                    After FY2024 Tax Paid (Projected)
                  </td>
                  <td colSpan={2} className="border border-gray-300 px-3 py-2 text-right text-xs text-green-700">
                    Plus $33,788 credit
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-mono font-bold text-green-900">
                    $68,288
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Tax Notes */}
        <div className="border border-gray-300 rounded bg-white p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Key Tax Notes & Considerations</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-blue-700">1</span>
              </div>
              <div>
                <strong className="text-gray-900">Base Rate Entity (BRE) Test:</strong>
                <p className="text-gray-700 mt-1">
                  Company qualifies for 25% BRE rate. Passive income &lt;80% and aggregated turnover &lt;$50m. BRE eligibility worksheet attached.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-red-700">2</span>
              </div>
              <div>
                <strong className="text-gray-900">Division 7A Deemed Dividend:</strong>
                <p className="text-gray-700 mt-1">
                  Director loan $47,500 overdrawn at year-end. No complying loan agreement in place. Entire amount treated as deemed dividend under Div 7A s109D. Client advised to regularize for future years.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-amber-700">3</span>
              </div>
              <div>
                <strong className="text-gray-900">Superannuation Timing:</strong>
                <p className="text-gray-700 mt-1">
                  $2,400 super paid after lodgement due date (28 Oct 2024). Not deductible in FY2024 per TR 2010/1. Deductible in FY2025 when paid.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-green-700">4</span>
              </div>
              <div>
                <strong className="text-gray-900">Temporary Full Expensing:</strong>
                <p className="text-gray-700 mt-1">
                  Machinery purchase $15,000 eligible for TFE. Claimed in full in FY2024. Verify purchase date between 6 Oct 2020 and 30 June 2023 (extended to 30 June 2025 for small business).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-purple-700">5</span>
              </div>
              <div>
                <strong className="text-gray-900">Franking Account:</strong>
                <p className="text-gray-700 mt-1">
                  Available franking credits $34,500. Sufficient to frank dividends up to $46,000 (fully franked at 75%). Consider dividend planning for shareholders.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Workpapers */}
        <div className="bg-blue-50 border border-blue-300 rounded p-4">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Supporting Tax Workpapers
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button className="bg-white border border-blue-200 rounded px-3 py-2 hover:bg-blue-50 text-left text-sm">
              <div className="font-semibold text-gray-900">Division 7A Calculation</div>
              <div className="text-xs text-gray-600 mt-1">Loan agreement & deemed dividend</div>
            </button>
            <button className="bg-white border border-blue-200 rounded px-3 py-2 hover:bg-blue-50 text-left text-sm">
              <div className="font-semibold text-gray-900">Depreciation Schedule</div>
              <div className="text-xs text-gray-600 mt-1">Tax vs accounting depreciation</div>
            </button>
            <button className="bg-white border border-blue-200 rounded px-3 py-2 hover:bg-blue-50 text-left text-sm">
              <div className="font-semibold text-gray-900">Base Rate Entity Test</div>
              <div className="text-xs text-gray-600 mt-1">Eligibility for 25% rate</div>
            </button>
            <button className="bg-white border border-blue-200 rounded px-3 py-2 hover:bg-blue-50 text-left text-sm">
              <div className="font-semibold text-gray-900">Entertainment Analysis</div>
              <div className="text-xs text-gray-600 mt-1">Deductible vs non-deductible split</div>
            </button>
            <button className="bg-white border border-blue-200 rounded px-3 py-2 hover:bg-blue-50 text-left text-sm">
              <div className="font-semibold text-gray-900">Franking Account</div>
              <div className="text-xs text-gray-600 mt-1">Movements and balance</div>
            </button>
            <button className="bg-white border border-blue-200 rounded px-3 py-2 hover:bg-blue-50 text-left text-sm">
              <div className="font-semibold text-gray-900">Prior Year Losses</div>
              <div className="text-xs text-gray-600 mt-1">Available losses & carryforward</div>
            </button>
          </div>
        </div>

        {/* Manager Review */}
        <div className="bg-green-50 border border-green-300 rounded p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-900 mb-2">Tax Worksheet Review Status</h3>
              <p className="text-sm text-green-800">
                All tax adjustments verified • Division 7A reviewed • Deductions substantiated • Ready for manager approval
              </p>
            </div>
            <Button variant="outline" className="bg-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Tax Worksheet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

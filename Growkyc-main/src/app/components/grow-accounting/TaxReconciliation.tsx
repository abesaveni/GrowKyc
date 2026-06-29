import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Save,
  Download,
  Calculator,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  FileText
} from 'lucide-react';

interface TaxReconciliationProps {
  onBack?: () => void;
}

interface TaxAdjustment {
  id: string;
  description: string;
  amount: number;
  category: 'add-back' | 'deduction';
  reference: string;
  notes?: string;
}

export function TaxReconciliation({ onBack }: TaxReconciliationProps) {
  const [adjustments, setAdjustments] = useState<TaxAdjustment[]>([
    {
      id: 'adj-001',
      description: 'Depreciation - Accounting',
      amount: 45000,
      category: 'add-back',
      reference: 'FA Schedule',
      notes: 'Add back accounting depreciation'
    },
    {
      id: 'adj-002',
      description: 'Depreciation - Tax (Capital Allowances)',
      amount: 52000,
      category: 'deduction',
      reference: 'Tax Depreciation',
      notes: 'Tax depr using diminishing value'
    },
    {
      id: 'adj-003',
      description: 'Entertainment - Non-Deductible',
      amount: 8500,
      category: 'add-back',
      reference: 'P&L Analysis',
      notes: '50% non-deductible'
    },
    {
      id: 'adj-004',
      description: 'Client Gifts',
      amount: 2400,
      category: 'add-back',
      reference: 'Expenses',
      notes: 'Non-deductible gifts'
    },
    {
      id: 'adj-005',
      description: 'Bad Debts Written Off',
      amount: 15000,
      category: 'deduction',
      reference: 'Receivables',
      notes: 'Previously included in income'
    },
    {
      id: 'adj-006',
      description: 'Fines and Penalties',
      amount: 3200,
      category: 'add-back',
      reference: 'Expenses',
      notes: 'Non-deductible per ITAA'
    }
  ]);

  // Financial data
  const accountingProfit = 385000;
  
  // Calculate totals
  const addBacks = adjustments
    .filter(adj => adj.category === 'add-back')
    .reduce((sum, adj) => sum + adj.amount, 0);
  
  const deductions = adjustments
    .filter(adj => adj.category === 'deduction')
    .reduce((sum, adj) => sum + adj.amount, 0);
  
  const taxableIncome = accountingProfit + addBacks - deductions;
  const taxRate = 0.30; // 30% company tax rate
  const taxPayable = Math.max(0, taxableIncome * taxRate);
  const franking = taxPayable; // Simplified

  const addAdjustment = (category: 'add-back' | 'deduction') => {
    const newAdj: TaxAdjustment = {
      id: `adj-${Date.now()}`,
      description: '',
      amount: 0,
      category,
      reference: '',
      notes: ''
    };
    setAdjustments([...adjustments, newAdj]);
  };

  const deleteAdjustment = (id: string) => {
    setAdjustments(adjustments.filter(adj => adj.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
              <h1 className="text-xl font-bold text-gray-900">Income Tax Reconciliation</h1>
              <p className="text-xs text-gray-600">Company Tax Calculation • FY2024 • ABC Manufacturing Pty Ltd</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
            <span className="text-gray-600 text-xs">Status:</span>
            <div className="font-semibold text-amber-700">IN PROGRESS</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Taxable Income:</span>
            <div className="font-semibold text-gray-900">{formatCurrency(taxableIncome)}</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Tax Payable:</span>
            <div className="font-semibold text-blue-700">{formatCurrency(taxPayable)}</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Preparer:</span>
            <div className="font-semibold text-gray-900">Sarah Chen</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Reviewer:</span>
            <div className="font-semibold text-gray-900">Michael Ross</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Last Updated:</span>
            <div className="font-semibold text-gray-900">2024-02-14</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Summary Card */}
        <div className="bg-blue-50 border border-blue-300 rounded p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">Tax Calculation Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Accounting Profit:</span>
                  <div className="font-bold text-blue-900">{formatCurrency(accountingProfit)}</div>
                </div>
                <div>
                  <span className="text-blue-700">Add-backs:</span>
                  <div className="font-bold text-blue-900">{formatCurrency(addBacks)}</div>
                </div>
                <div>
                  <span className="text-blue-700">Deductions:</span>
                  <div className="font-bold text-blue-900">({formatCurrency(deductions)})</div>
                </div>
                <div>
                  <span className="text-blue-700">Tax @ 30%:</span>
                  <div className="font-bold text-blue-900">{formatCurrency(taxPayable)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Reconciliation Table */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Tax Reconciliation Worksheet</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => addAdjustment('add-back')}>
                <Plus className="w-4 h-4 mr-1" />
                Add Back
              </Button>
              <Button variant="outline" size="sm" onClick={() => addAdjustment('deduction')}>
                <Plus className="w-4 h-4 mr-1" />
                Deduction
              </Button>
            </div>
          </div>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">
                  Description
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-32">
                  Type
                </th>
                <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-40">
                  Amount
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-40">
                  Reference
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">
                  Notes
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Starting Balance */}
              <tr className="bg-blue-50">
                <td className="border border-gray-300 px-3 py-3 font-semibold text-gray-900" colSpan={2}>
                  Accounting Profit/(Loss) Before Tax
                </td>
                <td className="border border-gray-300 px-3 py-3 text-right font-bold text-gray-900 font-mono">
                  {formatCurrency(accountingProfit)}
                </td>
                <td className="border border-gray-300 px-3 py-3 text-gray-700">
                  P&L Statement
                </td>
                <td className="border border-gray-300 px-3 py-3 text-gray-700" colSpan={2}>
                  Per financial statements
                </td>
              </tr>

              {/* Add-backs Section */}
              <tr className="bg-amber-50">
                <td className="border border-gray-300 px-3 py-2 font-semibold text-amber-900" colSpan={6}>
                  Add: Non-Deductible Expenses
                </td>
              </tr>
              {adjustments
                .filter(adj => adj.category === 'add-back')
                .map((adj) => (
                  <tr key={adj.id} className="hover:bg-blue-50">
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="text"
                        value={adj.description}
                        onChange={(e) => {
                          const updated = adjustments.map(a =>
                            a.id === adj.id ? { ...a, description: e.target.value } : a
                          );
                          setAdjustments(updated);
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Description..."
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded">
                        ADD BACK
                      </span>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      <input
                        type="number"
                        value={adj.amount}
                        onChange={(e) => {
                          const updated = adjustments.map(a =>
                            a.id === adj.id ? { ...a, amount: parseFloat(e.target.value) || 0 } : a
                          );
                          setAdjustments(updated);
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right font-mono"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="text"
                        value={adj.reference}
                        onChange={(e) => {
                          const updated = adjustments.map(a =>
                            a.id === adj.id ? { ...a, reference: e.target.value } : a
                          );
                          setAdjustments(updated);
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Reference..."
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="text"
                        value={adj.notes || ''}
                        onChange={(e) => {
                          const updated = adjustments.map(a =>
                            a.id === adj.id ? { ...a, notes: e.target.value } : a
                          );
                          setAdjustments(updated);
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Notes..."
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <button
                        onClick={() => deleteAdjustment(adj.id)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

              {/* Add-backs Subtotal */}
              <tr className="bg-amber-100">
                <td className="border border-gray-300 px-3 py-2 font-semibold text-amber-900" colSpan={2}>
                  Total Add-backs
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right font-bold text-amber-900 font-mono">
                  {formatCurrency(addBacks)}
                </td>
                <td className="border border-gray-300 px-3 py-2" colSpan={3}></td>
              </tr>

              {/* Deductions Section */}
              <tr className="bg-green-50">
                <td className="border border-gray-300 px-3 py-2 font-semibold text-green-900" colSpan={6}>
                  Less: Tax Deductible Items
                </td>
              </tr>
              {adjustments
                .filter(adj => adj.category === 'deduction')
                .map((adj) => (
                  <tr key={adj.id} className="hover:bg-blue-50">
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="text"
                        value={adj.description}
                        onChange={(e) => {
                          const updated = adjustments.map(a =>
                            a.id === adj.id ? { ...a, description: e.target.value } : a
                          );
                          setAdjustments(updated);
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Description..."
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                        DEDUCTION
                      </span>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right">
                      <input
                        type="number"
                        value={adj.amount}
                        onChange={(e) => {
                          const updated = adjustments.map(a =>
                            a.id === adj.id ? { ...a, amount: parseFloat(e.target.value) || 0 } : a
                          );
                          setAdjustments(updated);
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right font-mono"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="text"
                        value={adj.reference}
                        onChange={(e) => {
                          const updated = adjustments.map(a =>
                            a.id === adj.id ? { ...a, reference: e.target.value } : a
                          );
                          setAdjustments(updated);
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Reference..."
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="text"
                        value={adj.notes || ''}
                        onChange={(e) => {
                          const updated = adjustments.map(a =>
                            a.id === adj.id ? { ...a, notes: e.target.value } : a
                          );
                          setAdjustments(updated);
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Notes..."
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <button
                        onClick={() => deleteAdjustment(adj.id)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}

              {/* Deductions Subtotal */}
              <tr className="bg-green-100">
                <td className="border border-gray-300 px-3 py-2 font-semibold text-green-900" colSpan={2}>
                  Total Deductions
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right font-bold text-green-900 font-mono">
                  ({formatCurrency(deductions)})
                </td>
                <td className="border border-gray-300 px-3 py-2" colSpan={3}></td>
              </tr>

              {/* Taxable Income */}
              <tr className="bg-blue-100">
                <td className="border border-gray-300 px-3 py-3 font-bold text-blue-900" colSpan={2}>
                  Taxable Income
                </td>
                <td className="border border-gray-300 px-3 py-3 text-right font-bold text-blue-900 text-lg font-mono">
                  {formatCurrency(taxableIncome)}
                </td>
                <td className="border border-gray-300 px-3 py-3" colSpan={3}></td>
              </tr>

              {/* Tax Calculation */}
              <tr className="bg-purple-50">
                <td className="border border-gray-300 px-3 py-2 font-semibold text-purple-900" colSpan={2}>
                  Income Tax @ 30%
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right font-bold text-purple-900 font-mono">
                  {formatCurrency(taxPayable)}
                </td>
                <td className="border border-gray-300 px-3 py-2" colSpan={3}>
                  Company tax rate for base rate entities
                </td>
              </tr>

              {/* Franking Credits */}
              <tr className="bg-purple-50">
                <td className="border border-gray-300 px-3 py-2 font-semibold text-purple-900" colSpan={2}>
                  Franking Credits Available
                </td>
                <td className="border border-gray-300 px-3 py-2 text-right font-bold text-purple-900 font-mono">
                  {formatCurrency(franking)}
                </td>
                <td className="border border-gray-300 px-3 py-2" colSpan={3}>
                  Franking account balance
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Key Notes */}
        <div className="bg-amber-50 border border-amber-300 rounded p-4">
          <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Key Tax Considerations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-amber-900">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>Non-deductible expenses added back (entertainment, gifts, fines)</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>Tax depreciation claimed using diminishing value method</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>Bad debts previously included in assessable income</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span>Company qualifies as base rate entity (30% rate)</span>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-purple-50 border border-purple-300 rounded p-4">
          <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Manager Review Required
          </h3>
          <p className="text-sm text-purple-800 mb-4">
            Tax reconciliation must be reviewed by manager before finalizing tax return. All adjustments must be
            supported by documentation and cross-referenced to workpapers.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              Request Review
            </Button>
            <span className="text-sm text-purple-700">
              Preparer: Sarah Chen • Ready for review
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

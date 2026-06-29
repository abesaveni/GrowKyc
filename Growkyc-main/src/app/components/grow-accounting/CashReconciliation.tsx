import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Save,
  Download,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';

interface CashReconciliationProps {
  onBack?: () => void;
}

export function CashReconciliation({ onBack }: CashReconciliationProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-white/5">
      {/* Fixed Header */}
      <div className="bg-white border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <DollarSign className="w-6 h-6 text-green-400" />
            <div>
              <h1 className="text-xl font-bold text-slate-100">LS-01: Cash at Bank - Operating Account</h1>
              <p className="text-xs text-slate-300">Account 1100 • Bank Reconciliation • FY2024</p>
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
            <span className="text-slate-300 text-xs">GL Balance:</span>
            <div className="font-semibold text-slate-100">$247,500.00</div>
          </div>
          <div>
            <span className="text-slate-300 text-xs">Bank Statement:</span>
            <div className="font-semibold text-slate-100">$247,500.00</div>
          </div>
          <div>
            <span className="text-slate-300 text-xs">Difference:</span>
            <div className="font-semibold text-green-400">$0.00</div>
          </div>
          <div>
            <span className="text-slate-300 text-xs">Status:</span>
            <div className="font-semibold text-green-400">RECONCILED ✓</div>
          </div>
          <div>
            <span className="text-slate-300 text-xs">Bank:</span>
            <div className="font-semibold text-slate-100">NAB</div>
          </div>
          <div>
            <span className="text-slate-300 text-xs">Account:</span>
            <div className="font-semibold text-slate-100">***4567</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Reconciliation Summary */}
        <div className="bg-green-500/10 border border-green-300 rounded p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <h3 className="font-semibold text-green-300">Bank Reconciliation Complete</h3>
              <p className="text-sm text-green-300">
                GL balance matches bank statement • No outstanding items • Last reconciled: 30 June 2024
              </p>
            </div>
          </div>
        </div>

        {/* Lead Schedule Table */}
        <div className="border border-white/10 rounded bg-white overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 px-4 py-2">
            <h3 className="font-semibold text-slate-100">Cash Reconciliation</h3>
          </div>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="bg-blue-500/10">
                <td className="border border-white/10 px-3 py-2 font-semibold text-slate-100">
                  General Ledger Balance - 30 June 2024
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono font-bold text-slate-100">
                  {formatCurrency(247500)}
                </td>
              </tr>
              <tr>
                <td className="border border-white/10 px-3 py-2 text-slate-300">
                  Less: Outstanding deposits
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-300">
                  {formatCurrency(0)}
                </td>
              </tr>
              <tr>
                <td className="border border-white/10 px-3 py-2 text-slate-300">
                  Add: Outstanding withdrawals
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-300">
                  {formatCurrency(0)}
                </td>
              </tr>
              <tr>
                <td className="border border-white/10 px-3 py-2 text-slate-300">
                  Add: Bank fees not yet recorded
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-300">
                  {formatCurrency(0)}
                </td>
              </tr>
              <tr className="bg-green-500/10">
                <td className="border border-white/10 px-3 py-2 font-semibold text-green-300">
                  Reconciled Bank Balance
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono font-bold text-green-300">
                  {formatCurrency(247500)}
                </td>
              </tr>
              <tr>
                <td className="border border-white/10 px-3 py-2 text-slate-300">
                  Bank Statement Balance - 30 June 2024
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-100">
                  {formatCurrency(247500)}
                </td>
              </tr>
              <tr className="bg-green-500/15">
                <td className="border border-white/10 px-3 py-2 font-bold text-green-300">
                  Difference (should be $0.00)
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono font-bold text-green-300">
                  {formatCurrency(0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Movement Analysis */}
        <div className="border border-white/10 rounded bg-white overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 px-4 py-2">
            <h3 className="font-semibold text-slate-100">Movement from Prior Year</h3>
          </div>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr>
                <td className="border border-white/10 px-3 py-2 text-slate-100">
                  Balance - 30 June 2023
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-100">
                  {formatCurrency(189400)}
                </td>
              </tr>
              <tr>
                <td className="border border-white/10 px-3 py-2 text-slate-300">
                  Add: Cash receipts FY2024
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-green-300">
                  {formatCurrency(2845300)}
                </td>
              </tr>
              <tr>
                <td className="border border-white/10 px-3 py-2 text-slate-300">
                  Less: Cash payments FY2024
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-red-300">
                  ({formatCurrency(2787200)})
                </td>
              </tr>
              <tr className="bg-blue-500/15">
                <td className="border border-white/10 px-3 py-2 font-bold text-blue-300">
                  Balance - 30 June 2024
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono font-bold text-blue-300">
                  {formatCurrency(247500)}
                </td>
              </tr>
              <tr>
                <td className="border border-white/10 px-3 py-2 text-slate-300 font-semibold">
                  Net increase
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono font-semibold text-green-300">
                  {formatCurrency(58100)} (30.7%)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

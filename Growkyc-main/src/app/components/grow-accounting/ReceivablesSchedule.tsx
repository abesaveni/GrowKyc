import React from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Save,
  Download,
  Users,
  AlertTriangle
} from 'lucide-react';

interface ReceivablesScheduleProps {
  onBack?: () => void;
}

export function ReceivablesSchedule({ onBack }: ReceivablesScheduleProps) {
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
            <Users className="w-6 h-6 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-slate-100">LS-02: Trade Receivables</h1>
              <p className="text-xs text-slate-300">Accounts 1200, 1210 • Debtors & Provision • FY2024</p>
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
            <span className="text-slate-300 text-xs">Gross Debtors:</span>
            <div className="font-semibold text-slate-100">$432,800</div>
          </div>
          <div>
            <span className="text-slate-300 text-xs">Provision:</span>
            <div className="font-semibold text-red-400">($12,500)</div>
          </div>
          <div>
            <span className="text-slate-300 text-xs">Net Debtors:</span>
            <div className="font-semibold text-blue-300">$420,300</div>
          </div>
          <div>
            <span className="text-slate-300 text-xs">Days Outstanding:</span>
            <div className="font-semibold text-slate-100">47 days</div>
          </div>
          <div>
            <span className="text-slate-300 text-xs">&gt;90 Days:</span>
            <div className="font-semibold text-amber-400">3 invoices</div>
          </div>
          <div>
            <span className="text-slate-300 text-xs">Provision %:</span>
            <div className="font-semibold text-slate-100">2.9%</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Alert */}
        <div className="bg-amber-500/10 border border-amber-300 rounded p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-semibold text-amber-300">Aged Debtors Review Required</h3>
              <p className="text-sm text-amber-300">
                3 invoices over 90 days totaling $18,400 • Provision adequacy should be reviewed
              </p>
            </div>
          </div>
        </div>

        {/* Lead Schedule Summary */}
        <div className="border border-white/10 rounded bg-white overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 px-4 py-2">
            <h3 className="font-semibold text-slate-100">Receivables Summary</h3>
          </div>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="bg-blue-500/10">
                <td className="border border-white/10 px-3 py-2 font-semibold text-slate-100">
                  Trade Debtors (Gross)
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono font-bold text-slate-100">
                  {formatCurrency(432800)}
                </td>
              </tr>
              <tr>
                <td className="border border-white/10 px-3 py-2 text-slate-300">
                  Less: Provision for Doubtful Debts
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-red-300">
                  ({formatCurrency(12500)})
                </td>
              </tr>
              <tr className="bg-blue-500/15">
                <td className="border border-white/10 px-3 py-2 font-bold text-blue-300">
                  Net Trade Receivables
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono font-bold text-blue-300">
                  {formatCurrency(420300)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Aged Debtors Analysis */}
        <div className="border border-white/10 rounded bg-white overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 px-4 py-2">
            <h3 className="font-semibold text-slate-100">Aged Debtors Analysis</h3>
          </div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Age Category</th>
                <th className="border border-white/10 px-3 py-2 text-right font-semibold text-slate-300">Amount</th>
                <th className="border border-white/10 px-3 py-2 text-right font-semibold text-slate-300">% of Total</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Risk</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-blue-500/10">
                <td className="border border-white/10 px-3 py-2 text-slate-100">Current (0-30 days)</td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-100">{formatCurrency(298600)}</td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-300">69.0%</td>
                <td className="border border-white/10 px-3 py-2 text-center">
                  <span className="px-2 py-0.5 bg-green-500/15 text-green-300 text-xs font-semibold rounded">LOW</span>
                </td>
              </tr>
              <tr className="hover:bg-blue-500/10">
                <td className="border border-white/10 px-3 py-2 text-slate-100">30-60 days</td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-100">{formatCurrency(89200)}</td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-300">20.6%</td>
                <td className="border border-white/10 px-3 py-2 text-center">
                  <span className="px-2 py-0.5 bg-green-500/15 text-green-300 text-xs font-semibold rounded">LOW</span>
                </td>
              </tr>
              <tr className="hover:bg-blue-500/10">
                <td className="border border-white/10 px-3 py-2 text-slate-100">60-90 days</td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-100">{formatCurrency(26600)}</td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-300">6.1%</td>
                <td className="border border-white/10 px-3 py-2 text-center">
                  <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 text-xs font-semibold rounded">MEDIUM</span>
                </td>
              </tr>
              <tr className="hover:bg-blue-500/10 bg-red-500/10">
                <td className="border border-white/10 px-3 py-2 text-slate-100 font-semibold">Over 90 days</td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-red-300 font-semibold">{formatCurrency(18400)}</td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-300">4.3%</td>
                <td className="border border-white/10 px-3 py-2 text-center">
                  <span className="px-2 py-0.5 bg-red-500/15 text-red-300 text-xs font-semibold rounded">HIGH</span>
                </td>
              </tr>
              <tr className="bg-blue-500/15">
                <td className="border border-white/10 px-3 py-2 font-bold text-blue-300">Total Gross Debtors</td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono font-bold text-blue-300">{formatCurrency(432800)}</td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono font-bold text-blue-300">100.0%</td>
                <td className="border border-white/10 px-3 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Provision Movement */}
        <div className="border border-white/10 rounded bg-white overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 px-4 py-2">
            <h3 className="font-semibold text-slate-100">Provision for Doubtful Debts Movement</h3>
          </div>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr>
                <td className="border border-white/10 px-3 py-2 text-slate-100">
                  Opening Balance - 1 July 2023
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-100">
                  {formatCurrency(9800)}
                </td>
              </tr>
              <tr>
                <td className="border border-white/10 px-3 py-2 text-slate-300">
                  Add: Provision expense (P&L)
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-red-300">
                  {formatCurrency(5200)}
                </td>
              </tr>
              <tr>
                <td className="border border-white/10 px-3 py-2 text-slate-300">
                  Less: Bad debts written off
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-green-300">
                  ({formatCurrency(2500)})
                </td>
              </tr>
              <tr className="bg-blue-500/15">
                <td className="border border-white/10 px-3 py-2 font-bold text-blue-300">
                  Closing Balance - 30 June 2024
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono font-bold text-blue-300">
                  {formatCurrency(12500)}
                </td>
              </tr>
              <tr>
                <td className="border border-white/10 px-3 py-2 text-slate-300">
                  Provision as % of gross debtors
                </td>
                <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-300">
                  2.9%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

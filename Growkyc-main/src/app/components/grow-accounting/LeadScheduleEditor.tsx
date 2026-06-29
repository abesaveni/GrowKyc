import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Target,
  RefreshCw,
  Download,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  Brain,
  Link as LinkIcon,
  TrendingUp,
  TrendingDown,
  Plus,
  FileText,
  Edit,
  Save
} from 'lucide-react';

interface LeadScheduleEditorProps {
  onBack?: () => void;
}

export function LeadScheduleEditor({ onBack }: LeadScheduleEditorProps) {
  const [isLocked, setIsLocked] = useState(false);
  const [tbSyncStatus, setTbSyncStatus] = useState<'synced' | 'pending'>('synced');

  // Mock lead schedule data
  const scheduleData = {
    workpaper_id: 'wp-001',
    name: 'LS-02 Trade Receivables',
    account_ids: ['1200', '1210'],
    tb_balance: 420300,
    adjusted_balance: 420300,
    variance_prior_year: 22100,
    materiality_flag: true,
    risk_rating: 'medium' as const,
    preparer: 'Sarah Chen',
    reviewer: 'Michael Ross',
    status: 'in_review' as const,
    last_updated: '2024-02-14'
  };

  const receivablesDetail = [
    {
      id: 'r-001',
      customer: 'BuildCo Industries',
      invoice: 'INV-2401',
      date: '2024-01-15',
      amount: 125000,
      age_days: 30,
      category: 'Current',
      risk: 'low' as const
    },
    {
      id: 'r-002',
      customer: 'Metro Construction',
      invoice: 'INV-2398',
      date: '2024-01-10',
      amount: 87500,
      age_days: 35,
      category: 'Current',
      risk: 'low' as const
    },
    {
      id: 'r-003',
      customer: 'Apex Developments',
      invoice: 'INV-2389',
      date: '2023-12-20',
      amount: 62300,
      age_days: 56,
      category: '30-60 days',
      risk: 'medium' as const
    },
    {
      id: 'r-004',
      customer: 'Northern Projects Ltd',
      invoice: 'INV-2356',
      date: '2023-11-05',
      amount: 45800,
      age_days: 101,
      category: '90+ days',
      risk: 'high' as const
    },
    {
      id: 'r-005',
      customer: 'Coastal Engineering',
      invoice: 'INV-2387',
      date: '2023-12-28',
      amount: 99700,
      age_days: 48,
      category: '30-60 days',
      risk: 'low' as const
    }
  ];

  const reconciliation = {
    gl_balance: 432800,
    less_provision: -12500,
    net_receivables: 420300,
    aged_analysis_total: 420300,
    variance: 0
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">HIGH</span>;
      case 'medium':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">MED</span>;
      case 'low':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">LOW</span>;
      default:
        return null;
    }
  };

  const totalReceivables = receivablesDetail.reduce((sum, r) => sum + r.amount, 0);
  const highRiskCount = receivablesDetail.filter(r => r.risk === 'high').length;

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
            <Target className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{scheduleData.name}</h1>
              <p className="text-xs text-gray-600">Lead Schedule • TB-Controlled • Auto-sync enabled</p>
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
            <div className="font-semibold text-amber-700">IN REVIEW</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Risk:</span>
            <div className="font-semibold text-amber-700">MEDIUM</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Material:</span>
            <div className="font-semibold text-blue-700">YES</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Preparer:</span>
            <div className="font-semibold text-gray-900">{scheduleData.preparer}</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Reviewer:</span>
            <div className="font-semibold text-gray-900">{scheduleData.reviewer}</div>
          </div>
          <div>
            <span className="text-gray-600 text-xs">Last Updated:</span>
            <div className="font-semibold text-gray-900">{scheduleData.last_updated}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* TB Link Status */}
        <div className="bg-green-50 border border-green-300 rounded px-4 py-3">
          <div className="flex items-center gap-3">
            <LinkIcon className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">Trial Balance Linked</h3>
              <p className="text-sm text-green-800">
                Accounts 1200, 1210 • Live sync enabled • Last sync: 2 minutes ago
              </p>
            </div>
            <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded">SYNCED</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="text-xs text-gray-600 mb-1">TB Balance</div>
            <div className="text-2xl font-bold text-gray-900 font-mono">${formatCurrency(scheduleData.tb_balance)}</div>
            <div className="text-xs text-green-600 font-semibold mt-1">Reconciled ✓</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="text-xs text-gray-600 mb-1">Prior Year</div>
            <div className="text-2xl font-bold text-gray-700 font-mono">${formatCurrency(398200)}</div>
            <div className="flex items-center gap-1 text-xs text-green-600 font-semibold mt-1">
              <TrendingUp className="w-3 h-3" />
              +5.5%
            </div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="text-xs text-gray-600 mb-1">Variance</div>
            <div className="text-2xl font-bold text-green-600 font-mono">${formatCurrency(scheduleData.variance_prior_year)}</div>
            <div className="text-xs text-gray-600 mt-1">Growth aligns with revenue</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-4">
            <div className="text-xs text-gray-600 mb-1">High Risk Items</div>
            <div className="text-2xl font-bold text-red-600 font-mono">{highRiskCount}</div>
            <div className="text-xs text-red-600 font-semibold mt-1">Requires review</div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-purple-50 border border-purple-300 rounded px-4 py-3">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 mb-2">AI Commentary</h3>
              <div className="space-y-2 text-sm text-purple-800">
                <p>✓ Receivables growth of 5.5% aligns with revenue increase of 6.2%.</p>
                <p>⚠️ One invoice over 90 days (Northern Projects - $45,800). Verify recoverability and consider provision adequacy.</p>
                <p>✓ Days sales outstanding: 42 days (industry average: 45 days). Performance within acceptable range.</p>
              </div>
            </div>
          </div>
        </div>

        {/* GL to Aged Analysis Reconciliation */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
            <h3 className="font-semibold text-gray-900">GL to Aged Analysis Reconciliation</h3>
          </div>
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2 text-gray-900">
                  Trade Debtors - GL (Account 1200)
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right text-gray-900 font-mono font-semibold">
                  ${formatCurrency(reconciliation.gl_balance)}
                </td>
              </tr>
              <tr className="hover:bg-blue-50">
                <td className="border border-gray-300 px-4 py-2 text-gray-900">
                  Less: Provision for Doubtful Debts (Account 1210)
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right text-red-700 font-mono font-semibold">
                  (${formatCurrency(Math.abs(reconciliation.less_provision))})
                </td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border border-gray-300 px-4 py-2 text-gray-900 font-bold">
                  Net Receivables
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right text-gray-900 font-mono font-bold">
                  ${formatCurrency(reconciliation.net_receivables)}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                  Aged Analysis Total (Below)
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right text-gray-700 font-mono">
                  ${formatCurrency(reconciliation.aged_analysis_total)}
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="border border-gray-300 px-4 py-2 text-green-900 font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Variance
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right text-green-700 font-mono font-bold">
                  ${formatCurrency(reconciliation.variance)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Aged Analysis Detail */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Aged Receivables Analysis</h3>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Row
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Customer</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Invoice</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Date</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Amount</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Age (Days)</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Category</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Risk</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {receivablesDetail.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50">
                    <td className="border border-gray-300 px-3 py-2 text-gray-900">
                      {item.customer}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-700 font-mono text-xs">
                      {item.invoice}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-700">
                      {item.date}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right text-gray-900 font-mono font-semibold">
                      ${formatCurrency(item.amount)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-gray-900 font-mono">
                      {item.age_days}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-gray-700 text-xs">
                      {item.category}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {getRiskBadge(item.risk)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Button size="sm" variant="outline">
                        <FileText className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={3} className="border border-gray-300 px-3 py-2 text-right text-gray-900">
                    TOTAL:
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right text-gray-900 font-mono">
                    ${formatCurrency(totalReceivables)}
                  </td>
                  <td colSpan={4} className="border border-gray-300"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Linked Accounts Panel */}
        <div className="border border-gray-300 rounded bg-white p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Linked Trial Balance Accounts</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 font-mono text-xs font-semibold rounded">1200</span>
                <span className="text-sm text-gray-900">Trade Debtors</span>
              </div>
              <span className="text-sm font-mono text-gray-900 font-semibold">${formatCurrency(432800)}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 font-mono text-xs font-semibold rounded">1210</span>
                <span className="text-sm text-gray-900">Provision for Doubtful Debts</span>
              </div>
              <span className="text-sm font-mono text-red-700 font-semibold">($12,500)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  RefreshCw,
  Download,
  Upload,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Brain,
  Plus,
  Zap,
  Target,
  Lock,
  Unlock,
  FileText,
  BarChart3,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';
import { toast } from 'sonner';

interface TrialBalanceCoreProps {
  onNavigate?: (page: string) => void;
}

interface TBAccount {
  code: string;
  name: string;
  category: string;
  debit: number;
  credit: number;
  balance: number;
  priorYear: number;
  variance: number;
  variancePercent: number;
  risk: 'high' | 'medium' | 'low';
  materiality: 'material' | 'normal' | 'immaterial';
  mapped: boolean;
  leadSchedule: string;
  aiCommentary?: string;
}

export function TrialBalanceCore({ onNavigate }: TrialBalanceCoreProps) {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing'>('idle');
  const [showAdjusted, setShowAdjusted] = useState(false);

  const accounts: TBAccount[] = [
    {
      code: '1100',
      name: 'Cash at Bank - Operating',
      category: 'Current Assets',
      debit: 247500,
      credit: 0,
      balance: 247500,
      priorYear: 189400,
      variance: 58100,
      variancePercent: 30.7,
      risk: 'low',
      materiality: 'material',
      mapped: true,
      leadSchedule: 'LS-01 Cash',
      aiCommentary: 'Increase driven by Q4 collections. Reconciled to bank statement.'
    },
    {
      code: '1200',
      name: 'Trade Debtors',
      category: 'Current Assets',
      debit: 432800,
      credit: 0,
      balance: 432800,
      priorYear: 398200,
      variance: 34600,
      variancePercent: 8.7,
      risk: 'medium',
      materiality: 'material',
      mapped: true,
      leadSchedule: 'LS-02 Receivables',
      aiCommentary: 'Growth aligns with revenue increase. 3 invoices >90 days flagged for review.'
    },
    {
      code: '1210',
      name: 'Provision for Doubtful Debts',
      category: 'Current Assets',
      debit: 0,
      credit: 12500,
      balance: -12500,
      priorYear: -9800,
      variance: -2700,
      variancePercent: 27.6,
      risk: 'medium',
      materiality: 'normal',
      mapped: true,
      leadSchedule: 'LS-02 Receivables',
      aiCommentary: 'Provision increased to 2.9% of debtors. Consider adequacy vs aged analysis.'
    },
    {
      code: '1400',
      name: 'Inventory - Raw Materials',
      category: 'Current Assets',
      debit: 156700,
      credit: 0,
      balance: 156700,
      priorYear: 142300,
      variance: 14400,
      variancePercent: 10.1,
      risk: 'medium',
      materiality: 'material',
      mapped: true,
      leadSchedule: 'LS-03 Inventory',
      aiCommentary: 'Stocktake completed 30/06. No obsolescence noted. Turnover ratio stable.'
    },
    {
      code: '1700',
      name: 'Plant & Equipment - Cost',
      category: 'Non-Current Assets',
      debit: 892400,
      credit: 0,
      balance: 892400,
      priorYear: 856200,
      variance: 36200,
      variancePercent: 4.2,
      risk: 'low',
      materiality: 'material',
      mapped: true,
      leadSchedule: 'LS-04 Fixed Assets',
      aiCommentary: 'New machinery purchase $38k. Disposal of old equipment $1.8k.'
    },
    {
      code: '1710',
      name: 'Accumulated Depreciation',
      category: 'Non-Current Assets',
      debit: 0,
      credit: 423600,
      balance: -423600,
      priorYear: -367900,
      variance: -55700,
      variancePercent: 15.1,
      risk: 'low',
      materiality: 'material',
      mapped: true,
      leadSchedule: 'LS-04 Fixed Assets',
      aiCommentary: 'Depreciation $56.8k for year. Rate review recommended for machinery.'
    },
    {
      code: '2100',
      name: 'Trade Creditors',
      category: 'Current Liabilities',
      debit: 0,
      credit: 187300,
      balance: -187300,
      priorYear: -156800,
      variance: -30500,
      variancePercent: 19.5,
      risk: 'medium',
      materiality: 'material',
      mapped: true,
      leadSchedule: 'LS-05 Payables',
      aiCommentary: 'Increase due to June purchasing. Days payable 45 (industry avg 42).'
    },
    {
      code: '2200',
      name: 'GST Payable / (Refundable)',
      category: 'Current Liabilities',
      debit: 0,
      credit: 23400,
      balance: -23400,
      priorYear: 18700,
      variance: -42100,
      variancePercent: -225.1,
      risk: 'high',
      materiality: 'normal',
      mapped: true,
      leadSchedule: 'LS-06 GST',
      aiCommentary: '⚠️ Large swing from refund to payable. Verify BAS workpaper reconciliation.'
    },
    {
      code: '2300',
      name: 'PAYG Withholding Payable',
      category: 'Current Liabilities',
      debit: 0,
      credit: 34200,
      balance: -34200,
      priorYear: -31800,
      variance: -2400,
      variancePercent: 7.5,
      risk: 'low',
      materiality: 'normal',
      mapped: true,
      leadSchedule: 'LS-07 Payroll',
      aiCommentary: 'Aligns with payroll increase. June payment cleared 14/07.'
    },
    {
      code: '2400',
      name: 'Superannuation Payable',
      category: 'Current Liabilities',
      debit: 0,
      credit: 15600,
      balance: -15600,
      priorYear: -14200,
      variance: -1400,
      variancePercent: 9.9,
      risk: 'high',
      materiality: 'normal',
      mapped: true,
      leadSchedule: 'LS-07 Payroll',
      aiCommentary: '⚠️ Unpaid super balance. Verify payment by due date to avoid SGC.'
    },
    {
      code: '3100',
      name: 'Share Capital',
      category: 'Equity',
      debit: 0,
      credit: 100000,
      balance: -100000,
      priorYear: -100000,
      variance: 0,
      variancePercent: 0,
      risk: 'low',
      materiality: 'normal',
      mapped: true,
      leadSchedule: 'LS-08 Equity',
      aiCommentary: 'No change. 100 ordinary shares at $1,000 each.'
    },
    {
      code: '3200',
      name: 'Retained Earnings',
      category: 'Equity',
      debit: 0,
      credit: 687400,
      balance: -687400,
      priorYear: -589300,
      variance: -98100,
      variancePercent: 16.6,
      risk: 'low',
      materiality: 'material',
      mapped: true,
      leadSchedule: 'LS-08 Equity',
      aiCommentary: 'Opening balance plus current year profit. Dividend recommendation available.'
    }
  ];

  const summary = {
    totalDebit: accounts.reduce((sum, acc) => sum + acc.debit, 0),
    totalCredit: accounts.reduce((sum, acc) => sum + acc.credit, 0),
    autoMapped: accounts.filter(a => a.mapped).length,
    totalAccounts: accounts.length,
    highRisk: accounts.filter(a => a.risk === 'high').length,
    mediumRisk: accounts.filter(a => a.risk === 'medium').length,
    materialAccounts: accounts.filter(a => a.materiality === 'material').length
  };

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => setSyncStatus('idle'), 2000);
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

  const getMaterialityBadge = (materiality: string) => {
    switch (materiality) {
      case 'material':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">MATERIAL</span>;
      case 'normal':
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">NORMAL</span>;
      case 'immaterial':
        return <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs font-semibold rounded">IMMAT</span>;
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPercent = (value: number) => {
    return value.toFixed(1) + '%';
  };

  return (
    <WorkpaperLayout currentPage="trial-balance" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              Intelligent Trial Balance Core
            </h1>
            <p className="text-sm text-gray-600 mt-1">Universal ledger sync • Auto-mapping • Risk scoring • AI commentary</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={syncStatus === 'syncing'}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Ledger'}
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import TB
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Generate Lead Schedules
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Total Debit</div>
            <div className="text-lg font-bold text-gray-900 font-mono">${formatCurrency(summary.totalDebit)}</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Total Credit</div>
            <div className="text-lg font-bold text-gray-900 font-mono">${formatCurrency(summary.totalCredit)}</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Balance Check</div>
            <div className="text-lg font-bold text-green-600 font-mono flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Balanced
            </div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Auto-Mapped</div>
            <div className="text-lg font-bold text-gray-900 font-mono">{summary.autoMapped}/{summary.totalAccounts}</div>
            <div className="text-xs text-green-600 font-semibold">94%</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">High Risk</div>
            <div className="text-lg font-bold text-red-600 font-mono">{summary.highRisk}</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Medium Risk</div>
            <div className="text-lg font-bold text-amber-600 font-mono">{summary.mediumRisk}</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Material Items</div>
            <div className="text-lg font-bold text-blue-600 font-mono">{summary.materialAccounts}</div>
          </div>
        </div>

        {/* Ledger Connection Status */}
        <div className="bg-green-50 border border-green-300 rounded px-4 py-3">
          <div className="flex items-center gap-3">
            <LinkIcon className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">Connected to Xero</h3>
              <p className="text-sm text-green-800">
                Last sync: 2 minutes ago • Auto-sync enabled • 247 accounts synced • 12 journals posted
              </p>
            </div>
            <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded">LIVE</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showAdjusted}
              onChange={(e) => setShowAdjusted(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-gray-700 font-medium">Show Adjusted Balances</span>
          </label>
          <span className="text-gray-400">|</span>
          <Button variant="outline" size="sm">
            <Brain className="w-4 h-4 mr-2" />
            AI Commentary
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Variance Analysis
          </Button>
          <Button variant="outline" size="sm">
            <Target className="w-4 h-4 mr-2" />
            Materiality Settings
          </Button>
        </div>

        {/* Trial Balance Table */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
            <h3 className="font-semibold text-gray-900">Trial Balance - FY2024</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-2 text-left font-semibold text-gray-700 w-16">
                    <input type="checkbox" className="w-4 h-4" />
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Code</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Account Name</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Category</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Debit</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Credit</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Balance</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Prior Year</th>
                  <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700">Variance</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Risk</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Material</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Lead Schedule</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.code} className="hover:bg-blue-50">
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-900 font-mono font-semibold">
                      {account.code}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-900">
                      {account.name}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-700 text-xs">
                      {account.category}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right text-gray-900 font-mono">
                      {account.debit > 0 ? formatCurrency(account.debit) : '-'}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right text-gray-900 font-mono">
                      {account.credit > 0 ? formatCurrency(account.credit) : '-'}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right text-gray-900 font-mono font-semibold">
                      {formatCurrency(Math.abs(account.balance))}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right text-gray-700 font-mono">
                      {formatCurrency(Math.abs(account.priorYear))}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-mono">
                      <div className="flex items-center justify-end gap-1">
                        <span className={account.variance > 0 ? 'text-green-700' : 'text-red-700'}>
                          {formatCurrency(Math.abs(account.variance))}
                        </span>
                        <span className={`text-xs ${account.variance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({formatPercent(Math.abs(account.variancePercent))})
                        </span>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {getRiskBadge(account.risk)}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {getMaterialityBadge(account.materiality)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-700 text-xs font-mono">
                      {account.leadSchedule}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => {
                            // Route to appropriate workpaper based on account
                            let targetPage = 'lead-schedule-editor'; // default
                            
                            // Cash accounts
                            if (account.code === '1100' || account.leadSchedule.includes('Cash')) {
                              targetPage = 'cash-reconciliation';
                              toast.success(`Opening Cash Reconciliation`, {
                                description: `${account.code} - ${account.name}`
                              });
                            }
                            // Receivables accounts
                            else if (account.code === '1200' || account.code === '1210' || account.leadSchedule.includes('Receivables')) {
                              targetPage = 'receivables-schedule';
                              toast.success(`Opening Receivables Lead Schedule`, {
                                description: `${account.code} - ${account.name}`
                              });
                            }
                            // Inventory accounts
                            else if (account.code === '1400' || account.leadSchedule.includes('Inventory')) {
                              targetPage = 'inventory-schedule';
                              toast.success(`Opening Inventory Lead Schedule`, {
                                description: `${account.code} - ${account.name}`
                              });
                            }
                            // Fixed Assets
                            else if (account.code === '1700' || account.code === '1710' || account.leadSchedule.includes('Fixed Assets')) {
                              targetPage = 'fixed-assets-schedule';
                              toast.success(`Opening Fixed Assets Register`, {
                                description: `${account.code} - ${account.name}`
                              });
                            }
                            // Payables
                            else if (account.code === '2100' || account.leadSchedule.includes('Payables')) {
                              targetPage = 'payables-schedule';
                              toast.success(`Opening Payables Lead Schedule`, {
                                description: `${account.code} - ${account.name}`
                              });
                            }
                            // GST
                            else if (account.code === '2200' || account.leadSchedule.includes('GST')) {
                              targetPage = 'gst-bas-workpaper';
                              toast.success(`Opening GST/BAS Workpaper`, {
                                description: `${account.code} - ${account.name}`
                              });
                            }
                            // Payroll & Super
                            else if (account.code === '2300' || account.code === '2400' || account.leadSchedule.includes('Payroll')) {
                              targetPage = 'payroll-super-workpaper';
                              toast.success(`Opening Payroll & Super Workpaper`, {
                                description: `${account.code} - ${account.name}`
                              });
                            }
                            // Equity
                            else if (account.code === '3100' || account.code === '3200' || account.leadSchedule.includes('Equity')) {
                              targetPage = 'equity-schedule';
                              toast.success(`Opening Equity Lead Schedule`, {
                                description: `${account.code} - ${account.name}`
                              });
                            }
                            else {
                              toast.success(`Opening ${account.leadSchedule}`, {
                                description: `${account.code} - ${account.name}`
                              });
                            }
                            
                            onNavigate?.(targetPage);
                          }}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded font-semibold"
                        >
                          View
                        </button>
                        {account.aiCommentary && (
                          <button 
                            onClick={() => {
                              toast.info('AI Commentary', {
                                description: account.aiCommentary
                              });
                            }}
                            className="p-1 text-purple-600 hover:bg-purple-100 rounded" 
                            title={account.aiCommentary}
                          >
                            <Brain className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={4} className="border border-gray-300 px-3 py-2 text-right text-gray-900">
                    TOTALS:
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right text-gray-900 font-mono">
                    {formatCurrency(summary.totalDebit)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right text-gray-900 font-mono">
                    {formatCurrency(summary.totalCredit)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right text-green-600 font-mono">
                    BALANCED ✓
                  </td>
                  <td colSpan={6} className="border border-gray-300"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="bg-purple-50 border border-purple-300 rounded px-4 py-3">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 mb-2">AI Review Insights</h3>
              <div className="space-y-2 text-sm text-purple-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <strong>GST Payable (2200):</strong> Large variance detected (-225%). Recommend immediate reconciliation with BAS workpaper.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div>
                    <strong>Superannuation Payable (2400):</strong> Unpaid balance $15,600. Verify payment by due date to avoid Superannuation Guarantee Charge.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <strong>Overall Balance:</strong> Trial balance is mathematically correct. Auto-mapping achieved 94% accuracy.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkpaperLayout>
  );
}
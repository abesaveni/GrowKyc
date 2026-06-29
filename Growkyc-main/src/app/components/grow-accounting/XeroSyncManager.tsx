import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  RefreshCw,
  Download,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Database,
  TrendingUp,
  Shield,
  Lock,
  FileText,
  DollarSign,
  Users,
  BarChart3,
  Calendar
} from 'lucide-react';

interface XeroSyncManagerProps {
  onBack?: () => void;
}

export function XeroSyncManager({ onBack }: XeroSyncManagerProps) {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing'>('idle');
  const [selectedTiers, setSelectedTiers] = useState<string[]>(['tier1', 'tier2', 'tier3', 'tier4', 'tier5']);

  // Mock sync config
  const syncConfig = {
    tenantID: 'xero-tenant-12345',
    organisationID: 'org-67890',
    organisationName: 'Acme Manufacturing Pty Ltd',
    lastSyncDate: '2024-02-14 09:15:23',
    pullOnBinderCreation: true,
    pullOnManualRefresh: true,
    nightlyDeltaSync: true,
    status: 'connected' as const
  };

  // Mock sync history
  const syncHistory = [
    {
      syncID: 'sync-001',
      syncType: 'FULL_PULL' as const,
      startedAt: '2024-02-14 09:15:23',
      completedAt: '2024-02-14 09:18:45',
      status: 'COMPLETED' as const,
      recordsPulled: 2847,
      duration: '3m 22s'
    },
    {
      syncID: 'sync-002',
      syncType: 'DELTA_PULL' as const,
      startedAt: '2024-02-13 02:00:00',
      completedAt: '2024-02-13 02:01:15',
      status: 'COMPLETED' as const,
      recordsPulled: 127,
      duration: '1m 15s'
    },
    {
      syncID: 'sync-003',
      syncType: 'JOURNAL_PUSH' as const,
      startedAt: '2024-02-12 14:30:00',
      completedAt: '2024-02-12 14:30:05',
      status: 'COMPLETED' as const,
      recordsPushed: 1,
      duration: '5s'
    }
  ];

  const dataTiers = [
    {
      id: 'tier1',
      name: 'TIER 1 - Core Financial Control',
      priority: 'MANDATORY',
      color: 'red',
      items: [
        { name: 'Organisation Settings', count: 1, status: 'synced' as const },
        { name: 'Chart of Accounts', count: 247, status: 'synced' as const },
        { name: 'Trial Balance', count: 247, status: 'synced' as const },
        { name: 'General Ledger Transactions', count: 1834, status: 'synced' as const },
        { name: 'Manual Journals', count: 23, status: 'synced' as const }
      ],
      uses: ['TB mapping', 'Risk scoring', 'Trigger detection', 'Lock enforcement']
    },
    {
      id: 'tier2',
      name: 'TIER 2 - Working Capital Intelligence',
      priority: 'HIGH',
      color: 'orange',
      items: [
        { name: 'Outstanding Sales Invoices', count: 42, status: 'synced' as const },
        { name: 'Outstanding Bills', count: 38, status: 'synced' as const },
        { name: 'Bank Accounts', count: 4, status: 'synced' as const }
      ],
      uses: ['Debtors ageing', 'Bad debt provision', 'Revenue cut-off', 'Cash stress flags']
    },
    {
      id: 'tier3',
      name: 'TIER 3 - Payroll and Super',
      priority: 'HIGH',
      color: 'amber',
      items: [
        { name: 'Payroll Summary', count: 12, status: 'synced' as const },
        { name: 'Payroll Liabilities', count: 1, status: 'synced' as const }
      ],
      uses: ['Super unpaid detection', 'SGC exposure', 'Payroll recon']
    },
    {
      id: 'tier4',
      name: 'TIER 4 - Asset and Capital Structure',
      priority: 'MEDIUM',
      color: 'blue',
      items: [
        { name: 'Fixed Assets', count: 47, status: 'synced' as const },
        { name: 'Contacts', count: 234, status: 'synced' as const }
      ],
      uses: ['Depreciation schedule', 'Div 7A trigger', 'Related party detection']
    },
    {
      id: 'tier5',
      name: 'TIER 5 - GST & Tax Intelligence',
      priority: 'HIGH',
      color: 'purple',
      items: [
        { name: 'Tax Codes', count: 18, status: 'synced' as const },
        { name: 'BAS / GST Reports', count: 4, status: 'synced' as const }
      ],
      uses: ['GST coding analysis', 'BAS recon', 'GST control recon']
    },
    {
      id: 'tier6',
      name: 'TIER 6 - Optional High Value',
      priority: 'OPTIONAL',
      color: 'gray',
      items: [
        { name: 'Budgets', count: 12, status: 'not_synced' as const },
        { name: 'Tracking Categories', count: 3, status: 'synced' as const },
        { name: 'Attachments Metadata', count: 156, status: 'not_synced' as const }
      ],
      uses: ['Budget vs actual', 'Allocation analysis', 'Evidence linking']
    }
  ];

  const derivedMetrics = [
    {
      category: 'Materiality',
      metrics: [
        { name: 'Overall Materiality', value: '$45,000', color: 'blue' },
        { name: 'Performance Materiality', value: '$33,750', color: 'blue' },
        { name: 'Clearly Trivial', value: '$2,250', color: 'gray' }
      ]
    },
    {
      category: 'Risk Scoring',
      metrics: [
        { name: 'Account Volatility (High)', value: '8 accounts', color: 'red' },
        { name: 'Journal Density Ratio', value: '12.4%', color: 'amber' },
        { name: 'Manual Journal %', value: '1.25%', color: 'green' }
      ]
    },
    {
      category: 'Working Capital',
      metrics: [
        { name: 'AR Overdue', value: '18.3%', color: 'amber' },
        { name: 'AP Overdue', value: '7.2%', color: 'green' },
        { name: 'Top Customer Concentration', value: '24.5%', color: 'amber' }
      ]
    },
    {
      category: 'Compliance Risk',
      metrics: [
        { name: 'Cut-off Spikes', value: '2 detected', color: 'red' },
        { name: 'Super Unpaid Ratio', value: '8.2%', color: 'red' },
        { name: 'Unreconciled Bank Accounts', value: '0', color: 'green' }
      ]
    }
  ];

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('idle');
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'not_synced':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'MANDATORY':
        return <span className="px-2 py-0.5 bg-red-500/15 text-red-300 text-xs font-semibold rounded">MANDATORY</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 bg-orange-500/15 text-orange-300 text-xs font-semibold rounded">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 bg-blue-500/15 text-blue-300 text-xs font-semibold rounded">MEDIUM</span>;
      case 'OPTIONAL':
        return <span className="px-2 py-0.5 bg-white/5 text-slate-300 text-xs font-semibold rounded">OPTIONAL</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-400" />
              Xero Data Sync Manager
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Comprehensive data pull for compliance, risk scoring, and automation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Sync Report
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSync}
              disabled={syncStatus === 'syncing'}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              {syncStatus === 'syncing' ? 'Syncing...' : 'Full Sync Now'}
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-green-500/10 border border-green-300 rounded px-4 py-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-300">Connected to Xero</h3>
              <p className="text-sm text-green-300">
                <strong>{syncConfig.organisationName}</strong> • Last sync: {syncConfig.lastSyncDate} • Tenant ID: {syncConfig.tenantID}
              </p>
            </div>
            <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded">LIVE</span>
          </div>
        </div>

        {/* Sync Strategy Config */}
        <div className="bg-white border border-white/10 rounded p-4">
          <h3 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Sync Strategy Configuration
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-300">Pull on binder creation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-300">Pull on manual refresh</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-300">Nightly delta sync</span>
            </div>
          </div>
        </div>

        {/* Push Control Warning */}
        <div className="bg-red-500/10 border border-red-300 rounded px-4 py-3">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-red-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-300 mb-1">Controlled Write Policy</h3>
              <p className="text-sm text-red-300">
                <strong>Push back ONLY controlled draft journals.</strong> No uncontrolled writes. All journals require reviewer approval and are pushed as DRAFT status only. Manual posting required in Xero.
              </p>
            </div>
          </div>
        </div>

        {/* Data Tier Selection */}
        <div className="bg-white border border-white/10 rounded overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 px-4 py-3">
            <h3 className="font-semibold text-slate-100">Data Pull Tiers (6 Priority Levels)</h3>
          </div>
          <div className="p-4 space-y-4">
            {dataTiers.map((tier) => (
              <div key={tier.id} className="border border-white/10 rounded overflow-hidden">
                <div className="bg-white/5 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedTiers.includes(tier.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTiers([...selectedTiers, tier.id]);
                        } else {
                          setSelectedTiers(selectedTiers.filter(t => t !== tier.id));
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <h4 className="font-semibold text-slate-100">{tier.name}</h4>
                    {getPriorityBadge(tier.priority)}
                  </div>
                  <span className="text-sm text-slate-300">
                    {tier.items.reduce((sum, item) => sum + item.count, 0).toLocaleString()} records
                  </span>
                </div>
                
                <div className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 text-slate-300 font-semibold">Data Type</th>
                        <th className="text-center py-2 text-slate-300 font-semibold">Count</th>
                        <th className="text-center py-2 text-slate-300 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tier.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-white/10 hover:bg-blue-500/10">
                          <td className="py-2 text-slate-100">{item.name}</td>
                          <td className="py-2 text-center text-slate-300 font-mono">{item.count}</td>
                          <td className="py-2 text-center">{getStatusIcon(item.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-slate-300">
                      <strong>Used for:</strong> {tier.uses.join(' • ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Derived Metrics */}
        <div className="bg-white border border-white/10 rounded overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 px-4 py-3">
            <h3 className="font-semibold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Derived Metrics (Computed Internally)
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-6">
              {derivedMetrics.map((category, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-slate-100 mb-3">{category.category}</h4>
                  <div className="space-y-2">
                    {category.metrics.map((metric, midx) => (
                      <div key={midx} className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <span className="text-sm text-slate-300">{metric.name}</span>
                        <span className={`text-sm font-bold ${
                          metric.color === 'red' ? 'text-red-400' :
                          metric.color === 'amber' ? 'text-amber-400' :
                          metric.color === 'green' ? 'text-green-400' :
                          metric.color === 'blue' ? 'text-blue-400' :
                          'text-slate-300'
                        }`}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-slate-300">
                These metrics feed into: <strong>Risk score • Binder builder • Review escalation • AI insights</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Sync History */}
        <div className="bg-white border border-white/10 rounded overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 px-4 py-3">
            <h3 className="font-semibold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-300" />
              Sync History
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5">
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Sync ID</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Type</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Started</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Completed</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Records</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Duration</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {syncHistory.map((sync) => (
                <tr key={sync.syncID} className="hover:bg-blue-500/10">
                  <td className="border border-white/10 px-3 py-2 text-slate-100 font-mono text-xs">
                    {sync.syncID}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                      sync.syncType === 'FULL_PULL' ? 'bg-blue-500/15 text-blue-300' :
                      sync.syncType === 'DELTA_PULL' ? 'bg-purple-500/15 text-purple-300' :
                      'bg-green-500/15 text-green-300'
                    }`}>
                      {sync.syncType}
                    </span>
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300 text-xs">
                    {sync.startedAt}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300 text-xs">
                    {sync.completedAt}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center text-slate-100 font-mono">
                    {sync.recordsPulled ? `${sync.recordsPulled} pulled` : sync.recordsPushed ? `${sync.recordsPushed} pushed` : '-'}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center text-slate-300 font-mono">
                    {sync.duration}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Minimum V1 Pull Info */}
        <div className="bg-blue-500/10 border border-blue-300 rounded px-4 py-3">
          <h3 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Minimum V1 Pull (Lean Mode)
          </h3>
          <p className="text-sm text-blue-300 mb-2">
            For resource-constrained implementations, pull minimum viable dataset:
          </p>
          <div className="grid grid-cols-4 gap-2 text-xs text-blue-300">
            <div>✓ Organisation</div>
            <div>✓ Chart of Accounts</div>
            <div>✓ Trial Balance</div>
            <div>✓ GL Summary (12mo)</div>
            <div>✓ Outstanding AR/AP</div>
            <div>✓ Manual Journals</div>
            <div>✓ Tax Codes</div>
            <div>✓ Bank Accounts</div>
          </div>
        </div>
      </div>
    </div>
  );
}

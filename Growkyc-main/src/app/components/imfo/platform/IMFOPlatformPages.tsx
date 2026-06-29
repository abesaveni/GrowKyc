import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Building2, Database, DollarSign, GitBranch, Lock, Shield, Target, TrendingUp, Wallet } from 'lucide-react';
import { Button } from '../../ui/button';
import { DataTable, Column } from '../../shared/dashboard/DataTable';
import { StatusPill } from '../../shared/dashboard/StatusPill';
import { ProgressBar } from '../../shared/dashboard/ProgressBar';
import { IMFOPlatformLayout } from './IMFOPlatformLayout';

type PageProps = { role: string; onNavigate?: (page: string) => void };

function useMockLoad<T>(data: T, ms = 400): { data: T | null; loading: boolean } {
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState<T | null>(null);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setValue(data);
      setLoading(false);
    }, ms);
    return () => clearTimeout(t);
  }, []);
  return { data: value, loading };
}

function MetricCards({ items }: { items: { label: string; value: string; sub?: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((m) => (
        <div key={m.label} className="bg-white border border-white/10 rounded-lg p-4">
          <p className="text-sm text-slate-300">{m.label}</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">{m.value}</p>
          {m.sub && <p className="text-xs text-slate-400 mt-1">{m.sub}</p>}
        </div>
      ))}
    </div>
  );
}

function ActivityTimeline({ events }: { events: { time: string; text: string }[] }) {
  return (
    <div className="bg-white border border-white/10 rounded-lg p-4">
      <h3 className="font-semibold text-slate-100 mb-3">Recent activity</h3>
      <ul className="space-y-3">
        {events.map((e, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <Activity className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-slate-100">{e.text}</p>
              <p className="text-slate-400 text-xs">{e.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function InvestorTiersPage({ role, onNavigate }: PageProps) {
  const rows = [
    { id: '1', tier: 'Tier A', investors: 12, access: 'All strategies', status: 'active' },
    { id: '2', tier: 'Tier B', investors: 28, access: 'Mortgage, SME', status: 'active' },
    { id: '3', tier: 'Tier C', investors: 45, access: 'Mortgage only', status: 'active' }
  ];
  const { data, loading } = useMockLoad(rows);
  const columns: Column<(typeof rows)[0]>[] = [
    { key: 'tier', label: 'Tier', sortable: true },
    { key: 'investors', label: 'Investors', sortable: true },
    { key: 'access', label: 'Strategy access' },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> }
  ];
  return (
    <IMFOPlatformLayout title="Investor tiers & access" description="Tier classification and strategy entitlements." section="Investors" onNavigate={onNavigate} loading={loading}>
      {data && (
        <>
          <MetricCards items={[{ label: 'Active tiers', value: '5' }, { label: 'Restricted deals', value: '3' }, { label: 'Pending reviews', value: '2' }]} />
          <DataTable columns={columns} data={data} getRowId={(r) => r.id} />
          <ActivityTimeline events={[{ time: '2h ago', text: 'Tier B access updated for Retail Co-op' }, { time: 'Yesterday', text: 'New Tier A investor admitted' }]} />
        </>
      )}
    </IMFOPlatformLayout>
  );
}

export function FundSetupPage({ onNavigate }: PageProps) {
  const rows = [
    { id: 'F1', name: 'Growth Credit Fund I', type: 'Unit trust', status: 'active', aum: '$125M' },
    { id: 'F2', name: 'High Yield SPV Series', type: 'SPV series', status: 'draft', aum: '—' }
  ];
  const { data, loading } = useMockLoad(rows);
  const columns: Column<(typeof rows)[0]>[] = [
    { key: 'name', label: 'Fund', sortable: true },
    { key: 'type', label: 'Structure' },
    { key: 'aum', label: 'AUM', align: 'right' },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> }
  ];
  return (
    <IMFOPlatformLayout title="Fund setup" description="Configure funds, classes, and operational parameters." section="Funds" onNavigate={onNavigate} loading={loading} actions={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white">New fund</Button>}>
      {data && <DataTable columns={columns} data={data} getRowId={(r) => r.id} />}
    </IMFOPlatformLayout>
  );
}

export function SpvManagementPage({ onNavigate }: PageProps) {
  const rows = [
    { id: 'SPV-033', deal: 'Ag Land Portfolio', status: 'active', xero: 'Connected' },
    { id: 'SPV-028', deal: 'Sydney Commercial', status: 'active', xero: 'Connected' }
  ];
  const { data, loading } = useMockLoad(rows);
  const columns: Column<(typeof rows)[0]>[] = [
    { key: 'id', label: 'SPV', sortable: true },
    { key: 'deal', label: 'Deal' },
    { key: 'xero', label: 'Xero' },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> }
  ];
  return (
    <IMFOPlatformLayout title="SPV management" description="Per-deal SPVs with ledger mapping and Xero sync." section="Funds" onNavigate={onNavigate} loading={loading}>
      {data && (
        <>
          <MetricCards items={[{ label: 'Active SPVs', value: '18' }, { label: 'Xero linked', value: '16' }]} />
          <DataTable columns={columns} data={data} getRowId={(r) => r.id} />
        </>
      )}
    </IMFOPlatformLayout>
  );
}

export function CapitalManagementPage({ onNavigate }: PageProps) {
  const rows = [
    { id: 'C1', type: 'Capital call', investor: 'Meridian Capital', amount: '$2.0M', date: '2026-05-01', status: 'completed' },
    { id: 'C2', type: 'Distribution', investor: 'Smith Family Trust', amount: '$180K', date: '2026-04-28', status: 'pending' }
  ];
  const { data, loading } = useMockLoad(rows);
  const columns: Column<(typeof rows)[0]>[] = [
    { key: 'type', label: 'Event', sortable: true },
    { key: 'investor', label: 'Investor' },
    { key: 'amount', label: 'Amount', align: 'right' },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> }
  ];
  return (
    <IMFOPlatformLayout title="Capital management" description="Commitments, calls, subscriptions, and redemptions." section="Funds" onNavigate={onNavigate} loading={loading}>
      {data && <DataTable columns={columns} data={data} getRowId={(r) => r.id} />}
    </IMFOPlatformLayout>
  );
}

export function FeesWaterfallPage({ onNavigate }: PageProps) {
  const { data, loading } = useMockLoad({ mgmt: 1.5, perf: 20, carry: 15 });
  return (
    <IMFOPlatformLayout title="Fees & waterfall" description="Fee models, waterfalls, carry, and clawback." section="Allocation" onNavigate={onNavigate} loading={loading}>
      {data && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-lg p-4"><p className="text-sm text-slate-300">Management fee</p><p className="text-2xl font-bold">{data.mgmt}%</p></div>
          <div className="bg-white border rounded-lg p-4"><p className="text-sm text-slate-300">Performance fee</p><p className="text-2xl font-bold">{data.perf}%</p></div>
          <div className="bg-white border rounded-lg p-4"><p className="text-sm text-slate-300">Carried interest</p><p className="text-2xl font-bold">{data.carry}%</p></div>
          <div className="md:col-span-3 bg-white border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Waterfall preview</h3>
            <ProgressBar value={72} label="LP return hurdle" />
          </div>
        </div>
      )}
    </IMFOPlatformLayout>
  );
}

export function NavEnginePage({ onNavigate }: PageProps) {
  const rows = [
    { id: 'N1', date: '2026-03-31', nav: '$124.2M', change: '+1.2%', status: 'published' },
    { id: 'N2', date: '2026-02-28', nav: '$122.7M', change: '+0.8%', status: 'published' }
  ];
  const { data, loading } = useMockLoad(rows);
  const columns: Column<(typeof rows)[0]>[] = [
    { key: 'date', label: 'Valuation date', sortable: true },
    { key: 'nav', label: 'NAV', align: 'right' },
    { key: 'change', label: 'Change' },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> }
  ];
  return (
    <IMFOPlatformLayout title="NAV engine" description="Net asset value calculations and unit pricing." section="Allocation" onNavigate={onNavigate} loading={loading}>
      {data && <DataTable columns={columns} data={data} getRowId={(r) => r.id} />}
    </IMFOPlatformLayout>
  );
}

export function RiskGradingPage({ onNavigate }: PageProps) {
  const rows = [
    { id: 'D1', deal: 'Sydney Commercial', grade: 'BBB', score: 72, status: 'approved' },
    { id: 'D2', deal: 'Ag Land', grade: 'BB+', score: 68, status: 'review' }
  ];
  const { data, loading } = useMockLoad(rows);
  const columns: Column<(typeof rows)[0]>[] = [
    { key: 'deal', label: 'Deal', sortable: true },
    { key: 'grade', label: 'Grade' },
    { key: 'score', label: 'Score', sortable: true },
    { key: 'status', label: 'IC status', render: (r) => <StatusPill status={r.status} /> }
  ];
  return (
    <IMFOPlatformLayout title="Risk grading" description="Deal-level risk scores and investment committee workflow." section="Risk" onNavigate={onNavigate} loading={loading}>
      {data && <DataTable columns={columns} data={data} getRowId={(r) => r.id} />}
    </IMFOPlatformLayout>
  );
}

export function ExposureLimitsPage({ onNavigate }: PageProps) {
  const rows = [
    { id: 'E1', limit: 'Per SPV', current: '12%', max: '15%', status: 'ok' },
    { id: 'E2', limit: 'Sector — Property', current: '22%', max: '25%', status: 'ok' },
    { id: 'E3', limit: 'Single borrower', current: '9%', max: '8%', status: 'breach' }
  ];
  const { data, loading } = useMockLoad(rows);
  const columns: Column<(typeof rows)[0]>[] = [
    { key: 'limit', label: 'Limit type' },
    { key: 'current', label: 'Current' },
    { key: 'max', label: 'Maximum' },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status === 'breach' ? 'overdue' : 'active'} /> }
  ];
  return (
    <IMFOPlatformLayout title="Exposure limits" description="Concentration and mandate limit monitoring." section="Risk" onNavigate={onNavigate} loading={loading}>
      {data && <DataTable columns={columns} data={data} getRowId={(r) => r.id} />}
    </IMFOPlatformLayout>
  );
}

export function StressTestingPage({ onNavigate }: PageProps) {
  const scenarios = [
    { id: 'S1', name: 'Rates +200bps', impact: '-4.2% NAV', status: 'completed' },
    { id: 'S2', name: 'Property -15%', impact: '-8.1% NAV', status: 'running' }
  ];
  const { data, loading } = useMockLoad(scenarios);
  const columns: Column<(typeof scenarios)[0]>[] = [
    { key: 'name', label: 'Scenario' },
    { key: 'impact', label: 'Impact' },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status === 'running' ? 'pending' : 'completed'} /> }
  ];
  return (
    <IMFOPlatformLayout title="Stress testing" description="Dynamic scenario analysis on portfolio and liquidity." section="Risk" onNavigate={onNavigate} loading={loading} actions={<Button variant="outline">Run scenario</Button>}>
      {data && <DataTable columns={columns} data={data} getRowId={(r) => r.id} />}
    </IMFOPlatformLayout>
  );
}

export function ImBuilderPage({ onNavigate }: PageProps) {
  const rows = [
    { id: 'IM1', deal: 'Ag Land Portfolio', version: '3.2', status: 'draft', modified: '2026-05-20' },
    { id: 'IM2', deal: 'Bond Series 2024', version: '1.0', status: 'published', modified: '2026-04-10' }
  ];
  const { data, loading } = useMockLoad(rows);
  const columns: Column<(typeof rows)[0]>[] = [
    { key: 'deal', label: 'Deal' },
    { key: 'version', label: 'Version' },
    { key: 'modified', label: 'Last modified', sortable: true },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> }
  ];
  return (
    <IMFOPlatformLayout title="IM builder" description="Information memorandum authoring and compliance packs." section="Deals" onNavigate={onNavigate} loading={loading}>
      {data && <DataTable columns={columns} data={data} getRowId={(r) => r.id} />}
    </IMFOPlatformLayout>
  );
}

export function WarehouseManagementPage({ onNavigate }: PageProps) {
  const { data, loading } = useMockLoad({ capacity: '$50M', drawn: '$32M', deals: 4 });
  return (
    <IMFOPlatformLayout title="Warehouse management" description="Warehouse facility utilisation and line items." section="Deals" onNavigate={onNavigate} loading={loading}>
      {data && (
        <>
          <MetricCards items={[{ label: 'Capacity', value: data.capacity }, { label: 'Drawn', value: data.drawn }, { label: 'Active deals', value: String(data.deals) }]} />
          <ProgressBar value={(32 / 50) * 100} label="Facility utilisation" />
        </>
      )}
    </IMFOPlatformLayout>
  );
}

export function XeroIntegrationPage({ onNavigate }: PageProps) {
  const rows = [
    { id: 'X1', entity: 'Growth Credit Fund I', status: 'connected', lastSync: '2026-05-20 09:00' },
    { id: 'X2', entity: 'SPV-2024-033', status: 'connected', lastSync: '2026-05-20 08:45' }
  ];
  const { data, loading } = useMockLoad(rows);
  const columns: Column<(typeof rows)[0]>[] = [
    { key: 'entity', label: 'Entity' },
    { key: 'lastSync', label: 'Last sync' },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> }
  ];
  return (
    <IMFOPlatformLayout title="Xero integration" description="Chart of accounts sync and bank feed reconciliation." section="Integration" onNavigate={onNavigate} loading={loading}>
      {data && <DataTable columns={columns} data={data} getRowId={(r) => r.id} />}
    </IMFOPlatformLayout>
  );
}

export function PlatformSettingsPage({ onNavigate }: PageProps) {
  return (
    <IMFOPlatformLayout title="Settings" description="Tenant, fund defaults, and notification preferences." section="Settings" onNavigate={onNavigate}>
      <div className="bg-white border border-white/10 rounded-lg divide-y max-w-2xl">
        {['Organisation profile', 'Fund defaults', 'Email notifications', 'API keys'].map((label) => (
          <div key={label} className="flex items-center justify-between p-4">
            <span className="font-medium text-slate-100">{label}</span>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        ))}
      </div>
    </IMFOPlatformLayout>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { Briefcase, DollarSign, Layers, Percent } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { DashboardTable } from '../components/DashboardTable';
import { FilterDropdown } from '../components/FilterDropdown';
import { fetchMock } from '../utils/fetchMock';
import { formatCurrency, formatPercent } from '../utils/format';
import {
  getPortfolioAssets,
  computePortfolioSummary,
  ASSET_TYPES,
  ASSET_STATUSES
} from '../data/portfolioData';

function StatusPill({ status }) {
  const map = {
    performing: 'bg-green-100 text-green-800',
    watch: 'bg-amber-100 text-amber-900',
    distressed: 'bg-red-100 text-red-800',
    exited: 'bg-slate-100 text-slate-700'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${map[status] || map.exited}`}>
      {status}
    </span>
  );
}

export function PortfolioManagementPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    fetchMock(() => getPortfolioAssets()).then((data) => {
      setAssets(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (typeFilter !== 'all' && a.type !== typeFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      return true;
    });
  }, [assets, typeFilter, statusFilter]);

  const summary = useMemo(() => computePortfolioSummary(filtered), [filtered]);

  const columns = [
    { key: 'name', label: 'Asset name' },
    {
      key: 'type',
      label: 'Type',
      render: (row) => row.type.replace(/-/g, ' ')
    },
    {
      key: 'investedValue',
      label: 'Invested value',
      render: (row) => formatCurrency(row.investedValue)
    },
    {
      key: 'currentValue',
      label: 'Current value',
      render: (row) => formatCurrency(row.currentValue)
    },
    {
      key: 'ltv',
      label: 'LTV',
      render: (row) => (row.ltv > 0 ? formatPercent(row.ltv, 0) : '—')
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusPill status={row.status} />
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Portfolio Management</h2>
        <p className="text-gray-600 mt-1">Assets under management with live filters and summary metrics.</p>
      </div>

      {loading ? (
        <p className="text-gray-500 py-12 text-center">Loading portfolio…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DashboardCard
              title="Total AUM"
              value={formatCurrency(summary.totalAum)}
              subtitle={`Invested ${formatCurrency(summary.totalInvested)}`}
              icon={DollarSign}
              accent="indigo"
            />
            <DashboardCard
              title="Total assets"
              value={summary.totalAssets}
              subtitle="Matching current filters"
              icon={Layers}
              accent="emerald"
            />
            <DashboardCard
              title="Average LTV"
              value={formatPercent(summary.averageLtv, 1)}
              subtitle="LVR-weighted portfolio"
              icon={Percent}
              accent="amber"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-end bg-white border border-gray-200 rounded-xl p-4">
            <FilterDropdown label="Type" value={typeFilter} onChange={setTypeFilter} options={ASSET_TYPES} />
            <FilterDropdown label="Status" value={statusFilter} onChange={setStatusFilter} options={ASSET_STATUSES} />
            <div className="flex items-center gap-2 text-sm text-gray-500 ml-auto">
              <Briefcase className="w-4 h-4" />
              {filtered.length} of {assets.length} assets
            </div>
          </div>

          <DashboardTable columns={columns} rows={filtered} />
        </>
      )}
    </div>
  );
}

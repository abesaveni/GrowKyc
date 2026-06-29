import React, { useEffect, useMemo, useState } from 'react';
import { Search, User, X, Download } from 'lucide-react';
import { Button } from '../../ui/button';
import { PageHeader } from '../../shared/dashboard/PageHeader';
import { DataTable, Column } from '../../shared/dashboard/DataTable';
import { StatusPill } from '../../shared/dashboard/StatusPill';
import { ProgressBar } from '../../shared/dashboard/ProgressBar';
import {
  AssetRealisationRecord,
  fetchAssetRealisations
} from '../../../services/assetRealisationService';
import { toast } from 'sonner';

function formatMoney(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function DifferenceCell({ estimated, realised }: { estimated: number; realised: number }) {
  const diff = realised - estimated;
  const pct = estimated ? ((diff / estimated) * 100).toFixed(1) : '0';
  const positive = diff >= 0;
  return (
    <div>
      <span className={`font-medium ${positive ? 'text-green-700' : 'text-red-700'}`}>
        {diff === 0 ? '—' : `${positive ? '+' : '-'}${formatMoney(Math.abs(diff))}`}
      </span>
      {diff !== 0 && <p className={`text-xs ${positive ? 'text-green-600' : 'text-red-600'}`}>{pct}%</p>}
    </div>
  );
}

export function AssetRealisationView({ matterId }: { matterId?: string }) {
  const [assets, setAssets] = useState<AssetRealisationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<AssetRealisationRecord | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchAssetRealisations(matterId)
      .then(setAssets)
      .finally(() => setLoading(false));
  }, [matterId]);

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (typeFilter !== 'all' && a.assetType !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return a.assetName.toLowerCase().includes(q) || a.agentName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [assets, search, statusFilter, typeFilter]);

  const types = useMemo(() => [...new Set(assets.map((a) => a.assetType))], [assets]);

  const columns: Column<AssetRealisationRecord>[] = [
    { key: 'assetName', label: 'Asset Name', sortable: true },
    { key: 'assetType', label: 'Asset Type', sortable: true },
    {
      key: 'estimatedValue',
      label: 'Estimated Value',
      sortable: true,
      align: 'right',
      render: (r) => formatMoney(r.estimatedValue)
    },
    {
      key: 'realisedValue',
      label: 'Realised Value',
      sortable: true,
      align: 'right',
      render: (r) => (r.realisedValue ? formatMoney(r.realisedValue) : '—')
    },
    {
      key: 'difference',
      label: 'Difference',
      render: (r) => <DifferenceCell estimated={r.estimatedValue} realised={r.realisedValue} />
    },
    {
      key: 'saleProgress',
      label: 'Sale Progress',
      sortable: true,
      render: (r) => <ProgressBar value={r.saleProgress} size="sm" showPercent />
    },
    {
      key: 'agentName',
      label: 'Agent',
      render: (r) => (
        <button
          type="button"
          className="text-indigo-600 hover:underline text-left"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedAgent(r);
          }}
        >
          {r.agentName}
        </button>
      )
    },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'lastUpdated', label: 'Last Updated', sortable: true }
  ];

  const totalEst = filtered.reduce((s, a) => s + a.estimatedValue, 0);
  const totalReal = filtered.reduce((s, a) => s + a.realisedValue, 0);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Asset Realisation"
        description="Track estimated vs realised values, sale campaigns, and selling agent details."
        actions={
          <Button variant="outline" onClick={() => toast.success('Register exported')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total estimated</p>
          <p className="text-2xl font-bold text-gray-900">{formatMoney(totalEst)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total realised</p>
          <p className="text-2xl font-bold text-green-700">{formatMoney(totalReal)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Assets in register</p>
          <p className="text-2xl font-bold text-gray-900">{filtered.length}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search assets or agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All statuses</option>
          <option value="marketing">Marketing</option>
          <option value="under-offer">Under offer</option>
          <option value="for-sale">For sale</option>
          <option value="sold">Sold</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        getRowId={(r) => r.id}
        onRowClick={(r) => setSelectedAgent(r)}
        emptyTitle="No assets match filters"
      />

      {selectedAgent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
          onClick={() => setSelectedAgent(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 my-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Selling agent</h3>
              <button type="button" onClick={() => setSelectedAgent(null)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-600 mb-4">{selectedAgent.assetName}</p>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3"><User className="w-5 h-5 text-gray-400" /><div><p className="font-medium">{selectedAgent.agentName}</p><p className="text-gray-600">{selectedAgent.agentCompany}</p></div></div>
              <p><span className="text-gray-600">Email:</span> {selectedAgent.agentEmail}</p>
              <p><span className="text-gray-600">Phone:</span> {selectedAgent.agentPhone}</p>
              <ProgressBar value={selectedAgent.saleProgress} label="Sale progress" />
            </div>
            <Button className="w-full mt-6" variant="outline" onClick={() => setSelectedAgent(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}

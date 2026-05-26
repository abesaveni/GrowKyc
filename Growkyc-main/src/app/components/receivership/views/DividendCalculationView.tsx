import React, { useEffect, useState } from 'react';
import { Calculator } from 'lucide-react';
import { PageHeader } from '../../shared/dashboard/PageHeader';
import { DataTable, Column } from '../../shared/dashboard/DataTable';
import { ProgressBar } from '../../shared/dashboard/ProgressBar';
import { fetchDividendCalculation, DividendPriorityRow } from '../../../services/receivershipCreditorService';

function formatMoney(n: number) {
  return `$${n.toLocaleString()}`;
}

export function DividendCalculationView() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<DividendPriorityRow[]>([]);
  const [totalPool, setTotalPool] = useState(0);
  const [totalDistributed, setTotalDistributed] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    fetchDividendCalculation().then((data) => {
      setRows(data.rows);
      setTotalPool(data.totalPool);
      setTotalDistributed(data.totalDistributed);
      setRemaining(data.remaining);
      setLoading(false);
    });
  }, []);

  const columns: Column<DividendPriorityRow>[] = [
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'creditorClass', label: 'Creditor class', sortable: true },
    { key: 'totalClaims', label: 'Total claims', align: 'right', render: (r) => formatMoney(r.totalClaims) },
    { key: 'admitted', label: 'Admitted', align: 'right', render: (r) => formatMoney(r.admitted) },
    {
      key: 'distributionPct',
      label: 'Allocation %',
      render: (r) => (
        <div className="min-w-[120px]">
          <ProgressBar value={r.distributionPct} colorClass="bg-red-600" size="sm" />
        </div>
      )
    },
    { key: 'distributedAmount', label: 'Distributed', align: 'right', render: (r) => formatMoney(r.distributedAmount) }
  ];

  const pctDistributed = totalPool ? (totalDistributed / totalPool) * 100 : 0;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Dividend Calculation"
        description="Distribution to creditors by statutory priority with dynamic allocation."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3">
          <Calculator className="w-8 h-8 text-red-600" />
          <div>
            <p className="text-sm text-gray-600">Distribution pool</p>
            <p className="text-2xl font-bold">{formatMoney(totalPool)}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total distributed</p>
          <p className="text-2xl font-bold text-green-700">{formatMoney(totalDistributed)}</p>
          <ProgressBar value={pctDistributed} className="mt-2" colorClass="bg-green-600" />
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Remaining balance</p>
          <p className="text-2xl font-bold text-gray-900">{formatMoney(remaining)}</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        getRowId={(r) => `${r.priority}-${r.creditorClass}`}
        emptyTitle="No distribution data"
      />
    </div>
  );
}

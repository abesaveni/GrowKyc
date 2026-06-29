import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Plus, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { DataTable, Column } from '../shared/dashboard/DataTable';
import { ProgressBar } from '../shared/dashboard/ProgressBar';
import {
  DealAllocation,
  DealAllocationSummary,
  fetchDealAllocations,
  postDealAllocation
} from '../../services/dealAllocationService';

function formatMoney(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}

interface DealAllocationPanelProps {
  dealId: string;
  targetRaise: number;
  role?: string;
}

export function DealAllocationPanel({ dealId, targetRaise, role }: DealAllocationPanelProps) {
  const [summary, setSummary] = useState<DealAllocationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    investorName: '',
    allocationAmount: '',
    allocationPercentage: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const canAllocate = role !== 'external-auditor' && role !== 'trustee-rep';

  const load = () => {
    setLoading(true);
    fetchDealAllocations(dealId)
      .then((data) => {
        setSummary({ ...data, targetRaise: data.targetRaise || targetRaise });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [dealId, targetRaise]);

  const pctFilled = useMemo(() => {
    if (!summary) return 0;
    return Math.min(100, (summary.totalAllocated / summary.targetRaise) * 100);
  }, [summary]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.investorName.trim()) e.investorName = 'Investor name is required';
    const amt = parseFloat(form.allocationAmount);
    if (!form.allocationAmount || isNaN(amt) || amt <= 0) e.allocationAmount = 'Enter a valid amount';
    if (summary && amt > summary.remaining) e.allocationAmount = 'Exceeds remaining capacity';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !summary) return;
    if (!validate()) return;
    setSubmitting(true);
    const amt = parseFloat(form.allocationAmount);
    const prev = summary;
    const optimistic: DealAllocationSummary = prev
      ? {
          ...prev,
          allocations: [
            ...prev.allocations,
            {
              id: `opt-${Date.now()}`,
              investorName: form.investorName,
              amount: amt,
              percent: (amt / prev.targetRaise) * 100,
              notes: form.notes,
              createdAt: new Date().toISOString().slice(0, 10)
            }
          ],
          totalAllocated: prev.totalAllocated + amt,
          remaining: Math.max(0, prev.remaining - amt),
          fullySubscribed: prev.remaining - amt <= 0
        }
      : prev!;
    setSummary(optimistic);
    try {
      const updated = await postDealAllocation(dealId, {
        investorName: form.investorName,
        allocationAmount: amt,
        allocationPercentage: form.allocationPercentage ? parseFloat(form.allocationPercentage) : undefined,
        notes: form.notes
      });
      setSummary(updated);
      toast.success('Allocation recorded');
      setShowModal(false);
      setForm({ investorName: '', allocationAmount: '', allocationPercentage: '', notes: '' });
    } catch {
      setSummary(prev);
      toast.error('Allocation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<DealAllocation>[] = [
    { key: 'investorName', label: 'Investor', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, align: 'right', render: (r) => formatMoney(r.amount) },
    { key: 'percent', label: '% of deal', align: 'right', render: (r) => `${r.percent.toFixed(1)}%` },
    { key: 'createdAt', label: 'Date', sortable: true },
    { key: 'notes', label: 'Notes', render: (r) => r.notes || '—' }
  ];

  if (loading && !summary) {
    return <p className="text-gray-500 py-8 text-center">Loading allocation data…</p>;
  }

  if (!summary) return null;

  const stats = [
    { label: 'Target raise', value: formatMoney(summary.targetRaise) },
    { label: 'Total allocated', value: formatMoney(summary.totalAllocated) },
    { label: 'Remaining', value: formatMoney(summary.remaining) },
    { label: 'Investors', value: String(summary.allocations.length) }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Allocation dashboard</h3>
          {summary.fullySubscribed && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              Fully subscribed
            </span>
          )}
        </div>
        {canAllocate && !summary.fullySubscribed && (
          <Button type="button" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Invest / Allocate
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <p className="text-xs text-indigo-700">{s.label}</p>
            <p className="text-xl font-bold text-indigo-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-medium text-gray-700">Subscription progress</span>
        </div>
        <ProgressBar value={pctFilled} showPercent colorClass="bg-indigo-600" />
      </div>

      <DataTable
        columns={columns}
        data={summary.allocations}
        loading={loading}
        getRowId={(r) => r.id}
        emptyTitle="No allocations yet"
        emptyDescription="Record investor commitments using Invest / Allocate."
      />

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => !submitting && setShowModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <form
            className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onSubmit={handleInvest}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900">Record allocation</h3>
            <p className="text-sm text-gray-600">Remaining capacity: {formatMoney(summary.remaining)}</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investor name *</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.investorName}
                onChange={(e) => setForm({ ...form, investorName: e.target.value })}
              />
              {errors.investorName && <p className="text-xs text-red-600 mt-1">{errors.investorName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allocation amount *</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.allocationAmount}
                onChange={(e) => setForm({ ...form, allocationAmount: e.target.value })}
              />
              {errors.allocationAmount && <p className="text-xs text-red-600 mt-1">{errors.allocationAmount}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allocation % (optional)</label>
              <input
                type="number"
                step="0.1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.allocationPercentage}
                onChange={(e) => setForm({ ...form, allocationPercentage: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={submitting}>
                {submitting ? 'Saving…' : 'Confirm allocation'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

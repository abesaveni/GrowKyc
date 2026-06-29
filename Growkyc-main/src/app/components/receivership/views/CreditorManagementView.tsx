import React, { useEffect, useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import { PageHeader } from '../../shared/dashboard/PageHeader';
import { DataTable, Column } from '../../shared/dashboard/DataTable';
import { StatusPill } from '../../shared/dashboard/StatusPill';
import {
  CreditorRecord,
  ClaimType,
  fetchCreditors,
  submitProofOfDebt
} from '../../../services/receivershipCreditorService';

function formatMoney(n: number) {
  return `$${n.toLocaleString()}`;
}

export function CreditorManagementView() {
  const [creditors, setCreditors] = useState<CreditorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<CreditorRecord | null>(null);
  const [showPodForm, setShowPodForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    creditorName: '',
    claimAmount: '',
    claimType: 'unsecured' as ClaimType,
    notes: '',
    files: [] as File[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = () => {
    setLoading(true);
    fetchCreditors().then(setCreditors).finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const filtered = creditors.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const columns: Column<CreditorRecord>[] = [
    { key: 'name', label: 'Creditor', sortable: true },
    { key: 'claimType', label: 'Claim type', sortable: true, render: (r) => <span className="capitalize">{r.claimType}</span> },
    { key: 'claimAmount', label: 'Claim amount', sortable: true, align: 'right', render: (r) => formatMoney(r.claimAmount) },
    { key: 'admittedAmount', label: 'Admitted', sortable: true, align: 'right', render: (r) => formatMoney(r.admittedAmount) },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'proofSubmitted', label: 'Proof', render: (r) => (r.proofSubmitted ? 'Yes' : 'No') }
  ];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.creditorName.trim()) e.creditorName = 'Creditor name is required';
    const amt = parseFloat(form.claimAmount);
    if (!form.claimAmount || isNaN(amt) || amt <= 0) e.claimAmount = 'Enter a valid claim amount';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmitPod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitProofOfDebt({
        creditorName: form.creditorName,
        claimAmount: parseFloat(form.claimAmount),
        claimType: form.claimType,
        notes: form.notes,
        status: 'pending',
        submissionDate: new Date().toISOString().slice(0, 10)
      });
      toast.success('Proof of debt submitted');
      setShowPodForm(false);
      setForm({ creditorName: '', claimAmount: '', claimType: 'unsecured', notes: '', files: [] });
      load();
    } catch {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Creditor Management"
        description="Creditor register, claim adjudication, and proof of debt lodgements."
        actions={
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowPodForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Proof of debt
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search creditors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-white/10 rounded-lg text-sm"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-white/10 rounded-lg text-sm">
          <option value="all">All statuses</option>
          <option value="admitted">Admitted</option>
          <option value="partial">Partial</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} getRowId={(r) => r.id} onRowClick={(row) => setSelected(row)} />

      {selected && (
        <>
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSelected(null)} aria-hidden />
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl border-l border-white/10 p-6 overflow-y-auto">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">{selected.name}</h3>
            <button type="button" onClick={() => setSelected(null)}><X className="w-5 h-5" /></button>
          </div>
          <dl className="space-y-3 text-sm">
            <div><dt className="text-slate-300">Email</dt><dd className="font-medium">{selected.email}</dd></div>
            <div><dt className="text-slate-300">Claim</dt><dd className="font-medium">{formatMoney(selected.claimAmount)}</dd></div>
            <div><dt className="text-slate-300">Admitted</dt><dd className="font-medium">{formatMoney(selected.admittedAmount)}</dd></div>
            <div><dt className="text-slate-300">Type</dt><dd className="capitalize">{selected.claimType}</dd></div>
            <div><dt className="text-slate-300">Status</dt><dd><StatusPill status={selected.status} /></dd></div>
          </dl>
        </div>
        </>
      )}

      {showPodForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => !submitting && setShowPodForm(false)}
          role="dialog"
          aria-modal="true"
        >
          <form
            className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onSubmit={handleSubmitPod}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">Proof of debt</h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Creditor name *</label>
              <input className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm" value={form.creditorName} onChange={(e) => setForm({ ...form, creditorName: e.target.value })} />
              {errors.creditorName && <p className="text-xs text-red-400 mt-1">{errors.creditorName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Claim amount *</label>
              <input type="number" className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm" value={form.claimAmount} onChange={(e) => setForm({ ...form, claimAmount: e.target.value })} />
              {errors.claimAmount && <p className="text-xs text-red-400 mt-1">{errors.claimAmount}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Claim type</label>
              <select className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm" value={form.claimType} onChange={(e) => setForm({ ...form, claimType: e.target.value as ClaimType })}>
                <option value="secured">Secured</option>
                <option value="unsecured">Unsecured</option>
                <option value="employee">Employee</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Supporting documents</label>
              <input type="file" multiple className="w-full text-sm" onChange={(e) => setForm({ ...form, files: Array.from(e.target.files || []) })} />
              {form.files.length > 0 && <p className="text-xs text-slate-400 mt-1">{form.files.length} file(s) selected</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
              <textarea className="w-full border border-white/10 rounded-lg px-3 py-2 text-sm" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowPodForm(false)}>Cancel</Button>
              <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

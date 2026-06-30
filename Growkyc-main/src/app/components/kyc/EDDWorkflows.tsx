import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from '../../lib/toast';
import { downloadCsv, csvDate } from '../../lib/exportCsv';
import { ShieldAlert, Plus, RefreshCw, ArrowLeft, X, Download } from 'lucide-react';

function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('growkyc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const TRIGGERS = ['high_risk', 'pep', 'sanctions', 'adverse_media', 'manual'];

interface EDD {
  edd_id: number;
  client_id: number;
  status: string;
  trigger_reason: string;
  due_date: string | null;
  mlro_decision: string | null;
  outcome: string | null;
}

interface ClientOption { id: number; name: string }

export function EDDWorkflows({ onBack }: { onBack?: () => void } = {}) {
  const [items, setItems] = useState<EDD[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ client_id: '', trigger_reason: 'high_risk' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/edd?limit=100', { headers: getAuthHeader() });
      if (res.status === 403) { toast.error('Your role cannot view EDD workflows'); setItems([]); return; }
      if (res.ok) setItems((await res.json()).items || []);
    } catch {
      toast.error('Network error loading EDD workflows');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadClients = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/clients?limit=100', { headers: getAuthHeader() });
      if (res.ok) setClients(((await res.json()).items || []).map((c: any) => ({ id: c.id, name: c.name || `Client ${c.id}` })));
    } catch { /* non-fatal */ }
  }, []);

  useEffect(() => { load(); loadClients(); }, [load, loadClients]);

  const initiate = async () => {
    if (!form.client_id) { toast.error('Select a client'); return; }
    setCreating(true);
    try {
      const res = await fetch('/api/v1/edd/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ client_id: Number(form.client_id), trigger_reason: form.trigger_reason }),
      });
      if (res.status === 403) { toast.error('Your role cannot initiate EDD'); return; }
      if (!res.ok) { toast.error(`Initiate failed (${res.status})`); return; }
      const e = await res.json();
      toast.success(`EDD #${e.edd_id} initiated (14-day SLA)`);
      setShowCreate(false);
      setForm({ client_id: '', trigger_reason: 'high_risk' });
      await load();
    } catch {
      toast.error('Network error initiating EDD');
    } finally {
      setCreating(false);
    }
  };

  const decide = async (e: EDD, decision: 'approve' | 'reject' | 'escalate') => {
    setBusyId(e.edd_id);
    try {
      const res = await fetch(`/api/v1/edd/${e.edd_id}/mlro-decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ decision, notes: `${decision} via EDD register` }),
      });
      if (res.status === 403) { toast.error('MLRO/Admin privileges required'); return; }
      if (!res.ok) { toast.error(`Decision failed (${res.status})`); return; }
      toast.success(`EDD #${e.edd_id} → ${decision}`);
      await load();
    } catch {
      toast.error('Network error recording decision');
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = () => {
    if (items.length === 0) { toast.error('No EDD workflows to export'); return; }
    const n = downloadCsv(
      `edd_workflows_${csvDate(new Date())}.csv`,
      ['EDD ID', 'Client ID', 'Status', 'Trigger', 'Due', 'MLRO Decision', 'Outcome'],
      items.map((e) => [e.edd_id, e.client_id, e.status, e.trigger_reason, csvDate(e.due_date), e.mlro_decision || '', e.outcome || '']),
    );
    toast.success(`Exported ${n} EDD workflow(s) to CSV`);
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      initiated: 'bg-blue-100 text-blue-700 border-blue-200',
      under_review: 'bg-amber-100 text-amber-700 border-amber-200',
      mlro_review: 'bg-purple-100 text-purple-700 border-purple-200',
      escalated: 'bg-red-100 text-red-700 border-red-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-gray-200 text-gray-700 border-gray-300',
    };
    return <Badge className={map[s] || 'bg-gray-100 text-gray-600'}>{s.replace('_', ' ')}</Badge>;
  };

  const stats = {
    total: items.length,
    open: items.filter((e) => !['approved', 'rejected'].includes(e.status)).length,
    mlro: items.filter((e) => e.status === 'mlro_review').length,
    approved: items.filter((e) => e.status === 'approved').length,
    rejected: items.filter((e) => e.status === 'rejected').length,
  };

  const terminal = (s: string) => s === 'approved' || s === 'rejected';

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {onBack && <Button variant="outline" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center"><ShieldAlert className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enhanced Due Diligence</h1>
              <p className="text-sm text-gray-500">EDD workflows for high-risk clients — initiated and decided via the backend API</p>
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
            <Button variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-2" />Initiate EDD</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            ['Total', stats.total, 'text-gray-900'],
            ['Open', stats.open, 'text-blue-600'],
            ['MLRO Review', stats.mlro, 'text-purple-600'],
            ['Approved', stats.approved, 'text-green-600'],
            ['Rejected', stats.rejected, 'text-gray-600'],
          ].map(([label, value, color]) => (
            <Card key={label as string}><CardContent className="p-4"><p className="text-sm text-gray-500">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></CardContent></Card>
          ))}
        </div>

        <Card>
          <CardHeader className="border-b"><CardTitle className="text-lg">All EDD workflows ({items.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading…</div>
            ) : items.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <ShieldAlert className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                No EDD workflows. Click <span className="font-semibold">Initiate EDD</span> to start one for a high-risk client.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>{['EDD ID', 'Client', 'Trigger', 'Status', 'Due', 'Decision'].map((h) => <th key={h} className="text-left py-3 px-4 font-semibold text-gray-600">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {items.map((e) => (
                      <tr key={e.edd_id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono font-medium text-gray-900">EDD-{e.edd_id}</td>
                        <td className="py-3 px-4 text-gray-600">{e.client_id}</td>
                        <td className="py-3 px-4 text-gray-700">{e.trigger_reason.replace(/_/g, ' ')}</td>
                        <td className="py-3 px-4">{statusBadge(e.status)}</td>
                        <td className="py-3 px-4 text-gray-500">{csvDate(e.due_date)}</td>
                        <td className="py-3 px-4">
                          {terminal(e.status) ? (
                            <span className="text-xs text-gray-500">{e.outcome || e.mlro_decision}</span>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline" size="sm" className="text-green-700 border-green-200" disabled={busyId === e.edd_id} onClick={() => decide(e, 'approve')}>Approve</Button>
                              <Button variant="outline" size="sm" className="text-red-700 border-red-200" disabled={busyId === e.edd_id} onClick={() => decide(e, 'reject')}>Reject</Button>
                              <Button variant="outline" size="sm" className="text-amber-700 border-amber-200" disabled={busyId === e.edd_id} onClick={() => decide(e, 'escalate')}>Escalate</Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Initiate Enhanced Due Diligence</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}><X className="w-4 h-4" /></Button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">Client *</span>
                {clients.length > 0 ? (
                  <select className={inputCls} value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}>
                    <option value="">Select a client…</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name} (#{c.id})</option>)}
                  </select>
                ) : (
                  <input className={inputCls} type="number" value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} placeholder="Client ID" />
                )}
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">Trigger reason</span>
                <select className={inputCls} value={form.trigger_reason} onChange={(e) => setForm({ ...form, trigger_reason: e.target.value })}>
                  {TRIGGERS.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={creating} onClick={initiate}>{creating ? 'Initiating…' : 'Initiate EDD'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400';

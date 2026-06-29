import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from '../../lib/toast';
import { downloadCsv, csvDate } from '../../lib/exportCsv';
import {
  Shield, Plus, RefreshCw, ArrowLeft, X, Trash2, Download, FolderOpen,
} from 'lucide-react';

function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('growkyc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const STATUSES = ['open', 'investigating', 'escalated', 'closed', 'SMR'];
const PRIORITIES = ['low', 'medium', 'high'];
const QUEUES = ['triage', 'investigation', 'review', 'approval'];

interface CaseItem {
  case_id: number;
  client_id: number;
  title: string;
  status: string;
  created_at: string | null;
}

interface ClientOption {
  id: number;
  name: string;
}

export function CasesLive({ onBack }: { onBack?: () => void } = {}) {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: '', client_id: '', description: '', priority: 'medium', queue_name: 'triage',
  });
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/cases?limit=100', { headers: getAuthHeader() });
      if (!res.ok) {
        toast.error(`Could not load cases (${res.status})`);
        setCases([]);
        return;
      }
      const data = await res.json();
      setCases(data.items || []);
    } catch {
      toast.error('Network error loading cases');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadClients = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/clients?limit=100', { headers: getAuthHeader() });
      if (res.ok) {
        const data = await res.json();
        setClients((data.items || []).map((c: any) => ({
          id: c.id,
          name: c.display_name || c.legal_name || c.name || `Client ${c.id}`,
        })));
      }
    } catch { /* non-fatal: create still works with a typed id */ }
  }, []);

  useEffect(() => { load(); loadClients(); }, [load, loadClients]);

  const createCase = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.client_id) { toast.error('Select a client'); return; }
    setCreating(true);
    try {
      const res = await fetch('/api/v1/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({
          client_id: Number(form.client_id),
          title: form.title,
          description: form.description || form.title,
          priority: form.priority,
          queue_name: form.queue_name,
        }),
      });
      if (!res.ok) {
        const detail = await res.text();
        console.error('Create case failed', res.status, detail);
        toast.error(`Create failed (${res.status})`);
        return;
      }
      toast.success('Case created');
      setShowCreate(false);
      setForm({ title: '', client_id: '', description: '', priority: 'medium', queue_name: 'triage' });
      await load();
    } catch {
      toast.error('Network error creating case');
    } finally {
      setCreating(false);
    }
  };

  const changeStatus = async (c: CaseItem, status: string) => {
    setBusyId(c.case_id);
    try {
      const res = await fetch(`/api/v1/cases/${c.case_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) { toast.error(`Status update failed (${res.status})`); return; }
      toast.success(`Case #${c.case_id} → ${status}`);
      await load();
    } catch {
      toast.error('Network error updating status');
    } finally {
      setBusyId(null);
    }
  };

  const closeCase = async (c: CaseItem) => {
    setBusyId(c.case_id);
    try {
      const res = await fetch(`/api/v1/cases/${c.case_id}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ resolution: 'Closed via case register' }),
      });
      if (!res.ok) { toast.error(`Close failed (${res.status})`); return; }
      toast.success(`Case #${c.case_id} closed`);
      await load();
    } catch {
      toast.error('Network error closing case');
    } finally {
      setBusyId(null);
    }
  };

  const deleteCase = async (c: CaseItem) => {
    setBusyId(c.case_id);
    try {
      const res = await fetch(`/api/v1/cases/${c.case_id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      if (res.status === 403) { toast.error('Only an Admin can delete cases'); return; }
      if (!res.ok) { toast.error(`Delete failed (${res.status})`); return; }
      toast.success(`Case #${c.case_id} deleted`);
      await load();
    } catch {
      toast.error('Network error deleting case');
    } finally {
      setBusyId(null);
    }
  };

  // Cross-module workflow: raise a SAR for this case's client.
  const raiseSarFromCase = async (c: CaseItem) => {
    setBusyId(c.case_id);
    try {
      const res = await fetch('/api/v1/sars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({
          client_id: c.client_id,
          reason_for_suspicion: `Raised from case #${c.case_id}: ${c.title}`,
          narrative: `SAR raised in connection with investigation case #${c.case_id}.`,
        }),
      });
      if (res.status === 403) { toast.error('Only Compliance Officer / MLRO / Admin can raise a SAR'); return; }
      if (!res.ok) { toast.error(`Could not raise SAR (${res.status})`); return; }
      const s = await res.json();
      toast.success(`Raised SAR #${s.id ?? '—'} from case #${c.case_id}`);
    } catch {
      toast.error('Network error raising SAR');
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = () => {
    if (cases.length === 0) { toast.error('No cases to export'); return; }
    const n = downloadCsv(
      `cases_${csvDate(new Date())}.csv`,
      ['Case ID', 'Title', 'Client ID', 'Status', 'Created'],
      cases.map((c) => [c.case_id, c.title, c.client_id, c.status, csvDate(c.created_at)]),
    );
    toast.success(`Exported ${n} case(s) to CSV`);
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      open: 'bg-blue-100 text-blue-700 border-blue-200',
      investigating: 'bg-amber-100 text-amber-700 border-amber-200',
      escalated: 'bg-red-100 text-red-700 border-red-200',
      closed: 'bg-gray-100 text-gray-600 border-gray-200',
      SMR: 'bg-purple-100 text-purple-700 border-purple-200',
    };
    return <Badge className={map[s] || 'bg-gray-100 text-gray-600'}>{s}</Badge>;
  };

  const stats = {
    total: cases.length,
    open: cases.filter((c) => c.status === 'open').length,
    investigating: cases.filter((c) => c.status === 'investigating').length,
    escalated: cases.filter((c) => c.status === 'escalated').length,
    closed: cases.filter((c) => c.status === 'closed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Case Register</h1>
              <p className="text-sm text-gray-500">Live investigation cases — persisted via the backend API</p>
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-2" />New Case
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            ['Total', stats.total, 'text-gray-900'],
            ['Open', stats.open, 'text-blue-600'],
            ['Investigating', stats.investigating, 'text-amber-600'],
            ['Escalated', stats.escalated, 'text-red-600'],
            ['Closed', stats.closed, 'text-gray-500'],
          ].map(([label, value, color]) => (
            <Card key={label as string}>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="border-b"><CardTitle className="text-lg">All cases ({cases.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading…</div>
            ) : cases.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <FolderOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                No cases yet. Click <span className="font-semibold">New Case</span> to create one — it will be saved to the backend.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {['Case ID', 'Title', 'Client', 'Status', 'Created', 'Actions'].map((h) => (
                        <th key={h} className="text-left py-3 px-4 font-semibold text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((c) => (
                      <tr key={c.case_id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono font-medium text-gray-900">#{c.case_id}</td>
                        <td className="py-3 px-4 text-gray-800">{c.title}</td>
                        <td className="py-3 px-4 text-gray-600">{c.client_id}</td>
                        <td className="py-3 px-4">{statusBadge(c.status)}</td>
                        <td className="py-3 px-4 text-gray-500">{csvDate(c.created_at)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <select
                              className="border border-gray-300 rounded px-2 py-1 text-xs"
                              value={c.status}
                              disabled={busyId === c.case_id}
                              onChange={(e) => changeStatus(c, e.target.value)}
                            >
                              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {c.status !== 'closed' && (
                              <Button variant="outline" size="sm" disabled={busyId === c.case_id} onClick={() => closeCase(c)}>Close</Button>
                            )}
                            <Button variant="outline" size="sm" className="text-purple-700 border-purple-200" disabled={busyId === c.case_id} onClick={() => raiseSarFromCase(c)}>Raise SAR</Button>
                            <Button variant="ghost" size="sm" className="text-red-600" disabled={busyId === c.case_id} onClick={() => deleteCase(c)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">New investigation case</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}><X className="w-4 h-4" /></Button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</span>
                <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Unusual transaction pattern — ABC Pty Ltd" />
              </label>
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
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">Description</span>
                <textarea className={inputCls} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</span>
                  <select className={inputCls} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-sm font-semibold text-gray-700 mb-1.5">Queue</span>
                  <select className={inputCls} value={form.queue_name} onChange={(e) => setForm({ ...form, queue_name: e.target.value })}>
                    {QUEUES.map((q) => <option key={q} value={q}>{q}</option>)}
                  </select>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={creating} onClick={createCase}>
                {creating ? 'Creating…' : 'Create case'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400';

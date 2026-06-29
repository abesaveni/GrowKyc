import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from '../../lib/toast';
import { downloadCsv, csvDate } from '../../lib/exportCsv';
import {
  Bell, Plus, RefreshCw, ArrowLeft, X, Download, Zap, AlertTriangle,
} from 'lucide-react';

function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('growkyc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const STATUSES = ['open', 'in_review', 'escalated', 'resolved', 'dismissed', 'false_positive'];
const SEVERITIES = ['low', 'medium', 'high', 'critical'];
const ALERT_TYPES = [
  'transaction_threshold', 'high_risk', 'sanctions_hit', 'pep_match', 'adverse_media', 'document_expiry',
];

interface Alert {
  id: number;
  client_id: number;
  alert_type: string;
  severity: string;
  status: string;
  title: string;
  description: string | null;
  triggered_by: string | null;
  created_at: string | null;
}

interface ClientOption { id: number; name: string }

export function AlertsLive({ onBack }: { onBack?: () => void } = {}) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [stats, setStats] = useState({ total: 0, open: 0, critical: 0, high: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ client_id: '', alert_type: 'transaction_threshold', severity: 'medium', title: '', description: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [aRes, sRes] = await Promise.all([
        fetch('/api/v1/alerts?limit=100', { headers: getAuthHeader() }),
        fetch('/api/v1/alerts/stats', { headers: getAuthHeader() }),
      ]);
      if (aRes.status === 403) { toast.error('Your role cannot view monitoring alerts'); setAlerts([]); return; }
      if (aRes.ok) setAlerts((await aRes.json()).items || []);
      if (sRes.ok) {
        const s = await sRes.json();
        setStats({ total: s.total, open: s.open, critical: s.critical, high: s.high, resolved: s.resolved });
      }
    } catch {
      toast.error('Network error loading alerts');
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

  const generate = async (autoActions = false) => {
    setGenerating(true);
    try {
      const qs = autoActions ? '?auto_escalate=true&auto_edd=true' : '';
      const res = await fetch(`/api/v1/alerts/generate${qs}`, { method: 'POST', headers: getAuthHeader() });
      if (!res.ok) { toast.error(`Rule engine failed (${res.status})`); return; }
      const data = await res.json();
      const bits = [];
      if (data.escalated) bits.push(`opened ${data.escalated} case(s)`);
      if (data.edd_initiated) bits.push(`started ${data.edd_initiated} EDD`);
      const extra = bits.length ? `, ${bits.join(', ')}` : '';
      toast.success(`Rule engine: ${data.created} new alert(s) from ${data.clients_scanned} client(s)${extra}`);
      await load();
    } catch {
      toast.error('Network error running rule engine');
    } finally {
      setGenerating(false);
    }
  };

  const createAlert = async () => {
    if (!form.client_id) { toast.error('Select a client'); return; }
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setCreating(true);
    try {
      const res = await fetch('/api/v1/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({
          client_id: Number(form.client_id),
          alert_type: form.alert_type,
          severity: form.severity,
          title: form.title,
          description: form.description || null,
        }),
      });
      if (!res.ok) { toast.error(`Create failed (${res.status})`); return; }
      toast.success('Alert raised');
      setShowCreate(false);
      setForm({ client_id: '', alert_type: 'transaction_threshold', severity: 'medium', title: '', description: '' });
      await load();
    } catch {
      toast.error('Network error creating alert');
    } finally {
      setCreating(false);
    }
  };

  // Cross-module workflow: escalate an alert into a real investigation case.
  // The backend opens the case AND links it (alert.case_id), then marks the
  // alert escalated — one atomic call.
  const escalateToCase = async (a: Alert) => {
    setBusyId(a.id);
    try {
      const res = await fetch(`/api/v1/alerts/${a.id}/escalate`, {
        method: 'POST',
        headers: getAuthHeader(),
      });
      if (!res.ok) { toast.error(`Could not open case (${res.status})`); return; }
      const data = await res.json();
      toast.success(`Opened case #${data.case_id ?? '—'} from alert #${a.id}`);
      await load();
    } catch {
      toast.error('Network error escalating alert');
    } finally {
      setBusyId(null);
    }
  };

  const setStatus = async (a: Alert, status: string) => {
    setBusyId(a.id);
    try {
      const res = await fetch(`/api/v1/alerts/${a.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) { toast.error(`Update failed (${res.status})`); return; }
      toast.success(`Alert #${a.id} → ${status.replace('_', ' ')}`);
      await load();
    } catch {
      toast.error('Network error updating alert');
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = () => {
    if (alerts.length === 0) { toast.error('No alerts to export'); return; }
    const n = downloadCsv(
      `monitoring_alerts_${csvDate(new Date())}.csv`,
      ['Alert ID', 'Client ID', 'Type', 'Severity', 'Status', 'Title', 'Source', 'Created'],
      alerts.map((a) => [a.id, a.client_id, a.alert_type, a.severity, a.status, a.title, a.triggered_by || '', csvDate(a.created_at)]),
    );
    toast.success(`Exported ${n} alert(s) to CSV`);
  };

  const sevBadge = (s: string) => {
    const map: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600 border-gray-200',
      medium: 'bg-blue-100 text-blue-700 border-blue-200',
      high: 'bg-amber-100 text-amber-700 border-amber-200',
      critical: 'bg-red-100 text-red-700 border-red-200',
    };
    return <Badge className={map[s] || 'bg-gray-100'}>{s}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {onBack && <Button variant="outline" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center"><Bell className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Monitoring &amp; Alerts</h1>
              <p className="text-sm text-gray-500">Risk and transaction alerts — persisted and worked through the backend API</p>
            </div>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => generate(false)} disabled={generating}><Zap className={`w-4 h-4 mr-2 ${generating ? 'animate-pulse' : ''}`} />Run Rule Engine</Button>
            <Button variant="outline" size="sm" className="text-indigo-700 border-indigo-200" onClick={() => generate(true)} disabled={generating}><Zap className="w-4 h-4 mr-2" />Run + Auto-actions</Button>
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
            <Button variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-2" />New Alert</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            ['Total', stats.total, 'text-gray-900'],
            ['Open', stats.open, 'text-blue-600'],
            ['Critical', stats.critical, 'text-red-600'],
            ['High', stats.high, 'text-amber-600'],
            ['Resolved', stats.resolved, 'text-green-600'],
          ].map(([label, value, color]) => (
            <Card key={label as string}><CardContent className="p-4"><p className="text-sm text-gray-500">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></CardContent></Card>
          ))}
        </div>

        <Card>
          <CardHeader className="border-b"><CardTitle className="text-lg">All alerts ({alerts.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading…</div>
            ) : alerts.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                No alerts. Click <span className="font-semibold">Run Rule Engine</span> to scan clients for risk signals, or <span className="font-semibold">New Alert</span> to raise one manually.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>{['ID', 'Title', 'Type', 'Severity', 'Status', 'Source', 'Actions'].map((h) => <th key={h} className="text-left py-3 px-4 font-semibold text-gray-600">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {alerts.map((a) => (
                      <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono font-medium text-gray-900">#{a.id}</td>
                        <td className="py-3 px-4 text-gray-800">{a.title}</td>
                        <td className="py-3 px-4 text-gray-600">{a.alert_type.replace(/_/g, ' ')}</td>
                        <td className="py-3 px-4">{sevBadge(a.severity)}</td>
                        <td className="py-3 px-4 text-gray-700">{a.status.replace('_', ' ')}</td>
                        <td className="py-3 px-4 text-gray-500 text-xs">{a.triggered_by || '—'}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <select
                              className="border border-gray-300 rounded px-2 py-1 text-xs"
                              value={a.status}
                              disabled={busyId === a.id}
                              onChange={(e) => setStatus(a, e.target.value)}
                            >
                              {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                            </select>
                            {!['resolved', 'dismissed', 'false_positive', 'escalated'].includes(a.status) && (
                              <Button variant="outline" size="sm" className="text-indigo-700 border-indigo-200" disabled={busyId === a.id} onClick={() => escalateToCase(a)}>
                                Escalate → Case
                              </Button>
                            )}
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
              <h3 className="text-lg font-bold text-gray-900">Raise monitoring alert</h3>
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
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</span>
                <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Unusual transaction volume" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm font-semibold text-gray-700 mb-1.5">Type</span>
                  <select className={inputCls} value={form.alert_type} onChange={(e) => setForm({ ...form, alert_type: e.target.value })}>
                    {ALERT_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-sm font-semibold text-gray-700 mb-1.5">Severity</span>
                  <select className={inputCls} value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                    {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">Description</span>
                <textarea className={inputCls} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={creating} onClick={createAlert}>{creating ? 'Raising…' : 'Raise alert'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400';

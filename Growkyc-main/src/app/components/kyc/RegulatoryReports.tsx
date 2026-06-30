import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from '../../lib/toast';
import { downloadCsv, csvDate } from '../../lib/exportCsv';
import { FileText, Plus, RefreshCw, ArrowLeft, X, Download, Send } from 'lucide-react';

function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('growkyc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const REPORT_TYPES = ['SMR', 'TTR', 'IFTI', 'AML_REPORT'];

interface Report {
  report_id: number;
  client_id: number;
  case_id: number | null;
  type: string;
  status: string;
  reference: string | null;
  hash: string | null;
  created_at: string | null;
}

interface ClientOption { id: number; name: string }

export function RegulatoryReports({ onBack }: { onBack?: () => void } = {}) {
  const [reports, setReports] = useState<Report[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ client_id: '', report_type: 'SMR' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/reports?limit=100', { headers: getAuthHeader() });
      if (res.status === 403) { toast.error('Your role cannot view reports'); setReports([]); return; }
      if (res.ok) setReports((await res.json()).items || []);
    } catch {
      toast.error('Network error loading reports');
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

  const generate = async () => {
    if (!form.client_id) { toast.error('Select a client'); return; }
    setCreating(true);
    try {
      const res = await fetch('/api/v1/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ client_id: Number(form.client_id), report_type: form.report_type }),
      });
      if (!res.ok) { toast.error(`Generate failed (${res.status})`); return; }
      const r = await res.json();
      toast.success(`Report #${r.report_id} generated (hash ${String(r.hash || '').slice(0, 10)}…)`);
      setShowCreate(false);
      setForm({ client_id: '', report_type: 'SMR' });
      await load();
    } catch {
      toast.error('Network error generating report');
    } finally {
      setCreating(false);
    }
  };

  const submit = async (r: Report) => {
    setBusyId(r.report_id);
    try {
      const res = await fetch(`/api/v1/reports/${r.report_id}/submit`, { method: 'POST', headers: getAuthHeader() });
      if (!res.ok) { toast.error(`Submit failed (${res.status})`); return; }
      const data = await res.json();
      toast.success(`Report #${r.report_id} submitted (${data.correlation_id || data.status})`);
      await load();
    } catch {
      toast.error('Network error submitting report');
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = () => {
    if (reports.length === 0) { toast.error('No reports to export'); return; }
    const n = downloadCsv(
      `regulatory_reports_${csvDate(new Date())}.csv`,
      ['Report ID', 'Client ID', 'Case ID', 'Type', 'Status', 'Reference', 'Hash', 'Created'],
      reports.map((r) => [r.report_id, r.client_id, r.case_id ?? '', r.type, r.status, r.reference || '', r.hash || '', csvDate(r.created_at)]),
    );
    toast.success(`Exported ${n} report(s) to CSV`);
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-600 border-gray-200',
      submitted: 'bg-amber-100 text-amber-700 border-amber-200',
      accepted: 'bg-green-100 text-green-700 border-green-200',
      acknowledged: 'bg-green-100 text-green-700 border-green-200',
    };
    return <Badge className={map[s] || 'bg-blue-100 text-blue-700'}>{s}</Badge>;
  };

  const stats = {
    total: reports.length,
    draft: reports.filter((r) => r.status === 'draft').length,
    submitted: reports.filter((r) => r.status !== 'draft').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {onBack && <Button variant="outline" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center"><FileText className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Regulatory Reports</h1>
              <p className="text-sm text-gray-500">Immutable, hashed regulatory reports — generated and submitted via the backend API</p>
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
            <Button variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-2" />Generate Report</Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            ['Total', stats.total, 'text-gray-900'],
            ['Draft', stats.draft, 'text-gray-500'],
            ['Submitted', stats.submitted, 'text-green-600'],
          ].map(([label, value, color]) => (
            <Card key={label as string}><CardContent className="p-4"><p className="text-sm text-gray-500">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></CardContent></Card>
          ))}
        </div>

        <Card>
          <CardHeader className="border-b"><CardTitle className="text-lg">All reports ({reports.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading…</div>
            ) : reports.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                No reports yet. Click <span className="font-semibold">Generate Report</span> to create an immutable regulatory report.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>{['Report', 'Client', 'Type', 'Status', 'Hash', 'Reference', 'Actions'].map((h) => <th key={h} className="text-left py-3 px-4 font-semibold text-gray-600">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.report_id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono font-medium text-gray-900">RPT-{r.report_id}</td>
                        <td className="py-3 px-4 text-gray-600">{r.client_id}</td>
                        <td className="py-3 px-4 text-gray-700">{r.type}</td>
                        <td className="py-3 px-4">{statusBadge(r.status)}</td>
                        <td className="py-3 px-4 font-mono text-xs text-gray-500">{r.hash ? `${r.hash.slice(0, 12)}…` : '—'}</td>
                        <td className="py-3 px-4 font-mono text-xs text-gray-600">{r.reference || '—'}</td>
                        <td className="py-3 px-4">
                          {r.status === 'draft' && (
                            <Button variant="outline" size="sm" disabled={busyId === r.report_id} onClick={() => submit(r)}><Send className="w-4 h-4 mr-1" />Submit</Button>
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
              <h3 className="text-lg font-bold text-gray-900">Generate regulatory report</h3>
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
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">Report type</span>
                <select className={inputCls} value={form.report_type} onChange={(e) => setForm({ ...form, report_type: e.target.value })}>
                  {REPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={creating} onClick={generate}>{creating ? 'Generating…' : 'Generate'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400';

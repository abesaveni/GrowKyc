import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from '../../lib/toast';
import { downloadCsv, csvDate } from '../../lib/exportCsv';
import { downloadRecordPdf } from '../../lib/exportPdf';
import {
  Shield, Plus, RefreshCw, ArrowLeft, X, Download, FileText, Send, CheckCircle, Ban,
} from 'lucide-react';

function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('growkyc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface SAR {
  id: number;
  client_id: number;
  case_id: number | null;
  status: string;
  raised_at: string | null;
  filed_at: string | null;
  regulator_reference: string | null;
}

interface ClientOption { id: number; name: string }

export function AustracSARRegister({ onBack }: { onBack?: () => void } = {}) {
  const [sars, setSars] = useState<SAR[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ client_id: '', reason_for_suspicion: '', transaction_details: '', narrative: '' });
  // Modal for the two-step actions that need text input.
  const [action, setAction] = useState<{ sar: SAR; kind: 'file' | 'decline' } | null>(null);
  const [actionText, setActionText] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/sars?limit=100', { headers: getAuthHeader() });
      if (res.status === 403) { toast.error('Your role cannot view the SAR register'); setSars([]); return; }
      if (!res.ok) { toast.error(`Could not load SARs (${res.status})`); return; }
      const data = await res.json();
      setSars(data.items || []);
    } catch {
      toast.error('Network error loading SARs');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadClients = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/clients?limit=100', { headers: getAuthHeader() });
      if (res.ok) {
        const data = await res.json();
        setClients((data.items || []).map((c: any) => ({ id: c.id, name: c.name || `Client ${c.id}` })));
      }
    } catch { /* non-fatal */ }
  }, []);

  useEffect(() => { load(); loadClients(); }, [load, loadClients]);

  const createSar = async () => {
    if (!form.client_id) { toast.error('Select a client'); return; }
    if (!form.reason_for_suspicion.trim()) { toast.error('Reason for suspicion is required'); return; }
    setCreating(true);
    try {
      const res = await fetch('/api/v1/sars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({
          client_id: Number(form.client_id),
          reason_for_suspicion: form.reason_for_suspicion,
          transaction_details: form.transaction_details || null,
          narrative: form.narrative || null,
        }),
      });
      if (res.status === 403) { toast.error('Only Compliance Officer / MLRO / Admin can raise a SAR'); return; }
      if (!res.ok) { toast.error(`Create failed (${res.status})`); return; }
      toast.success('SAR raised (draft)');
      setShowCreate(false);
      setForm({ client_id: '', reason_for_suspicion: '', transaction_details: '', narrative: '' });
      await load();
    } catch {
      toast.error('Network error creating SAR');
    } finally {
      setCreating(false);
    }
  };

  const submitForReview = async (s: SAR) => {
    setBusyId(s.id);
    try {
      const res = await fetch(`/api/v1/sars/${s.id}/submit-review`, { method: 'POST', headers: getAuthHeader() });
      if (!res.ok) { toast.error(`Submit failed (${res.status})`); return; }
      toast.success(`SAR #${s.id} submitted for MLRO review`);
      await load();
    } catch {
      toast.error('Network error');
    } finally {
      setBusyId(null);
    }
  };

  const runAction = async () => {
    if (!action) return;
    const { sar, kind } = action;
    setBusyId(sar.id);
    try {
      let res: Response;
      if (kind === 'file') {
        res = await fetch(`/api/v1/sars/${sar.id}/file?regulator_reference=${encodeURIComponent(actionText || '')}`, {
          method: 'POST', headers: getAuthHeader(),
        });
      } else {
        if (!actionText.trim()) { toast.error('A reason is required to decline'); setBusyId(null); return; }
        res = await fetch(`/api/v1/sars/${sar.id}/decline`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify({ sar_id: sar.id, reason: actionText }),
        });
      }
      if (res.status === 403) { toast.error('Filing/declining a SAR requires MLRO or Admin'); return; }
      if (!res.ok) { toast.error(`Action failed (${res.status})`); return; }
      toast.success(kind === 'file' ? `SAR #${sar.id} filed with AUSTRAC` : `SAR #${sar.id} declined`);
      setAction(null);
      setActionText('');
      await load();
    } catch {
      toast.error('Network error');
    } finally {
      setBusyId(null);
    }
  };

  const receiptPdf = (s: SAR) => {
    downloadRecordPdf(
      `austrac_sar_${s.id}.pdf`,
      `AUSTRAC SAR Filing Receipt — SAR-${s.id}`,
      [
        ['SAR ID', `SAR-${s.id}`],
        ['Client ID', String(s.client_id)],
        ['Status', s.status],
        ['Raised', s.raised_at ? new Date(s.raised_at).toLocaleString() : '—'],
        ['Filed', s.filed_at ? new Date(s.filed_at).toLocaleString() : '—'],
        ['Regulator Reference', s.regulator_reference || '—'],
      ],
      'Suspicious Activity Report record. Generated from the GrowKYC AUSTRAC module.',
    );
    toast.success('SAR receipt downloaded as PDF');
  };

  const exportCsv = () => {
    if (sars.length === 0) { toast.error('No SARs to export'); return; }
    const n = downloadCsv(
      `austrac_sars_${csvDate(new Date())}.csv`,
      ['SAR ID', 'Client ID', 'Case ID', 'Status', 'Raised', 'Filed', 'Regulator Reference'],
      sars.map((s) => [s.id, s.client_id, s.case_id ?? '', s.status, csvDate(s.raised_at), csvDate(s.filed_at), s.regulator_reference || '']),
    );
    toast.success(`Exported ${n} SAR(s) to CSV`);
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-600 border-gray-200',
      under_review: 'bg-amber-100 text-amber-700 border-amber-200',
      filed: 'bg-green-100 text-green-700 border-green-200',
      declined: 'bg-red-100 text-red-700 border-red-200',
    };
    return <Badge className={map[s] || 'bg-gray-100 text-gray-600'}>{s.replace('_', ' ')}</Badge>;
  };

  const stats = {
    total: sars.length,
    draft: sars.filter((s) => s.status === 'draft').length,
    review: sars.filter((s) => s.status === 'under_review').length,
    filed: sars.filter((s) => s.status === 'filed').length,
    declined: sars.filter((s) => s.status === 'declined').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {onBack && <Button variant="outline" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center"><Shield className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AUSTRAC SAR Register</h1>
              <p className="text-sm text-gray-500">Suspicious Activity Reports — raised, reviewed and filed via the backend API</p>
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
            <Button variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowCreate(true)}><Plus className="w-4 h-4 mr-2" />Raise SAR</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            ['Total', stats.total, 'text-gray-900'],
            ['Draft', stats.draft, 'text-gray-500'],
            ['Under Review', stats.review, 'text-amber-600'],
            ['Filed', stats.filed, 'text-green-600'],
            ['Declined', stats.declined, 'text-red-600'],
          ].map(([label, value, color]) => (
            <Card key={label as string}><CardContent className="p-4"><p className="text-sm text-gray-500">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></CardContent></Card>
          ))}
        </div>

        <Card>
          <CardHeader className="border-b"><CardTitle className="text-lg">All SARs ({sars.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading…</div>
            ) : sars.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                No SARs yet. Click <span className="font-semibold">Raise SAR</span> to create one — it persists to the backend.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>{['SAR ID', 'Client', 'Case', 'Status', 'Raised', 'Reg. Reference', 'Actions'].map((h) => <th key={h} className="text-left py-3 px-4 font-semibold text-gray-600">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {sars.map((s) => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono font-medium text-gray-900">SAR-{s.id}</td>
                        <td className="py-3 px-4 text-gray-600">{s.client_id}</td>
                        <td className="py-3 px-4 text-gray-600">{s.case_id ? `#${s.case_id}` : '—'}</td>
                        <td className="py-3 px-4">{statusBadge(s.status)}</td>
                        <td className="py-3 px-4 text-gray-500">{csvDate(s.raised_at)}</td>
                        <td className="py-3 px-4 text-gray-700 font-mono text-xs">{s.regulator_reference || '—'}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap items-center gap-2">
                            {s.status === 'draft' && (
                              <Button variant="outline" size="sm" disabled={busyId === s.id} onClick={() => submitForReview(s)}><Send className="w-4 h-4 mr-1" />Submit</Button>
                            )}
                            {s.status === 'under_review' && (
                              <Button variant="outline" size="sm" className="text-green-700 border-green-200" disabled={busyId === s.id} onClick={() => { setAction({ sar: s, kind: 'file' }); setActionText(''); }}><CheckCircle className="w-4 h-4 mr-1" />File</Button>
                            )}
                            {(s.status === 'draft' || s.status === 'under_review') && (
                              <Button variant="outline" size="sm" className="text-red-700 border-red-200" disabled={busyId === s.id} onClick={() => { setAction({ sar: s, kind: 'decline' }); setActionText(''); }}><Ban className="w-4 h-4 mr-1" />Decline</Button>
                            )}
                            {(s.status === 'filed' || s.status === 'declined') && (
                              <Button variant="ghost" size="sm" onClick={() => receiptPdf(s)}><Download className="w-4 h-4 mr-1" />Receipt</Button>
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

      {/* Create SAR modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Raise Suspicious Activity Report</h3>
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
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">Reason for suspicion *</span>
                <input className={inputCls} value={form.reason_for_suspicion} onChange={(e) => setForm({ ...form, reason_for_suspicion: e.target.value })} placeholder="e.g. Structuring below threshold" />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">Transaction details</span>
                <input className={inputCls} value={form.transaction_details} onChange={(e) => setForm({ ...form, transaction_details: e.target.value })} />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">Narrative</span>
                <textarea className={inputCls} rows={3} value={form.narrative} onChange={(e) => setForm({ ...form, narrative: e.target.value })} />
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={creating} onClick={createSar}>{creating ? 'Raising…' : 'Raise SAR'}</Button>
            </div>
          </div>
        </div>
      )}

      {/* File / Decline modal */}
      {action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setAction(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">{action.kind === 'file' ? `File SAR-${action.sar.id} with AUSTRAC` : `Decline SAR-${action.sar.id}`}</h3>
              <Button variant="ghost" size="sm" onClick={() => setAction(null)}><X className="w-4 h-4" /></Button>
            </div>
            <div className="px-6 py-4">
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">{action.kind === 'file' ? 'AUSTRAC regulator reference' : 'Reason for declining *'}</span>
                <input className={inputCls} value={actionText} onChange={(e) => setActionText(e.target.value)} placeholder={action.kind === 'file' ? 'e.g. AUS-2026-0001' : 'Why is this not reportable?'} />
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <Button variant="outline" onClick={() => setAction(null)}>Cancel</Button>
              <Button className={action.kind === 'file' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'} disabled={busyId === action.sar.id} onClick={runAction}>
                {action.kind === 'file' ? 'File with AUSTRAC' : 'Decline SAR'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400';

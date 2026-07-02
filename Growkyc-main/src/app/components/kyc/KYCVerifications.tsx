import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from '../../lib/toast';
import {
  ShieldCheck, RefreshCw, ArrowLeft, Send, Copy, Eye, X, Mail,
} from 'lucide-react';

function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('growkyc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface Verification {
  session_id: string;
  client_id: number | null;
  kind: string;
  status: string;
  contact_email: string | null;
  verification_url: string | null;
  decision: any;
  created_at: string | null;
}

interface ClientOption { id: number; name: string }

export function KYCVerifications({ onBack }: { onBack?: () => void } = {}) {
  const [items, setItems] = useState<Verification[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [clientId, setClientId] = useState('');
  const [decision, setDecision] = useState<Verification | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/verifications?limit=100', { headers: getAuthHeader() });
      if (res.status === 403) { toast.error('Your role cannot view verifications'); setItems([]); return; }
      if (res.ok) setItems((await res.json()).items || []);
    } catch {
      toast.error('Network error loading verifications');
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

  const invite = async () => {
    if (!clientId) { toast.error('Select a client to invite'); return; }
    setInviting(true);
    try {
      const res = await fetch('/api/v1/verifications/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ client_id: Number(clientId), kind: 'individual' }),
      });
      if (res.status === 503) { toast.error('Didit KYC is not enabled in this deployment'); return; }
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        toast.error(d.detail || `Invite failed (${res.status})`);
        return;
      }
      const data = await res.json();
      if (data.email_sent) {
        toast.success(`Invitation emailed to ${data.contact_email}`);
      } else {
        toast.success('Verification link created', `Email not sent (SMTP off) — copy the link from the table to share`);
      }
      setClientId('');
      await load();
    } catch {
      toast.error('Network error sending invite');
    } finally {
      setInviting(false);
    }
  };

  const copyLink = (url: string | null) => {
    if (!url) { toast.error('No link available'); return; }
    navigator.clipboard.writeText(url).then(
      () => toast.success('Verification link copied'),
      () => toast.error('Could not copy'),
    );
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      'Not Started': 'bg-gray-100 text-gray-600 border-gray-200',
      'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
      'In Review': 'bg-amber-100 text-amber-700 border-amber-200',
      'Approved': 'bg-green-100 text-green-700 border-green-200',
      'Declined': 'bg-red-100 text-red-700 border-red-200',
      'Abandoned': 'bg-gray-100 text-gray-500 border-gray-200',
      'Expired': 'bg-gray-100 text-gray-500 border-gray-200',
    };
    return <Badge className={map[s] || 'bg-gray-100 text-gray-600'}>{s}</Badge>;
  };

  const stats = {
    total: items.length,
    pending: items.filter((i) => ['Not Started', 'In Progress', 'In Review'].includes(i.status)).length,
    approved: items.filter((i) => i.status === 'Approved').length,
    declined: items.filter((i) => i.status === 'Declined').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {onBack && <Button variant="outline" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center"><ShieldCheck className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">KYC Verifications (Didit)</h1>
              <p className="text-sm text-gray-500">Invite clients to verify identity & documents — results saved automatically via webhook</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="ml-auto" onClick={load} disabled={loading}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>
        </div>

        {/* Invite a client */}
        <Card>
          <CardHeader className="border-b"><CardTitle className="text-lg">Invite a client to verify</CardTitle></CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-end gap-3">
              <label className="block flex-1 min-w-[240px]">
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">Client</span>
                <select className={inputCls} value={clientId} onChange={(e) => setClientId(e.target.value)}>
                  <option value="">Select a client…</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name} (#{c.id})</option>)}
                </select>
              </label>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled={inviting} onClick={invite}>
                <Send className="w-4 h-4 mr-2" />{inviting ? 'Sending…' : 'Send KYC invite'}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> A welcome email with a personal verification link is sent to the client's email on file.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ['Total', stats.total, 'text-gray-900'],
            ['Pending', stats.pending, 'text-amber-600'],
            ['Approved', stats.approved, 'text-green-600'],
            ['Declined', stats.declined, 'text-red-600'],
          ].map(([label, value, color]) => (
            <Card key={label as string}><CardContent className="p-4"><p className="text-sm text-gray-500">{label}</p><p className={`text-2xl font-bold ${color}`}>{value}</p></CardContent></Card>
          ))}
        </div>

        <Card>
          <CardHeader className="border-b"><CardTitle className="text-lg">Verification sessions ({items.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading…</div>
            ) : items.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                No verifications yet. Invite a client above to start their KYC.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>{['Client', 'Email', 'Kind', 'Status', 'Link', 'Result'].map((h) => <th key={h} className="text-left py-3 px-4 font-semibold text-gray-600">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {items.map((v) => (
                      <tr key={v.session_id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800">{v.client_id ? `#${v.client_id}` : '—'}</td>
                        <td className="py-3 px-4 text-gray-600">{v.contact_email || '—'}</td>
                        <td className="py-3 px-4 text-gray-700">{v.kind}</td>
                        <td className="py-3 px-4">{statusBadge(v.status)}</td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm" onClick={() => copyLink(v.verification_url)}><Copy className="w-4 h-4 mr-1" />Copy</Button>
                        </td>
                        <td className="py-3 px-4">
                          {v.decision ? (
                            <Button variant="outline" size="sm" onClick={() => setDecision(v)}><Eye className="w-4 h-4 mr-1" />View</Button>
                          ) : <span className="text-xs text-gray-400">pending</span>}
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

      {/* Decision detail modal */}
      {decision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDecision(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Verification result</h3>
                <p className="text-sm text-gray-500">Client #{decision.client_id} · {decision.contact_email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setDecision(null)}><X className="w-4 h-4" /></Button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Overall</span>
                {statusBadge(decision.status)}
              </div>

              {/* Rich display parsed from the real Didit decision structure */}
              {(() => {
                const d: any = decision.decision || {};
                const first = (v: any) => (Array.isArray(v) ? v[0] : v) || {};
                const idv = first(d.id_verifications) || first(d.id_verification);
                const fm = first(d.face_matches) || first(d.face_match);
                const aml = first(d.aml_screenings) || first(d.aml);
                const live = first(d.liveness) || first(d.liveness_checks) || d.liveness || {};

                const fullName = idv.full_name || [idv.first_name, idv.last_name].filter(Boolean).join(' ') || '';

                const checkBadge = (s: string) => {
                  const ok = /approved|passed|clear|verified|match|success/i.test(s);
                  const bad = /declined|failed|no_match|expired|reject/i.test(s);
                  const cls = ok ? 'bg-green-50 text-green-700 border-green-200'
                    : bad ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200';
                  return <Badge className={cls}>{s}</Badge>;
                };

                const details: [string, any][] = [
                  ['Full name', fullName],
                  ['Date of birth', idv.date_of_birth],
                  ['Age', idv.age],
                  ['Nationality', idv.nationality || idv.issuing_country || idv.issuing_state],
                  ['Document type', idv.document_type],
                  ['Document number', idv.document_number],
                  ['Issued', idv.date_of_issue],
                  ['Expires', idv.expiration_date],
                  ['Address', idv.address || idv.formatted_address],
                ].filter(([, v]) => v != null && v !== '');

                const checks: [string, string][] = [
                  idv.status && ['ID Verification', String(idv.status)],
                  live.status && ['Liveness', String(live.status)],
                  fm.status && [`Face Match${fm.similarity_percentage != null ? ` (${fm.similarity_percentage}%)` : ''}`, String(fm.status)],
                  aml.status && [`AML / Sanctions${typeof aml.total_hits === 'number' ? ` (${aml.total_hits} hit${aml.total_hits === 1 ? '' : 's'})` : ''}`, String(aml.status)],
                ].filter(Boolean) as [string, string][];

                if (details.length === 0 && checks.length === 0) {
                  return <p className="text-sm text-gray-500">No detailed data yet — the verification hasn't completed or hasn't synced. It appears automatically once the client finishes.</p>;
                }

                return (
                  <>
                    {details.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Identity details</p>
                        <div className="border border-gray-200 rounded-lg divide-y">
                          {details.map(([label, value]) => (
                            <div key={label} className="flex justify-between gap-4 px-4 py-2.5">
                              <span className="text-sm text-gray-500">{label}</span>
                              <span className="text-sm text-gray-900 font-medium text-right break-words">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {checks.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Verification checks</p>
                        <div className="border border-gray-200 rounded-lg divide-y">
                          {checks.map(([label, st]) => (
                            <div key={label} className="flex items-center justify-between px-4 py-2.5">
                              <span className="text-sm text-gray-700">{label}</span>
                              {checkBadge(st)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {(idv.front_image || idv.back_image) && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Documents</p>
                        <div className="flex gap-4">
                          {idv.front_image && <a href={idv.front_image} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">Front image ↗</a>}
                          {idv.back_image && <a href={idv.back_image} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">Back image ↗</a>}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Raw payload, collapsed by default */}
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-500 hover:text-gray-700 select-none">Raw verification data</summary>
                <pre className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(decision.decision, null, 2)}
                </pre>
              </details>
            </div>
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <Button variant="outline" onClick={() => setDecision(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400';

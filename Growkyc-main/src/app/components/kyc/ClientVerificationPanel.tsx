import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ShieldCheck, RefreshCw } from 'lucide-react';

function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('growkyc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Shows a client's latest Didit KYC verification (identity details + checks),
 * pulled from the backend. Reusable anywhere a client id is known.
 * `clientId` may be a numeric id or an "api-<id>" string (from merged live data).
 */
export function ClientVerificationPanel({ clientId }: { clientId: string | number }) {
  const numericId = String(clientId).replace(/^api-/, '');
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!numericId || Number.isNaN(Number(numericId))) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/verifications?client_id=${numericId}&limit=1`, { headers: getAuthHeader() });
      if (res.ok) {
        const data = await res.json();
        setItem((data.items || [])[0] || null);
      }
    } catch { /* non-fatal */ } finally { setLoading(false); }
  }, [numericId]);

  useEffect(() => { load(); }, [load]);

  // Pull the latest decision live from Didit, then reload.
  const refresh = async () => {
    if (!item?.session_id) { await load(); return; }
    setRefreshing(true);
    try {
      await fetch(`/api/v1/verifications/${item.session_id}?refresh=true`, { headers: getAuthHeader() });
      await load();
    } catch { /* ignore */ } finally { setRefreshing(false); }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      Approved: 'bg-green-100 text-green-700 border-green-200',
      Declined: 'bg-red-100 text-red-700 border-red-200',
    };
    return <Badge className={map[s] || 'bg-amber-100 text-amber-700 border-amber-200'}>{s || '—'}</Badge>;
  };
  const checkBadge = (s: string) => {
    const ok = /approved|passed|clear|verified|match|success/i.test(s);
    const bad = /declined|failed|no_match|expired|reject/i.test(s);
    return <Badge className={ok ? 'bg-green-50 text-green-700 border-green-200' : bad ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}>{s}</Badge>;
  };

  const d: any = item?.decision || {};
  const first = (v: any) => (Array.isArray(v) ? v[0] : v) || {};
  const idv = first(d.id_verifications) || first(d.id_verification);
  const fm = first(d.face_matches) || first(d.face_match);
  const aml = first(d.aml_screenings) || first(d.aml);
  const live = first(d.liveness) || first(d.liveness_checks) || d.liveness || {};
  const fullName = idv.full_name || [idv.first_name, idv.last_name].filter(Boolean).join(' ') || '';

  const details: [string, any][] = [
    ['Full name', fullName],
    ['Date of birth', idv.date_of_birth],
    ['Nationality', idv.nationality || idv.issuing_country],
    ['Document type', idv.document_type],
    ['Document number', idv.document_number],
    ['Expires', idv.expiration_date],
    ['Address', idv.address || idv.formatted_address],
  ].filter(([, v]) => v != null && v !== '');

  const checks: [string, string][] = [
    idv.status && ['ID Verification', String(idv.status)],
    live.status && ['Liveness', String(live.status)],
    fm.status && [`Face Match${fm.similarity_percentage != null ? ` (${fm.similarity_percentage}%)` : ''}`, String(fm.status)],
    aml.status && [`AML / Sanctions${typeof aml.total_hits === 'number' ? ` (${aml.total_hits} hit${aml.total_hits === 1 ? '' : 's'})` : ''}`, String(aml.status)],
  ].filter(Boolean) as [string, string][];

  return (
    <Card className="border border-gray-200">
      <CardHeader className="border-b flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          KYC Verification (Didit)
          {item && statusBadge(item.status)}
        </CardTitle>
        <Button variant="outline" size="sm" onClick={refresh} disabled={refreshing || loading}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />Refresh
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : !item ? (
          <p className="text-sm text-gray-500">No KYC verification on file for this client. Use <span className="font-semibold">KYC Verifications → Send invite</span> to start one.</p>
        ) : details.length === 0 && checks.length === 0 ? (
          <p className="text-sm text-gray-500">
            Verification <span className="font-medium">{item.status}</span> — no detailed data yet.
            It populates automatically when the client completes, or click <span className="font-semibold">Refresh</span> to pull the latest from Didit.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {details.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Identity details</p>
                <div className="border border-gray-200 rounded-lg divide-y">
                  {details.map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3 px-3 py-2">
                      <span className="text-xs text-gray-500">{label}</span>
                      <span className="text-xs text-gray-900 font-medium text-right break-words">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {checks.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Checks</p>
                <div className="border border-gray-200 rounded-lg divide-y">
                  {checks.map(([label, st]) => (
                    <div key={label} className="flex items-center justify-between px-3 py-2">
                      <span className="text-xs text-gray-700">{label}</span>
                      {checkBadge(st)}
                    </div>
                  ))}
                </div>
                {(idv.front_image || idv.back_image) && (
                  <div className="flex gap-3 mt-2">
                    {idv.front_image && <a href={idv.front_image} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">Front image ↗</a>}
                    {idv.back_image && <a href={idv.back_image} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">Back image ↗</a>}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

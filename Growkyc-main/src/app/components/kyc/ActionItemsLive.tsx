import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from '../../lib/toast';
import {
  AlertCircle, RefreshCw, ArrowLeft, Bell, FolderOpen, ShieldAlert, FileText, ClipboardCheck, ArrowRight,
} from 'lucide-react';

function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('growkyc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

type Sev = 'critical' | 'high' | 'medium' | 'low';

interface Item {
  key: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  sub: string;
  severity: Sev;
  view: string;
}

const sevRank: Record<Sev, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export function ActionItemsLive({ onBack, onNavigate }: { onBack?: () => void; onNavigate?: (view: string) => void } = {}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const h = getAuthHeader();
    const safe = async (url: string) => {
      try { const r = await fetch(url, { headers: h }); return r.ok ? await r.json() : null; } catch { return null; }
    };
    try {
      const [alerts, cases, edd, kyc, sars] = await Promise.all([
        safe('/api/v1/alerts?status=open&limit=100'),
        safe('/api/v1/cases?limit=100'),
        safe('/api/v1/edd?limit=100'),
        safe('/api/v1/admin/kyc/pending?limit=100'),
        safe('/api/v1/sars?limit=100'),
      ]);
      const out: Item[] = [];

      (alerts?.items || []).forEach((a: any) => out.push({
        key: `alert-${a.id}`, category: 'Monitoring Alert', icon: Bell,
        title: a.title, sub: `${a.alert_type.replace(/_/g, ' ')} · client #${a.client_id}`,
        severity: (a.severity as Sev) || 'medium', view: 'alerts_live',
      }));

      (cases?.items || []).filter((c: any) => c.status !== 'closed').forEach((c: any) => out.push({
        key: `case-${c.case_id}`, category: 'Open Case', icon: FolderOpen,
        title: c.title, sub: `${c.status} · client #${c.client_id}`,
        severity: c.status === 'escalated' ? 'high' : 'medium', view: 'cases_live',
      }));

      (edd?.items || []).filter((e: any) => !['approved', 'rejected'].includes(e.status)).forEach((e: any) => out.push({
        key: `edd-${e.edd_id}`, category: 'EDD Workflow', icon: ShieldAlert,
        title: `EDD-${e.edd_id} (${e.trigger_reason.replace(/_/g, ' ')})`, sub: `${e.status.replace('_', ' ')} · client #${e.client_id}`,
        severity: e.status === 'escalated' ? 'high' : 'medium', view: 'edd_live',
      }));

      (kyc?.items || []).filter((k: any) => (k.status || 'Pending').toLowerCase() === 'pending').forEach((k: any) => out.push({
        key: `kyc-${k.id}`, category: 'KYC Review', icon: ClipboardCheck,
        title: `KYC-${k.id}: ${k.name || 'Applicant'}`, sub: 'Awaiting review/approval',
        severity: 'medium', view: 'kyc_review',
      }));

      (sars?.items || []).filter((s: any) => ['draft', 'under_review'].includes(s.status)).forEach((s: any) => out.push({
        key: `sar-${s.id}`, category: 'SAR', icon: FileText,
        title: `SAR-${s.id}`, sub: `${s.status.replace('_', ' ')} · client #${s.client_id}`,
        severity: s.status === 'under_review' ? 'high' : 'medium', view: 'austrac_sar',
      }));

      out.sort((a, b) => sevRank[a.severity] - sevRank[b.severity]);
      setItems(out);
    } catch {
      toast.error('Network error loading action items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const sevBadge = (s: Sev) => {
    const map: Record<Sev, string> = {
      critical: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-amber-100 text-amber-700 border-amber-200',
      medium: 'bg-blue-100 text-blue-700 border-blue-200',
      low: 'bg-gray-100 text-gray-600 border-gray-200',
    };
    return <Badge className={map[s]}>{s}</Badge>;
  };

  const counts = {
    total: items.length,
    critical: items.filter((i) => i.severity === 'critical').length,
    high: items.filter((i) => i.severity === 'high').length,
  };
  const byCategory = items.reduce<Record<string, number>>((acc, i) => { acc[i.category] = (acc[i.category] || 0) + 1; return acc; }, {});

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          {onBack && <Button variant="outline" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center"><AlertCircle className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Action Items</h1>
              <p className="text-sm text-gray-500">Everything that needs attention — aggregated live from the backend</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="ml-auto" onClick={load} disabled={loading}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold text-gray-900">{counts.total}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">Critical</p><p className="text-2xl font-bold text-red-600">{counts.critical}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-sm text-gray-500">High</p><p className="text-2xl font-bold text-amber-600">{counts.high}</p></CardContent></Card>
          {Object.entries(byCategory).slice(0, 3).map(([cat, n]) => (
            <Card key={cat}><CardContent className="p-4"><p className="text-sm text-gray-500 truncate">{cat}</p><p className="text-2xl font-bold text-indigo-600">{n}</p></CardContent></Card>
          ))}
        </div>

        <Card>
          <CardHeader className="border-b"><CardTitle className="text-lg">Open items ({items.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading…</div>
            ) : items.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <ClipboardCheck className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                Nothing needs attention right now. Everything is resolved or closed.
              </div>
            ) : (
              <div className="divide-y">
                {items.map((i) => {
                  const Icon = i.icon;
                  return (
                    <div key={i.key} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{i.category}</span>
                          {sevBadge(i.severity)}
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">{i.title}</p>
                        <p className="text-xs text-gray-500 truncate">{i.sub}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => onNavigate?.(i.view)}>
                        Open <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

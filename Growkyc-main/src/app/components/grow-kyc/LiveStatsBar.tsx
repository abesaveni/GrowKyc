import React, { useEffect, useState } from 'react';
import { Users, AlertTriangle, ClipboardCheck, FolderOpen, FileText, RefreshCw } from 'lucide-react';

function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem('growkyc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface Stats {
  total_clients: number;
  high_risk_clients: number;
  pending_approvals: number;
  total_cases: number;
  sars_filed: number;
}

/**
 * A compact, real-data KPI strip backed by the live API. Rendered above the
 * (otherwise illustrative) role dashboards so the headline numbers each role
 * sees are genuine — clients, high-risk, pending KYC approvals, cases, SARs filed.
 */
export function LiveStatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [dashRes, sarRes] = await Promise.all([
        fetch('/api/v1/dashboard/', { headers: getAuthHeader() }),
        fetch('/api/v1/sars?status=filed&limit=1', { headers: getAuthHeader() }),
      ]);
      const dash = dashRes.ok ? await dashRes.json() : {};
      const sar = sarRes.ok ? await sarRes.json() : { total: 0 };
      setStats({
        total_clients: dash.total_clients ?? 0,
        high_risk_clients: dash.high_risk_clients ?? 0,
        pending_approvals: dash.pending_approvals ?? 0,
        total_cases: dash.total_cases ?? 0,
        sars_filed: sar.total ?? 0,
      });
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (!loading && !stats) return null;

  const cards = [
    { label: 'Clients', value: stats?.total_clients, icon: Users, color: 'text-blue-600' },
    { label: 'High Risk', value: stats?.high_risk_clients, icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Pending KYC', value: stats?.pending_approvals, icon: ClipboardCheck, color: 'text-amber-600' },
    { label: 'Cases', value: stats?.total_cases, icon: FolderOpen, color: 'text-indigo-600' },
    { label: 'SARs Filed', value: stats?.sars_filed, icon: FileText, color: 'text-green-600' },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700">
          <span className="w-2 h-2 rounded-full bg-green-500" /> Live · from API
        </span>
        <button onClick={load} className="text-gray-400 hover:text-gray-600" title="Refresh">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">{c.label}</span>
                <Icon className={`w-4 h-4 ${c.color}`} />
              </div>
              <p className={`text-2xl font-bold ${c.color}`}>{loading ? '—' : c.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

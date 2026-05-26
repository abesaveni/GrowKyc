import React, { useEffect, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { BarChart3, Download, RefreshCw, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../app/components/ui/button';
import { DashboardCard } from '../components/DashboardCard';
import { ChartWrapper } from '../components/ChartWrapper';
import { fetchMock } from '../utils/fetchMock';
import {
  getDeploymentRateSeries,
  getSectorAllocation,
  getVintageYearData,
  computeAnalyticsSummary
} from '../data/analyticsData';

const PIE_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
const TIME_RANGES = [
  { id: '1y', label: '1Y' },
  { id: '2y', label: '2Y' },
  { id: 'all', label: 'All' }
];

function pieLabel({ name, percent }) {
  if (percent == null || percent < 0.05) return '';
  return `${name} ${(percent * 100).toFixed(0)}%`;
}

export function AnalyticsPage({ role = 'fund-manager' }) {
  const [timeRange, setTimeRange] = useState('1y');
  const [deployment, setDeployment] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [vintage, setVintage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchMock(() => ({
      deployment: getDeploymentRateSeries(timeRange),
      sectors: getSectorAllocation(),
      vintage: getVintageYearData(timeRange)
    }))
      .then((data) => {
        setDeployment(data.deployment);
        setSectors(data.sectors);
        setVintage(data.vintage);
      })
      .catch(() => setError('Unable to load analytics data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [timeRange]);

  const summary = useMemo(
    () => computeAnalyticsSummary(deployment, sectors, vintage),
    [deployment, sectors, vintage]
  );

  const exportCsv = () => {
    const header = 'quarter,deployment_pct';
    const rows = deployment.map((d) => `${d.quarter},${d.rate}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `imfo-analytics-${timeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics exported');
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button type="button" variant="outline" onClick={load}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600 mt-1">
            Deployment velocity, sector mix, and vintage year analysis
            {role === 'investment-analyst' ? ' — investment analyst workspace' : ''}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-0.5">
            {TIME_RANGES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setTimeRange(r.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  timeRange === r.id ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={exportCsv} disabled={loading || !deployment.length}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Avg deployment rate"
            value={`${summary.avgDeploymentPct}%`}
            subtitle={`Latest ${summary.latestRate}% (${summary.rateDelta >= 0 ? '+' : ''}${summary.rateDelta}pp)`}
            icon={TrendingUp}
          />
          <DashboardCard title="Top sector" value={summary.topSectorName} subtitle={`${summary.topSectorPct}% of portfolio`} icon={BarChart3} />
          <DashboardCard title="Deployed (vintage)" value={`$${summary.totalDeployedM}M`} subtitle={`${summary.totalDeals} deals in range`} icon={BarChart3} accent="emerald" />
          <DashboardCard title="Quarters shown" value={String(deployment.length)} subtitle={`Range: ${timeRange.toUpperCase()}`} icon={BarChart3} />
        </div>
      )}

      <ChartWrapper
        title="Deployment rate"
        subtitle="Capital deployed per quarter (% of annual target)"
        actions={
          loading ? <span className="text-xs text-gray-500">Loading…</span> : null
        }
      >
        {loading ? (
          <div className="h-[280px] flex items-center justify-center text-gray-500">Loading chart…</div>
        ) : deployment.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-gray-500">No data for selected range</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={deployment}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 'auto']} />
              <Tooltip formatter={(v) => [`${v}%`, 'Deployment']} />
              <Line type="monotone" dataKey="rate" name="Deployment %" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartWrapper>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper title="Sector allocation" subtitle="Current portfolio by sector (%)">
          {loading ? (
            <div className="h-[280px] flex items-center justify-center text-gray-500">Loading…</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={sectors}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={pieLabel}
                  labelLine={false}
                >
                  {sectors.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, 'Allocation']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartWrapper>

        <ChartWrapper title="Vintage year" subtitle="Deployed capital by vintage ($M)">
          {loading ? (
            <div className="h-[280px] flex items-center justify-center text-gray-500">Loading…</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={vintage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="deployed" name="Deployed ($M)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="count" name="# Deals" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartWrapper>
      </div>
    </div>
  );
}

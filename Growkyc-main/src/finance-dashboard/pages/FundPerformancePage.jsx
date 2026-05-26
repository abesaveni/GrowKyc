import React, { useEffect, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartWrapper } from '../components/ChartWrapper';
import { DashboardCard } from '../components/DashboardCard';
import { fetchMock } from '../utils/fetchMock';
import {
  getPerformanceSeries,
  getPerformanceMetrics,
  TIME_RANGES
} from '../data/fundPerformanceData';

export function FundPerformancePage() {
  const [range, setRange] = useState('1Y');
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [series, setSeries] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMock(() => ({
      series: getPerformanceSeries(range),
      metrics: getPerformanceMetrics()
    })).then((data) => {
      setSeries(data.series);
      setMetrics(data.metrics);
      setLoading(false);
    });
  }, [range]);

  const chartData = useMemo(() => series, [series]);

  const timeButtons = (
    <>
      {TIME_RANGES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => setRange(r)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
            range === r
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {r}
        </button>
      ))}
      <label className="flex items-center gap-2 text-sm text-gray-700 ml-2 border-l pl-3 border-gray-300">
        <input
          type="checkbox"
          checked={showBenchmark}
          onChange={(e) => setShowBenchmark(e.target.checked)}
          className="rounded border-gray-300"
        />
        Benchmark
      </label>
    </>
  );

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Fund Performance</h2>
        <p className="text-gray-600 mt-1">Net asset value index vs benchmark with key return multiples.</p>
      </div>

      {loading || !metrics ? (
        <p className="text-gray-500 py-12 text-center">Loading performance data…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DashboardCard title="IRR" value={`${metrics.irr}%`} accent="indigo" />
            <DashboardCard title="TVPI" value={`${metrics.tvpi}x`} accent="emerald" />
            <DashboardCard title="DPI" value={`${metrics.dpi}x`} accent="amber" />
            <DashboardCard title="RVPI" value={`${metrics.rvpi}x`} accent="rose" />
          </div>

          <ChartWrapper title="NAV performance" subtitle="Indexed to 100 at period start" actions={timeButtons}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="fund" name="Fund" stroke="#4f46e5" strokeWidth={2} dot={false} />
                {showBenchmark && (
                  <Line type="monotone" dataKey="benchmark" name="Benchmark" stroke="#94a3b8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </>
      )}
    </div>
  );
}

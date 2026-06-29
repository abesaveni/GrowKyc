import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsProps {
  onNavigate?: (page: string) => void;
}

const COLORS = ['#2855a6', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

export function Analytics({ onNavigate }: AnalyticsProps) {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'jobs' | 'time' | 'clients'>('revenue');

  // Mock data for charts
  const revenueData = [
    { month: 'Jul', revenue: 42000, target: 45000 },
    { month: 'Aug', revenue: 47000, target: 45000 },
    { month: 'Sep', revenue: 43000, target: 45000 },
    { month: 'Oct', revenue: 51000, target: 50000 },
    { month: 'Nov', revenue: 49000, target: 50000 },
    { month: 'Dec', revenue: 55000, target: 50000 },
    { month: 'Jan', revenue: 48000, target: 50000 },
    { month: 'Feb', revenue: 52000, target: 50000 }
  ];

  const jobsData = [
    { month: 'Jul', completed: 28, pending: 12 },
    { month: 'Aug', completed: 32, pending: 10 },
    { month: 'Sep', completed: 27, pending: 15 },
    { month: 'Oct', completed: 35, pending: 8 },
    { month: 'Nov', completed: 31, pending: 11 },
    { month: 'Dec', completed: 38, pending: 6 },
    { month: 'Jan', completed: 29, pending: 14 },
    { month: 'Feb', completed: 34, pending: 9 }
  ];

  const staffProductivity = [
    { name: 'Mike Brown', jobs: 45, hours: 178, efficiency: 96 },
    { name: 'Sarah Johnson', jobs: 42, hours: 165, efficiency: 94 },
    { name: 'Emily Davis', jobs: 38, hours: 152, efficiency: 92 },
    { name: 'Tom Wilson', jobs: 35, hours: 148, efficiency: 89 },
    { name: 'John Smith', jobs: 32, hours: 142, efficiency: 87 }
  ];

  const clientsByType = [
    { name: 'Company', value: 45, color: '#2855a6' },
    { name: 'SMSF', value: 32, color: '#3b82f6' },
    { name: 'Trust', value: 28, color: '#60a5fa' },
    { name: 'Individual', value: 18, color: '#93c5fd' },
    { name: 'Partnership', value: 12, color: '#dbeafe' }
  ];

  const serviceRevenue = [
    { service: 'Tax Returns', revenue: 145000 },
    { service: 'BAS Services', revenue: 98000 },
    { service: 'SMSF', revenue: 87000 },
    { service: 'Bookkeeping', revenue: 76000 },
    { service: 'Audit', revenue: 54000 }
  ];

  const kpiData = {
    revenue: {
      current: 387000,
      previous: 356000,
      change: 8.7,
      target: 400000,
      progress: 96.75
    },
    jobs: {
      current: 254,
      previous: 238,
      change: 6.7,
      target: 260,
      progress: 97.69
    },
    clients: {
      current: 135,
      previous: 128,
      change: 5.5,
      target: 140,
      progress: 96.43
    },
    efficiency: {
      current: 93,
      previous: 89,
      change: 4.5,
      target: 95,
      progress: 97.89
    }
  };

  return (
    <WorkpaperLayout currentPage="analytics" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-slate-100">Analytics</h1>
            <p className="text-sm text-slate-300 mt-1">Track performance and insights across your firm</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="12m">Last 12 months</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <DollarSign className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-xs text-slate-300">Revenue</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <ArrowUp className="w-3 h-3" />
                  <span>{kpiData.revenue.change}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-100">${(kpiData.revenue.current / 1000).toFixed(0)}K</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Target: ${(kpiData.revenue.target / 1000).toFixed(0)}K</span>
                  <span>{kpiData.revenue.progress.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500"
                    style={{ width: `${kpiData.revenue.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-xs text-slate-300">Jobs</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <ArrowUp className="w-3 h-3" />
                  <span>{kpiData.jobs.change}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-100">{kpiData.jobs.current}</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Target: {kpiData.jobs.target}</span>
                  <span>{kpiData.jobs.progress.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500"
                    style={{ width: `${kpiData.jobs.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-xs text-slate-300">Clients</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <ArrowUp className="w-3 h-3" />
                  <span>{kpiData.clients.change}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-100">{kpiData.clients.current}</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Target: {kpiData.clients.target}</span>
                  <span>{kpiData.clients.progress.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500"
                    style={{ width: `${kpiData.clients.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Target className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-xs text-slate-300">Efficiency</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <ArrowUp className="w-3 h-3" />
                  <span>{kpiData.efficiency.change}%</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-100">{kpiData.efficiency.current}%</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Target: {kpiData.efficiency.target}%</span>
                  <span>{kpiData.efficiency.progress.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500"
                    style={{ width: `${kpiData.efficiency.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-12 gap-6">
          {/* Revenue Trend */}
          <Card className="col-span-8 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-slate-100">Revenue Trend</h3>
                  <p className="text-sm text-slate-300 mt-1">Monthly revenue vs target</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-[#2855a6] rounded-full" />
                    <span className="text-slate-300">Actual</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-gray-300 rounded-full" />
                    <span className="text-slate-300">Target</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2855a6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2855a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2855a6" 
                    strokeWidth={2}
                    fill="url(#colorRevenue)" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#d1d5db" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Client Distribution */}
          <Card className="col-span-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="font-semibold text-slate-100">Client Distribution</h3>
                <p className="text-sm text-slate-300 mt-1">By entity type</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <RePieChart>
                  <Pie
                    data={clientsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {clientsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {clientsByType.map((type, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                      <span className="text-slate-300">{type.name}</span>
                    </div>
                    <span className="font-semibold text-slate-100">{type.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-12 gap-6">
          {/* Jobs Completed */}
          <Card className="col-span-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-slate-100">Jobs Overview</h3>
                  <p className="text-sm text-slate-300 mt-1">Completed vs pending jobs</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={jobsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Service Revenue */}
          <Card className="col-span-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-slate-100">Revenue by Service</h3>
                  <p className="text-sm text-slate-300 mt-1">Top performing services</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={serviceRevenue} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis dataKey="service" type="category" stroke="#9ca3af" style={{ fontSize: '12px' }} width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#2855a6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Staff Productivity Table */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-slate-100">Staff Productivity</h3>
                <p className="text-sm text-slate-300 mt-1">Performance metrics by team member</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Staff Member</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Jobs Completed</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Hours Logged</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Efficiency</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {staffProductivity.map((staff, idx) => (
                    <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium text-slate-100">{staff.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-slate-100">{staff.jobs}</td>
                      <td className="py-4 px-4 text-right text-slate-300">{staff.hours}h</td>
                      <td className="py-4 px-4 text-right">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          staff.efficiency >= 95 ? 'bg-green-500/10 text-green-300' :
                          staff.efficiency >= 90 ? 'bg-blue-500/10 text-blue-300' :
                          'bg-orange-500/10 text-orange-300'
                        }`}>
                          {staff.efficiency}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#2855a6]"
                              style={{ width: `${staff.efficiency}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkpaperLayout>
  );
}

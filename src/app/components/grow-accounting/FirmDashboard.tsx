import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Briefcase,
  Target,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

const kpiData = [
  {
    label: 'Work in Progress',
    value: '$342,580',
    change: 12.5,
    trend: 'up' as const,
    icon: Briefcase,
    color: 'blue'
  },
  {
    label: 'Jobs Overdue',
    value: '8',
    change: -25,
    trend: 'down' as const,
    icon: AlertTriangle,
    color: 'red'
  },
  {
    label: 'AI Accuracy',
    value: '94.2%',
    change: 3.1,
    trend: 'up' as const,
    icon: Zap,
    color: 'green'
  },
  {
    label: 'Avg. Completion Time',
    value: '4.2 days',
    change: -15.3,
    trend: 'down' as const,
    icon: Clock,
    color: 'purple'
  }
];

const jobsByStatus = [
  { status: 'To Do', count: 24, color: 'bg-gray-400' },
  { status: 'Awaiting Client', count: 18, color: 'bg-yellow-500' },
  { status: 'In Progress', count: 32, color: 'bg-blue-500' },
  { status: 'In Review', count: 15, color: 'bg-purple-500' },
  { status: 'Ready to Lodge', count: 12, color: 'bg-green-500' },
  { status: 'Complete', count: 156, color: 'bg-gray-300' }
];

const overdueJobs = [
  { id: 'JOB-2024-042', client: 'ABC Pty Ltd', entity: 'Company', year: 'FY2024', daysOverdue: 12, assignedTo: 'John Smith' },
  { id: 'JOB-2024-038', client: 'XYZ Trust', entity: 'Trust', year: 'FY2024', daysOverdue: 8, assignedTo: 'Sarah Johnson' },
  { id: 'JOB-2024-045', client: 'DEF Partnership', entity: 'Partnership', year: 'FY2024', daysOverdue: 5, assignedTo: 'Mike Brown' },
];

const staffWorkload = [
  { name: 'John Smith', utilisation: 92, jobs: 12, overServicing: false },
  { name: 'Sarah Johnson', utilisation: 78, jobs: 9, overServicing: false },
  { name: 'Mike Brown', utilisation: 105, jobs: 15, overServicing: true },
  { name: 'Emily Davis', utilisation: 65, jobs: 7, overServicing: false },
  { name: 'Tom Wilson', utilisation: 88, jobs: 11, overServicing: false },
];

const recentActivity = [
  { action: 'Job completed', detail: 'ABC Pty Ltd FY2024 - John Smith', time: '5 mins ago', icon: CheckCircle, color: 'text-green-600' },
  { action: 'Review requested', detail: 'XYZ Trust FY2024 - Sarah Johnson', time: '23 mins ago', icon: Clock, color: 'text-blue-600' },
  { action: 'Client uploaded', detail: '5 documents for DEF Partnership', time: '1 hour ago', icon: TrendingUp, color: 'text-purple-600' },
  { action: 'AI flag raised', detail: 'Variance detected in LMN Company', time: '2 hours ago', icon: AlertTriangle, color: 'text-orange-600' },
];

export function FirmDashboard({ onNavigate }: DashboardProps) {
  const totalJobs = jobsByStatus.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...jobsByStatus.map(item => item.count));

  return (
    <WorkpaperLayout currentPage="dashboard" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Grow Platform Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <Zap className="w-6 h-6" />
                Grow Workpapers Platform
              </h1>
              <p className="text-sm text-blue-100">
                AI-powered workpaper automation • Ledger-connected • Audit-ready
              </p>
            </div>
            <Button 
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => onNavigate?.('apex-dashboard')}
            >
              <Target className="w-4 h-4 mr-2" />
              Open Grow Dashboard
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            const colorMap = {
              blue: 'bg-blue-50 text-blue-600',
              red: 'bg-red-50 text-red-600',
              green: 'bg-green-50 text-green-600',
              purple: 'bg-purple-50 text-purple-600'
            };
            return (
              <Card key={kpi.label} className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${colorMap[kpi.color]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {Math.abs(kpi.change)}%
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{kpi.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Jobs Pipeline & Staff Workload */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jobs Pipeline */}
          <Card className="lg:col-span-2 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Jobs Pipeline</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => onNavigate?.('jobs')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {jobsByStatus.map((item) => (
                  <div key={item.status}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.status}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{item.count}</span>
                        <span className="text-xs text-gray-500">({((item.count / totalJobs) * 100).toFixed(0)}%)</span>
                      </div>
                    </div>
                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full ${item.color} rounded-full transition-all`}
                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">Total Active Jobs</span>
                  <span className="text-2xl font-bold text-gray-900">{totalJobs}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WIP Summary */}
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-lg">WIP Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Current WIP</p>
                  <p className="text-2xl font-bold text-gray-900">$342,580</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12.5% vs last month
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Avg. Days in WIP</p>
                  <p className="text-2xl font-bold text-gray-900">12.4</p>
                  <p className="text-xs text-gray-500 mt-1">Target: 10 days</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Ready to Bill</p>
                  <p className="text-2xl font-bold text-gray-900">$89,420</p>
                  <p className="text-xs text-gray-500 mt-1">12 jobs completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overdue Alerts & Staff Workload */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overdue Jobs */}
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-lg">Overdue Jobs</CardTitle>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                  {overdueJobs.length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {overdueJobs.map((job) => (
                  <div key={job.id} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-mono font-medium text-gray-900">{job.id}</span>
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                            {job.daysOverdue}d overdue
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900">{job.client}</p>
                        <p className="text-xs text-gray-600 mt-1">{job.entity} • {job.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-red-100">
                      <span className="text-xs text-gray-600">Assigned to: {job.assignedTo}</span>
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        View Job
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Staff Workload */}
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Staff Workload</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => onNavigate?.('analytics')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {staffWorkload.map((staff) => (
                  <div key={staff.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-700">
                            {staff.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                          <p className="text-xs text-gray-500">{staff.jobs} active jobs</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${
                          staff.utilisation > 100 
                            ? 'text-red-600' 
                            : staff.utilisation > 85 
                            ? 'text-orange-600' 
                            : 'text-green-600'
                        }`}>
                          {staff.utilisation}%
                        </span>
                        {staff.overServicing && (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          staff.utilisation > 100 
                            ? 'bg-red-500' 
                            : staff.utilisation > 85 
                            ? 'bg-orange-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(staff.utilisation, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg bg-gray-50`}>
                      <Icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkpaperLayout>
  );
}
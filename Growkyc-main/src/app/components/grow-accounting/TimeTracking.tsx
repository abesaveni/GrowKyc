import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Clock,
  Play,
  Pause,
  Square,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  Filter,
  Search,
  Edit,
  Trash2,
  Timer,
  User,
  Briefcase
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface TimeTrackingProps {
  onNavigate?: (page: string) => void;
}

interface TimeEntry {
  id: string;
  client: string;
  job: string;
  description: string;
  date: string;
  duration: number; // minutes
  billable: boolean;
  rate: number;
  staff: string;
  status: 'draft' | 'submitted' | 'approved' | 'invoiced';
}

export function TimeTracking({ onNavigate }: TimeTrackingProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTimer, setCurrentTimer] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const timeEntries: TimeEntry[] = [
    { id: 'T001', client: 'Smith SMSF', job: 'Q4 2024 BAS', description: 'Bank reconciliation', date: '2024-02-14', duration: 120, billable: true, rate: 180, staff: 'Sarah Johnson', status: 'draft' },
    { id: 'T002', client: 'ABC Pty Ltd', job: 'EOFY 2024', description: 'Fixed asset register', date: '2024-02-14', duration: 90, billable: true, rate: 180, staff: 'Sarah Johnson', status: 'draft' },
    { id: 'T003', client: 'XYZ Trust', job: 'Tax Planning', description: 'Client meeting - tax strategy', date: '2024-02-13', duration: 60, billable: true, rate: 250, staff: 'Mike Brown', status: 'submitted' },
    { id: 'T004', client: 'Wilson SMSF', job: 'Annual Compliance', description: 'Investment review', date: '2024-02-13', duration: 45, billable: true, rate: 180, staff: 'Emily Davis', status: 'approved' },
    { id: 'T005', client: 'Brown Individual', job: 'Tax Return 2024', description: 'Data entry and coding', date: '2024-02-12', duration: 75, billable: true, rate: 150, staff: 'Tom Wilson', status: 'approved' },
    { id: 'T006', client: 'Internal', job: 'Admin', description: 'Team meeting', date: '2024-02-12', duration: 30, billable: false, rate: 0, staff: 'Sarah Johnson', status: 'approved' },
    { id: 'T007', client: 'Johnson & Co', job: 'Monthly Books', description: 'Categorize transactions', date: '2024-02-11', duration: 180, billable: true, rate: 150, staff: 'Tom Wilson', status: 'invoiced' },
    { id: 'T008', client: 'Green Family Trust', job: 'BAS Q3 2024', description: 'GST review and lodgement', date: '2024-02-11', duration: 105, billable: true, rate: 180, staff: 'Emily Davis', status: 'invoiced' }
  ];

  const stats = {
    weekHours: 52.5,
    billableHours: 47.0,
    revenue: 8460,
    utilizationRate: 89.5
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-white/5 text-slate-300 border-white/10',
      submitted: 'bg-blue-500/10 text-blue-300 border-blue-300',
      approved: 'bg-green-500/10 text-green-300 border-green-300',
      invoiced: 'bg-purple-500/10 text-purple-300 border-purple-300'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <WorkpaperLayout currentPage="time-tracking" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-slate-100">Time Tracking</h1>
            <p className="text-sm text-slate-300 mt-1">Track billable hours and manage timesheets</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </div>

        {/* Timer Widget */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)] border-2 border-[#2855a6]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-[#2855a6] rounded-lg">
                  <Timer className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 mb-1">Active Timer</h3>
                  <p className="text-3xl font-bold text-[#2855a6]">
                    {isTimerRunning ? '2:34:15' : '0:00:00'}
                  </p>
                </div>
              </div>

              <div className="flex-1 mx-8 space-y-3">
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Client</label>
                  <select className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]">
                    <option value="">Select client...</option>
                    <option>Smith SMSF</option>
                    <option>ABC Pty Ltd</option>
                    <option>XYZ Trust</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Description</label>
                  <input
                    type="text"
                    placeholder="What are you working on?"
                    className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isTimerRunning ? (
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setIsTimerRunning(true)}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setIsTimerRunning(false)}
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                    <Button
                      size="lg"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => setIsTimerRunning(false)}
                    >
                      <Square className="w-5 h-5 mr-2" />
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Total Hours</p>
                  <p className="text-2xl font-bold text-slate-100">{stats.weekHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Billable</p>
                  <p className="text-2xl font-bold text-slate-100">{stats.billableHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Revenue</p>
                  <p className="text-2xl font-bold text-slate-100">${stats.revenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Utilization</p>
                  <p className="text-2xl font-bold text-slate-100">{stats.utilizationRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time Entries Table */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-100">Time Entries</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search entries..."
                    className="pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Job</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Staff</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Duration</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Rate</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-300">Value</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-300">Status</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timeEntries.map((entry) => (
                    <tr key={entry.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-4 px-4 text-sm text-slate-100">{entry.date}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-slate-100">{entry.client}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-slate-300">{entry.job}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-300 max-w-xs truncate">{entry.description}</td>
                      <td className="py-4 px-4 text-sm text-slate-300">{entry.staff}</td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-sm font-semibold text-slate-100">{formatTime(entry.duration)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-sm text-slate-300">
                        {entry.billable ? `$${entry.rate}/hr` : '-'}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-semibold text-slate-100">
                          {entry.billable ? `$${((entry.duration / 60) * entry.rate).toFixed(0)}` : '-'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">{getStatusBadge(entry.status)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4 text-slate-300" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
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

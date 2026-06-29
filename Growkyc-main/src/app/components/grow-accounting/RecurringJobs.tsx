import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface RecurringJobsProps {
  onNavigate?: (page: string) => void;
}

interface RecurringJob {
  id: string;
  name: string;
  client: string;
  template: string;
  frequency: 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  nextDue: string;
  lastCreated: string;
  assignee: string;
  active: boolean;
  jobsCreated: number;
}

export function RecurringJobs({ onNavigate }: RecurringJobsProps) {
  const [selectedJob, setSelectedJob] = useState<RecurringJob | null>(null);

  const recurringJobs: RecurringJob[] = [
    { id: 'RJ001', name: 'Monthly Bookkeeping', client: 'Smith SMSF', template: 'Monthly Books', frequency: 'Monthly', nextDue: '2024-03-01', lastCreated: '2024-02-01', assignee: 'Sarah Johnson', active: true, jobsCreated: 18 },
    { id: 'RJ002', name: 'Quarterly BAS', client: 'ABC Pty Ltd', template: 'BAS Preparation', frequency: 'Quarterly', nextDue: '2024-04-21', lastCreated: '2024-01-21', assignee: 'Mike Brown', active: true, jobsCreated: 12 },
    { id: 'RJ003', name: 'Monthly Payroll', client: 'XYZ Trust', template: 'Payroll Processing', frequency: 'Monthly', nextDue: '2024-03-15', lastCreated: '2024-02-15', assignee: 'Emily Davis', active: true, jobsCreated: 24 },
    { id: 'RJ004', name: 'Annual Tax Return', client: 'Wilson SMSF', template: 'SMSF Annual Return', frequency: 'Annually', nextDue: '2024-10-31', lastCreated: '2023-10-31', assignee: 'Tom Wilson', active: true, jobsCreated: 3 },
    { id: 'RJ005', name: 'Weekly Payroll', client: 'Brown Individual', template: 'Weekly Payroll', frequency: 'Weekly', nextDue: '2024-02-21', lastCreated: '2024-02-14', assignee: 'Sarah Johnson', active: true, jobsCreated: 156 },
    { id: 'RJ006', name: 'Quarterly Management Reports', client: 'Johnson & Co', template: 'Management Reporting', frequency: 'Quarterly', nextDue: '2024-03-31', lastCreated: '2023-12-31', assignee: 'Mike Brown', active: true, jobsCreated: 8 },
    { id: 'RJ007', name: 'Monthly BAS', client: 'Green Family Trust', template: 'BAS Preparation', frequency: 'Monthly', nextDue: '2024-03-21', lastCreated: '2024-02-21', assignee: 'Emily Davis', active: true, jobsCreated: 36 },
    { id: 'RJ008', name: 'Annual Company Tax Return', client: 'Anderson Pty Ltd', template: 'Company Tax Return', frequency: 'Annually', nextDue: '2024-12-15', lastCreated: '2023-12-15', assignee: 'Tom Wilson', active: false, jobsCreated: 5 }
  ];

  const stats = {
    totalRecurring: recurringJobs.length,
    active: recurringJobs.filter(j => j.active).length,
    dueSoon: recurringJobs.filter(j => {
      const days = Math.floor((new Date(j.nextDue).getTime() - new Date('2024-02-14').getTime()) / (1000 * 60 * 60 * 24));
      return days <= 7 && days >= 0;
    }).length,
    totalCreated: recurringJobs.reduce((sum, j) => sum + j.jobsCreated, 0)
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Weekly': return 'bg-blue-500/10 text-blue-300';
      case 'Monthly': return 'bg-green-500/10 text-green-300';
      case 'Quarterly': return 'bg-purple-500/10 text-purple-300';
      case 'Annually': return 'bg-orange-500/10 text-orange-300';
      default: return 'bg-white/5 text-slate-300';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const days = Math.floor((new Date(dueDate).getTime() - new Date('2024-02-14').getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <WorkpaperLayout currentPage="recurring-jobs" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-slate-100">Recurring Jobs</h1>
            <p className="text-sm text-slate-300 mt-1">Automate job creation for recurring work</p>
          </div>
          <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
            <Plus className="w-4 h-4 mr-2" />
            New Recurring Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Total Recurring</p>
                  <p className="text-2xl font-bold text-slate-100">{stats.totalRecurring}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Active</p>
                  <p className="text-2xl font-bold text-slate-100">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Due This Week</p>
                  <p className="text-2xl font-bold text-slate-100">{stats.dueSoon}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Jobs Created</p>
                  <p className="text-2xl font-bold text-slate-100">{stats.totalCreated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recurring Jobs List */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Job Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Template</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Frequency</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Next Due</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Assignee</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-300">Jobs Created</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recurringJobs.map((job) => {
                    const daysUntil = getDaysUntilDue(job.nextDue);
                    const isDueSoon = daysUntil <= 7 && daysUntil >= 0;

                    return (
                      <tr
                        key={job.id}
                        className="border-b border-white/10 hover:bg-white/5 cursor-pointer"
                        onClick={() => setSelectedJob(job)}
                      >
                        <td className="py-4 px-4">
                          {job.active ? (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              <span className="text-sm text-green-300 font-medium">Active</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full" />
                              <span className="text-sm text-slate-300 font-medium">Paused</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-slate-100">{job.name}</span>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-300">{job.client}</td>
                        <td className="py-4 px-4 text-sm text-slate-300">{job.template}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${getFrequencyColor(job.frequency)}`}>
                            {job.frequency}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className={`text-sm font-medium ${isDueSoon ? 'text-orange-300' : 'text-slate-100'}`}>
                                {job.nextDue}
                              </p>
                              <p className="text-xs text-slate-400">
                                {daysUntil > 0 ? `in ${daysUntil} days` : daysUntil === 0 ? 'today' : `${Math.abs(daysUntil)} days ago`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-slate-300">{job.assignee}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-sm font-semibold text-slate-100">{job.jobsCreated}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              {job.active ? <Pause className="w-4 h-4 text-orange-400" /> : <Play className="w-4 h-4 text-green-400" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Edit className="w-4 h-4 text-slate-300" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/15 rounded-lg">
                <RefreshCw className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 mb-2">How Recurring Jobs Work</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span><strong>Automated Creation:</strong> Jobs are automatically created based on the frequency you set</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span><strong>Template-Based:</strong> Each recurring job uses a workpaper template for consistency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span><strong>Smart Scheduling:</strong> Jobs are created with appropriate due dates based on frequency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    <span><strong>Assignee Assignment:</strong> Each new job is automatically assigned to the designated staff member</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">{selectedJob.name}</h2>
                  <p className="text-sm text-slate-300 mt-1">{selectedJob.client}</p>
                </div>
                <button onClick={() => setSelectedJob(null)}>
                  <Plus className="w-6 h-6 text-slate-300 rotate-45" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Template</label>
                  <p className="font-medium text-slate-100">{selectedJob.template}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Frequency</label>
                  <span className={`px-2 py-1 text-sm font-semibold rounded ${getFrequencyColor(selectedJob.frequency)}`}>
                    {selectedJob.frequency}
                  </span>
                </div>
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Next Due</label>
                  <p className="font-medium text-slate-100">{selectedJob.nextDue}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Last Created</label>
                  <p className="font-medium text-slate-100">{selectedJob.lastCreated}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Assignee</label>
                  <p className="font-medium text-slate-100">{selectedJob.assignee}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-300 mb-1 block">Jobs Created</label>
                  <p className="font-medium text-slate-100">{selectedJob.jobsCreated} jobs</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button className="flex-1 bg-[#2855a6] hover:bg-[#1e4089]">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Settings
                </Button>
                <Button variant="outline" className="flex-1">
                  {selectedJob.active ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {selectedJob.active ? 'Pause' : 'Resume'}
                </Button>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Create Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </WorkpaperLayout>
  );
}

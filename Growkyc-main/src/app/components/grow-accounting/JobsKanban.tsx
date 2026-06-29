import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Briefcase,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Calendar,
  Filter,
  Plus,
  Search,
  MoreVertical,
  FileText,
  Target
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface Job {
  id: string;
  clientName: string;
  entity: string;
  entityType: 'Individual' | 'Company' | 'Trust' | 'Partnership' | 'SMSF';
  year: string;
  status: 'todo' | 'awaiting_client' | 'in_progress' | 'in_review' | 'ready_to_lodge' | 'complete';
  assignedStaff: string[];
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  checklistComplete: number;
  checklistTotal: number;
  aiAccuracy?: number;
  daysUntilDue: number;
}

interface JobsKanbanProps {
  onNavigate?: (page: string, jobId?: string) => void;
}

const mockJobs: Job[] = [
  {
    id: 'JOB-2024-001',
    clientName: 'ABC Pty Ltd',
    entity: 'Company',
    entityType: 'Company',
    year: 'FY2024',
    status: 'todo',
    assignedStaff: ['John Smith'],
    dueDate: '2024-03-15',
    priority: 'high',
    progress: 0,
    checklistComplete: 0,
    checklistTotal: 12,
    aiAccuracy: 94,
    daysUntilDue: 8
  },
  {
    id: 'JOB-2024-002',
    clientName: 'XYZ Trust',
    entity: 'XYZ Family Trust',
    entityType: 'Trust',
    year: 'FY2024',
    status: 'awaiting_client',
    assignedStaff: ['Sarah Johnson'],
    dueDate: '2024-03-20',
    priority: 'medium',
    progress: 35,
    checklistComplete: 4,
    checklistTotal: 10,
    aiAccuracy: 92,
    daysUntilDue: 13
  },
  {
    id: 'JOB-2024-003',
    clientName: 'Smith SMSF',
    entity: 'Smith Super Fund',
    entityType: 'SMSF',
    year: 'FY2024',
    status: 'in_progress',
    assignedStaff: ['Mike Brown', 'Emily Davis'],
    dueDate: '2024-03-18',
    priority: 'high',
    progress: 68,
    checklistComplete: 8,
    checklistTotal: 15,
    aiAccuracy: 96,
    daysUntilDue: 11
  },
  {
    id: 'JOB-2024-004',
    clientName: 'Johnson & Partners',
    entity: 'Partnership',
    entityType: 'Partnership',
    year: 'FY2024',
    status: 'in_review',
    assignedStaff: ['Tom Wilson'],
    dueDate: '2024-03-25',
    priority: 'medium',
    progress: 85,
    checklistComplete: 10,
    checklistTotal: 11,
    aiAccuracy: 95,
    daysUntilDue: 18
  },
  {
    id: 'JOB-2024-005',
    clientName: 'Brown Individual',
    entity: 'Michael Brown',
    entityType: 'Individual',
    year: 'FY2024',
    status: 'ready_to_lodge',
    assignedStaff: ['Sarah Johnson'],
    dueDate: '2024-03-22',
    priority: 'low',
    progress: 100,
    checklistComplete: 8,
    checklistTotal: 8,
    aiAccuracy: 98,
    daysUntilDue: 15
  },
  {
    id: 'JOB-2024-006',
    clientName: 'DEF Company',
    entity: 'DEF Enterprises Pty Ltd',
    entityType: 'Company',
    year: 'FY2024',
    status: 'complete',
    assignedStaff: ['John Smith'],
    dueDate: '2024-03-10',
    priority: 'medium',
    progress: 100,
    checklistComplete: 14,
    checklistTotal: 14,
    aiAccuracy: 93,
    daysUntilDue: 3
  },
  // Add more for visual variety
  {
    id: 'JOB-2024-007',
    clientName: 'GHI Trust',
    entity: 'GHI Investment Trust',
    entityType: 'Trust',
    year: 'FY2024',
    status: 'todo',
    assignedStaff: ['Emily Davis'],
    dueDate: '2024-04-01',
    priority: 'low',
    progress: 0,
    checklistComplete: 0,
    checklistTotal: 9,
    daysUntilDue: 25
  },
  {
    id: 'JOB-2024-008',
    clientName: 'Wilson SMSF',
    entity: 'Wilson Retirement Fund',
    entityType: 'SMSF',
    year: 'FY2024',
    status: 'awaiting_client',
    assignedStaff: ['Mike Brown'],
    dueDate: '2024-03-28',
    priority: 'high',
    progress: 45,
    checklistComplete: 6,
    checklistTotal: 13,
    aiAccuracy: 91,
    daysUntilDue: 21
  }
];

const columns = [
  { id: 'todo', label: 'To Do', color: 'bg-gray-500' },
  { id: 'awaiting_client', label: 'Awaiting Client', color: 'bg-yellow-500' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { id: 'in_review', label: 'In Review', color: 'bg-purple-500' },
  { id: 'ready_to_lodge', label: 'Ready to Lodge', color: 'bg-green-500' },
  { id: 'complete', label: 'Complete', color: 'bg-gray-400' }
];

export function JobsKanban({ onNavigate }: JobsKanbanProps) {
  const [jobs, setJobs] = useState(mockJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEntity = filterEntity === 'all' || job.entityType === filterEntity;
    const matchesPriority = filterPriority === 'all' || job.priority === filterPriority;
    return matchesSearch && matchesEntity && matchesPriority;
  });

  const getJobsByStatus = (status: string) => {
    return filteredJobs.filter(job => job.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-l-red-500';
      case 'medium': return 'border-l-4 border-l-orange-500';
      case 'low': return 'border-l-4 border-l-green-500';
      default: return '';
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'Company': return '🏢';
      case 'Trust': return '🤝';
      case 'Partnership': return '👥';
      case 'SMSF': return '💼';
      case 'Individual': return '👤';
      default: return '📄';
    }
  };

  return (
    <WorkpaperLayout currentPage="jobs" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-slate-100">Jobs</h1>
            <p className="text-sm text-slate-300 mt-1">Manage workpapers across all stages</p>
          </div>
          <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
            <Plus className="w-4 h-4 mr-2" />
            New Job
          </Button>
        </div>

        {/* Filters */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search jobs, clients, entities..."
                    className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                  />
                </div>
              </div>

              {/* Entity Filter */}
              <select
                value={filterEntity}
                onChange={(e) => setFilterEntity(e.target.value)}
                className="px-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
              >
                <option value="all">All Entities</option>
                <option value="Company">Company</option>
                <option value="Trust">Trust</option>
                <option value="Partnership">Partnership</option>
                <option value="SMSF">SMSF</option>
                <option value="Individual">Individual</option>
              </select>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => {
            const columnJobs = getJobsByStatus(column.id);
            return (
              <div key={column.id} className="flex-shrink-0 w-[320px]">
                {/* Column Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${column.color}`} />
                      <h3 className="font-semibold text-slate-100">{column.label}</h3>
                    </div>
                    <span className="px-2 py-1 bg-white/5 text-slate-300 text-xs font-semibold rounded">
                      {columnJobs.length}
                    </span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${column.color}`} style={{ width: '100%' }} />
                  </div>
                </div>

                {/* Job Cards */}
                <div className="space-y-3">
                  {columnJobs.map((job) => (
                    <Card
                      key={job.id}
                      className={`cursor-pointer hover:shadow-lg transition-all ${getPriorityColor(job.priority)}`}
                      onClick={() => onNavigate?.('job-detail', job.id)}
                    >
                      <CardContent className="p-4">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getEntityIcon(job.entityType)}</span>
                            <div>
                              <p className="font-semibold text-sm text-slate-100">{job.clientName}</p>
                              <p className="text-xs text-slate-400">{job.entity}</p>
                            </div>
                          </div>
                          <button className="p-1 hover:bg-white/5 rounded">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>

                        {/* Job Details */}
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300">Job ID</span>
                            <span className="font-mono font-medium text-slate-100">{job.id}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300">Year</span>
                            <span className="font-medium text-slate-100">{job.year}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-300">Progress</span>
                            <span className="font-semibold text-slate-100">{job.progress}%</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2855a6] transition-all"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Checklist */}
                        <div className="flex items-center gap-2 text-xs text-slate-300 mb-3">
                          <CheckCircle className="w-4 h-4" />
                          <span>
                            {job.checklistComplete}/{job.checklistTotal} checklist items
                          </span>
                        </div>

                        {/* AI Accuracy (if available) */}
                        {job.aiAccuracy && (
                          <div className="flex items-center gap-2 text-xs mb-3">
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 rounded">
                              <Target className="w-3 h-3 text-green-400" />
                              <span className="text-green-300 font-semibold">{job.aiAccuracy}% AI</span>
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            {job.assignedStaff.map((staff, idx) => (
                              <div
                                key={idx}
                                className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs font-semibold text-slate-300"
                                title={staff}
                              >
                                {staff.split(' ').map(n => n[0]).join('')}
                              </div>
                            ))}
                          </div>
                          <div className={`flex items-center gap-1 text-xs ${
                            job.daysUntilDue <= 7 ? 'text-red-400' : 'text-slate-300'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            <span>{job.daysUntilDue}d</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {columnJobs.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-sm border-2 border-dashed border-white/10 rounded-lg">
                      No jobs in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-300 mb-1">Total Jobs</p>
                <p className="text-2xl font-bold text-slate-100">{filteredJobs.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-300 mb-1">Overdue</p>
                <p className="text-2xl font-bold text-red-400">
                  {filteredJobs.filter(j => j.daysUntilDue < 0).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-300 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-blue-400">
                  {filteredJobs.filter(j => j.status === 'in_progress').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-300 mb-1">Ready to Lodge</p>
                <p className="text-2xl font-bold text-green-400">
                  {filteredJobs.filter(j => j.status === 'ready_to_lodge').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkpaperLayout>
  );
}
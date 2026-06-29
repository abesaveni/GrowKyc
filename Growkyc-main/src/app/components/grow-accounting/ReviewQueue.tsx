import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Filter,
  Search,
  AlertCircle,
  Clock,
  TrendingUp,
  User,
  Calendar,
  ChevronRight,
  FileText,
  Flag,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface ReviewQueueProps {
  onNavigate?: (page: string, jobId?: string) => void;
}

interface ReviewItem {
  id: string;
  clientName: string;
  entityType: string;
  year: string;
  submittedBy: string;
  submittedDate: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  flagsCount: number;
  sectionsReady: number;
  sectionsTotal: number;
  completeness: number;
  status: 'pending' | 'in-review' | 'changes-requested';
  daysInQueue: number;
}

export function ReviewQueue({ onNavigate }: ReviewQueueProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-review' | 'changes-requested'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'flags' | 'age'>('date');

  const reviewItems: ReviewItem[] = [
    {
      id: 'JOB-2024-045',
      clientName: 'Smith, John & Mary',
      entityType: 'Individual',
      year: 'FY2024',
      submittedBy: 'Mike Brown',
      submittedDate: '2024-02-14',
      dueDate: '2024-02-21',
      priority: 'high',
      flagsCount: 8,
      sectionsReady: 12,
      sectionsTotal: 15,
      completeness: 95,
      status: 'pending',
      daysInQueue: 1
    },
    {
      id: 'JOB-2024-038',
      clientName: 'ABC Pty Ltd',
      entityType: 'Company',
      year: 'FY2024',
      submittedBy: 'Sarah Johnson',
      submittedDate: '2024-02-13',
      dueDate: '2024-02-28',
      priority: 'high',
      flagsCount: 12,
      sectionsReady: 18,
      sectionsTotal: 20,
      completeness: 92,
      status: 'in-review',
      daysInQueue: 2
    },
    {
      id: 'JOB-2024-041',
      clientName: 'Johnson Family Trust',
      entityType: 'Trust',
      year: 'FY2024',
      submittedBy: 'Mike Brown',
      submittedDate: '2024-02-12',
      dueDate: '2024-03-05',
      priority: 'medium',
      flagsCount: 5,
      sectionsReady: 14,
      sectionsTotal: 16,
      completeness: 88,
      status: 'pending',
      daysInQueue: 3
    },
    {
      id: 'JOB-2024-029',
      clientName: 'Brown Super Fund',
      entityType: 'SMSF',
      year: 'FY2024',
      submittedBy: 'Emily Davis',
      submittedDate: '2024-02-10',
      dueDate: '2024-02-25',
      priority: 'high',
      flagsCount: 15,
      sectionsReady: 20,
      sectionsTotal: 22,
      completeness: 90,
      status: 'changes-requested',
      daysInQueue: 5
    },
    {
      id: 'JOB-2024-033',
      clientName: 'Wilson Enterprises Pty Ltd',
      entityType: 'Company',
      year: 'FY2024',
      submittedBy: 'Sarah Johnson',
      submittedDate: '2024-02-09',
      dueDate: '2024-03-10',
      priority: 'medium',
      flagsCount: 3,
      sectionsReady: 19,
      sectionsTotal: 20,
      completeness: 96,
      status: 'pending',
      daysInQueue: 6
    },
    {
      id: 'JOB-2024-027',
      clientName: 'Davis, Robert',
      entityType: 'Individual',
      year: 'FY2024',
      submittedBy: 'Mike Brown',
      submittedDate: '2024-02-08',
      dueDate: '2024-03-15',
      priority: 'low',
      flagsCount: 2,
      sectionsReady: 13,
      sectionsTotal: 14,
      completeness: 94,
      status: 'in-review',
      daysInQueue: 7
    }
  ];

  // Filter and sort
  let filteredItems = reviewItems;

  if (filterStatus !== 'all') {
    filteredItems = filteredItems.filter(item => item.status === filterStatus);
  }

  if (filterPriority !== 'all') {
    filteredItems = filteredItems.filter(item => item.priority === filterPriority);
  }

  if (searchQuery) {
    filteredItems = filteredItems.filter(item => 
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort
  filteredItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'flags':
        return b.flagsCount - a.flagsCount;
      case 'age':
        return b.daysInQueue - a.daysInQueue;
      case 'date':
      default:
        return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/15 text-red-300 border-red-300';
      case 'medium': return 'bg-orange-500/15 text-orange-300 border-orange-300';
      case 'low': return 'bg-white/5 text-slate-300 border-white/10';
      default: return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500/15 text-blue-300';
      case 'in-review': return 'bg-purple-500/15 text-purple-300';
      case 'changes-requested': return 'bg-orange-500/15 text-orange-300';
      default: return 'bg-white/5 text-slate-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'in-review': return 'In Review';
      case 'changes-requested': return 'Changes Requested';
      default: return status;
    }
  };

  return (
    <WorkpaperLayout currentPage="reviews" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-semibold text-slate-100">Review Queue</h1>
          <p className="text-sm text-slate-300 mt-1">Jobs ready for review with AI flags and prior year variances</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">Pending</p>
                  <p className="text-2xl font-bold text-slate-100 mt-1">
                    {reviewItems.filter(i => i.status === 'pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/15 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">In Review</p>
                  <p className="text-2xl font-bold text-slate-100 mt-1">
                    {reviewItems.filter(i => i.status === 'in-review').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/15 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">High Priority</p>
                  <p className="text-2xl font-bold text-slate-100 mt-1">
                    {reviewItems.filter(i => i.priority === 'high').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500/15 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 uppercase tracking-wider">Total Flags</p>
                  <p className="text-2xl font-bold text-slate-100 mt-1">
                    {reviewItems.reduce((sum, item) => sum + item.flagsCount, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/15 rounded-lg flex items-center justify-center">
                  <Flag className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[240px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by client name or job ID..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-300">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 text-sm border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="in-review">In Review</option>
                  <option value="changes-requested">Changes Requested</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-300">Priority:</span>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="px-3 py-2 text-sm border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-300">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 text-sm border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Submission Date</option>
                  <option value="priority">Priority</option>
                  <option value="flags">Flags Count</option>
                  <option value="age">Days in Queue</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Items List */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Priority Badge */}
                  <div className={`px-3 py-1 text-xs font-semibold rounded border ${getPriorityColor(item.priority)} uppercase`}>
                    {item.priority}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-slate-100">{item.clientName}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(item.status)}`}>
                            {getStatusLabel(item.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-300">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {item.id}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {item.entityType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {item.year}
                          </span>
                        </div>
                      </div>

                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => onNavigate?.('review-mode', item.id)}
                      >
                        Open in Review Mode
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-5 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-slate-300 mb-1">Submitted By</p>
                        <p className="text-sm font-semibold text-slate-100">{item.submittedBy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-300 mb-1">Submitted</p>
                        <p className="text-sm font-semibold text-slate-100">
                          {new Date(item.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-300 mb-1">Due Date</p>
                        <p className="text-sm font-semibold text-slate-100">
                          {new Date(item.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-300 mb-1">Days in Queue</p>
                        <p className="text-sm font-semibold text-orange-400">{item.daysInQueue} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-300 mb-1">AI Flags</p>
                        <p className="text-sm font-semibold text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {item.flagsCount} flags
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">
                          Sections Ready: {item.sectionsReady}/{item.sectionsTotal}
                        </span>
                        <span className="font-semibold text-slate-100">{item.completeness}% Complete</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all"
                          style={{ width: `${item.completeness}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">No jobs in review queue</h3>
              <p className="text-sm text-slate-300">
                All jobs have been reviewed or don't match your filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </WorkpaperLayout>
  );
}

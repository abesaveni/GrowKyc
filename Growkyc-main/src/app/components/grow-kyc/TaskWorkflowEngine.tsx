import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  User,
  Users,
  Calendar,
  Flag,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Paperclip,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  category: 'kyc' | 'aml' | 'complaint' | 'breach' | 'review' | 'approval' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'waiting' | 'completed' | 'overdue';
  assignedTo: string;
  assignedBy: string;
  createdDate: Date;
  dueDate: Date;
  completedDate?: Date;
  linkedTo?: {
    type: 'client' | 'complaint' | 'breach' | 'case' | 'review';
    id: string;
    name: string;
  };
  comments: number;
  attachments: number;
  escalated: boolean;
}

export function TaskWorkflowEngine() {
  const [activeView, setActiveView] = useState<'personal' | 'team' | 'overdue' | 'all'>('personal');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Mock tasks
  const tasks: Task[] = [
    {
      id: 'TASK-2024-001',
      title: 'Review High-Risk Client - Horizon Capital',
      description: 'Complete enhanced due diligence for high-risk client flagged by AML screening',
      category: 'aml',
      priority: 'critical',
      status: 'in-progress',
      assignedTo: 'Sarah Chen',
      assignedBy: 'Michael Roberts',
      createdDate: new Date('2024-03-20T09:00:00'),
      dueDate: new Date('2024-03-23T17:00:00'),
      linkedTo: {
        type: 'client',
        id: 'CLI-2024-847',
        name: 'Horizon Capital Pty Ltd'
      },
      comments: 3,
      attachments: 2,
      escalated: true
    },
    {
      id: 'TASK-2024-002',
      title: 'Verify Income Documentation - S. Mitchell',
      description: 'Verify payslips and employment letter for NCCP assessment',
      category: 'kyc',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Sarah Chen',
      assignedBy: 'System',
      createdDate: new Date('2024-03-21T10:30:00'),
      dueDate: new Date('2024-03-24T17:00:00'),
      linkedTo: {
        type: 'client',
        id: 'CLI-001',
        name: 'Sarah Mitchell'
      },
      comments: 0,
      attachments: 4,
      escalated: false
    },
    {
      id: 'TASK-2024-003',
      title: 'Respond to Complaint - Fee Dispute',
      description: 'Draft formal response to customer complaint regarding early repayment fees',
      category: 'complaint',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Emma Williams',
      assignedBy: 'Sarah Chen',
      createdDate: new Date('2024-03-19T14:00:00'),
      dueDate: new Date('2024-03-22T17:00:00'),
      linkedTo: {
        type: 'complaint',
        id: 'COMP-2024-003',
        name: 'John Anderson - Fee Dispute'
      },
      comments: 5,
      attachments: 1,
      escalated: false
    },
    {
      id: 'TASK-2024-004',
      title: 'Quarterly AML Program Review',
      description: 'Review and update AML/CTF program documentation for Q1 2024',
      category: 'review',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'Sarah Chen',
      assignedBy: 'Michael Roberts',
      createdDate: new Date('2024-03-15T09:00:00'),
      dueDate: new Date('2024-03-31T17:00:00'),
      linkedTo: {
        type: 'review',
        id: 'REV-2024-Q1',
        name: 'Q1 2024 AML Review'
      },
      comments: 8,
      attachments: 6,
      escalated: false
    },
    {
      id: 'TASK-2024-005',
      title: 'Breach Investigation - Systems Outage',
      description: 'Investigate and document breach from 2-hour systems outage on March 18',
      category: 'breach',
      priority: 'critical',
      status: 'overdue',
      assignedTo: 'David Thompson',
      assignedBy: 'Sarah Chen',
      createdDate: new Date('2024-03-18T16:00:00'),
      dueDate: new Date('2024-03-21T17:00:00'),
      linkedTo: {
        type: 'breach',
        id: 'BR-2024-003',
        name: 'Systems Outage Breach'
      },
      comments: 12,
      attachments: 3,
      escalated: true
    },
    {
      id: 'TASK-2024-006',
      title: 'Approve Loan Application - Premium Business',
      description: 'Final approval required for $2.5M business loan application',
      category: 'approval',
      priority: 'high',
      status: 'waiting',
      assignedTo: 'Michael Roberts',
      assignedBy: 'Emma Williams',
      createdDate: new Date('2024-03-21T11:00:00'),
      dueDate: new Date('2024-03-25T17:00:00'),
      linkedTo: {
        type: 'case',
        id: 'CASE-2024-156',
        name: 'Premium Business Pty Ltd - Loan Application'
      },
      comments: 2,
      attachments: 15,
      escalated: false
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-500';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 border-orange-500';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-500';
      case 'low': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-500';
      default: return 'bg-[#0a0e17] text-slate-300 dark:bg-gray-800 dark:text-gray-300 border-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'waiting': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'overdue': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-[#0a0e17] text-slate-300 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'kyc': return <User className="w-4 h-4" />;
      case 'aml': return <AlertTriangle className="w-4 h-4" />;
      case 'complaint': return <MessageSquare className="w-4 h-4" />;
      case 'breach': return <AlertCircle className="w-4 h-4" />;
      case 'review': return <Eye className="w-4 h-4" />;
      case 'approval': return <CheckCircle className="w-4 h-4" />;
      default: return <CheckSquare className="w-4 h-4" />;
    }
  };

  const getDaysRemaining = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const filteredTasks = tasks.filter(task => {
    // View filter
    if (activeView === 'personal' && task.assignedTo !== 'Sarah Chen') return false;
    if (activeView === 'overdue' && task.status !== 'overdue') return false;
    
    // Status filter
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    
    // Priority filter
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    
    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  const stats = {
    personal: tasks.filter(t => t.assignedTo === 'Sarah Chen').length,
    team: tasks.length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    critical: tasks.filter(t => t.priority === 'critical').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0E7C9E] to-[#13B5EA] text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CheckSquare className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Task & Workflow Engine</h1>
              </div>
              <p className="text-xl text-cyan-100">Centralized Task Management & Assignment System</p>
            </div>
            <div className="text-right">
              <Button className="bg-[#0d121d] text-[#0E7C9E] hover:bg-cyan-50">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#0d121d] dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-400">My Tasks</div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-white dark:text-white">{stats.personal}</div>
            <div className="text-xs text-slate-400 mt-1">Assigned to you</div>
          </div>

          <div className="bg-[#0d121d] dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-400">Team Tasks</div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-white dark:text-white">{stats.team}</div>
            <div className="text-xs text-slate-400 mt-1">All active tasks</div>
          </div>

          <div className="bg-[#0d121d] dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-400">Overdue</div>
              <Clock className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-xs text-slate-400 mt-1">Require attention</div>
          </div>

          <div className="bg-[#0d121d] dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-400">Critical</div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600">{stats.critical}</div>
            <div className="text-xs text-slate-400 mt-1">High priority</div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="bg-[#0d121d] dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-white/10 dark:border-gray-700">
            {[
              { id: 'personal', label: 'My Tasks', icon: User, count: stats.personal },
              { id: 'team', label: 'Team Tasks', icon: Users, count: stats.team },
              { id: 'overdue', label: 'Overdue', icon: Clock, count: stats.overdue },
              { id: 'all', label: 'All Tasks', icon: CheckSquare, count: tasks.length }
            ].map(view => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors relative ${
                  activeView === view.id
                    ? 'bg-[#13B5EA] text-white'
                    : 'text-slate-300 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-gray-700'
                }`}
              >
                <view.icon className="w-5 h-5" />
                {view.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeView === view.id
                    ? 'bg-white/20'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {view.count}
                </span>
              </button>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="p-4 border-b border-white/10 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#0d121d] dark:bg-gray-700 text-white dark:text-white"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#0d121d] dark:bg-gray-700 text-white dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="waiting">Waiting</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#0d121d] dark:bg-gray-700 text-white dark:text-white"
              >
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Task List */}
          <div className="p-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white dark:text-white mb-2">No tasks found</h3>
                <p className="text-slate-300 dark:text-slate-400">
                  {activeView === 'personal' ? 'You have no tasks assigned' : 'No tasks match your filters'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map(task => {
                  const daysRemaining = getDaysRemaining(task.dueDate);
                  const isOverdue = daysRemaining < 0;
                  const isDueSoon = daysRemaining >= 0 && daysRemaining <= 2;

                  return (
                    <div
                      key={task.id}
                      className="border border-white/10 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow bg-[#0d121d] dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg border-2 ${getPriorityColor(task.priority)}`}>
                            {getCategoryIcon(task.category)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-white dark:text-white">{task.title}</h3>
                              {task.escalated && (
                                <Flag className="w-5 h-5 text-red-600" />
                              )}
                            </div>
                            <p className="text-sm text-slate-300 dark:text-slate-400 mb-2">{task.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{task.assignedTo}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Due: {task.dueDate.toLocaleDateString()}</span>
                                {(isOverdue || isDueSoon) && (
                                  <span className={`px-2 py-0.5 rounded-full ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
                                  </span>
                                )}
                              </div>
                              {task.linkedTo && (
                                <div className="flex items-center gap-1">
                                  <ArrowRight className="w-4 h-4" />
                                  <span className="text-[#13B5EA]">{task.linkedTo.name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                            {task.status.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/10 dark:border-gray-700">
                        <div className="flex items-center gap-4 text-sm text-slate-300 dark:text-slate-400">
                          {task.comments > 0 && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{task.comments}</span>
                            </div>
                          )}
                          {task.attachments > 0 && (
                            <div className="flex items-center gap-1">
                              <Paperclip className="w-4 h-4" />
                              <span>{task.attachments}</span>
                            </div>
                          )}
                          <div className="text-xs text-slate-400">
                            ID: {task.id}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedTask(task)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {task.status !== 'completed' && (
                            <Button size="sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  CheckCircle2, 
  Circle,
  Clock,
  AlertTriangle,
  AlertCircle,
  Calendar,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Plus,
  FileText,
  User,
  Building2,
  CheckSquare,
  XCircle,
  Edit,
  Trash2,
  Tag,
  Flag,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, isThisWeek, addDays } from 'date-fns';
import { toast } from '../lib/toast';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date;
  assignedTo: string;
  assignedBy: string;
  caseId?: string;
  caseNumber?: string;
  module: 'Grow MIP' | 'accounting' | 'crm' | 'compliance' | 'general';
  category: string;
  tags: string[];
  createdAt: Date;
  completedAt?: Date;
  notes?: string;
}

interface TaskCenterProps {
  userRole?: string;
  userId?: string;
  onNavigate?: (page: string, id?: string) => void;
}

export function TaskCenter({ userRole = 'lawyer', userId = 'user-001', onNavigate }: TaskCenterProps) {
  // Mock tasks data - in production this would come from API
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-001',
      title: 'Review loan documentation for MIP-2026-001',
      description: 'Complete legal review of all loan documents and verify NCCP compliance',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      assignedTo: 'user-001',
      assignedBy: 'lender-001',
      caseId: 'case-001',
      caseNumber: 'MIP-2026-001',
      module: 'Grow MIP',
      category: 'Legal Review',
      tags: ['review', 'compliance', 'urgent'],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'task-002',
      title: 'Upload Statement of Advice',
      description: 'Prepare and upload comprehensive statement of advice for case MIP-2026-001',
      status: 'in_progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      assignedTo: 'user-001',
      assignedBy: 'admin-001',
      caseId: 'case-001',
      caseNumber: 'MIP-2026-001',
      module: 'Grow MIP',
      category: 'Documentation',
      tags: ['document', 'legal'],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'task-003',
      title: 'Verify enforcement steps for MIP-2026-002',
      description: 'Check all statutory notices and enforcement procedures are complete',
      status: 'pending',
      priority: 'urgent',
      dueDate: new Date(), // Today
      assignedTo: 'user-001',
      assignedBy: 'lender-002',
      caseId: 'case-002',
      caseNumber: 'MIP-2026-002',
      module: 'Grow MIP',
      category: 'Compliance',
      tags: ['enforcement', 'statutory'],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'task-004',
      title: 'AML/CTF client verification - New Trust Account',
      description: 'Complete KYC verification and AML checks for new trust account setup',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      assignedTo: 'user-001',
      assignedBy: 'compliance-001',
      module: 'compliance',
      category: 'AML/CTF',
      tags: ['kyc', 'aml', 'verification'],
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'task-005',
      title: 'Review PEXA workspace documents',
      description: 'Review and approve settlement documents in PEXA workspace WS-12345',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      assignedTo: 'user-001',
      assignedBy: 'settlement-001',
      caseId: 'case-001',
      caseNumber: 'MIP-2026-001',
      module: 'Grow MIP',
      category: 'Settlement',
      tags: ['pexa', 'settlement', 'review'],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'task-006',
      title: 'Follow up with client - Contract of Sale',
      description: 'Contact Sarah Mitchell regarding outstanding contract of sale documents',
      status: 'overdue',
      priority: 'high',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
      assignedTo: 'user-001',
      assignedBy: 'user-001',
      caseId: 'case-001',
      caseNumber: 'MIP-2026-001',
      module: 'crm',
      category: 'Client Communication',
      tags: ['follow-up', 'client'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'task-007',
      title: 'Prepare monthly compliance report',
      description: 'Generate and review monthly AML/CTF compliance report for board',
      status: 'in_progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignedTo: 'user-001',
      assignedBy: 'admin-001',
      module: 'compliance',
      category: 'Reporting',
      tags: ['report', 'compliance', 'monthly'],
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'task-008',
      title: 'Update accounting records - February entries',
      description: 'Review and reconcile February accounting entries in Grow Accounting',
      status: 'completed',
      priority: 'low',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      assignedTo: 'user-001',
      assignedBy: 'accounting-001',
      module: 'accounting',
      category: 'Reconciliation',
      tags: ['accounting', 'reconciliation'],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'status' | 'createdAt'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const allTasks = tasks.filter(t => t.status !== 'completed');
    return {
      total: allTasks.length,
      overdue: tasks.filter(t => t.status === 'overdue').length,
      dueToday: allTasks.filter(t => isToday(t.dueDate)).length,
      dueTomorrow: allTasks.filter(t => isTomorrow(t.dueDate)).length,
      thisWeek: allTasks.filter(t => isThisWeek(t.dueDate)).length,
      urgent: allTasks.filter(t => t.priority === 'urgent').length,
      high: allTasks.filter(t => t.priority === 'high').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
    };
  }, [tasks]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.caseNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Module filter
    if (filterModule !== 'all') {
      filtered = filtered.filter(task => task.module === filterModule);
    }

    // Sort
    filtered.sort((a, b) => {
      let compareA: any = a[sortBy];
      let compareB: any = b[sortBy];

      if (sortBy === 'dueDate' || sortBy === 'createdAt') {
        compareA = new Date(compareA).getTime();
        compareB = new Date(compareB).getTime();
      }

      if (sortBy === 'priority') {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        compareA = priorityOrder[a.priority];
        compareB = priorityOrder[b.priority];
      }

      if (sortOrder === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

    return filtered;
  }, [tasks, searchQuery, filterStatus, filterPriority, filterModule, sortBy, sortOrder]);

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date() : undefined,
        };
      }
      return task;
    }));

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast.success(
        task.status === 'completed' ? 'Task reopened' : 'Task completed!',
        task.title
      );
    }
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
    toast.success('Task status updated');
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success('Task deleted');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Flag className="w-3 h-3" />;
      case 'high': return <AlertCircle className="w-3 h-3" />;
      case 'medium': return <AlertTriangle className="w-3 h-3" />;
      case 'low': return <Circle className="w-3 h-3" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return `Overdue (${format(date, 'MMM d')})`;
    return format(date, 'MMM d, yyyy');
  };

  const getDueDateColor = (date: Date, status: string) => {
    if (status === 'completed') return 'text-gray-500';
    if (isPast(date)) return 'text-red-600 font-semibold';
    if (isToday(date)) return 'text-orange-600 font-semibold';
    if (isTomorrow(date)) return 'text-yellow-600 font-semibold';
    return 'text-gray-600';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Center</h1>
          <p className="text-gray-600 mt-1">Manage all your tasks across Grow platform</p>
        </div>
        <Button onClick={() => setShowNewTaskModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Active Tasks</div>
              </div>
              <CheckSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                <div className="text-sm text-gray-600">Overdue</div>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.dueToday}</div>
                <div className="text-sm text-gray-600">Due Today</div>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.urgent}</div>
                <div className="text-sm text-gray-600">Urgent</div>
              </div>
              <Flag className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-5 gap-4">
            {/* Search */}
            <div className="col-span-2">
              <Label>Search Tasks</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by title, case number, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <Label>Status</Label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="overdue">Overdue</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <Label>Priority</Label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Module Filter */}
            <div>
              <Label>Module</Label>
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Modules</option>
                <option value="Grow MIP">Grow MIP</option>
                <option value="accounting">Accounting</option>
                <option value="compliance">Compliance</option>
                <option value="crm">CRM</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <Label className="text-sm font-medium">Sort by:</Label>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'dueDate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('dueDate')}
              >
                <Calendar className="w-4 h-4 mr-1" />
                Due Date
              </Button>
              <Button
                variant={sortBy === 'priority' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('priority')}
              >
                <Flag className="w-4 h-4 mr-1" />
                Priority
              </Button>
              <Button
                variant={sortBy === 'status' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('status')}
              >
                <CheckSquare className="w-4 h-4 mr-1" />
                Status
              </Button>
              <Button
                variant={sortBy === 'createdAt' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('createdAt')}
              >
                <Clock className="w-4 h-4 mr-1" />
                Created
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
            <div className="ml-auto text-sm text-gray-600">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map(task => (
          <Card key={task.id} className={`transition-all hover:shadow-md ${task.status === 'completed' ? 'opacity-60' : ''}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className="mt-1">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => toggleTaskStatus(task.id)}
                    className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                  />
                </div>

                {/* Task Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 ml-4">
                      {task.caseId && (
                        <Button variant="outline" size="sm" onClick={() => onNavigate?.('case', task.caseId)}>
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                          View Case
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => setEditingTask(task)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  {/* Task Meta */}
                  <div className="flex items-center gap-4 mt-3">
                    {/* Priority */}
                    <Badge className={`${getPriorityColor(task.priority)} flex items-center gap-1`}>
                      {getPriorityIcon(task.priority)}
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>

                    {/* Status */}
                    <Badge className={getStatusColor(task.status)}>
                      {task.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {task.status === 'in_progress' && <Clock className="w-3 h-3 mr-1" />}
                      {task.status === 'overdue' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                    </Badge>

                    {/* Due Date */}
                    <div className={`flex items-center gap-1 text-sm ${getDueDateColor(task.dueDate, task.status)}`}>
                      <Calendar className="w-4 h-4" />
                      {formatDueDate(task.dueDate)}
                    </div>

                    {/* Case Number */}
                    {task.caseNumber && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        {task.caseNumber}
                      </div>
                    )}

                    {/* Module */}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      {task.module.charAt(0).toUpperCase() + task.module.slice(1)}
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Tag className="w-4 h-4" />
                      {task.category}
                    </div>

                    {/* Tags */}
                    <div className="flex gap-1 ml-auto">
                      {task.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Status Update Buttons */}
                  {task.status !== 'completed' && task.status !== 'overdue' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      {task.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateTaskStatus(task.id, 'in_progress')}
                        >
                          Start Task
                        </Button>
                      )}
                      {task.status === 'in_progress' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateTaskStatus(task.id, 'pending')}
                          >
                            Move to Pending
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => toggleTaskStatus(task.id)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Mark Complete
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600">
                {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' || filterModule !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Create your first task to get started'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNewTaskModal(false)}>
          <Card className="w-full max-w-2xl m-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Create New Task</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowNewTaskModal(false)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter task title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Enter task description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="Grow MIP">Grow MIP</option>
                    <option value="grow_accounting">Grow Accounting</option>
                    <option value="grow_crm">Grow CRM</option>
                    <option value="grow_trust">Grow Trust</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowNewTaskModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    toast.success('Task created successfully!');
                    setShowNewTaskModal(false);
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditingTask(null)}>
          <Card className="w-full max-w-2xl m-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Edit Task</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setEditingTask(null)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                  <input
                    type="text"
                    defaultValue={editingTask.title}
                    id="edit-task-title"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter task title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    defaultValue={editingTask.description}
                    id="edit-task-description"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Enter task description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select 
                      defaultValue={editingTask.priority}
                      id="edit-task-priority"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      defaultValue={format(editingTask.dueDate, 'yyyy-MM-dd')}
                      id="edit-task-duedate"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                      defaultValue={editingTask.status}
                      id="edit-task-status"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
                    <select 
                      defaultValue={editingTask.module}
                      id="edit-task-module"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Grow MIP">Grow MIP</option>
                      <option value="accounting">Grow Accounting</option>
                      <option value="crm">Grow CRM</option>
                      <option value="compliance">Grow Compliance</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setEditingTask(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    // Get updated values from form
                    const title = (document.getElementById('edit-task-title') as HTMLInputElement).value;
                    const description = (document.getElementById('edit-task-description') as HTMLTextAreaElement).value;
                    const priority = (document.getElementById('edit-task-priority') as HTMLSelectElement).value as Task['priority'];
                    const dueDate = new Date((document.getElementById('edit-task-duedate') as HTMLInputElement).value);
                    const status = (document.getElementById('edit-task-status') as HTMLSelectElement).value as Task['status'];
                    const module = (document.getElementById('edit-task-module') as HTMLSelectElement).value as Task['module'];

                    // Update task
                    setTasks(tasks.map(t => 
                      t.id === editingTask.id 
                        ? { ...t, title, description, priority, dueDate, status, module }
                        : t
                    ));

                    toast.success('Task updated successfully!');
                    setEditingTask(null);
                  }}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

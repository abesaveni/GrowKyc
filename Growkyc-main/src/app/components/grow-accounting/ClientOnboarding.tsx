import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  UserPlus,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Building2,
  Users,
  Calendar,
  Zap,
  Edit,
  Trash2,
  MoreVertical,
  Send,
  Eye
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface ClientOnboardingProps {
  onNavigate?: (page: string) => void;
}

interface OnboardingClient {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  entityType: string;
  stage: 'prospect' | 'engagement' | 'documents' | 'setup' | 'complete';
  progress: number;
  assignedTo: string;
  startedDate: string;
  estimatedCompletion: string;
  tasksCompleted: number;
  totalTasks: number;
  status: 'on-track' | 'at-risk' | 'delayed' | 'complete';
}

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  category: string;
}

export function ClientOnboarding({ onNavigate }: ClientOnboardingProps) {
  const [selectedView, setSelectedView] = useState<'pipeline' | 'detail'>('pipeline');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const onboardingClients: OnboardingClient[] = [
    {
      id: 'OB-001',
      name: 'Tech Innovations Pty Ltd',
      contactPerson: 'James Wilson',
      email: 'james@techinnovations.com.au',
      phone: '0412 345 678',
      entityType: 'Company',
      stage: 'engagement',
      progress: 35,
      assignedTo: 'Sarah Johnson',
      startedDate: '2024-03-10',
      estimatedCompletion: '2024-03-25',
      tasksCompleted: 7,
      totalTasks: 20,
      status: 'on-track'
    },
    {
      id: 'OB-002',
      name: 'Green Energy Trust',
      contactPerson: 'Emily Chen',
      email: 'emily@greenenergy.com.au',
      phone: '0423 456 789',
      entityType: 'Trust',
      stage: 'documents',
      progress: 60,
      assignedTo: 'Mike Brown',
      startedDate: '2024-03-05',
      estimatedCompletion: '2024-03-20',
      tasksCompleted: 12,
      totalTasks: 20,
      status: 'on-track'
    },
    {
      id: 'OB-003',
      name: 'Smith Family SMSF',
      contactPerson: 'John Smith',
      email: 'john@smithsmsf.com.au',
      phone: '0434 567 890',
      entityType: 'SMSF',
      stage: 'setup',
      progress: 85,
      assignedTo: 'Sarah Johnson',
      startedDate: '2024-02-28',
      estimatedCompletion: '2024-03-18',
      tasksCompleted: 17,
      totalTasks: 20,
      status: 'on-track'
    },
    {
      id: 'OB-004',
      name: 'Retail Solutions Group',
      contactPerson: 'David Brown',
      email: 'david@retailsolutions.com.au',
      phone: '0445 678 901',
      entityType: 'Partnership',
      stage: 'documents',
      progress: 45,
      assignedTo: 'Emily Davis',
      startedDate: '2024-03-08',
      estimatedCompletion: '2024-03-22',
      tasksCompleted: 9,
      totalTasks: 20,
      status: 'at-risk'
    },
    {
      id: 'OB-005',
      name: 'Digital Marketing Co',
      contactPerson: 'Lisa Anderson',
      email: 'lisa@digitalmarketing.com.au',
      phone: '0456 789 012',
      entityType: 'Company',
      stage: 'prospect',
      progress: 15,
      assignedTo: 'Mike Brown',
      startedDate: '2024-03-12',
      estimatedCompletion: '2024-03-30',
      tasksCompleted: 3,
      totalTasks: 20,
      status: 'on-track'
    }
  ];

  const onboardingTasks: OnboardingTask[] = [
    {
      id: 'TASK-001',
      title: 'Send engagement letter',
      description: 'Prepare and send engagement letter for review',
      assignedTo: 'Sarah Johnson',
      dueDate: '2024-03-15',
      status: 'completed',
      category: 'Engagement'
    },
    {
      id: 'TASK-002',
      title: 'Collect identification documents',
      description: 'Request driver\'s license and passport copies',
      assignedTo: 'Sarah Johnson',
      dueDate: '2024-03-16',
      status: 'in-progress',
      category: 'Documents'
    },
    {
      id: 'TASK-003',
      title: 'Setup Xero organization',
      description: 'Create new Xero org and invite client',
      assignedTo: 'Mike Brown',
      dueDate: '2024-03-17',
      status: 'pending',
      category: 'Setup'
    },
    {
      id: 'TASK-004',
      title: 'Bank account verification',
      description: 'Verify bank account details and collect statements',
      assignedTo: 'Sarah Johnson',
      dueDate: '2024-03-18',
      status: 'pending',
      category: 'Documents'
    },
    {
      id: 'TASK-005',
      title: 'Create client portal access',
      description: 'Setup client portal login and send credentials',
      assignedTo: 'Emily Davis',
      dueDate: '2024-03-19',
      status: 'pending',
      category: 'Setup'
    }
  ];

  const stages = [
    { id: 'prospect', name: 'Prospect', count: 1, color: 'gray' },
    { id: 'engagement', name: 'Engagement', count: 1, color: 'blue' },
    { id: 'documents', name: 'Documents', count: 2, color: 'purple' },
    { id: 'setup', name: 'Setup', count: 1, color: 'orange' },
    { id: 'complete', name: 'Complete', count: 0, color: 'green' }
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospect': return 'bg-white/5 text-slate-300 border-white/10';
      case 'engagement': return 'bg-blue-500/15 text-blue-300 border-blue-300';
      case 'documents': return 'bg-purple-500/15 text-purple-300 border-purple-300';
      case 'setup': return 'bg-orange-500/15 text-orange-300 border-orange-300';
      case 'complete': return 'bg-green-500/15 text-green-300 border-green-300';
      default: return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-400';
      case 'at-risk': return 'text-orange-400';
      case 'delayed': return 'text-red-400';
      case 'complete': return 'text-green-400';
      default: return 'text-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return <CheckCircle className="w-4 h-4" />;
      case 'at-risk': return <AlertCircle className="w-4 h-4" />;
      case 'delayed': return <AlertCircle className="w-4 h-4" />;
      case 'complete': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/15 text-green-300 border-green-300';
      case 'in-progress': return 'bg-blue-500/15 text-blue-300 border-blue-300';
      case 'pending': return 'bg-white/5 text-slate-300 border-white/10';
      default: return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  return (
    <WorkpaperLayout currentPage="onboarding" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-slate-100">Client Onboarding</h1>
            <p className="text-sm text-slate-300 mt-1">Streamline new client setup with automated workflows</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-[#2855a6] hover:bg-[#1e4089]">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Total Active</p>
                  <p className="text-2xl font-bold text-slate-100">5</p>
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
                  <p className="text-xs text-slate-300">On Track</p>
                  <p className="text-2xl font-bold text-slate-100">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">At Risk</p>
                  <p className="text-2xl font-bold text-slate-100">1</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Avg. Duration</p>
                  <p className="text-2xl font-bold text-slate-100">15d</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Completion Rate</p>
                  <p className="text-2xl font-bold text-slate-100">92%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stage Pipeline */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-100 mb-4">Onboarding Pipeline</h3>
            <div className="flex items-center gap-2">
              {stages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  <div className="flex-1">
                    <div className={`p-4 border-2 rounded-lg ${getStageColor(stage.id)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">{stage.name}</span>
                        <span className="px-2 py-0.5 bg-white text-xs font-bold rounded">
                          {stage.count}
                        </span>
                      </div>
                      <div className="h-1 bg-white rounded-full" />
                    </div>
                  </div>
                  {index < stages.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Client List */}
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content - Client Cards */}
          <div className="col-span-8">
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {onboardingClients.map((client) => (
                    <div
                      key={client.id}
                      className="p-4 border border-white/10 rounded-lg hover:border-[#2855a6] hover:bg-blue-500/10 cursor-pointer transition-all"
                      onClick={() => {
                        setSelectedClient(client.id);
                        setSelectedView('detail');
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                              {client.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-100">{client.name}</h3>
                              <p className="text-sm text-slate-300">{client.entityType}</p>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded border ${getStageColor(client.stage)}`}>
                          {client.stage.charAt(0).toUpperCase() + client.stage.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-slate-300 mb-1">Contact Person</p>
                          <p className="text-sm font-semibold text-slate-100">{client.contactPerson}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-300 mb-1">Assigned To</p>
                          <p className="text-sm font-semibold text-slate-100">{client.assignedTo}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-300 mb-1">Est. Completion</p>
                          <p className="text-sm font-semibold text-slate-100">{client.estimatedCompletion}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">Progress</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-100">{client.tasksCompleted}/{client.totalTasks} tasks</span>
                            <span className={`flex items-center gap-1 ${getStatusColor(client.status)}`}>
                              {getStatusIcon(client.status)}
                              <span className="text-xs font-semibold capitalize">{client.status.replace('-', ' ')}</span>
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              client.status === 'on-track' ? 'bg-green-600' :
                              client.status === 'at-risk' ? 'bg-orange-600' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${client.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="w-4 h-4 mr-2" />
                          Email Client
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Tasks */}
          <div className="col-span-4">
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-100">Upcoming Tasks</h3>
                  <Button size="sm" variant="outline">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {onboardingTasks.map((task) => (
                    <div key={task.id} className="p-3 border border-white/10 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-semibold text-slate-100">{task.title}</h4>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getTaskStatusBadge(task.status)}`}>
                          {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mb-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{task.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Tasks
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)] mt-4">
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-100 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Documents
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Send className="w-4 h-4 mr-2" />
                    Send Engagement Letter
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Checklist
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Zap className="w-4 h-4 mr-2" />
                    Run Workflow
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WorkpaperLayout>
  );
}

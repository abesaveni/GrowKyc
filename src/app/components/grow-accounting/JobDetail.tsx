import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Briefcase,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Upload,
  Download,
  Eye,
  MessageSquare,
  Send,
  Edit,
  Trash2,
  Plus,
  Play,
  Pause,
  Target,
  Zap,
  TrendingUp,
  MoreVertical
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface JobDetailProps {
  onNavigate?: (page: string, id?: string) => void;
  jobId?: string;
}

interface WorkpaperSection {
  id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'complete' | 'review';
  progress: number;
  assignedTo: string;
  lastUpdated: string;
  aiAccuracy?: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  category: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
  required: boolean;
}

interface ActivityItem {
  id: string;
  type: 'comment' | 'status_change' | 'document' | 'workpaper';
  user: string;
  action: string;
  timestamp: string;
  details?: string;
}

export function JobDetail({ onNavigate, jobId = 'JOB-2024-003' }: JobDetailProps) {
  const [activeTab, setActiveTab] = useState<'workpapers' | 'documents' | 'checklist' | 'activity'>('workpapers');
  const [newNote, setNewNote] = useState('');

  // Mock data
  const jobData = {
    id: jobId,
    clientName: 'Smith SMSF',
    entity: 'Smith Super Fund',
    entityType: 'SMSF',
    year: 'FY2024',
    status: 'in_progress',
    priority: 'high',
    progress: 68,
    dueDate: '2024-03-18',
    daysUntilDue: 11,
    assignedStaff: ['Mike Brown', 'Emily Davis'],
    reviewer: 'Sarah Johnson',
    manager: 'Tom Wilson',
    startDate: '2024-02-15',
    estimatedHours: 12,
    actualHours: 8.5,
    billingStatus: 'in_progress'
  };

  const workpaperSections: WorkpaperSection[] = [
    { id: 'WP-001', name: 'BAS Reconciliation - Q4 2024', status: 'in_progress', progress: 68, assignedTo: 'Mike Brown', lastUpdated: '2 min ago', aiAccuracy: 96 },
    { id: 'WP-002', name: 'Bank Reconciliation', status: 'complete', progress: 100, assignedTo: 'Mike Brown', lastUpdated: '1 day ago', aiAccuracy: 98 },
    { id: 'WP-003', name: 'Super Guarantee Compliance', status: 'in_progress', progress: 45, assignedTo: 'Emily Davis', lastUpdated: '3 hours ago', aiAccuracy: 94 },
    { id: 'WP-004', name: 'Member Statements', status: 'review', progress: 90, assignedTo: 'Emily Davis', lastUpdated: '2 hours ago', aiAccuracy: 95 },
    { id: 'WP-005', name: 'Tax Estimate', status: 'not_started', progress: 0, assignedTo: 'Mike Brown', lastUpdated: 'Not started' }
  ];

  const documents: Document[] = [
    { id: 'DOC-001', name: 'Bank_Statement_Dec2024.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: '2024-03-01', uploadedBy: 'Mike Brown', category: 'Bank Statements' },
    { id: 'DOC-002', name: 'BAS_Return_Q4.xlsx', type: 'Excel', size: '156 KB', uploadedAt: '2024-03-01', uploadedBy: 'Mike Brown', category: 'BAS' },
    { id: 'DOC-003', name: 'ATO_Notice.pdf', type: 'PDF', size: '892 KB', uploadedAt: '2024-02-28', uploadedBy: 'System', category: 'ATO' },
    { id: 'DOC-004', name: 'Super_Contributions.xlsx', type: 'Excel', size: '234 KB', uploadedAt: '2024-02-27', uploadedBy: 'Emily Davis', category: 'Super' },
    { id: 'DOC-005', name: 'Member_Details.pdf', type: 'PDF', size: '1.1 MB', uploadedAt: '2024-02-25', uploadedBy: 'Client', category: 'Member Info' }
  ];

  const checklistItems: ChecklistItem[] = [
    { id: 'CL-001', text: 'Obtain bank statements for all accounts', completed: true, completedBy: 'Mike Brown', completedAt: '2024-03-01', required: true },
    { id: 'CL-002', text: 'Verify member contributions', completed: true, completedBy: 'Emily Davis', completedAt: '2024-03-01', required: true },
    { id: 'CL-003', text: 'Review ATO notices', completed: true, completedBy: 'Mike Brown', completedAt: '2024-02-28', required: true },
    { id: 'CL-004', text: 'Complete BAS reconciliation', completed: false, required: true },
    { id: 'CL-005', text: 'Calculate super guarantee compliance', completed: false, required: true },
    { id: 'CL-006', text: 'Prepare member benefit statements', completed: false, required: true },
    { id: 'CL-007', text: 'Review investment performance', completed: false, required: false },
    { id: 'CL-008', text: 'Tax estimate calculation', completed: false, required: true },
    { id: 'CL-009', text: 'Trustee minutes review', completed: false, required: false },
    { id: 'CL-010', text: 'Final review and sign-off', completed: false, required: true }
  ];

  const activityLog: ActivityItem[] = [
    { id: 'ACT-001', type: 'workpaper', user: 'Mike Brown', action: 'updated BAS Reconciliation', timestamp: '2 minutes ago', details: 'Progress: 68%' },
    { id: 'ACT-002', type: 'comment', user: 'Emily Davis', action: 'added a comment', timestamp: '2 hours ago', details: 'Member statements ready for review' },
    { id: 'ACT-003', type: 'status_change', user: 'Mike Brown', action: 'moved job to In Progress', timestamp: '3 hours ago' },
    { id: 'ACT-004', type: 'document', user: 'Mike Brown', action: 'uploaded Bank_Statement_Dec2024.pdf', timestamp: '1 day ago' },
    { id: 'ACT-005', type: 'workpaper', user: 'Mike Brown', action: 'completed Bank Reconciliation', timestamp: '1 day ago', details: '100% complete' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'complete': return 'bg-green-50 text-green-700 border-green-300';
      case 'review': return 'bg-purple-50 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not_started': return 'Not Started';
      case 'in_progress': return 'In Progress';
      case 'complete': return 'Complete';
      case 'review': return 'In Review';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-300';
      case 'medium': return 'bg-orange-50 text-orange-700 border-orange-300';
      case 'low': return 'bg-green-50 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const completedChecklist = checklistItems.filter(item => item.completed).length;
  const totalChecklist = checklistItems.length;

  return (
    <WorkpaperLayout currentPage="jobs" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate?.('jobs')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{jobData.clientName}</h1>
                <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusColor(jobData.status)}`}>
                  {getStatusLabel(jobData.status)}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded border ${getPriorityColor(jobData.priority)}`}>
                  {jobData.priority.toUpperCase()} PRIORITY
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-600">{jobData.entity}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600">{jobData.entityType}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600">{jobData.year}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm font-mono text-gray-500">{jobData.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Job
            </Button>
            <Button variant="outline" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Progress</p>
                  <p className="text-xl font-bold text-gray-900">{jobData.progress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Due In</p>
                  <p className="text-xl font-bold text-gray-900">{jobData.daysUntilDue} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Checklist</p>
                  <p className="text-xl font-bold text-gray-900">{completedChecklist}/{totalChecklist}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Time</p>
                  <p className="text-xl font-bold text-gray-900">{jobData.actualHours}h / {jobData.estimatedHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Progress Overview */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Overall Progress</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-semibold text-gray-900">{jobData.progress}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-[#2855a6] transition-all"
                      style={{ width: `${jobData.progress}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Not Started</p>
                      <p className="text-lg font-bold text-gray-400">
                        {workpaperSections.filter(w => w.status === 'not_started').length}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">In Progress</p>
                      <p className="text-lg font-bold text-blue-600">
                        {workpaperSections.filter(w => w.status === 'in_progress').length}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Complete</p>
                      <p className="text-lg font-bold text-green-600">
                        {workpaperSections.filter(w => w.status === 'complete').length}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-6">
                {/* Tab Navigation */}
                <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('workpapers')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'workpapers' 
                        ? 'text-[#2855a6] border-b-2 border-[#2855a6]' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Workpapers ({workpaperSections.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'documents' 
                        ? 'text-[#2855a6] border-b-2 border-[#2855a6]' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Documents ({documents.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('checklist')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'checklist' 
                        ? 'text-[#2855a6] border-b-2 border-[#2855a6]' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Checklist ({completedChecklist}/{totalChecklist})
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'activity' 
                        ? 'text-[#2855a6] border-b-2 border-[#2855a6]' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Activity
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'workpapers' && (
                  <div className="space-y-3">
                    {workpaperSections.map((section) => (
                      <div
                        key={section.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-[#2855a6] hover:bg-blue-50 cursor-pointer transition-all"
                        onClick={() => onNavigate?.('workpaper-detail', section.id)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{section.name}</h4>
                            <p className="text-xs text-gray-500">{section.id}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusColor(section.status)}`}>
                            {getStatusLabel(section.status)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs font-semibold text-gray-900">{section.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                          <div 
                            className="h-full bg-[#2855a6] transition-all"
                            style={{ width: `${section.progress}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            <span>{section.assignedTo}</span>
                          </div>
                          {section.aiAccuracy && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded">
                              <Target className="w-3 h-3 text-green-600" />
                              <span className="text-green-700 font-semibold">{section.aiAccuracy}% AI</span>
                            </div>
                          )}
                          <span>Updated {section.lastUpdated}</span>
                        </div>
                      </div>
                    ))}

                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Workpaper
                    </Button>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Documents</h4>
                      <Button size="sm">
                        <Upload className="w-3 h-3 mr-2" />
                        Upload
                      </Button>
                    </div>

                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-[#2855a6] cursor-pointer transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500">{doc.size}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">{doc.category}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Uploaded by {doc.uploadedBy} on {doc.uploadedAt}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'checklist' && (
                  <div className="space-y-3">
                    {checklistItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 border rounded-lg ${
                          item.completed ? 'bg-green-50 border-green-200' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            className="mt-1 w-4 h-4 rounded border-gray-300 text-[#2855a6] focus:ring-[#2855a6]"
                            readOnly
                          />
                          <div className="flex-1">
                            <p className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {item.text}
                              {item.required && <span className="text-red-500 ml-1">*</span>}
                            </p>
                            {item.completed && item.completedBy && (
                              <p className="text-xs text-gray-500 mt-1">
                                ✓ {item.completedBy} • {item.completedAt}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-4">
                    {activityLog.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold text-gray-700">
                          {activity.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <strong>{activity.user}</strong> {activity.action}
                          </p>
                          {activity.details && (
                            <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="col-span-4 space-y-4">
            {/* Team */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Team</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Assigned Staff</p>
                    {jobData.assignedStaff.map((staff, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                          {staff.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-gray-900">{staff}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Reviewer</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                        {jobData.reviewer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-gray-900">{jobData.reviewer}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Manager</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                        {jobData.manager.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-gray-900">{jobData.manager}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-medium text-gray-900">{jobData.startDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Due Date</span>
                    <span className="font-medium text-gray-900">{jobData.dueDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Days Remaining</span>
                    <span className={`font-bold ${jobData.daysUntilDue <= 7 ? 'text-red-600' : 'text-gray-900'}`}>
                      {jobData.daysUntilDue} days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Play className="w-3 h-3 mr-2" />
                    Start Timer
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Send className="w-3 h-3 mr-2" />
                    Send to Client
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="w-3 h-3 mr-2" />
                    Export Summary
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquare className="w-3 h-3 mr-2" />
                    Message Team
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Note</h3>
                <textarea
                  placeholder="Add a quick note..."
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6] mb-2"
                />
                <Button size="sm" className="w-full">
                  <Plus className="w-3 h-3 mr-2" />
                  Add Note
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WorkpaperLayout>
  );
}

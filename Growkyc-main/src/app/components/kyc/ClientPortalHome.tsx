import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Lock,
  Mail,
  User,
  Building,
  FileText,
  Upload,
  Eye,
  Settings,
  MessageSquare,
  LogOut,
  ChevronRight,
  Download,
  Calendar,
  TrendingUp
} from 'lucide-react';

type KYCStatus = 'not-started' | 'in-progress' | 'action-required' | 'under-review' | 'approved' | 'restricted';

interface Task {
  id: string;
  title: string;
  type: 'upload' | 'verify' | 'review' | 'update';
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

interface Message {
  id: string;
  from: 'client' | 'staff';
  sender: string;
  message: string;
  timestamp: Date;
  attachments?: string[];
}

interface TimelineEvent {
  id: string;
  type: 'invite' | 'submission' | 'verification' | 'screening' | 'review' | 'approval' | 'update';
  title: string;
  description: string;
  timestamp: Date;
  status: 'complete' | 'pending' | 'failed';
}

export function ClientPortalHome() {
  const [kycStatus, setKycStatus] = useState<KYCStatus>('in-progress');
  const [progress, setProgress] = useState(65); // percentage
  const [activeView, setActiveView] = useState<'home' | 'kyc' | 'updates' | 'messages' | 'settings'>('home');

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'T1',
      title: 'Upload trust deed document',
      type: 'upload',
      dueDate: new Date('2024-02-25'),
      priority: 'high',
      completed: false
    },
    {
      id: 'T2',
      title: 'Complete beneficial owner verification',
      type: 'verify',
      dueDate: new Date('2024-02-26'),
      priority: 'high',
      completed: false
    },
    {
      id: 'T3',
      title: 'Review and sign declarations',
      type: 'review',
      priority: 'medium',
      completed: false
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'M1',
      from: 'staff',
      sender: 'Compliance Team',
      message: 'Please upload the trust deed document to complete your verification. If you need assistance, reply to this message.',
      timestamp: new Date('2024-02-18T14:30:00'),
      attachments: []
    },
    {
      id: 'M2',
      from: 'client',
      sender: 'You',
      message: 'I have uploaded the trust deed. Please let me know if you need anything else.',
      timestamp: new Date('2024-02-18T15:45:00'),
      attachments: ['trust-deed.pdf']
    }
  ]);

  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    {
      id: 'E1',
      type: 'invite',
      title: 'Invitation Sent',
      description: 'KYC invitation sent to your email',
      timestamp: new Date('2024-02-15T10:00:00'),
      status: 'complete'
    },
    {
      id: 'E2',
      type: 'submission',
      title: 'Profile Submitted',
      description: 'Contact and entity details submitted',
      timestamp: new Date('2024-02-16T14:20:00'),
      status: 'complete'
    },
    {
      id: 'E3',
      type: 'verification',
      title: 'Identity Verification',
      description: 'GreenID verification completed successfully',
      timestamp: new Date('2024-02-17T09:15:00'),
      status: 'complete'
    },
    {
      id: 'E4',
      type: 'screening',
      title: 'Screening In Progress',
      description: 'Sanctions and PEP screening underway',
      timestamp: new Date('2024-02-18T11:00:00'),
      status: 'pending'
    },
    {
      id: 'E5',
      type: 'review',
      title: 'Under Compliance Review',
      description: 'Awaiting final compliance officer review',
      timestamp: new Date('2024-02-20T00:00:00'),
      status: 'pending'
    }
  ]);

  const nextReviewDate = new Date('2025-02-20');
  const daysUntilReview = Math.floor((nextReviewDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const getStatusConfig = (status: KYCStatus) => {
    switch (status) {
      case 'not-started':
        return { label: 'Not Started', color: 'gray', icon: Clock };
      case 'in-progress':
        return { label: 'In Progress', color: 'blue', icon: TrendingUp };
      case 'action-required':
        return { label: 'Action Required', color: 'orange', icon: AlertTriangle };
      case 'under-review':
        return { label: 'Under Review', color: 'purple', icon: Eye };
      case 'approved':
        return { label: 'Approved', color: 'green', icon: CheckCircle };
      case 'restricted':
        return { label: 'Restricted', color: 'red', icon: XCircle };
    }
  };

  const statusConfig = getStatusConfig(kycStatus);
  const StatusIcon = statusConfig.icon;

  const incompleteTasks = tasks.filter(t => !t.completed);
  const highPriorityTasks = incompleteTasks.filter(t => t.priority === 'high');

  return (
    <div className="min-h-screen bg-white/5">
      {/* Header */}
      <div className="bg-white border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-slate-100">Grow KYC Portal</h1>
                <p className="text-sm text-slate-300">TechCorp Pty Ltd</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-500/15 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-100">John Smith</p>
                  <p className="text-xs text-slate-300">Primary Contact</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2">
            {[
              { id: 'home', label: 'Home', icon: TrendingUp },
              { id: 'kyc', label: 'KYC Process', icon: FileText },
              { id: 'updates', label: 'Updates', icon: Upload },
              { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 1 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((nav) => {
              const Icon = nav.icon;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveView(nav.id as any)}
                  className={`px-6 py-4 font-semibold flex items-center gap-2 transition-colors relative ${
                    activeView === nav.id
                      ? 'border-b-2 border-blue-600 text-blue-400'
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {nav.label}
                  {nav.badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {nav.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeView === 'home' && (
          <div className="space-y-6">
            {/* Status Center */}
            <div className="bg-white rounded-lg border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-6">KYC Status Center</h2>

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 bg-${statusConfig.color}-100 rounded-lg flex items-center justify-center`}>
                      <StatusIcon className={`w-6 h-6 text-${statusConfig.color}-600`} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">Current Status</p>
                      <p className={`text-2xl font-bold text-${statusConfig.color}-600`}>{statusConfig.label}</p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-300 mb-1">Next Review Date</p>
                  <p className="text-xl font-bold text-slate-100">
                    {nextReviewDate.toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-400">{daysUntilReview} days away</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-slate-100">Overall Progress</p>
                  <p className="text-sm text-slate-300">{progress}% Complete</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-slate-300 mt-2">
                  {incompleteTasks.length} tasks remaining
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <p className="text-sm text-blue-300 mb-1">Documents Uploaded</p>
                  <p className="text-3xl font-bold text-blue-400">7/10</p>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <p className="text-sm text-green-300 mb-1">Verifications Complete</p>
                  <p className="text-3xl font-bold text-green-400">3/4</p>
                </div>
                <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                  <p className="text-sm text-orange-300 mb-1">Pending Actions</p>
                  <p className="text-3xl font-bold text-orange-400">{highPriorityTasks.length}</p>
                </div>
              </div>

              {/* Action Required Banner */}
              {highPriorityTasks.length > 0 && (
                <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-orange-400 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-bold text-orange-300 mb-2">Action Required</h3>
                      <p className="text-orange-300 mb-4">
                        You have {highPriorityTasks.length} high-priority task{highPriorityTasks.length > 1 ? 's' : ''} that need{highPriorityTasks.length === 1 ? 's' : ''} your attention.
                      </p>
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        View Tasks
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg">
                Continue KYC Process
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <h3 className="text-xl font-bold text-slate-100 mb-4">Your Tasks</h3>
              
              {incompleteTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <p className="text-slate-300">All tasks complete! Waiting for final review.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incompleteTasks.map((task) => (
                    <div key={task.id} className={`p-4 rounded-lg border-2 ${
                      task.priority === 'high' ? 'border-red-500/30 bg-red-500/10' :
                      task.priority === 'medium' ? 'border-yellow-500/30 bg-yellow-500/10' :
                      'border-white/10 bg-white/5'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {task.type === 'upload' && <Upload className="w-5 h-5 text-slate-300" />}
                          {task.type === 'verify' && <Shield className="w-5 h-5 text-slate-300" />}
                          {task.type === 'review' && <Eye className="w-5 h-5 text-slate-300" />}
                          <div>
                            <p className="font-semibold text-slate-100">{task.title}</p>
                            {task.dueDate && (
                              <p className="text-sm text-slate-300 flex items-center mt-1">
                                <Calendar className="w-3 h-3 mr-1" />
                                Due: {task.dueDate.toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            task.priority === 'high' ? 'bg-red-500 text-white' :
                            task.priority === 'medium' ? 'bg-yellow-500 text-white' :
                            'bg-gray-400 text-white'
                          }`}>
                            {task.priority.toUpperCase()}
                          </span>
                          <Button size="sm">Complete</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Messages */}
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-100">Recent Messages</h3>
                <Button variant="outline" size="sm" onClick={() => setActiveView('messages')}>
                  View All
                </Button>
              </div>

              <div className="space-y-3">
                {messages.slice(0, 2).map((message) => (
                  <div key={message.id} className={`p-4 rounded-lg border ${
                    message.from === 'staff' 
                      ? 'border-blue-500/30 bg-blue-500/10' 
                      : 'border-white/10 bg-white/5'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className={`w-4 h-4 ${
                          message.from === 'staff' ? 'text-blue-400' : 'text-slate-300'
                        }`} />
                        <span className="font-semibold text-slate-100">{message.sender}</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {message.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{message.message}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {message.attachments.map((file, index) => (
                          <span key={index} className="px-2 py-1 bg-white border border-white/10 rounded text-xs">
                            📎 {file}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg border border-white/10 p-6">
              <h3 className="text-xl font-bold text-slate-100 mb-6">Activity Timeline</h3>

              <div className="space-y-4">
                {timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        event.status === 'complete' ? 'bg-green-500/15' :
                        event.status === 'pending' ? 'bg-blue-500/15' :
                        'bg-red-500/15'
                      }`}>
                        {event.status === 'complete' && <CheckCircle className="w-5 h-5 text-green-400" />}
                        {event.status === 'pending' && <Clock className="w-5 h-5 text-blue-400" />}
                        {event.status === 'failed' && <XCircle className="w-5 h-5 text-red-400" />}
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-white/10 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-semibold text-slate-100">{event.title}</p>
                      <p className="text-sm text-slate-300">{event.description}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {event.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages View */}
        {activeView === 'messages' && (
          <div className="bg-white rounded-lg border border-white/10 p-6">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Secure Messages</h2>
            
            <div className="space-y-4 mb-6">
              {messages.map((message) => (
                <div key={message.id} className={`p-4 rounded-lg border-2 ${
                  message.from === 'staff' 
                    ? 'border-blue-500/30 bg-blue-500/10' 
                    : 'border-white/10 bg-white/5 ml-12'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.from === 'staff' ? 'bg-blue-500/15' : 'bg-white/10'
                      }`}>
                        {message.from === 'staff' ? (
                          <Shield className="w-4 h-4 text-blue-400" />
                        ) : (
                          <User className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <span className="font-semibold text-slate-100">{message.sender}</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {message.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-300 ml-10">{message.message}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3 ml-10 flex gap-2">
                      {message.attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-2 bg-white border border-white/10 rounded">
                          <FileText className="w-4 h-4 text-slate-300" />
                          <span className="text-sm">{file}</span>
                          <Download className="w-4 h-4 text-blue-400 cursor-pointer" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-slate-100 mb-4">Send Message</h3>
              <textarea
                placeholder="Type your message here..."
                className="w-full p-4 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                rows={4}
              />
              <div className="flex gap-3">
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Attach File
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
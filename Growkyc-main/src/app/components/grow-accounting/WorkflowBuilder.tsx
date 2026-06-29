import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Plus,
  Play,
  Save,
  Trash2,
  Copy,
  Edit,
  ChevronRight,
  Clock,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  Zap,
  Users,
  Calendar,
  Filter,
  Download,
  Upload,
  Settings,
  Eye,
  MoreVertical
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface WorkflowBuilderProps {
  onNavigate?: (page: string) => void;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: number;
  triggers: string[];
  status: 'active' | 'draft' | 'paused';
  runsCount: number;
  successRate: number;
  lastRun?: string;
}

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  title: string;
  description: string;
  icon: any;
  config?: any;
}

export function WorkflowBuilder({ onNavigate }: WorkflowBuilderProps) {
  const [selectedView, setSelectedView] = useState<'templates' | 'builder'>('templates');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'WF-001',
      name: 'BAS Auto-Reminder',
      description: 'Automatically send BAS reminders to clients 2 weeks before deadline',
      category: 'Compliance',
      steps: 5,
      triggers: ['Date-based', 'Calendar'],
      status: 'active',
      runsCount: 234,
      successRate: 98,
      lastRun: '2 hours ago'
    },
    {
      id: 'WF-002',
      name: 'New Client Onboarding',
      description: 'Complete onboarding workflow from engagement to first job',
      category: 'Client Services',
      steps: 8,
      triggers: ['New Client', 'Manual'],
      status: 'active',
      runsCount: 45,
      successRate: 95,
      lastRun: '1 day ago'
    },
    {
      id: 'WF-003',
      name: 'Document Request Follow-up',
      description: 'Auto-follow up with clients who haven\'t uploaded requested documents',
      category: 'Document Management',
      steps: 4,
      triggers: ['Document Status', 'Time-based'],
      status: 'active',
      runsCount: 156,
      successRate: 92,
      lastRun: '3 hours ago'
    },
    {
      id: 'WF-004',
      name: 'Review Assignment',
      description: 'Auto-assign completed jobs to reviewers based on workload',
      category: 'Job Management',
      steps: 6,
      triggers: ['Job Status Change'],
      status: 'active',
      runsCount: 312,
      successRate: 99,
      lastRun: '30 minutes ago'
    },
    {
      id: 'WF-005',
      name: 'Year-End Checklist',
      description: 'Send year-end checklist to clients in November',
      category: 'Compliance',
      steps: 7,
      triggers: ['Date-based'],
      status: 'draft',
      runsCount: 0,
      successRate: 0
    },
    {
      id: 'WF-006',
      name: 'Invoice on Job Completion',
      description: 'Automatically generate and send invoice when job is marked complete',
      category: 'Billing',
      steps: 5,
      triggers: ['Job Status Change'],
      status: 'active',
      runsCount: 189,
      successRate: 97,
      lastRun: '1 hour ago'
    }
  ];

  const workflowSteps: WorkflowStep[] = [
    {
      id: 'step-1',
      type: 'trigger',
      title: 'When BAS deadline is 14 days away',
      description: 'Trigger: Date-based event',
      icon: Calendar
    },
    {
      id: 'step-2',
      type: 'condition',
      title: 'Check if BAS job exists',
      description: 'Condition: Job status check',
      icon: CheckCircle
    },
    {
      id: 'step-3',
      type: 'action',
      title: 'Send reminder email to client',
      description: 'Action: Email notification',
      icon: Mail
    },
    {
      id: 'step-4',
      type: 'delay',
      title: 'Wait 7 days',
      description: 'Delay: 7 days',
      icon: Clock
    },
    {
      id: 'step-5',
      type: 'action',
      title: 'Send final reminder + SMS',
      description: 'Action: Email + SMS notification',
      icon: AlertCircle
    }
  ];

  const categories = [
    { id: 'all', name: 'All Workflows', count: 6 },
    { id: 'compliance', name: 'Compliance', count: 2 },
    { id: 'client', name: 'Client Services', count: 1 },
    { id: 'documents', name: 'Document Management', count: 1 },
    { id: 'jobs', name: 'Job Management', count: 1 },
    { id: 'billing', name: 'Billing', count: 1 }
  ];

  const availableActions = [
    { id: 'email', name: 'Send Email', icon: Mail, color: 'blue' },
    { id: 'task', name: 'Create Task', icon: CheckCircle, color: 'green' },
    { id: 'document', name: 'Generate Document', icon: FileText, color: 'purple' },
    { id: 'assign', name: 'Assign Job', icon: Users, color: 'orange' },
    { id: 'notify', name: 'Send Notification', icon: AlertCircle, color: 'red' },
    { id: 'update', name: 'Update Status', icon: Zap, color: 'yellow' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/15 text-green-300 border-green-300';
      case 'draft':
        return 'bg-white/5 text-slate-300 border-white/10';
      case 'paused':
        return 'bg-orange-500/15 text-orange-300 border-orange-300';
      default:
        return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'trigger':
        return 'bg-blue-500/10 border-blue-300';
      case 'action':
        return 'bg-green-500/10 border-green-300';
      case 'condition':
        return 'bg-purple-500/10 border-purple-300';
      case 'delay':
        return 'bg-orange-500/10 border-orange-300';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  return (
    <WorkpaperLayout currentPage="workflows" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-slate-100">Workflow Builder</h1>
            <p className="text-sm text-slate-300 mt-1">Automate repetitive tasks and processes</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              className="bg-[#2855a6] hover:bg-[#1e4089]"
              onClick={() => setSelectedView('builder')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedView('templates')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'templates'
                ? 'bg-[#2855a6] text-white'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            My Workflows
          </button>
          <button
            onClick={() => setSelectedView('builder')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedView === 'builder'
                ? 'bg-[#2855a6] text-white'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            Workflow Builder
          </button>
        </div>

        {/* Templates View */}
        {selectedView === 'templates' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Categories */}
            <div className="col-span-3">
              <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-100 mb-3">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className="w-full flex items-center justify-between p-2 rounded-lg text-sm hover:bg-white/5 transition-colors"
                      >
                        <span className="text-slate-300">{category.name}</span>
                        <span className="px-2 py-0.5 bg-white/10 text-slate-300 text-xs font-semibold rounded-full">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <h4 className="font-semibold text-slate-100 text-sm mb-2">Quick Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Active</span>
                        <span className="font-semibold text-green-400">5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Draft</span>
                        <span className="font-semibold text-slate-300">1</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Total Runs</span>
                        <span className="font-semibold text-blue-400">936</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Workflow List */}
            <div className="col-span-9">
              <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {workflowTemplates.map((workflow) => (
                      <div
                        key={workflow.id}
                        className="p-4 border border-white/10 rounded-lg hover:border-[#2855a6] hover:bg-blue-500/10 cursor-pointer transition-all"
                        onClick={() => setSelectedWorkflow(workflow.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-slate-100">{workflow.name}</h3>
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getStatusBadge(workflow.status)}`}>
                                {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300">{workflow.description}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-5 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-slate-300 mb-1">Category</p>
                            <p className="text-sm font-semibold text-slate-100">{workflow.category}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-300 mb-1">Steps</p>
                            <p className="text-sm font-semibold text-slate-100">{workflow.steps}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-300 mb-1">Runs</p>
                            <p className="text-sm font-semibold text-slate-100">{workflow.runsCount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-300 mb-1">Success Rate</p>
                            <p className="text-sm font-semibold text-green-400">{workflow.successRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-300 mb-1">Last Run</p>
                            <p className="text-sm font-semibold text-slate-100">{workflow.lastRun || 'Never'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          {workflow.triggers.map((trigger, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-blue-500/15 text-blue-300 text-xs rounded">
                              {trigger}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </Button>
                          {workflow.status === 'active' ? (
                            <Button size="sm" variant="outline" className="text-orange-400 hover:text-orange-300">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Pause
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="text-green-400 hover:text-green-300">
                              <Play className="w-4 h-4 mr-2" />
                              Activate
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Builder View */}
        {selectedView === 'builder' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Available Actions */}
            <div className="col-span-3">
              <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-100 mb-3">Available Actions</h3>
                  <div className="space-y-2">
                    {availableActions.map((action) => (
                      <div
                        key={action.id}
                        className="p-3 border border-white/10 rounded-lg hover:border-[#2855a6] hover:bg-blue-500/10 cursor-move transition-all"
                        draggable
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-2 bg-${action.color}-50 rounded`}>
                            <action.icon className={`w-4 h-4 text-${action.color}-600`} />
                          </div>
                          <span className="text-sm font-medium text-slate-100">{action.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <h4 className="font-semibold text-slate-100 text-sm mb-2">Triggers</h4>
                    <div className="space-y-2">
                      <div className="p-2 border border-white/10 rounded-lg hover:border-[#2855a6] hover:bg-blue-500/10 cursor-move text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date-based
                        </div>
                      </div>
                      <div className="p-2 border border-white/10 rounded-lg hover:border-[#2855a6] hover:bg-blue-500/10 cursor-move text-sm">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Job Status
                        </div>
                      </div>
                      <div className="p-2 border border-white/10 rounded-lg hover:border-[#2855a6] hover:bg-blue-500/10 cursor-move text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Document Upload
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Canvas - Workflow Steps */}
            <div className="col-span-9">
              <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <input
                      type="text"
                      placeholder="Workflow Name"
                      defaultValue="New Workflow"
                      className="text-xl font-bold text-slate-100 border-b-2 border-transparent hover:border-white/10 focus:border-[#2855a6] focus:outline-none px-2 py-1"
                    />
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                      <Button variant="outline" size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Play className="w-4 h-4 mr-2" />
                        Test Workflow
                      </Button>
                    </div>
                  </div>

                  {/* Example Workflow Steps */}
                  <div className="space-y-3">
                    {workflowSteps.map((step, index) => (
                      <div key={step.id}>
                        <div className={`p-4 border-2 rounded-lg ${getStepColor(step.type)}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="p-2 bg-white rounded border border-white/10">
                                <step.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="px-2 py-0.5 bg-white text-xs font-semibold rounded">
                                    {step.type.toUpperCase()}
                                  </span>
                                  <h4 className="font-semibold text-slate-100">{step.title}</h4>
                                </div>
                                <p className="text-sm text-slate-300">{step.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {index < workflowSteps.length - 1 && (
                          <div className="flex justify-center py-2">
                            <ChevronRight className="w-5 h-5 text-gray-400 rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add Step Button */}
                    <button className="w-full p-6 border-2 border-dashed border-white/10 rounded-lg hover:border-[#2855a6] hover:bg-blue-500/10 transition-all">
                      <Plus className="w-6 h-6 mx-auto text-gray-400" />
                      <p className="text-sm text-slate-300 mt-2">Drag an action here or click to add a step</p>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </WorkpaperLayout>
  );
}

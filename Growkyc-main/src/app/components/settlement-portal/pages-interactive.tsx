import React from 'react';
import {
  Plus,
  Eye,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../../lib/toast';
import {
  AddConditionModal,
  ViewConditionModal,
  CreatePEXAWorkspaceModal,
  AddTaskModal,
  ViewTaskModal,
  ViewPEXAWorkspaceModal
} from './modals';

// Test data
const testMatters = [
  {
    id: 'MAT-2024-1247',
    pexaWorkspaceId: 'WS-VIC-2024-8847',
    property: '123 Collins Street, Melbourne VIC 3000',
    pexaStatus: 'active',
    lastActivity: '15 min ago'
  },
  {
    id: 'MAT-2024-1246',
    pexaWorkspaceId: 'WS-NSW-2024-9124',
    property: '45 George Street, Sydney NSW 2000',
    pexaStatus: 'pending',
    lastActivity: '2 hours ago'
  },
  {
    id: 'MAT-2024-1245',
    pexaWorkspaceId: 'WS-QLD-2024-7456',
    property: '78 Queen Street, Brisbane QLD 4000',
    pexaStatus: 'ready_to_settle',
    lastActivity: '30 min ago'
  },
  {
    id: 'MAT-2024-1243',
    pexaWorkspaceId: 'WS-WA-2024-6234',
    property: '156 St Georges Terrace, Perth WA 6000',
    pexaStatus: 'active',
    lastActivity: '3 hours ago'
  }
];

// Conditions Page
export const ConditionsPage = () => {
  const [showAddCondition, setShowAddCondition] = React.useState(false);
  const [selectedCondition, setSelectedCondition] = React.useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Condition Register</h2>
        <Button onClick={() => setShowAddCondition(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Condition
        </Button>
      </div>

      {/* Condition Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { status: 'Not Started', count: 8, color: 'bg-white/5 text-slate-300' },
          { status: 'Evidence Uploaded', count: 12, color: 'bg-blue-500/15 text-blue-300' },
          { status: 'Under Review', count: 5, color: 'bg-purple-500/15 text-purple-300' },
          { status: 'Cleared', count: 42, color: 'bg-green-500/15 text-green-300' },
          { status: 'Rejected', count: 2, color: 'bg-red-500/15 text-red-300' }
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-slate-100">{stat.count}</p>
              <p className={`text-xs font-medium mt-1 px-2 py-1 rounded ${stat.color}`}>{stat.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Matter</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  { id: 'COND-1247-01', desc: 'Contract signed by all parties', matter: 'MAT-2024-1247', status: 'cleared', owner: 'Sarah Chen', due: '2024-03-10' },
                  { id: 'COND-1247-02', desc: 'Pest and building inspection', matter: 'MAT-2024-1247', status: 'evidence_uploaded', owner: 'John Smith', due: '2024-03-12' },
                  { id: 'COND-1246-01', desc: 'VOI for all borrowers', matter: 'MAT-2024-1246', status: 'rejected', owner: 'Lisa Wong', due: '2024-03-08' },
                  { id: 'COND-1245-01', desc: 'Finance approval', matter: 'MAT-2024-1245', status: 'cleared', owner: 'Mike Johnson', due: '2024-03-05' },
                  { id: 'COND-1244-01', desc: 'Title search', matter: 'MAT-2024-1244', status: 'escalated', owner: 'Emma Davis', due: '2024-03-01' }
                ].map((condition, idx) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-100">{condition.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-100">{condition.desc}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">{condition.matter}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        condition.status === 'cleared' ? 'bg-green-500/15 text-green-300' :
                        condition.status === 'evidence_uploaded' ? 'bg-blue-500/15 text-blue-300' :
                        condition.status === 'rejected' ? 'bg-red-500/15 text-red-300' :
                        'bg-amber-500/15 text-amber-300'
                      }`}>
                        {condition.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{condition.owner}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{condition.due}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedCondition(condition)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {condition.status !== 'cleared' && (
                          <Button size="sm" onClick={() => toast.success(`Condition ${condition.id} cleared`)}>
                            Clear
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AddConditionModal isOpen={showAddCondition} onClose={() => setShowAddCondition(false)} />
      <ViewConditionModal isOpen={!!selectedCondition} condition={selectedCondition} onClose={() => setSelectedCondition(null)} />
    </div>
  );
};

// PEXA Page
export const PEXAPage = () => {
  const [showCreateWorkspace, setShowCreateWorkspace] = React.useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">PEXA Workspaces</h2>
        <Button onClick={() => setShowCreateWorkspace(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Workspace
        </Button>
      </div>

      {/* PEXA Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-300 mb-2">Active Workspaces</p>
            <p className="text-3xl font-bold text-slate-100">28</p>
            <p className="text-xs text-slate-400 mt-1">Across 5 states</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-300 mb-2">Ready to Settle</p>
            <p className="text-3xl font-bold text-green-400">4</p>
            <p className="text-xs text-slate-400 mt-1">All conditions met</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-300 mb-2">Drift Warnings</p>
            <p className="text-3xl font-bold text-amber-400">3</p>
            <p className="text-xs text-slate-400 mt-1">Data mismatch</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-300 mb-2">Settled Today</p>
            <p className="text-3xl font-bold text-blue-400">2</p>
            <p className="text-xs text-slate-400 mt-1">Total: $2.1M</p>
          </CardContent>
        </Card>
      </div>

      {/* Workspace List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Workspace ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Matter</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Property</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Last Sync</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {testMatters.map((matter, idx) => (
                  <tr key={idx} className="hover:bg-white/5 cursor-pointer" onClick={() => setSelectedWorkspace({
                    id: matter.pexaWorkspaceId,
                    matter: matter.id,
                    property: matter.property,
                    status: matter.pexaStatus?.replace('_', ' ').toUpperCase()
                  })}>
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-blue-300">{matter.pexaWorkspaceId}</td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-300">{matter.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-100">{matter.property}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        matter.pexaStatus === 'ready_to_settle' ? 'bg-green-500/15 text-green-300' :
                        matter.pexaStatus === 'active' ? 'bg-blue-500/15 text-blue-300' :
                        'bg-amber-500/15 text-amber-300'
                      }`}>
                        {matter.pexaStatus?.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{matter.lastActivity}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); toast.success('Synced with PEXA'); }}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); toast.info('Open PEXA'); }}>
                          <ExternalLink className="w-4 h-4" />
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

      <CreatePEXAWorkspaceModal isOpen={showCreateWorkspace} onClose={() => setShowCreateWorkspace(false)} />
      <ViewPEXAWorkspaceModal isOpen={!!selectedWorkspace} workspace={selectedWorkspace} onClose={() => setSelectedWorkspace(null)} />
    </div>
  );
};

// Tasks Page
export const TasksPage = () => {
  const [showAddTask, setShowAddTask] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Tasks</h2>
        <Button onClick={() => setShowAddTask(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Kanban View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { status: 'To Do', count: 12, color: 'border-white/10' },
          { status: 'In Progress', count: 8, color: 'border-blue-500' },
          { status: 'Blocked', count: 3, color: 'border-red-500' },
          { status: 'Complete', count: 45, color: 'border-green-500' }
        ].map((column, idx) => (
          <Card key={idx} className={`border-t-4 ${column.color}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{column.status}</CardTitle>
                <span className="px-2 py-1 bg-white/5 text-slate-300 text-xs font-semibold rounded">
                  {column.count}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(Math.min(column.count, 3))].map((_, taskIdx) => {
                  const taskTitle = taskIdx === 0 && column.status === 'To Do' ? 'Verify ID documents' :
                                   taskIdx === 1 && column.status === 'To Do' ? 'Obtain contract signed' :
                                   taskIdx === 0 && column.status === 'In Progress' ? 'Review PEXA workspace' :
                                   taskIdx === 1 && column.status === 'In Progress' ? 'Prepare settlement statement' :
                                   taskIdx === 0 && column.status === 'Blocked' ? 'Missing VOI - escalated' :
                                   'Complete task';
                  
                  const task = {
                    title: taskTitle,
                    matter: `MAT-2024-${1247 - taskIdx}`,
                    status: column.status,
                    assignee: 'SC',
                    due: `2024-03-${15 + taskIdx}`
                  };

                  return (
                    <div key={taskIdx} className="p-3 bg-white border rounded-lg hover:shadow-md cursor-pointer transition-shadow" onClick={() => setSelectedTask(task)}>
                      <p className="font-semibold text-sm text-slate-100 mb-1">
                        {taskTitle}
                      </p>
                      <p className="text-xs text-slate-300 mb-2">{task.matter}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Due: {task.due}</span>
                        <div className="w-6 h-6 bg-blue-500/15 rounded-full flex items-center justify-center text-xs font-semibold text-blue-300">
                          SC
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddTaskModal isOpen={showAddTask} onClose={() => setShowAddTask(false)} />
      <ViewTaskModal isOpen={!!selectedTask} task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
};

// Export render functions
export const renderConditions = () => <ConditionsPage />;
export const renderPEXA = () => <PEXAPage />;
export const renderTasks = () => <TasksPage />;
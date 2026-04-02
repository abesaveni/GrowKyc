import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  DollarSign,
  TrendingUp,
  Play,
  Pause,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Upload,
  FileText,
  MessageSquare,
  Paperclip,
  Target,
  BarChart3,
  Activity
} from 'lucide-react';

interface ProjectsModuleProps {
  role: string;
}

export function ProjectsModule({ role }: ProjectsModuleProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'gantt'>('kanban');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const mockProjects = [
    {
      id: 'P-001',
      name: 'Website Redesign',
      client: 'TechCorp Solutions',
      status: 'in-progress',
      priority: 'high',
      progress: 65,
      budget: 45000,
      spent: 29250,
      startDate: '2024-01-15',
      dueDate: '2024-03-30',
      team: ['Jessica Martinez', 'Michael Brown', 'Sarah Wilson'],
      tasks: { total: 24, completed: 16, inProgress: 5, pending: 3 },
      tags: ['Design', 'Development']
    },
    {
      id: 'P-002',
      name: 'Mobile App Development',
      client: 'Innovate Labs',
      status: 'planning',
      priority: 'high',
      progress: 15,
      budget: 125000,
      spent: 18750,
      startDate: '2024-02-01',
      dueDate: '2024-06-30',
      team: ['Michael Brown', 'David Chen', 'Emily Rodriguez'],
      tasks: { total: 45, completed: 4, inProgress: 3, pending: 38 },
      tags: ['Mobile', 'iOS', 'Android']
    },
    {
      id: 'P-003',
      name: 'Marketing Campaign',
      client: 'Global Tech Inc',
      status: 'in-progress',
      priority: 'medium',
      progress: 45,
      budget: 28000,
      spent: 12600,
      startDate: '2024-01-20',
      dueDate: '2024-04-15',
      team: ['Sarah Wilson', 'Amanda Lopez'],
      tasks: { total: 18, completed: 8, inProgress: 6, pending: 4 },
      tags: ['Marketing', 'Content']
    },
    {
      id: 'P-004',
      name: 'CRM Integration',
      client: 'StartUp Co',
      status: 'on-hold',
      priority: 'low',
      progress: 30,
      budget: 35000,
      spent: 10500,
      startDate: '2024-01-10',
      dueDate: '2024-05-01',
      team: ['David Chen'],
      tasks: { total: 15, completed: 5, inProgress: 0, pending: 10 },
      tags: ['Integration', 'API']
    },
    {
      id: 'P-005',
      name: 'Data Migration',
      client: 'Enterprise Corp',
      status: 'completed',
      priority: 'high',
      progress: 100,
      budget: 75000,
      spent: 72500,
      startDate: '2023-11-01',
      dueDate: '2024-02-28',
      team: ['Jessica Martinez', 'Michael Brown', 'David Chen'],
      tasks: { total: 32, completed: 32, inProgress: 0, pending: 0 },
      tags: ['Data', 'Migration']
    }
  ];

  if (viewMode === 'kanban') {
    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Manage projects with Kanban, Gantt, and time tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setViewMode('list')}>
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button variant="outline" onClick={() => setViewMode('gantt')}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Timeline
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <FolderKanban className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {mockProjects.filter(p => p.status === 'in-progress').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Currently running</p>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${(mockProjects.reduce((sum, p) => sum + p.budget, 0) / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-gray-500 mt-1">Across all projects</p>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <Activity className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Completion rate</p>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {mockProjects.filter(p => p.status === 'completed').length}
            </p>
            <p className="text-xs text-green-600 mt-1">This quarter</p>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { id: 'planning', label: 'Planning', color: 'blue' },
            { id: 'in-progress', label: 'In Progress', color: 'purple' },
            { id: 'on-hold', label: 'On Hold', color: 'orange' },
            { id: 'completed', label: 'Completed', color: 'green' }
          ].map((column) => {
            const columnProjects = mockProjects.filter(p => p.status === column.id);
            
            return (
              <div key={column.id} className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{column.label}</h3>
                  <span className="px-2 py-1 bg-white rounded-full text-xs font-semibold text-gray-700">
                    {columnProjects.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {columnProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="bg-white border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      {/* Priority Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          project.priority === 'high' ? 'bg-red-100 text-red-800' :
                          project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {project.priority}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Project Name & Client */}
                      <div className="mb-3">
                        <p className="font-semibold text-gray-900 mb-1">{project.name}</p>
                        <p className="text-xs text-gray-600">{project.client}</p>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs font-semibold text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${
                              project.progress === 100 ? 'bg-green-600' :
                              project.progress >= 50 ? 'bg-blue-600' : 'bg-orange-600'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Tasks Summary */}
                      <div className="flex items-center gap-4 mb-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>{project.tasks.completed}/{project.tasks.total}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{project.tasks.inProgress} active</span>
                        </div>
                      </div>

                      {/* Budget */}
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                        <span className="text-xs text-gray-600">Budget</span>
                        <span className="text-sm font-semibold text-gray-900">
                          ${(project.spent / 1000).toFixed(0)}K / ${(project.budget / 1000).toFixed(0)}K
                        </span>
                      </div>

                      {/* Team */}
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {project.team.slice(0, 3).map((member, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center"
                            >
                              <span className="text-xs font-semibold text-indigo-600">
                                {member.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          ))}
                          {project.team.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-600">
                                +{project.team.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{project.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage projects with Kanban, Gantt, and time tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setViewMode('kanban')}>
            <LayoutGrid className="w-4 h-4 mr-2" />
            Kanban
          </Button>
          <Button variant="outline" onClick={() => setViewMode('gantt')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Timeline
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search projects..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Budget</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Team</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockProjects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{project.name}</p>
                    <p className="text-xs text-gray-500">{project.id}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">{project.client}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'on-hold' ? 'bg-orange-100 text-orange-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {project.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${
                          project.progress === 100 ? 'bg-green-600' :
                          project.progress >= 50 ? 'bg-blue-600' : 'bg-orange-600'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{project.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900">
                    ${(project.spent / 1000).toFixed(0)}K / ${(project.budget / 1000).toFixed(0)}K
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">{project.dueDate}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center"
                      >
                        <span className="text-xs font-semibold text-indigo-600">
                          {member.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Project Detail Modal
function ProjectDetailModal({ project, onClose }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'files' | 'team'>('overview');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-300 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
            <p className="text-sm text-gray-600">{project.client}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-300 flex">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'tasks', label: 'Tasks' },
            { id: 'files', label: 'Files' },
            { id: 'team', label: 'Team' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700 mb-1">Progress</p>
                  <p className="text-3xl font-bold text-blue-900">{project.progress}%</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 mb-1">Budget Used</p>
                  <p className="text-3xl font-bold text-green-900">
                    {Math.round((project.spent / project.budget) * 100)}%
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-700 mb-1">Tasks Done</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {project.tasks.completed}/{project.tasks.total}
                  </p>
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Project Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Start Date</span>
                      <span className="text-sm font-medium text-gray-900">{project.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Due Date</span>
                      <span className="text-sm font-medium text-gray-900">{project.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Priority</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        project.priority === 'high' ? 'bg-red-100 text-red-800' :
                        project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {project.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="text-sm font-medium text-gray-900">
                        {project.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Budget Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Budget</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${project.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Spent</span>
                      <span className="text-sm font-medium text-gray-900">
                        ${project.spent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Remaining</span>
                      <span className="text-sm font-medium text-green-600">
                        ${(project.budget - project.spent).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${(project.spent / project.budget) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Project Tasks</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Design homepage mockups', status: 'completed', assignee: 'Jessica' },
                  { name: 'Develop responsive layout', status: 'in-progress', assignee: 'Michael' },
                  { name: 'Set up CMS integration', status: 'in-progress', assignee: 'David' },
                  { name: 'Content migration', status: 'pending', assignee: 'Sarah' },
                  { name: 'QA testing', status: 'pending', assignee: 'Amanda' }
                ].map((task, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={task.status === 'completed'} className="rounded" />
                      <span className={`text-sm ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                      <span className="text-xs text-gray-600">{task.assignee}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Team Members</h3>
              <div className="space-y-3">
                {project.team.map((member: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-indigo-600">
                          {member.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member}</p>
                        <p className="text-xs text-gray-500">Team Member</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-300 p-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

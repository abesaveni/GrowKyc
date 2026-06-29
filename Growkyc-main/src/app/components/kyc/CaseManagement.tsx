import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Paperclip,
  MessageSquare,
  Scale,
  Shield,
  TrendingUp,
  Download,
  Send,
  X,
  Upload,
  ChevronRight,
  Edit,
  Trash2,
  Lock
} from 'lucide-react';

interface Case {
  id: string;
  caseNumber: string;
  title: string;
  type: 'initial_cdd' | 'enhanced_cdd' | 'monitoring_review' | 'smr_assessment' | 'offboarding' | 'personnel_review' | 'program_change';
  client: string;
  clientId?: string;
  status: 'open' | 'in_progress' | 'pending_approval' | 'approved' | 'rejected' | 'closed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  triggerSource: string;
  riskLevel: 'low' | 'medium' | 'high';
  lastActivity: string;
  evidenceCount: number;
  notesCount: number;
}

interface CaseManagementProps {
  onViewCase?: (caseId: string) => void;
}

export function CaseManagement({ onViewCase }: CaseManagementProps = {}) {
  const [view, setView] = useState<'list' | 'detail' | 'create'>('list');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const cases: Case[] = [
    {
      id: '1',
      caseNumber: 'CASE-2024-001',
      title: 'Enhanced CDD Required - Apex Holdings',
      type: 'enhanced_cdd',
      client: 'Apex Holdings Pty Ltd',
      clientId: 'C001',
      status: 'in_progress',
      priority: 'critical',
      assignedTo: 'John Smith',
      createdDate: '2024-02-18',
      dueDate: '2024-02-25',
      triggerSource: 'Sanctions Alert',
      riskLevel: 'high',
      lastActivity: '2 hours ago',
      evidenceCount: 5,
      notesCount: 8
    },
    {
      id: '2',
      caseNumber: 'CASE-2024-002',
      title: 'SMR Assessment - Global Trade Corp',
      type: 'smr_assessment',
      client: 'Global Trade Corp',
      clientId: 'C045',
      status: 'pending_approval',
      priority: 'critical',
      assignedTo: 'Jane Williams',
      createdDate: '2024-02-17',
      dueDate: '2024-02-20',
      triggerSource: 'Adverse Media Alert',
      riskLevel: 'high',
      lastActivity: '1 day ago',
      evidenceCount: 12,
      notesCount: 15
    },
    {
      id: '3',
      caseNumber: 'CASE-2024-003',
      title: 'Monitoring Review - Sarah Mitchell',
      type: 'monitoring_review',
      client: 'Sarah Mitchell',
      clientId: 'C023',
      status: 'in_progress',
      priority: 'high',
      assignedTo: 'John Smith',
      createdDate: '2024-02-16',
      dueDate: '2024-02-23',
      triggerSource: 'PEP Status Change',
      riskLevel: 'medium',
      lastActivity: '5 hours ago',
      evidenceCount: 3,
      notesCount: 4
    },
    {
      id: '4',
      caseNumber: 'CASE-2024-004',
      title: 'Initial CDD - Tech Innovations Ltd',
      type: 'initial_cdd',
      client: 'Tech Innovations Ltd',
      clientId: 'C112',
      status: 'approved',
      priority: 'medium',
      assignedTo: 'Mark Brown',
      createdDate: '2024-02-15',
      dueDate: '2024-02-22',
      triggerSource: 'New Client Onboarding',
      riskLevel: 'low',
      lastActivity: '2 days ago',
      evidenceCount: 6,
      notesCount: 3
    },
    {
      id: '5',
      caseNumber: 'CASE-2024-005',
      title: 'Personnel Review - New AML Officer',
      type: 'personnel_review',
      client: 'Internal - Emma Davis',
      status: 'open',
      priority: 'high',
      assignedTo: 'Senior Manager',
      createdDate: '2024-02-14',
      dueDate: '2024-02-21',
      triggerSource: 'New Role Appointment',
      riskLevel: 'medium',
      lastActivity: '3 days ago',
      evidenceCount: 4,
      notesCount: 2
    },
    {
      id: '6',
      caseNumber: 'CASE-2024-006',
      title: 'Client Offboarding - High Risk Entity',
      type: 'offboarding',
      client: 'Risk Ventures Group',
      clientId: 'C089',
      status: 'in_progress',
      priority: 'medium',
      assignedTo: 'Jane Williams',
      createdDate: '2024-02-13',
      dueDate: '2024-02-27',
      triggerSource: 'Risk Appetite Exceeded',
      riskLevel: 'high',
      lastActivity: '1 day ago',
      evidenceCount: 8,
      notesCount: 10
    }
  ];

  const caseTypeLabels: Record<string, string> = {
    initial_cdd: 'Initial CDD',
    enhanced_cdd: 'Enhanced CDD',
    monitoring_review: 'Monitoring Review',
    smr_assessment: 'SMR Assessment',
    offboarding: 'Offboarding',
    personnel_review: 'Personnel Review',
    program_change: 'Program Change'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700';
      case 'pending_approval': return 'bg-orange-100 text-orange-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredCases = cases.filter(c => {
    if (filterType !== 'all' && c.type !== filterType) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !c.client.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    open: cases.filter(c => c.status === 'open' || c.status === 'in_progress').length,
    critical: cases.filter(c => c.priority === 'critical').length,
    pending: cases.filter(c => c.status === 'pending_approval').length,
    overdue: cases.filter(c => new Date(c.dueDate) < new Date() && c.status !== 'closed' && c.status !== 'approved').length
  };

  if (view === 'create') {
    return <CreateCaseWizard onClose={() => setView('list')} />;
  }

  if (view === 'detail' && selectedCase) {
    return <CaseDetailView case={selectedCase} onClose={() => { setView('list'); setSelectedCase(null); }} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Case Management</h1>
          <p className="text-gray-600 mt-1">Manage AML/CTF compliance cases and investigations</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setView('create')}>
          <Plus className="w-4 h-4 mr-2" />
          New Case
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">{stats.open}</span>
          </div>
          <p className="text-sm text-gray-600">Active Cases</p>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-3xl font-bold text-red-600">{stats.critical}</span>
          </div>
          <p className="text-sm text-gray-600">Critical Priority</p>
        </div>
        <div className="bg-white rounded-lg border border-orange-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
            <span className="text-3xl font-bold text-orange-600">{stats.pending}</span>
          </div>
          <p className="text-sm text-gray-600">Pending Approval</p>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-red-600" />
            <span className="text-3xl font-bold text-red-600">{stats.overdue}</span>
          </div>
          <p className="text-sm text-gray-600">Overdue</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases by title, client, or case number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="initial_cdd">Initial CDD</option>
              <option value="enhanced_cdd">Enhanced CDD</option>
              <option value="monitoring_review">Monitoring Review</option>
              <option value="smr_assessment">SMR Assessment</option>
              <option value="offboarding">Offboarding</option>
              <option value="personnel_review">Personnel Review</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-4 font-semibold text-gray-900">Case</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-900">Type</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-900">Client</th>
              <th className="text-center py-4 px-4 font-semibold text-gray-900">Priority</th>
              <th className="text-center py-4 px-4 font-semibold text-gray-900">Risk</th>
              <th className="text-center py-4 px-4 font-semibold text-gray-900">Status</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-900">Assigned To</th>
              <th className="text-center py-4 px-4 font-semibold text-gray-900">Due Date</th>
              <th className="text-center py-4 px-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((caseItem) => {
              const isOverdue = new Date(caseItem.dueDate) < new Date() && 
                              caseItem.status !== 'closed' && 
                              caseItem.status !== 'approved';
              
              return (
                <tr key={caseItem.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-gray-900">{caseItem.caseNumber}</p>
                      <p className="text-sm text-gray-600">{caseItem.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Paperclip className="w-3 h-3 mr-1" />
                          {caseItem.evidenceCount}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {caseItem.notesCount}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                      {caseTypeLabels[caseItem.type]}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-gray-900">{caseItem.client}</p>
                    {caseItem.clientId && (
                      <p className="text-xs text-gray-600">{caseItem.clientId}</p>
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center">
                      <AlertTriangle className={`w-5 h-5 ${getPriorityColor(caseItem.priority)}`} />
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(caseItem.riskLevel)}`}>
                      {caseItem.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">{caseItem.assignedTo}</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <p className={`text-sm font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                      {new Date(caseItem.dueDate).toLocaleDateString()}
                    </p>
                    {isOverdue && (
                      <p className="text-xs text-red-600">OVERDUE</p>
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (onViewCase) {
                          // If parent component wants to handle case viewing
                          onViewCase(caseItem.id);
                        } else {
                          // Otherwise handle it locally
                          setSelectedCase(caseItem);
                          setView('detail');
                        }
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredCases.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Cases Found</h3>
          <p className="text-gray-600 mb-6">No cases match your current filters.</p>
          <Button onClick={() => { setFilterType('all'); setFilterStatus('all'); setSearchQuery(''); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

function CreateCaseWizard({ onClose }: { onClose: () => void }) {
  const [caseType, setCaseType] = useState('');
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [priority, setPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('medium');
  const [description, setDescription] = useState('');
  const [assignTo, setAssignTo] = useState('');

  const caseTypes = [
    { id: 'initial_cdd', label: 'Initial CDD', icon: User, description: 'New client due diligence' },
    { id: 'enhanced_cdd', label: 'Enhanced CDD', icon: Shield, description: 'High-risk client assessment' },
    { id: 'monitoring_review', label: 'Monitoring Review', icon: TrendingUp, description: 'Ongoing monitoring investigation' },
    { id: 'smr_assessment', label: 'SMR Assessment', icon: AlertTriangle, description: 'Suspicious matter investigation' },
    { id: 'offboarding', label: 'Offboarding', icon: X, description: 'Client relationship termination' },
    { id: 'personnel_review', label: 'Personnel Review', icon: User, description: 'Staff due diligence' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Case</h1>
          <p className="text-gray-600 mt-1">Start a new compliance case</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      {/* Case Type Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Select Case Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {caseTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setCaseType(type.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                  caseType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 ${caseType === type.id ? 'text-blue-600' : 'text-gray-600'}`} />
                <h4 className="font-bold text-gray-900 text-sm mb-1">{type.label}</h4>
                <p className="text-xs text-gray-600">{type.description}</p>
                {caseType === type.id && (
                  <CheckCircle className="w-5 h-5 text-blue-600 absolute top-3 right-3" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Case Details */}
      {caseType && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="font-bold text-gray-900 mb-4">Case Details</h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Case Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the case"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Client/Entity *</label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search for client..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Priority Level *</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Assign To *</label>
            <select
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select staff member...</option>
              <option value="john">John Smith - AML Officer</option>
              <option value="jane">Jane Williams - Compliance Manager</option>
              <option value="mark">Mark Brown - Senior Analyst</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed description of the case, trigger source, and initial findings..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Case
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function CaseDetailView({ case: caseData, onClose }: { case: Case; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'notes' | 'timeline' | 'risk'>('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{caseData.caseNumber}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              caseData.status === 'open' ? 'bg-blue-100 text-blue-700' :
              caseData.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
              caseData.status === 'pending_approval' ? 'bg-orange-100 text-orange-700' :
              caseData.status === 'approved' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {caseData.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-gray-600">{caseData.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Case
          </Button>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </div>

      {/* Case Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Client</p>
          <p className="font-bold text-gray-900">{caseData.client}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Priority</p>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${
              caseData.priority === 'critical' ? 'text-red-600' :
              caseData.priority === 'high' ? 'text-orange-600' :
              caseData.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
            }`} />
            <span className="font-bold text-gray-900 capitalize">{caseData.priority}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Due Date</p>
          <p className="font-bold text-gray-900">{new Date(caseData.dueDate).toLocaleDateString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Assigned To</p>
          <p className="font-bold text-gray-900">{caseData.assignedTo}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'evidence', label: `Evidence (${caseData.evidenceCount})`, icon: Paperclip },
            { id: 'notes', label: `Notes (${caseData.notesCount})`, icon: MessageSquare },
            { id: 'timeline', label: 'Timeline', icon: Clock },
            { id: 'risk', label: 'Risk Assessment', icon: Scale }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Case Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Case Type</p>
                  <p className="font-semibold text-gray-900">Enhanced CDD</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trigger Source</p>
                  <p className="font-semibold text-gray-900">{caseData.triggerSource}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created Date</p>
                  <p className="font-semibold text-gray-900">{new Date(caseData.createdDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Risk Level</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                    caseData.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                    caseData.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {caseData.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700">
                Enhanced customer due diligence required following sanctions alert on beneficial owner. 
                Potential match detected through GreenID monitoring service. Requires investigation of 
                beneficial ownership structure, source of funds verification, and senior manager approval 
                before client can continue to be serviced.
              </p>
            </div>

            <div className="pt-6 border-t">
              <h3 className="font-bold text-gray-900 mb-3">Required Actions</h3>
              <div className="space-y-2">
                {[
                  { task: 'Verify beneficial ownership structure', status: 'complete' },
                  { task: 'Request source of funds documentation', status: 'complete' },
                  { task: 'Conduct enhanced screening checks', status: 'in_progress' },
                  { task: 'Prepare enhanced CDD report', status: 'pending' },
                  { task: 'Obtain senior manager approval', status: 'pending' }
                ].map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{action.task}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      action.status === 'complete' ? 'bg-green-100 text-green-700' :
                      action.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {action.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Case
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Update Status
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Evidence Documents</h3>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Upload Evidence
              </Button>
            </div>
            {[
              { name: 'GreenID_Verification_Report.pdf', type: 'Verification Report', date: '2024-02-18', size: '2.4 MB' },
              { name: 'Beneficial_Ownership_Structure.pdf', type: 'Ownership Documentation', date: '2024-02-18', size: '1.8 MB' },
              { name: 'Source_of_Funds_Statement.pdf', type: 'Financial Documentation', date: '2024-02-17', size: '3.2 MB' },
              { name: 'Enhanced_Screening_Results.pdf', type: 'Screening Report', date: '2024-02-17', size: '1.5 MB' },
              { name: 'Client_Interview_Notes.docx', type: 'Interview Notes', date: '2024-02-16', size: '245 KB' }
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-600">{doc.type} • {doc.size} • {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Case Notes</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </div>
            {[
              { author: 'John Smith', date: '2024-02-18 14:30', note: 'Contacted client for additional documentation. Awaiting response.' },
              { author: 'John Smith', date: '2024-02-17 16:45', note: 'Completed enhanced screening through InfoTrack. No additional adverse findings.' },
              { author: 'Jane Williams', date: '2024-02-17 10:20', note: 'Senior Manager approval will be required before case closure.' }
            ].map((note, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-900">{note.author}</span>
                  </div>
                  <span className="text-sm text-gray-600">{note.date}</span>
                </div>
                <p className="text-gray-700">{note.note}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 mb-4">Case Timeline</h3>
            {[
              { date: '2024-02-18 14:30', event: 'Case updated', user: 'John Smith', description: 'Status changed to In Progress' },
              { date: '2024-02-18 09:15', event: 'Evidence uploaded', user: 'John Smith', description: 'GreenID Verification Report added' },
              { date: '2024-02-17 16:45', event: 'Note added', user: 'John Smith', description: 'Enhanced screening completed' },
              { date: '2024-02-17 10:20', event: 'Case assigned', user: 'System', description: 'Assigned to John Smith' },
              { date: '2024-02-17 10:15', event: 'Case created', user: 'System', description: 'Triggered by Sanctions Alert' }
            ].map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  {index < 4 && <div className="w-0.5 h-16 bg-gray-300" />}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900">{event.event}</p>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <p className="text-xs text-gray-500 mt-1">by {event.user}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
              <Scale className="w-16 h-16 text-red-600 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-red-900 mb-2">HIGH RISK</h3>
              <p className="text-red-700">Enhanced due diligence required</p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3">Risk Factors</h4>
              <div className="space-y-2">
                {[
                  'Potential sanctions match on beneficial owner',
                  'Complex ownership structure with offshore entities',
                  'Cash-intensive business operations',
                  'Recent changes in beneficial ownership'
                ].map((factor, index) => (
                  <div key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3">Mitigation Measures</h4>
              <div className="space-y-2">
                {[
                  'Enhanced CDD procedures implemented',
                  'Source of wealth verification completed',
                  'Senior manager approval obtained',
                  'Increased monitoring frequency (quarterly reviews)'
                ].map((measure, index) => (
                  <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900">{measure}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
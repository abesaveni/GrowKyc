import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Clock,
  User,
  FileText,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react';

type ActionType = 'create' | 'update' | 'delete' | 'view' | 'approve' | 'reject' | 'submit' | 'export';
type EntityType = 'client' | 'document' | 'report' | 'screening' | 'review' | 'risk-assessment' | 'user' | 'setting';

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  userRole: string;
  action: ActionType;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  details: string;
  ipAddress: string;
  changes?: { field: string; oldValue: string; newValue: string }[];
}

export function AuditTrailModule() {
  const [activeTab, setActiveTab] = useState<'recent' | 'users' | 'clients' | 'compliance' | 'security'>('recent');
  const [auditLogs] = useState<AuditLog[]>([
    {
      id: 'AUD-2024-001',
      timestamp: new Date('2024-02-19T14:35:22'),
      user: 'Emma Wilson',
      userRole: 'Compliance Officer',
      action: 'approve',
      entityType: 'review',
      entityId: 'REV-2024-001',
      entityName: 'TechCorp Pty Ltd - Annual Review',
      details: 'Approved annual CDD review',
      ipAddress: '203.45.67.89',
      changes: [
        { field: 'Status', oldValue: 'Pending Review', newValue: 'Approved' },
        { field: 'Approved By', oldValue: '', newValue: 'Emma Wilson' },
        { field: 'Approval Date', oldValue: '', newValue: '2024-02-19' }
      ]
    },
    {
      id: 'AUD-2024-002',
      timestamp: new Date('2024-02-19T14:28:15'),
      user: 'Michael Chen',
      userRole: 'Client Manager',
      action: 'create',
      entityType: 'client',
      entityId: 'C-2024-089',
      entityName: 'Tech Innovations Ltd',
      details: 'New client onboarding initiated',
      ipAddress: '203.45.67.90'
    },
    {
      id: 'AUD-2024-003',
      timestamp: new Date('2024-02-19T13:45:08'),
      user: 'Lisa Martinez',
      userRole: 'Compliance Officer',
      action: 'submit',
      entityType: 'report',
      entityId: 'SMR-2024-001',
      entityName: 'Suspicious Matter Report - Global Trading Ltd',
      details: 'Submitted SMR to AUSTRAC',
      ipAddress: '203.45.67.91'
    },
    {
      id: 'AUD-2024-004',
      timestamp: new Date('2024-02-19T12:20:45'),
      user: 'AI Compliance Copilot',
      userRole: 'System',
      action: 'create',
      entityType: 'screening',
      entityId: 'SCR-2024-045',
      entityName: 'Automated PEP/Sanctions Screening',
      details: 'Batch re-screening of 247 clients completed',
      ipAddress: 'System'
    },
    {
      id: 'AUD-2024-005',
      timestamp: new Date('2024-02-19T11:15:30'),
      user: 'Emma Wilson',
      userRole: 'Compliance Officer',
      action: 'update',
      entityType: 'risk-assessment',
      entityId: 'RISK-2024-012',
      entityName: 'Melbourne Family Trust - Risk Assessment',
      details: 'Updated risk tier from Medium to High',
      ipAddress: '203.45.67.89',
      changes: [
        { field: 'Risk Tier', oldValue: 'Medium', newValue: 'High' },
        { field: 'Risk Score', oldValue: '45', newValue: '68' },
        { field: 'Reason', oldValue: '', newValue: 'PEP match detected' }
      ]
    },
    {
      id: 'AUD-2024-006',
      timestamp: new Date('2024-02-19T10:05:12'),
      user: 'System',
      userRole: 'System',
      action: 'create',
      entityType: 'document',
      entityId: 'DOC-2024-234',
      entityName: 'Client ID Document Upload',
      details: 'Client portal: New documents uploaded by John Smith',
      ipAddress: '203.45.67.100'
    },
    {
      id: 'AUD-2024-007',
      timestamp: new Date('2024-02-19T09:30:45'),
      user: 'Michael Chen',
      userRole: 'Client Manager',
      action: 'view',
      entityType: 'client',
      entityId: 'C-2024-023',
      entityName: 'ABC Corporation',
      details: 'Viewed client profile',
      ipAddress: '203.45.67.90'
    },
    {
      id: 'AUD-2024-008',
      timestamp: new Date('2024-02-18T16:45:00'),
      user: 'Sarah Johnson',
      userRole: 'Admin',
      action: 'update',
      entityType: 'user',
      entityId: 'USR-025',
      entityName: 'Lisa Martinez',
      details: 'Updated user permissions',
      ipAddress: '203.45.67.92',
      changes: [
        { field: 'Role', oldValue: 'Client Manager', newValue: 'Compliance Officer' },
        { field: 'Permissions', oldValue: 'Standard', newValue: 'Advanced + SMR Submit' }
      ]
    }
  ]);

  const getActionIcon = (action: ActionType) => {
    switch (action) {
      case 'create': return <FileText className="w-5 h-5 text-green-600" />;
      case 'update': return <Edit className="w-5 h-5 text-blue-600" />;
      case 'delete': return <Trash2 className="w-5 h-5 text-red-600" />;
      case 'view': return <Eye className="w-5 h-5 text-gray-600" />;
      case 'approve': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'reject': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'submit': return <Shield className="w-5 h-5 text-purple-600" />;
      case 'export': return <Download className="w-5 h-5 text-blue-600" />;
    }
  };

  const getActionColor = (action: ActionType) => {
    switch (action) {
      case 'create': return 'green';
      case 'update': return 'blue';
      case 'delete': return 'red';
      case 'view': return 'gray';
      case 'approve': return 'green';
      case 'reject': return 'red';
      case 'submit': return 'purple';
      case 'export': return 'blue';
    }
  };

  const stats = {
    totalLogs: 2847,
    logsToday: 156,
    uniqueUsers: 12,
    criticalActions: 8,
    systemActions: 487,
    avgLogsPerDay: 145
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Clock className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Audit Trail</h1>
              <p className="text-xl text-gray-300">Complete Activity Log & System Audit</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-gray-800 hover:bg-gray-100">
              <Download className="w-5 h-5 mr-2" />
              Export Logs
            </Button>
            <Button className="bg-white text-gray-800 hover:bg-gray-100">
              <Filter className="w-5 h-5 mr-2" />
              Advanced Filter
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-6 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Total Logs</h3>
              <FileText className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.totalLogs.toLocaleString()}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Today</h3>
              <Activity className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-green-300">{stats.logsToday}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Active Users</h3>
              <User className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.uniqueUsers}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Critical</h3>
              <AlertTriangle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-orange-300">{stats.criticalActions}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">AI/System</h3>
              <Shield className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-blue-300">{stats.systemActions}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Avg/Day</h3>
              <Clock className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.avgLogsPerDay}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          {[
            { id: 'recent', label: 'Recent Activity', icon: Clock },
            { id: 'users', label: 'User Actions', icon: User },
            { id: 'clients', label: 'Client Changes', icon: FileText },
            { id: 'compliance', label: 'Compliance Events', icon: Shield },
            { id: 'security', label: 'Security Log', icon: AlertTriangle }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-gray-800 text-gray-800'
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

      {/* Search & Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit logs by user, action, entity..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All Actions</option>
              <option>Create</option>
              <option>Update</option>
              <option>Delete</option>
              <option>Approve</option>
              <option>Submit</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All Users</option>
              <option>Emma Wilson</option>
              <option>Michael Chen</option>
              <option>Lisa Martinez</option>
              <option>System</option>
            </select>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </div>
      </div>

      {/* Audit Log Entries */}
      <div className="space-y-3">
        {auditLogs.map((log) => (
          <div key={log.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getActionIcon(log.action)}
                  <span className={`px-3 py-1 bg-${getActionColor(log.action)}-100 text-${getActionColor(log.action)}-700 text-sm font-bold rounded-full`}>
                    {log.action.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                    {log.entityType.toUpperCase().replace('-', ' ')}
                  </span>
                  <span className="text-sm text-gray-600">{log.timestamp.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-900">{log.user}</span>
                    <span className="text-sm text-gray-600">({log.userRole})</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">ID: {log.id}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">IP: {log.ipAddress}</span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg mb-3">
                  <p className="font-semibold text-gray-900 mb-1">{log.entityName}</p>
                  <p className="text-sm text-gray-700">{log.details}</p>
                  <p className="text-xs text-gray-600 mt-1">Entity ID: {log.entityId}</p>
                </div>

                {log.changes && log.changes.length > 0 && (
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="font-semibold text-blue-900 mb-2">Changes Made:</p>
                    <div className="space-y-2">
                      {log.changes.map((change, index) => (
                        <div key={index} className="flex items-center gap-4 text-sm">
                          <span className="font-semibold text-gray-900 min-w-[120px]">{change.field}:</span>
                          <span className="text-red-600">
                            {change.oldValue || <em className="text-gray-500">(empty)</em>}
                          </span>
                          <span className="text-gray-600">→</span>
                          <span className="text-green-600 font-semibold">{change.newValue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="ml-6">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Retention Notice */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Audit Trail Retention Policy</h3>
            <p className="text-sm text-blue-800 mb-2">
              In compliance with AUSTRAC requirements, all audit logs are retained for:
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>7 years</strong> for compliance-related events (client onboarding, reviews, reports)</li>
              <li>• <strong>3 years</strong> for operational activities (document uploads, profile views)</li>
              <li>• <strong>Immutable storage</strong> - logs cannot be modified or deleted</li>
              <li>• <strong>Encrypted at rest</strong> with secure off-site backup</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

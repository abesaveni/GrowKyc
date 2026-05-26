import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Lock,
  TrendingUp,
  User,
  Calendar,
  Filter,
  Download,
  ChevronRight,
  Clock
} from 'lucide-react';

interface MonitoringAlert {
  id: string;
  clientId: string;
  clientName: string;
  alertType: string;
  source: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  riskDelta: string;
  status: 'pending' | 'under_review' | 'escalated' | 'closed' | 'false_positive';
  assignedTo: string;
  timestamp: string;
  description: string;
  confidence: number;
  linkedParties?: string[];
}

export function MonitoringModule() {
  const [selectedAlert, setSelectedAlert] = useState<MonitoringAlert | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const alerts: MonitoringAlert[] = [
    {
      id: '1',
      clientId: 'C001',
      clientName: 'Apex Holdings Pty Ltd',
      alertType: 'Sanctions Match',
      source: 'GreenID',
      severity: 'critical',
      riskDelta: '+3 levels',
      status: 'pending',
      assignedTo: 'Unassigned',
      timestamp: '2024-02-18T14:30:00',
      description: 'Potential sanctions match detected on beneficial owner Michael Anderson',
      confidence: 87,
      linkedParties: ['Michael Anderson', 'Anderson Trust']
    },
    {
      id: '2',
      clientId: 'C023',
      clientName: 'Sarah Mitchell',
      alertType: 'PEP Status Change',
      source: 'Credit Watch',
      severity: 'high',
      riskDelta: '+1 level',
      status: 'under_review',
      assignedTo: 'John Smith',
      timestamp: '2024-02-18T09:15:00',
      description: 'Client appointed to government advisory board position',
      confidence: 95,
      linkedParties: []
    },
    {
      id: '3',
      clientId: 'C045',
      clientName: 'Global Trade Corp',
      alertType: 'Adverse Media',
      source: 'Manual',
      severity: 'high',
      riskDelta: '+2 levels',
      status: 'escalated',
      assignedTo: 'Jane Williams',
      timestamp: '2024-02-17T16:45:00',
      description: 'Negative media coverage regarding tax evasion allegations',
      confidence: 78,
      linkedParties: ['Director - James Chen']
    },
    {
      id: '4',
      clientId: 'C087',
      clientName: 'Melbourne Property Trust',
      alertType: 'Ownership Change',
      source: 'ASIC',
      severity: 'medium',
      riskDelta: '+1 level',
      status: 'pending',
      assignedTo: 'Unassigned',
      timestamp: '2024-02-17T11:20:00',
      description: 'Change in beneficial ownership structure - new 30% shareholder',
      confidence: 100,
      linkedParties: ['New Shareholder - David Lee']
    },
    {
      id: '5',
      clientId: 'C112',
      clientName: 'Tech Innovations Ltd',
      alertType: 'High Value Transaction',
      source: 'Internal',
      severity: 'low',
      riskDelta: 'No change',
      status: 'closed',
      assignedTo: 'Mark Brown',
      timestamp: '2024-02-16T14:00:00',
      description: 'Single transaction over $50,000 threshold',
      confidence: 100,
      linkedParties: []
    },
    {
      id: '6',
      clientId: 'C156',
      clientName: 'Investment Holdings Group',
      alertType: 'Country Risk Alert',
      source: 'InfoTrack',
      severity: 'medium',
      riskDelta: '+1 level',
      status: 'under_review',
      assignedTo: 'John Smith',
      timestamp: '2024-02-16T10:30:00',
      description: 'New business operations in high-risk jurisdiction',
      confidence: 92,
      linkedParties: []
    },
    {
      id: '7',
      clientId: 'C201',
      clientName: 'Capital Partners LLC',
      alertType: 'Credit Default',
      source: 'Credit Watch',
      severity: 'medium',
      riskDelta: '+1 level',
      status: 'false_positive',
      assignedTo: 'Jane Williams',
      timestamp: '2024-02-15T15:45:00',
      description: 'Credit default recorded - verified as clerical error',
      confidence: 100,
      linkedParties: []
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'under_review': return 'bg-blue-100 text-blue-700';
      case 'escalated': return 'bg-red-100 text-red-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      case 'false_positive': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && alert.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    pending: alerts.filter(a => a.status === 'pending').length,
    escalated: alerts.filter(a => a.status === 'escalated').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitoring & Alerts</h1>
          <p className="text-gray-600 mt-1">Ongoing customer due diligence and risk monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Create Manual Alert
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Bell className="w-8 h-8 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600">Total Alerts</p>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-3xl font-bold text-red-600">{stats.critical}</span>
          </div>
          <p className="text-sm text-gray-600">Critical</p>
        </div>
        <div className="bg-white rounded-lg border border-orange-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-600" />
            <span className="text-3xl font-bold text-orange-600">{stats.pending}</span>
          </div>
          <p className="text-sm text-gray-600">Pending Review</p>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-red-600" />
            <span className="text-3xl font-bold text-red-600">{stats.escalated}</span>
          </div>
          <p className="text-sm text-gray-600">Escalated</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Filters:</span>
          </div>
          <div>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="escalated">Escalated</option>
              <option value="closed">Closed</option>
              <option value="false_positive">False Positive</option>
            </select>
          </div>
          <div className="ml-auto text-sm text-gray-600">
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-4 font-semibold text-gray-900">Client</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-900">Alert Type</th>
              <th className="text-center py-4 px-4 font-semibold text-gray-900">Source</th>
              <th className="text-center py-4 px-4 font-semibold text-gray-900">Severity</th>
              <th className="text-center py-4 px-4 font-semibold text-gray-900">Risk Delta</th>
              <th className="text-center py-4 px-4 font-semibold text-gray-900">Status</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-900">Assigned To</th>
              <th className="text-center py-4 px-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((alert) => (
              <tr key={alert.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div>
                    <p className="font-semibold text-gray-900">{alert.clientName}</p>
                    <p className="text-sm text-gray-600">{alert.clientId}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="font-semibold text-gray-900">{alert.alertType}</p>
                  <p className="text-xs text-gray-600">{new Date(alert.timestamp).toLocaleString()}</p>
                </td>
                <td className="text-center py-4 px-4">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                    {alert.source}
                  </span>
                </td>
                <td className="text-center py-4 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </td>
                <td className="text-center py-4 px-4">
                  <span className="font-semibold text-red-600">{alert.riskDelta}</span>
                </td>
                <td className="text-center py-4 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(alert.status)}`}>
                    {alert.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-900">{alert.assignedTo}</span>
                </td>
                <td className="text-center py-4 px-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className={`p-6 border-b ${getSeverityColor(selectedAlert.severity)} border-2`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold">Monitoring Alert Details</h3>
                <button onClick={() => setSelectedAlert(null)}>
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <p className="font-semibold">{selectedAlert.alertType}</p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Client Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client Name:</span>
                      <span className="font-semibold">{selectedAlert.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client ID:</span>
                      <span className="font-semibold">{selectedAlert.clientId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Alert Time:</span>
                      <span className="font-semibold">{new Date(selectedAlert.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Alert Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source:</span>
                      <span className="font-semibold">{selectedAlert.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence:</span>
                      <span className="font-semibold">{selectedAlert.confidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Risk Delta:</span>
                      <span className="font-semibold text-red-600">{selectedAlert.riskDelta}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedAlert.description}</p>
              </div>

              {/* Linked Parties */}
              {selectedAlert.linkedParties && selectedAlert.linkedParties.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Linked Parties</h4>
                  <div className="space-y-2">
                    {selectedAlert.linkedParties.map((party, index) => (
                      <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <User className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="font-semibold text-gray-900">{party}</span>
                        <Button size="sm" variant="outline" className="ml-auto">
                          View Profile
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Recalculation Preview */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-bold text-yellow-900 mb-3">Risk Recalculation Preview</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Current Risk</p>
                    <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold">
                      LOW
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <ChevronRight className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">New Risk (if confirmed)</p>
                    <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full font-bold">
                      HIGH
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-2">Recommended Action</h4>
                <p className="text-sm text-blue-700">
                  {selectedAlert.severity === 'critical' && 
                    'Immediate escalation required. Restrict client access pending investigation. Prepare case file for potential SMR.'}
                  {selectedAlert.severity === 'high' && 
                    'Escalate to compliance officer. Conduct enhanced due diligence. Update risk assessment.'}
                  {selectedAlert.severity === 'medium' && 
                    'Request additional information from client. Update monitoring frequency.'}
                  {selectedAlert.severity === 'low' && 
                    'Document in client file. No immediate action required.'}
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Close as False Positive
                </Button>
                <Button className="bg-red-600 hover:bg-red-700">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Escalate to Case
                </Button>
                <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                  <Lock className="w-4 h-4 mr-2" />
                  Restrict Client
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Request Info
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
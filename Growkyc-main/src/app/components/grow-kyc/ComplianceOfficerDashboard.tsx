import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  FileText,
  Activity,
  Bell,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

interface ComplianceOfficerDashboardProps {
  onViewClient: (clientId: string) => void;
  onViewCase: (caseId: string) => void;
}

export function ComplianceOfficerDashboard({ onViewClient, onViewCase }: ComplianceOfficerDashboardProps) {
  const criticalAlerts = [
    {
      id: '1',
      type: 'AML Alert',
      client: 'Horizon Capital Pty Ltd',
      clientId: 'client-001',
      severity: 'critical',
      description: 'Sanctions match detected - requires immediate assessment',
      dueIn: 'Overdue 2 days',
      caseId: 'case-aml-001'
    },
    {
      id: '2',
      type: 'CDD Overdue',
      client: 'Margaret Chen',
      clientId: 'client-002',
      severity: 'high',
      description: 'Ongoing CDD review overdue by 14 days',
      dueIn: 'Overdue 14 days',
      caseId: 'case-cdd-002'
    },
    {
      id: '3',
      type: 'High Risk Client',
      client: 'Phoenix Investments Ltd',
      clientId: 'client-003',
      severity: 'high',
      description: 'PEP status detected - enhanced CDD required',
      dueIn: 'Due in 3 days',
      caseId: 'case-ecdd-003'
    }
  ];

  const overdueItems = [
    {
      id: '1',
      client: 'Brighton Property Group',
      clientId: 'client-004',
      task: 'Beneficial ownership verification',
      daysOverdue: 7,
      caseId: 'case-bo-004'
    },
    {
      id: '2',
      client: 'Stewart & Associates',
      clientId: 'client-005',
      task: 'ID document renewal',
      daysOverdue: 3,
      caseId: 'case-id-005'
    }
  ];

  const regulatoryClocks = [
    {
      id: '1',
      type: 'AUSTRAC SMR',
      client: 'Various Clients',
      description: 'Suspicious Matter Report assessment period',
      dueDate: '2026-02-22',
      daysRemaining: 7,
      status: 'amber'
    },
    {
      id: '2',
      type: 'ASIC Reportable Situation',
      client: 'Zenith Fund Management',
      description: 'Breach notification to ASIC',
      dueDate: '2026-02-17',
      daysRemaining: 2,
      status: 'red'
    },
    {
      id: '3',
      type: 'AUSTRAC Enrolment',
      client: 'Platform-wide',
      description: 'Tranche 2 enrolment deadline',
      dueDate: '2026-07-01',
      daysRemaining: 136,
      status: 'green'
    }
  ];

  const restrictedClients = [
    {
      id: 'client-006',
      name: 'Redwood Enterprises',
      reason: 'Unresolved AML flag',
      restrictedSince: '2026-02-01',
      status: 'Suspended'
    },
    {
      id: 'client-007',
      name: 'Marcus Williamson',
      reason: 'ID verification failed',
      restrictedSince: '2026-02-10',
      status: 'Restricted'
    }
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-2 border-red-300 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-semibold">Critical Alerts</p>
                <p className="text-4xl font-bold text-red-700 mt-1">3</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-300 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-semibold">Overdue CDD</p>
                <p className="text-4xl font-bold text-orange-700 mt-1">12</p>
              </div>
              <Clock className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-300 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-semibold">High Risk</p>
                <p className="text-4xl font-bold text-yellow-700 mt-1">28</p>
              </div>
              <Shield className="w-10 h-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-300 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-semibold">Active Cases</p>
                <p className="text-4xl font-bold text-blue-700 mt-1">47</p>
              </div>
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-300 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-semibold">Restricted</p>
                <p className="text-4xl font-bold text-purple-700 mt-1">7</p>
              </div>
              <XCircle className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      <Card className="border-2 border-red-300">
        <CardHeader className="bg-red-50 border-b border-red-200">
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="w-5 h-5" />
            Critical Alerts - Immediate Action Required
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-2 ${
                  alert.severity === 'critical'
                    ? 'bg-red-50 border-red-300'
                    : 'bg-orange-50 border-orange-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          alert.severity === 'critical'
                            ? 'bg-red-600 text-white'
                            : 'bg-orange-600 text-white'
                        }`}
                      >
                        {alert.type}
                      </span>
                      <span className="font-bold text-gray-900">{alert.client}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          alert.dueIn.includes('Overdue')
                            ? 'bg-red-200 text-red-900'
                            : 'bg-yellow-200 text-yellow-900'
                        }`}
                      >
                        {alert.dueIn}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{alert.description}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => onViewCase(alert.caseId)}
                      >
                        Open Case
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewClient(alert.clientId)}
                      >
                        View Client
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Items */}
        <Card>
          <CardHeader className="border-b bg-orange-50">
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <Clock className="w-5 h-5" />
              Overdue CDD Items ({overdueItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {overdueItems.map((item) => (
                <div key={item.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{item.client}</p>
                      <p className="text-sm text-gray-600">{item.task}</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-200 text-orange-900 text-xs font-bold rounded-full">
                      {item.daysOverdue} days overdue
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewCase(item.caseId)}
                    >
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onViewClient(item.clientId)}
                    >
                      View Client
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regulatory Clocks */}
        <Card>
          <CardHeader className="border-b bg-blue-50">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Activity className="w-5 h-5" />
              Active Regulatory Clocks
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {regulatoryClocks.map((clock) => (
                <div
                  key={clock.id}
                  className={`p-4 rounded-lg border-2 ${
                    clock.status === 'red'
                      ? 'bg-red-50 border-red-300'
                      : clock.status === 'amber'
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-green-50 border-green-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{clock.type}</p>
                      <p className="text-sm text-gray-600">{clock.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{clock.client}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-2xl font-bold ${
                          clock.status === 'red'
                            ? 'text-red-700'
                            : clock.status === 'amber'
                            ? 'text-yellow-700'
                            : 'text-green-700'
                        }`}
                      >
                        {clock.daysRemaining}
                      </p>
                      <p className="text-xs text-gray-600">days left</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Due: {clock.dueDate}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Restricted Clients */}
      <Card>
        <CardHeader className="border-b bg-purple-50">
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <XCircle className="w-5 h-5" />
            Restricted/Suspended Clients ({restrictedClients.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {restrictedClients.map((client) => (
              <div
                key={client.id}
                className="p-4 bg-purple-50 border-2 border-purple-300 rounded-lg cursor-pointer hover:shadow-lg transition-all"
                onClick={() => onViewClient(client.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-5 h-5 text-purple-600" />
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      client.status === 'Suspended'
                        ? 'bg-red-600 text-white'
                        : 'bg-orange-600 text-white'
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
                <p className="font-semibold text-gray-900 mb-1">{client.name}</p>
                <p className="text-xs text-gray-600 mb-2">{client.reason}</p>
                <p className="text-xs text-gray-500">Since: {client.restrictedSince}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">AUSTRAC Compliance</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Overall Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-300">
                Compliant
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">CDD Current</span>
                <span className="text-sm font-semibold text-green-600">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">AML Program</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Enrolment Status</span>
                <span className="text-sm font-semibold text-blue-600">On Track</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">ACL Compliance</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Credit Files</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-300">
                Current
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Written Assessments</span>
                <span className="text-sm font-semibold text-green-600">142</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">7-Year Retention</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Pending Approvals</span>
                <span className="text-sm font-semibold text-orange-600">8</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">AFSL Compliance</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Incident Status</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-300">
                2 Open
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Reportable Situations</span>
                <span className="text-sm font-semibold text-yellow-600">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Investigations</span>
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Remediation</span>
                <span className="text-sm font-semibold text-green-600">1</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

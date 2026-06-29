import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Bell,
  AlertTriangle,
  Activity,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  Download,
  Zap,
  Target,
  User,
  Building,
  Calendar
} from 'lucide-react';

type AlertType = 'transaction' | 'behavior' | 'threshold' | 'screening' | 'review-due' | 'document';
type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
type AlertStatus = 'new' | 'investigating' | 'resolved' | 'false-positive';

interface MonitoringAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  clientName: string;
  clientId: string;
  title: string;
  description: string;
  detectedDate: Date;
  assignedTo?: string;
  riskScore: number;
}

export function MonitoringAlerts() {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'rules' | 'analytics'>('overview');
  const [alerts] = useState<MonitoringAlert[]>([
    {
      id: 'ALT-2024-001',
      type: 'transaction',
      severity: 'critical',
      status: 'new',
      clientName: 'Global Traders Pty Ltd',
      clientId: 'C-2024-045',
      title: 'Rapid Cash Deposits Pattern',
      description: '15 cash deposits totaling $145,000 in 10 days - possible structuring',
      detectedDate: new Date('2024-02-19'),
      riskScore: 95
    },
    {
      id: 'ALT-2024-002',
      type: 'screening',
      severity: 'critical',
      status: 'investigating',
      clientName: 'Melbourne Family Trust',
      clientId: 'C-2024-023',
      title: 'PEP Match Detected',
      description: 'Beneficiary matches PEP database - former government official',
      detectedDate: new Date('2024-02-18'),
      assignedTo: 'Emma Wilson',
      riskScore: 88
    },
    {
      id: 'ALT-2024-003',
      type: 'behavior',
      severity: 'high',
      status: 'new',
      clientName: 'Tech Solutions Ltd',
      clientId: 'C-2024-067',
      title: 'Transaction Profile Change',
      description: 'Sudden increase in international transfers - 300% above historical average',
      detectedDate: new Date('2024-02-19'),
      riskScore: 72
    },
    {
      id: 'ALT-2024-004',
      type: 'review-due',
      severity: 'medium',
      status: 'new',
      clientName: 'ABC Corporation',
      clientId: 'C-2024-012',
      title: 'Annual Review Overdue',
      description: 'Annual CDD review due date passed - client requires re-verification',
      detectedDate: new Date('2024-02-17'),
      riskScore: 45
    },
    {
      id: 'ALT-2024-005',
      type: 'threshold',
      severity: 'high',
      status: 'investigating',
      clientName: 'John Smith',
      clientId: 'C-2024-089',
      title: 'TTR Threshold Approaching',
      description: 'Multiple transactions totaling $9,500 in 24 hours',
      detectedDate: new Date('2024-02-19'),
      assignedTo: 'Michael Chen',
      riskScore: 68
    },
    {
      id: 'ALT-2024-006',
      type: 'document',
      severity: 'medium',
      status: 'resolved',
      clientName: 'Green Valley SMSF',
      clientId: 'C-2024-034',
      title: 'ID Document Expiring',
      description: 'Directors license expires in 14 days',
      detectedDate: new Date('2024-02-15'),
      assignedTo: 'Lisa Martinez',
      riskScore: 30
    }
  ]);

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
    }
  };

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case 'new': return 'red';
      case 'investigating': return 'yellow';
      case 'resolved': return 'green';
      case 'false-positive': return 'gray';
    }
  };

  const alertTypeLabels: Record<AlertType, string> = {
    'transaction': 'Transaction Pattern',
    'behavior': 'Behavior Change',
    'threshold': 'Threshold Alert',
    'screening': 'Screening Hit',
    'review-due': 'Review Due',
    'document': 'Document Alert'
  };

  const stats = {
    activeAlerts: 12,
    criticalAlerts: 2,
    avgResolutionTime: 4.5,
    alertsToday: 8,
    falsePositiveRate: 15,
    automationRate: 85
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Bell className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Monitoring & Alerts</h1>
              <p className="text-xl text-blue-100">Real-time Transaction Monitoring & Alert System</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-blue-400 hover:bg-blue-500/10">
              <Zap className="w-5 h-5 mr-2" />
              New Rule
            </Button>
            <Button className="bg-white text-blue-400 hover:bg-blue-500/10">
              <Download className="w-5 h-5 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-6 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Active Alerts</h3>
              <Bell className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.activeAlerts}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Critical</h3>
              <AlertTriangle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-red-300">{stats.criticalAlerts}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Avg Days</h3>
              <Clock className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.avgResolutionTime}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Today</h3>
              <Activity className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-yellow-300">{stats.alertsToday}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">FP Rate</h3>
              <XCircle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.falsePositiveRate}%</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">AI Automation</h3>
              <Zap className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-green-300">{stats.automationRate}%</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-white/10">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'alerts', label: 'Active Alerts', icon: Bell, badge: 12 },
            { id: 'rules', label: 'Monitoring Rules', icon: Zap },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 transition-colors relative ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-400'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Monitoring Rules Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border-2 border-blue-500/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500/15 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Transaction Monitoring</h3>
              <p className="text-sm text-slate-300">15 Active Rules</p>
            </div>
          </div>
          <ul className="text-sm text-slate-300 space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Large cash transactions (&gt;$10k)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Rapid transaction sequences
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Round dollar amounts
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Threshold structuring patterns
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg border-2 border-purple-500/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-500/15 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Behavior Analysis</h3>
              <p className="text-sm text-slate-300">8 Active Rules</p>
            </div>
          </div>
          <ul className="text-sm text-slate-300 space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Deviation from historical patterns
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Geographic anomalies
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Transaction velocity changes
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Dormant account reactivation
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg border-2 border-orange-500/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-500/15 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Compliance Monitoring</h3>
              <p className="text-sm text-slate-300">6 Active Rules</p>
            </div>
          </div>
          <ul className="text-sm text-slate-300 space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Review due dates
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Document expiry warnings
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Screening refresh schedules
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              High-risk client escalations
            </li>
          </ul>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-100">Active Alerts</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {alerts.map((alert) => (
          <div key={alert.id} className={`bg-white rounded-lg border-2 p-6 ${
            alert.severity === 'critical' ? 'border-red-300 bg-red-500/10' :
            alert.severity === 'high' ? 'border-orange-300 bg-orange-500/10' :
            'border-white/10'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-xl font-bold text-slate-100">{alert.title}</h4>
                  <span className={`px-3 py-1 bg-${getSeverityColor(alert.severity)}-100 text-${getSeverityColor(alert.severity)}-700 text-sm font-bold rounded-full`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 bg-${getStatusColor(alert.status)}-100 text-${getStatusColor(alert.status)}-700 text-sm font-bold rounded-full`}>
                    {alert.status.toUpperCase().replace('-', ' ')}
                  </span>
                  <span className="px-3 py-1 bg-white/5 text-slate-300 text-sm font-semibold rounded-full">
                    {alertTypeLabels[alert.type]}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">Risk Score:</span>
                    <span className={`px-3 py-1 font-bold rounded-full ${
                      alert.riskScore >= 80 ? 'bg-red-500 text-white' :
                      alert.riskScore >= 60 ? 'bg-orange-500 text-white' :
                      alert.riskScore >= 40 ? 'bg-yellow-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      {alert.riskScore}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm text-slate-300">
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {alert.clientName}
                  </span>
                  <span>•</span>
                  <span>{alert.clientId}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {alert.detectedDate.toLocaleDateString()}
                  </span>
                  {alert.assignedTo && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Assigned to {alert.assignedTo}
                      </span>
                    </>
                  )}
                </div>

                <div className="p-4 bg-white rounded-lg border border-white/10">
                  <p className="text-sm text-slate-300">{alert.description}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-6">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Eye className="w-4 h-4 mr-2" />
                  Investigate
                </Button>
                {alert.status === 'new' && (
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Resolve
                  </Button>
                )}
                <Button variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Monitoring Note */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Zap className="w-6 h-6 text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-bold text-blue-300 mb-2">AI-Powered Monitoring</h3>
            <p className="text-sm text-blue-300 mb-3">
              The system uses machine learning to detect patterns and reduce false positives. The AI:
            </p>
            <ul className="text-sm text-blue-300 space-y-1">
              <li>• Learns from historical alert outcomes to improve accuracy</li>
              <li>• Adapts thresholds based on client behavior patterns</li>
              <li>• Prioritizes alerts by risk score and urgency</li>
              <li>• Auto-resolves low-risk false positives after human review training</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

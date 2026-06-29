import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  AlertTriangle,
  Users,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Scale,
  Eye,
  Calendar,
  Building2,
  Search,
  Bell,
  Lock
} from 'lucide-react';

interface DashboardMetric {
  label: string;
  value: string | number;
  change?: string;
  icon: any;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function SentinelAMLDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const metrics: DashboardMetric[] = [
    { label: 'Total Active Clients', value: 342, change: '+12', icon: Users, color: 'blue', trend: 'up' },
    { label: 'High Risk Clients', value: 18, change: '+3', icon: AlertTriangle, color: 'red', trend: 'up' },
    { label: 'Pending CDD', value: 7, icon: FileText, color: 'yellow' },
    { label: 'Monitoring Alerts', value: 24, change: '+5', icon: Bell, color: 'orange', trend: 'up' },
    { label: 'Sanctions Hits', value: 2, icon: Lock, color: 'red' },
    { label: 'PEP Clients', value: 15, icon: Shield, color: 'purple' },
    { label: 'Enhanced CDD Required', value: 5, icon: AlertCircle, color: 'yellow' },
    { label: 'Active SMRs', value: 1, icon: Scale, color: 'red' },
    { label: 'Personnel Due', value: 3, icon: Users, color: 'orange' },
    { label: 'Program Version', value: 'v2.1', icon: CheckCircle, color: 'green' },
    { label: 'Independent Review Due', value: '45d', icon: Calendar, color: 'blue' },
    { label: 'Compliance Score', value: '98%', icon: TrendingUp, color: 'green', trend: 'up' }
  ];

  const recentAlerts = [
    {
      id: 1,
      client: 'Apex Holdings Pty Ltd',
      type: 'Sanctions Match',
      severity: 'critical',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      client: 'Sarah Mitchell',
      type: 'PEP Status Change',
      severity: 'high',
      time: '5 hours ago',
      status: 'under_review'
    },
    {
      id: 3,
      client: 'Global Trade Corp',
      type: 'Adverse Media',
      severity: 'medium',
      time: '1 day ago',
      status: 'investigating'
    },
    {
      id: 4,
      client: 'Melbourne Property Trust',
      type: 'Ownership Change',
      severity: 'medium',
      time: '2 days ago',
      status: 'pending'
    },
    {
      id: 5,
      client: 'Tech Innovations Ltd',
      type: 'High Value Transaction',
      severity: 'low',
      time: '3 days ago',
      status: 'cleared'
    }
  ];

  const upcomingTasks = [
    { id: 1, task: 'Complete Enhanced CDD - Apex Holdings', due: 'Today', priority: 'critical' },
    { id: 2, task: 'Personnel Due Diligence - New AML Officer', due: 'Tomorrow', priority: 'high' },
    { id: 3, task: 'Annual Compliance Report Review', due: 'In 5 days', priority: 'high' },
    { id: 4, task: 'Client Risk Review - 15 clients', due: 'In 7 days', priority: 'medium' },
    { id: 5, task: 'Program Effectiveness Testing', due: 'In 14 days', priority: 'medium' }
  ];

  const riskDistribution = [
    { level: 'Low', count: 287, percentage: 84, color: 'bg-green-500' },
    { level: 'Medium', count: 37, percentage: 11, color: 'bg-yellow-500' },
    { level: 'High', count: 18, percentage: 5, color: 'bg-red-500' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cleared': return 'bg-green-100 text-green-700';
      case 'under_review': return 'bg-blue-100 text-blue-700';
      case 'investigating': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-4 border-red-500 bg-red-50';
      case 'high': return 'border-l-4 border-orange-500 bg-orange-50';
      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50';
      default: return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sentinel AML Dashboard</h1>
          <p className="text-gray-600 mt-1">AUSTRAC Tranche 2 Compliance Platform</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Search className="w-4 h-4 mr-2" />
            Quick Search
          </Button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="font-bold text-red-900">Critical Alert: Sanctions Match Detected</h3>
              <p className="text-sm text-red-700">Apex Holdings Pty Ltd - Immediate action required</p>
            </div>
          </div>
          <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
            Review Now
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${metric.color}-100`}>
                  <Icon className={`w-5 h-5 text-${metric.color}-600`} />
                </div>
                {metric.change && (
                  <span className={`text-xs font-semibold ${
                    metric.trend === 'up' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {metric.change}
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="text-xs text-gray-600 mt-1">{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Risk Heatmap & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Client Risk Distribution
          </h3>
          <div className="space-y-4">
            {riskDistribution.map((risk, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{risk.level} Risk</span>
                  <span className="text-sm text-gray-600">{risk.count} clients ({risk.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${risk.color} h-3 rounded-full transition-all`}
                    style={{ width: `${risk.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold text-gray-900 mb-3">Risk Trends</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">High Risk Increase</span>
                <span className="font-semibold text-red-600">+3 this week</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Enhanced CDD Required</span>
                <span className="font-semibold text-orange-600">5 pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-orange-600" />
              Recent Monitoring Alerts
            </h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">{alert.client}</p>
                      <p className="text-sm opacity-90">{alert.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(alert.status)}`}>
                      {alert.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
                <p className="text-xs opacity-75 mt-2">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Tasks & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Upcoming Tasks & Reviews
          </h3>
          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg ${getPriorityColor(task.priority)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{task.task}</p>
                    <p className="text-xs text-gray-600 mt-1">Due: {task.due}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Start
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button className="justify-start h-auto py-4 bg-blue-600 hover:bg-blue-700">
              <Users className="w-5 h-5 mr-2" />
              <div className="text-left">
                <div className="font-semibold">New Client</div>
                <div className="text-xs opacity-90">Start CDD</div>
              </div>
            </Button>
            <Button className="justify-start h-auto py-4 bg-green-600 hover:bg-green-700">
              <Search className="w-5 h-5 mr-2" />
              <div className="text-left">
                <div className="font-semibold">GreenID Verify</div>
                <div className="text-xs opacity-90">Identity Check</div>
              </div>
            </Button>
            <Button className="justify-start h-auto py-4 bg-purple-600 hover:bg-purple-700">
              <Building2 className="w-5 h-5 mr-2" />
              <div className="text-left">
                <div className="font-semibold">InfoTrack</div>
                <div className="text-xs opacity-90">Company Search</div>
              </div>
            </Button>
            <Button className="justify-start h-auto py-4 bg-orange-600 hover:bg-orange-700">
              <FileText className="w-5 h-5 mr-2" />
              <div className="text-left">
                <div className="font-semibold">New Case</div>
                <div className="text-xs opacity-90">Investigation</div>
              </div>
            </Button>
            <Button className="justify-start h-auto py-4 bg-red-600 hover:bg-red-700">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <div className="text-left">
                <div className="font-semibold">SMR</div>
                <div className="text-xs opacity-90">Suspicious Matter</div>
              </div>
            </Button>
            <Button className="justify-start h-auto py-4 bg-indigo-600 hover:bg-indigo-700">
              <Eye className="w-5 h-5 mr-2" />
              <div className="text-left">
                <div className="font-semibold">Evidence Vault</div>
                <div className="text-xs opacity-90">View Documents</div>
              </div>
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold text-gray-900 mb-3">System Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">GreenID Integration</span>
                <span className="flex items-center text-green-600 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">InfoTrack Integration</span>
                <span className="flex items-center text-green-600 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">AUSTRAC Enrolment</span>
                <span className="flex items-center text-green-600 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Current
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Compliance Status */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="w-12 h-12 mr-4" />
            <div>
              <h3 className="text-2xl font-bold mb-1">AML/CTF Program Status</h3>
              <p className="text-blue-100">Version 2.1 - Approved by Senior Manager</p>
              <p className="text-sm text-blue-100 mt-2">
                Next Independent Review: 45 days | Last Effectiveness Test: 23 days ago
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold mb-2">98%</div>
            <div className="text-blue-100">Compliance Score</div>
            <Button variant="outline" className="mt-3 border-white text-white hover:bg-white/10">
              View Program
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

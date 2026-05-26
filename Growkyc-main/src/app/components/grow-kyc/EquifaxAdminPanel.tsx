import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Settings,
  Activity,
  Database,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Clock,
  Zap,
  Server,
  Key,
  Shield,
  BarChart3,
  FileText,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  XCircle,
  AlertTriangle,
  Users,
  DollarSign,
  Target,
  Wifi,
  WifiOff
} from 'lucide-react';

interface APIStatus {
  service: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastCheck: Date;
}

interface UsageMetrics {
  module: string;
  callsToday: number;
  callsThisMonth: number;
  costToday: number;
  costThisMonth: number;
  averageResponseTime: number;
  successRate: number;
}

interface RateLimit {
  endpoint: string;
  limit: number;
  used: number;
  resetTime: Date;
}

interface ErrorLog {
  id: string;
  timestamp: Date;
  module: string;
  errorType: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

export function EquifaxAdminPanel() {
  const [showAPIKey, setShowAPIKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'usage' | 'limits' | 'errors' | 'config'>('status');

  // Mock Data
  const apiStatuses: APIStatus[] = [
    {
      service: 'Identity Verification',
      status: 'operational',
      responseTime: 245,
      uptime: 99.98,
      lastCheck: new Date()
    },
    {
      service: 'AML Screening',
      status: 'operational',
      responseTime: 320,
      uptime: 99.95,
      lastCheck: new Date()
    },
    {
      service: 'Credit Reports',
      status: 'operational',
      responseTime: 412,
      uptime: 99.92,
      lastCheck: new Date()
    },
    {
      service: 'Business Reports',
      status: 'operational',
      responseTime: 380,
      uptime: 99.89,
      lastCheck: new Date()
    },
    {
      service: 'Property Data',
      status: 'operational',
      responseTime: 290,
      uptime: 99.94,
      lastCheck: new Date()
    },
    {
      service: 'Monitoring Alerts',
      status: 'operational',
      responseTime: 180,
      uptime: 99.99,
      lastCheck: new Date()
    }
  ];

  const usageMetrics: UsageMetrics[] = [
    {
      module: 'Identity Verification',
      callsToday: 47,
      callsThisMonth: 1243,
      costToday: 94.00,
      costThisMonth: 2486.00,
      averageResponseTime: 245,
      successRate: 99.8
    },
    {
      module: 'AML Screening',
      callsToday: 52,
      callsThisMonth: 1456,
      costToday: 78.00,
      costThisMonth: 2184.00,
      averageResponseTime: 320,
      successRate: 99.9
    },
    {
      module: 'Credit Reports',
      callsToday: 34,
      callsThisMonth: 892,
      costToday: 170.00,
      costThisMonth: 4460.00,
      averageResponseTime: 412,
      successRate: 99.5
    },
    {
      module: 'Business Reports',
      callsToday: 28,
      callsThisMonth: 734,
      costToday: 140.00,
      costThisMonth: 3670.00,
      averageResponseTime: 380,
      successRate: 99.7
    },
    {
      module: 'Property Data',
      callsToday: 19,
      callsThisMonth: 512,
      costToday: 95.00,
      costThisMonth: 2560.00,
      averageResponseTime: 290,
      successRate: 99.6
    },
    {
      module: 'Monitoring Alerts',
      callsToday: 156,
      callsThisMonth: 4234,
      costToday: 31.20,
      costThisMonth: 846.80,
      averageResponseTime: 180,
      successRate: 99.95
    }
  ];

  const rateLimits: RateLimit[] = [
    {
      endpoint: 'Identity Verification',
      limit: 1000,
      used: 47,
      resetTime: new Date(Date.now() + 6 * 60 * 60 * 1000)
    },
    {
      endpoint: 'AML Screening',
      limit: 2000,
      used: 52,
      resetTime: new Date(Date.now() + 6 * 60 * 60 * 1000)
    },
    {
      endpoint: 'Credit Reports',
      limit: 500,
      used: 34,
      resetTime: new Date(Date.now() + 6 * 60 * 60 * 1000)
    },
    {
      endpoint: 'Business Reports',
      limit: 500,
      used: 28,
      resetTime: new Date(Date.now() + 6 * 60 * 60 * 1000)
    },
    {
      endpoint: 'Property Data',
      limit: 750,
      used: 19,
      resetTime: new Date(Date.now() + 6 * 60 * 60 * 1000)
    },
    {
      endpoint: 'Monitoring Alerts',
      limit: 5000,
      used: 156,
      resetTime: new Date(Date.now() + 6 * 60 * 60 * 1000)
    }
  ];

  const errorLogs: ErrorLog[] = [
    {
      id: 'ERR-001',
      timestamp: new Date('2024-03-22T08:45:00'),
      module: 'Credit Reports',
      errorType: 'Timeout',
      message: 'Request timeout after 30 seconds',
      severity: 'medium',
      resolved: true
    },
    {
      id: 'ERR-002',
      timestamp: new Date('2024-03-21T14:20:00'),
      module: 'AML Screening',
      errorType: 'Rate Limit',
      message: 'Rate limit exceeded - 429 response',
      severity: 'low',
      resolved: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 dark:text-green-400';
      case 'degraded': return 'text-yellow-600 dark:text-yellow-400';
      case 'down': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 dark:bg-green-900/20';
      case 'degraded': return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'down': return 'bg-red-100 dark:bg-red-900/20';
      default: return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const totalCallsToday = usageMetrics.reduce((sum, m) => sum + m.callsToday, 0);
  const totalCostToday = usageMetrics.reduce((sum, m) => sum + m.costToday, 0);
  const totalCallsMonth = usageMetrics.reduce((sum, m) => sum + m.callsThisMonth, 0);
  const totalCostMonth = usageMetrics.reduce((sum, m) => sum + m.costThisMonth, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0E7C9E] to-[#13B5EA] text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Equifax Integration Admin</h1>
              </div>
              <p className="text-xl text-cyan-100">API Management, Usage Tracking & System Monitoring</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-cyan-100">System Status</div>
              <div className="text-lg font-semibold flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                All Systems Operational
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">Services Online</div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {apiStatuses.filter(s => s.status === 'operational').length}/{apiStatuses.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">100% Uptime</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">API Calls Today</div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalCallsToday.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">{totalCallsMonth.toLocaleString()} this month</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">Cost Today</div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              ${totalCostToday.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">${totalCostMonth.toFixed(2)} this month</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">Avg Response</div>
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {Math.round(usageMetrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / usageMetrics.length)}ms
            </div>
            <div className="text-xs text-gray-500 mt-1">Excellent performance</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {[
              { id: 'status', label: 'API Status', icon: Server },
              { id: 'usage', label: 'Usage & Costs', icon: BarChart3 },
              { id: 'limits', label: 'Rate Limits', icon: Target },
              { id: 'errors', label: 'Error Logs', icon: AlertTriangle },
              { id: 'config', label: 'Configuration', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#13B5EA] text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* API Status Tab */}
            {activeTab === 'status' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Service Health Monitor</h3>
                  <Button size="sm" variant="outline" onClick={() => alert('Refreshing status...')}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {apiStatuses.map((service, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${service.status === 'operational' ? 'bg-green-500' : service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        <h4 className="font-semibold text-gray-900 dark:text-white">{service.service}</h4>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBg(service.status)} ${getStatusColor(service.status)}`}>
                        {service.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Response Time</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{service.responseTime}ms</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Uptime</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{service.uptime}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Last Check</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{service.lastCheck.toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Usage & Costs Tab */}
            {activeTab === 'usage' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">API Usage & Cost Analysis</h3>
                  <Button size="sm" variant="outline" onClick={() => alert('Downloading report...')}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Module</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Calls Today</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Calls Month</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Cost Today</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Cost Month</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Avg Response</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Success Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usageMetrics.map((metric, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{metric.module}</td>
                          <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{metric.callsToday}</td>
                          <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{metric.callsThisMonth.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">${metric.costToday.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">${metric.costThisMonth.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{metric.averageResponseTime}ms</td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-green-600 font-semibold">{metric.successRate}%</span>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 dark:bg-gray-800 font-bold">
                        <td className="py-3 px-4 text-gray-900 dark:text-white">Total</td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-white">{totalCallsToday}</td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-white">{totalCallsMonth.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-white">${totalCostToday.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-white">${totalCostMonth.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-white">-</td>
                        <td className="py-3 px-4 text-right text-gray-900 dark:text-white">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Rate Limits Tab */}
            {activeTab === 'limits' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Rate Limit Monitor</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Limits reset in: {Math.ceil((rateLimits[0].resetTime.getTime() - Date.now()) / (1000 * 60 * 60))} hours
                  </div>
                </div>

                {rateLimits.map((limit, index) => {
                  const percentage = (limit.used / limit.limit) * 100;
                  const isNearLimit = percentage > 80;

                  return (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{limit.endpoint}</h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {limit.used.toLocaleString()} / {limit.limit.toLocaleString()} calls
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            isNearLimit ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className={isNearLimit ? 'text-red-600' : 'text-green-600'}>
                          {percentage.toFixed(1)}% used
                        </span>
                        <span className="text-gray-500">
                          Resets: {limit.resetTime.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Error Logs Tab */}
            {activeTab === 'errors' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Error Logs</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>

                {errorLogs.length === 0 ? (
                  <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h4 className="text-lg font-bold text-green-900 dark:text-green-100 mb-2">No Active Errors</h4>
                    <p className="text-green-800 dark:text-green-200">All systems running smoothly</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {errorLogs.map((error) => (
                      <div key={error.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{error.errorType}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{error.module}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(error.severity)}`}>
                              {error.severity.toUpperCase()}
                            </span>
                            {error.resolved && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                RESOLVED
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{error.message}</p>
                        <div className="text-xs text-gray-500">
                          {error.timestamp.toLocaleString()} • ID: {error.id}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Configuration Tab */}
            {activeTab === 'config' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">API Configuration</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        API Endpoint
                      </label>
                      <input
                        type="text"
                        value="https://api.equifax.com.au/v2"
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        API Key
                      </label>
                      <div className="flex gap-2">
                        <input
                          type={showAPIKey ? 'text' : 'password'}
                          value="eq_live_xK7n9pL4mQ2vR8wT5yU1zA3bC6dE0fG"
                          readOnly
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <Button
                          variant="outline"
                          onClick={() => setShowAPIKey(!showAPIKey)}
                        >
                          {showAPIKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Connection Status
                      </label>
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-700 dark:text-green-300 font-semibold">Connected</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Environment
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option value="production">Production</option>
                        <option value="sandbox">Sandbox (Testing)</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Test Connection
                      </Button>
                      <Button variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Rotate API Key
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Module Settings</h3>
                  
                  <div className="space-y-3">
                    {['Identity Verification', 'AML Screening', 'Credit Reports', 'Business Reports', 'Property Data', 'Monitoring Alerts'].map((module, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <span className="font-medium text-gray-900 dark:text-white">{module}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#13B5EA]/50 dark:peer-focus:ring-[#0E7C9E]/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#13B5EA]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

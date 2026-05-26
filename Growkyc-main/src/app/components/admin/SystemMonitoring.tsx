import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  Database,
  Zap,
  Server,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Eye
} from 'lucide-react';

interface SystemMonitoringProps {
  onBack: () => void;
}

export function SystemMonitoring({ onBack }: SystemMonitoringProps) {
  const metrics = {
    uptime: 99.97,
    activeUsers: 1842,
    apiCalls24h: 45238,
    avgResponseTime: 124, // ms
    errorRate: 0.03, // %
    dbConnections: 87,
    storageUsed: 234.5, // GB
    bandwidthUsed: 1.2, // TB
    cpuUsage: 42, // %
    memoryUsage: 68 // %
  };

  const alerts = [
    {
      severity: 'warning',
      message: 'Database connection pool at 70% capacity',
      time: '15 mins ago'
    },
    {
      severity: 'info',
      message: 'DFAT sanctions list sync completed successfully',
      time: '2 hours ago'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white px-8 py-12">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin
        </Button>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">System Monitoring</h1>
            <p className="text-white/90 text-xl">Real-time metrics • Performance tracking • Health alerts</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-5 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Uptime</div>
            </div>
            <div className="text-4xl font-bold mb-1">{metrics.uptime}%</div>
            <div className="text-xs text-white/70">Last 30 days</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Active Users</div>
            </div>
            <div className="text-4xl font-bold mb-1">{metrics.activeUsers.toLocaleString()}</div>
            <div className="text-xs text-white/70">Right now</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">API Calls (24h)</div>
            </div>
            <div className="text-4xl font-bold mb-1">{(metrics.apiCalls24h / 1000).toFixed(1)}K</div>
            <div className="flex items-center gap-1 text-xs text-white/70">
              <TrendingUp className="w-3 h-3" />
              +12% vs yesterday
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Avg Response Time</div>
            </div>
            <div className="text-4xl font-bold mb-1">{metrics.avgResponseTime}ms</div>
            <div className="flex items-center gap-1 text-xs text-white/70">
              <TrendingDown className="w-3 h-3" />
              -8ms vs yesterday
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Error Rate</div>
            </div>
            <div className="text-4xl font-bold mb-1">{metrics.errorRate}%</div>
            <div className="text-xs text-white/70">Within SLA</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Resource Usage */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Health</CardTitle>
              <CardDescription>Current resource utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">CPU Usage</span>
                    <span className="text-sm font-bold text-gray-900">{metrics.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: `${metrics.cpuUsage}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Memory Usage</span>
                    <span className="text-sm font-bold text-gray-900">{metrics.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-amber-600 h-3 rounded-full" style={{ width: `${metrics.memoryUsage}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Storage Used</span>
                    <span className="text-sm font-bold text-gray-900">{metrics.storageUsed} GB / 500 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${(metrics.storageUsed / 500) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">DB Connections</span>
                    <span className="text-sm font-bold text-gray-900">{metrics.dbConnections} / 120</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-purple-600 h-3 rounded-full" style={{ width: `${(metrics.dbConnections / 120) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network & Bandwidth</CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Globe className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="font-bold text-gray-900">Bandwidth Used</div>
                      <div className="text-sm text-gray-600">Last 24 hours</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{metrics.bandwidthUsed} TB</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <Zap className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="font-bold text-gray-900">API Calls</div>
                      <div className="text-sm text-gray-600">Last 24 hours</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{metrics.apiCalls24h.toLocaleString()}</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <Server className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="font-bold text-gray-900">Avg Response Time</div>
                      <div className="text-sm text-gray-600">Last hour</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">{metrics.avgResponseTime}ms</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    alert.severity === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center gap-4">
                      <AlertTriangle className={`w-5 h-5 ${
                        alert.severity === 'warning' ? 'text-amber-600' : 'text-blue-600'
                      }`} />
                      <div>
                        <div className="font-semibold text-gray-900">{alert.message}</div>
                        <div className="text-sm text-gray-600">{alert.time}</div>
                      </div>
                    </div>
                    <Badge className={alert.severity === 'warning' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'}>
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Endpoints Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top API Endpoints (24h)</CardTitle>
            <CardDescription>Most frequently called endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { endpoint: '/api/screening/sanctions', calls: 12847, avgTime: 98 },
                { endpoint: '/api/entity/abn-lookup', calls: 9234, avgTime: 124 },
                { endpoint: '/api/entity/company-search', calls: 8123, avgTime: 156 },
                { endpoint: '/api/screening/asic-banned', calls: 5438, avgTime: 112 },
                { endpoint: '/api/licensing/afsl-check', calls: 3892, avgTime: 134 }
              ].map((endpoint, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="font-mono text-sm font-semibold text-gray-900 mb-1">{endpoint.endpoint}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>{endpoint.calls.toLocaleString()} calls</span>
                      <span>•</span>
                      <span>{endpoint.avgTime}ms avg</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Logs
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

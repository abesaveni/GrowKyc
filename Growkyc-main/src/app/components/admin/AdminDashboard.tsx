import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Shield,
  Users,
  Database,
  Activity,
  Settings,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Building2,
  RefreshCw,
  Download,
  Upload,
  Globe,
  Lock,
  Zap,
  FileText,
  Eye,
  BarChart3
} from 'lucide-react';
import { DataIntegrations } from './DataIntegrations';
import { UserApprovalQueue } from './UserApprovalQueue';
import { SystemMonitoring } from './SystemMonitoring';
import { DatabaseManager } from './DatabaseManager';

interface AdminDashboardProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export function AdminDashboard({ onBack, onNavigate }: AdminDashboardProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'integrations' | 'users' | 'monitoring' | 'database'>('overview');

  // System-wide stats
  const [expiringSoon, setExpiringSoon] = useState(0);
  const [expired, setExpired] = useState(0);

  useEffect(() => {
    fetch('/api/v1/documents/expiring?withinDays=30')
      .then((res) => res.json())
      .then((data) => {
        setExpiringSoon(data.expiring_soon ?? 0);
        setExpired(data.expired ?? 0);
      })
      .catch(() => {});
  }, []);

  const stats = {
    totalOrganizations: 147,
    pendingApprovals: 23,
    activeUsers: 1842,
    apiCallsToday: 45238,
    dataSourcesConnected: 9,
    dataSourcesHealth: 8,
    storageUsed: 234.5, // GB
    monthlyRevenue: 73500,
    systemUptime: 99.97
  };

  if (selectedView === 'integrations') {
    return <DataIntegrations onBack={() => setSelectedView('overview')} />;
  }

  if (selectedView === 'users') {
    return <UserApprovalQueue onBack={() => setSelectedView('overview')} />;
  }

  if (selectedView === 'monitoring') {
    return <SystemMonitoring onBack={() => setSelectedView('overview')} />;
  }

  if (selectedView === 'database') {
    return <DatabaseManager onBack={() => setSelectedView('overview')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white px-8 py-12">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to App
        </Button>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">SaaS Admin Portal</h1>
            <p className="text-white/90 text-xl">System-level control • Organization management • Data integrations</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Organizations</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalOrganizations}</div>
            <div className="text-xs text-white/70">{stats.pendingApprovals} pending approval</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Active Users</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.activeUsers.toLocaleString()}</div>
            <div className="text-xs text-white/70">Across all orgs</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Data Sources</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.dataSourcesConnected}</div>
            <div className="text-xs text-white/70">{stats.dataSourcesHealth} healthy</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">API Calls Today</div>
            </div>
            <div className="text-4xl font-bold mb-1">{(stats.apiCallsToday / 1000).toFixed(1)}K</div>
            <div className="text-xs text-white/70">To gov't APIs</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">System Uptime</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.systemUptime}%</div>
            <div className="text-xs text-white/70">Last 30 days</div>
          </div>
        </div>
       {/* Document Expiry Alerts */}
       <Card className="cursor-pointer" onClick={() => onNavigate?.('documents')}>
         <CardContent className="p-6">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
               <FileText className="w-5 h-5 text-orange-600" />
               <span className="font-semibold text-gray-900">Document Expiry</span>
             </div>
             <span className="text-2xl font-bold text-orange-600">{expiringSoon}/{expired}</span>
           </div>
           <div className="text-sm text-gray-600">
             <span>{expiringSoon} expiring soon</span> • <span>{expired} expired</span>
           </div>
         </CardContent>
       </Card>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <Card
            className="border-2 border-purple-200 hover:border-purple-400 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => setSelectedView('integrations')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">Data Integrations</h3>
                  <p className="text-sm text-gray-600">9 gov't APIs connected</p>
                </div>
              </div>
              <Button className="w-full">
                Manage Integrations →
              </Button>
            </CardContent>
          </Card>

          <Card
            className="border-2 border-blue-200 hover:border-blue-400 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => setSelectedView('users')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">User Approvals</h3>
                  <p className="text-sm text-gray-600">{stats.pendingApprovals} pending</p>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Review Queue →
              </Button>
            </CardContent>
          </Card>

          <Card
            className="border-2 border-green-200 hover:border-green-400 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => setSelectedView('monitoring')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">System Monitoring</h3>
                  <p className="text-sm text-gray-600">{stats.systemUptime}% uptime</p>
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                View Metrics →
              </Button>
            </CardContent>
          </Card>

          <Card
            className="border-2 border-amber-200 hover:border-amber-400 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => setSelectedView('database')}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                  <Database className="w-8 h-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">Database Manager</h3>
                  <p className="text-sm text-gray-600">{stats.storageUsed} GB used</p>
                </div>
              </div>
              <Button className="w-full bg-amber-600 hover:bg-amber-700">
                Manage Data →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>Last 24 hours across all organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '2 mins ago', event: 'DFAT sanctions list refreshed', status: 'success', icon: RefreshCw },
                { time: '15 mins ago', event: 'New organization approved: Smith & Co Accountants', status: 'success', icon: CheckCircle },
                { time: '1 hour ago', event: 'ASIC AFS Licensee dataset updated', status: 'success', icon: Download },
                { time: '2 hours ago', event: 'Organization pending approval: Martinez Legal', status: 'pending', icon: AlertCircle },
                { time: '3 hours ago', event: 'ABN Bulk Extract completed (250K records)', status: 'success', icon: Database }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.status === 'success' ? 'bg-green-100' : 'bg-amber-100'
                    }`}>
                      <activity.icon className={`w-5 h-5 ${
                        activity.status === 'success' ? 'text-green-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{activity.event}</div>
                      <div className="text-sm text-gray-600">{activity.time}</div>
                    </div>
                  </div>
                  <Badge className={
                    activity.status === 'success' ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'
                  }>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Dashboard */}
        <div className="grid grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Recurring Revenue</CardTitle>
              <CardDescription>Current month performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ${stats.monthlyRevenue.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">+18.4%</span>
                <span className="text-gray-600">vs last month</span>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Accountants</span>
                  <span className="font-bold text-gray-900">$28,500</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Credit Providers</span>
                  <span className="font-bold text-gray-900">$15,200</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">AFSL Holders</span>
                  <span className="font-bold text-gray-900">$12,800</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Other Verticals</span>
                  <span className="font-bold text-gray-900">$17,000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>All services operational</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { service: 'API Gateway', status: 'operational', uptime: '100%' },
                  { service: 'Database Cluster', status: 'operational', uptime: '99.98%' },
                  { service: 'Document Storage', status: 'operational', uptime: '99.95%' },
                  { service: 'Gov\'t API Sync', status: 'operational', uptime: '99.92%' },
                  { service: 'Email Service', status: 'operational', uptime: '100%' }
                ].map((service, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-gray-900">{service.service}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{service.uptime}</span>
                      <Badge className="bg-green-600 text-white text-xs">
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

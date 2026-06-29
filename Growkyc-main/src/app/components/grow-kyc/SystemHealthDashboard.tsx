import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Database,
  Cloud,
  Zap,
  Shield,
  Globe,
  Server,
  Cpu,
  HardDrive,
  Network,
  RefreshCw,
  Eye,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  BarChart3,
  Clock,
  Users,
  FileText,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface SystemHealthDashboardProps {
  onBack?: () => void;
}

export function SystemHealthDashboard({ onBack }: SystemHealthDashboardProps) {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // System Components Status
  const systemComponents = [
    {
      name: 'KYC Platform Core',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '45ms',
      lastIncident: 'None',
      icon: Shield,
      color: 'text-[#3DD598]'
    },
    {
      name: 'Database Cluster',
      status: 'operational',
      uptime: '100%',
      responseTime: '12ms',
      lastIncident: 'None',
      icon: Database,
      color: 'text-[#3DD598]'
    },
    {
      name: 'API Gateway',
      status: 'operational',
      uptime: '99.95%',
      responseTime: '28ms',
      lastIncident: '2 days ago',
      icon: Network,
      color: 'text-[#3DD598]'
    },
    {
      name: 'Authentication Service',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '18ms',
      lastIncident: 'None',
      icon: Lock,
      color: 'text-[#3DD598]'
    },
    {
      name: 'Document Storage',
      status: 'operational',
      uptime: '100%',
      responseTime: '95ms',
      lastIncident: 'None',
      icon: HardDrive,
      color: 'text-[#3DD598]'
    },
    {
      name: 'AI Processing Engine',
      status: 'operational',
      uptime: '99.92%',
      responseTime: '340ms',
      lastIncident: '5 days ago',
      icon: Sparkles,
      color: 'text-[#3DD598]'
    },
    {
      name: 'Email Service',
      status: 'operational',
      uptime: '99.97%',
      responseTime: '156ms',
      lastIncident: 'None',
      icon: Mail,
      color: 'text-[#3DD598]'
    },
    {
      name: 'SMS Gateway',
      status: 'degraded',
      uptime: '98.45%',
      responseTime: '2.4s',
      lastIncident: 'Ongoing',
      icon: MessageSquare,
      color: 'text-[#FFA300]'
    }
  ];

  // Integration Status
  const integrationStatus = [
    { name: 'InfoTrack', status: 'connected', lastSync: '2 mins ago', requests: '1,247', icon: Shield },
    { name: 'GreenID', status: 'connected', lastSync: '5 mins ago', requests: '892', icon: CheckCircle },
    { name: 'Equifax', status: 'connected', lastSync: '1 min ago', requests: '2,156', icon: BarChart3 },
    { name: 'AUSTRAC', status: 'connected', lastSync: '10 mins ago', requests: '45', icon: Globe },
    { name: 'Xero', status: 'connected', lastSync: '3 mins ago', requests: '567', icon: FileText },
    { name: 'Microsoft 365', status: 'connected', lastSync: '1 min ago', requests: '3,421', icon: Mail },
    { name: 'Google Workspace', status: 'connected', lastSync: '4 mins ago', requests: '2,890', icon: Cloud },
    { name: 'Twilio SMS', status: 'degraded', lastSync: '45 mins ago', requests: '234', icon: Phone },
    { name: 'Salesforce', status: 'connected', lastSync: '6 mins ago', requests: '1,089', icon: Users },
    { name: 'DocuSign', status: 'connected', lastSync: '8 mins ago', requests: '445', icon: FileText }
  ];

  // Performance Metrics
  const performanceMetrics = [
    { label: 'Avg Response Time', value: '124ms', change: '-12%', trend: 'down', icon: TrendingDown },
    { label: 'Requests/Min', value: '14,523', change: '+8%', trend: 'up', icon: TrendingUp },
    { label: 'Error Rate', value: '0.02%', change: '-0.01%', trend: 'down', icon: TrendingDown },
    { label: 'Active Users', value: '1,847', change: '+156', trend: 'up', icon: Users }
  ];

  // Resource Utilization
  const resourceMetrics = [
    { name: 'CPU Usage', value: 45, max: 100, unit: '%', status: 'healthy', icon: Cpu },
    { name: 'Memory', value: 62, max: 100, unit: '%', status: 'healthy', icon: Server },
    { name: 'Storage', value: 38, max: 100, unit: '%', status: 'healthy', icon: HardDrive },
    { name: 'Network I/O', value: 28, max: 100, unit: '%', status: 'healthy', icon: Network }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'operational':
      case 'connected':
      case 'healthy':
        return (
          <Badge className="bg-[#3DD598] text-white flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Operational
          </Badge>
        );
      case 'degraded':
        return (
          <Badge className="bg-[#FFA300] text-white flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Degraded
          </Badge>
        );
      case 'down':
      case 'error':
        return (
          <Badge className="bg-red-600 text-white flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Down
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-400 text-white flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Unknown
          </Badge>
        );
    }
  };

  const getProgressBarColor = (value: number) => {
    if (value < 60) return 'bg-[#3DD598]';
    if (value < 80) return 'bg-[#FFA300]';
    return 'bg-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white">System Health Dashboard</h1>
            <p className="text-slate-300 mt-1">
              Real-time monitoring of Grow KYC platform components and integrations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock className="w-4 h-4" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Overall Status */}
        <Card className="bg-gradient-to-r from-[#3DD598] to-[#13B5EA] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">All Systems Operational</h2>
                  <p className="text-white/90">All core services are running normally</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">99.96%</p>
                <p className="text-white/90">30-day uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === 'down' && metric.label.includes('Error') || 
                           metric.trend === 'down' && metric.label.includes('Response') ||
                           metric.trend === 'up' && !metric.label.includes('Error');
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-300">{metric.label}</p>
                  <Icon className={`w-5 h-5 ${isPositive ? 'text-[#3DD598]' : 'text-red-600'}`} />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <span className={`text-sm font-semibold ${isPositive ? 'text-[#3DD598]' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Components */}
      <Card className="mb-8">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#13B5EA]" />
            Core System Components
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemComponents.map((component, index) => {
              const Icon = component.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-[#0a0e17] rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${component.color}`} />
                    <div>
                      <p className="font-semibold text-white">{component.name}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-300">
                        <span>Uptime: {component.uptime}</span>
                        <span>Response: {component.responseTime}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(component.status)}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card className="mb-8">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#13B5EA]" />
            Integration Partners (50 Total)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {integrationStatus.map((integration, index) => {
              const Icon = integration.icon;
              return (
                <div key={index} className="p-4 bg-[#0a0e17] rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-5 h-5 text-[#13B5EA]" />
                    {getStatusBadge(integration.status)}
                  </div>
                  <p className="font-semibold text-white mb-2">{integration.name}</p>
                  <div className="space-y-1 text-xs text-slate-300">
                    <p>Last sync: {integration.lastSync}</p>
                    <p>Requests: {integration.requests}/day</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-300">
              + 40 more integrations active
              <button className="ml-2 text-[#13B5EA] hover:underline font-semibold">
                View All
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resource Utilization */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#13B5EA]" />
            Resource Utilization
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resourceMetrics.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-300" />
                      <span className="text-sm font-semibold text-white">{resource.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {resource.value}{resource.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${getProgressBarColor(resource.value)} h-3 rounded-full transition-all`}
                      style={{ width: `${resource.value}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

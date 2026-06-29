import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Brain,
  Shield,
  FileText,
  Link as LinkIcon,
  Zap,
  Clock,
  Users,
  DollarSign,
  Target,
  Activity
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface GrowDashboardProps {
  onNavigate?: (page: string) => void;
}

interface SystemModule {
  id: string;
  name: string;
  status: 'active' | 'syncing' | 'error';
  lastUpdate: string;
  metrics: {
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
  }[];
}

export function GrowDashboard({ onNavigate }: GrowDashboardProps) {
  const modules: SystemModule[] = [
    {
      id: 'xero-integration',
      name: 'Universal Ledger Sync',
      status: 'active',
      lastUpdate: '2 min ago',
      metrics: [
        { label: 'Connected Ledgers', value: 3, trend: 'neutral' },
        { label: 'Last Sync', value: '2 min ago', trend: 'neutral' },
        { label: 'Records Synced', value: '1.2K', trend: 'up' }
      ]
    },
    {
      id: 'trial-balance',
      name: 'Intelligent Trial Balance',
      status: 'active',
      lastUpdate: '5 min ago',
      metrics: [
        { label: 'Active Jobs', value: 47, trend: 'up' },
        { label: 'Auto-Mapped', value: '94%', trend: 'up' },
        { label: 'Risk Flags', value: 12, trend: 'down' }
      ]
    },
    {
      id: 'ai-review',
      name: 'AI Review Engine',
      status: 'active',
      lastUpdate: '1 min ago',
      metrics: [
        { label: 'Active Reviews', value: 23, trend: 'neutral' },
        { label: 'AI Suggestions', value: 156, trend: 'up' },
        { label: 'Auto-Approved', value: '67%', trend: 'up' }
      ]
    },
    {
      id: 'workpaper-manager',
      name: 'ATO Data Hub',
      status: 'active',
      lastUpdate: '10 min ago',
      metrics: [
        { label: 'Prefill Ready', value: 31, trend: 'up' },
        { label: 'BAS Data', value: 18, trend: 'neutral' },
        { label: 'STP Records', value: 94, trend: 'up' }
      ]
    },
    {
      id: 'binder-generator',
      name: 'Smart Workpaper Binder',
      status: 'active',
      lastUpdate: '3 min ago',
      metrics: [
        { label: 'Active Binders', value: 47, trend: 'up' },
        { label: 'Auto-Generated', value: '89%', trend: 'up' },
        { label: 'Completion', value: '72%', trend: 'up' }
      ]
    },
    {
      id: 'risk-dashboard',
      name: 'Risk & Quality Control',
      status: 'active',
      lastUpdate: '15 min ago',
      metrics: [
        { label: 'High Risk Jobs', value: 5, trend: 'down' },
        { label: 'Quality Score', value: '92%', trend: 'up' },
        { label: 'Overdue Items', value: 3, trend: 'down' }
      ]
    }
  ];

  const practiceMetrics = [
    {
      label: 'Active Jobs',
      value: '47',
      change: '+12%',
      trend: 'up' as const,
      icon: FileText
    },
    {
      label: 'Completion Rate',
      value: '89%',
      change: '+5%',
      trend: 'up' as const,
      icon: CheckCircle
    },
    {
      label: 'Avg Prep Time',
      value: '3.2h',
      change: '-40%',
      trend: 'down' as const,
      icon: Clock
    },
    {
      label: 'AI Efficiency',
      value: '94%',
      change: '+8%',
      trend: 'up' as const,
      icon: Brain
    },
    {
      label: 'Revenue',
      value: '$248K',
      change: '+18%',
      trend: 'up' as const,
      icon: DollarSign
    },
    {
      label: 'Staff Utilization',
      value: '87%',
      change: '+3%',
      trend: 'up' as const,
      icon: Users
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-0.5 bg-green-500/15 text-green-300 text-xs font-semibold rounded flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Active
        </span>;
      case 'syncing':
        return <span className="px-2 py-0.5 bg-blue-500/15 text-blue-300 text-xs font-semibold rounded flex items-center gap-1">
          <RefreshCw className="w-3 h-3 animate-spin" />
          Syncing
        </span>;
      case 'error':
        return <span className="px-2 py-0.5 bg-red-500/15 text-red-300 text-xs font-semibold rounded flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Error
        </span>;
      default:
        return null;
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <WorkpaperLayout currentPage="dashboard" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <Zap className="w-8 h-8 text-blue-400" />
              Grow Workpapers Platform
            </h1>
            <p className="text-sm text-slate-300 mt-1">Cloud-native • Ledger-connected • AI-driven • Audit-ready</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              System Health
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </Button>
          </div>
        </div>

        {/* Practice Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {practiceMetrics.map((metric) => {
            const Icon = metric.icon;
            const isPositive = metric.trend === 'up';
            return (
              <div key={metric.label} className="bg-white border border-white/10 rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span className={`text-xs font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-100">{metric.value}</div>
                <div className="text-xs text-slate-300 mt-1">{metric.label}</div>
              </div>
            );
          })}
        </div>

        {/* System Status Banner */}
        <div className="bg-green-500/10 border border-green-300 rounded px-4 py-3">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-400" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-300">All Systems Operational</h3>
              <p className="text-sm text-green-300">
                6 modules active • Last system sync 2 minutes ago • 99.8% uptime this month
              </p>
            </div>
            <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded">HEALTHY</span>
          </div>
        </div>

        {/* Core Modules Table */}
        <div className="border border-white/10 rounded bg-white overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 px-4 py-2">
            <h3 className="font-semibold text-slate-100">Core Platform Modules</h3>
          </div>
          <table className="w-full text-sm border-collapse">
            {/* Header Row */}
            <thead>
              <tr className="bg-white/5">
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Module Name</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300 w-32">Status</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-32">Last Update</th>
                <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Metrics</th>
                <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300 w-32">Actions</th>
              </tr>
            </thead>

            {/* Data Rows */}
            <tbody>
              {modules.map((module) => (
                <tr key={module.id} className="hover:bg-white/5">
                  <td className="border border-white/10 px-3 py-2 text-slate-100 font-medium">
                    {module.name}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-center">
                    {getStatusBadge(module.status)}
                  </td>
                  <td className="border border-white/10 px-3 py-2 text-slate-300 text-xs">
                    {module.lastUpdate}
                  </td>
                  <td className="border border-white/10 px-2 py-2">
                    <div className="flex gap-4">
                      {module.metrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-xs">
                          <span className="text-slate-300">{metric.label}:</span>
                          <span className="font-semibold text-slate-100">{metric.value}</span>
                          {getTrendIcon(metric.trend)}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="border border-white/10 px-2 py-2 text-center">
                    <button
                      onClick={() => onNavigate?.(module.id)}
                      className="px-3 py-1 text-xs bg-blue-500/15 text-blue-300 hover:bg-blue-500/20 rounded font-semibold"
                    >
                      Open →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate?.('trial-balance')}
            className="bg-white border border-white/10 rounded p-4 hover:bg-white/5 text-left transition-colors"
          >
            <Target className="w-6 h-6 text-blue-400 mb-2" />
            <div className="font-semibold text-slate-100">Trial Balance Core</div>
            <div className="text-xs text-slate-300 mt-1">View intelligent TB hub</div>
          </button>

          <button
            onClick={() => onNavigate?.('ai-review')}
            className="bg-white border border-white/10 rounded p-4 hover:bg-white/5 text-left transition-colors"
          >
            <Brain className="w-6 h-6 text-purple-400 mb-2" />
            <div className="font-semibold text-slate-100">AI Review Engine</div>
            <div className="text-xs text-slate-300 mt-1">Open AI review mode</div>
          </button>

          <button
            onClick={() => onNavigate?.('binder-generator')}
            className="bg-white border border-white/10 rounded p-4 hover:bg-white/5 text-left transition-colors"
          >
            <FileText className="w-6 h-6 text-green-400 mb-2" />
            <div className="font-semibold text-slate-100">Dynamic Binder</div>
            <div className="text-xs text-slate-300 mt-1">Generate workpaper binder</div>
          </button>

          <button
            onClick={() => onNavigate?.('risk-dashboard')}
            className="bg-white border border-white/10 rounded p-4 hover:bg-white/5 text-left transition-colors"
          >
            <Shield className="w-6 h-6 text-red-400 mb-2" />
            <div className="font-semibold text-slate-100">Risk Dashboard</div>
            <div className="text-xs text-slate-300 mt-1">View risk & quality</div>
          </button>
        </div>

        {/* Platform Capabilities */}
        <div className="bg-blue-500/10 border border-blue-300 rounded px-4 py-3">
          <h3 className="font-semibold text-blue-300 mb-3">Platform Capabilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-2 text-blue-300">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Universal Ledger Sync (Xero, MYOB, QB)</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>ATO Prefill & BAS Integration</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>3-Layer AI Review System</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Dynamic Binder Generation</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Risk Scoring & Quality Control</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Practice Analytics & Billing</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Multi-Firm & White Label</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Voice Input & Smart Memos</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Client Portal & Evidence Hub</span>
            </div>
          </div>
        </div>
      </div>
    </WorkpaperLayout>
  );
}

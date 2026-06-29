import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Activity,
  BarChart3,
  Eye,
  Download,
  Plus,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  Calendar,
  Target,
  Award,
  Zap
} from 'lucide-react';

interface ProfessionalDashboardWelcomeProps {
  userRole: 'compliance_officer' | 'partner' | 'analyst' | 'auditor';
  userName: string;
  onNavigate: (view: string) => void;
}

export function ProfessionalDashboardWelcome({ 
  userRole, 
  userName,
  onNavigate 
}: ProfessionalDashboardWelcomeProps) {
  const [currentTime] = useState(new Date());
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Role-specific metrics
  const getRoleMetrics = () => {
    switch(userRole) {
      case 'compliance_officer':
        return [
          { label: 'Active Clients', value: '1,247', change: '+12', trend: 'up', icon: Users, color: 'text-[#13B5EA]' },
          { label: 'Pending Reviews', value: '28', change: '-5', trend: 'down', icon: Clock, color: 'text-[#FFA300]' },
          { label: 'High Risk Clients', value: '15', change: '+2', trend: 'up', icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Compliance Score', value: '96%', change: '+3%', trend: 'up', icon: Award, color: 'text-[#3DD598]' }
        ];
      case 'partner':
        return [
          { label: 'Total Portfolio', value: '$248M', change: '+8.2%', trend: 'up', icon: TrendingUp, color: 'text-[#13B5EA]' },
          { label: 'Active Cases', value: '156', change: '+12', trend: 'up', icon: FileText, color: 'text-[#0E7C9E]' },
          { label: 'Risk Exposure', value: 'Low', change: 'Stable', trend: 'stable', icon: Shield, color: 'text-[#3DD598]' },
          { label: 'Client Satisfaction', value: '98%', change: '+2%', trend: 'up', icon: Target, color: 'text-[#FFA300]' }
        ];
      case 'analyst':
        return [
          { label: 'Transactions Monitored', value: '24.5K', change: '+1.2K', trend: 'up', icon: Activity, color: 'text-[#13B5EA]' },
          { label: 'Alerts Generated', value: '147', change: '+23', trend: 'up', icon: AlertCircle, color: 'text-[#FFA300]' },
          { label: 'False Positives', value: '12%', change: '-3%', trend: 'down', icon: CheckCircle, color: 'text-[#3DD598]' },
          { label: 'Cases Escalated', value: '8', change: '+2', trend: 'up', icon: AlertTriangle, color: 'text-red-400' }
        ];
      default:
        return [
          { label: 'Audits Completed', value: '45', change: '+5', trend: 'up', icon: CheckCircle, color: 'text-[#3DD598]' },
          { label: 'Findings', value: '12', change: '-3', trend: 'down', icon: Eye, color: 'text-[#13B5EA]' },
          { label: 'Compliance Rate', value: '94%', change: '+2%', trend: 'up', icon: Shield, color: 'text-[#0E7C9E]' },
          { label: 'Reports Generated', value: '28', change: '+6', trend: 'up', icon: FileText, color: 'text-[#FFA300]' }
        ];
    }
  };

  const metrics = getRoleMetrics();

  // Priority actions based on role
  const getPriorityActions = () => {
    switch(userRole) {
      case 'compliance_officer':
        return [
          { 
            title: 'Review Pending Verifications', 
            count: 28, 
            urgency: 'high',
            description: '18 require action within 48 hours',
            action: 'Review Now',
            view: 'action_items',
            icon: AlertTriangle
          },
          { 
            title: 'Complete Periodic Reviews', 
            count: 12, 
            urgency: 'medium',
            description: 'Due this week',
            action: 'View Schedule',
            view: 'kyc_dashboard_overview',
            icon: Calendar
          },
          { 
            title: 'High Risk Client Monitoring', 
            count: 15, 
            urgency: 'high',
            description: 'Enhanced due diligence required',
            action: 'Monitor',
            view: 'transaction_monitoring',
            icon: Eye
          }
        ];
      case 'partner':
        return [
          { 
            title: 'Approvals Required', 
            count: 8, 
            urgency: 'high',
            description: 'Executive sign-off needed',
            action: 'Approve',
            view: 'action_items',
            icon: CheckCircle
          },
          { 
            title: 'Client Risk Updates', 
            count: 5, 
            urgency: 'medium',
            description: 'Risk profile changes',
            action: 'Review',
            view: 'partner_dashboard',
            icon: TrendingUp
          },
          { 
            title: 'Regulatory Reports', 
            count: 3, 
            urgency: 'low',
            description: 'Scheduled for this month',
            action: 'Preview',
            view: 'audit_dashboard',
            icon: FileText
          }
        ];
      case 'analyst':
        return [
          { 
            title: 'Transaction Alerts', 
            count: 147, 
            urgency: 'high',
            description: '23 new alerts in last 24 hours',
            action: 'Investigate',
            view: 'transaction_monitoring',
            icon: Activity
          },
          { 
            title: 'Cases for Review', 
            count: 34, 
            urgency: 'medium',
            description: 'Pattern analysis required',
            action: 'Analyze',
            view: 'case_management',
            icon: BarChart3
          },
          { 
            title: 'Screening Results', 
            count: 89, 
            urgency: 'low',
            description: 'Scheduled screenings completed',
            action: 'View',
            view: 'kyc_dashboard_overview',
            icon: Search
          }
        ];
      default:
        return [
          { 
            title: 'Audit Trail Review', 
            count: 12, 
            urgency: 'high',
            description: 'Control testing required',
            action: 'Audit',
            view: 'audit_dashboard',
            icon: Eye
          },
          { 
            title: 'Compliance Checks', 
            count: 8, 
            urgency: 'medium',
            description: 'Sample testing pending',
            action: 'Test',
            view: 'kyc_dashboard_overview',
            icon: CheckCircle
          },
          { 
            title: 'Documentation Review', 
            count: 15, 
            urgency: 'low',
            description: 'Evidence collection',
            action: 'Review',
            view: 'case_management',
            icon: FileText
          }
        ];
    }
  };

  const priorityActions = getPriorityActions();

  // Quick links based on role
  const getQuickLinks = () => {
    const common = [
      { label: 'Global Search', icon: Search, view: 'search', shortcut: '⌘K' },
      { label: 'Client Overview', icon: Users, view: 'kyc_dashboard_overview' },
      { label: 'Settings', icon: Shield, view: 'system_settings' }
    ];

    const roleSpecific = {
      compliance_officer: [
        { label: 'New Client Onboarding', icon: Plus, view: 'client_onboarding' },
        { label: 'Case Management', icon: FileText, view: 'case_management' },
        { label: 'Transaction Monitoring', icon: Activity, view: 'transaction_monitoring' }
      ],
      partner: [
        { label: 'Portfolio Analytics', icon: BarChart3, view: 'partner_dashboard' },
        { label: 'Executive Reports', icon: Download, view: 'audit_dashboard' },
        { label: 'Risk Dashboard', icon: AlertTriangle, view: 'partner_dashboard' }
      ],
      analyst: [
        { label: 'Alert Investigation', icon: AlertCircle, view: 'transaction_monitoring' },
        { label: 'Pattern Analysis', icon: BarChart3, view: 'transaction_monitoring' },
        { label: 'Case Escalation', icon: ArrowRight, view: 'case_management' }
      ],
      auditor: [
        { label: 'Audit Trail', icon: Eye, view: 'audit_dashboard' },
        { label: 'Compliance Testing', icon: CheckCircle, view: 'audit_dashboard' },
        { label: 'Report Generator', icon: Download, view: 'audit_dashboard' }
      ]
    };

    return [...common, ...roleSpecific[userRole]];
  };

  const quickLinks = getQuickLinks();

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'border-l-4 border-red-500 bg-red-500/10';
      case 'medium': return 'border-l-4 border-[#FFA300] bg-orange-500/10';
      case 'low': return 'border-l-4 border-[#13B5EA] bg-blue-500/10';
      default: return 'border-l-4 border-white/10 bg-[#0f172a]';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {getGreeting()}, {userName.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-300 mt-1">
              {currentTime.toLocaleDateString('en-AU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button className="gap-2 bg-[#13B5EA] hover:bg-[#0E7C9E]">
              <Plus className="w-4 h-4" />
              New Client
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-[#0f172a] ${metric.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {metric.trend === 'up' && (
                    <span className="text-sm font-semibold text-[#3DD598] flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {metric.change}
                    </span>
                  )}
                  {metric.trend === 'down' && (
                    <span className="text-sm font-semibold text-[#3DD598] flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 rotate-180" />
                      {metric.change}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-300 mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Priority Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="border-b bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E]">
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="w-5 h-5" />
              Priority Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {priorityActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg ${getUrgencyColor(action.urgency)} cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => onNavigate(action.view)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5 text-slate-300" />
                          <h3 className="font-semibold text-white">{action.title}</h3>
                          <span className="px-2 py-1 bg-[#1e293b] rounded-full text-sm font-bold text-white">
                            {action.count}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 ml-8">{action.description}</p>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-[#1e293b] text-white hover:bg-white/5 shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(action.view);
                        }}
                      >
                        {action.action}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader className="border-b bg-gradient-to-r from-[#3DD598] to-[#13B5EA]">
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5" />
              Quick Access
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <button
                    key={index}
                    onClick={() => onNavigate(link.view)}
                    className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-white/10 hover:border-[#13B5EA] hover:bg-blue-500/10 transition-all group"
                  >
                    <Icon className="w-6 h-6 text-slate-300 group-hover:text-[#13B5EA] mb-2" />
                    <span className="text-sm font-medium text-white text-center">{link.label}</span>
                    {link.shortcut && (
                      <span className="text-xs text-slate-400 mt-1">{link.shortcut}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#3DD598]" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#3DD598] animate-pulse"></div>
              <div>
                <p className="text-sm text-slate-300">All Systems</p>
                <p className="font-semibold text-white">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#3DD598]"></div>
              <div>
                <p className="text-sm text-slate-300">Integrations</p>
                <p className="font-semibold text-white">50/50 Active</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#3DD598]"></div>
              <div>
                <p className="text-sm text-slate-300">Last Sync</p>
                <p className="font-semibold text-white">2 mins ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#3DD598]"></div>
              <div>
                <p className="text-sm text-slate-300">Data Quality</p>
                <p className="font-semibold text-white">99.8%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

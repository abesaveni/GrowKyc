import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  User,
  Building,
  Globe,
  DollarSign,
  FileText,
  RefreshCw,
  PlayCircle,
  Download,
  Bell,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Search,
  Zap,
  Target,
  Radio,
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface MonitoringData {
  alertsLast30Days: number;
  activeAlerts: number;
  nameChanges: number;
  addressChanges: number;
  ownershipChanges: number;
}

interface EnhancedMonitoringTabProps {
  clientId: string;
  clientName: string;
  monitoringData: MonitoringData;
}

interface CheckType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  lastRun?: string;
  nextScheduled?: string;
  status: 'Current' | 'Due' | 'Running' | 'Never Run';
  provider: string;
  cost?: string;
}

interface Alert {
  id: string;
  type: 'High' | 'Medium' | 'Low';
  category: string;
  title: string;
  description: string;
  date: string;
  status: 'Active' | 'Resolved' | 'Investigating';
  assignedTo?: string;
}

export function EnhancedMonitoringTab({ clientId, clientName, monitoringData }: EnhancedMonitoringTabProps) {
  const [runningCheck, setRunningCheck] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Available checks configuration
  const availableChecks: CheckType[] = [
    {
      id: 'aml-screening',
      name: 'AML/Sanctions Screening',
      description: 'Screen against global sanctions lists, PEP databases, and adverse media',
      icon: Shield,
      lastRun: '2026-03-20',
      nextScheduled: '2026-04-20',
      status: 'Current',
      provider: 'World-Check',
      cost: '$45.00'
    },
    {
      id: 'credit-check',
      name: 'Credit Report',
      description: 'Pull latest commercial or personal credit report',
      icon: DollarSign,
      lastRun: '2026-02-15',
      nextScheduled: '2026-05-15',
      status: 'Current',
      provider: 'Equifax',
      cost: '$29.00'
    },
    {
      id: 'company-search',
      name: 'Company Extract',
      description: 'Refresh ASIC company details, directors, and shareholders',
      icon: Building,
      lastRun: '2026-03-15',
      nextScheduled: '2026-04-15',
      status: 'Current',
      provider: 'ASIC',
      cost: '$39.00'
    },
    {
      id: 'identity-verification',
      name: 'Identity Re-verification',
      description: 'Re-verify identity documents and conduct liveness check',
      icon: User,
      lastRun: '2025-08-10',
      nextScheduled: '2026-08-10',
      status: 'Current',
      provider: 'GreenID',
      cost: '$12.50'
    },
    {
      id: 'address-verification',
      name: 'Address Verification',
      description: 'Verify current residential or business address',
      icon: Globe,
      lastRun: '2026-01-20',
      nextScheduled: '2026-04-20',
      status: 'Due',
      provider: 'InfoTrack',
      cost: '$6.50'
    },
    {
      id: 'police-check',
      name: 'Police Check',
      description: 'National police check for disclosable court outcomes',
      icon: Shield,
      lastRun: '2025-08-10',
      nextScheduled: '2026-08-10',
      status: 'Current',
      provider: 'InfoTrack',
      cost: '$42.00'
    },
    {
      id: 'adverse-media',
      name: 'Adverse Media Scan',
      description: 'Scan global news sources for negative press',
      icon: FileText,
      lastRun: '2026-03-18',
      nextScheduled: '2026-04-18',
      status: 'Current',
      provider: 'World-Check',
      cost: '$25.00'
    },
    {
      id: 'court-search',
      name: 'Court Records Search',
      description: 'Search all jurisdictions for court judgements and litigation',
      icon: Building,
      lastRun: '2026-02-10',
      nextScheduled: '2026-05-10',
      status: 'Current',
      provider: 'InfoTrack',
      cost: '$55.00'
    },
    {
      id: 'bankruptcy-search',
      name: 'Bankruptcy Search',
      description: 'AFSA National Personal Insolvency Index search',
      icon: AlertTriangle,
      lastRun: '2026-01-05',
      nextScheduled: '2026-07-05',
      status: 'Due',
      provider: 'InfoTrack',
      cost: '$12.00'
    },
    {
      id: 'director-search',
      name: 'Director Search',
      description: 'Comprehensive director and disqualification search',
      icon: User,
      lastRun: '2026-03-10',
      nextScheduled: '2026-06-10',
      status: 'Current',
      provider: 'ASIC',
      cost: '$85.00'
    }
  ];

  // Sample alerts data - would come from database
  const alerts: Alert[] = clientId === 'client-004' ? [
    {
      id: 'ALT-001',
      type: 'High',
      category: 'Sanctions',
      title: 'New Sanctions Match Detected',
      description: 'Related entity "Mediterranean Trading Corp" added to EU sanctions list',
      date: '2026-03-21',
      status: 'Active',
      assignedTo: 'compliance@grow.com'
    },
    {
      id: 'ALT-002',
      type: 'High',
      category: 'Adverse Media',
      title: 'Negative Press Coverage',
      description: 'Reuters article mentions company in sanctions evasion investigation',
      date: '2026-03-20',
      status: 'Active',
      assignedTo: 'compliance@grow.com'
    },
    {
      id: 'ALT-003',
      type: 'Medium',
      category: 'Financial',
      title: 'Unusual Transaction Pattern',
      description: '15 transactions to high-risk jurisdictions in past 7 days',
      date: '2026-03-19',
      status: 'Investigating',
      assignedTo: 'aml.team@grow.com'
    },
    {
      id: 'ALT-004',
      type: 'High',
      category: 'Legal',
      title: 'New Court Judgement',
      description: 'Default judgement entered for $280,000',
      date: '2026-03-18',
      status: 'Active'
    },
    {
      id: 'ALT-005',
      type: 'Medium',
      category: 'Ownership',
      title: 'Director Change Detected',
      description: 'New director appointed - requires verification',
      date: '2026-03-15',
      status: 'Resolved',
      assignedTo: 'kyc.team@grow.com'
    }
  ] : [
    {
      id: 'ALT-010',
      type: 'Low',
      category: 'Address',
      title: 'Address Update Detected',
      description: 'Electoral roll shows new residential address',
      date: '2026-03-10',
      status: 'Resolved',
      assignedTo: 'kyc.team@grow.com'
    },
    {
      id: 'ALT-011',
      type: 'Low',
      category: 'Monitoring',
      title: 'Scheduled Review Due',
      description: 'Annual KYC refresh due in 30 days',
      date: '2026-03-05',
      status: 'Active',
      assignedTo: 'kyc.team@grow.com'
    }
  ];

  // Monitoring timeline events
  const timelineEvents = [
    {
      date: '2026-03-21 14:32:15',
      type: 'alert',
      severity: 'high',
      title: 'High Risk Alert Triggered',
      description: 'Sanctions screening detected new match',
      user: 'system@grow.com'
    },
    {
      date: '2026-03-20 09:15:00',
      type: 'check',
      severity: 'info',
      title: 'AML Screening Completed',
      description: 'Scheduled monthly screening executed',
      user: 'system@grow.com'
    },
    {
      date: '2026-03-18 16:45:30',
      type: 'alert',
      severity: 'medium',
      title: 'Adverse Media Hit',
      description: 'New negative press article detected',
      user: 'system@grow.com'
    },
    {
      date: '2026-03-15 11:20:00',
      type: 'change',
      severity: 'medium',
      title: 'Company Information Changed',
      description: 'ASIC records show director change',
      user: 'system@grow.com'
    },
    {
      date: '2026-03-14 10:00:00',
      type: 'check',
      severity: 'info',
      title: 'Credit Check Completed',
      description: 'Commercial credit report updated',
      user: 'compliance@grow.com'
    },
    {
      date: '2026-03-10 13:30:00',
      type: 'review',
      severity: 'info',
      title: 'Manual Review Completed',
      description: 'Risk assessment updated by compliance team',
      user: 'compliance@grow.com'
    }
  ];

  const handleRunCheck = (checkId: string) => {
    setRunningCheck(checkId);
    
    // Simulate check execution
    setTimeout(() => {
      setRunningCheck(null);
      // In real app, would refresh data and show results
    }, 3000);
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'High': return 'bg-red-500/15 text-red-300 border-red-300';
      case 'Medium': return 'bg-orange-500/15 text-orange-300 border-orange-300';
      case 'Low': return 'bg-yellow-500/15 text-yellow-300 border-yellow-300';
      default: return 'bg-white/5 text-slate-100 border-white/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Current': return 'bg-green-500/15 text-green-300 border-green-300';
      case 'Due': return 'bg-orange-500/15 text-orange-300 border-orange-300';
      case 'Running': return 'bg-blue-500/15 text-blue-300 border-blue-300';
      case 'Never Run': return 'bg-white/5 text-slate-100 border-white/10';
      default: return 'bg-white/5 text-slate-100 border-white/10';
    }
  };

  const getAlertStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-red-500/15 text-red-300 border-red-300';
      case 'Investigating': return 'bg-orange-500/15 text-orange-300 border-orange-300';
      case 'Resolved': return 'bg-green-500/15 text-green-300 border-green-300';
      default: return 'bg-white/5 text-slate-100 border-white/10';
    }
  };

  const activeAlerts = alerts.filter(a => a.status === 'Active').length;
  const highPriorityAlerts = alerts.filter(a => a.type === 'High').length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-2 border-cyan-300 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-cyan-400" />
              <TrendingUp className="w-6 h-6 text-cyan-500" />
            </div>
            <p className="text-sm text-slate-300 mb-1">Active Monitoring</p>
            <p className="text-4xl font-bold text-cyan-300">24/7</p>
            <p className="text-xs text-cyan-400 mt-2">Real-time surveillance</p>
          </CardContent>
        </Card>

        <Card className={`border-2 shadow-lg ${activeAlerts > 0 ? 'border-red-400 bg-gradient-to-br from-red-50 to-orange-50' : 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Bell className={`w-8 h-8 ${activeAlerts > 0 ? 'text-red-400' : 'text-green-400'}`} />
              {activeAlerts > 0 ? (
                <AlertTriangle className="w-6 h-6 text-red-500" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>
            <p className="text-sm text-slate-300 mb-1">Active Alerts</p>
            <p className={`text-4xl font-bold ${activeAlerts > 0 ? 'text-red-300' : 'text-green-300'}`}>
              {activeAlerts}
            </p>
            <p className="text-xs text-slate-300 mt-2">{alerts.length} total alerts (30d)</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-300 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-purple-400" />
              <Radio className="w-6 h-6 text-purple-500 animate-pulse" />
            </div>
            <p className="text-sm text-slate-300 mb-1">Checks Available</p>
            <p className="text-4xl font-bold text-purple-300">{availableChecks.length}</p>
            <p className="text-xs text-purple-400 mt-2">Run on-demand</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-300 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-orange-400" />
              <TrendingDown className="w-6 h-6 text-orange-500" />
            </div>
            <p className="text-sm text-slate-300 mb-1">Changes Detected</p>
            <p className="text-4xl font-bold text-orange-300">
              {monitoringData.nameChanges + monitoringData.addressChanges + monitoringData.ownershipChanges}
            </p>
            <p className="text-xs text-orange-400 mt-2">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts Section */}
      <Card className="border-2 border-red-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-red-400" />
              Active Alerts & Notifications
            </div>
            <Badge className="bg-red-600 text-white px-3 py-1">
              {activeAlerts} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {alerts.filter(a => a.status === 'Active').length === 0 ? (
              <div className="bg-green-500/10 rounded-lg p-8 border-2 border-green-500/30 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-lg font-semibold text-green-300">No Active Alerts</p>
                <p className="text-sm text-green-400 mt-1">All monitoring checks are clear</p>
              </div>
            ) : (
              alerts.filter(a => a.status === 'Active').map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-lg p-4 border-2 ${
                    alert.type === 'High' ? 'bg-red-500/10 border-red-300' :
                    alert.type === 'Medium' ? 'bg-orange-500/10 border-orange-300' :
                    'bg-yellow-500/10 border-yellow-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getAlertColor(alert.type)} border px-2 py-0.5`}>
                          {alert.type} Priority
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {alert.category}
                        </Badge>
                        <span className="text-xs text-slate-400">{alert.date}</span>
                      </div>
                      <h4 className="font-semibold text-slate-100 mb-1">{alert.title}</h4>
                      <p className="text-sm text-slate-300 mb-2">{alert.description}</p>
                      {alert.assignedTo && (
                        <p className="text-xs text-slate-400">Assigned to: {alert.assignedTo}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Show resolved alerts summary */}
          {alerts.filter(a => a.status === 'Resolved').length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <button className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                View {alerts.filter(a => a.status === 'Resolved').length} resolved alerts
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Run On-Demand Checks */}
      <Card className="border-2 border-blue-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-400" />
            Run On-Demand Verification Checks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {availableChecks.map((check) => {
              const Icon = check.icon;
              const isRunning = runningCheck === check.id;
              const isDue = check.status === 'Due';
              
              return (
                <div
                  key={check.id}
                  className={`rounded-lg border-2 p-4 transition-all ${
                    isRunning ? 'bg-blue-500/10 border-blue-400 shadow-lg' :
                    isDue ? 'bg-orange-500/10 border-orange-300' :
                    'bg-white border-white/10 hover:border-cyan-400 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-lg ${
                      isRunning ? 'bg-blue-500/20' :
                      isDue ? 'bg-orange-500/20' :
                      'bg-cyan-500/15'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        isRunning ? 'text-blue-300' :
                        isDue ? 'text-orange-300' :
                        'text-cyan-300'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-slate-100">{check.name}</h4>
                        {isDue && (
                          <Badge className="bg-orange-500/15 text-orange-300 border-orange-300 border text-xs">
                            Due
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mb-3">{check.description}</p>
                      
                      {/* Check Status Info */}
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div>
                          <p className="text-slate-400">Last Run</p>
                          <p className="font-semibold">{check.lastRun || 'Never'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Provider</p>
                          <p className="font-semibold">{check.provider}</p>
                        </div>
                      </div>

                      {/* Next scheduled */}
                      {check.nextScheduled && (
                        <div className="mb-3 text-xs bg-white/5 rounded p-2">
                          <p className="text-slate-400">Next Scheduled: {check.nextScheduled}</p>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">{check.cost}</span>
                        <Button
                          size="sm"
                          onClick={() => handleRunCheck(check.id)}
                          disabled={isRunning}
                          className={`${
                            isRunning 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : isDue
                              ? 'bg-orange-600 hover:bg-orange-700'
                              : 'bg-cyan-600 hover:bg-cyan-700'
                          }`}
                        >
                          {isRunning ? (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              Running...
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-3 h-3 mr-1" />
                              Run Check
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bulk Actions */}
          <div className="mt-6 pt-6 border-t flex gap-3">
            <Button className="bg-cyan-600 hover:bg-cyan-700 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Run All Due Checks ({availableChecks.filter(c => c.status === 'Due').length})
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Checks
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Check History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Timeline */}
      <Card className="border-2 border-purple-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-purple-400" />
              Monitoring Timeline
            </div>
            <div className="flex gap-2">
              {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    selectedTimeRange === range
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-slate-300 hover:bg-purple-500/10'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
                </button>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[20px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 via-blue-300 to-cyan-300" />
            
            {/* Timeline Events */}
            <div className="space-y-4">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="relative pl-12">
                  {/* Timeline Dot */}
                  <div className={`absolute left-[11px] top-[6px] w-5 h-5 rounded-full border-4 ${
                    event.severity === 'high' ? 'bg-red-500 border-red-500/30' :
                    event.severity === 'medium' ? 'bg-orange-500 border-orange-500/30' :
                    'bg-cyan-500 border-cyan-500/30'
                  }`} />
                  
                  {/* Event Card */}
                  <div className={`rounded-lg p-4 border ${
                    event.severity === 'high' ? 'bg-red-500/10 border-red-500/30' :
                    event.severity === 'medium' ? 'bg-orange-500/10 border-orange-500/30' :
                    'bg-cyan-500/10 border-cyan-500/30'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                          <span className="text-xs text-slate-400">{event.date}</span>
                        </div>
                        <h4 className="font-semibold text-slate-100">{event.title}</h4>
                        <p className="text-sm text-slate-300 mt-1">{event.description}</p>
                        <p className="text-xs text-slate-400 mt-2">By: {event.user}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-6 text-center">
              <Button variant="outline" className="flex items-center gap-2 mx-auto">
                <RefreshCw className="w-4 h-4" />
                Load More Events
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Detection Summary */}
      <Card className="border-2 border-green-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-400" />
            Change Detection Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <User className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Name Changes</p>
                  <p className="text-3xl font-bold text-blue-300">{monitoringData.nameChanges}</p>
                </div>
              </div>
              <div className="w-full bg-blue-500/20 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${Math.min(monitoringData.nameChanges * 50, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Globe className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Address Changes</p>
                  <p className="text-3xl font-bold text-purple-300">{monitoringData.addressChanges}</p>
                </div>
              </div>
              <div className="w-full bg-purple-500/20 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-purple-600"
                  style={{ width: `${Math.min(monitoringData.addressChanges * 50, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 border-2 border-orange-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <Building className="w-6 h-6 text-orange-300" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Ownership Changes</p>
                  <p className="text-3xl font-bold text-orange-300">{monitoringData.ownershipChanges}</p>
                </div>
              </div>
              <div className="w-full bg-orange-500/20 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-orange-600"
                  style={{ width: `${Math.min(monitoringData.ownershipChanges * 50, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

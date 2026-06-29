import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Activity,
  ArrowRight,
  Eye,
  Flag,
  UserCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ClientsDB } from '../kyc/ClientsDatabase';
import {
  getComplianceDashboardMetrics,
  getAllComplianceCases,
  personaIdFromDisplayName,
} from '../cases/complianceCaseUtils';
import { daysSinceDate } from '../cases/complianceCaseSeedData';

export interface HeadOfComplianceDashboardProps {
  userName: string;
  userTitle: string;
  userAvatar: string;
  onNavigateToClients?: () => void;
  onNavigateToCases?: () => void;
  onNavigateToCaseControl?: () => void;
  onNavigateToMonitoring?: () => void;
  onNavigateToAUSTRAC?: () => void;
  onNavigateToActionItems?: () => void;
  onNavigateToClient?: (clientId: string) => void;
  onNavigateToRequirements?: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Activity,
};

export function HeadOfComplianceDashboard({
  userName,
  userTitle,
  userAvatar,
  onNavigateToClients,
  onNavigateToCases,
  onNavigateToCaseControl,
  onNavigateToMonitoring,
  onNavigateToAUSTRAC,
  onNavigateToActionItems,
  onNavigateToClient,
  onNavigateToRequirements,
}: HeadOfComplianceDashboardProps) {
  const navigate = useNavigate();
  const { role } = useParams();
  const [clients, setClients] = React.useState<any[]>([]);
  const [caseRefreshKey, setCaseRefreshKey] = React.useState(0);
  const [loggedActivities, setLoggedActivities] = React.useState<any[]>([]);
  const [riskTrendData, setRiskTrendData] = React.useState<
    { month: string; high: number; medium: number; low: number }[]
  >([]);
  const [verificationStatusData, setVerificationStatusData] = React.useState([
    { name: 'Verified', value: 0, color: '#10b981' },
    { name: 'Pending', value: 0, color: '#f59e0b' },
    { name: 'Rejected', value: 0, color: '#ef4444' },
  ]);

  React.useEffect(() => {
    setClients(ClientsDB.getClients());
    return ClientsDB.subscribe(setClients);
  }, []);

  React.useEffect(() => {
    const onCasesUpdated = () => setCaseRefreshKey((k) => k + 1);
    window.addEventListener('growkyc:cases_updated', onCasesUpdated);
    window.addEventListener('growkyc:clients_updated', onCasesUpdated);
    return () => {
      window.removeEventListener('growkyc:cases_updated', onCasesUpdated);
      window.removeEventListener('growkyc:clients_updated', onCasesUpdated);
    };
  }, []);

  React.useEffect(() => {
    const saved = localStorage.getItem('growkyc_logged_activities');
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) setLoggedActivities(parsed);
    } catch {
      /* ignore */
    }
    const handler = () => {
      const raw = localStorage.getItem('growkyc_logged_activities');
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setLoggedActivities(parsed);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('growkyc:activity_logged', handler);
    return () => window.removeEventListener('growkyc:activity_logged', handler);
  }, []);

  React.useEffect(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const last6Months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      last6Months.push(months[(currentMonthIdx - i + 12) % 12]);
    }

    if (clients.length === 0) {
      setRiskTrendData(last6Months.map((m) => ({ month: m, high: 0, medium: 0, low: 0 })));
      setVerificationStatusData([
        { name: 'Verified', value: 0, color: '#10b981' },
        { name: 'Pending', value: 0, color: '#f59e0b' },
        { name: 'Rejected', value: 0, color: '#ef4444' },
      ]);
      return;
    }

    setRiskTrendData(
      last6Months.map((m) => {
        let high = 0;
        let medium = 0;
        let low = 0;
        clients.forEach((c) => {
          const dateObj = c.lastReview ? new Date(c.lastReview) : new Date();
          if (months[dateObj.getMonth()] === m) {
            if (c.amlData?.riskRating === 'Critical' || c.amlData?.riskRating === 'High') high++;
            else if (c.amlData?.riskRating === 'Medium') medium++;
            else low++;
          }
        });
        return { month: m, high, medium, low };
      })
    );

    let verified = 0;
    let pending = 0;
    let rejected = 0;
    clients.forEach((c) => {
      if (c.status === 'Active') verified++;
      else if (c.status === 'Under Review' || c.status === 'Pending') pending++;
      else if (c.status === 'Suspended') rejected++;
    });
    setVerificationStatusData([
      { name: 'Verified', value: verified, color: '#10b981' },
      { name: 'Pending', value: pending, color: '#f59e0b' },
      { name: 'Rejected', value: rejected, color: '#ef4444' },
    ]);
  }, [clients, caseRefreshKey]);

  const stats = React.useMemo(() => {
    const total = clients.length;
    const activeClients = clients.filter((c) => c.status === 'Active' || c.status === 'verified').length;
    const pendingReviews = clients.filter((c) => c.status === 'Under Review' || c.status === 'pending').length;
    const highRiskAlerts = clients.filter(
      (c) => c.amlData?.riskRating === 'High' || c.amlData?.riskRating === 'Critical'
    ).length;
    const urgentActions = clients.filter(
      (c) => c.status === 'Suspended' || c.status === 'Under Review' || c.amlData?.riskRating === 'Critical'
    ).length;
    const verifiedClients = clients.filter(
      (c) => c.quickStatus?.identity === 'Verified' || c.status === 'Active'
    ).length;
    const complianceRate = total > 0 ? `${Math.round((verifiedClients / total) * 100)}%` : '100%';

    return {
      totalClients: total,
      pendingReviews,
      highRiskAlerts,
      activeClients,
      complianceRate,
      urgentActions,
      completedToday: clients.filter((c) => c.lastReview === new Date().toISOString().split('T')[0]).length,
      teamPerformance: total > 0 ? `${Math.round((verifiedClients / total) * 100)}%` : '0%',
    };
  }, [clients]);

  const metrics = React.useMemo(
    () => getComplianceDashboardMetrics(personaIdFromDisplayName(userName)),
    [clients, caseRefreshKey, userName]
  );

  const dueThisWeek = React.useMemo(
    () =>
      clients.filter((c) => {
        if (!c.nextReview) return false;
        const due = new Date(c.nextReview);
        const now = new Date();
        const week = new Date(now);
        week.setDate(week.getDate() + 7);
        return due >= now && due <= week;
      }).length,
    [clients]
  );

  const clientsToWatch = React.useMemo(() => {
    const allCases = getAllComplianceCases();
    return clients
      .filter(
        (c) =>
          c.amlData?.riskRating === 'High' ||
          c.amlData?.riskRating === 'Critical' ||
          c.status === 'Suspended'
      )
      .map((c) => {
        const linkedCase = allCases.find((cs) => cs.clientId === c.id || cs.clientName === c.name);
        const isCritical = c.amlData?.riskRating === 'Critical' || c.status === 'Suspended';
        return {
          id: c.id,
          name: c.name,
          reason: linkedCase
            ? `${linkedCase.caseType} — ${linkedCase.triggerSource}`
            : c.status === 'Suspended'
              ? 'Sanctions Match - Pending Review'
              : 'High Risk — EDD Required',
          riskLevel: c.amlData?.riskRating || 'High',
          daysOpen: linkedCase
            ? daysSinceDate(linkedCase.created)
            : daysSinceDate(c.lastReview || new Date().toISOString().slice(0, 10)),
          assignee: linkedCase?.assignedTo || userName,
          urgency: isCritical ? 'critical' : 'high',
          icon: isCritical ? AlertTriangle : Flag,
          color: isCritical ? 'text-red-600 bg-red-100' : 'text-orange-600 bg-orange-100',
        };
      });
  }, [clients, userName, caseRefreshKey]);

  const priorityActions = React.useMemo(
    () =>
      clients
        .filter(
          (c) =>
            c.status === 'Under Review' ||
            c.status === 'Suspended' ||
            c.amlData?.riskRating === 'High' ||
            c.amlData?.riskRating === 'Critical'
        )
        .map((c) => ({
          client: c.name,
          action: c.status === 'Under Review' ? 'EDD Review Required' : 'Document Verification',
          risk: c.amlData?.riskRating || 'High',
          urgent: c.amlData?.riskRating === 'Critical' || c.amlData?.riskRating === 'High',
        })),
    [clients]
  );

  const recentActivity = React.useMemo(() => {
    const fromLog = loggedActivities.slice(0, 5).map((a: any) => ({
      user: a.user || userName,
      action: a.action,
      time: a.time || 'Recently',
      icon: ICON_MAP[a.iconName] || Activity,
      color: a.color || 'text-blue-600',
    }));
    if (fromLog.length > 0) return fromLog;
    return clients.slice(0, 5).map((c) => ({
      user: c.status === 'Active' ? userName : 'System',
      action: c.status === 'Active' ? `verified ${c.name}` : `reviewing ${c.name}`,
      time: c.lastReview || 'Recently',
      icon: c.status === 'Active' ? CheckCircle : UserCheck,
      color: c.status === 'Active' ? 'text-green-600' : 'text-blue-600',
    }));
  }, [clients, loggedActivities, userName]);

  const navCase = onNavigateToCaseControl || onNavigateToCases;

  return (
    <div className="space-y-6 md:space-y-8 bg-white min-h-screen px-4 md:px-8 pb-8">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 md:p-12 text-white shadow-lg mt-4 md:mt-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 text-center sm:text-left">
          <div className="text-5xl md:text-6xl">{userAvatar}</div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Welcome back, {userName.split(' ')[0]}!</h1>
            <p className="text-white/90 text-sm md:text-xl">
              {userTitle} •{' '}
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
          <div
            onClick={navCase}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 cursor-pointer hover:bg-white/20 hover:scale-105 transition-all duration-300 h-32 md:h-40 flex flex-col justify-between"
          >
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{stats.pendingReviews}</div>
              <div className="text-xs md:text-sm text-white/90 font-medium">Pending Reviews</div>
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Click to view</div>
          </div>
          <div
            onClick={onNavigateToMonitoring}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 cursor-pointer hover:bg-white/20 hover:scale-105 transition-all duration-300 h-32 md:h-40 flex flex-col justify-between"
          >
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{stats.highRiskAlerts}</div>
              <div className="text-xs md:text-sm text-white/90 font-medium">High Risk Alerts</div>
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Click to view</div>
          </div>
          <div
            onClick={onNavigateToClients}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 cursor-pointer hover:bg-white/20 hover:scale-105 transition-all duration-300 h-32 md:h-40 flex flex-col justify-between"
          >
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{stats.totalClients}</div>
              <div className="text-xs md:text-sm text-white/90 font-medium">Total Clients</div>
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">{stats.activeClients} active</div>
          </div>
          <div
            onClick={onNavigateToRequirements}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 cursor-pointer hover:bg-white/20 hover:scale-105 transition-all duration-300 h-32 md:h-40 flex flex-col justify-between"
          >
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{stats.complianceRate}</div>
              <div className="text-xs md:text-sm text-white/90 font-medium">Compliance Rate</div>
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Click to view</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card
          className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-all h-36 md:h-40 flex flex-col cursor-pointer"
          onClick={onNavigateToActionItems}
        >
          <CardContent className="p-4 md:p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{stats.urgentActions}</div>
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Urgent Actions</div>
              <p className="text-[9px] md:text-[10px] text-red-600 font-black mt-2">
                {metrics.slaBreaches > 0 ? `${metrics.slaBreaches} SLA BREACH` : 'NONE OVERDUE'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all h-36 md:h-40 flex flex-col">
          <CardContent className="p-4 md:p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{stats.pendingReviews}</div>
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-amber-500" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Pending Approvals</div>
              <p className="text-[9px] md:text-[10px] text-gray-500 font-black mt-2">{dueThisWeek} DUE THIS WEEK</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all h-36 md:h-40 flex flex-col">
          <CardContent className="p-4 md:p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{stats.completedToday}</div>
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Completed Today</div>
              <p className="text-[9px] md:text-[10px] text-green-600 font-black mt-2">{stats.complianceRate} COMPLIANCE</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all h-36 md:h-40 flex flex-col">
          <CardContent className="p-4 md:p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-3xl md:text-4xl font-bold text-gray-900">{stats.teamPerformance}</div>
              <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide">Team Performance</div>
              <p className="text-[9px] md:text-[10px] text-gray-500 font-black mt-2">TEAM AVG SCORE</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2 border-2 border-red-300 shadow-lg cursor-pointer hover:shadow-xl transition-all hover:border-red-400"
          onClick={onNavigateToAUSTRAC}
        >
          <CardHeader className="bg-gray-50 border-b border-red-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-red-900">
                  <Shield className="w-5 h-5" />
                  AUSTRAC Reporting Control Centre
                </CardTitle>
                <CardDescription className="text-red-700 mt-1">
                  SMR workflow, reportable matter triage, submission tracking, and regulatory evidence packs
                </CardDescription>
              </div>
              <Button
                className="bg-red-700 hover:bg-red-800 text-white shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToAUSTRAC?.();
                }}
              >
                Open Centre
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Open Matters', value: metrics.investigationCases + metrics.escalations },
                { label: 'Draft SMRs', value: metrics.pendingInformationCases },
                { label: 'Monitoring Alerts', value: metrics.monitoringAlerts },
                { label: 'SLA At Risk', value: metrics.slaBreaches },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-lg bg-white border border-red-100 text-center">
                  <p className="text-2xl font-bold text-red-900">{item.value}</p>
                  <p className="text-xs font-semibold text-gray-600 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 shadow-sm">
          <CardHeader className="border-b bg-amber-50">
            <CardTitle className="text-base flex items-center gap-2 text-amber-900">
              <Clock className="w-4 h-4" />
              Regulatory Clocks
            </CardTitle>
            <CardDescription>AUSTRAC and cross-regulator deadlines</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {[
              {
                type: 'AUSTRAC SMR',
                description: 'Suspicious matter assessment window',
                daysRemaining: metrics.slaBreaches > 0 ? 2 : 7,
                status: metrics.slaBreaches > 0 ? 'red' : 'amber',
              },
              {
                type: 'AUSTRAC Enrolment',
                description: 'Tranche 2 enrolment milestone',
                daysRemaining: 136,
                status: 'green',
              },
              {
                type: 'EDD Reviews',
                description: 'Enhanced due diligence queue',
                daysRemaining: metrics.eddCases > 0 ? 5 : 14,
                status: metrics.eddCases > 0 ? 'amber' : 'green',
              },
            ].map((clock) => (
              <div
                key={clock.type}
                className={`p-3 rounded-lg border ${
                  clock.status === 'red'
                     ? 'bg-red-50 border-red-200'
                     : clock.status === 'amber'
                       ? 'bg-amber-50 border-amber-200'
                       : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-gray-900">{clock.type}</span>
                  <Badge
                    className={
                      clock.status === 'red'
                        ? 'bg-red-600 text-white'
                        : clock.status === 'amber'
                          ? 'bg-amber-600 text-white'
                          : 'bg-green-600 text-white'
                    }
                  >
                    {clock.daysRemaining}d
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{clock.description}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full border-red-200 text-red-800 hover:bg-red-50" onClick={onNavigateToAUSTRAC}>
              Manage in AUSTRAC Centre
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Risk Trend Analysis</CardTitle>
            <CardDescription>Client risk distribution over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="high" stackId="1" stroke="#ef4444" fill="#ef4444" name="High Risk" />
                <Area type="monotone" dataKey="medium" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Medium Risk" />
                <Area type="monotone" dataKey="low" stackId="1" stroke="#10b981" fill="#10b981" name="Low Risk" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Current client verification overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie data={verificationStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                    {verificationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {verificationStatusData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <div>
                      <div className="font-semibold text-sm">{item.value}</div>
                      <div className="text-xs text-gray-600">{item.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-red-900">
                <Eye className="w-5 h-5" />
                Clients to Watch
              </CardTitle>
              <CardDescription className="text-red-700">High-priority clients requiring immediate attention</CardDescription>
            </div>
            <Badge variant="destructive" className="text-base px-3 py-1">
              {clientsToWatch.length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {clientsToWatch.length === 0 ? (
            <p className="text-sm text-gray-600 py-6 text-center">No high-priority clients — onboard clients or raise cases to populate this list.</p>
          ) : (
            <div className="space-y-3">
              {clientsToWatch.map((client, index) => (
                <div
                  key={index}
                  className={`p-4 bg-white rounded-lg border-2 ${
                    client.urgency === 'critical' ? 'border-red-300' : 'border-orange-300'
                  } hover:shadow-md transition-shadow`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg ${client.color} flex items-center justify-center flex-shrink-0`}>
                        <client.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">{client.name}</span>
                          <Badge className={client.urgency === 'critical' ? 'bg-red-600' : 'bg-orange-600'}>{client.riskLevel}</Badge>
                        </div>
                        <p className="text-sm text-gray-700">{client.reason}</p>
                        <p className="text-xs text-gray-500 mt-1">Open {client.daysOpen} days • Assigned to {client.assignee}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        client.id && onNavigateToClient
                          ? onNavigateToClient(client.id)
                          : navigate(`/${role || 'compliance'}/review/${client.name}`)
                      }
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button variant="outline" className="w-full mt-4" onClick={onNavigateToClients}>
            View All Watchlist Clients ({clientsToWatch.length}) →
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between flex-wrap gap-2">
              Priority Action Items
              <Badge variant="destructive">{priorityActions.filter((i) => i.urgent).length} urgent</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {priorityActions.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No priority actions right now.</p>
            ) : (
              <div className="space-y-3">
                {priorityActions.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      item.urgent ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm">{item.client}</div>
                      <div className="text-xs text-gray-600">{item.action}</div>
                    </div>
                    <Badge variant={item.risk === 'High' || item.risk === 'Critical' ? 'destructive' : 'default'} className="text-xs">
                      {item.risk}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activity
              <Button variant="ghost" size="sm" onClick={onNavigateToCases}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Activity,
  Target,
  Bell,
  ArrowRight,
  Eye,
  DollarSign,
  BarChart3,
  Zap,
  XCircle,
  AlertCircle,
  Calendar,
  UserCheck,
  Flag,
  Check,
  X,
  MessageSquare,
  Globe
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar
} from 'recharts';

import {
  auditorStats as initialAuditorStats,
  regulatoryComplianceStatusData,
  strategicInsightsData,
  systemHealthData,
  recentAuditActivitiesData,
  complianceCoverageData
} from './mockDashboardData';

import { ClientsDB } from '../kyc/ClientsDatabase';
import { getAllComplianceCases } from '../cases/complianceCaseUtils';
import { daysSinceDate } from '../cases/complianceCaseSeedData';
import { toast } from '../../lib/toast';

interface PersonalizedDashboardProps {
  userName: string;
  userRole: string;
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

export function PersonalizedDashboard({
  userName,
  userRole,
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
}: PersonalizedDashboardProps) {
  const navigate = useNavigate();
  const { role } = useParams();
  const [approvalModalOpen, setApprovalModalOpen] = React.useState(false);
  const [selectedApproval, setSelectedApproval] = React.useState<any>(null);
  const [approvalComment, setApprovalComment] = React.useState('');

  // Partner dynamic stats state
  const [partnerStats, setPartnerStats] = React.useState({
    totalClients: 452,
    activeClients: 326,
    highRiskClients: 13,
    criticalRiskClients: 3,
    openInvestigations: 24,
    openEddReviews: 8,
    smrsSubmitted: 42,
    overdueReviews: 12,
    slaBreaches: 4,
    complianceIncidents: 1,
    targetAchievement: 98.2,
    itemsNeedApproval: 12,
    urgentItems: 3
  });

  const [clients, setClients] = React.useState<any[]>([]);
  const [caseRefreshKey, setCaseRefreshKey] = React.useState(0);

  React.useEffect(() => {
    setClients(ClientsDB.getClients());
    return ClientsDB.subscribe(setClients);
  }, []);

  React.useEffect(() => {
    const onCasesUpdated = () => setCaseRefreshKey((k) => k + 1);
    window.addEventListener('growkyc:cases_updated', onCasesUpdated);
    return () => window.removeEventListener('growkyc:cases_updated', onCasesUpdated);
  }, []);

  // Logged activities state
  const [loggedActivities, setLoggedActivities] = React.useState<any[]>([]);

  const fetchLoggedActivities = React.useCallback(() => {
    const saved = localStorage.getItem('growkyc_logged_activities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setLoggedActivities(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  React.useEffect(() => {
    fetchLoggedActivities();
    
    // Listen for custom logged activity events
    window.addEventListener('growkyc:activity_logged', fetchLoggedActivities);
    return () => {
      window.removeEventListener('growkyc:activity_logged', fetchLoggedActivities);
    };
  }, [fetchLoggedActivities]);

  const ICON_MAP: Record<string, React.ComponentType<any>> = {
    CheckCircle: CheckCircle,
    AlertTriangle: AlertTriangle,
    UserCheck: UserCheck,
    FileText: FileText,
    Activity: Activity
  };

  // Auditor dynamic stats state
  const [auditorStats, setAuditorStats] = React.useState(initialAuditorStats);

  const emptyRiskTrend = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const last6Months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      last6Months.push(months[(currentMonthIdx - i + 12) % 12]);
    }
    return last6Months.map((m) => ({ month: m, high: 0, medium: 0, low: 0 }));
  }, []);

  const [riskTrendData, setRiskTrendData] = React.useState(emptyRiskTrend);
  const [verificationStatusData, setVerificationStatusData] = React.useState([
    { name: 'Verified', value: 0, color: '#10b981' },
    { name: 'Pending', value: 0, color: '#f59e0b' },
    { name: 'Rejected', value: 0, color: '#ef4444' },
  ]);
  const [activityData, setActivityData] = React.useState([
    { day: 'Mon', cases: 0, reviews: 0 },
    { day: 'Tue', cases: 0, reviews: 0 },
    { day: 'Wed', cases: 0, reviews: 0 },
    { day: 'Thu', cases: 0, reviews: 0 },
    { day: 'Fri', cases: 0, reviews: 0 },
  ]);

  // Synchronize dynamic states with clients list
  React.useEffect(() => {
    const total = clients.length;
    if (total === 0) {
      setAuditorStats({
        openFindings: 0,
        complianceChecks: 0,
        criticalIssues: 0,
        overallScore: 100.0,
        mediumFindings: 0,
        resolvedFindings: 0
      });
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonthIdx = new Date().getMonth();
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const mIdx = (currentMonthIdx - i + 12) % 12;
        last6Months.push(months[mIdx]);
      }
      setRiskTrendData(last6Months.map(m => ({ month: m, high: 0, medium: 0, low: 0 })));
      setVerificationStatusData([
        { name: 'Verified', value: 0, color: '#10b981' },
        { name: 'Pending', value: 0, color: '#f59e0b' },
        { name: 'Rejected', value: 0, color: '#ef4444' }
      ]);
      setActivityData([
        { day: 'Mon', cases: 0, reviews: 0 },
        { day: 'Tue', cases: 0, reviews: 0 },
        { day: 'Wed', cases: 0, reviews: 0 },
        { day: 'Thu', cases: 0, reviews: 0 },
        { day: 'Fri', cases: 0, reviews: 0 }
      ]);
      return;
    }

    // Populate using current onboarded clients
    setAuditorStats({
      openFindings: clients.filter(c => c.amlData?.sanctionsMatches > 0 || c.amlData?.pepStatus !== 'Not PEP').length,
      complianceChecks: clients.reduce((acc, c) => acc + (c.documentsData?.total || 0), 0),
      criticalIssues: clients.filter(c => c.amlData?.riskRating === 'Critical').length,
      overallScore: parseFloat((clients.reduce((acc, c) => acc + (c.identityData?.greenIDScore ? (c.identityData.greenIDScore > 100 ? c.identityData.greenIDScore / 10 : c.identityData.greenIDScore) : 85), 0) / total).toFixed(1)),
      mediumFindings: clients.filter(c => c.amlData?.riskRating === 'Medium').length,
      resolvedFindings: clients.filter(c => c.status === 'Active' && c.identityData?.greenIDScore && c.identityData.greenIDScore > 900).length
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const mIdx = (currentMonthIdx - i + 12) % 12;
      last6Months.push(months[mIdx]);
    }
    setRiskTrendData(last6Months.map(m => {
      let high = 0;
      let medium = 0;
      let low = 0;
      clients.forEach(c => {
        const dateObj = c.lastReview ? new Date(c.lastReview) : new Date();
        const reviewMonth = months[dateObj.getMonth()];
        if (reviewMonth === m) {
          if (c.amlData?.riskRating === 'Critical' || c.amlData?.riskRating === 'High') high++;
          else if (c.amlData?.riskRating === 'Medium') medium++;
          else low++;
        }
      });
      return { month: m, high, medium, low };
    }));

    let verified = 0;
    let pending = 0;
    let rejected = 0;
    clients.forEach(c => {
      if (c.status === 'Active') verified++;
      else if (c.status === 'Under Review' || c.status === 'Pending') pending++;
      else if (c.status === 'Suspended') rejected++;
    });
    setVerificationStatusData([
      { name: 'Verified', value: verified, color: '#10b981' },
      { name: 'Pending', value: pending, color: '#f59e0b' },
      { name: 'Rejected', value: rejected, color: '#ef4444' }
    ]);

    setActivityData([
      { day: 'Mon', cases: Math.round(total * 0.1), reviews: Math.round(total * 0.15) },
      { day: 'Tue', cases: Math.round(total * 0.2), reviews: Math.round(total * 0.25) },
      { day: 'Wed', cases: Math.round(total * 0.15), reviews: Math.round(total * 0.2) },
      { day: 'Thu', cases: Math.round(total * 0.3), reviews: Math.round(total * 0.35) },
      { day: 'Fri', cases: Math.round(total * 0.25), reviews: Math.round(total * 0.3) }
    ]);

  }, [clients, caseRefreshKey]);

  // Derived compliance statistics
  const complianceOfficerStats = React.useMemo(() => {
    const total = clients.length;
    const activeClients = clients.filter(c => c.status === 'Active' || c.status === 'verified').length;
    const pendingReviews = clients.filter(c => c.status === 'Under Review' || c.status === 'pending').length;
    const highRiskAlerts = clients.filter(c => c.amlData?.riskRating === 'High' || c.amlData?.riskRating === 'Critical').length;
    const urgentActions = clients.filter(c => c.status === 'Suspended' || c.status === 'Under Review' || c.amlData?.riskRating === 'Critical').length;
    
    const verifiedClients = clients.filter(c => c.quickStatus?.identity === 'Verified' || c.status === 'Active').length;
    const complianceRate = total > 0 ? `${Math.round((verifiedClients / total) * 100)}%` : '100%';

    return {
      totalClients: total,
      pendingReviews,
      highRiskAlerts,
      activeClients,
      complianceRate,
      urgentActions,
      completedToday: clients.filter(c => c.lastReview === new Date().toISOString().split('T')[0]).length,
      teamPerformance: total > 0 ? `${Math.round((verifiedClients / total) * 100)}%` : '0%'
    };
  }, [clients]);

  const activeCasesData = React.useMemo(() => {
    return getAllComplianceCases()
      .filter((c) => c.status !== 'closed')
      .slice(0, 8)
      .map((c) => ({
        caseId: c.id,
        client: c.clientName,
        status: c.status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        days: daysSinceDate(c.created),
        priority: c.riskLevel === 'critical' || c.riskLevel === 'high' ? 'High' : 'Medium',
      }));
  }, [clients, caseRefreshKey]);

  const alertsQueueData = React.useMemo(() => {
    const list: Array<{ id: string; client: string; type: string; amount: string; risk: string; time: string }> = [];
    clients.forEach((c, idx) => {
      if (c.amlData?.sanctionsMatches > 0) {
        list.push({ id: `ALT-${c.id}-${idx}`, client: c.name, type: 'Sanctions Match Detected', amount: '—', risk: 'Critical', time: 'Active' });
      } else if (c.amlData?.riskRating === 'High' || c.amlData?.riskRating === 'Critical') {
        list.push({ id: `ALT-${c.id}-${idx}`, client: c.name, type: 'High Risk Alert', amount: '—', risk: c.amlData.riskRating, time: 'Active' });
      } else if ((c.monitoringData?.activeAlerts || 0) > 0) {
        list.push({ id: `ALT-${c.id}-${idx}`, client: c.name, type: 'Monitoring Alert', amount: '—', risk: 'Medium', time: 'Active' });
      }
    });
    return list;
  }, [clients]);

  const recentActivityData = React.useMemo(() => {
    const fromLog = loggedActivities.slice(0, 5).map((a: any) => ({
      type: a.type || 'review',
      user: a.user || userName,
      action: a.action,
      time: a.time || 'Recently',
      icon: ICON_MAP[a.iconName] || Activity,
      color: a.color || 'text-blue-600',
    }));
    if (fromLog.length > 0) return fromLog;
    return clients.slice(0, 5).map((c) => ({
      type: c.status === 'Active' ? 'approval' : 'review',
      user: c.status === 'Active' ? userName : 'System',
      action: c.status === 'Active' ? `verified ${c.name}` : `reviewing ${c.name}`,
      time: c.lastReview || 'Recently',
      icon: c.status === 'Active' ? CheckCircle : UserCheck,
      color: c.status === 'Active' ? 'text-green-600' : 'text-blue-600',
    }));
  }, [clients, loggedActivities, userName]);

  const partnerApprovalsData = React.useMemo(() => {
    return clients
      .filter(c => c.status === 'Under Review')
      .map(c => ({
        item: `High Risk Client Onboarding - ${c.name}`,
        type: 'New Client',
        priority: c.amlData?.riskRating === 'Critical' || c.amlData?.riskRating === 'High' ? 'High' : 'Medium'
      }));
  }, [clients]);

  React.useEffect(() => {
    if (userRole === 'compliance_officer' || clients.length === 0) return;
    const interval = setInterval(() => {
      // Dynamically update risk trend
      setRiskTrendData(prev => {
        const newData = [...prev];
        const lastMonth = newData[newData.length - 1];
        newData[newData.length - 1] = {
          ...lastMonth,
          high: Math.max(0, lastMonth.high + Math.floor(Math.random() * 3) - 1),
          medium: Math.max(0, lastMonth.medium + Math.floor(Math.random() * 5) - 2),
          low: Math.max(0, lastMonth.low + Math.floor(Math.random() * 7) - 3)
        };
        return newData;
      });

      // Dynamically update verification status
      setVerificationStatusData(prev => {
        return prev.map(item => {
          if (item.name === 'Pending') {
            const resolved = Math.floor(Math.random() * 2);
            return { ...item, value: Math.max(0, item.value - resolved) };
          }
          if (item.name === 'Verified') {
            return { ...item, value: item.value + Math.floor(Math.random() * 2) };
          }
          return item;
        });
      });

      // Dynamically update analyst activity data
      setActivityData(prev => {
        return prev.map(item => {
          if (item.day === 'Fri') {
            return {
              ...item,
              cases: item.cases + (Math.random() > 0.8 ? 1 : 0),
              reviews: item.reviews + (Math.random() > 0.7 ? 1 : 0)
            };
          }
          return item;
        });
      });

      // Dynamically update auditor stats occasionally
      setAuditorStats(prev => {
        const checkChange = Math.random() > 0.6 ? Math.floor(Math.random() * 3) : 0;
        const findingsChange = Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const resolvedChange = Math.random() > 0.8 ? Math.floor(Math.random() * 2) : 0;
        const scoreDelta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 0.1 : -0.1) : 0;

        return {
          openFindings: Math.max(0, prev.openFindings + findingsChange),
          complianceChecks: prev.complianceChecks + checkChange,
          criticalIssues: Math.max(0, prev.criticalIssues + (findingsChange > 0 && Math.random() > 0.7 ? 1 : (findingsChange < 0 && Math.random() > 0.7 ? -1 : 0))),
          overallScore: Math.min(100, Math.max(90, parseFloat((prev.overallScore + scoreDelta).toFixed(1)))),
          mediumFindings: Math.max(0, prev.mediumFindings + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
          resolvedFindings: prev.resolvedFindings + resolvedChange
        };
      });

      // Dynamically update partner stats occasionally
      setPartnerStats(prev => {
        const clientChange = Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0;
        const approvalChange = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        
        return {
          ...prev,
          activeClients: prev.activeClients + clientChange,
          totalClients: prev.totalClients + clientChange,
          itemsNeedApproval: Math.max(0, prev.itemsNeedApproval + approvalChange),
          targetAchievement: Math.min(100, Math.max(90, parseFloat((prev.targetAchievement + (Math.random() > 0.5 ? 0.1 : -0.1)).toFixed(1))))
        };
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [clients.length, userRole]);




  const renderPartnerDashboard = () => (
    <div className="space-y-6 bg-white min-h-screen px-4 md:px-8 pb-8">
      {/* Executive Welcome */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 md:p-8 text-white mt-4 md:mt-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
            <div className="text-5xl">{userAvatar}</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Executive Overview</h1>
              <p className="text-purple-100 text-base">{userName} • {userTitle}</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-xs md:text-sm text-purple-100">Overall Compliance Health</div>
            <div className="text-3xl md:text-4xl font-bold">{partnerStats.targetAchievement}%</div>
          </div>
        </div>
      </div>

      {/* Executive Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card
          className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 border-0 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
          onClick={onNavigateToClients}
        >
          <CardContent className="p-5 md:p-8 relative z-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500" />
            <Users className="w-10 h-10 md:w-12 md:h-12 text-white/90 mb-4 drop-shadow-lg group-hover:scale-110 transition-transform" />
            <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-md">{partnerStats.activeClients}</div>
            <div className="text-xs md:text-sm font-semibold text-white/80 uppercase tracking-wide">Active Clients</div>
            <div className="mt-3 flex items-center text-white/60 text-[10px] md:text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>{complianceOfficerStats.activeClients} active</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="relative overflow-hidden bg-gradient-to-br from-amber-600 to-orange-700 border-0 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
          onClick={() => {
            // Scroll to approvals section
            setTimeout(() => {
              const approvalsCard = document.querySelector('[data-approvals-section]');
              if (approvalsCard) {
                approvalsCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Flash the card to draw attention
                approvalsCard.classList.add('ring-4', 'ring-amber-400');
                setTimeout(() => {
                  approvalsCard.classList.remove('ring-4', 'ring-amber-400');
                }, 2000);
              }
            }, 100);
          }}
        >
          <CardContent className="p-5 md:p-8 relative z-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-white/90 mb-4 drop-shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/80 rounded-full animate-pulse" />
            </div>
            <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-md">{partnerStats.itemsNeedApproval}</div>
            <div className="text-xs md:text-sm font-semibold text-white/80 uppercase tracking-wide">Items Need Approval</div>
            <div className="mt-3 flex items-center text-white/60 text-[10px] md:text-xs">
              <Clock className="w-3 h-3 mr-1" />
              <span>{partnerStats.urgentItems} urgent • {Math.max(0, partnerStats.itemsNeedApproval - partnerStats.urgentItems)} standard</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="relative overflow-hidden bg-gradient-to-br from-rose-600 to-red-700 border-0 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
          onClick={onNavigateToCases}
        >
          <CardContent className="p-5 md:p-8 relative z-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <Flag className="w-10 h-10 md:w-12 md:h-12 text-white/90 mb-4 drop-shadow-lg group-hover:scale-110 group-hover:-rotate-12 transition-all" />
              <div className="absolute top-0 right-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
                !
              </div>
            </div>
            <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-md">{partnerStats.highRiskClients}</div>
            <div className="text-xs md:text-sm font-semibold text-white/80 uppercase tracking-wide">High Risk Clients</div>
            <div className="mt-3 flex items-center text-white/60 text-[10px] md:text-xs">
              <Shield className="w-3 h-3 mr-1" />
              <span>Immediate attention required</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 border-0 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-5 md:p-8 relative z-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500" />
            <Target className="w-10 h-10 md:w-12 md:h-12 text-white/90 mb-4 drop-shadow-lg group-hover:scale-110 group-hover:rotate-180 transition-all duration-500" />
            <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-md">{partnerStats.targetAchievement}%</div>
            <div className="text-xs md:text-sm font-semibold text-white/80 uppercase tracking-wide">Target Achievement</div>
            <div className="mt-3 flex items-center text-white/60 text-[10px] md:text-xs">
              <Zap className="w-3 h-3 mr-1" />
              <span>Exceeding goals by 8.2%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio Risk Overview</CardTitle>
            <CardDescription>Client distribution by risk category and AUM</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { category: 'Low Risk', clients: 245, aum: 15.2 },
                { category: 'Medium Risk', clients: 68, aum: 6.8 },
                { category: 'High Risk', clients: 13, aum: 2.5 }
              ]}>
                <CartesianGrid key="grid-portfolio" strokeDasharray="3 3" />
                <XAxis key="xaxis-portfolio" dataKey="category" />
                <YAxis key="yaxis-left-portfolio" yAxisId="left" orientation="left" stroke="#3b82f6" />
                <YAxis key="yaxis-right-portfolio" yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip key="tooltip-portfolio" />
                <Legend key="legend-portfolio" />
                <Bar key="clients-bar" yAxisId="left" dataKey="clients" fill="#3b82f6" name="Clients" />
                <Bar key="aum-bar" yAxisId="right" dataKey="aum" fill="#10b981" name="AUM ($M)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card data-approvals-section className="transition-all">
          <CardHeader>
            <CardTitle>Requires Your Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {partnerApprovalsData.map((approval, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-sm">{approval.item}</div>
                    <Badge variant={approval.priority === 'High' ? 'destructive' : 'default'} className="text-xs">
                      {approval.priority}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{approval.type}</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" className="flex-1 h-7" onClick={() => {
                      setApprovalModalOpen(true);
                      setSelectedApproval(approval);
                    }}>Approve</Button>
                    <Button size="sm" variant="outline" className="h-7" onClick={() => {
                      setApprovalModalOpen(true);
                      setSelectedApproval(approval);
                    }}>Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Regulatory Compliance Status</CardTitle>
            <CardDescription>Compliance across jurisdictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regulatoryComplianceStatusData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.jurisdiction}</span>
                    <span className="text-sm font-semibold">{item.compliance}%</span>
                  </div>
                  <Progress value={item.compliance} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategic Insights</CardTitle>
            <CardDescription>AI-powered recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strategicInsightsData.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${item.color}`} />
                  <p className="text-sm text-gray-900">{item.insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAnalystDashboard = () => (
    <div className="space-y-6 md:space-y-8 bg-white min-h-screen px-4 md:px-8 pb-8">
      {/* Analyst Welcome */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 md:p-12 text-white shadow-lg mt-4 md:mt-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 text-center sm:text-left">
          <div className="text-5xl md:text-6xl">{userAvatar}</div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Your Investigation Workspace</h1>
            <p className="text-cyan-100 text-sm md:text-xl">{userName} • {userTitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20 hover:bg-white/20 transition-all flex flex-col justify-between h-24 md:h-32">
            <div className="text-2xl md:text-4xl font-bold mb-1">14</div>
            <div className="text-xs md:text-sm text-cyan-100 font-medium">Cases Assigned</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20 hover:bg-white/20 transition-all flex flex-col justify-between h-24 md:h-32">
            <div className="text-2xl md:text-4xl font-bold mb-1">6</div>
            <div className="text-xs md:text-sm text-cyan-100 font-medium">High Priority</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20 hover:bg-white/20 transition-all flex flex-col justify-between h-24 md:h-32">
            <div className="text-2xl md:text-4xl font-bold mb-1">23</div>
            <div className="text-xs md:text-sm text-cyan-100 font-medium">Alerts Today</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-5 border border-white/20 hover:bg-white/20 transition-all flex flex-col justify-between h-24 md:h-32">
            <div className="text-2xl md:text-4xl font-bold mb-1">87%</div>
            <div className="text-xs md:text-sm text-cyan-100 font-medium">Resolution Rate</div>
          </div>
        </div>
      </div>

      {/* Alert Queue */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-500" />
              Transaction Alerts Queue
            </span>
            <Badge variant="destructive">23 new</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertsQueueData.map((alert, index) => (
              <div key={index} className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border-2 gap-4 ${alert.risk === 'Critical' ? 'bg-red-50 border-red-300' :
                alert.risk === 'High' ? 'bg-orange-50 border-orange-300' :
                  'bg-yellow-50 border-yellow-300'
                }`}>
                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                  <div className="text-left sm:text-center min-w-[70px]">
                    <div className="text-xs text-gray-500 font-mono">{alert.id}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{alert.time}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{alert.client}</div>
                    <div className="text-xs sm:text-sm text-gray-600 truncate">{alert.type} • {alert.amount}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-200/50">
                  <Badge variant={alert.risk === 'Critical' || alert.risk === 'High' ? 'destructive' : 'default'} className="text-xs">
                    {alert.risk} Risk
                  </Badge>
                  <Button size="sm" className="font-medium px-4 shadow-sm" onClick={() => navigate(`/${role}/review/${alert.client}`)}>
                    Investigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* My Active Cases & Daily Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Active Cases</CardTitle>
            <CardDescription>14 cases in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeCasesData.map((caseItem, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-gray-500">{caseItem.caseId}</span>
                      <Badge variant={caseItem.priority === 'High' ? 'destructive' : caseItem.priority === 'Medium' ? 'default' : 'secondary'} className="text-xs">
                        {caseItem.priority}
                      </Badge>
                    </div>
                    <div className="font-semibold text-sm">{caseItem.client}</div>
                    <div className="text-xs text-gray-600">{caseItem.status} • {caseItem.days} days open</div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/${role}/review/${caseItem.client}`)}>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Week's Activity</CardTitle>
            <CardDescription>Your investigation performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-hidden">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={activityData}>
                  <CartesianGrid key="grid-analyst-activity" strokeDasharray="3 3" />
                  <XAxis key="xaxis-analyst-activity" dataKey="day" />
                  <YAxis key="yaxis-analyst-activity" />
                  <Tooltip key="tooltip-analyst-activity" />
                  <Legend key="legend-analyst-activity" />
                  <Bar key="cases-analyst" dataKey="cases" fill="#3b82f6" name="Cases Closed" />
                  <Bar key="reviews-analyst" dataKey="reviews" fill="#10b981" name="Reviews Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">67</div>
                <div className="text-xs text-gray-600">Total Cases This Week</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">99</div>
                <div className="text-xs text-gray-600">Total Reviews</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAuditorDashboard = () => (
    <div className="space-y-6 md:space-y-8 bg-white min-h-screen px-4 md:px-8 pb-8">
      {/* Auditor Welcome */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-12 text-white shadow-lg mt-4 md:mt-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 text-center sm:text-left">
          <div className="text-5xl md:text-6xl">{userAvatar}</div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Audit Control Center</h1>
            <p className="text-white/90 text-sm md:text-xl">{userName} • {userTitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 h-32 md:h-40 flex flex-col justify-between">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{auditorStats.openFindings}</div>
              <div className="text-xs md:text-sm text-indigo-100 font-medium">Open Findings</div>
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Requires Action</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 h-32 md:h-40 flex flex-col justify-between">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{auditorStats.complianceChecks}</div>
              <div className="text-xs md:text-sm text-indigo-100 font-medium">Compliance Checks</div>
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Completed Checks</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 h-32 md:h-40 flex flex-col justify-between">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{auditorStats.criticalIssues}</div>
              <div className="text-xs md:text-sm text-indigo-100 font-medium">Critical Issues</div>
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Immediate attention</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 h-32 md:h-40 flex flex-col justify-between">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{auditorStats.overallScore}%</div>
              <div className="text-xs md:text-sm text-indigo-100 font-medium">Overall Score</div>
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Assurance Rating</div>
          </div>
        </div>
      </div>

      {/* Audit Findings */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Critical Findings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600 mb-2">{auditorStats.criticalIssues}</div>
            <Progress value={28} className="mb-2" />
            <p className="text-sm text-red-800">Require immediate action</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Medium Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-600 mb-2">{auditorStats.mediumFindings}</div>
            <Progress value={45} className="mb-2" />
            <p className="text-sm text-amber-800">Review within 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Resolved This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600 mb-2">{auditorStats.resolvedFindings}</div>
            <Progress value={85} className="mb-2" />
            <p className="text-sm text-green-800">Above target by 12%</p>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Audit Trail */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Health Monitoring</CardTitle>
            <CardDescription>Real-time compliance system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealthData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.system}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.status >= 95 ? 'default' : 'secondary'} className="text-xs">
                        {item.health}
                      </Badge>
                      <span className="text-sm font-semibold">{item.status}%</span>
                    </div>
                  </div>
                  <Progress value={item.status} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Audit Activities</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAuditActivitiesData.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-amber-500' :
                      activity.status === 'error' ? 'bg-red-500' :
                        'bg-blue-500'
                    }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Coverage by Module</CardTitle>
          <CardDescription>Audit coverage across all system modules</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complianceCoverageData}>
              <CartesianGrid key="grid-auditor-coverage" strokeDasharray="3 3" />
              <XAxis key="xaxis-auditor-coverage" dataKey="module" />
              <YAxis key="yaxis-auditor-coverage" domain={[85, 100]} />
              <Tooltip key="tooltip-auditor-coverage" />
              <Legend key="legend-auditor-coverage" />
              <Bar key="coverage-auditor" dataKey="coverage" fill="#3b82f6" name="Current Coverage %" />
              <Bar key="target-auditor" dataKey="target" fill="#10b981" name="Target %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  // Determine which dashboard to render
  const renderDashboard = () => {
    if (userRole === 'partner') {
      return renderPartnerDashboard();
    } else if (userRole === 'analyst') {
      return renderAnalystDashboard();
    } else if (userRole === 'auditor') {
      return renderAuditorDashboard();
    }
    return null;
  };

  return (
    <div className="bg-white min-h-screen">
      {renderDashboard()}
      {/* Approval Modal */}
      {approvalModalOpen && selectedApproval && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Review & Approve</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedApproval.item}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => {
                setApprovalModalOpen(false);
                setApprovalComment('');
              }}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Type</p>
                    <p className="font-semibold">{selectedApproval.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Priority</p>
                    <Badge variant={selectedApproval.priority === 'High' ? 'destructive' : 'default'}>
                      {selectedApproval.priority}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Approval Comments <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="Provide details of your approval decision..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comments will be recorded in the audit trail
                </p>
              </div>

              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-900 mb-1">
                      Dual Control Required
                    </p>
                    <p className="text-sm text-amber-800">
                      This action requires approval from 2 authorized users. Your approval will be the 1st of 2 required.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setApprovalModalOpen(false);
                  setApprovalComment('');
                }}
              >
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => {
                    toast.warning('Declined', `${selectedApproval.item} — logged in audit trail.`);
                    setApprovalModalOpen(false);
                    setApprovalComment('');
                  }}
                  disabled={!approvalComment.trim()}
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    toast.success('Approved', `${selectedApproval.item} — recorded in compliance audit trail.`);
                    setApprovalModalOpen(false);
                    setApprovalComment('');
                  }}
                  disabled={!approvalComment.trim()}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
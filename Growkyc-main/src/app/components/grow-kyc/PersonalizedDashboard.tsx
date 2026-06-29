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
  MessageSquare
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

interface PersonalizedDashboardProps {
  userName: string;
  userRole: string;
  userTitle: string;
  userAvatar: string;
  onNavigateToClients?: () => void;
  onNavigateToCases?: () => void;
  onNavigateToClient?: (clientId: string) => void;
  onNavigateToRequirements?: () => void;
}

export function PersonalizedDashboard({ userName, userRole, userTitle, userAvatar, onNavigateToClients, onNavigateToCases, onNavigateToClient, onNavigateToRequirements }: PersonalizedDashboardProps) {
  const navigate = useNavigate();
  const { role } = useParams();
  const [approvalModalOpen, setApprovalModalOpen] = React.useState(false);
  const [selectedApproval, setSelectedApproval] = React.useState<any>(null);
  const [approvalComment, setApprovalComment] = React.useState('');

  // Dynamic Chart & Activity data
  const [riskTrendData, setRiskTrendData] = React.useState([
    { month: 'Jan', high: 12, medium: 34, low: 156 },
    { month: 'Feb', high: 15, medium: 38, low: 162 },
    { month: 'Mar', high: 18, medium: 42, low: 168 },
    { month: 'Apr', high: 14, medium: 39, low: 172 },
    { month: 'May', high: 13, medium: 36, low: 178 },
    { month: 'Jun', high: 11, medium: 32, low: 184 }
  ]);

  const [verificationStatusData, setVerificationStatusData] = React.useState([
    { name: 'Verified', value: 245, color: '#10b981' },
    { name: 'Pending', value: 68, color: '#f59e0b' },
    { name: 'Rejected', value: 13, color: '#ef4444' }
  ]);

  const [recentActivityData, setRecentActivityData] = React.useState([
    { type: 'approval', user: 'You', action: 'approved EDD report for Apex Holdings', time: '10 min ago', icon: CheckCircle, color: 'text-green-600' },
    { type: 'alert', user: 'System', action: 'flagged suspicious transaction pattern', time: '1h ago', icon: AlertTriangle, color: 'text-red-600' },
    { type: 'review', user: 'Emma Williams', action: 'completed KYC review for 3 clients', time: '2h ago', icon: UserCheck, color: 'text-blue-600' },
    { type: 'document', user: 'David Thompson', action: 'uploaded audit findings report', time: '3h ago', icon: FileText, color: 'text-purple-600' },
    { type: 'update', user: 'You', action: 'updated compliance procedures', time: '5h ago', icon: Activity, color: 'text-amber-600' }
  ]);

  const [activityData, setActivityData] = React.useState([
    { day: 'Mon', cases: 12, reviews: 18 },
    { day: 'Tue', cases: 15, reviews: 22 },
    { day: 'Wed', cases: 10, reviews: 16 },
    { day: 'Thu', cases: 18, reviews: 24 },
    { day: 'Fri', cases: 12, reviews: 19 }
  ]);

  const [alertsQueueData, setAlertsQueueData] = React.useState([
    { id: 'ALT-2847', client: 'Apex Holdings', type: 'Large Cash Transaction', amount: '$285,000', risk: 'High', time: '8 min ago' },
    { id: 'ALT-2846', client: 'GlobalTech Corp', type: 'Unusual Pattern', amount: '$45,000', risk: 'High', time: '22 min ago' },
    { id: 'ALT-2845', client: 'Summit Partners', type: 'Velocity Alert', amount: '$120,000', risk: 'Medium', time: '1h ago' },
    { id: 'ALT-2844', client: 'Phoenix Ventures', type: 'Sanctions Match', amount: '$95,000', risk: 'Critical', time: '2h ago' },
    { id: 'ALT-2843', client: 'Metro Financial', type: 'Geographic Risk', amount: '$67,000', risk: 'Medium', time: '3h ago' }
  ]);

  const [activeCasesData, setActiveCasesData] = React.useState([
    { caseId: 'CASE-1024', client: 'Apex Holdings', status: 'Under Investigation', days: 2, priority: 'High' },
    { caseId: 'CASE-1023', client: 'GlobalTech Corp', status: 'Evidence Collection', days: 5, priority: 'High' },
    { caseId: 'CASE-1019', client: 'Summit Partners', status: 'Analysis', days: 8, priority: 'Medium' },
    { caseId: 'CASE-1015', client: 'Phoenix Ventures', status: 'Pending Decision', days: 12, priority: 'Medium' },
    { caseId: 'CASE-1012', client: 'Metro Financial', status: 'Final Review', days: 15, priority: 'Low' }
  ]);

  React.useEffect(() => {
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

      // Dynamically add to alerts queue occasionally
      if (Math.random() > 0.8) {
        setAlertsQueueData(prev => {
          const newAlerts = [
            { id: `ALT-${Math.floor(2850 + Math.random() * 100)}`, client: 'Nexus Technologies', type: 'Wire Transfer Anomaly', amount: '$450,000', risk: 'Critical', time: 'Just now' },
            { id: `ALT-${Math.floor(2850 + Math.random() * 100)}`, client: 'Silverstone Enterprises', type: 'Structuring Detected', amount: '$9,900', risk: 'High', time: 'Just now' },
            { id: `ALT-${Math.floor(2850 + Math.random() * 100)}`, client: 'Horizon Capital', type: 'Velocity Alert', amount: '$34,000', risk: 'Medium', time: 'Just now' }
          ];
          const randomAlert = newAlerts[Math.floor(Math.random() * newAlerts.length)];
          return [randomAlert, ...prev.slice(0, 4)];
        });
      }

      // Dynamically update active cases days open
      setActiveCasesData(prev => prev.map(c => ({
        ...c,
        days: c.days + (Math.random() > 0.95 ? 1 : 0)
      })));

      // Dynamically add a recent activity occasionally
      if (Math.random() > 0.7) {
        setRecentActivityData(prev => {
          const newActivities = [
            { type: 'alert', user: 'System', action: 'auto-cleared low risk alert', time: 'Just now', icon: CheckCircle, color: 'text-green-600' },
            { type: 'review', user: 'Sarah Chen', action: 'started PEP screening', time: 'Just now', icon: Eye, color: 'text-blue-600' },
            { type: 'alert', user: 'System', action: 'detected new adverse media', time: 'Just now', icon: AlertTriangle, color: 'text-red-600' },
            { type: 'document', user: 'System', action: 'generated daily compliance report', time: 'Just now', icon: FileText, color: 'text-purple-600' }
          ];
          const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
          return [randomActivity, ...prev.slice(0, 4)];
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Render dashboard based on role
  const renderComplianceOfficerDashboard = () => (
    <div className="space-y-8 bg-[#0d121d] min-h-screen px-8 pb-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] rounded-2xl p-12 text-white shadow-lg mt-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="text-6xl">{userAvatar}</div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {userName.split(' ')[0]}!</h1>
            <p className="text-white/90 text-xl">{userTitle} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6 mt-8">
          <div
            onClick={onNavigateToRequirements}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 cursor-pointer hover:bg-white/20 hover:scale-105 transition-all duration-300 h-40 flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl font-bold mb-1">23</div>
              <div className="text-sm text-white/90 font-medium">Pending Reviews</div>
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Click to view</div>
          </div>
          <div
            onClick={onNavigateToRequirements}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 cursor-pointer hover:bg-white/20 hover:scale-105 transition-all duration-300 h-40 flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl font-bold mb-1">8</div>
              <div className="text-sm text-white/90 font-medium">High Risk Alerts</div>
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Click to view</div>
          </div>
          <div
            onClick={onNavigateToRequirements}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 cursor-pointer hover:bg-white/20 hover:scale-105 transition-all duration-300 h-40 flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl font-bold mb-1">156</div>
              <div className="text-sm text-white/90 font-medium">Active Clients</div>
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Click to view</div>
          </div>
          <div
            onClick={onNavigateToRequirements}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 cursor-pointer hover:bg-white/20 hover:scale-105 transition-all duration-300 h-40 flex flex-col justify-between"
          >
            <div>
              <div className="text-4xl font-bold mb-1">94%</div>
              <div className="text-sm text-white/90 font-medium">Compliance Rate</div>
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-bold">Click to view</div>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-all h-40 flex flex-col">
          <CardContent className="p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-white">8</div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-300 uppercase tracking-wide">Urgent Actions</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-red-600 font-black">+3 FROM YESTERDAY</p>
                <Button variant="link" className="text-[10px] p-0 h-auto font-black text-[#13B5EA]" onClick={onNavigateToCases}>VIEW ALL</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all h-40 flex flex-col">
          <CardContent className="p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-white">23</div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-300 uppercase tracking-wide">Pending Approvals</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-slate-400 font-black">12 DUE THIS WEEK</p>
                <Button variant="link" className="text-[10px] p-0 h-auto font-black text-[#13B5EA]" onClick={onNavigateToCases}>REVIEW QUEUE</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all h-40 flex flex-col">
          <CardContent className="p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-white">34</div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-300 uppercase tracking-wide">Completed Today</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-green-600 font-black">+12% VS AVG</p>
                <Button variant="link" className="text-[10px] p-0 h-auto font-black text-[#13B5EA]">DETAILS</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all h-40 flex flex-col">
          <CardContent className="p-5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-white">92%</div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-300 uppercase tracking-wide">Team Performance</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-slate-400 font-black">TEAM AVG SCORE</p>
                <Button variant="link" className="text-[10px] p-0 h-auto font-black text-[#13B5EA]">METRICS</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Risk Trend Analysis</CardTitle>
            <CardDescription>Client risk distribution over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={riskTrendData}>
                <CartesianGrid key="grid-risk-trend" strokeDasharray="3 3" />
                <XAxis key="xaxis-risk-trend" dataKey="month" />
                <YAxis key="yaxis-risk-trend" />
                <Tooltip key="tooltip-risk-trend" />
                <Legend key="legend-risk-trend" />
                <Area key="high-risk" type="monotone" dataKey="high" stackId="1" stroke="#ef4444" fill="#ef4444" name="High Risk" />
                <Area key="medium-risk" type="monotone" dataKey="medium" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Medium Risk" />
                <Area key="low-risk" type="monotone" dataKey="low" stackId="1" stroke="#10b981" fill="#10b981" name="Low Risk" />
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
                  <Pie
                    data={verificationStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
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
                      <div className="text-xs text-slate-300">{item.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients to Watch */}
      <Card className="border-2 border-red-200 bg-red-50">
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
              8 Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: 'Apex Holdings Ltd',
                reason: 'Sanctions Match - Pending Review',
                riskLevel: 'Critical',
                daysOpen: 2,
                assignee: 'Sarah Chen',
                urgency: 'critical',
                icon: AlertTriangle,
                color: 'text-red-600 bg-red-100'
              },
              {
                name: 'GlobalTech Corporation',
                reason: 'High-Risk Jurisdiction - EDD Required',
                riskLevel: 'High',
                daysOpen: 5,
                assignee: 'Emma Williams',
                urgency: 'high',
                icon: Flag,
                color: 'text-orange-600 bg-orange-100'
              },
              {
                name: 'Phoenix Ventures Ltd',
                reason: 'PEP Relationship Detected',
                riskLevel: 'High',
                daysOpen: 3,
                assignee: 'Jessica Lee',
                urgency: 'high',
                icon: AlertCircle,
                color: 'text-orange-600 bg-orange-100'
              },
              {
                name: 'Summit Investment Partners',
                reason: 'Adverse Media Alert',
                riskLevel: 'Medium',
                daysOpen: 7,
                assignee: 'David Thompson',
                urgency: 'medium',
                icon: Bell,
                color: 'text-amber-600 bg-amber-100'
              },
              {
                name: 'Horizon Capital Group',
                reason: 'Unusual Transaction Pattern',
                riskLevel: 'Medium',
                daysOpen: 4,
                assignee: 'Emma Williams',
                urgency: 'medium',
                icon: Activity,
                color: 'text-amber-600 bg-amber-100'
              },
              {
                name: 'Silverstone Enterprises',
                reason: 'ID Verification Failed - Retry',
                riskLevel: 'Medium',
                daysOpen: 1,
                assignee: 'Sarah Chen',
                urgency: 'medium',
                icon: XCircle,
                color: 'text-amber-600 bg-amber-100'
              }
            ].map((client, index) => (
              <div
                key={index}
                className={`p-4 bg-[#0d121d] rounded-lg border-2 ${client.urgency === 'critical' ? 'border-red-300' :
                    client.urgency === 'high' ? 'border-orange-300' :
                      'border-amber-300'
                  } hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg ${client.color} flex items-center justify-center flex-shrink-0`}>
                      <client.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">{client.name}</span>
                        <Badge
                          variant={client.urgency === 'critical' ? 'destructive' : 'default'}
                          className={
                            client.urgency === 'critical' ? 'bg-red-600' :
                              client.urgency === 'high' ? 'bg-orange-600' :
                                'bg-amber-600'
                          }
                        >
                          {client.riskLevel}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-300 font-medium mb-2">{client.reason}</div>
                      <div className="flex items-center gap-4 text-xs text-slate-300">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Open {client.daysOpen} {client.daysOpen === 1 ? 'day' : 'days'}
                        </span>
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          Assigned to {client.assignee}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-4"
                    onClick={() => navigate(`/${role}/review/${client.name}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Review
                  </Button>
                </div>
                {client.urgency === 'critical' && (
                  <div className="flex items-center gap-2 pt-3 border-t border-red-200">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-semibold text-red-600">URGENT: Requires immediate compliance officer review</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={onNavigateToClients}>
            View All Watchlist Clients ({8}) →
          </Button>
        </CardContent>
      </Card>

      {/* Action Items & Recent Activity */}
      <div className="grid grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Priority Action Items
              <Badge variant="destructive">8 urgent</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { client: 'Apex Holdings Ltd', action: 'EDD Review Required', risk: 'High', time: '2h ago', urgent: true },
                { client: 'GlobalTech Corp', action: 'Document Verification', risk: 'Medium', time: '4h ago', urgent: true },
                { client: 'Summit Partners', action: 'Annual Review Due', risk: 'Low', time: '1d ago', urgent: false },
                { client: 'Phoenix Ventures', action: 'Risk Assessment Update', risk: 'High', time: '1d ago', urgent: true },
                { client: 'Metro Financial', action: 'KYC Refresh', risk: 'Medium', time: '2d ago', urgent: false }
              ].map((item, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${item.urgent ? 'bg-red-50 border-red-200' : 'bg-[#0a0e17] border-white/10'}`}>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{item.client}</div>
                    <div className="text-xs text-slate-300">{item.action}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item.risk === 'High' ? 'destructive' : item.risk === 'Medium' ? 'default' : 'secondary'} className="text-xs">
                      {item.risk}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/${role}/review/${item.client}`)}>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activity
              <Button variant="ghost" size="sm" onClick={onNavigateToCases}>View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivityData.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full bg-[#0a0e17] flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm"><span className="font-semibold">{activity.user}</span> {activity.action}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPartnerDashboard = () => (
    <div className="space-y-6">
      {/* Executive Welcome */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{userAvatar}</div>
            <div>
              <h1 className="text-3xl font-bold">Executive Overview</h1>
              <p className="text-purple-100 text-lg">{userName} • {userTitle}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-100">Overall Compliance Health</div>
            <div className="text-4xl font-bold">96.5%</div>
          </div>
        </div>
      </div>

      {/* Executive Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <Card
          className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 border-0 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
          onClick={onNavigateToClients}
        >
          <CardContent className="p-8 relative z-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500" />
            <Users className="w-12 h-12 text-white/90 mb-4 drop-shadow-lg group-hover:scale-110 transition-transform" />
            <div className="text-5xl font-black text-white mb-2 drop-shadow-md">326</div>
            <div className="text-sm font-semibold text-white/80 uppercase tracking-wide">Active Clients</div>
            <div className="mt-3 flex items-center text-white/60 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+12% this quarter</span>
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
          <CardContent className="p-8 relative z-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <AlertCircle className="w-12 h-12 text-white/90 mb-4 drop-shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/80 rounded-full animate-pulse" />
            </div>
            <div className="text-5xl font-black text-white mb-2 drop-shadow-md">12</div>
            <div className="text-sm font-semibold text-white/80 uppercase tracking-wide">Items Need Approval</div>
            <div className="mt-3 flex items-center text-white/60 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              <span>3 urgent • 9 standard</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className="relative overflow-hidden bg-gradient-to-br from-rose-600 to-red-700 border-0 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
          onClick={onNavigateToCases}
        >
          <CardContent className="p-8 relative z-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <Flag className="w-12 h-12 text-white/90 mb-4 drop-shadow-lg group-hover:scale-110 group-hover:-rotate-12 transition-all" />
              <div className="absolute top-0 right-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
                !
              </div>
            </div>
            <div className="text-5xl font-black text-white mb-2 drop-shadow-md">3</div>
            <div className="text-sm font-semibold text-white/80 uppercase tracking-wide">High Risk Clients</div>
            <div className="mt-3 flex items-center text-white/60 text-xs">
              <Shield className="w-3 h-3 mr-1" />
              <span>Immediate attention required</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 border-0 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
          <CardContent className="p-8 relative z-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500" />
            <Target className="w-12 h-12 text-white/90 mb-4 drop-shadow-lg group-hover:scale-110 group-hover:rotate-180 transition-all duration-500" />
            <div className="text-5xl font-black text-white mb-2 drop-shadow-md">98.2%</div>
            <div className="text-sm font-semibold text-white/80 uppercase tracking-wide">Target Achievement</div>
            <div className="mt-3 flex items-center text-white/60 text-xs">
              <Zap className="w-3 h-3 mr-1" />
              <span>Exceeding goals by 8.2%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Risk Distribution */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
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
              {[
                { item: 'High Risk Client Onboarding', type: 'New Client', priority: 'High' },
                { item: 'EDD Report - Apex Holdings', type: 'Review', priority: 'High' },
                { item: 'Policy Exception Request', type: 'Exception', priority: 'Medium' },
                { item: 'Annual Compliance Budget', type: 'Budget', priority: 'Medium' },
                { item: 'New Jurisdiction Expansion', type: 'Strategic', priority: 'High' }
              ].map((approval, index) => (
                <div key={index} className="p-3 bg-[#0a0e17] rounded-lg border">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-semibold text-sm">{approval.item}</div>
                    <Badge variant={approval.priority === 'High' ? 'destructive' : 'default'} className="text-xs">
                      {approval.priority}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-300 mb-2">{approval.type}</div>
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
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Regulatory Compliance Status</CardTitle>
            <CardDescription>Compliance across jurisdictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { jurisdiction: 'Australia (AUSTRAC)', compliance: 98, status: 'Excellent' },
                { jurisdiction: 'United States (FinCEN)', compliance: 95, status: 'Good' },
                { jurisdiction: 'United Kingdom (FCA)', compliance: 97, status: 'Excellent' },
                { jurisdiction: 'Singapore (MAS)', compliance: 94, status: 'Good' },
                { jurisdiction: 'Hong Kong (SFC)', compliance: 96, status: 'Excellent' }
              ].map((item, index) => (
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
              {[
                { insight: 'Onboarding efficiency improved 23% this quarter', icon: TrendingUp, color: 'text-green-600' },
                { insight: '3 clients approaching high-risk threshold', icon: AlertTriangle, color: 'text-amber-600' },
                { insight: 'Transaction monitoring accuracy at 97.8%', icon: Target, color: 'text-blue-600' },
                { insight: 'Recommended: Update sanctions screening rules', icon: Shield, color: 'text-purple-600' },
                { insight: 'Team capacity: 12% above industry average', icon: Users, color: 'text-green-600' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-[#0a0e17] rounded-lg">
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${item.color}`} />
                  <p className="text-sm text-white">{item.insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAnalystDashboard = () => (
    <div className="space-y-8 bg-[#0d121d] min-h-screen px-8 pb-8">
      {/* Analyst Welcome */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-12 text-white shadow-lg mt-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="text-6xl">{userAvatar}</div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Investigation Workspace</h1>
            <p className="text-cyan-100 text-xl">{userName} • {userTitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl font-bold mb-1">14</div>
            <div className="text-sm text-cyan-100 font-medium">Cases Assigned</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl font-bold mb-1">6</div>
            <div className="text-sm text-cyan-100 font-medium">High Priority</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl font-bold mb-1">23</div>
            <div className="text-sm text-cyan-100 font-medium">Alerts Today</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl font-bold mb-1">87%</div>
            <div className="text-sm text-cyan-100 font-medium">Resolution Rate</div>
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
          <div className="space-y-2">
            {alertsQueueData.map((alert, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg border-2 ${alert.risk === 'Critical' ? 'bg-red-50 border-red-300' :
                  alert.risk === 'High' ? 'bg-orange-50 border-orange-300' :
                    'bg-yellow-50 border-yellow-300'
                }`}>
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-center">
                    <div className="text-xs text-slate-400">{alert.id}</div>
                    <div className="text-xs text-slate-400">{alert.time}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{alert.client}</div>
                    <div className="text-sm text-slate-300">{alert.type} • {alert.amount}</div>
                  </div>
                  <Badge variant={alert.risk === 'Critical' || alert.risk === 'High' ? 'destructive' : 'default'}>
                    {alert.risk}
                  </Badge>
                  <Button size="sm" onClick={() => navigate(`/${role}/review/${alert.client}`)}>Investigate</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* My Active Cases & Daily Activity */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Active Cases</CardTitle>
            <CardDescription>14 cases in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeCasesData.map((caseItem, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#0a0e17] rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-slate-400">{caseItem.caseId}</span>
                      <Badge variant={caseItem.priority === 'High' ? 'destructive' : caseItem.priority === 'Medium' ? 'default' : 'secondary'} className="text-xs">
                        {caseItem.priority}
                      </Badge>
                    </div>
                    <div className="font-semibold text-sm">{caseItem.client}</div>
                    <div className="text-xs text-slate-300">{caseItem.status} • {caseItem.days} days open</div>
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
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">67</div>
                <div className="text-xs text-slate-300">Total Cases This Week</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">99</div>
                <div className="text-xs text-slate-300">Total Reviews</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAuditorDashboard = () => (
    <div className="space-y-6">
      {/* Auditor Welcome */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">{userAvatar}</div>
          <div>
            <h1 className="text-3xl font-bold">Audit Control Center</h1>
            <p className="text-indigo-100 text-lg">{userName} • {userTitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">18</div>
            <div className="text-sm text-indigo-100">Open Findings</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">342</div>
            <div className="text-sm text-indigo-100">Compliance Checks</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-indigo-100">Critical Issues</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">96.2%</div>
            <div className="text-sm text-indigo-100">Overall Score</div>
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
            <div className="text-4xl font-bold text-red-600 mb-2">5</div>
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
            <div className="text-4xl font-bold text-amber-600 mb-2">13</div>
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
            <div className="text-4xl font-bold text-green-600 mb-2">47</div>
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
              {[
                { system: 'KYC Verification Engine', status: 98, health: 'Excellent' },
                { system: 'Transaction Monitoring', status: 97, health: 'Excellent' },
                { system: 'Document Management', status: 95, health: 'Good' },
                { system: 'Risk Assessment AI', status: 92, health: 'Good' },
                { system: 'Sanctions Screening', status: 99, health: 'Excellent' },
                { system: 'Audit Trail Logger', status: 100, health: 'Excellent' }
              ].map((item, index) => (
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
              {[
                { action: 'Completed quarterly compliance review', status: 'success', time: '2h ago' },
                { action: 'Identified gap in sanctions screening', status: 'warning', time: '4h ago' },
                { action: 'Verified 45 client records', status: 'success', time: '6h ago' },
                { action: 'Updated audit procedures document', status: 'info', time: '8h ago' },
                { action: 'Flagged policy violation in Case-1023', status: 'error', time: '12h ago' },
                { action: 'Generated compliance report for Q2', status: 'success', time: '18h ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-[#0a0e17] rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-amber-500' :
                        activity.status === 'error' ? 'bg-red-500' :
                          'bg-blue-500'
                    }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
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
            <BarChart data={[
              { module: 'KYC', coverage: 98, target: 95 },
              { module: 'AML', coverage: 96, target: 95 },
              { module: 'Sanctions', coverage: 99, target: 98 },
              { module: 'PEP', coverage: 94, target: 95 },
              { module: 'EDD', coverage: 97, target: 95 },
              { module: 'Monitoring', coverage: 95, target: 92 }
            ]}>
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
    } else {
      // Default to compliance officer
      return renderComplianceOfficerDashboard();
    }
  };

  return (
    <div className="bg-[#0d121d] min-h-screen">
      {renderDashboard()}
      {/* Approval Modal */}
      {approvalModalOpen && selectedApproval && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d121d] rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Review & Approve</h2>
                <p className="text-sm text-slate-300 mt-1">{selectedApproval.item}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => {
                setApprovalModalOpen(false);
                setApprovalComment('');
              }}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-[#0a0e17] rounded-lg p-4 border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-300 mb-1">Type</p>
                    <p className="font-semibold">{selectedApproval.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-300 mb-1">Priority</p>
                    <Badge variant={selectedApproval.priority === 'High' ? 'destructive' : 'default'}>
                      {selectedApproval.priority}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Approval Comments <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="Provide details of your approval decision..."
                />
                <p className="text-xs text-slate-400 mt-1">
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

            <div className="p-6 border-t border-white/10 flex items-center justify-between">
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
                    alert(`Declined: ${selectedApproval.item}\n\nComment: ${approvalComment || '(No comment provided)'}\n\nThis action has been logged in the audit trail.`);
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
                    alert(`✅ APPROVED: ${selectedApproval.item}\n\nApproved by: ${userName}\nComment: ${approvalComment}\n\nStatus: Awaiting 2nd approval\nAudit Log: Recorded\n\nThis approval has been logged in the compliance audit trail.`);
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
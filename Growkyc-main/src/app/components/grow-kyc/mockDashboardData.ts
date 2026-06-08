import {
  TrendingUp,
  AlertTriangle,
  Target,
  Shield,
  Users,
  CheckCircle,
  UserCheck,
  FileText,
  Activity,
  Bell,
  XCircle,
  AlertCircle,
  Flag
} from 'lucide-react';

export const complianceOfficerStats = {
  pendingReviews: 23,
  highRiskAlerts: 8,
  activeClients: 156,
  complianceRate: '94%',
  urgentActions: 8,
  completedToday: 34,
  teamPerformance: '92%'
};

export const auditorStats = {
  openFindings: 18,
  complianceChecks: 342,
  criticalIssues: 5,
  overallScore: 96.2,
  mediumFindings: 13,
  resolvedFindings: 47
};

export const riskTrendData = [
  { month: 'Jan', high: 12, medium: 34, low: 156 },
  { month: 'Feb', high: 15, medium: 38, low: 162 },
  { month: 'Mar', high: 18, medium: 42, low: 168 },
  { month: 'Apr', high: 14, medium: 39, low: 172 },
  { month: 'May', high: 13, medium: 36, low: 178 },
  { month: 'Jun', high: 11, medium: 32, low: 184 }
];

export const verificationStatusData = [
  { name: 'Verified', value: 245, color: '#10b981' },
  { name: 'Pending', value: 68, color: '#f59e0b' },
  { name: 'Rejected', value: 13, color: '#ef4444' }
];

export const recentActivityData = [
  { type: 'approval', user: 'You', action: 'approved EDD report for Apex Holdings', time: '10 min ago', icon: CheckCircle, color: 'text-green-600' },
  { type: 'alert', user: 'System', action: 'flagged suspicious transaction pattern', time: '1h ago', icon: AlertTriangle, color: 'text-red-600' },
  { type: 'review', user: 'Emma Williams', action: 'completed KYC review for 3 clients', time: '2h ago', icon: UserCheck, color: 'text-blue-600' },
  { type: 'document', user: 'David Thompson', action: 'uploaded audit findings report', time: '3h ago', icon: FileText, color: 'text-purple-600' },
  { type: 'update', user: 'You', action: 'updated compliance procedures', time: '5h ago', icon: Activity, color: 'text-amber-600' }
];

export const activityData = [
  { day: 'Mon', cases: 12, reviews: 18 },
  { day: 'Tue', cases: 15, reviews: 22 },
  { day: 'Wed', cases: 10, reviews: 16 },
  { day: 'Thu', cases: 18, reviews: 24 },
  { day: 'Fri', cases: 12, reviews: 19 }
];

export const alertsQueueData = [
  { id: 'ALT-2847', client: 'Apex Holdings', type: 'Large Cash Transaction', amount: '$285,000', risk: 'High', time: '8 min ago' },
  { id: 'ALT-2846', client: 'GlobalTech Corp', type: 'Unusual Pattern', amount: '$45,000', risk: 'High', time: '22 min ago' },
  { id: 'ALT-2845', client: 'Summit Partners', type: 'Velocity Alert', amount: '$120,000', risk: 'Medium', time: '1h ago' },
  { id: 'ALT-2844', client: 'Phoenix Ventures', type: 'Sanctions Match', amount: '$95,000', risk: 'Critical', time: '2h ago' },
  { id: 'ALT-2843', client: 'Metro Financial', type: 'Geographic Risk', amount: '$67,000', risk: 'Medium', time: '3h ago' }
];

export const activeCasesData = [
  { caseId: 'CASE-1024', client: 'Apex Holdings', status: 'Under Investigation', days: 2, priority: 'High' },
  { caseId: 'CASE-1023', client: 'GlobalTech Corp', status: 'Evidence Collection', days: 5, priority: 'High' },
  { caseId: 'CASE-1019', client: 'Summit Partners', status: 'Analysis', days: 8, priority: 'Medium' },
  { caseId: 'CASE-1015', client: 'Phoenix Ventures', status: 'Pending Decision', days: 12, priority: 'Medium' },
  { caseId: 'CASE-1012', client: 'Metro Financial', status: 'Final Review', days: 15, priority: 'Low' }
];

export const clientsToWatchData = [
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
];

export const priorityActionItemsData = [
  { client: 'Apex Holdings Ltd', action: 'EDD Review Required', risk: 'High', time: '2h ago', urgent: true },
  { client: 'GlobalTech Corp', action: 'Document Verification', risk: 'Medium', time: '4h ago', urgent: true },
  { client: 'Summit Partners', action: 'Annual Review Due', risk: 'Low', time: '1d ago', urgent: false },
  { client: 'Phoenix Ventures', action: 'Risk Assessment Update', risk: 'High', time: '1d ago', urgent: true },
  { client: 'Metro Financial', action: 'KYC Refresh', risk: 'Medium', time: '2d ago', urgent: false }
];

export const partnerApprovalsData = [
  { item: 'High Risk Client Onboarding', type: 'New Client', priority: 'High' },
  { item: 'EDD Report - Apex Holdings', type: 'Review', priority: 'High' },
  { item: 'Policy Exception Request', type: 'Exception', priority: 'Medium' },
  { item: 'Annual Compliance Budget', type: 'Budget', priority: 'Medium' },
  { item: 'New Jurisdiction Expansion', type: 'Strategic', priority: 'High' }
];

export const regulatoryComplianceStatusData = [
  { jurisdiction: 'Australia (AUSTRAC)', compliance: 98, status: 'Excellent' },
  { jurisdiction: 'United States (FinCEN)', compliance: 95, status: 'Good' },
  { jurisdiction: 'United Kingdom (FCA)', compliance: 97, status: 'Excellent' },
  { jurisdiction: 'Singapore (MAS)', compliance: 94, status: 'Good' },
  { jurisdiction: 'Hong Kong (SFC)', compliance: 96, status: 'Excellent' }
];

export const strategicInsightsData = [
  { insight: 'Onboarding efficiency improved 23% this quarter', icon: TrendingUp, color: 'text-green-600' },
  { insight: '3 clients approaching high-risk threshold', icon: AlertTriangle, color: 'text-amber-600' },
  { insight: 'Transaction monitoring accuracy at 97.8%', icon: Target, color: 'text-blue-600' },
  { insight: 'Recommended: Update sanctions screening rules', icon: Shield, color: 'text-purple-600' },
  { insight: 'Team capacity: 12% above industry average', icon: Users, color: 'text-green-600' }
];

export const systemHealthData = [
  { system: 'KYC Verification Engine', status: 98, health: 'Excellent' },
  { system: 'Transaction Monitoring', status: 97, health: 'Excellent' },
  { system: 'Document Management', status: 95, health: 'Good' },
  { system: 'Risk Assessment AI', status: 92, health: 'Good' },
  { system: 'Sanctions Screening', status: 99, health: 'Excellent' },
  { system: 'Audit Trail Logger', status: 100, health: 'Excellent' }
];

export const recentAuditActivitiesData = [
  { action: 'Completed quarterly compliance review', status: 'success', time: '2h ago' },
  { action: 'Identified gap in sanctions screening', status: 'warning', time: '4h ago' },
  { action: 'Verified 45 client records', status: 'success', time: '6h ago' },
  { action: 'Updated audit procedures document', status: 'info', time: '8h ago' },
  { action: 'Flagged policy violation in Case-1023', status: 'error', time: '12h ago' },
  { action: 'Generated compliance report for Q2', status: 'success', time: '18h ago' }
];

export const complianceCoverageData = [
  { module: 'KYC', coverage: 98, target: 95 },
  { module: 'AML', coverage: 96, target: 95 },
  { module: 'Sanctions', coverage: 99, target: 98 },
  { module: 'PEP', coverage: 94, target: 95 },
  { module: 'EDD', coverage: 97, target: 95 },
  { module: 'Monitoring', coverage: 95, target: 92 }
];

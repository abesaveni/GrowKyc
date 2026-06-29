import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Shield,
  Users,
  AlertTriangle,
  Clock,
  FileText,
  Lock,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Bell,
  BarChart3,
  Eye,
  Network,
  Sparkles,
  Command,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Home,
  AlertCircle,
  Menu,
  X,
  Briefcase
} from 'lucide-react';
import { PartnerDashboard } from './PartnerDashboard';
import { AuditDashboard } from './AuditDashboard';
import { CaseManagement } from './CaseManagement';
import { CaseDetail } from './CaseDetail';
import { GlobalSearch } from './GlobalSearch';
import { ComplianceCopilot } from './ComplianceCopilot';
import { TransactionMonitoring } from './TransactionMonitoring';
import { IntegrationHub } from './IntegrationHub';
import { IndividualOnboarding } from './IndividualOnboarding';
import { ArchitectureViewer } from './ArchitectureViewer';
import { PersonalizedDashboard } from './PersonalizedDashboard';
import { ComplianceOfficer } from './ComplianceOfficer';
import { HeadOfComplianceDashboard } from './HeadOfComplianceDashboard';
import { ExecutiveOverview } from './ExecutiveOverview';
import { SystemSettings } from './SystemSettings';
import { ComprehensiveSettings } from './ComprehensiveSettings';
import { ClientDetail } from './ClientDetail';
import { ProfessionRequirements } from './ProfessionRequirements';
import { ClientKYCDashboard } from '../kyc/ClientKYCDashboard';
import { CaseControlCentre, CaseWorkbench } from '../cases';
import { KYCDashboardOverview } from './KYCDashboardOverview';
import { ActionItemsCenter } from './ActionItemsCenter';
import { ClientReview } from './ClientReview';
import { ClientOnboarding } from '../kyc/ClientOnboarding';
import { ClientOnboardingWizard } from '../kyc/ClientOnboardingWizard';
import { AdminKYCReview } from '../admin/AdminKYCReview';
import { SubmitKYC } from '../kyc/SubmitKYC';
import { CasesLive } from '../cases/CasesLive';
import { AustracSARRegister } from '../austrac/AustracSARRegister';
import { AlertsLive } from '../kyc/AlertsLive';
import { EDDWorkflows } from '../kyc/EDDWorkflows';
import { LiveStatsBar } from './LiveStatsBar';
import { HealthCheckDashboard } from './HealthCheckDashboard';
import { EnterpriseUpgradeHub } from './EnterpriseUpgradeHub';
import { KYCClientDetails } from './KYCClientDetails';
import { InvoicesPage } from '../grow/InvoicesPage';
import { AdminAuditLog } from '../admin/AdminAuditLog';
import { AdminUserManagement } from '../admin/AdminUserManagement';

type ViewRole = 'compliance_officer' | 'partner' | 'auditor' | 'analyst';
type View =
  | 'role_selection'
  | 'architecture_viewer'
  | 'compliance_dashboard'
  | 'partner_dashboard'
  | 'audit_dashboard'
  | 'client_detail'
  | 'kyc_dashboard_overview'
  | 'client_kyc_dashboard'
  | 'action_items'
  | 'case_management'
  | 'case_detail'
  | 'case_control_centre'
  | 'case_workbench'
  | 'transaction_monitoring'
  | 'individual_onboarding'
  | 'client_onboarding'
  | 'entity_onboarding'
  | 'kyc_review'
  | 'kyc_submit'
  | 'cases_live'
  | 'austrac_sar'
  | 'alerts_live'
  | 'edd_live'
  | 'system_settings'
  | 'integration_hub'
  | 'health_check'
  | 'profession_requirements'
  | 'enterprise_upgrade_hub'
  | 'client_review'
  | 'invoices'
  | 'admin_audit_log'
  | 'user_management';

const getPersonaConfig = (userId: string) => {
  const configs: Record<string, { name: string; title: string; role: string }> = {
    sarah_chen: { name: 'Sarah Chen', title: 'Head of Compliance', role: 'compliance_officer' },
    emma_williams: { name: 'Emma Williams', title: 'Compliance Officer', role: 'compliance_officer' },
    jessica_lee: { name: 'Jessica Lee', title: 'Senior Compliance Officer', role: 'compliance_officer' },
    alex_rivera: { name: 'Alex Rivera', title: 'AML Analyst', role: 'analyst' },
    david_thompson: { name: 'David Thompson', title: 'Internal Auditor', role: 'auditor' },
    michael_roberts: { name: 'Michael Roberts', title: 'Managing Partner', role: 'partner' },
    robert_kim: { name: 'Robert Kim', title: 'Risk Partner', role: 'partner' }
  };
  return configs[userId] || configs.sarah_chen;
};

interface SearchSuggestionItem {
  label: string;
  type: 'tab' | 'page' | 'case' | 'action' | 'finding' | 'alert' | 'client';
  icon: React.ComponentType<any>;
  view: string;
  id?: string;
}

const getRoleSearchItems = (role: ViewRole): SearchSuggestionItem[] => {
  const commonItems: SearchSuggestionItem[] = [
    { label: 'Settings', type: 'page', icon: Settings, view: 'system_settings' },
    { label: 'Action Items', type: 'action', icon: AlertCircle, view: 'action_items' }
  ];

  if (role === 'compliance_officer') {
    return [
      { label: 'Dashboard', type: 'tab', icon: Home, view: 'compliance_dashboard' },
      { label: 'Case Control Center', type: 'tab', icon: Shield, view: 'case_control_centre' },
      { label: 'KYC Registry', type: 'tab', icon: Eye, view: 'kyc_dashboard_overview' },
      { label: 'AUSTRAC Compliance', type: 'tab', icon: Shield, view: 'au' },
      { label: 'Audit Log', type: 'tab', icon: Activity, view: 'admin_audit_log' },
      { label: 'Client Onboarding', type: 'page', icon: Users, view: 'client_onboarding' },
      { label: 'Entity Onboarding', type: 'page', icon: Briefcase, view: 'entity_onboarding' },
      { label: 'KYC Review', type: 'page', icon: Eye, view: 'kyc_review' },
      { label: 'Submit KYC', type: 'page', icon: Shield, view: 'kyc_submit' },
      { label: 'Case Register (Live)', type: 'page', icon: Shield, view: 'cases_live' },
      { label: 'AUSTRAC SAR Register', type: 'page', icon: Shield, view: 'austrac_sar' },
      { label: 'Monitoring Alerts', type: 'page', icon: AlertCircle, view: 'alerts_live' },
      { label: 'Enhanced Due Diligence', type: 'page', icon: Shield, view: 'edd_live' },
      { label: 'Alpha Holdings Pty Ltd', type: 'client', icon: Users, view: 'client_detail', id: 'C001' },
      { label: 'John Smith', type: 'client', icon: Users, view: 'client_detail', id: 'C002' },
      { label: 'EDD Investigation - Alpha Holdings', type: 'case', icon: FileText, view: 'case_detail', id: 'CASE-001' },
      ...commonItems
    ];
  }

  if (role === 'analyst') {
    return [
      { label: 'Workspace Dashboard', type: 'tab', icon: Home, view: 'compliance_dashboard' },
      { label: 'Case Control Workbench', type: 'tab', icon: Shield, view: 'case_control_centre' },
      { label: 'KYC Search', type: 'tab', icon: Eye, view: 'kyc_dashboard_overview' },
      { label: 'Transaction Monitoring', type: 'page', icon: Activity, view: 'transaction_monitoring' },
      { label: 'Nexus Technologies Alert', type: 'alert', icon: Bell, view: 'client_review', id: 'Nexus Technologies' },
      { label: 'Apex Holdings Alert', type: 'alert', icon: Bell, view: 'client_review', id: 'Apex Holdings' },
      { label: 'GlobalTech Corp Alert', type: 'alert', icon: Bell, view: 'client_review', id: 'GlobalTech Corp' },
      { label: 'Summit Partners Alert', type: 'alert', icon: Bell, view: 'client_review', id: 'Summit Partners' },
      { label: 'Phoenix Ventures Alert', type: 'alert', icon: Bell, view: 'client_review', id: 'Phoenix Ventures' },
      ...commonItems
    ];
  }

  if (role === 'auditor') {
    return [
      { label: 'Auditor Control Center', type: 'tab', icon: Home, view: 'audit_dashboard' },
      { label: 'System Audit Log', type: 'tab', icon: Activity, view: 'admin_audit_log' },
      { label: 'KYC Verification Trail', type: 'tab', icon: Eye, view: 'kyc_dashboard_overview' },
      { label: 'AUSTRAC Audit Center', type: 'tab', icon: Shield, view: 'au' },
      { label: 'Critical Finding #12', type: 'finding', icon: AlertTriangle, view: 'audit_dashboard' },
      { label: 'Open Audit Findings', type: 'finding', icon: AlertTriangle, view: 'audit_dashboard' },
      ...commonItems
    ];
  }

  if (role === 'partner') {
    return [
      { label: 'Executive Dashboard', type: 'tab', icon: Home, view: 'partner_dashboard' },
      { label: 'Case Approval Center', type: 'tab', icon: Shield, view: 'case_control_centre' },
      { label: 'KYC Portfolio', type: 'tab', icon: Eye, view: 'kyc_dashboard_overview' },
      { label: 'Platform Upgrades', type: 'page', icon: TrendingUp, view: 'enterprise_upgrade_hub' },
      { label: 'Sarah Chen recommendation', type: 'case', icon: FileText, view: 'case_control_centre' },
      ...commonItems
    ];
  }

  return commonItems;
};

// Map internal role keys to URL-friendly role names
const ROLE_TO_PATH: Record<ViewRole, string> = {
  compliance_officer: 'compliance',
  partner: 'partner',
  auditor: 'auditor',
  analyst: 'aml-analyst',
};

// Map URL role names back to internal role keys
const PATH_TO_ROLE: Record<string, ViewRole> = {
  'compliance': 'compliance_officer',
  'compliance-officer': 'compliance_officer',
  'partner': 'partner',
  'auditor': 'auditor',
  'aml-analyst': 'analyst',
};

const canAccessAUSTRAC = (role: ViewRole | null) =>
  role === 'compliance_officer' || role === 'auditor' || role === 'analyst';

const openAUSTRACCentre = (navigate: (path: string) => void, rolePath: string) => {
  localStorage.setItem('growkyc_last_role', rolePath || 'compliance');
  navigate('/au');
};

const getRolePath = (role: ViewRole | null, userId: string): string => {
  if (!role) return '';
  if (role === 'compliance_officer' && userId === 'emma_williams') {
    return 'compliance-officer';
  }
  return ROLE_TO_PATH[role] || '';
};

/** Roles that can open the linked IMFO Platform from the Grow KYC header */
const IMFO_HEADER_ROLES: ViewRole[] = ['compliance_officer', 'partner', 'auditor', 'analyst'];

const IMFO_PLATFORM_PATH = '/finance/dashboard';

const GROW_KYC_TO_IMFO_ROLE: Record<ViewRole, string> = {
  compliance_officer: 'compliance-officer',
  partner: 'fund-manager',
  auditor: 'compliance-officer',
  analyst: 'investment-analyst',
};

// Map the authenticated user's canonical backend role to a compliance ViewRole,
// so each role lands on its own dashboard instead of the persona picker.
const CANONICAL_TO_VIEW_ROLE: Record<string, ViewRole> = {
  Partner: 'partner',
  Managing_Partner: 'partner',
  Analyst: 'analyst',
  AML_Analyst: 'analyst',
  Agent: 'analyst',
  Compliance_Officer: 'compliance_officer',
  Senior_Compliance_Officer: 'compliance_officer',
  Head_of_Compliance: 'compliance_officer',
  MLRO: 'compliance_officer',
  Admin: 'compliance_officer',
  User: 'compliance_officer', // Client fallback (dedicated client portal is App-level)
};

function canonicalRoleToViewRole(role?: string | null): ViewRole {
  if (!role) return 'compliance_officer';
  return CANONICAL_TO_VIEW_ROLE[role] || 'compliance_officer';
}

const VIEW_ROLE_TO_DASHBOARD: Record<ViewRole, View> = {
  compliance_officer: 'compliance_dashboard',
  partner: 'partner_dashboard',
  auditor: 'audit_dashboard',
  analyst: 'compliance_dashboard',
};

// Title shown in the header + used to pick the correct dashboard variant
// (e.g. "Head of Compliance" -> HeadOfComplianceDashboard).
const CANONICAL_TO_TITLE: Record<string, string> = {
  Head_of_Compliance: 'Head of Compliance',
  MLRO: 'Head of Compliance',
  Senior_Compliance_Officer: 'Senior Compliance Officer',
  Compliance_Officer: 'Compliance Officer',
  Partner: 'Managing Partner',
  Managing_Partner: 'Managing Partner',
  Analyst: 'AML Analyst',
  AML_Analyst: 'AML Analyst',
  Agent: 'AML Analyst',
  Admin: 'System Administrator',
  User: 'Client',
};

// The landing view for a user, given their canonical role. Admins land on the
// User Management console; everyone else on their role dashboard.
function defaultViewForRole(canonicalRole: string | undefined, viewRole: ViewRole): View {
  if (canonicalRole === 'Admin') return 'user_management';
  return VIEW_ROLE_TO_DASHBOARD[viewRole];
}

// Map each internal view to its URL suffix (WITHOUT role)
const VIEW_TO_PATH_SUFFIX: Partial<Record<View, string>> = {
  role_selection: '/',
  architecture_viewer: '/architecture',
  compliance_dashboard: '/dashboard',
  partner_dashboard: '/dashboard',
  audit_dashboard: '/dashboard',
  kyc_dashboard_overview: '/kyc',
  client_detail: '/clients',
  action_items: '/actions',
  case_management: '/cases',
  case_detail: '/cases/detail',
  case_control_centre: '/casecontrol',
  case_workbench: '/case-workbench',
  transaction_monitoring: '/transactions',
  individual_onboarding: '/onboarding',
  client_onboarding: '/client-onboarding',
  entity_onboarding: '/entity-onboarding',
  kyc_review: '/kyc-review',
  kyc_submit: '/kyc-submit',
  cases_live: '/case-register',
  austrac_sar: '/austrac-sar',
  alerts_live: '/monitoring-alerts',
  edd_live: '/edd',
  system_settings: '/settings',
  integration_hub: '/integrations',
  health_check: '/health',
  profession_requirements: '/requirements',
  enterprise_upgrade_hub: '/upgrades',
  client_review: '/review', // Note: dynamic clientId handled separately
  client_kyc_dashboard: '/kyc',    // Note: dynamic clientId handled separately
  invoices: '/invoices',
  admin_audit_log: '/audit-log',
  user_management: '/user-management',
};

// Reverse map: URL path suffix → default view
const PATH_SUFFIX_TO_VIEW: Record<string, View> = {
  '/dashboard': 'compliance_dashboard',
  '/kyc': 'kyc_dashboard_overview',
  '/kyc/client': 'client_kyc_dashboard',
  '/clients': 'client_detail',
  '/actions': 'action_items',
  '/cases': 'case_management',
  '/cases/detail': 'case_detail',
  '/casecontrol': 'case_control_centre',
  '/case-workbench': 'case_workbench',
  '/transactions': 'transaction_monitoring',
  '/onboarding': 'individual_onboarding',
  '/client-onboarding': 'client_onboarding',
  '/entity-onboarding': 'entity_onboarding',
  '/kyc-review': 'kyc_review',
  '/kyc-submit': 'kyc_submit',
  '/case-register': 'cases_live',
  '/austrac-sar': 'austrac_sar',
  '/monitoring-alerts': 'alerts_live',
  '/edd': 'edd_live',
  '/settings': 'system_settings',
  '/integrations': 'integration_hub',
  '/health': 'health_check',
  '/requirements': 'profession_requirements',
  '/upgrades': 'enterprise_upgrade_hub',
  '/invoices': 'invoices',
  '/audit-log': 'admin_audit_log',
  '/user-management': 'user_management',
};

interface GrowKYCProps {
  onBack?: () => void;
  roleOverride?: string;
}

export function GrowKYC({ onBack, roleOverride }: GrowKYCProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { role: urlRole, view: urlView } = useParams();
  const { logout, user } = useAuth();
  // The authenticated user's role drives their landing (no persona picker).
  const authRoleValue = (roleOverride ?? (user?.role as string | undefined)) || '';
  const authViewRole = canonicalRoleToViewRole(authRoleValue);

  const [currentView, setCurrentView] = useState<View>(() => {
    if (urlRole && PATH_TO_ROLE[urlRole]) {
      const internalRole = PATH_TO_ROLE[urlRole];
      if (internalRole === 'partner') return 'partner_dashboard';
      if (internalRole === 'auditor') return 'audit_dashboard';
      return 'compliance_dashboard';
    }
    // No role in the URL: land on the authenticated role's default view
    // (Admins -> User Management; everyone else -> their role dashboard).
    return defaultViewForRole(authRoleValue, authViewRole);
  });
  const [selectedRole, setSelectedRole] = useState<ViewRole | null>(
    urlRole ? PATH_TO_ROLE[urlRole] || null : authViewRole
  );
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>(() => {
    return localStorage.getItem('growkyc_selected_user') || 'sarah_chen';
  });

  useEffect(() => {
    localStorage.setItem('growkyc_selected_user', selectedUser);
    window.dispatchEvent(new CustomEvent('growkyc:persona_changed', { detail: selectedUser }));
  }, [selectedUser]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestionItem[]>([]);

  // User personas for switching
  const users = [
    {
      id: 'sarah_chen',
      name: 'Sarah Chen',
      role: 'compliance_officer',
      title: 'Head of Compliance',
      avatar: '👩‍💼',
      description: 'Regulatory audit oversight, policy triggers, and compliance sign-off'
    },
    {
      id: 'emma_williams',
      name: 'Emma Williams',
      role: 'compliance_officer',
      title: 'Compliance Officer',
      avatar: '👩‍💻',
      description: 'KYC verification, case handling, and risk screening'
    },
    {
      id: 'michael_roberts',
      name: 'Michael Roberts',
      role: 'partner',
      title: 'Managing Partner',
      avatar: '👨‍💼',
      description: 'Executive risk oversight and final escalated case approvals'
    },
    {
      id: 'alex_rivera',
      name: 'Alex Rivera',
      role: 'analyst',
      title: 'AML Analyst',
      avatar: '🕵️‍♂️',
      description: 'Transaction monitoring, alert investigations, and individual KYC checks'
    },
    {
      id: 'david_thompson',
      name: 'David Thompson',
      role: 'auditor',
      title: 'Internal Auditor',
      avatar: '🕵️',
      description: 'Audit trail review and compliance validation'
    },
    {
      id: 'jessica_lee',
      name: 'Jessica Lee',
      role: 'compliance_officer',
      title: 'Senior Compliance Officer',
      avatar: '👩‍⚖️',
      description: 'KYC verification and EDD management'
    },
    {
      id: 'robert_kim',
      name: 'Robert Kim',
      role: 'partner',
      title: 'Risk Partner',
      avatar: '👨‍⚖️',
      description: 'Risk framework oversight'
    }
  ];

  // Derive the header/dashboard identity from the REAL authenticated user
  // (no persona switching). Title drives which dashboard variant renders.
  const currentUser = {
    id: user?.id || 'me',
    name: user?.name || user?.email || 'User',
    role: authViewRole,
    title: CANONICAL_TO_TITLE[authRoleValue] || 'Compliance Officer',
    avatar: '👤',
  };

  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const NOTIF_READ_KEY = 'growkyc_read_notif_ids';
  const getReadIds = (): string[] => {
    try { return JSON.parse(localStorage.getItem(NOTIF_READ_KEY) || '[]'); } catch { return []; }
  };
  const persistReadId = (id: string) => {
    try {
      const ids = getReadIds();
      if (!ids.includes(id)) localStorage.setItem(NOTIF_READ_KEY, JSON.stringify([...ids, id]));
    } catch {}
  };

  const [notifications, setNotifications] = useState(() => {
    const readIds = getReadIds();
    return [
    {
      id: 'notif-1',
      title: 'PEP Screening Match Detected',
      desc: "Sanctions Bot flagged Client 'Alpha Holdings Pty Ltd' with high match confidence.",
      type: 'critical',
      time: '10m ago',
      roleRestricted: 'Head of Compliance',
      actionText: 'Review Match',
      actionView: 'client_review',
      actionId: 'Alpha Holdings Pty Ltd',
      read: false
    },
    {
      id: 'notif-2',
      title: 'GreenID Integration Failure',
      desc: 'GreenID API gateway disconnected due to credential expiration.',
      type: 'error',
      time: '32m ago',
      roleRestricted: 'Head of Compliance',
      actionText: 'Update API Keys',
      actionView: 'system_settings',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Escalated Case Approval',
      desc: 'Emma Williams escalated CASE-012 (John Smith) for dual sign-off.',
      type: 'action',
      time: '1h ago',
      roleRestricted: 'Head of Compliance',
      actionText: 'Review Approval',
      actionView: 'case_control_centre',
      read: false
    },
    {
      id: 'notif-4',
      title: 'AUSTRAC Submission Deadline',
      desc: 'AUSTRAC AML/CTF Compliance Report due in 2 days.',
      type: 'warning',
      time: '3h ago',
      roleRestricted: 'Head of Compliance',
      actionText: 'Prepare Report',
      actionView: 'au',
      read: false
    },
    // Officer/Analyst Notifications
    {
      id: 'notif-5',
      title: 'New Investigation Assigned',
      desc: 'New KYC case CASE-109 assigned to you for verification.',
      type: 'info',
      time: '15m ago',
      roleRestricted: 'Compliance Officer',
      actionText: 'Open Case',
      actionView: 'case_control_centre',
      read: false
    },
    {
      id: 'notif-6',
      title: 'Document Uploaded',
      desc: "Client 'John Smith' uploaded missing driver's license.",
      type: 'success',
      time: '45m ago',
      roleRestricted: 'Compliance Officer',
      actionText: 'View Files',
      actionView: 'client_detail',
      actionId: 'C002',
      read: false
    },
    {
      id: 'notif-7',
      title: 'Verification Overdue',
      desc: "Verification task for 'Apex Holdings' is overdue by 24 hours.",
      type: 'warning',
      time: '2h ago',
      roleRestricted: 'Compliance Officer',
      actionText: 'Investigate',
      actionView: 'client_review',
      actionId: 'Apex Holdings',
      read: false
    }
  ].map(n => ({ ...n, read: readIds.includes(n.id) ? true : n.read }));
  });

  // Pull real, per-user notifications from the API and merge them in.
  useEffect(() => {
    const token = sessionStorage.getItem('growkyc_token');
    if (!token) return;
    fetch('/api/v1/notifications?limit=20', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.items?.length) return;
        const mapped = data.items.map((n: any) => ({
          id: `api-${n.id}`,
          realId: n.id,
          real: true,
          title: n.title,
          desc: n.message,
          type: n.type === 'kyc_rejected' ? 'error' : n.type === 'system_alert' ? 'critical' : 'action',
          time: n.created_at ? new Date(n.created_at).toLocaleString() : '',
          roleRestricted: currentUser.title,
          read: n.status !== 'unread',
        }));
        setNotifications((prev: any[]) => [...mapped, ...prev.filter((p) => !p.real)]);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredNotifications = notifications.filter((n: any) => {
    if (n.real) return true; // real API notifications already belong to this user
    if (currentUser.title === 'Head of Compliance') {
      return n.roleRestricted === 'Head of Compliance';
    } else {
      return n.roleRestricted === 'Compliance Officer';
    }
  });

  const notificationsCount = filteredNotifications.filter(n => !n.read).length;

  const handleNotificationAction = (notif: any) => {
    setIsNotificationPanelOpen(false);
    persistReadId(notif.id);
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    if (notif.real && notif.realId) {
      const token = sessionStorage.getItem('growkyc_token');
      fetch(`/api/v1/notifications/${notif.realId}/read`, {
        method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {},
      }).catch(() => {});
    }

    if (notif.actionView === 'client_review' && notif.actionId) {
      if (selectedRole) {
        navigate(`/${rolePath}/review/${notif.actionId}`);
      }
    } else if (notif.actionView === 'system_settings') {
      setCurrentView('system_settings');
    } else if (notif.actionView === 'case_control_centre') {
      setCurrentView('case_control_centre');
    } else if (notif.actionView === 'au') {
      navigate('/au');
    } else if (notif.actionView === 'client_detail' && notif.actionId) {
      setSelectedClientId(notif.actionId);
      setCurrentView('client_detail');
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map((n: any) => {
      const isCurrentRole = n.real || (currentUser.title === 'Head of Compliance'
        ? n.roleRestricted === 'Head of Compliance'
        : n.roleRestricted === 'Compliance Officer');
      if (isCurrentRole) persistReadId(n.id);
      return isCurrentRole ? { ...n, read: true } : n;
    }));
    const token = sessionStorage.getItem('growkyc_token');
    fetch('/api/v1/notifications/read-all', {
      method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).catch(() => {});
  };

  // ── URL ↔ View synchronisation ──────────────────────────────────────────

  // 1. Synchronize selectedRole with URL role parameter
  useEffect(() => {
    if (urlRole && PATH_TO_ROLE[urlRole]) {
      const internalRole = PATH_TO_ROLE[urlRole];
      if (selectedRole !== internalRole) {
        setSelectedRole(internalRole);
      }

      // Synchronize persona based on specific path
      if (urlRole === 'compliance-officer') {
        if (selectedUser !== 'emma_williams') {
          setSelectedUser('emma_williams');
        }
      } else if (urlRole === 'compliance') {
        if (selectedUser === 'emma_williams') {
          setSelectedUser('sarah_chen');
        }
      }
    }
  }, [urlRole]);

  // 2. Push URL whenever currentView, selectedRole, or selectedUser changes
  useEffect(() => {
    if (currentView === 'role_selection') {
      if (location.pathname !== '/') navigate('/');
      return;
    }
    if (currentView === 'architecture_viewer') {
      if (location.pathname !== '/architecture') navigate('/architecture');
      return;
    }

    if (selectedRole) {
      const rolePath = getRolePath(selectedRole, selectedUser);
      const rolePrefix = '/' + rolePath;
      let suffix = VIEW_TO_PATH_SUFFIX[currentView] ?? '/dashboard';

      // Special handling for dynamic client_review path
      if (currentView === 'client_review' && selectedClientId) {
        suffix = `/review/${selectedClientId}`;
      }

      // Special handling for dynamic client_kyc_dashboard path
      if (currentView === 'client_kyc_dashboard' && selectedClientId) {
        suffix = `/kyc/${selectedClientId}`;
      }

      const fullPath = rolePrefix + suffix;

      if (location.pathname !== fullPath) {
        navigate(fullPath);
      }
    }
  }, [currentView, selectedRole, selectedUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // 3. Update view when URL changes (browser back / forward)
  useEffect(() => {
    const pathname = location.pathname;

    // Handle root and architecture
    if (pathname === '/') {
      // Admins land on the User Management console; others on their role dashboard.
      if (authRoleValue === 'Admin') {
        navigate('/compliance/user-management', { replace: true });
        return;
      }
      const rolePath = ROLE_TO_PATH[authViewRole] || 'compliance';
      navigate(`/${rolePath}/dashboard`, { replace: true });
      return;
    }
    if (pathname === '/architecture') {
      if (currentView !== 'architecture_viewer') setCurrentView('architecture_viewer');
      return;
    }

    // Handle role-prefixed paths
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      const roleName = parts[0];
      const suffix = '/' + parts.slice(1).join('/');

      const internalRole = PATH_TO_ROLE[roleName];
      if (internalRole) {
        if (selectedRole !== internalRole) setSelectedRole(internalRole);

        // Pick proper dashboard based on role
        if (suffix === '/dashboard') {
          const roleView: View =
            internalRole === 'partner' ? 'partner_dashboard' :
              internalRole === 'auditor' ? 'audit_dashboard' :
                'compliance_dashboard';
          if (roleView !== currentView) setCurrentView(roleView);
          return;
        }

        const view = PATH_SUFFIX_TO_VIEW[suffix];
        if (view && view !== currentView) {
          setCurrentView(view);
        } else if (parts[1] === 'review' && parts[2]) {
          // Handle dynamic /review/:clientId
          if (currentView !== 'client_review') setCurrentView('client_review');
          if (selectedClientId !== parts[2]) setSelectedClientId(parts[2]);
        } else if (parts[1] === 'kyc' && parts[2]) {
          // Handle dynamic /kyc/:clientId
          if (currentView !== 'client_kyc_dashboard') setCurrentView('client_kyc_dashboard');
          if (selectedClientId !== parts[2]) setSelectedClientId(parts[2]);
        }
      }
    }
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Keyboard shortcut for search (Cmd+K / Ctrl+K) ───────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRoleSelect = (role: ViewRole, userId?: string) => {
    setSelectedRole(role);
    // Auto-open Compliance Copilot on first login
    setIsCopilotOpen(true);

    // Pick the correct active user persona automatically based on selected role
    let targetUserId = userId || 'sarah_chen'; // Default Compliance Officer
    if (!userId) {
      if (role === 'analyst') {
        targetUserId = 'alex_rivera'; // AML Analyst
      } else if (role === 'partner') {
        targetUserId = 'michael_roberts'; // Managing Partner
      } else if (role === 'auditor') {
        targetUserId = 'david_thompson'; // Auditor
      }
    }
    setSelectedUser(targetUserId);

    const rolePath = getRolePath(role, targetUserId);
    navigate(`/${rolePath}/dashboard`);

    switch (role) {
      case 'compliance_officer':
        setCurrentView('compliance_dashboard');
        break;
      case 'partner':
        setCurrentView('partner_dashboard');
        break;
      case 'auditor':
        setCurrentView('audit_dashboard');
        break;
      case 'analyst':
        setCurrentView('compliance_dashboard');
        break;
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchSuggestions([]);
      return;
    }
    const items = getRoleSearchItems(selectedRole || 'compliance_officer');
    const filtered = items.filter(item =>
      item.label.toLowerCase().includes(val.toLowerCase()) ||
      item.type.toLowerCase().includes(val.toLowerCase())
    );
    setSearchSuggestions(filtered);
  };

  const handleSuggestionClick = (item: SearchSuggestionItem) => {
    setSearchQuery('');
    setSearchSuggestions([]);

    if (item.view === 'au') {
      openAUSTRACCentre(navigate, rolePath);
    } else if (item.view === 'client_detail' && item.id) {
      handleClientSelect(item.id);
    } else if (item.view === 'case_detail' && item.id) {
      handleCaseSelect(item.id);
    } else if (item.view === 'client_review' && item.id) {
      setSelectedClientId(item.id);
      setCurrentView('client_review');
    } else {
      setCurrentView(item.view as any);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchSuggestions.length > 0) {
        handleSuggestionClick(searchSuggestions[0]);
      }
    }
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentView('client_detail');
  };

  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentView('case_workbench');
  };

  const handleUserSwitch = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(userId);
      setSelectedRole(user.role as ViewRole);
      setIsUserMenuOpen(false);

      // Navigate to appropriate dashboard
      switch (user.role) {
        case 'compliance_officer':
          setCurrentView('compliance_dashboard');
          break;
        case 'partner':
          setCurrentView('partner_dashboard');
          break;
        case 'auditor':
          setCurrentView('audit_dashboard');
          break;
        case 'analyst':
          setCurrentView('compliance_dashboard');
          break;
      }
    }
  };

  // Role Selection View
  if (currentView === 'role_selection') {
    return (
      <ExecutiveOverview
        onSelectRole={handleRoleSelect}
        onViewArchitecture={() => setCurrentView('architecture_viewer')}
      />
    );
  }

  // Architecture Viewer
  if (currentView === 'architecture_viewer') {
    return (
      <ArchitectureViewer
        onBack={() => setCurrentView('role_selection')}
      />
    );
  }

  // Render appropriate dashboard based on current view
  const rolePath = getRolePath(selectedRole, selectedUser);
  const isComplianceOfficer = selectedRole === 'compliance_officer';

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation Bar */}
      {currentView !== 'client_kyc_dashboard' && (
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-[#0E7C9E]/20 px-4 sm:px-6 py-3 sm:py-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 max-w-[70%] sm:max-w-none">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-white truncate">Grow KYC</h1>
                <p className="text-[10px] sm:text-xs text-white/90 hidden sm:block truncate">
                  {selectedRole === 'compliance_officer' && `${currentUser.title} Portal`}
                  {selectedRole === 'partner' && `${currentUser.title} Portal`}
                  {selectedRole === 'analyst' && `${currentUser.title} Portal`}
                  {selectedRole === 'auditor' && `${currentUser.title} Portal`}
                </p>
              </div>

              {/* Logged-in user — click for the Sign Out menu */}
              <div className="relative ml-1 sm:ml-4 flex-shrink-0">
                <button
                  onClick={() => setIsUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 border border-white/30 bg-white/10 hover:bg-white/20 text-white rounded-md px-2 py-1 h-8 sm:h-9 transition-colors"
                >
                  <span className="text-base sm:text-lg">{currentUser.avatar}</span>
                  <div className="text-left hidden md:block leading-tight">
                    <div className="text-xs font-semibold">{currentUser.name}</div>
                    <div className="text-[10px] text-white/70">{currentUser.title}</div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">{currentUser.title}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (!selectedRole) return;
                          navigate(`/${rolePath}/settings`);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4 text-gray-500" />Settings
                      </button>
                      <button
                        onClick={() => { setIsUserMenuOpen(false); logout(); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4" />Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Inline Role-Specific Search Bar */}
              <div className="relative flex-shrink-0 hidden sm:block">
                <div className="flex items-center bg-white/10 hover:bg-white/15 focus-within:bg-white border border-white/20 rounded-full px-3 py-1.5 transition-all w-44 sm:w-56 md:w-64">
                  <Search className="w-4 h-4 text-white/70 focus-within:text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search pages, tabs, cases..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="bg-transparent text-white focus:text-gray-900 placeholder-white/60 focus:placeholder-gray-400 text-xs font-semibold focus:outline-none w-full"
                  />
                </div>

                {searchQuery.trim() && searchSuggestions.length > 0 && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setSearchQuery('')} />
                    <div className="absolute right-0 sm:left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-3 py-1 bg-gray-50 text-[9px] font-bold text-gray-400 tracking-wider rounded-t-lg">
                        SUGGESTIONS FOR {currentUser.title.toUpperCase()}
                      </div>
                      {searchSuggestions.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(item)}
                          className="w-full text-left text-gray-700 hover:bg-gray-50 flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <item.icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </span>
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 scale-90">
                            {item.type}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Dynamic Role-Based Notification Panel & Header Button */}
              {selectedRole && (
                <div className="relative flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
                    className="relative text-white hover:bg-white/10 p-2 rounded-full flex items-center justify-center h-9 w-9"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5 flex-shrink-0" />
                    {notificationsCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse border-2 border-[#13B5EA]">
                        {notificationsCount}
                      </span>
                    )}
                  </Button>

                  {isNotificationPanelOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setIsNotificationPanelOpen(false)}
                      />

                      <Card className="absolute right-0 mt-2 w-80 sm:w-96 z-50 shadow-2xl border-2 animate-in fade-in slide-in-from-top-2">
                        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50/10 to-indigo-50/10 border-b border-gray-100 flex flex-row items-center justify-between py-3">
                          <div>
                            <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                              <Bell className="w-4 h-4 text-blue-600" />
                              Alerts & Notifications
                            </CardTitle>
                            <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                              {currentUser.title === 'Head of Compliance' ? 'Head of Compliance Scope' : 'Standard Compliance Scope'}
                            </p>
                          </div>
                          {notificationsCount > 0 && (
                            <button
                              onClick={handleMarkAllNotificationsRead}
                              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              Mark all read
                            </button>
                          )}
                        </CardHeader>
                        <CardContent className="p-0 max-h-96 overflow-y-auto">
                          {filteredNotifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2 opacity-80" />
                              <p className="text-sm font-semibold">All caught up!</p>
                              <p className="text-xs text-gray-400 mt-0.5">No notifications in your queue.</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-100">
                              {filteredNotifications.map((notif) => (
                                <div
                                  key={notif.id}
                                  className={`p-4 transition-all hover:bg-gray-50 flex items-start gap-3 ${notif.read ? 'opacity-60' : 'bg-blue-50/20'
                                    }`}
                                >
                                  <div className="mt-1 flex-shrink-0">
                                    {notif.type === 'critical' && <XCircle className="w-4 h-4 text-red-600" />}
                                    {notif.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                                    {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                                    {notif.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                    {notif.type === 'info' && <Bell className="w-4 h-4 text-blue-500" />}
                                    {notif.type === 'action' && <Shield className="w-4 h-4 text-indigo-500" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-xs font-bold text-gray-900 truncate">{notif.title}</p>
                                      <span className="text-[9px] text-gray-400 font-semibold flex-shrink-0">{notif.time}</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{notif.desc}</p>
                                    <div className="mt-2.5 flex items-center justify-between">
                                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${notif.type === 'critical' ? 'bg-red-100 text-red-700' :
                                          notif.type === 'error' ? 'bg-red-100 text-red-700' :
                                            notif.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                                              notif.type === 'success' ? 'bg-green-100 text-green-700' :
                                                notif.type === 'action' ? 'bg-indigo-100 text-indigo-700' :
                                                  'bg-blue-100 text-blue-700'
                                        }`}>
                                        {notif.type}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant={notif.read ? "ghost" : "default"}
                                        onClick={() => handleNotificationAction(notif)}
                                        className="h-6 text-[10px] font-semibold px-2.5 py-0.5"
                                      >
                                        {notif.actionText}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              )}

              {/* Hamburger Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="2xl:hidden text-white hover:bg-white/10 p-2 rounded-full flex items-center justify-center ml-1"
                title="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>

              {/* Desktop Only Navigation Menu */}
              <div className="hidden 2xl:flex items-center gap-1.5 3xl:gap-3 flex-shrink-0">
                <div className="h-6 w-px bg-white/30" />

                {/* Home/Dashboard Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (!selectedRole) return;
                    navigate(`/${rolePath}/dashboard`);
                  }}
                  className="font-semibold text-white hover:bg-white/10 px-2 3xl:px-3 text-xs 3xl:text-sm h-9 flex items-center justify-center flex-shrink-0"
                >
                  <Home className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  <span>Dashboard</span>
                </Button>

                {authRoleValue === 'Admin' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/${rolePath}/user-management`)}
                    className="font-semibold text-white hover:bg-white/10 px-2 3xl:px-3 text-xs 3xl:text-sm h-9 flex items-center justify-center flex-shrink-0"
                  >
                    <Users className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <span>User Management</span>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (!selectedRole) return;
                    setSelectedCaseId('temp-case-id');
                    navigate(`/${rolePath}/casecontrol`);
                  }}
                  className="text-white hover:bg-white/10 px-2 3xl:px-3 text-xs 3xl:text-sm h-9 flex items-center justify-center flex-shrink-0"
                >
                  <Shield className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  <span>Case Control</span>
                </Button>

                {(selectedRole === 'compliance_officer' || selectedRole === 'analyst' || selectedRole === 'auditor') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (!selectedRole) return;
                      navigate(`/${rolePath}/kyc`);
                    }}
                    className="text-white hover:bg-white/10 px-2 3xl:px-3 text-xs 3xl:text-sm h-9 flex items-center justify-center flex-shrink-0"
                  >
                    <Eye className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <span>KYC Dashboard</span>
                  </Button>
                )}

                {canAccessAUSTRAC(selectedRole) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openAUSTRACCentre(navigate, rolePath)}
                    className="text-white hover:bg-white/10 px-2 3xl:px-3 text-xs 3xl:text-sm h-9 flex items-center justify-center flex-shrink-0"
                  >
                    <Shield className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <span>AUSTRAC Compliance</span>
                  </Button>
                )}

                {(selectedRole === 'compliance_officer' || selectedRole === 'partner') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (!selectedRole) return;
                      navigate(`/${rolePath}/invoices`);
                    }}
                    className="font-semibold text-white hover:bg-white/10 px-2 3xl:px-3 text-xs 3xl:text-sm h-9 flex items-center justify-center flex-shrink-0"
                  >
                    <FileText className="w-4 h-4 mr-1.5 flex-shrink-0" />
                    <span>Invoices</span>
                  </Button>
                )}

                {/* More Actions Dropdown */}
                <div className="relative flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                    className="font-semibold text-white hover:bg-white/10 px-2.5 3xl:px-3.5 text-xs 3xl:text-sm h-9 flex items-center justify-center gap-1.5 flex-shrink-0"
                  >
                    <Menu className="w-4 h-4 flex-shrink-0" />
                    <span>More</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  {isMoreDropdownOpen && (
                    <>
                      {/* Backdrop to close dropdown on click-outside */}
                      <div
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setIsMoreDropdownOpen(false)}
                      />

                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 w-60 z-50 animate-in fade-in slide-in-from-top-2 duration-200">

                        {/* 1. Client Onboarding (Primary highlight) - Restricted from Auditors */}
                        {selectedRole !== 'auditor' && (
                          <button
                            onClick={() => {
                              setIsMoreDropdownOpen(false);
                              if (!selectedRole) return;
                              navigate(`/${rolePath}/onboarding`);
                            }}
                            className="w-full text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors"
                          >
                            <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="flex-1">Client Onboarding</span>
                          </button>
                        )}

                        {/* 1b. Entity Onboarding (company/trust/partnership) - Restricted from Auditors */}
                        {selectedRole !== 'auditor' && (
                          <button
                            onClick={() => {
                              setIsMoreDropdownOpen(false);
                              if (!selectedRole) return;
                              navigate(`/${rolePath}/entity-onboarding`);
                            }}
                            className="w-full text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors"
                          >
                            <Briefcase className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="flex-1">Entity Onboarding</span>
                          </button>
                        )}

                        {/* 1c. KYC Review (live queue) - Restricted from Auditors */}
                        {selectedRole !== 'auditor' && (
                          <button
                            onClick={() => {
                              setIsMoreDropdownOpen(false);
                              if (!selectedRole) return;
                              navigate(`/${rolePath}/kyc-review`);
                            }}
                            className="w-full text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors"
                          >
                            <Eye className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="flex-1">KYC Review</span>
                          </button>
                        )}

                        {/* 1d. Submit KYC (client self-service, live API) */}
                        <button
                          onClick={() => {
                            setIsMoreDropdownOpen(false);
                            if (!selectedRole) return;
                            navigate(`/${rolePath}/kyc-submit`);
                          }}
                          className="w-full text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors"
                        >
                          <Shield className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="flex-1">Submit KYC</span>
                        </button>

                        {/* 1e. Case Register (live API) - Restricted from Auditors */}
                        {selectedRole !== 'auditor' && (
                          <button
                            onClick={() => {
                              setIsMoreDropdownOpen(false);
                              if (!selectedRole) return;
                              navigate(`/${rolePath}/case-register`);
                            }}
                            className="w-full text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors"
                          >
                            <Shield className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="flex-1">Case Register (Live)</span>
                          </button>
                        )}

                        {/* 1f. AUSTRAC SAR Register (live API) - Restricted from Auditors */}
                        {selectedRole !== 'auditor' && (
                          <button
                            onClick={() => {
                              setIsMoreDropdownOpen(false);
                              if (!selectedRole) return;
                              navigate(`/${rolePath}/austrac-sar`);
                            }}
                            className="w-full text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors"
                          >
                            <Shield className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="flex-1">AUSTRAC SAR Register</span>
                          </button>
                        )}

                        {/* 1g. Monitoring Alerts (live API) - Restricted from Auditors */}
                        {selectedRole !== 'auditor' && (
                          <button
                            onClick={() => {
                              setIsMoreDropdownOpen(false);
                              if (!selectedRole) return;
                              navigate(`/${rolePath}/monitoring-alerts`);
                            }}
                            className="w-full text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors"
                          >
                            <AlertCircle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="flex-1">Monitoring Alerts</span>
                          </button>
                        )}

                        {/* 1h. Enhanced Due Diligence (live API) - Restricted from Auditors */}
                        {selectedRole !== 'auditor' && (
                          <button
                            onClick={() => {
                              setIsMoreDropdownOpen(false);
                              if (!selectedRole) return;
                              navigate(`/${rolePath}/edd`);
                            }}
                            className="w-full text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors"
                          >
                            <Shield className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="flex-1">Enhanced Due Diligence</span>
                          </button>
                        )}

                        {/* 2. Action Items */}
                        <button
                          onClick={() => {
                            setIsMoreDropdownOpen(false);
                            if (!selectedRole) return;
                            navigate(`/${rolePath}/actions`);
                          }}
                          className="w-full text-left text-gray-700 hover:bg-gray-50 flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors"
                        >
                          <span className="flex items-center gap-3">
                            <AlertCircle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span>Action Items</span>
                          </span>
                          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            3
                          </span>
                        </button>

                        {/* 4. Audit Log (Auditor / Compliance Officer only) */}
                        {(selectedRole === 'compliance_officer' || selectedRole === 'auditor') &&
                          (currentUser.title === 'Head of Compliance' || currentUser.title === 'Senior Compliance Officer' || currentUser.role === 'auditor') && (
                            <button
                              onClick={() => {
                                setIsMoreDropdownOpen(false);
                                navigate(`/${rolePath}/audit-log`);
                              }}
                              className="w-full text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors border-t border-gray-50"
                            >
                              <Activity className="w-4 h-4 text-gray-500 flex-shrink-0" />
                              <span>Audit Log</span>
                            </button>
                          )}

                        {/* 4. Upgrades (Partner only) */}
                        {selectedRole === 'partner' && (
                          <button
                            onClick={() => {
                              setIsMoreDropdownOpen(false);
                              navigate(`/${rolePath}/upgrades`);
                            }}
                            className="w-full text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors border-t border-gray-50"
                          >
                            <TrendingUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span>Upgrades</span>
                          </button>
                        )}

                        {/* 5. Switch to Practice OS */}
                        {selectedRole && IMFO_HEADER_ROLES.includes(selectedRole) && (() => {
                          const persona = getPersonaConfig(selectedUser);
                          return persona.title === 'Head of Compliance' || persona.role === 'partner';
                        })() && (
                            <button
                              onClick={() => {
                                setIsMoreDropdownOpen(false);
                                navigate(IMFO_PLATFORM_PATH, {
                                  state: { imfoRole: GROW_KYC_TO_IMFO_ROLE[selectedRole] }
                                });
                              }}
                              className="w-full text-left text-[#13B5EA] hover:bg-cyan-50/50 flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors border-t border-gray-100 mt-1"
                            >
                              <Briefcase className="w-4 h-4 text-[#13B5EA] flex-shrink-0" />
                              <span>IMFO Platform</span>
                            </button>
                          )}
                      </div>
                    </>
                  )}
                </div>

                {/* Settings - Available for all roles */}
                {selectedRole && (
                  <>
                    <div className="h-6 w-px bg-white/30" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate(`/${rolePath}/settings`);
                      }}
                      className="flex items-center gap-2 text-white hover:bg-white/10 px-2 3xl:px-3 text-xs 3xl:text-sm h-9 flex-shrink-0"
                    >
                      <Settings className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      <span>Settings</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Dropdown */}
      {currentView !== 'client_kyc_dashboard' && isMobileMenuOpen && (
        <div className="2xl:hidden bg-gradient-to-b from-slate-800 to-slate-700 border-b border-[#0E7C9E]/30 px-6 py-4 space-y-3 shadow-inner animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            {selectedRole && IMFO_HEADER_ROLES.includes(selectedRole) && (() => {
              const persona = getPersonaConfig(selectedUser);
              return persona.title === 'Head of Compliance' || persona.role === 'partner';
            })() && (
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => {
                    navigate(IMFO_PLATFORM_PATH, {
                      state: { imfoRole: GROW_KYC_TO_IMFO_ROLE[selectedRole] }
                    });
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start font-semibold text-white border border-white/40 bg-white/15 hover:bg-white/25 py-3 text-base"
                  title="Open IMFO Platform — fund & investment operations"
                >
                  <Briefcase className="w-5 h-5 mr-3 shrink-0" />
                  IMFO Platform
                </Button>
              )}

            {/* Home/Dashboard Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!selectedRole) return;
                navigate(`/${rolePath}/dashboard`);
                setIsMobileMenuOpen(false);
              }}
              className="w-full justify-start text-white hover:bg-white/10 py-3 text-base"
            >
              <Home className="w-5 h-5 mr-3" />
              Dashboard
            </Button>

            {authRoleValue === 'Admin' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate(`/${rolePath}/user-management`);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start text-white hover:bg-white/10 py-3 text-base"
              >
                <Users className="w-5 h-5 mr-3" />
                User Management
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!selectedRole) return;
                setSelectedCaseId('temp-case-id');
                navigate(`/${rolePath}/casecontrol`);
                setIsMobileMenuOpen(false);
              }}
              className="w-full justify-start text-white hover:bg-white/10 py-3 text-base"
            >
              <Shield className="w-5 h-5 mr-3" />
              Case Control
            </Button>

            {(selectedRole === 'compliance_officer' || selectedRole === 'analyst' || selectedRole === 'auditor') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!selectedRole) return;
                  navigate(`/${rolePath}/kyc`);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start text-white hover:bg-white/10 py-3 text-base"
              >
                <Eye className="w-5 h-5 mr-3" />
                KYC Dashboard
              </Button>
            )}

            {canAccessAUSTRAC(selectedRole) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  openAUSTRACCentre(navigate, rolePath);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start text-white hover:bg-white/10 py-3 text-base"
              >
                <Shield className="w-5 h-5 mr-3 text-amber-300 animate-pulse" />
                AUSTRAC Compliance
              </Button>
            )}

            {(selectedRole === 'compliance_officer' || selectedRole === 'auditor') &&
              (currentUser.title === 'Head of Compliance' || currentUser.title === 'Senior Compliance Officer' || currentUser.role === 'auditor') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigate(`/${rolePath}/audit-log`);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-white hover:bg-white/10 py-3 text-base"
                >
                  <Activity className="w-5 h-5 mr-3" />
                  Audit Log
                </Button>
              )}

            {(selectedRole === 'compliance_officer' || selectedRole === 'partner') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (!selectedRole) return;
                  navigate(`/${rolePath}/invoices`);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start text-white hover:bg-white/10 py-3 text-base"
              >
                <FileText className="w-5 h-5 mr-3" />
                Invoices
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!selectedRole) return;
                navigate(`/${rolePath}/actions`);
                setIsMobileMenuOpen(false);
              }}
              className="w-full justify-start text-white hover:bg-white/10 py-3 text-base relative"
            >
              <AlertCircle className="w-5 h-5 mr-3" />
              Action Items
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                3
              </span>
            </Button>

            {selectedRole !== 'auditor' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  if (!selectedRole) return;
                  navigate(`/${rolePath}/onboarding`);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-center bg-white text-[#13B5EA] hover:bg-white/90 font-semibold shadow-lg py-3 text-base"
              >
                <Users className="w-5 h-5 mr-3" />
                Client Onboarding
              </Button>
            )}

            {/* Upgrades - Partner Only */}
            {selectedRole === 'partner' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate(`/${rolePath}/upgrades`);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start text-white hover:bg-white/10 py-3 text-base"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Upgrades
              </Button>
            )}

            {/* Settings - Available for all roles */}
            {selectedRole && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate(`/${rolePath}/settings`);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start text-white hover:bg-white/10 py-3 text-base"
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Global Search */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(view, id) => {
          if (view === 'client_detail' && id) {
            handleClientSelect(id);
          } else if (view === 'case_detail' && id) {
            handleCaseSelect(id);
          } else {
            setCurrentView(view as any);
          }
          setIsSearchOpen(false);
        }}
      />

      {/* Compliance Copilot */}
      <ComplianceCopilot
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        context={{
          page: currentView,
          clientId: selectedClientId || undefined,
          caseId: selectedCaseId || undefined
        }}
      />

      {/* Floating AI Copilot Trigger (Bottom-Right Corner) */}
      {!isCopilotOpen && (
        <Button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-slate-800 to-slate-700 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center border-2 border-white/20 hover:scale-110 transition-transform active:scale-95 duration-200"
          title="Compliance Copilot AI"
        >
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
        </Button>
      )}

      {/* Content Area */}
      <div className="bg-white min-h-screen">
        {(currentView === 'compliance_dashboard' || currentView === 'partner_dashboard' || currentView === 'audit_dashboard') && (
          <div className="px-6 pt-6">
            <LiveStatsBar />
          </div>
        )}
        {currentView === 'compliance_dashboard' && selectedRole === 'compliance_officer' && (
          currentUser.title === 'Head of Compliance' ? (
            <HeadOfComplianceDashboard
              userName={currentUser.name}
              userTitle={currentUser.title}
              userAvatar={currentUser.avatar}
              onNavigateToClients={() => setCurrentView('kyc_dashboard_overview')}
              onNavigateToCases={() => setCurrentView('case_control_centre')}
              onNavigateToCaseControl={() => setCurrentView('case_control_centre')}
              onNavigateToMonitoring={() => setCurrentView('transaction_monitoring')}
              onNavigateToAUSTRAC={() => openAUSTRACCentre(navigate, rolePath)}
              onNavigateToActionItems={() => setCurrentView('action_items')}
              onNavigateToClient={(clientId) => {
                setSelectedClientId(clientId);
                setCurrentView('client_kyc_dashboard');
              }}
              onNavigateToRequirements={() => setCurrentView('profession_requirements')}
            />
          ) : (
            <ComplianceOfficer
              userName={currentUser.name}
              userTitle={currentUser.title}
              userAvatar={currentUser.avatar}
              onNavigateToClients={() => setCurrentView('kyc_dashboard_overview')}
              onNavigateToCases={() => setCurrentView('case_control_centre')}
              onNavigateToCaseControl={() => setCurrentView('case_control_centre')}
              onNavigateToMonitoring={() => setCurrentView('transaction_monitoring')}
              onNavigateToAUSTRAC={() => openAUSTRACCentre(navigate, rolePath)}
              onNavigateToActionItems={() => setCurrentView('action_items')}
              onNavigateToClient={(clientId) => {
                setSelectedClientId(clientId);
                setCurrentView('client_kyc_dashboard');
              }}
              onNavigateToRequirements={() => setCurrentView('profession_requirements')}
            />
          )
        )}
        {currentView === 'compliance_dashboard' && selectedRole === 'analyst' && (
          <PersonalizedDashboard
            userName={currentUser.name}
            userRole={currentUser.role}
            userTitle={currentUser.title}
            userAvatar={currentUser.avatar}
            onNavigateToClients={() => setCurrentView('kyc_dashboard_overview')}
            onNavigateToCases={() => setCurrentView('case_control_centre')}
            onNavigateToCaseControl={() => setCurrentView('case_control_centre')}
            onNavigateToMonitoring={() => setCurrentView('transaction_monitoring')}
            onNavigateToAUSTRAC={() => openAUSTRACCentre(navigate, rolePath)}
            onNavigateToActionItems={() => setCurrentView('action_items')}
            onNavigateToClient={(clientId) => {
              setSelectedClientId(clientId);
              setCurrentView('client_kyc_dashboard');
            }}
            onNavigateToRequirements={() => setCurrentView('profession_requirements')}
          />
        )}
        {currentView === 'partner_dashboard' && (
          <PartnerDashboard
            userName={currentUser.name}
            userRole={currentUser.role}
            userTitle={currentUser.title}
            userAvatar={currentUser.avatar}
            onNavigateToClients={() => setCurrentView('kyc_dashboard_overview')}
            onNavigateToCases={() => setCurrentView('case_management')}
            onNavigateToClient={(clientId) => {
              setSelectedClientId(clientId);
              setCurrentView('client_detail');
            }}
            onNavigateToRequirements={() => setCurrentView('profession_requirements')}
          />
        )}
        {currentView === 'client_review' && (
          <ClientReview
            clientId={selectedClientId || undefined}
            role={selectedRole ? rolePath : undefined}
          />
        )}
        {currentView === 'audit_dashboard' && (
          <PersonalizedDashboard
            userName={currentUser.name}
            userRole={currentUser.role}
            userTitle={currentUser.title}
            userAvatar={currentUser.avatar}
            onNavigateToClients={() => setCurrentView('kyc_dashboard_overview')}
            onNavigateToCases={() => setCurrentView('case_management')}
            onNavigateToClient={(clientId) => {
              setSelectedClientId(clientId);
              setCurrentView('client_detail');
            }}
            onNavigateToRequirements={() => setCurrentView('profession_requirements')}
          />
        )}
        {currentView === 'client_detail' && selectedClientId && (
          <ClientDetail
            clientId={selectedClientId}
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'kyc_dashboard_overview' && (
          <KYCDashboardOverview
            onViewClient={(clientId) => {
              setSelectedClientId(clientId);
              setCurrentView('client_kyc_dashboard');
            }}
          />
        )}
        {currentView === 'client_kyc_dashboard' && (
          <KYCClientDetails
            clientId={selectedClientId || undefined}
            onBack={() => setCurrentView('kyc_dashboard_overview')}
          />
        )}
        {currentView === 'action_items' && (
          <ActionItemsCenter
            onViewClient={(clientId) => {
              setSelectedClientId(clientId);
              setCurrentView('client_kyc_dashboard');
            }}
          />
        )}
        {currentView === 'case_management' && (
          <CaseManagement
            onViewCase={handleCaseSelect}
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'case_detail' && selectedCaseId && (
          <CaseDetail
            caseId={selectedCaseId}
            onBack={() => setCurrentView('case_management')}
          />
        )}
        {currentView === 'case_control_centre' && (
          <CaseControlCentre
            complianceOfficerMode={isComplianceOfficer}
            onOpenCase={(caseId) => {
              setSelectedCaseId(caseId);
              setCurrentView('case_workbench');
            }}
          />
        )}
        {currentView === 'case_workbench' && (
          <CaseWorkbench
            caseId={selectedCaseId || undefined}
            complianceOfficerMode={isComplianceOfficer}
            onBack={() => setCurrentView('case_control_centre')}
          />
        )}
        {currentView === 'transaction_monitoring' && (
          <TransactionMonitoring
            complianceOfficerMode={isComplianceOfficer}
            onOpenReferral={() => setCurrentView('case_control_centre')}
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'individual_onboarding' && (
          <IndividualOnboarding
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'client_onboarding' && (
          <ClientOnboarding
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'kyc_review' && (
          <div className="p-6">
            <AdminKYCReview onNavigate={(_page, id) => { if (id) { setSelectedClientId(id); } }} />
          </div>
        )}
        {currentView === 'edd_live' && (
          <EDDWorkflows onBack={() => {
            if (selectedRole === 'partner') setCurrentView('partner_dashboard');
            else if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
            else setCurrentView('compliance_dashboard');
          }} />
        )}
        {currentView === 'alerts_live' && (
          <AlertsLive onBack={() => {
            if (selectedRole === 'partner') setCurrentView('partner_dashboard');
            else if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
            else setCurrentView('compliance_dashboard');
          }} />
        )}
        {currentView === 'austrac_sar' && (
          <AustracSARRegister onBack={() => {
            if (selectedRole === 'partner') setCurrentView('partner_dashboard');
            else if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
            else setCurrentView('compliance_dashboard');
          }} />
        )}
        {currentView === 'cases_live' && (
          <CasesLive onBack={() => {
            if (selectedRole === 'partner') setCurrentView('partner_dashboard');
            else if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
            else setCurrentView('compliance_dashboard');
          }} />
        )}
        {currentView === 'kyc_submit' && (
          <SubmitKYC onBack={() => {
            if (selectedRole === 'partner') setCurrentView('partner_dashboard');
            else if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
            else setCurrentView('compliance_dashboard');
          }} />
        )}
        {currentView === 'entity_onboarding' && (
          <ClientOnboardingWizard
            onClose={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              else if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              else if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              else if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
              else setCurrentView('kyc_dashboard_overview');
            }}
          />
        )}
        {currentView === 'system_settings' && (
          <ComprehensiveSettings
            role={selectedRole}
            userId={selectedUser}
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'integration_hub' && (
          <IntegrationHub
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'profession_requirements' && selectedRole && (
          <ProfessionRequirements
            profession={selectedRole}
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'health_check' && (
          <HealthCheckDashboard
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'enterprise_upgrade_hub' && (
          <EnterpriseUpgradeHub
            onBack={() => {
              if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
              if (selectedRole === 'partner') setCurrentView('partner_dashboard');
              if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
              if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
            }}
          />
        )}
        {currentView === 'invoices' && (
          <InvoicesPage
            onNavigate={(page) => {
              if (!selectedRole) return;
              navigate(`/${rolePath}/${page}`);
            }}
          />
        )}
        {currentView === 'admin_audit_log' && (
          <div className="p-6">
            <AdminAuditLog
              onNavigateToDashboard={() => {
                if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
                else if (selectedRole === 'partner') setCurrentView('partner_dashboard');
                else if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
                else if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
                else setCurrentView('compliance_dashboard');
              }}
              onNavigateToSettings={() => setCurrentView('system_settings')}
              onHomeClick={() => {
                if (selectedRole === 'compliance_officer') setCurrentView('compliance_dashboard');
                else if (selectedRole === 'partner') setCurrentView('partner_dashboard');
                else if (selectedRole === 'auditor') setCurrentView('audit_dashboard');
                else if (selectedRole === 'analyst') setCurrentView('compliance_dashboard');
                else setCurrentView('compliance_dashboard');
              }}
            />
          </div>
        )}

        {currentView === 'user_management' && (
          <div className="p-6">
            <AdminUserManagement />
          </div>
        )}
      </div>
    </div>
  );
}
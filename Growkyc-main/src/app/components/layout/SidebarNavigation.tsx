import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Home,
  Users,
  Shield,
  FileText,
  TrendingUp,
  Settings,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Building,
  CreditCard,
  Briefcase,
  Scale,
  BookOpen,
  Target,
  Zap,
  Brain,
  HelpCircle,
  Menu,
  X,
  CheckCircle,
  AlertTriangle,
  Activity,
  Globe,
  Layers,
  Clock,
  Download,
  Upload,
  Mail,
  MessageSquare,
  Lock,
  Sparkles
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  badge?: number;
  children?: NavigationItem[];
}

interface UserProfile {
  name: string;
  email: string;
  role: 'admin' | 'compliance-officer' | 'client-manager' | 'client' | 'auditor';
  organization: string;
  avatar?: string;
}

interface SidebarNavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  user: UserProfile;
}

export function SidebarNavigation({ currentPath, onNavigate, user }: SidebarNavigationProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['kyc', 'compliance']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  // Navigation structure based on role
  const getNavigation = (): NavigationItem[] => {
    const baseNav: NavigationItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: Home,
        path: '/dashboard'
      }
    ];

    // Admin and staff navigation
    if (user.role !== 'client') {
      baseNav.push(
        {
          id: 'kyc',
          label: 'KYC Management',
          icon: Shield,
          path: '/kyc',
          children: [
            { id: 'client-onboarding', label: 'Client Onboarding', icon: Users, path: '/kyc/onboarding' },
            { id: 'client-list', label: 'Client List', icon: Building, path: '/kyc/clients' },
            { id: 'pending-reviews', label: 'Pending Reviews', icon: Clock, path: '/kyc/reviews', badge: 8 },
            { id: 'risk-assessment', label: 'Risk Assessment', icon: TrendingUp, path: '/kyc/risk-assessment' },
            { id: 'beneficial-ownership', label: 'Beneficial Ownership', icon: Users, path: '/kyc/beneficial-ownership' },
            { id: 'screening', label: 'Screening & Verification', icon: Search, path: '/kyc/screening' }
          ]
        },
        {
          id: 'enterprise',
          label: 'Enterprise Platform',
          icon: Globe,
          path: '/enterprise',
          children: [
            { id: 'enterprise-dashboard', label: 'Dashboard', icon: Home, path: '/enterprise/dashboard' },
            { id: 'enterprise-firms', label: 'Multi-Firm Management', icon: Building, path: '/enterprise/firms' },
            { id: 'enterprise-clients', label: 'Client Pipeline', icon: Users, path: '/enterprise/clients' },
            { id: 'enterprise-risk', label: 'Risk Intelligence', icon: Shield, path: '/enterprise/risk' },
            { id: 'enterprise-integrations', label: 'Integration Hub', icon: Layers, path: '/enterprise/integrations' },
            { id: 'enterprise-audit', label: 'Audit Trail', icon: Activity, path: '/enterprise/audit' }
          ]
        },
        {
          id: 'compliance',
          label: 'Compliance',
          icon: FileText,
          path: '/compliance',
          children: [
            { id: 'austrac', label: 'AUSTRAC Program', icon: Shield, path: '/compliance/austrac' },
            { id: 'risk-assessment-master', label: 'Risk Assessment Master', icon: Target, path: '/compliance/risk-assessment' },
            { id: 'personnel-policy', label: 'Personnel Policy', icon: Users, path: '/compliance/personnel' },
            { id: 'client-policy', label: 'Client Policy', icon: FileText, path: '/compliance/client-policy' },
            { id: 'client_communications', label: 'Client Communications', icon: Mail, path: '/client-communications' },

            { id: 'reporting', label: 'Reporting (SMR/TTR)', icon: AlertTriangle, path: '/compliance/reporting', badge: 2 },
            { id: 'monitoring', label: 'Monitoring & Alerts', icon: Bell, path: '/compliance/monitoring', badge: 12 }
          ]
        },
        {
          id: 'ai-tools',
          label: 'AI Tools',
          icon: Brain,
          path: '/ai',
          children: [
            { id: 'copilot', label: 'Compliance Copilot', icon: Zap, path: '/ai/copilot' },
            { id: 'ai-helper', label: 'AI Helper', icon: Sparkles, path: '/ai/helper' }
          ]
        },
        {
          id: 'testing',
          label: 'Testing & Audit',
          icon: Target,
          path: '/testing',
          children: [
            { id: 'review-testing', label: 'AUSTRAC Review Testing', icon: CheckCircle, path: '/testing/review' },
            { id: 'simulated-audit', label: 'Simulated Audit', icon: Activity, path: '/testing/audit' },
            { id: 'red-team', label: 'Red Team Attacks', icon: Zap, path: '/testing/red-team' }
          ]
        },
        {
          id: 'integrations',
          label: 'Integrations',
          icon: Layers,
          path: '/integrations',
          children: [
            { id: 'greenid', label: 'GreenID', icon: Shield, path: '/integrations/greenid' },
            { id: 'infotrack', label: 'InfoTrack', icon: Search, path: '/integrations/infotrack' }
          ]
        },
        {
          id: 'reports',
          label: 'Reports & Analytics',
          icon: TrendingUp,
          path: '/reports',
          children: [
            { id: 'compliance-report', label: 'Compliance Report', icon: FileText, path: '/reports/compliance' },
            { id: 'client-analytics', label: 'Client Analytics', icon: Activity, path: '/reports/analytics' },
            { id: 'audit-trail', label: 'Audit Trail', icon: Clock, path: '/reports/audit' }
          ]
        }
      );
    }

    // Client-specific navigation
    if (user.role === 'client') {
      baseNav.push(
        {
          id: 'kyc-status',
          label: 'KYC Status',
          icon: Shield,
          path: '/portal/home'
        },
        {
          id: 'kyc-process',
          label: 'Complete KYC',
          icon: FileText,
          path: '/portal/kyc/start'
        },
        {
          id: 'updates',
          label: 'Submit Updates',
          icon: Upload,
          path: '/portal/updates'
        },
        {
          id: 'messages',
          label: 'Messages',
          icon: MessageSquare,
          path: '/portal/messages',
          badge: 1
        }
      );
    }

    // Industry-specific modules (all roles)
    baseNav.push(
      {
        id: 'industries',
        label: 'Industry Modules',
        icon: Briefcase,
        path: '/industries',
        children: [
          { id: 'finance', label: 'Finance', icon: TrendingUp, path: '/industries/finance' },
          { id: 'legal', label: 'Legal', icon: Scale, path: '/industries/legal' },
          { id: 'accounting', label: 'Accounting', icon: CreditCard, path: '/industries/accounting' },
          { id: 'real-estate', label: 'Real Estate', icon: Building, path: '/industries/real-estate' }
        ]
      }
    );

    // Bottom navigation items
    baseNav.push(
      {
        id: 'help',
        label: 'User Guide',
        icon: BookOpen,
        path: '/help'
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        path: '/settings'
      }
    );

    return baseNav;
  };

  const navigation = getNavigation();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return { label: 'Administrator', color: 'bg-red-500' };
      case 'compliance-officer':
        return { label: 'Compliance Officer', color: 'bg-purple-500' };
      case 'client-manager':
        return { label: 'Client Manager', color: 'bg-blue-500' };
      case 'auditor':
        return { label: 'Auditor', color: 'bg-green-500' };
      case 'client':
        return { label: 'Client', color: 'bg-gray-500' };
      default:
        return { label: 'User', color: 'bg-gray-500' };
    }
  };

  const roleBadge = getRoleBadge(user.role);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r border-white/10 z-40 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'w-80' : 'w-0 lg:w-20'
        } overflow-hidden`}
      >
        {/* Logo / Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 flex-shrink-0">
          {isSidebarOpen && (
            <>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-400" />
                <div>
                  <h1 className="text-xl font-bold text-slate-100">Grow KYC</h1>
                  <p className="text-xs text-slate-300">Sentinel AML</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden w-8 h-8 hover:bg-white/5 rounded-lg flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          {isSidebarOpen ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500/15 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-slate-100 text-sm">{user.name}</p>
                  <p className="text-xs text-slate-300">{user.organization}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-white/10 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-xs text-slate-300 mb-1">Role</p>
                    <span className={`inline-block px-2 py-1 ${roleBadge.color} text-white text-xs font-bold rounded`}>
                      {roleBadge.label}
                    </span>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => onNavigate('/profile')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </button>
                    <button
                      onClick={() => onNavigate('/settings')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-10 h-10 bg-blue-500/15 rounded-full flex items-center justify-center mx-auto">
              <User className="w-5 h-5 text-blue-400" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath.startsWith(item.path);
              const isExpanded = expandedSections.includes(item.id);
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (hasChildren) {
                        toggleSection(item.id);
                      } else {
                        onNavigate(item.path);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${
                      isActive && !hasChildren
                        ? 'bg-blue-500/10 text-blue-300 font-semibold'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isSidebarOpen && (
                      <>
                        <span className="flex-1 text-left text-sm">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {hasChildren && (
                          isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )
                        )}
                      </>
                    )}
                  </button>

                  {/* Children */}
                  {hasChildren && isExpanded && isSidebarOpen && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-white/10 pl-4">
                      {item.children!.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildActive = currentPath === child.path;

                        return (
                          <button
                            key={child.id}
                            onClick={() => onNavigate(child.path)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm relative ${
                              isChildActive
                                ? 'bg-blue-500/10 text-blue-300 font-semibold'
                                : 'text-slate-300 hover:bg-white/5 hover:text-slate-100'
                            }`}
                          >
                            <ChildIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1 text-left">{child.label}</span>
                            {child.badge && (
                              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                {child.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section - Quick Actions */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5" />
                <p className="font-bold text-sm">AI Helper Available</p>
              </div>
              <p className="text-xs text-blue-100 mb-3">
                Get instant help and auto-complete 80% of your work
              </p>
              <Button 
                size="sm" 
                className="w-full bg-white text-blue-400 hover:bg-blue-500/10"
                onClick={() => onNavigate('/ai/copilot')}
              >
                Open AI Copilot
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

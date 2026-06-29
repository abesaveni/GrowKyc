import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FinanceDashboardRoutes } from '../../../finance-dashboard/FinanceRoutes';
import { Button } from '../ui/button';
import {
  Home,
  Users,
  Briefcase,
  FileText,
  DollarSign,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  Shield,
  LogOut,
  Menu,
  X,
  Building2,
  Calendar,
  Target,
  CheckCircle,
  AlertTriangle,
  PieChart,
  Activity
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { IMFODashboard } from './IMFODashboard';
import logo from '../../../assets/60b7d162929b5cb780f781445f70fa18c2c16326.png';
import { financePath, resolveFinancePageFromPath, FINANCE_PAGE_IDS } from '../../../finance-dashboard/financePages';

type IMFORole = 'fund-manager' | 'investment-analyst' | 'compliance-officer' | 'admin';

interface IMFOModuleProps {
  onSwitchModule?: (module: string) => void;
  initialRole?: IMFORole;
}

type IMFOPage = (typeof FINANCE_PAGE_IDS)[number];

function resolveImfoRoleFromNavigation(
  state: unknown,
  fallback: IMFORole
): IMFORole {
  const role = (state as { imfoRole?: string } | null)?.imfoRole;
  const allowed: IMFORole[] = ['fund-manager', 'investment-analyst', 'compliance-officer', 'admin'];
  if (role && allowed.includes(role as IMFORole)) {
    return role as IMFORole;
  }
  return fallback;
}

export function IMFOModule({ onSwitchModule, initialRole = 'fund-manager' }: IMFOModuleProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = resolveFinancePageFromPath(location.pathname) as IMFOPage;
  const [userRole, setUserRole] = useState<IMFORole>(() =>
    resolveImfoRoleFromNavigation(location.state, initialRole)
  );

  useEffect(() => {
    const mapped = resolveImfoRoleFromNavigation(location.state, initialRole);
    setUserRole(mapped);
  }, [location.state, initialRole]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /** Always navigate via React Router — never use local page state for finance routes */
  const goToFinancePage = (page: IMFOPage) => {
    if (!FINANCE_PAGE_IDS.includes(page)) return;
    navigate(financePath(page));
    setMobileMenuOpen(false);
  };

  const mockUser = {
    name: 'Michael Chen',
    role: userRole,
    company: 'IMFO Capital Partners'
  };

  // Navigation items based on role
  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'main' }
    ];

    const fundManagerItems = [
      { id: 'portfolio-management', label: 'Portfolio Management', icon: Briefcase, section: 'management' },
      { id: 'fund-performance', label: 'Fund Performance', icon: TrendingUp, section: 'management' },
      { id: 'investor-relations', label: 'Investor Relations', icon: Users, section: 'management' },
      { id: 'deal-pipeline', label: 'Deal Pipeline', icon: Target, section: 'management' }
    ];

    const complianceItems = [
      { id: 'compliance', label: 'Compliance & Risk', icon: Shield, section: 'compliance' },
      { id: 'reporting', label: 'Regulatory Reporting', icon: FileText, section: 'compliance' }
    ];

    const sharedItems = [
      { id: 'analytics', label: 'Analytics', icon: BarChart3, section: 'shared' },
      { id: 'documents', label: 'Documents', icon: FileText, section: 'shared' }
    ];

    if (userRole === 'admin') {
      return [...baseItems, ...fundManagerItems, ...complianceItems, ...sharedItems];
    } else if (userRole === 'fund-manager') {
      return [...baseItems, ...fundManagerItems, ...sharedItems];
    } else if (userRole === 'investment-analyst') {
      return [...baseItems, ...fundManagerItems, ...sharedItems];
    } else if (userRole === 'compliance-officer') {
      return [...baseItems, ...complianceItems, ...sharedItems];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  // Group navigation items by section
  const groupedNavigation = {
    main: navigationItems.filter(item => item.section === 'main'),
    management: navigationItems.filter(item => item.section === 'management'),
    compliance: navigationItems.filter(item => item.section === 'compliance'),
    shared: navigationItems.filter(item => item.section === 'shared')
  };

  const getPageTitle = () => {
    const titles: { [key in IMFOPage]: string } = {
      'dashboard': 'IMFO Dashboard',
      'portfolio-management': 'Portfolio Management',
      'fund-performance': 'Fund Performance',
      'investor-relations': 'Investor Relations',
      'deal-pipeline': 'Deal Pipeline',
      'compliance': 'Compliance & Risk',
      'reporting': 'Regulatory Reporting',
      'analytics': 'Analytics',
      'documents': 'Documents',
      'settings': 'Settings'
    };
    return titles[currentPage] || 'IMFO Dashboard';
  };

  return (
    <div className="min-h-screen bg-white/5">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-white/10 fixed w-full top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-300" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-300" />
                )}
              </button>
              
              <div className="flex items-center gap-3">
                <img src={logo} alt="IMFO" className="h-8" />
                <div>
                  <h1 className="text-lg font-semibold text-slate-100">IMFO Platform</h1>
                  <p className="text-xs text-slate-400">Investment Management & Fund Operations</p>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Role Switcher */}
              <select
                value={userRole}
                onChange={(e) => {
                  setUserRole(e.target.value as IMFORole);
                  navigate('/finance/dashboard');
                }}
                className="px-3 py-2 border border-purple-300 rounded-lg text-sm font-medium text-purple-300 bg-purple-500/10 hover:bg-purple-500/15 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="fund-manager">ðŸ“Š Fund Manager</option>
                <option value="investment-analyst">ðŸ’¼ Investment Analyst</option>
                <option value="compliance-officer">ðŸ›¡ï¸ Compliance Officer</option>
                <option value="admin">âš™ï¸ Admin</option>
              </select>

              {/* Module Switcher */}
              {onSwitchModule && (
                <select
                  onChange={(e) => onSwitchModule(e.target.value)}
                  className="px-3 py-2 border border-white/10 rounded-lg text-sm font-medium text-slate-300 bg-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  defaultValue="imfo"
                >
                  <option value="grow_kyc">Grow KYC — Compliance</option>
                  <option value="Grow MIP">Switch to Grow MIP</option>
                  <option value="grow_accounting">Switch to Grow Accounting</option>
                  <option value="pfa">Switch to PFA</option>
                  <option value="imfo">IMFO Platform</option>
                  <option value="grow_hq">Switch to Grow HQ</option>
                </select>
              )}

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-100">{mockUser.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{mockUser.company}</p>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-purple-600 text-white">
                    {mockUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900 text-white transition-transform duration-200 z-40 overflow-y-auto ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <nav className="p-4 space-y-6">
          {/* Main Section */}
          {groupedNavigation.main.length > 0 && (
            <div>
              {groupedNavigation.main.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => goToFinancePage(item.id as IMFOPage)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Management Section */}
          {groupedNavigation.management.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Fund Management
              </div>
              <div className="space-y-1">
                {groupedNavigation.management.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => goToFinancePage(item.id as IMFOPage)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Compliance Section */}
          {groupedNavigation.compliance.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Compliance
              </div>
              <div className="space-y-1">
                {groupedNavigation.compliance.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => goToFinancePage(item.id as IMFOPage)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Shared Section */}
          {groupedNavigation.shared.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                General
              </div>
              <div className="space-y-1">
                {groupedNavigation.shared.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => goToFinancePage(item.id as IMFOPage)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 mt-16 min-h-[calc(100vh-4rem)]">
        <FinanceDashboardRoutes
          onGoToKyc={() => onSwitchModule?.('grow_kyc')}
          onNavigate={(page) => goToFinancePage(page as IMFOPage)}
          role={userRole}
        />
      </main>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

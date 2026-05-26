import React, { Suspense, lazy, useState } from 'react';
import { Button } from '../ui/button';
import {
  Home,
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  FileText,
  DollarSign,
  Shield,
  AlertTriangle,
  Target,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  UserPlus,
  GitBranch,
  Wallet,
  Lock,
  Activity,
  BookOpen,
  ArrowUpDown,
  Database,
  CheckCircle,
  Zap,
  Plus
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import logo from '../../../assets/60b7d162929b5cb780f781445f70fa18c2c16326.png';
import { InvestorOnboarding } from './InvestorOnboarding';
import { InvestorRegistry } from './InvestorRegistry';
import { IMFOPlatformDashboard } from './IMFOPlatformDashboard';
import { DealMarketplace } from './DealMarketplace';
import { DealRooms } from './DealRooms';
import { Reports } from './Reports';
import { QuarterlyAuditPacks } from './QuarterlyAuditPacks';
import { RollingCloses } from './RollingCloses';
import { AllocationEngine } from './AllocationEngine';
import { ReceivershipOS } from './ReceivershipOS';
import { TableSkeleton } from '../ui/loading';

const InvestorTiersPage = lazy(() => import('./platform/IMFOPlatformPages').then((m) => ({ default: m.InvestorTiersPage })));
const FundSetupPage = lazy(() => import('./platform/IMFOPlatformPages').then((m) => ({ default: m.FundSetupPage })));
const SpvManagementPage = lazy(() => import('./platform/IMFOPlatformPages').then((m) => ({ default: m.SpvManagementPage })));
const CapitalManagementPage = lazy(() => import('./platform/IMFOPlatformPages').then((m) => ({ default: m.CapitalManagementPage })));
const FeesWaterfallPage = lazy(() => import('./platform/IMFOPlatformPages').then((m) => ({ default: m.FeesWaterfallPage })));
const NavEnginePage = lazy(() => import('./platform/IMFOPlatformPages').then((m) => ({ default: m.NavEnginePage })));
const RiskGradingPage = lazy(() => import('./platform/IMFOPlatformPages').then((m) => ({ default: m.RiskGradingPage })));
const ExposureLimitsPage = lazy(() => import('./platform/IMFOPlatformPages').then((m) => ({ default: m.ExposureLimitsPage })));
const StressTestingPage = lazy(() => import('./platform/IMFOPlatformPages').then((m) => ({ default: m.StressTestingPage })));
const ImBuilderPage = lazy(() => import('./platform/IMFOPlatformPages').then((m) => ({ default: m.ImBuilderPage })));
const WarehouseManagementPage = lazy(() => import('./platform/IMFOPlatformPages').then((m) => ({ default: m.WarehouseManagementPage })));
const XeroIntegrationPage = lazy(() => import('./platform/IMFOPlatformPages').then((m) => ({ default: m.XeroIntegrationPage })));
const PlatformSettingsPage = lazy(() => import('./platform/IMFOPlatformPages').then((m) => ({ default: m.PlatformSettingsPage })));

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="p-6"><TableSkeleton rows={6} /></div>}>{children}</Suspense>;
}

type IMFOPlatformPage =
  | 'dashboard'
  | 'investor-registry'
  | 'investor-onboarding'
  | 'investor-tiers'
  | 'fund-setup'
  | 'spv-management'
  | 'capital-management'
  | 'allocation-engine'
  | 'fees-waterfall'
  | 'nav-engine'
  | 'risk-grading'
  | 'exposure-limits'
  | 'stress-testing'
  | 'marketplace'
  | 'deal-room'
  | 'im-builder'
  | 'rolling-closes'
  | 'warehouse-management'
  | 'xero-integration'
  | 'audit-packs'
  | 'reports'
  | 'settings';

type IMFOPlatformRole = 
  | 'spv-accountant'
  | 'fund-accountant'
  | 'cfo'
  | 'ic-member'
  | 'compliance-officer'
  | 'treasury-officer'
  | 'investor-relations'
  | 'external-auditor'
  | 'trustee-rep'
  | 'tenant-admin';

interface IMFOPlatformModuleProps {
  onSwitchModule?: (module: string) => void;
  initialRole?: IMFOPlatformRole;
}

export function IMFOPlatformModule({ onSwitchModule, initialRole = 'fund-accountant' }: IMFOPlatformModuleProps) {
  const [currentPage, setCurrentPage] = useState<IMFOPlatformPage>('dashboard');
  const [userRole, setUserRole] = useState<IMFOPlatformRole>(initialRole);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTenant] = useState('Acme Capital Partners');
  const [selectedFund] = useState('Growth Credit Fund I');

  const mockUser = {
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@acmecapital.com.au',
    role: userRole,
    tenant: selectedTenant
  };

  // Navigation items based on role
  const getNavigationItems = () => {
    const allItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'main', roles: ['all'] },
      
      // Investor Management
      { id: 'investor-registry', label: 'Investor Registry', icon: Users, section: 'investors', roles: ['all'] },
      { id: 'investor-onboarding', label: 'Onboarding', icon: UserPlus, section: 'investors', roles: ['compliance-officer', 'investor-relations', 'tenant-admin'] },
      { id: 'investor-tiers', label: 'Tiers & Access', icon: Shield, section: 'investors', roles: ['compliance-officer', 'cfo', 'tenant-admin'] },
      
      // Fund Operations
      { id: 'fund-setup', label: 'Fund Setup', icon: Building2, section: 'funds', roles: ['fund-accountant', 'cfo', 'tenant-admin'] },
      { id: 'spv-management', label: 'SPV Management', icon: GitBranch, section: 'funds', roles: ['spv-accountant', 'fund-accountant', 'cfo'] },
      { id: 'capital-management', label: 'Capital Management', icon: Wallet, section: 'funds', roles: ['fund-accountant', 'cfo', 'treasury-officer'] },
      
      // Allocation & Pricing
      { id: 'allocation-engine', label: 'Allocation Engine', icon: Target, section: 'allocation', roles: ['fund-accountant', 'cfo'] },
      { id: 'nav-engine', label: 'NAV Engine', icon: TrendingUp, section: 'allocation', roles: ['fund-accountant', 'cfo', 'ic-member'] },
      { id: 'fees-waterfall', label: 'Fees & Waterfall', icon: DollarSign, section: 'allocation', roles: ['fund-accountant', 'cfo'] },
      
      // Risk & Compliance
      { id: 'risk-grading', label: 'Risk Grading', icon: AlertTriangle, section: 'risk', roles: ['ic-member', 'cfo', 'compliance-officer'] },
      { id: 'exposure-limits', label: 'Exposure Limits', icon: Lock, section: 'risk', roles: ['fund-accountant', 'cfo', 'compliance-officer'] },
      { id: 'stress-testing', label: 'Stress Testing', icon: Activity, section: 'risk', roles: ['ic-member', 'cfo'] },
      
      // Marketplace
      { id: 'marketplace', label: 'Marketplace', icon: Briefcase, section: 'deals', roles: ['all'] },
      { id: 'deal-room', label: 'Deal Rooms', icon: BookOpen, section: 'deals', roles: ['all'] },
      { id: 'im-builder', label: 'IM Builder', icon: FileText, section: 'deals', roles: ['fund-accountant', 'cfo', 'compliance-officer'] },
      { id: 'rolling-closes', label: 'Rolling Closes', icon: ArrowUpDown, section: 'deals', roles: ['fund-accountant', 'cfo'] },
      
      // Integration & Reporting
      { id: 'xero-integration', label: 'Xero Integration', icon: Database, section: 'integration', roles: ['spv-accountant', 'fund-accountant', 'tenant-admin'] },
      { id: 'audit-packs', label: 'Audit Packs', icon: CheckCircle, section: 'integration', roles: ['fund-accountant', 'cfo', 'external-auditor'] },
      { id: 'reports', label: 'Reports', icon: BarChart3, section: 'integration', roles: ['all'] },
      { id: 'settings', label: 'Settings', icon: Settings, section: 'integration', roles: ['tenant-admin', 'cfo', 'fund-accountant'] },
    ];

    // Filter by role
    return allItems.filter(item => 
      item.roles.includes('all') || item.roles.includes(userRole)
    );
  };

  const navigationItems = getNavigationItems();

  // Group navigation items by section
  const groupedNavigation = {
    main: navigationItems.filter(item => item.section === 'main'),
    investors: navigationItems.filter(item => item.section === 'investors'),
    funds: navigationItems.filter(item => item.section === 'funds'),
    allocation: navigationItems.filter(item => item.section === 'allocation'),
    risk: navigationItems.filter(item => item.section === 'risk'),
    deals: navigationItems.filter(item => item.section === 'deals'),
    integration: navigationItems.filter(item => item.section === 'integration'),
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <IMFOPlatformDashboard onNavigate={(page) => setCurrentPage(page as IMFOPlatformPage)} role={userRole} />;
      case 'investor-onboarding':
        return <InvestorOnboarding onNavigate={(page) => setCurrentPage(page as IMFOPlatformPage)} role={userRole} />;
      case 'investor-registry':
        return <InvestorRegistry onNavigate={(page) => setCurrentPage(page as IMFOPlatformPage)} role={userRole} />;
      case 'marketplace':
        return <DealMarketplace onNavigate={(page) => setCurrentPage(page as IMFOPlatformPage)} role={userRole} />;
      case 'deal-room':
        return <DealRooms onNavigate={(page) => setCurrentPage(page as IMFOPlatformPage)} role={userRole} />;
      case 'reports':
        return <Reports onNavigate={(page) => setCurrentPage(page as IMFOPlatformPage)} role={userRole} />;
      case 'audit-packs':
        return <QuarterlyAuditPacks onNavigate={(page) => setCurrentPage(page as IMFOPlatformPage)} role={userRole} />;
      case 'rolling-closes':
        return <RollingCloses onNavigate={(page) => setCurrentPage(page as IMFOPlatformPage)} role={userRole} />;
      case 'allocation-engine':
        return <AllocationEngine onNavigate={(page) => setCurrentPage(page as IMFOPlatformPage)} role={userRole} />;
      case 'investor-tiers':
        return <LazyPage><InvestorTiersPage role={userRole} onNavigate={(p) => setCurrentPage(p as IMFOPlatformPage)} /></LazyPage>;
      case 'fund-setup':
        return <LazyPage><FundSetupPage role={userRole} onNavigate={(p) => setCurrentPage(p as IMFOPlatformPage)} /></LazyPage>;
      case 'spv-management':
        return <LazyPage><SpvManagementPage role={userRole} onNavigate={(p) => setCurrentPage(p as IMFOPlatformPage)} /></LazyPage>;
      case 'capital-management':
        return <LazyPage><CapitalManagementPage role={userRole} onNavigate={(p) => setCurrentPage(p as IMFOPlatformPage)} /></LazyPage>;
      case 'fees-waterfall':
        return <LazyPage><FeesWaterfallPage role={userRole} onNavigate={(p) => setCurrentPage(p as IMFOPlatformPage)} /></LazyPage>;
      case 'nav-engine':
        return <LazyPage><NavEnginePage role={userRole} onNavigate={(p) => setCurrentPage(p as IMFOPlatformPage)} /></LazyPage>;
      case 'risk-grading':
        return <LazyPage><RiskGradingPage role={userRole} onNavigate={(p) => setCurrentPage(p as IMFOPlatformPage)} /></LazyPage>;
      case 'exposure-limits':
        return <LazyPage><ExposureLimitsPage role={userRole} onNavigate={(p) => setCurrentPage(p as IMFOPlatformPage)} /></LazyPage>;
      case 'stress-testing':
        return <LazyPage><StressTestingPage role={userRole} onNavigate={(p) => setCurrentPage(p as IMFOPlatformPage)} /></LazyPage>;
      case 'im-builder':
        return <LazyPage><ImBuilderPage role={userRole} onNavigate={(p) => setCurrentPage(p as IMFOPlatformPage)} /></LazyPage>;
      case 'warehouse-management':
        return <LazyPage><WarehouseManagementPage role={userRole} onNavigate={(p) => setCurrentPage(p as IMFOPlatformPage)} /></LazyPage>;
      case 'xero-integration':
        return <LazyPage><XeroIntegrationPage role={userRole} onNavigate={(p) => setCurrentPage(p as IMFOPlatformPage)} /></LazyPage>;
      case 'settings':
        return <LazyPage><PlatformSettingsPage role={userRole} onNavigate={(p) => setCurrentPage(p as IMFOPlatformPage)} /></LazyPage>;
      default:
        return <IMFOPlatformDashboard onNavigate={(page) => setCurrentPage(page as IMFOPlatformPage)} role={userRole} />;
    }
  };

  const getPageTitle = () => {
    const titles: { [key in IMFOPlatformPage]: string } = {
      'dashboard': 'Platform Dashboard',
      'investor-registry': 'Investor Registry',
      'investor-onboarding': 'Investor Onboarding',
      'investor-tiers': 'Investor Tiers & Access Control',
      'fund-setup': 'Fund Setup',
      'spv-management': 'SPV Management',
      'capital-management': 'Capital Management',
      'allocation-engine': 'Allocation Engine',
      'fees-waterfall': 'Fees & Waterfall',
      'nav-engine': 'NAV Engine',
      'risk-grading': 'Risk Grading',
      'exposure-limits': 'Exposure Limits',
      'stress-testing': 'Dynamic Stress Testing',
      'marketplace': 'Deal Marketplace',
      'deal-room': 'Deal Rooms',
      'im-builder': 'IM Builder',
      'rolling-closes': 'Rolling Closes',
      'warehouse-management': 'Warehouse Management',
      'xero-integration': 'Xero Integration',
      'audit-packs': 'Quarterly Audit Packs',
      'reports': 'Reports',
      'settings': 'Settings'
    };
    return titles[currentPage] || 'IMFO Platform';
  };

  const getPageDescription = () => {
    const descriptions: { [key in IMFOPlatformPage]: string } = {
      'dashboard': 'Bank-grade investor management and fund operations',
      'investor-registry': 'Comprehensive investor master registry with KYC and compliance',
      'investor-onboarding': 'Automated investor onboarding with tier classification',
      'investor-tiers': 'Manage investor tiers and strategy-based access controls',
      'fund-setup': 'Configure funds, classes, and operational parameters',
      'spv-management': 'SPV per deal with Xero tracking integration',
      'capital-management': 'Commitments, calls, subscriptions, and redemptions',
      'allocation-engine': 'Pooled, participation, and hybrid allocation modes',
      'fees-waterfall': 'Fee models, waterfalls, carry, and clawback calculations',
      'nav-engine': 'NAV calculation with governance and hard locks',
      'risk-grading': 'Automated risk scoring and band assignment',
      'exposure-limits': 'Hard-block concentration and exposure controls',
      'stress-testing': 'Dynamic scenario modeling with branded reports',
      'marketplace': 'Public teaser and gated deal marketplace',
      'deal-room': 'Secure deal rooms with document vault and Q&A',
      'im-builder': 'AI-powered IM generation with version control',
      'rolling-closes': 'Manage rolling closes with versioned terms',
      'warehouse-management': 'Warehouse and raise-first deployment',
      'xero-integration': 'Fund-level Xero with SPV tracking categories',
      'audit-packs': 'One-click quarterly audit pack generation',
      'reports': 'Institutional reporting and branded investor packs',
      'settings': 'Platform configuration and preferences'
    };
    return descriptions[currentPage] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
              
              <div className="flex items-center gap-3">
                <img src={logo} alt="IMFO" className="h-8" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">IMFO Platform</h1>
                  <p className="text-xs text-gray-500">Investor Management & Fund Operations</p>
                </div>
              </div>
            </div>

            {/* Center - Tenant and Fund Selector */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <select className="bg-transparent text-sm font-medium text-indigo-900 border-none focus:outline-none">
                  <option>{selectedTenant}</option>
                </select>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <select className="bg-transparent text-sm font-medium text-blue-900 border-none focus:outline-none">
                  <option>{selectedFund}</option>
                  <option>Opportunity Fund II</option>
                  <option>SME Credit Fund</option>
                </select>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Role Switcher */}
              <select
                value={userRole}
                onChange={(e) => {
                  setUserRole(e.target.value as IMFOPlatformRole);
                  setCurrentPage('dashboard');
                }}
                className="px-3 py-2 border border-indigo-300 rounded-lg text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="spv-accountant">SPV Accountant</option>
                <option value="fund-accountant">Fund Accountant</option>
                <option value="cfo">CFO</option>
                <option value="ic-member">IC Member</option>
                <option value="compliance-officer">Compliance Officer</option>
                <option value="treasury-officer">Treasury Officer</option>
                <option value="investor-relations">Investor Relations</option>
                <option value="external-auditor">External Auditor</option>
                <option value="trustee-rep">Trustee Rep</option>
                <option value="tenant-admin">Tenant Admin</option>
              </select>

              {/* Module Switcher */}
              {onSwitchModule && (
                <select
                  onChange={(e) => onSwitchModule(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  defaultValue="imfo"
                >
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
                  <p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
                  <p className="text-xs text-gray-500">{mockUser.email}</p>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-indigo-600 text-white">
                    {mockUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900 text-white transition-transform duration-200 z-40 overflow-y-auto ${ mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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
                    onClick={() => {
                      setCurrentPage(item.id as IMFOPlatformPage);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white'
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

          {/* Investor Management */}
          {groupedNavigation.investors.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Investor Management
              </div>
              <div className="space-y-1">
                {groupedNavigation.investors.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id as IMFOPlatformPage);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
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

          {/* Fund Operations */}
          {groupedNavigation.funds.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Fund Operations
              </div>
              <div className="space-y-1">
                {groupedNavigation.funds.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id as IMFOPlatformPage);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
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

          {/* Allocation & Pricing */}
          {groupedNavigation.allocation.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Allocation & Pricing
              </div>
              <div className="space-y-1">
                {groupedNavigation.allocation.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id as IMFOPlatformPage);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
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

          {/* Risk & Compliance */}
          {groupedNavigation.risk.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Risk & Compliance
              </div>
              <div className="space-y-1">
                {groupedNavigation.risk.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id as IMFOPlatformPage);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
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

          {/* Deal Management */}
          {groupedNavigation.deals.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Deal Management
              </div>
              <div className="space-y-1">
                {groupedNavigation.deals.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id as IMFOPlatformPage);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
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

          {/* Integration & Reporting */}
          {groupedNavigation.integration.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Integration & Reporting
              </div>
              <div className="space-y-1">
                {groupedNavigation.integration.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id as IMFOPlatformPage);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
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
        {renderPageContent()}
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

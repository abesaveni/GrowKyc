import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Home,
  Phone,
  Briefcase,
  FileText,
  DollarSign,
  AlertTriangle,
  Calculator,
  FolderOpen,
  BarChart3,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Building2,
  TrendingUp,
  Calendar,
  CreditCard,
  CheckCircle
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { PFADashboard } from './PFADashboard';
import { EnquiriesManagement } from './EnquiriesManagement';
import { BrokerDashboard } from './BrokerDashboard';
import { NewApplication } from './NewApplication';
import { CreditQueue } from './CreditQueue';
import { LoanLedger } from './LoanLedger';
import { ArrearsManagement } from './ArrearsManagement';
import { Pipeline } from './Pipeline';
import { Settlements } from './Settlements';
import { LoanBook } from './LoanBook';
import { Calculator as LoanCalculator } from './Calculator';
import { Documents } from './Documents';
import { DealView } from './DealView';
import { BorrowerPortal } from './BorrowerPortal';
import { Commission } from './Commission';
import { Reports } from './Reports';
import { Clients } from './Clients';
import { StatusTracker } from './StatusTracker';
import { LoanScenario } from './LoanScenario';
import logo from '../../../assets/60b7d162929b5cb780f781445f70fa18c2c16326.png';

type PFAPage =
  | 'dashboard'
  | 'pfa-enquiries'
  | 'pfa-pipeline'
  | 'pfa-settlements'
  | 'pfa-loan-book'
  | 'pfa-calculator'
  | 'pfa-documents'
  | 'pfa-reports'
  | 'pfa-clients'
  | 'broker-dashboard'
  | 'broker-new-application'
  | 'broker-loan-scenario'
  | 'broker-pipeline'
  | 'broker-commission'
  | 'broker-calculator'
  | 'broker-documents'
  | 'broker-status-tracker'
  | 'broker-deal-view'
  | 'borrower-portal'
  | 'lender-credit-queue'
  | 'lender-deal-view'
  | 'lender-loan-ledger'
  | 'lender-arrears';

type PFARole = 'broker' | 'lender' | 'admin' | 'credit';

interface PFAModuleProps {
  onSwitchModule?: (module: string) => void;
  initialRole?: PFARole;
}

export function PFAModule({ onSwitchModule, initialRole = 'broker' }: PFAModuleProps) {
  const [currentPage, setCurrentPage] = useState<PFAPage>('dashboard');
  const [userRole, setUserRole] = useState<PFARole>(initialRole);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mockUser = {
    name: 'Sarah Johnson',
    role: userRole,
    company: 'Premier Finance Group'
  };

  // Navigation items based on role
  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'main' }
    ];

    const brokerItems = [
      { id: 'broker-dashboard', label: 'Broker Portal', icon: Briefcase, section: 'broker' },
      { id: 'broker-new-application', label: 'New Application', icon: FileText, section: 'broker' },
      { id: 'broker-loan-scenario', label: 'Loan Scenario', icon: Calculator, section: 'broker' },
      { id: 'broker-pipeline', label: 'My Pipeline', icon: TrendingUp, section: 'broker' },
      { id: 'broker-commission', label: 'Commissions', icon: DollarSign, section: 'broker' },
      { id: 'broker-status-tracker', label: 'Status Tracker', icon: Calendar, section: 'broker' }
    ];

    const lenderItems = [
      { id: 'lender-credit-queue', label: 'Credit Queue', icon: FileText, section: 'lender' },
      { id: 'lender-loan-ledger', label: 'Loan Ledger', icon: CreditCard, section: 'lender' },
      { id: 'lender-arrears', label: 'Arrears & Enforcement', icon: AlertTriangle, section: 'lender' },
      { id: 'pfa-loan-book', label: 'Loan Book', icon: Building2, section: 'lender' }
    ];

    const sharedItems = [
      { id: 'borrower-portal', label: 'Borrower Portal', icon: Users, section: 'shared' },
      { id: 'pfa-pipeline', label: 'Pipeline', icon: TrendingUp, section: 'shared' },
      { id: 'pfa-settlements', label: 'Settlements', icon: CheckCircle, section: 'shared' },
      { id: 'pfa-calculator', label: 'Calculator', icon: Calculator, section: 'shared' },
      { id: 'pfa-documents', label: 'Documents', icon: FolderOpen, section: 'shared' },
      { id: 'pfa-reports', label: 'Reports', icon: BarChart3, section: 'shared' },
      { id: 'pfa-clients', label: 'Clients', icon: Users, section: 'shared' }
    ];

    if (userRole === 'admin') {
      return [...baseItems, ...brokerItems, ...lenderItems, ...sharedItems];
    } else if (userRole === 'broker') {
      return [...baseItems, ...brokerItems, ...sharedItems];
    } else if (userRole === 'lender') {
      return [...baseItems, ...lenderItems, ...sharedItems];
    } else if (userRole === 'credit') {
      return [...baseItems, ...lenderItems, ...sharedItems];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  // Group navigation items by section
  const groupedNavigation = {
    main: navigationItems.filter(item => item.section === 'main'),
    broker: navigationItems.filter(item => item.section === 'broker'),
    lender: navigationItems.filter(item => item.section === 'lender'),
    shared: navigationItems.filter(item => item.section === 'shared')
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <PFADashboard onNavigate={(page) => setCurrentPage(page as PFAPage)} />;
      case 'pfa-enquiries':
        return <EnquiriesManagement onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('dashboard')} />;
      case 'broker-dashboard':
        return <BrokerDashboard onNavigate={(page) => setCurrentPage(page as PFAPage)} />;
      case 'broker-new-application':
        return <NewApplication onNavigate={(page) => setCurrentPage(page as PFAPage)} />;
      case 'broker-loan-scenario':
        return <LoanScenario />;
      case 'lender-credit-queue':
        return <CreditQueue onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('dashboard')} />;
      case 'lender-loan-ledger':
        return <LoanLedger onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('dashboard')} />;
      case 'lender-arrears':
        return <ArrearsManagement onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('dashboard')} />;
      case 'pfa-pipeline':
        return <Pipeline onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('dashboard')} />;
      case 'pfa-settlements':
        return <Settlements onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('dashboard')} onSwitchModule={onSwitchModule} />;
      case 'pfa-loan-book':
        return <LoanBook onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('dashboard')} />;
      case 'pfa-calculator':
        return <LoanCalculator onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('dashboard')} />;
      case 'pfa-documents':
        return <Documents onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('dashboard')} />;
      case 'pfa-reports':
        return <Reports onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('dashboard')} />;
      case 'pfa-clients':
        return <Clients onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('dashboard')} />;
      case 'broker-pipeline':
        return <Pipeline onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('broker-dashboard')} />;
      case 'broker-commission':
        return <Commission onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('broker-dashboard')} />;
      case 'broker-calculator':
        return <LoanCalculator onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('broker-dashboard')} />;
      case 'broker-status-tracker':
        return <StatusTracker onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('dashboard')} />;
      case 'broker-deal-view':
        return <DealView onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('dashboard')} />;
      case 'lender-deal-view':
        return <DealView onNavigate={(page) => setCurrentPage(page as PFAPage)} onBack={() => setCurrentPage('dashboard')} />;
      case 'borrower-portal':
        return <BorrowerPortal />;
      default:
        return <PFADashboard onNavigate={(page) => setCurrentPage(page as PFAPage)} />;
    }
  };

  const getPageTitle = () => {
    const titles: { [key in PFAPage]: string } = {
      'dashboard': 'PFA Dashboard',
      'pfa-enquiries': 'Enquiries & Leads',
      'pfa-pipeline': 'Application Pipeline',
      'pfa-settlements': 'Settlements',
      'pfa-loan-book': 'Loan Book',
      'pfa-calculator': 'Loan Calculator',
      'pfa-documents': 'Documents',
      'pfa-reports': 'Reports & Analytics',
      'pfa-clients': 'Client Management',
      'broker-dashboard': 'Broker Portal',
      'broker-new-application': 'New Application',
      'broker-loan-scenario': 'Loan Scenario',
      'broker-pipeline': 'My Pipeline',
      'broker-commission': 'Commissions',
      'broker-calculator': 'Calculator',
      'broker-documents': 'Documents',
      'broker-status-tracker': 'Status Tracker',
      'broker-deal-view': 'Deal View',
      'borrower-portal': 'Borrower Portal',
      'lender-credit-queue': 'Credit Assessment Queue',
      'lender-deal-view': 'Deal View',
      'lender-loan-ledger': 'Loan Ledger',
      'lender-arrears': 'Arrears & Enforcement'
    };
    return titles[currentPage] || 'PFA Dashboard';
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
                <img src={logo} alt="PFA" className="h-8" />
                <div>
                  <h1 className="text-lg font-semibold text-slate-100">PFA Loan Management</h1>
                  <p className="text-xs text-slate-400">Business Lending Platform</p>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Role Switcher */}
              <select
                value={userRole}
                onChange={(e) => {
                  setUserRole(e.target.value as PFARole);
                  setCurrentPage('dashboard');
                }}
                className="px-3 py-2 border border-blue-300 rounded-lg text-sm font-medium text-blue-300 bg-blue-500/10 hover:bg-blue-500/15 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="broker">ðŸ¤ Broker</option>
                <option value="lender">ðŸ¦ Lender</option>
                <option value="admin">âš™ï¸ Admin</option>
                <option value="credit">ðŸ’³ Credit</option>
              </select>

              {/* Module Switcher */}
              {onSwitchModule && (
                <select
                  onChange={(e) => onSwitchModule(e.target.value)}
                  className="px-3 py-2 border border-white/10 rounded-lg text-sm font-medium text-slate-300 bg-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="pfa"
                >
                  <option value="Grow MIP">Switch to Grow MIP</option>
                  <option value="grow_accounting">Switch to Grow Accounting</option>
                  <option value="pfa">PFA Loan Management</option>
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
                  <AvatarFallback className="bg-blue-600 text-white">
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
                    onClick={() => {
                      setCurrentPage(item.id as PFAPage);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
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

          {/* Broker Section */}
          {groupedNavigation.broker.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Broker Tools
              </div>
              <div className="space-y-1">
                {groupedNavigation.broker.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id as PFAPage);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
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

          {/* Lender Section */}
          {groupedNavigation.lender.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Lender Tools
              </div>
              <div className="space-y-1">
                {groupedNavigation.lender.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id as PFAPage);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
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
                      onClick={() => {
                        setCurrentPage(item.id as PFAPage);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
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

// Placeholder component
function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-white/10 p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">{title}</h2>
        <p className="text-slate-300">{description}</p>
      </div>
    </div>
  );
}

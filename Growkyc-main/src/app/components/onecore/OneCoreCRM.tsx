import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Home,
  Users,
  Briefcase,
  TrendingUp,
  Mail,
  Ticket,
  FolderKanban,
  DollarSign,
  Brain,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Building2,
  Phone,
  MessageSquare,
  Calendar,
  FileText,
  Zap,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  Filter,
  Download,
  Upload,
  Globe,
  Shield,
  Plug,
  Sparkles,
  Activity,
  PieChart,
  LineChart,
  UserCheck,
  CreditCard,
  Inbox
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ContactsModule } from './ContactsModule';
import { DealsModule } from './DealsModule';
import { LeadsModule } from './LeadsModule';
import { MarketingModule } from './MarketingModule';
import { ServiceModule } from './ServiceModule';
import { ProjectsModule } from './ProjectsModule';
import { BillingModule } from './BillingModule';
import { AIModule } from './AIModule';
import { ReportsModule } from './ReportsModule';
import { IntegrationsModule } from './IntegrationsModule';

type OneCoreModule = 
  | 'dashboard'
  | 'contacts'
  | 'deals'
  | 'leads'
  | 'marketing'
  | 'service'
  | 'projects'
  | 'billing'
  | 'ai'
  | 'reports'
  | 'integrations';

type UserRole =
  | 'super-admin'
  | 'workspace-owner'
  | 'sales-manager'
  | 'sales-rep'
  | 'marketing-manager'
  | 'marketing-staff'
  | 'service-manager'
  | 'support-agent'
  | 'project-manager'
  | 'team-member'
  | 'finance-admin'
  | 'client-user';

interface OneCoreCRMProps {
  onSwitchModule?: (module: string) => void;
  initialRole?: UserRole;
}

export function OneCoreCRM({ onSwitchModule, initialRole = 'sales-manager' }: OneCoreCRMProps) {
  const [currentModule, setCurrentModule] = useState<OneCoreModule>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(initialRole);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedWorkspace] = useState('Acme Solutions Inc');

  const mockUser = {
    name: 'Jessica Martinez',
    email: 'jessica@acmesolutions.com',
    role: userRole,
    workspace: selectedWorkspace,
    avatar: 'JM'
  };

  // Navigation items based on role
  const getNavigationItems = () => {
    const allItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'main', roles: ['all'] },
      
      // Sales & CRM
      { id: 'contacts', label: 'Contacts', icon: Users, section: 'sales', roles: ['all'] },
      { id: 'deals', label: 'Deals & Pipeline', icon: Briefcase, section: 'sales', roles: ['super-admin', 'workspace-owner', 'sales-manager', 'sales-rep'] },
      { id: 'leads', label: 'Leads', icon: Target, section: 'sales', roles: ['super-admin', 'workspace-owner', 'sales-manager', 'sales-rep', 'marketing-manager', 'marketing-staff'] },
      
      // Marketing
      { id: 'marketing', label: 'Marketing', icon: Mail, section: 'marketing', roles: ['super-admin', 'workspace-owner', 'marketing-manager', 'marketing-staff'] },
      
      // Service
      { id: 'service', label: 'Service & Tickets', icon: Ticket, section: 'service', roles: ['super-admin', 'workspace-owner', 'service-manager', 'support-agent'] },
      
      // Projects
      { id: 'projects', label: 'Projects', icon: FolderKanban, section: 'projects', roles: ['super-admin', 'workspace-owner', 'project-manager', 'team-member'] },
      
      // Billing
      { id: 'billing', label: 'Billing', icon: DollarSign, section: 'finance', roles: ['super-admin', 'workspace-owner', 'finance-admin'] },
      
      // AI & Analytics
      { id: 'ai', label: 'AI Intelligence', icon: Brain, section: 'intelligence', roles: ['super-admin', 'workspace-owner', 'sales-manager', 'marketing-manager'] },
      { id: 'reports', label: 'Reports', icon: BarChart3, section: 'intelligence', roles: ['all'] },
      
      // System
      { id: 'integrations', label: 'Integrations', icon: Plug, section: 'system', roles: ['super-admin', 'workspace-owner'] }
    ];

    return allItems.filter(item => 
      item.roles.includes('all') || item.roles.includes(userRole)
    );
  };

  const navigationItems = getNavigationItems();

  // Group navigation by section
  const groupedNavigation = {
    main: navigationItems.filter(item => item.section === 'main'),
    sales: navigationItems.filter(item => item.section === 'sales'),
    marketing: navigationItems.filter(item => item.section === 'marketing'),
    service: navigationItems.filter(item => item.section === 'service'),
    projects: navigationItems.filter(item => item.section === 'projects'),
    finance: navigationItems.filter(item => item.section === 'finance'),
    intelligence: navigationItems.filter(item => item.section === 'intelligence'),
    system: navigationItems.filter(item => item.section === 'system')
  };

  const renderModuleContent = () => {
    switch (currentModule) {
      case 'dashboard':
        return <DashboardModule role={userRole} onNavigate={setCurrentModule} />;
      case 'contacts':
        return <ContactsModule role={userRole} />;
      case 'deals':
        return <DealsModule role={userRole} />;
      case 'leads':
        return <LeadsModule role={userRole} />;
      case 'marketing':
        return <MarketingModule role={userRole} />;
      case 'service':
        return <ServiceModule role={userRole} />;
      case 'projects':
        return <ProjectsModule role={userRole} />;
      case 'billing':
        return <BillingModule role={userRole} />;
      case 'ai':
        return <AIModule role={userRole} />;
      case 'reports':
        return <ReportsModule role={userRole} />;
      case 'integrations':
        return <IntegrationsModule role={userRole} />;
      default:
        return <DashboardModule role={userRole} onNavigate={setCurrentModule} />;
    }
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
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">OneCore CRM</h1>
                  <p className="text-xs text-gray-500">All-in-One Business Platform</p>
                </div>
              </div>
            </div>

            {/* Center - Workspace Selector */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <select className="bg-transparent text-sm font-medium text-indigo-900 border-none focus:outline-none">
                  <option>{selectedWorkspace}</option>
                  <option>Beta Innovations Ltd</option>
                  <option>Gamma Enterprises</option>
                </select>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Global Search */}
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search everything..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Quick Actions */}
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>

              {/* Role Switcher (Dev Tool) */}
              <select
                value={userRole}
                onChange={(e) => {
                  setUserRole(e.target.value as UserRole);
                  setCurrentModule('dashboard');
                }}
                className="px-3 py-2 border border-indigo-300 rounded-lg text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="super-admin">Super Admin</option>
                <option value="workspace-owner">Workspace Owner</option>
                <option value="sales-manager">Sales Manager</option>
                <option value="sales-rep">Sales Rep</option>
                <option value="marketing-manager">Marketing Manager</option>
                <option value="marketing-staff">Marketing Staff</option>
                <option value="service-manager">Service Manager</option>
                <option value="support-agent">Support Agent</option>
                <option value="project-manager">Project Manager</option>
                <option value="team-member">Team Member</option>
                <option value="finance-admin">Finance Admin</option>
                <option value="client-user">Client User</option>
              </select>

              {/* Module Switcher */}
              {onSwitchModule && (
                <select
                  onChange={(e) => onSwitchModule(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  defaultValue="onecore"
                >
                  <option value="Grow MIP">Switch to Grow MIP</option>
                  <option value="grow_accounting">Switch to Grow Accounting</option>
                  <option value="pfa">Switch to PFA</option>
                  <option value="imfo">Switch to IMFO</option>
                  <option value="receivership">Switch to Receivership OS</option>
                  <option value="onecore">OneCore CRM</option>
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
                    {mockUser.avatar}
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
          {/* Main */}
          {groupedNavigation.main.length > 0 && (
            <div>
              {groupedNavigation.main.map((item) => {
                const Icon = item.icon;
                const isActive = currentModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentModule(item.id as OneCoreModule);
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

          {/* Sales & CRM */}
          {groupedNavigation.sales.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Sales & CRM
              </div>
              <div className="space-y-1">
                {groupedNavigation.sales.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentModule(item.id as OneCoreModule);
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

          {/* Marketing */}
          {groupedNavigation.marketing.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Marketing
              </div>
              <div className="space-y-1">
                {groupedNavigation.marketing.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentModule(item.id as OneCoreModule);
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

          {/* Service */}
          {groupedNavigation.service.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Service
              </div>
              <div className="space-y-1">
                {groupedNavigation.service.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentModule(item.id as OneCoreModule);
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

          {/* Projects */}
          {groupedNavigation.projects.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Projects
              </div>
              <div className="space-y-1">
                {groupedNavigation.projects.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentModule(item.id as OneCoreModule);
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

          {/* Finance */}
          {groupedNavigation.finance.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Finance
              </div>
              <div className="space-y-1">
                {groupedNavigation.finance.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentModule(item.id as OneCoreModule);
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

          {/* Intelligence */}
          {groupedNavigation.intelligence.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Intelligence
              </div>
              <div className="space-y-1">
                {groupedNavigation.intelligence.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentModule(item.id as OneCoreModule);
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

          {/* System */}
          {groupedNavigation.system.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                System
              </div>
              <div className="space-y-1">
                {groupedNavigation.system.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentModule(item.id as OneCoreModule);
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
        {renderModuleContent()}
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

// Dashboard Module
function DashboardModule({ role, onNavigate }: any) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Jessica!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Today
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Revenue (MTD)</p>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">$145.2K</p>
          <div className="flex items-center gap-1 mt-2 text-xs">
            <span className="text-green-600 font-medium">+12.5%</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Active Deals</p>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">47</p>
          <div className="flex items-center gap-1 mt-2 text-xs">
            <span className="text-blue-600 font-medium">$892K</span>
            <span className="text-gray-500">pipeline value</span>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">New Leads</p>
            <Target className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">128</p>
          <div className="flex items-center gap-1 mt-2 text-xs">
            <span className="text-purple-600 font-medium">+8.2%</span>
            <span className="text-gray-500">this week</span>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Open Tickets</p>
            <Ticket className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">23</p>
          <div className="flex items-center gap-1 mt-2 text-xs">
            <span className="text-orange-600 font-medium">5 urgent</span>
            <span className="text-gray-500">needs attention</span>
          </div>
        </div>
      </div>

      {/* Sales Pipeline */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white border border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Sales Pipeline</h3>
            <Button variant="outline" size="sm" onClick={() => onNavigate('deals')}>
              View All
            </Button>
          </div>
          
          {/* Pipeline Stages */}
          <div className="space-y-4">
            {[
              { stage: 'Prospecting', deals: 18, value: 245000, color: 'blue' },
              { stage: 'Qualification', deals: 12, value: 189000, color: 'indigo' },
              { stage: 'Proposal', deals: 8, value: 285000, color: 'purple' },
              { stage: 'Negotiation', deals: 5, value: 173000, color: 'pink' },
              { stage: 'Closing', deals: 4, value: 98000, color: 'green' }
            ].map((stage, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ${(stage.value / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-gray-500">{stage.deals} deals</p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full bg-${stage.color}-600`}
                      style={{ width: `${(stage.value / 285000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              {
                action: 'Deal won',
                subject: 'TechCo Enterprise',
                value: '$45,000',
                time: '10 mins ago',
                icon: CheckCircle,
                color: 'green'
              },
              {
                action: 'New lead',
                subject: 'Sarah Johnson',
                value: 'Marketing',
                time: '1 hour ago',
                icon: Target,
                color: 'purple'
              },
              {
                action: 'Ticket resolved',
                subject: '#TK-2453',
                value: 'Support',
                time: '2 hours ago',
                icon: Ticket,
                color: 'blue'
              },
              {
                action: 'Payment received',
                subject: 'Invoice #INV-4521',
                value: '$12,500',
                time: '3 hours ago',
                icon: DollarSign,
                color: 'green'
              },
              {
                action: 'Meeting scheduled',
                subject: 'Demo with Acme Inc',
                value: 'Tomorrow',
                time: '4 hours ago',
                icon: Calendar,
                color: 'orange'
              }
            ].map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                  <div className={`w-8 h-8 rounded-full bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 text-${activity.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600 truncate">{activity.subject}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{activity.time}</span>
                      <span className={`text-xs font-medium text-${activity.color}-600`}>{activity.value}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'New Contact', icon: Users, action: 'contacts', color: 'blue' },
          { label: 'Create Deal', icon: Briefcase, action: 'deals', color: 'indigo' },
          { label: 'Send Campaign', icon: Mail, action: 'marketing', color: 'purple' },
          { label: 'Log Activity', icon: Activity, action: 'contacts', color: 'green' }
        ].map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={() => onNavigate(action.action)}
              className={`p-6 bg-white border border-gray-300 rounded-lg hover:shadow-lg transition-shadow group`}
            >
              <div className={`w-12 h-12 rounded-lg bg-${action.color}-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 text-${action.color}-600`} />
              </div>
              <p className="text-sm font-semibold text-gray-900">{action.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

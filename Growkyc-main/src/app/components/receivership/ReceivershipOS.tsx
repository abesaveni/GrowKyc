import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Archive,
  BarChart3,
  Briefcase,
  Calendar,
  CheckCircle,
  DollarSign,
  FileText,
  Gavel,
  Home,
  LogOut,
  Menu,
  Package,
  Scale,
  Search,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Users,
  Bell,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import logo from '../../../assets/60b7d162929b5cb780f781445f70fa18c2c16326.png';
import { AssetsHub } from './views/AssetsHub';
import { CreditorManagementView } from './views/CreditorManagementView';
import { ReceivershipReportsHub } from './views/ReceivershipReportsHub';

type ReceivershipPage = 
  | 'dashboard'
  | 'matters'
  | 'assets'
  | 'security-debt'
  | 'trading'
  | 'trust-accounting'
  | 'stakeholders'
  | 'restructuring'
  | 'reports'
  | 'workflow'
  | 'documents'
  | 'audit-trail'
  | 'admin';

type ReceivershipRole =
  | 'system-owner'
  | 'appointed-receiver'
  | 'case-manager'
  | 'trust-accountant'
  | 'restructuring-advisor'
  | 'external-lawyer'
  | 'secured-creditor-portal'
  | 'general-creditor-portal';

type MatterStatus = 'active' | 'trading' | 'restructuring' | 'closed' | 'awaiting-exit';

interface ReceivershipOSProps {
  onSwitchModule?: (module: string) => void;
  initialRole?: ReceivershipRole;
}

export function ReceivershipOS({ onSwitchModule, initialRole = 'case-manager' }: ReceivershipOSProps) {
  const [currentPage, setCurrentPage] = useState<ReceivershipPage>('dashboard');
  const [userRole, setUserRole] = useState<ReceivershipRole>(initialRole);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedMatter, setSelectedMatter] = useState('MAT-2024-008');

  const mockUser = {
    name: 'David Wilson',
    email: 'david.wilson@restructuring.com.au',
    role: userRole,
    firm: 'Wilson Advisory Partners'
  };

  // Mock matters data
  const mockMatters = [
    {
      id: 'MAT-2024-008',
      entityName: 'TechCo Manufacturing Pty Ltd',
      appointmentType: 'Receivership',
      status: 'active',
      daysActive: 45,
      cashAtBank: 1250000,
      assetsUnderControl: 8500000,
      securedDebt: 6200000,
      unsecuredDebt: 2800000,
      nextDeadline: '2024-03-01',
      riskScore: 72,
      exitProbability: 0.65
    },
    {
      id: 'MAT-2024-007',
      entityName: 'Retail Group Australia Ltd',
      appointmentType: 'VA + DOCA',
      status: 'restructuring',
      daysActive: 120,
      cashAtBank: 450000,
      assetsUnderControl: 3200000,
      securedDebt: 2100000,
      unsecuredDebt: 4500000,
      nextDeadline: '2024-02-25',
      riskScore: 45,
      exitProbability: 0.35
    }
  ];

  const selectedMatterData = mockMatters.find(m => m.id === selectedMatter) || mockMatters[0];

  // Navigation items based on role
  const getNavigationItems = () => {
    const allItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['all'] },
      { id: 'matters', label: 'Matters', icon: Briefcase, roles: ['system-owner', 'appointed-receiver', 'case-manager'] },
      { id: 'assets', label: 'Assets', icon: Package, roles: ['system-owner', 'appointed-receiver', 'case-manager'] },
      { id: 'security-debt', label: 'Security & Debt', icon: Shield, roles: ['system-owner', 'appointed-receiver', 'case-manager', 'trust-accountant'] },
      { id: 'trading', label: 'Trading', icon: TrendingUp, roles: ['system-owner', 'appointed-receiver', 'case-manager', 'restructuring-advisor'] },
      { id: 'trust-accounting', label: 'Trust Accounting', icon: DollarSign, roles: ['system-owner', 'appointed-receiver', 'trust-accountant'] },
      { id: 'stakeholders', label: 'Stakeholders', icon: Users, roles: ['system-owner', 'appointed-receiver', 'case-manager'] },
      { id: 'restructuring', label: 'Restructuring', icon: Target, roles: ['system-owner', 'appointed-receiver', 'case-manager', 'restructuring-advisor'] },
      { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['all'] },
      { id: 'workflow', label: 'Workflow', icon: CheckCircle, roles: ['system-owner', 'appointed-receiver', 'case-manager'] },
      { id: 'documents', label: 'Documents', icon: FileText, roles: ['all'] },
      { id: 'audit-trail', label: 'Audit Trail', icon: Activity, roles: ['system-owner', 'appointed-receiver'] },
      { id: 'admin', label: 'Admin', icon: Settings, roles: ['system-owner', 'appointed-receiver'] }
    ];

    return allItems.filter(item => 
      item.roles.includes('all') || item.roles.includes(userRole)
    );
  };

  const navigationItems = getNavigationItems();

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <ReceivershipDashboard matter={selectedMatterData} role={userRole} onNavigate={setCurrentPage} />;
      case 'restructuring':
        return <RestructuringModule matter={selectedMatterData} role={userRole} />;
      case 'assets':
        return <AssetsHub matterId={selectedMatter} />;
      case 'trust-accounting':
        return <TrustAccounting matter={selectedMatterData} role={userRole} />;
      case 'stakeholders':
        return <CreditorManagementView />;
      case 'reports':
        return <ReceivershipReportsHub />;
      default:
        return <PlaceholderPage title={getPageTitle()} description={getPageDescription()} />;
    }
  };

  const getPageTitle = () => {
    const titles: { [key in ReceivershipPage]: string } = {
      'dashboard': 'Matter Dashboard',
      'matters': 'All Matters',
      'assets': 'Asset Register',
      'security-debt': 'Security & Debt Register',
      'trading': 'Trading Operations',
      'trust-accounting': 'Trust Accounting',
      'stakeholders': 'Stakeholders & Claims',
      'restructuring': 'Restructuring Engine',
      'reports': 'Statutory Reports',
      'workflow': 'Workflow Management',
      'documents': 'Document Vault',
      'audit-trail': 'Audit Trail',
      'admin': 'System Administration'
    };
    return titles[currentPage] || 'Receivership OS';
  };

  const getPageDescription = () => {
    const descriptions: { [key in ReceivershipPage]: string } = {
      'dashboard': 'Real-time matter overview with risk alerts and statutory deadlines',
      'matters': 'All appointment matters with status tracking',
      'assets': 'Complete asset register with control and realisation tracking',
      'security-debt': 'Security ranking, debt schedule, and waterfall calculator',
      'trading': 'Trading P&L, cashflow forecasting, and viability monitoring',
      'trust-accounting': 'Trust receipts, payments, reconciliation, and reporting',
      'stakeholders': 'Creditor register, claims adjudication, and portal management',
      'restructuring': 'Debt restructure modeling, scenario planning, and DOCA builder',
      'reports': 'Statutory reports, asset realization, and creditor communications',
      'workflow': 'Task management, deadlines, and escalation tracking',
      'documents': 'Secure document vault with version control',
      'audit-trail': 'Immutable audit log of all system actions',
      'admin': 'User management, permissions, and system configuration'
    };
    return descriptions[currentPage] || '';
  };

  const getMatterStatusBadge = (status: MatterStatus) => {
    const config = {
      active: { label: 'Active', className: 'bg-blue-500/15 text-blue-300', icon: Activity },
      trading: { label: 'Trading', className: 'bg-green-500/15 text-green-300', icon: TrendingUp },
      restructuring: { label: 'Restructuring', className: 'bg-purple-500/15 text-purple-300', icon: Target },
      closed: { label: 'Closed', className: 'bg-white/5 text-slate-100', icon: Archive },
      'awaiting-exit': { label: 'Awaiting Exit', className: 'bg-orange-500/15 text-orange-300', icon: AlertCircle }
    };

    const statusConfig = config[status];
    const Icon = statusConfig.icon;

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
        <Icon className="w-3.5 h-3.5" />
        {statusConfig.label}
      </div>
    );
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
                {mobileMenuOpen ? <X className="w-6 h-6 text-slate-300" /> : <Menu className="w-6 h-6 text-slate-300" />}
              </button>
              
              <div className="flex items-center gap-3">
                <img src={logo} alt="Receivership OS" className="h-8" />
                <div>
                  <h1 className="text-lg font-semibold text-slate-100">Receivership OS</h1>
                  <p className="text-xs text-slate-400">MIP & Restructuring Platform</p>
                </div>
              </div>
            </div>

            {/* Center - Matter Selector */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                <Briefcase className="w-4 h-4 text-red-400" />
                <select 
                  value={selectedMatter}
                  onChange={(e) => setSelectedMatter(e.target.value)}
                  className="bg-transparent text-sm font-medium text-red-300 border-none focus:outline-none"
                >
                  {mockMatters.map(m => (
                    <option key={m.id} value={m.id}>{m.id} - {m.entityName}</option>
                  ))}
                </select>
              </div>
              {getMatterStatusBadge(selectedMatterData.status as MatterStatus)}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <Button variant="ghost" size="sm">
                <Search className="w-5 h-5" />
              </Button>

              {/* Role Switcher */}
              <select
                value={userRole}
                onChange={(e) => {
                  setUserRole(e.target.value as ReceivershipRole);
                  setCurrentPage('dashboard');
                }}
                className="px-3 py-2 border border-red-300 rounded-lg text-xs font-medium text-red-300 bg-red-500/10 hover:bg-red-500/15 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="system-owner">System Owner</option>
                <option value="appointed-receiver">Appointed Receiver</option>
                <option value="case-manager">Case Manager</option>
                <option value="trust-accountant">Trust Accountant</option>
                <option value="restructuring-advisor">Restructuring Advisor</option>
                <option value="external-lawyer">External Lawyer</option>
                <option value="secured-creditor-portal">Secured Creditor Portal</option>
                <option value="general-creditor-portal">General Creditor Portal</option>
              </select>

              {/* Module Switcher */}
              {onSwitchModule && (
                <select
                  onChange={(e) => onSwitchModule(e.target.value)}
                  className="px-3 py-2 border border-white/10 rounded-lg text-sm font-medium text-slate-300 bg-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-red-500"
                  defaultValue="receivership"
                >
                  <option value="Grow MIP">Switch to Grow MIP</option>
                  <option value="grow_accounting">Switch to Grow Accounting</option>
                  <option value="pfa">Switch to PFA</option>
                  <option value="imfo">Switch to IMFO</option>
                  <option value="receivership">Receivership OS</option>
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
                  <p className="text-xs text-slate-400">{mockUser.email}</p>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-red-600 text-white">
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
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id as ReceivershipPage);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
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

// Receivership Dashboard Component
function ReceivershipDashboard({ matter, role, onNavigate }: any) {
  const riskColor = matter.riskScore >= 70 ? 'green' : matter.riskScore >= 40 ? 'orange' : 'red';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">{matter.entityName}</h1>
        <p className="text-slate-300 mt-1">
          {matter.id} â€¢ {matter.appointmentType} â€¢ Day {matter.daysActive} of appointment
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <p className="text-sm text-slate-300">Cash at Bank</p>
          </div>
          <p className="text-2xl font-bold text-slate-100">${(matter.cashAtBank / 1000).toFixed(0)}K</p>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-slate-300">Assets Under Control</p>
          </div>
          <p className="text-2xl font-bold text-slate-100">${(matter.assetsUnderControl / 1000).toFixed(0)}K</p>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-orange-400" />
            <p className="text-sm text-slate-300">Secured Debt</p>
          </div>
          <p className="text-2xl font-bold text-slate-100">${(matter.securedDebt / 1000).toFixed(0)}K</p>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-red-400" />
            <p className="text-sm text-slate-300">Risk Score</p>
          </div>
          <p className={`text-2xl font-bold ${
            riskColor === 'green' ? 'text-green-400' :
            riskColor === 'orange' ? 'text-orange-400' :
            'text-red-400'
          }`}>{matter.riskScore}/100</p>
        </div>
      </div>

      {/* Risk Alerts */}
      <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-300 mb-2">Active Risk Alerts (3)</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-red-300">
                <AlertCircle className="w-4 h-4" />
                <span>Statutory deadline in 5 days - Section 439A report due</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-red-300">
                <AlertCircle className="w-4 h-4" />
                <span>Asset A-002 uninsured - $2.5M property at risk</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-red-300">
                <AlertCircle className="w-4 h-4" />
                <span>Negative cashflow forecast in Week 9</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Button 
          className="h-24 flex-col bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => onNavigate('restructuring')}
        >
          <Target className="w-8 h-8 mb-2" />
          <span className="font-semibold">Restructuring Engine</span>
        </Button>
        
        <Button 
          className="h-24 flex-col bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => onNavigate('assets')}
        >
          <Package className="w-8 h-8 mb-2" />
          <span className="font-semibold">Asset Register</span>
        </Button>

        <Button 
          className="h-24 flex-col bg-green-600 hover:bg-green-700 text-white"
          onClick={() => onNavigate('trust-accounting')}
        >
          <DollarSign className="w-8 h-8 mb-2" />
          <span className="font-semibold">Trust Accounting</span>
        </Button>
      </div>

      {/* Statutory Deadlines */}
      <div className="bg-white border border-white/10 rounded-lg p-6">
        <h3 className="font-semibold text-slate-100 mb-4">Upcoming Statutory Deadlines</h3>
        <div className="space-y-3">
          {[
            { task: 'Section 439A Report', due: '2024-03-01', status: 'urgent', days: 5 },
            { task: 'First Creditors Meeting', due: '2024-03-08', status: 'upcoming', days: 12 },
            { task: 'Asset Realisation Report', due: '2024-03-15', status: 'upcoming', days: 19 }
          ].map((deadline, idx) => (
            <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${
              deadline.status === 'urgent' ? 'bg-red-500/10 border border-red-500/30' : 'bg-white/5'
            }`}>
              <div className="flex items-center gap-3">
                <Calendar className={`w-5 h-5 ${
                  deadline.status === 'urgent' ? 'text-red-400' : 'text-slate-300'
                }`} />
                <div>
                  <p className="font-medium text-slate-100">{deadline.task}</p>
                  <p className="text-sm text-slate-300">Due {deadline.due}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  deadline.status === 'urgent' ? 'text-red-400' : 'text-slate-100'
                }`}>{deadline.days} days</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Placeholder Page Component
function PlaceholderPage({ title, description }: any) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-white/10 p-8 text-center">
        <Gavel className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-100 mb-2">{title}</h2>
        <p className="text-slate-300 mb-6">{description}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/15 text-red-300 rounded-lg text-sm font-medium">
          <Activity className="w-4 h-4" />
          Module under construction
        </div>
      </div>
    </div>
  );
}

// Additional component imports will go here
import { RestructuringModule, AssetRegister, TrustAccounting, StakeholdersClaims } from './RestructuringModule';


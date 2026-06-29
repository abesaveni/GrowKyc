import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  TradingView,
  WorkflowView,
  DocumentsView,
  AuditTrailView
} from './ReceivershipOS_NewViews';
import { CreditorManagementView } from '../receivership/views/CreditorManagementView';
import { AssetsHub } from '../receivership/views/AssetsHub';
import { ReceivershipReportsHub } from '../receivership/views/ReceivershipReportsHub';
import {
  Home,
  Briefcase,
  Building2,
  DollarSign,
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Users,
  Lock,
  Unlock,
  Settings,
  Bell,
  Search,
  Download,
  Upload,
  Eye,
  Edit,
  Calendar,
  BarChart3,
  Activity,
  Target,
  Zap,
  Package,
  MapPin,
  Percent,
  ArrowUpDown,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  Trash2,
  Info,
  AlertCircle,
  Calculator,
  RefreshCw,
  FileCheck,
  Gavel,
  Scale,
  Landmark,
  Wallet,
  CreditCard,
  Receipt,
  PieChart,
  LineChart,
  LayoutDashboard,
  FolderOpen,
  History,
  UserCheck,
  UserX,
  Filter
} from 'lucide-react';

interface ReceivershipOSProps {
  onNavigate?: (page: string) => void;
  onSwitchModule?: (module: string) => void;
  role?: ReceivershipRole;
}

type ReceivershipRole = 
  | 'system-owner'
  | 'receiver'
  | 'case-manager'
  | 'trust-accountant'
  | 'restructuring-advisor'
  | 'external-lawyer'
  | 'secured-creditor'
  | 'general-creditor';

type ViewMode = 
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
  | 'audit-trail';

export function ReceivershipOS({ onNavigate, onSwitchModule, role = 'receiver' }: ReceivershipOSProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedMatter, setSelectedMatter] = useState<any>(null);
  const [userRole, setUserRole] = useState<ReceivershipRole>(role);

  // Mock user data
  const mockUser = {
    name: 'Michael Thompson',
    email: 'michael.thompson@receivership.com.au',
    role: userRole,
    firm: 'Thompson Advisory'
  };

  // Navigation based on role
  const getNavigationItems = () => {
    const allItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['all'] },
      { id: 'matters', label: 'Matters', icon: Briefcase, roles: ['all'] },
      { id: 'assets', label: 'Assets', icon: Package, roles: ['system-owner', 'receiver', 'case-manager', 'restructuring-advisor'] },
      { id: 'security-debt', label: 'Security & Debt', icon: Shield, roles: ['system-owner', 'receiver', 'case-manager', 'trust-accountant', 'restructuring-advisor'] },
      { id: 'trading', label: 'Trading', icon: TrendingUp, roles: ['system-owner', 'receiver', 'case-manager', 'restructuring-advisor'] },
      { id: 'trust-accounting', label: 'Trust Accounting', icon: Wallet, roles: ['system-owner', 'receiver', 'trust-accountant'] },
      { id: 'stakeholders', label: 'Stakeholders', icon: Users, roles: ['system-owner', 'receiver', 'case-manager'] },
      { id: 'restructuring', label: 'Restructuring', icon: Calculator, roles: ['system-owner', 'receiver', 'restructuring-advisor'] },
      { id: 'reports', label: 'Reports', icon: FileText, roles: ['all'] },
      { id: 'workflow', label: 'Workflow', icon: Activity, roles: ['system-owner', 'receiver', 'case-manager'] },
      { id: 'documents', label: 'Documents', icon: FolderOpen, roles: ['all'] },
      { id: 'audit-trail', label: 'Audit Trail', icon: History, roles: ['system-owner', 'receiver'] }
    ];

    return allItems.filter(item => 
      item.roles.includes('all') || item.roles.includes(userRole)
    );
  };

  const navigationItems = getNavigationItems();

  const renderContent = () => {
    if (selectedMatter && viewMode === 'matters') {
      return <MatterDetail matter={selectedMatter} onBack={() => setSelectedMatter(null)} role={userRole} />;
    }

    switch (viewMode) {
      case 'dashboard':
        return <ReceivershipDashboard onNavigate={setViewMode} role={userRole} />;
      case 'matters':
        return <MattersView onSelectMatter={setSelectedMatter} role={userRole} />;
      case 'assets':
        return <AssetsHub matterId="MAT-2024-008" />;
      case 'security-debt':
        return <SecurityDebtView role={userRole} />;
      case 'trading':
        return <TradingView role={userRole} />;
      case 'trust-accounting':
        return <TrustAccountingView role={userRole} />;
      case 'stakeholders':
        return <CreditorManagementView />;
      case 'restructuring':
        return <RestructuringView role={userRole} />;
      case 'reports':
        return <ReceivershipReportsHub />;
      case 'workflow':
        return <WorkflowView role={userRole} />;
      case 'documents':
        return <DocumentsView role={userRole} />;
      case 'audit-trail':
        return <AuditTrailView role={userRole} />;
      default:
        return <ReceivershipDashboard onNavigate={setViewMode} role={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-300 fixed w-full top-0 z-50">
        <div className="px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Receivership OS</h1>
                  <p className="text-xs text-gray-500">MIP & Restructuring Platform</p>
                </div>
              </div>
            </div>

            {/* Search and Matter Selector */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search matters..."
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500">
                <option>Acme Trading Pty Ltd</option>
                <option>Brisbane Retail Co</option>
                <option>Coastal Developments</option>
              </select>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Role Switcher */}
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as ReceivershipRole)}
                className="px-3 py-2 border border-red-300 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="system-owner">System Owner</option>
                <option value="receiver">Receiver</option>
                <option value="case-manager">Case Manager</option>
                <option value="trust-accountant">Trust Accountant</option>
                <option value="restructuring-advisor">Restructuring Advisor</option>
                <option value="external-lawyer">External Lawyer</option>
                <option value="secured-creditor">Secured Creditor</option>
                <option value="general-creditor">General Creditor</option>
              </select>

              {/* Module Switcher */}
              {onSwitchModule && (
                <select
                  onChange={(e) => onSwitchModule(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  defaultValue="receivership"
                >
                  <option value="Grow MIP">Switch to Grow MIP</option>
                  <option value="grow_accounting">Switch to Grow Accounting</option>
                  <option value="pfa">Switch to PFA</option>
                  <option value="imfo">Switch to IMFO</option>
                  <option value="receivership">Receivership OS</option>
                  <option value="onecore">Switch to OneCore CRM</option>
                  <option value="grow_hq">Switch to Grow HQ</option>
                </select>
              )}

              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              <div className="flex items-center gap-3 pl-3 border-l border-gray-300">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
                  <p className="text-xs text-gray-500">{mockUser.firm}</p>
                </div>
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900 text-white overflow-y-auto">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = viewMode === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setViewMode(item.id as ViewMode)}
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
            <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 min-h-[calc(100vh-4rem)]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Dashboard Component
function ReceivershipDashboard({ onNavigate, role }: any) {
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  
  const handleNewAppointment = () => {
    setShowNewAppointmentModal(true);
  };

  const handleActionClick = (matter: string, action: string) => {
    alert(`Taking action: ${action} for ${matter}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receivership Dashboard</h1>
          <p className="text-gray-600 mt-1">Control distressed entities, enforce security, and manage restructuring</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleNewAppointment}>
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('matters')}>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-red-600" />
            <p className="text-sm text-gray-600">Active Matters</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500 mt-1">3 trading, 9 non-trading</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('assets')}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Total Assets</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">$45.2M</p>
          <p className="text-xs text-gray-500 mt-1">Across all matters</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('trust-accounting')}>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Trust Balance</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">$8.7M</p>
          <p className="text-xs text-gray-500 mt-1">Across 12 accounts</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('workflow')}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-gray-600">Pending Actions</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">24</p>
          <p className="text-xs text-gray-500 mt-1">8 urgent</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('restructuring')}>
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Restructuring</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">4</p>
          <p className="text-xs text-gray-500 mt-1">Active proposals</p>
        </div>
      </div>

      {/* Urgent Actions */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-orange-900">Urgent Actions Required</h3>
        </div>
        <div className="space-y-3">
          {[
            { matter: 'Acme Trading Pty Ltd', action: 'ASIC report due', due: '2 days', priority: 'high' },
            { matter: 'Brisbane Retail Co', action: 'Asset sale settlement', due: 'Tomorrow', priority: 'high' },
            { matter: 'Coastal Developments', action: 'Trust reconciliation', due: '3 days', priority: 'medium' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{item.matter}</p>
                <p className="text-sm text-gray-600">{item.action}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  Due {item.due}
                </span>
                <Button size="sm" onClick={() => handleActionClick(item.matter, item.action)}>Action</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Matters Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { time: '10 mins ago', user: 'Sarah Chen', action: 'Approved asset sale', matter: 'Acme Trading' },
              { time: '45 mins ago', user: 'Michael Thompson', action: 'Uploaded creditor report', matter: 'Brisbane Retail' },
              { time: '2 hours ago', user: 'Trust System', action: 'Reconciled bank account', matter: 'Coastal Dev' },
              { time: '4 hours ago', user: 'John Davis', action: 'Updated restructure proposal', matter: 'Metro Holdings' }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                <Clock className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900"><span className="font-medium">{activity.user}</span> {activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.matter} â€¢ {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Risk Alerts</h3>
          <div className="space-y-3">
            {[
              { severity: 'high', alert: 'Negative cashflow forecast', matter: 'Acme Trading', impact: 'Trading may cease' },
              { severity: 'medium', alert: 'Uninsured asset', matter: 'Brisbane Retail', impact: 'Property exposure $2.1M' },
              { severity: 'high', alert: 'Security ranking dispute', matter: 'Coastal Dev', impact: 'Waterfall affected' }
            ].map((alert, idx) => (
              <div key={idx} className={`p-3 rounded-lg border ${
                alert.severity === 'high' 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                    alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      alert.severity === 'high' ? 'text-red-900' : 'text-yellow-900'
                    }`}>{alert.alert}</p>
                    <p className="text-xs text-gray-600 mt-1">{alert.matter}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      {showNewAppointmentModal && (
        <NewAppointmentModal
          onClose={() => setShowNewAppointmentModal(false)}
          onSave={(data) => {
            setShowNewAppointmentModal(false);
            alert(`Appointment for "${data.companyName}" created successfully!`);
          }}
        />
      )}
    </div>
  );
}

// Matters View
function MattersView({ onSelectMatter, role }: any) {
  const [showNewMatterModal, setShowNewMatterModal] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const handleNewMatter = () => {
    setShowNewMatterModal(true);
  };

  const handleFilter = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  const mockMatters = [
    {
      id: 'MAT-2024-001',
      name: 'Acme Trading Pty Ltd',
      type: 'Receivership',
      appointmentDate: '2024-01-15',
      daysActive: 45,
      status: 'trading',
      cashAtBank: 450000,
      totalAssets: 12500000,
      secured: 8000000,
      unsecured: 2500000,
      nextDeadline: 'ASIC Report - 2 days',
      exitProbability: 65
    },
    {
      id: 'MAT-2024-002',
      name: 'Brisbane Retail Co',
      type: 'Voluntary Administration',
      appointmentDate: '2024-02-01',
      daysActive: 28,
      status: 'non-trading',
      cashAtBank: 185000,
      totalAssets: 5200000,
      secured: 3800000,
      unsecured: 900000,
      nextDeadline: 'Asset sale settlement - Tomorrow',
      exitProbability: 40
    },
    {
      id: 'MAT-2024-003',
      name: 'Coastal Developments Ltd',
      type: 'Receivership',
      appointmentDate: '2024-01-08',
      daysActive: 52,
      status: 'restructuring',
      cashAtBank: 2100000,
      totalAssets: 28000000,
      secured: 18000000,
      unsecured: 4200000,
      nextDeadline: 'Creditor meeting - 5 days',
      exitProbability: 75
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Matters</h1>
          <p className="text-gray-600 mt-1">Manage all appointments and receiverships</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleFilter}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleNewMatter}>
            <Plus className="w-4 h-4 mr-2" />
            New Matter
          </Button>
        </div>
      </div>

      {/* Matters Grid */}
      <div className="space-y-4">
        {mockMatters.map((matter) => (
          <div
            key={matter.id}
            className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onSelectMatter(matter)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{matter.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    matter.status === 'trading' ? 'bg-green-100 text-green-800' :
                    matter.status === 'restructuring' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {matter.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{matter.id} â€¢ {matter.type} â€¢ {matter.daysActive} days active</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Exit Probability</p>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full ${
                        matter.exitProbability >= 60 ? 'bg-green-600' :
                        matter.exitProbability >= 40 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${matter.exitProbability}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{matter.exitProbability}%</span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Cash at Bank</p>
                <p className="text-lg font-bold text-blue-900">${(matter.cashAtBank / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-600 mb-1">Total Assets</p>
                <p className="text-lg font-bold text-green-900">${(matter.totalAssets / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-xs text-orange-600 mb-1">Secured Debt</p>
                <p className="text-lg font-bold text-orange-900">${(matter.secured / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-600 mb-1">Unsecured</p>
                <p className="text-lg font-bold text-purple-900">${(matter.unsecured / 1000000).toFixed(1)}M</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{matter.nextDeadline}</span>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Matter
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* New Matter Modal */}
      {showNewMatterModal && (
        <NewMatterModal
          onClose={() => setShowNewMatterModal(false)}
          onSave={(data) => {
            setShowNewMatterModal(false);
            alert(`Matter "${data.matterName}" created successfully!`);
          }}
        />
      )}

      {/* Filter Menu */}
      {showFilterMenu && (
        <div className="absolute top-20 right-6 bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-50">
          <h4 className="font-semibold text-gray-900 mb-3">Filter Matters</h4>
          <div className="space-y-2">
            {['All', 'Trading', 'Non-Trading', 'Restructuring'].map((filter) => (
              <label key={filter} className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-700">{filter}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Matter Detail Component
function MatterDetail({ matter, onBack, role }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'security' | 'trust' | 'restructure'>('overview');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ChevronRight className="w-5 h-5 rotate-180" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{matter.name}</h1>
            <p className="text-gray-600">{matter.id} â€¢ {matter.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Edit className="w-4 h-4 mr-2" />
            Edit Matter
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="grid grid-cols-6 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Days Active</p>
            <p className="text-2xl font-bold text-gray-900">{matter.daysActive}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              matter.status === 'trading' ? 'bg-green-100 text-green-800' :
              matter.status === 'restructuring' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {matter.status}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Cash at Bank</p>
            <p className="text-xl font-bold text-gray-900">${(matter.cashAtBank / 1000).toFixed(0)}K</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Total Assets</p>
            <p className="text-xl font-bold text-gray-900">${(matter.totalAssets / 1000000).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Exit Probability</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-green-600 rounded-full" style={{ width: `${matter.exitProbability}%` }} />
              </div>
              <span className="text-sm font-semibold">{matter.exitProbability}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Next Deadline</p>
            <p className="text-sm font-semibold text-orange-600">{matter.nextDeadline}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="border-b border-gray-300 flex">
          {[
            { id: 'overview', label: 'Overview', icon: Home },
            { id: 'assets', label: 'Assets', icon: Package },
            { id: 'security', label: 'Security & Debt', icon: Shield },
            { id: 'trust', label: 'Trust Account', icon: Wallet },
            { id: 'restructure', label: 'Restructuring', icon: Calculator }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-600 text-red-600 font-medium bg-red-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <MatterOverviewTab matter={matter} />}
          {activeTab === 'assets' && <MatterAssetsTab matter={matter} />}
          {activeTab === 'security' && <SecurityDebtTab matter={matter} />}
          {activeTab === 'trust' && <TrustAccountTab matter={matter} />}
          {activeTab === 'restructure' && <RestructuringTab matter={matter} />}
        </div>
      </div>
    </div>
  );
}

// Matter Overview Tab
function MatterOverviewTab({ matter }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Appointment Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Appointment Type</span>
              <span className="text-sm font-medium text-gray-900">{matter.type}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Appointment Date</span>
              <span className="text-sm font-medium text-gray-900">{matter.appointmentDate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Days Active</span>
              <span className="text-sm font-medium text-gray-900">{matter.daysActive} days</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Trading Status</span>
              <span className={`text-sm font-medium ${
                matter.status === 'trading' ? 'text-green-600' : 'text-gray-900'
              }`}>
                {matter.status === 'trading' ? 'Trading' : 'Non-trading'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Cash at Bank</span>
              <span className="text-sm font-medium text-gray-900">${(matter.cashAtBank / 1000).toFixed(0)}K</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Total Assets</span>
              <span className="text-sm font-medium text-gray-900">${(matter.totalAssets / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Secured Debt</span>
              <span className="text-sm font-medium text-gray-900">${(matter.secured / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Unsecured Claims</span>
              <span className="text-sm font-medium text-gray-900">${(matter.unsecured / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { date: '2024-02-28', user: 'Michael Thompson', action: 'Updated asset register', type: 'update' },
            { date: '2024-02-27', user: 'Sarah Chen', action: 'Approved payment batch', type: 'approval' },
            { date: '2024-02-25', user: 'System', action: 'Generated statutory report', type: 'system' }
          ].map((activity, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'approval' ? 'bg-green-100' :
                activity.type === 'system' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {activity.type === 'approval' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                 activity.type === 'system' ? <Zap className="w-4 h-4 text-blue-600" /> :
                 <Edit className="w-4 h-4 text-gray-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.user} â€¢ {activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Placeholder implementations for other tabs (to keep component focused)
function MatterAssetsTab({ matter }: any) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">Asset register for {matter.name}</p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">Full asset management system with valuations, insurance tracking, sale campaigns, and proceeds allocation.</p>
      </div>
    </div>
  );
}

function SecurityDebtTab({ matter }: any) {
  return <SecurityDebtView role="receiver" />;
}

function TrustAccountTab({ matter }: any) {
  return <TrustAccountingView role="receiver" />;
}

function RestructuringTab({ matter }: any) {
  return <RestructuringView role="receiver" />;
}

// Assets View
function AssetsView({ role }: any) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Register</h1>
          <p className="text-gray-600 mt-1">Track all assets across matters with valuations and sale campaigns</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Register
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Asset Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: '$45.2M', icon: Package, color: 'blue' },
          { label: 'For Sale', value: '24 items', icon: TrendingUp, color: 'green' },
          { label: 'Sold', value: '$12.8M', icon: CheckCircle, color: 'green' },
          { label: 'Under Valuation', value: '8 items', icon: Clock, color: 'orange' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-gray-300 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Assets Table */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-300 bg-gray-50 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Asset Inventory</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search assets..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Asset</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Matter</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Valuation</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { name: 'Commercial Property - 123 Main St', matter: 'Acme Trading', type: 'Real Estate', valuation: '$8.5M', status: 'for-sale' },
              { name: 'Machinery & Equipment', matter: 'Brisbane Retail', type: 'Plant & Equipment', valuation: '$450K', status: 'sold' },
              { name: 'Inventory - Retail Stock', matter: 'Brisbane Retail', type: 'Inventory', valuation: '$280K', status: 'liquidating' },
              { name: 'Commercial Vehicles (5x)', matter: 'Acme Trading', type: 'Motor Vehicles', valuation: '$185K', status: 'for-sale' },
              { name: 'Intellectual Property', matter: 'Coastal Dev', type: 'Intangible', valuation: '$1.2M', status: 'under-valuation' }
            ].map((asset, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{asset.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{asset.matter}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">{asset.type}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900">{asset.valuation}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    asset.status === 'sold' ? 'bg-green-100 text-green-800' :
                    asset.status === 'for-sale' ? 'bg-blue-100 text-blue-800' :
                    asset.status === 'liquidating' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Security & Debt View with Waterfall
function SecurityDebtView({ role }: any) {
  const [calculating, setCalculating] = useState(false);

  const handleCalculateWaterfall = () => {
    setCalculating(true);
    setTimeout(() => {
      setCalculating(false);
      alert('Waterfall calculation complete! All distributions updated.');
    }, 1500);
  };

  const mockWaterfall = {
    saleProceeds: 12500000,
    receiverCosts: 350000,
    securedClaims: [
      { creditor: 'NAB', amount: 8000000, ranking: 'First', recovery: 8000000 },
      { creditor: 'Westpac', amount: 2500000, ranking: 'Second', recovery: 2500000 }
    ],
    priorityClaims: 850000,
    unsecuredClaims: 2500000,
    unsecuredRecovery: 800000,
    unsecuredRate: 32
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Security & Debt</h1>
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white" 
          onClick={handleCalculateWaterfall}
          disabled={calculating}
        >
          <Calculator className="w-4 h-4 mr-2" />
          {calculating ? 'Calculating...' : 'Calculate Waterfall'}
        </Button>
      </div>

      {/* Waterfall Visualization */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Distribution Waterfall</h3>
        
        {/* Visual Waterfall */}
        <div className="space-y-4">
          {/* Sale Proceeds */}
          <div className="relative">
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Sale Proceeds</p>
                  <p className="text-xs text-blue-700">Total realization</p>
                </div>
                <p className="text-2xl font-bold text-blue-900">${(mockWaterfall.saleProceeds / 1000000).toFixed(1)}M</p>
              </div>
            </div>
            <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-gray-300" />
          </div>

          {/* Receiver Costs */}
          <div className="relative pl-8">
            <div className="bg-purple-100 border border-purple-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900">Receiver Costs & Expenses</p>
                  <p className="text-xs text-purple-700">Professional fees, legal costs</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-900">${(mockWaterfall.receiverCosts / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-purple-700">{((mockWaterfall.receiverCosts / mockWaterfall.saleProceeds) * 100).toFixed(1)}% of proceeds</p>
                </div>
              </div>
            </div>
            <div className="absolute left-0 -bottom-4 w-0.5 h-4 bg-gray-300" style={{ left: '16px' }} />
          </div>

          {/* Secured Creditors */}
          <div className="relative pl-8">
            <div className="bg-green-100 border border-green-300 rounded-lg p-4">
              <div className="mb-3">
                <p className="text-sm font-medium text-green-900">Secured Creditors</p>
                <p className="text-xs text-green-700">First and second ranking security</p>
              </div>
              <div className="space-y-2">
                {mockWaterfall.securedClaims.map((claim, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{claim.creditor}</p>
                      <p className="text-xs text-gray-600">{claim.ranking} Ranking</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-900">${(claim.recovery / 1000000).toFixed(1)}M</p>
                      <p className="text-xs text-green-700">100% recovery</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute left-0 -bottom-4 w-0.5 h-4 bg-gray-300" style={{ left: '16px' }} />
          </div>

          {/* Priority Claims */}
          <div className="relative pl-8">
            <div className="bg-orange-100 border border-orange-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-900">Priority Claims</p>
                  <p className="text-xs text-orange-700">Employee entitlements, taxes</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-900">${(mockWaterfall.priorityClaims / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-orange-700">100% recovery</p>
                </div>
              </div>
            </div>
            <div className="absolute left-0 -bottom-4 w-0.5 h-4 bg-gray-300" style={{ left: '16px' }} />
          </div>

          {/* Unsecured Creditors */}
          <div className="relative pl-8">
            <div className="bg-red-100 border border-red-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-900">Unsecured Creditors</p>
                  <p className="text-xs text-red-700">General unsecured claims</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-red-900">${(mockWaterfall.unsecuredRecovery / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-red-700">{mockWaterfall.unsecuredRate}% recovery (${(mockWaterfall.unsecuredClaims / 1000).toFixed(0)}K claimed)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Distributed</p>
              <p className="text-xl font-bold text-gray-900">
                ${((mockWaterfall.receiverCosts + mockWaterfall.securedClaims.reduce((sum, c) => sum + c.recovery, 0) + mockWaterfall.priorityClaims + mockWaterfall.unsecuredRecovery) / 1000000).toFixed(1)}M
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Secured Recovery</p>
              <p className="text-xl font-bold text-green-600">100%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Unsecured Recovery</p>
              <p className="text-xl font-bold text-red-600">{mockWaterfall.unsecuredRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Trust Accounting View
function TrustAccountingView({ role }: any) {
  const [reconciling, setReconciling] = useState(false);
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);

  const handleReconcile = () => {
    setReconciling(true);
    setTimeout(() => {
      setReconciling(false);
      alert('Trust account reconciliation complete!');
    }, 2000);
  };

  const handleNewPayment = () => {
    setShowNewPaymentModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Trust Accounting</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleReconcile} disabled={reconciling}>
            <RefreshCw className={`w-4 h-4 mr-2 ${reconciling ? 'animate-spin' : ''}`} />
            {reconciling ? 'Reconciling...' : 'Reconcile'}
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleNewPayment}>
            <Receipt className="w-4 h-4 mr-2" />
            New Payment
          </Button>
        </div>
      </div>

      {/* Account Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Trust Balance</p>
          <p className="text-2xl font-bold text-gray-900">$8.7M</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
          <p className="text-2xl font-bold text-orange-600">$245K</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Receipts (MTD)</p>
          <p className="text-2xl font-bold text-green-600">$1.2M</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Payments (MTD)</p>
          <p className="text-2xl font-bold text-red-600">$890K</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-300 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { date: '2024-02-28', type: 'Receipt', desc: 'Asset sale proceeds - Property 123', amount: 450000, status: 'cleared' },
                { date: '2024-02-27', type: 'Payment', desc: 'Professional fees - Legal', amount: -25000, status: 'cleared' },
                { date: '2024-02-27', type: 'Receipt', desc: 'Trading receipts', amount: 18500, status: 'cleared' },
                { date: '2024-02-26', type: 'Payment', desc: 'Employee entitlements', amount: -85000, status: 'pending' }
              ].map((txn, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{txn.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      txn.type === 'Receipt' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{txn.desc}</td>
                  <td className={`px-4 py-3 text-sm font-semibold ${
                    txn.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(txn.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      txn.status === 'cleared' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Restructuring View with Debt Builder
function RestructuringView({ role }: any) {
  const [activeScenario, setActiveScenario] = useState<'liquidate' | 'standstill' | 'partial-sale' | 'refinance'>('standstill');
  const [generating, setGenerating] = useState(false);

  const handleGenerateProposal = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert('Restructuring proposal generated! Ready for creditor review.');
    }, 2000);
  };

  const scenarios = {
    liquidate: {
      label: 'Scenario A: Liquidate',
      securedRecovery: 85,
      unsecuredRecovery: 12,
      timeline: '3-6 months',
      totalRecovery: 9200000,
      viability: 'low'
    },
    standstill: {
      label: 'Scenario B: Standstill + Trading',
      securedRecovery: 100,
      unsecuredRecovery: 45,
      timeline: '12-18 months',
      totalRecovery: 11800000,
      viability: 'medium'
    },
    'partial-sale': {
      label: 'Scenario C: Partial Asset Sale',
      securedRecovery: 100,
      unsecuredRecovery: 65,
      timeline: '9-12 months',
      totalRecovery: 12900000,
      viability: 'high'
    },
    refinance: {
      label: 'Scenario D: Full Refinance',
      securedRecovery: 100,
      unsecuredRecovery: 100,
      timeline: '6-9 months',
      totalRecovery: 13500000,
      viability: 'high'
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restructuring Module</h1>
          <p className="text-gray-600 mt-1">Debt restructure builder and scenario analysis</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleGenerateProposal}
          disabled={generating}
        >
          <FileText className="w-4 h-4 mr-2" />
          {generating ? 'Generating...' : 'Generate Proposal'}
        </Button>
      </div>

      {/* Trading Dashboard */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Trading P&L (MTD)</p>
          </div>
          <p className="text-2xl font-bold text-green-600">+$45K</p>
          <p className="text-xs text-gray-500 mt-1">Revenue $185K, Costs $140K</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Burn Rate</p>
          </div>
          <p className="text-2xl font-bold text-blue-900">$85K/wk</p>
          <p className="text-xs text-gray-500 mt-1">13-week runway</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Break-even</p>
          </div>
          <p className="text-2xl font-bold text-purple-900">8 weeks</p>
          <p className="text-xs text-gray-500 mt-1">With restructure</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-gray-600">Viability Score</p>
          </div>
          <p className="text-2xl font-bold text-orange-900">72%</p>
          <p className="text-xs text-gray-500 mt-1">High probability</p>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Restructuring Scenarios</h3>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {(Object.keys(scenarios) as Array<keyof typeof scenarios>).map((key) => {
            const scenario = scenarios[key];
            return (
              <button
                key={key}
                onClick={() => setActiveScenario(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  activeScenario === key
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                <p className="font-semibold text-gray-900 mb-2">{scenario.label}</p>
                <div className="space-y-1 text-left">
                  <p className="text-xs text-gray-600">Secured: {scenario.securedRecovery}%</p>
                  <p className="text-xs text-gray-600">Unsecured: {scenario.unsecuredRecovery}%</p>
                  <p className="text-xs text-gray-600">Timeline: {scenario.timeline}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Scenario Details */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h4 className="font-semibold text-purple-900 mb-4">{scenarios[activeScenario].label}</h4>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-purple-700 mb-1">Total Recovery</p>
              <p className="text-xl font-bold text-purple-900">${(scenarios[activeScenario].totalRecovery / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-xs text-purple-700 mb-1">Secured Recovery</p>
              <p className="text-xl font-bold text-purple-900">{scenarios[activeScenario].securedRecovery}%</p>
            </div>
            <div>
              <p className="text-xs text-purple-700 mb-1">Unsecured Recovery</p>
              <p className="text-xl font-bold text-purple-900">{scenarios[activeScenario].unsecuredRecovery}%</p>
            </div>
            <div>
              <p className="text-xs text-purple-700 mb-1">Timeline</p>
              <p className="text-lg font-semibold text-purple-900">{scenarios[activeScenario].timeline}</p>
            </div>
          </div>

          {/* Viability Indicator */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-purple-900">Viability:</span>
            <div className="flex-1 h-2 bg-purple-200 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  scenarios[activeScenario].viability === 'high' ? 'bg-green-600' :
                  scenarios[activeScenario].viability === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: scenarios[activeScenario].viability === 'high' ? '80%' : scenarios[activeScenario].viability === 'medium' ? '50%' : '25%' }}
              />
            </div>
            <span className={`text-sm font-semibold capitalize ${
              scenarios[activeScenario].viability === 'high' ? 'text-green-600' :
              scenarios[activeScenario].viability === 'medium' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {scenarios[activeScenario].viability}
            </span>
          </div>
        </div>
      </div>

      {/* Debt Schedule */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Debt Restructure Terms</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Standstill Period</label>
              <input
                type="number"
                defaultValue={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">Months</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Haircut %</label>
              <input
                type="number"
                defaultValue={25}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">Percentage reduction</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Extension Term</label>
              <input
                type="number"
                defaultValue={24}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">Months</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equity Injection</label>
              <input
                type="number"
                defaultValue={2000000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">New capital</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Asset Disposals</label>
              <input
                type="number"
                defaultValue={3500000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">Planned sales</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Interest Rate</label>
              <input
                type="number"
                step="0.1"
                defaultValue={8.5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">% per annum</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            <Calculator className="w-4 h-4 mr-2" />
            Recalculate Scenario
          </Button>
        </div>
      </div>

      {/* Exit Planning */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Exit Planning</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { condition: 'Debt Reduction', target: '$8M', current: '$6.2M', progress: 78, status: 'on-track' },
            { condition: 'Liquidity Threshold', target: '$500K', current: '$450K', progress: 90, status: 'on-track' },
            { condition: 'Creditor Approval', target: '75%', current: '68%', progress: 91, status: 'pending' },
            { condition: 'Funding Secured', target: 'Yes', current: 'In progress', progress: 60, status: 'pending' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 border border-gray-300 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                {item.status === 'on-track' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Clock className="w-4 h-4 text-orange-600" />
                )}
                <p className="text-xs font-medium text-gray-700">{item.condition}</p>
              </div>
              <p className="text-sm text-gray-900 mb-1">Target: {item.target}</p>
              <p className="text-sm font-semibold text-gray-900 mb-2">Current: {item.current}</p>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full ${item.status === 'on-track' ? 'bg-green-600' : 'bg-orange-600'}`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Reports View
function ReportsView({ role }: any) {
  const handleGenerateReport = (reportName: string) => {
    alert(`Generating ${reportName}... This will download as PDF.`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>
      
      <div className="grid grid-cols-3 gap-4">
        {[
          { name: 'Secured Creditor Report', icon: Shield, color: 'green' },
          { name: 'Asset Realisation Report', icon: Package, color: 'blue' },
          { name: 'Trust Account Report', icon: Wallet, color: 'purple' },
          { name: 'Creditor Distribution', icon: Users, color: 'orange' },
          { name: 'Restructuring Proposal', icon: Calculator, color: 'indigo' },
          { name: 'Statutory Report (ASIC)', icon: FileText, color: 'red' }
        ].map((report, idx) => {
          const Icon = report.icon;
          return (
            <div key={idx} className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 bg-${report.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 text-${report.color}-600`} />
              </div>
              <p className="font-semibold text-gray-900 mb-2">{report.name}</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => handleGenerateReport(report.name)}
              >
                <Download className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// New Appointment Modal
function NewAppointmentModal({ onClose, onSave }: { onClose: () => void, onSave: (data: any) => void }) {
  const [companyName, setCompanyName] = useState('');
  const [appointmentType, setAppointmentType] = useState('Receivership');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointingParty, setAppointingParty] = useState('');
  const [secured, setSecured] = useState('');
  const [unsecured, setUnsecured] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      companyName,
      appointmentType,
      appointmentDate,
      appointingParty,
      secured: Number(secured),
      unsecured: Number(unsecured)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center">
              <Gavel className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">New Appointment</h2>
              <p className="text-sm text-gray-600">Create a new receivership or administration</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., Acme Trading Pty Ltd"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type *</label>
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Receivership">Receivership</option>
                <option value="Voluntary Administration">Voluntary Administration</option>
                <option value="Liquidation">Liquidation</option>
                <option value="Deed of Company Arrangement">DOCA</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date *</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Appointing Party</label>
            <input
              type="text"
              value={appointingParty}
              onChange={(e) => setAppointingParty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., ANZ Bank, Director"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secured Debt</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={secured}
                  onChange={(e) => setSecured(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unsecured Debt</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={unsecured}
                  onChange={(e) => setUnsecured(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Appointment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// New Matter Modal (Similar structure for adding new matter)
function NewMatterModal({ onClose, onSave }: { onClose: () => void, onSave: (data: any) => void }) {
  const [matterName, setMatterName] = useState('');
  const [matterType, setMatterType] = useState('Receivership');
  const [matterDate, setMatterDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ matterName, matterType, matterDate });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add New Matter</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Matter Name *</label>
            <input
              type="text"
              value={matterName}
              onChange={(e) => setMatterName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Matter Type *</label>
              <select
                value={matterType}
                onChange={(e) => setMatterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Receivership">Receivership</option>
                <option value="Voluntary Administration">Voluntary Administration</option>
                <option value="Liquidation">Liquidation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date *</label>
              <input
                type="date"
                value={matterDate}
                onChange={(e) => setMatterDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Matter
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


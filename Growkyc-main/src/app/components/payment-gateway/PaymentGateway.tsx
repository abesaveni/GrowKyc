import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  Building2,
  AlertCircle,
  Shield,
  TrendingUp,
  Settings,
  Code,
  HelpCircle,
  Menu,
  X,
  Search,
  Bell,
  Plus,
  LogOut,
  ChevronDown,
  DollarSign,
  Activity,
  BookOpen,
  Scale,
  Gauge,
  Receipt,
  Lock
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from '../../lib/toast';
import {
  renderPlatformDashboard,
  renderMerchantDashboard,
  renderLenderDashboard,
  renderCustomers,
  renderPayments,
  renderBilling,
  renderLoans,
  renderSettlements,
  renderReconciliation,
  renderLedger,
  renderRiskFraud,
  renderDisputes,
  renderCompliance,
  renderDeveloper,
  renderSettingsPage,
  renderReports
} from './pages';

interface PaymentGatewayProps {
  onSwitchModule: (module: string) => void;
}

type Page =
  | 'dashboard'
  | 'customers'
  | 'payments'
  | 'billing'
  | 'loans'
  | 'settlements'
  | 'reconciliation'
  | 'ledger'
  | 'risk-fraud'
  | 'disputes'
  | 'compliance'
  | 'reports'
  | 'developer'
  | 'settings'
  | 'support';

type Role =
  | 'platform-admin'
  | 'merchant-owner'
  | 'merchant-admin'
  | 'lender-admin'
  | 'loan-manager'
  | 'collections-officer'
  | 'customer-borrower';

export function PaymentGateway({ onSwitchModule }: PaymentGatewayProps) {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [userRole, setUserRole] = useState<Role>('platform-admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState('All Merchants');

  const tenants = [
    'All Merchants',
    'Merchant A - Retail Co',
    'Merchant B - Tech Solutions',
    'Lender X - Finance Group',
    'Merchant C - Services Ltd'
  ];

  const roleMenuMap: Record<Role, Page[]> = {
    'platform-admin': [
      'dashboard',
      'customers',
      'payments',
      'billing',
      'loans',
      'settlements',
      'reconciliation',
      'ledger',
      'risk-fraud',
      'disputes',
      'compliance',
      'reports',
      'developer',
      'settings'
    ],
    'merchant-owner': [
      'dashboard',
      'customers',
      'payments',
      'billing',
      'settlements',
      'disputes',
      'reports',
      'developer',
      'settings'
    ],
    'merchant-admin': [
      'dashboard',
      'customers',
      'payments',
      'billing',
      'settlements',
      'disputes',
      'reports'
    ],
    'lender-admin': [
      'dashboard',
      'customers',
      'loans',
      'payments',
      'reconciliation',
      'reports',
      'settings'
    ],
    'loan-manager': ['dashboard', 'customers', 'loans', 'payments', 'reports'],
    'collections-officer': ['dashboard', 'customers', 'loans', 'payments'],
    'customer-borrower': ['dashboard']
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'loans', label: 'Loans', icon: DollarSign },
    { id: 'settlements', label: 'Settlements', icon: TrendingUp },
    { id: 'reconciliation', label: 'Reconciliation', icon: Scale },
    { id: 'ledger', label: 'Ledger', icon: BookOpen },
    { id: 'risk-fraud', label: 'Risk & Fraud', icon: Shield },
    { id: 'disputes', label: 'Disputes', icon: AlertCircle },
    { id: 'compliance', label: 'Compliance', icon: Lock },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'developer', label: 'Developer', icon: Code },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const filteredNavItems = navigationItems.filter((item) =>
    roleMenuMap[userRole].includes(item.id as Page)
  );

  const getRoleLabel = (role: Role) => {
    const labels: Record<Role, string> = {
      'platform-admin': 'ðŸ”§ Platform Admin',
      'merchant-owner': 'ðŸª Merchant Owner',
      'merchant-admin': 'ðŸ‘¤ Merchant Admin',
      'lender-admin': 'ðŸ¦ Lender Admin',
      'loan-manager': 'ðŸ’° Loan Manager',
      'collections-officer': 'ðŸ“ž Collections',
      'customer-borrower': 'ðŸ‘¤ Customer'
    };
    return labels[role];
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        if (userRole === 'platform-admin') {
          return renderPlatformDashboard();
        } else if (userRole.startsWith('merchant')) {
          return renderMerchantDashboard();
        } else if (userRole.startsWith('lender') || userRole.includes('loan') || userRole.includes('collections')) {
          return renderLenderDashboard();
        }
        return renderPlatformDashboard();
      case 'customers':
        return renderCustomers();
      case 'payments':
        return renderPayments();
      case 'billing':
        return renderBilling();
      case 'loans':
        return renderLoans();
      case 'settlements':
        return renderSettlements();
      case 'reconciliation':
        return renderReconciliation();
      case 'ledger':
        return renderLedger();
      case 'risk-fraud':
        return renderRiskFraud();
      case 'disputes':
        return renderDisputes();
      case 'compliance':
        return renderCompliance();
      case 'reports':
        return renderReports();
      case 'developer':
        return renderDeveloper();
      case 'settings':
        return renderSettingsPage();
      default:
        return renderPlatformDashboard();
    }
  };

  const getPageTitle = () => {
    const titles: Record<Page, string> = {
      dashboard: 'Dashboard',
      customers: 'Customers',
      payments: 'Payments',
      billing: 'Billing & Subscriptions',
      loans: 'Loans',
      settlements: 'Settlements',
      reconciliation: 'Reconciliation',
      ledger: 'Ledger',
      'risk-fraud': 'Risk & Fraud',
      disputes: 'Disputes',
      compliance: 'Compliance',
      reports: 'Reports',
      developer: 'Developer Tools',
      settings: 'Settings',
      support: 'Support'
    };
    return titles[currentPage] || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Tenant Switcher */}
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
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                  <Gauge className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">PaymentOS</h1>
                  <p className="text-xs text-gray-500">Unified Gateway</p>
                </div>
              </div>

              {/* Tenant Switcher */}
              {userRole === 'platform-admin' && (
                <div className="relative ml-4">
                  <select
                    value={selectedTenant}
                    onChange={(e) => {
                      setSelectedTenant(e.target.value);
                      toast.success(`Switched to ${e.target.value}`);
                    }}
                    className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    {tenants.map((tenant) => (
                      <option key={tenant} value={tenant}>
                        {tenant}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Global Search */}
            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search loans, customers, payments..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onFocus={() => toast.info('Global search active')}
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Create Button */}
              <div className="relative">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-1" />
                  Create
                </Button>
              </div>

              {/* Role Switcher */}
              <select
                value={userRole}
                onChange={(e) => {
                  setUserRole(e.target.value as Role);
                  setCurrentPage('dashboard');
                }}
                className="px-3 py-2 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="platform-admin">ðŸ”§ Platform Admin</option>
                <option value="merchant-owner">ðŸª Merchant Owner</option>
                <option value="merchant-admin">ðŸ‘¤ Merchant Admin</option>
                <option value="lender-admin">ðŸ¦ Lender Admin</option>
                <option value="loan-manager">ðŸ’° Loan Manager</option>
                <option value="collections-officer">ðŸ“ž Collections</option>
                <option value="customer-borrower">ðŸ‘¤ Customer</option>
              </select>

              {/* Module Switcher */}
              <select
                value="payment-gateway"
                onChange={(e) => onSwitchModule(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="payment-gateway">PaymentOS Gateway</option>
                <option value="nowwork">Switch to Now Work OS</option>
                <option value="Grow MIP">Switch to Grow MIP</option>
                <option value="grow_accounting">Switch to Grow Accounting</option>
                <option value="onecore">Switch to OneCore CRM</option>
              </select>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Alex Morgan</p>
                  <p className="text-xs text-gray-500">{getRoleLabel(userRole)}</p>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-blue-600 text-white">AM</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900 text-white transition-transform duration-200 z-40 overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="p-4 space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id as Page);
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
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
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
      <main className="lg:ml-64 mt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h2>
            <p className="text-gray-600 text-sm mt-1">
              {currentPage === 'dashboard' && 'Real-time overview of your payment operations'}
              {currentPage === 'customers' && 'Manage customers, payment methods, and mandates'}
              {currentPage === 'payments' && 'Track and manage all payment transactions'}
              {currentPage === 'billing' && 'Subscription plans, invoices, and recurring billing'}
              {currentPage === 'loans' && 'Loan pipeline, approvals, and repayment tracking'}
              {currentPage === 'settlements' && 'Settlement batches and payout reconciliation'}
              {currentPage === 'reconciliation' && 'Three-way reconciliation and exception management'}
              {currentPage === 'ledger' && 'General ledger, journal entries, and period close'}
              {currentPage === 'risk-fraud' && 'Fraud detection, rules engine, and risk management'}
              {currentPage === 'disputes' && 'Chargeback management and dispute resolution'}
              {currentPage === 'compliance' && 'KYC, AML, and regulatory compliance'}
              {currentPage === 'reports' && 'Analytics and reporting'}
              {currentPage === 'developer' && 'API keys, webhooks, and integrations'}
              {currentPage === 'settings' && 'System configuration and preferences'}
            </p>
          </div>

          {/* Page Content */}
          {renderPageContent()}
        </div>
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


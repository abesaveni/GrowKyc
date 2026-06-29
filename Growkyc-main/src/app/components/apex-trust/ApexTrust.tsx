import React, { useState } from 'react';
import {
  LayoutDashboard,
  Scale,
  Wallet,
  Building2,
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Lock,
  ChevronDown,
  Search,
  Bell,
  Shield,
  TrendingUp,
  DollarSign,
  Calendar,
  CreditCard,
  Settings,
  Download,
  Upload,
  Eye,
  UserCheck,
  X,
  Menu,
  Home,
  ArrowRight,
  Plus,
  AlertCircle,
  Check,
  Clock,
  Target,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../../lib/toast';
import { renderFundAdmin, renderBankRecon, renderPayments, renderCompliance } from './ApexTrustPages';
import { renderInvestors, renderReports, renderSettings } from './ApexTrustPages2';

type UserRole = 
  | 'system_admin'
  | 'finance_manager'
  | 'trust_operator'
  | 'fund_administrator'
  | 'payment_approver'
  | 'compliance_officer'
  | 'external_auditor'
  | 'investor_portal';

type NavigationItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
};

const navigation: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['system_admin', 'finance_manager', 'trust_operator', 'fund_administrator', 'payment_approver', 'compliance_officer'] },
  { id: 'trust-accounts', label: 'Trust Accounts', icon: Scale, roles: ['system_admin', 'finance_manager', 'trust_operator'] },
  { id: 'matters', label: 'Matters', icon: FileText, roles: ['system_admin', 'finance_manager', 'trust_operator'] },
  { id: 'fund-admin', label: 'Fund Administration', icon: Building2, roles: ['system_admin', 'finance_manager', 'fund_administrator'] },
  { id: 'bank-recon', label: 'Bank Reconciliation', icon: CreditCard, roles: ['system_admin', 'finance_manager', 'trust_operator'] },
  { id: 'payments', label: 'Payments', icon: Wallet, roles: ['system_admin', 'finance_manager', 'payment_approver'] },
  { id: 'investors', label: 'Investor Registry', icon: Users, roles: ['system_admin', 'fund_administrator'] },
  { id: 'compliance', label: 'Compliance', icon: Shield, roles: ['system_admin', 'finance_manager', 'compliance_officer'] },
  { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['system_admin', 'finance_manager', 'trust_operator', 'fund_administrator', 'compliance_officer', 'external_auditor'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['system_admin', 'finance_manager'] }
];

const entities = [
  { id: 'entity-1', name: 'Smith & Associates Legal Pty Ltd', abn: '12 345 678 901', type: 'Law Firm' },
  { id: 'entity-2', name: 'Melbourne Property Fund No. 1', abn: '23 456 789 012', type: 'Unit Trust' },
  { id: 'entity-3', name: 'Private Credit Fund LP', abn: '34 567 890 123', type: 'Limited Partnership' }
];

interface ApexTrustProps {
  onSwitchModule?: (module: string) => void;
}

export default function ApexTrust({ onSwitchModule }: ApexTrustProps = {}) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedEntity, setSelectedEntity] = useState(entities[0]);
  const [currentRole, setCurrentRole] = useState<UserRole>('finance_manager');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const visibleNavigation = navigation.filter(item => item.roles.includes(currentRole));

  const handleNavigation = (pageId: string) => {
    setCurrentPage(pageId);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Critical Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-blue-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Total Trust Cash</span>
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">$8,547,293</p>
            <p className="text-xs text-gray-500 mt-1">Across 4 bank accounts</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Total Trust Liabilities</span>
              <Scale className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">$8,547,293</p>
            <div className="flex items-center gap-1 mt-1">
              <Check className="w-3 h-3 text-green-600" />
              <p className="text-xs text-green-600">Balanced</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-red-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Overdrawn Matters</span>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">0</p>
            <p className="text-xs text-gray-500 mt-1">System blocked</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-600">Fund NAV</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">$15.2M</p>
            <p className="text-xs text-green-600 mt-1">+2.3% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Control Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Trust Reconciliation</p>
                <p className="text-sm text-gray-600">Last reconciled: 2 hours ago</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">3-way reconciliation</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">PASSED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Period lock status</span>
                <span className="text-gray-900 font-medium">Feb 2026 locked</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Pending Approvals</p>
                <p className="text-sm text-gray-600">Requires action</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment batches</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">3 pending</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Capital calls</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">2 pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Compliance Status</p>
                <p className="text-sm text-gray-600">All checks passed</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">AML checks</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">CURRENT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Breach alerts</span>
                <span className="text-gray-900 font-medium">0 active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fund Capital Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Fund Capital Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Committed Capital</p>
              <p className="text-2xl font-bold text-gray-900">$25.0M</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Called Capital</p>
              <p className="text-2xl font-bold text-blue-900">$15.2M</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Paid Capital</p>
              <p className="text-2xl font-bold text-green-900">$14.8M</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Uncalled Capital</p>
              <p className="text-2xl font-bold text-amber-900">$9.8M</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
              <p className="text-sm text-purple-700 mb-1">Call Rate</p>
              <p className="text-2xl font-bold text-purple-900">60.8%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Trust Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'Receipt', matter: 'MAT-2024-145', amount: 125000, desc: 'Deposit received - 45 Collins St', time: '2 hours ago' },
                { type: 'Payment', matter: 'MAT-2024-142', amount: -85000, desc: 'Settlement disbursement', time: '4 hours ago' },
                { type: 'Receipt', matter: 'MAT-2024-148', amount: 50000, desc: 'Trust receipt - Contract deposit', time: '1 day ago' }
              ].map((txn, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        txn.type === 'Receipt' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {txn.type}
                      </span>
                      <span className="text-sm font-mono font-semibold text-gray-900">{txn.matter}</span>
                    </div>
                    <p className="text-sm text-gray-900">{txn.desc}</p>
                    <p className="text-xs text-gray-500">{txn.time}</p>
                  </div>
                  <p className={`text-lg font-bold ${txn.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    ${Math.abs(txn.amount).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'info', message: 'Period lock scheduled for Feb 2026', time: 'Today', priority: 'low' },
                { type: 'warning', message: 'AML review due for 3 investors', time: 'Tomorrow', priority: 'medium' },
                { type: 'success', message: 'Trust reconciliation completed', time: '2 hours ago', priority: 'low' }
              ].map((alert, idx) => (
                <div key={idx} className={`flex items-start gap-3 p-3 border-l-4 rounded-lg ${
                  alert.type === 'warning' ? 'bg-amber-50 border-amber-500' :
                  alert.type === 'success' ? 'bg-green-50 border-green-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
                  </div>
                  {alert.priority === 'medium' && (
                    <Button size="sm" variant="outline">Review</Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTrustAccounts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Trust Accounts</h2>
        <Button onClick={() => toast.success('Add new trust account')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Trust Account Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'General Trust Account', bank: 'CBA', bsb: '063-000', account: '1234 5678', balance: 5420650, matters: 142 },
          { name: 'Controlled Money Account', bank: 'NAB', bsb: '082-001', account: '8765 4321', balance: 2856420, matters: 38 },
          { name: 'Transit Account', bank: 'Westpac', bsb: '032-002', account: '5555 6666', balance: 270223, matters: 12 }
        ].map((account, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => toast.info(`View ${account.name}`)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">RECONCILED</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{account.name}</h3>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>{account.bank}</p>
                <p className="font-mono">{account.bsb} {account.account}</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-1">Account Balance</p>
                <p className="text-2xl font-bold text-gray-900">${account.balance.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-2">{account.matters} active matters</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3-Way Reconciliation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>3-Way Reconciliation Status</CardTitle>
            <Button size="sm" onClick={() => toast.success('Running reconciliation...')}>
              <Activity className="w-4 h-4 mr-2" />
              Run Now
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
              <p className="text-sm font-semibold text-blue-900 mb-2">Bank Balance</p>
              <p className="text-3xl font-bold text-blue-900">$8,547,293</p>
              <p className="text-xs text-blue-700 mt-1">As per bank statement</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
              <p className="text-sm font-semibold text-green-900 mb-2">Trust GL Balance</p>
              <p className="text-3xl font-bold text-green-900">$8,547,293</p>
              <p className="text-xs text-green-700 mt-1">As per general ledger</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
              <p className="text-sm font-semibold text-purple-900 mb-2">Matter Liabilities</p>
              <p className="text-3xl font-bold text-purple-900">$8,547,293</p>
              <p className="text-xs text-purple-700 mt-1">Sum of all matter balances</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Reconciliation Passed</p>
              <p className="text-sm text-green-700">All three sources match. Trust account is balanced.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matter Balances */}
      <Card>
        <CardHeader>
          <CardTitle>Matter Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Matter</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Trust Balance</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { matter: 'MAT-2024-145', client: 'John & Sarah Smith', balance: 125000, status: 'active' },
                  { matter: 'MAT-2024-142', client: 'Property Investors Pty Ltd', balance: 450000, status: 'active' },
                  { matter: 'MAT-2024-138', client: 'Melbourne Holdings Ltd', balance: 850000, status: 'active' },
                  { matter: 'MAT-2024-125', client: 'Chen Family Trust', balance: 220000, status: 'active' }
                ].map((matter, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono font-semibold text-gray-900">{matter.matter}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{matter.client}</td>
                    <td className="px-4 py-3 text-sm font-bold text-right text-gray-900">${matter.balance.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                        {matter.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => toast.info(`View matter ${matter.matter}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMatters = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Matters</h2>
        <Button onClick={() => toast.success('Add new matter')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Matter
        </Button>
      </div>

      {/* Matter Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'MAT-2024-145', client: 'John & Sarah Smith', balance: 125000, status: 'active' },
          { name: 'MAT-2024-142', client: 'Property Investors Pty Ltd', balance: 450000, status: 'active' },
          { name: 'MAT-2024-138', client: 'Melbourne Holdings Ltd', balance: 850000, status: 'active' },
          { name: 'MAT-2024-125', client: 'Chen Family Trust', balance: 220000, status: 'active' }
        ].map((matter, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => toast.info(`View ${matter.name}`)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">RECONCILED</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{matter.name}</h3>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>{matter.client}</p>
                <p className="font-mono">Balance: ${matter.balance.toLocaleString()}</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="text-2xl font-bold text-gray-900">{matter.status.toUpperCase()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Matter Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Matter Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Transaction</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { transaction: 'MAT-2024-145-001', date: '2024-02-15', amount: 125000, desc: 'Deposit received - 45 Collins St' },
                  { transaction: 'MAT-2024-142-002', date: '2024-02-14', amount: -85000, desc: 'Settlement disbursement' },
                  { transaction: 'MAT-2024-148-003', date: '2024-02-13', amount: 50000, desc: 'Trust receipt - Contract deposit' }
                ].map((txn, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono font-semibold text-gray-900">{txn.transaction}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{txn.date}</td>
                    <td className="px-4 py-3 text-sm font-bold text-right text-gray-900">${Math.abs(txn.amount).toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                        {txn.amount > 0 ? 'Receipt' : 'Payment'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => toast.info(`View transaction ${txn.transaction}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboard();
      case 'trust-accounts':
        return renderTrustAccounts();
      case 'matters':
        return renderMatters();
      case 'fund-admin':
        return renderFundAdmin();
      case 'bank-recon':
        return renderBankRecon();
      case 'payments':
        return renderPayments();
      case 'investors':
        return renderInvestors();
      case 'compliance':
        return renderCompliance();
      case 'reports':
        return renderReports();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Grow Trust</h1>
              <p className="text-xs text-gray-400">Financial OS</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Entity Selector */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-400 mb-2">Current Entity</div>
          <button className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            <div className="text-left">
              <p className="text-sm font-medium text-white truncate">{selectedEntity.name}</p>
              <p className="text-xs text-gray-400">{selectedEntity.type}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              {/* Search */}
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search matters, transactions, investors..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Role Switcher */}
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="system_admin">System Admin</option>
                <option value="finance_manager">Finance Manager</option>
                <option value="trust_operator">Trust Operator</option>
                <option value="fund_administrator">Fund Administrator</option>
                <option value="payment_approver">Payment Approver</option>
                <option value="compliance_officer">Compliance Officer</option>
                <option value="external_auditor">External Auditor</option>
              </select>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">JD</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Module Switcher */}
              {onSwitchModule && (
                <Button variant="outline" size="sm" onClick={() => onSwitchModule('settlement-portal')}>
                  Switch Module
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
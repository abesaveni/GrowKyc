import React from 'react';
import {
  Shield,
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  Home,
  Scale,
  Building2,
  CreditCard,
  Calculator,
  Briefcase
} from 'lucide-react';
import { Industry } from './IndustrySelector';

interface IndustryDashboardProps {
  industry: Industry;
}

export function IndustryDashboard({ industry }: IndustryDashboardProps) {
  const getFinanceDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Building2 className="w-12 h-12" />
            <div>
              <h2 className="text-3xl font-bold">Financial Services Dashboard</h2>
              <p className="text-blue-100">AUSTRAC AML/CTF & Responsible Lending Compliance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Loan Applications', value: '156', icon: FileText, color: 'blue' },
          { label: 'Credit Assessments', value: '89', icon: TrendingUp, color: 'green' },
          { label: 'AML Alerts', value: '12', icon: AlertTriangle, color: 'red' },
          { label: 'Approved Loans', value: '$45.2M', icon: DollarSign, color: 'purple' }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-white/10 p-4">
              <Icon className={`w-8 h-8 text-${metric.color}-600 mb-2`} />
              <div className="text-2xl font-bold text-slate-100">{metric.value}</div>
              <div className="text-sm text-slate-300">{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Compliance Areas */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4 flex items-center">
            <Shield className="w-5 h-5 text-blue-400 mr-2" />
            AUSTRAC Compliance
          </h3>
          <div className="space-y-3">
            {[
              { task: 'Customer Due Diligence', status: '142/156', complete: true },
              { task: 'Enhanced CDD Required', status: '8 pending', complete: false },
              { task: 'Suspicious Matters', status: '2 under review', complete: false },
              { task: 'Threshold Transactions', status: 'Up to date', complete: true }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-300">{item.task}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${item.complete ? 'text-green-400' : 'text-orange-400'}`}>
                    {item.status}
                  </span>
                  {item.complete ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 text-purple-400 mr-2" />
            Responsible Lending
          </h3>
          <div className="space-y-3">
            {[
              { task: 'Credit Assessments Completed', status: '89/94', complete: true },
              { task: 'Affordability Checks', status: '5 pending', complete: false },
              { task: 'Hardship Applications', status: '3 active', complete: false },
              { task: 'Debt Collection Compliance', status: 'Compliant', complete: true }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-300">{item.task}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${item.complete ? 'text-green-400' : 'text-orange-400'}`}>
                    {item.status}
                  </span>
                  {item.complete ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg border border-white/10 p-6">
        <h3 className="font-bold text-slate-100 mb-4">Recent AML/CTF Alerts</h3>
        <div className="space-y-2">
          {[
            { client: 'Melbourne Property Trust', alert: 'High value transaction', severity: 'medium', time: '2 hours ago' },
            { client: 'Global Investments Ltd', alert: 'PEP status detected', severity: 'high', time: '5 hours ago' },
            { client: 'Sarah Mitchell', alert: 'Address change', severity: 'low', time: '1 day ago' }
          ].map((alert, index) => (
            <div key={index} className={`p-3 rounded-lg border ${
              alert.severity === 'high' ? 'bg-red-500/10 border-red-500/30' :
              alert.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
              'bg-blue-500/10 border-blue-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-100">{alert.client}</p>
                  <p className="text-sm text-slate-300">{alert.alert}</p>
                </div>
                <span className="text-xs text-slate-400">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getLegalDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Scale className="w-12 h-12" />
            <div>
              <h2 className="text-3xl font-bold">Legal Practice Dashboard</h2>
              <p className="text-purple-100">Trust Accounting & Client Verification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Matters', value: '234', icon: Briefcase, color: 'purple' },
          { label: 'Client Verifications', value: '45', icon: Users, color: 'blue' },
          { label: 'Trust Transactions', value: '127', icon: DollarSign, color: 'green' },
          { label: 'Conflicts Checked', value: '189', icon: AlertTriangle, color: 'orange' }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-white/10 p-4">
              <Icon className={`w-8 h-8 text-${metric.color}-600 mb-2`} />
              <div className="text-2xl font-bold text-slate-100">{metric.value}</div>
              <div className="text-sm text-slate-300">{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Compliance Areas */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4 flex items-center">
            <Scale className="w-5 h-5 text-purple-400 mr-2" />
            Matter Management
          </h3>
          <div className="space-y-3">
            {[
              { task: 'Client Acceptance Complete', status: '212/234', complete: true },
              { task: 'Conflict Checks Required', status: '22 pending', complete: false },
              { task: 'Engagement Letters', status: '234/234', complete: true },
              { task: 'Risk Assessments', status: '8 overdue', complete: false }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-300">{item.task}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${item.complete ? 'text-green-400' : 'text-orange-400'}`}>
                    {item.status}
                  </span>
                  {item.complete ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 text-green-400 mr-2" />
            Trust Account Compliance
          </h3>
          <div className="space-y-3">
            {[
              { task: 'Daily Reconciliations', status: 'Up to date', complete: true },
              { task: 'Client Ledger Reviews', status: '3 pending', complete: false },
              { task: 'Statutory Deposits', status: 'Compliant', complete: true },
              { task: 'Annual Audit', status: '45 days', complete: true }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-300">{item.task}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${item.complete ? 'text-green-400' : 'text-orange-400'}`}>
                    {item.status}
                  </span>
                  {item.complete ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-white/10 p-6">
        <h3 className="font-bold text-slate-100 mb-4">Recent Client Verifications</h3>
        <div className="space-y-2">
          {[
            { client: 'Apex Property Development', matter: 'Conveyancing', status: 'Verified', time: '1 hour ago' },
            { client: 'John & Sarah Mitchell', matter: 'Family Law', status: 'ID Required', time: '3 hours ago' },
            { client: 'Global Trade Corporation', matter: 'Commercial', status: 'Conflict Check', time: '5 hours ago' }
          ].map((item, index) => (
            <div key={index} className={`p-3 rounded-lg border ${
              item.status === 'Verified' ? 'bg-green-500/10 border-green-500/30' :
              item.status === 'ID Required' ? 'bg-yellow-500/10 border-yellow-500/30' :
              'bg-blue-500/10 border-blue-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-100">{item.client}</p>
                  <p className="text-sm text-slate-300">{item.matter} • {item.status}</p>
                </div>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getAccountingDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calculator className="w-12 h-12" />
            <div>
              <h2 className="text-3xl font-bold">Accounting Firm Dashboard</h2>
              <p className="text-green-100">Tax Agent AML/CTF & Client Acceptance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Clients', value: '2,341', icon: Users, color: 'green' },
          { label: 'Tax Returns', value: '1,567', icon: FileText, color: 'blue' },
          { label: 'Quality Reviews', value: '45', icon: CheckCircle, color: 'purple' },
          { label: 'AML Cases', value: '12', icon: Shield, color: 'orange' }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-white/10 p-4">
              <Icon className={`w-8 h-8 text-${metric.color}-600 mb-2`} />
              <div className="text-2xl font-bold text-slate-100">{metric.value}</div>
              <div className="text-sm text-slate-300">{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Compliance Areas */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4 flex items-center">
            <Shield className="w-5 h-5 text-green-400 mr-2" />
            Tax Agent AML/CTF
          </h3>
          <div className="space-y-3">
            {[
              { task: 'Client Risk Assessments', status: '2,287/2,341', complete: true },
              { task: 'High Risk Clients', status: '54 monitored', complete: true },
              { task: 'Enhanced CDD', status: '8 in progress', complete: false },
              { task: 'AML Program Review', status: 'Due in 45 days', complete: true }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-300">{item.task}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${item.complete ? 'text-green-400' : 'text-orange-400'}`}>
                    {item.status}
                  </span>
                  {item.complete ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
            Professional Standards
          </h3>
          <div className="space-y-3">
            {[
              { task: 'Independence Checks', status: '2,341/2,341', complete: true },
              { task: 'Quality Control Reviews', status: '45 completed', complete: true },
              { task: 'Engagement Letters', status: '12 pending', complete: false },
              { task: 'CPD Compliance', status: 'Up to date', complete: true }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-300">{item.task}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${item.complete ? 'text-green-400' : 'text-orange-400'}`}>
                    {item.status}
                  </span>
                  {item.complete ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Updates */}
      <div className="bg-white rounded-lg border border-white/10 p-6">
        <h3 className="font-bold text-slate-100 mb-4">Recent Client Activity</h3>
        <div className="space-y-2">
          {[
            { client: 'Melbourne Construction Pty Ltd', action: 'New client onboarding', priority: 'high', time: '30 mins ago' },
            { client: 'Tech Innovations Group', action: 'Annual risk review', priority: 'medium', time: '2 hours ago' },
            { client: 'Smith Family Trust', action: 'Tax return lodged', priority: 'low', time: '4 hours ago' }
          ].map((item, index) => (
            <div key={index} className={`p-3 rounded-lg border ${
              item.priority === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
              item.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
              'bg-blue-500/10 border-blue-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-100">{item.client}</p>
                  <p className="text-sm text-slate-300">{item.action}</p>
                </div>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getRealEstateDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Home className="w-12 h-12" />
            <div>
              <h2 className="text-3xl font-bold">Real Estate Agency Dashboard</h2>
              <p className="text-orange-100">Property Settlement & Trust Account Compliance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Listings', value: '87', icon: Home, color: 'orange' },
          { label: 'Settlements', value: '23', icon: FileText, color: 'blue' },
          { label: 'Trust Balance', value: '$2.4M', icon: DollarSign, color: 'green' },
          { label: 'Vendor Verifications', value: '45', icon: Users, color: 'purple' }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-white/10 p-4">
              <Icon className={`w-8 h-8 text-${metric.color}-600 mb-2`} />
              <div className="text-2xl font-bold text-slate-100">{metric.value}</div>
              <div className="text-sm text-slate-300">{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Compliance Areas */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4 flex items-center">
            <Home className="w-5 h-5 text-orange-400 mr-2" />
            Property Transactions
          </h3>
          <div className="space-y-3">
            {[
              { task: 'Vendor ID Verified', status: '82/87', complete: true },
              { task: 'Purchaser Due Diligence', status: '5 pending', complete: false },
              { task: 'Deposit Receipts', status: '87/87', complete: true },
              { task: 'Settlement Ready', status: '23 properties', complete: true }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-300">{item.task}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${item.complete ? 'text-green-400' : 'text-orange-400'}`}>
                    {item.status}
                  </span>
                  {item.complete ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-white/10 p-6">
          <h3 className="font-bold text-slate-100 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 text-green-400 mr-2" />
            Trust Account
          </h3>
          <div className="space-y-3">
            {[
              { task: 'Daily Reconciliation', status: 'Complete', complete: true },
              { task: 'Trust Receipts', status: '127 processed', complete: true },
              { task: 'Trust Disbursements', status: '89 paid', complete: true },
              { task: 'Audit Compliance', status: '100%', complete: true }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-300">{item.task}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${item.complete ? 'text-green-400' : 'text-orange-400'}`}>
                    {item.status}
                  </span>
                  {item.complete ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Settlements */}
      <div className="bg-white rounded-lg border border-white/10 p-6">
        <h3 className="font-bold text-slate-100 mb-4">Upcoming Settlements</h3>
        <div className="space-y-2">
          {[
            { property: '45 Collins Street, Melbourne', date: 'Today', amount: '$1,250,000', status: 'Ready' },
            { property: '12 Queen Street, Sydney', date: 'Tomorrow', amount: '$890,000', status: 'Pending Docs' },
            { property: '78 George Street, Brisbane', date: 'In 3 days', amount: '$650,000', status: 'Ready' }
          ].map((settlement, index) => (
            <div key={index} className={`p-3 rounded-lg border ${
              settlement.status === 'Ready' ? 'bg-green-500/10 border-green-500/30' :
              'bg-yellow-500/10 border-yellow-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-100">{settlement.property}</p>
                  <p className="text-sm text-slate-300">{settlement.amount} • {settlement.status}</p>
                </div>
                <span className="text-xs text-slate-400">{settlement.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  switch (industry) {
    case 'finance':
      return getFinanceDashboard();
    case 'legal':
      return getLegalDashboard();
    case 'accounting':
      return getAccountingDashboard();
    case 'real_estate':
      return getRealEstateDashboard();
    default:
      return <div>Select an industry</div>;
  }
}

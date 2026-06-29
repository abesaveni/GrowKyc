import React from 'react';
import { Button } from '../ui/button';
import {
  TrendingUp,
  DollarSign,
  Users,
  GitBranch,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  Shield,
  Building2,
  Briefcase,
  Target,
  Lock,
  BarChart3,
  AlertCircle
} from 'lucide-react';

interface IMFOPlatformDashboardProps {
  onNavigate: (page: string) => void;
  role: string;
}

export function IMFOPlatformDashboard({ onNavigate, role }: IMFOPlatformDashboardProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">IMFO Platform Dashboard</h1>
        <p className="text-slate-300 mt-1">Bank-grade investor management and fund operations | Australia compliant</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-300">Total AUM</p>
            <DollarSign className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">$427M</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <p className="text-sm text-green-400">+8.2% QTD</p>
          </div>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-300">Active Investors</p>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">147</p>
          <div className="flex items-center gap-1 mt-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <p className="text-sm text-slate-300">142 KYC complete</p>
          </div>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-300">Active SPVs</p>
            <GitBranch className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">28</p>
          <div className="flex items-center gap-1 mt-2">
            <Activity className="w-4 h-4 text-orange-400" />
            <p className="text-sm text-slate-300">12 performing</p>
          </div>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-300">Pending Actions</p>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">7</p>
          <div className="flex items-center gap-1 mt-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <p className="text-sm text-yellow-400">Requires attention</p>
          </div>
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Investor Management */}
        <div className="bg-white border border-white/10 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('investor-registry')}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-500/15 rounded-lg">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">Investor Management</h3>
          </div>
          <p className="text-sm text-slate-300 mb-4">
            Registry, onboarding, KYC/AML, tier classification, and access controls
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">147 active</span>
            <span className="text-indigo-400 font-medium">View →</span>
          </div>
        </div>

        {/* Fund Operations */}
        <div className="bg-white border border-white/10 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('fund-setup')}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/15 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">Fund Operations</h3>
          </div>
          <p className="text-sm text-slate-300 mb-4">
            Fund setup, SPV management, capital management, and Xero integration
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">3 active funds</span>
            <span className="text-blue-400 font-medium">View →</span>
          </div>
        </div>

        {/* Allocation Engine */}
        <div className="bg-white border border-white/10 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('allocation-engine')}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/15 rounded-lg">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">Allocation & Pricing</h3>
          </div>
          <p className="text-sm text-slate-300 mb-4">
            Allocation engine, NAV engine, fees, waterfalls, and unit pricing
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">NAV locked</span>
            <span className="text-green-400 font-medium">View →</span>
          </div>
        </div>

        {/* Risk & Compliance */}
        <div className="bg-white border border-white/10 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('risk-grading')}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500/15 rounded-lg">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">Risk & Compliance</h3>
          </div>
          <p className="text-sm text-slate-300 mb-4">
            Risk grading, exposure limits, stress testing, and compliance gates
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">All limits ok</span>
            <span className="text-red-400 font-medium">View →</span>
          </div>
        </div>

        {/* Deal Management */}
        <div className="bg-white border border-white/10 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('marketplace')}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/15 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">Deal Management</h3>
          </div>
          <p className="text-sm text-slate-300 mb-4">
            Marketplace, deal rooms, IM builder, and rolling closes
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">4 active deals</span>
            <span className="text-purple-400 font-medium">View →</span>
          </div>
        </div>

        {/* Reporting */}
        <div className="bg-white border border-white/10 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('audit-packs')}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-500/15 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">Reporting & Audit</h3>
          </div>
          <p className="text-sm text-slate-300 mb-4">
            Audit packs, branded reports, stress reports, and institutional packs
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Q4 2024</span>
            <span className="text-orange-400 font-medium">View →</span>
          </div>
        </div>
      </div>

      {/* Bank-Grade Security Notice */}
      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-indigo-400 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-indigo-300 mb-1">Bank-Grade Security & Australia Compliance</h4>
            <p className="text-sm text-indigo-300">
              Hard tenant isolation • Immutable audit trails • AML/CTF alignment • Wholesale investor gating • 
              Trust money controls • Maker-checker workflows • 7+ year retention • Row-level security
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-100">Recent Onboarding Applications</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('investor-onboarding')}>
              View All →
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Meridian Capital Pty Ltd', status: 'Pending CFO', tier: 'Tier A', date: '2024-02-10' },
              { name: 'Smith Family Trust', status: 'Compliance Review', tier: 'Tier C', date: '2024-02-09' },
              { name: 'Emma Wilson', status: 'Pending Documents', tier: 'Tier D', date: '2024-02-07' }
            ].map((app, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="font-medium text-slate-100 text-sm">{app.name}</p>
                  <p className="text-xs text-slate-300">{app.tier} • {app.date}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  app.status === 'Pending CFO' ? 'bg-yellow-500/15 text-yellow-300' :
                  app.status === 'Compliance Review' ? 'bg-blue-500/15 text-blue-300' :
                  'bg-orange-500/15 text-orange-300'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-100">Compliance Alerts</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('investor-registry')}>
              View Registry →
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-orange-300 text-sm">Wholesale Evidence Expiring</p>
                <p className="text-xs text-orange-300 mt-1">2 investors require renewed evidence within 30 days</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-300 text-sm">Expired Wholesale Status</p>
                <p className="text-xs text-red-300 mt-1">1 investor blocked from new investments</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-yellow-300 text-sm">Frozen Accounts</p>
                <p className="text-xs text-yellow-300 mt-1">1 investor account requires compliance review</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

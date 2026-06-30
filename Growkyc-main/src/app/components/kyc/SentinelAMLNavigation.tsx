import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  Users,
  FileText,
  Bell,
  Scale,
  Eye,
  TrendingUp,
  Building2,
  Search,
  Lock,
  Calendar,
  Activity,
  CheckCircle,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { SentinelAMLDashboard } from '../kyc/SentinelAMLDashboard';
import { RiskAssessmentBuilder } from '../kyc/RiskAssessmentBuilder';
import { ClientOnboardingWizard } from '../kyc/ClientOnboardingWizard';
import { MonitoringModule } from '../kyc/MonitoringModule';
import { CaseManagement } from '../kyc/CaseManagement';
import { IndustrySelector, Industry } from './IndustrySelector';
import { IndustryDashboard } from './IndustryDashboard';

type SentinelView = 
  | 'industry_selector'
  | 'navigation'
  | 'dashboard'
  | 'risk_assessment'
  | 'client_onboarding'
  | 'monitoring'
  | 'cases';

interface SentinelAMLNavigationProps {
  onBack?: () => void;
}

export function SentinelAMLNavigation({ onBack }: SentinelAMLNavigationProps) {
  const [currentView, setCurrentView] = useState<SentinelView>('industry_selector');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);

  const handleIndustrySelect = (industry: Industry) => {
    setSelectedIndustry(industry);
    setCurrentView('navigation');
  };

  // Industry Selector View
  if (currentView === 'industry_selector') {
    return (
      <IndustrySelector 
        onSelectIndustry={handleIndustrySelect}
        onClose={onBack}
      />
    );
  }

  // Navigation View - Main Hub
  if (currentView === 'navigation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-700 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            {onBack && (
              <Button
                variant="ghost"
                onClick={onBack}
                className="mb-4 text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Grow KYC
              </Button>
            )}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-14 h-14 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-6xl font-bold text-white mb-2">Sentinel AML</h1>
                <p className="text-xl text-blue-100">AUSTRAC Tranche 2 Compliance Platform</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-400/30">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-green-100 font-semibold">GreenID Active</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30">
                <CheckCircle className="w-5 h-5 text-blue-300" />
                <span className="text-blue-100 font-semibold">InfoTrack Active</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30">
                <CheckCircle className="w-5 h-5 text-purple-300" />
                <span className="text-purple-100 font-semibold">AUSTRAC Enrolled</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Active Clients', value: '342', icon: Users, color: 'blue' },
              { label: 'Active Cases', value: '24', icon: FileText, color: 'purple' },
              { label: 'Monitoring Alerts', value: '18', icon: Bell, color: 'orange' },
              { label: 'Compliance Score', value: '98%', icon: TrendingUp, color: 'green' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
                  <Icon className={`w-10 h-10 text-${stat.color}-300 mb-3`} />
                  <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Main Navigation Modules */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/20 p-8 text-left hover:bg-white/20 hover:border-blue-400/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Activity className="w-8 h-8 text-blue-300" />
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Dashboard</h3>
              <p className="text-blue-200 mb-4">
                Real-time compliance overview, risk metrics, and critical alerts
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full">Active</span>
                <span className="text-blue-300">342 clients monitored</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentView('risk_assessment')}
              className="bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/20 p-8 text-left hover:bg-white/20 hover:border-purple-400/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <Scale className="w-8 h-8 text-purple-300" />
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Risk Assessment</h3>
              <p className="text-blue-200 mb-4">
                Configure risk framework, program version control, and country exposure
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full">v2.1</span>
                <span className="text-blue-300">Last updated 23 days ago</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentView('client_onboarding')}
              className="bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/20 p-8 text-left hover:bg-white/20 hover:border-green-400/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <Users className="w-8 h-8 text-green-300" />
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Client Onboarding</h3>
              <p className="text-blue-200 mb-4">
                Complete CDD wizard with GreenID verification and risk assessment
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full">7 pending</span>
                <span className="text-blue-300">GreenID integrated</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentView('monitoring')}
              className="bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/20 p-8 text-left hover:bg-white/20 hover:border-orange-400/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                  <Bell className="w-8 h-8 text-orange-300" />
                </div>
                <div className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-bold">
                  18 alerts
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Monitoring & Alerts</h3>
              <p className="text-blue-200 mb-4">
                Ongoing due diligence, sanctions screening, and PEP monitoring
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full">2 critical</span>
                <span className="text-blue-300">Real-time alerts</span>
              </div>
            </button>

            <button
              onClick={() => setCurrentView('cases')}
              className="bg-white/10 backdrop-blur-sm rounded-xl border-2 border-white/20 p-8 text-left hover:bg-white/20 hover:border-indigo-400/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                  <FileText className="w-8 h-8 text-indigo-300" />
                </div>
                <div className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-bold">
                  6 open
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Case Management</h3>
              <p className="text-blue-200 mb-4">
                CDD, Enhanced CDD, SMR Assessment, and investigation workflows
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full">2 pending approval</span>
                <span className="text-blue-300">Full audit trail</span>
              </div>
            </button>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl border-2 border-white/10 p-8 text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 bg-gray-500/20 rounded-lg flex items-center justify-center">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <Lock className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">Evidence Vault</h3>
              <p className="text-gray-500 mb-4">
                Secure document storage with 7-year retention and audit trails
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full">Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="text-white font-bold mb-2">System Status</h4>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-300 text-sm">All Systems Operational</span>
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Last Independent Review</h4>
                <p className="text-blue-200 text-sm">23 days ago</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Next Review Due</h4>
                <p className="text-blue-200 text-sm">45 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Module Views
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setCurrentView('navigation')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sentinel AML
        </Button>

        {currentView === 'dashboard' && selectedIndustry && <IndustryDashboard industry={selectedIndustry} />}
        {currentView === 'risk_assessment' && <RiskAssessmentBuilder />}
        {currentView === 'client_onboarding' && (
          <ClientOnboardingWizard onClose={() => setCurrentView('navigation')} />
        )}
        {currentView === 'monitoring' && <MonitoringModule />}
        {currentView === 'cases' && <CaseManagement />}
      </div>
    </div>
  );
}
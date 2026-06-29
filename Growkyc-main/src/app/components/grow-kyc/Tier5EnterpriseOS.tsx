import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AICopilotBot } from './tier5/AICopilotBot';
import { ResourceManagementModule } from './tier5/ResourceManagementModule';
import {
  Bot,
  Workflow,
  Users,
  TrendingUp,
  Wallet,
  Building,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Target,
  Clock,
  AlertCircle,
  BarChart3,
  Network,
  Shield,
  Brain,
  FileText,
  Settings
} from 'lucide-react';

type Tier5Module = 'hub' | 'ai-copilot' | 'workflow-orchestrator' | 'capacity-planning' | 'investor-intelligence' | 'identity-wallet' | 'multi-firm-control';

interface Tier5EnterpriseOSProps {
  onBack?: () => void;
}

export function Tier5EnterpriseOS({ onBack }: Tier5EnterpriseOSProps) {
  const [currentModule, setCurrentModule] = useState<Tier5Module>('hub');

  if (currentModule === 'ai-copilot') {
    return <AICopilotBot onBack={() => setCurrentModule('hub')} />;
  }

  if (currentModule === 'workflow-orchestrator') {
    return <WorkflowOrchestratorBot onBack={() => setCurrentModule('hub')} />;
  }

  if (currentModule === 'capacity-planning') {
    return <ResourceManagementModule onBack={() => setCurrentModule('hub')} />;
  }

  if (currentModule === 'investor-intelligence') {
    return <InvestorIntelligenceBot onBack={() => setCurrentModule('hub')} />;
  }

  if (currentModule === 'identity-wallet') {
    return <IdentityWalletBot onBack={() => setCurrentModule('hub')} />;
  }

  if (currentModule === 'multi-firm-control') {
    return <MultiFirmControlBot onBack={() => setCurrentModule('hub')} />;
  }

  // Hub View
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {onBack && (
            <Button onClick={onBack} variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Grow Compliance OS
            </Button>
          )}
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
              <Network className="w-14 h-14 text-white" />
            </div>
            <div>
              <Badge className="bg-purple-600 text-white mb-2 text-sm px-4 py-1">TIER 5 - ENTERPRISE OPERATING SYSTEM</Badge>
              <h1 className="text-5xl font-bold text-white">Autonomous Platform Layer</h1>
              <p className="text-slate-300 text-xl">Not a compliance tool. An enterprise operating system.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border-4 border-purple-400 rounded-xl p-8 shadow-2xl">
            <h3 className="font-bold text-purple-900 text-2xl mb-4 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              The Biggest Moat: Multi-Firm Autonomous Operations
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-[#1e293b] p-6 rounded-xl border-2 border-purple-300 shadow-lg">
                <Bot className="w-12 h-12 text-purple-600 mb-3" />
                <p className="font-bold text-white text-lg mb-2">AI-Driven Orchestration</p>
                <p className="text-sm text-slate-300">Autonomous workflow execution, predictive routing, AI copilot support—work happens automatically</p>
              </div>
              <div className="bg-[#1e293b] p-6 rounded-xl border-2 border-blue-300 shadow-lg">
                <Wallet className="w-12 h-12 text-blue-600 mb-3" />
                <p className="font-bold text-white text-lg mb-2">Reusable Intelligence</p>
                <p className="text-sm text-slate-300">One-time verification, perpetual wallet—identity & entity data reused across all services forever</p>
              </div>
              <div className="bg-[#1e293b] p-6 rounded-xl border-2 border-green-300 shadow-lg">
                <Building className="w-12 h-12 text-green-600 mb-3" />
                <p className="font-bold text-white text-lg mb-2">Multi-Firm Enterprise</p>
                <p className="text-sm text-slate-300">Accounting firms, lenders, brokers, investor groups—one platform, isolated data, central oversight</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#1e293b] p-6 rounded-xl border-2 border-amber-300 shadow-lg">
                <TrendingUp className="w-12 h-12 text-amber-600 mb-3" />
                <p className="font-bold text-white text-lg mb-2">Predictive Capacity</p>
                <p className="text-sm text-slate-300">Forecast staffing needs, bottlenecks, overload risk—practice management intelligence</p>
              </div>
              <div className="bg-[#1e293b] p-6 rounded-xl border-2 border-indigo-300 shadow-lg">
                <Target className="w-12 h-12 text-indigo-600 mb-3" />
                <p className="font-bold text-white text-lg mb-2">Investor & Lender Views</p>
                <p className="text-sm text-slate-300">Deal intelligence, borrower profiling, security tracking—extends beyond accounting to private capital</p>
              </div>
              <div className="bg-[#1e293b] p-6 rounded-xl border-2 border-pink-300 shadow-lg">
                <Brain className="w-12 h-12 text-pink-600 mb-3" />
                <p className="font-bold text-white text-lg mb-2">Explainable AI Copilot</p>
                <p className="text-sm text-slate-300">Draft memos, summarize findings, explain decisions—AI beside every reviewer</p>
              </div>
            </div>

            <div className="mt-6 p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl border-2 border-purple-400">
              <p className="text-center text-lg text-white">
                <strong className="text-purple-900">Platform Evolution:</strong>{' '}
                <span className="text-slate-300">Tier 1 = Compliance</span> •{' '}
                <span className="text-slate-300">Tier 2 = Understanding</span> •{' '}
                <span className="text-slate-300">Tier 3 = Decisions</span> •{' '}
                <span className="text-slate-300">Tier 4 = Profit</span> •{' '}
                <span className="text-purple-900 font-bold">Tier 5 = Autonomous Enterprise OS</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Tier 5 Modules Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* AI Compliance Copilot */}
          <Card 
            className="border-4 border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentModule('ai-copilot')}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <Badge className="bg-purple-700 text-white text-xs px-3 py-1">AI COPILOT</Badge>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">AI Compliance Analyst Copilot</h2>
              <p className="text-slate-300 mb-3 text-sm">
                Explainable AI beside every reviewer
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Draft ECDD memos</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Summarize findings</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Identify missing evidence</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Q&A on any file</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#1e293b] p-2 rounded border-2 border-purple-300 text-center">
                  <p className="text-xs text-purple-700">Cases Today</p>
                  <p className="text-xl font-bold text-purple-600">247</p>
                </div>
                <div className="bg-[#1e293b] p-2 rounded border-2 border-purple-300 text-center">
                  <p className="text-xs text-purple-700">Memos Drafted</p>
                  <p className="text-xl font-bold text-purple-600">89</p>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg text-sm py-4">
                Launch AI Copilot
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Workflow Orchestrator */}
          <Card 
            className="border-4 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentModule('workflow-orchestrator')}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Workflow className="w-10 h-10 text-white" />
                </div>
                <Badge className="bg-blue-700 text-white text-xs px-3 py-1">AUTO ENGINE</Badge>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Autonomous Workflow Orchestrator</h2>
              <p className="text-slate-300 mb-3 text-sm">
                Work happens automatically
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Auto-route jobs</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Create tasks</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Assign owners</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Pause on blockers</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#1e293b] p-2 rounded border-2 border-blue-300 text-center">
                  <p className="text-xs text-blue-700">Active Workflows</p>
                  <p className="text-xl font-bold text-blue-600">1,234</p>
                </div>
                <div className="bg-[#1e293b] p-2 rounded border-2 border-blue-300 text-center">
                  <p className="text-xs text-blue-700">Auto-Advanced</p>
                  <p className="text-xl font-bold text-blue-600">892</p>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg text-sm py-4">
                Launch Orchestrator
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Capacity Planning */}
          <Card 
            className="border-4 border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentModule('capacity-planning')}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <Badge className="bg-green-700 text-white text-xs px-3 py-1">PREDICTIVE</Badge>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Predictive Capacity Planning</h2>
              <p className="text-slate-300 mb-3 text-sm">
                Forecast staffing & bottlenecks
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Predict workload</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Spot overload risk</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Recommend hiring</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Scenario planning</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#1e293b] p-2 rounded border-2 border-green-300 text-center">
                  <p className="text-xs text-green-700">Utilization</p>
                  <p className="text-xl font-bold text-green-600">87%</p>
                </div>
                <div className="bg-[#1e293b] p-2 rounded border-2 border-red-300 text-center">
                  <p className="text-xs text-red-700">Overloaded</p>
                  <p className="text-xl font-bold text-red-600">3</p>
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg text-sm py-4">
                Launch Capacity Bot
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Investor Intelligence */}
          <Card 
            className="border-4 border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentModule('investor-intelligence')}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <Badge className="bg-amber-700 text-white text-xs px-3 py-1">FINANCE OPS</Badge>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Investor & Lender Intelligence</h2>
              <p className="text-slate-300 mb-3 text-sm">
                Deal intelligence & portfolio tracking
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Borrower profiling</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Deal readiness</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Security tracking</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Portfolio exposure</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#1e293b] p-2 rounded border-2 border-amber-300 text-center">
                  <p className="text-xs text-amber-700">Active Deals</p>
                  <p className="text-xl font-bold text-amber-600">47</p>
                </div>
                <div className="bg-[#1e293b] p-2 rounded border-2 border-amber-300 text-center">
                  <p className="text-xs text-amber-700">Deal Ready</p>
                  <p className="text-xl font-bold text-green-600">34</p>
                </div>
              </div>

              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg text-sm py-4">
                Launch Investor Bot
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Identity Wallet */}
          <Card 
            className="border-4 border-indigo-500 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentModule('identity-wallet')}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                <Badge className="bg-indigo-700 text-white text-xs px-3 py-1">REUSABLE</Badge>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Reusable Identity Wallet</h2>
              <p className="text-slate-300 mb-3 text-sm">
                One-time verification, perpetual use
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Store verified facts</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Reuse prior checks</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Delta-only refresh</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Historic evidence</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#1e293b] p-2 rounded border-2 border-indigo-300 text-center">
                  <p className="text-xs text-indigo-700">Active Wallets</p>
                  <p className="text-xl font-bold text-indigo-600">12,847</p>
                </div>
                <div className="bg-[#1e293b] p-2 rounded border-2 border-indigo-300 text-center">
                  <p className="text-xs text-indigo-700">Reused/Month</p>
                  <p className="text-xl font-bold text-green-600">2,341</p>
                </div>
              </div>

              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg text-sm py-4">
                Launch Wallet Bot
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Multi-Firm Control */}
          <Card 
            className="border-4 border-pink-500 bg-gradient-to-br from-pink-50 to-pink-100 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentModule('multi-firm-control')}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Building className="w-10 h-10 text-white" />
                </div>
                <Badge className="bg-pink-700 text-white text-xs px-3 py-1">ENTERPRISE</Badge>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Enterprise Multi-Firm Control</h2>
              <p className="text-slate-300 mb-3 text-sm">
                Multi-tenant, whitelabel, isolated data
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Multiple firms</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Isolated data</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Central oversight</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Policy deployment</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[#1e293b] p-2 rounded border-2 border-pink-300 text-center">
                  <p className="text-xs text-pink-700">Active Firms</p>
                  <p className="text-xl font-bold text-pink-600">23</p>
                </div>
                <div className="bg-[#1e293b] p-2 rounded border-2 border-pink-300 text-center">
                  <p className="text-xs text-pink-700">Total Users</p>
                  <p className="text-xl font-bold text-pink-600">847</p>
                </div>
              </div>

              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white shadow-lg text-sm py-4">
                Launch Command Centre
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tier 5 System Flow */}
        <Card className="border-4 border-purple-500 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <Zap className="w-8 h-8 text-purple-600" />
              Complete Tier 5 Autonomous Flow
            </CardTitle>
            <CardDescription className="text-lg">From wallet reuse to enterprise oversight</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4 mb-6">
              {[
                { icon: Users, label: 'Client/Entity Enters System', color: 'blue' },
                { icon: Wallet, label: 'Wallet Checked for Reusable Data', color: 'indigo' },
                { icon: Workflow, label: 'Orchestrator Launches Required Path', color: 'blue' },
                { icon: Zap, label: 'Bots Run Delta Checks Only', color: 'green' },
                { icon: Brain, label: 'Decision Bot Recommends Outcome', color: 'red' },
                { icon: Bot, label: 'AI Copilot Drafts Memo', color: 'purple' },
                { icon: AlertCircle, label: 'Monitoring Trigger Activates', color: 'orange' },
                { icon: Users, label: 'Capacity Bot Updates Forecast', color: 'green' },
                { icon: TrendingUp, label: 'Portfolio Dashboards Update', color: 'amber' },
                { icon: Building, label: 'Enterprise Command Centre Live', color: 'pink' }
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-[#1e293b] rounded-lg border-2 border-purple-200 shadow-sm">
                    <div className={`w-12 h-12 bg-${step.color}-100 rounded-full flex items-center justify-center border-2 border-${step.color}-400`}>
                      <Icon className={`w-6 h-6 text-${step.color}-700`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white">{idx + 1}. {step.label}</p>
                    </div>
                    {idx < 9 && <ArrowRight className="w-5 h-5 text-slate-400" />}
                  </div>
                );
              })}
            </div>

            <div className="bg-[#1e293b] rounded-xl border-2 border-purple-300 p-6 shadow-lg">
              <h4 className="font-bold text-white text-xl mb-4">What Tier 5 Achieves:</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    Autonomous Execution
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Work routes automatically to right people</li>
                    <li>• Tasks created and assigned without manual input</li>
                    <li>• Workflows pause on blockers, resume when cleared</li>
                    <li>• AI copilot drafts memos and summaries</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Reusable Intelligence
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• One-time identity verification, perpetual reuse</li>
                    <li>• 2,341 checks reused monthly</li>
                    <li>• Delta-only refresh for efficiency</li>
                    <li>• Historic evidence vault with SHA256</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Predictive Operations
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Forecast staffing needs 30 days ahead</li>
                    <li>• Predict bottlenecks and overload risk</li>
                    <li>• Scenario planning for capacity changes</li>
                    <li>• 87% utilization with 3 overloaded teams flagged</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-pink-900 mb-2 flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Enterprise Scale
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• 23 firms, 847 users, isolated data</li>
                    <li>• Central policy deployment & oversight</li>
                    <li>• Whitelabel branding per firm</li>
                    <li>• Cross-firm risk aggregation & reporting</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Tier 5 Achieves */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Tier 5 = Full Enterprise Operating System</h3>
            <p className="text-center text-slate-300 mb-6 max-w-3xl mx-auto">
              Not compliance software. Not even a compliance platform. This is operating system infrastructure for accounting firms, lenders, brokers, investor groups, and multi-entity advisory businesses.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Workflow className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-white mb-2">Autonomous Workflows</h4>
                <p className="text-sm text-slate-300">
                  1,234 active workflows, 892 auto-advanced—work happens without human routing
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Wallet className="w-8 h-8 text-indigo-600" />
                </div>
                <h4 className="font-bold text-white mb-2">Perpetual Wallets</h4>
                <p className="text-sm text-slate-300">
                  12,847 active wallets, verify once and reuse across all services forever
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building className="w-8 h-8 text-pink-600" />
                </div>
                <h4 className="font-bold text-white mb-2">Multi-Firm Enterprise</h4>
                <p className="text-sm text-slate-300">
                  23 firms under one platform, isolated data, central oversight & control
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function WorkflowOrchestratorBot({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />Back to Tier 5 Hub
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
              <Workflow className="w-10 h-10 text-white" />
            </div>
            <div>
              <Badge className="bg-blue-600 text-white mb-2">AUTO ENGINE</Badge>
              <h1 className="text-3xl font-bold text-white">Autonomous Workflow Orchestrator</h1>
              <p className="text-slate-300">Work routes automatically—no manual assignment needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvestorIntelligenceBot({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />Back to Tier 5 Hub
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <div>
              <Badge className="bg-amber-600 text-white mb-2">FINANCE OPS</Badge>
              <h1 className="text-3xl font-bold text-white">Investor & Lender Intelligence</h1>
              <p className="text-slate-300">Deal intelligence, borrower profiling, portfolio exposure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IdentityWalletBot({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />Back to Tier 5 Hub
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <div>
              <Badge className="bg-indigo-600 text-white mb-2">REUSABLE</Badge>
              <h1 className="text-3xl font-bold text-white">Reusable Identity & Entity Wallet</h1>
              <p className="text-slate-300">One-time verification, perpetual use—12,847 active wallets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MultiFirmControlBot({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />Back to Tier 5 Hub
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl flex items-center justify-center">
              <Building className="w-10 h-10 text-white" />
            </div>
            <div>
              <Badge className="bg-pink-600 text-white mb-2">ENTERPRISE</Badge>
              <h1 className="text-3xl font-bold text-white">Enterprise Multi-Firm Control</h1>
              <p className="text-slate-300">23 firms • 847 users • Isolated data with central oversight</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

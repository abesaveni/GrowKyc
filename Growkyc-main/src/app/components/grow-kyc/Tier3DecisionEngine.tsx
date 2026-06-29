import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Zap,
  Brain,
  Shield,
  Activity,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Users,
  TrendingUp,
  Eye,
  XCircle,
  Bell,
  Search,
  Sparkles,
  ChevronRight
} from 'lucide-react';

type Tier3Module = 'hub' | 'decision-bot' | 'monitoring-bot' | 'qa-bot';

interface Tier3DecisionEngineProps {
  onBack?: () => void;
}

export function Tier3DecisionEngine({ onBack }: Tier3DecisionEngineProps) {
  const [currentModule, setCurrentModule] = useState<Tier3Module>('hub');

  if (currentModule === 'decision-bot') {
    return <ComplianceDecisionBot onBack={() => setCurrentModule('hub')} />;
  }

  if (currentModule === 'monitoring-bot') {
    return <MonitoringTriggerBot onBack={() => setCurrentModule('hub')} />;
  }

  if (currentModule === 'qa-bot') {
    return <ComplianceFileQABot onBack={() => setCurrentModule('hub')} />;
  }

  // Hub View
  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <div className="bg-[#0d121d] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          {onBack && (
            <Button onClick={onBack} variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Grow Compliance OS
            </Button>
          )}
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <div>
              <Badge className="bg-red-600 text-white mb-2 text-sm px-4 py-1">TIER 3 - DECISION ENGINE</Badge>
              <h1 className="text-5xl font-bold text-white">Autonomous Compliance System</h1>
              <p className="text-slate-300 text-xl">Not a tool. A live decision engine with autonomous monitoring.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 border-4 border-red-400 rounded-xl p-8 shadow-2xl">
            <h3 className="font-bold text-red-900 text-2xl mb-4 flex items-center gap-2">
              <Zap className="w-8 h-8 text-red-600" />
              What Makes Tier 3 Your Real Moat
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#0d121d] p-6 rounded-xl border-2 border-red-300 shadow-lg">
                <Brain className="w-12 h-12 text-red-600 mb-3" />
                <p className="font-bold text-white text-lg mb-2">Automated Decisions</p>
                <p className="text-sm text-slate-300">AI ingests all Tier 1 + 2 outputs and produces final risk ratings, onboarding decisions, and required controls with full explainability</p>
              </div>
              <div className="bg-[#0d121d] p-6 rounded-xl border-2 border-orange-300 shadow-lg">
                <Activity className="w-12 h-12 text-orange-600 mb-3" />
                <p className="font-bold text-white text-lg mb-2">Live Monitoring</p>
                <p className="text-sm text-slate-300">System automatically triggers reviews when anything changes—PEP status, adverse media, ownership, directors—making compliance continuous, not static</p>
              </div>
              <div className="bg-[#0d121d] p-6 rounded-xl border-2 border-amber-300 shadow-lg">
                <FileCheck className="w-12 h-12 text-amber-600 mb-3" />
                <p className="font-bold text-white text-lg mb-2">Audit-Ready QA</p>
                <p className="text-sm text-slate-300">Every file validated for completeness, compliance, and audit-readiness with automated checklists and issue detection</p>
              </div>
            </div>
            
            <div className="mt-6 p-6 bg-gradient-to-r from-purple-100 to-red-100 rounded-xl border-2 border-red-400">
              <p className="text-center text-lg text-white">
                <strong className="text-red-900">Platform Evolution:</strong>{' '}
                <span className="text-purple-900">Tier 1 = Checks</span> •{' '}
                <span className="text-blue-900">Tier 2 = Understanding</span> •{' '}
                <span className="text-red-900 font-bold">Tier 3 = Decisions + Automation</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Tier 3 Modules Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Compliance Decision Bot */}
          <Card 
            className="border-4 border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentModule('decision-bot')}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <Badge className="bg-red-700 text-white text-xs px-3 py-1">THE BRAIN</Badge>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3">Compliance Decision Bot</h2>
              <p className="text-slate-300 mb-4 text-sm">
                Autonomous risk rating • Onboarding decisions • Required controls
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Ingests all Tier 1 + 2 bot outputs</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Final risk score calculation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Automated onboarding decisions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Conditional approval workflows</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Full decision explainability</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-red-300 text-center">
                  <p className="text-xs text-red-700">Pending</p>
                  <p className="text-3xl font-bold text-red-600">47</p>
                </div>
                <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-red-300 text-center">
                  <p className="text-xs text-red-700">Approved</p>
                  <p className="text-3xl font-bold text-green-600">234</p>
                </div>
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700 text-white shadow-xl text-lg py-6">
                Launch Decision Engine
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Monitoring Trigger Bot */}
          <Card 
            className="border-4 border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentModule('monitoring-bot')}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Activity className="w-12 h-12 text-white" />
                </div>
                <Badge className="bg-orange-700 text-white text-xs px-3 py-1">LIVE SYSTEM</Badge>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3">Monitoring Trigger Bot</h2>
              <p className="text-slate-300 mb-4 text-sm">
                Live compliance monitoring • Auto-triggered reviews • Event detection
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>PEP & sanctions status changes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>New adverse media detection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Ownership & director changes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Document expiry alerts</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Automated review triggers</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-orange-300 text-center">
                  <p className="text-xs text-orange-700">Active Subjects</p>
                  <p className="text-3xl font-bold text-orange-600">1,847</p>
                </div>
                <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-orange-300 text-center">
                  <p className="text-xs text-orange-700">Alerts Today</p>
                  <p className="text-3xl font-bold text-red-600">12</p>
                </div>
              </div>

              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-xl text-lg py-6">
                Launch Monitoring Bot
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Compliance File QA Bot */}
          <Card 
            className="border-4 border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentModule('qa-bot')}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <FileCheck className="w-12 h-12 text-white" />
                </div>
                <Badge className="bg-amber-700 text-white text-xs px-3 py-1">AUDIT READY</Badge>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3">Compliance File QA Bot</h2>
              <p className="text-slate-300 mb-4 text-sm">
                File completeness • Audit readiness • Issue detection
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Missing KYC check detection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Missing document alerts</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Expired ID validation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Audit trail verification</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Regulator-ready reports</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-amber-300 text-center">
                  <p className="text-xs text-amber-700">Compliant</p>
                  <p className="text-3xl font-bold text-green-600">892</p>
                </div>
                <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-amber-300 text-center">
                  <p className="text-xs text-amber-700">Issues Found</p>
                  <p className="text-3xl font-bold text-red-600">23</p>
                </div>
              </div>

              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-xl text-lg py-6">
                Launch QA Bot
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tier 3 System Flow */}
        <Card className="mt-8 border-4 border-red-500 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <Sparkles className="w-8 h-8 text-red-600" />
              Complete Tier 3 Autonomous Flow
            </CardTitle>
            <CardDescription className="text-lg">From verification to live monitoring to audit-ready output</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-7 gap-4 mb-6">
              {[
                { label: 'All T1+T2 Checks', icon: Shield, color: 'blue' },
                { label: 'Decision Bot', icon: Brain, color: 'red' },
                { label: 'Outcome', icon: CheckCircle, color: 'green' },
                { label: 'Monitoring Active', icon: Activity, color: 'orange' },
                { label: 'Event Detected', icon: Bell, color: 'amber' },
                { label: 'Review Triggered', icon: Search, color: 'purple' },
                { label: 'QA Validated', icon: FileCheck, color: 'green' }
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="text-center">
                    <div className={`w-16 h-16 bg-${step.color}-100 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-${step.color}-400 shadow-lg`}>
                      <Icon className={`w-8 h-8 text-${step.color}-700`} />
                    </div>
                    <p className="text-xs font-bold text-white">{step.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#0d121d] rounded-xl border-2 border-red-300 p-6 shadow-lg">
              <h4 className="font-bold text-white text-xl mb-4">What Tier 3 Achieves:</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Automated Decisions
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• AI-powered risk ratings from all bot inputs</li>
                    <li>• Approve, conditional approve, escalate, or reject</li>
                    <li>• Required controls automatically assigned</li>
                    <li>• Full explainability for every decision</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Live Monitoring
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Continuous compliance, not static checks</li>
                    <li>• Auto-trigger reviews on any change</li>
                    <li>• PEP, sanctions, media, ownership alerts</li>
                    <li>• Document expiry & behavior tracking</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Audit-Ready System
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Every file validated for completeness</li>
                    <li>• Missing checks, docs, approvals flagged</li>
                    <li>• Immutable audit trail verification</li>
                    <li>• Regulator-ready exports on demand</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Regulatory Defensibility
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Reduced human error through automation</li>
                    <li>• Strong regulatory defensibility</li>
                    <li>• Evidence-based decision trails</li>
                    <li>• AUSTRAC, ASIC, NCCP ready</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Compliance Decision Bot Component
function ComplianceDecisionBot({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <div className="bg-[#0d121d] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tier 3 Hub
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div>
              <Badge className="bg-red-600 text-white mb-2">THE BRAIN</Badge>
              <h1 className="text-3xl font-bold text-white">Compliance Decision Bot</h1>
              <p className="text-slate-300">AI-powered autonomous decision engine</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Pending Decisions', value: 47, icon: Clock, color: 'blue' },
            { label: 'Approved', value: 234, icon: CheckCircle, color: 'green' },
            { label: 'Conditional', value: 89, icon: AlertTriangle, color: 'amber' },
            { label: 'Escalated', value: 12, icon: TrendingUp, color: 'orange' },
            { label: 'Rejected', value: 8, icon: XCircle, color: 'red' },
            { label: 'Overdue', value: 3, icon: Clock, color: 'red' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-2 hover:border-red-400 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                    <Badge className={`bg-${stat.color}-100 text-${stat.color}-700`}>{stat.value}</Badge>
                  </div>
                  <p className="text-sm font-medium text-white">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Decision Queue */}
        <Card className="border-2 border-red-400 mb-8">
          <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-red-600" />
              Decision Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#0a0e17] border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Client / Entity</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Risk Score</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Key Flags</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Assigned</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">SLA</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { client: 'Pacific Holdings Trust', score: 'Medium (42)', flags: 'Foreign PEP', status: 'Pending', assigned: 'Sarah J.', sla: '2h 15m' },
                    { client: 'Emma Wilson', score: 'Low (18)', flags: 'None', status: 'Approved', assigned: 'System', sla: 'Complete' },
                    { client: 'Global Trading Co', score: 'High (78)', flags: 'Missing UBO', status: 'Escalated', assigned: 'James C.', sla: 'Overdue' },
                    { client: 'Tech Industries Ltd', score: 'Low (22)', flags: 'None', status: 'Approved', assigned: 'System', sla: 'Complete' }
                  ].map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/5 cursor-pointer">
                      <td className="px-4 py-3 font-medium text-white">{item.client}</td>
                      <td className="px-4 py-3">
                        <Badge className={
                          item.score.includes('Low') ? 'bg-green-100 text-green-700' :
                          item.score.includes('Medium') ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {item.score}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-300">{item.flags}</td>
                      <td className="px-4 py-3">
                        <Badge className={
                          item.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          item.status === 'Escalated' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-300">{item.assigned}</td>
                      <td className="px-4 py-3">
                        <span className={
                          item.sla === 'Complete' ? 'text-green-600 text-xs' :
                          item.sla === 'Overdue' ? 'text-red-600 text-xs font-bold' :
                          'text-slate-300 text-xs'
                        }>
                          {item.sla}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t bg-[#0a0e17]">
              <Button variant="ghost" className="w-full text-red-700 hover:bg-red-50">
                View All Decisions <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Core Decision Rules */}
        <Card className="border-2 border-red-400 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <Shield className="w-6 h-6" />
              Core Decision Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { rule: 'Sanctions Hit', action: 'AUTO REJECT', color: 'red' },
                { rule: 'Foreign PEP', action: 'Minimum HIGH RISK', color: 'orange' },
                { rule: 'Missing UBO', action: 'CANNOT APPROVE', color: 'red' },
                { rule: 'High Adverse Media', action: 'ESCALATE', color: 'amber' },
                { rule: 'All Decisions', action: 'Must Explain', color: 'blue' },
                { rule: 'Expired ID', action: 'AUTO FAIL', color: 'red' }
              ].map((rule, idx) => (
                <div key={idx} className="bg-[#0d121d] p-4 rounded-lg border-2 border-red-200 flex items-center justify-between">
                  <p className="font-medium text-white">{rule.rule}</p>
                  <Badge className={`bg-${rule.color}-600 text-white`}>{rule.action}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Monitoring Trigger Bot Component
function MonitoringTriggerBot({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <div className="bg-[#0d121d] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tier 3 Hub
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-xl">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <div>
              <Badge className="bg-orange-600 text-white mb-2">LIVE SYSTEM</Badge>
              <h1 className="text-3xl font-bold text-white">Monitoring Trigger Bot</h1>
              <p className="text-slate-300">Continuous compliance monitoring with auto-triggered reviews</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Active Monitoring', value: '1,847', icon: Eye, color: 'blue' },
            { label: 'Changes Today', value: 12, icon: Bell, color: 'orange' },
            { label: 'Reviews Triggered', value: 8, icon: Search, color: 'purple' },
            { label: 'Escalations', value: 3, icon: AlertTriangle, color: 'red' },
            { label: 'Overdue Reviews', value: 2, icon: Clock, color: 'red' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-2 hover:border-orange-400 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                    <Badge className={`bg-${stat.color}-100 text-${stat.color}-700`}>{stat.value}</Badge>
                  </div>
                  <p className="text-sm font-medium text-white">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Live Alerts */}
        <Card className="border-2 border-orange-400 mb-8">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-orange-600" />
              Live Monitoring Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#0a0e17] border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Subject</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Change Type</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Detected</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Severity</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Triggered Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { subject: 'Vladimir Petrov', change: 'New Sanctions Match', time: '5 mins ago', severity: 'Critical', action: 'AUTO BLOCK' },
                    { subject: 'Pacific Holdings', change: 'Director Change', time: '2 hours ago', severity: 'High', action: 'Rerun KYB' },
                    { subject: 'Emma Wilson', change: 'Document Expiry', time: '1 day ago', severity: 'Medium', action: 'Request Update' },
                    { subject: 'Global Trading', change: 'New Adverse Media', time: '3 hours ago', severity: 'High', action: 'Trigger Review' }
                  ].map((alert, idx) => (
                    <tr key={idx} className="hover:bg-white/5 cursor-pointer">
                      <td className="px-4 py-3 font-medium text-white">{alert.subject}</td>
                      <td className="px-4 py-3 text-xs text-slate-300">{alert.change}</td>
                      <td className="px-4 py-3 text-xs text-slate-300">{alert.time}</td>
                      <td className="px-4 py-3">
                        <Badge className={
                          alert.severity === 'Critical' ? 'bg-red-600 text-white' :
                          alert.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                          'bg-amber-100 text-amber-700'
                        }>
                          {alert.severity}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={
                          alert.action.includes('BLOCK') ? 'bg-red-600 text-white' :
                          'bg-blue-100 text-blue-700'
                        }>
                          {alert.action}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Trigger Rules */}
        <Card className="border-2 border-orange-400 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <Zap className="w-6 h-6" />
              Active Trigger Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                'New Adverse Media → Trigger Review',
                'PEP Status Change → Escalate',
                'New Director → Rerun KYB + Ownership',
                'Document Expiry → Request Update',
                'Sanctions Match → AUTO BLOCK',
                'Ownership Change → Revalidate UBO'
              ].map((rule, idx) => (
                <div key={idx} className="bg-[#0d121d] p-3 rounded-lg border border-orange-200 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="font-medium text-white">{rule}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Compliance File QA Bot Component
function ComplianceFileQABot({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <div className="bg-[#0d121d] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tier 3 Hub
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-xl">
              <FileCheck className="w-10 h-10 text-white" />
            </div>
            <div>
              <Badge className="bg-amber-600 text-white mb-2">AUDIT READY</Badge>
              <h1 className="text-3xl font-bold text-white">Compliance File QA Bot</h1>
              <p className="text-slate-300">Automated file validation for completeness and audit-readiness</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Files Reviewed', value: '915', icon: FileCheck, color: 'blue' },
            { label: 'Compliant', value: 892, icon: CheckCircle, color: 'green' },
            { label: 'Incomplete', value: 18, icon: AlertTriangle, color: 'amber' },
            { label: 'High-Risk Files', value: 3, icon: XCircle, color: 'red' },
            { label: 'Audit Failures', value: 2, icon: AlertTriangle, color: 'red' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-2 hover:border-amber-400 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                    <Badge className={`bg-${stat.color}-100 text-${stat.color}-700`}>{stat.value}</Badge>
                  </div>
                  <p className="text-sm font-medium text-white">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* QA Checklist Summary */}
        <Card className="border-2 border-amber-400 mb-8">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 border-b">
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-amber-600" />
              QA Checklist - All Files Must Pass
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { check: 'Identity Complete', pass: true },
                { check: 'Sanctions Checked', pass: true },
                { check: 'PEP Checked', pass: true },
                { check: 'Adverse Media Checked', pass: true },
                { check: 'KYB Complete', pass: true },
                { check: 'Ownership Complete', pass: false },
                { check: 'SOF Complete', pass: true },
                { check: 'SOW Complete', pass: true },
                { check: 'Decision Recorded', pass: true },
                { check: 'Audit Log Present', pass: true }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-2 flex items-center justify-between ${
                  item.pass ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <p className="font-medium text-white">{item.check}</p>
                  {item.pass ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Core QA Rules */}
        <Card className="border-2 border-amber-400 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <Shield className="w-6 h-6" />
              Core QA Rules - Auto-Fail Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Missing Mandatory Check = FAIL',
                'Missing Audit Trail = FAIL',
                'Expired ID = FAIL',
                'Unresolved Escalation = FAIL',
                'Missing UBO = FAIL',
                'No Decision Record = FAIL'
              ].map((rule, idx) => (
                <div key={idx} className="bg-[#0d121d] p-3 rounded-lg border-2 border-red-300 flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <p className="font-medium text-white">{rule}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

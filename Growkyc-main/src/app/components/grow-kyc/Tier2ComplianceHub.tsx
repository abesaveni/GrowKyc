import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Shield,
  Network,
  DollarSign,
  Landmark,
  Gavel,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import { BeneficialOwnershipBot } from './BeneficialOwnershipBot';

type Tier2Module = 'hub' | 'beneficial-ownership' | 'source-of-funds' | 'source-of-wealth' | 'court-litigation';

interface Tier2ComplianceHubProps {
  onBack?: () => void;
}

export function Tier2ComplianceHub({ onBack }: Tier2ComplianceHubProps) {
  const [currentModule, setCurrentModule] = useState<Tier2Module>('hub');

  if (currentModule === 'beneficial-ownership') {
    return <BeneficialOwnershipBot onBack={() => setCurrentModule('hub')} />;
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
            <div className="w-16 h-16 bg-gradient-to-br from-[#13B5EA] to-[#0E7C9E] rounded-2xl flex items-center justify-center shadow-xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <Badge className="bg-amber-600 text-white mb-2">TIER 2 - INSTITUTION GRADE</Badge>
              <h1 className="text-4xl font-bold text-white">Enhanced Due Diligence Hub</h1>
              <p className="text-slate-300 text-lg">Beyond onboarding • Real risk intelligence • AUSTRAC Tranche 2 ready</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-xl p-6">
            <h3 className="font-bold text-purple-900 text-xl mb-2">What Makes Tier 2 Institution-Grade?</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-[#1e293b] p-4 rounded-lg border border-purple-200">
                <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                <p className="font-semibold text-white mb-1">Beyond Onboarding</p>
                <p className="text-sm text-slate-300">Continuous risk intelligence, not just initial checks</p>
              </div>
              <div className="bg-[#1e293b] p-4 rounded-lg border border-purple-200">
                <Network className="w-8 h-8 text-purple-600 mb-2" />
                <p className="font-semibold text-white mb-1">Relationship Mapping</p>
                <p className="text-sm text-slate-300">Complete ownership chains and control structures</p>
              </div>
              <div className="bg-[#1e293b] p-4 rounded-lg border border-purple-200">
                <Shield className="w-8 h-8 text-purple-600 mb-2" />
                <p className="font-semibold text-white mb-1">Lending-Ready</p>
                <p className="text-sm text-slate-300">Supports credit, investment & fiduciary workflows</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Tier 2 Modules Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Beneficial Ownership Bot */}
          <Card 
            className="border-2 border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            onClick={() => setCurrentModule('beneficial-ownership')}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Network className="w-10 h-10 text-white" />
                </div>
                <Badge className="bg-purple-600 text-white">AUSTRAC TRANCHE 2</Badge>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">Beneficial Ownership Mapping Bot</h2>
              <p className="text-slate-300 mb-4">
                AI-powered UBO identification • Ownership chain analysis • Control detection
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Ultimate beneficial owner (UBO) identification</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Multi-layer ownership chain mapping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Control without ownership detection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Gap & inconsistency flagging</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Interactive ownership graphs</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-[#1e293b] p-3 rounded border border-purple-200 text-center">
                  <p className="text-xs text-purple-700">Pending</p>
                  <p className="text-2xl font-bold text-purple-600">28</p>
                </div>
                <div className="bg-[#1e293b] p-3 rounded border border-purple-200 text-center">
                  <p className="text-xs text-purple-700">Incomplete</p>
                  <p className="text-2xl font-bold text-amber-600">11</p>
                </div>
                <div className="bg-[#1e293b] p-3 rounded border border-purple-200 text-center">
                  <p className="text-xs text-purple-700">Missing UBO</p>
                  <p className="text-2xl font-bold text-red-600">4</p>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                Launch Ownership Bot
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Source of Funds Bot */}
          <Card className="border-2 border-green-400 bg-gradient-to-br from-green-50 to-green-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-10 h-10 text-white" />
                </div>
                <Badge className="bg-green-600 text-white">ENHANCED CDD</Badge>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">Source of Funds Verification Bot</h2>
              <p className="text-slate-300 mb-4">
                Transaction fund verification • Evidence analysis • Suspicious pattern detection
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Declared source capture & validation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Document evidence collection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Amount & timing validation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Suspicious pattern detection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Third-party funding alerts</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-[#1e293b] p-3 rounded border border-green-200 text-center">
                  <p className="text-xs text-green-700">Pending</p>
                  <p className="text-2xl font-bold text-blue-600">19</p>
                </div>
                <div className="bg-[#1e293b] p-3 rounded border border-green-200 text-center">
                  <p className="text-xs text-green-700">Verified</p>
                  <p className="text-2xl font-bold text-green-600">142</p>
                </div>
                <div className="bg-[#1e293b] p-3 rounded border border-green-200 text-center">
                  <p className="text-xs text-green-700">Flagged</p>
                  <p className="text-2xl font-bold text-red-600">7</p>
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg">
                Launch SOF Bot
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Source of Wealth Bot */}
          <Card className="border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Landmark className="w-10 h-10 text-white" />
                </div>
                <Badge className="bg-blue-600 text-white">HIGH-VALUE CDD</Badge>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">Source of Wealth Verification Bot</h2>
              <p className="text-slate-300 mb-4">
                Wealth accumulation validation • Plausibility assessment • Risk profiling
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Wealth narrative capture & analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Evidence validation workflow</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Wealth vs income reconciliation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Timeline & age plausibility checks</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Foreign wealth risk assessment</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-[#1e293b] p-3 rounded border border-blue-200 text-center">
                  <p className="text-xs text-blue-700">Pending</p>
                  <p className="text-2xl font-bold text-blue-600">14</p>
                </div>
                <div className="bg-[#1e293b] p-3 rounded border border-blue-200 text-center">
                  <p className="text-xs text-blue-700">Verified</p>
                  <p className="text-2xl font-bold text-green-600">98</p>
                </div>
                <div className="bg-[#1e293b] p-3 rounded border border-blue-200 text-center">
                  <p className="text-xs text-blue-700">High-Risk</p>
                  <p className="text-2xl font-bold text-red-600">5</p>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                Launch SOW Bot
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Court & Litigation Bot */}
          <Card className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Gavel className="w-10 h-10 text-white" />
                </div>
                <Badge className="bg-amber-600 text-white">LEGAL INTELLIGENCE</Badge>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">Court & Litigation Screening Bot</h2>
              <p className="text-slate-300 mb-4">
                Legal exposure detection • Insolvency monitoring • Enforcement tracking
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Court case & tribunal matter detection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Bankruptcy & liquidation screening</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Director ban & disqualification checks</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Enforcement action monitoring</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Active litigation risk assessment</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-[#1e293b] p-3 rounded border border-amber-200 text-center">
                  <p className="text-xs text-amber-700">Pending</p>
                  <p className="text-2xl font-bold text-blue-600">23</p>
                </div>
                <div className="bg-[#1e293b] p-3 rounded border border-amber-200 text-center">
                  <p className="text-xs text-amber-700">Matches</p>
                  <p className="text-2xl font-bold text-amber-600">34</p>
                </div>
                <div className="bg-[#1e293b] p-3 rounded border border-amber-200 text-center">
                  <p className="text-xs text-amber-700">Insolvency</p>
                  <p className="text-2xl font-bold text-red-600">8</p>
                </div>
              </div>

              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg">
                Launch Legal Bot
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tier 2 System Flow */}
        <Card className="mt-8 border-2 border-[#13B5EA] bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-[#13B5EA]" />
              Complete Tier 2 Compliance Flow
            </CardTitle>
            <CardDescription>Institution-grade enhanced due diligence workflow</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {[
                { label: 'KYB Complete', icon: CheckCircle, color: 'green' },
                { label: 'Ownership Mapped', icon: Network, color: 'purple' },
                { label: 'UBO Identified', icon: Users, color: 'purple' },
                { label: 'SOF Verified', icon: DollarSign, color: 'green' },
                { label: 'SOW Assessed', icon: Landmark, color: 'blue' },
                { label: 'Legal Screening', icon: Gavel, color: 'amber' },
                { label: 'Risk Decision', icon: Shield, color: 'cyan' }
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex items-center">
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-${step.color}-100 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-${step.color}-400`}>
                        <Icon className={`w-8 h-8 text-${step.color}-600`} />
                      </div>
                      <p className="text-xs font-medium text-slate-300">{step.label}</p>
                    </div>
                    {idx < 6 && (
                      <ArrowRight className="w-6 h-6 text-slate-400 mx-2" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-[#1e293b] rounded-lg border border-blue-200">
              <h4 className="font-bold text-white mb-2">Key Tier 2 Capabilities:</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300">
                <div>
                  <p className="font-semibold text-purple-900 mb-1">• Relationship Intelligence</p>
                  <p className="text-xs">Complete ownership chains, control structures, UBO identification</p>
                </div>
                <div>
                  <p className="font-semibold text-green-900 mb-1">• Financial Verification</p>
                  <p className="text-xs">Source of funds, source of wealth, evidence validation</p>
                </div>
                <div>
                  <p className="font-semibold text-amber-900 mb-1">• Legal Exposure</p>
                  <p className="text-xs">Court cases, insolvency, enforcement actions, director bans</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Tier 2 Achieves */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">What Tier 2 Achieves</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-white mb-2">Beyond Onboarding</h4>
                <p className="text-sm text-slate-300">
                  Continuous risk intelligence that evolves with relationships, not just point-in-time checks
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Network className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-white mb-2">Real Risk Intelligence</h4>
                <p className="text-sm text-slate-300">
                  Ownership mapping, wealth verification, legal exposure—complete compliance picture
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-bold text-white mb-2">Lending & Investment Ready</h4>
                <p className="text-sm text-slate-300">
                  Supports credit decisions, investor workflows, fiduciary duties with AUSTRAC Tranche 2 compliance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
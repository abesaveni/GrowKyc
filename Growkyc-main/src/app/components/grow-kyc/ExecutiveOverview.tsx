import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Shield,
  Users,
  TrendingUp,
  Network,
  FileText,
  Lock,
  AlertTriangle,
  CheckCircle,
  Building2,
  Scale,
  Landmark,
  Briefcase,
  Home,
  Eye,
  BarChart3,
  Activity,
  Layers,
  Database,
  Zap,
  Globe,
  ArrowRight,
  Sparkles,
  Command,
  Newspaper,
  Ban,
  Scan,
  CreditCard,
  DollarSign,
  Gavel,
  Brain,
  FileCheck
} from 'lucide-react';
import { Progress } from '../ui/progress';
import { LayerDetail } from './LayerDetail';
import { IndustryDetail } from './IndustryDetail';
import { PEPScreeningBot } from './PEPScreeningBot';
import { AdverseMediaBot } from './AdverseMediaBot';
import { SanctionsBot } from './SanctionsBot';
import { IdentityBot } from './IdentityBot';
import { KYBBot } from './KYBBot';
import { Tier2ComplianceHub } from './Tier2ComplianceHub';
import { Tier3DecisionEngine } from './Tier3DecisionEngine';
import { Tier4CommercialEngine } from './Tier4CommercialEngine';
import { Tier5EnterpriseOS } from './Tier5EnterpriseOS';

interface ExecutiveOverviewProps {
  onSelectRole: (role: any, userId?: string) => void;
  onViewArchitecture: () => void;
}

type DetailView = 'overview' | 'layer' | 'industry' | 'pep-bot' | 'adverse-media-bot' | 'sanctions-bot' | 'identity-bot' | 'kyb-bot' | 'tier2-hub' | 'tier3-engine' | 'tier4-commercial' | 'tier5-enterprise';

export function ExecutiveOverview({ onSelectRole, onViewArchitecture }: ExecutiveOverviewProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<DetailView>('overview');
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [selectedIndustryDetail, setSelectedIndustryDetail] = useState<string | null>(null);

  // If viewing layer detail
  if (currentView === 'layer' && selectedLayer) {
    return (
      <LayerDetail 
        layerId={selectedLayer}
        onBack={() => setCurrentView('overview')}
      />
    );
  }

  // If viewing industry detail
  if (currentView === 'industry' && selectedIndustryDetail) {
    return (
      <IndustryDetail 
        industryId={selectedIndustryDetail}
        onBack={() => setCurrentView('overview')}
      />
    );
  }

  // If viewing PEPScreeningBot
  if (currentView === 'pep-bot') {
    return (
      <PEPScreeningBot 
        onBack={() => setCurrentView('overview')}
      />
    );
  }

  // If viewing AdverseMediaBot
  if (currentView === 'adverse-media-bot') {
    return (
      <AdverseMediaBot 
        onBack={() => setCurrentView('overview')}
      />
    );
  }

  // If viewing SanctionsBot
  if (currentView === 'sanctions-bot') {
    return (
      <SanctionsBot 
        onBack={() => setCurrentView('overview')}
      />
    );
  }

  // If viewing IdentityBot
  if (currentView === 'identity-bot') {
    return (
      <IdentityBot 
        onBack={() => setCurrentView('overview')}
      />
    );
  }

  // If viewing KYBBot
  if (currentView === 'kyb-bot') {
    return (
      <KYBBot 
        onBack={() => setCurrentView('overview')}
      />
    );
  }

  // If viewing Tier2ComplianceHub
  if (currentView === 'tier2-hub') {
    return (
      <Tier2ComplianceHub 
        onBack={() => setCurrentView('overview')}
      />
    );
  }

  // If viewing Tier3DecisionEngine
  if (currentView === 'tier3-engine') {
    return (
      <Tier3DecisionEngine 
        onBack={() => setCurrentView('overview')}
      />
    );
  }

  // If viewing Tier4CommercialEngine
  if (currentView === 'tier4-commercial') {
    return (
      <Tier4CommercialEngine 
        onBack={() => setCurrentView('overview')}
      />
    );
  }

  // If viewing Tier5EnterpriseOS
  if (currentView === 'tier5-enterprise') {
    return (
      <Tier5EnterpriseOS 
        onBack={() => setCurrentView('overview')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0d121d]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(19,181,234,0.05) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
          <div className="text-center mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#13B5EA] to-[#0E7C9E] rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0 animate-bounce">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] bg-clip-text text-transparent">
                  Grow Compliance OS
                </h1>
                <p className="text-[#13B5EA] text-base sm:text-lg mt-1">Regulatory Operating System</p>
              </div>
            </div>
            
            <p className="text-lg sm:text-2xl text-slate-300 max-w-4xl mx-auto mb-6 px-2">
              Not a KYC tool. <span className="text-white font-semibold">Compliance infrastructure.</span>
            </p>
            
            <div className="flex items-center justify-center gap-2 flex-wrap max-w-3xl mx-auto">
              <Badge className="bg-green-100 text-green-700 border-green-300 px-3 py-1.5 text-xs sm:text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                AUSTRAC Tranche 2 Ready
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 border-blue-300 px-3 py-1.5 text-xs sm:text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                NCCP Compliant
              </Badge>
              <Badge className="bg-[#0a0e17] text-slate-300 border-gray-300 px-3 py-1.5 text-xs sm:text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                ASIC RG78 + RG271
              </Badge>
              <Badge className="bg-amber-100 text-amber-700 border-amber-300 px-3 py-1.5 text-xs sm:text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Multi-Tenant Enterprise
              </Badge>
            </div>
          </div>

          {/* 5 Layer Architecture */}
          <Card className="bg-[#0d121d] border-white/10 shadow-lg mb-12">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layers className="w-8 h-8 text-[#13B5EA] flex-shrink-0" />
                  <div>
                    <CardTitle className="text-white text-xl sm:text-2xl">5-Layer Architecture</CardTitle>
                    <CardDescription className="text-slate-300 text-xs sm:text-sm">
                      Modular, interconnected compliance infrastructure
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="border-gray-300 text-slate-300 hover:bg-white/5 w-full sm:w-auto justify-center"
                  onClick={onViewArchitecture}
                >
                  View Architecture
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Layer 1 */}
                <Card 
                  className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 hover:scale-105 transition-transform cursor-pointer shadow-md"
                  onClick={() => {
                    setSelectedLayer('client-entity');
                    setCurrentView('layer');
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-bold text-white mb-2">Client & Entity</h3>
                    <p className="text-xs text-slate-300 mb-3">
                      Onboarding • Ownership • Registry
                    </p>
                    <Button size="sm" variant="ghost" className="text-blue-700 hover:bg-blue-200 w-full">
                      Learn More →
                    </Button>
                  </CardContent>
                </Card>

                {/* Layer 2 */}
                <Card 
                  className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 hover:scale-105 transition-transform cursor-pointer shadow-md"
                  onClick={() => {
                    setSelectedLayer('risk-intelligence');
                    setCurrentView('layer');
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-bold text-white mb-2">Risk & Intelligence</h3>
                    <p className="text-xs text-slate-300 mb-3">
                      AI Risk • Graph • Monitoring
                    </p>
                    <Button size="sm" variant="ghost" className="text-purple-700 hover:bg-purple-200 w-full">
                      Learn More →
                    </Button>
                  </CardContent>
                </Card>

                {/* Layer 3 */}
                <Card 
                  className="bg-gradient-to-br from-green-50 to-green-100 border-green-300 hover:scale-105 transition-transform cursor-pointer shadow-md"
                  onClick={() => {
                    setSelectedLayer('compliance-workflow');
                    setCurrentView('layer');
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <Shield className="w-10 h-10 text-green-600 mx-auto mb-3" />
                    <h3 className="font-bold text-white mb-2">Compliance Workflow</h3>
                    <p className="text-xs text-slate-300 mb-3">
                      KYC • Cases • Hard Gates
                    </p>
                    <Button size="sm" variant="ghost" className="text-green-700 hover:bg-green-200 w-full">
                      Learn More →
                    </Button>
                  </CardContent>
                </Card>

                {/* Layer 4 */}
                <Card 
                  className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 hover:scale-105 transition-transform cursor-pointer shadow-md"
                  onClick={() => {
                    setSelectedLayer('governance-reporting');
                    setCurrentView('layer');
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <FileText className="w-10 h-10 text-amber-600 mx-auto mb-3" />
                    <h3 className="font-bold text-white mb-2">Governance & Reporting</h3>
                    <p className="text-xs text-slate-300 mb-3">
                      Breach • SMR • Audit
                    </p>
                    <Button size="sm" variant="ghost" className="text-amber-700 hover:bg-amber-200 w-full">
                      Learn More →
                    </Button>
                  </CardContent>
                </Card>

                {/* Layer 5 */}
                <Card 
                  className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-300 hover:scale-105 transition-transform cursor-pointer shadow-md"
                  onClick={() => {
                    setSelectedLayer('infrastructure');
                    setCurrentView('layer');
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <Network className="w-10 h-10 text-pink-600 mx-auto mb-3" />
                    <h3 className="font-bold text-white mb-2">Infrastructure & Integration</h3>
                    <p className="text-xs text-slate-300 mb-3">
                      API • Zero Trust • Evidence
                    </p>
                    <Button size="sm" variant="ghost" className="text-pink-700 hover:bg-pink-200 w-full">
                      Learn More →
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Industry Coverage */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Built For</h2>
            <p className="text-center text-slate-300 mb-8 max-w-2xl mx-auto">
              Click any industry to see how Grow Compliance OS solves your specific challenges
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                { icon: Building2, label: 'Accountants', color: 'blue' },
                { icon: Landmark, label: 'Credit Providers', color: 'green' },
                { icon: Shield, label: 'AFSL Holders', color: 'purple' },
                { icon: BarChart3, label: 'Fund Managers', color: 'amber' },
                { icon: Scale, label: 'Trustees', color: 'pink' },
                { icon: Briefcase, label: 'Legal Firms', color: 'indigo' },
                { icon: Home, label: 'Real Estate', color: 'teal' },
              ].map((industry) => {
                const Icon = industry.icon;
                return (
                  <Card 
                    key={industry.label}
                    className={`bg-[#0d121d] border-white/10 hover:border-[#13B5EA] hover:shadow-lg transition-all cursor-pointer ${selectedIndustry === industry.label ? 'ring-2 ring-[#13B5EA] shadow-lg' : ''}`}
                    onClick={() => {
                      setSelectedIndustryDetail(industry.label);
                      setCurrentView('industry');
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={`w-8 h-8 text-${industry.color}-600 mx-auto mb-2`} />
                      <p className="text-xs font-medium text-white mb-2">{industry.label}</p>
                      <Button size="sm" variant="ghost" className="text-xs text-[#13B5EA] hover:bg-blue-50 w-full">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Core Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-[#0d121d] border-white/10 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-white text-lg">Client Lifecycle</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Self-service onboarding
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Visual ownership mapping
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Continuous monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Periodic review automation
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#0d121d] border-white/10 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-white text-lg">Intelligence & Risk</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    AI risk scoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Graph intelligence
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Transaction monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Sanctions & PEP screening
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-[#0d121d] border-white/10 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-white text-lg">Evidence & Audit</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Evidence vault (SHA256)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    7-year retention
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Immutable audit trail
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Regulator-ready exports
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* AI PEP Screening Bot Feature */}
          <Card 
            className="mb-12 border-2 border-orange-400 bg-gradient-to-r from-orange-50 to-red-50 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            onClick={() => setCurrentView('pep-bot')}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-orange-600 text-white mb-2">NEW - AI POWERED</Badge>
                    <h2 className="text-3xl font-bold text-white mb-2">Global PEP Screening Bot</h2>
                    <p className="text-slate-300 text-lg mb-3">
                      AI-powered Politically Exposed Person screening with automated monthly monitoring
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>New client screening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Monthly global rescreening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Foreign PEP detection</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Family & associates</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>AUSTRAC compliant</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg">
                    Launch PEP Bot
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <p className="text-xs text-slate-300 mt-2">Click anywhere to explore</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adverse Media Bot Feature */}
          <Card 
            className="mb-12 border-2 border-red-400 bg-gradient-to-r from-red-50 to-orange-50 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            onClick={() => setCurrentView('adverse-media-bot')}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Newspaper className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-red-600 text-white mb-2">NEW - AI POWERED</Badge>
                    <h2 className="text-3xl font-bold text-white mb-2">Global Adverse Media Screening Bot</h2>
                    <p className="text-slate-300 text-lg mb-3">
                      AI-powered adverse media detection with fraud, insolvency & regulatory monitoring
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Financial crime detection</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Court & legal actions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Insolvency monitoring</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Regulatory enforcement</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Monthly rescreening</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white shadow-lg">
                    Launch Media Bot
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <p className="text-xs text-slate-300 mt-2">Click anywhere to explore</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sanctions Bot Feature */}
          <Card 
            className="mb-12 border-2 border-blue-400 bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            onClick={() => setCurrentView('sanctions-bot')}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Ban className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-blue-600 text-white mb-2">NEW - AI POWERED</Badge>
                    <h2 className="text-3xl font-bold text-white mb-2">Global Sanctions Screening Bot</h2>
                    <p className="text-slate-300 text-lg mb-3">
                      AI-powered sanctions screening with automated monthly monitoring
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>New client screening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Monthly global rescreening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Foreign sanctions detection</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Family & associates</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>AUSTRAC compliant</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                    Launch Sanctions Bot
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <p className="text-xs text-slate-300 mt-2">Click anywhere to explore</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identity Bot Feature */}
          <Card 
            className="mb-12 border-2 border-green-400 bg-gradient-to-r from-green-50 to-blue-50 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            onClick={() => setCurrentView('identity-bot')}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Scan className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-green-600 text-white mb-2">NEW - AI POWERED</Badge>
                    <h2 className="text-3xl font-bold text-white mb-2">Global Identity Verification Bot</h2>
                    <p className="text-slate-300 text-lg mb-3">
                      AI-powered identity verification with automated monthly monitoring
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>New client screening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Monthly global rescreening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Foreign identity detection</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Family & associates</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>AUSTRAC compliant</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
                    Launch Identity Bot
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <p className="text-xs text-slate-300 mt-2">Click anywhere to explore</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KYB Bot Feature */}
          <Card 
            className="mb-12 border-2 border-purple-400 bg-gradient-to-r from-purple-50 to-blue-50 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            onClick={() => setCurrentView('kyb-bot')}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <CreditCard className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-purple-600 text-white mb-2">NEW - AI POWERED</Badge>
                    <h2 className="text-3xl font-bold text-white mb-2">Global KYB Screening Bot</h2>
                    <p className="text-slate-300 text-lg mb-3">
                      AI-powered KYB screening with automated monthly monitoring
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>New client screening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Monthly global rescreening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Foreign KYB detection</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Family & associates</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>AUSTRAC compliant</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
                    Launch KYB Bot
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <p className="text-xs text-slate-300 mt-2">Click anywhere to explore</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TIER 2 - Enhanced Due Diligence Hub */}
          <Card 
            className="mb-12 border-4 border-amber-500 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentView('tier2-hub')}
          >
            <CardContent className="p-10">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Network className="w-14 h-14 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-amber-600 text-white mb-3 text-sm px-4 py-1">TIER 2 - INSTITUTION GRADE</Badge>
                    <h2 className="text-4xl font-bold text-white mb-3">Enhanced Due Diligence Hub</h2>
                    <p className="text-slate-300 text-xl mb-4">
                      Beyond onboarding • Real risk intelligence • AUSTRAC Tranche 2 compliance
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-purple-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Network className="w-5 h-5 text-purple-600" />
                          <p className="font-bold text-purple-900">Beneficial Ownership Bot</p>
                        </div>
                        <p className="text-xs text-slate-300">UBO identification • Ownership mapping • Tranche 2 ready</p>
                      </div>
                      <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-green-300">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <p className="font-bold text-green-900">Source of Funds Bot</p>
                        </div>
                        <p className="text-xs text-slate-300">Fund verification • Evidence validation • Pattern detection</p>
                      </div>
                      <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-blue-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Landmark className="w-5 h-5 text-blue-600" />
                          <p className="font-bold text-blue-900">Source of Wealth Bot</p>
                        </div>
                        <p className="text-xs text-slate-300">Wealth validation • Plausibility assessment • High-value CDD</p>
                      </div>
                      <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-amber-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Gavel className="w-5 h-5 text-amber-600" />
                          <p className="font-bold text-amber-900">Court & Litigation Bot</p>
                        </div>
                        <p className="text-xs text-slate-300">Legal exposure • Insolvency • Enforcement tracking</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Complete ownership chains</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Financial verification</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Legal intelligence</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Lending & investment ready</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-2xl px-8 py-6 text-lg">
                    Enter Tier 2 Hub
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                  <p className="text-xs text-slate-300 mt-3">Institution-grade compliance</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border-2 border-purple-300">
                <p className="text-sm text-white">
                  <strong>What Makes Tier 2 Different:</strong> Not just onboarding verification—continuous risk intelligence with ownership mapping, financial verification, and legal exposure monitoring. Supports lending, investment decisions, and fiduciary workflows.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* TIER 3 - Decision Engine */}
          <Card 
            className="mb-12 border-4 border-amber-500 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentView('tier3-engine')}
          >
            <CardContent className="p-10">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Network className="w-14 h-14 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-amber-600 text-white mb-3 text-sm px-4 py-1">TIER 3 - AUTOMATED DECISIONS</Badge>
                    <h2 className="text-4xl font-bold text-white mb-3">Decision Engine</h2>
                    <p className="text-slate-300 text-xl mb-4">
                      Automated risk assessment • Real-time decisioning • AUSTRAC Tranche 2 compliance
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-purple-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Network className="w-5 h-5 text-purple-600" />
                          <p className="font-bold text-purple-900">Beneficial Ownership Bot</p>
                        </div>
                        <p className="text-xs text-slate-300">UBO identification • Ownership mapping • Tranche 2 ready</p>
                      </div>
                      <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-green-300">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <p className="font-bold text-green-900">Source of Funds Bot</p>
                        </div>
                        <p className="text-xs text-slate-300">Fund verification • Evidence validation • Pattern detection</p>
                      </div>
                      <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-blue-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Landmark className="w-5 h-5 text-blue-600" />
                          <p className="font-bold text-blue-900">Source of Wealth Bot</p>
                        </div>
                        <p className="text-xs text-slate-300">Wealth validation • Plausibility assessment • High-value CDD</p>
                      </div>
                      <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-amber-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Gavel className="w-5 h-5 text-amber-600" />
                          <p className="font-bold text-amber-900">Court & Litigation Bot</p>
                        </div>
                        <p className="text-xs text-slate-300">Legal exposure • Insolvency • Enforcement tracking</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Complete ownership chains</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Financial verification</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Legal intelligence</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Lending & investment ready</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-2xl px-8 py-6 text-lg">
                    Enter Tier 3 Engine
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                  <p className="text-xs text-slate-300 mt-3">Institution-grade compliance</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border-2 border-purple-300">
                <p className="text-sm text-white">
                  <strong>What Makes Tier 3 Different:</strong> Not just onboarding verification—continuous risk intelligence with ownership mapping, financial verification, and legal exposure monitoring. Supports lending, investment decisions, and fiduciary workflows.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* TIER 4 - Commercial Engine */}
          <Card 
            className="mb-12 border-4 border-amber-500 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentView('tier4-commercial')}
          >
            <CardContent className="p-10">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Network className="w-14 h-14 text-white" />
                  </div>
                  <div>
                    <Badge className="bg-amber-600 text-white mb-3 text-sm px-4 py-1">TIER 4 - COMMERCIAL ENGINE</Badge>
                    <h2 className="text-4xl font-bold text-white mb-3">Commercial Engine</h2>
                    <p className="text-slate-300 text-xl mb-4">
                      Automated risk assessment • Real-time decisioning • AUSTRAC Tranche 2 compliance
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-purple-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Network className="w-5 h-5 text-purple-600" />
                          <p className="font-bold text-purple-900">Beneficial Ownership Bot</p>
                        </div>
                        <p className="text-xs text-slate-300">UBO identification • Ownership mapping • Tranche 2 ready</p>
                      </div>
                      <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-green-300">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <p className="font-bold text-green-900">Source of Funds Bot</p>
                        </div>
                        <p className="text-xs text-slate-300">Fund verification • Evidence validation • Pattern detection</p>
                      </div>
                      <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-blue-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Landmark className="w-5 h-5 text-blue-600" />
                          <p className="font-bold text-blue-900">Source of Wealth Bot</p>
                        </div>
                        <p className="text-xs text-slate-300">Wealth validation • Plausibility assessment • High-value CDD</p>
                      </div>
                      <div className="bg-[#0d121d] p-4 rounded-lg border-2 border-amber-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Gavel className="w-5 h-5 text-amber-600" />
                          <p className="font-bold text-amber-900">Court & Litigation Bot</p>
                        </div>
                        <p className="text-xs text-slate-300">Legal exposure • Insolvency • Enforcement tracking</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Complete ownership chains</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Financial verification</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Legal intelligence</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Lending & investment ready</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-2xl px-8 py-6 text-lg">
                    Enter Tier 4 Engine
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                  <p className="text-xs text-slate-300 mt-3">Institution-grade compliance</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border-2 border-purple-300">
                <p className="text-sm text-white">
                  <strong>What Makes Tier 4 Different:</strong> Not just onboarding verification—continuous risk intelligence with ownership mapping, financial verification, and legal exposure monitoring. Supports lending, investment decisions, and fiduciary workflows.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Role Selection */}
          <Card className="bg-[#0d121d] border-white/10 shadow-xl overflow-hidden rounded-2xl border-t-4 border-t-[#13B5EA]">
            <CardHeader className="bg-gray-50/50 pb-6 border-b border-white/10">
              <CardTitle className="text-white text-3xl font-extrabold text-center tracking-tight">Select Your Workspace Persona</CardTitle>
              <CardDescription className="text-slate-300 text-center text-base max-w-2xl mx-auto mt-2">
                Gain instant, dynamic access to role-tailored workflows, dynamic risk policies, and custom compliance features.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 bg-[#0d121d] space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. Head of Compliance */}
                <Card 
                  className="bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border-blue-200/80 hover:border-blue-400 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  onClick={() => onSelectRole('compliance_officer', 'sarah_chen')}
                >
                  <CardContent className="p-6 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-200 shadow-sm">
                        <Shield className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Head of Compliance</h3>
                      <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                        Full regulatory oversight, external audit trails, live policy management, and compliance program validation.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 font-semibold text-xs"
                    >
                      Access Head Portal
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </CardContent>
                </Card>

                {/* 2. Compliance Officer */}
                <Card 
                  className="bg-gradient-to-br from-cyan-50/70 to-blue-50/40 border-cyan-200/80 hover:border-cyan-400 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  onClick={() => onSelectRole('compliance_officer', 'emma_williams')}
                >
                  <CardContent className="p-6 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <div className="w-14 h-14 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-200 shadow-sm">
                        <Users className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Compliance Officer</h3>
                      <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                        KYC validation queues, customer risk profiling, case escalations, and day-to-day operations workbench.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-100 font-semibold text-xs"
                    >
                      Access Officer Portal
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </CardContent>
                </Card>

                {/* 3. Managing Partner */}
                <Card 
                  className="bg-gradient-to-br from-purple-50/70 to-pink-50/40 border-purple-200/80 hover:border-purple-400 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  onClick={() => onSelectRole('partner', 'michael_roberts')}
                >
                  <CardContent className="p-6 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-200 shadow-sm">
                        <Users className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Managing Partner</h3>
                      <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                        Executive-level risk reporting, dual-control sign-offs, and critical escalated approvals workspace.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-purple-300 text-purple-700 hover:bg-purple-100 font-semibold text-xs"
                    >
                      Access Partner Portal
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </CardContent>
                </Card>

              </div>

              {/* Dropdown Selector for Other Personas */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/60 p-5 rounded-2xl border border-gray-150">
                <div className="text-left flex-1">
                  <h4 className="font-bold text-white text-base">Looking for other personas?</h4>
                  <p className="text-sm text-slate-300 mt-1">Select from the additional compliance workspaces we are building to explore their specific toolsets.</p>
                </div>
                <div className="w-full md:w-80">
                  <select 
                    className="block w-full px-4 py-2.5 text-sm text-slate-300 bg-[#0d121d] border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#13B5EA] focus:border-[#13B5EA]"
                    defaultValue=""
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      const [role, userId] = val.split(':');
                      onSelectRole(role, userId);
                    }}
                  >
                    <option value="" disabled>Select other workspace persona...</option>
                    <option value="analyst:alex_rivera">AML Analyst (Alert queues & screening)</option>
                    <option value="auditor:david_thompson">Internal Auditor (Audit & evidence vault)</option>
                    <option value="compliance_officer:jessica_lee">Senior Compliance Officer (KYB & EDD)</option>
                    <option value="partner:robert_kim">Risk Partner (Risk frameworks & strategy)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Global Ready */}
          <div className="mt-12 text-center px-4">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-lg block w-full max-w-3xl mx-auto">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                  <Globe className="w-12 h-12 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">Multi-Jurisdiction Regulatory Engine</h3>
                    <p className="text-sm text-slate-300">
                      Australia • UK • EU • US • APAC • Visual Rule Builder • FATF Alignment
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-300 md:ml-auto flex-shrink-0 mt-2 md:mt-0">
                    <Zap className="w-4 h-4 mr-1" />
                    Enterprise Ready
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
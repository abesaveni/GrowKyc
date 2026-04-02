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
  onSelectRole: (role: any) => void;
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(19,181,234,0.05) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        
        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#13B5EA] to-[#0E7C9E] rounded-2xl flex items-center justify-center shadow-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] bg-clip-text text-transparent">
                  Grow Compliance OS
                </h1>
                <p className="text-[#13B5EA] text-lg mt-1">Regulatory Operating System</p>
              </div>
            </div>
            
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto mb-4">
              Not a KYC tool. <span className="text-gray-900 font-semibold">Compliance infrastructure.</span>
            </p>
            
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Badge className="bg-green-100 text-green-700 border-green-300 px-4 py-2 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                AUSTRAC Tranche 2 Ready
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 border-blue-300 px-4 py-2 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                NCCP Compliant
              </Badge>
              <Badge className="bg-gray-100 text-gray-700 border-gray-300 px-4 py-2 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                ASIC RG78 + RG271
              </Badge>
              <Badge className="bg-amber-100 text-amber-700 border-amber-300 px-4 py-2 text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Multi-Tenant Enterprise
              </Badge>
            </div>
          </div>

          {/* 5 Layer Architecture */}
          <Card className="bg-white border-gray-200 shadow-lg mb-12">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layers className="w-8 h-8 text-[#13B5EA]" />
                  <div>
                    <CardTitle className="text-gray-900 text-2xl">5-Layer Architecture</CardTitle>
                    <CardDescription className="text-gray-600">
                      Modular, interconnected compliance infrastructure
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
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
                    <h3 className="font-bold text-gray-900 mb-2">Client & Entity</h3>
                    <p className="text-xs text-gray-600 mb-3">
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
                    <h3 className="font-bold text-gray-900 mb-2">Risk & Intelligence</h3>
                    <p className="text-xs text-gray-600 mb-3">
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
                    <h3 className="font-bold text-gray-900 mb-2">Compliance Workflow</h3>
                    <p className="text-xs text-gray-600 mb-3">
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
                    <h3 className="font-bold text-gray-900 mb-2">Governance & Reporting</h3>
                    <p className="text-xs text-gray-600 mb-3">
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
                    <h3 className="font-bold text-gray-900 mb-2">Infrastructure & Integration</h3>
                    <p className="text-xs text-gray-600 mb-3">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Built For</h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
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
                    className={`bg-white border-gray-200 hover:border-[#13B5EA] hover:shadow-lg transition-all cursor-pointer ${selectedIndustry === industry.label ? 'ring-2 ring-[#13B5EA] shadow-lg' : ''}`}
                    onClick={() => {
                      setSelectedIndustryDetail(industry.label);
                      setCurrentView('industry');
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={`w-8 h-8 text-${industry.color}-600 mx-auto mb-2`} />
                      <p className="text-xs font-medium text-gray-900 mb-2">{industry.label}</p>
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
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Client Lifecycle</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
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

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Intelligence & Risk</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
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

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Evidence & Audit</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Global PEP Screening Bot</h2>
                    <p className="text-gray-700 text-lg mb-3">
                      AI-powered Politically Exposed Person screening with automated monthly monitoring
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>New client screening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Monthly global rescreening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Foreign PEP detection</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Family & associates</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
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
                  <p className="text-xs text-gray-600 mt-2">Click anywhere to explore</p>
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Global Adverse Media Screening Bot</h2>
                    <p className="text-gray-700 text-lg mb-3">
                      AI-powered adverse media detection with fraud, insolvency & regulatory monitoring
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Financial crime detection</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Court & legal actions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Insolvency monitoring</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Regulatory enforcement</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
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
                  <p className="text-xs text-gray-600 mt-2">Click anywhere to explore</p>
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Global Sanctions Screening Bot</h2>
                    <p className="text-gray-700 text-lg mb-3">
                      AI-powered sanctions screening with automated monthly monitoring
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>New client screening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Monthly global rescreening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Foreign sanctions detection</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Family & associates</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
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
                  <p className="text-xs text-gray-600 mt-2">Click anywhere to explore</p>
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Global Identity Verification Bot</h2>
                    <p className="text-gray-700 text-lg mb-3">
                      AI-powered identity verification with automated monthly monitoring
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>New client screening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Monthly global rescreening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Foreign identity detection</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Family & associates</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
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
                  <p className="text-xs text-gray-600 mt-2">Click anywhere to explore</p>
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Global KYB Screening Bot</h2>
                    <p className="text-gray-700 text-lg mb-3">
                      AI-powered KYB screening with automated monthly monitoring
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>New client screening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Monthly global rescreening</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Foreign KYB detection</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Family & associates</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
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
                  <p className="text-xs text-gray-600 mt-2">Click anywhere to explore</p>
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
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">Enhanced Due Diligence Hub</h2>
                    <p className="text-gray-700 text-xl mb-4">
                      Beyond onboarding • Real risk intelligence • AUSTRAC Tranche 2 compliance
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white p-4 rounded-lg border-2 border-purple-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Network className="w-5 h-5 text-purple-600" />
                          <p className="font-bold text-purple-900">Beneficial Ownership Bot</p>
                        </div>
                        <p className="text-xs text-gray-600">UBO identification • Ownership mapping • Tranche 2 ready</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <p className="font-bold text-green-900">Source of Funds Bot</p>
                        </div>
                        <p className="text-xs text-gray-600">Fund verification • Evidence validation • Pattern detection</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Landmark className="w-5 h-5 text-blue-600" />
                          <p className="font-bold text-blue-900">Source of Wealth Bot</p>
                        </div>
                        <p className="text-xs text-gray-600">Wealth validation • Plausibility assessment • High-value CDD</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-2 border-amber-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Gavel className="w-5 h-5 text-amber-600" />
                          <p className="font-bold text-amber-900">Court & Litigation Bot</p>
                        </div>
                        <p className="text-xs text-gray-600">Legal exposure • Insolvency • Enforcement tracking</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Complete ownership chains</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Financial verification</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Legal intelligence</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
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
                  <p className="text-xs text-gray-600 mt-3">Institution-grade compliance</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border-2 border-purple-300">
                <p className="text-sm text-gray-800">
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
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">Decision Engine</h2>
                    <p className="text-gray-700 text-xl mb-4">
                      Automated risk assessment • Real-time decisioning • AUSTRAC Tranche 2 compliance
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white p-4 rounded-lg border-2 border-purple-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Network className="w-5 h-5 text-purple-600" />
                          <p className="font-bold text-purple-900">Beneficial Ownership Bot</p>
                        </div>
                        <p className="text-xs text-gray-600">UBO identification • Ownership mapping • Tranche 2 ready</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <p className="font-bold text-green-900">Source of Funds Bot</p>
                        </div>
                        <p className="text-xs text-gray-600">Fund verification • Evidence validation • Pattern detection</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Landmark className="w-5 h-5 text-blue-600" />
                          <p className="font-bold text-blue-900">Source of Wealth Bot</p>
                        </div>
                        <p className="text-xs text-gray-600">Wealth validation • Plausibility assessment • High-value CDD</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-2 border-amber-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Gavel className="w-5 h-5 text-amber-600" />
                          <p className="font-bold text-amber-900">Court & Litigation Bot</p>
                        </div>
                        <p className="text-xs text-gray-600">Legal exposure • Insolvency • Enforcement tracking</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Complete ownership chains</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Financial verification</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Legal intelligence</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
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
                  <p className="text-xs text-gray-600 mt-3">Institution-grade compliance</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border-2 border-purple-300">
                <p className="text-sm text-gray-800">
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
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">Commercial Engine</h2>
                    <p className="text-gray-700 text-xl mb-4">
                      Automated risk assessment • Real-time decisioning • AUSTRAC Tranche 2 compliance
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white p-4 rounded-lg border-2 border-purple-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Network className="w-5 h-5 text-purple-600" />
                          <p className="font-bold text-purple-900">Beneficial Ownership Bot</p>
                        </div>
                        <p className="text-xs text-gray-600">UBO identification • Ownership mapping • Tranche 2 ready</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <p className="font-bold text-green-900">Source of Funds Bot</p>
                        </div>
                        <p className="text-xs text-gray-600">Fund verification • Evidence validation • Pattern detection</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Landmark className="w-5 h-5 text-blue-600" />
                          <p className="font-bold text-blue-900">Source of Wealth Bot</p>
                        </div>
                        <p className="text-xs text-gray-600">Wealth validation • Plausibility assessment • High-value CDD</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border-2 border-amber-300">
                        <div className="flex items-center gap-2 mb-2">
                          <Gavel className="w-5 h-5 text-amber-600" />
                          <p className="font-bold text-amber-900">Court & Litigation Bot</p>
                        </div>
                        <p className="text-xs text-gray-600">Legal exposure • Insolvency • Enforcement tracking</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Complete ownership chains</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Financial verification</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">Legal intelligence</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
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
                  <p className="text-xs text-gray-600 mt-3">Institution-grade compliance</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border-2 border-purple-300">
                <p className="text-sm text-gray-800">
                  <strong>What Makes Tier 4 Different:</strong> Not just onboarding verification—continuous risk intelligence with ownership mapping, financial verification, and legal exposure monitoring. Supports lending, investment decisions, and fiduciary workflows.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Role Selection */}
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 text-2xl text-center">Select Your Role</CardTitle>
              <CardDescription className="text-gray-600 text-center">
                Access role-specific dashboards and workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card 
                  className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 hover:scale-105 transition-transform cursor-pointer shadow-md"
                  onClick={() => onSelectRole('compliance_officer')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-blue-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Compliance Officer</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      AML/CTF oversight & case management
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-400 text-blue-700 hover:bg-blue-200"
                    >
                      Enter Portal
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card 
                  className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 hover:scale-105 transition-transform cursor-pointer shadow-md"
                  onClick={() => onSelectRole('partner')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-purple-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Partner / Executive</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Portfolio oversight & approvals
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full border-purple-400 text-purple-700 hover:bg-purple-200"
                    >
                      Enter Portal
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card 
                  className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 hover:scale-105 transition-transform cursor-pointer shadow-md"
                  onClick={() => onSelectRole('auditor')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-8 h-8 text-amber-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Auditor</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Audit trail & evidence inspection
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full border-amber-400 text-amber-700 hover:bg-amber-200"
                    >
                      Enter Portal
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card 
                  className="bg-gradient-to-br from-green-50 to-green-100 border-green-300 hover:scale-105 transition-transform cursor-pointer shadow-md"
                  onClick={() => onSelectRole('analyst')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-green-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">AML Analyst</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Monitoring & investigation
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full border-green-400 text-green-700 hover:bg-green-200"
                    >
                      Enter Portal
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Global Ready */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-lg inline-block">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Globe className="w-12 h-12 text-blue-600" />
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 text-lg">Multi-Jurisdiction Regulatory Engine</h3>
                    <p className="text-sm text-gray-600">
                      Australia • UK • EU • US • APAC • Visual Rule Builder • FATF Alignment
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-300 ml-4">
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
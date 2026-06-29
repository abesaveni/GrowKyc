import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Network,
  FileText,
  Zap,
  Landmark,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  Scale,
  Gavel,
  Home,
  Rocket
} from 'lucide-react';
import { BeneficialOwnershipMapper } from './BeneficialOwnershipMapper';
import { ProposalEngagementModule } from './ProposalEngagementModule';
import { PracticeIntegrations } from './PracticeIntegrations';
import { CreditProvidersModule } from './CreditProvidersModule';
import { AFSLHoldersModule } from './AFSLHoldersModule';
import { FundManagersModule } from './FundManagersModule';
import { TrusteesModule } from './TrusteesModule';
import { LegalFirmsModule } from './LegalFirmsModule';
import { RealEstateModule } from './RealEstateModule';

interface FeatureModulesProps {
  onBack: () => void;
}

export function FeatureModules({ onBack }: FeatureModulesProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules = [
    {
      id: 'beneficial-ownership',
      name: 'Beneficial Ownership Mapper',
      description: 'Visual ownership graphs • UBO detection • Layered tracing',
      icon: Network,
      color: 'from-slate-800 to-slate-700',
      phase: 'Phase 1',
      status: 'built',
      features: [
        'Visual ownership graphs',
        'Ultimate Beneficial Owner (UBO) detection',
        'Layered ownership tracing',
        'Entity group mapping',
        'Ownership percentage tracking',
        'Controller role identification'
      ],
      stats: { label: 'Entities Mapped', value: '4' }
    },
    {
      id: 'proposal-engagement',
      name: 'Proposal & Engagement',
      description: 'Create proposals • Capture payments • Automate engagement',
      icon: FileText,
      color: 'from-slate-800 to-slate-700',
      phase: 'Phase 1',
      status: 'built',
      features: [
        'Proposal builder with service templates',
        'Grouped engagement letters',
        'Digital signature integration',
        'Payment collection (Stripe)',
        'Upfront, deposit, recurring payments',
        'Failed payment reminders'
      ],
      stats: { label: 'Active Proposals', value: '4' }
    },
    {
      id: 'practice-integrations',
      name: 'Practice Integrations',
      description: 'Connect practice tools • Automate workflows • Sync data',
      icon: Zap,
      color: 'from-slate-800 to-slate-700',
      phase: 'Phase 1',
      status: 'built',
      features: [
        'Xero Practice Manager sync',
        'FYI Docs integration',
        'Xero Accounting integration',
        'Microsoft 365 integration',
        'Automated workflow rules',
        'RESTful API platform'
      ],
      stats: { label: 'Active Integrations', value: '4' }
    },
    {
      id: 'credit-providers',
      name: 'Credit Providers Vertical',
      description: 'Lender KYC • Pre-settlement compliance • Deal management',
      icon: Landmark,
      color: 'from-slate-800 to-slate-700',
      phase: 'Phase 2',
      status: 'built',
      features: [
        'Borrower & guarantor KYC',
        'Pre-settlement compliance gate',
        'Loan-specific risk assessment',
        'LOS integration framework',
        'Security party onboarding',
        'Lender-grade audit packs'
      ],
      stats: { label: 'Active Deals', value: '4' }
    },
    {
      id: 'afsl-holders',
      name: 'AFSL Holders Vertical',
      description: 'Financial adviser KYC • Investor classification • Advice compliance',
      icon: Briefcase,
      color: 'from-slate-800 to-slate-700',
      phase: 'Phase 3',
      status: 'built',
      features: [
        'Retail vs wholesale classification',
        'Investor eligibility capture',
        'Adviser workflow assignment',
        'Source of wealth for investors',
        'Fee consent and advice engagement',
        'Ongoing client review cycle'
      ],
      stats: { label: 'Active Clients', value: '5' }
    },
    {
      id: 'fund-managers',
      name: 'Fund Managers Vertical',
      description: 'Investor onboarding • Subscription approval • Registry management',
      icon: TrendingUp,
      color: 'from-slate-800 to-slate-700',
      phase: 'Phase 3',
      status: 'built',
      features: [
        'Investor onboarding (individual & entity)',
        'Trust and company ownership tracing',
        'UBO checks (25%+ threshold)',
        'Subscription document workflow',
        'Trustee and manager approval',
        'Ongoing investor monitoring'
      ],
      stats: { label: 'Active Investors', value: '4' }
    },
    {
      id: 'trustees',
      name: 'Trustees Vertical',
      description: 'Trust deed parsing • Authority verification • Control mapping',
      icon: Scale,
      color: 'from-slate-800 to-slate-700',
      phase: 'Phase 4',
      status: 'built',
      features: [
        'Trust deed capture and parsing',
        'Appointor and controller capture',
        'Beneficiary class capture',
        'Authorised signatory workflow',
        'Evidence of authority to act',
        'Ongoing control-change monitoring'
      ],
      stats: { label: 'Active Trusts', value: '4' }
    },
    {
      id: 'legal-firms',
      name: 'Legal Firms Vertical',
      description: 'Matter-based KYC • Source of funds • Compliance partner review',
      icon: Gavel,
      color: 'from-slate-800 to-slate-700',
      phase: 'Phase 4',
      status: 'built',
      features: [
        'Matter intake before file opening',
        'Matter purpose capture',
        'Jurisdiction and sanctions screening',
        'Counterparty capture',
        'Trust account risk controls',
        'Compliance partner escalation'
      ],
      stats: { label: 'Active Matters', value: '4' }
    },
    {
      id: 'real-estate',
      name: 'Real Estate Vertical',
      description: 'Transaction-based KYC • Offshore buyer screening • Settlement gates',
      icon: Home,
      color: 'from-slate-800 to-slate-700',
      phase: 'Phase 4',
      status: 'built',
      features: [
        'Seller and buyer KYC',
        'Landlord and tenant onboarding',
        'Company and trust buyer verification',
        'Property-specific transaction record',
        'Offshore buyer risk rules',
        'Settlement readiness status'
      ],
      stats: { label: 'Active Transactions', value: '4' }
    }
  ];

  const builtCount = modules.filter(m => m.status === 'built').length;
  const plannedCount = modules.filter(m => m.status === 'planned').length;

  // Render selected module
  if (selectedModule === 'beneficial-ownership') {
    return <BeneficialOwnershipMapper onBack={() => setSelectedModule(null)} />;
  }
  if (selectedModule === 'proposal-engagement') {
    return <ProposalEngagementModule onBack={() => setSelectedModule(null)} />;
  }
  if (selectedModule === 'practice-integrations') {
    return <PracticeIntegrations onBack={() => setSelectedModule(null)} />;
  }
  if (selectedModule === 'credit-providers') {
    return <CreditProvidersModule onBack={() => setSelectedModule(null)} />;
  }
  if (selectedModule === 'afsl-holders') {
    return <AFSLHoldersModule onBack={() => setSelectedModule(null)} />;
  }
  if (selectedModule === 'fund-managers') {
    return <FundManagersModule onBack={() => setSelectedModule(null)} />;
  }
  if (selectedModule === 'trustees') {
    return <TrusteesModule onBack={() => setSelectedModule(null)} />;
  }
  if (selectedModule === 'legal-firms') {
    return <LegalFirmsModule onBack={() => setSelectedModule(null)} />;
  }
  if (selectedModule === 'real-estate') {
    return <RealEstateModule onBack={() => setSelectedModule(null)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white px-8 py-12">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">Feature Modules</h1>
            <p className="text-white/90 text-xl">All 4 Phases Complete • Multi-Vertical Platform • 7 Industries Live</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Built Modules</div>
            </div>
            <div className="text-4xl font-bold mb-1">{builtCount}</div>
            <div className="text-xs text-white/70">All 4 phases complete</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Planned Modules</div>
            </div>
            <div className="text-4xl font-bold mb-1">{plannedCount}</div>
            <div className="text-xs text-white/70">Phase 3 & 4</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Verticals</div>
            </div>
            <div className="text-4xl font-bold mb-1">7</div>
            <div className="text-xs text-white/70">Industry verticals</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">ARR Potential</div>
            </div>
            <div className="text-4xl font-bold mb-1">$40M</div>
            <div className="text-xs text-white/70">Multi-vertical strategy</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Phase 1 & 2 - Built Modules */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">All Modules: COMPLETE ✅</h2>
              <p className="text-gray-600">9 modules across 7 industries • Full multi-vertical compliance OS</p>
            </div>
            <Badge className="bg-green-600 text-white text-lg px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              {builtCount} Modules Built
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {modules.filter(m => m.status === 'built').map((module) => {
              const ModuleIcon = module.icon;
              return (
                <Card
                  key={module.id}
                  className="border-2 border-green-200 bg-gray-50 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => setSelectedModule(module.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-20 h-20 bg-gradient-to-br ${module.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                          <ModuleIcon className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">{module.name}</h3>
                            <Badge className="bg-green-600 text-white">
                              {module.phase}
                            </Badge>
                            <Badge className="bg-blue-600 text-white">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Built
                            </Badge>
                          </div>
                          <p className="text-gray-700 mb-4 text-lg">{module.description}</p>
                          
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            {module.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-gray-600">{module.stats.label}:</span>
                              <span className="font-bold text-gray-900">{module.stats.value}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-6">
                        <Button size="lg">
                          Open Module →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Phase 3 & 4 - Planned Modules */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Phase 3 & 4: Planned Modules 🚧</h2>
              <p className="text-gray-600">Additional verticals for multi-industry expansion</p>
            </div>
            <Badge className="bg-amber-600 text-white text-lg px-4 py-2">
              <AlertCircle className="w-4 h-4 mr-2" />
              {plannedCount} Modules Planned
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {modules.filter(m => m.status === 'planned').map((module) => {
              const ModuleIcon = module.icon;
              return (
                <Card
                  key={module.id}
                  className="border-2 border-gray-200 opacity-75 hover:opacity-100 transition-opacity"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <ModuleIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{module.name}</h3>
                          <Badge variant="outline">{module.phase}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{module.description}</p>
                        
                        <div className="space-y-1 mb-3">
                          {module.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                              <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Badge className="bg-amber-600 text-white">
                          Coming Soon
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Implementation Timeline */}
        <Card className="mt-12 bg-gray-50 border-2 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-indigo-600" />
              Implementation Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-32 font-bold text-indigo-600">Phase 1</div>
                <div className="flex-1 h-3 bg-green-600 rounded-full"></div>
                <div className="w-40 text-sm text-gray-600">Complete (Accountants)</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 font-bold text-purple-600">Phase 2</div>
                <div className="flex-1 h-3 bg-green-600 rounded-full"></div>
                <div className="w-40 text-sm text-gray-600">Complete (Credit)</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 font-bold text-pink-600">Phase 3</div>
                <div className="flex-1 h-3 bg-green-600 rounded-full"></div>
                <div className="w-40 text-sm text-gray-600">Complete (AFSL + Funds)</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 font-bold text-red-600">Phase 4</div>
                <div className="flex-1 h-3 bg-green-600 rounded-full"></div>
                <div className="w-40 text-sm text-gray-600">Complete (Legal + RE + Trustees)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
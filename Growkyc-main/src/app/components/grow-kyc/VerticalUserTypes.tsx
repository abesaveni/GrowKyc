import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  CheckCircle,
  Building2,
  Landmark,
  Briefcase,
  TrendingUp,
  Scale,
  Gavel,
  Home,
  Users,
  DollarSign,
  Target,
  Zap,
  FileCheck,
  Clock,
  AlertCircle,
  Shield,
  Globe,
  Rocket,
  Star,
  ChevronRight,
  Network,
  FileText
} from 'lucide-react';

interface VerticalUserTypesProps {
  onBack: () => void;
}

export function VerticalUserTypes({ onBack }: VerticalUserTypesProps) {
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);

  const verticals = [
    {
      id: 'accountants',
      name: 'Accountants',
      icon: Building2,
      color: 'from-blue-600 to-cyan-600',
      status: 'Built',
      marketSize: '40,000+ firms in Australia, 150,000+ APAC',
      mainUseCase: 'Client onboarding, annual re-engagement, tax and advisory compliance, Tranche 2 readiness',
      pricing: '$50-80 per client per year',
      targetCustomers: '2,000 firms by 2027',
      arrPotential: '$8M-$12M',
      keyNeeds: [
        'Individual, company, trust, SMSF, partnership onboarding',
        'Family group onboarding (one flow for entire group)',
        'Engagement letters by entity or group',
        'Annual re-engagement automation',
        'ATO and TPB style identity support',
        'Ethical clearance workflow',
        'Practice management sync (XPM, FYI, MYOB)',
        'Document writeback to FYI Docs',
        'Job creation in XPM'
      ],
      integrations: [
        'Xero Practice Manager',
        'FYI Docs',
        'Xero Ledger',
        'MYOB Practice',
        'LodgeiT',
        'Outlook / Microsoft 365'
      ],
      winningFeatures: [
        'Accountant-native UX (simple, fast)',
        'Low-friction annual refresh',
        'XPM/FYI deep sync',
        'Group entity onboarding'
      ]
    },
    {
      id: 'credit',
      name: 'Credit Providers',
      icon: Landmark,
      color: 'from-green-600 to-emerald-600',
      status: 'Planned',
      marketSize: '15,000+ non-bank lenders, brokers, fintechs in APAC',
      mainUseCase: 'Borrower onboarding, guarantor verification, director and UBO checks, pre-settlement compliance clearance',
      pricing: '$100-150 per loan (one-time)',
      targetCustomers: '500 lenders/brokers by 2027',
      arrPotential: '$5M-$8M',
      keyNeeds: [
        'Borrower and guarantor KYC',
        'Entity verification for borrower groups',
        'Director and UBO checks (layered ownership)',
        'Source of funds and source of wealth',
        'Purpose of loan capture',
        'Security party onboarding',
        'Loan-specific risk assessment',
        'Pre-settlement compliance clearance',
        'Post-settlement monitoring triggers'
      ],
      integrations: [
        'CRM / Deal Pipeline',
        'Loan Origination System (LOS)',
        'Document Management',
        'PEXA / InfoTrack',
        'DocuSign / AdobeSign',
        'Broker Portal'
      ],
      winningFeatures: [
        'Deal-room style onboarding',
        'Settlement gating (cannot fund until KYC approved)',
        'Guarantor and borrower linked review',
        'Lender-grade compliance pack'
      ]
    },
    {
      id: 'afsl',
      name: 'AFSL Holders',
      icon: Briefcase,
      color: 'from-purple-600 to-pink-600',
      status: 'Planned',
      marketSize: '3,000+ AFSL holders, 25,000+ advisers in Australia',
      mainUseCase: 'Client onboarding, advice engagement, investor classification, AML and suitability controls',
      pricing: '$80-120 per client per year',
      targetCustomers: '500 AFSL holders by 2027',
      arrPotential: '$4M-$6M',
      keyNeeds: [
        'Retail vs wholesale investor classification',
        'Investor eligibility capture ($2.5M net assets)',
        'Adviser and representative workflow',
        'Client identification and AML',
        'Source of wealth for investment clients',
        'Risk profile and investment objective forms',
        'Fee consent and advice engagement workflow',
        'Ongoing client review and refresh',
        'Adviser approval trail'
      ],
      integrations: [
        'CRM (Xplan, Midwinter)',
        'Portfolio Platform (HUB24, Netwealth)',
        'Adviser File Review Tools',
        'Document Management',
        'E-signature',
        'Payment Portal'
      ],
      winningFeatures: [
        'Investor classification engine',
        'Linked advice plus compliance workflow',
        'Strong consent logs (ASIC audit-ready)',
        'Ongoing client review cycle'
      ]
    },
    {
      id: 'fund',
      name: 'Fund Managers',
      icon: TrendingUp,
      color: 'from-indigo-600 to-blue-600',
      status: 'Planned',
      marketSize: '1,500+ fund managers in APAC (PE, VC, hedge funds)',
      mainUseCase: 'Investor onboarding, AML, KYB, UBO mapping, subscription approval, ongoing monitoring',
      pricing: '$150-250 per investor per year',
      targetCustomers: '200 fund managers by 2027',
      arrPotential: '$3M-$5M',
      keyNeeds: [
        'Investor onboarding (individual and entity)',
        'Trust and company ownership tracing',
        'UBO checks (25%+ ownership threshold)',
        'Source of wealth and funds',
        'Sanctions and PEP screening',
        'Tax residency and investor classification',
        'Subscription document workflow',
        'Trustee and manager approval workflow',
        'Ongoing investor monitoring'
      ],
      integrations: [
        'Investor Portal',
        'Fund Registry (Mainstream, Link)',
        'Subscription System',
        'Document Vault',
        'Bank Confirmation System',
        'CRM'
      ],
      winningFeatures: [
        'Strong entity onboarding',
        'Investor register compliance view',
        'Ongoing screening of investor base',
        'Trustee and manager sign-off trail'
      ]
    },
    {
      id: 'trustee',
      name: 'Trustees',
      icon: Scale,
      color: 'from-amber-600 to-orange-600',
      status: 'Planned',
      marketSize: '5,000+ trustee entities in APAC',
      mainUseCase: 'Verify parties acting in fiduciary roles, prove control, authority, and trust relationships',
      pricing: '$100-150 per trust per year',
      targetCustomers: '300 trustee entities by 2027',
      arrPotential: '$2M-$3M',
      keyNeeds: [
        'Trust deed capture and parsing',
        'Trustee verification (individual or corporate)',
        'Appointor and controller capture',
        'Beneficiary class capture',
        'Corporate trustee KYB',
        'Authorised signatory workflow',
        'Linked trust structure mapping',
        'Evidence of authority to act',
        'Ongoing control-change monitoring'
      ],
      integrations: [
        'Document Vault',
        'Legal Document Systems (LEAP)',
        'Fund or Deal Platform',
        'Signing Tools',
        'CRM'
      ],
      winningFeatures: [
        'Trust-specific ownership map',
        'Controller role engine',
        'Trust deed parsing (AI extraction)',
        'Clear authority log'
      ]
    },
    {
      id: 'legal',
      name: 'Legal Firms',
      icon: Gavel,
      color: 'from-red-600 to-rose-600',
      status: 'Planned',
      marketSize: '20,000+ law firms in APAC',
      mainUseCase: 'Matter opening, client due diligence, beneficial ownership, matter risk scoring',
      pricing: '$60-100 per matter or $500-800/month',
      targetCustomers: '1,000 law firms by 2027',
      arrPotential: '$6M-$10M',
      keyNeeds: [
        'Matter intake before file opening',
        'Client and beneficial owner verification',
        'Source of funds and wealth',
        'Matter purpose capture (property, corporate, litigation)',
        'Jurisdiction and sanctions screening',
        'Counterparty capture',
        'Trust account risk controls',
        'Escalation to compliance partner',
        'Matter-level and client-level risk rating'
      ],
      integrations: [
        'Practice Management (LEAP, Smokeball)',
        'Document Management (iManage)',
        'E-signature',
        'Billing',
        'Outlook / Microsoft 365'
      ],
      winningFeatures: [
        'Matter-based compliance workflows',
        'Compliance partner review queue',
        'Source-of-funds logic by matter type',
        'Trust account event triggers'
      ]
    },
    {
      id: 'realestate',
      name: 'Real Estate',
      icon: Home,
      color: 'from-teal-600 to-green-600',
      status: 'Planned',
      marketSize: '30,000+ real estate agencies in APAC',
      mainUseCase: 'Vendor, purchaser, landlord, tenant onboarding with AML and transaction-specific checks',
      pricing: '$50-80 per transaction or $300-500/month',
      targetCustomers: '2,000 agencies by 2027',
      arrPotential: '$7M-$12M',
      keyNeeds: [
        'Seller and buyer KYC',
        'Landlord and tenant onboarding',
        'Company and trust buyer verification',
        'Beneficial ownership tracing',
        'Source of funds for purchasers',
        'PEP and sanctions screening',
        'Property-specific transaction record',
        'Authority to act checks',
        'Settlement readiness status'
      ],
      integrations: [
        'CRM (REA, Domain)',
        'Listing / Deal Management (Rex)',
        'E-signature',
        'Trust Accounting (MYOB Property)',
        'Document Storage',
        'Settlement Workflow (PEXA)'
      ],
      winningFeatures: [
        'Transaction-based KYC',
        'Party-role mapping by property',
        'Offshore and high-risk buyer workflow',
        'Settlement and authority controls'
      ]
    }
  ];

  const selectedVert = verticals.find(v => v.id === selectedVertical);

  if (selectedVert) {
    const VertIcon = selectedVert.icon;
    return (
      <div className="min-h-screen bg-[#1e293b]">
        {/* Header */}
        <div className={`bg-gradient-to-r ${selectedVert.color} text-white px-8 py-12`}>
          <Button
            variant="ghost"
            onClick={() => setSelectedVertical(null)}
            className="mb-6 text-white hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Verticals
          </Button>

          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
              <VertIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-5xl font-bold">{selectedVert.name}</h1>
                <Badge className={selectedVert.status === 'Built' ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'}>
                  {selectedVert.status}
                </Badge>
              </div>
              <p className="text-white/90 text-xl">{selectedVert.mainUseCase}</p>
            </div>
          </div>
        </div>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Market Overview */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Market Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-blue-900">{selectedVert.marketSize}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Target Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-green-900">{selectedVert.targetCustomers}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  ARR Potential
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-purple-900">{selectedVert.arrPotential}</p>
              </CardContent>
            </Card>
          </div>

          {/* Pricing */}
          <Card className="mb-8 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-600" />
                Pricing Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-900">{selectedVert.pricing}</p>
            </CardContent>
          </Card>

          {/* Key Needs */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                Key Requirements
              </CardTitle>
              <CardDescription>What {selectedVert.name} need from Grow Compliance OS</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedVert.keyNeeds.map((need, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-[#0f172a] rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-white">{need}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Integrations */}
          <Card className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-indigo-600" />
                Required Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {selectedVert.integrations.map((integration, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-[#1e293b] rounded-lg border border-indigo-200">
                    <Zap className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-white">{integration}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Winning Features */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Star className="w-6 h-6 text-green-600" />
                Winning Features
              </CardTitle>
              <CardDescription className="text-base">
                How Grow beats competitors in this vertical
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedVert.winningFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-[#1e293b] rounded-xl border-2 border-green-200">
                    <Rocket className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-lg font-semibold text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e293b]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-8 py-12">
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
            <Users className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">Vertical User Types</h1>
            <p className="text-white/90 text-xl">Multi-Vertical Compliance OS Strategy • 7 Industries</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total Verticals</div>
            </div>
            <div className="text-4xl font-bold mb-1">7</div>
            <div className="text-xs text-white/70">Professional services industries</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Target Customers</div>
            </div>
            <div className="text-4xl font-bold mb-1">6,500+</div>
            <div className="text-xs text-white/70">Firms across all verticals by 2027</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total ARR Potential</div>
            </div>
            <div className="text-4xl font-bold mb-1">$40M+</div>
            <div className="text-xs text-white/70">Revenue across all verticals</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Revenue Multiplier</div>
            </div>
            <div className="text-4xl font-bold mb-1">4X</div>
            <div className="text-xs text-white/70">vs accountants-only strategy</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Status Legend */}
        <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-600 text-white">Built</Badge>
            <span className="text-sm text-slate-300">= Currently operational (1 vertical)</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-600 text-white">Planned</Badge>
            <span className="text-sm text-slate-300">= Not yet built (6 verticals)</span>
          </div>
        </div>

        {/* Vertical Cards */}
        <div className="grid grid-cols-1 gap-6">
          {verticals.map((vertical) => {
            const VertIcon = vertical.icon;
            return (
              <Card
                key={vertical.id}
                className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-300"
                onClick={() => setSelectedVertical(vertical.id)}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-6 flex-1">
                      <div className={`w-20 h-20 bg-gradient-to-br ${vertical.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <VertIcon className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-3xl font-bold text-white">{vertical.name}</h3>
                          <Badge className={vertical.status === 'Built' ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'}>
                            {vertical.status}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-4 text-lg">{vertical.mainUseCase}</p>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="p-3 bg-[#0f172a] rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Globe className="w-4 h-4 text-slate-300" />
                              <span className="text-xs font-semibold text-slate-300">MARKET SIZE</span>
                            </div>
                            <p className="text-sm font-medium text-white">{vertical.marketSize.split(',')[0]}</p>
                          </div>
                          <div className="p-3 bg-[#0f172a] rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <DollarSign className="w-4 h-4 text-slate-300" />
                              <span className="text-xs font-semibold text-slate-300">PRICING</span>
                            </div>
                            <p className="text-sm font-medium text-white">{vertical.pricing}</p>
                          </div>
                          <div className="p-3 bg-[#0f172a] rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Target className="w-4 h-4 text-slate-300" />
                              <span className="text-xs font-semibold text-slate-300">ARR POTENTIAL</span>
                            </div>
                            <p className="text-sm font-medium text-white">{vertical.arrPotential}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-purple-600 font-semibold">
                          <span>View Details</span>
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Card */}
        <Card className="mt-12 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Rocket className="w-6 h-6 text-indigo-600" />
              Multi-Vertical Strategy Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-white mb-4 text-lg">Single Vertical (Accountants Only)</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Market: 40,000 firms</li>
                  <li>• Penetration: 5% (2,000 firms)</li>
                  <li>• ARPU: $5,000/year</li>
                  <li className="font-bold text-white">• Total ARR: $10M</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4 text-lg">Multi-Vertical (7 Industries)</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Market: 114,500+ firms across 7 verticals</li>
                  <li>• Penetration: 5.7% (6,500 firms)</li>
                  <li>• Average ARPU: $6,200/year</li>
                  <li className="font-bold text-indigo-600 text-base">• Total ARR: $40.4M (4X increase!)</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold mb-2">Strategic Advantage</h4>
                  <p className="text-white/90">Only platform serving 7 verticals with one core engine</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold">4X</div>
                  <div className="text-sm text-white/80">Revenue Multiplier</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Architecture Overview */}
        <Card className="mt-12 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Shield className="w-6 h-6 text-blue-600" />
              Shared Core + Vertical Overlays Architecture
            </CardTitle>
            <CardDescription className="text-base">
              One compliance engine powers all 7 verticals with industry-specific overlays
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-[#1e293b] rounded-xl border-2 border-blue-200">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Shared Core Engine (All Verticals)
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Identity Verification</li>
                  <li>• KYB and Beneficial Ownership</li>
                  <li>• Sanctions, PEP, Adverse Media</li>
                  <li>• Risk Scoring (0-100 model)</li>
                  <li>• Workflow Gating</li>
                  <li>• Ongoing Monitoring</li>
                  <li>• Audit Trail</li>
                  <li>• Document Storage</li>
                </ul>
              </div>

              <div className="p-6 bg-[#1e293b] rounded-xl border-2 border-purple-200">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Vertical-Specific Overlays
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Custom intake forms</li>
                  <li>• Industry risk rules</li>
                  <li>• Required evidence checklists</li>
                  <li>• Approval workflows</li>
                  <li>• Document packs</li>
                  <li>• Monitoring schedules</li>
                  <li>• Reporting outputs</li>
                  <li>• Native integrations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

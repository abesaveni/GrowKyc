import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  CheckCircle,
  X,
  Target,
  Trophy,
  TrendingUp,
  AlertCircle,
  Zap,
  Shield,
  Users,
  CreditCard,
  FileCheck,
  Network,
  Clock,
  DollarSign,
  Star,
  Flame
} from 'lucide-react';

interface CompetitorAnalysisProps {
  onBack: () => void;
}

export function CompetitorAnalysis({ onBack }: CompetitorAnalysisProps) {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

  const competitors = [
    {
      id: 'identitycheck',
      name: 'IdentityCheck',
      logo: '🔍',
      marketShare: '15-20%',
      color: 'from-blue-600 to-cyan-600',
      winsOn: 'Fast ID checks and tight practice integrations',
      losesOn: 'No KYB, no beneficial ownership, no monitoring',
      strengths: [
        'Fast identity verification (under 2 minutes)',
        'Deep Xero Practice Manager integration',
        'Simple accountant-friendly UX',
        'Good customer support'
      ],
      weaknesses: [
        'No beneficial ownership mapping',
        'No KYB (Know Your Business)',
        'No ongoing monitoring',
        'No compliance case management',
        'No proposal or engagement features',
        'Limited AML screening'
      ],
      pricing: '$15-25 per verification',
      howToBeat: [
        'Add full KYB capabilities',
        'Build beneficial ownership mapping with visual graphs',
        'Add ongoing monitoring and rescreening',
        'Include annual re-engagement workflows',
        'Add compliance case management',
        'Support group entity onboarding'
      ]
    },
    {
      id: 'nagaris',
      name: 'Nagaris',
      logo: '📋',
      marketShare: '10-15%',
      color: 'from-purple-600 to-pink-600',
      winsOn: 'Proposal-to-job automation and grouped entity onboarding',
      losesOn: 'Weak AML engine, no compliance governance',
      strengths: [
        'Excellent proposal builder',
        'Grouped entity onboarding flows',
        'Engagement letter automation',
        'Good practice management sync',
        'Workflow automation'
      ],
      weaknesses: [
        'Basic AML screening only',
        'No sanctions/PEP governance',
        'No beneficial ownership tracing',
        'Limited monitoring capabilities',
        'No compliance reviewer workbench',
        'Weak audit trail'
      ],
      pricing: '$50-80 per client per year',
      howToBeat: [
        'Add deep AML engine with 200+ sanctions lists',
        'Build PEP and adverse media screening',
        'Add beneficial ownership tracing',
        'Create MLRO reviewer workbench',
        'Add comprehensive audit packs for regulators',
        'Stronger monitoring with event-based triggers'
      ]
    },
    {
      id: 'onboardme',
      name: 'OnboardMe',
      logo: '🚀',
      marketShare: '12-18%',
      color: 'from-green-600 to-emerald-600',
      winsOn: 'Broad all-round onboarding, payments, and engagement flow',
      losesOn: 'Weak entity structures, limited risk engine',
      strengths: [
        'Comprehensive onboarding forms',
        'Payment collection integration',
        'Engagement workflow',
        'Client portal experience',
        'Good mobile experience'
      ],
      weaknesses: [
        'Weak entity structure handling',
        'Basic risk engine (only 3 levels)',
        'Limited policy controls',
        'Basic monitoring (expiry only)',
        'No regulator-grade audit evidence',
        'Poor beneficial ownership support'
      ],
      pricing: '$60-90 per client per year',
      howToBeat: [
        'Stronger entity structures (trust, company, SMSF)',
        'Advanced risk engine (0-100 scoring with ML)',
        'Richer policy controls (no-code rule builder)',
        'Better ongoing monitoring (sanctions, PEP rescreening)',
        'Regulator-grade audit evidence (AUSTRAC-ready)',
        'Full beneficial ownership with graph view'
      ]
    },
    {
      id: 'seamlss',
      name: 'Seamlss',
      logo: '⚡',
      marketShare: '8-12%',
      color: 'from-amber-600 to-orange-600',
      winsOn: 'Accountant-native simplicity and XPM fit',
      losesOn: 'No proposal engine, no beneficial ownership',
      strengths: [
        'Ultra-simple accountant UX',
        'Native XPM integration',
        'Re-engagement workflows',
        'Fast onboarding setup',
        'Low learning curve'
      ],
      weaknesses: [
        'No proposal-to-job engine',
        'No payment collection',
        'No beneficial ownership',
        'Basic monitoring only',
        'No decision engine',
        'Limited multi-entity support'
      ],
      pricing: '$40-60 per client per year',
      howToBeat: [
        'Add proposal-to-job automation',
        'Add payment collection (Stripe)',
        'Build beneficial ownership mapping',
        'Add comprehensive monitoring',
        'Create advanced decision engine',
        'Support multi-entity group workflows'
      ]
    },
    {
      id: 'verifime',
      name: 'VerifiMe',
      logo: '🛡️',
      marketShare: '20-25%',
      color: 'from-red-600 to-rose-600',
      winsOn: 'Deep KYC, KYB, AML, beneficial ownership, and Tranche 2 readiness',
      losesOn: 'Poor accountant UX, no practice sync, no proposals',
      strengths: [
        'Bank-grade KYC/KYB/AML',
        'Excellent beneficial ownership',
        'Comprehensive screening',
        'Strong compliance governance',
        'Tranche 2 ready',
        'Detailed audit trails'
      ],
      weaknesses: [
        'Complex enterprise UI (not accountant-friendly)',
        'No XPM or FYI integration',
        'No proposal or engagement features',
        'No payment collection',
        'Complicated onboarding forms',
        'No practice workflow integration'
      ],
      pricing: '$150-250 per client per year',
      howToBeat: [
        'Build accountant-friendly UX (match Seamlss simplicity)',
        'Add XPM and FYI native integration',
        'Add proposal, engagement, payment workflow',
        'Simplify onboarding front-end',
        'Create practice-native dashboard',
        'Make it feel like part of their daily tools'
      ]
    }
  ];

  const competitiveMatrix = [
    { feature: 'Fast ID Verification', identitycheck: true, nagaris: false, onboardme: true, seamlss: true, verifime: true, grow: true },
    { feature: 'Biometric IDV (Selfie)', identitycheck: true, nagaris: false, onboardme: true, seamlss: false, verifime: true, grow: false },
    { feature: 'KYB (Company/Trust)', identitycheck: false, nagaris: true, onboardme: true, seamlss: true, verifime: true, grow: true },
    { feature: 'Beneficial Ownership Mapping', identitycheck: false, nagaris: false, onboardme: false, seamlss: false, verifime: true, grow: false },
    { feature: 'Ownership Graph View', identitycheck: false, nagaris: false, onboardme: false, seamlss: false, verifime: true, grow: false },
    { feature: 'Sanctions Screening', identitycheck: false, nagaris: false, onboardme: false, seamlss: false, verifime: true, grow: false },
    { feature: 'PEP Screening', identitycheck: false, nagaris: false, onboardme: false, seamlss: false, verifime: true, grow: false },
    { feature: 'Adverse Media Monitoring', identitycheck: false, nagaris: false, onboardme: false, seamlss: false, verifime: true, grow: false },
    { feature: 'Proposal Builder', identitycheck: false, nagaris: true, onboardme: true, seamlss: false, verifime: false, grow: false },
    { feature: 'Engagement Letters', identitycheck: false, nagaris: true, onboardme: true, seamlss: true, verifime: false, grow: false },
    { feature: 'Payment Collection', identitycheck: false, nagaris: false, onboardme: true, seamlss: false, verifime: false, grow: false },
    { feature: 'XPM Integration', identitycheck: true, nagaris: true, onboardme: false, seamlss: true, verifime: false, grow: false },
    { feature: 'FYI Docs Integration', identitycheck: true, nagaris: false, onboardme: false, seamlss: true, verifime: false, grow: false },
    { feature: 'Ongoing Monitoring', identitycheck: false, nagaris: false, onboardme: false, seamlss: false, verifime: true, grow: false },
    { feature: 'Annual Re-engagement', identitycheck: false, nagaris: false, onboardme: false, seamlss: true, verifime: false, grow: true },
    { feature: 'Group Entity Onboarding', identitycheck: false, nagaris: true, onboardme: false, seamlss: false, verifime: false, grow: true },
    { feature: 'Risk Scoring (0-100)', identitycheck: false, nagaris: false, onboardme: false, seamlss: false, verifime: true, grow: true },
    { feature: 'MLRO Workbench', identitycheck: false, nagaris: false, onboardme: false, seamlss: false, verifime: true, grow: true },
    { feature: 'Compliance Audit Pack', identitycheck: false, nagaris: false, onboardme: false, seamlss: false, verifime: true, grow: true },
    { feature: 'Accountant-Friendly UX', identitycheck: true, nagaris: true, onboardme: true, seamlss: true, verifime: false, grow: true }
  ];

  const marketGaps = [
    {
      gap: 'No single platform combines accountant-native onboarding with deep AML/KYB',
      icon: Target,
      severity: 'critical',
      description: 'VerifiMe has deep compliance but poor UX. Seamlss has great UX but weak compliance.'
    },
    {
      gap: 'Beneficial ownership mapping is missing or poor in 4 out of 5 competitors',
      icon: Network,
      severity: 'critical',
      description: 'Only VerifiMe has it, but their UX makes it hard to use. This is Grow\'s biggest opportunity.'
    },
    {
      gap: 'No one connects proposal → engagement → KYC → job activation seamlessly',
      icon: Zap,
      severity: 'high',
      description: 'Nagaris has proposals, Seamlss has XPM, but no one connects the full workflow.'
    },
    {
      gap: 'Ongoing monitoring is absent or basic in 4 out of 5 competitors',
      icon: Clock,
      severity: 'high',
      description: 'Only VerifiMe has comprehensive monitoring. Big compliance risk for others.'
    },
    {
      gap: 'Practice management sync is missing in 3 out of 5 competitors',
      icon: Users,
      severity: 'medium',
      description: 'VerifiMe and OnboardMe don\'t integrate with XPM/FYI, forcing double data entry.'
    }
  ];

  const winningStrategy = [
    {
      title: 'Beat IdentityCheck',
      icon: CheckCircle,
      strategy: 'Add full KYB, beneficial ownership, monitoring, case management',
      timeline: '4 months',
      investment: '$600K'
    },
    {
      title: 'Beat Nagaris',
      icon: Shield,
      strategy: 'Add deep AML engine, sanctions/PEP governance, MLRO workbench',
      timeline: '5 months',
      investment: '$700K'
    },
    {
      title: 'Beat OnboardMe',
      icon: FileCheck,
      strategy: 'Add stronger entity structures, advanced risk engine, regulator-grade audit',
      timeline: '4 months',
      investment: '$530K'
    },
    {
      title: 'Beat Seamlss',
      icon: Zap,
      strategy: 'Add proposal engine, payments, beneficial ownership, monitoring',
      timeline: '5 months',
      investment: '$780K'
    },
    {
      title: 'Beat VerifiMe',
      icon: Users,
      strategy: 'Keep their compliance depth, add accountant UX, XPM/FYI sync, proposals',
      timeline: '6 months',
      investment: '$900K'
    }
  ];

  const selectedComp = competitors.find(c => c.id === selectedCompetitor);

  if (selectedComp) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className={`bg-gradient-to-r ${selectedComp.color} text-white px-8 py-12`}>
          <Button
            variant="ghost"
            onClick={() => setSelectedCompetitor(null)}
            className="mb-6 text-white hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Competitors
          </Button>

          <div className="flex items-center gap-6 mb-6">
            <div className="text-8xl">{selectedComp.logo}</div>
            <div>
              <h1 className="text-5xl font-bold mb-2">{selectedComp.name}</h1>
              <p className="text-white/90 text-xl">Market Share: {selectedComp.marketShare}</p>
            </div>
          </div>
        </div>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Wins/Loses */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-green-300 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Trophy className="w-5 h-5" />
                  Wins On
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-green-800">{selectedComp.winsOn}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-300 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-900">
                  <AlertCircle className="w-5 h-5" />
                  Loses On
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-red-800">{selectedComp.losesOn}</p>
              </CardContent>
            </Card>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedComp.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <X className="w-5 h-5 text-red-600" />
                  Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedComp.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Pricing */}
          <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-900">{selectedComp.pricing}</p>
            </CardContent>
          </Card>

          {/* How to Beat */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="w-6 h-6 text-green-600" />
                How Grow Beats {selectedComp.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {selectedComp.howToBeat.map((strategy, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                    <Flame className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-900 font-medium">{strategy}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">Competitive Analysis</h1>
            <p className="text-white/90 text-xl">How Grow Wins Against 5 Major Competitors</p>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Market Gaps */}
        <Card className="mb-12 border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Target className="w-6 h-6 text-amber-600" />
              Critical Market Gaps
            </CardTitle>
            <CardDescription className="text-base">
              Opportunities where NO competitor has a complete solution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketGaps.map((gap, idx) => {
                const GapIcon = gap.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 p-5 bg-white rounded-xl border-2 ${
                      gap.severity === 'critical'
                        ? 'border-red-300'
                        : gap.severity === 'high'
                        ? 'border-orange-300'
                        : 'border-yellow-300'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        gap.severity === 'critical'
                          ? 'bg-red-100'
                          : gap.severity === 'high'
                          ? 'bg-orange-100'
                          : 'bg-yellow-100'
                      }`}
                    >
                      <GapIcon
                        className={`w-6 h-6 ${
                          gap.severity === 'critical'
                            ? 'text-red-600'
                            : gap.severity === 'high'
                            ? 'text-orange-600'
                            : 'text-yellow-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900">{gap.gap}</h3>
                        <Badge
                          className={
                            gap.severity === 'critical'
                              ? 'bg-red-600'
                              : gap.severity === 'high'
                              ? 'bg-orange-600'
                              : 'bg-yellow-600'
                          }
                        >
                          {gap.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{gap.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Competitor Cards */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Major Competitors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {competitors.map((comp) => (
            <Card
              key={comp.id}
              className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-purple-300"
              onClick={() => setSelectedCompetitor(comp.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{comp.logo}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{comp.name}</h3>
                      <p className="text-sm text-gray-600">Market Share: {comp.marketShare}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details →
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-900">WINS ON</span>
                    </div>
                    <p className="text-sm text-green-800">{comp.winsOn}</p>
                  </div>

                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-semibold text-red-900">LOSES ON</span>
                    </div>
                    <p className="text-sm text-red-800">{comp.losesOn}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Matrix */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Feature Comparison Matrix</CardTitle>
            <CardDescription>Check marks show which competitors have each feature</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-bold">Feature</th>
                    <th className="text-center py-3 px-2">IdentityCheck</th>
                    <th className="text-center py-3 px-2">Nagaris</th>
                    <th className="text-center py-3 px-2">OnboardMe</th>
                    <th className="text-center py-3 px-2">Seamlss</th>
                    <th className="text-center py-3 px-2">VerifiMe</th>
                    <th className="text-center py-3 px-2 bg-gradient-to-br from-purple-100 to-pink-100 font-bold">
                      Grow
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {competitiveMatrix.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{row.feature}</td>
                      <td className="text-center py-3 px-2">
                        {row.identitycheck ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-3 px-2">
                        {row.nagaris ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-3 px-2">
                        {row.onboardme ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-3 px-2">
                        {row.seamlss ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-3 px-2">
                        {row.verifime ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-3 px-2 bg-gradient-to-br from-purple-50 to-pink-50">
                        {row.grow ? (
                          <CheckCircle className="w-5 h-5 text-purple-600 mx-auto" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-600 mx-auto" title="Planned" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Winning Strategy */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Flame className="w-6 h-6 text-indigo-600" />
              Winning Strategy: Beat All 5 Competitors
            </CardTitle>
            <CardDescription className="text-base">
              Investment required to achieve feature parity + superiority
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {winningStrategy.map((strat, idx) => {
                const StratIcon = strat.icon;
                return (
                  <div key={idx} className="p-5 bg-white rounded-xl border-2 border-indigo-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <StratIcon className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">{strat.title}</h3>
                        <p className="text-sm text-gray-700 mb-3">{strat.strategy}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-600" />
                            <span className="text-gray-600">{strat.timeline}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-green-600" />
                            <span className="text-gray-600">{strat.investment}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold mb-2">Total Investment to Beat All Competitors</h4>
                  <p className="text-white/90">18-month timeline to achieve market leadership</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold">$3.5M</div>
                  <div className="text-sm text-white/80">Expected ROI: 300%+</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

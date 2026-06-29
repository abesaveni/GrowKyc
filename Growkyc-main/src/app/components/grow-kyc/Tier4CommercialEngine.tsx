import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Users,
  Target,
  Briefcase,
  Clock,
  ChevronRight,
  XCircle,
  TrendingDown,
  BarChart3,
  Zap,
  Award,
  AlertTriangle
} from 'lucide-react';

type Tier4Module = 'hub' | 'client-profitability' | 'pricing-intelligence' | 'portfolio-risk' | 'revenue-leakage';

interface Tier4CommercialEngineProps {
  onBack?: () => void;
}

export function Tier4CommercialEngine({ onBack }: Tier4CommercialEngineProps) {
  const [currentModule, setCurrentModule] = useState<Tier4Module>('hub');

  if (currentModule === 'client-profitability') {
    return <ClientProfitabilityBot onBack={() => setCurrentModule('hub')} />;
  }

  if (currentModule === 'pricing-intelligence') {
    return <PricingIntelligenceBot onBack={() => setCurrentModule('hub')} />;
  }

  if (currentModule === 'portfolio-risk') {
    return <PortfolioRiskDashboard onBack={() => setCurrentModule('hub')} />;
  }

  if (currentModule === 'revenue-leakage') {
    return <RevenueLeakageBot onBack={() => setCurrentModule('hub')} />;
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
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-3xl flex items-center justify-center shadow-2xl">
              <DollarSign className="w-12 h-12 text-white" />
            </div>
            <div>
              <Badge className="bg-green-600 text-white mb-2 text-sm px-4 py-1">TIER 4 - COMMERCIAL ENGINE</Badge>
              <h1 className="text-5xl font-bold text-white">Business Intelligence Layer</h1>
              <p className="text-slate-300 text-xl">Turn compliance data into pricing, profitability & portfolio control</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-4 border-green-400 rounded-xl p-8 shadow-2xl">
            <h3 className="font-bold text-green-900 text-2xl mb-4 flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              What Makes Tier 4 A Commercial Engine
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-[#1e293b] p-6 rounded-xl border-2 border-green-300 shadow-lg">
                <Target className="w-12 h-12 text-green-600 mb-3" />
                <p className="font-bold text-white text-lg mb-2">Client Selection</p>
                <p className="text-sm text-slate-300">Score every client on compliance risk, operational burden, and profitability to drive retention and exit decisions</p>
              </div>
              <div className="bg-[#1e293b] p-6 rounded-xl border-2 border-blue-300 shadow-lg">
                <DollarSign className="w-12 h-12 text-blue-600 mb-3" />
                <p className="font-bold text-white text-lg mb-2">Pricing Decisions</p>
                <p className="text-sm text-slate-300">Automatically recommend pricing based on entity complexity, risk level, and historical workload—risk = price premium</p>
              </div>
              <div className="bg-[#1e293b] p-6 rounded-xl border-2 border-purple-300 shadow-lg">
                <PieChart className="w-12 h-12 text-purple-600 mb-3" />
                <p className="font-bold text-white text-lg mb-2">Portfolio Risk Control</p>
                <p className="text-sm text-slate-300">Live firm-wide risk exposure: PEP concentration, geographic clusters, industry concentration—manage the portfolio</p>
              </div>
              <div className="bg-[#1e293b] p-6 rounded-xl border-2 border-amber-300 shadow-lg">
                <TrendingUp className="w-12 h-12 text-amber-600 mb-3" />
                <p className="font-bold text-white text-lg mb-2">Revenue Optimization</p>
                <p className="text-sm text-slate-300">Detect revenue leakage, underbilling, scope creep—recover lost revenue and improve margins</p>
              </div>
            </div>
            
            <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl border-2 border-green-400">
              <p className="text-center text-lg text-white">
                <strong className="text-green-900">Platform Evolution:</strong>{' '}
                <span className="text-purple-900">Tier 1 = Compliance</span> •{' '}
                <span className="text-blue-900">Tier 2 = Risk Understanding</span> •{' '}
                <span className="text-red-900">Tier 3 = Automation & Decisions</span> •{' '}
                <span className="text-green-900 font-bold">Tier 4 = Profit & Control</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Tier 4 Modules Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Client Risk & Profitability Bot */}
          <Card 
            className="border-4 border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentModule('client-profitability')}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <Target className="w-12 h-12 text-white" />
                </div>
                <Badge className="bg-green-700 text-white text-xs px-3 py-1">CLIENT INTEL</Badge>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3">Client Risk & Profitability Bot</h2>
              <p className="text-slate-300 mb-4 text-sm">
                Score every client • Drive retention • Exit decisions
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Compliance risk scoring</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Operational burden analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Profitability calculation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Client behavior tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Exit candidate flagging</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#1e293b] p-4 rounded-lg border-2 border-green-300 text-center">
                  <p className="text-xs text-green-700">High Value</p>
                  <p className="text-3xl font-bold text-green-600">142</p>
                </div>
                <div className="bg-[#1e293b] p-4 rounded-lg border-2 border-red-300 text-center">
                  <p className="text-xs text-red-700">Loss-Making</p>
                  <p className="text-3xl font-bold text-red-600">23</p>
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-xl text-lg py-6">
                Launch Client Intel
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Pricing & Engagement Intelligence Bot */}
          <Card 
            className="border-4 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentModule('pricing-intelligence')}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <DollarSign className="w-12 h-12 text-white" />
                </div>
                <Badge className="bg-blue-700 text-white text-xs px-3 py-1">PRICING ENGINE</Badge>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3">Pricing & Engagement Intelligence</h2>
              <p className="text-slate-300 mb-4 text-sm">
                Auto pricing • Risk premiums • Margin optimization
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Automated price recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Risk-based pricing adjustments</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Complexity premium calculation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Engagement scenario modeling</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Margin impact forecasting</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#1e293b] p-4 rounded-lg border-2 border-blue-300 text-center">
                  <p className="text-xs text-blue-700">Avg Margin</p>
                  <p className="text-3xl font-bold text-blue-600">42%</p>
                </div>
                <div className="bg-[#1e293b] p-4 rounded-lg border-2 border-amber-300 text-center">
                  <p className="text-xs text-amber-700">Underpriced</p>
                  <p className="text-3xl font-bold text-amber-600">34</p>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl text-lg py-6">
                Launch Pricing Engine
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Portfolio Risk Dashboard Bot */}
          <Card 
            className="border-4 border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentModule('portfolio-risk')}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <PieChart className="w-12 h-12 text-white" />
                </div>
                <Badge className="bg-purple-700 text-white text-xs px-3 py-1">PORTFOLIO VIEW</Badge>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3">Portfolio Risk Dashboard</h2>
              <p className="text-slate-300 mb-4 text-sm">
                Firm-wide risk • Geographic exposure • Concentration alerts
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Total risk exposure tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>PEP concentration monitoring</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Geographic exposure mapping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Industry concentration alerts</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Risk trend analysis</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#1e293b] p-4 rounded-lg border-2 border-purple-300 text-center">
                  <p className="text-xs text-purple-700">Total Clients</p>
                  <p className="text-3xl font-bold text-purple-600">1,847</p>
                </div>
                <div className="bg-[#1e293b] p-4 rounded-lg border-2 border-red-300 text-center">
                  <p className="text-xs text-red-700">High Risk %</p>
                  <p className="text-3xl font-bold text-red-600">12.4%</p>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-xl text-lg py-6">
                Launch Portfolio View
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Revenue Leakage & Billing Bot */}
          <Card 
            className="border-4 border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow"
            onClick={() => setCurrentModule('revenue-leakage')}
          >
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-xl">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
                <Badge className="bg-amber-700 text-white text-xs px-3 py-1">REVENUE RECOVERY</Badge>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3">Revenue Leakage & Billing Bot</h2>
              <p className="text-slate-300 mb-4 text-sm">
                Detect leakage • Recover revenue • Improve margins
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Time vs billed analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Scope creep detection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Unbilled work flagging</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Revenue leakage breakdown</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Billing automation triggers</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#1e293b] p-4 rounded-lg border-2 border-amber-300 text-center">
                  <p className="text-xs text-amber-700">Total Billed</p>
                  <p className="text-3xl font-bold text-green-600">$2.4M</p>
                </div>
                <div className="bg-[#1e293b] p-4 rounded-lg border-2 border-red-300 text-center">
                  <p className="text-xs text-red-700">Leakage</p>
                  <p className="text-3xl font-bold text-red-600">$187K</p>
                </div>
              </div>

              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-xl text-lg py-6">
                Launch Revenue Bot
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tier 4 System Flow */}
        <Card className="mt-8 border-4 border-green-500 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <Zap className="w-8 h-8 text-green-600" />
              Complete Tier 4 Commercial Flow
            </CardTitle>
            <CardDescription className="text-lg">From compliance data to commercial intelligence</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-7 gap-4 mb-6">
              {[
                { label: 'Client Onboarded', icon: Users, color: 'blue' },
                { label: 'Risk Assessed', icon: AlertCircle, color: 'red' },
                { label: 'Work Performed', icon: Briefcase, color: 'purple' },
                { label: 'Revenue Tracked', icon: DollarSign, color: 'green' },
                { label: 'Client Scored', icon: Target, color: 'amber' },
                { label: 'Pricing Adjusted', icon: TrendingUp, color: 'blue' },
                { label: 'Portfolio Updated', icon: PieChart, color: 'purple' }
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

            <div className="bg-[#1e293b] rounded-xl border-2 border-green-300 p-6 shadow-lg">
              <h4 className="font-bold text-white text-xl mb-4">What Tier 4 Achieves:</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Turns Compliance Into Revenue
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Risk scores drive pricing decisions automatically</li>
                    <li>• High-risk clients pay premium for service</li>
                    <li>• Low-margin + high-risk = exit candidate</li>
                    <li>• Compliance data becomes commercial intelligence</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Improves Margins
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Detect revenue leakage and scope creep</li>
                    <li>• Recover $187K+ in unbilled work</li>
                    <li>• Auto-flag underpriced engagements</li>
                    <li>• 42% average margin across portfolio</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Improves Client Quality
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Score every client on profitability & risk</li>
                    <li>• 142 high-value clients identified</li>
                    <li>• 23 loss-making clients flagged for exit</li>
                    <li>• Behavior tracking: response time, delays, revisions</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Partner-Level Visibility
                  </h5>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Live firm-wide risk exposure dashboard</li>
                    <li>• Geographic & industry concentration alerts</li>
                    <li>• 12.4% high-risk portfolio percentage</li>
                    <li>• Drill-down to individual client drivers</li>
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

// Client Risk & Profitability Bot
function ClientProfitabilityBot({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tier 4 Hub
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-xl">
              <Target className="w-10 h-10 text-white" />
            </div>
            <div>
              <Badge className="bg-green-600 text-white mb-2">CLIENT INTELLIGENCE</Badge>
              <h1 className="text-3xl font-bold text-white">Client Risk & Profitability Bot</h1>
              <p className="text-slate-300">Score every client to drive retention and exit decisions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Clients', value: '1,847', icon: Users, color: 'blue' },
            { label: 'High-Risk Clients', value: 229, icon: AlertTriangle, color: 'red' },
            { label: 'Loss-Making', value: 23, icon: TrendingDown, color: 'red' },
            { label: 'Top 20% Revenue', value: 370, icon: Award, color: 'green' },
            { label: 'Bottom 20%', value: 370, icon: XCircle, color: 'gray' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-2 hover:border-green-400 transition-colors cursor-pointer">
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

        {/* Client Intelligence Table */}
        <Card className="border-2 border-green-400 mb-8">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-green-600" />
              Client Intelligence Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#0f172a] border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Client Name</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Revenue</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Cost</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Margin</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Risk Score</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-300">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { client: 'Pacific Holdings Trust', revenue: '$87,500', cost: '$32,000', margin: '63%', risk: 'Medium (42)', category: 'High Value, Medium Risk', categoryColor: 'amber' },
                    { client: 'Tech Industries Ltd', revenue: '$145,000', cost: '$58,000', margin: '60%', risk: 'Low (18)', category: 'High Value, Low Risk', categoryColor: 'green' },
                    { client: 'Global Trading Co', revenue: '$34,000', cost: '$42,000', margin: '-24%', risk: 'High (78)', category: 'Loss-Making Client', categoryColor: 'red' },
                    { client: 'Metro Services', revenue: '$12,000', cost: '$8,500', margin: '29%', risk: 'Low (22)', category: 'Low Value, Low Risk', categoryColor: 'gray' }
                  ].map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/5 cursor-pointer">
                      <td className="px-4 py-3 font-medium text-white">{item.client}</td>
                      <td className="px-4 py-3 text-slate-300">{item.revenue}</td>
                      <td className="px-4 py-3 text-slate-300">{item.cost}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${item.margin.includes('-') ? 'text-red-600' : item.margin.includes('6') ? 'text-green-600' : 'text-slate-300'}`}>
                          {item.margin}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={
                          item.risk.includes('Low') ? 'bg-green-100 text-green-700' :
                          item.risk.includes('Medium') ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {item.risk}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`bg-${item.categoryColor}-100 text-${item.categoryColor}-700`}>
                          {item.category}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t bg-[#0f172a]">
              <Button variant="ghost" className="w-full text-green-700 hover:bg-green-50">
                View All Clients <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Core Rules */}
        <Card className="border-2 border-green-400 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Zap className="w-6 h-6" />
              Core Client Selection Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { rule: 'Low Margin + High Risk', action: 'EXIT CANDIDATE', color: 'red' },
                { rule: 'High Revenue + High Risk', action: 'PRICE INCREASE', color: 'amber' },
                { rule: 'High Admin Burden', action: 'FLAG FOR REVIEW', color: 'orange' },
                { rule: 'High Value + Low Risk', action: 'RETAIN & EXPAND', color: 'green' }
              ].map((rule, idx) => (
                <div key={idx} className="bg-[#1e293b] p-4 rounded-lg border-2 border-green-200 flex items-center justify-between">
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

// Pricing Intelligence Bot
function PricingIntelligenceBot({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tier 4 Hub
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
            <div>
              <Badge className="bg-blue-600 text-white mb-2">PRICING ENGINE</Badge>
              <h1 className="text-3xl font-bold text-white">Pricing & Engagement Intelligence Bot</h1>
              <p className="text-slate-300">Automated pricing recommendations based on risk and complexity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <Card className="border-2 border-blue-400 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Zap className="w-6 h-6" />
              Core Pricing Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                'High Risk = Price Uplift (15-30%)',
                'Complex Groups = Bundled Pricing',
                'Repeated Issues = Price Increase',
                'Foreign PEP = Enhanced CDD Premium',
                'Missing UBO = Cannot Price Until Complete'
              ].map((rule, idx) => (
                <div key={idx} className="bg-[#1e293b] p-3 rounded-lg border border-blue-200 flex items-center gap-3">
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

// Portfolio Risk Dashboard
function PortfolioRiskDashboard({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tier 4 Hub
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl">
              <PieChart className="w-10 h-10 text-white" />
            </div>
            <div>
              <Badge className="bg-purple-600 text-white mb-2">PORTFOLIO VIEW</Badge>
              <h1 className="text-3xl font-bold text-white">Portfolio Risk Dashboard</h1>
              <p className="text-slate-300">Live firm-wide risk exposure and concentration monitoring</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Clients', value: '1,847', icon: Users, color: 'blue' },
            { label: 'High-Risk %', value: '12.4%', icon: AlertTriangle, color: 'red' },
            { label: 'Foreign PEP', value: 47, icon: AlertCircle, color: 'orange' },
            { label: 'Active Escalations', value: 12, icon: TrendingUp, color: 'amber' },
            { label: 'Exposure Countries', value: 23, icon: BarChart3, color: 'purple' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-2 hover:border-purple-400 transition-colors cursor-pointer">
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

        <Card className="border-2 border-purple-400 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <AlertTriangle className="w-6 h-6" />
              Concentration Risk Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { alert: 'Real Estate Industry', value: '28% of portfolio', severity: 'High' },
                { alert: 'China Geographic Exposure', value: '15% of clients', severity: 'Medium' },
                { alert: 'Foreign PEP Concentration', value: '2.5% of portfolio', severity: 'Medium' },
                { alert: 'High-Risk Client Cluster', value: '12.4% trending up', severity: 'High' }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#1e293b] p-4 rounded-lg border-2 border-purple-200 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{item.alert}</p>
                    <p className="text-sm text-slate-300">{item.value}</p>
                  </div>
                  <Badge className={
                    item.severity === 'High' ? 'bg-red-600 text-white' :
                    'bg-amber-100 text-amber-700'
                  }>
                    {item.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Revenue Leakage Bot
function RevenueLeakageBot({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="bg-[#1e293b] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tier 4 Hub
          </Button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-xl">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <div>
              <Badge className="bg-amber-600 text-white mb-2">REVENUE RECOVERY</Badge>
              <h1 className="text-3xl font-bold text-white">Revenue Leakage & Billing Bot</h1>
              <p className="text-slate-300">Detect and recover lost revenue from scope creep and underbilling</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Billed', value: '$2.4M', icon: DollarSign, color: 'green' },
            { label: 'Leakage Amount', value: '$187K', icon: TrendingDown, color: 'red' },
            { label: 'Underbilled Jobs', value: 34, icon: AlertTriangle, color: 'amber' },
            { label: 'Unpaid Revenue', value: '$94K', icon: Clock, color: 'orange' }
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

        <Card className="border-2 border-amber-400 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <AlertCircle className="w-6 h-6" />
              Revenue Leakage Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { category: 'Scope Creep', amount: '$67K', percentage: '36%' },
                { category: 'Free Work Performed', amount: '$52K', percentage: '28%' },
                { category: 'Missed Billing', amount: '$41K', percentage: '22%' },
                { category: 'Excessive Revisions', amount: '$27K', percentage: '14%' }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#1e293b] p-4 rounded-lg border-2 border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-white">{item.category}</p>
                    <Badge className="bg-red-100 text-red-700">{item.percentage}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{item.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

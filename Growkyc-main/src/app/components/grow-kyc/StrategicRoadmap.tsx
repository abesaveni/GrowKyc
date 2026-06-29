import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Clock,
  Target,
  TrendingUp,
  Zap,
  Rocket,
  Shield,
  Users,
  Smartphone,
  Brain,
  Globe,
  DollarSign,
  Award,
  BarChart3,
  Lock,
  Cloud,
  Code,
  Sparkles,
  ChevronRight,
  Star,
  AlertTriangle,
  Lightbulb,
  Trophy
} from 'lucide-react';
import { CompetitorAnalysis } from './CompetitorAnalysis';
import { VerticalUserTypes } from './VerticalUserTypes';

interface StrategicRoadmapProps {
  onBack: () => void;
}

export function StrategicRoadmap({ onBack }: StrategicRoadmapProps) {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCompetitorAnalysis, setShowCompetitorAnalysis] = useState(false);
  const [showVerticalUserTypes, setShowVerticalUserTypes] = useState(false);

  if (showCompetitorAnalysis) {
    return <CompetitorAnalysis onBack={() => setShowCompetitorAnalysis(false)} />;
  }

  if (showVerticalUserTypes) {
    return <VerticalUserTypes onBack={() => setShowVerticalUserTypes(false)} />;
  }

  const phases = [
    {
      phase: 1,
      name: 'Foundation',
      timeline: 'Q2 2026 (3 months)',
      status: 'in-progress',
      investment: '$800K',
      color: 'from-slate-800 to-slate-700',
      icon: Rocket,
      completion: 45,
      initiatives: [
        {
          title: 'Mobile Responsive Design',
          category: 'UX',
          priority: 'Critical',
          impact: 'High',
          effort: 'Medium',
          status: 'in-progress',
          description: 'Optimize all interfaces for tablet and mobile devices',
          kpis: ['40% mobile usage', 'Sub-3s mobile load times'],
          progress: 65
        },
        {
          title: 'API Platform v1.0',
          category: 'Infrastructure',
          priority: 'Critical',
          impact: 'High',
          effort: 'High',
          status: 'in-progress',
          description: 'Launch comprehensive RESTful API with documentation',
          kpis: ['10+ integration partners', '99.9% API uptime'],
          progress: 40
        },
        {
          title: 'Advanced RBAC System',
          category: 'Security',
          priority: 'High',
          impact: 'High',
          effort: 'Medium',
          status: 'planned',
          description: 'Granular permissions with 50+ permission types',
          kpis: ['Custom role builder', 'Field-level security'],
          progress: 20
        },
        {
          title: 'One-Click Regulatory Reports',
          category: 'Automation',
          priority: 'High',
          impact: 'High',
          effort: 'Medium',
          status: 'planned',
          description: 'Auto-generate AUSTRAC and jurisdiction-specific reports',
          kpis: ['80% time savings', '100% accuracy'],
          progress: 15
        },
        {
          title: 'Performance Optimization',
          category: 'Infrastructure',
          priority: 'High',
          impact: 'Medium',
          effort: 'Low',
          status: 'in-progress',
          description: 'Achieve sub-1 second page load times',
          kpis: ['< 1s load time', 'Lighthouse score > 90'],
          progress: 70
        },
        {
          title: 'MFA Mandatory Rollout',
          category: 'Security',
          priority: 'Critical',
          impact: 'High',
          effort: 'Low',
          status: 'completed',
          description: 'Multi-factor authentication for all users',
          kpis: ['100% MFA adoption', 'Zero unauthorized access'],
          progress: 100
        }
      ]
    },
    {
      phase: 2,
      name: 'Intelligence',
      timeline: 'Q3 2026 (3 months)',
      status: 'planned',
      investment: '$1.2M',
      color: 'from-slate-800 to-slate-700',
      icon: Brain,
      completion: 0,
      initiatives: [
        {
          title: 'Dynamic Risk Scoring Engine',
          category: 'AI/ML',
          priority: 'Critical',
          impact: 'Very High',
          effort: 'High',
          status: 'planned',
          description: 'ML-powered 0-100 risk scores with real-time updates',
          kpis: ['95%+ prediction accuracy', 'Explainable AI'],
          progress: 0
        },
        {
          title: 'Real-Time Sanctions Screening',
          category: 'Compliance',
          priority: 'Critical',
          impact: 'Very High',
          effort: 'High',
          status: 'planned',
          description: 'Screen against 200+ sanctions lists with AI matching',
          kpis: ['< 3s screening time', '< 5% false positives'],
          progress: 0
        },
        {
          title: 'AI-Powered Case Routing',
          category: 'Automation',
          priority: 'High',
          impact: 'High',
          effort: 'Medium',
          status: 'planned',
          description: 'Intelligent assignment based on skills and workload',
          kpis: ['40% efficiency gain', '< 5min routing time'],
          progress: 0
        },
        {
          title: 'Advanced OCR & Document Intelligence',
          category: 'AI/ML',
          priority: 'High',
          impact: 'Very High',
          effort: 'High',
          status: 'planned',
          description: 'Multi-language OCR with auto-extraction and fraud detection',
          kpis: ['100+ languages', '98%+ accuracy', '60% time savings'],
          progress: 0
        },
        {
          title: 'Predictive Analytics Dashboard',
          category: 'Analytics',
          priority: 'High',
          impact: 'High',
          effort: 'Medium',
          status: 'planned',
          description: 'Forecast compliance trends 6-12 months ahead',
          kpis: ['Churn prediction', 'Revenue forecasting'],
          progress: 0
        },
        {
          title: 'Client Self-Service Portal (Beta)',
          category: 'Client Experience',
          priority: 'High',
          impact: 'High',
          effort: 'High',
          status: 'planned',
          description: 'Let clients upload documents and track onboarding',
          kpis: ['50% self-service rate', 'NPS > 70'],
          progress: 0
        }
      ]
    },
    {
      phase: 3,
      name: 'Scale',
      timeline: 'Q4 2026 (3 months)',
      status: 'planned',
      investment: '$1.1M',
      color: 'from-slate-800 to-slate-700',
      icon: Globe,
      completion: 0,
      initiatives: [
        {
          title: 'Native Mobile Apps (iOS/Android)',
          category: 'Mobile',
          priority: 'Critical',
          impact: 'Very High',
          effort: 'Very High',
          status: 'planned',
          description: 'Full-featured native apps with offline mode',
          kpis: ['40% mobile usage', 'App Store rating > 4.5'],
          progress: 0
        },
        {
          title: 'Multi-Tenant Architecture',
          category: 'Enterprise',
          priority: 'Critical',
          impact: 'Very High',
          effort: 'Very High',
          status: 'planned',
          description: 'Support enterprise clients with multiple entities',
          kpis: ['10+ enterprise clients', 'White-label capability'],
          progress: 0
        },
        {
          title: 'Blockchain Audit Trails',
          category: 'Security',
          priority: 'High',
          impact: 'High',
          effort: 'High',
          status: 'planned',
          description: 'Immutable, tamper-proof compliance records',
          kpis: ['100% audit coverage', '7+ year retention'],
          progress: 0
        },
        {
          title: 'Regulatory Intelligence Engine',
          category: 'Compliance',
          priority: 'Critical',
          impact: 'Very High',
          effort: 'High',
          status: 'planned',
          description: 'Monitor 200+ regulators for real-time changes',
          kpis: ['< 24hr update time', '100% coverage'],
          progress: 0
        },
        {
          title: 'ISO 27001 + SOC 2 Certification',
          category: 'Security',
          priority: 'Critical',
          impact: 'Very High',
          effort: 'Very High',
          status: 'planned',
          description: 'Enterprise-grade security certifications',
          kpis: ['SOC 2 Type II', 'ISO 27001 certified'],
          progress: 0
        },
        {
          title: 'Marketplace Launch',
          category: 'Ecosystem',
          priority: 'High',
          impact: 'High',
          effort: 'High',
          status: 'planned',
          description: 'Third-party app directory with revenue sharing',
          kpis: ['20+ apps', 'Developer SDK'],
          progress: 0
        }
      ]
    },
    {
      phase: 4,
      name: 'Dominance',
      timeline: '2027 (12 months)',
      status: 'future',
      investment: '$1.4M',
      color: 'from-slate-800 to-slate-700',
      icon: Award,
      completion: 0,
      initiatives: [
        {
          title: 'Global Expansion (15+ Jurisdictions)',
          category: 'Growth',
          priority: 'Critical',
          impact: 'Very High',
          effort: 'Very High',
          status: 'future',
          description: 'Deep compliance packs for 15+ countries',
          kpis: ['$15M ARR', 'Top 3 APAC market share'],
          progress: 0
        },
        {
          title: 'AI Copilot 2.0 (GPT-4 Level)',
          category: 'AI/ML',
          priority: 'Critical',
          impact: 'Very High',
          effort: 'Very High',
          status: 'future',
          description: 'Advanced AI with contextual reasoning and learning',
          kpis: ['95%+ user satisfaction', 'Multi-turn conversations'],
          progress: 0
        },
        {
          title: 'Advanced Behavioral Analytics',
          category: 'AI/ML',
          priority: 'High',
          impact: 'High',
          effort: 'High',
          status: 'future',
          description: 'Transaction pattern analysis and anomaly detection',
          kpis: ['97.8%+ accuracy', 'Real-time detection'],
          progress: 0
        },
        {
          title: 'Industry Benchmarking Platform',
          category: 'Analytics',
          priority: 'High',
          impact: 'High',
          effort: 'High',
          status: 'future',
          description: 'Anonymous peer comparison and maturity scoring',
          kpis: ['1000+ participants', 'Quarterly reports'],
          progress: 0
        },
        {
          title: 'White-Label Enterprise Edition',
          category: 'Enterprise',
          priority: 'High',
          impact: 'Very High',
          effort: 'High',
          status: 'future',
          description: 'Fully branded solution for large firms',
          kpis: ['5+ enterprise deals', '$500K+ ACV'],
          progress: 0
        },
        {
          title: 'Strategic M&A Integrations',
          category: 'Growth',
          priority: 'High',
          impact: 'Very High',
          effort: 'Very High',
          status: 'future',
          description: 'Acquire and integrate complementary technologies',
          kpis: ['2-3 acquisitions', 'Seamless integration'],
          progress: 0
        }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Initiatives', icon: Target, color: 'text-gray-600' },
    { id: 'AI/ML', name: 'AI & Machine Learning', icon: Brain, color: 'text-purple-600' },
    { id: 'Security', name: 'Security & Compliance', icon: Shield, color: 'text-red-600' },
    { id: 'Infrastructure', name: 'Infrastructure', icon: Cloud, color: 'text-blue-600' },
    { id: 'Mobile', name: 'Mobile Experience', icon: Smartphone, color: 'text-green-600' },
    { id: 'Automation', name: 'Automation', icon: Zap, color: 'text-yellow-600' },
    { id: 'Enterprise', name: 'Enterprise Features', icon: Users, color: 'text-indigo-600' },
    { id: 'Analytics', name: 'Analytics & BI', icon: BarChart3, color: 'text-cyan-600' }
  ];

  const metrics = [
    { label: 'Total Investment', value: '$4.5M', change: 'over 18 months', icon: DollarSign, color: 'text-green-600' },
    { label: 'Expected ROI', value: '300%+', change: 'by 2028', icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Target ARR', value: '$15M', change: 'by EOY 2027', icon: Target, color: 'text-blue-600' },
    { label: 'Market Position', value: 'Top 3', change: 'APAC by 2027', icon: Award, color: 'text-amber-600' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'planned': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'future': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-600 text-white';
      case 'High': return 'bg-orange-600 text-white';
      case 'Medium': return 'bg-yellow-600 text-white';
      case 'Low': return 'bg-gray-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const filteredPhases = selectedPhase !== null 
    ? phases.filter(p => p.phase === selectedPhase)
    : phases;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowVerticalUserTypes(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Users className="w-4 h-4 mr-2" />
              View User Types
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowCompetitorAnalysis(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Trophy className="w-4 h-4 mr-2" />
              View Competitors
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">Strategic Roadmap</h1>
            <p className="text-white/90 text-xl">Path to Market Leadership • 2026-2028</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm text-white/80">{metric.label}</div>
              </div>
              <div className="text-4xl font-bold mb-1">{metric.value}</div>
              <div className="text-xs text-white/70">{metric.change}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Selection */}
      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Development Phases</h2>
            <p className="text-gray-600">Track progress across our 4-phase roadmap to market dominance</p>
          </div>
          <Button
            variant={selectedPhase === null ? 'default' : 'outline'}
            onClick={() => setSelectedPhase(null)}
            className="h-auto py-3"
          >
            View All Phases
          </Button>
        </div>

        {/* Phase Cards */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {phases.map((phase) => {
            const PhaseIcon = phase.icon;
            return (
              <Card
                key={phase.phase}
                className={`cursor-pointer transition-all hover:shadow-xl border-2 ${
                  selectedPhase === phase.phase
                    ? 'ring-4 ring-indigo-200 border-indigo-400'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
                onClick={() => setSelectedPhase(selectedPhase === phase.phase ? null : phase.phase)}
              >
                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${phase.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <PhaseIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="mb-2">
                    <Badge className={getStatusColor(phase.status)}>
                      {phase.status === 'completed' ? 'Completed' : 
                       phase.status === 'in-progress' ? 'In Progress' :
                       phase.status === 'planned' ? 'Planned' : 'Future'}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Phase {phase.phase}</h3>
                  <p className="text-lg font-semibold text-gray-700 mb-1">{phase.name}</p>
                  <p className="text-sm text-gray-600 mb-4">{phase.timeline}</p>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{phase.completion}%</span>
                    </div>
                    <Progress value={phase.completion} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Investment</span>
                    <span className="font-bold text-indigo-600">{phase.investment}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <CategoryIcon className={`w-4 h-4 ${selectedCategory === category.id ? 'text-white' : category.color}`} />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Initiatives */}
        <div className="space-y-8">
          {filteredPhases.map((phase) => {
            const PhaseIcon = phase.icon;
            const filteredInitiatives = selectedCategory === 'all'
              ? phase.initiatives
              : phase.initiatives.filter(i => i.category === selectedCategory);

            if (filteredInitiatives.length === 0) return null;

            return (
              <div key={phase.phase}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${phase.color} rounded-xl flex items-center justify-center`}>
                    <PhaseIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Phase {phase.phase}: {phase.name}
                    </h3>
                    <p className="text-gray-600">{phase.timeline} • {phase.investment} • {filteredInitiatives.length} initiatives</p>
                  </div>
                  <Badge className={`${getStatusColor(phase.status)} text-base px-4 py-1`}>
                    {phase.completion}% Complete
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {filteredInitiatives.map((initiative, idx) => (
                    <Card key={idx} className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-xl font-bold text-gray-900">{initiative.title}</h4>
                              <Badge className={getPriorityColor(initiative.priority)}>
                                {initiative.priority}
                              </Badge>
                              <Badge variant="outline" className="text-gray-700">
                                {initiative.category}
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-3">{initiative.description}</p>
                            
                            {/* KPIs */}
                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-medium text-gray-600">KPIs:</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {initiative.kpis.map((kpi, kpiIdx) => (
                                  <Badge key={kpiIdx} variant="secondary" className="text-xs">
                                    {kpi}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Effort & Impact */}
                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-600" />
                                <span className="text-gray-600">Impact:</span>
                                <span className="font-semibold text-gray-900">{initiative.impact}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-600">Effort:</span>
                                <span className="font-semibold text-gray-900">{initiative.effort}</span>
                              </div>
                            </div>
                          </div>

                          {/* Progress Circle */}
                          <div className="flex flex-col items-center gap-2 ml-6">
                            <div className="relative w-24 h-24">
                              <svg className="transform -rotate-90 w-24 h-24">
                                <circle
                                  cx="48"
                                  cy="48"
                                  r="40"
                                  stroke="currentColor"
                                  strokeWidth="8"
                                  fill="transparent"
                                  className="text-gray-200"
                                />
                                <circle
                                  cx="48"
                                  cy="48"
                                  r="40"
                                  stroke="currentColor"
                                  strokeWidth="8"
                                  fill="transparent"
                                  strokeDasharray={`${2 * Math.PI * 40}`}
                                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - initiative.progress / 100)}`}
                                  className={
                                    initiative.progress === 100 ? 'text-green-600' :
                                    initiative.progress > 50 ? 'text-blue-600' :
                                    initiative.progress > 0 ? 'text-purple-600' :
                                    'text-gray-400'
                                  }
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-gray-900">{initiative.progress}%</span>
                              </div>
                            </div>
                            {initiative.progress === 100 && (
                              <Badge className="bg-green-600 text-white">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Complete
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Progress value={initiative.progress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Wins Section */}
        <Card className="mt-12 border-2 border-green-300 bg-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Sparkles className="w-6 h-6 text-green-600" />
              Quick Wins (Next 30 Days)
            </CardTitle>
            <CardDescription className="text-base">
              Low-effort, high-impact improvements we can ship immediately
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Keyboard Shortcuts', description: 'Power user productivity boost', icon: Code },
                { title: 'Dark Mode', description: 'Reduce eye strain for analysts', icon: Star },
                { title: 'Bulk Actions', description: 'Select multiple clients at once', icon: Users },
                { title: 'Advanced Search Filters', description: 'Find clients faster', icon: Target },
                { title: 'Export to CSV/Excel', description: 'From all data tables', icon: BarChart3 },
                { title: 'Enhanced Notifications', description: 'Granular alert preferences', icon: AlertTriangle }
              ].map((win, idx) => {
                const WinIcon = win.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-green-200 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <WinIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{win.title}</h4>
                      <p className="text-sm text-gray-600">{win.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Success Metrics */}
        <Card className="mt-12 bg-gray-50 border-2 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Award className="w-6 h-6 text-indigo-600" />
              Success Metrics & Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-indigo-600 font-semibold mb-4 text-lg">6 Months (Sep 2026)</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    100 paying enterprise customers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    $1.5M ARR achieved
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-400" />
                    Mobile apps launched (iOS/Android)
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-400" />
                    99.5% uptime SLA
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-400" />
                    NPS score {">"} 50
                  </li>
                </ul>
              </div>
              <div>
                <div className="text-purple-600 font-semibold mb-4 text-lg">12 Months (Mar 2027)</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-400" />
                    300 paying customers
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-400" />
                    $5M ARR milestone
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-400" />
                    SOC 2 Type II certified
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-400" />
                    10+ strategic integrations
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-400" />
                    Marketplace with 20+ apps
                  </li>
                </ul>
              </div>
              <div>
                <div className="text-pink-600 font-semibold mb-4 text-lg">18 Months (Sep 2027)</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-400" />
                    600 paying customers
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-400" />
                    $10M ARR achieved
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-400" />
                    Profitable (positive EBITDA)
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-400" />
                    Top 3 in APAC market share
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-gray-400" />
                    Series A ($15M+) OR bootstrapped
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitive Advantage */}
        <Card className="mt-12 bg-gray-50 border-2 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Lightbulb className="w-6 h-6 text-amber-600" />
              Competitive Differentiation
            </CardTitle>
            <CardDescription className="text-base">
              What makes Grow KYC the market leader
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  title: 'Hyper-Local APAC Expertise',
                  description: 'Deep AUSTRAC/ASIC knowledge vs generic global tools',
                  icon: Globe,
                  color: 'text-blue-600 bg-blue-100'
                },
                {
                  title: 'Professional Services Focus',
                  description: 'Built FOR accountants, lawyers, wealth managers',
                  icon: Briefcase,
                  color: 'text-purple-600 bg-purple-100'
                },
                {
                  title: 'End-to-End Platform',
                  description: 'KYC + AML + Transaction Monitoring + Trust Accounting',
                  icon: CheckCircle,
                  color: 'text-green-600 bg-green-100'
                },
                {
                  title: 'AI-First, Human-Centered',
                  description: 'AI handles 80% routine tasks, humans do complex judgment',
                  icon: Brain,
                  color: 'text-pink-600 bg-pink-100'
                },
                {
                  title: 'Open Ecosystem',
                  description: 'Integrates with tools professionals already use',
                  icon: Code,
                  color: 'text-indigo-600 bg-indigo-100'
                },
                {
                  title: 'Bank-Grade Security',
                  description: 'ISO 27001, SOC 2, blockchain audit trails',
                  icon: Shield,
                  color: 'text-red-600 bg-red-100'
                }
              ].map((advantage, idx) => {
                const AdvantageIcon = advantage.icon;
                return (
                  <div key={idx} className="flex items-start gap-4 p-5 bg-white rounded-xl border-2 border-amber-200 hover:shadow-lg transition-shadow">
                    <div className={`w-12 h-12 ${advantage.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <AdvantageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">{advantage.title}</h4>
                      <p className="text-sm text-gray-700">{advantage.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-12 text-white">
          <Rocket className="w-16 h-16 mx-auto mb-6 text-white" />
          <h3 className="text-3xl font-bold mb-4">Ready to Lead the Market?</h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Our roadmap positions Grow KYC as the #1 compliance platform for professional firms globally.
            The opportunity is clear. The time to act is now.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Star className="w-5 h-5 mr-2" />
              Download Full Strategy (PDF)
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 text-white border-white/30 hover:bg-white/20">
              <Users className="w-5 h-5 mr-2" />
              Schedule Strategy Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import this in SystemSettings.tsx:
// import { StrategicRoadmap } from './StrategicRoadmap';

// Add to Briefcase icon after use
import { Briefcase } from 'lucide-react';
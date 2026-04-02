import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Target,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  BarChart,
  PieChart,
  Calculator,
  FileText,
  Users,
  Globe,
  DollarSign,
  Building,
  Zap,
  Eye,
  Edit,
  RefreshCw,
  Download,
  Lock,
  Unlock,
  Info
} from 'lucide-react';

type RiskTier = 'low' | 'medium' | 'high' | 'critical';
type RiskCategory = 'client-type' | 'geographic' | 'transaction' | 'ownership' | 'regulatory';

interface RiskFactor {
  category: RiskCategory;
  factor: string;
  description: string;
  score: number;
  maxScore: number;
  weight: number;
  evidence: string[];
}

interface RiskAssessment {
  clientId: string;
  clientName: string;
  assessmentDate: Date;
  assessedBy: string;
  overallScore: number;
  riskTier: RiskTier;
  previousScore?: number;
  previousTier?: RiskTier;
  factors: RiskFactor[];
  mitigatingControls: string[];
  recommendations: string[];
  approvedBy?: string;
  approvalDate?: Date;
  nextReviewDue: Date;
}

export function RiskAssessmentModule() {
  const [activeTab, setActiveTab] = useState<'overview' | 'calculator' | 'matrix' | 'trends' | 'methodology'>('overview');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const riskFactorDefinitions = [
    {
      category: 'client-type' as RiskCategory,
      name: 'Client Type Risk',
      factors: [
        { name: 'Individual', baseScore: 10, description: 'Natural person client' },
        { name: 'Company - SME', baseScore: 15, description: 'Small/medium private company' },
        { name: 'Company - Large', baseScore: 20, description: 'Large corporate entity' },
        { name: 'Trust - Family', baseScore: 20, description: 'Family discretionary trust' },
        { name: 'Trust - Complex', baseScore: 30, description: 'Complex trust structures' },
        { name: 'Partnership', baseScore: 15, description: 'Business partnership' },
        { name: 'SMSF', baseScore: 10, description: 'Self-managed superannuation fund' },
        { name: 'Foreign Entity', baseScore: 35, description: 'Non-resident entity' }
      ]
    },
    {
      category: 'geographic' as RiskCategory,
      name: 'Geographic Risk',
      factors: [
        { name: 'Australia Only', baseScore: 0, description: 'All operations in Australia' },
        { name: 'New Zealand', baseScore: 5, description: 'Operations in NZ' },
        { name: 'High-Risk Jurisdiction', baseScore: 40, description: 'FATF identified country' },
        { name: 'Sanctioned Country', baseScore: 100, description: 'UN/DFAT sanctioned' },
        { name: 'Tax Haven', baseScore: 30, description: 'Offshore tax haven' }
      ]
    },
    {
      category: 'transaction' as RiskCategory,
      name: 'Transaction Profile',
      factors: [
        { name: 'Low Value (<$100k)', baseScore: 5, description: 'Annual turnover under $100k' },
        { name: 'Medium Value ($100k-$1M)', baseScore: 10, description: 'Annual turnover $100k-$1M' },
        { name: 'High Value (>$1M)', baseScore: 20, description: 'Annual turnover over $1M' },
        { name: 'Cash Intensive', baseScore: 30, description: 'High cash transaction volume' },
        { name: 'Complex Transactions', baseScore: 25, description: 'Unusual transaction patterns' },
        { name: 'Cross-Border Payments', baseScore: 20, description: 'International transfers' }
      ]
    },
    {
      category: 'ownership' as RiskCategory,
      name: 'Ownership & Control',
      factors: [
        { name: 'Simple Structure', baseScore: 0, description: 'Transparent single owner' },
        { name: 'Multiple Shareholders', baseScore: 10, description: '2-5 shareholders' },
        { name: 'Complex Structure', baseScore: 25, description: 'Multi-layered ownership' },
        { name: 'Nominee Arrangements', baseScore: 30, description: 'Use of nominees' },
        { name: 'Undisclosed Beneficial Owners', baseScore: 40, description: 'UBO not identified' },
        { name: 'PEP Connection', baseScore: 50, description: 'Politically exposed person' }
      ]
    },
    {
      category: 'regulatory' as RiskCategory,
      name: 'Regulatory & Compliance',
      factors: [
        { name: 'No Adverse History', baseScore: 0, description: 'Clean compliance record' },
        { name: 'Minor Breaches', baseScore: 15, description: 'Historical minor non-compliance' },
        { name: 'Regulatory Investigation', baseScore: 35, description: 'Under investigation' },
        { name: 'Previous ML/TF Concerns', baseScore: 60, description: 'Past AML issues' },
        { name: 'Sanctions Match', baseScore: 100, description: 'Listed on sanctions list' },
        { name: 'Adverse Media', baseScore: 30, description: 'Negative media coverage' }
      ]
    }
  ];

  const [sampleAssessment] = useState<RiskAssessment>({
    clientId: 'C-2024-001',
    clientName: 'TechCorp Pty Ltd',
    assessmentDate: new Date('2024-02-15'),
    assessedBy: 'Emma Wilson',
    overallScore: 40,
    riskTier: 'medium',
    previousScore: 60,
    previousTier: 'high',
    factors: [
      {
        category: 'client-type',
        factor: 'Company - SME',
        description: 'Small/medium private company',
        score: 15,
        maxScore: 35,
        weight: 20,
        evidence: ['ASIC company extract', 'Financial statements']
      },
      {
        category: 'geographic',
        factor: 'Australia Only',
        description: 'All operations within Australia',
        score: 0,
        maxScore: 40,
        weight: 25,
        evidence: ['Address verification', 'ABN lookup']
      },
      {
        category: 'transaction',
        factor: 'Medium Value',
        description: 'Annual turnover $500k',
        score: 10,
        maxScore: 30,
        weight: 20,
        evidence: ['Financial statements', 'Bank statements']
      },
      {
        category: 'ownership',
        factor: 'Multiple Shareholders',
        description: '3 shareholders, all identified',
        score: 10,
        maxScore: 50,
        weight: 20,
        evidence: ['Shareholder register', 'UBO declaration']
      },
      {
        category: 'regulatory',
        factor: 'No Adverse History',
        description: 'Clean compliance record',
        score: 0,
        maxScore: 60,
        weight: 15,
        evidence: ['Screening report', 'Adverse media check']
      }
    ],
    mitigatingControls: [
      'Enhanced CDD conducted and verified',
      'Annual financial statement review',
      'Quarterly transaction monitoring',
      'Independent source of funds verification'
    ],
    recommendations: [
      'Maintain standard CDD monitoring',
      'Annual review cycle appropriate',
      'No enhanced measures required at this time'
    ],
    approvedBy: 'Michael Chen',
    approvalDate: new Date('2024-02-16'),
    nextReviewDue: new Date('2025-02-15')
  });

  const getRiskTierLabel = (score: number): RiskTier => {
    if (score >= 75) return 'critical';
    if (score >= 50) return 'high';
    if (score >= 25) return 'medium';
    return 'low';
  };

  const getRiskColor = (tier: RiskTier) => {
    switch (tier) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'orange';
      case 'critical': return 'red';
    }
  };

  const categoryLabels: Record<RiskCategory, string> = {
    'client-type': 'Client Type',
    'geographic': 'Geographic',
    'transaction': 'Transaction Profile',
    'ownership': 'Ownership & Control',
    'regulatory': 'Regulatory'
  };

  const portfolioDistribution = {
    low: 42,
    medium: 31,
    high: 13,
    critical: 2
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Target className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Risk Assessment</h1>
              <p className="text-xl text-orange-100">Risk-Based Approach & ML/TF Risk Scoring</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-orange-600 hover:bg-orange-50">
              <Calculator className="w-5 h-5 mr-2" />
              New Assessment
            </Button>
            <Button className="bg-white text-orange-600 hover:bg-orange-50">
              <Download className="w-5 h-5 mr-2" />
              Export Matrix
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-6 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">Portfolio Avg</h3>
              <BarChart className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">32.5</p>
            <p className="text-sm text-orange-100 mt-1">Medium risk</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Low Risk</h3>
              <CheckCircle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-green-300">{portfolioDistribution.low}</p>
            <p className="text-xs text-white/80">48% of clients</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Medium</h3>
              <AlertTriangle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-yellow-300">{portfolioDistribution.medium}</p>
            <p className="text-xs text-white/80">35% of clients</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">High</h3>
              <AlertTriangle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-orange-300">{portfolioDistribution.high}</p>
            <p className="text-xs text-white/80">15% of clients</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Critical</h3>
              <XCircle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-red-300">{portfolioDistribution.critical}</p>
            <p className="text-xs text-white/80">2% of clients</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Trend</h3>
              <TrendingDown className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-green-300">-5.2</p>
            <p className="text-xs text-white/80">vs last quarter</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'calculator', label: 'Risk Calculator', icon: Calculator },
            { id: 'matrix', label: 'Risk Matrix', icon: BarChart },
            { id: 'trends', label: 'Trends & Analytics', icon: TrendingUp },
            { id: 'methodology', label: 'Methodology', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-orange-600 text-orange-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Sample Assessment Card */}
          <div className="bg-white rounded-lg border-2 border-yellow-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{sampleAssessment.clientName}</h3>
                  <span className={`px-4 py-2 bg-${getRiskColor(sampleAssessment.riskTier)}-100 text-${getRiskColor(sampleAssessment.riskTier)}-700 text-lg font-bold rounded-full`}>
                    {sampleAssessment.riskTier.toUpperCase()} RISK
                  </span>
                  {sampleAssessment.previousTier && sampleAssessment.previousTier !== sampleAssessment.riskTier && (
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-600 font-semibold">
                        Improved from {sampleAssessment.previousTier.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Assessed by {sampleAssessment.assessedBy}</span>
                  <span>•</span>
                  <span>{sampleAssessment.assessmentDate.toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Approved by {sampleAssessment.approvedBy}</span>
                  <span>•</span>
                  <span>Next Review: {sampleAssessment.nextReviewDue.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Eye className="w-4 h-4 mr-2" />
                  View Full
                </Button>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reassess
                </Button>
              </div>
            </div>

            {/* Risk Score Visualization */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-gray-900">Overall Risk Score</h4>
                <div className="flex items-center gap-4">
                  {sampleAssessment.previousScore && (
                    <div className="text-sm text-gray-600">
                      Previous: <span className="font-bold">{sampleAssessment.previousScore}</span>
                    </div>
                  )}
                  <div className="text-3xl font-bold text-orange-600">
                    {sampleAssessment.overallScore}
                    <span className="text-lg text-gray-600">/100</span>
                  </div>
                </div>
              </div>
              <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full flex">
                  <div className="bg-green-500" style={{ width: '25%' }} />
                  <div className="bg-yellow-500" style={{ width: '25%' }} />
                  <div className="bg-orange-500" style={{ width: '25%' }} />
                  <div className="bg-red-500" style={{ width: '25%' }} />
                </div>
                <div 
                  className="relative -mt-8 h-8 flex items-center justify-center"
                  style={{ marginLeft: `${sampleAssessment.overallScore}%` }}
                >
                  <div className="w-1 h-12 bg-gray-900" />
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs font-semibold text-gray-600">
                <span>0 - Low</span>
                <span>25 - Medium</span>
                <span>50 - High</span>
                <span>75 - Critical</span>
                <span>100</span>
              </div>
            </div>

            {/* Risk Factors Breakdown */}
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Risk Factor Breakdown</h4>
              {sampleAssessment.factors.map((factor, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h5 className="font-semibold text-gray-900">{categoryLabels[factor.category]}</h5>
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded">
                          Weight: {factor.weight}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1"><strong>{factor.factor}</strong> - {factor.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {factor.evidence.map((evidence, evidenceIndex) => (
                          <span key={evidenceIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {evidence}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-gray-900">{factor.score}</p>
                      <p className="text-xs text-gray-600">max {factor.maxScore}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        factor.score === 0 ? 'bg-green-500' :
                        factor.score <= factor.maxScore * 0.3 ? 'bg-yellow-500' :
                        factor.score <= factor.maxScore * 0.6 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Mitigating Controls */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Mitigating Controls
              </h4>
              <ul className="space-y-2">
                {sampleAssessment.mitigatingControls.map((control, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-800">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{control}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Recommendations
              </h4>
              <ul className="space-y-2">
                {sampleAssessment.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                    <Activity className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Portfolio Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Portfolio Risk Distribution</h3>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(portfolioDistribution).map(([tier, count]) => (
                <div key={tier} className={`p-6 rounded-lg border-2 border-${getRiskColor(tier as RiskTier)}-200 bg-${getRiskColor(tier as RiskTier)}-50`}>
                  <p className={`text-sm font-semibold text-${getRiskColor(tier as RiskTier)}-700 mb-2`}>
                    {tier.toUpperCase()} RISK
                  </p>
                  <p className={`text-4xl font-bold text-${getRiskColor(tier as RiskTier)}-600`}>{count}</p>
                  <p className={`text-sm text-${getRiskColor(tier as RiskTier)}-700 mt-2`}>
                    {Math.round((count / Object.values(portfolioDistribution).reduce((a, b) => a + b, 0)) * 100)}% of portfolio
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Risk Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Calculator className="w-6 h-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Risk Assessment Calculator</h3>
                <p className="text-sm text-blue-800">
                  Select applicable risk factors for each category. The system will calculate the overall risk score 
                  and assign the appropriate risk tier automatically.
                </p>
              </div>
            </div>
          </div>

          {riskFactorDefinitions.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h3>
              <div className="space-y-2">
                {category.factors.map((factor, factorIndex) => (
                  <label key={factorIndex} className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-colors">
                    <input type="radio" name={category.category} className="w-5 h-5 text-orange-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{factor.name}</p>
                      <p className="text-sm text-gray-600">{factor.description}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-bold ${
                      factor.baseScore === 0 ? 'bg-green-100 text-green-700' :
                      factor.baseScore <= 15 ? 'bg-yellow-100 text-yellow-700' :
                      factor.baseScore <= 30 ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      +{factor.baseScore}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-lg border-2 border-orange-500 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Calculated Risk Score</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-6xl font-bold text-orange-600">0</p>
                <p className="text-gray-600 mt-2">Select factors to calculate</p>
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-6">
                <Calculator className="w-6 h-6 mr-2" />
                Save Assessment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Methodology Tab */}
      {activeTab === 'methodology' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Risk Assessment Methodology</h3>
            
            <div className="prose max-w-none">
              <h4 className="text-lg font-bold text-gray-900 mt-6 mb-3">1. Risk-Based Approach</h4>
              <p className="text-gray-700 mb-4">
                The firm adopts a risk-based approach as required by the AML/CTF Act. This means applying customer due diligence 
                (CDD) measures that are commensurate with the assessed money laundering and terrorism financing (ML/TF) risk.
              </p>

              <h4 className="text-lg font-bold text-gray-900 mt-6 mb-3">2. Risk Scoring Model</h4>
              <p className="text-gray-700 mb-4">
                Risk is assessed across five categories with weighted contributions to the overall score:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li><strong>Client Type (20%)</strong> - Entity structure and complexity</li>
                <li><strong>Geographic Risk (25%)</strong> - Jurisdiction risk factors</li>
                <li><strong>Transaction Profile (20%)</strong> - Value and nature of transactions</li>
                <li><strong>Ownership & Control (20%)</strong> - Structure complexity and transparency</li>
                <li><strong>Regulatory (15%)</strong> - Compliance history and screening results</li>
              </ul>

              <h4 className="text-lg font-bold text-gray-900 mt-6 mb-3">3. Risk Tier Assignment</h4>
              <div className="grid grid-cols-4 gap-4 my-6">
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <p className="font-bold text-green-900 mb-2">LOW RISK</p>
                  <p className="text-3xl font-bold text-green-600 mb-2">0-24</p>
                  <p className="text-sm text-green-700">Standard CDD, Annual review</p>
                </div>
                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <p className="font-bold text-yellow-900 mb-2">MEDIUM RISK</p>
                  <p className="text-3xl font-bold text-yellow-600 mb-2">25-49</p>
                  <p className="text-sm text-yellow-700">Standard CDD, Semi-annual review</p>
                </div>
                <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                  <p className="font-bold text-orange-900 mb-2">HIGH RISK</p>
                  <p className="text-3xl font-bold text-orange-600 mb-2">50-74</p>
                  <p className="text-sm text-orange-700">Enhanced CDD, Quarterly review</p>
                </div>
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="font-bold text-red-900 mb-2">CRITICAL RISK</p>
                  <p className="text-3xl font-bold text-red-600 mb-2">75-100</p>
                  <p className="text-sm text-red-700">Enhanced CDD, Senior approval, Monthly review</p>
                </div>
              </div>

              <h4 className="text-lg font-bold text-gray-900 mt-6 mb-3">4. Approval Requirements</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li><strong>Low/Medium Risk:</strong> Client Manager approval</li>
                <li><strong>High Risk:</strong> Senior Manager approval required</li>
                <li><strong>Critical Risk:</strong> Senior Manager + Compliance Officer dual approval</li>
              </ul>

              <h4 className="text-lg font-bold text-gray-900 mt-6 mb-3">5. Review Frequency</h4>
              <p className="text-gray-700 mb-4">
                Risk assessments are reviewed on a schedule based on risk tier, and trigger-based reassessments 
                are conducted when material changes occur.
              </p>

              <h4 className="text-lg font-bold text-gray-900 mt-6 mb-3">6. Documentation</h4>
              <p className="text-gray-700 mb-4">
                All risk assessments must be documented with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Risk factors identified and scored</li>
                <li>Evidence supporting scores</li>
                <li>Mitigating controls applied</li>
                <li>Recommendations for ongoing monitoring</li>
                <li>Approval signatures and dates</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

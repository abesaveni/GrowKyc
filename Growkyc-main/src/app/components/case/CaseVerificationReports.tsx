import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Shield,
  FileText,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Bot,
  Sparkles,
  FileCheck,
  CreditCard,
  Home,
  Building2,
  Users,
  Globe,
  Search,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Calendar,
  User
} from 'lucide-react';

interface VerificationCheck {
  id: string;
  type: string;
  name: string;
  category: 'identity' | 'aml' | 'credit' | 'property' | 'affordability' | 'fraud' | 'entity';
  status: 'passed' | 'failed' | 'review' | 'pending';
  runDate: Date;
  runBy: string;
  aiBot?: string;
  icon: any;
  color: string;
  score?: number;
  findings: string[];
  documents: {
    name: string;
    type: string;
    url: string;
  }[];
  aiReport?: {
    summary: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    recommendations: string[];
    keyFindings: string[];
  };
}

interface CaseVerificationReportsProps {
  caseData: any;
}

export function CaseVerificationReports({ caseData }: CaseVerificationReportsProps) {
  const [expandedChecks, setExpandedChecks] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleExpanded = (checkId: string) => {
    const newSet = new Set(expandedChecks);
    if (newSet.has(checkId)) {
      newSet.delete(checkId);
    } else {
      newSet.add(checkId);
    }
    setExpandedChecks(newSet);
  };

  // Mock verification checks data
  const verificationChecks: VerificationCheck[] = [
    {
      id: 'check-001',
      type: 'Equifax Identity Verification',
      name: 'Enhanced Identity Check',
      category: 'identity',
      status: 'passed',
      runDate: new Date('2024-03-22T10:30:00'),
      runBy: 'compliance@growkyc.com',
      aiBot: 'Identity Guardian AI',
      icon: Shield,
      color: 'blue',
      score: 98,
      findings: [
        'Document authenticity verified',
        'Biometric match confirmed',
        'Address verified via electoral roll',
        'No fraud indicators detected'
      ],
      documents: [
        { name: 'Drivers License - Front.pdf', type: 'PDF', url: '#' },
        { name: 'Drivers License - Back.pdf', type: 'PDF', url: '#' },
        { name: 'Biometric Analysis Report.pdf', type: 'PDF', url: '#' },
        { name: 'Identity Verification Certificate.pdf', type: 'PDF', url: '#' }
      ],
      aiReport: {
        summary: 'Comprehensive identity verification completed with high confidence. All documents authenticated, biometric analysis passed, and cross-referenced with multiple authoritative data sources.',
        riskLevel: 'low',
        confidence: 98,
        recommendations: [
          'Identity verification is sufficient for onboarding',
          'No additional checks required at this time',
          'Schedule re-verification in 12 months as per policy'
        ],
        keyFindings: [
          'Document security features validated',
          'Facial biometric match: 99.2%',
          'Address confirmed via 3 independent sources',
          'No identity fraud flags in national databases'
        ]
      }
    },
    {
      id: 'check-002',
      type: 'AML Screening',
      name: 'PEP, Sanctions & Watchlist Screening',
      category: 'aml',
      status: 'passed',
      runDate: new Date('2024-03-22T10:35:00'),
      runBy: 'compliance@growkyc.com',
      aiBot: 'AML Sentinel AI',
      icon: Search,
      color: 'purple',
      score: 95,
      findings: [
        'No PEP matches found',
        'No sanctions list matches',
        'No adverse media alerts',
        'Clean watchlist screening'
      ],
      documents: [
        { name: 'AML Screening Report.pdf', type: 'PDF', url: '#' },
        { name: 'PEP Screening Results.pdf', type: 'PDF', url: '#' },
        { name: 'Sanctions Check Certificate.pdf', type: 'PDF', url: '#' },
        { name: 'Watchlist Screening Log.pdf', type: 'PDF', url: '#' }
      ],
      aiReport: {
        summary: 'Comprehensive AML screening completed across global sanctions lists, PEP databases, and adverse media sources. No matches or alerts identified. Client presents low AML/CTF risk.',
        riskLevel: 'low',
        confidence: 95,
        recommendations: [
          'Proceed with client onboarding',
          'Standard ongoing monitoring recommended',
          'Re-screen quarterly as per AML policy'
        ],
        keyFindings: [
          'Screened against 200+ global sanctions lists',
          'No PEP status identified',
          'No adverse media in past 10 years',
          'Source of funds declared and verified'
        ]
      }
    },
    {
      id: 'check-003',
      type: 'Credit Assessment',
      name: 'Comprehensive Credit Check',
      category: 'credit',
      status: 'review',
      runDate: new Date('2024-03-22T11:00:00'),
      runBy: 'credit@growkyc.com',
      aiBot: 'Credit Analyzer AI',
      icon: CreditCard,
      color: 'orange',
      score: 72,
      findings: [
        'Credit score: 720 (Good)',
        '2 credit enquiries in last 6 months',
        'Payment history: 98% on-time',
        '1 default cleared 3 years ago ($850)'
      ],
      documents: [
        { name: 'Credit Report - Equifax.pdf', type: 'PDF', url: '#' },
        { name: 'Credit Score Analysis.pdf', type: 'PDF', url: '#' },
        { name: 'Payment History Report.pdf', type: 'PDF', url: '#' },
        { name: 'Default Resolution Evidence.pdf', type: 'PDF', url: '#' }
      ],
      aiReport: {
        summary: 'Credit assessment reveals good creditworthiness with minor historical blemish now resolved. Current financial behavior is strong with consistent on-time payments. Recommend manual review of default circumstances.',
        riskLevel: 'medium',
        confidence: 85,
        recommendations: [
          'Request explanation letter for historical default',
          'Verify default resolution documentation',
          'Consider conditional approval pending satisfactory explanation',
          'May require additional security or higher interest rate'
        ],
        keyFindings: [
          'Credit score trend: Improving (+45 points over 2 years)',
          'Current credit utilization: 32% (healthy)',
          'No recent missed payments (24 months)',
          'Historical default fully paid and closed'
        ]
      }
    },
    {
      id: 'check-004',
      type: 'Property Valuation',
      name: 'Independent Property Appraisal',
      category: 'property',
      status: 'passed',
      runDate: new Date('2024-03-22T14:30:00'),
      runBy: 'valuation@growkyc.com',
      aiBot: 'Property Insights AI',
      icon: Home,
      color: 'green',
      score: 88,
      findings: [
        'Market value: $1,250,000 (confirmed)',
        'LVR: 72% (acceptable)',
        'Property condition: Good',
        'Title clear - no encumbrances'
      ],
      documents: [
        { name: 'Property Valuation Report.pdf', type: 'PDF', url: '#' },
        { name: 'Title Search Certificate.pdf', type: 'PDF', url: '#' },
        { name: 'Property Photos.pdf', type: 'PDF', url: '#' },
        { name: 'Comparable Sales Analysis.pdf', type: 'PDF', url: '#' },
        { name: 'Building Inspection Report.pdf', type: 'PDF', url: '#' }
      ],
      aiReport: {
        summary: 'Property valuation confirmed at $1.25M based on recent comparable sales and market analysis. Property is well-maintained with no structural issues. Title is clear and marketable. Suitable security for proposed loan.',
        riskLevel: 'low',
        confidence: 88,
        recommendations: [
          'Accept property as security',
          'Standard insurance requirements apply',
          'No additional valuations required',
          'Monitor local market conditions quarterly'
        ],
        keyFindings: [
          'Valuation aligns with market expectations',
          'Recent comparable sales support valuation',
          'No building or pest issues identified',
          'Strong rental market in area ($650/week potential)'
        ]
      }
    },
    {
      id: 'check-005',
      type: 'Affordability Assessment',
      name: 'Income & Expense Verification',
      category: 'affordability',
      status: 'passed',
      runDate: new Date('2024-03-22T15:00:00'),
      runBy: 'lending@growkyc.com',
      aiBot: 'Affordability Auditor AI',
      icon: DollarSign,
      color: 'cyan',
      score: 91,
      findings: [
        'Verified income: $145,000 p.a.',
        'Debt-to-income ratio: 28% (healthy)',
        'Surplus income: $2,100/month',
        'Employment stable (6 years)'
      ],
      documents: [
        { name: 'Payslips - Last 3 Months.pdf', type: 'PDF', url: '#' },
        { name: 'Tax Return 2023.pdf', type: 'PDF', url: '#' },
        { name: 'Bank Statements - 6 Months.pdf', type: 'PDF', url: '#' },
        { name: 'Employment Verification Letter.pdf', type: 'PDF', url: '#' },
        { name: 'Expense Declaration.pdf', type: 'PDF', url: '#' }
      ],
      aiReport: {
        summary: 'Comprehensive affordability assessment confirms strong capacity to service proposed loan. Income is verified and stable, expenses are reasonable, and surplus cashflow provides comfortable buffer. Low default risk.',
        riskLevel: 'low',
        confidence: 91,
        recommendations: [
          'Client has strong capacity to service loan',
          'Approve at standard rates',
          'No additional income verification required',
          'Standard ongoing monitoring applies'
        ],
        keyFindings: [
          'Income verified via multiple sources',
          '6 years continuous employment with same employer',
          'Healthy savings pattern observed ($1,500/month)',
          'Conservative expense estimates used in assessment'
        ]
      }
    },
    {
      id: 'check-006',
      type: 'Fraud Detection Scan',
      name: 'Multi-Factor Fraud Analysis',
      category: 'fraud',
      status: 'passed',
      runDate: new Date('2024-03-22T15:30:00'),
      runBy: 'fraud@growkyc.com',
      aiBot: 'Fraud Guardian AI',
      icon: AlertCircle,
      color: 'red',
      score: 94,
      findings: [
        'No synthetic identity indicators',
        'No application fraud patterns',
        'Device fingerprint clean',
        'Behavioral analysis: Normal'
      ],
      documents: [
        { name: 'Fraud Risk Assessment.pdf', type: 'PDF', url: '#' },
        { name: 'Device Intelligence Report.pdf', type: 'PDF', url: '#' },
        { name: 'Behavioral Analysis.pdf', type: 'PDF', url: '#' },
        { name: 'Document Authenticity Check.pdf', type: 'PDF', url: '#' }
      ],
      aiReport: {
        summary: 'Comprehensive fraud detection analysis completed using 14 automated rules and 4 AI models. No fraud indicators detected. All documents authentic, identity consistent, and behavioral patterns normal.',
        riskLevel: 'low',
        confidence: 94,
        recommendations: [
          'No fraud concerns identified',
          'Proceed with application as normal',
          'Continue standard monitoring protocols',
          'No enhanced due diligence required'
        ],
        keyFindings: [
          'Document authenticity verified via forensic analysis',
          'Identity data cross-referenced with 12 databases',
          'No velocity flags or duplicate applications',
          'Geolocation and device data consistent with profile'
        ]
      }
    },
    {
      id: 'check-007',
      type: 'Entity Structure Verification',
      name: 'Corporate Structure & Ownership',
      category: 'entity',
      status: 'passed',
      runDate: new Date('2024-03-22T16:00:00'),
      runBy: 'compliance@growkyc.com',
      aiBot: 'Entity Intelligence AI',
      icon: Building2,
      color: 'indigo',
      score: 89,
      findings: [
        'Company structure verified (ASIC)',
        'All directors identified and screened',
        'Beneficial ownership confirmed',
        'No complex structures or red flags'
      ],
      documents: [
        { name: 'ASIC Company Extract.pdf', type: 'PDF', url: '#' },
        { name: 'Director Identification.pdf', type: 'PDF', url: '#' },
        { name: 'Ownership Structure Chart.pdf', type: 'PDF', url: '#' },
        { name: 'Beneficial Ownership Declaration.pdf', type: 'PDF', url: '#' }
      ],
      aiReport: {
        summary: 'Entity structure verification completed via ASIC records. Corporate structure is straightforward with clear ownership. All directors and beneficial owners have been identified and individually screened.',
        riskLevel: 'low',
        confidence: 89,
        recommendations: [
          'Entity structure is transparent and compliant',
          'All controlling parties have been verified',
          'Standard ongoing monitoring sufficient',
          'Review structure annually or upon material changes'
        ],
        keyFindings: [
          'Simple 2-director private company structure',
          'Both directors hold equal 50% shareholding',
          'No offshore ownership or complex trusts',
          'Company financials are current and compliant'
        ]
      }
    }
  ];

  const categories = [
    { id: 'all', label: 'All Checks', icon: FileCheck, color: 'gray', count: verificationChecks.length },
    { id: 'identity', label: 'Identity', icon: Shield, color: 'blue', count: verificationChecks.filter(c => c.category === 'identity').length },
    { id: 'aml', label: 'AML/CTF', icon: Search, color: 'purple', count: verificationChecks.filter(c => c.category === 'aml').length },
    { id: 'credit', label: 'Credit', icon: CreditCard, color: 'orange', count: verificationChecks.filter(c => c.category === 'credit').length },
    { id: 'property', label: 'Property', icon: Home, color: 'green', count: verificationChecks.filter(c => c.category === 'property').length },
    { id: 'affordability', label: 'Affordability', icon: DollarSign, color: 'cyan', count: verificationChecks.filter(c => c.category === 'affordability').length },
    { id: 'fraud', label: 'Fraud', icon: AlertCircle, color: 'red', count: verificationChecks.filter(c => c.category === 'fraud').length },
    { id: 'entity', label: 'Entity', icon: Building2, color: 'indigo', count: verificationChecks.filter(c => c.category === 'entity').length }
  ];

  const filteredChecks = selectedCategory === 'all'
    ? verificationChecks
    : verificationChecks.filter(c => c.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'review': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'pending': return <Clock className="w-5 h-5 text-gray-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-500/15 text-green-300 dark:bg-green-900 dark:text-green-300';
      case 'failed': return 'bg-red-500/15 text-red-300 dark:bg-red-900 dark:text-red-300';
      case 'review': return 'bg-orange-500/15 text-orange-300 dark:bg-orange-900 dark:text-orange-300';
      case 'pending': return 'bg-white/5 text-slate-300 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-white/5 text-slate-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'medium': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'critical': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default: return 'text-slate-300 bg-white/5 border-white/10';
    }
  };

  const passedCount = verificationChecks.filter(c => c.status === 'passed').length;
  const reviewCount = verificationChecks.filter(c => c.status === 'review').length;
  const failedCount = verificationChecks.filter(c => c.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0E7C9E] to-[#13B5EA] rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileCheck className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Verification Reports & AI Analysis</h2>
            </div>
            <p className="text-cyan-100">All checks run on this case with documents and AI bot reports</p>
          </div>
          <Button className="bg-white text-[#0E7C9E] hover:bg-cyan-500/10">
            <Download className="w-5 h-5 mr-2" />
            Export All Reports
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-cyan-100 mb-1">Total Checks</div>
            <div className="text-3xl font-bold">{verificationChecks.length}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-cyan-100 mb-1">Passed</div>
            <div className="text-3xl font-bold text-green-300">{passedCount}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-cyan-100 mb-1">Review Required</div>
            <div className="text-3xl font-bold text-orange-300">{reviewCount}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <div className="text-sm text-cyan-100 mb-1">Failed</div>
            <div className="text-3xl font-bold text-red-300">{failedCount}</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#13B5EA] text-white'
                      : 'bg-white/5 dark:bg-gray-700 text-slate-300 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Verification Checks List */}
      <div className="space-y-4">
        {filteredChecks.map(check => {
          const isExpanded = expandedChecks.has(check.id);
          const Icon = check.icon;

          return (
            <Card key={check.id} className="border-2 border-white/10 dark:border-gray-700">
              {/* Check Header */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg bg-${check.color}-100 dark:bg-${check.color}-900/40 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${check.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-slate-100 dark:text-white">{check.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(check.status)}`}>
                          {check.status.toUpperCase()}
                        </span>
                        {check.score && (
                          <span className="px-3 py-1 bg-blue-500/15 text-blue-300 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs font-bold">
                            Score: {check.score}/100
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-300 dark:text-gray-400">{check.type}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {check.runDate.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {check.runBy}
                        </span>
                        {check.aiBot && (
                          <span className="flex items-center gap-1">
                            <Bot className="w-3 h-3" />
                            {check.aiBot}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleExpanded(check.id)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          View Details
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Quick Findings */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {check.findings.map((finding, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-300 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && check.aiReport && (
                <div className="border-t border-white/10 dark:border-gray-700 p-6 bg-white/5 dark:bg-gray-900 space-y-6">
                  {/* AI Report Summary */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <h4 className="font-bold text-slate-100 dark:text-white">AI Analysis Summary</h4>
                    </div>
                    <p className="text-slate-300 dark:text-gray-300 leading-relaxed">
                      {check.aiReport.summary}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className={`px-3 py-1 rounded-lg border font-semibold text-sm ${getRiskColor(check.aiReport.riskLevel)}`}>
                        Risk: {check.aiReport.riskLevel.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-300 dark:bg-blue-900 dark:text-blue-300 rounded-lg font-semibold text-sm">
                        Confidence: {check.aiReport.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Key Findings */}
                  <div>
                    <h4 className="font-bold text-slate-100 dark:text-white mb-3">Key Findings</h4>
                    <div className="space-y-2">
                      {check.aiReport.keyFindings.map((finding, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-300 dark:text-gray-300">
                          <TrendingUp className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>{finding}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-bold text-slate-100 dark:text-white mb-3">AI Recommendations</h4>
                    <div className="space-y-2">
                      {check.aiReport.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-300 dark:text-gray-300">
                          <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="font-bold text-slate-100 dark:text-white mb-3">
                      Supporting Documents ({check.documents.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {check.documents.map((doc, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-white/10 dark:border-gray-700"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="text-sm font-semibold text-slate-100 dark:text-white">
                                {doc.name}
                              </div>
                              <div className="text-xs text-slate-400">{doc.type}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-gray-700">
                    <div className="text-sm text-slate-400">
                      Powered by {check.aiBot || 'AI Analysis Engine'}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Full Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download All
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filteredChecks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-100 dark:text-white mb-2">
              No checks found
            </h3>
            <p className="text-slate-300 dark:text-gray-400">
              No verification checks found for the selected category.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
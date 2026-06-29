import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  FileText,
  Target,
  Shield,
  Zap,
  User,
  Users,
  Eye,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Flag,
  Clock,
  DollarSign
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';
import { toast } from 'sonner';

interface AIReviewEngineProps {
  onNavigate?: (page: string) => void;
}

interface ReviewItem {
  id: string;
  layer: 'prep' | 'review' | 'advisory';
  category: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  account: string;
  finding: string;
  aiSuggestion: string;
  impact?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  confidence: number;
}

export function AIReviewEngine({ onNavigate }: AIReviewEngineProps) {
  const [selectedLayer, setSelectedLayer] = useState<'all' | 'prep' | 'review' | 'advisory'>('all');
  const [autoApprove, setAutoApprove] = useState(true);

  const reviewItems: ReviewItem[] = [
    // Layer 1 - Preparation Assistant
    {
      id: 'prep-001',
      layer: 'prep',
      category: 'Missing Documents',
      severity: 'high',
      account: 'Inventory (1400)',
      finding: 'Stocktake report not uploaded',
      aiSuggestion: 'Request FY2024 stocktake certificate from client. Template available in document library.',
      impact: 'Cannot verify inventory balance of $156,700',
      status: 'pending',
      confidence: 95
    },
    {
      id: 'prep-002',
      layer: 'prep',
      category: 'Journal Suggestion',
      severity: 'medium',
      account: 'Depreciation Expense (6400)',
      finding: 'Depreciation under-recorded by $1,200',
      aiSuggestion: 'Post adjusting journal: DR Depreciation $1,200 / CR Accumulated Depreciation $1,200. New machinery not fully depreciated.',
      impact: 'Profit overstated by $1,200',
      status: 'pending',
      confidence: 92
    },
    {
      id: 'prep-003',
      layer: 'prep',
      category: 'Account Commentary',
      severity: 'low',
      account: 'Cash at Bank (1100)',
      finding: 'Commentary draft available',
      aiSuggestion: 'Draft: "Cash increased 30.7% from $189k to $248k driven by strong Q4 collections. June bank reconciliation completed with no reconciling items. Balance agrees to bank statement."',
      status: 'pending',
      confidence: 88
    },
    {
      id: 'prep-004',
      layer: 'prep',
      category: 'Tax Treatment',
      severity: 'medium',
      account: 'Entertainment Expenses (6250)',
      finding: 'Entertainment expenses include $3,800 non-deductible items',
      aiSuggestion: 'Split entertainment into deductible ($8,200) and non-deductible ($3,800) components. Add-back required in tax workpaper.',
      impact: 'Taxable income adjustment +$3,800',
      status: 'pending',
      confidence: 90
    },

    // Layer 2 - Review Mode
    {
      id: 'review-001',
      layer: 'review',
      category: 'Anomaly Detection',
      severity: 'high',
      account: 'GST Payable (2200)',
      finding: 'Unusual variance: swing from $18,700 refund to $23,400 payable (-225%)',
      aiSuggestion: 'Significant GST position reversal detected. Verify BAS lodgements Q3-Q4. Check for large capital purchases or classification errors.',
      impact: 'Potential BAS error or missed claim',
      status: 'pending',
      confidence: 96
    },
    {
      id: 'review-002',
      layer: 'review',
      category: 'Prior Year Comparison',
      severity: 'medium',
      account: 'Bad Debts Written Off (6150)',
      finding: 'Bad debts increased 180% vs prior year',
      aiSuggestion: 'Bad debts jumped from $4,200 to $11,800. Review aged debtors analysis and write-off approval documentation. Consider provision adequacy.',
      impact: 'Potential credit control issue',
      status: 'pending',
      confidence: 89
    },
    {
      id: 'review-003',
      layer: 'review',
      category: 'Inconsistent Treatment',
      severity: 'medium',
      account: 'Motor Vehicle Expenses (6300)',
      finding: 'Logbook method applied inconsistently',
      aiSuggestion: 'Vehicle 1 uses logbook (64%), Vehicle 2 uses cents/km. Recommend consistent treatment and verify logbooks maintained for 12-week period.',
      impact: 'ATO audit risk if challenged',
      status: 'reviewed',
      confidence: 87
    },
    {
      id: 'review-004',
      layer: 'review',
      category: 'Compliance Risk',
      severity: 'high',
      account: 'Director Loans (1850)',
      finding: 'Director loan account overdrawn $47,500 at year end',
      aiSuggestion: '⚠️ Division 7A issue detected. Loan exceeds $100k threshold requiring complying loan agreement. Recommend immediate documentation or dividend treatment.',
      impact: 'Deemed dividend $47,500 if not resolved',
      status: 'pending',
      confidence: 98
    },

    // Layer 3 - Advisory Intelligence
    {
      id: 'advisory-001',
      layer: 'advisory',
      category: 'Tax Planning',
      severity: 'info',
      account: 'Retained Earnings (3200)',
      finding: 'Tax planning opportunity identified',
      aiSuggestion: 'Company has $98,100 profit and low tax rate (25%). Consider dividend strategy: $70k franked dividend to shareholders could optimize personal tax position. Run dividend calculator.',
      impact: 'Potential tax savings $8,400',
      status: 'pending',
      confidence: 85
    },
    {
      id: 'advisory-002',
      layer: 'advisory',
      category: 'Division 7A Risk',
      severity: 'high',
      account: 'Director Loan (1850)',
      finding: 'Division 7A compliance required',
      aiSuggestion: 'Advisory opportunity: Set up complying Div 7A loan agreement with benchmark rate (4.77%). Alternative: clear via bonus/dividend. Book 30-min advisory call.',
      impact: 'Advisory fee opportunity $1,500-2,500',
      status: 'pending',
      confidence: 97
    },
    {
      id: 'advisory-003',
      layer: 'advisory',
      category: 'Unpaid Super',
      severity: 'high',
      account: 'Superannuation Payable (2400)',
      finding: 'Superannuation arrears detected',
      aiSuggestion: '⚠️ $15,600 unpaid super liability. Alert client to pay immediately to avoid SGC (10% + interest + admin fee). Potential penalty ~$2,000 if late.',
      impact: 'Client risk + advisory opportunity',
      status: 'pending',
      confidence: 99
    },
    {
      id: 'advisory-004',
      layer: 'advisory',
      category: 'Advisory Opportunity',
      severity: 'info',
      account: 'Plant & Equipment (1700)',
      finding: 'Capital expenditure planning opportunity',
      aiSuggestion: 'Client invested $38k in plant this year. Discuss temporary full expensing (TFE) for future purchases. Potential advisory engagement: equipment replacement strategy.',
      impact: 'Advisory fee opportunity $800-1,200',
      status: 'pending',
      confidence: 83
    }
  ];

  const filteredItems = selectedLayer === 'all'
    ? reviewItems
    : reviewItems.filter(item => item.layer === selectedLayer);

  const stats = {
    total: reviewItems.length,
    pending: reviewItems.filter(i => i.status === 'pending').length,
    resolved: reviewItems.filter(i => i.status === 'resolved').length,
    highSeverity: reviewItems.filter(i => i.severity === 'high').length,
    autoApproved: Math.floor(reviewItems.length * 0.67),
    avgConfidence: Math.round(reviewItems.reduce((sum, i) => sum + i.confidence, 0) / reviewItems.length)
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          HIGH
        </span>;
      case 'medium':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          MEDIUM
        </span>;
      case 'low':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          LOW
        </span>;
      case 'info':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          INFO
        </span>;
      default:
        return null;
    }
  };

  const getLayerBadge = (layer: string) => {
    switch (layer) {
      case 'prep':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">PREP</span>;
      case 'review':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">REVIEW</span>;
      case 'advisory':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">ADVISORY</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">PENDING</span>;
      case 'reviewed':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">REVIEWED</span>;
      case 'resolved':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">RESOLVED</span>;
      case 'dismissed':
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">DISMISSED</span>;
      default:
        return null;
    }
  };

  return (
    <WorkpaperLayout currentPage="ai-review" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600" />
              AI Review Engine
            </h1>
            <p className="text-sm text-gray-600 mt-1">3-Layer AI System • Preparation • Review • Advisory Intelligence</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm px-3 py-2 bg-white border border-gray-300 rounded">
              <input
                type="checkbox"
                checked={autoApprove}
                onChange={(e) => setAutoApprove(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-700 font-medium">Auto-approve high confidence</span>
            </label>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-scan
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Total Findings</div>
            <div className="text-2xl font-bold text-gray-900 font-mono">{stats.total}</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Pending Review</div>
            <div className="text-2xl font-bold text-amber-600 font-mono">{stats.pending}</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Resolved</div>
            <div className="text-2xl font-bold text-green-600 font-mono">{stats.resolved}</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">High Severity</div>
            <div className="text-2xl font-bold text-red-600 font-mono">{stats.highSeverity}</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Auto-Approved</div>
            <div className="text-2xl font-bold text-blue-600 font-mono">{stats.autoApproved}</div>
            <div className="text-xs text-green-600 font-semibold">67%</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Avg Confidence</div>
            <div className="text-2xl font-bold text-purple-600 font-mono">{stats.avgConfidence}%</div>
          </div>
        </div>

        {/* Layer Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">AI Layer:</span>
          <button
            onClick={() => setSelectedLayer('all')}
            className={`px-3 py-1.5 rounded text-sm font-semibold ${
              selectedLayer === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Layers ({reviewItems.length})
          </button>
          <button
            onClick={() => setSelectedLayer('prep')}
            className={`px-3 py-1.5 rounded text-sm font-semibold ${
              selectedLayer === 'prep'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            Layer 1: Preparation ({reviewItems.filter(i => i.layer === 'prep').length})
          </button>
          <button
            onClick={() => setSelectedLayer('review')}
            className={`px-3 py-1.5 rounded text-sm font-semibold ${
              selectedLayer === 'review'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            Layer 2: Review Mode ({reviewItems.filter(i => i.layer === 'review').length})
          </button>
          <button
            onClick={() => setSelectedLayer('advisory')}
            className={`px-3 py-1.5 rounded text-sm font-semibold ${
              selectedLayer === 'advisory'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            Layer 3: Advisory ({reviewItems.filter(i => i.layer === 'advisory').length})
          </button>
        </div>

        {/* Review Items Table */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
            <h3 className="font-semibold text-gray-900">AI Review Findings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-24">Layer</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Category</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-28">Severity</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Account</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Finding</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">AI Suggestion</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-20">Confidence</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-28">Status</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50">
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {getLayerBadge(item.layer)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-900 font-medium">
                      {item.category}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {getSeverityBadge(item.severity)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-900 font-mono text-xs">
                      {item.account}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-800">
                      {item.finding}
                      {item.impact && (
                        <div className="text-xs text-red-600 mt-1 font-semibold">
                          Impact: {item.impact}
                        </div>
                      )}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-700">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{item.aiSuggestion}</span>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <div className="font-mono font-semibold text-purple-700">{item.confidence}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-purple-600 h-1.5 rounded-full"
                          style={{ width: `${item.confidence}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <div className="flex items-center gap-1">
                        <button className="p-1 text-green-600 hover:bg-green-100 rounded" title="Approve">
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            toast.info('Finding Dismissed', {
                              description: 'This AI finding has been dismissed'
                            });
                          }}
                          className="p-1 text-red-600 hover:bg-red-100 rounded" 
                          title="Dismiss"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            // Navigate to the relevant workpaper based on account
                            if (item.account.includes('GST') || item.account.includes('BAS')) {
                              onNavigate?.('workpaper-detail');
                            } else if (item.account.includes('Receivable') || item.account.includes('Debtor')) {
                              onNavigate?.('lead-schedule-editor');
                            } else if (item.account.includes('Division 7A')) {
                              onNavigate?.('division-7a-form');
                            } else {
                              onNavigate?.('workpaper-detail');
                            }
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Layer Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-300 rounded p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Layer 1: Preparation Assistant</h3>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Flags missing documents</li>
              <li>• Suggests journal entries</li>
              <li>• Drafts account commentary</li>
              <li>• Explains tax treatment</li>
            </ul>
          </div>

          <div className="bg-purple-50 border border-purple-300 rounded p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Layer 2: Review Mode</h3>
            </div>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Highlights anomalies</li>
              <li>• Compares prior year</li>
              <li>• Detects inconsistent treatment</li>
              <li>• Flags compliance risk</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-300 rounded p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Layer 3: Advisory Intelligence</h3>
            </div>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Identifies tax planning triggers</li>
              <li>• Detects Division 7A risk</li>
              <li>• Flags unpaid super</li>
              <li>• Suggests advisory opportunities</li>
            </ul>
          </div>
        </div>
      </div>
    </WorkpaperLayout>
  );
}
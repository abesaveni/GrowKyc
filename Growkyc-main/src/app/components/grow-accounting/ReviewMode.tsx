import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Calendar,
  User,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Send,
  Save
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface ReviewModeProps {
  onNavigate?: (page: string) => void;
  jobId?: string;
}

interface DiffItem {
  id: string;
  section: string;
  lineItem: string;
  priorYear: number;
  currentYear: number;
  variance: number;
  variancePercent: number;
  aiNote: string;
  aiConfidence: number;
  reviewerComment: string;
  reviewerDecision: 'approved' | 'rejected' | 'pending';
  hasEvidence: boolean;
}

export function ReviewMode({ onNavigate, jobId = 'JOB-2024-045' }: ReviewModeProps) {
  const [selectedSection, setSelectedSection] = useState('income');
  const [showOnlyFlags, setShowOnlyFlags] = useState(false);
  const [reviewerNotes, setReviewerNotes] = useState('');

  const sections = [
    { id: 'income', name: 'Income Indiv. 1', flagsCount: 3, changesCount: 8 },
    { id: 'deductions', name: 'Deductions Indiv. 1', flagsCount: 2, changesCount: 5 },
    { id: 'investment', name: 'Investment Income', flagsCount: 1, changesCount: 3 },
    { id: 'rental', name: 'Rental Property 1', flagsCount: 0, changesCount: 2 },
    { id: 'bas', name: 'BAS-GST Reconciliation', flagsCount: 2, changesCount: 6 }
  ];

  const diffItems: DiffItem[] = [
    {
      id: 'DIFF-001',
      section: 'income',
      lineItem: 'Salary & Wages',
      priorYear: 108500,
      currentYear: 125000,
      variance: 16500,
      variancePercent: 15.2,
      aiNote: 'Significant increase in salary income. Client changed employers in July 2023. Payment summaries provided match this figure.',
      aiConfidence: 94,
      reviewerComment: '',
      reviewerDecision: 'pending',
      hasEvidence: true
    },
    {
      id: 'DIFF-002',
      section: 'income',
      lineItem: 'Interest Income',
      priorYear: 2100,
      currentYear: 2450,
      variance: 350,
      variancePercent: 16.7,
      aiNote: 'Interest income matches ATO prefill data. Bank statements confirm deposits.',
      aiConfidence: 98,
      reviewerComment: '',
      reviewerDecision: 'pending',
      hasEvidence: true
    },
    {
      id: 'DIFF-003',
      section: 'income',
      lineItem: 'Dividend Income',
      priorYear: 8400,
      currentYear: 8900,
      variance: 500,
      variancePercent: 6.0,
      aiNote: 'Dividend income consistent with prior year shareholdings. Minor increase due to higher dividend yields.',
      aiConfidence: 91,
      reviewerComment: '',
      reviewerDecision: 'pending',
      hasEvidence: true
    },
    {
      id: 'DIFF-004',
      section: 'income',
      lineItem: 'Gross Rental Income',
      priorYear: 27200,
      currentYear: 28600,
      variance: 1400,
      variancePercent: 5.1,
      aiNote: 'Rental income increased due to lease renewal with CPI adjustment in January 2024.',
      aiConfidence: 89,
      reviewerComment: '',
      reviewerDecision: 'pending',
      hasEvidence: false
    },
    {
      id: 'DIFF-005',
      section: 'income',
      lineItem: 'Capital Gains',
      priorYear: 15000,
      currentYear: 0,
      variance: -15000,
      variancePercent: -100,
      aiNote: 'No capital gains this year. Client did not dispose of any assets during FY2024.',
      aiConfidence: 85,
      reviewerComment: '',
      reviewerDecision: 'pending',
      hasEvidence: false
    },
    {
      id: 'DIFF-006',
      section: 'income',
      lineItem: 'Other Income',
      priorYear: 950,
      currentYear: 1200,
      variance: 250,
      variancePercent: 26.3,
      aiNote: 'Other income includes small business grant received in March 2024.',
      aiConfidence: 87,
      reviewerComment: '',
      reviewerDecision: 'pending',
      hasEvidence: true
    },
    {
      id: 'DIFF-007',
      section: 'deductions',
      lineItem: 'Work Related Expenses',
      priorYear: 2800,
      currentYear: 3500,
      variance: 700,
      variancePercent: 25.0,
      aiNote: 'Work expenses increased significantly. Requires substantiation for claims over $300.',
      aiConfidence: 92,
      reviewerComment: '',
      reviewerDecision: 'pending',
      hasEvidence: false
    },
    {
      id: 'DIFF-008',
      section: 'deductions',
      lineItem: 'Home Office Expenses',
      priorYear: 1200,
      currentYear: 1800,
      variance: 600,
      variancePercent: 50.0,
      aiNote: 'Home office expenses increased due to permanent work-from-home arrangement. Diary provided.',
      aiConfidence: 88,
      reviewerComment: '',
      reviewerDecision: 'pending',
      hasEvidence: true
    }
  ];

  const [items, setItems] = useState(diffItems);

  const filteredItems = showOnlyFlags 
    ? items.filter(item => Math.abs(item.variancePercent) > 10 || !item.hasEvidence)
    : items.filter(item => item.section === selectedSection);

  const handleDecision = (itemId: string, decision: 'approved' | 'rejected') => {
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, reviewerDecision: decision }
        : item
    ));
  };

  const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) > 20) return 'text-red-600';
    if (Math.abs(variance) > 10) return 'text-orange-600';
    return 'text-green-600';
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="w-4 h-4" />;
    if (variance < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const approvedCount = items.filter(i => i.reviewerDecision === 'approved').length;
  const rejectedCount = items.filter(i => i.reviewerDecision === 'rejected').length;
  const pendingCount = items.filter(i => i.reviewerDecision === 'pending').length;

  return (
    <WorkpaperLayout currentPage="reviews" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate?.('review-queue')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Queue
            </Button>
            <div>
              <h1 className="text-[28px] font-semibold text-gray-900">Review Mode: Smith, John & Mary</h1>
              <p className="text-sm text-gray-600 mt-1">Individual Tax Return • FY2024 • {jobId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Review
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve & Continue
            </Button>
            <Button variant="outline" className="text-orange-600 border-orange-300">
              <Send className="w-4 h-4 mr-2" />
              Request Changes
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">Approved</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{approvedCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">Rejected</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{rejectedCount}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">Pending</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{pendingCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">Progress</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {Math.round(((approvedCount + rejectedCount) / items.length) * 100)}%
                  </p>
                </div>
                <div className="w-8 h-8">
                  <svg className="transform -rotate-90 w-8 h-8">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="#E5E7EB"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="#2563EB"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${((approvedCount + rejectedCount) / items.length) * 88} 88`}
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Section List */}
          <div className="col-span-3">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Sections</h3>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={showOnlyFlags}
                        onChange={(e) => setShowOnlyFlags(e.target.checked)}
                        className="rounded"
                      />
                      Flags only
                    </label>
                  </div>
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedSection === section.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{section.name}</span>
                        {section.flagsCount > 0 && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            selectedSection === section.id
                              ? 'bg-red-200 text-red-800'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {section.flagsCount}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${
                        selectedSection === section.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {section.changesCount} changes
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center - Comparison Table */}
          <div className="col-span-9 space-y-4">
            {/* Comparison Instructions */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">AI-Assisted Review</h4>
                    <p className="text-sm text-blue-800">
                      Review changes and variances below. AI has analyzed each item and provided explanations. 
                      Approve or reject each change, or add your own comments for the preparer.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Items */}
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className={`${
                  item.reviewerDecision === 'approved' ? 'border-green-300 bg-green-50' :
                  item.reviewerDecision === 'rejected' ? 'border-red-300 bg-red-50' :
                  Math.abs(item.variancePercent) > 20 || !item.hasEvidence ? 'border-orange-300' : ''
                }`}
              >
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.lineItem}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>ID: {item.id}</span>
                          {item.hasEvidence && (
                            <span className="flex items-center gap-1 text-green-600">
                              <FileText className="w-3 h-3" />
                              Evidence attached
                            </span>
                          )}
                          {!item.hasEvidence && (
                            <span className="flex items-center gap-1 text-orange-600">
                              <AlertCircle className="w-3 h-3" />
                              No evidence
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.reviewerDecision === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-green-600 border-green-300 hover:bg-green-50"
                              onClick={() => handleDecision(item.id, 'approved')}
                            >
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => handleDecision(item.id, 'rejected')}
                            >
                              <ThumbsDown className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {item.reviewerDecision === 'approved' && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Approved
                          </span>
                        )}
                        {item.reviewerDecision === 'rejected' && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Prior Year</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Current Year</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Variance ($)</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Variance (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-3 font-mono text-gray-600">
                              ${item.priorYear.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-mono font-semibold text-gray-900">
                              ${item.currentYear.toLocaleString()}
                            </td>
                            <td className={`px-4 py-3 font-mono font-semibold ${getVarianceColor(item.variancePercent)}`}>
                              <div className="flex items-center gap-1">
                                {getVarianceIcon(item.variance)}
                                ${Math.abs(item.variance).toLocaleString()}
                              </div>
                            </td>
                            <td className={`px-4 py-3 font-mono font-semibold ${getVarianceColor(item.variancePercent)}`}>
                              {item.variance > 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* AI Explanation */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-blue-900">AI Analysis</h4>
                            <span className="text-xs text-blue-700">
                              {item.aiConfidence}% confidence
                            </span>
                          </div>
                          <p className="text-sm text-blue-800">{item.aiNote}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reviewer Comment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reviewer Comment
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Add your comment or request changes..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item.reviewerComment}
                        onChange={(e) => {
                          setItems(items.map(i => 
                            i.id === item.id 
                              ? { ...i, reviewerComment: e.target.value }
                              : i
                          ));
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Overall Reviewer Notes */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Overall Review Comments</h3>
                <textarea
                  rows={4}
                  placeholder="Add overall comments for the preparer..."
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WorkpaperLayout>
  );
}

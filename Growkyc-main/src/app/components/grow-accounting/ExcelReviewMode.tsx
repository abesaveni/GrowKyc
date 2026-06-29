import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface ExcelReviewModeProps {
  onNavigate?: (page: string) => void;
  jobId?: string;
}

interface VarianceLine {
  id: string;
  section: string;
  lineItem: string;
  priorYear: number;
  currentYear: number;
  variance: number;
  variancePercent: number;
  aiComment: string;
  reviewerComment: string;
  reviewerDecision: 'approved' | 'rejected' | 'pending';
  hasEvidence: boolean;
}

export function ExcelReviewMode({ onNavigate, jobId = 'JOB-2024-045' }: ExcelReviewModeProps) {
  const [lines, setLines] = useState<VarianceLine[]>([
    {
      id: 'V1',
      section: 'Income Indiv. 1',
      lineItem: 'Salary & Wages',
      priorYear: 108500,
      currentYear: 125000,
      variance: 16500,
      variancePercent: 15.2,
      aiComment: 'Significant increase. Client changed employers July 2023. Payment summaries match.',
      reviewerComment: '',
      reviewerDecision: 'pending',
      hasEvidence: true
    },
    {
      id: 'V2',
      section: 'Income Indiv. 1',
      lineItem: 'Interest Income',
      priorYear: 2100,
      currentYear: 2450,
      variance: 350,
      variancePercent: 16.7,
      aiComment: 'Matches ATO prefill. Bank statements confirm.',
      reviewerComment: '',
      reviewerDecision: 'pending',
      hasEvidence: true
    },
    {
      id: 'V3',
      section: 'Income Indiv. 1',
      lineItem: 'Dividend Income',
      priorYear: 8400,
      currentYear: 8900,
      variance: 500,
      variancePercent: 6.0,
      aiComment: 'Consistent with shareholdings. Minor increase due to higher yields.',
      reviewerComment: '',
      reviewerDecision: 'pending',
      hasEvidence: true
    },
    {
      id: 'V4',
      section: 'Income Indiv. 1',
      lineItem: 'Gross Rental Income',
      priorYear: 27200,
      currentYear: 28600,
      variance: 1400,
      variancePercent: 5.1,
      aiComment: 'Lease renewal with CPI adjustment January 2024.',
      reviewerComment: '',
      reviewerDecision: 'pending',
      hasEvidence: false
    },
    {
      id: 'V5',
      section: 'Income Indiv. 1',
      lineItem: 'Capital Gains',
      priorYear: 15000,
      currentYear: 0,
      variance: -15000,
      variancePercent: -100,
      aiComment: 'No asset disposals during FY2024.',
      reviewerComment: '',
      reviewerDecision: 'pending',
      hasEvidence: false
    },
    {
      id: 'V6',
      section: 'Deductions Indiv. 1',
      lineItem: 'Work Related Expenses',
      priorYear: 2800,
      currentYear: 3500,
      variance: 700,
      variancePercent: 25.0,
      aiComment: 'Exceeds $300 threshold. Substantiation required.',
      reviewerComment: '',
      reviewerDecision: 'pending',
      hasEvidence: false
    },
    {
      id: 'V7',
      section: 'Deductions Indiv. 1',
      lineItem: 'Home Office Expenses',
      priorYear: 1200,
      currentYear: 1800,
      variance: 600,
      variancePercent: 50.0,
      aiComment: 'WFH arrangement permanent. Diary provided.',
      reviewerComment: '',
      reviewerDecision: 'pending',
      hasEvidence: true
    }
  ]);

  const handleDecision = (id: string, decision: 'approved' | 'rejected') => {
    setLines(lines.map(line => 
      line.id === id ? { ...line, reviewerDecision: decision } : line
    ));
  };

  const handleCommentChange = (id: string, comment: string) => {
    setLines(lines.map(line => 
      line.id === id ? { ...line, reviewerComment: comment } : line
    ));
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (variance < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) > 20) return 'bg-red-50';
    if (Math.abs(variance) > 10) return 'bg-orange-50';
    return '';
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'approved': return 'bg-green-100';
      case 'rejected': return 'bg-red-100';
      default: return '';
    }
  };

  const approvedCount = lines.filter(l => l.reviewerDecision === 'approved').length;
  const rejectedCount = lines.filter(l => l.reviewerDecision === 'rejected').length;
  const pendingCount = lines.filter(l => l.reviewerDecision === 'pending').length;

  return (
    <WorkpaperLayout currentPage="reviews" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate?.('review-queue')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Queue
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Review Mode</h1>
              <p className="text-sm text-gray-600 mt-1">Smith, John & Mary • Individual Tax Return • FY2024 • {jobId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve & Continue
            </Button>
            <Button variant="outline" className="text-orange-600 border-orange-300">
              Request Changes
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-gray-50 border border-gray-300 rounded px-6 py-3">
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Approved:</span>
              <span className="font-semibold text-green-600">{approvedCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Rejected:</span>
              <span className="font-semibold text-red-600">{rejectedCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Pending:</span>
              <span className="font-semibold text-orange-600">{pendingCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Progress:</span>
              <span className="font-semibold text-blue-600">
                {Math.round(((approvedCount + rejectedCount) / lines.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Variance Table */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <table className="w-full text-sm border-collapse">
            {/* Header Row */}
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-8">Ref</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-40">Section</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Line Item</th>
                <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-28">Prior Year</th>
                <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-28">Current Year</th>
                <th className="border border-gray-300 px-3 py-2 text-right font-semibold text-gray-700 w-28">Variance</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-20">%</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-64">AI Comment</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-48">Reviewer Comment</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-32">Decision</th>
              </tr>
            </thead>

            {/* Data Rows */}
            <tbody>
              {lines.map((line) => {
                const varianceColor = getVarianceColor(line.variancePercent);
                const decisionColor = getDecisionColor(line.reviewerDecision);
                return (
                  <tr key={line.id} className={`hover:bg-gray-50 ${varianceColor} ${decisionColor}`}>
                    <td className="border border-gray-300 px-3 py-2 text-center text-gray-600 font-mono text-xs">
                      {line.id}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-700 text-xs">
                      {line.section}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>{line.lineItem}</span>
                        {!line.hasEvidence && (
                          <AlertCircle className="w-3 h-3 text-orange-600" title="No evidence" />
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-600">
                      {line.priorYear.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                      {line.currentYear.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-right font-mono text-gray-900">
                      <div className="flex items-center justify-end gap-1">
                        {getVarianceIcon(line.variance)}
                        <span>{line.variance > 0 ? '+' : ''}{line.variance.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center font-mono text-gray-900">
                      {line.variance > 0 ? '+' : ''}{line.variancePercent.toFixed(1)}%
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-700 text-xs">
                      {line.aiComment}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={line.reviewerComment}
                        onChange={(e) => handleCommentChange(line.id, e.target.value)}
                        placeholder="Add comment..."
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {line.reviewerDecision === 'pending' ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDecision(line.id, 'approved')}
                            className="flex-1 px-2 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded flex items-center justify-center gap-1"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleDecision(line.id, 'rejected')}
                            className="flex-1 px-2 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 rounded flex items-center justify-center gap-1"
                          >
                            <ThumbsDown className="w-3 h-3" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-xs font-semibold">
                          {line.reviewerDecision === 'approved' ? (
                            <span className="text-green-700 flex items-center justify-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Approved
                            </span>
                          ) : (
                            <span className="text-red-700 flex items-center justify-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Rejected
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Overall Comments */}
        <div className="border border-gray-300 rounded bg-white p-4">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Overall Review Comments</label>
          <textarea
            rows={4}
            placeholder="Add overall comments for the preparer..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </WorkpaperLayout>
  );
}

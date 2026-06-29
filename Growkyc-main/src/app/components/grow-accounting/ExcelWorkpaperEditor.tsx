import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  Flag
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface ExcelWorkpaperEditorProps {
  onNavigate?: (page: string) => void;
  jobId?: string;
}

interface WorkpaperLine {
  id: string;
  ref: string;
  description: string;
  currentYear: number;
  priorYear: number;
  notes: string;
  hasEvidence: boolean;
  hasFlag: boolean;
  xeroLinked: boolean;
  xeroAccount: string;
}

export function ExcelWorkpaperEditor({ onNavigate, jobId = 'JOB-2024-003' }: ExcelWorkpaperEditorProps) {
  const [selectedSection, setSelectedSection] = useState('income-1');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<'flags' | 'notes' | 'audit'>('flags');

  const sections = [
    { id: 'checklist', name: 'Client Retention Checklist', status: 'complete' },
    { id: 'materials', name: 'Materials Requested', status: 'complete' },
    { id: 'ato-prefill', name: 'ATO Prefill', status: 'complete' },
    { id: 'income-1', name: 'Income Indiv. 1', status: 'in-progress' },
    { id: 'deductions-1', name: 'Deductions Indiv. 1', status: 'not-started' },
    { id: 'investment', name: 'Investment Income', status: 'not-started' },
    { id: 'rental', name: 'Rental Property 1', status: 'not-started' },
    { id: 'bas', name: 'BAS-GST Reconciliation', status: 'not-started' },
    { id: 'tax-summary', name: 'Tax Summary', status: 'not-started' },
    { id: 'signoff', name: 'Signoff', status: 'not-started' }
  ];

  const lines: WorkpaperLine[] = [
    {
      id: 'L1',
      ref: 'L1',
      description: 'Salary & Wages',
      currentYear: 125000,
      priorYear: 108500,
      notes: '3 notes',
      hasEvidence: true,
      hasFlag: false,
      xeroLinked: true,
      xeroAccount: 'Salary and Wages Income (200)'
    },
    {
      id: 'L2',
      ref: 'L2',
      description: 'Allowances',
      currentYear: 2800,
      priorYear: 2400,
      notes: '1 note',
      hasEvidence: true,
      hasFlag: false,
      xeroLinked: true,
      xeroAccount: 'Allowances (210)'
    },
    {
      id: 'L3',
      ref: 'L3',
      description: 'Lump Sum Payments',
      currentYear: 0,
      priorYear: 0,
      notes: '',
      hasEvidence: false,
      hasFlag: false,
      xeroLinked: false,
      xeroAccount: ''
    },
    {
      id: 'L4',
      ref: 'L4',
      description: 'Employer Termination Payment',
      currentYear: 0,
      priorYear: 0,
      notes: '',
      hasEvidence: false,
      hasFlag: false,
      xeroLinked: false,
      xeroAccount: ''
    },
    {
      id: 'L5',
      ref: 'L5',
      description: 'Interest Income',
      currentYear: 2450,
      priorYear: 2100,
      notes: '2 notes',
      hasEvidence: true,
      hasFlag: false,
      xeroLinked: true,
      xeroAccount: 'Interest Income (260)'
    },
    {
      id: 'L6',
      ref: 'L6',
      description: 'Dividend Income',
      currentYear: 8900,
      priorYear: 8400,
      notes: '1 note',
      hasEvidence: true,
      hasFlag: false,
      xeroLinked: true,
      xeroAccount: 'Dividend Income (270)'
    },
    {
      id: 'L7',
      ref: 'L7',
      description: 'Gross Rental Income',
      currentYear: 28600,
      priorYear: 27200,
      notes: '4 notes',
      hasEvidence: true,
      hasFlag: true,
      xeroLinked: true,
      xeroAccount: 'Rental Income (280)'
    },
    {
      id: 'L8',
      ref: 'L8',
      description: 'Capital Gains',
      currentYear: 0,
      priorYear: 15000,
      notes: '1 note',
      hasEvidence: false,
      hasFlag: true,
      xeroLinked: true,
      xeroAccount: 'Capital Gains (290)'
    }
  ];

  const totalCurrent = lines.reduce((sum, item) => sum + item.currentYear, 0);
  const totalPrior = lines.reduce((sum, item) => sum + item.priorYear, 0);
  const totalVariance = totalCurrent - totalPrior;
  const totalVariancePercent = ((totalVariance / totalPrior) * 100);

  const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) > 20) return 'bg-red-500/10';
    if (Math.abs(variance) > 10) return 'bg-orange-500/10';
    return '';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-400';
      case 'in-progress': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const flags = [
    {
      id: 'F1',
      line: 'L1',
      severity: 'warning',
      message: 'Salary increased by 15%. Confirm change of employer.',
      confidence: 94
    },
    {
      id: 'F2',
      line: 'L1',
      severity: 'info',
      message: 'Payment summary matches ATO prefill.',
      confidence: 98
    }
  ];

  return (
    <WorkpaperLayout currentPage="workpapers" onNavigate={onNavigate}>
      <div className="space-y-0">
        {/* Top Ribbon */}
        <div className="bg-white border-b border-white/10 -mx-8 -mt-6 px-8 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate?.('jobs')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-300">Entity:</span>
              <span className="font-semibold text-slate-100">Individual</span>
              <span className="text-gray-400">|</span>
              <span className="text-slate-300">Year:</span>
              <span className="font-semibold text-slate-100">FY2024</span>
              <span className="text-gray-400">|</span>
              <span className="text-slate-300">Status:</span>
              <span className="font-semibold text-blue-400">In Progress</span>
              <span className="text-gray-400">|</span>
              <span className="text-slate-300">Assigned:</span>
              <span className="font-semibold text-slate-100">Mike Brown</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              Saved 2 min ago
            </span>
            <div className="h-4 w-px bg-gray-300" />
            <Button variant="outline" size="sm">Compare to PY</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
              Mark Ready for Review
            </Button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex -mx-8" style={{ height: 'calc(100vh - 220px)' }}>
          {/* Left: Section List (Like Excel sheet tabs) */}
          <div className="w-60 bg-white/5 border-r border-white/10 overflow-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`w-full text-left px-4 py-3 text-sm border-b border-white/10 hover:bg-white/5 transition-colors ${
                  selectedSection === section.id
                    ? 'bg-white border-l-2 border-l-blue-600 font-semibold'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={selectedSection === section.id ? 'text-slate-100' : 'text-slate-300'}>
                    {section.name}
                  </span>
                  <span className={getStatusColor(section.status)}>
                    {section.status === 'complete' && <CheckCircle className="w-4 h-4" />}
                    {section.status === 'in-progress' && <Clock className="w-4 h-4" />}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Center: Spreadsheet Grid */}
          <div className={`flex-1 bg-white overflow-auto ${rightPanelOpen ? '' : 'mr-0'}`}>
            <div className="p-6">
              {/* Section Title Row */}
              <div className="bg-white/5 border border-white/10 px-4 py-3 mb-4">
                <h2 className="font-semibold text-slate-100">Income Indiv. 1</h2>
              </div>

              {/* Spreadsheet Table */}
              <table className="w-full text-sm border-collapse">
                {/* Header Row */}
                <thead>
                  <tr className="bg-white/5">
                    <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-8">Ref</th>
                    <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300">Description</th>
                    <th className="border border-white/10 px-3 py-2 text-right font-semibold text-slate-300 w-32">Current Year</th>
                    <th className="border border-white/10 px-3 py-2 text-right font-semibold text-slate-300 w-32">Prior Year</th>
                    <th className="border border-white/10 px-3 py-2 text-right font-semibold text-slate-300 w-32">Variance</th>
                    <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300 w-24">%</th>
                    <th className="border border-white/10 px-3 py-2 text-center font-semibold text-slate-300 w-16">Xero</th>
                    <th className="border border-white/10 px-3 py-2 text-left font-semibold text-slate-300 w-40">Notes</th>
                  </tr>
                </thead>

                {/* Data Rows */}
                <tbody>
                  {lines.map((item) => {
                    const varianceColor = getVarianceColor(item.currentYear - item.priorYear);
                    return (
                      <tr key={item.id} className={`hover:bg-white/5 ${varianceColor}`}>
                        <td className="border border-white/10 px-3 py-2 text-center text-slate-300 font-mono text-xs">
                          {item.ref}
                        </td>
                        <td className="border border-white/10 px-3 py-2 text-slate-100 relative">
                          <div className="flex items-center gap-2">
                            <span>{item.description}</span>
                            {item.hasEvidence && (
                              <FileText className="w-3 h-3 text-blue-400" title="Evidence attached" />
                            )}
                            {item.hasFlag && (
                              <Flag className="w-3 h-3 text-orange-400" title="Has AI flag" />
                            )}
                          </div>
                        </td>
                        <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-100">
                          <input
                            type="text"
                            value={item.currentYear.toLocaleString()}
                            onChange={() => {}}
                            className="w-full text-right bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 px-1"
                          />
                        </td>
                        <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-300">
                          {item.priorYear.toLocaleString()}
                        </td>
                        <td className="border border-white/10 px-3 py-2 text-right font-mono text-slate-100">
                          {item.currentYear > item.priorYear ? '+' : ''}{(item.currentYear - item.priorYear).toLocaleString()}
                        </td>
                        <td className="border border-white/10 px-3 py-2 text-center font-mono text-slate-100">
                          {item.currentYear > item.priorYear ? '+' : ''}{((item.currentYear - item.priorYear) / item.priorYear * 100).toFixed(1)}%
                        </td>
                        <td className="border border-white/10 px-3 py-2 text-center font-mono text-slate-100">
                          <input
                            type="text"
                            value={item.xeroLinked ? item.xeroAccount : ''}
                            onChange={() => {}}
                            className="w-full text-center bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 px-1"
                          />
                        </td>
                        <td className="border border-white/10 px-3 py-2">
                          <button className="text-gray-400 hover:text-slate-300">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Totals Row */}
                  <tr className="bg-white/5">
                    <td className="border border-white/10 px-3 py-2"></td>
                    <td className="border border-white/10 px-3 py-2 font-semibold text-slate-100">
                      Total Assessable Income
                    </td>
                    <td className="border border-white/10 px-3 py-2 text-right font-mono font-semibold text-slate-100">
                      {totalCurrent.toLocaleString()}
                    </td>
                    <td className="border border-white/10 px-3 py-2 text-right font-mono font-semibold text-slate-300">
                      {totalPrior.toLocaleString()}
                    </td>
                    <td className="border border-white/10 px-3 py-2 text-right font-mono font-semibold text-slate-100">
                      {totalVariance > 0 ? '+' : ''}{totalVariance.toLocaleString()}
                    </td>
                    <td className="border border-white/10 px-3 py-2 text-center font-mono font-semibold text-slate-100">
                      {totalVariance > 0 ? '+' : ''}{totalVariancePercent.toFixed(1)}%
                    </td>
                    <td className="border border-white/10 px-3 py-2 text-center font-mono text-slate-100">
                      <input
                        type="text"
                        value=""
                        onChange={() => {}}
                        className="w-full text-center bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 px-1"
                      />
                    </td>
                    <td className="border border-white/10 px-3 py-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Context Panel */}
          {rightPanelOpen && (
            <div className="w-80 bg-white border-l border-white/10 overflow-auto">
              {/* Tabs */}
              <div className="border-b border-white/10 bg-white/5 flex">
                <button
                  onClick={() => setRightPanelTab('flags')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    rightPanelTab === 'flags'
                      ? 'bg-white border-b-2 border-b-blue-600 text-blue-400'
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  AI Flags ({flags.length})
                </button>
                <button
                  onClick={() => setRightPanelTab('notes')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    rightPanelTab === 'notes'
                      ? 'bg-white border-b-2 border-b-blue-600 text-blue-400'
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setRightPanelTab('audit')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    rightPanelTab === 'audit'
                      ? 'bg-white border-b-2 border-b-blue-600 text-blue-400'
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  Audit
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {rightPanelTab === 'flags' && (
                  <div className="space-y-3">
                    {flags.map((flag) => (
                      <div 
                        key={flag.id}
                        className={`border rounded p-3 text-sm ${
                          flag.severity === 'warning' ? 'border-orange-300 bg-orange-500/10' : 'border-blue-300 bg-blue-500/10'
                        }`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium text-slate-100 mb-1">Line {flag.line}</div>
                            <p className="text-slate-300">{flag.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <span>Confidence: {flag.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {rightPanelTab === 'notes' && (
                  <div>
                    <textarea
                      rows={8}
                      placeholder="Add section notes..."
                      className="w-full px-3 py-2 text-sm border border-white/10 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Button size="sm" className="mt-2 w-full">Save Note</Button>
                  </div>
                )}

                {rightPanelTab === 'audit' && (
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-100">Value updated</p>
                        <p className="text-xs text-slate-300">Mike Brown • 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-600 mt-1.5" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-100">Evidence attached</p>
                        <p className="text-xs text-slate-300">Mike Brown • 3 hours ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </WorkpaperLayout>
  );
}
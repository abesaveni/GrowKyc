import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Save,
  Upload,
  FileText,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Zap,
  Clock,
  User,
  Calendar,
  History,
  MessageSquare,
  Lock,
  Unlock,
  Send,
  Plus,
  Maximize2,
  Minimize2,
  HelpCircle,
  FileCheck,
  GitCompare,
  Search,
  X
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface EnhancedWorkpaperEditorProps {
  onNavigate?: (page: string) => void;
  jobId?: string;
}

export function EnhancedWorkpaperEditor({ onNavigate, jobId = 'JOB-2024-003' }: EnhancedWorkpaperEditorProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'journal' | 'notes'>('form');
  const [rightDrawerTab, setRightDrawerTab] = useState<'ai-flags' | 'notes' | 'audit' | 'help'>('ai-flags');
  const [showPriorYear, setShowPriorYear] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('income-1');
  const [leftPanelSearch, setLeftPanelSearch] = useState('');

  // Workpaper sections (only selected ones from Workpaper Builder)
  const sections = [
    { id: 'checklist', name: 'Client Retention Checklist', group: 'Admin + Client Comms', status: 'complete', progress: 100 },
    { id: 'materials', name: 'Materials Requested', group: 'Admin + Client Comms', status: 'in-progress', progress: 80 },
    { id: 'ato-prefill', name: 'ATO Prefill', group: 'ATO + Prefill', status: 'complete', progress: 100 },
    { id: 'income-1', name: 'Income Indiv. 1', group: 'Income + Deductions', status: 'in-progress', progress: 65 },
    { id: 'deductions-1', name: 'Deductions Indiv. 1', group: 'Income + Deductions', status: 'not-started', progress: 0 },
    { id: 'investment-income', name: 'Investment Income', group: 'Investments', status: 'not-started', progress: 0 },
    { id: 'rental-1', name: 'Rental Property 1', group: 'Investments', status: 'not-started', progress: 0 },
    { id: 'bas-gst', name: 'BAS-GST Reconciliation', group: 'BAS + ATO Accounts', status: 'not-started', progress: 0 },
    { id: 'tax-summary', name: 'Tax Summary', group: 'Finalisation', status: 'not-started', progress: 0 },
    { id: 'signoff', name: 'Signoff', group: 'Finalisation', status: 'not-started', progress: 0 }
  ];

  // Group sections
  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.group]) {
      acc[section.group] = [];
    }
    acc[section.group].push(section);
    return acc;
  }, {} as Record<string, typeof sections>);

  // AI Flags
  const aiFlags = [
    {
      id: 'FLAG-001',
      severity: 'warning',
      section: 'Income Indiv. 1',
      field: 'Salary & Wages',
      message: 'Value increased by 15% compared to prior year. This exceeds typical wage growth.',
      confidence: 94,
      status: 'new'
    },
    {
      id: 'FLAG-002',
      severity: 'info',
      section: 'Income Indiv. 1',
      field: 'Interest Income',
      message: 'Bank interest matches ATO prefill data.',
      confidence: 98,
      status: 'acknowledged'
    },
    {
      id: 'FLAG-003',
      severity: 'danger',
      section: 'Deductions Indiv. 1',
      field: 'Work Related Expenses',
      message: 'Expense claim exceeds $3,000 without evidence. Substantiation required.',
      confidence: 99,
      status: 'new'
    }
  ];

  // Form fields
  const formFields = [
    { id: 'salary', label: 'Salary & Wages', value: '125,000', priorYear: '108,500', variance: 15.2, hasSource: true, hasFlag: true },
    { id: 'interest', label: 'Interest Income', value: '2,450', priorYear: '2,100', variance: 16.7, hasSource: true, hasFlag: false },
    { id: 'dividends', label: 'Dividend Income', value: '8,900', priorYear: '8,400', variance: 6.0, hasSource: true, hasFlag: false },
    { id: 'rental', label: 'Gross Rental Income', value: '28,600', priorYear: '27,200', variance: 5.1, hasSource: false, hasFlag: false },
    { id: 'capital-gains', label: 'Capital Gains', value: '0', priorYear: '15,000', variance: -100, hasSource: false, hasFlag: false },
    { id: 'other-income', label: 'Other Income', value: '1,200', priorYear: '950', variance: 26.3, hasSource: false, hasFlag: false }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-400';
      case 'in-progress': return 'text-blue-400';
      case 'not-started': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'not-started': return <div className="w-4 h-4 rounded-full border-2 border-white/10" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-white/10" />;
    }
  };

  const getFlagSeverityColor = (severity: string) => {
    switch (severity) {
      case 'danger': return 'bg-red-500/10 border-red-300 text-red-300';
      case 'warning': return 'bg-orange-500/10 border-orange-300 text-orange-300';
      case 'info': return 'bg-blue-500/10 border-blue-300 text-blue-300';
      default: return 'bg-white/5 border-white/10 text-slate-300';
    }
  };

  const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) > 20) return 'text-red-400';
    if (Math.abs(variance) > 10) return 'text-orange-400';
    return 'text-green-400';
  };

  const currentSection = sections.find(s => s.id === selectedSection);

  return (
    <WorkpaperLayout currentPage="workpapers" onNavigate={onNavigate}>
      <div className="space-y-0">
        {/* Top Ribbon - Fixed height 56px */}
        <div className="bg-white border-b border-white/10 -mx-8 -mt-6 px-8 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate?.('jobs')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-lg font-semibold text-slate-100">Individual Tax Return - 2024</h1>
              <p className="text-xs text-slate-400">Smith, John | Last saved 2 minutes ago</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              Auto-saved
            </span>
            <div className="h-4 w-px bg-gray-300" />
            <Button variant="ghost" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Add Doc
            </Button>
            <Button variant="ghost" size="sm">
              <FileCheck className="w-4 h-4 mr-2" />
              Generate Checklist
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowPriorYear(!showPriorYear)}
            >
              <GitCompare className="w-4 h-4 mr-2" />
              Compare to PY
            </Button>
            <Button variant="outline" size="sm" className="text-green-400 border-green-300">
              <Send className="w-4 h-4 mr-2" />
              Ready for Review
            </Button>
            <div className="h-4 w-px bg-gray-300" />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsFullScreen(!isFullScreen)}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* 3-Pane Layout */}
        <div className="grid grid-cols-12 gap-0 -mx-8 mt-0" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Left Rail - 280px - Section Tree */}
          <div className="col-span-3 border-r border-white/10 bg-surface-50 overflow-auto">
            <div className="p-4 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={leftPanelSearch}
                  onChange={(e) => setLeftPanelSearch(e.target.value)}
                  placeholder="Search sections..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Section Tree */}
              {Object.entries(groupedSections).map(([group, groupSections]) => (
                <div key={group}>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                    {group}
                  </h3>
                  <div className="space-y-1">
                    {groupSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setSelectedSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedSection === section.id
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={selectedSection === section.id ? '' : getStatusColor(section.status)}>
                            {getStatusIcon(section.status)}
                          </span>
                          <span className="flex-1 truncate">{section.name}</span>
                          {section.progress > 0 && section.progress < 100 && (
                            <span className="text-xs">{section.progress}%</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center Canvas - 760px - Workpaper Form */}
          <div className="col-span-6 overflow-auto bg-white">
            <div className="p-6 space-y-6">
              {/* Section Header Card */}
              <Card className="border-l-4 border-l-blue-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-100">{currentSection?.name}</h2>
                      <p className="text-sm text-slate-300">Individual Tax Return - FY2024</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        currentSection?.status === 'complete' ? 'bg-green-500/15 text-green-300' :
                        currentSection?.status === 'in-progress' ? 'bg-blue-500/15 text-blue-300' :
                        'bg-white/5 text-slate-300'
                      }`}>
                        {currentSection?.status === 'complete' ? 'Complete' :
                         currentSection?.status === 'in-progress' ? 'In Progress' :
                         'Not Started'}
                      </span>
                      <Button size="sm" variant="outline" disabled={isLocked}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Sign Off Section
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all"
                        style={{ width: `${currentSection?.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-100">{currentSection?.progress}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Workpaper Form Fields */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {formFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            {field.label}
                            {field.hasFlag && (
                              <AlertCircle className="w-4 h-4 text-orange-400" />
                            )}
                          </label>
                          {showPriorYear && (
                            <span className={`text-xs font-semibold ${getVarianceColor(field.variance)}`}>
                              {field.variance > 0 ? '+' : ''}{field.variance.toFixed(1)}% vs PY
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={field.value}
                            onChange={() => {}}
                            disabled={isLocked}
                            className={`flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              isLocked ? 'bg-white/5 cursor-not-allowed' : 'bg-white'
                            } ${field.hasFlag ? 'border-orange-300' : 'border-white/10'}`}
                          />
                          {field.hasSource && (
                            <Button size="sm" variant="ghost" className="flex-shrink-0">
                              <FileText className="w-4 h-4 text-blue-400" />
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="flex-shrink-0">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>

                        {showPriorYear && (
                          <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-2 rounded">
                            <Clock className="w-3 h-3" />
                            <span>Prior Year: <strong>${field.priorYear}</strong></span>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Totals Row */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-md">
                        <span className="font-semibold text-slate-100">Total Income</span>
                        <span className="font-mono font-semibold text-lg text-slate-100">$166,150</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reconciliation Summary */}
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-slate-100 mb-3">Reconciliation Summary</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-300 mb-1">ATO Prefill</p>
                      <p className="font-mono font-semibold text-slate-100">$164,350</p>
                    </div>
                    <div>
                      <p className="text-slate-300 mb-1">Workpaper Total</p>
                      <p className="font-mono font-semibold text-slate-100">$166,150</p>
                    </div>
                    <div>
                      <p className="text-slate-300 mb-1">Variance</p>
                      <p className="font-mono font-semibold text-orange-400">$1,800</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Drawer - 360px - Tabs */}
          <div className="col-span-3 border-l border-white/10 bg-white overflow-auto">
            <div className="border-b border-white/10">
              <div className="flex p-2 gap-1">
                <button
                  onClick={() => setRightDrawerTab('ai-flags')}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                    rightDrawerTab === 'ai-flags'
                      ? 'bg-blue-500/15 text-blue-300'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  AI Flags ({aiFlags.filter(f => f.status === 'new').length})
                </button>
                <button
                  onClick={() => setRightDrawerTab('notes')}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                    rightDrawerTab === 'notes'
                      ? 'bg-blue-500/15 text-blue-300'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setRightDrawerTab('audit')}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                    rightDrawerTab === 'audit'
                      ? 'bg-blue-500/15 text-blue-300'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Audit
                </button>
                <button
                  onClick={() => setRightDrawerTab('help')}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
                    rightDrawerTab === 'help'
                      ? 'bg-blue-500/15 text-blue-300'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Help
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* AI Flags Tab */}
              {rightDrawerTab === 'ai-flags' && (
                <div className="space-y-3">
                  {aiFlags.map((flag) => (
                    <Card key={flag.id} className={`border ${getFlagSeverityColor(flag.severity)}`}>
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold mb-1">{flag.field}</p>
                            <p className="text-xs">{flag.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 bg-white/10 h-1 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600"
                              style={{ width: `${flag.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-300">{flag.confidence}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" className="flex-1 text-xs h-7">
                            Accept
                          </Button>
                          <Button size="sm" variant="ghost" className="flex-1 text-xs h-7">
                            Reject
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs h-7">
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Notes Tab */}
              {rightDrawerTab === 'notes' && (
                <div className="space-y-3">
                  <textarea
                    rows={6}
                    placeholder="Add notes for this section..."
                    disabled={isLocked}
                    className="w-full px-3 py-2 text-sm border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button size="sm" className="w-full" disabled={isLocked}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Note
                  </Button>
                </div>
              )}

              {/* Audit Trail Tab */}
              {rightDrawerTab === 'audit' && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-100">Value updated</p>
                      <p className="text-slate-300">Mike Brown • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-green-600 mt-1.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-100">Document linked</p>
                      <p className="text-slate-300">Mike Brown • 3 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-100">Section created</p>
                      <p className="text-slate-300">System • 1 day ago</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Help Tab */}
              {rightDrawerTab === 'help' && (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-md">
                    <div className="flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-blue-300 mb-1">How to complete this section</p>
                        <p className="text-xs text-blue-300">
                          Enter all income received by the individual during the financial year. Include salary, interest, dividends, and rental income.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Ask AI Assistant
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </WorkpaperLayout>
  );
}

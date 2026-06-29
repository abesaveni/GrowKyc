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
  Plus
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface WorkpaperEditorProps {
  onNavigate?: (page: string) => void;
  jobId?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface AIInsight {
  id: string;
  type: 'warning' | 'suggestion' | 'info' | 'success';
  title: string;
  message: string;
  field?: string;
  confidence: number;
}

interface WorkpaperField {
  id: string;
  label: string;
  value: string;
  priorYearValue?: string;
  variance?: number;
  hasAIFlag?: boolean;
  aiSuggestion?: string;
  required?: boolean;
}

export function WorkpaperEditor({ onNavigate, jobId = 'JOB-2024-003' }: WorkpaperEditorProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'journal' | 'notes'>('form');
  const [showPriorYear, setShowPriorYear] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock data
  const workpaperData = {
    id: 'WP-2024-003-BAS',
    name: 'BAS Reconciliation - Q4 2024',
    jobId: 'JOB-2024-003',
    client: 'Smith SMSF',
    entity: 'Smith Super Fund',
    period: 'Q4 2024',
    status: 'in_progress',
    progress: 68,
    assignedTo: 'Mike Brown',
    reviewer: 'Sarah Johnson',
    lastSaved: '2 minutes ago'
  };

  const documents: Document[] = [
    { id: 'DOC-001', name: 'Bank_Statement_Dec2024.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: '2024-03-01', uploadedBy: 'Mike Brown' },
    { id: 'DOC-002', name: 'BAS_Return_Q4.xlsx', type: 'Excel', size: '156 KB', uploadedAt: '2024-03-01', uploadedBy: 'Mike Brown' },
    { id: 'DOC-003', name: 'ATO_Notice.pdf', type: 'PDF', size: '892 KB', uploadedAt: '2024-02-28', uploadedBy: 'System' }
  ];

  const aiInsights: AIInsight[] = [
    {
      id: 'AI-001',
      type: 'warning',
      title: 'Variance Detected',
      message: 'GST collected is 12% higher than prior quarter. This may indicate increased business activity.',
      field: 'gst_collected',
      confidence: 94
    },
    {
      id: 'AI-002',
      type: 'suggestion',
      title: 'Missing Reconciliation',
      message: 'Bank balance doesn\'t match GL. Consider uploading December bank statement.',
      confidence: 89
    },
    {
      id: 'AI-003',
      type: 'success',
      title: 'Auto-completed',
      message: 'PAYG withholding amounts imported from Xero and validated.',
      field: 'payg_withheld',
      confidence: 98
    }
  ];

  const formFields: WorkpaperField[] = [
    { id: 'sales', label: 'Total Sales (G1)', value: '285,000', priorYearValue: '265,000', variance: 7.5, required: true },
    { id: 'gst_sales', label: 'GST on Sales (1A)', value: '28,500', priorYearValue: '26,500', variance: 7.5, required: true },
    { id: 'purchases', label: 'Total Purchases (G10)', value: '142,000', priorYearValue: '138,000', variance: 2.9, required: true },
    { id: 'gst_purchases', label: 'GST on Purchases (1B)', value: '14,200', priorYearValue: '13,800', variance: 2.9, hasAIFlag: true, aiSuggestion: 'Consider capital asset purchases impact', required: true },
    { id: 'net_gst', label: 'Net GST Payable', value: '14,300', priorYearValue: '12,700', variance: 12.6, required: true },
    { id: 'payg_withheld', label: 'PAYG Withheld (W1)', value: '8,200', priorYearValue: '8,000', variance: 2.5, required: true },
    { id: 'payg_income', label: 'PAYG Income Tax Instalment (T1)', value: '6,500', priorYearValue: '6,200', variance: 4.8 },
    { id: 'total_payable', label: 'Total Amount Payable', value: '29,000', priorYearValue: '26,900', variance: 7.8, required: true }
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const getVarianceColor = (variance?: number) => {
    if (!variance) return 'text-slate-300';
    if (Math.abs(variance) > 10) return 'text-red-400';
    if (Math.abs(variance) > 5) return 'text-orange-400';
    return 'text-green-400';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="w-4 h-4 text-orange-400" />;
      case 'suggestion': return <Zap className="w-4 h-4 text-blue-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-300" />;
    }
  };

  const getInsightBgColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-orange-500/10 border-orange-500/30';
      case 'suggestion': return 'bg-blue-500/10 border-blue-500/30';
      case 'success': return 'bg-green-500/10 border-green-500/30';
      default: return 'bg-white/5 border-white/10';
    }
  };

  return (
    <WorkpaperLayout currentPage="jobs" onNavigate={onNavigate}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate?.('jobs')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">{workpaperData.name}</h1>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-slate-300">{workpaperData.client}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-slate-300">{workpaperData.period}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-slate-400">Saved {workpaperData.lastSaved}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <History className="w-4 h-4 mr-2" />
              Version History
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsLocked(!isLocked)}
            >
              {isLocked ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
              {isLocked ? 'Locked' : 'Lock'}
            </Button>
            <Button 
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#2855a6] hover:bg-[#1e4089]"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Send className="w-4 h-4 mr-2" />
              Send to Reviewer
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Workpaper Progress</span>
              <span className="text-sm font-bold text-[#2855a6]">{workpaperData.progress}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#2855a6] transition-all"
                style={{ width: `${workpaperData.progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>Assigned: {workpaperData.assignedTo}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>Reviewer: {workpaperData.reviewer}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-12 gap-4">
          {/* LEFT COLUMN - Source Documents */}
          <div className="col-span-3 space-y-4">
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-100">Source Documents</h3>
                  <Button size="sm" variant="outline">
                    <Upload className="w-3 h-3 mr-1" />
                    Upload
                  </Button>
                </div>

                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div 
                      key={doc.id}
                      className="p-3 border border-white/10 rounded-lg hover:border-[#2855a6] hover:bg-blue-500/10 cursor-pointer transition-all"
                    >
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-slate-300 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-100 truncate">{doc.name}</p>
                          <p className="text-xs text-slate-400">{doc.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Document
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-100 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="w-3 h-3 mr-2" />
                    Import from Xero
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <History className="w-3 h-3 mr-2" />
                    Copy Prior Year
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-3 h-3 mr-2" />
                    Export to PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CENTER COLUMN - Workpaper Form */}
          <div className="col-span-6 space-y-4">
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-4">
                {/* Tabs */}
                <div className="flex items-center gap-2 mb-4 border-b border-white/10">
                  <button
                    onClick={() => setActiveTab('form')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'form' 
                        ? 'text-[#2855a6] border-b-2 border-[#2855a6]' 
                        : 'text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    Workpaper Form
                  </button>
                  <button
                    onClick={() => setActiveTab('journal')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'journal' 
                        ? 'text-[#2855a6] border-b-2 border-[#2855a6]' 
                        : 'text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    Journal Entries
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'notes' 
                        ? 'text-[#2855a6] border-b-2 border-[#2855a6]' 
                        : 'text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    Notes
                  </button>

                  <div className="ml-auto">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowPriorYear(!showPriorYear)}
                    >
                      {showPriorYear ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                      {showPriorYear ? 'Hide' : 'Show'} Prior Year
                    </Button>
                  </div>
                </div>

                {/* Form Fields */}
                {activeTab === 'form' && (
                  <div className="space-y-4">
                    {formFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            {field.label}
                            {field.required && <span className="text-red-500">*</span>}
                            {field.hasAIFlag && (
                              <Zap className="w-3 h-3 text-purple-400" title="AI Suggestion Available" />
                            )}
                          </label>
                          {field.variance && (
                            <span className={`text-xs font-semibold ${getVarianceColor(field.variance)}`}>
                              {field.variance > 0 ? '+' : ''}{field.variance.toFixed(1)}% vs PY
                            </span>
                          )}
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            value={field.value}
                            onChange={() => {}} // Read-only for now
                            disabled={isLocked}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6] ${
                              isLocked ? 'bg-white/5 cursor-not-allowed' : 'bg-white'
                            } ${field.hasAIFlag ? 'border-purple-300' : 'border-white/10'}`}
                          />
                        </div>

                        {showPriorYear && field.priorYearValue && (
                          <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-2 rounded">
                            <Clock className="w-3 h-3" />
                            <span>Prior Year: <strong>${field.priorYearValue}</strong></span>
                          </div>
                        )}

                        {field.aiSuggestion && (
                          <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 px-3 py-2 rounded">
                            <Zap className="w-3 h-3" />
                            <span>{field.aiSuggestion}</span>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="pt-4 border-t border-white/10">
                      <Button className="w-full bg-[#2855a6] hover:bg-[#1e4089]">
                        Calculate & Validate
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'journal' && (
                  <div className="space-y-4">
                    <div className="text-center py-8 text-slate-400">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm">No journal entries yet</p>
                      <Button size="sm" className="mt-3">Create Journal Entry</Button>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <textarea
                      placeholder="Add notes for this workpaper..."
                      rows={10}
                      disabled={isLocked}
                      className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                    />
                    <Button size="sm" disabled={isLocked}>
                      <Save className="w-3 h-3 mr-2" />
                      Save Notes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - AI Assistant */}
          <div className="col-span-3 space-y-4">
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <h3 className="font-semibold text-slate-100">AI Assistant</h3>
                </div>

                <div className="space-y-3">
                  {aiInsights.map((insight) => (
                    <div 
                      key={insight.id}
                      className={`p-3 border rounded-lg ${getInsightBgColor(insight.type)}`}
                    >
                      <div className="flex items-start gap-2">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-100">{insight.title}</p>
                          <p className="text-xs text-slate-300 mt-1">{insight.message}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 bg-white/10 h-1 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-purple-600"
                                style={{ width: `${insight.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-300">{insight.confidence}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          Apply
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-slate-100 mb-2">Ask AI</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask about this workpaper..."
                      className="flex-1 px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2855a6]"
                    />
                    <Button size="sm">
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Status */}
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-100 mb-3">Review Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Preparer Sign-off</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Reviewer Sign-off</span>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Manager Approval</span>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WorkpaperLayout>
  );
}
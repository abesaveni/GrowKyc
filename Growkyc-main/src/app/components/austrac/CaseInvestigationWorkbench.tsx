import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Shield,
  FileText,
  Users,
  TrendingDown,
  Calendar,
  Eye,
  Download,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  DollarSign,
  Building,
  Globe,
  Scale,
  Activity,
  ArrowLeft
} from 'lucide-react';

type TabType = 'facts' | 'triggers' | 'evidence' | 'screening' | 'related' | 'financial' | 'service' | 'prior';

interface CaseInvestigationWorkbenchProps {
  caseId?: string;
  onBack?: () => void;
}

export function CaseInvestigationWorkbench({ caseId, onBack }: CaseInvestigationWorkbenchProps = {}) {
  const [activeTab, setActiveTab] = useState<TabType>('facts');
  const [recommendation, setRecommendation] = useState<string>('');

  const caseData = {
    caseId: caseId || 'AUS-2026-002',
    subject: 'ABC Enterprises Pty Ltd',
    status: 'Under Investigation',
    assignedTo: 'Michael Chen',
    created: '2026-03-20',
    slaRemaining: '8 hours'
  };

  // Timeline events
  const timelineEvents = [
    { date: '2024-06-15', event: 'Onboarding completed', icon: CheckCircle, color: 'green' },
    { date: '2024-06-16', event: 'Identity verified (Equifax)', icon: Shield, color: 'blue' },
    { date: '2024-06-16', event: 'AML screening - Clear', icon: Shield, color: 'green' },
    { date: '2024-06-20', event: 'Risk rating: Low', icon: TrendingDown, color: 'green' },
    { date: '2025-03-10', event: 'Monitoring alert - PEP change', icon: AlertTriangle, color: 'amber' },
    { date: '2025-03-12', event: 'Risk rating upgraded: Medium', icon: TrendingDown, color: 'amber' },
    { date: '2025-09-15', event: 'Document update - Company extract', icon: FileText, color: 'blue' },
    { date: '2026-01-20', event: 'Monitoring alert - Adverse media', icon: AlertTriangle, color: 'orange' },
    { date: '2026-03-18', event: 'Monitoring alert - Court case', icon: Scale, color: 'orange' },
    { date: '2026-03-20', event: 'ESCALATION: Sanctions match detected', icon: XCircle, color: 'red' },
    { date: '2026-03-20', event: 'AUSTRAC case created', icon: Shield, color: 'red' }
  ];

  // Evidence items
  const evidenceItems = [
    {
      id: 'E1',
      type: 'Sanctions Match',
      title: 'DFAT Consolidated List - Director Match',
      confidence: 94,
      source: 'ComplyAdvantage',
      date: '2026-03-20'
    },
    {
      id: 'E2',
      type: 'Adverse Media',
      title: 'Financial Crime Investigation - Singapore',
      confidence: 82,
      source: 'ComplyAdvantage',
      date: '2026-03-20'
    },
    {
      id: 'E3',
      type: 'Source of Funds',
      title: 'Unexplained Capital Injection - $2.5M',
      confidence: 67,
      source: 'Internal SOF Bot',
      date: '2026-03-19'
    },
    {
      id: 'E4',
      type: 'Court Record',
      title: 'Civil Litigation - Singapore Court',
      confidence: 78,
      source: 'Illion',
      date: '2026-03-18'
    }
  ];

  const screeningHistory = [
    { date: '2024-06-16', check: 'Identity Verification', provider: 'Equifax', result: 'Passed', risk: 'Low' },
    { date: '2024-06-16', check: 'PEP Screening', provider: 'ComplyAdvantage', result: 'Clear', risk: 'Low' },
    { date: '2024-06-16', check: 'Sanctions Screening', provider: 'ComplyAdvantage', result: 'Clear', risk: 'Low' },
    { date: '2024-06-16', check: 'Adverse Media', provider: 'ComplyAdvantage', result: 'Clear', risk: 'Low' },
    { date: '2024-06-17', check: 'Entity Verification', provider: 'ASIC', result: 'Active', risk: 'Low' },
    { date: '2024-06-17', check: 'Beneficial Ownership', provider: 'ASIC', result: 'Verified', risk: 'Low' },
    { date: '2025-03-10', check: 'PEP Screening (Refresh)', provider: 'ComplyAdvantage', result: 'Foreign PEP', risk: 'Medium' },
    { date: '2026-01-20', check: 'Adverse Media (Monitoring)', provider: 'ComplyAdvantage', result: 'Match Found', risk: 'High' },
    { date: '2026-03-20', check: 'Sanctions Screening (Monitoring)', provider: 'ComplyAdvantage', result: 'Match', risk: 'Critical' }
  ];

  const relatedSubjects = [
    { name: 'John Smith', role: 'Director', relationship: '100% ownership', riskFlag: 'Sanctions Match' },
    { name: 'Sarah Wong', role: 'Director', relationship: 'Appointed 2024', riskFlag: 'Foreign PEP' },
    { name: 'Tech Holdings Ltd', role: 'Parent Company', relationship: 'Singapore', riskFlag: 'Court Case' }
  ];

  const tabs = [
    { id: 'facts', label: 'Facts', icon: FileText },
    { id: 'triggers', label: 'Triggers', icon: AlertTriangle },
    { id: 'evidence', label: 'Evidence', icon: Eye },
    { id: 'screening', label: 'Screening History', icon: Shield },
    { id: 'related', label: 'Related Subjects', icon: Users },
    { id: 'financial', label: 'Financial Context', icon: DollarSign },
    { id: 'service', label: 'Service Activity', icon: Activity },
    { id: 'prior', label: 'Prior Decisions', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1900px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" onClick={onBack} className="bg-white/10 border-2 border-white/20 text-white hover:bg-white/20">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
              )}
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
                <Eye className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Case Investigation Workbench</h1>
                <p className="text-white/90">Case: {caseData.caseId} | {caseData.subject}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge className="bg-red-100 text-red-700 text-lg px-4 py-2">
                <Clock className="w-5 h-5 mr-2" />
                SLA: {caseData.slaRemaining}
              </Badge>
              <Button className="bg-white text-slate-800 hover:bg-slate-100">
                Save Progress
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT PANEL - Timeline (3 columns) */}
          <div className="col-span-3">
            <Card className="border-2 border-blue-300 shadow-lg sticky top-6">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 max-h-[800px] overflow-y-auto">
                <div className="space-y-4">
                  {timelineEvents.map((event, idx) => {
                    const Icon = event.icon;
                    return (
                      <div key={idx} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 bg-${event.color}-100 rounded-full flex items-center justify-center border-2 border-${event.color}-300`}>
                            <Icon className={`w-5 h-5 text-${event.color}-600`} />
                          </div>
                          {idx < timelineEvents.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-xs text-gray-600 mb-1">{event.date}</p>
                          <p className="text-sm font-semibold text-gray-900">{event.event}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CENTRE PANEL - Investigation Tabs (6 columns) */}
          <div className="col-span-6">
            <Card className="border-2 border-purple-300 shadow-lg">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex gap-2 flex-wrap">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={
                          activeTab === tab.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-purple-100'
                        }
                        size="sm"
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {tab.label}
                      </Button>
                    );
                  })}
                </div>
              </CardHeader>
              <CardContent className="p-6 min-h-[700px]">
                {/* Facts Tab */}
                {activeTab === 'facts' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Core Facts</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">Subject Name</p>
                        <p className="font-bold text-gray-900">ABC Enterprises Pty Ltd</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">Entity Type</p>
                        <p className="font-bold text-gray-900">Proprietary Company</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">ABN</p>
                        <p className="font-bold text-gray-900">12 345 678 901</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">Registration Date</p>
                        <p className="font-bold text-gray-900">2020-04-15</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">Industry</p>
                        <p className="font-bold text-gray-900">Technology Services</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">Jurisdiction</p>
                        <p className="font-bold text-gray-900">Australia (VIC)</p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-amber-50 rounded-lg border-2 border-amber-300">
                      <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Key Risk Indicators
                      </h4>
                      <ul className="space-y-2 text-sm text-amber-800">
                        <li>• Director matches DFAT sanctions list (94% confidence)</li>
                        <li>• Severe adverse media linking to financial crime (3 articles, 2025-2026)</li>
                        <li>• Unexplained source of funds - $2.5M capital injection</li>
                        <li>• Court case in Singapore - money laundering investigation</li>
                        <li>• Second director is foreign PEP (government minister)</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Evidence Tab */}
                {activeTab === 'evidence' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Supporting Evidence</h3>
                    {evidenceItems.map((evidence) => (
                      <Card key={evidence.id} className="border-2 border-gray-300 hover:border-purple-400 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <Badge className="bg-purple-100 text-purple-700 text-xs mb-2">
                                {evidence.type}
                              </Badge>
                              <h4 className="font-bold text-gray-900">{evidence.title}</h4>
                              <p className="text-xs text-gray-600 mt-1">Source: {evidence.source} | {evidence.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Confidence</p>
                              <p className="text-2xl font-bold text-purple-900">{evidence.confidence}%</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Screening History Tab */}
                {activeTab === 'screening' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Screening History</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100 border-b-2">
                          <tr>
                            <th className="text-left py-2 px-3 text-sm font-bold">Date</th>
                            <th className="text-left py-2 px-3 text-sm font-bold">Check</th>
                            <th className="text-left py-2 px-3 text-sm font-bold">Provider</th>
                            <th className="text-left py-2 px-3 text-sm font-bold">Result</th>
                            <th className="text-left py-2 px-3 text-sm font-bold">Risk</th>
                          </tr>
                        </thead>
                        <tbody>
                          {screeningHistory.map((check, idx) => (
                            <tr key={idx} className="border-b hover:bg-purple-50">
                              <td className="py-2 px-3 text-sm">{check.date}</td>
                              <td className="py-2 px-3 text-sm font-semibold">{check.check}</td>
                              <td className="py-2 px-3 text-sm">
                                <Badge variant="outline" className="text-xs">{check.provider}</Badge>
                              </td>
                              <td className="py-2 px-3 text-sm">{check.result}</td>
                              <td className="py-2 px-3">
                                <Badge className={
                                  check.risk === 'Critical' ? 'bg-red-100 text-red-700' :
                                  check.risk === 'High' ? 'bg-orange-100 text-orange-700' :
                                  check.risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                  'bg-green-100 text-green-700'
                                }>
                                  {check.risk}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Related Subjects Tab */}
                {activeTab === 'related' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Related Subjects</h3>
                    {relatedSubjects.map((subject, idx) => (
                      <Card key={idx} className="border-2 border-gray-300">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <Users className="w-10 h-10 text-blue-600 bg-blue-100 p-2 rounded-lg" />
                              <div>
                                <h4 className="font-bold text-gray-900">{subject.name}</h4>
                                <p className="text-sm text-gray-600">{subject.role}</p>
                                <p className="text-xs text-gray-600 mt-1">{subject.relationship}</p>
                              </div>
                            </div>
                            <Badge className="bg-red-100 text-red-700 border-red-300">
                              {subject.riskFlag}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Placeholder tabs */}
                {activeTab === 'triggers' && (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                    <p className="text-gray-600">Trigger details shown here</p>
                  </div>
                )}
                {activeTab === 'financial' && (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-600">Financial context and transactions shown here</p>
                  </div>
                )}
                {activeTab === 'service' && (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                    <p className="text-gray-600">Service activity logs shown here</p>
                  </div>
                )}
                {activeTab === 'prior' && (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-600">Prior compliance decisions shown here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANEL - Investigator Assessment (3 columns) */}
          <div className="col-span-3">
            <Card className="border-2 border-green-300 shadow-lg sticky top-6">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Suspicion Category</label>
                  <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm">
                    <option>Select category...</option>
                    <option>Money Laundering</option>
                    <option>Terrorism Financing</option>
                    <option>Sanctions Evasion</option>
                    <option>Fraud</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Suspected Conduct Type</label>
                  <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm">
                    <option>Select type...</option>
                    <option>Structuring</option>
                    <option>Third Party Deposits</option>
                    <option>Sanctions Breach</option>
                    <option>False Documentation</option>
                    <option>Unexplained Wealth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Internal Risk Severity</label>
                  <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm">
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Supporting Rationale</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm"
                    placeholder="Document your analysis and reasoning..."
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-300">
                  <label className="block text-xs font-bold text-amber-900 mb-2">Missing Evidence</label>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-xs text-amber-800">
                      <input type="checkbox" />
                      UBO verification incomplete
                    </label>
                    <label className="flex items-center gap-2 text-xs text-amber-800">
                      <input type="checkbox" />
                      SOF documentation required
                    </label>
                    <label className="flex items-center gap-2 text-xs text-amber-800">
                      <input type="checkbox" />
                      Court case details pending
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <label className="block text-sm font-bold text-gray-900 mb-3">Recommendation</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-3 border-2 border-red-300 rounded-lg hover:bg-red-50 cursor-pointer">
                      <input
                        type="radio"
                        name="recommendation"
                        value="report"
                        checked={recommendation === 'report'}
                        onChange={(e) => setRecommendation(e.target.value)}
                      />
                      <div className="flex-1">
                        <p className="font-bold text-red-900 text-sm">Report to AUSTRAC</p>
                        <p className="text-xs text-red-700">Suspicious matter confirmed</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="recommendation"
                        value="no_report"
                        checked={recommendation === 'no_report'}
                        onChange={(e) => setRecommendation(e.target.value)}
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">Do Not Report</p>
                        <p className="text-xs text-gray-700">Not suspicious</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-3 border-2 border-indigo-300 rounded-lg hover:bg-indigo-50 cursor-pointer">
                      <input
                        type="radio"
                        name="recommendation"
                        value="monitor"
                        checked={recommendation === 'monitor'}
                        onChange={(e) => setRecommendation(e.target.value)}
                      />
                      <div className="flex-1">
                        <p className="font-bold text-indigo-900 text-sm">Enhanced Monitoring</p>
                        <p className="text-xs text-indigo-700">Watch for 90 days</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-3 border-2 border-purple-300 rounded-lg hover:bg-purple-50 cursor-pointer">
                      <input
                        type="radio"
                        name="recommendation"
                        value="escalate"
                        checked={recommendation === 'escalate'}
                        onChange={(e) => setRecommendation(e.target.value)}
                      />
                      <div className="flex-1">
                        <p className="font-bold text-purple-900 text-sm">Senior Review Required</p>
                        <p className="text-xs text-purple-700">Escalate to MLRO</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <ChevronRight className="w-5 h-5 mr-2" />
                    Complete Investigation
                  </Button>
                  <Button variant="outline" className="w-full border-2">
                    Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

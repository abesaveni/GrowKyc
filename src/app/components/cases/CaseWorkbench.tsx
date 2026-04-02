import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Users,
  Building,
  TrendingUp,
  FileText,
  Clock,
  Target,
  Activity,
  Play,
  Ban,
  Send,
  Save,
  ArrowLeft,
  Calendar,
  User,
  CreditCard,
  Scale,
  DollarSign,
  Download,
  RefreshCw,
  Upload,
  Plus,
  MessageSquare,
  GitBranch,
  ExternalLink
} from 'lucide-react';

type TabType = 'summary' | 'triggers' | 'evidence' | 'screening' | 'financial' | 'ownership' | 'related' | 'notes';

interface CaseWorkbenchProps {
  onBack?: () => void;
}

export function CaseWorkbench({ onBack }: CaseWorkbenchProps = {}) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [caseStatus, setCaseStatus] = useState<string>('investigating');
  const [decision, setDecision] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');

  const caseData = {
    id: 'CASE-2026-001',
    clientName: 'ABC Enterprises Pty Ltd',
    clientType: 'Company',
    caseType: 'Sanctions Match',
    riskLevel: 'Critical',
    status: 'Investigating',
    assignedTo: 'Michael Chen',
    created: '2026-03-20 14:30',
    slaRemaining: '8 hours',
    triggerSource: 'Sanctions Screening Bot'
  };

  const timelineEvents = [
    { time: '2026-03-20 14:30', user: 'System', action: 'Case created', icon: Target, color: 'blue' },
    { time: '2026-03-20 14:31', user: 'Sanctions Bot', action: 'Sanctions match detected (94% confidence)', icon: Shield, color: 'red' },
    { time: '2026-03-20 14:35', user: 'Adverse Media Bot', action: 'Severe adverse media found (3 articles)', icon: FileText, color: 'orange' },
    { time: '2026-03-20 15:00', user: 'Michael Chen', action: 'Case assigned', icon: User, color: 'blue' },
    { time: '2026-03-20 15:15', user: 'Michael Chen', action: 'Added note: "Reviewing sanctions match details"', icon: FileText, color: 'gray' },
    { time: '2026-03-21 09:00', user: 'Michael Chen', action: 'Uploaded supporting document', icon: FileText, color: 'green' },
    { time: '2026-03-21 10:30', user: 'Michael Chen', action: 'Status updated to Investigating', icon: Activity, color: 'amber' }
  ];

  const triggers = [
    {
      id: 'T1',
      source: 'Sanctions Screening Bot',
      reason: 'Director "John Smith" matched to DFAT consolidated list',
      severity: 'critical',
      confidence: 94,
      timestamp: '2026-03-20 14:31'
    },
    {
      id: 'T2',
      source: 'Adverse Media Bot',
      reason: 'Severe adverse media - money laundering investigation',
      severity: 'high',
      confidence: 82,
      timestamp: '2026-03-20 14:35'
    },
    {
      id: 'T3',
      source: 'Source of Funds Bot',
      reason: 'Unexplained capital injection of $2.5M',
      severity: 'medium',
      confidence: 67,
      timestamp: '2026-03-19 10:15'
    }
  ];

  const evidence = [
    { type: 'Sanctions Match', title: 'DFAT List - Director Match', provider: 'ComplyAdvantage', confidence: 94 },
    { type: 'Adverse Media', title: 'Singapore Investigation Article', provider: 'ComplyAdvantage', confidence: 82 },
    { type: 'Adverse Media', title: 'Regulatory Action Pending', provider: 'ComplyAdvantage', confidence: 78 },
    { type: 'Source of Funds', title: 'Unexplained Funds Analysis', provider: 'Internal SOF Bot', confidence: 67 },
    { type: 'Document', title: 'Bank Statement - Feb 2026', provider: 'Client Upload', confidence: 100 }
  ];

  const requiredActions = [
    { id: 1, text: 'Verify identity documents', completed: true },
    { id: 2, text: 'Confirm ultimate beneficial ownership', completed: true },
    { id: 3, text: 'Request source of funds documentation', completed: false },
    { id: 4, text: 'Escalate to compliance manager', completed: false },
    { id: 5, text: 'Apply service hold pending review', completed: true }
  ];

  const tabs = [
    { id: 'summary', label: 'Summary', icon: Eye },
    { id: 'triggers', label: 'Triggers', icon: AlertTriangle },
    { id: 'evidence', label: 'Evidence', icon: FileText },
    { id: 'screening', label: 'Screening', icon: Shield },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'ownership', label: 'Ownership', icon: Users },
    { id: 'related', label: 'Related Parties', icon: Users },
    { id: 'notes', label: 'Notes', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-orange-900 rounded-lg p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button className="bg-white/20 border-2 border-white/30 text-white hover:bg-white/30" onClick={onBack}>
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Cases
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{caseData.id}</h1>
                <p className="text-white/90">{caseData.clientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-red-100 text-red-700 text-lg px-4 py-2">
                <Clock className="w-5 h-5 mr-2" />
                SLA: {caseData.slaRemaining}
              </Badge>
              <Badge className="bg-white text-red-900 text-lg px-4 py-2">
                {caseData.riskLevel.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT PANEL - Timeline */}
          <div className="col-span-3">
            <Card className="border-2 border-blue-300 shadow-lg sticky top-6">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
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
                            <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-xs text-gray-600 mb-1">{event.time}</p>
                          <p className="text-xs text-gray-500 mb-1">{event.user}</p>
                          <p className="text-sm font-semibold text-gray-900">{event.action}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CENTRE PANEL - Investigation */}
          <div className="col-span-6">
            <Card className="border-2 border-purple-300 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <div className="flex gap-2 flex-wrap">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        size="sm"
                        className={
                          activeTab === tab.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-purple-100'
                        }
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {tab.label}
                      </Button>
                    );
                  })}
                </div>
              </CardHeader>
              <CardContent className="p-6 min-h-[700px]">
                {/* Summary Tab */}
                {activeTab === 'summary' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Case Overview</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700 mb-1">Case Type</p>
                          <p className="font-bold text-gray-900">{caseData.caseType}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700 mb-1">Risk Level</p>
                          <Badge className="bg-red-100 text-red-700 text-lg px-3 py-1">
                            {caseData.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700 mb-1">Client</p>
                          <p className="font-bold text-gray-900">{caseData.clientName}</p>
                          <p className="text-xs text-gray-600">{caseData.clientType}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700 mb-1">Trigger Source</p>
                          <p className="font-semibold text-gray-900">{caseData.triggerSource}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-red-50 rounded-lg border-2 border-red-300">
                      <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6" />
                        Key Risk Indicators
                      </h3>
                      <ul className="space-y-2 text-sm text-red-800">
                        <li>• Director matched to DFAT sanctions list (94% confidence)</li>
                        <li>• Severe adverse media linking to money laundering investigation</li>
                        <li>• Unexplained capital injection of $2.5M</li>
                        <li>• Foreign PEP among directors</li>
                        <li>• Parent company under investigation in Singapore</li>
                      </ul>
                    </div>

                    <div className="p-6 bg-amber-50 rounded-lg border-2 border-amber-300">
                      <h3 className="font-bold text-amber-900 mb-3">Current Status</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-amber-700 mb-1">Status</p>
                          <Badge className="bg-amber-100 text-amber-700 text-lg px-3 py-1">
                            {caseData.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-amber-700 mb-1">Assigned To</p>
                          <p className="font-semibold text-gray-900">{caseData.assignedTo}</p>
                        </div>
                        <div>
                          <p className="text-sm text-amber-700 mb-1">Created</p>
                          <p className="font-semibold text-gray-900">{caseData.created}</p>
                        </div>
                        <div>
                          <p className="text-sm text-amber-700 mb-1">SLA Remaining</p>
                          <p className="font-bold text-orange-700">{caseData.slaRemaining}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Triggers Tab */}
                {activeTab === 'triggers' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Why This Case Exists</h3>
                    {triggers.map((trigger) => (
                      <Card key={trigger.id} className="border-2 border-red-300">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs mb-2">
                                <Shield className="w-3 h-3 mr-1" />
                                {trigger.source}
                              </Badge>
                              <h4 className="font-bold text-gray-900">{trigger.reason}</h4>
                              <p className="text-xs text-gray-600 mt-1">{trigger.timestamp}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={
                                trigger.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                trigger.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                'bg-amber-100 text-amber-700'
                              }>
                                {trigger.severity.toUpperCase()}
                              </Badge>
                              <p className="text-xs text-gray-600 mt-1">
                                Confidence: <span className="font-bold">{trigger.confidence}%</span>
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Evidence Tab */}
                {activeTab === 'evidence' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Supporting Evidence</h3>
                    {evidence.map((item, idx) => (
                      <Card key={idx} className="border-2 border-purple-300 hover:border-purple-500 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Badge className="bg-purple-100 text-purple-700 text-xs mb-2">
                                {item.type}
                              </Badge>
                              <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                              <p className="text-xs text-gray-600">Provider: {item.provider}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Confidence</p>
                              <p className="text-2xl font-bold text-purple-900">{item.confidence}%</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
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

                {/* Screening Tab */}
                {activeTab === 'screening' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Comprehensive AML Screening Results</h3>
                    
                    {/* Sanctions Screening */}
                    <Card className="border-2 border-red-300 bg-red-50/30">
                      <CardHeader className="bg-red-100 border-b-2 border-red-300">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="w-6 h-6 text-red-700" />
                            <span className="text-red-900">Sanctions Screening</span>
                          </div>
                          <Badge className="bg-red-600 text-white text-lg px-3 py-1">
                            MATCH FOUND
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="bg-white rounded-lg p-4 border-2 border-red-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 mb-1">Director: John Smith</h4>
                              <p className="text-sm text-gray-600">DOB: 15 March 1975 | Passport: AU1234567</p>
                            </div>
                            <Badge className="bg-red-100 text-red-700">94% Match</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-red-50 rounded p-3">
                              <p className="text-sm font-bold text-red-900 mb-1">DFAT Consolidated List</p>
                              <p className="text-sm text-red-800">Match: "John Michael Smith" - Listed 2024-02-15</p>
                              <p className="text-xs text-red-700 mt-1">Reason: Financial sanctions related to illicit activities</p>
                            </div>
                            <div className="bg-red-50 rounded p-3">
                              <p className="text-sm font-bold text-red-900 mb-1">UN Security Council List</p>
                              <p className="text-sm text-red-800">Match: "J.M. Smith" - Listed 2024-01-20</p>
                              <p className="text-xs text-red-700 mt-1">Listed entity associated with sanctioned organization</p>
                            </div>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="outline" className="border-red-300">
                              <Eye className="w-4 h-4 mr-1" />
                              View Full Report
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-300">
                              <Download className="w-4 h-4 mr-1" />
                              Export Evidence
                            </Button>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-300">
                          <p className="text-xs text-gray-600 mb-1">
                            <strong>Provider:</strong> ComplyAdvantage | <strong>Last Screened:</strong> 2026-03-20 14:31 | <strong>Database Version:</strong> 2026-Q1-v2.4
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* PEP Screening */}
                    <Card className="border-2 border-orange-300 bg-orange-50/30">
                      <CardHeader className="bg-orange-100 border-b-2 border-orange-300">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="w-6 h-6 text-orange-700" />
                            <span className="text-orange-900">PEP Screening</span>
                          </div>
                          <Badge className="bg-orange-600 text-white text-lg px-3 py-1">
                            PEP DETECTED
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 mb-1">Director: Sarah Lee</h4>
                              <p className="text-sm text-gray-600">DOB: 22 August 1968 | Position: Non-Executive Director</p>
                            </div>
                            <Badge className="bg-orange-100 text-orange-700">Foreign PEP</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-orange-50 rounded p-3">
                              <p className="text-sm font-bold text-orange-900 mb-1">Political Position</p>
                              <p className="text-sm text-orange-800">Deputy Minister of Trade - Singapore (2018-2023)</p>
                              <p className="text-xs text-orange-700 mt-1">Role ended: 31 December 2023 (3 months ago)</p>
                            </div>
                            <div className="bg-orange-50 rounded p-3">
                              <p className="text-sm font-bold text-orange-900 mb-1">Related Party Connections</p>
                              <p className="text-sm text-orange-800">Spouse: Michael Lee - Board Member, Singapore Development Bank</p>
                              <p className="text-xs text-orange-700 mt-1">RCA (Relative/Close Associate) classification applies</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Button size="sm" variant="outline" className="border-orange-300">
                              <Eye className="w-4 h-4 mr-1" />
                              View PEP Profile
                            </Button>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-300">
                          <p className="text-xs text-gray-600">
                            <strong>Provider:</strong> Dow Jones Risk & Compliance | <strong>Last Screened:</strong> 2026-03-20 14:32 | <strong>PEP Status:</strong> Active monitoring required (cooling-off period: 2026-12-31)
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Adverse Media */}
                    <Card className="border-2 border-amber-300 bg-amber-50/30">
                      <CardHeader className="bg-amber-100 border-b-2 border-amber-300">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-6 h-6 text-amber-700" />
                            <span className="text-amber-900">Adverse Media</span>
                          </div>
                          <Badge className="bg-amber-600 text-white text-lg px-3 py-1">
                            3 SEVERE ALERTS
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-red-100 text-red-700">SEVERE</Badge>
                            <span className="font-bold text-gray-900">Money Laundering Investigation</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            "ABC Enterprises under investigation for alleged money laundering activities linked to offshore accounts"
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div><strong>Source:</strong> The Straits Times</div>
                            <div><strong>Date:</strong> 2026-02-28</div>
                            <div><strong>Category:</strong> Financial Crime</div>
                            <div><strong>Confidence:</strong> 82%</div>
                          </div>
                          <Button size="sm" variant="outline" className="mt-3 border-amber-300">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Read Full Article
                          </Button>
                        </div>

                        <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-orange-100 text-orange-700">HIGH</Badge>
                            <span className="font-bold text-gray-900">Regulatory Action Pending</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            "Singapore authorities reviewing ABC Enterprises' compliance with AML/CTF regulations following suspicious transaction reports"
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div><strong>Source:</strong> Reuters Business</div>
                            <div><strong>Date:</strong> 2026-03-05</div>
                            <div><strong>Category:</strong> Regulatory</div>
                            <div><strong>Confidence:</strong> 78%</div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-orange-100 text-orange-700">HIGH</Badge>
                            <span className="font-bold text-gray-900">Court Proceedings</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            "Civil proceedings initiated by former business partner alleging fraudulent transfer of assets"
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div><strong>Source:</strong> Singapore Court Records</div>
                            <div><strong>Date:</strong> 2026-01-15</div>
                            <div><strong>Category:</strong> Litigation</div>
                            <div><strong>Confidence:</strong> 91%</div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-300">
                          <p className="text-xs text-gray-600">
                            <strong>Provider:</strong> ComplyAdvantage Media Monitoring | <strong>Monitoring:</strong> Real-time | <strong>Languages:</strong> English, Mandarin, Malay
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Watchlist Screening */}
                    <Card className="border-2 border-blue-300">
                      <CardHeader className="bg-blue-100 border-b-2 border-blue-300">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="w-6 h-6 text-blue-700" />
                            <span className="text-blue-900">Watchlist Screening</span>
                          </div>
                          <Badge className="bg-green-100 text-green-700 text-lg px-3 py-1">
                            NO MATCHES
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-bold text-green-900">All Clear</span>
                          </div>
                          <ul className="text-sm text-gray-700 space-y-1 ml-7">
                            <li>✓ INTERPOL Wanted Persons - No match</li>
                            <li>✓ OFAC SDN List - No match</li>
                            <li>✓ EU Sanctions List - No match</li>
                            <li>✓ UK HM Treasury - No match</li>
                            <li>✓ FBI Most Wanted - No match</li>
                            <li>✓ Disqualified Directors (ASIC) - No match</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-300 mt-3">
                          <p className="text-xs text-gray-600">
                            <strong>Provider:</strong> World-Check (Refinitiv) | <strong>Lists Screened:</strong> 1,247 global watchlists | <strong>Last Update:</strong> 2026-03-20 14:31
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Identity Verification Cross-Check */}
                    <Card className="border-2 border-purple-300">
                      <CardHeader className="bg-purple-100 border-b-2 border-purple-300">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="w-6 h-6 text-purple-700" />
                            <span className="text-purple-900">Identity Verification Cross-Check</span>
                          </div>
                          <Badge className="bg-amber-100 text-amber-700 text-lg px-3 py-1">
                            REVIEW REQUIRED
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="bg-white rounded-lg p-4 border border-purple-200">
                          <h4 className="font-bold text-gray-900 mb-3">Director Identity Discrepancies</h4>
                          <div className="space-y-3">
                            <div className="bg-amber-50 rounded p-3 border border-amber-200">
                              <p className="text-sm font-bold text-amber-900 mb-1">⚠️ Address Mismatch</p>
                              <p className="text-sm text-gray-700">ASIC records show director address as Singapore, but passport shows Malaysian residential address</p>
                            </div>
                            <div className="bg-amber-50 rounded p-3 border border-amber-200">
                              <p className="text-sm font-bold text-amber-900 mb-1">⚠️ Multiple Nationalities</p>
                              <p className="text-sm text-gray-700">Director holds dual citizenship (Singapore & Malaysia) - Enhanced CDD recommended</p>
                            </div>
                            <div className="bg-green-50 rounded p-3 border border-green-200">
                              <p className="text-sm font-bold text-green-900 mb-1">✓ Identity Documents Verified</p>
                              <p className="text-sm text-gray-700">Passport and national ID verified via InfoTrack - documents authentic</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-300">
                          <p className="text-xs text-gray-600">
                            <strong>Provider:</strong> InfoTrack Australia | <strong>Verification:</strong> GreenID + Document OCR | <strong>Status:</strong> Verified with notes
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Summary Risk Score */}
                    <Card className="border-2 border-red-400 bg-red-50">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-7 h-7" />
                          Screening Summary & Risk Assessment
                        </h3>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-4 border-2 border-red-300 text-center">
                            <p className="text-sm text-gray-600 mb-1">Overall Risk</p>
                            <p className="text-4xl font-bold text-red-600">CRITICAL</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border-2 border-orange-300 text-center">
                            <p className="text-sm text-gray-600 mb-1">Screening Score</p>
                            <p className="text-4xl font-bold text-orange-600">94/100</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border-2 border-amber-300 text-center">
                            <p className="text-sm text-gray-600 mb-1">Alerts</p>
                            <p className="text-4xl font-bold text-amber-600">7</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-red-300">
                          <p className="text-sm font-bold text-red-900 mb-2">Recommendation:</p>
                          <ul className="text-sm text-gray-800 space-y-1">
                            <li>🔴 <strong>REJECT</strong> client onboarding immediately</li>
                            <li>🔴 Escalate to Head of Compliance and MLRO</li>
                            <li>🔴 Consider AUSTRAC suspicious matter report (SMR)</li>
                            <li>🔴 Do not proceed with any services until investigation complete</li>
                            <li>🔴 Apply service hold and freeze all related accounts</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Placeholder for other tabs */}
                {!['summary', 'triggers', 'evidence', 'screening'].includes(activeTab) && (
                  <div className="text-center py-12">
                    <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {tabs.find(t => t.id === activeTab)?.label} details will be displayed here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANEL - Actions + Decision */}
          <div className="col-span-3">
            <Card className="border-2 border-green-300 shadow-lg sticky top-6">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-green-600" />
                  Actions & Decision
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Section 1 - Case Status */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Case Status</label>
                  <select
                    value={caseStatus}
                    onChange={(e) => setCaseStatus(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="investigating">Investigating</option>
                    <option value="escalated">Escalated</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* Section 2 - Required Actions */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-bold text-gray-900 mb-3">Required Actions</p>
                  <div className="space-y-2">
                    {requiredActions.map((action) => (
                      <label key={action.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={action.completed}
                          className="w-5 h-5"
                          readOnly
                        />
                        <span className={`text-sm flex-1 ${action.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {action.text}
                        </span>
                        {action.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Section 3 - Run Checks */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-bold text-gray-900 mb-3">Run Checks</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Run AML', icon: Shield },
                      { label: 'Run Identity', icon: User },
                      { label: 'Run Credit', icon: CreditCard },
                      { label: 'Run Business Risk', icon: TrendingUp },
                      { label: 'Run Ownership', icon: Users },
                      { label: 'Run SOF / SOW', icon: DollarSign }
                    ].map((check) => {
                      const Icon = check.icon;
                      return (
                        <Button
                          key={check.label}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start border-2"
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {check.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4 - Advanced Checks */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-bold text-gray-900 mb-3">Advanced Checks</p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start border-2 border-purple-300">
                      <Scale className="w-4 h-4 mr-2" />
                      Run Legal (LexisNexis)
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start border-2 border-indigo-300">
                      <Shield className="w-4 h-4 mr-2" />
                      Run Crypto (Chainalysis)
                    </Button>
                  </div>
                </div>

                {/* Section 5 - Decision Panel */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-bold text-gray-900 mb-3">Decision</p>
                  <div className="space-y-2">
                    {[
                      { value: 'approve', label: 'Approve', color: 'green' },
                      { value: 'approve_conditions', label: 'Approve with Conditions', color: 'amber' },
                      { value: 'escalate', label: 'Escalate', color: 'orange' },
                      { value: 'reject', label: 'Reject', color: 'red' },
                      { value: 'austrac', label: 'Send to AUSTRAC', color: 'red' },
                      { value: 'monitor', label: 'Monitor', color: 'indigo' }
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer hover:shadow-md transition-all ${
                          decision === opt.value
                            ? `border-${opt.color}-500 bg-${opt.color}-50`
                            : 'border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="decision"
                          value={opt.value}
                          checked={decision === opt.value}
                          onChange={(e) => setDecision(e.target.value)}
                        />
                        <span className="text-sm font-semibold text-gray-900">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {decision && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Decision Reason</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Document your decision rationale..."
                    />
                  </div>
                )}

                {/* Section 6 - Service Controls */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-bold text-gray-900 mb-3">Service Controls</p>
                  <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>No restriction</option>
                    <option>Review required</option>
                    <option>Service hold</option>
                    <option>Limited service</option>
                    <option>Disengage</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6">
                    <Send className="w-5 h-5 mr-2" />
                    Submit Decision
                  </Button>
                  <Button variant="outline" className="w-full border-2">
                    <Save className="w-5 h-5 mr-2" />
                    Save Progress
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
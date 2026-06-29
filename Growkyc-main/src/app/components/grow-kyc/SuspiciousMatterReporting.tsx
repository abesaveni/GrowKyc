import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  ArrowLeft,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  Lock,
  Shield,
  DollarSign,
  TrendingUp,
  Activity,
  User,
  Calendar,
  Flag
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface SuspiciousMatterReportingProps {
  onBack: () => void;
}

export function SuspiciousMatterReporting({ onBack }: SuspiciousMatterReportingProps) {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('register');

  // SMR Cases
  const smrCases = [
    {
      caseId: 'SMR-2024-001',
      clientId: 'CL-2024-1847',
      clientName: 'Pinnacle Investment Group Pty Ltd',
      dateIdentified: '2024-03-10',
      suspicionType: 'Structuring',
      severity: 'High',
      status: 'Under Review',
      assignedTo: 'Sarah Chen',
      reportingOfficer: 'Michael Roberts',
      decision: null,
      lodgementDate: null,
      austractReference: null,
      linkedTransactions: ['TXN-2024-4521', 'TXN-2024-4523', 'TXN-2024-4528']
    },
    {
      caseId: 'SMR-2024-002',
      clientId: 'CL-2023-2156',
      clientName: 'Global Ventures Pty Ltd',
      dateIdentified: '2024-03-15',
      suspicionType: 'Source of Funds',
      severity: 'Medium',
      status: 'Approved',
      assignedTo: 'Emma Williams',
      reportingOfficer: 'Michael Roberts',
      decision: 'Lodge',
      lodgementDate: '2024-03-18',
      austractReference: 'SMR-2024-ABC123',
      linkedTransactions: ['TXN-2024-5012']
    },
    {
      caseId: 'SMR-2024-003',
      clientId: 'CL-2023-1876',
      clientName: 'Summit Capital Partners',
      dateIdentified: '2024-03-01',
      suspicionType: 'Third Party Payments',
      severity: 'High',
      status: 'Lodged',
      assignedTo: 'David Thompson',
      reportingOfficer: 'Michael Roberts',
      decision: 'Lodge',
      lodgementDate: '2024-03-05',
      austractReference: 'SMR-2024-XYZ789',
      linkedTransactions: ['TXN-2024-4789', 'TXN-2024-4790', 'TXN-2024-4805']
    },
    {
      caseId: 'SMR-2024-004',
      clientId: 'CL-2024-0892',
      clientName: 'Heritage Property Trust',
      dateIdentified: '2024-02-28',
      suspicionType: 'Unusual Transaction Pattern',
      severity: 'Low',
      status: 'Closed',
      assignedTo: 'Emma Williams',
      reportingOfficer: 'Sarah Chen',
      decision: 'Do Not Lodge',
      lodgementDate: null,
      austractReference: null,
      linkedTransactions: ['TXN-2024-3456']
    },
    {
      caseId: 'SMR-2024-005',
      clientId: 'CL-2024-1203',
      clientName: 'Quantum Technologies Ltd',
      dateIdentified: '2024-03-20',
      suspicionType: 'PEP Association',
      severity: 'Medium',
      status: 'Open',
      assignedTo: 'Sarah Chen',
      reportingOfficer: 'Michael Roberts',
      decision: null,
      lodgementDate: null,
      austractReference: null,
      linkedTransactions: []
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-600';
      case 'Under Review': return 'bg-amber-600';
      case 'Approved': return 'bg-purple-600';
      case 'Lodged': return 'bg-green-600';
      case 'Closed': return 'bg-gray-600';
      default: return 'bg-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-600';
      case 'Medium': return 'bg-amber-600';
      case 'Low': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const statusStates = ['Open', 'Under Review', 'Approved', 'Lodged', 'Closed'];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-white/30" />
            <Shield className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold">Suspicious Matter Reporting (SMR)</h1>
              <p className="text-sm text-white/90">AUSTRAC Suspicious Matter Report Workflow</p>
            </div>
          </div>
          <Button className="bg-[#1e293b] text-[#13B5EA] hover:bg-white/5">
            <Flag className="w-4 h-4 mr-2" />
            New SMR Case
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[#1e293b] border-b border-white/10 px-6 py-4">
        <div className="grid grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{smrCases.length}</div>
            <div className="text-xs text-slate-300 mt-1">Total Cases</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {smrCases.filter(c => c.status === 'Open').length}
            </div>
            <div className="text-xs text-slate-300 mt-1">Open</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">
              {smrCases.filter(c => c.status === 'Under Review').length}
            </div>
            <div className="text-xs text-slate-300 mt-1">Under Review</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {smrCases.filter(c => c.status === 'Approved').length}
            </div>
            <div className="text-xs text-slate-300 mt-1">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {smrCases.filter(c => c.status === 'Lodged').length}
            </div>
            <div className="text-xs text-slate-300 mt-1">Lodged</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-300">
              {smrCases.filter(c => c.status === 'Closed').length}
            </div>
            <div className="text-xs text-slate-300 mt-1">Closed</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="register">
              <FileText className="w-4 h-4 mr-2" />
              SMR Register
            </TabsTrigger>
            <TabsTrigger value="investigation">
              <Eye className="w-4 h-4 mr-2" />
              Investigation
            </TabsTrigger>
            <TabsTrigger value="approval">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approval Workflow
            </TabsTrigger>
            <TabsTrigger value="audit">
              <Lock className="w-4 h-4 mr-2" />
              Audit Trail
            </TabsTrigger>
          </TabsList>

          {/* SMR REGISTER TAB */}
          <TabsContent value="register">
            <div className="space-y-3">
              {smrCases.map((smrCase) => (
                <Card key={smrCase.caseId} className="border-2 border-white/10 hover:border-cyan-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-12 gap-4 items-center">
                      {/* Case ID & Client */}
                      <div className="md:col-span-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <div>
                            <div className="font-bold text-white">{smrCase.caseId}</div>
                            <div className="text-sm text-slate-300">{smrCase.clientName}</div>
                            <div className="text-xs text-slate-300">{smrCase.clientId}</div>
                          </div>
                        </div>
                      </div>

                      {/* Suspicion Type & Severity */}
                      <div className="md:col-span-3">
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs text-slate-300">Suspicion Type</div>
                            <div className="font-semibold text-white">{smrCase.suspicionType}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(smrCase.severity)}>
                              {smrCase.severity} Severity
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Status & Decision */}
                      <div className="md:col-span-3">
                        <div className="space-y-2">
                          <div>
                            <div className="text-xs text-slate-300">Status</div>
                            <Badge className={getStatusColor(smrCase.status)}>
                              {smrCase.status}
                            </Badge>
                          </div>
                          {smrCase.decision && (
                            <div>
                              <div className="text-xs text-slate-300">Decision</div>
                              <Badge className={smrCase.decision === 'Lodge' ? 'bg-green-600' : 'bg-gray-600'}>
                                {smrCase.decision}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dates & Officers */}
                      <div className="md:col-span-2">
                        <div className="text-sm space-y-1">
                          <div>
                            <div className="text-xs text-slate-300">Identified</div>
                            <div className="font-semibold">{smrCase.dateIdentified}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-300">Assigned To</div>
                            <div className="font-semibold">{smrCase.assignedTo}</div>
                          </div>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="md:col-span-1">
                        <Button 
                          size="sm" 
                          className="w-full bg-cyan-600 hover:bg-cyan-700"
                          onClick={() => setSelectedCase(smrCase.caseId)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>

                    {/* Additional Details (if lodged) */}
                    {smrCase.status === 'Lodged' && smrCase.austractReference && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-300">Lodged Date: </span>
                            <span className="font-semibold">{smrCase.lodgementDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-300">AUSTRAC Reference: </span>
                            <span className="font-semibold font-mono">{smrCase.austractReference}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* INVESTIGATION TAB */}
          <TabsContent value="investigation">
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle>Internal Investigation</CardTitle>
                <CardDescription>
                  Investigation notes and findings for SMR-2024-001
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Investigation Summary */}
                <div className="bg-[#1e293b] rounded-lg p-4 border-2 border-blue-200">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Investigation Summary
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Case ID</Label>
                      <Input value="SMR-2024-001" disabled className="mt-2" />
                    </div>
                    <div>
                      <Label>Investigation Officer</Label>
                      <Input value="Sarah Chen" disabled className="mt-2" />
                    </div>
                    <div>
                      <Label>Date Opened</Label>
                      <Input value="2024-03-10" disabled className="mt-2" />
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Badge className="bg-red-600 mt-2">High Priority</Badge>
                    </div>
                  </div>
                </div>

                {/* Linked Customer Profile */}
                <div className="bg-cyan-50 rounded-lg p-4 border-2 border-cyan-200">
                  <h3 className="font-bold text-cyan-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-600" />
                    Linked Customer Profile
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-300">Client: </span>
                      <span className="font-semibold">Pinnacle Investment Group Pty Ltd</span>
                    </div>
                    <div>
                      <span className="text-slate-300">Risk Rating: </span>
                      <Badge className="bg-orange-600">HIGH</Badge>
                    </div>
                    <div>
                      <span className="text-slate-300">Relationship Start: </span>
                      <span className="font-semibold">2022-06-15</span>
                    </div>
                  </div>
                </div>

                {/* Linked Transaction Activity */}
                <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
                  <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-600" />
                    Linked Transaction Activity
                  </h3>
                  <div className="space-y-2">
                    {[
                      { id: 'TXN-2024-4521', date: '2024-03-05', amount: '$49,500', type: 'Cash Deposit' },
                      { id: 'TXN-2024-4523', date: '2024-03-07', amount: '$48,800', type: 'Cash Deposit' },
                      { id: 'TXN-2024-4528', date: '2024-03-09', amount: '$49,200', type: 'Cash Deposit' }
                    ].map((txn, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-[#1e293b] rounded border border-amber-300">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-4 h-4 text-amber-600" />
                          <div>
                            <div className="font-semibold text-white">{txn.id}</div>
                            <div className="text-xs text-slate-300">{txn.type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">{txn.amount}</div>
                          <div className="text-xs text-slate-300">{txn.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-red-50 rounded border-2 border-red-300">
                    <p className="text-sm font-semibold text-red-900">
                      🚨 Pattern Detected: Three transactions just below $50,000 reporting threshold within 5 days - 
                      potential structuring to avoid TTR requirements
                    </p>
                  </div>
                </div>

                {/* Investigation Notes */}
                <div>
                  <Label>Investigation Notes</Label>
                  <Textarea 
                    rows={6}
                    placeholder="Document investigation findings, interviews conducted, evidence gathered..."
                    className="mt-2"
                    defaultValue="Investigation commenced 2024-03-10 following automated alert for potential structuring.

Interview with client conducted 2024-03-12. Client stated deposits were from multiple property sales. Documentation requested.

Documentation review 2024-03-14: Contracts of sale provided but lack independent verification. Amounts don't match deposit patterns.

Recommendation: Escalate to Senior Partner for SMR lodgement decision."
                  />
                </div>

                {/* Evidence Attachments */}
                <div>
                  <Label>Evidence Attachments</Label>
                  <div className="mt-2 space-y-2">
                    {[
                      { name: 'Transaction_Analysis_Report.pdf', size: '2.4 MB', date: '2024-03-14' },
                      { name: 'Client_Interview_Notes.pdf', size: '156 KB', date: '2024-03-12' },
                      { name: 'Contract_of_Sale_Evidence.pdf', size: '3.1 MB', date: '2024-03-14' }
                    ].map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-[#0f172a] rounded border border-white/10">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-300" />
                          <div>
                            <div className="font-semibold text-sm text-white">{file.name}</div>
                            <div className="text-xs text-slate-300">{file.size} • Uploaded {file.date}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* APPROVAL WORKFLOW TAB */}
          <TabsContent value="approval">
            <Card className="border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle>Decision & Approval Workflow</CardTitle>
                <CardDescription>
                  Internal escalation and AUSTRAC lodgement decision
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Status Timeline */}
                <div className="bg-[#1e293b] rounded-lg p-4 border-2 border-purple-200">
                  <h3 className="font-bold text-white mb-4">Status Timeline</h3>
                  <div className="space-y-4">
                    {[
                      { status: 'Open', date: '2024-03-10', user: 'System Alert', active: true, completed: true },
                      { status: 'Under Review', date: '2024-03-12', user: 'Sarah Chen', active: true, completed: true },
                      { status: 'Approved', date: 'Pending', user: 'Michael Roberts', active: true, completed: false },
                      { status: 'Lodged', date: 'Pending', user: 'AUSTRAC', active: false, completed: false },
                      { status: 'Closed', date: 'Pending', user: '-', active: false, completed: false }
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed ? 'bg-green-600' : step.active ? 'bg-amber-600' : 'bg-gray-300'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : step.active ? (
                            <Clock className="w-6 h-6 text-white" />
                          ) : (
                            <XCircle className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-white">{step.status}</div>
                          <div className="text-sm text-slate-300">
                            {step.date} {step.user && `• ${step.user}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decision Form */}
                <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
                  <h3 className="font-bold text-amber-900 mb-4">Lodgement Decision</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Reporting Officer</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select reporting officer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="michael">Michael Roberts (Managing Partner)</SelectItem>
                          <SelectItem value="sarah">Sarah Chen (Head of Compliance)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Decision</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select decision" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lodge">Lodge SMR with AUSTRAC</SelectItem>
                          <SelectItem value="no-lodge">Do Not Lodge - Insufficient Grounds</SelectItem>
                          <SelectItem value="monitoring">Continue Monitoring</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Decision Rationale (Required)</Label>
                      <Textarea 
                        rows={4}
                        placeholder="Document the rationale for the lodge/do not lodge decision..."
                        className="mt-2"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Send className="w-4 h-4 mr-2" />
                        Approve & Lodge with AUSTRAC
                      </Button>
                      <Button variant="outline">
                        Save Decision
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Reporting Officer Log */}
                <div>
                  <h3 className="font-bold text-white mb-3">Reporting Officer Log</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white">SMR-2024-002 - Lodged</span>
                        <Badge className="bg-green-600">Completed</Badge>
                      </div>
                      <div className="text-sm text-slate-300 mb-1">
                        Decision: Lodge with AUSTRAC
                      </div>
                      <div className="text-xs text-slate-300">
                        Officer: Michael Roberts | Lodged: 2024-03-18 | Ref: SMR-2024-ABC123
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AUDIT TRAIL TAB */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Full Audit Trail</CardTitle>
                <CardDescription>
                  Complete immutable audit log for SMR-2024-001
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  {[
                    {
                      timestamp: '2024-03-14 14:23:15',
                      user: 'Sarah Chen',
                      action: 'Investigation notes updated',
                      details: 'Added documentation review findings'
                    },
                    {
                      timestamp: '2024-03-14 11:05:42',
                      user: 'Sarah Chen',
                      action: 'Evidence uploaded',
                      details: 'Contract_of_Sale_Evidence.pdf (3.1 MB)'
                    },
                    {
                      timestamp: '2024-03-12 15:30:00',
                      user: 'Sarah Chen',
                      action: 'Status changed',
                      details: 'Open → Under Review'
                    },
                    {
                      timestamp: '2024-03-12 10:15:22',
                      user: 'Sarah Chen',
                      action: 'Evidence uploaded',
                      details: 'Client_Interview_Notes.pdf (156 KB)'
                    },
                    {
                      timestamp: '2024-03-10 09:47:33',
                      user: 'System',
                      action: 'Case created',
                      details: 'Automated structuring alert triggered for CL-2024-1847'
                    }
                  ].map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-[#0f172a] rounded-lg border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-cyan-600 mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white">{entry.action}</span>
                          <span className="text-xs text-slate-300">{entry.timestamp}</span>
                        </div>
                        <p className="text-sm text-slate-300 mb-1">{entry.details}</p>
                        <div className="text-xs text-slate-300">By: {entry.user}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

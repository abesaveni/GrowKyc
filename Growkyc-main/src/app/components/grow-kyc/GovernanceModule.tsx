import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  ArrowLeft,
  Shield,
  FileText,
  Calendar,
  CheckCircle,
  Download,
  Upload,
  Clock,
  AlertTriangle,
  Users,
  BookOpen,
  ClipboardCheck,
  History,
  Eye,
  Edit,
  AlertCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';

interface GovernanceModuleProps {
  onBack: () => void;
}

export function GovernanceModule({ onBack }: GovernanceModuleProps) {
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

  // Mock data
  const amlProgram = {
    version: '3.2',
    lastApproved: '2024-01-15',
    nextReviewDue: '2025-01-15',
    approvedBy: 'Board of Directors',
    daysUntilReview: 320,
    status: 'current'
  };

  const policies = [
    {
      id: 'aml',
      name: 'AML/CTF Policy',
      version: '2.4',
      effectiveDate: '2024-01-15',
      nextReview: '2025-01-15',
      owner: 'Chief Compliance Officer',
      status: 'current',
      linkedTraining: 'AML Foundation Course',
      revisions: 8
    },
    {
      id: 'edd',
      name: 'Enhanced Due Diligence Policy',
      version: '1.9',
      effectiveDate: '2024-02-01',
      nextReview: '2025-02-01',
      owner: 'Chief Compliance Officer',
      status: 'current',
      linkedTraining: 'EDD Specialist Training',
      revisions: 5
    },
    {
      id: 'escalation',
      name: 'Escalation Policy',
      version: '1.5',
      effectiveDate: '2024-01-15',
      nextReview: '2025-01-15',
      owner: 'Chief Risk Officer',
      status: 'current',
      linkedTraining: 'Risk Management Course',
      revisions: 4
    },
    {
      id: 'offboarding',
      name: 'Client Offboarding Policy',
      version: '1.2',
      effectiveDate: '2023-11-01',
      nextReview: '2024-11-01',
      owner: 'Chief Compliance Officer',
      status: 'review_due',
      linkedTraining: 'Client Lifecycle Management',
      revisions: 2
    },
    {
      id: 'privacy',
      name: 'Privacy Policy',
      version: '3.1',
      effectiveDate: '2024-02-15',
      nextReview: '2025-02-15',
      owner: 'Chief Privacy Officer',
      status: 'current',
      linkedTraining: 'Privacy Act Training',
      revisions: 12
    }
  ];

  const boardApprovals = [
    {
      policy: 'AML/CTF Program',
      version: '3.2',
      approvedBy: 'Board of Directors',
      approvalDate: '2024-01-15',
      minutesRef: 'BM-2024-01-15',
      hasMinutes: true
    },
    {
      policy: 'Privacy Policy',
      version: '3.1',
      approvedBy: 'Board of Directors',
      approvalDate: '2024-02-15',
      minutesRef: 'BM-2024-02-15',
      hasMinutes: true
    },
    {
      policy: 'Enhanced Due Diligence Policy',
      version: '1.9',
      approvedBy: 'Risk Committee',
      approvalDate: '2024-02-01',
      minutesRef: 'RC-2024-02-01',
      hasMinutes: true
    }
  ];

  const complianceCalendar = [
    {
      id: 1,
      obligation: 'Independent AML Review',
      frequency: 'Triennial',
      lastCompleted: '2021-06-30',
      nextDue: '2024-06-30',
      daysRemaining: 121,
      status: 'upcoming',
      owner: 'External Auditor'
    },
    {
      id: 2,
      obligation: 'Risk Assessment Update',
      frequency: 'Annual',
      lastCompleted: '2023-12-15',
      nextDue: '2024-12-15',
      daysRemaining: 289,
      status: 'on_track',
      owner: 'Chief Risk Officer'
    },
    {
      id: 3,
      obligation: 'Policy Review - AML',
      frequency: 'Annual',
      lastCompleted: '2024-01-15',
      nextDue: '2025-01-15',
      daysRemaining: 320,
      status: 'on_track',
      owner: 'Chief Compliance Officer'
    },
    {
      id: 4,
      obligation: 'Staff Training Completion',
      frequency: 'Annual',
      lastCompleted: '2023-11-30',
      nextDue: '2024-11-30',
      daysRemaining: 274,
      status: 'on_track',
      owner: 'Head of Learning'
    },
    {
      id: 5,
      obligation: 'Board AML Update',
      frequency: 'Quarterly',
      lastCompleted: '2024-02-15',
      nextDue: '2024-05-15',
      daysRemaining: 75,
      status: 'on_track',
      owner: 'Chief Compliance Officer'
    }
  ];

  const changeLog = [
    {
      date: '2024-01-15',
      version: '3.2',
      changes: 'Updated customer identification procedures for digital onboarding',
      approver: 'Board of Directors',
      impact: 'Major'
    },
    {
      date: '2023-08-20',
      version: '3.1',
      changes: 'Enhanced sanctions screening requirements',
      approver: 'Risk Committee',
      impact: 'Minor'
    },
    {
      date: '2023-03-10',
      version: '3.0',
      changes: 'Complete program rewrite for AUSTRAC Tranche 2',
      approver: 'Board of Directors',
      impact: 'Major'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <Shield className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Governance</h1>
                <p className="text-sm text-gray-600">AML Program Control & Board Oversight</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="program" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="program">AML Program</TabsTrigger>
            <TabsTrigger value="policies">Policy Library</TabsTrigger>
            <TabsTrigger value="board">Board Approvals</TabsTrigger>
            <TabsTrigger value="calendar">Compliance Calendar</TabsTrigger>
          </TabsList>

          {/* AML Program Control Panel */}
          <TabsContent value="program" className="space-y-6">
            <Card className="border-2 border-blue-300 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  AML/CTF Program Control Panel
                </CardTitle>
                <CardDescription>
                  Centralised control of your AML/CTF compliance program
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-sm text-gray-600 mb-2">Program Version</div>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        v{amlProgram.version}
                      </div>
                      <Badge className="bg-green-500">Current</Badge>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="text-sm text-gray-600 mb-2">Last Approved</div>
                      <div className="text-lg font-semibold text-gray-900 mb-1">
                        {new Date(amlProgram.lastApproved).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-600">
                        by {amlProgram.approvedBy}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="text-sm text-gray-600 mb-2">Next Review Due</div>
                      <div className="text-lg font-semibold text-gray-900 mb-1">
                        {new Date(amlProgram.nextReviewDue).toLocaleDateString('en-AU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {amlProgram.daysUntilReview} days remaining
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Program PDF
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View Online
                  </Button>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Request Amendment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Change Log */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Program Change Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {changeLog.map((change, idx) => (
                    <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="w-24 flex-shrink-0">
                        <div className="text-sm font-semibold text-gray-900">
                          v{change.version}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(change.date).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 mb-1">{change.changes}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {change.approver}
                          </Badge>
                          <Badge className={
                            change.impact === 'Major' ? 'bg-red-500' : 'bg-blue-500'
                          }>
                            {change.impact}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Policy Library */}
          <TabsContent value="policies" className="space-y-6">
            <div className="grid gap-4">
              {policies.map((policy) => (
                <Card 
                  key={policy.id}
                  className={`cursor-pointer hover:shadow-lg transition-shadow ${
                    policy.status === 'review_due' ? 'border-amber-300 bg-amber-50' : ''
                  }`}
                  onClick={() => setSelectedPolicy(policy.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {policy.name}
                            </h3>
                            <Badge variant="outline">v{policy.version}</Badge>
                            {policy.status === 'current' ? (
                              <Badge className="bg-green-500">Current</Badge>
                            ) : (
                              <Badge className="bg-amber-500">Review Due</Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600">Effective Date</div>
                              <div className="font-medium">
                                {new Date(policy.effectiveDate).toLocaleDateString('en-AU')}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">Next Review</div>
                              <div className="font-medium">
                                {new Date(policy.nextReview).toLocaleDateString('en-AU')}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">Owner</div>
                              <div className="font-medium">{policy.owner}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Linked Training</div>
                              <div className="font-medium text-blue-600">{policy.linkedTraining}</div>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                            <History className="w-3 h-3" />
                            {policy.revisions} revisions
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <History className="w-4 h-4 mr-2" />
                          History
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Board Approval Log */}
          <TabsContent value="board" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5" />
                      Board Approval Log
                    </CardTitle>
                    <CardDescription>
                      Complete record of board and committee approvals
                    </CardDescription>
                  </div>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Board Minutes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 text-sm font-semibold text-gray-900">Policy</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-900">Version</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-900">Approved By</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-900">Approval Date</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-900">Minutes Ref</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-900">Attachment</th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {boardApprovals.map((approval, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-4 text-sm font-medium text-gray-900">
                            {approval.policy}
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">v{approval.version}</Badge>
                          </td>
                          <td className="p-4 text-sm text-gray-900">{approval.approvedBy}</td>
                          <td className="p-4 text-sm text-gray-900">
                            {new Date(approval.approvalDate).toLocaleDateString('en-AU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="p-4 text-sm font-mono text-gray-600">
                            {approval.minutesRef}
                          </td>
                          <td className="p-4">
                            {approval.hasMinutes ? (
                              <Badge className="bg-green-500">Attached</Badge>
                            ) : (
                              <Badge className="bg-amber-500">Missing</Badge>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Calendar */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Annual Compliance Calendar
                </CardTitle>
                <CardDescription>
                  Track all regulatory obligations and internal compliance requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceCalendar.map((item) => (
                    <Card 
                      key={item.id}
                      className={`${
                        item.daysRemaining < 90 ? 'border-amber-300 bg-amber-50' :
                        item.daysRemaining < 180 ? 'border-blue-300 bg-blue-50' :
                        'border-green-300 bg-green-50'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg text-gray-900">
                                {item.obligation}
                              </h3>
                              <Badge variant="outline">{item.frequency}</Badge>
                              {item.daysRemaining < 90 && (
                                <Badge className="bg-amber-500">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Approaching
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-gray-600">Last Completed</div>
                                <div className="font-medium">
                                  {new Date(item.lastCompleted).toLocaleDateString('en-AU')}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-600">Next Due</div>
                                <div className="font-medium">
                                  {new Date(item.nextDue).toLocaleDateString('en-AU')}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-600">Days Remaining</div>
                                <div className={`font-bold text-lg ${
                                  item.daysRemaining < 90 ? 'text-amber-600' :
                                  item.daysRemaining < 180 ? 'text-blue-600' :
                                  'text-green-600'
                                }`}>
                                  {item.daysRemaining}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-600">Owner</div>
                                <div className="font-medium">{item.owner}</div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Progress 
                                value={100 - (item.daysRemaining / 365 * 100)} 
                                className="h-2"
                              />
                            </div>
                          </div>
                          <Button variant="outline" className="ml-4">
                            <Clock className="w-4 h-4 mr-2" />
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
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

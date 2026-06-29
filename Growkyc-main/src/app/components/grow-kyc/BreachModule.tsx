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
  Upload,
  Download,
  Eye,
  TrendingUp,
  Shield,
  AlertCircle,
  Play,
  Timer
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { toast } from '../../lib/toast';

interface BreachModuleProps {
  onBack: () => void;
}

export function BreachModule({ onBack }: BreachModuleProps) {
  const [showSignificanceTest, setShowSignificanceTest] = useState(false);
  const [significanceAnswers, setSignificanceAnswers] = useState({
    clientImpact: '',
    financialImpact: '',
    systemicWeakness: '',
    intentional: '',
    recurrence: ''
  });

  const incidents = [
    {
      id: 'INC-2024-001',
      type: 'AML',
      description: 'Sanctions screening not performed for 3 corporate clients',
      dateIdentified: '2024-02-15',
      impactedClients: 3,
      financialImpact: 'Nil',
      status: 'Under Investigation',
      severity: 'high',
      reportable: true,
      reportingBody: 'AUSTRAC',
      daysToReport: 28,
      assignedTo: 'Jane Smith'
    },
    {
      id: 'INC-2024-002',
      type: 'Privacy',
      description: 'Client data emailed to incorrect recipient',
      dateIdentified: '2024-02-20',
      impactedClients: 1,
      financialImpact: 'Nil',
      status: 'Contained',
      severity: 'medium',
      reportable: true,
      reportingBody: 'OAIC',
      daysToReport: 28,
      assignedTo: 'John Doe'
    },
    {
      id: 'INC-2024-003',
      type: 'Credit',
      description: 'Serviceability assessment not documented',
      dateIdentified: '2024-02-28',
      impactedClients: 1,
      financialImpact: '$50,000',
      status: 'Remediation',
      severity: 'high',
      reportable: true,
      reportingBody: 'ASIC',
      daysToReport: 15,
      assignedTo: 'Sarah Wilson'
    }
  ];

  const regulatoryTracking = [
    {
      incident: 'INC-2024-001',
      regulator: 'AUSTRAC',
      reportingClock: 30,
      daysRemaining: 28,
      investigationClock: 90,
      investigationRemaining: 88,
      submitted: false,
      referenceNumber: null
    },
    {
      incident: 'INC-2024-002',
      regulator: 'OAIC',
      reportingClock: 30,
      daysRemaining: 28,
      investigationClock: 90,
      investigationRemaining: 88,
      submitted: false,
      referenceNumber: null
    },
    {
      incident: 'INC-2024-003',
      regulator: 'ASIC',
      reportingClock: 30,
      daysRemaining: 15,
      investigationClock: 90,
      investigationRemaining: 75,
      submitted: false,
      referenceNumber: null
    }
  ];

  const timeline = [
    {
      date: '2024-02-15 09:30',
      user: 'System',
      action: 'Incident identified',
      description: 'Automated monitoring detected missing sanctions screening',
      type: 'system'
    },
    {
      date: '2024-02-15 10:15',
      user: 'Jane Smith',
      action: 'Incident logged',
      description: 'Formal incident record created',
      type: 'manual'
    },
    {
      date: '2024-02-15 11:00',
      user: 'Jane Smith',
      action: 'Immediate containment',
      description: 'All 3 clients placed under review hold. Sanctions screening executed retrospectively.',
      type: 'action'
    },
    {
      date: '2024-02-15 14:30',
      user: 'John Manager',
      action: 'Significance test completed',
      description: 'Incident assessed as reportable to AUSTRAC',
      type: 'assessment'
    },
    {
      date: '2024-02-16 09:00',
      user: 'Jane Smith',
      action: 'Root cause analysis commenced',
      description: 'Investigating workflow gap in corporate onboarding process',
      type: 'investigation'
    }
  ];

  const renderSignificanceTest = () => (
    <Card className="border-2 border-blue-300">
      <CardHeader>
        <CardTitle>Significance Test Engine</CardTitle>
        <CardDescription>
          Interactive assessment to determine if incident is reportable
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>1. Client Impact</Label>
            <p className="text-sm text-gray-600 mb-2">
              How many clients were adversely affected?
            </p>
            <Select 
              value={significanceAnswers.clientImpact}
              onValueChange={(value) => setSignificanceAnswers({...significanceAnswers, clientImpact: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select impact level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (0 clients)</SelectItem>
                <SelectItem value="low">Low (1-5 clients)</SelectItem>
                <SelectItem value="medium">Medium (6-20 clients)</SelectItem>
                <SelectItem value="high">High (21-100 clients)</SelectItem>
                <SelectItem value="critical">Critical (100+ clients)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>2. Financial Impact</Label>
            <p className="text-sm text-gray-600 mb-2">
              Estimated or actual financial loss to clients or firm
            </p>
            <Select
              value={significanceAnswers.financialImpact}
              onValueChange={(value) => setSignificanceAnswers({...significanceAnswers, financialImpact: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select financial impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nil">Nil</SelectItem>
                <SelectItem value="low">$1 - $10,000</SelectItem>
                <SelectItem value="medium">$10,001 - $100,000</SelectItem>
                <SelectItem value="high">$100,001 - $1,000,000</SelectItem>
                <SelectItem value="critical">Over $1,000,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>3. Systemic Weakness</Label>
            <p className="text-sm text-gray-600 mb-2">
              Does this indicate a gap in controls or processes?
            </p>
            <Select
              value={significanceAnswers.systemicWeakness}
              onValueChange={(value) => setSignificanceAnswers({...significanceAnswers, systemicWeakness: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="isolated">Isolated incident (human error)</SelectItem>
                <SelectItem value="minor">Minor control gap</SelectItem>
                <SelectItem value="material">Material control failure</SelectItem>
                <SelectItem value="systemic">Systemic program weakness</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>4. Intentional Misconduct</Label>
            <p className="text-sm text-gray-600 mb-2">
              Was the breach intentional or fraudulent?
            </p>
            <Select
              value={significanceAnswers.intentional}
              onValueChange={(value) => setSignificanceAnswers({...significanceAnswers, intentional: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No - unintentional error</SelectItem>
                <SelectItem value="negligent">Negligent behavior</SelectItem>
                <SelectItem value="reckless">Reckless disregard</SelectItem>
                <SelectItem value="intentional">Intentional misconduct or fraud</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>5. Likelihood of Recurrence</Label>
            <p className="text-sm text-gray-600 mb-2">
              Without remediation, could this happen again?
            </p>
            <Select
              value={significanceAnswers.recurrence}
              onValueChange={(value) => setSignificanceAnswers({...significanceAnswers, recurrence: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select likelihood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unlikely">Unlikely (one-off event)</SelectItem>
                <SelectItem value="possible">Possible</SelectItem>
                <SelectItem value="likely">Likely</SelectItem>
                <SelectItem value="certain">Almost certain</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="bg-blue-50 border-blue-300">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-blue-900 mb-2">
                  Assessment Result: REPORTABLE
                </h3>
                <p className="text-sm text-blue-800 mb-3">
                  Based on your responses, this incident meets the threshold for regulatory reporting.
                </p>
                <div className="space-y-1 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Multiple clients impacted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Indicates material control gap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Regulatory obligation triggered</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-blue-300">
                  <div className="font-semibold text-blue-900 mb-1">Recommended Actions:</div>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Report to AUSTRAC within 30 days</li>
                    <li>Complete root cause analysis within 90 days</li>
                    <li>Implement remediation plan</li>
                    <li>Document all actions in incident timeline</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowSignificanceTest(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            toast.success('Significance test completed and saved to incident record');
            setShowSignificanceTest(false);
          }}>
            Save Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Breach & Incident Management</h1>
                <p className="text-sm text-gray-600">ASIC RG78, Privacy Act & ISO Incident Response</p>
              </div>
            </div>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Log New Incident
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="incidents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="incidents">Incident Register</TabsTrigger>
            <TabsTrigger value="significance">Significance Test</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory Tracking</TabsTrigger>
            <TabsTrigger value="timeline">Incident Timeline</TabsTrigger>
          </TabsList>

          {/* Incident Register */}
          <TabsContent value="incidents" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-600">Open Incidents</div>
                  <div className="text-3xl font-bold text-gray-900">3</div>
                  <div className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    2 reportable
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-600">Under Investigation</div>
                  <div className="text-3xl font-bold text-blue-600">2</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-600">Closed (30d)</div>
                  <div className="text-3xl font-bold text-green-600">5</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-600">Avg Resolution Time</div>
                  <div className="text-3xl font-bold text-gray-900">18d</div>
                </CardContent>
              </Card>
            </div>

            {/* Incident Cards */}
            <div className="space-y-4">
              {incidents.map((incident) => (
                <Card 
                  key={incident.id}
                  className={`border-2 ${
                    incident.severity === 'high' ? 'border-red-300 bg-red-50' :
                    incident.severity === 'medium' ? 'border-amber-300 bg-amber-50' :
                    'border-blue-300 bg-blue-50'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <AlertTriangle className={`w-8 h-8 flex-shrink-0 ${
                          incident.severity === 'high' ? 'text-red-600' :
                          incident.severity === 'medium' ? 'text-amber-600' :
                          'text-blue-600'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-sm font-semibold text-gray-600">
                              {incident.id}
                            </span>
                            <Badge variant="outline">{incident.type}</Badge>
                            <Badge className={
                              incident.severity === 'high' ? 'bg-red-600' :
                              incident.severity === 'medium' ? 'bg-amber-600' :
                              'bg-blue-600'
                            }>
                              {incident.severity.toUpperCase()}
                            </Badge>
                            {incident.reportable && (
                              <Badge className="bg-purple-600">
                                <Shield className="w-3 h-3 mr-1" />
                                Reportable
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-3">
                            {incident.description}
                          </h3>
                          <div className="grid grid-cols-5 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600">Date Identified</div>
                              <div className="font-medium">
                                {new Date(incident.dateIdentified).toLocaleDateString('en-AU')}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">Impacted Clients</div>
                              <div className="font-medium">{incident.impactedClients}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Financial Impact</div>
                              <div className="font-medium">{incident.financialImpact}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Status</div>
                              <Badge variant="outline">{incident.status}</Badge>
                            </div>
                            <div>
                              <div className="text-gray-600">Assigned To</div>
                              <div className="font-medium">{incident.assignedTo}</div>
                            </div>
                          </div>
                          {incident.reportable && (
                            <div className="mt-4 p-3 bg-white rounded border flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-red-600" />
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    Report to {incident.reportingBody}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {incident.daysToReport} days remaining
                                  </div>
                                </div>
                              </div>
                              <Progress value={(30 - incident.daysToReport) / 30 * 100} className="w-32 h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Significance Test */}
          <TabsContent value="significance">
            {!showSignificanceTest ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Significance Test Engine</h3>
                  <p className="text-gray-600 mb-6">
                    Answer 5 questions to determine if an incident is reportable to regulators
                  </p>
                  <Button onClick={() => setShowSignificanceTest(true)}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Significance Test
                  </Button>
                </CardContent>
              </Card>
            ) : (
              renderSignificanceTest()
            )}
          </TabsContent>

          {/* Regulatory Tracking */}
          <TabsContent value="regulatory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Reporting Tracker</CardTitle>
                <CardDescription>
                  Track 30-day and 90-day regulatory obligations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regulatoryTracking.map((item, idx) => (
                    <Card key={idx} className="border-2">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                              <span className="font-mono font-semibold">{item.incident}</span>
                              <Badge className="bg-purple-600">{item.regulator}</Badge>
                              {!item.submitted && (
                                <Badge className="bg-amber-600">Pending Submission</Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700">
                                    30-Day Reporting Clock
                                  </span>
                                  <span className={`text-sm font-bold ${
                                    item.daysRemaining < 7 ? 'text-red-600' :
                                    item.daysRemaining < 14 ? 'text-amber-600' :
                                    'text-green-600'
                                  }`}>
                                    {item.daysRemaining} days left
                                  </span>
                                </div>
                                <Progress 
                                  value={(item.reportingClock - item.daysRemaining) / item.reportingClock * 100} 
                                  className="h-2"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700">
                                    90-Day Investigation Clock
                                  </span>
                                  <span className="text-sm font-bold text-green-600">
                                    {item.investigationRemaining} days left
                                  </span>
                                </div>
                                <Progress 
                                  value={(item.investigationClock - item.investigationRemaining) / item.investigationClock * 100} 
                                  className="h-2"
                                />
                              </div>
                            </div>

                            {item.submitted && item.referenceNumber && (
                              <div className="mt-4 p-3 bg-green-50 rounded border border-green-300">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="text-sm text-green-900">
                                    Submitted • Reference: {item.referenceNumber}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {!item.submitted && (
                            <Button className="ml-4">
                              <Upload className="w-4 h-4 mr-2" />
                              Submit Report
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Incident Timeline: INC-2024-001</CardTitle>
                    <CardDescription>
                      Chronological log of all actions and evidence
                    </CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Timeline
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {timeline.map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-32 flex-shrink-0 text-sm text-gray-600">
                        {entry.date}
                      </div>
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${
                        entry.type === 'system' ? 'bg-gray-400' :
                        entry.type === 'manual' ? 'bg-blue-500' :
                        entry.type === 'action' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`} />
                      <div className="flex-1 pb-6 border-b last:border-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{entry.action}</span>
                          <Badge variant="outline" className="text-xs">
                            {entry.user}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{entry.description}</p>
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

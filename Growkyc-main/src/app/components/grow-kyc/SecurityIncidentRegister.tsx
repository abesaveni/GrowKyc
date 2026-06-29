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
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Eye,
  FileText,
  Clock,
  User,
  Server,
  Database,
  AlertCircle,
  Bell,
  Flag,
  TrendingUp
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface SecurityIncidentRegisterProps {
  onBack: () => void;
}

export function SecurityIncidentRegister({ onBack }: SecurityIncidentRegisterProps) {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  // Security Incidents
  const incidents = [
    {
      incidentId: 'SEC-2024-001',
      type: 'Unauthorized Access Attempt',
      dateDetected: '2024-03-20 03:42:15',
      severity: 'High',
      status: 'Contained',
      affectedSystem: 'Client Portal',
      affectedData: 'Login credentials attempted',
      dataClassification: 'Confidential',
      recordsAffected: 0,
      containmentAction: 'IP blocked, MFA enforced, account locked',
      investigationOwner: 'David Thompson',
      regulatorNotification: false,
      customerNotification: false,
      closureDate: null
    },
    {
      incidentId: 'SEC-2024-002',
      type: 'Data Breach',
      dateDetected: '2024-03-15 14:20:00',
      severity: 'Critical',
      status: 'Investigating',
      affectedSystem: 'Email Server',
      affectedData: 'Client contact details and loan summaries',
      dataClassification: 'Highly Confidential',
      recordsAffected: 47,
      containmentAction: 'Email account disabled, passwords reset, forensic analysis underway',
      investigationOwner: 'Sarah Chen',
      regulatorNotification: true,
      customerNotification: true,
      closureDate: null
    },
    {
      incidentId: 'SEC-2024-003',
      type: 'Phishing Attack',
      dateDetected: '2024-03-10 09:15:00',
      severity: 'Medium',
      status: 'Closed',
      affectedSystem: 'Email (Staff)',
      affectedData: 'No data compromised',
      dataClassification: 'N/A',
      recordsAffected: 0,
      containmentAction: 'Email quarantined, staff training refresher, email filters updated',
      investigationOwner: 'Emma Williams',
      regulatorNotification: false,
      customerNotification: false,
      closureDate: '2024-03-12'
    },
    {
      incidentId: 'SEC-2024-004',
      type: 'System Misconfiguration',
      dateDetected: '2024-03-05 16:30:00',
      severity: 'Low',
      status: 'Closed',
      affectedSystem: 'Document Storage',
      affectedData: 'Temporary exposure of non-sensitive documents',
      dataClassification: 'Internal',
      recordsAffected: 12,
      containmentAction: 'Access permissions corrected, configuration review completed',
      investigationOwner: 'Michael Roberts',
      regulatorNotification: false,
      customerNotification: false,
      closureDate: '2024-03-06'
    },
    {
      incidentId: 'SEC-2024-005',
      type: 'Malware Detection',
      dateDetected: '2024-02-28 11:45:00',
      severity: 'Medium',
      status: 'Contained',
      affectedSystem: 'Workstation',
      affectedData: 'Potential data exfiltration - under investigation',
      dataClassification: 'Under Investigation',
      recordsAffected: 0,
      containmentAction: 'Workstation isolated, full scan completed, malware removed',
      investigationOwner: 'David Thompson',
      regulatorNotification: false,
      customerNotification: false,
      closureDate: null
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-600';
      case 'High': return 'bg-orange-600';
      case 'Medium': return 'bg-amber-600';
      case 'Low': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-600';
      case 'Investigating': return 'bg-amber-600';
      case 'Contained': return 'bg-blue-600';
      case 'Closed': return 'bg-gray-600';
      default: return 'bg-gray-400';
    }
  };

  const stats = {
    total: incidents.length,
    open: incidents.filter(i => i.status === 'Open').length,
    investigating: incidents.filter(i => i.status === 'Investigating').length,
    contained: incidents.filter(i => i.status === 'Contained').length,
    closed: incidents.filter(i => i.status === 'Closed').length,
    critical: incidents.filter(i => i.severity === 'Critical').length,
    regulatorNotifications: incidents.filter(i => i.regulatorNotification).length
  };

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
              <h1 className="text-2xl font-bold">Security Incident Register</h1>
              <p className="text-sm text-white/90">ISO 27001 Incident Management & Response</p>
            </div>
          </div>
          <Button className="bg-[#1e293b] text-[#13B5EA] hover:bg-white/5">
            <Flag className="w-4 h-4 mr-2" />
            Report Incident
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[#1e293b] border-b border-white/10 px-6 py-4">
        <div className="grid grid-cols-7 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-slate-300 mt-1">Total Incidents</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{stats.open}</div>
            <div className="text-xs text-slate-300 mt-1">Open</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">{stats.investigating}</div>
            <div className="text-xs text-slate-300 mt-1">Investigating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.contained}</div>
            <div className="text-xs text-slate-300 mt-1">Contained</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-300">{stats.closed}</div>
            <div className="text-xs text-slate-300 mt-1">Closed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
            <div className="text-xs text-slate-300 mt-1">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.regulatorNotifications}</div>
            <div className="text-xs text-slate-300 mt-1">Regulator Notifications</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="register">
          <TabsList className="grid grid-cols-5 w-full mb-6">
            <TabsTrigger value="register">
              <FileText className="w-4 h-4 mr-2" />
              Incident Register
            </TabsTrigger>
            <TabsTrigger value="investigation">
              <Eye className="w-4 h-4 mr-2" />
              Investigation
            </TabsTrigger>
            <TabsTrigger value="notification">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="lessons">
              <TrendingUp className="w-4 h-4 mr-2" />
              Lessons Learned
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <Shield className="w-4 h-4 mr-2" />
              Metrics
            </TabsTrigger>
          </TabsList>

          {/* INCIDENT REGISTER TAB */}
          <TabsContent value="register">
            <div className="space-y-3">
              {incidents.map((incident) => (
                <Card 
                  key={incident.incidentId}
                  className={`border-2 ${
                    incident.severity === 'Critical' ? 'border-red-300 bg-red-50' :
                    incident.severity === 'High' ? 'border-orange-300 bg-orange-50' :
                    'border-white/10'
                  } hover:border-cyan-300 transition-colors`}
                >
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-12 gap-4 items-center">
                      {/* Incident ID & Type */}
                      <div className="md:col-span-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <div>
                            <div className="font-bold text-white">{incident.incidentId}</div>
                            <div className="text-sm text-slate-300">{incident.type}</div>
                            <div className="text-xs text-slate-300">{incident.dateDetected}</div>
                          </div>
                        </div>
                      </div>

                      {/* Severity & Status */}
                      <div className="md:col-span-2">
                        <div className="space-y-2">
                          <Badge className={getSeverityColor(incident.severity)}>
                            {incident.severity} Severity
                          </Badge>
                          <Badge className={getStatusColor(incident.status)}>
                            {incident.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Affected System & Data */}
                      <div className="md:col-span-3">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Server className="w-4 h-4 text-slate-300" />
                            <div>
                              <div className="text-xs text-slate-300">Affected System</div>
                              <div className="font-semibold text-white">{incident.affectedSystem}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-slate-300" />
                            <div>
                              <div className="text-xs text-slate-300">Data Classification</div>
                              <div className="font-semibold text-white">{incident.dataClassification}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Investigation Owner & Records */}
                      <div className="md:col-span-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-300" />
                            <span className="text-slate-300">{incident.investigationOwner}</span>
                          </div>
                          {incident.recordsAffected > 0 && (
                            <Badge className="bg-red-600">
                              {incident.recordsAffected} records affected
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Notifications */}
                      <div className="md:col-span-1">
                        <div className="space-y-1">
                          {incident.regulatorNotification && (
                            <Badge className="bg-purple-600 text-xs w-full justify-center">
                              <Bell className="w-3 h-3 mr-1" />
                              OAIC
                            </Badge>
                          )}
                          {incident.customerNotification && (
                            <Badge className="bg-orange-600 text-xs w-full justify-center">
                              <Bell className="w-3 h-3 mr-1" />
                              Client
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      <div className="md:col-span-1">
                        <Button 
                          size="sm" 
                          className="w-full bg-cyan-600 hover:bg-cyan-700"
                          onClick={() => setSelectedIncident(incident.incidentId)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>

                    {/* Containment Action */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="text-xs text-slate-300 mb-1">Containment Action:</div>
                      <div className="text-sm text-white">{incident.containmentAction}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* INVESTIGATION TAB */}
          <TabsContent value="investigation">
            <Card className="border-2 border-red-200">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                <CardTitle>Incident Investigation: SEC-2024-002</CardTitle>
                <CardDescription>
                  Data Breach - Critical Severity - Under Investigation
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Incident Summary */}
                <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300">
                  <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Incident Summary
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-300">Incident ID: </span>
                      <span className="font-semibold">SEC-2024-002</span>
                    </div>
                    <div>
                      <span className="text-slate-300">Type: </span>
                      <span className="font-semibold">Data Breach</span>
                    </div>
                    <div>
                      <span className="text-slate-300">Detected: </span>
                      <span className="font-semibold">2024-03-15 14:20:00</span>
                    </div>
                    <div>
                      <span className="text-slate-300">Severity: </span>
                      <Badge className="bg-red-600">Critical</Badge>
                    </div>
                    <div>
                      <span className="text-slate-300">Records Affected: </span>
                      <Badge className="bg-red-600">47 clients</Badge>
                    </div>
                    <div>
                      <span className="text-slate-300">Investigation Owner: </span>
                      <span className="font-semibold">Sarah Chen</span>
                    </div>
                  </div>
                </div>

                {/* Affected System */}
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-600" />
                    Affected System & Data
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>System</Label>
                      <Input value="Email Server" disabled className="mt-2" />
                    </div>
                    <div>
                      <Label>Data Classification</Label>
                      <Badge className="bg-red-600 mt-2">Highly Confidential</Badge>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Affected Data</Label>
                      <Input value="Client contact details and loan summaries" disabled className="mt-2" />
                    </div>
                  </div>
                </div>

                {/* Containment Action */}
                <div>
                  <Label>Containment Action Taken</Label>
                  <Textarea 
                    rows={4}
                    className="mt-2"
                    defaultValue="Email account disabled, passwords reset, forensic analysis underway"
                  />
                </div>

                {/* Investigation Timeline */}
                <div>
                  <Label>Investigation Timeline & Notes</Label>
                  <Textarea 
                    rows={8}
                    className="mt-2"
                    defaultValue="2024-03-15 14:20: Unauthorized access detected to staff email account (j.smith@grow.com)

2024-03-15 14:45: Account immediately disabled, password reset initiated

2024-03-15 15:30: Initial forensic analysis shows account accessed from IP in Eastern Europe. 47 client email threads accessed containing contact details and loan summaries.

2024-03-15 16:00: Escalated to Senior Management and external cybersecurity consultant engaged

2024-03-16 09:00: OAIC notification prepared (NDB scheme - breach meets threshold)

2024-03-16 14:00: Customer notification plan approved - individual emails to 47 affected clients

2024-03-17: Forensic analysis ongoing. Determining if data was exfiltrated or just accessed.

2024-03-18: Enhanced MFA implemented across all staff email accounts. Security awareness training scheduled."
                  />
                </div>

                {/* Lessons Learned */}
                <div>
                  <Label>Root Cause & Lessons Learned</Label>
                  <Textarea 
                    rows={4}
                    className="mt-2"
                    placeholder="Document root cause analysis and preventative measures..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NOTIFICATION TAB */}
          <TabsContent value="notification">
            <div className="grid gap-6">
              {/* Regulator Notification */}
              <Card className="border-2 border-purple-200">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-purple-600" />
                    Regulator Notification Requirements
                  </CardTitle>
                  <CardDescription>
                    OAIC Notifiable Data Breaches (NDB) Scheme
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                      <h3 className="font-bold text-purple-900 mb-2">NDB Scheme Threshold Assessment</h3>
                      <p className="text-sm text-purple-800 mb-3">
                        A data breach is notifiable when it is likely to result in serious harm to affected individuals
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>Breach involves highly sensitive personal information ✓</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>47 individuals affected ✓</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>Potential for identity theft or financial harm ✓</span>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-red-50 rounded border-2 border-red-300">
                        <p className="text-sm font-bold text-red-900">
                          ⚠️ OAIC Notification REQUIRED within 30 days
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label>OAIC Notification Status</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select notification status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="required">Notification Required</SelectItem>
                          <SelectItem value="prepared">Notification Prepared</SelectItem>
                          <SelectItem value="submitted">Submitted to OAIC</SelectItem>
                          <SelectItem value="not-required">Not Required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>OAIC Reference Number</Label>
                      <Input className="mt-2" placeholder="Enter OAIC reference once submitted" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Notification */}
              <Card className="border-2 border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-orange-600" />
                    Customer Notification
                  </CardTitle>
                  <CardDescription>
                    Privacy Act requirement to notify affected individuals
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300">
                      <h3 className="font-bold text-orange-900 mb-2">Notification Requirements</h3>
                      <ul className="text-sm text-orange-800 space-y-1">
                        <li>✓ Identity of the organization</li>
                        <li>✓ Description of the data breach</li>
                        <li>✓ The kind of information concerned</li>
                        <li>✓ Recommendations about steps individuals should take</li>
                        <li>✓ Contact details for more information</li>
                      </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Notification Method</Label>
                        <Select>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Individual Email</SelectItem>
                            <SelectItem value="letter">Postal Letter</SelectItem>
                            <SelectItem value="both">Email + Letter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Customers to Notify</Label>
                        <Input value="47 affected clients" disabled className="mt-2" />
                      </div>
                    </div>

                    <div>
                      <Label>Notification Sent Date</Label>
                      <Input type="date" className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* LESSONS LEARNED TAB */}
          <TabsContent value="lessons">
            <Card>
              <CardHeader>
                <CardTitle>Lessons Learned & Preventative Measures</CardTitle>
                <CardDescription>
                  Post-incident review and continuous improvement
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {incidents.filter(i => i.status === 'Closed').map((incident) => (
                    <div key={incident.incidentId} className="p-4 bg-[#0f172a] rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-bold text-white">{incident.incidentId} - {incident.type}</div>
                          <div className="text-sm text-slate-300">Closed: {incident.closureDate}</div>
                        </div>
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="p-3 bg-[#1e293b] rounded border border-white/10">
                          <div className="text-xs text-slate-300 mb-1">Root Cause:</div>
                          <div className="text-white">
                            {incident.type === 'Phishing Attack' && 'Staff member clicked malicious link in spoofed email'}
                            {incident.type === 'System Misconfiguration' && 'Incorrect permission settings during system update'}
                          </div>
                        </div>

                        <div className="p-3 bg-green-50 rounded border border-green-200">
                          <div className="text-xs text-slate-300 mb-1">Preventative Measures Implemented:</div>
                          <ul className="text-white space-y-1">
                            {incident.type === 'Phishing Attack' && (
                              <>
                                <li>• Enhanced email filtering and anti-phishing tools</li>
                                <li>• Mandatory security awareness training (quarterly)</li>
                                <li>• Phishing simulation exercises</li>
                              </>
                            )}
                            {incident.type === 'System Misconfiguration' && (
                              <>
                                <li>• Updated change management procedures</li>
                                <li>• Automated permission auditing</li>
                                <li>• Peer review requirement for system changes</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* METRICS TAB */}
          <TabsContent value="metrics">
            <Card className="border-2 border-indigo-200">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle>Security Metrics & Trends</CardTitle>
                <CardDescription>
                  Incident analytics for ISO 27001 compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* By Type */}
                  <div className="p-4 bg-[#1e293b] rounded-lg border-2 border-indigo-200">
                    <h3 className="font-bold text-white mb-4">Incidents by Type</h3>
                    <div className="space-y-2">
                      {[
                        { type: 'Data Breach', count: 1, color: 'bg-red-600' },
                        { type: 'Unauthorized Access', count: 1, color: 'bg-orange-600' },
                        { type: 'Phishing Attack', count: 1, color: 'bg-amber-600' },
                        { type: 'Malware Detection', count: 1, color: 'bg-purple-600' },
                        { type: 'System Misconfiguration', count: 1, color: 'bg-blue-600' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-[#0f172a] rounded">
                          <span className="text-sm text-slate-300">{item.type}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className={`${item.color} h-2 rounded-full`} style={{ width: `${(item.count / stats.total) * 100}%` }} />
                            </div>
                            <span className="text-sm font-bold text-white w-4">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* By Severity */}
                  <div className="p-4 bg-[#1e293b] rounded-lg border-2 border-indigo-200">
                    <h3 className="font-bold text-white mb-4">Incidents by Severity</h3>
                    <div className="space-y-3">
                      {[
                        { severity: 'Critical', count: stats.critical, color: 'bg-red-600' },
                        { severity: 'High', count: incidents.filter(i => i.severity === 'High').length, color: 'bg-orange-600' },
                        { severity: 'Medium', count: incidents.filter(i => i.severity === 'Medium').length, color: 'bg-amber-600' },
                        { severity: 'Low', count: incidents.filter(i => i.severity === 'Low').length, color: 'bg-blue-600' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <Badge className={item.color}>{item.severity}</Badge>
                          <span className="text-2xl font-bold text-white">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mean Time to Contain */}
                  <div className="p-4 bg-[#1e293b] rounded-lg border-2 border-green-200">
                    <h3 className="font-bold text-white mb-2">Mean Time to Contain</h3>
                    <div className="text-4xl font-bold text-green-600">4.2 hrs</div>
                    <p className="text-sm text-slate-300 mt-1">Average containment time</p>
                  </div>

                  {/* Mean Time to Resolve */}
                  <div className="p-4 bg-[#1e293b] rounded-lg border-2 border-blue-200">
                    <h3 className="font-bold text-white mb-2">Mean Time to Resolve</h3>
                    <div className="text-4xl font-bold text-blue-600">2.3 days</div>
                    <p className="text-sm text-slate-300 mt-1">Average resolution time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

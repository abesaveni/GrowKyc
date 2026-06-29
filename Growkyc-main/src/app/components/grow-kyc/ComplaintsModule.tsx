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
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  FileText,
  Send,
  Mail,
  Phone,
  Globe,
  DollarSign,
  Calendar,
  Flag,
  Eye,
  Download,
  TrendingUp
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';

interface ComplaintsModuleProps {
  onBack: () => void;
}

export function ComplaintsModule({ onBack }: ComplaintsModuleProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);

  // Complaints Register
  const complaints = [
    {
      complaintId: 'COMP-2024-001',
      dateReceived: '2024-03-20 14:30',
      category: 'Service Quality',
      complainantName: 'David Williams',
      relatedClient: 'CL-2024-1847',
      relatedLoan: 'LOAN-2024-335',
      channel: 'Email',
      priority: 'Normal',
      urgentFlag: false,
      hardshipFlag: false,
      status: 'Acknowledged',
      assignedTo: 'Emma Williams',
      acknowledgmentDate: '2024-03-20 16:45',
      dueDate: '2024-04-19',
      daysRemaining: 30,
      slaStatus: 'On Track',
      outcome: null,
      afcaReferral: false
    },
    {
      complaintId: 'COMP-2024-002',
      dateReceived: '2024-03-18 09:15',
      category: 'Responsible Lending',
      complainantName: 'Sarah Mitchell',
      relatedClient: 'CL-2024-1203',
      relatedLoan: 'LOAN-2024-298',
      channel: 'Phone',
      priority: 'High',
      urgentFlag: true,
      hardshipFlag: true,
      status: 'Investigating',
      assignedTo: 'Michael Roberts',
      acknowledgmentDate: '2024-03-18 11:30',
      dueDate: '2024-04-17',
      daysRemaining: 28,
      slaStatus: 'On Track',
      outcome: null,
      afcaReferral: false
    },
    {
      complaintId: 'COMP-2024-003',
      dateReceived: '2024-03-15 16:45',
      category: 'Fee Dispute',
      complainantName: 'John Anderson',
      relatedClient: 'CL-2023-2156',
      relatedLoan: null,
      channel: 'Portal',
      priority: 'Normal',
      urgentFlag: false,
      hardshipFlag: false,
      status: 'Resolved',
      assignedTo: 'Sarah Chen',
      acknowledgmentDate: '2024-03-16 09:00',
      dueDate: '2024-04-14',
      daysRemaining: 27,
      slaStatus: 'Completed',
      outcome: 'Upheld - Refund Issued',
      resolutionDate: '2024-03-22',
      afcaReferral: false
    },
    {
      complaintId: 'COMP-2024-004',
      dateReceived: '2024-03-10 11:20',
      category: 'Disclosure',
      complainantName: 'Emma Thompson',
      relatedClient: 'CL-2024-0892',
      relatedLoan: 'LOAN-2024-245',
      channel: 'Email',
      priority: 'Normal',
      urgentFlag: false,
      hardshipFlag: false,
      status: 'Waiting on Client',
      assignedTo: 'David Thompson',
      acknowledgmentDate: '2024-03-10 14:30',
      dueDate: '2024-04-09',
      daysRemaining: 22,
      slaStatus: 'On Track',
      outcome: null,
      afcaReferral: false
    },
    {
      complaintId: 'COMP-2024-005',
      dateReceived: '2024-03-05 08:30',
      category: 'Communication',
      complainantName: 'Robert Chen',
      relatedClient: 'CL-2023-1876',
      relatedLoan: null,
      channel: 'Phone',
      priority: 'Normal',
      urgentFlag: false,
      hardshipFlag: false,
      status: 'Escalated',
      assignedTo: 'Michael Roberts',
      acknowledgmentDate: '2024-03-05 10:15',
      dueDate: '2024-04-04',
      daysRemaining: 17,
      slaStatus: 'At Risk',
      outcome: null,
      afcaReferral: false
    },
    {
      complaintId: 'COMP-2024-006',
      dateReceived: '2024-02-28 15:00',
      category: 'Hardship',
      complainantName: 'Lisa Parker',
      relatedClient: 'CL-2024-0445',
      relatedLoan: 'LOAN-2024-189',
      channel: 'Manual Entry',
      priority: 'High',
      urgentFlag: true,
      hardshipFlag: true,
      status: 'Resolved',
      assignedTo: 'Emma Williams',
      acknowledgmentDate: '2024-02-28 16:30',
      dueDate: '2024-03-29',
      daysRemaining: 12,
      slaStatus: 'Completed',
      outcome: 'Upheld - Hardship Arrangement Approved',
      resolutionDate: '2024-03-18',
      afcaReferral: false
    },
    {
      complaintId: 'COMP-2024-007',
      dateReceived: '2024-03-22 10:00',
      category: 'Service Quality',
      complainantName: 'Michael Brown',
      relatedClient: 'CL-2024-1555',
      relatedLoan: null,
      channel: 'Email',
      priority: 'Normal',
      urgentFlag: false,
      hardshipFlag: false,
      status: 'New',
      assignedTo: null,
      acknowledgmentDate: null,
      dueDate: '2024-04-21',
      daysRemaining: 32,
      slaStatus: 'Pending Acknowledgment',
      outcome: null,
      afcaReferral: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-600';
      case 'Acknowledged': return 'bg-cyan-600';
      case 'Investigating': return 'bg-amber-600';
      case 'Waiting on Client': return 'bg-purple-600';
      case 'Escalated': return 'bg-orange-600';
      case 'Resolved': return 'bg-green-600';
      case 'Closed': return 'bg-gray-600';
      default: return 'bg-gray-400';
    }
  };

  const getSLAColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'text-green-400';
      case 'At Risk': return 'text-amber-400';
      case 'Overdue': return 'text-red-400';
      case 'Completed': return 'text-slate-300';
      case 'Pending Acknowledgment': return 'text-blue-400';
      default: return 'text-slate-300';
    }
  };

  const stats = {
    total: complaints.length,
    new: complaints.filter(c => c.status === 'New').length,
    acknowledged: complaints.filter(c => c.status === 'Acknowledged').length,
    investigating: complaints.filter(c => c.status === 'Investigating').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    overdue: complaints.filter(c => c.daysRemaining < 0).length,
    urgent: complaints.filter(c => c.urgentFlag).length,
    hardship: complaints.filter(c => c.hardshipFlag).length
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
            <MessageSquare className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold">Complaints Management</h1>
              <p className="text-sm text-white/90">ASIC RG271 Complaints Handling</p>
            </div>
          </div>
          <Button className="bg-[#1e293b] text-[#13B5EA] hover:bg-white/5">
            <Flag className="w-4 h-4 mr-2" />
            Lodge Complaint
          </Button>
        </div>
      </div>

      {/* SLA Dashboard */}
      <div className="bg-[#1e293b] border-b border-white/10 px-6 py-4">
        <div className="grid grid-cols-8 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-slate-300 mt-1">Total</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.new}</div>
            <div className="text-xs text-slate-300 mt-1">New</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">{stats.acknowledged}</div>
            <div className="text-xs text-slate-300 mt-1">Acknowledged</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">{stats.investigating}</div>
            <div className="text-xs text-slate-300 mt-1">Investigating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{stats.resolved}</div>
            <div className="text-xs text-slate-300 mt-1">Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">{stats.overdue}</div>
            <div className="text-xs text-slate-300 mt-1">Overdue</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">{stats.urgent}</div>
            <div className="text-xs text-slate-300 mt-1">Urgent</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">{stats.hardship}</div>
            <div className="text-xs text-slate-300 mt-1">Hardship</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="inbox">
          <TabsList className="grid grid-cols-5 w-full mb-6">
            <TabsTrigger value="inbox">
              <MessageSquare className="w-4 h-4 mr-2" />
              Complaints Inbox
            </TabsTrigger>
            <TabsTrigger value="detail">
              <Eye className="w-4 h-4 mr-2" />
              Detail View
            </TabsTrigger>
            <TabsTrigger value="sla">
              <Clock className="w-4 h-4 mr-2" />
              SLA Tracking
            </TabsTrigger>
            <TabsTrigger value="outcomes">
              <CheckCircle className="w-4 h-4 mr-2" />
              Outcomes
            </TabsTrigger>
            <TabsTrigger value="reporting">
              <TrendingUp className="w-4 h-4 mr-2" />
              Reporting
            </TabsTrigger>
          </TabsList>

          {/* INBOX TAB */}
          <TabsContent value="inbox">
            <div className="space-y-3">
              {complaints.map((complaint) => (
                <Card 
                  key={complaint.complaintId} 
                  className={`border-2 ${
                    complaint.urgentFlag ? 'border-red-300 bg-red-500/10' :
                    complaint.hardshipFlag ? 'border-purple-300 bg-purple-500/10' :
                    'border-white/10'
                  } hover:border-cyan-300 transition-colors`}
                >
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-12 gap-4 items-center">
                      {/* Complaint ID & Flags */}
                      <div className="md:col-span-3">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-5 h-5 text-cyan-400" />
                          <div>
                            <div className="font-bold text-white">{complaint.complaintId}</div>
                            <div className="text-sm text-slate-300">{complaint.complainantName}</div>
                            <div className="text-xs text-slate-300">{complaint.dateReceived}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {complaint.urgentFlag && (
                            <Badge className="bg-red-600 text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              URGENT
                            </Badge>
                          )}
                          {complaint.hardshipFlag && (
                            <Badge className="bg-purple-600 text-xs">
                              <DollarSign className="w-3 h-3 mr-1" />
                              HARDSHIP
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Category & Channel */}
                      <div className="md:col-span-2">
                        <div className="space-y-1 text-sm">
                          <div>
                            <div className="text-xs text-slate-300">Category</div>
                            <div className="font-semibold text-white">{complaint.category}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-300">Channel</div>
                            <div className="flex items-center gap-1">
                              {complaint.channel === 'Email' && <Mail className="w-3 h-3" />}
                              {complaint.channel === 'Phone' && <Phone className="w-3 h-3" />}
                              {complaint.channel === 'Portal' && <Globe className="w-3 h-3" />}
                              <span className="font-semibold text-white">{complaint.channel}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="md:col-span-2">
                        <Badge className={getStatusColor(complaint.status)}>
                          {complaint.status}
                        </Badge>
                        {complaint.assignedTo && (
                          <div className="mt-2 flex items-center gap-1 text-sm">
                            <User className="w-3 h-3 text-slate-300" />
                            <span className="text-slate-300">{complaint.assignedTo}</span>
                          </div>
                        )}
                      </div>

                      {/* SLA Tracking */}
                      <div className="md:col-span-3">
                        <div className="space-y-2">
                          {!complaint.acknowledgmentDate && (
                            <div className="text-sm">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-300">24hr Acknowledgment</span>
                                <Badge className="bg-red-600 text-xs">PENDING</Badge>
                              </div>
                              <Progress value={30} className="h-2" />
                            </div>
                          )}
                          <div className="text-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-300">30-Day Resolution</span>
                              <span className={`text-xs font-semibold ${getSLAColor(complaint.slaStatus)}`}>
                                {complaint.daysRemaining} days
                              </span>
                            </div>
                            <Progress 
                              value={complaint.daysRemaining > 0 ? ((30 - complaint.daysRemaining) / 30) * 100 : 100} 
                              className="h-2" 
                            />
                          </div>
                          <div className="text-xs text-slate-300">
                            Due: {complaint.dueDate.split(' ')[0]}
                          </div>
                        </div>
                      </div>

                      {/* Outcome */}
                      <div className="md:col-span-2">
                        {complaint.outcome ? (
                          <div className="text-sm">
                            <div className="text-xs text-slate-300 mb-1">Outcome</div>
                            <div className="font-semibold text-green-300">{complaint.outcome}</div>
                            {complaint.resolutionDate && (
                              <div className="text-xs text-slate-300 mt-1">
                                Resolved: {complaint.resolutionDate}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            className="w-full bg-cyan-600 hover:bg-cyan-700"
                            onClick={() => setSelectedComplaint(complaint.complaintId)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Related Info */}
                    {(complaint.relatedClient || complaint.relatedLoan) && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          {complaint.relatedClient && (
                            <div>
                              <span className="text-slate-300">Related Client: </span>
                              <span className="font-semibold text-white">{complaint.relatedClient}</span>
                            </div>
                          )}
                          {complaint.relatedLoan && (
                            <div>
                              <span className="text-slate-300">Related Loan: </span>
                              <span className="font-semibold text-white">{complaint.relatedLoan}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* DETAIL VIEW TAB */}
          <TabsContent value="detail">
            <Card className="border-2 border-cyan-500/30">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                <CardTitle>Complaint Detail: COMP-2024-002</CardTitle>
                <CardDescription>
                  Responsible Lending complaint - High Priority
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Complainant Details */}
                <div className="bg-blue-500/10 rounded-lg p-4 border-2 border-blue-500/30">
                  <h3 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    Complainant Details
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-300">Name: </span>
                      <span className="font-semibold">Sarah Mitchell</span>
                    </div>
                    <div>
                      <span className="text-slate-300">Email: </span>
                      <span className="font-semibold">sarah.mitchell@email.com</span>
                    </div>
                    <div>
                      <span className="text-slate-300">Phone: </span>
                      <span className="font-semibold">0412 345 678</span>
                    </div>
                  </div>
                </div>

                {/* Complaint Details */}
                <div>
                  <Label>Complaint Description</Label>
                  <Textarea 
                    rows={6}
                    disabled
                    className="mt-2"
                    defaultValue="Client alleges responsible lending obligations were not met during loan assessment. Claims affordability assessment was inadequate and income verification was insufficient. Experiencing financial hardship and requesting loan restructure or hardship variation.

Client states they were not asked about existing commitments and expenses were underestimated. HEM benchmark used instead of actual declared expenses. Now unable to meet repayments."
                  />
                </div>

                {/* Investigation Notes */}
                <div>
                  <Label>Investigation Notes</Label>
                  <Textarea 
                    rows={6}
                    className="mt-2"
                    placeholder="Document investigation progress, interviews, evidence reviewed..."
                    defaultValue="2024-03-19: File review commenced. Retrieved original loan application and assessment.

2024-03-19: Assessment shows HEM benchmark used for expenses ($2,800/month). Client declared actual expenses were $4,200/month but not recorded in assessment.

2024-03-20: Income verification appears adequate (payslips + bank statements). Issue is expense verification.

2024-03-21: Escalated to Senior Partner. Potential breach of responsible lending obligations. Recommending hardship arrangement and internal review of assessment procedures."
                  />
                </div>

                {/* Resolution Workflow */}
                <div className="bg-green-500/10 rounded-lg p-4 border-2 border-green-500/30">
                  <h3 className="font-bold text-green-300 mb-4">Resolution Workflow</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Outcome Decision</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select outcome" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upheld">Upheld - In Favour of Complainant</SelectItem>
                          <SelectItem value="partial">Partially Upheld</SelectItem>
                          <SelectItem value="not-upheld">Not Upheld</SelectItem>
                          <SelectItem value="withdrawn">Withdrawn by Complainant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Remedy Offered</Label>
                      <Textarea 
                        rows={3}
                        placeholder="Detail the remedy or resolution offered..."
                        className="mt-2"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>AFCA Referral</Label>
                        <Select>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="AFCA status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no">No AFCA Referral</SelectItem>
                            <SelectItem value="pending">AFCA Referral Pending</SelectItem>
                            <SelectItem value="lodged">Lodged with AFCA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>IDR Reference Number</Label>
                        <Input className="mt-2" placeholder="Internal Dispute Resolution ID" />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Send className="w-4 h-4 mr-2" />
                        Send Outcome Letter
                      </Button>
                      <Button className="bg-[#3DD598] hover:bg-green-500">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Resolved
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SLA TRACKING TAB */}
          <TabsContent value="sla">
            <div className="grid gap-6">
              {/* SLA Requirements */}
              <Card className="border-2 border-amber-500/30">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle>ASIC RG271 SLA Requirements</CardTitle>
                  <CardDescription>
                    Internal Dispute Resolution timeframes and compliance
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-500/10 rounded-lg border-2 border-blue-500/30">
                      <h3 className="font-bold text-blue-300 mb-2">24-Hour Acknowledgment Requirement</h3>
                      <p className="text-sm text-blue-300 mb-3">
                        All complaints must be acknowledged within 24 hours of receipt (RG271.53)
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-[#1e293b] rounded border border-blue-300">
                          <div className="text-xs text-slate-300">Acknowledged in 24hrs</div>
                          <div className="text-2xl font-bold text-green-400">
                            {complaints.filter(c => c.acknowledgmentDate).length}
                          </div>
                        </div>
                        <div className="p-3 bg-[#1e293b] rounded border border-red-300">
                          <div className="text-xs text-slate-300">Pending Acknowledgment</div>
                          <div className="text-2xl font-bold text-red-400">
                            {complaints.filter(c => !c.acknowledgmentDate).length}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-500/10 rounded-lg border-2 border-green-500/30">
                      <h3 className="font-bold text-green-300 mb-2">30-Day Resolution Requirement</h3>
                      <p className="text-sm text-green-300 mb-3">
                        Complaints must be resolved within 30 calendar days (RG271.60)
                      </p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-3 bg-[#1e293b] rounded border border-green-300">
                          <div className="text-xs text-slate-300">On Track</div>
                          <div className="text-2xl font-bold text-green-400">
                            {complaints.filter(c => c.slaStatus === 'On Track').length}
                          </div>
                        </div>
                        <div className="p-3 bg-[#1e293b] rounded border border-amber-300">
                          <div className="text-xs text-slate-300">At Risk</div>
                          <div className="text-2xl font-bold text-amber-400">
                            {complaints.filter(c => c.slaStatus === 'At Risk').length}
                          </div>
                        </div>
                        <div className="p-3 bg-[#1e293b] rounded border border-red-300">
                          <div className="text-xs text-slate-300">Overdue</div>
                          <div className="text-2xl font-bold text-red-400">
                            {complaints.filter(c => c.daysRemaining < 0).length}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-500/10 rounded-lg border-2 border-purple-500/30">
                      <h3 className="font-bold text-purple-300 mb-2">Urgent Complaint Escalation</h3>
                      <p className="text-sm text-purple-300 mb-3">
                        Urgent complaints (hardship, vulnerable customers) require priority handling
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-[#1e293b] rounded border border-purple-300">
                          <div className="text-xs text-slate-300">Urgent Complaints</div>
                          <div className="text-2xl font-bold text-orange-400">
                            {stats.urgent}
                          </div>
                        </div>
                        <div className="p-3 bg-[#1e293b] rounded border border-purple-300">
                          <div className="text-xs text-slate-300">Hardship Cases</div>
                          <div className="text-2xl font-bold text-purple-400">
                            {stats.hardship}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Overdue Alerts */}
              <Card className="border-2 border-red-500/30">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Overdue Complaints
                  </CardTitle>
                  <CardDescription>
                    Complaints requiring immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {complaints.filter(c => c.daysRemaining < 5 && c.status !== 'Resolved').length === 0 ? (
                    <div className="text-center py-8 text-slate-300">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                      <p>No overdue complaints - all on track! ✓</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-300">
                      <p>All complaints are on track</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* OUTCOMES TAB */}
          <TabsContent value="outcomes">
            <Card>
              <CardHeader>
                <CardTitle>Complaint Outcomes & Resolutions</CardTitle>
                <CardDescription>
                  Completed complaint resolutions and remedies
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {complaints.filter(c => c.outcome).map((complaint) => (
                    <div key={complaint.complaintId} className="p-4 bg-green-500/10 rounded-lg border-2 border-green-500/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <div>
                            <div className="font-bold text-white">{complaint.complaintId}</div>
                            <div className="text-sm text-slate-300">{complaint.complainantName}</div>
                          </div>
                        </div>
                        <Badge className="bg-green-600">Resolved</Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-slate-300">Category: </span>
                          <span className="font-semibold">{complaint.category}</span>
                        </div>
                        <div>
                          <span className="text-slate-300">Resolution Date: </span>
                          <span className="font-semibold">{complaint.resolutionDate}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-[#1e293b] rounded border border-green-300">
                        <div className="text-xs text-slate-300 mb-1">Outcome:</div>
                        <div className="font-semibold text-white">{complaint.outcome}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REPORTING TAB */}
          <TabsContent value="reporting">
            <Card className="border-2 border-indigo-500/30">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle>Management Reporting Dashboard</CardTitle>
                <CardDescription>
                  Complaints analytics and trends
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* By Category */}
                  <div className="p-4 bg-[#1e293b] rounded-lg border-2 border-indigo-500/30">
                    <h3 className="font-bold text-white mb-4">Complaints by Category</h3>
                    <div className="space-y-2">
                      {[
                        { category: 'Responsible Lending', count: 1, color: 'bg-red-600' },
                        { category: 'Service Quality', count: 2, color: 'bg-blue-600' },
                        { category: 'Fee Dispute', count: 1, color: 'bg-amber-600' },
                        { category: 'Disclosure', count: 1, color: 'bg-purple-600' },
                        { category: 'Communication', count: 1, color: 'bg-green-600' },
                        { category: 'Hardship', count: 1, color: 'bg-orange-600' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-sm text-slate-300">{item.category}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-white/10 rounded-full h-2">
                              <div className={`${item.color} h-2 rounded-full`} style={{ width: `${(item.count / stats.total) * 100}%` }} />
                            </div>
                            <span className="text-sm font-bold text-white w-6">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* By Channel */}
                  <div className="p-4 bg-[#1e293b] rounded-lg border-2 border-indigo-500/30">
                    <h3 className="font-bold text-white mb-4">Complaints by Channel</h3>
                    <div className="space-y-2">
                      {[
                        { channel: 'Email', count: 3, icon: Mail },
                        { channel: 'Phone', count: 2, icon: Phone },
                        { channel: 'Portal', count: 1, icon: Globe },
                        { channel: 'Manual Entry', count: 1, icon: FileText }
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div key={idx} className="flex items-center justify-between p-2 bg-[#0f172a] rounded">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-slate-300" />
                              <span className="text-sm text-slate-300">{item.channel}</span>
                            </div>
                            <span className="text-sm font-bold text-white">{item.count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Download className="w-4 h-4 mr-2" />
                    Export Monthly Report
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate AFCA Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

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
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  TrendingUp,
  FileText,
  Eye,
  PlayCircle,
  PauseCircle,
  Shield,
  DollarSign,
  Users,
  Building,
  Search
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';

interface OngoingDueDiligenceHubProps {
  onBack: () => void;
}

export function OngoingDueDiligenceHub({ onBack }: OngoingDueDiligenceHubProps) {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ODD Review Queue
  const reviewQueue = [
    {
      clientId: 'CL-2024-1847',
      clientName: 'Pinnacle Investment Group Pty Ltd',
      riskRating: 'HIGH',
      lastReview: '2023-03-15',
      nextReviewDue: '2024-03-15',
      daysOverdue: 7,
      status: 'Overdue',
      reviewFrequency: '12 months',
      assignedTo: 'Sarah Chen',
      triggers: ['Annual Review Due', 'Ownership Change Detected'],
      completionProgress: 0
    },
    {
      clientId: 'CL-2024-1203',
      clientName: 'Quantum Technologies Ltd',
      riskRating: 'MEDIUM',
      lastReview: '2023-09-10',
      nextReviewDue: '2024-09-10',
      daysOverdue: 0,
      status: 'Due Soon',
      reviewFrequency: '18 months',
      assignedTo: 'Emma Williams',
      triggers: ['Scheduled Review'],
      completionProgress: 45
    },
    {
      clientId: 'CL-2024-0892',
      clientName: 'Heritage Property Trust',
      riskRating: 'MEDIUM',
      lastReview: '2024-01-20',
      nextReviewDue: '2025-01-20',
      daysOverdue: 0,
      status: 'Current',
      reviewFrequency: '18 months',
      assignedTo: 'Michael Roberts',
      triggers: [],
      completionProgress: 100
    },
    {
      clientId: 'CL-2023-2156',
      clientName: 'Global Ventures Pty Ltd',
      riskRating: 'HIGH',
      lastReview: '2023-12-05',
      nextReviewDue: '2024-12-05',
      daysOverdue: 0,
      status: 'In Progress',
      reviewFrequency: '12 months',
      assignedTo: 'David Thompson',
      triggers: ['Large Transaction Detected ($2.5M)', 'Unusual Activity Pattern'],
      completionProgress: 65
    },
    {
      clientId: 'CL-2024-0445',
      clientName: 'Coastal Developments Ltd',
      riskRating: 'LOW',
      lastReview: '2023-06-15',
      nextReviewDue: '2026-06-15',
      daysOverdue: 0,
      status: 'Current',
      reviewFrequency: '36 months',
      assignedTo: 'Emma Williams',
      triggers: [],
      completionProgress: 100
    },
    {
      clientId: 'CL-2023-1876',
      clientName: 'Summit Capital Partners',
      riskRating: 'EXTREME',
      lastReview: '2023-10-01',
      nextReviewDue: '2024-04-01',
      daysOverdue: 0,
      status: 'Overdue',
      reviewFrequency: '6 months',
      assignedTo: 'Sarah Chen',
      triggers: ['6-Month Review Due', 'PEP Screening Alert', 'Stale Documents'],
      completionProgress: 20
    }
  ];

  // Review checklist template
  const reviewChecklist = [
    { id: 1, item: 'Verify client contact details', category: 'Identity', status: 'pending' },
    { id: 2, item: 'Confirm beneficial ownership unchanged', category: 'Ownership', status: 'pending' },
    { id: 3, item: 'Review transaction patterns', category: 'Activity', status: 'pending' },
    { id: 4, item: 'Re-run PEP screening', category: 'Screening', status: 'pending' },
    { id: 5, item: 'Re-run sanctions screening', category: 'Screening', status: 'pending' },
    { id: 6, item: 'Check adverse media', category: 'Screening', status: 'pending' },
    { id: 7, item: 'Verify source of funds still valid', category: 'Financial', status: 'pending' },
    { id: 8, item: 'Review risk score', category: 'Risk', status: 'pending' },
    { id: 9, item: 'Check document expiry dates', category: 'Documents', status: 'pending' },
    { id: 10, item: 'Update customer due diligence file', category: 'Documentation', status: 'pending' }
  ];

  // Trigger events configuration
  const triggerEvents = [
    {
      type: 'Ownership Change',
      enabled: true,
      description: 'Beneficial ownership structure changes by 25% or more',
      lastTriggered: '2024-03-10',
      clientsAffected: 2
    },
    {
      type: 'Large Transaction',
      enabled: true,
      description: 'Single transaction exceeding $1,000,000',
      lastTriggered: '2024-03-18',
      clientsAffected: 1
    },
    {
      type: 'Unusual Activity',
      enabled: true,
      description: 'Activity pattern deviates significantly from historical baseline',
      lastTriggered: '2024-03-12',
      clientsAffected: 1
    },
    {
      type: 'Stale Documents',
      enabled: true,
      description: 'ID documents expiring within 30 days',
      lastTriggered: '2024-03-15',
      clientsAffected: 3
    },
    {
      type: 'Screening Hit',
      enabled: true,
      description: 'New PEP, sanctions, or adverse media match',
      lastTriggered: '2024-03-05',
      clientsAffected: 1
    },
    {
      type: 'Manual Review Request',
      enabled: true,
      description: 'Compliance officer or relationship manager requests ad-hoc review',
      lastTriggered: '2024-03-01',
      clientsAffected: 2
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Overdue': return 'bg-red-600';
      case 'Due Soon': return 'bg-amber-600';
      case 'In Progress': return 'bg-blue-600';
      case 'Current': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'EXTREME': return 'bg-red-600';
      case 'HIGH': return 'bg-orange-600';
      case 'MEDIUM': return 'bg-amber-600';
      case 'LOW': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const filteredQueue = reviewQueue.filter(client => {
    const matchesSearch = client.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.clientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: reviewQueue.length,
    overdue: reviewQueue.filter(c => c.status === 'Overdue').length,
    dueSoon: reviewQueue.filter(c => c.status === 'Due Soon').length,
    inProgress: reviewQueue.filter(c => c.status === 'In Progress').length,
    current: reviewQueue.filter(c => c.status === 'Current').length
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
            <RefreshCw className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold">Ongoing Due Diligence Hub</h1>
              <p className="text-sm text-white/90">AUSTRAC ODD Requirements & Review Management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[#1e293b] border-b border-white/10 px-6 py-4">
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-xs text-slate-300 mt-1">Total Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-xs text-slate-300 mt-1">Overdue</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">{stats.dueSoon}</div>
            <div className="text-xs text-slate-300 mt-1">Due Soon</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-xs text-slate-300 mt-1">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.current}</div>
            <div className="text-xs text-slate-300 mt-1">Current</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="queue">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="queue">
              <Clock className="w-4 h-4 mr-2" />
              Review Queue
            </TabsTrigger>
            <TabsTrigger value="checklist">
              <CheckCircle className="w-4 h-4 mr-2" />
              Review Checklist
            </TabsTrigger>
            <TabsTrigger value="triggers">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Trigger Events
            </TabsTrigger>
            <TabsTrigger value="evidence">
              <FileText className="w-4 h-4 mr-2" />
              Evidence Log
            </TabsTrigger>
          </TabsList>

          {/* REVIEW QUEUE TAB */}
          <TabsContent value="queue">
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search by client name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                        <SelectItem value="Due Soon">Due Soon</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Current">Current</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Queue Items */}
              <div className="space-y-3">
                {filteredQueue.map((client) => (
                  <Card key={client.clientId} className={`border-2 ${
                    client.status === 'Overdue' ? 'border-red-300 bg-red-50' :
                    client.status === 'Due Soon' ? 'border-amber-300 bg-amber-50' :
                    'border-white/10'
                  }`}>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-12 gap-4 items-center">
                        {/* Client Info */}
                        <div className="md:col-span-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Building className="w-5 h-5 text-cyan-600" />
                            <div>
                              <div className="font-bold text-white">{client.clientName}</div>
                              <div className="text-xs text-slate-300">{client.clientId}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getRiskColor(client.riskRating)}>
                              {client.riskRating}
                            </Badge>
                            <Badge className={getStatusColor(client.status)}>
                              {client.status}
                            </Badge>
                          </div>
                        </div>

                        {/* Review Dates */}
                        <div className="md:col-span-3">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-300">Last Review:</span>
                              <span className="font-semibold">{client.lastReview}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-300">Next Due:</span>
                              <span className={`font-semibold ${
                                client.daysOverdue > 0 ? 'text-red-600' : 'text-white'
                              }`}>
                                {client.nextReviewDue}
                                {client.daysOverdue > 0 && ` (${client.daysOverdue}d overdue)`}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-300">Frequency:</span>
                              <span className="font-semibold">{client.reviewFrequency}</span>
                            </div>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="md:col-span-2">
                          <div className="text-center mb-2">
                            <div className="text-2xl font-bold text-white">{client.completionProgress}%</div>
                            <div className="text-xs text-slate-300">Complete</div>
                          </div>
                          <Progress value={client.completionProgress} className="h-2" />
                        </div>

                        {/* Assigned To */}
                        <div className="md:col-span-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-slate-300" />
                            <span className="text-sm font-semibold text-white">{client.assignedTo}</span>
                          </div>
                          {client.triggers.length > 0 && (
                            <div className="space-y-1">
                              {client.triggers.map((trigger, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs block w-full">
                                  {trigger}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="md:col-span-1">
                          <Button 
                            size="sm" 
                            className="w-full bg-cyan-600 hover:bg-cyan-700"
                            onClick={() => setSelectedClient(client.clientId)}
                          >
                            <PlayCircle className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* REVIEW CHECKLIST TAB */}
          <TabsContent value="checklist">
            <Card>
              <CardHeader>
                <CardTitle>Standard ODD Review Checklist</CardTitle>
                <CardDescription>
                  Complete all items for each ongoing due diligence review
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  {reviewChecklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-[#0f172a] rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 font-bold text-sm">
                          {item.id}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{item.item}</div>
                          <div className="text-xs text-slate-300">Category: {item.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.status}</Badge>
                        <Button size="sm" variant="ghost">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-2">Review Frequency by Risk Rating</h3>
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div className="p-3 bg-[#1e293b] rounded border border-red-200">
                      <div className="font-bold text-red-600 mb-1">EXTREME RISK</div>
                      <div className="text-slate-300">Every 6 months</div>
                    </div>
                    <div className="p-3 bg-[#1e293b] rounded border border-orange-200">
                      <div className="font-bold text-orange-600 mb-1">HIGH RISK</div>
                      <div className="text-slate-300">Every 12 months</div>
                    </div>
                    <div className="p-3 bg-[#1e293b] rounded border border-amber-200">
                      <div className="font-bold text-amber-600 mb-1">MEDIUM RISK</div>
                      <div className="text-slate-300">Every 18 months</div>
                    </div>
                    <div className="p-3 bg-[#1e293b] rounded border border-green-200">
                      <div className="font-bold text-green-600 mb-1">LOW RISK</div>
                      <div className="text-slate-300">Every 36 months</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TRIGGER EVENTS TAB */}
          <TabsContent value="triggers">
            <Card>
              <CardHeader>
                <CardTitle>Trigger Event Configuration</CardTitle>
                <CardDescription>
                  Events that automatically trigger an ODD review outside scheduled reviews
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {triggerEvents.map((trigger, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border-2 border-white/10 bg-[#0f172a]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                          <div>
                            <div className="font-bold text-white">{trigger.type}</div>
                            <div className="text-sm text-slate-300 mt-1">{trigger.description}</div>
                          </div>
                        </div>
                        <Badge className={trigger.enabled ? 'bg-green-600' : 'bg-gray-400'}>
                          {trigger.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-slate-300">
                          <span>Last triggered: {trigger.lastTriggered}</span>
                          <span>•</span>
                          <span>{trigger.clientsAffected} client{trigger.clientsAffected !== 1 ? 's' : ''} affected</span>
                        </div>
                        <Button size="sm" variant="outline">
                          Configure
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EVIDENCE LOG TAB */}
          <TabsContent value="evidence">
            <Card>
              <CardHeader>
                <CardTitle>Completed Review Evidence Log</CardTitle>
                <CardDescription>
                  Audit trail of all completed ODD reviews
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {[
                    {
                      reviewId: 'ODD-2024-0234',
                      client: 'Heritage Property Trust',
                      completedDate: '2024-01-20',
                      completedBy: 'Michael Roberts',
                      outcome: 'No changes required',
                      riskRating: 'MEDIUM',
                      nextReview: '2025-01-20'
                    },
                    {
                      reviewId: 'ODD-2024-0189',
                      client: 'Coastal Developments Ltd',
                      completedDate: '2023-06-15',
                      completedBy: 'Emma Williams',
                      outcome: 'Risk rating downgraded to LOW',
                      riskRating: 'LOW',
                      nextReview: '2026-06-15'
                    },
                    {
                      reviewId: 'ODD-2023-0876',
                      client: 'Quantum Technologies Ltd',
                      completedDate: '2023-09-10',
                      completedBy: 'Emma Williams',
                      outcome: 'Updated beneficial ownership records',
                      riskRating: 'MEDIUM',
                      nextReview: '2024-09-10'
                    }
                  ].map((review, idx) => (
                    <div key={idx} className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-bold text-white">{review.reviewId}</div>
                            <div className="text-sm text-slate-300">{review.client}</div>
                          </div>
                        </div>
                        <Badge className={getRiskColor(review.riskRating)}>
                          {review.riskRating}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm mt-3">
                        <div>
                          <span className="text-slate-300">Completed: </span>
                          <span className="font-semibold">{review.completedDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-300">By: </span>
                          <span className="font-semibold">{review.completedBy}</span>
                        </div>
                        <div>
                          <span className="text-slate-300">Outcome: </span>
                          <span className="font-semibold">{review.outcome}</span>
                        </div>
                        <div>
                          <span className="text-slate-300">Next Review: </span>
                          <span className="font-semibold">{review.nextReview}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          View Evidence
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-3 h-3 mr-1" />
                          Download Report
                        </Button>
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

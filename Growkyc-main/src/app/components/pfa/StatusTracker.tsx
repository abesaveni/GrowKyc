import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Calendar,
  User,
  Building2,
  DollarSign,
  TrendingUp,
  Eye,
  MessageSquare,
  Bell
} from 'lucide-react';

interface StatusTrackerProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function StatusTracker({ onNavigate, onBack }: StatusTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const applications = [
    {
      id: 'APP-2024-001',
      client: 'ABC Enterprises Pty Ltd',
      loanType: 'Commercial Mortgage',
      amount: 850000,
      submittedDate: '2024-02-05',
      currentStage: 'Credit Assessment',
      status: 'in-progress',
      progress: 65,
      daysInStage: 3,
      nextAction: 'Awaiting credit committee review',
      lastUpdate: '2 hours ago',
      milestones: [
        { name: 'Enquiry', completed: true, date: '2024-01-28' },
        { name: 'Application Submitted', completed: true, date: '2024-02-05' },
        { name: 'Documents Verified', completed: true, date: '2024-02-08' },
        { name: 'Credit Assessment', completed: false, date: null },
        { name: 'Approval', completed: false, date: null },
        { name: 'Settlement', completed: false, date: null }
      ]
    },
    {
      id: 'APP-2024-002',
      client: 'Tech Innovations Ltd',
      loanType: 'SME Term Loan',
      amount: 450000,
      submittedDate: '2024-02-08',
      currentStage: 'Document Verification',
      status: 'action-required',
      progress: 40,
      daysInStage: 5,
      nextAction: 'Client to provide additional financial statements',
      lastUpdate: '1 day ago',
      milestones: [
        { name: 'Enquiry', completed: true, date: '2024-02-01' },
        { name: 'Application Submitted', completed: true, date: '2024-02-08' },
        { name: 'Documents Verified', completed: false, date: null },
        { name: 'Credit Assessment', completed: false, date: null },
        { name: 'Approval', completed: false, date: null },
        { name: 'Settlement', completed: false, date: null }
      ]
    },
    {
      id: 'APP-2024-003',
      client: 'Green Energy Solutions',
      loanType: 'Asset Finance',
      amount: 320000,
      submittedDate: '2024-02-10',
      currentStage: 'Approved',
      status: 'approved',
      progress: 85,
      daysInStage: 2,
      nextAction: 'Preparing settlement documents',
      lastUpdate: '3 hours ago',
      milestones: [
        { name: 'Enquiry', completed: true, date: '2024-02-03' },
        { name: 'Application Submitted', completed: true, date: '2024-02-10' },
        { name: 'Documents Verified', completed: true, date: '2024-02-11' },
        { name: 'Credit Assessment', completed: true, date: '2024-02-12' },
        { name: 'Approval', completed: true, date: '2024-02-14' },
        { name: 'Settlement', completed: false, date: null }
      ]
    },
    {
      id: 'APP-2024-004',
      client: 'Retail Group Pty Ltd',
      loanType: 'Private Lending',
      amount: 1200000,
      submittedDate: '2024-01-20',
      currentStage: 'Settlement',
      status: 'settlement',
      progress: 95,
      daysInStage: 1,
      nextAction: 'Settlement scheduled for tomorrow',
      lastUpdate: '5 hours ago',
      milestones: [
        { name: 'Enquiry', completed: true, date: '2024-01-10' },
        { name: 'Application Submitted', completed: true, date: '2024-01-20' },
        { name: 'Documents Verified', completed: true, date: '2024-01-22' },
        { name: 'Credit Assessment', completed: true, date: '2024-01-25' },
        { name: 'Approval', completed: true, date: '2024-01-28' },
        { name: 'Settlement', completed: false, date: null }
      ]
    },
    {
      id: 'APP-2024-005',
      client: 'Construction Co',
      loanType: 'Commercial Mortgage',
      amount: 2500000,
      submittedDate: '2024-01-15',
      currentStage: 'Settled',
      status: 'completed',
      progress: 100,
      daysInStage: 0,
      nextAction: 'Application complete',
      lastUpdate: '2 days ago',
      milestones: [
        { name: 'Enquiry', completed: true, date: '2024-01-05' },
        { name: 'Application Submitted', completed: true, date: '2024-01-15' },
        { name: 'Documents Verified', completed: true, date: '2024-01-17' },
        { name: 'Credit Assessment', completed: true, date: '2024-01-20' },
        { name: 'Approval', completed: true, date: '2024-01-23' },
        { name: 'Settlement', completed: true, date: '2024-01-28' }
      ]
    },
    {
      id: 'APP-2024-006',
      client: 'Medical Practice Group',
      loanType: 'SME Term Loan',
      amount: 680000,
      submittedDate: '2024-02-12',
      currentStage: 'Application Review',
      status: 'on-hold',
      progress: 20,
      daysInStage: 4,
      nextAction: 'Waiting for client response on queries',
      lastUpdate: '3 days ago',
      milestones: [
        { name: 'Enquiry', completed: true, date: '2024-02-05' },
        { name: 'Application Submitted', completed: true, date: '2024-02-12' },
        { name: 'Documents Verified', completed: false, date: null },
        { name: 'Credit Assessment', completed: false, date: null },
        { name: 'Approval', completed: false, date: null },
        { name: 'Settlement', completed: false, date: null }
      ]
    }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.loanType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const statusConfig = {
    'in-progress': { label: 'In Progress', color: 'bg-blue-500/15 text-blue-300 border-blue-300', icon: Clock },
    'action-required': { label: 'Action Required', color: 'bg-yellow-500/15 text-yellow-300 border-yellow-300', icon: AlertCircle },
    'approved': { label: 'Approved', color: 'bg-green-500/15 text-green-300 border-green-300', icon: CheckCircle },
    'settlement': { label: 'Settlement', color: 'bg-purple-500/15 text-purple-300 border-purple-300', icon: FileText },
    'completed': { label: 'Completed', color: 'bg-white/5 text-slate-300 border-white/10', icon: CheckCircle },
    'on-hold': { label: 'On Hold', color: 'bg-orange-500/15 text-orange-300 border-orange-300', icon: XCircle }
  };

  const statusSummary = {
    inProgress: applications.filter(a => a.status === 'in-progress').length,
    actionRequired: applications.filter(a => a.status === 'action-required').length,
    approved: applications.filter(a => a.status === 'approved').length,
    settlement: applications.filter(a => a.status === 'settlement').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Application Status Tracker</h1>
            <p className="text-slate-300 mt-1">Track and monitor all your loan applications</p>
          </div>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Bell className="w-4 h-4 mr-2" />
          Set Alerts
        </Button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/15 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-slate-100">{statusSummary.inProgress}</p>
            <p className="text-xs text-slate-400 mt-2">Active applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/15 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-1">Action Required</p>
            <p className="text-2xl font-bold text-yellow-300">{statusSummary.actionRequired}</p>
            <p className="text-xs text-slate-400 mt-2">Needs your attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/15 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-300">{statusSummary.approved}</p>
            <p className="text-xs text-slate-400 mt-2">Awaiting settlement</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/15 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-1">Settlement</p>
            <p className="text-2xl font-bold text-purple-300">{statusSummary.settlement}</p>
            <p className="text-xs text-slate-400 mt-2">Ready to settle</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by application ID, client name, or loan type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="in-progress">In Progress</option>
              <option value="action-required">Action Required</option>
              <option value="approved">Approved</option>
              <option value="settlement">Settlement</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((app) => {
          const config = statusConfig[app.status as keyof typeof statusConfig];
          const StatusIcon = config.icon;

          return (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-100">{app.client}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${config.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400">Application ID</p>
                        <p className="font-medium text-slate-100">{app.id}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Loan Type</p>
                        <p className="font-medium text-slate-100">{app.loanType}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Amount</p>
                        <p className="font-medium text-slate-100">${app.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Submitted</p>
                        <p className="font-medium text-slate-100">{app.submittedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">Current Stage: {app.currentStage}</span>
                    <span className="text-sm text-slate-300">{app.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${app.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones */}
                <div className="mb-4">
                  <div className="flex items-center justify-between gap-2">
                    {app.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                          milestone.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white/10 text-gray-400'
                        }`}>
                          {milestone.completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>
                        <p className="text-xs text-center font-medium text-slate-300">{milestone.name}</p>
                        {milestone.date && (
                          <p className="text-xs text-slate-400">{milestone.date}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Action */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-300">Next Action</p>
                      <p className="text-sm text-blue-300">{app.nextAction}</p>
                      <p className="text-xs text-blue-400 mt-1">Last update: {app.lastUpdate}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4 text-sm text-slate-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {app.daysInStage} days in stage
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onNavigate?.('broker-deal-view')}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-slate-300 mb-4">No applications found matching your criteria.</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

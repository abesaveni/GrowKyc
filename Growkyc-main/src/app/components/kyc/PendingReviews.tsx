import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  Users,
  Shield,
  Search,
  Filter,
  Download,
  Send,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Activity,
  Target,
  TrendingUp,
  Calendar,
  Hash,
  Mail,
  Phone,
  Building,
  Lock,
  Unlock,
  Edit,
  RefreshCw,
  Zap
} from 'lucide-react';

type ReviewStatus = 'pending' | 'in-review' | 'approved' | 'rejected' | 'more-info-required';
type ReviewType = 'new-client' | 'annual-review' | 'edd-triggered' | 'risk-reassessment' | 'document-update';
type RiskTier = 'low' | 'medium' | 'high' | 'critical';
type Priority = 'urgent' | 'high' | 'normal' | 'low';

interface ReviewCase {
  id: string;
  clientName: string;
  clientId: string;
  reviewType: ReviewType;
  status: ReviewStatus;
  priority: Priority;
  riskTier: RiskTier;
  assignedTo: string;
  submittedDate: Date;
  dueDate: Date;
  lastActionDate: Date;
  completionProgress: number;
  
  // Review Items
  kycDocuments: { name: string; status: 'verified' | 'pending' | 'rejected' }[];
  screeningResults: { check: string; result: 'clear' | 'match' | 'failed' };
  riskAssessment: { factor: string; score: number }[];
  
  // Flags
  hasRedFlags: boolean;
  requiresSeniorApproval: boolean;
  eddRequired: boolean;
  
  // Comments
  reviewerNotes?: string;
  clientComments?: string;
}

export function PendingReviews() {
  const [activeTab, setActiveTab] = useState<'overview' | 'my-queue' | 'all-reviews' | 'approvals' | 'history'>('overview');
  const [filterStatus, setFilterStatus] = useState<ReviewStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [selectedReview, setSelectedReview] = useState<ReviewCase | null>(null);

  const [reviews] = useState<ReviewCase[]>([
    {
      id: 'REV-2024-001',
      clientName: 'Tech Solutions Pty Ltd',
      clientId: 'C-2024-002',
      reviewType: 'new-client',
      status: 'pending',
      priority: 'urgent',
      riskTier: 'medium',
      assignedTo: 'Emma Wilson',
      submittedDate: new Date('2024-02-17'),
      dueDate: new Date('2024-02-20'),
      lastActionDate: new Date('2024-02-17'),
      completionProgress: 100,
      kycDocuments: [
        { name: 'ASIC Company Extract', status: 'verified' },
        { name: 'Director ID - John Smith', status: 'verified' },
        { name: 'Director ID - Sarah Lee', status: 'verified' },
        { name: 'Shareholder Register', status: 'verified' },
        { name: 'Source of Funds Declaration', status: 'verified' }
      ],
      screeningResults: { check: 'Sanctions/PEP/Adverse Media', result: 'clear' },
      riskAssessment: [
        { factor: 'Client Type', score: 15 },
        { factor: 'Geographic Risk', score: 5 },
        { factor: 'Transaction Profile', score: 10 },
        { factor: 'Ownership Complexity', score: 10 }
      ],
      hasRedFlags: false,
      requiresSeniorApproval: false,
      eddRequired: false,
      reviewerNotes: 'All documents verified. Low risk profile. Ready for approval.',
      clientComments: 'All information provided is accurate and up to date.'
    },
    {
      id: 'REV-2024-002',
      clientName: 'Melbourne Family Trust',
      clientId: 'C-2024-003',
      reviewType: 'edd-triggered',
      status: 'in-review',
      priority: 'urgent',
      riskTier: 'high',
      assignedTo: 'Michael Chen',
      submittedDate: new Date('2024-02-15'),
      dueDate: new Date('2024-02-19'),
      lastActionDate: new Date('2024-02-18'),
      completionProgress: 75,
      kycDocuments: [
        { name: 'Trust Deed', status: 'verified' },
        { name: 'Trustee Company Documents', status: 'verified' },
        { name: 'Beneficiary List', status: 'pending' },
        { name: 'Source of Wealth Evidence', status: 'pending' },
        { name: 'Financial Statements', status: 'verified' }
      ],
      screeningResults: { check: 'Enhanced Screening', result: 'match' },
      riskAssessment: [
        { factor: 'Complex Structure', score: 25 },
        { factor: 'Foreign Beneficiaries', score: 20 },
        { factor: 'High Net Worth', score: 15 },
        { factor: 'Discretionary Powers', score: 15 }
      ],
      hasRedFlags: true,
      requiresSeniorApproval: true,
      eddRequired: true,
      reviewerNotes: 'PEP match requires further investigation. Awaiting source of wealth documentation.',
      clientComments: 'Additional documents will be provided by end of week.'
    },
    {
      id: 'REV-2024-003',
      clientName: 'Sarah Mitchell',
      clientId: 'C-2024-001',
      reviewType: 'annual-review',
      status: 'pending',
      priority: 'normal',
      riskTier: 'low',
      assignedTo: 'Emma Wilson',
      submittedDate: new Date('2024-02-18'),
      dueDate: new Date('2024-02-25'),
      lastActionDate: new Date('2024-02-18'),
      completionProgress: 60,
      kycDocuments: [
        { name: 'Updated Proof of Address', status: 'verified' },
        { name: 'Current Employment Letter', status: 'pending' }
      ],
      screeningResults: { check: 'Standard Screening', result: 'clear' },
      riskAssessment: [
        { factor: 'Client Type', score: 5 },
        { factor: 'Transaction History', score: 5 },
        { factor: 'No Changes in Profile', score: 0 }
      ],
      hasRedFlags: false,
      requiresSeniorApproval: false,
      eddRequired: false,
      reviewerNotes: 'Annual review in progress. Waiting on employment verification.',
      clientComments: 'Will provide updated employment letter tomorrow.'
    },
    {
      id: 'REV-2024-004',
      clientName: 'Green Valley SMSF',
      clientId: 'C-2024-005',
      reviewType: 'document-update',
      status: 'more-info-required',
      priority: 'high',
      riskTier: 'low',
      assignedTo: 'Lisa Martinez',
      submittedDate: new Date('2024-02-16'),
      dueDate: new Date('2024-02-23'),
      lastActionDate: new Date('2024-02-17'),
      completionProgress: 40,
      kycDocuments: [
        { name: 'Updated Trust Deed', status: 'rejected' },
        { name: 'New Trustee Appointment', status: 'pending' }
      ],
      screeningResults: { check: 'Standard Screening', result: 'clear' },
      riskAssessment: [
        { factor: 'SMSF Structure', score: 10 },
        { factor: 'Trustee Change', score: 15 }
      ],
      hasRedFlags: false,
      requiresSeniorApproval: false,
      eddRequired: false,
      reviewerNotes: 'Trust deed document is not certified. Please provide certified copy.',
      clientComments: 'Will arrange certification with JP.'
    },
    {
      id: 'REV-2024-005',
      clientName: 'David Thompson',
      clientId: 'C-2024-007',
      reviewType: 'risk-reassessment',
      status: 'pending',
      priority: 'high',
      riskTier: 'medium',
      assignedTo: 'Michael Chen',
      submittedDate: new Date('2024-02-19'),
      dueDate: new Date('2024-02-22'),
      lastActionDate: new Date('2024-02-19'),
      completionProgress: 0,
      kycDocuments: [
        { name: 'Explanation Letter', status: 'pending' },
        { name: 'Updated Financial Statements', status: 'pending' }
      ],
      screeningResults: { check: 'Triggered Re-screening', result: 'match' },
      riskAssessment: [
        { factor: 'Unusual Transaction Pattern', score: 30 },
        { factor: 'High Value Transactions', score: 20 }
      ],
      hasRedFlags: true,
      requiresSeniorApproval: true,
      eddRequired: true,
      reviewerNotes: 'Triggered by monitoring alert - unusual large cash deposits. EDD required.'
    }
  ]);

  const getStatusColor = (status: ReviewStatus) => {
    switch (status) {
      case 'pending': return 'blue';
      case 'in-review': return 'yellow';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'more-info-required': return 'orange';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'normal': return 'blue';
      case 'low': return 'gray';
    }
  };

  const getRiskColor = (tier: RiskTier) => {
    switch (tier) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'orange';
      case 'critical': return 'red';
    }
  };

  const reviewTypeLabels: Record<ReviewType, string> = {
    'new-client': 'New Client',
    'annual-review': 'Annual Review',
    'edd-triggered': 'EDD Triggered',
    'risk-reassessment': 'Risk Reassessment',
    'document-update': 'Document Update'
  };

  const filteredReviews = reviews.filter(review => {
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || review.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    inReview: reviews.filter(r => r.status === 'in-review').length,
    urgent: reviews.filter(r => r.priority === 'urgent').length,
    overdue: reviews.filter(r => r.dueDate < new Date()).length,
    requiresApproval: reviews.filter(r => r.requiresSeniorApproval).length,
    avgReviewTime: 3.5
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Eye className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Pending Reviews</h1>
              <p className="text-xl text-purple-100">Client Review Queue & Approval Workflow</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-purple-600 hover:bg-purple-50">
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh Queue
            </Button>
            <Button className="bg-white text-purple-600 hover:bg-purple-50">
              <Download className="w-5 h-5 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-7 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">Total Reviews</h3>
              <FileText className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Pending</h3>
              <Clock className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-blue-300">{stats.pending}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">In Review</h3>
              <Activity className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-yellow-300">{stats.inReview}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Urgent</h3>
              <Zap className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-red-300">{stats.urgent}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Overdue</h3>
              <AlertTriangle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-orange-300">{stats.overdue}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Need Approval</h3>
              <Lock className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-yellow-300">{stats.requiresApproval}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Avg Days</h3>
              <TrendingUp className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.avgReviewTime}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'my-queue', label: 'My Queue', icon: Users },
            { id: 'all-reviews', label: 'All Reviews', icon: FileText },
            { id: 'approvals', label: 'Senior Approvals', icon: Lock },
            { id: 'history', label: 'Review History', icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-semibold flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client name, review ID, or assigned reviewer..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-2">
            <span className="text-sm font-semibold text-gray-700 self-center">Status:</span>
            {['all', 'pending', 'in-review', 'more-info-required'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                  filterStatus === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status.replace('-', ' ').charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <span className="text-sm font-semibold text-gray-700 self-center">Priority:</span>
            {['all', 'urgent', 'high', 'normal'].map((priority) => (
              <button
                key={priority}
                onClick={() => setFilterPriority(priority as any)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                  filterPriority === priority
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className={`bg-white rounded-lg border-2 p-6 ${
            review.priority === 'urgent' ? 'border-red-300 bg-red-50' :
            review.hasRedFlags ? 'border-orange-300' :
            'border-gray-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{review.clientName}</h3>
                  <span className={`px-3 py-1 bg-${getStatusColor(review.status)}-100 text-${getStatusColor(review.status)}-700 text-sm font-bold rounded-full`}>
                    {review.status.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 bg-${getPriorityColor(review.priority)}-100 text-${getPriorityColor(review.priority)}-700 text-sm font-bold rounded-full`}>
                    {review.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className={`px-3 py-1 bg-${getRiskColor(review.riskTier)}-100 text-${getRiskColor(review.riskTier)}-700 text-sm font-semibold rounded-full`}>
                    {review.riskTier.toUpperCase()} RISK
                  </span>
                  {review.requiresSeniorApproval && (
                    <span className="px-3 py-1 bg-purple-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                      <Lock className="w-4 h-4" />
                      SENIOR APPROVAL
                    </span>
                  )}
                  {review.eddRequired && (
                    <span className="px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full">
                      EDD REQUIRED
                    </span>
                  )}
                  {review.hasRedFlags && (
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      RED FLAGS
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Hash className="w-4 h-4" />
                    {review.id}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {reviewTypeLabels[review.reviewType]}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Assigned to {review.assignedTo}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Submitted: {review.submittedDate.toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className={`flex items-center gap-1 font-semibold ${
                    review.dueDate < new Date() ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <Clock className="w-4 h-4" />
                    Due: {review.dueDate.toLocaleDateString()}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Review Progress</span>
                    <span className="text-sm font-bold text-gray-900">{review.completionProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-${getStatusColor(review.status)}-600 h-3 rounded-full transition-all`}
                      style={{ width: `${review.completionProgress}%` }}
                    />
                  </div>
                </div>

                {/* Review Items */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {/* Documents */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Documents ({review.kycDocuments.filter(d => d.status === 'verified').length}/{review.kycDocuments.length})
                    </h4>
                    <div className="space-y-1">
                      {review.kycDocuments.slice(0, 3).map((doc, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700 truncate">{doc.name}</span>
                          {doc.status === 'verified' ? (
                            <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0 ml-2" />
                          ) : doc.status === 'rejected' ? (
                            <XCircle className="w-3 h-3 text-red-600 flex-shrink-0 ml-2" />
                          ) : (
                            <Clock className="w-3 h-3 text-yellow-600 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      ))}
                      {review.kycDocuments.length > 3 && (
                        <p className="text-xs text-gray-500 mt-1">+{review.kycDocuments.length - 3} more</p>
                      )}
                    </div>
                  </div>

                  {/* Screening */}
                  <div className={`p-3 rounded-lg border ${
                    review.screeningResults.result === 'clear' ? 'bg-green-50 border-green-200' :
                    review.screeningResults.result === 'match' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Screening
                    </h4>
                    <p className="text-xs text-gray-700 mb-2">{review.screeningResults.check}</p>
                    <div className="flex items-center gap-2">
                      {review.screeningResults.result === 'clear' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-bold text-green-700">CLEAR</span>
                        </>
                      ) : review.screeningResults.result === 'match' ? (
                        <>
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-bold text-yellow-700">MATCH - REVIEW</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-bold text-red-700">FAILED</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Risk Score */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Risk Score: {review.riskAssessment.reduce((sum, r) => sum + r.score, 0)}
                    </h4>
                    <div className="space-y-1">
                      {review.riskAssessment.map((factor, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700">{factor.factor}</span>
                          <span className="font-bold text-gray-900">{factor.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {review.reviewerNotes && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Reviewer Notes:</p>
                    <p className="text-sm text-blue-800">{review.reviewerNotes}</p>
                  </div>
                )}

                {review.clientComments && (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-semibold text-purple-900 mb-1">Client Comments:</p>
                    <p className="text-sm text-purple-800">{review.clientComments}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-6">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Eye className="w-4 h-4 mr-2" />
                  Open Review
                </Button>
                {review.status === 'pending' && (
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Activity className="w-4 h-4 mr-2" />
                    Start Review
                  </Button>
                )}
                {review.status === 'in-review' && (
                  <>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Request Info
                    </Button>
                  </>
                )}
                <Button variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

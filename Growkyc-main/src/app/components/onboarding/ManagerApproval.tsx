// Manager Approval - Final approval for onboarded clients
import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building2,
  FileText,
  Shield,
  DollarSign,
  Calendar,
  AlertCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  History,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { PracticeAssessment } from './PracticeAssessment';
import { ClientActivation } from './OnboardingComponents';
import { PrimaryButton, SecondaryButton } from './DesignSystem';

interface PendingClient {
  id: string;
  name: string;
  entityType: string;
  submittedDate: string;
  onboardedBy: string;
  services: string[];
  monthlyValue: number;
  riskRating: 'low' | 'medium' | 'high';
  completedPhases: string[];
  documents: string[];
  amlStatus: 'cleared' | 'flagged';
  practiceScore: number;
}

export function ManagerApproval() {
  const [pendingClients, setPendingClients] = useState<PendingClient[]>([
    {
      id: 'pending-001',
      name: 'Tech Solutions Pty Ltd',
      entityType: 'Company',
      submittedDate: '2024-02-20T14:30:00Z',
      onboardedBy: 'Sarah Johnson',
      services: ['Tax Compliance', 'BAS', 'Advisory'],
      monthlyValue: 850,
      riskRating: 'low',
      completedPhases: ['Structure', 'Services', 'Engagement', 'Payment', 'CDD', 'Review', 'Practice Assessment', 'Activation'],
      documents: ['Engagement Letter (Signed)', 'ID Verification (Complete)', 'AML Check (Cleared)', 'Payment Setup (Active)'],
      amlStatus: 'cleared',
      practiceScore: 87
    },
    {
      id: 'pending-002',
      name: 'Wilson Family Trust',
      entityType: 'Trust',
      submittedDate: '2024-02-20T10:15:00Z',
      onboardedBy: 'Michael Chen',
      services: ['Trust Tax Return', 'Compliance'],
      monthlyValue: 350,
      riskRating: 'low',
      completedPhases: ['Structure', 'Services', 'Engagement', 'Payment', 'CDD', 'Review', 'Practice Assessment', 'Activation'],
      documents: ['Engagement Letter (Signed)', 'Trust Deed (Verified)', 'AML Check (Cleared)', 'Payment Setup (Active)'],
      amlStatus: 'cleared',
      practiceScore: 92
    },
    {
      id: 'pending-003',
      name: 'Global Imports Pty Ltd',
      entityType: 'Company',
      submittedDate: '2024-02-19T16:45:00Z',
      onboardedBy: 'Sarah Johnson',
      services: ['Tax Compliance', 'BAS', 'Bookkeeping', 'CFO Advisory'],
      monthlyValue: 1450,
      riskRating: 'medium',
      completedPhases: ['Structure', 'Services', 'Engagement', 'Payment', 'CDD', 'Review', 'Practice Assessment', 'Activation'],
      documents: ['Engagement Letter (Signed)', 'ID Verification (Complete)', 'AML Check (Flagged - Review Required)', 'Payment Setup (Active)'],
      amlStatus: 'flagged',
      practiceScore: 78
    }
  ]);

  const [selectedClient, setSelectedClient] = useState<PendingClient | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showClientFileModal, setShowClientFileModal] = useState(false);
  const [showReviewWorkflow, setShowReviewWorkflow] = useState(false);
  const [reviewStep, setReviewStep] = useState<'practice-assessment' | 'activation'>('practice-assessment');
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  const handleApprove = (client: PendingClient) => {
    setSelectedClient(client);
    setApprovalAction('approve');
    setShowApprovalModal(true);
  };

  const handleReject = (client: PendingClient) => {
    setSelectedClient(client);
    setApprovalAction('reject');
    setShowApprovalModal(true);
  };

  const confirmApproval = () => {
    if (!selectedClient) return;

    setPendingClients(clients => clients.filter(c => c.id !== selectedClient.id));
    
    if (approvalAction === 'approve') {
      toast.success(`✓ ${selectedClient.name} has been approved and activated`);
    } else {
      toast.error(`${selectedClient.name} has been rejected. Notification sent to onboarding team.`);
    }

    setShowApprovalModal(false);
    setSelectedClient(null);
    setApprovalAction(null);
    setApprovalNotes('');
  };

  const getRiskBadge = (risk: string) => {
    const config = {
      low: { bg: 'bg-green-100', text: 'text-green-700', label: 'Low Risk' },
      medium: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Medium Risk' },
      high: { bg: 'bg-red-100', text: 'text-red-700', label: 'High Risk' }
    };
    const { bg, text, label } = config[risk as keyof typeof config];
    return <span className={`px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>{label}</span>;
  };

  const getAMLBadge = (status: string) => {
    if (status === 'cleared') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3" />
          AML Cleared
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
        <AlertCircle className="w-3 h-3" />
        AML Flagged
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manager Approval</h2>
          <p className="text-gray-600">Review and approve clients who have completed onboarding</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg font-semibold">
            {pendingClients.length} Pending Approval
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Awaiting Review</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendingClients.length}</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Value</span>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${pendingClients.reduce((sum, c) => sum + c.monthlyValue, 0).toLocaleString()}/mo
          </p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">AML Cleared</span>
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {pendingClients.filter(c => c.amlStatus === 'cleared').length}
          </p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Avg Score</span>
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(pendingClients.reduce((sum, c) => sum + c.practiceScore, 0) / pendingClients.length)}%
          </p>
        </div>
      </div>

      {/* Pending Clients List */}
      {pendingClients.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No clients pending approval at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingClients.map((client) => (
            <div key={client.id} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
                      {getRiskBadge(client.riskRating)}
                      {getAMLBadge(client.amlStatus)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {client.entityType}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Onboarded by {client.onboardedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(client.submittedDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${client.monthlyValue}/month
                      </span>
                    </div>

                    {/* Services */}
                    <div className="mb-3">
                      <p className="text-xs font-bold text-gray-700 uppercase mb-2">Services</p>
                      <div className="flex flex-wrap gap-2">
                        {client.services.map((service, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Completion Status */}
                    <div className="mb-3">
                      <p className="text-xs font-bold text-gray-700 uppercase mb-2">Onboarding Progress</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <span className="text-sm font-bold text-green-600">
                          {client.completedPhases.length}/8 Complete
                        </span>
                      </div>
                    </div>

                    {/* Practice Assessment Score */}
                    <div className="mb-3">
                      <p className="text-xs font-bold text-gray-700 uppercase mb-2">Practice Assessment Score</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              client.practiceScore >= 80 ? 'bg-green-600' :
                              client.practiceScore >= 60 ? 'bg-amber-600' :
                              'bg-red-600'
                            }`} 
                            style={{ width: `${client.practiceScore}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-bold ${
                          client.practiceScore >= 80 ? 'text-green-600' :
                          client.practiceScore >= 60 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {client.practiceScore}%
                        </span>
                      </div>
                    </div>

                    {/* Documents */}
                    <div>
                      <p className="text-xs font-bold text-gray-700 uppercase mb-2">Documentation</p>
                      <div className="grid grid-cols-2 gap-2">
                        {client.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                            {doc}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AML Warning if flagged */}
              {client.amlStatus === 'flagged' && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-900 mb-1">AML/CTF Review Required</p>
                      <p className="text-sm text-red-700">
                        This client has been flagged during AML screening. Please review the compliance report before approval.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedClient(client);
                    setReviewStep('practice-assessment');
                    setShowReviewWorkflow(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <Eye className="w-5 h-5" />
                  Begin Review & Approval
                </button>
                <button
                  onClick={() => handleReject(client)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  <ThumbsDown className="w-5 h-5" />
                  Reject
                </button>
                <button
                  onClick={() => {
                    setSelectedClient(client);
                    setShowClientFileModal(true);
                    toast.info('Opening full client file...');
                  }}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                {approvalAction === 'approve' ? (
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <ThumbsUp className="w-6 h-6 text-green-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <ThumbsDown className="w-6 h-6 text-red-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {approvalAction === 'approve' ? 'Approve Client' : 'Reject Client'}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedClient.name}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {approvalAction === 'approve' ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-900 font-semibold mb-2">
                      ✓ This will activate the client and:
                    </p>
                    <ul className="text-sm text-green-800 space-y-1 ml-4">
                      <li>• Grant full system access</li>
                      <li>• Activate client portal</li>
                      <li>• Begin recurring billing (${selectedClient.monthlyValue}/month)</li>
                      <li>• Notify onboarding team of approval</li>
                      <li>• Send welcome email to client</li>
                    </ul>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Approval Notes (Optional)
                    </label>
                    <textarea
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                      rows={4}
                      placeholder="Add any notes about this approval..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-900 font-semibold mb-2">
                      ⚠️ This will reject the client and:
                    </p>
                    <ul className="text-sm text-red-800 space-y-1 ml-4">
                      <li>• Return client to onboarding team</li>
                      <li>• Suspend billing setup</li>
                      <li>• Notify onboarding team of rejection</li>
                      <li>• Allow re-submission after corrections</li>
                    </ul>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reason for Rejection *
                    </label>
                    <textarea
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                      rows={4}
                      placeholder="Explain why this client is being rejected (required)..."
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={confirmApproval}
                  disabled={approvalAction === 'reject' && !approvalNotes.trim()}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    approvalAction === 'approve'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {approvalAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                </button>
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedClient(null);
                    setApprovalAction(null);
                    setApprovalNotes('');
                  }}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Client File Modal */}
      {showClientFileModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Client File: {selectedClient.name}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedClient.entityType}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-900 font-semibold mb-2">
                    Client Details:
                  </p>
                  <ul className="text-sm text-gray-800 space-y-1 ml-4">
                    <li>• Onboarded by: {selectedClient.onboardedBy}</li>
                    <li>• Submitted on: {new Date(selectedClient.submittedDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</li>
                    <li>• Monthly Value: ${selectedClient.monthlyValue}/month</li>
                    <li>• Risk Rating: {selectedClient.riskRating}</li>
                    <li>• AML Status: {selectedClient.amlStatus}</li>
                    <li>• Practice Score: {selectedClient.practiceScore}%</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Services Provided
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.services.map((service, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Onboarding Progress
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {selectedClient.completedPhases.length}/8 Complete
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Documentation
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedClient.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowClientFileModal(false);
                    setSelectedClient(null);
                  }}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Workflow Modal - Full Screen */}
      {showReviewWorkflow && selectedClient && (
        <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
          <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        setShowReviewWorkflow(false);
                        setSelectedClient(null);
                        setReviewStep('practice-assessment');
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Manager Review: {selectedClient.name}
                      </h1>
                      <p className="text-gray-600">Complete practice assessment and activate client</p>
                    </div>
                  </div>
                  {getRiskBadge(selectedClient.riskRating)}
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    reviewStep === 'practice-assessment' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      reviewStep === 'practice-assessment' ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      <span className="text-white font-bold">1</span>
                    </div>
                    <span className={`font-semibold ${
                      reviewStep === 'practice-assessment' ? 'text-blue-900' : 'text-green-900'
                    }`}>
                      Practice Assessment
                    </span>
                  </div>

                  <ArrowRight className="w-5 h-5 text-gray-400" />

                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    reviewStep === 'activation' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      reviewStep === 'activation' ? 'bg-blue-600' : 'bg-gray-400'
                    }`}>
                      <span className="text-white font-bold">2</span>
                    </div>
                    <span className={`font-semibold ${
                      reviewStep === 'activation' ? 'text-blue-900' : 'text-gray-600'
                    }`}>
                      Client Activation
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              {reviewStep === 'practice-assessment' ? (
                <PracticeAssessment
                  entities={[]}
                  onBack={() => {
                    setShowReviewWorkflow(false);
                    setSelectedClient(null);
                  }}
                  onContinue={() => {
                    toast.success('✓ Practice assessment complete - Proceeding to activation');
                    setTimeout(() => setReviewStep('activation'), 800);
                  }}
                  canProgress={true}
                />
              ) : (
                <ClientActivation
                  entities={[]}
                  onComplete={() => {
                    setPendingClients(clients => clients.filter(c => c.id !== selectedClient.id));
                    toast.success(`✓ ${selectedClient.name} has been successfully activated!`);
                    setShowReviewWorkflow(false);
                    setSelectedClient(null);
                    setReviewStep('practice-assessment');
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
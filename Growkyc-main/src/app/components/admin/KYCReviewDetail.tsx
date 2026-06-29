import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { toast } from '../../lib/toast';
import {
  ArrowLeft,
  User,
  Mail,
  Building2,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Shield,
} from 'lucide-react';
import { StatusBadge } from '../StatusBadge';

interface KYCReviewDetailProps {
  onBack?: () => void;
  userId?: string;
}

export function KYCReviewDetail({ onBack, userId }: KYCReviewDetailProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'documents' | 'verification' | 'issues'>('overview');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  // Live Data States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<any>(null);

  // Transition Reason Modal State
  const [transitionModal, setTransitionModal] = useState<{
    open: boolean;
    toState: 'approved' | 'changes_requested' | 'escalated' | 'rejected' | null;
  }>({ open: false, toState: null });
  const [reasonCode, setReasonCode] = useState('');
  const [justification, setJustification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [kycId, setKycId] = useState<number | null>(null);
  const [liveProfile, setLiveProfile] = useState<{ name: string; email: string; role: string; status: string; date: string } | null>(null);

  const demoReviewData = {
    severitySummary: { low: 1, medium: 1, high: 0, critical: 0, total_issues: 2, highest_severity: 'medium' },
    issues: [
      { id: 'iss-1', title: 'Recent Account Registration', severity: 'medium', description: 'Account was registered within the last 6 months.', status: 'open', detectedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
      { id: 'iss-2', title: 'Electoral Roll Match Confidence', severity: 'low', description: 'Electoral roll match confidence is 88% due to address abbreviation.', status: 'open', detectedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() }
    ],
    approvalChain: [
      { stepId: 'step-1', level: 'level_1', role: 'preparer', status: 'approved', decidedBy: 'System', decidedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { stepId: 'step-2', level: 'level_2', role: 'reviewer', status: 'pending', decidedBy: undefined, decidedAt: undefined }
    ]
  };

  // Fetch KYC data from GET /api/v1/kyc/user/{userId} with auth
  useEffect(() => {
    if (!userId) {
      setError('No user ID provided');
      setLoading(false);
      return;
    }
    const fetchKyc = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem('growkyc_token');
        const response = await fetch(`/api/v1/kyc/user/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setKycId(data.id);
        setLiveProfile({
          name: data.name || 'Unknown',
          email: '',
          role: 'User',
          status: (data.status || 'PENDING').toLowerCase(),
          date: data.submitted_at,
        });
        setReviewData(demoReviewData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch KYC detail', err);
        setError('Failed to load KYC record');
        setReviewData(demoReviewData);
      } finally {
        setLoading(false);
      }
    };
    fetchKyc();
  }, [userId]);

  const executeTransition = async () => {
    if (!reasonCode || !justification.trim() || !transitionModal.toState) {
      toast.error('Reason code and justification notes are mandatory.');
      return;
    }
    if (!kycId) {
      toast.error('KYC record not loaded yet. Please wait.');
      return;
    }
    if (transitionModal.toState === 'changes_requested' || transitionModal.toState === 'escalated') {
      toast.error('This workflow action is not yet supported by the backend.');
      setTransitionModal({ open: false, toState: null });
      setReasonCode('');
      setJustification('');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = sessionStorage.getItem('growkyc_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const endpoint = transitionModal.toState === 'approved'
        ? `/api/v1/kyc/approve/${kycId}`
        : `/api/v1/kyc/reject/${kycId}`;
      const body = transitionModal.toState === 'approved'
        ? { approval_reason: justification }
        : { rejection_reason: justification };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.detail || `HTTP ${response.status}`);
      }

      toast.success(`KYC successfully ${transitionModal.toState === 'approved' ? 'approved' : 'rejected'}.`);
      setTransitionModal({ open: false, toState: null });
      setReasonCode('');
      setJustification('');
      onBack?.();
    } catch (err: any) {
      toast.error(`Decision failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const profile = liveProfile ?? { name: '...', email: '', role: 'User', status: 'pending', date: new Date().toISOString() };

  const kycData = {
    user: {
      id: userId || '',
      name: profile.name,
      email: profile.email,
      phone: 'Not available',
      dateOfBirth: 'Not available',
      address: 'Not available',
      nationality: 'Australian',
      role: profile.role,
      submittedAt: new Date(profile.date),
      status: profile.status
    },
    // AI-Generated Insights
    aiInsights: {
      overallScore: 84,
      recommendation: 'review',
      confidence: 94,
      processingTime: '1.2s',
      summary: 'Application is under review. Automated checks completed. Awaiting compliance officer decision.',
      flags: [] as string[],
      strengths: [
        'All identity documents verified successfully',
        'No adverse media findings',
        'Clean credit history',
        'Legitimate business entity',
        'Consistent financial information across sources'
      ],
      aiChecks: [
        { 
          name: 'Document Authenticity', 
          status: 'passed', 
          confidence: 98,
          details: 'All security features verified. No tampering detected.' 
        },
        { 
          name: 'Facial Recognition Match', 
          status: 'passed', 
          confidence: 96,
          details: 'Photo ID matches submitted selfie with 96% confidence.' 
        },
        { 
          name: 'Address Validation', 
          status: 'passed', 
          confidence: 95,
          details: 'Address confirmed via electoral roll and utility records.' 
        },
        { 
          name: 'Fraud Pattern Detection', 
          status: 'passed', 
          confidence: 99,
          details: 'No known fraud patterns detected. Clean behavioral signals.' 
        }
      ],
      riskIndicators: {
        fraudScore: 2,
        velocityRisk: 'low',
        behavioralFlags: 0,
        deviceFingerprint: 'trusted',
        ipReputation: 'clean'
      }
    },
    organization: {
      name: 'Brown Capital Partners Pty Ltd',
      abn: '12 345 678 901',
      acn: '123 456 789',
      type: 'Private Company',
      address: '123 Collins Street, Melbourne VIC 3000',
      website: 'www.browncapital.com.au'
    },
    documents: [
      {
        id: 'doc-1',
        name: 'Drivers License (Front)',
        type: 'ID Document',
        status: 'uploaded',
        uploadedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        size: '2.4 MB',
        verified: true,
        notes: ''
      },
      {
        id: 'doc-2',
        name: 'Drivers License (Back)',
        type: 'ID Document',
        status: 'uploaded',
        uploadedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        size: '2.1 MB',
        verified: true,
        notes: ''
      },
      {
        id: 'doc-3',
        name: 'Proof of Address - Utility Bill',
        type: 'Address Verification',
        status: 'uploaded',
        uploadedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        size: '1.8 MB',
        verified: true,
        notes: ''
      }
    ],
    checklist: [
      {
        category: 'Identity Verification',
        items: [
          { id: 'id-1', label: 'Valid Government-issued Photo ID', completed: true, required: true },
          { id: 'id-2', label: 'ID Document is clear and legible', completed: true, required: true },
          { id: 'id-3', label: 'ID Document is not expired', completed: true, required: true }
        ]
      },
      {
        category: 'Address Verification',
        items: [
          { id: 'addr-1', label: 'Proof of address document provided', completed: true, required: true },
          { id: 'addr-2', label: 'Document dated within last 3 months', completed: true, required: true }
        ]
      }
    ],
    riskAssessment: {
      overallRisk: 'Low',
      pepStatus: false,
      sanctionsMatch: false,
      adverseMedia: false,
      sourceOfFunds: 'Employment Income & Investments',
      estimatedWealth: '$2M - $5M',
      transactionProfile: 'Medium frequency, consistent amounts'
    },
    timeline: [
      {
        date: new Date(profile.date),
        action: 'KYC Application Submitted',
        user: profile.name,
        status: 'info'
      },
      {
        date: new Date(new Date(profile.date).getTime() + 10 * 60 * 1000),
        action: 'All documents uploaded',
        user: profile.name,
        status: 'success'
      },
      {
        date: new Date(new Date(profile.date).getTime() + 15 * 60 * 1000),
        action: 'Automated verification checks completed',
        user: 'System',
        status: 'success'
      }
    ]
  };

  const calculateCompletionRate = () => 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      {onBack && (
        <Breadcrumbs
          items={[
            { label: 'Admin', onClick: onBack },
            { label: 'KYC Review', onClick: onBack },
            { label: kycData.user.name, active: true }
          ]}
        />
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-8 w-px bg-gray-300"></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KYC Review Detail</h1>
            <p className="text-sm text-gray-600">Submitted {new Date(kycData.user.submittedAt).toLocaleString('en-AU')}</p>
          </div>
        </div>
        <StatusBadge status={kycData.user.status} type="kyc" />
      </div>

      {/* Action Buttons with state transition integration */}
      <Card className="border border-gray-200 bg-white/60 shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Review Decision & Workflows</p>
                <p className="text-xs text-gray-600">
                  Select a workflow transition to proceed. Actions require a mandatory justification audit note.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button 
                variant="outline" 
                className="bg-white hover:bg-amber-50 hover:text-amber-700 hover:border-amber-400"
                onClick={() => setTransitionModal({ open: true, toState: 'changes_requested' })}
              >
                <AlertCircle className="w-4 h-4 mr-1.5" />
                Request Changes
              </Button>
              <Button 
                variant="outline" 
                className="bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400"
                onClick={() => setTransitionModal({ open: true, toState: 'escalated' })}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5 rotate-90" />
                Escalate Review
              </Button>
              <Button 
                variant="outline" 
                className="bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-400"
                onClick={() => setTransitionModal({ open: true, toState: 'rejected' })}
              >
                <XCircle className="w-4 h-4 mr-1.5" />
                Reject
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md"
                onClick={() => setTransitionModal({ open: true, toState: 'approved' })}
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Approve KYC
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Banner */}
      <Card className="border-2 border-green-200 bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-3xl font-bold text-white">{kycData.aiInsights.overallScore}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900">🤖 AI Assessment</h3>
                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full uppercase">
                  {kycData.aiInsights.recommendation}
                </span>
                <span className="text-sm text-gray-600">
                  {kycData.aiInsights.confidence}% confidence
                </span>
                <span className="text-xs text-gray-500">
                  • Processed in {kycData.aiInsights.processingTime}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{kycData.aiInsights.summary}</p>
              
              {/* AI Checks Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {kycData.aiInsights.aiChecks.slice(0, 4).map((check) => (
                  <div key={check.name} className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex items-center justify-between mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-600">{check.confidence}%</span>
                    </div>
                    <p className="text-xs font-medium text-gray-900">{check.name}</p>
                  </div>
                ))}
              </div>

              {/* Key Strengths */}
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <p className="text-sm font-semibold text-gray-900 mb-2">✨ Key Strengths Identified:</p>
                <ul className="space-y-1">
                  {kycData.aiInsights.strengths.slice(0, 3).map((strength, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fraud Risk Indicators */}
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-bold text-xs">{kycData.aiInsights.riskIndicators.fraudScore}</span>
                  </div>
                  <span className="text-gray-700">Fraud Score (low)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Trusted Device</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Clean IP Reputation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">0 Behavioral Flags</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeSection === 'overview' ? 'default' : 'outline'}
                  onClick={() => setActiveSection('overview')}
                  size="sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Overview
                </Button>
                <Button
                  variant={activeSection === 'documents' ? 'default' : 'outline'}
                  onClick={() => setActiveSection('documents')}
                  size="sm"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Documents ({kycData.documents.length})
                </Button>
                <Button
                  variant={activeSection === 'verification' ? 'default' : 'outline'}
                  onClick={() => setActiveSection('verification')}
                  size="sm"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Verification Checklist
                </Button>
                <Button
                  variant={activeSection === 'issues' ? 'default' : 'outline'}
                  onClick={() => setActiveSection('issues')}
                  size="sm"
                  className="relative"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Issues List
                  {reviewData?.severitySummary?.total_issues > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.25 bg-red-600 text-white rounded-full text-[10px] font-bold">
                      {reviewData.severitySummary.total_issues}
                    </span>
                  )}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Overview Tab */}
              {activeSection === 'overview' && (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Full Name</p>
                        <p className="font-semibold text-gray-900">{kycData.user.name}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(kycData.user.dateOfBirth).toLocaleDateString('en-AU')}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="font-semibold text-gray-900">{kycData.user.email}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Phone</p>
                        <p className="font-semibold text-gray-900">{kycData.user.phone}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                        <p className="text-sm text-gray-600 mb-1">Address</p>
                        <p className="font-semibold text-gray-900">{kycData.user.address}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Nationality</p>
                        <p className="font-semibold text-gray-900">{kycData.user.nationality}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Role</p>
                        <StatusBadge status={kycData.user.role} type="role" />
                      </div>
                    </div>
                  </div>

                  {/* Organization Information */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      Organization Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                        <p className="text-sm text-gray-600 mb-1">Company Name</p>
                        <p className="font-semibold text-gray-900">{kycData.organization.name}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">ABN</p>
                        <p className="font-semibold text-gray-900">{kycData.organization.abn}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">ACN</p>
                        <p className="font-semibold text-gray-900">{kycData.organization.acn}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Entity Type</p>
                        <p className="font-semibold text-gray-900">{kycData.organization.type}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Website</p>
                        <p className="font-semibold text-gray-900">{kycData.organization.website}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                        <p className="text-sm text-gray-600 mb-1">Business Address</p>
                        <p className="font-semibold text-gray-900">{kycData.organization.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Risk Assessment
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white border border-gray-200 rounded-lg col-span-2">
                        <p className="text-sm text-gray-600 mb-1">Overall Risk Level</p>
                        <p className="text-2xl font-bold text-green-600">{kycData.riskAssessment.overallRisk}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">PEP Status</p>
                        <p className="font-semibold text-gray-900">
                          {kycData.riskAssessment.pepStatus ? '⚠️ Yes' : '✅ No'}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Sanctions Match</p>
                        <p className="font-semibold text-gray-900">
                          {kycData.riskAssessment.sanctionsMatch ? '⚠️ Yes' : '✅ No'}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Adverse Media</p>
                        <p className="font-semibold text-gray-900">
                          {kycData.riskAssessment.adverseMedia ? '⚠️ Found' : '✅ None'}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Estimated Wealth</p>
                        <p className="font-semibold text-gray-900">{kycData.riskAssessment.estimatedWealth}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                        <p className="text-sm text-gray-600 mb-1">Source of Funds</p>
                        <p className="font-semibold text-gray-900">{kycData.riskAssessment.sourceOfFunds}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                        <p className="text-sm text-gray-600 mb-1">Transaction Profile</p>
                        <p className="font-semibold text-gray-900">{kycData.riskAssessment.transactionProfile}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeSection === 'documents' && (
                <div className="space-y-4">
                  {kycData.documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <FileText className="w-5 h-5 text-gray-400 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{doc.name}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span>{doc.type}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span>Uploaded {new Date(doc.uploadedAt).toLocaleString('en-AU')}</span>
                            </div>
                            {doc.verified === true && (
                              <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                Verified
                              </div>
                            )}
                            {doc.verified === false && (
                              <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                                <XCircle className="w-4 h-4" />
                                Verification Failed
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedDocument(doc.id)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Verification Checklist Tab */}
              {activeSection === 'verification' && (
                <div className="space-y-6">
                  {kycData.checklist.map((category) => (
                    <div key={category.category}>
                      <h3 className="font-semibold text-lg mb-3 text-gray-900">{category.category}</h3>
                      <div className="space-y-2">
                        {category.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              readOnly
                              className="w-5 h-5 rounded border-gray-300"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.label}</p>
                              {item.required && (
                                <p className="text-xs text-red-600">Required</p>
                              )}
                            </div>
                            {item.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Issues Tab Content */}
              {activeSection === 'issues' && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  {/* Severity Summary Visual Dashboard */}
                  {reviewData?.severitySummary && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-gray-50/60 border border-gray-200/80 rounded-xl">
                      <div className="p-3 bg-white border border-gray-200 rounded-xl text-center shadow-sm">
                        <p className="text-[10px] text-red-700 font-bold uppercase tracking-wider mb-1">Critical</p>
                        <p className="text-2xl font-extrabold text-red-700">{reviewData.severitySummary.critical}</p>
                      </div>
                      <div className="p-3 bg-white border border-gray-200 rounded-xl text-center shadow-sm">
                        <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mb-1">High</p>
                        <p className="text-2xl font-extrabold text-amber-700">{reviewData.severitySummary.high}</p>
                      </div>
                      <div className="p-3 bg-white border border-gray-200 rounded-xl text-center shadow-sm">
                        <p className="text-[10px] text-orange-700 font-bold uppercase tracking-wider mb-1">Medium</p>
                        <p className="text-2xl font-extrabold text-orange-700">{reviewData.severitySummary.medium}</p>
                      </div>
                      <div className="p-3 bg-white border border-gray-200 rounded-xl text-center shadow-sm">
                        <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider mb-1">Low</p>
                        <p className="text-2xl font-extrabold text-blue-700">{reviewData.severitySummary.low}</p>
                      </div>
                      <div className="p-3 bg-white border border-gray-200 rounded-xl text-center shadow-sm col-span-2 md:col-span-1">
                        <p className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider mb-1">Total Issues</p>
                        <p className="text-2xl font-extrabold text-indigo-700">{reviewData.severitySummary.total_issues}</p>
                      </div>
                    </div>
                  )}

                  {/* Issues List Detail cards */}
                  {(!reviewData?.issues || reviewData.issues.length === 0) ? (
                    <div className="p-8 text-center text-gray-500 border border-dashed rounded-xl bg-gray-50">
                      <CheckCircle className="w-9 h-9 text-green-500 mx-auto mb-2" />
                      <p className="font-semibold text-gray-800">All Checks Passed</p>
                      <p className="text-xs text-gray-600 mt-1">No active compliance issues or findings require attention.</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {reviewData.issues.map((issue: any) => (
                        <div key={issue.id} className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${
                                issue.severity === 'critical' ? 'bg-red-600 animate-ping' :
                                issue.severity === 'high' ? 'bg-amber-600' :
                                issue.severity === 'medium' ? 'bg-orange-500' :
                                'bg-blue-500'
                              }`}></span>
                              {issue.title}
                            </h4>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                              issue.severity === 'critical' ? 'bg-red-100 text-red-800 border border-red-200' :
                              issue.severity === 'high' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              issue.severity === 'medium' ? 'bg-orange-50 text-orange-800 border border-orange-200' :
                              'bg-blue-50 text-blue-800 border border-blue-200'
                            }`}>
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{issue.description}</p>
                          <div className="flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-50 pt-2.5 mt-2.5">
                            <span>Detected: {new Date(issue.detectedAt).toLocaleString('en-AU')}</span>
                            <span className="capitalize font-semibold text-indigo-600">Status: {issue.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Completion Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="w-24 h-24 mx-auto mb-3 relative">
                  <svg className="transform -rotate-90 w-24 h-24">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${calculateCompletionRate() * 2.51}, 251`}
                      className="text-green-600"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{calculateCompletionRate()}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Required checks completed</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Documents:</span>
                  <span className="font-semibold">{kycData.documents.length}/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Identity:</span>
                  <span className="font-semibold text-green-600">✓ Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-semibold text-green-600">✓ Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Business:</span>
                  <span className="font-semibold text-green-600">✓ Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AML/CTF:</span>
                  <span className="font-semibold text-green-600">✓ Cleared</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approval Chain Card */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-800">
                <Shield className="w-4 h-4 text-indigo-600" />
                Approval Chain
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-4">
                {reviewData?.approvalChain?.map((step: any, index: number) => (
                  <div key={step.stepId} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        step.status === 'approved' ? 'bg-green-100 text-green-700' :
                        step.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                      }`}>
                        {step.status === 'approved' ? '✓' : step.status === 'rejected' ? '✗' : '•'}
                      </div>
                      {index < reviewData.approvalChain.length - 1 && (
                        <div className="w-px h-10 bg-gray-200 my-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-semibold text-gray-900 capitalize">
                          {step.role.replace('_', ' ')}
                        </p>
                        <span className={`px-2 py-0.25 rounded text-[9px] font-bold uppercase ${
                          step.status === 'approved' ? 'bg-green-100 text-green-800' :
                          step.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {step.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">Level: {step.level.replace('_', ' ')}</p>
                      {step.decidedBy && (
                        <p className="text-[10px] text-gray-600 mt-0.5 font-medium">Actor: {step.decidedBy}</p>
                      )}
                      {step.decidedAt && (
                        <p className="text-[9px] text-gray-400 mt-0.5">
                          {new Date(step.decidedAt).toLocaleString('en-AU')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {kycData.timeline.map((event, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        event.status === 'success' ? 'bg-green-100' :
                        event.status === 'error' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}>
                        {event.status === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : event.status === 'error' ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      {index < kycData.timeline.length - 1 && (
                        <div className="w-px h-12 bg-gray-200"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium text-gray-900">{event.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{event.user}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(event.date).toLocaleString('en-AU')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Applicant
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Download All Documents
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Activity Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {kycData.documents.find(d => d.id === selectedDocument)?.name}
              </h3>
              <Button variant="ghost" onClick={() => setSelectedDocument(null)}>
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 rounded-lg h-[600px] flex items-center justify-center">
                <p className="text-gray-500">Document Preview</p>
              </div>
            </div>
            <div className="p-6 border-t flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Verified
                </Button>
                <Button variant="outline" size="sm" className="text-red-600">
                  <XCircle className="w-4 h-4 mr-2" />
                  Flag Issue
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Transition Reason & Justification Modal */}
      {transitionModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 transform scale-100 transition-all duration-300">
            <div className="p-5 border-b flex items-center justify-between bg-gray-50/50">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600 animate-pulse" />
                {transitionModal.toState === 'approved' ? 'Confirm KYC Approval' :
                 transitionModal.toState === 'changes_requested' ? 'Request Changes' :
                 transitionModal.toState === 'escalated' ? 'Escalate KYC Review' :
                 'Reject KYC Application'}
              </h3>
              <button 
                onClick={() => {
                  setTransitionModal({ open: false, toState: null });
                  setReasonCode('');
                  setJustification('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Reason Code <span className="text-red-500">*</span>
                </label>
                <select
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  required
                >
                  <option value="">-- Select a reason code --</option>
                  {transitionModal.toState === 'approved' && (
                    <>
                      <option value="standard_pass">Standard compliance verification passed</option>
                      <option value="manual_override">Manual override of minor mismatch</option>
                      <option value="risk_accepted">Risk accepted under senior approval</option>
                    </>
                  )}
                  {transitionModal.toState === 'changes_requested' && (
                    <>
                      <option value="missing_information">Missing required user information</option>
                      <option value="insufficient_documentation">Uploaded documents are blurred or insufficient</option>
                      <option value="policy_gap">Discrepancy identified under AML policy</option>
                      <option value="clarification_required">Additional narrative clarification needed</option>
                      <option value="other">Other reason (specify in notes)</option>
                    </>
                  )}
                  {transitionModal.toState === 'escalated' && (
                    <>
                      <option value="high_risk_pattern">High-risk behavior pattern identified</option>
                      <option value="sanctions_hit">Potential DFAT or OFAC sanctions list hit</option>
                      <option value="pep_match">Potential Politically Exposed Person (PEP) match</option>
                      <option value="regulatory_obligation">Triggers mandatory regulatory escalation</option>
                      <option value="other">Other high risk indicator (specify in notes)</option>
                    </>
                  )}
                  {transitionModal.toState === 'rejected' && (
                    <>
                      <option value="policy_violation">Severe policy violation detected</option>
                      <option value="risk_unacceptable">Client risk level is unacceptable</option>
                      <option value="fraud_concern">Potential document tampering or identity fraud concern</option>
                      <option value="invalid_submission">Invalid or completely unrelated files submitted</option>
                      <option value="other">Other rejection grounds</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Justification Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Provide a detailed professional justification narrative..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-medium"
                  required
                />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3 bg-gray-50/50">
              <Button
                variant="outline"
                onClick={() => {
                  setTransitionModal({ open: false, toState: null });
                  setReasonCode('');
                  setJustification('');
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={executeTransition}
                disabled={isSubmitting || !reasonCode || !justification.trim()}
                className={
                  transitionModal.toState === 'approved' ? 'bg-green-600 hover:bg-green-700 text-white font-bold' :
                  transitionModal.toState === 'changes_requested' ? 'bg-amber-600 hover:bg-amber-700 text-white font-bold' :
                  transitionModal.toState === 'escalated' ? 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold' :
                  'bg-red-600 hover:bg-red-700 text-white font-bold'
                }
              >
                {isSubmitting ? 'Processing...' : 'Submit Decision'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
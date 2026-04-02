import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { toast } from '../../lib/toast';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Shield,
  CreditCard,
  Home,
  Briefcase,
  Globe
} from 'lucide-react';
import { StatusBadge } from '../StatusBadge';

interface KYCReviewDetailProps {
  onBack?: () => void;
  userId?: string;
}

export function KYCReviewDetail({ onBack, userId }: KYCReviewDetailProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'documents' | 'verification'>('overview');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  // Mock KYC data
  const kycData = {
    user: {
      id: 'kyc-001',
      name: 'Jennifer Brown',
      email: 'jennifer.brown@example.com',
      phone: '+61 412 345 678',
      dateOfBirth: '1985-03-15',
      address: '123 Collins Street, Melbourne VIC 3000',
      nationality: 'Australian',
      role: 'Investor',
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'pending_review'
    },
    // AI-Generated Insights
    aiInsights: {
      overallScore: 92,
      recommendation: 'approve',
      confidence: 94,
      processingTime: '1.2s',
      summary: 'High-quality application with strong verification signals. All automated checks passed. Low fraud risk. Recommend approval.',
      flags: [],
      strengths: [
        'All identity documents verified successfully',
        'No adverse media findings',
        'Clean credit history',
        'Legitimate business entity with 8+ years operating history',
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
        },
        { 
          name: 'Business Entity Verification', 
          status: 'passed', 
          confidence: 97,
          details: 'ABN/ACN verified. Active business with good standing.' 
        },
        { 
          name: 'Financial Consistency', 
          status: 'passed', 
          confidence: 93,
          details: 'Stated income aligns with bank statements and business revenue.' 
        },
        { 
          name: 'Cross-Reference Check', 
          status: 'passed', 
          confidence: 91,
          details: 'Information consistent across all submitted documents.' 
        }
      ],
      riskIndicators: {
        fraudScore: 2, // out of 100, lower is better
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
        verified: null,
        notes: ''
      },
      {
        id: 'doc-2',
        name: 'Drivers License (Back)',
        type: 'ID Document',
        status: 'uploaded',
        uploadedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        size: '2.1 MB',
        verified: null,
        notes: ''
      },
      {
        id: 'doc-3',
        name: 'Proof of Address - Utility Bill',
        type: 'Address Verification',
        status: 'uploaded',
        uploadedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        size: '1.8 MB',
        verified: null,
        notes: ''
      },
      {
        id: 'doc-4',
        name: 'Bank Statement',
        type: 'Financial Verification',
        status: 'uploaded',
        uploadedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        size: '3.2 MB',
        verified: null,
        notes: ''
      },
      {
        id: 'doc-5',
        name: 'Company Certificate (ABN)',
        type: 'Business Verification',
        status: 'uploaded',
        uploadedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        size: '856 KB',
        verified: null,
        notes: ''
      },
      {
        id: 'doc-6',
        name: 'Source of Funds Declaration',
        type: 'AML/CTF',
        status: 'uploaded',
        uploadedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        size: '1.2 MB',
        verified: null,
        notes: ''
      }
    ],
    checklist: [
      {
        category: 'Identity Verification',
        items: [
          { id: 'id-1', label: 'Valid Government-issued Photo ID', completed: true, required: true },
          { id: 'id-2', label: 'ID Document is clear and legible', completed: true, required: true },
          { id: 'id-3', label: 'ID Document is not expired', completed: true, required: true },
          { id: 'id-4', label: 'Name matches application', completed: true, required: true },
          { id: 'id-5', label: 'Date of birth verified', completed: true, required: true }
        ]
      },
      {
        category: 'Address Verification',
        items: [
          { id: 'addr-1', label: 'Proof of address document provided', completed: true, required: true },
          { id: 'addr-2', label: 'Document dated within last 3 months', completed: true, required: true },
          { id: 'addr-3', label: 'Address matches application', completed: true, required: true },
          { id: 'addr-4', label: 'Document from acceptable source (utility/bank/govt)', completed: true, required: true }
        ]
      },
      {
        category: 'Financial Verification',
        items: [
          { id: 'fin-1', label: 'Bank statement provided', completed: true, required: true },
          { id: 'fin-2', label: 'Statement shows sufficient funds', completed: true, required: true },
          { id: 'fin-3', label: 'Source of funds declared', completed: true, required: true },
          { id: 'fin-4', label: 'No suspicious transaction patterns', completed: true, required: false }
        ]
      },
      {
        category: 'Business Verification (for Entities)',
        items: [
          { id: 'bus-1', label: 'ABN/ACN provided and verified', completed: true, required: true },
          { id: 'bus-2', label: 'Company registration certificate provided', completed: true, required: true },
          { id: 'bus-3', label: 'Authorized signatory verified', completed: true, required: true },
          { id: 'bus-4', label: 'Business address verified', completed: true, required: true }
        ]
      },
      {
        category: 'AML/CTF Compliance',
        items: [
          { id: 'aml-1', label: 'PEP (Politically Exposed Person) check completed', completed: true, required: true },
          { id: 'aml-2', label: 'Sanctions list screening completed', completed: true, required: true },
          { id: 'aml-3', label: 'Source of wealth verified', completed: true, required: true },
          { id: 'aml-4', label: 'Enhanced due diligence (if required)', completed: false, required: false },
          { id: 'aml-5', label: 'Risk assessment completed', completed: true, required: true }
        ]
      },
      {
        category: 'Platform-Specific Requirements',
        items: [
          { id: 'plat-1', label: 'Investment experience questionnaire completed', completed: true, required: true },
          { id: 'plat-2', label: 'Risk acknowledgment signed', completed: true, required: true },
          { id: 'plat-3', label: 'Terms and conditions accepted', completed: true, required: true },
          { id: 'plat-4', label: 'Sophisticated investor declaration (if applicable)', completed: true, required: false }
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
        date: new Date(Date.now() - 3 * 60 * 60 * 1000),
        action: 'KYC Application Submitted',
        user: 'Jennifer Brown',
        status: 'info'
      },
      {
        date: new Date(Date.now() - 3 * 60 * 60 * 1000),
        action: 'All documents uploaded',
        user: 'Jennifer Brown',
        status: 'success'
      },
      {
        date: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        action: 'Automated verification checks passed',
        user: 'System',
        status: 'success'
      },
      {
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        action: 'Assigned for manual review',
        user: 'System',
        status: 'info'
      }
    ]
  };

  const handleApprove = () => {
    toast.success('KYC Approved! User will be notified and granted full platform access.');
    onBack?.();
  };

  const handleReject = () => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      toast.error(`KYC Rejected. Reason: ${reason}\nUser will be notified and can resubmit.`);
      onBack?.();
    }
  };

  const handleRequestMoreInfo = () => {
    const details = prompt('What additional information do you need?');
    if (details) {
      toast.info(`Request sent to user: ${details}`);
    }
  };

  const calculateCompletionRate = () => {
    const allItems = kycData.checklist.flatMap(c => c.items);
    const requiredItems = allItems.filter(i => i.required);
    const completedRequired = requiredItems.filter(i => i.completed);
    return Math.round((completedRequired.length / requiredItems.length) * 100);
  };

  return (
    <div className="space-y-6">
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
            <h1 className="text-2xl font-bold text-gray-900">KYC Review</h1>
            <p className="text-sm text-gray-600">Submitted {new Date(kycData.user.submittedAt).toLocaleString('en-AU')}</p>
          </div>
        </div>
        <StatusBadge status={kycData.user.status} type="kyc" />
      </div>

      {/* Action Buttons */}
      <Card className="border-2 border-indigo-200 bg-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Ready for Decision</p>
                <p className="text-sm text-gray-600">
                  {calculateCompletionRate()}% of required checks completed
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleRequestMoreInfo}>
                <AlertCircle className="w-4 h-4 mr-2" />
                Request More Info
              </Button>
              <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={handleReject}>
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve KYC
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Banner */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
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
              <div className="flex gap-2">
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
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg col-span-2">
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
    </div>
  );
}
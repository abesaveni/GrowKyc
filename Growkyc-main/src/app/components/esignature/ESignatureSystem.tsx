import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  FileSignature,
  Upload,
  Users,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  Send,
  Plus,
  Search,
  Filter,
  Settings,
  FileText,
  Lock,
  Smartphone,
  Mail,
  Calendar,
  BarChart3,
  ArrowLeft,
  X,
  Edit,
  Trash2,
  Copy,
  History,
  UserCheck,
  MessageSquare,
  Paperclip,
  AlertTriangle,
  CheckSquare,
  FileCheck,
  Key,
  Fingerprint,
  Video
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { toast } from '../../lib/toast';

interface ESignatureSystemProps {
  onBack?: () => void;
}

export function ESignatureSystem({ onBack }: ESignatureSystemProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'templates' | 'audit' | 'compliance' | 'settings'>('overview');
  const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);
  const [showSigningModal, setShowSigningModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for signature requests
  const signatureRequests = [
    {
      id: 'SR-2024-001',
      documentName: 'Loan Agreement - Case #MIP-2024-001',
      status: 'pending',
      parties: [
        { name: 'John Smith', role: 'Borrower', status: 'signed', signedAt: '2024-02-20 14:23', ip: '203.45.67.89', verified: true },
        { name: 'Sarah Johnson', role: 'Lender', status: 'pending', email: 'sarah@lender.com' },
        { name: 'Michael Brown', role: 'Guarantor', status: 'awaiting', email: 'michael@email.com' }
      ],
      createdAt: '2024-02-20',
      expiresAt: '2024-03-05',
      complianceLevel: 'Bank Level',
      auditTrail: true,
      identityVerification: 'SMS + Email',
      documentHash: 'sha256:a3f4b2c1...'
    },
    {
      id: 'SR-2024-002',
      documentName: 'Security Agreement - Property Settlement',
      status: 'completed',
      parties: [
        { name: 'David Lee', role: 'Vendor', status: 'signed', signedAt: '2024-02-19 09:15', ip: '192.168.1.100', verified: true },
        { name: 'Emma Wilson', role: 'Purchaser', status: 'signed', signedAt: '2024-02-19 10:42', ip: '203.12.34.56', verified: true },
        { name: 'Robert Taylor', role: 'Solicitor', status: 'signed', signedAt: '2024-02-19 11:05', ip: '203.78.90.12', verified: true }
      ],
      createdAt: '2024-02-18',
      completedAt: '2024-02-19',
      complianceLevel: 'Bank Level',
      auditTrail: true,
      identityVerification: 'SMS + Email + ID Verification',
      documentHash: 'sha256:d7e9f3a2...'
    },
    {
      id: 'SR-2024-003',
      documentName: 'Mortgage Discharge Authority',
      status: 'in_progress',
      parties: [
        { name: 'Lisa Anderson', role: 'Mortgagor', status: 'signed', signedAt: '2024-02-21 16:30', ip: '203.56.78.90', verified: true },
        { name: 'James Martin', role: 'Mortgagee', status: 'pending', email: 'james@bank.com' }
      ],
      createdAt: '2024-02-21',
      expiresAt: '2024-03-07',
      complianceLevel: 'Bank Level',
      auditTrail: true,
      identityVerification: 'SMS + Email + Biometric',
      documentHash: 'sha256:c2b5e7f1...'
    },
    {
      id: 'SR-2024-004',
      documentName: 'KYC Certification Form',
      status: 'declined',
      parties: [
        { name: 'Peter Wilson', role: 'Client', status: 'declined', declinedAt: '2024-02-20 13:45', reason: 'Terms not acceptable' }
      ],
      createdAt: '2024-02-20',
      complianceLevel: 'Bank Level',
      auditTrail: true,
      identityVerification: 'SMS + Email',
      documentHash: 'sha256:f1d8c4a3...'
    }
  ];

  // Mock data for templates
  const signatureTemplates = [
    {
      id: 'TPL-001',
      name: 'Standard Loan Agreement',
      category: 'Lending',
      parties: ['Borrower', 'Lender', 'Guarantor'],
      fields: 12,
      usageCount: 247,
      complianceLevel: 'Bank Level',
      lastModified: '2024-01-15'
    },
    {
      id: 'TPL-002',
      name: 'Property Purchase Contract',
      category: 'Real Estate',
      parties: ['Vendor', 'Purchaser', 'Solicitor'],
      fields: 18,
      usageCount: 156,
      complianceLevel: 'Bank Level',
      lastModified: '2024-01-20'
    },
    {
      id: 'TPL-003',
      name: 'Mortgage Discharge Form',
      category: 'Lending',
      parties: ['Mortgagor', 'Mortgagee'],
      fields: 8,
      usageCount: 89,
      complianceLevel: 'Bank Level',
      lastModified: '2024-02-01'
    },
    {
      id: 'TPL-004',
      name: 'KYC/AML Certification',
      category: 'Compliance',
      parties: ['Client', 'Verifier'],
      fields: 15,
      usageCount: 523,
      complianceLevel: 'Bank Level',
      lastModified: '2024-02-10'
    }
  ];

  // Compliance requirements
  const complianceChecks = [
    { id: 1, name: 'Identity Verification', status: 'enabled', description: 'SMS, Email, and ID verification required' },
    { id: 2, name: 'Audit Trail', status: 'enabled', description: 'Complete audit log of all actions' },
    { id: 3, name: 'Document Hash', status: 'enabled', description: 'SHA-256 hash for document integrity' },
    { id: 4, name: 'IP Address Logging', status: 'enabled', description: 'Record IP address for each signature' },
    { id: 5, name: 'Timestamp Authority', status: 'enabled', description: 'RFC 3161 compliant timestamps' },
    { id: 6, name: 'Tamper Detection', status: 'enabled', description: 'Detect any document modifications' },
    { id: 7, name: 'Long-term Validation', status: 'enabled', description: 'Signatures valid for 10+ years' },
    { id: 8, name: 'eIDAS Compliance', status: 'enabled', description: 'EU electronic identification standard' },
    { id: 9, name: 'ESIGN Act', status: 'enabled', description: 'US federal e-signature law compliance' },
    { id: 10, name: 'Banking Standards', status: 'enabled', description: 'APRA and ASIC compliant' }
  ];

  const handleNewDocument = () => {
    setShowNewDocumentModal(true);
  };

  const handleSignDocument = (doc: any) => {
    setSelectedDocument(doc);
    setShowSigningModal(true);
  };

  const handleViewAudit = (doc: any) => {
    setSelectedDocument(doc);
    setShowAuditModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'declined': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Requests</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                <p className="text-xs text-orange-600 mt-1">2 expiring soon</p>
              </div>
              <Clock className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">247</p>
                <p className="text-xs text-green-600 mt-1">↑ 18% this month</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">1.5d</p>
                <p className="text-xs text-green-600 mt-1">↓ 20% faster</p>
              </div>
              <BarChart3 className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">100%</p>
                <p className="text-xs text-green-600 mt-1">Bank Level</p>
              </div>
              <Shield className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Signature Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Signature Requests</CardTitle>
              <CardDescription>Documents awaiting or recently completed signatures</CardDescription>
            </div>
            <Button onClick={handleNewDocument}>
              <Plus className="w-4 h-4 mr-2" />
              New Signature Request
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {signatureRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileSignature className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{request.documentName}</h3>
                      <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                        {getStatusIcon(request.status)}
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Created {request.createdAt}
                      </span>
                      {request.expiresAt && (
                        <span className="flex items-center gap-1 text-orange-600">
                          <Clock className="w-4 h-4" />
                          Expires {request.expiresAt}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-purple-600" />
                        {request.complianceLevel}
                      </span>
                      <span className="flex items-center gap-1">
                        <Key className="w-4 h-4 text-green-600" />
                        {request.identityVerification}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewAudit(request)}>
                      <History className="w-4 h-4 mr-2" />
                      Audit Trail
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    {request.status === 'pending' && (
                      <Button size="sm" onClick={() => handleSignDocument(request)}>
                        <FileSignature className="w-4 h-4 mr-2" />
                        Sign
                      </Button>
                    )}
                  </div>
                </div>

                {/* Parties */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Signing Parties:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {request.parties.map((party, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border ${
                        party.status === 'signed' ? 'bg-green-50 border-green-200' :
                        party.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                        party.status === 'declined' ? 'bg-red-50 border-red-200' :
                        'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{party.name}</p>
                            <p className="text-xs text-gray-600">{party.role}</p>
                            {party.email && (
                              <p className="text-xs text-gray-500 mt-1">{party.email}</p>
                            )}
                            {party.signedAt && (
                              <div className="mt-2 space-y-1">
                                <p className="text-xs text-gray-600">Signed: {party.signedAt}</p>
                                <p className="text-xs text-gray-500">IP: {party.ip}</p>
                                {party.verified && (
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                                    <UserCheck className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            )}
                            {party.status === 'declined' && party.reason && (
                              <p className="text-xs text-red-600 mt-2">Reason: {party.reason}</p>
                            )}
                          </div>
                          {party.status === 'signed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                          {party.status === 'pending' && <Clock className="w-5 h-5 text-yellow-600" />}
                          {party.status === 'declined' && <X className="w-5 h-5 text-red-600" />}
                          {party.status === 'awaiting' && <AlertCircle className="w-5 h-5 text-gray-400" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Document Hash */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Lock className="w-3 h-3" />
                    <span className="font-medium">Document Hash:</span>
                    <code className="font-mono">{request.documentHash}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Signature Documents</CardTitle>
              <CardDescription>All documents sent for signature</CardDescription>
            </div>
            <Button onClick={handleNewDocument}>
              <Plus className="w-4 h-4 mr-2" />
              New Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {['all', 'pending', 'in_progress', 'completed', 'declined'].map((status) => (
              <button
                key={status}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300"
              >
                {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                <span className="ml-2 text-xs text-gray-400">
                  ({signatureRequests.filter(r => status === 'all' || r.status === status).length})
                </span>
              </button>
            ))}
          </div>

          {/* Documents List */}
          <div className="space-y-3">
            {signatureRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4 flex-1">
                  <FileCheck className="w-10 h-10 text-blue-600" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{request.documentName}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>{request.id}</span>
                      <span>•</span>
                      <span>{request.parties.length} parties</span>
                      <span>•</span>
                      <span>Created {request.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewAudit(request)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Signature Templates</CardTitle>
              <CardDescription>Pre-configured templates for common documents</CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {signatureTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <Badge variant="outline" className="mt-1">{template.category}</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Parties:</span>
                      <span className="font-medium text-gray-900">{template.parties.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.parties.map((party, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {party}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Form Fields:</span>
                      <span className="font-medium text-gray-900">{template.fields}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Usage Count:</span>
                      <span className="font-medium text-gray-900">{template.usageCount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-600 font-medium">{template.complianceLevel}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Modified {template.lastModified}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => {
                      toast.success('Creating document from template...');
                      setShowNewDocumentModal(true);
                    }}>
                      <FileSignature className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>Complete audit log of all e-signature activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Bank-Level Audit Compliance</h3>
                  <p className="text-sm text-blue-800">
                    All signature activities are logged with tamper-proof timestamps, IP addresses, and identity verification records. 
                    Audit trails are immutable and meet APRA, ASIC, and banking regulatory requirements.
                  </p>
                </div>
              </div>
            </div>

            {/* Sample Audit Entries */}
            <div className="space-y-3">
              {[
                { time: '2024-02-21 16:35:42', action: 'Document Signed', user: 'Lisa Anderson', ip: '203.56.78.90', detail: 'Mortgage Discharge Authority - Signature applied with biometric verification' },
                { time: '2024-02-21 16:34:15', action: 'Identity Verified', user: 'Lisa Anderson', ip: '203.56.78.90', detail: 'SMS code verified, Email confirmed, ID document verified' },
                { time: '2024-02-21 16:30:05', action: 'Document Viewed', user: 'Lisa Anderson', ip: '203.56.78.90', detail: 'Mortgage Discharge Authority opened for review' },
                { time: '2024-02-21 15:22:18', action: 'Email Sent', user: 'System', ip: '203.123.45.67', detail: 'Signature request email sent to Lisa Anderson' },
                { time: '2024-02-21 15:20:00', action: 'Document Created', user: 'Admin User', ip: '203.123.45.67', detail: 'Mortgage Discharge Authority created from template' },
                { time: '2024-02-20 14:23:51', action: 'Document Signed', user: 'John Smith', ip: '203.45.67.89', detail: 'Loan Agreement - Signature applied with SMS verification' },
                { time: '2024-02-19 11:05:33', action: 'Document Completed', user: 'System', ip: '203.123.45.67', detail: 'Security Agreement - All parties signed, document sealed' },
              ].map((entry, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="w-32 flex-shrink-0">
                    <p className="text-xs font-medium text-gray-900">{entry.time}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{entry.action}</Badge>
                      <span className="text-sm font-medium text-gray-900">{entry.user}</span>
                    </div>
                    <p className="text-sm text-gray-600">{entry.detail}</p>
                    <p className="text-xs text-gray-500 mt-1">IP: {entry.ip}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compliance & Security</CardTitle>
          <CardDescription>Bank-level security and regulatory compliance features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Compliance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">Bank Level</h3>
                    <p className="text-sm text-gray-600">Compliance Status</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Lock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">AES-256</h3>
                    <p className="text-sm text-gray-600">Encryption Standard</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <CheckSquare className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-1">100%</h3>
                    <p className="text-sm text-gray-600">Audit Coverage</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Checks */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Compliance Features</h3>
              <div className="space-y-3">
                {complianceChecks.map((check) => (
                  <div key={check.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start gap-3 flex-1">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">{check.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{check.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      {check.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Regulatory Standards */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Regulatory Standards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'APRA Standards', description: 'Australian Prudential Regulation Authority', logo: '🇦🇺' },
                  { name: 'ASIC Requirements', description: 'Australian Securities and Investments Commission', logo: '🏛️' },
                  { name: 'eIDAS (EU)', description: 'Electronic Identification and Trust Services', logo: '🇪🇺' },
                  { name: 'ESIGN Act (US)', description: 'Electronic Signatures in Global and National Commerce', logo: '🇺🇸' },
                  { name: 'UETA (US)', description: 'Uniform Electronic Transactions Act', logo: '📜' },
                  { name: 'ISO 27001', description: 'Information Security Management', logo: '🔒' }
                ].map((standard, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl">
                      {standard.logo}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{standard.name}</h4>
                      <p className="text-sm text-gray-600">{standard.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>E-Signature Settings</CardTitle>
          <CardDescription>Configure signature workflows and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Identity Verification */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Identity Verification</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">SMS Verification</h4>
                    <p className="text-sm text-gray-600">Send verification code via SMS</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Email Verification</h4>
                    <p className="text-sm text-gray-600">Send verification code via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">ID Document Verification</h4>
                    <p className="text-sm text-gray-600">Verify government-issued ID</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Biometric Verification</h4>
                    <p className="text-sm text-gray-600">Fingerprint or facial recognition</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Video Call Verification</h4>
                    <p className="text-sm text-gray-600">Live video verification session</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Require Password</h4>
                    <p className="text-sm text-gray-600">Signers must enter password</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">IP Address Logging</h4>
                    <p className="text-sm text-gray-600">Record IP address for each signature</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Geolocation Tracking</h4>
                    <p className="text-sm text-gray-600">Record location when signing</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Tamper Detection</h4>
                    <p className="text-sm text-gray-600">Detect document modifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            {/* Workflow Settings */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Workflow Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label>Default Expiration Period</Label>
                  <select className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg">
                    <option>7 days</option>
                    <option>14 days</option>
                    <option>30 days</option>
                    <option>60 days</option>
                    <option>90 days</option>
                  </select>
                </div>
                <div>
                  <Label>Reminder Frequency</Label>
                  <select className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Daily</option>
                    <option>Every 2 days</option>
                    <option>Every 3 days</option>
                    <option>Weekly</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Sequential Signing</h4>
                    <p className="text-sm text-gray-600">Enforce signing order</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto-Reminders</h4>
                    <p className="text-sm text-gray-600">Send automatic reminder emails</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">E-Signature System</h1>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Bank Level Compliance
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">Bank-level compliant digital signatures with full audit trails</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button onClick={handleNewDocument}>
                <Plus className="w-4 h-4 mr-2" />
                New Signature Request
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'templates', label: 'Templates', icon: Copy },
              { id: 'audit', label: 'Audit Trail', icon: History },
              { id: 'compliance', label: 'Compliance', icon: Shield },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'audit' && renderAudit()}
        {activeTab === 'compliance' && renderCompliance()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* New Document Modal */}
      <Dialog open={showNewDocumentModal} onOpenChange={setShowNewDocumentModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Signature Request</DialogTitle>
            <DialogDescription>
              Upload a document and configure the signing workflow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Step 1: Upload Document */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Step 1: Upload Document</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>

            {/* Step 2: Add Signers */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Step 2: Add Signers</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="Full Name" />
                  <Input placeholder="Email Address" />
                  <select className="px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Borrower</option>
                    <option>Lender</option>
                    <option>Guarantor</option>
                    <option>Solicitor</option>
                    <option>Witness</option>
                  </select>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Signer
                </Button>
              </div>
            </div>

            {/* Step 3: Identity Verification */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Step 3: Identity Verification</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">SMS Verification</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Email Verification</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">ID Document Verification</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Biometric Verification</span>
                </label>
              </div>
            </div>

            {/* Step 4: Signing Options */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Step 4: Signing Options</h3>
              <div className="space-y-3">
                <div>
                  <Label>Expiration Date</Label>
                  <Input type="date" className="mt-2" />
                </div>
                <div>
                  <Label>Message to Signers</Label>
                  <Textarea rows={3} placeholder="Optional message..." className="mt-2" />
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Sequential signing (enforce order)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Send reminder emails</span>
                </label>
              </div>
            </div>

            {/* Compliance Notice */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-900 mb-1">Bank-Level Compliance</h4>
                  <p className="text-sm text-purple-800">
                    This signature request will include full audit trails, tamper detection, and meets all banking regulatory requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDocumentModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success('Signature request created! Emails sent to all signers.');
              setShowNewDocumentModal(false);
            }}>
              <Send className="w-4 h-4 mr-2" />
              Send for Signature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Signing Modal */}
      <Dialog open={showSigningModal} onOpenChange={setShowSigningModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sign Document</DialogTitle>
            <DialogDescription>
              Review the document and apply your signature
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Identity Verification Required */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-900 mb-1">Identity Verification Required</h4>
                  <p className="text-sm text-orange-800 mb-3">
                    Before signing, you must verify your identity:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-900">Email verification complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-gray-900">SMS verification pending</span>
                      <Button size="sm" variant="outline">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Send Code
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Preview */}
            <div className="border-2 border-gray-300 rounded-lg p-8 bg-white">
              <div className="text-center text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-sm">Document preview would appear here</p>
                <p className="text-xs mt-2">Loan Agreement - Case #MIP-2024-001</p>
              </div>
            </div>

            {/* Signature Box */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Apply Your Signature</h3>
              <div className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50">
                <div className="text-center">
                  <FileSignature className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-700 mb-4">Click to draw or type your signature</p>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Draw Signature
                    </Button>
                    <Button variant="outline">
                      Type Signature
                    </Button>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="space-y-3">
              <label className="flex items-start gap-2">
                <input type="checkbox" className="rounded mt-1" />
                <span className="text-sm text-gray-700">
                  I have read and agree to the terms of this document
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="rounded mt-1" />
                <span className="text-sm text-gray-700">
                  I consent to using electronic signatures and understand they have the same legal effect as handwritten signatures
                </span>
              </label>
            </div>

            {/* Audit Information */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Audit Information</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Timestamp:</span>
                  <span className="ml-2 text-gray-900">2024-02-21 16:35:42 AEDT</span>
                </div>
                <div>
                  <span className="text-gray-600">IP Address:</span>
                  <span className="ml-2 text-gray-900">203.56.78.90</span>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2 text-gray-900">Sydney, Australia</span>
                </div>
                <div>
                  <span className="text-gray-600">Device:</span>
                  <span className="ml-2 text-gray-900">Chrome on Windows</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSigningModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success('Document signed successfully! All parties notified.');
              setShowSigningModal(false);
            }}>
              <FileSignature className="w-4 h-4 mr-2" />
              Sign Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit Modal */}
      <Dialog open={showAuditModal} onOpenChange={setShowAuditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Audit Trail</DialogTitle>
            <DialogDescription>
              Immutable audit log for {selectedDocument?.documentName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Document Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Document ID:</span>
                  <span className="ml-2 font-mono text-gray-900">{selectedDocument?.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Document Hash:</span>
                  <span className="ml-2 font-mono text-gray-900">{selectedDocument?.documentHash}</span>
                </div>
                <div>
                  <span className="text-gray-600">Created:</span>
                  <span className="ml-2 text-gray-900">{selectedDocument?.createdAt}</span>
                </div>
                <div>
                  <span className="text-gray-600">Compliance:</span>
                  <span className="ml-2 text-purple-600 font-medium">{selectedDocument?.complianceLevel}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              {[
                { time: '2024-02-21 15:20:00', event: 'Document Created', user: 'Admin User', details: 'Document created from template', icon: FileText, color: 'blue' },
                { time: '2024-02-21 15:22:18', event: 'Email Sent', user: 'System', details: 'Signature request email sent to all parties', icon: Mail, color: 'green' },
                { time: '2024-02-21 16:30:05', event: 'Document Viewed', user: 'Lisa Anderson', details: 'Document opened for review - IP: 203.56.78.90', icon: Eye, color: 'gray' },
                { time: '2024-02-21 16:34:15', event: 'Identity Verified', user: 'Lisa Anderson', details: 'SMS code verified, Email confirmed', icon: UserCheck, color: 'green' },
                { time: '2024-02-21 16:35:42', event: 'Document Signed', user: 'Lisa Anderson', details: 'Signature applied - IP: 203.56.78.90', icon: FileSignature, color: 'green' },
              ].map((entry, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full bg-${entry.color}-100 flex items-center justify-center`}>
                      <entry.icon className={`w-5 h-5 text-${entry.color}-600`} />
                    </div>
                    {idx < 4 && <div className="w-0.5 h-8 bg-gray-300" />}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h4 className="font-semibold text-gray-900">{entry.event}</h4>
                        <p className="text-sm text-gray-600">{entry.user}</p>
                      </div>
                      <span className="text-xs text-gray-500">{entry.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{entry.details}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Certificate */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-900 mb-1">Bank-Level Compliance Certificate</h4>
                  <p className="text-sm text-purple-800 mb-3">
                    This audit trail is tamper-proof and meets all banking regulatory requirements including APRA, ASIC, eIDAS, and ESIGN Act standards.
                  </p>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAuditModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

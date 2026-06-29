// FuseSign - Electronic Signature Platform Integration
import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Send,
  Edit3,
  Users,
  Calendar,
  Upload,
  X,
  Plus,
  Mail,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

type SignatureStatus = 'draft' | 'sent' | 'pending' | 'partially-signed' | 'completed' | 'declined' | 'expired';

interface Signer {
  id: string;
  name: string;
  email: string;
  role: string;
  signedAt?: string;
  status: 'pending' | 'signed' | 'declined';
  order: number;
}

interface SignatureDocument {
  id: string;
  title: string;
  description: string;
  type: 'engagement-letter' | 'service-agreement' | 'privacy-consent' | 'aml-authorization' | 'other';
  status: SignatureStatus;
  createdAt: string;
  sentAt?: string;
  completedAt?: string;
  expiresAt?: string;
  signers: Signer[];
  fileUrl?: string;
  pages: number;
  requiresWitness: boolean;
  sequentialSigning: boolean;
}

export function FuseSign() {
  const [documents, setDocuments] = useState<SignatureDocument[]>([
    {
      id: 'doc-001',
      title: 'Engagement Letter 2024',
      description: 'Standard engagement letter for accounting services',
      type: 'engagement-letter',
      status: 'sent',
      createdAt: '2024-02-15T10:00:00Z',
      sentAt: '2024-02-15T10:30:00Z',
      expiresAt: '2024-03-15T23:59:59Z',
      pages: 5,
      requiresWitness: false,
      sequentialSigning: false,
      signers: [
        {
          id: 'signer-001',
          name: 'John Smith',
          email: 'john@example.com',
          role: 'Client Director',
          status: 'signed',
          signedAt: '2024-02-16T14:30:00Z',
          order: 1
        },
        {
          id: 'signer-002',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@growaccounting.com.au',
          role: 'Partner',
          status: 'pending',
          order: 2
        }
      ]
    },
    {
      id: 'doc-002',
      title: 'Privacy Consent Form',
      description: 'Authorization for collection and use of personal information',
      type: 'privacy-consent',
      status: 'completed',
      createdAt: '2024-02-10T09:00:00Z',
      sentAt: '2024-02-10T09:15:00Z',
      completedAt: '2024-02-10T15:45:00Z',
      pages: 2,
      requiresWitness: false,
      sequentialSigning: false,
      signers: [
        {
          id: 'signer-003',
          name: 'John Smith',
          email: 'john@example.com',
          role: 'Client',
          status: 'signed',
          signedAt: '2024-02-10T15:45:00Z',
          order: 1
        }
      ]
    },
    {
      id: 'doc-003',
      title: 'AML/CTF Authorization',
      description: 'Authorization to conduct identity verification and sanctions screening',
      type: 'aml-authorization',
      status: 'pending',
      createdAt: '2024-02-18T11:00:00Z',
      sentAt: '2024-02-18T11:30:00Z',
      expiresAt: '2024-03-18T23:59:59Z',
      pages: 3,
      requiresWitness: false,
      sequentialSigning: false,
      signers: [
        {
          id: 'signer-004',
          name: 'John Smith',
          email: 'john@example.com',
          role: 'Client',
          status: 'pending',
          order: 1
        }
      ]
    }
  ]);

  const [selectedDoc, setSelectedDoc] = useState<SignatureDocument | null>(null);
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [view, setView] = useState<'all' | 'pending' | 'completed'>('all');

  const getStatusBadge = (status: SignatureStatus) => {
    const config = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft', icon: Edit3 },
      sent: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sent', icon: Send },
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Awaiting Signature', icon: Clock },
      'partially-signed': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Partially Signed', icon: Users },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed', icon: CheckCircle },
      declined: { bg: 'bg-red-100', text: 'text-red-700', label: 'Declined', icon: X },
      expired: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Expired', icon: Clock }
    };

    const { bg, text, label, icon: Icon } = config[status];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
    );
  };

  const getDocTypeLabel = (type: string) => {
    const types = {
      'engagement-letter': 'Engagement Letter',
      'service-agreement': 'Service Agreement',
      'privacy-consent': 'Privacy Consent',
      'aml-authorization': 'AML Authorization',
      'other': 'Other Document'
    };
    return types[type as keyof typeof types] || type;
  };

  const filteredDocs = documents.filter(doc => {
    if (view === 'pending') return doc.status === 'pending' || doc.status === 'sent' || doc.status === 'partially-signed';
    if (view === 'completed') return doc.status === 'completed';
    return true;
  });

  const handleSignDocument = (docId: string) => {
    setDocuments(docs => docs.map(doc => {
      if (doc.id === docId) {
        const updatedSigners = doc.signers.map(signer => {
          if (signer.status === 'pending' && signer.email === 'john@example.com') {
            return {
              ...signer,
              status: 'signed' as const,
              signedAt: new Date().toISOString()
            };
          }
          return signer;
        });

        const allSigned = updatedSigners.every(s => s.status === 'signed');

        return {
          ...doc,
          signers: updatedSigners,
          status: allSigned ? 'completed' : 'partially-signed',
          completedAt: allSigned ? new Date().toISOString() : undefined
        };
      }
      return doc;
    }));

    toast.success('✓ Document signed successfully');
    setSelectedDoc(null);
  };

  const handleDeclineDocument = (docId: string) => {
    setDocuments(docs => docs.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          status: 'declined' as const,
          signers: doc.signers.map(s => 
            s.status === 'pending' && s.email === 'john@example.com' 
              ? { ...s, status: 'declined' as const } 
              : s
          )
        };
      }
      return doc;
    }));

    toast.error('Document declined');
    setSelectedDoc(null);
  };

  const handleRemindSigner = (docId: string, signerId: string) => {
    toast.success('Reminder email sent');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysUntilExpiry = (expiresAt?: string) => {
    if (!expiresAt) return null;
    const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">FuseSign</h2>
          <p className="text-gray-600">Manage electronic signatures for documents</p>
        </div>
        <button
          onClick={() => setShowNewDocModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending Signature</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {documents.filter(d => d.status === 'pending' || d.status === 'sent' || d.status === 'partially-signed').length}
          </p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Completed</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {documents.filter(d => d.status === 'completed').length}
          </p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Documents</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">This Month</span>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {documents.filter(d => {
              const created = new Date(d.createdAt);
              const now = new Date();
              return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setView('all')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            view === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          All Documents ({documents.length})
        </button>
        <button
          onClick={() => setView('pending')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            view === 'pending'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending ({documents.filter(d => d.status === 'pending' || d.status === 'sent' || d.status === 'partially-signed').length})
        </button>
        <button
          onClick={() => setView('completed')}
          className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
            view === 'completed'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Completed ({documents.filter(d => d.status === 'completed').length})
        </button>
      </div>

      {/* Document List */}
      <div className="space-y-3">
        {filteredDocs.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-6">
              {view === 'pending' ? 'No documents awaiting signature' : 
               view === 'completed' ? 'No completed documents yet' :
               'Start by creating a new document for signature'}
            </p>
            <button
              onClick={() => setShowNewDocModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Plus className="w-5 h-5" />
              Create New Document
            </button>
          </div>
        ) : (
          filteredDocs.map(doc => {
            const daysUntilExpiry = getDaysUntilExpiry(doc.expiresAt);
            const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 3 && daysUntilExpiry > 0;
            const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0;

            return (
              <div key={doc.id} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{doc.title}</h3>
                        {getStatusBadge(doc.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          {getDocTypeLabel(doc.type)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Created {formatDate(doc.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {doc.signers.length} {doc.signers.length === 1 ? 'Signer' : 'Signers'}
                        </span>
                        {doc.expiresAt && (
                          <span className={`flex items-center gap-1 ${
                            isExpired ? 'text-red-600 font-semibold' :
                            isExpiringSoon ? 'text-amber-600 font-semibold' :
                            'text-gray-600'
                          }`}>
                            <Clock className="w-3.5 h-3.5" />
                            {isExpired ? 'Expired' : `Expires in ${daysUntilExpiry} days`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signers */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Signers</h4>
                  <div className="space-y-2">
                    {doc.signers.map((signer, idx) => (
                      <div key={signer.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            signer.status === 'signed' ? 'bg-green-100 text-green-700' :
                            signer.status === 'declined' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{signer.name}</p>
                            <p className="text-xs text-gray-600">{signer.email} • {signer.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {signer.status === 'signed' ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-green-600 font-semibold">
                                Signed {signer.signedAt && formatDate(signer.signedAt)}
                              </span>
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                          ) : signer.status === 'declined' ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-red-600 font-semibold">Declined</span>
                              <X className="w-5 h-5 text-red-600" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleRemindSigner(doc.id, signer.id)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                Send Reminder
                              </button>
                              <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  {doc.status === 'pending' && doc.signers.some(s => s.email === 'john@example.com' && s.status === 'pending') && (
                    <>
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                      >
                        <Edit3 className="w-4 h-4" />
                        Sign Document
                      </button>
                      <button
                        onClick={() => handleDeclineDocument(doc.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold text-sm"
                      >
                        <X className="w-4 h-4" />
                        Decline
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  {doc.status === 'completed' && (
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sign Document Modal */}
      {selectedDoc && selectedDoc.status === 'pending' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedDoc.title}</h3>
                <p className="text-sm text-gray-600 mt-1">Review and sign this document</p>
              </div>
              <button onClick={() => setSelectedDoc(null)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {/* Document Preview */}
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-8 mb-6 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Document Preview</p>
                  <p className="text-sm text-gray-500">{selectedDoc.pages} pages</p>
                </div>
              </div>

              {/* Signature Box */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
                <h4 className="font-bold text-blue-900 mb-4">Your Signature Required</h4>
                <div className="bg-white border-2 border-dashed border-blue-300 rounded-lg p-12 text-center mb-4">
                  <Edit3 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Click to add your signature</p>
                  <p className="text-xs text-gray-500">You can draw, type, or upload your signature</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 w-5 h-5" />
                    <span className="text-sm text-gray-700">
                      I have read and agree to the terms outlined in this document
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 w-5 h-5" />
                    <span className="text-sm text-gray-700">
                      I consent to using electronic signatures for this agreement
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 w-5 h-5" />
                    <span className="text-sm text-gray-700">
                      I confirm that I am authorized to sign this document
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSignDocument(selectedDoc.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <CheckCircle className="w-5 h-5" />
                  Sign & Complete
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Document Modal */}
      {selectedDoc && selectedDoc.status !== 'pending' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedDoc.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  {getStatusBadge(selectedDoc.status)}
                  {selectedDoc.completedAt && (
                    <span className="text-sm text-gray-600">
                      Completed {formatDate(selectedDoc.completedAt)}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedDoc(null)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {/* Document Preview */}
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-8 mb-6 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Document Preview</p>
                  <p className="text-sm text-gray-500">{selectedDoc.pages} pages</p>
                </div>
              </div>

              {/* Signature Trail */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
                <h4 className="font-bold text-green-900 mb-4">Signature Trail</h4>
                <div className="space-y-3">
                  {selectedDoc.signers.map((signer, idx) => (
                    <div key={signer.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        signer.status === 'signed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{signer.name}</p>
                        <p className="text-xs text-gray-600">
                          {signer.status === 'signed' 
                            ? `Signed ${signer.signedAt && formatDate(signer.signedAt)}`
                            : 'Pending signature'}
                        </p>
                      </div>
                      {signer.status === 'signed' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {selectedDoc.status === 'completed' && (
                  <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                    <Download className="w-5 h-5" />
                    Download Signed Document
                  </button>
                )}
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Document Modal */}
      {showNewDocModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Create New Document</h3>
              <button onClick={() => setShowNewDocModal(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Service Agreement 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Document Type *
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option>Engagement Letter</option>
                    <option>Service Agreement</option>
                    <option>Privacy Consent</option>
                    <option>AML Authorization</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Document *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF files only (max 10MB)</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Add Signers
                  </label>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm">
                    <Plus className="w-4 h-4" />
                    Add Signer
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Create & Send
                </button>
                <button
                  onClick={() => setShowNewDocModal(false)}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

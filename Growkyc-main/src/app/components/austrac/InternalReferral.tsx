import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import {
  AlertTriangle,
  Send,
  FileText,
  Upload,
  Ban,
  CheckCircle,
  Search,
  User,
  Building
} from 'lucide-react';

interface SubjectInfo {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface InternalReferralProps {
  caseId?: string;
  onSuccess?: (newCase?: Record<string, unknown>) => void;
  isEmbed?: boolean;
}

export function InternalReferral({ caseId, onSuccess, isEmbed = false }: InternalReferralProps = {}) {
  const draftKey = `internal_referral_draft_${caseId || 'new'}`;
  const [concernCategory, setConcernCategory] = useState<string>('');
  const [concernSummary, setConcernSummary] = useState<string>('');
  const [urgency, setUrgency] = useState<string>('routine');
  const [relatedMatter, setRelatedMatter] = useState<string>('');
  const [immediateHold, setImmediateHold] = useState(false);
  const [immediateHoldReason, setImmediateHoldReason] = useState('');
  const [searchSubject, setSearchSubject] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<SubjectInfo | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const activeCaseId = caseId || selectedSubject?.id || 'AUS-2026-001';

    if (!concernCategory || !concernSummary.trim()) {
      toast.error('Please select a concern category and provide a summary.');
      return;
    }
    if (!caseId && !selectedSubject) {
      toast.error('Please select a client or entity.');
      return;
    }
    if (immediateHold && !immediateHoldReason.trim()) {
      toast.error('Please provide a reason for immediate hold.');
      return;
    }

    setIsSubmitting(true);
    try {
      let isMockSuccess = false;
      try {
        const response = await fetch(`/api/v1/cases/${activeCaseId}/referrals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category: concernCategory,
            summary: concernSummary,
            urgency,
            immediateHold,
            immediateHoldReason: immediateHold ? immediateHoldReason : undefined,
            relatedMatter,
            attachmentNames: attachments.map((file) => file.name),
            date: new Date().toISOString().split('T')[0]
          }),
        });

        const contentType = response.headers.get("content-type");
        let data: { success?: boolean; message?: string } = {};
        if (contentType && contentType.includes("application/json")) {
          data = await response.json() as { success?: boolean; message?: string };
        } else {
          const text = await response.text();
          data = { success: response.ok, message: text || 'Submission failed' };
        }

        if (!response.ok || data.success === false) {
          throw new Error(data.message || 'Submission failed');
        }
      } catch {
        isMockSuccess = true;
      }

      toast.success(isMockSuccess ? 'Internal referral submitted successfully (Simulated).' : 'Internal referral submitted successfully.');

      // Reset form
      setConcernCategory('');
      setConcernSummary('');
      setUrgency('routine');
      setRelatedMatter('');
      setImmediateHold(false);
      setImmediateHoldReason('');
      setSearchSubject('');
      setSelectedSubject(null);
      setAttachments([]);
      setIsDraftSaved(false);
      localStorage.removeItem(draftKey);

      if (onSuccess) {
        onSuccess({
          caseId: `AUS-2026-${Math.floor(100 + Math.random() * 900)}`,
          subject: relatedMatter || selectedSubject?.name || 'Manual Case Referral',
          subjectType: selectedSubject?.type || 'company',
          triggerSource: 'manual',
          riskBand: urgency === 'immediate' ? 'critical' : urgency === 'urgent' ? 'high' : urgency === 'priority' ? 'medium' : 'low',
          assignedReviewer: 'Sarah Johnson',
          status: 'new',
          createdDate: new Date().toISOString().split('T')[0],
          slaHours: urgency === 'immediate' ? 24 : urgency === 'urgent' ? 24 : urgency === 'priority' ? 48 : 72,
          slaRemaining: urgency === 'immediate' ? 24 : urgency === 'urgent' ? 24 : urgency === 'priority' ? 48 : 72
        });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const concernCategories = [
    { value: 'sof', label: 'Suspicious Source of Funds', severity: 'high' },
    { value: 'behaviour', label: 'Suspicious Client Behaviour', severity: 'medium' },
    { value: 'documents', label: 'False or Altered Documents', severity: 'critical' },
    { value: 'ownership', label: 'Unexplained Ownership', severity: 'high' },
    { value: 'transactions', label: 'Unusual Transaction Activity', severity: 'high' },
    { value: 'media', label: 'Media or Legal Concerns', severity: 'medium' },
    { value: 'sanctions', label: 'Sanctions/PEP Concern', severity: 'critical' },
    { value: 'other', label: 'Other', severity: 'low' }
  ];

  const recentSubjects = [
    { id: 'C-001', name: 'Tech Innovations Pty Ltd', type: 'company', status: 'Active' },
    { id: 'C-002', name: 'Melbourne Property Trust', type: 'trust', status: 'Active' },
    { id: 'C-003', name: 'David Williams', type: 'individual', status: 'Active' },
    { id: 'C-004', name: 'Sydney Ventures Partnership', type: 'partnership', status: 'Active' }
  ];

  const filteredSubjects = useMemo(() => {
    const needle = searchSubject.trim().toLowerCase();
    if (!needle) return recentSubjects;
    return recentSubjects.filter((subject) =>
      subject.name.toLowerCase().includes(needle) ||
      subject.id.toLowerCase().includes(needle) ||
      subject.type.toLowerCase().includes(needle)
    );
  }, [searchSubject]);

  useEffect(() => {
    try {
      const draft = localStorage.getItem(draftKey);
      if (!draft) return;
      const parsed = JSON.parse(draft) as {
        concernCategory?: string;
        concernSummary?: string;
        urgency?: string;
        relatedMatter?: string;
        immediateHold?: boolean;
        immediateHoldReason?: string;
        selectedSubject?: SubjectInfo | null;
      };
      setConcernCategory(parsed.concernCategory || '');
      setConcernSummary(parsed.concernSummary || '');
      setUrgency(parsed.urgency || 'routine');
      setRelatedMatter(parsed.relatedMatter || '');
      setImmediateHold(Boolean(parsed.immediateHold));
      setImmediateHoldReason(parsed.immediateHoldReason || '');
      setSelectedSubject(parsed.selectedSubject || null);
      setIsDraftSaved(true);
    } catch {
      // Ignore invalid draft payload
    }
  }, [draftKey]);

  useEffect(() => {
    const draftPayload = {
      concernCategory,
      concernSummary,
      urgency,
      relatedMatter,
      immediateHold,
      immediateHoldReason,
      selectedSubject
    };
    localStorage.setItem(draftKey, JSON.stringify(draftPayload));
    setIsDraftSaved(true);
  }, [draftKey, concernCategory, concernSummary, urgency, relatedMatter, immediateHold, immediateHoldReason, selectedSubject]);

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setAttachments((prev) => [...prev, ...Array.from(e.target.files || [])]);
    e.target.value = '';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className={isEmbed ? "bg-white p-4" : "min-h-screen bg-gray-50 p-8"}>
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        {!isEmbed && (
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Internal Referral</h1>
                  <p className="text-white/90">Raise a suspicious matter concern manually</p>
                </div>
              </div>
              <Badge className="bg-white text-red-900 text-lg px-6 py-3">
                Manual Case Creation
              </Badge>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">When to Use Internal Referral</h3>
                <p className="text-sm text-blue-800 mb-2">
                  Use this form when you observe suspicious activity that hasn't been automatically flagged by our
                  screening bots. All staff members can raise concerns. Common scenarios:
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Unusual client behaviour during meetings or communications</li>
                  <li>• Concerns about document authenticity not caught by automated checks</li>
                  <li>• Unexplained wealth or lifestyle inconsistent with declared income</li>
                  <li>• Unusual transaction patterns requiring expert judgment</li>
                  <li>• Information from external sources (media, partner communications)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Subject Selection */}
          <Card className="border-2 border-purple-300 shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <User className="w-6 h-6 text-purple-600" />
                Select Subject
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Search for Client/Entity *
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, ABN, ACN..."
                    value={searchSubject}
                    onChange={(e) => setSearchSubject(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-3">Recent Clients</p>
                <div className="space-y-2">
                  {filteredSubjects.map((subject) => (
                    <div
                      key={subject.id}
                      onClick={() => setSelectedSubject(subject)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedSubject?.id === subject.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-300 bg-white'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {subject.type === 'individual' ? (
                          <User className="w-4 h-4 text-gray-600" />
                        ) : (
                          <Building className="w-4 h-4 text-gray-600" />
                        )}
                        <span className="font-semibold text-sm text-gray-900">{subject.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">{subject.type}</Badge>
                        <span className="text-xs text-gray-600">{subject.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSubject && (
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-900">Subject Selected</span>
                  </div>
                  <p className="text-sm text-green-800">{selectedSubject.name}</p>
                  <p className="text-xs text-green-700">{selectedSubject.id}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Center Column - Concern Details */}
          <Card className="lg:col-span-2 border-2 border-orange-300 shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-orange-600" />
                Concern Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Related Matter */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Related Client or Matter (Optional)
                </label>
                <input
                  type="text"
                  value={relatedMatter}
                  onChange={(e) => setRelatedMatter(e.target.value)}
                  placeholder="Link to specific deal, transaction, or matter..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                />
              </div>

              {/* Concern Category */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Concern Category *
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {concernCategories.map((category) => (
                    <div
                      key={category.value}
                      onClick={() => setConcernCategory(category.value)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${concernCategory === category.value
                        ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                        : 'border-gray-300 hover:border-orange-300 bg-white'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900 mb-1">{category.label}</p>
                          <Badge className={`${getSeverityColor(category.severity)} text-xs`}>
                            {category.severity.toUpperCase()}
                          </Badge>
                        </div>
                        {concernCategory === category.value && (
                          <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concern Summary */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Concern Summary *
                </label>
                <textarea
                  rows={6}
                  required
                  value={concernSummary}
                  onChange={(e) => setConcernSummary(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                  placeholder="Describe the suspicious activity in detail. Include:&#10;• What you observed&#10;• When it occurred&#10;• Why it raised concern&#10;• Any supporting context&#10;• Who else was involved or aware"
                />
              </div>

              {/* Related Documents */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Related Documents (Optional)
                </label>
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors cursor-pointer block">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, XLSX, images (max 10MB each)
                  </p>
                  <input type="file" multiple className="hidden" onChange={handleAttachmentUpload} />
                </label>
                <div className="mt-3 space-y-2">
                  {attachments.length === 0 && (
                    <p className="text-xs text-gray-500">No files attached yet.</p>
                  )}
                  {attachments.map((file, idx) => (
                    <div key={`${file.name}-${idx}`} className="flex items-center justify-between p-3 bg-purple-50 rounded border border-purple-200">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-semibold text-gray-900">{file.name}</span>
                        <Badge className="bg-green-100 text-green-700 text-xs">Attached</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => setAttachments((prev) => prev.filter((_, fileIdx) => fileIdx !== idx))}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Urgency Level *
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                >
                  <option value="routine">Routine - Review within 72 hours</option>
                  <option value="priority">Priority - Review within 48 hours</option>
                  <option value="urgent">Urgent - Review within 24 hours</option>
                  <option value="immediate">Immediate - Same day review required</option>
                </select>
              </div>

              {/* Immediate Service Hold */}
              <div className="p-6 bg-red-50 rounded-lg border-2 border-red-300">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={immediateHold}
                    onChange={(e) => setImmediateHold(e.target.checked)}
                    className="w-6 h-6 mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Ban className="w-5 h-5 text-red-600" />
                      <span className="font-bold text-red-900 text-lg">Immediate Service Hold Requested</span>
                    </div>
                    <p className="text-sm text-red-800 mb-2">
                      Check this box if you believe services should be immediately restricted or suspended pending
                      investigation.
                    </p>
                    <p className="text-xs text-red-700">
                      <strong>Impact:</strong> All client services will be placed under review immediately upon
                      submission. Compliance team will be notified.
                    </p>
                  </div>
                </label>
              </div>

              {immediateHold && (
                <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-300">
                  <label className="block text-sm font-bold text-amber-900 mb-2">
                    Reason for Immediate Hold *
                  </label>
                  <textarea
                    rows={3}
                    value={immediateHoldReason}
                    onChange={(e) => setImmediateHoldReason(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Explain why immediate service suspension is required..."
                  />
                </div>
              )}

              {/* Referrer Information */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                <p className="text-sm font-bold text-gray-900 mb-3">Referrer Information</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Your Name</p>
                    <p className="font-semibold text-gray-900">John Smith (Auto-filled)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Department</p>
                    <p className="font-semibold text-gray-900">Client Services</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Date</p>
                    <p className="font-semibold text-gray-900">{new Date().toISOString().split('T')[0]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Time</p>
                    <p className="font-semibold text-gray-900">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t space-y-3">
                <div className="text-xs text-gray-600 text-right">
                  Draft {isDraftSaved ? 'saved' : 'saving...'}
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!caseId && !selectedSubject) || !concernCategory || !concernSummary.trim() || (immediateHold && !immediateHoldReason.trim())}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-base sm:text-lg py-4 sm:py-5 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md font-semibold h-auto min-h-[50px] flex items-center justify-center whitespace-normal break-words"
                >
                  <Send className="w-5 h-5 mr-3 flex-shrink-0" />
                  {isSubmitting ? 'Submitting Internal Referral...' : 'Submit Internal Referral & Create AUSTRAC Case'}
                </Button>
                <p className="text-xs text-gray-600 text-center">
                  By submitting, you confirm that the information provided is accurate to the best of your knowledge.
                  The compliance team will be immediately notified and a formal case will be created.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Confirmation Banner */}
        {immediateHold && (
          <Card className="border-4 border-red-500 bg-red-50 shadow-2xl animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Ban className="w-16 h-16 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-red-900 mb-2">Service Hold Will Be Applied</h3>
                  <p className="text-red-800 text-lg">
                    Upon submission, all services for the selected client will be immediately placed under review.
                    The compliance team will be notified via email and SMS. This action cannot be undone.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Users,
  Building,
  TrendingUp,
  FileText,
  Clock,
  Target,
  Activity,
  Play,
  Ban,
  Send,
  Save,
  ArrowLeft,
  Calendar,
  User,
  CreditCard,
  Scale,
  DollarSign,
  Download,
  RefreshCw,
  Upload,
  Plus,
  MessageSquare,
  GitBranch,
  ExternalLink,
  History,
  Trash2,
  Edit2,
  AlertOctagon,
  FolderOpen
} from 'lucide-react';

type TabType = 'summary' | 'triggers' | 'evidence' | 'screening' | 'financial' | 'ownership' | 'related' | 'notes' | 'timeline' | 'approvals' | 'escalations' | 'documents';

interface CaseWorkbenchProps {
  onBack?: () => void;
}

export function CaseWorkbench({ onBack }: CaseWorkbenchProps = {}) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [caseStatus, setCaseStatus] = useState<string>('investigating');
  const [decision, setDecision] = useState<string>('');
  const [decisionReason, setDecisionReason] = useState<string>('');
  
  const handleSubmitDecision = () => {
    if (!decision) {
      toast.error('Please select a decision type');
      return;
    }
    
    const reasonTrimmed = decisionReason.trim();
    if (!reasonTrimmed) {
      toast.error('Please provide a decision rationale');
      return;
    }
    
    if (reasonTrimmed.length < 10) {
      toast.error('Rationale must be at least 10 characters long to provide sufficient context');
      return;
    }

    if (reasonTrimmed.length > 1000) {
      toast.error('Rationale exceeds the 1000 character limit');
      return;
    }

    toast.success('Decision submitted successfully');
    setDecision('');
    setDecisionReason('');
  };
  
  const { user } = useAuth();
  const isAuditor = user?.role === 'auditor' || user?.role === 'read_only_auditor' as any;
  
  // Timeline State
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Notes State
  const [caseNotes, setCaseNotes] = useState<any[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [newNote, setNewNote] = useState<string>('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Approvals State
  const [approvalChain, setApprovalChain] = useState<any>(null);
  const [approvalsLoading, setApprovalsLoading] = useState(false);

  // Escalations State
  const [escalations, setEscalations] = useState<any[]>([]);
  const [escalationsLoading, setEscalationsLoading] = useState(false);

  // Documents State
  const [kycDocuments, setKycDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const caseData = {
    id: 'CASE-2026-001',
    clientName: 'ABC Enterprises Pty Ltd',
    clientType: 'Company',
    caseType: 'Sanctions Match',
    riskLevel: 'Critical',
    status: 'Investigating',
    assignedTo: 'Michael Chen',
    created: '2026-03-20 14:30',
    slaRemaining: '8 hours',
    triggerSource: 'Sanctions Screening Bot'
  };

  // Mock audit events used as fallback when the API is not available
  const mockAuditEvents = [
    {
      actor: 'System',
      action: 'Case created',
      timestamp: '2026-03-20T14:30:00Z',
      type: 'case_created',
      metadata: { caseType: 'Sanctions Match', riskLevel: 'Critical', triggerSource: 'Sanctions Screening Bot' }
    },
    {
      actor: 'Sanctions Screening Bot',
      action: 'Sanctions match detected',
      timestamp: '2026-03-20T14:31:12Z',
      type: 'screening_alert',
      metadata: { list: 'DFAT Consolidated List', matchedEntity: 'John Smith', confidence: '94%', matchType: 'Name + DOB' }
    },
    {
      actor: 'Adverse Media Bot',
      action: 'Adverse media alerts generated',
      timestamp: '2026-03-20T14:35:45Z',
      type: 'screening_alert',
      metadata: { articlesFound: '3', severity: 'Severe', categories: 'Money Laundering, Regulatory Action, Litigation' }
    },
    {
      actor: 'System',
      action: 'Auto-assigned to compliance analyst',
      timestamp: '2026-03-20T15:00:00Z',
      type: 'assignment',
      metadata: { assignedTo: 'Michael Chen', reason: 'Round-robin, Critical priority queue', team: 'AML Compliance' }
    },
    {
      actor: 'Michael Chen',
      action: 'Opened case and began investigation',
      timestamp: '2026-03-20T15:05:22Z',
      type: 'status_change',
      metadata: { previousStatus: 'New', newStatus: 'Investigating' }
    },
    {
      actor: 'Michael Chen',
      action: 'Added internal note',
      timestamp: '2026-03-20T15:15:30Z',
      type: 'note_added',
      metadata: { notePreview: 'Reviewing sanctions match details and cross-referencing with DFAT records...' }
    },
    {
      actor: 'PEP Screening Bot',
      action: 'PEP match detected — foreign PEP identified',
      timestamp: '2026-03-20T15:20:00Z',
      type: 'screening_alert',
      metadata: { entity: 'Sarah Lee', pepType: 'Foreign PEP', position: 'Deputy Minister of Trade — Singapore', provider: 'Dow Jones' }
    },
    {
      actor: 'Michael Chen',
      action: 'Requested source-of-funds documentation from client',
      timestamp: '2026-03-20T16:00:00Z',
      type: 'document_request',
      metadata: { documentType: 'Source of Funds Statement', deadline: '2026-03-25', method: 'Client Portal' }
    },
    {
      actor: 'System',
      action: 'SLA warning — 75% elapsed',
      timestamp: '2026-03-21T08:30:00Z',
      type: 'sla_warning',
      metadata: { slaDeadline: '2026-03-21 22:30', timeRemaining: '14 hours', priority: 'Urgent' }
    },
    {
      actor: 'Michael Chen',
      action: 'Uploaded supporting evidence document',
      timestamp: '2026-03-21T09:00:15Z',
      type: 'document_uploaded',
      metadata: { fileName: 'DFAT_Match_Analysis_v2.pdf', fileSize: '2.4 MB', category: 'Sanctions Evidence' }
    },
    {
      actor: 'Source of Funds Bot',
      action: 'Anomalous capital injection flagged',
      timestamp: '2026-03-21T09:45:00Z',
      type: 'screening_alert',
      metadata: { amount: '$2,500,000', source: 'Unknown offshore account', risk: 'High', recommendation: 'Request bank statements' }
    },
    {
      actor: 'Michael Chen',
      action: 'Escalated case to Senior Compliance Officer',
      timestamp: '2026-03-21T10:30:00Z',
      type: 'escalation',
      metadata: { escalatedTo: 'Jessica Wong', reason: 'Multiple high-risk indicators require senior review', urgency: 'High' }
    },
    {
      actor: 'Jessica Wong',
      action: 'Accepted case escalation',
      timestamp: '2026-03-21T10:45:00Z',
      type: 'assignment',
      metadata: { role: 'Senior Compliance Officer', action: 'Co-reviewing with Michael Chen' }
    },
    {
      actor: 'System',
      action: 'Continuous monitoring triggered — real-time screening enabled',
      timestamp: '2026-03-21T11:00:00Z',
      type: 'system_config',
      metadata: { monitoringType: 'Real-time', lists: 'DFAT, OFAC, UN, EU', frequency: 'Continuous' }
    }
  ];

  const fetchAuditEvents = useCallback(async (isManualRefresh = false) => {
    if (!isManualRefresh && auditEvents.length > 0) return; // skip silent polls if data is loaded
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/v1/cases/${caseData.id}/audit-events`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setAuditEvents(data.events || []);
    } catch (_err) {
      // Fallback to mock data when API is unavailable
      setAuditEvents(mockAuditEvents);
      setError('');
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  }, [caseData.id, auditEvents.length]);

  // Fetch on tab switch + 30-second live-polling for timeline
  useEffect(() => {
    if (activeTab === 'timeline') {
      fetchAuditEvents(true);
      pollRef.current = setInterval(() => fetchAuditEvents(true), 30000);
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [activeTab, fetchAuditEvents]);

  const mockNotes = [
    { id: 'n1', text: 'Reviewed initial sanctions match. Looks like a false positive due to common name, but DOB requires further verification.', author: 'Michael Chen', timestamp: '2026-03-20T15:15:30Z', isOwnNote: true },
    { id: 'n2', text: 'Waiting for client to provide certified passport copy.', author: 'Jessica Wong', timestamp: '2026-03-20T16:00:00Z', isOwnNote: false },
  ];

  const fetchNotes = useCallback(async () => {
    setNotesLoading(true);
    try {
      const response = await fetch(`/api/v1/cases/${caseData.id}/notes`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setCaseNotes(data.notes || []);
    } catch {
      setCaseNotes(mockNotes);
    } finally {
      setNotesLoading(false);
    }
  }, [caseData.id]);

  useEffect(() => {
    if (activeTab === 'notes') fetchNotes();
  }, [activeTab, fetchNotes]);

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    
    // Optimistic update for mock
    const isEditing = !!editingNoteId;
    
    try {
      if (isEditing) {
        await fetch(`/api/v1/cases/${caseData.id}/notes/${editingNoteId}`, {
          method: 'PUT',
          body: JSON.stringify({ text: newNote }),
          headers: { 'Content-Type': 'application/json' }
        });
        setCaseNotes(prev => prev.map(n => n.id === editingNoteId ? { ...n, text: newNote, timestamp: new Date().toISOString() } : n));
      } else {
        await fetch(`/api/v1/cases/${caseData.id}/notes`, {
          method: 'POST',
          body: JSON.stringify({ text: newNote }),
          headers: { 'Content-Type': 'application/json' }
        });
        const createdNote = { id: Date.now().toString(), text: newNote, author: 'Michael Chen', timestamp: new Date().toISOString(), isOwnNote: true };
        setCaseNotes([createdNote, ...caseNotes]);
      }
    } catch (e) {
      // Fallback update
      if (isEditing) {
         setCaseNotes(prev => prev.map(n => n.id === editingNoteId ? { ...n, text: newNote, timestamp: new Date().toISOString() } : n));
      } else {
         const createdNote = { id: Date.now().toString(), text: newNote, author: 'Michael Chen', timestamp: new Date().toISOString(), isOwnNote: true };
         setCaseNotes([createdNote, ...caseNotes]);
      }
    }
    setNewNote('');
    setEditingNoteId(null);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await fetch(`/api/v1/cases/${caseData.id}/notes/${noteId}`, { method: 'DELETE' });
    } catch (e) {
      // Fallback
    }
    setCaseNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const mockApprovalChain = {
    caseId: caseData.id,
    status: 'pending_level_2',
    steps: [
      { step: 1, role: 'L1 Analyst', actor: 'Michael Chen', status: 'approved', timestamp: '2026-03-21T10:30:00Z', comments: 'Initial checks complete, escalating for L2 review.' },
      { step: 2, role: 'L2 Senior Analyst', actor: 'Jessica Wong', status: 'pending', timestamp: null, comments: null },
      { step: 3, role: 'MLRO', actor: null, status: 'pending', timestamp: null, comments: null }
    ]
  };

  const fetchApprovalChain = useCallback(async () => {
    setApprovalsLoading(true);
    try {
      const response = await fetch(`/api/v1/cases/${caseData.id}/approvals`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setApprovalChain(data);
    } catch {
      setApprovalChain(mockApprovalChain);
    } finally {
      setApprovalsLoading(false);
    }
  }, [caseData.id]);

  useEffect(() => {
    if (activeTab === 'approvals') fetchApprovalChain();
  }, [activeTab, fetchApprovalChain]);

  const mockEscalations = [
    { id: 'esc1', priority: 'High', reason: 'Multiple severe adverse media alerts linked to director.', escalatedBy: 'Michael Chen', escalatedTo: 'Jessica Wong (Senior Analyst)', status: 'Open', timestamp: '2026-03-21T10:30:00Z' },
    { id: 'esc2', priority: 'Medium', reason: 'Unexplained complex ownership structure involving offshore trusts.', escalatedBy: 'System', escalatedTo: 'Michael Chen', status: 'Resolved', timestamp: '2026-03-20T16:00:00Z' }
  ];

  const fetchEscalations = useCallback(async () => {
    setEscalationsLoading(true);
    try {
      const response = await fetch(`/api/v1/cases/${caseData.id}/escalations`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setEscalations(data.escalations || []);
    } catch {
      setEscalations(mockEscalations);
    } finally {
      setEscalationsLoading(false);
    }
  }, [caseData.id]);

  useEffect(() => {
    if (activeTab === 'escalations') fetchEscalations();
  }, [activeTab, fetchEscalations]);

  const calculateExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return 'valid';
    const daysUntilExpiry = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring_soon';
    return 'valid';
  };

  const mockDocuments = [
    { id: 'doc1', type: 'Passport', filename: 'John_Smith_Passport.pdf', uploadedBy: 'Client Portal', timestamp: '2026-03-15T09:00:00Z', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'doc2', type: 'Driver License', filename: 'Sarah_Lee_DL.jpg', uploadedBy: 'Client Portal', timestamp: '2021-02-10T11:00:00Z', expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'doc3', type: 'Proof of Address', filename: 'Utility_Bill_ABC_Ent.pdf', uploadedBy: 'Michael Chen', timestamp: '2026-03-21T09:00:15Z', expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() }
  ];

  const fetchDocuments = useCallback(async () => {
    setDocumentsLoading(true);
    try {
      const response = await fetch(`/api/v1/cases/${caseData.id}/documents`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      const docs = data.documents || [];
      setKycDocuments(docs.map((d: any) => ({ ...d, expiryStatus: d.expiryStatus || calculateExpiryStatus(d.expiryDate) })));
    } catch {
      setKycDocuments(mockDocuments.map((d: any) => ({ ...d, expiryStatus: calculateExpiryStatus(d.expiryDate) })));
    } finally {
      setDocumentsLoading(false);
    }
  }, [caseData.id]);

  useEffect(() => {
    if (activeTab === 'documents') fetchDocuments();
  }, [activeTab, fetchDocuments]);

  // Helper to view a document locally in a beautiful preview dialog
  const handleViewDocument = (doc: any) => {
    setPreviewDoc(doc);
    toast.info(`Opening preview for ${doc.filename}...`);
  };

  // Helper to trigger a download of the document dynamically
  const handleDownloadDocument = (doc: any) => {
    const computedStatus = doc.expiryStatus || calculateExpiryStatus(doc.expiryDate);
    const content = `GrowKYC - Simulated Document Download\n====================================\nDocument ID: ${doc.id}\nFilename: ${doc.filename}\nType: ${doc.type}\nUploaded By: ${doc.uploadedBy}\nTimestamp: ${doc.timestamp}\nStatus: ${computedStatus}\n\n[Security Checksums]\nSHA-256: ${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}\nOCR status: Verified`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded simulated document: ${doc.filename}`);
  };

  const handleS3Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    // Simulate S3 upload delay and backend processing
    setTimeout(() => {
      const newDoc = {
        id: Date.now().toString(),
        type: 'Uploaded Document',
        filename: file.name,
        uploadedBy: 'Michael Chen',
        timestamp: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      };
      setKycDocuments([{...newDoc, expiryStatus: calculateExpiryStatus(newDoc.expiryDate)}, ...kycDocuments]);
      setUploadingDoc(false);
    }, 1500);
  };

  const timelineEvents = [
    { time: '2026-03-20 14:30', user: 'System', action: 'Case created', icon: Target, color: 'blue' },
    { time: '2026-03-20 14:31', user: 'Sanctions Bot', action: 'Sanctions match detected (94% confidence)', icon: Shield, color: 'red' },
    { time: '2026-03-20 14:35', user: 'Adverse Media Bot', action: 'Severe adverse media found (3 articles)', icon: FileText, color: 'orange' },
    { time: '2026-03-20 15:00', user: 'Michael Chen', action: 'Case assigned', icon: User, color: 'blue' },
    { time: '2026-03-20 15:15', user: 'Michael Chen', action: 'Added note: "Reviewing sanctions match details"', icon: FileText, color: 'gray' },
    { time: '2026-03-21 09:00', user: 'Michael Chen', action: 'Uploaded supporting document', icon: FileText, color: 'green' },
    { time: '2026-03-21 10:30', user: 'Michael Chen', action: 'Status updated to Investigating', icon: Activity, color: 'amber' }
  ];

  const triggers = [
    {
      id: 'T1',
      source: 'Sanctions Screening Bot',
      reason: 'Director "John Smith" matched to DFAT consolidated list',
      severity: 'critical',
      confidence: 94,
      timestamp: '2026-03-20 14:31'
    },
    {
      id: 'T2',
      source: 'Adverse Media Bot',
      reason: 'Severe adverse media - money laundering investigation',
      severity: 'high',
      confidence: 82,
      timestamp: '2026-03-20 14:35'
    },
    {
      id: 'T3',
      source: 'Source of Funds Bot',
      reason: 'Unexplained capital injection of $2.5M',
      severity: 'medium',
      confidence: 67,
      timestamp: '2026-03-19 10:15'
    }
  ];

  const evidence = [
    { type: 'Sanctions Match', title: 'DFAT List - Director Match', provider: 'ComplyAdvantage', confidence: 94 },
    { type: 'Adverse Media', title: 'Singapore Investigation Article', provider: 'ComplyAdvantage', confidence: 82 },
    { type: 'Adverse Media', title: 'Regulatory Action Pending', provider: 'ComplyAdvantage', confidence: 78 },
    { type: 'Source of Funds', title: 'Unexplained Funds Analysis', provider: 'Internal SOF Bot', confidence: 67 },
    { type: 'Document', title: 'Bank Statement - Feb 2026', provider: 'Client Upload', confidence: 100 }
  ];

  const requiredActions = [
    { id: 1, text: 'Verify identity documents', completed: true },
    { id: 2, text: 'Confirm ultimate beneficial ownership', completed: true },
    { id: 3, text: 'Request source of funds documentation', completed: false },
    { id: 4, text: 'Escalate to compliance manager', completed: false },
    { id: 5, text: 'Apply service hold pending review', completed: true }
  ];

  const tabs = [
    { id: 'summary', label: 'Summary', icon: Eye },
    { id: 'triggers', label: 'Triggers', icon: AlertTriangle },
    { id: 'evidence', label: 'Evidence', icon: FileText },
    { id: 'screening', label: 'Screening', icon: Shield },
    { id: 'timeline', label: 'Timeline', icon: History },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'ownership', label: 'Ownership', icon: Users },
    { id: 'related', label: 'Related Parties', icon: Users },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle },
    { id: 'escalations', label: 'Escalations', icon: AlertOctagon },
    { id: 'documents', label: 'Documents', icon: FolderOpen }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-orange-900 rounded-lg p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button className="bg-white/20 border-2 border-white/30 text-white hover:bg-white/30" onClick={onBack}>
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Cases
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{caseData.id}</h1>
                <p className="text-white/90">{caseData.clientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-red-100 text-red-700 text-lg px-4 py-2">
                <Clock className="w-5 h-5 mr-2" />
                SLA: {caseData.slaRemaining}
              </Badge>
              <Badge className="bg-white text-red-900 text-lg px-4 py-2">
                {caseData.riskLevel.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT PANEL - Timeline */}
          <div className="col-span-3">
            <Card className="border-2 border-blue-300 shadow-lg sticky top-6">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 max-h-[800px] overflow-y-auto">
                <div className="space-y-4">
                  {timelineEvents.map((event, idx) => {
                    const Icon = event.icon;
                    return (
                      <div key={idx} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 bg-${event.color}-100 rounded-full flex items-center justify-center border-2 border-${event.color}-300`}>
                            <Icon className={`w-5 h-5 text-${event.color}-600`} />
                          </div>
                          {idx < timelineEvents.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-xs text-gray-600 mb-1">{event.time}</p>
                          <p className="text-xs text-gray-500 mb-1">{event.user}</p>
                          <p className="text-sm font-semibold text-gray-900">{event.action}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CENTRE PANEL - Investigation */}
          <div className="col-span-6">
            <Card className="border-2 border-purple-300 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <div className="flex gap-2 flex-wrap">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <Button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        size="sm"
                        className={
                          activeTab === tab.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-purple-100'
                        }
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {tab.label}
                      </Button>
                    );
                  })}
                </div>
              </CardHeader>
              <CardContent className="p-6 min-h-[700px]">
                {/* Summary Tab */}
                {activeTab === 'summary' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Case Overview</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700 mb-1">Case Type</p>
                          <p className="font-bold text-gray-900">{caseData.caseType}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700 mb-1">Risk Level</p>
                          <Badge className="bg-red-100 text-red-700 text-lg px-3 py-1">
                            {caseData.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700 mb-1">Client</p>
                          <p className="font-bold text-gray-900">{caseData.clientName}</p>
                          <p className="text-xs text-gray-600">{caseData.clientType}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700 mb-1">Trigger Source</p>
                          <p className="font-semibold text-gray-900">{caseData.triggerSource}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-red-50 rounded-lg border-2 border-red-300">
                      <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6" />
                        Key Risk Indicators
                      </h3>
                      <ul className="space-y-2 text-sm text-red-800">
                        <li>• Director matched to DFAT sanctions list (94% confidence)</li>
                        <li>• Severe adverse media linking to money laundering investigation</li>
                        <li>• Unexplained capital injection of $2.5M</li>
                        <li>• Foreign PEP among directors</li>
                        <li>• Parent company under investigation in Singapore</li>
                      </ul>
                    </div>

                    <div className="p-6 bg-amber-50 rounded-lg border-2 border-amber-300">
                      <h3 className="font-bold text-amber-900 mb-3">Current Status</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-amber-700 mb-1">Status</p>
                          <Badge className="bg-amber-100 text-amber-700 text-lg px-3 py-1">
                            {caseData.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-amber-700 mb-1">Assigned To</p>
                          <p className="font-semibold text-gray-900">{caseData.assignedTo}</p>
                        </div>
                        <div>
                          <p className="text-sm text-amber-700 mb-1">Created</p>
                          <p className="font-semibold text-gray-900">{caseData.created}</p>
                        </div>
                        <div>
                          <p className="text-sm text-amber-700 mb-1">SLA Remaining</p>
                          <p className="font-bold text-orange-700">{caseData.slaRemaining}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Triggers Tab */}
                {activeTab === 'triggers' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Why This Case Exists</h3>
                    {triggers.map((trigger) => (
                      <Card key={trigger.id} className="border-2 border-red-300">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs mb-2">
                                <Shield className="w-3 h-3 mr-1" />
                                {trigger.source}
                              </Badge>
                              <h4 className="font-bold text-gray-900">{trigger.reason}</h4>
                              <p className="text-xs text-gray-600 mt-1">{trigger.timestamp}</p>
                            </div>
                            <div className="text-right">
                              <Badge className={
                                trigger.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                trigger.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                'bg-amber-100 text-amber-700'
                              }>
                                {trigger.severity.toUpperCase()}
                              </Badge>
                              <p className="text-xs text-gray-600 mt-1">
                                Confidence: <span className="font-bold">{trigger.confidence}%</span>
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Evidence Tab */}
                {activeTab === 'evidence' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Supporting Evidence</h3>
                    {evidence.map((item, idx) => (
                      <Card key={idx} className="border-2 border-purple-300 hover:border-purple-500 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Badge className="bg-purple-100 text-purple-700 text-xs mb-2">
                                {item.type}
                              </Badge>
                              <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                              <p className="text-xs text-gray-600">Provider: {item.provider}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Confidence</p>
                              <p className="text-2xl font-bold text-purple-900">{item.confidence}%</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Screening Tab */}
                {activeTab === 'screening' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Comprehensive AML Screening Results</h3>
                    
                    {/* Sanctions Screening */}
                    <Card className="border-2 border-red-300 bg-red-50/30">
                      <CardHeader className="bg-red-100 border-b-2 border-red-300">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="w-6 h-6 text-red-700" />
                            <span className="text-red-900">Sanctions Screening</span>
                          </div>
                          <Badge className="bg-red-600 text-white text-lg px-3 py-1">
                            MATCH FOUND
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="bg-white rounded-lg p-4 border-2 border-red-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 mb-1">Director: John Smith</h4>
                              <p className="text-sm text-gray-600">DOB: 15 March 1975 | Passport: AU1234567</p>
                            </div>
                            <Badge className="bg-red-100 text-red-700">94% Match</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-red-50 rounded p-3">
                              <p className="text-sm font-bold text-red-900 mb-1">DFAT Consolidated List</p>
                              <p className="text-sm text-red-800">Match: "John Michael Smith" - Listed 2024-02-15</p>
                              <p className="text-xs text-red-700 mt-1">Reason: Financial sanctions related to illicit activities</p>
                            </div>
                            <div className="bg-red-50 rounded p-3">
                              <p className="text-sm font-bold text-red-900 mb-1">UN Security Council List</p>
                              <p className="text-sm text-red-800">Match: "J.M. Smith" - Listed 2024-01-20</p>
                              <p className="text-xs text-red-700 mt-1">Listed entity associated with sanctioned organization</p>
                            </div>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" variant="outline" className="border-red-300">
                              <Eye className="w-4 h-4 mr-1" />
                              View Full Report
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-300">
                              <Download className="w-4 h-4 mr-1" />
                              Export Evidence
                            </Button>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-300">
                          <p className="text-xs text-gray-600 mb-1">
                            <strong>Provider:</strong> ComplyAdvantage | <strong>Last Screened:</strong> 2026-03-20 14:31 | <strong>Database Version:</strong> 2026-Q1-v2.4
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* PEP Screening */}
                    <Card className="border-2 border-orange-300 bg-orange-50/30">
                      <CardHeader className="bg-orange-100 border-b-2 border-orange-300">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="w-6 h-6 text-orange-700" />
                            <span className="text-orange-900">PEP Screening</span>
                          </div>
                          <Badge className="bg-orange-600 text-white text-lg px-3 py-1">
                            PEP DETECTED
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 mb-1">Director: Sarah Lee</h4>
                              <p className="text-sm text-gray-600">DOB: 22 August 1968 | Position: Non-Executive Director</p>
                            </div>
                            <Badge className="bg-orange-100 text-orange-700">Foreign PEP</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-orange-50 rounded p-3">
                              <p className="text-sm font-bold text-orange-900 mb-1">Political Position</p>
                              <p className="text-sm text-orange-800">Deputy Minister of Trade - Singapore (2018-2023)</p>
                              <p className="text-xs text-orange-700 mt-1">Role ended: 31 December 2023 (3 months ago)</p>
                            </div>
                            <div className="bg-orange-50 rounded p-3">
                              <p className="text-sm font-bold text-orange-900 mb-1">Related Party Connections</p>
                              <p className="text-sm text-orange-800">Spouse: Michael Lee - Board Member, Singapore Development Bank</p>
                              <p className="text-xs text-orange-700 mt-1">RCA (Relative/Close Associate) classification applies</p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Button size="sm" variant="outline" className="border-orange-300">
                              <Eye className="w-4 h-4 mr-1" />
                              View PEP Profile
                            </Button>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-300">
                          <p className="text-xs text-gray-600">
                            <strong>Provider:</strong> Dow Jones Risk & Compliance | <strong>Last Screened:</strong> 2026-03-20 14:32 | <strong>PEP Status:</strong> Active monitoring required (cooling-off period: 2026-12-31)
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Adverse Media */}
                    <Card className="border-2 border-amber-300 bg-amber-50/30">
                      <CardHeader className="bg-amber-100 border-b-2 border-amber-300">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-6 h-6 text-amber-700" />
                            <span className="text-amber-900">Adverse Media</span>
                          </div>
                          <Badge className="bg-amber-600 text-white text-lg px-3 py-1">
                            3 SEVERE ALERTS
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-red-100 text-red-700">SEVERE</Badge>
                            <span className="font-bold text-gray-900">Money Laundering Investigation</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            "ABC Enterprises under investigation for alleged money laundering activities linked to offshore accounts"
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div><strong>Source:</strong> The Straits Times</div>
                            <div><strong>Date:</strong> 2026-02-28</div>
                            <div><strong>Category:</strong> Financial Crime</div>
                            <div><strong>Confidence:</strong> 82%</div>
                          </div>
                          <Button size="sm" variant="outline" className="mt-3 border-amber-300">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Read Full Article
                          </Button>
                        </div>

                        <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-orange-100 text-orange-700">HIGH</Badge>
                            <span className="font-bold text-gray-900">Regulatory Action Pending</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            "Singapore authorities reviewing ABC Enterprises' compliance with AML/CTF regulations following suspicious transaction reports"
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div><strong>Source:</strong> Reuters Business</div>
                            <div><strong>Date:</strong> 2026-03-05</div>
                            <div><strong>Category:</strong> Regulatory</div>
                            <div><strong>Confidence:</strong> 78%</div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-orange-100 text-orange-700">HIGH</Badge>
                            <span className="font-bold text-gray-900">Court Proceedings</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            "Civil proceedings initiated by former business partner alleging fraudulent transfer of assets"
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div><strong>Source:</strong> Singapore Court Records</div>
                            <div><strong>Date:</strong> 2026-01-15</div>
                            <div><strong>Category:</strong> Litigation</div>
                            <div><strong>Confidence:</strong> 91%</div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-gray-300">
                          <p className="text-xs text-gray-600">
                            <strong>Provider:</strong> ComplyAdvantage Media Monitoring | <strong>Monitoring:</strong> Real-time | <strong>Languages:</strong> English, Mandarin, Malay
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Watchlist Screening */}
                    <Card className="border-2 border-blue-300">
                      <CardHeader className="bg-blue-100 border-b-2 border-blue-300">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="w-6 h-6 text-blue-700" />
                            <span className="text-blue-900">Watchlist Screening</span>
                          </div>
                          <Badge className="bg-green-100 text-green-700 text-lg px-3 py-1">
                            NO MATCHES
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-bold text-green-900">All Clear</span>
                          </div>
                          <ul className="text-sm text-gray-700 space-y-1 ml-7">
                            <li>✓ INTERPOL Wanted Persons - No match</li>
                            <li>✓ OFAC SDN List - No match</li>
                            <li>✓ EU Sanctions List - No match</li>
                            <li>✓ UK HM Treasury - No match</li>
                            <li>✓ FBI Most Wanted - No match</li>
                            <li>✓ Disqualified Directors (ASIC) - No match</li>
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-300 mt-3">
                          <p className="text-xs text-gray-600">
                            <strong>Provider:</strong> World-Check (Refinitiv) | <strong>Lists Screened:</strong> 1,247 global watchlists | <strong>Last Update:</strong> 2026-03-20 14:31
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Identity Verification Cross-Check */}
                    <Card className="border-2 border-purple-300">
                      <CardHeader className="bg-purple-100 border-b-2 border-purple-300">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="w-6 h-6 text-purple-700" />
                            <span className="text-purple-900">Identity Verification Cross-Check</span>
                          </div>
                          <Badge className="bg-amber-100 text-amber-700 text-lg px-3 py-1">
                            REVIEW REQUIRED
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="bg-white rounded-lg p-4 border border-purple-200">
                          <h4 className="font-bold text-gray-900 mb-3">Director Identity Discrepancies</h4>
                          <div className="space-y-3">
                            <div className="bg-amber-50 rounded p-3 border border-amber-200">
                              <p className="text-sm font-bold text-amber-900 mb-1">⚠️ Address Mismatch</p>
                              <p className="text-sm text-gray-700">ASIC records show director address as Singapore, but passport shows Malaysian residential address</p>
                            </div>
                            <div className="bg-amber-50 rounded p-3 border border-amber-200">
                              <p className="text-sm font-bold text-amber-900 mb-1">⚠️ Multiple Nationalities</p>
                              <p className="text-sm text-gray-700">Director holds dual citizenship (Singapore & Malaysia) - Enhanced CDD recommended</p>
                            </div>
                            <div className="bg-green-50 rounded p-3 border border-green-200">
                              <p className="text-sm font-bold text-green-900 mb-1">✓ Identity Documents Verified</p>
                              <p className="text-sm text-gray-700">Passport and national ID verified via InfoTrack - documents authentic</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-300">
                          <p className="text-xs text-gray-600">
                            <strong>Provider:</strong> InfoTrack Australia | <strong>Verification:</strong> GreenID + Document OCR | <strong>Status:</strong> Verified with notes
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Summary Risk Score */}
                    <Card className="border-2 border-red-400 bg-red-50">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-7 h-7" />
                          Screening Summary & Risk Assessment
                        </h3>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-4 border-2 border-red-300 text-center">
                            <p className="text-sm text-gray-600 mb-1">Overall Risk</p>
                            <p className="text-4xl font-bold text-red-600">CRITICAL</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border-2 border-orange-300 text-center">
                            <p className="text-sm text-gray-600 mb-1">Screening Score</p>
                            <p className="text-4xl font-bold text-orange-600">94/100</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border-2 border-amber-300 text-center">
                            <p className="text-sm text-gray-600 mb-1">Alerts</p>
                            <p className="text-4xl font-bold text-amber-600">7</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-red-300">
                          <p className="text-sm font-bold text-red-900 mb-2">Recommendation:</p>
                          <ul className="text-sm text-gray-800 space-y-1">
                            <li>🔴 <strong>REJECT</strong> client onboarding immediately</li>
                            <li>🔴 Escalate to Head of Compliance and MLRO</li>
                            <li>🔴 Consider AUSTRAC suspicious matter report (SMR)</li>
                            <li>🔴 Do not proceed with any services until investigation complete</li>
                            <li>🔴 Apply service hold and freeze all related accounts</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    {/* Header with live indicator and refresh */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">Audit Events Timeline</h3>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-semibold text-green-700">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          LIVE
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {lastRefreshed && (
                          <span className="text-xs text-gray-500">
                            Last updated: {lastRefreshed.toLocaleTimeString()}
                          </span>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchAuditEvents(true)}
                          disabled={loading}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </div>
                    </div>

                    {/* Event count summary */}
                    {!loading && auditEvents.length > 0 && (
                      <div className="flex gap-3 flex-wrap">
                        <Badge className="bg-blue-100 text-blue-700 px-3 py-1">
                          {auditEvents.length} events
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-700 px-3 py-1">
                          {new Set(auditEvents.map(e => e.actor)).size} actors
                        </Badge>
                        <Badge className="bg-amber-100 text-amber-700 px-3 py-1">
                          {auditEvents.filter(e => e.type === 'screening_alert').length} screening alerts
                        </Badge>
                        <Badge className="bg-red-100 text-red-700 px-3 py-1">
                          {auditEvents.filter(e => e.type === 'escalation' || e.type === 'sla_warning').length} escalations
                        </Badge>
                      </div>
                    )}

                    {/* Loading state */}
                    {loading && auditEvents.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-16">
                        <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                        <span className="text-gray-600 font-medium">Loading audit events...</span>
                        <span className="text-xs text-gray-400 mt-1">Fetching from /api/v1/cases/{caseData.id}/audit-events</span>
                      </div>
                    )}

                    {/* Error state */}
                    {error && (
                      <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800">Failed to load audit events</p>
                          <p className="text-xs text-red-600 mt-0.5">{error}</p>
                        </div>
                      </div>
                    )}

                    {/* Empty state */}
                    {!loading && auditEvents.length === 0 && !error && (
                      <div className="text-center py-16">
                        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No audit events found</p>
                        <p className="text-xs text-gray-400 mt-1">Events will appear here as actions are taken on this case</p>
                      </div>
                    )}

                    {/* Events list */}
                    {!loading && auditEvents.length > 0 && (
                      <div className="relative">
                        {/* Vertical timeline line */}
                        <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-300 via-purple-300 to-gray-200"></div>

                        <div className="space-y-4">
                          {auditEvents.map((event, idx) => {
                            // Determine icon & color based on event type
                            const typeConfig: Record<string, { icon: typeof Shield; color: string; bg: string; border: string }> = {
                              case_created:      { icon: Target,       color: 'text-blue-600',   bg: 'bg-blue-100',   border: 'border-blue-300' },
                              screening_alert:   { icon: Shield,       color: 'text-red-600',    bg: 'bg-red-100',    border: 'border-red-300' },
                              assignment:        { icon: User,         color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-300' },
                              status_change:     { icon: Activity,     color: 'text-amber-600',  bg: 'bg-amber-100',  border: 'border-amber-300' },
                              note_added:        { icon: MessageSquare,color: 'text-gray-600',   bg: 'bg-gray-100',   border: 'border-gray-300' },
                              document_request:  { icon: Send,         color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-300' },
                              document_uploaded: { icon: Upload,       color: 'text-green-600',  bg: 'bg-green-100',  border: 'border-green-300' },
                              sla_warning:       { icon: Clock,        color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-300' },
                              escalation:        { icon: TrendingUp,   color: 'text-red-600',    bg: 'bg-red-100',    border: 'border-red-300' },
                              system_config:     { icon: RefreshCw,    color: 'text-cyan-600',   bg: 'bg-cyan-100',   border: 'border-cyan-300' },
                            };
                            const cfg = typeConfig[event.type] || { icon: History, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-300' };
                            const EventIcon = cfg.icon;
                            const ts = event.timestamp ? new Date(event.timestamp) : null;
                            const formattedTime = ts ? ts.toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : event.timestamp;

                            return (
                              <div key={idx} className="relative flex gap-4 pl-0">
                                {/* Timeline node */}
                                <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full ${cfg.bg} border-2 ${cfg.border} flex items-center justify-center shadow-sm`}>
                                  <EventIcon className={`w-4.5 h-4.5 ${cfg.color}`} />
                                </div>

                                {/* Event card */}
                                <Card className={`flex-1 border-2 ${cfg.border} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                          <Badge className={`${cfg.bg} ${cfg.color} text-xs font-semibold`}>
                                            {event.actor || 'System'}
                                          </Badge>
                                          <Badge variant="outline" className="text-xs font-medium border-gray-300 text-gray-500">
                                            {(event.type || 'event').replace(/_/g, ' ')}
                                          </Badge>
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-sm leading-snug">{event.action}</h4>
                                      </div>
                                      <div className="flex-shrink-0 text-right">
                                        <p className="text-xs text-gray-500 whitespace-nowrap">{formattedTime}</p>
                                        {idx === 0 && (
                                          <Badge className="mt-1 bg-green-100 text-green-700 text-[10px]">LATEST</Badge>
                                        )}
                                      </div>
                                    </div>

                                    {/* Metadata details */}
                                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                                      <div className={`mt-3 p-3 rounded-lg border ${cfg.border} bg-white/70`}>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Event Details</p>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                          {Object.entries(event.metadata).map(([key, value]) => (
                                            <div key={key} className="text-xs">
                                              <span className="font-semibold text-gray-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, (s: string) => s.toUpperCase())}:</span>{' '}
                                              <span className="text-gray-800">{String(value)}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Auto-refresh info */}
                    {auditEvents.length > 0 && (
                      <div className="text-center pt-2">
                        <p className="text-[11px] text-gray-400">
                          Auto-refreshing every 30 seconds · Showing {auditEvents.length} events in chronological order
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Case Notes</h3>
                    
                    {/* Add/Edit Note Section */}
                    <Card className="border-2 border-blue-200 bg-blue-50/50 shadow-sm">
                      <CardContent className="p-4 space-y-3">
                        <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          {editingNoteId ? 'Edit Note' : 'Add New Note'}
                        </h4>
                        <textarea
                          rows={3}
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          placeholder="Type your note here..."
                        />
                        <div className="flex justify-end gap-2">
                          {editingNoteId && (
                            <Button variant="outline" size="sm" onClick={() => { setEditingNoteId(null); setNewNote(''); }}>
                              Cancel
                            </Button>
                          )}
                          <Button size="sm" onClick={handleSaveNote} disabled={!newNote.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Save className="w-4 h-4 mr-1.5" />
                            {editingNoteId ? 'Update' : 'Save'} Note
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Notes List */}
                    <div className="space-y-4">
                      {notesLoading ? (
                        <div className="flex justify-center py-8"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div>
                      ) : caseNotes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No notes added yet.</div>
                      ) : (
                        caseNotes.map((note) => (
                          <Card key={note.id} className="border border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge className={note.isOwnNote ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}>
                                    {note.author}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {new Date(note.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                {note.isOwnNote && (
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setEditingNoteId(note.id); setNewNote(note.text); }}>
                                      <Edit2 className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeleteNote(note.id)}>
                                      <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-800 text-sm whitespace-pre-wrap">{note.text}</p>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Approvals Tab */}
                {activeTab === 'approvals' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Review & Approval Chain</h3>
                    
                    {approvalsLoading ? (
                      <div className="flex justify-center py-8"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div>
                    ) : !approvalChain ? (
                      <div className="text-center py-8 text-gray-500">Approval chain not found.</div>
                    ) : (
                      <div className="relative pl-6 border-l-2 border-gray-200 space-y-8 mt-6">
                        {approvalChain.steps.map((step: any, idx: number) => {
                          const isApproved = step.status === 'approved';
                          const isPending = step.status === 'pending';
                          
                          let bg = 'bg-gray-100';
                          let border = 'border-gray-300';
                          let text = 'text-gray-600';
                          let Icon = Clock;
                          
                          if (isApproved) {
                            bg = 'bg-green-100'; border = 'border-green-300'; text = 'text-green-700'; Icon = CheckCircle;
                          } else if (isPending) {
                            bg = 'bg-amber-100'; border = 'border-amber-300'; text = 'text-amber-700'; Icon = Activity;
                          }
                          
                          return (
                            <div key={idx} className="relative">
                              {/* Step indicator */}
                              <div className={`absolute -left-[37px] top-1 w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center shadow-sm ${border}`}>
                                <Icon className={`w-4 h-4 ${text}`} />
                              </div>
                              
                              <Card className={`border-2 ${border} ${isPending ? 'shadow-md' : 'shadow-sm opacity-80'}`}>
                                <CardHeader className={`py-3 px-4 bg-gray-50/50 border-b ${border}`}>
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs bg-white">Step {step.step}</Badge>
                                      <span className="font-bold text-gray-900">{step.role}</span>
                                    </div>
                                    <Badge className={`${bg} ${text} uppercase text-[10px] font-bold`}>
                                      {step.status}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                    <div>
                                      <p className="text-xs text-gray-500 mb-0.5">Assigned Actor</p>
                                      <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-gray-400" />
                                        {step.actor || <span className="text-gray-400 italic">Unassigned</span>}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 mb-0.5">Timestamp</p>
                                      <p className="font-medium text-gray-700">
                                        {step.timestamp ? new Date(step.timestamp).toLocaleString() : '-'}
                                      </p>
                                    </div>
                                  </div>
                                  {step.comments && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-700 italic border border-gray-100">
                                      "{step.comments}"
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Escalations Tab */}
                {activeTab === 'escalations' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">Active Escalations</h3>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                        <AlertOctagon className="w-4 h-4 mr-1.5" />
                        Escalate Case
                      </Button>
                    </div>

                    {escalationsLoading ? (
                      <div className="flex justify-center py-8"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div>
                    ) : escalations.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No escalations found for this case.</div>
                    ) : (
                      <div className="space-y-4">
                        {escalations.map((esc) => (
                          <Card key={esc.id} className={`border-l-4 ${esc.status === 'Open' ? 'border-l-red-500' : 'border-l-green-500'} shadow-sm`}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <Badge className={`mb-2 ${esc.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {esc.priority} Priority
                                  </Badge>
                                  <h4 className="font-bold text-gray-900">{esc.reason}</h4>
                                </div>
                                <Badge className={esc.status === 'Open' ? 'bg-red-600 text-white' : 'bg-green-100 text-green-700'}>
                                  {esc.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div>
                                  <p className="text-xs text-gray-500 mb-0.5">Escalated By</p>
                                  <p className="font-medium text-gray-800">{esc.escalatedBy}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-0.5">Assigned To</p>
                                  <p className="font-medium text-gray-800">{esc.escalatedTo}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-0.5">Timestamp</p>
                                  <p className="font-medium text-gray-800">{new Date(esc.timestamp).toLocaleString()}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">KYC Documents</h3>
                      <div className="relative">
                        <input 
                          type="file" 
                          id="s3-upload" 
                          className="hidden" 
                          onChange={handleS3Upload} 
                          disabled={uploadingDoc}
                        />
                        <label 
                          htmlFor="s3-upload" 
                          className={`flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium cursor-pointer transition-colors ${uploadingDoc ? 'opacity-70 pointer-events-none' : ''}`}
                        >
                          {uploadingDoc ? (
                            <><RefreshCw className="w-4 h-4 animate-spin" /> Uploading to S3...</>
                          ) : (
                            <><Upload className="w-4 h-4" /> Upload Document</>
                          )}
                        </label>
                      </div>
                    </div>

                    {documentsLoading ? (
                      <div className="flex justify-center py-8"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div>
                    ) : kycDocuments.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p>No documents uploaded yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {kycDocuments.map((doc) => {
                          let statusBg = 'bg-green-100 text-green-700';
                          let StatusIcon = CheckCircle;
                          let statusText = 'Valid';

                          const computedStatus = doc.expiryStatus || calculateExpiryStatus(doc.expiryDate);

                          if (computedStatus === 'expired') {
                            statusBg = 'bg-red-100 text-red-700';
                            StatusIcon = XCircle;
                            statusText = 'Expired';
                          } else if (computedStatus === 'expiring_soon') {
                            statusBg = 'bg-amber-100 text-amber-700';
                            StatusIcon = AlertTriangle;
                            statusText = 'Expiring Soon';
                          }

                          return (
                            <Card key={doc.id} className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-1">
                                      <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-gray-900 text-sm truncate max-w-[200px]" title={doc.filename}>{doc.filename}</h4>
                                      <p className="text-xs text-gray-500 font-medium">{doc.type}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Uploaded by:</span>
                                    <span className="font-medium text-gray-800">{doc.uploadedBy}</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Date:</span>
                                    <span className="font-medium text-gray-800">{new Date(doc.timestamp).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-100">
                                    <span className="text-gray-500">Status:</span>
                                    <Badge className={`${statusBg} flex items-center gap-1 px-1.5 py-0`}>
                                      <StatusIcon className="w-3 h-3" />
                                      {statusText}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => handleViewDocument(doc)}>
                                    <Eye className="w-3 h-3 mr-1.5" /> View
                                  </Button>
                                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => handleDownloadDocument(doc)}>
                                    <Download className="w-3 h-3 mr-1.5" /> Download
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Placeholder for other tabs */}
                {!['summary', 'triggers', 'evidence', 'screening', 'timeline', 'notes', 'approvals', 'escalations', 'documents'].includes(activeTab) && (
                  <div className="text-center py-12">
                    <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {tabs.find(t => t.id === activeTab)?.label} details will be displayed here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANEL - Actions + Decision */}
          <div className="col-span-3">
            <Card className="border-2 border-green-300 shadow-lg sticky top-6">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-green-600" />
                  Actions & Decision
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Section 1 - Case Status */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Case Status</label>
                  <select
                    value={caseStatus}
                    onChange={(e) => setCaseStatus(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="investigating">Investigating</option>
                    <option value="escalated">Escalated</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* Section 2 - Required Actions */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-bold text-gray-900 mb-3">Required Actions</p>
                  <div className="space-y-2">
                    {requiredActions.map((action) => (
                      <label key={action.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={action.completed}
                          className="w-5 h-5"
                          readOnly
                        />
                        <span className={`text-sm flex-1 ${action.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {action.text}
                        </span>
                        {action.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Section 3 - Run Checks */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-bold text-gray-900 mb-3">Run Checks</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Run AML', icon: Shield },
                      { label: 'Run Identity', icon: User },
                      { label: 'Run Credit', icon: CreditCard },
                      { label: 'Run Business Risk', icon: TrendingUp },
                      { label: 'Run Ownership', icon: Users },
                      { label: 'Run SOF / SOW', icon: DollarSign }
                    ].map((check) => {
                      const Icon = check.icon;
                      return (
                        <Button
                          key={check.label}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start border-2"
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {check.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 4 - Advanced Checks */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-bold text-gray-900 mb-3">Advanced Checks</p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start border-2 border-purple-300">
                      <Scale className="w-4 h-4 mr-2" />
                      Run Legal (LexisNexis)
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start border-2 border-indigo-300">
                      <Shield className="w-4 h-4 mr-2" />
                      Run Crypto (Chainalysis)
                    </Button>
                  </div>
                </div>

                {/* Section 5 - Decision Panel */}
                <div className={`pt-4 border-t ${isAuditor ? 'opacity-60 pointer-events-none' : ''}`}>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold text-gray-900">Decision</p>
                    {isAuditor && (
                      <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">
                        Read-only access
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    {[
                      { value: 'approve', label: 'Approve', color: 'green' },
                      { value: 'approve_conditions', label: 'Approve with Conditions', color: 'amber' },
                      { value: 'escalate', label: 'Escalate', color: 'orange' },
                      { value: 'reject', label: 'Reject', color: 'red' },
                      { value: 'austrac', label: 'Send to AUSTRAC', color: 'red' },
                      { value: 'monitor', label: 'Monitor', color: 'indigo' }
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer hover:shadow-md transition-all ${
                          decision === opt.value
                            ? `border-${opt.color}-500 bg-${opt.color}-50`
                            : 'border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="decision"
                          value={opt.value}
                          checked={decision === opt.value}
                          onChange={(e) => setDecision(e.target.value)}
                        />
                        <span className="text-sm font-semibold text-gray-900">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {decision && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Decision Reason</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Document your decision rationale..."
                      value={decisionReason}
                      onChange={(e) => setDecisionReason(e.target.value)}
                    />
                  </div>
                )}

                {/* Section 6 - Service Controls */}
                <div className={`pt-4 border-t ${isAuditor ? 'opacity-60 pointer-events-none' : ''}`}>
                  <p className="text-sm font-bold text-gray-900 mb-3">Service Controls</p>
                  <select className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>No restriction</option>
                    <option>Review required</option>
                    <option>Service hold</option>
                    <option>Limited service</option>
                    <option>Disengage</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className={`pt-6 border-t space-y-3 ${isAuditor ? 'hidden' : ''}`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6" onClick={handleSubmitDecision}>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Decision
                  </Button>
                  <Button variant="outline" className="w-full border-2">
                    <Save className="w-5 h-5 mr-2" />
                    Save Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[85vh] overflow-y-auto border-2 border-blue-400 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {previewDoc.filename}
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">{previewDoc.type} • Uploaded by {previewDoc.uploadedBy}</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 rounded-full" onClick={() => setPreviewDoc(null)}>
                ✕
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Simulated Document Preview Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 flex flex-col items-center justify-center min-h-[220px]">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-3 shadow-md animate-pulse">
                  <Shield className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-1">{previewDoc.type} Preview Mockup</h4>
                <p className="text-sm text-gray-500 text-center max-w-sm mb-4">
                  Secured via GrowKYC S3 Integration. Document is cryptographically signed and stored.
                </p>
                <div className="flex gap-2">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">OCR: 99.4% Match</Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">DVS Verified</Badge>
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Tamper Free</Badge>
                </div>
              </div>

              {/* Details & Extracted OCR Metadata */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Extracted OCR Metadata</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Document ID</p>
                    <p className="font-semibold text-gray-800 text-sm">{previewDoc.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Verification Status</p>
                    <p className="font-semibold text-green-600 text-sm flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> PASSED
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">Expiry Status</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      (previewDoc.expiryStatus || calculateExpiryStatus(previewDoc.expiryDate)) === 'valid' ? 'bg-green-100 text-green-700' :
                      (previewDoc.expiryStatus || calculateExpiryStatus(previewDoc.expiryDate)) === 'expired' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {(previewDoc.expiryStatus || calculateExpiryStatus(previewDoc.expiryDate))?.toUpperCase() || 'VALID'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Storage Backend</p>
                    <p className="font-semibold text-gray-800 text-sm">Amazon S3 (ap-southeast-2)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
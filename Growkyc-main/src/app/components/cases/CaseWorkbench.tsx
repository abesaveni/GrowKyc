import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { toast } from '../../lib/toast';
import { useAuth } from '../../../context/AuthContext';
import { ClientsDB } from '../kyc/ClientsDatabase';
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
  FolderOpen,
  Info,
  Flag,
  ListChecks,
  Package
} from 'lucide-react';
import {
  resolveCaseById,
  saveCaseOverride,
  getApprovalBlockers,
  INFO_REQUEST_TEMPLATES,
  EDD_CHECKLIST_ITEMS,
  logComplianceActivity,
  buildClientProfileSections,
  getActivePersonaId,
  buildCaseTriggers,
  buildCaseEvidence,
  buildCaseScreening,
  buildCaseFinancial,
  buildCaseOwnership,
  buildCaseRelatedParties,
  buildCaseAuditEvents,
  buildCaseApprovalChain,
  buildCaseEscalations,
  buildCaseDocuments,
  getActivePersonaName,
} from './complianceCaseUtils';
import { buildRequiredActionsFromCase } from './complianceCaseSeedData';

type TabType = 'summary' | 'triggers' | 'evidence' | 'screening' | 'financial' | 'ownership' | 'related' | 'notes' | 'timeline' | 'approvals' | 'escalations' | 'documents';

interface CaseWorkbenchProps {
  caseId?: string;
  onBack?: () => void;
  /** Compliance Officer: dynamic case/client data, workflows, and approval rules. */
  complianceOfficerMode?: boolean;
}

export function CaseWorkbench({ caseId, onBack, complianceOfficerMode = false }: CaseWorkbenchProps = {}) {
  const [caseRefreshKey, setCaseRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [caseStatus, setCaseStatus] = useState<string>('investigating');
  const [decision, setDecision] = useState<string>('');
  const [decisionReason, setDecisionReason] = useState<string>('');

  const { user } = useAuth();
  const isReadOnly = user?.role === 'auditor' || user?.role === 'partner' || user?.role === 'read_only_auditor' as any;
  
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
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [showInvestigationModal, setShowInvestigationModal] = useState(false);
  const [showEddModal, setShowEddModal] = useState(false);
  const [showEvidencePackModal, setShowEvidencePackModal] = useState(false);
  const [generatingPack, setGeneratingPack] = useState(false);
  const [infoTemplate, setInfoTemplate] = useState('missing_id');
  const [infoRecipient, setInfoRecipient] = useState('');
  const [infoDueDate, setInfoDueDate] = useState('');
  const [infoReason, setInfoReason] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [investigationReason, setInvestigationReason] = useState('');
  const [investigationRisk, setInvestigationRisk] = useState('high');
  const [investigationDescription, setInvestigationDescription] = useState('');
  const [investigationRestriction, setInvestigationRestriction] = useState('service_hold');
  const [eddChecklist, setEddChecklist] = useState<Record<string, boolean>>({});
  const [eddStatus, setEddStatus] = useState('EDD In Progress');
  const [requiredActions, setRequiredActions] = useState<{ id: number; text: string; completed: boolean }[]>([]);
  const [investigationStatus, setInvestigationStatus] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setCaseRefreshKey((k) => k + 1);
    window.addEventListener('growkyc:cases_updated', handler);
    return () => window.removeEventListener('growkyc:cases_updated', handler);
  }, []);

  const caseRecord = useMemo(
    () => (complianceOfficerMode ? resolveCaseById(caseId) : null),
    [caseId, complianceOfficerMode, caseRefreshKey]
  );
  const clientSections = useMemo(
    () => (complianceOfficerMode && caseRecord ? buildClientProfileSections(caseRecord.client) : null),
    [caseRecord, complianceOfficerMode]
  );

  const caseData = useMemo(() => {
    if (!caseRecord) {
      return {
        id: caseId || '—',
        clientName: '—',
        clientType: '—',
        caseType: '—',
        riskLevel: '—',
        status: '—',
        assignedTo: '—',
        created: '—',
        slaRemaining: '—',
        triggerSource: '—',
      };
    }
    if (!complianceOfficerMode) {
      return {
        id: caseRecord.id,
        clientName: caseRecord.clientName,
        clientType: caseRecord.clientType,
        caseType: caseRecord.caseType,
        riskLevel: caseRecord.riskLevel,
        status: caseRecord.status,
        assignedTo: caseRecord.assignedTo,
        created: caseRecord.created,
        slaRemaining: `${caseRecord.slaRemaining} hours`,
        triggerSource: caseRecord.triggerSource,
      };
    }
    return {
      id: caseRecord.id,
      clientName: caseRecord.clientName,
      clientType: caseRecord.clientType.charAt(0).toUpperCase() + caseRecord.clientType.slice(1),
      caseType: caseRecord.caseType,
      riskLevel: caseRecord.riskLevel.charAt(0).toUpperCase() + caseRecord.riskLevel.slice(1),
      status: caseRecord.status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      assignedTo: caseRecord.assignedTo,
      created: caseRecord.created,
      slaRemaining: caseRecord.slaRemaining > 0 ? `${caseRecord.slaRemaining} hours` : 'OVERDUE',
      triggerSource: caseRecord.triggerSource,
    };
  }, [caseRecord, complianceOfficerMode, caseId]);

  // Reset tab data when a different case is opened
  useEffect(() => {
    setAuditEvents([]);
    setCaseNotes([]);
    setApprovalChain(null);
    setEscalations([]);
    setKycDocuments([]);
    setActiveTab('summary');
    setLastRefreshed(null);
  }, [caseId]);

  useEffect(() => {
    if (!complianceOfficerMode || !caseRecord) return;
    setCaseStatus(caseRecord.status);
    setInfoRecipient(caseRecord.clientName);
    setRequiredActions(buildRequiredActionsFromCase(caseRecord));
    const savedEdd = localStorage.getItem(`growkyc_edd_${caseRecord.id}`);
    if (savedEdd) {
      try {
        const parsed = JSON.parse(savedEdd);
        if (parsed.checklist) setEddChecklist(parsed.checklist);
        if (parsed.status) setEddStatus(parsed.status);
      } catch {
        /* ignore */
      }
    }
    const inv = localStorage.getItem(`growkyc_investigation_${caseRecord.id}`);
    if (inv) setInvestigationStatus(inv);
  }, [caseRecord, complianceOfficerMode]);

  useEffect(() => {
    const tpl = INFO_REQUEST_TEMPLATES[infoTemplate];
    if (tpl) setInfoMessage(tpl.message);
  }, [infoTemplate]);

  const approvalReadiness = useMemo(() => {
    if (!complianceOfficerMode || !caseRecord) {
      return {
        documentsVerified: true,
        screeningComplete: true,
        openInvestigation: false,
        openEdd: false,
        pendingInformation: false,
        unresolvedWarnings: 0,
      };
    }
    const docsOk =
      (caseRecord.client?.documentsData?.pending || 0) === 0 &&
      (caseRecord.client?.documentsData?.total || 0) > 0;
    const screeningOk =
      !caseRecord.client ||
      (!!caseRecord.client.amlData?.lastScreeningDate && caseRecord.client.amlData.sanctionsMatches === 0) ||
      caseRecord.client.amlData.sanctionsMatches >= 0;
    const warnings =
      (caseRecord.client?.amlData?.sanctionsMatches || 0) +
      (caseRecord.client?.amlData?.adverseMediaHits || 0);
    const eddComplete = EDD_CHECKLIST_ITEMS.every((item) => eddChecklist[item]);
    const pendingInfo = caseRecord.client?.quickStatus?.identity === 'Info Requested';
    return {
      documentsVerified: docsOk || !caseRecord.client,
      screeningComplete: !!screeningOk,
      openInvestigation: !!investigationStatus && investigationStatus !== 'Closed',
      openEdd: (caseRecord.client?.riskScores?.overall || 0) >= 75 && !eddComplete,
      pendingInformation: !!pendingInfo,
      unresolvedWarnings: caseRecord.riskLevel === 'critical' ? warnings : 0,
    };
  }, [caseRecord, eddChecklist, investigationStatus, complianceOfficerMode]);

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
    if (complianceOfficerMode && caseRecord) {
      if (decision === 'approve' || decision === 'approve_conditions') {
        const blockers = getApprovalBlockers(caseRecord, approvalReadiness, getActivePersonaId());
        if (blockers.length > 0) {
          blockers.forEach((b) => toast.error('Approval blocked', b.message));
          return;
        }
      }
      if (decision === 'escalate' || decision === 'reject' || decision === 'austrac') {
        saveCaseOverride(caseRecord.id, { status: 'escalated' });
        setCaseStatus('escalated');
      } else if (decision === 'approve' || decision === 'approve_conditions') {
        saveCaseOverride(caseRecord.id, { status: 'closed' });
        setCaseStatus('closed');
        if (caseRecord.clientId) {
          ClientsDB.updateClient(caseRecord.clientId, { status: 'Active' });
        }
      }
      logComplianceActivity(`submitted decision "${decision}" on ${caseRecord.id}`, 'CheckCircle', 'text-green-600');
    }
    toast.success('Decision submitted successfully');
    setDecision('');
    setDecisionReason('');
  };

  const handleRequestInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complianceOfficerMode || !caseRecord) return;
    if (!infoRecipient.trim() || !infoDueDate || !infoReason.trim()) {
      toast.error('Recipient, due date, and reason are required');
      return;
    }
    const template = INFO_REQUEST_TEMPLATES[infoTemplate];
    saveCaseOverride(caseRecord.id, { status: 'awaiting_decision' });
    if (caseRecord.clientId) {
      ClientsDB.updateClient(caseRecord.clientId, { status: 'Under Review' });
    }
    logComplianceActivity(`requested information (${template?.label}) for ${caseRecord.clientName}`, 'Clock', 'text-amber-600');
    toast.success('Information request sent', `Due ${infoDueDate}`);
    setShowRequestInfoModal(false);
  };

  const handleInvestigationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complianceOfficerMode || !caseRecord) return;
    if (!investigationReason.trim() || !investigationDescription.trim()) {
      toast.error('Investigation reason and description are required');
      return;
    }
    setInvestigationStatus('Open');
    localStorage.setItem(`growkyc_investigation_${caseRecord.id}`, 'Open');
    saveCaseOverride(caseRecord.id, { status: 'investigating' });
    setCaseStatus('investigating');
    logComplianceActivity(`flagged ${caseRecord.id} for investigation`, 'Flag', 'text-red-600');
    toast.success('Investigation opened');
    setShowInvestigationModal(false);
  };

  const handleEddSave = () => {
    if (!complianceOfficerMode || !caseRecord) return;
    localStorage.setItem(
      `growkyc_edd_${caseRecord.id}`,
      JSON.stringify({ checklist: eddChecklist, status: eddStatus })
    );
    const done = EDD_CHECKLIST_ITEMS.filter((i) => eddChecklist[i]).length;
    toast.success('EDD progress saved', `${done}/${EDD_CHECKLIST_ITEMS.length} items complete`);
  };

  const handleGenerateEvidencePack = async () => {
    if (!complianceOfficerMode || !caseRecord) return;
    setGeneratingPack(true);
    await new Promise((r) => setTimeout(r, 1200));
    const content = [
      'GrowKYC Evidence Pack',
      `Case: ${caseRecord.id}`,
      `Client: ${caseRecord.clientName}`,
      `Generated: ${new Date().toISOString()}`,
      '',
      '--- Client Profile ---',
      JSON.stringify(clientSections?.profile || {}, null, 2),
      '',
      '--- Equifax / Screening ---',
      JSON.stringify(clientSections?.equifax || {}, null, 2),
      '',
      '--- Risk ---',
      JSON.stringify(clientSections?.risk || {}, null, 2),
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evidence-pack-${caseRecord.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setGeneratingPack(false);
    setShowEvidencePackModal(false);
    logComplianceActivity(`generated evidence pack for ${caseRecord.id}`, 'Package', 'text-purple-600');
    toast.success('Evidence pack generated');
  };

  // Dynamic tab data — computed from the resolved case record (must be before fetch callbacks)
  const dynamicTriggers = useMemo(() => (
    caseRecord ? buildCaseTriggers(caseRecord as any) : []
  ), [caseRecord]);

  const dynamicEvidence = useMemo(() => (
    caseRecord ? buildCaseEvidence(caseRecord as any) : []
  ), [caseRecord]);

  const dynamicScreening = useMemo(() => (
    caseRecord ? buildCaseScreening(caseRecord) : null
  ), [caseRecord]);

  const dynamicFinancial = useMemo(() => (
    caseRecord ? buildCaseFinancial(caseRecord) : null
  ), [caseRecord]);

  const dynamicOwnership = useMemo(() => (
    caseRecord ? buildCaseOwnership(caseRecord) : null
  ), [caseRecord]);

  const dynamicRelatedParties = useMemo(() => (
    caseRecord ? buildCaseRelatedParties(caseRecord) : []
  ), [caseRecord]);

  const dynamicAuditEvents = useMemo(() => (
    caseRecord ? buildCaseAuditEvents(caseRecord as any) : null
  ), [caseRecord]);

  const dynamicApprovalChain = useMemo(() => (
    caseRecord ? buildCaseApprovalChain(caseRecord) : null
  ), [caseRecord]);

  const dynamicEscalations = useMemo(() => (
    caseRecord ? buildCaseEscalations(caseRecord) : null
  ), [caseRecord]);

  const dynamicDocuments = useMemo(() => (
    caseRecord ? buildCaseDocuments(caseRecord as any) : null
  ), [caseRecord]);

  const timelineEvents = useMemo(() => {
    if (!caseRecord) return [];
    return buildCaseAuditEvents(caseRecord as any).map((e) => ({
      time: new Date(e.timestamp).toLocaleString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      user: e.actor,
      action: e.action,
      icon: e.type === 'case_created' ? Target : e.type === 'screening_alert' ? Shield : e.type === 'document_uploaded' ? FileText : e.type === 'assignment' ? User : e.type === 'sla_warning' ? Clock : Activity,
      color: e.type === 'case_created' ? 'blue' : e.type === 'screening_alert' ? 'red' : e.type === 'document_uploaded' ? 'green' : e.type === 'sla_warning' ? 'orange' : 'gray',
    }));
  }, [caseRecord]);

  const fetchAuditEvents = useCallback(async (isManualRefresh = false) => {
    if (!isManualRefresh && auditEvents.length > 0) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/v1/cases/${caseData.id}/audit-events`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setAuditEvents(data.events || []);
    } catch (_err) {
      // Use dynamic audit events if in compliance officer mode, else static mock
      setAuditEvents(dynamicAuditEvents || []);
      setError('');
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  }, [caseData.id, auditEvents.length, dynamicAuditEvents]);

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

  const defaultNotes = useMemo(() => caseRecord ? [
    { id: 'n0', text: `Case ${caseRecord.id} opened for ${caseRecord.caseType} — ${caseRecord.clientName}. Risk: ${caseRecord.riskLevel}.`, author: caseRecord.assignedTo, timestamp: new Date().toISOString(), isOwnNote: true },
  ] : [], [caseRecord]);

  const fetchNotes = useCallback(async () => {
    setNotesLoading(true);
    try {
      const response = await fetch(`/api/v1/cases/${caseData.id}/notes`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setCaseNotes(data.notes || []);
    } catch {
      setCaseNotes(defaultNotes);
    } finally {
      setNotesLoading(false);
    }
  }, [caseData.id, defaultNotes]);

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
        const createdNote = { id: Date.now().toString(), text: newNote, author: getActivePersonaName(), timestamp: new Date().toISOString(), isOwnNote: true };
        setCaseNotes([createdNote, ...caseNotes]);
      }
    } catch (e) {
      // Fallback update
      if (isEditing) {
         setCaseNotes(prev => prev.map(n => n.id === editingNoteId ? { ...n, text: newNote, timestamp: new Date().toISOString() } : n));
      } else {
         const createdNote = { id: Date.now().toString(), text: newNote, author: getActivePersonaName(), timestamp: new Date().toISOString(), isOwnNote: true };
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

  const fetchApprovalChain = useCallback(async () => {
    setApprovalsLoading(true);
    try {
      const response = await fetch(`/api/v1/cases/${caseData.id}/approvals`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setApprovalChain(data);
    } catch {
      setApprovalChain(dynamicApprovalChain || null);
    } finally {
      setApprovalsLoading(false);
    }
  }, [caseData.id, dynamicApprovalChain]);

  useEffect(() => {
    if (activeTab === 'approvals') fetchApprovalChain();
  }, [activeTab, fetchApprovalChain]);

  const fetchEscalations = useCallback(async () => {
    setEscalationsLoading(true);
    try {
      const response = await fetch(`/api/v1/cases/${caseData.id}/escalations`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setEscalations(data.escalations || []);
    } catch {
      setEscalations(dynamicEscalations || []);
    } finally {
      setEscalationsLoading(false);
    }
  }, [caseData.id, dynamicEscalations]);

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

  const fetchDocuments = useCallback(async () => {
    setDocumentsLoading(true);
    try {
      const response = await fetch(`/api/v1/cases/${caseData.id}/documents`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      const docs = data.documents || [];
      setKycDocuments(docs.map((d: any) => ({ ...d, expiryStatus: d.expiryStatus || calculateExpiryStatus(d.expiryDate) })));
    } catch {
      const fallback = dynamicDocuments || [
        { id: 'doc1', type: 'Passport', filename: 'John_Smith_Passport.pdf', uploadedBy: 'Client Portal', timestamp: '2026-03-15T09:00:00Z', expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), status: 'Verified' },
        { id: 'doc2', type: 'Driver License', filename: 'Sarah_Lee_DL.jpg', uploadedBy: 'Client Portal', timestamp: '2021-02-10T11:00:00Z', expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'Expired' },
        { id: 'doc3', type: 'Proof of Address', filename: 'Utility_Bill_ABC_Ent.pdf', uploadedBy: 'Michael Chen', timestamp: '2026-03-21T09:00:15Z', expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), status: 'Pending Verification' },
      ];
      setKycDocuments(fallback.map((d: any) => ({ ...d, expiryStatus: calculateExpiryStatus(d.expiryDate) })));
    } finally {
      setDocumentsLoading(false);
    }
  }, [caseData.id, dynamicDocuments]);

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

  if (complianceOfficerMode && caseId && !caseRecord) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <Card className="max-w-md w-full border-2 border-gray-200">
          <CardContent className="p-8 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-bold text-gray-900">Case not found</h2>
            <p className="text-gray-600 text-sm">
              No case exists for <span className="font-mono font-semibold">{caseId}</span>.
              Create a manual case or onboard a client to generate cases.
            </p>
            {onBack && (
              <Button onClick={onBack} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Case Control
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className="bg-red-100 text-red-700 text-lg px-4 py-2">
                <Clock className="w-5 h-5 mr-2" />
                SLA: {caseData.slaRemaining}
              </Badge>
              <Badge className="bg-white text-red-900 text-lg px-4 py-2">
                {caseData.riskLevel.toUpperCase()}
              </Badge>
              {complianceOfficerMode && !isAuditor && (
                <>
                  <Button size="sm" className="bg-white/20 border border-white/40 text-white hover:bg-white/30" onClick={() => setShowRequestInfoModal(true)}>
                    <Info className="w-4 h-4 mr-1" />
                    Request Info
                  </Button>
                  <Button size="sm" className="bg-white/20 border border-white/40 text-white hover:bg-white/30" onClick={() => setShowInvestigationModal(true)}>
                    <Flag className="w-4 h-4 mr-1" />
                    Investigation
                  </Button>
                  <Button size="sm" className="bg-white/20 border border-white/40 text-white hover:bg-white/30" onClick={() => setShowEddModal(true)}>
                    <ListChecks className="w-4 h-4 mr-1" />
                    EDD
                  </Button>
                  <Button size="sm" className="bg-white/20 border border-white/40 text-white hover:bg-white/30" onClick={() => setShowEvidencePackModal(true)}>
                    <Package className="w-4 h-4 mr-1" />
                    Evidence Pack
                  </Button>
                </>
              )}
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
                        {complianceOfficerMode && dynamicTriggers.length > 0 ? (
                          dynamicTriggers.map((t) => (
                            <li key={t.id}>• [{t.severity.toUpperCase()}] {t.reason} ({t.confidence}% confidence)</li>
                          ))
                        ) : (
                          <>
                            <li>• Director matched to DFAT sanctions list (94% confidence)</li>
                            <li>• Severe adverse media linking to money laundering investigation</li>
                            <li>• Unexplained capital injection of $2.5M</li>
                            <li>• Foreign PEP among directors</li>
                            <li>• Parent company under investigation in Singapore</li>
                          </>
                        )}
                      </ul>
                    </div>

                    {clientSections && (
                      <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200 space-y-4">
                        <h3 className="font-bold text-blue-900">Client Profile</h3>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div><span className="text-gray-600">Name:</span> <strong>{clientSections.profile.name}</strong></div>
                          <div><span className="text-gray-600">Email:</span> {clientSections.profile.email}</div>
                          <div><span className="text-gray-600">Mobile:</span> {clientSections.profile.mobile}</div>
                          <div><span className="text-gray-600">Risk:</span> {clientSections.profile.riskRating}</div>
                          <div className="md:col-span-2"><span className="text-gray-600">Address:</span> {clientSections.profile.address}</div>
                        </div>
                        {clientSections.entity.abn !== '—' && (
                          <>
                            <h4 className="font-semibold text-gray-900">Entity Details</h4>
                            <div className="grid md:grid-cols-2 gap-2 text-sm">
                              <div>ABN: {clientSections.entity.abn}</div>
                              <div>ACN: {clientSections.entity.acn}</div>
                              <div>Industry: {clientSections.entity.industry}</div>
                            </div>
                          </>
                        )}
                        <h4 className="font-semibold text-gray-900">Equifax / Screening</h4>
                        <div className="grid md:grid-cols-2 gap-2 text-sm">
                          <div>Identity: {clientSections.equifax.identityResult}</div>
                          <div>PEP: {clientSections.equifax.pepResult}</div>
                          <div>Sanctions: {clientSections.equifax.sanctionsResult}</div>
                          <div>Adverse Media: {clientSections.equifax.adverseMediaResult}</div>
                          <div>Risk Score: {clientSections.equifax.riskScore}</div>
                        </div>
                      </div>
                    )}

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
                    {dynamicTriggers.map((trigger) => (
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
                    {dynamicEvidence.map((item, idx) => (
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
                {activeTab === 'screening' && (() => {
                  const sc = dynamicScreening;
                  const sanctionsMatch = sc ? sc.sanctions.result !== 'CLEAR' : false;
                  const pepDetected = sc ? sc.pep.result !== 'CLEAR' : false;
                  const mediaAlerts = sc ? sc.adverseMedia.hits : 0;
                  return (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Comprehensive AML Screening Results</h3>

                    {/* Sanctions */}
                    <Card className={`border-2 ${sanctionsMatch ? 'border-red-300 bg-red-50/30' : 'border-green-300 bg-green-50/30'}`}>
                      <CardHeader className={`${sanctionsMatch ? 'bg-red-100 border-b-2 border-red-300' : 'bg-green-100 border-b-2 border-green-300'}`}>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className={`w-6 h-6 ${sanctionsMatch ? 'text-red-700' : 'text-green-700'}`} />
                            <span className={sanctionsMatch ? 'text-red-900' : 'text-green-900'}>Sanctions Screening</span>
                          </div>
                          <Badge className={`text-white text-lg px-3 py-1 ${sanctionsMatch ? 'bg-red-600' : 'bg-green-600'}`}>
                            {sc?.sanctions.result || 'MATCH FOUND'}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        {sanctionsMatch ? (
                          <div className="bg-white rounded-lg p-4 border-2 border-red-200">
                            <p className="font-bold text-gray-900 mb-1">{caseData.clientName}</p>
                            <div className="bg-red-50 rounded p-3 mt-2">
                              <p className="text-sm font-bold text-red-900 mb-1">DFAT Consolidated List</p>
                              <p className="text-sm text-red-800">Sanctions match detected — {sc?.sanctions.matches || 1} match(es) found</p>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Button size="sm" variant="outline" className="border-red-300"><Eye className="w-4 h-4 mr-1" />View Full Report</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-900 font-semibold">No sanctions matches found for {caseData.clientName}</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-600"><strong>Provider:</strong> {sc?.sanctions.provider || 'ComplyAdvantage'} | <strong>Last Screened:</strong> {sc?.sanctions.lastScreened}</p>
                      </CardContent>
                    </Card>

                    {/* PEP */}
                    <Card className={`border-2 ${pepDetected ? 'border-orange-300 bg-orange-50/30' : 'border-green-300 bg-green-50/30'}`}>
                      <CardHeader className={pepDetected ? 'bg-orange-100 border-b-2 border-orange-300' : 'bg-green-100 border-b-2 border-green-300'}>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className={`w-6 h-6 ${pepDetected ? 'text-orange-700' : 'text-green-700'}`} />
                            <span className={pepDetected ? 'text-orange-900' : 'text-green-900'}>PEP Screening</span>
                          </div>
                          <Badge className={`text-white text-lg px-3 py-1 ${pepDetected ? 'bg-orange-600' : 'bg-green-600'}`}>
                            {sc?.pep.result || 'CLEAR'}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        {pepDetected ? (
                          <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                            <p className="font-bold text-gray-900 mb-1">{caseData.clientName}</p>
                            <div className="bg-orange-50 rounded p-3 mt-2">
                              <p className="text-sm font-bold text-orange-900">PEP Status: {sc?.pep.pepType || 'Detected'}</p>
                              <p className="text-xs text-orange-700 mt-1">Active monitoring required</p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-900 font-semibold">No PEP connections identified for {caseData.clientName}</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-600"><strong>Provider:</strong> {sc?.pep.provider || 'Dow Jones'} | <strong>Last Screened:</strong> {sc?.pep.lastScreened}</p>
                      </CardContent>
                    </Card>

                    {/* Adverse Media */}
                    <Card className={`border-2 ${mediaAlerts > 0 ? 'border-amber-300 bg-amber-50/30' : 'border-green-300 bg-green-50/30'}`}>
                      <CardHeader className={mediaAlerts > 0 ? 'bg-amber-100 border-b-2 border-amber-300' : 'bg-green-100 border-b-2 border-green-300'}>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className={`w-6 h-6 ${mediaAlerts > 0 ? 'text-amber-700' : 'text-green-700'}`} />
                            <span className={mediaAlerts > 0 ? 'text-amber-900' : 'text-green-900'}>Adverse Media</span>
                          </div>
                          <Badge className={`text-white text-lg px-3 py-1 ${mediaAlerts > 0 ? 'bg-amber-600' : 'bg-green-600'}`}>
                            {sc?.adverseMedia.result || (mediaAlerts > 0 ? `${mediaAlerts} ALERT(S)` : 'CLEAR')}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        {mediaAlerts > 0 ? (
                          <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
                            <p className="font-bold text-gray-900 mb-1">{caseData.clientName} — {mediaAlerts} media alert(s)</p>
                            <p className="text-sm text-gray-700 mt-2">Adverse media identified relating to {caseData.caseType}. Please review all alerts before proceeding.</p>
                          </div>
                        ) : (
                          <div className="bg-green-50 rounded-lg p-4 border border-green-200 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-900 font-semibold">No adverse media found for {caseData.clientName}</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-600"><strong>Provider:</strong> {sc?.adverseMedia.provider || 'ComplyAdvantage'} | <strong>Last Screened:</strong> {sc?.adverseMedia.lastScreened}</p>
                      </CardContent>
                    </Card>

                    {/* Watchlist */}
                    <Card className="border-2 border-blue-300">
                      <CardHeader className="bg-blue-100 border-b-2 border-blue-300">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2"><Eye className="w-6 h-6 text-blue-700" /><span className="text-blue-900">Watchlist Screening</span></div>
                          <Badge className={`text-lg px-3 py-1 ${sc?.watchlist.result === 'MATCH FOUND' ? 'bg-red-600 text-white' : 'bg-green-100 text-green-700'}`}>{sc?.watchlist.result || 'CLEAR'}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-5 h-5 text-green-600" /><span className="font-bold text-green-900">Watchlist Check Complete</span></div>
                          <ul className="text-sm text-gray-700 space-y-1 ml-7">
                            <li>✓ INTERPOL Wanted Persons</li><li>✓ OFAC SDN List</li><li>✓ EU Sanctions List</li>
                            <li>✓ UK HM Treasury</li><li>✓ Disqualified Directors (ASIC)</li>
                          </ul>
                        </div>
                        <p className="text-xs text-gray-600 mt-3"><strong>Provider:</strong> {sc?.watchlist.provider || 'World-Check'} | <strong>Last Screened:</strong> {sc?.watchlist.lastScreened}</p>
                      </CardContent>
                    </Card>

                    {/* Identity */}
                    <Card className="border-2 border-purple-300">
                      <CardHeader className="bg-purple-100 border-b-2 border-purple-300">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2"><User className="w-6 h-6 text-purple-700" /><span className="text-purple-900">Identity Verification</span></div>
                          <Badge className="bg-amber-100 text-amber-700 text-lg px-3 py-1">{sc?.identity.result || 'PENDING'}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="bg-white rounded-lg p-4 border border-purple-200">
                          <p className="font-bold text-gray-900 mb-2">{caseData.clientName} — Identity Status: {sc?.identity.result || 'Pending'}</p>
                          <p className="text-sm text-gray-600">Identity verification performed via {sc?.identity.provider || 'InfoTrack / GreenID'}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Summary */}
                    <Card className="border-2 border-red-400 bg-red-50">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2"><AlertTriangle className="w-7 h-7" />Screening Summary & Risk Assessment</h3>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-4 border-2 border-red-300 text-center">
                            <p className="text-sm text-gray-600 mb-1">Overall Risk</p>
                            <p className="text-3xl font-bold text-red-600">{(sc?.overallRisk || caseData.riskLevel).toUpperCase()}</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border-2 border-orange-300 text-center">
                            <p className="text-sm text-gray-600 mb-1">Screening Score</p>
                            <p className="text-3xl font-bold text-orange-600">{sc?.riskScore || 0}/100</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border-2 border-amber-300 text-center">
                            <p className="text-sm text-gray-600 mb-1">Total Alerts</p>
                            <p className="text-3xl font-bold text-amber-600">{sc?.totalAlerts ?? 0}</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-red-300">
                          <p className="text-sm font-bold text-red-900 mb-2">Recommendations for {caseData.caseType}:</p>
                          <ul className="text-sm text-gray-800 space-y-1">
                            {(sc?.riskScore || 0) >= 75 && <li>🔴 <strong>Escalate</strong> to Head of Compliance and MLRO</li>}
                            {sanctionsMatch && <li>🔴 Consider AUSTRAC suspicious matter report (SMR)</li>}
                            {pepDetected && <li>🟠 Apply Enhanced Due Diligence (EDD)</li>}
                            {mediaAlerts > 0 && <li>🟡 Review all adverse media and document findings</li>}
                            <li>🔵 Maintain monitoring and update case status regularly</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  );
                })()}

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
                      <Button 
                        size="sm" 
                        className={`bg-red-600 hover:bg-red-700 text-white ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isReadOnly}
                        title={isReadOnly ? "Read-only users cannot escalate cases." : undefined}
                      >
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

                {/* Financial Tab */}
                {activeTab === 'financial' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Profile</h3>
                    {dynamicFinancial ? (
                      <>
                        <div className="grid md:grid-cols-2 gap-4">
                          {[
                            { label: 'Source of Funds', value: dynamicFinancial.sourceOfFunds },
                            { label: 'Source of Wealth', value: dynamicFinancial.sourceOfWealth },
                            { label: 'Estimated Wealth', value: dynamicFinancial.estimatedWealth },
                            { label: 'Transaction Volume', value: dynamicFinancial.transactionVolume },
                            { label: 'Bank Accounts', value: String(dynamicFinancial.bankAccounts) },
                            { label: 'High-Risk Transactions', value: String(dynamicFinancial.highRiskTransactions) },
                          ].map((item) => (
                            <div key={item.label} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-xs text-blue-700 mb-1">{item.label}</p>
                              <p className="font-bold text-gray-900">{item.value}</p>
                            </div>
                          ))}
                        </div>
                        <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-300">
                          <p className="text-sm font-bold text-amber-900 mb-1">Case Note</p>
                          <p className="text-sm text-amber-800">{dynamicFinancial.notes}</p>
                        </div>
                        {clientSections?.equifax && (
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm font-bold text-gray-900 mb-2">Risk Score</p>
                            <p className="text-3xl font-bold text-orange-600">{clientSections.equifax.riskScore}/100</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12 text-gray-500">Financial data not available for this case.</div>
                    )}
                  </div>
                )}

                {/* Ownership Tab */}
                {activeTab === 'ownership' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Ownership Structure</h3>
                    {dynamicOwnership ? (
                      <>
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
                            <p className="text-xs text-indigo-700 mb-1">Complex Structure</p>
                            <p className="font-bold text-gray-900">{dynamicOwnership.complexStructure ? 'Yes' : 'No'}</p>
                          </div>
                          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
                            <p className="text-xs text-indigo-700 mb-1">Ownership Complete</p>
                            <p className="font-bold text-gray-900">{dynamicOwnership.ownershipComplete ? 'Yes' : 'No'}</p>
                          </div>
                          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 text-center">
                            <p className="text-xs text-indigo-700 mb-1">Client Type</p>
                            <p className="font-bold text-gray-900 capitalize">{dynamicOwnership.clientType}</p>
                          </div>
                        </div>
                        {dynamicOwnership.ubos.length > 0 && (
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3">Ultimate Beneficial Owners</h4>
                            <div className="space-y-2">
                              {dynamicOwnership.ubos.map((ubo: any, i: number) => (
                                <Card key={i} className="border border-indigo-200">
                                  <CardContent className="p-3 flex justify-between items-center">
                                    <div>
                                      <p className="font-bold text-gray-900">{ubo.name}</p>
                                      <p className="text-xs text-gray-600">{ubo.ownership}% ownership — {ubo.country}</p>
                                    </div>
                                    <Badge className={ubo.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                                      {ubo.verified ? 'Verified' : 'Unverified'}
                                    </Badge>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                        {dynamicOwnership.directors.length > 0 && (
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3">Directors</h4>
                            <div className="space-y-2">
                              {dynamicOwnership.directors.map((d: any, i: number) => (
                                <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between">
                                  <span className="font-semibold text-gray-900">{d.name}</span>
                                  <Badge variant="outline" className="text-xs">{d.kycStatus || 'Pending KYC'}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {dynamicOwnership.shareholders.length > 0 && (
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3">Shareholders</h4>
                            <div className="space-y-2">
                              {dynamicOwnership.shareholders.map((s: any, i: number) => (
                                <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between">
                                  <span className="font-semibold text-gray-900">{s.name}</span>
                                  <span className="text-sm text-gray-600">{s.percentage}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {dynamicOwnership.ubos.length === 0 && dynamicOwnership.directors.length === 0 && (
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-600">
                            <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p>Ownership data for <strong>{caseData.clientName}</strong> is being collected.</p>
                            <p className="text-xs mt-1">{dynamicOwnership.caseNote}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12 text-gray-500">Ownership data not available for this case.</div>
                    )}
                  </div>
                )}

                {/* Related Parties Tab */}
                {activeTab === 'related' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Related Parties</h3>
                    {dynamicRelatedParties.length > 0 ? (
                      dynamicRelatedParties.map((party, i) => (
                        <Card key={i} className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-bold text-gray-900">{party.name}</p>
                                <p className="text-sm text-gray-600 mt-0.5">{party.relationship}</p>
                              </div>
                              <div className="text-right">
                                <Badge className={
                                  party.riskFlag.includes('Verified') || party.riskFlag === 'No flags' ? 'bg-green-100 text-green-700' :
                                  party.riskFlag.includes('Unverified') || party.riskFlag.includes('Pending') ? 'bg-amber-100 text-amber-700' :
                                  'bg-red-100 text-red-700'
                                }>{party.riskFlag}</Badge>
                                <p className="text-xs text-gray-500 mt-1">{party.action}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p>No related parties identified for this case.</p>
                      </div>
                    )}
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
                          onChange={() =>
                            setRequiredActions((prev) =>
                              prev.map((a) => (a.id === action.id ? { ...a, completed: !a.completed } : a))
                            )
                          }
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
                <div className={`pt-4 border-t ${isReadOnly ? 'opacity-60 pointer-events-none' : ''}`}>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold text-gray-900">Decision</p>
                    {isReadOnly && (
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

                {complianceOfficerMode && caseRecord && (decision === 'approve' || decision === 'approve_conditions') && (
                  <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1">
                    <p className="font-bold text-amber-900">Approval requirements</p>
                    {getApprovalBlockers(caseRecord, approvalReadiness, getActivePersonaId()).length === 0 ? (
                      <p className="text-green-700">All mandatory checks satisfied for your role.</p>
                    ) : (
                      getApprovalBlockers(caseRecord, approvalReadiness, getActivePersonaId()).map((b) => (
                        <p key={b.code} className="text-red-700">• {b.message}</p>
                      ))
                    )}
                  </div>
                )}

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
                <div className={`pt-4 border-t ${isReadOnly ? 'opacity-60 pointer-events-none' : ''}`}>
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
                <div className={`pt-6 border-t space-y-3 ${isReadOnly ? 'hidden' : ''}`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6" onClick={handleSubmitDecision}>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Decision
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-2"
                    onClick={() => {
                      if (complianceOfficerMode && caseRecord) {
                        saveCaseOverride(caseRecord.id, { status: caseStatus as any });
                      }
                      toast.success('Progress saved');
                    }}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {complianceOfficerMode && showRequestInfoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full border-2">
            <CardHeader><CardTitle>Request More Information</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleRequestInfoSubmit} className="space-y-3">
                <input className="w-full border-2 rounded-lg px-3 py-2" placeholder="Recipient" value={infoRecipient} onChange={(e) => setInfoRecipient(e.target.value)} required />
                <select className="w-full border-2 rounded-lg px-3 py-2" value={infoTemplate} onChange={(e) => setInfoTemplate(e.target.value)}>
                  {Object.entries(INFO_REQUEST_TEMPLATES).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
                <input type="date" className="w-full border-2 rounded-lg px-3 py-2" value={infoDueDate} onChange={(e) => setInfoDueDate(e.target.value)} required />
                <input className="w-full border-2 rounded-lg px-3 py-2" placeholder="Reason" value={infoReason} onChange={(e) => setInfoReason(e.target.value)} required />
                <textarea className="w-full border-2 rounded-lg px-3 py-2" rows={4} value={infoMessage} onChange={(e) => setInfoMessage(e.target.value)} />
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowRequestInfoModal(false)}>Cancel</Button>
                  <Button type="submit">Send Request</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {complianceOfficerMode && showInvestigationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full border-2">
            <CardHeader><CardTitle>Flag For Investigation</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleInvestigationSubmit} className="space-y-3">
                <input className="w-full border-2 rounded-lg px-3 py-2" placeholder="Investigation reason" value={investigationReason} onChange={(e) => setInvestigationReason(e.target.value)} required />
                <select className="w-full border-2 rounded-lg px-3 py-2" value={investigationRisk} onChange={(e) => setInvestigationRisk(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
                <textarea className="w-full border-2 rounded-lg px-3 py-2" rows={3} placeholder="Description" value={investigationDescription} onChange={(e) => setInvestigationDescription(e.target.value)} required />
                <select className="w-full border-2 rounded-lg px-3 py-2" value={investigationRestriction} onChange={(e) => setInvestigationRestriction(e.target.value)}>
                  <option value="service_hold">Service Hold</option>
                  <option value="limited">Limited Service</option>
                  <option value="review_required">Review Required</option>
                </select>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowInvestigationModal(false)}>Cancel</Button>
                  <Button type="submit">Open Investigation</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {complianceOfficerMode && showEddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full border-2 max-h-[90vh] overflow-y-auto">
            <CardHeader><CardTitle>EDD Checklist</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <select className="w-full border-2 rounded-lg px-3 py-2" value={eddStatus} onChange={(e) => setEddStatus(e.target.value)}>
                <option>EDD Required</option>
                <option>EDD In Progress</option>
                <option>EDD Pending Information</option>
                <option>EDD Review Complete</option>
                <option>EDD Approved</option>
                <option>EDD Rejected</option>
              </select>
              {EDD_CHECKLIST_ITEMS.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!eddChecklist[item]} onChange={(e) => setEddChecklist((p) => ({ ...p, [item]: e.target.checked }))} />
                  {item}
                </label>
              ))}
              <Button className="w-full" onClick={handleEddSave}>Save EDD Progress</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {complianceOfficerMode && showEvidencePackModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-2">
            <CardHeader><CardTitle>Generate Evidence Pack</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <p>Includes client profile, entity data, Equifax results, risk assessment, documents, investigation and audit history.</p>
              <Button className="w-full" disabled={generatingPack} onClick={handleGenerateEvidencePack}>
                {generatingPack ? 'Generating…' : 'Generate Pack'}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setShowEvidencePackModal(false)}>Close</Button>
            </CardContent>
          </Card>
        </div>
      )}

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
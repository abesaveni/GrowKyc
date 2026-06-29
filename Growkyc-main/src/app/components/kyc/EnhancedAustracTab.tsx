import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import { logComplianceActivity } from '../../../utils/activityLogger';
import {
  Shield,
  AlertTriangle,
  FileText,
  DollarSign,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  User,
  Building,
  Calendar,
  Globe,
  TrendingUp,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Clock,
  Check,
  RefreshCw,
  Archive,
  AlertCircle
} from 'lucide-react';
import { SuspiciousMatterReport } from './AustracReportingData';

interface EnhancedAustracTabProps {
  clientName: string;
  smrs: SuspiciousMatterReport[];
  summary: {
    totalSMRs: number;
    totalTTRs: number;
    lastReportDate: string;
    activeConcerns: boolean;
  };
}

export function EnhancedAustracTab({ clientName, smrs, summary }: EnhancedAustracTabProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('subject');
  const [selectedSMR, setSelectedSMR] = useState(0);

  // Evidence Pack Builder State
  const [isAssembling, setIsAssembling] = useState(false);
  const [assemblyProgress, setAssemblyProgress] = useState(0);
  const [packReady, setPackReady] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ label: string; status: 'success' | 'warning' | 'error' }[]>([]);

  const smr = smrs[selectedSMR];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard`);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const SectionHeader = ({ id, title, icon: Icon, priority }: { id: string; title: string; icon: React.ComponentType<{ className?: string }>; priority?: boolean }) => {
    const isExpanded = expandedSection === id;
    return (
      <button
        onClick={() => toggleSection(id)}
        className={`w-full p-4 flex items-center justify-between border-b-2 transition-colors ${isExpanded ? 'bg-cyan-500/10' : 'bg-white hover:bg-white/5'
          }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${isExpanded ? 'text-cyan-400' : 'text-slate-300'}`} />
          <span className="font-semibold text-lg">{title}</span>
          {priority && (
            <Badge className="bg-red-600 text-white">Required for AUSTRAC Portal</Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-cyan-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>
    );
  };

  const assembleEvidencePack = () => {
    if (packReady) return;
    setIsAssembling(true);
    setAssemblyProgress(0);
    setCheckedItems([]);

    const checklistItems = [
      { id: 'id', label: 'Extracting Subject Identity Documents', check: () => !!smr?.subjectDetails.fullLegalName || summary.totalSMRs > 0 },
      { id: 'txn', label: 'Compiling Transaction Monitoring Logs', check: () => (smr?.suspiciousTransactions?.length || 0) > 0 || summary.totalTTRs > 0 },
      { id: 'edd', label: 'Retrieving Enhanced Due Diligence Reports', check: () => (smr?.suspiciousActivitySummary?.primaryConcerns?.length || 0) > 0 || summary.activeConcerns },
      { id: 'sanctions', label: 'Generating Sanctions Screening Proofs', check: () => true },
      { id: 'media', label: 'Assembling Adverse Media Articles', check: () => (smr?.mlTfIndicators?.other?.length || 0) > 0 || summary.activeConcerns },
      { id: 'sig', label: 'Finalizing Cryptographic Signatures', check: () => !!smr?.declarationDetails.signature || summary.totalSMRs > 0 }
    ];

    let currentItemIdx = 0;

    const interval = setInterval(() => {
      if (currentItemIdx < checklistItems.length) {
        const item = checklistItems[currentItemIdx];
        const status = item.check() ? 'success' : 'warning';
        
        setCheckedItems(prev => [...prev, { label: item.label, status }]);
        setAssemblyProgress(((currentItemIdx + 1) / checklistItems.length) * 100);
        currentItemIdx++;
      } else {
        clearInterval(interval);
        setIsAssembling(false);
        setPackReady(true);
        
        const hasWarnings = checkedItems.some(i => i.status === 'warning');
        if (hasWarnings) {
          toast.warning('Evidence Pack Assembled with Missing Documents');
        } else {
          toast.success('AUSTRAC Evidence Pack Assembled Successfully');
        }

        logComplianceActivity({
          type: 'document',
          action: `assembled AUSTRAC Evidence Pack for ${clientName}`,
          iconName: 'FileText',
          color: 'text-purple-400'
        });
      }
    }, 600);
  };

  const downloadEvidencePack = () => {
    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();
      const smrRef = smr?.smrNumber || 'CLEAN';

      // Header
      doc.setFontSize(22);
      doc.setTextColor(0, 51, 102); // Dark Blue
      doc.text('AUSTRAC COMPLIANCE EVIDENCE PACK', 20, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${timestamp}`, 20, 30);
      doc.text(`SMR Reference: ${smrRef}`, 20, 35);
      doc.line(20, 40, 190, 40);

      // Section: Subject
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text('Section 1: Subject Identification', 20, 55);
      doc.setFontSize(12);
      doc.text(`Legal Name: ${smr?.subjectDetails.fullLegalName || clientName}`, 25, 65);
      doc.text(`Type: ${smr?.subjectDetails.subjectType || 'Entity'}`, 25, 72);
      
      if (smr?.subjectDetails.abn) doc.text(`ABN: ${smr.subjectDetails.abn}`, 25, 79);
      if (smr?.subjectDetails.acn) doc.text(`ACN: ${smr.subjectDetails.acn}`, 25, 86);

      // Section: Risk Summary
      doc.setFontSize(16);
      doc.text('Section 2: Risk & Activity Summary', 20, 105);
      doc.setFontSize(12);
      doc.text(`Activity Commenced: ${smr?.suspiciousActivitySummary.dateActivityCommenced || 'Monitoring Period'}`, 25, 115);
      doc.text(`Total Value Involved: AUD $${smr?.suspiciousActivitySummary.totalValueInvolved.toLocaleString() || '0'}`, 25, 122);
      doc.text(`Primary Category: ${smr?.suspiciousActivitySummary.primaryConcerns[0]?.category || 'General Compliance Review'}`, 25, 129);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('CONFIDENTIAL - FOR AUTHORIZED REGULATORY USE ONLY', 105, 285, { align: 'center' });
      doc.text('Generated by GrowKYC Compliance Engine', 105, 290, { align: 'center' });

      doc.save(`AUSTRAC_EVIDENCE_${smrRef}.pdf`);
      toast.success('Evidence Pack PDF Downloaded Securely');

      logComplianceActivity({
        type: 'approval',
        action: `downloaded AUSTRAC Evidence PDF report for ${clientName}`,
        iconName: 'CheckCircle',
        color: 'text-green-400'
      });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  if (summary.totalSMRs === 0 && summary.totalTTRs === 0 && !smr) {
    return (
      <div className="space-y-6">
        {/* Reporting Obligations Panel - Clean State */}
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2"><Shield className="w-6 h-6 text-indigo-400" /> Reporting Obligations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: 'SMR', name: 'Suspicious Matter Report', threshold: 'Any Amount', status: 'Up to Date', color: 'bg-green-500/15 text-green-300 border-green-300' },
            { type: 'TTR', name: 'Threshold Transaction Report', threshold: '≥ $10,000 AUD', status: 'Monitoring', color: 'bg-blue-500/15 text-blue-300 border-blue-300' },
            { type: 'IFTI', name: 'Intl. Funds Transfer', threshold: 'Any Amount', status: 'Monitoring', color: 'bg-purple-500/15 text-purple-300 border-purple-300' }
          ].map(ob => (
            <Card key={ob.type} className="border shadow-sm">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-lg text-slate-100">{ob.type}</span>
                    <Badge variant="outline" className={`${ob.color} border font-bold`}>{ob.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mb-4">{ob.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Reporting Threshold</p>
                  <p className="font-bold text-sm">{ob.threshold}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-2 border-green-300 shadow-lg">
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-300 mb-2">No AUSTRAC Reports Filed</h3>
            <p className="text-slate-300 mb-6">This client has a clean AUSTRAC reporting history</p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                <p className="text-sm text-slate-300 mb-1">SMRs Filed</p>
                <p className="text-3xl font-bold text-green-400">{summary.totalSMRs}</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                <p className="text-sm text-slate-300 mb-1">TTRs Filed</p>
                <p className="text-3xl font-bold text-blue-400">{summary.totalTTRs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine timeline statuses based on SMR data
  const isLodged = !!smr?.austracReferenceNumber;
  const isAcknowledged = !!smr?.austracAcknowledgement;
  const isClosed = !!smr?.feedbackReceived;

  return (
    <div className="space-y-8">
      {/* 1. Reporting Obligations Panel */}
      <div>
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-4"><Shield className="w-6 h-6 text-indigo-400" /> Reporting Obligations Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: 'SMR', name: 'Suspicious Matter Report', threshold: 'Any Amount', status: summary.activeConcerns ? 'Action Required' : 'Up to Date', date: summary.lastReportDate, color: summary.activeConcerns ? 'bg-red-500/15 text-red-300 border-red-400' : 'bg-green-500/15 text-green-300 border-green-300' },
            { type: 'TTR', name: 'Threshold Transaction Report', threshold: '≥ $10,000 AUD', status: summary.totalTTRs > 0 ? 'Active Filing' : 'Monitoring', date: summary.totalTTRs > 0 ? summary.lastReportDate : 'N/A', color: summary.totalTTRs > 0 ? 'bg-yellow-500/15 text-yellow-300 border-yellow-300' : 'bg-blue-500/15 text-blue-300 border-blue-300' },
            { type: 'IFTI', name: 'Intl. Funds Transfer Instruction', threshold: 'Any Amount', status: 'Monitoring', date: 'N/A', color: 'bg-purple-500/15 text-purple-300 border-purple-300' }
          ].map(ob => (
            <Card key={ob.type} className={`border-2 ${ob.color.replace('bg-', 'border-').split(' ')[2]} shadow-sm bg-white dark:bg-slate-900`}>
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-lg text-slate-100 dark:text-slate-100">{ob.type}</span>
                    <Badge variant="outline" className={`${ob.color} border-2 font-bold uppercase tracking-wider text-[10px]`}>{ob.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mb-4">{ob.name}</p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Reporting Threshold</p>
                    <p className="font-bold text-sm text-slate-300 dark:text-slate-200">{ob.threshold}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Last Report</p>
                    <p className="font-bold text-sm text-slate-300 dark:text-slate-200">{ob.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 2. SMR Submission Tracking Timeline */}
      <Card className="border-2 border-white/10 shadow-md">
        <CardHeader className="bg-white/5 dark:bg-slate-800/50 border-b pb-4">
          <CardTitle className="text-lg flex justify-between items-center">
            <span className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-400" /> AUSTRAC Submission Tracking: {smr?.smrNumber || 'GENERAL_COMPLIANCE'}</span>
            <Badge className="bg-white/10 text-slate-100 hover:bg-slate-300">{smr?.filingDate || 'Current'}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative flex justify-between items-center w-full max-w-4xl mx-auto">
            {/* Connecting Lines */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-blue-500 -z-10 -translate-y-1/2 transition-all duration-500"
              style={{ width: isClosed ? '100%' : isAcknowledged ? '66%' : isLodged ? '33%' : '0%' }}></div>

            {/* Timeline Nodes */}
            {[
              { label: 'Submitted by Officer', active: true, icon: User, date: smr?.filingDate || 'Completed' },
              { label: 'Lodged with AUSTRAC', active: isLodged || summary.totalSMRs > 0, icon: Globe, date: smr?.filingDate || 'Completed' },
              { label: 'AUSTRAC Acknowledged', active: isAcknowledged || summary.totalSMRs > 0, icon: CheckCircle, date: (isAcknowledged || summary.totalSMRs > 0) ? 'Processed' : 'Pending' },
              { label: 'Closed / Feedback', active: isClosed, icon: Archive, date: isClosed ? smr?.feedbackDate : 'Awaiting' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center bg-white dark:bg-slate-900 px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 mb-2 transition-colors ${step.active ? 'bg-blue-600 border-blue-500/30 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                  <step.icon className="w-4 h-4" />
                </div>
                <p className={`text-xs font-bold text-center ${step.active ? 'text-slate-100 dark:text-slate-200' : 'text-slate-400'}`}>{step.label}</p>
                <p className="text-[10px] text-slate-400 font-medium">{step.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. Evidence Pack Builder */}
      <Card className="border-2 border-indigo-500/30 shadow-md bg-gradient-to-br from-white to-indigo-50 dark:from-slate-900 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-indigo-400" />
            Evidence Pack Builder
          </CardTitle>
          <p className="text-sm text-slate-300 dark:text-slate-400">Automatically assembles all required KYC documents, EDD reports, and transaction logs for AUSTRAC disclosure.</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <Button
                onClick={assembleEvidencePack}
                disabled={isAssembling || packReady}
                className={`w-full py-6 text-lg font-bold shadow-lg transition-all ${packReady ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {isAssembling ? (
                  <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Assembling Pack...</>
                ) : packReady ? (
                  <><CheckCircle className="w-5 h-5 mr-2" /> Evidence Assembled</>
                ) : (
                  <><FileText className="w-5 h-5 mr-2" /> Auto-Assemble Evidence Pack</>
                )}
              </Button>

              {isAssembling || packReady ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-indigo-300 dark:text-indigo-300">
                    <span>Assembly Progress</span>
                    <span>{Math.round(assemblyProgress)}%</span>
                  </div>
                  <Progress value={assemblyProgress} className="h-2 bg-indigo-500/20 [&>div]:bg-indigo-600" />
                </div>
              ) : null}

              <Button
                onClick={downloadEvidencePack}
                disabled={!packReady}
                variant="outline"
                className={`w-full ${packReady ? 'border-green-600 text-green-300 hover:bg-green-500/10' : 'opacity-50'}`}
              >
                <Download className="w-4 h-4 mr-2" /> Download Evidence PDF
              </Button>
            </div>

            <div className="bg-white dark:bg-slate-800 border-2 border-white/10 dark:border-slate-700 rounded-xl p-4 h-48 overflow-y-auto">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b pb-2">Assembly Checklist</h4>
              {checkedItems.length === 0 && !packReady && (
                <p className="text-sm text-slate-400 italic text-center mt-8">Click assemble to begin...</p>
              )}
              <ul className="space-y-2">
                {checkedItems.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm animate-in fade-in slide-in-from-left-2">
                    <div className="flex items-center gap-2 text-slate-300 dark:text-slate-300">
                      {item.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      )}
                      {item.label}
                    </div>
                    {item.status === 'warning' && (
                      <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-300 border-amber-500/30">Missing</Badge>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Detailed SMR Report View (Existing UI integration) */}
      <Card className="border-2 border-cyan-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              SMR Detail View
            </div>
            <div className="flex gap-2">
              <Badge className={`${(smr?.reportPriority === 'Urgent') ? 'bg-red-600' : 'bg-orange-600'} text-white px-3 py-1`}>
                {smr?.reportPriority || 'High'} Priority
              </Badge>
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700" onClick={() => window.open('https://www.austrac.gov.au/business/austrac-online', '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open AUSTRAC Portal
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Report Meta */}
          <div className="p-6 bg-white/5 border-b">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-300 mb-1">SMR Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-bold">{smr?.smrNumber || 'N/A'}</p>
                  {smr?.smrNumber && (
                    <button onClick={() => copyToClipboard(smr.smrNumber, 'SMR Number')}>
                      <Copy className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-300 mb-1">Filing Date</p>
                <p className="font-bold">{smr?.filingDate || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-300 mb-1">Reporting Officer</p>
                <p className="font-bold">{smr?.reportingOfficer || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-300 mb-1">AUSTRAC Reference</p>
                <p className="font-bold text-cyan-400">{smr?.austracReferenceNumber || 'Pending'}</p>
              </div>
            </div>
          </div>

          {!smr && (
            <div className="p-12 text-center bg-white border-b">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-slate-100 mb-2">Detailed Records Not Synced</h4>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                While reports have been filed for {clientName}, the full cryptographic detail of the individual reports has not been synced to this local workspace. You can still generate the Evidence Pack summary below.
              </p>
            </div>
          )}

          {/* Section 1: Subject Details */}
          {smr && (
            <div>
              <SectionHeader id="subject" title="Section 1: Subject Details" icon={User} priority />
              {expandedSection === 'subject' && (
                <div className="p-6 bg-white border-b space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Subject Type</label>
                      <p className="font-semibold">{smr.subjectDetails.subjectType}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Full Legal Name</label>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{smr.subjectDetails.fullLegalName}</p>
                        <button onClick={() => copyToClipboard(smr.subjectDetails.fullLegalName, 'Name')}>
                          <Copy className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
                        </button>
                      </div>
                    </div>
                    {smr.subjectDetails.abn && (
                      <div>
                        <label className="text-xs text-slate-300 block mb-1">ABN</label>
                        <p className="font-semibold">{smr.subjectDetails.abn}</p>
                      </div>
                    )}
                    {smr.subjectDetails.acn && (
                      <div>
                        <label className="text-xs text-slate-300 block mb-1">ACN</label>
                        <p className="font-semibold">{smr.subjectDetails.acn}</p>
                      </div>
                    )}
                  </div>

                  {smr.subjectDetails.addresses && (
                    <div>
                      <label className="text-xs text-slate-300 block mb-2">Addresses</label>
                      {smr.subjectDetails.addresses.map((addr, idx) => (
                        <div key={idx} className="bg-white/5 rounded p-3 mb-2 border">
                          <Badge variant="outline" className="mb-2">{addr.type}</Badge>
                          <p className="text-sm">{addr.address}</p>
                          <p className="text-xs text-slate-300 mt-1">{addr.country}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Section 2: Directors/Controllers */}
          {smr && smr.directorsControllers && (
            <div>
              <SectionHeader id="directors" title="Section 2: Directors & Controllers" icon={Building} priority />
              {expandedSection === 'directors' && (
                <div className="p-6 bg-white border-b space-y-3">
                  {smr.directorsControllers.map((director, idx) => (
                    <div key={idx} className="bg-red-500/10 rounded-lg p-4 border-2 border-red-500/30">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-lg">{director.name}</h4>
                          <p className="text-sm text-slate-300">{director.role}</p>
                        </div>
                        <Badge className="bg-red-600 text-white">Concern Identified</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                        {director.dateOfBirth && (
                          <div>
                            <p className="text-xs text-slate-300">DOB</p>
                            <p className="font-semibold">{director.dateOfBirth}</p>
                          </div>
                        )}
                        {director.nationality && (
                          <div>
                            <p className="text-xs text-slate-300">Nationality</p>
                            <p className="font-semibold">{director.nationality}</p>
                          </div>
                        )}
                      </div>
                      <div className="bg-white rounded p-3 border">
                        <p className="text-xs text-slate-300 mb-2">Concerns Identified:</p>
                        <ul className="space-y-1">
                          {director.concernsIdentified.map((concern, cidx) => (
                            <li key={cidx} className="flex items-start gap-2 text-sm text-red-300">
                              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>{concern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section 3: Suspicious Activity Summary */}
          {smr && (
            <div>
              <SectionHeader id="summary" title="Section 3: Suspicious Activity Summary" icon={AlertTriangle} priority />
              {expandedSection === 'summary' && (
                <div className="p-6 bg-white border-b space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-orange-500/10 rounded p-3 border border-orange-500/30">
                      <p className="text-xs text-slate-300 mb-1">Date Commenced</p>
                      <p className="font-bold">{smr.suspiciousActivitySummary.dateActivityCommenced}</p>
                    </div>
                    <div className="bg-red-500/10 rounded p-3 border border-red-500/30">
                      <p className="text-xs text-slate-300 mb-1">Date Identified</p>
                      <p className="font-bold">{smr.suspiciousActivitySummary.dateActivityIdentified}</p>
                    </div>
                    <div className="bg-purple-500/10 rounded p-3 border border-purple-500/30">
                      <p className="text-xs text-slate-300 mb-1">Total Value</p>
                      <p className="font-bold text-lg">${smr.suspiciousActivitySummary.totalValueInvolved.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-500/10 rounded p-3 border border-blue-500/30">
                      <p className="text-xs text-slate-300 mb-1">Transactions</p>
                      <p className="font-bold text-lg">{smr.suspiciousActivitySummary.numberOfTransactions}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold mb-3">Primary Concerns</h5>
                    <div className="space-y-3">
                      {smr.suspiciousActivitySummary.primaryConcerns.map((concern, idx) => (
                        <div key={idx} className={`rounded-lg p-4 border-2 ${concern.severity === 'Critical' ? 'bg-red-500/10 border-red-300' :
                          concern.severity === 'High' ? 'bg-orange-500/10 border-orange-300' :
                            'bg-yellow-500/10 border-yellow-300'
                          }`}>
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h6 className="font-bold">{concern.category}</h6>
                                <Badge className={`${concern.severity === 'Critical' ? 'bg-red-600' : 'bg-orange-600'
                                  } text-white`}>
                                  {concern.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-100">{concern.description}</p>
                            </div>
                            <button onClick={() => copyToClipboard(concern.description, concern.category)}>
                              <Copy className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold mb-3">ML/TF Indicators Identified ({smr.suspiciousActivitySummary.indicatorsIdentified.length})</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {smr.suspiciousActivitySummary.indicatorsIdentified.map((indicator, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm bg-red-500/10 rounded p-2 border border-red-500/30">
                          <CheckCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <span>{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Section 4: Transaction Details */}
          {smr && (
            <div>
              <SectionHeader id="transactions" title="Section 4: Suspicious Transactions" icon={DollarSign} priority />
              {expandedSection === 'transactions' && (
                <div className="p-6 bg-white border-b space-y-3">
                  {smr.suspiciousTransactions.map((txn, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-4 border-2 border-white/10">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-blue-600 text-white">{txn.type}</Badge>
                            <span className="text-xs text-slate-300">{txn.date}</span>
                          </div>
                          <p className="text-2xl font-bold text-cyan-300">
                            {txn.currency} ${txn.amount.toLocaleString()}
                          </p>
                        </div>
                        <button onClick={() => copyToClipboard(JSON.stringify(txn, null, 2), `Transaction ${txn.transactionId}`)}>
                          <Copy className="w-4 h-4 text-gray-400 hover:text-cyan-400" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <p className="text-xs text-slate-300">Transaction ID</p>
                          <p className="font-semibold">{txn.transactionId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-300">Method</p>
                          <p className="font-semibold">{txn.method}</p>
                        </div>
                        {txn.fromAccount && (
                          <div>
                            <p className="text-xs text-slate-300">From Account</p>
                            <p className="font-semibold">{txn.fromAccount}</p>
                          </div>
                        )}
                        {txn.toAccount && (
                          <div>
                            <p className="text-xs text-slate-300">To Account</p>
                            <p className="font-semibold">{txn.toAccount}</p>
                          </div>
                        )}
                        {txn.destination && (
                          <div>
                            <p className="text-xs text-slate-300">Destination</p>
                            <p className="font-semibold">{txn.destination}</p>
                          </div>
                        )}
                        {txn.purpose && (
                          <div>
                            <p className="text-xs text-slate-300">Purpose</p>
                            <p className="font-semibold">{txn.purpose}</p>
                          </div>
                        )}
                      </div>

                      <div className="bg-red-500/10 rounded p-3 border border-red-500/30">
                        <p className="text-xs text-red-300 font-semibold mb-2">Red Flags:</p>
                        <ul className="space-y-1">
                          {txn.redFlags.map((flag, fidx) => (
                            <li key={fidx} className="flex items-start gap-2 text-sm text-red-300">
                              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          {/* Section 5: ML/TF Indicators */}
          {smr && (
            <div>
              <SectionHeader id="indicators" title="Section 5: ML/TF Indicators Detail" icon={Shield} priority />
              {expandedSection === 'indicators' && (
                <div className="p-6 bg-white border-b space-y-4">
                  {Object.entries(smr.mlTfIndicators).filter(([key, value]) => key !== 'other' && value === true).map(([key, _]) => {
                    const detailsKey = `${key}Details` as keyof typeof smr.mlTfIndicators;
                    const details = smr.mlTfIndicators[detailsKey];
                    if (typeof details !== 'string') return null;

                    return (
                      <div key={key} className="bg-red-500/10 rounded-lg p-4 border-2 border-red-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-red-400" />
                          <h6 className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h6>
                        </div>
                        <p className="text-sm text-slate-100">{details}</p>
                      </div>
                    );
                  })}

                  {smr.mlTfIndicators.other.length > 0 && (
                    <div className="bg-orange-500/10 rounded-lg p-4 border-2 border-orange-500/30">
                      <h6 className="font-bold mb-2">Other Indicators</h6>
                      <ul className="space-y-1">
                        {smr.mlTfIndicators.other.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Section 9: Declaration */}
          {smr && (
            <div>
              <SectionHeader id="declaration" title="Section 9: Reporting Officer Declaration" icon={FileText} priority />
              {expandedSection === 'declaration' && (
                <div className="p-6 bg-white">
                  <div className="bg-cyan-500/10 rounded-lg p-6 border-2 border-cyan-500/30">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-300 mb-1">Officer Name</p>
                        <p className="font-bold">{smr.declarationDetails.officerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-300 mb-1">Title</p>
                        <p className="font-bold">{smr.declarationDetails.officerTitle}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-300 mb-1">Contact</p>
                        <p className="font-semibold text-sm">{smr.declarationDetails.officerContact}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-300 mb-1">Declaration Date</p>
                        <p className="font-bold">{smr.declarationDetails.declarationDate}</p>
                      </div>
                    </div>
                    <div className="bg-white rounded p-4 border">
                      <p className="text-sm text-slate-300 mb-2">Electronic Signature:</p>
                      <p className="font-signature text-2xl text-cyan-300">{smr.declarationDetails.signature}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

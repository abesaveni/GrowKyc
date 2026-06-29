import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  FileText,
  Sparkles,
  Download,
  Send,
  Save,
  RotateCcw,
  Copy,
  Eye,
  ChevronRight,
  Calendar,
  Users,
  Building,
  Globe,
  Shield
} from 'lucide-react';

interface ReportDraftBuilderProps {
  caseId?: string;
  onBack?: () => void;
}

export function ReportDraftBuilder({ caseId, onBack }: ReportDraftBuilderProps) {
  const [draftType, setDraftType] = useState<string>('smr');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportContent, setReportContent] = useState({
    summary: '',
    chronology: '',
    explanation: '',
    indicators: ''
  });

  const [activeCase, setActiveCase] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('austrac_cases');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const found = parsed.find(c => c.caseId === (caseId || 'AUS-2026-002'));
          if (found) {
            setActiveCase(found);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [caseId]);

  const caseData = {
    caseId: caseId || 'AUS-2026-002',
    subject: activeCase?.subject || (caseId === 'AUS-2026-001' ? 'Innovation Partners Trust' :
             caseId === 'AUS-2026-003' ? 'David Chen' :
             caseId === 'AUS-2026-004' ? 'TechCorp Pty Ltd' :
             caseId === 'AUS-2026-005' ? 'Melbourne Family Trust' :
             'ABC Enterprises Pty Ltd'),
    assignedTo: activeCase?.assignedReviewer || (caseId === 'AUS-2026-003' ? 'Lisa Martinez' :
                caseId === 'AUS-2026-002' ? 'Michael Chen' : 'Sarah Johnson')
  };

  const handleDraftAction = (action: 'save' | 'submit') => {
    const isSubmit = action === 'submit';
    
    // 1. Update case status in austrac_cases
    try {
      const storedCases = localStorage.getItem('austrac_cases');
      if (storedCases) {
        const parsed = JSON.parse(storedCases);
        if (Array.isArray(parsed)) {
          const updated = parsed.map(c => 
            c.caseId === caseData.caseId ? { ...c, status: isSubmit ? 'awaiting_manager' : 'draft_in_progress' } : c
          );
          localStorage.setItem('austrac_cases', JSON.stringify(updated));
        }
      }
    } catch (e) {
      console.error('Failed to update case status', e);
    }

    // 2. Update draft report awaiting status in localStorage
    try {
      const storedDrafts = localStorage.getItem('austrac_draft_reports');
      const draftsList = storedDrafts ? JSON.parse(storedDrafts) : [];
      if (Array.isArray(draftsList)) {
        const index = draftsList.findIndex(d => d.caseId === caseData.caseId);
        const draftObj = {
          caseId: caseData.caseId,
          subject: caseData.subject,
          draftType: draftType as any,
          preparedBy: caseData.assignedTo,
          awaiting: isSubmit ? 'MLRO Approval' : 'Draft Review',
          lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        
        if (index > -1) {
          draftsList[index] = draftObj;
        } else {
          draftsList.push(draftObj);
        }
        localStorage.setItem('austrac_draft_reports', JSON.stringify(draftsList));
      }
    } catch (e) {
      console.error('Failed to update draft reports', e);
    }

    // 3. Add to submissions if submitted
    if (isSubmit) {
      try {
        const storedSubmissions = localStorage.getItem('austrac_submissions');
        const submissionsList = storedSubmissions ? JSON.parse(storedSubmissions) : [];
        if (Array.isArray(submissionsList)) {
          if (!submissionsList.some(s => s.caseId === caseData.caseId)) {
            submissionsList.unshift({
              caseId: caseData.caseId,
              reportType: draftType === 'smr' ? 'smr' : 'smr',
              subject: caseData.subject,
              decisionDate: new Date().toISOString().split('T')[0],
              submissionMethod: 'online',
              status: 'submitted',
              submittedBy: 'Lisa Martinez (MLRO)',
              acknowledgementStatus: 'Pending',
              lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
              submissionRef: `SMR-2026-AUS-${Math.floor(10000 + Math.random() * 90000)}`,
              retryCount: 0
            });
            localStorage.setItem('austrac_submissions', JSON.stringify(submissionsList));
          } else {
            const updated = submissionsList.map(s => 
              s.caseId === caseData.caseId ? { ...s, status: 'submitted', lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16) } : s
            );
            localStorage.setItem('austrac_submissions', JSON.stringify(updated));
          }
        }
      } catch (e) {
        console.error('Failed to update submissions register', e);
      }
    }

    if (isSubmit) {
      toast.success('Draft SMR successfully submitted to MLRO & Compliance Manager!');
    } else {
      toast.success('Draft SMR progress successfully saved to compliance system.');
    }

    if (onBack) onBack();
  };

  const handleDownloadPDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/v1/audit-pack/${caseData.caseId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch audit pack (Status: ${response.status})`);
      }
      
      const auditPack = await response.json();
      
      // Validate auditPack response data structure
      if (!auditPack || typeof auditPack !== 'object') {
        throw new Error('Invalid audit pack data structure received from server');
      }

      // Generate the PDF using jsPDF using the backend-assembled audit pack data!
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(153, 27, 27); // Dark Red (to match the styling)
      doc.text('AUSTRAC REPORTABLE MATTER AUDIT PACK', 20, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${timestamp}`, 20, 30);
      doc.text(`Case Reference: ${auditPack.caseId || caseData.caseId}`, 20, 35);
      doc.line(20, 40, 190, 40);

      // Section: Subject Details
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text('1. Subject Information', 20, 50);
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(`Legal Name: ${auditPack.subjectDetails?.legalName || 'N/A'}`, 25, 60);
      doc.text(`ABN: ${auditPack.subjectDetails?.abn || 'N/A'}`, 25, 67);
      doc.text(`ACN: ${auditPack.subjectDetails?.acn || 'N/A'}`, 25, 74);
      doc.text(`Registered Address: ${auditPack.subjectDetails?.registeredAddress || 'N/A'}`, 25, 81);
      doc.text(`Industry: ${auditPack.subjectDetails?.industryCode || 'N/A'}`, 25, 88);

      // Section: Related Parties
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text('2. Related Parties & Risk Associations', 20, 105);
      doc.setFontSize(10);
      doc.setTextColor(0);
      
      let yOffset = 115;
      if (Array.isArray(auditPack.relatedParties) && auditPack.relatedParties.length > 0) {
        auditPack.relatedParties.forEach((party: { name: string; role?: string; ownership?: string; riskFlag?: string }, index: number) => {
          if (yOffset > 250) {
            doc.addPage();
            yOffset = 20;
          }
          doc.text(`${index + 1}. ${party.name} (${party.role || 'Associate'})`, 25, yOffset);
          if (party.ownership) doc.text(`Ownership: ${party.ownership}`, 30, yOffset + 5);
          if (party.riskFlag) doc.text(`Risk Flag: ${party.riskFlag}`, 30, yOffset + 10);
          yOffset += 18;
        });
      } else {
        doc.text('No related party associations identified.', 25, 115);
        yOffset += 10;
      }

      // Section: Trigger Context
      if (yOffset > 230) {
        doc.addPage();
        yOffset = 20;
      } else {
        yOffset += 10;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text('3. Compliance Security Triggers', 20, yOffset);
      doc.setFontSize(10);
      doc.setTextColor(0);
      yOffset += 10;

      if (Array.isArray(auditPack.triggers) && auditPack.triggers.length > 0) {
        auditPack.triggers.forEach((trigger: { source: string; confidence?: string | number; finding: string; date?: string }, index: number) => {
          if (yOffset > 250) {
            doc.addPage();
            yOffset = 20;
          }
          doc.text(`${index + 1}. Source: ${trigger.source} (Confidence: ${trigger.confidence || 'N/A'})`, 25, yOffset);
          doc.text(`Finding: ${trigger.finding}`, 30, yOffset + 5);
          doc.text(`Logged: ${trigger.date || 'N/A'}`, 30, yOffset + 10);
          yOffset += 18;
        });
      } else {
        doc.text('No standard triggers tripped.', 25, yOffset);
        yOffset += 10;
      }

      // Section: Suspicious Facts
      if (yOffset > 240) {
        doc.addPage();
        yOffset = 20;
      } else {
        yOffset += 10;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text('4. Suspicious Facts & Activity', 20, yOffset);
      doc.setFontSize(10);
      doc.setTextColor(0);
      yOffset += 10;

      if (Array.isArray(auditPack.suspiciousFacts) && auditPack.suspiciousFacts.length > 0) {
        auditPack.suspiciousFacts.forEach((fact: string) => {
          if (yOffset > 260) {
            doc.addPage();
            yOffset = 20;
          }
          doc.text(`• ${fact}`, 25, yOffset);
          yOffset += 7;
        });
      } else {
        doc.text('No high-risk suspicious facts annotated.', 25, yOffset);
        yOffset += 10;
      }

      // Section: Service Activity Summary
      if (yOffset > 230) {
        doc.addPage();
        yOffset = 20;
      } else {
        yOffset += 10;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.text('5. Service & Transaction Profile', 20, yOffset);
      doc.setFontSize(10);
      doc.setTextColor(0);
      yOffset += 10;

      if (auditPack.serviceActivity) {
        doc.text(`Account Opening Date: ${auditPack.serviceActivity.accountOpeningDate || 'N/A'}`, 25, yOffset);
        doc.text(`Total Transactions: ${auditPack.serviceActivity.totalTransactions || 0}`, 25, yOffset + 7);
        doc.text(`Total Transaction Value: ${auditPack.serviceActivity.totalValue || 'N/A'}`, 25, yOffset + 14);
        doc.text(`Suspicious Transactions: ${auditPack.serviceActivity.suspiciousTransactions || 0}`, 25, yOffset + 21);
        doc.text(`Last Activity Logged: ${auditPack.serviceActivity.lastActivity || 'N/A'}`, 25, yOffset + 28);
        yOffset += 35;
      } else {
        doc.text('No active transaction profile records found.', 25, yOffset);
        yOffset += 10;
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('CONFIDENTIAL - FOR AUTHORIZED REGULATORY USE ONLY', 105, 285, { align: 'center' });
      doc.text('Generated by GrowKYC Compliance Engine', 105, 290, { align: 'center' });

      doc.save(`AUSTRAC_AUDIT_PACK_${auditPack.caseId || caseData.caseId}.pdf`);
      toast.success('Audit Pack PDF generated from live backend data successfully!');
    } catch (error) {
      console.warn('Error generating Audit Pack PDF from API:', error);
      toast.error(`Failed to fetch live audit pack: ${error instanceof Error ? error.message : String(error)}`);
      
      // Offline fallback: Use the local mockup data dynamically so it works even if mock server is restarting!
      toast.warning('Attempting offline fallback generation using structured local cache...');
      try {
        const fallbackDoc = new jsPDF();
        const fallbackTimestamp = new Date().toLocaleString();
        
        fallbackDoc.setFontSize(22);
        fallbackDoc.setTextColor(153, 27, 27);
        fallbackDoc.text('AUSTRAC REPORTABLE MATTER AUDIT PACK (OFFLINE)', 20, 20);
        fallbackDoc.setFontSize(10);
        fallbackDoc.setTextColor(100);
        fallbackDoc.text(`Generated on: ${fallbackTimestamp}`, 20, 30);
        fallbackDoc.text(`Case Reference: ${caseData.caseId}`, 20, 35);
        fallbackDoc.line(20, 40, 190, 40);

        fallbackDoc.setFontSize(14);
        fallbackDoc.setTextColor(0, 51, 102);
        fallbackDoc.text('1. Subject Information', 20, 50);
        fallbackDoc.setFontSize(10);
        fallbackDoc.setTextColor(0);
        fallbackDoc.text(`Legal Name: ${sourceData.subjectDetails.legalName}`, 25, 60);
        fallbackDoc.text(`ABN: ${sourceData.subjectDetails.abn}`, 25, 67);
        fallbackDoc.text(`ACN: ${sourceData.subjectDetails.acn}`, 25, 74);
        fallbackDoc.text(`Registered Address: ${sourceData.subjectDetails.registeredAddress}`, 25, 81);
        fallbackDoc.text(`Industry: ${sourceData.subjectDetails.industryCode}`, 25, 88);

        fallbackDoc.setFontSize(14);
        fallbackDoc.setTextColor(0, 51, 102);
        fallbackDoc.text('2. Related Parties & Risk Associations', 20, 105);
        fallbackDoc.setFontSize(10);
        fallbackDoc.setTextColor(0);
        
        let yOffset = 115;
        sourceData.relatedParties.forEach((party, index) => {
          fallbackDoc.text(`${index + 1}. ${party.name} (${party.role})`, 25, yOffset);
          if (party.ownership) fallbackDoc.text(`Ownership: ${party.ownership}`, 30, yOffset + 5);
          if (party.riskFlag) fallbackDoc.text(`Risk Flag: ${party.riskFlag}`, 30, yOffset + 10);
          yOffset += 18;
        });

        fallbackDoc.setFontSize(8);
        fallbackDoc.setTextColor(150);
        fallbackDoc.text('CONFIDENTIAL - FOR AUTHORIZED REGULATORY USE ONLY', 105, 285, { align: 'center' });
        fallbackDoc.text('Generated by GrowKYC Compliance Engine (Offline Mode)', 105, 290, { align: 'center' });

        fallbackDoc.save(`AUSTRAC_AUDIT_PACK_${caseData.caseId}_OFFLINE.pdf`);
        toast.success('Offline Audit Pack PDF generated successfully!');
      } catch (fallbackError) {
        console.error('Critical failure in fallback generator:', fallbackError);
        toast.error('Critical error assembling document pack');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Structured source data sections
  const sourceData = React.useMemo(() => {
    const isIndiv = activeCase?.subjectType === 'individual' || caseData.caseId === 'AUS-2026-003';
    return {
      subjectDetails: {
        legalName: caseData.subject,
        abn: isIndiv ? 'N/A' : '12 345 678 901',
        acn: isIndiv ? 'N/A' : '123456789',
        registeredAddress: isIndiv ? '456 George St, Sydney NSW 2000' : '123 Collins St, Melbourne VIC 3000',
        industryCode: isIndiv ? 'Retiree / Investor' : 'Technology Services',
        registrationDate: '2020-04-15'
      },
      relatedParties: isIndiv ? [
        { name: caseData.subject, role: 'Primary Subject', ownership: '100%', riskFlag: 'PEP Match' },
        { name: 'Spouse of ' + caseData.subject, role: 'Associate', ownership: '0%', riskFlag: 'No Flag' }
      ] : [
        { name: 'John Smith', role: 'Director', ownership: '100%', riskFlag: 'Sanctions Match' },
        { name: 'Sarah Wong', role: 'Director', ownership: '0%', riskFlag: 'Foreign PEP' },
        { name: 'Tech Holdings Ltd', role: 'Parent Company', jurisdiction: 'Singapore', riskFlag: 'Court Case' }
      ],
      triggers: [
        {
          source: 'Sanctions Bot',
          finding: `${isIndiv ? 'Subject name' : 'Director John Smith'} matches DFAT consolidated list`,
          confidence: '94%',
          date: activeCase?.createdDate || '2026-03-20'
        },
        {
          source: 'Adverse Media Bot',
          finding: 'Severe financial crime theme - money laundering investigation',
          confidence: '82%',
          date: activeCase?.createdDate || '2026-03-20'
        },
        {
          source: 'SOF Bot',
          finding: 'Unexplained capital injection $2.5M',
          confidence: '67%',
          date: '2026-03-19'
        }
      ],
      suspiciousFacts: [
        `${isIndiv ? 'Subject name' : 'Director John Smith'} matched to DFAT sanctions list with 94% confidence`,
        'Multiple adverse media articles linking entity to money laundering investigation in Singapore',
        'Capital injection of $2.5M from undocumented source',
        isIndiv ? 'Subject is PEP' : 'Second director is foreign PEP (government minister)',
        'Court case pending in Singapore related to financial crime'
      ],
      serviceActivity: {
        accountOpeningDate: '2024-06-15',
        totalTransactions: 47,
        totalValue: '$3.2M',
        suspiciousTransactions: 3,
        lastActivity: '2026-03-15'
      },
      geographicLinks: ['Australia (VIC)', 'Singapore', 'Hong Kong']
    };
  }, [activeCase, caseData.subject, caseData.caseId]);

  const draftTypes = [
    { value: 'smr', label: 'Suspicious Matter Report (SMR)', color: 'red' },
    { value: 'escalation', label: 'Internal Escalation Memo', color: 'amber' },
    { value: 'partner', label: 'Partner Summary', color: 'blue' },
    { value: 'case_pack', label: 'Regulator-Ready Case Pack', color: 'purple' }
  ];

  const generateAIDraft = () => {
    const isIndiv = activeCase?.subjectType === 'individual' || caseData.caseId === 'AUS-2026-003';
    setReportContent({
      summary: `This Suspicious Matter Report relates to ${caseData.subject} (${isIndiv ? 'Individual Account' : 'ABN: 12 345 678 901'}), a ${isIndiv ? 'financial investor client' : 'technology services company'} registered in Australia. Our ongoing monitoring systems detected multiple high-severity risk indicators that collectively suggest potential sanctions exposure and unusual capital injections.\n\nThe primary concern is that the ${isIndiv ? 'subject' : "company's director John Smith"} has been matched with 94% confidence to an individual on the DFAT consolidated sanctions list. This match was confirmed through our AML screening provider ComplyAdvantage on 20 March 2026.\n\nConcurrently, our adverse media monitoring identified three separate articles published between 2025-2026 linking this client network to an ongoing money laundering investigation in Singapore.\n\nAdditionally, our Source of Funds analysis flagged an unexplained capital injection of AUD $2.5 million in March 2026, where the declared source could not be reconciled with the documented profile, which shows consecutive operational losses or undocumented wealth origins.`,
      
      chronology: `15 June 2024: Entity onboarded. All initial KYC and AML checks passed. Risk rating: Low.\n\n16 June 2024: Identity verification completed (Equifax). PEP, Sanctions, and Adverse Media screening clear (ComplyAdvantage).\n\n10 March 2025: Monitoring alert - Associated director/party Sarah Wong identified as foreign PEP (government minister). Risk rating upgraded to Medium. Enhanced due diligence commenced.\n\n20 January 2026: Adverse media alert - First article published linking entity to Singapore investigation.\n\n19 March 2026: Source of Funds concern raised - $2.5M capital injection, source unclear.\n\n20 March 2026: Critical escalation - ${isIndiv ? 'Subject' : 'Director John Smith'} matched to DFAT sanctions list. AUSTRAC case created. All services placed under review.`,
      
      explanation: `The conduct is considered suspicious for the following reasons:\n\n1. SANCTIONS EXPOSURE: The confirmed match of ${isIndiv ? 'the subject' : 'Director John Smith'} to the DFAT consolidated sanctions list creates immediate compliance concerns. Continuing to provide services to a sanctioned party may constitute a breach of Australian sanctions obligations.\n\n2. ADVERSE MEDIA PATTERN: The adverse media is not isolated - three separate reputable sources have published articles over a 14-month period linking the client network to financial crime. The consistency and severity of the allegations (money laundering investigation by Singaporean authorities) elevates this beyond routine negative publicity.\n\n3. UNEXPLAINED WEALTH: The $2.5 million capital injection cannot be reconciled with legitimate business or investment activity. The declared source contradicts the documented financial position. No supporting documentation has been provided despite requests.\n\n4. CONNECTED PARTY RISK: The associated party is a foreign PEP, and the network is subject to regulatory investigation in Singapore.\n\n5. JURISDICTION CONCERN: The involvement of Singapore and Hong Kong, combined with the unexplained funds and sanctions exposure, suggests potential sanctions evasion or money laundering structures designed to obscure the ultimate source and control of funds.`,
      
      indicators: `• ${isIndiv ? 'Subject' : 'Director'} sanctioned (DFAT list, 94% match confidence)\n• Severe adverse media - financial crime theme (3 articles, 2025-2026)\n• Unexplained source of funds ($2.5M capital injection)\n• Foreign PEP among connected parties\n• Network under investigation (Singapore)\n• Geographic risk (Singapore, Hong Kong)\n• Profile inconsistency`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1900px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Report Draft Builder</h1>
                <p className="text-white/90">Case: {caseData.caseId} | {caseData.subject}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {onBack && (
                <Button onClick={onBack} className="bg-white text-slate-800 hover:bg-slate-100">
                  Return to Control Centre
                </Button>
              )}
              <Button 
                onClick={() => handleDraftAction('submit')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit for Review
              </Button>
              <Button 
                onClick={() => handleDraftAction('save')}
                className="bg-white/10 border-2 border-white/20 text-white hover:bg-white/20"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
        </div>

        {/* Draft Type Selector */}
        <Card className="border-2 border-purple-300 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <label className="font-bold text-gray-900">Draft Type:</label>
              <div className="flex gap-3">
                {draftTypes.map((type) => (
                  <Button
                    key={type.value}
                    onClick={() => setDraftType(type.value)}
                    className={
                      draftType === type.value
                        ? `bg-${type.color}-600 text-white hover:bg-${type.color}-700`
                        : 'bg-white text-gray-700 hover:bg-gray-100 border-2'
                    }
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          {/* LEFT PANEL - Structured Source Data */}
          <Card className="border-2 border-blue-300 shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                Structured Source Data
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Click any section to insert into draft</p>
            </CardHeader>
            <CardContent className="p-6 space-y-4 max-h-[900px] overflow-y-auto">
              {/* Subject Details */}
              <Card className="border border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                <CardHeader className="bg-gray-50 border-b p-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    Subject Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600">Legal Name</p>
                      <p className="font-semibold">{sourceData.subjectDetails.legalName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">ABN</p>
                      <p className="font-semibold">{sourceData.subjectDetails.abn}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">ACN</p>
                      <p className="font-semibold">{sourceData.subjectDetails.acn}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Registration Date</p>
                      <p className="font-semibold">{sourceData.subjectDetails.registrationDate}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => {
                      setReportContent(prev => ({
                        ...prev,
                        summary: `${prev.summary}\nSubject: ${sourceData.subjectDetails.legalName}\nABN: ${sourceData.subjectDetails.abn}\nACN: ${sourceData.subjectDetails.acn}\nAddress: ${sourceData.subjectDetails.registeredAddress}`.trim()
                      }));
                      toast.success('Inserted Subject Details into Summary draft!');
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Insert into Draft
                  </Button>
                </CardContent>
              </Card>

              {/* Related Parties */}
              <Card className="border border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                <CardHeader className="bg-gray-50 border-b p-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    Related Parties
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-2">
                  {sourceData.relatedParties.map((party, idx) => (
                    <div key={idx} className="p-2 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-xs">{party.name}</p>
                          <p className="text-xs text-gray-600">{party.role}</p>
                        </div>
                        <Badge className="bg-red-100 text-red-700 text-xs">{party.riskFlag}</Badge>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => {
                      const text = sourceData.relatedParties.map(p => `- ${p.name} (${p.role}), Ownership: ${p.ownership || 'N/A'}, Risk: ${p.riskFlag}`).join('\n');
                      setReportContent(prev => ({
                        ...prev,
                        explanation: `${prev.explanation}\n\nRelated Parties Associated:\n${text}`.trim()
                      }));
                      toast.success('Inserted Related Parties into Explanation draft!');
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Insert into Draft
                  </Button>
                </CardContent>
              </Card>

              {/* Trigger Summary */}
              <Card className="border border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                <CardHeader className="bg-gray-50 border-b p-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Trigger Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-2">
                  {sourceData.triggers.map((trigger, idx) => (
                    <div key={idx} className="p-2 bg-red-50 rounded border border-red-200">
                      <div className="flex items-start justify-between mb-1">
                        <Badge variant="outline" className="text-xs">{trigger.source}</Badge>
                        <span className="text-xs font-bold">{trigger.confidence}</span>
                      </div>
                      <p className="text-xs text-gray-900">{trigger.finding}</p>
                      <p className="text-xs text-gray-600 mt-1">{trigger.date}</p>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => {
                      const text = sourceData.triggers.map(t => `- ${t.source}: ${t.finding} (Confidence: ${t.confidence})`).join('\n');
                      setReportContent(prev => ({
                        ...prev,
                        summary: `${prev.summary}\n\nCompliance Triggers Identified:\n${text}`.trim()
                      }));
                      toast.success('Inserted Trigger Summary into Summary draft!');
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Insert into Draft
                  </Button>
                </CardContent>
              </Card>

              {/* Suspicious Facts */}
              <Card className="border border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                <CardHeader className="bg-gray-50 border-b p-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Suspicious Facts Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <ul className="space-y-1 text-xs text-gray-800">
                    {sourceData.suspiciousFacts.map((fact, idx) => (
                      <li key={idx}>• {fact}</li>
                    ))}
                  </ul>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => {
                      const text = sourceData.suspiciousFacts.map(f => `• ${f}`).join('\n');
                      setReportContent(prev => ({
                        ...prev,
                        indicators: `${prev.indicators}\n${text}`.trim()
                      }));
                      toast.success('Inserted Suspicious Facts into Risk Indicators draft!');
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Insert into Draft
                  </Button>
                </CardContent>
              </Card>

              {/* Geographic Links */}
              <Card className="border border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                <CardHeader className="bg-gray-50 border-b p-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    Geographic Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {sourceData.geographicLinks.map((location, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {location}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => {
                      setReportContent(prev => ({
                        ...prev,
                        explanation: `${prev.explanation}\n\nGeographic Exposure: ${sourceData.geographicLinks.join(', ')}`.trim()
                      }));
                      toast.success('Inserted Geographic exposure into Explanation draft!');
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Insert into Draft
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* RIGHT PANEL - Draft Report */}
          <Card className="border-2 border-green-300 shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-green-600" />
                  {draftType === 'smr' ? 'Suspicious Matter Report Draft' :
                   draftType === 'escalation' ? 'Internal Escalation Memo' :
                   draftType === 'partner' ? 'Partner Summary' :
                   'Regulator-Ready Case Pack'}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={generateAIDraft}>
                    <Sparkles className="w-4 h-4 mr-1" />
                    AI Generate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setReportContent({
                        summary: '',
                        chronology: '',
                        explanation: '',
                        indicators: ''
                      });
                      toast.success('Draft builder forms successfully cleared.');
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6 max-h-[900px] overflow-y-auto">
              {/* Report Type */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <label className="block text-sm font-bold text-blue-900 mb-2">Report Type</label>
                <Badge className="bg-blue-600 text-white">
                  Suspicious Matter Report (SMR)
                </Badge>
              </div>

              {/* Reporting Entity */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-bold text-gray-900 mb-2">Reporting Entity Details</label>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Entity Name</p>
                    <p className="font-semibold">Grow Compliance Pty Ltd</p>
                  </div>
                  <div>
                    <p className="text-gray-600">ABN</p>
                    <p className="font-semibold">99 888 777 666</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Reporting Officer</p>
                    <p className="font-semibold">Michael Chen</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-semibold">{new Date().toISOString().split('T')[0]}</p>
                  </div>
                </div>
              </div>

              {/* Summary of Suspicion */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Summary of Suspicion</label>
                <textarea
                  value={reportContent.summary}
                  onChange={(e) => setReportContent({ ...reportContent, summary: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Provide a clear summary of why this matter is suspicious..."
                />
              </div>

              {/* Chronology */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-900">Chronology of Relevant Events</label>
                   <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const timeline = `[${new Date().toISOString().split('T')[0]}] Initiated detailed manual file review.\n[${new Date().toISOString().split('T')[0]}] Generated AI SMR draft report structure.\n[${new Date().toISOString().split('T')[0]}] Prepared regulator-ready compliance folder.`;
                      setReportContent(prev => ({
                        ...prev,
                        chronology: `${prev.chronology}\n${timeline}`.trim()
                      }));
                      toast.success('Timeline details appended to Chronology.');
                    }}
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Insert Timeline
                  </Button>
                </div>
                <textarea
                  value={reportContent.chronology}
                  onChange={(e) => setReportContent({ ...reportContent, chronology: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="List events in chronological order..."
                />
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Explanation of Why Conduct is Suspicious</label>
                <textarea
                  value={reportContent.explanation}
                  onChange={(e) => setReportContent({ ...reportContent, explanation: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Explain in detail why this conduct raises suspicion..."
                />
              </div>

              {/* Supporting Indicators */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Supporting Risk Indicators</label>
                <textarea
                  value={reportContent.indicators}
                  onChange={(e) => setReportContent({ ...reportContent, indicators: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="List key risk indicators..."
                />
              </div>

              {/* Attachments */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <label className="block text-sm font-bold text-purple-900 mb-2">Evidence Attachments</label>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span>Sanctions match report (ComplyAdvantage)</span>
                    <Badge className="bg-green-100 text-green-700 text-xs">Attached</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span>Adverse media articles (3 files)</span>
                    <Badge className="bg-green-100 text-green-700 text-xs">Attached</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span>SOF analysis report</span>
                    <Badge className="bg-green-100 text-green-700 text-xs">Attached</Badge>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t space-y-3">
                <Button 
                  onClick={() => handleDraftAction('submit')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Submit for Manager Review
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => handleDraftAction('save')}
                    variant="outline" 
                    className="border-2"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-2"
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                  >
                    <Download className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Generating...' : 'Export PDF'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

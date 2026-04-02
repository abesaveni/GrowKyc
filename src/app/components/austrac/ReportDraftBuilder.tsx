import React, { useState } from 'react';
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

export function ReportDraftBuilder() {
  const [draftType, setDraftType] = useState<string>('smr');
  const [reportContent, setReportContent] = useState({
    summary: '',
    chronology: '',
    explanation: '',
    indicators: ''
  });

  const caseData = {
    caseId: 'AUS-2026-002',
    subject: 'ABC Enterprises Pty Ltd',
    assignedTo: 'Michael Chen'
  };

  // Structured source data sections
  const sourceData = {
    subjectDetails: {
      legalName: 'ABC Enterprises Pty Ltd',
      abn: '12 345 678 901',
      acn: '123456789',
      registeredAddress: '123 Collins St, Melbourne VIC 3000',
      industryCode: 'Technology Services',
      registrationDate: '2020-04-15'
    },
    relatedParties: [
      { name: 'John Smith', role: 'Director', ownership: '100%', riskFlag: 'Sanctions Match' },
      { name: 'Sarah Wong', role: 'Director', ownership: '0%', riskFlag: 'Foreign PEP' },
      { name: 'Tech Holdings Ltd', role: 'Parent Company', jurisdiction: 'Singapore', riskFlag: 'Court Case' }
    ],
    triggers: [
      {
        source: 'Sanctions Bot',
        finding: 'Director "John Smith" matches DFAT consolidated list',
        confidence: '94%',
        date: '2026-03-20'
      },
      {
        source: 'Adverse Media Bot',
        finding: 'Severe financial crime theme - money laundering investigation',
        confidence: '82%',
        date: '2026-03-20'
      },
      {
        source: 'SOF Bot',
        finding: 'Unexplained capital injection $2.5M',
        confidence: '67%',
        date: '2026-03-19'
      }
    ],
    suspiciousFacts: [
      'Director matched to DFAT sanctions list with 94% confidence',
      'Multiple adverse media articles linking entity to money laundering investigation in Singapore',
      'Capital injection of $2.5M from undocumented source',
      'Second director is foreign PEP (government minister)',
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

  const draftTypes = [
    { value: 'smr', label: 'Suspicious Matter Report (SMR)', color: 'red' },
    { value: 'escalation', label: 'Internal Escalation Memo', color: 'amber' },
    { value: 'partner', label: 'Partner Summary', color: 'blue' },
    { value: 'case_pack', label: 'Regulator-Ready Case Pack', color: 'purple' }
  ];

  const generateAIDraft = () => {
    setReportContent({
      summary: `This Suspicious Matter Report relates to ABC Enterprises Pty Ltd (ABN: 12 345 678 901), a technology services company registered in Victoria, Australia. Our ongoing monitoring systems detected multiple high-severity risk indicators that collectively suggest potential sanctions evasion and money laundering activity.\n\nThe primary concern is that the company's director, John Smith, has been matched with 94% confidence to an individual on the DFAT consolidated sanctions list. This match was confirmed through our AML screening provider ComplyAdvantage on 20 March 2026.\n\nConcurrently, our adverse media monitoring identified three separate articles published between 2025-2026 linking this entity to an ongoing money laundering investigation in Singapore. The articles indicate that regulatory authorities in Singapore are investigating the company's parent entity, Tech Holdings Ltd, for suspected financial crime.\n\nAdditionally, our Source of Funds analysis flagged an unexplained capital injection of AUD $2.5 million in March 2026, where the declared source ("business operations") could not be reconciled with the company's documented trading history, which shows consecutive annual losses.`,
      
      chronology: `15 June 2024: Entity onboarded. All initial KYC and AML checks passed. Risk rating: Low.\n\n16 June 2024: Identity verification completed (Equifax). PEP, Sanctions, and Adverse Media screening clear (ComplyAdvantage).\n\n10 March 2025: Monitoring alert - Director Sarah Wong identified as foreign PEP (government minister). Risk rating upgraded to Medium. Enhanced due diligence commenced.\n\n20 January 2026: Adverse media alert - First article published linking entity to Singapore investigation.\n\n19 March 2026: Source of Funds concern raised - $2.5M capital injection, source unclear.\n\n20 March 2026: Critical escalation - Director John Smith matched to DFAT sanctions list. AUSTRAC case created. All services placed under review.`,
      
      explanation: `The conduct is considered suspicious for the following reasons:\n\n1. SANCTIONS EXPOSURE: The confirmed match of Director John Smith to the DFAT consolidated sanctions list creates immediate compliance concerns. Continuing to provide services to a sanctioned individual may constitute a breach of Australian sanctions obligations.\n\n2. ADVERSE MEDIA PATTERN: The adverse media is not isolated - three separate reputable sources have published articles over a 14-month period linking the entity to financial crime. The consistency and severity of the allegations (money laundering investigation by Singaporean authorities) elevates this beyond routine negative publicity.\n\n3. UNEXPLAINED WEALTH: The $2.5 million capital injection cannot be reconciled with legitimate business activity. The declared source ("business operations") contradicts the company's documented financial position (annual losses). No supporting documentation has been provided despite requests.\n\n4. CONNECTED PARTY RISK: The second director is a foreign PEP, and the parent company is subject to regulatory investigation in Singapore. This creates a network of elevated risk indicators.\n\n5. JURISDICTION CONCERN: The involvement of Singapore and Hong Kong, combined with the unexplained funds and sanctions exposure, suggests potential sanctions evasion or money laundering structures designed to obscure the ultimate source and control of funds.`,
      
      indicators: `• Director sanctioned (DFAT list, 94% match confidence)\n• Severe adverse media - financial crime theme (3 articles, 2025-2026)\n• Unexplained source of funds ($2.5M capital injection)\n• Foreign PEP among directors (government minister)\n• Parent company under investigation (Singapore)\n• Court case pending (money laundering related)\n• Geographic risk (Singapore, Hong Kong)\n• Business model inconsistency (losses vs large capital injection)`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1900px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-orange-900 rounded-lg p-6 text-white shadow-xl">
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
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Send className="w-5 h-5 mr-2" />
                Submit for Review
              </Button>
              <Button className="bg-white text-red-900 hover:bg-red-50">
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
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
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
                  <Button variant="outline" size="sm" className="w-full mt-3">
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
                  <Button variant="outline" size="sm" className="w-full mt-2">
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
                  <Button variant="outline" size="sm" className="w-full mt-2">
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
                  <Button variant="outline" size="sm" className="w-full mt-3">
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
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <Copy className="w-3 h-3 mr-1" />
                    Insert into Draft
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* RIGHT PANEL - Draft Report */}
          <Card className="border-2 border-green-300 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
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
                  <Button variant="outline" size="sm">
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
                  <Button variant="outline" size="sm">
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
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6">
                  <Send className="w-5 h-5 mr-2" />
                  Submit for Manager Review
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="border-2">
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button variant="outline" className="border-2">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
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

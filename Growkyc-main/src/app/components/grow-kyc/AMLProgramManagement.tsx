import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  ArrowLeft,
  Shield,
  FileText,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Edit,
  Save,
  AlertTriangle,
  Users,
  Calendar,
  BookOpen,
  Eye,
  Lock,
  Sparkles
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface AMLProgramManagementProps {
  onBack: () => void;
}

export function AMLProgramManagement({ onBack }: AMLProgramManagementProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditMode, setIsEditMode] = useState(false);

  // Current program version
  const currentProgram = {
    version: '3.2',
    status: 'Approved',
    approvedBy: 'Michael Roberts (Managing Partner)',
    approvedDate: '2024-01-15',
    effectiveDate: '2024-02-01',
    reviewDueDate: '2025-02-01',
    policyOwner: 'Sarah Chen (Head of Compliance)',
    lastModified: '2024-01-12',
    lastModifiedBy: 'Sarah Chen',
    boardSignOffDate: '2024-01-20',
    boardMinutesRef: 'BM-2024-001'
  };

  // Version history
  const versionHistory = [
    {
      version: '3.2',
      date: '2024-01-15',
      approver: 'Michael Roberts',
      status: 'Current',
      changes: 'Updated customer risk assessment methodology, added crypto asset screening'
    },
    {
      version: '3.1',
      date: '2023-07-20',
      approver: 'Michael Roberts',
      status: 'Superseded',
      changes: 'Enhanced ongoing due diligence procedures, updated PEP definition'
    },
    {
      version: '3.0',
      date: '2023-02-10',
      approver: 'David Thompson',
      status: 'Superseded',
      changes: 'Major update for AUSTRAC Tranche 2 compliance'
    },
    {
      version: '2.5',
      date: '2022-08-15',
      approver: 'Michael Roberts',
      status: 'Superseded',
      changes: 'Updated screening procedures, added enhanced CDD triggers'
    }
  ];

  // Linked procedures and controls
  const linkedProcedures = [
    { id: 'PROC-001', title: 'Customer Identification Procedure (CIP)', category: 'Part A', status: 'Current' },
    { id: 'PROC-002', title: 'Customer Due Diligence (CDD)', category: 'Part A', status: 'Current' },
    { id: 'PROC-003', title: 'Enhanced Due Diligence (EDD)', category: 'Part A', status: 'Current' },
    { id: 'PROC-004', title: 'Ongoing Customer Due Diligence (OCDD)', category: 'Part A', status: 'Current' },
    { id: 'PROC-005', title: 'PEP Screening', category: 'Part A', status: 'Current' },
    { id: 'PROC-006', title: 'Sanctions Screening', category: 'Part A', status: 'Current' },
    { id: 'PROC-007', title: 'Correspondent Banking Controls', category: 'Part A', status: 'N/A' },
    { id: 'PROC-008', title: 'Electronic Funds Transfer Reporting', category: 'Part A', status: 'Current' },
    { id: 'PROC-009', title: 'Suspicious Matter Reporting (SMR)', category: 'Part B', status: 'Current' },
    { id: 'PROC-010', title: 'Threshold Transaction Reporting (TTR)', category: 'Part B', status: 'Current' },
    { id: 'PROC-011', title: 'International Funds Transfer Instructions (IFTI)', category: 'Part B', status: 'Current' },
    { id: 'PROC-012', title: 'AML/CTF Training Program', category: 'Part B', status: 'Current' },
    { id: 'PROC-013', title: 'AML/CTF Compliance Officer Responsibilities', category: 'Part B', status: 'Current' },
    { id: 'PROC-014', title: 'Record Keeping', category: 'Part B', status: 'Current' },
    { id: 'PROC-015', title: 'Independent Review', category: 'Part B', status: 'Current' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#13B5EA] to-[#0E7C9E] text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-white/30" />
            <Shield className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold">AML/CTF Program Management</h1>
              <p className="text-sm text-white/90">AUSTRAC Tranche 2 Compliance - Part A & Part B</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-600 text-white px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              {currentProgram.status}
            </Badge>
            <Badge className="bg-white text-[#13B5EA] px-4 py-2 font-bold">
              Version {currentProgram.version}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="grid grid-cols-5 gap-4">
          <div>
            <div className="text-xs text-gray-600 mb-1">Policy Owner</div>
            <div className="text-sm font-semibold text-gray-900">{currentProgram.policyOwner}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Approved Date</div>
            <div className="text-sm font-semibold text-gray-900">{currentProgram.approvedDate}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Effective Date</div>
            <div className="text-sm font-semibold text-gray-900">{currentProgram.effectiveDate}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Review Due</div>
            <div className="text-sm font-semibold text-amber-600 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {currentProgram.reviewDueDate}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Board Sign-Off</div>
            <div className="text-sm font-semibold text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {currentProgram.boardSignOffDate}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full mb-6">
            <TabsTrigger value="overview">
              <Eye className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="part-a">
              <Shield className="w-4 h-4 mr-2" />
              Part A
            </TabsTrigger>
            <TabsTrigger value="part-b">
              <FileText className="w-4 h-4 mr-2" />
              Part B
            </TabsTrigger>
            <TabsTrigger value="procedures">
              <BookOpen className="w-4 h-4 mr-2" />
              Procedures
            </TabsTrigger>
            <TabsTrigger value="approvals">
              <Users className="w-4 h-4 mr-2" />
              Approvals
            </TabsTrigger>
            <TabsTrigger value="history">
              <Calendar className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview">
            <div className="grid gap-6">
              {/* Program Summary */}
              <Card className="border-2 border-cyan-200">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyan-600" />
                    AML/CTF Program Summary
                  </CardTitle>
                  <CardDescription>
                    Current program status and compliance overview
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="font-bold text-green-900">Compliance Status</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Part A (CIP & CDD):</span>
                          <Badge className="bg-green-600">Compliant</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Part B (Reporting):</span>
                          <Badge className="bg-green-600">Compliant</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Independent Review:</span>
                          <Badge className="bg-amber-600">Due Q1 2025</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-blue-900">Key Dates</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Program Approved:</span>
                          <span className="font-semibold">{currentProgram.approvedDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Became Effective:</span>
                          <span className="font-semibold">{currentProgram.effectiveDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Next Review Due:</span>
                          <span className="font-semibold text-amber-600">{currentProgram.reviewDueDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-white rounded-lg border-2 border-cyan-200">
                    <h3 className="font-bold text-gray-900 mb-3">Version {currentProgram.version} - Key Updates</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Enhanced Risk Scoring:</strong> Implemented 10-factor customer risk assessment methodology aligned with AUSTRAC guidance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Crypto Asset Screening:</strong> Added procedures for digital asset verification and blockchain analysis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Automated Monitoring:</strong> Integrated real-time sanctions and PEP screening via ComplyAdvantage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Enhanced ODD:</strong> Revised ongoing due diligence triggers and review frequencies by risk band</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Program Actions</CardTitle>
                  <CardDescription>Manage and maintain the AML/CTF program</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-3">
                    <Button className="bg-cyan-600 hover:bg-cyan-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Initiate Review
                    </Button>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Version
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      View Audit Trail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PART A TAB */}
          <TabsContent value="part-a">
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Part A: Customer Identification & Due Diligence
                </CardTitle>
                <CardDescription>
                  AML/CTF Act requirements for identifying and verifying customers
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Part A Sections */}
                <div className="space-y-4">
                  {[
                    {
                      section: '4.1',
                      title: 'Customer Identification Procedure (CIP)',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: 'Defines requirements for collecting and verifying customer identity using government-issued documents and reliable data sources'
                    },
                    {
                      section: '4.2',
                      title: 'Beneficial Ownership',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: 'Procedures for identifying beneficial owners (25%+ ownership or control) and ultimate controlling persons'
                    },
                    {
                      section: '4.3',
                      title: 'Customer Due Diligence (CDD)',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: 'Standard due diligence procedures including identity verification, business nature, source of funds assessment'
                    },
                    {
                      section: '4.4',
                      title: 'Enhanced Due Diligence (EDD)',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: 'Enhanced procedures for high-risk customers including PEPs, high-risk jurisdictions, complex ownership structures'
                    },
                    {
                      section: '4.5',
                      title: 'Ongoing Customer Due Diligence (OCDD)',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: 'Procedures for ongoing monitoring, periodic reviews, and transaction monitoring by risk rating'
                    },
                    {
                      section: '4.6',
                      title: 'PEP Screening',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: 'Politically Exposed Person identification, classification, and enhanced monitoring requirements'
                    },
                    {
                      section: '4.7',
                      title: 'Sanctions Screening',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: 'Screening against DFAT sanctions lists, UN lists, and international sanctions databases'
                    },
                    {
                      section: '4.8',
                      title: 'Customer Risk Assessment',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: '10-factor risk scoring model: jurisdiction, entity type, ownership, PEP, sanctions, SOF, service, delivery channel, adverse media, overall weighted score'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600">Section {item.section}</Badge>
                            <h3 className="font-bold text-gray-900">{item.title}</h3>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">{item.content}</p>
                        </div>
                        <Badge className="bg-green-600">{item.status}</Badge>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        Last reviewed: {item.lastReview}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PART B TAB */}
          <TabsContent value="part-b">
            <Card className="border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Part B: Reporting, Record Keeping & Compliance
                </CardTitle>
                <CardDescription>
                  AUSTRAC reporting obligations and compliance requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Part B Sections */}
                <div className="space-y-4">
                  {[
                    {
                      section: '5.1',
                      title: 'Suspicious Matter Reports (SMR)',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: 'Procedures for identifying, investigating, and reporting suspicious matters to AUSTRAC within required timeframes'
                    },
                    {
                      section: '5.2',
                      title: 'Threshold Transaction Reports (TTR)',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: 'Reporting requirements for physical currency transactions of $10,000 or more'
                    },
                    {
                      section: '5.3',
                      title: 'International Funds Transfer Instructions (IFTI)',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: 'Reporting requirements for international wire transfers and cross-border movements'
                    },
                    {
                      section: '5.4',
                      title: 'AML/CTF Compliance Officer',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: 'Appointment, responsibilities, authority, and reporting lines of the Compliance Officer'
                    },
                    {
                      section: '5.5',
                      title: 'Employee Due Diligence & Training',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: 'Staff screening procedures, AML/CTF training program, competency assessment, annual refresher training'
                    },
                    {
                      section: '5.6',
                      title: 'Record Keeping',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: '7-year retention requirements for customer records, transaction records, AML/CTF reports, and program documentation'
                    },
                    {
                      section: '5.7',
                      title: 'Independent Review',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: 'Annual or biennial independent review of AML/CTF program effectiveness and compliance'
                    },
                    {
                      section: '5.8',
                      title: 'Board and Senior Management Oversight',
                      status: 'Current',
                      lastReview: '2024-01-10',
                      content: 'Board approval, senior management responsibilities, compliance reporting, and escalation procedures'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-purple-600">Section {item.section}</Badge>
                            <h3 className="font-bold text-gray-900">{item.title}</h3>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">{item.content}</p>
                        </div>
                        <Badge className="bg-green-600">{item.status}</Badge>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        Last reviewed: {item.lastReview}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROCEDURES TAB */}
          <TabsContent value="procedures">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Linked Procedures & Controls</CardTitle>
                    <CardDescription>Operational procedures supporting the AML/CTF program</CardDescription>
                  </div>
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Add Procedure
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  {linkedProcedures.map((proc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-cyan-600" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{proc.title}</span>
                            <Badge variant="outline" className="text-xs">{proc.id}</Badge>
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">Category: {proc.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={proc.status === 'Current' ? 'bg-green-600' : 'bg-gray-400'}>
                          {proc.status}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* APPROVALS TAB */}
          <TabsContent value="approvals">
            <div className="grid gap-6">
              {/* Board Sign-Off */}
              <Card className="border-2 border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Board & Senior Management Sign-Off
                  </CardTitle>
                  <CardDescription>
                    Formal approval records for AML/CTF Program Version {currentProgram.version}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-green-900">Board Approval</h3>
                        <Badge className="bg-green-600">Approved</Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Meeting Date:</span>
                          <span className="font-semibold text-gray-900 ml-2">{currentProgram.boardSignOffDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Board Minutes Reference:</span>
                          <span className="font-semibold text-gray-900 ml-2">{currentProgram.boardMinutesRef}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Approved By:</span>
                          <span className="font-semibold text-gray-900 ml-2">Board of Directors</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Resolution Number:</span>
                          <span className="font-semibold text-gray-900 ml-2">RES-2024-003</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-blue-900">Managing Partner Approval</h3>
                        <Badge className="bg-blue-600">Approved</Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Approved By:</span>
                          <span className="font-semibold text-gray-900 ml-2">{currentProgram.approvedBy}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Approval Date:</span>
                          <span className="font-semibold text-gray-900 ml-2">{currentProgram.approvedDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Electronic Signature:</span>
                          <span className="font-semibold text-gray-900 ml-2">Verified ✓</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-cyan-50 rounded-lg p-4 border-2 border-cyan-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-cyan-900">Policy Owner</h3>
                        <Badge className="bg-cyan-600">Assigned</Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Owner:</span>
                          <span className="font-semibold text-gray-900 ml-2">{currentProgram.policyOwner}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Assigned Date:</span>
                          <span className="font-semibold text-gray-900 ml-2">2024-01-15</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Responsibility:</span>
                          <span className="font-semibold text-gray-900 ml-2">Program implementation & monitoring</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audit Trail */}
              <Card>
                <CardHeader>
                  <CardTitle>Approval Audit Trail</CardTitle>
                  <CardDescription>Complete history of approvals and modifications</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {[
                      { date: '2024-01-20', user: 'Board of Directors', action: 'Board sign-off completed', type: 'approval' },
                      { date: '2024-01-15', user: 'Michael Roberts', action: 'Program approved - Version 3.2', type: 'approval' },
                      { date: '2024-01-12', user: 'Sarah Chen', action: 'Final review completed, submitted for approval', type: 'review' },
                      { date: '2024-01-10', user: 'Sarah Chen', action: 'Updated Part A Section 4.8 (Risk Assessment)', type: 'edit' },
                      { date: '2024-01-08', user: 'Emma Williams', action: 'Updated Part B Section 5.1 (SMR procedures)', type: 'edit' }
                    ].map((entry, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          entry.type === 'approval' ? 'bg-green-600' :
                          entry.type === 'review' ? 'bg-blue-600' :
                          'bg-gray-400'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">{entry.action}</span>
                            <span className="text-xs text-gray-600">{entry.date}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">By: {entry.user}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* HISTORY TAB */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Version History</CardTitle>
                <CardDescription>All previous versions of the AML/CTF Program</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {versionHistory.map((version, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-lg border-2 ${
                        version.status === 'Current' 
                          ? 'bg-green-50 border-green-300' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge className={version.status === 'Current' ? 'bg-green-600' : 'bg-gray-500'}>
                            Version {version.version}
                          </Badge>
                          <span className="font-semibold text-gray-900">{version.status}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {version.date}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{version.changes}</p>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Approved by: {version.approver}</span>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

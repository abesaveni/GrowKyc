import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Shield,
  CheckCircle,
  AlertTriangle,
  Filter,
  Printer
} from 'lucide-react';

type ReportType = 'active_cases' | 'submitted' | 'not_submitted' | 'overdue' | 'qa_exceptions' | 'case_pack' | 'board_summary';

export function AuditEvidencePack() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('active_cases');
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const reportTypes = [
    {
      value: 'active_cases' as ReportType,
      label: 'Active AUSTRAC Case Register',
      description: 'All open and in-progress cases',
      count: 12,
      icon: FileText,
      color: 'blue'
    },
    {
      value: 'submitted' as ReportType,
      label: 'Submitted Report Register',
      description: 'All reports submitted to AUSTRAC',
      count: 28,
      icon: CheckCircle,
      color: 'green'
    },
    {
      value: 'not_submitted' as ReportType,
      label: 'Not-Submitted Decision Register',
      description: 'Cases closed without submission',
      count: 15,
      icon: AlertTriangle,
      color: 'gray'
    },
    {
      value: 'overdue' as ReportType,
      label: 'Overdue Review Register',
      description: 'Cases past SLA deadline',
      count: 2,
      icon: AlertTriangle,
      color: 'red'
    },
    {
      value: 'qa_exceptions' as ReportType,
      label: 'Reporting QA Exceptions',
      description: 'Quality issues identified',
      count: 1,
      icon: AlertTriangle,
      color: 'amber'
    },
    {
      value: 'case_pack' as ReportType,
      label: 'Case-Level Evidence Pack',
      description: 'Complete pack for specific case',
      count: null,
      icon: Shield,
      color: 'purple'
    },
    {
      value: 'board_summary' as ReportType,
      label: 'Board/Partner Oversight Summary',
      description: 'Executive reporting dashboard',
      count: null,
      icon: FileText,
      color: 'indigo'
    }
  ];

  const sampleCases = [
    { id: 'AUS-2026-002', subject: 'ABC Enterprises Pty Ltd', status: 'Submitted', date: '2026-03-21' },
    { id: 'AUS-2026-001', subject: 'Innovation Partners Trust', status: 'Under Investigation', date: '2026-03-18' },
    { id: 'AUS-2026-000', subject: 'Green Valley SMSF', status: 'Not Submitted', date: '2026-03-20' }
  ];

  const caseLevelPackContents = [
    { category: 'Case Metadata', items: ['Case ID, dates, assigned personnel', 'Status history log', 'Decision timeline'] },
    { category: 'Trigger Events', items: ['All bot alerts with timestamps', 'Trigger confidence scores', 'Source module attribution'] },
    { category: 'Screening Results', items: ['Identity verification (Equifax)', 'PEP screening (ComplyAdvantage)', 'Sanctions screening (ComplyAdvantage)', 'Adverse media results', 'Business credit (Illion)', 'Court and litigation (Illion)', 'Ownership verification (ASIC)'] },
    { category: 'Evidence Snapshots', items: ['Media article PDFs', 'Sanctions match reports', 'Source of funds documents', 'Identity verification results', 'Ownership structure diagrams'] },
    { category: 'Analyst Notes', items: ['Investigation notes (timestamped)', 'Evidence review comments', 'Recommendation rationale'] },
    { category: 'Decision Notes', items: ['Manager decision with reasoning', 'MLRO approval/rejection', 'Override justifications (if any)'] },
    { category: 'Service Actions', items: ['Service hold records', 'Restriction details', 'Timeline of actions taken'] },
    { category: 'Submission Status', items: ['Submission reference numbers', 'AUSTRAC acknowledgement', 'Correspondence logs'] },
    { category: 'Closure Notes', items: ['Final outcome documented', 'Lessons learned', 'Follow-up actions'] }
  ];

  const getColorClass = (color: string) => {
    return `bg-${color}-100 text-${color}-700 border-${color}-300`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-orange-900 rounded-lg p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">AUSTRAC Audit & Evidence Pack</h1>
                <p className="text-white/90">Regulator-ready reporting and documentation</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-red-900 hover:bg-red-50">
                <Printer className="w-5 h-5 mr-2" />
                Print
              </Button>
              <Button className="bg-white text-red-900 hover:bg-red-50">
                <Download className="w-5 h-5 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="grid md:grid-cols-7 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <Card
                key={report.value}
                onClick={() => setSelectedReport(report.value)}
                className={`cursor-pointer transition-all ${
                  selectedReport === report.value
                    ? `border-4 border-${report.color}-500 bg-${report.color}-50`
                    : 'border-2 border-gray-300 hover:border-blue-300'
                }`}
              >
                <CardContent className="p-4">
                  <Icon className={`w-8 h-8 text-${report.color}-600 mb-3`} />
                  <p className="font-bold text-sm text-gray-900 mb-1">{report.label}</p>
                  <p className="text-xs text-gray-600 mb-2">{report.description}</p>
                  {report.count !== null && (
                    <Badge className={getColorClass(report.color)}>
                      {report.count} records
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Active Cases Report */}
        {selectedReport === 'active_cases' && (
          <Card className="border-2 border-blue-300 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Active AUSTRAC Case Register</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <Button className="bg-blue-600 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-bold">Case ID</th>
                      <th className="text-left py-3 px-4 text-sm font-bold">Subject</th>
                      <th className="text-left py-3 px-4 text-sm font-bold">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-bold">Created</th>
                      <th className="text-left py-3 px-4 text-sm font-bold">Assigned To</th>
                      <th className="text-left py-3 px-4 text-sm font-bold">SLA</th>
                      <th className="text-left py-3 px-4 text-sm font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleCases.map((c) => (
                      <tr key={c.id} className="border-b hover:bg-blue-50">
                        <td className="py-3 px-4 font-mono font-semibold">{c.id}</td>
                        <td className="py-3 px-4 font-semibold">{c.subject}</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-blue-100 text-blue-700">{c.status}</Badge>
                        </td>
                        <td className="py-3 px-4">{c.date}</td>
                        <td className="py-3 px-4">Michael Chen</td>
                        <td className="py-3 px-4">
                          <span className="text-green-600">24h left</span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Audit Note:</strong> This register shows all cases currently in progress. Each entry
                  includes full audit trail with timestamps, reviewers, and decision points. Export includes all
                  metadata required for regulator inspection.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Case-Level Evidence Pack */}
        {selectedReport === 'case_pack' && (
          <div className="space-y-6">
            <Card className="border-2 border-purple-300 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                <CardTitle className="text-2xl">Generate Case-Level Evidence Pack</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-900 mb-3">Select Case</label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {sampleCases.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCase(c.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedCase === c.id
                            ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                            : 'border-gray-300 hover:border-purple-300 bg-white'
                        }`}
                      >
                        <p className="font-mono font-bold text-purple-900 mb-1">{c.id}</p>
                        <p className="font-semibold text-gray-900 mb-2">{c.subject}</p>
                        <Badge className="bg-purple-100 text-purple-700 text-xs">{c.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedCase && (
                  <div className="space-y-4">
                    <div className="p-6 bg-green-50 rounded-lg border-2 border-green-300">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                          <h3 className="font-bold text-green-900 text-lg">Case Selected: {selectedCase}</h3>
                          <p className="text-sm text-green-800">Complete evidence pack will be generated</p>
                        </div>
                      </div>
                    </div>

                    <Card className="border-2 border-gray-300">
                      <CardHeader className="bg-gray-50 border-b">
                        <CardTitle>Evidence Pack Contents</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {caseLevelPackContents.map((section, idx) => (
                            <div key={idx} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                {section.category}
                              </h4>
                              <ul className="space-y-1">
                                {section.items.map((item, i) => (
                                  <li key={i} className="text-sm text-purple-800 flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-600" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 pt-6 border-t">
                          <div className="grid md:grid-cols-2 gap-4">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white text-lg py-6">
                              <Download className="w-6 h-6 mr-2" />
                              Download PDF Pack
                            </Button>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-6">
                              <Download className="w-6 h-6 mr-2" />
                              Download ZIP (All Files)
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compliance Note */}
            <Card className="border-2 border-blue-300 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">Regulator-Ready Evidence Pack</h3>
                    <p className="text-sm text-blue-800 mb-3">
                      This comprehensive pack includes everything required for AUSTRAC compliance inspection:
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>✓ All screening results with provider attribution (ASIC, Equifax, Illion, ComplyAdvantage)</li>
                      <li>✓ Complete audit trail with timestamps and actor attribution</li>
                      <li>✓ Decision rationale from analyst and MLRO</li>
                      <li>✓ Evidence snapshots (articles, matches, documents)</li>
                      <li>✓ Service action records</li>
                      <li>✓ Submission/acknowledgement documentation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Board/Partner Summary */}
        {selectedReport === 'board_summary' && (
          <Card className="border-2 border-indigo-300 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
              <CardTitle className="text-2xl">Board/Partner Oversight Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-300 text-center">
                  <p className="text-sm text-blue-700 mb-2">Active Cases</p>
                  <p className="text-5xl font-bold text-blue-900">12</p>
                </div>
                <div className="p-6 bg-green-50 rounded-lg border-2 border-green-300 text-center">
                  <p className="text-sm text-green-700 mb-2">Submitted YTD</p>
                  <p className="text-5xl font-bold text-green-900">28</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg border-2 border-gray-300 text-center">
                  <p className="text-sm text-gray-700 mb-2">Not Submitted</p>
                  <p className="text-5xl font-bold text-gray-900">15</p>
                </div>
                <div className="p-6 bg-red-50 rounded-lg border-2 border-red-300 text-center">
                  <p className="text-sm text-red-700 mb-2">Overdue</p>
                  <p className="text-5xl font-bold text-red-900">2</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-purple-50 rounded-lg border-2 border-purple-300">
                  <h3 className="font-bold text-purple-900 text-lg mb-4">Executive Summary - Q1 2026</h3>
                  <p className="text-sm text-purple-800 mb-4">
                    During Q1 2026, the compliance team reviewed 45 potential suspicious matters. Of these, 28 were
                    submitted to AUSTRAC as SMRs, 15 were closed as not reportable following investigation, and 2 cases
                    remain under review.
                  </p>
                  <p className="text-sm text-purple-800">
                    <strong>Key trends:</strong> Increased sanctions-related alerts (up 40% vs Q4 2025) due to expanded
                    list coverage. All cases processed within SLA timelines except 2 complex ownership investigations
                    requiring extended due diligence.
                  </p>
                </div>

                <div className="p-6 bg-amber-50 rounded-lg border-2 border-amber-300">
                  <h3 className="font-bold text-amber-900 text-lg mb-4">Service Impact</h3>
                  <ul className="text-sm text-amber-800 space-y-2">
                    <li>• 3 clients placed under service hold during investigation (all resolved)</li>
                    <li>• 1 client relationship disengaged following AUSTRAC submission</li>
                    <li>• Average case resolution time: 4.2 days (target: 5 days)</li>
                  </ul>
                </div>
              </div>

              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-6 mt-6">
                <Download className="w-6 h-6 mr-2" />
                Download Executive Report (PDF)
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

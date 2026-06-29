import React, { useState } from 'react';
import { toast } from '../../lib/toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { downloadRecordPdf, downloadTablePdf } from '../../lib/exportPdf';
import {
  FileText,
  Download,
  Eye,
  Shield,
  CheckCircle,
  AlertTriangle,
  Filter,
  Printer,
  ArrowLeft
} from 'lucide-react';

type ReportType =
  | 'active_cases' | 'submitted' | 'not_submitted' | 'overdue'
  | 'qa_exceptions' | 'case_pack' | 'board_summary';

interface AuditEvidencePackProps {
  onBack?: () => void;
}

interface RegisterDef {
  label: string;
  description: string;
  count: number | null;
  icon: React.ComponentType<any>;
  color: string;
}

const REGISTERS: Record<ReportType, RegisterDef> = {
  active_cases: { label: 'Active AUSTRAC Case Register', description: 'All open and in-progress cases', count: 12, icon: FileText, color: 'blue' },
  submitted: { label: 'Submitted Report Register', description: 'All reports submitted to AUSTRAC', count: 28, icon: CheckCircle, color: 'green' },
  not_submitted: { label: 'Not-Submitted Decision Register', description: 'Cases closed without submission', count: 15, icon: AlertTriangle, color: 'gray' },
  overdue: { label: 'Overdue Review Register', description: 'Cases past SLA deadline', count: 2, icon: AlertTriangle, color: 'red' },
  qa_exceptions: { label: 'Reporting QA Exceptions', description: 'Quality issues identified', count: 1, icon: AlertTriangle, color: 'amber' },
  case_pack: { label: 'Case-Level Evidence Pack', description: 'Complete pack for specific case', count: null, icon: Shield, color: 'purple' },
  board_summary: { label: 'Board/Partner Oversight Summary', description: 'Executive reporting dashboard', count: null, icon: FileText, color: 'indigo' },
};

// Tabular registers (everything except case_pack + board_summary)
const REGISTER_TABLES: Partial<Record<ReportType, { columns: string[]; rows: string[][]; note: string }>> = {
  active_cases: {
    columns: ['Case ID', 'Subject', 'Status', 'Created', 'Assigned To', 'SLA'],
    rows: [
      ['AUS-2026-002', 'ABC Enterprises Pty Ltd', 'Under Investigation', '2026-03-18', 'Michael Chen', '24h left'],
      ['AUS-2026-005', 'Innovation Partners Trust', 'In Triage', '2026-03-19', 'Sarah Chen', '3d left'],
      ['AUS-2026-007', 'Pacific Trading Co Pty Ltd', 'Awaiting Manager', '2026-03-20', 'Alex Rivera', '5d left'],
    ],
    note: 'All cases currently in progress, with full audit trail (timestamps, reviewers, decision points).',
  },
  submitted: {
    columns: ['Report ID', 'Subject', 'SMR Reference', 'Submitted', 'Acknowledgement'],
    rows: [
      ['SMR-2026-014', 'Green Valley SMSF', 'AUSTRAC-ACK-789456', '2026-03-12', 'Received'],
      ['SMR-2026-013', 'Coastal Holdings Ltd', 'AUSTRAC-ACK-789321', '2026-03-08', 'Received'],
      ['SMR-2026-012', 'Delta Imports Pty Ltd', 'AUSTRAC-ACK-788902', '2026-02-28', 'Received'],
    ],
    note: 'All Suspicious Matter Reports submitted to AUSTRAC, with submission references and acknowledgements.',
  },
  not_submitted: {
    columns: ['Case ID', 'Subject', 'Closure Reason', 'Closed', 'Decided By'],
    rows: [
      ['AUS-2026-004', 'Summit Advisory Group', 'Not reportable after EDD', '2026-03-15', 'Head of Compliance'],
      ['AUS-2026-003', 'Riverside Logistics', 'False positive (PEP)', '2026-03-11', 'Senior Compliance Officer'],
      ['AUS-2026-001', 'Northwind Capital', 'Insufficient grounds', '2026-03-06', 'Head of Compliance'],
    ],
    note: 'Cases reviewed and closed without an SMR submission, each with a documented decision rationale.',
  },
  overdue: {
    columns: ['Case ID', 'Subject', 'Days Overdue', 'Assigned To', 'Original Due'],
    rows: [
      ['AUS-2026-006', 'Meridian Trust Services', '3 days', 'Michael Chen', '2026-03-17'],
      ['AUS-2026-008', 'Apex Holdings Pty Ltd', '1 day', 'Alex Rivera', '2026-03-19'],
    ],
    note: 'Cases past their SLA deadline. Escalated to the Head of Compliance for immediate attention.',
  },
  qa_exceptions: {
    columns: ['Case ID', 'Issue', 'Severity', 'Identified By', 'Date'],
    rows: [
      ['SMR-2026-011', 'Missing source-of-funds evidence snapshot', 'Medium', 'Internal Auditor', '2026-03-09'],
    ],
    note: 'Quality-assurance exceptions found during report review, tracked to remediation.',
  },
};

const SAMPLE_CASES = [
  { id: 'AUS-2026-002', subject: 'ABC Enterprises Pty Ltd', status: 'Submitted' },
  { id: 'AUS-2026-001', subject: 'Innovation Partners Trust', status: 'Under Investigation' },
  { id: 'AUS-2026-000', subject: 'Green Valley SMSF', status: 'Not Submitted' },
];

const PACK_CONTENTS = [
  { category: 'Case Metadata', items: ['Case ID, dates, assigned personnel', 'Status history log', 'Decision timeline'] },
  { category: 'Trigger Events', items: ['All bot alerts with timestamps', 'Trigger confidence scores', 'Source module attribution'] },
  { category: 'Screening Results', items: ['Identity (Equifax)', 'PEP & Sanctions (ComplyAdvantage)', 'Adverse media', 'Business credit (Illion)', 'Ownership (ASIC)'] },
  { category: 'Evidence Snapshots', items: ['Media article PDFs', 'Sanctions match reports', 'Source of funds documents', 'Ownership structure diagrams'] },
  { category: 'Decision & Notes', items: ['Analyst investigation notes', 'Manager decision with reasoning', 'MLRO approval/rejection', 'Override justifications'] },
  { category: 'Submission & Closure', items: ['Submission reference numbers', 'AUSTRAC acknowledgement', 'Final outcome & lessons learned'] },
];

const BOARD_STATS = [
  { label: 'Active Cases', value: '12', color: 'text-blue-600' },
  { label: 'Submitted YTD', value: '28', color: 'text-green-600' },
  { label: 'Not Submitted', value: '15', color: 'text-gray-700' },
  { label: 'Overdue', value: '2', color: 'text-red-600' },
];

export function AuditEvidencePack({ onBack }: AuditEvidencePackProps = {}) {
  const [selectedReport, setSelectedReport] = useState<ReportType>('active_cases');
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<{ columns: string[]; row: string[] } | null>(null);

  const current = REGISTERS[selectedReport];
  const table = REGISTER_TABLES[selectedReport];

  // Download the currently-selected register as a real PDF.
  const downloadRegisterPdf = () => {
    if (!table) {
      toast.info('This register has no tabular data to download');
      return;
    }
    downloadTablePdf(
      `${current.label.replace(/[^a-z0-9]+/gi, '_')}.pdf`,
      current.label,
      table.columns,
      table.rows,
      table.note,
    );
    toast.success(`Downloaded ${table.rows.length} record(s) as PDF`);
  };

  // Download a single register record as a real PDF.
  const downloadRowPdf = () => {
    if (!selectedRow) return;
    downloadRecordPdf(
      `${selectedRow.row[0] || 'record'}.pdf`,
      `${current.label} — ${selectedRow.row[0] || ''}`,
      selectedRow.columns.map((c, i) => [c, selectedRow.row[i]] as [string, string]),
    );
    toast.success('Record downloaded as PDF');
  };

  // Real client-side CSV export of the currently-selected register.
  const exportCsv = () => {
    if (!table) return;
    const esc = (c: string) => `"${String(c).replace(/"/g, '""')}"`;
    const csv = [table.columns, ...table.rows]
      .map((row) => row.map(esc).join(','))
      .join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${current.label.replace(/[^a-z0-9]+/gi, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${table.rows.length} record(s) to CSV`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 text-white shadow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" onClick={onBack} className="bg-white/10 border border-white/20 text-white hover:bg-white/20">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
              )}
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AUSTRAC Audit &amp; Evidence Pack</h1>
                <p className="text-sm text-white/80">Regulator-ready reporting and documentation</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => window.print()} className="bg-white text-slate-800 hover:bg-slate-100"><Printer className="w-4 h-4 mr-2" />Print</Button>
              <Button onClick={downloadRegisterPdf} className="bg-white text-slate-800 hover:bg-slate-100"><Download className="w-4 h-4 mr-2" />Download PDF</Button>
            </div>
          </div>
        </div>

        {/* Register selector — uniform white cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {(Object.keys(REGISTERS) as ReportType[]).map((key) => {
            const r = REGISTERS[key];
            const Icon = r.icon;
            const active = selectedReport === key;
            return (
              <Card
                key={key}
                onClick={() => setSelectedReport(key)}
                className={`cursor-pointer transition-all ${active ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <CardContent className="p-4">
                  <Icon className={`w-7 h-7 mb-3 ${r.color === 'gray' ? 'text-gray-500' : `text-${r.color}-600`}`} />
                  <p className="font-semibold text-sm text-gray-900 mb-1 leading-snug">{r.label}</p>
                  <p className="text-xs text-gray-500 mb-2">{r.description}</p>
                  {r.count !== null && (
                    <Badge variant="outline" className="text-xs text-gray-600 border-gray-200">{r.count} records</Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabular register views (active / submitted / not_submitted / overdue / qa) */}
        {table && (
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-lg">{current.label}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast.info('Opening filters…')}><Filter className="w-4 h-4 mr-2" />Filters</Button>
                  <Button size="sm" onClick={exportCsv} className="bg-blue-600 hover:bg-blue-700 text-white"><Download className="w-4 h-4 mr-2" />Export CSV</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {table.columns.map((col) => (
                        <th key={col} className="text-left py-3 px-4 font-semibold text-gray-600">{col}</th>
                      ))}
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, ri) => (
                      <tr key={ri} className="border-b last:border-0 hover:bg-gray-50">
                        {row.map((cell, ci) => (
                          <td key={ci} className={`py-3 px-4 ${ci === 0 ? 'font-mono font-medium text-gray-900' : 'text-gray-700'}`}>{cell}</td>
                        ))}
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm" onClick={() => setSelectedRow({ columns: table.columns, row })}><Eye className="w-4 h-4 mr-1" />View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-600"><span className="font-semibold text-gray-700">Audit note:</span> {table.note}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Case-Level Evidence Pack */}
        {selectedReport === 'case_pack' && (
          <Card>
            <CardHeader className="border-b"><CardTitle className="text-lg">Generate Case-Level Evidence Pack</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select a case</label>
                <div className="grid md:grid-cols-3 gap-3">
                  {SAMPLE_CASES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCase(c.id)}
                      className={`text-left p-4 rounded-lg border transition-all ${selectedCase === c.id ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                    >
                      <p className="font-mono font-semibold text-gray-900 mb-1">{c.id}</p>
                      <p className="text-sm text-gray-700 mb-2">{c.subject}</p>
                      <Badge variant="outline" className="text-xs text-gray-600 border-gray-200">{c.status}</Badge>
                    </button>
                  ))}
                </div>
              </div>

              {selectedCase && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-green-200 bg-green-50">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Case selected: {selectedCase}</p>
                      <p className="text-sm text-gray-600">A complete regulator-ready evidence pack will be generated.</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {PACK_CONTENTS.map((section, idx) => (
                      <div key={idx} className="p-4 rounded-lg border border-gray-200 bg-white">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-blue-600" />{section.category}</h4>
                        <ul className="space-y-1">
                          {section.items.map((item, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" /><span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <Button
                      onClick={() => {
                        const c = SAMPLE_CASES.find((s) => s.id === selectedCase);
                        downloadRecordPdf(
                          `evidence_pack_${selectedCase}.pdf`,
                          `AUSTRAC Evidence Pack — ${selectedCase}`,
                          [
                            ['Case ID', selectedCase || ''],
                            ['Subject', c?.subject || ''],
                            ['Status', c?.status || ''],
                            ...PACK_CONTENTS.map(
                              (s) => [s.category, s.items.join('; ')] as [string, string],
                            ),
                          ],
                          'Regulator-ready evidence pack. Generated from the GrowKYC AUSTRAC module.',
                        );
                        toast.success('Evidence pack downloaded as PDF');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                    >
                      <Download className="w-5 h-5 mr-2" />Download PDF Pack
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Board / Partner Oversight Summary — clean professional */}
        {selectedReport === 'board_summary' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BOARD_STATS.map((s) => (
                <Card key={s.label}>
                  <CardContent className="p-5">
                    <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader className="border-b"><CardTitle className="text-lg">Executive Summary — Q1 2026</CardTitle></CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  During Q1 2026 the compliance team reviewed 45 potential suspicious matters. Of these, 28 were
                  submitted to AUSTRAC as SMRs, 15 were closed as not reportable following investigation, and 2 cases
                  remain under review.
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">Key trends:</span> sanctions-related alerts increased 40%
                  vs Q4 2025 due to expanded list coverage. All cases were processed within SLA except 2 complex
                  ownership investigations requiring extended due diligence.
                </p>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 mb-2">Service impact</h4>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li>• 3 clients placed under service hold during investigation (all resolved)</li>
                    <li>• 1 client relationship disengaged following AUSTRAC submission</li>
                    <li>• Average case resolution time: 4.2 days (target: 5 days)</li>
                  </ul>
                </div>
                <Button
                  onClick={() => {
                    downloadRecordPdf(
                      'austrac_executive_report_Q1_2026.pdf',
                      'AUSTRAC Executive Report — Q1 2026',
                      [
                        ...BOARD_STATS.map((s) => [s.label, s.value] as [string, string]),
                        ['Matters reviewed', '45'],
                        ['Submitted as SMRs', '28'],
                        ['Closed (not reportable)', '15'],
                        ['Under review', '2'],
                        ['Avg case resolution', '4.2 days (target 5)'],
                        ['Key trend', 'Sanctions-related alerts +40% vs Q4 2025'],
                      ],
                      'Executive summary for board / partner oversight. Generated from the GrowKYC AUSTRAC module.',
                    );
                    toast.success('Executive report downloaded as PDF');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
                ><Download className="w-5 h-5 mr-2" />Download Executive Report (PDF)</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Record detail modal (opened by a row "View" button) */}
      {selectedRow && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedRow(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedRow.row[0]}</h3>
                <p className="text-sm text-gray-500">{current.label}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRow(null)}>✕</Button>
            </div>
            <div className="px-6 py-4 space-y-3">
              {selectedRow.columns.map((col, i) => (
                <div key={col} className="flex justify-between gap-4 border-b border-gray-100 pb-2 last:border-0">
                  <span className="text-sm font-semibold text-gray-600">{col}</span>
                  <span className="text-sm text-gray-900 text-right">{selectedRow.row[i] || '—'}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <Button variant="outline" onClick={() => setSelectedRow(null)}>Close</Button>
              <Button onClick={downloadRowPdf} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="w-4 h-4 mr-2" />Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  Shield,
  Building2,
  TrendingUp,
  AlertTriangle,
  Zap
} from 'lucide-react';

interface RegulatoryReportsProps {
  onBack: () => void;
}

export function RegulatoryReports({ onBack }: RegulatoryReportsProps) {
  const reports = [
    {
      id: 'austrac-smr',
      name: 'AUSTRAC Suspicious Matter Report (SMR)',
      regulator: 'AUSTRAC',
      frequency: 'As needed',
      lastGenerated: '2026-02-15',
      status: 'current',
      compliance: 'AML/CTF Act 2006',
      timeSaving: '95%'
    },
    {
      id: 'austrac-annual',
      name: 'AUSTRAC Annual Compliance Report',
      regulator: 'AUSTRAC',
      frequency: 'Annually',
      lastGenerated: '2025-12-31',
      status: 'due-soon',
      compliance: 'AML/CTF Act 2006',
      timeSaving: '85%'
    },
    {
      id: 'austrac-ttmr',
      name: 'AUSTRAC Threshold Transaction Report (TTR)',
      regulator: 'AUSTRAC',
      frequency: 'Within 10 days',
      lastGenerated: '2026-03-18',
      status: 'current',
      compliance: 'AML/CTF Act 2006',
      timeSaving: '90%'
    },
    {
      id: 'asic-afsl',
      name: 'ASIC AFSL Compliance Report (FS70)',
      regulator: 'ASIC',
      frequency: 'Annually',
      lastGenerated: '2025-09-30',
      status: 'current',
      compliance: 'Corporations Act 2001',
      timeSaving: '80%'
    },
    {
      id: 'asic-breach',
      name: 'ASIC Breach Notification',
      regulator: 'ASIC',
      frequency: 'Within 10 days',
      lastGenerated: 'Never',
      status: 'none',
      compliance: 'Corporations Act 2001',
      timeSaving: '100%'
    },
    {
      id: 'nccp-annual',
      name: 'NCCP Annual Compliance Certificate',
      regulator: 'ASIC',
      frequency: 'Annually',
      lastGenerated: '2025-11-30',
      status: 'current',
      compliance: 'National Credit Code',
      timeSaving: '75%'
    },
    {
      id: 'firb-annual',
      name: 'FIRB Annual Compliance Report',
      regulator: 'FIRB',
      frequency: 'Annually',
      lastGenerated: '2026-01-15',
      status: 'current',
      compliance: 'FATA 2015',
      timeSaving: '70%'
    },
    {
      id: 'fatca-reporting',
      name: 'FATCA/CRS Reporting',
      regulator: 'ATO',
      frequency: 'Annually (July)',
      lastGenerated: '2025-07-31',
      status: 'due-soon',
      compliance: 'Tax Act 1953',
      timeSaving: '90%'
    }
  ];

  const templates = [
    {
      name: 'Client Risk Assessment Summary',
      description: 'Portfolio-wide risk profiling for board review',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      name: 'Transaction Monitoring Report',
      description: 'Suspicious transaction analysis for AML team',
      icon: AlertTriangle,
      color: 'amber'
    },
    {
      name: 'KYC Refresh Status Report',
      description: 'Track periodic KYC reviews and compliance',
      icon: Calendar,
      color: 'green'
    },
    {
      name: 'Sanctions Screening Log',
      description: 'Complete screening history with match details',
      icon: Shield,
      color: 'red'
    },
    {
      name: 'PEP & High-Risk Clients',
      description: 'Enhanced due diligence requirement tracking',
      icon: Building2,
      color: 'purple'
    },
    {
      name: 'Document Collection Status',
      description: 'Missing documents and follow-up actions',
      icon: FileText,
      color: 'indigo'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-600 text-white';
      case 'due-soon': return 'bg-amber-600 text-white';
      case 'overdue': return 'bg-red-600 text-white';
      case 'none': return 'bg-gray-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white px-8 py-12">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">One-Click Regulatory Reports</h1>
            <p className="text-white/90 text-xl">Auto-generate AUSTRAC, ASIC, FIRB compliance reports • 80%+ time savings</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-6 h-6 text-white" />
              <div className="text-sm text-white/80">Report Templates</div>
            </div>
            <div className="text-4xl font-bold mb-1">14</div>
            <div className="text-xs text-white/70">8 regulatory + 6 internal</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-white" />
              <div className="text-sm text-white/80">Avg Time Saved</div>
            </div>
            <div className="text-4xl font-bold mb-1">85%</div>
            <div className="text-xs text-white/70">vs manual reporting</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-white" />
              <div className="text-sm text-white/80">Accuracy</div>
            </div>
            <div className="text-4xl font-bold mb-1">100%</div>
            <div className="text-xs text-white/70">Data validation</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <Download className="w-6 h-6 text-white" />
              <div className="text-sm text-white/80">Reports Generated</div>
            </div>
            <div className="text-4xl font-bold mb-1">342</div>
            <div className="text-xs text-white/70">This year</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Regulatory Reports */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Regulatory Compliance Reports</h2>
              <p className="text-gray-600">AUSTRAC, ASIC, FIRB, and ATO reporting requirements</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="border-2 hover:border-emerald-300 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{report.name}</h3>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status === 'current' ? 'Current' :
                           report.status === 'due-soon' ? 'Due Soon' :
                           report.status === 'overdue' ? 'Overdue' : 'Not Required'}
                        </Badge>
                        <Badge variant="outline">{report.regulator}</Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">Compliance: {report.compliance}</p>

                      <div className="grid grid-cols-4 gap-6 mb-4">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Frequency</div>
                          <div className="font-semibold text-gray-900">{report.frequency}</div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600 mb-1">Last Generated</div>
                          <div className="font-semibold text-gray-900">{report.lastGenerated}</div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600 mb-1">Time Savings</div>
                          <div className="font-semibold text-emerald-600">{report.timeSaving}</div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600 mb-1">Accuracy</div>
                          <div className="font-semibold text-green-600">100%</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Now
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Last
                      </Button>
                      <Button variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Internal Report Templates */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Internal Report Templates</h2>
            <p className="text-gray-600">Custom reports for compliance teams and board review</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {templates.map((template, idx) => {
              const TemplateIcon = template.icon;
              return (
                <Card key={idx} className="border-2 hover:border-blue-300 cursor-pointer transition-all">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-${template.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                      <TemplateIcon className={`w-6 h-6 text-${template.color}-600`} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <Button className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <Card className="mt-12 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
          <CardHeader>
            <CardTitle>Report Generation Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-3">One-Click Generation</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Auto-populate from client data
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Regulatory format compliance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    PDF, Excel, XML export
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3">Data Validation</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    100% accuracy guarantee
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Missing data alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Field-level validation
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3">Automation</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Scheduled generation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Email delivery to regulators
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Audit trail retention
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

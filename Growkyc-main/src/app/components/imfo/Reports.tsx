import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  Plus,
  Filter,
  RefreshCw,
  Send,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface ReportsProps {
  onNavigate: (page: string) => void;
  role: string;
  onBack?: () => void;
}

type ReportType = 'investor' | 'quarterly' | 'annual' | 'performance' | 'compliance' | 'custom';
type ReportStatus = 'draft' | 'pending' | 'sent' | 'viewed';

interface Report {
  id: string;
  name: string;
  type: ReportType;
  status: ReportStatus;
  fund: string;
  period: string;
  recipients: number;
  generatedDate: string;
  sentDate?: string;
  viewedBy?: number;
  pages: number;
}

export function Reports({ onNavigate, role, onBack }: ReportsProps) {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ReportType | 'all'>('all');
  const [showGenerator, setShowGenerator] = useState(false);

  const reports: Report[] = [
    {
      id: 'rpt-001',
      name: 'Q4 2025 Investor Update',
      type: 'quarterly',
      status: 'sent',
      fund: 'Growth Credit Fund I',
      period: 'Q4 2025',
      recipients: 127,
      generatedDate: '2026-01-15',
      sentDate: '2026-01-20',
      viewedBy: 118,
      pages: 24
    },
    {
      id: 'rpt-002',
      name: 'Annual Performance Report 2025',
      type: 'annual',
      status: 'sent',
      fund: 'Growth Credit Fund I',
      period: 'FY 2025',
      recipients: 127,
      generatedDate: '2026-01-05',
      sentDate: '2026-01-10',
      viewedBy: 125,
      pages: 48
    },
    {
      id: 'rpt-003',
      name: 'Monthly Performance Update - January 2026',
      type: 'performance',
      status: 'pending',
      fund: 'Opportunity Fund II',
      period: 'Jan 2026',
      recipients: 89,
      generatedDate: '2026-02-05',
      pages: 12
    },
    {
      id: 'rpt-004',
      name: 'Q1 2026 Investor Update',
      type: 'quarterly',
      status: 'draft',
      fund: 'Growth Credit Fund I',
      period: 'Q1 2026',
      recipients: 0,
      generatedDate: '2026-02-14',
      pages: 26
    },
    {
      id: 'rpt-005',
      name: 'Compliance Summary Report',
      type: 'compliance',
      status: 'sent',
      fund: 'All Funds',
      period: 'Jan 2026',
      recipients: 5,
      generatedDate: '2026-02-01',
      sentDate: '2026-02-02',
      viewedBy: 5,
      pages: 8
    }
  ];

  const reportTemplates = [
    {
      id: 'tpl-001',
      name: 'Quarterly Investor Update',
      description: 'Standard quarterly performance and portfolio update for investors',
      sections: ['Executive Summary', 'Fund Performance', 'Portfolio Overview', 'Market Commentary', 'Outlook'],
      pages: '20-30 pages'
    },
    {
      id: 'tpl-002',
      name: 'Annual Report',
      description: 'Comprehensive annual report with audited financials',
      sections: ['Fund Overview', 'Investment Strategy', 'Performance Analysis', 'Portfolio Holdings', 'Financial Statements', 'Governance'],
      pages: '40-60 pages'
    },
    {
      id: 'tpl-003',
      name: 'Monthly Performance Summary',
      description: 'Concise monthly performance update',
      sections: ['Performance Summary', 'Portfolio Activity', 'Key Metrics'],
      pages: '8-12 pages'
    },
    {
      id: 'tpl-004',
      name: 'Custom Report',
      description: 'Build your own report with selected sections',
      sections: ['Customizable'],
      pages: 'Variable'
    }
  ];

  const statusConfig = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: FileText },
    pending: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Clock },
    sent: { label: 'Sent', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle },
    viewed: { label: 'Viewed', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Eye }
  };

  const typeConfig = {
    investor: { label: 'Investor Report', icon: Users, color: 'text-blue-600' },
    quarterly: { label: 'Quarterly Update', icon: Calendar, color: 'text-purple-600' },
    annual: { label: 'Annual Report', icon: TrendingUp, color: 'text-green-600' },
    performance: { label: 'Performance Report', icon: BarChart3, color: 'text-orange-600' },
    compliance: { label: 'Compliance Report', icon: CheckCircle, color: 'text-red-600' },
    custom: { label: 'Custom Report', icon: Settings, color: 'text-gray-600' }
  };

  const filteredReports = selectedType === 'all' 
    ? reports 
    : reports.filter(r => r.type === selectedType);

  // Report Generator View
  if (showGenerator) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <Button variant="ghost" onClick={() => setShowGenerator(false)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Generate New Report</h1>
          <p className="text-gray-600 mt-1">Select a template and configure your report</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-indigo-400">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="space-y-2 mb-4">
                      <p className="text-xs font-semibold text-gray-700">Sections included:</p>
                      <div className="flex flex-wrap gap-2">
                        {template.sections.map((section, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{template.pages}</span>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-2 border-indigo-300 bg-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Activity className="w-6 h-6 text-indigo-600 mt-1" />
              <div>
                <h3 className="font-bold text-indigo-900 mb-2">AI-Powered Report Generation</h3>
                <p className="text-sm text-indigo-800 mb-3">
                  Our AI engine automatically pulls data from your fund operations, formats charts and tables, 
                  and generates professional investor-ready reports in minutes.
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-indigo-900">Auto Data Pull</p>
                    <p className="text-indigo-700">From NAV engine, portfolio, and transactions</p>
                  </div>
                  <div>
                    <p className="font-semibold text-indigo-900">Branded Output</p>
                    <p className="text-indigo-700">Your logo, colors, and style</p>
                  </div>
                  <div>
                    <p className="font-semibold text-indigo-900">One-Click Send</p>
                    <p className="text-indigo-700">Direct to investor portal</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Reports List View
  return (
    <div className="p-8 space-y-6">
      <div>
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Investor Packs</h1>
            <p className="text-gray-600 mt-1">Institutional reporting and branded investor communications</p>
          </div>
          {(role === 'fund-manager' || role === 'fund-accountant' || role === 'cfo') && (
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowGenerator(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{reports.length}</p>
              </div>
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reports Sent</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {reports.filter(r => r.status === 'sent').length}
                </p>
              </div>
              <Send className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Recipients</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {reports.filter(r => r.status === 'sent').reduce((sum, r) => sum + r.recipients, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg View Rate</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">93%</p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ReportType | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Report Types</option>
              <option value="quarterly">Quarterly Updates</option>
              <option value="annual">Annual Reports</option>
              <option value="performance">Performance Reports</option>
              <option value="compliance">Compliance Reports</option>
              <option value="investor">Investor Reports</option>
              <option value="custom">Custom Reports</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReports.map((report) => {
          const status = statusConfig[report.status];
          const type = typeConfig[report.type];
          const StatusIcon = status.icon;
          const TypeIcon = type.icon;

          return (
            <Card key={report.id} className="hover:shadow-lg transition-all border-2 hover:border-indigo-400">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TypeIcon className={`w-6 h-6 ${type.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{report.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {status.label}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${type.color} bg-gray-100`}>
                          {type.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Fund</p>
                          <p className="text-sm font-medium text-gray-900">{report.fund}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Period</p>
                          <p className="text-sm font-medium text-gray-900">{report.period}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Pages</p>
                          <p className="text-sm font-medium text-gray-900">{report.pages} pages</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Generated</p>
                          <p className="text-sm font-medium text-gray-900">{report.generatedDate}</p>
                        </div>
                      </div>

                      {report.status === 'sent' && (
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">
                            Sent to {report.recipients} investors on {report.sentDate}
                          </span>
                          <span className="text-green-600 font-medium">
                            <Eye className="w-4 h-4 inline mr-1" />
                            {report.viewedBy} viewed ({Math.round((report.viewedBy! / report.recipients) * 100)}%)
                          </span>
                        </div>
                      )}

                      {report.status === 'pending' && (
                        <p className="text-sm text-yellow-700">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Pending review before sending to {report.recipients} investors
                        </p>
                      )}

                      {report.status === 'draft' && (
                        <p className="text-sm text-gray-600">
                          <FileText className="w-4 h-4 inline mr-1" />
                          Draft - not yet sent
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    {report.status === 'draft' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Send className="w-4 h-4 mr-1" />
                        Send
                      </Button>
                    )}
                    {report.status === 'pending' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features Highlight */}
      <Card className="border-2 border-blue-300 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-bold text-blue-900 mb-4">Report Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <p className="font-semibold text-blue-900">Auto-Generated Content</p>
              </div>
              <p className="text-sm text-blue-800">
                Performance metrics, portfolio summaries, and charts automatically populated from live data
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <p className="font-semibold text-blue-900">Fully Customizable</p>
              </div>
              <p className="text-sm text-blue-800">
                Apply your branding, select sections, add commentary, and customize layouts
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-5 h-5 text-blue-600" />
                <p className="font-semibold text-blue-900">Direct Distribution</p>
              </div>
              <p className="text-sm text-blue-800">
                Send directly to investor portals with read tracking and engagement analytics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

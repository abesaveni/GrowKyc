import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  BarChart3,
  Users,
  Clock,
  FileText,
  Eye,
  Flag,
  Zap,
  XCircle,
  Calendar
} from 'lucide-react';
import { WorkpaperLayout } from './WorkpaperLayout';

interface RiskDashboardProps {
  onNavigate?: (page: string) => void;
}

interface JobRisk {
  id: string;
  clientName: string;
  entityType: string;
  preparer: string;
  reviewer: string;
  dueDate: string;
  riskScore: number;
  riskLevel: 'high' | 'medium' | 'low';
  qualityScore: number;
  completeness: number;
  status: 'at-risk' | 'on-track' | 'overdue' | 'complete';
  issues: number;
  daysOverdue?: number;
}

interface StaffPerformance {
  name: string;
  role: string;
  activeJobs: number;
  avgQuality: number;
  errorRate: number;
  avgTime: string;
  trend: 'up' | 'down' | 'neutral';
}

interface ComplianceIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  job: string;
  description: string;
  assignee: string;
  daysOpen: number;
}

export function RiskDashboard({ onNavigate }: RiskDashboardProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const jobs: JobRisk[] = [
    {
      id: 'job-001',
      clientName: 'ABC Manufacturing Pty Ltd',
      entityType: 'Company',
      preparer: 'Sarah Chen',
      reviewer: 'Michael Thompson',
      dueDate: '2024-02-28',
      riskScore: 72,
      riskLevel: 'high',
      qualityScore: 68,
      completeness: 85,
      status: 'at-risk',
      issues: 5
    },
    {
      id: 'job-002',
      clientName: 'Tech Solutions Group',
      entityType: 'Company',
      preparer: 'David Kumar',
      reviewer: 'Emma Watson',
      dueDate: '2024-02-20',
      riskScore: 45,
      riskLevel: 'medium',
      qualityScore: 82,
      completeness: 78,
      status: 'on-track',
      issues: 2
    },
    {
      id: 'job-003',
      clientName: 'Smith Family Trust',
      entityType: 'Trust',
      preparer: 'Lisa Anderson',
      reviewer: 'James Wilson',
      dueDate: '2024-02-10',
      riskScore: 88,
      riskLevel: 'high',
      qualityScore: 55,
      completeness: 92,
      status: 'overdue',
      issues: 8,
      daysOverdue: 4
    },
    {
      id: 'job-004',
      clientName: 'Green Energy Partners',
      entityType: 'Partnership',
      preparer: 'Tom Martinez',
      reviewer: 'Rachel Green',
      dueDate: '2024-03-05',
      riskScore: 28,
      riskLevel: 'low',
      qualityScore: 94,
      completeness: 95,
      status: 'on-track',
      issues: 1
    },
    {
      id: 'job-005',
      clientName: 'Retail Holdings Ltd',
      entityType: 'Company',
      preparer: 'Amy Foster',
      reviewer: 'Peter Brown',
      dueDate: '2024-02-15',
      riskScore: 65,
      riskLevel: 'medium',
      qualityScore: 72,
      completeness: 88,
      status: 'at-risk',
      issues: 4
    },
    {
      id: 'job-006',
      clientName: 'Johnson Super Fund',
      entityType: 'SMSF',
      preparer: 'Chris Taylor',
      reviewer: 'Sophie Lee',
      dueDate: '2024-02-25',
      riskScore: 18,
      riskLevel: 'low',
      qualityScore: 96,
      completeness: 98,
      status: 'on-track',
      issues: 0
    }
  ];

  const staffPerformance: StaffPerformance[] = [
    {
      name: 'Sarah Chen',
      role: 'Senior Accountant',
      activeJobs: 8,
      avgQuality: 85,
      errorRate: 2.1,
      avgTime: '4.2h',
      trend: 'up'
    },
    {
      name: 'David Kumar',
      role: 'Accountant',
      activeJobs: 6,
      avgQuality: 92,
      errorRate: 1.3,
      avgTime: '3.8h',
      trend: 'up'
    },
    {
      name: 'Lisa Anderson',
      role: 'Senior Accountant',
      activeJobs: 7,
      avgQuality: 78,
      errorRate: 4.2,
      avgTime: '5.1h',
      trend: 'down'
    },
    {
      name: 'Tom Martinez',
      role: 'Graduate',
      activeJobs: 4,
      avgQuality: 88,
      errorRate: 2.8,
      avgTime: '4.5h',
      trend: 'neutral'
    }
  ];

  const complianceIssues: ComplianceIssue[] = [
    {
      id: 'issue-001',
      severity: 'critical',
      category: 'Division 7A',
      job: 'ABC Manufacturing',
      description: 'Director loan $47,500 overdrawn - deemed dividend risk',
      assignee: 'Michael Thompson',
      daysOpen: 3
    },
    {
      id: 'issue-002',
      severity: 'critical',
      category: 'Superannuation',
      job: 'Smith Family Trust',
      description: 'Unpaid super $15,600 - SGC risk',
      assignee: 'James Wilson',
      daysOpen: 7
    },
    {
      id: 'issue-003',
      severity: 'high',
      category: 'GST',
      job: 'ABC Manufacturing',
      description: 'Large GST variance (-225%) requires reconciliation',
      assignee: 'Michael Thompson',
      daysOpen: 2
    },
    {
      id: 'issue-004',
      severity: 'high',
      category: 'Documentation',
      job: 'Retail Holdings',
      description: 'Missing stocktake certificate',
      assignee: 'Peter Brown',
      daysOpen: 5
    },
    {
      id: 'issue-005',
      severity: 'medium',
      category: 'Depreciation',
      job: 'ABC Manufacturing',
      description: 'Depreciation under-recorded $1,200',
      assignee: 'Sarah Chen',
      daysOpen: 1
    }
  ];

  const filteredJobs = selectedFilter === 'all'
    ? jobs
    : jobs.filter(job => job.riskLevel === selectedFilter);

  const practiceStats = {
    totalJobs: jobs.length,
    highRisk: jobs.filter(j => j.riskLevel === 'high').length,
    mediumRisk: jobs.filter(j => j.riskLevel === 'medium').length,
    lowRisk: jobs.filter(j => j.riskLevel === 'low').length,
    overdue: jobs.filter(j => j.status === 'overdue').length,
    atRisk: jobs.filter(j => j.status === 'at-risk').length,
    avgQuality: Math.round(jobs.reduce((sum, j) => sum + j.qualityScore, 0) / jobs.length),
    totalIssues: complianceIssues.length,
    criticalIssues: complianceIssues.filter(i => i.severity === 'critical').length
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">HIGH</span>;
      case 'medium':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">MEDIUM</span>;
      case 'low':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">LOW</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'overdue':
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          OVERDUE
        </span>;
      case 'at-risk':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          AT RISK
        </span>;
      case 'on-track':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          ON TRACK
        </span>;
      case 'complete':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          COMPLETE
        </span>;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-semibold rounded">CRITICAL</span>;
      case 'high':
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">HIGH</span>;
      case 'medium':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded">MEDIUM</span>;
      case 'low':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">LOW</span>;
      default:
        return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <WorkpaperLayout currentPage="risk-dashboard" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-600" />
              Risk & Quality Control Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">Real-time monitoring • Staff analytics • Compliance tracking • Practice intelligence</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Flag className="w-4 h-4 mr-2" />
              Critical Alerts
            </Button>
          </div>
        </div>

        {/* Practice Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Total Jobs</div>
            <div className="text-2xl font-bold text-gray-900 font-mono">{practiceStats.totalJobs}</div>
          </div>
          <div className="bg-white border border-red-200 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">High Risk</div>
            <div className="text-2xl font-bold text-red-600 font-mono">{practiceStats.highRisk}</div>
          </div>
          <div className="bg-white border border-amber-200 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Medium Risk</div>
            <div className="text-2xl font-bold text-amber-600 font-mono">{practiceStats.mediumRisk}</div>
          </div>
          <div className="bg-white border border-green-200 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Low Risk</div>
            <div className="text-2xl font-bold text-green-600 font-mono">{practiceStats.lowRisk}</div>
          </div>
          <div className="bg-white border border-red-200 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Overdue</div>
            <div className="text-2xl font-bold text-red-600 font-mono">{practiceStats.overdue}</div>
          </div>
          <div className="bg-white border border-amber-200 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">At Risk</div>
            <div className="text-2xl font-bold text-amber-600 font-mono">{practiceStats.atRisk}</div>
          </div>
          <div className="bg-white border border-gray-300 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Avg Quality</div>
            <div className="text-2xl font-bold text-blue-600 font-mono">{practiceStats.avgQuality}%</div>
          </div>
          <div className="bg-white border border-red-200 rounded p-3">
            <div className="text-xs text-gray-600 mb-1">Critical Issues</div>
            <div className="text-2xl font-bold text-red-600 font-mono">{practiceStats.criticalIssues}</div>
          </div>
        </div>

        {/* Critical Alerts */}
        {practiceStats.criticalIssues > 0 && (
          <div className="bg-red-50 border border-red-300 rounded px-4 py-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Critical Issues Detected</h3>
                <p className="text-sm text-red-800">
                  {practiceStats.criticalIssues} critical compliance issues requiring immediate attention • {practiceStats.overdue} overdue jobs • {practiceStats.atRisk} jobs at risk
                </p>
              </div>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                View All
              </Button>
            </div>
          </div>
        )}

        {/* Risk Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Risk Level:</span>
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded text-sm font-semibold ${
              selectedFilter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setSelectedFilter('high')}
            className={`px-3 py-1.5 rounded text-sm font-semibold ${
              selectedFilter === 'high'
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            High Risk ({practiceStats.highRisk})
          </button>
          <button
            onClick={() => setSelectedFilter('medium')}
            className={`px-3 py-1.5 rounded text-sm font-semibold ${
              selectedFilter === 'medium'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            Medium Risk ({practiceStats.mediumRisk})
          </button>
          <button
            onClick={() => setSelectedFilter('low')}
            className={`px-3 py-1.5 rounded text-sm font-semibold ${
              selectedFilter === 'low'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            Low Risk ({practiceStats.lowRisk})
          </button>
        </div>

        {/* Jobs Risk Table */}
        <div className="border border-gray-300 rounded bg-white overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
            <h3 className="font-semibold text-gray-900">Job Risk Analysis</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Client Name</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-24">Type</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Preparer</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Reviewer</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-24">Due Date</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-28">Risk Score</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-28">Quality</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-28">Complete</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-32">Status</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-20">Issues</th>
                  <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-blue-50">
                    <td className="border border-gray-300 px-3 py-2 text-gray-900 font-medium">
                      {job.clientName}
                      {job.daysOverdue && (
                        <div className="text-xs text-red-600 font-semibold mt-0.5">
                          {job.daysOverdue} days overdue
                        </div>
                      )}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-700 text-xs">
                      {job.entityType}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-700">
                      {job.preparer}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-700">
                      {job.reviewer}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center text-gray-700 text-xs font-mono">
                      {job.dueDate}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              job.riskScore >= 70
                                ? 'bg-red-600'
                                : job.riskScore >= 40
                                ? 'bg-amber-600'
                                : 'bg-green-600'
                            }`}
                            style={{ width: `${job.riskScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-mono font-semibold text-gray-700 w-8">
                          {job.riskScore}
                        </span>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <div className="font-mono font-semibold text-gray-900">{job.qualityScore}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            job.qualityScore >= 80
                              ? 'bg-green-600'
                              : job.qualityScore >= 60
                              ? 'bg-amber-600'
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${job.qualityScore}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <div className="font-mono font-semibold text-gray-900">{job.completeness}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${job.completeness}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <span className={`font-mono font-semibold ${job.issues > 3 ? 'text-red-600' : 'text-gray-900'}`}>
                        {job.issues}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded font-semibold">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Staff Performance */}
          <div className="border border-gray-300 rounded bg-white overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
              <h3 className="font-semibold text-gray-900">Staff Performance Analysis</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Name</th>
                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-16">Jobs</th>
                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-20">Quality</th>
                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-20">Errors</th>
                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-20">Avg Time</th>
                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-16">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {staffPerformance.map((staff, idx) => (
                    <tr key={idx} className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-3 py-2">
                        <div className="font-medium text-gray-900">{staff.name}</div>
                        <div className="text-xs text-gray-600">{staff.role}</div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-mono font-semibold text-gray-900">
                        {staff.activeJobs}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <div className={`font-mono font-semibold ${staff.avgQuality >= 85 ? 'text-green-600' : staff.avgQuality >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                          {staff.avgQuality}%
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <div className={`font-mono font-semibold ${staff.errorRate <= 2 ? 'text-green-600' : staff.errorRate <= 3 ? 'text-amber-600' : 'text-red-600'}`}>
                          {staff.errorRate}%
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center font-mono text-gray-900">
                        {staff.avgTime}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        {getTrendIcon(staff.trend)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compliance Issues */}
          <div className="border border-gray-300 rounded bg-white overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-300 px-4 py-2">
              <h3 className="font-semibold text-gray-900">Outstanding Compliance Issues</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-24">Severity</th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">Description</th>
                    <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 w-32">Assignee</th>
                    <th className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-700 w-20">Days</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {getSeverityBadge(issue.severity)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <div className="text-gray-900 font-medium">{issue.description}</div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          {issue.category} • {issue.job}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-gray-700">
                        {issue.assignee}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <span className={`font-mono font-semibold ${issue.daysOpen > 5 ? 'text-red-600' : issue.daysOpen > 2 ? 'text-amber-600' : 'text-gray-900'}`}>
                          {issue.daysOpen}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </WorkpaperLayout>
  );
}

import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Shield,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  TrendingUp,
  BookOpen,
  Settings,
  Lock,
  Database,
  UserCheck,
  Bell,
  Activity,
  ChevronRight,
  Download,
  Upload,
  Calendar,
  Search
} from 'lucide-react';

export function ProgramManagement() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const programAreas = [
    {
      id: 'program',
      name: 'AML/CTF Program',
      icon: Shield,
      status: 'current',
      lastReview: '2024-01-15',
      nextReview: '2024-12-31',
      color: 'blue',
      items: [
        { name: 'Program Document', status: 'approved', version: 'v3.2', date: '2024-01-15' },
        { name: 'ML/TF Risk Assessment', status: 'current', version: 'v2.1', date: '2024-01-15' },
        { name: 'Risk Appetite Statement', status: 'approved', version: 'v1.5', date: '2024-01-15' },
        { name: 'Policies & Procedures', status: 'current', version: 'v3.2', date: '2024-01-15' },
        { name: 'Escalation Framework', status: 'current', version: 'v2.0', date: '2024-01-15' }
      ]
    },
    {
      id: 'risk-assessment',
      name: 'Risk Assessment',
      icon: TrendingUp,
      status: 'current',
      lastReview: '2024-01-15',
      nextReview: '2024-07-15',
      color: 'green',
      items: [
        { name: 'Service Risk Analysis', status: 'complete', score: 'Low', date: '2024-01-15' },
        { name: 'Client Type Risk Matrix', status: 'complete', score: 'Medium', date: '2024-01-15' },
        { name: 'Delivery Channel Assessment', status: 'complete', score: 'Low', date: '2024-01-15' },
        { name: 'Geographic Risk Review', status: 'complete', score: 'Low', date: '2024-01-15' },
        { name: 'Technology Risk Assessment', status: 'complete', score: 'Low', date: '2024-01-15' }
      ]
    },
    {
      id: 'reporting',
      name: 'Reporting Obligations',
      icon: FileText,
      status: 'compliant',
      lastReport: '2024-03-15',
      nextReport: '2025-03-31',
      color: 'purple',
      items: [
        { name: 'SMR Reporting', status: 'active', count: '0 lodged (2024)', date: '2024' },
        { name: 'TTR Reporting', status: 'not-applicable', count: 'No cash transactions', date: '2024' },
        { name: 'Annual Compliance Report', status: 'submitted', date: '2024-03-15', dueDate: '2024-03-31' },
        { name: 'AUSTRAC Enrolment', status: 'current', number: 'AE-123456', date: '2022-01-10' }
      ]
    },
    {
      id: 'personnel',
      name: 'Personnel & Training',
      icon: Users,
      status: 'current',
      lastTraining: '2024-02-01',
      nextTraining: '2024-08-01',
      color: 'orange',
      items: [
        { name: 'Compliance Officer PDD', status: 'complete', person: 'Emma Wilson', date: '2023-12-01' },
        { name: 'Staff Training (2024)', status: 'complete', completion: '100% (12/12 staff)', date: '2024-02-01' },
        { name: 'Criminal History Checks', status: 'current', count: '1 compliance officer', date: '2023-12-01' },
        { name: 'Fit & Proper Assessments', status: 'current', count: '12 staff', date: '2024-01-15' }
      ]
    },
    {
      id: 'governance',
      name: 'Governance & Oversight',
      icon: Settings,
      status: 'active',
      lastMeeting: '2024-02-10',
      nextMeeting: '2024-05-10',
      color: 'indigo',
      items: [
        { name: 'Board Approval', status: 'approved', date: '2024-01-15', approver: 'Board of Directors' },
        { name: 'Quarterly Review Meetings', status: 'scheduled', nextDate: '2024-05-10' },
        { name: 'Risk Appetite Oversight', status: 'active', lastReview: '2024-01-15' },
        { name: 'Resource Allocation', status: 'adequate', budget: 'Approved FY2024' }
      ]
    },
    {
      id: 'testing',
      name: 'Testing & Evaluation',
      icon: Eye,
      status: 'scheduled',
      lastTest: '2023-11-20',
      nextTest: '2024-11-20',
      color: 'teal',
      items: [
        { name: 'Effectiveness Testing', status: 'scheduled', date: '2023-11-20', nextDate: '2024-11-20' },
        { name: 'Independent Evaluation', status: 'scheduled', date: '2023-10-15', nextDate: '2025-10-15' },
        { name: 'CDD File Testing', status: 'complete', sample: '25 files', findings: '2 minor' },
        { name: 'Monitoring Process Review', status: 'complete', result: 'Effective', date: '2023-11-20' }
      ]
    },
    {
      id: 'controls',
      name: 'Operational Controls',
      icon: Lock,
      status: 'active',
      color: 'red',
      items: [
        { name: 'Delivery Channel Controls', status: 'active', level: 'Enhanced for remote' },
        { name: 'High-Risk Client Management', status: 'active', count: '3 high-risk clients' },
        { name: 'Offboarding Procedures', status: 'documented', version: 'v1.3' },
        { name: 'Tipping-off Controls', status: 'active', access: 'Restricted' },
        { name: 'Technology & Data Security', status: 'compliant', audit: 'Last: 2024-01-10' }
      ]
    },
    {
      id: 'records',
      name: 'Record Keeping',
      icon: Database,
      status: 'compliant',
      retention: '7 years',
      color: 'gray',
      items: [
        { name: 'CDD Records', status: 'archived', count: '342 client files', retention: '7 years' },
        { name: 'Screening Records', status: 'archived', count: '856 screening logs', retention: '7 years' },
        { name: 'Program Versions', status: 'archived', count: '8 versions', retention: '7 years' },
        { name: 'Training Records', status: 'current', count: '48 training sessions', retention: '7 years' }
      ]
    }
  ];

  const recentActivity = [
    { date: '2024-02-19', action: 'Daily sanctions screening completed', status: 'success', user: 'System' },
    { date: '2024-02-18', action: 'New client onboarded - Sarah Mitchell', status: 'success', user: 'Emma Wilson' },
    { date: '2024-02-17', action: 'Monthly CDD review completed', status: 'success', user: 'Compliance Team' },
    { date: '2024-02-15', action: 'Quarterly board meeting held', status: 'success', user: 'Board' },
    { date: '2024-02-10', action: 'Risk appetite statement reviewed', status: 'success', user: 'Emma Wilson' },
    { date: '2024-02-01', action: 'Staff training session completed', status: 'success', user: 'Training Team' }
  ];

  const upcomingTasks = [
    { dueDate: '2024-03-31', task: 'Annual Compliance Report due', priority: 'high', assignee: 'Emma Wilson' },
    { dueDate: '2024-05-10', task: 'Quarterly governance meeting', priority: 'medium', assignee: 'Board' },
    { dueDate: '2024-05-15', task: 'Quarterly sanctions re-screening', priority: 'medium', assignee: 'Compliance System' },
    { dueDate: '2024-07-15', task: 'Risk assessment review due', priority: 'medium', assignee: 'Emma Wilson' },
    { dueDate: '2024-08-01', task: 'Staff refresher training due', priority: 'medium', assignee: 'Training Team' },
    { dueDate: '2024-11-20', task: 'Annual effectiveness testing', priority: 'high', assignee: 'Internal Audit' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">AML/CTF Program Management</h1>
              <p className="text-xl text-indigo-100">Complete Compliance Framework Beyond KYC</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
              <Download className="w-5 h-5 mr-2" />
              Export Program
            </Button>
            <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
              <Upload className="w-5 h-5 mr-2" />
              Update Program
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Program Status</h3>
              <CheckCircle className="w-5 h-5 text-green-300" />
            </div>
            <p className="text-2xl font-bold">Current</p>
            <p className="text-xs text-indigo-200 mt-1">v3.2 - Approved</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Risk Rating</h3>
              <TrendingUp className="w-5 h-5 text-green-300" />
            </div>
            <p className="text-2xl font-bold">LOW</p>
            <p className="text-xs text-indigo-200 mt-1">Last review: Jan 2024</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">ACR Status</h3>
              <FileText className="w-5 h-5 text-green-300" />
            </div>
            <p className="text-2xl font-bold">Submitted</p>
            <p className="text-xs text-indigo-200 mt-1">15 Mar 2024</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Staff Training</h3>
              <Users className="w-5 h-5 text-green-300" />
            </div>
            <p className="text-2xl font-bold">100%</p>
            <p className="text-xs text-indigo-200 mt-1">12/12 staff trained</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">SMRs (2024)</h3>
              <AlertTriangle className="w-5 h-5 text-yellow-300" />
            </div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-indigo-200 mt-1">No suspicions YTD</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Program Areas */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Program Components</h2>
            <div className="space-y-3">
              {programAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <div
                    key={area.id}
                    className={`p-5 rounded-lg border-2 border-${area.color}-200 bg-${area.color}-50 hover:shadow-lg transition-all cursor-pointer`}
                    onClick={() => setActiveSection(area.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-${area.color}-600 rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{area.name}</h3>
                          <p className="text-sm text-gray-600">
                            {area.lastReview && `Last review: ${area.lastReview}`}
                            {area.lastTraining && `Last training: ${area.lastTraining}`}
                            {area.lastTest && `Last test: ${area.lastTest}`}
                            {area.lastReport && `Last report: ${area.lastReport}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 bg-${area.color}-600 text-white text-xs font-bold rounded-full uppercase`}>
                          {area.status}
                        </span>
                        <ChevronRight className={`w-6 h-6 text-${area.color}-600`} />
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {area.items.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Upcoming Tasks */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-900">Upcoming Tasks</h3>
            </div>
            <div className="space-y-3">
              {upcomingTasks.slice(0, 5).map((task, idx) => (
                <div key={idx} className={`p-3 rounded-lg border-l-4 ${
                  task.priority === 'high' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
                }`}>
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-bold text-gray-900">{task.task}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      task.priority === 'high' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'
                    }`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Due: {task.dueDate}</p>
                  <p className="text-xs text-gray-600">Assigned: {task.assignee}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.user} • {activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                View Program Document
              </Button>
              <Button className="w-full" variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Training Records
              </Button>
              <Button className="w-full" variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Review Meeting
              </Button>
              <Button className="w-full" variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Generate Compliance Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">AUSTRAC Compliance Checklist</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { area: 'Program Documentation', status: 'complete', items: '5/5' },
            { area: 'Risk Assessment', status: 'complete', items: '5/5' },
            { area: 'Ongoing CDD', status: 'active', items: 'Continuous' },
            { area: 'SMR Procedures', status: 'documented', items: '1/1' },
            { area: 'TTR Procedures', status: 'documented', items: 'N/A' },
            { area: 'ACR Reporting', status: 'submitted', items: '2024 Done' },
            { area: 'Personnel PDD', status: 'complete', items: '12/12' },
            { area: 'Training', status: 'complete', items: '100%' },
            { area: 'Governance', status: 'active', items: 'Ongoing' },
            { area: 'Effectiveness Testing', status: 'scheduled', items: 'Nov 2024' },
            { area: 'Independent Evaluation', status: 'scheduled', items: 'Oct 2025' },
            { area: 'Record Keeping', status: 'compliant', items: '7 years' },
            { area: 'AUSTRAC Enrolment', status: 'current', items: 'Active' },
            { area: 'Delivery Controls', status: 'active', items: 'Enhanced' },
            { area: 'High-Risk Management', status: 'active', items: '3 clients' },
            { area: 'Offboarding Process', status: 'documented', items: 'v1.3' },
            { area: 'Tipping-off Controls', status: 'active', items: 'Restricted' },
            { area: 'Technology Controls', status: 'compliant', items: 'Audited' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900 text-sm">{item.area}</h4>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                item.status === 'complete' || item.status === 'compliant' || item.status === 'submitted' || item.status === 'current'
                  ? 'bg-green-100 text-green-700'
                  : item.status === 'active'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {item.status.toUpperCase()}
              </span>
              <p className="text-xs text-gray-600 mt-2">{item.items}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Additional Views for Receivership OS
import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  FileText,
  Plus,
  Download,
  Upload,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building2,
  Mail,
  Phone,
  Calendar,
  Package,
  History,
  Eye,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';

// Trading View
export function TradingView({ role }: any) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Trading Operations</h1>
          <p className="text-slate-300 mt-1">Monitor trading performance and cashflow for trading entities</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export P&L
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Trading Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <p className="text-sm text-slate-300">Revenue (MTD)</p>
          </div>
          <p className="text-3xl font-bold text-slate-100">$185K</p>
          <p className="text-xs text-green-400 mt-1">+12% vs forecast</p>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-slate-300">Operating Costs</p>
          </div>
          <p className="text-3xl font-bold text-slate-100">$140K</p>
          <p className="text-xs text-slate-400 mt-1">Staff, rent, utilities</p>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <p className="text-sm text-slate-300">Net P&L (MTD)</p>
          </div>
          <p className="text-3xl font-bold text-green-400">+$45K</p>
          <p className="text-xs text-slate-400 mt-1">24.3% margin</p>
        </div>

        <div className="bg-white border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-400" />
            <p className="text-sm text-slate-300">Burn Rate</p>
          </div>
          <p className="text-3xl font-bold text-slate-100">$85K/wk</p>
          <p className="text-xs text-slate-400 mt-1">13-week runway</p>
        </div>
      </div>

      {/* P&L Statement */}
      <div className="bg-white border border-white/10 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <h3 className="font-semibold text-slate-100">Profit & Loss Statement</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Revenue */}
            <div>
              <p className="font-semibold text-slate-100 mb-2">Revenue</p>
              <div className="space-y-2 pl-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">Product Sales</p>
                  <p className="text-sm font-semibold text-slate-100">$145,000</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">Service Revenue</p>
                  <p className="text-sm font-semibold text-slate-100">$40,000</p>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-2">
                  <p className="font-medium text-slate-100">Total Revenue</p>
                  <p className="font-bold text-slate-100">$185,000</p>
                </div>
              </div>
            </div>

            {/* Operating Expenses */}
            <div className="border-t border-white/10 pt-4">
              <p className="font-semibold text-slate-100 mb-2">Operating Expenses</p>
              <div className="space-y-2 pl-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">Staff Costs</p>
                  <p className="text-sm font-semibold text-slate-100">$85,000</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">Rent & Utilities</p>
                  <p className="text-sm font-semibold text-slate-100">$28,000</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">Marketing</p>
                  <p className="text-sm font-semibold text-slate-100">$15,000</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">Other Expenses</p>
                  <p className="text-sm font-semibold text-slate-100">$12,000</p>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-2">
                  <p className="font-medium text-slate-100">Total Expenses</p>
                  <p className="font-bold text-slate-100">$140,000</p>
                </div>
              </div>
            </div>

            {/* Net Profit */}
            <div className="border-t-2 border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-slate-100">Net Profit</p>
                <p className="text-lg font-bold text-green-400">$45,000</p>
              </div>
              <p className="text-xs text-slate-400 mt-1">24.3% net margin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stakeholders View
export function StakeholdersView({ role }: any) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Stakeholder Management</h1>
          <p className="text-slate-300 mt-1">Manage creditors, directors, employees, and other stakeholders</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import List
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Stakeholder
          </Button>
        </div>
      </div>

      {/* Stakeholder Categories */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { category: 'Secured Creditors', count: 3, amount: '$10.5M', icon: Building2, color: 'green' },
          { category: 'Unsecured Creditors', count: 127, amount: '$2.8M', icon: Users, color: 'blue' },
          { category: 'Directors', count: 4, amount: '-', icon: Users, color: 'purple' },
          { category: 'Employees', count: 45, amount: '$420K', icon: Users, color: 'orange' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 text-${item.color}-600`} />
                <p className="text-sm text-slate-300">{item.category}</p>
              </div>
              <p className="text-2xl font-bold text-slate-100">{item.count}</p>
              <p className="text-xs text-slate-400 mt-1">{item.amount}</p>
            </div>
          );
        })}
      </div>

      {/* Stakeholder List */}
      <div className="bg-white border border-white/10 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <h3 className="font-semibold text-slate-100">Stakeholder Directory</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search stakeholders..."
                className="pl-10 pr-4 py-2 border border-white/10 rounded-lg text-sm"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Name/Entity</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Claim Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {[
              { name: 'NAB Bank', type: 'Secured Creditor', contact: 'legal@nab.com.au', amount: '$8.0M', status: 'active', ranking: 'First' },
              { name: 'Westpac', type: 'Secured Creditor', contact: 'recoveries@westpac.com.au', amount: '$2.5M', status: 'active', ranking: 'Second' },
              { name: 'ATO', type: 'Priority Creditor', contact: 'insolvency@ato.gov.au', amount: '$850K', status: 'lodged', ranking: 'Priority' },
              { name: 'Trade Supplies Pty Ltd', type: 'Unsecured Creditor', contact: 'accounts@tradesupplies.com', amount: '$125K', status: 'lodged', ranking: 'Unsecured' },
              { name: 'John Smith', type: 'Director', contact: 'john.smith@email.com', amount: '-', status: 'cooperating', ranking: '-' }
            ].map((stakeholder, idx) => (
              <tr key={idx} className="hover:bg-white/5">
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-100">{stakeholder.name}</p>
                  <p className="text-xs text-slate-400">{stakeholder.ranking}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-100">{stakeholder.type}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-300">{stakeholder.contact}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-100">{stakeholder.amount}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    stakeholder.status === 'active' ? 'bg-green-500/15 text-green-300' :
                    stakeholder.status === 'lodged' ? 'bg-blue-500/15 text-blue-300' :
                    'bg-white/5 text-slate-100'
                  }`}>
                    {stakeholder.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-slate-300">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Workflow View
export function WorkflowView({ role }: any) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Workflow & Tasks</h1>
          <p className="text-slate-300 mt-1">Manage deadlines, compliance tasks, and team workflows</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Task Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Overdue', count: 3, color: 'red', icon: AlertTriangle },
          { label: 'Due Today', count: 5, color: 'orange', icon: Clock },
          { label: 'This Week', count: 12, color: 'blue', icon: Calendar },
          { label: 'Completed', count: 47, color: 'green', icon: CheckCircle }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                <p className="text-sm text-slate-300">{stat.label}</p>
              </div>
              <p className="text-3xl font-bold text-slate-100">{stat.count}</p>
            </div>
          );
        })}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {[
          { task: 'ASIC 507 Report - Acme Trading', matter: 'MAT-2024-001', due: '2 days', priority: 'high', status: 'pending' },
          { task: 'Asset sale settlement - Brisbane Retail', matter: 'MAT-2024-002', due: 'Tomorrow', priority: 'high', status: 'in-progress' },
          { task: 'Trust reconciliation - Coastal Dev', matter: 'MAT-2024-003', due: '3 days', priority: 'medium', status: 'pending' },
          { task: 'Creditor meeting notice', matter: 'MAT-2024-001', due: '5 days', priority: 'medium', status: 'pending' },
          { task: 'Quarterly report to secured creditor', matter: 'MAT-2024-002', due: '1 week', priority: 'low', status: 'pending' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-white/10 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-slate-100">{item.task}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.priority === 'high' ? 'bg-red-500/15 text-red-300' :
                    item.priority === 'medium' ? 'bg-orange-500/15 text-orange-300' :
                    'bg-blue-500/15 text-blue-300'
                  }`}>
                    {item.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'in-progress' ? 'bg-purple-500/15 text-purple-300' :
                    'bg-white/5 text-slate-100'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{item.matter} • Due in {item.due}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm">
                  Complete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Documents View
export function DocumentsView({ role }: any) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Document Library</h1>
          <p className="text-slate-300 mt-1">All documents across all matters</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Document Categories */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { category: 'Appointment Docs', count: 24, icon: FileText },
          { category: 'Reports', count: 18, icon: FileText },
          { category: 'Correspondence', count: 156, icon: Mail },
          { category: 'Court Documents', count: 12, icon: FileText }
        ].map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className="bg-white border border-white/10 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
              <Icon className="w-6 h-6 text-slate-300 mb-2" />
              <p className="font-semibold text-slate-100">{cat.category}</p>
              <p className="text-sm text-slate-400 mt-1">{cat.count} documents</p>
            </div>
          );
        })}
      </div>

      {/* Recent Documents */}
      <div className="bg-white border border-white/10 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <h3 className="font-semibold text-slate-100">Recent Documents</h3>
        </div>
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Document</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Matter</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Uploaded</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {[
              { name: 'ASIC 507 Report - Q1 2024.pdf', matter: 'Acme Trading', type: 'Report', date: '2 hours ago' },
              { name: 'Asset Sale Agreement - Brisbane.docx', matter: 'Brisbane Retail', type: 'Contract', date: '5 hours ago' },
              { name: 'Trust Account Statement - Feb.pdf', matter: 'Coastal Dev', type: 'Financial', date: '1 day ago' },
              { name: 'Creditor Meeting Minutes.pdf', matter: 'Acme Trading', type: 'Minutes', date: '2 days ago' }
            ].map((doc, idx) => (
              <tr key={idx} className="hover:bg-white/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <p className="text-sm font-medium text-slate-100">{doc.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-300">{doc.matter}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-500/15 text-blue-300 rounded-full text-xs font-medium">
                    {doc.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-400">{doc.date}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Audit Trail View
export function AuditTrailView({ role }: any) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Audit Trail</h1>
          <p className="text-slate-300 mt-1">Complete activity log and compliance tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Log
          </Button>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Events', count: '1,247', icon: Activity },
          { label: 'Today', count: '34', icon: Clock },
          { label: 'Users', count: '8', icon: Users },
          { label: 'Matters', count: '12', icon: FileText }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-slate-300" />
                <p className="text-sm text-slate-300">{stat.label}</p>
              </div>
              <p className="text-3xl font-bold text-slate-100">{stat.count}</p>
            </div>
          );
        })}
      </div>

      {/* Audit Log */}
      <div className="bg-white border border-white/10 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <h3 className="font-semibold text-slate-100">Activity Log</h3>
        </div>
        <div className="divide-y divide-white/10">
          {[
            { user: 'Michael Thompson', action: 'Approved asset sale', matter: 'Acme Trading', time: '10 mins ago', type: 'approval' },
            { user: 'Sarah Chen', action: 'Uploaded ASIC report', matter: 'Brisbane Retail', time: '45 mins ago', type: 'document' },
            { user: 'Trust System', action: 'Reconciled bank account', matter: 'Coastal Dev', time: '2 hours ago', type: 'system' },
            { user: 'John Davis', action: 'Updated restructure proposal', matter: 'Metro Holdings', time: '4 hours ago', type: 'edit' },
            { user: 'Emily Wilson', action: 'Created new matter', matter: 'Sunshine Properties', time: '6 hours ago', type: 'create' },
            { user: 'Michael Thompson', action: 'Processed payment', matter: 'Acme Trading', time: '1 day ago', type: 'payment' },
            { user: 'Sarah Chen', action: 'Sent creditor notice', matter: 'Brisbane Retail', time: '1 day ago', type: 'communication' },
            { user: 'System', action: 'Generated monthly report', matter: 'All Matters', time: '2 days ago', type: 'system' }
          ].map((log, idx) => (
            <div key={idx} className="p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  log.type === 'approval' ? 'bg-green-500/15' :
                  log.type === 'document' ? 'bg-blue-500/15' :
                  log.type === 'system' ? 'bg-white/5' :
                  log.type === 'payment' ? 'bg-purple-500/15' :
                  log.type === 'communication' ? 'bg-orange-500/15' :
                  'bg-indigo-500/15'
                }`}>
                  <History className={`w-5 h-5 ${
                    log.type === 'approval' ? 'text-green-400' :
                    log.type === 'document' ? 'text-blue-400' :
                    log.type === 'system' ? 'text-slate-300' :
                    log.type === 'payment' ? 'text-purple-400' :
                    log.type === 'communication' ? 'text-orange-400' :
                    'text-indigo-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-slate-100">
                      <span className="text-indigo-400">{log.user}</span> {log.action}
                    </p>
                    <p className="text-xs text-slate-400">{log.time}</p>
                  </div>
                  <p className="text-sm text-slate-300">{log.matter}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    log.type === 'approval' ? 'bg-green-500/15 text-green-300' :
                    log.type === 'document' ? 'bg-blue-500/15 text-blue-300' :
                    log.type === 'system' ? 'bg-white/5 text-slate-100' :
                    log.type === 'payment' ? 'bg-purple-500/15 text-purple-300' :
                    log.type === 'communication' ? 'bg-orange-500/15 text-orange-300' :
                    'bg-indigo-500/15 text-indigo-300'
                  }`}>
                    {log.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

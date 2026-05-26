import React from 'react';
import {
  Plus,
  Eye,
  Download,
  Shield,
  Lock,
  CheckCircle,
  Building2,
  UserCheck
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../../lib/toast';

export const renderInvestors = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">Investor Registry</h2>
      <Button onClick={() => toast.success('Add new investor')}>
        <Plus className="w-4 h-4 mr-2" />
        Add Investor
      </Button>
    </div>

    {/* Investor Overview */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-l-4 border-purple-600">
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-1">Total Investors</p>
          <p className="text-3xl font-bold text-gray-900">18</p>
          <p className="text-xs text-gray-500 mt-1">Across 3 funds</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-green-600">
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-1">AML Current</p>
          <p className="text-3xl font-bold text-green-900">16</p>
          <p className="text-xs text-green-600 mt-1">88.9% compliant</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-amber-600">
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-1">Review Required</p>
          <p className="text-3xl font-bold text-amber-900">2</p>
          <p className="text-xs text-amber-600 mt-1">Due this month</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-blue-600">
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 mb-1">Total Units</p>
          <p className="text-3xl font-bold text-blue-900">152,000</p>
          <p className="text-xs text-gray-500 mt-1">Across all funds</p>
        </CardContent>
      </Card>
    </div>

    {/* Investor List */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Investors</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => toast.success('Exporting investor list...')}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Investor Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Entity Type</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">AML Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total Commitment</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Capital Paid</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Total Units</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { name: 'Melbourne Super Fund', type: 'Superannuation Fund', aml: 'current', commitment: 5000000, paid: 3000000, units: 30000, status: 'active', lastReview: '2024-01-15' },
                { name: 'Chen Family Trust', type: 'Family Trust', aml: 'current', commitment: 2500000, paid: 1500000, units: 15000, status: 'active', lastReview: '2024-02-01' },
                { name: 'Wilson Investment Co', type: 'Company', aml: 'review', commitment: 3000000, paid: 1600000, units: 18000, status: 'active', lastReview: '2023-11-20' },
                { name: 'Private Wealth Partners', type: 'Company', aml: 'current', commitment: 4000000, paid: 2400000, units: 24000, status: 'active', lastReview: '2024-01-28' },
                { name: 'Anderson SMSF', type: 'SMSF', aml: 'current', commitment: 1500000, paid: 900000, units: 9000, status: 'active', lastReview: '2024-02-10' },
                { name: 'Property Holdings Ltd', type: 'Company', aml: 'review', commitment: 3500000, paid: 2100000, units: 21000, status: 'active', lastReview: '2023-12-05' }
              ].map((investor, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{investor.name}</p>
                      <p className="text-xs text-gray-600">Last review: {investor.lastReview}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{investor.type}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      investor.aml === 'current' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {investor.aml.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">${(investor.commitment / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-3 text-sm text-right text-green-900">${(investor.paid / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-3 text-sm text-right font-mono text-gray-900">{investor.units.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                      {investor.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => toast.info(`Viewing ${investor.name}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    {/* AML Review Queue */}
    <Card>
      <CardHeader>
        <CardTitle>AML Review Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { name: 'Wilson Investment Co', type: 'Company', lastReview: '2023-11-20', daysOverdue: 87, priority: 'high' },
            { name: 'Property Holdings Ltd', type: 'Company', lastReview: '2023-12-05', daysOverdue: 72, priority: 'high' }
          ].map((investor, idx) => (
            <div key={idx} className="p-4 border-l-4 border-red-500 bg-red-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-gray-900">{investor.name}</p>
                    <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded">
                      OVERDUE
                    </span>
                    <span className="px-2 py-1 bg-white border text-xs font-semibold rounded">
                      {investor.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-700">
                    <span>Last Review: {investor.lastReview}</span>
                    <span>•</span>
                    <span className="text-red-700 font-semibold">{investor.daysOverdue} days overdue</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" onClick={() => toast.success(`Starting AML review for ${investor.name}`)}>
                    Start Review
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info(`Sending reminder to ${investor.name}`)}>
                    Send Reminder
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export const renderReports = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
      <Button onClick={() => toast.success('Creating custom report...')}>
        <Plus className="w-4 h-4 mr-2" />
        Custom Report
      </Button>
    </div>

    {/* Report Categories */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Trust Reports */}
      <Card>
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-900">Trust Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {[
              { name: 'Trust Trial Balance', format: 'PDF/Excel' },
              { name: 'Client Balance Listing', format: 'PDF/Excel' },
              { name: 'Overdrawn Matter Report', format: 'PDF' },
              { name: 'Receipt Journal', format: 'PDF/Excel' },
              { name: 'Payment Journal', format: 'PDF/Excel' },
              { name: 'Reconciliation Statement', format: 'PDF' },
              { name: 'Trust Ledger Extract', format: 'Excel' },
              { name: 'External Examiner Pack', format: 'PDF Bundle' }
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => toast.success(`Generating ${report.name}...`)}>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{report.name}</p>
                  <p className="text-xs text-gray-600">{report.format}</p>
                </div>
                <Download className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fund Reports */}
      <Card>
        <CardHeader className="bg-purple-50">
          <CardTitle className="text-purple-900">Fund Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {[
              { name: 'Investor Registry Report', format: 'Excel' },
              { name: 'Capital Call Summary', format: 'PDF/Excel' },
              { name: 'Distribution Statement', format: 'PDF' },
              { name: 'NAV Calculation', format: 'Excel' },
              { name: 'Waterfall Analysis', format: 'Excel' },
              { name: 'Performance Summary', format: 'PDF' },
              { name: 'Management Fee Report', format: 'Excel' },
              { name: 'Unit Register', format: 'PDF/Excel' }
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => toast.success(`Generating ${report.name}...`)}>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{report.name}</p>
                  <p className="text-xs text-gray-600">{report.format}</p>
                </div>
                <Download className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Reports */}
      <Card>
        <CardHeader className="bg-green-50">
          <CardTitle className="text-green-900">Compliance Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {[
              { name: 'Audit Trail Report', format: 'Excel' },
              { name: 'AML Register', format: 'PDF/Excel' },
              { name: 'Breach Register', format: 'Excel' },
              { name: 'Period Lock History', format: 'PDF' },
              { name: 'User Activity Log', format: 'Excel' },
              { name: 'Approval Audit Trail', format: 'Excel' },
              { name: 'Bank Recon Summary', format: 'PDF/Excel' },
              { name: 'Regulatory Pack', format: 'PDF Bundle' }
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => toast.success(`Generating ${report.name}...`)}>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{report.name}</p>
                  <p className="text-xs text-gray-600">{report.format}</p>
                </div>
                <Download className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Analytics Dashboard */}
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-sm text-blue-700 mb-2">Trust Velocity</p>
            <p className="text-3xl font-bold text-blue-900">$2.4M</p>
            <p className="text-xs text-blue-600 mt-1">Avg daily turnover</p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg border-2 border-green-200">
            <p className="text-sm text-green-700 mb-2">Settlement Success Rate</p>
            <p className="text-3xl font-bold text-green-900">98.5%</p>
            <p className="text-xs text-green-600 mt-1">Last 90 days</p>
          </div>
          <div className="p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
            <p className="text-sm text-purple-700 mb-2">Fund Performance</p>
            <p className="text-3xl font-bold text-purple-900">+4.2%</p>
            <p className="text-xs text-purple-600 mt-1">Annualized return</p>
          </div>
          <div className="p-6 bg-amber-50 rounded-lg border-2 border-amber-200">
            <p className="text-sm text-amber-700 mb-2">Avg Recon Time</p>
            <p className="text-3xl font-bold text-amber-900">12 min</p>
            <p className="text-xs text-amber-600 mt-1">Per bank account</p>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Scheduled Reports */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Scheduled Reports</CardTitle>
          <Button size="sm" onClick={() => toast.success('Creating scheduled report...')}>
            <Plus className="w-4 h-4 mr-2" />
            New Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Report Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Frequency</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Recipients</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Next Run</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { name: 'Monthly Trust Trial Balance', frequency: 'Monthly', recipients: 'Partners (3)', nextRun: '2026-03-01', status: 'active' },
                { name: 'Weekly Capital Call Summary', frequency: 'Weekly', recipients: 'Fund Managers (2)', nextRun: '2026-02-17', status: 'active' },
                { name: 'Daily Reconciliation Report', frequency: 'Daily', recipients: 'Trust Operators (4)', nextRun: '2026-02-16', status: 'active' },
                { name: 'Quarterly Investor Statements', frequency: 'Quarterly', recipients: 'All Investors (18)', nextRun: '2026-04-01', status: 'active' }
              ].map((schedule, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{schedule.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{schedule.frequency}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{schedule.recipients}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{schedule.nextRun}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                      {schedule.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => toast.success(`Running ${schedule.name} now...`)}>
                        Run Now
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.info(`Editing ${schedule.name}`)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export const renderSettings = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>

    {/* Entity Management */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Entity Management</CardTitle>
          <Button size="sm" onClick={() => toast.success('Adding new entity...')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Entity
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { name: 'Smith & Associates Legal Pty Ltd', abn: '12 345 678 901', type: 'Law Firm', status: 'active', accounts: 3 },
            { name: 'Melbourne Property Fund No. 1', abn: '23 456 789 012', type: 'Unit Trust', status: 'active', accounts: 2 },
            { name: 'Private Credit Fund LP', abn: '34 567 890 123', type: 'Limited Partnership', status: 'active', accounts: 2 }
          ].map((entity, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-gray-900">{entity.name}</p>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                    {entity.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>ABN: {entity.abn}</span>
                  <span>•</span>
                  <span>{entity.type}</span>
                  <span>•</span>
                  <span>{entity.accounts} bank accounts</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => toast.info(`Editing ${entity.name}`)}>
                  Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toast.info(`Viewing ${entity.name}`)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* User Management */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Button size="sm" onClick={() => toast.success('Inviting new user...')}>
            <Plus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">MFA</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Login</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { name: 'Sarah Chen', email: 'sarah.chen@firm.com', role: 'Finance Manager', mfa: true, status: 'active', lastLogin: '2 hours ago' },
                { name: 'Michael Wong', email: 'michael.wong@firm.com', role: 'Trust Operator', mfa: true, status: 'active', lastLogin: '1 day ago' },
                { name: 'John Smith', email: 'john.smith@firm.com', role: 'Fund Administrator', mfa: true, status: 'active', lastLogin: '3 hours ago' },
                { name: 'Emma Davis', email: 'emma.davis@firm.com', role: 'Payment Approver', mfa: false, status: 'active', lastLogin: '1 week ago' }
              ].map((user, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.role}</td>
                  <td className="px-4 py-3 text-center">
                    {user.mfa ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">ENABLED</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">DISABLED</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.lastLogin}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => toast.info(`Editing ${user.name}`)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    {/* System Configuration */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Bank Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900">Open Banking (CDR)</p>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">CONNECTED</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Australian CDR-compliant banking integration</p>
              <Button size="sm" variant="outline" onClick={() => toast.info('Managing CDR connections')}>
                Manage Connections
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-900">File Import</p>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">ENABLED</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">MT940, CAMT, ABA file support</p>
              <Button size="sm" variant="outline" onClick={() => toast.info('Configuring file formats')}>
                Configure Formats
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security & Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold text-sm text-gray-900">MFA Required</p>
                <p className="text-xs text-gray-600">All payment approvers</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">ENFORCED</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold text-sm text-gray-900">Session Timeout</p>
                <p className="text-xs text-gray-600">Auto logout after inactivity</p>
              </div>
              <span className="text-sm font-semibold text-gray-900">15 minutes</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold text-sm text-gray-900">Audit Logging</p>
                <p className="text-xs text-gray-600">Complete action trail</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">ENABLED</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-semibold text-sm text-gray-900">Data Encryption</p>
                <p className="text-xs text-gray-600">At rest and in transit</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">AES-256</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Workflow Settings */}
    <Card>
      <CardHeader>
        <CardTitle>Workflow Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="font-semibold text-gray-900 mb-3">Payment Approval Rules</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Threshold for dual approval</span>
                <span className="font-semibold text-gray-900">$50,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Trust payment limit per day</span>
                <span className="font-semibold text-gray-900">$2,000,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Auto-approve threshold</span>
                <span className="font-semibold text-gray-900">$5,000</span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="mt-4" onClick={() => toast.info('Editing approval rules')}>
              Edit Rules
            </Button>
          </div>

          <div className="p-4 border rounded-lg">
            <p className="font-semibold text-gray-900 mb-3">Reconciliation Settings</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Auto-match confidence threshold</span>
                <span className="font-semibold text-gray-900">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Daily auto-reconciliation</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">ENABLED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Alert on variance over</span>
                <span className="font-semibold text-gray-900">$1,000</span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="mt-4" onClick={() => toast.info('Editing recon settings')}>
              Edit Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

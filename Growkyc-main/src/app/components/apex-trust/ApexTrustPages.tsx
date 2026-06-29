import React from 'react';
import {
  Plus,
  Eye,
  Building2,
  UserCheck,
  Upload,
  Activity,
  Download,
  Lock,
  CheckCircle,
  Shield
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../../lib/toast';

export const renderFundAdmin = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-100">Fund Administration</h2>
      <Button onClick={() => toast.success('Add new investor')}>
        <Plus className="w-4 h-4 mr-2" />
        Add Investor
      </Button>
    </div>

    {/* Fund Overview */}
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card className="border-l-4 border-purple-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Total Commitments</p>
          <p className="text-2xl font-bold text-slate-100">$25.0M</p>
          <p className="text-xs text-slate-400 mt-1">18 investors</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-blue-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Called Capital</p>
          <p className="text-2xl font-bold text-slate-100">$15.2M</p>
          <p className="text-xs text-blue-400 mt-1">60.8% call rate</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-green-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Paid Capital</p>
          <p className="text-2xl font-bold text-slate-100">$14.8M</p>
          <p className="text-xs text-green-400 mt-1">97.4% collected</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-amber-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Outstanding Calls</p>
          <p className="text-2xl font-bold text-amber-300">$400K</p>
          <p className="text-xs text-amber-400 mt-1">2 overdue</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-indigo-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Fund NAV</p>
          <p className="text-2xl font-bold text-slate-100">$15.8M</p>
          <p className="text-xs text-green-400 mt-1">+$600K gain</p>
        </CardContent>
      </Card>
    </div>

    {/* Investor Registry */}
    <Card>
      <CardHeader>
        <CardTitle>Investor Registry</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Investor</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase">AML Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Commitment</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Called</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Paid</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Units</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                { name: 'Melbourne Super Fund', aml: 'current', commitment: 5000000, called: 3000000, paid: 3000000, units: 30000 },
                { name: 'Chen Family Trust', aml: 'current', commitment: 2500000, called: 1500000, paid: 1500000, units: 15000 },
                { name: 'Wilson Investment Co', aml: 'review', commitment: 3000000, called: 1800000, paid: 1600000, units: 18000 },
                { name: 'Private Wealth Partners', aml: 'current', commitment: 4000000, called: 2400000, paid: 2400000, units: 24000 }
              ].map((investor, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-100">{investor.name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      investor.aml === 'current' ? 'bg-green-500/15 text-green-300' : 'bg-amber-500/15 text-amber-300'
                    }`}>
                      {investor.aml.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-slate-100">${(investor.commitment / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-300">${(investor.called / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-3 text-sm text-right text-green-300">${(investor.paid / 1000000).toFixed(1)}M</td>
                  <td className="px-4 py-3 text-sm text-right font-mono text-slate-100">{investor.units.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => toast.info(`View ${investor.name}`)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    {/* Capital Calls & Distributions */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pending Capital Calls</CardTitle>
            <Button size="sm" onClick={() => toast.success('Creating capital call...')}>
              <Plus className="w-4 h-4 mr-2" />
              New Call
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 'CALL-2024-003', amount: 250000, investors: 18, due: '2024-03-01', status: 'pending' },
              { id: 'CALL-2024-002', amount: 150000, investors: 18, due: '2024-02-15', status: 'overdue' }
            ].map((call, idx) => (
              <div key={idx} className={`p-4 border-l-4 rounded-lg ${
                call.status === 'overdue' ? 'bg-red-500/10 border-red-500' : 'bg-amber-500/10 border-amber-500'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-slate-100">{call.id}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    call.status === 'overdue' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {call.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Amount: ${call.amount.toLocaleString()}</span>
                  <span className="text-slate-300">Due: {call.due}</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">{call.investors} investors</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Distribution Queue</CardTitle>
            <Button size="sm" onClick={() => toast.success('Processing distribution...')}>
              <Plus className="w-4 h-4 mr-2" />
              New Distribution
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 'DIST-2024-Q4', amount: 420000, investors: 18, date: '2024-12-31', type: 'Quarterly' },
              { id: 'DIST-2024-MGMT', amount: 85000, investors: 1, date: '2024-12-31', type: 'Management Fee' }
            ].map((dist, idx) => (
              <div key={idx} className="p-4 border rounded-lg bg-green-500/10 border-green-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-slate-100">{dist.id}</span>
                  <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded">
                    {dist.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Amount: ${dist.amount.toLocaleString()}</span>
                  <span className="text-slate-300">{dist.date}</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">{dist.investors} recipients</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export const renderBankRecon = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-100">Bank Reconciliation</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => toast.success('Importing bank feed...')}>
          <Upload className="w-4 h-4 mr-2" />
          Import Feed
        </Button>
        <Button onClick={() => toast.success('Running reconciliation...')}>
          <Activity className="w-4 h-4 mr-2" />
          Run Recon
        </Button>
      </div>
    </div>

    {/* Recon Status */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-l-4 border-green-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Matched Transactions</p>
          <p className="text-3xl font-bold text-green-300">247</p>
          <p className="text-xs text-slate-400 mt-1">Last 30 days</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-amber-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Pending Review</p>
          <p className="text-3xl font-bold text-amber-300">12</p>
          <p className="text-xs text-amber-400 mt-1">Requires attention</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-blue-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Auto-Matched</p>
          <p className="text-3xl font-bold text-blue-300">94%</p>
          <p className="text-xs text-slate-400 mt-1">Success rate</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-purple-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Last Sync</p>
          <p className="text-xl font-bold text-slate-100">2 hrs ago</p>
          <p className="text-xs text-green-400 mt-1">All accounts</p>
        </CardContent>
      </Card>
    </div>

    {/* Bank Accounts */}
    <Card>
      <CardHeader>
        <CardTitle>Connected Bank Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { name: 'CBA Trust Account', type: 'Trust', bsb: '063-000', account: '1234 5678', balance: 5420650, lastSync: '2 hours ago', status: 'connected' },
            { name: 'NAB Controlled Money', type: 'Trust', bsb: '082-001', account: '8765 4321', balance: 2856420, lastSync: '2 hours ago', status: 'connected' },
            { name: 'Westpac Operating', type: 'Operating', bsb: '032-002', account: '5555 6666', balance: 185340, lastSync: '2 hours ago', status: 'connected' }
          ].map((account, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-white/5">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/15 rounded-lg">
                    <Building2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100">{account.name}</p>
                    <p className="text-sm text-slate-300">{account.bsb} {account.account}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-100">${account.balance.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-green-500/15 text-green-300 text-xs font-semibold rounded">{account.status.toUpperCase()}</span>
                  <span className="text-xs text-slate-400">{account.lastSync}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Pending Matches */}
    <Card>
      <CardHeader>
        <CardTitle>Pending Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Description</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Suggested Match</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                { date: '2024-02-15', desc: 'DEPOSIT FROM SMITH J', amount: 125000, match: 'MAT-2024-145', confidence: 95 },
                { date: '2024-02-14', desc: 'PAYMENT TO VENDOR', amount: -85000, match: 'MAT-2024-142', confidence: 88 },
                { date: '2024-02-13', desc: 'TRUST RECEIPT', amount: 50000, match: 'Unmatched', confidence: 0 }
              ].map((txn, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-sm text-slate-100">{txn.date}</td>
                  <td className="px-4 py-3 text-sm text-slate-100">{txn.desc}</td>
                  <td className="px-4 py-3 text-sm font-bold text-right text-slate-100">${Math.abs(txn.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    {txn.confidence > 0 ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-mono text-sm font-semibold text-blue-300">{txn.match}</span>
                        <span className="px-2 py-1 bg-green-500/15 text-green-300 text-xs font-semibold rounded">{txn.confidence}%</span>
                      </div>
                    ) : (
                      <span className="px-2 py-1 bg-amber-500/15 text-amber-300 text-xs font-semibold rounded">REVIEW REQUIRED</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.success('Match accepted')}>
                        Accept
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.info('Manual match')}>
                        Review
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

export const renderPayments = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-100">Payment System</h2>
      <Button onClick={() => toast.success('Creating ABA batch...')}>
        <Plus className="w-4 h-4 mr-2" />
        New Payment Batch
      </Button>
    </div>

    {/* Payment Overview */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-l-4 border-amber-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Pending Approval</p>
          <p className="text-3xl font-bold text-amber-300">3</p>
          <p className="text-xs text-slate-400 mt-1">Total: $425K</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-blue-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Approved Today</p>
          <p className="text-3xl font-bold text-blue-300">8</p>
          <p className="text-xs text-blue-400 mt-1">Total: $1.2M</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-green-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Processed This Month</p>
          <p className="text-3xl font-bold text-green-300">124</p>
          <p className="text-xs text-slate-400 mt-1">Total: $8.5M</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-red-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Blocked Payments</p>
          <p className="text-3xl font-bold text-red-300">0</p>
          <p className="text-xs text-slate-400 mt-1">All checks passed</p>
        </CardContent>
      </Card>
    </div>

    {/* Pending Approval */}
    <Card>
      <CardHeader>
        <CardTitle>Pending Payment Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { id: 'ABA-2024-045', type: 'Trust Disbursement', amount: 285000, payments: 5, created: '2024-02-15 09:30', approver1: 'Pending', approver2: 'Required', status: 'pending_approval' },
            { id: 'ABA-2024-046', type: 'Distribution', amount: 120000, payments: 12, created: '2024-02-15 10:15', approver1: 'John Smith', approver2: 'Pending', status: 'partial_approval' },
            { id: 'ABA-2024-047', type: 'Vendor Payment', amount: 20000, payments: 1, created: '2024-02-15 11:00', approver1: 'Pending', approver2: 'Required', status: 'pending_approval' }
          ].map((batch, idx) => (
            <div key={idx} className={`p-4 border-l-4 rounded-lg ${
              batch.status === 'partial_approval' ? 'bg-blue-500/10 border-blue-500' : 'bg-amber-500/10 border-amber-500'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono font-bold text-slate-100">{batch.id}</span>
                    <span className="px-2 py-1 bg-white border text-xs font-semibold rounded">{batch.type}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      batch.status === 'partial_approval' ? 'bg-blue-600 text-white' : 'bg-amber-600 text-white'
                    }`}>
                      {batch.status === 'partial_approval' ? '1/2 APPROVED' : 'AWAITING APPROVAL'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-slate-300">Total Amount</p>
                      <p className="font-bold text-slate-100">${batch.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-300">Payments</p>
                      <p className="font-bold text-slate-100">{batch.payments} transactions</p>
                    </div>
                    <div>
                      <p className="text-slate-300">Created</p>
                      <p className="font-bold text-slate-100">{batch.created}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">Approver 1:</span>
                      <span className={`font-semibold ${batch.approver1 === 'Pending' ? 'text-amber-300' : 'text-green-300'}`}>
                        {batch.approver1}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">Approver 2:</span>
                      <span className={`font-semibold ${batch.approver2 === 'Pending' || batch.approver2 === 'Required' ? 'text-amber-300' : 'text-green-300'}`}>
                        {batch.approver2}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" onClick={() => toast.success(`Approved batch ${batch.id}`)}>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info(`Viewing batch ${batch.id}`)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toast.error(`Rejected batch ${batch.id}`)}>
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Payment History */}
    <Card>
      <CardHeader>
        <CardTitle>Recent Payment Batches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Batch ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Type</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Payments</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Processed</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                { id: 'ABA-2024-044', type: 'Trust Disbursement', amount: 550000, payments: 8, status: 'processed', date: '2024-02-14 14:30' },
                { id: 'ABA-2024-043', type: 'Distribution', amount: 340000, payments: 15, status: 'processed', date: '2024-02-13 11:20' },
                { id: 'ABA-2024-042', type: 'Vendor Payment', amount: 45000, payments: 3, status: 'processed', date: '2024-02-12 16:45' }
              ].map((batch, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-sm font-mono font-semibold text-slate-100">{batch.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-100">{batch.type}</td>
                  <td className="px-4 py-3 text-sm font-bold text-right text-slate-100">${batch.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-center text-slate-100">{batch.payments}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 bg-green-500/15 text-green-300 text-xs font-semibold rounded">
                      {batch.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{batch.date}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => toast.info(`View batch ${batch.id}`)}>
                      <Eye className="w-4 h-4" />
                    </Button>
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

export const renderCompliance = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-100">Compliance & Audit</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => toast.success('Generating audit pack...')}>
          <Download className="w-4 h-4 mr-2" />
          Export Audit Pack
        </Button>
        <Button onClick={() => toast.success('Running compliance check...')}>
          <Shield className="w-4 h-4 mr-2" />
          Run Check
        </Button>
      </div>
    </div>

    {/* Compliance Status */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-l-4 border-green-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Trust Compliance</p>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <p className="text-2xl font-bold text-green-300">PASS</p>
          </div>
          <p className="text-xs text-slate-400 mt-1">All checks passed</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-green-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">AML Status</p>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <p className="text-2xl font-bold text-green-300">CURRENT</p>
          </div>
          <p className="text-xs text-slate-400 mt-1">16/18 reviewed</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-amber-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Period Lock</p>
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-amber-400" />
            <p className="text-2xl font-bold text-amber-300">FEB 2026</p>
          </div>
          <p className="text-xs text-amber-400 mt-1">Lock pending</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-blue-600">
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-1">Audit Trail</p>
          <p className="text-3xl font-bold text-blue-300">100%</p>
          <p className="text-xs text-slate-400 mt-1">Complete logging</p>
        </CardContent>
      </Card>
    </div>

    {/* Breach Monitoring */}
    <Card>
      <CardHeader>
        <CardTitle>Breach Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-4 bg-green-500/10 border-2 border-green-300 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div className="flex-1">
                <p className="font-semibold text-green-300">No Active Breaches</p>
                <p className="text-sm text-green-300">All compliance checks passed. System operating normally.</p>
              </div>
            </div>
          </div>
          
          {/* Historical Alerts */}
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-semibold text-slate-300 mb-3">Recent Alerts (Resolved)</p>
            {[
              { type: 'warning', message: 'Matter MAT-2024-123 approaching overdraft threshold', resolved: '2024-02-10', action: 'Receipt allocated' },
              { type: 'info', message: 'Period lock scheduled for January 2026', resolved: '2024-02-01', action: 'Lock completed' }
            ].map((alert, idx) => (
              <div key={idx} className="p-3 bg-white/5 border rounded-lg mb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-slate-100">{alert.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-300">
                      <span>Resolved: {alert.resolved}</span>
                      <span>•</span>
                      <span>Action: {alert.action}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-white/10 text-slate-300 text-xs font-semibold rounded">RESOLVED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Audit Reports */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Trust Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: 'Trust Trial Balance', desc: 'All trust accounts reconciled', status: 'current' },
              { name: 'Client Balance Listing', desc: 'Matter-level balances', status: 'current' },
              { name: 'Overdrawn Matter Report', desc: 'No overdrawn matters', status: 'current' },
              { name: 'Receipt Journal', desc: 'All receipts logged', status: 'current' },
              { name: 'Payment Journal', desc: 'All payments logged', status: 'current' },
              { name: 'Reconciliation Statement', desc: '3-way recon passed', status: 'current' }
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-white/5">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-100">{report.name}</p>
                  <p className="text-xs text-slate-300">{report.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-500/15 text-green-300 text-xs font-semibold rounded">
                    {report.status.toUpperCase()}
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => toast.success(`Generating ${report.name}...`)}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Period Locks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { period: 'January 2026', locked: '2024-02-01', status: 'locked', transactions: 245 },
              { period: 'December 2025', locked: '2024-01-05', status: 'locked', transactions: 312 },
              { period: 'November 2025', locked: '2023-12-03', status: 'locked', transactions: 289 },
              { period: 'February 2026', locked: 'Pending', status: 'active', transactions: 187 }
            ].map((period, idx) => (
              <div key={idx} className={`p-3 border-l-4 rounded-lg ${
                period.status === 'locked' ? 'bg-white/5 border-gray-400' : 'bg-blue-500/10 border-blue-500'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-100">{period.period}</p>
                      {period.status === 'locked' && <Lock className="w-4 h-4 text-slate-300" />}
                    </div>
                    <p className="text-xs text-slate-300">{period.transactions} transactions</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {period.status === 'locked' ? `Locked: ${period.locked}` : 'Active period'}
                    </p>
                  </div>
                  {period.status === 'active' && (
                    <Button size="sm" onClick={() => toast.success(`Locking ${period.period}...`)}>
                      Lock Period
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Audit Trail */}
    <Card>
      <CardHeader>
        <CardTitle>Recent Audit Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Entity</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                { time: '2024-02-15 14:32:15', user: 'sarah.chen@firm.com', action: 'Payment batch approved', entity: 'ABA-2024-044', status: 'success' },
                { time: '2024-02-15 14:28:42', user: 'michael.wong@firm.com', action: 'Trust receipt allocated', entity: 'MAT-2024-145', status: 'success' },
                { time: '2024-02-15 14:15:33', user: 'admin@firm.com', action: 'Bank reconciliation run', entity: 'CBA Trust Account', status: 'success' },
                { time: '2024-02-15 13:45:22', user: 'john.smith@firm.com', action: 'Capital call created', entity: 'CALL-2024-003', status: 'success' }
              ].map((event, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-xs font-mono text-slate-100">{event.time}</td>
                  <td className="px-4 py-3 text-sm text-slate-100">{event.user}</td>
                  <td className="px-4 py-3 text-sm text-slate-100">{event.action}</td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-100">{event.entity}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 bg-green-500/15 text-green-300 text-xs font-semibold rounded">
                      {event.status.toUpperCase()}
                    </span>
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

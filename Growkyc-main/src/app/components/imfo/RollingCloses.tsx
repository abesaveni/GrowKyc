import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  RefreshCw,
  Lock,
  Unlock
} from 'lucide-react';

interface RollingClosesProps {
  onNavigate: (page: string) => void;
  role: string;
  onBack?: () => void;
}

type CloseStatus = 'open' | 'closing_soon' | 'closed' | 'final';

interface RollingClose {
  id: string;
  name: string;
  fund: string;
  closeNumber: number;
  status: CloseStatus;
  openDate: string;
  closeDate: string;
  finalCloseDate?: string;
  minCommitment: string;
  targetRaise: string;
  totalCommitments: string;
  investors: number;
  terms: {
    version: string;
    lastUpdated: string;
    changes?: string;
  };
}

interface Commitment {
  id: string;
  investor: string;
  amount: string;
  status: 'pending' | 'accepted' | 'declined';
  submittedDate: string;
  tier: string;
}

export function RollingCloses({ onNavigate, role, onBack }: RollingClosesProps) {
  const [selectedClose, setSelectedClose] = useState<string | null>(null);

  const rollingCloses: RollingClose[] = [
    {
      id: 'rc-001',
      name: 'Growth Credit Fund I - Close 3',
      fund: 'Growth Credit Fund I',
      closeNumber: 3,
      status: 'open',
      openDate: '2026-02-01',
      closeDate: '2026-03-31',
      minCommitment: '$500,000',
      targetRaise: '$25M',
      totalCommitments: '$18.5M',
      investors: 23,
      terms: {
        version: 'v3.0',
        lastUpdated: '2026-02-01',
        changes: 'Updated management fee structure'
      }
    },
    {
      id: 'rc-002',
      name: 'Growth Credit Fund I - Close 2',
      fund: 'Growth Credit Fund I',
      closeNumber: 2,
      status: 'closed',
      openDate: '2025-11-01',
      closeDate: '2025-12-31',
      finalCloseDate: '2026-01-05',
      minCommitment: '$500,000',
      targetRaise: '$20M',
      totalCommitments: '$22.3M',
      investors: 28,
      terms: {
        version: 'v2.1',
        lastUpdated: '2025-11-01'
      }
    },
    {
      id: 'rc-003',
      name: 'Growth Credit Fund I - Close 1',
      fund: 'Growth Credit Fund I',
      closeNumber: 1,
      status: 'final',
      openDate: '2025-08-01',
      closeDate: '2025-10-31',
      finalCloseDate: '2025-11-10',
      minCommitment: '$1,000,000',
      targetRaise: '$15M',
      totalCommitments: '$17.8M',
      investors: 18,
      terms: {
        version: 'v1.0',
        lastUpdated: '2025-08-01'
      }
    },
    {
      id: 'rc-004',
      name: 'Opportunity Fund II - Close 2',
      fund: 'Opportunity Fund II',
      closeNumber: 2,
      status: 'closing_soon',
      openDate: '2026-01-15',
      closeDate: '2026-02-28',
      minCommitment: '$250,000',
      targetRaise: '$10M',
      totalCommitments: '$8.9M',
      investors: 35,
      terms: {
        version: 'v2.0',
        lastUpdated: '2026-01-15',
        changes: 'Extended investment period'
      }
    }
  ];

  const commitments: Commitment[] = [
    { id: 'c1', investor: 'ABC Superannuation Fund', amount: '$2,500,000', status: 'accepted', submittedDate: '2026-02-05', tier: 'Tier 1' },
    { id: 'c2', investor: 'Smith Family Trust', amount: '$1,000,000', status: 'accepted', submittedDate: '2026-02-08', tier: 'Tier 2' },
    { id: 'c3', investor: 'XYZ Investment Group', amount: '$3,000,000', status: 'pending', submittedDate: '2026-02-12', tier: 'Tier 1' },
    { id: 'c4', investor: 'Johnson Pty Ltd', amount: '$750,000', status: 'accepted', submittedDate: '2026-02-10', tier: 'Tier 2' },
    { id: 'c5', investor: 'Wilson Investment Co', amount: '$500,000', status: 'pending', submittedDate: '2026-02-14', tier: 'Tier 3' }
  ];

  const statusConfig = {
    open: { label: 'Open', color: 'bg-green-500/15 text-green-300 border-green-300', icon: Unlock },
    closing_soon: { label: 'Closing Soon', color: 'bg-yellow-500/15 text-yellow-300 border-yellow-300', icon: Clock },
    closed: { label: 'Closed', color: 'bg-blue-500/15 text-blue-300 border-blue-300', icon: Lock },
    final: { label: 'Finalized', color: 'bg-white/5 text-slate-300 border-white/10', icon: CheckCircle }
  };

  const commitmentStatusConfig = {
    pending: { label: 'Pending Review', color: 'bg-yellow-500/15 text-yellow-300 border-yellow-300', icon: Clock },
    accepted: { label: 'Accepted', color: 'bg-green-500/15 text-green-300 border-green-300', icon: CheckCircle },
    declined: { label: 'Declined', color: 'bg-red-500/15 text-red-300 border-red-300', icon: AlertCircle }
  };

  const getDaysRemaining = (closeDate: string) => {
    const today = new Date('2026-02-15');
    const close = new Date(closeDate);
    const diff = Math.ceil((close.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Close Detail View
  if (selectedClose) {
    const close = rollingCloses.find(c => c.id === selectedClose);
    if (!close) return null;

    const daysRemaining = getDaysRemaining(close.closeDate);
    const progress = (parseFloat(close.totalCommitments.replace(/[$M,]/g, '')) / parseFloat(close.targetRaise.replace(/[$M,]/g, ''))) * 100;

    return (
      <div className="p-8 space-y-6">
        <div>
          <Button variant="ghost" onClick={() => setSelectedClose(null)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rolling Closes
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-100">{close.name}</h1>
              <p className="text-slate-300 mt-1">Close #{close.closeNumber} • Terms {close.terms.version}</p>
            </div>
            <div className="flex gap-2">
              {close.status === 'open' && (
                <>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Terms
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Lock className="w-4 h-4 mr-2" />
                    Close Early
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status & Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`border-2 ${close.status === 'open' ? 'border-green-300 bg-green-500/10' : 'border-white/10'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Status</p>
                  <p className={`text-2xl font-bold mt-1 ${close.status === 'open' ? 'text-green-300' : 'text-slate-300'}`}>
                    {statusConfig[close.status].label}
                  </p>
                  {close.status === 'open' && daysRemaining > 0 && (
                    <p className="text-sm text-slate-300 mt-1">{daysRemaining} days remaining</p>
                  )}
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${close.status === 'open' ? 'bg-green-500/20' : 'bg-white/10'}`}>
                  {React.createElement(statusConfig[close.status].icon, { className: `w-6 h-6 ${close.status === 'open' ? 'text-green-300' : 'text-slate-300'}` })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Total Commitments</p>
                  <p className="text-2xl font-bold text-blue-300 mt-1">{close.totalCommitments}</p>
                  <p className="text-sm text-slate-300 mt-1">Target: {close.targetRaise}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Investors</p>
                  <p className="text-2xl font-bold text-purple-300 mt-1">{close.investors}</p>
                  <p className="text-sm text-slate-300 mt-1">Commitments received</p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">Fundraising Progress</span>
                <span className="text-sm font-bold text-blue-300">{progress.toFixed(0)}% of target</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${progress >= 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Min: {close.minCommitment}</span>
                <span>Target: {close.targetRaise}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Version */}
        <Card className="border-2 border-blue-300 bg-blue-500/10">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-blue-400 mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-blue-300">Investment Terms {close.terms.version}</h3>
                  <span className="text-xs text-blue-300">Last updated: {close.terms.lastUpdated}</span>
                </div>
                {close.terms.changes && (
                  <p className="text-sm text-blue-300 mb-3">
                    <strong>Changes in this version:</strong> {close.terms.changes}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-blue-300">
                    <Eye className="w-4 h-4 mr-1" />
                    View Terms
                  </Button>
                  <Button size="sm" variant="outline" className="border-blue-300">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Version History
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commitments */}
        <div>
          <h2 className="text-xl font-bold text-slate-100 mb-4">Investor Commitments</h2>
          <div className="grid grid-cols-1 gap-4">
            {commitments.map((commitment) => {
              const commitStatus = commitmentStatusConfig[commitment.status];
              const CommitIcon = commitStatus.icon;

              return (
                <Card key={commitment.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-indigo-500/15 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-slate-100">{commitment.investor}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-semibold border ${commitStatus.color}`}>
                              <CommitIcon className="w-3 h-3 inline mr-1" />
                              {commitStatus.label}
                            </span>
                            <span className="px-2 py-1 bg-white/5 text-slate-300 text-xs font-medium rounded">
                              {commitment.tier}
                            </span>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-slate-300">
                            <span className="font-semibold text-lg text-slate-100">{commitment.amount}</span>
                            <span>Submitted: {commitment.submittedDate}</span>
                          </div>
                        </div>
                      </div>
                      {commitment.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-400 border-red-300">
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Close Dates */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-slate-100 mb-4">Key Dates</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-green-400" />
                  <p className="font-semibold text-slate-100">Open Date</p>
                </div>
                <p className="text-slate-300">{close.openDate}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <p className="font-semibold text-slate-100">Close Date</p>
                </div>
                <p className="text-slate-300">{close.closeDate}</p>
              </div>
              {close.finalCloseDate && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <p className="font-semibold text-slate-100">Final Close</p>
                  </div>
                  <p className="text-slate-300">{close.finalCloseDate}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main List View
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
            <h1 className="text-3xl font-bold text-slate-100">Rolling Closes</h1>
            <p className="text-slate-300 mt-1">Manage rolling closes with versioned terms and investor commitments</p>
          </div>
          {(role === 'fund-manager' || role === 'fund-accountant' || role === 'cfo') && (
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              New Rolling Close
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
                <p className="text-sm text-slate-300">Active Closes</p>
                <p className="text-3xl font-bold text-green-400 mt-1">
                  {rollingCloses.filter(c => c.status === 'open' || c.status === 'closing_soon').length}
                </p>
              </div>
              <Unlock className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Total Raised</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">$67.5M</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Total Investors</p>
                <p className="text-3xl font-bold text-purple-400 mt-1">104</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Avg Close Size</p>
                <p className="text-3xl font-bold text-orange-400 mt-1">$19.5M</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rolling Closes List */}
      <div className="grid grid-cols-1 gap-4">
        {rollingCloses.map((close) => {
          const status = statusConfig[close.status];
          const StatusIcon = status.icon;
          const daysRemaining = close.status === 'open' || close.status === 'closing_soon' ? getDaysRemaining(close.closeDate) : null;
          const progress = (parseFloat(close.totalCommitments.replace(/[$M,]/g, '')) / parseFloat(close.targetRaise.replace(/[$M,]/g, ''))) * 100;

          return (
            <Card 
              key={close.id} 
              className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-indigo-400"
              onClick={() => setSelectedClose(close.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-100">{close.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {status.label}
                      </span>
                      {close.terms.changes && (
                        <span className="px-2 py-1 bg-blue-500/15 text-blue-300 text-xs font-medium rounded">
                          Terms Updated
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-6 mb-4">
                      <div>
                        <p className="text-xs text-slate-400">Total Raised</p>
                        <p className="text-lg font-bold text-blue-300">{close.totalCommitments}</p>
                        <p className="text-xs text-slate-300">of {close.targetRaise} target</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Investors</p>
                        <p className="text-lg font-bold text-purple-300">{close.investors}</p>
                        <p className="text-xs text-slate-300">commitments</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Close Date</p>
                        <p className="text-sm font-medium text-slate-100">{close.closeDate}</p>
                        {daysRemaining !== null && daysRemaining > 0 && (
                          <p className="text-xs text-orange-400">{daysRemaining} days left</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Terms Version</p>
                        <p className="text-sm font-medium text-slate-100">{close.terms.version}</p>
                        <p className="text-xs text-slate-300">{close.terms.lastUpdated}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Progress</span>
                        <span className="font-semibold text-slate-100">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${progress >= 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Highlight */}
      <Card className="border-2 border-purple-300 bg-purple-500/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <RefreshCw className="w-6 h-6 text-purple-400 mt-1" />
            <div>
              <h3 className="font-bold text-purple-300 mb-2">Rolling Close Management</h3>
              <p className="text-sm text-purple-300 mb-4">
                Manage multiple fundraising closes with versioned terms, automated commitment tracking, and investor tier management.
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-purple-300">Versioned Terms</p>
                  <p className="text-purple-300">Track changes across closes</p>
                </div>
                <div>
                  <p className="font-semibold text-purple-300">Auto Allocation</p>
                  <p className="text-purple-300">Tier-based commitment rules</p>
                </div>
                <div>
                  <p className="font-semibold text-purple-300">Progress Tracking</p>
                  <p className="text-purple-300">Real-time fundraising metrics</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

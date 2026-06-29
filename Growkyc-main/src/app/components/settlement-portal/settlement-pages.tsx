import React from 'react';
import {
  Home,
  Briefcase,
  CheckSquare,
  FileText,
  AlertTriangle,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  Users,
  Building2,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Link2,
  RefreshCw,
  Send,
  Upload,
  Target,
  BarChart3,
  TrendingUp,
  Activity,
  Shield,
  ArrowRight,
  ExternalLink,
  Percent,
  FileCheck,
  UserCheck,
  Zap
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from '../../lib/toast';

// ===== DASHBOARD =====
export const renderDashboard = (
  role: string,
  setCurrentPage: (page: any) => void,
  setSelectedMatter: (id: string) => void
) => {
  // Internal staff dashboard
  if (role === 'internal-staff' || role === 'settlement-agent' || role === 'lawyer' || role === 'admin') {
    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-500/15 rounded-lg">
                  <Calendar className="w-6 h-6 text-emerald-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-sm text-slate-300 mb-1">Settlements This Week</p>
              <p className="text-3xl font-bold text-slate-100">24</p>
              <p className="text-xs text-slate-400 mt-2">$18.2M total value</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-500/15 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-amber-400" />
                </div>
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-sm text-slate-300 mb-1">Overdue Conditions</p>
              <p className="text-3xl font-bold text-slate-100">8</p>
              <p className="text-xs text-slate-400 mt-2">Across 5 matters</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/15 rounded-lg">
                  <CheckSquare className="w-6 h-6 text-blue-400" />
                </div>
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm text-slate-300 mb-1">Tasks Due Today</p>
              <p className="text-3xl font-bold text-slate-100">12</p>
              <p className="text-xs text-slate-400 mt-2">3 high priority</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/15 rounded-lg">
                  <Link2 className="w-6 h-6 text-purple-400" />
                </div>
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-sm text-slate-300 mb-1">PEXA Workspaces</p>
              <p className="text-3xl font-bold text-slate-100">47</p>
              <p className="text-xs text-slate-400 mt-2">3 awaiting sync</p>
            </CardContent>
          </Card>
        </div>

        {/* Matters by Stage */}
        <Card>
          <CardHeader>
            <CardTitle>Matters by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {[
                { stage: 'Intake', count: 8, color: 'bg-white/5 text-slate-300' },
                { stage: 'Verification', count: 12, color: 'bg-blue-500/15 text-blue-300' },
                { stage: 'Conditions', count: 18, color: 'bg-amber-500/15 text-amber-300' },
                { stage: 'Doc Prep', count: 15, color: 'bg-purple-500/15 text-purple-300' },
                { stage: 'Signing', count: 9, color: 'bg-indigo-500/15 text-indigo-300' },
                { stage: 'Pre-Settlement', count: 6, color: 'bg-orange-500/15 text-orange-300' },
                { stage: 'Settlement', count: 4, color: 'bg-green-500/15 text-green-300' },
                { stage: 'Post-Settlement', count: 2, color: 'bg-emerald-500/15 text-emerald-300' }
              ].map((stage) => (
                <div
                  key={stage.stage}
                  className={`${stage.color} p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow text-center`}
                  onClick={() => toast.info(`Viewing ${stage.stage} matters`)}
                >
                  <p className="text-2xl font-bold">{stage.count}</p>
                  <p className="text-xs font-medium mt-1">{stage.stage}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Urgent Matters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Urgent Matters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    id: 'MAT-2024-1247',
                    property: '45 Collins St, Melbourne VIC',
                    settlement: '2024-02-20',
                    risk: 'high',
                    issue: '3 overdue conditions'
                  },
                  {
                    id: 'MAT-2024-1243',
                    property: '12 George St, Sydney NSW',
                    settlement: '2024-02-18',
                    risk: 'medium',
                    issue: 'PEXA sync pending'
                  },
                  {
                    id: 'MAT-2024-1239',
                    property: '88 Queen St, Brisbane QLD',
                    settlement: '2024-02-19',
                    risk: 'medium',
                    issue: 'Vendor lawyer not invited'
                  }
                ].map((matter) => (
                  <div
                    key={matter.id}
                    className="p-4 border-l-4 border-red-500 bg-red-500/10 rounded-lg cursor-pointer hover:bg-red-500/15 transition-colors"
                    onClick={() => {
                      setSelectedMatter(matter.id);
                      setCurrentPage('matter-detail');
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-mono text-sm font-semibold text-slate-100">{matter.id}</p>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          matter.risk === 'high'
                            ? 'bg-red-600 text-white'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {matter.risk.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-100 font-medium mb-1">{matter.property}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-300">Settles: {matter.settlement}</p>
                      <p className="text-xs text-red-300 font-semibold">{matter.issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PEXA Status Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { matter: 'MAT-2024-1250', event: 'Document signed', workspace: 'WS-2024-5847', time: '5 min ago' },
                  { matter: 'MAT-2024-1249', event: 'Financial settlement ready', workspace: 'WS-2024-5846', time: '15 min ago' },
                  { matter: 'MAT-2024-1248', event: 'Participant invited', workspace: 'WS-2024-5845', time: '1 hour ago' },
                  { matter: 'MAT-2024-1247', event: 'Workspace created', workspace: 'WS-2024-5844', time: '2 hours ago' }
                ].map((update, idx) => (
                  <div key={idx} className="p-3 border rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Link2 className="w-4 h-4 text-purple-400" />
                      <span className="font-mono text-xs font-semibold text-slate-100">{update.workspace}</span>
                    </div>
                    <p className="text-sm text-slate-100">{update.event}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-slate-300">{update.matter}</p>
                      <p className="text-xs text-slate-400">{update.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // External party dashboard (simplified)
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Matters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 'MAT-2024-1247', property: '45 Collins St, Melbourne VIC', settlement: '2024-02-20', status: 'conditions' },
              { id: 'MAT-2024-1240', property: '23 Park Rd, Sydney NSW', settlement: '2024-03-05', status: 'signing' }
            ].map((matter) => (
              <div
                key={matter.id}
                className="p-4 border rounded-lg hover:bg-white/5 cursor-pointer"
                onClick={() => {
                  setSelectedMatter(matter.id);
                  setCurrentPage('matter-detail');
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-sm font-semibold text-slate-100">{matter.id}</p>
                  <span className="px-2 py-1 bg-blue-500/15 text-blue-300 text-xs font-semibold rounded">
                    {matter.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-100">{matter.property}</p>
                <p className="text-xs text-slate-300 mt-1">Settlement: {matter.settlement}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ===== MATTERS LIST =====
export const renderMatters = (
  setCurrentPage: (page: any) => void,
  setSelectedMatter: (id: string) => void
) => (
  <div className="space-y-6">
    {/* Filters */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search matters..."
            className="pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select className="px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option>All States</option>
          <option>NSW</option>
          <option>VIC</option>
          <option>QLD</option>
          <option>SA</option>
          <option>WA</option>
          <option>TAS</option>
          <option>ACT</option>
          <option>NT</option>
        </select>
        <select className="px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option>All Stages</option>
          <option>Intake</option>
          <option>Verification</option>
          <option>Conditions</option>
          <option>Settlement</option>
        </select>
        <Button size="sm" variant="outline">
          <Filter className="w-4 h-4 mr-1" />
          More Filters
        </Button>
      </div>
      <Button onClick={() => toast.success('Create matter')}>
        <Plus className="w-4 h-4 mr-2" />
        New Matter
      </Button>
    </div>

    {/* Matters Table */}
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Matter ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Property</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">State</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Settlement Date</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Risk</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">PEXA</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                {
                  id: 'MAT-2024-1250',
                  property: '45 Collins St, Melbourne',
                  state: 'VIC',
                  type: 'Purchase',
                  stage: 'Conditions',
                  settlement: '2024-02-20',
                  risk: 'low',
                  pexa: 'WS-2024-5847'
                },
                {
                  id: 'MAT-2024-1249',
                  property: '12 George St, Sydney',
                  state: 'NSW',
                  type: 'Refinance',
                  stage: 'Document Prep',
                  settlement: '2024-02-22',
                  risk: 'medium',
                  pexa: 'WS-2024-5846'
                },
                {
                  id: 'MAT-2024-1248',
                  property: '88 Queen St, Brisbane',
                  state: 'QLD',
                  type: 'Purchase',
                  stage: 'Verification',
                  settlement: '2024-02-25',
                  risk: 'low',
                  pexa: 'WS-2024-5845'
                },
                {
                  id: 'MAT-2024-1247',
                  property: '56 King William St, Adelaide',
                  state: 'SA',
                  type: 'Sale',
                  stage: 'Signing',
                  settlement: '2024-02-18',
                  risk: 'high',
                  pexa: 'WS-2024-5844'
                },
                {
                  id: 'MAT-2024-1246',
                  property: '101 St Georges Tce, Perth',
                  state: 'WA',
                  type: 'Refinance',
                  stage: 'Pre-Settlement',
                  settlement: '2024-02-16',
                  risk: 'low',
                  pexa: 'WS-2024-5843'
                }
              ].map((matter) => (
                <tr
                  key={matter.id}
                  className="hover:bg-white/5 cursor-pointer"
                  onClick={() => {
                    setSelectedMatter(matter.id);
                    setCurrentPage('matter-detail');
                  }}
                >
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-100">{matter.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-100">{matter.property}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-white/5 text-slate-300 text-xs font-semibold rounded">
                      {matter.state}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{matter.type}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-500/15 text-blue-300 text-xs font-semibold rounded">
                      {matter.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{matter.settlement}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        matter.risk === 'low'
                          ? 'bg-green-500/15 text-green-300'
                          : matter.risk === 'medium'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-red-500/15 text-red-300'
                      }`}
                    >
                      {matter.risk.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Link2 className="w-3 h-3 text-purple-400" />
                      <span className="font-mono text-xs text-slate-300">{matter.pexa}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info('View matter');
                      }}
                    >
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

// ===== MATTER DETAIL =====
export const renderMatterDetail = (matterId: string | null, setCurrentPage: (page: any) => void) => (
  <div className="space-y-6">
    {/* Matter Header */}
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-slate-100">45 Collins Street, Melbourne VIC 3000</h3>
              <span className="px-3 py-1 bg-blue-500/15 text-blue-300 font-semibold rounded">
                Conditions Stage
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-xs text-slate-400">Matter ID</p>
                <p className="font-mono text-sm font-semibold text-slate-100">MAT-2024-1247</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Transaction Type</p>
                <p className="text-sm font-semibold text-slate-100">Purchase</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Settlement Date</p>
                <p className="text-sm font-semibold text-slate-100">20 Feb 2024, 2:00 PM</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">PEXA Workspace</p>
                <div className="flex items-center gap-1">
                  <Link2 className="w-3 h-3 text-purple-400" />
                  <p className="font-mono text-sm font-semibold text-purple-400">WS-2024-5847</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => toast.info('Sync with PEXA')}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Sync PEXA
            </Button>
            <Button size="sm" onClick={() => toast.success('Invite sent')}>
              <Plus className="w-4 h-4 mr-1" />
              Invite Participant
            </Button>
          </div>
        </div>

        {/* Stage Timeline */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {[
              { stage: 'Intake', status: 'complete', tasks: 0 },
              { stage: 'Verification', status: 'complete', tasks: 0 },
              { stage: 'Conditions', status: 'current', tasks: 8 },
              { stage: 'Doc Prep', status: 'pending', tasks: 12 },
              { stage: 'Signing', status: 'pending', tasks: 5 },
              { stage: 'Pre-Settlement', status: 'pending', tasks: 4 },
              { stage: 'Settlement', status: 'pending', tasks: 2 },
              { stage: 'Post-Settlement', status: 'pending', tasks: 3 }
            ].map((stage, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg text-center cursor-pointer transition-all ${
                  stage.status === 'complete'
                    ? 'bg-green-500/15 border-2 border-green-500'
                    : stage.status === 'current'
                    ? 'bg-blue-500/15 border-2 border-blue-500 ring-2 ring-blue-200'
                    : 'bg-white/5 border-2 border-white/10'
                }`}
                onClick={() => toast.info(`Viewing ${stage.stage} stage`)}
              >
                {stage.status === 'complete' && <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />}
                {stage.status === 'current' && <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />}
                {stage.status === 'pending' && <div className="w-4 h-4 border-2 border-gray-400 rounded-full mx-auto mb-1" />}
                <p className="text-xs font-semibold text-slate-100">{stage.stage}</p>
                <p className="text-xs text-slate-300">{stage.tasks} tasks</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Matter Tabs */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toast.info('View participants')}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/15 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Participants</h3>
              <p className="text-sm text-slate-400">8 parties</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {['SC', 'MJ', 'LB', 'DW'].map((initial, idx) => (
                <Avatar key={idx} className="w-8 h-8 border-2 border-white">
                  <AvatarFallback className="text-xs bg-emerald-600 text-white">{initial}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-sm text-slate-300">+4 more</span>
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPage('conditions')}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-500/15 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Conditions</h3>
              <p className="text-sm text-slate-400">12 total</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-slate-400">Cleared</p>
                <p className="text-lg font-bold text-green-400">8</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Pending</p>
                <p className="text-lg font-bold text-amber-400">4</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentPage('documents')}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/15 rounded-lg">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Documents</h3>
              <p className="text-sm text-slate-400">28 files</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-slate-400">Signed</p>
                <p className="text-lg font-bold text-green-400">15</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Pending</p>
                <p className="text-lg font-bold text-amber-400">13</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Financial Summary */}
    <Card>
      <CardHeader>
        <CardTitle>Financial Settlement Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-slate-300 mb-1">Purchase Price</p>
            <p className="text-2xl font-bold text-slate-100">$850,000</p>
          </div>
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-slate-300 mb-1">Deposit Paid</p>
            <p className="text-2xl font-bold text-slate-100">$85,000</p>
          </div>
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <p className="text-sm text-slate-300 mb-1">Balance Due</p>
            <p className="text-2xl font-bold text-slate-100">$765,000</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== TASKS =====
export const renderTasks = () => (
  <div className="space-y-6">
    {/* Task Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">Due Today</p>
          <p className="text-3xl font-bold text-slate-100">12</p>
          <p className="text-xs text-slate-400 mt-1">3 high priority</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">Overdue</p>
          <p className="text-3xl font-bold text-red-400">5</p>
          <p className="text-xs text-slate-400 mt-1">Requires action</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">In Progress</p>
          <p className="text-3xl font-bold text-blue-400">28</p>
          <p className="text-xs text-slate-400 mt-1">Assigned</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">Completed Today</p>
          <p className="text-3xl font-bold text-green-400">18</p>
          <p className="text-xs text-slate-400 mt-1">Great progress</p>
        </CardContent>
      </Card>
    </div>

    {/* Tasks List */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Tasks</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
            <Button size="sm" onClick={() => toast.success('Task created')}>
              <Plus className="w-4 h-4 mr-1" />
              New Task
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            {
              id: 'TASK-5847',
              title: 'Request building inspection report',
              matter: 'MAT-2024-1247',
              owner: 'Sarah Chen',
              due: '2024-02-16',
              priority: 'high',
              status: 'overdue'
            },
            {
              id: 'TASK-5846',
              title: 'Verify title reference',
              matter: 'MAT-2024-1248',
              owner: 'Mike Johnson',
              due: '2024-02-17',
              priority: 'high',
              status: 'in_progress'
            },
            {
              id: 'TASK-5845',
              title: 'Upload Contract of Sale',
              matter: 'MAT-2024-1249',
              owner: 'Lisa Brown',
              due: '2024-02-18',
              priority: 'medium',
              status: 'in_progress'
            },
            {
              id: 'TASK-5844',
              title: 'Invite vendor lawyer',
              matter: 'MAT-2024-1250',
              owner: 'David Wilson',
              due: '2024-02-19',
              priority: 'medium',
              status: 'todo'
            }
          ].map((task) => (
            <div
              key={task.id}
              className={`p-4 border rounded-lg hover:bg-white/5 cursor-pointer ${
                task.status === 'overdue' ? 'border-l-4 border-l-red-500 bg-red-500/10' : ''
              }`}
              onClick={() => toast.info(`Viewing ${task.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-slate-100">{task.title}</p>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        task.priority === 'high'
                          ? 'bg-red-500/15 text-red-300'
                          : 'bg-amber-500/15 text-amber-300'
                      }`}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-300">
                    <span className="font-mono">{task.matter}</span>
                    <span>•</span>
                    <span>{task.owner}</span>
                    <span>•</span>
                    <span className={task.status === 'overdue' ? 'text-red-400 font-semibold' : ''}>
                      Due: {task.due}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      task.status === 'overdue'
                        ? 'bg-red-500/15 text-red-300'
                        : task.status === 'in_progress'
                        ? 'bg-blue-500/15 text-blue-300'
                        : 'bg-white/5 text-slate-300'
                    }`}
                  >
                    {task.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); toast.success('Task completed'); }}>
                    Complete
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

// ===== DOCUMENTS =====
export const renderDocuments = () => (
  <div className="space-y-6">
    {/* Document Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">Total Documents</p>
          <p className="text-3xl font-bold text-slate-100">284</p>
          <p className="text-xs text-slate-400 mt-1">Across all matters</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">Pending Signature</p>
          <p className="text-3xl font-bold text-amber-400">42</p>
          <p className="text-xs text-slate-400 mt-1">Awaiting parties</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">Signed Today</p>
          <p className="text-3xl font-bold text-green-400">8</p>
          <p className="text-xs text-slate-400 mt-1">Via PEXA</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">Version Conflicts</p>
          <p className="text-3xl font-bold text-red-400">2</p>
          <p className="text-xs text-slate-400 mt-1">Requires review</p>
        </CardContent>
      </Card>
    </div>

    {/* Documents Table */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Document Index</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
            <Button size="sm" onClick={() => toast.success('Document uploaded')}>
              <Upload className="w-4 h-4 mr-1" />
              Upload
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Document Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Matter</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Category</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Version</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">PEXA Link</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Updated</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                {
                  name: 'Contract of Sale',
                  matter: 'MAT-2024-1247',
                  category: 'Contract',
                  version: '2.0',
                  status: 'signed',
                  pexa: 'Linked',
                  updated: '2024-02-14'
                },
                {
                  name: 'Mortgage Document',
                  matter: 'MAT-2024-1248',
                  category: 'Finance',
                  version: '1.0',
                  status: 'pending_signature',
                  pexa: 'Linked',
                  updated: '2024-02-13'
                },
                {
                  name: 'Building Inspection Report',
                  matter: 'MAT-2024-1247',
                  category: 'Condition',
                  version: '1.0',
                  status: 'internal',
                  pexa: 'Not linked',
                  updated: '2024-02-12'
                },
                {
                  name: 'Transfer of Land',
                  matter: 'MAT-2024-1249',
                  category: 'Transfer',
                  version: '1.1',
                  status: 'signed',
                  pexa: 'Linked',
                  updated: '2024-02-11'
                }
              ].map((doc, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-sm font-medium text-slate-100">{doc.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-300">{doc.matter}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-500/15 text-blue-300 text-xs font-semibold rounded">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-100">v{doc.version}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        doc.status === 'signed'
                          ? 'bg-green-500/15 text-green-300'
                          : doc.status === 'pending_signature'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-white/5 text-slate-300'
                      }`}
                    >
                      {doc.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{doc.pexa}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{doc.updated}</td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" variant="ghost" onClick={() => toast.info('View document')}>
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

// ===== CONDITIONS REGISTER =====
export const renderConditions = () => (
  <div className="space-y-6">
    {/* Condition Stats */}
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {[
        { status: 'Not Started', count: 8, color: 'bg-white/5 text-slate-300' },
        { status: 'Evidence Uploaded', count: 12, color: 'bg-blue-500/15 text-blue-300' },
        { status: 'Under Review', count: 5, color: 'bg-purple-500/15 text-purple-300' },
        { status: 'Cleared', count: 42, color: 'bg-green-500/15 text-green-300' },
        { status: 'Rejected', count: 2, color: 'bg-red-500/15 text-red-300' }
      ].map((stat, idx) => (
        <Card key={idx}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-100">{stat.count}</p>
            <p className={`text-xs font-medium mt-1 ${stat.color}`}>{stat.status}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Conditions Table */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Condition Register</CardTitle>
          <Button size="sm" onClick={() => toast.success('Condition added')}>
            <Plus className="w-4 h-4 mr-1" />
            Add Condition
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Condition ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Matter</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Due Date</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                { id: 'COND-5847', description: 'Building inspection satisfactory', matter: 'MAT-2024-1247', owner: 'Sarah Chen', due: '2024-02-16', status: 'cleared' },
                { id: 'COND-5846', description: 'Finance approval obtained', matter: 'MAT-2024-1248', owner: 'Mike Johnson', due: '2024-02-18', status: 'evidence_uploaded' },
                { id: 'COND-5845', description: 'Title search clear', matter: 'MAT-2024-1247', owner: 'Lisa Brown', due: '2024-02-15', status: 'cleared' },
                { id: 'COND-5844', description: 'Pest inspection satisfactory', matter: 'MAT-2024-1249', owner: 'David Wilson', due: '2024-02-19', status: 'not_started' }
              ].map((condition, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-100">{condition.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-100">{condition.description}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-300">{condition.matter}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{condition.owner}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{condition.due}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      condition.status === 'cleared' ? 'bg-green-500/15 text-green-300' :
                      condition.status === 'evidence_uploaded' ? 'bg-blue-500/15 text-blue-300' :
                      'bg-white/5 text-slate-300'
                    }`}>
                      {condition.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" variant="outline" onClick={() => toast.success('Condition cleared')}>
                      Clear
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

// ===== PEXA INTEGRATION =====
export const renderPEXA = () => (
  <div className="space-y-6">
    {/* PEXA Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Active Workspaces</span>
            <Link2 className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">47</p>
          <p className="text-xs text-slate-400 mt-1">Across all matters</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Sync Success Rate</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">99.2%</p>
          <p className="text-xs text-slate-400 mt-1">Last 30 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Field Drift</span>
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">5</p>
          <p className="text-xs text-slate-400 mt-1">Mismatches detected</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Last Sync</span>
            <RefreshCw className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">2 min ago</p>
          <p className="text-xs text-slate-400 mt-1">All systems</p>
        </CardContent>
      </Card>
    </div>

    {/* PEXA Workspaces */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>PEXA Workspaces</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => toast.success('Syncing all...')}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Sync All
            </Button>
            <Button size="sm" onClick={() => toast.success('Workspace created')}>
              <Plus className="w-4 h-4 mr-1" />
              Create Workspace
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Workspace ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Matter</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Property</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Last Sync</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                { workspace: 'WS-2024-5847', matter: 'MAT-2024-1247', property: '45 Collins St', status: 'active', participants: 8, lastSync: '2 min ago' },
                { workspace: 'WS-2024-5846', matter: 'MAT-2024-1248', property: '12 George St', status: 'drift_detected', participants: 6, lastSync: '1 hour ago' },
                { workspace: 'WS-2024-5845', matter: 'MAT-2024-1249', property: '88 Queen St', status: 'ready_to_settle', participants: 7, lastSync: '5 min ago' }
              ].map((ws, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-purple-400">{ws.workspace}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-300">{ws.matter}</td>
                  <td className="px-6 py-4 text-sm text-slate-100">{ws.property}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      ws.status === 'active' ? 'bg-green-500/15 text-green-300' :
                      ws.status === 'drift_detected' ? 'bg-red-500/15 text-red-300' :
                      'bg-blue-500/15 text-blue-300'
                    }`}>
                      {ws.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-100">{ws.participants}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{ws.lastSync}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => toast.success('Syncing...')}>
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.info('Open in PEXA')}>
                        <ExternalLink className="w-4 h-4" />
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

// ===== REPORTS =====
export const renderReports = () => (
  <div className="space-y-6">
    {/* Performance Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">Settlements (30d)</p>
          <p className="text-3xl font-bold text-slate-100">84</p>
          <p className="text-xs text-green-400 mt-1">↑ 12% vs last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">Avg Cycle Time</p>
          <p className="text-3xl font-bold text-slate-100">28d</p>
          <p className="text-xs text-green-400 mt-1">↓ 2 days improvement</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">On-Time Rate</p>
          <p className="text-3xl font-bold text-slate-100">94%</p>
          <p className="text-xs text-slate-400 mt-1">79 of 84</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">Total Value</p>
          <p className="text-3xl font-bold text-slate-100">$42M</p>
          <p className="text-xs text-slate-400 mt-1">Settled value</p>
        </CardContent>
      </Card>
    </div>

    {/* Report Builder */}
    <Card>
      <CardHeader>
        <CardTitle>Custom Report Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Report Type</label>
              <select className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Settlement Summary</option>
                <option>Condition Status</option>
                <option>PEXA Sync Issues</option>
                <option>User Activity</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Date Range</label>
              <select className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Quarter</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Format</label>
              <select className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
          <Button className="w-full" onClick={() => toast.success('Report generated!')}>
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== ADMIN =====
export const renderAdmin = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'NSW Purchase', matters: 124, stages: 8, active: true },
              { name: 'VIC Refinance', matters: 89, stages: 7, active: true },
              { name: 'QLD Purchase with Guarantor', matters: 47, stages: 9, active: true },
              { name: 'SA Off-the-Plan', matters: 23, stages: 10, active: false }
            ].map((template, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-white/5">
                <div className="flex-1">
                  <p className="font-semibold text-slate-100">{template.name}</p>
                  <p className="text-xs text-slate-400">{template.matters} matters • {template.stages} stages</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    template.active ? 'bg-green-500/15 text-green-300' : 'bg-white/5 text-slate-300'
                  }`}>
                    {template.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => toast.info('Edit template')}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-slate-100">Auto PEXA Sync</p>
                <p className="text-xs text-slate-400">Sync every 15 minutes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/10 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium text-slate-100">Email Notifications</p>
                <p className="text-xs text-slate-400">Task reminders and alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/10 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// ===== SETTINGS =====
export const renderSettings = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Firm Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Firm Name</label>
            <input
              type="text"
              defaultValue="Lawson & Partners"
              className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">PEXA Subscriber ID</label>
            <input
              type="text"
              defaultValue="SUB-AU-123456"
              className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Default Settlement Time</label>
            <select className="w-full px-3 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>2:00 PM</option>
              <option>12:00 PM</option>
              <option>3:00 PM</option>
            </select>
          </div>

          <Button onClick={() => toast.success('Settings saved')}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

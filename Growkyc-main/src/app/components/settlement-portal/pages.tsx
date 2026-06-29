import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  FileText,
  DollarSign,
  Building2,
  ArrowRight,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Send,
  Upload,
  Link as LinkIcon,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Shield,
  RefreshCw,
  MoreVertical,
  MessageSquare,
  PlayCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  CheckSquare,
  X,
  ChevronRight,
  Info,
  Zap,
  Target,
  Activity,
  ListChecks
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../../lib/toast';
import {
  AddConditionModal,
  ViewConditionModal,
  CreatePEXAWorkspaceModal,
  AddTaskModal
} from './modals';

// ===== TEST DATA =====

const testMatters = [
  {
    id: 'MAT-2024-1247',
    name: '123 Collins Street Purchase',
    property: '123 Collins Street, Melbourne VIC 3000',
    state: 'VIC',
    type: 'Purchase',
    settlementDate: '2024-03-15',
    settlementTime: '11:00 AM',
    stage: 'Document Prep',
    status: 'on_track',
    riskLevel: 'low',
    pexaWorkspaceId: 'WS-VIC-2024-8847',
    pexaStatus: 'active',
    purchasePrice: 1250000,
    deposit: 125000,
    balance: 1125000,
    borrower: 'John & Sarah Smith',
    vendor: 'Property Investments Pty Ltd',
    lender: 'Commonwealth Bank',
    conditions: { total: 12, cleared: 8, pending: 3, overdue: 1 },
    tasks: { total: 18, completed: 12, inProgress: 4, notStarted: 2 },
    documents: 24,
    lastActivity: '15 min ago'
  },
  {
    id: 'MAT-2024-1246',
    name: '45 George Street Refinance',
    property: '45 George Street, Sydney NSW 2000',
    state: 'NSW',
    type: 'Refinance',
    settlementDate: '2024-03-20',
    settlementTime: '10:30 AM',
    stage: 'Conditions',
    status: 'at_risk',
    riskLevel: 'medium',
    pexaWorkspaceId: 'WS-NSW-2024-9124',
    pexaStatus: 'pending',
    loanAmount: 850000,
    borrower: 'Michael Chen',
    outgoingLender: 'Westpac',
    incomingLender: 'ANZ Bank',
    conditions: { total: 8, cleared: 4, pending: 3, overdue: 1 },
    tasks: { total: 14, completed: 8, inProgress: 5, notStarted: 1 },
    documents: 18,
    lastActivity: '2 hours ago'
  },
  {
    id: 'MAT-2024-1245',
    name: '78 Queen Street Sale',
    property: '78 Queen Street, Brisbane QLD 4000',
    state: 'QLD',
    type: 'Sale',
    settlementDate: '2024-03-10',
    settlementTime: '2:00 PM',
    stage: 'Pre-Settlement',
    status: 'on_track',
    riskLevel: 'low',
    pexaWorkspaceId: 'WS-QLD-2024-7456',
    pexaStatus: 'ready_to_settle',
    salePrice: 680000,
    vendor: 'Emma Wilson',
    purchaser: 'Investment Group Ltd',
    conditions: { total: 6, cleared: 6, pending: 0, overdue: 0 },
    tasks: { total: 10, completed: 9, inProgress: 1, notStarted: 0 },
    documents: 15,
    lastActivity: '30 min ago'
  },
  {
    id: 'MAT-2024-1244',
    name: '12 King William Road Purchase',
    property: '12 King William Road, Adelaide SA 5000',
    state: 'SA',
    type: 'Purchase',
    settlementDate: '2024-03-25',
    settlementTime: '11:30 AM',
    stage: 'Intake',
    status: 'blocked',
    riskLevel: 'high',
    pexaWorkspaceId: null,
    pexaStatus: 'not_created',
    purchasePrice: 520000,
    deposit: 52000,
    borrower: 'David & Lisa Martinez',
    vendor: 'Estate of John Brown',
    lender: 'NAB',
    conditions: { total: 15, cleared: 2, pending: 8, overdue: 5 },
    tasks: { total: 22, completed: 4, inProgress: 6, notStarted: 12 },
    documents: 8,
    lastActivity: '1 day ago'
  },
  {
    id: 'MAT-2024-1243',
    name: '156 St Georges Terrace Off-The-Plan',
    property: '156 St Georges Terrace, Perth WA 6000',
    state: 'WA',
    type: 'Off-The-Plan',
    settlementDate: '2024-04-15',
    settlementTime: '10:00 AM',
    stage: 'Verification',
    status: 'on_track',
    riskLevel: 'low',
    pexaWorkspaceId: 'WS-WA-2024-6234',
    pexaStatus: 'active',
    purchasePrice: 950000,
    deposit: 95000,
    borrower: 'Sophie & James Anderson',
    vendor: 'Capital Developments Pty Ltd',
    lender: 'Bankwest',
    conditions: { total: 18, cleared: 6, pending: 10, overdue: 2 },
    tasks: { total: 25, completed: 8, inProgress: 7, notStarted: 10 },
    documents: 12,
    lastActivity: '3 hours ago'
  }
];

// ===== INTERNAL DASHBOARD =====
export const renderInternalDashboard = (onMatterClick: (id: string) => void) => (
  <div className="space-y-6">
    {/* Key Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Settlements This Week</span>
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">12</p>
          <p className="text-xs text-slate-400 mt-1">3 today, 9 upcoming</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Overdue Conditions</span>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-400">9</p>
          <p className="text-xs text-slate-400 mt-1">Requires attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Active PEXA Workspaces</span>
            <Building2 className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">28</p>
          <p className="text-xs text-green-400 mt-1">4 ready to settle</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Risk Alerts</span>
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-slate-100">5</p>
          <p className="text-xs text-slate-400 mt-1">2 high priority</p>
        </CardContent>
      </Card>
    </div>

    {/* Matters by Stage */}
    <Card>
      <CardHeader>
        <CardTitle>Matters by Stage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-9 gap-3">
          {[
            { stage: 'Intake', count: 8, color: 'bg-white/5' },
            { stage: 'Verification', count: 12, color: 'bg-blue-500/15' },
            { stage: 'Conditions', count: 15, color: 'bg-purple-500/15' },
            { stage: 'Doc Prep', count: 18, color: 'bg-amber-500/15' },
            { stage: 'Signing', count: 10, color: 'bg-teal-500/15' },
            { stage: 'Pre-Settlement', count: 6, color: 'bg-green-500/15' },
            { stage: 'Settlement', count: 3, color: 'bg-emerald-500/15' },
            { stage: 'Post-Settlement', count: 4, color: 'bg-indigo-500/15' },
            { stage: 'Archive', count: 142, color: 'bg-white/5' }
          ].map((item, idx) => (
            <div key={idx} className={`${item.color} p-4 rounded-lg text-center cursor-pointer hover:shadow-md transition-shadow`} onClick={() => toast.info(`${item.count} matters in ${item.stage}`)}>
              <p className="text-2xl font-bold text-slate-100">{item.count}</p>
              <p className="text-xs text-slate-300 mt-1">{item.stage}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Recent Matters */}
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Matters</CardTitle>
          <Button size="sm" onClick={() => toast.success('Create new matter')}>
            <Plus className="w-4 h-4 mr-1" />
            New Matter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {testMatters.slice(0, 3).map((matter) => (
            <div key={matter.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-white/5 cursor-pointer" onClick={() => onMatterClick(matter.id)}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-slate-100">{matter.name}</p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    matter.status === 'on_track' ? 'bg-green-500/15 text-green-300' :
                    matter.status === 'at_risk' ? 'bg-amber-500/15 text-amber-300' :
                    'bg-red-500/15 text-red-300'
                  }`}>
                    {matter.stage}
                  </span>
                  <span className="px-2 py-1 bg-white/5 text-slate-300 text-xs font-semibold rounded">
                    {matter.state}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {matter.property}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {matter.settlementDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckSquare className="w-4 h-4" />
                    {matter.conditions.cleared}/{matter.conditions.total} cleared
                  </span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Risk Alerts */}
    <Card>
      <CardHeader>
        <CardTitle>Risk Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { matter: 'MAT-2024-1244', property: '12 King William Road', risk: 'Missing VOI', severity: 'high', age: '5 days' },
            { matter: 'MAT-2024-1246', property: '45 George Street', risk: 'PEXA drift detected', severity: 'medium', age: '2 days' },
            { matter: 'MAT-2024-1243', property: '156 St Georges Terrace', risk: 'Expired ID document', severity: 'medium', age: '3 days' }
          ].map((alert, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border-l-4 border-red-500 bg-red-500/10 rounded">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-mono text-sm font-semibold text-slate-100">{alert.matter}</p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    alert.severity === 'high' ? 'bg-red-600 text-white' : 'bg-amber-500/15 text-amber-300'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-slate-100">{alert.risk}</p>
                <p className="text-xs text-slate-300">{alert.property} • Aging: {alert.age}</p>
              </div>
              <Button size="sm" onClick={() => toast.info('Review alert')}>
                Review
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== EXTERNAL DASHBOARD =====
export const renderExternalDashboard = (onMatterClick: (id: string) => void) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Your Matters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {testMatters.slice(0, 2).map((matter) => (
            <div key={matter.id} className="p-4 border rounded-lg hover:bg-white/5 cursor-pointer" onClick={() => onMatterClick(matter.id)}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-100 mb-1">{matter.name}</p>
                  <p className="text-sm text-slate-300">{matter.property}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded ${
                  matter.status === 'on_track' ? 'bg-green-500/15 text-green-300' :
                  matter.status === 'at_risk' ? 'bg-amber-500/15 text-amber-300' :
                  'bg-red-500/15 text-red-300'
                }`}>
                  {matter.stage}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Settlement: {matter.settlementDate}</span>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Next Actions Required</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <div className="flex-1">
              <p className="font-medium text-slate-100">Upload signed Contract of Sale</p>
              <p className="text-sm text-slate-300">123 Collins Street Purchase • Due today</p>
            </div>
            <Button size="sm">Upload</Button>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <Info className="w-5 h-5 text-blue-400" />
            <div className="flex-1">
              <p className="font-medium text-slate-100">Review settlement statement</p>
              <p className="text-sm text-slate-300">45 George Street Refinance • Due in 2 days</p>
            </div>
            <Button size="sm" variant="outline">View</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// ===== MATTERS PAGE =====
export const renderMatters = (onMatterClick: (id: string) => void) => (
  <div className="space-y-6">
    {/* Filters */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search matters..."
            className="pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-3 py-2 border border-white/10 rounded-lg text-sm">
          <option>All States</option>
          <option>NSW</option>
          <option>VIC</option>
          <option>QLD</option>
          <option>SA</option>
          <option>WA</option>
          <option>ACT</option>
          <option>TAS</option>
          <option>NT</option>
        </select>
        <select className="px-3 py-2 border border-white/10 rounded-lg text-sm">
          <option>All Types</option>
          <option>Purchase</option>
          <option>Sale</option>
          <option>Refinance</option>
          <option>Off-The-Plan</option>
        </select>
        <Button size="sm" variant="outline">
          <Filter className="w-4 h-4 mr-1" />
          More Filters
        </Button>
      </div>
      <Button onClick={() => toast.success('Create new matter')}>
        <Plus className="w-4 h-4 mr-2" />
        New Matter
      </Button>
    </div>

    {/* Matters Grid */}
    <div className="grid grid-cols-1 gap-4">
      {testMatters.map((matter) => (
        <Card key={matter.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onMatterClick(matter.id)}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-100">{matter.name}</h3>
                  <span className="px-2 py-1 bg-white/5 text-slate-300 text-xs font-semibold rounded">
                    {matter.state}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    matter.status === 'on_track' ? 'bg-green-500/15 text-green-300' :
                    matter.status === 'at_risk' ? 'bg-amber-500/15 text-amber-300' :
                    'bg-red-500/15 text-red-300'
                  }`}>
                    {matter.stage}
                  </span>
                  {matter.pexaWorkspaceId && (
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs font-semibold rounded flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {matter.pexaWorkspaceId}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 mb-3 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {matter.property}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Settlement</p>
                    <p className="text-sm font-semibold text-slate-100">{matter.settlementDate}</p>
                    <p className="text-xs text-slate-300">{matter.settlementTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Type</p>
                    <p className="text-sm font-semibold text-slate-100">{matter.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Borrower/Vendor</p>
                    <p className="text-sm font-semibold text-slate-100">{matter.borrower || matter.vendor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Lender</p>
                    <p className="text-sm font-semibold text-slate-100">{matter.lender || matter.incomingLender || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-slate-300">
                    Conditions: <span className="font-semibold">{matter.conditions.cleared}/{matter.conditions.total}</span>
                    {matter.conditions.overdue > 0 && (
                      <span className="ml-1 text-red-400">({matter.conditions.overdue} overdue)</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-slate-300">
                    Tasks: <span className="font-semibold">{matter.tasks.completed}/{matter.tasks.total}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-slate-300">
                    Documents: <span className="font-semibold">{matter.documents}</span>
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// Continue with remaining pages in next file...

// ===== MATTER DETAIL PAGE =====
export const renderMatterDetail = (matterId: string, onBack: () => void, onNavigate?: (page: string) => void) => {
  const matter = testMatters.find(m => m.id === matterId);
  if (!matter) return <div>Matter not found</div>;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack}>
        ← Back to Matters
      </Button>

      {/* Matter Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-100">{matter.name}</h1>
                <span className="px-3 py-1 bg-white/5 text-slate-300 text-sm font-semibold rounded">
                  {matter.state}
                </span>
                <span className={`px-3 py-1 text-sm font-semibold rounded ${
                  matter.status === 'on_track' ? 'bg-green-500/15 text-green-300' :
                  matter.status === 'at_risk' ? 'bg-amber-500/15 text-amber-300' :
                  'bg-red-500/15 text-red-300'
                }`}>
                  {matter.stage}
                </span>
                {matter.pexaWorkspaceId && (
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-300 text-sm font-semibold rounded flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {matter.pexaWorkspaceId}
                  </span>
                )}
              </div>
              <p className="text-slate-300 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {matter.property}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Settlement Date</p>
                  <p className="font-semibold text-slate-100">{matter.settlementDate}</p>
                  <p className="text-sm text-slate-300">{matter.settlementTime}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Transaction Type</p>
                  <p className="font-semibold text-slate-100">{matter.type}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Risk Level</p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    matter.riskLevel === 'low' ? 'bg-green-500/15 text-green-300' :
                    matter.riskLevel === 'medium' ? 'bg-amber-500/15 text-amber-300' :
                    'bg-red-500/15 text-red-300'
                  }`}>
                    {matter.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">PEXA Status</p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    matter.pexaStatus === 'ready_to_settle' ? 'bg-green-500/15 text-green-300' :
                    matter.pexaStatus === 'active' ? 'bg-blue-500/15 text-blue-300' :
                    matter.pexaStatus === 'pending' ? 'bg-amber-500/15 text-amber-300' :
                    'bg-white/5 text-slate-300'
                  }`}>
                    {matter.pexaStatus?.replace('_', ' ').toUpperCase() || 'NOT CREATED'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.info('Invite participant')}>
                <Users className="w-4 h-4 mr-1" />
                Invite
              </Button>
              <Button size="sm" variant="outline" onClick={() => toast.info('Create PEXA workspace')}>
                <Building2 className="w-4 h-4 mr-1" />
                PEXA
              </Button>
              <Button size="sm" onClick={() => toast.success('Document generated')}>
                <FileText className="w-4 h-4 mr-1" />
                Generate Doc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {[
              { name: 'Intake', status: 'complete' },
              { name: 'Verification', status: 'complete' },
              { name: 'Conditions', status: 'complete' },
              { name: 'Doc Prep', status: 'active' },
              { name: 'Signing', status: 'pending' },
              { name: 'Pre-Settlement', status: 'pending' },
              { name: 'Settlement', status: 'pending' },
              { name: 'Post-Settlement', status: 'pending' }
            ].map((stage, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  stage.status === 'complete' ? 'bg-green-500' :
                  stage.status === 'active' ? 'bg-blue-500' :
                  'bg-white/10'
                }`}>
                  {stage.status === 'complete' ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : stage.status === 'active' ? (
                    <PlayCircle className="w-6 h-6 text-white" />
                  ) : (
                    <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  )}
                </div>
                <p className="text-xs font-medium text-slate-300 mt-2 text-center">{stage.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate?.('conditions')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <ListChecks className="w-8 h-8 text-purple-400" />
              <span className="text-3xl font-bold text-slate-100">{matter.conditions.total}</span>
            </div>
            <h3 className="font-semibold text-slate-100 mb-2">Conditions</h3>
            <div className="space-y-1 text-sm">
              <p className="text-green-400">✓ {matter.conditions.cleared} Cleared</p>
              <p className="text-amber-400">⏳ {matter.conditions.pending} Pending</p>
              <p className="text-red-400">⚠ {matter.conditions.overdue} Overdue</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate?.('documents')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold text-slate-100">{matter.documents}</span>
            </div>
            <h3 className="font-semibold text-slate-100 mb-2">Documents</h3>
            <p className="text-sm text-slate-300">12 signed, 6 pending, 6 draft</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate?.('tasks')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckSquare className="w-8 h-8 text-green-400" />
              <span className="text-3xl font-bold text-slate-100">{matter.tasks.total}</span>
            </div>
            <h3 className="font-semibold text-slate-100 mb-2">Tasks</h3>
            <div className="space-y-1 text-sm">
              <p className="text-green-400">✓ {matter.tasks.completed} Completed</p>
              <p className="text-blue-400">→ {matter.tasks.inProgress} In Progress</p>
              <p className="text-slate-300">○ {matter.tasks.notStarted} Not Started</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participants */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Participants</CardTitle>
            <Button size="sm" onClick={() => toast.success('Invite sent')}>
              <Plus className="w-4 h-4 mr-1" />
              Invite Participant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: matter.borrower || matter.vendor, role: 'Borrower', party: 'Purchaser', access: 'Limited', status: 'Active', lastActive: '2 hours ago' },
              { name: 'Sarah Chen', role: 'Borrower Lawyer', party: 'Purchaser', access: 'Full', status: 'Active', lastActive: '15 min ago' },
              { name: matter.vendor || matter.purchaser, role: 'Vendor', party: 'Vendor', access: 'Limited', status: 'Active', lastActive: '1 day ago' },
              { name: 'Michael Johnson', role: 'Vendor Lawyer', party: 'Vendor', access: 'Full', status: 'Active', lastActive: '3 hours ago' },
              { name: matter.lender || matter.incomingLender, role: 'Lender', party: 'Financier', access: 'View Only', status: 'Active', lastActive: '1 hour ago' }
            ].map((participant, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-white/5">
                <div className="flex-1">
                  <p className="font-semibold text-slate-100">{participant.name}</p>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <span>{participant.role}</span>
                    <span>•</span>
                    <span>{participant.party}</span>
                    <span>•</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded">{participant.access}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-green-500/15 text-green-300 text-xs font-semibold rounded">
                    {participant.status}
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{participant.lastActive}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      {matter.purchasePrice && (
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-slate-400 mb-1">Purchase Price</p>
                <p className="text-2xl font-bold text-slate-100">${matter.purchasePrice.toLocaleString()}</p>
              </div>
              {matter.deposit && (
                <div>
                  <p className="text-sm text-slate-400 mb-1">Deposit Paid</p>
                  <p className="text-2xl font-bold text-green-300">${matter.deposit.toLocaleString()}</p>
                </div>
              )}
              {matter.balance && (
                <div>
                  <p className="text-sm text-slate-400 mb-1">Balance Due</p>
                  <p className="text-2xl font-bold text-blue-300">${matter.balance.toLocaleString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ===== TASKS PAGE =====
export const renderTasks = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-100">Tasks</h2>
      <Button onClick={() => toast.success('Task created')}>
        <Plus className="w-4 h-4 mr-2" />
        New Task
      </Button>
    </div>

    {/* Kanban View */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { status: 'To Do', count: 12, color: 'border-white/10' },
        { status: 'In Progress', count: 8, color: 'border-blue-500' },
        { status: 'Blocked', count: 3, color: 'border-red-500' },
        { status: 'Complete', count: 45, color: 'border-green-500' }
      ].map((column, idx) => (
        <Card key={idx} className={`border-t-4 ${column.color}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{column.status}</CardTitle>
              <span className="px-2 py-1 bg-white/5 text-slate-300 text-xs font-semibold rounded">
                {column.count}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(Math.min(column.count, 3))].map((_, taskIdx) => (
                <div key={taskIdx} className="p-3 bg-white border rounded-lg hover:shadow-md cursor-pointer transition-shadow" onClick={() => toast.info('View task')}>
                  <p className="font-semibold text-sm text-slate-100 mb-1">
                    {taskIdx === 0 && column.status === 'To Do' ? 'Verify ID documents' :
                     taskIdx === 1 && column.status === 'To Do' ? 'Obtain contract signed' :
                     taskIdx === 0 && column.status === 'In Progress' ? 'Review PEXA workspace' :
                     taskIdx === 1 && column.status === 'In Progress' ? 'Prepare settlement statement' :
                     taskIdx === 0 && column.status === 'Blocked' ? 'Missing VOI - escalated' :
                     'Complete task'}
                  </p>
                  <p className="text-xs text-slate-300 mb-2">MAT-2024-{1247 - taskIdx}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Due: 2024-03-{15 + taskIdx}</span>
                    <div className="w-6 h-6 bg-blue-500/15 rounded-full flex items-center justify-center text-xs font-semibold text-blue-300">
                      SC
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// ===== DOCUMENTS PAGE =====
export const renderDocuments = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-100">Documents</h2>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-1" />
          Filter
        </Button>
        <Button onClick={() => toast.success('Document uploaded')}>
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>
    </div>

    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Document</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Matter</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Category</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Visibility</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Updated</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                { name: 'Contract of Sale - Signed.pdf', matter: 'MAT-2024-1247', category: 'Contract', status: 'signed', visibility: 'Shared', updated: '2 hours ago' },
                { name: 'Transfer of Land.pdf', matter: 'MAT-2024-1247', category: 'Transfer', status: 'draft', visibility: 'Internal', updated: '5 hours ago' },
                { name: 'Mortgage Document.pdf', matter: 'MAT-2024-1246', category: 'Mortgage', status: 'pending_signature', visibility: 'Lender Viewable', updated: '1 day ago' },
                { name: 'Discharge Authority.pdf', matter: 'MAT-2024-1246', category: 'Discharge', status: 'signed', visibility: 'Shared', updated: '2 days ago' },
                { name: 'Settlement Statement.pdf', matter: 'MAT-2024-1245', category: 'Settlement', status: 'final', visibility: 'Borrower Viewable', updated: '3 hours ago' }
              ].map((doc, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-slate-100">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">{doc.matter}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs font-semibold rounded">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      doc.status === 'signed' ? 'bg-green-500/15 text-green-300' :
                      doc.status === 'final' ? 'bg-purple-500/15 text-purple-300' :
                      doc.status === 'pending_signature' ? 'bg-amber-500/15 text-amber-300' :
                      'bg-white/5 text-slate-300'
                    }`}>
                      {doc.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{doc.visibility}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{doc.updated}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => toast.info('View document')}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.info('Download document')}>
                        <Download className="w-4 h-4" />
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

// ===== CONDITIONS PAGE =====
export const renderConditions = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-100">Condition Register</h2>
      <Button onClick={() => toast.success('Condition added')}>
        <Plus className="w-4 h-4 mr-2" />
        Add Condition
      </Button>
    </div>

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
            <p className={`text-xs font-medium mt-1 px-2 py-1 rounded ${stat.color}`}>{stat.status}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Matter</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Due Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {[
                { id: 'COND-1247-01', desc: 'Contract signed by all parties', matter: 'MAT-2024-1247', status: 'cleared', owner: 'Sarah Chen', due: '2024-03-10', evidence: 'Yes' },
                { id: 'COND-1247-02', desc: 'Pest and building inspection', matter: 'MAT-2024-1247', status: 'evidence_uploaded', owner: 'John Smith', due: '2024-03-12', evidence: 'Yes' },
                { id: 'COND-1246-01', desc: 'VOI for all borrowers', matter: 'MAT-2024-1246', status: 'rejected', owner: 'Lisa Wong', due: '2024-03-08', evidence: 'No' },
                { id: 'COND-1245-01', desc: 'Finance approval', matter: 'MAT-2024-1245', status: 'cleared', owner: 'Mike Johnson', due: '2024-03-05', evidence: 'Yes' },
                { id: 'COND-1244-01', desc: 'Title search', matter: 'MAT-2024-1244', status: 'escalated', owner: 'Emma Davis', due: '2024-03-01', evidence: 'No' }
              ].map((condition, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-100">{condition.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-100">{condition.desc}</td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">{condition.matter}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      condition.status === 'cleared' ? 'bg-green-500/15 text-green-300' :
                      condition.status === 'evidence_uploaded' ? 'bg-blue-500/15 text-blue-300' :
                      condition.status === 'rejected' ? 'bg-red-500/15 text-red-300' :
                      'bg-amber-500/15 text-amber-300'
                    }`}>
                      {condition.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{condition.owner}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{condition.due}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => toast.info('View condition')}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {condition.status !== 'cleared' && (
                        <Button size="sm" onClick={() => toast.success('Condition cleared')}>
                          Clear
                        </Button>
                      )}
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

// ===== PEXA PAGE =====
export const renderPEXA = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-100">PEXA Workspaces</h2>
      <Button onClick={() => toast.success('PEXA workspace created')}>
        <Plus className="w-4 h-4 mr-2" />
        Create Workspace
      </Button>
    </div>

    {/* PEXA Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">Active Workspaces</p>
          <p className="text-3xl font-bold text-slate-100">28</p>
          <p className="text-xs text-slate-400 mt-1">Across 5 states</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">Ready to Settle</p>
          <p className="text-3xl font-bold text-green-400">4</p>
          <p className="text-xs text-slate-400 mt-1">All conditions met</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">Drift Warnings</p>
          <p className="text-3xl font-bold text-amber-400">3</p>
          <p className="text-xs text-slate-400 mt-1">Data mismatch</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-slate-300 mb-2">Settled Today</p>
          <p className="text-3xl font-bold text-blue-400">2</p>
          <p className="text-xs text-slate-400 mt-1">Total: $2.1M</p>
        </CardContent>
      </Card>
    </div>

    {/* Workspace List */}
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Workspace ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Matter</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Property</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Last Sync</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {testMatters.filter(m => m.pexaWorkspaceId).map((matter, idx) => (
                <tr key={idx} className="hover:bg-white/5">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-blue-300">{matter.pexaWorkspaceId}</td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-300">{matter.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-100">{matter.property}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      matter.pexaStatus === 'ready_to_settle' ? 'bg-green-500/15 text-green-300' :
                      matter.pexaStatus === 'active' ? 'bg-blue-500/15 text-blue-300' :
                      'bg-amber-500/15 text-amber-300'
                    }`}>
                      {matter.pexaStatus?.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{matter.lastActivity}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => toast.success('Synced with PEXA')}>
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toast.info('Open PEXA')}>
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

// ===== REPORTS PAGE =====
export const renderReports = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-100">Reports & Analytics</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { title: 'Settlement Cycle Time', desc: 'Average time by state', icon: Clock },
        { title: 'Matters by Stage', desc: 'Workflow distribution', icon: Activity },
        { title: 'Risk Analysis', desc: 'By matter type', icon: Shield },
        { title: 'Condition Ageing', desc: 'Overdue analysis', icon: AlertTriangle },
        { title: 'PEXA Sync Issues', desc: 'Drift reports', icon: Building2 },
        { title: 'User Activity', desc: 'Audit logs', icon: Users }
      ].map((report, idx) => {
        const Icon = report.icon;
        return (
          <Card key={idx} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toast.success(`Generating ${report.title}...`)}>
            <CardContent className="p-6">
              <Icon className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="font-bold text-slate-100 mb-1">{report.title}</h3>
              <p className="text-sm text-slate-300">{report.desc}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);

// ===== ADMIN PAGE =====
export const renderAdmin = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-100">Admin Settings</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              'NSW Purchase',
              'VIC Refinance',
              'QLD Purchase with Guarantor',
              'SA Off-The-Plan',
              'WA Refinance',
              'ACT Purchase',
              'TAS Transfer',
              'NT Refinance'
            ].map((template, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-white/5">
                <span className="text-sm font-medium text-slate-100">{template}</span>
                <Button size="sm" variant="outline" onClick={() => toast.info(`Edit ${template}`)}>
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button className="w-full" onClick={() => toast.success('User invited')}>
              <Plus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
            <Button variant="outline" className="w-full" onClick={() => toast.info('View all users')}>
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="w-full" onClick={() => toast.info('View audit log')}>
              <Activity className="w-4 h-4 mr-2" />
              Audit Log
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
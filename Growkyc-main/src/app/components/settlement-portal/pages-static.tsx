import React from 'react';
import {
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  Users,
  FileText,
  Building2,
  ArrowRight,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Upload,
  ExternalLink,
  Shield,
  AlertTriangle,
  CheckSquare,
  PlayCircle,
  ListChecks,
  Clock,
  Activity
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from '../../lib/toast';

// Test data (exported so other files can use it)
export const testMatters = [
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

// Simple render functions
export const renderInternalDashboard = (onMatterClick: (id: string) => void) => (
  <div className="space-y-6">
    {/* Key Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Settlements This Week</span>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-500 mt-1">3 today, 9 upcoming</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Overdue Conditions</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">9</p>
          <p className="text-xs text-gray-500 mt-1">Requires attention</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active PEXA Workspaces</span>
            <Building2 className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">28</p>
          <p className="text-xs text-green-600 mt-1">4 ready to settle</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Risk Alerts</span>
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">5</p>
          <p className="text-xs text-gray-500 mt-1">2 high priority</p>
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
            { stage: 'Intake', count: 8, color: 'bg-gray-100' },
            { stage: 'Verification', count: 12, color: 'bg-blue-100' },
            { stage: 'Conditions', count: 15, color: 'bg-purple-100' },
            { stage: 'Doc Prep', count: 18, color: 'bg-amber-100' },
            { stage: 'Signing', count: 10, color: 'bg-teal-100' },
            { stage: 'Pre-Settlement', count: 6, color: 'bg-green-100' },
            { stage: 'Settlement', count: 3, color: 'bg-emerald-100' },
            { stage: 'Post-Settlement', count: 4, color: 'bg-indigo-100' },
            { stage: 'Archive', count: 142, color: 'bg-gray-50' }
          ].map((item, idx) => (
            <div key={idx} className={`${item.color} p-4 rounded-lg text-center cursor-pointer hover:shadow-md transition-shadow`} onClick={() => toast.info(`${item.count} matters in ${item.stage}`)}>
              <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              <p className="text-xs text-gray-600 mt-1">{item.stage}</p>
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
            <div key={matter.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => onMatterClick(matter.id)}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-semibold text-gray-900">{matter.name}</p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    matter.status === 'on_track' ? 'bg-green-100 text-green-700' :
                    matter.status === 'at_risk' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {matter.stage}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                    {matter.state}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
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
            <div key={idx} className="flex items-center justify-between p-3 border-l-4 border-red-500 bg-red-50 rounded">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-mono text-sm font-semibold text-gray-900">{alert.matter}</p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    alert.severity === 'high' ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-900">{alert.risk}</p>
                <p className="text-xs text-gray-600">{alert.property} • Aging: {alert.age}</p>
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

export const renderExternalDashboard = (onMatterClick: (id: string) => void) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Your Matters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {testMatters.slice(0, 2).map((matter) => (
            <div key={matter.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => onMatterClick(matter.id)}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{matter.name}</p>
                  <p className="text-sm text-gray-600">{matter.property}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded ${
                  matter.status === 'on_track' ? 'bg-green-100 text-green-700' :
                  matter.status === 'at_risk' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {matter.stage}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Settlement: {matter.settlementDate}</span>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export const renderMatters = (onMatterClick: (id: string) => void) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search matters..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <Button onClick={() => toast.success('Create new matter')}>
        <Plus className="w-4 h-4 mr-2" />
        New Matter
      </Button>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {testMatters.map((matter) => (
        <Card key={matter.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onMatterClick(matter.id)}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{matter.name}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">{matter.state}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    matter.status === 'on_track' ? 'bg-green-100 text-green-700' :
                    matter.status === 'at_risk' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>{matter.stage}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {matter.property}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export const renderMatterDetail = (matterId: string, onBack: () => void, onNavigate?: (page: string) => void) => {
  const matter = testMatters.find(m => m.id === matterId);
  if (!matter) return <div>Matter not found</div>;

  // PEXA Workspace data with tasks for all parties
  const pexaData = {
    workspaceId: matter.pexaWorkspaceId,
    status: matter.pexaStatus,
    lastSync: matter.lastActivity,
    participants: [
      { 
        name: 'Sarah Chen (Purchaser Lawyer)', 
        role: 'Subscriber - Purchaser', 
        firm: 'Smith & Associates Legal',
        status: 'Accepted',
        email: 'sarah.chen@smithlaw.com.au',
        phone: '03 9123 4567'
      },
      { 
        name: 'Michael Johnson (Vendor Lawyer)', 
        role: 'Subscriber - Vendor', 
        firm: 'Melbourne Property Law',
        status: 'Accepted',
        email: 'm.johnson@mpllaw.com.au',
        phone: '03 9234 5678'
      },
      { 
        name: 'Commonwealth Bank', 
        role: 'Financial Institution',
        firm: 'CBA',
        status: 'Pending',
        email: 'settlements@cba.com.au',
        phone: '1300 123 456'
      },
      { 
        name: 'John & Sarah Smith', 
        role: 'Purchaser Party',
        firm: 'N/A',
        status: 'Invited',
        email: 'john.smith@email.com',
        phone: '0412 345 678'
      }
    ],
    financialData: {
      purchasePrice: matter.purchasePrice || 0,
      deposit: matter.deposit || 0,
      balance: matter.balance || 0,
      adjustments: 15430,
      netAmount: (matter.balance || 0) - 15430
    },
    partyActions: [
      {
        id: 'PA-001',
        party: 'Purchaser Lawyer (Sarah Chen)',
        action: 'Upload signed Transfer of Land to PEXA',
        status: 'pending',
        dueDate: '2024-03-12',
        priority: 'high',
        category: 'Document'
      },
      {
        id: 'PA-002',
        party: 'Vendor Lawyer (Michael Johnson)',
        action: 'Verify vendor identity documents',
        status: 'in_progress',
        dueDate: '2024-03-11',
        priority: 'high',
        category: 'Verification'
      },
      {
        id: 'PA-003',
        party: 'Commonwealth Bank',
        action: 'Approve loan documentation',
        status: 'pending',
        dueDate: '2024-03-13',
        priority: 'critical',
        category: 'Finance'
      },
      {
        id: 'PA-004',
        party: 'Purchaser (John & Sarah Smith)',
        action: 'Review and sign Contract of Sale',
        status: 'completed',
        dueDate: '2024-03-08',
        priority: 'high',
        category: 'Signing'
      },
      {
        id: 'PA-005',
        party: 'Vendor Lawyer (Michael Johnson)',
        action: 'Prepare settlement statement',
        status: 'pending',
        dueDate: '2024-03-14',
        priority: 'medium',
        category: 'Financial'
      },
      {
        id: 'PA-006',
        party: 'Purchaser Lawyer (Sarah Chen)',
        action: 'Lodge caveat removal',
        status: 'not_started',
        dueDate: '2024-03-14',
        priority: 'medium',
        category: 'Lodgement'
      }
    ],
    pexaMessages: [
      { time: '2 hours ago', from: 'PEXA System', message: 'Workspace status updated to Active', type: 'system' },
      { time: '5 hours ago', from: 'Sarah Chen', message: 'Contract documents uploaded', type: 'user' },
      { time: '1 day ago', from: 'Michael Johnson', message: 'Workspace invitation accepted', type: 'user' },
      { time: '1 day ago', from: 'PEXA System', message: 'Workspace created successfully', type: 'system' }
    ]
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack}>← Back to Matters</Button>

      {/* Matter Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{matter.name}</h1>
              <p className="text-gray-600 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {matter.property}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Settlement: {matter.settlementDate} at {matter.settlementTime}</span>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded ${
                  matter.status === 'on_track' ? 'bg-green-100 text-green-700' :
                  matter.status === 'at_risk' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {matter.stage}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Matter ID</p>
              <p className="font-mono font-bold text-gray-900">{matter.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PEXA Workspace Section */}
      {matter.pexaWorkspaceId && (
        <Card>
          <CardHeader className="bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-700" />
                <div>
                  <CardTitle className="text-blue-900">PEXA Workspace</CardTitle>
                  <p className="text-sm text-blue-700 font-mono mt-1">{pexaData.workspaceId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-semibold rounded ${
                  pexaData.status === 'ready_to_settle' ? 'bg-green-100 text-green-700' :
                  pexaData.status === 'active' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {pexaData.status?.replace('_', ' ').toUpperCase()}
                </span>
                <Button size="sm" onClick={() => toast.success('Syncing with PEXA...')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Sync Now
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            
            {/* Financial Data */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-700" />
                Financial Settlement Data
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Purchase Price</p>
                  <p className="text-lg font-bold text-gray-900">${pexaData.financialData.purchasePrice.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Deposit Paid</p>
                  <p className="text-lg font-bold text-green-700">${pexaData.financialData.deposit.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Balance Due</p>
                  <p className="text-lg font-bold text-blue-700">${pexaData.financialData.balance.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Adjustments</p>
                  <p className="text-lg font-bold text-purple-700">${pexaData.financialData.adjustments.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                  <p className="text-xs text-blue-700 mb-1">Net Settlement</p>
                  <p className="text-lg font-bold text-blue-900">${pexaData.financialData.netAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Workspace Participants */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-700" />
                Workspace Participants ({pexaData.participants.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pexaData.participants.map((participant, idx) => (
                  <div key={idx} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{participant.name}</p>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                          participant.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                          participant.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {participant.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{participant.role}</p>
                      <p className="text-xs text-gray-500 mt-1">{participant.firm}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                        <span>{participant.email}</span>
                        <span>•</span>
                        <span>{participant.phone}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => toast.info(`Sending notification to ${participant.name}`)}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Party Actions & Tasks */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-gray-700" />
                  Party Actions & Tasks ({pexaData.partyActions.length})
                </h3>
                <Button size="sm" onClick={() => toast.success('Creating new party action...')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Action
                </Button>
              </div>
              <div className="space-y-2">
                {pexaData.partyActions.map((action) => (
                  <div key={action.id} className={`p-4 border-l-4 rounded-lg ${
                    action.status === 'completed' ? 'bg-green-50 border-green-500' :
                    action.status === 'in_progress' ? 'bg-blue-50 border-blue-500' :
                    action.status === 'pending' && action.priority === 'critical' ? 'bg-red-50 border-red-500' :
                    action.status === 'pending' && action.priority === 'high' ? 'bg-amber-50 border-amber-500' :
                    'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                            action.priority === 'critical' ? 'bg-red-600 text-white' :
                            action.priority === 'high' ? 'bg-amber-600 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {action.priority.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 text-xs font-semibold bg-white rounded border">
                            {action.category}
                          </span>
                          <span className="text-xs text-gray-600 font-mono">{action.id}</span>
                        </div>
                        <p className="font-semibold text-gray-900 mb-1">{action.action}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-700 font-medium">{action.party}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due: {action.dueDate}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {action.status === 'completed' ? (
                          <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded">
                            ✓ Completed
                          </span>
                        ) : action.status === 'in_progress' ? (
                          <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded">
                            → In Progress
                          </span>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => toast.info(`Sending reminder to ${action.party}`)}>
                              Send Reminder
                            </Button>
                            <Button size="sm" onClick={() => toast.success(`Marked action ${action.id} as complete`)}>
                              Mark Complete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PEXA Activity Feed */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-700" />
                PEXA Activity Feed
              </h3>
              <div className="border rounded-lg p-4 bg-gray-50 max-h-64 overflow-y-auto">
                <div className="space-y-3">
                  {pexaData.pexaMessages.map((msg, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className={`w-2 h-2 mt-2 rounded-full ${
                        msg.type === 'system' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{msg.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-600">{msg.from}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{msg.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      )}

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate?.('conditions')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <ListChecks className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">{matter.conditions.total}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Conditions</h3>
            <div className="space-y-1 text-sm">
              <p className="text-green-600">✓ {matter.conditions.cleared} Cleared</p>
              <p className="text-amber-600">⏳ {matter.conditions.pending} Pending</p>
              <p className="text-red-600">⚠ {matter.conditions.overdue} Overdue</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate?.('documents')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{matter.documents}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Documents</h3>
            <p className="text-sm text-gray-600">12 signed, 6 pending, 6 draft</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate?.('tasks')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckSquare className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">{matter.tasks.total}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Tasks</h3>
            <div className="space-y-1 text-sm">
              <p className="text-green-600">✓ {matter.tasks.completed} Completed</p>
              <p className="text-blue-600">→ {matter.tasks.inProgress} In Progress</p>
              <p className="text-gray-600">○ {matter.tasks.notStarted} Not Started</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const renderDocuments = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
      <Button onClick={() => toast.success('Document uploaded')}>
        <Upload className="w-4 h-4 mr-2" />
        Upload
      </Button>
    </div>

    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Document</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Matter</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { name: 'Contract of Sale - Signed.pdf', matter: 'MAT-2024-1247', status: 'signed' },
                { name: 'Transfer of Land.pdf', matter: 'MAT-2024-1247', status: 'draft' },
                { name: 'Mortgage Document.pdf', matter: 'MAT-2024-1246', status: 'pending_signature' }
              ].map((doc, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{doc.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{doc.matter}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      doc.status === 'signed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {doc.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
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

export const renderReports = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { title: 'Settlement Cycle Time', desc: 'Average time by state', icon: Clock },
        { title: 'Matters by Stage', desc: 'Workflow distribution', icon: Activity },
        { title: 'Risk Analysis', desc: 'By matter type', icon: Shield }
      ].map((report, idx) => {
        const Icon = report.icon;
        return (
          <Card key={idx} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toast.success(`Generating ${report.title}...`)}>
            <CardContent className="p-6">
              <Icon className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-1">{report.title}</h3>
              <p className="text-sm text-gray-600">{report.desc}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);

export const renderAdmin = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
    <Card>
      <CardHeader>
        <CardTitle>Workflow Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {['NSW Purchase', 'VIC Refinance', 'QLD Purchase'].map((template, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium text-gray-900">{template}</span>
              <Button size="sm" variant="outline">Edit</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
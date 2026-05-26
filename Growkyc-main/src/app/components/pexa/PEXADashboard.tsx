import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Home,
  FileText,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Link as LinkIcon,
  Building,
  Shield,
  Eye,
  Settings,
  ArrowRight,
  Zap,
  Globe,
  Lock,
  Unlock,
  RefreshCw,
  Send,
  Bell
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { EnterpriseDataTable } from '../common/EnterpriseDataTable';
import { EnterpriseAlert, StatusBadge } from '../common/EnterpriseComponents';
import { toast } from 'sonner';

interface PEXAWorkspace {
  id: string;
  workspaceId: string;
  propertyAddress: string;
  settlementDate: Date;
  status: 'draft' | 'pending' | 'lodged' | 'active' | 'completed' | 'cancelled';
  parties: {
    vendors: string[];
    purchasers: string[];
    vendorSolicitor: string;
    purchaserSolicitor: string;
    financialInstitution?: string;
  };
  documents: {
    id: string;
    name: string;
    type: string;
    status: 'pending' | 'uploaded' | 'verified' | 'lodged';
    uploadedBy?: string;
    uploadedDate?: Date;
  }[];
  financials: {
    purchasePrice: number;
    deposit: number;
    balance: number;
    adjustments: number;
    stampDuty: number;
    transferFee: number;
  };
  caseNumber?: string;
  createdDate: Date;
  lastUpdated: Date;
}

interface PEXADashboardProps {
  onNavigate?: (page: string) => void;
  caseNumber?: string;
}

export function PEXADashboard({ onNavigate, caseNumber }: PEXADashboardProps) {
  const [activeTab, setActiveTab] = useState<'workspaces' | 'create' | 'documents' | 'activities'>('workspaces');
  const [selectedWorkspace, setSelectedWorkspace] = useState<PEXAWorkspace | null>(null);
  const [pexaConnected, setPexaConnected] = useState(true); // Simulated connection status
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  // Mock PEXA workspaces
  const [workspaces, setWorkspaces] = useState<PEXAWorkspace[]>([
    {
      id: '1',
      workspaceId: 'PEX-NSW-2024-001234',
      propertyAddress: '45 Martin Place, Sydney NSW 2000',
      settlementDate: addDays(new Date(), 14),
      status: 'active',
      parties: {
        vendors: ['John Smith', 'Mary Smith'],
        purchasers: ['ABC Investment Trust'],
        vendorSolicitor: 'Smith & Partners Legal',
        purchaserSolicitor: 'Corporate Legal Services',
        financialInstitution: 'Westpac Banking Corporation'
      },
      documents: [
        { id: '1', name: 'Contract of Sale', type: 'contract', status: 'verified', uploadedBy: 'Smith & Partners', uploadedDate: new Date(2024, 1, 15) },
        { id: '2', name: 'Certificate of Title', type: 'title', status: 'verified', uploadedBy: 'Land Registry', uploadedDate: new Date(2024, 1, 16) },
        { id: '3', name: 'Transfer Document', type: 'transfer', status: 'uploaded', uploadedBy: 'Corporate Legal', uploadedDate: new Date(2024, 1, 20) },
        { id: '4', name: 'Mortgage Documents', type: 'mortgage', status: 'pending' }
      ],
      financials: {
        purchasePrice: 2450000,
        deposit: 245000,
        balance: 2205000,
        adjustments: 12500,
        stampDuty: 98000,
        transferFee: 850
      },
      caseNumber: 'MIP-2024-001',
      createdDate: new Date(2024, 1, 10),
      lastUpdated: new Date()
    },
    {
      id: '2',
      workspaceId: 'PEX-VIC-2024-005678',
      propertyAddress: '123 Collins Street, Melbourne VIC 3000',
      settlementDate: addDays(new Date(), 21),
      status: 'pending',
      parties: {
        vendors: ['Property Investments Pty Ltd'],
        purchasers: ['Michael Johnson', 'Sarah Johnson'],
        vendorSolicitor: 'Melbourne Property Law',
        purchaserSolicitor: 'Johnson Legal Associates'
      },
      documents: [
        { id: '5', name: 'Contract of Sale', type: 'contract', status: 'uploaded', uploadedBy: 'Melbourne Property Law', uploadedDate: new Date(2024, 1, 22) },
        { id: '6', name: 'Section 32 Statement', type: 'disclosure', status: 'pending' }
      ],
      financials: {
        purchasePrice: 1850000,
        deposit: 185000,
        balance: 1665000,
        adjustments: 8200,
        stampDuty: 74000,
        transferFee: 850
      },
      caseNumber: 'MIP-2024-003',
      createdDate: new Date(2024, 1, 18),
      lastUpdated: new Date()
    }
  ]);

  // Recent activities
  const recentActivities = [
    { id: 1, timestamp: new Date(), action: 'Document verified', workspace: 'PEX-NSW-2024-001234', user: 'PEXA System', icon: CheckCircle, color: 'text-green-600' },
    { id: 2, timestamp: addDays(new Date(), -1), action: 'Transfer document uploaded', workspace: 'PEX-NSW-2024-001234', user: 'Corporate Legal', icon: Upload, color: 'text-blue-600' },
    { id: 3, timestamp: addDays(new Date(), -2), action: 'Workspace created', workspace: 'PEX-VIC-2024-005678', user: 'Admin', icon: Plus, color: 'text-purple-600' },
    { id: 4, timestamp: addDays(new Date(), -2), action: 'Settlement date confirmed', workspace: 'PEX-NSW-2024-001234', user: 'Smith & Partners', icon: Calendar, color: 'text-amber-600' }
  ];

  const handleCreateWorkspace = () => {
    setIsCreatingWorkspace(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('PEXA workspace created successfully');
      setIsCreatingWorkspace(false);
      setActiveTab('workspaces');
    }, 2000);
  };

  const handleTestConnection = () => {
    toast.info('Testing PEXA connection...');
    setTimeout(() => {
      toast.success('Connected to PEXA successfully');
      setPexaConnected(true);
    }, 1500);
  };

  const tableColumns = [
    {
      key: 'workspaceId',
      label: 'Workspace ID',
      sortable: true,
      render: (val: string) => <span className="font-mono font-semibold text-primary">{val}</span>
    },
    {
      key: 'propertyAddress',
      label: 'Property',
      sortable: true,
      render: (val: string) => (
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-900">{val}</span>
        </div>
      )
    },
    {
      key: 'settlementDate',
      label: 'Settlement Date',
      sortable: true,
      render: (val: Date) => (
        <div>
          <p className="font-semibold text-gray-900">{format(val, 'dd MMM yyyy')}</p>
          <p className="text-xs text-gray-600">{format(val, 'EEEE, h:mm a')}</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val: string) => <StatusBadge status={val as any} />
    },
    {
      key: 'caseNumber',
      label: 'Linked Case',
      render: (val: string) => val ? (
        <span className="font-mono text-sm text-blue-600">{val}</span>
      ) : (
        <span className="text-gray-400 text-sm">â€”</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: PEXAWorkspace) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedWorkspace(row);
              setActiveTab('documents');
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toast.info('Opening PEXA workspace...');
            }}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Connection Status */}
      <Card className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/5" />
        <CardContent className="p-8 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">PEXA Settlement Management</h1>
                  <p className="text-blue-200 text-sm mt-1">
                    Digital Property Exchange Australia Integration
                  </p>
                </div>
                {pexaConnected ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-400/30 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    <span className="text-sm font-semibold text-green-300">Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-400/30 rounded-full">
                    <AlertCircle className="w-4 h-4 text-red-300" />
                    <span className="text-sm font-semibold text-red-300">Disconnected</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-200 text-xs">Active Workspaces</span>
                    <Home className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold">{workspaces.filter(w => w.status === 'active').length}</p>
                  <p className="text-xs text-blue-400 mt-1">{workspaces.length} total</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-200 text-xs">Pending Settlements</span>
                    <Calendar className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-bold">{workspaces.filter(w => w.status === 'pending' || w.status === 'active').length}</p>
                  <p className="text-xs text-amber-400 mt-1">Next in 14 days</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-200 text-xs">Documents Verified</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold">
                    {workspaces.reduce((acc, w) => acc + w.documents.filter(d => d.status === 'verified').length, 0)}
                  </p>
                  <p className="text-xs text-green-400 mt-1">Ready for settlement</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-200 text-xs">Total Value</span>
                    <DollarSign className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold">
                    A${(workspaces.reduce((acc, w) => acc + w.financials.purchasePrice, 0) / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-green-400 mt-1">Under settlement</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="bg-white text-blue-900 hover:bg-gray-100 gap-2"
                onClick={() => setActiveTab('create')}
              >
                <Plus className="w-5 h-5" />
                New Workspace
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 gap-2"
                onClick={handleTestConnection}
              >
                <RefreshCw className="w-5 h-5" />
                Test Connection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Alert */}
      {!pexaConnected && (
        <EnterpriseAlert
          type="error"
          title="PEXA Connection Required"
          message="Please configure your PEXA API credentials in Settings â†’ Integrations to enable digital settlement functionality."
          actions={
            <Button size="sm" variant="outline" onClick={() => onNavigate?.('settings')}>
              Configure PEXA
            </Button>
          }
        />
      )}

      {/* Info Alerts */}
      <div className="grid grid-cols-2 gap-4">
        <EnterpriseAlert
          type="info"
          title="ðŸš§ Building: Real-time Settlement Status"
          message="Live settlement status updates will sync automatically from PEXA workspaces. Currently showing simulated data."
        />
        <EnterpriseAlert
          type="info"
          title="ðŸš§ Building: Digital Document Exchange"
          message="Automated document lodgement and verification with Land Registry integration is in development."
        />
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('workspaces')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'workspaces'
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="w-5 h-5" />
              Workspaces
              <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full font-bold">
                {workspaces.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'create'
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Plus className="w-5 h-5" />
              Create Workspace
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'documents'
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              Documents
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'activities'
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Activity className="w-5 h-5" />
              Activity
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'workspaces' && (
        <Card>
          <CardHeader className="border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">PEXA Workspaces</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Manage digital property settlements</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <EnterpriseDataTable
              data={workspaces}
              columns={tableColumns}
              searchable={true}
              searchPlaceholder="Search by workspace ID, address..."
              exportable={true}
              onRowClick={(row) => {
                setSelectedWorkspace(row);
                setActiveTab('documents');
              }}
              actions={[
                {
                  label: 'Lodge Documents',
                  icon: Send,
                  onClick: (rows) => toast.success(`Lodging documents for ${rows.length} workspace(s)`)
                }
              ]}
            />
          </CardContent>
        </Card>
      )}

      {activeTab === 'create' && (
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Create PEXA Workspace
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="max-w-3xl space-y-6">
              {/* Info Banner */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">ðŸš§ Building: Automated Workspace Creation</h4>
                    <p className="text-sm text-blue-800">
                      This will automatically create PEXA workspaces from MIP cases, pre-populate party details from case data,
                      and link all relevant documents. Real PEXA API integration is in progress.
                    </p>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Property Address *
                    </label>
                    <Input placeholder="Enter property address" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title Reference
                    </label>
                    <Input placeholder="e.g., Lot 1 DP 123456" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Jurisdiction
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>NSW</option>
                      <option>VIC</option>
                      <option>QLD</option>
                      <option>SA</option>
                      <option>WA</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Purchase Price *
                    </label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deposit Paid
                    </label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Settlement Date *
                    </label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Settlement Time
                    </label>
                    <Input type="time" defaultValue="14:00" />
                  </div>
                </div>
              </div>

              {/* Parties */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Parties</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Vendor(s)
                    </label>
                    <Input placeholder="Enter vendor name(s)" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Vendor Solicitor
                    </label>
                    <Input placeholder="Enter solicitor/conveyancer" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Purchaser(s)
                    </label>
                    <Input placeholder="Enter purchaser name(s)" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Purchaser Solicitor
                    </label>
                    <Input placeholder="Enter solicitor/conveyancer" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Financial Institution (if applicable)
                    </label>
                    <Input placeholder="Enter bank/lender name" />
                  </div>
                </div>
              </div>

              {/* Link to Case */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Link to Grow MIP Case</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    MIP Case Number (Optional)
                  </label>
                  <Input placeholder="e.g., MIP-2024-001" defaultValue={caseNumber} />
                  <p className="text-xs text-gray-600 mt-1">
                    Link this PEXA workspace to an existing MIP case for unified management
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  size="lg"
                  onClick={handleCreateWorkspace}
                  disabled={isCreatingWorkspace}
                  className="gap-2"
                >
                  {isCreatingWorkspace ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Creating Workspace...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create PEXA Workspace
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setActiveTab('workspaces')}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'documents' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Document List */}
          <div className="col-span-2">
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Settlement Documents
                  {selectedWorkspace && (
                    <span className="text-sm font-normal text-gray-600">
                      - {selectedWorkspace.workspaceId}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {selectedWorkspace ? (
                  <div className="space-y-3">
                    {/* Building Notice */}
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-4">
                      <div className="flex gap-3">
                        <Zap className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-amber-900 mb-1">ðŸš§ Building: Smart Document Detection</h4>
                          <p className="text-sm text-amber-800">
                            AI will automatically detect document types, extract key information, and verify against PEXA requirements.
                            OCR and validation engines are in development.
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedWorkspace.documents.map((doc) => (
                      <Card key={doc.id} className={`border-2 ${
                        doc.status === 'verified' ? 'border-green-200 bg-green-50' :
                        doc.status === 'uploaded' ? 'border-blue-200 bg-blue-50' :
                        doc.status === 'lodged' ? 'border-purple-200 bg-purple-50' :
                        'border-amber-200 bg-amber-50'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`p-2 rounded-lg ${
                                doc.status === 'verified' ? 'bg-green-100' :
                                doc.status === 'uploaded' ? 'bg-blue-100' :
                                doc.status === 'lodged' ? 'bg-purple-100' :
                                'bg-amber-100'
                              }`}>
                                <FileText className={`w-5 h-5 ${
                                  doc.status === 'verified' ? 'text-green-600' :
                                  doc.status === 'uploaded' ? 'text-blue-600' :
                                  doc.status === 'lodged' ? 'text-purple-600' :
                                  'text-amber-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                                  <StatusBadge status={doc.status as any} size="sm" />
                                </div>
                                <p className="text-sm text-gray-600">
                                  Type: {doc.type}
                                </p>
                                {doc.uploadedBy && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    Uploaded by {doc.uploadedBy} on {format(doc.uploadedDate!, 'dd MMM yyyy')}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {doc.status === 'pending' ? (
                                <Button size="sm">
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload
                                </Button>
                              ) : (
                                <>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  {doc.status === 'uploaded' && (
                                    <Button size="sm">
                                      <Send className="w-4 h-4 mr-2" />
                                      Lodge
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button variant="outline" className="w-full gap-2">
                      <Plus className="w-4 h-4" />
                      Add Additional Document
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Select a workspace to view documents</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Workspace Details Sidebar */}
          <div className="space-y-4">
            {selectedWorkspace ? (
              <>
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="text-base">Workspace Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Workspace ID</p>
                        <p className="font-mono font-semibold text-gray-900">{selectedWorkspace.workspaceId}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Property</p>
                        <p className="font-semibold text-gray-900">{selectedWorkspace.propertyAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Settlement Date</p>
                        <p className="font-semibold text-gray-900">
                          {format(selectedWorkspace.settlementDate, 'dd MMMM yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Status</p>
                        <StatusBadge status={selectedWorkspace.status as any} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="text-base">Financials</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purchase Price</span>
                        <span className="font-semibold">A${selectedWorkspace.financials.purchasePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deposit</span>
                        <span className="font-semibold">A${selectedWorkspace.financials.deposit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Balance</span>
                        <span className="font-semibold">A${selectedWorkspace.financials.balance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-gray-600">Stamp Duty</span>
                        <span className="font-semibold">A${selectedWorkspace.financials.stampDuty.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transfer Fee</span>
                        <span className="font-semibold">A${selectedWorkspace.financials.transferFee.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="text-base">Parties</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Vendors</p>
                        {selectedWorkspace.parties.vendors.map((v, idx) => (
                          <p key={idx} className="font-semibold text-gray-900">{v}</p>
                        ))}
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Purchasers</p>
                        {selectedWorkspace.parties.purchasers.map((p, idx) => (
                          <p key={idx} className="font-semibold text-gray-900">{p}</p>
                        ))}
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Vendor Solicitor</p>
                        <p className="font-semibold text-gray-900">{selectedWorkspace.parties.vendorSolicitor}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Purchaser Solicitor</p>
                        <p className="font-semibold text-gray-900">{selectedWorkspace.parties.purchaserSolicitor}</p>
                      </div>
                      {selectedWorkspace.parties.financialInstitution && (
                        <div>
                          <p className="text-gray-600 mb-1">Financier</p>
                          <p className="font-semibold text-gray-900">{selectedWorkspace.parties.financialInstitution}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Open in PEXA
                </Button>
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-gray-500">
                  <Building className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Select a workspace</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-900 mb-1">ðŸš§ Building: Real-time Activity Feed</h4>
                  <p className="text-sm text-purple-800">
                    Live activity stream with webhook notifications from PEXA. All document uploads, verifications,
                    lodgements, and settlement milestones will appear here in real-time.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-gray-100 rounded-full h-fit">
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Workspace: <span className="font-mono">{activity.workspace}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        By {activity.user} â€¢ {format(activity.timestamp, 'dd MMM yyyy, h:mm a')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


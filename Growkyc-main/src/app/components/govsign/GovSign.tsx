import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  FileSignature,
  Shield,
  Lock,
  Key,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Download,
  Send,
  Plus,
  Search,
  Filter,
  Settings,
  FileText,
  Users,
  History,
  BarChart3,
  Database,
  AlertCircle,
  CheckSquare,
  FileCheck,
  Fingerprint,
  UserCheck,
  Zap,
  FileKey,
  BookOpen,
  HelpCircle,
  Home,
  Folder,
  Upload,
  Edit,
  Trash2,
  MoreHorizontal,
  X,
  ChevronRight,
  Info,
  ExternalLink,
  Copy,
  RefreshCw,
  Award,
  Target,
  Tag,
  Calendar,
  MapPin,
  Globe,
  Server,
  Cpu,
  HardDrive,
  Activity,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { toast } from '../../lib/toast';

interface GrowESignPlatformProps {
  onBack?: () => void;
}

type View = 
  | 'dashboard'
  | 'envelopes'
  | 'documents'
  | 'templates'
  | 'certificates'
  | 'evidence'
  | 'reports'
  | 'admin'
  | 'help';

type UserRole = 'signer' | 'sender' | 'approver' | 'witness' | 'org_admin' | 'security_admin' | 'auditor' | 'system_operator';

export function GrowESignPlatform({ onBack }: GrowESignPlatformProps) {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showCreateEnvelopeModal, setShowCreateEnvelopeModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedEnvelope, setSelectedEnvelope] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserRole] = useState<UserRole>('sender');

  // Mock data for high-assurance platform
  const dashboardStats = {
    pendingForMe: 3,
    awaitingOthers: 12,
    drafts: 5,
    expiringCerts: 2
  };

  const envelopes = [
    {
      id: 'ENV-2024-0001',
      title: 'Defence Procurement Contract - Project Nighthawk',
      sender: 'Sarah Johnson',
      documentType: 'Procurement',
      riskLevel: 'SECRET',
      status: 'In Signing',
      lastEvent: '2024-02-21 14:23:45 AEDT',
      slaTimer: '23h 37m',
      recipients: 3,
      completed: 2,
      hash: 'sha256:a7f3b9c2...',
      hsmSigned: true,
      witnessRequired: true
    },
    {
      id: 'ENV-2024-0002',
      title: 'Banking Loan Agreement - Commonwealth Infrastructure',
      sender: 'Michael Brown',
      documentType: 'Contract',
      riskLevel: 'PROTECTED',
      status: 'Pending Approval',
      lastEvent: '2024-02-21 10:15:30 AEDT',
      slaTimer: '47h 12m',
      recipients: 4,
      completed: 0,
      hash: 'sha256:d9e4f1a8...',
      hsmSigned: false,
      witnessRequired: false
    },
    {
      id: 'ENV-2024-0003',
      title: 'Company Resolution - Board Appointment s127',
      sender: 'Emma Wilson',
      documentType: 'Board Resolution',
      riskLevel: 'OFFICIAL',
      status: 'Completed',
      lastEvent: '2024-02-20 16:42:18 AEDT',
      slaTimer: 'Complete',
      recipients: 2,
      completed: 2,
      hash: 'sha256:c3b8d7e5...',
      hsmSigned: true,
      witnessRequired: false,
      completedAt: '2024-02-20 16:45:00 AEDT'
    },
    {
      id: 'ENV-2024-0004',
      title: 'Deed of Guarantee with Witness Attestation',
      sender: 'David Lee',
      documentType: 'Deed',
      riskLevel: 'PROTECTED',
      status: 'In Signing',
      lastEvent: '2024-02-21 09:30:12 AEDT',
      slaTimer: '71h 45m',
      recipients: 3,
      completed: 1,
      hash: 'sha256:f2a9c6b1...',
      hsmSigned: true,
      witnessRequired: true
    }
  ];

  const certificates = [
    {
      id: 'CERT-001',
      subject: 'CN=Sarah Johnson, O=Defence, OU=Procurement, C=AU',
      issuer: 'Grow E-Sign Root CA - Defence',
      serial: '1A:2B:3C:4D:5E:6F:7A:8B',
      validFrom: '2023-06-15',
      validTo: '2025-06-15',
      status: 'active',
      algorithm: 'RSA-4096 + SHA-512',
      hsmBacked: true,
      clearanceLevel: 'SECRET'
    },
    {
      id: 'CERT-002',
      subject: 'CN=Michael Brown, O=Commonwealth Bank, OU=Legal, C=AU',
      issuer: 'Grow E-Sign Root CA - Banking',
      serial: '2B:3C:4D:5E:6F:7A:8B:9C',
      validFrom: '2023-09-01',
      validTo: '2025-09-01',
      status: 'active',
      algorithm: 'ECDSA P-384 + SHA-384',
      hsmBacked: true,
      clearanceLevel: 'PROTECTED'
    },
    {
      id: 'CERT-003',
      subject: 'CN=Emma Wilson, O=Corporate Services, OU=Company Secretary, C=AU',
      issuer: 'Grow E-Sign Root CA - Corporate',
      serial: '3C:4D:5E:6F:7A:8B:9C:0D',
      validFrom: '2024-01-10',
      validTo: '2026-01-10',
      status: 'active',
      algorithm: 'RSA-4096 + SHA-512',
      hsmBacked: true,
      clearanceLevel: 'OFFICIAL'
    },
    {
      id: 'CERT-004',
      subject: 'CN=Robert Taylor, O=Defence, OU=Intelligence, C=AU',
      issuer: 'Grow E-Sign Root CA - Defence',
      serial: '4D:5E:6F:7A:8B:9C:0D:1E',
      validFrom: '2023-03-20',
      validTo: '2024-03-20',
      status: 'expiring',
      algorithm: 'RSA-4096 + SHA-512',
      hsmBacked: true,
      clearanceLevel: 'TOP SECRET',
      expiresIn: '28 days'
    }
  ];

  const evidenceEvents = [
    {
      eventId: 'EVT-0001',
      timestamp: '2024-02-21 14:23:45.123 AEDT',
      actor: 'Sarah Johnson',
      action: 'ENVELOPE_CREATED',
      eventHash: 'sha256:e7d3a9f2b1c8...',
      previousHash: 'sha256:0000000000...',
      originIp: '203.45.67.89',
      device: 'Windows 11 - Chrome 121',
      authenticated: 'FIDO2 + MFA'
    },
    {
      eventId: 'EVT-0002',
      timestamp: '2024-02-21 14:24:12.456 AEDT',
      actor: 'Sarah Johnson',
      action: 'DOCUMENT_HASH_COMPUTED',
      eventHash: 'sha256:f8e4b0c3d2a9...',
      previousHash: 'sha256:e7d3a9f2b1c8...',
      originIp: '203.45.67.89',
      device: 'Windows 11 - Chrome 121',
      documentHash: 'sha256:a7f3b9c2...'
    },
    {
      eventId: 'EVT-0003',
      timestamp: '2024-02-21 14:25:03.789 AEDT',
      actor: 'Sarah Johnson',
      action: 'RECIPIENTS_ADDED',
      eventHash: 'sha256:a1b2c3d4e5f6...',
      previousHash: 'sha256:f8e4b0c3d2a9...',
      originIp: '203.45.67.89',
      device: 'Windows 11 - Chrome 121',
      recipients: ['Michael Brown', 'Emma Wilson', 'David Lee']
    },
    {
      eventId: 'EVT-0004',
      timestamp: '2024-02-21 14:26:34.012 AEDT',
      actor: 'Approval System',
      action: 'RISK_ASSESSMENT_COMPLETED',
      eventHash: 'sha256:b2c3d4e5f6a7...',
      previousHash: 'sha256:a1b2c3d4e5f6...',
      originIp: '10.0.0.1',
      device: 'System',
      riskScore: 'HIGH',
      approvalRequired: true
    },
    {
      eventId: 'EVT-0005',
      timestamp: '2024-02-21 14:28:17.345 AEDT',
      actor: 'John Smith (Approver)',
      action: 'ENVELOPE_APPROVED',
      eventHash: 'sha256:c3d4e5f6a7b8...',
      previousHash: 'sha256:b2c3d4e5f6a7...',
      originIp: '203.45.67.90',
      device: 'macOS 14 - Safari 17',
      authenticated: 'Smartcard + PIN',
      approvalCode: 'APR-2024-123'
    },
    {
      eventId: 'EVT-0006',
      timestamp: '2024-02-21 14:30:00.678 AEDT',
      actor: 'System',
      action: 'ENVELOPE_SENT',
      eventHash: 'sha256:d4e5f6a7b8c9...',
      previousHash: 'sha256:c3d4e5f6a7b8...',
      originIp: '10.0.0.1',
      device: 'System',
      notificationMethod: 'In-App Only (No Email Links)'
    },
    {
      eventId: 'EVT-0007',
      timestamp: '2024-02-21 15:15:42.901 AEDT',
      actor: 'Michael Brown',
      action: 'DOCUMENT_VIEWED',
      eventHash: 'sha256:e5f6a7b8c9d0...',
      previousHash: 'sha256:d4e5f6a7b8c9...',
      originIp: '203.56.78.90',
      device: 'Windows 11 - Edge 121',
      authenticated: 'Session MFA'
    },
    {
      eventId: 'EVT-0008',
      timestamp: '2024-02-21 15:18:23.234 AEDT',
      actor: 'Michael Brown',
      action: 'STEP_UP_AUTH_COMPLETED',
      eventHash: 'sha256:f6a7b8c9d0e1...',
      previousHash: 'sha256:e5f6a7b8c9d0...',
      originIp: '203.56.78.90',
      device: 'Windows 11 - Edge 121',
      authMethod: 'FIDO2 Security Key',
      keyId: 'YubiKey 5 NFC'
    },
    {
      eventId: 'EVT-0009',
      timestamp: '2024-02-21 15:20:45.567 AEDT',
      actor: 'Michael Brown',
      action: 'HSM_SIGNATURE_APPLIED',
      eventHash: 'sha256:a7b8c9d0e1f2...',
      previousHash: 'sha256:f6a7b8c9d0e1...',
      originIp: '203.56.78.90',
      device: 'Windows 11 - Edge 121',
      certificateSerial: '2B:3C:4D:5E:6F:7A:8B:9C',
      hsmCluster: 'HSM-CLUSTER-01-SYD',
      timestampAuthority: 'RFC3161-TSA-GOV-AU',
      signatureAlgorithm: 'ECDSA P-384 + SHA-384'
    }
  ];

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'SECRET':
      case 'TOP SECRET':
        return 'bg-red-500/15 text-red-300 border-red-300';
      case 'PROTECTED':
        return 'bg-orange-500/15 text-orange-300 border-orange-300';
      case 'OFFICIAL':
        return 'bg-blue-500/15 text-blue-300 border-blue-300';
      default:
        return 'bg-white/5 text-slate-100 border-white/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/15 text-green-300 border-green-500/30';
      case 'In Signing':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Pending Approval':
        return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
      case 'Declined':
      case 'Revoked':
        return 'bg-red-500/15 text-red-300 border-red-500/30';
      default:
        return 'bg-white/5 text-slate-100 border-white/10';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Security Banner */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Grow E-Sign High-Assurance Platform</h1>
            </div>
            <p className="text-red-100 mb-4">
              Cryptographic digital signatures • HSM-backed keys • Tamper-proof evidence ledger • AU data sovereignty
            </p>
            <div className="flex gap-4">
              <Button 
                className="bg-white text-red-300 hover:bg-red-500/10"
                onClick={() => setShowCreateEnvelopeModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Envelope
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-red-800"
                onClick={() => setCurrentView('evidence')}
              >
                <Database className="w-4 h-4 mr-2" />
                Evidence Ledger
              </Button>
            </div>
          </div>
          <div className="text-right">
            <Badge className="bg-white text-red-300 mb-2">
              <MapPin className="w-3 h-3 mr-1" />
              AU Sovereign
            </Badge>
            <p className="text-xs text-red-200">HSM Cluster: SYD-01 Active</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-blue-400" />
              {dashboardStats.pendingForMe > 0 && (
                <Badge className="bg-blue-600 text-white">{dashboardStats.pendingForMe}</Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-100">{dashboardStats.pendingForMe}</p>
            <p className="text-sm text-slate-300">Pending for Me</p>
            <p className="text-xs text-blue-400 mt-1">Requires your signature</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">{dashboardStats.awaitingOthers}</p>
            <p className="text-sm text-slate-300">Awaiting Others</p>
            <p className="text-xs text-slate-400 mt-1">Envelopes you've sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-slate-100">{dashboardStats.drafts}</p>
            <p className="text-sm text-slate-300">Drafts</p>
            <p className="text-xs text-slate-400 mt-1">Incomplete envelopes</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Key className="w-8 h-8 text-orange-400" />
              {dashboardStats.expiringCerts > 0 && (
                <Badge className="bg-orange-600 text-white">{dashboardStats.expiringCerts}</Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-100">{dashboardStats.expiringCerts}</p>
            <p className="text-sm text-slate-300">Expiring Certificates</p>
            <p className="text-xs text-orange-400 mt-1">Action required</p>
          </CardContent>
        </Card>
      </div>

      {/* My Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Tasks</CardTitle>
              <CardDescription>Envelopes requiring your action</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setCurrentView('envelopes')}>
              View All Envelopes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {envelopes.filter(e => e.status === 'In Signing').map((envelope) => (
              <div key={envelope.id} className="flex items-start justify-between p-4 border-2 border-white/10 rounded-lg hover:border-blue-300 hover:bg-blue-500/10">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                    <FileSignature className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <h3 className="font-semibold text-slate-100 flex-1">{envelope.title}</h3>
                      <Badge className={getRiskLevelColor(envelope.riskLevel)}>
                        <Shield className="w-3 h-3 mr-1" />
                        {envelope.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-300 mb-2">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {envelope.id}
                      </span>
                      <span>•</span>
                      <span>{envelope.documentType}</span>
                      <span>•</span>
                      <span>{envelope.completed}/{envelope.recipients} signed</span>
                      <span>•</span>
                      <span className="text-orange-400 font-medium">SLA: {envelope.slaTimer}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {envelope.hsmSigned && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-300">
                          <Key className="w-3 h-3 mr-1" />
                          HSM-Backed
                        </Badge>
                      )}
                      {envelope.witnessRequired && (
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-300">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Witness Required
                        </Badge>
                      )}
                      <code className="text-xs bg-white/5 px-2 py-1 rounded">{envelope.hash}</code>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm">
                    <FileSignature className="w-4 h-4 mr-2" />
                    Review & Sign
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setSelectedEnvelope(envelope);
                    setShowEvidenceModal(true);
                  }}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card className="border-2 border-orange-500/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <CardTitle className="text-orange-300">Security Alerts</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg">
              <Key className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <p className="font-medium text-orange-300">Certificate Expiring</p>
                <p className="text-sm text-orange-300">Robert Taylor's certificate expires in 28 days</p>
                <Button size="sm" variant="outline" className="mt-2">
                  Renew Certificate
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium text-blue-300">HSM Key Rotation Scheduled</p>
                <p className="text-sm text-blue-300">Next rotation: 2024-03-01 02:00 AEDT</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>System-wide envelope activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {evidenceEvents.slice(0, 5).map((event, idx) => (
              <div key={event.eventId} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    event.action.includes('SIGNATURE') ? 'bg-green-500/15' :
                    event.action.includes('APPROVED') ? 'bg-blue-500/15' :
                    'bg-white/5'
                  }`}>
                    {event.action.includes('SIGNATURE') && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {event.action.includes('APPROVED') && <CheckSquare className="w-5 h-5 text-blue-400" />}
                    {!event.action.includes('SIGNATURE') && !event.action.includes('APPROVED') && (
                      <Activity className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  {idx < 4 && <div className="w-0.5 h-8 bg-gray-300" />}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-medium text-slate-100">{event.action.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-slate-300">{event.actor}</p>
                    </div>
                    <span className="text-xs text-slate-400">{event.timestamp}</span>
                  </div>
                  <code className="text-xs bg-white/5 px-2 py-1 rounded">{event.eventHash}</code>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEnvelopes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Envelopes</h2>
          <p className="text-slate-300 mt-1">Manage signature envelopes and execution workflows</p>
        </div>
        <Button onClick={() => setShowCreateEnvelopeModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Envelope
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by ID, title, sender, hash..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Envelopes Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-100">Envelope ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-100">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-100">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-100">Risk</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-100">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-100">Progress</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-100">SLA</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {envelopes.map((envelope) => (
                  <tr key={envelope.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-4 px-4">
                      <code className="text-xs bg-white/5 px-2 py-1 rounded">{envelope.id}</code>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-slate-100">{envelope.title}</p>
                      <p className="text-xs text-slate-400">{envelope.sender}</p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">{envelope.documentType}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getRiskLevelColor(envelope.riskLevel)}>
                        <Shield className="w-3 h-3 mr-1" />
                        {envelope.riskLevel}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(envelope.status)}>
                        {envelope.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(envelope.completed / envelope.recipients) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-300">{envelope.completed}/{envelope.recipients}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm ${envelope.slaTimer.includes('h') ? 'text-orange-400' : 'text-slate-300'}`}>
                        {envelope.slaTimer}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setSelectedEnvelope(envelope);
                          setShowEvidenceModal(true);
                        }}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
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

  const renderCertificates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Certificates and Keys</h2>
          <p className="text-slate-300 mt-1">HSM-backed cryptographic certificates</p>
        </div>
        <Button onClick={() => setShowCertificateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Issue Certificate
        </Button>
      </div>

      {/* HSM Status */}
      <Card className="border-2 border-green-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/15 flex items-center justify-center">
                <Server className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 mb-1">HSM Cluster Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-slate-300">HSM-CLUSTER-01-SYD: Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-slate-300">HSM-CLUSTER-02-SYD: Standby</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">Region: Australia (Sydney)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">FIPS 140-2 Level 3 Certified</span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configure HSM
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <Card key={cert.id} className={cert.status === 'expiring' ? 'border-2 border-orange-500/30' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    cert.status === 'active' ? 'bg-green-500/15' : 'bg-orange-500/15'
                  }`}>
                    <Key className={`w-6 h-6 ${cert.status === 'active' ? 'text-green-400' : 'text-orange-400'}`} />
                  </div>
                  <div>
                    <Badge className={cert.status === 'active' ? 'bg-green-500/15 text-green-300' : 'bg-orange-500/15 text-orange-300'}>
                      {cert.status}
                    </Badge>
                    {cert.status === 'expiring' && (
                      <p className="text-xs text-orange-400 mt-1">Expires in {cert.expiresIn}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-slate-300">Subject</Label>
                  <p className="text-sm font-mono text-slate-100 break-all">{cert.subject}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-300">Issuer</Label>
                  <p className="text-sm text-slate-100">{cert.issuer}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-slate-300">Serial</Label>
                    <code className="text-xs bg-white/5 px-2 py-1 rounded block">{cert.serial}</code>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-300">Algorithm</Label>
                    <p className="text-xs text-slate-100">{cert.algorithm}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-slate-300">Valid From</Label>
                    <p className="text-xs text-slate-100">{cert.validFrom}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-300">Valid To</Label>
                    <p className="text-xs text-slate-100">{cert.validTo}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {cert.hsmBacked && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-300">
                      <Key className="w-3 h-3 mr-1" />
                      HSM-Backed
                    </Badge>
                  )}
                  <Badge variant="outline" className={getRiskLevelColor(cert.clearanceLevel)}>
                    <Shield className="w-3 h-3 mr-1" />
                    {cert.clearanceLevel}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                {cert.status === 'expiring' && (
                  <Button size="sm" className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Renew
                  </Button>
                )}
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEvidence = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Evidence Ledger</h2>
          <p className="text-slate-300 mt-1">Tamper-proof audit trail with cryptographic hash chain</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Ledger Proof
        </Button>
      </div>

      {/* Ledger Info */}
      <Card className="border-2 border-purple-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/15 flex items-center justify-center">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-100 mb-2">Tamper-Proof Evidence Chain</h3>
              <p className="text-sm text-slate-300 mb-3">
                Every action is recorded with cryptographic hash chaining. Each event references the previous event's hash,
                creating an immutable audit trail that can detect any tampering attempts.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-300">Total Events</p>
                  <p className="text-lg font-bold text-slate-100">24,567</p>
                </div>
                <div>
                  <p className="text-xs text-slate-300">Chain Integrity</p>
                  <p className="text-lg font-bold text-green-400">✓ Verified</p>
                </div>
                <div>
                  <p className="text-xs text-slate-300">Last Event</p>
                  <p className="text-sm text-slate-100">2 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Events Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Event Chain</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {evidenceEvents.map((event, idx) => (
              <div 
                key={event.eventId} 
                className="p-4 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer"
                onClick={() => {
                  toast.info('Event details viewer would open here');
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-xs">{event.eventId}</Badge>
                    <Badge className="bg-blue-500/15 text-blue-300">{event.action}</Badge>
                  </div>
                  <span className="text-xs text-slate-400">{event.timestamp}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                  <div>
                    <span className="text-slate-300">Actor: </span>
                    <span className="text-slate-100 font-medium">{event.actor}</span>
                  </div>
                  <div>
                    <span className="text-slate-300">Device: </span>
                    <span className="text-slate-100">{event.device}</span>
                  </div>
                  <div>
                    <span className="text-slate-300">Origin IP: </span>
                    <code className="text-xs bg-white/5 px-1 py-0.5 rounded">{event.originIp}</code>
                  </div>
                  {event.authenticated && (
                    <div>
                      <span className="text-slate-300">Auth: </span>
                      <span className="text-green-400 font-medium">{event.authenticated}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300">Event Hash:</span>
                    <code className="text-xs bg-green-500/15 text-green-300 px-2 py-0.5 rounded">{event.eventHash}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300">Previous Hash:</span>
                    <code className="text-xs bg-white/5 text-slate-100 px-2 py-0.5 rounded">{event.previousHash}</code>
                    {idx === 0 && <Badge variant="outline" className="text-xs">Genesis Event</Badge>}
                  </div>
                </div>

                {event.action === 'HSM_SIGNATURE_APPLIED' && (
                  <div className="mt-3 p-3 bg-green-500/10 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-300">Certificate Serial: </span>
                        <code className="text-green-300">{event.certificateSerial}</code>
                      </div>
                      <div>
                        <span className="text-slate-300">HSM Cluster: </span>
                        <span className="text-green-300">{event.hsmCluster}</span>
                      </div>
                      <div>
                        <span className="text-slate-300">Algorithm: </span>
                        <span className="text-green-300">{event.signatureAlgorithm}</span>
                      </div>
                      <div>
                        <span className="text-slate-300">TSA: </span>
                        <span className="text-green-300">{event.timestampAuthority}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdmin = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Administration</h2>
        <p className="text-slate-300 mt-1">System configuration and governance</p>
      </div>

      {/* Data Sovereignty */}
      <Card className="border-2 border-blue-500/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <CardTitle>Data Sovereignty</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg">
              <div>
                <p className="font-medium text-blue-300">Primary Region</p>
                <p className="text-sm text-blue-300">Australia (Sydney) - LOCKED</p>
              </div>
              <Badge className="bg-blue-600 text-white">
                <Shield className="w-3 h-3 mr-1" />
                AU Sovereign
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
              <div>
                <p className="font-medium text-slate-100">Tenant Isolation</p>
                <p className="text-sm text-slate-300">Dedicated infrastructure per organisation</p>
              </div>
              <Switch defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
              <div>
                <p className="font-medium text-slate-100">Cross-Border Data Transfer</p>
                <p className="text-sm text-slate-300">Prevent data leaving Australian jurisdiction</p>
              </div>
              <Switch defaultChecked disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policy Engine */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Policy Engine</CardTitle>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Policy Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border border-white/10 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-slate-100">Deed Execution Requires Witness</h4>
                  <p className="text-sm text-slate-300">If doc type = deed, require witness attestation</p>
                </div>
                <Badge className="bg-green-500/15 text-green-300">Active</Badge>
              </div>
              <div className="text-xs text-slate-400">
                Scope: All organisations • Last modified: 2024-01-15 by System Admin
              </div>
            </div>
            <div className="p-4 border border-white/10 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-slate-100">High Risk Requires FIDO2</h4>
                  <p className="text-sm text-slate-300">If risk {'>='} PROTECTED, require FIDO2 authentication</p>
                </div>
                <Badge className="bg-green-500/15 text-green-300">Active</Badge>
              </div>
              <div className="text-xs text-slate-400">
                Scope: Defence, Banking • Last modified: 2024-02-01 by Security Admin
              </div>
            </div>
            <div className="p-4 border border-white/10 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-slate-100">External Signer Approval Required</h4>
                  <p className="text-sm text-slate-300">If external signer, require step-up auth + approval gate</p>
                </div>
                <Badge className="bg-green-500/15 text-green-300">Active</Badge>
              </div>
              <div className="text-xs text-slate-400">
                Scope: All organisations • Last modified: 2023-12-10 by Org Admin
              </div>
            </div>
            <div className="p-4 border border-white/10 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-slate-100">SECRET Classification No Email</h4>
                  <p className="text-sm text-slate-300">If classification {'>='} SECRET, block email notifications</p>
                </div>
                <Badge className="bg-green-500/15 text-green-300">Active</Badge>
              </div>
              <div className="text-xs text-slate-400">
                Scope: Defence, Intelligence • Last modified: 2024-01-20 by Security Admin
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
            <div>
              <p className="font-medium text-slate-100">Dual Control for Certificate Issuance</p>
              <p className="text-sm text-slate-300">Require two admins to approve certificate creation</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
            <div>
              <p className="font-medium text-slate-100">Immutable Audit Logging</p>
              <p className="text-sm text-slate-300">All actions logged to tamper-proof ledger</p>
            </div>
            <Switch defaultChecked disabled />
          </div>
          <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
            <div>
              <p className="font-medium text-slate-100">HSM Key Rotation</p>
              <p className="text-sm text-slate-300">Automatic key rotation every 90 days</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
            <div>
              <p className="font-medium text-slate-100">Break Glass Emergency Access</p>
              <p className="text-sm text-slate-300">Enable emergency access with dual approval</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'envelopes':
        return renderEnvelopes();
      case 'certificates':
        return renderCertificates();
      case 'evidence':
        return renderEvidence();
      case 'admin':
        return renderAdmin();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-white/5">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Grow E-Sign</h1>
                  <p className="text-xs text-gray-400">High-Assurance E-Signature Platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-900 text-green-100 border-green-700">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                HSM Active
              </Badge>
              <Badge className="bg-blue-900 text-blue-100 border-blue-700">
                <MapPin className="w-3 h-3 mr-1" />
                AU Sovereign
              </Badge>
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-1 mt-4 border-b border-gray-800">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'envelopes', label: 'Envelopes', icon: FileText },
              { id: 'documents', label: 'Documents', icon: Folder },
              { id: 'templates', label: 'Templates', icon: FileKey },
              { id: 'certificates', label: 'Certificates & Keys', icon: Key },
              { id: 'evidence', label: 'Evidence Ledger', icon: Database },
              { id: 'reports', label: 'Reports', icon: BarChart3 },
              { id: 'admin', label: 'Admin', icon: Settings },
              { id: 'help', label: 'Help', icon: HelpCircle }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    currentView === item.id
                      ? 'border-red-600 text-white bg-gray-800'
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {renderContent()}
      </div>

      {/* Create Envelope Modal */}
      <Dialog open={showCreateEnvelopeModal} onOpenChange={setShowCreateEnvelopeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Envelope - 7-Step Wizard</DialogTitle>
            <DialogDescription>
              Create a high-assurance signing envelope with cryptographic signatures
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-between">
              {['Create', 'Documents', 'Recipients', 'Fields', 'Execution', 'Review', 'Send'].map((step, idx) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    idx === 0 ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-300'
                  }`}>
                    {idx + 1}
                  </div>
                  {idx < 6 && <div className="w-8 h-0.5 bg-gray-300" />}
                </div>
              ))}
            </div>

            {/* Step 1: Create */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-100">Step 1: Create Envelope</h3>
              
              <div>
                <Label>Title *</Label>
                <Input placeholder="e.g., Defence Procurement Contract - Project Nighthawk" className="mt-2" />
              </div>

              <div>
                <Label>Matter ID Reference</Label>
                <Input placeholder="e.g., MATT-2024-001" className="mt-2" />
              </div>

              <div>
                <Label>Classification *</Label>
                <select className="w-full mt-2 px-3 py-2 border border-white/10 rounded-lg">
                  <option>Select classification...</option>
                  <option>Contract</option>
                  <option>Deed</option>
                  <option>Board Resolution</option>
                  <option>Guarantee</option>
                  <option>Procurement</option>
                  <option>HR Document</option>
                </select>
              </div>

              <div>
                <Label>Sensitivity Level *</Label>
                <select className="w-full mt-2 px-3 py-2 border border-white/10 rounded-lg">
                  <option>OFFICIAL</option>
                  <option>PROTECTED</option>
                  <option>SECRET</option>
                  <option>TOP SECRET</option>
                </select>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-300">Deed Execution Requirements</p>
                    <p className="text-sm text-yellow-300 mt-1">
                      Deeds require witness attestation and special execution rules under Australian law.
                      The system will automatically enforce these requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateEnvelopeModal(false)}>
              Cancel
            </Button>
            <Button>
              Next: Add Documents
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evidence Modal */}
      <Dialog open={showEvidenceModal} onOpenChange={setShowEvidenceModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Evidence Pack - {selectedEnvelope?.id}</DialogTitle>
            <DialogDescription>
              Complete cryptographic evidence trail with tamper-proof chain
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Evidence Pack Contents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Evidence Pack Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'executed.pdf', size: '2.4 MB', icon: FileText },
                    { name: 'completion_certificate.pdf', size: '156 KB', icon: Award },
                    { name: 'verification_report.pdf', size: '284 KB', icon: CheckCircle },
                    { name: 'envelope_events.json', size: '89 KB', icon: Database },
                    { name: 'event_chain_proof.json', size: '124 KB', icon: Lock },
                    { name: 'document_hashes.txt', size: '2 KB', icon: FileKey },
                    { name: 'signer_certificates/', size: '456 KB', icon: Key },
                    { name: 'timestamp_tokens/', size: '234 KB', icon: Clock },
                    { name: 'policy_snapshot.json', size: '45 KB', icon: Shield }
                  ].map((file) => {
                    const Icon = file.icon;
                    return (
                      <div key={file.name} className="flex items-center justify-between p-3 border border-white/10 rounded-lg hover:bg-white/5">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-slate-300" />
                          <div>
                            <p className="text-sm font-medium text-slate-100">{file.name}</p>
                            <p className="text-xs text-slate-400">{file.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Download Options */}
            <div className="flex gap-3">
              <Button className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Complete Evidence Pack (.zip)
              </Button>
              <Button variant="outline" className="flex-1">
                <FileCheck className="w-4 h-4 mr-2" />
                Generate Verification Report
              </Button>
            </div>

            {/* Verification Status */}
            <Card className="border-2 border-green-500/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/15 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-300 mb-2">Chain Integrity Verified</h3>
                    <div className="space-y-1 text-sm text-green-300">
                      <p>✓ Event chain valid (9 events)</p>
                      <p>✓ No missing or tampered events detected</p>
                      <p>✓ Timestamp authority validation successful</p>
                      <p>✓ Certificate path validation complete</p>
                      <p>✓ All signatures valid at time of signing</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEvidenceModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificate Modal */}
      <Dialog open={showCertificateModal} onOpenChange={setShowCertificateModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Issue New Certificate</DialogTitle>
            <DialogDescription>
              Create HSM-backed cryptographic signing certificate
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject Name *</Label>
              <Input placeholder="CN=John Smith, O=Organisation, OU=Department, C=AU" className="mt-2" />
            </div>
            <div>
              <Label>Clearance Level *</Label>
              <select className="w-full mt-2 px-3 py-2 border border-white/10 rounded-lg">
                <option>OFFICIAL</option>
                <option>PROTECTED</option>
                <option>SECRET</option>
                <option>TOP SECRET</option>
              </select>
            </div>
            <div>
              <Label>Validity Period *</Label>
              <select className="w-full mt-2 px-3 py-2 border border-white/10 rounded-lg">
                <option>1 year</option>
                <option>2 years</option>
                <option>3 years</option>
              </select>
            </div>
            <div>
              <Label>Signature Algorithm *</Label>
              <select className="w-full mt-2 px-3 py-2 border border-white/10 rounded-lg">
                <option>RSA-4096 + SHA-512</option>
                <option>ECDSA P-384 + SHA-384</option>
                <option>ECDSA P-521 + SHA-512</option>
              </select>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Key className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-300">HSM-Backed Key Generation</p>
                  <p className="text-sm text-blue-300 mt-1">
                    Private key will be generated and stored in FIPS 140-2 Level 3 certified HSM.
                    Key never leaves the HSM boundary.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCertificateModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success('Certificate issuance initiated. Awaiting dual control approval.');
              setShowCertificateModal(false);
            }}>
              Issue Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

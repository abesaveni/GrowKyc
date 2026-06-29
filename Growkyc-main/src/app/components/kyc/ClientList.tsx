import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import {
  Users,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Lock,
  Unlock,
  TrendingUp,
  Clock,
  FileText,
  Activity,
  MapPin,
  Mail,
  Phone,
  Building,
  Hash,
  Calendar,
  Target,
  RefreshCw,
  Archive,
  Ban,
  Brain,
  Scan,
  DollarSign
} from 'lucide-react';
import { ClientDetailView } from './ClientDetailView';

type ClientStatus = 'active' | 'inactive' | 'suspended' | 'restricted';
type RiskTier = 'low' | 'medium' | 'high' | 'critical';
type ClientType = 'individual' | 'company' | 'trust' | 'partnership' | 'smsf';
type ComplianceStatus = 'passed' | 'pending' | 'in-review' | 'failed';

interface Client {
  id: string;
  name: string;
  clientType: ClientType;
  status: ClientStatus;
  riskTier: RiskTier;
  onboardedDate: Date;
  lastReviewDate: Date;
  nextReviewDue: Date;
  email: string;
  phone?: string;
  address: string;
  assignedManager: string;
  abn?: string;
  acn?: string;
  kycComplete: boolean;
  documentsUpToDate: boolean;
  screeningStatus: 'clear' | 'match-review' | 'failed';
  engagementValue: number;
  // New Tier 1-5 Compliance Fields
  complianceScore: number;
  tier1Status: ComplianceStatus;
  tier2Status: ComplianceStatus;
  tier3Status: ComplianceStatus;
  tier4Status: ComplianceStatus;
  tier5Status: ComplianceStatus;
  lastSanctionsCheck: Date;
  transactionMonitoring: 'active' | 'inactive';
  identityWallet: boolean;
  botsActive: number;
}

export function ClientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ClientStatus | 'all'>('all');
  const [filterRisk, setFilterRisk] = useState<RiskTier | 'all'>('all');
  const [filterType, setFilterType] = useState<ClientType | 'all'>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [loading, setLoading] = useState(false);

  const [clients, setClients] = useState<Client[]>([
    {
      id: 'C-2024-001',
      name: 'TechCorp Pty Ltd',
      clientType: 'company',
      status: 'active',
      riskTier: 'medium',
      onboardedDate: new Date('2023-06-15'),
      lastReviewDate: new Date('2024-01-20'),
      nextReviewDue: new Date('2025-01-20'),
      email: 'admin@techcorp.com.au',
      phone: '(03) 9876 5432',
      address: '123 Collins St, Melbourne VIC 3000',
      assignedManager: 'Emma Wilson',
      abn: '12 345 678 901',
      acn: '123 456 789',
      kycComplete: true,
      documentsUpToDate: true,
      screeningStatus: 'clear',
      engagementValue: 125000,
      // New Tier 1-5 Compliance Fields
      complianceScore: 85,
      tier1Status: 'passed',
      tier2Status: 'pending',
      tier3Status: 'in-review',
      tier4Status: 'failed',
      tier5Status: 'passed',
      lastSanctionsCheck: new Date('2024-01-15'),
      transactionMonitoring: 'active',
      identityWallet: true,
      botsActive: 3
    },
    {
      id: 'C-2024-002',
      name: 'Sarah Mitchell',
      clientType: 'individual',
      status: 'active',
      riskTier: 'low',
      onboardedDate: new Date('2023-09-01'),
      lastReviewDate: new Date('2024-02-10'),
      nextReviewDue: new Date('2025-02-10'),
      email: 'sarah.mitchell@email.com',
      phone: '0412 345 678',
      address: '45 Park Avenue, Sydney NSW 2000',
      assignedManager: 'Emma Wilson',
      kycComplete: true,
      documentsUpToDate: true,
      screeningStatus: 'clear',
      engagementValue: 45000,
      // New Tier 1-5 Compliance Fields
      complianceScore: 90,
      tier1Status: 'passed',
      tier2Status: 'passed',
      tier3Status: 'passed',
      tier4Status: 'passed',
      tier5Status: 'passed',
      lastSanctionsCheck: new Date('2024-02-05'),
      transactionMonitoring: 'active',
      identityWallet: false,
      botsActive: 0
    },
    {
      id: 'C-2024-003',
      name: 'Melbourne Family Trust',
      clientType: 'trust',
      status: 'active',
      riskTier: 'high',
      onboardedDate: new Date('2023-03-12'),
      lastReviewDate: new Date('2023-12-05'),
      nextReviewDue: new Date('2024-03-05'),
      email: 'trustees@melbournefamily.com',
      address: '789 Toorak Rd, South Yarra VIC 3141',
      assignedManager: 'Michael Chen',
      kycComplete: true,
      documentsUpToDate: false,
      screeningStatus: 'match-review',
      engagementValue: 380000,
      // New Tier 1-5 Compliance Fields
      complianceScore: 70,
      tier1Status: 'passed',
      tier2Status: 'pending',
      tier3Status: 'in-review',
      tier4Status: 'failed',
      tier5Status: 'passed',
      lastSanctionsCheck: new Date('2023-12-01'),
      transactionMonitoring: 'inactive',
      identityWallet: true,
      botsActive: 2
    },
    {
      id: 'C-2024-004',
      name: 'ABC Enterprises Pty Ltd',
      clientType: 'company',
      status: 'restricted',
      riskTier: 'critical',
      onboardedDate: new Date('2022-11-20'),
      lastReviewDate: new Date('2024-02-15'),
      nextReviewDue: new Date('2024-05-15'),
      email: 'info@abcenterprises.com.au',
      phone: '(02) 8765 4321',
      address: '456 King St, Sydney NSW 2000',
      assignedManager: 'Michael Chen',
      abn: '98 765 432 109',
      acn: '987 654 321',
      kycComplete: true,
      documentsUpToDate: true,
      screeningStatus: 'match-review',
      engagementValue: 75000,
      // New Tier 1-5 Compliance Fields
      complianceScore: 50,
      tier1Status: 'failed',
      tier2Status: 'pending',
      tier3Status: 'in-review',
      tier4Status: 'failed',
      tier5Status: 'failed',
      lastSanctionsCheck: new Date('2024-02-10'),
      transactionMonitoring: 'inactive',
      identityWallet: false,
      botsActive: 0
    },
    {
      id: 'C-2024-005',
      name: 'Green Valley SMSF',
      clientType: 'smsf',
      status: 'active',
      riskTier: 'low',
      onboardedDate: new Date('2024-01-05'),
      lastReviewDate: new Date('2024-01-05'),
      nextReviewDue: new Date('2025-01-05'),
      email: 'trustees@greenvalleysmsf.com',
      phone: '0411 222 333',
      address: '12 River Road, Brisbane QLD 4000',
      assignedManager: 'Lisa Martinez',
      abn: '11 222 333 444',
      kycComplete: true,
      documentsUpToDate: true,
      screeningStatus: 'clear',
      engagementValue: 95000,
      // New Tier 1-5 Compliance Fields
      complianceScore: 95,
      tier1Status: 'passed',
      tier2Status: 'passed',
      tier3Status: 'passed',
      tier4Status: 'passed',
      tier5Status: 'passed',
      lastSanctionsCheck: new Date('2024-01-01'),
      transactionMonitoring: 'active',
      identityWallet: true,
      botsActive: 5
    },
    {
      id: 'C-2024-006',
      name: 'David Chen',
      clientType: 'individual',
      status: 'inactive',
      riskTier: 'low',
      onboardedDate: new Date('2022-05-10'),
      lastReviewDate: new Date('2023-05-10'),
      nextReviewDue: new Date('2024-05-10'),
      email: 'david.chen@email.com',
      address: '88 Beach St, Perth WA 6000',
      assignedManager: 'Lisa Martinez',
      kycComplete: true,
      documentsUpToDate: false,
      screeningStatus: 'clear',
      engagementValue: 0,
      // New Tier 1-5 Compliance Fields
      complianceScore: 80,
      tier1Status: 'passed',
      tier2Status: 'pending',
      tier3Status: 'in-review',
      tier4Status: 'failed',
      tier5Status: 'passed',
      lastSanctionsCheck: new Date('2023-05-15'),
      transactionMonitoring: 'inactive',
      identityWallet: false,
      botsActive: 0
    },
    {
      id: 'C-2024-007',
      name: 'Brisbane Property Group Pty Ltd',
      clientType: 'company',
      status: 'active',
      riskTier: 'medium',
      onboardedDate: new Date('2023-08-20'),
      lastReviewDate: new Date('2026-03-15'),
      nextReviewDue: new Date('2027-03-15'),
      email: 'info@brisbanepropertygroup.com.au',
      phone: '(07) 3456 7890',
      address: '567 Queen St, Brisbane QLD 4000',
      assignedManager: 'Emma Wilson',
      abn: '55 666 777 888',
      acn: '555 666 777',
      kycComplete: true,
      documentsUpToDate: true,
      screeningStatus: 'clear',
      engagementValue: 210000,
      complianceScore: 92,
      tier1Status: 'passed',
      tier2Status: 'passed',
      tier3Status: 'passed',
      tier4Status: 'passed',
      tier5Status: 'passed',
      lastSanctionsCheck: new Date('2026-03-20'),
      transactionMonitoring: 'active',
      identityWallet: true,
      botsActive: 22
    },
    {
      id: 'C-2024-008',
      name: 'Innovation Partners Trust',
      clientType: 'trust',
      status: 'active',
      riskTier: 'low',
      onboardedDate: new Date('2024-02-01'),
      lastReviewDate: new Date('2026-03-18'),
      nextReviewDue: new Date('2027-03-18'),
      email: 'trustees@innovationpartners.com',
      phone: '0433 555 666',
      address: '789 Collins St, Melbourne VIC 3000',
      assignedManager: 'Michael Chen',
      abn: '22 333 444 555',
      kycComplete: true,
      documentsUpToDate: true,
      screeningStatus: 'clear',
      engagementValue: 165000,
      complianceScore: 96,
      tier1Status: 'passed',
      tier2Status: 'passed',
      tier3Status: 'passed',
      tier4Status: 'passed',
      tier5Status: 'passed',
      lastSanctionsCheck: new Date('2026-03-20'),
      transactionMonitoring: 'active',
      identityWallet: true,
      botsActive: 22
    },
    {
      id: 'C-2024-009',
      name: 'Jennifer Williams',
      clientType: 'individual',
      status: 'active',
      riskTier: 'low',
      onboardedDate: new Date('2025-11-10'),
      lastReviewDate: new Date('2026-03-12'),
      nextReviewDue: new Date('2027-03-12'),
      email: 'jennifer.williams@email.com',
      phone: '0422 888 999',
      address: '321 George St, Sydney NSW 2000',
      assignedManager: 'Lisa Martinez',
      kycComplete: true,
      documentsUpToDate: true,
      screeningStatus: 'clear',
      engagementValue: 58000,
      complianceScore: 88,
      tier1Status: 'passed',
      tier2Status: 'passed',
      tier3Status: 'passed',
      tier4Status: 'passed',
      tier5Status: 'pending',
      lastSanctionsCheck: new Date('2026-03-19'),
      transactionMonitoring: 'active',
      identityWallet: false,
      botsActive: 18
    },
    {
      id: 'C-2024-010',
      name: 'Coastal Ventures Partnership',
      clientType: 'partnership',
      status: 'active',
      riskTier: 'medium',
      onboardedDate: new Date('2023-04-15'),
      lastReviewDate: new Date('2026-03-10'),
      nextReviewDue: new Date('2027-03-10'),
      email: 'partners@coastalventures.com.au',
      phone: '(08) 9123 4567',
      address: '101 Beach Road, Perth WA 6000',
      assignedManager: 'Michael Chen',
      abn: '77 888 999 000',
      kycComplete: true,
      documentsUpToDate: false,
      screeningStatus: 'match-review',
      engagementValue: 145000,
      complianceScore: 75,
      tier1Status: 'passed',
      tier2Status: 'in-review',
      tier3Status: 'passed',
      tier4Status: 'pending',
      tier5Status: 'passed',
      lastSanctionsCheck: new Date('2026-03-08'),
      transactionMonitoring: 'active',
      identityWallet: true,
      botsActive: 16
    }
  ]);

  const fetchClients = useCallback(async () => {
    const token = sessionStorage.getItem('growkyc_token');
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/clients?limit=100', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const mapped: Client[] = (data.items || []).map((c: any) => ({
        id: String(c.id),
        name: c.name,
        clientType: c.entity_profile ? 'company' : 'individual' as ClientType,
        status: c.compliance_status === 'approved' ? 'active' : c.compliance_status === 'flagged' ? 'restricted' : 'active' as ClientStatus,
        riskTier: (c.risk_level || 'LOW').toLowerCase() as RiskTier,
        onboardedDate: new Date(c.created_at),
        lastReviewDate: c.approved_at ? new Date(c.approved_at) : new Date(c.created_at),
        nextReviewDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        email: c.individual_profile?.email || c.entity_profile?.contact_email || '',
        phone: c.individual_profile?.phone || c.entity_profile?.phone,
        address: c.individual_profile?.address || c.entity_profile?.registered_address || '',
        assignedManager: '—',
        abn: c.entity_profile?.abn,
        acn: c.entity_profile?.acn,
        kycComplete: c.compliance_status === 'approved',
        documentsUpToDate: !c.is_locked,
        screeningStatus: c.is_sanctioned ? 'failed' : c.is_pep ? 'match-review' : 'clear',
        engagementValue: c.income_level * 1000 || 0,
        complianceScore: Math.max(0, 100 - (c.risk_score || 0)),
        tier1Status: c.compliance_status === 'approved' ? 'passed' : 'pending' as ComplianceStatus,
        tier2Status: 'pending' as ComplianceStatus,
        tier3Status: 'pending' as ComplianceStatus,
        tier4Status: 'pending' as ComplianceStatus,
        tier5Status: 'pending' as ComplianceStatus,
        lastSanctionsCheck: new Date(c.created_at),
        transactionMonitoring: 'inactive' as const,
        identityWallet: false,
        botsActive: 0,
      }));
      if (mapped.length > 0) setClients(mapped);
    } catch {
      // keep mock data on failure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const getStatusColor = (status: ClientStatus) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'gray';
      case 'suspended': return 'yellow';
      case 'restricted': return 'red';
    }
  };

  const getRiskColor = (tier: RiskTier) => {
    switch (tier) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'orange';
      case 'critical': return 'red';
    }
  };

  const clientTypeLabels: Record<ClientType, string> = {
    'individual': 'Individual',
    'company': 'Company',
    'trust': 'Trust',
    'partnership': 'Partnership',
    'smsf': 'SMSF'
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.abn && client.abn.includes(searchTerm));

    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesRisk = filterRisk === 'all' || client.riskTier === filterRisk;
    const matchesType = filterType === 'all' || client.clientType === filterType;

    return matchesSearch && matchesStatus && matchesRisk && matchesType;
  });

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
    restricted: clients.filter(c => c.status === 'restricted').length,
    highRisk: clients.filter(c => c.riskTier === 'high' || c.riskTier === 'critical').length,
    reviewsOverdue: clients.filter(c => c.nextReviewDue < new Date()).length,
    totalValue: clients.reduce((sum, c) => sum + c.engagementValue, 0)
  };

  return (
    <div className="space-y-6">
      {/* Show Client Detail View Modal if client selected */}
      {selectedClient && (
        <ClientDetailView client={selectedClient} onClose={() => setSelectedClient(null)} />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Users className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Client List</h1>
              <p className="text-xl text-indigo-100">Manage Your Client Portfolio</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="bg-white text-indigo-400 hover:bg-indigo-500/10">
              <Download className="w-5 h-5 mr-2" />
              Export List
            </Button>
            <Button className="bg-white text-indigo-400 hover:bg-indigo-500/10" onClick={fetchClients} disabled={loading}>
              <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Sync Updates
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-7 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">Total Clients</h3>
              <Users className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Active</h3>
              <CheckCircle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-green-300">{stats.active}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Inactive</h3>
              <Archive className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{stats.inactive}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Restricted</h3>
              <Ban className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-red-300">{stats.restricted}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">High Risk</h3>
              <AlertTriangle className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-orange-300">{stats.highRisk}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Reviews Due</h3>
              <Clock className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold text-yellow-300">{stats.reviewsOverdue}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">Total Value</h3>
              <TrendingUp className="w-5 h-5 text-white/80" />
            </div>
            <p className="text-2xl font-bold">${(stats.totalValue / 1000).toFixed(0)}k</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-white/10 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, ABN, or client ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Status</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                All
              </button>
              {['active', 'inactive', 'suspended', 'restricted'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as ClientStatus)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    filterStatus === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Risk</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterRisk('all')}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                  filterRisk === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                All
              </button>
              {['low', 'medium', 'high', 'critical'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setFilterRisk(risk as RiskTier)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    filterRisk === risk
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {risk.charAt(0).toUpperCase() + risk.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                  filterType === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                All
              </button>
              {Object.entries(clientTypeLabels).map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as ClientType)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    filterType === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-300">
          Showing <strong>{filteredClients.length}</strong> of <strong>{clients.length}</strong> clients
        </div>
      </div>

      {/* Client List */}
      <div className="space-y-3">
        {filteredClients.map((client) => (
          <div key={client.id} className={`bg-white rounded-lg border-2 p-6 ${
            client.status === 'restricted' ? 'border-red-300 bg-red-500/10' :
            client.riskTier === 'critical' ? 'border-orange-300' :
            client.riskTier === 'high' ? 'border-orange-500/30' :
            'border-white/10'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-100">{client.name}</h3>
                  <span className={`px-3 py-1 bg-${getStatusColor(client.status)}-100 text-${getStatusColor(client.status)}-700 text-sm font-bold rounded-full`}>
                    {client.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 bg-${getRiskColor(client.riskTier)}-100 text-${getRiskColor(client.riskTier)}-700 text-sm font-semibold rounded-full`}>
                    {client.riskTier.toUpperCase()} RISK
                  </span>
                  {client.status === 'restricted' && (
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                      <Ban className="w-4 h-4" />
                      RESTRICTED
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    <span>{client.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>{clientTypeLabels[client.clientType]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{client.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Manager: {client.assignedManager}</span>
                  </div>
                  {client.abn && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>ABN: {client.abn}</span>
                    </div>
                  )}
                  {client.acn && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>ACN: {client.acn}</span>
                    </div>
                  )}
                </div>

                {/* Status Indicators */}
                <div className="grid grid-cols-5 gap-3">
                  <div className={`p-2 rounded-lg border ${
                    client.kycComplete ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">KYC Complete</span>
                      {client.kycComplete ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>

                  <div className={`p-2 rounded-lg border ${
                    client.documentsUpToDate ? 'border-green-500/30 bg-green-500/10' : 'border-orange-500/30 bg-orange-500/10'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">Documents</span>
                      {client.documentsUpToDate ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                      )}
                    </div>
                  </div>

                  <div className={`p-2 rounded-lg border ${
                    client.screeningStatus === 'clear' ? 'border-green-500/30 bg-green-500/10' :
                    client.screeningStatus === 'match-review' ? 'border-yellow-500/30 bg-yellow-500/10' :
                    'border-red-500/30 bg-red-500/10'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">Screening</span>
                      {client.screeningStatus === 'clear' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : client.screeningStatus === 'match-review' ? (
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg border border-blue-500/30 bg-blue-500/10">
                    <p className="text-xs font-semibold text-slate-300 mb-1">Last Review</p>
                    <p className="text-xs text-blue-300">{client.lastReviewDate.toLocaleDateString()}</p>
                  </div>

                  <div className={`p-2 rounded-lg border ${
                    client.nextReviewDue < new Date() ? 'border-red-500/30 bg-red-500/10' : 'border-white/10 bg-white/5'
                  }`}>
                    <p className="text-xs font-semibold text-slate-300 mb-1">Next Review</p>
                    <p className={`text-xs font-semibold ${
                      client.nextReviewDue < new Date() ? 'text-red-300' : 'text-slate-300'
                    }`}>
                      {client.nextReviewDue.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Engagement Value */}
                <div className="mt-4 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Engagement Value:</span>
                    <span className="text-lg font-bold text-green-400">
                      ${client.engagementValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-300" />
                    <span className="text-sm text-slate-300">
                      Onboarded: {client.onboardedDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-6">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setSelectedClient(client)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="bg-white rounded-lg border border-white/10 p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">No Clients Found</h3>
          <p className="text-slate-300">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
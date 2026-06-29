import React, { useState, useMemo, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import {
  User,
  Building2,
  Shield,
  TrendingUp,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Target,
  Briefcase,
  Upload,
  Download,
  Edit,
  Unlock,
  Search,
  Filter,
  MoreVertical,
  ChevronDown,
  AlertCircle,
  Flag,
  Users,
  Activity,
  CreditCard,
  Link as LinkIcon,
  MessageSquare,
  Settings,
  Lock,
  Info,
  XCircle
} from 'lucide-react';

interface InvestorRegistryProps {
  onNavigate: (page: string) => void;
  role: string;
}

type InvestorStatus = 'active' | 'pending' | 'frozen' | 'inactive' | 'expired-wholesale';
type ViewMode = 'list' | 'detail' | 'edit';

export function InvestorRegistry({ onNavigate, role }: InvestorRegistryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    tier: 'all',
    entityType: 'all',
    wholesaleExpiry: 'all',
    search: ''
  });
  const [openActionsMenuId, setOpenActionsMenuId] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const [investors, setInvestors] = useState<any[]>([
    {
      id: 'INV-001',
      name: 'Meridian Capital Pty Ltd',
      entityType: 'company',
      tier: 'tier-a',
      legalClassification: 'institutional',
      status: 'active',
      joinedDate: '2023-06-15',
      abn: '12 345 678 901',
      email: 'contact@meridiancapital.com.au',
      phone: '+61 2 9876 5432',
      primaryContact: 'James Anderson',
      totalCommitted: 15000000,
      totalCalled: 12000000,
      totalDeployed: 11500000,
      activeInvestments: 8,
      concentrationLimits: { perSPV: 15, perSector: 25, total: 50 },
      currentExposure: { perSPV: 12, perSector: 18, total: 32 },
      strategyFlags: ['Mortgage', 'SME', 'High Yield', 'Structured'],
      kycStatus: 'approved',
      kycExpiry: '2025-06-15',
      wholesaleStatus: 'valid',
      wholesaleExpiry: '2024-08-15',
      wholesaleType: 'accountant-certificate',
      pepScreening: 'clear',
      sanctionsScreening: 'clear',
      lastScreeningDate: '2024-02-10'
    },
    {
      id: 'INV-002',
      name: 'Smith Family Trust',
      entityType: 'trust',
      tier: 'tier-c',
      legalClassification: 'wholesale',
      status: 'active',
      joinedDate: '2023-09-20',
      abn: '98 765 432 109',
      email: 'trustee@smithfamily.com.au',
      phone: '+61 3 8765 4321',
      primaryContact: 'David Smith',
      totalCommitted: 2500000,
      totalCalled: 1800000,
      totalDeployed: 1750000,
      activeInvestments: 5,
      concentrationLimits: { perSPV: 5, perSector: 15, total: 20 },
      currentExposure: { perSPV: 4, perSector: 12, total: 18 },
      strategyFlags: ['Mortgage', 'Asset Finance'],
      kycStatus: 'approved',
      kycExpiry: '2025-09-20',
      wholesaleStatus: 'valid',
      wholesaleExpiry: '2024-09-20',
      wholesaleType: 'net-assets',
      pepScreening: 'clear',
      sanctionsScreening: 'clear',
      lastScreeningDate: '2024-02-08'
    },
    {
      id: 'INV-003',
      name: 'Emma Wilson',
      entityType: 'individual',
      tier: 'tier-d',
      legalClassification: 'wholesale',
      status: 'expired-wholesale',
      joinedDate: '2023-11-10',
      tfn: '123 456 789',
      email: 'emma.wilson@email.com.au',
      phone: '+61 4 1234 5678',
      primaryContact: 'Emma Wilson',
      totalCommitted: 500000,
      totalCalled: 300000,
      totalDeployed: 300000,
      activeInvestments: 2,
      concentrationLimits: { perSPV: 3, perSector: 10, total: 10 },
      currentExposure: { perSPV: 3, perSector: 8, total: 10 },
      strategyFlags: ['Mortgage'],
      kycStatus: 'approved',
      kycExpiry: '2025-11-10',
      wholesaleStatus: 'expired',
      wholesaleExpiry: '2024-01-10',
      wholesaleType: 'accountant-certificate',
      pepScreening: 'clear',
      sanctionsScreening: 'clear',
      lastScreeningDate: '2024-01-05'
    },
    {
      id: 'INV-004',
      name: 'Apex Investment Fund',
      entityType: 'fund',
      tier: 'tier-a',
      legalClassification: 'institutional',
      status: 'active',
      joinedDate: '2023-03-01',
      abn: '11 222 333 444',
      email: 'operations@apexfund.com.au',
      phone: '+61 2 9999 8888',
      primaryContact: 'Sarah Chen',
      totalCommitted: 50000000,
      totalCalled: 42000000,
      totalDeployed: 40500000,
      activeInvestments: 15,
      concentrationLimits: { perSPV: 15, perSector: 25, total: 50 },
      currentExposure: { perSPV: 14, perSector: 22, total: 45 },
      strategyFlags: ['Mortgage', 'SME', 'Asset Finance', 'High Yield', 'Mezzanine', 'Structured'],
      kycStatus: 'approved',
      kycExpiry: '2025-03-01',
      wholesaleStatus: 'valid',
      wholesaleExpiry: '2024-09-01',
      wholesaleType: 'professional-investor',
      pepScreening: 'clear',
      sanctionsScreening: 'clear',
      lastScreeningDate: '2024-02-12'
    },
    {
      id: 'INV-005',
      name: 'Harbour Bridge Capital',
      entityType: 'company',
      tier: 'tier-b',
      legalClassification: 'professional',
      status: 'frozen',
      joinedDate: '2023-07-15',
      abn: '55 666 777 888',
      email: 'admin@harbourbridge.com.au',
      phone: '+61 2 8888 7777',
      primaryContact: 'Michael Thompson',
      totalCommitted: 8000000,
      totalCalled: 6000000,
      totalDeployed: 5800000,
      activeInvestments: 6,
      concentrationLimits: { perSPV: 10, perSector: 20, total: 35 },
      currentExposure: { perSPV: 9, perSector: 18, total: 30 },
      strategyFlags: ['SME', 'Asset Finance', 'Mezzanine'],
      kycStatus: 'approved',
      kycExpiry: '2025-07-15',
      wholesaleStatus: 'valid',
      wholesaleExpiry: '2025-01-15',
      wholesaleType: 'accountant-certificate',
      pepScreening: 'under-review',
      sanctionsScreening: 'clear',
      lastScreeningDate: '2024-02-01',
      frozenReason: 'Pending compliance review - PEP match requires investigation'
    }
  ]);

  const patchInvestor = (id: string, updates: Record<string, any>) => {
    setInvestors((prev) => prev.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)));
    setSelectedInvestor((sel: any) => (sel && sel.id === id ? { ...sel, ...updates } : sel));
  };

  useEffect(() => {
    const close = (ev: MouseEvent) => {
      const t = ev.target as HTMLElement;
      if (t.closest?.('[data-investor-actions-root]')) return;
      setOpenActionsMenuId(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const expiringSoonCount = useMemo(() => {
    const today = new Date();
    return investors.filter((inv) => {
      if (inv.wholesaleStatus === 'expired') return true;
      const expiryDate = new Date(inv.wholesaleExpiry);
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 60 && daysUntilExpiry >= 0;
    }).length;
  }, [investors]);

  const exportRegistryCsv = () => {
    const rows = filteredInvestors.map((i) => ({
      id: i.id,
      name: i.name,
      email: i.email,
      status: i.status,
      tier: i.tier,
      committed: i.totalCommitted
    }));
    const header = ['id', 'name', 'email', 'status', 'tier', 'totalCommitted'];
    const csv = [header.join(','), ...rows.map((r) => header.map((h) => `"${String((r as any)[h]).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investor-registry-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} investor(s) to CSV`);
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) {
        toast.error('CSV must include a header row and at least one data row');
        return;
      }
      const added = Math.min(3, lines.length - 1);
      setInvestors((prev) => {
        const nextId = prev.length + 1;
        const synthetic = Array.from({ length: added }).map((_, idx) => ({
          id: `INV-IMPORT-${nextId + idx}`,
          name: `Imported Investor ${nextId + idx}`,
          entityType: 'company',
          tier: 'tier-c',
          legalClassification: 'wholesale',
          status: 'pending',
          joinedDate: new Date().toISOString().slice(0, 10),
          abn: '00 000 000 000',
          email: `imported${nextId + idx}@example.com`,
          phone: '+61 2 0000 0000',
          primaryContact: 'TBC',
          totalCommitted: 1000000 * (idx + 1),
          totalCalled: 0,
          totalDeployed: 0,
          activeInvestments: 0,
          concentrationLimits: { perSPV: 5, perSector: 15, total: 20 },
          currentExposure: { perSPV: 0, perSector: 0, total: 0 },
          strategyFlags: ['Mortgage'],
          kycStatus: 'pending',
          kycExpiry: new Date(Date.now() + 86400000 * 365).toISOString().slice(0, 10),
          wholesaleStatus: 'valid',
          wholesaleExpiry: new Date(Date.now() + 86400000 * 180).toISOString().slice(0, 10),
          wholesaleType: 'accountant-certificate',
          pepScreening: 'clear',
          sanctionsScreening: 'clear',
          lastScreeningDate: new Date().toISOString().slice(0, 10)
        }));
        return [...prev, ...synthetic];
      });
      toast.success(`Imported ${added} investor record(s) from "${file.name}"`);
    };
    reader.readAsText(file);
  };

  const filteredInvestors = useMemo(() => investors.filter((investor) => {
    if (filters.status !== 'all' && investor.status !== filters.status) return false;
    if (filters.tier !== 'all' && investor.tier !== filters.tier) return false;
    if (filters.entityType !== 'all' && investor.entityType !== filters.entityType) return false;
    
    if (filters.wholesaleExpiry === 'expiring-soon') {
      const expiryDate = new Date(investor.wholesaleExpiry);
      const today = new Date();
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry > 60) return false;
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        investor.name.toLowerCase().includes(searchLower) ||
        investor.id.toLowerCase().includes(searchLower) ||
        investor.email.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  }), [investors, filters]);

  const getStatusBadge = (status: InvestorStatus) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      pending: { label: 'Pending Approval', className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      frozen: { label: 'Frozen', className: 'bg-red-100 text-red-800 border-red-200', icon: Lock },
      inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-800 border-gray-200', icon: X },
      'expired-wholesale': { label: 'Wholesale Expired', className: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertTriangle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${config.className}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </div>
    );
  };

  const getTierBadge = (tier: string) => {
    const tierConfig: { [key: string]: { className: string; label: string } } = {
      'tier-a': { className: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Tier A' },
      'tier-b': { className: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'Tier B' },
      'tier-c': { className: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Tier C' },
      'tier-d': { className: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Tier D' },
      'tier-e': { className: 'bg-gray-100 text-gray-600 border-gray-200', label: 'Tier E' }
    };

    const config = tierConfig[tier] || tierConfig['tier-e'];

    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${config.className}`}>
        <Award className="w-3.5 h-3.5" />
        {config.label}
      </div>
    );
  };

  const getWholesaleStatusBadge = (status: string, expiry: string) => {
    const expiryDate = new Date(expiry);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (status === 'expired') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-red-100 text-red-800 border-red-200 text-xs font-medium">
          <XCircle className="w-3.5 h-3.5" />
          Expired
        </div>
      );
    }

    if (daysUntilExpiry <= 30) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-orange-100 text-orange-800 border-orange-200 text-xs font-medium">
          <AlertTriangle className="w-3.5 h-3.5" />
          Expires in {daysUntilExpiry}d
        </div>
      );
    }

    if (daysUntilExpiry <= 60) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200 text-xs font-medium">
          <Clock className="w-3.5 h-3.5" />
          Valid ({daysUntilExpiry}d)
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border bg-green-100 text-green-800 border-green-200 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5" />
        Valid
      </div>
    );
  };

  if (viewMode === 'detail' && selectedInvestor) {
    return (
      <InvestorDetailView
        investor={selectedInvestor}
        onBack={() => {
          setViewMode('list');
          setSelectedInvestor(null);
        }}
        role={role}
        onPatch={patchInvestor}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investor Registry</h1>
          <p className="text-gray-600 mt-1">Master investor database with compliance tracking and tier management</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={importInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleImportFile}
          />
          <Button type="button" variant="outline" onClick={handleImportClick}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button type="button" variant="outline" onClick={exportRegistryCsv}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => onNavigate('investor-onboarding')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <User className="w-4 h-4 mr-2" />
            New Investor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <p className="text-sm text-gray-600">Total Investors</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{investors.length}</p>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Active</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{investors.filter(i => i.status === 'active').length}</p>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-gray-600">Expiring Soon</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{expiringSoonCount}</p>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-red-600" />
            <p className="text-sm text-gray-600">Frozen</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{investors.filter(i => i.status === 'frozen').length}</p>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Total Committed</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${(investors.reduce((sum, i) => sum + i.totalCommitted, 0) / 1000000).toFixed(0)}M
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search by name, ID, or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="frozen">Frozen</option>
            <option value="expired-wholesale">Wholesale Expired</option>
          </select>
          
          <select
            value={filters.tier}
            onChange={(e) => setFilters({ ...filters, tier: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Tiers</option>
            <option value="tier-a">Tier A</option>
            <option value="tier-b">Tier B</option>
            <option value="tier-c">Tier C</option>
            <option value="tier-d">Tier D</option>
          </select>
          
          <select
            value={filters.entityType}
            onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="company">Company</option>
            <option value="trust">Trust</option>
            <option value="fund">Fund</option>
          </select>
          
          <select
            value={filters.wholesaleExpiry}
            onChange={(e) => setFilters({ ...filters, wholesaleExpiry: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Wholesale</option>
            <option value="expiring-soon">Expiring Soon</option>
          </select>
        </div>
      </div>

      {/* Investors Table */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Investor
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Wholesale
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Committed
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Active Deals
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvestors.map((investor) => (
                <tr key={investor.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => {
                  setSelectedInvestor(investor);
                  setViewMode('detail');
                }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        {investor.entityType === 'individual' ? (
                          <User className="w-5 h-5 text-indigo-600" />
                        ) : investor.entityType === 'company' ? (
                          <Building2 className="w-5 h-5 text-indigo-600" />
                        ) : investor.entityType === 'trust' ? (
                          <Shield className="w-5 h-5 text-indigo-600" />
                        ) : (
                          <Briefcase className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{investor.name}</p>
                        <p className="text-sm text-gray-500">{investor.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 capitalize">{investor.entityType}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getTierBadge(investor.tier)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(investor.status as InvestorStatus)}
                  </td>
                  <td className="px-6 py-4">
                    {getWholesaleStatusBadge(investor.wholesaleStatus, investor.wholesaleExpiry)}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">${(investor.totalCommitted / 1000000).toFixed(1)}M</p>
                      <p className="text-xs text-gray-500">
                        {((investor.totalDeployed / Math.max(investor.totalCommitted, 1)) * 100).toFixed(0)}% deployed
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-gray-900">{investor.activeInvestments}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2" data-investor-actions-root onMouseDown={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInvestor(investor);
                          setViewMode('detail');
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Email investor"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `mailto:${encodeURIComponent(investor.email)}?subject=${encodeURIComponent('IMFO — ' + investor.name)}`;
                        }}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="More actions"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionsMenuId((id) => (id === investor.id ? null : investor.id));
                          }}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                        {openActionsMenuId === investor.id && (
                          <div className="absolute right-0 z-20 mt-1 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg text-sm">
                            <button
                              type="button"
                              className="block w-full px-3 py-2 text-left hover:bg-gray-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInvestor(investor);
                                setViewMode('detail');
                                setOpenActionsMenuId(null);
                              }}
                            >
                              Open profile
                            </button>
                            <button
                              type="button"
                              className="block w-full px-3 py-2 text-left hover:bg-gray-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                void navigator.clipboard.writeText(investor.id);
                                toast.success('Investor ID copied');
                                setOpenActionsMenuId(null);
                              }}
                            >
                              Copy investor ID
                            </button>
                            <button
                              type="button"
                              className="block w-full px-3 py-2 text-left hover:bg-gray-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                void navigator.clipboard.writeText(investor.email);
                                toast.success('Email copied');
                                setOpenActionsMenuId(null);
                              }}
                            >
                              Copy email
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInvestors.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-300 rounded-lg">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No investors found matching your filters</p>
          <Button variant="outline" className="mt-4" onClick={() => setFilters({
            status: 'all',
            tier: 'all',
            entityType: 'all',
            wholesaleExpiry: 'all',
            search: ''
          })}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

function getInvestmentsForInvestor(investor: any) {
  const seed = Math.max(investor.totalCommitted || 0, 500000);
  const templates = [
    { dealName: 'Sydney Commercial Property', strategy: 'Mortgage', status: 'active' as const, maturity: '2027-01-15' },
    { dealName: 'Tech SME Growth Loan', strategy: 'SME', status: 'active' as const, maturity: '2025-11-10' },
    { dealName: 'Equipment Finance Pool', strategy: 'Asset Finance', status: 'mature' as const, maturity: '2024-06-01' }
  ];
  const count = Math.max(1, Math.min(Number(investor.activeInvestments) || 3, templates.length));
  return templates.slice(0, count).map((t, i) => {
    const committed = Math.round(seed * (0.06 + i * 0.035));
    const deployed = Math.round(committed * 0.95);
    return {
      ...t,
      id: `${investor.id}-SPV-${String(i + 1).padStart(3, '0')}`,
      committed,
      deployed,
      startDate: investor.joinedDate,
      currentValue: Math.round(deployed * 1.052),
      return: 5 + i * 1.1
    };
  });
}

function getActivitiesForInvestor(investor: any) {
  return [
    { date: '2024-02-12 14:30', type: 'capital-call', description: `Capital call processed — ${investor.name}`, user: 'System' },
    { date: '2024-02-10 09:15', type: 'investment', description: `Allocation update for ${investor.id}`, user: 'System' },
    { date: '2024-02-08 16:45', type: 'screening', description: 'Annual PEP screening completed', user: 'Compliance Team' },
    { date: '2024-02-08 16:43', type: 'screening', description: 'Annual sanctions screening completed', user: 'Compliance Team' },
    { date: '2024-01-15 11:20', type: 'document', description: 'Wholesale evidence on file reviewed', user: investor.primaryContact },
    { date: '2024-01-05 10:00', type: 'communication', description: `Email — performance pack to ${investor.email}`, user: 'Investor Relations' }
  ];
}

// Investor Detail View Component
function InvestorDetailView({
  investor,
  onBack,
  role,
  onPatch
}: {
  investor: any;
  onBack: () => void;
  role: string;
  onPatch: (id: string, updates: Record<string, any>) => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'investments' | 'documents' | 'compliance' | 'activity'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: investor.name,
    email: investor.email,
    phone: investor.phone,
    primaryContact: investor.primaryContact
  });

  useEffect(() => {
    setDraft({
      name: investor.name,
      email: investor.email,
      phone: investor.phone,
      primaryContact: investor.primaryContact
    });
    setIsEditing(false);
  }, [investor.id, investor.name, investor.email, investor.phone, investor.primaryContact]);

  const canEdit = ['cfo', 'compliance-officer', 'tenant-admin', 'fund-manager', 'investment-analyst', 'admin'].includes(role);

  const openMailto = () => {
    window.location.href = `mailto:${encodeURIComponent(investor.email)}?subject=${encodeURIComponent('IMFO — ' + investor.name)}`;
  };

  const handleFreezeToggle = () => {
    if (investor.status === 'frozen') {
      onPatch(investor.id, {
        status: 'active',
        frozenReason: undefined
      });
      toast.success('Account unfrozen');
    } else {
      onPatch(investor.id, {
        status: 'frozen',
        frozenReason: 'Manually frozen from registry'
      });
      toast.success('Account frozen');
    }
  };

  const handleSaveEdit = () => {
    onPatch(investor.id, { ...draft });
    setIsEditing(false);
    toast.success('Investor details saved');
  };

  const renewWholesaleEvidence = () => {
    const next = new Date();
    next.setFullYear(next.getFullYear() + 1);
    const expiry = next.toISOString().slice(0, 10);
    const updates: Record<string, any> = {
      wholesaleStatus: 'valid',
      wholesaleExpiry: expiry
    };
    if (investor.status === 'expired-wholesale') {
      updates.status = 'active';
    }
    onPatch(investor.id, updates);
    toast.success('Wholesale evidence recorded');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <X className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              {investor.entityType === 'individual' ? (
                <User className="w-8 h-8 text-indigo-600" />
              ) : investor.entityType === 'company' ? (
                <Building2 className="w-8 h-8 text-indigo-600" />
              ) : investor.entityType === 'trust' ? (
                <Shield className="w-8 h-8 text-indigo-600" />
              ) : (
                <Briefcase className="w-8 h-8 text-indigo-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{investor.name}</h1>
              <p className="text-gray-600 mt-1">{investor.id} • Joined {investor.joinedDate}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {investor.status === 'frozen' ? (
            <Button type="button" variant="outline" className="text-green-600 border-green-300 hover:bg-green-50" onClick={handleFreezeToggle}>
              <Unlock className="w-4 h-4 mr-2" />
              Unfreeze Account
            </Button>
          ) : (
            <Button type="button" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={handleFreezeToggle}>
              <Lock className="w-4 h-4 mr-2" />
              Freeze Account
            </Button>
          )}
          {canEdit && !isEditing && (
            <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {canEdit && isEditing && (
            <>
              <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setDraft({ name: investor.name, email: investor.email, phone: investor.phone, primaryContact: investor.primaryContact }); }}>
                Cancel
              </Button>
              <Button type="button" className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSaveEdit}>
                Save changes
              </Button>
            </>
          )}
          <Button type="button" variant="outline" onClick={openMailto}>
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
        </div>
      </div>

      {isEditing && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm font-medium text-gray-700">
            Legal name
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Email
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Phone
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={draft.phone}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Primary contact
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={draft.primaryContact}
              onChange={(e) => setDraft((d) => ({ ...d, primaryContact: e.target.value }))}
            />
          </label>
        </div>
      )}

      {/* Status Banner */}
      {investor.status === 'frozen' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">Account Frozen</p>
              <p className="text-sm text-red-700 mt-1">{investor.frozenReason}</p>
            </div>
          </div>
        </div>
      )}

      {investor.wholesaleStatus === 'expired' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-orange-900">Wholesale Evidence Expired</p>
              <p className="text-sm text-orange-700 mt-1">
                Expired on {investor.wholesaleExpiry}. New evidence required to continue investing.
              </p>
            </div>
            <Button type="button" size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50" onClick={renewWholesaleEvidence}>
              <Upload className="w-4 h-4 mr-2" />
              Upload New Evidence
            </Button>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <p className="text-xs text-gray-600">Tier Classification</p>
          </div>
          <p className="text-xl font-bold text-gray-900 capitalize mb-1">{investor.tier.replace('-', ' ')}</p>
          <p className="text-xs text-gray-600 capitalize">{investor.legalClassification}</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <p className="text-xs text-gray-600">Total Committed</p>
          </div>
          <p className="text-xl font-bold text-gray-900">${(investor.totalCommitted / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-600">
            ${(investor.totalDeployed / 1000000).toFixed(1)}M deployed
          </p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-xs text-gray-600">Active Investments</p>
          </div>
          <p className="text-xl font-bold text-gray-900">{investor.activeInvestments}</p>
          <p className="text-xs text-gray-600">Across {investor.strategyFlags.length} strategies</p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-orange-600" />
            <p className="text-xs text-gray-600">Exposure vs Limit</p>
          </div>
          <p className="text-xl font-bold text-gray-900">{investor.currentExposure.total}%</p>
          <p className="text-xs text-gray-600">of {investor.concentrationLimits.total}% limit</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="border-b border-gray-300">
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'investments', label: 'Investments', icon: Briefcase },
              { id: 'documents', label: 'Documents', icon: Upload },
              { id: 'compliance', label: 'Compliance', icon: Shield },
              { id: 'activity', label: 'Activity', icon: Activity }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab investor={investor} />}
          {activeTab === 'investments' && <InvestmentsTab investor={investor} />}
          {activeTab === 'documents' && <DocumentsTab investor={investor} />}
          {activeTab === 'compliance' && <ComplianceTab investor={investor} />}
          {activeTab === 'activity' && <ActivityTab investor={investor} />}
        </div>
      </div>
    </div>
  );
}

// Tab Components
function OverviewTab({ investor }: any) {
  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{investor.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{investor.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Primary Contact</p>
              <p className="font-medium text-gray-900">{investor.primaryContact}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-medium text-gray-900">{investor.joinedDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tier & Limits */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Tier & Concentration Limits</h3>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-indigo-600 mb-1">Per SPV Limit</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-indigo-900">{investor.currentExposure.perSPV}%</p>
                <p className="text-sm text-indigo-700">/ {investor.concentrationLimits.perSPV}%</p>
              </div>
              <div className="w-full h-2 bg-indigo-200 rounded-full mt-2">
                <div 
                  className="h-2 bg-indigo-600 rounded-full"
                  style={{ width: `${(investor.currentExposure.perSPV / investor.concentrationLimits.perSPV) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-indigo-600 mb-1">Per Sector Limit</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-indigo-900">{investor.currentExposure.perSector}%</p>
                <p className="text-sm text-indigo-700">/ {investor.concentrationLimits.perSector}%</p>
              </div>
              <div className="w-full h-2 bg-indigo-200 rounded-full mt-2">
                <div 
                  className="h-2 bg-indigo-600 rounded-full"
                  style={{ width: `${(investor.currentExposure.perSector / investor.concentrationLimits.perSector) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-indigo-600 mb-1">Total Fund Limit</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-indigo-900">{investor.currentExposure.total}%</p>
                <p className="text-sm text-indigo-700">/ {investor.concentrationLimits.total}%</p>
              </div>
              <div className="w-full h-2 bg-indigo-200 rounded-full mt-2">
                <div 
                  className="h-2 bg-indigo-600 rounded-full"
                  style={{ width: `${(investor.currentExposure.total / investor.concentrationLimits.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-indigo-200">
            <p className="text-xs text-indigo-600 mb-2">Strategy Access Flags</p>
            <div className="flex flex-wrap gap-2">
              {investor.strategyFlags.map((flag: string) => (
                <span key={flag} className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-medium">
                  {flag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Capital Summary */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Capital Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600 mb-1">Total Committed</p>
            <p className="text-2xl font-bold text-blue-900">${(investor.totalCommitted / 1000000).toFixed(2)}M</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600 mb-1">Called</p>
            <p className="text-2xl font-bold text-green-900">${(investor.totalCalled / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-green-700 mt-1">
              {((investor.totalCalled / Math.max(investor.totalCommitted, 1)) * 100).toFixed(0)}% of committed
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-600 mb-1">Deployed</p>
            <p className="text-2xl font-bold text-purple-900">${(investor.totalDeployed / 1000000).toFixed(2)}M</p>
            <p className="text-xs text-purple-700 mt-1">
              {((investor.totalDeployed / Math.max(investor.totalCalled, 1)) * 100).toFixed(0)}% of called
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvestmentsTab({ investor }: any) {
  const mockInvestments = useMemo(() => getInvestmentsForInvestor(investor), [investor]);

  const exportInvestmentsCsv = () => {
    const header = ['id', 'dealName', 'strategy', 'committed', 'deployed', 'currentValue', 'returnPct', 'status', 'maturity'];
    const rows = mockInvestments.map((inv: any) => ({
      id: inv.id,
      dealName: inv.dealName,
      strategy: inv.strategy,
      committed: inv.committed,
      deployed: inv.deployed,
      currentValue: inv.currentValue,
      returnPct: inv.return,
      status: inv.status,
      maturity: inv.maturity
    }));
    const csv = [header.join(','), ...rows.map((r: any) => header.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investments-${investor.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Investment report exported (CSV)');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Investment Portfolio</h3>
        <Button type="button" variant="outline" size="sm" onClick={exportInvestmentsCsv}>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {mockInvestments.map((investment: any) => (
        <div key={investment.id} className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">{investment.dealName}</h4>
              <p className="text-sm text-gray-600">{investment.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                {investment.strategy}
              </span>
              {investment.status === 'active' ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  Matured
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Committed</p>
              <p className="font-semibold text-gray-900">${(investment.committed / 1000).toFixed(0)}K</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Deployed</p>
              <p className="font-semibold text-gray-900">${(investment.deployed / 1000).toFixed(0)}K</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Current Value</p>
              <p className="font-semibold text-green-600">${(investment.currentValue / 1000).toFixed(0)}K</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Return</p>
              <p className="font-semibold text-green-600">+{investment.return.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Maturity</p>
              <p className="font-semibold text-gray-900">{investment.maturity}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DocumentsTab({ investor }: any) {
  const documents = [
    { type: 'KYC', name: 'Certificate of Incorporation', date: investor.joinedDate, status: 'verified' },
    { type: 'KYC', name: 'Company Constitution', date: investor.joinedDate, status: 'verified' },
    { type: 'KYC', name: 'Directors ID - ' + investor.primaryContact, date: investor.joinedDate, status: 'verified' },
    { type: 'Wholesale', name: 'Accountant Certificate', date: investor.wholesaleExpiry, status: investor.wholesaleStatus },
    { type: 'Tax', name: 'Tax File Number Declaration', date: investor.joinedDate, status: 'verified' }
  ];

  return (
    <div className="space-y-4">
      {documents.map((doc, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">{doc.name}</p>
              <p className="text-sm text-gray-600">{doc.type} • Uploaded {doc.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {doc.status === 'verified' || doc.status === 'valid' ? (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                Expired
              </span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                toast.message(`Preview: ${doc.name}`, { description: `${investor.name} • ${doc.type}` });
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const body = `Document: ${doc.name}\nInvestor: ${investor.name} (${investor.id})\nType: ${doc.type}\nDate: ${doc.date}\nStatus: ${doc.status}`;
                const blob = new Blob([body], { type: 'text/plain;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${investor.id}-${doc.type}-${idx}.txt`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success('Download started');
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ComplianceTab({ investor }: any) {
  return (
    <div className="space-y-6">
      {/* KYC Status */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">KYC Verification</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Identity Verification</p>
                <p className="text-sm text-green-700">All required documents verified</p>
              </div>
            </div>
            <span className="text-sm text-green-600">Expires {investor.kycExpiry}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">PEP Screening</p>
                <p className="text-sm text-green-700">
                  {investor.pepScreening === 'clear' ? 'No matches found' : 'Under review'}
                </p>
              </div>
            </div>
            <span className="text-sm text-green-600">Last run {investor.lastScreeningDate}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Sanctions Screening</p>
                <p className="text-sm text-green-700">Clear - no matches</p>
              </div>
            </div>
            <span className="text-sm text-green-600">Last run {investor.lastScreeningDate}</span>
          </div>
        </div>
      </div>

      {/* Wholesale Status */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Wholesale Investor Status</h3>
        <div className={`p-4 border rounded-lg ${
          investor.wholesaleStatus === 'valid' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            {investor.wholesaleStatus === 'valid' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <p className={`font-medium ${
              investor.wholesaleStatus === 'valid' ? 'text-green-900' : 'text-red-900'
            }`}>
              {investor.wholesaleType === 'accountant-certificate' && 'Accountant Certificate - Section 708(8)'}
              {investor.wholesaleType === 'net-assets' && 'Net Assets > $2.5M - Section 708(8)'}
              {investor.wholesaleType === 'professional-investor' && 'Professional Investor - Section 708(11)'}
            </p>
          </div>
          <p className={`text-sm ${
            investor.wholesaleStatus === 'valid' ? 'text-green-700' : 'text-red-700'
          }`}>
            {investor.wholesaleStatus === 'valid' 
              ? `Valid until ${investor.wholesaleExpiry}` 
              : `Expired on ${investor.wholesaleExpiry} - New evidence required`
            }
          </p>
        </div>
      </div>
    </div>
  );
}

function ActivityTab({ investor }: any) {
  const activities = useMemo(() => getActivitiesForInvestor(investor), [investor]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'capital-call': return CreditCard;
      case 'investment': return TrendingUp;
      case 'screening': return Shield;
      case 'document': return FileText;
      case 'communication': return Mail;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-3">
      {activities.map((activity, idx) => {
        const Icon = getActivityIcon(activity.type);
        return (
          <div key={idx} className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg">
            <Icon className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{activity.description}</p>
              <p className="text-sm text-gray-600 mt-1">{activity.user} • {activity.date}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

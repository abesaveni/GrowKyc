import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Search,
  Filter,
  Users,
  Building2,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Home,
  ChevronRight
} from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';

interface ClientRegistryProps {
  onViewClient: (clientId: string) => void;
  onBack: () => void;
  onAddClient?: () => void;
}

type ClientType = 'all' | 'individual' | 'company' | 'trust' | 'fund';
type RiskTier = 'all' | 'critical' | 'high' | 'medium' | 'low';

export function ClientRegistry({ onViewClient, onBack, onAddClient }: ClientRegistryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [clientType, setClientType] = useState<ClientType>('all');
  const [riskFilter, setRiskFilter] = useState<RiskTier>('all');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [clients, setClients] = useState([
    {
      id: 'client-001',
      name: 'Horizon Capital Pty Ltd',
      type: 'company',
      abn: '12 345 678 901',
      riskTier: 'critical',
      kycStatus: 'aml_alert',
      lastReview: '2026-02-01',
      engagementStatus: 'Suspended'
    },
    {
      id: 'client-002',
      name: 'Margaret Chen',
      type: 'individual',
      dob: '1978-03-15',
      riskTier: 'high',
      kycStatus: 'overdue',
      lastReview: '2025-12-30',
      engagementStatus: 'Active - High Risk'
    },
    {
      id: 'client-003',
      name: 'Phoenix Investments Ltd',
      type: 'company',
      abn: '98 765 432 101',
      riskTier: 'high',
      kycStatus: 'pep_detected',
      lastReview: '2026-02-10',
      engagementStatus: 'Active - High Risk'
    },
    {
      id: 'client-004',
      name: 'Brighton Property Group',
      type: 'trust',
      abn: '11 222 333 444',
      riskTier: 'medium',
      kycStatus: 'pending_verification',
      lastReview: '2026-01-15',
      engagementStatus: 'Active'
    },
    {
      id: 'client-005',
      name: 'Stewart & Associates',
      type: 'company',
      abn: '55 666 777 888',
      riskTier: 'medium',
      kycStatus: 'id_expiring',
      lastReview: '2026-02-01',
      engagementStatus: 'Active'
    },
    {
      id: 'client-006',
      name: 'Redwood Enterprises',
      type: 'company',
      abn: '77 888 999 000',
      riskTier: 'critical',
      kycStatus: 'aml_alert',
      lastReview: '2026-02-01',
      engagementStatus: 'Suspended'
    },
    {
      id: 'client-007',
      name: 'Marcus Williamson',
      type: 'individual',
      dob: '1985-07-22',
      riskTier: 'medium',
      kycStatus: 'verification_failed',
      lastReview: '2026-02-10',
      engagementStatus: 'Restricted'
    },
    {
      id: 'client-008',
      name: 'Zenith Growth Fund',
      type: 'fund',
      abn: '33 444 555 666',
      riskTier: 'medium',
      kycStatus: 'current',
      lastReview: '2026-02-12',
      engagementStatus: 'Active'
    },
    {
      id: 'client-009',
      name: 'Sarah Mitchell',
      type: 'individual',
      dob: '1990-11-08',
      riskTier: 'low',
      kycStatus: 'current',
      lastReview: '2026-02-14',
      engagementStatus: 'Active'
    },
    {
      id: 'client-010',
      name: 'Vertex Developments',
      type: 'company',
      abn: '22 333 444 555',
      riskTier: 'low',
      kycStatus: 'current',
      lastReview: '2026-02-13',
      engagementStatus: 'Active'
    }
  ]);

  const kycStatusConfig = {
    current: {
      label: 'Current',
      color: 'bg-green-100 text-green-700 border-green-300',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    overdue: {
      label: 'CDD Overdue',
      color: 'bg-red-100 text-red-700 border-red-300',
      icon: XCircle,
      iconColor: 'text-red-600'
    },
    aml_alert: {
      label: 'AML Alert',
      color: 'bg-red-100 text-red-700 border-red-300',
      icon: AlertTriangle,
      iconColor: 'text-red-600'
    },
    pep_detected: {
      label: 'PEP Detected',
      color: 'bg-orange-100 text-orange-700 border-orange-300',
      icon: AlertTriangle,
      iconColor: 'text-orange-600'
    },
    pending_verification: {
      label: 'Pending Verification',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      icon: Clock,
      iconColor: 'text-yellow-600'
    },
    id_expiring: {
      label: 'ID Expiring Soon',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      icon: Clock,
      iconColor: 'text-yellow-600'
    },
    verification_failed: {
      label: 'Verification Failed',
      color: 'bg-orange-100 text-orange-700 border-orange-300',
      icon: XCircle,
      iconColor: 'text-orange-600'
    }
  };

  const riskTierConfig = {
    critical: { label: 'Critical', color: 'bg-red-600 text-white' },
    high: { label: 'High', color: 'bg-orange-600 text-white' },
    medium: { label: 'Medium', color: 'bg-yellow-600 text-white' },
    low: { label: 'Low', color: 'bg-green-600 text-white' }
  };

  const engagementStatusConfig = {
    'Active': 'bg-green-100 text-green-700 border-green-300',
    'Active - High Risk': 'bg-orange-100 text-orange-700 border-orange-300',
    'Restricted': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Suspended': 'bg-red-100 text-red-700 border-red-300',
    'Offboarding': 'bg-[#0a0e17] text-slate-300 border-gray-300',
    'Closed': 'bg-[#0a0e17] text-slate-300 border-gray-300'
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.abn && client.abn.includes(searchTerm));
    const matchesType = clientType === 'all' || client.type === clientType;
    const matchesRisk = riskFilter === 'all' || client.riskTier === riskFilter;
    return matchesSearch && matchesType && matchesRisk;
  });

  const stats = {
    total: clients.length,
    critical: clients.filter((c) => c.riskTier === 'critical').length,
    high: clients.filter((c) => c.riskTier === 'high').length,
    overdue: clients.filter((c) => c.kycStatus === 'overdue' || c.kycStatus === 'aml_alert').length,
    restricted: clients.filter((c) => c.engagementStatus.includes('Restricted') || c.engagementStatus.includes('Suspended')).length
  };

  const handleCreateClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nextType = String(formData.get('clientType') || 'individual') as Exclude<ClientType, 'all'>;
    const fullName = String(formData.get('fullName') || '').trim();
    const abn = String(formData.get('abn') || '').trim();

    if (!fullName) {
      return;
    }

    const newClient = {
      id: `client-${String(Date.now())}`,
      name: fullName,
      type: nextType,
      abn: abn || undefined,
      riskTier: 'low' as const,
      kycStatus: 'pending_verification' as const,
      lastReview: new Date().toISOString().slice(0, 10),
      engagementStatus: 'Active'
    };

    setClients((prev) => [newClient, ...prev]);
    setShowAddClientModal(false);
    onAddClient?.();
    e.currentTarget.reset();
  };

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: onBack },
          { label: 'Client Registry', active: true }
        ]}
      />

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Client Registry</h1>
            <p className="text-slate-300 mt-1">Complete client database with KYC and risk status</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddClientModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Client
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Total Clients</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-300 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-semibold">Critical Risk</p>
                <p className="text-3xl font-bold text-red-700 mt-1">{stats.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-300 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-semibold">High Risk</p>
                <p className="text-3xl font-bold text-orange-700 mt-1">{stats.high}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-300 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-semibold">Overdue</p>
                <p className="text-3xl font-bold text-yellow-700 mt-1">{stats.overdue}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-300 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-semibold">Restricted</p>
                <p className="text-3xl font-bold text-purple-700 mt-1">{stats.restricted}</p>
              </div>
              <XCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or ABN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Client Type</label>
              <select
                value={clientType}
                onChange={(e) => setClientType(e.target.value as ClientType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="individual">Individual</option>
                <option value="company">Company</option>
                <option value="trust">Trust</option>
                <option value="fund">Fund</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Risk Tier</label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as RiskTier)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Risk Levels</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client List */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>
            Client List ({filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {filteredClients.map((client) => {
              const kycStatus = kycStatusConfig[client.kycStatus as keyof typeof kycStatusConfig];
              const KycIcon = kycStatus.icon;
              const riskConfig = riskTierConfig[client.riskTier as keyof typeof riskTierConfig];

              return (
                <div
                  key={client.id}
                  className="p-4 bg-[#0a0e17] border-2 border-white/10 rounded-lg hover:shadow-lg transition-all cursor-pointer hover:border-blue-400"
                  onClick={() => onViewClient(client.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {client.type === 'individual' ? (
                          <User className="w-6 h-6 text-blue-600" />
                        ) : (
                          <Building2 className="w-6 h-6 text-blue-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-white">{client.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${riskConfig.color}`}>
                            {riskConfig.label} Risk
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold border ${
                              engagementStatusConfig[client.engagementStatus as keyof typeof engagementStatusConfig]
                            }`}
                          >
                            {client.engagementStatus}
                          </span>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-slate-300">
                          <span className="capitalize">{client.type}</span>
                          {client.abn && <span>ABN: {client.abn}</span>}
                          {client.dob && <span>DOB: {client.dob}</span>}
                          <span>Last Review: {client.lastReview}</span>
                        </div>

                        <div className="mt-2">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded border ${kycStatus.color}`}>
                            <KycIcon className={`w-4 h-4 ${kycStatus.iconColor}`} />
                            <span className="text-xs font-semibold">{kycStatus.label}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d121d] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0d121d]">
              <h2 className="text-xl font-bold text-white">Add New Client</h2>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="text-slate-400 hover:text-slate-300"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 space-y-6">
              {/* Client Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Client Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="clientType"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select client type...</option>
                  <option value="individual">Individual</option>
                  <option value="company">Company / Corporation</option>
                  <option value="trust">Trust</option>
                  <option value="fund">Fund / Investment Vehicle</option>
                </select>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Full Name / Entity Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    required
                    placeholder="e.g., John Smith or ABC Pty Ltd"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    ABN / ACN (if applicable)
                  </label>
                  <input
                    name="abn"
                    type="text"
                    placeholder="XX XXX XXX XXX"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="client@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    placeholder="+61 4XX XXX XXX"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  name="address"
                  type="text"
                  required
                  placeholder="Street address"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Postcode"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Risk Assessment */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Initial Risk Tier <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Assess risk level...</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                  <option value="critical">Critical Risk</option>
                </select>
                <p className="text-xs text-slate-400 mt-1">
                  Risk tier determines CDD frequency and monitoring requirements
                </p>
              </div>

              {/* Source of Wealth */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Source of Wealth / Funds <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the source of wealth or funds..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* PEP Screening */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-900 mb-2">
                      AML/CTF Compliance Required
                    </p>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" required />
                      <span className="text-sm text-yellow-800">
                        I confirm PEP screening will be conducted before engagement
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddClientModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </div>

              <div className="text-xs text-slate-400 text-center pt-2">
                Client will be added to registry with status "Pending Verification"
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
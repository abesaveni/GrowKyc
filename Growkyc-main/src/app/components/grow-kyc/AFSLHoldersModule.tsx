import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Briefcase,
  User,
  Users,
  TrendingUp,
  FileText,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Shield,
  Eye,
  Edit,
  Plus,
  Award,
  Wallet,
  Building2,
  Clock,
  Target,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  type: 'individual' | 'company' | 'trust' | 'smsf';
  classification: 'retail' | 'wholesale' | 'sophisticated';
  investmentValue: number;
  adviser: string;
  kycStatus: 'complete' | 'pending' | 'incomplete';
  riskProfile: 'conservative' | 'balanced' | 'growth' | 'aggressive';
  feeConsentStatus: 'signed' | 'pending' | 'expired';
  lastReview: string;
  nextReview: string;
  complianceStatus: 'approved' | 'pending' | 'flagged';
}

interface AFSLHoldersModuleProps {
  onBack: () => void;
}

export function AFSLHoldersModule({ onBack }: AFSLHoldersModuleProps) {
  const [selectedTab, setSelectedTab] = useState<'clients' | 'classification' | 'compliance'>('clients');

  const clients: Client[] = [
    {
      id: 'client-1',
      name: 'Margaret Thompson',
      type: 'individual',
      classification: 'wholesale',
      investmentValue: 3200000,
      adviser: 'Sarah Chen',
      kycStatus: 'complete',
      riskProfile: 'balanced',
      feeConsentStatus: 'signed',
      lastReview: '2026-01-15',
      nextReview: '2027-01-15',
      complianceStatus: 'approved'
    },
    {
      id: 'client-2',
      name: 'Thompson Family Trust',
      type: 'trust',
      classification: 'wholesale',
      investmentValue: 5800000,
      adviser: 'Sarah Chen',
      kycStatus: 'complete',
      riskProfile: 'growth',
      feeConsentStatus: 'signed',
      lastReview: '2026-02-01',
      nextReview: '2027-02-01',
      complianceStatus: 'approved'
    },
    {
      id: 'client-3',
      name: 'David Martinez',
      type: 'individual',
      classification: 'retail',
      investmentValue: 180000,
      adviser: 'Michael Wong',
      kycStatus: 'pending',
      riskProfile: 'conservative',
      feeConsentStatus: 'pending',
      lastReview: '2025-11-20',
      nextReview: '2026-11-20',
      complianceStatus: 'pending'
    },
    {
      id: 'client-4',
      name: 'Martinez Super Fund',
      type: 'smsf',
      classification: 'retail',
      investmentValue: 920000,
      adviser: 'Michael Wong',
      kycStatus: 'complete',
      riskProfile: 'balanced',
      feeConsentStatus: 'signed',
      lastReview: '2026-03-01',
      nextReview: '2027-03-01',
      complianceStatus: 'approved'
    },
    {
      id: 'client-5',
      name: 'Tech Ventures Pty Ltd',
      type: 'company',
      classification: 'sophisticated',
      investmentValue: 12500000,
      adviser: 'Sarah Chen',
      kycStatus: 'incomplete',
      riskProfile: 'aggressive',
      feeConsentStatus: 'pending',
      lastReview: '2025-12-10',
      nextReview: '2026-12-10',
      complianceStatus: 'flagged'
    }
  ];

  const stats = {
    totalClients: clients.length,
    wholesaleClients: clients.filter(c => c.classification === 'wholesale').length,
    retailClients: clients.filter(c => c.classification === 'retail').length,
    totalAUM: clients.reduce((sum, c) => sum + c.investmentValue, 0),
    pendingReview: clients.filter(c => c.kycStatus !== 'complete').length
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'wholesale': return 'bg-purple-600 text-white';
      case 'sophisticated': return 'bg-indigo-600 text-white';
      case 'retail': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-600 text-white';
      case 'pending': return 'bg-amber-600 text-white';
      case 'incomplete': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getRiskProfileColor = (profile: string) => {
    switch (profile) {
      case 'aggressive': return 'text-red-600 bg-red-100 border-red-300';
      case 'growth': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'balanced': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'conservative': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-slate-300 bg-[#0a0e17] border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#0d121d]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-8 py-12">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Modules
        </Button>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">AFSL Holders Module</h1>
            <p className="text-white/90 text-xl">Financial adviser KYC • Investor classification • Advice compliance</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total Clients</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalClients}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Wholesale</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.wholesaleClients}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Retail</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.retailClients}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total AUM</div>
            </div>
            <div className="text-3xl font-bold mb-1">${(stats.totalAUM / 1000000).toFixed(1)}M</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Pending Review</div>
            </div>
            <div className="text-4xl font-bold mb-1 text-amber-300">{stats.pendingReview}</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant={selectedTab === 'clients' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('clients')}
          >
            <Users className="w-4 h-4 mr-2" />
            Clients
          </Button>
          <Button
            variant={selectedTab === 'classification' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('classification')}
          >
            <Award className="w-4 h-4 mr-2" />
            Investor Classification
          </Button>
          <Button
            variant={selectedTab === 'compliance' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('compliance')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Compliance Dashboard
          </Button>

          <div className="flex-1" />

          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </div>

        {selectedTab === 'clients' && (
          <div className="space-y-6">
            {clients.map((client) => {
              const ClientIcon = client.type === 'individual' ? User : client.type === 'company' ? Building2 : Shield;
              
              return (
                <Card key={client.id} className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                          client.complianceStatus === 'flagged'
                            ? 'bg-red-100'
                            : client.complianceStatus === 'pending'
                            ? 'bg-amber-100'
                            : 'bg-green-100'
                        }`}>
                          <ClientIcon className={`w-8 h-8 ${
                            client.complianceStatus === 'flagged'
                              ? 'text-red-600'
                              : client.complianceStatus === 'pending'
                              ? 'text-amber-600'
                              : 'text-green-600'
                          }`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-white">{client.name}</h3>
                            <Badge variant="outline" className="capitalize">{client.type}</Badge>
                            <Badge className={getClassificationColor(client.classification)}>
                              {client.classification}
                            </Badge>
                            <Badge className={getKycStatusColor(client.kycStatus)}>
                              KYC: {client.kycStatus}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-4 gap-6 mb-4">
                            <div>
                              <div className="text-sm text-slate-300 mb-1">Investment Value</div>
                              <div className="text-xl font-bold text-white">
                                ${(client.investmentValue / 1000000).toFixed(2)}M
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-300 mb-1">Risk Profile</div>
                              <Badge className={getRiskProfileColor(client.riskProfile)}>
                                {client.riskProfile}
                              </Badge>
                            </div>
                            <div>
                              <div className="text-sm text-slate-300 mb-1">Adviser</div>
                              <div className="text-sm font-semibold text-white">{client.adviser}</div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-300 mb-1">Fee Consent</div>
                              <Badge className={client.feeConsentStatus === 'signed' ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'}>
                                {client.feeConsentStatus}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-[#0a0e17] rounded-lg">
                              <div className="text-xs text-slate-300 mb-1">Last Review</div>
                              <div className="font-semibold text-white">{client.lastReview}</div>
                            </div>
                            <div className="p-3 bg-[#0a0e17] rounded-lg">
                              <div className="text-xs text-slate-300 mb-1">Next Review</div>
                              <div className="font-semibold text-white">{client.nextReview}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </Button>
                        {client.kycStatus !== 'complete' && (
                          <Button size="sm">
                            <Shield className="w-4 h-4 mr-2" />
                            Complete KYC
                          </Button>
                        )}
                        {client.feeConsentStatus === 'pending' && (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <FileText className="w-4 h-4 mr-2" />
                            Send Consent
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {selectedTab === 'classification' && (
          <div className="space-y-6">
            {/* Classification Engine */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Investor Classification Engine
                </CardTitle>
                <CardDescription>Auto-determine retail vs wholesale vs sophisticated investor status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div className="p-6 bg-[#0d121d] rounded-xl border-2 border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Retail Investor</h4>
                        <p className="text-sm text-slate-300">{stats.retailClients} clients</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Standard protections apply
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        SOA required
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Fee consent mandatory
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Annual review required
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-[#0d121d] rounded-xl border-2 border-indigo-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Wholesale Investor</h4>
                        <p className="text-sm text-slate-300">{stats.wholesaleClients} clients</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        $2.5M+ net assets OR
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        $250K+ annual income
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Accountant certificate required
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Reduced disclosure obligations
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-[#0d121d] rounded-xl border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Sophisticated</h4>
                        <p className="text-sm text-slate-300">1 client</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Professional investor
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Complex products eligible
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Enhanced due diligence
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        Quarterly review cycle
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Evidence Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Classification Evidence Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-white mb-3">Wholesale Investor Evidence</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        Accountant's certificate (s761G)
                      </li>
                      <li className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        Audited financial statements
                      </li>
                      <li className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        Tax returns (last 2 years)
                      </li>
                      <li className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        Asset valuation reports
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-3">Sophisticated Investor Evidence</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        Professional qualifications
                      </li>
                      <li className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        Investment track record
                      </li>
                      <li className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        Accountant attestation
                      </li>
                      <li className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        Portfolio holdings summary
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'compliance' && (
          <div className="space-y-6">
            {/* Fee Consent Tracking */}
            <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Fee Consent Status
                </CardTitle>
                <CardDescription>ASIC consent requirements tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clients.filter(c => c.feeConsentStatus !== 'signed').map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 bg-[#0d121d] rounded-lg border-2 border-amber-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                          <AlertCircle className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{client.name}</div>
                          <div className="text-sm text-slate-300">Advised by: {client.adviser}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={client.feeConsentStatus === 'expired' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'}>
                          {client.feeConsentStatus}
                        </Badge>
                        <Button size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Send Consent Form
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Annual Review Cycle */}
            <Card>
              <CardHeader>
                <CardTitle>Ongoing Client Review Cycle</CardTitle>
                <CardDescription>Automated annual and biennial reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 bg-[#0a0e17] rounded-lg border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{client.name}</div>
                          <div className="text-sm text-slate-300">Last review: {client.lastReview}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm text-slate-300">Next Review</div>
                          <div className="font-bold text-white">{client.nextReview}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Target className="w-4 h-4 mr-2" />
                          Trigger Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Integrations */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
              <CardHeader>
                <CardTitle>Portfolio Platform Integration</CardTitle>
                <CardDescription>Connect with HUB24, Netwealth, Praemium</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'HUB24', status: 'Connected', clients: 3 },
                    { name: 'Netwealth', status: 'Disconnected', clients: 0 },
                    { name: 'Praemium', status: 'Disconnected', clients: 0 }
                  ].map((platform, idx) => (
                    <div key={idx} className="p-4 bg-[#0d121d] rounded-lg border border-indigo-200">
                      <div className="font-bold text-white mb-2">{platform.name}</div>
                      <div className="text-sm text-slate-300 mb-3">
                        {platform.status === 'Connected' ? `${platform.clients} clients synced` : 'Not connected'}
                      </div>
                      <Button
                        size="sm"
                        variant={platform.status === 'Connected' ? 'outline' : 'default'}
                        className="w-full"
                      >
                        {platform.status === 'Connected' ? 'Configure' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

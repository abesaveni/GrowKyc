import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  TrendingUp,
  User,
  Users,
  Building2,
  Shield,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Plus,
  Target,
  Clock,
  AlertTriangle,
  Crown,
  Wallet,
  RefreshCw
} from 'lucide-react';

interface Investor {
  id: string;
  name: string;
  type: 'individual' | 'entity';
  investorType: 'wholesale' | 'institutional' | 'retail';
  subscriptionAmount: number;
  status: 'active' | 'pending' | 'redeemed';
  kycStatus: 'complete' | 'pending' | 'incomplete';
  uboCount: number;
  sourceOfWealth: string;
  riskLevel: 'low' | 'medium' | 'high';
  trusteeApproved: boolean;
  managerApproved: boolean;
  lastScreening: string;
  nextScreening: string;
}

interface FundManagersModuleProps {
  onBack: () => void;
}

export function FundManagersModule({ onBack }: FundManagersModuleProps) {
  const [selectedTab, setSelectedTab] = useState<'investors' | 'subscriptions' | 'compliance'>('investors');

  const investors: Investor[] = [
    {
      id: 'inv-1',
      name: 'Sterling Capital Partners',
      type: 'entity',
      investorType: 'institutional',
      subscriptionAmount: 25000000,
      status: 'active',
      kycStatus: 'complete',
      uboCount: 3,
      sourceOfWealth: 'Investment fund',
      riskLevel: 'low',
      trusteeApproved: true,
      managerApproved: true,
      lastScreening: '2026-03-01',
      nextScreening: '2026-04-01'
    },
    {
      id: 'inv-2',
      name: 'Thompson Family Trust',
      type: 'entity',
      investorType: 'wholesale',
      subscriptionAmount: 5000000,
      status: 'active',
      kycStatus: 'complete',
      uboCount: 2,
      sourceOfWealth: 'Business sale proceeds',
      riskLevel: 'low',
      trusteeApproved: true,
      managerApproved: true,
      lastScreening: '2026-02-15',
      nextScreening: '2026-05-15'
    },
    {
      id: 'inv-3',
      name: 'David Martinez',
      type: 'individual',
      investorType: 'wholesale',
      subscriptionAmount: 1200000,
      status: 'active',
      kycStatus: 'complete',
      uboCount: 0,
      sourceOfWealth: 'Property sale',
      riskLevel: 'low',
      trusteeApproved: true,
      managerApproved: true,
      lastScreening: '2026-03-10',
      nextScreening: '2026-06-10'
    },
    {
      id: 'inv-4',
      name: 'Offshore Holdings Ltd',
      type: 'entity',
      investorType: 'wholesale',
      subscriptionAmount: 8000000,
      status: 'pending',
      kycStatus: 'pending',
      uboCount: 5,
      sourceOfWealth: 'Multiple sources',
      riskLevel: 'high',
      trusteeApproved: false,
      managerApproved: false,
      lastScreening: '2026-03-18',
      nextScreening: '2026-04-18'
    }
  ];

  const stats = {
    totalInvestors: investors.length,
    activeInvestors: investors.filter(i => i.status === 'active').length,
    pendingApproval: investors.filter(i => !i.trusteeApproved || !i.managerApproved).length,
    totalCommitted: investors.reduce((sum, i) => sum + i.subscriptionAmount, 0),
    highRiskInvestors: investors.filter(i => i.riskLevel === 'high').length
  };

  const getInvestorTypeColor = (type: string) => {
    switch (type) {
      case 'institutional': return 'bg-purple-600 text-white';
      case 'wholesale': return 'bg-blue-600 text-white';
      case 'retail': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'pending': return 'bg-amber-600 text-white';
      case 'redeemed': return 'bg-gray-600 text-white';
      default: return 'bg-gray-400 text-white';
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

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100 border-red-300';
      case 'medium': return 'text-amber-600 bg-amber-100 border-amber-300';
      case 'low': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white px-8 py-12">
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
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">Fund Managers Module</h1>
            <p className="text-white/90 text-xl">Investor onboarding • Subscription approval • Registry management</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total Investors</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalInvestors}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Active</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.activeInvestors}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Pending Approval</div>
            </div>
            <div className="text-4xl font-bold mb-1 text-amber-300">{stats.pendingApproval}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total Committed</div>
            </div>
            <div className="text-3xl font-bold mb-1">${(stats.totalCommitted / 1000000).toFixed(1)}M</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">High Risk</div>
            </div>
            <div className="text-4xl font-bold mb-1 text-red-300">{stats.highRiskInvestors}</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant={selectedTab === 'investors' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('investors')}
          >
            <Users className="w-4 h-4 mr-2" />
            Investor Register
          </Button>
          <Button
            variant={selectedTab === 'subscriptions' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('subscriptions')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Subscriptions
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
            New Investor
          </Button>
        </div>

        {selectedTab === 'investors' && (
          <div className="space-y-6">
            {investors.map((investor) => {
              const InvestorIcon = investor.type === 'individual' ? User : Building2;
              
              return (
                <Card
                  key={investor.id}
                  className={`border-2 ${
                    investor.riskLevel === 'high'
                      ? 'border-red-200 bg-red-50'
                      : investor.status === 'pending'
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-green-200 bg-green-50'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                          investor.riskLevel === 'high'
                            ? 'bg-red-100'
                            : investor.status === 'pending'
                            ? 'bg-amber-100'
                            : 'bg-green-100'
                        }`}>
                          <InvestorIcon className={`w-8 h-8 ${
                            investor.riskLevel === 'high'
                              ? 'text-red-600'
                              : investor.status === 'pending'
                              ? 'text-amber-600'
                              : 'text-green-600'
                          }`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">{investor.name}</h3>
                            <Badge className={getInvestorTypeColor(investor.investorType)}>
                              {investor.investorType}
                            </Badge>
                            <Badge className={getStatusColor(investor.status)}>
                              {investor.status}
                            </Badge>
                            <Badge className={getKycStatusColor(investor.kycStatus)}>
                              KYC: {investor.kycStatus}
                            </Badge>
                            {investor.riskLevel === 'high' && (
                              <Badge className="bg-red-600 text-white">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                High Risk
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-4 gap-6 mb-4">
                            <div>
                              <div className="text-sm text-gray-600 mb-1">Subscription</div>
                              <div className="text-xl font-bold text-gray-900">
                                ${(investor.subscriptionAmount / 1000000).toFixed(2)}M
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 mb-1">UBOs Identified</div>
                              <div className="text-xl font-bold text-gray-900">
                                {investor.type === 'entity' ? investor.uboCount : 'N/A'}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 mb-1">Source of Wealth</div>
                              <div className="text-sm font-semibold text-gray-900">{investor.sourceOfWealth}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 mb-1">Risk Level</div>
                              <Badge className={getRiskColor(investor.riskLevel)}>
                                {investor.riskLevel}
                              </Badge>
                            </div>
                          </div>

                          {/* Approval Status */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className={`p-3 rounded-lg border-2 ${
                              investor.trusteeApproved
                                ? 'border-green-300 bg-green-100'
                                : 'border-amber-300 bg-amber-100'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700">Trustee Approval</span>
                                {investor.trusteeApproved ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Clock className="w-5 h-5 text-amber-600" />
                                )}
                              </div>
                            </div>

                            <div className={`p-3 rounded-lg border-2 ${
                              investor.managerApproved
                                ? 'border-green-300 bg-green-100'
                                : 'border-amber-300 bg-amber-100'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700">Manager Approval</span>
                                {investor.managerApproved ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Clock className="w-5 h-5 text-amber-600" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Screening Schedule */}
                          <div className="p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between text-sm">
                              <div>
                                <span className="text-gray-600">Last screening: </span>
                                <span className="font-semibold text-gray-900">{investor.lastScreening}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Next screening: </span>
                                <span className="font-semibold text-gray-900">{investor.nextScreening}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                        {investor.kycStatus !== 'complete' && (
                          <Button size="sm">
                            <Shield className="w-4 h-4 mr-2" />
                            Complete KYC
                          </Button>
                        )}
                        {!investor.trusteeApproved && investor.kycStatus === 'complete' && (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Crown className="w-4 h-4 mr-2" />
                            Trustee Review
                          </Button>
                        )}
                        {!investor.managerApproved && investor.kycStatus === 'complete' && (
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                            <Target className="w-4 h-4 mr-2" />
                            Manager Review
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

        {selectedTab === 'subscriptions' && (
          <div className="space-y-6">
            {/* Subscription Workflow */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Subscription Document Workflow
                </CardTitle>
                <CardDescription>Application → Payment → Acceptance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investors.map((investor) => (
                    <div key={investor.id} className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-blue-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{investor.name}</div>
                          <div className="text-sm text-gray-600">
                            ${(investor.subscriptionAmount / 1000000).toFixed(2)}M subscription
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={investor.status === 'active' ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'}>
                          {investor.status === 'active' ? 'Allocated' : 'Pending Acceptance'}
                        </Badge>
                        {investor.status === 'pending' && (
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept Subscription
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subscription Gate */}
            <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  No Subscription Until KYC Cleared
                </CardTitle>
                <CardDescription>Compliance gate prevents allocation before verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {investors.filter(i => i.kycStatus !== 'complete').map((investor) => (
                    <div key={investor.id} className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-red-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{investor.name}</div>
                          <div className="text-sm text-gray-600">KYC Status: {investor.kycStatus}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-red-600 text-white">
                          ${(investor.subscriptionAmount / 1000000).toFixed(2)}M blocked
                        </Badge>
                        <Button size="sm">
                          <Shield className="w-4 h-4 mr-2" />
                          Complete KYC
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'compliance' && (
          <div className="space-y-6">
            {/* Ongoing Monitoring */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                  Ongoing Investor Monitoring
                </CardTitle>
                <CardDescription>Auto-rescreen monthly for high-risk, quarterly for others</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {investors.map((investor) => (
                    <div key={investor.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <RefreshCw className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{investor.name}</div>
                          <div className="text-sm text-gray-600">
                            {investor.riskLevel === 'high' ? 'Monthly screening' : 'Quarterly screening'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-gray-600">Next Screening</div>
                          <div className="font-semibold text-gray-900">{investor.nextScreening}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Screen Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dual Approval Trail */}
            <Card>
              <CardHeader>
                <CardTitle>Trustee and Manager Sign-Off Trail</CardTitle>
                <CardDescription>Audit-ready approval records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {investors.map((investor) => (
                    <div key={investor.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-gray-900">{investor.name}</div>
                        <Badge className={
                          investor.trusteeApproved && investor.managerApproved
                            ? 'bg-green-600 text-white'
                            : 'bg-amber-600 text-white'
                        }>
                          {investor.trusteeApproved && investor.managerApproved ? 'Fully Approved' : 'Pending Approval'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Crown className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="text-sm text-gray-600">Trustee</div>
                            <div className="font-semibold text-gray-900">
                              {investor.trusteeApproved ? 'Approved ✓' : 'Pending'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Target className="w-5 h-5 text-indigo-600" />
                          <div>
                            <div className="text-sm text-gray-600">Manager</div>
                            <div className="font-semibold text-gray-900">
                              {investor.managerApproved ? 'Approved ✓' : 'Pending'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fund Registry Integration */}
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200">
              <CardHeader>
                <CardTitle>Fund Registry Integration</CardTitle>
                <CardDescription>Sync with Mainstream, Link, Apex</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'Mainstream', status: 'Connected', investors: 3 },
                    { name: 'Link Group', status: 'Disconnected', investors: 0 },
                    { name: 'Apex', status: 'Disconnected', investors: 0 }
                  ].map((registry, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-lg border border-indigo-200">
                      <div className="font-bold text-gray-900 mb-2">{registry.name}</div>
                      <div className="text-sm text-gray-600 mb-3">
                        {registry.status === 'Connected' ? `${registry.investors} investors synced` : 'Not connected'}
                      </div>
                      <Button
                        size="sm"
                        variant={registry.status === 'Connected' ? 'outline' : 'default'}
                        className="w-full"
                      >
                        {registry.status === 'Connected' ? 'Configure' : 'Connect'}
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

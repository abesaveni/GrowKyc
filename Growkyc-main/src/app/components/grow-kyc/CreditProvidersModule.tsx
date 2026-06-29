import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Landmark,
  User,
  Users,
  Shield,
  Home,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Lock,
  AlertTriangle,
  Target,
  Banknote,
  CreditCard,
  Building2,
  Eye,
  Edit,
  Plus
} from 'lucide-react';

interface Borrower {
  id: string;
  name: string;
  type: 'individual' | 'company' | 'trust';
  loanPurpose: string;
  loanAmount: number;
  lvr: number;
  kycStatus: 'complete' | 'pending' | 'incomplete';
  riskLevel: 'low' | 'medium' | 'high';
  guarantors: number;
  securityParties: number;
  settlementDate?: string;
  approvalStatus: 'approved' | 'pending' | 'declined' | 'conditional';
}

interface Deal {
  id: string;
  borrowerName: string;
  loanAmount: number;
  loanPurpose: string;
  securityValue: number;
  lvr: number;
  status: 'pre-approval' | 'assessment' | 'approved' | 'settled' | 'declined';
  kycGate: boolean; // true = blocked by KYC
  creditApproved: boolean;
  complianceApproved: boolean;
  settlementDate: string;
}

interface CreditProvidersModuleProps {
  onBack: () => void;
}

export function CreditProvidersModule({ onBack }: CreditProvidersModuleProps) {
  const [selectedTab, setSelectedTab] = useState<'deals' | 'borrowers' | 'compliance'>('deals');

  // Sample data
  const deals: Deal[] = [
    {
      id: 'deal-1',
      borrowerName: 'Smith Family Trust',
      loanAmount: 850000,
      loanPurpose: 'Investment Property Purchase',
      securityValue: 1200000,
      lvr: 70.8,
      status: 'approved',
      kycGate: false,
      creditApproved: true,
      complianceApproved: true,
      settlementDate: '2026-04-15'
    },
    {
      id: 'deal-2',
      borrowerName: 'ABC Manufacturing Pty Ltd',
      loanAmount: 2500000,
      loanPurpose: 'Business Acquisition',
      securityValue: 3800000,
      lvr: 65.8,
      status: 'assessment',
      kycGate: true,
      creditApproved: false,
      complianceApproved: false,
      settlementDate: '2026-05-01'
    },
    {
      id: 'deal-3',
      borrowerName: 'Johnson SMSF',
      loanAmount: 650000,
      loanPurpose: 'Commercial Property Investment',
      securityValue: 950000,
      lvr: 68.4,
      status: 'pre-approval',
      kycGate: true,
      creditApproved: false,
      complianceApproved: false,
      settlementDate: '2026-04-30'
    },
    {
      id: 'deal-4',
      borrowerName: 'Chen Holdings Ltd',
      loanAmount: 1200000,
      loanPurpose: 'Refinance',
      securityValue: 1800000,
      lvr: 66.7,
      status: 'settled',
      kycGate: false,
      creditApproved: true,
      complianceApproved: true,
      settlementDate: '2026-03-10'
    }
  ];

  const borrowers: Borrower[] = [
    {
      id: 'bor-1',
      name: 'Smith Family Trust',
      type: 'trust',
      loanPurpose: 'Investment Property',
      loanAmount: 850000,
      lvr: 70.8,
      kycStatus: 'complete',
      riskLevel: 'low',
      guarantors: 2,
      securityParties: 1,
      settlementDate: '2026-04-15',
      approvalStatus: 'approved'
    },
    {
      id: 'bor-2',
      name: 'ABC Manufacturing Pty Ltd',
      type: 'company',
      loanPurpose: 'Business Acquisition',
      loanAmount: 2500000,
      lvr: 65.8,
      kycStatus: 'pending',
      riskLevel: 'medium',
      guarantors: 3,
      securityParties: 2,
      settlementDate: '2026-05-01',
      approvalStatus: 'pending'
    },
    {
      id: 'bor-3',
      name: 'Johnson SMSF',
      type: 'trust',
      loanPurpose: 'Commercial Property',
      loanAmount: 650000,
      lvr: 68.4,
      kycStatus: 'incomplete',
      riskLevel: 'medium',
      guarantors: 0,
      securityParties: 1,
      settlementDate: '2026-04-30',
      approvalStatus: 'conditional'
    }
  ];

  const stats = {
    totalDeals: deals.length,
    blockedByKyc: deals.filter(d => d.kycGate).length,
    approved: deals.filter(d => d.status === 'approved').length,
    totalLoanValue: deals.reduce((sum, d) => sum + d.loanAmount, 0),
    avgLvr: deals.reduce((sum, d) => sum + d.lvr, 0) / deals.length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-600 text-white';
      case 'settled': return 'bg-blue-600 text-white';
      case 'assessment': return 'bg-purple-600 text-white';
      case 'pre-approval': return 'bg-amber-600 text-white';
      case 'declined': return 'bg-red-600 text-white';
      case 'pending': return 'bg-amber-600 text-white';
      case 'conditional': return 'bg-purple-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-600 text-white';
      case 'pending': return 'bg-amber-600 text-white';
      case 'incomplete': return 'bg-red-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100 border-red-300';
      case 'medium': return 'text-amber-600 bg-amber-100 border-amber-300';
      case 'low': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-slate-300 bg-[#0a0e17] border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#0d121d]">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white px-8 py-12">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
            <Landmark className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">Credit Providers Module</h1>
            <p className="text-white/90 text-xl">Lender KYC • Pre-settlement compliance • Deal management</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Active Deals</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalDeals}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Blocked by KYC</div>
            </div>
            <div className="text-4xl font-bold mb-1 text-red-300">{stats.blockedByKyc}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Approved</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.approved}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total Loan Value</div>
            </div>
            <div className="text-3xl font-bold mb-1">${(stats.totalLoanValue / 1000000).toFixed(1)}M</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Avg LVR</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.avgLvr.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant={selectedTab === 'deals' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('deals')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Deals
          </Button>
          <Button
            variant={selectedTab === 'borrowers' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('borrowers')}
          >
            <Users className="w-4 h-4 mr-2" />
            Borrowers
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
            New Loan Application
          </Button>
        </div>

        {selectedTab === 'deals' && (
          <div className="space-y-6">
            {deals.map((deal) => (
              <Card
                key={deal.id}
                className={`border-2 ${
                  deal.kycGate
                    ? 'border-red-300 bg-red-50'
                    : deal.status === 'approved'
                    ? 'border-green-300 bg-green-50'
                    : 'border-white/10'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-white">{deal.borrowerName}</h3>
                        <Badge className={getStatusColor(deal.status)}>
                          {deal.status}
                        </Badge>
                        {deal.kycGate && (
                          <Badge className="bg-red-600 text-white">
                            <Lock className="w-3 h-3 mr-1" />
                            KYC Blocked
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-6 mb-4">
                        <div>
                          <div className="text-sm text-slate-300 mb-1">Loan Amount</div>
                          <div className="text-2xl font-bold text-white">
                            ${deal.loanAmount.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-300 mb-1">Security Value</div>
                          <div className="text-2xl font-bold text-white">
                            ${deal.securityValue.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-300 mb-1">LVR</div>
                          <div className={`text-2xl font-bold ${
                            deal.lvr > 80 ? 'text-red-600' : deal.lvr > 70 ? 'text-amber-600' : 'text-green-600'
                          }`}>
                            {deal.lvr.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-300 mb-1">Settlement</div>
                          <div className="text-lg font-bold text-white">
                            {deal.settlementDate}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-slate-300 mb-1">Loan Purpose</div>
                        <div className="text-lg font-semibold text-white">{deal.loanPurpose}</div>
                      </div>

                      {/* Approval Gates */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className={`p-4 rounded-lg border-2 ${
                          deal.kycGate
                            ? 'border-red-300 bg-red-100'
                            : 'border-green-300 bg-green-100'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-slate-300">KYC / AML</span>
                            {deal.kycGate ? (
                              <Lock className="w-5 h-5 text-red-600" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <div className="text-xs text-slate-300">
                            {deal.kycGate ? 'Incomplete - blocking settlement' : 'Complete'}
                          </div>
                        </div>

                        <div className={`p-4 rounded-lg border-2 ${
                          deal.creditApproved
                            ? 'border-green-300 bg-green-100'
                            : 'border-amber-300 bg-amber-100'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-slate-300">Credit Approval</span>
                            {deal.creditApproved ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Clock className="w-5 h-5 text-amber-600" />
                            )}
                          </div>
                          <div className="text-xs text-slate-300">
                            {deal.creditApproved ? 'Approved by credit team' : 'Pending review'}
                          </div>
                        </div>

                        <div className={`p-4 rounded-lg border-2 ${
                          deal.complianceApproved
                            ? 'border-green-300 bg-green-100'
                            : 'border-amber-300 bg-amber-100'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-slate-300">Compliance</span>
                            {deal.complianceApproved ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Clock className="w-5 h-5 text-amber-600" />
                            )}
                          </div>
                          <div className="text-xs text-slate-300">
                            {deal.complianceApproved ? 'Cleared for settlement' : 'Awaiting sign-off'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Deal
                      </Button>
                      {deal.kycGate && (
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          <Shield className="w-4 h-4 mr-2" />
                          Complete KYC
                        </Button>
                      )}
                      {!deal.kycGate && !deal.creditApproved && (
                        <Button size="sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Review Credit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'borrowers' && (
          <div className="space-y-6">
            {borrowers.map((borrower) => {
              const BorrowerIcon = borrower.type === 'individual' ? User : borrower.type === 'company' ? Building2 : Shield;
              
              return (
                <Card key={borrower.id} className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                          borrower.riskLevel === 'high'
                            ? 'bg-red-100'
                            : borrower.riskLevel === 'medium'
                            ? 'bg-amber-100'
                            : 'bg-green-100'
                        }`}>
                          <BorrowerIcon className={`w-8 h-8 ${
                            borrower.riskLevel === 'high'
                              ? 'text-red-600'
                              : borrower.riskLevel === 'medium'
                              ? 'text-amber-600'
                              : 'text-green-600'
                          }`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-white">{borrower.name}</h3>
                            <Badge variant="outline" className="capitalize">
                              {borrower.type}
                            </Badge>
                            <Badge className={getKycStatusColor(borrower.kycStatus)}>
                              KYC: {borrower.kycStatus}
                            </Badge>
                            <Badge className={getRiskColor(borrower.riskLevel)}>
                              {borrower.riskLevel} risk
                            </Badge>
                            <Badge className={getStatusColor(borrower.approvalStatus)}>
                              {borrower.approvalStatus}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-4 gap-6 mb-4">
                            <div>
                              <div className="text-sm text-slate-300 mb-1">Loan Amount</div>
                              <div className="text-xl font-bold text-white">
                                ${(borrower.loanAmount / 1000000).toFixed(2)}M
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-300 mb-1">LVR</div>
                              <div className="text-xl font-bold text-white">
                                {borrower.lvr.toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-300 mb-1">Guarantors</div>
                              <div className="text-xl font-bold text-white">
                                {borrower.guarantors}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-300 mb-1">Security Parties</div>
                              <div className="text-xl font-bold text-white">
                                {borrower.securityParties}
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-[#0a0e17] rounded-lg border border-white/10">
                            <div className="text-sm text-slate-300 mb-1">Loan Purpose</div>
                            <div className="font-semibold text-white">{borrower.loanPurpose}</div>
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
                        {borrower.kycStatus !== 'complete' && (
                          <Button size="sm">
                            <Shield className="w-4 h-4 mr-2" />
                            Complete KYC
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

        {selectedTab === 'compliance' && (
          <div className="space-y-6">
            {/* Pre-Settlement Compliance Gate */}
            <Card className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-600" />
                  Pre-Settlement Compliance Gate
                </CardTitle>
                <CardDescription>Deals blocked from settlement due to incomplete KYC/AML</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deals.filter(d => d.kycGate).map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-4 bg-[#0d121d] rounded-lg border-2 border-red-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{deal.borrowerName}</div>
                          <div className="text-sm text-slate-300">Settlement: {deal.settlementDate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-red-600 text-white">
                          ${(deal.loanAmount / 1000000).toFixed(2)}M blocked
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

            {/* Compliance Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Lender-Grade Compliance Requirements</CardTitle>
                <CardDescription>What must be verified before settlement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-white mb-3">Borrower KYC</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Identity verification (biometric)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Proof of address
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Source of funds verification
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Source of wealth verification
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Sanctions & PEP screening
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-3">Entity Due Diligence</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Company/trust structure verification
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Beneficial ownership mapping (25%+)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Director/trustee verification
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        UBO screening (sanctions, PEP)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Layered ownership tracing
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-3">Guarantor & Security Party</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Guarantor identity verification
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Capacity to guarantee assessment
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Security provider verification
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Related party exposure checks
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-3">Compliance Sign-Off</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Risk assessment (0-100 score)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Credit committee clearance
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Compliance officer sign-off
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Lender-grade audit pack generated
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LOS Integration */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Loan Origination System (LOS) Integration
                </CardTitle>
                <CardDescription>Connect with your LOS to automate KYC workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'Mortgage Choice', status: 'Connected', deals: 12 },
                    { name: 'Connective', status: 'Disconnected', deals: 0 },
                    { name: 'SimpleNexus', status: 'Disconnected', deals: 0 }
                  ].map((los, idx) => (
                    <div key={idx} className="p-4 bg-[#0d121d] rounded-lg border border-blue-200">
                      <div className="font-bold text-white mb-2">{los.name}</div>
                      <div className="text-sm text-slate-300 mb-3">
                        {los.status === 'Connected' ? `${los.deals} active deals` : 'Not connected'}
                      </div>
                      <Button
                        size="sm"
                        variant={los.status === 'Connected' ? 'outline' : 'default'}
                        className="w-full"
                      >
                        {los.status === 'Connected' ? 'Configure' : 'Connect'}
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

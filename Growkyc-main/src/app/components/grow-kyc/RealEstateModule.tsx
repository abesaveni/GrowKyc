import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Home,
  User,
  Users,
  Building2,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Plus,
  Shield,
  AlertTriangle,
  Globe,
  FileText,
  Clock
} from 'lucide-react';

interface Transaction {
  id: string;
  propertyAddress: string;
  transactionType: 'sale' | 'lease' | 'development';
  propertyValue: number;
  vendor: string;
  purchaser: string;
  purchaserType: 'individual' | 'company' | 'trust';
  offshoreFlag: boolean;
  kycStatus: 'complete' | 'pending' | 'incomplete';
  sourceOfFunds: string;
  depositAmount: number;
  depositVerified: boolean;
  settlementDate: string;
  settlementReady: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  firbRequired: boolean;
}

interface RealEstateModuleProps {
  onBack: () => void;
}

export function RealEstateModule({ onBack }: RealEstateModuleProps) {
  const [selectedTab, setSelectedTab] = useState<'transactions' | 'offshore' | 'settlement'>('transactions');

  const transactions: Transaction[] = [
    {
      id: 'txn-1',
      propertyAddress: '123 Collins Street, Melbourne VIC 3000',
      transactionType: 'sale',
      propertyValue: 1850000,
      vendor: 'Smith Family Trust',
      purchaser: 'John & Sarah Martinez',
      purchaserType: 'individual',
      offshoreFlag: false,
      kycStatus: 'complete',
      sourceOfFunds: 'Savings + home sale proceeds',
      depositAmount: 185000,
      depositVerified: true,
      settlementDate: '2026-04-30',
      settlementReady: true,
      riskLevel: 'low',
      firbRequired: false
    },
    {
      id: 'txn-2',
      propertyAddress: '456 George Street, Sydney NSW 2000',
      transactionType: 'sale',
      propertyValue: 3200000,
      vendor: 'ABC Developments Pty Ltd',
      purchaser: 'Thompson Investment Trust',
      purchaserType: 'trust',
      offshoreFlag: false,
      kycStatus: 'complete',
      sourceOfFunds: 'Trust capital',
      depositAmount: 320000,
      depositVerified: true,
      settlementDate: '2026-05-15',
      settlementReady: true,
      riskLevel: 'low',
      firbRequired: false
    },
    {
      id: 'txn-3',
      propertyAddress: '789 Queen Street, Brisbane QLD 4000',
      transactionType: 'sale',
      propertyValue: 2500000,
      vendor: 'Johnson Estate',
      purchaser: 'Chen Holdings Pty Ltd',
      purchaserType: 'company',
      offshoreFlag: false,
      kycStatus: 'pending',
      sourceOfFunds: 'Company reserves',
      depositAmount: 250000,
      depositVerified: false,
      settlementDate: '2026-05-20',
      settlementReady: false,
      riskLevel: 'medium',
      firbRequired: false
    },
    {
      id: 'txn-4',
      propertyAddress: '321 Bourke Street, Melbourne VIC 3000',
      transactionType: 'sale',
      propertyValue: 5800000,
      vendor: 'Martinez Developments',
      purchaser: 'Singapore Holdings Ltd',
      purchaserType: 'company',
      offshoreFlag: true,
      kycStatus: 'incomplete',
      sourceOfFunds: 'Offshore investment capital',
      depositAmount: 580000,
      depositVerified: false,
      settlementDate: '2026-06-01',
      settlementReady: false,
      riskLevel: 'high',
      firbRequired: true
    }
  ];

  const stats = {
    totalTransactions: transactions.length,
    offshoreTransactions: transactions.filter(t => t.offshoreFlag).length,
    settlementBlocked: transactions.filter(t => !t.settlementReady).length,
    totalValue: transactions.reduce((sum, t) => sum + t.propertyValue, 0),
    firbRequired: transactions.filter(t => t.firbRequired).length
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'sale': return 'bg-blue-600 text-white';
      case 'lease': return 'bg-green-600 text-white';
      case 'development': return 'bg-purple-600 text-white';
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

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100 border-red-300';
      case 'medium': return 'text-amber-600 bg-amber-100 border-amber-300';
      case 'low': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-slate-300 bg-[#0f172a] border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#1e293b]">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 via-green-600 to-emerald-600 text-white px-8 py-12">
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
            <Home className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">Real Estate Module</h1>
            <p className="text-white/90 text-xl">Transaction-based KYC • Offshore buyer screening • Settlement gates</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Active Transactions</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalTransactions}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Offshore Buyers</div>
            </div>
            <div className="text-4xl font-bold mb-1 text-red-300">{stats.offshoreTransactions}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Settlement Blocked</div>
            </div>
            <div className="text-4xl font-bold mb-1 text-amber-300">{stats.settlementBlocked}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total Value</div>
            </div>
            <div className="text-3xl font-bold mb-1">${(stats.totalValue / 1000000).toFixed(1)}M</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">FIRB Required</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.firbRequired}</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant={selectedTab === 'transactions' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('transactions')}
          >
            <Home className="w-4 h-4 mr-2" />
            Transactions
          </Button>
          <Button
            variant={selectedTab === 'offshore' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('offshore')}
          >
            <Globe className="w-4 h-4 mr-2" />
            Offshore Buyers
          </Button>
          <Button
            variant={selectedTab === 'settlement' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('settlement')}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Settlement Status
          </Button>

          <div className="flex-1" />

          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Transaction
          </Button>
        </div>

        {selectedTab === 'transactions' && (
          <div className="space-y-6">
            {transactions.map((txn) => {
              const PurchaserIcon = txn.purchaserType === 'individual' ? User : txn.purchaserType === 'company' ? Building2 : Shield;
              
              return (
                <Card
                  key={txn.id}
                  className={`border-2 ${
                    txn.offshoreFlag
                      ? 'border-red-200 bg-red-50'
                      : !txn.settlementReady
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-green-200 bg-green-50'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                          txn.offshoreFlag
                            ? 'bg-red-100'
                            : !txn.settlementReady
                            ? 'bg-amber-100'
                            : 'bg-green-100'
                        }`}>
                          <Home className={`w-8 h-8 ${
                            txn.offshoreFlag
                              ? 'text-red-600'
                              : !txn.settlementReady
                              ? 'text-amber-600'
                              : 'text-green-600'
                          }`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white">{txn.propertyAddress}</h3>
                            <Badge className={getTransactionTypeColor(txn.transactionType)}>
                              {txn.transactionType}
                            </Badge>
                            {txn.offshoreFlag && (
                              <Badge className="bg-red-600 text-white">
                                <Globe className="w-3 h-3 mr-1" />
                                Offshore Buyer
                              </Badge>
                            )}
                            {txn.firbRequired && (
                              <Badge className="bg-purple-600 text-white">
                                FIRB Required
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="p-3 bg-[#1e293b] rounded-lg border border-white/10">
                              <div className="text-xs text-slate-300 mb-1">Vendor</div>
                              <div className="font-semibold text-white">{txn.vendor}</div>
                            </div>
                            <div className="p-3 bg-[#1e293b] rounded-lg border border-white/10">
                              <div className="text-xs text-slate-300 mb-1">Purchaser</div>
                              <div className="flex items-center gap-2">
                                <PurchaserIcon className="w-4 h-4 text-slate-300" />
                                <span className="font-semibold text-white">{txn.purchaser}</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-6 mb-4">
                            <div>
                              <div className="text-sm text-slate-300 mb-1">Property Value</div>
                              <div className="text-xl font-bold text-white">
                                ${(txn.propertyValue / 1000000).toFixed(2)}M
                              </div>
                            </div>

                            <div>
                              <div className="text-sm text-slate-300 mb-1">Deposit</div>
                              <div className="font-semibold text-white">
                                ${txn.depositAmount.toLocaleString()}
                                {txn.depositVerified ? (
                                  <CheckCircle className="w-4 h-4 text-green-600 inline ml-2" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-amber-600 inline ml-2" />
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="text-sm text-slate-300 mb-1">Settlement Date</div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-300" />
                                <span className="font-semibold text-white">{txn.settlementDate}</span>
                              </div>
                            </div>

                            <div>
                              <div className="text-sm text-slate-300 mb-1">Risk Level</div>
                              <Badge className={getRiskColor(txn.riskLevel)}>
                                {txn.riskLevel}
                              </Badge>
                            </div>
                          </div>

                          <div className="p-4 bg-[#1e293b] rounded-lg border border-white/10 mb-4">
                            <div className="text-sm text-slate-300 mb-1">Source of Funds</div>
                            <div className="font-semibold text-white">{txn.sourceOfFunds}</div>
                          </div>

                          {/* KYC & Settlement Status */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className={`p-3 rounded-lg border-2 ${
                              txn.kycStatus === 'complete'
                                ? 'border-green-300 bg-green-100'
                                : 'border-amber-300 bg-amber-100'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-300">KYC Status</span>
                                <Badge className={getKycStatusColor(txn.kycStatus)}>
                                  {txn.kycStatus}
                                </Badge>
                              </div>
                            </div>

                            <div className={`p-3 rounded-lg border-2 ${
                              txn.settlementReady
                                ? 'border-green-300 bg-green-100'
                                : 'border-red-300 bg-red-100'
                            }`}>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-300">Settlement Ready</span>
                                {txn.settlementReady ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-6">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {txn.kycStatus !== 'complete' && (
                          <Button size="sm">
                            <Shield className="w-4 h-4 mr-2" />
                            Complete KYC
                          </Button>
                        )}
                        {!txn.depositVerified && (
                          <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Verify Deposit
                          </Button>
                        )}
                        {txn.settlementReady && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Proceed to Settlement
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

        {selectedTab === 'offshore' && (
          <div className="space-y-6">
            {/* Offshore Buyer Workflow */}
            <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-red-600" />
                  Offshore and High-Risk Buyer Workflow
                </CardTitle>
                <CardDescription>Enhanced due diligence for foreign purchasers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.filter(t => t.offshoreFlag).map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between p-4 bg-[#1e293b] rounded-lg border-2 border-red-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <Globe className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{txn.propertyAddress}</div>
                          <div className="text-sm text-slate-300">
                            Purchaser: {txn.purchaser} • {txn.firbRequired ? 'FIRB approval required' : 'Standard process'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getRiskColor(txn.riskLevel)}>
                          {txn.riskLevel} risk
                        </Badge>
                        <Button size="sm">
                          <Shield className="w-4 h-4 mr-2" />
                          Enhanced DD
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FIRB Compliance */}
            <Card>
              <CardHeader>
                <CardTitle>FIRB (Foreign Investment Review Board) Compliance</CardTitle>
                <CardDescription>Australian foreign investment approval tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-white mb-3">FIRB Required When:</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        Foreign person or entity purchaser
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        Residential property (any value)
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        Commercial property {'>'} threshold
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        Agricultural land {'>'} $15M
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-3">Required Documentation:</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        FIRB application reference number
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Approval certificate (no objection)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Proof of foreign status
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Source of funds verification
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Offshore Buyer Risk Rules */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
              <CardHeader>
                <CardTitle>Offshore Buyer Risk Rules</CardTitle>
                <CardDescription>Auto-escalation for high-risk countries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 bg-[#1e293b] rounded-lg border border-amber-200">
                    <h4 className="font-bold text-white mb-2">High-Risk Jurisdictions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Russia', 'North Korea', 'Iran', 'Myanmar', 'Syria', 'Venezuela'].map((country, idx) => (
                        <Badge key={idx} className="bg-red-600 text-white">
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-[#1e293b] rounded-lg border border-amber-200">
                    <h4 className="font-bold text-white mb-2">Enhanced Screening Required:</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Sanctions list screening (OFAC, EU, UN, AU)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        PEP screening (politically exposed persons)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Adverse media check
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Enhanced source of wealth verification
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'settlement' && (
          <div className="space-y-6">
            {/* Settlement Readiness */}
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Settlement Readiness Status
                </CardTitle>
                <CardDescription>All KYC must be complete before settlement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                        txn.settlementReady
                          ? 'bg-[#1e293b] border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          txn.settlementReady ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {txn.settlementReady ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white">{txn.propertyAddress}</div>
                          <div className="text-sm text-slate-300">
                            Settlement: {txn.settlementDate} • 
                            {txn.settlementReady ? ' Ready to proceed' : ' Blocked by KYC'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {txn.settlementReady ? (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Proceed to Settlement
                          </Button>
                        ) : (
                          <>
                            <Badge className="bg-red-600 text-white">
                              ${(txn.propertyValue / 1000000).toFixed(2)}M blocked
                            </Badge>
                            <Button size="sm">
                              <Shield className="w-4 h-4 mr-2" />
                              Complete KYC
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Authority Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Settlement and Authority Controls</CardTitle>
                <CardDescription>Verification requirements before settlement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-white mb-3">Pre-Settlement Checklist:</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Vendor KYC complete
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Purchaser KYC complete
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Deposit verified (origin + amount)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Agent authority verified (if applicable)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        FIRB approval (if offshore buyer)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Entity beneficial ownership verified
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-3">Agent Authority Documents:</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Power of Attorney (if acting on behalf)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Agency agreement
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Board resolution (corporate entities)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Trust deed (trust purchasers)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Identity verification of signatories
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settlement Platform Integration */}
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200">
              <CardHeader>
                <CardTitle>Settlement Workflow Integration</CardTitle>
                <CardDescription>Connect with PEXA, InfoTrack, Sympli</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'PEXA', status: 'Connected', transactions: 2 },
                    { name: 'InfoTrack', status: 'Disconnected', transactions: 0 },
                    { name: 'Sympli', status: 'Disconnected', transactions: 0 }
                  ].map((platform, idx) => (
                    <div key={idx} className="p-4 bg-[#1e293b] rounded-lg border border-indigo-200">
                      <div className="font-bold text-white mb-2">{platform.name}</div>
                      <div className="text-sm text-slate-300 mb-3">
                        {platform.status === 'Connected' ? `${platform.transactions} transactions synced` : 'Not connected'}
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

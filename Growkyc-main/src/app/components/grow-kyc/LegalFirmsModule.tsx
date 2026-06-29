import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Gavel,
  User,
  Users,
  FileText,
  Building2,
  Shield,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Plus,
  Clock,
  AlertTriangle,
  Crown,
  Banknote,
  MapPin
} from 'lucide-react';

interface Matter {
  id: string;
  clientName: string;
  matterType: 'property' | 'corporate' | 'litigation' | 'trust' | 'private-client';
  matterValue: number;
  jurisdiction: string;
  kycStatus: 'complete' | 'pending' | 'incomplete';
  sourceOfFunds: string;
  counterparties: number;
  riskLevel: 'low' | 'medium' | 'high';
  compliancePartnerReview: boolean;
  trustAccountActivity: boolean;
  unusualTransactions: number;
  fileOpened: boolean;
}

interface LegalFirmsModuleProps {
  onBack: () => void;
}

export function LegalFirmsModule({ onBack }: LegalFirmsModuleProps) {
  const [selectedTab, setSelectedTab] = useState<'matters' | 'compliance' | 'trust-account'>('matters');

  const matters: Matter[] = [
    {
      id: 'matter-1',
      clientName: 'Thompson Family Trust',
      matterType: 'property',
      matterValue: 1850000,
      jurisdiction: 'NSW',
      kycStatus: 'complete',
      sourceOfFunds: 'Savings + home equity',
      counterparties: 2,
      riskLevel: 'low',
      compliancePartnerReview: false,
      trustAccountActivity: true,
      unusualTransactions: 0,
      fileOpened: true
    },
    {
      id: 'matter-2',
      clientName: 'Tech Ventures Pty Ltd',
      matterType: 'corporate',
      matterValue: 5200000,
      jurisdiction: 'VIC',
      kycStatus: 'complete',
      sourceOfFunds: 'Investor capital',
      counterparties: 5,
      riskLevel: 'medium',
      compliancePartnerReview: true,
      trustAccountActivity: true,
      unusualTransactions: 0,
      fileOpened: true
    },
    {
      id: 'matter-3',
      clientName: 'Martinez Estate',
      matterType: 'trust',
      matterValue: 3800000,
      jurisdiction: 'QLD',
      kycStatus: 'pending',
      sourceOfFunds: 'Estate assets',
      counterparties: 8,
      riskLevel: 'low',
      compliancePartnerReview: false,
      trustAccountActivity: false,
      unusualTransactions: 0,
      fileOpened: false
    },
    {
      id: 'matter-4',
      clientName: 'Offshore Holdings Ltd',
      matterType: 'corporate',
      matterValue: 12500000,
      jurisdiction: 'Singapore/AU',
      kycStatus: 'incomplete',
      sourceOfFunds: 'Multiple offshore sources',
      counterparties: 12,
      riskLevel: 'high',
      compliancePartnerReview: true,
      trustAccountActivity: true,
      unusualTransactions: 3,
      fileOpened: false
    }
  ];

  const stats = {
    totalMatters: matters.length,
    blockedMatters: matters.filter(m => !m.fileOpened && m.kycStatus !== 'complete').length,
    complianceReview: matters.filter(m => m.compliancePartnerReview).length,
    trustActivity: matters.filter(m => m.trustAccountActivity).length,
    unusualTransactions: matters.reduce((sum, m) => sum + m.unusualTransactions, 0)
  };

  const getMatterTypeColor = (type: string) => {
    switch (type) {
      case 'property': return 'bg-green-600 text-white';
      case 'corporate': return 'bg-blue-600 text-white';
      case 'litigation': return 'bg-red-600 text-white';
      case 'trust': return 'bg-purple-600 text-white';
      case 'private-client': return 'bg-indigo-600 text-white';
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
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white px-8 py-12">
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
            <Gavel className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">Legal Firms Module</h1>
            <p className="text-white/90 text-xl">Matter-based KYC • Source of funds • Compliance partner review</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Active Matters</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalMatters}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Blocked (No KYC)</div>
            </div>
            <div className="text-4xl font-bold mb-1 text-red-300">{stats.blockedMatters}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Partner Review</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.complianceReview}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Banknote className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Trust Account</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.trustActivity}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Unusual Activity</div>
            </div>
            <div className="text-4xl font-bold mb-1 text-amber-300">{stats.unusualTransactions}</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant={selectedTab === 'matters' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('matters')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Matters
          </Button>
          <Button
            variant={selectedTab === 'compliance' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('compliance')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Compliance Dashboard
          </Button>
          <Button
            variant={selectedTab === 'trust-account' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('trust-account')}
          >
            <Banknote className="w-4 h-4 mr-2" />
            Trust Account
          </Button>

          <div className="flex-1" />

          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Matter
          </Button>
        </div>

        {selectedTab === 'matters' && (
          <div className="space-y-6">
            {matters.map((matter) => (
              <Card
                key={matter.id}
                className={`border-2 ${
                  matter.riskLevel === 'high'
                    ? 'border-red-200 bg-red-50'
                    : !matter.fileOpened && matter.kycStatus !== 'complete'
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-gray-200'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                        matter.riskLevel === 'high'
                          ? 'bg-red-100'
                          : !matter.fileOpened
                          ? 'bg-amber-100'
                          : 'bg-green-100'
                      }`}>
                        <Gavel className={`w-8 h-8 ${
                          matter.riskLevel === 'high'
                            ? 'text-red-600'
                            : !matter.fileOpened
                            ? 'text-amber-600'
                            : 'text-green-600'
                        }`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{matter.clientName}</h3>
                          <Badge className={getMatterTypeColor(matter.matterType)}>
                            {matter.matterType}
                          </Badge>
                          <Badge className={getKycStatusColor(matter.kycStatus)}>
                            KYC: {matter.kycStatus}
                          </Badge>
                          {!matter.fileOpened && (
                            <Badge className="bg-red-600 text-white">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              File Not Opened
                            </Badge>
                          )}
                          {matter.compliancePartnerReview && (
                            <Badge className="bg-purple-600 text-white">
                              <Crown className="w-3 h-3 mr-1" />
                              Partner Review
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-4 gap-6 mb-4">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Matter Value</div>
                            <div className="text-xl font-bold text-gray-900">
                              ${(matter.matterValue / 1000000).toFixed(2)}M
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-600 mb-1">Jurisdiction</div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-600" />
                              <span className="font-semibold text-gray-900">{matter.jurisdiction}</span>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-600 mb-1">Counterparties</div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-gray-900">{matter.counterparties}</span>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-600 mb-1">Risk Level</div>
                            <Badge className={getRiskColor(matter.riskLevel)}>
                              {matter.riskLevel}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4">
                          <div className="text-sm text-gray-600 mb-1">Source of Funds</div>
                          <div className="font-semibold text-gray-900">{matter.sourceOfFunds}</div>
                        </div>

                        {matter.unusualTransactions > 0 && (
                          <div className="p-3 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                              <span className="font-bold text-red-900">
                                {matter.unusualTransactions} unusual transaction{matter.unusualTransactions > 1 ? 's' : ''} detected
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Matter
                      </Button>
                      {!matter.fileOpened && matter.kycStatus === 'complete' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Open File
                        </Button>
                      )}
                      {matter.kycStatus !== 'complete' && (
                        <Button size="sm">
                          <Shield className="w-4 h-4 mr-2" />
                          Complete KYC
                        </Button>
                      )}
                      {matter.compliancePartnerReview && !matter.fileOpened && (
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Crown className="w-4 h-4 mr-2" />
                          Partner Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'compliance' && (
          <div className="space-y-6">
            {/* Matter Opening Gate */}
            <Card className="border-2 border-red-200 bg-gray-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  No File Opening Until KYC Done
                </CardTitle>
                <CardDescription>Compliance gate prevents matter progression before minimum KYC</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {matters.filter(m => !m.fileOpened && m.kycStatus !== 'complete').map((matter) => (
                    <div key={matter.id} className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-red-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{matter.clientName}</div>
                          <div className="text-sm text-gray-600">{matter.matterType} • {matter.jurisdiction}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-red-600 text-white">
                          ${(matter.matterValue / 1000000).toFixed(2)}M blocked
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

            {/* Compliance Partner Review Queue */}
            <Card className="border-2 border-purple-200 bg-gray-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  Compliance Partner Review Queue
                </CardTitle>
                <CardDescription>High-risk matters require partner sign-off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {matters.filter(m => m.compliancePartnerReview).map((matter) => (
                    <div key={matter.id} className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-purple-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Crown className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{matter.clientName}</div>
                          <div className="text-sm text-gray-600">
                            {matter.matterType} • Risk: {matter.riskLevel}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getRiskColor(matter.riskLevel)}>
                          {matter.riskLevel} risk
                        </Badge>
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Review Matter
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Source of Funds Logic */}
            <Card>
              <CardHeader>
                <CardTitle>Source of Funds Logic by Matter Type</CardTitle>
                <CardDescription>Different evidence requirements by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Property Matters:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Proof of deposit (bank statement)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Pre-approval letter (if financed)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Sale proceeds (if selling)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Corporate Matters:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Source of acquisition funds
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Investor capital documentation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Financial statements
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Trust/Estate Matters:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Trust deed or will
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Asset valuations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Distribution records
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Litigation Matters:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Funding arrangement (if applicable)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Cost agreement
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Security for costs
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'trust-account' && (
          <div className="space-y-6">
            {/* Trust Account Event Triggers */}
            <Card className="border-2 border-amber-200 bg-gray-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Trust Account Event Triggers
                </CardTitle>
                <CardDescription>Unusual transaction detection and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {matters.filter(m => m.unusualTransactions > 0).map((matter) => (
                    <div key={matter.id} className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-amber-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{matter.clientName}</div>
                          <div className="text-sm text-gray-600">
                            {matter.unusualTransactions} unusual transaction{matter.unusualTransactions > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-amber-600 text-white">
                          Review Required
                        </Badge>
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Transactions
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust Account Risk Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Trust Account Risk Controls</CardTitle>
                <CardDescription>Automated detection of unusual patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Trigger Events:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Large deposits ({'>'} $100K)
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Rapid movement of funds (in/out within 48hrs)
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Multiple small transfers (structuring)
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Third-party deposits (not client)
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        International wire transfers
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Automated Actions:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Flag for compliance partner review
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Request source of funds evidence
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Trigger enhanced due diligence
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Log event in audit trail
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Alert managing partner
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Practice Management Integration */}
            <Card className="bg-gray-50 border-2 border-indigo-200">
              <CardHeader>
                <CardTitle>Practice Management Integration</CardTitle>
                <CardDescription>Sync with LEAP, Smokeball, ActionStep, Clio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { name: 'LEAP', status: 'Connected', matters: 2 },
                    { name: 'Smokeball', status: 'Disconnected', matters: 0 },
                    { name: 'ActionStep', status: 'Disconnected', matters: 0 },
                    { name: 'Clio', status: 'Disconnected', matters: 0 }
                  ].map((system, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-lg border border-indigo-200">
                      <div className="font-bold text-gray-900 mb-2">{system.name}</div>
                      <div className="text-sm text-gray-600 mb-3">
                        {system.status === 'Connected' ? `${system.matters} matters synced` : 'Not connected'}
                      </div>
                      <Button
                        size="sm"
                        variant={system.status === 'Connected' ? 'outline' : 'default'}
                        className="w-full"
                      >
                        {system.status === 'Connected' ? 'Configure' : 'Connect'}
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

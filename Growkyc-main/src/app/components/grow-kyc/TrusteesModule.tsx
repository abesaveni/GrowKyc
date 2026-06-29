import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Scale,
  User,
  Users,
  Building2,
  Shield,
  Crown,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Plus,
  Network,
  AlertTriangle,
  Upload,
  Download,
  FileCheck
} from 'lucide-react';

interface Trust {
  id: string;
  name: string;
  type: 'family' | 'unit' | 'discretionary' | 'testamentary';
  abn?: string;
  trusteeType: 'individual' | 'corporate';
  trustee: string;
  appointor?: string;
  beneficiaries: number;
  deedStatus: 'uploaded' | 'pending' | 'missing';
  authorityVerified: boolean;
  kycStatus: 'complete' | 'pending' | 'incomplete';
  riskLevel: 'low' | 'medium' | 'high';
  lastReview: string;
  controllerChanges: number;
}

interface TrusteesModuleProps {
  onBack: () => void;
}

export function TrusteesModule({ onBack }: TrusteesModuleProps) {
  const [selectedTab, setSelectedTab] = useState<'trusts' | 'authority' | 'monitoring'>('trusts');

  const trusts: Trust[] = [
    {
      id: 'trust-1',
      name: 'Smith Family Trust',
      type: 'family',
      abn: '12 345 678 901',
      trusteeType: 'corporate',
      trustee: 'Smith Holdings Pty Ltd',
      appointor: 'John Smith',
      beneficiaries: 5,
      deedStatus: 'uploaded',
      authorityVerified: true,
      kycStatus: 'complete',
      riskLevel: 'low',
      lastReview: '2026-02-01',
      controllerChanges: 0
    },
    {
      id: 'trust-2',
      name: 'Johnson Discretionary Trust',
      type: 'discretionary',
      abn: '23 456 789 012',
      trusteeType: 'individual',
      trustee: 'Margaret Johnson',
      appointor: 'David Johnson',
      beneficiaries: 8,
      deedStatus: 'uploaded',
      authorityVerified: true,
      kycStatus: 'complete',
      riskLevel: 'low',
      lastReview: '2026-01-15',
      controllerChanges: 0
    },
    {
      id: 'trust-3',
      name: 'Martinez Unit Trust',
      type: 'unit',
      abn: '34 567 890 123',
      trusteeType: 'corporate',
      trustee: 'Martinez Trustee Co Pty Ltd',
      beneficiaries: 12,
      deedStatus: 'uploaded',
      authorityVerified: true,
      kycStatus: 'complete',
      riskLevel: 'medium',
      lastReview: '2026-03-01',
      controllerChanges: 1
    },
    {
      id: 'trust-4',
      name: 'Chen Investment Trust',
      type: 'discretionary',
      abn: '45 678 901 234',
      trusteeType: 'corporate',
      trustee: 'Chen Investments Pty Ltd',
      appointor: 'Sarah Chen',
      beneficiaries: 4,
      deedStatus: 'pending',
      authorityVerified: false,
      kycStatus: 'pending',
      riskLevel: 'medium',
      lastReview: '2025-12-10',
      controllerChanges: 2
    }
  ];

  const stats = {
    totalTrusts: trusts.length,
    corporateTrustees: trusts.filter(t => t.trusteeType === 'corporate').length,
    individualTrustees: trusts.filter(t => t.trusteeType === 'individual').length,
    pendingAuthority: trusts.filter(t => !t.authorityVerified).length,
    controlChanges: trusts.reduce((sum, t) => sum + t.controllerChanges, 0)
  };

  const getTrustTypeColor = (type: string) => {
    switch (type) {
      case 'family': return 'bg-blue-600 text-white';
      case 'unit': return 'bg-purple-600 text-white';
      case 'discretionary': return 'bg-indigo-600 text-white';
      case 'testamentary': return 'bg-amber-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getDeedStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'bg-green-600 text-white';
      case 'pending': return 'bg-amber-600 text-white';
      case 'missing': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
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
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white px-8 py-12">
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
            <Scale className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">Trustees Module</h1>
            <p className="text-white/90 text-xl">Trust deed parsing • Authority verification • Control mapping</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Total Trusts</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalTrusts}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Corporate Trustees</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.corporateTrustees}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Individual Trustees</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.individualTrustees}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Pending Authority</div>
            </div>
            <div className="text-4xl font-bold mb-1 text-amber-300">{stats.pendingAuthority}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-white/80">Control Changes</div>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.controlChanges}</div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant={selectedTab === 'trusts' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('trusts')}
          >
            <Shield className="w-4 h-4 mr-2" />
            Trusts
          </Button>
          <Button
            variant={selectedTab === 'authority' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('authority')}
          >
            <Crown className="w-4 h-4 mr-2" />
            Authority Verification
          </Button>
          <Button
            variant={selectedTab === 'monitoring' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('monitoring')}
          >
            <Network className="w-4 h-4 mr-2" />
            Control Monitoring
          </Button>

          <div className="flex-1" />

          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Trust
          </Button>
        </div>

        {selectedTab === 'trusts' && (
          <div className="space-y-6">
            {trusts.map((trust) => (
              <Card key={trust.id} className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                        trust.riskLevel === 'high' ? 'bg-red-100' :
                        trust.riskLevel === 'medium' ? 'bg-amber-100' : 'bg-green-100'
                      }`}>
                        <Shield className={`w-8 h-8 ${
                          trust.riskLevel === 'high' ? 'text-red-600' :
                          trust.riskLevel === 'medium' ? 'text-amber-600' : 'text-green-600'
                        }`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-white">{trust.name}</h3>
                          <Badge className={getTrustTypeColor(trust.type)}>
                            {trust.type}
                          </Badge>
                          <Badge className={getDeedStatusColor(trust.deedStatus)}>
                            Deed: {trust.deedStatus}
                          </Badge>
                          {trust.authorityVerified && (
                            <Badge className="bg-green-600 text-white">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Authority Verified
                            </Badge>
                          )}
                        </div>

                        {trust.abn && (
                          <div className="text-sm text-slate-300 mb-4">ABN: {trust.abn}</div>
                        )}

                        <div className="grid grid-cols-3 gap-6 mb-4">
                          <div>
                            <div className="text-sm text-slate-300 mb-1">Trustee</div>
                            <div className="flex items-center gap-2">
                              {trust.trusteeType === 'corporate' ? (
                                <Building2 className="w-4 h-4 text-slate-300" />
                              ) : (
                                <User className="w-4 h-4 text-slate-300" />
                              )}
                              <span className="font-semibold text-white">{trust.trustee}</span>
                            </div>
                          </div>

                          {trust.appointor && (
                            <div>
                              <div className="text-sm text-slate-300 mb-1">Appointor</div>
                              <div className="flex items-center gap-2">
                                <Crown className="w-4 h-4 text-purple-600" />
                                <span className="font-semibold text-white">{trust.appointor}</span>
                              </div>
                            </div>
                          )}

                          <div>
                            <div className="text-sm text-slate-300 mb-1">Beneficiaries</div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-white">{trust.beneficiaries} identified</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-3 bg-[#0a0e17] rounded-lg">
                            <div className="text-xs text-slate-300 mb-1">Risk Level</div>
                            <Badge className={getRiskColor(trust.riskLevel)}>
                              {trust.riskLevel}
                            </Badge>
                          </div>

                          <div className="p-3 bg-[#0a0e17] rounded-lg">
                            <div className="text-xs text-slate-300 mb-1">Last Review</div>
                            <div className="font-semibold text-white">{trust.lastReview}</div>
                          </div>

                          <div className="p-3 bg-[#0a0e17] rounded-lg">
                            <div className="text-xs text-slate-300 mb-1">Control Changes</div>
                            <div className="font-semibold text-white">
                              {trust.controllerChanges === 0 ? 'None' : trust.controllerChanges}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Structure
                      </Button>
                      {trust.deedStatus === 'pending' && (
                        <Button size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Deed
                        </Button>
                      )}
                      {trust.deedStatus === 'uploaded' && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download Deed
                        </Button>
                      )}
                      {!trust.authorityVerified && (
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Crown className="w-4 h-4 mr-2" />
                          Verify Authority
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedTab === 'authority' && (
          <div className="space-y-6">
            {/* Trust Deed Parsing */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Trust Deed Parsing (AI Extraction)
                </CardTitle>
                <CardDescription>Auto-extract key parties and provisions from trust deeds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-6 bg-[#0d121d] rounded-xl border-2 border-purple-200">
                    <h4 className="font-bold text-white mb-4">Automatically Extracted Fields:</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <ul className="space-y-2 text-sm text-slate-300">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Trustee name and type
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Appointor / Guardian
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Beneficiary classes (income, capital)
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Settlor details
                          </li>
                        </ul>
                      </div>
                      <div>
                        <ul className="space-y-2 text-sm text-slate-300">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Powers of appointor
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Trustee removal provisions
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Amendment procedures
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Vesting date
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Authority Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Evidence of Authority to Act</CardTitle>
                <CardDescription>Required documents before any action on behalf of trust</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trusts.map((trust) => (
                    <div key={trust.id} className="flex items-center justify-between p-4 bg-[#0a0e17] rounded-lg border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FileCheck className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{trust.name}</div>
                          <div className="text-sm text-slate-300">
                            {trust.trusteeType === 'corporate' ? 'Board resolution + Director ID' : 'Trustee ID + Deed'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {trust.authorityVerified ? (
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <>
                            <Badge className="bg-amber-600 text-white">Pending</Badge>
                            <Button size="sm">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Documents
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust Role Map */}
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-indigo-600" />
                  Trust-Specific Ownership Map
                </CardTitle>
                <CardDescription>Visual graph of appointor → trustee → beneficiaries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-[#0d121d] rounded-xl border border-indigo-200">
                  <p className="text-slate-300 mb-4">
                    Structured role fields ensure trust relationships are never stored as free text.
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="text-xs font-bold text-purple-600 mb-1">APPOINTOR</div>
                      <div className="text-sm text-white">Can remove/appoint trustee</div>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-xs font-bold text-blue-600 mb-1">TRUSTEE</div>
                      <div className="text-sm text-white">Legal owner, manages trust</div>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-xs font-bold text-green-600 mb-1">BENEFICIARIES</div>
                      <div className="text-sm text-white">Receive distributions</div>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="text-xs font-bold text-amber-600 mb-1">GUARDIAN</div>
                      <div className="text-sm text-white">Protects beneficiaries</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'monitoring' && (
          <div className="space-y-6">
            {/* Control Change Triggers */}
            <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Control Change Monitoring
                </CardTitle>
                <CardDescription>Trust amendments trigger automatic re-review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trusts.filter(t => t.controllerChanges > 0).map((trust) => (
                    <div key={trust.id} className="flex items-center justify-between p-4 bg-[#0d121d] rounded-lg border-2 border-red-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{trust.name}</div>
                          <div className="text-sm text-slate-300">
                            {trust.controllerChanges} control change{trust.controllerChanges > 1 ? 's' : ''} detected
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-red-600 text-white">
                          Re-review Required
                        </Badge>
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Review Changes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monitoring Events */}
            <Card>
              <CardHeader>
                <CardTitle>Ongoing Control-Change Monitoring</CardTitle>
                <CardDescription>Events that trigger re-verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-white mb-3">Trigger Events:</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Appointor change
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Trustee removal/appointment
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Deed variation/amendment
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Beneficiary class change
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Corporate trustee director change
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-3">Re-verification Actions:</h4>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Verify new appointor/trustee identity
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Obtain new authority documents
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Re-screen all controllers (PEP, sanctions)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Update ownership graph
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Generate new compliance pack
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

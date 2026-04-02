import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { EntityNetworkChart } from './EntityNetworkChart';
import { HighRiskTransactionsDisplay } from './HighRiskTransactionsDisplay';
import { HIGH_RISK_TRANSACTIONS_DATABASE } from './HighRiskTransactionsData';
import { LegalMattersDisplay } from './LegalMattersDisplay';
import { LEGAL_MATTERS_DATABASE } from './LegalMattersData';
import { IntegrationDocumentsDisplay } from './IntegrationDocumentsDisplay';
import { INTEGRATION_DOCUMENTS_DATABASE } from './IntegrationDocumentsData';
import { EnhancedMonitoringTab } from './EnhancedMonitoringTab';
import { EnhancedDecisionTab } from './EnhancedDecisionTab';
import { DECISION_DATABASE } from './DecisionData';
import { EnhancedAustracTab } from './EnhancedAustracTab';
import { AUSTRAC_REPORTS_DATABASE } from './AustracReportingData';
import {
  Building,
  Users,
  DollarSign,
  Scale,
  FileText,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  Calendar,
  Upload,
  Clock,
  Shield,
  User,
  Globe,
  AlertCircle,
  RefreshCw,
  CreditCard,
  Search
} from 'lucide-react';

interface TestClient {
  id: string;
  name: string;
  entityType: 'Individual' | 'Company' | 'Trust' | 'Partnership' | 'Foreign Entity';
  status: 'Active' | 'Inactive' | 'Suspended' | 'Under Review';
  country: string;
  entityData: {
    registrationDate?: string;
    asicStatus?: string;
    directors?: Array<{ name: string; appointed: string; resigned?: string }>;
    shareholders?: Array<{ name: string; shares: number; percentage: number }>;
    trustType?: string;
    trustees?: Array<{ name: string; type: string }>;
    beneficiaries?: Array<{ name: string; entitlement: string }>;
  };
  ownershipData: {
    ubos: Array<{ name: string; ownership: number; verified: boolean; country: string }>;
    ownershipStructureComplete: boolean;
    complexStructure: boolean;
  };
  financialData: {
    bankAccounts: number;
    sourceOfFunds: string;
    sourceOfWealth: string;
    estimatedWealth: string;
    transactionVolume: string;
    highRiskTransactions: number;
  };
  legalData: {
    serviceAgreementSigned: boolean;
    termsAccepted: boolean;
    privacyConsentGiven: boolean;
    engagementLetterDate?: string;
    kycConsentDate: string;
  };
  documentsData: {
    total: number;
    verified: number;
    pending: number;
    rejected: number;
  };
  monitoringData: {
    alertsLast30Days: number;
    activeAlerts: number;
    nameChanges: number;
    addressChanges: number;
    ownershipChanges: number;
  };
  decisionsData: {
    onboardingDecision: 'Approved' | 'Rejected' | 'Pending';
    onboardingDate: string;
    approver: string;
    riskAssessments: number;
    escalations: number;
  };
  austracData: {
    smrsFiled: number;
    ttrsFiled: number;
    lastReportDate?: string;
    suspiciousActivity: boolean;
  };
  auditData: {
    totalEvents: number;
    lastActivity: string;
    lastUser: string;
  };
  lastReview: string;
}

type TabType = 'entity' | 'ownership' | 'financial' | 'fraud' | 'legal' | 'run-checks' | 'compliance' | 'documents' | 'monitoring' | 'decisions' | 'austrac' | 'audit';

interface RemainingTabsProps {
  activeTab: TabType;
  client: TestClient;
}

export function RemainingTabs({ activeTab, client }: RemainingTabsProps) {
  return (
    <>
      {/* ENTITY TAB */}
      {activeTab === 'entity' && (
        <>
          {/* Entity Network Chart */}
          <div className="mb-6">
            <EntityNetworkChart clientId={client.id} clientName={client.name} />
          </div>

          {/* Entity Information Card */}
          <Card className="border-2 border-blue-300 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Building className="w-6 h-6 text-blue-600" />
                Entity Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {client.entityData.registrationDate && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Registration Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Registration Date</p>
                      <p className="font-bold text-lg">{client.entityData.registrationDate}</p>
                    </div>
                    {client.entityData.asicStatus && (
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="text-sm text-gray-600 mb-1">ASIC Status</p>
                        <p className="font-bold text-lg">{client.entityData.asicStatus}</p>
                      </div>
                    )}
                    <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                      <p className="text-sm text-gray-600 mb-1">Entity Type</p>
                      <p className="font-bold text-lg">{client.entityType}</p>
                    </div>
                  </div>
                </div>
              )}

              {client.entityData.directors && client.entityData.directors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Directors / Partners</h3>
                  <div className="space-y-2">
                    {client.entityData.directors.map((director, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex justify-between items-center">
                        <div>
                          <p className="font-bold">{director.name}</p>
                          <p className="text-sm text-gray-600">Appointed: {director.appointed}</p>
                        </div>
                        {director.resigned && (
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                            Resigned: {director.resigned}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {client.entityData.shareholders && client.entityData.shareholders.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Shareholders</h3>
                  <div className="space-y-2">
                    {client.entityData.shareholders.map((shareholder, idx) => (
                      <div key={idx} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold">{shareholder.name}</p>
                            <p className="text-sm text-gray-600">{shareholder.shares.toLocaleString()} shares</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">{shareholder.percentage}%</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${shareholder.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {client.entityData.trustType && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Trust Details</h3>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Trust Type</p>
                    <p className="font-bold text-lg">{client.entityData.trustType}</p>
                  </div>
                  
                  {client.entityData.trustees && (
                    <div className="mb-4">
                      <p className="font-semibold mb-2">Trustees</p>
                      <div className="space-y-2">
                        {client.entityData.trustees.map((trustee, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="font-bold">{trustee.name}</p>
                            <p className="text-sm text-gray-600">{trustee.type}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {client.entityData.beneficiaries && (
                    <div>
                      <p className="font-semibold mb-2">Beneficiaries</p>
                      <div className="space-y-2">
                        {client.entityData.beneficiaries.map((beneficiary, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="font-bold">{beneficiary.name}</p>
                            <p className="text-sm text-gray-600">{beneficiary.entitlement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {client.entityType === 'Individual' && !client.entityData.registrationDate && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <p className="text-blue-800 font-semibold">Individual Entity</p>
                  <p className="text-sm text-blue-700 mt-1">
                    No corporate structure applicable. See Identity and Ownership tabs for details.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* OWNERSHIP TAB */}
      {activeTab === 'ownership' && (
        <Card className="border-2 border-blue-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Beneficial Ownership
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`rounded-lg p-4 border ${client.ownershipData.ownershipStructureComplete ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {client.ownershipData.ownershipStructureComplete ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className="font-semibold">Structure Complete</p>
                </div>
                <p className="text-lg">{client.ownershipData.ownershipStructureComplete ? 'Yes' : 'Incomplete'}</p>
              </div>
              <div className={`rounded-lg p-4 border ${client.ownershipData.complexStructure ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {client.ownershipData.complexStructure ? (
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  <p className="font-semibold">Structure Complexity</p>
                </div>
                <p className="text-lg">{client.ownershipData.complexStructure ? 'Complex' : 'Simple'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Ultimate Beneficial Owners (UBOs)</h3>
              <div className="space-y-3">
                {client.ownershipData.ubos.map((ubo, idx) => (
                  <div key={idx} className={`rounded-lg p-4 border-2 ${ubo.verified ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-lg">{ubo.name}</p>
                        <p className="text-sm text-gray-600">Country: {ubo.country}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-blue-600">{ubo.ownership}%</p>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          {ubo.verified ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-xs text-green-600">Verified</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="text-xs text-red-600">Unverified</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${ubo.verified ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${ubo.ownership}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="font-semibold mb-2">Ownership Summary</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Verified Ownership:</span>
                  <span className="font-bold text-lg">
                    {client.ownershipData.ubos.filter(u => u.verified).reduce((sum, u) => sum + u.ownership, 0)}%
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">Unverified Ownership:</span>
                  <span className="font-bold text-lg text-red-600">
                    {client.ownershipData.ubos.filter(u => !u.verified).reduce((sum, u) => sum + u.ownership, 0)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FINANCIAL TAB */}
      {activeTab === 'financial' && (
        <>
          <Card className="border-2 border-blue-300 shadow-lg mb-6">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-blue-600" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Bank Accounts</p>
                  <p className="text-3xl font-bold text-green-600">{client.financialData.bankAccounts}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Estimated Wealth</p>
                  <p className="text-xl font-bold text-blue-600">{client.financialData.estimatedWealth}</p>
                </div>
                <div className={`rounded-lg p-4 border ${client.financialData.highRiskTransactions > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <p className="text-sm text-gray-600 mb-1">High Risk Transactions</p>
                  <p className={`text-3xl font-bold ${client.financialData.highRiskTransactions > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {client.financialData.highRiskTransactions}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">Transaction Activity</h3>
                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                  <p className="text-sm text-gray-600 mb-1">Monthly Transaction Volume</p>
                  <p className="text-2xl font-bold text-cyan-600">{client.financialData.transactionVolume}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">Source of Funds</h3>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-gray-700">{client.financialData.sourceOfFunds}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">Source of Wealth</h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-700">{client.financialData.sourceOfWealth}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* High Risk Transactions and Source of Funds Proof */}
          <HighRiskTransactionsDisplay 
            transactions={HIGH_RISK_TRANSACTIONS_DATABASE[client.id]?.highRiskTransactions || []}
            sourceOfFundsProof={HIGH_RISK_TRANSACTIONS_DATABASE[client.id]?.sourceOfFundsProof || []}
          />
        </>
      )}

      {/* FRAUD DETECTION TAB */}
      {activeTab === 'fraud' && (
        <Card className="border-2 border-red-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
              Fraud Detection & Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Fraud Risk Score */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-semibold">Fraud Score</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">Low</p>
                  <p className="text-sm text-gray-600 mt-1">2/100 risk</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <p className="font-semibold">Identity Checks</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">Passed</p>
                  <p className="text-sm text-gray-600 mt-1">All verified</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <p className="font-semibold">Behavioral</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">Normal</p>
                  <p className="text-sm text-gray-600 mt-1">No anomalies</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-semibold">Device Trust</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">Trusted</p>
                  <p className="text-sm text-gray-600 mt-1">Verified device</p>
                </div>
              </div>

              {/* Fraud Indicators */}
              <div>
                <h3 className="font-bold text-lg mb-4">Fraud Indicators Assessment</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold">Document Authenticity</p>
                        <p className="text-sm text-gray-600">All documents verified as genuine</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">Clear</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold">Synthetic Identity Detection</p>
                        <p className="text-sm text-gray-600">No synthetic identity patterns detected</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">Clear</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold">Velocity Checks</p>
                        <p className="text-sm text-gray-600">No duplicate or rapid-fire applications</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">Clear</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold">Geolocation Analysis</p>
                        <p className="text-sm text-gray-600">Location data consistent with profile</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">Clear</Badge>
                  </div>
                </div>
              </div>

              {/* AI Analysis Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="font-bold text-lg">AI Fraud Analysis Summary</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Comprehensive fraud detection analysis completed using 14 automated rules and 4 AI models. 
                  No fraud indicators detected. All documents authentic, identity consistent, and behavioral patterns normal.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Confidence Score</p>
                    <p className="text-2xl font-bold text-blue-600">98%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Risk Level</p>
                    <p className="text-2xl font-bold text-green-600">Low</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RUN CHECKS TAB */}
      {activeTab === 'run-checks' && (
        <Card className="border-2 border-blue-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-blue-600" />
              Manual Verification System
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-auto py-4 flex-col gap-2 bg-[#13B5EA] hover:bg-[#0E7C9E]">
                  <Shield className="w-6 h-6" />
                  <span className="font-semibold">Run Identity Check</span>
                  <span className="text-xs opacity-80">Verify via Equifax/GreenID</span>
                </Button>
                <Button className="h-auto py-4 flex-col gap-2 bg-purple-600 hover:bg-purple-700">
                  <Search className="w-6 h-6" />
                  <span className="font-semibold">Run AML Screening</span>
                  <span className="text-xs opacity-80">PEP, Sanctions, Watchlists</span>
                </Button>
                <Button className="h-auto py-4 flex-col gap-2 bg-orange-600 hover:bg-orange-700">
                  <CreditCard className="w-6 h-6" />
                  <span className="font-semibold">Run Credit Check</span>
                  <span className="text-xs opacity-80">Credit score and history</span>
                </Button>
                <Button className="h-auto py-4 flex-col gap-2 bg-red-600 hover:bg-red-700">
                  <AlertCircle className="w-6 h-6" />
                  <span className="font-semibold">Run Fraud Scan</span>
                  <span className="text-xs opacity-80">Multi-factor fraud analysis</span>
                </Button>
              </div>

              {/* Recent Checks */}
              <div>
                <h3 className="font-bold text-lg mb-4">Recent Checks</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">Identity Verification (Equifax)</p>
                        <p className="text-sm text-gray-600">Run on {new Date().toLocaleDateString()} by compliance@growkyc.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">Passed</Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-semibold">AML Screening</p>
                        <p className="text-sm text-gray-600">Run on {new Date().toLocaleDateString()} by compliance@growkyc.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">Clear</Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-semibold">Fraud Detection Scan</p>
                        <p className="text-sm text-gray-600">Run on {new Date().toLocaleDateString()} by fraud@growkyc.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600 text-white">No Issues</Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Bulk Verification</h3>
                    <p className="text-sm text-gray-600">Run all verification checks at once</p>
                  </div>
                  <Button className="bg-[#13B5EA] hover:bg-[#0E7C9E]">
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Run All Checks
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  This will run: Identity verification, AML screening, Credit check, Fraud scan, and generate a comprehensive compliance report.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LEGAL TAB */}
      {activeTab === 'legal' && (
        <>
          {/* Legal Matters Display */}
          <LegalMattersDisplay 
            legalData={LEGAL_MATTERS_DATABASE[client.id] || {
              clientId: client.id,
              hasLegalIssues: false,
              legalMatters: [],
              regulatoryActions: [],
              companyStrikeOffs: [],
              legalConcerns: [],
              overallLegalRisk: 'Low'
            }}
          />
        </>
      )}

      {/* COMPLIANCE TAB */}
      {activeTab === 'compliance' && (
        <Card className="border-2 border-blue-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Compliance Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className={`rounded-lg p-4 border ${client.legalData.serviceAgreementSigned ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {client.legalData.serviceAgreementSigned ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className="font-semibold">Service Agreement</p>
                </div>
                <p className="text-lg">{client.legalData.serviceAgreementSigned ? 'Signed' : 'Pending'}</p>
              </div>
              <div className={`rounded-lg p-4 border ${client.legalData.termsAccepted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {client.legalData.termsAccepted ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className="font-semibold">Terms Accepted</p>
                </div>
                <p className="text-lg">{client.legalData.termsAccepted ? 'Yes' : 'No'}</p>
              </div>
              <div className={`rounded-lg p-4 border ${client.legalData.privacyConsentGiven ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {client.legalData.privacyConsentGiven ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className="font-semibold">Privacy Consent</p>
                </div>
                <p className="text-lg">{client.legalData.privacyConsentGiven ? 'Given' : 'Not Given'}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-4">Engagement Documents</h3>
              <div className="space-y-3">
                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                  <p className="text-sm text-gray-600">Engagement Letter Date</p>
                  <p className="text-lg font-bold">{client.legalData.engagementLetterDate}</p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                  <p className="text-sm text-gray-600">KYC Consent Date</p>
                  <p className="text-lg font-bold">{client.legalData.kycConsentDate}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Service Agreement
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download All Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DOCUMENTS TAB */}
      {activeTab === 'documents' && (
        <>
          {/* Integration Documents Display */}
          <IntegrationDocumentsDisplay 
            documentRepo={INTEGRATION_DOCUMENTS_DATABASE[client.id] || {
              clientId: client.id,
              totalDocuments: 0,
              documentsAnalyzed: 0,
              lastDocumentReceived: '',
              integrationSources: [],
              aiAnalysisEnabled: true,
              totalStorageUsed: '0 MB',
              categories: []
            }}
          />
        </>
      )}

      {/* MONITORING TAB */}
      {activeTab === 'monitoring' && (
        <EnhancedMonitoringTab 
          clientId={client.id}
          clientName={client.name}
          monitoringData={client.monitoringData}
        />
      )}

      {/* DECISIONS TAB */}
      {activeTab === 'decisions' && (
        <EnhancedDecisionTab 
          decision={DECISION_DATABASE[client.id] || {
            clientId: client.id,
            clientName: client.name,
            decision: client.decisionsData.onboardingDecision,
            decisionDate: client.decisionsData.onboardingDate,
            decisionMaker: client.decisionsData.approver,
            decisionMakerRole: 'Compliance Manager',
            executiveSummary: 'No detailed decision record available.',
            issuesIdentified: [],
            riskAssessments: [],
            approvalReasoning: { keyStrengths: [], concernsAddressed: [], conditionsApplied: [], ongoingMonitoring: [] },
            decisionComments: 'Standard onboarding decision.',
            escalations: [],
            reviewHistory: []
          }}
        />
      )}

      {/* AUSTRAC TAB */}
      {activeTab === 'austrac' && (
        <EnhancedAustracTab 
          smrs={AUSTRAC_REPORTS_DATABASE[client.id]?.smrs || []}
          summary={AUSTRAC_REPORTS_DATABASE[client.id]?.summary || {
            totalSMRs: client.austracData.smrsFiled,
            totalTTRs: client.austracData.ttrsFiled,
            lastReportDate: client.austracData.lastReportDate || '',
            activeConcerns: client.austracData.suspiciousActivity
          }}
        />
      )}

      {/* AUDIT TAB */}
      {activeTab === 'audit' && (
        <Card className="border-2 border-blue-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              Audit Trail
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Total Events</p>
                <p className="text-4xl font-bold text-blue-600">{client.auditData.totalEvents.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Last Activity</p>
                <p className="text-lg font-bold text-green-600">{client.auditData.lastActivity}</p>
              </div>
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <p className="text-sm text-gray-600 mb-1">Last User</p>
                <p className="text-lg font-bold text-cyan-600 break-all">{client.auditData.lastUser}</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
              <div className="space-y-2">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Document Verification Completed</p>
                      <p className="text-sm text-gray-600">{client.auditData.lastUser}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      {client.auditData.lastActivity}
                    </Badge>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">AML Screening Performed</p>
                      <p className="text-sm text-gray-600">system@grow.com</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                      {client.lastReview}
                    </Badge>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Risk Assessment Updated</p>
                      <p className="text-sm text-gray-600">{client.decisionsData.approver}</p>
                    </div>
                    <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                      {client.decisionsData.onboardingDate}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                <Download className="w-4 h-4 mr-2" />
                Export Full Audit Log
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
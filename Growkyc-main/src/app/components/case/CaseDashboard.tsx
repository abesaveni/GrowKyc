import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Case } from '../../data/mockData';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  RadialBarChart, 
  RadialBar, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText,
  Users,
  Home,
  DollarSign,
  Calendar,
  Target,
  Shield,
  FileCheck
} from 'lucide-react';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { useAuth } from '../../../context/AuthContext';
import { toast } from '../../lib/toast';

// Import newly refactored workflow modals
import { ApproveClientModal } from './ApproveClientModal';
import { RejectClientModal } from './RejectClientModal';
import { RequestInfoModal } from './RequestInfoModal';
import { FlagInvestigationModal } from './FlagInvestigationModal';
import { EscalateModal } from './EscalateModal';
import { OpenEddModal } from './OpenEddModal';
import { generateEvidencePack } from '../../api/cases';

interface CaseDashboardProps {
  caseData: Case;
}

export function CaseDashboard({ caseData }: CaseDashboardProps) {
  // Modal visibility states
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isRequestInfoOpen, setIsRequestInfoOpen] = useState(false);
  const [isFlagOpen, setIsFlagOpen] = useState(false);
  const [isEscalateOpen, setIsEscalateOpen] = useState(false);
  const [isEddOpen, setIsEddOpen] = useState(false);
  const [isGeneratingPack, setIsGeneratingPack] = useState(false);

  // Auth context for role-based rendering / permission check
  const { user } = useAuth();

  const handleActionSuccess = () => {
    toast.success('Action recorded successfully.');
  };

  const handleDownloadEvidence = async () => {
    setIsGeneratingPack(true);
    try {
      await generateEvidencePack(caseData.id);
      toast.success('Evidence Pack downloaded successfully.');
    } catch (e) {
      toast.error('Failed to generate or download Evidence Pack.');
    } finally {
      setIsGeneratingPack(false);
    }
  };
  // Calculate metrics
  const lvr = ((caseData.outstandingDebt / caseData.valuation.amount) * 100);
  const equity = caseData.valuation.amount - caseData.outstandingDebt;
  const equityPercentage = (equity / caseData.valuation.amount) * 100;

  // Risk level color mapping
  const riskColors: Record<string, { bg: string; text: string; gauge: string }> = {
    low: { bg: 'bg-green-50', text: 'text-green-700', gauge: '#22c55e' },
    medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', gauge: '#eab308' },
    high: { bg: 'bg-orange-50', text: 'text-orange-700', gauge: '#f97316' },
    critical: { bg: 'bg-red-50', text: 'text-red-700', gauge: '#ef4444' }
  };

  const currentRiskColor = riskColors[caseData.riskLevel] || riskColors.medium;

  // Risk gauge data
  const riskScore = caseData.riskLevel === 'low' ? 25 : 
                    caseData.riskLevel === 'medium' ? 50 : 
                    caseData.riskLevel === 'high' ? 75 : 100;

  const riskGaugeData = [
    { name: 'Risk', value: riskScore, fill: currentRiskColor.gauge }
  ];

  // LVR gauge data
  const lvrGaugeData = [
    { name: 'LVR', value: lvr, fill: lvr > 80 ? '#ef4444' : lvr > 65 ? '#f97316' : '#22c55e' }
  ];

  // Financial breakdown
  const financialData = [
    { name: 'Outstanding Debt', value: caseData.outstandingDebt, color: '#ef4444' },
    { name: 'Equity Available', value: equity, color: '#22c55e' }
  ];

  // Document completion
  const documentsCompleted = caseData.documentsTracking ? 
    Object.values(caseData.documentsTracking).filter(Boolean).length : 0;
  const totalDocuments = 13; // Total possible documents
  const documentProgress = (documentsCompleted / totalDocuments) * 100;

  // Verification completion
  const verificationsCompleted = [
    caseData.infoTrackChecksCompleted,
    caseData.automatedChecksCompleted,
    caseData.creditCheckCompleted,
    caseData.paymentVerified,
    caseData.borrowerDetails?.kycStatus === 'verified'
  ].filter(Boolean).length;
  const verificationProgress = (verificationsCompleted / 5) * 100;

  // Parties completion
  const partiesCount = caseData.allParties ? 
    Object.values(caseData.allParties).filter(party => party && (typeof party === 'object' ? Object.keys(party).length > 0 : false)).length : 0;

  // Timeline data
  const daysSinceCreated = Math.floor((new Date().getTime() - new Date(caseData.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const daysSinceUpdated = Math.floor((new Date().getTime() - new Date(caseData.updatedAt).getTime()) / (1000 * 60 * 60 * 24));

  // Arrears data for chart
  const arrearsData = [
    { name: 'Paid', value: (caseData.loanDetails?.originalLoanAmount || 0) - (caseData.loanDetails?.arrears || 0) },
    { name: 'Arrears', value: caseData.loanDetails?.arrears || 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Compliance Workflow Actions Panel */}
      {user?.role !== 'auditor' && (
        <Card className="border-indigo-200 bg-indigo-50/30 backdrop-blur-sm shadow-md">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-indigo-900">
              <Shield className="w-5 h-5 text-indigo-600 animate-pulse" />
              Compliance Workflow Decisions
            </CardTitle>
            <div className="text-xs text-indigo-700 bg-indigo-100/75 px-2.5 py-1 rounded-full font-medium">
              Role: <span className="capitalize">{user?.role || 'AML Analyst'}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {/* Critical Actions Gated by RBAC role check */}
              {((user?.role as string === 'compliance' || user?.role as string === 'approver' || user?.role as string === 'admin' || user?.role as string === 'aml-analyst')) && (
                <>
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => setIsApproveOpen(true)}
                  >
                    Approve Client
                  </Button>
                  <Button 
                    variant="destructive"
                    className="font-medium shadow-sm transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => setIsRejectOpen(true)}
                  >
                    Reject Client
                  </Button>
                </>
              )}
              
              <Button 
                variant="outline"
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-medium transition-all duration-200"
                onClick={() => setIsRequestInfoOpen(true)}
              >
                Request Info
              </Button>
              
              <Button 
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-50 font-medium transition-all duration-200"
                onClick={() => setIsFlagOpen(true)}
              >
                Flag Investigation
              </Button>
              
              <Button 
                variant="outline"
                className="border-rose-300 text-rose-700 hover:bg-rose-50 font-medium transition-all duration-200"
                onClick={() => setIsEscalateOpen(true)}
              >
                Escalate Case
              </Button>

              <Button 
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 font-medium transition-all duration-200"
                onClick={() => setIsEddOpen(true)}
              >
                Initiate EDD
              </Button>

              <Button 
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 font-medium transition-all duration-200 ml-auto"
                onClick={handleDownloadEvidence}
                disabled={isGeneratingPack}
              >
                {isGeneratingPack ? 'Generating Pack...' : 'Download Evidence Pack'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Case Status</p>
                <p className="text-2xl font-bold capitalize">{caseData.status.replace('_', ' ')}</p>
                <p className="text-xs text-gray-500 mt-1">Updated {daysSinceUpdated}d ago</p>
              </div>
              <div className={`p-3 rounded-full ${currentRiskColor.bg}`}>
                <Target className={`w-6 h-6 ${currentRiskColor.text}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Property Value</p>
                <p className="text-2xl font-bold">${(caseData.valuation.amount / 1000000).toFixed(2)}M</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  High confidence
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Bids</p>
                <p className="text-2xl font-bold">{caseData.bidCount || 0}</p>
                {caseData.currentBid && (
                  <p className="text-xs text-gray-500 mt-1">High: ${(caseData.currentBid / 1000).toFixed(0)}k</p>
                )}
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Days Active</p>
                <p className="text-2xl font-bold">{daysSinceCreated}</p>
                <p className="text-xs text-gray-500 mt-1">Since {new Date(caseData.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="p-3 rounded-full bg-indigo-50">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gauges Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Level Gauge */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="60%" 
                  outerRadius="90%" 
                  barSize={20} 
                  data={riskGaugeData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    background
                    dataKey="value"
                  />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold">
                    {caseData.riskLevel.toUpperCase()}
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Risk Score</span>
                <span className="font-semibold">{riskScore}/100</span>
              </div>
              {caseData.loanDetails?.missedPayments && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Missed Payments</span>
                  <span className="font-semibold text-red-600">{caseData.loanDetails.missedPayments}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* LVR Gauge */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Loan to Value Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="60%" 
                  outerRadius="90%" 
                  barSize={20} 
                  data={lvrGaugeData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    background
                    dataKey="value"
                  />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold">
                    {lvr.toFixed(1)}%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Debt</span>
                <span className="font-semibold">${(caseData.outstandingDebt / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Equity</span>
                <span className="font-semibold text-green-600">${(equity / 1000).toFixed(0)}k</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Financial Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financialData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {financialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Debt</span>
                </div>
                <span className="font-semibold">{((caseData.outstandingDebt / caseData.valuation.amount) * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Equity</span>
                </div>
                <span className="font-semibold">{equityPercentage.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Tracking Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Document Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Completion</span>
                <span className="text-sm font-semibold">{documentsCompleted}/{totalDocuments}</span>
              </div>
              <Progress value={documentProgress} className="h-3" />
            </div>
            <div className="space-y-2">
              {caseData.documentsTracking?.titleSearchCompleted && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Title Search</span>
                </div>
              )}
              {caseData.documentsTracking?.identityVerificationCompleted && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Identity Verified</span>
                </div>
              )}
              {caseData.documentsTracking?.originalLoanAgreementUploaded && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Loan Agreement</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Completion</span>
                <span className="text-sm font-semibold">{verificationsCompleted}/5</span>
              </div>
              <Progress value={verificationProgress} className="h-3" />
            </div>
            <div className="space-y-2">
              {caseData.infoTrackChecksCompleted && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>InfoTrack Checks</span>
                </div>
              )}
              {caseData.borrowerDetails?.kycStatus === 'verified' && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>KYC Verified</span>
                </div>
              )}
              {caseData.paymentVerified && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Payment Verified</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Party Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Parties & Representatives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Total Parties</span>
                <span className="text-sm font-semibold">{partiesCount}</span>
              </div>
            </div>
            <div className="space-y-2">
              {caseData.allParties?.borrowerLawyer && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Borrower's Lawyer</span>
                </div>
              )}
              {caseData.allParties?.lenderLawyer && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Lender's Lawyer</span>
                </div>
              )}
              {caseData.allParties?.realEstateAgent && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Real Estate Agent</span>
                </div>
              )}
              {caseData.allParties?.valuer && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Valuer</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Arrears & Timeline */}
      {caseData.loanDetails?.arrears && caseData.loanDetails.arrears > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Arrears Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-4">Payment Status</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Outstanding', value: caseData.outstandingDebt },
                      { name: 'Arrears', value: caseData.loanDetails.arrears }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                      <Bar dataKey="value" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-900">Active Arrears</p>
                      <p className="text-2xl font-bold text-orange-600 mt-1">
                        ${caseData.loanDetails.arrears.toLocaleString()}
                      </p>
                      <p className="text-sm text-orange-700 mt-2">
                        {caseData.loanDetails.missedPayments} missed payments
                      </p>
                    </div>
                  </div>
                </div>
                {caseData.loanDetails.defaultDate && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Default Date</span>
                      <span className="font-semibold">{caseData.loanDetails.defaultDate}</span>
                    </div>
                    {caseData.loanDetails.defaultReason && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Reason</p>
                        <p className="text-sm font-medium">{caseData.loanDetails.defaultReason}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* NCCP Compliance Alert */}
      {caseData.nccpCompliance?.subjectToNCCP && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-1">NCCP Regulated Credit</h3>
                <p className="text-sm text-orange-800">
                  This case is subject to the National Consumer Credit Protection Act 2009. 
                  All responsible lending obligations and hardship provisions apply.
                </p>
                {caseData.nccpCompliance.borrowerCooperation && (
                  <p className="text-sm text-orange-700 mt-2">
                    Borrower Status: <span className="font-semibold capitalize">{caseData.nccpCompliance.borrowerCooperation}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Compliance Workflow Modals */}
      <ApproveClientModal 
        isOpen={isApproveOpen} 
        onClose={() => setIsApproveOpen(false)} 
        caseData={caseData}
        onActionSuccess={handleActionSuccess}
      />
      <RejectClientModal 
        isOpen={isRejectOpen} 
        onClose={() => setIsRejectOpen(false)} 
        caseData={caseData}
        onActionSuccess={handleActionSuccess}
      />
      <RequestInfoModal 
        isOpen={isRequestInfoOpen} 
        onClose={() => setIsRequestInfoOpen(false)} 
        caseData={caseData}
        onActionSuccess={handleActionSuccess}
      />
      <FlagInvestigationModal 
        isOpen={isFlagOpen} 
        onClose={() => setIsFlagOpen(false)} 
        caseData={caseData}
        onActionSuccess={handleActionSuccess}
      />
      <EscalateModal 
        isOpen={isEscalateOpen} 
        onClose={() => setIsEscalateOpen(false)} 
        caseData={caseData}
        onActionSuccess={handleActionSuccess}
      />
      <OpenEddModal 
        isOpen={isEddOpen} 
        onClose={() => setIsEddOpen(false)} 
        caseData={caseData}
        onActionSuccess={handleActionSuccess}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  DollarSign,
  User,
  Users,
  Briefcase,
  Home,
  Car,
  CreditCard,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Clock,
  Shield,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calculator,
  PieChart,
  BarChart3,
  Activity
} from 'lucide-react';

interface ConsumerProfile {
  clientId: string;
  clientName: string;
  objectives: {
    primaryPurpose: string;
    loanAmount: number;
    loanTerm: number;
    preferredRepayment: 'weekly' | 'fortnightly' | 'monthly';
    goals: string[];
  };
  financialSituation: {
    employmentStatus: 'full-time' | 'part-time' | 'casual' | 'self-employed' | 'retired' | 'unemployed';
    occupation: string;
    employer: string;
    employmentDuration: number; // months
    grossIncome: {
      salary: number;
      rental: number;
      investment: number;
      other: number;
      total: number;
      verified: boolean;
      verifiedBy: string;
      verificationDate: Date;
      evidenceId: string;
    };
  };
  dependants: {
    adults: number;
    children: number;
    totalDependants: number;
  };
  existingCommitments: {
    mortgages: Array<{ lender: string; balance: number; repayment: number; verified: boolean }>;
    personalLoans: Array<{ lender: string; balance: number; repayment: number; verified: boolean }>;
    creditCards: Array<{ issuer: string; limit: number; balance: number; minPayment: number; verified: boolean }>;
    otherDebts: Array<{ type: string; balance: number; repayment: number; verified: boolean }>;
  };
}

interface AffordabilityAssessment {
  income: {
    grossMonthly: number;
    netMonthly: number;
    verified: boolean;
  };
  expenses: {
    housing: number;
    utilities: number;
    food: number;
    transport: number;
    insurance: number;
    healthcare: number;
    education: number;
    childcare: number;
    other: number;
    total: number;
    method: 'declared' | 'hem' | 'hybrid';
  };
  existingLiabilities: {
    monthlyRepayments: number;
    totalBalance: number;
  };
  proposedLoan: {
    amount: number;
    term: number;
    rate: number;
    monthlyRepayment: number;
  };
  servicing: {
    totalMonthlyCommitments: number;
    netSurplus: number;
    surplusAfterBuffers: number;
    servicingRatio: number;
    outcome: 'suitable' | 'marginal' | 'unsuitable';
  };
  buffers: {
    interestRateBuffer: number; // % points
    assessmentRate: number;
    bufferAmount: number;
  };
}

export function NCCPResponsibleLendingModule() {
  const [activeTab, setActiveTab] = useState<'consumer' | 'verification' | 'assessment' | 'disclosure'>('consumer');
  const [expandedSections, setExpandedSections] = useState({
    objectives: true,
    financial: true,
    dependants: false,
    commitments: false
  });

  // Mock data
  const [consumerProfile] = useState<ConsumerProfile>({
    clientId: 'CLI-001',
    clientName: 'Sarah Mitchell',
    objectives: {
      primaryPurpose: 'Home Purchase',
      loanAmount: 450000,
      loanTerm: 30,
      preferredRepayment: 'monthly',
      goals: ['Purchase first home', 'Build equity', 'Stable housing']
    },
    financialSituation: {
      employmentStatus: 'full-time',
      occupation: 'Senior Marketing Manager',
      employer: 'Tech Solutions Pty Ltd',
      employmentDuration: 48,
      grossIncome: {
        salary: 8500,
        rental: 0,
        investment: 0,
        other: 0,
        total: 8500,
        verified: true,
        verifiedBy: 'compliance@growkyc.com',
        verificationDate: new Date('2024-03-20'),
        evidenceId: 'EV-2024-001'
      }
    },
    dependants: {
      adults: 1,
      children: 0,
      totalDependants: 1
    },
    existingCommitments: {
      mortgages: [],
      personalLoans: [],
      creditCards: [
        { issuer: 'CommBank Visa', limit: 15000, balance: 2500, minPayment: 75, verified: true },
        { issuer: 'ANZ Amex', limit: 10000, balance: 0, minPayment: 0, verified: true }
      ],
      otherDebts: []
    }
  });

  const [assessment] = useState<AffordabilityAssessment>({
    income: {
      grossMonthly: 8500,
      netMonthly: 6375,
      verified: true
    },
    expenses: {
      housing: 1800,
      utilities: 250,
      food: 600,
      transport: 400,
      insurance: 200,
      healthcare: 150,
      education: 0,
      childcare: 0,
      other: 300,
      total: 3700,
      method: 'hybrid'
    },
    existingLiabilities: {
      monthlyRepayments: 75,
      totalBalance: 2500
    },
    proposedLoan: {
      amount: 450000,
      term: 30,
      rate: 6.5,
      monthlyRepayment: 2844
    },
    servicing: {
      totalMonthlyCommitments: 6619,
      netSurplus: 1881,
      surplusAfterBuffers: 744,
      servicingRatio: 77.9,
      outcome: 'suitable'
    },
    buffers: {
      interestRateBuffer: 3.0,
      assessmentRate: 9.5,
      bufferAmount: 1137
    }
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'suitable': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'marginal': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'unsuitable': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-[#0f172a] text-slate-300 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0E7C9E] to-[#13B5EA] text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-10 h-10" />
                <h1 className="text-4xl font-bold">NCCP Responsible Lending Assessment</h1>
              </div>
              <p className="text-xl text-cyan-100">Consumer Profile & Affordability Engine</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-cyan-100">Client</div>
              <div className="text-lg font-semibold">{consumerProfile.clientName}</div>
              <div className="text-sm text-cyan-100">{consumerProfile.clientId}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Assessment Outcome Banner */}
        <div className={`rounded-lg shadow-lg p-6 ${assessment.servicing.outcome === 'suitable' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {assessment.servicing.outcome === 'suitable' ? (
                <CheckCircle className="w-12 h-12 text-green-600" />
              ) : (
                <AlertTriangle className="w-12 h-12 text-yellow-600" />
              )}
              <div>
                <h3 className={`text-2xl font-bold mb-1 ${assessment.servicing.outcome === 'suitable' ? 'text-green-900 dark:text-green-100' : 'text-yellow-900 dark:text-yellow-100'}`}>
                  Assessment Outcome: {assessment.servicing.outcome.toUpperCase()}
                </h3>
                <p className={assessment.servicing.outcome === 'suitable' ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'}>
                  {assessment.servicing.outcome === 'suitable' 
                    ? 'Borrower can afford the proposed loan without substantial hardship'
                    : 'Marginal affordability - further review recommended'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-300 dark:text-slate-400">Net Surplus After Buffers</div>
              <div className={`text-3xl font-bold ${assessment.servicing.surplusAfterBuffers > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${assessment.servicing.surplusAfterBuffers.toLocaleString()}
              </div>
              <div className="text-sm text-slate-300 dark:text-slate-400">per month</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-white/10 dark:border-gray-700">
            {[
              { id: 'consumer', label: 'Consumer Profile', icon: User },
              { id: 'verification', label: 'Verification Hub', icon: CheckCircle },
              { id: 'assessment', label: 'Affordability Assessment', icon: Calculator },
              { id: 'disclosure', label: 'Disclosure Register', icon: FileText }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#13B5EA] text-white'
                    : 'text-slate-300 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Consumer Profile Tab */}
            {activeTab === 'consumer' && (
              <div className="space-y-6">
                {/* Objectives */}
                <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg border border-white/10 dark:border-gray-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection('objectives')}
                    className="w-full px-6 py-4 flex items-center justify-between bg-[#0f172a] dark:bg-gray-900 hover:bg-white/5 dark:hover:bg-gray-850"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-[#13B5EA]" />
                      <h3 className="text-lg font-bold text-white dark:text-white">Objectives</h3>
                    </div>
                    {expandedSections.objectives ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {expandedSections.objectives && (
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-slate-400 mb-1">Primary Purpose</div>
                          <div className="text-lg font-semibold text-white dark:text-white">
                            {consumerProfile.objectives.primaryPurpose}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400 mb-1">Loan Amount</div>
                          <div className="text-lg font-semibold text-white dark:text-white">
                            ${consumerProfile.objectives.loanAmount.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400 mb-1">Loan Term</div>
                          <div className="text-lg font-semibold text-white dark:text-white">
                            {consumerProfile.objectives.loanTerm} years
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400 mb-1">Repayment Frequency</div>
                          <div className="text-lg font-semibold text-white dark:text-white capitalize">
                            {consumerProfile.objectives.preferredRepayment}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400 mb-2">Consumer Goals</div>
                        <div className="flex flex-wrap gap-2">
                          {consumerProfile.objectives.goals.map((goal, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm">
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Financial Situation */}
                <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg border border-white/10 dark:border-gray-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection('financial')}
                    className="w-full px-6 py-4 flex items-center justify-between bg-[#0f172a] dark:bg-gray-900 hover:bg-white/5 dark:hover:bg-gray-850"
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-[#13B5EA]" />
                      <h3 className="text-lg font-bold text-white dark:text-white">Financial Situation & Employment</h3>
                    </div>
                    {expandedSections.financial ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {expandedSections.financial && (
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-slate-400 mb-1">Employment Status</div>
                          <div className="text-base font-semibold text-white dark:text-white capitalize">
                            {consumerProfile.financialSituation.employmentStatus.replace('-', ' ')}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400 mb-1">Occupation</div>
                          <div className="text-base font-semibold text-white dark:text-white">
                            {consumerProfile.financialSituation.occupation}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400 mb-1">Employer</div>
                          <div className="text-base font-semibold text-white dark:text-white">
                            {consumerProfile.financialSituation.employer}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400 mb-1">Employment Duration</div>
                          <div className="text-base font-semibold text-white dark:text-white">
                            {Math.floor(consumerProfile.financialSituation.employmentDuration / 12)} years {consumerProfile.financialSituation.employmentDuration % 12} months
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-white dark:text-white">Gross Monthly Income</h4>
                          {consumerProfile.financialSituation.grossIncome.verified && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-xs flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-[#0f172a] dark:bg-gray-900 rounded-lg">
                            <div className="text-xs text-slate-400">Salary</div>
                            <div className="text-lg font-bold text-white dark:text-white">
                              ${consumerProfile.financialSituation.grossIncome.salary.toLocaleString()}
                            </div>
                          </div>
                          <div className="p-3 bg-[#0f172a] dark:bg-gray-900 rounded-lg">
                            <div className="text-xs text-slate-400">Total Income</div>
                            <div className="text-lg font-bold text-white dark:text-white">
                              ${consumerProfile.financialSituation.grossIncome.total.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        {consumerProfile.financialSituation.grossIncome.verified && (
                          <div className="mt-3 text-xs text-slate-300 dark:text-slate-400">
                            Verified by {consumerProfile.financialSituation.grossIncome.verifiedBy} on{' '}
                            {consumerProfile.financialSituation.grossIncome.verificationDate.toLocaleDateString()}
                            {' • Evidence: '}
                            <button className="text-[#13B5EA] hover:underline">
                              {consumerProfile.financialSituation.grossIncome.evidenceId}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dependants */}
                <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg border border-white/10 dark:border-gray-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection('dependants')}
                    className="w-full px-6 py-4 flex items-center justify-between bg-[#0f172a] dark:bg-gray-900 hover:bg-white/5 dark:hover:bg-gray-850"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-[#13B5EA]" />
                      <h3 className="text-lg font-bold text-white dark:text-white">Dependants</h3>
                    </div>
                    {expandedSections.dependants ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {expandedSections.dependants && (
                    <div className="p-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-[#0f172a] dark:bg-gray-900 rounded-lg text-center">
                          <div className="text-sm text-slate-400 mb-1">Adults</div>
                          <div className="text-2xl font-bold text-white dark:text-white">
                            {consumerProfile.dependants.adults}
                          </div>
                        </div>
                        <div className="p-4 bg-[#0f172a] dark:bg-gray-900 rounded-lg text-center">
                          <div className="text-sm text-slate-400 mb-1">Children</div>
                          <div className="text-2xl font-bold text-white dark:text-white">
                            {consumerProfile.dependants.children}
                          </div>
                        </div>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                          <div className="text-sm text-slate-400 mb-1">Total</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {consumerProfile.dependants.totalDependants}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Existing Commitments */}
                <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg border border-white/10 dark:border-gray-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection('commitments')}
                    className="w-full px-6 py-4 flex items-center justify-between bg-[#0f172a] dark:bg-gray-900 hover:bg-white/5 dark:hover:bg-gray-850"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-[#13B5EA]" />
                      <h3 className="text-lg font-bold text-white dark:text-white">Existing Commitments</h3>
                    </div>
                    {expandedSections.commitments ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {expandedSections.commitments && (
                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="font-semibold text-white dark:text-white mb-3">Credit Cards</h4>
                        {consumerProfile.existingCommitments.creditCards.map((card, i) => (
                          <div key={i} className="p-3 bg-[#0f172a] dark:bg-gray-900 rounded-lg mb-2">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-semibold text-white dark:text-white">{card.issuer}</div>
                              {card.verified && (
                                <span className="text-green-600 text-xs flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-sm">
                              <div>
                                <div className="text-slate-400">Limit</div>
                                <div className="font-semibold">${card.limit.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-slate-400">Balance</div>
                                <div className="font-semibold">${card.balance.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-slate-400">Min Payment</div>
                                <div className="font-semibold">${card.minPayment.toLocaleString()}/mo</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Assessment Tab */}
            {activeTab === 'assessment' && (
              <div className="space-y-6">
                {/* Income Summary */}
                <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg border border-white/10 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-white dark:text-white mb-4">Income</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-sm text-slate-300 dark:text-slate-400 mb-1">Gross Monthly Income</div>
                      <div className="text-2xl font-bold text-green-600">${assessment.income.grossMonthly.toLocaleString()}</div>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm text-slate-300 dark:text-slate-400 mb-1">Net Monthly Income</div>
                      <div className="text-2xl font-bold text-blue-600">${assessment.income.netMonthly.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Expenses Breakdown */}
                <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg border border-white/10 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white dark:text-white">Monthly Expenses</h3>
                    <span className="text-sm text-slate-300 dark:text-slate-400">
                      Method: {assessment.expenses.method.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {Object.entries(assessment.expenses).filter(([key]) => !['total', 'method'].includes(key)).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-[#0f172a] dark:bg-gray-900 rounded-lg">
                        <span className="text-sm font-medium text-slate-300 dark:text-gray-300 capitalize">{key}</span>
                        <span className="text-sm font-bold text-white dark:text-white">${(value as number).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-white/10 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white dark:text-white">Total Expenses</span>
                      <span className="text-2xl font-bold text-red-600">${assessment.expenses.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Servicing Calculation */}
                <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg border border-white/10 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-white dark:text-white mb-4">Servicing Calculation</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-[#0f172a] dark:bg-gray-900 rounded-lg">
                      <div className="text-sm text-slate-300 dark:text-slate-400 mb-1">Proposed Loan Repayment</div>
                      <div className="text-xl font-bold text-white dark:text-white">
                        ${assessment.proposedLoan.monthlyRepayment.toLocaleString()}/month
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        ${assessment.proposedLoan.amount.toLocaleString()} @ {assessment.proposedLoan.rate}% over {assessment.proposedLoan.term} years
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm text-slate-300 dark:text-slate-400 mb-1">Buffer Applied</div>
                      <div className="text-xl font-bold text-blue-600">
                        +${assessment.buffers.bufferAmount.toLocaleString()}/month
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {assessment.buffers.interestRateBuffer}% rate buffer (assessed at {assessment.buffers.assessmentRate}%)
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-sm text-slate-300 dark:text-slate-400 mb-1">Total Monthly Commitments</div>
                      <div className="text-2xl font-bold text-orange-600">
                        ${assessment.servicing.totalMonthlyCommitments.toLocaleString()}
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${assessment.servicing.netSurplus > 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <div className="text-sm text-slate-300 dark:text-slate-400 mb-1">Net Surplus (After Buffers)</div>
                      <div className={`text-3xl font-bold ${assessment.servicing.netSurplus > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${assessment.servicing.surplusAfterBuffers.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Servicing Ratio: {assessment.servicing.servicingRatio}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`rounded-lg border p-6 ${getOutcomeColor(assessment.servicing.outcome)}`}>
                  <div className="flex items-start gap-4">
                    {assessment.servicing.outcome === 'suitable' ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : (
                      <AlertTriangle className="w-8 h-8" />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">Recommendation: {assessment.servicing.outcome.toUpperCase()}</h3>
                      <p className="mb-4">
                        {assessment.servicing.outcome === 'suitable'
                          ? 'Based on the verified income and expenses, the borrower has sufficient capacity to service the proposed loan without experiencing substantial hardship. The assessment includes conservative buffers and meets responsible lending obligations under NCCP.'
                          : 'The affordability assessment requires further review. Consider additional verification or discuss alternative loan structures with the applicant.'}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold">Assumptions:</div>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Income verified via payslips and employment letter</li>
                          <li>Expenses calculated using hybrid method (HEM benchmarks + declared)</li>
                          <li>{assessment.buffers.interestRateBuffer}% interest rate buffer applied</li>
                          <li>Assessment conducted at {assessment.buffers.assessmentRate}% p.a.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Hub Tab */}
            {activeTab === 'verification' && (
              <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg border border-white/10 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-white dark:text-white mb-4">Verification Hub</h3>
                <p className="text-slate-300 dark:text-slate-400 mb-4">
                  All income, expenses, and liability information linked to supporting evidence with verification status and audit trail.
                </p>
                <div className="space-y-3">
                  {[
                    { field: 'Gross Income - Salary', status: 'verified', evidence: 'EV-2024-001', verifiedBy: 'compliance@growkyc.com', date: '2024-03-20' },
                    { field: 'Employment Status', status: 'verified', evidence: 'EV-2024-002', verifiedBy: 'compliance@growkyc.com', date: '2024-03-20' },
                    { field: 'Credit Card - CommBank', status: 'verified', evidence: 'EV-2024-003', verifiedBy: 'System (Equifax)', date: '2024-03-20' },
                    { field: 'Residential Address', status: 'verified', evidence: 'EV-2024-004', verifiedBy: 'compliance@growkyc.com', date: '2024-03-20' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#0f172a] dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-semibold text-white dark:text-white">{item.field}</div>
                          <div className="text-xs text-slate-400">
                            Verified by {item.verifiedBy} • {item.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-xs">
                          {item.status.toUpperCase()}
                        </span>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          {item.evidence}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclosure Register Tab */}
            {activeTab === 'disclosure' && (
              <div className="bg-[#1e293b] dark:bg-gray-800 rounded-lg border border-white/10 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-white dark:text-white mb-4">NCCP Disclosure Register</h3>
                <div className="space-y-3">
                  {[
                    { document: 'Credit Guide', issued: '2024-03-15', acknowledged: '2024-03-15', status: 'complete' },
                    { document: 'Credit Proposal Disclosure', issued: '2024-03-18', acknowledged: '2024-03-18', status: 'complete' },
                    { document: 'Pre-contractual Statement', issued: '2024-03-20', acknowledged: null, status: 'pending' }
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#0f172a] dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#13B5EA]" />
                        <div>
                          <div className="font-semibold text-white dark:text-white">{doc.document}</div>
                          <div className="text-xs text-slate-400">
                            Issued: {doc.issued} {doc.acknowledged && `• Acknowledged: ${doc.acknowledged}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          doc.status === 'complete' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                          {doc.status.toUpperCase()}
                        </span>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

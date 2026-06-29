import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  ArrowLeft,
  DollarSign,
  Calculator,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Shield,
  TrendingUp,
  TrendingDown,
  Download,
  Eye
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { toast } from '../../lib/toast';

interface CreditModuleProps {
  onBack: () => void;
}

export function CreditModule({ onBack }: CreditModuleProps) {
  const [financialData, setFinancialData] = useState({
    grossIncome: 120000,
    netIncome: 95000,
    rentMortgage: 2500,
    utilities: 500,
    groceries: 800,
    transport: 400,
    other: 1200,
    propertyValue: 650000,
    existingLoans: 350000,
    savings: 45000,
    superannuation: 180000,
    dependants: 2,
    existingLoanPayments: 2800
  });

  const [serviceability, setServiceability] = useState({
    loanAmount: 250000,
    term: 25,
    rate: 6.5,
    assessmentRate: 8.5,
    buffer: 3.0
  });

  const calculateServiceability = () => {
    const monthlyPayment = (serviceability.loanAmount * (serviceability.assessmentRate / 100 / 12)) / 
                          (1 - Math.pow(1 + (serviceability.assessmentRate / 100 / 12), -serviceability.term * 12));
    
    const monthlyIncome = financialData.netIncome / 12;
    const monthlyExpenses = financialData.rentMortgage + financialData.utilities + 
                           financialData.groceries + financialData.transport + 
                           financialData.other + financialData.existingLoanPayments;
    
    const surplus = monthlyIncome - monthlyExpenses - monthlyPayment;
    const ratio = (monthlyPayment + financialData.existingLoanPayments) / monthlyIncome * 100;
    
    return {
      monthlyPayment: Math.round(monthlyPayment),
      monthlyIncome: Math.round(monthlyIncome),
      monthlyExpenses: Math.round(monthlyExpenses),
      surplus: Math.round(surplus),
      ratio: Math.round(ratio * 10) / 10,
      result: surplus > 0 && ratio < 40 ? 'pass' : 'fail'
    };
  };

  const serviceabilityResult = calculateServiceability();

  const creditDecisions = [
    {
      id: 'CD-2024-001',
      client: 'John Smith',
      date: '2024-02-28',
      loanAmount: 250000,
      purpose: 'Home Purchase',
      decision: 'Approved',
      approvedAmount: 250000,
      conditions: ['Property valuation required', 'Insurance confirmation'],
      officer: 'Jane Wilson',
      status: 'active'
    },
    {
      id: 'CD-2024-002',
      client: 'Sarah Brown',
      date: '2024-02-25',
      loanAmount: 50000,
      purpose: 'Investment Property',
      decision: 'Conditional',
      approvedAmount: 40000,
      conditions: ['Reduced to $40k based on capacity', 'Additional security required'],
      officer: 'Mark Davis',
      status: 'pending'
    },
    {
      id: 'CD-2024-003',
      client: 'Michael Lee',
      date: '2024-02-20',
      loanAmount: 100000,
      purpose: 'Debt Consolidation',
      decision: 'Declined',
      approvedAmount: 0,
      conditions: ['Insufficient capacity', 'High existing debt burden'],
      officer: 'Jane Wilson',
      status: 'closed'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="bg-[#1e293b] border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <DollarSign className="w-6 h-6 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-white">Credit & Responsible Lending</h1>
                <p className="text-sm text-slate-300">NCCP Compliance & Serviceability Assessment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="financial" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="financial">Financial Position</TabsTrigger>
            <TabsTrigger value="serviceability">Serviceability Engine</TabsTrigger>
            <TabsTrigger value="unsuitability">Unsuitability Test</TabsTrigger>
            <TabsTrigger value="decisions">Credit Decision Log</TabsTrigger>
          </TabsList>

          {/* Financial Position Capture */}
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Position Capture
                </CardTitle>
                <CardDescription>
                  Complete financial assessment for responsible lending obligations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Income */}
                <div>
                  <h3 className="font-semibold text-lg text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Income
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gross Annual Income</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <Input 
                          type="number" 
                          className="pl-7"
                          value={financialData.grossIncome}
                          onChange={(e) => setFinancialData({...financialData, grossIncome: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Net Annual Income (after tax)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <Input 
                          type="number" 
                          className="pl-7"
                          value={financialData.netIncome}
                          onChange={(e) => setFinancialData({...financialData, netIncome: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expenses */}
                <div>
                  <h3 className="font-semibold text-lg text-white mb-4 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    Monthly Expenses
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Rent / Mortgage</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <Input 
                          type="number" 
                          className="pl-7"
                          value={financialData.rentMortgage}
                          onChange={(e) => setFinancialData({...financialData, rentMortgage: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Utilities</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <Input 
                          type="number" 
                          className="pl-7"
                          value={financialData.utilities}
                          onChange={(e) => setFinancialData({...financialData, utilities: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Groceries</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <Input 
                          type="number" 
                          className="pl-7"
                          value={financialData.groceries}
                          onChange={(e) => setFinancialData({...financialData, groceries: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Transport</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <Input 
                          type="number" 
                          className="pl-7"
                          value={financialData.transport}
                          onChange={(e) => setFinancialData({...financialData, transport: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Other Expenses</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <Input 
                          type="number" 
                          className="pl-7"
                          value={financialData.other}
                          onChange={(e) => setFinancialData({...financialData, other: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Existing Loan Payments</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <Input 
                          type="number" 
                          className="pl-7"
                          value={financialData.existingLoanPayments}
                          onChange={(e) => setFinancialData({...financialData, existingLoanPayments: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assets & Liabilities */}
                <div>
                  <h3 className="font-semibold text-lg text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Assets & Liabilities
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Property Value</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                          <Input 
                            type="number" 
                            className="pl-7"
                            value={financialData.propertyValue}
                            onChange={(e) => setFinancialData({...financialData, propertyValue: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Savings</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                          <Input 
                            type="number" 
                            className="pl-7"
                            value={financialData.savings}
                            onChange={(e) => setFinancialData({...financialData, savings: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Superannuation</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                          <Input 
                            type="number" 
                            className="pl-7"
                            value={financialData.superannuation}
                            onChange={(e) => setFinancialData({...financialData, superannuation: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Existing Loans</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                          <Input 
                            type="number" 
                            className="pl-7"
                            value={financialData.existingLoans}
                            onChange={(e) => setFinancialData({...financialData, existingLoans: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Number of Dependants</Label>
                        <Input 
                          type="number"
                          value={financialData.dependants}
                          onChange={(e) => setFinancialData({...financialData, dependants: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={() => toast.success('Financial position saved')}>
                    Save Financial Position
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export to PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Serviceability Engine */}
          <TabsContent value="serviceability" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Input Panel */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Loan Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Loan Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <Input 
                        type="number" 
                        className="pl-7"
                        value={serviceability.loanAmount}
                        onChange={(e) => setServiceability({...serviceability, loanAmount: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Loan Term (years)</Label>
                    <Input 
                      type="number"
                      value={serviceability.term}
                      onChange={(e) => setServiceability({...serviceability, term: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Interest Rate (%)</Label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={serviceability.rate}
                      onChange={(e) => setServiceability({...serviceability, rate: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Assessment Rate (%) - APRA Buffer</Label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={serviceability.assessmentRate}
                      onChange={(e) => setServiceability({...serviceability, assessmentRate: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Serviceability Buffer (%)</Label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={serviceability.buffer}
                      onChange={(e) => setServiceability({...serviceability, buffer: parseFloat(e.target.value)})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Results Panel */}
              <Card className={`col-span-2 ${
                serviceabilityResult.result === 'pass' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {serviceabilityResult.result === 'pass' ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    Serviceability Assessment Result
                  </CardTitle>
                  <CardDescription>
                    {serviceabilityResult.result === 'pass' 
                      ? 'Borrower meets serviceability requirements' 
                      : 'Borrower does not meet serviceability requirements'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-[#1e293b]">
                      <CardContent className="p-4">
                        <div className="text-sm text-slate-300">Monthly Payment</div>
                        <div className="text-2xl font-bold text-white">
                          ${serviceabilityResult.monthlyPayment.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-300 mt-1">
                          At {serviceability.assessmentRate}% assessment rate
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#1e293b]">
                      <CardContent className="p-4">
                        <div className="text-sm text-slate-300">Monthly Surplus</div>
                        <div className={`text-2xl font-bold ${
                          serviceabilityResult.surplus > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${serviceabilityResult.surplus.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-300 mt-1">
                          After all commitments
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#1e293b]">
                      <CardContent className="p-4">
                        <div className="text-sm text-slate-300">Debt Service Ratio</div>
                        <div className={`text-2xl font-bold ${
                          serviceabilityResult.ratio < 40 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {serviceabilityResult.ratio}%
                        </div>
                        <div className="text-xs text-slate-300 mt-1">
                          Target: &lt;40%
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Breakdown */}
                  <Card className="bg-[#1e293b]">
                    <CardHeader>
                      <CardTitle className="text-base">Monthly Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b">
                        <span className="text-sm text-slate-300">Net Monthly Income</span>
                        <span className="font-semibold text-green-600">
                          ${serviceabilityResult.monthlyIncome.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b">
                        <span className="text-sm text-slate-300">Monthly Expenses</span>
                        <span className="font-semibold text-red-600">
                          -${serviceabilityResult.monthlyExpenses.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b">
                        <span className="text-sm text-slate-300">Proposed Loan Payment</span>
                        <span className="font-semibold text-red-600">
                          -${serviceabilityResult.monthlyPayment.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold text-white">Surplus / (Deficit)</span>
                        <span className={`text-xl font-bold ${
                          serviceabilityResult.surplus > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${serviceabilityResult.surplus.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Decision Guidance */}
                  <Card className={`${
                    serviceabilityResult.result === 'pass' ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {serviceabilityResult.result === 'pass' ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="text-sm">
                          {serviceabilityResult.result === 'pass' ? (
                            <>
                              <div className="font-semibold text-green-900 mb-1">
                                Serviceability: PASS
                              </div>
                              <div className="text-green-800">
                                The borrower has demonstrated sufficient capacity to service the proposed loan. 
                                Positive monthly surplus and debt service ratio within acceptable limits.
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="font-semibold text-red-900 mb-1">
                                Serviceability: FAIL
                              </div>
                              <div className="text-red-800">
                                The borrower does not have sufficient capacity to service the proposed loan. 
                                {serviceabilityResult.surplus < 0 && ' Negative monthly surplus indicates insufficient income.'}
                                {serviceabilityResult.ratio >= 40 && ' Debt service ratio exceeds 40% threshold.'}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Unsuitability Test */}
          <TabsContent value="unsuitability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Unsuitability Test
                </CardTitle>
                <CardDescription>
                  NCCP Section 128 - Not Unsuitable Assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Card className="border-2">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-2">
                            1. Objectives & Requirements Met?
                          </div>
                          <p className="text-sm text-slate-300 mb-3">
                            Does the proposed credit contract meet the consumer's objectives and requirements?
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-green-500 text-green-700">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Yes
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="w-4 h-4 mr-2" />
                              No
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-2">
                            2. Risk Tolerance Aligned?
                          </div>
                          <p className="text-sm text-slate-300 mb-3">
                            Is the consumer comfortable with the risk profile of this credit product?
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-green-500 text-green-700">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Yes
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="w-4 h-4 mr-2" />
                              No
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-2">
                            3. Capacity Sufficient?
                          </div>
                          <p className="text-sm text-slate-300 mb-3">
                            Can the consumer meet repayment obligations without substantial hardship?
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-green-500 text-green-700">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Yes
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="w-4 h-4 mr-2" />
                              No
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">Written Reasoning (Mandatory)</Label>
                  <Textarea 
                    rows={6}
                    placeholder="Provide detailed written reasoning for the unsuitability assessment. This reasoning must be retained for 7 years as part of the credit file under NCCP requirements..."
                    className="resize-none"
                  />
                </div>

                <Card className="bg-blue-50 border-blue-300">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <strong>NCCP Requirement:</strong> You must document your assessment that the credit 
                        contract is "not unsuitable" for the consumer. This assessment and supporting evidence 
                        must be retained for 7 years and made available upon ASIC request.
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={() => toast.success('Unsuitability assessment saved to credit file')}>
                  Save Assessment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Credit Decision Log */}
          <TabsContent value="decisions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Credit Decision Log</CardTitle>
                <CardDescription>
                  Complete record of all credit decisions with NCCP compliance evidence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creditDecisions.map((decision) => (
                    <Card 
                      key={decision.id}
                      className={`border-2 ${
                        decision.decision === 'Approved' ? 'border-green-300 bg-green-50' :
                        decision.decision === 'Conditional' ? 'border-amber-300 bg-amber-50' :
                        'border-red-300 bg-red-50'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="font-mono text-sm font-semibold text-slate-300">
                                {decision.id}
                              </span>
                              <Badge className={
                                decision.decision === 'Approved' ? 'bg-green-600' :
                                decision.decision === 'Conditional' ? 'bg-amber-600' :
                                'bg-red-600'
                              }>
                                {decision.decision}
                              </Badge>
                              <Badge variant="outline">{decision.status}</Badge>
                            </div>
                            <h3 className="font-semibold text-lg text-white mb-3">
                              {decision.client} - {decision.purpose}
                            </h3>
                            <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                              <div>
                                <div className="text-slate-300">Decision Date</div>
                                <div className="font-medium">
                                  {new Date(decision.date).toLocaleDateString('en-AU')}
                                </div>
                              </div>
                              <div>
                                <div className="text-slate-300">Requested Amount</div>
                                <div className="font-medium">
                                  ${decision.loanAmount.toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <div className="text-slate-300">Approved Amount</div>
                                <div className={`font-bold ${
                                  decision.approvedAmount > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  ${decision.approvedAmount.toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <div className="text-slate-300">Responsible Officer</div>
                                <div className="font-medium">{decision.officer}</div>
                              </div>
                            </div>
                            {decision.conditions.length > 0 && (
                              <div className="p-3 bg-[#1e293b] rounded border">
                                <div className="text-sm font-semibold text-white mb-2">
                                  Conditions:
                                </div>
                                <ul className="text-sm text-slate-300 space-y-1">
                                  {decision.conditions.map((condition, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                      {condition}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Button size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View File
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

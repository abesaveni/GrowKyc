import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  ArrowLeft,
  Calculator as CalcIcon,
  DollarSign,
  Percent,
  TrendingUp,
  Info,
  Lock,
  Home,
  FileText,
  Banknote,
  PiggyBank
} from 'lucide-react';

interface CalculatorProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function Calculator({ onNavigate, onBack }: CalculatorProps) {
  const [loanAmount, setLoanAmount] = useState('850000');
  const [interestRate, setInterestRate] = useState('8.5');
  const [loanTerm, setLoanTerm] = useState('36');
  const [repaymentType, setRepaymentType] = useState('pi');
  
  // New fields
  const [brokerFeePercent, setBrokerFeePercent] = useState('2.0');
  const [establishmentFeePercent, setEstablishmentFeePercent] = useState('1.5');
  const [cappedInterestEnabled, setCappedInterestEnabled] = useState(false);
  const [cappedInterestMonths, setCappedInterestMonths] = useState('12');
  const [annualIncome, setAnnualIncome] = useState('500000');
  const [payoutAmount, setPayoutAmount] = useState('0');
  const [otherCosts, setOtherCosts] = useState('0');
  const [securityValue, setSecurityValue] = useState('1200000');
  const [legalCost, setLegalCost] = useState('0');
  const [lvrPercent, setLvrPercent] = useState('70.8');

  // Update LVR when manual loan amount changes
  const handleLoanAmountChange = (value: string) => {
    setLoanAmount(value);
    if (parseFloat(securityValue) > 0) {
      const newLvr = (parseFloat(value) / parseFloat(securityValue)) * 100;
      setLvrPercent(newLvr.toFixed(1));
    }
  };

  // Update loan amount when LVR or security value changes
  const handleLvrChange = (value: string) => {
    setLvrPercent(value);
    const newLoanAmount = (parseFloat(securityValue || '0') * parseFloat(value || '0')) / 100;
    setLoanAmount(newLoanAmount.toString());
  };

  const handleSecurityValueChange = (value: string) => {
    setSecurityValue(value);
    const newLoanAmount = (parseFloat(value || '0') * parseFloat(lvrPercent || '0')) / 100;
    setLoanAmount(newLoanAmount.toString());
  };

  const calculateMonthlyPayment = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseInt(loanTerm);

    if (repaymentType === 'pi') {
      const payment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return payment;
    } else {
      return P * r;
    }
  };

  const calculateFees = () => {
    const P = parseFloat(loanAmount);
    const brokerFee = P * (parseFloat(brokerFeePercent) / 100);
    const establishmentFee = P * (parseFloat(establishmentFeePercent) / 100);
    return { brokerFee, establishmentFee, totalFees: brokerFee + establishmentFee };
  };

  const calculateCappedInterest = () => {
    if (!cappedInterestEnabled) return null;

    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 100 / 12;
    const cappedMonths = parseInt(cappedInterestMonths);
    
    let remainingBalance = P;
    let totalCappedInterest = 0;

    for (let i = 0; i < cappedMonths; i++) {
      const monthlyInterest = remainingBalance * r;
      totalCappedInterest += monthlyInterest;
      
      if (repaymentType === 'pi') {
        const monthlyPayment = calculateMonthlyPayment();
        const principalPortion = monthlyPayment - monthlyInterest;
        remainingBalance -= principalPortion;
      }
    }

    return {
      cappedMonths,
      totalCappedInterest,
      monthlyInterest: totalCappedInterest / cappedMonths
    };
  };

  const monthlyPayment = calculateMonthlyPayment();
  const fees = calculateFees();
  const cappedInterestData = calculateCappedInterest();
  
  const totalRepayments = monthlyPayment * parseInt(loanTerm);
  const totalInterest = repaymentType === 'pi' 
    ? totalRepayments - parseFloat(loanAmount)
    : monthlyPayment * parseInt(loanTerm);
  
  const principal = repaymentType === 'pi' 
    ? monthlyPayment * Math.pow(1 + parseFloat(interestRate) / 100 / 12, -1) 
    : 0;
  const interest = repaymentType === 'pi' ? monthlyPayment - principal : monthlyPayment;

  const netProceeds = parseFloat(loanAmount) - fees.totalFees - parseFloat(payoutAmount) - parseFloat(legalCost) - parseFloat(otherCosts);
  const lvr = (parseFloat(loanAmount) / parseFloat(securityValue)) * 100;

  const formatCurrency = (value: number) => {
    if (isNaN(value)) return '$0';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatCurrencyDetailed = (value: number) => {
    if (isNaN(value)) return '$0.00';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-white/10 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <Button variant="outline" size="sm" onClick={onBack} className="hover:bg-white/5">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <CalcIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-100">PFA Loan Calculator</h1>
                  <p className="text-xs text-slate-400">Calculate loan details, fees, and serviceability</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Key Metrics Dashboard */}
          <div className="xl:col-span-1 space-y-6">
            {/* Security & LVR - Hero Section */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <Home className="w-5 h-5" />
                <h2 className="text-lg font-bold">Security & Loan</h2>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-indigo-100 mb-2">
                    Property Value
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70">$</span>
                    <input
                      type="text"
                      value={parseFloat(securityValue || '0').toLocaleString()}
                      onChange={(e) => handleSecurityValueChange(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full pl-9 pr-4 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-2xl font-bold text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 backdrop-blur-sm"
                      placeholder="1,200,000"
                    />
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="5000000"
                    step="10000"
                    value={securityValue}
                    onChange={(e) => handleSecurityValueChange(e.target.value)}
                    className="w-full mt-3 h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: 'linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) 100%)'
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-indigo-100 mb-2">
                      LVR
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={lvrPercent}
                        onChange={(e) => handleLvrChange(e.target.value)}
                        className="w-full px-3 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-xl font-bold text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 backdrop-blur-sm"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 font-bold">%</span>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <input
                      type="range"
                      min="10"
                      max="95"
                      step="0.1"
                      value={lvrPercent}
                      onChange={(e) => handleLvrChange(e.target.value)}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: 'linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) 100%)'
                      }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <label className="block text-sm font-medium text-indigo-100 mb-2">
                    Loan Amount
                  </label>
                  <div className="text-4xl font-black text-white mb-2">
                    {formatCurrency(parseFloat(loanAmount))}
                  </div>
                  <div className="text-xs text-indigo-200">
                    {formatCurrency(parseFloat(securityValue))} × {lvrPercent}%
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Repayment */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Banknote className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">Monthly Repayment</h3>
              </div>
              <div className="text-4xl font-black text-emerald-400 mb-4">
                {formatCurrency(monthlyPayment)}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-slate-400 mb-1">Principal</div>
                  <div className="text-lg font-bold text-slate-100">{formatCurrency(principal)}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-slate-400 mb-1">Interest</div>
                  <div className="text-lg font-bold text-slate-100">{formatCurrency(interest)}</div>
                </div>
              </div>
            </div>

            {/* Net Proceeds */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <PiggyBank className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wide">Net Proceeds at Settlement</h3>
              </div>
              <div className="text-4xl font-black mb-1">
                {formatCurrency(netProceeds)}
              </div>
              <div className="text-xs text-blue-200">
                Cash available to borrower after all deductions
              </div>
            </div>

            {/* LVR Status Badge */}
            {(() => {
              if (lvr <= 65) {
                return (
                  <div className="bg-green-500/10 border-2 border-green-500/30 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500/15 rounded-full flex items-center justify-center">
                        <span className="text-2xl">✓</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-green-300">Conservative LVR</div>
                        <div className="text-xs text-green-300">Excellent security position</div>
                      </div>
                    </div>
                  </div>
                );
              } else if (lvr <= 75) {
                return (
                  <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500/15 rounded-full flex items-center justify-center">
                        <span className="text-2xl">✓</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-blue-300">Good LVR</div>
                        <div className="text-xs text-blue-300">Standard risk profile</div>
                      </div>
                    </div>
                  </div>
                );
              } else if (lvr <= 80) {
                return (
                  <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-500/15 rounded-full flex items-center justify-center">
                        <span className="text-2xl">⚠</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-yellow-300">Moderate LVR</div>
                        <div className="text-xs text-yellow-300">Acceptable security</div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-500/15 rounded-full flex items-center justify-center">
                        <span className="text-2xl">✗</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-red-300">High LVR</div>
                        <div className="text-xs text-red-300">Higher risk profile</div>
                      </div>
                    </div>
                  </div>
                );
              }
            })()}
          </div>

          {/* MIDDLE COLUMN - Loan Parameters */}
          <div className="xl:col-span-1 space-y-6">
            {/* Loan Terms */}
            <Card className="shadow-lg border-white/10">
              <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Loan Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Interest Rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-white/10 rounded-xl text-xl font-bold text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      step="0.1"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="15"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full mt-3 h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>5%</span>
                    <span>15%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Loan Term
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-white/10 rounded-xl text-xl font-bold text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">months</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    step="6"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="w-full mt-3 h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 year</span>
                    <span>10 years</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">Repayment Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setRepaymentType('pi')}
                      className={`px-4 py-4 border-2 rounded-xl font-semibold transition-all ${
                        repaymentType === 'pi'
                          ? 'border-blue-600 bg-blue-500/10 text-blue-300 shadow-md'
                          : 'border-white/10 bg-white text-slate-300 hover:border-blue-300 hover:bg-blue-500/10'
                      }`}
                    >
                      P&I
                    </button>
                    <button
                      onClick={() => setRepaymentType('io')}
                      className={`px-4 py-4 border-2 rounded-xl font-semibold transition-all ${
                        repaymentType === 'io'
                          ? 'border-blue-600 bg-blue-500/10 text-blue-300 shadow-md'
                          : 'border-white/10 bg-white text-slate-300 hover:border-blue-300 hover:bg-blue-500/10'
                      }`}
                    >
                      Interest Only
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fees & Charges */}
            <Card className="shadow-lg border-white/10">
              <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-white">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Percent className="w-5 h-5 text-purple-400" />
                  Fees & Charges
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-slate-300">Broker Fee</label>
                    <span className="text-lg font-black text-purple-400">{formatCurrency(fees.brokerFee)}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={brokerFeePercent}
                      onChange={(e) => setBrokerFeePercent(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-white/10 rounded-lg text-base font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      step="0.1"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-slate-300">Establishment Fee</label>
                    <span className="text-lg font-black text-purple-400">{formatCurrency(fees.establishmentFee)}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={establishmentFeePercent}
                      onChange={(e) => setEstablishmentFeePercent(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-white/10 rounded-lg text-base font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      step="0.1"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-300">Total Fees</span>
                    <span className="text-2xl font-black text-purple-300">{formatCurrency(fees.totalFees)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loan Use / Allocation */}
            <Card className="shadow-lg border-white/10">
              <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-white">
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="w-5 h-5 text-indigo-400" />
                  Loan Allocation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Payout / Purchase
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="text"
                      value={parseFloat(payoutAmount || '0').toLocaleString()}
                      onChange={(e) => setPayoutAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full pl-8 pr-4 py-2 border-2 border-white/10 rounded-lg text-base font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Legal Costs
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="text"
                      value={parseFloat(legalCost || '0').toLocaleString()}
                      onChange={(e) => setLegalCost(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full pl-8 pr-4 py-2 border-2 border-white/10 rounded-lg text-base font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Other Costs
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="text"
                      value={parseFloat(otherCosts || '0').toLocaleString()}
                      onChange={(e) => setOtherCosts(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full pl-8 pr-4 py-2 border-2 border-white/10 rounded-lg text-base font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Borrower Income */}
            <Card className="shadow-lg border-white/10">
              <CardHeader className="border-b bg-gradient-to-r from-teal-50 to-white">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-5 h-5 text-teal-400" />
                  Borrower Income
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-3">
                    Annual EBITDA / Income
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="text"
                      value={parseFloat(annualIncome).toLocaleString()}
                      onChange={(e) => setAnnualIncome(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full pl-9 pr-4 py-3 border-2 border-white/10 rounded-xl text-xl font-bold text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="2000000"
                    step="10000"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    className="w-full mt-3 h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>$100K</span>
                    <span>$2M</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - Results & Analysis */}
          <div className="xl:col-span-1 space-y-6">
            {/* Loan Summary */}
            <Card className="shadow-lg border-white/10">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-white">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Settlement Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-sm text-slate-300">Loan Amount</span>
                    <span className="text-lg font-bold text-slate-100">{formatCurrency(parseFloat(loanAmount))}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-sm text-slate-300">Broker Fee</span>
                    <span className="text-base font-bold text-red-400">-{formatCurrency(fees.brokerFee)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-sm text-slate-300">Establishment Fee</span>
                    <span className="text-base font-bold text-red-400">-{formatCurrency(fees.establishmentFee)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-sm text-slate-300">Payout/Purchase</span>
                    <span className="text-base font-bold text-red-400">-{formatCurrency(parseFloat(payoutAmount))}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-sm text-slate-300">Legal Costs</span>
                    <span className="text-base font-bold text-red-400">-{formatCurrency(parseFloat(legalCost))}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-sm text-slate-300">Other Costs</span>
                    <span className="text-base font-bold text-red-400">-{formatCurrency(parseFloat(otherCosts))}</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 -mx-6 px-6 py-4 mt-4 rounded-b-xl">
                    <span className="text-sm font-bold text-slate-100">Net Proceeds</span>
                    <span className="text-2xl font-black text-blue-300">
                      {formatCurrency(netProceeds)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Serviceability Analysis */}
            <Card className="shadow-lg border-white/10">
              <CardHeader className="border-b bg-gradient-to-r from-teal-50 to-white">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-5 h-5 text-teal-400" />
                  Serviceability (DSCR)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {annualIncome && parseFloat(annualIncome) > 0 && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-5 border-2 border-teal-500/30">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-teal-300 mb-1">Annual EBITDA</div>
                          <div className="text-2xl font-black text-teal-300">{formatCurrency(parseFloat(annualIncome))}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-teal-300 mb-1">DSCR Ratio</div>
                          <div className="text-3xl font-black text-teal-300">
                            {(parseFloat(annualIncome) / (monthlyPayment * 12)).toFixed(2)}x
                          </div>
                        </div>
                      </div>
                      
                      {(() => {
                        const actualDSCR = parseFloat(annualIncome) / (monthlyPayment * 12);
                        const surplus = parseFloat(annualIncome) - (monthlyPayment * 12);
                        
                        if (actualDSCR >= 1.50) {
                          return (
                            <div className="bg-teal-600 text-white rounded-lg p-4 text-center">
                              <div className="font-black text-lg mb-1">✓ EXCELLENT</div>
                              <div className="text-sm opacity-90">{formatCurrency(surplus)} annual surplus</div>
                            </div>
                          );
                        } else if (actualDSCR >= 1.35) {
                          return (
                            <div className="bg-blue-600 text-white rounded-lg p-4 text-center">
                              <div className="font-black text-lg mb-1">✓ GOOD</div>
                              <div className="text-sm opacity-90">{formatCurrency(surplus)} annual surplus</div>
                            </div>
                          );
                        } else if (actualDSCR >= 1.25) {
                          return (
                            <div className="bg-green-600 text-white rounded-lg p-4 text-center">
                              <div className="font-black text-lg mb-1">✓ ACCEPTABLE</div>
                              <div className="text-sm opacity-90">{formatCurrency(surplus)} annual surplus</div>
                            </div>
                          );
                        } else if (actualDSCR >= 1.0) {
                          return (
                            <div className="bg-yellow-500 text-white rounded-lg p-4 text-center">
                              <div className="font-black text-lg mb-1">⚠ MARGINAL</div>
                              <div className="text-sm opacity-90">Below requirements</div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="bg-red-600 text-white rounded-lg p-4 text-center">
                              <div className="font-black text-lg mb-1">✗ INSUFFICIENT</div>
                              <div className="text-sm opacity-90">{formatCurrency((monthlyPayment * 12) - parseFloat(annualIncome))} shortfall</div>
                            </div>
                          );
                        }
                      })()}
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Required Income Levels</div>
                      
                      <div className={`rounded-lg p-3 border-2 ${
                        parseFloat(annualIncome) >= monthlyPayment * 12 * 1.25
                          ? 'bg-green-500/10 border-green-300'
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-xs font-semibold text-slate-300">Min (1.25x)</div>
                            <div className="text-lg font-black text-slate-100">{formatCurrency(monthlyPayment * 12 * 1.25)}</div>
                          </div>
                          {parseFloat(annualIncome) >= monthlyPayment * 12 * 1.25 && (
                            <span className="text-green-400 font-bold text-lg">✓</span>
                          )}
                        </div>
                      </div>
                      
                      <div className={`rounded-lg p-3 border-2 ${
                        parseFloat(annualIncome) >= monthlyPayment * 12 * 1.35
                          ? 'bg-blue-500/10 border-blue-300'
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-xs font-semibold text-slate-300">Preferred (1.35x)</div>
                            <div className="text-lg font-black text-slate-100">{formatCurrency(monthlyPayment * 12 * 1.35)}</div>
                          </div>
                          {parseFloat(annualIncome) >= monthlyPayment * 12 * 1.35 && (
                            <span className="text-blue-400 font-bold text-lg">✓</span>
                          )}
                        </div>
                      </div>

                      <div className={`rounded-lg p-3 border-2 ${
                        parseFloat(annualIncome) >= monthlyPayment * 12 * 1.50
                          ? 'bg-purple-500/10 border-purple-300'
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-xs font-semibold text-slate-300">Strong (1.50x)</div>
                            <div className="text-lg font-black text-slate-100">{formatCurrency(monthlyPayment * 12 * 1.50)}</div>
                          </div>
                          {parseFloat(annualIncome) >= monthlyPayment * 12 * 1.50 && (
                            <span className="text-purple-400 font-bold text-lg">✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Total Interest Info */}
            <Card className="shadow-lg border-white/10">
              <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-white">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Info className="w-5 h-5 text-orange-400" />
                  Interest Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-slate-300 mb-1">Total Interest Payable</div>
                    <div className="text-3xl font-black text-orange-400">{formatCurrency(totalInterest)}</div>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-sm text-slate-300 mb-1">Total Amount Repayable</div>
                    <div className="text-2xl font-black text-slate-100">{formatCurrency(totalRepayments)}</div>
                  </div>
                  <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/30">
                    <div className="text-xs text-orange-300 mb-1">Over {loanTerm} months</div>
                    <div className="text-sm font-bold text-orange-300">
                      {parseInt(loanTerm) / 12} year{parseInt(loanTerm) / 12 !== 1 ? 's' : ''} loan term
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

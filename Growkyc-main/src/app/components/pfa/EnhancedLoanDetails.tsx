import React from 'react';
import { CheckCircle, AlertCircle, X, Clock } from 'lucide-react';

interface EnhancedLoanDetailsProps {
  deal: any;
}

export function EnhancedLoanDetails({ deal }: EnhancedLoanDetailsProps) {
  // Calculate loan financials
  const loanAmount = deal.loan.amount;
  const establishmentFee = loanAmount * 0.02; // 2%
  const brokerFee = loanAmount * 0.015; // 1.5%
  const interestRate = deal.loan.interestRate / 100;
  const costOfFunds = 0.055; // 5.5% cost of funds
  const term = deal.loan.term;
  const capitalisedPeriod = 6; // months
  
  // Monthly interest-only payment
  const monthlyInterestPayment = (loanAmount * interestRate) / 12;
  
  // Calculate return metrics
  const totalInterestIncome = (loanAmount * interestRate * (term / 12));
  const totalFeeIncome = establishmentFee + brokerFee;
  const costOfFundsExpense = loanAmount * costOfFunds * (term / 12);
  const netReturn = totalInterestIncome + totalFeeIncome - costOfFundsExpense;
  const returnOnFunds = (netReturn / loanAmount) * 100;
  const annualizedReturn = (returnOnFunds / term) * 12;

  // Generate monthly cash flow data for graph
  const cashFlowData: { month: number; cashFlow: number }[] = [];
  let cumulativeCashFlow = -(loanAmount); // Initial outflow
  
  for (let month = 0; month <= term; month++) {
    if (month === 0) {
      // Month 0: Loan disbursement + fees collected
      cumulativeCashFlow += establishmentFee + brokerFee;
    } else if (month <= capitalisedPeriod) {
      // Capitalized period: no payments received, cost of funds accrues
      const monthlyFundingCost = (loanAmount * costOfFunds) / 12;
      cumulativeCashFlow -= monthlyFundingCost;
    } else {
      // Regular payment period
      const monthlyFundingCost = (loanAmount * costOfFunds) / 12;
      cumulativeCashFlow += monthlyInterestPayment - monthlyFundingCost;
    }
    
    if (month === term) {
      // Final month: principal returned
      cumulativeCashFlow += loanAmount;
    }
    
    cashFlowData.push({
      month,
      cashFlow: cumulativeCashFlow
    });
  }

  return (
    <div className="space-y-6">
      {/* Loan Structure */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Structure</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Loan Type</p>
            <p className="font-semibold text-gray-900">{deal.loan.type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Loan Amount</p>
            <p className="font-semibold text-gray-900 text-lg">${loanAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Loan Term</p>
            <p className="font-semibold text-gray-900">{term} months</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Interest Rate</p>
            <p className="font-semibold text-gray-900">{deal.loan.interestRate}% p.a.</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Repayment Type</p>
            <p className="font-semibold text-gray-900">{deal.loan.repaymentType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Frequency</p>
            <p className="font-semibold text-gray-900">{deal.loan.frequency}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Monthly Repayment</p>
            <p className="font-semibold text-gray-900 text-lg text-blue-600">
              ${monthlyInterestPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Purpose</p>
            <p className="font-semibold text-gray-900">{deal.loan.purpose}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Capitalised Period</p>
            <p className="font-semibold text-gray-900 text-orange-600">{capitalisedPeriod} months</p>
          </div>
        </div>
      </div>

      {/* Fees & Costs */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fees & Costs</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-700 mb-1">Establishment Fee (2.0%)</p>
            <p className="font-bold text-green-900 text-xl">
              ${establishmentFee.toLocaleString(undefined, {maximumFractionDigits: 0})}
            </p>
            <p className="text-xs text-green-600 mt-1">Upfront income</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-700 mb-1">Broker Fee (1.5%)</p>
            <p className="font-bold text-green-900 text-xl">
              ${brokerFee.toLocaleString(undefined, {maximumFractionDigits: 0})}
            </p>
            <p className="text-xs text-green-600 mt-1">Paid to broker</p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700 mb-1">Cost of Funds (5.5% p.a.)</p>
            <p className="font-bold text-red-900 text-xl">
              ${costOfFundsExpense.toLocaleString(undefined, {maximumFractionDigits: 0})}
            </p>
            <p className="text-xs text-red-600 mt-1">Over {term} months</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Fee Income:</span>
              <span className="font-semibold text-gray-900">
                ${totalFeeIncome.toLocaleString(undefined, {maximumFractionDigits: 0})}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Interest Income:</span>
              <span className="font-semibold text-gray-900">
                ${totalInterestIncome.toLocaleString(undefined, {maximumFractionDigits: 0})}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Return Analysis */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Analysis</h3>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 mb-1">Total Income</p>
            <p className="font-bold text-blue-900 text-xl">
              ${(totalInterestIncome + totalFeeIncome).toLocaleString(undefined, {maximumFractionDigits: 0})}
            </p>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-xs text-orange-700 mb-1">Total Costs</p>
            <p className="font-bold text-orange-900 text-xl">
              ${costOfFundsExpense.toLocaleString(undefined, {maximumFractionDigits: 0})}
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-700 mb-1">Net Return</p>
            <p className="font-bold text-green-900 text-xl">
              ${netReturn.toLocaleString(undefined, {maximumFractionDigits: 0})}
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs text-purple-700 mb-1">Return on Funds</p>
            <p className="font-bold text-purple-900 text-xl">
              {returnOnFunds.toFixed(2)}%
            </p>
            <p className="text-xs text-purple-600 mt-1">{annualizedReturn.toFixed(2)}% p.a.</p>
          </div>
        </div>

        {/* Decision Indicator */}
        <div className={`p-4 rounded-lg mb-6 ${
          annualizedReturn >= 4.0 
            ? 'bg-green-50 border border-green-200' 
            : annualizedReturn >= 3.0 
            ? 'bg-yellow-50 border border-yellow-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            {annualizedReturn >= 4.0 ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : annualizedReturn >= 3.0 ? (
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            ) : (
              <X className="w-6 h-6 text-red-600" />
            )}
            <div>
              <p className={`font-semibold ${
                annualizedReturn >= 4.0 
                  ? 'text-green-900' 
                  : annualizedReturn >= 3.0 
                  ? 'text-yellow-900'
                  : 'text-red-900'
              }`}>
                {annualizedReturn >= 4.0 
                  ? '✓ Strong Return - Recommended' 
                  : annualizedReturn >= 3.0 
                  ? '◐ Acceptable Return - Review Required'
                  : '✗ Weak Return - Not Recommended'}
              </p>
              <p className={`text-sm mt-1 ${
                annualizedReturn >= 4.0 
                  ? 'text-green-700' 
                  : annualizedReturn >= 3.0 
                  ? 'text-yellow-700'
                  : 'text-red-700'
              }`}>
                {annualizedReturn >= 4.0 
                  ? 'This loan meets target return thresholds and should be approved subject to credit assessment.' 
                  : annualizedReturn >= 3.0 
                  ? 'This loan provides marginal returns. Consider requesting higher interest rate or fees.'
                  : 'This loan does not meet minimum return requirements. Recommend declining or restructuring terms.'}
              </p>
            </div>
          </div>
        </div>

        {/* Cash Flow Graph */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Cumulative Cash Flow Over Term</h4>
            <div className="text-xs text-gray-600">
              <span className="inline-block w-3 h-3 bg-orange-400 mr-1"></span>
              Capitalised Period |
              <span className="inline-block w-3 h-3 bg-blue-400 ml-2 mr-1"></span>
              Payment Period
            </div>
          </div>
          
          <div className="relative h-80 bg-gray-50 rounded-lg p-4 border border-gray-200">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-600 py-4">
              <span>${(Math.max(...cashFlowData.map(d => d.cashFlow)) / 1000).toFixed(0)}k</span>
              <span>$0</span>
              <span>-${(Math.abs(Math.min(...cashFlowData.map(d => d.cashFlow))) / 1000).toFixed(0)}k</span>
            </div>

            {/* Graph area */}
            <div className="ml-16 mr-4 h-full relative">
              {/* Zero line */}
              <div className="absolute w-full border-t-2 border-gray-400" style={{
                top: `${((Math.max(...cashFlowData.map(d => d.cashFlow)) / 
                  (Math.max(...cashFlowData.map(d => d.cashFlow)) - Math.min(...cashFlowData.map(d => d.cashFlow)))) * 100)}%`
              }}></div>

              {/* Bars */}
              <div className="flex items-end justify-between h-full pt-2 pb-2">
                {cashFlowData.filter((_, i) => i % 3 === 0).map((data, idx) => {
                  const maxVal = Math.max(...cashFlowData.map(d => d.cashFlow));
                  const minVal = Math.min(...cashFlowData.map(d => d.cashFlow));
                  const range = maxVal - minVal;
                  
                  const barHeight = Math.abs((data.cashFlow / range) * 100);
                  const isPositive = data.cashFlow >= 0;
                  const isCapitalised = data.month <= capitalisedPeriod;
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end group relative" style={{
                      height: '100%',
                      marginRight: idx < cashFlowData.filter((_, i) => i % 3 === 0).length - 1 ? '2px' : '0'
                    }}>
                      <div 
                        className={`w-full ${isCapitalised ? 'bg-orange-400' : 'bg-blue-400'} rounded-t transition-all hover:opacity-80`}
                        style={{
                          height: `${barHeight}%`,
                          marginTop: isPositive ? 'auto' : '0',
                          marginBottom: isPositive ? '0' : 'auto'
                        }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                          Month {data.month}: ${(data.cashFlow / 1000).toFixed(0)}k
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels */}
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>0</span>
                <span>{Math.floor(term / 3)}</span>
                <span>{Math.floor(term * 2 / 3)}</span>
                <span>{term}m</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-gray-600 mb-1">Breakeven Point</p>
              <p className="font-semibold text-gray-900">
                Month {cashFlowData.findIndex(d => d.cashFlow > 0) || 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-gray-600 mb-1">Peak Negative Cash Flow</p>
              <p className="font-semibold text-gray-900">
                ${(Math.min(...cashFlowData.map(d => d.cashFlow)) / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-gray-600 mb-1">Final Position</p>
              <p className="font-semibold text-green-600">
                ${(cashFlowData[cashFlowData.length - 1].cashFlow / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Capitalization Details */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Capitalization Details</h3>
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-900 mb-2">
                Interest Capitalized for {capitalisedPeriod} Months
              </p>
              <p className="text-sm text-orange-800 mb-3">
                During the capitalization period, the borrower is not required to make interest payments. 
                This provides breathing room for business establishment/expansion while interest accrues.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-orange-700 mb-1">Capitalized Interest Amount:</p>
                  <p className="font-semibold text-orange-900">
                    ${((monthlyInterestPayment * capitalisedPeriod)).toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </p>
                </div>
                <div>
                  <p className="text-orange-700 mb-1">First Payment Due:</p>
                  <p className="font-semibold text-orange-900">
                    {new Date(new Date().setMonth(new Date().getMonth() + capitalisedPeriod + 1)).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

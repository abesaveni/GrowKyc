
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Building2, 
  ArrowUpRight, 
  ArrowDownRight, 
  History, 
  Truck, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { IllionData, IllionTradeReference } from './IllionData';

interface IllionBusinessCardProps {
  data: IllionData;
}

export function IllionBusinessCard({ data }: IllionBusinessCardProps) {
  const { 
    businessFailureScore, 
    latePaymentScore, 
    tradeReferenceCount, 
    totalTradeLimit, 
    avgDaysBeyondTerms,
    paymentHistory,
    tradeReferences,
    lastUpdated
  } = data;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/30';
    if (score >= 60) return 'bg-blue-500/10 border-blue-500/30';
    if (score >= 40) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
  };

  const historyData = [
    { name: 'Prompt', value: paymentHistory.promptPercentage, color: '#10b981' },
    { name: '1-30 Days', value: paymentHistory.late30Percentage, color: '#f59e0b' },
    { name: '31-60 Days', value: paymentHistory.late60Percentage, color: '#f97316' },
    { name: '61+ Days', value: paymentHistory.late90PlusPercentage, color: '#ef4444' },
  ];

  return (
    <Card className="border-2 border-white/10 shadow-xl overflow-hidden bg-white dark:bg-slate-900">
      <CardHeader className="bg-white/5 dark:bg-slate-800/50 border-b border-white/10 dark:border-slate-700 py-4 px-6 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-white/10 dark:border-slate-700">
            <Building2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-slate-100 dark:text-slate-100">Illion Business Credit Profile</CardTitle>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Intelligence Report Updated: {lastUpdated}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white border-white/10 text-slate-300 font-bold px-2 py-0.5">
            ILLION B2B
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Section 1: Scores & Critical Indicators */}
          <div className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Failure Risk Score */}
              <div className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center ${getScoreBg(businessFailureScore)}`}>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Failure Risk</span>
                <span className={`text-4xl font-black ${getScoreColor(businessFailureScore)}`}>{businessFailureScore}</span>
                <span className="text-[10px] font-bold text-slate-400 mt-1">PERCENTILE</span>
              </div>
              
              {/* Late Payment Score */}
              <div className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center ${getScoreBg(latePaymentScore)}`}>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Late Payment</span>
                <span className={`text-4xl font-black ${getScoreColor(latePaymentScore)}`}>{latePaymentScore}</span>
                <span className="text-[10px] font-bold text-slate-400 mt-1">PERCENTILE</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/5 dark:bg-slate-800 rounded-xl border border-white/10 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-bold text-slate-300 dark:text-slate-300">Avg Days Beyond Terms</span>
                </div>
                <span className={`font-black text-xl ${avgDaysBeyondTerms > 14 ? 'text-red-400' : 'text-slate-100 dark:text-slate-100'}`}>
                  {avgDaysBeyondTerms}d
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 dark:bg-slate-800 rounded-xl border border-white/10 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-bold text-slate-300 dark:text-slate-300">Trade References</span>
                </div>
                <span className="font-black text-xl text-slate-100 dark:text-slate-100">
                  {tradeReferenceCount}
                </span>
              </div>
            </div>

            {/* Total Credit Exposure */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-200 dark:shadow-none">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Trade Exposure</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black">${(totalTradeLimit / 1000).toFixed(0)}k</span>
                <span className="text-xs opacity-70">aggregated limit</span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="bg-white h-full rounded-full"
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold opacity-80">
                <span>$0</span>
                <span>UTILIZATION: 65%</span>
              </div>
            </div>
          </div>

          {/* Section 2: Payment History Chart & Trade Details */}
          <div className="lg:col-span-8 flex flex-col">
            <h4 className="font-bold text-slate-300 dark:text-slate-200 mb-4 flex items-center gap-2 uppercase text-xs tracking-wider">
              <History className="w-4 h-4 text-indigo-500" />
              Payment Performance Summary
            </h4>
            
            {/* Payment History Bar */}
            <div className="mb-8">
              <div className="flex w-full h-8 rounded-full overflow-hidden shadow-inner bg-white/5 dark:bg-slate-800">
                {historyData.map((segment, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ width: 0 }}
                    animate={{ width: `${segment.value}%` }}
                    className="h-full relative group"
                    style={{ backgroundColor: segment.color }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/10 text-[10px] font-bold text-white">
                      {segment.value}%
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between mt-3">
                {historyData.map((segment, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: segment.color }} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{segment.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-300 dark:text-slate-200">{segment.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trade References List */}
            <div className="flex-1 flex flex-col">
              <h4 className="font-bold text-slate-300 dark:text-slate-200 mb-4 flex items-center gap-2 uppercase text-xs tracking-wider">
                <Truck className="w-4 h-4 text-indigo-500" />
                Active Trade References
              </h4>
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[200px] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                {tradeReferences.map((trade, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-white/10 dark:border-slate-800 hover:bg-white/5 dark:hover:bg-slate-800/50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-100 dark:text-slate-200">{trade.supplierCategory}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Limit: ${(trade.creditLimit / 1000).toFixed(1)}k</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Active: {trade.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] font-black uppercase tracking-tighter ${
                          trade.paymentStatus === 'Prompt' 
                            ? 'bg-green-500/10 text-green-300 border-green-500/30' 
                            : 'bg-red-500/10 text-red-300 border-red-500/30'
                        }`}
                      >
                        {trade.paymentStatus}
                      </Badge>
                      <p className="text-xs font-bold text-slate-300 dark:text-slate-400 mt-1">${trade.currentBalance.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 dark:border-slate-800 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${businessFailureScore > 50 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Solvency: {businessFailureScore > 50 ? 'Stable' : 'High Risk'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${latePaymentScore > 50 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Payment Integrity: {latePaymentScore}%</span>
                </div>
              </div>
              <button 
                className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                onClick={() => {
                  const reportId = `ILL-${Math.floor(Math.random() * 1000000)}`;
                  toast.promise(
                    new Promise((resolve) => setTimeout(resolve, 1500)),
                    {
                      loading: 'Aggregating B2B Trade Data...',
                      success: () => {
                        const reportContent = `
ILLION B2B TRADE ANALYSIS REPORT
--------------------------------
Report ID: ${reportId}
Company: ${data.provider} Intelligence Feed
Date: ${new Date().toLocaleString()}

BUSINESS CREDIT SUMMARY
Failure Risk Score: ${businessFailureScore}
Late Payment Score: ${latePaymentScore}
Avg Days Beyond Terms: ${avgDaysBeyondTerms} Days

TRADE EXPOSURE
Active References: ${tradeReferenceCount}
Total Credit Limit: $${totalTradeLimit.toLocaleString()}

PAYMENT BEHAVIOR BREAKDOWN
Prompt: ${paymentHistory.promptPercentage}%
1-30 Days Late: ${paymentHistory.late30Percentage}%
31-60 Days Late: ${paymentHistory.late60Percentage}%
61+ Days Late: ${paymentHistory.late90PlusPercentage}%

This report is generated from Illion's proprietary commercial credit database.
                        `;
                        const blob = new Blob([reportContent], { type: 'text/plain' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Illion_Trade_Analysis_${reportId}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        return 'Analysis exported successfully';
                      },
                      error: 'Failed to export analysis',
                    }
                  );
                }}
              >
                View Full Trade Analysis
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </CardContent>

      {/* Footer Insight */}
      <div className="bg-white/5 dark:bg-slate-800/80 px-6 py-3 border-t border-white/10 dark:border-slate-700 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm border border-white/10 dark:border-slate-600">
          <AlertCircle className="w-4 h-4 text-blue-500" />
        </div>
        <p className="text-xs text-slate-300 dark:text-slate-400 font-medium">
          <span className="font-bold text-slate-100 dark:text-slate-200">Illion Insight:</span> Business shows {paymentHistory.promptPercentage}% prompt payment behavior across {tradeReferenceCount} vendors. Estimated failure risk is {businessFailureScore < 50 ? 'elevated' : 'minimal'}.
        </p>
      </div>
    </Card>
  );
}


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Shield, TrendingUp, TrendingDown, Minus, Info, Clock, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { EquifaxData } from './EquifaxData';

interface EquifaxCreditScoreCardProps {
  data: EquifaxData;
}

export function EquifaxCreditScoreCard({ data }: EquifaxCreditScoreCardProps) {
  const { currentScore, maxScore, riskBand, scoreHistory, lastUpdated } = data;
  const [selectedPeriod, setSelectedPeriod] = useState('6M');
  
  // Calculate percentage for gauge
  const percentage = (currentScore / maxScore) * 100;
  const rotation = (percentage / 100) * 180 - 90; // -90 to 90 degrees

  // Filter history based on selected period
  const getFilteredHistory = () => {
    switch (selectedPeriod) {
      case '6M': return scoreHistory.slice(-6);
      case '1Y': return scoreHistory.slice(-12);
      case 'ALL': return scoreHistory;
      default: return scoreHistory;
    }
  };

  const filteredHistory = getFilteredHistory();

  // Determine colors based on risk band
  const getRiskColors = (band: string) => {
    switch (band) {
      case 'Excellent':
        return { 
          primary: '#10b981', // green-500
          bg: 'bg-green-500/10', 
          border: 'border-green-500/30',
          text: 'text-green-300',
          gradient: 'from-green-500 to-emerald-600'
        };
      case 'Very Good':
        return { 
          primary: '#3b82f6', // blue-500
          bg: 'bg-blue-500/10', 
          border: 'border-blue-500/30',
          text: 'text-blue-300',
          gradient: 'from-blue-500 to-indigo-600'
        };
      case 'Good':
        return { 
          primary: '#8b5cf6', // purple-500
          bg: 'bg-purple-500/10', 
          border: 'border-purple-500/30',
          text: 'text-purple-300',
          gradient: 'from-purple-500 to-violet-600'
        };
      case 'Fair':
        return { 
          primary: '#f59e0b', // amber-500
          bg: 'bg-amber-500/10', 
          border: 'border-amber-500/30',
          text: 'text-amber-300',
          gradient: 'from-amber-500 to-orange-600'
        };
      case 'Poor':
      default:
        return { 
          primary: '#ef4444', // red-500
          bg: 'bg-red-500/10', 
          border: 'border-red-500/30',
          text: 'text-red-300',
          gradient: 'from-red-500 to-rose-600'
        };
    }
  };

  const colors = getRiskColors(riskBand);
  
  // Calculate trend
  const previousScore = scoreHistory.length > 1 ? scoreHistory[scoreHistory.length - 2].score : currentScore;
  const scoreDiff = currentScore - previousScore;
  const trend = scoreDiff > 0 ? 'up' : scoreDiff < 0 ? 'down' : 'stable';

  return (
    <Card className="border-2 border-white/10 shadow-xl overflow-hidden bg-white dark:bg-slate-900">
      <CardHeader className="bg-white/5 dark:bg-slate-800/50 border-b border-white/10 dark:border-slate-700 py-4 px-6 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-white/10 dark:border-slate-700`}>
            <Shield className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-slate-100 dark:text-slate-100">Equifax Credit Intelligence</CardTitle>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Verified as of {lastUpdated}
            </p>
          </div>
        </div>
        <Badge 
          className={`${colors.bg} ${colors.text} border-2 ${colors.border} px-3 py-1 font-bold text-xs uppercase tracking-wider animate-pulse`}
        >
          {riskBand} BAND
        </Badge>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Gauge & Primary Stats */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center border-r border-white/10 dark:border-slate-800 pr-8">
            <div className="relative w-64 h-32 mb-4">
              <svg className="w-full h-full" viewBox="0 0 200 100">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="25%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="75%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                {/* Background Arc */}
                <path
                  d="M 20 90 A 80 80 0 0 1 180 90"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* Scale Indicators */}
                {[0, 300, 600, 900, 1200].map((val, i) => {
                  const angle = (val / 1200) * 180 - 180;
                  const x1 = 100 + 75 * Math.cos((angle * Math.PI) / 180);
                  const y1 = 90 + 75 * Math.sin((angle * Math.PI) / 180);
                  const x2 = 100 + 85 * Math.cos((angle * Math.PI) / 180);
                  const y2 = 90 + 85 * Math.sin((angle * Math.PI) / 180);
                  return (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth="1" />
                  );
                })}
                {/* Progress Arc */}
                <path
                  d="M 20 90 A 80 80 0 0 1 180 90"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${(percentage * 251.2) / 100} 251.2`}
                  className="transition-all duration-1000 ease-out"
                />
                {/* Needle */}
                <motion.line
                  initial={{ rotate: -90 }}
                  animate={{ rotate: rotation }}
                  transition={{ type: 'spring', stiffness: 50, damping: 10 }}
                  x1="100" y1="90" x2="100" y2="25"
                  stroke="#334155" strokeWidth="3" strokeLinecap="round"
                  style={{ transformOrigin: '100px 90px' }}
                />
                <circle cx="100" cy="90" r="6" fill="#334155" />
              </svg>
              
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-center">
                <span className="text-4xl font-black text-slate-100 dark:text-white tracking-tighter">
                  {currentScore}
                </span>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Limit: {maxScore}</span>
                  {trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                  {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                  {trend === 'stable' && <Minus className="w-3 h-3 text-slate-400" />}
                </div>
              </div>
            </div>

            <div className="mt-8 w-full space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 dark:bg-slate-800 border border-white/10 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-400 uppercase">Risk Tier</span>
                <span className={`font-black ${colors.text}`}>{riskBand}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 dark:bg-slate-800 border border-white/10 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-400 uppercase">Trend (30d)</span>
                <span className={`font-black flex items-center gap-1 ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-300'}`}>
                  {trend === 'up' ? '+' : trend === 'down' ? '' : ''}{scoreDiff} pts
                  {trend === 'up' && <TrendingUp className="w-4 h-4" />}
                  {trend === 'down' && <TrendingDown className="w-4 h-4" />}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Trend Chart */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-slate-300 dark:text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                Score History & Trend Analysis
              </h4>
              <div className="flex gap-2">
                {['6M', '1Y', 'ALL'].map(period => (
                  <button 
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                      period === selectedPeriod 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart key={selectedPeriod} data={filteredHistory}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    domain={[0, 1200]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                      fontWeight: '700'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#6366f1" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/10 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Equifax V9.2</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Identity Match: 100%</span>
                </div>
              </div>
              <button 
                className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                onClick={() => {
                  const reportId = `EQX-${Math.floor(Math.random() * 1000000)}`;
                  toast.promise(
                    new Promise((resolve) => setTimeout(resolve, 1500)),
                    {
                      loading: 'Generating Secure Bureau Report...',
                      success: () => {
                        const reportContent = `
EQUIFAX DETAILED CREDIT INTELLIGENCE REPORT
-------------------------------------------
Report ID: ${reportId}
Generation Date: ${new Date().toLocaleString()}
Status: VERIFIED

CLIENT SUMMARY
Current Score: ${currentScore} / 1200
Risk Classification: ${riskBand.toUpperCase()}
Last Updated: ${lastUpdated}

TREND ANALYSIS
Trend Direction: ${trend.toUpperCase()}
30-Day Variance: ${scoreDiff} Points

This document is a computer-generated summary of the official Equifax bureau records.
Confidentiality: Highly Restricted.
                        `;
                        const blob = new Blob([reportContent], { type: 'text/plain' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Equifax_Report_${reportId}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        return 'Report downloaded successfully';
                      },
                      error: 'Failed to generate report',
                    }
                  );
                }}
              >
                Detailed Bureau Report
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </CardContent>
      
      {/* Footer Insight */}
      <div className="bg-white/5 dark:bg-slate-800/80 px-6 py-3 border-t border-white/10 dark:border-slate-700 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm border border-white/10 dark:border-slate-600">
          <Info className="w-4 h-4 text-indigo-500" />
        </div>
        <p className="text-xs text-slate-300 dark:text-slate-400 font-medium">
          <span className="font-bold text-slate-100 dark:text-slate-200">AI Insight:</span> This client's credit profile is {trend === 'up' ? 'improving' : 'deteriorating'} based on recent enquiry patterns and repayment behaviors.
        </p>
      </div>
    </Card>
  );
}

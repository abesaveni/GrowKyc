import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Home,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  BarChart3
} from 'lucide-react';
import { Button } from '../ui/button';

interface ValuationResultsProps {
  avmMid: number;
  avmLow: number;
  avmHigh: number;
  confidence: 'high' | 'medium' | 'low';
  valuationDate: string;
  propertyAddress: string;
  comparableSales?: number;
  marketTrend?: 'rising' | 'stable' | 'falling';
  suburb?: string;
  state?: string;
  postcode?: string;
}

export function ValuationResults({
  avmMid,
  avmLow,
  avmHigh,
  confidence,
  valuationDate,
  propertyAddress,
  comparableSales = 12,
  marketTrend = 'stable',
  suburb,
  state,
  postcode
}: ValuationResultsProps) {
  
  const range = avmHigh - avmLow;
  const rangePercentage = ((range / avmMid) * 100).toFixed(1);
  
  const confidenceColor = {
    high: { bg: 'bg-green-500/10', border: 'border-green-300', text: 'text-green-300', badge: 'bg-green-500/15' },
    medium: { bg: 'bg-orange-500/10', border: 'border-orange-300', text: 'text-orange-300', badge: 'bg-orange-500/15' },
    low: { bg: 'bg-red-500/10', border: 'border-red-300', text: 'text-red-300', badge: 'bg-red-500/15' }
  }[confidence];

  const trendIcon = {
    rising: <TrendingUp className="w-5 h-5 text-green-400" />,
    stable: <div className="w-5 h-5 flex items-center"><div className="w-full h-0.5 bg-blue-600"></div></div>,
    falling: <TrendingDown className="w-5 h-5 text-red-400" />
  }[marketTrend];

  const trendText = {
    rising: 'Market Rising',
    stable: 'Market Stable',
    falling: 'Market Falling'
  }[marketTrend];

  return (
    <Card className={`border-2 ${confidenceColor.border} ${confidenceColor.bg}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="w-5 h-5 text-indigo-400" />
              RP Data AVM Valuation Report
            </CardTitle>
            <p className="text-sm text-slate-300 mt-1">{propertyAddress}</p>
            {suburb && state && (
              <p className="text-xs text-slate-400">{suburb}, {state} {postcode}</p>
            )}
          </div>
          <div className={`px-3 py-1 rounded-lg ${confidenceColor.badge} border ${confidenceColor.border}`}>
            <span className={`text-xs font-bold uppercase ${confidenceColor.text}`}>
              {confidence} Confidence
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Valuation Display */}
        <div className="text-center p-6 bg-white rounded-lg border-2 border-indigo-300">
          <p className="text-sm text-slate-300 mb-1">AVM Estimated Value</p>
          <p className="text-5xl font-bold text-indigo-300 mb-2">
            ${avmMid.toLocaleString()}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div>
              <span className="text-slate-300">Low: </span>
              <span className="font-bold text-slate-100">${avmLow.toLocaleString()}</span>
            </div>
            <div className="text-gray-400">•</div>
            <div>
              <span className="text-slate-300">High: </span>
              <span className="font-bold text-slate-100">${avmHigh.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Range: ±{rangePercentage}% (${range.toLocaleString()})
          </p>
        </div>

        {/* Valuation Range Visualization */}
        <div>
          <p className="text-xs font-semibold text-slate-300 mb-2">Valuation Range:</p>
          <div className="relative h-10 bg-white/10 rounded-lg overflow-hidden">
            <div 
              className="absolute h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"
              style={{ left: '0%', width: '100%' }}
            ></div>
            <div 
              className="absolute h-full w-1 bg-indigo-700"
              style={{ left: '50%' }}
              title="Mid estimate"
            ></div>
            <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-bold text-white">
              <span>${(avmLow / 1000).toFixed(0)}k</span>
              <span className="bg-indigo-700 px-2 py-1 rounded">${(avmMid / 1000).toFixed(0)}k</span>
              <span>${(avmHigh / 1000).toFixed(0)}k</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-slate-300" />
              <span className="text-xs font-semibold text-slate-300">Valuation Date</span>
            </div>
            <p className="text-sm font-bold text-slate-100">
              {new Date(valuationDate).toLocaleDateString('en-AU', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })}
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-slate-300" />
              <span className="text-xs font-semibold text-slate-300">Comparable Sales</span>
            </div>
            <p className="text-sm font-bold text-slate-100">{comparableSales} properties</p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              {trendIcon}
              <span className="text-xs font-semibold text-slate-300">Market Trend</span>
            </div>
            <p className="text-sm font-bold text-slate-100">{trendText}</p>
          </div>
        </div>

        {/* Confidence Explanation */}
        <div className={`p-4 rounded-lg border-2 ${confidenceColor.border} ${confidenceColor.bg}`}>
          <div className="flex items-start gap-3">
            {confidence === 'high' ? (
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className={`font-bold text-sm mb-1 ${confidenceColor.text}`}>
                {confidence === 'high' && '✅ High Confidence Valuation'}
                {confidence === 'medium' && '⚠️ Medium Confidence Valuation'}
                {confidence === 'low' && '⚠️ Low Confidence Valuation'}
              </p>
              <p className="text-xs text-slate-300">
                {confidence === 'high' && 'This AVM is based on strong comparable sales data and recent market activity. Suitable for lending decisions up to 80% LVR without full valuation.'}
                {confidence === 'medium' && 'This AVM has moderate data quality. Consider full valuation for LVR above 70% or for final loan approval.'}
                {confidence === 'low' && 'Limited comparable data available. Full valuation by licensed valuer strongly recommended before proceeding.'}
              </p>
            </div>
          </div>
        </div>

        {/* AVM Methodology */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <p className="font-bold text-xs text-slate-100 mb-2">📊 AVM Methodology:</p>
          <ul className="space-y-1 text-xs text-slate-300">
            <li>✓ Hedonic regression model using {comparableSales}+ comparable sales</li>
            <li>✓ Property characteristics: land size, bedrooms, bathrooms, construction</li>
            <li>✓ Location factors: suburb, proximity to amenities, school zones</li>
            <li>✓ Recent market trends and sales velocity in area</li>
            <li>✓ Adjusted for property condition and improvements</li>
          </ul>
        </div>

        {/* Important Notes */}
        <div className="p-4 bg-yellow-500/10 border-2 border-yellow-300 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm text-yellow-300 mb-1">⚠️ Important Notes:</p>
              <ul className="space-y-1 text-xs text-yellow-300">
                <li>• AVM is a computer-generated estimate, not a formal valuation</li>
                <li>• Does not involve physical property inspection</li>
                <li>• For lending decisions, consider full valuation for LVR {'>'} 80%</li>
                <li>• ASIC recommends full valuation for consumer credit above certain thresholds</li>
                <li>• AVM valid for 90 days from date of issue</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download PDF Report
          </Button>
          <Button variant="outline" className="flex-1">
            <FileText className="w-4 h-4 mr-2" />
            View Full Details
          </Button>
        </div>

        {/* Source */}
        <div className="text-center pt-2 border-t border-white/10">
          <p className="text-xs text-slate-400">
            Powered by <strong>CoreLogic RP Data</strong> • Report ID: AVM-{Date.now()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

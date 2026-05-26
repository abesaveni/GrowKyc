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
    high: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-900', badge: 'bg-green-100' },
    medium: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-900', badge: 'bg-orange-100' },
    low: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-900', badge: 'bg-red-100' }
  }[confidence];

  const trendIcon = {
    rising: <TrendingUp className="w-5 h-5 text-green-600" />,
    stable: <div className="w-5 h-5 flex items-center"><div className="w-full h-0.5 bg-blue-600"></div></div>,
    falling: <TrendingDown className="w-5 h-5 text-red-600" />
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
              <Home className="w-5 h-5 text-indigo-600" />
              RP Data AVM Valuation Report
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{propertyAddress}</p>
            {suburb && state && (
              <p className="text-xs text-gray-500">{suburb}, {state} {postcode}</p>
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
          <p className="text-sm text-gray-600 mb-1">AVM Estimated Value</p>
          <p className="text-5xl font-bold text-indigo-700 mb-2">
            ${avmMid.toLocaleString()}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div>
              <span className="text-gray-600">Low: </span>
              <span className="font-bold text-gray-900">${avmLow.toLocaleString()}</span>
            </div>
            <div className="text-gray-400">•</div>
            <div>
              <span className="text-gray-600">High: </span>
              <span className="font-bold text-gray-900">${avmHigh.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Range: ±{rangePercentage}% (${range.toLocaleString()})
          </p>
        </div>

        {/* Valuation Range Visualization */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2">Valuation Range:</p>
          <div className="relative h-10 bg-gray-200 rounded-lg overflow-hidden">
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
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-semibold text-gray-700">Valuation Date</span>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {new Date(valuationDate).toLocaleDateString('en-AU', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })}
            </p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-semibold text-gray-700">Comparable Sales</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{comparableSales} properties</p>
          </div>

          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              {trendIcon}
              <span className="text-xs font-semibold text-gray-700">Market Trend</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{trendText}</p>
          </div>
        </div>

        {/* Confidence Explanation */}
        <div className={`p-4 rounded-lg border-2 ${confidenceColor.border} ${confidenceColor.bg}`}>
          <div className="flex items-start gap-3">
            {confidence === 'high' ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className={`font-bold text-sm mb-1 ${confidenceColor.text}`}>
                {confidence === 'high' && '✅ High Confidence Valuation'}
                {confidence === 'medium' && '⚠️ Medium Confidence Valuation'}
                {confidence === 'low' && '⚠️ Low Confidence Valuation'}
              </p>
              <p className="text-xs text-gray-700">
                {confidence === 'high' && 'This AVM is based on strong comparable sales data and recent market activity. Suitable for lending decisions up to 80% LVR without full valuation.'}
                {confidence === 'medium' && 'This AVM has moderate data quality. Consider full valuation for LVR above 70% or for final loan approval.'}
                {confidence === 'low' && 'Limited comparable data available. Full valuation by licensed valuer strongly recommended before proceeding.'}
              </p>
            </div>
          </div>
        </div>

        {/* AVM Methodology */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="font-bold text-xs text-gray-900 mb-2">📊 AVM Methodology:</p>
          <ul className="space-y-1 text-xs text-gray-700">
            <li>✓ Hedonic regression model using {comparableSales}+ comparable sales</li>
            <li>✓ Property characteristics: land size, bedrooms, bathrooms, construction</li>
            <li>✓ Location factors: suburb, proximity to amenities, school zones</li>
            <li>✓ Recent market trends and sales velocity in area</li>
            <li>✓ Adjusted for property condition and improvements</li>
          </ul>
        </div>

        {/* Important Notes */}
        <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm text-yellow-900 mb-1">⚠️ Important Notes:</p>
              <ul className="space-y-1 text-xs text-yellow-800">
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
        <div className="text-center pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Powered by <strong>CoreLogic RP Data</strong> • Report ID: AVM-{Date.now()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

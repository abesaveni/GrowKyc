import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { 
  DollarSign, 
  Zap, 
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Home,
  Shield,
  FileSearch,
  Loader2
} from 'lucide-react';

interface AVMCostDisplayProps {
  onRunChecks: () => void;
  checksRunning: boolean;
  checksComplete: boolean;
  estimatedCost: number;
}

export function AVMCostDisplay({ 
  onRunChecks, 
  checksRunning, 
  checksComplete,
  estimatedCost 
}: AVMCostDisplayProps) {
  
  const checkItems = [
    { name: 'RP Data AVM Valuation', cost: 45.00, icon: Home },
    { name: 'InfoTrack Title Search', cost: 28.50, icon: FileSearch },
    { name: 'InfoTrack Ownership Verification', cost: 22.00, icon: Shield },
    { name: 'InfoTrack Encumbrances Check', cost: 25.00, icon: FileSearch },
    { name: 'InfoTrack Zoning Certificate', cost: 35.00, icon: FileSearch },
    { name: 'GreenID Identity Verification', cost: 12.50, icon: Shield },
    { name: 'AUSTRAC Sanctions Screening', cost: 8.00, icon: Shield },
    { name: 'PEP & RCA Screening', cost: 10.00, icon: Shield }
  ];

  const totalCost = checkItems.reduce((sum, item) => sum + item.cost, 0);

  return (
    <Card className="border-2 border-blue-500 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Automated Verification Package
            </CardTitle>
            <p className="text-sm text-blue-100 mt-1">
              Complete property valuation, InfoTrack checks & KYC screening
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Total Cost</div>
            <div className="text-3xl font-bold">${totalCost.toFixed(2)}</div>
            <div className="text-xs text-blue-100">inc. GST</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Cost Breakdown */}
        <div>
          <h4 className="font-bold text-slate-100 mb-3">Package Includes:</h4>
          <div className="space-y-2">
            {checkItems.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-100">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-100">${item.cost.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Display */}
        {checksRunning && (
          <div className="p-5 bg-blue-500/10 border-2 border-blue-300 rounded-lg animate-pulse">
            <div className="flex items-start gap-3">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-blue-300 mb-2">🔄 Running Automated Checks...</p>
                <div className="space-y-1 text-xs text-blue-300">
                  <p>⚡ Connecting to RP Data API for AVM valuation...</p>
                  <p>⚡ Running InfoTrack property searches...</p>
                  <p>⚡ Executing GreenID identity verification...</p>
                  <p>⚡ Screening against AUSTRAC sanctions lists...</p>
                  <p>⚡ Checking PEP and RCA databases...</p>
                </div>
                <div className="mt-3 w-full bg-blue-500/20 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {checksComplete && (
          <div className="p-5 bg-green-500/10 border-2 border-green-300 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-green-300 mb-2">✅ All Checks Complete!</p>
                <p className="text-sm text-green-300">
                  Property valuation, title searches, KYC verification, and compliance screening successfully completed.
                  All results have been attached to this case.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-green-300">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">Total charged: ${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!checksRunning && !checksComplete && (
          <>
            {/* Benefits */}
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-500/30 rounded-lg">
              <p className="font-bold text-indigo-300 text-sm mb-2">⚡ Instant Automated Processing:</p>
              <ul className="space-y-1 text-xs text-indigo-300">
                <li>✓ Complete property AVM valuation from RP Data</li>
                <li>✓ Full title search and ownership verification</li>
                <li>✓ Encumbrances, caveats & zoning checks</li>
                <li>✓ Electronic identity verification (GreenID)</li>
                <li>✓ AUSTRAC sanctions & PEP screening</li>
                <li>✓ All results available in 30-60 seconds</li>
                <li>✓ Automatically attached to Credit Pack</li>
              </ul>
            </div>

            {/* Action Button */}
            <Button
              onClick={onRunChecks}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-bold"
              size="lg"
            >
              <Zap className="w-6 h-6 mr-2" />
              Run All Checks Now - ${totalCost.toFixed(2)}
            </Button>

            <p className="text-xs text-slate-400 text-center">
              By proceeding, you authorize Grow to charge ${totalCost.toFixed(2)} (inc. GST) to your account for automated verification services.
            </p>
          </>
        )}

        {/* Pricing Note */}
        <div className="p-3 bg-white/5 border border-white/10 rounded text-xs text-slate-300">
          <p className="font-semibold mb-1">💰 Transparent Pricing:</p>
          <p>All costs are billed at actual provider rates with no markup. RP Data AVM is ${45.00}, InfoTrack searches ${110.50}, and KYC checks ${30.50}.</p>
        </div>
      </CardContent>
    </Card>
  );
}

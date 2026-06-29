import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DollarSign, Shield, Lock, MapPin } from 'lucide-react';

interface AMLPricingAccessCardProps {
  onNavigate: () => void;
  variant?: 'button' | 'card' | 'compact';
}

export function AMLPricingAccessCard({ onNavigate, variant = 'card' }: AMLPricingAccessCardProps) {
  // Button variant - simple button
  if (variant === 'button') {
    return (
      <Button 
        onClick={onNavigate}
        className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
      >
        <DollarSign className="w-5 h-5" />
        AML/CTF Pricing
      </Button>
    );
  }

  // Compact variant - small card
  if (variant === 'compact') {
    return (
      <button
        onClick={onNavigate}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg p-4 text-white text-left transition-all shadow-lg hover:shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg mb-1">AML/CTF Pricing</h3>
            <p className="text-sm text-purple-100">View check pricing & mandatory payments</p>
          </div>
          <DollarSign className="w-8 h-8 text-white/80" />
        </div>
      </button>
    );
  }

  // Full card variant - detailed card
  return (
    <Card className="border-2 border-purple-300 hover:border-purple-500 transition-all cursor-pointer" onClick={onNavigate}>
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <DollarSign className="w-6 h-6" />
          AML/CTF Enhanced Checks & Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-gray-700 mb-4">
          View comprehensive pricing for identity verification, director searches, entity checks, and title searches.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <Lock className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-900">Mandatory: $27.50/person</p>
              <p className="text-xs text-red-700">IDV + Director/Officer Search</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <Shield className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900">Entity Checks: Per company/trust</p>
              <p className="text-xs text-amber-700">Finalized after entity identification</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-blue-900">Title Searches: Per property</p>
              <p className="text-xs text-blue-700">Current, historical & dealing searches</p>
            </div>
          </div>
        </div>

        <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
          View Full Pricing Details
        </Button>
      </CardContent>
    </Card>
  );
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { DollarSign, Shield, Lock } from 'lucide-react';

export function AMLCTFEnhancedChecksPricingSimple() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-4 rounded-full">
            <Shield className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">AML/CTF Enhanced Checks & Pricing</h1>
            <p className="text-xl text-purple-100">
              Identity Verification, Director Searches, Entity Checks & Title Searches
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-2 border-red-300 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-red-900">Mandatory</h3>
            </div>
            <p className="text-4xl font-bold text-red-600">$27.50</p>
            <p className="text-sm text-red-700 mt-1">Per person</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-300 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-amber-600" />
              <h3 className="font-bold text-amber-900">Entity Checks</h3>
            </div>
            <p className="text-4xl font-bold text-amber-600">$5-75</p>
            <p className="text-sm text-amber-700 mt-1">Per entity</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-300 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-blue-900">Title Searches</h3>
            </div>
            <p className="text-4xl font-bold text-blue-600">$35-250</p>
            <p className="text-sm text-blue-700 mt-1">Per property</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-300 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-green-900">Total</h3>
            </div>
            <p className="text-4xl font-bold text-green-600">Variable</p>
            <p className="text-sm text-green-700 mt-1">Based on needs</p>
          </CardContent>
        </Card>
      </div>

      {/* Mandatory Checks */}
      <Card className="border-2 border-red-300">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-red-900">Mandatory Checks (Must Pay)</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="border-2 border-red-300 bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-900 mb-2">Individual Identity Verification - $12.50</h3>
            <p className="text-gray-700 mb-2">
              Enhanced AML/CTF individual verification via GreenID/InfoTrack - DVS certified
            </p>
            <p className="text-sm text-red-800">
              <strong>Applied to:</strong> EVERY individual (clients, beneficial owners, directors, officers)
            </p>
          </div>

          <div className="border-2 border-red-300 bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-900 mb-2">Director/Officer Search - $15.00</h3>
            <p className="text-gray-700 mb-2">
              ASIC director and officer history check including disqualifications
            </p>
            <p className="text-sm text-red-800">
              <strong>Applied to:</strong> ALL directors and officers of companies and trusts
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Entity Checks */}
      <Card className="border-2 border-amber-300">
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-amber-900">Entity Checks (Per Company/Trust - Finalized Later)</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="border border-amber-200 bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-900">ASIC Company Search - $45.00</h4>
            <p className="text-sm text-gray-600">Current company extract including directors, shareholders</p>
          </div>
          <div className="border border-amber-200 bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-900">ASIC Historical Search - $65.00</h4>
            <p className="text-sm text-gray-600">Historical extract with former directors</p>
          </div>
          <div className="border border-amber-200 bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-900">Trust Document Search - $75.00</h4>
            <p className="text-sm text-gray-600">Trust deed verification and trustee identification</p>
          </div>
          <div className="border border-amber-200 bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-900">PPSR Security Interest Search - $35.00</h4>
            <p className="text-sm text-gray-600">Personal Property Securities Register search</p>
          </div>
        </CardContent>
      </Card>

      {/* Title Searches */}
      <Card className="border-2 border-blue-300">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-900">Title Searches (Per Property)</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="border border-blue-200 bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-900">Current Title Search - $45.00</h4>
            <p className="text-sm text-gray-600">Current registered proprietor and encumbrances</p>
          </div>
          <div className="border border-blue-200 bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-900">Historical Title Search - $75.00</h4>
            <p className="text-sm text-gray-600">20-year historical search including previous owners</p>
          </div>
          <div className="border border-blue-200 bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-900">Dealing Search - $35.00</h4>
            <p className="text-sm text-gray-600">Search for recent or pending dealings on title</p>
          </div>
          <div className="border border-blue-200 bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-900">Property Valuation Report - $250.00</h4>
            <p className="text-sm text-gray-600">Professional property valuation for security</p>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-2 border-green-300 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-900">Pricing Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-red-100 rounded-lg border border-red-300">
              <span className="font-bold text-red-900">Mandatory Checks (Per Person)</span>
              <span className="text-2xl font-bold text-red-600">$27.50</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-amber-100 rounded-lg border border-amber-300">
              <span className="font-bold text-amber-900">Entity Checks (Variable)</span>
              <span className="text-2xl font-bold text-amber-600">TBD</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-100 rounded-lg border border-blue-300">
              <span className="font-bold text-blue-900">Title Searches (Variable)</span>
              <span className="text-2xl font-bold text-blue-600">TBD</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CountdownTimer } from '../ui/countdown-timer';
import { toast } from '../../lib/toast';
import { 
  TrendingUp, 
  Briefcase, 
  Gavel, 
  Clock,
  DollarSign,
  Home,
  CheckCircle,
  Eye,
  Activity,
  Target,
  Award,
  FileText,
  Plus,
  AlertCircle
} from 'lucide-react';
import { mockCases } from '../../data/mockData';
import { StatusBadge } from '../StatusBadge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { format } from 'date-fns';

interface LenderDashboardProps {
  onNavigate?: (page: string) => void;
}

export function LenderDashboard({ onNavigate }: LenderDashboardProps) {
  const availableDeals = mockCases.filter(c => c.status === 'active' || c.status === 'in_auction');
  const myBids = mockCases.filter(c => c.currentBid && c.currentBid > 0).slice(0, 2);
  
  // Lender's own cases (loans they're placing under MIP)
  const myCases = mockCases.slice(0, 2); // Mock data - in reality these would be lender's submitted loans

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Lender!</h1>
              <p className="text-blue-100 text-lg mb-3">
                {myCases.length} MIP case{myCases.length !== 1 ? 's' : ''} under management • {availableDeals.length} deal{availableDeals.length !== 1 ? 's' : ''} available to bid • {myBids.length} active bid{myBids.length !== 1 ? 's' : ''}
              </p>
              <p className="text-blue-200 text-sm">
                Manage your MIP cases and discover new lending opportunities
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => onNavigate?.('case')}
              >
                <Plus className="w-5 h-5 mr-2" />
                New MIP Case
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => onNavigate?.('deals')}
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Browse Deals
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Available Deals</p>
            <p className="text-4xl font-bold text-gray-900">{availableDeals.length}</p>
            <p className="text-xs text-green-600 font-medium mt-2">↑ 3 new this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Gavel className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Bids</p>
            <p className="text-4xl font-bold text-gray-900">{myBids.length}</p>
            <p className="text-xs text-blue-600 font-medium mt-2">2 ending soon</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">My MIP Cases</p>
            <p className="text-4xl font-bold text-gray-900">{myCases.length}</p>
            <p className="text-xs text-purple-600 font-medium mt-2">Under management</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-amber-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Deployed</p>
            <p className="text-4xl font-bold text-gray-900">$3.2M</p>
            <p className="text-xs text-amber-600 font-medium mt-2">Across 5 deals</p>
          </CardContent>
        </Card>
      </div>

      {/* My MIP Cases - Loans lender has placed on platform */}
      <Card className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200">
        <CardHeader className="border-b bg-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                My MIP Cases
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">Loans you've placed on the platform for mortgage insurance protection</p>
            </div>
            <Button 
              onClick={() => onNavigate?.('case')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit New Case
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {myCases.map((loanCase, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-purple-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">{loanCase.property.address}</h4>
                      <StatusBadge status={loanCase.status} type="case" />
                    </div>
                    <p className="text-sm text-gray-600">{loanCase.property.suburb}, {loanCase.property.state} • Case #{loanCase.caseNumber}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onNavigate?.('cases')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Manage Case
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Outstanding Debt</p>
                    <p className="font-bold text-gray-900">${(loanCase.outstandingDebt / 1000).toFixed(0)}k</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Property Value</p>
                    <p className="font-bold text-gray-900">${(loanCase.valuation.amount / 1000).toFixed(0)}k</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">LVR</p>
                    <p className="font-bold text-green-600">{((loanCase.outstandingDebt / loanCase.valuation.amount) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Submitted</p>
                    <p className="font-bold text-gray-900">{format(loanCase.createdAt, 'dd MMM yyyy')}</p>
                  </div>
                </div>

                {/* Case-specific next actions */}
                {index === 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="text-gray-700">Action required: <span className="font-semibold text-amber-600">Upload updated property valuation</span></span>
                      <Button size="sm" variant="link" onClick={() => onNavigate?.('documents')}>Upload</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Auctions */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-600" />
                Live Auctions
              </CardTitle>
              <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-semibold">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                2 LIVE
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {availableDeals.slice(0, 2).map((deal, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{deal.property.address}</h4>
                      <p className="text-sm text-gray-600">{deal.property.suburb}, {deal.property.state}</p>
                    </div>
                    <StatusBadge status={deal.status} type="case" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Outstanding Debt</p>
                      <p className="font-bold text-gray-900">${(deal.outstandingDebt / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Current Bid</p>
                      <p className="font-bold text-green-600">${((deal.currentBid || 0) / 1000).toFixed(0)}k</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                      <Clock className="w-4 h-4" />
                      <CountdownTimer end={new Date(Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000)} />
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => onNavigate?.('auction_room')}
                    >
                      <Gavel className="w-4 h-4 mr-1" />
                      Place Bid
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Active Bids */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              My Active Bids
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {myBids.map((deal, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{deal.property.address}</h4>
                      <p className="text-sm text-gray-600">{deal.property.suburb}, {deal.property.state}</p>
                    </div>
                    <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                      LEADING
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-600">My Bid</p>
                      <p className="font-bold text-blue-600">${((deal.currentBid || 0) / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Property Value</p>
                      <p className="font-bold text-gray-900">${(deal.valuation.amount / 1000).toFixed(0)}k</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="text-sm text-gray-600">
                      Bid placed {format(new Date(Date.now() - 45 * 60 * 1000), 'HH:mm')}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onNavigate?.('auction_room')}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Opportunities */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Featured Opportunities
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onNavigate?.('deals')}
            >
              View All Deals
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableDeals.slice(0, 3).map((deal, index) => (
              <div key={index} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/photo-${index === 0 ? '1715247018235-82cb9d34ddbd' : index === 1 ? '1580387128798-a5abad264ac4' : '1766050589756-29eac959ff51'}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400`}
                    alt={deal.property.address}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={deal.status} type="case" />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 mb-1">{deal.property.address}</h4>
                  <p className="text-sm text-gray-600 mb-3">{deal.property.suburb}, {deal.property.state}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Outstanding Debt:</span>
                      <span className="font-semibold">${(deal.outstandingDebt / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Property Value:</span>
                      <span className="font-semibold">${(deal.valuation.amount / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">LVR:</span>
                      <span className="font-semibold text-green-600">
                        {((deal.outstandingDebt / deal.valuation.amount) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => onNavigate?.('deals')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-bold text-gray-900 text-lg mb-4">Your Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Win Rate</p>
              <p className="text-3xl font-bold text-gray-900">45%</p>
              <p className="text-xs text-gray-600 mt-1">3 of 7 bids won</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Deal Size</p>
              <p className="text-3xl font-bold text-gray-900">$1.1M</p>
              <p className="text-xs text-gray-600 mt-1">Last 3 months</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. LVR</p>
              <p className="text-3xl font-bold text-gray-900">68%</p>
              <p className="text-xs text-gray-600 mt-1">Portfolio average</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Expected ROI</p>
              <p className="text-3xl font-bold text-green-600">11.2%</p>
              <p className="text-xs text-gray-600 mt-1">Weighted average</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { CountdownTimer } from '../ui/countdown-timer';
import { toast } from '../../lib/toast';
import { TrendingUp, Calendar, Gavel, DollarSign, Clock, ArrowRight, Star, Award, Target, Zap, Eye, Heart, MapPin, Bed, Bath, Car, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockCases } from '../../data/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface InvestorDashboardProps {
  onNavigate?: (page: string, id?: string) => void;
}

export function InvestorDashboard({ onNavigate }: InvestorDashboardProps) {
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Property images
  const propertyImages = [
    'https://images.unsplash.com/photo-1715247018235-82cb9d34ddbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBBdXN0cmFsaWFuJTIwaG91c2UlMjBleHRlcmlvciUyMGR1c2t8ZW58MXx8fHwxNzcwOTcwODQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1580387128798-a5abad264ac4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBBdXN0cmFsaWFuJTIwcmVzaWRlbnRpYWwlMjBwcm9wZXJ0eSUyMHN1bnNldHxlbnwxfHx8fDE3NzA5NzA4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1766050589756-29eac959ff51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBBdXN0cmFsaWFuJTIwaG9tZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1710253655362-a0eaad4f4e55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yJTIwZGF5dGltZXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1659684382003-709720aaef16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWJ1cmJhbiUyMEF1c3RyYWxpYW4lMjBwcm9wZXJ0eXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1668911494256-becf9fea265b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMHJlYWwlMjBlc3RhdGUlMjBleHRlcmlvcnxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  ];

  const liveAuctions = mockCases.filter(c => c.status === 'in_auction');
  const featuredDeals = liveAuctions.slice(0, 3);

  const calculateLVR = (debt: number, valuation: number) => {
    return ((debt / valuation) * 100).toFixed(1);
  };

  const nextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % featuredDeals.length);
  };

  const prevFeatured = () => {
    setFeaturedIndex((prev) => (prev - 1 + featuredDeals.length) % featuredDeals.length);
  };

  const handleWatchlistAdd = (propertyAddress: string) => {
    toast.success('Added to watchlist', {
      description: propertyAddress
    });
  };

  const handleSetupAlerts = () => {
    toast.info('Alert preferences', {
      description: 'Configure your notification preferences in Settings'
    });
  };

  const handlePlaceBid = (propertyId: string) => {
    onNavigate?.('auction_room', propertyId);
  };

  return (
    <div className="space-y-6 -mt-6 -mx-6">
      {/* Hero Section - Full Bleed */}
      <div className="relative h-[500px] bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
          <div className="grid grid-cols-2 gap-12 w-full items-center">
            {/* Left: Welcome Message */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm mb-6">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>2 New Properties Live Now</span>
              </div>
              
              <h1 className="text-5xl font-bold text-white mb-4">
                Welcome Back,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                  Premium Investor
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8">
                Exclusive access to high-yield mortgage resolution opportunities
              </p>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-blue-200 text-sm mb-1">Active Portfolio</p>
                  <p className="text-3xl font-bold text-white">$4.2M</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-blue-200 text-sm mb-1">Avg. Return</p>
                  <p className="text-3xl font-bold text-green-300">14.2%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-blue-200 text-sm mb-1">Win Rate</p>
                  <p className="text-3xl font-bold text-yellow-300">68%</p>
                </div>
              </div>
            </div>

            {/* Right: Featured Property Carousel */}
            <div className="relative">
              {featuredDeals.length > 0 && (
                <div className="relative">
                  <Card className="overflow-hidden border-2 border-white/20 shadow-2xl">
                    <div className="relative h-[300px]">
                      <ImageWithFallback
                        src={propertyImages[featuredIndex]}
                        alt="Featured Property"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {/* Live Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold text-sm flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          LIVE AUCTION
                        </div>
                      </div>

                      {/* Property Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">
                          {featuredDeals[featuredIndex].property.address}
                        </h3>
                        <p className="text-sm text-white/90 mb-3">
                          {featuredDeals[featuredIndex].property.suburb}, {featuredDeals[featuredIndex].property.state}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white/70">Current Bid</p>
                            <p className="text-2xl font-bold text-green-300">
                              ${(featuredDeals[featuredIndex].currentBid! / 1000).toFixed(0)}k
                            </p>
                          </div>
                          <Button size="lg" className="bg-white text-indigo-300 hover:bg-blue-500/10" onClick={() => handlePlaceBid(featuredDeals[featuredIndex].id)}>
                            Place Bid
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Carousel Controls */}
                  {featuredDeals.length > 1 && (
                    <>
                      <button
                        onClick={prevFeatured}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6 text-slate-100" />
                      </button>
                      <button
                        onClick={nextFeatured}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-6 h-6 text-slate-100" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-6">
        {/* Performance KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-2 border-red-500/20 bg-gradient-to-br from-red-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-red-500/15 rounded-xl">
                  <Gavel className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex items-center gap-1 text-red-400 text-sm font-semibold">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  LIVE
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-100 mb-1">{liveAuctions.length}</p>
              <p className="text-sm text-slate-300">Deals Live Now</p>
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-red-500/15 rounded-full opacity-20"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-blue-500/20 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-blue-500/15 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-4xl font-bold text-slate-100 mb-1">7</p>
              <p className="text-sm text-slate-300">Upcoming Auctions</p>
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-blue-500/15 rounded-full opacity-20"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-green-500/20 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-green-500/15 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-4xl font-bold text-slate-100 mb-1">3</p>
              <p className="text-sm text-slate-300">My Active Bids</p>
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-green-500/15 rounded-full opacity-20"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-purple-500/20 bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-purple-500/15 rounded-xl">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                </div>
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-4xl font-bold text-slate-100 mb-1">$4.2M</p>
              <p className="text-sm text-slate-300">Capital Deployed</p>
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-purple-500/15 rounded-full opacity-20"></div>
            </CardContent>
          </Card>
        </div>

        {/* Live Auctions - Ending Soon */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                Ending Soon
              </h2>
              <p className="text-slate-300 mt-1">Act fast on these time-sensitive opportunities</p>
            </div>
            <Button variant="outline" onClick={() => onNavigate?.('auctions')}>
              View All Live Auctions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveAuctions.slice(0, 3).map((deal, index) => (
              <Card key={deal.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary cursor-pointer">
                {/* Property Image */}
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={propertyImages[index % propertyImages.length]}
                    alt={deal.property.address}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                  {/* Countdown Timer - Prominent */}
                  <div className="absolute top-4 left-4 right-4">
                    <div className="bg-red-600 text-white rounded-lg p-3 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          <span className="font-semibold text-sm">Ends in</span>
                        </div>
                        <span className="text-2xl font-bold">2h 45m</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors" onClick={() => handleWatchlistAdd(deal.property.address)}>
                      <Heart className="w-4 h-4 text-slate-300" />
                    </button>
                  </div>

                  {/* Property Features */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white text-sm">
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                      <Bed className="w-4 h-4" />
                      <span className="font-medium">{deal.property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                      <Bath className="w-4 h-4" />
                      <span className="font-medium">{deal.property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                      <Car className="w-4 h-4" />
                      <span className="font-medium">{deal.property.parking}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="p-5">
                  {/* Address */}
                  <h3 className="font-bold text-slate-100 text-lg mb-1 line-clamp-1">
                    {deal.property.address}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-300 mb-4">
                    <MapPin className="w-4 h-4" />
                    <p className="text-sm">{deal.property.suburb}, {deal.property.state}</p>
                  </div>

                  {/* Current Bid - Prominent */}
                  <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-4 mb-4">
                    <p className="text-sm text-slate-300 mb-1">Current Highest Bid</p>
                    <p className="text-3xl font-bold text-green-400">
                      ${(deal.currentBid! / 1000).toFixed(0)}k
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{deal.bidCount} bids placed</p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">LVR</p>
                      <p className="text-sm font-bold text-indigo-400">
                        {calculateLVR(deal.outstandingDebt, deal.valuation.amount)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Return</p>
                      <p className="text-sm font-bold text-green-400">14.2%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Risk</p>
                      <p className="text-sm font-bold text-slate-100">Low</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full" size="lg" onClick={() => handlePlaceBid(deal.id)}>
                    <Gavel className="w-4 h-4 mr-2" />
                    Place Bid Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-2">Ready to invest in your next opportunity?</h3>
                <p className="text-blue-100">Browse all available properties or set up alerts for new listings</p>
              </div>
              <div className="flex gap-3">
                <Button size="lg" variant="outline" className="bg-white text-indigo-400 hover:bg-blue-500/10 border-0" onClick={() => onNavigate?.('deals')}>
                  <Eye className="w-5 h-5 mr-2" />
                  Browse All Deals
                </Button>
                <Button size="lg" className="bg-white/20 text-white border-2 border-white/30 hover:bg-white/30" onClick={handleSetupAlerts}>
                  Set Up Alerts
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
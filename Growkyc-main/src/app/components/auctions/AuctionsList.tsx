import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Clock, 
  Calendar, 
  Gavel, 
  DollarSign, 
  TrendingUp,
  Bed,
  Bath,
  Car,
  Home,
  AlertTriangle,
  Eye,
  Heart,
  Users,
  Activity,
  FileText,
  Download,
  X
} from 'lucide-react';
import { mockCases } from '../../data/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { format } from 'date-fns';

export function AuctionsList({ onNavigate }: { onNavigate?: (page: string, id?: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('ending_soon');

  const propertyImages = [
    'https://images.unsplash.com/photo-1715247018235-82cb9d34ddbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBBdXN0cmFsaWFuJTIwaG91c2UlMjBleHRlcmlvciUyMGR1c2t8ZW58MXx8fHwxNzcwOTcwODQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1580387128798-a5abad264ac4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBBdXN0cmFsaWFuJTIwcmVzaWRlbnRpYWwlMjBwcm9wZXJ0eSUyMHN1bnNldHxlbnwxfHx8fDE3NzA5NzA4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1766050589756-29eac959ff51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBBdXN0cmFsaWFuJTIwaG9tZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1710253655362-a0eaad4f4e55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yJTIwZGF5dGltZXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1659684382003-709720aaef16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWJ1cmJhbiUyMEF1c3RyYWxpYW4lMjBwcm9wZXJ0eXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1668911494256-becf9fea265b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMHJlYWwlMjBlc3RhdGUlMjBleHRlcmlvcnxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  ];

  // Get auctions
  const liveAuctions = mockCases.filter(c => c.status === 'in_auction');
  const upcomingAuctions = mockCases.filter(c => c.status === 'active');
  const allAuctions = [...liveAuctions, ...upcomingAuctions];

  const filteredAuctions = allAuctions.filter(auction => {
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'live' && auction.status === 'in_auction') ||
      (statusFilter === 'upcoming' && auction.status === 'active');
    
    const searchMatch = searchQuery === '' ||
      auction.property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.property.suburb.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-white border-2 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300 mb-1">Live Now</p>
                <p className="text-4xl font-bold text-red-400">{liveAuctions.length}</p>
              </div>
              <div className="p-3 bg-red-500/15 rounded-xl">
                <Activity className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300 mb-1">Upcoming</p>
                <p className="text-4xl font-bold text-blue-400">{upcomingAuctions.length}</p>
              </div>
              <div className="p-3 bg-blue-500/15 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white border-2 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300 mb-1">Total Value</p>
                <p className="text-4xl font-bold text-green-400">$8.2M</p>
              </div>
              <div className="p-3 bg-green-500/15 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300 mb-1">Active Bidders</p>
                <p className="text-4xl font-bold text-purple-400">24</p>
              </div>
              <div className="p-3 bg-purple-500/15 rounded-xl">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by suburb, address or property type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="col-span-6 md:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary h-10"
              >
                <option value="all">All Auctions</option>
                <option value="live">Live Now</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>

            <div className="col-span-6 md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary h-10"
              >
                <option value="ending_soon">Ending Soon</option>
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>

            <div className="col-span-12 md:col-span-3">
              <Button variant="outline" className="w-full h-10">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-100">
            {filteredAuctions.length} {filteredAuctions.length === 1 ? 'Auction' : 'Auctions'}
          </h2>
        </div>

        {/* Auction Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction, index) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              image={propertyImages[index % propertyImages.length]}
              isLive={auction.status === 'in_auction'}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Auction Card Component
interface AuctionCardProps {
  auction: any;
  image: string;
  isLive: boolean;
  onNavigate?: (page: string, id?: string) => void;
}

function AuctionCard({ auction, image, isLive, onNavigate }: AuctionCardProps) {
  const [showIMModal, setShowIMModal] = useState(false);

  const calculateLVR = (debt: number, valuation: number) => {
    return ((debt / valuation) * 100).toFixed(1);
  };

  // Mock loan metrics
  const daysInDefault = isLive ? 89 : 45;
  const daysInArrears = isLive ? 127 : 92;
  const defaultRate = isLive ? 8.25 : 7.5;

  return (
    <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary">
      {/* Property Image */}
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={auction.property.address}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {isLive ? (
            <div className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              LIVE NOW
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-lg">
              <Calendar className="w-4 h-4 inline mr-1" />
              UPCOMING
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        {/* Countdown Timer (Live Only) */}
        {isLive && (
          <div className="absolute top-16 left-4 right-4">
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
        )}

        {/* Auction Date (Upcoming Only) */}
        {!isLive && auction.auctionEndTime && (
          <div className="absolute top-16 left-4 right-4">
            <div className="bg-blue-600 text-white rounded-lg p-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Auction Date</span>
                <span className="font-bold">{format(auction.auctionEndTime, 'dd MMM yyyy')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Property Features */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white text-sm">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
            <Bed className="w-4 h-4" />
            <span className="font-medium">{auction.property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
            <Bath className="w-4 h-4" />
            <span className="font-medium">{auction.property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
            <Car className="w-4 h-4" />
            <span className="font-medium">{auction.property.parking}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-5">
        {/* Address */}
        <div className="mb-4">
          <h3 className="font-bold text-slate-100 text-lg mb-1 line-clamp-1">
            {auction.property.address}
          </h3>
          <div className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm">
              {auction.property.suburb}, {auction.property.state}
            </p>
          </div>
        </div>

        {/* Loan Metrics Snapshot */}
        <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b">
          <div className="text-center p-2 bg-red-500/10 rounded-lg">
            <p className="text-xs text-slate-300 mb-1">Default</p>
            <p className="text-sm font-bold text-red-400">{daysInDefault}d</p>
          </div>
          <div className="text-center p-2 bg-amber-500/10 rounded-lg">
            <p className="text-xs text-slate-300 mb-1">Arrears</p>
            <p className="text-sm font-bold text-amber-400">{daysInArrears}d</p>
          </div>
          <div className="text-center p-2 bg-purple-500/10 rounded-lg">
            <p className="text-xs text-slate-300 mb-1">Rate</p>
            <p className="text-sm font-bold text-purple-400">{defaultRate}%</p>
          </div>
        </div>

        {/* Financial Details */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Outstanding Debt</span>
            <span className="text-lg font-bold text-slate-100">
              ${(auction.outstandingDebt / 1000).toFixed(0)}k
            </span>
          </div>

          {isLive && auction.currentBid && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Current Bid</span>
              <span className="text-lg font-bold text-green-400">
                ${(auction.currentBid / 1000).toFixed(0)}k
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Property Value</span>
            <span className="text-lg font-bold text-slate-100">
              ${(auction.valuation.amount / 1000).toFixed(0)}k
            </span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-sm text-slate-300">LVR</span>
            <span className="text-lg font-bold text-indigo-400">
              {calculateLVR(auction.outstandingDebt, auction.valuation.amount)}%
            </span>
          </div>
        </div>

        {/* Bidder Count (Live Only) */}
        {isLive && auction.bidCount && (
          <div className="flex items-center justify-between mb-4 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{auction.bidCount} bidders</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-medium">High Activity</span>
            </div>
          </div>
        )}

        {/* Investment Metrics */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-300 mb-1">Expected Return</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <p className="text-xl font-bold text-green-400">12.4%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-300 mb-1">Equity</p>
              <p className="text-lg font-bold text-slate-100">
                ${((auction.valuation.amount - auction.outstandingDebt) / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isLive ? (
            <>
              <Button className="flex-1" size="lg" onClick={() => onNavigate?.('auction_room', auction.id)}>
                <Gavel className="w-4 h-4 mr-2" />
                Place Bid
              </Button>
              <Button variant="outline" size="lg" onClick={() => onNavigate?.('auction_room', auction.id)}>
                <Eye className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="flex-1" size="lg" onClick={() => onNavigate?.('auction-details', auction.id)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button className="flex-1" size="lg" onClick={() => onNavigate?.('buy_now_room', auction.id)}>
                Buy Now
              </Button>
            </>
          )}
        </div>

        {/* Deal ID */}
        <p className="text-xs text-slate-400 text-center mt-3">
          Deal ID: {auction.caseNumber}
        </p>
      </CardContent>
    </Card>
  );
}
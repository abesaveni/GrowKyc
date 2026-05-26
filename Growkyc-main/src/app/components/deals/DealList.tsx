import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EmptyState } from '../ui/empty-state';
import { CountdownTimer } from '../ui/countdown-timer';
import { toast } from '../../lib/toast';
import { Search, SlidersHorizontal, MapPin, TrendingUp, Clock, Calendar, CheckCircle2, Gavel, DollarSign, Home, Eye, Heart, Share2, Bed, Bath, Car, ShoppingCart } from 'lucide-react';
import { mockCases } from '../../data/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function DealList({ onNavigate }: { onNavigate?: (page: string, id?: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const propertyImages = [
    'https://images.unsplash.com/photo-1715247018235-82cb9d34ddbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBBdXN0cmFsaWFuJTIwaG91c2UlMjBleHRlcmlvciUyMGR1c2t8ZW58MXx8fHwxNzcwOTcwODQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1580387128798-a5abad264ac4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBBdXN0cmFsaWFuJTIwcmVzaWRlbnRpYWwlMjBwcm9wZXJ0eSUyMHN1bnNldHxlbnwxfHx8fDE3NzA5NzA4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1766050589756-29eac959ff51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBBdXN0cmFsaWFuJTIwaG9tZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1710253655362-a0eaad4f4e55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yJTIwZGF5dGltZXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1659684382003-709720aaef16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWJ1cmJhbiUyMEF1c3RyYWxpYW4lMjBwcm9wZXJ0eXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1668911494256-becf9fea265b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMHJlYWwlMjBlc3RhdGUlMjBleHRlcmlvcnxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  ];

  // Calculate LVR
  const calculateLVR = (debt: number, valuation: number) => {
    return ((debt / valuation) * 100).toFixed(1);
  };

  // Get all properties
  const allProperties = mockCases;

  // Filter properties
  const filteredProperties = allProperties.filter(property => {
    const locationMatch = locationFilter === 'all' || property.property.state === locationFilter;
    const statusMatch = statusFilter === 'all' || property.status === statusFilter;
    const searchMatch = searchQuery === '' || 
      property.property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.property.suburb.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.property.postcode.toLowerCase().includes(searchQuery.toLowerCase());
    
    return locationMatch && statusMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="col-span-12 md:col-span-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search suburb, postcode or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div className="col-span-6 md:col-span-2">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary h-10"
              >
                <option value="all">All States</option>
                <option value="VIC">Victoria</option>
                <option value="NSW">NSW</option>
                <option value="QLD">Queensland</option>
                <option value="WA">WA</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="col-span-6 md:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary h-10"
              >
                <option value="all">All Status</option>
                <option value="in_auction">Live Auction</option>
                <option value="active">Coming Soon</option>
                <option value="completed">Sold</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="col-span-6 md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary h-10"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="lvr">LVR: Low to High</option>
              </select>
            </div>

            {/* More Filters Button */}
            <div className="col-span-6 md:col-span-1">
              <Button variant="outline" className="w-full h-10">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'Property' : 'Properties'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Investment opportunities across Australia
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Map View</Button>
          <Button variant="outline" size="sm">List View</Button>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property, index) => (
          <PropertyCard
            key={property.id}
            property={property}
            image={propertyImages[index % propertyImages.length]}
            calculateLVR={calculateLVR}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-16">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery('');
              setLocationFilter('all');
              setStatusFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

// Property Card Component - Real Estate Style
interface PropertyCardProps {
  property: any;
  image: string;
  calculateLVR: (debt: number, valuation: number) => string;
  onNavigate?: (page: string, id?: string) => void;
}

function PropertyCard({ property, image, calculateLVR, onNavigate }: PropertyCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'in_auction':
        return {
          badge: 'LIVE AUCTION',
          badgeColor: 'bg-red-600',
          showPulse: true,
          icon: Gavel
        };
      case 'active':
        return {
          badge: 'COMING SOON',
          badgeColor: 'bg-blue-600',
          showPulse: false,
          icon: Calendar
        };
      case 'completed':
        return {
          badge: 'SOLD',
          badgeColor: 'bg-gray-800',
          showPulse: false,
          icon: CheckCircle2
        };
      default:
        return {
          badge: 'ACTIVE',
          badgeColor: 'bg-green-600',
          showPulse: false,
          icon: Home
        };
    }
  };

  const statusConfig = getStatusConfig(property.status);

  // Calculate Buy Now Price - between debt and valuation (debt + 35% of equity)
  const equity = property.valuation.amount - property.outstandingDebt;
  const buyNowPrice = property.outstandingDebt + (equity * 0.35);

  return (
    <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer">
      {/* Property Image */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={image}
          alt={property.property.address}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <div className={`px-3 py-1.5 ${statusConfig.badgeColor} text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg`}>
            {statusConfig.showPulse && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
            {statusConfig.badge}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
            <Share2 className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Property Details Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-3 text-white text-sm mb-2">
            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
              <Bed className="w-4 h-4" />
              <span className="font-medium">{property.property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
              <Bath className="w-4 h-4" />
              <span className="font-medium">{property.property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
              <Car className="w-4 h-4" />
              <span className="font-medium">{property.property.parking}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Property Info */}
      <CardContent className="p-5">
        {/* Address */}
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
            {property.property.address}
          </h3>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm">
              {property.property.suburb}, {property.property.state} {property.property.postcode}
            </p>
          </div>
        </div>

        {/* Price and Investment Details */}
        <div className="space-y-2 mb-4 pb-4 border-b">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Loan Amount</span>
            <span className="text-xl font-bold text-gray-900">
              ${(property.outstandingDebt / 1000).toFixed(0)}k
            </span>
          </div>
          
          {property.status === 'in_auction' && property.currentBid && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Bid</span>
              <span className="text-lg font-bold text-green-600">
                ${(property.currentBid / 1000).toFixed(0)}k
              </span>
            </div>
          )}

          {/* Buy Now Price - Always Show */}
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex items-center gap-1">
              <ShoppingCart className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600 font-medium">Buy Now Price</span>
            </div>
            <span className="text-xl font-bold text-green-600">
              ${((buyNowPrice) / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        {/* Investment Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">LVR</p>
            <p className="text-sm font-bold text-indigo-600">
              {calculateLVR(property.outstandingDebt, property.valuation.amount)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Return</p>
            <p className="text-sm font-bold text-green-600">12.4%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Type</p>
            <p className="text-sm font-bold text-gray-900">{property.property.propertyType}</p>
          </div>
        </div>

        {/* Auction Timer or Date */}
        {property.status === 'in_auction' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-gray-700">Ends in</span>
              </div>
              <span className="text-sm font-bold text-red-600">2h 45m</span>
            </div>
          </div>
        )}

        {property.status === 'active' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">Auction</span>
              </div>
              <span className="text-xs font-bold text-blue-600">18 Feb 2026</span>
            </div>
          </div>
        )}

        {/* Deal ID and Bids */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>ID: {property.caseNumber}</span>
          {property.bidCount && property.bidCount > 0 && (
            <span className="font-medium">{property.bidCount} bids</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {property.status === 'in_auction' ? (
            <>
              <Button className="flex-1" size="sm" onClick={() => onNavigate?.('auction_room', property.id)}>
                <Gavel className="w-4 h-4 mr-1" />
                Place Bid
              </Button>
              <Button variant="outline" size="sm" onClick={() => onNavigate?.('auction_room', property.id)}>
                <Eye className="w-4 h-4" />
              </Button>
            </>
          ) : property.status === 'active' ? (
            <>
              <Button variant="outline" className="flex-1" size="sm" onClick={() => onNavigate?.('buy_now_room', property.id)}>
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button className="flex-1" size="sm" onClick={() => onNavigate?.('buy_now_room', property.id)}>
                <ShoppingCart className="w-4 h-4 mr-1" />
                Buy Now
              </Button>
            </>
          ) : (
            <Button variant="outline" className="w-full" size="sm" onClick={() => onNavigate?.('buy_now_room', property.id)}>
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
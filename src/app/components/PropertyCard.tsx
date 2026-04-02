import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { StatusBadge } from './StatusBadge';
import { AuctionTimer } from './AuctionTimer';
import { Bed, Bath, Car, Home, MapPin, TrendingUp, Eye } from 'lucide-react';
import type { Case } from '../data/mockData';

interface PropertyCardProps {
  caseData: Case;
  onViewDetails?: () => void;
  onPlaceBid?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export function PropertyCard({ 
  caseData, 
  onViewDetails, 
  onPlaceBid, 
  showActions = true,
  compact = false 
}: PropertyCardProps) {
  const equityPercentage = ((caseData.valuation.amount - caseData.outstandingDebt) / caseData.valuation.amount * 100).toFixed(1);
  const currentBidPercentage = caseData.currentBid 
    ? ((caseData.currentBid / caseData.valuation.amount) * 100).toFixed(1)
    : null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Property Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={caseData.property.imageUrl}
          alt={caseData.property.address}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <StatusBadge status={caseData.status} type="case" />
          <StatusBadge status={caseData.riskLevel} type="risk" />
        </div>
        {caseData.auctionEndTime && caseData.status === 'in_auction' && (
          <div className="absolute top-3 right-3">
            <AuctionTimer endTime={caseData.auctionEndTime} />
          </div>
        )}
      </div>

      <CardContent className="p-5">
        {/* Property Address */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-lg text-gray-900 leading-tight">
              {caseData.property.address}
            </h3>
            {caseData.currentBid && (
              <div className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded">
                <TrendingUp className="w-3 h-3" />
                {caseData.bidCount}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{caseData.property.suburb}, {caseData.property.state} {caseData.property.postcode}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{caseData.caseNumber}</p>
        </div>

        {/* Property Features */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Home className="w-4 h-4" />
            <span className="font-medium">{caseData.property.propertyType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{caseData.property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{caseData.property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Car className="w-4 h-4" />
            <span>{caseData.property.parking}</span>
          </div>
        </div>

        {/* Financial Details */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-600">Valuation</span>
            <span className="font-semibold text-gray-900">
              ${caseData.valuation.amount.toLocaleString()}
            </span>
          </div>
          
          {caseData.minimumBid && (
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-gray-600">Minimum Bid</span>
              <span className="font-semibold text-indigo-600">
                ${caseData.minimumBid.toLocaleString()}
              </span>
            </div>
          )}

          {caseData.currentBid ? (
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-gray-600">Current Bid</span>
              <div className="text-right">
                <span className="font-semibold text-green-600 text-lg">
                  ${caseData.currentBid.toLocaleString()}
                </span>
                <p className="text-xs text-gray-500">{currentBidPercentage}% of valuation</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-gray-600">Status</span>
              <span className="text-sm font-medium text-amber-600">No bids yet</span>
            </div>
          )}

          <div className="flex justify-between items-baseline pt-3 border-t">
            <span className="text-sm text-gray-600">Outstanding Debt</span>
            <span className="font-medium text-gray-700">
              ${caseData.outstandingDebt.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-600">Equity Available</span>
            <div className="text-right">
              <span className="font-semibold text-green-700">
                ${(caseData.valuation.amount - caseData.outstandingDebt).toLocaleString()}
              </span>
              <p className="text-xs text-gray-500">{equityPercentage}% equity</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onViewDetails}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button 
              className="flex-1"
              onClick={onPlaceBid}
            >
              Place Bid
            </Button>
          </div>
        )}

        {/* Lender Info */}
        <div className="mt-4 pt-4 border-t text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Lender: {caseData.lenderName}</span>
            <span>Listed {new Date(caseData.createdAt).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

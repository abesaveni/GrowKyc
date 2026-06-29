import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Home,
  FileText,
  Download,
  Eye,
  Gavel,
  Users,
  BarChart3,
  Activity,
  ChevronLeft,
  ChevronRight,
  Shield,
  Target,
  TrendingDown,
  Briefcase,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { mockCases } from '../../data/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { InvestmentMemorandum } from '../case/InvestmentMemorandum';
import { CountdownTimer } from '../ui/countdown-timer';
import { toast } from '../../lib/toast';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { format } from 'date-fns';

interface AuctionRoomProps {
  onBack?: () => void;
}

export function AuctionRoom({ onBack }: AuctionRoomProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('auction');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [confirmBidOpen, setConfirmBidOpen] = useState(false);
  const [myBids, setMyBids] = useState<number[]>([1000000]); // Track user's bids

  const property = mockCases[0];

  // Auction end date - 2 hours 45 minutes from now
  const auctionEndDate = new Date(Date.now() + 2 * 60 * 60 * 1000 + 45 * 60 * 1000);

  const propertyImages = [
    'https://images.unsplash.com/photo-1715247018235-82cb9d34ddbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBBdXN0cmFsaWFuJTIwaG91c2UlMjBleHRlcmlvciUyMGR1c2t8ZW58MXx8fHwxNzcwOTcwODQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1580387128798-a5abad264ac4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBBdXN0cmFsaWFuJTIwcmVzaWRlbnRpYWwlMjBwcm9wZXJ0eSUyMHN1bnNldHxlbnwxfHx8fDE3NzA5NzA4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1766050589756-29eac959ff51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBBdXN0cmFsaWFuJTIwaG9tZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1710253655362-a0eaad4f4e55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yJTIwZGF5dGltZXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  ];

  // Enhanced loan metrics with more data from case
  const loanMetrics = {
    originalLoanAmount: property.loanDetails?.originalLoanAmount || 1200000,
    outstandingDebt: property.outstandingDebt,
    interestRate: property.loanDetails?.interestRate || 5.75,
    defaultRate: property.loanDetails?.defaultInterestRate || 8.25,
    daysInArrears: property.loanDetails?.daysInArrears || 127,
    daysInDefault: property.loanDetails?.daysInDefault || 89,
    lastPaymentDate: property.loanDetails?.lastPaymentDate || new Date('2025-10-15'),
    lastPaymentAmount: property.loanDetails?.lastPaymentAmount || 4500,
    missedPayments: property.loanDetails?.missedPaymentCount || 4,
    totalArrears: property.loanDetails?.totalArrearsAmount || 24500,
    loanToValue: ((property.outstandingDebt / property.valuation.amount) * 100).toFixed(1),
    currentBid: property.currentBid || 1100000,
    reservePrice: property.minimumBid || 950000,
    // Additional loan info
    loanStartDate: property.loanDetails?.loanStartDate || new Date('2020-03-15'),
    maturityDate: property.loanDetails?.maturityDate || new Date('2030-03-15'),
    loanTerm: property.loanDetails?.loanTermYears || 10,
    repaymentType: property.loanDetails?.repaymentType || 'Principal and Interest',
    monthlyRepayment: property.loanDetails?.monthlyPaymentAmount || 12500,
    loanPurpose: property.loanDetails?.loanPurpose || 'Purchase',
    securityType: property.loanDetails?.securityType || 'First Mortgage',
    // Lender info
    lenderName: property.lenderName || property.lenderDetails?.lenderName || 'Commonwealth Bank',
    lenderACL: property.lenderDetails?.aclNumber || 'ACL 123456',
    lenderContact: property.lenderDetails?.contactPerson || 'John Smith',
    lenderEmail: property.lenderDetails?.email || 'lender@example.com',
    lenderPhone: property.lenderDetails?.phone || '1300 123 456',
  };

  const [bidHistory, setBidHistory] = useState([
    { bidder: 'You', amount: 1100000, time: new Date(Date.now() - 5 * 60 * 1000), status: 'winning', isYou: true },
    { bidder: 'Investor B', amount: 1050000, time: new Date(Date.now() - 45 * 60 * 1000), status: 'outbid', isYou: false },
    { bidder: 'You', amount: 1000000, time: new Date(Date.now() - 90 * 60 * 1000), status: 'outbid', isYou: true },
    { bidder: 'Investor C', amount: 975000, time: new Date(Date.now() - 120 * 60 * 1000), status: 'outbid', isYou: false },
    { bidder: 'Investor D', amount: 950000, time: new Date(Date.now() - 180 * 60 * 1000), status: 'outbid', isYou: false },
  ]);

  const documents = [
    { name: 'Loan Agreement', type: 'Contract', size: '2.4 MB' },
    { name: 'Property Valuation', type: 'Valuation', size: '1.8 MB' },
    { name: 'Title Search', type: 'Legal', size: '856 KB' },
    { name: 'Building Inspection', type: 'Inspection', size: '3.2 MB' }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  const handleBidClick = () => {
    const bid = parseInt(bidAmount);
    
    // Validation
    if (!bidAmount || isNaN(bid)) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    if (bid <= loanMetrics.currentBid) {
      toast.error(`Bid must be higher than current bid of A$${loanMetrics.currentBid.toLocaleString()}`);
      return;
    }

    if (bid < loanMetrics.currentBid + 10000) {
      toast.warning('Bid must be at least A$10,000 higher than current bid');
      return;
    }

    if (bid < loanMetrics.reservePrice) {
      toast.error(`Bid must meet reserve price of A$${loanMetrics.reservePrice.toLocaleString()}`);
      return;
    }

    setConfirmBidOpen(true);
  };

  const confirmBid = async () => {
    setConfirmBidOpen(false);
    setIsPlacingBid(true);

    const bid = parseInt(bidAmount);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update bid history
    const newBid = {
      bidder: 'You',
      amount: bid,
      time: new Date(),
      status: 'winning' as const,
      isYou: true
    };

    // Update previous winning bid to outbid
    const updatedHistory = bidHistory.map(b => 
      b.status === 'winning' ? { ...b, status: 'outbid' as const } : b
    );

    setBidHistory([newBid, ...updatedHistory]);
    setMyBids([...myBids, bid]);
    loanMetrics.currentBid = bid;
    
    setIsPlacingBid(false);
    setBidAmount('');
    
    toast.success(`Bid placed successfully! Your bid of A$${bid.toLocaleString()} is now the highest bid`);
  };

  const handleQuickBid = (increment: number) => {
    const newBid = loanMetrics.currentBid + increment;
    setBidAmount(newBid.toString());
  };

  const handleDocumentView = (docName: string) => {
    toast.info(`Opening ${docName}...`);
  };

  const handleDocumentDownload = (docName: string) => {
    toast.success(`Downloading ${docName}...`);
  };

  const handleAuctionEnd = () => {
    toast.info('Auction has ended! Results will be announced shortly');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: onBack },
          { label: 'Auctions', onClick: onBack },
          { label: 'Live Auction', active: true }
        ]}
      />
      
      <div className="-mt-6 -mx-6">
      {/* Hero Image Section - Full Bleed */}
      <div className="relative h-[500px] overflow-hidden">
        <ImageWithFallback
          src={propertyImages[currentImageIndex]}
          alt={property.property.address}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {/* Live Auction Badge */}
        <div className="absolute top-6 left-6">
          <div className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-lg flex items-center gap-2 shadow-xl">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            LIVE AUCTION
          </div>
        </div>

        {/* Image Navigation */}
        <button
          onClick={prevImage}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-100" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:bg-white transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-slate-100" />
        </button>

        {/* Property Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{property.property.address}</h1>
                <div className="flex items-center gap-2 text-lg mb-4">
                  <MapPin className="w-5 h-5" />
                  <span>{property.property.suburb}, {property.property.state} {property.property.postcode}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Bed className="w-5 h-5" />
                    <span className="font-semibold">{property.property.bedrooms} Bed</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Bath className="w-5 h-5" />
                    <span className="font-semibold">{property.property.bathrooms} Bath</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Car className="w-5 h-5" />
                    <span className="font-semibold">{property.property.parking} Car</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <Home className="w-5 h-5" />
                    <span className="font-semibold">{property.property.propertyType}</span>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="bg-red-600 text-white p-6 rounded-lg shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6" />
                  <span className="text-sm font-medium">Auction Ends In</span>
                </div>
                <CountdownTimer 
                  endDate={auctionEndDate}
                  variant="large"
                  onExpire={handleAuctionEnd}
                  className="text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Image Thumbnails */}
        <div className="absolute bottom-24 left-6 flex gap-2">
          {propertyImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex ? 'border-white scale-110' : 'border-white/50 opacity-60 hover:opacity-100'
              }`}
            >
              <ImageWithFallback src={img} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="auction">
              <Gavel className="w-4 h-4 mr-2" />
              Live Auction
            </TabsTrigger>
            <TabsTrigger value="im">
              <Briefcase className="w-4 h-4 mr-2" />
              Investment Memorandum
            </TabsTrigger>
          </TabsList>

          {/* Auction Tab */}
          <TabsContent value="auction" className="space-y-6">
            {/* Critical Loan Metrics - Top Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <Card className="bg-gradient-to-br from-red-50 to-white border-2 border-red-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <p className="text-xs font-medium text-slate-300">Days in Default</p>
                  </div>
                  <p className="text-3xl font-bold text-red-400">{loanMetrics.daysInDefault}</p>
                  <p className="text-xs text-slate-400 mt-1">Critical status</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <p className="text-xs font-medium text-slate-300">Days in Arrears</p>
                  </div>
                  <p className="text-3xl font-bold text-amber-400">{loanMetrics.daysInArrears}</p>
                  <p className="text-xs text-slate-400 mt-1">{loanMetrics.missedPayments} missed payments</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <p className="text-xs font-medium text-slate-300">Interest Rate</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-400">{loanMetrics.interestRate}%</p>
                  <p className="text-xs text-slate-400 mt-1">Original rate</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-purple-400" />
                    <p className="text-xs font-medium text-slate-300">Default Rate</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-400">{loanMetrics.defaultRate}%</p>
                  <p className="text-xs text-slate-400 mt-1">Current penalty rate</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-white border-2 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-green-400" />
                    <p className="text-xs font-medium text-slate-300">LVR</p>
                  </div>
                  <p className="text-3xl font-bold text-green-400">{loanMetrics.loanToValue}%</p>
                  <p className="text-xs text-slate-400 mt-1">Loan to value</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-indigo-400" />
                    <p className="text-xs font-medium text-slate-300">Total Arrears</p>
                  </div>
                  <p className="text-3xl font-bold text-indigo-400">A${(loanMetrics.totalArrears / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-slate-400 mt-1">Outstanding</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                {/* Loan Details */}
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Loan Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Original Loan Amount</p>
                        <p className="text-2xl font-bold text-slate-100">A${loanMetrics.originalLoanAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Outstanding Debt</p>
                        <p className="text-2xl font-bold text-slate-100">A${loanMetrics.outstandingDebt.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Last Payment Date</p>
                        <p className="text-lg font-semibold text-slate-100">
                          {format(loanMetrics.lastPaymentDate, 'dd MMM yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Last Payment Amount</p>
                        <p className="text-lg font-semibold text-slate-100">A${loanMetrics.lastPaymentAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Property Valuation</p>
                        <p className="text-2xl font-bold text-green-400">A${property.valuation.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Equity Available</p>
                        <p className="text-2xl font-bold text-green-400">
                          A${(property.valuation.amount - loanMetrics.outstandingDebt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-slate-100 mb-1">Risk Assessment</p>
                          <p className="text-sm text-slate-300">
                            This loan is {loanMetrics.daysInDefault} days in default with {loanMetrics.missedPayments} missed payments. 
                            Current LVR of {loanMetrics.loanToValue}% provides adequate security. Property valuation is current as of {format(property.valuation.date, 'MMM yyyy')}.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Property Information */}
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-primary" />
                      Property Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Property Type</p>
                        <p className="text-lg font-semibold text-slate-100">{property.property.propertyType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Land Size</p>
                        <p className="text-lg font-semibold text-slate-100">{property.property.landSize} m²</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Bedrooms</p>
                        <p className="text-lg font-semibold text-slate-100">{property.property.bedrooms}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Bathrooms</p>
                        <p className="text-lg font-semibold text-slate-100">{property.property.bathrooms}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Parking</p>
                        <p className="text-lg font-semibold text-slate-100">{property.property.parking}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Valuer</p>
                        <p className="text-lg font-semibold text-slate-100">{property.valuation.valuerName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* MIP Background & Reason */}
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Mortgage in Possession - Background
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-slate-100 mb-2">Reason for MIP Status</h4>
                        <p className="text-slate-300 leading-relaxed">
                          This property has entered mortgage in possession status due to payment default on the secured loan. 
                          The borrower has been in arrears for {loanMetrics.daysInArrears} days and in formal default for {loanMetrics.daysInDefault} days, 
                          with {loanMetrics.missedPayments} consecutive missed monthly payments totaling A${loanMetrics.totalArrears.toLocaleString()} in arrears.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-slate-300 mb-1">Last Payment Made</p>
                          <p className="text-lg font-semibold text-slate-100">{format(loanMetrics.lastPaymentDate, 'dd MMM yyyy')}</p>
                          <p className="text-sm text-slate-300">Amount: A${loanMetrics.lastPaymentAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-300 mb-1">Default Notice Issued</p>
                          <p className="text-lg font-semibold text-slate-100">{format(new Date(loanMetrics.lastPaymentDate.getTime() + 45 * 24 * 60 * 60 * 1000), 'dd MMM yyyy')}</p>
                          <p className="text-sm text-slate-300">Formal enforcement commenced</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-300 mb-1">Total Arrears</p>
                          <p className="text-lg font-semibold text-slate-100">A${loanMetrics.totalArrears.toLocaleString()}</p>
                          <p className="text-sm text-slate-300">{loanMetrics.missedPayments} missed payments</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-300 mb-1">Default Interest Rate</p>
                          <p className="text-lg font-semibold text-slate-100">{loanMetrics.defaultRate}% p.a.</p>
                          <p className="text-sm text-slate-300">Additional {(loanMetrics.defaultRate - loanMetrics.interestRate).toFixed(2)}% penalty</p>
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                        <h4 className="font-semibold text-slate-100 mb-2 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-400" />
                          Legal Process & Timeline
                        </h4>
                        <ul className="text-sm text-slate-300 space-y-2">
                          <li>✓ Pre-litigation demand letter sent and expired</li>
                          <li>✓ Section 57(2)(b) default notice issued under National Credit Code</li>
                          <li>✓ Mortgagee possession proceedings initiated</li>
                          <li>✓ All NCCP Act 2009 requirements complied with</li>
                          <li>✓ Property marketing authorization obtained</li>
                        </ul>
                      </div>

                      {property.nccpCompliance?.borrowerCooperation && (
                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <p className="text-sm text-slate-300">
                            <strong>Borrower Status:</strong> {property.nccpCompliance.borrowerCooperation}. 
                            {property.nccpCompliance.possessionStatus && ` Property possession: ${property.nccpCompliance.possessionStatus}.`}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Verification & Due Diligence Checks */}
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Verification & Due Diligence Checks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* InfoTrack Checks */}
                      <div>
                        <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-blue-400" />
                          InfoTrack Verification Suite
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className={`p-3 rounded-lg border ${property.documentsTracking?.titleSearchCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-slate-100">Title Search</span>
                              {property.documentsTracking?.titleSearchCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                              )}
                            </div>
                            <p className="text-xs text-slate-300">
                              {property.documentsTracking?.titleSearchCompleted ? 'Clean title confirmed' : 'Pending'}
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg border ${property.documentsTracking?.identityVerificationCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-slate-100">Identity Verification</span>
                              {property.documentsTracking?.identityVerificationCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                              )}
                            </div>
                            <p className="text-xs text-slate-300">
                              {property.documentsTracking?.identityVerificationCompleted ? 'All parties verified' : 'Pending'}
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg border ${property.documentsTracking?.encumbranceCheckCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-slate-100">Encumbrance Check</span>
                              {property.documentsTracking?.encumbranceCheckCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                              )}
                            </div>
                            <p className="text-xs text-slate-300">
                              {property.documentsTracking?.encumbranceCheckCompleted ? 'No secondary liens' : 'Pending'}
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg border ${property.documentsTracking?.zoningCheckCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-slate-100">Zoning Check</span>
                              {property.documentsTracking?.zoningCheckCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                              )}
                            </div>
                            <p className="text-xs text-slate-300">
                              {property.documentsTracking?.zoningCheckCompleted ? 'Compliant for use' : 'Pending'}
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg border ${property.documentsTracking?.environmentalCheckCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-slate-100">Environmental Check</span>
                              {property.documentsTracking?.environmentalCheckCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                              )}
                            </div>
                            <p className="text-xs text-slate-300">
                              {property.documentsTracking?.environmentalCheckCompleted ? 'No risks identified' : 'Pending'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Checks */}
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold text-slate-100 mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-indigo-400" />
                          Additional Verification
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className={`p-3 rounded-lg border ${property.infoTrackChecksCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-slate-100">InfoTrack Suite</span>
                              {property.infoTrackChecksCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                              )}
                            </div>
                            <p className="text-xs text-slate-300">
                              {property.infoTrackChecksCompleted ? '✓ Complete' : 'Pending'}
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg border ${property.automatedChecksCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-slate-100">Automated Checks</span>
                              {property.automatedChecksCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                              )}
                            </div>
                            <p className="text-xs text-slate-300">
                              {property.automatedChecksCompleted ? '✓ Validated' : 'Pending'}
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg border ${property.creditCheckCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-slate-100">Credit Check</span>
                              {property.creditCheckCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                              )}
                            </div>
                            <p className="text-xs text-slate-300">
                              {property.creditCheckCompleted ? '✓ Assessed' : 'Pending'}
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg border ${property.paymentVerified ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-slate-100">Payment History</span>
                              {property.paymentVerified ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                              )}
                            </div>
                            <p className="text-xs text-slate-300">
                              {property.paymentVerified ? '✓ Verified' : 'Pending'}
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg border ${property.valuation.amount > 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-slate-100">Valuation</span>
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </div>
                            <p className="text-xs text-slate-300">
                              Current as of {format(property.valuation.date, 'MMM yyyy')}
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg border ${property.status === 'in_auction' ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-slate-100">Legal Status</span>
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </div>
                            <p className="text-xs text-slate-300">
                              Cleared for auction
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Document Completion Summary */}
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold text-slate-100 mb-3">Document Collection Status</h4>
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-slate-100">Overall Completion</span>
                            <span className="text-lg font-bold text-indigo-400">
                              {Math.round((Object.values(property.documentsTracking || {}).filter(Boolean).length / 13) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                            <div 
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all"
                              style={{ width: `${(Object.values(property.documentsTracking || {}).filter(Boolean).length / 13) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-300">
                            {Object.values(property.documentsTracking || {}).filter(Boolean).length} of 13 documents collected and verified
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lender & Loan Terms */}
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-primary" />
                      Lender & Loan Terms
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Lender Name</p>
                        <p className="text-lg font-semibold text-slate-100">{loanMetrics.lenderName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">ACL Number</p>
                        <p className="text-lg font-semibold text-slate-100">{loanMetrics.lenderACL}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Loan Start Date</p>
                        <p className="text-lg font-semibold text-slate-100">{format(loanMetrics.loanStartDate, 'dd MMM yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Maturity Date</p>
                        <p className="text-lg font-semibold text-slate-100">{format(loanMetrics.maturityDate, 'dd MMM yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Loan Term</p>
                        <p className="text-lg font-semibold text-slate-100">{loanMetrics.loanTerm} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Repayment Type</p>
                        <p className="text-lg font-semibold text-slate-100">{loanMetrics.repaymentType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Monthly Payment</p>
                        <p className="text-lg font-semibold text-slate-100">A${loanMetrics.monthlyRepayment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Loan Purpose</p>
                        <p className="text-lg font-semibold text-slate-100">{loanMetrics.loanPurpose}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Security Type</p>
                        <p className="text-lg font-semibold text-slate-100">{loanMetrics.securityType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Contact Person</p>
                        <p className="text-lg font-semibold text-slate-100">{loanMetrics.lenderContact}</p>
                      </div>
                    </div>

                    {property.nccpCompliance?.subjectToNCCP && (
                      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-slate-100 mb-1">NCCP Compliance</p>
                            <p className="text-sm text-slate-300">
                              This loan is subject to the National Consumer Credit Protection Act 2009. 
                              {property.nccpCompliance.loanPurpose && ` Loan Purpose: ${property.nccpCompliance.loanPurpose}.`}
                              {property.nccpCompliance.preContractualDisclosureProvided && ' Pre-contractual disclosure has been provided.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Documents */}
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Available Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-semibold text-slate-100">{doc.name}</p>
                              <p className="text-sm text-slate-400">{doc.type} • {doc.size}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleDocumentView(doc.name)}>
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDocumentDownload(doc.name)}>
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - 1/3 width */}
              <div className="space-y-6">
                {/* Current Bid Status */}
                <Card className="bg-gradient-to-br from-green-50 to-white border-2 border-green-500/30">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-slate-300 mb-2">Current Highest Bid</p>
                      <p className="text-5xl font-bold text-green-400 mb-4">
                        A${(loanMetrics.currentBid / 1000).toFixed(0)}k
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-300 mb-4">
                        <Users className="w-4 h-4" />
                        <span>{bidHistory.length} bids from {new Set(bidHistory.map(b => b.bidder)).size} bidders</span>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-slate-300 mb-1">Reserve Price</p>
                        <p className="text-2xl font-bold text-slate-100">A${(loanMetrics.reservePrice / 1000).toFixed(0)}k</p>
                        <p className="text-xs text-green-400 font-semibold mt-1">✓ Reserve Met</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Place Bid */}
                <Card className="border-2 border-indigo-500/30">
                  <CardHeader className="border-b bg-indigo-500/10">
                    <CardTitle className="flex items-center gap-2">
                      <Gavel className="w-5 h-5 text-primary" />
                      Place Your Bid
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                          Bid Amount (AUD)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">A$</span>
                          <Input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder="Enter bid amount"
                            className="pl-10 text-lg font-semibold h-12"
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                          Minimum increment: A$10,000 • Current bid: A${loanMetrics.currentBid.toLocaleString()}
                        </p>
                      </div>

                      {/* Quick Bid Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleQuickBid(10000)}
                        >
                          +A$10k
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleQuickBid(25000)}
                        >
                          +A$25k
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleQuickBid(50000)}
                        >
                          +A$50k
                        </Button>
                      </div>

                      <Button 
                        className="w-full" 
                        size="lg" 
                        onClick={handleBidClick}
                        disabled={isPlacingBid}
                      >
                        {isPlacingBid ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Placing Bid...
                          </>
                        ) : (
                          <>
                            <Gavel className="w-5 h-5 mr-2" />
                            Place Bid
                          </>
                        )}
                      </Button>

                      <div className="pt-4 border-t space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Your bid:</span>
                          <span className="font-semibold">A${bidAmount ? parseInt(bidAmount).toLocaleString() : '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Buyer premium (2%):</span>
                          <span className="font-semibold">A${bidAmount ? (parseInt(bidAmount) * 0.02).toLocaleString() : '0'}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="font-semibold">Total investment:</span>
                          <span className="font-bold text-lg">A${bidAmount ? (parseInt(bidAmount) * 1.02).toLocaleString() : '0'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Bid History */}
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      Bid History ({bidHistory.length} bids)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {bidHistory.map((bid, index) => (
                        <div 
                          key={index} 
                          className={`p-3 border rounded-lg ${
                            bid.isYou ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${bid.isYou ? 'text-indigo-400' : 'text-slate-100'}`}>
                                {bid.bidder}
                              </span>
                              {bid.isYou && (
                                <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full font-semibold">
                                  You
                                </span>
                              )}
                              {bid.status === 'winning' && (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              )}
                            </div>
                            <span className="text-xs text-slate-400">
                              {format(bid.time, 'HH:mm')}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-slate-100">A${(bid.amount / 1000).toFixed(0)}k</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className={`text-xs font-semibold ${
                              bid.status === 'winning' ? 'text-green-400' : 'text-slate-400'
                            }`}>
                              {bid.status === 'winning' ? '✓ Winning' : 'Outbid'}
                            </p>
                            {index < bidHistory.length - 1 && (
                              <p className="text-xs text-slate-400">
                                +A${((bid.amount - bidHistory[index + 1].amount) / 1000).toFixed(0)}k
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Investment Summary */}
                <Card className="bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-500/30">
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg">Investment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Expected ROI:</span>
                        <span className="font-bold text-green-400">12.4%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Recovery Rate:</span>
                        <span className="font-bold">87.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Time to Settlement:</span>
                        <span className="font-bold">45-60 days</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t">
                        <span className="text-slate-300">Risk Level:</span>
                        <span className="px-2 py-1 bg-amber-500/15 text-amber-300 rounded text-xs font-semibold">Medium</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Investment Memorandum Tab */}
          <TabsContent value="im" className="space-y-6">
            <InvestmentMemorandum />
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirm Bid Dialog */}
      <ConfirmDialog
        open={confirmBidOpen}
        onOpenChange={setConfirmBidOpen}
        title="Confirm Your Bid"
        description={`Are you sure you want to place a bid of A$${bidAmount ? parseInt(bidAmount).toLocaleString() : '0'}? This action is binding and cannot be undone.`}
        confirmLabel="Confirm Bid"
        onConfirm={confirmBid}
        variant="default"
      />
      </div>
    </div>
  );
}
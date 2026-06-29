import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ConfirmDialog } from '../ui/confirm-dialog';
import { Breadcrumbs } from '../ui/breadcrumbs';
import { toast } from '../../lib/toast';
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
  ShoppingCart,
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
  CreditCard,
  ArrowLeft
} from 'lucide-react';
import { mockCases } from '../../data/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { InvestmentMemorandum } from '../case/InvestmentMemorandum';
import { format } from 'date-fns';

interface BuyNowRoomProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function BuyNowRoom({ onNavigate, onBack }: BuyNowRoomProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [confirmPurchaseOpen, setConfirmPurchaseOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const property = mockCases[1]; // Use a different property for buy now

  const propertyImages = [
    'https://images.unsplash.com/photo-1580387128798-a5abad264ac4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBBdXN0cmFsaWFuJTIwcmVzaWRlbnRpYWwlMjBwcm9wZXJ0eSUyMHN1bnNldHxlbnwxfHx8fDE3NzA5NzA4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1766050589756-29eac959ff51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBBdXN0cmFsaWFuJTIwaG9tZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1710253655362-a0eaad4f4e55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yJTIwZGF5dGltZXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1659684382003-709720aaef16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWJ1cmJhbiUyMEF1c3RyYWxpYW4lMjBwcm9wZXJ0eXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  ];

  // Loan metrics
  const loanMetrics = {
    originalLoanAmount: 980000,
    outstandingDebt: property.outstandingDebt,
    interestRate: 5.25,
    defaultRate: 7.85,
    daysInArrears: 98,
    daysInDefault: 67,
    lastPaymentDate: new Date('2025-11-22'),
    lastPaymentAmount: 3800,
    missedPayments: 3,
    totalArrears: 18900,
    loanToValue: 68.5,
    fixedPrice: 1050000, // Buy Now price
    settlementPeriod: 45
  };

  const documents = [
    { name: 'Loan Agreement', type: 'Contract', size: '2.4 MB' },
    { name: 'Property Valuation', type: 'Valuation', size: '1.8 MB' },
    { name: 'Title Search', type: 'Legal', size: '856 KB' },
    { name: 'Building Inspection', type: 'Inspection', size: '3.2 MB' },
    { name: 'Purchase Agreement', type: 'Contract', size: '1.2 MB' }
  ];

  const handlePurchaseClick = () => {
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    setConfirmPurchaseOpen(true);
  };

  const confirmPurchase = async () => {
    setConfirmPurchaseOpen(false);
    setIsPurchasing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsPurchasing(false);
    toast.success(`Purchase confirmed for A$${loanMetrics.fixedPrice.toLocaleString()}!`, {
      description: 'Proceeding to payment...'
    });
    
    // Navigate to payment
    setTimeout(() => {
      onNavigate?.('payment');
    }, 500);
  };

  const handleDocumentView = (docName: string) => {
    toast.info(`Opening ${docName}...`);
  };

  const handleDocumentDownload = (docName: string) => {
    toast.success(`Downloading ${docName}...`);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  const handleConfirmPurchase = () => {
    setConfirmPurchaseOpen(true);
  };

  const handleCancelPurchase = () => {
    setConfirmPurchaseOpen(false);
  };

  const handleFinalPurchase = () => {
    setIsPurchasing(true);
    // Simulate purchase process
    setTimeout(() => {
      setIsPurchasing(false);
      toast.success('Purchase successful!');
      onNavigate?.('payment');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', onClick: onBack },
          { label: 'Deals', onClick: onBack },
          { label: 'Property Details', active: true }
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

        {/* Buy Now Badge */}
        <div className="absolute top-6 left-6">
          <div className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-lg flex items-center gap-2 shadow-xl">
            <ShoppingCart className="w-5 h-5" />
            BUY NOW - FIXED PRICE
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

              {/* Fixed Price Display */}
              <div className="bg-green-600 text-white p-6 rounded-lg shadow-xl">
                <p className="text-sm font-medium mb-2">Fixed Purchase Price</p>
                <p className="text-5xl font-bold">${(loanMetrics.fixedPrice / 1000).toFixed(0)}k</p>
                <p className="text-sm mt-2 opacity-90">{loanMetrics.settlementPeriod} day settlement</p>
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
            <TabsTrigger value="details">
              <Home className="w-4 h-4 mr-2" />
              Property Details
            </TabsTrigger>
            <TabsTrigger value="im">
              <Briefcase className="w-4 h-4 mr-2" />
              Investment Memorandum
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            {/* Critical Loan Metrics - Top Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <Card className="bg-gradient-to-br from-red-50 to-white border-2 border-red-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <p className="text-xs font-medium text-slate-300">Days in Default</p>
                  </div>
                  <p className="text-3xl font-bold text-red-400">{loanMetrics.daysInDefault}</p>
                  <p className="text-xs text-slate-400 mt-1">Moderate status</p>
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
                  <p className="text-3xl font-bold text-indigo-400">${(loanMetrics.totalArrears / 1000).toFixed(0)}k</p>
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
                        <p className="text-2xl font-bold text-slate-100">${loanMetrics.originalLoanAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Outstanding Debt</p>
                        <p className="text-2xl font-bold text-slate-100">${loanMetrics.outstandingDebt.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Last Payment Date</p>
                        <p className="text-lg font-semibold text-slate-100">
                          {format(loanMetrics.lastPaymentDate, 'dd MMM yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Last Payment Amount</p>
                        <p className="text-lg font-semibold text-slate-100">${loanMetrics.lastPaymentAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Property Valuation</p>
                        <p className="text-2xl font-bold text-green-400">${property.valuation.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-300 mb-1">Equity Available</p>
                        <p className="text-2xl font-bold text-green-400">
                          ${(property.valuation.amount - loanMetrics.outstandingDebt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-slate-100 mb-1">Fixed Price Opportunity</p>
                          <p className="text-sm text-slate-300">
                            This property is available at a fixed price of ${loanMetrics.fixedPrice.toLocaleString()}. 
                            Lower risk profile with {loanMetrics.daysInDefault} days in default and strong equity position. 
                            Property valuation is current as of {format(property.valuation.date, 'MMM yyyy')}.
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
                {/* Purchase Price */}
                <Card className="bg-gradient-to-br from-green-50 to-white border-2 border-green-500/30">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-slate-300 mb-2">Fixed Purchase Price</p>
                      <p className="text-5xl font-bold text-green-400 mb-4">
                        ${(loanMetrics.fixedPrice / 1000).toFixed(0)}k
                      </p>
                      <div className="pt-4 border-t space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Outstanding Debt:</span>
                          <span className="font-semibold">${(loanMetrics.outstandingDebt / 1000).toFixed(0)}k</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Equity Gain:</span>
                          <span className="font-bold text-green-400">
                            ${((property.valuation.amount - loanMetrics.fixedPrice) / 1000).toFixed(0)}k
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Settlement Period:</span>
                          <span className="font-semibold">{loanMetrics.settlementPeriod} days</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Purchase Now */}
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                      Complete Purchase
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-sm font-semibold text-blue-300 mb-2">What's Included:</p>
                        <ul className="text-sm text-blue-300 space-y-1">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Full property ownership transfer
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            All legal documentation
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            {loanMetrics.settlementPeriod}-day settlement period
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Professional conveyancing
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                          <input
                            type="checkbox"
                            id="terms"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="mt-1"
                          />
                          <label htmlFor="terms" className="text-sm text-slate-300 cursor-pointer">
                            I agree to the terms and conditions, and I understand this is a binding purchase agreement
                          </label>
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        size="lg" 
                        onClick={handlePurchaseClick}
                        disabled={!agreedToTerms}
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Purchase Now - ${(loanMetrics.fixedPrice / 1000).toFixed(0)}k
                      </Button>

                      <div className="pt-4 border-t space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Purchase Price:</span>
                          <span className="font-semibold">${loanMetrics.fixedPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Legal Fees (est.):</span>
                          <span className="font-semibold">$2,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Stamp Duty (est.):</span>
                          <span className="font-semibold">${(loanMetrics.fixedPrice * 0.04).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="font-semibold">Total Est. Cost:</span>
                          <span className="font-bold text-lg">
                            ${(loanMetrics.fixedPrice + 2500 + (loanMetrics.fixedPrice * 0.04)).toLocaleString()}
                          </span>
                        </div>
                      </div>
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
                        <span className="font-bold text-green-400">14.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Equity Position:</span>
                        <span className="font-bold">${((property.valuation.amount - loanMetrics.fixedPrice) / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Time to Settlement:</span>
                        <span className="font-bold">{loanMetrics.settlementPeriod} days</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t">
                        <span className="text-slate-300">Risk Level:</span>
                        <span className="px-2 py-1 bg-green-500/15 text-green-300 rounded text-xs font-semibold">Low-Medium</span>
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

      {/* Confirm Purchase Dialog */}
      <ConfirmDialog
        open={confirmPurchaseOpen}
        onOpenChange={setConfirmPurchaseOpen}
        title="Confirm Purchase"
        description={`Are you sure you want to purchase this property for A$${loanMetrics.fixedPrice.toLocaleString()}? This is a binding agreement and cannot be undone.`}
        confirmLabel="Confirm Purchase"
        cancelLabel="Cancel"
        onConfirm={confirmPurchase}
        variant="default"
      />
      </div>
    </div>
  );
}
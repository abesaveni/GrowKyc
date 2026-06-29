import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Download, 
  Printer, 
  Eye,
  Edit,
  MapPin,
  Home,
  Bed,
  Bath,
  Car,
  TrendingUp,
  DollarSign,
  Calendar,
  AlertTriangle,
  Target,
  Shield,
  BarChart3,
  FileText,
  CheckCircle
} from 'lucide-react';
import { mockCases } from '../../data/mockData';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { format } from 'date-fns';

export function InvestmentMemorandum() {
  const [isEditing, setIsEditing] = useState(false);
  const property = mockCases[0];

  const propertyImages = [
    'https://images.unsplash.com/photo-1715247018235-82cb9d34ddbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBBdXN0cmFsaWFuJTIwaG91c2UlMjBleHRlcmlvciUyMGR1c2t8ZW58MXx8fHwxNzcwOTcwODQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1580387128798-a5abad264ac4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBBdXN0cmFsaWFuJTIwcmVzaWRlbnRpYWwlMjBwcm9wZXJ0eSUyMHN1bnNldHxlbnwxfHx8fDE3NzA5NzA4NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1766050589756-29eac959ff51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBBdXN0cmFsaWFuJTIwaG9tZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1710253655362-a0eaad4f4e55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yJTIwZGF5dGltZXxlbnwxfHx8fDE3NzA5NzA4NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  ];

  const loanMetrics = {
    originalLoanAmount: 1200000,
    outstandingDebt: property.outstandingDebt,
    interestRate: 5.75,
    defaultRate: 8.25,
    daysInArrears: 127,
    daysInDefault: 89,
    loanToValue: 72.8,
    expectedReturn: 12.4,
    targetSettlement: 60
  };

  const handleDownloadPDF = () => {
    alert('PDF generation would be triggered here');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-100">Investment Memorandum</h3>
              <p className="text-sm text-slate-300">Professional marketing document for investors</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Preview' : 'Edit'}
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button size="sm" onClick={handleDownloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IM Document */}
      <div className="bg-white shadow-2xl mx-auto max-w-5xl" id="im-document">
        {/* Cover Page */}
        <div className="relative h-[600px] overflow-hidden">
          <ImageWithFallback
            src={propertyImages[0]}
            alt={property.property.address}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80"></div>
          
          <div className="absolute inset-0 flex flex-col justify-between p-12">
            <div>
              <div className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm mb-6">
                INVESTMENT OPPORTUNITY
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                {property.property.address}
              </h1>
              <div className="flex items-center gap-2 text-white text-xl mb-8">
                <MapPin className="w-6 h-6" />
                <span>{property.property.suburb}, {property.property.state} {property.property.postcode}</span>
              </div>
              <div className="flex gap-6 text-white">
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                  <Bed className="w-6 h-6" />
                  <span className="text-2xl font-bold">{property.property.bedrooms}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                  <Bath className="w-6 h-6" />
                  <span className="text-2xl font-bold">{property.property.bathrooms}</span>
                </div>
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                  <Car className="w-6 h-6" />
                  <span className="text-2xl font-bold">{property.property.parking}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg">
                <p className="text-sm text-slate-300 mb-1">Property Value</p>
                <p className="text-3xl font-bold text-slate-100">${(property.valuation.amount / 1000).toFixed(0)}k</p>
              </div>
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg">
                <p className="text-sm text-slate-300 mb-1">Outstanding Debt</p>
                <p className="text-3xl font-bold text-slate-100">${(property.outstandingDebt / 1000).toFixed(0)}k</p>
              </div>
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg">
                <p className="text-sm text-slate-300 mb-1">Expected Return</p>
                <p className="text-3xl font-bold text-green-400">{loanMetrics.expectedReturn}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-12 border-b">
          <h2 className="text-3xl font-bold text-slate-100 mb-6">Executive Summary</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-slate-300 leading-relaxed mb-4">
                This Investment Memorandum presents a secured lending opportunity backed by a premium residential 
                property in {property.property.suburb}, {property.property.state}. The property is currently in 
                mortgage default, presenting an attractive acquisition opportunity for institutional and high net worth investors.
              </p>
              <p className="text-slate-300 leading-relaxed">
                The loan is secured by first mortgage over a well-maintained {property.property.propertyType.toLowerCase()} 
                valued at ${(property.valuation.amount / 1000).toFixed(0)}k, providing a conservative LVR of {loanMetrics.loanToValue}% 
                and significant equity buffer.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-100">First Mortgage Security</p>
                  <p className="text-sm text-slate-300">Primary lien position</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <CheckCircle className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-100">Independent Valuation</p>
                  <p className="text-sm text-slate-300">Current as of {format(property.valuation.date, 'MMM yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <CheckCircle className="w-8 h-8 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-100">Clear Title</p>
                  <p className="text-sm text-slate-300">No secondary encumbrances</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Highlights */}
        <div className="p-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-b">
          <h2 className="text-3xl font-bold text-slate-100 mb-6">Investment Highlights</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500/15 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-bold text-slate-100">Strong Returns</h3>
              </div>
              <p className="text-slate-300 mb-2">Target IRR of {loanMetrics.expectedReturn}% per annum with monthly interest payments at {loanMetrics.defaultRate}% default rate.</p>
              <p className="text-sm text-slate-300">Historical recovery rate: 87.5%</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/15 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-bold text-slate-100">Conservative LVR</h3>
              </div>
              <p className="text-slate-300 mb-2">Loan to Value Ratio of {loanMetrics.loanToValue}% provides substantial equity cushion and downside protection.</p>
              <p className="text-sm text-slate-300">Equity buffer: ${((property.valuation.amount - property.outstandingDebt) / 1000).toFixed(0)}k</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500/15 rounded-lg">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-bold text-slate-100">Prime Location</h3>
              </div>
              <p className="text-slate-300 mb-2">Located in {property.property.suburb}, a highly desirable suburb with strong capital growth history.</p>
              <p className="text-sm text-slate-300">5-year growth: 42% â€¢ Median: $1.15M</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-500/15 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="font-bold text-slate-100">Default Rate Premium</h3>
              </div>
              <p className="text-slate-300 mb-2">Enhanced return at {loanMetrics.defaultRate}% p.a. compared to original rate of {loanMetrics.interestRate}%, providing {(loanMetrics.defaultRate - loanMetrics.interestRate).toFixed(2)}% premium.</p>
              <p className="text-sm text-slate-300">{loanMetrics.daysInDefault} days in default â€¢ {loanMetrics.daysInArrears} days in arrears</p>
            </div>
          </div>
        </div>

        {/* Property Gallery */}
        <div className="p-12 border-b">
          <h2 className="text-3xl font-bold text-slate-100 mb-6">Property Gallery</h2>
          <div className="grid grid-cols-2 gap-4">
            {propertyImages.map((img, index) => (
              <div key={index} className="relative h-80 rounded-lg overflow-hidden shadow-lg">
                <ImageWithFallback src={img} alt={`Property view ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Loan Details */}
        <div className="p-12 border-b">
          <h2 className="text-3xl font-bold text-slate-100 mb-6">Loan Details</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-slate-100 mb-4 text-xl">Financial Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-slate-300">Original Loan Amount</span>
                  <span className="font-bold text-slate-100">${loanMetrics.originalLoanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-slate-300">Outstanding Principal</span>
                  <span className="font-bold text-slate-100">${property.outstandingDebt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-slate-300">Original Interest Rate</span>
                  <span className="font-bold text-slate-100">{loanMetrics.interestRate}% p.a.</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <span className="text-slate-300">Default Rate</span>
                  <span className="font-bold text-amber-400">{loanMetrics.defaultRate}% p.a.</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-slate-300">Loan to Value Ratio</span>
                  <span className="font-bold text-green-400">{loanMetrics.loanToValue}%</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-100 mb-4 text-xl">Default Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <span className="text-slate-300">Days in Default</span>
                  <span className="font-bold text-red-400">{loanMetrics.daysInDefault} days</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <span className="text-slate-300">Days in Arrears</span>
                  <span className="font-bold text-amber-400">{loanMetrics.daysInArrears} days</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-slate-300">Arrears Amount</span>
                  <span className="font-bold text-slate-100">$24,500</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                  <span className="text-slate-300">Missed Payments</span>
                  <span className="font-bold text-slate-100">4</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-slate-300">
                  <strong>Note:</strong> Formal default notice issued. Borrower has expressed willingness to 
                  cooperate with orderly resolution process.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-12 border-b">
          <h2 className="text-3xl font-bold text-slate-100 mb-6">Property Details</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-slate-100 mb-4">Property Features</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Type</span>
                  <span className="font-semibold text-slate-100">{property.property.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Bedrooms</span>
                  <span className="font-semibold text-slate-100">{property.property.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Bathrooms</span>
                  <span className="font-semibold text-slate-100">{property.property.bathrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Parking</span>
                  <span className="font-semibold text-slate-100">{property.property.parking}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Land Size</span>
                  <span className="font-semibold text-slate-100">{property.property.landSize} mÂ²</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-100 mb-4">Valuation</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Current Value</span>
                  <span className="font-semibold text-slate-100">${property.valuation.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Valuation Date</span>
                  <span className="font-semibold text-slate-100">{format(property.valuation.date, 'dd/MM/yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Valuer</span>
                  <span className="font-semibold text-slate-100">{property.valuation.valuerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Method</span>
                  <span className="font-semibold text-slate-100">Direct Comparison</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-100 mb-4">Location</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Suburb</span>
                  <span className="font-semibold text-slate-100">{property.property.suburb}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">State</span>
                  <span className="font-semibold text-slate-100">{property.property.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Postcode</span>
                  <span className="font-semibold text-slate-100">{property.property.postcode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">CBD Distance</span>
                  <span className="font-semibold text-slate-100">8.5 km</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="p-12 bg-white/5 border-b">
          <h2 className="text-3xl font-bold text-slate-100 mb-6">Risk Assessment</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-100 mb-2">Security Position</h3>
                  <p className="text-slate-300">First mortgage security with no secondary encumbrances. Clear title confirmed by independent legal review.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-100 mb-2">Equity Buffer</h3>
                  <p className="text-slate-300">Conservative LVR of {loanMetrics.loanToValue}% provides ${((property.valuation.amount - property.outstandingDebt) / 1000).toFixed(0)}k equity buffer against market volatility.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border-l-4 border-amber-500">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-100 mb-2">Default Status</h3>
                  <p className="text-slate-300">Property is {loanMetrics.daysInDefault} days in default. Recovery timeline estimated at 4-6 months including legal process.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-start gap-3">
                <BarChart3 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-100 mb-2">Market Conditions</h3>
                  <p className="text-slate-300">Strong demand in {property.property.suburb} with median price growth of 42% over 5 years. High liquidity for forced sale scenarios.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Due Diligence & Verification Status */}
        <div className="p-12 border-b">
          <h2 className="text-3xl font-bold text-slate-100 mb-6">Due Diligence & Verification Status</h2>
          
          <div className="space-y-8">
            {/* InfoTrack Verification Checks */}
            <div>
              <h3 className="font-bold text-slate-100 mb-4 text-xl flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-400" />
                InfoTrack Verification Checks
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border-2 ${property.documentsTracking?.titleSearchCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {property.documentsTracking?.titleSearchCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                      )}
                      <span className="font-semibold text-slate-100">Title Search</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${property.documentsTracking?.titleSearchCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-slate-300'}`}>
                      {property.documentsTracking?.titleSearchCompleted ? 'âœ“ Completed' : 'Pending'}
                    </span>
                  </div>
                  {property.documentsTracking?.titleSearchCompleted && (
                    <p className="text-xs text-slate-300 mt-2">Clean title with no adverse findings</p>
                  )}
                </div>

                <div className={`p-4 rounded-lg border-2 ${property.documentsTracking?.identityVerificationCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {property.documentsTracking?.identityVerificationCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                      )}
                      <span className="font-semibold text-slate-100">Identity Verification</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${property.documentsTracking?.identityVerificationCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-slate-300'}`}>
                      {property.documentsTracking?.identityVerificationCompleted ? 'âœ“ Completed' : 'Pending'}
                    </span>
                  </div>
                  {property.documentsTracking?.identityVerificationCompleted && (
                    <p className="text-xs text-slate-300 mt-2">Borrower identity verified via InfoTrack</p>
                  )}
                </div>

                <div className={`p-4 rounded-lg border-2 ${property.documentsTracking?.encumbranceCheckCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {property.documentsTracking?.encumbranceCheckCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                      )}
                      <span className="font-semibold text-slate-100">Encumbrance Check</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${property.documentsTracking?.encumbranceCheckCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-slate-300'}`}>
                      {property.documentsTracking?.encumbranceCheckCompleted ? 'âœ“ Completed' : 'Pending'}
                    </span>
                  </div>
                  {property.documentsTracking?.encumbranceCheckCompleted && (
                    <p className="text-xs text-slate-300 mt-2">No secondary mortgages or liens detected</p>
                  )}
                </div>

                <div className={`p-4 rounded-lg border-2 ${property.documentsTracking?.zoningCheckCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {property.documentsTracking?.zoningCheckCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                      )}
                      <span className="font-semibold text-slate-100">Zoning Check</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${property.documentsTracking?.zoningCheckCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-slate-300'}`}>
                      {property.documentsTracking?.zoningCheckCompleted ? 'âœ“ Completed' : 'Pending'}
                    </span>
                  </div>
                  {property.documentsTracking?.zoningCheckCompleted && (
                    <p className="text-xs text-slate-300 mt-2">Zoning compliant for residential use</p>
                  )}
                </div>

                <div className={`p-4 rounded-lg border-2 ${property.documentsTracking?.environmentalCheckCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {property.documentsTracking?.environmentalCheckCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                      )}
                      <span className="font-semibold text-slate-100">Environmental Check</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${property.documentsTracking?.environmentalCheckCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-slate-300'}`}>
                      {property.documentsTracking?.environmentalCheckCompleted ? 'âœ“ Completed' : 'Pending'}
                    </span>
                  </div>
                  {property.documentsTracking?.environmentalCheckCompleted && (
                    <p className="text-xs text-slate-300 mt-2">No environmental risks identified</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Verification Checks */}
            <div>
              <h3 className="font-bold text-slate-100 mb-4 text-xl flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-400" />
                Additional Verification Checks
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border-2 ${property.infoTrackChecksCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {property.infoTrackChecksCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                      )}
                      <span className="font-semibold text-slate-100">InfoTrack Suite</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${property.infoTrackChecksCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-slate-300'}`}>
                      {property.infoTrackChecksCompleted ? 'âœ“ Completed' : 'Pending'}
                    </span>
                  </div>
                  {property.infoTrackChecksCompleted && (
                    <p className="text-xs text-slate-300 mt-2">All InfoTrack checks passed successfully</p>
                  )}
                </div>

                <div className={`p-4 rounded-lg border-2 ${property.automatedChecksCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {property.automatedChecksCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                      )}
                      <span className="font-semibold text-slate-100">Automated Checks</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${property.automatedChecksCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-slate-300'}`}>
                      {property.automatedChecksCompleted ? 'âœ“ Completed' : 'Pending'}
                    </span>
                  </div>
                  {property.automatedChecksCompleted && (
                    <p className="text-xs text-slate-300 mt-2">System validation checks completed</p>
                  )}
                </div>

                <div className={`p-4 rounded-lg border-2 ${property.creditCheckCompleted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {property.creditCheckCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                      )}
                      <span className="font-semibold text-slate-100">Credit Check</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${property.creditCheckCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-slate-300'}`}>
                      {property.creditCheckCompleted ? 'âœ“ Completed' : 'Pending'}
                    </span>
                  </div>
                  {property.creditCheckCompleted && (
                    <p className="text-xs text-slate-300 mt-2">Credit assessment conducted and filed</p>
                  )}
                </div>

                <div className={`p-4 rounded-lg border-2 ${property.paymentVerified ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {property.paymentVerified ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                      )}
                      <span className="font-semibold text-slate-100">Payment Verification</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${property.paymentVerified ? 'bg-green-600 text-white' : 'bg-gray-300 text-slate-300'}`}>
                      {property.paymentVerified ? 'âœ“ Verified' : 'Pending'}
                    </span>
                  </div>
                  {property.paymentVerified && (
                    <p className="text-xs text-slate-300 mt-2">Payment history verified and documented</p>
                  )}
                </div>

                <div className={`p-4 rounded-lg border-2 ${property.borrowerDetails?.kycStatus === 'verified' ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {property.borrowerDetails?.kycStatus === 'verified' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                      )}
                      <span className="font-semibold text-slate-100">KYC Status</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${property.borrowerDetails?.kycStatus === 'verified' ? 'bg-green-600 text-white' : 'bg-amber-300 text-amber-300'}`}>
                      {property.borrowerDetails?.kycStatus === 'verified' ? 'âœ“ Verified' : property.borrowerDetails?.kycStatus || 'Pending'}
                    </span>
                  </div>
                  {property.borrowerDetails?.kycStatus === 'verified' && (
                    <p className="text-xs text-slate-300 mt-2">Borrower KYC fully verified and current</p>
                  )}
                </div>
              </div>
            </div>

            {/* Document Collection Status */}
            <div>
              <h3 className="font-bold text-slate-100 mb-4 text-xl flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-400" />
                Document Collection Status
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {/* Lender Documents */}
                <div>
                  <h4 className="font-semibold text-slate-300 mb-3 text-sm">Lender Documents</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Loan Agreement</span>
                      {property.documentsTracking?.originalLoanAgreementUploaded ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Loan Variations</span>
                      {property.documentsTracking?.loanVariationsUploaded ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Bank Statements</span>
                      {property.documentsTracking?.bankStatementsUploaded ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Payout Letter</span>
                      {property.documentsTracking?.payoutLetterUploaded ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Formal Approval</span>
                      {property.documentsTracking?.formalApprovalUploaded ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Borrower Documents */}
                <div>
                  <h4 className="font-semibold text-slate-300 mb-3 text-sm">Borrower Documents</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Borrower ID</span>
                      {property.documentsTracking?.borrowerIDUploaded ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Proof of Income</span>
                      {property.documentsTracking?.proofOfIncomeUploaded ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Financial Statements</span>
                      {property.documentsTracking?.financialStatementsUploaded ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-100 mb-3 text-sm">Completion Summary</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Overall Progress</span>
                        <span className="font-bold text-slate-100">
                          {Math.round((Object.values(property.documentsTracking || {}).filter(Boolean).length / 13) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${(Object.values(property.documentsTracking || {}).filter(Boolean).length / 13) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-xs text-slate-300">
                        <span className="font-bold text-slate-100">
                          {Object.values(property.documentsTracking || {}).filter(Boolean).length}
                        </span> of 13 documents collected
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* NCCP Compliance Status */}
            {property.nccpCompliance?.subjectToNCCP && (
              <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-lg p-6">
                <h3 className="font-bold text-slate-100 mb-3 text-xl flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-400" />
                  NCCP Compliance Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-300 mb-1">Subject to NCCP</p>
                    <p className="font-semibold text-slate-100">
                      {property.nccpCompliance.subjectToNCCP ? 'Yes' : 'No'}
                    </p>
                  </div>
                  {property.nccpCompliance.loanPurpose && (
                    <div>
                      <p className="text-sm text-slate-300 mb-1">Loan Purpose</p>
                      <p className="font-semibold text-slate-100">{property.nccpCompliance.loanPurpose}</p>
                    </div>
                  )}
                  {property.nccpCompliance.consumerOrBusinessPurpose && (
                    <div>
                      <p className="text-sm text-slate-300 mb-1">Purpose Classification</p>
                      <p className="font-semibold text-slate-100">{property.nccpCompliance.consumerOrBusinessPurpose}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-slate-300 mb-1">Pre-Contractual Disclosure</p>
                    <p className="font-semibold text-slate-100">
                      {property.nccpCompliance.preContractualDisclosureProvided ? 'âœ“ Provided' : 'Not Provided'}
                    </p>
                  </div>
                  {property.nccpCompliance.borrowerCooperation && (
                    <div>
                      <p className="text-sm text-slate-300 mb-1">Borrower Cooperation</p>
                      <p className="font-semibold text-slate-100">{property.nccpCompliance.borrowerCooperation}</p>
                    </div>
                  )}
                  {property.nccpCompliance.possessionStatus && (
                    <div>
                      <p className="text-sm text-slate-300 mb-1">Possession Status</p>
                      <p className="font-semibold text-slate-100">{property.nccpCompliance.possessionStatus}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="p-12 border-b">
          <h2 className="text-3xl font-bold text-slate-100 mb-6">Investment Terms</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-slate-100 mb-4 text-xl">Key Terms</h3>
              <div className="space-y-3 text-slate-300">
                <p><strong>Minimum Investment:</strong> Full loan acquisition or syndicated participation</p>
                <p><strong>Interest Rate:</strong> {loanMetrics.defaultRate}% p.a. (default rate)</p>
                <p><strong>Payment Frequency:</strong> Monthly in arrears</p>
                <p><strong>Loan Term:</strong> Until resolution (est. 4-6 months)</p>
                <p><strong>Security:</strong> First registered mortgage</p>
                <p><strong>Settlement:</strong> Within {loanMetrics.targetSettlement} days</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-100 mb-4 text-xl">Process</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <p className="font-semibold text-slate-100">Submit Expression of Interest</p>
                    <p className="text-sm text-slate-300">Review full data room and submit bid</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <p className="font-semibold text-slate-100">Due Diligence Period</p>
                    <p className="text-sm text-slate-300">14 days for legal and valuation review</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <p className="font-semibold text-slate-100">Legal Documentation</p>
                    <p className="text-sm text-slate-300">Execute loan assignment agreements</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <p className="font-semibold text-slate-100">Settlement</p>
                    <p className="text-sm text-slate-300">Funds transfer and mortgage registration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Disclaimer */}
        <div className="p-12 bg-gray-900 text-white">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h3 className="font-bold text-2xl mb-4">Contact Information</h3>
              <div className="space-y-3">
                <p className="text-gray-300">For further information or to arrange property inspection:</p>
                <p className="text-lg"><strong>Grow MIP Virtual MIP Platform</strong></p>
                <p className="text-gray-300">Email: investments@Grow MIP.com.au</p>
                <p className="text-gray-300">Phone: 1300 BRICK (1300 274 252)</p>
                <p className="text-gray-300">Case Number: {property.caseNumber}</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-2xl mb-4">Important Disclaimer</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                This Investment Memorandum is provided for information purposes only and does not constitute an offer, 
                invitation, or recommendation to invest. All information is provided in good faith but no warranty is given 
                as to its accuracy or completeness. Investors should conduct their own due diligence and seek independent 
                legal, tax, and financial advice before making any investment decision. Past performance is not indicative 
                of future results. Investment in distressed debt involves significant risk including potential loss of capital.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>Â© 2026 Grow MIP Pty Ltd. All rights reserved. Australian Credit Licence: XXXXXX</p>
            <p className="mt-2">Document prepared: {format(new Date(), 'dd MMMM yyyy')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

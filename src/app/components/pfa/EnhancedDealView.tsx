import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  Building2,
  Users,
  DollarSign,
  Home,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Save,
  X,
  MessageSquare,
  Calendar,
  TrendingUp,
  Shield,
  MapPin,
  Bed,
  Bath,
  Car,
  Square,
  Map,
  Image as ImageIcon,
  ExternalLink,
  Plus,
  Upload
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ComplianceChecklist } from './ComplianceChecklist';
import { EnhancedLoanDetails } from './EnhancedLoanDetails';
import { EnhancedBorrowerDetails } from './EnhancedBorrowerDetails';

interface EnhancedDealViewProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function EnhancedDealView({ onNavigate, onBack }: EnhancedDealViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [informationRequests, setInformationRequests] = useState([
    {
      id: 'REQ-001',
      type: 'document',
      recipient: 'borrower',
      subject: 'Updated Financial Statements',
      description: 'Please provide updated financial statements for FY2024, including P&L and Balance Sheet. The existing statements are from FY2023 and we need current year figures for assessment.',
      requestedBy: 'Jane Smith',
      requestedDate: '2024-02-12',
      dueDate: '2024-02-19',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 'REQ-002',
      type: 'clarification',
      recipient: 'broker',
      subject: 'Loan Purpose Clarification',
      description: 'Can you please clarify the exact use of funds? Application states "business expansion" but we need more specific details on equipment, fit-out, working capital split.',
      requestedBy: 'Jane Smith',
      requestedDate: '2024-02-11',
      dueDate: '2024-02-14',
      status: 'received',
      priority: 'medium',
      response: 'Funds breakdown: $500k equipment, $250k fit-out, $100k working capital. Equipment list attached separately.',
      responseDate: '2024-02-13'
    },
    {
      id: 'REQ-003',
      type: 'document',
      recipient: 'borrower',
      subject: 'Director ID Verification',
      description: 'Director 2 (Jane Doe) - please provide certified copy of Driver License or Passport for KYC verification.',
      requestedBy: 'Jane Smith',
      requestedDate: '2024-02-10',
      dueDate: '2024-02-17',
      status: 'received',
      priority: 'high',
      responseDate: '2024-02-12'
    }
  ]);

  // Mock deal data with comprehensive security info
  const deal = {
    id: 'APP-2024-001',
    status: 'assessment',
    submittedDate: '2024-02-10',
    priority: 'high',
    broker: {
      name: 'Sarah Johnson',
      company: 'Elite Finance Group',
      email: 'sarah.johnson@elitefinance.com.au',
      phone: '0412 345 678'
    },
    borrower: {
      type: 'Company',
      name: 'ABC Enterprises Pty Ltd',
      acn: '123 456 789',
      abn: '12 345 678 901',
      address: '123 Business St, Sydney NSW 2000',
      directors: [
        { name: 'John Smith', role: 'Director & Guarantor', email: 'john@abc.com.au', phone: '0412 111 222' },
        { name: 'Jane Doe', role: 'Director', email: 'jane@abc.com.au', phone: '0412 333 444' }
      ]
    },
    loan: {
      type: 'Commercial Mortgage',
      amount: 850000,
      term: 36,
      repaymentType: 'Principal & Interest',
      frequency: 'Monthly',
      purpose: 'Property Purchase',
      estimatedRepayment: 28450,
      interestRate: 7.5
    },
    security: {
      type: 'Commercial Property',
      address: '456 Commercial Rd, Melbourne VIC 3000',
      propertyType: 'Office Building',
      landSize: 523,
      buildingSize: 385,
      bedrooms: null,
      bathrooms: null,
      parking: 4,
      yearBuilt: 2018,
      zoning: 'Commercial 1',
      
      // Valuation
      currentValuation: 1200000,
      valuationDate: '2024-02-05',
      valuationType: 'Full Valuation',
      valuationFirm: 'McGrath Valuations',
      previousValuation: 1150000,
      previousValuationDate: '2023-08-15',
      
      // Title & Legal
      titleType: 'Torrens Title',
      lotNumber: 'Lot 12',
      planNumber: 'RP 123456',
      councilRates: 4500,
      waterRates: 1200,
      encumbrances: 'None recorded',
      
      // Location Details
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      coordinates: { lat: -37.8136, lng: 144.9631 },
      
      // Features
      features: [
        'Modern glass facade',
        'Secure basement parking',
        'NBN connected',
        'Air conditioning',
        'Lift access',
        'Modern kitchen',
        'Multiple tenancies possible',
        'High foot traffic area'
      ],
      
      // Nearby Amenities
      amenities: [
        { name: 'Melbourne Central', type: 'Transport', distance: '0.3 km' },
        { name: 'QV Melbourne', type: 'Shopping', distance: '0.5 km' },
        { name: 'Parliament Station', type: 'Transport', distance: '0.8 km' },
        { name: 'RMIT University', type: 'Education', distance: '0.4 km' }
      ],
      
      // Images
      images: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'
      ],
      
      // Tenancy
      tenancy: {
        status: 'Partially Tenanted',
        currentIncome: 85000,
        potentialIncome: 120000,
        leaseExpiry: '2025-12-31',
        tenants: [
          { name: 'TechStart Co.', area: 180, rent: 45000, leaseEnd: '2025-12-31' },
          { name: 'Vacant', area: 205, rent: 0, leaseEnd: null }
        ]
      }
    },
    financials: {
      annualRevenue: 2500000,
      ebitda: 450000,
      dscr: 1.32,
      lvr: 70.8,
      serviceability: 'Satisfactory'
    },
    documents: [
      { name: 'Financial Statements 2023.pdf', type: 'Financial', uploadedDate: '2024-02-10', size: '2.4 MB' },
      { name: 'Full Valuation Report.pdf', type: 'Valuation', uploadedDate: '2024-02-05', size: '5.2 MB' },
      { name: 'Title Search.pdf', type: 'Title', uploadedDate: '2024-02-08', size: '1.1 MB' },
      { name: 'Company Extract.pdf', type: 'Corporate', uploadedDate: '2024-02-10', size: '856 KB' },
      { name: 'Director IDs.pdf', type: 'KYC', uploadedDate: '2024-02-10', size: '1.2 MB' },
      { name: 'Property Contract.pdf', type: 'Security', uploadedDate: '2024-02-10', size: '3.8 MB' },
      { name: 'Building & Pest Report.pdf', type: 'Property', uploadedDate: '2024-02-06', size: '4.5 MB' },
      { name: 'Section 32 Statement.pdf', type: 'Legal', uploadedDate: '2024-02-07', size: '2.8 MB' }
    ],
    timeline: [
      { date: '2024-02-10', time: '09:15 AM', event: 'Application submitted by broker', user: 'Sarah Johnson' },
      { date: '2024-02-10', time: '10:30 AM', event: 'Documents uploaded', user: 'Sarah Johnson' },
      { date: '2024-02-11', time: '02:45 PM', event: 'Assigned to credit assessor', user: 'System' },
      { date: '2024-02-12', time: '11:20 AM', event: 'Credit review commenced', user: 'Michael Chen' }
    ],
    notes: [
      { date: '2024-02-12', time: '11:25 AM', user: 'Michael Chen', note: 'Strong financials. DSCR above policy minimum. Property valuation pending.' },
      { date: '2024-02-11', time: '03:00 PM', user: 'Sarah Johnson', note: 'Client keen to settle within 30 days. All documents provided.' }
    ],
    creditAssessment: {
      riskRating: 'Low',
      policyCompliance: 'Compliant',
      recommendedAction: 'Approve',
      conditions: [
        'Full valuation to be completed',
        'Updated financial statements',
        'Insurance evidence required'
      ]
    },
    verification: {
      // Company Credit Check
      companyCreditCheck: {
        status: 'Completed',
        provider: 'CreditorWatch',
        completedDate: '2024-02-11',
        score: 785,
        rating: 'Excellent',
        riskBand: 'Low',
        tradePaymentHistory: 'Satisfactory - 98% on time',
        courtActions: 'None recorded',
        defaults: 'None',
        adverseEvents: 'None',
        businessAge: '8 years 4 months',
        recommendations: 'Suitable for credit up to $1.5M'
      },
      
      // Director Credit Checks
      directorCreditChecks: [
        {
          name: 'John Smith',
          status: 'Completed',
          provider: 'Equifax',
          completedDate: '2024-02-11',
          score: 812,
          rating: 'Very Good',
          enquiries: 2,
          defaults: 'None',
          courtJudgements: 'None',
          bankruptcies: 'None',
          directorships: 3,
          yearsAtAddress: 12,
          employmentVerified: true
        },
        {
          name: 'Jane Doe',
          status: 'Completed',
          provider: 'Equifax',
          completedDate: '2024-02-11',
          score: 795,
          rating: 'Very Good',
          enquiries: 1,
          defaults: 'None',
          courtJudgements: 'None',
          bankruptcies: 'None',
          directorships: 2,
          yearsAtAddress: 8,
          employmentVerified: true
        }
      ],
      
      // Title Search
      titleSearch: {
        status: 'Completed',
        provider: 'InfoTrack',
        completedDate: '2024-02-08',
        titleReference: 'Volume 12345 Folio 678',
        registeredOwner: 'ABC Enterprises Pty Ltd (ACN 123 456 789)',
        ownershipType: 'Fee Simple',
        ownershipMatch: true,
        registeredMortgages: [
          {
            mortgagee: 'Commonwealth Bank of Australia',
            registrationDate: '2020-03-15',
            amount: 450000,
            priority: 1,
            status: 'Active',
            dischargeRequired: true
          }
        ],
        caveats: [
          {
            type: 'Personal',
            caveator: 'Jane Doe',
            lodgedDate: '2023-11-20',
            reason: 'Pending settlement - property purchase',
            priority: 'After mortgage',
            action: 'To be removed prior to settlement'
          }
        ],
        easements: [
          {
            type: 'Drainage',
            beneficiary: 'Melbourne Water',
            details: 'Stormwater drainage easement 3m wide along western boundary',
            impact: 'Minimal - does not affect building'
          }
        ],
        restrictions: 'None',
        covenants: 'Standard commercial building covenants',
        zoning: 'Commercial 1',
        zoningCompliant: true
      },
      
      // KYC Verification
      kycVerification: {
        companyVerification: {
          status: 'Verified',
          asicSearch: 'Current & Active',
          abn: '12 345 678 901',
          acn: '123 456 789',
          registeredOffice: 'Verified',
          businessNames: ['ABC Enterprises'],
          registrationDate: '2015-09-20',
          companyType: 'Australian Proprietary Company',
          abnStatus: 'Active',
          gstRegistered: true
        },
        directorVerification: [
          {
            name: 'John Smith',
            status: 'Verified',
            idType: 'Australian Passport',
            idNumber: 'PA1234567',
            idExpiry: '2028-06-15',
            idVerified: true,
            dateOfBirth: '1975-04-12',
            residentialAddress: 'Verified',
            amlScreening: 'Clear',
            pepCheck: 'Not a PEP',
            sanctionsCheck: 'Clear',
            adverseMediaCheck: 'Clear'
          },
          {
            name: 'Jane Doe',
            status: 'Verified',
            idType: 'Australian Driver License',
            idNumber: 'DL9876543',
            idExpiry: '2026-11-30',
            idVerified: true,
            dateOfBirth: '1982-08-22',
            residentialAddress: 'Verified',
            amlScreening: 'Clear',
            pepCheck: 'Not a PEP',
            sanctionsCheck: 'Clear',
            adverseMediaCheck: 'Clear'
          }
        ]
      },
      
      // AML/CTF Compliance
      amlCompliance: {
        status: 'Compliant',
        riskRating: 'Standard',
        sourceOfFunds: 'Business operating cashflow - verified',
        purposeVerified: true,
        ongoingMonitoring: 'Standard',
        pepScreening: 'Completed - Clear',
        sanctionsScreening: 'Completed - Clear',
        adverseMedia: 'Completed - Clear',
        countryRisk: 'Australia - Low Risk',
        beneficialOwners: [
          {
            name: 'John Smith',
            ownership: '60%',
            verified: true,
            pepStatus: 'Not a PEP',
            sanctionsStatus: 'Clear'
          },
          {
            name: 'Jane Doe',
            ownership: '40%',
            verified: true,
            pepStatus: 'Not a PEP',
            sanctionsStatus: 'Clear'
          }
        ]
      },
      
      // Document Verification
      documentVerification: {
        financialStatements: {
          status: 'Verified',
          audited: true,
          auditor: 'KPMG',
          period: 'FY2023',
          verified: true
        },
        bankStatements: {
          status: 'Verified',
          months: 6,
          verified: true,
          anomalies: 'None detected'
        },
        taxReturns: {
          status: 'Verified',
          years: 2,
          lodged: true,
          verified: true
        },
        insuranceCertificates: {
          status: 'Pending',
          required: ['Property Insurance', 'Public Liability', 'Business Interruption'],
          received: []
        }
      }
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'borrower', name: 'Borrower', icon: Building2 },
    { id: 'loan', name: 'Loan Details', icon: DollarSign },
    { id: 'security', name: 'Security', icon: Home },
    { id: 'verification', name: 'Verification & Compliance', icon: Shield },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'requests', name: 'Information Requests', icon: Mail },
    { id: 'timeline', name: 'Timeline', icon: Clock },
    { id: 'notes', name: 'Notes', icon: MessageSquare }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded text-sm font-medium bg-orange-100 text-orange-700">
              Credit Assessment
            </span>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? <><X className="w-4 h-4 mr-2" />Cancel</> : <><Edit className="w-4 h-4 mr-2" />Edit</>}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Application ID</p>
            <p className="font-semibold text-gray-900">{deal.id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Submitted</p>
            <p className="font-semibold text-gray-900">10 Feb 2024</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Priority</p>
            <p className="font-semibold text-red-600">High</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Days in Stage</p>
            <p className="font-semibold text-gray-900">3 days</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-600">Loan Amount</p>
          <p className="text-2xl font-bold text-gray-900">${(deal.loan.amount / 1000).toFixed(0)}K</p>
          <p className="text-xs text-green-600 mt-1">{deal.loan.term} months</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Home className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-600">Security Value</p>
          <p className="text-2xl font-bold text-gray-900">${(deal.security.currentValuation / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-600 mt-1">LVR: {deal.financials.lvr}%</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-xs text-gray-600">DSCR</p>
          <p className="text-2xl font-bold text-gray-900">{deal.financials.dscr}x</p>
          <p className="text-xs text-green-600 mt-1">Above minimum</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-xs text-gray-600">Risk Rating</p>
          <p className="text-2xl font-bold text-gray-900">{deal.creditAssessment.riskRating}</p>
          <p className="text-xs text-green-600 mt-1">Compliant</p>
        </div>
      </div>

      {/* Security Preview */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Property</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Image */}
          <div className="space-y-3">
            <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={deal.security.images[selectedImageIndex]}
                alt="Property"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {deal.security.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-16 rounded border-2 overflow-hidden ${
                    selectedImageIndex === idx ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <ImageWithFallback src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-900">{deal.security.address}</h4>
                  <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{deal.security.suburb}, {deal.security.state} {deal.security.postcode}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('security')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Full Details
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{deal.security.propertyType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4" />
                  <span>{deal.security.buildingSize}m²</span>
                </div>
                <div className="flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  <span>{deal.security.parking} spaces</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-gray-600 mb-1">Current Valuation</p>
                <p className="font-semibold text-gray-900">
                  ${deal.security.currentValuation.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{deal.security.valuationDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Loan to Value</p>
                <p className="font-semibold text-gray-900">{deal.financials.lvr}%</p>
                <p className="text-xs text-green-600">Within policy</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Tenancy Status</p>
                <p className="font-semibold text-gray-900">{deal.security.tenancy.status}</p>
                <p className="text-xs text-gray-500">${deal.security.tenancy.currentIncome.toLocaleString()}/yr</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Year Built</p>
                <p className="font-semibold text-gray-900">{deal.security.yearBuilt}</p>
                <p className="text-xs text-gray-500">{deal.security.zoning}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Assessment */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Assessment</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Risk Rating</p>
            <span className="inline-block px-3 py-1 rounded text-sm font-medium bg-green-100 text-green-700">
              {deal.creditAssessment.riskRating} Risk
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Policy Compliance</p>
            <span className="inline-block px-3 py-1 rounded text-sm font-medium bg-blue-100 text-blue-700">
              {deal.creditAssessment.policyCompliance}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Recommended Action</p>
            <span className="inline-block px-3 py-1 rounded text-sm font-medium bg-green-100 text-green-700">
              {deal.creditAssessment.recommendedAction}
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">Conditions:</p>
          <ul className="space-y-1">
            {deal.creditAssessment.conditions.map((condition, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                {condition}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      {/* Property Gallery */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Property Gallery</h3>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={deal.security.images[selectedImageIndex]}
              alt="Property"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
              {selectedImageIndex + 1} / {deal.security.images.length}
            </div>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {deal.security.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`aspect-video rounded-lg border-2 overflow-hidden transition-all ${
                  selectedImageIndex === idx ? 'border-blue-600 scale-105' : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <ImageWithFallback src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Property Information */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Property Information</h3>
          {isEditing && (
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Address */}
          <div className="col-span-2">
            <h4 className="font-semibold text-gray-900 mb-3">Address</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{deal.security.address}</p>
                  <p className="text-sm text-gray-600">{deal.security.suburb}, {deal.security.state} {deal.security.postcode}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Property Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Property Type:</span>
                <span className="font-medium text-gray-900">{deal.security.propertyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Land Size:</span>
                <span className="font-medium text-gray-900">{deal.security.landSize} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Building Size:</span>
                <span className="font-medium text-gray-900">{deal.security.buildingSize} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Parking Spaces:</span>
                <span className="font-medium text-gray-900">{deal.security.parking}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Year Built:</span>
                <span className="font-medium text-gray-900">{deal.security.yearBuilt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zoning:</span>
                <span className="font-medium text-gray-900">{deal.security.zoning}</span>
              </div>
            </div>
          </div>

          {/* Title Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Title Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Title Type:</span>
                <span className="font-medium text-gray-900">{deal.security.titleType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lot Number:</span>
                <span className="font-medium text-gray-900">{deal.security.lotNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Plan Number:</span>
                <span className="font-medium text-gray-900">{deal.security.planNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Council Rates:</span>
                <span className="font-medium text-gray-900">${deal.security.councilRates.toLocaleString()}/yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Water Rates:</span>
                <span className="font-medium text-gray-900">${deal.security.waterRates.toLocaleString()}/yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Encumbrances:</span>
                <span className="font-medium text-gray-900">{deal.security.encumbrances}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Valuation Details */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Valuation Details</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Current Valuation</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Valuation:</span>
                <span className="font-semibold text-lg text-gray-900">${deal.security.currentValuation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">{deal.security.valuationDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-900">{deal.security.valuationType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valuer:</span>
                <span className="font-medium text-gray-900">{deal.security.valuationFirm}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Previous Valuation</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Valuation:</span>
                <span className="font-medium text-gray-900">${deal.security.previousValuation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">{deal.security.previousValuationDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Change:</span>
                <span className="font-medium text-green-600">
                  +${(deal.security.currentValuation - deal.security.previousValuation).toLocaleString()} 
                  ({(((deal.security.currentValuation - deal.security.previousValuation) / deal.security.previousValuation) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Map */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Map</h3>
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Map className="w-12 h-12 mx-auto mb-2" />
            <p>Interactive map would be embedded here</p>
            <p className="text-sm mt-1">Coordinates: {deal.security.coordinates.lat}, {deal.security.coordinates.lng}</p>
          </div>
        </div>
      </div>

      {/* Nearby Amenities */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Amenities</h3>
        <div className="grid grid-cols-2 gap-4">
          {deal.security.amenities.map((amenity, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{amenity.name}</p>
                <p className="text-xs text-gray-600">{amenity.type}</p>
              </div>
              <span className="text-sm text-gray-600">{amenity.distance}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Property Features */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Features</h3>
        <div className="grid grid-cols-3 gap-3">
          {deal.security.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600" />
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Tenancy Information */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenancy Information</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Status</p>
            <p className="font-semibold text-gray-900">{deal.security.tenancy.status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Current Income</p>
            <p className="font-semibold text-gray-900">${deal.security.tenancy.currentIncome.toLocaleString()}/yr</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Potential Income</p>
            <p className="font-semibold text-green-600">${deal.security.tenancy.potentialIncome.toLocaleString()}/yr</p>
          </div>
        </div>
        
        <h4 className="font-medium text-gray-900 mb-3">Tenant Details</h4>
        <div className="space-y-2">
          {deal.security.tenancy.tenants.map((tenant, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{tenant.name}</p>
                <p className="text-sm text-gray-600">{tenant.area} m²</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {tenant.rent > 0 ? `$${tenant.rent.toLocaleString()}/yr` : 'Vacant'}
                </p>
                {tenant.leaseEnd && (
                  <p className="text-xs text-gray-600">Lease ends: {tenant.leaseEnd}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBorrower = () => <EnhancedBorrowerDetails deal={deal} />;

  const renderLoan = () => <EnhancedLoanDetails deal={deal} />;

  const renderDocuments = () => (
    <div className="bg-white border border-gray-300 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
        <Button variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>
      <div className="space-y-2">
        {deal.documents.map((doc, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">{doc.name}</p>
                <p className="text-xs text-gray-600">{doc.type} • {doc.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">{doc.uploadedDate}</span>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="bg-white border border-gray-300 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
      <div className="space-y-4">
        {deal.timeline.map((item, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              {idx < deal.timeline.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1"></div>}
            </div>
            <div className="flex-1 pb-4">
              <p className="font-medium text-gray-900">{item.event}</p>
              <p className="text-sm text-gray-600">{item.user}</p>
              <p className="text-xs text-gray-500">{item.date} at {item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInformationRequests = () => (
    <div className="space-y-6">
      {/* Header with New Request Button */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Information Requests</h3>
            <p className="text-sm text-gray-600 mt-1">Request additional information from borrower or broker</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowNewRequestModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-700 mb-1">Pending Responses</p>
            <p className="text-2xl font-bold text-orange-900">
              {informationRequests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 mb-1">Received</p>
            <p className="text-2xl font-bold text-green-900">
              {informationRequests.filter(r => r.status === 'received').length}
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-blue-900">{informationRequests.length}</p>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {informationRequests.map((request) => (
            <div key={request.id} className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{request.subject}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      request.status === 'pending' 
                        ? 'bg-orange-100 text-orange-700' 
                        : request.status === 'received'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {request.status === 'pending' ? 'Awaiting Response' : 'Response Received'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      request.priority === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : request.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {request.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      To: <strong className="text-gray-900 capitalize">{request.recipient}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Type: <strong className="text-gray-900 capitalize">{request.type}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      By: {request.requestedBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due: {request.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {request.description}
                </p>
              </div>

              {request.status === 'received' && request.response && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-medium text-green-700">Response Received on {request.responseDate}</p>
                  </div>
                  <p className="text-sm text-gray-700 bg-green-50 p-3 rounded border border-green-200">
                    {request.response}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                {request.status === 'pending' && (
                  <>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Reminder
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Request
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Comment
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">New Information Request</h3>
                <button onClick={() => setShowNewRequestModal(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Send To *</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="borrower">Borrower (via Portal)</option>
                  <option value="broker">Broker</option>
                  <option value="both">Both Borrower & Broker</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Request Type *</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="document">Document Request</option>
                  <option value="clarification">Clarification</option>
                  <option value="amendment">Application Amendment</option>
                  <option value="verification">Verification</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="high">High - Urgent</option>
                  <option value="medium">Medium - Standard</option>
                  <option value="low">Low - Non-urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  placeholder="e.g., Updated Bank Statements Required"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</label>
                <textarea
                  rows={6}
                  placeholder="Provide detailed information about what you need and why..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This request will be sent via email and will also appear in the Borrower Portal 
                  for the borrower to respond to directly.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setShowNewRequestModal(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  // Add new request logic here
                  setShowNewRequestModal(false);
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderNotes = () => (
    <div className="bg-white border border-gray-300 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Notes & Comments</h3>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      </div>
      <div className="space-y-4">
        {deal.notes.map((note, idx) => (
          <div key={idx} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-900">{note.user}</p>
              <p className="text-xs text-gray-500">{note.date} at {note.time}</p>
            </div>
            <p className="text-sm text-gray-700">{note.note}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      {/* Compliance Checklist */}
      <ComplianceChecklist />

      {/* Company Credit Check */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Credit Check</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Status</p>
            <p className="font-semibold text-gray-900">{deal.verification.companyCreditCheck.status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Provider</p>
            <p className="font-semibold text-gray-900">{deal.verification.companyCreditCheck.provider}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Completed Date</p>
            <p className="font-semibold text-gray-900">{deal.verification.companyCreditCheck.completedDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Score</p>
            <p className="font-semibold text-gray-900">{deal.verification.companyCreditCheck.score}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Rating</p>
            <p className="font-semibold text-gray-900">{deal.verification.companyCreditCheck.rating}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Risk Band</p>
            <p className="font-semibold text-gray-900">{deal.verification.companyCreditCheck.riskBand}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Trade Payment History</p>
            <p className="font-semibold text-gray-900">{deal.verification.companyCreditCheck.tradePaymentHistory}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Court Actions</p>
            <p className="font-semibold text-gray-900">{deal.verification.companyCreditCheck.courtActions}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Defaults</p>
            <p className="font-semibold text-gray-900">{deal.verification.companyCreditCheck.defaults}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Adverse Events</p>
            <p className="font-semibold text-gray-900">{deal.verification.companyCreditCheck.adverseEvents}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Business Age</p>
            <p className="font-semibold text-gray-900">{deal.verification.companyCreditCheck.businessAge}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Recommendations</p>
            <p className="font-semibold text-gray-900">{deal.verification.companyCreditCheck.recommendations}</p>
          </div>
        </div>
      </div>

      {/* Director Credit Checks */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Director Credit Checks</h3>
        <div className="space-y-3">
          {deal.verification.directorCreditChecks.map((director, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">{director.name}</p>
                <p className="text-sm text-gray-600">{director.role}</p>
              </div>
              <div className="flex items-center gap-3">
                <a href={`mailto:${director.email}`} className="text-blue-600 hover:underline text-sm">
                  {director.email}
                </a>
                <a href={`tel:${director.phone}`} className="text-blue-600 hover:underline text-sm">
                  {director.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Title Search */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Title Search</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Status</p>
            <p className="font-semibold text-gray-900">{deal.verification.titleSearch.status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Provider</p>
            <p className="font-semibold text-gray-900">{deal.verification.titleSearch.provider}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Completed Date</p>
            <p className="font-semibold text-gray-900">{deal.verification.titleSearch.completedDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Title Reference</p>
            <p className="font-semibold text-gray-900">{deal.verification.titleSearch.titleReference}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Registered Owner</p>
            <p className="font-semibold text-gray-900">{deal.verification.titleSearch.registeredOwner}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Ownership Type</p>
            <p className="font-semibold text-gray-900">{deal.verification.titleSearch.ownershipType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Ownership Match</p>
            <p className="font-semibold text-gray-900">{deal.verification.titleSearch.ownershipMatch ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Registered Mortgages</p>
            <ul className="space-y-1">
              {deal.verification.titleSearch.registeredMortgages.map((mortgage, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  {mortgage.mortgagee} - ${mortgage.amount.toLocaleString()} - {mortgage.status}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Caveats</p>
            <ul className="space-y-1">
              {deal.verification.titleSearch.caveats.map((caveat, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  {caveat.caveator} - {caveat.reason} - {caveat.priority}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Easements</p>
            <ul className="space-y-1">
              {deal.verification.titleSearch.easements.map((easement, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  {easement.beneficiary} - {easement.details} - {easement.impact}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Restrictions</p>
            <p className="font-semibold text-gray-900">{deal.verification.titleSearch.restrictions}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Covenants</p>
            <p className="font-semibold text-gray-900">{deal.verification.titleSearch.covenants}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Zoning</p>
            <p className="font-semibold text-gray-900">{deal.verification.titleSearch.zoning}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Zoning Compliant</p>
            <p className="font-semibold text-gray-900">{deal.verification.titleSearch.zoningCompliant ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      {/* KYC Verification */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Verification</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Status</p>
            <p className="font-semibold text-gray-900">{deal.verification.kycVerification.companyVerification.status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">ASIC Search</p>
            <p className="font-semibold text-gray-900">{deal.verification.kycVerification.companyVerification.asicSearch}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">ABN</p>
            <p className="font-semibold text-gray-900">{deal.verification.kycVerification.companyVerification.abn}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">ACN</p>
            <p className="font-semibold text-gray-900">{deal.verification.kycVerification.companyVerification.acn}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Registered Office</p>
            <p className="font-semibold text-gray-900">{deal.verification.kycVerification.companyVerification.registeredOffice ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Business Names</p>
            <ul className="space-y-1">
              {deal.verification.kycVerification.companyVerification.businessNames.map((name, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Registration Date</p>
            <p className="font-semibold text-gray-900">{deal.verification.kycVerification.companyVerification.registrationDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Company Type</p>
            <p className="font-semibold text-gray-900">{deal.verification.kycVerification.companyVerification.companyType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">ABN Status</p>
            <p className="font-semibold text-gray-900">{deal.verification.kycVerification.companyVerification.abnStatus}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">GST Registered</p>
            <p className="font-semibold text-gray-900">{deal.verification.kycVerification.companyVerification.gstRegistered ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Director Verification</p>
            <ul className="space-y-1">
              {deal.verification.kycVerification.directorVerification.map((director, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  {director.name} - {director.idType} - {director.idNumber}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* AML/CTF Compliance */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AML/CTF Compliance</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Status</p>
            <p className="font-semibold text-gray-900">{deal.verification.amlCompliance.status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Risk Rating</p>
            <p className="font-semibold text-gray-900">{deal.verification.amlCompliance.riskRating}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Source of Funds</p>
            <p className="font-semibold text-gray-900">{deal.verification.amlCompliance.sourceOfFunds}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Purpose Verified</p>
            <p className="font-semibold text-gray-900">{deal.verification.amlCompliance.purposeVerified ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Ongoing Monitoring</p>
            <p className="font-semibold text-gray-900">{deal.verification.amlCompliance.ongoingMonitoring}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">PEP Screening</p>
            <p className="font-semibold text-gray-900">{deal.verification.amlCompliance.pepScreening}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Sanctions Screening</p>
            <p className="font-semibold text-gray-900">{deal.verification.amlCompliance.sanctionsScreening}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Adverse Media</p>
            <p className="font-semibold text-gray-900">{deal.verification.amlCompliance.adverseMedia}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Country Risk</p>
            <p className="font-semibold text-gray-900">{deal.verification.amlCompliance.countryRisk}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Beneficial Owners</p>
            <ul className="space-y-1">
              {deal.verification.amlCompliance.beneficialOwners.map((owner, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  {owner.name} - {owner.ownership} - {owner.verified ? 'Yes' : 'No'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Document Verification */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Verification</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Financial Statements</p>
            <p className="font-semibold text-gray-900">{deal.verification.documentVerification.financialStatements.status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Audited</p>
            <p className="font-semibold text-gray-900">{deal.verification.documentVerification.financialStatements.audited ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Auditor</p>
            <p className="font-semibold text-gray-900">{deal.verification.documentVerification.financialStatements.auditor}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Period</p>
            <p className="font-semibold text-gray-900">{deal.verification.documentVerification.financialStatements.period}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Verified</p>
            <p className="font-semibold text-gray-900">{deal.verification.documentVerification.financialStatements.verified ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Bank Statements</p>
            <p className="font-semibold text-gray-900">{deal.verification.documentVerification.bankStatements.status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Months</p>
            <p className="font-semibold text-gray-900">{deal.verification.documentVerification.bankStatements.months}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Verified</p>
            <p className="font-semibold text-gray-900">{deal.verification.documentVerification.bankStatements.verified ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Anomalies</p>
            <p className="font-semibold text-gray-900">{deal.verification.documentVerification.bankStatements.anomalies}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Tax Returns</p>
            <p className="font-semibold text-gray-900">{deal.verification.documentVerification.taxReturns.status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Years</p>
            <p className="font-semibold text-gray-900">{deal.verification.documentVerification.taxReturns.years}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Lodged</p>
            <p className="font-semibold text-gray-900">{deal.verification.documentVerification.taxReturns.lodged ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Verified</p>
            <p className="font-semibold text-gray-900">{deal.verification.documentVerification.taxReturns.verified ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Insurance Certificates</p>
            <p className="font-semibold text-gray-900">{deal.verification.documentVerification.insuranceCertificates.status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Required</p>
            <ul className="space-y-1">
              {deal.verification.documentVerification.insuranceCertificates.required.map((cert, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  {cert}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Received</p>
            <ul className="space-y-1">
              {deal.verification.documentVerification.insuranceCertificates.received.map((cert, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'borrower':
        return renderBorrower();
      case 'loan':
        return renderLoan();
      case 'security':
        return renderSecurity();
      case 'verification':
        return renderVerification();
      case 'documents':
        return renderDocuments();
      case 'requests':
        return renderInformationRequests();
      case 'timeline':
        return renderTimeline();
      case 'notes':
        return renderNotes();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Application Review</h1>
            <p className="text-gray-600 text-sm">{deal.id} • {deal.broker.company}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onNavigate?.('borrower-portal')}>
              <Users className="w-4 h-4 mr-2" />
              Send Portal Link
            </Button>
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
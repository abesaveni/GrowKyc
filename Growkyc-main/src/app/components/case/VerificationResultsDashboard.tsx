import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Users,
  Home,
  FileText,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Building2,
  MapPin,
  Calendar,
  TrendingUp,
  CreditCard,
  Flag,
  Search,
  Database,
  Upload,
  Clock,
  CheckSquare,
  FileCheck,
  Briefcase
} from 'lucide-react';
import { Button } from '../ui/button';

interface VerificationResultsDashboardProps {
  formData: any;
  directors: any[];
  shareholders: any[];
  trustees: any[];
  guarantors: any[];
}

export function VerificationResultsDashboard({ 
  formData, 
  directors,
  shareholders,
  trustees,
  guarantors
}: VerificationResultsDashboardProps) {
  
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    asicResults: true,
    infoTrackIdentity: true,
    infoTrackAML: true,
    infoTrackCredit: true,
    documentVerification: true,
    crossCheck: true,
    complianceStatus: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Extract borrower data
  const borrowerData = {
    name: `${formData.borrowerFirstName || 'John'} ${formData.borrowerLastName || 'Smith'}`,
    dob: formData.borrowerDOB || '1985-03-15',
    email: formData.borrowerEmail || 'john.smith@email.com',
    phone: formData.borrowerPhone || '0412 345 678',
    address: formData.borrowerResidentialAddress || '456 Residential Street, Sydney NSW 2000'
  };

  // Mock ASIC data
  const asicData = {
    companyName: formData.companyName || 'Example Pty Ltd',
    abn: '12 345 678 901',
    acn: '123 456 789',
    registrationDate: '2015-03-15',
    companyType: 'Australian Proprietary Company',
    status: 'Registered',
    regulator: 'ASIC',
    lastUpdated: '2024-02-15',
    principalActivity: 'Investment and Property Development',
    directors: directors.length > 0 ? directors : [
      { name: 'John Smith', appointedDate: '2015-03-15', currentStatus: 'Active' },
      { name: 'Jane Doe', appointedDate: '2018-06-20', currentStatus: 'Active' }
    ],
    shareholders: shareholders.length > 0 ? shareholders : [
      { name: 'John Smith', shares: 500, percentage: 50 },
      { name: 'Jane Doe', shares: 500, percentage: 50 }
    ],
    registeredOffice: '123 Business Street, Sydney NSW 2000',
    abnStatus: 'Active',
    gstRegistered: true,
    asicChecks: {
      abnLookup: { status: 'verified', timestamp: '2024-02-15 10:32:15' },
      acnLookup: { status: 'verified', timestamp: '2024-02-15 10:32:16' },
      companyExtract: { status: 'verified', timestamp: '2024-02-15 10:32:18' },
      directorsSearch: { status: 'verified', timestamp: '2024-02-15 10:32:20' },
      documentsSearch: { status: 'verified', timestamp: '2024-02-15 10:32:22' }
    }
  };

  // Mock InfoTrack identity verification
  const infoTrackIdentity = {
    provider: 'InfoTrack GreenID',
    verificationId: 'GT-2024-0215-A47B3',
    timestamp: '2024-02-15 10:35:42',
    overallResult: 'VERIFIED',
    greenIDScore: 100,
    verificationLevel: '100 Point Check Passed',
    documentsVerified: [
      { type: 'Driver License', state: 'NSW', number: 'DL-****7890', status: 'Verified', confidence: 100 },
      { type: 'Medicare Card', number: 'MC-****1234', status: 'Verified', confidence: 98 },
      { type: 'Bank Account', institution: 'Commonwealth Bank', status: 'Verified', confidence: 100 }
    ],
    databaseChecks: [
      { source: 'NSW Roads & Maritime', status: 'Match', confidence: 100 },
      { source: 'Medicare Australia', status: 'Match', confidence: 98 },
      { source: 'Australian Electoral Roll', status: 'Match', confidence: 95 },
      { source: 'Centrelink', status: 'Match', confidence: 92 }
    ],
    addressVerification: {
      current: borrowerData.address,
      status: 'Verified',
      residency: '5+ years',
      sources: ['Electoral Roll', 'Utility Bills', 'Bank Records']
    },
    biometricChecks: {
      facialRecognition: { status: 'Passed', confidence: 97 },
      livenessDetection: { status: 'Passed', confidence: 99 },
      documentAuthenticity: { status: 'Passed', confidence: 96 }
    }
  };

  // Mock InfoTrack AML/CTF screening
  const infoTrackAML = {
    provider: 'InfoTrack WorldCheck',
    screeningId: 'WC-2024-0215-K89M2',
    timestamp: '2024-02-15 10:38:15',
    overallResult: 'CLEAR',
    riskLevel: 'LOW',
    sanctionsScreening: {
      dfatSanctions: { matches: 0, status: 'CLEAR' },
      unConsolidatedList: { matches: 0, status: 'CLEAR' },
      ofacSDN: { matches: 0, status: 'CLEAR' },
      euSanctions: { matches: 0, status: 'CLEAR' },
      ukSanctions: { matches: 0, status: 'CLEAR' },
      ausSanctions: { matches: 0, status: 'CLEAR' }
    },
    pepScreening: {
      domesticPEP: { matches: 0, status: 'CLEAR' },
      foreignPEP: { matches: 0, status: 'CLEAR' },
      pepAssociates: { matches: 0, status: 'CLEAR' },
      pepFamily: { matches: 0, status: 'CLEAR' }
    },
    adverseMedia: {
      financialCrime: { articles: 0, status: 'CLEAR' },
      fraud: { articles: 0, status: 'CLEAR' },
      moneyLaundering: { articles: 0, status: 'CLEAR' },
      terrorismFinancing: { articles: 0, status: 'CLEAR' },
      corruption: { articles: 0, status: 'CLEAR' }
    },
    watchlistScreening: {
      australianCriminalWatch: { matches: 0, status: 'CLEAR' },
      interpol: { matches: 0, status: 'CLEAR' },
      financialIntelligence: { matches: 0, status: 'CLEAR' }
    },
    sourceOfFunds: {
      declared: 'Employment Income',
      verified: true,
      supporting: ['Pay Slips', 'Bank Statements', 'Tax Returns']
    },
    sourceOfWealth: {
      declared: 'Career Earnings & Property Investment',
      verified: true,
      supporting: ['Employment History', 'Asset Declarations']
    }
  };

  // Mock InfoTrack credit check
  const infoTrackCredit = {
    provider: 'InfoTrack Credit Bureau (Equifax)',
    reportId: 'EQ-2024-0215-P45T8',
    timestamp: '2024-02-15 10:40:28',
    creditScore: 742,
    scoreRange: '0-1000',
    scoreBand: 'Very Good (661-734)',
    paymentHistory: {
      onTimePayments: '100%',
      latePayments: 0,
      defaults: 0,
      judgements: 0
    },
    creditAccounts: {
      total: 5,
      active: 3,
      closed: 2,
      inDefault: 0
    },
    creditEnquiries: {
      last12Months: 2,
      last24Months: 5,
      status: 'Normal'
    },
    publicRecords: {
      bankruptcies: 0,
      partIXAgreements: 0,
      partXAgreements: 0,
      courtJudgements: 0,
      writs: 0
    },
    creditUtilization: '28%',
    totalCreditLimit: 85000,
    totalBalance: 23800,
    creditHistory: '12+ years',
    adverseEvents: 0,
    riskAssessment: 'LOW RISK'
  };

  // Mock document verification
  const documentVerification = {
    totalDocuments: 12,
    verified: 12,
    pending: 0,
    failed: 0,
    documents: [
      {
        category: 'Identity Documents',
        items: [
          { name: 'Driver License (Front)', uploaded: true, verified: true, source: 'InfoTrack', matchStatus: 'Exact Match' },
          { name: 'Driver License (Back)', uploaded: true, verified: true, source: 'InfoTrack', matchStatus: 'Exact Match' },
          { name: 'Medicare Card', uploaded: true, verified: true, source: 'InfoTrack', matchStatus: 'Exact Match' }
        ]
      },
      {
        category: 'Address Verification',
        items: [
          { name: 'Utility Bill (Electricity)', uploaded: true, verified: true, source: 'Manual Review', matchStatus: 'Address Confirmed' },
          { name: 'Bank Statement', uploaded: true, verified: true, source: 'Manual Review', matchStatus: 'Address Confirmed' }
        ]
      },
      {
        category: 'Financial Documents',
        items: [
          { name: 'Bank Statements (6 months)', uploaded: true, verified: true, source: 'Manual Review', matchStatus: 'Verified' },
          { name: 'Pay Slips (3 months)', uploaded: true, verified: true, source: 'Manual Review', matchStatus: 'Verified' },
          { name: 'Tax Return (Previous Year)', uploaded: true, verified: true, source: 'Manual Review', matchStatus: 'Verified' }
        ]
      },
      {
        category: 'Company Documents (if applicable)',
        items: [
          { name: 'ABN Registration Certificate', uploaded: true, verified: true, source: 'ASIC', matchStatus: 'Cross-Verified with ASIC' },
          { name: 'ASIC Company Extract', uploaded: true, verified: true, source: 'ASIC', matchStatus: 'Auto-Generated' },
          { name: 'Trust Deed', uploaded: true, verified: true, source: 'Manual Review', matchStatus: 'Legal Review Complete' },
          { name: 'Financial Statements', uploaded: true, verified: true, source: 'Manual Review', matchStatus: 'Verified' }
        ]
      }
    ]
  };

  // Mock cross-check results
  const crossCheckResults = {
    overallStatus: 'ALL CHECKS PASSED',
    checks: [
      {
        check: 'Name Verification',
        description: 'Borrower name matches across ASIC, InfoTrack, and uploaded documents',
        status: 'PASS',
        sources: ['ASIC Company Extract', 'InfoTrack GreenID', 'Driver License', 'Medicare Card'],
        confidence: 100
      },
      {
        check: 'Address Verification',
        description: 'Residential address consistent across all sources',
        status: 'PASS',
        sources: ['Driver License', 'Electoral Roll', 'Utility Bills', 'Bank Statements'],
        confidence: 98
      },
      {
        check: 'Date of Birth Verification',
        description: 'DOB matches across government databases and ID documents',
        status: 'PASS',
        sources: ['InfoTrack GreenID', 'Driver License', 'Medicare Card'],
        confidence: 100
      },
      {
        check: 'Company Details Verification',
        description: 'ABN/ACN matches between ASIC records and uploaded certificates',
        status: 'PASS',
        sources: ['ASIC ABN Lookup', 'ASIC Company Extract', 'ABN Certificate'],
        confidence: 100
      },
      {
        check: 'Director Details Verification',
        description: 'Directors match between ASIC records and application',
        status: 'PASS',
        sources: ['ASIC Director Search', 'Company Extract', 'Director IDs'],
        confidence: 100
      },
      {
        check: 'Financial Capacity Verification',
        description: 'Income and asset declarations match supporting documents',
        status: 'PASS',
        sources: ['Pay Slips', 'Bank Statements', 'Tax Returns', 'Credit Report'],
        confidence: 95
      },
      {
        check: 'Document Authenticity',
        description: 'All uploaded documents pass authenticity checks',
        status: 'PASS',
        sources: ['InfoTrack Document Verification', 'OCR Analysis', 'Metadata Analysis'],
        confidence: 97
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300">
          <Shield className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-100">Comprehensive Verification Results Dashboard</h2>
          <p className="text-slate-300 text-sm">
            Integrated data from ASIC, InfoTrack, and uploaded documents with cross-verification
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border-2 border-green-300 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm font-bold text-green-300">ALL VERIFIED</span>
        </div>
      </div>

      {/* OVERVIEW - Quick Summary */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
        <CardHeader 
          className="cursor-pointer hover:bg-green-500/15 transition-colors"
          onClick={() => toggleSection('overview')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-6 h-6 text-green-400" />
              <div>
                <CardTitle className="text-xl">Verification Overview</CardTitle>
                <p className="text-sm text-slate-300 mt-1">Summary of all verification sources</p>
              </div>
            </div>
            {expandedSections.overview ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </CardHeader>
        {expandedSections.overview && (
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-lg border-2 border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-semibold text-slate-300">ASIC</span>
                </div>
                <div className="text-2xl font-bold text-green-400 mb-1">5/5</div>
                <div className="text-xs text-slate-300">Checks Passed</div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border-2 border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-semibold text-slate-300">InfoTrack</span>
                </div>
                <div className="text-2xl font-bold text-green-400 mb-1">3/3</div>
                <div className="text-xs text-slate-300">Services Verified</div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border-2 border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <FileCheck className="w-5 h-5 text-orange-400" />
                  <span className="text-sm font-semibold text-slate-300">Documents</span>
                </div>
                <div className="text-2xl font-bold text-green-400 mb-1">12/12</div>
                <div className="text-xs text-slate-300">Verified</div>
              </div>
              
              <div className="p-4 bg-white rounded-lg border-2 border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-semibold text-slate-300">Cross-Check</span>
                </div>
                <div className="text-2xl font-bold text-green-400 mb-1">7/7</div>
                <div className="text-xs text-slate-300">Matched</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-white/10">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-green-300 mb-2">✅ All Verifications Complete</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    All third-party verification checks have been completed successfully. Data from ASIC, 
                    InfoTrack (GreenID, WorldCheck, Credit Bureau) has been gathered, cross-checked with uploaded 
                    documents, and verified. No discrepancies or adverse findings identified. Ready for final review.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ASIC VERIFICATION RESULTS */}
      <Card className="border-2 border-purple-300">
        <CardHeader 
          className="cursor-pointer bg-purple-500/10 hover:bg-purple-500/15 transition-colors"
          onClick={() => toggleSection('asicResults')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-purple-400" />
              <div>
                <CardTitle className="text-lg">1. ASIC Verification Results</CardTitle>
                <p className="text-xs text-slate-300 mt-1">
                  Australian Securities and Investments Commission - Company & Entity Verification
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded-full">
                5/5 VERIFIED
              </span>
              {expandedSections.asicResults ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.asicResults && (
          <CardContent className="p-6 space-y-4">
            {/* Company Details */}
            <div className="p-4 bg-purple-500/10 rounded-lg border-2 border-purple-500/30">
              <h4 className="font-bold text-purple-300 mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company/Entity Details
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-300 mb-1">Company Name</p>
                  <p className="font-bold text-slate-100">{asicData.companyName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-300 mb-1">ABN</p>
                  <p className="font-mono text-slate-100">{asicData.abn}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-300 mb-1">ACN</p>
                  <p className="font-mono text-slate-100">{asicData.acn}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-300 mb-1">Company Type</p>
                  <p className="text-sm text-slate-100">{asicData.companyType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-300 mb-1">Registration Date</p>
                  <p className="text-sm text-slate-100">{new Date(asicData.registrationDate).toLocaleDateString('en-AU')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-300 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-bold text-green-400">{asicData.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ASIC Checks Performed */}
            <div className="p-4 bg-white rounded-lg border border-white/10">
              <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                ASIC Database Checks
              </h4>
              <div className="space-y-2">
                {Object.entries(asicData.asicChecks).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-slate-100">
                        {key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{value.timestamp}</span>
                      <span className="px-2 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded">
                        {value.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Directors */}
            {asicData.directors.length > 0 && (
              <div className="p-4 bg-white rounded-lg border border-white/10">
                <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  Directors (ASIC Verified)
                </h4>
                <div className="space-y-2">
                  {asicData.directors.map((director, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-blue-500/10 rounded border border-blue-500/30">
                      <div>
                        <p className="font-medium text-slate-100">{director.name}</p>
                        <p className="text-xs text-slate-300">
                          Appointed: {new Date(director.appointedDate).toLocaleDateString('en-AU')}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded">
                        {director.currentStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shareholders */}
            {asicData.shareholders.length > 0 && (
              <div className="p-4 bg-white rounded-lg border border-white/10">
                <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  Shareholders (ASIC Verified)
                </h4>
                <div className="space-y-2">
                  {asicData.shareholders.map((shareholder, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-green-500/10 rounded border border-green-500/30">
                      <div>
                        <p className="font-medium text-slate-100">{shareholder.name}</p>
                        <p className="text-xs text-slate-300">{shareholder.shares} shares</p>
                      </div>
                      <span className="px-2 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded">
                        {shareholder.percentage}% ownership
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download ASIC Company Extract
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                View Full ASIC Records
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* INFOTRACK IDENTITY VERIFICATION */}
      <Card className="border-2 border-blue-300">
        <CardHeader 
          className="cursor-pointer bg-blue-500/10 hover:bg-blue-500/15 transition-colors"
          onClick={() => toggleSection('infoTrackIdentity')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-blue-400" />
              <div>
                <CardTitle className="text-lg">2. InfoTrack Identity Verification (GreenID)</CardTitle>
                <p className="text-xs text-slate-300 mt-1">
                  100-Point ID Check with Government Database Cross-Verification • {borrowerData.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded-full">
                VERIFIED 100/100
              </span>
              {expandedSections.infoTrackIdentity ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.infoTrackIdentity && (
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-500/10 rounded-lg border-2 border-blue-500/30 text-center">
                <p className="text-xs text-slate-300 mb-2">GreenID Verification Score</p>
                <p className="text-4xl font-bold text-blue-400">{infoTrackIdentity.greenIDScore}/100</p>
                <p className="text-sm font-bold text-blue-300 mt-2">{infoTrackIdentity.verificationLevel}</p>
              </div>
              <div className="p-4 bg-white/5 rounded border border-white/10">
                <p className="text-xs text-slate-300 mb-2 font-semibold">Verification Details</p>
                <p className="text-xs text-slate-300 mb-1">
                  <span className="font-semibold">ID:</span> {infoTrackIdentity.verificationId}
                </p>
                <p className="text-xs text-slate-300 mb-1">
                  <span className="font-semibold">Timestamp:</span> {infoTrackIdentity.timestamp}
                </p>
                <p className="text-xs text-slate-300">
                  <span className="font-semibold">Provider:</span> {infoTrackIdentity.provider}
                </p>
              </div>
            </div>

            {/* Documents Verified */}
            <div className="p-4 bg-white rounded-lg border border-white/10">
              <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Identity Documents Verified
              </h4>
              <div className="space-y-2">
                {infoTrackIdentity.documentsVerified.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-blue-500/10 rounded border border-blue-500/30">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-100">{doc.type}</p>
                        <p className="text-xs text-slate-300">{doc.number || `${doc.state || ''}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-300">{doc.confidence}%</span>
                      <span className="px-2 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded">
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Database Cross-Checks */}
            <div className="p-4 bg-white rounded-lg border border-white/10">
              <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-green-400" />
                Government Database Cross-Verification
              </h4>
              <div className="grid md:grid-cols-2 gap-2">
                {infoTrackIdentity.databaseChecks.map((check, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-green-500/10 rounded border border-green-500/30">
                    <div>
                      <p className="text-sm font-medium text-slate-100">{check.source}</p>
                      <p className="text-xs text-slate-300">{check.confidence}% confidence</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Biometric Checks */}
            <div className="p-4 bg-white rounded-lg border border-white/10">
              <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Biometric & Document Authenticity Checks
              </h4>
              <div className="grid md:grid-cols-3 gap-3">
                {Object.entries(infoTrackIdentity.biometricChecks).map(([key, value]: [string, any]) => (
                  <div key={key} className="p-3 bg-purple-500/10 rounded border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-semibold text-slate-100">
                        {key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">Confidence: {value.confidence}%</p>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download GreenID Verification Report
            </Button>
          </CardContent>
        )}
      </Card>

      {/* INFOTRACK AML/CTF SCREENING */}
      <Card className="border-2 border-red-300">
        <CardHeader 
          className="cursor-pointer bg-red-500/10 hover:bg-red-500/15 transition-colors"
          onClick={() => toggleSection('infoTrackAML')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-red-400" />
              <div>
                <CardTitle className="text-lg">3. InfoTrack AML/CTF Screening (WorldCheck)</CardTitle>
                <p className="text-xs text-slate-300 mt-1">
                  AUSTRAC Compliance - Sanctions, PEP, Adverse Media & Watchlist Screening
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded-full">
                CLEAR - LOW RISK
              </span>
              {expandedSections.infoTrackAML ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.infoTrackAML && (
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-500/10 rounded-lg border-2 border-green-300 text-center">
                <p className="text-xs text-slate-300 mb-2">Overall Result</p>
                <p className="text-2xl font-bold text-green-400">{infoTrackAML.overallResult}</p>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg border-2 border-green-300 text-center">
                <p className="text-xs text-slate-300 mb-2">Risk Level</p>
                <p className="text-2xl font-bold text-green-400">{infoTrackAML.riskLevel}</p>
              </div>
              <div className="p-4 bg-white/5 rounded border border-white/10">
                <p className="text-xs text-slate-300 mb-1">Screening ID</p>
                <p className="text-xs font-mono text-slate-100">{infoTrackAML.screeningId}</p>
                <p className="text-xs text-slate-300 mt-2">Timestamp</p>
                <p className="text-xs text-slate-100">{infoTrackAML.timestamp}</p>
              </div>
            </div>

            {/* Sanctions Screening */}
            <div className="p-4 bg-white rounded-lg border border-white/10">
              <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-400" />
                Sanctions Screening (0 Matches)
              </h4>
              <div className="grid md:grid-cols-3 gap-2">
                {Object.entries(infoTrackAML.sanctionsScreening).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-green-500/10 rounded border border-green-500/30">
                    <span className="text-xs font-medium text-slate-100">
                      {key.toUpperCase().replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-green-400">{value.matches}</span>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PEP Screening */}
            <div className="p-4 bg-white rounded-lg border border-white/10">
              <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-400" />
                PEP Screening (0 Matches)
              </h4>
              <div className="grid md:grid-cols-2 gap-2">
                {Object.entries(infoTrackAML.pepScreening).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-green-500/10 rounded border border-green-500/30">
                    <span className="text-xs font-medium text-slate-100">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-green-400">{value.matches}</span>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adverse Media */}
            <div className="p-4 bg-white rounded-lg border border-white/10">
              <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                Adverse Media Screening (0 Articles)
              </h4>
              <div className="grid md:grid-cols-3 gap-2">
                {Object.entries(infoTrackAML.adverseMedia).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-green-500/10 rounded border border-green-500/30">
                    <span className="text-xs font-medium text-slate-100">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-green-400">{value.articles}</span>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Source of Funds/Wealth */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <h4 className="font-bold text-blue-300 mb-2">Source of Funds</h4>
                <p className="text-sm text-slate-100 mb-2">{infoTrackAML.sourceOfFunds.declared}</p>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-semibold text-green-400">Verified</span>
                </div>
                <p className="text-xs text-slate-300">
                  Supporting: {infoTrackAML.sourceOfFunds.supporting.join(', ')}
                </p>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <h4 className="font-bold text-blue-300 mb-2">Source of Wealth</h4>
                <p className="text-sm text-slate-100 mb-2">{infoTrackAML.sourceOfWealth.declared}</p>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-semibold text-green-400">Verified</span>
                </div>
                <p className="text-xs text-slate-300">
                  Supporting: {infoTrackAML.sourceOfWealth.supporting.join(', ')}
                </p>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download AML/CTF Screening Report
            </Button>
          </CardContent>
        )}
      </Card>

      {/* INFOTRACK CREDIT CHECK */}
      <Card className="border-2 border-orange-300">
        <CardHeader 
          className="cursor-pointer bg-orange-500/10 hover:bg-orange-500/15 transition-colors"
          onClick={() => toggleSection('infoTrackCredit')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-orange-400" />
              <div>
                <CardTitle className="text-lg">4. InfoTrack Credit Assessment (Equifax)</CardTitle>
                <p className="text-xs text-slate-300 mt-1">
                  Comprehensive Credit Reporting (CCR) with {infoTrackCredit.creditHistory} History
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded-full">
                SCORE: {infoTrackCredit.creditScore}
              </span>
              {expandedSections.infoTrackCredit ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.infoTrackCredit && (
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-orange-500/10 rounded-lg border-2 border-orange-300 text-center col-span-1">
                <p className="text-xs text-slate-300 mb-2">Credit Score</p>
                <p className="text-4xl font-bold text-orange-400">{infoTrackCredit.creditScore}</p>
                <p className="text-sm font-semibold text-orange-300 mt-2">{infoTrackCredit.scoreBand}</p>
                <p className="text-xs text-slate-300 mt-1">Range: {infoTrackCredit.scoreRange}</p>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 rounded border border-white/10">
                  <p className="text-xs text-slate-300 mb-1">Payment History</p>
                  <p className="text-lg font-bold text-green-400">{infoTrackCredit.paymentHistory.onTimePayments}</p>
                  <p className="text-xs text-slate-300">{infoTrackCredit.paymentHistory.latePayments} late payments</p>
                </div>
                <div className="p-3 bg-white/5 rounded border border-white/10">
                  <p className="text-xs text-slate-300 mb-1">Credit Utilization</p>
                  <p className="text-lg font-bold text-green-400">{infoTrackCredit.creditUtilization}</p>
                  <p className="text-xs text-slate-300">Well below threshold</p>
                </div>
                <div className="p-3 bg-white/5 rounded border border-white/10">
                  <p className="text-xs text-slate-300 mb-1">Active Accounts</p>
                  <p className="text-lg font-bold text-slate-100">{infoTrackCredit.creditAccounts.active}/{infoTrackCredit.creditAccounts.total}</p>
                  <p className="text-xs text-slate-300">{infoTrackCredit.creditAccounts.inDefault} in default</p>
                </div>
                <div className="p-3 bg-white/5 rounded border border-white/10">
                  <p className="text-xs text-slate-300 mb-1">Credit History</p>
                  <p className="text-lg font-bold text-slate-100">{infoTrackCredit.creditHistory}</p>
                  <p className="text-xs text-slate-300">Established</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-500/10 border-2 border-green-300 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-green-300 mb-2">✅ Strong Credit Profile</h4>
                  <ul className="space-y-1 text-xs text-green-300">
                    <li>✓ No defaults: {infoTrackCredit.paymentHistory.defaults}</li>
                    <li>✓ No court judgements: {infoTrackCredit.publicRecords.courtJudgements}</li>
                    <li>✓ No bankruptcies: {infoTrackCredit.publicRecords.bankruptcies}</li>
                    <li>✓ Credit enquiries: {infoTrackCredit.creditEnquiries.last12Months} in last 12 months ({infoTrackCredit.creditEnquiries.status})</li>
                    <li>✓ Total credit limit: ${infoTrackCredit.totalCreditLimit.toLocaleString()}</li>
                    <li>✓ Total balance: ${infoTrackCredit.totalBalance.toLocaleString()}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded border border-white/10">
              <p className="text-xs text-slate-300 mb-1">Risk Assessment</p>
              <p className="text-sm font-bold text-green-400">{infoTrackCredit.riskAssessment}</p>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Credit Bureau Report
            </Button>
          </CardContent>
        )}
      </Card>

      {/* DOCUMENT VERIFICATION */}
      <Card className="border-2 border-teal-300">
        <CardHeader 
          className="cursor-pointer bg-teal-500/10 hover:bg-teal-500/15 transition-colors"
          onClick={() => toggleSection('documentVerification')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Upload className="w-6 h-6 text-teal-400" />
              <div>
                <CardTitle className="text-lg">5. Document Verification Status</CardTitle>
                <p className="text-xs text-slate-300 mt-1">
                  Uploaded documents verified and cross-checked with third-party data
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded-full">
                {documentVerification.verified}/{documentVerification.totalDocuments} VERIFIED
              </span>
              {expandedSections.documentVerification ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.documentVerification && (
          <CardContent className="p-6 space-y-4">
            {documentVerification.documents.map((category, idx) => (
              <div key={idx} className="p-4 bg-white rounded-lg border border-white/10">
                <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-teal-400" />
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.items.map((doc, docIdx) => (
                    <div key={docIdx} className="flex items-center justify-between p-3 bg-teal-500/10 rounded border border-teal-500/30">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-100">{doc.name}</p>
                          <p className="text-xs text-slate-300">Verified by: {doc.source}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-300">{doc.matchStatus}</span>
                        <span className="px-2 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded">
                          ✓ Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* CROSS-CHECK VERIFICATION */}
      <Card className="border-2 border-indigo-300">
        <CardHeader 
          className="cursor-pointer bg-indigo-500/10 hover:bg-indigo-500/15 transition-colors"
          onClick={() => toggleSection('crossCheck')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-6 h-6 text-indigo-400" />
              <div>
                <CardTitle className="text-lg">6. Cross-Check Verification Results</CardTitle>
                <p className="text-xs text-slate-300 mt-1">
                  Data consistency verification across ASIC, InfoTrack, and uploaded documents
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded-full">
                {crossCheckResults.checks.filter(c => c.status === 'PASS').length}/{crossCheckResults.checks.length} PASSED
              </span>
              {expandedSections.crossCheck ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.crossCheck && (
          <CardContent className="p-6 space-y-4">
            <div className="p-4 bg-green-500/10 border-2 border-green-300 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <h4 className="font-bold text-green-300">{crossCheckResults.overallStatus}</h4>
                  <p className="text-sm text-green-300 mt-1">
                    All cross-verification checks passed. Data is consistent across all sources.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {crossCheckResults.checks.map((check, idx) => (
                <div key={idx} className="p-4 bg-white rounded-lg border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-bold text-slate-100">{check.check}</h5>
                        <p className="text-sm text-slate-300 mt-1">{check.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-300">{check.confidence}%</span>
                      <span className="px-2 py-1 bg-green-500/15 text-green-300 text-xs font-bold rounded">
                        {check.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {check.sources.map((source, sourceIdx) => (
                      <span key={sourceIdx} className="px-2 py-1 bg-indigo-500/10 text-indigo-300 text-xs rounded border border-indigo-500/30">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* COMPLIANCE STATUS */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
        <CardHeader 
          className="cursor-pointer hover:bg-green-500/15 transition-colors"
          onClick={() => toggleSection('complianceStatus')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-400" />
              <div>
                <CardTitle className="text-lg text-green-300">7. Compliance Status Summary</CardTitle>
                <p className="text-xs text-green-300 mt-1">
                  Australian Lending Compliance (NCCP Act 2009) & AUSTRAC AML/CTF Requirements
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                ✓ COMPLIANT
              </span>
              {expandedSections.complianceStatus ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
        {expandedSections.complianceStatus && (
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border-2 border-green-500/30">
                <h4 className="font-bold text-green-300 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  AUSTRAC AML/CTF Compliance
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Identity verification complete (100-point check)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Sanctions & PEP screening complete (CLEAR)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Source of funds/wealth verified
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Risk assessment: LOW RISK
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    No enhanced due diligence required
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-white rounded-lg border-2 border-green-500/30">
                <h4 className="font-bold text-green-300 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  NCCP Act 2009 Compliance
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Borrower identity verified (GreenID)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Financial capacity assessed (Equifax)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Company/entity structure verified (ASIC)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Supporting documents collected & verified
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Credit assessment complete (LOW RISK)
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-green-600 text-white rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-2">✅ Ready for Final Review & Approval</h4>
                  <p className="text-sm opacity-90">
                    All verification requirements have been met. Data from ASIC, InfoTrack (GreenID, WorldCheck, Equifax), 
                    and uploaded documents has been successfully gathered, verified, and cross-checked. No discrepancies 
                    or adverse findings. Case is ready for compliance officer final review and approval.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Complete Verification Package
              </Button>
              <Button variant="default" size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Proceed to Final Review
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
